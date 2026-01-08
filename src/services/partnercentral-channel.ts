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
  sdkId: "PartnerCentral Channel",
  serviceShapeName: "PartnerCentralChannel",
});
const auth = T.AwsAuthSigv4({ name: "partnercentral-channel" });
const ver = T.ServiceVersion("2024-03-18");
const proto = T.AwsProtocolsAwsJson1_0();
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
  const _p0 = () => ({
    authSchemes: [
      { name: "sigv4a", signingRegionSet: ["*"] },
      { name: "sigv4", signingRegion: "us-gov-west-1" },
    ],
  });
  const _p1 = (_0: unknown) => ({
    authSchemes: [
      { name: "sigv4a", signingRegionSet: ["*"] },
      {
        name: "sigv4",
        signingRegion: `${_.getAttr(_0, "implicitGlobalRegion")}`,
      },
    ],
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    return e(
      Endpoint,
      {
        authSchemes: [
          { name: "sigv4a", signingRegionSet: ["*"] },
          { name: "sigv4" },
        ],
      },
      {},
    );
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false
        ) {
          return e(
            `https://partnercentral-channel.us-gov.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            _p0(),
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true
        ) {
          return e(
            `https://partnercentral-channel-fips.us-gov.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            _p0(),
            {},
          );
        }
        if (UseFIPS === true) {
          return e(
            `https://partnercentral-channel-fips.global.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            _p1(PartitionResult),
            {},
          );
        }
        return e(
          `https://partnercentral-channel.global.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          _p1(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type TaggableArn = string;
export type TagKey = string;
export type Catalog = string;
export type AssociatedResourceIdentifier = string;
export type ClientToken = string;
export type NextToken = string;
export type ChannelHandshakeIdentifier = string;
export type ProgramManagementAccountDisplayName = string;
export type AccountId = string;
export type ProgramManagementAccountIdentifier = string;
export type Revision = string;
export type RelationshipDisplayName = string;
export type RelationshipIdentifier = string;
export type TagValue = string;
export type Note = string;
export type MinimumNoticeDays = string;
export type ChannelHandshakeId = string;
export type Arn = string;
export type ProgramManagementAccountId = string;
export type RelationshipId = string;
export type PartnerProfileDisplayName = string;
export type AssociatedResourceId = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type HandshakeType =
  | "START_SERVICE_PERIOD"
  | "REVOKE_SERVICE_PERIOD"
  | "PROGRAM_MANAGEMENT_ACCOUNT";
export const HandshakeType = S.Literal(
  "START_SERVICE_PERIOD",
  "REVOKE_SERVICE_PERIOD",
  "PROGRAM_MANAGEMENT_ACCOUNT",
);
export type ParticipantType = "SENDER" | "RECEIVER";
export const ParticipantType = S.Literal("SENDER", "RECEIVER");
export type HandshakeStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELED"
  | "EXPIRED";
export const HandshakeStatus = S.Literal(
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELED",
  "EXPIRED",
);
export type HandshakeStatusList = HandshakeStatus[];
export const HandshakeStatusList = S.Array(HandshakeStatus);
export type AssociatedResourceIdentifierList = string[];
export const AssociatedResourceIdentifierList = S.Array(S.String);
export type Program =
  | "SOLUTION_PROVIDER"
  | "DISTRIBUTION"
  | "DISTRIBUTION_SELLER";
export const Program = S.Literal(
  "SOLUTION_PROVIDER",
  "DISTRIBUTION",
  "DISTRIBUTION_SELLER",
);
export type ProgramManagementAccountDisplayNameList = string[];
export const ProgramManagementAccountDisplayNameList = S.Array(S.String);
export type ProgramList = Program[];
export const ProgramList = S.Array(Program);
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String);
export type ProgramManagementAccountStatus = "PENDING" | "ACTIVE" | "INACTIVE";
export const ProgramManagementAccountStatus = S.Literal(
  "PENDING",
  "ACTIVE",
  "INACTIVE",
);
export type ProgramManagementAccountStatusList =
  ProgramManagementAccountStatus[];
export const ProgramManagementAccountStatusList = S.Array(
  ProgramManagementAccountStatus,
);
export type AssociationType = "DOWNSTREAM_SELLER" | "END_CUSTOMER" | "INTERNAL";
export const AssociationType = S.Literal(
  "DOWNSTREAM_SELLER",
  "END_CUSTOMER",
  "INTERNAL",
);
export type ResaleAccountModel =
  | "DISTRIBUTOR"
  | "END_CUSTOMER"
  | "SOLUTION_PROVIDER";
export const ResaleAccountModel = S.Literal(
  "DISTRIBUTOR",
  "END_CUSTOMER",
  "SOLUTION_PROVIDER",
);
export type Sector = "COMMERCIAL" | "GOVERNMENT" | "GOVERNMENT_EXCEPTION";
export const Sector = S.Literal(
  "COMMERCIAL",
  "GOVERNMENT",
  "GOVERNMENT_EXCEPTION",
);
export type AssociationTypeList = AssociationType[];
export const AssociationTypeList = S.Array(AssociationType);
export type RelationshipDisplayNameList = string[];
export const RelationshipDisplayNameList = S.Array(S.String);
export type ProgramManagementAccountIdentifierList = string[];
export const ProgramManagementAccountIdentifierList = S.Array(S.String);
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListTagsForResource" }),
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
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UntagResource" }),
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
export interface AcceptChannelHandshakeRequest {
  catalog: string;
  identifier: string;
}
export const AcceptChannelHandshakeRequest = S.suspend(() =>
  S.Struct({ catalog: S.String, identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AcceptChannelHandshake" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptChannelHandshakeRequest",
}) as any as S.Schema<AcceptChannelHandshakeRequest>;
export interface CancelChannelHandshakeRequest {
  catalog: string;
  identifier: string;
}
export const CancelChannelHandshakeRequest = S.suspend(() =>
  S.Struct({ catalog: S.String, identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CancelChannelHandshake" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelChannelHandshakeRequest",
}) as any as S.Schema<CancelChannelHandshakeRequest>;
export interface RejectChannelHandshakeRequest {
  catalog: string;
  identifier: string;
}
export const RejectChannelHandshakeRequest = S.suspend(() =>
  S.Struct({ catalog: S.String, identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/RejectChannelHandshake" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectChannelHandshakeRequest",
}) as any as S.Schema<RejectChannelHandshakeRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateProgramManagementAccountRequest {
  catalog: string;
  program: Program;
  displayName: string;
  accountId: string;
  clientToken?: string;
  tags?: Tag[];
}
export const CreateProgramManagementAccountRequest = S.suspend(() =>
  S.Struct({
    catalog: S.String,
    program: Program,
    displayName: S.String,
    accountId: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateProgramManagementAccount" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProgramManagementAccountRequest",
}) as any as S.Schema<CreateProgramManagementAccountRequest>;
export interface UpdateProgramManagementAccountRequest {
  catalog: string;
  identifier: string;
  revision?: string;
  displayName?: string;
}
export const UpdateProgramManagementAccountRequest = S.suspend(() =>
  S.Struct({
    catalog: S.String,
    identifier: S.String,
    revision: S.optional(S.String),
    displayName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateProgramManagementAccount" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProgramManagementAccountRequest",
}) as any as S.Schema<UpdateProgramManagementAccountRequest>;
export interface DeleteProgramManagementAccountRequest {
  catalog: string;
  identifier: string;
  clientToken?: string;
}
export const DeleteProgramManagementAccountRequest = S.suspend(() =>
  S.Struct({
    catalog: S.String,
    identifier: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteProgramManagementAccount" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProgramManagementAccountRequest",
}) as any as S.Schema<DeleteProgramManagementAccountRequest>;
export interface DeleteProgramManagementAccountResponse {}
export const DeleteProgramManagementAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProgramManagementAccountResponse",
}) as any as S.Schema<DeleteProgramManagementAccountResponse>;
export interface GetRelationshipRequest {
  catalog: string;
  programManagementAccountIdentifier: string;
  identifier: string;
}
export const GetRelationshipRequest = S.suspend(() =>
  S.Struct({
    catalog: S.String,
    programManagementAccountIdentifier: S.String,
    identifier: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetRelationship" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRelationshipRequest",
}) as any as S.Schema<GetRelationshipRequest>;
export type Coverage = "ENTIRE_ORGANIZATION" | "MANAGEMENT_ACCOUNT_ONLY";
export const Coverage = S.Literal(
  "ENTIRE_ORGANIZATION",
  "MANAGEMENT_ACCOUNT_ONLY",
);
export interface ResoldBusiness {
  coverage: Coverage;
}
export const ResoldBusiness = S.suspend(() =>
  S.Struct({ coverage: Coverage }),
).annotations({
  identifier: "ResoldBusiness",
}) as any as S.Schema<ResoldBusiness>;
export interface ResoldEnterprise {
  coverage: Coverage;
  tamLocation: string;
  chargeAccountId?: string;
}
export const ResoldEnterprise = S.suspend(() =>
  S.Struct({
    coverage: Coverage,
    tamLocation: S.String,
    chargeAccountId: S.optional(S.String),
  }),
).annotations({
  identifier: "ResoldEnterprise",
}) as any as S.Schema<ResoldEnterprise>;
export type Provider = "DISTRIBUTOR" | "DISTRIBUTION_SELLER";
export const Provider = S.Literal("DISTRIBUTOR", "DISTRIBUTION_SELLER");
export interface PartnerLedSupport {
  coverage: Coverage;
  provider?: Provider;
  tamLocation: string;
}
export const PartnerLedSupport = S.suspend(() =>
  S.Struct({
    coverage: Coverage,
    provider: S.optional(Provider),
    tamLocation: S.String,
  }),
).annotations({
  identifier: "PartnerLedSupport",
}) as any as S.Schema<PartnerLedSupport>;
export type SupportPlan =
  | { resoldBusiness: ResoldBusiness }
  | { resoldEnterprise: ResoldEnterprise }
  | { partnerLedSupport: PartnerLedSupport };
export const SupportPlan = S.Union(
  S.Struct({ resoldBusiness: ResoldBusiness }),
  S.Struct({ resoldEnterprise: ResoldEnterprise }),
  S.Struct({ partnerLedSupport: PartnerLedSupport }),
);
export interface UpdateRelationshipRequest {
  catalog: string;
  identifier: string;
  programManagementAccountIdentifier: string;
  revision?: string;
  displayName?: string;
  requestedSupportPlan?: SupportPlan;
}
export const UpdateRelationshipRequest = S.suspend(() =>
  S.Struct({
    catalog: S.String,
    identifier: S.String,
    programManagementAccountIdentifier: S.String,
    revision: S.optional(S.String),
    displayName: S.optional(S.String),
    requestedSupportPlan: S.optional(SupportPlan),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateRelationship" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRelationshipRequest",
}) as any as S.Schema<UpdateRelationshipRequest>;
export interface DeleteRelationshipRequest {
  catalog: string;
  identifier: string;
  programManagementAccountIdentifier: string;
  clientToken?: string;
}
export const DeleteRelationshipRequest = S.suspend(() =>
  S.Struct({
    catalog: S.String,
    identifier: S.String,
    programManagementAccountIdentifier: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteRelationship" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRelationshipRequest",
}) as any as S.Schema<DeleteRelationshipRequest>;
export interface DeleteRelationshipResponse {}
export const DeleteRelationshipResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRelationshipResponse",
}) as any as S.Schema<DeleteRelationshipResponse>;
export type SortOrder = "Ascending" | "Descending";
export const SortOrder = S.Literal("Ascending", "Descending");
export type ListProgramManagementAccountsSortName = "UpdatedAt";
export const ListProgramManagementAccountsSortName = S.Literal("UpdatedAt");
export type ListRelationshipsSortName = "UpdatedAt";
export const ListRelationshipsSortName = S.Literal("UpdatedAt");
export interface ListProgramManagementAccountsSortBase {
  sortOrder: SortOrder;
  sortBy: ListProgramManagementAccountsSortName;
}
export const ListProgramManagementAccountsSortBase = S.suspend(() =>
  S.Struct({
    sortOrder: SortOrder,
    sortBy: ListProgramManagementAccountsSortName,
  }),
).annotations({
  identifier: "ListProgramManagementAccountsSortBase",
}) as any as S.Schema<ListProgramManagementAccountsSortBase>;
export interface ListRelationshipsSortBase {
  sortOrder: SortOrder;
  sortBy: ListRelationshipsSortName;
}
export const ListRelationshipsSortBase = S.suspend(() =>
  S.Struct({ sortOrder: SortOrder, sortBy: ListRelationshipsSortName }),
).annotations({
  identifier: "ListRelationshipsSortBase",
}) as any as S.Schema<ListRelationshipsSortBase>;
export type ServicePeriodType =
  | "MINIMUM_NOTICE_PERIOD"
  | "FIXED_COMMITMENT_PERIOD";
export const ServicePeriodType = S.Literal(
  "MINIMUM_NOTICE_PERIOD",
  "FIXED_COMMITMENT_PERIOD",
);
export type ServicePeriodTypeList = ServicePeriodType[];
export const ServicePeriodTypeList = S.Array(ServicePeriodType);
export type StartServicePeriodTypeSortName = "UpdatedAt";
export const StartServicePeriodTypeSortName = S.Literal("UpdatedAt");
export type RevokeServicePeriodTypeSortName = "UpdatedAt";
export const RevokeServicePeriodTypeSortName = S.Literal("UpdatedAt");
export type ProgramManagementAccountTypeSortName = "UpdatedAt";
export const ProgramManagementAccountTypeSortName = S.Literal("UpdatedAt");
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TagResource" }),
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
export interface ListProgramManagementAccountsRequest {
  catalog: string;
  maxResults?: number;
  displayNames?: string[];
  programs?: Program[];
  accountIds?: string[];
  statuses?: ProgramManagementAccountStatus[];
  sort?: ListProgramManagementAccountsSortBase;
  nextToken?: string;
}
export const ListProgramManagementAccountsRequest = S.suspend(() =>
  S.Struct({
    catalog: S.String,
    maxResults: S.optional(S.Number),
    displayNames: S.optional(ProgramManagementAccountDisplayNameList),
    programs: S.optional(ProgramList),
    accountIds: S.optional(AccountIdList),
    statuses: S.optional(ProgramManagementAccountStatusList),
    sort: S.optional(ListProgramManagementAccountsSortBase),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListProgramManagementAccounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProgramManagementAccountsRequest",
}) as any as S.Schema<ListProgramManagementAccountsRequest>;
export interface ListRelationshipsRequest {
  catalog: string;
  maxResults?: number;
  associatedAccountIds?: string[];
  associationTypes?: AssociationType[];
  displayNames?: string[];
  programManagementAccountIdentifiers?: string[];
  sort?: ListRelationshipsSortBase;
  nextToken?: string;
}
export const ListRelationshipsRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListRelationships" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRelationshipsRequest",
}) as any as S.Schema<ListRelationshipsRequest>;
export interface StartServicePeriodPayload {
  programManagementAccountIdentifier: string;
  note?: string;
  servicePeriodType: ServicePeriodType;
  minimumNoticeDays?: string;
  endDate?: Date;
}
export const StartServicePeriodPayload = S.suspend(() =>
  S.Struct({
    programManagementAccountIdentifier: S.String,
    note: S.optional(S.String),
    servicePeriodType: ServicePeriodType,
    minimumNoticeDays: S.optional(S.String),
    endDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StartServicePeriodPayload",
}) as any as S.Schema<StartServicePeriodPayload>;
export interface RevokeServicePeriodPayload {
  programManagementAccountIdentifier: string;
  note?: string;
}
export const RevokeServicePeriodPayload = S.suspend(() =>
  S.Struct({
    programManagementAccountIdentifier: S.String,
    note: S.optional(S.String),
  }),
).annotations({
  identifier: "RevokeServicePeriodPayload",
}) as any as S.Schema<RevokeServicePeriodPayload>;
export interface StartServicePeriodTypeFilters {
  servicePeriodTypes?: ServicePeriodType[];
}
export const StartServicePeriodTypeFilters = S.suspend(() =>
  S.Struct({ servicePeriodTypes: S.optional(ServicePeriodTypeList) }),
).annotations({
  identifier: "StartServicePeriodTypeFilters",
}) as any as S.Schema<StartServicePeriodTypeFilters>;
export interface RevokeServicePeriodTypeFilters {
  servicePeriodTypes?: ServicePeriodType[];
}
export const RevokeServicePeriodTypeFilters = S.suspend(() =>
  S.Struct({ servicePeriodTypes: S.optional(ServicePeriodTypeList) }),
).annotations({
  identifier: "RevokeServicePeriodTypeFilters",
}) as any as S.Schema<RevokeServicePeriodTypeFilters>;
export interface ProgramManagementAccountTypeFilters {
  programs?: Program[];
}
export const ProgramManagementAccountTypeFilters = S.suspend(() =>
  S.Struct({ programs: S.optional(ProgramList) }),
).annotations({
  identifier: "ProgramManagementAccountTypeFilters",
}) as any as S.Schema<ProgramManagementAccountTypeFilters>;
export interface StartServicePeriodTypeSort {
  sortOrder: SortOrder;
  sortBy: StartServicePeriodTypeSortName;
}
export const StartServicePeriodTypeSort = S.suspend(() =>
  S.Struct({ sortOrder: SortOrder, sortBy: StartServicePeriodTypeSortName }),
).annotations({
  identifier: "StartServicePeriodTypeSort",
}) as any as S.Schema<StartServicePeriodTypeSort>;
export interface RevokeServicePeriodTypeSort {
  sortOrder: SortOrder;
  sortBy: RevokeServicePeriodTypeSortName;
}
export const RevokeServicePeriodTypeSort = S.suspend(() =>
  S.Struct({ sortOrder: SortOrder, sortBy: RevokeServicePeriodTypeSortName }),
).annotations({
  identifier: "RevokeServicePeriodTypeSort",
}) as any as S.Schema<RevokeServicePeriodTypeSort>;
export interface ProgramManagementAccountTypeSort {
  sortOrder: SortOrder;
  sortBy: ProgramManagementAccountTypeSortName;
}
export const ProgramManagementAccountTypeSort = S.suspend(() =>
  S.Struct({
    sortOrder: SortOrder,
    sortBy: ProgramManagementAccountTypeSortName,
  }),
).annotations({
  identifier: "ProgramManagementAccountTypeSort",
}) as any as S.Schema<ProgramManagementAccountTypeSort>;
export type ChannelHandshakePayload =
  | { startServicePeriodPayload: StartServicePeriodPayload }
  | { revokeServicePeriodPayload: RevokeServicePeriodPayload };
export const ChannelHandshakePayload = S.Union(
  S.Struct({ startServicePeriodPayload: StartServicePeriodPayload }),
  S.Struct({ revokeServicePeriodPayload: RevokeServicePeriodPayload }),
);
export type ListChannelHandshakesTypeFilters =
  | { startServicePeriodTypeFilters: StartServicePeriodTypeFilters }
  | { revokeServicePeriodTypeFilters: RevokeServicePeriodTypeFilters }
  | {
      programManagementAccountTypeFilters: ProgramManagementAccountTypeFilters;
    };
export const ListChannelHandshakesTypeFilters = S.Union(
  S.Struct({ startServicePeriodTypeFilters: StartServicePeriodTypeFilters }),
  S.Struct({ revokeServicePeriodTypeFilters: RevokeServicePeriodTypeFilters }),
  S.Struct({
    programManagementAccountTypeFilters: ProgramManagementAccountTypeFilters,
  }),
);
export type ListChannelHandshakesTypeSort =
  | { startServicePeriodTypeSort: StartServicePeriodTypeSort }
  | { revokeServicePeriodTypeSort: RevokeServicePeriodTypeSort }
  | { programManagementAccountTypeSort: ProgramManagementAccountTypeSort };
export const ListChannelHandshakesTypeSort = S.Union(
  S.Struct({ startServicePeriodTypeSort: StartServicePeriodTypeSort }),
  S.Struct({ revokeServicePeriodTypeSort: RevokeServicePeriodTypeSort }),
  S.Struct({
    programManagementAccountTypeSort: ProgramManagementAccountTypeSort,
  }),
);
export interface AcceptChannelHandshakeDetail {
  id?: string;
  arn?: string;
  status?: HandshakeStatus;
}
export const AcceptChannelHandshakeDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    status: S.optional(HandshakeStatus),
  }),
).annotations({
  identifier: "AcceptChannelHandshakeDetail",
}) as any as S.Schema<AcceptChannelHandshakeDetail>;
export interface CancelChannelHandshakeDetail {
  id?: string;
  arn?: string;
  status?: HandshakeStatus;
}
export const CancelChannelHandshakeDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    status: S.optional(HandshakeStatus),
  }),
).annotations({
  identifier: "CancelChannelHandshakeDetail",
}) as any as S.Schema<CancelChannelHandshakeDetail>;
export interface RejectChannelHandshakeDetail {
  id?: string;
  arn?: string;
  status?: HandshakeStatus;
}
export const RejectChannelHandshakeDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    status: S.optional(HandshakeStatus),
  }),
).annotations({
  identifier: "RejectChannelHandshakeDetail",
}) as any as S.Schema<RejectChannelHandshakeDetail>;
export interface CreateProgramManagementAccountDetail {
  id?: string;
  arn?: string;
}
export const CreateProgramManagementAccountDetail = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateProgramManagementAccountDetail",
}) as any as S.Schema<CreateProgramManagementAccountDetail>;
export interface UpdateProgramManagementAccountDetail {
  id?: string;
  arn?: string;
  revision?: string;
  displayName?: string;
}
export const UpdateProgramManagementAccountDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    revision: S.optional(S.String),
    displayName: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateProgramManagementAccountDetail",
}) as any as S.Schema<UpdateProgramManagementAccountDetail>;
export interface RelationshipDetail {
  arn?: string;
  id?: string;
  revision?: string;
  catalog?: string;
  associationType?: AssociationType;
  programManagementAccountId?: string;
  associatedAccountId?: string;
  displayName?: string;
  resaleAccountModel?: ResaleAccountModel;
  sector?: Sector;
  createdAt?: Date;
  updatedAt?: Date;
  startDate?: Date;
}
export const RelationshipDetail = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    revision: S.optional(S.String),
    catalog: S.optional(S.String),
    associationType: S.optional(AssociationType),
    programManagementAccountId: S.optional(S.String),
    associatedAccountId: S.optional(S.String),
    displayName: S.optional(S.String),
    resaleAccountModel: S.optional(ResaleAccountModel),
    sector: S.optional(Sector),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "RelationshipDetail",
}) as any as S.Schema<RelationshipDetail>;
export interface UpdateRelationshipDetail {
  arn?: string;
  id?: string;
  revision?: string;
  displayName?: string;
}
export const UpdateRelationshipDetail = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    revision: S.optional(S.String),
    displayName: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateRelationshipDetail",
}) as any as S.Schema<UpdateRelationshipDetail>;
export interface CreateChannelHandshakeRequest {
  handshakeType: HandshakeType;
  catalog: string;
  associatedResourceIdentifier: string;
  payload?: ChannelHandshakePayload;
  clientToken?: string;
  tags?: Tag[];
}
export const CreateChannelHandshakeRequest = S.suspend(() =>
  S.Struct({
    handshakeType: HandshakeType,
    catalog: S.String,
    associatedResourceIdentifier: S.String,
    payload: S.optional(ChannelHandshakePayload),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateChannelHandshake" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelHandshakeRequest",
}) as any as S.Schema<CreateChannelHandshakeRequest>;
export interface ListChannelHandshakesRequest {
  handshakeType: HandshakeType;
  catalog: string;
  participantType: ParticipantType;
  maxResults?: number;
  statuses?: HandshakeStatus[];
  associatedResourceIdentifiers?: string[];
  handshakeTypeFilters?: ListChannelHandshakesTypeFilters;
  handshakeTypeSort?: ListChannelHandshakesTypeSort;
  nextToken?: string;
}
export const ListChannelHandshakesRequest = S.suspend(() =>
  S.Struct({
    handshakeType: HandshakeType,
    catalog: S.String,
    participantType: ParticipantType,
    maxResults: S.optional(S.Number),
    statuses: S.optional(HandshakeStatusList),
    associatedResourceIdentifiers: S.optional(AssociatedResourceIdentifierList),
    handshakeTypeFilters: S.optional(ListChannelHandshakesTypeFilters),
    handshakeTypeSort: S.optional(ListChannelHandshakesTypeSort),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListChannelHandshakes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelHandshakesRequest",
}) as any as S.Schema<ListChannelHandshakesRequest>;
export interface AcceptChannelHandshakeResponse {
  channelHandshakeDetail?: AcceptChannelHandshakeDetail;
}
export const AcceptChannelHandshakeResponse = S.suspend(() =>
  S.Struct({
    channelHandshakeDetail: S.optional(AcceptChannelHandshakeDetail),
  }),
).annotations({
  identifier: "AcceptChannelHandshakeResponse",
}) as any as S.Schema<AcceptChannelHandshakeResponse>;
export interface CancelChannelHandshakeResponse {
  channelHandshakeDetail?: CancelChannelHandshakeDetail;
}
export const CancelChannelHandshakeResponse = S.suspend(() =>
  S.Struct({
    channelHandshakeDetail: S.optional(CancelChannelHandshakeDetail),
  }),
).annotations({
  identifier: "CancelChannelHandshakeResponse",
}) as any as S.Schema<CancelChannelHandshakeResponse>;
export interface RejectChannelHandshakeResponse {
  channelHandshakeDetail?: RejectChannelHandshakeDetail;
}
export const RejectChannelHandshakeResponse = S.suspend(() =>
  S.Struct({
    channelHandshakeDetail: S.optional(RejectChannelHandshakeDetail),
  }),
).annotations({
  identifier: "RejectChannelHandshakeResponse",
}) as any as S.Schema<RejectChannelHandshakeResponse>;
export interface CreateProgramManagementAccountResponse {
  programManagementAccountDetail?: CreateProgramManagementAccountDetail;
}
export const CreateProgramManagementAccountResponse = S.suspend(() =>
  S.Struct({
    programManagementAccountDetail: S.optional(
      CreateProgramManagementAccountDetail,
    ),
  }),
).annotations({
  identifier: "CreateProgramManagementAccountResponse",
}) as any as S.Schema<CreateProgramManagementAccountResponse>;
export interface UpdateProgramManagementAccountResponse {
  programManagementAccountDetail?: UpdateProgramManagementAccountDetail;
}
export const UpdateProgramManagementAccountResponse = S.suspend(() =>
  S.Struct({
    programManagementAccountDetail: S.optional(
      UpdateProgramManagementAccountDetail,
    ),
  }),
).annotations({
  identifier: "UpdateProgramManagementAccountResponse",
}) as any as S.Schema<UpdateProgramManagementAccountResponse>;
export interface CreateRelationshipRequest {
  catalog: string;
  associationType: AssociationType;
  programManagementAccountIdentifier: string;
  associatedAccountId: string;
  displayName: string;
  resaleAccountModel?: ResaleAccountModel;
  sector: Sector;
  clientToken?: string;
  tags?: Tag[];
  requestedSupportPlan?: SupportPlan;
}
export const CreateRelationshipRequest = S.suspend(() =>
  S.Struct({
    catalog: S.String,
    associationType: AssociationType,
    programManagementAccountIdentifier: S.String,
    associatedAccountId: S.String,
    displayName: S.String,
    resaleAccountModel: S.optional(ResaleAccountModel),
    sector: Sector,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    tags: S.optional(TagList),
    requestedSupportPlan: S.optional(SupportPlan),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateRelationship" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRelationshipRequest",
}) as any as S.Schema<CreateRelationshipRequest>;
export interface GetRelationshipResponse {
  relationshipDetail?: RelationshipDetail;
}
export const GetRelationshipResponse = S.suspend(() =>
  S.Struct({ relationshipDetail: S.optional(RelationshipDetail) }),
).annotations({
  identifier: "GetRelationshipResponse",
}) as any as S.Schema<GetRelationshipResponse>;
export interface UpdateRelationshipResponse {
  relationshipDetail?: UpdateRelationshipDetail;
}
export const UpdateRelationshipResponse = S.suspend(() =>
  S.Struct({ relationshipDetail: S.optional(UpdateRelationshipDetail) }),
).annotations({
  identifier: "UpdateRelationshipResponse",
}) as any as S.Schema<UpdateRelationshipResponse>;
export interface ProgramManagementAccountSummary {
  id?: string;
  revision?: string;
  catalog?: string;
  program?: Program;
  displayName?: string;
  accountId?: string;
  arn?: string;
  createdAt?: Date;
  updatedAt?: Date;
  startDate?: Date;
  status?: ProgramManagementAccountStatus;
}
export const ProgramManagementAccountSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    revision: S.optional(S.String),
    catalog: S.optional(S.String),
    program: S.optional(Program),
    displayName: S.optional(S.String),
    accountId: S.optional(S.String),
    arn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    status: S.optional(ProgramManagementAccountStatus),
  }),
).annotations({
  identifier: "ProgramManagementAccountSummary",
}) as any as S.Schema<ProgramManagementAccountSummary>;
export type ProgramManagementAccountSummaries =
  ProgramManagementAccountSummary[];
export const ProgramManagementAccountSummaries = S.Array(
  ProgramManagementAccountSummary,
);
export interface RelationshipSummary {
  arn?: string;
  id?: string;
  revision?: string;
  catalog?: string;
  associationType?: AssociationType;
  programManagementAccountId?: string;
  associatedAccountId?: string;
  displayName?: string;
  sector?: Sector;
  createdAt?: Date;
  updatedAt?: Date;
  startDate?: Date;
}
export const RelationshipSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    id: S.optional(S.String),
    revision: S.optional(S.String),
    catalog: S.optional(S.String),
    associationType: S.optional(AssociationType),
    programManagementAccountId: S.optional(S.String),
    associatedAccountId: S.optional(S.String),
    displayName: S.optional(S.String),
    sector: S.optional(Sector),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "RelationshipSummary",
}) as any as S.Schema<RelationshipSummary>;
export type RelationshipSummaries = RelationshipSummary[];
export const RelationshipSummaries = S.Array(RelationshipSummary);
export interface ListProgramManagementAccountsResponse {
  items?: ProgramManagementAccountSummary[];
  nextToken?: string;
}
export const ListProgramManagementAccountsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(ProgramManagementAccountSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProgramManagementAccountsResponse",
}) as any as S.Schema<ListProgramManagementAccountsResponse>;
export interface ListRelationshipsResponse {
  items?: RelationshipSummary[];
  nextToken?: string;
}
export const ListRelationshipsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(RelationshipSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRelationshipsResponse",
}) as any as S.Schema<ListRelationshipsResponse>;
export interface CreateChannelHandshakeDetail {
  id?: string;
  arn?: string;
}
export const CreateChannelHandshakeDetail = S.suspend(() =>
  S.Struct({ id: S.optional(S.String), arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateChannelHandshakeDetail",
}) as any as S.Schema<CreateChannelHandshakeDetail>;
export interface CreateRelationshipDetail {
  arn?: string;
  id?: string;
}
export const CreateRelationshipDetail = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String), id: S.optional(S.String) }),
).annotations({
  identifier: "CreateRelationshipDetail",
}) as any as S.Schema<CreateRelationshipDetail>;
export interface CreateChannelHandshakeResponse {
  channelHandshakeDetail?: CreateChannelHandshakeDetail;
}
export const CreateChannelHandshakeResponse = S.suspend(() =>
  S.Struct({
    channelHandshakeDetail: S.optional(CreateChannelHandshakeDetail),
  }),
).annotations({
  identifier: "CreateChannelHandshakeResponse",
}) as any as S.Schema<CreateChannelHandshakeResponse>;
export interface CreateRelationshipResponse {
  relationshipDetail?: CreateRelationshipDetail;
}
export const CreateRelationshipResponse = S.suspend(() =>
  S.Struct({ relationshipDetail: S.optional(CreateRelationshipDetail) }),
).annotations({
  identifier: "CreateRelationshipResponse",
}) as any as S.Schema<CreateRelationshipResponse>;
export type ValidationExceptionReason =
  | "REQUEST_VALIDATION_FAILED"
  | "BUSINESS_VALIDATION_FAILED";
export const ValidationExceptionReason = S.Literal(
  "REQUEST_VALIDATION_FAILED",
  "BUSINESS_VALIDATION_FAILED",
);
export interface StartServicePeriodHandshakeDetail {
  note?: string;
  servicePeriodType?: ServicePeriodType;
  minimumNoticeDays?: string;
  startDate?: Date;
  endDate?: Date;
}
export const StartServicePeriodHandshakeDetail = S.suspend(() =>
  S.Struct({
    note: S.optional(S.String),
    servicePeriodType: S.optional(ServicePeriodType),
    minimumNoticeDays: S.optional(S.String),
    startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "StartServicePeriodHandshakeDetail",
}) as any as S.Schema<StartServicePeriodHandshakeDetail>;
export interface RevokeServicePeriodHandshakeDetail {
  note?: string;
  servicePeriodType?: ServicePeriodType;
  minimumNoticeDays?: string;
  startDate?: Date;
  endDate?: Date;
}
export const RevokeServicePeriodHandshakeDetail = S.suspend(() =>
  S.Struct({
    note: S.optional(S.String),
    servicePeriodType: S.optional(ServicePeriodType),
    minimumNoticeDays: S.optional(S.String),
    startDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "RevokeServicePeriodHandshakeDetail",
}) as any as S.Schema<RevokeServicePeriodHandshakeDetail>;
export interface ProgramManagementAccountHandshakeDetail {
  program?: Program;
}
export const ProgramManagementAccountHandshakeDetail = S.suspend(() =>
  S.Struct({ program: S.optional(Program) }),
).annotations({
  identifier: "ProgramManagementAccountHandshakeDetail",
}) as any as S.Schema<ProgramManagementAccountHandshakeDetail>;
export type HandshakeDetail =
  | { startServicePeriodHandshakeDetail: StartServicePeriodHandshakeDetail }
  | { revokeServicePeriodHandshakeDetail: RevokeServicePeriodHandshakeDetail }
  | {
      programManagementAccountHandshakeDetail: ProgramManagementAccountHandshakeDetail;
    };
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
export interface ChannelHandshakeSummary {
  id?: string;
  arn?: string;
  catalog?: string;
  handshakeType?: HandshakeType;
  ownerAccountId?: string;
  senderAccountId?: string;
  senderDisplayName?: string;
  receiverAccountId?: string;
  associatedResourceId?: string;
  detail?: HandshakeDetail;
  createdAt?: Date;
  updatedAt?: Date;
  status?: HandshakeStatus;
}
export const ChannelHandshakeSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    catalog: S.optional(S.String),
    handshakeType: S.optional(HandshakeType),
    ownerAccountId: S.optional(S.String),
    senderAccountId: S.optional(S.String),
    senderDisplayName: S.optional(S.String),
    receiverAccountId: S.optional(S.String),
    associatedResourceId: S.optional(S.String),
    detail: S.optional(HandshakeDetail),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    status: S.optional(HandshakeStatus),
  }),
).annotations({
  identifier: "ChannelHandshakeSummary",
}) as any as S.Schema<ChannelHandshakeSummary>;
export type ChannelHandshakeSummaries = ChannelHandshakeSummary[];
export const ChannelHandshakeSummaries = S.Array(ChannelHandshakeSummary);
export interface ValidationExceptionField {
  name: string;
  code: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, code: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface ListChannelHandshakesResponse {
  items?: ChannelHandshakeSummary[];
  nextToken?: string;
}
export const ListChannelHandshakesResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(ChannelHandshakeSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListChannelHandshakesResponse",
}) as any as S.Schema<ListChannelHandshakesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String, reason: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    quotaCode: S.String,
  },
  T.Retryable(),
).pipe(C.withQuotaError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: ValidationExceptionReason,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists tags associated with a specific resource.
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
 * Creates a new program management account for managing partner relationships.
 */
export const createProgramManagementAccount: (
  input: CreateProgramManagementAccountRequest,
) => effect.Effect<
  CreateProgramManagementAccountResponse,
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
export const deleteProgramManagementAccount: (
  input: DeleteProgramManagementAccountRequest,
) => effect.Effect<
  DeleteProgramManagementAccountResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRelationship: (
  input: DeleteRelationshipRequest,
) => effect.Effect<
  DeleteRelationshipResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ConflictException
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ConflictException
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
export const acceptChannelHandshake: (
  input: AcceptChannelHandshakeRequest,
) => effect.Effect<
  AcceptChannelHandshakeResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptChannelHandshakeRequest,
  output: AcceptChannelHandshakeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels a pending channel handshake request.
 */
export const cancelChannelHandshake: (
  input: CancelChannelHandshakeRequest,
) => effect.Effect<
  CancelChannelHandshakeResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelChannelHandshakeRequest,
  output: CancelChannelHandshakeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Rejects a pending channel handshake request.
 */
export const rejectChannelHandshake: (
  input: RejectChannelHandshakeRequest,
) => effect.Effect<
  RejectChannelHandshakeResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectChannelHandshakeRequest,
  output: RejectChannelHandshakeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the properties of a program management account.
 */
export const updateProgramManagementAccount: (
  input: UpdateProgramManagementAccountRequest,
) => effect.Effect<
  UpdateProgramManagementAccountResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRelationship: (
  input: GetRelationshipRequest,
) => effect.Effect<
  GetRelationshipResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRelationship: (
  input: UpdateRelationshipRequest,
) => effect.Effect<
  UpdateRelationshipResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listProgramManagementAccounts: {
  (
    input: ListProgramManagementAccountsRequest,
  ): effect.Effect<
    ListProgramManagementAccountsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProgramManagementAccountsRequest,
  ) => stream.Stream<
    ListProgramManagementAccountsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProgramManagementAccountsRequest,
  ) => stream.Stream<
    ProgramManagementAccountSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listRelationships: {
  (
    input: ListRelationshipsRequest,
  ): effect.Effect<
    ListRelationshipsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRelationshipsRequest,
  ) => stream.Stream<
    ListRelationshipsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRelationshipsRequest,
  ) => stream.Stream<
    RelationshipSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Creates a new channel handshake request to establish a partnership with another AWS account.
 */
export const createChannelHandshake: (
  input: CreateChannelHandshakeRequest,
) => effect.Effect<
  CreateChannelHandshakeResponse,
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
}));
/**
 * Creates a new partner relationship between accounts.
 */
export const createRelationship: (
  input: CreateRelationshipRequest,
) => effect.Effect<
  CreateRelationshipResponse,
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
export const listChannelHandshakes: {
  (
    input: ListChannelHandshakesRequest,
  ): effect.Effect<
    ListChannelHandshakesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelHandshakesRequest,
  ) => stream.Stream<
    ListChannelHandshakesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelHandshakesRequest,
  ) => stream.Stream<
    ChannelHandshakeSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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

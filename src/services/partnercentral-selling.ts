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
  sdkId: "PartnerCentral Selling",
  serviceShapeName: "AWSPartnerCentralSelling",
});
const auth = T.AwsAuthSigv4({ name: "partnercentral-selling" });
const ver = T.ServiceVersion("2022-07-26");
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
                    url: "https://partnercentral-selling-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://partnercentral-selling.{Region}.{PartitionResult#dualStackDnsSuffix}",
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

//# Newtypes
export type CatalogIdentifier = string;
export type EngagementArnOrIdentifier = string;
export type ClientToken = string;
export type TaggableResourceArn = string;
export type ResourceSnapshotJobRoleIdentifier = string;
export type TagKey = string;
export type EngagementContextIdentifier = string;
export type EngagementTitle = string;
export type EngagementDescription = string;
export type AwsAccount = string | Redacted.Redacted<string>;
export type EngagementPageSize = number;
export type MemberPageSize = number;
export type EngagementInvitationArnOrIdentifier = string;
export type OpportunityIdentifier = string;
export type TaskArnOrIdentifier = string;
export type EngagementIdentifier = string;
export type PageSize = number;
export type RejectionReasonString = string;
export type ContextIdentifier = string;
export type ResourceIdentifier = string;
export type ResourceTemplateName = string;
export type ResourceSnapshotRevision = number;
export type ResourceSnapshotJobIdentifier = string;
export type SolutionIdentifier = string;
export type TagValue = string;
export type InvitationMessage = string | Redacted.Redacted<string>;
export type PiiString = string | Redacted.Redacted<string>;
export type Email = string | Redacted.Redacted<string>;
export type Name = string | Redacted.Redacted<string>;
export type JobTitle = string | Redacted.Redacted<string>;
export type PhoneNumber = string | Redacted.Redacted<string>;
export type ResourceSnapshotJobRoleArn = string;
export type EngagementArn = string;
export type TaskIdentifier = string;
export type TaskArn = string;
export type EngagementInvitationIdentifier = string;
export type OpportunityArn = string;
export type ResourceArn = string;
export type ResourceSnapshotJobArn = string;
export type LeadQualificationStatus = string;
export type WebsiteUrl = string | Redacted.Redacted<string>;
export type DunsNumber = string | Redacted.Redacted<string>;
export type Amount = string | Redacted.Redacted<string>;
export type EstimationUrl = string;
export type MemberCompanyName = string | Redacted.Redacted<string>;
export type AwsMarketplaceOfferIdentifier = string;
export type AwsMarketplaceOfferSetIdentifier = string;
export type AwsProductIdentifier = string;
export type ResourceSnapshotArn = string;
export type CompanyName = string | Redacted.Redacted<string>;
export type CompanyWebsiteUrl = string | Redacted.Redacted<string>;
export type EngagementCustomerProjectTitle = string;
export type EngagementCustomerBusinessProblem =
  | string
  | Redacted.Redacted<string>;
export type AwsMaturity = string;
export type LeadSourceType = string;
export type LeadSourceId = string;
export type LeadSourceName = string;
export type EngagementUseCase = string;
export type CustomerAction = string;
export type Alias = string | Redacted.Redacted<string>;
export type AddressPart = string | Redacted.Redacted<string>;
export type SenderContactEmail = string | Redacted.Redacted<string>;
export type SolutionArn = string;
export type MonetaryAmount = string | Redacted.Redacted<string>;
export type EngagementInvitationArn = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type AwsAccountList = string | Redacted.Redacted<string>[];
export const AwsAccountList = S.Array(SensitiveString);
export type EngagementContextTypeList = string[];
export const EngagementContextTypeList = S.Array(S.String);
export type EngagementIdentifiers = string[];
export const EngagementIdentifiers = S.Array(S.String);
export type TaskStatuses = string[];
export const TaskStatuses = S.Array(S.String);
export type OpportunityIdentifiers = string[];
export const OpportunityIdentifiers = S.Array(S.String);
export type EngagementInvitationIdentifiers = string[];
export const EngagementInvitationIdentifiers = S.Array(S.String);
export type TaskIdentifiers = string[];
export const TaskIdentifiers = S.Array(S.String);
export type EngagementInvitationsPayloadType = string[];
export const EngagementInvitationsPayloadType = S.Array(S.String);
export type InvitationStatusList = string[];
export const InvitationStatusList = S.Array(S.String);
export type AwsAccountIdOrAliasList = string | Redacted.Redacted<string>[];
export const AwsAccountIdOrAliasList = S.Array(SensitiveString);
export type PrimaryNeedsFromAws = string[];
export const PrimaryNeedsFromAws = S.Array(S.String);
export type FilterIdentifier = string[];
export const FilterIdentifier = S.Array(S.String);
export type FilterLifeCycleStage = string[];
export const FilterLifeCycleStage = S.Array(S.String);
export type FilterLifeCycleReviewStatus = string[];
export const FilterLifeCycleReviewStatus = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export type ContextIdentifiers = string[];
export const ContextIdentifiers = S.Array(S.String);
export type FilterStatus = string[];
export const FilterStatus = S.Array(S.String);
export type SolutionIdentifiers = string[];
export const SolutionIdentifiers = S.Array(S.String);
export interface GetSellingSystemSettingsRequest {
  Catalog: string;
}
export const GetSellingSystemSettingsRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetSellingSystemSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSellingSystemSettingsRequest",
}) as any as S.Schema<GetSellingSystemSettingsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
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
export interface PutSellingSystemSettingsRequest {
  Catalog: string;
  ResourceSnapshotJobRoleIdentifier?: string;
}
export const PutSellingSystemSettingsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ResourceSnapshotJobRoleIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutSellingSystemSettings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutSellingSystemSettingsRequest",
}) as any as S.Schema<PutSellingSystemSettingsRequest>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
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
export interface GetEngagementRequest {
  Catalog: string;
  Identifier: string;
}
export const GetEngagementRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetEngagement" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEngagementRequest",
}) as any as S.Schema<GetEngagementRequest>;
export interface ListEngagementMembersRequest {
  Catalog: string;
  Identifier: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListEngagementMembersRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEngagementMembers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementMembersRequest",
}) as any as S.Schema<ListEngagementMembersRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface StartEngagementByAcceptingInvitationTaskRequest {
  Catalog: string;
  ClientToken: string;
  Identifier: string;
  Tags?: TagList;
}
export const StartEngagementByAcceptingInvitationTaskRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String,
    Identifier: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/StartEngagementByAcceptingInvitationTask",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartEngagementByAcceptingInvitationTaskRequest",
}) as any as S.Schema<StartEngagementByAcceptingInvitationTaskRequest>;
export interface ListTasksSortBase {
  SortOrder: string;
  SortBy: string;
}
export const ListTasksSortBase = S.suspend(() =>
  S.Struct({ SortOrder: S.String, SortBy: S.String }),
).annotations({
  identifier: "ListTasksSortBase",
}) as any as S.Schema<ListTasksSortBase>;
export interface ListEngagementFromOpportunityTasksRequest {
  MaxResults?: number;
  NextToken?: string;
  Sort?: ListTasksSortBase;
  Catalog: string;
  TaskStatus?: TaskStatuses;
  TaskIdentifier?: TaskIdentifiers;
  OpportunityIdentifier?: OpportunityIdentifiers;
  EngagementIdentifier?: EngagementIdentifiers;
}
export const ListEngagementFromOpportunityTasksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(ListTasksSortBase),
    Catalog: S.String,
    TaskStatus: S.optional(TaskStatuses),
    TaskIdentifier: S.optional(TaskIdentifiers),
    OpportunityIdentifier: S.optional(OpportunityIdentifiers),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEngagementFromOpportunityTasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementFromOpportunityTasksRequest",
}) as any as S.Schema<ListEngagementFromOpportunityTasksRequest>;
export interface GetEngagementInvitationRequest {
  Catalog: string;
  Identifier: string;
}
export const GetEngagementInvitationRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetEngagementInvitation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEngagementInvitationRequest",
}) as any as S.Schema<GetEngagementInvitationRequest>;
export interface AcceptEngagementInvitationRequest {
  Catalog: string;
  Identifier: string;
}
export const AcceptEngagementInvitationRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AcceptEngagementInvitation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AcceptEngagementInvitationRequest",
}) as any as S.Schema<AcceptEngagementInvitationRequest>;
export interface AcceptEngagementInvitationResponse {}
export const AcceptEngagementInvitationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AcceptEngagementInvitationResponse",
}) as any as S.Schema<AcceptEngagementInvitationResponse>;
export interface RejectEngagementInvitationRequest {
  Catalog: string;
  Identifier: string;
  RejectionReason?: string;
}
export const RejectEngagementInvitationRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    RejectionReason: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/RejectEngagementInvitation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectEngagementInvitationRequest",
}) as any as S.Schema<RejectEngagementInvitationRequest>;
export interface RejectEngagementInvitationResponse {}
export const RejectEngagementInvitationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RejectEngagementInvitationResponse",
}) as any as S.Schema<RejectEngagementInvitationResponse>;
export interface GetOpportunityRequest {
  Catalog: string;
  Identifier: string;
}
export const GetOpportunityRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, Identifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetOpportunityRequest",
}) as any as S.Schema<GetOpportunityRequest>;
export interface Address {
  City?: string | Redacted.Redacted<string>;
  PostalCode?: string | Redacted.Redacted<string>;
  StateOrRegion?: string | Redacted.Redacted<string>;
  CountryCode?: string;
  StreetAddress?: string | Redacted.Redacted<string>;
}
export const Address = S.suspend(() =>
  S.Struct({
    City: S.optional(SensitiveString),
    PostalCode: S.optional(SensitiveString),
    StateOrRegion: S.optional(SensitiveString),
    CountryCode: S.optional(S.String),
    StreetAddress: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Address" }) as any as S.Schema<Address>;
export interface Account {
  Industry?: string;
  OtherIndustry?: string;
  CompanyName: string | Redacted.Redacted<string>;
  WebsiteUrl?: string | Redacted.Redacted<string>;
  AwsAccountId?: string | Redacted.Redacted<string>;
  Address?: Address;
  Duns?: string | Redacted.Redacted<string>;
}
export const Account = S.suspend(() =>
  S.Struct({
    Industry: S.optional(S.String),
    OtherIndustry: S.optional(S.String),
    CompanyName: SensitiveString,
    WebsiteUrl: S.optional(SensitiveString),
    AwsAccountId: S.optional(SensitiveString),
    Address: S.optional(Address),
    Duns: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Account" }) as any as S.Schema<Account>;
export interface Contact {
  Email?: string | Redacted.Redacted<string>;
  FirstName?: string | Redacted.Redacted<string>;
  LastName?: string | Redacted.Redacted<string>;
  BusinessTitle?: string | Redacted.Redacted<string>;
  Phone?: string | Redacted.Redacted<string>;
}
export const Contact = S.suspend(() =>
  S.Struct({
    Email: S.optional(SensitiveString),
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    BusinessTitle: S.optional(SensitiveString),
    Phone: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Contact" }) as any as S.Schema<Contact>;
export type CustomerContactsList = Contact[];
export const CustomerContactsList = S.Array(Contact);
export interface Customer {
  Account?: Account;
  Contacts?: CustomerContactsList;
}
export const Customer = S.suspend(() =>
  S.Struct({
    Account: S.optional(Account),
    Contacts: S.optional(CustomerContactsList),
  }),
).annotations({ identifier: "Customer" }) as any as S.Schema<Customer>;
export type DeliveryModels = string[];
export const DeliveryModels = S.Array(S.String);
export interface ExpectedCustomerSpend {
  Amount?: string | Redacted.Redacted<string>;
  CurrencyCode: string;
  Frequency: string;
  TargetCompany: string;
  EstimationUrl?: string;
}
export const ExpectedCustomerSpend = S.suspend(() =>
  S.Struct({
    Amount: S.optional(SensitiveString),
    CurrencyCode: S.String,
    Frequency: S.String,
    TargetCompany: S.String,
    EstimationUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "ExpectedCustomerSpend",
}) as any as S.Schema<ExpectedCustomerSpend>;
export type ExpectedCustomerSpendList = ExpectedCustomerSpend[];
export const ExpectedCustomerSpendList = S.Array(ExpectedCustomerSpend);
export type ApnPrograms = string[];
export const ApnPrograms = S.Array(S.String);
export type SalesActivities = string[];
export const SalesActivities = S.Array(S.String);
export interface Project {
  DeliveryModels?: DeliveryModels;
  ExpectedCustomerSpend?: ExpectedCustomerSpendList;
  Title?: string | Redacted.Redacted<string>;
  ApnPrograms?: ApnPrograms;
  CustomerBusinessProblem?: string | Redacted.Redacted<string>;
  CustomerUseCase?: string;
  RelatedOpportunityIdentifier?: string;
  SalesActivities?: SalesActivities;
  CompetitorName?: string;
  OtherCompetitorNames?: string;
  OtherSolutionDescription?: string | Redacted.Redacted<string>;
  AdditionalComments?: string;
  AwsPartition?: string;
}
export const Project = S.suspend(() =>
  S.Struct({
    DeliveryModels: S.optional(DeliveryModels),
    ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
    Title: S.optional(SensitiveString),
    ApnPrograms: S.optional(ApnPrograms),
    CustomerBusinessProblem: S.optional(SensitiveString),
    CustomerUseCase: S.optional(S.String),
    RelatedOpportunityIdentifier: S.optional(S.String),
    SalesActivities: S.optional(SalesActivities),
    CompetitorName: S.optional(S.String),
    OtherCompetitorNames: S.optional(S.String),
    OtherSolutionDescription: S.optional(SensitiveString),
    AdditionalComments: S.optional(S.String),
    AwsPartition: S.optional(S.String),
  }),
).annotations({ identifier: "Project" }) as any as S.Schema<Project>;
export type UseCases = string[];
export const UseCases = S.Array(S.String);
export type Channels = string[];
export const Channels = S.Array(S.String);
export interface Marketing {
  CampaignName?: string;
  Source?: string;
  UseCases?: UseCases;
  Channels?: Channels;
  AwsFundingUsed?: string;
}
export const Marketing = S.suspend(() =>
  S.Struct({
    CampaignName: S.optional(S.String),
    Source: S.optional(S.String),
    UseCases: S.optional(UseCases),
    Channels: S.optional(Channels),
    AwsFundingUsed: S.optional(S.String),
  }),
).annotations({ identifier: "Marketing" }) as any as S.Schema<Marketing>;
export interface MonetaryValue {
  Amount: string;
  CurrencyCode: string;
}
export const MonetaryValue = S.suspend(() =>
  S.Struct({ Amount: S.String, CurrencyCode: S.String }),
).annotations({
  identifier: "MonetaryValue",
}) as any as S.Schema<MonetaryValue>;
export interface SoftwareRevenue {
  DeliveryModel?: string;
  Value?: MonetaryValue;
  EffectiveDate?: string;
  ExpirationDate?: string;
}
export const SoftwareRevenue = S.suspend(() =>
  S.Struct({
    DeliveryModel: S.optional(S.String),
    Value: S.optional(MonetaryValue),
    EffectiveDate: S.optional(S.String),
    ExpirationDate: S.optional(S.String),
  }),
).annotations({
  identifier: "SoftwareRevenue",
}) as any as S.Schema<SoftwareRevenue>;
export interface NextStepsHistory {
  Value: string;
  Time: Date;
}
export const NextStepsHistory = S.suspend(() =>
  S.Struct({
    Value: S.String,
    Time: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "NextStepsHistory",
}) as any as S.Schema<NextStepsHistory>;
export type NextStepsHistories = NextStepsHistory[];
export const NextStepsHistories = S.Array(NextStepsHistory);
export interface LifeCycle {
  Stage?: string;
  ClosedLostReason?: string;
  NextSteps?: string | Redacted.Redacted<string>;
  TargetCloseDate?: string;
  ReviewStatus?: string;
  ReviewComments?: string;
  ReviewStatusReason?: string;
  NextStepsHistory?: NextStepsHistories;
}
export const LifeCycle = S.suspend(() =>
  S.Struct({
    Stage: S.optional(S.String),
    ClosedLostReason: S.optional(S.String),
    NextSteps: S.optional(SensitiveString),
    TargetCloseDate: S.optional(S.String),
    ReviewStatus: S.optional(S.String),
    ReviewComments: S.optional(S.String),
    ReviewStatusReason: S.optional(S.String),
    NextStepsHistory: S.optional(NextStepsHistories),
  }),
).annotations({ identifier: "LifeCycle" }) as any as S.Schema<LifeCycle>;
export interface UpdateOpportunityRequest {
  Catalog: string;
  PrimaryNeedsFromAws?: PrimaryNeedsFromAws;
  NationalSecurity?: string;
  PartnerOpportunityIdentifier?: string;
  Customer?: Customer;
  Project?: Project;
  OpportunityType?: string;
  Marketing?: Marketing;
  SoftwareRevenue?: SoftwareRevenue;
  LastModifiedDate: Date;
  Identifier: string;
  LifeCycle?: LifeCycle;
}
export const UpdateOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    PrimaryNeedsFromAws: S.optional(PrimaryNeedsFromAws),
    NationalSecurity: S.optional(S.String),
    PartnerOpportunityIdentifier: S.optional(S.String),
    Customer: S.optional(Customer),
    Project: S.optional(Project),
    OpportunityType: S.optional(S.String),
    Marketing: S.optional(Marketing),
    SoftwareRevenue: S.optional(SoftwareRevenue),
    LastModifiedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    Identifier: S.String,
    LifeCycle: S.optional(LifeCycle),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateOpportunityRequest",
}) as any as S.Schema<UpdateOpportunityRequest>;
export interface AssociateOpportunityRequest {
  Catalog: string;
  OpportunityIdentifier: string;
  RelatedEntityType: string;
  RelatedEntityIdentifier: string;
}
export const AssociateOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    OpportunityIdentifier: S.String,
    RelatedEntityType: S.String,
    RelatedEntityIdentifier: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AssociateOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateOpportunityRequest",
}) as any as S.Schema<AssociateOpportunityRequest>;
export interface AssociateOpportunityResponse {}
export const AssociateOpportunityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateOpportunityResponse",
}) as any as S.Schema<AssociateOpportunityResponse>;
export interface DisassociateOpportunityRequest {
  Catalog: string;
  OpportunityIdentifier: string;
  RelatedEntityType: string;
  RelatedEntityIdentifier: string;
}
export const DisassociateOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    OpportunityIdentifier: S.String,
    RelatedEntityType: S.String,
    RelatedEntityIdentifier: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DisassociateOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateOpportunityRequest",
}) as any as S.Schema<DisassociateOpportunityRequest>;
export interface DisassociateOpportunityResponse {}
export const DisassociateOpportunityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateOpportunityResponse",
}) as any as S.Schema<DisassociateOpportunityResponse>;
export interface GetAwsOpportunitySummaryRequest {
  Catalog: string;
  RelatedOpportunityIdentifier: string;
}
export const GetAwsOpportunitySummaryRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, RelatedOpportunityIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetAwsOpportunitySummary" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAwsOpportunitySummaryRequest",
}) as any as S.Schema<GetAwsOpportunitySummaryRequest>;
export interface SubmitOpportunityRequest {
  Catalog: string;
  Identifier: string;
  InvolvementType: string;
  Visibility?: string;
}
export const SubmitOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    InvolvementType: S.String,
    Visibility: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/SubmitOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SubmitOpportunityRequest",
}) as any as S.Schema<SubmitOpportunityRequest>;
export interface SubmitOpportunityResponse {}
export const SubmitOpportunityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SubmitOpportunityResponse",
}) as any as S.Schema<SubmitOpportunityResponse>;
export interface StartOpportunityFromEngagementTaskRequest {
  Catalog: string;
  ClientToken: string;
  Identifier: string;
  ContextIdentifier: string;
  Tags?: TagList;
}
export const StartOpportunityFromEngagementTaskRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String,
    Identifier: S.String,
    ContextIdentifier: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartOpportunityFromEngagementTask" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartOpportunityFromEngagementTaskRequest",
}) as any as S.Schema<StartOpportunityFromEngagementTaskRequest>;
export interface ListOpportunityFromEngagementTasksRequest {
  MaxResults?: number;
  NextToken?: string;
  Sort?: ListTasksSortBase;
  Catalog: string;
  TaskStatus?: TaskStatuses;
  TaskIdentifier?: TaskIdentifiers;
  OpportunityIdentifier?: OpportunityIdentifiers;
  EngagementIdentifier?: EngagementIdentifiers;
  ContextIdentifier?: ContextIdentifiers;
}
export const ListOpportunityFromEngagementTasksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(ListTasksSortBase),
    Catalog: S.String,
    TaskStatus: S.optional(TaskStatuses),
    TaskIdentifier: S.optional(TaskIdentifiers),
    OpportunityIdentifier: S.optional(OpportunityIdentifiers),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
    ContextIdentifier: S.optional(ContextIdentifiers),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListOpportunityFromEngagementTasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOpportunityFromEngagementTasksRequest",
}) as any as S.Schema<ListOpportunityFromEngagementTasksRequest>;
export interface CreateResourceSnapshotRequest {
  Catalog: string;
  EngagementIdentifier: string;
  ResourceType: string;
  ResourceIdentifier: string;
  ResourceSnapshotTemplateIdentifier: string;
  ClientToken: string;
}
export const CreateResourceSnapshotRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ResourceType: S.String,
    ResourceIdentifier: S.String,
    ResourceSnapshotTemplateIdentifier: S.String,
    ClientToken: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateResourceSnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourceSnapshotRequest",
}) as any as S.Schema<CreateResourceSnapshotRequest>;
export interface GetResourceSnapshotRequest {
  Catalog: string;
  EngagementIdentifier: string;
  ResourceType: string;
  ResourceIdentifier: string;
  ResourceSnapshotTemplateIdentifier: string;
  Revision?: number;
}
export const GetResourceSnapshotRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ResourceType: S.String,
    ResourceIdentifier: S.String,
    ResourceSnapshotTemplateIdentifier: S.String,
    Revision: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetResourceSnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceSnapshotRequest",
}) as any as S.Schema<GetResourceSnapshotRequest>;
export interface ListEngagementResourceAssociationsRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  EngagementIdentifier?: string;
  ResourceType?: string;
  ResourceIdentifier?: string;
  CreatedBy?: string | Redacted.Redacted<string>;
}
export const ListEngagementResourceAssociationsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    CreatedBy: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEngagementResourceAssociations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementResourceAssociationsRequest",
}) as any as S.Schema<ListEngagementResourceAssociationsRequest>;
export interface ListResourceSnapshotsRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  EngagementIdentifier: string;
  ResourceType?: string;
  ResourceIdentifier?: string;
  ResourceSnapshotTemplateIdentifier?: string;
  CreatedBy?: string | Redacted.Redacted<string>;
}
export const ListResourceSnapshotsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.String,
    ResourceType: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    ResourceSnapshotTemplateIdentifier: S.optional(S.String),
    CreatedBy: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListResourceSnapshots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceSnapshotsRequest",
}) as any as S.Schema<ListResourceSnapshotsRequest>;
export interface CreateResourceSnapshotJobRequest {
  Catalog: string;
  ClientToken: string;
  EngagementIdentifier: string;
  ResourceType: string;
  ResourceIdentifier: string;
  ResourceSnapshotTemplateIdentifier: string;
  Tags?: TagList;
}
export const CreateResourceSnapshotJobRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String,
    EngagementIdentifier: S.String,
    ResourceType: S.String,
    ResourceIdentifier: S.String,
    ResourceSnapshotTemplateIdentifier: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateResourceSnapshotJob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateResourceSnapshotJobRequest",
}) as any as S.Schema<CreateResourceSnapshotJobRequest>;
export interface GetResourceSnapshotJobRequest {
  Catalog: string;
  ResourceSnapshotJobIdentifier: string;
}
export const GetResourceSnapshotJobRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, ResourceSnapshotJobIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetResourceSnapshotJob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceSnapshotJobRequest",
}) as any as S.Schema<GetResourceSnapshotJobRequest>;
export interface DeleteResourceSnapshotJobRequest {
  Catalog: string;
  ResourceSnapshotJobIdentifier: string;
}
export const DeleteResourceSnapshotJobRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, ResourceSnapshotJobIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteResourceSnapshotJob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteResourceSnapshotJobRequest",
}) as any as S.Schema<DeleteResourceSnapshotJobRequest>;
export interface DeleteResourceSnapshotJobResponse {}
export const DeleteResourceSnapshotJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourceSnapshotJobResponse",
}) as any as S.Schema<DeleteResourceSnapshotJobResponse>;
export interface StartResourceSnapshotJobRequest {
  Catalog: string;
  ResourceSnapshotJobIdentifier: string;
}
export const StartResourceSnapshotJobRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, ResourceSnapshotJobIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartResourceSnapshotJob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartResourceSnapshotJobRequest",
}) as any as S.Schema<StartResourceSnapshotJobRequest>;
export interface StartResourceSnapshotJobResponse {}
export const StartResourceSnapshotJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartResourceSnapshotJobResponse",
}) as any as S.Schema<StartResourceSnapshotJobResponse>;
export interface StopResourceSnapshotJobRequest {
  Catalog: string;
  ResourceSnapshotJobIdentifier: string;
}
export const StopResourceSnapshotJobRequest = S.suspend(() =>
  S.Struct({ Catalog: S.String, ResourceSnapshotJobIdentifier: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StopResourceSnapshotJob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopResourceSnapshotJobRequest",
}) as any as S.Schema<StopResourceSnapshotJobRequest>;
export interface StopResourceSnapshotJobResponse {}
export const StopResourceSnapshotJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopResourceSnapshotJobResponse",
}) as any as S.Schema<StopResourceSnapshotJobResponse>;
export interface EngagementCustomer {
  Industry: string;
  CompanyName: string | Redacted.Redacted<string>;
  WebsiteUrl: string | Redacted.Redacted<string>;
  CountryCode: string;
}
export const EngagementCustomer = S.suspend(() =>
  S.Struct({
    Industry: S.String,
    CompanyName: SensitiveString,
    WebsiteUrl: SensitiveString,
    CountryCode: S.String,
  }),
).annotations({
  identifier: "EngagementCustomer",
}) as any as S.Schema<EngagementCustomer>;
export interface EngagementCustomerProjectDetails {
  Title: string;
  BusinessProblem: string | Redacted.Redacted<string>;
  TargetCompletionDate: string;
}
export const EngagementCustomerProjectDetails = S.suspend(() =>
  S.Struct({
    Title: S.String,
    BusinessProblem: SensitiveString,
    TargetCompletionDate: S.String,
  }),
).annotations({
  identifier: "EngagementCustomerProjectDetails",
}) as any as S.Schema<EngagementCustomerProjectDetails>;
export interface CustomerProjectsContext {
  Customer?: EngagementCustomer;
  Project?: EngagementCustomerProjectDetails;
}
export const CustomerProjectsContext = S.suspend(() =>
  S.Struct({
    Customer: S.optional(EngagementCustomer),
    Project: S.optional(EngagementCustomerProjectDetails),
  }),
).annotations({
  identifier: "CustomerProjectsContext",
}) as any as S.Schema<CustomerProjectsContext>;
export interface AddressSummary {
  City?: string | Redacted.Redacted<string>;
  PostalCode?: string | Redacted.Redacted<string>;
  StateOrRegion?: string | Redacted.Redacted<string>;
  CountryCode?: string;
}
export const AddressSummary = S.suspend(() =>
  S.Struct({
    City: S.optional(SensitiveString),
    PostalCode: S.optional(SensitiveString),
    StateOrRegion: S.optional(SensitiveString),
    CountryCode: S.optional(S.String),
  }),
).annotations({
  identifier: "AddressSummary",
}) as any as S.Schema<AddressSummary>;
export interface LeadCustomer {
  Industry?: string;
  CompanyName: string | Redacted.Redacted<string>;
  WebsiteUrl?: string | Redacted.Redacted<string>;
  Address: AddressSummary;
  AwsMaturity?: string;
  MarketSegment?: string;
}
export const LeadCustomer = S.suspend(() =>
  S.Struct({
    Industry: S.optional(S.String),
    CompanyName: SensitiveString,
    WebsiteUrl: S.optional(SensitiveString),
    Address: AddressSummary,
    AwsMaturity: S.optional(S.String),
    MarketSegment: S.optional(S.String),
  }),
).annotations({ identifier: "LeadCustomer" }) as any as S.Schema<LeadCustomer>;
export interface LeadContact {
  BusinessTitle: string | Redacted.Redacted<string>;
  Email: string | Redacted.Redacted<string>;
  FirstName: string | Redacted.Redacted<string>;
  LastName: string | Redacted.Redacted<string>;
  Phone?: string | Redacted.Redacted<string>;
}
export const LeadContact = S.suspend(() =>
  S.Struct({
    BusinessTitle: SensitiveString,
    Email: SensitiveString,
    FirstName: SensitiveString,
    LastName: SensitiveString,
    Phone: S.optional(SensitiveString),
  }),
).annotations({ identifier: "LeadContact" }) as any as S.Schema<LeadContact>;
export interface LeadInteraction {
  SourceType: string;
  SourceId: string;
  SourceName: string;
  Usecase?: string;
  InteractionDate?: Date;
  CustomerAction: string;
  BusinessProblem?: string | Redacted.Redacted<string>;
  Contact: LeadContact;
}
export const LeadInteraction = S.suspend(() =>
  S.Struct({
    SourceType: S.String,
    SourceId: S.String,
    SourceName: S.String,
    Usecase: S.optional(S.String),
    InteractionDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CustomerAction: S.String,
    BusinessProblem: S.optional(SensitiveString),
    Contact: LeadContact,
  }),
).annotations({
  identifier: "LeadInteraction",
}) as any as S.Schema<LeadInteraction>;
export type LeadInteractionList = LeadInteraction[];
export const LeadInteractionList = S.Array(LeadInteraction);
export interface LeadContext {
  QualificationStatus?: string;
  Customer: LeadCustomer;
  Interactions: LeadInteractionList;
}
export const LeadContext = S.suspend(() =>
  S.Struct({
    QualificationStatus: S.optional(S.String),
    Customer: LeadCustomer,
    Interactions: LeadInteractionList,
  }),
).annotations({ identifier: "LeadContext" }) as any as S.Schema<LeadContext>;
export type EngagementContextPayload =
  | { CustomerProject: CustomerProjectsContext }
  | { Lead: LeadContext };
export const EngagementContextPayload = S.Union(
  S.Struct({ CustomerProject: CustomerProjectsContext }),
  S.Struct({ Lead: LeadContext }),
);
export interface EngagementContextDetails {
  Id?: string;
  Type: string;
  Payload?: (typeof EngagementContextPayload)["Type"];
}
export const EngagementContextDetails = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Type: S.String,
    Payload: S.optional(EngagementContextPayload),
  }),
).annotations({
  identifier: "EngagementContextDetails",
}) as any as S.Schema<EngagementContextDetails>;
export type EngagementContexts = EngagementContextDetails[];
export const EngagementContexts = S.Array(EngagementContextDetails);
export interface EngagementSort {
  SortOrder: string;
  SortBy: string;
}
export const EngagementSort = S.suspend(() =>
  S.Struct({ SortOrder: S.String, SortBy: S.String }),
).annotations({
  identifier: "EngagementSort",
}) as any as S.Schema<EngagementSort>;
export interface AwsSubmission {
  InvolvementType: string;
  Visibility?: string;
}
export const AwsSubmission = S.suspend(() =>
  S.Struct({ InvolvementType: S.String, Visibility: S.optional(S.String) }),
).annotations({
  identifier: "AwsSubmission",
}) as any as S.Schema<AwsSubmission>;
export interface OpportunityEngagementInvitationSort {
  SortOrder: string;
  SortBy: string;
}
export const OpportunityEngagementInvitationSort = S.suspend(() =>
  S.Struct({ SortOrder: S.String, SortBy: S.String }),
).annotations({
  identifier: "OpportunityEngagementInvitationSort",
}) as any as S.Schema<OpportunityEngagementInvitationSort>;
export type PartnerOpportunityTeamMembersList = Contact[];
export const PartnerOpportunityTeamMembersList = S.Array(Contact);
export interface OpportunitySort {
  SortOrder: string;
  SortBy: string;
}
export const OpportunitySort = S.suspend(() =>
  S.Struct({ SortOrder: S.String, SortBy: S.String }),
).annotations({
  identifier: "OpportunitySort",
}) as any as S.Schema<OpportunitySort>;
export interface LastModifiedDate {
  AfterLastModifiedDate?: Date;
  BeforeLastModifiedDate?: Date;
}
export const LastModifiedDate = S.suspend(() =>
  S.Struct({
    AfterLastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    BeforeLastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "LastModifiedDate",
}) as any as S.Schema<LastModifiedDate>;
export interface AssigneeContact {
  Email: string | Redacted.Redacted<string>;
  FirstName: string | Redacted.Redacted<string>;
  LastName: string | Redacted.Redacted<string>;
  Phone?: string | Redacted.Redacted<string>;
  BusinessTitle: string | Redacted.Redacted<string>;
}
export const AssigneeContact = S.suspend(() =>
  S.Struct({
    Email: SensitiveString,
    FirstName: SensitiveString,
    LastName: SensitiveString,
    Phone: S.optional(SensitiveString),
    BusinessTitle: SensitiveString,
  }),
).annotations({
  identifier: "AssigneeContact",
}) as any as S.Schema<AssigneeContact>;
export interface SortObject {
  SortBy?: string;
  SortOrder?: string;
}
export const SortObject = S.suspend(() =>
  S.Struct({ SortBy: S.optional(S.String), SortOrder: S.optional(S.String) }),
).annotations({ identifier: "SortObject" }) as any as S.Schema<SortObject>;
export interface SolutionSort {
  SortOrder: string;
  SortBy: string;
}
export const SolutionSort = S.suspend(() =>
  S.Struct({ SortOrder: S.String, SortBy: S.String }),
).annotations({ identifier: "SolutionSort" }) as any as S.Schema<SolutionSort>;
export interface GetSellingSystemSettingsResponse {
  Catalog: string;
  ResourceSnapshotJobRoleArn?: string;
}
export const GetSellingSystemSettingsResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ResourceSnapshotJobRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSellingSystemSettingsResponse",
}) as any as S.Schema<GetSellingSystemSettingsResponse>;
export interface ListTagsForResourceResponse {
  Tags: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: TagList }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutSellingSystemSettingsResponse {
  Catalog: string;
  ResourceSnapshotJobRoleArn?: string;
}
export const PutSellingSystemSettingsResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ResourceSnapshotJobRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "PutSellingSystemSettingsResponse",
}) as any as S.Schema<PutSellingSystemSettingsResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
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
export interface CreateEngagementRequest {
  Catalog: string;
  ClientToken: string;
  Title: string;
  Description: string;
  Contexts?: EngagementContexts;
}
export const CreateEngagementRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String,
    Title: S.String,
    Description: S.String,
    Contexts: S.optional(EngagementContexts),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateEngagement" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEngagementRequest",
}) as any as S.Schema<CreateEngagementRequest>;
export interface GetEngagementResponse {
  Id?: string;
  Arn?: string;
  Title?: string;
  Description?: string;
  CreatedAt?: Date;
  CreatedBy?: string | Redacted.Redacted<string>;
  MemberCount?: number;
  ModifiedAt?: Date;
  ModifiedBy?: string | Redacted.Redacted<string>;
  Contexts?: EngagementContexts;
}
export const GetEngagementResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Title: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreatedBy: S.optional(SensitiveString),
    MemberCount: S.optional(S.Number),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ModifiedBy: S.optional(SensitiveString),
    Contexts: S.optional(EngagementContexts),
  }),
).annotations({
  identifier: "GetEngagementResponse",
}) as any as S.Schema<GetEngagementResponse>;
export interface ListEngagementsRequest {
  Catalog: string;
  CreatedBy?: AwsAccountList;
  ExcludeCreatedBy?: AwsAccountList;
  ContextTypes?: EngagementContextTypeList;
  ExcludeContextTypes?: EngagementContextTypeList;
  Sort?: EngagementSort;
  MaxResults?: number;
  NextToken?: string;
  EngagementIdentifier?: EngagementIdentifiers;
}
export const ListEngagementsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    CreatedBy: S.optional(AwsAccountList),
    ExcludeCreatedBy: S.optional(AwsAccountList),
    ContextTypes: S.optional(EngagementContextTypeList),
    ExcludeContextTypes: S.optional(EngagementContextTypeList),
    Sort: S.optional(EngagementSort),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEngagements" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementsRequest",
}) as any as S.Schema<ListEngagementsRequest>;
export interface StartEngagementByAcceptingInvitationTaskResponse {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: string;
  Message?: string;
  ReasonCode?: string;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementInvitationId?: string;
}
export const StartEngagementByAcceptingInvitationTaskResponse = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(S.String),
    Message: S.optional(S.String),
    ReasonCode: S.optional(S.String),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementInvitationId: S.optional(S.String),
  }),
).annotations({
  identifier: "StartEngagementByAcceptingInvitationTaskResponse",
}) as any as S.Schema<StartEngagementByAcceptingInvitationTaskResponse>;
export interface ListEngagementByAcceptingInvitationTasksRequest {
  MaxResults?: number;
  NextToken?: string;
  Sort?: ListTasksSortBase;
  Catalog: string;
  TaskStatus?: TaskStatuses;
  OpportunityIdentifier?: OpportunityIdentifiers;
  EngagementInvitationIdentifier?: EngagementInvitationIdentifiers;
  TaskIdentifier?: TaskIdentifiers;
}
export const ListEngagementByAcceptingInvitationTasksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(ListTasksSortBase),
    Catalog: S.String,
    TaskStatus: S.optional(TaskStatuses),
    OpportunityIdentifier: S.optional(OpportunityIdentifiers),
    EngagementInvitationIdentifier: S.optional(EngagementInvitationIdentifiers),
    TaskIdentifier: S.optional(TaskIdentifiers),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/ListEngagementByAcceptingInvitationTasks",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementByAcceptingInvitationTasksRequest",
}) as any as S.Schema<ListEngagementByAcceptingInvitationTasksRequest>;
export interface StartEngagementFromOpportunityTaskRequest {
  Catalog: string;
  ClientToken: string;
  Identifier: string;
  AwsSubmission: AwsSubmission;
  Tags?: TagList;
}
export const StartEngagementFromOpportunityTaskRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String,
    Identifier: S.String,
    AwsSubmission: AwsSubmission,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartEngagementFromOpportunityTask" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartEngagementFromOpportunityTaskRequest",
}) as any as S.Schema<StartEngagementFromOpportunityTaskRequest>;
export interface ListEngagementInvitationsRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  Sort?: OpportunityEngagementInvitationSort;
  PayloadType?: EngagementInvitationsPayloadType;
  ParticipantType: string;
  Status?: InvitationStatusList;
  EngagementIdentifier?: EngagementIdentifiers;
  SenderAwsAccountId?: AwsAccountIdOrAliasList;
}
export const ListEngagementInvitationsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(OpportunityEngagementInvitationSort),
    PayloadType: S.optional(EngagementInvitationsPayloadType),
    ParticipantType: S.String,
    Status: S.optional(InvitationStatusList),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
    SenderAwsAccountId: S.optional(AwsAccountIdOrAliasList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListEngagementInvitations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngagementInvitationsRequest",
}) as any as S.Schema<ListEngagementInvitationsRequest>;
export interface UpdateOpportunityResponse {
  Id: string;
  LastModifiedDate: Date;
}
export const UpdateOpportunityResponse = S.suspend(() =>
  S.Struct({
    Id: S.String,
    LastModifiedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateOpportunityResponse",
}) as any as S.Schema<UpdateOpportunityResponse>;
export interface ListOpportunitiesRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  Sort?: OpportunitySort;
  LastModifiedDate?: LastModifiedDate;
  Identifier?: FilterIdentifier;
  LifeCycleStage?: FilterLifeCycleStage;
  LifeCycleReviewStatus?: FilterLifeCycleReviewStatus;
  CustomerCompanyName?: StringList;
}
export const ListOpportunitiesRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(OpportunitySort),
    LastModifiedDate: S.optional(LastModifiedDate),
    Identifier: S.optional(FilterIdentifier),
    LifeCycleStage: S.optional(FilterLifeCycleStage),
    LifeCycleReviewStatus: S.optional(FilterLifeCycleReviewStatus),
    CustomerCompanyName: S.optional(StringList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListOpportunities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOpportunitiesRequest",
}) as any as S.Schema<ListOpportunitiesRequest>;
export interface AssignOpportunityRequest {
  Catalog: string;
  Identifier: string;
  Assignee: AssigneeContact;
}
export const AssignOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Identifier: S.String,
    Assignee: AssigneeContact,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AssignOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssignOpportunityRequest",
}) as any as S.Schema<AssignOpportunityRequest>;
export interface AssignOpportunityResponse {}
export const AssignOpportunityResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssignOpportunityResponse",
}) as any as S.Schema<AssignOpportunityResponse>;
export interface StartOpportunityFromEngagementTaskResponse {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: string;
  Message?: string;
  ReasonCode?: string;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementId?: string;
  ContextId?: string;
}
export const StartOpportunityFromEngagementTaskResponse = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(S.String),
    Message: S.optional(S.String),
    ReasonCode: S.optional(S.String),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementId: S.optional(S.String),
    ContextId: S.optional(S.String),
  }),
).annotations({
  identifier: "StartOpportunityFromEngagementTaskResponse",
}) as any as S.Schema<StartOpportunityFromEngagementTaskResponse>;
export interface CreateResourceSnapshotResponse {
  Arn?: string;
  Revision?: number;
}
export const CreateResourceSnapshotResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Revision: S.optional(S.Number) }),
).annotations({
  identifier: "CreateResourceSnapshotResponse",
}) as any as S.Schema<CreateResourceSnapshotResponse>;
export interface CreateResourceSnapshotJobResponse {
  Id?: string;
  Arn?: string;
}
export const CreateResourceSnapshotJobResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String), Arn: S.optional(S.String) }),
).annotations({
  identifier: "CreateResourceSnapshotJobResponse",
}) as any as S.Schema<CreateResourceSnapshotJobResponse>;
export interface GetResourceSnapshotJobResponse {
  Catalog: string;
  Id?: string;
  Arn?: string;
  EngagementId?: string;
  ResourceType?: string;
  ResourceId?: string;
  ResourceArn?: string;
  ResourceSnapshotTemplateName?: string;
  CreatedAt?: Date;
  Status?: string;
  LastSuccessfulExecutionDate?: Date;
  LastFailure?: string;
}
export const GetResourceSnapshotJobResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    EngagementId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    ResourceSnapshotTemplateName: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Status: S.optional(S.String),
    LastSuccessfulExecutionDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    LastFailure: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourceSnapshotJobResponse",
}) as any as S.Schema<GetResourceSnapshotJobResponse>;
export interface ListResourceSnapshotJobsRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  EngagementIdentifier?: string;
  Status?: string;
  Sort?: SortObject;
}
export const ListResourceSnapshotJobsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.optional(S.String),
    Status: S.optional(S.String),
    Sort: S.optional(SortObject),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListResourceSnapshotJobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourceSnapshotJobsRequest",
}) as any as S.Schema<ListResourceSnapshotJobsRequest>;
export interface ListSolutionsRequest {
  Catalog: string;
  MaxResults?: number;
  NextToken?: string;
  Sort?: SolutionSort;
  Status?: FilterStatus;
  Identifier?: SolutionIdentifiers;
  Category?: StringList;
}
export const ListSolutionsRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(SolutionSort),
    Status: S.optional(FilterStatus),
    Identifier: S.optional(SolutionIdentifiers),
    Category: S.optional(StringList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListSolutions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSolutionsRequest",
}) as any as S.Schema<ListSolutionsRequest>;
export interface UpdateLeadContext {
  QualificationStatus?: string;
  Customer: LeadCustomer;
  Interaction?: LeadInteraction;
}
export const UpdateLeadContext = S.suspend(() =>
  S.Struct({
    QualificationStatus: S.optional(S.String),
    Customer: LeadCustomer,
    Interaction: S.optional(LeadInteraction),
  }),
).annotations({
  identifier: "UpdateLeadContext",
}) as any as S.Schema<UpdateLeadContext>;
export type AwsMarketplaceOfferIdentifiers = string[];
export const AwsMarketplaceOfferIdentifiers = S.Array(S.String);
export type AwsMarketplaceOfferSetIdentifiers = string[];
export const AwsMarketplaceOfferSetIdentifiers = S.Array(S.String);
export type AwsProductIdentifiers = string[];
export const AwsProductIdentifiers = S.Array(S.String);
export type ReceiverResponsibilityList = string[];
export const ReceiverResponsibilityList = S.Array(S.String);
export type UpdateEngagementContextPayload =
  | { Lead: UpdateLeadContext }
  | { CustomerProject: CustomerProjectsContext };
export const UpdateEngagementContextPayload = S.Union(
  S.Struct({ Lead: UpdateLeadContext }),
  S.Struct({ CustomerProject: CustomerProjectsContext }),
);
export interface EngagementMember {
  CompanyName?: string | Redacted.Redacted<string>;
  WebsiteUrl?: string;
  AccountId?: string | Redacted.Redacted<string>;
}
export const EngagementMember = S.suspend(() =>
  S.Struct({
    CompanyName: S.optional(SensitiveString),
    WebsiteUrl: S.optional(S.String),
    AccountId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EngagementMember",
}) as any as S.Schema<EngagementMember>;
export type EngagementMembers = EngagementMember[];
export const EngagementMembers = S.Array(EngagementMember);
export interface ListEngagementFromOpportunityTaskSummary {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: string;
  Message?: string;
  ReasonCode?: string;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementId?: string;
  EngagementInvitationId?: string;
}
export const ListEngagementFromOpportunityTaskSummary = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(S.String),
    Message: S.optional(S.String),
    ReasonCode: S.optional(S.String),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementId: S.optional(S.String),
    EngagementInvitationId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementFromOpportunityTaskSummary",
}) as any as S.Schema<ListEngagementFromOpportunityTaskSummary>;
export type ListEngagementFromOpportunityTaskSummaries =
  ListEngagementFromOpportunityTaskSummary[];
export const ListEngagementFromOpportunityTaskSummaries = S.Array(
  ListEngagementFromOpportunityTaskSummary,
);
export interface EngagementMemberSummary {
  CompanyName?: string | Redacted.Redacted<string>;
  WebsiteUrl?: string;
}
export const EngagementMemberSummary = S.suspend(() =>
  S.Struct({
    CompanyName: S.optional(SensitiveString),
    WebsiteUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "EngagementMemberSummary",
}) as any as S.Schema<EngagementMemberSummary>;
export type EngagementMemberSummaries = EngagementMemberSummary[];
export const EngagementMemberSummaries = S.Array(EngagementMemberSummary);
export interface RelatedEntityIdentifiers {
  AwsMarketplaceOffers?: AwsMarketplaceOfferIdentifiers;
  AwsMarketplaceOfferSets?: AwsMarketplaceOfferSetIdentifiers;
  Solutions?: SolutionIdentifiers;
  AwsProducts?: AwsProductIdentifiers;
}
export const RelatedEntityIdentifiers = S.suspend(() =>
  S.Struct({
    AwsMarketplaceOffers: S.optional(AwsMarketplaceOfferIdentifiers),
    AwsMarketplaceOfferSets: S.optional(AwsMarketplaceOfferSetIdentifiers),
    Solutions: S.optional(SolutionIdentifiers),
    AwsProducts: S.optional(AwsProductIdentifiers),
  }),
).annotations({
  identifier: "RelatedEntityIdentifiers",
}) as any as S.Schema<RelatedEntityIdentifiers>;
export interface AwsTeamMember {
  Email?: string | Redacted.Redacted<string>;
  FirstName?: string | Redacted.Redacted<string>;
  LastName?: string | Redacted.Redacted<string>;
  BusinessTitle?: string;
}
export const AwsTeamMember = S.suspend(() =>
  S.Struct({
    Email: S.optional(SensitiveString),
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    BusinessTitle: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsTeamMember",
}) as any as S.Schema<AwsTeamMember>;
export type AwsOpportunityTeamMembersList = AwsTeamMember[];
export const AwsOpportunityTeamMembersList = S.Array(AwsTeamMember);
export interface AwsOpportunityRelatedEntities {
  AwsProducts?: AwsProductIdentifiers;
  Solutions?: SolutionIdentifiers;
}
export const AwsOpportunityRelatedEntities = S.suspend(() =>
  S.Struct({
    AwsProducts: S.optional(AwsProductIdentifiers),
    Solutions: S.optional(SolutionIdentifiers),
  }),
).annotations({
  identifier: "AwsOpportunityRelatedEntities",
}) as any as S.Schema<AwsOpportunityRelatedEntities>;
export interface AwsOpportunityCustomer {
  Contacts?: CustomerContactsList;
}
export const AwsOpportunityCustomer = S.suspend(() =>
  S.Struct({ Contacts: S.optional(CustomerContactsList) }),
).annotations({
  identifier: "AwsOpportunityCustomer",
}) as any as S.Schema<AwsOpportunityCustomer>;
export interface AwsOpportunityProject {
  ExpectedCustomerSpend?: ExpectedCustomerSpendList;
  AwsPartition?: string;
}
export const AwsOpportunityProject = S.suspend(() =>
  S.Struct({
    ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
    AwsPartition: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsOpportunityProject",
}) as any as S.Schema<AwsOpportunityProject>;
export interface ListOpportunityFromEngagementTaskSummary {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: string;
  Message?: string;
  ReasonCode?: string;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementId?: string;
  ContextId?: string;
}
export const ListOpportunityFromEngagementTaskSummary = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(S.String),
    Message: S.optional(S.String),
    ReasonCode: S.optional(S.String),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementId: S.optional(S.String),
    ContextId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOpportunityFromEngagementTaskSummary",
}) as any as S.Schema<ListOpportunityFromEngagementTaskSummary>;
export type ListOpportunityFromEngagementTaskSummaries =
  ListOpportunityFromEngagementTaskSummary[];
export const ListOpportunityFromEngagementTaskSummaries = S.Array(
  ListOpportunityFromEngagementTaskSummary,
);
export interface EngagementResourceAssociationSummary {
  Catalog: string;
  EngagementId?: string;
  ResourceType?: string;
  ResourceId?: string;
  CreatedBy?: string | Redacted.Redacted<string>;
}
export const EngagementResourceAssociationSummary = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    EngagementId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    CreatedBy: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EngagementResourceAssociationSummary",
}) as any as S.Schema<EngagementResourceAssociationSummary>;
export type EngagementResourceAssociationSummaryList =
  EngagementResourceAssociationSummary[];
export const EngagementResourceAssociationSummaryList = S.Array(
  EngagementResourceAssociationSummary,
);
export interface ResourceSnapshotSummary {
  Arn?: string;
  Revision?: number;
  ResourceType?: string;
  ResourceId?: string;
  ResourceSnapshotTemplateName?: string;
  CreatedBy?: string | Redacted.Redacted<string>;
}
export const ResourceSnapshotSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Revision: S.optional(S.Number),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceSnapshotTemplateName: S.optional(S.String),
    CreatedBy: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ResourceSnapshotSummary",
}) as any as S.Schema<ResourceSnapshotSummary>;
export type ResourceSnapshotSummaryList = ResourceSnapshotSummary[];
export const ResourceSnapshotSummaryList = S.Array(ResourceSnapshotSummary);
export interface AccountReceiver {
  Alias?: string | Redacted.Redacted<string>;
  AwsAccountId: string | Redacted.Redacted<string>;
}
export const AccountReceiver = S.suspend(() =>
  S.Struct({
    Alias: S.optional(SensitiveString),
    AwsAccountId: SensitiveString,
  }),
).annotations({
  identifier: "AccountReceiver",
}) as any as S.Schema<AccountReceiver>;
export interface UpdateEngagementContextRequest {
  Catalog: string;
  EngagementIdentifier: string;
  ContextIdentifier: string;
  EngagementLastModifiedAt: Date;
  Type: string;
  Payload: (typeof UpdateEngagementContextPayload)["Type"];
}
export const UpdateEngagementContextRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ContextIdentifier: S.String,
    EngagementLastModifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Type: S.String,
    Payload: UpdateEngagementContextPayload,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateEngagementContext" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEngagementContextRequest",
}) as any as S.Schema<UpdateEngagementContextRequest>;
export interface CreateEngagementResponse {
  Id?: string;
  Arn?: string;
  ModifiedAt?: Date;
}
export const CreateEngagementResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateEngagementResponse",
}) as any as S.Schema<CreateEngagementResponse>;
export interface ListEngagementMembersResponse {
  EngagementMemberList: EngagementMembers;
  NextToken?: string;
}
export const ListEngagementMembersResponse = S.suspend(() =>
  S.Struct({
    EngagementMemberList: EngagementMembers,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementMembersResponse",
}) as any as S.Schema<ListEngagementMembersResponse>;
export interface StartEngagementFromOpportunityTaskResponse {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: string;
  Message?: string;
  ReasonCode?: string;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementId?: string;
  EngagementInvitationId?: string;
}
export const StartEngagementFromOpportunityTaskResponse = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(S.String),
    Message: S.optional(S.String),
    ReasonCode: S.optional(S.String),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementId: S.optional(S.String),
    EngagementInvitationId: S.optional(S.String),
  }),
).annotations({
  identifier: "StartEngagementFromOpportunityTaskResponse",
}) as any as S.Schema<StartEngagementFromOpportunityTaskResponse>;
export interface ListEngagementFromOpportunityTasksResponse {
  TaskSummaries?: ListEngagementFromOpportunityTaskSummaries;
  NextToken?: string;
}
export const ListEngagementFromOpportunityTasksResponse = S.suspend(() =>
  S.Struct({
    TaskSummaries: S.optional(ListEngagementFromOpportunityTaskSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementFromOpportunityTasksResponse",
}) as any as S.Schema<ListEngagementFromOpportunityTasksResponse>;
export type Receiver = { Account: AccountReceiver };
export const Receiver = S.Union(S.Struct({ Account: AccountReceiver }));
export interface SenderContact {
  Email: string | Redacted.Redacted<string>;
  FirstName?: string | Redacted.Redacted<string>;
  LastName?: string | Redacted.Redacted<string>;
  BusinessTitle?: string | Redacted.Redacted<string>;
  Phone?: string | Redacted.Redacted<string>;
}
export const SenderContact = S.suspend(() =>
  S.Struct({
    Email: SensitiveString,
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    BusinessTitle: S.optional(SensitiveString),
    Phone: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "SenderContact",
}) as any as S.Schema<SenderContact>;
export type SenderContactList = SenderContact[];
export const SenderContactList = S.Array(SenderContact);
export interface ProjectDetails {
  BusinessProblem: string | Redacted.Redacted<string>;
  Title: string;
  TargetCompletionDate: string;
  ExpectedCustomerSpend: ExpectedCustomerSpendList;
}
export const ProjectDetails = S.suspend(() =>
  S.Struct({
    BusinessProblem: SensitiveString,
    Title: S.String,
    TargetCompletionDate: S.String,
    ExpectedCustomerSpend: ExpectedCustomerSpendList,
  }),
).annotations({
  identifier: "ProjectDetails",
}) as any as S.Schema<ProjectDetails>;
export interface OpportunityInvitationPayload {
  SenderContacts?: SenderContactList;
  ReceiverResponsibilities: ReceiverResponsibilityList;
  Customer: EngagementCustomer;
  Project: ProjectDetails;
}
export const OpportunityInvitationPayload = S.suspend(() =>
  S.Struct({
    SenderContacts: S.optional(SenderContactList),
    ReceiverResponsibilities: ReceiverResponsibilityList,
    Customer: EngagementCustomer,
    Project: ProjectDetails,
  }),
).annotations({
  identifier: "OpportunityInvitationPayload",
}) as any as S.Schema<OpportunityInvitationPayload>;
export interface LeadInvitationCustomer {
  Industry?: string;
  CompanyName: string | Redacted.Redacted<string>;
  WebsiteUrl?: string | Redacted.Redacted<string>;
  CountryCode: string;
  AwsMaturity?: string;
  MarketSegment?: string;
}
export const LeadInvitationCustomer = S.suspend(() =>
  S.Struct({
    Industry: S.optional(S.String),
    CompanyName: SensitiveString,
    WebsiteUrl: S.optional(SensitiveString),
    CountryCode: S.String,
    AwsMaturity: S.optional(S.String),
    MarketSegment: S.optional(S.String),
  }),
).annotations({
  identifier: "LeadInvitationCustomer",
}) as any as S.Schema<LeadInvitationCustomer>;
export interface LeadInvitationInteraction {
  SourceType: string;
  SourceId: string;
  SourceName: string;
  Usecase?: string;
  ContactBusinessTitle: string | Redacted.Redacted<string>;
}
export const LeadInvitationInteraction = S.suspend(() =>
  S.Struct({
    SourceType: S.String,
    SourceId: S.String,
    SourceName: S.String,
    Usecase: S.optional(S.String),
    ContactBusinessTitle: SensitiveString,
  }),
).annotations({
  identifier: "LeadInvitationInteraction",
}) as any as S.Schema<LeadInvitationInteraction>;
export interface LeadInvitationPayload {
  Customer: LeadInvitationCustomer;
  Interaction: LeadInvitationInteraction;
}
export const LeadInvitationPayload = S.suspend(() =>
  S.Struct({
    Customer: LeadInvitationCustomer,
    Interaction: LeadInvitationInteraction,
  }),
).annotations({
  identifier: "LeadInvitationPayload",
}) as any as S.Schema<LeadInvitationPayload>;
export type Payload =
  | { OpportunityInvitation: OpportunityInvitationPayload }
  | { LeadInvitation: LeadInvitationPayload };
export const Payload = S.Union(
  S.Struct({ OpportunityInvitation: OpportunityInvitationPayload }),
  S.Struct({ LeadInvitation: LeadInvitationPayload }),
);
export interface GetEngagementInvitationResponse {
  Arn?: string;
  PayloadType?: string;
  Id: string;
  EngagementId?: string;
  EngagementTitle?: string;
  Status?: string;
  InvitationDate?: Date;
  ExpirationDate?: Date;
  SenderAwsAccountId?: string | Redacted.Redacted<string>;
  SenderCompanyName?: string;
  Receiver?: (typeof Receiver)["Type"];
  Catalog: string;
  RejectionReason?: string;
  Payload?: (typeof Payload)["Type"];
  InvitationMessage?: string | Redacted.Redacted<string>;
  EngagementDescription?: string;
  ExistingMembers?: EngagementMemberSummaries;
}
export const GetEngagementInvitationResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    PayloadType: S.optional(S.String),
    Id: S.String,
    EngagementId: S.optional(S.String),
    EngagementTitle: S.optional(S.String),
    Status: S.optional(S.String),
    InvitationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SenderAwsAccountId: S.optional(SensitiveString),
    SenderCompanyName: S.optional(S.String),
    Receiver: S.optional(Receiver),
    Catalog: S.String,
    RejectionReason: S.optional(S.String),
    Payload: S.optional(Payload),
    InvitationMessage: S.optional(SensitiveString),
    EngagementDescription: S.optional(S.String),
    ExistingMembers: S.optional(EngagementMemberSummaries),
  }),
).annotations({
  identifier: "GetEngagementInvitationResponse",
}) as any as S.Schema<GetEngagementInvitationResponse>;
export interface GetOpportunityResponse {
  Catalog: string;
  PrimaryNeedsFromAws?: PrimaryNeedsFromAws;
  NationalSecurity?: string;
  PartnerOpportunityIdentifier?: string;
  Customer?: Customer;
  Project?: Project;
  OpportunityType?: string;
  Marketing?: Marketing;
  SoftwareRevenue?: SoftwareRevenue;
  Id: string;
  Arn?: string;
  LastModifiedDate: Date;
  CreatedDate: Date;
  RelatedEntityIdentifiers: RelatedEntityIdentifiers;
  LifeCycle?: LifeCycle;
  OpportunityTeam?: PartnerOpportunityTeamMembersList;
}
export const GetOpportunityResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    PrimaryNeedsFromAws: S.optional(PrimaryNeedsFromAws),
    NationalSecurity: S.optional(S.String),
    PartnerOpportunityIdentifier: S.optional(S.String),
    Customer: S.optional(Customer),
    Project: S.optional(Project),
    OpportunityType: S.optional(S.String),
    Marketing: S.optional(Marketing),
    SoftwareRevenue: S.optional(SoftwareRevenue),
    Id: S.String,
    Arn: S.optional(S.String),
    LastModifiedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    CreatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
    RelatedEntityIdentifiers: RelatedEntityIdentifiers,
    LifeCycle: S.optional(LifeCycle),
    OpportunityTeam: S.optional(PartnerOpportunityTeamMembersList),
  }),
).annotations({
  identifier: "GetOpportunityResponse",
}) as any as S.Schema<GetOpportunityResponse>;
export interface ListOpportunityFromEngagementTasksResponse {
  TaskSummaries?: ListOpportunityFromEngagementTaskSummaries;
  NextToken?: string;
}
export const ListOpportunityFromEngagementTasksResponse = S.suspend(() =>
  S.Struct({
    TaskSummaries: S.optional(ListOpportunityFromEngagementTaskSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOpportunityFromEngagementTasksResponse",
}) as any as S.Schema<ListOpportunityFromEngagementTasksResponse>;
export interface ListEngagementResourceAssociationsResponse {
  EngagementResourceAssociationSummaries: EngagementResourceAssociationSummaryList;
  NextToken?: string;
}
export const ListEngagementResourceAssociationsResponse = S.suspend(() =>
  S.Struct({
    EngagementResourceAssociationSummaries:
      EngagementResourceAssociationSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementResourceAssociationsResponse",
}) as any as S.Schema<ListEngagementResourceAssociationsResponse>;
export interface ListResourceSnapshotsResponse {
  ResourceSnapshotSummaries: ResourceSnapshotSummaryList;
  NextToken?: string;
}
export const ListResourceSnapshotsResponse = S.suspend(() =>
  S.Struct({
    ResourceSnapshotSummaries: ResourceSnapshotSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceSnapshotsResponse",
}) as any as S.Schema<ListResourceSnapshotsResponse>;
export interface ProfileNextStepsHistory {
  Value: string;
  Time: Date;
}
export const ProfileNextStepsHistory = S.suspend(() =>
  S.Struct({
    Value: S.String,
    Time: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ProfileNextStepsHistory",
}) as any as S.Schema<ProfileNextStepsHistory>;
export type ProfileNextStepsHistories = ProfileNextStepsHistory[];
export const ProfileNextStepsHistories = S.Array(ProfileNextStepsHistory);
export interface EngagementSummary {
  Arn?: string;
  Id?: string;
  Title?: string;
  CreatedAt?: Date;
  CreatedBy?: string | Redacted.Redacted<string>;
  MemberCount?: number;
  ModifiedAt?: Date;
  ModifiedBy?: string | Redacted.Redacted<string>;
  ContextTypes?: EngagementContextTypeList;
}
export const EngagementSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Id: S.optional(S.String),
    Title: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreatedBy: S.optional(SensitiveString),
    MemberCount: S.optional(S.Number),
    ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ModifiedBy: S.optional(SensitiveString),
    ContextTypes: S.optional(EngagementContextTypeList),
  }),
).annotations({
  identifier: "EngagementSummary",
}) as any as S.Schema<EngagementSummary>;
export type EngagementSummaryList = EngagementSummary[];
export const EngagementSummaryList = S.Array(EngagementSummary);
export interface ListEngagementByAcceptingInvitationTaskSummary {
  TaskId?: string;
  TaskArn?: string;
  StartTime?: Date;
  TaskStatus?: string;
  Message?: string;
  ReasonCode?: string;
  OpportunityId?: string;
  ResourceSnapshotJobId?: string;
  EngagementInvitationId?: string;
}
export const ListEngagementByAcceptingInvitationTaskSummary = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    TaskStatus: S.optional(S.String),
    Message: S.optional(S.String),
    ReasonCode: S.optional(S.String),
    OpportunityId: S.optional(S.String),
    ResourceSnapshotJobId: S.optional(S.String),
    EngagementInvitationId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementByAcceptingInvitationTaskSummary",
}) as any as S.Schema<ListEngagementByAcceptingInvitationTaskSummary>;
export type ListEngagementByAcceptingInvitationTaskSummaries =
  ListEngagementByAcceptingInvitationTaskSummary[];
export const ListEngagementByAcceptingInvitationTaskSummaries = S.Array(
  ListEngagementByAcceptingInvitationTaskSummary,
);
export interface EngagementInvitationSummary {
  Arn?: string;
  PayloadType?: string;
  Id: string;
  EngagementId?: string;
  EngagementTitle?: string;
  Status?: string;
  InvitationDate?: Date;
  ExpirationDate?: Date;
  SenderAwsAccountId?: string | Redacted.Redacted<string>;
  SenderCompanyName?: string;
  Receiver?: (typeof Receiver)["Type"];
  Catalog: string;
  ParticipantType?: string;
}
export const EngagementInvitationSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    PayloadType: S.optional(S.String),
    Id: S.String,
    EngagementId: S.optional(S.String),
    EngagementTitle: S.optional(S.String),
    Status: S.optional(S.String),
    InvitationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    SenderAwsAccountId: S.optional(SensitiveString),
    SenderCompanyName: S.optional(S.String),
    Receiver: S.optional(Receiver),
    Catalog: S.String,
    ParticipantType: S.optional(S.String),
  }),
).annotations({
  identifier: "EngagementInvitationSummary",
}) as any as S.Schema<EngagementInvitationSummary>;
export type EngagementInvitationSummaries = EngagementInvitationSummary[];
export const EngagementInvitationSummaries = S.Array(
  EngagementInvitationSummary,
);
export interface AwsOpportunityLifeCycle {
  TargetCloseDate?: string;
  ClosedLostReason?: string;
  Stage?: string;
  NextSteps?: string | Redacted.Redacted<string>;
  NextStepsHistory?: ProfileNextStepsHistories;
}
export const AwsOpportunityLifeCycle = S.suspend(() =>
  S.Struct({
    TargetCloseDate: S.optional(S.String),
    ClosedLostReason: S.optional(S.String),
    Stage: S.optional(S.String),
    NextSteps: S.optional(SensitiveString),
    NextStepsHistory: S.optional(ProfileNextStepsHistories),
  }),
).annotations({
  identifier: "AwsOpportunityLifeCycle",
}) as any as S.Schema<AwsOpportunityLifeCycle>;
export interface ResourceSnapshotJobSummary {
  Id?: string;
  Arn?: string;
  EngagementId?: string;
  Status?: string;
}
export const ResourceSnapshotJobSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    EngagementId: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceSnapshotJobSummary",
}) as any as S.Schema<ResourceSnapshotJobSummary>;
export type ResourceSnapshotJobSummaryList = ResourceSnapshotJobSummary[];
export const ResourceSnapshotJobSummaryList = S.Array(
  ResourceSnapshotJobSummary,
);
export interface SolutionBase {
  Catalog: string;
  Id: string;
  Arn?: string;
  Name: string;
  Status: string;
  Category: string;
  CreatedDate: Date;
}
export const SolutionBase = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.String,
    Arn: S.optional(S.String),
    Name: S.String,
    Status: S.String,
    Category: S.String,
    CreatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({ identifier: "SolutionBase" }) as any as S.Schema<SolutionBase>;
export type SolutionList = SolutionBase[];
export const SolutionList = S.Array(SolutionBase);
export interface LifeCycleForView {
  TargetCloseDate?: string;
  ReviewStatus?: string;
  Stage?: string;
  NextSteps?: string | Redacted.Redacted<string>;
}
export const LifeCycleForView = S.suspend(() =>
  S.Struct({
    TargetCloseDate: S.optional(S.String),
    ReviewStatus: S.optional(S.String),
    Stage: S.optional(S.String),
    NextSteps: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "LifeCycleForView",
}) as any as S.Schema<LifeCycleForView>;
export interface ProjectView {
  DeliveryModels?: DeliveryModels;
  ExpectedCustomerSpend?: ExpectedCustomerSpendList;
  CustomerUseCase?: string;
  SalesActivities?: SalesActivities;
  OtherSolutionDescription?: string | Redacted.Redacted<string>;
}
export const ProjectView = S.suspend(() =>
  S.Struct({
    DeliveryModels: S.optional(DeliveryModels),
    ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
    CustomerUseCase: S.optional(S.String),
    SalesActivities: S.optional(SalesActivities),
    OtherSolutionDescription: S.optional(SensitiveString),
  }),
).annotations({ identifier: "ProjectView" }) as any as S.Schema<ProjectView>;
export interface UpdateEngagementContextResponse {
  EngagementId: string;
  EngagementArn: string;
  EngagementLastModifiedAt: Date;
  ContextId: string;
}
export const UpdateEngagementContextResponse = S.suspend(() =>
  S.Struct({
    EngagementId: S.String,
    EngagementArn: S.String,
    EngagementLastModifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    ContextId: S.String,
  }),
).annotations({
  identifier: "UpdateEngagementContextResponse",
}) as any as S.Schema<UpdateEngagementContextResponse>;
export interface ListEngagementsResponse {
  EngagementSummaryList: EngagementSummaryList;
  NextToken?: string;
}
export const ListEngagementsResponse = S.suspend(() =>
  S.Struct({
    EngagementSummaryList: EngagementSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementsResponse",
}) as any as S.Schema<ListEngagementsResponse>;
export interface ListEngagementByAcceptingInvitationTasksResponse {
  TaskSummaries?: ListEngagementByAcceptingInvitationTaskSummaries;
  NextToken?: string;
}
export const ListEngagementByAcceptingInvitationTasksResponse = S.suspend(() =>
  S.Struct({
    TaskSummaries: S.optional(ListEngagementByAcceptingInvitationTaskSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementByAcceptingInvitationTasksResponse",
}) as any as S.Schema<ListEngagementByAcceptingInvitationTasksResponse>;
export interface ListEngagementInvitationsResponse {
  EngagementInvitationSummaries?: EngagementInvitationSummaries;
  NextToken?: string;
}
export const ListEngagementInvitationsResponse = S.suspend(() =>
  S.Struct({
    EngagementInvitationSummaries: S.optional(EngagementInvitationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngagementInvitationsResponse",
}) as any as S.Schema<ListEngagementInvitationsResponse>;
export interface CreateOpportunityRequest {
  Catalog: string;
  PrimaryNeedsFromAws?: PrimaryNeedsFromAws;
  NationalSecurity?: string;
  PartnerOpportunityIdentifier?: string;
  Customer?: Customer;
  Project?: Project;
  OpportunityType?: string;
  Marketing?: Marketing;
  SoftwareRevenue?: SoftwareRevenue;
  ClientToken: string;
  LifeCycle?: LifeCycle;
  Origin?: string;
  OpportunityTeam?: PartnerOpportunityTeamMembersList;
  Tags?: TagList;
}
export const CreateOpportunityRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    PrimaryNeedsFromAws: S.optional(PrimaryNeedsFromAws),
    NationalSecurity: S.optional(S.String),
    PartnerOpportunityIdentifier: S.optional(S.String),
    Customer: S.optional(Customer),
    Project: S.optional(Project),
    OpportunityType: S.optional(S.String),
    Marketing: S.optional(Marketing),
    SoftwareRevenue: S.optional(SoftwareRevenue),
    ClientToken: S.String,
    LifeCycle: S.optional(LifeCycle),
    Origin: S.optional(S.String),
    OpportunityTeam: S.optional(PartnerOpportunityTeamMembersList),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateOpportunity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOpportunityRequest",
}) as any as S.Schema<CreateOpportunityRequest>;
export interface ListResourceSnapshotJobsResponse {
  ResourceSnapshotJobSummaries: ResourceSnapshotJobSummaryList;
  NextToken?: string;
}
export const ListResourceSnapshotJobsResponse = S.suspend(() =>
  S.Struct({
    ResourceSnapshotJobSummaries: ResourceSnapshotJobSummaryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceSnapshotJobsResponse",
}) as any as S.Schema<ListResourceSnapshotJobsResponse>;
export interface ListSolutionsResponse {
  SolutionSummaries: SolutionList;
  NextToken?: string;
}
export const ListSolutionsResponse = S.suspend(() =>
  S.Struct({
    SolutionSummaries: SolutionList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSolutionsResponse",
}) as any as S.Schema<ListSolutionsResponse>;
export interface LifeCycleSummary {
  Stage?: string;
  ClosedLostReason?: string;
  NextSteps?: string | Redacted.Redacted<string>;
  TargetCloseDate?: string;
  ReviewStatus?: string;
  ReviewComments?: string;
  ReviewStatusReason?: string;
}
export const LifeCycleSummary = S.suspend(() =>
  S.Struct({
    Stage: S.optional(S.String),
    ClosedLostReason: S.optional(S.String),
    NextSteps: S.optional(SensitiveString),
    TargetCloseDate: S.optional(S.String),
    ReviewStatus: S.optional(S.String),
    ReviewComments: S.optional(S.String),
    ReviewStatusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "LifeCycleSummary",
}) as any as S.Schema<LifeCycleSummary>;
export interface ProjectSummary {
  DeliveryModels?: DeliveryModels;
  ExpectedCustomerSpend?: ExpectedCustomerSpendList;
}
export const ProjectSummary = S.suspend(() =>
  S.Struct({
    DeliveryModels: S.optional(DeliveryModels),
    ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
  }),
).annotations({
  identifier: "ProjectSummary",
}) as any as S.Schema<ProjectSummary>;
export interface OpportunitySummaryView {
  OpportunityType?: string;
  Lifecycle?: LifeCycleForView;
  OpportunityTeam?: PartnerOpportunityTeamMembersList;
  PrimaryNeedsFromAws?: PrimaryNeedsFromAws;
  Customer?: Customer;
  Project?: ProjectView;
  RelatedEntityIdentifiers?: RelatedEntityIdentifiers;
}
export const OpportunitySummaryView = S.suspend(() =>
  S.Struct({
    OpportunityType: S.optional(S.String),
    Lifecycle: S.optional(LifeCycleForView),
    OpportunityTeam: S.optional(PartnerOpportunityTeamMembersList),
    PrimaryNeedsFromAws: S.optional(PrimaryNeedsFromAws),
    Customer: S.optional(Customer),
    Project: S.optional(ProjectView),
    RelatedEntityIdentifiers: S.optional(RelatedEntityIdentifiers),
  }),
).annotations({
  identifier: "OpportunitySummaryView",
}) as any as S.Schema<OpportunitySummaryView>;
export type AmountMap = { [key: string]: string | Redacted.Redacted<string> };
export const AmountMap = S.Record({ key: S.String, value: SensitiveString });
export interface Invitation {
  Message: string | Redacted.Redacted<string>;
  Receiver: (typeof Receiver)["Type"];
  Payload: (typeof Payload)["Type"];
}
export const Invitation = S.suspend(() =>
  S.Struct({ Message: SensitiveString, Receiver: Receiver, Payload: Payload }),
).annotations({ identifier: "Invitation" }) as any as S.Schema<Invitation>;
export type ResourceSnapshotPayload = {
  OpportunitySummary: OpportunitySummaryView;
};
export const ResourceSnapshotPayload = S.Union(
  S.Struct({ OpportunitySummary: OpportunitySummaryView }),
);
export interface AccountSummary {
  Industry?: string;
  OtherIndustry?: string;
  CompanyName: string | Redacted.Redacted<string>;
  WebsiteUrl?: string | Redacted.Redacted<string>;
  Address?: AddressSummary;
}
export const AccountSummary = S.suspend(() =>
  S.Struct({
    Industry: S.optional(S.String),
    OtherIndustry: S.optional(S.String),
    CompanyName: SensitiveString,
    WebsiteUrl: S.optional(SensitiveString),
    Address: S.optional(AddressSummary),
  }),
).annotations({
  identifier: "AccountSummary",
}) as any as S.Schema<AccountSummary>;
export interface CreateEngagementContextRequest {
  Catalog: string;
  EngagementIdentifier: string;
  ClientToken: string;
  Type: string;
  Payload: (typeof EngagementContextPayload)["Type"];
}
export const CreateEngagementContextRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ClientToken: S.String,
    Type: S.String,
    Payload: EngagementContextPayload,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateEngagementContext" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEngagementContextRequest",
}) as any as S.Schema<CreateEngagementContextRequest>;
export interface CreateEngagementInvitationRequest {
  Catalog: string;
  ClientToken: string;
  EngagementIdentifier: string;
  Invitation: Invitation;
}
export const CreateEngagementInvitationRequest = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    ClientToken: S.String,
    EngagementIdentifier: S.String,
    Invitation: Invitation,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateEngagementInvitation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEngagementInvitationRequest",
}) as any as S.Schema<CreateEngagementInvitationRequest>;
export interface CreateOpportunityResponse {
  Id: string;
  PartnerOpportunityIdentifier?: string;
  LastModifiedDate?: Date;
}
export const CreateOpportunityResponse = S.suspend(() =>
  S.Struct({
    Id: S.String,
    PartnerOpportunityIdentifier: S.optional(S.String),
    LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CreateOpportunityResponse",
}) as any as S.Schema<CreateOpportunityResponse>;
export interface AwsProductOptimization {
  Description: string;
  SavingsAmount: string | Redacted.Redacted<string>;
}
export const AwsProductOptimization = S.suspend(() =>
  S.Struct({ Description: S.String, SavingsAmount: SensitiveString }),
).annotations({
  identifier: "AwsProductOptimization",
}) as any as S.Schema<AwsProductOptimization>;
export type AwsProductOptimizationsList = AwsProductOptimization[];
export const AwsProductOptimizationsList = S.Array(AwsProductOptimization);
export interface GetResourceSnapshotResponse {
  Catalog: string;
  Arn?: string;
  CreatedBy?: string | Redacted.Redacted<string>;
  CreatedAt?: Date;
  EngagementId?: string;
  ResourceType?: string;
  ResourceId?: string;
  ResourceSnapshotTemplateName?: string;
  Revision?: number;
  Payload?: (typeof ResourceSnapshotPayload)["Type"];
}
export const GetResourceSnapshotResponse = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Arn: S.optional(S.String),
    CreatedBy: S.optional(SensitiveString),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EngagementId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    ResourceSnapshotTemplateName: S.optional(S.String),
    Revision: S.optional(S.Number),
    Payload: S.optional(ResourceSnapshotPayload),
  }),
).annotations({
  identifier: "GetResourceSnapshotResponse",
}) as any as S.Schema<GetResourceSnapshotResponse>;
export interface CustomerSummary {
  Account?: AccountSummary;
}
export const CustomerSummary = S.suspend(() =>
  S.Struct({ Account: S.optional(AccountSummary) }),
).annotations({
  identifier: "CustomerSummary",
}) as any as S.Schema<CustomerSummary>;
export interface AwsProductDetails {
  ProductCode: string;
  ServiceCode?: string;
  Categories: StringList;
  Amount?: string | Redacted.Redacted<string>;
  OptimizedAmount?: string | Redacted.Redacted<string>;
  PotentialSavingsAmount?: string | Redacted.Redacted<string>;
  Optimizations: AwsProductOptimizationsList;
}
export const AwsProductDetails = S.suspend(() =>
  S.Struct({
    ProductCode: S.String,
    ServiceCode: S.optional(S.String),
    Categories: StringList,
    Amount: S.optional(SensitiveString),
    OptimizedAmount: S.optional(SensitiveString),
    PotentialSavingsAmount: S.optional(SensitiveString),
    Optimizations: AwsProductOptimizationsList,
  }),
).annotations({
  identifier: "AwsProductDetails",
}) as any as S.Schema<AwsProductDetails>;
export type AwsProductsList = AwsProductDetails[];
export const AwsProductsList = S.Array(AwsProductDetails);
export interface OpportunitySummary {
  Catalog: string;
  Id?: string;
  Arn?: string;
  PartnerOpportunityIdentifier?: string;
  OpportunityType?: string;
  LastModifiedDate?: Date;
  CreatedDate?: Date;
  LifeCycle?: LifeCycleSummary;
  Customer?: CustomerSummary;
  Project?: ProjectSummary;
}
export const OpportunitySummary = S.suspend(() =>
  S.Struct({
    Catalog: S.String,
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    PartnerOpportunityIdentifier: S.optional(S.String),
    OpportunityType: S.optional(S.String),
    LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LifeCycle: S.optional(LifeCycleSummary),
    Customer: S.optional(CustomerSummary),
    Project: S.optional(ProjectSummary),
  }),
).annotations({
  identifier: "OpportunitySummary",
}) as any as S.Schema<OpportunitySummary>;
export type OpportunitySummaries = OpportunitySummary[];
export const OpportunitySummaries = S.Array(OpportunitySummary);
export interface AwsProductInsights {
  CurrencyCode: string;
  Frequency: string;
  TotalAmount?: string | Redacted.Redacted<string>;
  TotalOptimizedAmount?: string | Redacted.Redacted<string>;
  TotalPotentialSavingsAmount?: string | Redacted.Redacted<string>;
  TotalAmountByCategory: AmountMap;
  AwsProducts: AwsProductsList;
}
export const AwsProductInsights = S.suspend(() =>
  S.Struct({
    CurrencyCode: S.String,
    Frequency: S.String,
    TotalAmount: S.optional(SensitiveString),
    TotalOptimizedAmount: S.optional(SensitiveString),
    TotalPotentialSavingsAmount: S.optional(SensitiveString),
    TotalAmountByCategory: AmountMap,
    AwsProducts: AwsProductsList,
  }),
).annotations({
  identifier: "AwsProductInsights",
}) as any as S.Schema<AwsProductInsights>;
export interface CreateEngagementContextResponse {
  EngagementId?: string;
  EngagementArn?: string;
  EngagementLastModifiedAt?: Date;
  ContextId?: string;
}
export const CreateEngagementContextResponse = S.suspend(() =>
  S.Struct({
    EngagementId: S.optional(S.String),
    EngagementArn: S.optional(S.String),
    EngagementLastModifiedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ContextId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateEngagementContextResponse",
}) as any as S.Schema<CreateEngagementContextResponse>;
export interface CreateEngagementInvitationResponse {
  Id: string;
  Arn: string;
}
export const CreateEngagementInvitationResponse = S.suspend(() =>
  S.Struct({ Id: S.String, Arn: S.String }),
).annotations({
  identifier: "CreateEngagementInvitationResponse",
}) as any as S.Schema<CreateEngagementInvitationResponse>;
export interface ListOpportunitiesResponse {
  OpportunitySummaries: OpportunitySummaries;
  NextToken?: string;
}
export const ListOpportunitiesResponse = S.suspend(() =>
  S.Struct({
    OpportunitySummaries: OpportunitySummaries,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOpportunitiesResponse",
}) as any as S.Schema<ListOpportunitiesResponse>;
export interface AwsProductsSpendInsightsBySource {
  Partner?: AwsProductInsights;
  AWS?: AwsProductInsights;
}
export const AwsProductsSpendInsightsBySource = S.suspend(() =>
  S.Struct({
    Partner: S.optional(AwsProductInsights),
    AWS: S.optional(AwsProductInsights),
  }),
).annotations({
  identifier: "AwsProductsSpendInsightsBySource",
}) as any as S.Schema<AwsProductsSpendInsightsBySource>;
export interface ValidationExceptionError {
  FieldName?: string;
  Message: string;
  Code: string;
}
export const ValidationExceptionError = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(S.String),
    Message: S.String,
    Code: S.String,
  }),
).annotations({
  identifier: "ValidationExceptionError",
}) as any as S.Schema<ValidationExceptionError>;
export type ValidationExceptionErrorList = ValidationExceptionError[];
export const ValidationExceptionErrorList = S.Array(ValidationExceptionError);
export interface AwsOpportunityInsights {
  NextBestActions?: string;
  EngagementScore?: string;
  AwsProductsSpendInsightsBySource?: AwsProductsSpendInsightsBySource;
}
export const AwsOpportunityInsights = S.suspend(() =>
  S.Struct({
    NextBestActions: S.optional(S.String),
    EngagementScore: S.optional(S.String),
    AwsProductsSpendInsightsBySource: S.optional(
      AwsProductsSpendInsightsBySource,
    ),
  }),
).annotations({
  identifier: "AwsOpportunityInsights",
}) as any as S.Schema<AwsOpportunityInsights>;
export interface GetAwsOpportunitySummaryResponse {
  RelatedOpportunityId?: string;
  Origin?: string;
  InvolvementType?: string;
  Visibility?: string;
  LifeCycle?: AwsOpportunityLifeCycle;
  OpportunityTeam?: AwsOpportunityTeamMembersList;
  Insights?: AwsOpportunityInsights;
  InvolvementTypeChangeReason?: string;
  RelatedEntityIds?: AwsOpportunityRelatedEntities;
  Customer?: AwsOpportunityCustomer;
  Project?: AwsOpportunityProject;
  Catalog: string;
}
export const GetAwsOpportunitySummaryResponse = S.suspend(() =>
  S.Struct({
    RelatedOpportunityId: S.optional(S.String),
    Origin: S.optional(S.String),
    InvolvementType: S.optional(S.String),
    Visibility: S.optional(S.String),
    LifeCycle: S.optional(AwsOpportunityLifeCycle),
    OpportunityTeam: S.optional(AwsOpportunityTeamMembersList),
    Insights: S.optional(AwsOpportunityInsights),
    InvolvementTypeChangeReason: S.optional(S.String),
    RelatedEntityIds: S.optional(AwsOpportunityRelatedEntities),
    Customer: S.optional(AwsOpportunityCustomer),
    Project: S.optional(AwsOpportunityProject),
    Catalog: S.String,
  }),
).annotations({
  identifier: "GetAwsOpportunitySummaryResponse",
}) as any as S.Schema<GetAwsOpportunitySummaryResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.String,
    ErrorList: S.optional(ValidationExceptionErrorList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Use this action to retrieve the engagement record for a given `EngagementIdentifier`.
 */
export const getEngagement: (
  input: GetEngagementRequest,
) => Effect.Effect<
  GetEngagementResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEngagementRequest,
  output: GetEngagementResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a summary of an AWS Opportunity. This summary includes high-level details about the opportunity sourced from AWS, such as lifecycle information, customer details, and involvement type. It is useful for tracking updates on the AWS opportunity corresponding to an opportunity in the partner's account.
 */
export const getAwsOpportunitySummary: (
  input: GetAwsOpportunitySummaryRequest,
) => Effect.Effect<
  GetAwsOpportunitySummaryResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAwsOpportunitySummaryRequest,
  output: GetAwsOpportunitySummaryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an `Opportunity` record in Partner Central. Use this operation to create a potential business opportunity for submission to Amazon Web Services. Creating an opportunity sets `Lifecycle.ReviewStatus` to `Pending Submission`.
 *
 * To submit an opportunity, follow these steps:
 *
 * - To create the opportunity, use `CreateOpportunity`.
 *
 * - To associate a solution with the opportunity, use `AssociateOpportunity`.
 *
 * - To start the engagement with AWS, use `StartEngagementFromOpportunity`.
 *
 * After submission, you can't edit the opportunity until the review is complete. But opportunities in the `Pending Submission` state must have complete details. You can update the opportunity while it's in the `Pending Submission` state.
 *
 * There's a set of mandatory fields to create opportunities, but consider providing optional fields to enrich the opportunity record.
 */
export const createOpportunity: (
  input: CreateOpportunityRequest,
) => Effect.Effect<
  CreateOpportunityResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOpportunityRequest,
  output: CreateOpportunityResponse,
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
 * Use this action to retrieve a specific snapshot record.
 */
export const getResourceSnapshot: (
  input: GetResourceSnapshotRequest,
) => Effect.Effect<
  GetResourceSnapshotResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceSnapshotRequest,
  output: GetResourceSnapshotResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Similar to `StartEngagementByAcceptingInvitationTask`, this action is asynchronous and performs multiple steps before completion. This action orchestrates a comprehensive workflow that combines multiple API operations into a single task to create and initiate an engagement from an existing opportunity. It automatically executes a sequence of operations including `GetOpportunity`, `CreateEngagement` (if it doesn't exist), `CreateResourceSnapshot`, `CreateResourceSnapshotJob`, `CreateEngagementInvitation` (if not already invited/accepted), and `SubmitOpportunity`.
 */
export const startEngagementFromOpportunityTask: (
  input: StartEngagementFromOpportunityTaskRequest,
) => Effect.Effect<
  StartEngagementFromOpportunityTaskResponse,
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
  input: StartEngagementFromOpportunityTaskRequest,
  output: StartEngagementFromOpportunityTaskResponse,
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
 * This action allows users to retrieve a list of Engagement records from Partner Central. This action can be used to manage and track various engagements across different stages of the partner selling process.
 */
export const listEngagements: {
  (
    input: ListEngagementsRequest,
  ): Effect.Effect<
    ListEngagementsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementsRequest,
  ) => Stream.Stream<
    ListEngagementsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementsRequest,
  ) => Stream.Stream<
    EngagementSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementsRequest,
  output: ListEngagementsResponse,
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
    items: "EngagementSummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all in-progress, completed, or failed StartEngagementByAcceptingInvitationTask tasks that were initiated by the caller's account.
 */
export const listEngagementByAcceptingInvitationTasks: {
  (
    input: ListEngagementByAcceptingInvitationTasksRequest,
  ): Effect.Effect<
    ListEngagementByAcceptingInvitationTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementByAcceptingInvitationTasksRequest,
  ) => Stream.Stream<
    ListEngagementByAcceptingInvitationTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementByAcceptingInvitationTasksRequest,
  ) => Stream.Stream<
    ListEngagementByAcceptingInvitationTaskSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementByAcceptingInvitationTasksRequest,
  output: ListEngagementByAcceptingInvitationTasksResponse,
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
    items: "TaskSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of engagement invitations sent to the partner. This allows partners to view all pending or past engagement invitations, helping them track opportunities shared by AWS.
 */
export const listEngagementInvitations: {
  (
    input: ListEngagementInvitationsRequest,
  ): Effect.Effect<
    ListEngagementInvitationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementInvitationsRequest,
  ) => Stream.Stream<
    ListEngagementInvitationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementInvitationsRequest,
  ) => Stream.Stream<
    EngagementInvitationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementInvitationsRequest,
  output: ListEngagementInvitationsResponse,
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
    items: "EngagementInvitationSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists resource snapshot jobs owned by the customer. This operation supports various filtering scenarios, including listing all jobs owned by the caller, jobs for a specific engagement, jobs with a specific status, or any combination of these filters.
 */
export const listResourceSnapshotJobs: {
  (
    input: ListResourceSnapshotJobsRequest,
  ): Effect.Effect<
    ListResourceSnapshotJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceSnapshotJobsRequest,
  ) => Stream.Stream<
    ListResourceSnapshotJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceSnapshotJobsRequest,
  ) => Stream.Stream<
    ResourceSnapshotJobSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceSnapshotJobsRequest,
  output: ListResourceSnapshotJobsResponse,
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
    items: "ResourceSnapshotJobSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of Partner Solutions that the partner registered on Partner Central. This API is used to generate a list of solutions that an end user selects from for association with an opportunity.
 */
export const listSolutions: {
  (
    input: ListSolutionsRequest,
  ): Effect.Effect<
    ListSolutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSolutionsRequest,
  ) => Stream.Stream<
    ListSolutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSolutionsRequest,
  ) => Stream.Stream<
    SolutionBase,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSolutionsRequest,
  output: ListSolutionsResponse,
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
    items: "SolutionSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the details of member partners in an Engagement. This operation can only be invoked by members of the Engagement. The `ListEngagementMembers` operation allows you to fetch information about the members of a specific Engagement. This action is restricted to members of the Engagement being queried.
 */
export const listEngagementMembers: {
  (
    input: ListEngagementMembersRequest,
  ): Effect.Effect<
    ListEngagementMembersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementMembersRequest,
  ) => Stream.Stream<
    ListEngagementMembersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementMembersRequest,
  ) => Stream.Stream<
    EngagementMember,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementMembersRequest,
  output: ListEngagementMembersResponse,
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
    items: "EngagementMemberList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all in-progress, completed, or failed `EngagementFromOpportunity` tasks that were initiated by the caller's account.
 */
export const listEngagementFromOpportunityTasks: {
  (
    input: ListEngagementFromOpportunityTasksRequest,
  ): Effect.Effect<
    ListEngagementFromOpportunityTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementFromOpportunityTasksRequest,
  ) => Stream.Stream<
    ListEngagementFromOpportunityTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementFromOpportunityTasksRequest,
  ) => Stream.Stream<
    ListEngagementFromOpportunityTaskSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementFromOpportunityTasksRequest,
  output: ListEngagementFromOpportunityTasksResponse,
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
    items: "TaskSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the details of an engagement invitation shared by AWS with a partner. The information includes aspects such as customer, project details, and lifecycle information. To connect an engagement invitation with an opportunity, match the invitation’s `Payload.Project.Title` with opportunity `Project.Title`.
 */
export const getEngagementInvitation: (
  input: GetEngagementInvitationRequest,
) => Effect.Effect<
  GetEngagementInvitationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEngagementInvitationRequest,
  output: GetEngagementInvitationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Fetches the `Opportunity` record from Partner Central by a given `Identifier`.
 *
 * Use the `ListOpportunities` action or the event notification (from Amazon EventBridge) to obtain this identifier.
 */
export const getOpportunity: (
  input: GetOpportunityRequest,
) => Effect.Effect<
  GetOpportunityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOpportunityRequest,
  output: GetOpportunityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all in-progress, completed, or failed opportunity creation tasks from engagements that were initiated by the caller's account.
 */
export const listOpportunityFromEngagementTasks: {
  (
    input: ListOpportunityFromEngagementTasksRequest,
  ): Effect.Effect<
    ListOpportunityFromEngagementTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOpportunityFromEngagementTasksRequest,
  ) => Stream.Stream<
    ListOpportunityFromEngagementTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOpportunityFromEngagementTasksRequest,
  ) => Stream.Stream<
    ListOpportunityFromEngagementTaskSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOpportunityFromEngagementTasksRequest,
  output: ListOpportunityFromEngagementTasksResponse,
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
    items: "TaskSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the associations between resources and engagements where the caller is a member and has at least one snapshot in the engagement.
 */
export const listEngagementResourceAssociations: {
  (
    input: ListEngagementResourceAssociationsRequest,
  ): Effect.Effect<
    ListEngagementResourceAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementResourceAssociationsRequest,
  ) => Stream.Stream<
    ListEngagementResourceAssociationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementResourceAssociationsRequest,
  ) => Stream.Stream<
    EngagementResourceAssociationSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementResourceAssociationsRequest,
  output: ListEngagementResourceAssociationsResponse,
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
    items: "EngagementResourceAssociationSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of resource view snapshots based on specified criteria. This operation supports various use cases, including:
 *
 * - Fetching all snapshots associated with an engagement.
 *
 * - Retrieving snapshots of a specific resource type within an engagement.
 *
 * - Obtaining snapshots for a particular resource using a specified template.
 *
 * - Accessing the latest snapshot of a resource within an engagement.
 *
 * - Filtering snapshots by resource owner.
 */
export const listResourceSnapshots: {
  (
    input: ListResourceSnapshotsRequest,
  ): Effect.Effect<
    ListResourceSnapshotsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceSnapshotsRequest,
  ) => Stream.Stream<
    ListResourceSnapshotsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceSnapshotsRequest,
  ) => Stream.Stream<
    ResourceSnapshotSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceSnapshotsRequest,
  output: ListResourceSnapshotsResponse,
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
    items: "ResourceSnapshotSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the `Opportunity` record identified by a given `Identifier`. This operation allows you to modify the details of an existing opportunity to reflect the latest information and progress. Use this action to keep the opportunity record up-to-date and accurate.
 *
 * When you perform updates, include the entire payload with each request. If any field is omitted, the API assumes that the field is set to `null`. The best practice is to always perform a `GetOpportunity` to retrieve the latest values, then send the complete payload with the updated values to be changed.
 */
export const updateOpportunity: (
  input: UpdateOpportunityRequest,
) => Effect.Effect<
  UpdateOpportunityResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateOpportunityRequest,
  output: UpdateOpportunityResponse,
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
 * Use the `AcceptEngagementInvitation` action to accept an engagement invitation shared by AWS. Accepting the invitation indicates your willingness to participate in the engagement, granting you access to all engagement-related data.
 */
export const acceptEngagementInvitation: (
  input: AcceptEngagementInvitationRequest,
) => Effect.Effect<
  AcceptEngagementInvitationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptEngagementInvitationRequest,
  output: AcceptEngagementInvitationResponse,
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
 * This action rejects an `EngagementInvitation` that AWS shared. Rejecting an invitation indicates that the partner doesn't want to pursue the opportunity, and all related data will become inaccessible thereafter.
 */
export const rejectEngagementInvitation: (
  input: RejectEngagementInvitationRequest,
) => Effect.Effect<
  RejectEngagementInvitationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectEngagementInvitationRequest,
  output: RejectEngagementInvitationResponse,
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
 * Use this action to deletes a previously created resource snapshot job. The job must be in a stopped state before it can be deleted.
 */
export const deleteResourceSnapshotJob: (
  input: DeleteResourceSnapshotJobRequest,
) => Effect.Effect<
  DeleteResourceSnapshotJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceSnapshotJobRequest,
  output: DeleteResourceSnapshotJobResponse,
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
 * Assigns one or more tags (key-value pairs) to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
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
 * Enables you to reassign an existing `Opportunity` to another user within your Partner Central account. The specified user receives the opportunity, and it appears on their Partner Central dashboard, allowing them to take necessary actions or proceed with the opportunity.
 *
 * This is useful for distributing opportunities to the appropriate team members or departments within your organization, ensuring that each opportunity is handled by the right person. By default, the opportunity owner is the one who creates it. Currently, there's no API to enumerate the list of available users.
 */
export const assignOpportunity: (
  input: AssignOpportunityRequest,
) => Effect.Effect<
  AssignOpportunityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssignOpportunityRequest,
  output: AssignOpportunityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use this action to retrieves information about a specific resource snapshot job.
 */
export const getResourceSnapshotJob: (
  input: GetResourceSnapshotJobRequest,
) => Effect.Effect<
  GetResourceSnapshotJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceSnapshotJobRequest,
  output: GetResourceSnapshotJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to create a formal association between an `Opportunity` and various related entities, enriching the context and details of the opportunity for better collaboration and decision making. You can associate an opportunity with the following entity types:
 *
 * - Partner Solution: A software product or consulting practice created and delivered by Partners. Partner Solutions help customers address business challenges using Amazon Web Services services.
 *
 * - Amazon Web Services Products: Amazon Web Services offers many products and services that provide scalable, reliable, and cost-effective infrastructure solutions. For the latest list of Amazon Web Services products, see Amazon Web Services products.
 *
 * - Amazon Web Services Marketplace private offer: Allows Amazon Web Services Marketplace sellers to extend custom pricing and terms to individual Amazon Web Services customers. Sellers can negotiate custom prices, payment schedules, and end user license terms through private offers, enabling Amazon Web Services customers to acquire software solutions tailored to their specific needs. For more information, see Private offers in Amazon Web Services Marketplace.
 *
 * To obtain identifiers for these entities, use the following methods:
 *
 * - Solution: Use the `ListSolutions` operation.
 *
 * - AWS Products: For the latest list of Amazon Web Services products, see Amazon Web Services products.
 *
 * - Amazon Web Services Marketplace private offer: Use the Using the Amazon Web Services Marketplace Catalog API to list entities. Specifically, use the `ListEntities` operation to retrieve a list of private offers. The request returns the details of available private offers. For more information, see ListEntities.
 */
export const associateOpportunity: (
  input: AssociateOpportunityRequest,
) => Effect.Effect<
  AssociateOpportunityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateOpportunityRequest,
  output: AssociateOpportunityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Allows you to remove an existing association between an `Opportunity` and related entities, such as a Partner Solution, Amazon Web Services product, or an Amazon Web Services Marketplace offer. This operation is the counterpart to `AssociateOpportunity`, and it provides flexibility to manage associations as business needs change.
 *
 * Use this operation to update the associations of an `Opportunity` due to changes in the related entities, or if an association was made in error. Ensuring accurate associations helps maintain clarity and accuracy to track and manage business opportunities. When you replace an entity, first attach the new entity and then disassociate the one to be removed, especially if it's the last remaining entity that's required.
 */
export const disassociateOpportunity: (
  input: DisassociateOpportunityRequest,
) => Effect.Effect<
  DisassociateOpportunityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateOpportunityRequest,
  output: DisassociateOpportunityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use this action to submit an Opportunity that was previously created by partner for AWS review. After you perform this action, the Opportunity becomes non-editable until it is reviewed by AWS and has ` LifeCycle.ReviewStatus ` as either `Approved` or `Action Required`.
 */
export const submitOpportunity: (
  input: SubmitOpportunityRequest,
) => Effect.Effect<
  SubmitOpportunityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitOpportunityRequest,
  output: SubmitOpportunityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a resource snapshot job that has been previously created.
 */
export const startResourceSnapshotJob: (
  input: StartResourceSnapshotJobRequest,
) => Effect.Effect<
  StartResourceSnapshotJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartResourceSnapshotJobRequest,
  output: StartResourceSnapshotJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops a resource snapshot job. The job must be started prior to being stopped.
 */
export const stopResourceSnapshotJob: (
  input: StopResourceSnapshotJobRequest,
) => Effect.Effect<
  StopResourceSnapshotJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopResourceSnapshotJobRequest,
  output: StopResourceSnapshotJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the currently set system settings, which include the IAM Role used for resource snapshot jobs.
 */
export const getSellingSystemSettings: (
  input: GetSellingSystemSettingsRequest,
) => Effect.Effect<
  GetSellingSystemSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSellingSystemSettingsRequest,
  output: GetSellingSystemSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tags for a resource.
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
 * Updates the currently set system settings, which include the IAM Role used for resource snapshot jobs.
 */
export const putSellingSystemSettings: (
  input: PutSellingSystemSettingsRequest,
) => Effect.Effect<
  PutSellingSystemSettingsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSellingSystemSettingsRequest,
  output: PutSellingSystemSettingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag or tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
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
 * This action starts the engagement by accepting an `EngagementInvitation`. The task is asynchronous and involves the following steps: accepting the invitation, creating an opportunity in the partner’s account from the AWS opportunity, and copying details for tracking. When completed, an `Opportunity Created` event is generated, indicating that the opportunity has been successfully created in the partner's account.
 */
export const startEngagementByAcceptingInvitationTask: (
  input: StartEngagementByAcceptingInvitationTaskRequest,
) => Effect.Effect<
  StartEngagementByAcceptingInvitationTaskResponse,
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
  input: StartEngagementByAcceptingInvitationTaskRequest,
  output: StartEngagementByAcceptingInvitationTaskResponse,
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
 * This action creates an opportunity from an existing engagement context. The task is asynchronous and orchestrates the process of converting engagement contextual information into a structured opportunity record within the partner's account.
 */
export const startOpportunityFromEngagementTask: (
  input: StartOpportunityFromEngagementTaskRequest,
) => Effect.Effect<
  StartOpportunityFromEngagementTaskResponse,
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
  input: StartOpportunityFromEngagementTaskRequest,
  output: StartOpportunityFromEngagementTaskResponse,
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
 * This action allows you to create an immutable snapshot of a specific resource, such as an opportunity, within the context of an engagement. The snapshot captures a subset of the resource's data based on the schema defined by the provided template.
 */
export const createResourceSnapshot: (
  input: CreateResourceSnapshotRequest,
) => Effect.Effect<
  CreateResourceSnapshotResponse,
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
  input: CreateResourceSnapshotRequest,
  output: CreateResourceSnapshotResponse,
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
 * Use this action to create a job to generate a snapshot of the specified resource within an engagement. It initiates an asynchronous process to create a resource snapshot. The job creates a new snapshot only if the resource state has changed, adhering to the same access control and immutability rules as direct snapshot creation.
 */
export const createResourceSnapshotJob: (
  input: CreateResourceSnapshotJobRequest,
) => Effect.Effect<
  CreateResourceSnapshotJobResponse,
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
  input: CreateResourceSnapshotJobRequest,
  output: CreateResourceSnapshotJobResponse,
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
 * The `CreateEngagement` action allows you to create an `Engagement`, which serves as a collaborative space between different parties such as AWS Partners and AWS Sellers. This action automatically adds the caller's AWS account as an active member of the newly created `Engagement`.
 */
export const createEngagement: (
  input: CreateEngagementRequest,
) => Effect.Effect<
  CreateEngagementResponse,
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
  input: CreateEngagementRequest,
  output: CreateEngagementResponse,
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
 * Updates the context information for an existing engagement with new or modified data.
 */
export const updateEngagementContext: (
  input: UpdateEngagementContextRequest,
) => Effect.Effect<
  UpdateEngagementContextResponse,
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
  input: UpdateEngagementContextRequest,
  output: UpdateEngagementContextResponse,
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
 * Creates a new context within an existing engagement. This action allows you to add contextual information such as customer projects or documents to an engagement, providing additional details that help facilitate collaboration between engagement members.
 */
export const createEngagementContext: (
  input: CreateEngagementContextRequest,
) => Effect.Effect<
  CreateEngagementContextResponse,
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
  input: CreateEngagementContextRequest,
  output: CreateEngagementContextResponse,
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
 * This action creates an invitation from a sender to a single receiver to join an engagement.
 */
export const createEngagementInvitation: (
  input: CreateEngagementInvitationRequest,
) => Effect.Effect<
  CreateEngagementInvitationResponse,
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
  input: CreateEngagementInvitationRequest,
  output: CreateEngagementInvitationResponse,
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
 * This request accepts a list of filters that retrieve opportunity subsets as well as sort options. This feature is available to partners from Partner Central using the `ListOpportunities` API action.
 *
 * To synchronize your system with Amazon Web Services, list only the opportunities that were newly created or updated. We recommend you rely on events emitted by the service into your Amazon Web Services account’s Amazon EventBridge default event bus. You can also use the `ListOpportunities` action.
 *
 * We recommend the following approach:
 *
 * - Find the latest `LastModifiedDate` that you stored, and only use the values that came from Amazon Web Services. Don’t use values generated by your system.
 *
 * - When you send a `ListOpportunities` request, submit the date in ISO 8601 format in the `AfterLastModifiedDate` filter.
 *
 * - Amazon Web Services only returns opportunities created or updated on or after that date and time. Use `NextToken` to iterate over all pages.
 */
export const listOpportunities: {
  (
    input: ListOpportunitiesRequest,
  ): Effect.Effect<
    ListOpportunitiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOpportunitiesRequest,
  ) => Stream.Stream<
    ListOpportunitiesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOpportunitiesRequest,
  ) => Stream.Stream<
    OpportunitySummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOpportunitiesRequest,
  output: ListOpportunitiesResponse,
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
    items: "OpportunitySummaries",
    pageSize: "MaxResults",
  } as const,
}));

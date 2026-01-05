import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export const TagKeyList = S.Array(S.String);
export const AwsAccountList = S.Array(S.String);
export const EngagementContextTypeList = S.Array(S.String);
export const EngagementIdentifiers = S.Array(S.String);
export const TaskStatuses = S.Array(S.String);
export const OpportunityIdentifiers = S.Array(S.String);
export const EngagementInvitationIdentifiers = S.Array(S.String);
export const TaskIdentifiers = S.Array(S.String);
export const EngagementInvitationsPayloadType = S.Array(S.String);
export const InvitationStatusList = S.Array(S.String);
export const AwsAccountIdOrAliasList = S.Array(S.String);
export const PrimaryNeedsFromAws = S.Array(S.String);
export const FilterIdentifier = S.Array(S.String);
export const FilterLifeCycleStage = S.Array(S.String);
export const FilterLifeCycleReviewStatus = S.Array(S.String);
export const StringList = S.Array(S.String);
export const ContextIdentifiers = S.Array(S.String);
export const FilterStatus = S.Array(S.String);
export const SolutionIdentifiers = S.Array(S.String);
export class GetSellingSystemSettingsRequest extends S.Class<GetSellingSystemSettingsRequest>(
  "GetSellingSystemSettingsRequest",
)(
  { Catalog: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetSellingSystemSettings" }),
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
  { ResourceArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/ListTagsForResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutSellingSystemSettingsRequest extends S.Class<PutSellingSystemSettingsRequest>(
  "PutSellingSystemSettingsRequest",
)(
  {
    Catalog: S.String,
    ResourceSnapshotJobRoleIdentifier: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/PutSellingSystemSettings" }),
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
  { ResourceArn: S.String, TagKeys: TagKeyList },
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
export class GetEngagementRequest extends S.Class<GetEngagementRequest>(
  "GetEngagementRequest",
)(
  { Catalog: S.String, Identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetEngagement" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEngagementMembersRequest extends S.Class<ListEngagementMembersRequest>(
  "ListEngagementMembersRequest",
)(
  {
    Catalog: S.String,
    Identifier: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListEngagementMembers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class StartEngagementByAcceptingInvitationTaskRequest extends S.Class<StartEngagementByAcceptingInvitationTaskRequest>(
  "StartEngagementByAcceptingInvitationTaskRequest",
)(
  {
    Catalog: S.String,
    ClientToken: S.String,
    Identifier: S.String,
    Tags: S.optional(TagList),
  },
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
) {}
export class ListTasksSortBase extends S.Class<ListTasksSortBase>(
  "ListTasksSortBase",
)({ SortOrder: S.String, SortBy: S.String }) {}
export class ListEngagementFromOpportunityTasksRequest extends S.Class<ListEngagementFromOpportunityTasksRequest>(
  "ListEngagementFromOpportunityTasksRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(ListTasksSortBase),
    Catalog: S.String,
    TaskStatus: S.optional(TaskStatuses),
    TaskIdentifier: S.optional(TaskIdentifiers),
    OpportunityIdentifier: S.optional(OpportunityIdentifiers),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListEngagementFromOpportunityTasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEngagementInvitationRequest extends S.Class<GetEngagementInvitationRequest>(
  "GetEngagementInvitationRequest",
)(
  { Catalog: S.String, Identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetEngagementInvitation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptEngagementInvitationRequest extends S.Class<AcceptEngagementInvitationRequest>(
  "AcceptEngagementInvitationRequest",
)(
  { Catalog: S.String, Identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/AcceptEngagementInvitation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptEngagementInvitationResponse extends S.Class<AcceptEngagementInvitationResponse>(
  "AcceptEngagementInvitationResponse",
)({}) {}
export class RejectEngagementInvitationRequest extends S.Class<RejectEngagementInvitationRequest>(
  "RejectEngagementInvitationRequest",
)(
  {
    Catalog: S.String,
    Identifier: S.String,
    RejectionReason: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/RejectEngagementInvitation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectEngagementInvitationResponse extends S.Class<RejectEngagementInvitationResponse>(
  "RejectEngagementInvitationResponse",
)({}) {}
export class GetOpportunityRequest extends S.Class<GetOpportunityRequest>(
  "GetOpportunityRequest",
)(
  { Catalog: S.String, Identifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetOpportunity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Address extends S.Class<Address>("Address")({
  City: S.optional(S.String),
  PostalCode: S.optional(S.String),
  StateOrRegion: S.optional(S.String),
  CountryCode: S.optional(S.String),
  StreetAddress: S.optional(S.String),
}) {}
export class Account extends S.Class<Account>("Account")({
  Industry: S.optional(S.String),
  OtherIndustry: S.optional(S.String),
  CompanyName: S.String,
  WebsiteUrl: S.optional(S.String),
  AwsAccountId: S.optional(S.String),
  Address: S.optional(Address),
  Duns: S.optional(S.String),
}) {}
export class Contact extends S.Class<Contact>("Contact")({
  Email: S.optional(S.String),
  FirstName: S.optional(S.String),
  LastName: S.optional(S.String),
  BusinessTitle: S.optional(S.String),
  Phone: S.optional(S.String),
}) {}
export const CustomerContactsList = S.Array(Contact);
export class Customer extends S.Class<Customer>("Customer")({
  Account: S.optional(Account),
  Contacts: S.optional(CustomerContactsList),
}) {}
export const DeliveryModels = S.Array(S.String);
export class ExpectedCustomerSpend extends S.Class<ExpectedCustomerSpend>(
  "ExpectedCustomerSpend",
)({
  Amount: S.optional(S.String),
  CurrencyCode: S.String,
  Frequency: S.String,
  TargetCompany: S.String,
  EstimationUrl: S.optional(S.String),
}) {}
export const ExpectedCustomerSpendList = S.Array(ExpectedCustomerSpend);
export const ApnPrograms = S.Array(S.String);
export const SalesActivities = S.Array(S.String);
export class Project extends S.Class<Project>("Project")({
  DeliveryModels: S.optional(DeliveryModels),
  ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
  Title: S.optional(S.String),
  ApnPrograms: S.optional(ApnPrograms),
  CustomerBusinessProblem: S.optional(S.String),
  CustomerUseCase: S.optional(S.String),
  RelatedOpportunityIdentifier: S.optional(S.String),
  SalesActivities: S.optional(SalesActivities),
  CompetitorName: S.optional(S.String),
  OtherCompetitorNames: S.optional(S.String),
  OtherSolutionDescription: S.optional(S.String),
  AdditionalComments: S.optional(S.String),
  AwsPartition: S.optional(S.String),
}) {}
export const UseCases = S.Array(S.String);
export const Channels = S.Array(S.String);
export class Marketing extends S.Class<Marketing>("Marketing")({
  CampaignName: S.optional(S.String),
  Source: S.optional(S.String),
  UseCases: S.optional(UseCases),
  Channels: S.optional(Channels),
  AwsFundingUsed: S.optional(S.String),
}) {}
export class MonetaryValue extends S.Class<MonetaryValue>("MonetaryValue")({
  Amount: S.String,
  CurrencyCode: S.String,
}) {}
export class SoftwareRevenue extends S.Class<SoftwareRevenue>(
  "SoftwareRevenue",
)({
  DeliveryModel: S.optional(S.String),
  Value: S.optional(MonetaryValue),
  EffectiveDate: S.optional(S.String),
  ExpirationDate: S.optional(S.String),
}) {}
export class NextStepsHistory extends S.Class<NextStepsHistory>(
  "NextStepsHistory",
)({ Value: S.String, Time: S.Date.pipe(T.TimestampFormat("date-time")) }) {}
export const NextStepsHistories = S.Array(NextStepsHistory);
export class LifeCycle extends S.Class<LifeCycle>("LifeCycle")({
  Stage: S.optional(S.String),
  ClosedLostReason: S.optional(S.String),
  NextSteps: S.optional(S.String),
  TargetCloseDate: S.optional(S.String),
  ReviewStatus: S.optional(S.String),
  ReviewComments: S.optional(S.String),
  ReviewStatusReason: S.optional(S.String),
  NextStepsHistory: S.optional(NextStepsHistories),
}) {}
export class UpdateOpportunityRequest extends S.Class<UpdateOpportunityRequest>(
  "UpdateOpportunityRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateOpportunity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateOpportunityRequest extends S.Class<AssociateOpportunityRequest>(
  "AssociateOpportunityRequest",
)(
  {
    Catalog: S.String,
    OpportunityIdentifier: S.String,
    RelatedEntityType: S.String,
    RelatedEntityIdentifier: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/AssociateOpportunity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateOpportunityResponse extends S.Class<AssociateOpportunityResponse>(
  "AssociateOpportunityResponse",
)({}) {}
export class DisassociateOpportunityRequest extends S.Class<DisassociateOpportunityRequest>(
  "DisassociateOpportunityRequest",
)(
  {
    Catalog: S.String,
    OpportunityIdentifier: S.String,
    RelatedEntityType: S.String,
    RelatedEntityIdentifier: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/DisassociateOpportunity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateOpportunityResponse extends S.Class<DisassociateOpportunityResponse>(
  "DisassociateOpportunityResponse",
)({}) {}
export class GetAwsOpportunitySummaryRequest extends S.Class<GetAwsOpportunitySummaryRequest>(
  "GetAwsOpportunitySummaryRequest",
)(
  { Catalog: S.String, RelatedOpportunityIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetAwsOpportunitySummary" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SubmitOpportunityRequest extends S.Class<SubmitOpportunityRequest>(
  "SubmitOpportunityRequest",
)(
  {
    Catalog: S.String,
    Identifier: S.String,
    InvolvementType: S.String,
    Visibility: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/SubmitOpportunity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SubmitOpportunityResponse extends S.Class<SubmitOpportunityResponse>(
  "SubmitOpportunityResponse",
)({}) {}
export class StartOpportunityFromEngagementTaskRequest extends S.Class<StartOpportunityFromEngagementTaskRequest>(
  "StartOpportunityFromEngagementTaskRequest",
)(
  {
    Catalog: S.String,
    ClientToken: S.String,
    Identifier: S.String,
    ContextIdentifier: S.String,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/StartOpportunityFromEngagementTask" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOpportunityFromEngagementTasksRequest extends S.Class<ListOpportunityFromEngagementTasksRequest>(
  "ListOpportunityFromEngagementTasksRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(ListTasksSortBase),
    Catalog: S.String,
    TaskStatus: S.optional(TaskStatuses),
    TaskIdentifier: S.optional(TaskIdentifiers),
    OpportunityIdentifier: S.optional(OpportunityIdentifiers),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
    ContextIdentifier: S.optional(ContextIdentifiers),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListOpportunityFromEngagementTasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourceSnapshotRequest extends S.Class<CreateResourceSnapshotRequest>(
  "CreateResourceSnapshotRequest",
)(
  {
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ResourceType: S.String,
    ResourceIdentifier: S.String,
    ResourceSnapshotTemplateIdentifier: S.String,
    ClientToken: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateResourceSnapshot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceSnapshotRequest extends S.Class<GetResourceSnapshotRequest>(
  "GetResourceSnapshotRequest",
)(
  {
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ResourceType: S.String,
    ResourceIdentifier: S.String,
    ResourceSnapshotTemplateIdentifier: S.String,
    Revision: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/GetResourceSnapshot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEngagementResourceAssociationsRequest extends S.Class<ListEngagementResourceAssociationsRequest>(
  "ListEngagementResourceAssociationsRequest",
)(
  {
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    CreatedBy: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListEngagementResourceAssociations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourceSnapshotsRequest extends S.Class<ListResourceSnapshotsRequest>(
  "ListResourceSnapshotsRequest",
)(
  {
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.String,
    ResourceType: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    ResourceSnapshotTemplateIdentifier: S.optional(S.String),
    CreatedBy: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListResourceSnapshots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateResourceSnapshotJobRequest extends S.Class<CreateResourceSnapshotJobRequest>(
  "CreateResourceSnapshotJobRequest",
)(
  {
    Catalog: S.String,
    ClientToken: S.String,
    EngagementIdentifier: S.String,
    ResourceType: S.String,
    ResourceIdentifier: S.String,
    ResourceSnapshotTemplateIdentifier: S.String,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateResourceSnapshotJob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceSnapshotJobRequest extends S.Class<GetResourceSnapshotJobRequest>(
  "GetResourceSnapshotJobRequest",
)(
  { Catalog: S.String, ResourceSnapshotJobIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetResourceSnapshotJob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourceSnapshotJobRequest extends S.Class<DeleteResourceSnapshotJobRequest>(
  "DeleteResourceSnapshotJobRequest",
)(
  { Catalog: S.String, ResourceSnapshotJobIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteResourceSnapshotJob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourceSnapshotJobResponse extends S.Class<DeleteResourceSnapshotJobResponse>(
  "DeleteResourceSnapshotJobResponse",
)({}) {}
export class StartResourceSnapshotJobRequest extends S.Class<StartResourceSnapshotJobRequest>(
  "StartResourceSnapshotJobRequest",
)(
  { Catalog: S.String, ResourceSnapshotJobIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/StartResourceSnapshotJob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartResourceSnapshotJobResponse extends S.Class<StartResourceSnapshotJobResponse>(
  "StartResourceSnapshotJobResponse",
)({}) {}
export class StopResourceSnapshotJobRequest extends S.Class<StopResourceSnapshotJobRequest>(
  "StopResourceSnapshotJobRequest",
)(
  { Catalog: S.String, ResourceSnapshotJobIdentifier: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/StopResourceSnapshotJob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopResourceSnapshotJobResponse extends S.Class<StopResourceSnapshotJobResponse>(
  "StopResourceSnapshotJobResponse",
)({}) {}
export class EngagementCustomer extends S.Class<EngagementCustomer>(
  "EngagementCustomer",
)({
  Industry: S.String,
  CompanyName: S.String,
  WebsiteUrl: S.String,
  CountryCode: S.String,
}) {}
export class EngagementCustomerProjectDetails extends S.Class<EngagementCustomerProjectDetails>(
  "EngagementCustomerProjectDetails",
)({
  Title: S.String,
  BusinessProblem: S.String,
  TargetCompletionDate: S.String,
}) {}
export class CustomerProjectsContext extends S.Class<CustomerProjectsContext>(
  "CustomerProjectsContext",
)({
  Customer: S.optional(EngagementCustomer),
  Project: S.optional(EngagementCustomerProjectDetails),
}) {}
export class AddressSummary extends S.Class<AddressSummary>("AddressSummary")({
  City: S.optional(S.String),
  PostalCode: S.optional(S.String),
  StateOrRegion: S.optional(S.String),
  CountryCode: S.optional(S.String),
}) {}
export class LeadCustomer extends S.Class<LeadCustomer>("LeadCustomer")({
  Industry: S.optional(S.String),
  CompanyName: S.String,
  WebsiteUrl: S.optional(S.String),
  Address: AddressSummary,
  AwsMaturity: S.optional(S.String),
  MarketSegment: S.optional(S.String),
}) {}
export class LeadContact extends S.Class<LeadContact>("LeadContact")({
  BusinessTitle: S.String,
  Email: S.String,
  FirstName: S.String,
  LastName: S.String,
  Phone: S.optional(S.String),
}) {}
export class LeadInteraction extends S.Class<LeadInteraction>(
  "LeadInteraction",
)({
  SourceType: S.String,
  SourceId: S.String,
  SourceName: S.String,
  Usecase: S.optional(S.String),
  InteractionDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CustomerAction: S.String,
  BusinessProblem: S.optional(S.String),
  Contact: LeadContact,
}) {}
export const LeadInteractionList = S.Array(LeadInteraction);
export class LeadContext extends S.Class<LeadContext>("LeadContext")({
  QualificationStatus: S.optional(S.String),
  Customer: LeadCustomer,
  Interactions: LeadInteractionList,
}) {}
export const EngagementContextPayload = S.Union(
  S.Struct({ CustomerProject: CustomerProjectsContext }),
  S.Struct({ Lead: LeadContext }),
);
export class EngagementContextDetails extends S.Class<EngagementContextDetails>(
  "EngagementContextDetails",
)({
  Id: S.optional(S.String),
  Type: S.String,
  Payload: S.optional(EngagementContextPayload),
}) {}
export const EngagementContexts = S.Array(EngagementContextDetails);
export class EngagementSort extends S.Class<EngagementSort>("EngagementSort")({
  SortOrder: S.String,
  SortBy: S.String,
}) {}
export class AwsSubmission extends S.Class<AwsSubmission>("AwsSubmission")({
  InvolvementType: S.String,
  Visibility: S.optional(S.String),
}) {}
export class OpportunityEngagementInvitationSort extends S.Class<OpportunityEngagementInvitationSort>(
  "OpportunityEngagementInvitationSort",
)({ SortOrder: S.String, SortBy: S.String }) {}
export const PartnerOpportunityTeamMembersList = S.Array(Contact);
export class OpportunitySort extends S.Class<OpportunitySort>(
  "OpportunitySort",
)({ SortOrder: S.String, SortBy: S.String }) {}
export class LastModifiedDate extends S.Class<LastModifiedDate>(
  "LastModifiedDate",
)({
  AfterLastModifiedDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  BeforeLastModifiedDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class AssigneeContact extends S.Class<AssigneeContact>(
  "AssigneeContact",
)({
  Email: S.String,
  FirstName: S.String,
  LastName: S.String,
  Phone: S.optional(S.String),
  BusinessTitle: S.String,
}) {}
export class SortObject extends S.Class<SortObject>("SortObject")({
  SortBy: S.optional(S.String),
  SortOrder: S.optional(S.String),
}) {}
export class SolutionSort extends S.Class<SolutionSort>("SolutionSort")({
  SortOrder: S.String,
  SortBy: S.String,
}) {}
export class GetSellingSystemSettingsResponse extends S.Class<GetSellingSystemSettingsResponse>(
  "GetSellingSystemSettingsResponse",
)({ Catalog: S.String, ResourceSnapshotJobRoleArn: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: TagList }) {}
export class PutSellingSystemSettingsResponse extends S.Class<PutSellingSystemSettingsResponse>(
  "PutSellingSystemSettingsResponse",
)({ Catalog: S.String, ResourceSnapshotJobRoleArn: S.optional(S.String) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
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
export class CreateEngagementRequest extends S.Class<CreateEngagementRequest>(
  "CreateEngagementRequest",
)(
  {
    Catalog: S.String,
    ClientToken: S.String,
    Title: S.String,
    Description: S.String,
    Contexts: S.optional(EngagementContexts),
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateEngagement" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEngagementResponse extends S.Class<GetEngagementResponse>(
  "GetEngagementResponse",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  Title: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CreatedBy: S.optional(S.String),
  MemberCount: S.optional(S.Number),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ModifiedBy: S.optional(S.String),
  Contexts: S.optional(EngagementContexts),
}) {}
export class ListEngagementsRequest extends S.Class<ListEngagementsRequest>(
  "ListEngagementsRequest",
)(
  {
    Catalog: S.String,
    CreatedBy: S.optional(AwsAccountList),
    ExcludeCreatedBy: S.optional(AwsAccountList),
    ContextTypes: S.optional(EngagementContextTypeList),
    ExcludeContextTypes: S.optional(EngagementContextTypeList),
    Sort: S.optional(EngagementSort),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListEngagements" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartEngagementByAcceptingInvitationTaskResponse extends S.Class<StartEngagementByAcceptingInvitationTaskResponse>(
  "StartEngagementByAcceptingInvitationTaskResponse",
)({
  TaskId: S.optional(S.String),
  TaskArn: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  TaskStatus: S.optional(S.String),
  Message: S.optional(S.String),
  ReasonCode: S.optional(S.String),
  OpportunityId: S.optional(S.String),
  ResourceSnapshotJobId: S.optional(S.String),
  EngagementInvitationId: S.optional(S.String),
}) {}
export class ListEngagementByAcceptingInvitationTasksRequest extends S.Class<ListEngagementByAcceptingInvitationTasksRequest>(
  "ListEngagementByAcceptingInvitationTasksRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(ListTasksSortBase),
    Catalog: S.String,
    TaskStatus: S.optional(TaskStatuses),
    OpportunityIdentifier: S.optional(OpportunityIdentifiers),
    EngagementInvitationIdentifier: S.optional(EngagementInvitationIdentifiers),
    TaskIdentifier: S.optional(TaskIdentifiers),
  },
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
) {}
export class StartEngagementFromOpportunityTaskRequest extends S.Class<StartEngagementFromOpportunityTaskRequest>(
  "StartEngagementFromOpportunityTaskRequest",
)(
  {
    Catalog: S.String,
    ClientToken: S.String,
    Identifier: S.String,
    AwsSubmission: AwsSubmission,
    Tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/StartEngagementFromOpportunityTask" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEngagementInvitationsRequest extends S.Class<ListEngagementInvitationsRequest>(
  "ListEngagementInvitationsRequest",
)(
  {
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(OpportunityEngagementInvitationSort),
    PayloadType: S.optional(EngagementInvitationsPayloadType),
    ParticipantType: S.String,
    Status: S.optional(InvitationStatusList),
    EngagementIdentifier: S.optional(EngagementIdentifiers),
    SenderAwsAccountId: S.optional(AwsAccountIdOrAliasList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListEngagementInvitations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateOpportunityResponse extends S.Class<UpdateOpportunityResponse>(
  "UpdateOpportunityResponse",
)({
  Id: S.String,
  LastModifiedDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListOpportunitiesRequest extends S.Class<ListOpportunitiesRequest>(
  "ListOpportunitiesRequest",
)(
  {
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(OpportunitySort),
    LastModifiedDate: S.optional(LastModifiedDate),
    Identifier: S.optional(FilterIdentifier),
    LifeCycleStage: S.optional(FilterLifeCycleStage),
    LifeCycleReviewStatus: S.optional(FilterLifeCycleReviewStatus),
    CustomerCompanyName: S.optional(StringList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListOpportunities" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssignOpportunityRequest extends S.Class<AssignOpportunityRequest>(
  "AssignOpportunityRequest",
)(
  { Catalog: S.String, Identifier: S.String, Assignee: AssigneeContact },
  T.all(
    T.Http({ method: "POST", uri: "/AssignOpportunity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssignOpportunityResponse extends S.Class<AssignOpportunityResponse>(
  "AssignOpportunityResponse",
)({}) {}
export class StartOpportunityFromEngagementTaskResponse extends S.Class<StartOpportunityFromEngagementTaskResponse>(
  "StartOpportunityFromEngagementTaskResponse",
)({
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
}) {}
export class CreateResourceSnapshotResponse extends S.Class<CreateResourceSnapshotResponse>(
  "CreateResourceSnapshotResponse",
)({ Arn: S.optional(S.String), Revision: S.optional(S.Number) }) {}
export class CreateResourceSnapshotJobResponse extends S.Class<CreateResourceSnapshotJobResponse>(
  "CreateResourceSnapshotJobResponse",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class GetResourceSnapshotJobResponse extends S.Class<GetResourceSnapshotJobResponse>(
  "GetResourceSnapshotJobResponse",
)({
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
}) {}
export class ListResourceSnapshotJobsRequest extends S.Class<ListResourceSnapshotJobsRequest>(
  "ListResourceSnapshotJobsRequest",
)(
  {
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    EngagementIdentifier: S.optional(S.String),
    Status: S.optional(S.String),
    Sort: S.optional(SortObject),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListResourceSnapshotJobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSolutionsRequest extends S.Class<ListSolutionsRequest>(
  "ListSolutionsRequest",
)(
  {
    Catalog: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Sort: S.optional(SolutionSort),
    Status: S.optional(FilterStatus),
    Identifier: S.optional(SolutionIdentifiers),
    Category: S.optional(StringList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListSolutions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLeadContext extends S.Class<UpdateLeadContext>(
  "UpdateLeadContext",
)({
  QualificationStatus: S.optional(S.String),
  Customer: LeadCustomer,
  Interaction: S.optional(LeadInteraction),
}) {}
export const AwsMarketplaceOfferIdentifiers = S.Array(S.String);
export const AwsMarketplaceOfferSetIdentifiers = S.Array(S.String);
export const AwsProductIdentifiers = S.Array(S.String);
export const ReceiverResponsibilityList = S.Array(S.String);
export const UpdateEngagementContextPayload = S.Union(
  S.Struct({ Lead: UpdateLeadContext }),
  S.Struct({ CustomerProject: CustomerProjectsContext }),
);
export class EngagementMember extends S.Class<EngagementMember>(
  "EngagementMember",
)({
  CompanyName: S.optional(S.String),
  WebsiteUrl: S.optional(S.String),
  AccountId: S.optional(S.String),
}) {}
export const EngagementMembers = S.Array(EngagementMember);
export class ListEngagementFromOpportunityTaskSummary extends S.Class<ListEngagementFromOpportunityTaskSummary>(
  "ListEngagementFromOpportunityTaskSummary",
)({
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
}) {}
export const ListEngagementFromOpportunityTaskSummaries = S.Array(
  ListEngagementFromOpportunityTaskSummary,
);
export class EngagementMemberSummary extends S.Class<EngagementMemberSummary>(
  "EngagementMemberSummary",
)({ CompanyName: S.optional(S.String), WebsiteUrl: S.optional(S.String) }) {}
export const EngagementMemberSummaries = S.Array(EngagementMemberSummary);
export class RelatedEntityIdentifiers extends S.Class<RelatedEntityIdentifiers>(
  "RelatedEntityIdentifiers",
)({
  AwsMarketplaceOffers: S.optional(AwsMarketplaceOfferIdentifiers),
  AwsMarketplaceOfferSets: S.optional(AwsMarketplaceOfferSetIdentifiers),
  Solutions: S.optional(SolutionIdentifiers),
  AwsProducts: S.optional(AwsProductIdentifiers),
}) {}
export class AwsTeamMember extends S.Class<AwsTeamMember>("AwsTeamMember")({
  Email: S.optional(S.String),
  FirstName: S.optional(S.String),
  LastName: S.optional(S.String),
  BusinessTitle: S.optional(S.String),
}) {}
export const AwsOpportunityTeamMembersList = S.Array(AwsTeamMember);
export class AwsOpportunityRelatedEntities extends S.Class<AwsOpportunityRelatedEntities>(
  "AwsOpportunityRelatedEntities",
)({
  AwsProducts: S.optional(AwsProductIdentifiers),
  Solutions: S.optional(SolutionIdentifiers),
}) {}
export class AwsOpportunityCustomer extends S.Class<AwsOpportunityCustomer>(
  "AwsOpportunityCustomer",
)({ Contacts: S.optional(CustomerContactsList) }) {}
export class AwsOpportunityProject extends S.Class<AwsOpportunityProject>(
  "AwsOpportunityProject",
)({
  ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
  AwsPartition: S.optional(S.String),
}) {}
export class ListOpportunityFromEngagementTaskSummary extends S.Class<ListOpportunityFromEngagementTaskSummary>(
  "ListOpportunityFromEngagementTaskSummary",
)({
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
}) {}
export const ListOpportunityFromEngagementTaskSummaries = S.Array(
  ListOpportunityFromEngagementTaskSummary,
);
export class EngagementResourceAssociationSummary extends S.Class<EngagementResourceAssociationSummary>(
  "EngagementResourceAssociationSummary",
)({
  Catalog: S.String,
  EngagementId: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceId: S.optional(S.String),
  CreatedBy: S.optional(S.String),
}) {}
export const EngagementResourceAssociationSummaryList = S.Array(
  EngagementResourceAssociationSummary,
);
export class ResourceSnapshotSummary extends S.Class<ResourceSnapshotSummary>(
  "ResourceSnapshotSummary",
)({
  Arn: S.optional(S.String),
  Revision: S.optional(S.Number),
  ResourceType: S.optional(S.String),
  ResourceId: S.optional(S.String),
  ResourceSnapshotTemplateName: S.optional(S.String),
  CreatedBy: S.optional(S.String),
}) {}
export const ResourceSnapshotSummaryList = S.Array(ResourceSnapshotSummary);
export class AccountReceiver extends S.Class<AccountReceiver>(
  "AccountReceiver",
)({ Alias: S.optional(S.String), AwsAccountId: S.String }) {}
export class UpdateEngagementContextRequest extends S.Class<UpdateEngagementContextRequest>(
  "UpdateEngagementContextRequest",
)(
  {
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ContextIdentifier: S.String,
    EngagementLastModifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    Type: S.String,
    Payload: UpdateEngagementContextPayload,
  },
  T.all(
    T.Http({ method: "POST", uri: "/UpdateEngagementContext" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEngagementResponse extends S.Class<CreateEngagementResponse>(
  "CreateEngagementResponse",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ListEngagementMembersResponse extends S.Class<ListEngagementMembersResponse>(
  "ListEngagementMembersResponse",
)({
  EngagementMemberList: EngagementMembers,
  NextToken: S.optional(S.String),
}) {}
export class StartEngagementFromOpportunityTaskResponse extends S.Class<StartEngagementFromOpportunityTaskResponse>(
  "StartEngagementFromOpportunityTaskResponse",
)({
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
}) {}
export class ListEngagementFromOpportunityTasksResponse extends S.Class<ListEngagementFromOpportunityTasksResponse>(
  "ListEngagementFromOpportunityTasksResponse",
)({
  TaskSummaries: S.optional(ListEngagementFromOpportunityTaskSummaries),
  NextToken: S.optional(S.String),
}) {}
export const Receiver = S.Union(S.Struct({ Account: AccountReceiver }));
export class SenderContact extends S.Class<SenderContact>("SenderContact")({
  Email: S.String,
  FirstName: S.optional(S.String),
  LastName: S.optional(S.String),
  BusinessTitle: S.optional(S.String),
  Phone: S.optional(S.String),
}) {}
export const SenderContactList = S.Array(SenderContact);
export class ProjectDetails extends S.Class<ProjectDetails>("ProjectDetails")({
  BusinessProblem: S.String,
  Title: S.String,
  TargetCompletionDate: S.String,
  ExpectedCustomerSpend: ExpectedCustomerSpendList,
}) {}
export class OpportunityInvitationPayload extends S.Class<OpportunityInvitationPayload>(
  "OpportunityInvitationPayload",
)({
  SenderContacts: S.optional(SenderContactList),
  ReceiverResponsibilities: ReceiverResponsibilityList,
  Customer: EngagementCustomer,
  Project: ProjectDetails,
}) {}
export class LeadInvitationCustomer extends S.Class<LeadInvitationCustomer>(
  "LeadInvitationCustomer",
)({
  Industry: S.optional(S.String),
  CompanyName: S.String,
  WebsiteUrl: S.optional(S.String),
  CountryCode: S.String,
  AwsMaturity: S.optional(S.String),
  MarketSegment: S.optional(S.String),
}) {}
export class LeadInvitationInteraction extends S.Class<LeadInvitationInteraction>(
  "LeadInvitationInteraction",
)({
  SourceType: S.String,
  SourceId: S.String,
  SourceName: S.String,
  Usecase: S.optional(S.String),
  ContactBusinessTitle: S.String,
}) {}
export class LeadInvitationPayload extends S.Class<LeadInvitationPayload>(
  "LeadInvitationPayload",
)({
  Customer: LeadInvitationCustomer,
  Interaction: LeadInvitationInteraction,
}) {}
export const Payload = S.Union(
  S.Struct({ OpportunityInvitation: OpportunityInvitationPayload }),
  S.Struct({ LeadInvitation: LeadInvitationPayload }),
);
export class GetEngagementInvitationResponse extends S.Class<GetEngagementInvitationResponse>(
  "GetEngagementInvitationResponse",
)({
  Arn: S.optional(S.String),
  PayloadType: S.optional(S.String),
  Id: S.String,
  EngagementId: S.optional(S.String),
  EngagementTitle: S.optional(S.String),
  Status: S.optional(S.String),
  InvitationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SenderAwsAccountId: S.optional(S.String),
  SenderCompanyName: S.optional(S.String),
  Receiver: S.optional(Receiver),
  Catalog: S.String,
  RejectionReason: S.optional(S.String),
  Payload: S.optional(Payload),
  InvitationMessage: S.optional(S.String),
  EngagementDescription: S.optional(S.String),
  ExistingMembers: S.optional(EngagementMemberSummaries),
}) {}
export class GetOpportunityResponse extends S.Class<GetOpportunityResponse>(
  "GetOpportunityResponse",
)({
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
}) {}
export class ListOpportunityFromEngagementTasksResponse extends S.Class<ListOpportunityFromEngagementTasksResponse>(
  "ListOpportunityFromEngagementTasksResponse",
)({
  TaskSummaries: S.optional(ListOpportunityFromEngagementTaskSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListEngagementResourceAssociationsResponse extends S.Class<ListEngagementResourceAssociationsResponse>(
  "ListEngagementResourceAssociationsResponse",
)({
  EngagementResourceAssociationSummaries:
    EngagementResourceAssociationSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class ListResourceSnapshotsResponse extends S.Class<ListResourceSnapshotsResponse>(
  "ListResourceSnapshotsResponse",
)({
  ResourceSnapshotSummaries: ResourceSnapshotSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class ProfileNextStepsHistory extends S.Class<ProfileNextStepsHistory>(
  "ProfileNextStepsHistory",
)({ Value: S.String, Time: S.Date.pipe(T.TimestampFormat("date-time")) }) {}
export const ProfileNextStepsHistories = S.Array(ProfileNextStepsHistory);
export class EngagementSummary extends S.Class<EngagementSummary>(
  "EngagementSummary",
)({
  Arn: S.optional(S.String),
  Id: S.optional(S.String),
  Title: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CreatedBy: S.optional(S.String),
  MemberCount: S.optional(S.Number),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ModifiedBy: S.optional(S.String),
  ContextTypes: S.optional(EngagementContextTypeList),
}) {}
export const EngagementSummaryList = S.Array(EngagementSummary);
export class ListEngagementByAcceptingInvitationTaskSummary extends S.Class<ListEngagementByAcceptingInvitationTaskSummary>(
  "ListEngagementByAcceptingInvitationTaskSummary",
)({
  TaskId: S.optional(S.String),
  TaskArn: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  TaskStatus: S.optional(S.String),
  Message: S.optional(S.String),
  ReasonCode: S.optional(S.String),
  OpportunityId: S.optional(S.String),
  ResourceSnapshotJobId: S.optional(S.String),
  EngagementInvitationId: S.optional(S.String),
}) {}
export const ListEngagementByAcceptingInvitationTaskSummaries = S.Array(
  ListEngagementByAcceptingInvitationTaskSummary,
);
export class EngagementInvitationSummary extends S.Class<EngagementInvitationSummary>(
  "EngagementInvitationSummary",
)({
  Arn: S.optional(S.String),
  PayloadType: S.optional(S.String),
  Id: S.String,
  EngagementId: S.optional(S.String),
  EngagementTitle: S.optional(S.String),
  Status: S.optional(S.String),
  InvitationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SenderAwsAccountId: S.optional(S.String),
  SenderCompanyName: S.optional(S.String),
  Receiver: S.optional(Receiver),
  Catalog: S.String,
  ParticipantType: S.optional(S.String),
}) {}
export const EngagementInvitationSummaries = S.Array(
  EngagementInvitationSummary,
);
export class AwsOpportunityLifeCycle extends S.Class<AwsOpportunityLifeCycle>(
  "AwsOpportunityLifeCycle",
)({
  TargetCloseDate: S.optional(S.String),
  ClosedLostReason: S.optional(S.String),
  Stage: S.optional(S.String),
  NextSteps: S.optional(S.String),
  NextStepsHistory: S.optional(ProfileNextStepsHistories),
}) {}
export class ResourceSnapshotJobSummary extends S.Class<ResourceSnapshotJobSummary>(
  "ResourceSnapshotJobSummary",
)({
  Id: S.optional(S.String),
  Arn: S.optional(S.String),
  EngagementId: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const ResourceSnapshotJobSummaryList = S.Array(
  ResourceSnapshotJobSummary,
);
export class SolutionBase extends S.Class<SolutionBase>("SolutionBase")({
  Catalog: S.String,
  Id: S.String,
  Arn: S.optional(S.String),
  Name: S.String,
  Status: S.String,
  Category: S.String,
  CreatedDate: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const SolutionList = S.Array(SolutionBase);
export class LifeCycleForView extends S.Class<LifeCycleForView>(
  "LifeCycleForView",
)({
  TargetCloseDate: S.optional(S.String),
  ReviewStatus: S.optional(S.String),
  Stage: S.optional(S.String),
  NextSteps: S.optional(S.String),
}) {}
export class ProjectView extends S.Class<ProjectView>("ProjectView")({
  DeliveryModels: S.optional(DeliveryModels),
  ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
  CustomerUseCase: S.optional(S.String),
  SalesActivities: S.optional(SalesActivities),
  OtherSolutionDescription: S.optional(S.String),
}) {}
export class UpdateEngagementContextResponse extends S.Class<UpdateEngagementContextResponse>(
  "UpdateEngagementContextResponse",
)({
  EngagementId: S.String,
  EngagementArn: S.String,
  EngagementLastModifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  ContextId: S.String,
}) {}
export class ListEngagementsResponse extends S.Class<ListEngagementsResponse>(
  "ListEngagementsResponse",
)({
  EngagementSummaryList: EngagementSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class ListEngagementByAcceptingInvitationTasksResponse extends S.Class<ListEngagementByAcceptingInvitationTasksResponse>(
  "ListEngagementByAcceptingInvitationTasksResponse",
)({
  TaskSummaries: S.optional(ListEngagementByAcceptingInvitationTaskSummaries),
  NextToken: S.optional(S.String),
}) {}
export class ListEngagementInvitationsResponse extends S.Class<ListEngagementInvitationsResponse>(
  "ListEngagementInvitationsResponse",
)({
  EngagementInvitationSummaries: S.optional(EngagementInvitationSummaries),
  NextToken: S.optional(S.String),
}) {}
export class CreateOpportunityRequest extends S.Class<CreateOpportunityRequest>(
  "CreateOpportunityRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateOpportunity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListResourceSnapshotJobsResponse extends S.Class<ListResourceSnapshotJobsResponse>(
  "ListResourceSnapshotJobsResponse",
)({
  ResourceSnapshotJobSummaries: ResourceSnapshotJobSummaryList,
  NextToken: S.optional(S.String),
}) {}
export class ListSolutionsResponse extends S.Class<ListSolutionsResponse>(
  "ListSolutionsResponse",
)({ SolutionSummaries: SolutionList, NextToken: S.optional(S.String) }) {}
export class LifeCycleSummary extends S.Class<LifeCycleSummary>(
  "LifeCycleSummary",
)({
  Stage: S.optional(S.String),
  ClosedLostReason: S.optional(S.String),
  NextSteps: S.optional(S.String),
  TargetCloseDate: S.optional(S.String),
  ReviewStatus: S.optional(S.String),
  ReviewComments: S.optional(S.String),
  ReviewStatusReason: S.optional(S.String),
}) {}
export class ProjectSummary extends S.Class<ProjectSummary>("ProjectSummary")({
  DeliveryModels: S.optional(DeliveryModels),
  ExpectedCustomerSpend: S.optional(ExpectedCustomerSpendList),
}) {}
export class OpportunitySummaryView extends S.Class<OpportunitySummaryView>(
  "OpportunitySummaryView",
)({
  OpportunityType: S.optional(S.String),
  Lifecycle: S.optional(LifeCycleForView),
  OpportunityTeam: S.optional(PartnerOpportunityTeamMembersList),
  PrimaryNeedsFromAws: S.optional(PrimaryNeedsFromAws),
  Customer: S.optional(Customer),
  Project: S.optional(ProjectView),
  RelatedEntityIdentifiers: S.optional(RelatedEntityIdentifiers),
}) {}
export const AmountMap = S.Record({ key: S.String, value: S.String });
export class Invitation extends S.Class<Invitation>("Invitation")({
  Message: S.String,
  Receiver: Receiver,
  Payload: Payload,
}) {}
export const ResourceSnapshotPayload = S.Union(
  S.Struct({ OpportunitySummary: OpportunitySummaryView }),
);
export class AccountSummary extends S.Class<AccountSummary>("AccountSummary")({
  Industry: S.optional(S.String),
  OtherIndustry: S.optional(S.String),
  CompanyName: S.String,
  WebsiteUrl: S.optional(S.String),
  Address: S.optional(AddressSummary),
}) {}
export class CreateEngagementContextRequest extends S.Class<CreateEngagementContextRequest>(
  "CreateEngagementContextRequest",
)(
  {
    Catalog: S.String,
    EngagementIdentifier: S.String,
    ClientToken: S.String,
    Type: S.String,
    Payload: EngagementContextPayload,
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateEngagementContext" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEngagementInvitationRequest extends S.Class<CreateEngagementInvitationRequest>(
  "CreateEngagementInvitationRequest",
)(
  {
    Catalog: S.String,
    ClientToken: S.String,
    EngagementIdentifier: S.String,
    Invitation: Invitation,
  },
  T.all(
    T.Http({ method: "POST", uri: "/CreateEngagementInvitation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateOpportunityResponse extends S.Class<CreateOpportunityResponse>(
  "CreateOpportunityResponse",
)({
  Id: S.String,
  PartnerOpportunityIdentifier: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class AwsProductOptimization extends S.Class<AwsProductOptimization>(
  "AwsProductOptimization",
)({ Description: S.String, SavingsAmount: S.String }) {}
export const AwsProductOptimizationsList = S.Array(AwsProductOptimization);
export class GetResourceSnapshotResponse extends S.Class<GetResourceSnapshotResponse>(
  "GetResourceSnapshotResponse",
)({
  Catalog: S.String,
  Arn: S.optional(S.String),
  CreatedBy: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EngagementId: S.optional(S.String),
  ResourceType: S.optional(S.String),
  ResourceId: S.optional(S.String),
  ResourceSnapshotTemplateName: S.optional(S.String),
  Revision: S.optional(S.Number),
  Payload: S.optional(ResourceSnapshotPayload),
}) {}
export class CustomerSummary extends S.Class<CustomerSummary>(
  "CustomerSummary",
)({ Account: S.optional(AccountSummary) }) {}
export class AwsProductDetails extends S.Class<AwsProductDetails>(
  "AwsProductDetails",
)({
  ProductCode: S.String,
  ServiceCode: S.optional(S.String),
  Categories: StringList,
  Amount: S.optional(S.String),
  OptimizedAmount: S.optional(S.String),
  PotentialSavingsAmount: S.optional(S.String),
  Optimizations: AwsProductOptimizationsList,
}) {}
export const AwsProductsList = S.Array(AwsProductDetails);
export class OpportunitySummary extends S.Class<OpportunitySummary>(
  "OpportunitySummary",
)({
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
}) {}
export const OpportunitySummaries = S.Array(OpportunitySummary);
export class AwsProductInsights extends S.Class<AwsProductInsights>(
  "AwsProductInsights",
)({
  CurrencyCode: S.String,
  Frequency: S.String,
  TotalAmount: S.optional(S.String),
  TotalOptimizedAmount: S.optional(S.String),
  TotalPotentialSavingsAmount: S.optional(S.String),
  TotalAmountByCategory: AmountMap,
  AwsProducts: AwsProductsList,
}) {}
export class CreateEngagementContextResponse extends S.Class<CreateEngagementContextResponse>(
  "CreateEngagementContextResponse",
)({
  EngagementId: S.optional(S.String),
  EngagementArn: S.optional(S.String),
  EngagementLastModifiedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  ContextId: S.optional(S.String),
}) {}
export class CreateEngagementInvitationResponse extends S.Class<CreateEngagementInvitationResponse>(
  "CreateEngagementInvitationResponse",
)({ Id: S.String, Arn: S.String }) {}
export class ListOpportunitiesResponse extends S.Class<ListOpportunitiesResponse>(
  "ListOpportunitiesResponse",
)({
  OpportunitySummaries: OpportunitySummaries,
  NextToken: S.optional(S.String),
}) {}
export class AwsProductsSpendInsightsBySource extends S.Class<AwsProductsSpendInsightsBySource>(
  "AwsProductsSpendInsightsBySource",
)({
  Partner: S.optional(AwsProductInsights),
  AWS: S.optional(AwsProductInsights),
}) {}
export class ValidationExceptionError extends S.Class<ValidationExceptionError>(
  "ValidationExceptionError",
)({ FieldName: S.optional(S.String), Message: S.String, Code: S.String }) {}
export const ValidationExceptionErrorList = S.Array(ValidationExceptionError);
export class AwsOpportunityInsights extends S.Class<AwsOpportunityInsights>(
  "AwsOpportunityInsights",
)({
  NextBestActions: S.optional(S.String),
  EngagementScore: S.optional(S.String),
  AwsProductsSpendInsightsBySource: S.optional(
    AwsProductsSpendInsightsBySource,
  ),
}) {}
export class GetAwsOpportunitySummaryResponse extends S.Class<GetAwsOpportunitySummaryResponse>(
  "GetAwsOpportunitySummaryResponse",
)({
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
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.String,
    ErrorList: S.optional(ValidationExceptionErrorList),
  },
) {}

//# Operations
/**
 * Use this action to retrieve the engagement record for a given `EngagementIdentifier`.
 */
export const getEngagement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAwsOpportunitySummary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAwsOpportunitySummaryRequest,
    output: GetAwsOpportunitySummaryResponse,
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
export const createOpportunity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResourceSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startEngagementFromOpportunityTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listEngagements = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEngagementsRequest,
  output: ListEngagementsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all in-progress, completed, or failed StartEngagementByAcceptingInvitationTask tasks that were initiated by the caller's account.
 */
export const listEngagementByAcceptingInvitationTasks =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListEngagementByAcceptingInvitationTasksRequest,
    output: ListEngagementByAcceptingInvitationTasksResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves a list of engagement invitations sent to the partner. This allows partners to view all pending or past engagement invitations, helping them track opportunities shared by AWS.
 */
export const listEngagementInvitations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEngagementInvitationsRequest,
    output: ListEngagementInvitationsResponse,
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
 * Lists resource snapshot jobs owned by the customer. This operation supports various filtering scenarios, including listing all jobs owned by the caller, jobs for a specific engagement, jobs with a specific status, or any combination of these filters.
 */
export const listResourceSnapshotJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourceSnapshotJobsRequest,
    output: ListResourceSnapshotJobsResponse,
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
 * Retrieves a list of Partner Solutions that the partner registered on Partner Central. This API is used to generate a list of solutions that an end user selects from for association with an opportunity.
 */
export const listSolutions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSolutionsRequest,
  output: ListSolutionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the details of member partners in an Engagement. This operation can only be invoked by members of the Engagement. The `ListEngagementMembers` operation allows you to fetch information about the members of a specific Engagement. This action is restricted to members of the Engagement being queried.
 */
export const listEngagementMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEngagementMembersRequest,
    output: ListEngagementMembersResponse,
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
 * Lists all in-progress, completed, or failed `EngagementFromOpportunity` tasks that were initiated by the caller's account.
 */
export const listEngagementFromOpportunityTasks =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListEngagementFromOpportunityTasksRequest,
    output: ListEngagementFromOpportunityTasksResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the details of an engagement invitation shared by AWS with a partner. The information includes aspects such as customer, project details, and lifecycle information. To connect an engagement invitation with an opportunity, match the invitation’s `Payload.Project.Title` with opportunity `Project.Title`.
 */
export const getEngagementInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEngagementInvitationRequest,
    output: GetEngagementInvitationResponse,
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
 * Fetches the `Opportunity` record from Partner Central by a given `Identifier`.
 *
 * Use the `ListOpportunities` action or the event notification (from Amazon EventBridge) to obtain this identifier.
 */
export const getOpportunity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listOpportunityFromEngagementTasks =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListOpportunityFromEngagementTasksRequest,
    output: ListOpportunityFromEngagementTasksResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the associations between resources and engagements where the caller is a member and has at least one snapshot in the engagement.
 */
export const listEngagementResourceAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListEngagementResourceAssociationsRequest,
    output: ListEngagementResourceAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
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
export const listResourceSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourceSnapshotsRequest,
    output: ListResourceSnapshotsResponse,
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
 * Updates the `Opportunity` record identified by a given `Identifier`. This operation allows you to modify the details of an existing opportunity to reflect the latest information and progress. Use this action to keep the opportunity record up-to-date and accurate.
 *
 * When you perform updates, include the entire payload with each request. If any field is omitted, the API assumes that the field is set to `null`. The best practice is to always perform a `GetOpportunity` to retrieve the latest values, then send the complete payload with the updated values to be changed.
 */
export const updateOpportunity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const acceptEngagementInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * This action rejects an `EngagementInvitation` that AWS shared. Rejecting an invitation indicates that the partner doesn't want to pursue the opportunity, and all related data will become inaccessible thereafter.
 */
export const rejectEngagementInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Use this action to deletes a previously created resource snapshot job. The job must be in a stopped state before it can be deleted.
 */
export const deleteResourceSnapshotJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Assigns one or more tags (key-value pairs) to the specified resource.
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
 * Enables you to reassign an existing `Opportunity` to another user within your Partner Central account. The specified user receives the opportunity, and it appears on their Partner Central dashboard, allowing them to take necessary actions or proceed with the opportunity.
 *
 * This is useful for distributing opportunities to the appropriate team members or departments within your organization, ensuring that each opportunity is handled by the right person. By default, the opportunity owner is the one who creates it. Currently, there's no API to enumerate the list of available users.
 */
export const assignOpportunity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResourceSnapshotJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourceSnapshotJobRequest,
    output: GetResourceSnapshotJobResponse,
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
export const associateOpportunity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateOpportunityRequest,
    output: AssociateOpportunityResponse,
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
 * Allows you to remove an existing association between an `Opportunity` and related entities, such as a Partner Solution, Amazon Web Services product, or an Amazon Web Services Marketplace offer. This operation is the counterpart to `AssociateOpportunity`, and it provides flexibility to manage associations as business needs change.
 *
 * Use this operation to update the associations of an `Opportunity` due to changes in the related entities, or if an association was made in error. Ensuring accurate associations helps maintain clarity and accuracy to track and manage business opportunities. When you replace an entity, first attach the new entity and then disassociate the one to be removed, especially if it's the last remaining entity that's required.
 */
export const disassociateOpportunity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateOpportunityRequest,
    output: DisassociateOpportunityResponse,
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
 * Use this action to submit an Opportunity that was previously created by partner for AWS review. After you perform this action, the Opportunity becomes non-editable until it is reviewed by AWS and has ` LifeCycle.ReviewStatus ` as either `Approved` or `Action Required`.
 */
export const submitOpportunity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startResourceSnapshotJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartResourceSnapshotJobRequest,
    output: StartResourceSnapshotJobResponse,
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
 * Stops a resource snapshot job. The job must be started prior to being stopped.
 */
export const stopResourceSnapshotJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopResourceSnapshotJobRequest,
    output: StopResourceSnapshotJobResponse,
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
 * Retrieves the currently set system settings, which include the IAM Role used for resource snapshot jobs.
 */
export const getSellingSystemSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSellingSystemSettingsRequest,
    output: GetSellingSystemSettingsResponse,
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
 * Returns a list of tags for a resource.
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
 * Updates the currently set system settings, which include the IAM Role used for resource snapshot jobs.
 */
export const putSellingSystemSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutSellingSystemSettingsRequest,
    output: PutSellingSystemSettingsResponse,
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
 * Removes a tag or tags from a resource.
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
 * This action starts the engagement by accepting an `EngagementInvitation`. The task is asynchronous and involves the following steps: accepting the invitation, creating an opportunity in the partner’s account from the AWS opportunity, and copying details for tracking. When completed, an `Opportunity Created` event is generated, indicating that the opportunity has been successfully created in the partner's account.
 */
export const startEngagementByAcceptingInvitationTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startOpportunityFromEngagementTask =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createResourceSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Use this action to create a job to generate a snapshot of the specified resource within an engagement. It initiates an asynchronous process to create a resource snapshot. The job creates a new snapshot only if the resource state has changed, adhering to the same access control and immutability rules as direct snapshot creation.
 */
export const createResourceSnapshotJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * The `CreateEngagement` action allows you to create an `Engagement`, which serves as a collaborative space between different parties such as AWS Partners and AWS Sellers. This action automatically adds the caller's AWS account as an active member of the newly created `Engagement`.
 */
export const createEngagement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateEngagementContext = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a new context within an existing engagement. This action allows you to add contextual information such as customer projects or documents to an engagement, providing additional details that help facilitate collaboration between engagement members.
 */
export const createEngagementContext = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * This action creates an invitation from a sender to a single receiver to join an engagement.
 */
export const createEngagementInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const listOpportunities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOpportunitiesRequest,
  output: ListOpportunitiesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

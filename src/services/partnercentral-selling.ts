import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
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
export class UpdateLeadContext extends S.Class<UpdateLeadContext>(
  "UpdateLeadContext",
)({
  QualificationStatus: S.optional(S.String),
  Customer: LeadCustomer,
  Interaction: S.optional(LeadInteraction),
}) {}
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
export const UpdateEngagementContextPayload = S.Union(
  S.Struct({ Lead: UpdateLeadContext }),
  S.Struct({ CustomerProject: CustomerProjectsContext }),
);
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
export class ValidationExceptionError extends S.Class<ValidationExceptionError>(
  "ValidationExceptionError",
)({ FieldName: S.optional(S.String), Message: S.String, Code: S.String }) {}
export const ValidationExceptionErrorList = S.Array(ValidationExceptionError);
export const LeadInteractionList = S.Array(LeadInteraction);
export class UpdateEngagementContextResponse extends S.Class<UpdateEngagementContextResponse>(
  "UpdateEngagementContextResponse",
)({
  EngagementId: S.String,
  EngagementArn: S.String,
  EngagementLastModifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  ContextId: S.String,
}) {}
export class LeadContext extends S.Class<LeadContext>("LeadContext")({
  QualificationStatus: S.optional(S.String),
  Customer: LeadCustomer,
  Interactions: LeadInteractionList,
}) {}
export const EngagementContextPayload = S.Union(
  S.Struct({ CustomerProject: CustomerProjectsContext }),
  S.Struct({ Lead: LeadContext }),
);
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
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}

//# Operations
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

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "NotificationsContacts",
  serviceShapeName: "NotificationsContacts",
});
const auth = T.AwsAuthSigv4({ name: "notifications-contacts" });
const ver = T.ServiceVersion("2018-05-10");
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
                    url: "https://notifications-contacts-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {
                      authSchemes: [
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
                    url: "https://notifications-contacts.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {
                      authSchemes: [
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
export const TagKeys = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{arn}" }),
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
    arn: S.String.pipe(T.HttpLabel("arn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{arn}" }),
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
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateEmailContactRequest extends S.Class<CreateEmailContactRequest>(
  "CreateEmailContactRequest",
)(
  { name: S.String, emailAddress: S.String, tags: S.optional(TagMap) },
  T.all(
    T.Http({ method: "POST", uri: "/2022-09-19/emailcontacts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEmailContactRequest extends S.Class<GetEmailContactRequest>(
  "GetEmailContactRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/emailcontacts/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEmailContactRequest extends S.Class<DeleteEmailContactRequest>(
  "DeleteEmailContactRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/emailcontacts/{arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEmailContactResponse extends S.Class<DeleteEmailContactResponse>(
  "DeleteEmailContactResponse",
)({}) {}
export class ListEmailContactsRequest extends S.Class<ListEmailContactsRequest>(
  "ListEmailContactsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/emailcontacts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ActivateEmailContactRequest extends S.Class<ActivateEmailContactRequest>(
  "ActivateEmailContactRequest",
)(
  {
    arn: S.String.pipe(T.HttpLabel("arn")),
    code: S.String.pipe(T.HttpLabel("code")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/emailcontacts/{arn}/activate/{code}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ActivateEmailContactResponse extends S.Class<ActivateEmailContactResponse>(
  "ActivateEmailContactResponse",
)({}) {}
export class SendActivationCodeRequest extends S.Class<SendActivationCodeRequest>(
  "SendActivationCodeRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2022-10-31/emailcontacts/{arn}/activate/send",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendActivationCodeResponse extends S.Class<SendActivationCodeResponse>(
  "SendActivationCodeResponse",
)({}) {}
export class EmailContact extends S.Class<EmailContact>("EmailContact")({
  arn: S.String,
  name: S.String,
  address: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const EmailContacts = S.Array(EmailContact);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { arn: S.String.pipe(T.HttpLabel("arn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{arn}" }),
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
export class CreateEmailContactResponse extends S.Class<CreateEmailContactResponse>(
  "CreateEmailContactResponse",
)({ arn: S.String }) {}
export class ListEmailContactsResponse extends S.Class<ListEmailContactsResponse>(
  "ListEmailContactsResponse",
)({ nextToken: S.optional(S.String), emailContacts: EmailContacts }) {}
export class GetEmailContactResponse extends S.Class<GetEmailContactResponse>(
  "GetEmailContactResponse",
)({ emailContact: EmailContact }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
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
 * Lists all email contacts created under the Account.
 */
export const listEmailContacts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEmailContactsRequest,
    output: ListEmailContactsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "emailContacts",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns an email contact.
 */
export const getEmailContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEmailContactRequest,
  output: GetEmailContactResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all of the tags associated with the Amazon Resource Name (ARN) that you specify. The resource can be a user, server, or role.
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
 * Attaches a key-value pair to a resource, as identified by its Amazon Resource Name (ARN). Taggable resources in AWS User Notifications Contacts include email contacts.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an email contact.
 *
 * Deleting an email contact removes it from all associated notification configurations.
 */
export const deleteEmailContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEmailContactRequest,
  output: DeleteEmailContactResponse,
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
 * Activates an email contact using an activation code. This code is in the activation email sent to the email address associated with this email contact.
 */
export const activateEmailContact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ActivateEmailContactRequest,
    output: ActivateEmailContactResponse,
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
 * Sends an activation email to the email address associated with the specified email contact.
 *
 * It might take a few minutes for the activation email to arrive. If it doesn't arrive, check in your spam folder or try sending another activation email.
 */
export const sendActivationCode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendActivationCodeRequest,
  output: SendActivationCodeResponse,
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
 * Detaches a key-value pair from a resource, as identified by its Amazon Resource Name (ARN). Taggable resources in AWS User Notifications Contacts include email contacts..
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
 * Creates an email contact for the provided email address.
 */
export const createEmailContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEmailContactRequest,
  output: CreateEmailContactResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

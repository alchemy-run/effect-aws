import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "repostspace",
  serviceShapeName: "RepostSpace",
});
const auth = T.AwsAuthSigv4({ name: "repostspace" });
const ver = T.ServiceVersion("2022-05-13");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://repostspace-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://repostspace-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://repostspace.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://repostspace.{Region}.{PartitionResult#dnsSuffix}",
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
export const AccessorIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BatchAddChannelRoleToAccessorsInput extends S.Class<BatchAddChannelRoleToAccessorsInput>(
  "BatchAddChannelRoleToAccessorsInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    channelId: S.String.pipe(T.HttpLabel("channelId")),
    accessorIds: AccessorIdList,
    channelRole: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/spaces/{spaceId}/channels/{channelId}/roles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchAddRoleInput extends S.Class<BatchAddRoleInput>(
  "BatchAddRoleInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    accessorIds: AccessorIdList,
    role: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/spaces/{spaceId}/roles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchRemoveChannelRoleFromAccessorsInput extends S.Class<BatchRemoveChannelRoleFromAccessorsInput>(
  "BatchRemoveChannelRoleFromAccessorsInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    channelId: S.String.pipe(T.HttpLabel("channelId")),
    accessorIds: AccessorIdList,
    channelRole: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/spaces/{spaceId}/channels/{channelId}/roles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchRemoveRoleInput extends S.Class<BatchRemoveRoleInput>(
  "BatchRemoveRoleInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    accessorIds: AccessorIdList,
    role: S.String,
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/spaces/{spaceId}/roles" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateChannelInput extends S.Class<CreateChannelInput>(
  "CreateChannelInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    channelName: S.String,
    channelDescription: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/spaces/{spaceId}/channels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSpaceInput extends S.Class<DeleteSpaceInput>(
  "DeleteSpaceInput",
)(
  { spaceId: S.String.pipe(T.HttpLabel("spaceId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/spaces/{spaceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSpaceResponse extends S.Class<DeleteSpaceResponse>(
  "DeleteSpaceResponse",
)({}) {}
export class DeregisterAdminInput extends S.Class<DeregisterAdminInput>(
  "DeregisterAdminInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    adminId: S.String.pipe(T.HttpLabel("adminId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/spaces/{spaceId}/admins/{adminId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterAdminResponse extends S.Class<DeregisterAdminResponse>(
  "DeregisterAdminResponse",
)({}) {}
export class GetChannelInput extends S.Class<GetChannelInput>(
  "GetChannelInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    channelId: S.String.pipe(T.HttpLabel("channelId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/spaces/{spaceId}/channels/{channelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSpaceInput extends S.Class<GetSpaceInput>("GetSpaceInput")(
  { spaceId: S.String.pipe(T.HttpLabel("spaceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/spaces/{spaceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListChannelsInput extends S.Class<ListChannelsInput>(
  "ListChannelsInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/spaces/{spaceId}/channels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSpacesInput extends S.Class<ListSpacesInput>(
  "ListSpacesInput",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/spaces" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterAdminInput extends S.Class<RegisterAdminInput>(
  "RegisterAdminInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    adminId: S.String.pipe(T.HttpLabel("adminId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/spaces/{spaceId}/admins/{adminId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterAdminResponse extends S.Class<RegisterAdminResponse>(
  "RegisterAdminResponse",
)({}) {}
export class SendInvitesInput extends S.Class<SendInvitesInput>(
  "SendInvitesInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    accessorIds: AccessorIdList,
    title: S.String,
    body: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/spaces/{spaceId}/invite" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendInvitesResponse extends S.Class<SendInvitesResponse>(
  "SendInvitesResponse",
)({}) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: Tags },
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
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
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
export class UpdateChannelInput extends S.Class<UpdateChannelInput>(
  "UpdateChannelInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    channelId: S.String.pipe(T.HttpLabel("channelId")),
    channelName: S.String,
    channelDescription: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/spaces/{spaceId}/channels/{channelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateChannelOutput extends S.Class<UpdateChannelOutput>(
  "UpdateChannelOutput",
)({}) {}
export const AllowedDomainsList = S.Array(S.String);
export class SupportedEmailDomainsParameters extends S.Class<SupportedEmailDomainsParameters>(
  "SupportedEmailDomainsParameters",
)({
  enabled: S.optional(S.String),
  allowedDomains: S.optional(AllowedDomainsList),
}) {}
export class UpdateSpaceInput extends S.Class<UpdateSpaceInput>(
  "UpdateSpaceInput",
)(
  {
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    description: S.optional(S.String),
    tier: S.optional(S.String),
    roleArn: S.optional(S.String),
    supportedEmailDomains: S.optional(SupportedEmailDomainsParameters),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/spaces/{spaceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSpaceResponse extends S.Class<UpdateSpaceResponse>(
  "UpdateSpaceResponse",
)({}) {}
export const UserAdmins = S.Array(S.String);
export const GroupAdmins = S.Array(S.String);
export class BatchError extends S.Class<BatchError>("BatchError")({
  accessorId: S.String,
  error: S.Number,
  message: S.String,
}) {}
export const BatchErrorList = S.Array(BatchError);
export class BatchAddRoleOutput extends S.Class<BatchAddRoleOutput>(
  "BatchAddRoleOutput",
)({ addedAccessorIds: AccessorIdList, errors: BatchErrorList }) {}
export class BatchRemoveChannelRoleFromAccessorsOutput extends S.Class<BatchRemoveChannelRoleFromAccessorsOutput>(
  "BatchRemoveChannelRoleFromAccessorsOutput",
)({ removedAccessorIds: AccessorIdList, errors: BatchErrorList }) {}
export class BatchRemoveRoleOutput extends S.Class<BatchRemoveRoleOutput>(
  "BatchRemoveRoleOutput",
)({ removedAccessorIds: AccessorIdList, errors: BatchErrorList }) {}
export class CreateChannelOutput extends S.Class<CreateChannelOutput>(
  "CreateChannelOutput",
)({ channelId: S.String }) {}
export class CreateSpaceInput extends S.Class<CreateSpaceInput>(
  "CreateSpaceInput",
)(
  {
    name: S.String,
    subdomain: S.String,
    tier: S.String,
    description: S.optional(S.String),
    userKMSKey: S.optional(S.String),
    tags: S.optional(Tags),
    roleArn: S.optional(S.String),
    supportedEmailDomains: S.optional(SupportedEmailDomainsParameters),
  },
  T.all(
    T.Http({ method: "POST", uri: "/spaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export const ChannelRoleList = S.Array(S.String);
export const RoleList = S.Array(S.String);
export const ChannelRoles = S.Record({ key: S.String, value: ChannelRoleList });
export const Roles = S.Record({ key: S.String, value: RoleList });
export class SupportedEmailDomainsStatus extends S.Class<SupportedEmailDomainsStatus>(
  "SupportedEmailDomainsStatus",
)({
  enabled: S.optional(S.String),
  allowedDomains: S.optional(AllowedDomainsList),
}) {}
export class ChannelData extends S.Class<ChannelData>("ChannelData")({
  spaceId: S.String,
  channelId: S.String,
  channelName: S.String,
  channelDescription: S.optional(S.String),
  createDateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  deleteDateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  channelStatus: S.String,
  userCount: S.Number,
  groupCount: S.Number,
}) {}
export const ChannelsList = S.Array(ChannelData);
export class SpaceData extends S.Class<SpaceData>("SpaceData")({
  spaceId: S.String,
  arn: S.String,
  name: S.String,
  description: S.optional(S.String),
  status: S.String,
  configurationStatus: S.String,
  vanityDomainStatus: S.String,
  vanityDomain: S.String,
  randomDomain: S.String,
  tier: S.String,
  storageLimit: S.Number,
  createDateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  deleteDateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  userKMSKey: S.optional(S.String),
  userCount: S.optional(S.Number),
  contentSize: S.optional(S.Number),
  supportedEmailDomains: S.optional(SupportedEmailDomainsStatus),
}) {}
export const SpacesList = S.Array(SpaceData);
export class BatchAddChannelRoleToAccessorsOutput extends S.Class<BatchAddChannelRoleToAccessorsOutput>(
  "BatchAddChannelRoleToAccessorsOutput",
)({ addedAccessorIds: AccessorIdList, errors: BatchErrorList }) {}
export class CreateSpaceOutput extends S.Class<CreateSpaceOutput>(
  "CreateSpaceOutput",
)({ spaceId: S.String }) {}
export class GetChannelOutput extends S.Class<GetChannelOutput>(
  "GetChannelOutput",
)({
  spaceId: S.String,
  channelId: S.String,
  channelName: S.String,
  channelDescription: S.optional(S.String),
  createDateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  deleteDateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  channelRoles: S.optional(ChannelRoles),
  channelStatus: S.String,
}) {}
export class GetSpaceOutput extends S.Class<GetSpaceOutput>("GetSpaceOutput")({
  spaceId: S.String,
  arn: S.String,
  name: S.String,
  status: S.String,
  configurationStatus: S.String,
  clientId: S.String,
  identityStoreId: S.optional(S.String),
  applicationArn: S.optional(S.String),
  description: S.optional(S.String),
  vanityDomainStatus: S.String,
  vanityDomain: S.String,
  randomDomain: S.String,
  customerRoleArn: S.optional(S.String),
  createDateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  deleteDateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tier: S.String,
  storageLimit: S.Number,
  userAdmins: S.optional(UserAdmins),
  groupAdmins: S.optional(GroupAdmins),
  roles: S.optional(Roles),
  userKMSKey: S.optional(S.String),
  userCount: S.optional(S.Number),
  contentSize: S.optional(S.Number),
  supportedEmailDomains: S.optional(SupportedEmailDomainsStatus),
}) {}
export class ListChannelsOutput extends S.Class<ListChannelsOutput>(
  "ListChannelsOutput",
)({ channels: ChannelsList, nextToken: S.optional(S.String) }) {}
export class ListSpacesOutput extends S.Class<ListSpacesOutput>(
  "ListSpacesOutput",
)({ spaces: SpacesList, nextToken: S.optional(S.String) }) {}
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
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
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
 * Returns the list of channel within a private re:Post with some information about each channel.
 */
export const listChannels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListChannelsInput,
    output: ListChannelsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "channels",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Displays information about a channel in a private re:Post.
 */
export const getChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelInput,
  output: GetChannelOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Displays information about the AWS re:Post Private private re:Post.
 */
export const getSpace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSpaceInput,
  output: GetSpaceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Modifies an existing channel.
 */
export const updateChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelInput,
  output: UpdateChannelOutput,
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
 * Returns the tags that are associated with the AWS re:Post Private resource specified by the resourceArn. The only resource that can be tagged is a private re:Post.
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
 * Removes the user or group from the list of administrators of the private re:Post.
 */
export const deregisterAdmin = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterAdminInput,
  output: DeregisterAdminResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a user or group to the list of administrators of the private re:Post.
 */
export const registerAdmin = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterAdminInput,
  output: RegisterAdminResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends an invitation email to selected users and groups.
 */
export const sendInvites = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendInvitesInput,
  output: SendInvitesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates tags with an AWS re:Post Private resource. Currently, the only resource that can be tagged is the private re:Post. If you specify a new tag key for the resource, the tag is appended to the list of tags that are associated with the resource. If you specify a tag key that’s already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
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
 * Removes the association of the tag with the AWS re:Post Private resource.
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
 * Add a role to multiple users or groups in a private re:Post.
 */
export const batchAddRole = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchAddRoleInput,
  output: BatchAddRoleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Remove a role from multiple users or groups in a private re:Post channel.
 */
export const batchRemoveChannelRoleFromAccessors =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchRemoveChannelRoleFromAccessorsInput,
    output: BatchRemoveChannelRoleFromAccessorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Remove a role from multiple users or groups in a private re:Post.
 */
export const batchRemoveRole = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchRemoveRoleInput,
  output: BatchRemoveRoleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Add role to multiple users or groups in a private re:Post channel.
 */
export const batchAddChannelRoleToAccessors =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchAddChannelRoleToAccessorsInput,
    output: BatchAddChannelRoleToAccessorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Modifies an existing AWS re:Post Private private re:Post.
 */
export const updateSpace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSpaceInput,
  output: UpdateSpaceResponse,
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
 * Returns a list of AWS re:Post Private private re:Posts in the account with some information about each private re:Post.
 */
export const listSpaces = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSpacesInput,
  output: ListSpacesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "spaces",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes an AWS re:Post Private private re:Post.
 */
export const deleteSpace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSpaceInput,
  output: DeleteSpaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a channel in an AWS re:Post Private private re:Post.
 */
export const createChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelInput,
  output: CreateChannelOutput,
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
 * Creates an AWS re:Post Private private re:Post.
 */
export const createSpace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSpaceInput,
  output: CreateSpaceOutput,
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

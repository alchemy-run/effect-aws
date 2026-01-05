import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "identitystore",
  serviceShapeName: "AWSIdentityStore",
});
const auth = T.AwsAuthSigv4({ name: "identitystore" });
const ver = T.ServiceVersion("2020-06-15");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://identitystore-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://identitystore.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://identitystore-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://identitystore.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://identitystore.{Region}.{PartitionResult#dnsSuffix}",
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
export const GroupIds = S.Array(S.String);
export const ExtensionNames = S.Array(S.String);
export class ExternalId extends S.Class<ExternalId>("ExternalId")({
  Issuer: S.String,
  Id: S.String,
}) {}
export class UniqueAttribute extends S.Class<UniqueAttribute>(
  "UniqueAttribute",
)({ AttributePath: S.String, AttributeValue: S.Any }) {}
export const AlternateIdentifier = S.Union(
  S.Struct({ ExternalId: ExternalId }),
  S.Struct({ UniqueAttribute: UniqueAttribute }),
);
export class GetUserIdRequest extends S.Class<GetUserIdRequest>(
  "GetUserIdRequest",
)(
  { IdentityStoreId: S.String, AlternateIdentifier: AlternateIdentifier },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const MemberId = S.Union(S.Struct({ UserId: S.String }));
export class IsMemberInGroupsRequest extends S.Class<IsMemberInGroupsRequest>(
  "IsMemberInGroupsRequest",
)(
  { IdentityStoreId: S.String, MemberId: MemberId, GroupIds: GroupIds },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGroupMembershipsForMemberRequest extends S.Class<ListGroupMembershipsForMemberRequest>(
  "ListGroupMembershipsForMemberRequest",
)(
  {
    IdentityStoreId: S.String,
    MemberId: MemberId,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGroupMembershipRequest extends S.Class<CreateGroupMembershipRequest>(
  "CreateGroupMembershipRequest",
)(
  { IdentityStoreId: S.String, GroupId: S.String, MemberId: MemberId },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGroupMembershipRequest extends S.Class<DescribeGroupMembershipRequest>(
  "DescribeGroupMembershipRequest",
)(
  { IdentityStoreId: S.String, MembershipId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGroupMembershipRequest extends S.Class<DeleteGroupMembershipRequest>(
  "DeleteGroupMembershipRequest",
)(
  { IdentityStoreId: S.String, MembershipId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGroupMembershipResponse extends S.Class<DeleteGroupMembershipResponse>(
  "DeleteGroupMembershipResponse",
)({}) {}
export class ListGroupMembershipsRequest extends S.Class<ListGroupMembershipsRequest>(
  "ListGroupMembershipsRequest",
)(
  {
    IdentityStoreId: S.String,
    GroupId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGroupRequest extends S.Class<CreateGroupRequest>(
  "CreateGroupRequest",
)(
  {
    IdentityStoreId: S.String,
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGroupRequest extends S.Class<DescribeGroupRequest>(
  "DescribeGroupRequest",
)(
  { IdentityStoreId: S.String, GroupId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGroupRequest extends S.Class<DeleteGroupRequest>(
  "DeleteGroupRequest",
)(
  { IdentityStoreId: S.String, GroupId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGroupResponse extends S.Class<DeleteGroupResponse>(
  "DeleteGroupResponse",
)({}) {}
export class DescribeUserRequest extends S.Class<DescribeUserRequest>(
  "DescribeUserRequest",
)(
  {
    IdentityStoreId: S.String,
    UserId: S.String,
    Extensions: S.optional(ExtensionNames),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttributeOperation extends S.Class<AttributeOperation>(
  "AttributeOperation",
)({ AttributePath: S.String, AttributeValue: S.optional(S.Any) }) {}
export const AttributeOperations = S.Array(AttributeOperation);
export class UpdateUserRequest extends S.Class<UpdateUserRequest>(
  "UpdateUserRequest",
)(
  {
    IdentityStoreId: S.String,
    UserId: S.String,
    Operations: AttributeOperations,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateUserResponse extends S.Class<UpdateUserResponse>(
  "UpdateUserResponse",
)({}) {}
export class DeleteUserRequest extends S.Class<DeleteUserRequest>(
  "DeleteUserRequest",
)(
  { IdentityStoreId: S.String, UserId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserResponse extends S.Class<DeleteUserResponse>(
  "DeleteUserResponse",
)({}) {}
export class Filter extends S.Class<Filter>("Filter")({
  AttributePath: S.String,
  AttributeValue: S.String,
}) {}
export const Filters = S.Array(Filter);
export class ListUsersRequest extends S.Class<ListUsersRequest>(
  "ListUsersRequest",
)(
  {
    IdentityStoreId: S.String,
    Extensions: S.optional(ExtensionNames),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ExternalIds = S.Array(ExternalId);
export class Name extends S.Class<Name>("Name")({
  Formatted: S.optional(S.String),
  FamilyName: S.optional(S.String),
  GivenName: S.optional(S.String),
  MiddleName: S.optional(S.String),
  HonorificPrefix: S.optional(S.String),
  HonorificSuffix: S.optional(S.String),
}) {}
export class Email extends S.Class<Email>("Email")({
  Value: S.optional(S.String),
  Type: S.optional(S.String),
  Primary: S.optional(S.Boolean),
}) {}
export const Emails = S.Array(Email);
export class Address extends S.Class<Address>("Address")({
  StreetAddress: S.optional(S.String),
  Locality: S.optional(S.String),
  Region: S.optional(S.String),
  PostalCode: S.optional(S.String),
  Country: S.optional(S.String),
  Formatted: S.optional(S.String),
  Type: S.optional(S.String),
  Primary: S.optional(S.Boolean),
}) {}
export const Addresses = S.Array(Address);
export class PhoneNumber extends S.Class<PhoneNumber>("PhoneNumber")({
  Value: S.optional(S.String),
  Type: S.optional(S.String),
  Primary: S.optional(S.Boolean),
}) {}
export const PhoneNumbers = S.Array(PhoneNumber);
export class Photo extends S.Class<Photo>("Photo")({
  Value: S.String,
  Type: S.optional(S.String),
  Display: S.optional(S.String),
  Primary: S.optional(S.Boolean),
}) {}
export const Photos = S.Array(Photo);
export const Extensions = S.Record({ key: S.String, value: S.Any });
export class GetGroupMembershipIdRequest extends S.Class<GetGroupMembershipIdRequest>(
  "GetGroupMembershipIdRequest",
)(
  { IdentityStoreId: S.String, GroupId: S.String, MemberId: MemberId },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUserIdResponse extends S.Class<GetUserIdResponse>(
  "GetUserIdResponse",
)({ IdentityStoreId: S.String, UserId: S.String }) {}
export class CreateGroupMembershipResponse extends S.Class<CreateGroupMembershipResponse>(
  "CreateGroupMembershipResponse",
)({ MembershipId: S.String, IdentityStoreId: S.String }) {}
export class DescribeGroupMembershipResponse extends S.Class<DescribeGroupMembershipResponse>(
  "DescribeGroupMembershipResponse",
)({
  IdentityStoreId: S.String,
  MembershipId: S.String,
  GroupId: S.String,
  MemberId: MemberId,
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  UpdatedBy: S.optional(S.String),
}) {}
export class GroupMembership extends S.Class<GroupMembership>(
  "GroupMembership",
)({
  IdentityStoreId: S.String,
  MembershipId: S.optional(S.String),
  GroupId: S.optional(S.String),
  MemberId: S.optional(MemberId),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  UpdatedBy: S.optional(S.String),
}) {}
export const GroupMemberships = S.Array(GroupMembership);
export class ListGroupMembershipsResponse extends S.Class<ListGroupMembershipsResponse>(
  "ListGroupMembershipsResponse",
)({ GroupMemberships: GroupMemberships, NextToken: S.optional(S.String) }) {}
export class CreateGroupResponse extends S.Class<CreateGroupResponse>(
  "CreateGroupResponse",
)({ GroupId: S.String, IdentityStoreId: S.String }) {}
export class DescribeGroupResponse extends S.Class<DescribeGroupResponse>(
  "DescribeGroupResponse",
)({
  GroupId: S.String,
  DisplayName: S.optional(S.String),
  ExternalIds: S.optional(ExternalIds),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  UpdatedBy: S.optional(S.String),
  IdentityStoreId: S.String,
}) {}
export class UpdateGroupRequest extends S.Class<UpdateGroupRequest>(
  "UpdateGroupRequest",
)(
  {
    IdentityStoreId: S.String,
    GroupId: S.String,
    Operations: AttributeOperations,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateGroupResponse extends S.Class<UpdateGroupResponse>(
  "UpdateGroupResponse",
)({}) {}
export class ListGroupsRequest extends S.Class<ListGroupsRequest>(
  "ListGroupsRequest",
)(
  {
    IdentityStoreId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUserRequest extends S.Class<CreateUserRequest>(
  "CreateUserRequest",
)(
  {
    IdentityStoreId: S.String,
    UserName: S.optional(S.String),
    Name: S.optional(Name),
    DisplayName: S.optional(S.String),
    NickName: S.optional(S.String),
    ProfileUrl: S.optional(S.String),
    Emails: S.optional(Emails),
    Addresses: S.optional(Addresses),
    PhoneNumbers: S.optional(PhoneNumbers),
    UserType: S.optional(S.String),
    Title: S.optional(S.String),
    PreferredLanguage: S.optional(S.String),
    Locale: S.optional(S.String),
    Timezone: S.optional(S.String),
    Photos: S.optional(Photos),
    Website: S.optional(S.String),
    Birthdate: S.optional(S.String),
    Extensions: S.optional(Extensions),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeUserResponse extends S.Class<DescribeUserResponse>(
  "DescribeUserResponse",
)({
  IdentityStoreId: S.String,
  UserId: S.String,
  UserName: S.optional(S.String),
  ExternalIds: S.optional(ExternalIds),
  Name: S.optional(Name),
  DisplayName: S.optional(S.String),
  NickName: S.optional(S.String),
  ProfileUrl: S.optional(S.String),
  Emails: S.optional(Emails),
  Addresses: S.optional(Addresses),
  PhoneNumbers: S.optional(PhoneNumbers),
  UserType: S.optional(S.String),
  Title: S.optional(S.String),
  PreferredLanguage: S.optional(S.String),
  Locale: S.optional(S.String),
  Timezone: S.optional(S.String),
  UserStatus: S.optional(S.String),
  Photos: S.optional(Photos),
  Website: S.optional(S.String),
  Birthdate: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedBy: S.optional(S.String),
  Extensions: S.optional(Extensions),
}) {}
export class GroupMembershipExistenceResult extends S.Class<GroupMembershipExistenceResult>(
  "GroupMembershipExistenceResult",
)({
  GroupId: S.optional(S.String),
  MemberId: S.optional(MemberId),
  MembershipExists: S.optional(S.Boolean),
}) {}
export const GroupMembershipExistenceResults = S.Array(
  GroupMembershipExistenceResult,
);
export class User extends S.Class<User>("User")({
  IdentityStoreId: S.String,
  UserId: S.String,
  UserName: S.optional(S.String),
  ExternalIds: S.optional(ExternalIds),
  Name: S.optional(Name),
  DisplayName: S.optional(S.String),
  NickName: S.optional(S.String),
  ProfileUrl: S.optional(S.String),
  Emails: S.optional(Emails),
  Addresses: S.optional(Addresses),
  PhoneNumbers: S.optional(PhoneNumbers),
  UserType: S.optional(S.String),
  Title: S.optional(S.String),
  PreferredLanguage: S.optional(S.String),
  Locale: S.optional(S.String),
  Timezone: S.optional(S.String),
  UserStatus: S.optional(S.String),
  Photos: S.optional(Photos),
  Website: S.optional(S.String),
  Birthdate: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedBy: S.optional(S.String),
  Extensions: S.optional(Extensions),
}) {}
export const Users = S.Array(User);
export class GetGroupIdRequest extends S.Class<GetGroupIdRequest>(
  "GetGroupIdRequest",
)(
  { IdentityStoreId: S.String, AlternateIdentifier: AlternateIdentifier },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetGroupMembershipIdResponse extends S.Class<GetGroupMembershipIdResponse>(
  "GetGroupMembershipIdResponse",
)({ MembershipId: S.String, IdentityStoreId: S.String }) {}
export class IsMemberInGroupsResponse extends S.Class<IsMemberInGroupsResponse>(
  "IsMemberInGroupsResponse",
)({ Results: GroupMembershipExistenceResults }) {}
export class ListGroupMembershipsForMemberResponse extends S.Class<ListGroupMembershipsForMemberResponse>(
  "ListGroupMembershipsForMemberResponse",
)({ GroupMemberships: GroupMemberships, NextToken: S.optional(S.String) }) {}
export class CreateUserResponse extends S.Class<CreateUserResponse>(
  "CreateUserResponse",
)({ IdentityStoreId: S.String, UserId: S.String }) {}
export class ListUsersResponse extends S.Class<ListUsersResponse>(
  "ListUsersResponse",
)({ Users: Users, NextToken: S.optional(S.String) }) {}
export class Group extends S.Class<Group>("Group")({
  GroupId: S.String,
  DisplayName: S.optional(S.String),
  ExternalIds: S.optional(ExternalIds),
  Description: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  UpdatedBy: S.optional(S.String),
  IdentityStoreId: S.String,
}) {}
export const Groups = S.Array(Group);
export class GetGroupIdResponse extends S.Class<GetGroupIdResponse>(
  "GetGroupIdResponse",
)({ GroupId: S.String, IdentityStoreId: S.String }) {}
export class ListGroupsResponse extends S.Class<ListGroupsResponse>(
  "ListGroupsResponse",
)({ Groups: Groups, NextToken: S.optional(S.String) }) {}

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
    Reason: S.optional(S.String),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
    Reason: S.optional(S.String),
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.optional(S.String),
    RequestId: S.optional(S.String),
    Reason: S.optional(S.String),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves the `UserId` in an identity store.
 *
 * If you have access to a member account, you can use this API operation from the member account. For more information, see Limiting access to the identity store from member accounts in the * IAM Identity Center User Guide*.
 */
export const getUserId = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserIdRequest,
  output: GetUserIdResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Lists all groups in the identity store. Returns a paginated list of complete `Group` objects. Filtering for a `Group` by the `DisplayName` attribute is deprecated. Instead, use the `GetGroupId` API action.
 *
 * If you have access to a member account, you can use this API operation from the member account. For more information, see Limiting access to the identity store from member accounts in the * IAM Identity Center User Guide*.
 */
export const listGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResponse,
  errors: [ResourceNotFoundException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Groups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a user within the specified identity store.
 */
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Checks the user's membership in all requested groups and returns if the member exists in all queried groups.
 *
 * If you have access to a member account, you can use this API operation from the member account. For more information, see Limiting access to the identity store from member accounts in the * IAM Identity Center User Guide*.
 */
export const isMemberInGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IsMemberInGroupsRequest,
  output: IsMemberInGroupsResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * For the specified member in the specified identity store, returns the list of all ` GroupMembership` objects and returns results in paginated form.
 *
 * If you have access to a member account, you can use this API operation from the member account. For more information, see Limiting access to the identity store from member accounts in the * IAM Identity Center User Guide*.
 */
export const listGroupMembershipsForMember =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListGroupMembershipsForMemberRequest,
    output: ListGroupMembershipsForMemberResponse,
    errors: [ResourceNotFoundException, ValidationException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "GroupMemberships",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all users in the identity store. Returns a paginated list of complete `User` objects. Filtering for a `User` by the `UserName` attribute is deprecated. Instead, use the `GetUserId` API action.
 *
 * If you have access to a member account, you can use this API operation from the member account. For more information, see Limiting access to the identity store from member accounts in the * IAM Identity Center User Guide*.
 */
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [ResourceNotFoundException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Users",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves membership metadata and attributes from `MembershipId` in an identity store.
 *
 * If you have access to a member account, you can use this API operation from the member account. For more information, see Limiting access to the identity store from member accounts in the * IAM Identity Center User Guide*.
 */
export const describeGroupMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGroupMembershipRequest,
    output: DescribeGroupMembershipResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }),
);
/**
 * Delete a membership within a group given `MembershipId`.
 */
export const deleteGroupMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteGroupMembershipRequest,
    output: DeleteGroupMembershipResponse,
    errors: [ConflictException, ResourceNotFoundException, ValidationException],
  }),
);
/**
 * For the specified group in the specified identity store, returns the list of all ` GroupMembership` objects and returns results in paginated form.
 *
 * If you have access to a member account, you can use this API operation from the member account. For more information, see Limiting access to the identity store from member accounts in the * IAM Identity Center User Guide*.
 */
export const listGroupMemberships =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListGroupMembershipsRequest,
    output: ListGroupMembershipsResponse,
    errors: [ResourceNotFoundException, ValidationException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "GroupMemberships",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves the group metadata and attributes from `GroupId` in an identity store.
 *
 * If you have access to a member account, you can use this API operation from the member account. For more information, see Limiting access to the identity store from member accounts in the * IAM Identity Center User Guide*.
 */
export const describeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGroupRequest,
  output: DescribeGroupResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Retrieves the user metadata and attributes from the `UserId` in an identity store.
 *
 * If you have access to a member account, you can use this API operation from the member account. For more information, see Limiting access to the identity store from member accounts in the * IAM Identity Center User Guide*.
 */
export const describeUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserRequest,
  output: DescribeUserResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Delete a group within an identity store given `GroupId`.
 */
export const deleteGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes a user within an identity store given `UserId`.
 */
export const deleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Retrieves the `MembershipId` in an identity store.
 *
 * If you have access to a member account, you can use this API operation from the member account. For more information, see Limiting access to the identity store from member accounts in the * IAM Identity Center User Guide*.
 */
export const getGroupMembershipId = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetGroupMembershipIdRequest,
    output: GetGroupMembershipIdResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }),
);
/**
 * Retrieves `GroupId` in an identity store.
 *
 * If you have access to a member account, you can use this API operation from the member account. For more information, see Limiting access to the identity store from member accounts in the * IAM Identity Center User Guide*.
 */
export const getGroupId = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupIdRequest,
  output: GetGroupIdResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Creates a group within the specified identity store.
 */
export const createGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Updates the specified group metadata and attributes in the specified identity store.
 */
export const updateGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupRequest,
  output: UpdateGroupResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Updates the specified user metadata and attributes in the specified identity store.
 */
export const updateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a relationship between a member and a group. The following identifiers must be specified: `GroupId`, `IdentityStoreId`, and `MemberId`.
 */
export const createGroupMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateGroupMembershipRequest,
    output: CreateGroupMembershipResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);

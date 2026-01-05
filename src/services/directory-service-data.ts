import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace(
  "http://directoryservicedata.amazonaws.com/doc/2023-05-31/",
);
const svc = T.AwsApiService({
  sdkId: "Directory Service Data",
  serviceShapeName: "DirectoryServiceData",
});
const auth = T.AwsAuthSigv4({ name: "ds-data" });
const ver = T.ServiceVersion("2023-05-31");
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
                                url: "https://ds-data-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://ds-data-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://ds-data.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://ds-data.{Region}.{PartitionResult#dnsSuffix}",
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
export const LdapDisplayNameList = S.Array(S.String);
export class AddGroupMemberRequest extends S.Class<AddGroupMemberRequest>(
  "AddGroupMemberRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    GroupName: S.String,
    MemberName: S.String,
    MemberRealm: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/GroupMemberships/AddGroupMember" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AddGroupMemberResult extends S.Class<AddGroupMemberResult>(
  "AddGroupMemberResult",
)({}, ns) {}
export const StringSetAttributeValue = S.Array(S.String);
export const AttributeValue = S.Union(
  S.Struct({ S: S.String }),
  S.Struct({ N: S.Number }),
  S.Struct({ BOOL: S.Boolean }),
  S.Struct({ SS: StringSetAttributeValue }),
);
export const Attributes = S.Record({ key: S.String, value: AttributeValue });
export class CreateUserRequest extends S.Class<CreateUserRequest>(
  "CreateUserRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    EmailAddress: S.optional(S.String),
    GivenName: S.optional(S.String),
    Surname: S.optional(S.String),
    OtherAttributes: S.optional(Attributes),
    ClientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Users/CreateUser" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGroupRequest extends S.Class<DeleteGroupRequest>(
  "DeleteGroupRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Groups/DeleteGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGroupResult extends S.Class<DeleteGroupResult>(
  "DeleteGroupResult",
)({}, ns) {}
export class DeleteUserRequest extends S.Class<DeleteUserRequest>(
  "DeleteUserRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Users/DeleteUser" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteUserResult extends S.Class<DeleteUserResult>(
  "DeleteUserResult",
)({}, ns) {}
export class DescribeGroupRequest extends S.Class<DescribeGroupRequest>(
  "DescribeGroupRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    SAMAccountName: S.String,
    OtherAttributes: S.optional(LdapDisplayNameList),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Groups/DescribeGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeUserRequest extends S.Class<DescribeUserRequest>(
  "DescribeUserRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    OtherAttributes: S.optional(LdapDisplayNameList),
    Realm: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Users/DescribeUser" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableUserRequest extends S.Class<DisableUserRequest>(
  "DisableUserRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Users/DisableUser" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisableUserResult extends S.Class<DisableUserResult>(
  "DisableUserResult",
)({}, ns) {}
export class ListGroupMembersRequest extends S.Class<ListGroupMembersRequest>(
  "ListGroupMembersRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    MemberRealm: S.optional(S.String),
    SAMAccountName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/GroupMemberships/ListGroupMembers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupsRequest extends S.Class<ListGroupsRequest>(
  "ListGroupsRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Groups/ListGroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupsForMemberRequest extends S.Class<ListGroupsForMemberRequest>(
  "ListGroupsForMemberRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    MemberRealm: S.optional(S.String),
    SAMAccountName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/GroupMemberships/ListGroupsForMember" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListUsersRequest extends S.Class<ListUsersRequest>(
  "ListUsersRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Users/ListUsers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveGroupMemberRequest extends S.Class<RemoveGroupMemberRequest>(
  "RemoveGroupMemberRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    GroupName: S.String,
    MemberName: S.String,
    MemberRealm: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/GroupMemberships/RemoveGroupMember" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveGroupMemberResult extends S.Class<RemoveGroupMemberResult>(
  "RemoveGroupMemberResult",
)({}, ns) {}
export class SearchGroupsRequest extends S.Class<SearchGroupsRequest>(
  "SearchGroupsRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SearchString: S.String,
    SearchAttributes: LdapDisplayNameList,
    Realm: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Groups/SearchGroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchUsersRequest extends S.Class<SearchUsersRequest>(
  "SearchUsersRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    SearchString: S.String,
    SearchAttributes: LdapDisplayNameList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Users/SearchUsers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGroupRequest extends S.Class<UpdateGroupRequest>(
  "UpdateGroupRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    GroupType: S.optional(S.String),
    GroupScope: S.optional(S.String),
    OtherAttributes: S.optional(Attributes),
    UpdateType: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Groups/UpdateGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGroupResult extends S.Class<UpdateGroupResult>(
  "UpdateGroupResult",
)({}, ns) {}
export class UpdateUserRequest extends S.Class<UpdateUserRequest>(
  "UpdateUserRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    EmailAddress: S.optional(S.String),
    GivenName: S.optional(S.String),
    Surname: S.optional(S.String),
    OtherAttributes: S.optional(Attributes),
    UpdateType: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Users/UpdateUser" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserResult extends S.Class<UpdateUserResult>(
  "UpdateUserResult",
)({}, ns) {}
export class CreateUserResult extends S.Class<CreateUserResult>(
  "CreateUserResult",
)(
  {
    DirectoryId: S.optional(S.String),
    SID: S.optional(S.String),
    SAMAccountName: S.optional(S.String),
  },
  ns,
) {}
export class DescribeGroupResult extends S.Class<DescribeGroupResult>(
  "DescribeGroupResult",
)(
  {
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    SID: S.optional(S.String),
    SAMAccountName: S.optional(S.String),
    DistinguishedName: S.optional(S.String),
    GroupType: S.optional(S.String),
    GroupScope: S.optional(S.String),
    OtherAttributes: S.optional(Attributes),
  },
  ns,
) {}
export class DescribeUserResult extends S.Class<DescribeUserResult>(
  "DescribeUserResult",
)(
  {
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    SID: S.optional(S.String),
    SAMAccountName: S.optional(S.String),
    DistinguishedName: S.optional(S.String),
    UserPrincipalName: S.optional(S.String),
    EmailAddress: S.optional(S.String),
    GivenName: S.optional(S.String),
    Surname: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    OtherAttributes: S.optional(Attributes),
  },
  ns,
) {}
export class GroupSummary extends S.Class<GroupSummary>("GroupSummary")({
  SID: S.String,
  SAMAccountName: S.String,
  GroupType: S.String,
  GroupScope: S.String,
}) {}
export const GroupSummaryList = S.Array(GroupSummary);
export class ListGroupsForMemberResult extends S.Class<ListGroupsForMemberResult>(
  "ListGroupsForMemberResult",
)(
  {
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    MemberRealm: S.optional(S.String),
    Groups: S.optional(GroupSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class Member extends S.Class<Member>("Member")({
  SID: S.String,
  SAMAccountName: S.String,
  MemberType: S.String,
}) {}
export const MemberList = S.Array(Member);
export class UserSummary extends S.Class<UserSummary>("UserSummary")({
  SID: S.String,
  SAMAccountName: S.String,
  GivenName: S.optional(S.String),
  Surname: S.optional(S.String),
  Enabled: S.Boolean,
}) {}
export const UserSummaryList = S.Array(UserSummary);
export class Group extends S.Class<Group>("Group")({
  SID: S.optional(S.String),
  SAMAccountName: S.String,
  DistinguishedName: S.optional(S.String),
  GroupType: S.optional(S.String),
  GroupScope: S.optional(S.String),
  OtherAttributes: S.optional(Attributes),
}) {}
export const GroupList = S.Array(Group);
export class User extends S.Class<User>("User")({
  SID: S.optional(S.String),
  SAMAccountName: S.String,
  DistinguishedName: S.optional(S.String),
  UserPrincipalName: S.optional(S.String),
  EmailAddress: S.optional(S.String),
  GivenName: S.optional(S.String),
  Surname: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  OtherAttributes: S.optional(Attributes),
}) {}
export const UserList = S.Array(User);
export class CreateGroupRequest extends S.Class<CreateGroupRequest>(
  "CreateGroupRequest",
)(
  {
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    GroupType: S.optional(S.String),
    GroupScope: S.optional(S.String),
    OtherAttributes: S.optional(Attributes),
    ClientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/Groups/CreateGroup" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGroupMembersResult extends S.Class<ListGroupMembersResult>(
  "ListGroupMembersResult",
)(
  {
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    MemberRealm: S.optional(S.String),
    Members: S.optional(MemberList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListGroupsResult extends S.Class<ListGroupsResult>(
  "ListGroupsResult",
)(
  {
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    Groups: S.optional(GroupSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListUsersResult extends S.Class<ListUsersResult>(
  "ListUsersResult",
)(
  {
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    Users: S.optional(UserSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class SearchGroupsResult extends S.Class<SearchGroupsResult>(
  "SearchGroupsResult",
)(
  {
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    Groups: S.optional(GroupList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class SearchUsersResult extends S.Class<SearchUsersResult>(
  "SearchUsersResult",
)(
  {
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    Users: S.optional(UserList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class CreateGroupResult extends S.Class<CreateGroupResult>(
  "CreateGroupResult",
)(
  {
    DirectoryId: S.optional(S.String),
    SAMAccountName: S.optional(S.String),
    SID: S.optional(S.String),
  },
  ns,
) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class DirectoryUnavailableException extends S.TaggedError<DirectoryUnavailableException>()(
  "DirectoryUnavailableException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
  T.Retryable(),
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns group information for the specified directory.
 *
 * This operation supports pagination with the use of the `NextToken` request and
 * response parameters. If more results are available, the `ListGroups.NextToken`
 * member contains a token that you pass in the next call to `ListGroups`. This
 * retrieves the next set of items.
 *
 * You can also specify a maximum number of return results with the `MaxResults`
 * parameter.
 */
export const listGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResult,
  errors: [
    AccessDeniedException,
    DirectoryUnavailableException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Groups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns member information for the specified group.
 *
 * This operation supports pagination with the use of the `NextToken` request and
 * response parameters. If more results are available, the
 * `ListGroupMembers.NextToken` member contains a token that you pass in the next
 * call to `ListGroupMembers`. This retrieves the next set of items.
 *
 * You can also specify a maximum number of return results with the `MaxResults`
 * parameter.
 */
export const listGroupMembers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListGroupMembersRequest,
    output: ListGroupMembersResult,
    errors: [
      AccessDeniedException,
      DirectoryUnavailableException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Members",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Deletes a group.
 */
export const deleteGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    DirectoryUnavailableException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a user.
 */
export const deleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    DirectoryUnavailableException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deactivates an active user account. For information about how to enable an inactive user
 * account, see ResetUserPassword
 * in the *Directory Service API Reference*.
 */
export const disableUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableUserRequest,
  output: DisableUserResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    DirectoryUnavailableException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a member from a group.
 */
export const removeGroupMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveGroupMemberRequest,
  output: RemoveGroupMemberResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    DirectoryUnavailableException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates group information.
 */
export const updateGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupRequest,
  output: UpdateGroupResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    DirectoryUnavailableException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates user information.
 */
export const updateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    DirectoryUnavailableException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific user.
 */
export const describeUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserRequest,
  output: DescribeUserResult,
  errors: [
    AccessDeniedException,
    DirectoryUnavailableException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns group information for the specified member.
 *
 * This operation supports pagination with the use of the `NextToken` request and
 * response parameters. If more results are available, the
 * `ListGroupsForMember.NextToken` member contains a token that you pass in the next
 * call to `ListGroupsForMember`. This retrieves the next set of items.
 *
 * You can also specify a maximum number of return results with the `MaxResults`
 * parameter.
 */
export const listGroupsForMember =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListGroupsForMemberRequest,
    output: ListGroupsForMemberResult,
    errors: [
      AccessDeniedException,
      DirectoryUnavailableException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Groups",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Adds an existing user, group, or computer as a group member.
 */
export const addGroupMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddGroupMemberRequest,
  output: AddGroupMemberResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    DirectoryUnavailableException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns user information for the specified directory.
 *
 * This operation supports pagination with the use of the `NextToken` request and
 * response parameters. If more results are available, the `ListUsers.NextToken`
 * member contains a token that you pass in the next call to `ListUsers`. This
 * retrieves the next set of items.
 *
 * You can also specify a maximum number of return results with the `MaxResults`
 * parameter.
 */
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersRequest,
  output: ListUsersResult,
  errors: [
    AccessDeniedException,
    DirectoryUnavailableException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Users",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Searches the specified directory for a group. You can find groups that match the
 * `SearchString` parameter with the value of their attributes included in the
 * `SearchString` parameter.
 *
 * This operation supports pagination with the use of the `NextToken` request and
 * response parameters. If more results are available, the `SearchGroups.NextToken`
 * member contains a token that you pass in the next call to `SearchGroups`. This
 * retrieves the next set of items.
 *
 * You can also specify a maximum number of return results with the `MaxResults`
 * parameter.
 */
export const searchGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchGroupsRequest,
    output: SearchGroupsResult,
    errors: [
      AccessDeniedException,
      DirectoryUnavailableException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Groups",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Searches the specified directory for a user. You can find users that match the
 * `SearchString` parameter with the value of their attributes included in the
 * `SearchString` parameter.
 *
 * This operation supports pagination with the use of the `NextToken` request and
 * response parameters. If more results are available, the `SearchUsers.NextToken`
 * member contains a token that you pass in the next call to `SearchUsers`. This
 * retrieves the next set of items.
 *
 * You can also specify a maximum number of return results with the `MaxResults`
 * parameter.
 */
export const searchUsers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: SearchUsersRequest,
    output: SearchUsersResult,
    errors: [
      AccessDeniedException,
      DirectoryUnavailableException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Users",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates a new user.
 */
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    DirectoryUnavailableException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new group.
 */
export const createGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    DirectoryUnavailableException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific group.
 */
export const describeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGroupRequest,
  output: DescribeGroupResult,
  errors: [
    AccessDeniedException,
    DirectoryUnavailableException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

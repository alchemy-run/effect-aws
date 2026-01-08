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
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
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
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://ds-data-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://ds-data-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ds-data.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ds-data.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DirectoryId = string;
export type GroupName = string;
export type MemberName = string;
export type Realm = string;
export type ClientToken = string;
export type UserName = string;
export type EmailAddress = string | Redacted.Redacted<string>;
export type GivenName = string | Redacted.Redacted<string>;
export type Surname = string | Redacted.Redacted<string>;
export type LdapDisplayName = string;
export type NextToken = string | Redacted.Redacted<string>;
export type MaxResults = number;
export type SearchString = string | Redacted.Redacted<string>;
export type ExceptionMessage = string;
export type SID = string;
export type DistinguishedName = string | Redacted.Redacted<string>;
export type UserPrincipalName = string | Redacted.Redacted<string>;
export type StringAttributeValue = string | Redacted.Redacted<string>;
export type NumberAttributeValue = number;

//# Schemas
export type LdapDisplayNameList = string[];
export const LdapDisplayNameList = S.Array(S.String);
export interface AddGroupMemberRequest {
  DirectoryId: string;
  GroupName: string;
  MemberName: string;
  MemberRealm?: string;
  ClientToken?: string;
}
export const AddGroupMemberRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    GroupName: S.String,
    MemberName: S.String,
    MemberRealm: S.optional(S.String),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/GroupMemberships/AddGroupMember" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddGroupMemberRequest",
}) as any as S.Schema<AddGroupMemberRequest>;
export interface AddGroupMemberResult {}
export const AddGroupMemberResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddGroupMemberResult",
}) as any as S.Schema<AddGroupMemberResult>;
export type StringSetAttributeValue = string | Redacted.Redacted<string>[];
export const StringSetAttributeValue = S.Array(SensitiveString);
export type AttributeValue =
  | { S: string | Redacted.Redacted<string> }
  | { N: number }
  | { BOOL: boolean }
  | { SS: StringSetAttributeValue };
export const AttributeValue = S.Union(
  S.Struct({ S: SensitiveString }),
  S.Struct({ N: S.Number }),
  S.Struct({ BOOL: S.Boolean }),
  S.Struct({ SS: StringSetAttributeValue }),
);
export type Attributes = { [key: string]: (typeof AttributeValue)["Type"] };
export const Attributes = S.Record({ key: S.String, value: AttributeValue });
export interface CreateUserRequest {
  DirectoryId: string;
  SAMAccountName: string;
  EmailAddress?: string | Redacted.Redacted<string>;
  GivenName?: string | Redacted.Redacted<string>;
  Surname?: string | Redacted.Redacted<string>;
  OtherAttributes?: Attributes;
  ClientToken?: string;
}
export const CreateUserRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    EmailAddress: S.optional(SensitiveString),
    GivenName: S.optional(SensitiveString),
    Surname: S.optional(SensitiveString),
    OtherAttributes: S.optional(Attributes),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Users/CreateUser" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUserRequest",
}) as any as S.Schema<CreateUserRequest>;
export interface DeleteGroupRequest {
  DirectoryId: string;
  SAMAccountName: string;
  ClientToken?: string;
}
export const DeleteGroupRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Groups/DeleteGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGroupRequest",
}) as any as S.Schema<DeleteGroupRequest>;
export interface DeleteGroupResult {}
export const DeleteGroupResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteGroupResult",
}) as any as S.Schema<DeleteGroupResult>;
export interface DeleteUserRequest {
  DirectoryId: string;
  SAMAccountName: string;
  ClientToken?: string;
}
export const DeleteUserRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Users/DeleteUser" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUserRequest",
}) as any as S.Schema<DeleteUserRequest>;
export interface DeleteUserResult {}
export const DeleteUserResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUserResult",
}) as any as S.Schema<DeleteUserResult>;
export interface DescribeGroupRequest {
  DirectoryId: string;
  Realm?: string;
  SAMAccountName: string;
  OtherAttributes?: LdapDisplayNameList;
}
export const DescribeGroupRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    SAMAccountName: S.String,
    OtherAttributes: S.optional(LdapDisplayNameList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Groups/DescribeGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeGroupRequest",
}) as any as S.Schema<DescribeGroupRequest>;
export interface DescribeUserRequest {
  DirectoryId: string;
  SAMAccountName: string;
  OtherAttributes?: LdapDisplayNameList;
  Realm?: string;
}
export const DescribeUserRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    OtherAttributes: S.optional(LdapDisplayNameList),
    Realm: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Users/DescribeUser" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeUserRequest",
}) as any as S.Schema<DescribeUserRequest>;
export interface DisableUserRequest {
  DirectoryId: string;
  SAMAccountName: string;
  ClientToken?: string;
}
export const DisableUserRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Users/DisableUser" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableUserRequest",
}) as any as S.Schema<DisableUserRequest>;
export interface DisableUserResult {}
export const DisableUserResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableUserResult",
}) as any as S.Schema<DisableUserResult>;
export interface ListGroupMembersRequest {
  DirectoryId: string;
  Realm?: string;
  MemberRealm?: string;
  SAMAccountName: string;
  NextToken?: string | Redacted.Redacted<string>;
  MaxResults?: number;
}
export const ListGroupMembersRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    MemberRealm: S.optional(S.String),
    SAMAccountName: S.String,
    NextToken: S.optional(SensitiveString),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/GroupMemberships/ListGroupMembers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGroupMembersRequest",
}) as any as S.Schema<ListGroupMembersRequest>;
export interface ListGroupsRequest {
  DirectoryId: string;
  Realm?: string;
  NextToken?: string | Redacted.Redacted<string>;
  MaxResults?: number;
}
export const ListGroupsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    NextToken: S.optional(SensitiveString),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Groups/ListGroups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGroupsRequest",
}) as any as S.Schema<ListGroupsRequest>;
export interface ListGroupsForMemberRequest {
  DirectoryId: string;
  Realm?: string;
  MemberRealm?: string;
  SAMAccountName: string;
  NextToken?: string | Redacted.Redacted<string>;
  MaxResults?: number;
}
export const ListGroupsForMemberRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    MemberRealm: S.optional(S.String),
    SAMAccountName: S.String,
    NextToken: S.optional(SensitiveString),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/GroupMemberships/ListGroupsForMember" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGroupsForMemberRequest",
}) as any as S.Schema<ListGroupsForMemberRequest>;
export interface ListUsersRequest {
  DirectoryId: string;
  Realm?: string;
  NextToken?: string | Redacted.Redacted<string>;
  MaxResults?: number;
}
export const ListUsersRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    NextToken: S.optional(SensitiveString),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Users/ListUsers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListUsersRequest",
}) as any as S.Schema<ListUsersRequest>;
export interface RemoveGroupMemberRequest {
  DirectoryId: string;
  GroupName: string;
  MemberName: string;
  MemberRealm?: string;
  ClientToken?: string;
}
export const RemoveGroupMemberRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    GroupName: S.String,
    MemberName: S.String,
    MemberRealm: S.optional(S.String),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/GroupMemberships/RemoveGroupMember" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveGroupMemberRequest",
}) as any as S.Schema<RemoveGroupMemberRequest>;
export interface RemoveGroupMemberResult {}
export const RemoveGroupMemberResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveGroupMemberResult",
}) as any as S.Schema<RemoveGroupMemberResult>;
export interface SearchGroupsRequest {
  DirectoryId: string;
  SearchString: string | Redacted.Redacted<string>;
  SearchAttributes: LdapDisplayNameList;
  Realm?: string;
  NextToken?: string | Redacted.Redacted<string>;
  MaxResults?: number;
}
export const SearchGroupsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SearchString: SensitiveString,
    SearchAttributes: LdapDisplayNameList,
    Realm: S.optional(S.String),
    NextToken: S.optional(SensitiveString),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Groups/SearchGroups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchGroupsRequest",
}) as any as S.Schema<SearchGroupsRequest>;
export interface SearchUsersRequest {
  DirectoryId: string;
  Realm?: string;
  SearchString: string | Redacted.Redacted<string>;
  SearchAttributes: LdapDisplayNameList;
  NextToken?: string | Redacted.Redacted<string>;
  MaxResults?: number;
}
export const SearchUsersRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    Realm: S.optional(S.String),
    SearchString: SensitiveString,
    SearchAttributes: LdapDisplayNameList,
    NextToken: S.optional(SensitiveString),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Users/SearchUsers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchUsersRequest",
}) as any as S.Schema<SearchUsersRequest>;
export interface UpdateGroupRequest {
  DirectoryId: string;
  SAMAccountName: string;
  GroupType?: string;
  GroupScope?: string;
  OtherAttributes?: Attributes;
  UpdateType?: string;
  ClientToken?: string;
}
export const UpdateGroupRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    GroupType: S.optional(S.String),
    GroupScope: S.optional(S.String),
    OtherAttributes: S.optional(Attributes),
    UpdateType: S.optional(S.String),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Groups/UpdateGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGroupRequest",
}) as any as S.Schema<UpdateGroupRequest>;
export interface UpdateGroupResult {}
export const UpdateGroupResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateGroupResult",
}) as any as S.Schema<UpdateGroupResult>;
export interface UpdateUserRequest {
  DirectoryId: string;
  SAMAccountName: string;
  EmailAddress?: string | Redacted.Redacted<string>;
  GivenName?: string | Redacted.Redacted<string>;
  Surname?: string | Redacted.Redacted<string>;
  OtherAttributes?: Attributes;
  UpdateType?: string;
  ClientToken?: string;
}
export const UpdateUserRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    EmailAddress: S.optional(SensitiveString),
    GivenName: S.optional(SensitiveString),
    Surname: S.optional(SensitiveString),
    OtherAttributes: S.optional(Attributes),
    UpdateType: S.optional(S.String),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Users/UpdateUser" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateUserRequest",
}) as any as S.Schema<UpdateUserRequest>;
export interface UpdateUserResult {}
export const UpdateUserResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateUserResult",
}) as any as S.Schema<UpdateUserResult>;
export interface CreateUserResult {
  DirectoryId?: string;
  SID?: string;
  SAMAccountName?: string;
}
export const CreateUserResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    SID: S.optional(S.String),
    SAMAccountName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateUserResult",
}) as any as S.Schema<CreateUserResult>;
export interface DescribeGroupResult {
  DirectoryId?: string;
  Realm?: string;
  SID?: string;
  SAMAccountName?: string;
  DistinguishedName?: string | Redacted.Redacted<string>;
  GroupType?: string;
  GroupScope?: string;
  OtherAttributes?: Attributes;
}
export const DescribeGroupResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    SID: S.optional(S.String),
    SAMAccountName: S.optional(S.String),
    DistinguishedName: S.optional(SensitiveString),
    GroupType: S.optional(S.String),
    GroupScope: S.optional(S.String),
    OtherAttributes: S.optional(Attributes),
  }).pipe(ns),
).annotations({
  identifier: "DescribeGroupResult",
}) as any as S.Schema<DescribeGroupResult>;
export interface DescribeUserResult {
  DirectoryId?: string;
  Realm?: string;
  SID?: string;
  SAMAccountName?: string;
  DistinguishedName?: string | Redacted.Redacted<string>;
  UserPrincipalName?: string | Redacted.Redacted<string>;
  EmailAddress?: string | Redacted.Redacted<string>;
  GivenName?: string | Redacted.Redacted<string>;
  Surname?: string | Redacted.Redacted<string>;
  Enabled?: boolean;
  OtherAttributes?: Attributes;
}
export const DescribeUserResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    SID: S.optional(S.String),
    SAMAccountName: S.optional(S.String),
    DistinguishedName: S.optional(SensitiveString),
    UserPrincipalName: S.optional(SensitiveString),
    EmailAddress: S.optional(SensitiveString),
    GivenName: S.optional(SensitiveString),
    Surname: S.optional(SensitiveString),
    Enabled: S.optional(S.Boolean),
    OtherAttributes: S.optional(Attributes),
  }).pipe(ns),
).annotations({
  identifier: "DescribeUserResult",
}) as any as S.Schema<DescribeUserResult>;
export interface GroupSummary {
  SID: string;
  SAMAccountName: string;
  GroupType: string;
  GroupScope: string;
}
export const GroupSummary = S.suspend(() =>
  S.Struct({
    SID: S.String,
    SAMAccountName: S.String,
    GroupType: S.String,
    GroupScope: S.String,
  }),
).annotations({ identifier: "GroupSummary" }) as any as S.Schema<GroupSummary>;
export type GroupSummaryList = GroupSummary[];
export const GroupSummaryList = S.Array(GroupSummary);
export interface ListGroupsForMemberResult {
  DirectoryId?: string;
  Realm?: string;
  MemberRealm?: string;
  Groups?: GroupSummaryList;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListGroupsForMemberResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    MemberRealm: S.optional(S.String),
    Groups: S.optional(GroupSummaryList),
    NextToken: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "ListGroupsForMemberResult",
}) as any as S.Schema<ListGroupsForMemberResult>;
export interface Member {
  SID: string;
  SAMAccountName: string;
  MemberType: string;
}
export const Member = S.suspend(() =>
  S.Struct({ SID: S.String, SAMAccountName: S.String, MemberType: S.String }),
).annotations({ identifier: "Member" }) as any as S.Schema<Member>;
export type MemberList = Member[];
export const MemberList = S.Array(Member);
export interface UserSummary {
  SID: string;
  SAMAccountName: string;
  GivenName?: string | Redacted.Redacted<string>;
  Surname?: string | Redacted.Redacted<string>;
  Enabled: boolean;
}
export const UserSummary = S.suspend(() =>
  S.Struct({
    SID: S.String,
    SAMAccountName: S.String,
    GivenName: S.optional(SensitiveString),
    Surname: S.optional(SensitiveString),
    Enabled: S.Boolean,
  }),
).annotations({ identifier: "UserSummary" }) as any as S.Schema<UserSummary>;
export type UserSummaryList = UserSummary[];
export const UserSummaryList = S.Array(UserSummary);
export interface Group {
  SID?: string;
  SAMAccountName: string;
  DistinguishedName?: string | Redacted.Redacted<string>;
  GroupType?: string;
  GroupScope?: string;
  OtherAttributes?: Attributes;
}
export const Group = S.suspend(() =>
  S.Struct({
    SID: S.optional(S.String),
    SAMAccountName: S.String,
    DistinguishedName: S.optional(SensitiveString),
    GroupType: S.optional(S.String),
    GroupScope: S.optional(S.String),
    OtherAttributes: S.optional(Attributes),
  }),
).annotations({ identifier: "Group" }) as any as S.Schema<Group>;
export type GroupList = Group[];
export const GroupList = S.Array(Group);
export interface User {
  SID?: string;
  SAMAccountName: string;
  DistinguishedName?: string | Redacted.Redacted<string>;
  UserPrincipalName?: string | Redacted.Redacted<string>;
  EmailAddress?: string | Redacted.Redacted<string>;
  GivenName?: string | Redacted.Redacted<string>;
  Surname?: string | Redacted.Redacted<string>;
  Enabled?: boolean;
  OtherAttributes?: Attributes;
}
export const User = S.suspend(() =>
  S.Struct({
    SID: S.optional(S.String),
    SAMAccountName: S.String,
    DistinguishedName: S.optional(SensitiveString),
    UserPrincipalName: S.optional(SensitiveString),
    EmailAddress: S.optional(SensitiveString),
    GivenName: S.optional(SensitiveString),
    Surname: S.optional(SensitiveString),
    Enabled: S.optional(S.Boolean),
    OtherAttributes: S.optional(Attributes),
  }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type UserList = User[];
export const UserList = S.Array(User);
export interface CreateGroupRequest {
  DirectoryId: string;
  SAMAccountName: string;
  GroupType?: string;
  GroupScope?: string;
  OtherAttributes?: Attributes;
  ClientToken?: string;
}
export const CreateGroupRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String.pipe(T.HttpQuery("DirectoryId")),
    SAMAccountName: S.String,
    GroupType: S.optional(S.String),
    GroupScope: S.optional(S.String),
    OtherAttributes: S.optional(Attributes),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/Groups/CreateGroup" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGroupRequest",
}) as any as S.Schema<CreateGroupRequest>;
export interface ListGroupMembersResult {
  DirectoryId?: string;
  Realm?: string;
  MemberRealm?: string;
  Members?: MemberList;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListGroupMembersResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    MemberRealm: S.optional(S.String),
    Members: S.optional(MemberList),
    NextToken: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "ListGroupMembersResult",
}) as any as S.Schema<ListGroupMembersResult>;
export interface ListGroupsResult {
  DirectoryId?: string;
  Realm?: string;
  Groups?: GroupSummaryList;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListGroupsResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    Groups: S.optional(GroupSummaryList),
    NextToken: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "ListGroupsResult",
}) as any as S.Schema<ListGroupsResult>;
export interface ListUsersResult {
  DirectoryId?: string;
  Realm?: string;
  Users?: UserSummaryList;
  NextToken?: string | Redacted.Redacted<string>;
}
export const ListUsersResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    Users: S.optional(UserSummaryList),
    NextToken: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "ListUsersResult",
}) as any as S.Schema<ListUsersResult>;
export interface SearchGroupsResult {
  DirectoryId?: string;
  Realm?: string;
  Groups?: GroupList;
  NextToken?: string | Redacted.Redacted<string>;
}
export const SearchGroupsResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    Groups: S.optional(GroupList),
    NextToken: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "SearchGroupsResult",
}) as any as S.Schema<SearchGroupsResult>;
export interface SearchUsersResult {
  DirectoryId?: string;
  Realm?: string;
  Users?: UserList;
  NextToken?: string | Redacted.Redacted<string>;
}
export const SearchUsersResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    Realm: S.optional(S.String),
    Users: S.optional(UserList),
    NextToken: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "SearchUsersResult",
}) as any as S.Schema<SearchUsersResult>;
export interface CreateGroupResult {
  DirectoryId?: string;
  SAMAccountName?: string;
  SID?: string;
}
export const CreateGroupResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    SAMAccountName: S.optional(S.String),
    SID: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateGroupResult",
}) as any as S.Schema<CreateGroupResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class DirectoryUnavailableException extends S.TaggedError<DirectoryUnavailableException>()(
  "DirectoryUnavailableException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withBadRequestError, C.withRetryableError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

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
export const listGroups: {
  (
    input: ListGroupsRequest,
  ): Effect.Effect<
    ListGroupsResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupsRequest,
  ) => Stream.Stream<
    ListGroupsResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupsRequest,
  ) => Stream.Stream<
    GroupSummary,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listGroupMembers: {
  (
    input: ListGroupMembersRequest,
  ): Effect.Effect<
    ListGroupMembersResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupMembersRequest,
  ) => Stream.Stream<
    ListGroupMembersResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupMembersRequest,
  ) => Stream.Stream<
    Member,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Deletes a group.
 */
export const deleteGroup: (
  input: DeleteGroupRequest,
) => Effect.Effect<
  DeleteGroupResult,
  | AccessDeniedException
  | ConflictException
  | DirectoryUnavailableException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteUser: (
  input: DeleteUserRequest,
) => Effect.Effect<
  DeleteUserResult,
  | AccessDeniedException
  | ConflictException
  | DirectoryUnavailableException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disableUser: (
  input: DisableUserRequest,
) => Effect.Effect<
  DisableUserResult,
  | AccessDeniedException
  | ConflictException
  | DirectoryUnavailableException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeGroupMember: (
  input: RemoveGroupMemberRequest,
) => Effect.Effect<
  RemoveGroupMemberResult,
  | AccessDeniedException
  | ConflictException
  | DirectoryUnavailableException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateGroup: (
  input: UpdateGroupRequest,
) => Effect.Effect<
  UpdateGroupResult,
  | AccessDeniedException
  | ConflictException
  | DirectoryUnavailableException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateUser: (
  input: UpdateUserRequest,
) => Effect.Effect<
  UpdateUserResult,
  | AccessDeniedException
  | ConflictException
  | DirectoryUnavailableException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeUser: (
  input: DescribeUserRequest,
) => Effect.Effect<
  DescribeUserResult,
  | AccessDeniedException
  | DirectoryUnavailableException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listGroupsForMember: {
  (
    input: ListGroupsForMemberRequest,
  ): Effect.Effect<
    ListGroupsForMemberResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupsForMemberRequest,
  ) => Stream.Stream<
    ListGroupsForMemberResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupsForMemberRequest,
  ) => Stream.Stream<
    GroupSummary,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const addGroupMember: (
  input: AddGroupMemberRequest,
) => Effect.Effect<
  AddGroupMemberResult,
  | AccessDeniedException
  | ConflictException
  | DirectoryUnavailableException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listUsers: {
  (
    input: ListUsersRequest,
  ): Effect.Effect<
    ListUsersResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUsersRequest,
  ) => Stream.Stream<
    ListUsersResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUsersRequest,
  ) => Stream.Stream<
    UserSummary,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const searchGroups: {
  (
    input: SearchGroupsRequest,
  ): Effect.Effect<
    SearchGroupsResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchGroupsRequest,
  ) => Stream.Stream<
    SearchGroupsResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchGroupsRequest,
  ) => Stream.Stream<
    Group,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
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
export const searchUsers: {
  (
    input: SearchUsersRequest,
  ): Effect.Effect<
    SearchUsersResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchUsersRequest,
  ) => Stream.Stream<
    SearchUsersResult,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchUsersRequest,
  ) => Stream.Stream<
    User,
    | AccessDeniedException
    | DirectoryUnavailableException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Creates a new user.
 */
export const createUser: (
  input: CreateUserRequest,
) => Effect.Effect<
  CreateUserResult,
  | AccessDeniedException
  | ConflictException
  | DirectoryUnavailableException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createGroup: (
  input: CreateGroupRequest,
) => Effect.Effect<
  CreateGroupResult,
  | AccessDeniedException
  | ConflictException
  | DirectoryUnavailableException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeGroup: (
  input: DescribeGroupRequest,
) => Effect.Effect<
  DescribeGroupResult,
  | AccessDeniedException
  | DirectoryUnavailableException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

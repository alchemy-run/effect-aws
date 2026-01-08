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
  sdkId: "Chime",
  serviceShapeName: "UCBuzzConsoleService",
});
const auth = T.AwsAuthSigv4({ name: "chime" });
const ver = T.ServiceVersion("2018-05-01");
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://chime.us-east-1.amazonaws.com",
            {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "chime",
                  signingRegion: "us-east-1",
                },
              ],
            },
            {},
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://chime-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://chime-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://chime.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://chime.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type E164PhoneNumber = string | Redacted.Redacted<string>;
export type NonEmptyString = string;
export type AccountName = string;
export type SensitiveString = string | Redacted.Redacted<string>;
export type GuidString = string;
export type JoinTokenString = string | Redacted.Redacted<string>;
export type ClientRequestToken = string | Redacted.Redacted<string>;
export type EmailAddress = string | Redacted.Redacted<string>;
export type CallingName = string | Redacted.Redacted<string>;
export type ProfileServiceMaxResults = number;
export type ResultMax = number;
export type Alpha2CountryCode = string;
export type TollFreePrefix = string;
export type PhoneNumberMaxResults = number;
export type RetentionDays = number;

//# Schemas
export interface GetGlobalSettingsRequest {}
export const GetGlobalSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetGlobalSettingsRequest",
}) as any as S.Schema<GetGlobalSettingsRequest>;
export interface GetPhoneNumberSettingsRequest {}
export const GetPhoneNumberSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPhoneNumberSettingsRequest",
}) as any as S.Schema<GetPhoneNumberSettingsRequest>;
export type NonEmptyStringList = string[];
export const NonEmptyStringList = S.Array(S.String);
export type UserIdList = string[];
export const UserIdList = S.Array(S.String);
export type E164PhoneNumberList = string | Redacted.Redacted<string>[];
export const E164PhoneNumberList = S.Array(SensitiveString);
export type UserEmailList = string | Redacted.Redacted<string>[];
export const UserEmailList = S.Array(SensitiveString);
export interface AssociatePhoneNumberWithUserRequest {
  AccountId: string;
  UserId: string;
  E164PhoneNumber: string | Redacted.Redacted<string>;
}
export const AssociatePhoneNumberWithUserRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    E164PhoneNumber: SensitiveString,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/users/{UserId}?operation=associate-phone-number",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociatePhoneNumberWithUserRequest",
}) as any as S.Schema<AssociatePhoneNumberWithUserRequest>;
export interface AssociatePhoneNumberWithUserResponse {}
export const AssociatePhoneNumberWithUserResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociatePhoneNumberWithUserResponse",
}) as any as S.Schema<AssociatePhoneNumberWithUserResponse>;
export interface BatchDeletePhoneNumberRequest {
  PhoneNumberIds: NonEmptyStringList;
}
export const BatchDeletePhoneNumberRequest = S.suspend(() =>
  S.Struct({ PhoneNumberIds: NonEmptyStringList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/phone-numbers?operation=batch-delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeletePhoneNumberRequest",
}) as any as S.Schema<BatchDeletePhoneNumberRequest>;
export interface BatchSuspendUserRequest {
  AccountId: string;
  UserIdList: UserIdList;
}
export const BatchSuspendUserRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserIdList: UserIdList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/users?operation=suspend",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchSuspendUserRequest",
}) as any as S.Schema<BatchSuspendUserRequest>;
export interface BatchUnsuspendUserRequest {
  AccountId: string;
  UserIdList: UserIdList;
}
export const BatchUnsuspendUserRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserIdList: UserIdList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/users?operation=unsuspend",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUnsuspendUserRequest",
}) as any as S.Schema<BatchUnsuspendUserRequest>;
export interface CreateAccountRequest {
  Name: string;
}
export const CreateAccountRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAccountRequest",
}) as any as S.Schema<CreateAccountRequest>;
export interface CreateBotRequest {
  AccountId: string;
  DisplayName: string | Redacted.Redacted<string>;
  Domain?: string;
}
export const CreateBotRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    DisplayName: SensitiveString,
    Domain: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/accounts/{AccountId}/bots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBotRequest",
}) as any as S.Schema<CreateBotRequest>;
export interface CreateMeetingDialOutRequest {
  MeetingId: string;
  FromPhoneNumber: string | Redacted.Redacted<string>;
  ToPhoneNumber: string | Redacted.Redacted<string>;
  JoinToken: string | Redacted.Redacted<string>;
}
export const CreateMeetingDialOutRequest = S.suspend(() =>
  S.Struct({
    MeetingId: S.String.pipe(T.HttpLabel("MeetingId")),
    FromPhoneNumber: SensitiveString,
    ToPhoneNumber: SensitiveString,
    JoinToken: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/meetings/{MeetingId}/dial-outs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMeetingDialOutRequest",
}) as any as S.Schema<CreateMeetingDialOutRequest>;
export interface CreatePhoneNumberOrderRequest {
  ProductType: string;
  E164PhoneNumbers: E164PhoneNumberList;
}
export const CreatePhoneNumberOrderRequest = S.suspend(() =>
  S.Struct({
    ProductType: S.String,
    E164PhoneNumbers: E164PhoneNumberList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/phone-number-orders" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePhoneNumberOrderRequest",
}) as any as S.Schema<CreatePhoneNumberOrderRequest>;
export interface CreateRoomRequest {
  AccountId: string;
  Name: string | Redacted.Redacted<string>;
  ClientRequestToken?: string | Redacted.Redacted<string>;
}
export const CreateRoomRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    Name: SensitiveString,
    ClientRequestToken: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/accounts/{AccountId}/rooms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRoomRequest",
}) as any as S.Schema<CreateRoomRequest>;
export interface CreateRoomMembershipRequest {
  AccountId: string;
  RoomId: string;
  MemberId: string;
  Role?: string;
}
export const CreateRoomMembershipRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    RoomId: S.String.pipe(T.HttpLabel("RoomId")),
    MemberId: S.String,
    Role: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/rooms/{RoomId}/memberships",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRoomMembershipRequest",
}) as any as S.Schema<CreateRoomMembershipRequest>;
export interface CreateUserRequest {
  AccountId: string;
  Username?: string;
  Email?: string | Redacted.Redacted<string>;
  UserType?: string;
}
export const CreateUserRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    Username: S.optional(S.String),
    Email: S.optional(SensitiveString),
    UserType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/users?operation=create",
      }),
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
export interface DeleteAccountRequest {
  AccountId: string;
}
export const DeleteAccountRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String.pipe(T.HttpLabel("AccountId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/accounts/{AccountId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAccountRequest",
}) as any as S.Schema<DeleteAccountRequest>;
export interface DeleteAccountResponse {}
export const DeleteAccountResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAccountResponse",
}) as any as S.Schema<DeleteAccountResponse>;
export interface DeleteEventsConfigurationRequest {
  AccountId: string;
  BotId: string;
}
export const DeleteEventsConfigurationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    BotId: S.String.pipe(T.HttpLabel("BotId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/accounts/{AccountId}/bots/{BotId}/events-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventsConfigurationRequest",
}) as any as S.Schema<DeleteEventsConfigurationRequest>;
export interface DeleteEventsConfigurationResponse {}
export const DeleteEventsConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEventsConfigurationResponse",
}) as any as S.Schema<DeleteEventsConfigurationResponse>;
export interface DeletePhoneNumberRequest {
  PhoneNumberId: string;
}
export const DeletePhoneNumberRequest = S.suspend(() =>
  S.Struct({ PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/phone-numbers/{PhoneNumberId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePhoneNumberRequest",
}) as any as S.Schema<DeletePhoneNumberRequest>;
export interface DeletePhoneNumberResponse {}
export const DeletePhoneNumberResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePhoneNumberResponse",
}) as any as S.Schema<DeletePhoneNumberResponse>;
export interface DeleteRoomRequest {
  AccountId: string;
  RoomId: string;
}
export const DeleteRoomRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    RoomId: S.String.pipe(T.HttpLabel("RoomId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/accounts/{AccountId}/rooms/{RoomId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRoomRequest",
}) as any as S.Schema<DeleteRoomRequest>;
export interface DeleteRoomResponse {}
export const DeleteRoomResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteRoomResponse",
}) as any as S.Schema<DeleteRoomResponse>;
export interface DeleteRoomMembershipRequest {
  AccountId: string;
  RoomId: string;
  MemberId: string;
}
export const DeleteRoomMembershipRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    RoomId: S.String.pipe(T.HttpLabel("RoomId")),
    MemberId: S.String.pipe(T.HttpLabel("MemberId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/accounts/{AccountId}/rooms/{RoomId}/memberships/{MemberId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRoomMembershipRequest",
}) as any as S.Schema<DeleteRoomMembershipRequest>;
export interface DeleteRoomMembershipResponse {}
export const DeleteRoomMembershipResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRoomMembershipResponse",
}) as any as S.Schema<DeleteRoomMembershipResponse>;
export interface DisassociatePhoneNumberFromUserRequest {
  AccountId: string;
  UserId: string;
}
export const DisassociatePhoneNumberFromUserRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/users/{UserId}?operation=disassociate-phone-number",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociatePhoneNumberFromUserRequest",
}) as any as S.Schema<DisassociatePhoneNumberFromUserRequest>;
export interface DisassociatePhoneNumberFromUserResponse {}
export const DisassociatePhoneNumberFromUserResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociatePhoneNumberFromUserResponse",
}) as any as S.Schema<DisassociatePhoneNumberFromUserResponse>;
export interface DisassociateSigninDelegateGroupsFromAccountRequest {
  AccountId: string;
  GroupNames: NonEmptyStringList;
}
export const DisassociateSigninDelegateGroupsFromAccountRequest = S.suspend(
  () =>
    S.Struct({
      AccountId: S.String.pipe(T.HttpLabel("AccountId")),
      GroupNames: NonEmptyStringList,
    }).pipe(
      T.all(
        T.Http({
          method: "POST",
          uri: "/accounts/{AccountId}?operation=disassociate-signin-delegate-groups",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DisassociateSigninDelegateGroupsFromAccountRequest",
}) as any as S.Schema<DisassociateSigninDelegateGroupsFromAccountRequest>;
export interface DisassociateSigninDelegateGroupsFromAccountResponse {}
export const DisassociateSigninDelegateGroupsFromAccountResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "DisassociateSigninDelegateGroupsFromAccountResponse",
}) as any as S.Schema<DisassociateSigninDelegateGroupsFromAccountResponse>;
export interface GetAccountRequest {
  AccountId: string;
}
export const GetAccountRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String.pipe(T.HttpLabel("AccountId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accounts/{AccountId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountRequest",
}) as any as S.Schema<GetAccountRequest>;
export interface GetAccountSettingsRequest {
  AccountId: string;
}
export const GetAccountSettingsRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String.pipe(T.HttpLabel("AccountId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accounts/{AccountId}/settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountSettingsRequest",
}) as any as S.Schema<GetAccountSettingsRequest>;
export interface GetBotRequest {
  AccountId: string;
  BotId: string;
}
export const GetBotRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    BotId: S.String.pipe(T.HttpLabel("BotId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accounts/{AccountId}/bots/{BotId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBotRequest",
}) as any as S.Schema<GetBotRequest>;
export interface GetEventsConfigurationRequest {
  AccountId: string;
  BotId: string;
}
export const GetEventsConfigurationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    BotId: S.String.pipe(T.HttpLabel("BotId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/accounts/{AccountId}/bots/{BotId}/events-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEventsConfigurationRequest",
}) as any as S.Schema<GetEventsConfigurationRequest>;
export interface GetPhoneNumberRequest {
  PhoneNumberId: string;
}
export const GetPhoneNumberRequest = S.suspend(() =>
  S.Struct({ PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/phone-numbers/{PhoneNumberId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPhoneNumberRequest",
}) as any as S.Schema<GetPhoneNumberRequest>;
export interface GetPhoneNumberOrderRequest {
  PhoneNumberOrderId: string;
}
export const GetPhoneNumberOrderRequest = S.suspend(() =>
  S.Struct({
    PhoneNumberOrderId: S.String.pipe(T.HttpLabel("PhoneNumberOrderId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/phone-number-orders/{PhoneNumberOrderId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPhoneNumberOrderRequest",
}) as any as S.Schema<GetPhoneNumberOrderRequest>;
export interface GetPhoneNumberSettingsResponse {
  CallingName?: string | Redacted.Redacted<string>;
  CallingNameUpdatedTimestamp?: Date;
}
export const GetPhoneNumberSettingsResponse = S.suspend(() =>
  S.Struct({
    CallingName: S.optional(SensitiveString),
    CallingNameUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "GetPhoneNumberSettingsResponse",
}) as any as S.Schema<GetPhoneNumberSettingsResponse>;
export interface GetRetentionSettingsRequest {
  AccountId: string;
}
export const GetRetentionSettingsRequest = S.suspend(() =>
  S.Struct({ AccountId: S.String.pipe(T.HttpLabel("AccountId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/accounts/{AccountId}/retention-settings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRetentionSettingsRequest",
}) as any as S.Schema<GetRetentionSettingsRequest>;
export interface GetRoomRequest {
  AccountId: string;
  RoomId: string;
}
export const GetRoomRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    RoomId: S.String.pipe(T.HttpLabel("RoomId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accounts/{AccountId}/rooms/{RoomId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRoomRequest",
}) as any as S.Schema<GetRoomRequest>;
export interface GetUserRequest {
  AccountId: string;
  UserId: string;
}
export const GetUserRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accounts/{AccountId}/users/{UserId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUserRequest",
}) as any as S.Schema<GetUserRequest>;
export interface GetUserSettingsRequest {
  AccountId: string;
  UserId: string;
}
export const GetUserSettingsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/accounts/{AccountId}/users/{UserId}/settings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUserSettingsRequest",
}) as any as S.Schema<GetUserSettingsRequest>;
export interface InviteUsersRequest {
  AccountId: string;
  UserEmailList: UserEmailList;
  UserType?: string;
}
export const InviteUsersRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserEmailList: UserEmailList,
    UserType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/users?operation=add",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InviteUsersRequest",
}) as any as S.Schema<InviteUsersRequest>;
export interface ListAccountsRequest {
  Name?: string;
  UserEmail?: string | Redacted.Redacted<string>;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAccountsRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.HttpQuery("name")),
    UserEmail: S.optional(SensitiveString).pipe(T.HttpQuery("user-email")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccountsRequest",
}) as any as S.Schema<ListAccountsRequest>;
export interface ListBotsRequest {
  AccountId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListBotsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accounts/{AccountId}/bots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBotsRequest",
}) as any as S.Schema<ListBotsRequest>;
export interface ListPhoneNumberOrdersRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListPhoneNumberOrdersRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/phone-number-orders" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPhoneNumberOrdersRequest",
}) as any as S.Schema<ListPhoneNumberOrdersRequest>;
export interface ListPhoneNumbersRequest {
  Status?: string;
  ProductType?: string;
  FilterName?: string;
  FilterValue?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListPhoneNumbersRequest = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    ProductType: S.optional(S.String).pipe(T.HttpQuery("product-type")),
    FilterName: S.optional(S.String).pipe(T.HttpQuery("filter-name")),
    FilterValue: S.optional(S.String).pipe(T.HttpQuery("filter-value")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/phone-numbers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPhoneNumbersRequest",
}) as any as S.Schema<ListPhoneNumbersRequest>;
export interface ListRoomMembershipsRequest {
  AccountId: string;
  RoomId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListRoomMembershipsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    RoomId: S.String.pipe(T.HttpLabel("RoomId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/accounts/{AccountId}/rooms/{RoomId}/memberships",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRoomMembershipsRequest",
}) as any as S.Schema<ListRoomMembershipsRequest>;
export interface ListRoomsRequest {
  AccountId: string;
  MemberId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListRoomsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    MemberId: S.optional(S.String).pipe(T.HttpQuery("member-id")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accounts/{AccountId}/rooms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRoomsRequest",
}) as any as S.Schema<ListRoomsRequest>;
export interface ListSupportedPhoneNumberCountriesRequest {
  ProductType: string;
}
export const ListSupportedPhoneNumberCountriesRequest = S.suspend(() =>
  S.Struct({ ProductType: S.String.pipe(T.HttpQuery("product-type")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/phone-number-countries" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSupportedPhoneNumberCountriesRequest",
}) as any as S.Schema<ListSupportedPhoneNumberCountriesRequest>;
export interface ListUsersRequest {
  AccountId: string;
  UserEmail?: string | Redacted.Redacted<string>;
  UserType?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListUsersRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserEmail: S.optional(SensitiveString).pipe(T.HttpQuery("user-email")),
    UserType: S.optional(S.String).pipe(T.HttpQuery("user-type")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accounts/{AccountId}/users" }),
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
export interface LogoutUserRequest {
  AccountId: string;
  UserId: string;
}
export const LogoutUserRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/users/{UserId}?operation=logout",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "LogoutUserRequest",
}) as any as S.Schema<LogoutUserRequest>;
export interface LogoutUserResponse {}
export const LogoutUserResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "LogoutUserResponse",
}) as any as S.Schema<LogoutUserResponse>;
export interface PutEventsConfigurationRequest {
  AccountId: string;
  BotId: string;
  OutboundEventsHTTPSEndpoint?: string | Redacted.Redacted<string>;
  LambdaFunctionArn?: string | Redacted.Redacted<string>;
}
export const PutEventsConfigurationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    BotId: S.String.pipe(T.HttpLabel("BotId")),
    OutboundEventsHTTPSEndpoint: S.optional(SensitiveString),
    LambdaFunctionArn: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/accounts/{AccountId}/bots/{BotId}/events-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEventsConfigurationRequest",
}) as any as S.Schema<PutEventsConfigurationRequest>;
export interface RedactConversationMessageRequest {
  AccountId: string;
  ConversationId: string;
  MessageId: string;
}
export const RedactConversationMessageRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    ConversationId: S.String.pipe(T.HttpLabel("ConversationId")),
    MessageId: S.String.pipe(T.HttpLabel("MessageId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/conversations/{ConversationId}/messages/{MessageId}?operation=redact",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RedactConversationMessageRequest",
}) as any as S.Schema<RedactConversationMessageRequest>;
export interface RedactConversationMessageResponse {}
export const RedactConversationMessageResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RedactConversationMessageResponse",
}) as any as S.Schema<RedactConversationMessageResponse>;
export interface RedactRoomMessageRequest {
  AccountId: string;
  RoomId: string;
  MessageId: string;
}
export const RedactRoomMessageRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    RoomId: S.String.pipe(T.HttpLabel("RoomId")),
    MessageId: S.String.pipe(T.HttpLabel("MessageId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/rooms/{RoomId}/messages/{MessageId}?operation=redact",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RedactRoomMessageRequest",
}) as any as S.Schema<RedactRoomMessageRequest>;
export interface RedactRoomMessageResponse {}
export const RedactRoomMessageResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RedactRoomMessageResponse",
}) as any as S.Schema<RedactRoomMessageResponse>;
export interface RegenerateSecurityTokenRequest {
  AccountId: string;
  BotId: string;
}
export const RegenerateSecurityTokenRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    BotId: S.String.pipe(T.HttpLabel("BotId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/bots/{BotId}?operation=regenerate-security-token",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegenerateSecurityTokenRequest",
}) as any as S.Schema<RegenerateSecurityTokenRequest>;
export interface ResetPersonalPINRequest {
  AccountId: string;
  UserId: string;
}
export const ResetPersonalPINRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/users/{UserId}?operation=reset-personal-pin",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetPersonalPINRequest",
}) as any as S.Schema<ResetPersonalPINRequest>;
export interface RestorePhoneNumberRequest {
  PhoneNumberId: string;
}
export const RestorePhoneNumberRequest = S.suspend(() =>
  S.Struct({ PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/phone-numbers/{PhoneNumberId}?operation=restore",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RestorePhoneNumberRequest",
}) as any as S.Schema<RestorePhoneNumberRequest>;
export interface SearchAvailablePhoneNumbersRequest {
  AreaCode?: string;
  City?: string;
  Country?: string;
  State?: string;
  TollFreePrefix?: string;
  PhoneNumberType?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const SearchAvailablePhoneNumbersRequest = S.suspend(() =>
  S.Struct({
    AreaCode: S.optional(S.String).pipe(T.HttpQuery("area-code")),
    City: S.optional(S.String).pipe(T.HttpQuery("city")),
    Country: S.optional(S.String).pipe(T.HttpQuery("country")),
    State: S.optional(S.String).pipe(T.HttpQuery("state")),
    TollFreePrefix: S.optional(S.String).pipe(T.HttpQuery("toll-free-prefix")),
    PhoneNumberType: S.optional(S.String).pipe(
      T.HttpQuery("phone-number-type"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/search?type=phone-numbers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchAvailablePhoneNumbersRequest",
}) as any as S.Schema<SearchAvailablePhoneNumbersRequest>;
export interface UpdateAccountRequest {
  AccountId: string;
  Name?: string;
  DefaultLicense?: string;
}
export const UpdateAccountRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    Name: S.optional(S.String),
    DefaultLicense: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/accounts/{AccountId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccountRequest",
}) as any as S.Schema<UpdateAccountRequest>;
export interface UpdateBotRequest {
  AccountId: string;
  BotId: string;
  Disabled?: boolean;
}
export const UpdateBotRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    BotId: S.String.pipe(T.HttpLabel("BotId")),
    Disabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/accounts/{AccountId}/bots/{BotId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBotRequest",
}) as any as S.Schema<UpdateBotRequest>;
export interface BusinessCallingSettings {
  CdrBucket?: string;
}
export const BusinessCallingSettings = S.suspend(() =>
  S.Struct({ CdrBucket: S.optional(S.String) }),
).annotations({
  identifier: "BusinessCallingSettings",
}) as any as S.Schema<BusinessCallingSettings>;
export interface VoiceConnectorSettings {
  CdrBucket?: string;
}
export const VoiceConnectorSettings = S.suspend(() =>
  S.Struct({ CdrBucket: S.optional(S.String) }),
).annotations({
  identifier: "VoiceConnectorSettings",
}) as any as S.Schema<VoiceConnectorSettings>;
export interface UpdateGlobalSettingsRequest {
  BusinessCalling?: BusinessCallingSettings;
  VoiceConnector?: VoiceConnectorSettings;
}
export const UpdateGlobalSettingsRequest = S.suspend(() =>
  S.Struct({
    BusinessCalling: S.optional(BusinessCallingSettings),
    VoiceConnector: S.optional(VoiceConnectorSettings),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGlobalSettingsRequest",
}) as any as S.Schema<UpdateGlobalSettingsRequest>;
export interface UpdateGlobalSettingsResponse {}
export const UpdateGlobalSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateGlobalSettingsResponse",
}) as any as S.Schema<UpdateGlobalSettingsResponse>;
export interface UpdatePhoneNumberRequest {
  PhoneNumberId: string;
  ProductType?: string;
  CallingName?: string | Redacted.Redacted<string>;
}
export const UpdatePhoneNumberRequest = S.suspend(() =>
  S.Struct({
    PhoneNumberId: S.String.pipe(T.HttpLabel("PhoneNumberId")),
    ProductType: S.optional(S.String),
    CallingName: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/phone-numbers/{PhoneNumberId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePhoneNumberRequest",
}) as any as S.Schema<UpdatePhoneNumberRequest>;
export interface UpdatePhoneNumberSettingsRequest {
  CallingName: string | Redacted.Redacted<string>;
}
export const UpdatePhoneNumberSettingsRequest = S.suspend(() =>
  S.Struct({ CallingName: SensitiveString }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/settings/phone-number" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePhoneNumberSettingsRequest",
}) as any as S.Schema<UpdatePhoneNumberSettingsRequest>;
export interface UpdatePhoneNumberSettingsResponse {}
export const UpdatePhoneNumberSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdatePhoneNumberSettingsResponse",
}) as any as S.Schema<UpdatePhoneNumberSettingsResponse>;
export interface UpdateRoomRequest {
  AccountId: string;
  RoomId: string;
  Name?: string | Redacted.Redacted<string>;
}
export const UpdateRoomRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    RoomId: S.String.pipe(T.HttpLabel("RoomId")),
    Name: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/accounts/{AccountId}/rooms/{RoomId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRoomRequest",
}) as any as S.Schema<UpdateRoomRequest>;
export interface UpdateRoomMembershipRequest {
  AccountId: string;
  RoomId: string;
  MemberId: string;
  Role?: string;
}
export const UpdateRoomMembershipRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    RoomId: S.String.pipe(T.HttpLabel("RoomId")),
    MemberId: S.String.pipe(T.HttpLabel("MemberId")),
    Role: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/rooms/{RoomId}/memberships/{MemberId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRoomMembershipRequest",
}) as any as S.Schema<UpdateRoomMembershipRequest>;
export interface SigninDelegateGroup {
  GroupName?: string;
}
export const SigninDelegateGroup = S.suspend(() =>
  S.Struct({ GroupName: S.optional(S.String) }),
).annotations({
  identifier: "SigninDelegateGroup",
}) as any as S.Schema<SigninDelegateGroup>;
export type SigninDelegateGroupList = SigninDelegateGroup[];
export const SigninDelegateGroupList = S.Array(SigninDelegateGroup);
export interface MembershipItem {
  MemberId?: string;
  Role?: string;
}
export const MembershipItem = S.suspend(() =>
  S.Struct({ MemberId: S.optional(S.String), Role: S.optional(S.String) }),
).annotations({
  identifier: "MembershipItem",
}) as any as S.Schema<MembershipItem>;
export type MembershipItemList = MembershipItem[];
export const MembershipItemList = S.Array(MembershipItem);
export interface UpdatePhoneNumberRequestItem {
  PhoneNumberId: string;
  ProductType?: string;
  CallingName?: string | Redacted.Redacted<string>;
}
export const UpdatePhoneNumberRequestItem = S.suspend(() =>
  S.Struct({
    PhoneNumberId: S.String,
    ProductType: S.optional(S.String),
    CallingName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "UpdatePhoneNumberRequestItem",
}) as any as S.Schema<UpdatePhoneNumberRequestItem>;
export type UpdatePhoneNumberRequestItemList = UpdatePhoneNumberRequestItem[];
export const UpdatePhoneNumberRequestItemList = S.Array(
  UpdatePhoneNumberRequestItem,
);
export interface AlexaForBusinessMetadata {
  IsAlexaForBusinessEnabled?: boolean;
  AlexaForBusinessRoomArn?: string | Redacted.Redacted<string>;
}
export const AlexaForBusinessMetadata = S.suspend(() =>
  S.Struct({
    IsAlexaForBusinessEnabled: S.optional(S.Boolean),
    AlexaForBusinessRoomArn: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AlexaForBusinessMetadata",
}) as any as S.Schema<AlexaForBusinessMetadata>;
export interface UpdateUserRequestItem {
  UserId: string;
  LicenseType?: string;
  UserType?: string;
  AlexaForBusinessMetadata?: AlexaForBusinessMetadata;
}
export const UpdateUserRequestItem = S.suspend(() =>
  S.Struct({
    UserId: S.String,
    LicenseType: S.optional(S.String),
    UserType: S.optional(S.String),
    AlexaForBusinessMetadata: S.optional(AlexaForBusinessMetadata),
  }),
).annotations({
  identifier: "UpdateUserRequestItem",
}) as any as S.Schema<UpdateUserRequestItem>;
export type UpdateUserRequestItemList = UpdateUserRequestItem[];
export const UpdateUserRequestItemList = S.Array(UpdateUserRequestItem);
export type LicenseList = string[];
export const LicenseList = S.Array(S.String);
export interface Account {
  AwsAccountId: string;
  AccountId: string;
  Name: string;
  AccountType?: string;
  CreatedTimestamp?: Date;
  DefaultLicense?: string;
  SupportedLicenses?: LicenseList;
  AccountStatus?: string;
  SigninDelegateGroups?: SigninDelegateGroupList;
}
export const Account = S.suspend(() =>
  S.Struct({
    AwsAccountId: S.String,
    AccountId: S.String,
    Name: S.String,
    AccountType: S.optional(S.String),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DefaultLicense: S.optional(S.String),
    SupportedLicenses: S.optional(LicenseList),
    AccountStatus: S.optional(S.String),
    SigninDelegateGroups: S.optional(SigninDelegateGroupList),
  }),
).annotations({ identifier: "Account" }) as any as S.Schema<Account>;
export type AccountList = Account[];
export const AccountList = S.Array(Account);
export interface Bot {
  BotId?: string;
  UserId?: string;
  DisplayName?: string | Redacted.Redacted<string>;
  BotType?: string;
  Disabled?: boolean;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  BotEmail?: string | Redacted.Redacted<string>;
  SecurityToken?: string | Redacted.Redacted<string>;
}
export const Bot = S.suspend(() =>
  S.Struct({
    BotId: S.optional(S.String),
    UserId: S.optional(S.String),
    DisplayName: S.optional(SensitiveString),
    BotType: S.optional(S.String),
    Disabled: S.optional(S.Boolean),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    BotEmail: S.optional(SensitiveString),
    SecurityToken: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Bot" }) as any as S.Schema<Bot>;
export type BotList = Bot[];
export const BotList = S.Array(Bot);
export interface OrderedPhoneNumber {
  E164PhoneNumber?: string | Redacted.Redacted<string>;
  Status?: string;
}
export const OrderedPhoneNumber = S.suspend(() =>
  S.Struct({
    E164PhoneNumber: S.optional(SensitiveString),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "OrderedPhoneNumber",
}) as any as S.Schema<OrderedPhoneNumber>;
export type OrderedPhoneNumberList = OrderedPhoneNumber[];
export const OrderedPhoneNumberList = S.Array(OrderedPhoneNumber);
export interface PhoneNumberOrder {
  PhoneNumberOrderId?: string;
  ProductType?: string;
  Status?: string;
  OrderedPhoneNumbers?: OrderedPhoneNumberList;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
}
export const PhoneNumberOrder = S.suspend(() =>
  S.Struct({
    PhoneNumberOrderId: S.optional(S.String),
    ProductType: S.optional(S.String),
    Status: S.optional(S.String),
    OrderedPhoneNumbers: S.optional(OrderedPhoneNumberList),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "PhoneNumberOrder",
}) as any as S.Schema<PhoneNumberOrder>;
export type PhoneNumberOrderList = PhoneNumberOrder[];
export const PhoneNumberOrderList = S.Array(PhoneNumberOrder);
export interface PhoneNumberCapabilities {
  InboundCall?: boolean;
  OutboundCall?: boolean;
  InboundSMS?: boolean;
  OutboundSMS?: boolean;
  InboundMMS?: boolean;
  OutboundMMS?: boolean;
}
export const PhoneNumberCapabilities = S.suspend(() =>
  S.Struct({
    InboundCall: S.optional(S.Boolean),
    OutboundCall: S.optional(S.Boolean),
    InboundSMS: S.optional(S.Boolean),
    OutboundSMS: S.optional(S.Boolean),
    InboundMMS: S.optional(S.Boolean),
    OutboundMMS: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PhoneNumberCapabilities",
}) as any as S.Schema<PhoneNumberCapabilities>;
export interface PhoneNumberAssociation {
  Value?: string;
  Name?: string;
  AssociatedTimestamp?: Date;
}
export const PhoneNumberAssociation = S.suspend(() =>
  S.Struct({
    Value: S.optional(S.String),
    Name: S.optional(S.String),
    AssociatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "PhoneNumberAssociation",
}) as any as S.Schema<PhoneNumberAssociation>;
export type PhoneNumberAssociationList = PhoneNumberAssociation[];
export const PhoneNumberAssociationList = S.Array(PhoneNumberAssociation);
export interface PhoneNumber {
  PhoneNumberId?: string;
  E164PhoneNumber?: string | Redacted.Redacted<string>;
  Country?: string;
  Type?: string;
  ProductType?: string;
  Status?: string;
  Capabilities?: PhoneNumberCapabilities;
  Associations?: PhoneNumberAssociationList;
  CallingName?: string | Redacted.Redacted<string>;
  CallingNameStatus?: string;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
  DeletionTimestamp?: Date;
}
export const PhoneNumber = S.suspend(() =>
  S.Struct({
    PhoneNumberId: S.optional(S.String),
    E164PhoneNumber: S.optional(SensitiveString),
    Country: S.optional(S.String),
    Type: S.optional(S.String),
    ProductType: S.optional(S.String),
    Status: S.optional(S.String),
    Capabilities: S.optional(PhoneNumberCapabilities),
    Associations: S.optional(PhoneNumberAssociationList),
    CallingName: S.optional(SensitiveString),
    CallingNameStatus: S.optional(S.String),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DeletionTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "PhoneNumber" }) as any as S.Schema<PhoneNumber>;
export type PhoneNumberList = PhoneNumber[];
export const PhoneNumberList = S.Array(PhoneNumber);
export interface Member {
  MemberId?: string;
  MemberType?: string;
  Email?: string | Redacted.Redacted<string>;
  FullName?: string | Redacted.Redacted<string>;
  AccountId?: string;
}
export const Member = S.suspend(() =>
  S.Struct({
    MemberId: S.optional(S.String),
    MemberType: S.optional(S.String),
    Email: S.optional(SensitiveString),
    FullName: S.optional(SensitiveString),
    AccountId: S.optional(S.String),
  }),
).annotations({ identifier: "Member" }) as any as S.Schema<Member>;
export interface RoomMembership {
  RoomId?: string;
  Member?: Member;
  Role?: string;
  InvitedBy?: string;
  UpdatedTimestamp?: Date;
}
export const RoomMembership = S.suspend(() =>
  S.Struct({
    RoomId: S.optional(S.String),
    Member: S.optional(Member),
    Role: S.optional(S.String),
    InvitedBy: S.optional(S.String),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "RoomMembership",
}) as any as S.Schema<RoomMembership>;
export type RoomMembershipList = RoomMembership[];
export const RoomMembershipList = S.Array(RoomMembership);
export interface Room {
  RoomId?: string;
  Name?: string | Redacted.Redacted<string>;
  AccountId?: string;
  CreatedBy?: string;
  CreatedTimestamp?: Date;
  UpdatedTimestamp?: Date;
}
export const Room = S.suspend(() =>
  S.Struct({
    RoomId: S.optional(S.String),
    Name: S.optional(SensitiveString),
    AccountId: S.optional(S.String),
    CreatedBy: S.optional(S.String),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "Room" }) as any as S.Schema<Room>;
export type RoomList = Room[];
export const RoomList = S.Array(Room);
export interface User {
  UserId: string;
  AccountId?: string;
  PrimaryEmail?: string | Redacted.Redacted<string>;
  PrimaryProvisionedNumber?: string | Redacted.Redacted<string>;
  DisplayName?: string | Redacted.Redacted<string>;
  LicenseType?: string;
  UserType?: string;
  UserRegistrationStatus?: string;
  UserInvitationStatus?: string;
  RegisteredOn?: Date;
  InvitedOn?: Date;
  AlexaForBusinessMetadata?: AlexaForBusinessMetadata;
  PersonalPIN?: string;
}
export const User = S.suspend(() =>
  S.Struct({
    UserId: S.String,
    AccountId: S.optional(S.String),
    PrimaryEmail: S.optional(SensitiveString),
    PrimaryProvisionedNumber: S.optional(SensitiveString),
    DisplayName: S.optional(SensitiveString),
    LicenseType: S.optional(S.String),
    UserType: S.optional(S.String),
    UserRegistrationStatus: S.optional(S.String),
    UserInvitationStatus: S.optional(S.String),
    RegisteredOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    InvitedOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    AlexaForBusinessMetadata: S.optional(AlexaForBusinessMetadata),
    PersonalPIN: S.optional(S.String),
  }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type UserList = User[];
export const UserList = S.Array(User);
export interface AccountSettings {
  DisableRemoteControl?: boolean;
  EnableDialOut?: boolean;
}
export const AccountSettings = S.suspend(() =>
  S.Struct({
    DisableRemoteControl: S.optional(S.Boolean),
    EnableDialOut: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AccountSettings",
}) as any as S.Schema<AccountSettings>;
export interface AssociateSigninDelegateGroupsWithAccountRequest {
  AccountId: string;
  SigninDelegateGroups: SigninDelegateGroupList;
}
export const AssociateSigninDelegateGroupsWithAccountRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    SigninDelegateGroups: SigninDelegateGroupList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}?operation=associate-signin-delegate-groups",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateSigninDelegateGroupsWithAccountRequest",
}) as any as S.Schema<AssociateSigninDelegateGroupsWithAccountRequest>;
export interface AssociateSigninDelegateGroupsWithAccountResponse {}
export const AssociateSigninDelegateGroupsWithAccountResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateSigninDelegateGroupsWithAccountResponse",
}) as any as S.Schema<AssociateSigninDelegateGroupsWithAccountResponse>;
export interface BatchCreateRoomMembershipRequest {
  AccountId: string;
  RoomId: string;
  MembershipItemList: MembershipItemList;
}
export const BatchCreateRoomMembershipRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    RoomId: S.String.pipe(T.HttpLabel("RoomId")),
    MembershipItemList: MembershipItemList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/accounts/{AccountId}/rooms/{RoomId}/memberships?operation=batch-create",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchCreateRoomMembershipRequest",
}) as any as S.Schema<BatchCreateRoomMembershipRequest>;
export interface UserError {
  UserId?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const UserError = S.suspend(() =>
  S.Struct({
    UserId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "UserError" }) as any as S.Schema<UserError>;
export type UserErrorList = UserError[];
export const UserErrorList = S.Array(UserError);
export interface BatchUnsuspendUserResponse {
  UserErrors?: UserErrorList;
}
export const BatchUnsuspendUserResponse = S.suspend(() =>
  S.Struct({ UserErrors: S.optional(UserErrorList) }),
).annotations({
  identifier: "BatchUnsuspendUserResponse",
}) as any as S.Schema<BatchUnsuspendUserResponse>;
export interface BatchUpdatePhoneNumberRequest {
  UpdatePhoneNumberRequestItems: UpdatePhoneNumberRequestItemList;
}
export const BatchUpdatePhoneNumberRequest = S.suspend(() =>
  S.Struct({
    UpdatePhoneNumberRequestItems: UpdatePhoneNumberRequestItemList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/phone-numbers?operation=batch-update" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdatePhoneNumberRequest",
}) as any as S.Schema<BatchUpdatePhoneNumberRequest>;
export interface BatchUpdateUserRequest {
  AccountId: string;
  UpdateUserRequestItems: UpdateUserRequestItemList;
}
export const BatchUpdateUserRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UpdateUserRequestItems: UpdateUserRequestItemList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/accounts/{AccountId}/users" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchUpdateUserRequest",
}) as any as S.Schema<BatchUpdateUserRequest>;
export interface CreateMeetingDialOutResponse {
  TransactionId?: string;
}
export const CreateMeetingDialOutResponse = S.suspend(() =>
  S.Struct({ TransactionId: S.optional(S.String) }),
).annotations({
  identifier: "CreateMeetingDialOutResponse",
}) as any as S.Schema<CreateMeetingDialOutResponse>;
export interface GetAccountResponse {
  Account?: Account;
}
export const GetAccountResponse = S.suspend(() =>
  S.Struct({ Account: S.optional(Account) }),
).annotations({
  identifier: "GetAccountResponse",
}) as any as S.Schema<GetAccountResponse>;
export interface GetAccountSettingsResponse {
  AccountSettings?: AccountSettings;
}
export const GetAccountSettingsResponse = S.suspend(() =>
  S.Struct({ AccountSettings: S.optional(AccountSettings) }),
).annotations({
  identifier: "GetAccountSettingsResponse",
}) as any as S.Schema<GetAccountSettingsResponse>;
export interface GetBotResponse {
  Bot?: Bot;
}
export const GetBotResponse = S.suspend(() =>
  S.Struct({ Bot: S.optional(Bot) }),
).annotations({
  identifier: "GetBotResponse",
}) as any as S.Schema<GetBotResponse>;
export interface GetGlobalSettingsResponse {
  BusinessCalling?: BusinessCallingSettings;
  VoiceConnector?: VoiceConnectorSettings;
}
export const GetGlobalSettingsResponse = S.suspend(() =>
  S.Struct({
    BusinessCalling: S.optional(BusinessCallingSettings),
    VoiceConnector: S.optional(VoiceConnectorSettings),
  }),
).annotations({
  identifier: "GetGlobalSettingsResponse",
}) as any as S.Schema<GetGlobalSettingsResponse>;
export interface GetPhoneNumberOrderResponse {
  PhoneNumberOrder?: PhoneNumberOrder;
}
export const GetPhoneNumberOrderResponse = S.suspend(() =>
  S.Struct({ PhoneNumberOrder: S.optional(PhoneNumberOrder) }),
).annotations({
  identifier: "GetPhoneNumberOrderResponse",
}) as any as S.Schema<GetPhoneNumberOrderResponse>;
export interface RoomRetentionSettings {
  RetentionDays?: number;
}
export const RoomRetentionSettings = S.suspend(() =>
  S.Struct({ RetentionDays: S.optional(S.Number) }),
).annotations({
  identifier: "RoomRetentionSettings",
}) as any as S.Schema<RoomRetentionSettings>;
export interface ConversationRetentionSettings {
  RetentionDays?: number;
}
export const ConversationRetentionSettings = S.suspend(() =>
  S.Struct({ RetentionDays: S.optional(S.Number) }),
).annotations({
  identifier: "ConversationRetentionSettings",
}) as any as S.Schema<ConversationRetentionSettings>;
export interface RetentionSettings {
  RoomRetentionSettings?: RoomRetentionSettings;
  ConversationRetentionSettings?: ConversationRetentionSettings;
}
export const RetentionSettings = S.suspend(() =>
  S.Struct({
    RoomRetentionSettings: S.optional(RoomRetentionSettings),
    ConversationRetentionSettings: S.optional(ConversationRetentionSettings),
  }),
).annotations({
  identifier: "RetentionSettings",
}) as any as S.Schema<RetentionSettings>;
export interface GetRetentionSettingsResponse {
  RetentionSettings?: RetentionSettings;
  InitiateDeletionTimestamp?: Date;
}
export const GetRetentionSettingsResponse = S.suspend(() =>
  S.Struct({
    RetentionSettings: S.optional(RetentionSettings),
    InitiateDeletionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "GetRetentionSettingsResponse",
}) as any as S.Schema<GetRetentionSettingsResponse>;
export interface GetRoomResponse {
  Room?: Room;
}
export const GetRoomResponse = S.suspend(() =>
  S.Struct({ Room: S.optional(Room) }),
).annotations({
  identifier: "GetRoomResponse",
}) as any as S.Schema<GetRoomResponse>;
export interface GetUserResponse {
  User?: User;
}
export const GetUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }),
).annotations({
  identifier: "GetUserResponse",
}) as any as S.Schema<GetUserResponse>;
export interface TelephonySettings {
  InboundCalling: boolean;
  OutboundCalling: boolean;
  SMS: boolean;
}
export const TelephonySettings = S.suspend(() =>
  S.Struct({
    InboundCalling: S.Boolean,
    OutboundCalling: S.Boolean,
    SMS: S.Boolean,
  }),
).annotations({
  identifier: "TelephonySettings",
}) as any as S.Schema<TelephonySettings>;
export interface UserSettings {
  Telephony: TelephonySettings;
}
export const UserSettings = S.suspend(() =>
  S.Struct({ Telephony: TelephonySettings }),
).annotations({ identifier: "UserSettings" }) as any as S.Schema<UserSettings>;
export interface GetUserSettingsResponse {
  UserSettings?: UserSettings;
}
export const GetUserSettingsResponse = S.suspend(() =>
  S.Struct({ UserSettings: S.optional(UserSettings) }),
).annotations({
  identifier: "GetUserSettingsResponse",
}) as any as S.Schema<GetUserSettingsResponse>;
export interface ListAccountsResponse {
  Accounts?: AccountList;
  NextToken?: string;
}
export const ListAccountsResponse = S.suspend(() =>
  S.Struct({
    Accounts: S.optional(AccountList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccountsResponse",
}) as any as S.Schema<ListAccountsResponse>;
export interface ListBotsResponse {
  Bots?: BotList;
  NextToken?: string;
}
export const ListBotsResponse = S.suspend(() =>
  S.Struct({ Bots: S.optional(BotList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListBotsResponse",
}) as any as S.Schema<ListBotsResponse>;
export interface ListPhoneNumberOrdersResponse {
  PhoneNumberOrders?: PhoneNumberOrderList;
  NextToken?: string;
}
export const ListPhoneNumberOrdersResponse = S.suspend(() =>
  S.Struct({
    PhoneNumberOrders: S.optional(PhoneNumberOrderList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPhoneNumberOrdersResponse",
}) as any as S.Schema<ListPhoneNumberOrdersResponse>;
export interface ListPhoneNumbersResponse {
  PhoneNumbers?: PhoneNumberList;
  NextToken?: string;
}
export const ListPhoneNumbersResponse = S.suspend(() =>
  S.Struct({
    PhoneNumbers: S.optional(PhoneNumberList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPhoneNumbersResponse",
}) as any as S.Schema<ListPhoneNumbersResponse>;
export interface ListRoomMembershipsResponse {
  RoomMemberships?: RoomMembershipList;
  NextToken?: string;
}
export const ListRoomMembershipsResponse = S.suspend(() =>
  S.Struct({
    RoomMemberships: S.optional(RoomMembershipList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRoomMembershipsResponse",
}) as any as S.Schema<ListRoomMembershipsResponse>;
export interface ListRoomsResponse {
  Rooms?: RoomList;
  NextToken?: string;
}
export const ListRoomsResponse = S.suspend(() =>
  S.Struct({ Rooms: S.optional(RoomList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListRoomsResponse",
}) as any as S.Schema<ListRoomsResponse>;
export interface ListUsersResponse {
  Users?: UserList;
  NextToken?: string;
}
export const ListUsersResponse = S.suspend(() =>
  S.Struct({ Users: S.optional(UserList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListUsersResponse",
}) as any as S.Schema<ListUsersResponse>;
export interface EventsConfiguration {
  BotId?: string;
  OutboundEventsHTTPSEndpoint?: string | Redacted.Redacted<string>;
  LambdaFunctionArn?: string | Redacted.Redacted<string>;
}
export const EventsConfiguration = S.suspend(() =>
  S.Struct({
    BotId: S.optional(S.String),
    OutboundEventsHTTPSEndpoint: S.optional(SensitiveString),
    LambdaFunctionArn: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EventsConfiguration",
}) as any as S.Schema<EventsConfiguration>;
export interface PutEventsConfigurationResponse {
  EventsConfiguration?: EventsConfiguration;
}
export const PutEventsConfigurationResponse = S.suspend(() =>
  S.Struct({ EventsConfiguration: S.optional(EventsConfiguration) }),
).annotations({
  identifier: "PutEventsConfigurationResponse",
}) as any as S.Schema<PutEventsConfigurationResponse>;
export interface RegenerateSecurityTokenResponse {
  Bot?: Bot;
}
export const RegenerateSecurityTokenResponse = S.suspend(() =>
  S.Struct({ Bot: S.optional(Bot) }),
).annotations({
  identifier: "RegenerateSecurityTokenResponse",
}) as any as S.Schema<RegenerateSecurityTokenResponse>;
export interface ResetPersonalPINResponse {
  User?: User;
}
export const ResetPersonalPINResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }),
).annotations({
  identifier: "ResetPersonalPINResponse",
}) as any as S.Schema<ResetPersonalPINResponse>;
export interface RestorePhoneNumberResponse {
  PhoneNumber?: PhoneNumber;
}
export const RestorePhoneNumberResponse = S.suspend(() =>
  S.Struct({ PhoneNumber: S.optional(PhoneNumber) }),
).annotations({
  identifier: "RestorePhoneNumberResponse",
}) as any as S.Schema<RestorePhoneNumberResponse>;
export interface SearchAvailablePhoneNumbersResponse {
  E164PhoneNumbers?: E164PhoneNumberList;
  NextToken?: string;
}
export const SearchAvailablePhoneNumbersResponse = S.suspend(() =>
  S.Struct({
    E164PhoneNumbers: S.optional(E164PhoneNumberList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchAvailablePhoneNumbersResponse",
}) as any as S.Schema<SearchAvailablePhoneNumbersResponse>;
export interface UpdateAccountResponse {
  Account?: Account;
}
export const UpdateAccountResponse = S.suspend(() =>
  S.Struct({ Account: S.optional(Account) }),
).annotations({
  identifier: "UpdateAccountResponse",
}) as any as S.Schema<UpdateAccountResponse>;
export interface UpdateAccountSettingsRequest {
  AccountId: string;
  AccountSettings: AccountSettings;
}
export const UpdateAccountSettingsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    AccountSettings: AccountSettings,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/accounts/{AccountId}/settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccountSettingsRequest",
}) as any as S.Schema<UpdateAccountSettingsRequest>;
export interface UpdateAccountSettingsResponse {}
export const UpdateAccountSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAccountSettingsResponse",
}) as any as S.Schema<UpdateAccountSettingsResponse>;
export interface UpdateBotResponse {
  Bot?: Bot;
}
export const UpdateBotResponse = S.suspend(() =>
  S.Struct({ Bot: S.optional(Bot) }),
).annotations({
  identifier: "UpdateBotResponse",
}) as any as S.Schema<UpdateBotResponse>;
export interface UpdatePhoneNumberResponse {
  PhoneNumber?: PhoneNumber;
}
export const UpdatePhoneNumberResponse = S.suspend(() =>
  S.Struct({ PhoneNumber: S.optional(PhoneNumber) }),
).annotations({
  identifier: "UpdatePhoneNumberResponse",
}) as any as S.Schema<UpdatePhoneNumberResponse>;
export interface UpdateRoomResponse {
  Room?: Room;
}
export const UpdateRoomResponse = S.suspend(() =>
  S.Struct({ Room: S.optional(Room) }),
).annotations({
  identifier: "UpdateRoomResponse",
}) as any as S.Schema<UpdateRoomResponse>;
export interface UpdateRoomMembershipResponse {
  RoomMembership?: RoomMembership;
}
export const UpdateRoomMembershipResponse = S.suspend(() =>
  S.Struct({ RoomMembership: S.optional(RoomMembership) }),
).annotations({
  identifier: "UpdateRoomMembershipResponse",
}) as any as S.Schema<UpdateRoomMembershipResponse>;
export interface UpdateUserRequest {
  AccountId: string;
  UserId: string;
  LicenseType?: string;
  UserType?: string;
  AlexaForBusinessMetadata?: AlexaForBusinessMetadata;
}
export const UpdateUserRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    LicenseType: S.optional(S.String),
    UserType: S.optional(S.String),
    AlexaForBusinessMetadata: S.optional(AlexaForBusinessMetadata),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/accounts/{AccountId}/users/{UserId}" }),
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
export type PhoneNumberTypeList = string[];
export const PhoneNumberTypeList = S.Array(S.String);
export interface PhoneNumberError {
  PhoneNumberId?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const PhoneNumberError = S.suspend(() =>
  S.Struct({
    PhoneNumberId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "PhoneNumberError",
}) as any as S.Schema<PhoneNumberError>;
export type PhoneNumberErrorList = PhoneNumberError[];
export const PhoneNumberErrorList = S.Array(PhoneNumberError);
export interface Invite {
  InviteId?: string;
  Status?: string;
  EmailAddress?: string | Redacted.Redacted<string>;
  EmailStatus?: string;
}
export const Invite = S.suspend(() =>
  S.Struct({
    InviteId: S.optional(S.String),
    Status: S.optional(S.String),
    EmailAddress: S.optional(SensitiveString),
    EmailStatus: S.optional(S.String),
  }),
).annotations({ identifier: "Invite" }) as any as S.Schema<Invite>;
export type InviteList = Invite[];
export const InviteList = S.Array(Invite);
export interface PhoneNumberCountry {
  CountryCode?: string;
  SupportedPhoneNumberTypes?: PhoneNumberTypeList;
}
export const PhoneNumberCountry = S.suspend(() =>
  S.Struct({
    CountryCode: S.optional(S.String),
    SupportedPhoneNumberTypes: S.optional(PhoneNumberTypeList),
  }),
).annotations({
  identifier: "PhoneNumberCountry",
}) as any as S.Schema<PhoneNumberCountry>;
export type PhoneNumberCountriesList = PhoneNumberCountry[];
export const PhoneNumberCountriesList = S.Array(PhoneNumberCountry);
export interface BatchDeletePhoneNumberResponse {
  PhoneNumberErrors?: PhoneNumberErrorList;
}
export const BatchDeletePhoneNumberResponse = S.suspend(() =>
  S.Struct({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }),
).annotations({
  identifier: "BatchDeletePhoneNumberResponse",
}) as any as S.Schema<BatchDeletePhoneNumberResponse>;
export interface BatchSuspendUserResponse {
  UserErrors?: UserErrorList;
}
export const BatchSuspendUserResponse = S.suspend(() =>
  S.Struct({ UserErrors: S.optional(UserErrorList) }),
).annotations({
  identifier: "BatchSuspendUserResponse",
}) as any as S.Schema<BatchSuspendUserResponse>;
export interface BatchUpdatePhoneNumberResponse {
  PhoneNumberErrors?: PhoneNumberErrorList;
}
export const BatchUpdatePhoneNumberResponse = S.suspend(() =>
  S.Struct({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }),
).annotations({
  identifier: "BatchUpdatePhoneNumberResponse",
}) as any as S.Schema<BatchUpdatePhoneNumberResponse>;
export interface BatchUpdateUserResponse {
  UserErrors?: UserErrorList;
}
export const BatchUpdateUserResponse = S.suspend(() =>
  S.Struct({ UserErrors: S.optional(UserErrorList) }),
).annotations({
  identifier: "BatchUpdateUserResponse",
}) as any as S.Schema<BatchUpdateUserResponse>;
export interface CreateAccountResponse {
  Account?: Account;
}
export const CreateAccountResponse = S.suspend(() =>
  S.Struct({ Account: S.optional(Account) }),
).annotations({
  identifier: "CreateAccountResponse",
}) as any as S.Schema<CreateAccountResponse>;
export interface CreateBotResponse {
  Bot?: Bot;
}
export const CreateBotResponse = S.suspend(() =>
  S.Struct({ Bot: S.optional(Bot) }),
).annotations({
  identifier: "CreateBotResponse",
}) as any as S.Schema<CreateBotResponse>;
export interface CreateRoomResponse {
  Room?: Room;
}
export const CreateRoomResponse = S.suspend(() =>
  S.Struct({ Room: S.optional(Room) }),
).annotations({
  identifier: "CreateRoomResponse",
}) as any as S.Schema<CreateRoomResponse>;
export interface CreateUserResponse {
  User?: User;
}
export const CreateUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }),
).annotations({
  identifier: "CreateUserResponse",
}) as any as S.Schema<CreateUserResponse>;
export interface GetEventsConfigurationResponse {
  EventsConfiguration?: EventsConfiguration;
}
export const GetEventsConfigurationResponse = S.suspend(() =>
  S.Struct({ EventsConfiguration: S.optional(EventsConfiguration) }),
).annotations({
  identifier: "GetEventsConfigurationResponse",
}) as any as S.Schema<GetEventsConfigurationResponse>;
export interface InviteUsersResponse {
  Invites?: InviteList;
}
export const InviteUsersResponse = S.suspend(() =>
  S.Struct({ Invites: S.optional(InviteList) }),
).annotations({
  identifier: "InviteUsersResponse",
}) as any as S.Schema<InviteUsersResponse>;
export interface ListSupportedPhoneNumberCountriesResponse {
  PhoneNumberCountries?: PhoneNumberCountriesList;
}
export const ListSupportedPhoneNumberCountriesResponse = S.suspend(() =>
  S.Struct({ PhoneNumberCountries: S.optional(PhoneNumberCountriesList) }),
).annotations({
  identifier: "ListSupportedPhoneNumberCountriesResponse",
}) as any as S.Schema<ListSupportedPhoneNumberCountriesResponse>;
export interface PutRetentionSettingsRequest {
  AccountId: string;
  RetentionSettings: RetentionSettings;
}
export const PutRetentionSettingsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    RetentionSettings: RetentionSettings,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/accounts/{AccountId}/retention-settings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRetentionSettingsRequest",
}) as any as S.Schema<PutRetentionSettingsRequest>;
export interface UpdateUserResponse {
  User?: User;
}
export const UpdateUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }),
).annotations({
  identifier: "UpdateUserResponse",
}) as any as S.Schema<UpdateUserResponse>;
export interface UpdateUserSettingsRequest {
  AccountId: string;
  UserId: string;
  UserSettings: UserSettings;
}
export const UpdateUserSettingsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.String.pipe(T.HttpLabel("AccountId")),
    UserId: S.String.pipe(T.HttpLabel("UserId")),
    UserSettings: UserSettings,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/accounts/{AccountId}/users/{UserId}/settings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateUserSettingsRequest",
}) as any as S.Schema<UpdateUserSettingsRequest>;
export interface UpdateUserSettingsResponse {}
export const UpdateUserSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateUserSettingsResponse",
}) as any as S.Schema<UpdateUserSettingsResponse>;
export interface MemberError {
  MemberId?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const MemberError = S.suspend(() =>
  S.Struct({
    MemberId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "MemberError" }) as any as S.Schema<MemberError>;
export type MemberErrorList = MemberError[];
export const MemberErrorList = S.Array(MemberError);
export interface BatchCreateRoomMembershipResponse {
  Errors?: MemberErrorList;
}
export const BatchCreateRoomMembershipResponse = S.suspend(() =>
  S.Struct({ Errors: S.optional(MemberErrorList) }),
).annotations({
  identifier: "BatchCreateRoomMembershipResponse",
}) as any as S.Schema<BatchCreateRoomMembershipResponse>;
export interface CreatePhoneNumberOrderResponse {
  PhoneNumberOrder?: PhoneNumberOrder;
}
export const CreatePhoneNumberOrderResponse = S.suspend(() =>
  S.Struct({ PhoneNumberOrder: S.optional(PhoneNumberOrder) }),
).annotations({
  identifier: "CreatePhoneNumberOrderResponse",
}) as any as S.Schema<CreatePhoneNumberOrderResponse>;
export interface CreateRoomMembershipResponse {
  RoomMembership?: RoomMembership;
}
export const CreateRoomMembershipResponse = S.suspend(() =>
  S.Struct({ RoomMembership: S.optional(RoomMembership) }),
).annotations({
  identifier: "CreateRoomMembershipResponse",
}) as any as S.Schema<CreateRoomMembershipResponse>;
export interface GetPhoneNumberResponse {
  PhoneNumber?: PhoneNumber;
}
export const GetPhoneNumberResponse = S.suspend(() =>
  S.Struct({ PhoneNumber: S.optional(PhoneNumber) }),
).annotations({
  identifier: "GetPhoneNumberResponse",
}) as any as S.Schema<GetPhoneNumberResponse>;
export interface PutRetentionSettingsResponse {
  RetentionSettings?: RetentionSettings;
  InitiateDeletionTimestamp?: Date;
}
export const PutRetentionSettingsResponse = S.suspend(() =>
  S.Struct({
    RetentionSettings: S.optional(RetentionSettings),
    InitiateDeletionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "PutRetentionSettingsResponse",
}) as any as S.Schema<PutRetentionSettingsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ThrottledClientException extends S.TaggedError<ThrottledClientException>()(
  "ThrottledClientException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class UnauthorizedClientException extends S.TaggedError<UnauthorizedClientException>()(
  "UnauthorizedClientException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes the events configuration that allows a bot to receive outgoing events.
 */
export const deleteEventsConfiguration: (
  input: DeleteEventsConfigurationRequest,
) => Effect.Effect<
  DeleteEventsConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventsConfigurationRequest,
  output: DeleteEventsConfigurationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    UnauthorizedClientException,
  ],
}));
/**
 * Puts retention settings for the specified Amazon Chime Enterprise account. We recommend using AWS CloudTrail to monitor usage of this API for your account. For more information, see
 * Logging Amazon Chime API Calls with AWS CloudTrail
 * in the *Amazon Chime Administration Guide*.
 *
 * To turn off existing retention settings, remove the number of days from the corresponding
 * **RetentionDays**
 * field in the
 * **RetentionSettings**
 * object. For more information about retention settings, see
 * Managing Chat Retention Policies
 * in the *Amazon Chime Administration Guide*.
 */
export const putRetentionSettings: (
  input: PutRetentionSettingsRequest,
) => Effect.Effect<
  PutRetentionSettingsResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRetentionSettingsRequest,
  output: PutRetentionSettingsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Sends email to a maximum of 50 users, inviting them to the specified Amazon Chime
 * `Team` account. Only `Team` account types are currently
 * supported for this action.
 */
export const inviteUsers: (
  input: InviteUsersRequest,
) => Effect.Effect<
  InviteUsersResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InviteUsersRequest,
  output: InviteUsersResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the settings for the specified Amazon Chime account. You can update settings for
 * remote control of shared screens, or for the dial-out option. For more information about
 * these settings, see Use
 * the Policies Page in the Amazon Chime Administration
 * Guide.
 */
export const updateAccountSettings: (
  input: UpdateAccountSettingsRequest,
) => Effect.Effect<
  UpdateAccountSettingsResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountSettingsRequest,
  output: UpdateAccountSettingsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates user details for a specified user ID. Currently, only `LicenseType` updates are supported for this action.
 */
export const updateUser: (
  input: UpdateUserRequest,
) => Effect.Effect<
  UpdateUserResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the settings for the specified user, such as phone number settings.
 */
export const updateUserSettings: (
  input: UpdateUserSettingsRequest,
) => Effect.Effect<
  UpdateUserSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserSettingsRequest,
  output: UpdateUserSettingsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves details for the specified Amazon Chime account, such as account type and supported
 * licenses.
 */
export const getAccount: (
  input: GetAccountRequest,
) => Effect.Effect<
  GetAccountResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountRequest,
  output: GetAccountResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves account settings for the specified Amazon Chime account ID, such as remote control
 * and dialout settings. For more information about these settings, see
 * Use the Policies Page in the *Amazon Chime Administration Guide*.
 */
export const getAccountSettings: (
  input: GetAccountSettingsRequest,
) => Effect.Effect<
  GetAccountSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: GetAccountSettingsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves details for the specified bot, such as bot email address, bot type, status, and display name.
 */
export const getBot: (
  input: GetBotRequest,
) => Effect.Effect<
  GetBotResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBotRequest,
  output: GetBotResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves details for the specified phone number order, such as the order creation timestamp, phone
 * numbers in E.164 format, product type, and order status.
 */
export const getPhoneNumberOrder: (
  input: GetPhoneNumberOrderRequest,
) => Effect.Effect<
  GetPhoneNumberOrderResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPhoneNumberOrderRequest,
  output: GetPhoneNumberOrderResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Gets the retention settings for the specified Amazon Chime Enterprise account. For more information about retention settings, see
 * Managing Chat Retention Policies in the *Amazon Chime Administration Guide*.
 */
export const getRetentionSettings: (
  input: GetRetentionSettingsRequest,
) => Effect.Effect<
  GetRetentionSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRetentionSettingsRequest,
  output: GetRetentionSettingsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves room details, such as the room name, for a room in an Amazon Chime Enterprise account.
 */
export const getRoom: (
  input: GetRoomRequest,
) => Effect.Effect<
  GetRoomResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRoomRequest,
  output: GetRoomResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves details for the specified user ID, such as primary email address, license type,and personal meeting PIN.
 *
 * To retrieve user details with an email address instead of a user ID, use the
 * ListUsers action, and then filter by email address.
 */
export const getUser: (
  input: GetUserRequest,
) => Effect.Effect<
  GetUserResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserRequest,
  output: GetUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves settings for the specified user ID, such as any associated phone number settings.
 */
export const getUserSettings: (
  input: GetUserSettingsRequest,
) => Effect.Effect<
  GetUserSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserSettingsRequest,
  output: GetUserSettingsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Lists the Amazon Chime accounts under the administrator's AWS account. You can filter accounts
 * by account name prefix. To find out which Amazon Chime account a user belongs to, you can
 * filter by the user's email address, which returns one account result.
 */
export const listAccounts: {
  (
    input: ListAccountsRequest,
  ): Effect.Effect<
    ListAccountsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountsRequest,
  ) => Stream.Stream<
    ListAccountsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountsRequest,
  output: ListAccountsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the bots associated with the administrator's Amazon Chime Enterprise account ID.
 */
export const listBots: {
  (
    input: ListBotsRequest,
  ): Effect.Effect<
    ListBotsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBotsRequest,
  ) => Stream.Stream<
    ListBotsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBotsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBotsRequest,
  output: ListBotsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the phone numbers for the specified Amazon Chime account, Amazon Chime user, Amazon Chime Voice Connector, or Amazon Chime Voice Connector group.
 */
export const listPhoneNumbers: {
  (
    input: ListPhoneNumbersRequest,
  ): Effect.Effect<
    ListPhoneNumbersResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPhoneNumbersRequest,
  ) => Stream.Stream<
    ListPhoneNumbersResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPhoneNumbersRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPhoneNumbersRequest,
  output: ListPhoneNumbersResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the membership details for the specified room in an Amazon Chime Enterprise account,
 * such as the members' IDs, email addresses, and names.
 */
export const listRoomMemberships: {
  (
    input: ListRoomMembershipsRequest,
  ): Effect.Effect<
    ListRoomMembershipsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRoomMembershipsRequest,
  ) => Stream.Stream<
    ListRoomMembershipsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRoomMembershipsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRoomMembershipsRequest,
  output: ListRoomMembershipsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the room details for the specified Amazon Chime Enterprise account. Optionally, filter the results by a member ID (user ID or bot ID) to see a list of rooms that the member belongs to.
 */
export const listRooms: {
  (
    input: ListRoomsRequest,
  ): Effect.Effect<
    ListRoomsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRoomsRequest,
  ) => Stream.Stream<
    ListRoomsResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRoomsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRoomsRequest,
  output: ListRoomsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the users that belong to the specified Amazon Chime account. You can specify an email
 * address to list only the user that the email address belongs to.
 */
export const listUsers: {
  (
    input: ListUsersRequest,
  ): Effect.Effect<
    ListUsersResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUsersRequest,
  ) => Stream.Stream<
    ListUsersResponse,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUsersRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | NotFoundException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Regenerates the security token for a bot.
 */
export const regenerateSecurityToken: (
  input: RegenerateSecurityTokenRequest,
) => Effect.Effect<
  RegenerateSecurityTokenResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegenerateSecurityTokenRequest,
  output: RegenerateSecurityTokenResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Resets the personal meeting PIN for the specified user on an Amazon Chime account. Returns
 * the User object with the updated personal meeting PIN.
 */
export const resetPersonalPIN: (
  input: ResetPersonalPINRequest,
) => Effect.Effect<
  ResetPersonalPINResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetPersonalPINRequest,
  output: ResetPersonalPINResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Moves a phone number from the **Deletion queue** back into the
 * phone number **Inventory**.
 */
export const restorePhoneNumber: (
  input: RestorePhoneNumberRequest,
) => Effect.Effect<
  RestorePhoneNumberResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestorePhoneNumberRequest,
  output: RestorePhoneNumberResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates account details for the specified Amazon Chime account. Currently, only account name and default license updates are supported for this action.
 */
export const updateAccount: (
  input: UpdateAccountRequest,
) => Effect.Effect<
  UpdateAccountResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountRequest,
  output: UpdateAccountResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the status of the specified bot, such as starting or stopping the bot from running in your Amazon Chime Enterprise account.
 */
export const updateBot: (
  input: UpdateBotRequest,
) => Effect.Effect<
  UpdateBotResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBotRequest,
  output: UpdateBotResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates room details, such as the room name, for a room in an Amazon Chime Enterprise account.
 */
export const updateRoom: (
  input: UpdateRoomRequest,
) => Effect.Effect<
  UpdateRoomResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRoomRequest,
  output: UpdateRoomResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates room membership details, such as the member role, for a room in an Amazon Chime
 * Enterprise account. The member role designates whether the member is a chat room
 * administrator or a general chat room member. The member role can be updated only for
 * user IDs.
 */
export const updateRoomMembership: (
  input: UpdateRoomMembershipRequest,
) => Effect.Effect<
  UpdateRoomMembershipResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRoomMembershipRequest,
  output: UpdateRoomMembershipResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Moves the specified phone number into the **Deletion queue**. A
 * phone number must be disassociated from any users or Amazon Chime Voice Connectors
 * before it can be deleted.
 *
 * Deleted phone numbers remain in the
 * **Deletion queue**
 * for 7 days before they are deleted permanently.
 */
export const deletePhoneNumber: (
  input: DeletePhoneNumberRequest,
) => Effect.Effect<
  DeletePhoneNumberResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePhoneNumberRequest,
  output: DeletePhoneNumberResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes a chat room in an Amazon Chime Enterprise account.
 */
export const deleteRoom: (
  input: DeleteRoomRequest,
) => Effect.Effect<
  DeleteRoomResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRoomRequest,
  output: DeleteRoomResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Removes a member from a chat room in an Amazon Chime Enterprise account.
 */
export const deleteRoomMembership: (
  input: DeleteRoomMembershipRequest,
) => Effect.Effect<
  DeleteRoomMembershipResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRoomMembershipRequest,
  output: DeleteRoomMembershipResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Disassociates the primary provisioned phone number from the specified Amazon Chime user.
 */
export const disassociatePhoneNumberFromUser: (
  input: DisassociatePhoneNumberFromUserRequest,
) => Effect.Effect<
  DisassociatePhoneNumberFromUserResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociatePhoneNumberFromUserRequest,
  output: DisassociatePhoneNumberFromUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Disassociates the specified sign-in delegate groups from the specified Amazon Chime account.
 */
export const disassociateSigninDelegateGroupsFromAccount: (
  input: DisassociateSigninDelegateGroupsFromAccountRequest,
) => Effect.Effect<
  DisassociateSigninDelegateGroupsFromAccountResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateSigninDelegateGroupsFromAccountRequest,
  output: DisassociateSigninDelegateGroupsFromAccountResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Logs out the specified user from all of the devices they are currently logged into.
 */
export const logoutUser: (
  input: LogoutUserRequest,
) => Effect.Effect<
  LogoutUserResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: LogoutUserRequest,
  output: LogoutUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Redacts the specified message from the specified Amazon Chime conversation.
 */
export const redactConversationMessage: (
  input: RedactConversationMessageRequest,
) => Effect.Effect<
  RedactConversationMessageResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RedactConversationMessageRequest,
  output: RedactConversationMessageResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Redacts the specified message from the specified Amazon Chime channel.
 */
export const redactRoomMessage: (
  input: RedactRoomMessageRequest,
) => Effect.Effect<
  RedactRoomMessageResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RedactRoomMessageRequest,
  output: RedactRoomMessageResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Associates a phone number with the specified Amazon Chime user.
 */
export const associatePhoneNumberWithUser: (
  input: AssociatePhoneNumberWithUserRequest,
) => Effect.Effect<
  AssociatePhoneNumberWithUserResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociatePhoneNumberWithUserRequest,
  output: AssociatePhoneNumberWithUserResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Associates the specified sign-in delegate groups with the specified Amazon Chime account.
 */
export const associateSigninDelegateGroupsWithAccount: (
  input: AssociateSigninDelegateGroupsWithAccountRequest,
) => Effect.Effect<
  AssociateSigninDelegateGroupsWithAccountResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateSigninDelegateGroupsWithAccountRequest,
  output: AssociateSigninDelegateGroupsWithAccountResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Removes the suspension from up to 50 previously suspended users for the specified Amazon
 * Chime `EnterpriseLWA` account. Only users on `EnterpriseLWA`
 * accounts can be unsuspended using this action. For more information about different account types, see
 *
 * Managing Your Amazon Chime Accounts
 * in the account types, in the *Amazon Chime Administration Guide*.
 *
 * Previously suspended users who are unsuspended using this action are returned to
 * `Registered`
 * status. Users who are not previously suspended are ignored.
 */
export const batchUnsuspendUser: (
  input: BatchUnsuspendUserRequest,
) => Effect.Effect<
  BatchUnsuspendUserResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUnsuspendUserRequest,
  output: BatchUnsuspendUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Moves phone numbers into the
 * **Deletion queue**. Phone numbers must be disassociated from any users or Amazon Chime Voice Connectors before they can be deleted.
 *
 * Phone numbers remain in the
 * **Deletion queue** for 7 days before they are deleted permanently.
 */
export const batchDeletePhoneNumber: (
  input: BatchDeletePhoneNumberRequest,
) => Effect.Effect<
  BatchDeletePhoneNumberResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeletePhoneNumberRequest,
  output: BatchDeletePhoneNumberResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Suspends up to 50 users from a `Team` or `EnterpriseLWA` Amazon Chime
 * account. For more information about different account types, see Managing Your Amazon Chime Accounts in the Amazon Chime Administration
 * Guide.
 *
 * Users suspended from a `Team` account are disassociated from the account,but they
 * can continue to use Amazon Chime as free users. To remove the suspension from suspended
 * `Team` account users, invite them to the `Team` account again.
 * You can use the InviteUsers action to do so.
 *
 * Users suspended from an `EnterpriseLWA` account are immediately signed out of
 * Amazon Chime and can no longer sign in. To remove the suspension from suspended `EnterpriseLWA` account users, use the
 * BatchUnsuspendUser action.
 *
 * To sign out users without suspending them, use the
 * LogoutUser action.
 */
export const batchSuspendUser: (
  input: BatchSuspendUserRequest,
) => Effect.Effect<
  BatchSuspendUserResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchSuspendUserRequest,
  output: BatchSuspendUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates phone number product types or calling names. You can update one attribute at a time for each `UpdatePhoneNumberRequestItem`. For example, you can update the product type or the calling name.
 *
 * For toll-free numbers, you cannot use the Amazon Chime Business Calling product type. For numbers outside the U.S., you must use the Amazon Chime SIP Media Application Dial-In product type.
 *
 * Updates to outbound calling names can take up to 72 hours to complete. Pending updates to outbound calling names must be complete before you can request another update.
 */
export const batchUpdatePhoneNumber: (
  input: BatchUpdatePhoneNumberRequest,
) => Effect.Effect<
  BatchUpdatePhoneNumberResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdatePhoneNumberRequest,
  output: BatchUpdatePhoneNumberResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates user details within the UpdateUserRequestItem object for up to 20 users for the specified Amazon Chime account. Currently, only `LicenseType` updates are supported for this action.
 */
export const batchUpdateUser: (
  input: BatchUpdateUserRequest,
) => Effect.Effect<
  BatchUpdateUserResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateUserRequest,
  output: BatchUpdateUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates an Amazon Chime account under the administrator's AWS account. Only `Team`
 * account types are currently supported for this action. For more information about different account types, see
 * Managing Your Amazon Chime Accounts in the Amazon Chime
 * Administration Guide.
 */
export const createAccount: (
  input: CreateAccountRequest,
) => Effect.Effect<
  CreateAccountResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccountRequest,
  output: CreateAccountResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a bot for an Amazon Chime Enterprise account.
 */
export const createBot: (
  input: CreateBotRequest,
) => Effect.Effect<
  CreateBotResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBotRequest,
  output: CreateBotResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a chat room for the specified Amazon Chime Enterprise account.
 */
export const createRoom: (
  input: CreateRoomRequest,
) => Effect.Effect<
  CreateRoomResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRoomRequest,
  output: CreateRoomResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates phone number details, such as product type or calling name, for the specified phone number ID. You can update one phone number detail at a time. For example, you can update either the product type or the calling name in one action.
 *
 * For toll-free numbers, you cannot use the Amazon Chime Business Calling product type. For numbers outside the U.S., you must use the Amazon Chime SIP Media Application Dial-In product type.
 *
 * Updates to outbound calling names can take 72 hours to complete. Pending updates to outbound calling names must be complete before you can request another update.
 */
export const updatePhoneNumber: (
  input: UpdatePhoneNumberRequest,
) => Effect.Effect<
  UpdatePhoneNumberResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePhoneNumberRequest,
  output: UpdatePhoneNumberResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a user under the specified Amazon Chime account.
 */
export const createUser: (
  input: CreateUserRequest,
) => Effect.Effect<
  CreateUserResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Adds up to 50 members to a chat room in an Amazon Chime Enterprise account. Members can be users or bots. The member role designates whether the member is a
 * chat room administrator or a general chat room member.
 */
export const batchCreateRoomMembership: (
  input: BatchCreateRoomMembershipRequest,
) => Effect.Effect<
  BatchCreateRoomMembershipResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateRoomMembershipRequest,
  output: BatchCreateRoomMembershipResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Adds a member to a chat room in an Amazon Chime Enterprise account. A member can be either a user or a bot. The member role designates whether the member is a chat room administrator or a general chat room member.
 */
export const createRoomMembership: (
  input: CreateRoomMembershipRequest,
) => Effect.Effect<
  CreateRoomMembershipResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRoomMembershipRequest,
  output: CreateRoomMembershipResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves global settings for the administrator's AWS account, such as Amazon Chime Business
 * Calling and Amazon Chime Voice Connector settings.
 */
export const getGlobalSettings: (
  input: GetGlobalSettingsRequest,
) => Effect.Effect<
  GetGlobalSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGlobalSettingsRequest,
  output: GetGlobalSettingsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Lists the phone number orders for the administrator's Amazon Chime account.
 */
export const listPhoneNumberOrders: {
  (
    input: ListPhoneNumberOrdersRequest,
  ): Effect.Effect<
    ListPhoneNumberOrdersResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPhoneNumberOrdersRequest,
  ) => Stream.Stream<
    ListPhoneNumberOrdersResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPhoneNumberOrdersRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPhoneNumberOrdersRequest,
  output: ListPhoneNumberOrdersResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Searches for phone numbers that can be ordered. For US numbers, provide at least one of
 * the following search filters: `AreaCode`, `City`,
 * `State`, or `TollFreePrefix`. If you provide
 * `City`, you must also provide `State`. Numbers outside the US only
 * support the `PhoneNumberType` filter, which you must use.
 */
export const searchAvailablePhoneNumbers: {
  (
    input: SearchAvailablePhoneNumbersRequest,
  ): Effect.Effect<
    SearchAvailablePhoneNumbersResponse,
    | AccessDeniedException
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchAvailablePhoneNumbersRequest,
  ) => Stream.Stream<
    SearchAvailablePhoneNumbersResponse,
    | AccessDeniedException
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchAvailablePhoneNumbersRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchAvailablePhoneNumbersRequest,
  output: SearchAvailablePhoneNumbersResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the phone number settings for the administrator's AWS account, such as the default outbound calling name.
 */
export const getPhoneNumberSettings: (
  input: GetPhoneNumberSettingsRequest,
) => Effect.Effect<
  GetPhoneNumberSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPhoneNumberSettingsRequest,
  output: GetPhoneNumberSettingsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates global settings for the administrator's AWS account, such as Amazon Chime Business Calling and Amazon Chime Voice Connector settings.
 */
export const updateGlobalSettings: (
  input: UpdateGlobalSettingsRequest,
) => Effect.Effect<
  UpdateGlobalSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGlobalSettingsRequest,
  output: UpdateGlobalSettingsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the phone number settings for the administrator's AWS account, such as the default
 * outbound calling name. You can update the default outbound calling name once every seven
 * days. Outbound calling names can take up to 72 hours to update.
 */
export const updatePhoneNumberSettings: (
  input: UpdatePhoneNumberSettingsRequest,
) => Effect.Effect<
  UpdatePhoneNumberSettingsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePhoneNumberSettingsRequest,
  output: UpdatePhoneNumberSettingsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves details for the specified phone number ID, such as associations, capabilities, and product type.
 */
export const getPhoneNumber: (
  input: GetPhoneNumberRequest,
) => Effect.Effect<
  GetPhoneNumberResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPhoneNumberRequest,
  output: GetPhoneNumberResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Uses the join token and call metadata in a meeting request (From number, To number, and so forth) to initiate an outbound call to a public
 * switched telephone network (PSTN) and join them into a Chime meeting. Also ensures that the From number belongs to the customer.
 *
 * To play welcome audio or implement an interactive voice response (IVR), use the
 * `CreateSipMediaApplicationCall` action with the corresponding SIP media application ID.
 *
 * **This API is not available in a dedicated namespace.**
 */
export const createMeetingDialOut: (
  input: CreateMeetingDialOutRequest,
) => Effect.Effect<
  CreateMeetingDialOutResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMeetingDialOutRequest,
  output: CreateMeetingDialOutResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates an order for phone numbers to be provisioned. For toll-free numbers, you cannot use the Amazon Chime Business Calling product type.
 * For numbers outside the U.S., you must use the Amazon Chime SIP Media Application Dial-In product type.
 */
export const createPhoneNumberOrder: (
  input: CreatePhoneNumberOrderRequest,
) => Effect.Effect<
  CreatePhoneNumberOrderResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePhoneNumberOrderRequest,
  output: CreatePhoneNumberOrderResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Gets details for an events configuration that allows a bot to receive outgoing events, such as an HTTPS endpoint or Lambda function ARN.
 */
export const getEventsConfiguration: (
  input: GetEventsConfigurationRequest,
) => Effect.Effect<
  GetEventsConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventsConfigurationRequest,
  output: GetEventsConfigurationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates an events configuration that allows a bot to receive outgoing events sent by Amazon
 * Chime. Choose either an HTTPS endpoint or a Lambda function ARN. For more information,
 * see Bot.
 */
export const putEventsConfiguration: (
  input: PutEventsConfigurationRequest,
) => Effect.Effect<
  PutEventsConfigurationResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEventsConfigurationRequest,
  output: PutEventsConfigurationResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    UnauthorizedClientException,
  ],
}));
/**
 * Lists supported phone number countries.
 */
export const listSupportedPhoneNumberCountries: (
  input: ListSupportedPhoneNumberCountriesRequest,
) => Effect.Effect<
  ListSupportedPhoneNumberCountriesResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSupportedPhoneNumberCountriesRequest,
  output: ListSupportedPhoneNumberCountriesResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes the specified Amazon Chime account. You must suspend all users before deleting
 * `Team` account. You can use the BatchSuspendUser action
 * to dodo.
 *
 * For `EnterpriseLWA` and `EnterpriseAD` accounts, you must release the
 * claimed domains for your Amazon Chime account before deletion. As soon as you release
 * the domain, all users under that account are suspended.
 *
 * Deleted accounts appear in your `Disabled` accounts list for 90 days. To restore
 * deleted account from your `Disabled` accounts list, you must contact AWS
 * Support.
 *
 * After 90 days, deleted accounts are permanently removed from your
 * `Disabled` accounts list.
 */
export const deleteAccount: (
  input: DeleteAccountRequest,
) => Effect.Effect<
  DeleteAccountResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | UnprocessableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccountRequest,
  output: DeleteAccountResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
    UnprocessableEntityException,
  ],
}));

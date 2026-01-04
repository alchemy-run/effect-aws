import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Chime",
  serviceShapeName: "UCBuzzConsoleService",
});
const auth = T.AwsAuthSigv4({ name: "chime" });
const ver = T.ServiceVersion("2018-05-01");
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
                {
                  fn: "stringEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                    "aws",
                  ],
                },
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, false] },
              ],
              endpoint: {
                url: "https://chime.us-east-1.amazonaws.com",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "chime",
                      signingRegion: "us-east-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
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
                        url: "https://chime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [],
                      endpoint: {
                        url: "https://chime-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://chime.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://chime.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetGlobalSettingsRequest extends S.Class<GetGlobalSettingsRequest>(
  "GetGlobalSettingsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPhoneNumberSettingsRequest extends S.Class<GetPhoneNumberSettingsRequest>(
  "GetPhoneNumberSettingsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const NonEmptyStringList = S.Array(S.String);
export const UserIdList = S.Array(S.String);
export const E164PhoneNumberList = S.Array(S.String);
export const UserEmailList = S.Array(S.String);
export class AssociatePhoneNumberWithUserRequest extends S.Class<AssociatePhoneNumberWithUserRequest>(
  "AssociatePhoneNumberWithUserRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    UserId: S.String.pipe(T.HttpLabel()),
    E164PhoneNumber: S.String,
  },
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
) {}
export class AssociatePhoneNumberWithUserResponse extends S.Class<AssociatePhoneNumberWithUserResponse>(
  "AssociatePhoneNumberWithUserResponse",
)({}) {}
export class BatchDeletePhoneNumberRequest extends S.Class<BatchDeletePhoneNumberRequest>(
  "BatchDeletePhoneNumberRequest",
)(
  { PhoneNumberIds: NonEmptyStringList },
  T.all(
    T.Http({ method: "POST", uri: "/phone-numbers?operation=batch-delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchSuspendUserRequest extends S.Class<BatchSuspendUserRequest>(
  "BatchSuspendUserRequest",
)(
  { AccountId: S.String.pipe(T.HttpLabel()), UserIdList: UserIdList },
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
) {}
export class BatchUnsuspendUserRequest extends S.Class<BatchUnsuspendUserRequest>(
  "BatchUnsuspendUserRequest",
)(
  { AccountId: S.String.pipe(T.HttpLabel()), UserIdList: UserIdList },
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
) {}
export class CreateAccountRequest extends S.Class<CreateAccountRequest>(
  "CreateAccountRequest",
)(
  { Name: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBotRequest extends S.Class<CreateBotRequest>(
  "CreateBotRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    DisplayName: S.String,
    Domain: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AccountId}/bots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMeetingDialOutRequest extends S.Class<CreateMeetingDialOutRequest>(
  "CreateMeetingDialOutRequest",
)(
  {
    MeetingId: S.String.pipe(T.HttpLabel()),
    FromPhoneNumber: S.String,
    ToPhoneNumber: S.String,
    JoinToken: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/meetings/{MeetingId}/dial-outs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePhoneNumberOrderRequest extends S.Class<CreatePhoneNumberOrderRequest>(
  "CreatePhoneNumberOrderRequest",
)(
  { ProductType: S.String, E164PhoneNumbers: E164PhoneNumberList },
  T.all(
    T.Http({ method: "POST", uri: "/phone-number-orders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRoomRequest extends S.Class<CreateRoomRequest>(
  "CreateRoomRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    Name: S.String,
    ClientRequestToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AccountId}/rooms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRoomMembershipRequest extends S.Class<CreateRoomMembershipRequest>(
  "CreateRoomMembershipRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    RoomId: S.String.pipe(T.HttpLabel()),
    MemberId: S.String,
    Role: S.optional(S.String),
  },
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
) {}
export class CreateUserRequest extends S.Class<CreateUserRequest>(
  "CreateUserRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    Username: S.optional(S.String),
    Email: S.optional(S.String),
    UserType: S.optional(S.String),
  },
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
) {}
export class DeleteAccountRequest extends S.Class<DeleteAccountRequest>(
  "DeleteAccountRequest",
)(
  { AccountId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/accounts/{AccountId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccountResponse extends S.Class<DeleteAccountResponse>(
  "DeleteAccountResponse",
)({}) {}
export class DeleteEventsConfigurationRequest extends S.Class<DeleteEventsConfigurationRequest>(
  "DeleteEventsConfigurationRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    BotId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteEventsConfigurationResponse extends S.Class<DeleteEventsConfigurationResponse>(
  "DeleteEventsConfigurationResponse",
)({}) {}
export class DeletePhoneNumberRequest extends S.Class<DeletePhoneNumberRequest>(
  "DeletePhoneNumberRequest",
)(
  { PhoneNumberId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/phone-numbers/{PhoneNumberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePhoneNumberResponse extends S.Class<DeletePhoneNumberResponse>(
  "DeletePhoneNumberResponse",
)({}) {}
export class DeleteRoomRequest extends S.Class<DeleteRoomRequest>(
  "DeleteRoomRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    RoomId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/accounts/{AccountId}/rooms/{RoomId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRoomResponse extends S.Class<DeleteRoomResponse>(
  "DeleteRoomResponse",
)({}) {}
export class DeleteRoomMembershipRequest extends S.Class<DeleteRoomMembershipRequest>(
  "DeleteRoomMembershipRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    RoomId: S.String.pipe(T.HttpLabel()),
    MemberId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteRoomMembershipResponse extends S.Class<DeleteRoomMembershipResponse>(
  "DeleteRoomMembershipResponse",
)({}) {}
export class DisassociatePhoneNumberFromUserRequest extends S.Class<DisassociatePhoneNumberFromUserRequest>(
  "DisassociatePhoneNumberFromUserRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    UserId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DisassociatePhoneNumberFromUserResponse extends S.Class<DisassociatePhoneNumberFromUserResponse>(
  "DisassociatePhoneNumberFromUserResponse",
)({}) {}
export class DisassociateSigninDelegateGroupsFromAccountRequest extends S.Class<DisassociateSigninDelegateGroupsFromAccountRequest>(
  "DisassociateSigninDelegateGroupsFromAccountRequest",
)(
  { AccountId: S.String.pipe(T.HttpLabel()), GroupNames: NonEmptyStringList },
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
) {}
export class DisassociateSigninDelegateGroupsFromAccountResponse extends S.Class<DisassociateSigninDelegateGroupsFromAccountResponse>(
  "DisassociateSigninDelegateGroupsFromAccountResponse",
)({}) {}
export class GetAccountRequest extends S.Class<GetAccountRequest>(
  "GetAccountRequest",
)(
  { AccountId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AccountId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAccountSettingsRequest extends S.Class<GetAccountSettingsRequest>(
  "GetAccountSettingsRequest",
)(
  { AccountId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AccountId}/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBotRequest extends S.Class<GetBotRequest>("GetBotRequest")(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    BotId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AccountId}/bots/{BotId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEventsConfigurationRequest extends S.Class<GetEventsConfigurationRequest>(
  "GetEventsConfigurationRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    BotId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class GetPhoneNumberRequest extends S.Class<GetPhoneNumberRequest>(
  "GetPhoneNumberRequest",
)(
  { PhoneNumberId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/phone-numbers/{PhoneNumberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPhoneNumberOrderRequest extends S.Class<GetPhoneNumberOrderRequest>(
  "GetPhoneNumberOrderRequest",
)(
  { PhoneNumberOrderId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/phone-number-orders/{PhoneNumberOrderId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPhoneNumberSettingsResponse extends S.Class<GetPhoneNumberSettingsResponse>(
  "GetPhoneNumberSettingsResponse",
)({
  CallingName: S.optional(S.String),
  CallingNameUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class GetRetentionSettingsRequest extends S.Class<GetRetentionSettingsRequest>(
  "GetRetentionSettingsRequest",
)(
  { AccountId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AccountId}/retention-settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRoomRequest extends S.Class<GetRoomRequest>("GetRoomRequest")(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    RoomId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AccountId}/rooms/{RoomId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUserRequest extends S.Class<GetUserRequest>("GetUserRequest")(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    UserId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AccountId}/users/{UserId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetUserSettingsRequest extends S.Class<GetUserSettingsRequest>(
  "GetUserSettingsRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    UserId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class InviteUsersRequest extends S.Class<InviteUsersRequest>(
  "InviteUsersRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    UserEmailList: UserEmailList,
    UserType: S.optional(S.String),
  },
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
) {}
export class ListAccountsRequest extends S.Class<ListAccountsRequest>(
  "ListAccountsRequest",
)(
  {
    Name: S.optional(S.String).pipe(T.HttpQuery("name")),
    UserEmail: S.optional(S.String).pipe(T.HttpQuery("user-email")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBotsRequest extends S.Class<ListBotsRequest>(
  "ListBotsRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AccountId}/bots" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPhoneNumberOrdersRequest extends S.Class<ListPhoneNumberOrdersRequest>(
  "ListPhoneNumberOrdersRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/phone-number-orders" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPhoneNumbersRequest extends S.Class<ListPhoneNumbersRequest>(
  "ListPhoneNumbersRequest",
)(
  {
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    ProductType: S.optional(S.String).pipe(T.HttpQuery("product-type")),
    FilterName: S.optional(S.String).pipe(T.HttpQuery("filter-name")),
    FilterValue: S.optional(S.String).pipe(T.HttpQuery("filter-value")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/phone-numbers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRoomMembershipsRequest extends S.Class<ListRoomMembershipsRequest>(
  "ListRoomMembershipsRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    RoomId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
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
) {}
export class ListRoomsRequest extends S.Class<ListRoomsRequest>(
  "ListRoomsRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    MemberId: S.optional(S.String).pipe(T.HttpQuery("member-id")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AccountId}/rooms" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSupportedPhoneNumberCountriesRequest extends S.Class<ListSupportedPhoneNumberCountriesRequest>(
  "ListSupportedPhoneNumberCountriesRequest",
)(
  { ProductType: S.String.pipe(T.HttpQuery("product-type")) },
  T.all(
    T.Http({ method: "GET", uri: "/phone-number-countries" }),
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
    AccountId: S.String.pipe(T.HttpLabel()),
    UserEmail: S.optional(S.String).pipe(T.HttpQuery("user-email")),
    UserType: S.optional(S.String).pipe(T.HttpQuery("user-type")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("next-token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accounts/{AccountId}/users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LogoutUserRequest extends S.Class<LogoutUserRequest>(
  "LogoutUserRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    UserId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class LogoutUserResponse extends S.Class<LogoutUserResponse>(
  "LogoutUserResponse",
)({}) {}
export class PutEventsConfigurationRequest extends S.Class<PutEventsConfigurationRequest>(
  "PutEventsConfigurationRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    BotId: S.String.pipe(T.HttpLabel()),
    OutboundEventsHTTPSEndpoint: S.optional(S.String),
    LambdaFunctionArn: S.optional(S.String),
  },
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
) {}
export class RedactConversationMessageRequest extends S.Class<RedactConversationMessageRequest>(
  "RedactConversationMessageRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    ConversationId: S.String.pipe(T.HttpLabel()),
    MessageId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class RedactConversationMessageResponse extends S.Class<RedactConversationMessageResponse>(
  "RedactConversationMessageResponse",
)({}) {}
export class RedactRoomMessageRequest extends S.Class<RedactRoomMessageRequest>(
  "RedactRoomMessageRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    RoomId: S.String.pipe(T.HttpLabel()),
    MessageId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class RedactRoomMessageResponse extends S.Class<RedactRoomMessageResponse>(
  "RedactRoomMessageResponse",
)({}) {}
export class RegenerateSecurityTokenRequest extends S.Class<RegenerateSecurityTokenRequest>(
  "RegenerateSecurityTokenRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    BotId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class ResetPersonalPINRequest extends S.Class<ResetPersonalPINRequest>(
  "ResetPersonalPINRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    UserId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class RestorePhoneNumberRequest extends S.Class<RestorePhoneNumberRequest>(
  "RestorePhoneNumberRequest",
)(
  { PhoneNumberId: S.String.pipe(T.HttpLabel()) },
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
) {}
export class SearchAvailablePhoneNumbersRequest extends S.Class<SearchAvailablePhoneNumbersRequest>(
  "SearchAvailablePhoneNumbersRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "GET", uri: "/search?type=phone-numbers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccountRequest extends S.Class<UpdateAccountRequest>(
  "UpdateAccountRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
    DefaultLicense: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AccountId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateBotRequest extends S.Class<UpdateBotRequest>(
  "UpdateBotRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    BotId: S.String.pipe(T.HttpLabel()),
    Disabled: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AccountId}/bots/{BotId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BusinessCallingSettings extends S.Class<BusinessCallingSettings>(
  "BusinessCallingSettings",
)({ CdrBucket: S.optional(S.String) }) {}
export class VoiceConnectorSettings extends S.Class<VoiceConnectorSettings>(
  "VoiceConnectorSettings",
)({ CdrBucket: S.optional(S.String) }) {}
export class UpdateGlobalSettingsRequest extends S.Class<UpdateGlobalSettingsRequest>(
  "UpdateGlobalSettingsRequest",
)(
  {
    BusinessCalling: S.optional(BusinessCallingSettings),
    VoiceConnector: S.optional(VoiceConnectorSettings),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGlobalSettingsResponse extends S.Class<UpdateGlobalSettingsResponse>(
  "UpdateGlobalSettingsResponse",
)({}) {}
export class UpdatePhoneNumberRequest extends S.Class<UpdatePhoneNumberRequest>(
  "UpdatePhoneNumberRequest",
)(
  {
    PhoneNumberId: S.String.pipe(T.HttpLabel()),
    ProductType: S.optional(S.String),
    CallingName: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/phone-numbers/{PhoneNumberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePhoneNumberSettingsRequest extends S.Class<UpdatePhoneNumberSettingsRequest>(
  "UpdatePhoneNumberSettingsRequest",
)(
  { CallingName: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/settings/phone-number" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdatePhoneNumberSettingsResponse extends S.Class<UpdatePhoneNumberSettingsResponse>(
  "UpdatePhoneNumberSettingsResponse",
)({}) {}
export class UpdateRoomRequest extends S.Class<UpdateRoomRequest>(
  "UpdateRoomRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    RoomId: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AccountId}/rooms/{RoomId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRoomMembershipRequest extends S.Class<UpdateRoomMembershipRequest>(
  "UpdateRoomMembershipRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    RoomId: S.String.pipe(T.HttpLabel()),
    MemberId: S.String.pipe(T.HttpLabel()),
    Role: S.optional(S.String),
  },
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
) {}
export class SigninDelegateGroup extends S.Class<SigninDelegateGroup>(
  "SigninDelegateGroup",
)({ GroupName: S.optional(S.String) }) {}
export const SigninDelegateGroupList = S.Array(SigninDelegateGroup);
export class MembershipItem extends S.Class<MembershipItem>("MembershipItem")({
  MemberId: S.optional(S.String),
  Role: S.optional(S.String),
}) {}
export const MembershipItemList = S.Array(MembershipItem);
export class UpdatePhoneNumberRequestItem extends S.Class<UpdatePhoneNumberRequestItem>(
  "UpdatePhoneNumberRequestItem",
)({
  PhoneNumberId: S.String,
  ProductType: S.optional(S.String),
  CallingName: S.optional(S.String),
}) {}
export const UpdatePhoneNumberRequestItemList = S.Array(
  UpdatePhoneNumberRequestItem,
);
export class AlexaForBusinessMetadata extends S.Class<AlexaForBusinessMetadata>(
  "AlexaForBusinessMetadata",
)({
  IsAlexaForBusinessEnabled: S.optional(S.Boolean),
  AlexaForBusinessRoomArn: S.optional(S.String),
}) {}
export class UpdateUserRequestItem extends S.Class<UpdateUserRequestItem>(
  "UpdateUserRequestItem",
)({
  UserId: S.String,
  LicenseType: S.optional(S.String),
  UserType: S.optional(S.String),
  AlexaForBusinessMetadata: S.optional(AlexaForBusinessMetadata),
}) {}
export const UpdateUserRequestItemList = S.Array(UpdateUserRequestItem);
export const LicenseList = S.Array(S.String);
export class Account extends S.Class<Account>("Account")({
  AwsAccountId: S.String,
  AccountId: S.String,
  Name: S.String,
  AccountType: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DefaultLicense: S.optional(S.String),
  SupportedLicenses: S.optional(LicenseList),
  AccountStatus: S.optional(S.String),
  SigninDelegateGroups: S.optional(SigninDelegateGroupList),
}) {}
export const AccountList = S.Array(Account);
export class Bot extends S.Class<Bot>("Bot")({
  BotId: S.optional(S.String),
  UserId: S.optional(S.String),
  DisplayName: S.optional(S.String),
  BotType: S.optional(S.String),
  Disabled: S.optional(S.Boolean),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  BotEmail: S.optional(S.String),
  SecurityToken: S.optional(S.String),
}) {}
export const BotList = S.Array(Bot);
export class OrderedPhoneNumber extends S.Class<OrderedPhoneNumber>(
  "OrderedPhoneNumber",
)({ E164PhoneNumber: S.optional(S.String), Status: S.optional(S.String) }) {}
export const OrderedPhoneNumberList = S.Array(OrderedPhoneNumber);
export class PhoneNumberOrder extends S.Class<PhoneNumberOrder>(
  "PhoneNumberOrder",
)({
  PhoneNumberOrderId: S.optional(S.String),
  ProductType: S.optional(S.String),
  Status: S.optional(S.String),
  OrderedPhoneNumbers: S.optional(OrderedPhoneNumberList),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const PhoneNumberOrderList = S.Array(PhoneNumberOrder);
export class PhoneNumberCapabilities extends S.Class<PhoneNumberCapabilities>(
  "PhoneNumberCapabilities",
)({
  InboundCall: S.optional(S.Boolean),
  OutboundCall: S.optional(S.Boolean),
  InboundSMS: S.optional(S.Boolean),
  OutboundSMS: S.optional(S.Boolean),
  InboundMMS: S.optional(S.Boolean),
  OutboundMMS: S.optional(S.Boolean),
}) {}
export class PhoneNumberAssociation extends S.Class<PhoneNumberAssociation>(
  "PhoneNumberAssociation",
)({
  Value: S.optional(S.String),
  Name: S.optional(S.String),
  AssociatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const PhoneNumberAssociationList = S.Array(PhoneNumberAssociation);
export class PhoneNumber extends S.Class<PhoneNumber>("PhoneNumber")({
  PhoneNumberId: S.optional(S.String),
  E164PhoneNumber: S.optional(S.String),
  Country: S.optional(S.String),
  Type: S.optional(S.String),
  ProductType: S.optional(S.String),
  Status: S.optional(S.String),
  Capabilities: S.optional(PhoneNumberCapabilities),
  Associations: S.optional(PhoneNumberAssociationList),
  CallingName: S.optional(S.String),
  CallingNameStatus: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DeletionTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const PhoneNumberList = S.Array(PhoneNumber);
export class Member extends S.Class<Member>("Member")({
  MemberId: S.optional(S.String),
  MemberType: S.optional(S.String),
  Email: S.optional(S.String),
  FullName: S.optional(S.String),
  AccountId: S.optional(S.String),
}) {}
export class RoomMembership extends S.Class<RoomMembership>("RoomMembership")({
  RoomId: S.optional(S.String),
  Member: S.optional(Member),
  Role: S.optional(S.String),
  InvitedBy: S.optional(S.String),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const RoomMembershipList = S.Array(RoomMembership);
export class Room extends S.Class<Room>("Room")({
  RoomId: S.optional(S.String),
  Name: S.optional(S.String),
  AccountId: S.optional(S.String),
  CreatedBy: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const RoomList = S.Array(Room);
export class User extends S.Class<User>("User")({
  UserId: S.String,
  AccountId: S.optional(S.String),
  PrimaryEmail: S.optional(S.String),
  PrimaryProvisionedNumber: S.optional(S.String),
  DisplayName: S.optional(S.String),
  LicenseType: S.optional(S.String),
  UserType: S.optional(S.String),
  UserRegistrationStatus: S.optional(S.String),
  UserInvitationStatus: S.optional(S.String),
  RegisteredOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  InvitedOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  AlexaForBusinessMetadata: S.optional(AlexaForBusinessMetadata),
  PersonalPIN: S.optional(S.String),
}) {}
export const UserList = S.Array(User);
export class AccountSettings extends S.Class<AccountSettings>(
  "AccountSettings",
)({
  DisableRemoteControl: S.optional(S.Boolean),
  EnableDialOut: S.optional(S.Boolean),
}) {}
export class AssociateSigninDelegateGroupsWithAccountRequest extends S.Class<AssociateSigninDelegateGroupsWithAccountRequest>(
  "AssociateSigninDelegateGroupsWithAccountRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    SigninDelegateGroups: SigninDelegateGroupList,
  },
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
) {}
export class AssociateSigninDelegateGroupsWithAccountResponse extends S.Class<AssociateSigninDelegateGroupsWithAccountResponse>(
  "AssociateSigninDelegateGroupsWithAccountResponse",
)({}) {}
export class BatchCreateRoomMembershipRequest extends S.Class<BatchCreateRoomMembershipRequest>(
  "BatchCreateRoomMembershipRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    RoomId: S.String.pipe(T.HttpLabel()),
    MembershipItemList: MembershipItemList,
  },
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
) {}
export class UserError extends S.Class<UserError>("UserError")({
  UserId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const UserErrorList = S.Array(UserError);
export class BatchUnsuspendUserResponse extends S.Class<BatchUnsuspendUserResponse>(
  "BatchUnsuspendUserResponse",
)({ UserErrors: S.optional(UserErrorList) }) {}
export class BatchUpdatePhoneNumberRequest extends S.Class<BatchUpdatePhoneNumberRequest>(
  "BatchUpdatePhoneNumberRequest",
)(
  { UpdatePhoneNumberRequestItems: UpdatePhoneNumberRequestItemList },
  T.all(
    T.Http({ method: "POST", uri: "/phone-numbers?operation=batch-update" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateUserRequest extends S.Class<BatchUpdateUserRequest>(
  "BatchUpdateUserRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    UpdateUserRequestItems: UpdateUserRequestItemList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AccountId}/users" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMeetingDialOutResponse extends S.Class<CreateMeetingDialOutResponse>(
  "CreateMeetingDialOutResponse",
)({ TransactionId: S.optional(S.String) }) {}
export class GetAccountResponse extends S.Class<GetAccountResponse>(
  "GetAccountResponse",
)({ Account: S.optional(Account) }) {}
export class GetAccountSettingsResponse extends S.Class<GetAccountSettingsResponse>(
  "GetAccountSettingsResponse",
)({ AccountSettings: S.optional(AccountSettings) }) {}
export class GetBotResponse extends S.Class<GetBotResponse>("GetBotResponse")({
  Bot: S.optional(Bot),
}) {}
export class GetGlobalSettingsResponse extends S.Class<GetGlobalSettingsResponse>(
  "GetGlobalSettingsResponse",
)({
  BusinessCalling: S.optional(BusinessCallingSettings),
  VoiceConnector: S.optional(VoiceConnectorSettings),
}) {}
export class GetPhoneNumberOrderResponse extends S.Class<GetPhoneNumberOrderResponse>(
  "GetPhoneNumberOrderResponse",
)({ PhoneNumberOrder: S.optional(PhoneNumberOrder) }) {}
export class RoomRetentionSettings extends S.Class<RoomRetentionSettings>(
  "RoomRetentionSettings",
)({ RetentionDays: S.optional(S.Number) }) {}
export class ConversationRetentionSettings extends S.Class<ConversationRetentionSettings>(
  "ConversationRetentionSettings",
)({ RetentionDays: S.optional(S.Number) }) {}
export class RetentionSettings extends S.Class<RetentionSettings>(
  "RetentionSettings",
)({
  RoomRetentionSettings: S.optional(RoomRetentionSettings),
  ConversationRetentionSettings: S.optional(ConversationRetentionSettings),
}) {}
export class GetRetentionSettingsResponse extends S.Class<GetRetentionSettingsResponse>(
  "GetRetentionSettingsResponse",
)({
  RetentionSettings: S.optional(RetentionSettings),
  InitiateDeletionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export class GetRoomResponse extends S.Class<GetRoomResponse>(
  "GetRoomResponse",
)({ Room: S.optional(Room) }) {}
export class GetUserResponse extends S.Class<GetUserResponse>(
  "GetUserResponse",
)({ User: S.optional(User) }) {}
export class TelephonySettings extends S.Class<TelephonySettings>(
  "TelephonySettings",
)({ InboundCalling: S.Boolean, OutboundCalling: S.Boolean, SMS: S.Boolean }) {}
export class UserSettings extends S.Class<UserSettings>("UserSettings")({
  Telephony: TelephonySettings,
}) {}
export class GetUserSettingsResponse extends S.Class<GetUserSettingsResponse>(
  "GetUserSettingsResponse",
)({ UserSettings: S.optional(UserSettings) }) {}
export class ListAccountsResponse extends S.Class<ListAccountsResponse>(
  "ListAccountsResponse",
)({ Accounts: S.optional(AccountList), NextToken: S.optional(S.String) }) {}
export class ListBotsResponse extends S.Class<ListBotsResponse>(
  "ListBotsResponse",
)({ Bots: S.optional(BotList), NextToken: S.optional(S.String) }) {}
export class ListPhoneNumberOrdersResponse extends S.Class<ListPhoneNumberOrdersResponse>(
  "ListPhoneNumberOrdersResponse",
)({
  PhoneNumberOrders: S.optional(PhoneNumberOrderList),
  NextToken: S.optional(S.String),
}) {}
export class ListPhoneNumbersResponse extends S.Class<ListPhoneNumbersResponse>(
  "ListPhoneNumbersResponse",
)({
  PhoneNumbers: S.optional(PhoneNumberList),
  NextToken: S.optional(S.String),
}) {}
export class ListRoomMembershipsResponse extends S.Class<ListRoomMembershipsResponse>(
  "ListRoomMembershipsResponse",
)({
  RoomMemberships: S.optional(RoomMembershipList),
  NextToken: S.optional(S.String),
}) {}
export class ListRoomsResponse extends S.Class<ListRoomsResponse>(
  "ListRoomsResponse",
)({ Rooms: S.optional(RoomList), NextToken: S.optional(S.String) }) {}
export class ListUsersResponse extends S.Class<ListUsersResponse>(
  "ListUsersResponse",
)({ Users: S.optional(UserList), NextToken: S.optional(S.String) }) {}
export class EventsConfiguration extends S.Class<EventsConfiguration>(
  "EventsConfiguration",
)({
  BotId: S.optional(S.String),
  OutboundEventsHTTPSEndpoint: S.optional(S.String),
  LambdaFunctionArn: S.optional(S.String),
}) {}
export class PutEventsConfigurationResponse extends S.Class<PutEventsConfigurationResponse>(
  "PutEventsConfigurationResponse",
)({ EventsConfiguration: S.optional(EventsConfiguration) }) {}
export class RegenerateSecurityTokenResponse extends S.Class<RegenerateSecurityTokenResponse>(
  "RegenerateSecurityTokenResponse",
)({ Bot: S.optional(Bot) }) {}
export class ResetPersonalPINResponse extends S.Class<ResetPersonalPINResponse>(
  "ResetPersonalPINResponse",
)({ User: S.optional(User) }) {}
export class RestorePhoneNumberResponse extends S.Class<RestorePhoneNumberResponse>(
  "RestorePhoneNumberResponse",
)({ PhoneNumber: S.optional(PhoneNumber) }) {}
export class SearchAvailablePhoneNumbersResponse extends S.Class<SearchAvailablePhoneNumbersResponse>(
  "SearchAvailablePhoneNumbersResponse",
)({
  E164PhoneNumbers: S.optional(E164PhoneNumberList),
  NextToken: S.optional(S.String),
}) {}
export class UpdateAccountResponse extends S.Class<UpdateAccountResponse>(
  "UpdateAccountResponse",
)({ Account: S.optional(Account) }) {}
export class UpdateAccountSettingsRequest extends S.Class<UpdateAccountSettingsRequest>(
  "UpdateAccountSettingsRequest",
)(
  { AccountId: S.String.pipe(T.HttpLabel()), AccountSettings: AccountSettings },
  T.all(
    T.Http({ method: "PUT", uri: "/accounts/{AccountId}/settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAccountSettingsResponse extends S.Class<UpdateAccountSettingsResponse>(
  "UpdateAccountSettingsResponse",
)({}) {}
export class UpdateBotResponse extends S.Class<UpdateBotResponse>(
  "UpdateBotResponse",
)({ Bot: S.optional(Bot) }) {}
export class UpdatePhoneNumberResponse extends S.Class<UpdatePhoneNumberResponse>(
  "UpdatePhoneNumberResponse",
)({ PhoneNumber: S.optional(PhoneNumber) }) {}
export class UpdateRoomResponse extends S.Class<UpdateRoomResponse>(
  "UpdateRoomResponse",
)({ Room: S.optional(Room) }) {}
export class UpdateRoomMembershipResponse extends S.Class<UpdateRoomMembershipResponse>(
  "UpdateRoomMembershipResponse",
)({ RoomMembership: S.optional(RoomMembership) }) {}
export class UpdateUserRequest extends S.Class<UpdateUserRequest>(
  "UpdateUserRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    UserId: S.String.pipe(T.HttpLabel()),
    LicenseType: S.optional(S.String),
    UserType: S.optional(S.String),
    AlexaForBusinessMetadata: S.optional(AlexaForBusinessMetadata),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/{AccountId}/users/{UserId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const PhoneNumberTypeList = S.Array(S.String);
export class PhoneNumberError extends S.Class<PhoneNumberError>(
  "PhoneNumberError",
)({
  PhoneNumberId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const PhoneNumberErrorList = S.Array(PhoneNumberError);
export class Invite extends S.Class<Invite>("Invite")({
  InviteId: S.optional(S.String),
  Status: S.optional(S.String),
  EmailAddress: S.optional(S.String),
  EmailStatus: S.optional(S.String),
}) {}
export const InviteList = S.Array(Invite);
export class PhoneNumberCountry extends S.Class<PhoneNumberCountry>(
  "PhoneNumberCountry",
)({
  CountryCode: S.optional(S.String),
  SupportedPhoneNumberTypes: S.optional(PhoneNumberTypeList),
}) {}
export const PhoneNumberCountriesList = S.Array(PhoneNumberCountry);
export class BatchDeletePhoneNumberResponse extends S.Class<BatchDeletePhoneNumberResponse>(
  "BatchDeletePhoneNumberResponse",
)({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }) {}
export class BatchSuspendUserResponse extends S.Class<BatchSuspendUserResponse>(
  "BatchSuspendUserResponse",
)({ UserErrors: S.optional(UserErrorList) }) {}
export class BatchUpdatePhoneNumberResponse extends S.Class<BatchUpdatePhoneNumberResponse>(
  "BatchUpdatePhoneNumberResponse",
)({ PhoneNumberErrors: S.optional(PhoneNumberErrorList) }) {}
export class BatchUpdateUserResponse extends S.Class<BatchUpdateUserResponse>(
  "BatchUpdateUserResponse",
)({ UserErrors: S.optional(UserErrorList) }) {}
export class CreateAccountResponse extends S.Class<CreateAccountResponse>(
  "CreateAccountResponse",
)({ Account: S.optional(Account) }) {}
export class CreateBotResponse extends S.Class<CreateBotResponse>(
  "CreateBotResponse",
)({ Bot: S.optional(Bot) }) {}
export class CreateRoomResponse extends S.Class<CreateRoomResponse>(
  "CreateRoomResponse",
)({ Room: S.optional(Room) }) {}
export class CreateUserResponse extends S.Class<CreateUserResponse>(
  "CreateUserResponse",
)({ User: S.optional(User) }) {}
export class GetEventsConfigurationResponse extends S.Class<GetEventsConfigurationResponse>(
  "GetEventsConfigurationResponse",
)({ EventsConfiguration: S.optional(EventsConfiguration) }) {}
export class InviteUsersResponse extends S.Class<InviteUsersResponse>(
  "InviteUsersResponse",
)({ Invites: S.optional(InviteList) }) {}
export class ListSupportedPhoneNumberCountriesResponse extends S.Class<ListSupportedPhoneNumberCountriesResponse>(
  "ListSupportedPhoneNumberCountriesResponse",
)({ PhoneNumberCountries: S.optional(PhoneNumberCountriesList) }) {}
export class PutRetentionSettingsRequest extends S.Class<PutRetentionSettingsRequest>(
  "PutRetentionSettingsRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    RetentionSettings: RetentionSettings,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/accounts/{AccountId}/retention-settings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateUserResponse extends S.Class<UpdateUserResponse>(
  "UpdateUserResponse",
)({ User: S.optional(User) }) {}
export class UpdateUserSettingsRequest extends S.Class<UpdateUserSettingsRequest>(
  "UpdateUserSettingsRequest",
)(
  {
    AccountId: S.String.pipe(T.HttpLabel()),
    UserId: S.String.pipe(T.HttpLabel()),
    UserSettings: UserSettings,
  },
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
) {}
export class UpdateUserSettingsResponse extends S.Class<UpdateUserSettingsResponse>(
  "UpdateUserSettingsResponse",
)({}) {}
export class MemberError extends S.Class<MemberError>("MemberError")({
  MemberId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const MemberErrorList = S.Array(MemberError);
export class BatchCreateRoomMembershipResponse extends S.Class<BatchCreateRoomMembershipResponse>(
  "BatchCreateRoomMembershipResponse",
)({ Errors: S.optional(MemberErrorList) }) {}
export class CreatePhoneNumberOrderResponse extends S.Class<CreatePhoneNumberOrderResponse>(
  "CreatePhoneNumberOrderResponse",
)({ PhoneNumberOrder: S.optional(PhoneNumberOrder) }) {}
export class CreateRoomMembershipResponse extends S.Class<CreateRoomMembershipResponse>(
  "CreateRoomMembershipResponse",
)({ RoomMembership: S.optional(RoomMembership) }) {}
export class GetPhoneNumberResponse extends S.Class<GetPhoneNumberResponse>(
  "GetPhoneNumberResponse",
)({ PhoneNumber: S.optional(PhoneNumber) }) {}
export class PutRetentionSettingsResponse extends S.Class<PutRetentionSettingsResponse>(
  "PutRetentionSettingsResponse",
)({
  RetentionSettings: S.optional(RetentionSettings),
  InitiateDeletionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class ThrottledClientException extends S.TaggedError<ThrottledClientException>()(
  "ThrottledClientException",
  {},
) {}
export class UnauthorizedClientException extends S.TaggedError<UnauthorizedClientException>()(
  "UnauthorizedClientException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  { Code: S.optional(S.String), Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves the phone number settings for the administrator's AWS account, such as the default outbound calling name.
 */
export const getPhoneNumberSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Logs out the specified user from all of the devices they are currently logged into.
 */
export const logoutUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const redactConversationMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Redacts the specified message from the specified Amazon Chime channel.
 */
export const redactRoomMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates global settings for the administrator's AWS account, such as Amazon Chime Business Calling and Amazon Chime Voice Connector settings.
 */
export const updateGlobalSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates the phone number settings for the administrator's AWS account, such as the default
 * outbound calling name. You can update the default outbound calling name once every seven
 * days. Outbound calling names can take up to 72 hours to update.
 */
export const updatePhoneNumberSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Associates a phone number with the specified Amazon Chime user.
 */
export const associatePhoneNumberWithUser =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateSigninDelegateGroupsWithAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchUnsuspendUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the events configuration that allows a bot to receive outgoing events.
 */
export const deleteEventsConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Moves the specified phone number into the **Deletion queue**. A
 * phone number must be disassociated from any users or Amazon Chime Voice Connectors
 * before it can be deleted.
 *
 * Deleted phone numbers remain in the
 * **Deletion queue**
 * for 7 days before they are deleted permanently.
 */
export const deletePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRoom = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRoomMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Disassociates the primary provisioned phone number from the specified Amazon Chime user.
 */
export const disassociatePhoneNumberFromUser =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateSigninDelegateGroupsFromAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves details for the specified Amazon Chime account, such as account type and supported
 * licenses.
 */
export const getAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves global settings for the administrator's AWS account, such as Amazon Chime Business
 * Calling and Amazon Chime Voice Connector settings.
 */
export const getGlobalSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves details for the specified phone number order, such as the order creation timestamp, phone
 * numbers in E.164 format, product type, and order status.
 */
export const getPhoneNumberOrder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRetentionSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves room details, such as the room name, for a room in an Amazon Chime Enterprise account.
 */
export const getRoom = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getUserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAccounts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the bots associated with the administrator's Amazon Chime Enterprise account ID.
 */
export const listBots = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the phone number orders for the administrator's Amazon Chime account.
 */
export const listPhoneNumberOrders = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists the phone numbers for the specified Amazon Chime account, Amazon Chime user, Amazon Chime Voice Connector, or Amazon Chime Voice Connector group.
 */
export const listPhoneNumbers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the membership details for the specified room in an Amazon Chime Enterprise account,
 * such as the members' IDs, email addresses, and names.
 */
export const listRoomMemberships = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the room details for the specified Amazon Chime Enterprise account. Optionally, filter the results by a member ID (user ID or bot ID) to see a list of rooms that the member belongs to.
 */
export const listRooms = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the users that belong to the specified Amazon Chime account. You can specify an email
 * address to list only the user that the email address belongs to.
 */
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates an events configuration that allows a bot to receive outgoing events sent by Amazon
 * Chime. Choose either an HTTPS endpoint or a Lambda function ARN. For more information,
 * see Bot.
 */
export const putEventsConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Regenerates the security token for a bot.
 */
export const regenerateSecurityToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Resets the personal meeting PIN for the specified user on an Amazon Chime account. Returns
 * the User object with the updated personal meeting PIN.
 */
export const resetPersonalPIN = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const restorePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Searches for phone numbers that can be ordered. For US numbers, provide at least one of
 * the following search filters: `AreaCode`, `City`,
 * `State`, or `TollFreePrefix`. If you provide
 * `City`, you must also provide `State`. Numbers outside the US only
 * support the `PhoneNumberType` filter, which you must use.
 */
export const searchAvailablePhoneNumbers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates account details for the specified Amazon Chime account. Currently, only account name and default license updates are supported for this action.
 */
export const updateAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates phone number details, such as product type or calling name, for the specified phone number ID. You can update one phone number detail at a time. For example, you can update either the product type or the calling name in one action.
 *
 * For toll-free numbers, you cannot use the Amazon Chime Business Calling product type. For numbers outside the U.S., you must use the Amazon Chime SIP Media Application Dial-In product type.
 *
 * Updates to outbound calling names can take 72 hours to complete. Pending updates to outbound calling names must be complete before you can request another update.
 */
export const updatePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates room details, such as the room name, for a room in an Amazon Chime Enterprise account.
 */
export const updateRoom = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRoomMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Moves phone numbers into the
 * **Deletion queue**. Phone numbers must be disassociated from any users or Amazon Chime Voice Connectors before they can be deleted.
 *
 * Phone numbers remain in the
 * **Deletion queue** for 7 days before they are deleted permanently.
 */
export const batchDeletePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const batchSuspendUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchUpdatePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates user details within the UpdateUserRequestItem object for up to 20 users for the specified Amazon Chime account. Currently, only `LicenseType` updates are supported for this action.
 */
export const batchUpdateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Uses the join token and call metadata in a meeting request (From number, To number, and so forth) to initiate an outbound call to a public
 * switched telephone network (PSTN) and join them into a Chime meeting. Also ensures that the From number belongs to the customer.
 *
 * To play welcome audio or implement an interactive voice response (IVR), use the
 * `CreateSipMediaApplicationCall` action with the corresponding SIP media application ID.
 *
 * **This API is not available in a dedicated namespace.**
 */
export const createMeetingDialOut = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a chat room for the specified Amazon Chime Enterprise account.
 */
export const createRoom = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a user under the specified Amazon Chime account.
 */
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Gets details for an events configuration that allows a bot to receive outgoing events, such as an HTTPS endpoint or Lambda function ARN.
 */
export const getEventsConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Sends email to a maximum of 50 users, inviting them to the specified Amazon Chime
 * `Team` account. Only `Team` account types are currently
 * supported for this action.
 */
export const inviteUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists supported phone number countries.
 */
export const listSupportedPhoneNumberCountries =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the settings for the specified Amazon Chime account. You can update settings for
 * remote control of shared screens, or for the dial-out option. For more information about
 * these settings, see Use
 * the Policies Page in the Amazon Chime Administration
 * Guide.
 */
export const updateAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Updates user details for a specified user ID. Currently, only `LicenseType` updates are supported for this action.
 */
export const updateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateUserSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds up to 50 members to a chat room in an Amazon Chime Enterprise account. Members can be users or bots. The member role designates whether the member is a
 * chat room administrator or a general chat room member.
 */
export const batchCreateRoomMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates an order for phone numbers to be provisioned. For toll-free numbers, you cannot use the Amazon Chime Business Calling product type.
 * For numbers outside the U.S., you must use the Amazon Chime SIP Media Application Dial-In product type.
 */
export const createPhoneNumberOrder = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Adds a member to a chat room in an Amazon Chime Enterprise account. A member can be either a user or a bot. The member role designates whether the member is a chat room administrator or a general chat room member.
 */
export const createRoomMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Retrieves details for the specified phone number ID, such as associations, capabilities, and product type.
 */
export const getPhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putRetentionSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "SSO",
  serviceShapeName: "SWBPortalService",
});
const auth = T.AwsAuthSigv4({ name: "awsssoportal" });
const ver = T.ServiceVersion("2019-06-10");
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
                        url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://portal.sso.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetRoleCredentialsRequest extends S.Class<GetRoleCredentialsRequest>(
  "GetRoleCredentialsRequest",
)(
  {
    roleName: S.String.pipe(T.HttpQuery("role_name")),
    accountId: S.String.pipe(T.HttpQuery("account_id")),
    accessToken: S.String.pipe(T.HttpHeader("x-amz-sso_bearer_token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/federation/credentials" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAccountRolesRequest extends S.Class<ListAccountRolesRequest>(
  "ListAccountRolesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_result")),
    accessToken: S.String.pipe(T.HttpHeader("x-amz-sso_bearer_token")),
    accountId: S.String.pipe(T.HttpQuery("account_id")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assignment/roles" }),
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
    nextToken: S.optional(S.String).pipe(T.HttpQuery("next_token")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("max_result")),
    accessToken: S.String.pipe(T.HttpHeader("x-amz-sso_bearer_token")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/assignment/accounts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LogoutRequest extends S.Class<LogoutRequest>("LogoutRequest")(
  { accessToken: S.String.pipe(T.HttpHeader("x-amz-sso_bearer_token")) },
  T.all(
    T.Http({ method: "POST", uri: "/logout" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LogoutResponse extends S.Class<LogoutResponse>("LogoutResponse")(
  {},
) {}
export class RoleCredentials extends S.Class<RoleCredentials>(
  "RoleCredentials",
)({
  accessKeyId: S.optional(S.String),
  secretAccessKey: S.optional(S.String),
  sessionToken: S.optional(S.String),
  expiration: S.optional(S.Number),
}) {}
export class RoleInfo extends S.Class<RoleInfo>("RoleInfo")({
  roleName: S.optional(S.String),
  accountId: S.optional(S.String),
}) {}
export const RoleListType = S.Array(RoleInfo);
export class AccountInfo extends S.Class<AccountInfo>("AccountInfo")({
  accountId: S.optional(S.String),
  accountName: S.optional(S.String),
  emailAddress: S.optional(S.String),
}) {}
export const AccountListType = S.Array(AccountInfo);
export class GetRoleCredentialsResponse extends S.Class<GetRoleCredentialsResponse>(
  "GetRoleCredentialsResponse",
)({ roleCredentials: S.optional(RoleCredentials) }) {}
export class ListAccountRolesResponse extends S.Class<ListAccountRolesResponse>(
  "ListAccountRolesResponse",
)({ nextToken: S.optional(S.String), roleList: S.optional(RoleListType) }) {}
export class ListAccountsResponse extends S.Class<ListAccountsResponse>(
  "ListAccountsResponse",
)({
  nextToken: S.optional(S.String),
  accountList: S.optional(AccountListType),
}) {}

//# Errors
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes the locally stored SSO tokens from the client-side cache and sends an API call to
 * the IAM Identity Center service to invalidate the corresponding server-side IAM Identity Center sign in
 * session.
 *
 * If a user uses IAM Identity Center to access the AWS CLI, the user’s IAM Identity Center sign in session is
 * used to obtain an IAM session, as specified in the corresponding IAM Identity Center permission set.
 * More specifically, IAM Identity Center assumes an IAM role in the target account on behalf of the user,
 * and the corresponding temporary AWS credentials are returned to the client.
 *
 * After user logout, any existing IAM role sessions that were created by using IAM Identity Center
 * permission sets continue based on the duration configured in the permission set.
 * For more information, see User
 * authentications in the IAM Identity Center User
 * Guide.
 */
export const logout = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: LogoutRequest,
  output: LogoutResponse,
  errors: [
    InvalidRequestException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));
/**
 * Lists all roles that are assigned to the user for a given AWS account.
 */
export const listAccountRoles = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAccountRolesRequest,
    output: ListAccountRolesResponse,
    errors: [
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "roleList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all AWS accounts assigned to the user. These AWS accounts are assigned by the
 * administrator of the account. For more information, see Assign User Access in the *IAM Identity Center User Guide*. This operation
 * returns a paginated response.
 */
export const listAccounts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAccountsRequest,
    output: ListAccountsResponse,
    errors: [
      InvalidRequestException,
      ResourceNotFoundException,
      TooManyRequestsException,
      UnauthorizedException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "accountList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns the STS short-term credentials for a given role name that is assigned to the
 * user.
 */
export const getRoleCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRoleCredentialsRequest,
  output: GetRoleCredentialsResponse,
  errors: [
    InvalidRequestException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnauthorizedException,
  ],
}));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Support App",
  serviceShapeName: "SupportApp",
});
const auth = T.AwsAuthSigv4({ name: "supportapp" });
const ver = T.ServiceVersion("2021-08-20");
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
                        url: "https://supportapp-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://supportapp-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://supportapp.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://supportapp.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteAccountAliasRequest extends S.Class<DeleteAccountAliasRequest>(
  "DeleteAccountAliasRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/control/delete-account-alias" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccountAliasResult extends S.Class<DeleteAccountAliasResult>(
  "DeleteAccountAliasResult",
)({}) {}
export class GetAccountAliasRequest extends S.Class<GetAccountAliasRequest>(
  "GetAccountAliasRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/control/get-account-alias" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSlackChannelConfigurationRequest extends S.Class<CreateSlackChannelConfigurationRequest>(
  "CreateSlackChannelConfigurationRequest",
)(
  {
    teamId: S.String,
    channelId: S.String,
    channelName: S.optional(S.String),
    notifyOnCreateOrReopenCase: S.optional(S.Boolean),
    notifyOnAddCorrespondenceToCase: S.optional(S.Boolean),
    notifyOnResolveCase: S.optional(S.Boolean),
    notifyOnCaseSeverity: S.String,
    channelRoleArn: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/control/create-slack-channel-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSlackChannelConfigurationResult extends S.Class<CreateSlackChannelConfigurationResult>(
  "CreateSlackChannelConfigurationResult",
)({}) {}
export class DeleteSlackChannelConfigurationRequest extends S.Class<DeleteSlackChannelConfigurationRequest>(
  "DeleteSlackChannelConfigurationRequest",
)(
  { teamId: S.String, channelId: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/control/delete-slack-channel-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSlackChannelConfigurationResult extends S.Class<DeleteSlackChannelConfigurationResult>(
  "DeleteSlackChannelConfigurationResult",
)({}) {}
export class DeleteSlackWorkspaceConfigurationRequest extends S.Class<DeleteSlackWorkspaceConfigurationRequest>(
  "DeleteSlackWorkspaceConfigurationRequest",
)(
  { teamId: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/control/delete-slack-workspace-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSlackWorkspaceConfigurationResult extends S.Class<DeleteSlackWorkspaceConfigurationResult>(
  "DeleteSlackWorkspaceConfigurationResult",
)({}) {}
export class GetAccountAliasResult extends S.Class<GetAccountAliasResult>(
  "GetAccountAliasResult",
)({ accountAlias: S.optional(S.String) }) {}
export class ListSlackChannelConfigurationsRequest extends S.Class<ListSlackChannelConfigurationsRequest>(
  "ListSlackChannelConfigurationsRequest",
)(
  { nextToken: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/control/list-slack-channel-configurations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSlackWorkspaceConfigurationsRequest extends S.Class<ListSlackWorkspaceConfigurationsRequest>(
  "ListSlackWorkspaceConfigurationsRequest",
)(
  { nextToken: S.optional(S.String) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/control/list-slack-workspace-configurations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutAccountAliasRequest extends S.Class<PutAccountAliasRequest>(
  "PutAccountAliasRequest",
)(
  { accountAlias: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/control/put-account-alias" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutAccountAliasResult extends S.Class<PutAccountAliasResult>(
  "PutAccountAliasResult",
)({}) {}
export class RegisterSlackWorkspaceForOrganizationRequest extends S.Class<RegisterSlackWorkspaceForOrganizationRequest>(
  "RegisterSlackWorkspaceForOrganizationRequest",
)(
  { teamId: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/control/register-slack-workspace-for-organization",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSlackChannelConfigurationRequest extends S.Class<UpdateSlackChannelConfigurationRequest>(
  "UpdateSlackChannelConfigurationRequest",
)(
  {
    teamId: S.String,
    channelId: S.String,
    channelName: S.optional(S.String),
    notifyOnCreateOrReopenCase: S.optional(S.Boolean),
    notifyOnAddCorrespondenceToCase: S.optional(S.Boolean),
    notifyOnResolveCase: S.optional(S.Boolean),
    notifyOnCaseSeverity: S.optional(S.String),
    channelRoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/control/update-slack-channel-configuration",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterSlackWorkspaceForOrganizationResult extends S.Class<RegisterSlackWorkspaceForOrganizationResult>(
  "RegisterSlackWorkspaceForOrganizationResult",
)({
  teamId: S.optional(S.String),
  teamName: S.optional(S.String),
  accountType: S.optional(S.String),
}) {}
export class UpdateSlackChannelConfigurationResult extends S.Class<UpdateSlackChannelConfigurationResult>(
  "UpdateSlackChannelConfigurationResult",
)({
  teamId: S.optional(S.String),
  channelId: S.optional(S.String),
  channelName: S.optional(S.String),
  notifyOnCreateOrReopenCase: S.optional(S.Boolean),
  notifyOnAddCorrespondenceToCase: S.optional(S.Boolean),
  notifyOnResolveCase: S.optional(S.Boolean),
  notifyOnCaseSeverity: S.optional(S.String),
  channelRoleArn: S.optional(S.String),
}) {}
export class SlackChannelConfiguration extends S.Class<SlackChannelConfiguration>(
  "SlackChannelConfiguration",
)({
  teamId: S.String,
  channelId: S.String,
  channelName: S.optional(S.String),
  notifyOnCreateOrReopenCase: S.optional(S.Boolean),
  notifyOnAddCorrespondenceToCase: S.optional(S.Boolean),
  notifyOnResolveCase: S.optional(S.Boolean),
  notifyOnCaseSeverity: S.optional(S.String),
  channelRoleArn: S.optional(S.String),
}) {}
export const slackChannelConfigurationList = S.Array(SlackChannelConfiguration);
export class SlackWorkspaceConfiguration extends S.Class<SlackWorkspaceConfiguration>(
  "SlackWorkspaceConfiguration",
)({
  teamId: S.String,
  teamName: S.optional(S.String),
  allowOrganizationMemberAccount: S.optional(S.Boolean),
}) {}
export const SlackWorkspaceConfigurationList = S.Array(
  SlackWorkspaceConfiguration,
);
export class ListSlackChannelConfigurationsResult extends S.Class<ListSlackChannelConfigurationsResult>(
  "ListSlackChannelConfigurationsResult",
)({
  nextToken: S.optional(S.String),
  slackChannelConfigurations: slackChannelConfigurationList,
}) {}
export class ListSlackWorkspaceConfigurationsResult extends S.Class<ListSlackWorkspaceConfigurationsResult>(
  "ListSlackWorkspaceConfigurationsResult",
)({
  nextToken: S.optional(S.String),
  slackWorkspaceConfigurations: S.optional(SlackWorkspaceConfigurationList),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves the alias from an Amazon Web Services account ID. The alias appears in the Amazon Web Services Support App page of
 * the Amazon Web Services Support Center. The alias also appears in Slack messages from the Amazon Web Services Support App.
 */
export const getAccountAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountAliasRequest,
  output: GetAccountAliasResult,
  errors: [InternalServerException],
}));
/**
 * Deletes an alias for an Amazon Web Services account ID. The alias appears in the Amazon Web Services Support App page of the
 * Amazon Web Services Support Center. The alias also appears in Slack messages from the Amazon Web Services Support App.
 */
export const deleteAccountAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccountAliasRequest,
  output: DeleteAccountAliasResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the Slack channel configurations for an Amazon Web Services account.
 */
export const listSlackChannelConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSlackChannelConfigurationsRequest,
    output: ListSlackChannelConfigurationsResult,
    errors: [AccessDeniedException, InternalServerException],
    pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
  }));
/**
 * Lists the Slack workspace configurations for an Amazon Web Services account.
 */
export const listSlackWorkspaceConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSlackWorkspaceConfigurationsRequest,
    output: ListSlackWorkspaceConfigurationsResult,
    errors: [AccessDeniedException, InternalServerException],
    pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
  }));
/**
 * Creates or updates an individual alias for each Amazon Web Services account ID. The alias appears in the
 * Amazon Web Services Support App page of the Amazon Web Services Support Center. The alias also appears in Slack messages from the
 * Amazon Web Services Support App.
 */
export const putAccountAlias = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountAliasRequest,
  output: PutAccountAliasResult,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Deletes a Slack channel configuration from your Amazon Web Services account. This operation doesn't
 * delete your Slack channel.
 */
export const deleteSlackChannelConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteSlackChannelConfigurationRequest,
    output: DeleteSlackChannelConfigurationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Registers a Slack workspace for your Amazon Web Services account. To call this API, your account must be
 * part of an organization in Organizations.
 *
 * If you're the *management account* and you want to register Slack
 * workspaces for your organization, you must complete the following tasks:
 *
 * - Sign in to the Amazon Web Services Support Center and
 * authorize the Slack workspaces where you want your organization to have access to. See
 * Authorize a Slack workspace in the Amazon Web Services Support User
 * Guide.
 *
 * - Call the `RegisterSlackWorkspaceForOrganization` API to authorize each
 * Slack workspace for the organization.
 *
 * After the management account authorizes the Slack workspace, member accounts can call this
 * API to authorize the same Slack workspace for their individual accounts. Member accounts don't
 * need to authorize the Slack workspace manually through the Amazon Web Services Support Center.
 *
 * To use the Amazon Web Services Support App, each account must then complete the following tasks:
 *
 * - Create an Identity and Access Management (IAM) role with the required permission. For more information,
 * see Managing access to the Amazon Web Services Support App.
 *
 * - Configure a Slack channel to use the Amazon Web Services Support App for support cases for that account. For
 * more information, see Configuring a Slack channel.
 */
export const registerSlackWorkspaceForOrganization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RegisterSlackWorkspaceForOrganizationRequest,
    output: RegisterSlackWorkspaceForOrganizationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Updates the configuration for a Slack channel, such as case update notifications.
 */
export const updateSlackChannelConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSlackChannelConfigurationRequest,
    output: UpdateSlackChannelConfigurationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes a Slack workspace configuration from your Amazon Web Services account. This operation doesn't
 * delete your Slack workspace.
 */
export const deleteSlackWorkspaceConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteSlackWorkspaceConfigurationRequest,
    output: DeleteSlackWorkspaceConfigurationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Creates a Slack channel configuration for your Amazon Web Services account.
 *
 * - You can add up to 5 Slack workspaces for your account.
 *
 * - You can add up to 20 Slack channels for your account.
 *
 * A Slack channel can have up to 100 Amazon Web Services accounts. This means that only 100 accounts can
 * add the same Slack channel to the Amazon Web Services Support App. We recommend that you only add the accounts that
 * you need to manage support cases for your organization. This can reduce the notifications
 * about case updates that you receive in the Slack channel.
 *
 * We recommend that you choose a private Slack channel so that only members in that
 * channel have read and write access to your support cases. Anyone in your Slack channel can
 * create, update, or resolve support cases for your account. Users require an invitation to
 * join private channels.
 */
export const createSlackChannelConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateSlackChannelConfigurationRequest,
    output: CreateSlackChannelConfigurationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }));

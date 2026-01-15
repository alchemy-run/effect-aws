import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Support App",
  serviceShapeName: "SupportApp",
});
const auth = T.AwsAuthSigv4({ name: "supportapp" });
const ver = T.ServiceVersion("2021-08-20");
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
              `https://supportapp-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://supportapp-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://supportapp.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://supportapp.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type TeamId = string;
export type ChannelId = string;
export type ChannelName = string;
export type NotificationSeverityLevel = string;
export type RoleArn = string;
export type ErrorMessage = string;
export type AwsAccountAlias = string;
export type PaginationToken = string;
export type TeamName = string;
export type AccountType = string;

//# Schemas
export interface DeleteAccountAliasRequest {}
export const DeleteAccountAliasRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/control/delete-account-alias" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAccountAliasRequest",
}) as any as S.Schema<DeleteAccountAliasRequest>;
export interface DeleteAccountAliasResult {}
export const DeleteAccountAliasResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccountAliasResult",
}) as any as S.Schema<DeleteAccountAliasResult>;
export interface GetAccountAliasRequest {}
export const GetAccountAliasRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/control/get-account-alias" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountAliasRequest",
}) as any as S.Schema<GetAccountAliasRequest>;
export interface CreateSlackChannelConfigurationRequest {
  teamId: string;
  channelId: string;
  channelName?: string;
  notifyOnCreateOrReopenCase?: boolean;
  notifyOnAddCorrespondenceToCase?: boolean;
  notifyOnResolveCase?: boolean;
  notifyOnCaseSeverity: string;
  channelRoleArn: string;
}
export const CreateSlackChannelConfigurationRequest = S.suspend(() =>
  S.Struct({
    teamId: S.String,
    channelId: S.String,
    channelName: S.optional(S.String),
    notifyOnCreateOrReopenCase: S.optional(S.Boolean),
    notifyOnAddCorrespondenceToCase: S.optional(S.Boolean),
    notifyOnResolveCase: S.optional(S.Boolean),
    notifyOnCaseSeverity: S.String,
    channelRoleArn: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateSlackChannelConfigurationRequest",
}) as any as S.Schema<CreateSlackChannelConfigurationRequest>;
export interface CreateSlackChannelConfigurationResult {}
export const CreateSlackChannelConfigurationResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateSlackChannelConfigurationResult",
}) as any as S.Schema<CreateSlackChannelConfigurationResult>;
export interface DeleteSlackChannelConfigurationRequest {
  teamId: string;
  channelId: string;
}
export const DeleteSlackChannelConfigurationRequest = S.suspend(() =>
  S.Struct({ teamId: S.String, channelId: S.String }).pipe(
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
  ),
).annotations({
  identifier: "DeleteSlackChannelConfigurationRequest",
}) as any as S.Schema<DeleteSlackChannelConfigurationRequest>;
export interface DeleteSlackChannelConfigurationResult {}
export const DeleteSlackChannelConfigurationResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSlackChannelConfigurationResult",
}) as any as S.Schema<DeleteSlackChannelConfigurationResult>;
export interface DeleteSlackWorkspaceConfigurationRequest {
  teamId: string;
}
export const DeleteSlackWorkspaceConfigurationRequest = S.suspend(() =>
  S.Struct({ teamId: S.String }).pipe(
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
  ),
).annotations({
  identifier: "DeleteSlackWorkspaceConfigurationRequest",
}) as any as S.Schema<DeleteSlackWorkspaceConfigurationRequest>;
export interface DeleteSlackWorkspaceConfigurationResult {}
export const DeleteSlackWorkspaceConfigurationResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSlackWorkspaceConfigurationResult",
}) as any as S.Schema<DeleteSlackWorkspaceConfigurationResult>;
export interface GetAccountAliasResult {
  accountAlias?: string;
}
export const GetAccountAliasResult = S.suspend(() =>
  S.Struct({ accountAlias: S.optional(S.String) }),
).annotations({
  identifier: "GetAccountAliasResult",
}) as any as S.Schema<GetAccountAliasResult>;
export interface ListSlackChannelConfigurationsRequest {
  nextToken?: string;
}
export const ListSlackChannelConfigurationsRequest = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String) }).pipe(
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
  ),
).annotations({
  identifier: "ListSlackChannelConfigurationsRequest",
}) as any as S.Schema<ListSlackChannelConfigurationsRequest>;
export interface ListSlackWorkspaceConfigurationsRequest {
  nextToken?: string;
}
export const ListSlackWorkspaceConfigurationsRequest = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String) }).pipe(
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
  ),
).annotations({
  identifier: "ListSlackWorkspaceConfigurationsRequest",
}) as any as S.Schema<ListSlackWorkspaceConfigurationsRequest>;
export interface PutAccountAliasRequest {
  accountAlias: string;
}
export const PutAccountAliasRequest = S.suspend(() =>
  S.Struct({ accountAlias: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/control/put-account-alias" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAccountAliasRequest",
}) as any as S.Schema<PutAccountAliasRequest>;
export interface PutAccountAliasResult {}
export const PutAccountAliasResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutAccountAliasResult",
}) as any as S.Schema<PutAccountAliasResult>;
export interface RegisterSlackWorkspaceForOrganizationRequest {
  teamId: string;
}
export const RegisterSlackWorkspaceForOrganizationRequest = S.suspend(() =>
  S.Struct({ teamId: S.String }).pipe(
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
  ),
).annotations({
  identifier: "RegisterSlackWorkspaceForOrganizationRequest",
}) as any as S.Schema<RegisterSlackWorkspaceForOrganizationRequest>;
export interface UpdateSlackChannelConfigurationRequest {
  teamId: string;
  channelId: string;
  channelName?: string;
  notifyOnCreateOrReopenCase?: boolean;
  notifyOnAddCorrespondenceToCase?: boolean;
  notifyOnResolveCase?: boolean;
  notifyOnCaseSeverity?: string;
  channelRoleArn?: string;
}
export const UpdateSlackChannelConfigurationRequest = S.suspend(() =>
  S.Struct({
    teamId: S.String,
    channelId: S.String,
    channelName: S.optional(S.String),
    notifyOnCreateOrReopenCase: S.optional(S.Boolean),
    notifyOnAddCorrespondenceToCase: S.optional(S.Boolean),
    notifyOnResolveCase: S.optional(S.Boolean),
    notifyOnCaseSeverity: S.optional(S.String),
    channelRoleArn: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateSlackChannelConfigurationRequest",
}) as any as S.Schema<UpdateSlackChannelConfigurationRequest>;
export interface RegisterSlackWorkspaceForOrganizationResult {
  teamId?: string;
  teamName?: string;
  accountType?: string;
}
export const RegisterSlackWorkspaceForOrganizationResult = S.suspend(() =>
  S.Struct({
    teamId: S.optional(S.String),
    teamName: S.optional(S.String),
    accountType: S.optional(S.String),
  }),
).annotations({
  identifier: "RegisterSlackWorkspaceForOrganizationResult",
}) as any as S.Schema<RegisterSlackWorkspaceForOrganizationResult>;
export interface UpdateSlackChannelConfigurationResult {
  teamId?: string;
  channelId?: string;
  channelName?: string;
  notifyOnCreateOrReopenCase?: boolean;
  notifyOnAddCorrespondenceToCase?: boolean;
  notifyOnResolveCase?: boolean;
  notifyOnCaseSeverity?: string;
  channelRoleArn?: string;
}
export const UpdateSlackChannelConfigurationResult = S.suspend(() =>
  S.Struct({
    teamId: S.optional(S.String),
    channelId: S.optional(S.String),
    channelName: S.optional(S.String),
    notifyOnCreateOrReopenCase: S.optional(S.Boolean),
    notifyOnAddCorrespondenceToCase: S.optional(S.Boolean),
    notifyOnResolveCase: S.optional(S.Boolean),
    notifyOnCaseSeverity: S.optional(S.String),
    channelRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateSlackChannelConfigurationResult",
}) as any as S.Schema<UpdateSlackChannelConfigurationResult>;
export interface SlackChannelConfiguration {
  teamId: string;
  channelId: string;
  channelName?: string;
  notifyOnCreateOrReopenCase?: boolean;
  notifyOnAddCorrespondenceToCase?: boolean;
  notifyOnResolveCase?: boolean;
  notifyOnCaseSeverity?: string;
  channelRoleArn?: string;
}
export const SlackChannelConfiguration = S.suspend(() =>
  S.Struct({
    teamId: S.String,
    channelId: S.String,
    channelName: S.optional(S.String),
    notifyOnCreateOrReopenCase: S.optional(S.Boolean),
    notifyOnAddCorrespondenceToCase: S.optional(S.Boolean),
    notifyOnResolveCase: S.optional(S.Boolean),
    notifyOnCaseSeverity: S.optional(S.String),
    channelRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "SlackChannelConfiguration",
}) as any as S.Schema<SlackChannelConfiguration>;
export type SlackChannelConfigurationList = SlackChannelConfiguration[];
export const SlackChannelConfigurationList = S.Array(SlackChannelConfiguration);
export interface SlackWorkspaceConfiguration {
  teamId: string;
  teamName?: string;
  allowOrganizationMemberAccount?: boolean;
}
export const SlackWorkspaceConfiguration = S.suspend(() =>
  S.Struct({
    teamId: S.String,
    teamName: S.optional(S.String),
    allowOrganizationMemberAccount: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SlackWorkspaceConfiguration",
}) as any as S.Schema<SlackWorkspaceConfiguration>;
export type SlackWorkspaceConfigurationList = SlackWorkspaceConfiguration[];
export const SlackWorkspaceConfigurationList = S.Array(
  SlackWorkspaceConfiguration,
);
export interface ListSlackChannelConfigurationsResult {
  nextToken?: string;
  slackChannelConfigurations: SlackChannelConfiguration[];
}
export const ListSlackChannelConfigurationsResult = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    slackChannelConfigurations: SlackChannelConfigurationList,
  }),
).annotations({
  identifier: "ListSlackChannelConfigurationsResult",
}) as any as S.Schema<ListSlackChannelConfigurationsResult>;
export interface ListSlackWorkspaceConfigurationsResult {
  nextToken?: string;
  slackWorkspaceConfigurations?: SlackWorkspaceConfiguration[];
}
export const ListSlackWorkspaceConfigurationsResult = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    slackWorkspaceConfigurations: S.optional(SlackWorkspaceConfigurationList),
  }),
).annotations({
  identifier: "ListSlackWorkspaceConfigurationsResult",
}) as any as S.Schema<ListSlackWorkspaceConfigurationsResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Retrieves the alias from an Amazon Web Services account ID. The alias appears in the Amazon Web Services Support App page of
 * the Amazon Web Services Support Center. The alias also appears in Slack messages from the Amazon Web Services Support App.
 */
export const getAccountAlias: (
  input: GetAccountAliasRequest,
) => effect.Effect<
  GetAccountAliasResult,
  InternalServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountAliasRequest,
  output: GetAccountAliasResult,
  errors: [InternalServerException],
}));
/**
 * Deletes an alias for an Amazon Web Services account ID. The alias appears in the Amazon Web Services Support App page of the
 * Amazon Web Services Support Center. The alias also appears in Slack messages from the Amazon Web Services Support App.
 */
export const deleteAccountAlias: (
  input: DeleteAccountAliasRequest,
) => effect.Effect<
  DeleteAccountAliasResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSlackChannelConfigurations: {
  (
    input: ListSlackChannelConfigurationsRequest,
  ): effect.Effect<
    ListSlackChannelConfigurationsResult,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSlackChannelConfigurationsRequest,
  ) => stream.Stream<
    ListSlackChannelConfigurationsResult,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSlackChannelConfigurationsRequest,
  ) => stream.Stream<
    unknown,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSlackChannelConfigurationsRequest,
  output: ListSlackChannelConfigurationsResult,
  errors: [AccessDeniedException, InternalServerException],
  pagination: { inputToken: "nextToken", outputToken: "nextToken" } as const,
}));
/**
 * Lists the Slack workspace configurations for an Amazon Web Services account.
 */
export const listSlackWorkspaceConfigurations: {
  (
    input: ListSlackWorkspaceConfigurationsRequest,
  ): effect.Effect<
    ListSlackWorkspaceConfigurationsResult,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSlackWorkspaceConfigurationsRequest,
  ) => stream.Stream<
    ListSlackWorkspaceConfigurationsResult,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSlackWorkspaceConfigurationsRequest,
  ) => stream.Stream<
    unknown,
    AccessDeniedException | InternalServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putAccountAlias: (
  input: PutAccountAliasRequest,
) => effect.Effect<
  PutAccountAliasResult,
  | AccessDeniedException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountAliasRequest,
  output: PutAccountAliasResult,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
}));
/**
 * Deletes a Slack channel configuration from your Amazon Web Services account. This operation doesn't
 * delete your Slack channel.
 */
export const deleteSlackChannelConfiguration: (
  input: DeleteSlackChannelConfigurationRequest,
) => effect.Effect<
  DeleteSlackChannelConfigurationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const registerSlackWorkspaceForOrganization: (
  input: RegisterSlackWorkspaceForOrganizationRequest,
) => effect.Effect<
  RegisterSlackWorkspaceForOrganizationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSlackChannelConfiguration: (
  input: UpdateSlackChannelConfigurationRequest,
) => effect.Effect<
  UpdateSlackChannelConfigurationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSlackWorkspaceConfiguration: (
  input: DeleteSlackWorkspaceConfigurationRequest,
) => effect.Effect<
  DeleteSlackWorkspaceConfigurationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSlackChannelConfiguration: (
  input: CreateSlackChannelConfigurationRequest,
) => effect.Effect<
  CreateSlackChannelConfigurationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

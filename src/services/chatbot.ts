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
const ns = T.XmlNamespace(
  "http://wheatley.amazonaws.com/orchestration/2017-10-11/",
);
const svc = T.AwsApiService({
  sdkId: "chatbot",
  serviceShapeName: "WheatleyOrchestration_20171011",
});
const auth = T.AwsAuthSigv4({ name: "chatbot" });
const ver = T.ServiceVersion("2017-10-11");
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
              `https://chatbot-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://chatbot-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://chatbot.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://chatbot.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceIdentifier = string;
export type ChatConfigurationArn = string;
export type ChimeWebhookDescription = string | redacted.Redacted<string>;
export type ChimeWebhookUrl = string | redacted.Redacted<string>;
export type Arn = string;
export type ConfigurationName = string;
export type CustomerCwLogLevel = string;
export type TeamsChannelId = string;
export type TeamsChannelName = string | redacted.Redacted<string>;
export type UUID = string;
export type TeamName = string | redacted.Redacted<string>;
export type GuardrailPolicyArn = string;
export type BooleanAccountPreference = boolean;
export type SlackTeamId = string;
export type SlackChannelId = string;
export type SlackChannelDisplayName = string | redacted.Redacted<string>;
export type SlackUserId = string;
export type MaxResults = number;
export type PaginationToken = string;
export type AmazonResourceName = string;
export type TagKey = string;
export type CustomActionAliasName = string;
export type ClientToken = string;
export type CustomActionName = string;
export type CustomActionArn = string;
export type TagValue = string;
export type CustomActionAttachmentNotificationType = string;
export type CustomActionButtonText = string;
export type ErrorMessage = string;
export type ResourceState = string;
export type SlackTeamName = string;
export type AwsUserIdentity = string;

//# Schemas
export interface GetAccountPreferencesRequest {}
export const GetAccountPreferencesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/get-account-preferences" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountPreferencesRequest",
}) as any as S.Schema<GetAccountPreferencesRequest>;
export type SnsTopicArnList = string[];
export const SnsTopicArnList = S.Array(S.String);
export type GuardrailPolicyArnList = string[];
export const GuardrailPolicyArnList = S.Array(S.String);
export interface Tag {
  TagKey: string;
  TagValue: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ TagKey: S.String, TagValue: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateToConfigurationRequest {
  Resource: string;
  ChatConfiguration: string;
}
export const AssociateToConfigurationRequest = S.suspend(() =>
  S.Struct({ Resource: S.String, ChatConfiguration: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/associate-to-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateToConfigurationRequest",
}) as any as S.Schema<AssociateToConfigurationRequest>;
export interface AssociateToConfigurationResult {}
export const AssociateToConfigurationResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateToConfigurationResult",
}) as any as S.Schema<AssociateToConfigurationResult>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateTeamsChannelConfigurationRequest {
  ChannelId: string;
  ChannelName?: string | redacted.Redacted<string>;
  TeamId: string;
  TeamName?: string | redacted.Redacted<string>;
  TenantId: string;
  SnsTopicArns?: string[];
  IamRoleArn: string;
  ConfigurationName: string;
  LoggingLevel?: string;
  GuardrailPolicyArns?: string[];
  UserAuthorizationRequired?: boolean;
  Tags?: Tag[];
}
export const CreateTeamsChannelConfigurationRequest = S.suspend(() =>
  S.Struct({
    ChannelId: S.String,
    ChannelName: S.optional(SensitiveString),
    TeamId: S.String,
    TeamName: S.optional(SensitiveString),
    TenantId: S.String,
    SnsTopicArns: S.optional(SnsTopicArnList),
    IamRoleArn: S.String,
    ConfigurationName: S.String,
    LoggingLevel: S.optional(S.String),
    GuardrailPolicyArns: S.optional(GuardrailPolicyArnList),
    UserAuthorizationRequired: S.optional(S.Boolean),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/create-ms-teams-channel-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTeamsChannelConfigurationRequest",
}) as any as S.Schema<CreateTeamsChannelConfigurationRequest>;
export interface CreateSlackChannelConfigurationRequest {
  SlackTeamId: string;
  SlackChannelId: string;
  SlackChannelName?: string | redacted.Redacted<string>;
  SnsTopicArns?: string[];
  IamRoleArn: string;
  ConfigurationName: string;
  LoggingLevel?: string;
  GuardrailPolicyArns?: string[];
  UserAuthorizationRequired?: boolean;
  Tags?: Tag[];
}
export const CreateSlackChannelConfigurationRequest = S.suspend(() =>
  S.Struct({
    SlackTeamId: S.String,
    SlackChannelId: S.String,
    SlackChannelName: S.optional(SensitiveString),
    SnsTopicArns: S.optional(SnsTopicArnList),
    IamRoleArn: S.String,
    ConfigurationName: S.String,
    LoggingLevel: S.optional(S.String),
    GuardrailPolicyArns: S.optional(GuardrailPolicyArnList),
    UserAuthorizationRequired: S.optional(S.Boolean),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/create-slack-channel-configuration" }),
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
export interface DeleteChimeWebhookConfigurationRequest {
  ChatConfigurationArn: string;
}
export const DeleteChimeWebhookConfigurationRequest = S.suspend(() =>
  S.Struct({ ChatConfigurationArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/delete-chime-webhook-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChimeWebhookConfigurationRequest",
}) as any as S.Schema<DeleteChimeWebhookConfigurationRequest>;
export interface DeleteChimeWebhookConfigurationResult {}
export const DeleteChimeWebhookConfigurationResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteChimeWebhookConfigurationResult",
}) as any as S.Schema<DeleteChimeWebhookConfigurationResult>;
export interface DeleteTeamsChannelConfigurationRequest {
  ChatConfigurationArn: string;
}
export const DeleteTeamsChannelConfigurationRequest = S.suspend(() =>
  S.Struct({ ChatConfigurationArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/delete-ms-teams-channel-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTeamsChannelConfigurationRequest",
}) as any as S.Schema<DeleteTeamsChannelConfigurationRequest>;
export interface DeleteTeamsChannelConfigurationResult {}
export const DeleteTeamsChannelConfigurationResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTeamsChannelConfigurationResult",
}) as any as S.Schema<DeleteTeamsChannelConfigurationResult>;
export interface DeleteTeamsConfiguredTeamRequest {
  TeamId: string;
}
export const DeleteTeamsConfiguredTeamRequest = S.suspend(() =>
  S.Struct({ TeamId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/delete-ms-teams-configured-teams" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTeamsConfiguredTeamRequest",
}) as any as S.Schema<DeleteTeamsConfiguredTeamRequest>;
export interface DeleteTeamsConfiguredTeamResult {}
export const DeleteTeamsConfiguredTeamResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTeamsConfiguredTeamResult",
}) as any as S.Schema<DeleteTeamsConfiguredTeamResult>;
export interface DeleteMicrosoftTeamsUserIdentityRequest {
  ChatConfigurationArn: string;
  UserId: string;
}
export const DeleteMicrosoftTeamsUserIdentityRequest = S.suspend(() =>
  S.Struct({ ChatConfigurationArn: S.String, UserId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/delete-ms-teams-user-identity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMicrosoftTeamsUserIdentityRequest",
}) as any as S.Schema<DeleteMicrosoftTeamsUserIdentityRequest>;
export interface DeleteMicrosoftTeamsUserIdentityResult {}
export const DeleteMicrosoftTeamsUserIdentityResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteMicrosoftTeamsUserIdentityResult",
}) as any as S.Schema<DeleteMicrosoftTeamsUserIdentityResult>;
export interface DeleteSlackChannelConfigurationRequest {
  ChatConfigurationArn: string;
}
export const DeleteSlackChannelConfigurationRequest = S.suspend(() =>
  S.Struct({ ChatConfigurationArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/delete-slack-channel-configuration" }),
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
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSlackChannelConfigurationResult",
}) as any as S.Schema<DeleteSlackChannelConfigurationResult>;
export interface DeleteSlackUserIdentityRequest {
  ChatConfigurationArn: string;
  SlackTeamId: string;
  SlackUserId: string;
}
export const DeleteSlackUserIdentityRequest = S.suspend(() =>
  S.Struct({
    ChatConfigurationArn: S.String,
    SlackTeamId: S.String,
    SlackUserId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/delete-slack-user-identity" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSlackUserIdentityRequest",
}) as any as S.Schema<DeleteSlackUserIdentityRequest>;
export interface DeleteSlackUserIdentityResult {}
export const DeleteSlackUserIdentityResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSlackUserIdentityResult",
}) as any as S.Schema<DeleteSlackUserIdentityResult>;
export interface DeleteSlackWorkspaceAuthorizationRequest {
  SlackTeamId: string;
}
export const DeleteSlackWorkspaceAuthorizationRequest = S.suspend(() =>
  S.Struct({ SlackTeamId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/delete-slack-workspace-authorization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSlackWorkspaceAuthorizationRequest",
}) as any as S.Schema<DeleteSlackWorkspaceAuthorizationRequest>;
export interface DeleteSlackWorkspaceAuthorizationResult {}
export const DeleteSlackWorkspaceAuthorizationResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSlackWorkspaceAuthorizationResult",
}) as any as S.Schema<DeleteSlackWorkspaceAuthorizationResult>;
export interface DescribeChimeWebhookConfigurationsRequest {
  MaxResults?: number;
  NextToken?: string;
  ChatConfigurationArn?: string;
}
export const DescribeChimeWebhookConfigurationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ChatConfigurationArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describe-chime-webhook-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChimeWebhookConfigurationsRequest",
}) as any as S.Schema<DescribeChimeWebhookConfigurationsRequest>;
export interface DescribeSlackChannelConfigurationsRequest {
  MaxResults?: number;
  NextToken?: string;
  ChatConfigurationArn?: string;
}
export const DescribeSlackChannelConfigurationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ChatConfigurationArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describe-slack-channel-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSlackChannelConfigurationsRequest",
}) as any as S.Schema<DescribeSlackChannelConfigurationsRequest>;
export interface DescribeSlackUserIdentitiesRequest {
  ChatConfigurationArn?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeSlackUserIdentitiesRequest = S.suspend(() =>
  S.Struct({
    ChatConfigurationArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describe-slack-user-identities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSlackUserIdentitiesRequest",
}) as any as S.Schema<DescribeSlackUserIdentitiesRequest>;
export interface DescribeSlackWorkspacesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeSlackWorkspacesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/describe-slack-workspaces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSlackWorkspacesRequest",
}) as any as S.Schema<DescribeSlackWorkspacesRequest>;
export interface DisassociateFromConfigurationRequest {
  Resource: string;
  ChatConfiguration: string;
}
export const DisassociateFromConfigurationRequest = S.suspend(() =>
  S.Struct({ Resource: S.String, ChatConfiguration: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/disassociate-from-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateFromConfigurationRequest",
}) as any as S.Schema<DisassociateFromConfigurationRequest>;
export interface DisassociateFromConfigurationResult {}
export const DisassociateFromConfigurationResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateFromConfigurationResult",
}) as any as S.Schema<DisassociateFromConfigurationResult>;
export interface GetTeamsChannelConfigurationRequest {
  ChatConfigurationArn: string;
}
export const GetTeamsChannelConfigurationRequest = S.suspend(() =>
  S.Struct({ ChatConfigurationArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/get-ms-teams-channel-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTeamsChannelConfigurationRequest",
}) as any as S.Schema<GetTeamsChannelConfigurationRequest>;
export interface ListAssociationsRequest {
  ChatConfiguration: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAssociationsRequest = S.suspend(() =>
  S.Struct({
    ChatConfiguration: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/list-associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssociationsRequest",
}) as any as S.Schema<ListAssociationsRequest>;
export interface ListTeamsChannelConfigurationsRequest {
  MaxResults?: number;
  NextToken?: string;
  TeamId?: string;
}
export const ListTeamsChannelConfigurationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    TeamId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/list-ms-teams-channel-configurations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTeamsChannelConfigurationsRequest",
}) as any as S.Schema<ListTeamsChannelConfigurationsRequest>;
export interface ListMicrosoftTeamsConfiguredTeamsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListMicrosoftTeamsConfiguredTeamsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/list-ms-teams-configured-teams" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMicrosoftTeamsConfiguredTeamsRequest",
}) as any as S.Schema<ListMicrosoftTeamsConfiguredTeamsRequest>;
export interface ListMicrosoftTeamsUserIdentitiesRequest {
  ChatConfigurationArn?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListMicrosoftTeamsUserIdentitiesRequest = S.suspend(() =>
  S.Struct({
    ChatConfigurationArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/list-ms-teams-user-identities" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMicrosoftTeamsUserIdentitiesRequest",
}) as any as S.Schema<ListMicrosoftTeamsUserIdentitiesRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/list-tags-for-resource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/tag-resource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/untag-resource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateAccountPreferencesRequest {
  UserAuthorizationRequired?: boolean;
  TrainingDataCollectionEnabled?: boolean;
}
export const UpdateAccountPreferencesRequest = S.suspend(() =>
  S.Struct({
    UserAuthorizationRequired: S.optional(S.Boolean),
    TrainingDataCollectionEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/update-account-preferences" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccountPreferencesRequest",
}) as any as S.Schema<UpdateAccountPreferencesRequest>;
export interface UpdateChimeWebhookConfigurationRequest {
  ChatConfigurationArn: string;
  WebhookDescription?: string | redacted.Redacted<string>;
  WebhookUrl?: string | redacted.Redacted<string>;
  SnsTopicArns?: string[];
  IamRoleArn?: string;
  LoggingLevel?: string;
}
export const UpdateChimeWebhookConfigurationRequest = S.suspend(() =>
  S.Struct({
    ChatConfigurationArn: S.String,
    WebhookDescription: S.optional(SensitiveString),
    WebhookUrl: S.optional(SensitiveString),
    SnsTopicArns: S.optional(SnsTopicArnList),
    IamRoleArn: S.optional(S.String),
    LoggingLevel: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/update-chime-webhook-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChimeWebhookConfigurationRequest",
}) as any as S.Schema<UpdateChimeWebhookConfigurationRequest>;
export interface UpdateTeamsChannelConfigurationRequest {
  ChatConfigurationArn: string;
  ChannelId: string;
  ChannelName?: string | redacted.Redacted<string>;
  SnsTopicArns?: string[];
  IamRoleArn?: string;
  LoggingLevel?: string;
  GuardrailPolicyArns?: string[];
  UserAuthorizationRequired?: boolean;
}
export const UpdateTeamsChannelConfigurationRequest = S.suspend(() =>
  S.Struct({
    ChatConfigurationArn: S.String,
    ChannelId: S.String,
    ChannelName: S.optional(SensitiveString),
    SnsTopicArns: S.optional(SnsTopicArnList),
    IamRoleArn: S.optional(S.String),
    LoggingLevel: S.optional(S.String),
    GuardrailPolicyArns: S.optional(GuardrailPolicyArnList),
    UserAuthorizationRequired: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/update-ms-teams-channel-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTeamsChannelConfigurationRequest",
}) as any as S.Schema<UpdateTeamsChannelConfigurationRequest>;
export interface UpdateSlackChannelConfigurationRequest {
  ChatConfigurationArn: string;
  SlackChannelId: string;
  SlackChannelName?: string | redacted.Redacted<string>;
  SnsTopicArns?: string[];
  IamRoleArn?: string;
  LoggingLevel?: string;
  GuardrailPolicyArns?: string[];
  UserAuthorizationRequired?: boolean;
}
export const UpdateSlackChannelConfigurationRequest = S.suspend(() =>
  S.Struct({
    ChatConfigurationArn: S.String,
    SlackChannelId: S.String,
    SlackChannelName: S.optional(SensitiveString),
    SnsTopicArns: S.optional(SnsTopicArnList),
    IamRoleArn: S.optional(S.String),
    LoggingLevel: S.optional(S.String),
    GuardrailPolicyArns: S.optional(GuardrailPolicyArnList),
    UserAuthorizationRequired: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/update-slack-channel-configuration" }),
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
export interface GetCustomActionRequest {
  CustomActionArn: string;
}
export const GetCustomActionRequest = S.suspend(() =>
  S.Struct({ CustomActionArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/get-custom-action" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCustomActionRequest",
}) as any as S.Schema<GetCustomActionRequest>;
export interface CustomActionDefinition {
  CommandText: string;
}
export const CustomActionDefinition = S.suspend(() =>
  S.Struct({ CommandText: S.String }),
).annotations({
  identifier: "CustomActionDefinition",
}) as any as S.Schema<CustomActionDefinition>;
export type CustomActionAttachmentCriteriaOperator =
  | "HAS_VALUE"
  | "EQUALS"
  | (string & {});
export const CustomActionAttachmentCriteriaOperator = S.String;
export interface CustomActionAttachmentCriteria {
  Operator: CustomActionAttachmentCriteriaOperator;
  VariableName: string;
  Value?: string;
}
export const CustomActionAttachmentCriteria = S.suspend(() =>
  S.Struct({
    Operator: CustomActionAttachmentCriteriaOperator,
    VariableName: S.String,
    Value: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomActionAttachmentCriteria",
}) as any as S.Schema<CustomActionAttachmentCriteria>;
export type CustomActionAttachmentCriteriaList =
  CustomActionAttachmentCriteria[];
export const CustomActionAttachmentCriteriaList = S.Array(
  CustomActionAttachmentCriteria,
);
export type CustomActionAttachmentVariables = {
  [key: string]: string | undefined;
};
export const CustomActionAttachmentVariables = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CustomActionAttachment {
  NotificationType?: string;
  ButtonText?: string;
  Criteria?: CustomActionAttachmentCriteria[];
  Variables?: { [key: string]: string | undefined };
}
export const CustomActionAttachment = S.suspend(() =>
  S.Struct({
    NotificationType: S.optional(S.String),
    ButtonText: S.optional(S.String),
    Criteria: S.optional(CustomActionAttachmentCriteriaList),
    Variables: S.optional(CustomActionAttachmentVariables),
  }),
).annotations({
  identifier: "CustomActionAttachment",
}) as any as S.Schema<CustomActionAttachment>;
export type CustomActionAttachmentList = CustomActionAttachment[];
export const CustomActionAttachmentList = S.Array(CustomActionAttachment);
export interface UpdateCustomActionRequest {
  CustomActionArn: string;
  Definition: CustomActionDefinition;
  AliasName?: string;
  Attachments?: CustomActionAttachment[];
}
export const UpdateCustomActionRequest = S.suspend(() =>
  S.Struct({
    CustomActionArn: S.String,
    Definition: CustomActionDefinition,
    AliasName: S.optional(S.String),
    Attachments: S.optional(CustomActionAttachmentList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/update-custom-action" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCustomActionRequest",
}) as any as S.Schema<UpdateCustomActionRequest>;
export interface DeleteCustomActionRequest {
  CustomActionArn: string;
}
export const DeleteCustomActionRequest = S.suspend(() =>
  S.Struct({ CustomActionArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/delete-custom-action" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomActionRequest",
}) as any as S.Schema<DeleteCustomActionRequest>;
export interface DeleteCustomActionResult {}
export const DeleteCustomActionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCustomActionResult",
}) as any as S.Schema<DeleteCustomActionResult>;
export interface ListCustomActionsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListCustomActionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/list-custom-actions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomActionsRequest",
}) as any as S.Schema<ListCustomActionsRequest>;
export interface SlackChannelConfiguration {
  SlackTeamName: string;
  SlackTeamId: string;
  SlackChannelId: string;
  SlackChannelName: string | redacted.Redacted<string>;
  ChatConfigurationArn: string;
  IamRoleArn: string;
  SnsTopicArns: string[];
  ConfigurationName?: string;
  LoggingLevel?: string;
  GuardrailPolicyArns?: string[];
  UserAuthorizationRequired?: boolean;
  Tags?: Tag[];
  State?: string;
  StateReason?: string;
}
export const SlackChannelConfiguration = S.suspend(() =>
  S.Struct({
    SlackTeamName: S.String,
    SlackTeamId: S.String,
    SlackChannelId: S.String,
    SlackChannelName: SensitiveString,
    ChatConfigurationArn: S.String,
    IamRoleArn: S.String,
    SnsTopicArns: SnsTopicArnList,
    ConfigurationName: S.optional(S.String),
    LoggingLevel: S.optional(S.String),
    GuardrailPolicyArns: S.optional(GuardrailPolicyArnList),
    UserAuthorizationRequired: S.optional(S.Boolean),
    Tags: S.optional(Tags),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
  }),
).annotations({
  identifier: "SlackChannelConfiguration",
}) as any as S.Schema<SlackChannelConfiguration>;
export type SlackChannelConfigurationList = SlackChannelConfiguration[];
export const SlackChannelConfigurationList = S.Array(SlackChannelConfiguration);
export interface AccountPreferences {
  UserAuthorizationRequired?: boolean;
  TrainingDataCollectionEnabled?: boolean;
}
export const AccountPreferences = S.suspend(() =>
  S.Struct({
    UserAuthorizationRequired: S.optional(S.Boolean),
    TrainingDataCollectionEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AccountPreferences",
}) as any as S.Schema<AccountPreferences>;
export interface TeamsChannelConfiguration {
  ChannelId: string;
  ChannelName?: string | redacted.Redacted<string>;
  TeamId: string;
  TeamName?: string | redacted.Redacted<string>;
  TenantId: string;
  ChatConfigurationArn: string;
  IamRoleArn: string;
  SnsTopicArns: string[];
  ConfigurationName?: string;
  LoggingLevel?: string;
  GuardrailPolicyArns?: string[];
  UserAuthorizationRequired?: boolean;
  Tags?: Tag[];
  State?: string;
  StateReason?: string;
}
export const TeamsChannelConfiguration = S.suspend(() =>
  S.Struct({
    ChannelId: S.String,
    ChannelName: S.optional(SensitiveString),
    TeamId: S.String,
    TeamName: S.optional(SensitiveString),
    TenantId: S.String,
    ChatConfigurationArn: S.String,
    IamRoleArn: S.String,
    SnsTopicArns: SnsTopicArnList,
    ConfigurationName: S.optional(S.String),
    LoggingLevel: S.optional(S.String),
    GuardrailPolicyArns: S.optional(GuardrailPolicyArnList),
    UserAuthorizationRequired: S.optional(S.Boolean),
    Tags: S.optional(Tags),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
  }),
).annotations({
  identifier: "TeamsChannelConfiguration",
}) as any as S.Schema<TeamsChannelConfiguration>;
export type TeamChannelConfigurationsList = TeamsChannelConfiguration[];
export const TeamChannelConfigurationsList = S.Array(TeamsChannelConfiguration);
export type CustomActionArnList = string[];
export const CustomActionArnList = S.Array(S.String);
export interface CreateChimeWebhookConfigurationRequest {
  WebhookDescription: string | redacted.Redacted<string>;
  WebhookUrl: string | redacted.Redacted<string>;
  SnsTopicArns: string[];
  IamRoleArn: string;
  ConfigurationName: string;
  LoggingLevel?: string;
  Tags?: Tag[];
}
export const CreateChimeWebhookConfigurationRequest = S.suspend(() =>
  S.Struct({
    WebhookDescription: SensitiveString,
    WebhookUrl: SensitiveString,
    SnsTopicArns: SnsTopicArnList,
    IamRoleArn: S.String,
    ConfigurationName: S.String,
    LoggingLevel: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/create-chime-webhook-configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChimeWebhookConfigurationRequest",
}) as any as S.Schema<CreateChimeWebhookConfigurationRequest>;
export interface DescribeSlackChannelConfigurationsResult {
  NextToken?: string;
  SlackChannelConfigurations?: SlackChannelConfiguration[];
}
export const DescribeSlackChannelConfigurationsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    SlackChannelConfigurations: S.optional(SlackChannelConfigurationList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSlackChannelConfigurationsResult",
}) as any as S.Schema<DescribeSlackChannelConfigurationsResult>;
export interface GetAccountPreferencesResult {
  AccountPreferences?: AccountPreferences;
}
export const GetAccountPreferencesResult = S.suspend(() =>
  S.Struct({ AccountPreferences: S.optional(AccountPreferences) }).pipe(ns),
).annotations({
  identifier: "GetAccountPreferencesResult",
}) as any as S.Schema<GetAccountPreferencesResult>;
export interface GetTeamsChannelConfigurationResult {
  ChannelConfiguration?: TeamsChannelConfiguration;
}
export const GetTeamsChannelConfigurationResult = S.suspend(() =>
  S.Struct({
    ChannelConfiguration: S.optional(TeamsChannelConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "GetTeamsChannelConfigurationResult",
}) as any as S.Schema<GetTeamsChannelConfigurationResult>;
export interface ListTeamsChannelConfigurationsResult {
  NextToken?: string;
  TeamChannelConfigurations?: TeamsChannelConfiguration[];
}
export const ListTeamsChannelConfigurationsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    TeamChannelConfigurations: S.optional(TeamChannelConfigurationsList),
  }).pipe(ns),
).annotations({
  identifier: "ListTeamsChannelConfigurationsResult",
}) as any as S.Schema<ListTeamsChannelConfigurationsResult>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateAccountPreferencesResult {
  AccountPreferences?: AccountPreferences;
}
export const UpdateAccountPreferencesResult = S.suspend(() =>
  S.Struct({ AccountPreferences: S.optional(AccountPreferences) }).pipe(ns),
).annotations({
  identifier: "UpdateAccountPreferencesResult",
}) as any as S.Schema<UpdateAccountPreferencesResult>;
export interface ChimeWebhookConfiguration {
  WebhookDescription: string | redacted.Redacted<string>;
  ChatConfigurationArn: string;
  IamRoleArn: string;
  SnsTopicArns: string[];
  ConfigurationName?: string;
  LoggingLevel?: string;
  Tags?: Tag[];
  State?: string;
  StateReason?: string;
}
export const ChimeWebhookConfiguration = S.suspend(() =>
  S.Struct({
    WebhookDescription: SensitiveString,
    ChatConfigurationArn: S.String,
    IamRoleArn: S.String,
    SnsTopicArns: SnsTopicArnList,
    ConfigurationName: S.optional(S.String),
    LoggingLevel: S.optional(S.String),
    Tags: S.optional(Tags),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ChimeWebhookConfiguration",
}) as any as S.Schema<ChimeWebhookConfiguration>;
export interface UpdateChimeWebhookConfigurationResult {
  WebhookConfiguration?: ChimeWebhookConfiguration;
}
export const UpdateChimeWebhookConfigurationResult = S.suspend(() =>
  S.Struct({
    WebhookConfiguration: S.optional(ChimeWebhookConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "UpdateChimeWebhookConfigurationResult",
}) as any as S.Schema<UpdateChimeWebhookConfigurationResult>;
export interface UpdateTeamsChannelConfigurationResult {
  ChannelConfiguration?: TeamsChannelConfiguration;
}
export const UpdateTeamsChannelConfigurationResult = S.suspend(() =>
  S.Struct({
    ChannelConfiguration: S.optional(TeamsChannelConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "UpdateTeamsChannelConfigurationResult",
}) as any as S.Schema<UpdateTeamsChannelConfigurationResult>;
export interface UpdateSlackChannelConfigurationResult {
  ChannelConfiguration?: SlackChannelConfiguration;
}
export const UpdateSlackChannelConfigurationResult = S.suspend(() =>
  S.Struct({
    ChannelConfiguration: S.optional(SlackChannelConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "UpdateSlackChannelConfigurationResult",
}) as any as S.Schema<UpdateSlackChannelConfigurationResult>;
export interface UpdateCustomActionResult {
  CustomActionArn: string;
}
export const UpdateCustomActionResult = S.suspend(() =>
  S.Struct({ CustomActionArn: S.String }).pipe(ns),
).annotations({
  identifier: "UpdateCustomActionResult",
}) as any as S.Schema<UpdateCustomActionResult>;
export interface ListCustomActionsResult {
  CustomActions: string[];
  NextToken?: string;
}
export const ListCustomActionsResult = S.suspend(() =>
  S.Struct({
    CustomActions: CustomActionArnList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListCustomActionsResult",
}) as any as S.Schema<ListCustomActionsResult>;
export type ChimeWebhookConfigurationList = ChimeWebhookConfiguration[];
export const ChimeWebhookConfigurationList = S.Array(ChimeWebhookConfiguration);
export interface SlackUserIdentity {
  IamRoleArn: string;
  ChatConfigurationArn: string;
  SlackTeamId: string;
  SlackUserId: string;
  AwsUserIdentity?: string;
}
export const SlackUserIdentity = S.suspend(() =>
  S.Struct({
    IamRoleArn: S.String,
    ChatConfigurationArn: S.String,
    SlackTeamId: S.String,
    SlackUserId: S.String,
    AwsUserIdentity: S.optional(S.String),
  }),
).annotations({
  identifier: "SlackUserIdentity",
}) as any as S.Schema<SlackUserIdentity>;
export type SlackUserIdentitiesList = SlackUserIdentity[];
export const SlackUserIdentitiesList = S.Array(SlackUserIdentity);
export interface SlackWorkspace {
  SlackTeamId: string;
  SlackTeamName: string;
  State?: string;
  StateReason?: string;
}
export const SlackWorkspace = S.suspend(() =>
  S.Struct({
    SlackTeamId: S.String,
    SlackTeamName: S.String,
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
  }),
).annotations({
  identifier: "SlackWorkspace",
}) as any as S.Schema<SlackWorkspace>;
export type SlackWorkspacesList = SlackWorkspace[];
export const SlackWorkspacesList = S.Array(SlackWorkspace);
export interface AssociationListing {
  Resource: string;
}
export const AssociationListing = S.suspend(() =>
  S.Struct({ Resource: S.String }),
).annotations({
  identifier: "AssociationListing",
}) as any as S.Schema<AssociationListing>;
export type AssociationList = AssociationListing[];
export const AssociationList = S.Array(AssociationListing);
export interface ConfiguredTeam {
  TenantId: string;
  TeamId: string;
  TeamName?: string;
  State?: string;
  StateReason?: string;
}
export const ConfiguredTeam = S.suspend(() =>
  S.Struct({
    TenantId: S.String,
    TeamId: S.String,
    TeamName: S.optional(S.String),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfiguredTeam",
}) as any as S.Schema<ConfiguredTeam>;
export type ConfiguredTeamsList = ConfiguredTeam[];
export const ConfiguredTeamsList = S.Array(ConfiguredTeam);
export interface TeamsUserIdentity {
  IamRoleArn: string;
  ChatConfigurationArn: string;
  TeamId: string;
  UserId?: string;
  AwsUserIdentity?: string;
  TeamsChannelId?: string;
  TeamsTenantId?: string;
}
export const TeamsUserIdentity = S.suspend(() =>
  S.Struct({
    IamRoleArn: S.String,
    ChatConfigurationArn: S.String,
    TeamId: S.String,
    UserId: S.optional(S.String),
    AwsUserIdentity: S.optional(S.String),
    TeamsChannelId: S.optional(S.String),
    TeamsTenantId: S.optional(S.String),
  }),
).annotations({
  identifier: "TeamsUserIdentity",
}) as any as S.Schema<TeamsUserIdentity>;
export type TeamsUserIdentitiesList = TeamsUserIdentity[];
export const TeamsUserIdentitiesList = S.Array(TeamsUserIdentity);
export interface CustomAction {
  CustomActionArn: string;
  Definition: CustomActionDefinition;
  AliasName?: string;
  Attachments?: CustomActionAttachment[];
  ActionName?: string;
}
export const CustomAction = S.suspend(() =>
  S.Struct({
    CustomActionArn: S.String,
    Definition: CustomActionDefinition,
    AliasName: S.optional(S.String),
    Attachments: S.optional(CustomActionAttachmentList),
    ActionName: S.optional(S.String),
  }),
).annotations({ identifier: "CustomAction" }) as any as S.Schema<CustomAction>;
export interface CreateChimeWebhookConfigurationResult {
  WebhookConfiguration?: ChimeWebhookConfiguration;
}
export const CreateChimeWebhookConfigurationResult = S.suspend(() =>
  S.Struct({
    WebhookConfiguration: S.optional(ChimeWebhookConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "CreateChimeWebhookConfigurationResult",
}) as any as S.Schema<CreateChimeWebhookConfigurationResult>;
export interface CreateTeamsChannelConfigurationResult {
  ChannelConfiguration?: TeamsChannelConfiguration;
}
export const CreateTeamsChannelConfigurationResult = S.suspend(() =>
  S.Struct({
    ChannelConfiguration: S.optional(TeamsChannelConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "CreateTeamsChannelConfigurationResult",
}) as any as S.Schema<CreateTeamsChannelConfigurationResult>;
export interface CreateSlackChannelConfigurationResult {
  ChannelConfiguration?: SlackChannelConfiguration;
}
export const CreateSlackChannelConfigurationResult = S.suspend(() =>
  S.Struct({
    ChannelConfiguration: S.optional(SlackChannelConfiguration),
  }).pipe(ns),
).annotations({
  identifier: "CreateSlackChannelConfigurationResult",
}) as any as S.Schema<CreateSlackChannelConfigurationResult>;
export interface DescribeChimeWebhookConfigurationsResult {
  NextToken?: string;
  WebhookConfigurations?: ChimeWebhookConfiguration[];
}
export const DescribeChimeWebhookConfigurationsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    WebhookConfigurations: S.optional(ChimeWebhookConfigurationList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeChimeWebhookConfigurationsResult",
}) as any as S.Schema<DescribeChimeWebhookConfigurationsResult>;
export interface DescribeSlackUserIdentitiesResult {
  SlackUserIdentities?: SlackUserIdentity[];
  NextToken?: string;
}
export const DescribeSlackUserIdentitiesResult = S.suspend(() =>
  S.Struct({
    SlackUserIdentities: S.optional(SlackUserIdentitiesList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSlackUserIdentitiesResult",
}) as any as S.Schema<DescribeSlackUserIdentitiesResult>;
export interface DescribeSlackWorkspacesResult {
  SlackWorkspaces?: SlackWorkspace[];
  NextToken?: string;
}
export const DescribeSlackWorkspacesResult = S.suspend(() =>
  S.Struct({
    SlackWorkspaces: S.optional(SlackWorkspacesList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSlackWorkspacesResult",
}) as any as S.Schema<DescribeSlackWorkspacesResult>;
export interface ListAssociationsResult {
  Associations: AssociationListing[];
  NextToken?: string;
}
export const ListAssociationsResult = S.suspend(() =>
  S.Struct({
    Associations: AssociationList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAssociationsResult",
}) as any as S.Schema<ListAssociationsResult>;
export interface ListMicrosoftTeamsConfiguredTeamsResult {
  ConfiguredTeams?: ConfiguredTeam[];
  NextToken?: string;
}
export const ListMicrosoftTeamsConfiguredTeamsResult = S.suspend(() =>
  S.Struct({
    ConfiguredTeams: S.optional(ConfiguredTeamsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListMicrosoftTeamsConfiguredTeamsResult",
}) as any as S.Schema<ListMicrosoftTeamsConfiguredTeamsResult>;
export interface ListMicrosoftTeamsUserIdentitiesResult {
  TeamsUserIdentities?: TeamsUserIdentity[];
  NextToken?: string;
}
export const ListMicrosoftTeamsUserIdentitiesResult = S.suspend(() =>
  S.Struct({
    TeamsUserIdentities: S.optional(TeamsUserIdentitiesList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListMicrosoftTeamsUserIdentitiesResult",
}) as any as S.Schema<ListMicrosoftTeamsUserIdentitiesResult>;
export interface CreateCustomActionRequest {
  Definition: CustomActionDefinition;
  AliasName?: string;
  Attachments?: CustomActionAttachment[];
  Tags?: Tag[];
  ClientToken?: string;
  ActionName: string;
}
export const CreateCustomActionRequest = S.suspend(() =>
  S.Struct({
    Definition: CustomActionDefinition,
    AliasName: S.optional(S.String),
    Attachments: S.optional(CustomActionAttachmentList),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ActionName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/create-custom-action" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomActionRequest",
}) as any as S.Schema<CreateCustomActionRequest>;
export interface GetCustomActionResult {
  CustomAction?: CustomAction;
}
export const GetCustomActionResult = S.suspend(() =>
  S.Struct({ CustomAction: S.optional(CustomAction) }).pipe(ns),
).annotations({
  identifier: "GetCustomActionResult",
}) as any as S.Schema<GetCustomActionResult>;
export interface CreateCustomActionResult {
  CustomActionArn: string;
}
export const CreateCustomActionResult = S.suspend(() =>
  S.Struct({ CustomActionArn: S.String }).pipe(ns),
).annotations({
  identifier: "CreateCustomActionResult",
}) as any as S.Schema<CreateCustomActionResult>;

//# Errors
export class InternalServiceError extends S.TaggedError<InternalServiceError>()(
  "InternalServiceError",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DeleteChimeWebhookConfigurationException extends S.TaggedError<DeleteChimeWebhookConfigurationException>()(
  "DeleteChimeWebhookConfigurationException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DeleteTeamsChannelConfigurationException extends S.TaggedError<DeleteTeamsChannelConfigurationException>()(
  "DeleteTeamsChannelConfigurationException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DeleteTeamsConfiguredTeamException extends S.TaggedError<DeleteTeamsConfiguredTeamException>()(
  "DeleteTeamsConfiguredTeamException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DeleteMicrosoftTeamsUserIdentityException extends S.TaggedError<DeleteMicrosoftTeamsUserIdentityException>()(
  "DeleteMicrosoftTeamsUserIdentityException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DeleteSlackChannelConfigurationException extends S.TaggedError<DeleteSlackChannelConfigurationException>()(
  "DeleteSlackChannelConfigurationException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DeleteSlackUserIdentityException extends S.TaggedError<DeleteSlackUserIdentityException>()(
  "DeleteSlackUserIdentityException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DeleteSlackWorkspaceAuthorizationFault extends S.TaggedError<DeleteSlackWorkspaceAuthorizationFault>()(
  "DeleteSlackWorkspaceAuthorizationFault",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DescribeSlackChannelConfigurationsException extends S.TaggedError<DescribeSlackChannelConfigurationsException>()(
  "DescribeSlackChannelConfigurationsException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class GetAccountPreferencesException extends S.TaggedError<GetAccountPreferencesException>()(
  "GetAccountPreferencesException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class GetTeamsChannelConfigurationException extends S.TaggedError<GetTeamsChannelConfigurationException>()(
  "GetTeamsChannelConfigurationException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class DescribeChimeWebhookConfigurationsException extends S.TaggedError<DescribeChimeWebhookConfigurationsException>()(
  "DescribeChimeWebhookConfigurationsException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DescribeSlackUserIdentitiesException extends S.TaggedError<DescribeSlackUserIdentitiesException>()(
  "DescribeSlackUserIdentitiesException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DescribeSlackWorkspacesException extends S.TaggedError<DescribeSlackWorkspacesException>()(
  "DescribeSlackWorkspacesException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ListMicrosoftTeamsConfiguredTeamsException extends S.TaggedError<ListMicrosoftTeamsConfiguredTeamsException>()(
  "ListMicrosoftTeamsConfiguredTeamsException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ListMicrosoftTeamsUserIdentitiesException extends S.TaggedError<ListMicrosoftTeamsUserIdentitiesException>()(
  "ListMicrosoftTeamsUserIdentitiesException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ListTeamsChannelConfigurationsException extends S.TaggedError<ListTeamsChannelConfigurationsException>()(
  "ListTeamsChannelConfigurationsException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class UpdateAccountPreferencesException extends S.TaggedError<UpdateAccountPreferencesException>()(
  "UpdateAccountPreferencesException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class UpdateChimeWebhookConfigurationException extends S.TaggedError<UpdateChimeWebhookConfigurationException>()(
  "UpdateChimeWebhookConfigurationException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class UpdateTeamsChannelConfigurationException extends S.TaggedError<UpdateTeamsChannelConfigurationException>()(
  "UpdateTeamsChannelConfigurationException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class UpdateSlackChannelConfigurationException extends S.TaggedError<UpdateSlackChannelConfigurationException>()(
  "UpdateSlackChannelConfigurationException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class CreateChimeWebhookConfigurationException extends S.TaggedError<CreateChimeWebhookConfigurationException>()(
  "CreateChimeWebhookConfigurationException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class CreateTeamsChannelConfigurationException extends S.TaggedError<CreateTeamsChannelConfigurationException>()(
  "CreateTeamsChannelConfigurationException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class CreateSlackChannelConfigurationException extends S.TaggedError<CreateSlackChannelConfigurationException>()(
  "CreateSlackChannelConfigurationException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists Slack channel configurations optionally filtered by ChatConfigurationArn
 */
export const describeSlackChannelConfigurations: {
  (
    input: DescribeSlackChannelConfigurationsRequest,
  ): effect.Effect<
    DescribeSlackChannelConfigurationsResult,
    | DescribeSlackChannelConfigurationsException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSlackChannelConfigurationsRequest,
  ) => stream.Stream<
    DescribeSlackChannelConfigurationsResult,
    | DescribeSlackChannelConfigurationsException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSlackChannelConfigurationsRequest,
  ) => stream.Stream<
    SlackChannelConfiguration,
    | DescribeSlackChannelConfigurationsException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSlackChannelConfigurationsRequest,
  output: DescribeSlackChannelConfigurationsResult,
  errors: [
    DescribeSlackChannelConfigurationsException,
    InvalidParameterException,
    InvalidRequestException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SlackChannelConfigurations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns AWS Chatbot account preferences.
 */
export const getAccountPreferences: (
  input: GetAccountPreferencesRequest,
) => effect.Effect<
  GetAccountPreferencesResult,
  GetAccountPreferencesException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountPreferencesRequest,
  output: GetAccountPreferencesResult,
  errors: [GetAccountPreferencesException, InvalidRequestException],
}));
/**
 * Returns a Microsoft Teams channel configuration in an AWS account.
 */
export const getMicrosoftTeamsChannelConfiguration: (
  input: GetTeamsChannelConfigurationRequest,
) => effect.Effect<
  GetTeamsChannelConfigurationResult,
  | GetTeamsChannelConfigurationException
  | InvalidParameterException
  | InvalidRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTeamsChannelConfigurationRequest,
  output: GetTeamsChannelConfigurationResult,
  errors: [
    GetTeamsChannelConfigurationException,
    InvalidParameterException,
    InvalidRequestException,
  ],
}));
/**
 * Lists resources associated with a channel configuration.
 */
export const listAssociations: {
  (
    input: ListAssociationsRequest,
  ): effect.Effect<
    ListAssociationsResult,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssociationsRequest,
  ) => stream.Stream<
    ListAssociationsResult,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssociationsRequest,
  ) => stream.Stream<
    AssociationListing,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssociationsRequest,
  output: ListAssociationsResult,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Associations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes a Microsoft Teams channel configuration for AWS Chatbot
 */
export const deleteMicrosoftTeamsChannelConfiguration: (
  input: DeleteTeamsChannelConfigurationRequest,
) => effect.Effect<
  DeleteTeamsChannelConfigurationResult,
  | DeleteTeamsChannelConfigurationException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTeamsChannelConfigurationRequest,
  output: DeleteTeamsChannelConfigurationResult,
  errors: [
    DeleteTeamsChannelConfigurationException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the Microsoft Teams team authorization allowing for channels to be configured in that Microsoft Teams team. Note that the Microsoft Teams team must have no channels configured to remove it.
 */
export const deleteMicrosoftTeamsConfiguredTeam: (
  input: DeleteTeamsConfiguredTeamRequest,
) => effect.Effect<
  DeleteTeamsConfiguredTeamResult,
  DeleteTeamsConfiguredTeamException | InvalidParameterException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTeamsConfiguredTeamRequest,
  output: DeleteTeamsConfiguredTeamResult,
  errors: [DeleteTeamsConfiguredTeamException, InvalidParameterException],
}));
/**
 * Identifes a user level permission for a channel configuration.
 */
export const deleteMicrosoftTeamsUserIdentity: (
  input: DeleteMicrosoftTeamsUserIdentityRequest,
) => effect.Effect<
  DeleteMicrosoftTeamsUserIdentityResult,
  | DeleteMicrosoftTeamsUserIdentityException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMicrosoftTeamsUserIdentityRequest,
  output: DeleteMicrosoftTeamsUserIdentityResult,
  errors: [
    DeleteMicrosoftTeamsUserIdentityException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a Slack channel configuration for AWS Chatbot
 */
export const deleteSlackChannelConfiguration: (
  input: DeleteSlackChannelConfigurationRequest,
) => effect.Effect<
  DeleteSlackChannelConfigurationResult,
  | DeleteSlackChannelConfigurationException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSlackChannelConfigurationRequest,
  output: DeleteSlackChannelConfigurationResult,
  errors: [
    DeleteSlackChannelConfigurationException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a user level permission for a Slack channel configuration.
 */
export const deleteSlackUserIdentity: (
  input: DeleteSlackUserIdentityRequest,
) => effect.Effect<
  DeleteSlackUserIdentityResult,
  | DeleteSlackUserIdentityException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSlackUserIdentityRequest,
  output: DeleteSlackUserIdentityResult,
  errors: [
    DeleteSlackUserIdentityException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the Slack workspace authorization that allows channels to be configured in that workspace. This requires all configured channels in the workspace to be deleted.
 */
export const deleteSlackWorkspaceAuthorization: (
  input: DeleteSlackWorkspaceAuthorizationRequest,
) => effect.Effect<
  DeleteSlackWorkspaceAuthorizationResult,
  | DeleteSlackWorkspaceAuthorizationFault
  | InvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSlackWorkspaceAuthorizationRequest,
  output: DeleteSlackWorkspaceAuthorizationResult,
  errors: [DeleteSlackWorkspaceAuthorizationFault, InvalidParameterException],
}));
/**
 * Deletes a Amazon Chime webhook configuration for AWS Chatbot.
 */
export const deleteChimeWebhookConfiguration: (
  input: DeleteChimeWebhookConfigurationRequest,
) => effect.Effect<
  DeleteChimeWebhookConfigurationResult,
  | DeleteChimeWebhookConfigurationException
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChimeWebhookConfigurationRequest,
  output: DeleteChimeWebhookConfigurationResult,
  errors: [
    DeleteChimeWebhookConfigurationException,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Links a resource (for example, a custom action) to a channel configuration.
 */
export const associateToConfiguration: (
  input: AssociateToConfigurationRequest,
) => effect.Effect<
  AssociateToConfigurationResult,
  | InternalServiceError
  | InvalidRequestException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateToConfigurationRequest,
  output: AssociateToConfigurationResult,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    UnauthorizedException,
  ],
}));
/**
 * Lists Amazon Chime webhook configurations optionally filtered by ChatConfigurationArn
 */
export const describeChimeWebhookConfigurations: {
  (
    input: DescribeChimeWebhookConfigurationsRequest,
  ): effect.Effect<
    DescribeChimeWebhookConfigurationsResult,
    | DescribeChimeWebhookConfigurationsException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeChimeWebhookConfigurationsRequest,
  ) => stream.Stream<
    DescribeChimeWebhookConfigurationsResult,
    | DescribeChimeWebhookConfigurationsException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeChimeWebhookConfigurationsRequest,
  ) => stream.Stream<
    ChimeWebhookConfiguration,
    | DescribeChimeWebhookConfigurationsException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeChimeWebhookConfigurationsRequest,
  output: DescribeChimeWebhookConfigurationsResult,
  errors: [
    DescribeChimeWebhookConfigurationsException,
    InvalidParameterException,
    InvalidRequestException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "WebhookConfigurations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all Slack user identities with a mapped role.
 */
export const describeSlackUserIdentities: {
  (
    input: DescribeSlackUserIdentitiesRequest,
  ): effect.Effect<
    DescribeSlackUserIdentitiesResult,
    | DescribeSlackUserIdentitiesException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSlackUserIdentitiesRequest,
  ) => stream.Stream<
    DescribeSlackUserIdentitiesResult,
    | DescribeSlackUserIdentitiesException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSlackUserIdentitiesRequest,
  ) => stream.Stream<
    SlackUserIdentity,
    | DescribeSlackUserIdentitiesException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSlackUserIdentitiesRequest,
  output: DescribeSlackUserIdentitiesResult,
  errors: [
    DescribeSlackUserIdentitiesException,
    InvalidParameterException,
    InvalidRequestException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SlackUserIdentities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all authorized Slack workspaces connected to the AWS Account onboarded with AWS Chatbot.
 */
export const describeSlackWorkspaces: {
  (
    input: DescribeSlackWorkspacesRequest,
  ): effect.Effect<
    DescribeSlackWorkspacesResult,
    | DescribeSlackWorkspacesException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSlackWorkspacesRequest,
  ) => stream.Stream<
    DescribeSlackWorkspacesResult,
    | DescribeSlackWorkspacesException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSlackWorkspacesRequest,
  ) => stream.Stream<
    SlackWorkspace,
    | DescribeSlackWorkspacesException
    | InvalidParameterException
    | InvalidRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSlackWorkspacesRequest,
  output: DescribeSlackWorkspacesResult,
  errors: [
    DescribeSlackWorkspacesException,
    InvalidParameterException,
    InvalidRequestException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SlackWorkspaces",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all authorized Microsoft Teams for an AWS Account
 */
export const listMicrosoftTeamsConfiguredTeams: {
  (
    input: ListMicrosoftTeamsConfiguredTeamsRequest,
  ): effect.Effect<
    ListMicrosoftTeamsConfiguredTeamsResult,
    | InvalidParameterException
    | InvalidRequestException
    | ListMicrosoftTeamsConfiguredTeamsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMicrosoftTeamsConfiguredTeamsRequest,
  ) => stream.Stream<
    ListMicrosoftTeamsConfiguredTeamsResult,
    | InvalidParameterException
    | InvalidRequestException
    | ListMicrosoftTeamsConfiguredTeamsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMicrosoftTeamsConfiguredTeamsRequest,
  ) => stream.Stream<
    ConfiguredTeam,
    | InvalidParameterException
    | InvalidRequestException
    | ListMicrosoftTeamsConfiguredTeamsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMicrosoftTeamsConfiguredTeamsRequest,
  output: ListMicrosoftTeamsConfiguredTeamsResult,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ListMicrosoftTeamsConfiguredTeamsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConfiguredTeams",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * A list all Microsoft Teams user identities with a mapped role.
 */
export const listMicrosoftTeamsUserIdentities: {
  (
    input: ListMicrosoftTeamsUserIdentitiesRequest,
  ): effect.Effect<
    ListMicrosoftTeamsUserIdentitiesResult,
    | InvalidParameterException
    | InvalidRequestException
    | ListMicrosoftTeamsUserIdentitiesException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMicrosoftTeamsUserIdentitiesRequest,
  ) => stream.Stream<
    ListMicrosoftTeamsUserIdentitiesResult,
    | InvalidParameterException
    | InvalidRequestException
    | ListMicrosoftTeamsUserIdentitiesException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMicrosoftTeamsUserIdentitiesRequest,
  ) => stream.Stream<
    TeamsUserIdentity,
    | InvalidParameterException
    | InvalidRequestException
    | ListMicrosoftTeamsUserIdentitiesException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMicrosoftTeamsUserIdentitiesRequest,
  output: ListMicrosoftTeamsUserIdentitiesResult,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ListMicrosoftTeamsUserIdentitiesException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TeamsUserIdentities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all of the tags associated with the Amazon Resource Name (ARN) that you specify. The resource can be a user, server, or role.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServiceError
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceError,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns a custom action.
 */
export const getCustomAction: (
  input: GetCustomActionRequest,
) => effect.Effect<
  GetCustomActionResult,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCustomActionRequest,
  output: GetCustomActionResult,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a custom action.
 */
export const updateCustomAction: (
  input: UpdateCustomActionRequest,
) => effect.Effect<
  UpdateCustomActionResult,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomActionRequest,
  output: UpdateCustomActionResult,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Lists custom actions defined in this account.
 */
export const listCustomActions: {
  (
    input: ListCustomActionsRequest,
  ): effect.Effect<
    ListCustomActionsResult,
    | InternalServiceError
    | InvalidRequestException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomActionsRequest,
  ) => stream.Stream<
    ListCustomActionsResult,
    | InternalServiceError
    | InvalidRequestException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomActionsRequest,
  ) => stream.Stream<
    CustomActionArn,
    | InternalServiceError
    | InvalidRequestException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomActionsRequest,
  output: ListCustomActionsResult,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CustomActions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Unlink a resource, for example a custom action, from a channel configuration.
 */
export const disassociateFromConfiguration: (
  input: DisassociateFromConfigurationRequest,
) => effect.Effect<
  DisassociateFromConfigurationResult,
  | InternalServiceError
  | InvalidRequestException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateFromConfigurationRequest,
  output: DisassociateFromConfigurationResult,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a custom action.
 */
export const deleteCustomAction: (
  input: DeleteCustomActionRequest,
) => effect.Effect<
  DeleteCustomActionResult,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomActionRequest,
  output: DeleteCustomActionResult,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Lists all AWS Chatbot Microsoft Teams channel configurations in an AWS account.
 */
export const listMicrosoftTeamsChannelConfigurations: {
  (
    input: ListTeamsChannelConfigurationsRequest,
  ): effect.Effect<
    ListTeamsChannelConfigurationsResult,
    | InvalidParameterException
    | InvalidRequestException
    | ListTeamsChannelConfigurationsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTeamsChannelConfigurationsRequest,
  ) => stream.Stream<
    ListTeamsChannelConfigurationsResult,
    | InvalidParameterException
    | InvalidRequestException
    | ListTeamsChannelConfigurationsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTeamsChannelConfigurationsRequest,
  ) => stream.Stream<
    TeamsChannelConfiguration,
    | InvalidParameterException
    | InvalidRequestException
    | ListTeamsChannelConfigurationsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTeamsChannelConfigurationsRequest,
  output: ListTeamsChannelConfigurationsResult,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ListTeamsChannelConfigurationsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TeamChannelConfigurations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates AWS Chatbot account preferences.
 */
export const updateAccountPreferences: (
  input: UpdateAccountPreferencesRequest,
) => effect.Effect<
  UpdateAccountPreferencesResult,
  | InvalidParameterException
  | InvalidRequestException
  | UpdateAccountPreferencesException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountPreferencesRequest,
  output: UpdateAccountPreferencesResult,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    UpdateAccountPreferencesException,
  ],
}));
/**
 * Updates a Amazon Chime webhook configuration.
 */
export const updateChimeWebhookConfiguration: (
  input: UpdateChimeWebhookConfigurationRequest,
) => effect.Effect<
  UpdateChimeWebhookConfigurationResult,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | UpdateChimeWebhookConfigurationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChimeWebhookConfigurationRequest,
  output: UpdateChimeWebhookConfigurationResult,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    UpdateChimeWebhookConfigurationException,
  ],
}));
/**
 * Updates an Microsoft Teams channel configuration.
 */
export const updateMicrosoftTeamsChannelConfiguration: (
  input: UpdateTeamsChannelConfigurationRequest,
) => effect.Effect<
  UpdateTeamsChannelConfigurationResult,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | UpdateTeamsChannelConfigurationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTeamsChannelConfigurationRequest,
  output: UpdateTeamsChannelConfigurationResult,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    UpdateTeamsChannelConfigurationException,
  ],
}));
/**
 * Updates a Slack channel configuration.
 */
export const updateSlackChannelConfiguration: (
  input: UpdateSlackChannelConfigurationRequest,
) => effect.Effect<
  UpdateSlackChannelConfigurationResult,
  | InvalidParameterException
  | InvalidRequestException
  | ResourceNotFoundException
  | UpdateSlackChannelConfigurationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSlackChannelConfigurationRequest,
  output: UpdateSlackChannelConfigurationResult,
  errors: [
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
    UpdateSlackChannelConfigurationException,
  ],
}));
/**
 * Detaches a key-value pair from a resource, as identified by its Amazon Resource Name (ARN). Resources are users, servers, roles, and other entities.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServiceError
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceError,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a custom action that can be invoked as an alias or as a button on a notification.
 */
export const createCustomAction: (
  input: CreateCustomActionRequest,
) => effect.Effect<
  CreateCustomActionResult,
  | ConflictException
  | InternalServiceError
  | InvalidRequestException
  | LimitExceededException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomActionRequest,
  output: CreateCustomActionResult,
  errors: [
    ConflictException,
    InternalServiceError,
    InvalidRequestException,
    LimitExceededException,
    UnauthorizedException,
  ],
}));
/**
 * Creates an AWS Chatbot configuration for Microsoft Teams.
 */
export const createMicrosoftTeamsChannelConfiguration: (
  input: CreateTeamsChannelConfigurationRequest,
) => effect.Effect<
  CreateTeamsChannelConfigurationResult,
  | ConflictException
  | CreateTeamsChannelConfigurationException
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTeamsChannelConfigurationRequest,
  output: CreateTeamsChannelConfigurationResult,
  errors: [
    ConflictException,
    CreateTeamsChannelConfigurationException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
  ],
}));
/**
 * Creates an AWS Chatbot confugration for Slack.
 */
export const createSlackChannelConfiguration: (
  input: CreateSlackChannelConfigurationRequest,
) => effect.Effect<
  CreateSlackChannelConfigurationResult,
  | ConflictException
  | CreateSlackChannelConfigurationException
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSlackChannelConfigurationRequest,
  output: CreateSlackChannelConfigurationResult,
  errors: [
    ConflictException,
    CreateSlackChannelConfigurationException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
  ],
}));
/**
 * Attaches a key-value pair to a resource, as identified by its Amazon Resource Name (ARN). Resources are users, servers, roles, and other entities.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServiceError
  | ResourceNotFoundException
  | ServiceUnavailableException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceError,
    ResourceNotFoundException,
    ServiceUnavailableException,
    TooManyTagsException,
  ],
}));
/**
 * Creates an AWS Chatbot configuration for Amazon Chime.
 */
export const createChimeWebhookConfiguration: (
  input: CreateChimeWebhookConfigurationRequest,
) => effect.Effect<
  CreateChimeWebhookConfigurationResult,
  | ConflictException
  | CreateChimeWebhookConfigurationException
  | InvalidParameterException
  | InvalidRequestException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChimeWebhookConfigurationRequest,
  output: CreateChimeWebhookConfigurationResult,
  errors: [
    ConflictException,
    CreateChimeWebhookConfigurationException,
    InvalidParameterException,
    InvalidRequestException,
    LimitExceededException,
  ],
}));

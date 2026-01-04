import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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
                                url: "https://chatbot-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://chatbot-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://chatbot.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://chatbot.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetAccountPreferencesRequest extends S.Class<GetAccountPreferencesRequest>(
  "GetAccountPreferencesRequest",
)(
  {},
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/get-account-preferences" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const SnsTopicArnList = S.Array(S.String);
export const GuardrailPolicyArnList = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  TagKey: S.String,
  TagValue: S.String,
}) {}
export const TagList = S.Array(Tag);
export const TagKeyList = S.Array(S.String);
export class AssociateToConfigurationRequest extends S.Class<AssociateToConfigurationRequest>(
  "AssociateToConfigurationRequest",
)(
  { Resource: S.String, ChatConfiguration: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/associate-to-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateToConfigurationResult extends S.Class<AssociateToConfigurationResult>(
  "AssociateToConfigurationResult",
)({}, ns) {}
export const Tags = S.Array(Tag);
export class CreateTeamsChannelConfigurationRequest extends S.Class<CreateTeamsChannelConfigurationRequest>(
  "CreateTeamsChannelConfigurationRequest",
)(
  {
    ChannelId: S.String,
    ChannelName: S.optional(S.String),
    TeamId: S.String,
    TeamName: S.optional(S.String),
    TenantId: S.String,
    SnsTopicArns: S.optional(SnsTopicArnList),
    IamRoleArn: S.String,
    ConfigurationName: S.String,
    LoggingLevel: S.optional(S.String),
    GuardrailPolicyArns: S.optional(GuardrailPolicyArnList),
    UserAuthorizationRequired: S.optional(S.Boolean),
    Tags: S.optional(Tags),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/create-ms-teams-channel-configuration" }),
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
    SlackTeamId: S.String,
    SlackChannelId: S.String,
    SlackChannelName: S.optional(S.String),
    SnsTopicArns: S.optional(SnsTopicArnList),
    IamRoleArn: S.String,
    ConfigurationName: S.String,
    LoggingLevel: S.optional(S.String),
    GuardrailPolicyArns: S.optional(GuardrailPolicyArnList),
    UserAuthorizationRequired: S.optional(S.Boolean),
    Tags: S.optional(Tags),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/create-slack-channel-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChimeWebhookConfigurationRequest extends S.Class<DeleteChimeWebhookConfigurationRequest>(
  "DeleteChimeWebhookConfigurationRequest",
)(
  { ChatConfigurationArn: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/delete-chime-webhook-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChimeWebhookConfigurationResult extends S.Class<DeleteChimeWebhookConfigurationResult>(
  "DeleteChimeWebhookConfigurationResult",
)({}, ns) {}
export class DeleteTeamsChannelConfigurationRequest extends S.Class<DeleteTeamsChannelConfigurationRequest>(
  "DeleteTeamsChannelConfigurationRequest",
)(
  { ChatConfigurationArn: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/delete-ms-teams-channel-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTeamsChannelConfigurationResult extends S.Class<DeleteTeamsChannelConfigurationResult>(
  "DeleteTeamsChannelConfigurationResult",
)({}, ns) {}
export class DeleteTeamsConfiguredTeamRequest extends S.Class<DeleteTeamsConfiguredTeamRequest>(
  "DeleteTeamsConfiguredTeamRequest",
)(
  { TeamId: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/delete-ms-teams-configured-teams" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTeamsConfiguredTeamResult extends S.Class<DeleteTeamsConfiguredTeamResult>(
  "DeleteTeamsConfiguredTeamResult",
)({}, ns) {}
export class DeleteMicrosoftTeamsUserIdentityRequest extends S.Class<DeleteMicrosoftTeamsUserIdentityRequest>(
  "DeleteMicrosoftTeamsUserIdentityRequest",
)(
  { ChatConfigurationArn: S.String, UserId: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/delete-ms-teams-user-identity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMicrosoftTeamsUserIdentityResult extends S.Class<DeleteMicrosoftTeamsUserIdentityResult>(
  "DeleteMicrosoftTeamsUserIdentityResult",
)({}, ns) {}
export class DeleteSlackChannelConfigurationRequest extends S.Class<DeleteSlackChannelConfigurationRequest>(
  "DeleteSlackChannelConfigurationRequest",
)(
  { ChatConfigurationArn: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/delete-slack-channel-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSlackChannelConfigurationResult extends S.Class<DeleteSlackChannelConfigurationResult>(
  "DeleteSlackChannelConfigurationResult",
)({}, ns) {}
export class DeleteSlackUserIdentityRequest extends S.Class<DeleteSlackUserIdentityRequest>(
  "DeleteSlackUserIdentityRequest",
)(
  {
    ChatConfigurationArn: S.String,
    SlackTeamId: S.String,
    SlackUserId: S.String,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/delete-slack-user-identity" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSlackUserIdentityResult extends S.Class<DeleteSlackUserIdentityResult>(
  "DeleteSlackUserIdentityResult",
)({}, ns) {}
export class DeleteSlackWorkspaceAuthorizationRequest extends S.Class<DeleteSlackWorkspaceAuthorizationRequest>(
  "DeleteSlackWorkspaceAuthorizationRequest",
)(
  { SlackTeamId: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/delete-slack-workspace-authorization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSlackWorkspaceAuthorizationResult extends S.Class<DeleteSlackWorkspaceAuthorizationResult>(
  "DeleteSlackWorkspaceAuthorizationResult",
)({}, ns) {}
export class DescribeChimeWebhookConfigurationsRequest extends S.Class<DescribeChimeWebhookConfigurationsRequest>(
  "DescribeChimeWebhookConfigurationsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ChatConfigurationArn: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describe-chime-webhook-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSlackChannelConfigurationsRequest extends S.Class<DescribeSlackChannelConfigurationsRequest>(
  "DescribeSlackChannelConfigurationsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ChatConfigurationArn: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describe-slack-channel-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSlackUserIdentitiesRequest extends S.Class<DescribeSlackUserIdentitiesRequest>(
  "DescribeSlackUserIdentitiesRequest",
)(
  {
    ChatConfigurationArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describe-slack-user-identities" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSlackWorkspacesRequest extends S.Class<DescribeSlackWorkspacesRequest>(
  "DescribeSlackWorkspacesRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/describe-slack-workspaces" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateFromConfigurationRequest extends S.Class<DisassociateFromConfigurationRequest>(
  "DisassociateFromConfigurationRequest",
)(
  { Resource: S.String, ChatConfiguration: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/disassociate-from-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateFromConfigurationResult extends S.Class<DisassociateFromConfigurationResult>(
  "DisassociateFromConfigurationResult",
)({}, ns) {}
export class GetTeamsChannelConfigurationRequest extends S.Class<GetTeamsChannelConfigurationRequest>(
  "GetTeamsChannelConfigurationRequest",
)(
  { ChatConfigurationArn: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/get-ms-teams-channel-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAssociationsRequest extends S.Class<ListAssociationsRequest>(
  "ListAssociationsRequest",
)(
  {
    ChatConfiguration: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/list-associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTeamsChannelConfigurationsRequest extends S.Class<ListTeamsChannelConfigurationsRequest>(
  "ListTeamsChannelConfigurationsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    TeamId: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/list-ms-teams-channel-configurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMicrosoftTeamsConfiguredTeamsRequest extends S.Class<ListMicrosoftTeamsConfiguredTeamsRequest>(
  "ListMicrosoftTeamsConfiguredTeamsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/list-ms-teams-configured-teams" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMicrosoftTeamsUserIdentitiesRequest extends S.Class<ListMicrosoftTeamsUserIdentitiesRequest>(
  "ListMicrosoftTeamsUserIdentitiesRequest",
)(
  {
    ChatConfigurationArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/list-ms-teams-user-identities" }),
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
  { ResourceARN: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/list-tags-for-resource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/tag-resource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/untag-resource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class UpdateAccountPreferencesRequest extends S.Class<UpdateAccountPreferencesRequest>(
  "UpdateAccountPreferencesRequest",
)(
  {
    UserAuthorizationRequired: S.optional(S.Boolean),
    TrainingDataCollectionEnabled: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/update-account-preferences" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateChimeWebhookConfigurationRequest extends S.Class<UpdateChimeWebhookConfigurationRequest>(
  "UpdateChimeWebhookConfigurationRequest",
)(
  {
    ChatConfigurationArn: S.String,
    WebhookDescription: S.optional(S.String),
    WebhookUrl: S.optional(S.String),
    SnsTopicArns: S.optional(SnsTopicArnList),
    IamRoleArn: S.optional(S.String),
    LoggingLevel: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/update-chime-webhook-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTeamsChannelConfigurationRequest extends S.Class<UpdateTeamsChannelConfigurationRequest>(
  "UpdateTeamsChannelConfigurationRequest",
)(
  {
    ChatConfigurationArn: S.String,
    ChannelId: S.String,
    ChannelName: S.optional(S.String),
    SnsTopicArns: S.optional(SnsTopicArnList),
    IamRoleArn: S.optional(S.String),
    LoggingLevel: S.optional(S.String),
    GuardrailPolicyArns: S.optional(GuardrailPolicyArnList),
    UserAuthorizationRequired: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/update-ms-teams-channel-configuration" }),
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
    ChatConfigurationArn: S.String,
    SlackChannelId: S.String,
    SlackChannelName: S.optional(S.String),
    SnsTopicArns: S.optional(SnsTopicArnList),
    IamRoleArn: S.optional(S.String),
    LoggingLevel: S.optional(S.String),
    GuardrailPolicyArns: S.optional(GuardrailPolicyArnList),
    UserAuthorizationRequired: S.optional(S.Boolean),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/update-slack-channel-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SlackChannelConfiguration extends S.Class<SlackChannelConfiguration>(
  "SlackChannelConfiguration",
)({
  SlackTeamName: S.String,
  SlackTeamId: S.String,
  SlackChannelId: S.String,
  SlackChannelName: S.String,
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
}) {}
export const SlackChannelConfigurationList = S.Array(SlackChannelConfiguration);
export class AccountPreferences extends S.Class<AccountPreferences>(
  "AccountPreferences",
)({
  UserAuthorizationRequired: S.optional(S.Boolean),
  TrainingDataCollectionEnabled: S.optional(S.Boolean),
}) {}
export class TeamsChannelConfiguration extends S.Class<TeamsChannelConfiguration>(
  "TeamsChannelConfiguration",
)({
  ChannelId: S.String,
  ChannelName: S.optional(S.String),
  TeamId: S.String,
  TeamName: S.optional(S.String),
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
}) {}
export const TeamChannelConfigurationsList = S.Array(TeamsChannelConfiguration);
export class CreateChimeWebhookConfigurationRequest extends S.Class<CreateChimeWebhookConfigurationRequest>(
  "CreateChimeWebhookConfigurationRequest",
)(
  {
    WebhookDescription: S.String,
    WebhookUrl: S.String,
    SnsTopicArns: SnsTopicArnList,
    IamRoleArn: S.String,
    ConfigurationName: S.String,
    LoggingLevel: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/create-chime-webhook-configuration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSlackChannelConfigurationsResult extends S.Class<DescribeSlackChannelConfigurationsResult>(
  "DescribeSlackChannelConfigurationsResult",
)(
  {
    NextToken: S.optional(S.String),
    SlackChannelConfigurations: S.optional(SlackChannelConfigurationList),
  },
  ns,
) {}
export class GetAccountPreferencesResult extends S.Class<GetAccountPreferencesResult>(
  "GetAccountPreferencesResult",
)({ AccountPreferences: S.optional(AccountPreferences) }, ns) {}
export class GetTeamsChannelConfigurationResult extends S.Class<GetTeamsChannelConfigurationResult>(
  "GetTeamsChannelConfigurationResult",
)({ ChannelConfiguration: S.optional(TeamsChannelConfiguration) }, ns) {}
export class ListTeamsChannelConfigurationsResult extends S.Class<ListTeamsChannelConfigurationsResult>(
  "ListTeamsChannelConfigurationsResult",
)(
  {
    NextToken: S.optional(S.String),
    TeamChannelConfigurations: S.optional(TeamChannelConfigurationsList),
  },
  ns,
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export class UpdateAccountPreferencesResult extends S.Class<UpdateAccountPreferencesResult>(
  "UpdateAccountPreferencesResult",
)({ AccountPreferences: S.optional(AccountPreferences) }, ns) {}
export class ChimeWebhookConfiguration extends S.Class<ChimeWebhookConfiguration>(
  "ChimeWebhookConfiguration",
)({
  WebhookDescription: S.String,
  ChatConfigurationArn: S.String,
  IamRoleArn: S.String,
  SnsTopicArns: SnsTopicArnList,
  ConfigurationName: S.optional(S.String),
  LoggingLevel: S.optional(S.String),
  Tags: S.optional(Tags),
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
}) {}
export class UpdateChimeWebhookConfigurationResult extends S.Class<UpdateChimeWebhookConfigurationResult>(
  "UpdateChimeWebhookConfigurationResult",
)({ WebhookConfiguration: S.optional(ChimeWebhookConfiguration) }, ns) {}
export class UpdateTeamsChannelConfigurationResult extends S.Class<UpdateTeamsChannelConfigurationResult>(
  "UpdateTeamsChannelConfigurationResult",
)({ ChannelConfiguration: S.optional(TeamsChannelConfiguration) }, ns) {}
export class UpdateSlackChannelConfigurationResult extends S.Class<UpdateSlackChannelConfigurationResult>(
  "UpdateSlackChannelConfigurationResult",
)({ ChannelConfiguration: S.optional(SlackChannelConfiguration) }, ns) {}
export const ChimeWebhookConfigurationList = S.Array(ChimeWebhookConfiguration);
export class SlackUserIdentity extends S.Class<SlackUserIdentity>(
  "SlackUserIdentity",
)({
  IamRoleArn: S.String,
  ChatConfigurationArn: S.String,
  SlackTeamId: S.String,
  SlackUserId: S.String,
  AwsUserIdentity: S.optional(S.String),
}) {}
export const SlackUserIdentitiesList = S.Array(SlackUserIdentity);
export class SlackWorkspace extends S.Class<SlackWorkspace>("SlackWorkspace")({
  SlackTeamId: S.String,
  SlackTeamName: S.String,
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
}) {}
export const SlackWorkspacesList = S.Array(SlackWorkspace);
export class AssociationListing extends S.Class<AssociationListing>(
  "AssociationListing",
)({ Resource: S.String }) {}
export const AssociationList = S.Array(AssociationListing);
export class ConfiguredTeam extends S.Class<ConfiguredTeam>("ConfiguredTeam")({
  TenantId: S.String,
  TeamId: S.String,
  TeamName: S.optional(S.String),
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
}) {}
export const ConfiguredTeamsList = S.Array(ConfiguredTeam);
export class TeamsUserIdentity extends S.Class<TeamsUserIdentity>(
  "TeamsUserIdentity",
)({
  IamRoleArn: S.String,
  ChatConfigurationArn: S.String,
  TeamId: S.String,
  UserId: S.optional(S.String),
  AwsUserIdentity: S.optional(S.String),
  TeamsChannelId: S.optional(S.String),
  TeamsTenantId: S.optional(S.String),
}) {}
export const TeamsUserIdentitiesList = S.Array(TeamsUserIdentity);
export class CreateChimeWebhookConfigurationResult extends S.Class<CreateChimeWebhookConfigurationResult>(
  "CreateChimeWebhookConfigurationResult",
)({ WebhookConfiguration: S.optional(ChimeWebhookConfiguration) }, ns) {}
export class CreateTeamsChannelConfigurationResult extends S.Class<CreateTeamsChannelConfigurationResult>(
  "CreateTeamsChannelConfigurationResult",
)({ ChannelConfiguration: S.optional(TeamsChannelConfiguration) }, ns) {}
export class CreateSlackChannelConfigurationResult extends S.Class<CreateSlackChannelConfigurationResult>(
  "CreateSlackChannelConfigurationResult",
)({ ChannelConfiguration: S.optional(SlackChannelConfiguration) }, ns) {}
export class DescribeChimeWebhookConfigurationsResult extends S.Class<DescribeChimeWebhookConfigurationsResult>(
  "DescribeChimeWebhookConfigurationsResult",
)(
  {
    NextToken: S.optional(S.String),
    WebhookConfigurations: S.optional(ChimeWebhookConfigurationList),
  },
  ns,
) {}
export class DescribeSlackUserIdentitiesResult extends S.Class<DescribeSlackUserIdentitiesResult>(
  "DescribeSlackUserIdentitiesResult",
)(
  {
    SlackUserIdentities: S.optional(SlackUserIdentitiesList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeSlackWorkspacesResult extends S.Class<DescribeSlackWorkspacesResult>(
  "DescribeSlackWorkspacesResult",
)(
  {
    SlackWorkspaces: S.optional(SlackWorkspacesList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListAssociationsResult extends S.Class<ListAssociationsResult>(
  "ListAssociationsResult",
)({ Associations: AssociationList, NextToken: S.optional(S.String) }, ns) {}
export class ListMicrosoftTeamsConfiguredTeamsResult extends S.Class<ListMicrosoftTeamsConfiguredTeamsResult>(
  "ListMicrosoftTeamsConfiguredTeamsResult",
)(
  {
    ConfiguredTeams: S.optional(ConfiguredTeamsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListMicrosoftTeamsUserIdentitiesResult extends S.Class<ListMicrosoftTeamsUserIdentitiesResult>(
  "ListMicrosoftTeamsUserIdentitiesResult",
)(
  {
    TeamsUserIdentities: S.optional(TeamsUserIdentitiesList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}

//# Errors
export class InternalServiceError extends S.TaggedError<InternalServiceError>()(
  "InternalServiceError",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class DeleteChimeWebhookConfigurationException extends S.TaggedError<DeleteChimeWebhookConfigurationException>()(
  "DeleteChimeWebhookConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class DeleteTeamsChannelConfigurationException extends S.TaggedError<DeleteTeamsChannelConfigurationException>()(
  "DeleteTeamsChannelConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
) {}
export class DeleteTeamsConfiguredTeamException extends S.TaggedError<DeleteTeamsConfiguredTeamException>()(
  "DeleteTeamsConfiguredTeamException",
  { Message: S.optional(S.String) },
) {}
export class DeleteMicrosoftTeamsUserIdentityException extends S.TaggedError<DeleteMicrosoftTeamsUserIdentityException>()(
  "DeleteMicrosoftTeamsUserIdentityException",
  { Message: S.optional(S.String) },
) {}
export class DeleteSlackChannelConfigurationException extends S.TaggedError<DeleteSlackChannelConfigurationException>()(
  "DeleteSlackChannelConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class DeleteSlackUserIdentityException extends S.TaggedError<DeleteSlackUserIdentityException>()(
  "DeleteSlackUserIdentityException",
  { Message: S.optional(S.String) },
) {}
export class DeleteSlackWorkspaceAuthorizationFault extends S.TaggedError<DeleteSlackWorkspaceAuthorizationFault>()(
  "DeleteSlackWorkspaceAuthorizationFault",
  { Message: S.optional(S.String) },
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class DescribeSlackChannelConfigurationsException extends S.TaggedError<DescribeSlackChannelConfigurationsException>()(
  "DescribeSlackChannelConfigurationsException",
  { Message: S.optional(S.String) },
) {}
export class GetAccountPreferencesException extends S.TaggedError<GetAccountPreferencesException>()(
  "GetAccountPreferencesException",
  { Message: S.optional(S.String) },
) {}
export class GetTeamsChannelConfigurationException extends S.TaggedError<GetTeamsChannelConfigurationException>()(
  "GetTeamsChannelConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class ListTeamsChannelConfigurationsException extends S.TaggedError<ListTeamsChannelConfigurationsException>()(
  "ListTeamsChannelConfigurationsException",
  { Message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}
export class UpdateAccountPreferencesException extends S.TaggedError<UpdateAccountPreferencesException>()(
  "UpdateAccountPreferencesException",
  { Message: S.optional(S.String) },
) {}
export class UpdateChimeWebhookConfigurationException extends S.TaggedError<UpdateChimeWebhookConfigurationException>()(
  "UpdateChimeWebhookConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class UpdateTeamsChannelConfigurationException extends S.TaggedError<UpdateTeamsChannelConfigurationException>()(
  "UpdateTeamsChannelConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class UpdateSlackChannelConfigurationException extends S.TaggedError<UpdateSlackChannelConfigurationException>()(
  "UpdateSlackChannelConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class CreateTeamsChannelConfigurationException extends S.TaggedError<CreateTeamsChannelConfigurationException>()(
  "CreateTeamsChannelConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class CreateSlackChannelConfigurationException extends S.TaggedError<CreateSlackChannelConfigurationException>()(
  "CreateSlackChannelConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class DescribeChimeWebhookConfigurationsException extends S.TaggedError<DescribeChimeWebhookConfigurationsException>()(
  "DescribeChimeWebhookConfigurationsException",
  { Message: S.optional(S.String) },
) {}
export class DescribeSlackUserIdentitiesException extends S.TaggedError<DescribeSlackUserIdentitiesException>()(
  "DescribeSlackUserIdentitiesException",
  { Message: S.optional(S.String) },
) {}
export class DescribeSlackWorkspacesException extends S.TaggedError<DescribeSlackWorkspacesException>()(
  "DescribeSlackWorkspacesException",
  { Message: S.optional(S.String) },
) {}
export class ListMicrosoftTeamsConfiguredTeamsException extends S.TaggedError<ListMicrosoftTeamsConfiguredTeamsException>()(
  "ListMicrosoftTeamsConfiguredTeamsException",
  { Message: S.optional(S.String) },
) {}
export class ListMicrosoftTeamsUserIdentitiesException extends S.TaggedError<ListMicrosoftTeamsUserIdentitiesException>()(
  "ListMicrosoftTeamsUserIdentitiesException",
  { Message: S.optional(S.String) },
) {}
export class CreateChimeWebhookConfigurationException extends S.TaggedError<CreateChimeWebhookConfigurationException>()(
  "CreateChimeWebhookConfigurationException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a Microsoft Teams channel configuration for AWS Chatbot
 */
export const deleteMicrosoftTeamsChannelConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMicrosoftTeamsConfiguredTeam =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteTeamsConfiguredTeamRequest,
    output: DeleteTeamsConfiguredTeamResult,
    errors: [DeleteTeamsConfiguredTeamException, InvalidParameterException],
  }));
/**
 * Identifes a user level permission for a channel configuration.
 */
export const deleteMicrosoftTeamsUserIdentity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSlackChannelConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSlackUserIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSlackUserIdentityRequest,
    output: DeleteSlackUserIdentityResult,
    errors: [
      DeleteSlackUserIdentityException,
      InvalidParameterException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes the Slack workspace authorization that allows channels to be configured in that workspace. This requires all configured channels in the workspace to be deleted.
 */
export const deleteSlackWorkspaceAuthorization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteSlackWorkspaceAuthorizationRequest,
    output: DeleteSlackWorkspaceAuthorizationResult,
    errors: [DeleteSlackWorkspaceAuthorizationFault, InvalidParameterException],
  }));
/**
 * Unlink a resource, for example a custom action, from a channel configuration.
 */
export const disassociateFromConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateFromConfigurationRequest,
    output: DisassociateFromConfigurationResult,
    errors: [
      InternalServiceError,
      InvalidRequestException,
      UnauthorizedException,
    ],
  }));
/**
 * Lists all of the tags associated with the Amazon Resource Name (ARN) that you specify. The resource can be a user, server, or role.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceError,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Detaches a key-value pair from a resource, as identified by its Amazon Resource Name (ARN). Resources are users, servers, roles, and other entities.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceError,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Links a resource (for example, a custom action) to a channel configuration.
 */
export const associateToConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateToConfigurationRequest,
    output: AssociateToConfigurationResult,
    errors: [
      InternalServiceError,
      InvalidRequestException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a Amazon Chime webhook configuration for AWS Chatbot.
 */
export const deleteChimeWebhookConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists Slack channel configurations optionally filtered by ChatConfigurationArn
 */
export const describeSlackChannelConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeSlackChannelConfigurationsRequest,
    output: DescribeSlackChannelConfigurationsResult,
    errors: [
      DescribeSlackChannelConfigurationsException,
      InvalidParameterException,
      InvalidRequestException,
    ],
  }));
/**
 * Returns AWS Chatbot account preferences.
 */
export const getAccountPreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAccountPreferencesRequest,
    output: GetAccountPreferencesResult,
    errors: [GetAccountPreferencesException, InvalidRequestException],
  }),
);
/**
 * Returns a Microsoft Teams channel configuration in an AWS account.
 */
export const getMicrosoftTeamsChannelConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAssociations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAssociationsRequest,
  output: ListAssociationsResult,
  errors: [],
}));
/**
 * Lists all AWS Chatbot Microsoft Teams channel configurations in an AWS account.
 */
export const listMicrosoftTeamsChannelConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListTeamsChannelConfigurationsRequest,
    output: ListTeamsChannelConfigurationsResult,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ListTeamsChannelConfigurationsException,
    ],
  }));
/**
 * Attaches a key-value pair to a resource, as identified by its Amazon Resource Name (ARN). Resources are users, servers, roles, and other entities.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates AWS Chatbot account preferences.
 */
export const updateAccountPreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountPreferencesRequest,
    output: UpdateAccountPreferencesResult,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      UpdateAccountPreferencesException,
    ],
  }),
);
/**
 * Updates a Amazon Chime webhook configuration.
 */
export const updateChimeWebhookConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateMicrosoftTeamsChannelConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSlackChannelConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an AWS Chatbot confugration for Slack.
 */
export const createSlackChannelConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists Amazon Chime webhook configurations optionally filtered by ChatConfigurationArn
 */
export const describeChimeWebhookConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeChimeWebhookConfigurationsRequest,
    output: DescribeChimeWebhookConfigurationsResult,
    errors: [
      DescribeChimeWebhookConfigurationsException,
      InvalidParameterException,
      InvalidRequestException,
    ],
  }));
/**
 * Lists all Slack user identities with a mapped role.
 */
export const describeSlackUserIdentities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSlackUserIdentitiesRequest,
    output: DescribeSlackUserIdentitiesResult,
    errors: [
      DescribeSlackUserIdentitiesException,
      InvalidParameterException,
      InvalidRequestException,
    ],
  }),
);
/**
 * List all authorized Slack workspaces connected to the AWS Account onboarded with AWS Chatbot.
 */
export const describeSlackWorkspaces = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSlackWorkspacesRequest,
    output: DescribeSlackWorkspacesResult,
    errors: [
      DescribeSlackWorkspacesException,
      InvalidParameterException,
      InvalidRequestException,
    ],
  }),
);
/**
 * Lists all authorized Microsoft Teams for an AWS Account
 */
export const listMicrosoftTeamsConfiguredTeams =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListMicrosoftTeamsConfiguredTeamsRequest,
    output: ListMicrosoftTeamsConfiguredTeamsResult,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ListMicrosoftTeamsConfiguredTeamsException,
    ],
  }));
/**
 * A list all Microsoft Teams user identities with a mapped role.
 */
export const listMicrosoftTeamsUserIdentities =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListMicrosoftTeamsUserIdentitiesRequest,
    output: ListMicrosoftTeamsUserIdentitiesResult,
    errors: [
      InvalidParameterException,
      InvalidRequestException,
      ListMicrosoftTeamsUserIdentitiesException,
    ],
  }));
/**
 * Creates an AWS Chatbot configuration for Amazon Chime.
 */
export const createChimeWebhookConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Creates an AWS Chatbot configuration for Microsoft Teams.
 */
export const createMicrosoftTeamsChannelConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://ses.amazonaws.com/doc/2010-12-01/");
const svc = T.AwsApiService({
  sdkId: "SES",
  serviceShapeName: "SimpleEmailService",
});
const auth = T.AwsAuthSigv4({ name: "ses" });
const ver = T.ServiceVersion("2010-12-01");
const proto = T.AwsProtocolsAwsQuery();
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
                        url: "https://email-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://email-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://email.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://email.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeActiveReceiptRuleSetRequest extends S.Class<DescribeActiveReceiptRuleSetRequest>(
  "DescribeActiveReceiptRuleSetRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAccountSendingEnabledRequest extends S.Class<GetAccountSendingEnabledRequest>(
  "GetAccountSendingEnabledRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSendQuotaRequest extends S.Class<GetSendQuotaRequest>(
  "GetSendQuotaRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSendStatisticsRequest extends S.Class<GetSendStatisticsRequest>(
  "GetSendStatisticsRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListReceiptFiltersRequest extends S.Class<ListReceiptFiltersRequest>(
  "ListReceiptFiltersRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListVerifiedEmailAddressesRequest extends S.Class<ListVerifiedEmailAddressesRequest>(
  "ListVerifiedEmailAddressesRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const RecipientsList = S.Array(S.String);
export class S3Action extends S.Class<S3Action>("S3Action")({
  TopicArn: S.optional(S.String),
  BucketName: S.String,
  ObjectKeyPrefix: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  IamRoleArn: S.optional(S.String),
}) {}
export class BounceAction extends S.Class<BounceAction>("BounceAction")({
  TopicArn: S.optional(S.String),
  SmtpReplyCode: S.String,
  StatusCode: S.optional(S.String),
  Message: S.String,
  Sender: S.String,
}) {}
export class WorkmailAction extends S.Class<WorkmailAction>("WorkmailAction")({
  TopicArn: S.optional(S.String),
  OrganizationArn: S.String,
}) {}
export class LambdaAction extends S.Class<LambdaAction>("LambdaAction")({
  TopicArn: S.optional(S.String),
  FunctionArn: S.String,
  InvocationType: S.optional(S.String),
}) {}
export class StopAction extends S.Class<StopAction>("StopAction")({
  Scope: S.String,
  TopicArn: S.optional(S.String),
}) {}
export class AddHeaderAction extends S.Class<AddHeaderAction>(
  "AddHeaderAction",
)({ HeaderName: S.String, HeaderValue: S.String }) {}
export class SNSAction extends S.Class<SNSAction>("SNSAction")({
  TopicArn: S.String,
  Encoding: S.optional(S.String),
}) {}
export class ConnectAction extends S.Class<ConnectAction>("ConnectAction")({
  InstanceARN: S.String,
  IAMRoleARN: S.String,
}) {}
export class ReceiptAction extends S.Class<ReceiptAction>("ReceiptAction")({
  S3Action: S.optional(S3Action),
  BounceAction: S.optional(BounceAction),
  WorkmailAction: S.optional(WorkmailAction),
  LambdaAction: S.optional(LambdaAction),
  StopAction: S.optional(StopAction),
  AddHeaderAction: S.optional(AddHeaderAction),
  SNSAction: S.optional(SNSAction),
  ConnectAction: S.optional(ConnectAction),
}) {}
export const ReceiptActionsList = S.Array(ReceiptAction);
export class ReceiptRule extends S.Class<ReceiptRule>("ReceiptRule")({
  Name: S.String,
  Enabled: S.optional(S.Boolean),
  TlsPolicy: S.optional(S.String),
  Recipients: S.optional(RecipientsList),
  Actions: S.optional(ReceiptActionsList),
  ScanEnabled: S.optional(S.Boolean),
}) {}
export const ReceiptRulesList = S.Array(ReceiptRule);
export const ConfigurationSetAttributeList = S.Array(S.String);
export const IdentityList = S.Array(S.String);
export const PolicyNameList = S.Array(S.String);
export class ReceiptIpFilter extends S.Class<ReceiptIpFilter>(
  "ReceiptIpFilter",
)({ Policy: S.String, Cidr: S.String }) {}
export class ReceiptFilter extends S.Class<ReceiptFilter>("ReceiptFilter")({
  Name: S.String,
  IpFilter: ReceiptIpFilter,
}) {}
export const ReceiptFilterList = S.Array(ReceiptFilter);
export const AddressList = S.Array(S.String);
export const ReceiptRuleNamesList = S.Array(S.String);
export class CloneReceiptRuleSetRequest extends S.Class<CloneReceiptRuleSetRequest>(
  "CloneReceiptRuleSetRequest",
)(
  { RuleSetName: S.String, OriginalRuleSetName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CloneReceiptRuleSetResponse extends S.Class<CloneReceiptRuleSetResponse>(
  "CloneReceiptRuleSetResponse",
)({}, ns) {}
export class CreateCustomVerificationEmailTemplateRequest extends S.Class<CreateCustomVerificationEmailTemplateRequest>(
  "CreateCustomVerificationEmailTemplateRequest",
)(
  {
    TemplateName: S.String,
    FromEmailAddress: S.String,
    TemplateSubject: S.String,
    TemplateContent: S.String,
    SuccessRedirectionURL: S.String,
    FailureRedirectionURL: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCustomVerificationEmailTemplateResponse extends S.Class<CreateCustomVerificationEmailTemplateResponse>(
  "CreateCustomVerificationEmailTemplateResponse",
)({}, ns) {}
export class CreateReceiptRuleSetRequest extends S.Class<CreateReceiptRuleSetRequest>(
  "CreateReceiptRuleSetRequest",
)(
  { RuleSetName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateReceiptRuleSetResponse extends S.Class<CreateReceiptRuleSetResponse>(
  "CreateReceiptRuleSetResponse",
)({}, ns) {}
export class DeleteConfigurationSetRequest extends S.Class<DeleteConfigurationSetRequest>(
  "DeleteConfigurationSetRequest",
)(
  { ConfigurationSetName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConfigurationSetResponse extends S.Class<DeleteConfigurationSetResponse>(
  "DeleteConfigurationSetResponse",
)({}, ns) {}
export class DeleteConfigurationSetEventDestinationRequest extends S.Class<DeleteConfigurationSetEventDestinationRequest>(
  "DeleteConfigurationSetEventDestinationRequest",
)(
  { ConfigurationSetName: S.String, EventDestinationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConfigurationSetEventDestinationResponse extends S.Class<DeleteConfigurationSetEventDestinationResponse>(
  "DeleteConfigurationSetEventDestinationResponse",
)({}, ns) {}
export class DeleteConfigurationSetTrackingOptionsRequest extends S.Class<DeleteConfigurationSetTrackingOptionsRequest>(
  "DeleteConfigurationSetTrackingOptionsRequest",
)(
  { ConfigurationSetName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConfigurationSetTrackingOptionsResponse extends S.Class<DeleteConfigurationSetTrackingOptionsResponse>(
  "DeleteConfigurationSetTrackingOptionsResponse",
)({}, ns) {}
export class DeleteCustomVerificationEmailTemplateRequest extends S.Class<DeleteCustomVerificationEmailTemplateRequest>(
  "DeleteCustomVerificationEmailTemplateRequest",
)(
  { TemplateName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCustomVerificationEmailTemplateResponse extends S.Class<DeleteCustomVerificationEmailTemplateResponse>(
  "DeleteCustomVerificationEmailTemplateResponse",
)({}, ns) {}
export class DeleteIdentityRequest extends S.Class<DeleteIdentityRequest>(
  "DeleteIdentityRequest",
)(
  { Identity: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIdentityResponse extends S.Class<DeleteIdentityResponse>(
  "DeleteIdentityResponse",
)({}, ns) {}
export class DeleteIdentityPolicyRequest extends S.Class<DeleteIdentityPolicyRequest>(
  "DeleteIdentityPolicyRequest",
)(
  { Identity: S.String, PolicyName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIdentityPolicyResponse extends S.Class<DeleteIdentityPolicyResponse>(
  "DeleteIdentityPolicyResponse",
)({}, ns) {}
export class DeleteReceiptFilterRequest extends S.Class<DeleteReceiptFilterRequest>(
  "DeleteReceiptFilterRequest",
)(
  { FilterName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteReceiptFilterResponse extends S.Class<DeleteReceiptFilterResponse>(
  "DeleteReceiptFilterResponse",
)({}, ns) {}
export class DeleteReceiptRuleRequest extends S.Class<DeleteReceiptRuleRequest>(
  "DeleteReceiptRuleRequest",
)(
  { RuleSetName: S.String, RuleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteReceiptRuleResponse extends S.Class<DeleteReceiptRuleResponse>(
  "DeleteReceiptRuleResponse",
)({}, ns) {}
export class DeleteReceiptRuleSetRequest extends S.Class<DeleteReceiptRuleSetRequest>(
  "DeleteReceiptRuleSetRequest",
)(
  { RuleSetName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteReceiptRuleSetResponse extends S.Class<DeleteReceiptRuleSetResponse>(
  "DeleteReceiptRuleSetResponse",
)({}, ns) {}
export class DeleteTemplateRequest extends S.Class<DeleteTemplateRequest>(
  "DeleteTemplateRequest",
)(
  { TemplateName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTemplateResponse extends S.Class<DeleteTemplateResponse>(
  "DeleteTemplateResponse",
)({}, ns) {}
export class DeleteVerifiedEmailAddressRequest extends S.Class<DeleteVerifiedEmailAddressRequest>(
  "DeleteVerifiedEmailAddressRequest",
)(
  { EmailAddress: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVerifiedEmailAddressResponse extends S.Class<DeleteVerifiedEmailAddressResponse>(
  "DeleteVerifiedEmailAddressResponse",
)({}, ns) {}
export class DescribeConfigurationSetRequest extends S.Class<DescribeConfigurationSetRequest>(
  "DescribeConfigurationSetRequest",
)(
  {
    ConfigurationSetName: S.String,
    ConfigurationSetAttributeNames: S.optional(ConfigurationSetAttributeList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReceiptRuleRequest extends S.Class<DescribeReceiptRuleRequest>(
  "DescribeReceiptRuleRequest",
)(
  { RuleSetName: S.String, RuleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReceiptRuleSetRequest extends S.Class<DescribeReceiptRuleSetRequest>(
  "DescribeReceiptRuleSetRequest",
)(
  { RuleSetName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAccountSendingEnabledResponse extends S.Class<GetAccountSendingEnabledResponse>(
  "GetAccountSendingEnabledResponse",
)({ Enabled: S.optional(S.Boolean) }, ns) {}
export class GetCustomVerificationEmailTemplateRequest extends S.Class<GetCustomVerificationEmailTemplateRequest>(
  "GetCustomVerificationEmailTemplateRequest",
)(
  { TemplateName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdentityDkimAttributesRequest extends S.Class<GetIdentityDkimAttributesRequest>(
  "GetIdentityDkimAttributesRequest",
)(
  { Identities: IdentityList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdentityMailFromDomainAttributesRequest extends S.Class<GetIdentityMailFromDomainAttributesRequest>(
  "GetIdentityMailFromDomainAttributesRequest",
)(
  { Identities: IdentityList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdentityNotificationAttributesRequest extends S.Class<GetIdentityNotificationAttributesRequest>(
  "GetIdentityNotificationAttributesRequest",
)(
  { Identities: IdentityList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdentityPoliciesRequest extends S.Class<GetIdentityPoliciesRequest>(
  "GetIdentityPoliciesRequest",
)(
  { Identity: S.String, PolicyNames: PolicyNameList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdentityVerificationAttributesRequest extends S.Class<GetIdentityVerificationAttributesRequest>(
  "GetIdentityVerificationAttributesRequest",
)(
  { Identities: IdentityList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSendQuotaResponse extends S.Class<GetSendQuotaResponse>(
  "GetSendQuotaResponse",
)(
  {
    Max24HourSend: S.optional(S.Number),
    MaxSendRate: S.optional(S.Number),
    SentLast24Hours: S.optional(S.Number),
  },
  ns,
) {}
export class GetTemplateRequest extends S.Class<GetTemplateRequest>(
  "GetTemplateRequest",
)(
  { TemplateName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConfigurationSetsRequest extends S.Class<ListConfigurationSetsRequest>(
  "ListConfigurationSetsRequest",
)(
  { NextToken: S.optional(S.String), MaxItems: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCustomVerificationEmailTemplatesRequest extends S.Class<ListCustomVerificationEmailTemplatesRequest>(
  "ListCustomVerificationEmailTemplatesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListIdentitiesRequest extends S.Class<ListIdentitiesRequest>(
  "ListIdentitiesRequest",
)(
  {
    IdentityType: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListIdentityPoliciesRequest extends S.Class<ListIdentityPoliciesRequest>(
  "ListIdentityPoliciesRequest",
)(
  { Identity: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListReceiptFiltersResponse extends S.Class<ListReceiptFiltersResponse>(
  "ListReceiptFiltersResponse",
)({ Filters: S.optional(ReceiptFilterList) }, ns) {}
export class ListReceiptRuleSetsRequest extends S.Class<ListReceiptRuleSetsRequest>(
  "ListReceiptRuleSetsRequest",
)(
  { NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTemplatesRequest extends S.Class<ListTemplatesRequest>(
  "ListTemplatesRequest",
)(
  { NextToken: S.optional(S.String), MaxItems: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListVerifiedEmailAddressesResponse extends S.Class<ListVerifiedEmailAddressesResponse>(
  "ListVerifiedEmailAddressesResponse",
)({ VerifiedEmailAddresses: S.optional(AddressList) }, ns) {}
export class PutIdentityPolicyRequest extends S.Class<PutIdentityPolicyRequest>(
  "PutIdentityPolicyRequest",
)(
  { Identity: S.String, PolicyName: S.String, Policy: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutIdentityPolicyResponse extends S.Class<PutIdentityPolicyResponse>(
  "PutIdentityPolicyResponse",
)({}, ns) {}
export class ReorderReceiptRuleSetRequest extends S.Class<ReorderReceiptRuleSetRequest>(
  "ReorderReceiptRuleSetRequest",
)(
  { RuleSetName: S.String, RuleNames: ReceiptRuleNamesList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ReorderReceiptRuleSetResponse extends S.Class<ReorderReceiptRuleSetResponse>(
  "ReorderReceiptRuleSetResponse",
)({}, ns) {}
export class SendCustomVerificationEmailRequest extends S.Class<SendCustomVerificationEmailRequest>(
  "SendCustomVerificationEmailRequest",
)(
  {
    EmailAddress: S.String,
    TemplateName: S.String,
    ConfigurationSetName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Destination extends S.Class<Destination>("Destination")({
  ToAddresses: S.optional(AddressList),
  CcAddresses: S.optional(AddressList),
  BccAddresses: S.optional(AddressList),
}) {}
export class MessageTag extends S.Class<MessageTag>("MessageTag")({
  Name: S.String,
  Value: S.String,
}) {}
export const MessageTagList = S.Array(MessageTag);
export class SendTemplatedEmailRequest extends S.Class<SendTemplatedEmailRequest>(
  "SendTemplatedEmailRequest",
)(
  {
    Source: S.String,
    Destination: Destination,
    ReplyToAddresses: S.optional(AddressList),
    ReturnPath: S.optional(S.String),
    SourceArn: S.optional(S.String),
    ReturnPathArn: S.optional(S.String),
    Tags: S.optional(MessageTagList),
    ConfigurationSetName: S.optional(S.String),
    Template: S.String,
    TemplateArn: S.optional(S.String),
    TemplateData: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetActiveReceiptRuleSetRequest extends S.Class<SetActiveReceiptRuleSetRequest>(
  "SetActiveReceiptRuleSetRequest",
)(
  { RuleSetName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetActiveReceiptRuleSetResponse extends S.Class<SetActiveReceiptRuleSetResponse>(
  "SetActiveReceiptRuleSetResponse",
)({}, ns) {}
export class SetIdentityDkimEnabledRequest extends S.Class<SetIdentityDkimEnabledRequest>(
  "SetIdentityDkimEnabledRequest",
)(
  { Identity: S.String, DkimEnabled: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetIdentityDkimEnabledResponse extends S.Class<SetIdentityDkimEnabledResponse>(
  "SetIdentityDkimEnabledResponse",
)({}, ns) {}
export class SetIdentityFeedbackForwardingEnabledRequest extends S.Class<SetIdentityFeedbackForwardingEnabledRequest>(
  "SetIdentityFeedbackForwardingEnabledRequest",
)(
  { Identity: S.String, ForwardingEnabled: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetIdentityFeedbackForwardingEnabledResponse extends S.Class<SetIdentityFeedbackForwardingEnabledResponse>(
  "SetIdentityFeedbackForwardingEnabledResponse",
)({}, ns) {}
export class SetIdentityHeadersInNotificationsEnabledRequest extends S.Class<SetIdentityHeadersInNotificationsEnabledRequest>(
  "SetIdentityHeadersInNotificationsEnabledRequest",
)(
  { Identity: S.String, NotificationType: S.String, Enabled: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetIdentityHeadersInNotificationsEnabledResponse extends S.Class<SetIdentityHeadersInNotificationsEnabledResponse>(
  "SetIdentityHeadersInNotificationsEnabledResponse",
)({}, ns) {}
export class SetIdentityMailFromDomainRequest extends S.Class<SetIdentityMailFromDomainRequest>(
  "SetIdentityMailFromDomainRequest",
)(
  {
    Identity: S.String,
    MailFromDomain: S.optional(S.String),
    BehaviorOnMXFailure: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetIdentityMailFromDomainResponse extends S.Class<SetIdentityMailFromDomainResponse>(
  "SetIdentityMailFromDomainResponse",
)({}, ns) {}
export class SetIdentityNotificationTopicRequest extends S.Class<SetIdentityNotificationTopicRequest>(
  "SetIdentityNotificationTopicRequest",
)(
  {
    Identity: S.String,
    NotificationType: S.String,
    SnsTopic: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetIdentityNotificationTopicResponse extends S.Class<SetIdentityNotificationTopicResponse>(
  "SetIdentityNotificationTopicResponse",
)({}, ns) {}
export class SetReceiptRulePositionRequest extends S.Class<SetReceiptRulePositionRequest>(
  "SetReceiptRulePositionRequest",
)(
  { RuleSetName: S.String, RuleName: S.String, After: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetReceiptRulePositionResponse extends S.Class<SetReceiptRulePositionResponse>(
  "SetReceiptRulePositionResponse",
)({}, ns) {}
export class TestRenderTemplateRequest extends S.Class<TestRenderTemplateRequest>(
  "TestRenderTemplateRequest",
)(
  { TemplateName: S.String, TemplateData: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAccountSendingEnabledRequest extends S.Class<UpdateAccountSendingEnabledRequest>(
  "UpdateAccountSendingEnabledRequest",
)(
  { Enabled: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAccountSendingEnabledResponse extends S.Class<UpdateAccountSendingEnabledResponse>(
  "UpdateAccountSendingEnabledResponse",
)({}, ns) {}
export const EventTypes = S.Array(S.String);
export class KinesisFirehoseDestination extends S.Class<KinesisFirehoseDestination>(
  "KinesisFirehoseDestination",
)({ IAMRoleARN: S.String, DeliveryStreamARN: S.String }) {}
export class CloudWatchDimensionConfiguration extends S.Class<CloudWatchDimensionConfiguration>(
  "CloudWatchDimensionConfiguration",
)({
  DimensionName: S.String,
  DimensionValueSource: S.String,
  DefaultDimensionValue: S.String,
}) {}
export const CloudWatchDimensionConfigurations = S.Array(
  CloudWatchDimensionConfiguration,
);
export class CloudWatchDestination extends S.Class<CloudWatchDestination>(
  "CloudWatchDestination",
)({ DimensionConfigurations: CloudWatchDimensionConfigurations }) {}
export class SNSDestination extends S.Class<SNSDestination>("SNSDestination")({
  TopicARN: S.String,
}) {}
export class EventDestination extends S.Class<EventDestination>(
  "EventDestination",
)({
  Name: S.String,
  Enabled: S.optional(S.Boolean),
  MatchingEventTypes: EventTypes,
  KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
  CloudWatchDestination: S.optional(CloudWatchDestination),
  SNSDestination: S.optional(SNSDestination),
}) {}
export class UpdateConfigurationSetEventDestinationRequest extends S.Class<UpdateConfigurationSetEventDestinationRequest>(
  "UpdateConfigurationSetEventDestinationRequest",
)(
  { ConfigurationSetName: S.String, EventDestination: EventDestination },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateConfigurationSetEventDestinationResponse extends S.Class<UpdateConfigurationSetEventDestinationResponse>(
  "UpdateConfigurationSetEventDestinationResponse",
)({}, ns) {}
export class UpdateConfigurationSetReputationMetricsEnabledRequest extends S.Class<UpdateConfigurationSetReputationMetricsEnabledRequest>(
  "UpdateConfigurationSetReputationMetricsEnabledRequest",
)(
  { ConfigurationSetName: S.String, Enabled: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateConfigurationSetReputationMetricsEnabledResponse extends S.Class<UpdateConfigurationSetReputationMetricsEnabledResponse>(
  "UpdateConfigurationSetReputationMetricsEnabledResponse",
)({}, ns) {}
export class UpdateConfigurationSetSendingEnabledRequest extends S.Class<UpdateConfigurationSetSendingEnabledRequest>(
  "UpdateConfigurationSetSendingEnabledRequest",
)(
  { ConfigurationSetName: S.String, Enabled: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateConfigurationSetSendingEnabledResponse extends S.Class<UpdateConfigurationSetSendingEnabledResponse>(
  "UpdateConfigurationSetSendingEnabledResponse",
)({}, ns) {}
export class TrackingOptions extends S.Class<TrackingOptions>(
  "TrackingOptions",
)({ CustomRedirectDomain: S.optional(S.String) }) {}
export class UpdateConfigurationSetTrackingOptionsRequest extends S.Class<UpdateConfigurationSetTrackingOptionsRequest>(
  "UpdateConfigurationSetTrackingOptionsRequest",
)(
  { ConfigurationSetName: S.String, TrackingOptions: TrackingOptions },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateConfigurationSetTrackingOptionsResponse extends S.Class<UpdateConfigurationSetTrackingOptionsResponse>(
  "UpdateConfigurationSetTrackingOptionsResponse",
)({}, ns) {}
export class UpdateCustomVerificationEmailTemplateRequest extends S.Class<UpdateCustomVerificationEmailTemplateRequest>(
  "UpdateCustomVerificationEmailTemplateRequest",
)(
  {
    TemplateName: S.String,
    FromEmailAddress: S.optional(S.String),
    TemplateSubject: S.optional(S.String),
    TemplateContent: S.optional(S.String),
    SuccessRedirectionURL: S.optional(S.String),
    FailureRedirectionURL: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCustomVerificationEmailTemplateResponse extends S.Class<UpdateCustomVerificationEmailTemplateResponse>(
  "UpdateCustomVerificationEmailTemplateResponse",
)({}, ns) {}
export class UpdateReceiptRuleRequest extends S.Class<UpdateReceiptRuleRequest>(
  "UpdateReceiptRuleRequest",
)(
  { RuleSetName: S.String, Rule: ReceiptRule },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateReceiptRuleResponse extends S.Class<UpdateReceiptRuleResponse>(
  "UpdateReceiptRuleResponse",
)({}, ns) {}
export class Template extends S.Class<Template>("Template")({
  TemplateName: S.String,
  SubjectPart: S.optional(S.String),
  TextPart: S.optional(S.String),
  HtmlPart: S.optional(S.String),
}) {}
export class UpdateTemplateRequest extends S.Class<UpdateTemplateRequest>(
  "UpdateTemplateRequest",
)(
  { Template: Template },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTemplateResponse extends S.Class<UpdateTemplateResponse>(
  "UpdateTemplateResponse",
)({}, ns) {}
export class VerifyDomainDkimRequest extends S.Class<VerifyDomainDkimRequest>(
  "VerifyDomainDkimRequest",
)(
  { Domain: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class VerifyDomainIdentityRequest extends S.Class<VerifyDomainIdentityRequest>(
  "VerifyDomainIdentityRequest",
)(
  { Domain: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class VerifyEmailAddressRequest extends S.Class<VerifyEmailAddressRequest>(
  "VerifyEmailAddressRequest",
)(
  { EmailAddress: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class VerifyEmailAddressResponse extends S.Class<VerifyEmailAddressResponse>(
  "VerifyEmailAddressResponse",
)({}, ns) {}
export class VerifyEmailIdentityRequest extends S.Class<VerifyEmailIdentityRequest>(
  "VerifyEmailIdentityRequest",
)(
  { EmailAddress: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class VerifyEmailIdentityResponse extends S.Class<VerifyEmailIdentityResponse>(
  "VerifyEmailIdentityResponse",
)({}, ns) {}
export class ConfigurationSet extends S.Class<ConfigurationSet>(
  "ConfigurationSet",
)({ Name: S.String }) {}
export class ReceiptRuleSetMetadata extends S.Class<ReceiptRuleSetMetadata>(
  "ReceiptRuleSetMetadata",
)({
  Name: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const EventDestinations = S.Array(EventDestination);
export class SendDataPoint extends S.Class<SendDataPoint>("SendDataPoint")({
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DeliveryAttempts: S.optional(S.Number),
  Bounces: S.optional(S.Number),
  Complaints: S.optional(S.Number),
  Rejects: S.optional(S.Number),
}) {}
export const SendDataPointList = S.Array(SendDataPoint);
export const ConfigurationSets = S.Array(ConfigurationSet);
export const ReceiptRuleSetsLists = S.Array(ReceiptRuleSetMetadata);
export class DeliveryOptions extends S.Class<DeliveryOptions>(
  "DeliveryOptions",
)({ TlsPolicy: S.optional(S.String) }) {}
export class BulkEmailDestination extends S.Class<BulkEmailDestination>(
  "BulkEmailDestination",
)({
  Destination: Destination,
  ReplacementTags: S.optional(MessageTagList),
  ReplacementTemplateData: S.optional(S.String),
}) {}
export const BulkEmailDestinationList = S.Array(BulkEmailDestination);
export class RawMessage extends S.Class<RawMessage>("RawMessage")({
  Data: T.Blob,
}) {}
export const VerificationTokenList = S.Array(S.String);
export class CreateConfigurationSetRequest extends S.Class<CreateConfigurationSetRequest>(
  "CreateConfigurationSetRequest",
)(
  { ConfigurationSet: ConfigurationSet },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateConfigurationSetResponse extends S.Class<CreateConfigurationSetResponse>(
  "CreateConfigurationSetResponse",
)({}, ns) {}
export class CreateConfigurationSetTrackingOptionsRequest extends S.Class<CreateConfigurationSetTrackingOptionsRequest>(
  "CreateConfigurationSetTrackingOptionsRequest",
)(
  { ConfigurationSetName: S.String, TrackingOptions: TrackingOptions },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateConfigurationSetTrackingOptionsResponse extends S.Class<CreateConfigurationSetTrackingOptionsResponse>(
  "CreateConfigurationSetTrackingOptionsResponse",
)({}, ns) {}
export class CreateTemplateRequest extends S.Class<CreateTemplateRequest>(
  "CreateTemplateRequest",
)(
  { Template: Template },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTemplateResponse extends S.Class<CreateTemplateResponse>(
  "CreateTemplateResponse",
)({}, ns) {}
export class DescribeActiveReceiptRuleSetResponse extends S.Class<DescribeActiveReceiptRuleSetResponse>(
  "DescribeActiveReceiptRuleSetResponse",
)(
  {
    Metadata: S.optional(ReceiptRuleSetMetadata),
    Rules: S.optional(ReceiptRulesList),
  },
  ns,
) {}
export class DescribeReceiptRuleResponse extends S.Class<DescribeReceiptRuleResponse>(
  "DescribeReceiptRuleResponse",
)({ Rule: S.optional(ReceiptRule) }, ns) {}
export class DescribeReceiptRuleSetResponse extends S.Class<DescribeReceiptRuleSetResponse>(
  "DescribeReceiptRuleSetResponse",
)(
  {
    Metadata: S.optional(ReceiptRuleSetMetadata),
    Rules: S.optional(ReceiptRulesList),
  },
  ns,
) {}
export class GetCustomVerificationEmailTemplateResponse extends S.Class<GetCustomVerificationEmailTemplateResponse>(
  "GetCustomVerificationEmailTemplateResponse",
)(
  {
    TemplateName: S.optional(S.String),
    FromEmailAddress: S.optional(S.String),
    TemplateSubject: S.optional(S.String),
    TemplateContent: S.optional(S.String),
    SuccessRedirectionURL: S.optional(S.String),
    FailureRedirectionURL: S.optional(S.String),
  },
  ns,
) {}
export class GetSendStatisticsResponse extends S.Class<GetSendStatisticsResponse>(
  "GetSendStatisticsResponse",
)({ SendDataPoints: S.optional(SendDataPointList) }, ns) {}
export class GetTemplateResponse extends S.Class<GetTemplateResponse>(
  "GetTemplateResponse",
)({ Template: S.optional(Template) }, ns) {}
export class ListConfigurationSetsResponse extends S.Class<ListConfigurationSetsResponse>(
  "ListConfigurationSetsResponse",
)(
  {
    ConfigurationSets: S.optional(ConfigurationSets),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListIdentitiesResponse extends S.Class<ListIdentitiesResponse>(
  "ListIdentitiesResponse",
)({ Identities: IdentityList, NextToken: S.optional(S.String) }, ns) {}
export class ListIdentityPoliciesResponse extends S.Class<ListIdentityPoliciesResponse>(
  "ListIdentityPoliciesResponse",
)({ PolicyNames: PolicyNameList }, ns) {}
export class ListReceiptRuleSetsResponse extends S.Class<ListReceiptRuleSetsResponse>(
  "ListReceiptRuleSetsResponse",
)(
  {
    RuleSets: S.optional(ReceiptRuleSetsLists),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class PutConfigurationSetDeliveryOptionsRequest extends S.Class<PutConfigurationSetDeliveryOptionsRequest>(
  "PutConfigurationSetDeliveryOptionsRequest",
)(
  {
    ConfigurationSetName: S.String,
    DeliveryOptions: S.optional(DeliveryOptions),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutConfigurationSetDeliveryOptionsResponse extends S.Class<PutConfigurationSetDeliveryOptionsResponse>(
  "PutConfigurationSetDeliveryOptionsResponse",
)({}, ns) {}
export class SendBulkTemplatedEmailRequest extends S.Class<SendBulkTemplatedEmailRequest>(
  "SendBulkTemplatedEmailRequest",
)(
  {
    Source: S.String,
    SourceArn: S.optional(S.String),
    ReplyToAddresses: S.optional(AddressList),
    ReturnPath: S.optional(S.String),
    ReturnPathArn: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    DefaultTags: S.optional(MessageTagList),
    Template: S.String,
    TemplateArn: S.optional(S.String),
    DefaultTemplateData: S.String,
    Destinations: BulkEmailDestinationList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendCustomVerificationEmailResponse extends S.Class<SendCustomVerificationEmailResponse>(
  "SendCustomVerificationEmailResponse",
)({ MessageId: S.optional(S.String) }, ns) {}
export class SendRawEmailRequest extends S.Class<SendRawEmailRequest>(
  "SendRawEmailRequest",
)(
  {
    Source: S.optional(S.String),
    Destinations: S.optional(AddressList),
    RawMessage: RawMessage,
    FromArn: S.optional(S.String),
    SourceArn: S.optional(S.String),
    ReturnPathArn: S.optional(S.String),
    Tags: S.optional(MessageTagList),
    ConfigurationSetName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendTemplatedEmailResponse extends S.Class<SendTemplatedEmailResponse>(
  "SendTemplatedEmailResponse",
)({ MessageId: S.String }, ns) {}
export class TestRenderTemplateResponse extends S.Class<TestRenderTemplateResponse>(
  "TestRenderTemplateResponse",
)({ RenderedTemplate: S.optional(S.String) }, ns) {}
export class VerifyDomainDkimResponse extends S.Class<VerifyDomainDkimResponse>(
  "VerifyDomainDkimResponse",
)({ DkimTokens: VerificationTokenList }, ns) {}
export class VerifyDomainIdentityResponse extends S.Class<VerifyDomainIdentityResponse>(
  "VerifyDomainIdentityResponse",
)({ VerificationToken: S.String }, ns) {}
export class ExtensionField extends S.Class<ExtensionField>("ExtensionField")({
  Name: S.String,
  Value: S.String,
}) {}
export const ExtensionFieldList = S.Array(ExtensionField);
export class RecipientDsnFields extends S.Class<RecipientDsnFields>(
  "RecipientDsnFields",
)({
  FinalRecipient: S.optional(S.String),
  Action: S.String,
  RemoteMta: S.optional(S.String),
  Status: S.String,
  DiagnosticCode: S.optional(S.String),
  LastAttemptDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ExtensionFields: S.optional(ExtensionFieldList),
}) {}
export class Content extends S.Class<Content>("Content")({
  Data: S.String,
  Charset: S.optional(S.String),
}) {}
export class Body extends S.Class<Body>("Body")({
  Text: S.optional(Content),
  Html: S.optional(Content),
}) {}
export class ReputationOptions extends S.Class<ReputationOptions>(
  "ReputationOptions",
)({
  SendingEnabled: S.optional(S.Boolean),
  ReputationMetricsEnabled: S.optional(S.Boolean),
  LastFreshStart: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const PolicyMap = S.Record({ key: S.String, value: S.String });
export class CustomVerificationEmailTemplate extends S.Class<CustomVerificationEmailTemplate>(
  "CustomVerificationEmailTemplate",
)({
  TemplateName: S.optional(S.String),
  FromEmailAddress: S.optional(S.String),
  TemplateSubject: S.optional(S.String),
  SuccessRedirectionURL: S.optional(S.String),
  FailureRedirectionURL: S.optional(S.String),
}) {}
export const CustomVerificationEmailTemplates = S.Array(
  CustomVerificationEmailTemplate,
);
export class TemplateMetadata extends S.Class<TemplateMetadata>(
  "TemplateMetadata",
)({
  Name: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const TemplateMetadataList = S.Array(TemplateMetadata);
export class MessageDsn extends S.Class<MessageDsn>("MessageDsn")({
  ReportingMta: S.String,
  ArrivalDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ExtensionFields: S.optional(ExtensionFieldList),
}) {}
export class BouncedRecipientInfo extends S.Class<BouncedRecipientInfo>(
  "BouncedRecipientInfo",
)({
  Recipient: S.String,
  RecipientArn: S.optional(S.String),
  BounceType: S.optional(S.String),
  RecipientDsnFields: S.optional(RecipientDsnFields),
}) {}
export const BouncedRecipientInfoList = S.Array(BouncedRecipientInfo);
export class Message extends S.Class<Message>("Message")({
  Subject: Content,
  Body: Body,
}) {}
export class CreateReceiptFilterRequest extends S.Class<CreateReceiptFilterRequest>(
  "CreateReceiptFilterRequest",
)(
  { Filter: ReceiptFilter },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateReceiptFilterResponse extends S.Class<CreateReceiptFilterResponse>(
  "CreateReceiptFilterResponse",
)({}, ns) {}
export class DescribeConfigurationSetResponse extends S.Class<DescribeConfigurationSetResponse>(
  "DescribeConfigurationSetResponse",
)(
  {
    ConfigurationSet: S.optional(ConfigurationSet),
    EventDestinations: S.optional(EventDestinations),
    TrackingOptions: S.optional(TrackingOptions),
    DeliveryOptions: S.optional(DeliveryOptions),
    ReputationOptions: S.optional(ReputationOptions),
  },
  ns,
) {}
export class GetIdentityPoliciesResponse extends S.Class<GetIdentityPoliciesResponse>(
  "GetIdentityPoliciesResponse",
)({ Policies: PolicyMap }, ns) {}
export class ListCustomVerificationEmailTemplatesResponse extends S.Class<ListCustomVerificationEmailTemplatesResponse>(
  "ListCustomVerificationEmailTemplatesResponse",
)(
  {
    CustomVerificationEmailTemplates: S.optional(
      CustomVerificationEmailTemplates,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTemplatesResponse extends S.Class<ListTemplatesResponse>(
  "ListTemplatesResponse",
)(
  {
    TemplatesMetadata: S.optional(TemplateMetadataList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class SendBounceRequest extends S.Class<SendBounceRequest>(
  "SendBounceRequest",
)(
  {
    OriginalMessageId: S.String,
    BounceSender: S.String,
    Explanation: S.optional(S.String),
    MessageDsn: S.optional(MessageDsn),
    BouncedRecipientInfoList: BouncedRecipientInfoList,
    BounceSenderArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendEmailRequest extends S.Class<SendEmailRequest>(
  "SendEmailRequest",
)(
  {
    Source: S.String,
    Destination: Destination,
    Message: Message,
    ReplyToAddresses: S.optional(AddressList),
    ReturnPath: S.optional(S.String),
    SourceArn: S.optional(S.String),
    ReturnPathArn: S.optional(S.String),
    Tags: S.optional(MessageTagList),
    ConfigurationSetName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendRawEmailResponse extends S.Class<SendRawEmailResponse>(
  "SendRawEmailResponse",
)({ MessageId: S.String }, ns) {}
export class IdentityDkimAttributes extends S.Class<IdentityDkimAttributes>(
  "IdentityDkimAttributes",
)({
  DkimEnabled: S.Boolean,
  DkimVerificationStatus: S.String,
  DkimTokens: S.optional(VerificationTokenList),
}) {}
export class IdentityMailFromDomainAttributes extends S.Class<IdentityMailFromDomainAttributes>(
  "IdentityMailFromDomainAttributes",
)({
  MailFromDomain: S.String,
  MailFromDomainStatus: S.String,
  BehaviorOnMXFailure: S.String,
}) {}
export class IdentityNotificationAttributes extends S.Class<IdentityNotificationAttributes>(
  "IdentityNotificationAttributes",
)({
  BounceTopic: S.String,
  ComplaintTopic: S.String,
  DeliveryTopic: S.String,
  ForwardingEnabled: S.Boolean,
  HeadersInBounceNotificationsEnabled: S.optional(S.Boolean),
  HeadersInComplaintNotificationsEnabled: S.optional(S.Boolean),
  HeadersInDeliveryNotificationsEnabled: S.optional(S.Boolean),
}) {}
export class IdentityVerificationAttributes extends S.Class<IdentityVerificationAttributes>(
  "IdentityVerificationAttributes",
)({ VerificationStatus: S.String, VerificationToken: S.optional(S.String) }) {}
export const DkimAttributes = S.Record({
  key: S.String,
  value: IdentityDkimAttributes,
});
export const MailFromDomainAttributes = S.Record({
  key: S.String,
  value: IdentityMailFromDomainAttributes,
});
export const NotificationAttributes = S.Record({
  key: S.String,
  value: IdentityNotificationAttributes,
});
export const VerificationAttributes = S.Record({
  key: S.String,
  value: IdentityVerificationAttributes,
});
export class BulkEmailDestinationStatus extends S.Class<BulkEmailDestinationStatus>(
  "BulkEmailDestinationStatus",
)({
  Status: S.optional(S.String),
  Error: S.optional(S.String),
  MessageId: S.optional(S.String),
}) {}
export const BulkEmailDestinationStatusList = S.Array(
  BulkEmailDestinationStatus,
);
export class CreateConfigurationSetEventDestinationRequest extends S.Class<CreateConfigurationSetEventDestinationRequest>(
  "CreateConfigurationSetEventDestinationRequest",
)(
  { ConfigurationSetName: S.String, EventDestination: EventDestination },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateConfigurationSetEventDestinationResponse extends S.Class<CreateConfigurationSetEventDestinationResponse>(
  "CreateConfigurationSetEventDestinationResponse",
)({}, ns) {}
export class CreateReceiptRuleRequest extends S.Class<CreateReceiptRuleRequest>(
  "CreateReceiptRuleRequest",
)(
  { RuleSetName: S.String, After: S.optional(S.String), Rule: ReceiptRule },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateReceiptRuleResponse extends S.Class<CreateReceiptRuleResponse>(
  "CreateReceiptRuleResponse",
)({}, ns) {}
export class GetIdentityDkimAttributesResponse extends S.Class<GetIdentityDkimAttributesResponse>(
  "GetIdentityDkimAttributesResponse",
)({ DkimAttributes: DkimAttributes }, ns) {}
export class GetIdentityMailFromDomainAttributesResponse extends S.Class<GetIdentityMailFromDomainAttributesResponse>(
  "GetIdentityMailFromDomainAttributesResponse",
)({ MailFromDomainAttributes: MailFromDomainAttributes }, ns) {}
export class GetIdentityNotificationAttributesResponse extends S.Class<GetIdentityNotificationAttributesResponse>(
  "GetIdentityNotificationAttributesResponse",
)({ NotificationAttributes: NotificationAttributes }, ns) {}
export class GetIdentityVerificationAttributesResponse extends S.Class<GetIdentityVerificationAttributesResponse>(
  "GetIdentityVerificationAttributesResponse",
)({ VerificationAttributes: VerificationAttributes }, ns) {}
export class SendBounceResponse extends S.Class<SendBounceResponse>(
  "SendBounceResponse",
)({ MessageId: S.optional(S.String) }, ns) {}
export class SendBulkTemplatedEmailResponse extends S.Class<SendBulkTemplatedEmailResponse>(
  "SendBulkTemplatedEmailResponse",
)({ Status: BulkEmailDestinationStatusList }, ns) {}
export class SendEmailResponse extends S.Class<SendEmailResponse>(
  "SendEmailResponse",
)({ MessageId: S.String }, ns) {}

//# Errors
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  {},
  T.AwsQueryError({ code: "AlreadyExists", httpResponseCode: 400 }),
) {}
export class ConfigurationSetDoesNotExistException extends S.TaggedError<ConfigurationSetDoesNotExistException>()(
  "ConfigurationSetDoesNotExistException",
  {},
  T.AwsQueryError({
    code: "ConfigurationSetDoesNotExist",
    httpResponseCode: 400,
  }),
) {}
export class RuleSetDoesNotExistException extends S.TaggedError<RuleSetDoesNotExistException>()(
  "RuleSetDoesNotExistException",
  {},
  T.AwsQueryError({ code: "RuleSetDoesNotExist", httpResponseCode: 400 }),
) {}
export class RuleDoesNotExistException extends S.TaggedError<RuleDoesNotExistException>()(
  "RuleDoesNotExistException",
  {},
  T.AwsQueryError({ code: "RuleDoesNotExist", httpResponseCode: 400 }),
) {}
export class EventDestinationDoesNotExistException extends S.TaggedError<EventDestinationDoesNotExistException>()(
  "EventDestinationDoesNotExistException",
  {},
  T.AwsQueryError({
    code: "EventDestinationDoesNotExist",
    httpResponseCode: 400,
  }),
) {}
export class CustomVerificationEmailInvalidContentException extends S.TaggedError<CustomVerificationEmailInvalidContentException>()(
  "CustomVerificationEmailInvalidContentException",
  {},
  T.AwsQueryError({
    code: "CustomVerificationEmailInvalidContent",
    httpResponseCode: 400,
  }),
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
  T.AwsQueryError({ code: "LimitExceeded", httpResponseCode: 400 }),
) {}
export class InvalidTrackingOptionsException extends S.TaggedError<InvalidTrackingOptionsException>()(
  "InvalidTrackingOptionsException",
  {},
  T.AwsQueryError({ code: "InvalidTrackingOptions", httpResponseCode: 400 }),
) {}
export class InvalidTemplateException extends S.TaggedError<InvalidTemplateException>()(
  "InvalidTemplateException",
  {},
  T.AwsQueryError({ code: "InvalidTemplate", httpResponseCode: 400 }),
) {}
export class TrackingOptionsDoesNotExistException extends S.TaggedError<TrackingOptionsDoesNotExistException>()(
  "TrackingOptionsDoesNotExistException",
  { ConfigurationSetName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TrackingOptionsDoesNotExistException",
    httpResponseCode: 400,
  }),
) {}
export class CannotDeleteException extends S.TaggedError<CannotDeleteException>()(
  "CannotDeleteException",
  { Name: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "CannotDelete", httpResponseCode: 400 }),
) {}
export class CustomVerificationEmailTemplateDoesNotExistException extends S.TaggedError<CustomVerificationEmailTemplateDoesNotExistException>()(
  "CustomVerificationEmailTemplateDoesNotExistException",
  {},
  T.AwsQueryError({
    code: "CustomVerificationEmailTemplateDoesNotExist",
    httpResponseCode: 400,
  }),
) {}
export class InvalidPolicyException extends S.TaggedError<InvalidPolicyException>()(
  "InvalidPolicyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidPolicy", httpResponseCode: 400 }),
) {}
export class InvalidCloudWatchDestinationException extends S.TaggedError<InvalidCloudWatchDestinationException>()(
  "InvalidCloudWatchDestinationException",
  {
    ConfigurationSetName: S.optional(S.String),
    EventDestinationName: S.optional(S.String),
    message: S.optional(S.String),
  },
  T.AwsQueryError({
    code: "InvalidCloudWatchDestination",
    httpResponseCode: 400,
  }),
) {}
export class FromEmailAddressNotVerifiedException extends S.TaggedError<FromEmailAddressNotVerifiedException>()(
  "FromEmailAddressNotVerifiedException",
  {},
  T.AwsQueryError({
    code: "FromEmailAddressNotVerified",
    httpResponseCode: 400,
  }),
) {}
export class InvalidLambdaFunctionException extends S.TaggedError<InvalidLambdaFunctionException>()(
  "InvalidLambdaFunctionException",
  { FunctionArn: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidLambdaFunction", httpResponseCode: 400 }),
) {}
export class TemplateDoesNotExistException extends S.TaggedError<TemplateDoesNotExistException>()(
  "TemplateDoesNotExistException",
  {},
  T.AwsQueryError({ code: "TemplateDoesNotExist", httpResponseCode: 400 }),
) {}
export class ConfigurationSetAlreadyExistsException extends S.TaggedError<ConfigurationSetAlreadyExistsException>()(
  "ConfigurationSetAlreadyExistsException",
  { ConfigurationSetName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ConfigurationSetAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class TrackingOptionsAlreadyExistsException extends S.TaggedError<TrackingOptionsAlreadyExistsException>()(
  "TrackingOptionsAlreadyExistsException",
  { ConfigurationSetName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TrackingOptionsAlreadyExistsException",
    httpResponseCode: 400,
  }),
) {}
export class CustomVerificationEmailTemplateAlreadyExistsException extends S.TaggedError<CustomVerificationEmailTemplateAlreadyExistsException>()(
  "CustomVerificationEmailTemplateAlreadyExistsException",
  {
    CustomVerificationEmailTemplateName: S.optional(S.String),
    message: S.optional(S.String),
  },
  T.AwsQueryError({
    code: "CustomVerificationEmailTemplateAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDeliveryOptionsException extends S.TaggedError<InvalidDeliveryOptionsException>()(
  "InvalidDeliveryOptionsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDeliveryOptions", httpResponseCode: 400 }),
) {}
export class AccountSendingPausedException extends S.TaggedError<AccountSendingPausedException>()(
  "AccountSendingPausedException",
  {},
  T.AwsQueryError({
    code: "AccountSendingPausedException",
    httpResponseCode: 400,
  }),
) {}
export class ConfigurationSetSendingPausedException extends S.TaggedError<ConfigurationSetSendingPausedException>()(
  "ConfigurationSetSendingPausedException",
  {},
  T.AwsQueryError({
    code: "ConfigurationSetSendingPausedException",
    httpResponseCode: 400,
  }),
) {}
export class InvalidRenderingParameterException extends S.TaggedError<InvalidRenderingParameterException>()(
  "InvalidRenderingParameterException",
  { TemplateName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRenderingParameter", httpResponseCode: 400 }),
) {}
export class InvalidFirehoseDestinationException extends S.TaggedError<InvalidFirehoseDestinationException>()(
  "InvalidFirehoseDestinationException",
  {
    ConfigurationSetName: S.optional(S.String),
    EventDestinationName: S.optional(S.String),
    message: S.optional(S.String),
  },
  T.AwsQueryError({
    code: "InvalidFirehoseDestination",
    httpResponseCode: 400,
  }),
) {}
export class InvalidS3ConfigurationException extends S.TaggedError<InvalidS3ConfigurationException>()(
  "InvalidS3ConfigurationException",
  { Bucket: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidS3Configuration", httpResponseCode: 400 }),
) {}
export class InvalidConfigurationSetException extends S.TaggedError<InvalidConfigurationSetException>()(
  "InvalidConfigurationSetException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidConfigurationSet", httpResponseCode: 400 }),
) {}
export class InvalidSnsTopicException extends S.TaggedError<InvalidSnsTopicException>()(
  "InvalidSnsTopicException",
  {},
  T.AwsQueryError({ code: "InvalidSnsTopic", httpResponseCode: 400 }),
) {}
export class MessageRejected extends S.TaggedError<MessageRejected>()(
  "MessageRejected",
  {},
  T.AwsQueryError({ code: "MessageRejected", httpResponseCode: 400 }),
) {}
export class MailFromDomainNotVerifiedException extends S.TaggedError<MailFromDomainNotVerifiedException>()(
  "MailFromDomainNotVerifiedException",
  {},
  T.AwsQueryError({
    code: "MailFromDomainNotVerifiedException",
    httpResponseCode: 400,
  }),
) {}
export class MissingRenderingAttributeException extends S.TaggedError<MissingRenderingAttributeException>()(
  "MissingRenderingAttributeException",
  { TemplateName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "MissingRenderingAttribute", httpResponseCode: 400 }),
) {}
export class InvalidSNSDestinationException extends S.TaggedError<InvalidSNSDestinationException>()(
  "InvalidSNSDestinationException",
  {
    ConfigurationSetName: S.optional(S.String),
    EventDestinationName: S.optional(S.String),
    message: S.optional(S.String),
  },
  T.AwsQueryError({ code: "InvalidSNSDestination", httpResponseCode: 400 }),
) {}
export class EventDestinationAlreadyExistsException extends S.TaggedError<EventDestinationAlreadyExistsException>()(
  "EventDestinationAlreadyExistsException",
  {
    ConfigurationSetName: S.optional(S.String),
    EventDestinationName: S.optional(S.String),
    message: S.optional(S.String),
  },
  T.AwsQueryError({
    code: "EventDestinationAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class ProductionAccessNotGrantedException extends S.TaggedError<ProductionAccessNotGrantedException>()(
  "ProductionAccessNotGrantedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ProductionAccessNotGranted",
    httpResponseCode: 400,
  }),
) {}

//# Operations
/**
 * Deletes an existing custom verification email template.
 *
 * For more information about custom verification email templates, see Using
 * Custom Verification Email Templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteCustomVerificationEmailTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCustomVerificationEmailTemplateRequest,
    output: DeleteCustomVerificationEmailTemplateResponse,
    errors: [],
  }));
/**
 * Deletes the specified identity (an email address or a domain) from the list of
 * verified identities.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentityRequest,
  output: DeleteIdentityResponse,
  errors: [],
}));
/**
 * Deletes the specified sending authorization policy for the given identity (an email
 * address or a domain). This operation returns successfully even if a policy with the
 * specified name does not exist.
 *
 * This operation is for the identity owner only. If you have not verified the
 * identity, it returns an error.
 *
 * Sending authorization is a feature that enables an identity owner to authorize other
 * senders to use its identities. For information about using sending authorization, see
 * the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteIdentityPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteIdentityPolicyRequest,
    output: DeleteIdentityPolicyResponse,
    errors: [],
  }),
);
/**
 * Deletes the specified IP address filter.
 *
 * For information about managing IP address filters, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteReceiptFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReceiptFilterRequest,
  output: DeleteReceiptFilterResponse,
  errors: [],
}));
/**
 * Deletes an email template.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTemplateRequest,
  output: DeleteTemplateResponse,
  errors: [],
}));
/**
 * Deprecated. Use the `DeleteIdentity` operation to delete email addresses
 * and domains.
 */
export const deleteVerifiedEmailAddress = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVerifiedEmailAddressRequest,
    output: DeleteVerifiedEmailAddressResponse,
    errors: [],
  }),
);
/**
 * Returns the email sending status of the Amazon SES account for the current Region.
 *
 * You can execute this operation no more than once per second.
 */
export const getAccountSendingEnabled = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAccountSendingEnabledRequest,
    output: GetAccountSendingEnabledResponse,
    errors: [],
  }),
);
/**
 * Provides the sending limits for the Amazon SES account.
 *
 * You can execute this operation no more than once per second.
 */
export const getSendQuota = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSendQuotaRequest,
  output: GetSendQuotaResponse,
  errors: [],
}));
/**
 * Lists the IP address filters associated with your Amazon Web Services account in the current
 * Amazon Web Services Region.
 *
 * For information about managing IP address filters, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const listReceiptFilters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReceiptFiltersRequest,
  output: ListReceiptFiltersResponse,
  errors: [],
}));
/**
 * Deprecated. Use the `ListIdentities` operation to list the email addresses
 * and domains associated with your account.
 */
export const listVerifiedEmailAddresses = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListVerifiedEmailAddressesRequest,
    output: ListVerifiedEmailAddressesResponse,
    errors: [],
  }),
);
/**
 * Sets the specified receipt rule set as the active receipt rule set.
 *
 * To disable your email-receiving through Amazon SES completely, you can call this
 * operation with `RuleSetName` set to null.
 *
 * For information about managing receipt rule sets, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const setActiveReceiptRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetActiveReceiptRuleSetRequest,
    output: SetActiveReceiptRuleSetResponse,
    errors: [RuleSetDoesNotExistException],
  }),
);
/**
 * Enables or disables Easy DKIM signing of email sent from an identity. If Easy DKIM
 * signing is enabled for a domain, then Amazon SES uses DKIM to sign all email that it sends
 * from addresses on that domain. If Easy DKIM signing is enabled for an email address,
 * then Amazon SES uses DKIM to sign all email it sends from that address.
 *
 * For email addresses (for example, `user@example.com`), you can only
 * enable DKIM signing if the corresponding domain (in this case,
 * `example.com`) has been set up to use Easy DKIM.
 *
 * You can enable DKIM signing for an identity at any time after you start the
 * verification process for the identity, even if the verification process isn't complete.
 *
 * You can execute this operation no more than once per second.
 *
 * For more information about Easy DKIM signing, go to the Amazon SES Developer
 * Guide.
 */
export const setIdentityDkimEnabled = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetIdentityDkimEnabledRequest,
    output: SetIdentityDkimEnabledResponse,
    errors: [],
  }),
);
/**
 * Given an identity (an email address or a domain), enables or disables whether Amazon SES
 * forwards bounce and complaint notifications as email. Feedback forwarding can only be
 * disabled when Amazon Simple Notification Service (Amazon SNS) topics are specified for both bounces and
 * complaints.
 *
 * Feedback forwarding does not apply to delivery notifications. Delivery
 * notifications are only available through Amazon SNS.
 *
 * You can execute this operation no more than once per second.
 *
 * For more information about using notifications with Amazon SES, see the Amazon SES
 * Developer Guide.
 */
export const setIdentityFeedbackForwardingEnabled =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetIdentityFeedbackForwardingEnabledRequest,
    output: SetIdentityFeedbackForwardingEnabledResponse,
    errors: [],
  }));
/**
 * Given an identity (an email address or a domain), sets whether Amazon SES includes the
 * original email headers in the Amazon Simple Notification Service (Amazon SNS) notifications of a specified
 * type.
 *
 * You can execute this operation no more than once per second.
 *
 * For more information about using notifications with Amazon SES, see the Amazon SES
 * Developer Guide.
 */
export const setIdentityHeadersInNotificationsEnabled =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetIdentityHeadersInNotificationsEnabledRequest,
    output: SetIdentityHeadersInNotificationsEnabledResponse,
    errors: [],
  }));
/**
 * Enables or disables the custom MAIL FROM domain setup for a verified identity (an
 * email address or a domain).
 *
 * To send emails using the specified MAIL FROM domain, you must add an MX record to
 * your MAIL FROM domain's DNS settings. To ensure that your emails pass Sender Policy
 * Framework (SPF) checks, you must also add or update an SPF record. For more
 * information, see the Amazon SES Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const setIdentityMailFromDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetIdentityMailFromDomainRequest,
    output: SetIdentityMailFromDomainResponse,
    errors: [],
  }),
);
/**
 * Sets an Amazon Simple Notification Service (Amazon SNS) topic to use when delivering notifications. When you use
 * this operation, you specify a verified identity, such as an email address or domain.
 * When you send an email that uses the chosen identity in the Source field, Amazon SES sends
 * notifications to the topic you specified. You can send bounce, complaint, or delivery
 * notifications (or any combination of the three) to the Amazon SNS topic that you
 * specify.
 *
 * You can execute this operation no more than once per second.
 *
 * For more information about feedback notification, see the Amazon SES
 * Developer Guide.
 */
export const setIdentityNotificationTopic =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetIdentityNotificationTopicRequest,
    output: SetIdentityNotificationTopicResponse,
    errors: [],
  }));
/**
 * Sets the position of the specified receipt rule in the receipt rule set.
 *
 * For information about managing receipt rules, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const setReceiptRulePosition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetReceiptRulePositionRequest,
    output: SetReceiptRulePositionResponse,
    errors: [RuleDoesNotExistException, RuleSetDoesNotExistException],
  }),
);
/**
 * Enables or disables email sending across your entire Amazon SES account in the current
 * Amazon Web Services Region. You can use this operation in conjunction with Amazon CloudWatch alarms to
 * temporarily pause email sending across your Amazon SES account in a given Amazon Web Services Region when
 * reputation metrics (such as your bounce or complaint rates) reach certain
 * thresholds.
 *
 * You can execute this operation no more than once per second.
 */
export const updateAccountSendingEnabled = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountSendingEnabledRequest,
    output: UpdateAccountSendingEnabledResponse,
    errors: [],
  }),
);
/**
 * Enables or disables the publishing of reputation metrics for emails sent using a
 * specific configuration set in a given Amazon Web Services Region. Reputation metrics include bounce
 * and complaint rates. These metrics are published to Amazon CloudWatch. By using CloudWatch, you can
 * create alarms when bounce or complaint rates exceed certain thresholds.
 *
 * You can execute this operation no more than once per second.
 */
export const updateConfigurationSetReputationMetricsEnabled =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfigurationSetReputationMetricsEnabledRequest,
    output: UpdateConfigurationSetReputationMetricsEnabledResponse,
    errors: [ConfigurationSetDoesNotExistException],
  }));
/**
 * Enables or disables email sending for messages sent using a specific configuration set
 * in a given Amazon Web Services Region. You can use this operation in conjunction with Amazon CloudWatch alarms
 * to temporarily pause email sending for a configuration set when the reputation metrics
 * for that configuration set (such as your bounce on complaint rate) exceed certain
 * thresholds.
 *
 * You can execute this operation no more than once per second.
 */
export const updateConfigurationSetSendingEnabled =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfigurationSetSendingEnabledRequest,
    output: UpdateConfigurationSetSendingEnabledResponse,
    errors: [ConfigurationSetDoesNotExistException],
  }));
/**
 * Deprecated. Use the `VerifyEmailIdentity` operation to verify a new email
 * address.
 */
export const verifyEmailAddress = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyEmailAddressRequest,
  output: VerifyEmailAddressResponse,
  errors: [],
}));
/**
 * Adds an email address to the list of identities for your Amazon SES account in the current
 * Amazon Web Services Region and attempts to verify it. As a result of executing this operation, a
 * verification email is sent to the specified address.
 *
 * You can execute this operation no more than once per second.
 */
export const verifyEmailIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyEmailIdentityRequest,
  output: VerifyEmailIdentityResponse,
  errors: [],
}));
/**
 * Creates a receipt rule set by cloning an existing one. All receipt rules and
 * configurations are copied to the new receipt rule set and are completely independent of
 * the source rule set.
 *
 * For information about setting up rule sets, see the Amazon SES Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const cloneReceiptRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CloneReceiptRuleSetRequest,
  output: CloneReceiptRuleSetResponse,
  errors: [
    AlreadyExistsException,
    LimitExceededException,
    RuleSetDoesNotExistException,
  ],
}));
/**
 * Creates an empty receipt rule set.
 *
 * For information about setting up receipt rule sets, see the Amazon SES Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createReceiptRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateReceiptRuleSetRequest,
    output: CreateReceiptRuleSetResponse,
    errors: [AlreadyExistsException, LimitExceededException],
  }),
);
/**
 * Creates an email template. Email templates enable you to send personalized email to
 * one or more destinations in a single operation. For more information, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTemplateRequest,
  output: CreateTemplateResponse,
  errors: [
    AlreadyExistsException,
    InvalidTemplateException,
    LimitExceededException,
  ],
}));
/**
 * Deletes a configuration set. Configuration sets enable you to publish email sending
 * events. For information about using configuration sets, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteConfigurationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConfigurationSetRequest,
    output: DeleteConfigurationSetResponse,
    errors: [ConfigurationSetDoesNotExistException],
  }),
);
/**
 * Deletes a configuration set event destination. Configuration set event destinations
 * are associated with configuration sets, which enable you to publish email sending
 * events. For information about using configuration sets, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteConfigurationSetEventDestination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfigurationSetEventDestinationRequest,
    output: DeleteConfigurationSetEventDestinationResponse,
    errors: [
      ConfigurationSetDoesNotExistException,
      EventDestinationDoesNotExistException,
    ],
  }));
/**
 * Deletes an association between a configuration set and a custom domain for open and
 * click event tracking.
 *
 * By default, images and links used for tracking open and click events are hosted on
 * domains operated by Amazon SES. You can configure a subdomain of your own to handle these
 * events. For information about using custom domains, see the Amazon SES Developer Guide.
 *
 * Deleting this kind of association results in emails sent using the specified
 * configuration set to capture open and click events using the standard,
 * Amazon SES-operated domains.
 */
export const deleteConfigurationSetTrackingOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteConfigurationSetTrackingOptionsRequest,
    output: DeleteConfigurationSetTrackingOptionsResponse,
    errors: [
      ConfigurationSetDoesNotExistException,
      TrackingOptionsDoesNotExistException,
    ],
  }));
/**
 * Deletes the specified receipt rule.
 *
 * For information about managing receipt rules, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteReceiptRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReceiptRuleRequest,
  output: DeleteReceiptRuleResponse,
  errors: [RuleSetDoesNotExistException],
}));
/**
 * Deletes the specified receipt rule set and all of the receipt rules it
 * contains.
 *
 * The currently active rule set cannot be deleted.
 *
 * For information about managing receipt rule sets, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteReceiptRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteReceiptRuleSetRequest,
    output: DeleteReceiptRuleSetResponse,
    errors: [CannotDeleteException],
  }),
);
/**
 * Returns the metadata and receipt rules for the receipt rule set that is currently
 * active.
 *
 * For information about setting up receipt rule sets, see the Amazon SES Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const describeActiveReceiptRuleSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeActiveReceiptRuleSetRequest,
    output: DescribeActiveReceiptRuleSetResponse,
    errors: [],
  }));
/**
 * Returns the details of the specified receipt rule.
 *
 * For information about setting up receipt rules, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const describeReceiptRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReceiptRuleRequest,
  output: DescribeReceiptRuleResponse,
  errors: [RuleDoesNotExistException, RuleSetDoesNotExistException],
}));
/**
 * Returns the details of the specified receipt rule set.
 *
 * For information about managing receipt rule sets, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const describeReceiptRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeReceiptRuleSetRequest,
    output: DescribeReceiptRuleSetResponse,
    errors: [RuleSetDoesNotExistException],
  }),
);
/**
 * Returns the custom email verification template for the template name you
 * specify.
 *
 * For more information about custom verification email templates, see Using
 * Custom Verification Email Templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const getCustomVerificationEmailTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCustomVerificationEmailTemplateRequest,
    output: GetCustomVerificationEmailTemplateResponse,
    errors: [CustomVerificationEmailTemplateDoesNotExistException],
  }));
/**
 * Provides sending statistics for the current Amazon Web Services Region. The result is a list of data
 * points, representing the last two weeks of sending activity. Each data point in the list
 * contains statistics for a 15-minute period of time.
 *
 * You can execute this operation no more than once per second.
 */
export const getSendStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSendStatisticsRequest,
  output: GetSendStatisticsResponse,
  errors: [],
}));
/**
 * Provides a list of the configuration sets associated with your Amazon SES account in the
 * current Amazon Web Services Region. For information about using configuration sets, see Monitoring
 * Your Amazon SES Sending Activity in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second. This operation returns up
 * to 1,000 configuration sets each time it is run. If your Amazon SES account has more than
 * 1,000 configuration sets, this operation also returns `NextToken`. You can
 * then execute the `ListConfigurationSets` operation again, passing the
 * `NextToken` parameter and the value of the NextToken element to retrieve
 * additional results.
 */
export const listConfigurationSets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListConfigurationSetsRequest,
    output: ListConfigurationSetsResponse,
    errors: [],
  }),
);
/**
 * Returns a list containing all of the identities (email addresses and domains) for your
 * Amazon Web Services account in the current Amazon Web Services Region, regardless of verification status.
 *
 * You can execute this operation no more than once per second.
 *
 * It's recommended that for successive pagination calls of this API, you continue to
 * the use the same parameter/value pairs as used in the original call, e.g., if you
 * used `IdentityType=Domain` in the the original call and received a
 * `NextToken` in the response, you should continue providing the
 * `IdentityType=Domain` parameter for further `NextToken`
 * calls; however, if you didn't provide the `IdentityType` parameter in the
 * original call, then continue to not provide it for successive pagination calls.
 * Using this protocol will ensure consistent results.
 */
export const listIdentities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIdentitiesRequest,
  output: ListIdentitiesResponse,
  errors: [],
}));
/**
 * Returns a list of sending authorization policies that are attached to the given
 * identity (an email address or a domain). This operation returns only a list. To get the
 * actual policy content, use `GetIdentityPolicies`.
 *
 * This operation is for the identity owner only. If you have not verified the
 * identity, it returns an error.
 *
 * Sending authorization is a feature that enables an identity owner to authorize other
 * senders to use its identities. For information about using sending authorization, see
 * the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const listIdentityPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListIdentityPoliciesRequest,
    output: ListIdentityPoliciesResponse,
    errors: [],
  }),
);
/**
 * Lists the receipt rule sets that exist under your Amazon Web Services account in the current
 * Amazon Web Services Region. If there are additional receipt rule sets to be retrieved, you receive a
 * `NextToken` that you can provide to the next call to
 * `ListReceiptRuleSets` to retrieve the additional entries.
 *
 * For information about managing receipt rule sets, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const listReceiptRuleSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReceiptRuleSetsRequest,
  output: ListReceiptRuleSetsResponse,
  errors: [],
}));
/**
 * Adds or updates a sending authorization policy for the specified identity (an email
 * address or a domain).
 *
 * This operation is for the identity owner only. If you have not verified the
 * identity, it returns an error.
 *
 * Sending authorization is a feature that enables an identity owner to authorize other
 * senders to use its identities. For information about using sending authorization, see
 * the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const putIdentityPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutIdentityPolicyRequest,
  output: PutIdentityPolicyResponse,
  errors: [InvalidPolicyException],
}));
/**
 * Reorders the receipt rules within a receipt rule set.
 *
 * All of the rules in the rule set must be represented in this request. That is, it
 * is error if the reorder request doesn't explicitly position all of the rules.
 *
 * For information about managing receipt rule sets, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const reorderReceiptRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ReorderReceiptRuleSetRequest,
    output: ReorderReceiptRuleSetResponse,
    errors: [RuleDoesNotExistException, RuleSetDoesNotExistException],
  }),
);
/**
 * Modifies an association between a configuration set and a custom domain for open and
 * click event tracking.
 *
 * By default, images and links used for tracking open and click events are hosted on
 * domains operated by Amazon SES. You can configure a subdomain of your own to handle these
 * events. For information about using custom domains, see the Amazon SES Developer Guide.
 */
export const updateConfigurationSetTrackingOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfigurationSetTrackingOptionsRequest,
    output: UpdateConfigurationSetTrackingOptionsResponse,
    errors: [
      ConfigurationSetDoesNotExistException,
      InvalidTrackingOptionsException,
      TrackingOptionsDoesNotExistException,
    ],
  }));
/**
 * Updates an existing custom verification email template.
 *
 * For more information about custom verification email templates, see Using
 * Custom Verification Email Templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const updateCustomVerificationEmailTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCustomVerificationEmailTemplateRequest,
    output: UpdateCustomVerificationEmailTemplateResponse,
    errors: [
      CustomVerificationEmailInvalidContentException,
      CustomVerificationEmailTemplateDoesNotExistException,
      FromEmailAddressNotVerifiedException,
    ],
  }));
/**
 * Updates an email template. Email templates enable you to send personalized email to
 * one or more destinations in a single operation. For more information, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const updateTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTemplateRequest,
  output: UpdateTemplateResponse,
  errors: [InvalidTemplateException, TemplateDoesNotExistException],
}));
/**
 * Returns a set of DKIM tokens for a domain identity.
 *
 * When you execute the `VerifyDomainDkim` operation, the domain that you
 * specify is added to the list of identities that are associated with your account.
 * This is true even if you haven't already associated the domain with your account by
 * using the `VerifyDomainIdentity` operation. However, you can't send email
 * from the domain until you either successfully verify
 * it or you successfully set up DKIM for
 * it.
 *
 * You use the tokens that are generated by this operation to create CNAME records. When
 * Amazon SES detects that you've added these records to the DNS configuration for a domain, you
 * can start sending email from that domain. You can start sending email even if you
 * haven't added the TXT record provided by the VerifyDomainIdentity operation to the DNS
 * configuration for your domain. All email that you send from the domain is authenticated
 * using DKIM.
 *
 * To create the CNAME records for DKIM authentication, use the following values:
 *
 * - **Name**:
 * *token*._domainkey.*example.com*
 *
 * - **Type**: CNAME
 *
 * - **Value**:
 * *token*.dkim.amazonses.com
 *
 * In the preceding example, replace *token* with one of the tokens
 * that are generated when you execute this operation. Replace
 * *example.com* with your domain. Repeat this process for each
 * token that's generated by this operation.
 *
 * You can execute this operation no more than once per second.
 */
export const verifyDomainDkim = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyDomainDkimRequest,
  output: VerifyDomainDkimResponse,
  errors: [],
}));
/**
 * Adds a domain to the list of identities for your Amazon SES account in the current
 * Amazon Web Services Region and attempts to verify it. For more information about verifying domains,
 * see Verifying Email Addresses and Domains in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const verifyDomainIdentity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: VerifyDomainIdentityRequest,
    output: VerifyDomainIdentityResponse,
    errors: [],
  }),
);
/**
 * Creates an association between a configuration set and a custom domain for open and
 * click event tracking.
 *
 * By default, images and links used for tracking open and click events are hosted on
 * domains operated by Amazon SES. You can configure a subdomain of your own to handle these
 * events. For information about using custom domains, see the Amazon SES Developer Guide.
 */
export const createConfigurationSetTrackingOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConfigurationSetTrackingOptionsRequest,
    output: CreateConfigurationSetTrackingOptionsResponse,
    errors: [
      ConfigurationSetDoesNotExistException,
      InvalidTrackingOptionsException,
      TrackingOptionsAlreadyExistsException,
    ],
  }));
/**
 * Creates a new custom verification email template.
 *
 * For more information about custom verification email templates, see Using
 * Custom Verification Email Templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createCustomVerificationEmailTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCustomVerificationEmailTemplateRequest,
    output: CreateCustomVerificationEmailTemplateResponse,
    errors: [
      CustomVerificationEmailInvalidContentException,
      CustomVerificationEmailTemplateAlreadyExistsException,
      FromEmailAddressNotVerifiedException,
      LimitExceededException,
    ],
  }));
/**
 * Creates a new IP address filter.
 *
 * For information about setting up IP address filters, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createReceiptFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReceiptFilterRequest,
  output: CreateReceiptFilterResponse,
  errors: [AlreadyExistsException, LimitExceededException],
}));
/**
 * Returns the details of the specified configuration set. For information about using
 * configuration sets, see the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const describeConfigurationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConfigurationSetRequest,
    output: DescribeConfigurationSetResponse,
    errors: [ConfigurationSetDoesNotExistException],
  }),
);
/**
 * Returns the requested sending authorization policies for the given identity (an email
 * address or a domain). The policies are returned as a map of policy names to policy
 * contents. You can retrieve a maximum of 20 policies at a time.
 *
 * This operation is for the identity owner only. If you have not verified the
 * identity, it returns an error.
 *
 * Sending authorization is a feature that enables an identity owner to authorize other
 * senders to use its identities. For information about using sending authorization, see
 * the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const getIdentityPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentityPoliciesRequest,
  output: GetIdentityPoliciesResponse,
  errors: [],
}));
/**
 * Displays the template object (which includes the Subject line, HTML part and text
 * part) for the template you specify.
 *
 * You can execute this operation no more than once per second.
 */
export const getTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemplateRequest,
  output: GetTemplateResponse,
  errors: [TemplateDoesNotExistException],
}));
/**
 * Lists the existing custom verification email templates for your account in the current
 * Amazon Web Services Region.
 *
 * For more information about custom verification email templates, see Using
 * Custom Verification Email Templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const listCustomVerificationEmailTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCustomVerificationEmailTemplatesRequest,
    output: ListCustomVerificationEmailTemplatesResponse,
    errors: [],
  }));
/**
 * Lists the email templates present in your Amazon SES account in the current
 * Amazon Web Services Region.
 *
 * You can execute this operation no more than once per second.
 */
export const listTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTemplatesRequest,
  output: ListTemplatesResponse,
  errors: [],
}));
/**
 * Adds or updates the delivery options for a configuration set.
 */
export const putConfigurationSetDeliveryOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutConfigurationSetDeliveryOptionsRequest,
    output: PutConfigurationSetDeliveryOptionsResponse,
    errors: [
      ConfigurationSetDoesNotExistException,
      InvalidDeliveryOptionsException,
    ],
  }));
/**
 * Creates a configuration set.
 *
 * Configuration sets enable you to publish email sending events. For information about
 * using configuration sets, see the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createConfigurationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConfigurationSetRequest,
    output: CreateConfigurationSetResponse,
    errors: [
      ConfigurationSetAlreadyExistsException,
      InvalidConfigurationSetException,
      LimitExceededException,
    ],
  }),
);
/**
 * Creates a receipt rule.
 *
 * For information about setting up receipt rules, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createReceiptRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReceiptRuleRequest,
  output: CreateReceiptRuleResponse,
  errors: [
    AlreadyExistsException,
    InvalidLambdaFunctionException,
    InvalidS3ConfigurationException,
    InvalidSnsTopicException,
    LimitExceededException,
    RuleDoesNotExistException,
    RuleSetDoesNotExistException,
  ],
}));
/**
 * Returns the current status of Easy DKIM signing for an entity. For domain name
 * identities, this operation also returns the DKIM tokens that are required for Easy DKIM
 * signing, and whether Amazon SES has successfully verified that these tokens have been
 * published.
 *
 * This operation takes a list of identities as input and returns the following
 * information for each:
 *
 * - Whether Easy DKIM signing is enabled or disabled.
 *
 * - A set of DKIM tokens that represent the identity. If the identity is an email
 * address, the tokens represent the domain of that address.
 *
 * - Whether Amazon SES has successfully verified the DKIM tokens published in the
 * domain's DNS. This information is only returned for domain name identities, not
 * for email addresses.
 *
 * This operation is throttled at one request per second and can only get DKIM attributes
 * for up to 100 identities at a time.
 *
 * For more information about creating DNS records using DKIM tokens, go to the Amazon SES
 * Developer Guide.
 */
export const getIdentityDkimAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIdentityDkimAttributesRequest,
    output: GetIdentityDkimAttributesResponse,
    errors: [],
  }),
);
/**
 * Returns the custom MAIL FROM attributes for a list of identities (email addresses :
 * domains).
 *
 * This operation is throttled at one request per second and can only get custom MAIL
 * FROM attributes for up to 100 identities at a time.
 */
export const getIdentityMailFromDomainAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetIdentityMailFromDomainAttributesRequest,
    output: GetIdentityMailFromDomainAttributesResponse,
    errors: [],
  }));
/**
 * Given a list of verified identities (email addresses and/or domains), returns a
 * structure describing identity notification attributes.
 *
 * This operation is throttled at one request per second and can only get notification
 * attributes for up to 100 identities at a time.
 *
 * For more information about using notifications with Amazon SES, see the Amazon SES
 * Developer Guide.
 */
export const getIdentityNotificationAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetIdentityNotificationAttributesRequest,
    output: GetIdentityNotificationAttributesResponse,
    errors: [],
  }));
/**
 * Given a list of identities (email addresses and/or domains), returns the verification
 * status and (for domain identities) the verification token for each identity.
 *
 * The verification status of an email address is "Pending" until the email address owner
 * clicks the link within the verification email that Amazon SES sent to that address. If the
 * email address owner clicks the link within 24 hours, the verification status of the
 * email address changes to "Success". If the link is not clicked within 24 hours, the
 * verification status changes to "Failed." In that case, to verify the email address, you
 * must restart the verification process from the beginning.
 *
 * For domain identities, the domain's verification status is "Pending" as Amazon SES searches
 * for the required TXT record in the DNS settings of the domain. When Amazon SES detects the
 * record, the domain's verification status changes to "Success". If Amazon SES is unable to
 * detect the record within 72 hours, the domain's verification status changes to "Failed."
 * In that case, to verify the domain, you must restart the verification process from the
 * beginning.
 *
 * This operation is throttled at one request per second and can only get verification
 * attributes for up to 100 identities at a time.
 */
export const getIdentityVerificationAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetIdentityVerificationAttributesRequest,
    output: GetIdentityVerificationAttributesResponse,
    errors: [],
  }));
/**
 * Generates and sends a bounce message to the sender of an email you received through
 * Amazon SES. You can only use this operation on an email up to 24 hours after you receive
 * it.
 *
 * You cannot use this operation to send generic bounces for mail that was not
 * received by Amazon SES.
 *
 * For information about receiving email through Amazon SES, see the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const sendBounce = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendBounceRequest,
  output: SendBounceResponse,
  errors: [MessageRejected],
}));
/**
 * Composes an email message to multiple destinations. The message body is created using
 * an email template.
 *
 * To send email using this operation, your call must meet the following
 * requirements:
 *
 * - The call must refer to an existing email template. You can create email
 * templates using CreateTemplate.
 *
 * - The message must be sent from a verified email address or domain.
 *
 * - If your account is still in the Amazon SES sandbox, you may send only to verified
 * addresses or domains, or to email addresses associated with the Amazon SES Mailbox
 * Simulator. For more information, see Verifying Email
 * Addresses and Domains in the Amazon SES Developer
 * Guide.
 *
 * - The maximum message size is 10 MB.
 *
 * - Each `Destination` parameter must include at least one recipient
 * email address. The recipient address can be a To: address, a CC: address, or a
 * BCC: address. If a recipient email address is invalid (that is, it is not in the
 * format *UserName@[SubDomain.]Domain.TopLevelDomain*), the
 * entire message is rejected, even if the message contains other recipients that
 * are valid.
 *
 * - The message may not include more than 50 recipients, across the To:, CC: and
 * BCC: fields. If you need to send an email message to a larger audience, you can
 * divide your recipient list into groups of 50 or fewer, and then call the
 * `SendBulkTemplatedEmail` operation several times to send the
 * message to each group.
 *
 * - The number of destinations you can contact in a single call can be limited by
 * your account's maximum sending rate.
 */
export const sendBulkTemplatedEmail = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendBulkTemplatedEmailRequest,
    output: SendBulkTemplatedEmailResponse,
    errors: [
      AccountSendingPausedException,
      ConfigurationSetDoesNotExistException,
      ConfigurationSetSendingPausedException,
      MailFromDomainNotVerifiedException,
      MessageRejected,
      TemplateDoesNotExistException,
    ],
  }),
);
/**
 * Composes an email message and immediately queues it for sending. To send email using
 * this operation, your message must meet the following requirements:
 *
 * - The message must be sent from a verified email address or domain. If you
 * attempt to send email using a non-verified address or domain, the operation
 * results in an "Email address not verified" error.
 *
 * - If your account is still in the Amazon SES sandbox, you may only send to verified
 * addresses or domains, or to email addresses associated with the Amazon SES Mailbox
 * Simulator. For more information, see Verifying Email
 * Addresses and Domains in the Amazon SES Developer
 * Guide.
 *
 * - The maximum message size is 10 MB.
 *
 * - The message must include at least one recipient email address. The recipient
 * address can be a To: address, a CC: address, or a BCC: address. If a recipient
 * email address is invalid (that is, it is not in the format
 * *UserName@[SubDomain.]Domain.TopLevelDomain*), the entire
 * message is rejected, even if the message contains other recipients that are
 * valid.
 *
 * - The message may not include more than 50 recipients, across the To:, CC: and
 * BCC: fields. If you need to send an email message to a larger audience, you can
 * divide your recipient list into groups of 50 or fewer, and then call the
 * `SendEmail` operation several times to send the message to each
 * group.
 *
 * For every message that you send, the total number of recipients (including each
 * recipient in the To:, CC: and BCC: fields) is counted against the maximum number of
 * emails you can send in a 24-hour period (your *sending quota*).
 * For more information about sending quotas in Amazon SES, see Managing Your Amazon SES Sending
 * Limits in the *Amazon SES Developer Guide.*
 */
export const sendEmail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendEmailRequest,
  output: SendEmailResponse,
  errors: [
    AccountSendingPausedException,
    ConfigurationSetDoesNotExistException,
    ConfigurationSetSendingPausedException,
    MailFromDomainNotVerifiedException,
    MessageRejected,
  ],
}));
/**
 * Composes an email message and immediately queues it for sending.
 *
 * This operation is more flexible than the `SendEmail` operation. When you
 * use the `SendRawEmail` operation, you can specify the headers of the message
 * as well as its content. This flexibility is useful, for example, when you need to send a
 * multipart MIME email (such a message that contains both a text and an HTML version). You
 * can also use this operation to send messages that include attachments.
 *
 * The `SendRawEmail` operation has the following requirements:
 *
 * - You can only send email from verified email addresses or domains. If you try to send email from
 * an address that isn't verified, the operation results in an "Email address not
 * verified" error.
 *
 * - If your account is still in the Amazon SES sandbox, you can only send email to other verified addresses
 * in your account, or to addresses that are associated with the Amazon SES mailbox simulator.
 *
 * - The maximum message size, including attachments, is 10 MB.
 *
 * - Each message has to include at least one recipient address. A recipient
 * address includes any address on the To:, CC:, or BCC: lines.
 *
 * - If you send a single message to more than one recipient address, and one of
 * the recipient addresses isn't in a valid format (that is, it's not in the format
 * *UserName@[SubDomain.]Domain.TopLevelDomain*), Amazon SES
 * rejects the entire message, even if the other addresses are valid.
 *
 * - Each message can include up to 50 recipient addresses across the To:, CC:, or
 * BCC: lines. If you need to send a single message to more than 50 recipients, you
 * have to split the list of recipient addresses into groups of less than 50
 * recipients, and send separate messages to each group.
 *
 * - Amazon SES allows you to specify 8-bit Content-Transfer-Encoding for MIME message
 * parts. However, if Amazon SES has to modify the contents of your message (for
 * example, if you use open and click tracking), 8-bit content isn't preserved. For
 * this reason, we highly recommend that you encode all content that isn't 7-bit
 * ASCII. For more information, see MIME Encoding in the Amazon SES Developer
 * Guide.
 *
 * Additionally, keep the following considerations in mind when using the
 * `SendRawEmail` operation:
 *
 * - Although you can customize the message headers when using the
 * `SendRawEmail` operation, Amazon SES automatically applies its own
 * `Message-ID` and `Date` headers; if you passed these
 * headers when creating the message, they are overwritten by the values that Amazon SES
 * provides.
 *
 * - If you are using sending authorization to send on behalf of another user,
 * `SendRawEmail` enables you to specify the cross-account identity
 * for the email's Source, From, and Return-Path parameters in one of two ways: you
 * can pass optional parameters `SourceArn`, `FromArn`,
 * and/or `ReturnPathArn`, or you can include the following X-headers in
 * the header of your raw email:
 *
 * - `X-SES-SOURCE-ARN`
 *
 * - `X-SES-FROM-ARN`
 *
 * - `X-SES-RETURN-PATH-ARN`
 *
 * Don't include these X-headers in the DKIM signature. Amazon SES removes these
 * before it sends the email.
 *
 * If you only specify the `SourceIdentityArn` parameter, Amazon SES sets
 * the From and Return-Path addresses to the same identity that you
 * specified.
 *
 * For more information about sending authorization, see the Using
 * Sending Authorization with Amazon SES in the Amazon SES Developer
 * Guide.
 *
 * - For every message that you send, the total number of recipients (including
 * each recipient in the To:, CC: and BCC: fields) is counted against the maximum
 * number of emails you can send in a 24-hour period (your sending
 * quota). For more information about sending quotas in Amazon SES, see
 * Managing Your Amazon SES Sending Limits in the Amazon SES Developer
 * Guide.
 */
export const sendRawEmail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendRawEmailRequest,
  output: SendRawEmailResponse,
  errors: [
    AccountSendingPausedException,
    ConfigurationSetDoesNotExistException,
    ConfigurationSetSendingPausedException,
    MailFromDomainNotVerifiedException,
    MessageRejected,
  ],
}));
/**
 * Composes an email message using an email template and immediately queues it for
 * sending.
 *
 * To send email using this operation, your call must meet the following
 * requirements:
 *
 * - The call must refer to an existing email template. You can create email
 * templates using the CreateTemplate operation.
 *
 * - The message must be sent from a verified email address or domain.
 *
 * - If your account is still in the Amazon SES sandbox, you may only send to verified
 * addresses or domains, or to email addresses associated with the Amazon SES Mailbox
 * Simulator. For more information, see Verifying Email
 * Addresses and Domains in the Amazon SES Developer
 * Guide.
 *
 * - The maximum message size is 10 MB.
 *
 * - Calls to the `SendTemplatedEmail` operation may only include one
 * `Destination` parameter. A destination is a set of recipients
 * that receives the same version of the email. The `Destination`
 * parameter can include up to 50 recipients, across the To:, CC: and BCC:
 * fields.
 *
 * - The `Destination` parameter must include at least one recipient
 * email address. The recipient address can be a To: address, a CC: address, or a
 * BCC: address. If a recipient email address is invalid (that is, it is not in the
 * format *UserName@[SubDomain.]Domain.TopLevelDomain*), the
 * entire message is rejected, even if the message contains other recipients that
 * are valid.
 *
 * If your call to the `SendTemplatedEmail` operation includes all of the
 * required parameters, Amazon SES accepts it and returns a Message ID. However, if Amazon SES
 * can't render the email because the template contains errors, it doesn't send the
 * email. Additionally, because it already accepted the message, Amazon SES doesn't return a
 * message stating that it was unable to send the email.
 *
 * For these reasons, we highly recommend that you set up Amazon SES to send you
 * notifications when Rendering Failure events occur. For more information, see Sending Personalized Email Using the Amazon SES API in the
 * *Amazon Simple Email Service Developer Guide*.
 */
export const sendTemplatedEmail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendTemplatedEmailRequest,
  output: SendTemplatedEmailResponse,
  errors: [
    AccountSendingPausedException,
    ConfigurationSetDoesNotExistException,
    ConfigurationSetSendingPausedException,
    MailFromDomainNotVerifiedException,
    MessageRejected,
    TemplateDoesNotExistException,
  ],
}));
/**
 * Creates a preview of the MIME content of an email when provided with a template and a
 * set of replacement data.
 *
 * You can execute this operation no more than once per second.
 */
export const testRenderTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestRenderTemplateRequest,
  output: TestRenderTemplateResponse,
  errors: [
    InvalidRenderingParameterException,
    MissingRenderingAttributeException,
    TemplateDoesNotExistException,
  ],
}));
/**
 * Updates the event destination of a configuration set. Event destinations are
 * associated with configuration sets, which enable you to publish email sending events to
 * Amazon CloudWatch, Amazon Kinesis Firehose, or Amazon Simple Notification Service (Amazon SNS). For information about using configuration sets,
 * see Monitoring Your Amazon SES Sending Activity in the Amazon SES Developer
 * Guide.
 *
 * When you create or update an event destination, you must provide one, and only
 * one, destination. The destination can be Amazon CloudWatch, Amazon Kinesis Firehose, or Amazon Simple Notification Service
 * (Amazon SNS).
 *
 * You can execute this operation no more than once per second.
 */
export const updateConfigurationSetEventDestination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateConfigurationSetEventDestinationRequest,
    output: UpdateConfigurationSetEventDestinationResponse,
    errors: [
      ConfigurationSetDoesNotExistException,
      EventDestinationDoesNotExistException,
      InvalidCloudWatchDestinationException,
      InvalidFirehoseDestinationException,
      InvalidSNSDestinationException,
    ],
  }));
/**
 * Updates a receipt rule.
 *
 * For information about managing receipt rules, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const updateReceiptRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReceiptRuleRequest,
  output: UpdateReceiptRuleResponse,
  errors: [
    InvalidLambdaFunctionException,
    InvalidS3ConfigurationException,
    InvalidSnsTopicException,
    LimitExceededException,
    RuleDoesNotExistException,
    RuleSetDoesNotExistException,
  ],
}));
/**
 * Creates a configuration set event destination.
 *
 * When you create or update an event destination, you must provide one, and only
 * one, destination. The destination can be CloudWatch, Amazon Kinesis Firehose, or Amazon Simple Notification Service (Amazon SNS).
 *
 * An event destination is the Amazon Web Services service to which Amazon SES publishes the email sending
 * events associated with a configuration set. For information about using configuration
 * sets, see the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createConfigurationSetEventDestination =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateConfigurationSetEventDestinationRequest,
    output: CreateConfigurationSetEventDestinationResponse,
    errors: [
      ConfigurationSetDoesNotExistException,
      EventDestinationAlreadyExistsException,
      InvalidCloudWatchDestinationException,
      InvalidFirehoseDestinationException,
      InvalidSNSDestinationException,
      LimitExceededException,
    ],
  }));
/**
 * Adds an email address to the list of identities for your Amazon SES account in the current
 * Amazon Web Services Region and attempts to verify it. As a result of executing this operation, a
 * customized verification email is sent to the specified address.
 *
 * To use this operation, you must first create a custom verification email template. For
 * more information about creating and using custom verification email templates, see
 * Using
 * Custom Verification Email Templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const sendCustomVerificationEmail = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendCustomVerificationEmailRequest,
    output: SendCustomVerificationEmailResponse,
    errors: [
      ConfigurationSetDoesNotExistException,
      CustomVerificationEmailTemplateDoesNotExistException,
      FromEmailAddressNotVerifiedException,
      MessageRejected,
      ProductionAccessNotGrantedException,
    ],
  }),
);

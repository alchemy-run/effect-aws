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

//# Newtypes
export type ReceiptRuleSetName = string;
export type ConfigurationSetName = string;
export type TemplateName = string;
export type FromAddress = string;
export type Subject = string;
export type TemplateContent = string;
export type SuccessRedirectionURL = string;
export type FailureRedirectionURL = string;
export type ReceiptRuleName = string;
export type EventDestinationName = string;
export type Identity = string;
export type PolicyName = string;
export type ReceiptFilterName = string;
export type Address = string;
export type Max24HourSend = number;
export type MaxSendRate = number;
export type SentLast24Hours = number;
export type NextToken = string;
export type MaxItems = number;
export type MaxResults = number;
export type Policy = string;
export type MessageId = string;
export type Explanation = string;
export type AmazonResourceName = string;
export type TemplateData = string;
export type MailFromDomainName = string;
export type NotificationTopic = string;
export type Domain = string;
export type CustomRedirectDomain = string;
export type Recipient = string;
export type SubjectPart = string;
export type TextPart = string;
export type HtmlPart = string;
export type Counter = number;
export type ReportingMta = string;
export type MessageTagName = string;
export type MessageTagValue = string;
export type RuleOrRuleSetName = string;
export type ErrorMessage = string;
export type RenderedTemplate = string;
export type VerificationToken = string;
export type Cidr = string;
export type ExtensionFieldName = string;
export type ExtensionFieldValue = string;
export type RemoteMta = string;
export type DsnStatus = string;
export type DiagnosticCode = string;
export type MessageData = string;
export type Charset = string;
export type DimensionName = string;
export type DefaultDimensionValue = string;
export type S3BucketName = string;
export type S3KeyPrefix = string;
export type IAMRoleARN = string;
export type BounceSmtpReplyCode = string;
export type BounceStatusCode = string;
export type BounceMessage = string;
export type HeaderName = string;
export type HeaderValue = string;
export type ConnectInstanceArn = string;

//# Schemas
export interface DescribeActiveReceiptRuleSetRequest {}
export const DescribeActiveReceiptRuleSetRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeActiveReceiptRuleSetRequest",
}) as any as S.Schema<DescribeActiveReceiptRuleSetRequest>;
export interface GetAccountSendingEnabledRequest {}
export const GetAccountSendingEnabledRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountSendingEnabledRequest",
}) as any as S.Schema<GetAccountSendingEnabledRequest>;
export interface GetSendQuotaRequest {}
export const GetSendQuotaRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSendQuotaRequest",
}) as any as S.Schema<GetSendQuotaRequest>;
export interface GetSendStatisticsRequest {}
export const GetSendStatisticsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSendStatisticsRequest",
}) as any as S.Schema<GetSendStatisticsRequest>;
export interface ListReceiptFiltersRequest {}
export const ListReceiptFiltersRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReceiptFiltersRequest",
}) as any as S.Schema<ListReceiptFiltersRequest>;
export interface ListVerifiedEmailAddressesRequest {}
export const ListVerifiedEmailAddressesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVerifiedEmailAddressesRequest",
}) as any as S.Schema<ListVerifiedEmailAddressesRequest>;
export type RecipientsList = string[];
export const RecipientsList = S.Array(S.String);
export interface S3Action {
  TopicArn?: string;
  BucketName: string;
  ObjectKeyPrefix?: string;
  KmsKeyArn?: string;
  IamRoleArn?: string;
}
export const S3Action = S.suspend(() =>
  S.Struct({
    TopicArn: S.optional(S.String),
    BucketName: S.String,
    ObjectKeyPrefix: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
  }),
).annotations({ identifier: "S3Action" }) as any as S.Schema<S3Action>;
export interface BounceAction {
  TopicArn?: string;
  SmtpReplyCode: string;
  StatusCode?: string;
  Message: string;
  Sender: string;
}
export const BounceAction = S.suspend(() =>
  S.Struct({
    TopicArn: S.optional(S.String),
    SmtpReplyCode: S.String,
    StatusCode: S.optional(S.String),
    Message: S.String,
    Sender: S.String,
  }),
).annotations({ identifier: "BounceAction" }) as any as S.Schema<BounceAction>;
export interface WorkmailAction {
  TopicArn?: string;
  OrganizationArn: string;
}
export const WorkmailAction = S.suspend(() =>
  S.Struct({ TopicArn: S.optional(S.String), OrganizationArn: S.String }),
).annotations({
  identifier: "WorkmailAction",
}) as any as S.Schema<WorkmailAction>;
export interface LambdaAction {
  TopicArn?: string;
  FunctionArn: string;
  InvocationType?: string;
}
export const LambdaAction = S.suspend(() =>
  S.Struct({
    TopicArn: S.optional(S.String),
    FunctionArn: S.String,
    InvocationType: S.optional(S.String),
  }),
).annotations({ identifier: "LambdaAction" }) as any as S.Schema<LambdaAction>;
export interface StopAction {
  Scope: string;
  TopicArn?: string;
}
export const StopAction = S.suspend(() =>
  S.Struct({ Scope: S.String, TopicArn: S.optional(S.String) }),
).annotations({ identifier: "StopAction" }) as any as S.Schema<StopAction>;
export interface AddHeaderAction {
  HeaderName: string;
  HeaderValue: string;
}
export const AddHeaderAction = S.suspend(() =>
  S.Struct({ HeaderName: S.String, HeaderValue: S.String }),
).annotations({
  identifier: "AddHeaderAction",
}) as any as S.Schema<AddHeaderAction>;
export interface SNSAction {
  TopicArn: string;
  Encoding?: string;
}
export const SNSAction = S.suspend(() =>
  S.Struct({ TopicArn: S.String, Encoding: S.optional(S.String) }),
).annotations({ identifier: "SNSAction" }) as any as S.Schema<SNSAction>;
export interface ConnectAction {
  InstanceARN: string;
  IAMRoleARN: string;
}
export const ConnectAction = S.suspend(() =>
  S.Struct({ InstanceARN: S.String, IAMRoleARN: S.String }),
).annotations({
  identifier: "ConnectAction",
}) as any as S.Schema<ConnectAction>;
export interface ReceiptAction {
  S3Action?: S3Action;
  BounceAction?: BounceAction;
  WorkmailAction?: WorkmailAction;
  LambdaAction?: LambdaAction;
  StopAction?: StopAction;
  AddHeaderAction?: AddHeaderAction;
  SNSAction?: SNSAction;
  ConnectAction?: ConnectAction;
}
export const ReceiptAction = S.suspend(() =>
  S.Struct({
    S3Action: S.optional(S3Action),
    BounceAction: S.optional(BounceAction),
    WorkmailAction: S.optional(WorkmailAction),
    LambdaAction: S.optional(LambdaAction),
    StopAction: S.optional(StopAction),
    AddHeaderAction: S.optional(AddHeaderAction),
    SNSAction: S.optional(SNSAction),
    ConnectAction: S.optional(ConnectAction),
  }),
).annotations({
  identifier: "ReceiptAction",
}) as any as S.Schema<ReceiptAction>;
export type ReceiptActionsList = ReceiptAction[];
export const ReceiptActionsList = S.Array(ReceiptAction);
export interface ReceiptRule {
  Name: string;
  Enabled?: boolean;
  TlsPolicy?: string;
  Recipients?: RecipientsList;
  Actions?: ReceiptActionsList;
  ScanEnabled?: boolean;
}
export const ReceiptRule = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Enabled: S.optional(S.Boolean),
    TlsPolicy: S.optional(S.String),
    Recipients: S.optional(RecipientsList),
    Actions: S.optional(ReceiptActionsList),
    ScanEnabled: S.optional(S.Boolean),
  }),
).annotations({ identifier: "ReceiptRule" }) as any as S.Schema<ReceiptRule>;
export type ReceiptRulesList = ReceiptRule[];
export const ReceiptRulesList = S.Array(ReceiptRule);
export type ConfigurationSetAttributeList = string[];
export const ConfigurationSetAttributeList = S.Array(S.String);
export type IdentityList = string[];
export const IdentityList = S.Array(S.String);
export type PolicyNameList = string[];
export const PolicyNameList = S.Array(S.String);
export interface ReceiptIpFilter {
  Policy: string;
  Cidr: string;
}
export const ReceiptIpFilter = S.suspend(() =>
  S.Struct({ Policy: S.String, Cidr: S.String }),
).annotations({
  identifier: "ReceiptIpFilter",
}) as any as S.Schema<ReceiptIpFilter>;
export interface ReceiptFilter {
  Name: string;
  IpFilter: ReceiptIpFilter;
}
export const ReceiptFilter = S.suspend(() =>
  S.Struct({ Name: S.String, IpFilter: ReceiptIpFilter }),
).annotations({
  identifier: "ReceiptFilter",
}) as any as S.Schema<ReceiptFilter>;
export type ReceiptFilterList = ReceiptFilter[];
export const ReceiptFilterList = S.Array(ReceiptFilter);
export type AddressList = string[];
export const AddressList = S.Array(S.String);
export type ReceiptRuleNamesList = string[];
export const ReceiptRuleNamesList = S.Array(S.String);
export interface CloneReceiptRuleSetRequest {
  RuleSetName: string;
  OriginalRuleSetName: string;
}
export const CloneReceiptRuleSetRequest = S.suspend(() =>
  S.Struct({ RuleSetName: S.String, OriginalRuleSetName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CloneReceiptRuleSetRequest",
}) as any as S.Schema<CloneReceiptRuleSetRequest>;
export interface CloneReceiptRuleSetResponse {}
export const CloneReceiptRuleSetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CloneReceiptRuleSetResponse",
}) as any as S.Schema<CloneReceiptRuleSetResponse>;
export interface CreateCustomVerificationEmailTemplateRequest {
  TemplateName: string;
  FromEmailAddress: string;
  TemplateSubject: string;
  TemplateContent: string;
  SuccessRedirectionURL: string;
  FailureRedirectionURL: string;
}
export const CreateCustomVerificationEmailTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String,
    FromEmailAddress: S.String,
    TemplateSubject: S.String,
    TemplateContent: S.String,
    SuccessRedirectionURL: S.String,
    FailureRedirectionURL: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomVerificationEmailTemplateRequest",
}) as any as S.Schema<CreateCustomVerificationEmailTemplateRequest>;
export interface CreateCustomVerificationEmailTemplateResponse {}
export const CreateCustomVerificationEmailTemplateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateCustomVerificationEmailTemplateResponse",
}) as any as S.Schema<CreateCustomVerificationEmailTemplateResponse>;
export interface CreateReceiptRuleSetRequest {
  RuleSetName: string;
}
export const CreateReceiptRuleSetRequest = S.suspend(() =>
  S.Struct({ RuleSetName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateReceiptRuleSetRequest",
}) as any as S.Schema<CreateReceiptRuleSetRequest>;
export interface CreateReceiptRuleSetResponse {}
export const CreateReceiptRuleSetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateReceiptRuleSetResponse",
}) as any as S.Schema<CreateReceiptRuleSetResponse>;
export interface DeleteConfigurationSetRequest {
  ConfigurationSetName: string;
}
export const DeleteConfigurationSetRequest = S.suspend(() =>
  S.Struct({ ConfigurationSetName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationSetRequest",
}) as any as S.Schema<DeleteConfigurationSetRequest>;
export interface DeleteConfigurationSetResponse {}
export const DeleteConfigurationSetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConfigurationSetResponse",
}) as any as S.Schema<DeleteConfigurationSetResponse>;
export interface DeleteConfigurationSetEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestinationName: string;
}
export const DeleteConfigurationSetEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    EventDestinationName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationSetEventDestinationRequest",
}) as any as S.Schema<DeleteConfigurationSetEventDestinationRequest>;
export interface DeleteConfigurationSetEventDestinationResponse {}
export const DeleteConfigurationSetEventDestinationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConfigurationSetEventDestinationResponse",
}) as any as S.Schema<DeleteConfigurationSetEventDestinationResponse>;
export interface DeleteConfigurationSetTrackingOptionsRequest {
  ConfigurationSetName: string;
}
export const DeleteConfigurationSetTrackingOptionsRequest = S.suspend(() =>
  S.Struct({ ConfigurationSetName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfigurationSetTrackingOptionsRequest",
}) as any as S.Schema<DeleteConfigurationSetTrackingOptionsRequest>;
export interface DeleteConfigurationSetTrackingOptionsResponse {}
export const DeleteConfigurationSetTrackingOptionsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConfigurationSetTrackingOptionsResponse",
}) as any as S.Schema<DeleteConfigurationSetTrackingOptionsResponse>;
export interface DeleteCustomVerificationEmailTemplateRequest {
  TemplateName: string;
}
export const DeleteCustomVerificationEmailTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomVerificationEmailTemplateRequest",
}) as any as S.Schema<DeleteCustomVerificationEmailTemplateRequest>;
export interface DeleteCustomVerificationEmailTemplateResponse {}
export const DeleteCustomVerificationEmailTemplateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCustomVerificationEmailTemplateResponse",
}) as any as S.Schema<DeleteCustomVerificationEmailTemplateResponse>;
export interface DeleteIdentityRequest {
  Identity: string;
}
export const DeleteIdentityRequest = S.suspend(() =>
  S.Struct({ Identity: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIdentityRequest",
}) as any as S.Schema<DeleteIdentityRequest>;
export interface DeleteIdentityResponse {}
export const DeleteIdentityResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteIdentityResponse",
}) as any as S.Schema<DeleteIdentityResponse>;
export interface DeleteIdentityPolicyRequest {
  Identity: string;
  PolicyName: string;
}
export const DeleteIdentityPolicyRequest = S.suspend(() =>
  S.Struct({ Identity: S.String, PolicyName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteIdentityPolicyRequest",
}) as any as S.Schema<DeleteIdentityPolicyRequest>;
export interface DeleteIdentityPolicyResponse {}
export const DeleteIdentityPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteIdentityPolicyResponse",
}) as any as S.Schema<DeleteIdentityPolicyResponse>;
export interface DeleteReceiptFilterRequest {
  FilterName: string;
}
export const DeleteReceiptFilterRequest = S.suspend(() =>
  S.Struct({ FilterName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReceiptFilterRequest",
}) as any as S.Schema<DeleteReceiptFilterRequest>;
export interface DeleteReceiptFilterResponse {}
export const DeleteReceiptFilterResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteReceiptFilterResponse",
}) as any as S.Schema<DeleteReceiptFilterResponse>;
export interface DeleteReceiptRuleRequest {
  RuleSetName: string;
  RuleName: string;
}
export const DeleteReceiptRuleRequest = S.suspend(() =>
  S.Struct({ RuleSetName: S.String, RuleName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReceiptRuleRequest",
}) as any as S.Schema<DeleteReceiptRuleRequest>;
export interface DeleteReceiptRuleResponse {}
export const DeleteReceiptRuleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteReceiptRuleResponse",
}) as any as S.Schema<DeleteReceiptRuleResponse>;
export interface DeleteReceiptRuleSetRequest {
  RuleSetName: string;
}
export const DeleteReceiptRuleSetRequest = S.suspend(() =>
  S.Struct({ RuleSetName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReceiptRuleSetRequest",
}) as any as S.Schema<DeleteReceiptRuleSetRequest>;
export interface DeleteReceiptRuleSetResponse {}
export const DeleteReceiptRuleSetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteReceiptRuleSetResponse",
}) as any as S.Schema<DeleteReceiptRuleSetResponse>;
export interface DeleteTemplateRequest {
  TemplateName: string;
}
export const DeleteTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTemplateRequest",
}) as any as S.Schema<DeleteTemplateRequest>;
export interface DeleteTemplateResponse {}
export const DeleteTemplateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTemplateResponse",
}) as any as S.Schema<DeleteTemplateResponse>;
export interface DeleteVerifiedEmailAddressRequest {
  EmailAddress: string;
}
export const DeleteVerifiedEmailAddressRequest = S.suspend(() =>
  S.Struct({ EmailAddress: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVerifiedEmailAddressRequest",
}) as any as S.Schema<DeleteVerifiedEmailAddressRequest>;
export interface DeleteVerifiedEmailAddressResponse {}
export const DeleteVerifiedEmailAddressResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteVerifiedEmailAddressResponse",
}) as any as S.Schema<DeleteVerifiedEmailAddressResponse>;
export interface DescribeConfigurationSetRequest {
  ConfigurationSetName: string;
  ConfigurationSetAttributeNames?: ConfigurationSetAttributeList;
}
export const DescribeConfigurationSetRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    ConfigurationSetAttributeNames: S.optional(ConfigurationSetAttributeList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConfigurationSetRequest",
}) as any as S.Schema<DescribeConfigurationSetRequest>;
export interface DescribeReceiptRuleRequest {
  RuleSetName: string;
  RuleName: string;
}
export const DescribeReceiptRuleRequest = S.suspend(() =>
  S.Struct({ RuleSetName: S.String, RuleName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReceiptRuleRequest",
}) as any as S.Schema<DescribeReceiptRuleRequest>;
export interface DescribeReceiptRuleSetRequest {
  RuleSetName: string;
}
export const DescribeReceiptRuleSetRequest = S.suspend(() =>
  S.Struct({ RuleSetName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReceiptRuleSetRequest",
}) as any as S.Schema<DescribeReceiptRuleSetRequest>;
export interface GetAccountSendingEnabledResponse {
  Enabled?: boolean;
}
export const GetAccountSendingEnabledResponse = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }).pipe(ns),
).annotations({
  identifier: "GetAccountSendingEnabledResponse",
}) as any as S.Schema<GetAccountSendingEnabledResponse>;
export interface GetCustomVerificationEmailTemplateRequest {
  TemplateName: string;
}
export const GetCustomVerificationEmailTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCustomVerificationEmailTemplateRequest",
}) as any as S.Schema<GetCustomVerificationEmailTemplateRequest>;
export interface GetIdentityDkimAttributesRequest {
  Identities: IdentityList;
}
export const GetIdentityDkimAttributesRequest = S.suspend(() =>
  S.Struct({ Identities: IdentityList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdentityDkimAttributesRequest",
}) as any as S.Schema<GetIdentityDkimAttributesRequest>;
export interface GetIdentityMailFromDomainAttributesRequest {
  Identities: IdentityList;
}
export const GetIdentityMailFromDomainAttributesRequest = S.suspend(() =>
  S.Struct({ Identities: IdentityList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdentityMailFromDomainAttributesRequest",
}) as any as S.Schema<GetIdentityMailFromDomainAttributesRequest>;
export interface GetIdentityNotificationAttributesRequest {
  Identities: IdentityList;
}
export const GetIdentityNotificationAttributesRequest = S.suspend(() =>
  S.Struct({ Identities: IdentityList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdentityNotificationAttributesRequest",
}) as any as S.Schema<GetIdentityNotificationAttributesRequest>;
export interface GetIdentityPoliciesRequest {
  Identity: string;
  PolicyNames: PolicyNameList;
}
export const GetIdentityPoliciesRequest = S.suspend(() =>
  S.Struct({ Identity: S.String, PolicyNames: PolicyNameList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdentityPoliciesRequest",
}) as any as S.Schema<GetIdentityPoliciesRequest>;
export interface GetIdentityVerificationAttributesRequest {
  Identities: IdentityList;
}
export const GetIdentityVerificationAttributesRequest = S.suspend(() =>
  S.Struct({ Identities: IdentityList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetIdentityVerificationAttributesRequest",
}) as any as S.Schema<GetIdentityVerificationAttributesRequest>;
export interface GetSendQuotaResponse {
  Max24HourSend?: number;
  MaxSendRate?: number;
  SentLast24Hours?: number;
}
export const GetSendQuotaResponse = S.suspend(() =>
  S.Struct({
    Max24HourSend: S.optional(S.Number),
    MaxSendRate: S.optional(S.Number),
    SentLast24Hours: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "GetSendQuotaResponse",
}) as any as S.Schema<GetSendQuotaResponse>;
export interface GetTemplateRequest {
  TemplateName: string;
}
export const GetTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTemplateRequest",
}) as any as S.Schema<GetTemplateRequest>;
export interface ListConfigurationSetsRequest {
  NextToken?: string;
  MaxItems?: number;
}
export const ListConfigurationSetsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfigurationSetsRequest",
}) as any as S.Schema<ListConfigurationSetsRequest>;
export interface ListCustomVerificationEmailTemplatesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListCustomVerificationEmailTemplatesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomVerificationEmailTemplatesRequest",
}) as any as S.Schema<ListCustomVerificationEmailTemplatesRequest>;
export interface ListIdentitiesRequest {
  IdentityType?: string;
  NextToken?: string;
  MaxItems?: number;
}
export const ListIdentitiesRequest = S.suspend(() =>
  S.Struct({
    IdentityType: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdentitiesRequest",
}) as any as S.Schema<ListIdentitiesRequest>;
export interface ListIdentityPoliciesRequest {
  Identity: string;
}
export const ListIdentityPoliciesRequest = S.suspend(() =>
  S.Struct({ Identity: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListIdentityPoliciesRequest",
}) as any as S.Schema<ListIdentityPoliciesRequest>;
export interface ListReceiptFiltersResponse {
  Filters?: ReceiptFilterList;
}
export const ListReceiptFiltersResponse = S.suspend(() =>
  S.Struct({ Filters: S.optional(ReceiptFilterList) }).pipe(ns),
).annotations({
  identifier: "ListReceiptFiltersResponse",
}) as any as S.Schema<ListReceiptFiltersResponse>;
export interface ListReceiptRuleSetsRequest {
  NextToken?: string;
}
export const ListReceiptRuleSetsRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReceiptRuleSetsRequest",
}) as any as S.Schema<ListReceiptRuleSetsRequest>;
export interface ListTemplatesRequest {
  NextToken?: string;
  MaxItems?: number;
}
export const ListTemplatesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxItems: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTemplatesRequest",
}) as any as S.Schema<ListTemplatesRequest>;
export interface ListVerifiedEmailAddressesResponse {
  VerifiedEmailAddresses?: AddressList;
}
export const ListVerifiedEmailAddressesResponse = S.suspend(() =>
  S.Struct({ VerifiedEmailAddresses: S.optional(AddressList) }).pipe(ns),
).annotations({
  identifier: "ListVerifiedEmailAddressesResponse",
}) as any as S.Schema<ListVerifiedEmailAddressesResponse>;
export interface PutIdentityPolicyRequest {
  Identity: string;
  PolicyName: string;
  Policy: string;
}
export const PutIdentityPolicyRequest = S.suspend(() =>
  S.Struct({ Identity: S.String, PolicyName: S.String, Policy: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutIdentityPolicyRequest",
}) as any as S.Schema<PutIdentityPolicyRequest>;
export interface PutIdentityPolicyResponse {}
export const PutIdentityPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutIdentityPolicyResponse",
}) as any as S.Schema<PutIdentityPolicyResponse>;
export interface ReorderReceiptRuleSetRequest {
  RuleSetName: string;
  RuleNames: ReceiptRuleNamesList;
}
export const ReorderReceiptRuleSetRequest = S.suspend(() =>
  S.Struct({ RuleSetName: S.String, RuleNames: ReceiptRuleNamesList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ReorderReceiptRuleSetRequest",
}) as any as S.Schema<ReorderReceiptRuleSetRequest>;
export interface ReorderReceiptRuleSetResponse {}
export const ReorderReceiptRuleSetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ReorderReceiptRuleSetResponse",
}) as any as S.Schema<ReorderReceiptRuleSetResponse>;
export interface SendCustomVerificationEmailRequest {
  EmailAddress: string;
  TemplateName: string;
  ConfigurationSetName?: string;
}
export const SendCustomVerificationEmailRequest = S.suspend(() =>
  S.Struct({
    EmailAddress: S.String,
    TemplateName: S.String,
    ConfigurationSetName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendCustomVerificationEmailRequest",
}) as any as S.Schema<SendCustomVerificationEmailRequest>;
export interface Destination {
  ToAddresses?: AddressList;
  CcAddresses?: AddressList;
  BccAddresses?: AddressList;
}
export const Destination = S.suspend(() =>
  S.Struct({
    ToAddresses: S.optional(AddressList),
    CcAddresses: S.optional(AddressList),
    BccAddresses: S.optional(AddressList),
  }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export interface MessageTag {
  Name: string;
  Value: string;
}
export const MessageTag = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({ identifier: "MessageTag" }) as any as S.Schema<MessageTag>;
export type MessageTagList = MessageTag[];
export const MessageTagList = S.Array(MessageTag);
export interface SendTemplatedEmailRequest {
  Source: string;
  Destination: Destination;
  ReplyToAddresses?: AddressList;
  ReturnPath?: string;
  SourceArn?: string;
  ReturnPathArn?: string;
  Tags?: MessageTagList;
  ConfigurationSetName?: string;
  Template: string;
  TemplateArn?: string;
  TemplateData: string;
}
export const SendTemplatedEmailRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendTemplatedEmailRequest",
}) as any as S.Schema<SendTemplatedEmailRequest>;
export interface SetActiveReceiptRuleSetRequest {
  RuleSetName?: string;
}
export const SetActiveReceiptRuleSetRequest = S.suspend(() =>
  S.Struct({ RuleSetName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetActiveReceiptRuleSetRequest",
}) as any as S.Schema<SetActiveReceiptRuleSetRequest>;
export interface SetActiveReceiptRuleSetResponse {}
export const SetActiveReceiptRuleSetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetActiveReceiptRuleSetResponse",
}) as any as S.Schema<SetActiveReceiptRuleSetResponse>;
export interface SetIdentityDkimEnabledRequest {
  Identity: string;
  DkimEnabled: boolean;
}
export const SetIdentityDkimEnabledRequest = S.suspend(() =>
  S.Struct({ Identity: S.String, DkimEnabled: S.Boolean }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetIdentityDkimEnabledRequest",
}) as any as S.Schema<SetIdentityDkimEnabledRequest>;
export interface SetIdentityDkimEnabledResponse {}
export const SetIdentityDkimEnabledResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetIdentityDkimEnabledResponse",
}) as any as S.Schema<SetIdentityDkimEnabledResponse>;
export interface SetIdentityFeedbackForwardingEnabledRequest {
  Identity: string;
  ForwardingEnabled: boolean;
}
export const SetIdentityFeedbackForwardingEnabledRequest = S.suspend(() =>
  S.Struct({ Identity: S.String, ForwardingEnabled: S.Boolean }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetIdentityFeedbackForwardingEnabledRequest",
}) as any as S.Schema<SetIdentityFeedbackForwardingEnabledRequest>;
export interface SetIdentityFeedbackForwardingEnabledResponse {}
export const SetIdentityFeedbackForwardingEnabledResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetIdentityFeedbackForwardingEnabledResponse",
}) as any as S.Schema<SetIdentityFeedbackForwardingEnabledResponse>;
export interface SetIdentityHeadersInNotificationsEnabledRequest {
  Identity: string;
  NotificationType: string;
  Enabled: boolean;
}
export const SetIdentityHeadersInNotificationsEnabledRequest = S.suspend(() =>
  S.Struct({
    Identity: S.String,
    NotificationType: S.String,
    Enabled: S.Boolean,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetIdentityHeadersInNotificationsEnabledRequest",
}) as any as S.Schema<SetIdentityHeadersInNotificationsEnabledRequest>;
export interface SetIdentityHeadersInNotificationsEnabledResponse {}
export const SetIdentityHeadersInNotificationsEnabledResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetIdentityHeadersInNotificationsEnabledResponse",
}) as any as S.Schema<SetIdentityHeadersInNotificationsEnabledResponse>;
export interface SetIdentityMailFromDomainRequest {
  Identity: string;
  MailFromDomain?: string;
  BehaviorOnMXFailure?: string;
}
export const SetIdentityMailFromDomainRequest = S.suspend(() =>
  S.Struct({
    Identity: S.String,
    MailFromDomain: S.optional(S.String),
    BehaviorOnMXFailure: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetIdentityMailFromDomainRequest",
}) as any as S.Schema<SetIdentityMailFromDomainRequest>;
export interface SetIdentityMailFromDomainResponse {}
export const SetIdentityMailFromDomainResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetIdentityMailFromDomainResponse",
}) as any as S.Schema<SetIdentityMailFromDomainResponse>;
export interface SetIdentityNotificationTopicRequest {
  Identity: string;
  NotificationType: string;
  SnsTopic?: string;
}
export const SetIdentityNotificationTopicRequest = S.suspend(() =>
  S.Struct({
    Identity: S.String,
    NotificationType: S.String,
    SnsTopic: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetIdentityNotificationTopicRequest",
}) as any as S.Schema<SetIdentityNotificationTopicRequest>;
export interface SetIdentityNotificationTopicResponse {}
export const SetIdentityNotificationTopicResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetIdentityNotificationTopicResponse",
}) as any as S.Schema<SetIdentityNotificationTopicResponse>;
export interface SetReceiptRulePositionRequest {
  RuleSetName: string;
  RuleName: string;
  After?: string;
}
export const SetReceiptRulePositionRequest = S.suspend(() =>
  S.Struct({
    RuleSetName: S.String,
    RuleName: S.String,
    After: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetReceiptRulePositionRequest",
}) as any as S.Schema<SetReceiptRulePositionRequest>;
export interface SetReceiptRulePositionResponse {}
export const SetReceiptRulePositionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetReceiptRulePositionResponse",
}) as any as S.Schema<SetReceiptRulePositionResponse>;
export interface TestRenderTemplateRequest {
  TemplateName: string;
  TemplateData: string;
}
export const TestRenderTemplateRequest = S.suspend(() =>
  S.Struct({ TemplateName: S.String, TemplateData: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestRenderTemplateRequest",
}) as any as S.Schema<TestRenderTemplateRequest>;
export interface UpdateAccountSendingEnabledRequest {
  Enabled?: boolean;
}
export const UpdateAccountSendingEnabledRequest = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAccountSendingEnabledRequest",
}) as any as S.Schema<UpdateAccountSendingEnabledRequest>;
export interface UpdateAccountSendingEnabledResponse {}
export const UpdateAccountSendingEnabledResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateAccountSendingEnabledResponse",
}) as any as S.Schema<UpdateAccountSendingEnabledResponse>;
export type EventTypes = string[];
export const EventTypes = S.Array(S.String);
export interface KinesisFirehoseDestination {
  IAMRoleARN: string;
  DeliveryStreamARN: string;
}
export const KinesisFirehoseDestination = S.suspend(() =>
  S.Struct({ IAMRoleARN: S.String, DeliveryStreamARN: S.String }),
).annotations({
  identifier: "KinesisFirehoseDestination",
}) as any as S.Schema<KinesisFirehoseDestination>;
export interface CloudWatchDimensionConfiguration {
  DimensionName: string;
  DimensionValueSource: string;
  DefaultDimensionValue: string;
}
export const CloudWatchDimensionConfiguration = S.suspend(() =>
  S.Struct({
    DimensionName: S.String,
    DimensionValueSource: S.String,
    DefaultDimensionValue: S.String,
  }),
).annotations({
  identifier: "CloudWatchDimensionConfiguration",
}) as any as S.Schema<CloudWatchDimensionConfiguration>;
export type CloudWatchDimensionConfigurations =
  CloudWatchDimensionConfiguration[];
export const CloudWatchDimensionConfigurations = S.Array(
  CloudWatchDimensionConfiguration,
);
export interface CloudWatchDestination {
  DimensionConfigurations: CloudWatchDimensionConfigurations;
}
export const CloudWatchDestination = S.suspend(() =>
  S.Struct({ DimensionConfigurations: CloudWatchDimensionConfigurations }),
).annotations({
  identifier: "CloudWatchDestination",
}) as any as S.Schema<CloudWatchDestination>;
export interface SNSDestination {
  TopicARN: string;
}
export const SNSDestination = S.suspend(() =>
  S.Struct({ TopicARN: S.String }),
).annotations({
  identifier: "SNSDestination",
}) as any as S.Schema<SNSDestination>;
export interface EventDestination {
  Name: string;
  Enabled?: boolean;
  MatchingEventTypes: EventTypes;
  KinesisFirehoseDestination?: KinesisFirehoseDestination;
  CloudWatchDestination?: CloudWatchDestination;
  SNSDestination?: SNSDestination;
}
export const EventDestination = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Enabled: S.optional(S.Boolean),
    MatchingEventTypes: EventTypes,
    KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
    CloudWatchDestination: S.optional(CloudWatchDestination),
    SNSDestination: S.optional(SNSDestination),
  }),
).annotations({
  identifier: "EventDestination",
}) as any as S.Schema<EventDestination>;
export interface UpdateConfigurationSetEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestination: EventDestination;
}
export const UpdateConfigurationSetEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    EventDestination: EventDestination,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigurationSetEventDestinationRequest",
}) as any as S.Schema<UpdateConfigurationSetEventDestinationRequest>;
export interface UpdateConfigurationSetEventDestinationResponse {}
export const UpdateConfigurationSetEventDestinationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateConfigurationSetEventDestinationResponse",
}) as any as S.Schema<UpdateConfigurationSetEventDestinationResponse>;
export interface UpdateConfigurationSetReputationMetricsEnabledRequest {
  ConfigurationSetName: string;
  Enabled: boolean;
}
export const UpdateConfigurationSetReputationMetricsEnabledRequest = S.suspend(
  () =>
    S.Struct({ ConfigurationSetName: S.String, Enabled: S.Boolean }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "UpdateConfigurationSetReputationMetricsEnabledRequest",
}) as any as S.Schema<UpdateConfigurationSetReputationMetricsEnabledRequest>;
export interface UpdateConfigurationSetReputationMetricsEnabledResponse {}
export const UpdateConfigurationSetReputationMetricsEnabledResponse = S.suspend(
  () => S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateConfigurationSetReputationMetricsEnabledResponse",
}) as any as S.Schema<UpdateConfigurationSetReputationMetricsEnabledResponse>;
export interface UpdateConfigurationSetSendingEnabledRequest {
  ConfigurationSetName: string;
  Enabled: boolean;
}
export const UpdateConfigurationSetSendingEnabledRequest = S.suspend(() =>
  S.Struct({ ConfigurationSetName: S.String, Enabled: S.Boolean }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigurationSetSendingEnabledRequest",
}) as any as S.Schema<UpdateConfigurationSetSendingEnabledRequest>;
export interface UpdateConfigurationSetSendingEnabledResponse {}
export const UpdateConfigurationSetSendingEnabledResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateConfigurationSetSendingEnabledResponse",
}) as any as S.Schema<UpdateConfigurationSetSendingEnabledResponse>;
export interface TrackingOptions {
  CustomRedirectDomain?: string;
}
export const TrackingOptions = S.suspend(() =>
  S.Struct({ CustomRedirectDomain: S.optional(S.String) }),
).annotations({
  identifier: "TrackingOptions",
}) as any as S.Schema<TrackingOptions>;
export interface UpdateConfigurationSetTrackingOptionsRequest {
  ConfigurationSetName: string;
  TrackingOptions: TrackingOptions;
}
export const UpdateConfigurationSetTrackingOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    TrackingOptions: TrackingOptions,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfigurationSetTrackingOptionsRequest",
}) as any as S.Schema<UpdateConfigurationSetTrackingOptionsRequest>;
export interface UpdateConfigurationSetTrackingOptionsResponse {}
export const UpdateConfigurationSetTrackingOptionsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateConfigurationSetTrackingOptionsResponse",
}) as any as S.Schema<UpdateConfigurationSetTrackingOptionsResponse>;
export interface UpdateCustomVerificationEmailTemplateRequest {
  TemplateName: string;
  FromEmailAddress?: string;
  TemplateSubject?: string;
  TemplateContent?: string;
  SuccessRedirectionURL?: string;
  FailureRedirectionURL?: string;
}
export const UpdateCustomVerificationEmailTemplateRequest = S.suspend(() =>
  S.Struct({
    TemplateName: S.String,
    FromEmailAddress: S.optional(S.String),
    TemplateSubject: S.optional(S.String),
    TemplateContent: S.optional(S.String),
    SuccessRedirectionURL: S.optional(S.String),
    FailureRedirectionURL: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCustomVerificationEmailTemplateRequest",
}) as any as S.Schema<UpdateCustomVerificationEmailTemplateRequest>;
export interface UpdateCustomVerificationEmailTemplateResponse {}
export const UpdateCustomVerificationEmailTemplateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateCustomVerificationEmailTemplateResponse",
}) as any as S.Schema<UpdateCustomVerificationEmailTemplateResponse>;
export interface UpdateReceiptRuleRequest {
  RuleSetName: string;
  Rule: ReceiptRule;
}
export const UpdateReceiptRuleRequest = S.suspend(() =>
  S.Struct({ RuleSetName: S.String, Rule: ReceiptRule }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateReceiptRuleRequest",
}) as any as S.Schema<UpdateReceiptRuleRequest>;
export interface UpdateReceiptRuleResponse {}
export const UpdateReceiptRuleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateReceiptRuleResponse",
}) as any as S.Schema<UpdateReceiptRuleResponse>;
export interface Template {
  TemplateName: string;
  SubjectPart?: string;
  TextPart?: string;
  HtmlPart?: string;
}
export const Template = S.suspend(() =>
  S.Struct({
    TemplateName: S.String,
    SubjectPart: S.optional(S.String),
    TextPart: S.optional(S.String),
    HtmlPart: S.optional(S.String),
  }),
).annotations({ identifier: "Template" }) as any as S.Schema<Template>;
export interface UpdateTemplateRequest {
  Template: Template;
}
export const UpdateTemplateRequest = S.suspend(() =>
  S.Struct({ Template: Template }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTemplateRequest",
}) as any as S.Schema<UpdateTemplateRequest>;
export interface UpdateTemplateResponse {}
export const UpdateTemplateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateTemplateResponse",
}) as any as S.Schema<UpdateTemplateResponse>;
export interface VerifyDomainDkimRequest {
  Domain: string;
}
export const VerifyDomainDkimRequest = S.suspend(() =>
  S.Struct({ Domain: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyDomainDkimRequest",
}) as any as S.Schema<VerifyDomainDkimRequest>;
export interface VerifyDomainIdentityRequest {
  Domain: string;
}
export const VerifyDomainIdentityRequest = S.suspend(() =>
  S.Struct({ Domain: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyDomainIdentityRequest",
}) as any as S.Schema<VerifyDomainIdentityRequest>;
export interface VerifyEmailAddressRequest {
  EmailAddress: string;
}
export const VerifyEmailAddressRequest = S.suspend(() =>
  S.Struct({ EmailAddress: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyEmailAddressRequest",
}) as any as S.Schema<VerifyEmailAddressRequest>;
export interface VerifyEmailAddressResponse {}
export const VerifyEmailAddressResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "VerifyEmailAddressResponse",
}) as any as S.Schema<VerifyEmailAddressResponse>;
export interface VerifyEmailIdentityRequest {
  EmailAddress: string;
}
export const VerifyEmailIdentityRequest = S.suspend(() =>
  S.Struct({ EmailAddress: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VerifyEmailIdentityRequest",
}) as any as S.Schema<VerifyEmailIdentityRequest>;
export interface VerifyEmailIdentityResponse {}
export const VerifyEmailIdentityResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "VerifyEmailIdentityResponse",
}) as any as S.Schema<VerifyEmailIdentityResponse>;
export interface ConfigurationSet {
  Name: string;
}
export const ConfigurationSet = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "ConfigurationSet",
}) as any as S.Schema<ConfigurationSet>;
export interface ReceiptRuleSetMetadata {
  Name?: string;
  CreatedTimestamp?: Date;
}
export const ReceiptRuleSetMetadata = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ReceiptRuleSetMetadata",
}) as any as S.Schema<ReceiptRuleSetMetadata>;
export type EventDestinations = EventDestination[];
export const EventDestinations = S.Array(EventDestination);
export interface SendDataPoint {
  Timestamp?: Date;
  DeliveryAttempts?: number;
  Bounces?: number;
  Complaints?: number;
  Rejects?: number;
}
export const SendDataPoint = S.suspend(() =>
  S.Struct({
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DeliveryAttempts: S.optional(S.Number),
    Bounces: S.optional(S.Number),
    Complaints: S.optional(S.Number),
    Rejects: S.optional(S.Number),
  }),
).annotations({
  identifier: "SendDataPoint",
}) as any as S.Schema<SendDataPoint>;
export type SendDataPointList = SendDataPoint[];
export const SendDataPointList = S.Array(SendDataPoint);
export type ConfigurationSets = ConfigurationSet[];
export const ConfigurationSets = S.Array(ConfigurationSet);
export type ReceiptRuleSetsLists = ReceiptRuleSetMetadata[];
export const ReceiptRuleSetsLists = S.Array(ReceiptRuleSetMetadata);
export interface DeliveryOptions {
  TlsPolicy?: string;
}
export const DeliveryOptions = S.suspend(() =>
  S.Struct({ TlsPolicy: S.optional(S.String) }),
).annotations({
  identifier: "DeliveryOptions",
}) as any as S.Schema<DeliveryOptions>;
export interface BulkEmailDestination {
  Destination: Destination;
  ReplacementTags?: MessageTagList;
  ReplacementTemplateData?: string;
}
export const BulkEmailDestination = S.suspend(() =>
  S.Struct({
    Destination: Destination,
    ReplacementTags: S.optional(MessageTagList),
    ReplacementTemplateData: S.optional(S.String),
  }),
).annotations({
  identifier: "BulkEmailDestination",
}) as any as S.Schema<BulkEmailDestination>;
export type BulkEmailDestinationList = BulkEmailDestination[];
export const BulkEmailDestinationList = S.Array(BulkEmailDestination);
export interface RawMessage {
  Data: Uint8Array;
}
export const RawMessage = S.suspend(() =>
  S.Struct({ Data: T.Blob }),
).annotations({ identifier: "RawMessage" }) as any as S.Schema<RawMessage>;
export type VerificationTokenList = string[];
export const VerificationTokenList = S.Array(S.String);
export interface CreateConfigurationSetRequest {
  ConfigurationSet: ConfigurationSet;
}
export const CreateConfigurationSetRequest = S.suspend(() =>
  S.Struct({ ConfigurationSet: ConfigurationSet }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationSetRequest",
}) as any as S.Schema<CreateConfigurationSetRequest>;
export interface CreateConfigurationSetResponse {}
export const CreateConfigurationSetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateConfigurationSetResponse",
}) as any as S.Schema<CreateConfigurationSetResponse>;
export interface CreateConfigurationSetTrackingOptionsRequest {
  ConfigurationSetName: string;
  TrackingOptions: TrackingOptions;
}
export const CreateConfigurationSetTrackingOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    TrackingOptions: TrackingOptions,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationSetTrackingOptionsRequest",
}) as any as S.Schema<CreateConfigurationSetTrackingOptionsRequest>;
export interface CreateConfigurationSetTrackingOptionsResponse {}
export const CreateConfigurationSetTrackingOptionsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateConfigurationSetTrackingOptionsResponse",
}) as any as S.Schema<CreateConfigurationSetTrackingOptionsResponse>;
export interface CreateTemplateRequest {
  Template: Template;
}
export const CreateTemplateRequest = S.suspend(() =>
  S.Struct({ Template: Template }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTemplateRequest",
}) as any as S.Schema<CreateTemplateRequest>;
export interface CreateTemplateResponse {}
export const CreateTemplateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateTemplateResponse",
}) as any as S.Schema<CreateTemplateResponse>;
export interface DescribeActiveReceiptRuleSetResponse {
  Metadata?: ReceiptRuleSetMetadata;
  Rules?: ReceiptRulesList;
}
export const DescribeActiveReceiptRuleSetResponse = S.suspend(() =>
  S.Struct({
    Metadata: S.optional(ReceiptRuleSetMetadata),
    Rules: S.optional(ReceiptRulesList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeActiveReceiptRuleSetResponse",
}) as any as S.Schema<DescribeActiveReceiptRuleSetResponse>;
export interface DescribeReceiptRuleResponse {
  Rule?: ReceiptRule;
}
export const DescribeReceiptRuleResponse = S.suspend(() =>
  S.Struct({ Rule: S.optional(ReceiptRule) }).pipe(ns),
).annotations({
  identifier: "DescribeReceiptRuleResponse",
}) as any as S.Schema<DescribeReceiptRuleResponse>;
export interface DescribeReceiptRuleSetResponse {
  Metadata?: ReceiptRuleSetMetadata;
  Rules?: ReceiptRulesList;
}
export const DescribeReceiptRuleSetResponse = S.suspend(() =>
  S.Struct({
    Metadata: S.optional(ReceiptRuleSetMetadata),
    Rules: S.optional(ReceiptRulesList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeReceiptRuleSetResponse",
}) as any as S.Schema<DescribeReceiptRuleSetResponse>;
export interface GetCustomVerificationEmailTemplateResponse {
  TemplateName?: string;
  FromEmailAddress?: string;
  TemplateSubject?: string;
  TemplateContent?: string;
  SuccessRedirectionURL?: string;
  FailureRedirectionURL?: string;
}
export const GetCustomVerificationEmailTemplateResponse = S.suspend(() =>
  S.Struct({
    TemplateName: S.optional(S.String),
    FromEmailAddress: S.optional(S.String),
    TemplateSubject: S.optional(S.String),
    TemplateContent: S.optional(S.String),
    SuccessRedirectionURL: S.optional(S.String),
    FailureRedirectionURL: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetCustomVerificationEmailTemplateResponse",
}) as any as S.Schema<GetCustomVerificationEmailTemplateResponse>;
export interface GetSendStatisticsResponse {
  SendDataPoints?: SendDataPointList;
}
export const GetSendStatisticsResponse = S.suspend(() =>
  S.Struct({ SendDataPoints: S.optional(SendDataPointList) }).pipe(ns),
).annotations({
  identifier: "GetSendStatisticsResponse",
}) as any as S.Schema<GetSendStatisticsResponse>;
export interface GetTemplateResponse {
  Template?: Template;
}
export const GetTemplateResponse = S.suspend(() =>
  S.Struct({ Template: S.optional(Template) }).pipe(ns),
).annotations({
  identifier: "GetTemplateResponse",
}) as any as S.Schema<GetTemplateResponse>;
export interface ListConfigurationSetsResponse {
  ConfigurationSets?: ConfigurationSets;
  NextToken?: string;
}
export const ListConfigurationSetsResponse = S.suspend(() =>
  S.Struct({
    ConfigurationSets: S.optional(ConfigurationSets),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListConfigurationSetsResponse",
}) as any as S.Schema<ListConfigurationSetsResponse>;
export interface ListIdentitiesResponse {
  Identities: IdentityList;
  NextToken?: string;
}
export const ListIdentitiesResponse = S.suspend(() =>
  S.Struct({ Identities: IdentityList, NextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListIdentitiesResponse",
}) as any as S.Schema<ListIdentitiesResponse>;
export interface ListIdentityPoliciesResponse {
  PolicyNames: PolicyNameList;
}
export const ListIdentityPoliciesResponse = S.suspend(() =>
  S.Struct({ PolicyNames: PolicyNameList }).pipe(ns),
).annotations({
  identifier: "ListIdentityPoliciesResponse",
}) as any as S.Schema<ListIdentityPoliciesResponse>;
export interface ListReceiptRuleSetsResponse {
  RuleSets?: ReceiptRuleSetsLists;
  NextToken?: string;
}
export const ListReceiptRuleSetsResponse = S.suspend(() =>
  S.Struct({
    RuleSets: S.optional(ReceiptRuleSetsLists),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListReceiptRuleSetsResponse",
}) as any as S.Schema<ListReceiptRuleSetsResponse>;
export interface PutConfigurationSetDeliveryOptionsRequest {
  ConfigurationSetName: string;
  DeliveryOptions?: DeliveryOptions;
}
export const PutConfigurationSetDeliveryOptionsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    DeliveryOptions: S.optional(DeliveryOptions),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfigurationSetDeliveryOptionsRequest",
}) as any as S.Schema<PutConfigurationSetDeliveryOptionsRequest>;
export interface PutConfigurationSetDeliveryOptionsResponse {}
export const PutConfigurationSetDeliveryOptionsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutConfigurationSetDeliveryOptionsResponse",
}) as any as S.Schema<PutConfigurationSetDeliveryOptionsResponse>;
export interface SendBulkTemplatedEmailRequest {
  Source: string;
  SourceArn?: string;
  ReplyToAddresses?: AddressList;
  ReturnPath?: string;
  ReturnPathArn?: string;
  ConfigurationSetName?: string;
  DefaultTags?: MessageTagList;
  Template: string;
  TemplateArn?: string;
  DefaultTemplateData: string;
  Destinations: BulkEmailDestinationList;
}
export const SendBulkTemplatedEmailRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendBulkTemplatedEmailRequest",
}) as any as S.Schema<SendBulkTemplatedEmailRequest>;
export interface SendCustomVerificationEmailResponse {
  MessageId?: string;
}
export const SendCustomVerificationEmailResponse = S.suspend(() =>
  S.Struct({ MessageId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "SendCustomVerificationEmailResponse",
}) as any as S.Schema<SendCustomVerificationEmailResponse>;
export interface SendRawEmailRequest {
  Source?: string;
  Destinations?: AddressList;
  RawMessage: RawMessage;
  FromArn?: string;
  SourceArn?: string;
  ReturnPathArn?: string;
  Tags?: MessageTagList;
  ConfigurationSetName?: string;
}
export const SendRawEmailRequest = S.suspend(() =>
  S.Struct({
    Source: S.optional(S.String),
    Destinations: S.optional(AddressList),
    RawMessage: RawMessage,
    FromArn: S.optional(S.String),
    SourceArn: S.optional(S.String),
    ReturnPathArn: S.optional(S.String),
    Tags: S.optional(MessageTagList),
    ConfigurationSetName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendRawEmailRequest",
}) as any as S.Schema<SendRawEmailRequest>;
export interface SendTemplatedEmailResponse {
  MessageId: string;
}
export const SendTemplatedEmailResponse = S.suspend(() =>
  S.Struct({ MessageId: S.String }).pipe(ns),
).annotations({
  identifier: "SendTemplatedEmailResponse",
}) as any as S.Schema<SendTemplatedEmailResponse>;
export interface TestRenderTemplateResponse {
  RenderedTemplate?: string;
}
export const TestRenderTemplateResponse = S.suspend(() =>
  S.Struct({ RenderedTemplate: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "TestRenderTemplateResponse",
}) as any as S.Schema<TestRenderTemplateResponse>;
export interface VerifyDomainDkimResponse {
  DkimTokens: VerificationTokenList;
}
export const VerifyDomainDkimResponse = S.suspend(() =>
  S.Struct({ DkimTokens: VerificationTokenList }).pipe(ns),
).annotations({
  identifier: "VerifyDomainDkimResponse",
}) as any as S.Schema<VerifyDomainDkimResponse>;
export interface VerifyDomainIdentityResponse {
  VerificationToken: string;
}
export const VerifyDomainIdentityResponse = S.suspend(() =>
  S.Struct({ VerificationToken: S.String }).pipe(ns),
).annotations({
  identifier: "VerifyDomainIdentityResponse",
}) as any as S.Schema<VerifyDomainIdentityResponse>;
export interface ExtensionField {
  Name: string;
  Value: string;
}
export const ExtensionField = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "ExtensionField",
}) as any as S.Schema<ExtensionField>;
export type ExtensionFieldList = ExtensionField[];
export const ExtensionFieldList = S.Array(ExtensionField);
export interface RecipientDsnFields {
  FinalRecipient?: string;
  Action: string;
  RemoteMta?: string;
  Status: string;
  DiagnosticCode?: string;
  LastAttemptDate?: Date;
  ExtensionFields?: ExtensionFieldList;
}
export const RecipientDsnFields = S.suspend(() =>
  S.Struct({
    FinalRecipient: S.optional(S.String),
    Action: S.String,
    RemoteMta: S.optional(S.String),
    Status: S.String,
    DiagnosticCode: S.optional(S.String),
    LastAttemptDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExtensionFields: S.optional(ExtensionFieldList),
  }),
).annotations({
  identifier: "RecipientDsnFields",
}) as any as S.Schema<RecipientDsnFields>;
export interface Content {
  Data: string;
  Charset?: string;
}
export const Content = S.suspend(() =>
  S.Struct({ Data: S.String, Charset: S.optional(S.String) }),
).annotations({ identifier: "Content" }) as any as S.Schema<Content>;
export interface Body {
  Text?: Content;
  Html?: Content;
}
export const Body = S.suspend(() =>
  S.Struct({ Text: S.optional(Content), Html: S.optional(Content) }),
).annotations({ identifier: "Body" }) as any as S.Schema<Body>;
export interface ReputationOptions {
  SendingEnabled?: boolean;
  ReputationMetricsEnabled?: boolean;
  LastFreshStart?: Date;
}
export const ReputationOptions = S.suspend(() =>
  S.Struct({
    SendingEnabled: S.optional(S.Boolean),
    ReputationMetricsEnabled: S.optional(S.Boolean),
    LastFreshStart: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ReputationOptions",
}) as any as S.Schema<ReputationOptions>;
export type PolicyMap = { [key: string]: string };
export const PolicyMap = S.Record({ key: S.String, value: S.String });
export interface CustomVerificationEmailTemplate {
  TemplateName?: string;
  FromEmailAddress?: string;
  TemplateSubject?: string;
  SuccessRedirectionURL?: string;
  FailureRedirectionURL?: string;
}
export const CustomVerificationEmailTemplate = S.suspend(() =>
  S.Struct({
    TemplateName: S.optional(S.String),
    FromEmailAddress: S.optional(S.String),
    TemplateSubject: S.optional(S.String),
    SuccessRedirectionURL: S.optional(S.String),
    FailureRedirectionURL: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomVerificationEmailTemplate",
}) as any as S.Schema<CustomVerificationEmailTemplate>;
export type CustomVerificationEmailTemplates =
  CustomVerificationEmailTemplate[];
export const CustomVerificationEmailTemplates = S.Array(
  CustomVerificationEmailTemplate,
);
export interface TemplateMetadata {
  Name?: string;
  CreatedTimestamp?: Date;
}
export const TemplateMetadata = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "TemplateMetadata",
}) as any as S.Schema<TemplateMetadata>;
export type TemplateMetadataList = TemplateMetadata[];
export const TemplateMetadataList = S.Array(TemplateMetadata);
export interface MessageDsn {
  ReportingMta: string;
  ArrivalDate?: Date;
  ExtensionFields?: ExtensionFieldList;
}
export const MessageDsn = S.suspend(() =>
  S.Struct({
    ReportingMta: S.String,
    ArrivalDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExtensionFields: S.optional(ExtensionFieldList),
  }),
).annotations({ identifier: "MessageDsn" }) as any as S.Schema<MessageDsn>;
export interface BouncedRecipientInfo {
  Recipient: string;
  RecipientArn?: string;
  BounceType?: string;
  RecipientDsnFields?: RecipientDsnFields;
}
export const BouncedRecipientInfo = S.suspend(() =>
  S.Struct({
    Recipient: S.String,
    RecipientArn: S.optional(S.String),
    BounceType: S.optional(S.String),
    RecipientDsnFields: S.optional(RecipientDsnFields),
  }),
).annotations({
  identifier: "BouncedRecipientInfo",
}) as any as S.Schema<BouncedRecipientInfo>;
export type BouncedRecipientInfoList = BouncedRecipientInfo[];
export const BouncedRecipientInfoList = S.Array(BouncedRecipientInfo);
export interface Message {
  Subject: Content;
  Body: Body;
}
export const Message = S.suspend(() =>
  S.Struct({ Subject: Content, Body: Body }),
).annotations({ identifier: "Message" }) as any as S.Schema<Message>;
export interface CreateReceiptFilterRequest {
  Filter: ReceiptFilter;
}
export const CreateReceiptFilterRequest = S.suspend(() =>
  S.Struct({ Filter: ReceiptFilter }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateReceiptFilterRequest",
}) as any as S.Schema<CreateReceiptFilterRequest>;
export interface CreateReceiptFilterResponse {}
export const CreateReceiptFilterResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateReceiptFilterResponse",
}) as any as S.Schema<CreateReceiptFilterResponse>;
export interface DescribeConfigurationSetResponse {
  ConfigurationSet?: ConfigurationSet;
  EventDestinations?: EventDestinations;
  TrackingOptions?: TrackingOptions;
  DeliveryOptions?: DeliveryOptions;
  ReputationOptions?: ReputationOptions;
}
export const DescribeConfigurationSetResponse = S.suspend(() =>
  S.Struct({
    ConfigurationSet: S.optional(ConfigurationSet),
    EventDestinations: S.optional(EventDestinations),
    TrackingOptions: S.optional(TrackingOptions),
    DeliveryOptions: S.optional(DeliveryOptions),
    ReputationOptions: S.optional(ReputationOptions),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConfigurationSetResponse",
}) as any as S.Schema<DescribeConfigurationSetResponse>;
export interface GetIdentityPoliciesResponse {
  Policies: PolicyMap;
}
export const GetIdentityPoliciesResponse = S.suspend(() =>
  S.Struct({ Policies: PolicyMap }).pipe(ns),
).annotations({
  identifier: "GetIdentityPoliciesResponse",
}) as any as S.Schema<GetIdentityPoliciesResponse>;
export interface ListCustomVerificationEmailTemplatesResponse {
  CustomVerificationEmailTemplates?: CustomVerificationEmailTemplates;
  NextToken?: string;
}
export const ListCustomVerificationEmailTemplatesResponse = S.suspend(() =>
  S.Struct({
    CustomVerificationEmailTemplates: S.optional(
      CustomVerificationEmailTemplates,
    ),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListCustomVerificationEmailTemplatesResponse",
}) as any as S.Schema<ListCustomVerificationEmailTemplatesResponse>;
export interface ListTemplatesResponse {
  TemplatesMetadata?: TemplateMetadataList;
  NextToken?: string;
}
export const ListTemplatesResponse = S.suspend(() =>
  S.Struct({
    TemplatesMetadata: S.optional(TemplateMetadataList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTemplatesResponse",
}) as any as S.Schema<ListTemplatesResponse>;
export interface SendBounceRequest {
  OriginalMessageId: string;
  BounceSender: string;
  Explanation?: string;
  MessageDsn?: MessageDsn;
  BouncedRecipientInfoList: BouncedRecipientInfoList;
  BounceSenderArn?: string;
}
export const SendBounceRequest = S.suspend(() =>
  S.Struct({
    OriginalMessageId: S.String,
    BounceSender: S.String,
    Explanation: S.optional(S.String),
    MessageDsn: S.optional(MessageDsn),
    BouncedRecipientInfoList: BouncedRecipientInfoList,
    BounceSenderArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendBounceRequest",
}) as any as S.Schema<SendBounceRequest>;
export interface SendEmailRequest {
  Source: string;
  Destination: Destination;
  Message: Message;
  ReplyToAddresses?: AddressList;
  ReturnPath?: string;
  SourceArn?: string;
  ReturnPathArn?: string;
  Tags?: MessageTagList;
  ConfigurationSetName?: string;
}
export const SendEmailRequest = S.suspend(() =>
  S.Struct({
    Source: S.String,
    Destination: Destination,
    Message: Message,
    ReplyToAddresses: S.optional(AddressList),
    ReturnPath: S.optional(S.String),
    SourceArn: S.optional(S.String),
    ReturnPathArn: S.optional(S.String),
    Tags: S.optional(MessageTagList),
    ConfigurationSetName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendEmailRequest",
}) as any as S.Schema<SendEmailRequest>;
export interface SendRawEmailResponse {
  MessageId: string;
}
export const SendRawEmailResponse = S.suspend(() =>
  S.Struct({ MessageId: S.String }).pipe(ns),
).annotations({
  identifier: "SendRawEmailResponse",
}) as any as S.Schema<SendRawEmailResponse>;
export interface IdentityDkimAttributes {
  DkimEnabled: boolean;
  DkimVerificationStatus: string;
  DkimTokens?: VerificationTokenList;
}
export const IdentityDkimAttributes = S.suspend(() =>
  S.Struct({
    DkimEnabled: S.Boolean,
    DkimVerificationStatus: S.String,
    DkimTokens: S.optional(VerificationTokenList),
  }),
).annotations({
  identifier: "IdentityDkimAttributes",
}) as any as S.Schema<IdentityDkimAttributes>;
export interface IdentityMailFromDomainAttributes {
  MailFromDomain: string;
  MailFromDomainStatus: string;
  BehaviorOnMXFailure: string;
}
export const IdentityMailFromDomainAttributes = S.suspend(() =>
  S.Struct({
    MailFromDomain: S.String,
    MailFromDomainStatus: S.String,
    BehaviorOnMXFailure: S.String,
  }),
).annotations({
  identifier: "IdentityMailFromDomainAttributes",
}) as any as S.Schema<IdentityMailFromDomainAttributes>;
export interface IdentityNotificationAttributes {
  BounceTopic: string;
  ComplaintTopic: string;
  DeliveryTopic: string;
  ForwardingEnabled: boolean;
  HeadersInBounceNotificationsEnabled?: boolean;
  HeadersInComplaintNotificationsEnabled?: boolean;
  HeadersInDeliveryNotificationsEnabled?: boolean;
}
export const IdentityNotificationAttributes = S.suspend(() =>
  S.Struct({
    BounceTopic: S.String,
    ComplaintTopic: S.String,
    DeliveryTopic: S.String,
    ForwardingEnabled: S.Boolean,
    HeadersInBounceNotificationsEnabled: S.optional(S.Boolean),
    HeadersInComplaintNotificationsEnabled: S.optional(S.Boolean),
    HeadersInDeliveryNotificationsEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "IdentityNotificationAttributes",
}) as any as S.Schema<IdentityNotificationAttributes>;
export interface IdentityVerificationAttributes {
  VerificationStatus: string;
  VerificationToken?: string;
}
export const IdentityVerificationAttributes = S.suspend(() =>
  S.Struct({
    VerificationStatus: S.String,
    VerificationToken: S.optional(S.String),
  }),
).annotations({
  identifier: "IdentityVerificationAttributes",
}) as any as S.Schema<IdentityVerificationAttributes>;
export type DkimAttributes = { [key: string]: IdentityDkimAttributes };
export const DkimAttributes = S.Record({
  key: S.String,
  value: IdentityDkimAttributes,
});
export type MailFromDomainAttributes = {
  [key: string]: IdentityMailFromDomainAttributes;
};
export const MailFromDomainAttributes = S.Record({
  key: S.String,
  value: IdentityMailFromDomainAttributes,
});
export type NotificationAttributes = {
  [key: string]: IdentityNotificationAttributes;
};
export const NotificationAttributes = S.Record({
  key: S.String,
  value: IdentityNotificationAttributes,
});
export type VerificationAttributes = {
  [key: string]: IdentityVerificationAttributes;
};
export const VerificationAttributes = S.Record({
  key: S.String,
  value: IdentityVerificationAttributes,
});
export interface BulkEmailDestinationStatus {
  Status?: string;
  Error?: string;
  MessageId?: string;
}
export const BulkEmailDestinationStatus = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    Error: S.optional(S.String),
    MessageId: S.optional(S.String),
  }),
).annotations({
  identifier: "BulkEmailDestinationStatus",
}) as any as S.Schema<BulkEmailDestinationStatus>;
export type BulkEmailDestinationStatusList = BulkEmailDestinationStatus[];
export const BulkEmailDestinationStatusList = S.Array(
  BulkEmailDestinationStatus,
);
export interface CreateConfigurationSetEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestination: EventDestination;
}
export const CreateConfigurationSetEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    EventDestination: EventDestination,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfigurationSetEventDestinationRequest",
}) as any as S.Schema<CreateConfigurationSetEventDestinationRequest>;
export interface CreateConfigurationSetEventDestinationResponse {}
export const CreateConfigurationSetEventDestinationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateConfigurationSetEventDestinationResponse",
}) as any as S.Schema<CreateConfigurationSetEventDestinationResponse>;
export interface CreateReceiptRuleRequest {
  RuleSetName: string;
  After?: string;
  Rule: ReceiptRule;
}
export const CreateReceiptRuleRequest = S.suspend(() =>
  S.Struct({
    RuleSetName: S.String,
    After: S.optional(S.String),
    Rule: ReceiptRule,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateReceiptRuleRequest",
}) as any as S.Schema<CreateReceiptRuleRequest>;
export interface CreateReceiptRuleResponse {}
export const CreateReceiptRuleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateReceiptRuleResponse",
}) as any as S.Schema<CreateReceiptRuleResponse>;
export interface GetIdentityDkimAttributesResponse {
  DkimAttributes: DkimAttributes;
}
export const GetIdentityDkimAttributesResponse = S.suspend(() =>
  S.Struct({ DkimAttributes: DkimAttributes }).pipe(ns),
).annotations({
  identifier: "GetIdentityDkimAttributesResponse",
}) as any as S.Schema<GetIdentityDkimAttributesResponse>;
export interface GetIdentityMailFromDomainAttributesResponse {
  MailFromDomainAttributes: MailFromDomainAttributes;
}
export const GetIdentityMailFromDomainAttributesResponse = S.suspend(() =>
  S.Struct({ MailFromDomainAttributes: MailFromDomainAttributes }).pipe(ns),
).annotations({
  identifier: "GetIdentityMailFromDomainAttributesResponse",
}) as any as S.Schema<GetIdentityMailFromDomainAttributesResponse>;
export interface GetIdentityNotificationAttributesResponse {
  NotificationAttributes: NotificationAttributes;
}
export const GetIdentityNotificationAttributesResponse = S.suspend(() =>
  S.Struct({ NotificationAttributes: NotificationAttributes }).pipe(ns),
).annotations({
  identifier: "GetIdentityNotificationAttributesResponse",
}) as any as S.Schema<GetIdentityNotificationAttributesResponse>;
export interface GetIdentityVerificationAttributesResponse {
  VerificationAttributes: VerificationAttributes;
}
export const GetIdentityVerificationAttributesResponse = S.suspend(() =>
  S.Struct({ VerificationAttributes: VerificationAttributes }).pipe(ns),
).annotations({
  identifier: "GetIdentityVerificationAttributesResponse",
}) as any as S.Schema<GetIdentityVerificationAttributesResponse>;
export interface SendBounceResponse {
  MessageId?: string;
}
export const SendBounceResponse = S.suspend(() =>
  S.Struct({ MessageId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "SendBounceResponse",
}) as any as S.Schema<SendBounceResponse>;
export interface SendBulkTemplatedEmailResponse {
  Status: BulkEmailDestinationStatusList;
}
export const SendBulkTemplatedEmailResponse = S.suspend(() =>
  S.Struct({ Status: BulkEmailDestinationStatusList }).pipe(ns),
).annotations({
  identifier: "SendBulkTemplatedEmailResponse",
}) as any as S.Schema<SendBulkTemplatedEmailResponse>;
export interface SendEmailResponse {
  MessageId: string;
}
export const SendEmailResponse = S.suspend(() =>
  S.Struct({ MessageId: S.String }).pipe(ns),
).annotations({
  identifier: "SendEmailResponse",
}) as any as S.Schema<SendEmailResponse>;

//# Errors
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { Name: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "AlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CustomVerificationEmailInvalidContentException extends S.TaggedError<CustomVerificationEmailInvalidContentException>()(
  "CustomVerificationEmailInvalidContentException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CustomVerificationEmailInvalidContent",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ConfigurationSetDoesNotExistException extends S.TaggedError<ConfigurationSetDoesNotExistException>()(
  "ConfigurationSetDoesNotExistException",
  { ConfigurationSetName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ConfigurationSetDoesNotExist",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class RuleSetDoesNotExistException extends S.TaggedError<RuleSetDoesNotExistException>()(
  "RuleSetDoesNotExistException",
  { Name: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "RuleSetDoesNotExist", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CannotDeleteException extends S.TaggedError<CannotDeleteException>()(
  "CannotDeleteException",
  { Name: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "CannotDelete", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidPolicyException extends S.TaggedError<InvalidPolicyException>()(
  "InvalidPolicyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidPolicy", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class RuleDoesNotExistException extends S.TaggedError<RuleDoesNotExistException>()(
  "RuleDoesNotExistException",
  { Name: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "RuleDoesNotExist", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidLambdaFunctionException extends S.TaggedError<InvalidLambdaFunctionException>()(
  "InvalidLambdaFunctionException",
  { FunctionArn: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidLambdaFunction", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidTemplateException extends S.TaggedError<InvalidTemplateException>()(
  "InvalidTemplateException",
  { TemplateName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTemplate", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ConfigurationSetAlreadyExistsException extends S.TaggedError<ConfigurationSetAlreadyExistsException>()(
  "ConfigurationSetAlreadyExistsException",
  { ConfigurationSetName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ConfigurationSetAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
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
).pipe(C.withBadRequestError) {}
export class CustomVerificationEmailTemplateDoesNotExistException extends S.TaggedError<CustomVerificationEmailTemplateDoesNotExistException>()(
  "CustomVerificationEmailTemplateDoesNotExistException",
  {
    CustomVerificationEmailTemplateName: S.optional(S.String),
    message: S.optional(S.String),
  },
  T.AwsQueryError({
    code: "CustomVerificationEmailTemplateDoesNotExist",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TemplateDoesNotExistException extends S.TaggedError<TemplateDoesNotExistException>()(
  "TemplateDoesNotExistException",
  { TemplateName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "TemplateDoesNotExist", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidDeliveryOptionsException extends S.TaggedError<InvalidDeliveryOptionsException>()(
  "InvalidDeliveryOptionsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDeliveryOptions", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class AccountSendingPausedException extends S.TaggedError<AccountSendingPausedException>()(
  "AccountSendingPausedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AccountSendingPausedException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidRenderingParameterException extends S.TaggedError<InvalidRenderingParameterException>()(
  "InvalidRenderingParameterException",
  { TemplateName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRenderingParameter", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidS3ConfigurationException extends S.TaggedError<InvalidS3ConfigurationException>()(
  "InvalidS3ConfigurationException",
  { Bucket: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidS3Configuration", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EventDestinationDoesNotExistException extends S.TaggedError<EventDestinationDoesNotExistException>()(
  "EventDestinationDoesNotExistException",
  {
    ConfigurationSetName: S.optional(S.String),
    EventDestinationName: S.optional(S.String),
    message: S.optional(S.String),
  },
  T.AwsQueryError({
    code: "EventDestinationDoesNotExist",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TrackingOptionsDoesNotExistException extends S.TaggedError<TrackingOptionsDoesNotExistException>()(
  "TrackingOptionsDoesNotExistException",
  { ConfigurationSetName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TrackingOptionsDoesNotExistException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidTrackingOptionsException extends S.TaggedError<InvalidTrackingOptionsException>()(
  "InvalidTrackingOptionsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTrackingOptions", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidConfigurationSetException extends S.TaggedError<InvalidConfigurationSetException>()(
  "InvalidConfigurationSetException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidConfigurationSet", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class FromEmailAddressNotVerifiedException extends S.TaggedError<FromEmailAddressNotVerifiedException>()(
  "FromEmailAddressNotVerifiedException",
  { FromEmailAddress: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({
    code: "FromEmailAddressNotVerified",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ConfigurationSetSendingPausedException extends S.TaggedError<ConfigurationSetSendingPausedException>()(
  "ConfigurationSetSendingPausedException",
  { ConfigurationSetName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ConfigurationSetSendingPausedException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class MissingRenderingAttributeException extends S.TaggedError<MissingRenderingAttributeException>()(
  "MissingRenderingAttributeException",
  { TemplateName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "MissingRenderingAttribute", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidSnsTopicException extends S.TaggedError<InvalidSnsTopicException>()(
  "InvalidSnsTopicException",
  { Topic: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSnsTopic", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
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
).pipe(C.withBadRequestError) {}
export class TrackingOptionsAlreadyExistsException extends S.TaggedError<TrackingOptionsAlreadyExistsException>()(
  "TrackingOptionsAlreadyExistsException",
  { ConfigurationSetName: S.optional(S.String), message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TrackingOptionsAlreadyExistsException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
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
).pipe(C.withBadRequestError) {}
export class MessageRejected extends S.TaggedError<MessageRejected>()(
  "MessageRejected",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "MessageRejected", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class MailFromDomainNotVerifiedException extends S.TaggedError<MailFromDomainNotVerifiedException>()(
  "MailFromDomainNotVerifiedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "MailFromDomainNotVerifiedException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
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
).pipe(C.withBadRequestError) {}
export class ProductionAccessNotGrantedException extends S.TaggedError<ProductionAccessNotGrantedException>()(
  "ProductionAccessNotGrantedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ProductionAccessNotGranted",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidSNSDestinationException extends S.TaggedError<InvalidSNSDestinationException>()(
  "InvalidSNSDestinationException",
  {
    ConfigurationSetName: S.optional(S.String),
    EventDestinationName: S.optional(S.String),
    message: S.optional(S.String),
  },
  T.AwsQueryError({ code: "InvalidSNSDestination", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

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
export const deleteCustomVerificationEmailTemplate: (
  input: DeleteCustomVerificationEmailTemplateRequest,
) => Effect.Effect<
  DeleteCustomVerificationEmailTemplateResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteIdentity: (
  input: DeleteIdentityRequest,
) => Effect.Effect<
  DeleteIdentityResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteIdentityPolicy: (
  input: DeleteIdentityPolicyRequest,
) => Effect.Effect<
  DeleteIdentityPolicyResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentityPolicyRequest,
  output: DeleteIdentityPolicyResponse,
  errors: [],
}));
/**
 * Deletes the specified IP address filter.
 *
 * For information about managing IP address filters, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteReceiptFilter: (
  input: DeleteReceiptFilterRequest,
) => Effect.Effect<
  DeleteReceiptFilterResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReceiptFilterRequest,
  output: DeleteReceiptFilterResponse,
  errors: [],
}));
/**
 * Deletes an email template.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteTemplate: (
  input: DeleteTemplateRequest,
) => Effect.Effect<
  DeleteTemplateResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTemplateRequest,
  output: DeleteTemplateResponse,
  errors: [],
}));
/**
 * Deprecated. Use the `DeleteIdentity` operation to delete email addresses
 * and domains.
 */
export const deleteVerifiedEmailAddress: (
  input: DeleteVerifiedEmailAddressRequest,
) => Effect.Effect<
  DeleteVerifiedEmailAddressResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVerifiedEmailAddressRequest,
  output: DeleteVerifiedEmailAddressResponse,
  errors: [],
}));
/**
 * Returns the email sending status of the Amazon SES account for the current Region.
 *
 * You can execute this operation no more than once per second.
 */
export const getAccountSendingEnabled: (
  input: GetAccountSendingEnabledRequest,
) => Effect.Effect<
  GetAccountSendingEnabledResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSendingEnabledRequest,
  output: GetAccountSendingEnabledResponse,
  errors: [],
}));
/**
 * Provides the sending limits for the Amazon SES account.
 *
 * You can execute this operation no more than once per second.
 */
export const getSendQuota: (
  input: GetSendQuotaRequest,
) => Effect.Effect<
  GetSendQuotaResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listReceiptFilters: (
  input: ListReceiptFiltersRequest,
) => Effect.Effect<
  ListReceiptFiltersResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReceiptFiltersRequest,
  output: ListReceiptFiltersResponse,
  errors: [],
}));
/**
 * Deprecated. Use the `ListIdentities` operation to list the email addresses
 * and domains associated with your account.
 */
export const listVerifiedEmailAddresses: (
  input: ListVerifiedEmailAddressesRequest,
) => Effect.Effect<
  ListVerifiedEmailAddressesResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVerifiedEmailAddressesRequest,
  output: ListVerifiedEmailAddressesResponse,
  errors: [],
}));
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
export const setIdentityDkimEnabled: (
  input: SetIdentityDkimEnabledRequest,
) => Effect.Effect<
  SetIdentityDkimEnabledResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetIdentityDkimEnabledRequest,
  output: SetIdentityDkimEnabledResponse,
  errors: [],
}));
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
export const setIdentityFeedbackForwardingEnabled: (
  input: SetIdentityFeedbackForwardingEnabledRequest,
) => Effect.Effect<
  SetIdentityFeedbackForwardingEnabledResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setIdentityHeadersInNotificationsEnabled: (
  input: SetIdentityHeadersInNotificationsEnabledRequest,
) => Effect.Effect<
  SetIdentityHeadersInNotificationsEnabledResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setIdentityMailFromDomain: (
  input: SetIdentityMailFromDomainRequest,
) => Effect.Effect<
  SetIdentityMailFromDomainResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetIdentityMailFromDomainRequest,
  output: SetIdentityMailFromDomainResponse,
  errors: [],
}));
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
export const setIdentityNotificationTopic: (
  input: SetIdentityNotificationTopicRequest,
) => Effect.Effect<
  SetIdentityNotificationTopicResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetIdentityNotificationTopicRequest,
  output: SetIdentityNotificationTopicResponse,
  errors: [],
}));
/**
 * Enables or disables email sending across your entire Amazon SES account in the current
 * Amazon Web Services Region. You can use this operation in conjunction with Amazon CloudWatch alarms to
 * temporarily pause email sending across your Amazon SES account in a given Amazon Web Services Region when
 * reputation metrics (such as your bounce or complaint rates) reach certain
 * thresholds.
 *
 * You can execute this operation no more than once per second.
 */
export const updateAccountSendingEnabled: (
  input: UpdateAccountSendingEnabledRequest,
) => Effect.Effect<
  UpdateAccountSendingEnabledResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccountSendingEnabledRequest,
  output: UpdateAccountSendingEnabledResponse,
  errors: [],
}));
/**
 * Deprecated. Use the `VerifyEmailIdentity` operation to verify a new email
 * address.
 */
export const verifyEmailAddress: (
  input: VerifyEmailAddressRequest,
) => Effect.Effect<
  VerifyEmailAddressResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const verifyEmailIdentity: (
  input: VerifyEmailIdentityRequest,
) => Effect.Effect<
  VerifyEmailIdentityResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyEmailIdentityRequest,
  output: VerifyEmailIdentityResponse,
  errors: [],
}));
/**
 * Deletes a configuration set. Configuration sets enable you to publish email sending
 * events. For information about using configuration sets, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteConfigurationSet: (
  input: DeleteConfigurationSetRequest,
) => Effect.Effect<
  DeleteConfigurationSetResponse,
  ConfigurationSetDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationSetRequest,
  output: DeleteConfigurationSetResponse,
  errors: [ConfigurationSetDoesNotExistException],
}));
/**
 * Deletes the specified receipt rule.
 *
 * For information about managing receipt rules, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteReceiptRule: (
  input: DeleteReceiptRuleRequest,
) => Effect.Effect<
  DeleteReceiptRuleResponse,
  RuleSetDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteReceiptRuleSet: (
  input: DeleteReceiptRuleSetRequest,
) => Effect.Effect<
  DeleteReceiptRuleSetResponse,
  CannotDeleteException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReceiptRuleSetRequest,
  output: DeleteReceiptRuleSetResponse,
  errors: [CannotDeleteException],
}));
/**
 * Returns the metadata and receipt rules for the receipt rule set that is currently
 * active.
 *
 * For information about setting up receipt rule sets, see the Amazon SES Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const describeActiveReceiptRuleSet: (
  input: DescribeActiveReceiptRuleSetRequest,
) => Effect.Effect<
  DescribeActiveReceiptRuleSetResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeActiveReceiptRuleSetRequest,
  output: DescribeActiveReceiptRuleSetResponse,
  errors: [],
}));
/**
 * Returns the details of the specified receipt rule set.
 *
 * For information about managing receipt rule sets, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const describeReceiptRuleSet: (
  input: DescribeReceiptRuleSetRequest,
) => Effect.Effect<
  DescribeReceiptRuleSetResponse,
  RuleSetDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReceiptRuleSetRequest,
  output: DescribeReceiptRuleSetResponse,
  errors: [RuleSetDoesNotExistException],
}));
/**
 * Provides sending statistics for the current Amazon Web Services Region. The result is a list of data
 * points, representing the last two weeks of sending activity. Each data point in the list
 * contains statistics for a 15-minute period of time.
 *
 * You can execute this operation no more than once per second.
 */
export const getSendStatistics: (
  input: GetSendStatisticsRequest,
) => Effect.Effect<
  GetSendStatisticsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listConfigurationSets: (
  input: ListConfigurationSetsRequest,
) => Effect.Effect<
  ListConfigurationSetsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConfigurationSetsRequest,
  output: ListConfigurationSetsResponse,
  errors: [],
}));
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
export const listIdentities: {
  (
    input: ListIdentitiesRequest,
  ): Effect.Effect<
    ListIdentitiesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdentitiesRequest,
  ) => Stream.Stream<
    ListIdentitiesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdentitiesRequest,
  ) => Stream.Stream<
    Identity,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIdentitiesRequest,
  output: ListIdentitiesResponse,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Identities",
    pageSize: "MaxItems",
  } as const,
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
export const listIdentityPolicies: (
  input: ListIdentityPoliciesRequest,
) => Effect.Effect<
  ListIdentityPoliciesResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIdentityPoliciesRequest,
  output: ListIdentityPoliciesResponse,
  errors: [],
}));
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
export const listReceiptRuleSets: (
  input: ListReceiptRuleSetsRequest,
) => Effect.Effect<
  ListReceiptRuleSetsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putIdentityPolicy: (
  input: PutIdentityPolicyRequest,
) => Effect.Effect<
  PutIdentityPolicyResponse,
  InvalidPolicyException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const reorderReceiptRuleSet: (
  input: ReorderReceiptRuleSetRequest,
) => Effect.Effect<
  ReorderReceiptRuleSetResponse,
  RuleDoesNotExistException | RuleSetDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReorderReceiptRuleSetRequest,
  output: ReorderReceiptRuleSetResponse,
  errors: [RuleDoesNotExistException, RuleSetDoesNotExistException],
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
export const verifyDomainDkim: (
  input: VerifyDomainDkimRequest,
) => Effect.Effect<
  VerifyDomainDkimResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const verifyDomainIdentity: (
  input: VerifyDomainIdentityRequest,
) => Effect.Effect<
  VerifyDomainIdentityResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyDomainIdentityRequest,
  output: VerifyDomainIdentityResponse,
  errors: [],
}));
/**
 * Enables or disables the publishing of reputation metrics for emails sent using a
 * specific configuration set in a given Amazon Web Services Region. Reputation metrics include bounce
 * and complaint rates. These metrics are published to Amazon CloudWatch. By using CloudWatch, you can
 * create alarms when bounce or complaint rates exceed certain thresholds.
 *
 * You can execute this operation no more than once per second.
 */
export const updateConfigurationSetReputationMetricsEnabled: (
  input: UpdateConfigurationSetReputationMetricsEnabledRequest,
) => Effect.Effect<
  UpdateConfigurationSetReputationMetricsEnabledResponse,
  ConfigurationSetDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateConfigurationSetSendingEnabled: (
  input: UpdateConfigurationSetSendingEnabledRequest,
) => Effect.Effect<
  UpdateConfigurationSetSendingEnabledResponse,
  ConfigurationSetDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationSetSendingEnabledRequest,
  output: UpdateConfigurationSetSendingEnabledResponse,
  errors: [ConfigurationSetDoesNotExistException],
}));
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
export const setActiveReceiptRuleSet: (
  input: SetActiveReceiptRuleSetRequest,
) => Effect.Effect<
  SetActiveReceiptRuleSetResponse,
  RuleSetDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetActiveReceiptRuleSetRequest,
  output: SetActiveReceiptRuleSetResponse,
  errors: [RuleSetDoesNotExistException],
}));
/**
 * Sets the position of the specified receipt rule in the receipt rule set.
 *
 * For information about managing receipt rules, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const setReceiptRulePosition: (
  input: SetReceiptRulePositionRequest,
) => Effect.Effect<
  SetReceiptRulePositionResponse,
  RuleDoesNotExistException | RuleSetDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetReceiptRulePositionRequest,
  output: SetReceiptRulePositionResponse,
  errors: [RuleDoesNotExistException, RuleSetDoesNotExistException],
}));
/**
 * Returns the details of the specified receipt rule.
 *
 * For information about setting up receipt rules, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const describeReceiptRule: (
  input: DescribeReceiptRuleRequest,
) => Effect.Effect<
  DescribeReceiptRuleResponse,
  RuleDoesNotExistException | RuleSetDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReceiptRuleRequest,
  output: DescribeReceiptRuleResponse,
  errors: [RuleDoesNotExistException, RuleSetDoesNotExistException],
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
export const cloneReceiptRuleSet: (
  input: CloneReceiptRuleSetRequest,
) => Effect.Effect<
  CloneReceiptRuleSetResponse,
  | AlreadyExistsException
  | LimitExceededException
  | RuleSetDoesNotExistException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CloneReceiptRuleSetRequest,
  output: CloneReceiptRuleSetResponse,
  errors: [
    AlreadyExistsException,
    LimitExceededException,
    RuleSetDoesNotExistException,
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
export const createReceiptFilter: (
  input: CreateReceiptFilterRequest,
) => Effect.Effect<
  CreateReceiptFilterResponse,
  AlreadyExistsException | LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeConfigurationSet: (
  input: DescribeConfigurationSetRequest,
) => Effect.Effect<
  DescribeConfigurationSetResponse,
  ConfigurationSetDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConfigurationSetRequest,
  output: DescribeConfigurationSetResponse,
  errors: [ConfigurationSetDoesNotExistException],
}));
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
export const getCustomVerificationEmailTemplate: (
  input: GetCustomVerificationEmailTemplateRequest,
) => Effect.Effect<
  GetCustomVerificationEmailTemplateResponse,
  CustomVerificationEmailTemplateDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCustomVerificationEmailTemplateRequest,
  output: GetCustomVerificationEmailTemplateResponse,
  errors: [CustomVerificationEmailTemplateDoesNotExistException],
}));
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
export const getIdentityPolicies: (
  input: GetIdentityPoliciesRequest,
) => Effect.Effect<
  GetIdentityPoliciesResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTemplate: (
  input: GetTemplateRequest,
) => Effect.Effect<
  GetTemplateResponse,
  TemplateDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCustomVerificationEmailTemplates: {
  (
    input: ListCustomVerificationEmailTemplatesRequest,
  ): Effect.Effect<
    ListCustomVerificationEmailTemplatesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomVerificationEmailTemplatesRequest,
  ) => Stream.Stream<
    ListCustomVerificationEmailTemplatesResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomVerificationEmailTemplatesRequest,
  ) => Stream.Stream<
    unknown,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomVerificationEmailTemplatesRequest,
  output: ListCustomVerificationEmailTemplatesResponse,
  errors: [],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the email templates present in your Amazon SES account in the current
 * Amazon Web Services Region.
 *
 * You can execute this operation no more than once per second.
 */
export const listTemplates: (
  input: ListTemplatesRequest,
) => Effect.Effect<
  ListTemplatesResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTemplatesRequest,
  output: ListTemplatesResponse,
  errors: [],
}));
/**
 * Adds or updates the delivery options for a configuration set.
 */
export const putConfigurationSetDeliveryOptions: (
  input: PutConfigurationSetDeliveryOptionsRequest,
) => Effect.Effect<
  PutConfigurationSetDeliveryOptionsResponse,
  | ConfigurationSetDoesNotExistException
  | InvalidDeliveryOptionsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfigurationSetDeliveryOptionsRequest,
  output: PutConfigurationSetDeliveryOptionsResponse,
  errors: [
    ConfigurationSetDoesNotExistException,
    InvalidDeliveryOptionsException,
  ],
}));
/**
 * Creates an empty receipt rule set.
 *
 * For information about setting up receipt rule sets, see the Amazon SES Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createReceiptRuleSet: (
  input: CreateReceiptRuleSetRequest,
) => Effect.Effect<
  CreateReceiptRuleSetResponse,
  AlreadyExistsException | LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReceiptRuleSetRequest,
  output: CreateReceiptRuleSetResponse,
  errors: [AlreadyExistsException, LimitExceededException],
}));
/**
 * Creates an email template. Email templates enable you to send personalized email to
 * one or more destinations in a single operation. For more information, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createTemplate: (
  input: CreateTemplateRequest,
) => Effect.Effect<
  CreateTemplateResponse,
  | AlreadyExistsException
  | InvalidTemplateException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTemplateRequest,
  output: CreateTemplateResponse,
  errors: [
    AlreadyExistsException,
    InvalidTemplateException,
    LimitExceededException,
  ],
}));
/**
 * Deletes a configuration set event destination. Configuration set event destinations
 * are associated with configuration sets, which enable you to publish email sending
 * events. For information about using configuration sets, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const deleteConfigurationSetEventDestination: (
  input: DeleteConfigurationSetEventDestinationRequest,
) => Effect.Effect<
  DeleteConfigurationSetEventDestinationResponse,
  | ConfigurationSetDoesNotExistException
  | EventDestinationDoesNotExistException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteConfigurationSetTrackingOptions: (
  input: DeleteConfigurationSetTrackingOptionsRequest,
) => Effect.Effect<
  DeleteConfigurationSetTrackingOptionsResponse,
  | ConfigurationSetDoesNotExistException
  | TrackingOptionsDoesNotExistException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationSetTrackingOptionsRequest,
  output: DeleteConfigurationSetTrackingOptionsResponse,
  errors: [
    ConfigurationSetDoesNotExistException,
    TrackingOptionsDoesNotExistException,
  ],
}));
/**
 * Modifies an association between a configuration set and a custom domain for open and
 * click event tracking.
 *
 * By default, images and links used for tracking open and click events are hosted on
 * domains operated by Amazon SES. You can configure a subdomain of your own to handle these
 * events. For information about using custom domains, see the Amazon SES Developer Guide.
 */
export const updateConfigurationSetTrackingOptions: (
  input: UpdateConfigurationSetTrackingOptionsRequest,
) => Effect.Effect<
  UpdateConfigurationSetTrackingOptionsResponse,
  | ConfigurationSetDoesNotExistException
  | InvalidTrackingOptionsException
  | TrackingOptionsDoesNotExistException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfigurationSetTrackingOptionsRequest,
  output: UpdateConfigurationSetTrackingOptionsResponse,
  errors: [
    ConfigurationSetDoesNotExistException,
    InvalidTrackingOptionsException,
    TrackingOptionsDoesNotExistException,
  ],
}));
/**
 * Updates an email template. Email templates enable you to send personalized email to
 * one or more destinations in a single operation. For more information, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const updateTemplate: (
  input: UpdateTemplateRequest,
) => Effect.Effect<
  UpdateTemplateResponse,
  InvalidTemplateException | TemplateDoesNotExistException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTemplateRequest,
  output: UpdateTemplateResponse,
  errors: [InvalidTemplateException, TemplateDoesNotExistException],
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
export const createConfigurationSet: (
  input: CreateConfigurationSetRequest,
) => Effect.Effect<
  CreateConfigurationSetResponse,
  | ConfigurationSetAlreadyExistsException
  | InvalidConfigurationSetException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigurationSetRequest,
  output: CreateConfigurationSetResponse,
  errors: [
    ConfigurationSetAlreadyExistsException,
    InvalidConfigurationSetException,
    LimitExceededException,
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
export const createCustomVerificationEmailTemplate: (
  input: CreateCustomVerificationEmailTemplateRequest,
) => Effect.Effect<
  CreateCustomVerificationEmailTemplateResponse,
  | CustomVerificationEmailInvalidContentException
  | CustomVerificationEmailTemplateAlreadyExistsException
  | FromEmailAddressNotVerifiedException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getIdentityDkimAttributes: (
  input: GetIdentityDkimAttributesRequest,
) => Effect.Effect<
  GetIdentityDkimAttributesResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentityDkimAttributesRequest,
  output: GetIdentityDkimAttributesResponse,
  errors: [],
}));
/**
 * Returns the custom MAIL FROM attributes for a list of identities (email addresses :
 * domains).
 *
 * This operation is throttled at one request per second and can only get custom MAIL
 * FROM attributes for up to 100 identities at a time.
 */
export const getIdentityMailFromDomainAttributes: (
  input: GetIdentityMailFromDomainAttributesRequest,
) => Effect.Effect<
  GetIdentityMailFromDomainAttributesResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getIdentityNotificationAttributes: (
  input: GetIdentityNotificationAttributesRequest,
) => Effect.Effect<
  GetIdentityNotificationAttributesResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getIdentityVerificationAttributes: (
  input: GetIdentityVerificationAttributesRequest,
) => Effect.Effect<
  GetIdentityVerificationAttributesResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentityVerificationAttributesRequest,
  output: GetIdentityVerificationAttributesResponse,
  errors: [],
}));
/**
 * Creates a preview of the MIME content of an email when provided with a template and a
 * set of replacement data.
 *
 * You can execute this operation no more than once per second.
 */
export const testRenderTemplate: (
  input: TestRenderTemplateRequest,
) => Effect.Effect<
  TestRenderTemplateResponse,
  | InvalidRenderingParameterException
  | MissingRenderingAttributeException
  | TemplateDoesNotExistException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestRenderTemplateRequest,
  output: TestRenderTemplateResponse,
  errors: [
    InvalidRenderingParameterException,
    MissingRenderingAttributeException,
    TemplateDoesNotExistException,
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
export const updateReceiptRule: (
  input: UpdateReceiptRuleRequest,
) => Effect.Effect<
  UpdateReceiptRuleResponse,
  | InvalidLambdaFunctionException
  | InvalidS3ConfigurationException
  | InvalidSnsTopicException
  | LimitExceededException
  | RuleDoesNotExistException
  | RuleSetDoesNotExistException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an existing custom verification email template.
 *
 * For more information about custom verification email templates, see Using
 * Custom Verification Email Templates in the Amazon SES Developer
 * Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const updateCustomVerificationEmailTemplate: (
  input: UpdateCustomVerificationEmailTemplateRequest,
) => Effect.Effect<
  UpdateCustomVerificationEmailTemplateResponse,
  | CustomVerificationEmailInvalidContentException
  | CustomVerificationEmailTemplateDoesNotExistException
  | FromEmailAddressNotVerifiedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomVerificationEmailTemplateRequest,
  output: UpdateCustomVerificationEmailTemplateResponse,
  errors: [
    CustomVerificationEmailInvalidContentException,
    CustomVerificationEmailTemplateDoesNotExistException,
    FromEmailAddressNotVerifiedException,
  ],
}));
/**
 * Creates a receipt rule.
 *
 * For information about setting up receipt rules, see the Amazon SES
 * Developer Guide.
 *
 * You can execute this operation no more than once per second.
 */
export const createReceiptRule: (
  input: CreateReceiptRuleRequest,
) => Effect.Effect<
  CreateReceiptRuleResponse,
  | AlreadyExistsException
  | InvalidLambdaFunctionException
  | InvalidS3ConfigurationException
  | InvalidSnsTopicException
  | LimitExceededException
  | RuleDoesNotExistException
  | RuleSetDoesNotExistException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an association between a configuration set and a custom domain for open and
 * click event tracking.
 *
 * By default, images and links used for tracking open and click events are hosted on
 * domains operated by Amazon SES. You can configure a subdomain of your own to handle these
 * events. For information about using custom domains, see the Amazon SES Developer Guide.
 */
export const createConfigurationSetTrackingOptions: (
  input: CreateConfigurationSetTrackingOptionsRequest,
) => Effect.Effect<
  CreateConfigurationSetTrackingOptionsResponse,
  | ConfigurationSetDoesNotExistException
  | InvalidTrackingOptionsException
  | TrackingOptionsAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfigurationSetTrackingOptionsRequest,
  output: CreateConfigurationSetTrackingOptionsResponse,
  errors: [
    ConfigurationSetDoesNotExistException,
    InvalidTrackingOptionsException,
    TrackingOptionsAlreadyExistsException,
  ],
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
export const sendBounce: (
  input: SendBounceRequest,
) => Effect.Effect<
  SendBounceResponse,
  MessageRejected | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendBounceRequest,
  output: SendBounceResponse,
  errors: [MessageRejected],
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
export const sendTemplatedEmail: (
  input: SendTemplatedEmailRequest,
) => Effect.Effect<
  SendTemplatedEmailResponse,
  | AccountSendingPausedException
  | ConfigurationSetDoesNotExistException
  | ConfigurationSetSendingPausedException
  | MailFromDomainNotVerifiedException
  | MessageRejected
  | TemplateDoesNotExistException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const sendRawEmail: (
  input: SendRawEmailRequest,
) => Effect.Effect<
  SendRawEmailResponse,
  | AccountSendingPausedException
  | ConfigurationSetDoesNotExistException
  | ConfigurationSetSendingPausedException
  | MailFromDomainNotVerifiedException
  | MessageRejected
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const sendBulkTemplatedEmail: (
  input: SendBulkTemplatedEmailRequest,
) => Effect.Effect<
  SendBulkTemplatedEmailResponse,
  | AccountSendingPausedException
  | ConfigurationSetDoesNotExistException
  | ConfigurationSetSendingPausedException
  | MailFromDomainNotVerifiedException
  | MessageRejected
  | TemplateDoesNotExistException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const sendEmail: (
  input: SendEmailRequest,
) => Effect.Effect<
  SendEmailResponse,
  | AccountSendingPausedException
  | ConfigurationSetDoesNotExistException
  | ConfigurationSetSendingPausedException
  | MailFromDomainNotVerifiedException
  | MessageRejected
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const sendCustomVerificationEmail: (
  input: SendCustomVerificationEmailRequest,
) => Effect.Effect<
  SendCustomVerificationEmailResponse,
  | ConfigurationSetDoesNotExistException
  | CustomVerificationEmailTemplateDoesNotExistException
  | FromEmailAddressNotVerifiedException
  | MessageRejected
  | ProductionAccessNotGrantedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendCustomVerificationEmailRequest,
  output: SendCustomVerificationEmailResponse,
  errors: [
    ConfigurationSetDoesNotExistException,
    CustomVerificationEmailTemplateDoesNotExistException,
    FromEmailAddressNotVerifiedException,
    MessageRejected,
    ProductionAccessNotGrantedException,
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
export const updateConfigurationSetEventDestination: (
  input: UpdateConfigurationSetEventDestinationRequest,
) => Effect.Effect<
  UpdateConfigurationSetEventDestinationResponse,
  | ConfigurationSetDoesNotExistException
  | EventDestinationDoesNotExistException
  | InvalidCloudWatchDestinationException
  | InvalidFirehoseDestinationException
  | InvalidSNSDestinationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createConfigurationSetEventDestination: (
  input: CreateConfigurationSetEventDestinationRequest,
) => Effect.Effect<
  CreateConfigurationSetEventDestinationResponse,
  | ConfigurationSetDoesNotExistException
  | EventDestinationAlreadyExistsException
  | InvalidCloudWatchDestinationException
  | InvalidFirehoseDestinationException
  | InvalidSNSDestinationException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

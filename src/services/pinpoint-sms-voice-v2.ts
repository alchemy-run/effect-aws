import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Pinpoint SMS Voice V2",
  serviceShapeName: "PinpointSMSVoiceV2",
});
const auth = T.AwsAuthSigv4({ name: "sms-voice" });
const ver = T.ServiceVersion("2022-03-31");
const proto = T.AwsProtocolsAwsJson1_0();
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
                        url: "https://sms-voice-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://sms-voice-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://sms-voice.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://sms-voice.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteAccountDefaultProtectConfigurationRequest extends S.Class<DeleteAccountDefaultProtectConfigurationRequest>(
  "DeleteAccountDefaultProtectConfigurationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMediaMessageSpendLimitOverrideRequest extends S.Class<DeleteMediaMessageSpendLimitOverrideRequest>(
  "DeleteMediaMessageSpendLimitOverrideRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTextMessageSpendLimitOverrideRequest extends S.Class<DeleteTextMessageSpendLimitOverrideRequest>(
  "DeleteTextMessageSpendLimitOverrideRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVoiceMessageSpendLimitOverrideRequest extends S.Class<DeleteVoiceMessageSpendLimitOverrideRequest>(
  "DeleteVoiceMessageSpendLimitOverrideRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const EventTypeList = S.Array(S.String);
export const ConfigurationSetNameList = S.Array(S.String);
export const KeywordList = S.Array(S.String);
export const OptedOutNumberList = S.Array(S.String);
export const OptOutListNameList = S.Array(S.String);
export const PhoneNumberIdList = S.Array(S.String);
export const PoolIdList = S.Array(S.String);
export const ProtectConfigurationIdList = S.Array(S.String);
export const RegistrationAttachmentIdList = S.Array(S.String);
export const FieldPathList = S.Array(S.String);
export const RegistrationIdList = S.Array(S.String);
export const SectionPathList = S.Array(S.String);
export const RegistrationTypeList = S.Array(S.String);
export const RegistrationVersionNumberList = S.Array(S.Number);
export const VerifiedDestinationNumberIdList = S.Array(S.String);
export const DestinationPhoneNumberList = S.Array(S.String);
export const SelectChoiceList = S.Array(S.String);
export const NumberCapabilityList = S.Array(S.String);
export const MessageTypeList = S.Array(S.String);
export const MediaUrlList = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const NonEmptyTagList = S.Array(Tag);
export const TagKeyList = S.Array(S.String);
export class AssociateOriginationIdentityRequest extends S.Class<AssociateOriginationIdentityRequest>(
  "AssociateOriginationIdentityRequest",
)(
  {
    PoolId: S.String,
    OriginationIdentity: S.String,
    IsoCountryCode: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateProtectConfigurationRequest extends S.Class<AssociateProtectConfigurationRequest>(
  "AssociateProtectConfigurationRequest",
)(
  { ProtectConfigurationId: S.String, ConfigurationSetName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CarrierLookupRequest extends S.Class<CarrierLookupRequest>(
  "CarrierLookupRequest",
)(
  { PhoneNumber: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagList = S.Array(Tag);
export class CreateOptOutListRequest extends S.Class<CreateOptOutListRequest>(
  "CreateOptOutListRequest",
)(
  {
    OptOutListName: S.String,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePoolRequest extends S.Class<CreatePoolRequest>(
  "CreatePoolRequest",
)(
  {
    OriginationIdentity: S.String,
    IsoCountryCode: S.String,
    MessageType: S.String,
    DeletionProtectionEnabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProtectConfigurationRequest extends S.Class<CreateProtectConfigurationRequest>(
  "CreateProtectConfigurationRequest",
)(
  {
    ClientToken: S.optional(S.String),
    DeletionProtectionEnabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRegistrationRequest extends S.Class<CreateRegistrationRequest>(
  "CreateRegistrationRequest",
)(
  {
    RegistrationType: S.String,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRegistrationAssociationRequest extends S.Class<CreateRegistrationAssociationRequest>(
  "CreateRegistrationAssociationRequest",
)(
  { RegistrationId: S.String, ResourceId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRegistrationAttachmentRequest extends S.Class<CreateRegistrationAttachmentRequest>(
  "CreateRegistrationAttachmentRequest",
)(
  {
    AttachmentBody: S.optional(T.Blob),
    AttachmentUrl: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRegistrationVersionRequest extends S.Class<CreateRegistrationVersionRequest>(
  "CreateRegistrationVersionRequest",
)(
  { RegistrationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVerifiedDestinationNumberRequest extends S.Class<CreateVerifiedDestinationNumberRequest>(
  "CreateVerifiedDestinationNumberRequest",
)(
  {
    DestinationPhoneNumber: S.String,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccountDefaultProtectConfigurationResult extends S.Class<DeleteAccountDefaultProtectConfigurationResult>(
  "DeleteAccountDefaultProtectConfigurationResult",
)({
  DefaultProtectConfigurationArn: S.String,
  DefaultProtectConfigurationId: S.String,
}) {}
export class DeleteConfigurationSetRequest extends S.Class<DeleteConfigurationSetRequest>(
  "DeleteConfigurationSetRequest",
)(
  { ConfigurationSetName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDefaultMessageTypeRequest extends S.Class<DeleteDefaultMessageTypeRequest>(
  "DeleteDefaultMessageTypeRequest",
)(
  { ConfigurationSetName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDefaultSenderIdRequest extends S.Class<DeleteDefaultSenderIdRequest>(
  "DeleteDefaultSenderIdRequest",
)(
  { ConfigurationSetName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEventDestinationRequest extends S.Class<DeleteEventDestinationRequest>(
  "DeleteEventDestinationRequest",
)(
  { ConfigurationSetName: S.String, EventDestinationName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteKeywordRequest extends S.Class<DeleteKeywordRequest>(
  "DeleteKeywordRequest",
)(
  { OriginationIdentity: S.String, Keyword: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMediaMessageSpendLimitOverrideResult extends S.Class<DeleteMediaMessageSpendLimitOverrideResult>(
  "DeleteMediaMessageSpendLimitOverrideResult",
)({ MonthlyLimit: S.optional(S.Number) }) {}
export class DeleteOptedOutNumberRequest extends S.Class<DeleteOptedOutNumberRequest>(
  "DeleteOptedOutNumberRequest",
)(
  { OptOutListName: S.String, OptedOutNumber: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOptOutListRequest extends S.Class<DeleteOptOutListRequest>(
  "DeleteOptOutListRequest",
)(
  { OptOutListName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePoolRequest extends S.Class<DeletePoolRequest>(
  "DeletePoolRequest",
)(
  { PoolId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProtectConfigurationRequest extends S.Class<DeleteProtectConfigurationRequest>(
  "DeleteProtectConfigurationRequest",
)(
  { ProtectConfigurationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProtectConfigurationRuleSetNumberOverrideRequest extends S.Class<DeleteProtectConfigurationRuleSetNumberOverrideRequest>(
  "DeleteProtectConfigurationRuleSetNumberOverrideRequest",
)(
  { ProtectConfigurationId: S.String, DestinationPhoneNumber: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRegistrationRequest extends S.Class<DeleteRegistrationRequest>(
  "DeleteRegistrationRequest",
)(
  { RegistrationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRegistrationAttachmentRequest extends S.Class<DeleteRegistrationAttachmentRequest>(
  "DeleteRegistrationAttachmentRequest",
)(
  { RegistrationAttachmentId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRegistrationFieldValueRequest extends S.Class<DeleteRegistrationFieldValueRequest>(
  "DeleteRegistrationFieldValueRequest",
)(
  { RegistrationId: S.String, FieldPath: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTextMessageSpendLimitOverrideResult extends S.Class<DeleteTextMessageSpendLimitOverrideResult>(
  "DeleteTextMessageSpendLimitOverrideResult",
)({ MonthlyLimit: S.optional(S.Number) }) {}
export class DeleteVerifiedDestinationNumberRequest extends S.Class<DeleteVerifiedDestinationNumberRequest>(
  "DeleteVerifiedDestinationNumberRequest",
)(
  { VerifiedDestinationNumberId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVoiceMessageSpendLimitOverrideResult extends S.Class<DeleteVoiceMessageSpendLimitOverrideResult>(
  "DeleteVoiceMessageSpendLimitOverrideResult",
)({ MonthlyLimit: S.optional(S.Number) }) {}
export class DescribeAccountAttributesRequest extends S.Class<DescribeAccountAttributesRequest>(
  "DescribeAccountAttributesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAccountLimitsRequest extends S.Class<DescribeAccountLimitsRequest>(
  "DescribeAccountLimitsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOptOutListsRequest extends S.Class<DescribeOptOutListsRequest>(
  "DescribeOptOutListsRequest",
)(
  {
    OptOutListNames: S.optional(OptOutListNameList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Owner: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRegistrationFieldDefinitionsRequest extends S.Class<DescribeRegistrationFieldDefinitionsRequest>(
  "DescribeRegistrationFieldDefinitionsRequest",
)(
  {
    RegistrationType: S.String,
    SectionPath: S.optional(S.String),
    FieldPaths: S.optional(FieldPathList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRegistrationFieldValuesRequest extends S.Class<DescribeRegistrationFieldValuesRequest>(
  "DescribeRegistrationFieldValuesRequest",
)(
  {
    RegistrationId: S.String,
    VersionNumber: S.optional(S.Number),
    SectionPath: S.optional(S.String),
    FieldPaths: S.optional(FieldPathList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRegistrationSectionDefinitionsRequest extends S.Class<DescribeRegistrationSectionDefinitionsRequest>(
  "DescribeRegistrationSectionDefinitionsRequest",
)(
  {
    RegistrationType: S.String,
    SectionPaths: S.optional(SectionPathList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSpendLimitsRequest extends S.Class<DescribeSpendLimitsRequest>(
  "DescribeSpendLimitsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateOriginationIdentityRequest extends S.Class<DisassociateOriginationIdentityRequest>(
  "DisassociateOriginationIdentityRequest",
)(
  {
    PoolId: S.String,
    OriginationIdentity: S.String,
    IsoCountryCode: S.String,
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateProtectConfigurationRequest extends S.Class<DisassociateProtectConfigurationRequest>(
  "DisassociateProtectConfigurationRequest",
)(
  { ProtectConfigurationId: S.String, ConfigurationSetName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DiscardRegistrationVersionRequest extends S.Class<DiscardRegistrationVersionRequest>(
  "DiscardRegistrationVersionRequest",
)(
  { RegistrationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetProtectConfigurationCountryRuleSetRequest extends S.Class<GetProtectConfigurationCountryRuleSetRequest>(
  "GetProtectConfigurationCountryRuleSetRequest",
)(
  { ProtectConfigurationId: S.String, NumberCapability: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutKeywordRequest extends S.Class<PutKeywordRequest>(
  "PutKeywordRequest",
)(
  {
    OriginationIdentity: S.String,
    Keyword: S.String,
    KeywordMessage: S.String,
    KeywordAction: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutMessageFeedbackRequest extends S.Class<PutMessageFeedbackRequest>(
  "PutMessageFeedbackRequest",
)(
  { MessageId: S.String, MessageFeedbackStatus: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutOptedOutNumberRequest extends S.Class<PutOptedOutNumberRequest>(
  "PutOptedOutNumberRequest",
)(
  { OptOutListName: S.String, OptedOutNumber: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutProtectConfigurationRuleSetNumberOverrideRequest extends S.Class<PutProtectConfigurationRuleSetNumberOverrideRequest>(
  "PutProtectConfigurationRuleSetNumberOverrideRequest",
)(
  {
    ClientToken: S.optional(S.String),
    ProtectConfigurationId: S.String,
    DestinationPhoneNumber: S.String,
    Action: S.String,
    ExpirationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutRegistrationFieldValueRequest extends S.Class<PutRegistrationFieldValueRequest>(
  "PutRegistrationFieldValueRequest",
)(
  {
    RegistrationId: S.String,
    FieldPath: S.String,
    SelectChoices: S.optional(SelectChoiceList),
    TextValue: S.optional(S.String),
    RegistrationAttachmentId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  { ResourceArn: S.String, Policy: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ReleasePhoneNumberRequest extends S.Class<ReleasePhoneNumberRequest>(
  "ReleasePhoneNumberRequest",
)(
  { PhoneNumberId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ReleaseSenderIdRequest extends S.Class<ReleaseSenderIdRequest>(
  "ReleaseSenderIdRequest",
)(
  { SenderId: S.String, IsoCountryCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RequestPhoneNumberRequest extends S.Class<RequestPhoneNumberRequest>(
  "RequestPhoneNumberRequest",
)(
  {
    IsoCountryCode: S.String,
    MessageType: S.String,
    NumberCapabilities: NumberCapabilityList,
    NumberType: S.String,
    OptOutListName: S.optional(S.String),
    PoolId: S.optional(S.String),
    RegistrationId: S.optional(S.String),
    InternationalSendingEnabled: S.optional(S.Boolean),
    DeletionProtectionEnabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RequestSenderIdRequest extends S.Class<RequestSenderIdRequest>(
  "RequestSenderIdRequest",
)(
  {
    SenderId: S.String,
    IsoCountryCode: S.String,
    MessageTypes: S.optional(MessageTypeList),
    DeletionProtectionEnabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ContextMap = S.Record({ key: S.String, value: S.String });
export class SendMediaMessageRequest extends S.Class<SendMediaMessageRequest>(
  "SendMediaMessageRequest",
)(
  {
    DestinationPhoneNumber: S.String,
    OriginationIdentity: S.String,
    MessageBody: S.optional(S.String),
    MediaUrls: S.optional(MediaUrlList),
    ConfigurationSetName: S.optional(S.String),
    MaxPrice: S.optional(S.String),
    TimeToLive: S.optional(S.Number),
    Context: S.optional(ContextMap),
    DryRun: S.optional(S.Boolean),
    ProtectConfigurationId: S.optional(S.String),
    MessageFeedbackEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const DestinationCountryParameters = S.Record({
  key: S.String,
  value: S.String,
});
export class SendTextMessageRequest extends S.Class<SendTextMessageRequest>(
  "SendTextMessageRequest",
)(
  {
    DestinationPhoneNumber: S.String,
    OriginationIdentity: S.optional(S.String),
    MessageBody: S.optional(S.String),
    MessageType: S.optional(S.String),
    Keyword: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    MaxPrice: S.optional(S.String),
    TimeToLive: S.optional(S.Number),
    Context: S.optional(ContextMap),
    DestinationCountryParameters: S.optional(DestinationCountryParameters),
    DryRun: S.optional(S.Boolean),
    ProtectConfigurationId: S.optional(S.String),
    MessageFeedbackEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendVoiceMessageRequest extends S.Class<SendVoiceMessageRequest>(
  "SendVoiceMessageRequest",
)(
  {
    DestinationPhoneNumber: S.String,
    OriginationIdentity: S.String,
    MessageBody: S.optional(S.String),
    MessageBodyTextType: S.optional(S.String),
    VoiceId: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    MaxPricePerMinute: S.optional(S.String),
    TimeToLive: S.optional(S.Number),
    Context: S.optional(ContextMap),
    DryRun: S.optional(S.Boolean),
    ProtectConfigurationId: S.optional(S.String),
    MessageFeedbackEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetAccountDefaultProtectConfigurationRequest extends S.Class<SetAccountDefaultProtectConfigurationRequest>(
  "SetAccountDefaultProtectConfigurationRequest",
)(
  { ProtectConfigurationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetDefaultMessageFeedbackEnabledRequest extends S.Class<SetDefaultMessageFeedbackEnabledRequest>(
  "SetDefaultMessageFeedbackEnabledRequest",
)(
  { ConfigurationSetName: S.String, MessageFeedbackEnabled: S.Boolean },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetDefaultMessageTypeRequest extends S.Class<SetDefaultMessageTypeRequest>(
  "SetDefaultMessageTypeRequest",
)(
  { ConfigurationSetName: S.String, MessageType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetDefaultSenderIdRequest extends S.Class<SetDefaultSenderIdRequest>(
  "SetDefaultSenderIdRequest",
)(
  { ConfigurationSetName: S.String, SenderId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetMediaMessageSpendLimitOverrideRequest extends S.Class<SetMediaMessageSpendLimitOverrideRequest>(
  "SetMediaMessageSpendLimitOverrideRequest",
)(
  { MonthlyLimit: S.Number },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetTextMessageSpendLimitOverrideRequest extends S.Class<SetTextMessageSpendLimitOverrideRequest>(
  "SetTextMessageSpendLimitOverrideRequest",
)(
  { MonthlyLimit: S.Number },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetVoiceMessageSpendLimitOverrideRequest extends S.Class<SetVoiceMessageSpendLimitOverrideRequest>(
  "SetVoiceMessageSpendLimitOverrideRequest",
)(
  { MonthlyLimit: S.Number },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SubmitRegistrationVersionRequest extends S.Class<SubmitRegistrationVersionRequest>(
  "SubmitRegistrationVersionRequest",
)(
  { RegistrationId: S.String, AwsReview: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: NonEmptyTagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResult extends S.Class<TagResourceResult>(
  "TagResourceResult",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResult extends S.Class<UntagResourceResult>(
  "UntagResourceResult",
)({}) {}
export class CloudWatchLogsDestination extends S.Class<CloudWatchLogsDestination>(
  "CloudWatchLogsDestination",
)({ IamRoleArn: S.String, LogGroupArn: S.String }) {}
export class KinesisFirehoseDestination extends S.Class<KinesisFirehoseDestination>(
  "KinesisFirehoseDestination",
)({ IamRoleArn: S.String, DeliveryStreamArn: S.String }) {}
export class SnsDestination extends S.Class<SnsDestination>("SnsDestination")({
  TopicArn: S.String,
}) {}
export class UpdateEventDestinationRequest extends S.Class<UpdateEventDestinationRequest>(
  "UpdateEventDestinationRequest",
)(
  {
    ConfigurationSetName: S.String,
    EventDestinationName: S.String,
    Enabled: S.optional(S.Boolean),
    MatchingEventTypes: S.optional(EventTypeList),
    CloudWatchLogsDestination: S.optional(CloudWatchLogsDestination),
    KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
    SnsDestination: S.optional(SnsDestination),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePhoneNumberRequest extends S.Class<UpdatePhoneNumberRequest>(
  "UpdatePhoneNumberRequest",
)(
  {
    PhoneNumberId: S.String,
    TwoWayEnabled: S.optional(S.Boolean),
    TwoWayChannelArn: S.optional(S.String),
    TwoWayChannelRole: S.optional(S.String),
    SelfManagedOptOutsEnabled: S.optional(S.Boolean),
    OptOutListName: S.optional(S.String),
    InternationalSendingEnabled: S.optional(S.Boolean),
    DeletionProtectionEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePoolRequest extends S.Class<UpdatePoolRequest>(
  "UpdatePoolRequest",
)(
  {
    PoolId: S.String,
    TwoWayEnabled: S.optional(S.Boolean),
    TwoWayChannelArn: S.optional(S.String),
    TwoWayChannelRole: S.optional(S.String),
    SelfManagedOptOutsEnabled: S.optional(S.Boolean),
    OptOutListName: S.optional(S.String),
    SharedRoutesEnabled: S.optional(S.Boolean),
    DeletionProtectionEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProtectConfigurationRequest extends S.Class<UpdateProtectConfigurationRequest>(
  "UpdateProtectConfigurationRequest",
)(
  {
    ProtectConfigurationId: S.String,
    DeletionProtectionEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSenderIdRequest extends S.Class<UpdateSenderIdRequest>(
  "UpdateSenderIdRequest",
)(
  {
    SenderId: S.String,
    IsoCountryCode: S.String,
    DeletionProtectionEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class VerifyDestinationNumberRequest extends S.Class<VerifyDestinationNumberRequest>(
  "VerifyDestinationNumberRequest",
)(
  { VerifiedDestinationNumberId: S.String, VerificationCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FilterValueList = S.Array(S.String);
export class ConfigurationSetFilter extends S.Class<ConfigurationSetFilter>(
  "ConfigurationSetFilter",
)({ Name: S.String, Values: FilterValueList }) {}
export const ConfigurationSetFilterList = S.Array(ConfigurationSetFilter);
export class KeywordFilter extends S.Class<KeywordFilter>("KeywordFilter")({
  Name: S.String,
  Values: FilterValueList,
}) {}
export const KeywordFilterList = S.Array(KeywordFilter);
export class OptedOutFilter extends S.Class<OptedOutFilter>("OptedOutFilter")({
  Name: S.String,
  Values: FilterValueList,
}) {}
export const OptedOutFilterList = S.Array(OptedOutFilter);
export class PhoneNumberFilter extends S.Class<PhoneNumberFilter>(
  "PhoneNumberFilter",
)({ Name: S.String, Values: FilterValueList }) {}
export const PhoneNumberFilterList = S.Array(PhoneNumberFilter);
export class PoolFilter extends S.Class<PoolFilter>("PoolFilter")({
  Name: S.String,
  Values: FilterValueList,
}) {}
export const PoolFilterList = S.Array(PoolFilter);
export class ProtectConfigurationFilter extends S.Class<ProtectConfigurationFilter>(
  "ProtectConfigurationFilter",
)({ Name: S.String, Values: FilterValueList }) {}
export const ProtectConfigurationFilterList = S.Array(
  ProtectConfigurationFilter,
);
export class RegistrationAttachmentFilter extends S.Class<RegistrationAttachmentFilter>(
  "RegistrationAttachmentFilter",
)({ Name: S.String, Values: FilterValueList }) {}
export const RegistrationAttachmentFilterList = S.Array(
  RegistrationAttachmentFilter,
);
export class RegistrationFilter extends S.Class<RegistrationFilter>(
  "RegistrationFilter",
)({ Name: S.String, Values: FilterValueList }) {}
export const RegistrationFilterList = S.Array(RegistrationFilter);
export class RegistrationTypeFilter extends S.Class<RegistrationTypeFilter>(
  "RegistrationTypeFilter",
)({ Name: S.String, Values: FilterValueList }) {}
export const RegistrationTypeFilterList = S.Array(RegistrationTypeFilter);
export class RegistrationVersionFilter extends S.Class<RegistrationVersionFilter>(
  "RegistrationVersionFilter",
)({ Name: S.String, Values: FilterValueList }) {}
export const RegistrationVersionFilterList = S.Array(RegistrationVersionFilter);
export class SenderIdAndCountry extends S.Class<SenderIdAndCountry>(
  "SenderIdAndCountry",
)({ SenderId: S.String, IsoCountryCode: S.String }) {}
export const SenderIdList = S.Array(SenderIdAndCountry);
export class SenderIdFilter extends S.Class<SenderIdFilter>("SenderIdFilter")({
  Name: S.String,
  Values: FilterValueList,
}) {}
export const SenderIdFilterList = S.Array(SenderIdFilter);
export class VerifiedDestinationNumberFilter extends S.Class<VerifiedDestinationNumberFilter>(
  "VerifiedDestinationNumberFilter",
)({ Name: S.String, Values: FilterValueList }) {}
export const VerifiedDestinationNumberFilterList = S.Array(
  VerifiedDestinationNumberFilter,
);
export class PoolOriginationIdentitiesFilter extends S.Class<PoolOriginationIdentitiesFilter>(
  "PoolOriginationIdentitiesFilter",
)({ Name: S.String, Values: FilterValueList }) {}
export const PoolOriginationIdentitiesFilterList = S.Array(
  PoolOriginationIdentitiesFilter,
);
export class ProtectConfigurationRuleSetNumberOverrideFilterItem extends S.Class<ProtectConfigurationRuleSetNumberOverrideFilterItem>(
  "ProtectConfigurationRuleSetNumberOverrideFilterItem",
)({ Name: S.String, Values: FilterValueList }) {}
export const ListProtectConfigurationRuleSetNumberOverrideFilter = S.Array(
  ProtectConfigurationRuleSetNumberOverrideFilterItem,
);
export class RegistrationAssociationFilter extends S.Class<RegistrationAssociationFilter>(
  "RegistrationAssociationFilter",
)({ Name: S.String, Values: FilterValueList }) {}
export const RegistrationAssociationFilterList = S.Array(
  RegistrationAssociationFilter,
);
export class AssociateOriginationIdentityResult extends S.Class<AssociateOriginationIdentityResult>(
  "AssociateOriginationIdentityResult",
)({
  PoolArn: S.optional(S.String),
  PoolId: S.optional(S.String),
  OriginationIdentityArn: S.optional(S.String),
  OriginationIdentity: S.optional(S.String),
  IsoCountryCode: S.optional(S.String),
}) {}
export class AssociateProtectConfigurationResult extends S.Class<AssociateProtectConfigurationResult>(
  "AssociateProtectConfigurationResult",
)({
  ConfigurationSetArn: S.String,
  ConfigurationSetName: S.String,
  ProtectConfigurationArn: S.String,
  ProtectConfigurationId: S.String,
}) {}
export class CarrierLookupResult extends S.Class<CarrierLookupResult>(
  "CarrierLookupResult",
)({
  E164PhoneNumber: S.String,
  DialingCountryCode: S.optional(S.String),
  IsoCountryCode: S.optional(S.String),
  Country: S.optional(S.String),
  MCC: S.optional(S.String),
  MNC: S.optional(S.String),
  Carrier: S.optional(S.String),
  PhoneNumberType: S.String,
}) {}
export class CreateConfigurationSetRequest extends S.Class<CreateConfigurationSetRequest>(
  "CreateConfigurationSetRequest",
)(
  {
    ConfigurationSetName: S.String,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEventDestinationRequest extends S.Class<CreateEventDestinationRequest>(
  "CreateEventDestinationRequest",
)(
  {
    ConfigurationSetName: S.String,
    EventDestinationName: S.String,
    MatchingEventTypes: EventTypeList,
    CloudWatchLogsDestination: S.optional(CloudWatchLogsDestination),
    KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
    SnsDestination: S.optional(SnsDestination),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateOptOutListResult extends S.Class<CreateOptOutListResult>(
  "CreateOptOutListResult",
)({
  OptOutListArn: S.optional(S.String),
  OptOutListName: S.optional(S.String),
  Tags: S.optional(TagList),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreatePoolResult extends S.Class<CreatePoolResult>(
  "CreatePoolResult",
)({
  PoolArn: S.optional(S.String),
  PoolId: S.optional(S.String),
  Status: S.optional(S.String),
  MessageType: S.optional(S.String),
  TwoWayEnabled: S.optional(S.Boolean),
  TwoWayChannelArn: S.optional(S.String),
  TwoWayChannelRole: S.optional(S.String),
  SelfManagedOptOutsEnabled: S.optional(S.Boolean),
  OptOutListName: S.optional(S.String),
  SharedRoutesEnabled: S.optional(S.Boolean),
  DeletionProtectionEnabled: S.optional(S.Boolean),
  Tags: S.optional(TagList),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateProtectConfigurationResult extends S.Class<CreateProtectConfigurationResult>(
  "CreateProtectConfigurationResult",
)({
  ProtectConfigurationArn: S.String,
  ProtectConfigurationId: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  AccountDefault: S.Boolean,
  DeletionProtectionEnabled: S.Boolean,
  Tags: S.optional(TagList),
}) {}
export class CreateRegistrationAssociationResult extends S.Class<CreateRegistrationAssociationResult>(
  "CreateRegistrationAssociationResult",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  RegistrationType: S.String,
  ResourceArn: S.String,
  ResourceId: S.String,
  ResourceType: S.String,
  IsoCountryCode: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
}) {}
export class CreateRegistrationAttachmentResult extends S.Class<CreateRegistrationAttachmentResult>(
  "CreateRegistrationAttachmentResult",
)({
  RegistrationAttachmentArn: S.String,
  RegistrationAttachmentId: S.String,
  AttachmentStatus: S.String,
  Tags: S.optional(TagList),
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class CreateVerifiedDestinationNumberResult extends S.Class<CreateVerifiedDestinationNumberResult>(
  "CreateVerifiedDestinationNumberResult",
)({
  VerifiedDestinationNumberArn: S.String,
  VerifiedDestinationNumberId: S.String,
  DestinationPhoneNumber: S.String,
  Status: S.String,
  Tags: S.optional(TagList),
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DeleteDefaultMessageTypeResult extends S.Class<DeleteDefaultMessageTypeResult>(
  "DeleteDefaultMessageTypeResult",
)({
  ConfigurationSetArn: S.optional(S.String),
  ConfigurationSetName: S.optional(S.String),
  MessageType: S.optional(S.String),
}) {}
export class DeleteDefaultSenderIdResult extends S.Class<DeleteDefaultSenderIdResult>(
  "DeleteDefaultSenderIdResult",
)({
  ConfigurationSetArn: S.optional(S.String),
  ConfigurationSetName: S.optional(S.String),
  SenderId: S.optional(S.String),
}) {}
export class EventDestination extends S.Class<EventDestination>(
  "EventDestination",
)({
  EventDestinationName: S.String,
  Enabled: S.Boolean,
  MatchingEventTypes: EventTypeList,
  CloudWatchLogsDestination: S.optional(CloudWatchLogsDestination),
  KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
  SnsDestination: S.optional(SnsDestination),
}) {}
export class DeleteEventDestinationResult extends S.Class<DeleteEventDestinationResult>(
  "DeleteEventDestinationResult",
)({
  ConfigurationSetArn: S.optional(S.String),
  ConfigurationSetName: S.optional(S.String),
  EventDestination: S.optional(EventDestination),
}) {}
export class DeleteKeywordResult extends S.Class<DeleteKeywordResult>(
  "DeleteKeywordResult",
)({
  OriginationIdentityArn: S.optional(S.String),
  OriginationIdentity: S.optional(S.String),
  Keyword: S.optional(S.String),
  KeywordMessage: S.optional(S.String),
  KeywordAction: S.optional(S.String),
}) {}
export class DeleteOptedOutNumberResult extends S.Class<DeleteOptedOutNumberResult>(
  "DeleteOptedOutNumberResult",
)({
  OptOutListArn: S.optional(S.String),
  OptOutListName: S.optional(S.String),
  OptedOutNumber: S.optional(S.String),
  OptedOutTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  EndUserOptedOut: S.optional(S.Boolean),
}) {}
export class DeleteOptOutListResult extends S.Class<DeleteOptOutListResult>(
  "DeleteOptOutListResult",
)({
  OptOutListArn: S.optional(S.String),
  OptOutListName: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeletePoolResult extends S.Class<DeletePoolResult>(
  "DeletePoolResult",
)({
  PoolArn: S.optional(S.String),
  PoolId: S.optional(S.String),
  Status: S.optional(S.String),
  MessageType: S.optional(S.String),
  TwoWayEnabled: S.optional(S.Boolean),
  TwoWayChannelArn: S.optional(S.String),
  TwoWayChannelRole: S.optional(S.String),
  SelfManagedOptOutsEnabled: S.optional(S.Boolean),
  OptOutListName: S.optional(S.String),
  SharedRoutesEnabled: S.optional(S.Boolean),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeleteProtectConfigurationResult extends S.Class<DeleteProtectConfigurationResult>(
  "DeleteProtectConfigurationResult",
)({
  ProtectConfigurationArn: S.String,
  ProtectConfigurationId: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  AccountDefault: S.Boolean,
  DeletionProtectionEnabled: S.Boolean,
}) {}
export class DeleteProtectConfigurationRuleSetNumberOverrideResult extends S.Class<DeleteProtectConfigurationRuleSetNumberOverrideResult>(
  "DeleteProtectConfigurationRuleSetNumberOverrideResult",
)({
  ProtectConfigurationArn: S.String,
  ProtectConfigurationId: S.String,
  DestinationPhoneNumber: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Action: S.String,
  IsoCountryCode: S.optional(S.String),
  ExpirationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const StringMap = S.Record({ key: S.String, value: S.String });
export class DeleteRegistrationResult extends S.Class<DeleteRegistrationResult>(
  "DeleteRegistrationResult",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  RegistrationType: S.String,
  RegistrationStatus: S.String,
  CurrentVersionNumber: S.Number,
  ApprovedVersionNumber: S.optional(S.Number),
  LatestDeniedVersionNumber: S.optional(S.Number),
  AdditionalAttributes: S.optional(StringMap),
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DeleteRegistrationAttachmentResult extends S.Class<DeleteRegistrationAttachmentResult>(
  "DeleteRegistrationAttachmentResult",
)({
  RegistrationAttachmentArn: S.String,
  RegistrationAttachmentId: S.String,
  AttachmentStatus: S.String,
  AttachmentUploadErrorReason: S.optional(S.String),
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DeleteRegistrationFieldValueResult extends S.Class<DeleteRegistrationFieldValueResult>(
  "DeleteRegistrationFieldValueResult",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  VersionNumber: S.Number,
  FieldPath: S.String,
  SelectChoices: S.optional(SelectChoiceList),
  TextValue: S.optional(S.String),
  RegistrationAttachmentId: S.optional(S.String),
}) {}
export class DeleteResourcePolicyResult extends S.Class<DeleteResourcePolicyResult>(
  "DeleteResourcePolicyResult",
)({
  ResourceArn: S.optional(S.String),
  Policy: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeleteVerifiedDestinationNumberResult extends S.Class<DeleteVerifiedDestinationNumberResult>(
  "DeleteVerifiedDestinationNumberResult",
)({
  VerifiedDestinationNumberArn: S.String,
  VerifiedDestinationNumberId: S.String,
  DestinationPhoneNumber: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class DescribeConfigurationSetsRequest extends S.Class<DescribeConfigurationSetsRequest>(
  "DescribeConfigurationSetsRequest",
)(
  {
    ConfigurationSetNames: S.optional(ConfigurationSetNameList),
    Filters: S.optional(ConfigurationSetFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeKeywordsRequest extends S.Class<DescribeKeywordsRequest>(
  "DescribeKeywordsRequest",
)(
  {
    OriginationIdentity: S.String,
    Keywords: S.optional(KeywordList),
    Filters: S.optional(KeywordFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOptedOutNumbersRequest extends S.Class<DescribeOptedOutNumbersRequest>(
  "DescribeOptedOutNumbersRequest",
)(
  {
    OptOutListName: S.String,
    OptedOutNumbers: S.optional(OptedOutNumberList),
    Filters: S.optional(OptedOutFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePhoneNumbersRequest extends S.Class<DescribePhoneNumbersRequest>(
  "DescribePhoneNumbersRequest",
)(
  {
    PhoneNumberIds: S.optional(PhoneNumberIdList),
    Filters: S.optional(PhoneNumberFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Owner: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePoolsRequest extends S.Class<DescribePoolsRequest>(
  "DescribePoolsRequest",
)(
  {
    PoolIds: S.optional(PoolIdList),
    Filters: S.optional(PoolFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Owner: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProtectConfigurationsRequest extends S.Class<DescribeProtectConfigurationsRequest>(
  "DescribeProtectConfigurationsRequest",
)(
  {
    ProtectConfigurationIds: S.optional(ProtectConfigurationIdList),
    Filters: S.optional(ProtectConfigurationFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRegistrationAttachmentsRequest extends S.Class<DescribeRegistrationAttachmentsRequest>(
  "DescribeRegistrationAttachmentsRequest",
)(
  {
    RegistrationAttachmentIds: S.optional(RegistrationAttachmentIdList),
    Filters: S.optional(RegistrationAttachmentFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRegistrationsRequest extends S.Class<DescribeRegistrationsRequest>(
  "DescribeRegistrationsRequest",
)(
  {
    RegistrationIds: S.optional(RegistrationIdList),
    Filters: S.optional(RegistrationFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRegistrationTypeDefinitionsRequest extends S.Class<DescribeRegistrationTypeDefinitionsRequest>(
  "DescribeRegistrationTypeDefinitionsRequest",
)(
  {
    RegistrationTypes: S.optional(RegistrationTypeList),
    Filters: S.optional(RegistrationTypeFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRegistrationVersionsRequest extends S.Class<DescribeRegistrationVersionsRequest>(
  "DescribeRegistrationVersionsRequest",
)(
  {
    RegistrationId: S.String,
    VersionNumbers: S.optional(RegistrationVersionNumberList),
    Filters: S.optional(RegistrationVersionFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSenderIdsRequest extends S.Class<DescribeSenderIdsRequest>(
  "DescribeSenderIdsRequest",
)(
  {
    SenderIds: S.optional(SenderIdList),
    Filters: S.optional(SenderIdFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Owner: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeVerifiedDestinationNumbersRequest extends S.Class<DescribeVerifiedDestinationNumbersRequest>(
  "DescribeVerifiedDestinationNumbersRequest",
)(
  {
    VerifiedDestinationNumberIds: S.optional(VerifiedDestinationNumberIdList),
    DestinationPhoneNumbers: S.optional(DestinationPhoneNumberList),
    Filters: S.optional(VerifiedDestinationNumberFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateOriginationIdentityResult extends S.Class<DisassociateOriginationIdentityResult>(
  "DisassociateOriginationIdentityResult",
)({
  PoolArn: S.optional(S.String),
  PoolId: S.optional(S.String),
  OriginationIdentityArn: S.optional(S.String),
  OriginationIdentity: S.optional(S.String),
  IsoCountryCode: S.optional(S.String),
}) {}
export class DisassociateProtectConfigurationResult extends S.Class<DisassociateProtectConfigurationResult>(
  "DisassociateProtectConfigurationResult",
)({
  ConfigurationSetArn: S.String,
  ConfigurationSetName: S.String,
  ProtectConfigurationArn: S.String,
  ProtectConfigurationId: S.String,
}) {}
export class RegistrationVersionStatusHistory extends S.Class<RegistrationVersionStatusHistory>(
  "RegistrationVersionStatusHistory",
)({
  DraftTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  SubmittedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AwsReviewingTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ReviewingTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  RequiresAuthenticationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ApprovedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DiscardedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DeniedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RevokedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ArchivedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class DiscardRegistrationVersionResult extends S.Class<DiscardRegistrationVersionResult>(
  "DiscardRegistrationVersionResult",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  VersionNumber: S.Number,
  RegistrationVersionStatus: S.String,
  RegistrationVersionStatusHistory: RegistrationVersionStatusHistory,
}) {}
export class ProtectConfigurationCountryRuleSetInformation extends S.Class<ProtectConfigurationCountryRuleSetInformation>(
  "ProtectConfigurationCountryRuleSetInformation",
)({ ProtectStatus: S.String }) {}
export const ProtectConfigurationCountryRuleSet = S.Record({
  key: S.String,
  value: ProtectConfigurationCountryRuleSetInformation,
});
export class GetProtectConfigurationCountryRuleSetResult extends S.Class<GetProtectConfigurationCountryRuleSetResult>(
  "GetProtectConfigurationCountryRuleSetResult",
)({
  ProtectConfigurationArn: S.String,
  ProtectConfigurationId: S.String,
  NumberCapability: S.String,
  CountryRuleSet: ProtectConfigurationCountryRuleSet,
}) {}
export class GetResourcePolicyResult extends S.Class<GetResourcePolicyResult>(
  "GetResourcePolicyResult",
)({
  ResourceArn: S.optional(S.String),
  Policy: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListPoolOriginationIdentitiesRequest extends S.Class<ListPoolOriginationIdentitiesRequest>(
  "ListPoolOriginationIdentitiesRequest",
)(
  {
    PoolId: S.String,
    Filters: S.optional(PoolOriginationIdentitiesFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProtectConfigurationRuleSetNumberOverridesRequest extends S.Class<ListProtectConfigurationRuleSetNumberOverridesRequest>(
  "ListProtectConfigurationRuleSetNumberOverridesRequest",
)(
  {
    ProtectConfigurationId: S.String,
    Filters: S.optional(ListProtectConfigurationRuleSetNumberOverrideFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRegistrationAssociationsRequest extends S.Class<ListRegistrationAssociationsRequest>(
  "ListRegistrationAssociationsRequest",
)(
  {
    RegistrationId: S.String,
    Filters: S.optional(RegistrationAssociationFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResult extends S.Class<ListTagsForResourceResult>(
  "ListTagsForResourceResult",
)({ ResourceArn: S.optional(S.String), Tags: S.optional(TagList) }) {}
export class PutKeywordResult extends S.Class<PutKeywordResult>(
  "PutKeywordResult",
)({
  OriginationIdentityArn: S.optional(S.String),
  OriginationIdentity: S.optional(S.String),
  Keyword: S.optional(S.String),
  KeywordMessage: S.optional(S.String),
  KeywordAction: S.optional(S.String),
}) {}
export class PutMessageFeedbackResult extends S.Class<PutMessageFeedbackResult>(
  "PutMessageFeedbackResult",
)({ MessageId: S.String, MessageFeedbackStatus: S.String }) {}
export class PutOptedOutNumberResult extends S.Class<PutOptedOutNumberResult>(
  "PutOptedOutNumberResult",
)({
  OptOutListArn: S.optional(S.String),
  OptOutListName: S.optional(S.String),
  OptedOutNumber: S.optional(S.String),
  OptedOutTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  EndUserOptedOut: S.optional(S.Boolean),
}) {}
export class PutProtectConfigurationRuleSetNumberOverrideResult extends S.Class<PutProtectConfigurationRuleSetNumberOverrideResult>(
  "PutProtectConfigurationRuleSetNumberOverrideResult",
)({
  ProtectConfigurationArn: S.String,
  ProtectConfigurationId: S.String,
  DestinationPhoneNumber: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Action: S.String,
  IsoCountryCode: S.optional(S.String),
  ExpirationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class PutRegistrationFieldValueResult extends S.Class<PutRegistrationFieldValueResult>(
  "PutRegistrationFieldValueResult",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  VersionNumber: S.Number,
  FieldPath: S.String,
  SelectChoices: S.optional(SelectChoiceList),
  TextValue: S.optional(S.String),
  RegistrationAttachmentId: S.optional(S.String),
}) {}
export class PutResourcePolicyResult extends S.Class<PutResourcePolicyResult>(
  "PutResourcePolicyResult",
)({
  ResourceArn: S.optional(S.String),
  Policy: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ReleasePhoneNumberResult extends S.Class<ReleasePhoneNumberResult>(
  "ReleasePhoneNumberResult",
)({
  PhoneNumberArn: S.optional(S.String),
  PhoneNumberId: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
  Status: S.optional(S.String),
  IsoCountryCode: S.optional(S.String),
  MessageType: S.optional(S.String),
  NumberCapabilities: S.optional(NumberCapabilityList),
  NumberType: S.optional(S.String),
  MonthlyLeasingPrice: S.optional(S.String),
  TwoWayEnabled: S.optional(S.Boolean),
  TwoWayChannelArn: S.optional(S.String),
  TwoWayChannelRole: S.optional(S.String),
  SelfManagedOptOutsEnabled: S.optional(S.Boolean),
  OptOutListName: S.optional(S.String),
  RegistrationId: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ReleaseSenderIdResult extends S.Class<ReleaseSenderIdResult>(
  "ReleaseSenderIdResult",
)({
  SenderIdArn: S.String,
  SenderId: S.String,
  IsoCountryCode: S.String,
  MessageTypes: MessageTypeList,
  MonthlyLeasingPrice: S.String,
  Registered: S.Boolean,
  RegistrationId: S.optional(S.String),
}) {}
export class RequestPhoneNumberResult extends S.Class<RequestPhoneNumberResult>(
  "RequestPhoneNumberResult",
)({
  PhoneNumberArn: S.optional(S.String),
  PhoneNumberId: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
  Status: S.optional(S.String),
  IsoCountryCode: S.optional(S.String),
  MessageType: S.optional(S.String),
  NumberCapabilities: S.optional(NumberCapabilityList),
  NumberType: S.optional(S.String),
  MonthlyLeasingPrice: S.optional(S.String),
  TwoWayEnabled: S.optional(S.Boolean),
  TwoWayChannelArn: S.optional(S.String),
  TwoWayChannelRole: S.optional(S.String),
  SelfManagedOptOutsEnabled: S.optional(S.Boolean),
  OptOutListName: S.optional(S.String),
  InternationalSendingEnabled: S.optional(S.Boolean),
  DeletionProtectionEnabled: S.optional(S.Boolean),
  PoolId: S.optional(S.String),
  RegistrationId: S.optional(S.String),
  Tags: S.optional(TagList),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RequestSenderIdResult extends S.Class<RequestSenderIdResult>(
  "RequestSenderIdResult",
)({
  SenderIdArn: S.String,
  SenderId: S.String,
  IsoCountryCode: S.String,
  MessageTypes: MessageTypeList,
  MonthlyLeasingPrice: S.String,
  DeletionProtectionEnabled: S.Boolean,
  Registered: S.Boolean,
  Tags: S.optional(TagList),
}) {}
export class SendDestinationNumberVerificationCodeRequest extends S.Class<SendDestinationNumberVerificationCodeRequest>(
  "SendDestinationNumberVerificationCodeRequest",
)(
  {
    VerifiedDestinationNumberId: S.String,
    VerificationChannel: S.String,
    LanguageCode: S.optional(S.String),
    OriginationIdentity: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    Context: S.optional(ContextMap),
    DestinationCountryParameters: S.optional(DestinationCountryParameters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendMediaMessageResult extends S.Class<SendMediaMessageResult>(
  "SendMediaMessageResult",
)({ MessageId: S.optional(S.String) }) {}
export class SendTextMessageResult extends S.Class<SendTextMessageResult>(
  "SendTextMessageResult",
)({ MessageId: S.optional(S.String) }) {}
export class SendVoiceMessageResult extends S.Class<SendVoiceMessageResult>(
  "SendVoiceMessageResult",
)({ MessageId: S.optional(S.String) }) {}
export class SetAccountDefaultProtectConfigurationResult extends S.Class<SetAccountDefaultProtectConfigurationResult>(
  "SetAccountDefaultProtectConfigurationResult",
)({
  DefaultProtectConfigurationArn: S.String,
  DefaultProtectConfigurationId: S.String,
}) {}
export class SetDefaultMessageFeedbackEnabledResult extends S.Class<SetDefaultMessageFeedbackEnabledResult>(
  "SetDefaultMessageFeedbackEnabledResult",
)({
  ConfigurationSetArn: S.optional(S.String),
  ConfigurationSetName: S.optional(S.String),
  MessageFeedbackEnabled: S.optional(S.Boolean),
}) {}
export class SetDefaultMessageTypeResult extends S.Class<SetDefaultMessageTypeResult>(
  "SetDefaultMessageTypeResult",
)({
  ConfigurationSetArn: S.optional(S.String),
  ConfigurationSetName: S.optional(S.String),
  MessageType: S.optional(S.String),
}) {}
export class SetDefaultSenderIdResult extends S.Class<SetDefaultSenderIdResult>(
  "SetDefaultSenderIdResult",
)({
  ConfigurationSetArn: S.optional(S.String),
  ConfigurationSetName: S.optional(S.String),
  SenderId: S.optional(S.String),
}) {}
export class SetMediaMessageSpendLimitOverrideResult extends S.Class<SetMediaMessageSpendLimitOverrideResult>(
  "SetMediaMessageSpendLimitOverrideResult",
)({ MonthlyLimit: S.optional(S.Number) }) {}
export class SetTextMessageSpendLimitOverrideResult extends S.Class<SetTextMessageSpendLimitOverrideResult>(
  "SetTextMessageSpendLimitOverrideResult",
)({ MonthlyLimit: S.optional(S.Number) }) {}
export class SetVoiceMessageSpendLimitOverrideResult extends S.Class<SetVoiceMessageSpendLimitOverrideResult>(
  "SetVoiceMessageSpendLimitOverrideResult",
)({ MonthlyLimit: S.optional(S.Number) }) {}
export class SubmitRegistrationVersionResult extends S.Class<SubmitRegistrationVersionResult>(
  "SubmitRegistrationVersionResult",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  VersionNumber: S.Number,
  RegistrationVersionStatus: S.String,
  RegistrationVersionStatusHistory: RegistrationVersionStatusHistory,
  AwsReview: S.Boolean,
}) {}
export class UpdateEventDestinationResult extends S.Class<UpdateEventDestinationResult>(
  "UpdateEventDestinationResult",
)({
  ConfigurationSetArn: S.optional(S.String),
  ConfigurationSetName: S.optional(S.String),
  EventDestination: S.optional(EventDestination),
}) {}
export class UpdatePhoneNumberResult extends S.Class<UpdatePhoneNumberResult>(
  "UpdatePhoneNumberResult",
)({
  PhoneNumberArn: S.optional(S.String),
  PhoneNumberId: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
  Status: S.optional(S.String),
  IsoCountryCode: S.optional(S.String),
  MessageType: S.optional(S.String),
  NumberCapabilities: S.optional(NumberCapabilityList),
  NumberType: S.optional(S.String),
  MonthlyLeasingPrice: S.optional(S.String),
  TwoWayEnabled: S.optional(S.Boolean),
  TwoWayChannelArn: S.optional(S.String),
  TwoWayChannelRole: S.optional(S.String),
  SelfManagedOptOutsEnabled: S.optional(S.Boolean),
  OptOutListName: S.optional(S.String),
  InternationalSendingEnabled: S.optional(S.Boolean),
  DeletionProtectionEnabled: S.optional(S.Boolean),
  RegistrationId: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class UpdatePoolResult extends S.Class<UpdatePoolResult>(
  "UpdatePoolResult",
)({
  PoolArn: S.optional(S.String),
  PoolId: S.optional(S.String),
  Status: S.optional(S.String),
  MessageType: S.optional(S.String),
  TwoWayEnabled: S.optional(S.Boolean),
  TwoWayChannelArn: S.optional(S.String),
  TwoWayChannelRole: S.optional(S.String),
  SelfManagedOptOutsEnabled: S.optional(S.Boolean),
  OptOutListName: S.optional(S.String),
  SharedRoutesEnabled: S.optional(S.Boolean),
  DeletionProtectionEnabled: S.optional(S.Boolean),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class UpdateProtectConfigurationResult extends S.Class<UpdateProtectConfigurationResult>(
  "UpdateProtectConfigurationResult",
)({
  ProtectConfigurationArn: S.String,
  ProtectConfigurationId: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  AccountDefault: S.Boolean,
  DeletionProtectionEnabled: S.Boolean,
}) {}
export class UpdateSenderIdResult extends S.Class<UpdateSenderIdResult>(
  "UpdateSenderIdResult",
)({
  SenderIdArn: S.String,
  SenderId: S.String,
  IsoCountryCode: S.String,
  MessageTypes: MessageTypeList,
  MonthlyLeasingPrice: S.String,
  DeletionProtectionEnabled: S.Boolean,
  Registered: S.Boolean,
  RegistrationId: S.optional(S.String),
}) {}
export class VerifyDestinationNumberResult extends S.Class<VerifyDestinationNumberResult>(
  "VerifyDestinationNumberResult",
)({
  VerifiedDestinationNumberArn: S.String,
  VerifiedDestinationNumberId: S.String,
  DestinationPhoneNumber: S.String,
  Status: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const EventDestinationList = S.Array(EventDestination);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ Name: S.String, Message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class AccountAttribute extends S.Class<AccountAttribute>(
  "AccountAttribute",
)({ Name: S.String, Value: S.String }) {}
export const AccountAttributeList = S.Array(AccountAttribute);
export class AccountLimit extends S.Class<AccountLimit>("AccountLimit")({
  Name: S.String,
  Used: S.Number,
  Max: S.Number,
}) {}
export const AccountLimitList = S.Array(AccountLimit);
export class OptOutListInformation extends S.Class<OptOutListInformation>(
  "OptOutListInformation",
)({
  OptOutListArn: S.String,
  OptOutListName: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const OptOutListInformationList = S.Array(OptOutListInformation);
export class RegistrationFieldValueInformation extends S.Class<RegistrationFieldValueInformation>(
  "RegistrationFieldValueInformation",
)({
  FieldPath: S.String,
  SelectChoices: S.optional(SelectChoiceList),
  TextValue: S.optional(S.String),
  RegistrationAttachmentId: S.optional(S.String),
  DeniedReason: S.optional(S.String),
  Feedback: S.optional(S.String),
}) {}
export const RegistrationFieldValueInformationList = S.Array(
  RegistrationFieldValueInformation,
);
export class SpendLimit extends S.Class<SpendLimit>("SpendLimit")({
  Name: S.String,
  EnforcedLimit: S.Number,
  MaxLimit: S.Number,
  Overridden: S.Boolean,
}) {}
export const SpendLimitList = S.Array(SpendLimit);
export const StringList = S.Array(S.String);
export class CreateConfigurationSetResult extends S.Class<CreateConfigurationSetResult>(
  "CreateConfigurationSetResult",
)({
  ConfigurationSetArn: S.optional(S.String),
  ConfigurationSetName: S.optional(S.String),
  Tags: S.optional(TagList),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateEventDestinationResult extends S.Class<CreateEventDestinationResult>(
  "CreateEventDestinationResult",
)({
  ConfigurationSetArn: S.optional(S.String),
  ConfigurationSetName: S.optional(S.String),
  EventDestination: S.optional(EventDestination),
}) {}
export class CreateRegistrationResult extends S.Class<CreateRegistrationResult>(
  "CreateRegistrationResult",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  RegistrationType: S.String,
  RegistrationStatus: S.String,
  CurrentVersionNumber: S.Number,
  AdditionalAttributes: S.optional(StringMap),
  Tags: S.optional(TagList),
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class CreateRegistrationVersionResult extends S.Class<CreateRegistrationVersionResult>(
  "CreateRegistrationVersionResult",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  VersionNumber: S.Number,
  RegistrationVersionStatus: S.String,
  RegistrationVersionStatusHistory: RegistrationVersionStatusHistory,
}) {}
export class DeleteConfigurationSetResult extends S.Class<DeleteConfigurationSetResult>(
  "DeleteConfigurationSetResult",
)({
  ConfigurationSetArn: S.optional(S.String),
  ConfigurationSetName: S.optional(S.String),
  EventDestinations: S.optional(EventDestinationList),
  DefaultMessageType: S.optional(S.String),
  DefaultSenderId: S.optional(S.String),
  DefaultMessageFeedbackEnabled: S.optional(S.Boolean),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeAccountAttributesResult extends S.Class<DescribeAccountAttributesResult>(
  "DescribeAccountAttributesResult",
)({
  AccountAttributes: S.optional(AccountAttributeList),
  NextToken: S.optional(S.String),
}) {}
export class DescribeAccountLimitsResult extends S.Class<DescribeAccountLimitsResult>(
  "DescribeAccountLimitsResult",
)({
  AccountLimits: S.optional(AccountLimitList),
  NextToken: S.optional(S.String),
}) {}
export class DescribeOptOutListsResult extends S.Class<DescribeOptOutListsResult>(
  "DescribeOptOutListsResult",
)({
  OptOutLists: S.optional(OptOutListInformationList),
  NextToken: S.optional(S.String),
}) {}
export class DescribeRegistrationFieldValuesResult extends S.Class<DescribeRegistrationFieldValuesResult>(
  "DescribeRegistrationFieldValuesResult",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  VersionNumber: S.Number,
  RegistrationFieldValues: RegistrationFieldValueInformationList,
  NextToken: S.optional(S.String),
}) {}
export class DescribeSpendLimitsResult extends S.Class<DescribeSpendLimitsResult>(
  "DescribeSpendLimitsResult",
)({
  SpendLimits: S.optional(SpendLimitList),
  NextToken: S.optional(S.String),
}) {}
export class SendDestinationNumberVerificationCodeResult extends S.Class<SendDestinationNumberVerificationCodeResult>(
  "SendDestinationNumberVerificationCodeResult",
)({ MessageId: S.String }) {}
export class UpdateProtectConfigurationCountryRuleSetRequest extends S.Class<UpdateProtectConfigurationCountryRuleSetRequest>(
  "UpdateProtectConfigurationCountryRuleSetRequest",
)(
  {
    ProtectConfigurationId: S.String,
    NumberCapability: S.String,
    CountryRuleSetUpdates: ProtectConfigurationCountryRuleSet,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SelectValidation extends S.Class<SelectValidation>(
  "SelectValidation",
)({ MinChoices: S.Number, MaxChoices: S.Number, Options: StringList }) {}
export class TextValidation extends S.Class<TextValidation>("TextValidation")({
  MinLength: S.Number,
  MaxLength: S.Number,
  Pattern: S.String,
}) {}
export class RegistrationSectionDisplayHints extends S.Class<RegistrationSectionDisplayHints>(
  "RegistrationSectionDisplayHints",
)({
  Title: S.String,
  ShortDescription: S.String,
  LongDescription: S.optional(S.String),
  DocumentationTitle: S.optional(S.String),
  DocumentationLink: S.optional(S.String),
}) {}
export class ConfigurationSetInformation extends S.Class<ConfigurationSetInformation>(
  "ConfigurationSetInformation",
)({
  ConfigurationSetArn: S.String,
  ConfigurationSetName: S.String,
  EventDestinations: EventDestinationList,
  DefaultMessageType: S.optional(S.String),
  DefaultSenderId: S.optional(S.String),
  DefaultMessageFeedbackEnabled: S.optional(S.Boolean),
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ProtectConfigurationId: S.optional(S.String),
}) {}
export const ConfigurationSetInformationList = S.Array(
  ConfigurationSetInformation,
);
export class KeywordInformation extends S.Class<KeywordInformation>(
  "KeywordInformation",
)({ Keyword: S.String, KeywordMessage: S.String, KeywordAction: S.String }) {}
export const KeywordInformationList = S.Array(KeywordInformation);
export class OptedOutNumberInformation extends S.Class<OptedOutNumberInformation>(
  "OptedOutNumberInformation",
)({
  OptedOutNumber: S.String,
  OptedOutTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndUserOptedOut: S.Boolean,
}) {}
export const OptedOutNumberInformationList = S.Array(OptedOutNumberInformation);
export class PhoneNumberInformation extends S.Class<PhoneNumberInformation>(
  "PhoneNumberInformation",
)({
  PhoneNumberArn: S.String,
  PhoneNumberId: S.optional(S.String),
  PhoneNumber: S.String,
  Status: S.String,
  IsoCountryCode: S.String,
  MessageType: S.String,
  NumberCapabilities: NumberCapabilityList,
  NumberType: S.String,
  MonthlyLeasingPrice: S.String,
  TwoWayEnabled: S.Boolean,
  TwoWayChannelArn: S.optional(S.String),
  TwoWayChannelRole: S.optional(S.String),
  SelfManagedOptOutsEnabled: S.Boolean,
  OptOutListName: S.String,
  InternationalSendingEnabled: S.optional(S.Boolean),
  DeletionProtectionEnabled: S.Boolean,
  PoolId: S.optional(S.String),
  RegistrationId: S.optional(S.String),
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const PhoneNumberInformationList = S.Array(PhoneNumberInformation);
export class PoolInformation extends S.Class<PoolInformation>(
  "PoolInformation",
)({
  PoolArn: S.String,
  PoolId: S.String,
  Status: S.String,
  MessageType: S.String,
  TwoWayEnabled: S.Boolean,
  TwoWayChannelArn: S.optional(S.String),
  TwoWayChannelRole: S.optional(S.String),
  SelfManagedOptOutsEnabled: S.Boolean,
  OptOutListName: S.String,
  SharedRoutesEnabled: S.Boolean,
  DeletionProtectionEnabled: S.Boolean,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const PoolInformationList = S.Array(PoolInformation);
export class ProtectConfigurationInformation extends S.Class<ProtectConfigurationInformation>(
  "ProtectConfigurationInformation",
)({
  ProtectConfigurationArn: S.String,
  ProtectConfigurationId: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  AccountDefault: S.Boolean,
  DeletionProtectionEnabled: S.Boolean,
}) {}
export const ProtectConfigurationInformationList = S.Array(
  ProtectConfigurationInformation,
);
export class RegistrationAttachmentsInformation extends S.Class<RegistrationAttachmentsInformation>(
  "RegistrationAttachmentsInformation",
)({
  RegistrationAttachmentArn: S.String,
  RegistrationAttachmentId: S.String,
  AttachmentStatus: S.String,
  AttachmentUploadErrorReason: S.optional(S.String),
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const RegistrationAttachmentsInformationList = S.Array(
  RegistrationAttachmentsInformation,
);
export class RegistrationInformation extends S.Class<RegistrationInformation>(
  "RegistrationInformation",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  RegistrationType: S.String,
  RegistrationStatus: S.String,
  CurrentVersionNumber: S.Number,
  ApprovedVersionNumber: S.optional(S.Number),
  LatestDeniedVersionNumber: S.optional(S.Number),
  AdditionalAttributes: S.optional(StringMap),
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const RegistrationInformationList = S.Array(RegistrationInformation);
export class RegistrationSectionDefinition extends S.Class<RegistrationSectionDefinition>(
  "RegistrationSectionDefinition",
)({ SectionPath: S.String, DisplayHints: RegistrationSectionDisplayHints }) {}
export const RegistrationSectionDefinitionList = S.Array(
  RegistrationSectionDefinition,
);
export class SenderIdInformation extends S.Class<SenderIdInformation>(
  "SenderIdInformation",
)({
  SenderIdArn: S.String,
  SenderId: S.String,
  IsoCountryCode: S.String,
  MessageTypes: MessageTypeList,
  MonthlyLeasingPrice: S.String,
  DeletionProtectionEnabled: S.Boolean,
  Registered: S.Boolean,
  RegistrationId: S.optional(S.String),
}) {}
export const SenderIdInformationList = S.Array(SenderIdInformation);
export class VerifiedDestinationNumberInformation extends S.Class<VerifiedDestinationNumberInformation>(
  "VerifiedDestinationNumberInformation",
)({
  VerifiedDestinationNumberArn: S.String,
  VerifiedDestinationNumberId: S.String,
  DestinationPhoneNumber: S.String,
  Status: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const VerifiedDestinationNumberInformationList = S.Array(
  VerifiedDestinationNumberInformation,
);
export class OriginationIdentityMetadata extends S.Class<OriginationIdentityMetadata>(
  "OriginationIdentityMetadata",
)({
  OriginationIdentityArn: S.String,
  OriginationIdentity: S.String,
  IsoCountryCode: S.String,
  NumberCapabilities: NumberCapabilityList,
  PhoneNumber: S.optional(S.String),
}) {}
export const OriginationIdentityMetadataList = S.Array(
  OriginationIdentityMetadata,
);
export class ProtectConfigurationRuleSetNumberOverride extends S.Class<ProtectConfigurationRuleSetNumberOverride>(
  "ProtectConfigurationRuleSetNumberOverride",
)({
  DestinationPhoneNumber: S.String,
  CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Action: S.String,
  IsoCountryCode: S.optional(S.String),
  ExpirationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ProtectConfigurationRuleSetNumberOverrideList = S.Array(
  ProtectConfigurationRuleSetNumberOverride,
);
export class RegistrationAssociationMetadata extends S.Class<RegistrationAssociationMetadata>(
  "RegistrationAssociationMetadata",
)({
  ResourceArn: S.String,
  ResourceId: S.String,
  ResourceType: S.String,
  IsoCountryCode: S.optional(S.String),
  PhoneNumber: S.optional(S.String),
}) {}
export const RegistrationAssociationMetadataList = S.Array(
  RegistrationAssociationMetadata,
);
export class SelectOptionDescription extends S.Class<SelectOptionDescription>(
  "SelectOptionDescription",
)({
  Option: S.String,
  Title: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const SelectOptionDescriptionsList = S.Array(SelectOptionDescription);
export class DescribeConfigurationSetsResult extends S.Class<DescribeConfigurationSetsResult>(
  "DescribeConfigurationSetsResult",
)({
  ConfigurationSets: S.optional(ConfigurationSetInformationList),
  NextToken: S.optional(S.String),
}) {}
export class DescribeKeywordsResult extends S.Class<DescribeKeywordsResult>(
  "DescribeKeywordsResult",
)({
  OriginationIdentityArn: S.optional(S.String),
  OriginationIdentity: S.optional(S.String),
  Keywords: S.optional(KeywordInformationList),
  NextToken: S.optional(S.String),
}) {}
export class DescribeOptedOutNumbersResult extends S.Class<DescribeOptedOutNumbersResult>(
  "DescribeOptedOutNumbersResult",
)({
  OptOutListArn: S.optional(S.String),
  OptOutListName: S.optional(S.String),
  OptedOutNumbers: S.optional(OptedOutNumberInformationList),
  NextToken: S.optional(S.String),
}) {}
export class DescribePhoneNumbersResult extends S.Class<DescribePhoneNumbersResult>(
  "DescribePhoneNumbersResult",
)({
  PhoneNumbers: S.optional(PhoneNumberInformationList),
  NextToken: S.optional(S.String),
}) {}
export class DescribePoolsResult extends S.Class<DescribePoolsResult>(
  "DescribePoolsResult",
)({
  Pools: S.optional(PoolInformationList),
  NextToken: S.optional(S.String),
}) {}
export class DescribeProtectConfigurationsResult extends S.Class<DescribeProtectConfigurationsResult>(
  "DescribeProtectConfigurationsResult",
)({
  ProtectConfigurations: S.optional(ProtectConfigurationInformationList),
  NextToken: S.optional(S.String),
}) {}
export class DescribeRegistrationAttachmentsResult extends S.Class<DescribeRegistrationAttachmentsResult>(
  "DescribeRegistrationAttachmentsResult",
)({
  RegistrationAttachments: RegistrationAttachmentsInformationList,
  NextToken: S.optional(S.String),
}) {}
export class DescribeRegistrationsResult extends S.Class<DescribeRegistrationsResult>(
  "DescribeRegistrationsResult",
)({
  Registrations: RegistrationInformationList,
  NextToken: S.optional(S.String),
}) {}
export class DescribeRegistrationSectionDefinitionsResult extends S.Class<DescribeRegistrationSectionDefinitionsResult>(
  "DescribeRegistrationSectionDefinitionsResult",
)({
  RegistrationType: S.String,
  RegistrationSectionDefinitions: RegistrationSectionDefinitionList,
  NextToken: S.optional(S.String),
}) {}
export class DescribeSenderIdsResult extends S.Class<DescribeSenderIdsResult>(
  "DescribeSenderIdsResult",
)({
  SenderIds: S.optional(SenderIdInformationList),
  NextToken: S.optional(S.String),
}) {}
export class DescribeVerifiedDestinationNumbersResult extends S.Class<DescribeVerifiedDestinationNumbersResult>(
  "DescribeVerifiedDestinationNumbersResult",
)({
  VerifiedDestinationNumbers: VerifiedDestinationNumberInformationList,
  NextToken: S.optional(S.String),
}) {}
export class ListPoolOriginationIdentitiesResult extends S.Class<ListPoolOriginationIdentitiesResult>(
  "ListPoolOriginationIdentitiesResult",
)({
  PoolArn: S.optional(S.String),
  PoolId: S.optional(S.String),
  OriginationIdentities: S.optional(OriginationIdentityMetadataList),
  NextToken: S.optional(S.String),
}) {}
export class ListProtectConfigurationRuleSetNumberOverridesResult extends S.Class<ListProtectConfigurationRuleSetNumberOverridesResult>(
  "ListProtectConfigurationRuleSetNumberOverridesResult",
)({
  ProtectConfigurationArn: S.String,
  ProtectConfigurationId: S.String,
  RuleSetNumberOverrides: S.optional(
    ProtectConfigurationRuleSetNumberOverrideList,
  ),
  NextToken: S.optional(S.String),
}) {}
export class ListRegistrationAssociationsResult extends S.Class<ListRegistrationAssociationsResult>(
  "ListRegistrationAssociationsResult",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  RegistrationType: S.String,
  RegistrationAssociations: RegistrationAssociationMetadataList,
  NextToken: S.optional(S.String),
}) {}
export class UpdateProtectConfigurationCountryRuleSetResult extends S.Class<UpdateProtectConfigurationCountryRuleSetResult>(
  "UpdateProtectConfigurationCountryRuleSetResult",
)({
  ProtectConfigurationArn: S.String,
  ProtectConfigurationId: S.String,
  NumberCapability: S.String,
  CountryRuleSet: ProtectConfigurationCountryRuleSet,
}) {}
export class RegistrationFieldDisplayHints extends S.Class<RegistrationFieldDisplayHints>(
  "RegistrationFieldDisplayHints",
)({
  Title: S.String,
  ShortDescription: S.String,
  LongDescription: S.optional(S.String),
  DocumentationTitle: S.optional(S.String),
  DocumentationLink: S.optional(S.String),
  SelectOptionDescriptions: S.optional(SelectOptionDescriptionsList),
  TextValidationDescription: S.optional(S.String),
  ExampleTextValue: S.optional(S.String),
}) {}
export class SupportedAssociation extends S.Class<SupportedAssociation>(
  "SupportedAssociation",
)({
  ResourceType: S.String,
  IsoCountryCode: S.optional(S.String),
  AssociationBehavior: S.String,
  DisassociationBehavior: S.String,
}) {}
export const SupportedAssociationList = S.Array(SupportedAssociation);
export class RegistrationTypeDisplayHints extends S.Class<RegistrationTypeDisplayHints>(
  "RegistrationTypeDisplayHints",
)({
  Title: S.String,
  ShortDescription: S.optional(S.String),
  LongDescription: S.optional(S.String),
  DocumentationTitle: S.optional(S.String),
  DocumentationLink: S.optional(S.String),
}) {}
export class RegistrationDeniedReasonInformation extends S.Class<RegistrationDeniedReasonInformation>(
  "RegistrationDeniedReasonInformation",
)({
  Reason: S.String,
  ShortDescription: S.String,
  LongDescription: S.optional(S.String),
  DocumentationTitle: S.optional(S.String),
  DocumentationLink: S.optional(S.String),
}) {}
export const RegistrationDeniedReasonInformationList = S.Array(
  RegistrationDeniedReasonInformation,
);
export class RegistrationFieldDefinition extends S.Class<RegistrationFieldDefinition>(
  "RegistrationFieldDefinition",
)({
  SectionPath: S.String,
  FieldPath: S.String,
  FieldType: S.String,
  FieldRequirement: S.String,
  SelectValidation: S.optional(SelectValidation),
  TextValidation: S.optional(TextValidation),
  DisplayHints: RegistrationFieldDisplayHints,
}) {}
export const RegistrationFieldDefinitionList = S.Array(
  RegistrationFieldDefinition,
);
export class RegistrationTypeDefinition extends S.Class<RegistrationTypeDefinition>(
  "RegistrationTypeDefinition",
)({
  RegistrationType: S.String,
  SupportedAssociations: S.optional(SupportedAssociationList),
  DisplayHints: RegistrationTypeDisplayHints,
}) {}
export const RegistrationTypeDefinitionList = S.Array(
  RegistrationTypeDefinition,
);
export class RegistrationVersionInformation extends S.Class<RegistrationVersionInformation>(
  "RegistrationVersionInformation",
)({
  VersionNumber: S.Number,
  RegistrationVersionStatus: S.String,
  RegistrationVersionStatusHistory: RegistrationVersionStatusHistory,
  DeniedReasons: S.optional(RegistrationDeniedReasonInformationList),
  Feedback: S.optional(S.String),
}) {}
export const RegistrationVersionInformationList = S.Array(
  RegistrationVersionInformation,
);
export class DescribeRegistrationFieldDefinitionsResult extends S.Class<DescribeRegistrationFieldDefinitionsResult>(
  "DescribeRegistrationFieldDefinitionsResult",
)({
  RegistrationType: S.String,
  RegistrationFieldDefinitions: RegistrationFieldDefinitionList,
  NextToken: S.optional(S.String),
}) {}
export class DescribeRegistrationTypeDefinitionsResult extends S.Class<DescribeRegistrationTypeDefinitionsResult>(
  "DescribeRegistrationTypeDefinitionsResult",
)({
  RegistrationTypeDefinitions: RegistrationTypeDefinitionList,
  NextToken: S.optional(S.String),
}) {}
export class DescribeRegistrationVersionsResult extends S.Class<DescribeRegistrationVersionsResult>(
  "DescribeRegistrationVersionsResult",
)({
  RegistrationArn: S.String,
  RegistrationId: S.String,
  RegistrationVersions: RegistrationVersionInformationList,
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}

//# Operations
/**
 * Removes the association of the specified tags from a resource. For more information on tags see Tags in the *End User Messaging SMS User Guide*.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associate a protect configuration with a configuration set. This replaces the configuration sets current protect configuration. A configuration set can only be associated with one protect configuration at a time. A protect configuration can be associated with multiple configuration sets.
 */
export const associateProtectConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateProtectConfigurationRequest,
    output: AssociateProtectConfigurationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates a new opt-out list.
 *
 * If the opt-out list name already exists, an error is returned.
 *
 * An opt-out list is a list of phone numbers that are opted out, meaning you can't send SMS or voice messages to them. If end user replies with the keyword "STOP," an entry for the phone number is added to the opt-out list. In addition to STOP, your recipients can use any supported opt-out keyword, such as CANCEL or OPTOUT. For a list of supported opt-out keywords, see SMS opt out in the End User Messaging SMS User Guide.
 */
export const createOptOutList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOptOutListRequest,
  output: CreateOptOutListResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new pool and associates the specified origination identity to the pool. A pool can include one or more phone numbers and SenderIds that are associated with your Amazon Web Services account.
 *
 * The new pool inherits its configuration from the specified origination identity. This includes keywords, message type, opt-out list, two-way configuration, and self-managed opt-out configuration. Deletion protection isn't inherited from the origination identity and defaults to false.
 *
 * If the origination identity is a phone number and is already associated with another pool, an error is returned. A sender ID can be associated with multiple pools.
 */
export const createPool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePoolRequest,
  output: CreatePoolResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a new protect configuration. By default all country rule sets for each capability are set to `ALLOW`. Update the country rule sets using `UpdateProtectConfigurationCountryRuleSet`. A protect configurations name is stored as a Tag with the key set to `Name` and value as the name of the protect configuration.
 */
export const createProtectConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProtectConfigurationRequest,
    output: CreateProtectConfigurationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Associate the registration with an origination identity such as a phone number or sender ID.
 */
export const createRegistrationAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateRegistrationAssociationRequest,
    output: CreateRegistrationAssociationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Create a new registration attachment to use for uploading a file or a URL to a file. The maximum file size is 500KB and valid file extensions are PDF, JPEG and PNG. For example, many sender ID registrations require a signed “letter of authorization” (LOA) to be submitted.
 *
 * Use either `AttachmentUrl` or `AttachmentBody` to upload your attachment. If both are specified then an exception is returned.
 */
export const createRegistrationAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateRegistrationAttachmentRequest,
    output: CreateRegistrationAttachmentResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * You can only send messages to verified destination numbers when your account is in the sandbox. You can add up to 10 verified destination numbers.
 */
export const createVerifiedDestinationNumber =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateVerifiedDestinationNumberRequest,
    output: CreateVerifiedDestinationNumberResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Removes the current account default protect configuration.
 */
export const deleteAccountDefaultProtectConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAccountDefaultProtectConfigurationRequest,
    output: DeleteAccountDefaultProtectConfigurationResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes an existing default message type on a configuration set.
 *
 * A message type is a type of messages that you plan to send. If you send account-related messages or time-sensitive messages such as one-time passcodes, choose **Transactional**. If you plan to send messages that contain marketing material or other promotional content, choose **Promotional**. This setting applies to your entire Amazon Web Services account.
 */
export const deleteDefaultMessageType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDefaultMessageTypeRequest,
    output: DeleteDefaultMessageTypeResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an existing default sender ID on a configuration set.
 *
 * A default sender ID is the identity that appears on recipients' devices when they receive SMS messages. Support for sender ID capabilities varies by country or region.
 */
export const deleteDefaultSenderId = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDefaultSenderIdRequest,
    output: DeleteDefaultSenderIdResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an existing event destination.
 *
 * An event destination is a location where you send response information about the messages that you send. For example, when a message is delivered successfully, you can send information about that event to an Amazon CloudWatch destination, or send notifications to endpoints that are subscribed to an Amazon SNS topic.
 */
export const deleteEventDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEventDestinationRequest,
    output: DeleteEventDestinationResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an existing keyword from an origination phone number or pool.
 *
 * A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, End User Messaging SMS responds with a customizable message.
 *
 * Keywords "HELP" and "STOP" can't be deleted or modified.
 */
export const deleteKeyword = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKeywordRequest,
  output: DeleteKeywordResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an account-level monthly spending limit override for sending multimedia messages (MMS). Deleting a spend limit override will set the `EnforcedLimit` to equal the `MaxLimit`, which is controlled by Amazon Web Services. For more information on spend limits (quotas) see Quotas for Server Migration Service in the *Server Migration Service User Guide*.
 */
export const deleteMediaMessageSpendLimitOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteMediaMessageSpendLimitOverrideRequest,
    output: DeleteMediaMessageSpendLimitOverrideResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes an existing opted out destination phone number from the specified opt-out list.
 *
 * Each destination phone number can only be deleted once every 30 days.
 *
 * If the specified destination phone number doesn't exist or if the opt-out list doesn't exist, an error is returned.
 */
export const deleteOptedOutNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteOptedOutNumberRequest,
    output: DeleteOptedOutNumberResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an existing opt-out list. All opted out phone numbers in the opt-out list are deleted.
 *
 * If the specified opt-out list name doesn't exist or is in-use by an origination phone number or pool, an error is returned.
 */
export const deleteOptOutList = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOptOutListRequest,
  output: DeleteOptOutListResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing pool. Deleting a pool disassociates all origination identities from that pool.
 *
 * If the pool status isn't active or if deletion protection is enabled, an error is returned.
 *
 * A pool is a collection of phone numbers and SenderIds. A pool can include one or more phone numbers and SenderIds that are associated with your Amazon Web Services account.
 */
export const deletePool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePoolRequest,
  output: DeletePoolResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Permanently delete the protect configuration. The protect configuration must have deletion protection disabled and must not be associated as the account default protect configuration or associated with a configuration set.
 */
export const deleteProtectConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProtectConfigurationRequest,
    output: DeleteProtectConfigurationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Permanently delete the protect configuration rule set number override.
 */
export const deleteProtectConfigurationRuleSetNumberOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteProtectConfigurationRuleSetNumberOverrideRequest,
    output: DeleteProtectConfigurationRuleSetNumberOverrideResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Permanently delete an existing registration from your account.
 */
export const deleteRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRegistrationRequest,
  output: DeleteRegistrationResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Permanently delete the specified registration attachment.
 */
export const deleteRegistrationAttachment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRegistrationAttachmentRequest,
    output: DeleteRegistrationAttachmentResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Delete the value in a registration form field.
 */
export const deleteRegistrationFieldValue =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRegistrationFieldValueRequest,
    output: DeleteRegistrationFieldValueResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Deletes the resource-based policy document attached to the End User Messaging SMS resource. A shared resource can be a Pool, Opt-out list, Sender Id, or Phone number.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an account-level monthly spending limit override for sending text messages. Deleting a spend limit override will set the `EnforcedLimit` to equal the `MaxLimit`, which is controlled by Amazon Web Services. For more information on spend limits (quotas) see Quotas in the *End User Messaging SMS User Guide*.
 */
export const deleteTextMessageSpendLimitOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteTextMessageSpendLimitOverrideRequest,
    output: DeleteTextMessageSpendLimitOverrideResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Delete a verified destination phone number.
 */
export const deleteVerifiedDestinationNumber =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteVerifiedDestinationNumberRequest,
    output: DeleteVerifiedDestinationNumberResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Removes the specified origination identity from an existing pool.
 *
 * If the origination identity isn't associated with the specified pool, an error is returned.
 */
export const disassociateOriginationIdentity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateOriginationIdentityRequest,
    output: DisassociateOriginationIdentityResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Disassociate a protect configuration from a configuration set.
 */
export const disassociateProtectConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateProtectConfigurationRequest,
    output: DisassociateProtectConfigurationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Discard the current version of the registration.
 */
export const discardRegistrationVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DiscardRegistrationVersionRequest,
    output: DiscardRegistrationVersionResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieve the CountryRuleSet for the specified NumberCapability from a protect configuration.
 */
export const getProtectConfigurationCountryRuleSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetProtectConfigurationCountryRuleSetRequest,
    output: GetProtectConfigurationCountryRuleSetResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the JSON text of the resource-based policy document attached to the End User Messaging SMS resource. A shared resource can be a Pool, Opt-out list, Sender Id, or Phone number.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List all tags associated with a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a keyword configuration on an origination phone number or pool.
 *
 * A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, End User Messaging SMS responds with a customizable message.
 *
 * If you specify a keyword that isn't valid, an error is returned.
 */
export const putKeyword = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutKeywordRequest,
  output: PutKeywordResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Set the MessageFeedbackStatus as `RECEIVED` or `FAILED` for the passed in MessageId.
 *
 * If you use message feedback then you must update message feedback record. When you receive a signal that a user has received the message you must use `PutMessageFeedback` to set the message feedback record as `RECEIVED`; Otherwise, an hour after the message feedback record is set to `FAILED`.
 */
export const putMessageFeedback = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMessageFeedbackRequest,
  output: PutMessageFeedbackResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an opted out destination phone number in the opt-out list.
 *
 * If the destination phone number isn't valid or if the specified opt-out list doesn't exist, an error is returned.
 */
export const putOptedOutNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutOptedOutNumberRequest,
  output: PutOptedOutNumberResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create or update a phone number rule override and associate it with a protect configuration.
 */
export const putProtectConfigurationRuleSetNumberOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutProtectConfigurationRuleSetNumberOverrideRequest,
    output: PutProtectConfigurationRuleSetNumberOverrideResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Creates or updates a field value for a registration.
 */
export const putRegistrationFieldValue = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRegistrationFieldValueRequest,
    output: PutRegistrationFieldValueResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Attaches a resource-based policy to a End User Messaging SMS resource(phone number, sender Id, phone poll, or opt-out list) that is used for sharing the resource. A shared resource can be a Pool, Opt-out list, Sender Id, or Phone number. For more information about resource-based policies, see Working with shared resources in the *End User Messaging SMS User Guide*.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Releases an existing origination phone number in your account. Once released, a phone number is no longer available for sending messages.
 *
 * If the origination phone number has deletion protection enabled or is associated with a pool, an error is returned.
 */
export const releasePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReleasePhoneNumberRequest,
  output: ReleasePhoneNumberResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Releases an existing sender ID in your account.
 */
export const releaseSenderId = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReleaseSenderIdRequest,
  output: ReleaseSenderIdResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Request an origination phone number for use in your account. For more information on phone number request see Request a phone number in the *End User Messaging SMS User Guide*.
 */
export const requestPhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RequestPhoneNumberRequest,
  output: RequestPhoneNumberResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Request a new sender ID that doesn't require registration.
 */
export const requestSenderId = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RequestSenderIdRequest,
  output: RequestSenderIdResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new multimedia message (MMS) and sends it to a recipient's phone number.
 */
export const sendMediaMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendMediaMessageRequest,
  output: SendMediaMessageResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new text message and sends it to a recipient's phone number. SendTextMessage only sends an SMS message to one recipient each time it is invoked.
 *
 * SMS throughput limits are measured in Message Parts per Second (MPS). Your MPS limit depends on the destination country of your messages, as well as the type of phone number (origination number) that you use to send the message. For more information about MPS, see Message Parts per Second (MPS) limits in the *End User Messaging SMS User Guide*.
 */
export const sendTextMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendTextMessageRequest,
  output: SendTextMessageResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Allows you to send a request that sends a voice message. This operation uses Amazon Polly to convert a text script into a voice message.
 */
export const sendVoiceMessage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendVoiceMessageRequest,
  output: SendVoiceMessageResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Set a protect configuration as your account default. You can only have one account default protect configuration at a time. The current account default protect configuration is replaced with the provided protect configuration.
 */
export const setAccountDefaultProtectConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetAccountDefaultProtectConfigurationRequest,
    output: SetAccountDefaultProtectConfigurationResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Sets a configuration set's default for message feedback.
 */
export const setDefaultMessageFeedbackEnabled =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetDefaultMessageFeedbackEnabledRequest,
    output: SetDefaultMessageFeedbackEnabledResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Sets the default message type on a configuration set.
 *
 * Choose the category of SMS messages that you plan to send from this account. If you send account-related messages or time-sensitive messages such as one-time passcodes, choose **Transactional**. If you plan to send messages that contain marketing material or other promotional content, choose **Promotional**. This setting applies to your entire Amazon Web Services account.
 */
export const setDefaultMessageType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetDefaultMessageTypeRequest,
    output: SetDefaultMessageTypeResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Sets default sender ID on a configuration set.
 *
 * When sending a text message to a destination country that supports sender IDs, the default sender ID on the configuration set specified will be used if no dedicated origination phone numbers or registered sender IDs are available in your account.
 */
export const setDefaultSenderId = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetDefaultSenderIdRequest,
  output: SetDefaultSenderIdResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sets an account level monthly spend limit override for sending MMS messages. The requested spend limit must be less than or equal to the `MaxLimit`, which is set by Amazon Web Services.
 */
export const setMediaMessageSpendLimitOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetMediaMessageSpendLimitOverrideRequest,
    output: SetMediaMessageSpendLimitOverrideResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Sets an account level monthly spend limit override for sending text messages. The requested spend limit must be less than or equal to the `MaxLimit`, which is set by Amazon Web Services.
 */
export const setTextMessageSpendLimitOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetTextMessageSpendLimitOverrideRequest,
    output: SetTextMessageSpendLimitOverrideResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Sets an account level monthly spend limit override for sending voice messages. The requested spend limit must be less than or equal to the `MaxLimit`, which is set by Amazon Web Services.
 */
export const setVoiceMessageSpendLimitOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetVoiceMessageSpendLimitOverrideRequest,
    output: SetVoiceMessageSpendLimitOverrideResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Submit the specified registration for review and approval.
 */
export const submitRegistrationVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SubmitRegistrationVersionRequest,
    output: SubmitRegistrationVersionResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Adds or overwrites only the specified tags for the specified resource. When you specify an existing tag key, the value is overwritten with the new value. Each tag consists of a key and an optional value. Tag keys must be unique per resource. For more information about tags, see Tags in the *End User Messaging SMS User Guide*.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing event destination in a configuration set. You can update the IAM role ARN for CloudWatch Logs and Firehose. You can also enable or disable the event destination.
 *
 * You may want to update an event destination to change its matching event types or updating the destination resource ARN. You can't change an event destination's type between CloudWatch Logs, Firehose, and Amazon SNS.
 */
export const updateEventDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEventDestinationRequest,
    output: UpdateEventDestinationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the configuration of an existing origination phone number. You can update the opt-out list, enable or disable two-way messaging, change the TwoWayChannelArn, enable or disable self-managed opt-outs, and enable or disable deletion protection.
 *
 * If the origination phone number is associated with a pool, an error is returned.
 */
export const updatePhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePhoneNumberRequest,
  output: UpdatePhoneNumberResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an existing pool. You can update the opt-out list, enable or disable two-way messaging, change the `TwoWayChannelArn`, enable or disable self-managed opt-outs, enable or disable deletion protection, and enable or disable shared routes.
 */
export const updatePool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePoolRequest,
  output: UpdatePoolResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update the setting for an existing protect configuration.
 */
export const updateProtectConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProtectConfigurationRequest,
    output: UpdateProtectConfigurationResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the configuration of an existing sender ID.
 */
export const updateSenderId = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSenderIdRequest,
  output: UpdateSenderIdResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use the verification code that was received by the verified destination phone number to opt-in the verified destination phone number to receive more messages.
 */
export const verifyDestinationNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: VerifyDestinationNumberRequest,
    output: VerifyDestinationNumberResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Associates the specified origination identity with a pool.
 *
 * If the origination identity is a phone number and is already associated with another pool, an error is returned. A sender ID can be associated with multiple pools.
 *
 * If the origination identity configuration doesn't match the pool's configuration, an error is returned.
 */
export const associateOriginationIdentity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateOriginationIdentityRequest,
    output: AssociateOriginationIdentityResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Returns information about a destination phone number, including whether the number type and whether it is valid, the carrier, and more.
 */
export const carrierLookup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CarrierLookupRequest,
  output: CarrierLookupResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new configuration set. After you create the configuration set, you can add one or more event destinations to it.
 *
 * A configuration set is a set of rules that you apply to the SMS and voice messages that you send.
 *
 * When you send a message, you can optionally specify a single configuration set.
 */
export const createConfigurationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConfigurationSetRequest,
    output: CreateConfigurationSetResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new event destination in a configuration set.
 *
 * An event destination is a location where you send message events. The event options are Amazon CloudWatch, Amazon Data Firehose, or Amazon SNS. For example, when a message is delivered successfully, you can send information about that event to an event destination, or send notifications to endpoints that are subscribed to an Amazon SNS topic.
 *
 * You can only create one event destination at a time. You must provide a value for a single event destination using either `CloudWatchLogsDestination`, `KinesisFirehoseDestination` or `SnsDestination`. If an event destination isn't provided then an exception is returned.
 *
 * Each configuration set can contain between 0 and 5 event destinations. Each event destination can contain a reference to a single destination, such as a CloudWatch or Firehose destination.
 */
export const createEventDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEventDestinationRequest,
    output: CreateEventDestinationResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new registration based on the **RegistrationType** field.
 */
export const createRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRegistrationRequest,
  output: CreateRegistrationResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a new version of the registration and increase the **VersionNumber**. The previous version of the registration becomes read-only.
 */
export const createRegistrationVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRegistrationVersionRequest,
    output: CreateRegistrationVersionResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an existing configuration set.
 *
 * A configuration set is a set of rules that you apply to voice and SMS messages that you send. In a configuration set, you can specify a destination for specific types of events related to voice and SMS messages.
 */
export const deleteConfigurationSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConfigurationSetRequest,
    output: DeleteConfigurationSetResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an account level monthly spend limit override for sending voice messages. Deleting a spend limit override sets the `EnforcedLimit` equal to the `MaxLimit`, which is controlled by Amazon Web Services. For more information on spending limits (quotas) see Quotas in the *End User Messaging SMS User Guide*.
 */
export const deleteVoiceMessageSpendLimitOverride =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteVoiceMessageSpendLimitOverrideRequest,
    output: DeleteVoiceMessageSpendLimitOverrideResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Describes attributes of your Amazon Web Services account. The supported account attributes include account tier, which indicates whether your account is in the sandbox or production environment. When you're ready to move your account out of the sandbox, create an Amazon Web Services Support case for a service limit increase request.
 *
 * New accounts are placed into an SMS or voice sandbox. The sandbox protects both Amazon Web Services end recipients and SMS or voice recipients from fraud and abuse.
 */
export const describeAccountAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountAttributesRequest,
    output: DescribeAccountAttributesResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Describes the current End User Messaging SMS SMS Voice V2 resource quotas for your account. The description for a quota includes the quota name, current usage toward that quota, and the quota's maximum value.
 *
 * When you establish an Amazon Web Services account, the account has initial quotas on the maximum number of configuration sets, opt-out lists, phone numbers, and pools that you can create in a given Region. For more information see Quotas in the *End User Messaging SMS User Guide*.
 */
export const describeAccountLimits = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountLimitsRequest,
    output: DescribeAccountLimitsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Describes the specified opt-out list or all opt-out lists in your account.
 *
 * If you specify opt-out list names, the output includes information for only the specified opt-out lists. Opt-out lists include only those that meet the filter criteria. If you don't specify opt-out list names or filters, the output includes information for all opt-out lists.
 *
 * If you specify an opt-out list name that isn't valid, an error is returned.
 */
export const describeOptOutLists = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOptOutListsRequest,
  output: DescribeOptOutListsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the specified registration field values.
 */
export const describeRegistrationFieldValues =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRegistrationFieldValuesRequest,
    output: DescribeRegistrationFieldValuesResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Describes the current monthly spend limits for sending voice and text messages.
 *
 * When you establish an Amazon Web Services account, the account has initial monthly spend limit in a given Region. For more information on increasing your monthly spend limit, see Requesting increases to your monthly SMS, MMS, or Voice spending quota in the *End User Messaging SMS User Guide*.
 */
export const describeSpendLimits = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSpendLimitsRequest,
  output: DescribeSpendLimitsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Before you can send test messages to a verified destination phone number you need to opt-in the verified destination phone number. Creates a new text message with a verification code and send it to a verified destination phone number. Once you have the verification code use VerifyDestinationNumber to opt-in the verified destination phone number to receive messages.
 */
export const sendDestinationNumberVerificationCode =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SendDestinationNumberVerificationCodeRequest,
    output: SendDestinationNumberVerificationCodeResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Describes the specified configuration sets or all in your account.
 *
 * If you specify configuration set names, the output includes information for only the specified configuration sets. If you specify filters, the output includes information for only those configuration sets that meet the filter criteria. If you don't specify configuration set names or filters, the output includes information for all configuration sets.
 *
 * If you specify a configuration set name that isn't valid, an error is returned.
 */
export const describeConfigurationSets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConfigurationSetsRequest,
    output: DescribeConfigurationSetsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Describes the specified keywords or all keywords on your origination phone number or pool.
 *
 * A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, End User Messaging SMS responds with a customizable message.
 *
 * If you specify a keyword that isn't valid, an error is returned.
 */
export const describeKeywords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeKeywordsRequest,
  output: DescribeKeywordsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the specified opted out destination numbers or all opted out destination numbers in an opt-out list.
 *
 * If you specify opted out numbers, the output includes information for only the specified opted out numbers. If you specify filters, the output includes information for only those opted out numbers that meet the filter criteria. If you don't specify opted out numbers or filters, the output includes information for all opted out destination numbers in your opt-out list.
 *
 * If you specify an opted out number that isn't valid, an exception is returned.
 */
export const describeOptedOutNumbers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeOptedOutNumbersRequest,
    output: DescribeOptedOutNumbersResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Describes the specified origination phone number, or all the phone numbers in your account.
 *
 * If you specify phone number IDs, the output includes information for only the specified phone numbers. If you specify filters, the output includes information for only those phone numbers that meet the filter criteria. If you don't specify phone number IDs or filters, the output includes information for all phone numbers.
 *
 * If you specify a phone number ID that isn't valid, an error is returned.
 */
export const describePhoneNumbers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePhoneNumbersRequest,
    output: DescribePhoneNumbersResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the specified pools or all pools associated with your Amazon Web Services account.
 *
 * If you specify pool IDs, the output includes information for only the specified pools. If you specify filters, the output includes information for only those pools that meet the filter criteria. If you don't specify pool IDs or filters, the output includes information for all pools.
 *
 * If you specify a pool ID that isn't valid, an error is returned.
 *
 * A pool is a collection of phone numbers and SenderIds. A pool can include one or more phone numbers and SenderIds that are associated with your Amazon Web Services account.
 */
export const describePools = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePoolsRequest,
  output: DescribePoolsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the protect configurations that match any of filters. If a filter isn’t provided then all protect configurations are returned.
 */
export const describeProtectConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeProtectConfigurationsRequest,
    output: DescribeProtectConfigurationsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the specified registration attachments or all registration attachments associated with your Amazon Web Services account.
 */
export const describeRegistrationAttachments =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRegistrationAttachmentsRequest,
    output: DescribeRegistrationAttachmentsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the specified registrations.
 */
export const describeRegistrations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRegistrationsRequest,
    output: DescribeRegistrationsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the specified registration section definitions. You can use DescribeRegistrationSectionDefinitions to view the requirements for creating, filling out, and submitting each registration type.
 */
export const describeRegistrationSectionDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRegistrationSectionDefinitionsRequest,
    output: DescribeRegistrationSectionDefinitionsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Describes the specified SenderIds or all SenderIds associated with your Amazon Web Services account.
 *
 * If you specify SenderIds, the output includes information for only the specified SenderIds. If you specify filters, the output includes information for only those SenderIds that meet the filter criteria. If you don't specify SenderIds or filters, the output includes information for all SenderIds.
 *
 * f you specify a sender ID that isn't valid, an error is returned.
 */
export const describeSenderIds = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSenderIdsRequest,
  output: DescribeSenderIdsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the specified verified destination numbers.
 */
export const describeVerifiedDestinationNumbers =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeVerifiedDestinationNumbersRequest,
    output: DescribeVerifiedDestinationNumbersResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists all associated origination identities in your pool.
 *
 * If you specify filters, the output includes information for only those origination identities that meet the filter criteria.
 */
export const listPoolOriginationIdentities =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListPoolOriginationIdentitiesRequest,
    output: ListPoolOriginationIdentitiesResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieve all of the protect configuration rule set number overrides that match the filters.
 */
export const listProtectConfigurationRuleSetNumberOverrides =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListProtectConfigurationRuleSetNumberOverridesRequest,
    output: ListProtectConfigurationRuleSetNumberOverridesResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieve all of the origination identities that are associated with a registration.
 */
export const listRegistrationAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListRegistrationAssociationsRequest,
    output: ListRegistrationAssociationsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Update a country rule set to `ALLOW`, `BLOCK`, `MONITOR`, or `FILTER` messages to be sent to the specified destination counties. You can update one or multiple countries at a time. The updates are only applied to the specified NumberCapability type.
 */
export const updateProtectConfigurationCountryRuleSet =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateProtectConfigurationCountryRuleSetRequest,
    output: UpdateProtectConfigurationCountryRuleSetResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the specified registration type field definitions. You can use DescribeRegistrationFieldDefinitions to view the requirements for creating, filling out, and submitting each registration type.
 */
export const describeRegistrationFieldDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRegistrationFieldDefinitionsRequest,
    output: DescribeRegistrationFieldDefinitionsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the specified registration type definitions. You can use DescribeRegistrationTypeDefinitions to view the requirements for creating, filling out, and submitting each registration type.
 */
export const describeRegistrationTypeDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRegistrationTypeDefinitionsRequest,
    output: DescribeRegistrationTypeDefinitionsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the specified registration version.
 */
export const describeRegistrationVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRegistrationVersionsRequest,
    output: DescribeRegistrationVersionsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://sns.amazonaws.com/doc/2010-03-31/");
const svc = T.AwsApiService({
  sdkId: "SNS",
  serviceShapeName: "AmazonSimpleNotificationService",
});
const auth = T.AwsAuthSigv4({ name: "sns" });
const ver = T.ServiceVersion("2010-03-31");
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
                        url: "https://sns-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          argv: [{ ref: "Region" }, "us-gov-east-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://sns.us-gov-east-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://sns.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://sns-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://sns.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://sns.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetSMSSandboxAccountStatusInput extends S.Class<GetSMSSandboxAccountStatusInput>(
  "GetSMSSandboxAccountStatusInput",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const DelegatesList = S.Array(S.String);
export const ActionsList = S.Array(S.String);
export const ListString = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AddPermissionInput extends S.Class<AddPermissionInput>(
  "AddPermissionInput",
)(
  {
    TopicArn: S.String,
    Label: S.String,
    AWSAccountId: DelegatesList,
    ActionName: ActionsList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddPermissionResponse extends S.Class<AddPermissionResponse>(
  "AddPermissionResponse",
)({}, ns) {}
export class CheckIfPhoneNumberIsOptedOutInput extends S.Class<CheckIfPhoneNumberIsOptedOutInput>(
  "CheckIfPhoneNumberIsOptedOutInput",
)(
  { phoneNumber: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ConfirmSubscriptionInput extends S.Class<ConfirmSubscriptionInput>(
  "ConfirmSubscriptionInput",
)(
  {
    TopicArn: S.String,
    Token: S.String,
    AuthenticateOnUnsubscribe: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const MapStringToString = S.Record({ key: S.String, value: S.String });
export class CreatePlatformEndpointInput extends S.Class<CreatePlatformEndpointInput>(
  "CreatePlatformEndpointInput",
)(
  {
    PlatformApplicationArn: S.String,
    Token: S.String,
    CustomUserData: S.optional(S.String),
    Attributes: S.optional(MapStringToString),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSMSSandboxPhoneNumberInput extends S.Class<CreateSMSSandboxPhoneNumberInput>(
  "CreateSMSSandboxPhoneNumberInput",
)(
  { PhoneNumber: S.String, LanguageCode: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSMSSandboxPhoneNumberResult extends S.Class<CreateSMSSandboxPhoneNumberResult>(
  "CreateSMSSandboxPhoneNumberResult",
)({}, ns) {}
export class DeleteEndpointInput extends S.Class<DeleteEndpointInput>(
  "DeleteEndpointInput",
)(
  { EndpointArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEndpointResponse extends S.Class<DeleteEndpointResponse>(
  "DeleteEndpointResponse",
)({}, ns) {}
export class DeletePlatformApplicationInput extends S.Class<DeletePlatformApplicationInput>(
  "DeletePlatformApplicationInput",
)(
  { PlatformApplicationArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePlatformApplicationResponse extends S.Class<DeletePlatformApplicationResponse>(
  "DeletePlatformApplicationResponse",
)({}, ns) {}
export class DeleteSMSSandboxPhoneNumberInput extends S.Class<DeleteSMSSandboxPhoneNumberInput>(
  "DeleteSMSSandboxPhoneNumberInput",
)(
  { PhoneNumber: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSMSSandboxPhoneNumberResult extends S.Class<DeleteSMSSandboxPhoneNumberResult>(
  "DeleteSMSSandboxPhoneNumberResult",
)({}, ns) {}
export class DeleteTopicInput extends S.Class<DeleteTopicInput>(
  "DeleteTopicInput",
)(
  { TopicArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTopicResponse extends S.Class<DeleteTopicResponse>(
  "DeleteTopicResponse",
)({}, ns) {}
export class GetDataProtectionPolicyInput extends S.Class<GetDataProtectionPolicyInput>(
  "GetDataProtectionPolicyInput",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEndpointAttributesInput extends S.Class<GetEndpointAttributesInput>(
  "GetEndpointAttributesInput",
)(
  { EndpointArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPlatformApplicationAttributesInput extends S.Class<GetPlatformApplicationAttributesInput>(
  "GetPlatformApplicationAttributesInput",
)(
  { PlatformApplicationArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSMSAttributesInput extends S.Class<GetSMSAttributesInput>(
  "GetSMSAttributesInput",
)(
  { attributes: S.optional(ListString) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSMSSandboxAccountStatusResult extends S.Class<GetSMSSandboxAccountStatusResult>(
  "GetSMSSandboxAccountStatusResult",
)({ IsInSandbox: S.Boolean }, ns) {}
export class GetSubscriptionAttributesInput extends S.Class<GetSubscriptionAttributesInput>(
  "GetSubscriptionAttributesInput",
)(
  { SubscriptionArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTopicAttributesInput extends S.Class<GetTopicAttributesInput>(
  "GetTopicAttributesInput",
)(
  { TopicArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEndpointsByPlatformApplicationInput extends S.Class<ListEndpointsByPlatformApplicationInput>(
  "ListEndpointsByPlatformApplicationInput",
)(
  { PlatformApplicationArn: S.String, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOriginationNumbersRequest extends S.Class<ListOriginationNumbersRequest>(
  "ListOriginationNumbersRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPhoneNumbersOptedOutInput extends S.Class<ListPhoneNumbersOptedOutInput>(
  "ListPhoneNumbersOptedOutInput",
)(
  { nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPlatformApplicationsInput extends S.Class<ListPlatformApplicationsInput>(
  "ListPlatformApplicationsInput",
)(
  { NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSMSSandboxPhoneNumbersInput extends S.Class<ListSMSSandboxPhoneNumbersInput>(
  "ListSMSSandboxPhoneNumbersInput",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSubscriptionsInput extends S.Class<ListSubscriptionsInput>(
  "ListSubscriptionsInput",
)(
  { NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSubscriptionsByTopicInput extends S.Class<ListSubscriptionsByTopicInput>(
  "ListSubscriptionsByTopicInput",
)(
  { TopicArn: S.String, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTopicsInput extends S.Class<ListTopicsInput>(
  "ListTopicsInput",
)(
  { NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class OptInPhoneNumberInput extends S.Class<OptInPhoneNumberInput>(
  "OptInPhoneNumberInput",
)(
  { phoneNumber: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class OptInPhoneNumberResponse extends S.Class<OptInPhoneNumberResponse>(
  "OptInPhoneNumberResponse",
)({}, ns) {}
export class PutDataProtectionPolicyInput extends S.Class<PutDataProtectionPolicyInput>(
  "PutDataProtectionPolicyInput",
)(
  { ResourceArn: S.String, DataProtectionPolicy: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDataProtectionPolicyResponse extends S.Class<PutDataProtectionPolicyResponse>(
  "PutDataProtectionPolicyResponse",
)({}, ns) {}
export class RemovePermissionInput extends S.Class<RemovePermissionInput>(
  "RemovePermissionInput",
)(
  { TopicArn: S.String, Label: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemovePermissionResponse extends S.Class<RemovePermissionResponse>(
  "RemovePermissionResponse",
)({}, ns) {}
export class SetEndpointAttributesInput extends S.Class<SetEndpointAttributesInput>(
  "SetEndpointAttributesInput",
)(
  { EndpointArn: S.String, Attributes: MapStringToString },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetEndpointAttributesResponse extends S.Class<SetEndpointAttributesResponse>(
  "SetEndpointAttributesResponse",
)({}, ns) {}
export class SetPlatformApplicationAttributesInput extends S.Class<SetPlatformApplicationAttributesInput>(
  "SetPlatformApplicationAttributesInput",
)(
  { PlatformApplicationArn: S.String, Attributes: MapStringToString },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetPlatformApplicationAttributesResponse extends S.Class<SetPlatformApplicationAttributesResponse>(
  "SetPlatformApplicationAttributesResponse",
)({}, ns) {}
export class SetSMSAttributesInput extends S.Class<SetSMSAttributesInput>(
  "SetSMSAttributesInput",
)(
  { attributes: MapStringToString },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetSMSAttributesResponse extends S.Class<SetSMSAttributesResponse>(
  "SetSMSAttributesResponse",
)({}, ns) {}
export class SetSubscriptionAttributesInput extends S.Class<SetSubscriptionAttributesInput>(
  "SetSubscriptionAttributesInput",
)(
  {
    SubscriptionArn: S.String,
    AttributeName: S.String,
    AttributeValue: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetSubscriptionAttributesResponse extends S.Class<SetSubscriptionAttributesResponse>(
  "SetSubscriptionAttributesResponse",
)({}, ns) {}
export class SetTopicAttributesInput extends S.Class<SetTopicAttributesInput>(
  "SetTopicAttributesInput",
)(
  {
    TopicArn: S.String,
    AttributeName: S.String,
    AttributeValue: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetTopicAttributesResponse extends S.Class<SetTopicAttributesResponse>(
  "SetTopicAttributesResponse",
)({}, ns) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UnsubscribeInput extends S.Class<UnsubscribeInput>(
  "UnsubscribeInput",
)(
  { SubscriptionArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UnsubscribeResponse extends S.Class<UnsubscribeResponse>(
  "UnsubscribeResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class VerifySMSSandboxPhoneNumberInput extends S.Class<VerifySMSSandboxPhoneNumberInput>(
  "VerifySMSSandboxPhoneNumberInput",
)(
  { PhoneNumber: S.String, OneTimePassword: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class VerifySMSSandboxPhoneNumberResult extends S.Class<VerifySMSSandboxPhoneNumberResult>(
  "VerifySMSSandboxPhoneNumberResult",
)({}, ns) {}
export const TopicAttributesMap = S.Record({ key: S.String, value: S.String });
export const PhoneNumberList = S.Array(S.String);
export class MessageAttributeValue extends S.Class<MessageAttributeValue>(
  "MessageAttributeValue",
)({
  DataType: S.String,
  StringValue: S.optional(S.String),
  BinaryValue: S.optional(T.Blob),
}) {}
export const MessageAttributeMap = S.Record({
  key: S.String.pipe(T.XmlName("Name")),
  value: MessageAttributeValue.pipe(T.XmlName("Value")),
});
export class PublishBatchRequestEntry extends S.Class<PublishBatchRequestEntry>(
  "PublishBatchRequestEntry",
)({
  Id: S.String,
  Message: S.String,
  Subject: S.optional(S.String),
  MessageStructure: S.optional(S.String),
  MessageAttributes: S.optional(MessageAttributeMap),
  MessageDeduplicationId: S.optional(S.String),
  MessageGroupId: S.optional(S.String),
}) {}
export const PublishBatchRequestEntryList = S.Array(PublishBatchRequestEntry);
export const SubscriptionAttributesMap = S.Record({
  key: S.String,
  value: S.String,
});
export class CheckIfPhoneNumberIsOptedOutResponse extends S.Class<CheckIfPhoneNumberIsOptedOutResponse>(
  "CheckIfPhoneNumberIsOptedOutResponse",
)({ isOptedOut: S.optional(S.Boolean) }, ns) {}
export class ConfirmSubscriptionResponse extends S.Class<ConfirmSubscriptionResponse>(
  "ConfirmSubscriptionResponse",
)({ SubscriptionArn: S.optional(S.String) }, ns) {}
export class CreatePlatformApplicationInput extends S.Class<CreatePlatformApplicationInput>(
  "CreatePlatformApplicationInput",
)(
  { Name: S.String, Platform: S.String, Attributes: MapStringToString },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEndpointResponse extends S.Class<CreateEndpointResponse>(
  "CreateEndpointResponse",
)({ EndpointArn: S.optional(S.String) }, ns) {}
export class CreateTopicInput extends S.Class<CreateTopicInput>(
  "CreateTopicInput",
)(
  {
    Name: S.String,
    Attributes: S.optional(TopicAttributesMap),
    Tags: S.optional(TagList),
    DataProtectionPolicy: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataProtectionPolicyResponse extends S.Class<GetDataProtectionPolicyResponse>(
  "GetDataProtectionPolicyResponse",
)({ DataProtectionPolicy: S.optional(S.String) }, ns) {}
export class GetEndpointAttributesResponse extends S.Class<GetEndpointAttributesResponse>(
  "GetEndpointAttributesResponse",
)({ Attributes: S.optional(MapStringToString) }, ns) {}
export class GetPlatformApplicationAttributesResponse extends S.Class<GetPlatformApplicationAttributesResponse>(
  "GetPlatformApplicationAttributesResponse",
)({ Attributes: S.optional(MapStringToString) }, ns) {}
export class GetSMSAttributesResponse extends S.Class<GetSMSAttributesResponse>(
  "GetSMSAttributesResponse",
)({ attributes: S.optional(MapStringToString) }, ns) {}
export class GetSubscriptionAttributesResponse extends S.Class<GetSubscriptionAttributesResponse>(
  "GetSubscriptionAttributesResponse",
)({ Attributes: S.optional(SubscriptionAttributesMap) }, ns) {}
export class GetTopicAttributesResponse extends S.Class<GetTopicAttributesResponse>(
  "GetTopicAttributesResponse",
)({ Attributes: S.optional(TopicAttributesMap) }, ns) {}
export class ListPhoneNumbersOptedOutResponse extends S.Class<ListPhoneNumbersOptedOutResponse>(
  "ListPhoneNumbersOptedOutResponse",
)(
  {
    phoneNumbers: S.optional(PhoneNumberList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class Subscription extends S.Class<Subscription>("Subscription")({
  SubscriptionArn: S.optional(S.String),
  Owner: S.optional(S.String),
  Protocol: S.optional(S.String),
  Endpoint: S.optional(S.String),
  TopicArn: S.optional(S.String),
}) {}
export const SubscriptionsList = S.Array(Subscription);
export class ListSubscriptionsByTopicResponse extends S.Class<ListSubscriptionsByTopicResponse>(
  "ListSubscriptionsByTopicResponse",
)(
  {
    Subscriptions: S.optional(SubscriptionsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export class PublishBatchInput extends S.Class<PublishBatchInput>(
  "PublishBatchInput",
)(
  {
    TopicArn: S.String,
    PublishBatchRequestEntries: PublishBatchRequestEntryList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SubscribeInput extends S.Class<SubscribeInput>("SubscribeInput")(
  {
    TopicArn: S.String,
    Protocol: S.String,
    Endpoint: S.optional(S.String),
    Attributes: S.optional(SubscriptionAttributesMap),
    ReturnSubscriptionArn: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const NumberCapabilityList = S.Array(S.String);
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  EndpointArn: S.optional(S.String),
  Attributes: S.optional(MapStringToString),
}) {}
export const ListOfEndpoints = S.Array(Endpoint);
export class PhoneNumberInformation extends S.Class<PhoneNumberInformation>(
  "PhoneNumberInformation",
)({
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PhoneNumber: S.optional(S.String),
  Status: S.optional(S.String),
  Iso2CountryCode: S.optional(S.String),
  RouteType: S.optional(S.String),
  NumberCapabilities: S.optional(NumberCapabilityList),
}) {}
export const PhoneNumberInformationList = S.Array(PhoneNumberInformation);
export class PlatformApplication extends S.Class<PlatformApplication>(
  "PlatformApplication",
)({
  PlatformApplicationArn: S.optional(S.String),
  Attributes: S.optional(MapStringToString),
}) {}
export const ListOfPlatformApplications = S.Array(PlatformApplication);
export class SMSSandboxPhoneNumber extends S.Class<SMSSandboxPhoneNumber>(
  "SMSSandboxPhoneNumber",
)({ PhoneNumber: S.optional(S.String), Status: S.optional(S.String) }) {}
export const SMSSandboxPhoneNumberList = S.Array(SMSSandboxPhoneNumber);
export class Topic extends S.Class<Topic>("Topic")({
  TopicArn: S.optional(S.String),
}) {}
export const TopicsList = S.Array(Topic);
export class CreatePlatformApplicationResponse extends S.Class<CreatePlatformApplicationResponse>(
  "CreatePlatformApplicationResponse",
)({ PlatformApplicationArn: S.optional(S.String) }, ns) {}
export class CreateTopicResponse extends S.Class<CreateTopicResponse>(
  "CreateTopicResponse",
)({ TopicArn: S.optional(S.String) }, ns) {}
export class ListEndpointsByPlatformApplicationResponse extends S.Class<ListEndpointsByPlatformApplicationResponse>(
  "ListEndpointsByPlatformApplicationResponse",
)(
  { Endpoints: S.optional(ListOfEndpoints), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListOriginationNumbersResult extends S.Class<ListOriginationNumbersResult>(
  "ListOriginationNumbersResult",
)(
  {
    NextToken: S.optional(S.String),
    PhoneNumbers: S.optional(PhoneNumberInformationList),
  },
  ns,
) {}
export class ListPlatformApplicationsResponse extends S.Class<ListPlatformApplicationsResponse>(
  "ListPlatformApplicationsResponse",
)(
  {
    PlatformApplications: S.optional(ListOfPlatformApplications),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListSMSSandboxPhoneNumbersResult extends S.Class<ListSMSSandboxPhoneNumbersResult>(
  "ListSMSSandboxPhoneNumbersResult",
)(
  { PhoneNumbers: SMSSandboxPhoneNumberList, NextToken: S.optional(S.String) },
  ns,
) {}
export class ListSubscriptionsResponse extends S.Class<ListSubscriptionsResponse>(
  "ListSubscriptionsResponse",
)(
  {
    Subscriptions: S.optional(SubscriptionsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTopicsResponse extends S.Class<ListTopicsResponse>(
  "ListTopicsResponse",
)({ Topics: S.optional(TopicsList), NextToken: S.optional(S.String) }, ns) {}
export class PublishInput extends S.Class<PublishInput>("PublishInput")(
  {
    TopicArn: S.optional(S.String),
    TargetArn: S.optional(S.String),
    PhoneNumber: S.optional(S.String),
    Message: S.String,
    Subject: S.optional(S.String),
    MessageStructure: S.optional(S.String),
    MessageAttributes: S.optional(MessageAttributeMap),
    MessageDeduplicationId: S.optional(S.String),
    MessageGroupId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SubscribeResponse extends S.Class<SubscribeResponse>(
  "SubscribeResponse",
)({ SubscriptionArn: S.optional(S.String) }, ns) {}
export class PublishBatchResultEntry extends S.Class<PublishBatchResultEntry>(
  "PublishBatchResultEntry",
)({
  Id: S.optional(S.String),
  MessageId: S.optional(S.String),
  SequenceNumber: S.optional(S.String),
}) {}
export const PublishBatchResultEntryList = S.Array(PublishBatchResultEntry);
export class BatchResultErrorEntry extends S.Class<BatchResultErrorEntry>(
  "BatchResultErrorEntry",
)({
  Id: S.String,
  Code: S.String,
  Message: S.optional(S.String),
  SenderFault: S.Boolean,
}) {}
export const BatchResultErrorEntryList = S.Array(BatchResultErrorEntry);
export class PublishResponse extends S.Class<PublishResponse>(
  "PublishResponse",
)(
  { MessageId: S.optional(S.String), SequenceNumber: S.optional(S.String) },
  ns,
) {}
export class PublishBatchResponse extends S.Class<PublishBatchResponse>(
  "PublishBatchResponse",
)(
  {
    Successful: S.optional(PublishBatchResultEntryList),
    Failed: S.optional(BatchResultErrorEntryList),
  },
  ns,
) {}

//# Errors
export class AuthorizationErrorException extends S.TaggedError<AuthorizationErrorException>()(
  "AuthorizationErrorException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AuthorizationError", httpResponseCode: 403 }),
) {}
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalError", httpResponseCode: 500 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class FilterPolicyLimitExceededException extends S.TaggedError<FilterPolicyLimitExceededException>()(
  "FilterPolicyLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "FilterPolicyLimitExceeded", httpResponseCode: 403 }),
) {}
export class ConcurrentAccessException extends S.TaggedError<ConcurrentAccessException>()(
  "ConcurrentAccessException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConcurrentAccess", httpResponseCode: 400 }),
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidParameter", httpResponseCode: 400 }),
) {}
export class ThrottledException extends S.TaggedError<ThrottledException>()(
  "ThrottledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "Throttled", httpResponseCode: 429 }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NotFound", httpResponseCode: 404 }),
) {}
export class EndpointDisabledException extends S.TaggedError<EndpointDisabledException>()(
  "EndpointDisabledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "EndpointDisabled", httpResponseCode: 400 }),
) {}
export class BatchEntryIdsNotDistinctException extends S.TaggedError<BatchEntryIdsNotDistinctException>()(
  "BatchEntryIdsNotDistinctException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "BatchEntryIdsNotDistinct", httpResponseCode: 400 }),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFound", httpResponseCode: 404 }),
) {}
export class InvalidSecurityException extends S.TaggedError<InvalidSecurityException>()(
  "InvalidSecurityException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSecurity", httpResponseCode: 403 }),
) {}
export class OptedOutException extends S.TaggedError<OptedOutException>()(
  "OptedOutException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "OptedOut", httpResponseCode: 400 }),
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidState", httpResponseCode: 400 }),
) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ParameterValueInvalid", httpResponseCode: 400 }),
) {}
export class BatchRequestTooLongException extends S.TaggedError<BatchRequestTooLongException>()(
  "BatchRequestTooLongException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "BatchRequestTooLong", httpResponseCode: 400 }),
) {}
export class ReplayLimitExceededException extends S.TaggedError<ReplayLimitExceededException>()(
  "ReplayLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReplayLimitExceeded", httpResponseCode: 403 }),
) {}
export class UserErrorException extends S.TaggedError<UserErrorException>()(
  "UserErrorException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserError", httpResponseCode: 400 }),
) {}
export class StaleTagException extends S.TaggedError<StaleTagException>()(
  "StaleTagException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StaleTag", httpResponseCode: 400 }),
) {}
export class TagPolicyException extends S.TaggedError<TagPolicyException>()(
  "TagPolicyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagPolicy", httpResponseCode: 400 }),
) {}
export class VerificationException extends S.TaggedError<VerificationException>()(
  "VerificationException",
  { Message: S.String, Status: S.String },
) {}
export class KMSAccessDeniedException extends S.TaggedError<KMSAccessDeniedException>()(
  "KMSAccessDeniedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSAccessDenied", httpResponseCode: 400 }),
) {}
export class EmptyBatchRequestException extends S.TaggedError<EmptyBatchRequestException>()(
  "EmptyBatchRequestException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "EmptyBatchRequest", httpResponseCode: 400 }),
) {}
export class SubscriptionLimitExceededException extends S.TaggedError<SubscriptionLimitExceededException>()(
  "SubscriptionLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionLimitExceeded", httpResponseCode: 403 }),
) {}
export class TagLimitExceededException extends S.TaggedError<TagLimitExceededException>()(
  "TagLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagLimitExceeded", httpResponseCode: 400 }),
) {}
export class KMSDisabledException extends S.TaggedError<KMSDisabledException>()(
  "KMSDisabledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSDisabled", httpResponseCode: 400 }),
) {}
export class InvalidBatchEntryIdException extends S.TaggedError<InvalidBatchEntryIdException>()(
  "InvalidBatchEntryIdException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidBatchEntryId", httpResponseCode: 400 }),
) {}
export class TopicLimitExceededException extends S.TaggedError<TopicLimitExceededException>()(
  "TopicLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TopicLimitExceeded", httpResponseCode: 403 }),
) {}
export class KMSInvalidStateException extends S.TaggedError<KMSInvalidStateException>()(
  "KMSInvalidStateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSInvalidState", httpResponseCode: 400 }),
) {}
export class KMSNotFoundException extends S.TaggedError<KMSNotFoundException>()(
  "KMSNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSNotFound", httpResponseCode: 400 }),
) {}
export class KMSOptInRequired extends S.TaggedError<KMSOptInRequired>()(
  "KMSOptInRequired",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSOptInRequired", httpResponseCode: 403 }),
) {}
export class KMSThrottlingException extends S.TaggedError<KMSThrottlingException>()(
  "KMSThrottlingException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSThrottling", httpResponseCode: 400 }),
) {}
export class PlatformApplicationDisabledException extends S.TaggedError<PlatformApplicationDisabledException>()(
  "PlatformApplicationDisabledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "PlatformApplicationDisabled",
    httpResponseCode: 400,
  }),
) {}
export class TooManyEntriesInBatchRequestException extends S.TaggedError<TooManyEntriesInBatchRequestException>()(
  "TooManyEntriesInBatchRequestException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TooManyEntriesInBatchRequest",
    httpResponseCode: 400,
  }),
) {}

//# Operations
/**
 * Retrieves the SMS sandbox status for the calling Amazon Web Services account in the target
 * Amazon Web Services Region.
 *
 * When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the
 * *SMS sandbox*. The SMS sandbox provides a safe environment for
 * you to try Amazon SNS features without risking your reputation as an SMS sender. While your
 * Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send
 * SMS messages only to verified destination phone numbers. For more information, including how to
 * move out of the sandbox to send messages without restrictions,
 * see SMS sandbox in
 * the *Amazon SNS Developer Guide*.
 */
export const getSMSSandboxAccountStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSMSSandboxAccountStatusInput,
    output: GetSMSSandboxAccountStatusResult,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      ThrottledException,
    ],
  }),
);
/**
 * Creates a platform application object for one of the supported push notification
 * services, such as APNS and GCM (Firebase Cloud Messaging), to which devices and mobile
 * apps may register. You must specify `PlatformPrincipal` and
 * `PlatformCredential` attributes when using the
 * `CreatePlatformApplication` action.
 *
 * `PlatformPrincipal` and `PlatformCredential` are received from
 * the notification service.
 *
 * - For ADM, `PlatformPrincipal` is `client id` and
 * `PlatformCredential` is `client secret`.
 *
 * - For APNS and `APNS_SANDBOX` using certificate credentials,
 * `PlatformPrincipal` is `SSL certificate` and
 * `PlatformCredential` is `private key`.
 *
 * - For APNS and `APNS_SANDBOX` using token credentials,
 * `PlatformPrincipal` is `signing key ID` and
 * `PlatformCredential` is `signing key`.
 *
 * - For Baidu, `PlatformPrincipal` is `API key` and
 * `PlatformCredential` is `secret key`.
 *
 * - For GCM (Firebase Cloud Messaging) using key credentials, there is no
 * `PlatformPrincipal`. The `PlatformCredential` is
 * `API key`.
 *
 * - For GCM (Firebase Cloud Messaging) using token credentials, there is no
 * `PlatformPrincipal`. The `PlatformCredential` is a
 * JSON formatted private key file. When using the Amazon Web Services CLI or Amazon Web Services SDKs, the
 * file must be in string format and special characters must be ignored. To format
 * the file correctly, Amazon SNS recommends using the following command:
 * `SERVICE_JSON=$(jq @json Package Security
 * Identifier and `PlatformCredential` is secret
 * key.
 *
 * You can use the returned `PlatformApplicationArn` as an attribute for the
 * `CreatePlatformEndpoint` action.
 */
export const createPlatformApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePlatformApplicationInput,
    output: CreatePlatformApplicationResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
    ],
  }),
);
/**
 * Lists the platform application objects for the supported push notification services,
 * such as APNS and GCM (Firebase Cloud Messaging). The results for
 * `ListPlatformApplications` are paginated and return a limited list of
 * applications, up to 100. If additional records are available after the first page
 * results, then a NextToken string will be returned. To receive the next page, you call
 * `ListPlatformApplications` using the NextToken string received from the
 * previous call. When there are no more records to return, `NextToken` will be
 * null. For more information, see Using Amazon SNS Mobile Push
 * Notifications.
 *
 * This action is throttled at 15 transactions per second (TPS).
 */
export const listPlatformApplications =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPlatformApplicationsInput,
    output: ListPlatformApplicationsResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PlatformApplications",
    } as const,
  }));
/**
 * Returns a list of the requester's subscriptions. Each call returns a limited list of
 * subscriptions, up to 100. If there are more subscriptions, a `NextToken` is
 * also returned. Use the `NextToken` parameter in a new
 * `ListSubscriptions` call to get further results.
 *
 * This action is throttled at 30 transactions per second (TPS).
 */
export const listSubscriptions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSubscriptionsInput,
    output: ListSubscriptionsResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Subscriptions",
    } as const,
  }),
);
/**
 * Returns a list of the requester's topics. Each call returns a limited list of topics,
 * up to 100. If there are more topics, a `NextToken` is also returned. Use the
 * `NextToken` parameter in a new `ListTopics` call to get
 * further results.
 *
 * This action is throttled at 30 transactions per second (TPS).
 */
export const listTopics = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTopicsInput,
  output: ListTopicsResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Topics",
  } as const,
}));
/**
 * Accepts a phone number and indicates whether the phone holder has opted out of
 * receiving SMS messages from your Amazon Web Services account. You cannot send SMS messages to a number
 * that is opted out.
 *
 * To resume sending messages, you can opt in the number by using the
 * `OptInPhoneNumber` action.
 */
export const checkIfPhoneNumberIsOptedOut =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CheckIfPhoneNumberIsOptedOutInput,
    output: CheckIfPhoneNumberIsOptedOutResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      ThrottledException,
    ],
  }));
/**
 * Returns the settings for sending SMS messages from your Amazon Web Services account.
 *
 * These settings are set with the `SetSMSAttributes` action.
 */
export const getSMSAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSMSAttributesInput,
  output: GetSMSAttributesResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    ThrottledException,
  ],
}));
/**
 * Returns a list of phone numbers that are opted out, meaning you cannot send SMS
 * messages to them.
 *
 * The results for `ListPhoneNumbersOptedOut` are paginated, and each page
 * returns up to 100 phone numbers. If additional phone numbers are available after the
 * first page of results, then a `NextToken` string will be returned. To receive
 * the next page, you call `ListPhoneNumbersOptedOut` again using the
 * `NextToken` string received from the previous call. When there are no
 * more records to return, `NextToken` will be null.
 */
export const listPhoneNumbersOptedOut =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPhoneNumbersOptedOutInput,
    output: ListPhoneNumbersOptedOutResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      ThrottledException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "phoneNumbers",
    } as const,
  }));
/**
 * Deletes the endpoint for a device and mobile app from Amazon SNS. This action is
 * idempotent. For more information, see Using Amazon SNS Mobile Push
 * Notifications.
 *
 * When you delete an endpoint that is also subscribed to a topic, then you must also
 * unsubscribe the endpoint from the topic.
 */
export const deleteEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointInput,
  output: DeleteEndpointResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
  ],
}));
/**
 * Deletes a platform application object for one of the supported push notification
 * services, such as APNS and GCM (Firebase Cloud Messaging). For more information, see
 * Using Amazon SNS
 * Mobile Push Notifications.
 */
export const deletePlatformApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePlatformApplicationInput,
    output: DeletePlatformApplicationResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
    ],
  }),
);
/**
 * Use this request to opt in a phone number that is opted out, which enables you to
 * resume sending SMS messages to the number.
 *
 * You can opt in a phone number only once every 30 days.
 */
export const optInPhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: OptInPhoneNumberInput,
  output: OptInPhoneNumberResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    ThrottledException,
  ],
}));
/**
 * Use this request to set the default settings for sending SMS messages and receiving
 * daily SMS usage reports.
 *
 * You can override some of these settings for a single message when you use the
 * `Publish` action with the `MessageAttributes.entry.N`
 * parameter. For more information, see Publishing to a mobile phone
 * in the *Amazon SNS Developer Guide*.
 *
 * To use this operation, you must grant the Amazon SNS service principal
 * (`sns.amazonaws.com`) permission to perform the
 * `s3:ListBucket` action.
 */
export const setSMSAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetSMSAttributesInput,
  output: SetSMSAttributesResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    ThrottledException,
  ],
}));
/**
 * Adds a statement to a topic's access control policy, granting access for the specified
 * Amazon Web Services accounts to the specified actions.
 *
 * To remove the ability to change topic permissions, you must deny permissions to
 * the `AddPermission`, `RemovePermission`, and
 * `SetTopicAttributes` actions in your IAM policy.
 */
export const addPermission = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddPermissionInput,
  output: AddPermissionResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
  ],
}));
/**
 * Lists the calling Amazon Web Services account's dedicated origination numbers and their metadata.
 * For more information about origination numbers, see Origination numbers in the Amazon SNS Developer
 * Guide.
 */
export const listOriginationNumbers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListOriginationNumbersRequest,
    output: ListOriginationNumbersResult,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      ThrottledException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PhoneNumbers",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the calling Amazon Web Services account's current verified and pending destination phone
 * numbers in the SMS sandbox.
 *
 * When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the
 * *SMS sandbox*. The SMS sandbox provides a safe environment for
 * you to try Amazon SNS features without risking your reputation as an SMS sender. While your
 * Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send
 * SMS messages only to verified destination phone numbers. For more information, including how to
 * move out of the sandbox to send messages without restrictions,
 * see SMS sandbox in
 * the *Amazon SNS Developer Guide*.
 */
export const listSMSSandboxPhoneNumbers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSMSSandboxPhoneNumbersInput,
    output: ListSMSSandboxPhoneNumbersResult,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottledException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PhoneNumbers",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists the endpoints and endpoint attributes for devices in a supported push
 * notification service, such as GCM (Firebase Cloud Messaging) and APNS. The results for
 * `ListEndpointsByPlatformApplication` are paginated and return a limited
 * list of endpoints, up to 100. If additional records are available after the first page
 * results, then a NextToken string will be returned. To receive the next page, you call
 * `ListEndpointsByPlatformApplication` again using the NextToken string
 * received from the previous call. When there are no more records to return, NextToken
 * will be null. For more information, see Using Amazon SNS Mobile Push
 * Notifications.
 *
 * This action is throttled at 30 transactions per second (TPS).
 */
export const listEndpointsByPlatformApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEndpointsByPlatformApplicationInput,
    output: ListEndpointsByPlatformApplicationResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      NotFoundException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Endpoints",
    } as const,
  }));
/**
 * Creates an endpoint for a device and mobile app on one of the supported push
 * notification services, such as GCM (Firebase Cloud Messaging) and APNS.
 * `CreatePlatformEndpoint` requires the `PlatformApplicationArn`
 * that is returned from `CreatePlatformApplication`. You can use the returned
 * `EndpointArn` to send a message to a mobile app or by the
 * `Subscribe` action for subscription to a topic. The
 * `CreatePlatformEndpoint` action is idempotent, so if the requester
 * already owns an endpoint with the same device token and attributes, that endpoint's ARN
 * is returned without creating a new endpoint. For more information, see Using Amazon SNS Mobile Push
 * Notifications.
 *
 * When using `CreatePlatformEndpoint` with Baidu, two attributes must be
 * provided: ChannelId and UserId. The token field must also contain the ChannelId. For
 * more information, see Creating an Amazon SNS Endpoint for
 * Baidu.
 */
export const createPlatformEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePlatformEndpointInput,
    output: CreateEndpointResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      NotFoundException,
    ],
  }),
);
/**
 * Retrieves the endpoint attributes for a device on one of the supported push
 * notification services, such as GCM (Firebase Cloud Messaging) and APNS. For more
 * information, see Using Amazon SNS Mobile Push Notifications.
 */
export const getEndpointAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEndpointAttributesInput,
    output: GetEndpointAttributesResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      NotFoundException,
    ],
  }),
);
/**
 * Retrieves the attributes of the platform application object for the supported push
 * notification services, such as APNS and GCM (Firebase Cloud Messaging). For more
 * information, see Using Amazon SNS Mobile Push Notifications.
 */
export const getPlatformApplicationAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetPlatformApplicationAttributesInput,
    output: GetPlatformApplicationAttributesResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      NotFoundException,
    ],
  }));
/**
 * Returns all of the properties of a subscription.
 */
export const getSubscriptionAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSubscriptionAttributesInput,
    output: GetSubscriptionAttributesResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      NotFoundException,
    ],
  }),
);
/**
 * Returns a list of the subscriptions to a specific topic. Each call returns a limited
 * list of subscriptions, up to 100. If there are more subscriptions, a
 * `NextToken` is also returned. Use the `NextToken` parameter in
 * a new `ListSubscriptionsByTopic` call to get further results.
 *
 * This action is throttled at 30 transactions per second (TPS).
 */
export const listSubscriptionsByTopic =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSubscriptionsByTopicInput,
    output: ListSubscriptionsByTopicResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      NotFoundException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Subscriptions",
    } as const,
  }));
/**
 * Removes a statement from a topic's access control policy.
 *
 * To remove the ability to change topic permissions, you must deny permissions to
 * the `AddPermission`, `RemovePermission`, and
 * `SetTopicAttributes` actions in your IAM policy.
 */
export const removePermission = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemovePermissionInput,
  output: RemovePermissionResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
  ],
}));
/**
 * Sets the attributes for an endpoint for a device on one of the supported push
 * notification services, such as GCM (Firebase Cloud Messaging) and APNS. For more
 * information, see Using Amazon SNS Mobile Push Notifications.
 */
export const setEndpointAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetEndpointAttributesInput,
    output: SetEndpointAttributesResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      NotFoundException,
    ],
  }),
);
/**
 * Sets the attributes of the platform application object for the supported push
 * notification services, such as APNS and GCM (Firebase Cloud Messaging). For more
 * information, see Using Amazon SNS Mobile Push Notifications. For information on configuring
 * attributes for message delivery status, see Using Amazon SNS Application Attributes for
 * Message Delivery Status.
 */
export const setPlatformApplicationAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetPlatformApplicationAttributesInput,
    output: SetPlatformApplicationAttributesResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      NotFoundException,
    ],
  }));
/**
 * Retrieves the specified inline `DataProtectionPolicy` document that is
 * stored in the specified Amazon SNS topic.
 */
export const getDataProtectionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataProtectionPolicyInput,
    output: GetDataProtectionPolicyResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      InvalidSecurityException,
      NotFoundException,
    ],
  }),
);
/**
 * Returns all of the properties of a topic. Topic properties returned might differ based
 * on the authorization of the user.
 */
export const getTopicAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTopicAttributesInput,
  output: GetTopicAttributesResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    InvalidSecurityException,
    NotFoundException,
  ],
}));
/**
 * Adds or updates an inline policy document that is stored in the specified Amazon SNS
 * topic.
 */
export const putDataProtectionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutDataProtectionPolicyInput,
    output: PutDataProtectionPolicyResponse,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      InvalidSecurityException,
      NotFoundException,
    ],
  }),
);
/**
 * Allows a topic owner to set an attribute of the topic to a new value.
 *
 * To remove the ability to change topic permissions, you must deny permissions to
 * the `AddPermission`, `RemovePermission`, and
 * `SetTopicAttributes` actions in your IAM policy.
 */
export const setTopicAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetTopicAttributesInput,
  output: SetTopicAttributesResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    InvalidSecurityException,
    NotFoundException,
  ],
}));
/**
 * Deletes a subscription. If the subscription requires authentication for deletion, only
 * the owner of the subscription or the topic's owner can unsubscribe, and an Amazon Web Services
 * signature is required. If the `Unsubscribe` call does not require
 * authentication and the requester is not the subscription owner, a final cancellation
 * message is delivered to the endpoint, so that the endpoint owner can easily resubscribe
 * to the topic if the `Unsubscribe` request was unintended.
 *
 * This action is throttled at 100 transactions per second (TPS).
 */
export const unsubscribe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnsubscribeInput,
  output: UnsubscribeResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    InvalidSecurityException,
    NotFoundException,
  ],
}));
/**
 * Adds a destination phone number to an Amazon Web Services account in the SMS sandbox and sends a
 * one-time password (OTP) to that phone number.
 *
 * When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the
 * *SMS sandbox*. The SMS sandbox provides a safe environment for
 * you to try Amazon SNS features without risking your reputation as an SMS sender. While your
 * Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send
 * SMS messages only to verified destination phone numbers. For more information, including how to
 * move out of the sandbox to send messages without restrictions,
 * see SMS sandbox in
 * the *Amazon SNS Developer Guide*.
 */
export const createSMSSandboxPhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSMSSandboxPhoneNumberInput,
    output: CreateSMSSandboxPhoneNumberResult,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      OptedOutException,
      ThrottledException,
      UserErrorException,
    ],
  }),
);
/**
 * List all tags added to the specified Amazon SNS topic. For an overview, see Amazon SNS Tags in the
 * *Amazon Simple Notification Service Developer Guide*.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AuthorizationErrorException,
    ConcurrentAccessException,
    InvalidParameterException,
    ResourceNotFoundException,
    TagPolicyException,
  ],
}));
/**
 * Verifies a destination phone number with a one-time password (OTP) for the calling
 * Amazon Web Services account.
 *
 * When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the
 * *SMS sandbox*. The SMS sandbox provides a safe environment for
 * you to try Amazon SNS features without risking your reputation as an SMS sender. While your
 * Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send
 * SMS messages only to verified destination phone numbers. For more information, including how to
 * move out of the sandbox to send messages without restrictions,
 * see SMS sandbox in
 * the *Amazon SNS Developer Guide*.
 */
export const verifySMSSandboxPhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: VerifySMSSandboxPhoneNumberInput,
    output: VerifySMSSandboxPhoneNumberResult,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottledException,
      VerificationException,
    ],
  }),
);
/**
 * Allows a subscription owner to set an attribute of the subscription to a new
 * value.
 */
export const setSubscriptionAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetSubscriptionAttributesInput,
    output: SetSubscriptionAttributesResponse,
    errors: [
      AuthorizationErrorException,
      FilterPolicyLimitExceededException,
      InternalErrorException,
      InvalidParameterException,
      NotFoundException,
      ReplayLimitExceededException,
    ],
  }),
);
/**
 * Deletes an Amazon Web Services account's verified or pending phone number from the SMS
 * sandbox.
 *
 * When you start using Amazon SNS to send SMS messages, your Amazon Web Services account is in the
 * *SMS sandbox*. The SMS sandbox provides a safe environment for
 * you to try Amazon SNS features without risking your reputation as an SMS sender. While your
 * Amazon Web Services account is in the SMS sandbox, you can use all of the features of Amazon SNS. However, you can send
 * SMS messages only to verified destination phone numbers. For more information, including how to
 * move out of the sandbox to send messages without restrictions,
 * see SMS sandbox in
 * the *Amazon SNS Developer Guide*.
 */
export const deleteSMSSandboxPhoneNumber = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSMSSandboxPhoneNumberInput,
    output: DeleteSMSSandboxPhoneNumberResult,
    errors: [
      AuthorizationErrorException,
      InternalErrorException,
      InvalidParameterException,
      ResourceNotFoundException,
      ThrottledException,
      UserErrorException,
    ],
  }),
);
/**
 * Deletes a topic and all its subscriptions. Deleting a topic might prevent some
 * messages previously sent to the topic from being delivered to subscribers. This action
 * is idempotent, so deleting a topic that does not exist does not result in an
 * error.
 */
export const deleteTopic = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTopicInput,
  output: DeleteTopicResponse,
  errors: [
    AuthorizationErrorException,
    ConcurrentAccessException,
    InternalErrorException,
    InvalidParameterException,
    InvalidStateException,
    NotFoundException,
    StaleTagException,
    TagPolicyException,
  ],
}));
/**
 * Subscribes an endpoint to an Amazon SNS topic. If the endpoint type is HTTP/S or email, or
 * if the endpoint and the topic are not in the same Amazon Web Services account, the endpoint owner must
 * run the `ConfirmSubscription` action to confirm the subscription.
 *
 * You call the `ConfirmSubscription` action with the token from the
 * subscription response. Confirmation tokens are valid for two days.
 *
 * This action is throttled at 100 transactions per second (TPS).
 */
export const subscribe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubscribeInput,
  output: SubscribeResponse,
  errors: [
    AuthorizationErrorException,
    FilterPolicyLimitExceededException,
    InternalErrorException,
    InvalidParameterException,
    InvalidSecurityException,
    NotFoundException,
    ReplayLimitExceededException,
    SubscriptionLimitExceededException,
  ],
}));
/**
 * Verifies an endpoint owner's intent to receive messages by validating the token sent
 * to the endpoint by an earlier `Subscribe` action. If the token is valid, the
 * action creates a new subscription and returns its Amazon Resource Name (ARN). This call
 * requires an AWS signature only when the `AuthenticateOnUnsubscribe` flag is
 * set to "true".
 */
export const confirmSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfirmSubscriptionInput,
  output: ConfirmSubscriptionResponse,
  errors: [
    AuthorizationErrorException,
    FilterPolicyLimitExceededException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    ReplayLimitExceededException,
    SubscriptionLimitExceededException,
  ],
}));
/**
 * Add tags to the specified Amazon SNS topic. For an overview, see Amazon SNS Tags in the
 * *Amazon SNS Developer Guide*.
 *
 * When you use topic tags, keep the following guidelines in mind:
 *
 * - Adding more than 50 tags to a topic isn't recommended.
 *
 * - Tags don't have any semantic meaning. Amazon SNS interprets tags as character
 * strings.
 *
 * - Tags are case-sensitive.
 *
 * - A new tag with a key identical to that of an existing tag overwrites the
 * existing tag.
 *
 * - Tagging actions are limited to 10 TPS per Amazon Web Services account, per Amazon Web Services Region. If
 * your application requires a higher throughput, file a technical support request.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AuthorizationErrorException,
    ConcurrentAccessException,
    InvalidParameterException,
    ResourceNotFoundException,
    StaleTagException,
    TagLimitExceededException,
    TagPolicyException,
  ],
}));
/**
 * Remove tags from the specified Amazon SNS topic. For an overview, see Amazon SNS Tags in the
 * *Amazon SNS Developer Guide*.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AuthorizationErrorException,
    ConcurrentAccessException,
    InvalidParameterException,
    ResourceNotFoundException,
    StaleTagException,
    TagLimitExceededException,
    TagPolicyException,
  ],
}));
/**
 * Creates a topic to which notifications can be published. Users can create at most
 * 100,000 standard topics (at most 1,000 FIFO topics). For more information, see Creating an Amazon SNS
 * topic in the *Amazon SNS Developer Guide*. This action is
 * idempotent, so if the requester already owns a topic with the specified name, that
 * topic's ARN is returned without creating a new topic.
 */
export const createTopic = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTopicInput,
  output: CreateTopicResponse,
  errors: [
    AuthorizationErrorException,
    ConcurrentAccessException,
    InternalErrorException,
    InvalidParameterException,
    InvalidSecurityException,
    StaleTagException,
    TagLimitExceededException,
    TagPolicyException,
    TopicLimitExceededException,
  ],
}));
/**
 * Sends a message to an Amazon SNS topic, a text message (SMS message) directly to a phone
 * number, or a message to a mobile platform endpoint (when you specify the
 * `TargetArn`).
 *
 * If you send a message to a topic, Amazon SNS delivers the message to each endpoint that is
 * subscribed to the topic. The format of the message depends on the notification protocol
 * for each subscribed endpoint.
 *
 * When a `messageId` is returned, the message is saved and Amazon SNS immediately
 * delivers it to subscribers.
 *
 * To use the `Publish` action for publishing a message to a mobile endpoint,
 * such as an app on a Kindle device or mobile phone, you must specify the EndpointArn for
 * the TargetArn parameter. The EndpointArn is returned when making a call with the
 * `CreatePlatformEndpoint` action.
 *
 * For more information about formatting messages, see Send Custom
 * Platform-Specific Payloads in Messages to Mobile Devices.
 *
 * You can publish messages only to topics and endpoints in the same
 * Amazon Web Services Region.
 */
export const publish = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishInput,
  output: PublishResponse,
  errors: [
    AuthorizationErrorException,
    EndpointDisabledException,
    InternalErrorException,
    InvalidParameterException,
    InvalidParameterValueException,
    InvalidSecurityException,
    KMSAccessDeniedException,
    KMSDisabledException,
    KMSInvalidStateException,
    KMSNotFoundException,
    KMSOptInRequired,
    KMSThrottlingException,
    NotFoundException,
    PlatformApplicationDisabledException,
    ValidationException,
  ],
}));
/**
 * Publishes up to 10 messages to the specified topic in a single batch. This is a batch
 * version of the `Publish` API. If you try to send more than 10 messages in a
 * single batch request, you will receive a `TooManyEntriesInBatchRequest`
 * exception.
 *
 * For FIFO topics, multiple messages within a single batch are published in the order
 * they are sent, and messages are deduplicated within the batch and across batches for
 * five minutes.
 *
 * The result of publishing each message is reported individually in the response.
 * Because the batch request can result in a combination of successful and unsuccessful
 * actions, you should check for batch errors even when the call returns an HTTP status
 * code of 200.
 *
 * The maximum allowed individual message size and the maximum total payload size (the sum
 * of the individual lengths of all of the batched messages) are both 256 KB (262,144
 * bytes).
 *
 * The `PublishBatch` API can send up to 10 messages at a time. If you
 * attempt to send more than 10 messages in one request, you will encounter a
 * `TooManyEntriesInBatchRequest` exception. In such cases, split your
 * messages into multiple requests, each containing no more than 10 messages.
 *
 * Some actions take lists of parameters. These lists are specified using the
 * `param.n` notation. Values of `n` are integers starting from
 * **1**. For example, a parameter list with two elements
 * looks like this:
 *
 * `&AttributeName.1=first`
 *
 * `&AttributeName.2=second`
 *
 * If you send a batch message to a topic, Amazon SNS publishes the batch message to each
 * endpoint that is subscribed to the topic. The format of the batch message depends on the
 * notification protocol for each subscribed endpoint.
 *
 * When a `messageId` is returned, the batch message is saved, and Amazon SNS
 * immediately delivers the message to subscribers.
 */
export const publishBatch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishBatchInput,
  output: PublishBatchResponse,
  errors: [
    AuthorizationErrorException,
    BatchEntryIdsNotDistinctException,
    BatchRequestTooLongException,
    EmptyBatchRequestException,
    EndpointDisabledException,
    InternalErrorException,
    InvalidBatchEntryIdException,
    InvalidParameterException,
    InvalidParameterValueException,
    InvalidSecurityException,
    KMSAccessDeniedException,
    KMSDisabledException,
    KMSInvalidStateException,
    KMSNotFoundException,
    KMSOptInRequired,
    KMSThrottlingException,
    NotFoundException,
    PlatformApplicationDisabledException,
    TooManyEntriesInBatchRequestException,
    ValidationException,
  ],
}));

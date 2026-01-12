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
  sdkId: "Pinpoint SMS Voice V2",
  serviceShapeName: "PinpointSMSVoiceV2",
});
const auth = T.AwsAuthSigv4({ name: "sms-voice" });
const ver = T.ServiceVersion("2022-03-31");
const proto = T.AwsProtocolsAwsJson1_0();
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
              `https://sms-voice-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://sms-voice-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://sms-voice.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://sms-voice.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type PoolIdOrArn = string;
export type PhoneOrSenderIdOrArn = string;
export type IsoCountryCode = string;
export type ClientToken = string;
export type ProtectConfigurationIdOrArn = string;
export type ConfigurationSetNameOrArn = string;
export type CarrierLookupInputPhoneNumberType = string;
export type ConfigurationSetName = string;
export type EventDestinationName = string;
export type EventType = string;
export type OptOutListName = string;
export type MessageType = string;
export type RegistrationType = string;
export type RegistrationIdOrArn = string;
export type ResourceIdOrArn = string;
export type AttachmentBody = Uint8Array;
export type AttachmentUrl = string;
export type PhoneNumber = string;
export type ProtectConfigurationArn = string;
export type ProtectConfigurationId = string;
export type PhoneOrPoolIdOrArn = string;
export type Keyword = string;
export type MonthlyLimit = number;
export type OptOutListNameOrArn = string;
export type RegistrationAttachmentIdOrArn = string;
export type FieldPath = string;
export type AmazonResourceName = string;
export type VerifiedDestinationNumberIdOrArn = string;
export type NextToken = string;
export type MaxResults = number;
export type Owner = string;
export type PhoneNumberIdOrArn = string;
export type SectionPath = string;
export type RegistrationVersionNumber = number;
export type NumberCapability = string;
export type KeywordMessage = string;
export type KeywordAction = string;
export type MessageId = string;
export type MessageFeedbackStatus = string;
export type ProtectConfigurationRuleOverrideAction = string;
export type SelectChoice = string;
export type TextValue = string;
export type ResourcePolicy = string;
export type SenderIdOrArn = string;
export type RequestableNumberType = string;
export type SenderId = string;
export type VerificationChannel = string;
export type LanguageCode = string;
export type VerificationMessageOriginationIdentity = string;
export type MediaMessageOriginationIdentity = string;
export type TextMessageBody = string;
export type MediaUrlValue = string;
export type MaxPrice = string;
export type TimeToLive = number;
export type TextMessageOriginationIdentity = string;
export type VoiceMessageOriginationIdentity = string;
export type VoiceMessageBody = string;
export type VoiceMessageBodyTextType = string;
export type VoiceId = string;
export type TagKey = string;
export type TwoWayChannelArn = string;
export type IamRoleArn = string;
export type VerificationCode = string;
export type TagValue = string;
export type LogGroupArn = string;
export type DeliveryStreamArn = string;
export type SnsTopicArn = string;
export type ConfigurationSetFilterName = string;
export type FilterValue = string;
export type KeywordFilterName = string;
export type OptedOutFilterName = string;
export type PhoneNumberFilterName = string;
export type PoolFilterName = string;
export type ProtectConfigurationFilterName = string;
export type RegistrationAttachmentFilterName = string;
export type RegistrationFilterName = string;
export type RegistrationTypeFilterName = string;
export type RegistrationVersionFilterName = string;
export type SenderIdFilterName = string;
export type VerifiedDestinationNumberFilterName = string;
export type PoolOriginationIdentitiesFilterName = string;
export type ProtectConfigurationRuleSetNumberOverrideFilterName = string;
export type RegistrationAssociationFilterName = string;
export type ContextKey = string;
export type ContextValue = string;
export type DestinationCountryParameterKey = string;
export type DestinationCountryParameterValue = string;
export type E164PhoneNumberType = string;
export type DialingCountryCodeType = string;
export type MCCType = string;
export type MNCType = string;
export type PhoneNumberType = string;
export type PoolStatus = string;
export type RegistrationStatus = string;
export type AttachmentStatus = string;
export type RegistrationVersionStatus = string;
export type VerificationStatus = string;
export type AccessDeniedExceptionReason = string;
export type AttachmentUploadErrorReason = string;
export type NumberStatus = string;
export type NumberType = string;
export type ProtectStatus = string;
export type AccountAttributeName = string;
export type AccountLimitName = string;
export type FieldType = string;
export type FieldRequirement = string;
export type SpendLimitName = string;
export type ConflictExceptionReason = string;
export type ResourceType = string;
export type ServiceQuotaExceededExceptionReason = string;
export type RegistrationAssociationBehavior = string;
export type RegistrationDisassociationBehavior = string;
export type ValidationExceptionReason = string;

//# Schemas
export interface DeleteAccountDefaultProtectConfigurationRequest {}
export const DeleteAccountDefaultProtectConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAccountDefaultProtectConfigurationRequest",
}) as any as S.Schema<DeleteAccountDefaultProtectConfigurationRequest>;
export interface DeleteMediaMessageSpendLimitOverrideRequest {}
export const DeleteMediaMessageSpendLimitOverrideRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteMediaMessageSpendLimitOverrideRequest",
}) as any as S.Schema<DeleteMediaMessageSpendLimitOverrideRequest>;
export interface DeleteTextMessageSpendLimitOverrideRequest {}
export const DeleteTextMessageSpendLimitOverrideRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTextMessageSpendLimitOverrideRequest",
}) as any as S.Schema<DeleteTextMessageSpendLimitOverrideRequest>;
export interface DeleteVoiceMessageSpendLimitOverrideRequest {}
export const DeleteVoiceMessageSpendLimitOverrideRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteVoiceMessageSpendLimitOverrideRequest",
}) as any as S.Schema<DeleteVoiceMessageSpendLimitOverrideRequest>;
export type EventTypeList = string[];
export const EventTypeList = S.Array(S.String);
export type ConfigurationSetNameList = string[];
export const ConfigurationSetNameList = S.Array(S.String);
export type KeywordList = string[];
export const KeywordList = S.Array(S.String);
export type OptedOutNumberList = string[];
export const OptedOutNumberList = S.Array(S.String);
export type OptOutListNameList = string[];
export const OptOutListNameList = S.Array(S.String);
export type PhoneNumberIdList = string[];
export const PhoneNumberIdList = S.Array(S.String);
export type PoolIdList = string[];
export const PoolIdList = S.Array(S.String);
export type ProtectConfigurationIdList = string[];
export const ProtectConfigurationIdList = S.Array(S.String);
export type RegistrationAttachmentIdList = string[];
export const RegistrationAttachmentIdList = S.Array(S.String);
export type FieldPathList = string[];
export const FieldPathList = S.Array(S.String);
export type RegistrationIdList = string[];
export const RegistrationIdList = S.Array(S.String);
export type SectionPathList = string[];
export const SectionPathList = S.Array(S.String);
export type RegistrationTypeList = string[];
export const RegistrationTypeList = S.Array(S.String);
export type RegistrationVersionNumberList = number[];
export const RegistrationVersionNumberList = S.Array(S.Number);
export type VerifiedDestinationNumberIdList = string[];
export const VerifiedDestinationNumberIdList = S.Array(S.String);
export type DestinationPhoneNumberList = string[];
export const DestinationPhoneNumberList = S.Array(S.String);
export type SelectChoiceList = string[];
export const SelectChoiceList = S.Array(S.String);
export type NumberCapabilityList = string[];
export const NumberCapabilityList = S.Array(S.String);
export type MessageTypeList = string[];
export const MessageTypeList = S.Array(S.String);
export type MediaUrlList = string[];
export const MediaUrlList = S.Array(S.String);
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type NonEmptyTagList = Tag[];
export const NonEmptyTagList = S.Array(Tag);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateOriginationIdentityRequest {
  PoolId: string;
  OriginationIdentity: string;
  IsoCountryCode: string;
  ClientToken?: string;
}
export const AssociateOriginationIdentityRequest = S.suspend(() =>
  S.Struct({
    PoolId: S.String,
    OriginationIdentity: S.String,
    IsoCountryCode: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateOriginationIdentityRequest",
}) as any as S.Schema<AssociateOriginationIdentityRequest>;
export interface AssociateProtectConfigurationRequest {
  ProtectConfigurationId: string;
  ConfigurationSetName: string;
}
export const AssociateProtectConfigurationRequest = S.suspend(() =>
  S.Struct({
    ProtectConfigurationId: S.String,
    ConfigurationSetName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateProtectConfigurationRequest",
}) as any as S.Schema<AssociateProtectConfigurationRequest>;
export interface CarrierLookupRequest {
  PhoneNumber: string;
}
export const CarrierLookupRequest = S.suspend(() =>
  S.Struct({ PhoneNumber: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CarrierLookupRequest",
}) as any as S.Schema<CarrierLookupRequest>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateOptOutListRequest {
  OptOutListName: string;
  Tags?: Tag[];
  ClientToken?: string;
}
export const CreateOptOutListRequest = S.suspend(() =>
  S.Struct({
    OptOutListName: S.String,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateOptOutListRequest",
}) as any as S.Schema<CreateOptOutListRequest>;
export interface CreatePoolRequest {
  OriginationIdentity: string;
  IsoCountryCode: string;
  MessageType: string;
  DeletionProtectionEnabled?: boolean;
  Tags?: Tag[];
  ClientToken?: string;
}
export const CreatePoolRequest = S.suspend(() =>
  S.Struct({
    OriginationIdentity: S.String,
    IsoCountryCode: S.String,
    MessageType: S.String,
    DeletionProtectionEnabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePoolRequest",
}) as any as S.Schema<CreatePoolRequest>;
export interface CreateProtectConfigurationRequest {
  ClientToken?: string;
  DeletionProtectionEnabled?: boolean;
  Tags?: Tag[];
}
export const CreateProtectConfigurationRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    DeletionProtectionEnabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProtectConfigurationRequest",
}) as any as S.Schema<CreateProtectConfigurationRequest>;
export interface CreateRegistrationRequest {
  RegistrationType: string;
  Tags?: Tag[];
  ClientToken?: string;
}
export const CreateRegistrationRequest = S.suspend(() =>
  S.Struct({
    RegistrationType: S.String,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRegistrationRequest",
}) as any as S.Schema<CreateRegistrationRequest>;
export interface CreateRegistrationAssociationRequest {
  RegistrationId: string;
  ResourceId: string;
}
export const CreateRegistrationAssociationRequest = S.suspend(() =>
  S.Struct({ RegistrationId: S.String, ResourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRegistrationAssociationRequest",
}) as any as S.Schema<CreateRegistrationAssociationRequest>;
export interface CreateRegistrationAttachmentRequest {
  AttachmentBody?: Uint8Array;
  AttachmentUrl?: string;
  Tags?: Tag[];
  ClientToken?: string;
}
export const CreateRegistrationAttachmentRequest = S.suspend(() =>
  S.Struct({
    AttachmentBody: S.optional(T.Blob),
    AttachmentUrl: S.optional(S.String),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRegistrationAttachmentRequest",
}) as any as S.Schema<CreateRegistrationAttachmentRequest>;
export interface CreateRegistrationVersionRequest {
  RegistrationId: string;
}
export const CreateRegistrationVersionRequest = S.suspend(() =>
  S.Struct({ RegistrationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRegistrationVersionRequest",
}) as any as S.Schema<CreateRegistrationVersionRequest>;
export interface CreateVerifiedDestinationNumberRequest {
  DestinationPhoneNumber: string;
  Tags?: Tag[];
  ClientToken?: string;
}
export const CreateVerifiedDestinationNumberRequest = S.suspend(() =>
  S.Struct({
    DestinationPhoneNumber: S.String,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateVerifiedDestinationNumberRequest",
}) as any as S.Schema<CreateVerifiedDestinationNumberRequest>;
export interface DeleteAccountDefaultProtectConfigurationResult {
  DefaultProtectConfigurationArn: string;
  DefaultProtectConfigurationId: string;
}
export const DeleteAccountDefaultProtectConfigurationResult = S.suspend(() =>
  S.Struct({
    DefaultProtectConfigurationArn: S.String,
    DefaultProtectConfigurationId: S.String,
  }),
).annotations({
  identifier: "DeleteAccountDefaultProtectConfigurationResult",
}) as any as S.Schema<DeleteAccountDefaultProtectConfigurationResult>;
export interface DeleteConfigurationSetRequest {
  ConfigurationSetName: string;
}
export const DeleteConfigurationSetRequest = S.suspend(() =>
  S.Struct({ ConfigurationSetName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteConfigurationSetRequest",
}) as any as S.Schema<DeleteConfigurationSetRequest>;
export interface DeleteDefaultMessageTypeRequest {
  ConfigurationSetName: string;
}
export const DeleteDefaultMessageTypeRequest = S.suspend(() =>
  S.Struct({ ConfigurationSetName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDefaultMessageTypeRequest",
}) as any as S.Schema<DeleteDefaultMessageTypeRequest>;
export interface DeleteDefaultSenderIdRequest {
  ConfigurationSetName: string;
}
export const DeleteDefaultSenderIdRequest = S.suspend(() =>
  S.Struct({ ConfigurationSetName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDefaultSenderIdRequest",
}) as any as S.Schema<DeleteDefaultSenderIdRequest>;
export interface DeleteEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestinationName: string;
}
export const DeleteEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    EventDestinationName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEventDestinationRequest",
}) as any as S.Schema<DeleteEventDestinationRequest>;
export interface DeleteKeywordRequest {
  OriginationIdentity: string;
  Keyword: string;
}
export const DeleteKeywordRequest = S.suspend(() =>
  S.Struct({ OriginationIdentity: S.String, Keyword: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteKeywordRequest",
}) as any as S.Schema<DeleteKeywordRequest>;
export interface DeleteMediaMessageSpendLimitOverrideResult {
  MonthlyLimit?: number;
}
export const DeleteMediaMessageSpendLimitOverrideResult = S.suspend(() =>
  S.Struct({ MonthlyLimit: S.optional(S.Number) }),
).annotations({
  identifier: "DeleteMediaMessageSpendLimitOverrideResult",
}) as any as S.Schema<DeleteMediaMessageSpendLimitOverrideResult>;
export interface DeleteOptedOutNumberRequest {
  OptOutListName: string;
  OptedOutNumber: string;
}
export const DeleteOptedOutNumberRequest = S.suspend(() =>
  S.Struct({ OptOutListName: S.String, OptedOutNumber: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteOptedOutNumberRequest",
}) as any as S.Schema<DeleteOptedOutNumberRequest>;
export interface DeleteOptOutListRequest {
  OptOutListName: string;
}
export const DeleteOptOutListRequest = S.suspend(() =>
  S.Struct({ OptOutListName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteOptOutListRequest",
}) as any as S.Schema<DeleteOptOutListRequest>;
export interface DeletePoolRequest {
  PoolId: string;
}
export const DeletePoolRequest = S.suspend(() =>
  S.Struct({ PoolId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePoolRequest",
}) as any as S.Schema<DeletePoolRequest>;
export interface DeleteProtectConfigurationRequest {
  ProtectConfigurationId: string;
}
export const DeleteProtectConfigurationRequest = S.suspend(() =>
  S.Struct({ ProtectConfigurationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProtectConfigurationRequest",
}) as any as S.Schema<DeleteProtectConfigurationRequest>;
export interface DeleteProtectConfigurationRuleSetNumberOverrideRequest {
  ProtectConfigurationId: string;
  DestinationPhoneNumber: string;
}
export const DeleteProtectConfigurationRuleSetNumberOverrideRequest = S.suspend(
  () =>
    S.Struct({
      ProtectConfigurationId: S.String,
      DestinationPhoneNumber: S.String,
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "DeleteProtectConfigurationRuleSetNumberOverrideRequest",
}) as any as S.Schema<DeleteProtectConfigurationRuleSetNumberOverrideRequest>;
export interface DeleteRegistrationRequest {
  RegistrationId: string;
}
export const DeleteRegistrationRequest = S.suspend(() =>
  S.Struct({ RegistrationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRegistrationRequest",
}) as any as S.Schema<DeleteRegistrationRequest>;
export interface DeleteRegistrationAttachmentRequest {
  RegistrationAttachmentId: string;
}
export const DeleteRegistrationAttachmentRequest = S.suspend(() =>
  S.Struct({ RegistrationAttachmentId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRegistrationAttachmentRequest",
}) as any as S.Schema<DeleteRegistrationAttachmentRequest>;
export interface DeleteRegistrationFieldValueRequest {
  RegistrationId: string;
  FieldPath: string;
}
export const DeleteRegistrationFieldValueRequest = S.suspend(() =>
  S.Struct({ RegistrationId: S.String, FieldPath: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRegistrationFieldValueRequest",
}) as any as S.Schema<DeleteRegistrationFieldValueRequest>;
export interface DeleteResourcePolicyRequest {
  ResourceArn: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteTextMessageSpendLimitOverrideResult {
  MonthlyLimit?: number;
}
export const DeleteTextMessageSpendLimitOverrideResult = S.suspend(() =>
  S.Struct({ MonthlyLimit: S.optional(S.Number) }),
).annotations({
  identifier: "DeleteTextMessageSpendLimitOverrideResult",
}) as any as S.Schema<DeleteTextMessageSpendLimitOverrideResult>;
export interface DeleteVerifiedDestinationNumberRequest {
  VerifiedDestinationNumberId: string;
}
export const DeleteVerifiedDestinationNumberRequest = S.suspend(() =>
  S.Struct({ VerifiedDestinationNumberId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteVerifiedDestinationNumberRequest",
}) as any as S.Schema<DeleteVerifiedDestinationNumberRequest>;
export interface DeleteVoiceMessageSpendLimitOverrideResult {
  MonthlyLimit?: number;
}
export const DeleteVoiceMessageSpendLimitOverrideResult = S.suspend(() =>
  S.Struct({ MonthlyLimit: S.optional(S.Number) }),
).annotations({
  identifier: "DeleteVoiceMessageSpendLimitOverrideResult",
}) as any as S.Schema<DeleteVoiceMessageSpendLimitOverrideResult>;
export interface DescribeAccountAttributesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeAccountAttributesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAccountAttributesRequest",
}) as any as S.Schema<DescribeAccountAttributesRequest>;
export interface DescribeAccountLimitsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeAccountLimitsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAccountLimitsRequest",
}) as any as S.Schema<DescribeAccountLimitsRequest>;
export interface DescribeOptOutListsRequest {
  OptOutListNames?: string[];
  NextToken?: string;
  MaxResults?: number;
  Owner?: string;
}
export const DescribeOptOutListsRequest = S.suspend(() =>
  S.Struct({
    OptOutListNames: S.optional(OptOutListNameList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Owner: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeOptOutListsRequest",
}) as any as S.Schema<DescribeOptOutListsRequest>;
export interface DescribeRegistrationFieldDefinitionsRequest {
  RegistrationType: string;
  SectionPath?: string;
  FieldPaths?: string[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeRegistrationFieldDefinitionsRequest = S.suspend(() =>
  S.Struct({
    RegistrationType: S.String,
    SectionPath: S.optional(S.String),
    FieldPaths: S.optional(FieldPathList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRegistrationFieldDefinitionsRequest",
}) as any as S.Schema<DescribeRegistrationFieldDefinitionsRequest>;
export interface DescribeRegistrationFieldValuesRequest {
  RegistrationId: string;
  VersionNumber?: number;
  SectionPath?: string;
  FieldPaths?: string[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeRegistrationFieldValuesRequest = S.suspend(() =>
  S.Struct({
    RegistrationId: S.String,
    VersionNumber: S.optional(S.Number),
    SectionPath: S.optional(S.String),
    FieldPaths: S.optional(FieldPathList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRegistrationFieldValuesRequest",
}) as any as S.Schema<DescribeRegistrationFieldValuesRequest>;
export interface DescribeRegistrationSectionDefinitionsRequest {
  RegistrationType: string;
  SectionPaths?: string[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeRegistrationSectionDefinitionsRequest = S.suspend(() =>
  S.Struct({
    RegistrationType: S.String,
    SectionPaths: S.optional(SectionPathList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRegistrationSectionDefinitionsRequest",
}) as any as S.Schema<DescribeRegistrationSectionDefinitionsRequest>;
export interface DescribeSpendLimitsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeSpendLimitsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSpendLimitsRequest",
}) as any as S.Schema<DescribeSpendLimitsRequest>;
export interface DisassociateOriginationIdentityRequest {
  PoolId: string;
  OriginationIdentity: string;
  IsoCountryCode: string;
  ClientToken?: string;
}
export const DisassociateOriginationIdentityRequest = S.suspend(() =>
  S.Struct({
    PoolId: S.String,
    OriginationIdentity: S.String,
    IsoCountryCode: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateOriginationIdentityRequest",
}) as any as S.Schema<DisassociateOriginationIdentityRequest>;
export interface DisassociateProtectConfigurationRequest {
  ProtectConfigurationId: string;
  ConfigurationSetName: string;
}
export const DisassociateProtectConfigurationRequest = S.suspend(() =>
  S.Struct({
    ProtectConfigurationId: S.String,
    ConfigurationSetName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateProtectConfigurationRequest",
}) as any as S.Schema<DisassociateProtectConfigurationRequest>;
export interface DiscardRegistrationVersionRequest {
  RegistrationId: string;
}
export const DiscardRegistrationVersionRequest = S.suspend(() =>
  S.Struct({ RegistrationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DiscardRegistrationVersionRequest",
}) as any as S.Schema<DiscardRegistrationVersionRequest>;
export interface GetProtectConfigurationCountryRuleSetRequest {
  ProtectConfigurationId: string;
  NumberCapability: string;
}
export const GetProtectConfigurationCountryRuleSetRequest = S.suspend(() =>
  S.Struct({
    ProtectConfigurationId: S.String,
    NumberCapability: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetProtectConfigurationCountryRuleSetRequest",
}) as any as S.Schema<GetProtectConfigurationCountryRuleSetRequest>;
export interface GetResourcePolicyRequest {
  ResourceArn: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface PutKeywordRequest {
  OriginationIdentity: string;
  Keyword: string;
  KeywordMessage: string;
  KeywordAction?: string;
}
export const PutKeywordRequest = S.suspend(() =>
  S.Struct({
    OriginationIdentity: S.String,
    Keyword: S.String,
    KeywordMessage: S.String,
    KeywordAction: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutKeywordRequest",
}) as any as S.Schema<PutKeywordRequest>;
export interface PutMessageFeedbackRequest {
  MessageId: string;
  MessageFeedbackStatus: string;
}
export const PutMessageFeedbackRequest = S.suspend(() =>
  S.Struct({ MessageId: S.String, MessageFeedbackStatus: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutMessageFeedbackRequest",
}) as any as S.Schema<PutMessageFeedbackRequest>;
export interface PutOptedOutNumberRequest {
  OptOutListName: string;
  OptedOutNumber: string;
}
export const PutOptedOutNumberRequest = S.suspend(() =>
  S.Struct({ OptOutListName: S.String, OptedOutNumber: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutOptedOutNumberRequest",
}) as any as S.Schema<PutOptedOutNumberRequest>;
export interface PutProtectConfigurationRuleSetNumberOverrideRequest {
  ClientToken?: string;
  ProtectConfigurationId: string;
  DestinationPhoneNumber: string;
  Action: string;
  ExpirationTimestamp?: Date;
}
export const PutProtectConfigurationRuleSetNumberOverrideRequest = S.suspend(
  () =>
    S.Struct({
      ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
      ProtectConfigurationId: S.String,
      DestinationPhoneNumber: S.String,
      Action: S.String,
      ExpirationTimestamp: S.optional(
        S.Date.pipe(T.TimestampFormat("epoch-seconds")),
      ),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "PutProtectConfigurationRuleSetNumberOverrideRequest",
}) as any as S.Schema<PutProtectConfigurationRuleSetNumberOverrideRequest>;
export interface PutRegistrationFieldValueRequest {
  RegistrationId: string;
  FieldPath: string;
  SelectChoices?: string[];
  TextValue?: string;
  RegistrationAttachmentId?: string;
}
export const PutRegistrationFieldValueRequest = S.suspend(() =>
  S.Struct({
    RegistrationId: S.String,
    FieldPath: S.String,
    SelectChoices: S.optional(SelectChoiceList),
    TextValue: S.optional(S.String),
    RegistrationAttachmentId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutRegistrationFieldValueRequest",
}) as any as S.Schema<PutRegistrationFieldValueRequest>;
export interface PutResourcePolicyRequest {
  ResourceArn: string;
  Policy: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Policy: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface ReleasePhoneNumberRequest {
  PhoneNumberId: string;
}
export const ReleasePhoneNumberRequest = S.suspend(() =>
  S.Struct({ PhoneNumberId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ReleasePhoneNumberRequest",
}) as any as S.Schema<ReleasePhoneNumberRequest>;
export interface ReleaseSenderIdRequest {
  SenderId: string;
  IsoCountryCode: string;
}
export const ReleaseSenderIdRequest = S.suspend(() =>
  S.Struct({ SenderId: S.String, IsoCountryCode: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ReleaseSenderIdRequest",
}) as any as S.Schema<ReleaseSenderIdRequest>;
export interface RequestPhoneNumberRequest {
  IsoCountryCode: string;
  MessageType: string;
  NumberCapabilities: string[];
  NumberType: string;
  OptOutListName?: string;
  PoolId?: string;
  RegistrationId?: string;
  InternationalSendingEnabled?: boolean;
  DeletionProtectionEnabled?: boolean;
  Tags?: Tag[];
  ClientToken?: string;
}
export const RequestPhoneNumberRequest = S.suspend(() =>
  S.Struct({
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
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RequestPhoneNumberRequest",
}) as any as S.Schema<RequestPhoneNumberRequest>;
export interface RequestSenderIdRequest {
  SenderId: string;
  IsoCountryCode: string;
  MessageTypes?: string[];
  DeletionProtectionEnabled?: boolean;
  Tags?: Tag[];
  ClientToken?: string;
}
export const RequestSenderIdRequest = S.suspend(() =>
  S.Struct({
    SenderId: S.String,
    IsoCountryCode: S.String,
    MessageTypes: S.optional(MessageTypeList),
    DeletionProtectionEnabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RequestSenderIdRequest",
}) as any as S.Schema<RequestSenderIdRequest>;
export type ContextMap = { [key: string]: string | undefined };
export const ContextMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface SendMediaMessageRequest {
  DestinationPhoneNumber: string;
  OriginationIdentity: string;
  MessageBody?: string;
  MediaUrls?: string[];
  ConfigurationSetName?: string;
  MaxPrice?: string;
  TimeToLive?: number;
  Context?: { [key: string]: string | undefined };
  DryRun?: boolean;
  ProtectConfigurationId?: string;
  MessageFeedbackEnabled?: boolean;
}
export const SendMediaMessageRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendMediaMessageRequest",
}) as any as S.Schema<SendMediaMessageRequest>;
export type DestinationCountryParameters = {
  [key: string]: string | undefined;
};
export const DestinationCountryParameters = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface SendTextMessageRequest {
  DestinationPhoneNumber: string;
  OriginationIdentity?: string;
  MessageBody?: string;
  MessageType?: string;
  Keyword?: string;
  ConfigurationSetName?: string;
  MaxPrice?: string;
  TimeToLive?: number;
  Context?: { [key: string]: string | undefined };
  DestinationCountryParameters?: { [key: string]: string | undefined };
  DryRun?: boolean;
  ProtectConfigurationId?: string;
  MessageFeedbackEnabled?: boolean;
}
export const SendTextMessageRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendTextMessageRequest",
}) as any as S.Schema<SendTextMessageRequest>;
export interface SendVoiceMessageRequest {
  DestinationPhoneNumber: string;
  OriginationIdentity: string;
  MessageBody?: string;
  MessageBodyTextType?: string;
  VoiceId?: string;
  ConfigurationSetName?: string;
  MaxPricePerMinute?: string;
  TimeToLive?: number;
  Context?: { [key: string]: string | undefined };
  DryRun?: boolean;
  ProtectConfigurationId?: string;
  MessageFeedbackEnabled?: boolean;
}
export const SendVoiceMessageRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendVoiceMessageRequest",
}) as any as S.Schema<SendVoiceMessageRequest>;
export interface SetAccountDefaultProtectConfigurationRequest {
  ProtectConfigurationId: string;
}
export const SetAccountDefaultProtectConfigurationRequest = S.suspend(() =>
  S.Struct({ ProtectConfigurationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SetAccountDefaultProtectConfigurationRequest",
}) as any as S.Schema<SetAccountDefaultProtectConfigurationRequest>;
export interface SetDefaultMessageFeedbackEnabledRequest {
  ConfigurationSetName: string;
  MessageFeedbackEnabled: boolean;
}
export const SetDefaultMessageFeedbackEnabledRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    MessageFeedbackEnabled: S.Boolean,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SetDefaultMessageFeedbackEnabledRequest",
}) as any as S.Schema<SetDefaultMessageFeedbackEnabledRequest>;
export interface SetDefaultMessageTypeRequest {
  ConfigurationSetName: string;
  MessageType: string;
}
export const SetDefaultMessageTypeRequest = S.suspend(() =>
  S.Struct({ ConfigurationSetName: S.String, MessageType: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SetDefaultMessageTypeRequest",
}) as any as S.Schema<SetDefaultMessageTypeRequest>;
export interface SetDefaultSenderIdRequest {
  ConfigurationSetName: string;
  SenderId: string;
}
export const SetDefaultSenderIdRequest = S.suspend(() =>
  S.Struct({ ConfigurationSetName: S.String, SenderId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SetDefaultSenderIdRequest",
}) as any as S.Schema<SetDefaultSenderIdRequest>;
export interface SetMediaMessageSpendLimitOverrideRequest {
  MonthlyLimit: number;
}
export const SetMediaMessageSpendLimitOverrideRequest = S.suspend(() =>
  S.Struct({ MonthlyLimit: S.Number }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SetMediaMessageSpendLimitOverrideRequest",
}) as any as S.Schema<SetMediaMessageSpendLimitOverrideRequest>;
export interface SetTextMessageSpendLimitOverrideRequest {
  MonthlyLimit: number;
}
export const SetTextMessageSpendLimitOverrideRequest = S.suspend(() =>
  S.Struct({ MonthlyLimit: S.Number }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SetTextMessageSpendLimitOverrideRequest",
}) as any as S.Schema<SetTextMessageSpendLimitOverrideRequest>;
export interface SetVoiceMessageSpendLimitOverrideRequest {
  MonthlyLimit: number;
}
export const SetVoiceMessageSpendLimitOverrideRequest = S.suspend(() =>
  S.Struct({ MonthlyLimit: S.Number }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SetVoiceMessageSpendLimitOverrideRequest",
}) as any as S.Schema<SetVoiceMessageSpendLimitOverrideRequest>;
export interface SubmitRegistrationVersionRequest {
  RegistrationId: string;
  AwsReview?: boolean;
}
export const SubmitRegistrationVersionRequest = S.suspend(() =>
  S.Struct({ RegistrationId: S.String, AwsReview: S.optional(S.Boolean) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SubmitRegistrationVersionRequest",
}) as any as S.Schema<SubmitRegistrationVersionRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: NonEmptyTagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResult {}
export const TagResourceResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResult",
}) as any as S.Schema<TagResourceResult>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResult {}
export const UntagResourceResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResult",
}) as any as S.Schema<UntagResourceResult>;
export interface CloudWatchLogsDestination {
  IamRoleArn: string;
  LogGroupArn: string;
}
export const CloudWatchLogsDestination = S.suspend(() =>
  S.Struct({ IamRoleArn: S.String, LogGroupArn: S.String }),
).annotations({
  identifier: "CloudWatchLogsDestination",
}) as any as S.Schema<CloudWatchLogsDestination>;
export interface KinesisFirehoseDestination {
  IamRoleArn: string;
  DeliveryStreamArn: string;
}
export const KinesisFirehoseDestination = S.suspend(() =>
  S.Struct({ IamRoleArn: S.String, DeliveryStreamArn: S.String }),
).annotations({
  identifier: "KinesisFirehoseDestination",
}) as any as S.Schema<KinesisFirehoseDestination>;
export interface SnsDestination {
  TopicArn: string;
}
export const SnsDestination = S.suspend(() =>
  S.Struct({ TopicArn: S.String }),
).annotations({
  identifier: "SnsDestination",
}) as any as S.Schema<SnsDestination>;
export interface UpdateEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestinationName: string;
  Enabled?: boolean;
  MatchingEventTypes?: string[];
  CloudWatchLogsDestination?: CloudWatchLogsDestination;
  KinesisFirehoseDestination?: KinesisFirehoseDestination;
  SnsDestination?: SnsDestination;
}
export const UpdateEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    EventDestinationName: S.String,
    Enabled: S.optional(S.Boolean),
    MatchingEventTypes: S.optional(EventTypeList),
    CloudWatchLogsDestination: S.optional(CloudWatchLogsDestination),
    KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
    SnsDestination: S.optional(SnsDestination),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEventDestinationRequest",
}) as any as S.Schema<UpdateEventDestinationRequest>;
export interface UpdatePhoneNumberRequest {
  PhoneNumberId: string;
  TwoWayEnabled?: boolean;
  TwoWayChannelArn?: string;
  TwoWayChannelRole?: string;
  SelfManagedOptOutsEnabled?: boolean;
  OptOutListName?: string;
  InternationalSendingEnabled?: boolean;
  DeletionProtectionEnabled?: boolean;
}
export const UpdatePhoneNumberRequest = S.suspend(() =>
  S.Struct({
    PhoneNumberId: S.String,
    TwoWayEnabled: S.optional(S.Boolean),
    TwoWayChannelArn: S.optional(S.String),
    TwoWayChannelRole: S.optional(S.String),
    SelfManagedOptOutsEnabled: S.optional(S.Boolean),
    OptOutListName: S.optional(S.String),
    InternationalSendingEnabled: S.optional(S.Boolean),
    DeletionProtectionEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePhoneNumberRequest",
}) as any as S.Schema<UpdatePhoneNumberRequest>;
export interface UpdatePoolRequest {
  PoolId: string;
  TwoWayEnabled?: boolean;
  TwoWayChannelArn?: string;
  TwoWayChannelRole?: string;
  SelfManagedOptOutsEnabled?: boolean;
  OptOutListName?: string;
  SharedRoutesEnabled?: boolean;
  DeletionProtectionEnabled?: boolean;
}
export const UpdatePoolRequest = S.suspend(() =>
  S.Struct({
    PoolId: S.String,
    TwoWayEnabled: S.optional(S.Boolean),
    TwoWayChannelArn: S.optional(S.String),
    TwoWayChannelRole: S.optional(S.String),
    SelfManagedOptOutsEnabled: S.optional(S.Boolean),
    OptOutListName: S.optional(S.String),
    SharedRoutesEnabled: S.optional(S.Boolean),
    DeletionProtectionEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePoolRequest",
}) as any as S.Schema<UpdatePoolRequest>;
export interface UpdateProtectConfigurationRequest {
  ProtectConfigurationId: string;
  DeletionProtectionEnabled?: boolean;
}
export const UpdateProtectConfigurationRequest = S.suspend(() =>
  S.Struct({
    ProtectConfigurationId: S.String,
    DeletionProtectionEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProtectConfigurationRequest",
}) as any as S.Schema<UpdateProtectConfigurationRequest>;
export interface UpdateSenderIdRequest {
  SenderId: string;
  IsoCountryCode: string;
  DeletionProtectionEnabled?: boolean;
}
export const UpdateSenderIdRequest = S.suspend(() =>
  S.Struct({
    SenderId: S.String,
    IsoCountryCode: S.String,
    DeletionProtectionEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSenderIdRequest",
}) as any as S.Schema<UpdateSenderIdRequest>;
export interface VerifyDestinationNumberRequest {
  VerifiedDestinationNumberId: string;
  VerificationCode: string;
}
export const VerifyDestinationNumberRequest = S.suspend(() =>
  S.Struct({
    VerifiedDestinationNumberId: S.String,
    VerificationCode: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "VerifyDestinationNumberRequest",
}) as any as S.Schema<VerifyDestinationNumberRequest>;
export type FilterValueList = string[];
export const FilterValueList = S.Array(S.String);
export interface ConfigurationSetFilter {
  Name: string;
  Values: string[];
}
export const ConfigurationSetFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "ConfigurationSetFilter",
}) as any as S.Schema<ConfigurationSetFilter>;
export type ConfigurationSetFilterList = ConfigurationSetFilter[];
export const ConfigurationSetFilterList = S.Array(ConfigurationSetFilter);
export interface KeywordFilter {
  Name: string;
  Values: string[];
}
export const KeywordFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "KeywordFilter",
}) as any as S.Schema<KeywordFilter>;
export type KeywordFilterList = KeywordFilter[];
export const KeywordFilterList = S.Array(KeywordFilter);
export interface OptedOutFilter {
  Name: string;
  Values: string[];
}
export const OptedOutFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "OptedOutFilter",
}) as any as S.Schema<OptedOutFilter>;
export type OptedOutFilterList = OptedOutFilter[];
export const OptedOutFilterList = S.Array(OptedOutFilter);
export interface PhoneNumberFilter {
  Name: string;
  Values: string[];
}
export const PhoneNumberFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "PhoneNumberFilter",
}) as any as S.Schema<PhoneNumberFilter>;
export type PhoneNumberFilterList = PhoneNumberFilter[];
export const PhoneNumberFilterList = S.Array(PhoneNumberFilter);
export interface PoolFilter {
  Name: string;
  Values: string[];
}
export const PoolFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({ identifier: "PoolFilter" }) as any as S.Schema<PoolFilter>;
export type PoolFilterList = PoolFilter[];
export const PoolFilterList = S.Array(PoolFilter);
export interface ProtectConfigurationFilter {
  Name: string;
  Values: string[];
}
export const ProtectConfigurationFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "ProtectConfigurationFilter",
}) as any as S.Schema<ProtectConfigurationFilter>;
export type ProtectConfigurationFilterList = ProtectConfigurationFilter[];
export const ProtectConfigurationFilterList = S.Array(
  ProtectConfigurationFilter,
);
export interface RegistrationAttachmentFilter {
  Name: string;
  Values: string[];
}
export const RegistrationAttachmentFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "RegistrationAttachmentFilter",
}) as any as S.Schema<RegistrationAttachmentFilter>;
export type RegistrationAttachmentFilterList = RegistrationAttachmentFilter[];
export const RegistrationAttachmentFilterList = S.Array(
  RegistrationAttachmentFilter,
);
export interface RegistrationFilter {
  Name: string;
  Values: string[];
}
export const RegistrationFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "RegistrationFilter",
}) as any as S.Schema<RegistrationFilter>;
export type RegistrationFilterList = RegistrationFilter[];
export const RegistrationFilterList = S.Array(RegistrationFilter);
export interface RegistrationTypeFilter {
  Name: string;
  Values: string[];
}
export const RegistrationTypeFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "RegistrationTypeFilter",
}) as any as S.Schema<RegistrationTypeFilter>;
export type RegistrationTypeFilterList = RegistrationTypeFilter[];
export const RegistrationTypeFilterList = S.Array(RegistrationTypeFilter);
export interface RegistrationVersionFilter {
  Name: string;
  Values: string[];
}
export const RegistrationVersionFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "RegistrationVersionFilter",
}) as any as S.Schema<RegistrationVersionFilter>;
export type RegistrationVersionFilterList = RegistrationVersionFilter[];
export const RegistrationVersionFilterList = S.Array(RegistrationVersionFilter);
export interface SenderIdAndCountry {
  SenderId: string;
  IsoCountryCode: string;
}
export const SenderIdAndCountry = S.suspend(() =>
  S.Struct({ SenderId: S.String, IsoCountryCode: S.String }),
).annotations({
  identifier: "SenderIdAndCountry",
}) as any as S.Schema<SenderIdAndCountry>;
export type SenderIdList = SenderIdAndCountry[];
export const SenderIdList = S.Array(SenderIdAndCountry);
export interface SenderIdFilter {
  Name: string;
  Values: string[];
}
export const SenderIdFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "SenderIdFilter",
}) as any as S.Schema<SenderIdFilter>;
export type SenderIdFilterList = SenderIdFilter[];
export const SenderIdFilterList = S.Array(SenderIdFilter);
export interface VerifiedDestinationNumberFilter {
  Name: string;
  Values: string[];
}
export const VerifiedDestinationNumberFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "VerifiedDestinationNumberFilter",
}) as any as S.Schema<VerifiedDestinationNumberFilter>;
export type VerifiedDestinationNumberFilterList =
  VerifiedDestinationNumberFilter[];
export const VerifiedDestinationNumberFilterList = S.Array(
  VerifiedDestinationNumberFilter,
);
export interface PoolOriginationIdentitiesFilter {
  Name: string;
  Values: string[];
}
export const PoolOriginationIdentitiesFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "PoolOriginationIdentitiesFilter",
}) as any as S.Schema<PoolOriginationIdentitiesFilter>;
export type PoolOriginationIdentitiesFilterList =
  PoolOriginationIdentitiesFilter[];
export const PoolOriginationIdentitiesFilterList = S.Array(
  PoolOriginationIdentitiesFilter,
);
export interface ProtectConfigurationRuleSetNumberOverrideFilterItem {
  Name: string;
  Values: string[];
}
export const ProtectConfigurationRuleSetNumberOverrideFilterItem = S.suspend(
  () => S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "ProtectConfigurationRuleSetNumberOverrideFilterItem",
}) as any as S.Schema<ProtectConfigurationRuleSetNumberOverrideFilterItem>;
export type ListProtectConfigurationRuleSetNumberOverrideFilter =
  ProtectConfigurationRuleSetNumberOverrideFilterItem[];
export const ListProtectConfigurationRuleSetNumberOverrideFilter = S.Array(
  ProtectConfigurationRuleSetNumberOverrideFilterItem,
);
export interface RegistrationAssociationFilter {
  Name: string;
  Values: string[];
}
export const RegistrationAssociationFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({
  identifier: "RegistrationAssociationFilter",
}) as any as S.Schema<RegistrationAssociationFilter>;
export type RegistrationAssociationFilterList = RegistrationAssociationFilter[];
export const RegistrationAssociationFilterList = S.Array(
  RegistrationAssociationFilter,
);
export interface AssociateOriginationIdentityResult {
  PoolArn?: string;
  PoolId?: string;
  OriginationIdentityArn?: string;
  OriginationIdentity?: string;
  IsoCountryCode?: string;
}
export const AssociateOriginationIdentityResult = S.suspend(() =>
  S.Struct({
    PoolArn: S.optional(S.String),
    PoolId: S.optional(S.String),
    OriginationIdentityArn: S.optional(S.String),
    OriginationIdentity: S.optional(S.String),
    IsoCountryCode: S.optional(S.String),
  }),
).annotations({
  identifier: "AssociateOriginationIdentityResult",
}) as any as S.Schema<AssociateOriginationIdentityResult>;
export interface AssociateProtectConfigurationResult {
  ConfigurationSetArn: string;
  ConfigurationSetName: string;
  ProtectConfigurationArn: string;
  ProtectConfigurationId: string;
}
export const AssociateProtectConfigurationResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.String,
    ConfigurationSetName: S.String,
    ProtectConfigurationArn: S.String,
    ProtectConfigurationId: S.String,
  }),
).annotations({
  identifier: "AssociateProtectConfigurationResult",
}) as any as S.Schema<AssociateProtectConfigurationResult>;
export interface CarrierLookupResult {
  E164PhoneNumber: string;
  DialingCountryCode?: string;
  IsoCountryCode?: string;
  Country?: string;
  MCC?: string;
  MNC?: string;
  Carrier?: string;
  PhoneNumberType: string;
}
export const CarrierLookupResult = S.suspend(() =>
  S.Struct({
    E164PhoneNumber: S.String,
    DialingCountryCode: S.optional(S.String),
    IsoCountryCode: S.optional(S.String),
    Country: S.optional(S.String),
    MCC: S.optional(S.String),
    MNC: S.optional(S.String),
    Carrier: S.optional(S.String),
    PhoneNumberType: S.String,
  }),
).annotations({
  identifier: "CarrierLookupResult",
}) as any as S.Schema<CarrierLookupResult>;
export interface CreateConfigurationSetRequest {
  ConfigurationSetName: string;
  Tags?: Tag[];
  ClientToken?: string;
}
export const CreateConfigurationSetRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateConfigurationSetRequest",
}) as any as S.Schema<CreateConfigurationSetRequest>;
export interface CreateEventDestinationRequest {
  ConfigurationSetName: string;
  EventDestinationName: string;
  MatchingEventTypes: string[];
  CloudWatchLogsDestination?: CloudWatchLogsDestination;
  KinesisFirehoseDestination?: KinesisFirehoseDestination;
  SnsDestination?: SnsDestination;
  ClientToken?: string;
}
export const CreateEventDestinationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetName: S.String,
    EventDestinationName: S.String,
    MatchingEventTypes: EventTypeList,
    CloudWatchLogsDestination: S.optional(CloudWatchLogsDestination),
    KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
    SnsDestination: S.optional(SnsDestination),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEventDestinationRequest",
}) as any as S.Schema<CreateEventDestinationRequest>;
export interface CreateOptOutListResult {
  OptOutListArn?: string;
  OptOutListName?: string;
  Tags?: Tag[];
  CreatedTimestamp?: Date;
}
export const CreateOptOutListResult = S.suspend(() =>
  S.Struct({
    OptOutListArn: S.optional(S.String),
    OptOutListName: S.optional(S.String),
    Tags: S.optional(TagList),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreateOptOutListResult",
}) as any as S.Schema<CreateOptOutListResult>;
export interface CreatePoolResult {
  PoolArn?: string;
  PoolId?: string;
  Status?: string;
  MessageType?: string;
  TwoWayEnabled?: boolean;
  TwoWayChannelArn?: string;
  TwoWayChannelRole?: string;
  SelfManagedOptOutsEnabled?: boolean;
  OptOutListName?: string;
  SharedRoutesEnabled?: boolean;
  DeletionProtectionEnabled?: boolean;
  Tags?: Tag[];
  CreatedTimestamp?: Date;
}
export const CreatePoolResult = S.suspend(() =>
  S.Struct({
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
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreatePoolResult",
}) as any as S.Schema<CreatePoolResult>;
export interface CreateProtectConfigurationResult {
  ProtectConfigurationArn: string;
  ProtectConfigurationId: string;
  CreatedTimestamp: Date;
  AccountDefault: boolean;
  DeletionProtectionEnabled: boolean;
  Tags?: Tag[];
}
export const CreateProtectConfigurationResult = S.suspend(() =>
  S.Struct({
    ProtectConfigurationArn: S.String,
    ProtectConfigurationId: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    AccountDefault: S.Boolean,
    DeletionProtectionEnabled: S.Boolean,
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "CreateProtectConfigurationResult",
}) as any as S.Schema<CreateProtectConfigurationResult>;
export interface CreateRegistrationAssociationResult {
  RegistrationArn: string;
  RegistrationId: string;
  RegistrationType: string;
  ResourceArn: string;
  ResourceId: string;
  ResourceType: string;
  IsoCountryCode?: string;
  PhoneNumber?: string;
}
export const CreateRegistrationAssociationResult = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    RegistrationType: S.String,
    ResourceArn: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    IsoCountryCode: S.optional(S.String),
    PhoneNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateRegistrationAssociationResult",
}) as any as S.Schema<CreateRegistrationAssociationResult>;
export interface CreateRegistrationAttachmentResult {
  RegistrationAttachmentArn: string;
  RegistrationAttachmentId: string;
  AttachmentStatus: string;
  Tags?: Tag[];
  CreatedTimestamp: Date;
}
export const CreateRegistrationAttachmentResult = S.suspend(() =>
  S.Struct({
    RegistrationAttachmentArn: S.String,
    RegistrationAttachmentId: S.String,
    AttachmentStatus: S.String,
    Tags: S.optional(TagList),
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "CreateRegistrationAttachmentResult",
}) as any as S.Schema<CreateRegistrationAttachmentResult>;
export interface CreateVerifiedDestinationNumberResult {
  VerifiedDestinationNumberArn: string;
  VerifiedDestinationNumberId: string;
  DestinationPhoneNumber: string;
  Status: string;
  Tags?: Tag[];
  CreatedTimestamp: Date;
}
export const CreateVerifiedDestinationNumberResult = S.suspend(() =>
  S.Struct({
    VerifiedDestinationNumberArn: S.String,
    VerifiedDestinationNumberId: S.String,
    DestinationPhoneNumber: S.String,
    Status: S.String,
    Tags: S.optional(TagList),
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "CreateVerifiedDestinationNumberResult",
}) as any as S.Schema<CreateVerifiedDestinationNumberResult>;
export interface DeleteDefaultMessageTypeResult {
  ConfigurationSetArn?: string;
  ConfigurationSetName?: string;
  MessageType?: string;
}
export const DeleteDefaultMessageTypeResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    MessageType: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteDefaultMessageTypeResult",
}) as any as S.Schema<DeleteDefaultMessageTypeResult>;
export interface DeleteDefaultSenderIdResult {
  ConfigurationSetArn?: string;
  ConfigurationSetName?: string;
  SenderId?: string;
}
export const DeleteDefaultSenderIdResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    SenderId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteDefaultSenderIdResult",
}) as any as S.Schema<DeleteDefaultSenderIdResult>;
export interface EventDestination {
  EventDestinationName: string;
  Enabled: boolean;
  MatchingEventTypes: string[];
  CloudWatchLogsDestination?: CloudWatchLogsDestination;
  KinesisFirehoseDestination?: KinesisFirehoseDestination;
  SnsDestination?: SnsDestination;
}
export const EventDestination = S.suspend(() =>
  S.Struct({
    EventDestinationName: S.String,
    Enabled: S.Boolean,
    MatchingEventTypes: EventTypeList,
    CloudWatchLogsDestination: S.optional(CloudWatchLogsDestination),
    KinesisFirehoseDestination: S.optional(KinesisFirehoseDestination),
    SnsDestination: S.optional(SnsDestination),
  }),
).annotations({
  identifier: "EventDestination",
}) as any as S.Schema<EventDestination>;
export interface DeleteEventDestinationResult {
  ConfigurationSetArn?: string;
  ConfigurationSetName?: string;
  EventDestination?: EventDestination;
}
export const DeleteEventDestinationResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    EventDestination: S.optional(EventDestination),
  }),
).annotations({
  identifier: "DeleteEventDestinationResult",
}) as any as S.Schema<DeleteEventDestinationResult>;
export interface DeleteKeywordResult {
  OriginationIdentityArn?: string;
  OriginationIdentity?: string;
  Keyword?: string;
  KeywordMessage?: string;
  KeywordAction?: string;
}
export const DeleteKeywordResult = S.suspend(() =>
  S.Struct({
    OriginationIdentityArn: S.optional(S.String),
    OriginationIdentity: S.optional(S.String),
    Keyword: S.optional(S.String),
    KeywordMessage: S.optional(S.String),
    KeywordAction: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteKeywordResult",
}) as any as S.Schema<DeleteKeywordResult>;
export interface DeleteOptedOutNumberResult {
  OptOutListArn?: string;
  OptOutListName?: string;
  OptedOutNumber?: string;
  OptedOutTimestamp?: Date;
  EndUserOptedOut?: boolean;
}
export const DeleteOptedOutNumberResult = S.suspend(() =>
  S.Struct({
    OptOutListArn: S.optional(S.String),
    OptOutListName: S.optional(S.String),
    OptedOutNumber: S.optional(S.String),
    OptedOutTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EndUserOptedOut: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DeleteOptedOutNumberResult",
}) as any as S.Schema<DeleteOptedOutNumberResult>;
export interface DeleteOptOutListResult {
  OptOutListArn?: string;
  OptOutListName?: string;
  CreatedTimestamp?: Date;
}
export const DeleteOptOutListResult = S.suspend(() =>
  S.Struct({
    OptOutListArn: S.optional(S.String),
    OptOutListName: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DeleteOptOutListResult",
}) as any as S.Schema<DeleteOptOutListResult>;
export interface DeletePoolResult {
  PoolArn?: string;
  PoolId?: string;
  Status?: string;
  MessageType?: string;
  TwoWayEnabled?: boolean;
  TwoWayChannelArn?: string;
  TwoWayChannelRole?: string;
  SelfManagedOptOutsEnabled?: boolean;
  OptOutListName?: string;
  SharedRoutesEnabled?: boolean;
  CreatedTimestamp?: Date;
}
export const DeletePoolResult = S.suspend(() =>
  S.Struct({
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
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DeletePoolResult",
}) as any as S.Schema<DeletePoolResult>;
export interface DeleteProtectConfigurationResult {
  ProtectConfigurationArn: string;
  ProtectConfigurationId: string;
  CreatedTimestamp: Date;
  AccountDefault: boolean;
  DeletionProtectionEnabled: boolean;
}
export const DeleteProtectConfigurationResult = S.suspend(() =>
  S.Struct({
    ProtectConfigurationArn: S.String,
    ProtectConfigurationId: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    AccountDefault: S.Boolean,
    DeletionProtectionEnabled: S.Boolean,
  }),
).annotations({
  identifier: "DeleteProtectConfigurationResult",
}) as any as S.Schema<DeleteProtectConfigurationResult>;
export interface DeleteProtectConfigurationRuleSetNumberOverrideResult {
  ProtectConfigurationArn: string;
  ProtectConfigurationId: string;
  DestinationPhoneNumber: string;
  CreatedTimestamp: Date;
  Action: string;
  IsoCountryCode?: string;
  ExpirationTimestamp?: Date;
}
export const DeleteProtectConfigurationRuleSetNumberOverrideResult = S.suspend(
  () =>
    S.Struct({
      ProtectConfigurationArn: S.String,
      ProtectConfigurationId: S.String,
      DestinationPhoneNumber: S.String,
      CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
      Action: S.String,
      IsoCountryCode: S.optional(S.String),
      ExpirationTimestamp: S.optional(
        S.Date.pipe(T.TimestampFormat("epoch-seconds")),
      ),
    }),
).annotations({
  identifier: "DeleteProtectConfigurationRuleSetNumberOverrideResult",
}) as any as S.Schema<DeleteProtectConfigurationRuleSetNumberOverrideResult>;
export type StringMap = { [key: string]: string | undefined };
export const StringMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface DeleteRegistrationResult {
  RegistrationArn: string;
  RegistrationId: string;
  RegistrationType: string;
  RegistrationStatus: string;
  CurrentVersionNumber: number;
  ApprovedVersionNumber?: number;
  LatestDeniedVersionNumber?: number;
  AdditionalAttributes?: { [key: string]: string | undefined };
  CreatedTimestamp: Date;
}
export const DeleteRegistrationResult = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    RegistrationType: S.String,
    RegistrationStatus: S.String,
    CurrentVersionNumber: S.Number,
    ApprovedVersionNumber: S.optional(S.Number),
    LatestDeniedVersionNumber: S.optional(S.Number),
    AdditionalAttributes: S.optional(StringMap),
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DeleteRegistrationResult",
}) as any as S.Schema<DeleteRegistrationResult>;
export interface DeleteRegistrationAttachmentResult {
  RegistrationAttachmentArn: string;
  RegistrationAttachmentId: string;
  AttachmentStatus: string;
  AttachmentUploadErrorReason?: string;
  CreatedTimestamp: Date;
}
export const DeleteRegistrationAttachmentResult = S.suspend(() =>
  S.Struct({
    RegistrationAttachmentArn: S.String,
    RegistrationAttachmentId: S.String,
    AttachmentStatus: S.String,
    AttachmentUploadErrorReason: S.optional(S.String),
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DeleteRegistrationAttachmentResult",
}) as any as S.Schema<DeleteRegistrationAttachmentResult>;
export interface DeleteRegistrationFieldValueResult {
  RegistrationArn: string;
  RegistrationId: string;
  VersionNumber: number;
  FieldPath: string;
  SelectChoices?: string[];
  TextValue?: string;
  RegistrationAttachmentId?: string;
}
export const DeleteRegistrationFieldValueResult = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    VersionNumber: S.Number,
    FieldPath: S.String,
    SelectChoices: S.optional(SelectChoiceList),
    TextValue: S.optional(S.String),
    RegistrationAttachmentId: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteRegistrationFieldValueResult",
}) as any as S.Schema<DeleteRegistrationFieldValueResult>;
export interface DeleteResourcePolicyResult {
  ResourceArn?: string;
  Policy?: string;
  CreatedTimestamp?: Date;
}
export const DeleteResourcePolicyResult = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    Policy: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DeleteResourcePolicyResult",
}) as any as S.Schema<DeleteResourcePolicyResult>;
export interface DeleteVerifiedDestinationNumberResult {
  VerifiedDestinationNumberArn: string;
  VerifiedDestinationNumberId: string;
  DestinationPhoneNumber: string;
  CreatedTimestamp: Date;
}
export const DeleteVerifiedDestinationNumberResult = S.suspend(() =>
  S.Struct({
    VerifiedDestinationNumberArn: S.String,
    VerifiedDestinationNumberId: S.String,
    DestinationPhoneNumber: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "DeleteVerifiedDestinationNumberResult",
}) as any as S.Schema<DeleteVerifiedDestinationNumberResult>;
export interface DescribeConfigurationSetsRequest {
  ConfigurationSetNames?: string[];
  Filters?: ConfigurationSetFilter[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeConfigurationSetsRequest = S.suspend(() =>
  S.Struct({
    ConfigurationSetNames: S.optional(ConfigurationSetNameList),
    Filters: S.optional(ConfigurationSetFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeConfigurationSetsRequest",
}) as any as S.Schema<DescribeConfigurationSetsRequest>;
export interface DescribeKeywordsRequest {
  OriginationIdentity: string;
  Keywords?: string[];
  Filters?: KeywordFilter[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeKeywordsRequest = S.suspend(() =>
  S.Struct({
    OriginationIdentity: S.String,
    Keywords: S.optional(KeywordList),
    Filters: S.optional(KeywordFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeKeywordsRequest",
}) as any as S.Schema<DescribeKeywordsRequest>;
export interface DescribeOptedOutNumbersRequest {
  OptOutListName: string;
  OptedOutNumbers?: string[];
  Filters?: OptedOutFilter[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeOptedOutNumbersRequest = S.suspend(() =>
  S.Struct({
    OptOutListName: S.String,
    OptedOutNumbers: S.optional(OptedOutNumberList),
    Filters: S.optional(OptedOutFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeOptedOutNumbersRequest",
}) as any as S.Schema<DescribeOptedOutNumbersRequest>;
export interface DescribePhoneNumbersRequest {
  PhoneNumberIds?: string[];
  Filters?: PhoneNumberFilter[];
  NextToken?: string;
  MaxResults?: number;
  Owner?: string;
}
export const DescribePhoneNumbersRequest = S.suspend(() =>
  S.Struct({
    PhoneNumberIds: S.optional(PhoneNumberIdList),
    Filters: S.optional(PhoneNumberFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Owner: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribePhoneNumbersRequest",
}) as any as S.Schema<DescribePhoneNumbersRequest>;
export interface DescribePoolsRequest {
  PoolIds?: string[];
  Filters?: PoolFilter[];
  NextToken?: string;
  MaxResults?: number;
  Owner?: string;
}
export const DescribePoolsRequest = S.suspend(() =>
  S.Struct({
    PoolIds: S.optional(PoolIdList),
    Filters: S.optional(PoolFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Owner: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribePoolsRequest",
}) as any as S.Schema<DescribePoolsRequest>;
export interface DescribeProtectConfigurationsRequest {
  ProtectConfigurationIds?: string[];
  Filters?: ProtectConfigurationFilter[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeProtectConfigurationsRequest = S.suspend(() =>
  S.Struct({
    ProtectConfigurationIds: S.optional(ProtectConfigurationIdList),
    Filters: S.optional(ProtectConfigurationFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProtectConfigurationsRequest",
}) as any as S.Schema<DescribeProtectConfigurationsRequest>;
export interface DescribeRegistrationAttachmentsRequest {
  RegistrationAttachmentIds?: string[];
  Filters?: RegistrationAttachmentFilter[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeRegistrationAttachmentsRequest = S.suspend(() =>
  S.Struct({
    RegistrationAttachmentIds: S.optional(RegistrationAttachmentIdList),
    Filters: S.optional(RegistrationAttachmentFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRegistrationAttachmentsRequest",
}) as any as S.Schema<DescribeRegistrationAttachmentsRequest>;
export interface DescribeRegistrationsRequest {
  RegistrationIds?: string[];
  Filters?: RegistrationFilter[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeRegistrationsRequest = S.suspend(() =>
  S.Struct({
    RegistrationIds: S.optional(RegistrationIdList),
    Filters: S.optional(RegistrationFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRegistrationsRequest",
}) as any as S.Schema<DescribeRegistrationsRequest>;
export interface DescribeRegistrationTypeDefinitionsRequest {
  RegistrationTypes?: string[];
  Filters?: RegistrationTypeFilter[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeRegistrationTypeDefinitionsRequest = S.suspend(() =>
  S.Struct({
    RegistrationTypes: S.optional(RegistrationTypeList),
    Filters: S.optional(RegistrationTypeFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRegistrationTypeDefinitionsRequest",
}) as any as S.Schema<DescribeRegistrationTypeDefinitionsRequest>;
export interface DescribeRegistrationVersionsRequest {
  RegistrationId: string;
  VersionNumbers?: number[];
  Filters?: RegistrationVersionFilter[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeRegistrationVersionsRequest = S.suspend(() =>
  S.Struct({
    RegistrationId: S.String,
    VersionNumbers: S.optional(RegistrationVersionNumberList),
    Filters: S.optional(RegistrationVersionFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRegistrationVersionsRequest",
}) as any as S.Schema<DescribeRegistrationVersionsRequest>;
export interface DescribeSenderIdsRequest {
  SenderIds?: SenderIdAndCountry[];
  Filters?: SenderIdFilter[];
  NextToken?: string;
  MaxResults?: number;
  Owner?: string;
}
export const DescribeSenderIdsRequest = S.suspend(() =>
  S.Struct({
    SenderIds: S.optional(SenderIdList),
    Filters: S.optional(SenderIdFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Owner: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSenderIdsRequest",
}) as any as S.Schema<DescribeSenderIdsRequest>;
export interface DescribeVerifiedDestinationNumbersRequest {
  VerifiedDestinationNumberIds?: string[];
  DestinationPhoneNumbers?: string[];
  Filters?: VerifiedDestinationNumberFilter[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeVerifiedDestinationNumbersRequest = S.suspend(() =>
  S.Struct({
    VerifiedDestinationNumberIds: S.optional(VerifiedDestinationNumberIdList),
    DestinationPhoneNumbers: S.optional(DestinationPhoneNumberList),
    Filters: S.optional(VerifiedDestinationNumberFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeVerifiedDestinationNumbersRequest",
}) as any as S.Schema<DescribeVerifiedDestinationNumbersRequest>;
export interface DisassociateOriginationIdentityResult {
  PoolArn?: string;
  PoolId?: string;
  OriginationIdentityArn?: string;
  OriginationIdentity?: string;
  IsoCountryCode?: string;
}
export const DisassociateOriginationIdentityResult = S.suspend(() =>
  S.Struct({
    PoolArn: S.optional(S.String),
    PoolId: S.optional(S.String),
    OriginationIdentityArn: S.optional(S.String),
    OriginationIdentity: S.optional(S.String),
    IsoCountryCode: S.optional(S.String),
  }),
).annotations({
  identifier: "DisassociateOriginationIdentityResult",
}) as any as S.Schema<DisassociateOriginationIdentityResult>;
export interface DisassociateProtectConfigurationResult {
  ConfigurationSetArn: string;
  ConfigurationSetName: string;
  ProtectConfigurationArn: string;
  ProtectConfigurationId: string;
}
export const DisassociateProtectConfigurationResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.String,
    ConfigurationSetName: S.String,
    ProtectConfigurationArn: S.String,
    ProtectConfigurationId: S.String,
  }),
).annotations({
  identifier: "DisassociateProtectConfigurationResult",
}) as any as S.Schema<DisassociateProtectConfigurationResult>;
export interface RegistrationVersionStatusHistory {
  DraftTimestamp: Date;
  SubmittedTimestamp?: Date;
  AwsReviewingTimestamp?: Date;
  ReviewingTimestamp?: Date;
  RequiresAuthenticationTimestamp?: Date;
  ApprovedTimestamp?: Date;
  DiscardedTimestamp?: Date;
  DeniedTimestamp?: Date;
  RevokedTimestamp?: Date;
  ArchivedTimestamp?: Date;
}
export const RegistrationVersionStatusHistory = S.suspend(() =>
  S.Struct({
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
    DeniedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RevokedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ArchivedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "RegistrationVersionStatusHistory",
}) as any as S.Schema<RegistrationVersionStatusHistory>;
export interface DiscardRegistrationVersionResult {
  RegistrationArn: string;
  RegistrationId: string;
  VersionNumber: number;
  RegistrationVersionStatus: string;
  RegistrationVersionStatusHistory: RegistrationVersionStatusHistory;
}
export const DiscardRegistrationVersionResult = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    VersionNumber: S.Number,
    RegistrationVersionStatus: S.String,
    RegistrationVersionStatusHistory: RegistrationVersionStatusHistory,
  }),
).annotations({
  identifier: "DiscardRegistrationVersionResult",
}) as any as S.Schema<DiscardRegistrationVersionResult>;
export interface ProtectConfigurationCountryRuleSetInformation {
  ProtectStatus: string;
}
export const ProtectConfigurationCountryRuleSetInformation = S.suspend(() =>
  S.Struct({ ProtectStatus: S.String }),
).annotations({
  identifier: "ProtectConfigurationCountryRuleSetInformation",
}) as any as S.Schema<ProtectConfigurationCountryRuleSetInformation>;
export type ProtectConfigurationCountryRuleSet = {
  [key: string]: ProtectConfigurationCountryRuleSetInformation | undefined;
};
export const ProtectConfigurationCountryRuleSet = S.Record({
  key: S.String,
  value: S.UndefinedOr(ProtectConfigurationCountryRuleSetInformation),
});
export interface GetProtectConfigurationCountryRuleSetResult {
  ProtectConfigurationArn: string;
  ProtectConfigurationId: string;
  NumberCapability: string;
  CountryRuleSet: {
    [key: string]: ProtectConfigurationCountryRuleSetInformation | undefined;
  };
}
export const GetProtectConfigurationCountryRuleSetResult = S.suspend(() =>
  S.Struct({
    ProtectConfigurationArn: S.String,
    ProtectConfigurationId: S.String,
    NumberCapability: S.String,
    CountryRuleSet: ProtectConfigurationCountryRuleSet,
  }),
).annotations({
  identifier: "GetProtectConfigurationCountryRuleSetResult",
}) as any as S.Schema<GetProtectConfigurationCountryRuleSetResult>;
export interface GetResourcePolicyResult {
  ResourceArn?: string;
  Policy?: string;
  CreatedTimestamp?: Date;
}
export const GetResourcePolicyResult = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    Policy: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetResourcePolicyResult",
}) as any as S.Schema<GetResourcePolicyResult>;
export interface ListPoolOriginationIdentitiesRequest {
  PoolId: string;
  Filters?: PoolOriginationIdentitiesFilter[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListPoolOriginationIdentitiesRequest = S.suspend(() =>
  S.Struct({
    PoolId: S.String,
    Filters: S.optional(PoolOriginationIdentitiesFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPoolOriginationIdentitiesRequest",
}) as any as S.Schema<ListPoolOriginationIdentitiesRequest>;
export interface ListProtectConfigurationRuleSetNumberOverridesRequest {
  ProtectConfigurationId: string;
  Filters?: ProtectConfigurationRuleSetNumberOverrideFilterItem[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListProtectConfigurationRuleSetNumberOverridesRequest = S.suspend(
  () =>
    S.Struct({
      ProtectConfigurationId: S.String,
      Filters: S.optional(ListProtectConfigurationRuleSetNumberOverrideFilter),
      NextToken: S.optional(S.String),
      MaxResults: S.optional(S.Number),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "ListProtectConfigurationRuleSetNumberOverridesRequest",
}) as any as S.Schema<ListProtectConfigurationRuleSetNumberOverridesRequest>;
export interface ListRegistrationAssociationsRequest {
  RegistrationId: string;
  Filters?: RegistrationAssociationFilter[];
  NextToken?: string;
  MaxResults?: number;
}
export const ListRegistrationAssociationsRequest = S.suspend(() =>
  S.Struct({
    RegistrationId: S.String,
    Filters: S.optional(RegistrationAssociationFilterList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRegistrationAssociationsRequest",
}) as any as S.Schema<ListRegistrationAssociationsRequest>;
export interface ListTagsForResourceResult {
  ResourceArn?: string;
  Tags?: Tag[];
}
export const ListTagsForResourceResult = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String), Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResult",
}) as any as S.Schema<ListTagsForResourceResult>;
export interface PutKeywordResult {
  OriginationIdentityArn?: string;
  OriginationIdentity?: string;
  Keyword?: string;
  KeywordMessage?: string;
  KeywordAction?: string;
}
export const PutKeywordResult = S.suspend(() =>
  S.Struct({
    OriginationIdentityArn: S.optional(S.String),
    OriginationIdentity: S.optional(S.String),
    Keyword: S.optional(S.String),
    KeywordMessage: S.optional(S.String),
    KeywordAction: S.optional(S.String),
  }),
).annotations({
  identifier: "PutKeywordResult",
}) as any as S.Schema<PutKeywordResult>;
export interface PutMessageFeedbackResult {
  MessageId: string;
  MessageFeedbackStatus: string;
}
export const PutMessageFeedbackResult = S.suspend(() =>
  S.Struct({ MessageId: S.String, MessageFeedbackStatus: S.String }),
).annotations({
  identifier: "PutMessageFeedbackResult",
}) as any as S.Schema<PutMessageFeedbackResult>;
export interface PutOptedOutNumberResult {
  OptOutListArn?: string;
  OptOutListName?: string;
  OptedOutNumber?: string;
  OptedOutTimestamp?: Date;
  EndUserOptedOut?: boolean;
}
export const PutOptedOutNumberResult = S.suspend(() =>
  S.Struct({
    OptOutListArn: S.optional(S.String),
    OptOutListName: S.optional(S.String),
    OptedOutNumber: S.optional(S.String),
    OptedOutTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EndUserOptedOut: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PutOptedOutNumberResult",
}) as any as S.Schema<PutOptedOutNumberResult>;
export interface PutProtectConfigurationRuleSetNumberOverrideResult {
  ProtectConfigurationArn: string;
  ProtectConfigurationId: string;
  DestinationPhoneNumber: string;
  CreatedTimestamp: Date;
  Action: string;
  IsoCountryCode?: string;
  ExpirationTimestamp?: Date;
}
export const PutProtectConfigurationRuleSetNumberOverrideResult = S.suspend(
  () =>
    S.Struct({
      ProtectConfigurationArn: S.String,
      ProtectConfigurationId: S.String,
      DestinationPhoneNumber: S.String,
      CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
      Action: S.String,
      IsoCountryCode: S.optional(S.String),
      ExpirationTimestamp: S.optional(
        S.Date.pipe(T.TimestampFormat("epoch-seconds")),
      ),
    }),
).annotations({
  identifier: "PutProtectConfigurationRuleSetNumberOverrideResult",
}) as any as S.Schema<PutProtectConfigurationRuleSetNumberOverrideResult>;
export interface PutRegistrationFieldValueResult {
  RegistrationArn: string;
  RegistrationId: string;
  VersionNumber: number;
  FieldPath: string;
  SelectChoices?: string[];
  TextValue?: string;
  RegistrationAttachmentId?: string;
}
export const PutRegistrationFieldValueResult = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    VersionNumber: S.Number,
    FieldPath: S.String,
    SelectChoices: S.optional(SelectChoiceList),
    TextValue: S.optional(S.String),
    RegistrationAttachmentId: S.optional(S.String),
  }),
).annotations({
  identifier: "PutRegistrationFieldValueResult",
}) as any as S.Schema<PutRegistrationFieldValueResult>;
export interface PutResourcePolicyResult {
  ResourceArn?: string;
  Policy?: string;
  CreatedTimestamp?: Date;
}
export const PutResourcePolicyResult = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    Policy: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PutResourcePolicyResult",
}) as any as S.Schema<PutResourcePolicyResult>;
export interface ReleasePhoneNumberResult {
  PhoneNumberArn?: string;
  PhoneNumberId?: string;
  PhoneNumber?: string;
  Status?: string;
  IsoCountryCode?: string;
  MessageType?: string;
  NumberCapabilities?: string[];
  NumberType?: string;
  MonthlyLeasingPrice?: string;
  TwoWayEnabled?: boolean;
  TwoWayChannelArn?: string;
  TwoWayChannelRole?: string;
  SelfManagedOptOutsEnabled?: boolean;
  OptOutListName?: string;
  RegistrationId?: string;
  CreatedTimestamp?: Date;
}
export const ReleasePhoneNumberResult = S.suspend(() =>
  S.Struct({
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
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ReleasePhoneNumberResult",
}) as any as S.Schema<ReleasePhoneNumberResult>;
export interface ReleaseSenderIdResult {
  SenderIdArn: string;
  SenderId: string;
  IsoCountryCode: string;
  MessageTypes: string[];
  MonthlyLeasingPrice: string;
  Registered: boolean;
  RegistrationId?: string;
}
export const ReleaseSenderIdResult = S.suspend(() =>
  S.Struct({
    SenderIdArn: S.String,
    SenderId: S.String,
    IsoCountryCode: S.String,
    MessageTypes: MessageTypeList,
    MonthlyLeasingPrice: S.String,
    Registered: S.Boolean,
    RegistrationId: S.optional(S.String),
  }),
).annotations({
  identifier: "ReleaseSenderIdResult",
}) as any as S.Schema<ReleaseSenderIdResult>;
export interface RequestPhoneNumberResult {
  PhoneNumberArn?: string;
  PhoneNumberId?: string;
  PhoneNumber?: string;
  Status?: string;
  IsoCountryCode?: string;
  MessageType?: string;
  NumberCapabilities?: string[];
  NumberType?: string;
  MonthlyLeasingPrice?: string;
  TwoWayEnabled?: boolean;
  TwoWayChannelArn?: string;
  TwoWayChannelRole?: string;
  SelfManagedOptOutsEnabled?: boolean;
  OptOutListName?: string;
  InternationalSendingEnabled?: boolean;
  DeletionProtectionEnabled?: boolean;
  PoolId?: string;
  RegistrationId?: string;
  Tags?: Tag[];
  CreatedTimestamp?: Date;
}
export const RequestPhoneNumberResult = S.suspend(() =>
  S.Struct({
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
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "RequestPhoneNumberResult",
}) as any as S.Schema<RequestPhoneNumberResult>;
export interface RequestSenderIdResult {
  SenderIdArn: string;
  SenderId: string;
  IsoCountryCode: string;
  MessageTypes: string[];
  MonthlyLeasingPrice: string;
  DeletionProtectionEnabled: boolean;
  Registered: boolean;
  Tags?: Tag[];
}
export const RequestSenderIdResult = S.suspend(() =>
  S.Struct({
    SenderIdArn: S.String,
    SenderId: S.String,
    IsoCountryCode: S.String,
    MessageTypes: MessageTypeList,
    MonthlyLeasingPrice: S.String,
    DeletionProtectionEnabled: S.Boolean,
    Registered: S.Boolean,
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "RequestSenderIdResult",
}) as any as S.Schema<RequestSenderIdResult>;
export interface SendDestinationNumberVerificationCodeRequest {
  VerifiedDestinationNumberId: string;
  VerificationChannel: string;
  LanguageCode?: string;
  OriginationIdentity?: string;
  ConfigurationSetName?: string;
  Context?: { [key: string]: string | undefined };
  DestinationCountryParameters?: { [key: string]: string | undefined };
}
export const SendDestinationNumberVerificationCodeRequest = S.suspend(() =>
  S.Struct({
    VerifiedDestinationNumberId: S.String,
    VerificationChannel: S.String,
    LanguageCode: S.optional(S.String),
    OriginationIdentity: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    Context: S.optional(ContextMap),
    DestinationCountryParameters: S.optional(DestinationCountryParameters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendDestinationNumberVerificationCodeRequest",
}) as any as S.Schema<SendDestinationNumberVerificationCodeRequest>;
export interface SendMediaMessageResult {
  MessageId?: string;
}
export const SendMediaMessageResult = S.suspend(() =>
  S.Struct({ MessageId: S.optional(S.String) }),
).annotations({
  identifier: "SendMediaMessageResult",
}) as any as S.Schema<SendMediaMessageResult>;
export interface SendTextMessageResult {
  MessageId?: string;
}
export const SendTextMessageResult = S.suspend(() =>
  S.Struct({ MessageId: S.optional(S.String) }),
).annotations({
  identifier: "SendTextMessageResult",
}) as any as S.Schema<SendTextMessageResult>;
export interface SendVoiceMessageResult {
  MessageId?: string;
}
export const SendVoiceMessageResult = S.suspend(() =>
  S.Struct({ MessageId: S.optional(S.String) }),
).annotations({
  identifier: "SendVoiceMessageResult",
}) as any as S.Schema<SendVoiceMessageResult>;
export interface SetAccountDefaultProtectConfigurationResult {
  DefaultProtectConfigurationArn: string;
  DefaultProtectConfigurationId: string;
}
export const SetAccountDefaultProtectConfigurationResult = S.suspend(() =>
  S.Struct({
    DefaultProtectConfigurationArn: S.String,
    DefaultProtectConfigurationId: S.String,
  }),
).annotations({
  identifier: "SetAccountDefaultProtectConfigurationResult",
}) as any as S.Schema<SetAccountDefaultProtectConfigurationResult>;
export interface SetDefaultMessageFeedbackEnabledResult {
  ConfigurationSetArn?: string;
  ConfigurationSetName?: string;
  MessageFeedbackEnabled?: boolean;
}
export const SetDefaultMessageFeedbackEnabledResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    MessageFeedbackEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SetDefaultMessageFeedbackEnabledResult",
}) as any as S.Schema<SetDefaultMessageFeedbackEnabledResult>;
export interface SetDefaultMessageTypeResult {
  ConfigurationSetArn?: string;
  ConfigurationSetName?: string;
  MessageType?: string;
}
export const SetDefaultMessageTypeResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    MessageType: S.optional(S.String),
  }),
).annotations({
  identifier: "SetDefaultMessageTypeResult",
}) as any as S.Schema<SetDefaultMessageTypeResult>;
export interface SetDefaultSenderIdResult {
  ConfigurationSetArn?: string;
  ConfigurationSetName?: string;
  SenderId?: string;
}
export const SetDefaultSenderIdResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    SenderId: S.optional(S.String),
  }),
).annotations({
  identifier: "SetDefaultSenderIdResult",
}) as any as S.Schema<SetDefaultSenderIdResult>;
export interface SetMediaMessageSpendLimitOverrideResult {
  MonthlyLimit?: number;
}
export const SetMediaMessageSpendLimitOverrideResult = S.suspend(() =>
  S.Struct({ MonthlyLimit: S.optional(S.Number) }),
).annotations({
  identifier: "SetMediaMessageSpendLimitOverrideResult",
}) as any as S.Schema<SetMediaMessageSpendLimitOverrideResult>;
export interface SetTextMessageSpendLimitOverrideResult {
  MonthlyLimit?: number;
}
export const SetTextMessageSpendLimitOverrideResult = S.suspend(() =>
  S.Struct({ MonthlyLimit: S.optional(S.Number) }),
).annotations({
  identifier: "SetTextMessageSpendLimitOverrideResult",
}) as any as S.Schema<SetTextMessageSpendLimitOverrideResult>;
export interface SetVoiceMessageSpendLimitOverrideResult {
  MonthlyLimit?: number;
}
export const SetVoiceMessageSpendLimitOverrideResult = S.suspend(() =>
  S.Struct({ MonthlyLimit: S.optional(S.Number) }),
).annotations({
  identifier: "SetVoiceMessageSpendLimitOverrideResult",
}) as any as S.Schema<SetVoiceMessageSpendLimitOverrideResult>;
export interface SubmitRegistrationVersionResult {
  RegistrationArn: string;
  RegistrationId: string;
  VersionNumber: number;
  RegistrationVersionStatus: string;
  RegistrationVersionStatusHistory: RegistrationVersionStatusHistory;
  AwsReview: boolean;
}
export const SubmitRegistrationVersionResult = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    VersionNumber: S.Number,
    RegistrationVersionStatus: S.String,
    RegistrationVersionStatusHistory: RegistrationVersionStatusHistory,
    AwsReview: S.Boolean,
  }),
).annotations({
  identifier: "SubmitRegistrationVersionResult",
}) as any as S.Schema<SubmitRegistrationVersionResult>;
export interface UpdateEventDestinationResult {
  ConfigurationSetArn?: string;
  ConfigurationSetName?: string;
  EventDestination?: EventDestination;
}
export const UpdateEventDestinationResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    EventDestination: S.optional(EventDestination),
  }),
).annotations({
  identifier: "UpdateEventDestinationResult",
}) as any as S.Schema<UpdateEventDestinationResult>;
export interface UpdatePhoneNumberResult {
  PhoneNumberArn?: string;
  PhoneNumberId?: string;
  PhoneNumber?: string;
  Status?: string;
  IsoCountryCode?: string;
  MessageType?: string;
  NumberCapabilities?: string[];
  NumberType?: string;
  MonthlyLeasingPrice?: string;
  TwoWayEnabled?: boolean;
  TwoWayChannelArn?: string;
  TwoWayChannelRole?: string;
  SelfManagedOptOutsEnabled?: boolean;
  OptOutListName?: string;
  InternationalSendingEnabled?: boolean;
  DeletionProtectionEnabled?: boolean;
  RegistrationId?: string;
  CreatedTimestamp?: Date;
}
export const UpdatePhoneNumberResult = S.suspend(() =>
  S.Struct({
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
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdatePhoneNumberResult",
}) as any as S.Schema<UpdatePhoneNumberResult>;
export interface UpdatePoolResult {
  PoolArn?: string;
  PoolId?: string;
  Status?: string;
  MessageType?: string;
  TwoWayEnabled?: boolean;
  TwoWayChannelArn?: string;
  TwoWayChannelRole?: string;
  SelfManagedOptOutsEnabled?: boolean;
  OptOutListName?: string;
  SharedRoutesEnabled?: boolean;
  DeletionProtectionEnabled?: boolean;
  CreatedTimestamp?: Date;
}
export const UpdatePoolResult = S.suspend(() =>
  S.Struct({
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
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdatePoolResult",
}) as any as S.Schema<UpdatePoolResult>;
export interface UpdateProtectConfigurationResult {
  ProtectConfigurationArn: string;
  ProtectConfigurationId: string;
  CreatedTimestamp: Date;
  AccountDefault: boolean;
  DeletionProtectionEnabled: boolean;
}
export const UpdateProtectConfigurationResult = S.suspend(() =>
  S.Struct({
    ProtectConfigurationArn: S.String,
    ProtectConfigurationId: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    AccountDefault: S.Boolean,
    DeletionProtectionEnabled: S.Boolean,
  }),
).annotations({
  identifier: "UpdateProtectConfigurationResult",
}) as any as S.Schema<UpdateProtectConfigurationResult>;
export interface UpdateSenderIdResult {
  SenderIdArn: string;
  SenderId: string;
  IsoCountryCode: string;
  MessageTypes: string[];
  MonthlyLeasingPrice: string;
  DeletionProtectionEnabled: boolean;
  Registered: boolean;
  RegistrationId?: string;
}
export const UpdateSenderIdResult = S.suspend(() =>
  S.Struct({
    SenderIdArn: S.String,
    SenderId: S.String,
    IsoCountryCode: S.String,
    MessageTypes: MessageTypeList,
    MonthlyLeasingPrice: S.String,
    DeletionProtectionEnabled: S.Boolean,
    Registered: S.Boolean,
    RegistrationId: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateSenderIdResult",
}) as any as S.Schema<UpdateSenderIdResult>;
export interface VerifyDestinationNumberResult {
  VerifiedDestinationNumberArn: string;
  VerifiedDestinationNumberId: string;
  DestinationPhoneNumber: string;
  Status: string;
  CreatedTimestamp: Date;
}
export const VerifyDestinationNumberResult = S.suspend(() =>
  S.Struct({
    VerifiedDestinationNumberArn: S.String,
    VerifiedDestinationNumberId: S.String,
    DestinationPhoneNumber: S.String,
    Status: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "VerifyDestinationNumberResult",
}) as any as S.Schema<VerifyDestinationNumberResult>;
export type EventDestinationList = EventDestination[];
export const EventDestinationList = S.Array(EventDestination);
export interface AccountAttribute {
  Name: string;
  Value: string;
}
export const AccountAttribute = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "AccountAttribute",
}) as any as S.Schema<AccountAttribute>;
export type AccountAttributeList = AccountAttribute[];
export const AccountAttributeList = S.Array(AccountAttribute);
export interface AccountLimit {
  Name: string;
  Used: number;
  Max: number;
}
export const AccountLimit = S.suspend(() =>
  S.Struct({ Name: S.String, Used: S.Number, Max: S.Number }),
).annotations({ identifier: "AccountLimit" }) as any as S.Schema<AccountLimit>;
export type AccountLimitList = AccountLimit[];
export const AccountLimitList = S.Array(AccountLimit);
export interface OptOutListInformation {
  OptOutListArn: string;
  OptOutListName: string;
  CreatedTimestamp: Date;
}
export const OptOutListInformation = S.suspend(() =>
  S.Struct({
    OptOutListArn: S.String,
    OptOutListName: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "OptOutListInformation",
}) as any as S.Schema<OptOutListInformation>;
export type OptOutListInformationList = OptOutListInformation[];
export const OptOutListInformationList = S.Array(OptOutListInformation);
export interface RegistrationFieldValueInformation {
  FieldPath: string;
  SelectChoices?: string[];
  TextValue?: string;
  RegistrationAttachmentId?: string;
  DeniedReason?: string;
  Feedback?: string;
}
export const RegistrationFieldValueInformation = S.suspend(() =>
  S.Struct({
    FieldPath: S.String,
    SelectChoices: S.optional(SelectChoiceList),
    TextValue: S.optional(S.String),
    RegistrationAttachmentId: S.optional(S.String),
    DeniedReason: S.optional(S.String),
    Feedback: S.optional(S.String),
  }),
).annotations({
  identifier: "RegistrationFieldValueInformation",
}) as any as S.Schema<RegistrationFieldValueInformation>;
export type RegistrationFieldValueInformationList =
  RegistrationFieldValueInformation[];
export const RegistrationFieldValueInformationList = S.Array(
  RegistrationFieldValueInformation,
);
export interface SpendLimit {
  Name: string;
  EnforcedLimit: number;
  MaxLimit: number;
  Overridden: boolean;
}
export const SpendLimit = S.suspend(() =>
  S.Struct({
    Name: S.String,
    EnforcedLimit: S.Number,
    MaxLimit: S.Number,
    Overridden: S.Boolean,
  }),
).annotations({ identifier: "SpendLimit" }) as any as S.Schema<SpendLimit>;
export type SpendLimitList = SpendLimit[];
export const SpendLimitList = S.Array(SpendLimit);
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface CreateConfigurationSetResult {
  ConfigurationSetArn?: string;
  ConfigurationSetName?: string;
  Tags?: Tag[];
  CreatedTimestamp?: Date;
}
export const CreateConfigurationSetResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    Tags: S.optional(TagList),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreateConfigurationSetResult",
}) as any as S.Schema<CreateConfigurationSetResult>;
export interface CreateEventDestinationResult {
  ConfigurationSetArn?: string;
  ConfigurationSetName?: string;
  EventDestination?: EventDestination;
}
export const CreateEventDestinationResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    EventDestination: S.optional(EventDestination),
  }),
).annotations({
  identifier: "CreateEventDestinationResult",
}) as any as S.Schema<CreateEventDestinationResult>;
export interface CreateRegistrationResult {
  RegistrationArn: string;
  RegistrationId: string;
  RegistrationType: string;
  RegistrationStatus: string;
  CurrentVersionNumber: number;
  AdditionalAttributes?: { [key: string]: string | undefined };
  Tags?: Tag[];
  CreatedTimestamp: Date;
}
export const CreateRegistrationResult = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    RegistrationType: S.String,
    RegistrationStatus: S.String,
    CurrentVersionNumber: S.Number,
    AdditionalAttributes: S.optional(StringMap),
    Tags: S.optional(TagList),
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "CreateRegistrationResult",
}) as any as S.Schema<CreateRegistrationResult>;
export interface CreateRegistrationVersionResult {
  RegistrationArn: string;
  RegistrationId: string;
  VersionNumber: number;
  RegistrationVersionStatus: string;
  RegistrationVersionStatusHistory: RegistrationVersionStatusHistory;
}
export const CreateRegistrationVersionResult = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    VersionNumber: S.Number,
    RegistrationVersionStatus: S.String,
    RegistrationVersionStatusHistory: RegistrationVersionStatusHistory,
  }),
).annotations({
  identifier: "CreateRegistrationVersionResult",
}) as any as S.Schema<CreateRegistrationVersionResult>;
export interface DeleteConfigurationSetResult {
  ConfigurationSetArn?: string;
  ConfigurationSetName?: string;
  EventDestinations?: EventDestination[];
  DefaultMessageType?: string;
  DefaultSenderId?: string;
  DefaultMessageFeedbackEnabled?: boolean;
  CreatedTimestamp?: Date;
}
export const DeleteConfigurationSetResult = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.optional(S.String),
    ConfigurationSetName: S.optional(S.String),
    EventDestinations: S.optional(EventDestinationList),
    DefaultMessageType: S.optional(S.String),
    DefaultSenderId: S.optional(S.String),
    DefaultMessageFeedbackEnabled: S.optional(S.Boolean),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DeleteConfigurationSetResult",
}) as any as S.Schema<DeleteConfigurationSetResult>;
export interface DescribeAccountAttributesResult {
  AccountAttributes?: AccountAttribute[];
  NextToken?: string;
}
export const DescribeAccountAttributesResult = S.suspend(() =>
  S.Struct({
    AccountAttributes: S.optional(AccountAttributeList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAccountAttributesResult",
}) as any as S.Schema<DescribeAccountAttributesResult>;
export interface DescribeAccountLimitsResult {
  AccountLimits?: AccountLimit[];
  NextToken?: string;
}
export const DescribeAccountLimitsResult = S.suspend(() =>
  S.Struct({
    AccountLimits: S.optional(AccountLimitList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAccountLimitsResult",
}) as any as S.Schema<DescribeAccountLimitsResult>;
export interface DescribeOptOutListsResult {
  OptOutLists?: OptOutListInformation[];
  NextToken?: string;
}
export const DescribeOptOutListsResult = S.suspend(() =>
  S.Struct({
    OptOutLists: S.optional(OptOutListInformationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeOptOutListsResult",
}) as any as S.Schema<DescribeOptOutListsResult>;
export interface DescribeRegistrationFieldValuesResult {
  RegistrationArn: string;
  RegistrationId: string;
  VersionNumber: number;
  RegistrationFieldValues: RegistrationFieldValueInformation[];
  NextToken?: string;
}
export const DescribeRegistrationFieldValuesResult = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    VersionNumber: S.Number,
    RegistrationFieldValues: RegistrationFieldValueInformationList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRegistrationFieldValuesResult",
}) as any as S.Schema<DescribeRegistrationFieldValuesResult>;
export interface DescribeSpendLimitsResult {
  SpendLimits?: SpendLimit[];
  NextToken?: string;
}
export const DescribeSpendLimitsResult = S.suspend(() =>
  S.Struct({
    SpendLimits: S.optional(SpendLimitList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSpendLimitsResult",
}) as any as S.Schema<DescribeSpendLimitsResult>;
export interface SendDestinationNumberVerificationCodeResult {
  MessageId: string;
}
export const SendDestinationNumberVerificationCodeResult = S.suspend(() =>
  S.Struct({ MessageId: S.String }),
).annotations({
  identifier: "SendDestinationNumberVerificationCodeResult",
}) as any as S.Schema<SendDestinationNumberVerificationCodeResult>;
export interface UpdateProtectConfigurationCountryRuleSetRequest {
  ProtectConfigurationId: string;
  NumberCapability: string;
  CountryRuleSetUpdates: {
    [key: string]: ProtectConfigurationCountryRuleSetInformation | undefined;
  };
}
export const UpdateProtectConfigurationCountryRuleSetRequest = S.suspend(() =>
  S.Struct({
    ProtectConfigurationId: S.String,
    NumberCapability: S.String,
    CountryRuleSetUpdates: ProtectConfigurationCountryRuleSet,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProtectConfigurationCountryRuleSetRequest",
}) as any as S.Schema<UpdateProtectConfigurationCountryRuleSetRequest>;
export interface SelectValidation {
  MinChoices: number;
  MaxChoices: number;
  Options: string[];
}
export const SelectValidation = S.suspend(() =>
  S.Struct({ MinChoices: S.Number, MaxChoices: S.Number, Options: StringList }),
).annotations({
  identifier: "SelectValidation",
}) as any as S.Schema<SelectValidation>;
export interface TextValidation {
  MinLength: number;
  MaxLength: number;
  Pattern: string;
}
export const TextValidation = S.suspend(() =>
  S.Struct({ MinLength: S.Number, MaxLength: S.Number, Pattern: S.String }),
).annotations({
  identifier: "TextValidation",
}) as any as S.Schema<TextValidation>;
export interface RegistrationSectionDisplayHints {
  Title: string;
  ShortDescription: string;
  LongDescription?: string;
  DocumentationTitle?: string;
  DocumentationLink?: string;
}
export const RegistrationSectionDisplayHints = S.suspend(() =>
  S.Struct({
    Title: S.String,
    ShortDescription: S.String,
    LongDescription: S.optional(S.String),
    DocumentationTitle: S.optional(S.String),
    DocumentationLink: S.optional(S.String),
  }),
).annotations({
  identifier: "RegistrationSectionDisplayHints",
}) as any as S.Schema<RegistrationSectionDisplayHints>;
export interface ConfigurationSetInformation {
  ConfigurationSetArn: string;
  ConfigurationSetName: string;
  EventDestinations: EventDestination[];
  DefaultMessageType?: string;
  DefaultSenderId?: string;
  DefaultMessageFeedbackEnabled?: boolean;
  CreatedTimestamp: Date;
  ProtectConfigurationId?: string;
}
export const ConfigurationSetInformation = S.suspend(() =>
  S.Struct({
    ConfigurationSetArn: S.String,
    ConfigurationSetName: S.String,
    EventDestinations: EventDestinationList,
    DefaultMessageType: S.optional(S.String),
    DefaultSenderId: S.optional(S.String),
    DefaultMessageFeedbackEnabled: S.optional(S.Boolean),
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ProtectConfigurationId: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigurationSetInformation",
}) as any as S.Schema<ConfigurationSetInformation>;
export type ConfigurationSetInformationList = ConfigurationSetInformation[];
export const ConfigurationSetInformationList = S.Array(
  ConfigurationSetInformation,
);
export interface KeywordInformation {
  Keyword: string;
  KeywordMessage: string;
  KeywordAction: string;
}
export const KeywordInformation = S.suspend(() =>
  S.Struct({
    Keyword: S.String,
    KeywordMessage: S.String,
    KeywordAction: S.String,
  }),
).annotations({
  identifier: "KeywordInformation",
}) as any as S.Schema<KeywordInformation>;
export type KeywordInformationList = KeywordInformation[];
export const KeywordInformationList = S.Array(KeywordInformation);
export interface OptedOutNumberInformation {
  OptedOutNumber: string;
  OptedOutTimestamp: Date;
  EndUserOptedOut: boolean;
}
export const OptedOutNumberInformation = S.suspend(() =>
  S.Struct({
    OptedOutNumber: S.String,
    OptedOutTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndUserOptedOut: S.Boolean,
  }),
).annotations({
  identifier: "OptedOutNumberInformation",
}) as any as S.Schema<OptedOutNumberInformation>;
export type OptedOutNumberInformationList = OptedOutNumberInformation[];
export const OptedOutNumberInformationList = S.Array(OptedOutNumberInformation);
export interface PhoneNumberInformation {
  PhoneNumberArn: string;
  PhoneNumberId?: string;
  PhoneNumber: string;
  Status: string;
  IsoCountryCode: string;
  MessageType: string;
  NumberCapabilities: string[];
  NumberType: string;
  MonthlyLeasingPrice: string;
  TwoWayEnabled: boolean;
  TwoWayChannelArn?: string;
  TwoWayChannelRole?: string;
  SelfManagedOptOutsEnabled: boolean;
  OptOutListName: string;
  InternationalSendingEnabled?: boolean;
  DeletionProtectionEnabled: boolean;
  PoolId?: string;
  RegistrationId?: string;
  CreatedTimestamp: Date;
}
export const PhoneNumberInformation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "PhoneNumberInformation",
}) as any as S.Schema<PhoneNumberInformation>;
export type PhoneNumberInformationList = PhoneNumberInformation[];
export const PhoneNumberInformationList = S.Array(PhoneNumberInformation);
export interface PoolInformation {
  PoolArn: string;
  PoolId: string;
  Status: string;
  MessageType: string;
  TwoWayEnabled: boolean;
  TwoWayChannelArn?: string;
  TwoWayChannelRole?: string;
  SelfManagedOptOutsEnabled: boolean;
  OptOutListName: string;
  SharedRoutesEnabled: boolean;
  DeletionProtectionEnabled: boolean;
  CreatedTimestamp: Date;
}
export const PoolInformation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "PoolInformation",
}) as any as S.Schema<PoolInformation>;
export type PoolInformationList = PoolInformation[];
export const PoolInformationList = S.Array(PoolInformation);
export interface ProtectConfigurationInformation {
  ProtectConfigurationArn: string;
  ProtectConfigurationId: string;
  CreatedTimestamp: Date;
  AccountDefault: boolean;
  DeletionProtectionEnabled: boolean;
}
export const ProtectConfigurationInformation = S.suspend(() =>
  S.Struct({
    ProtectConfigurationArn: S.String,
    ProtectConfigurationId: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    AccountDefault: S.Boolean,
    DeletionProtectionEnabled: S.Boolean,
  }),
).annotations({
  identifier: "ProtectConfigurationInformation",
}) as any as S.Schema<ProtectConfigurationInformation>;
export type ProtectConfigurationInformationList =
  ProtectConfigurationInformation[];
export const ProtectConfigurationInformationList = S.Array(
  ProtectConfigurationInformation,
);
export interface RegistrationAttachmentsInformation {
  RegistrationAttachmentArn: string;
  RegistrationAttachmentId: string;
  AttachmentStatus: string;
  AttachmentUploadErrorReason?: string;
  CreatedTimestamp: Date;
}
export const RegistrationAttachmentsInformation = S.suspend(() =>
  S.Struct({
    RegistrationAttachmentArn: S.String,
    RegistrationAttachmentId: S.String,
    AttachmentStatus: S.String,
    AttachmentUploadErrorReason: S.optional(S.String),
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "RegistrationAttachmentsInformation",
}) as any as S.Schema<RegistrationAttachmentsInformation>;
export type RegistrationAttachmentsInformationList =
  RegistrationAttachmentsInformation[];
export const RegistrationAttachmentsInformationList = S.Array(
  RegistrationAttachmentsInformation,
);
export interface RegistrationInformation {
  RegistrationArn: string;
  RegistrationId: string;
  RegistrationType: string;
  RegistrationStatus: string;
  CurrentVersionNumber: number;
  ApprovedVersionNumber?: number;
  LatestDeniedVersionNumber?: number;
  AdditionalAttributes?: { [key: string]: string | undefined };
  CreatedTimestamp: Date;
}
export const RegistrationInformation = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    RegistrationType: S.String,
    RegistrationStatus: S.String,
    CurrentVersionNumber: S.Number,
    ApprovedVersionNumber: S.optional(S.Number),
    LatestDeniedVersionNumber: S.optional(S.Number),
    AdditionalAttributes: S.optional(StringMap),
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "RegistrationInformation",
}) as any as S.Schema<RegistrationInformation>;
export type RegistrationInformationList = RegistrationInformation[];
export const RegistrationInformationList = S.Array(RegistrationInformation);
export interface RegistrationSectionDefinition {
  SectionPath: string;
  DisplayHints: RegistrationSectionDisplayHints;
}
export const RegistrationSectionDefinition = S.suspend(() =>
  S.Struct({
    SectionPath: S.String,
    DisplayHints: RegistrationSectionDisplayHints,
  }),
).annotations({
  identifier: "RegistrationSectionDefinition",
}) as any as S.Schema<RegistrationSectionDefinition>;
export type RegistrationSectionDefinitionList = RegistrationSectionDefinition[];
export const RegistrationSectionDefinitionList = S.Array(
  RegistrationSectionDefinition,
);
export interface SenderIdInformation {
  SenderIdArn: string;
  SenderId: string;
  IsoCountryCode: string;
  MessageTypes: string[];
  MonthlyLeasingPrice: string;
  DeletionProtectionEnabled: boolean;
  Registered: boolean;
  RegistrationId?: string;
}
export const SenderIdInformation = S.suspend(() =>
  S.Struct({
    SenderIdArn: S.String,
    SenderId: S.String,
    IsoCountryCode: S.String,
    MessageTypes: MessageTypeList,
    MonthlyLeasingPrice: S.String,
    DeletionProtectionEnabled: S.Boolean,
    Registered: S.Boolean,
    RegistrationId: S.optional(S.String),
  }),
).annotations({
  identifier: "SenderIdInformation",
}) as any as S.Schema<SenderIdInformation>;
export type SenderIdInformationList = SenderIdInformation[];
export const SenderIdInformationList = S.Array(SenderIdInformation);
export interface VerifiedDestinationNumberInformation {
  VerifiedDestinationNumberArn: string;
  VerifiedDestinationNumberId: string;
  DestinationPhoneNumber: string;
  Status: string;
  CreatedTimestamp: Date;
}
export const VerifiedDestinationNumberInformation = S.suspend(() =>
  S.Struct({
    VerifiedDestinationNumberArn: S.String,
    VerifiedDestinationNumberId: S.String,
    DestinationPhoneNumber: S.String,
    Status: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "VerifiedDestinationNumberInformation",
}) as any as S.Schema<VerifiedDestinationNumberInformation>;
export type VerifiedDestinationNumberInformationList =
  VerifiedDestinationNumberInformation[];
export const VerifiedDestinationNumberInformationList = S.Array(
  VerifiedDestinationNumberInformation,
);
export interface OriginationIdentityMetadata {
  OriginationIdentityArn: string;
  OriginationIdentity: string;
  IsoCountryCode: string;
  NumberCapabilities: string[];
  PhoneNumber?: string;
}
export const OriginationIdentityMetadata = S.suspend(() =>
  S.Struct({
    OriginationIdentityArn: S.String,
    OriginationIdentity: S.String,
    IsoCountryCode: S.String,
    NumberCapabilities: NumberCapabilityList,
    PhoneNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "OriginationIdentityMetadata",
}) as any as S.Schema<OriginationIdentityMetadata>;
export type OriginationIdentityMetadataList = OriginationIdentityMetadata[];
export const OriginationIdentityMetadataList = S.Array(
  OriginationIdentityMetadata,
);
export interface ProtectConfigurationRuleSetNumberOverride {
  DestinationPhoneNumber: string;
  CreatedTimestamp: Date;
  Action: string;
  IsoCountryCode?: string;
  ExpirationTimestamp?: Date;
}
export const ProtectConfigurationRuleSetNumberOverride = S.suspend(() =>
  S.Struct({
    DestinationPhoneNumber: S.String,
    CreatedTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Action: S.String,
    IsoCountryCode: S.optional(S.String),
    ExpirationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ProtectConfigurationRuleSetNumberOverride",
}) as any as S.Schema<ProtectConfigurationRuleSetNumberOverride>;
export type ProtectConfigurationRuleSetNumberOverrideList =
  ProtectConfigurationRuleSetNumberOverride[];
export const ProtectConfigurationRuleSetNumberOverrideList = S.Array(
  ProtectConfigurationRuleSetNumberOverride,
);
export interface RegistrationAssociationMetadata {
  ResourceArn: string;
  ResourceId: string;
  ResourceType: string;
  IsoCountryCode?: string;
  PhoneNumber?: string;
}
export const RegistrationAssociationMetadata = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    IsoCountryCode: S.optional(S.String),
    PhoneNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "RegistrationAssociationMetadata",
}) as any as S.Schema<RegistrationAssociationMetadata>;
export type RegistrationAssociationMetadataList =
  RegistrationAssociationMetadata[];
export const RegistrationAssociationMetadataList = S.Array(
  RegistrationAssociationMetadata,
);
export interface SelectOptionDescription {
  Option: string;
  Title?: string;
  Description?: string;
}
export const SelectOptionDescription = S.suspend(() =>
  S.Struct({
    Option: S.String,
    Title: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "SelectOptionDescription",
}) as any as S.Schema<SelectOptionDescription>;
export type SelectOptionDescriptionsList = SelectOptionDescription[];
export const SelectOptionDescriptionsList = S.Array(SelectOptionDescription);
export interface DescribeConfigurationSetsResult {
  ConfigurationSets?: ConfigurationSetInformation[];
  NextToken?: string;
}
export const DescribeConfigurationSetsResult = S.suspend(() =>
  S.Struct({
    ConfigurationSets: S.optional(ConfigurationSetInformationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeConfigurationSetsResult",
}) as any as S.Schema<DescribeConfigurationSetsResult>;
export interface DescribeKeywordsResult {
  OriginationIdentityArn?: string;
  OriginationIdentity?: string;
  Keywords?: KeywordInformation[];
  NextToken?: string;
}
export const DescribeKeywordsResult = S.suspend(() =>
  S.Struct({
    OriginationIdentityArn: S.optional(S.String),
    OriginationIdentity: S.optional(S.String),
    Keywords: S.optional(KeywordInformationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeKeywordsResult",
}) as any as S.Schema<DescribeKeywordsResult>;
export interface DescribeOptedOutNumbersResult {
  OptOutListArn?: string;
  OptOutListName?: string;
  OptedOutNumbers?: OptedOutNumberInformation[];
  NextToken?: string;
}
export const DescribeOptedOutNumbersResult = S.suspend(() =>
  S.Struct({
    OptOutListArn: S.optional(S.String),
    OptOutListName: S.optional(S.String),
    OptedOutNumbers: S.optional(OptedOutNumberInformationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeOptedOutNumbersResult",
}) as any as S.Schema<DescribeOptedOutNumbersResult>;
export interface DescribePhoneNumbersResult {
  PhoneNumbers?: PhoneNumberInformation[];
  NextToken?: string;
}
export const DescribePhoneNumbersResult = S.suspend(() =>
  S.Struct({
    PhoneNumbers: S.optional(PhoneNumberInformationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribePhoneNumbersResult",
}) as any as S.Schema<DescribePhoneNumbersResult>;
export interface DescribePoolsResult {
  Pools?: PoolInformation[];
  NextToken?: string;
}
export const DescribePoolsResult = S.suspend(() =>
  S.Struct({
    Pools: S.optional(PoolInformationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribePoolsResult",
}) as any as S.Schema<DescribePoolsResult>;
export interface DescribeProtectConfigurationsResult {
  ProtectConfigurations?: ProtectConfigurationInformation[];
  NextToken?: string;
}
export const DescribeProtectConfigurationsResult = S.suspend(() =>
  S.Struct({
    ProtectConfigurations: S.optional(ProtectConfigurationInformationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeProtectConfigurationsResult",
}) as any as S.Schema<DescribeProtectConfigurationsResult>;
export interface DescribeRegistrationAttachmentsResult {
  RegistrationAttachments: RegistrationAttachmentsInformation[];
  NextToken?: string;
}
export const DescribeRegistrationAttachmentsResult = S.suspend(() =>
  S.Struct({
    RegistrationAttachments: RegistrationAttachmentsInformationList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRegistrationAttachmentsResult",
}) as any as S.Schema<DescribeRegistrationAttachmentsResult>;
export interface DescribeRegistrationsResult {
  Registrations: RegistrationInformation[];
  NextToken?: string;
}
export const DescribeRegistrationsResult = S.suspend(() =>
  S.Struct({
    Registrations: RegistrationInformationList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRegistrationsResult",
}) as any as S.Schema<DescribeRegistrationsResult>;
export interface DescribeRegistrationSectionDefinitionsResult {
  RegistrationType: string;
  RegistrationSectionDefinitions: RegistrationSectionDefinition[];
  NextToken?: string;
}
export const DescribeRegistrationSectionDefinitionsResult = S.suspend(() =>
  S.Struct({
    RegistrationType: S.String,
    RegistrationSectionDefinitions: RegistrationSectionDefinitionList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRegistrationSectionDefinitionsResult",
}) as any as S.Schema<DescribeRegistrationSectionDefinitionsResult>;
export interface DescribeSenderIdsResult {
  SenderIds?: SenderIdInformation[];
  NextToken?: string;
}
export const DescribeSenderIdsResult = S.suspend(() =>
  S.Struct({
    SenderIds: S.optional(SenderIdInformationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSenderIdsResult",
}) as any as S.Schema<DescribeSenderIdsResult>;
export interface DescribeVerifiedDestinationNumbersResult {
  VerifiedDestinationNumbers: VerifiedDestinationNumberInformation[];
  NextToken?: string;
}
export const DescribeVerifiedDestinationNumbersResult = S.suspend(() =>
  S.Struct({
    VerifiedDestinationNumbers: VerifiedDestinationNumberInformationList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeVerifiedDestinationNumbersResult",
}) as any as S.Schema<DescribeVerifiedDestinationNumbersResult>;
export interface ListPoolOriginationIdentitiesResult {
  PoolArn?: string;
  PoolId?: string;
  OriginationIdentities?: OriginationIdentityMetadata[];
  NextToken?: string;
}
export const ListPoolOriginationIdentitiesResult = S.suspend(() =>
  S.Struct({
    PoolArn: S.optional(S.String),
    PoolId: S.optional(S.String),
    OriginationIdentities: S.optional(OriginationIdentityMetadataList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPoolOriginationIdentitiesResult",
}) as any as S.Schema<ListPoolOriginationIdentitiesResult>;
export interface ListProtectConfigurationRuleSetNumberOverridesResult {
  ProtectConfigurationArn: string;
  ProtectConfigurationId: string;
  RuleSetNumberOverrides?: ProtectConfigurationRuleSetNumberOverride[];
  NextToken?: string;
}
export const ListProtectConfigurationRuleSetNumberOverridesResult = S.suspend(
  () =>
    S.Struct({
      ProtectConfigurationArn: S.String,
      ProtectConfigurationId: S.String,
      RuleSetNumberOverrides: S.optional(
        ProtectConfigurationRuleSetNumberOverrideList,
      ),
      NextToken: S.optional(S.String),
    }),
).annotations({
  identifier: "ListProtectConfigurationRuleSetNumberOverridesResult",
}) as any as S.Schema<ListProtectConfigurationRuleSetNumberOverridesResult>;
export interface ListRegistrationAssociationsResult {
  RegistrationArn: string;
  RegistrationId: string;
  RegistrationType: string;
  RegistrationAssociations: RegistrationAssociationMetadata[];
  NextToken?: string;
}
export const ListRegistrationAssociationsResult = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    RegistrationType: S.String,
    RegistrationAssociations: RegistrationAssociationMetadataList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRegistrationAssociationsResult",
}) as any as S.Schema<ListRegistrationAssociationsResult>;
export interface UpdateProtectConfigurationCountryRuleSetResult {
  ProtectConfigurationArn: string;
  ProtectConfigurationId: string;
  NumberCapability: string;
  CountryRuleSet: {
    [key: string]: ProtectConfigurationCountryRuleSetInformation | undefined;
  };
}
export const UpdateProtectConfigurationCountryRuleSetResult = S.suspend(() =>
  S.Struct({
    ProtectConfigurationArn: S.String,
    ProtectConfigurationId: S.String,
    NumberCapability: S.String,
    CountryRuleSet: ProtectConfigurationCountryRuleSet,
  }),
).annotations({
  identifier: "UpdateProtectConfigurationCountryRuleSetResult",
}) as any as S.Schema<UpdateProtectConfigurationCountryRuleSetResult>;
export interface RegistrationFieldDisplayHints {
  Title: string;
  ShortDescription: string;
  LongDescription?: string;
  DocumentationTitle?: string;
  DocumentationLink?: string;
  SelectOptionDescriptions?: SelectOptionDescription[];
  TextValidationDescription?: string;
  ExampleTextValue?: string;
}
export const RegistrationFieldDisplayHints = S.suspend(() =>
  S.Struct({
    Title: S.String,
    ShortDescription: S.String,
    LongDescription: S.optional(S.String),
    DocumentationTitle: S.optional(S.String),
    DocumentationLink: S.optional(S.String),
    SelectOptionDescriptions: S.optional(SelectOptionDescriptionsList),
    TextValidationDescription: S.optional(S.String),
    ExampleTextValue: S.optional(S.String),
  }),
).annotations({
  identifier: "RegistrationFieldDisplayHints",
}) as any as S.Schema<RegistrationFieldDisplayHints>;
export interface SupportedAssociation {
  ResourceType: string;
  IsoCountryCode?: string;
  AssociationBehavior: string;
  DisassociationBehavior: string;
}
export const SupportedAssociation = S.suspend(() =>
  S.Struct({
    ResourceType: S.String,
    IsoCountryCode: S.optional(S.String),
    AssociationBehavior: S.String,
    DisassociationBehavior: S.String,
  }),
).annotations({
  identifier: "SupportedAssociation",
}) as any as S.Schema<SupportedAssociation>;
export type SupportedAssociationList = SupportedAssociation[];
export const SupportedAssociationList = S.Array(SupportedAssociation);
export interface RegistrationTypeDisplayHints {
  Title: string;
  ShortDescription?: string;
  LongDescription?: string;
  DocumentationTitle?: string;
  DocumentationLink?: string;
}
export const RegistrationTypeDisplayHints = S.suspend(() =>
  S.Struct({
    Title: S.String,
    ShortDescription: S.optional(S.String),
    LongDescription: S.optional(S.String),
    DocumentationTitle: S.optional(S.String),
    DocumentationLink: S.optional(S.String),
  }),
).annotations({
  identifier: "RegistrationTypeDisplayHints",
}) as any as S.Schema<RegistrationTypeDisplayHints>;
export interface RegistrationDeniedReasonInformation {
  Reason: string;
  ShortDescription: string;
  LongDescription?: string;
  DocumentationTitle?: string;
  DocumentationLink?: string;
}
export const RegistrationDeniedReasonInformation = S.suspend(() =>
  S.Struct({
    Reason: S.String,
    ShortDescription: S.String,
    LongDescription: S.optional(S.String),
    DocumentationTitle: S.optional(S.String),
    DocumentationLink: S.optional(S.String),
  }),
).annotations({
  identifier: "RegistrationDeniedReasonInformation",
}) as any as S.Schema<RegistrationDeniedReasonInformation>;
export type RegistrationDeniedReasonInformationList =
  RegistrationDeniedReasonInformation[];
export const RegistrationDeniedReasonInformationList = S.Array(
  RegistrationDeniedReasonInformation,
);
export interface RegistrationFieldDefinition {
  SectionPath: string;
  FieldPath: string;
  FieldType: string;
  FieldRequirement: string;
  SelectValidation?: SelectValidation;
  TextValidation?: TextValidation;
  DisplayHints: RegistrationFieldDisplayHints;
}
export const RegistrationFieldDefinition = S.suspend(() =>
  S.Struct({
    SectionPath: S.String,
    FieldPath: S.String,
    FieldType: S.String,
    FieldRequirement: S.String,
    SelectValidation: S.optional(SelectValidation),
    TextValidation: S.optional(TextValidation),
    DisplayHints: RegistrationFieldDisplayHints,
  }),
).annotations({
  identifier: "RegistrationFieldDefinition",
}) as any as S.Schema<RegistrationFieldDefinition>;
export type RegistrationFieldDefinitionList = RegistrationFieldDefinition[];
export const RegistrationFieldDefinitionList = S.Array(
  RegistrationFieldDefinition,
);
export interface RegistrationTypeDefinition {
  RegistrationType: string;
  SupportedAssociations?: SupportedAssociation[];
  DisplayHints: RegistrationTypeDisplayHints;
}
export const RegistrationTypeDefinition = S.suspend(() =>
  S.Struct({
    RegistrationType: S.String,
    SupportedAssociations: S.optional(SupportedAssociationList),
    DisplayHints: RegistrationTypeDisplayHints,
  }),
).annotations({
  identifier: "RegistrationTypeDefinition",
}) as any as S.Schema<RegistrationTypeDefinition>;
export type RegistrationTypeDefinitionList = RegistrationTypeDefinition[];
export const RegistrationTypeDefinitionList = S.Array(
  RegistrationTypeDefinition,
);
export interface RegistrationVersionInformation {
  VersionNumber: number;
  RegistrationVersionStatus: string;
  RegistrationVersionStatusHistory: RegistrationVersionStatusHistory;
  DeniedReasons?: RegistrationDeniedReasonInformation[];
  Feedback?: string;
}
export const RegistrationVersionInformation = S.suspend(() =>
  S.Struct({
    VersionNumber: S.Number,
    RegistrationVersionStatus: S.String,
    RegistrationVersionStatusHistory: RegistrationVersionStatusHistory,
    DeniedReasons: S.optional(RegistrationDeniedReasonInformationList),
    Feedback: S.optional(S.String),
  }),
).annotations({
  identifier: "RegistrationVersionInformation",
}) as any as S.Schema<RegistrationVersionInformation>;
export type RegistrationVersionInformationList =
  RegistrationVersionInformation[];
export const RegistrationVersionInformationList = S.Array(
  RegistrationVersionInformation,
);
export interface DescribeRegistrationFieldDefinitionsResult {
  RegistrationType: string;
  RegistrationFieldDefinitions: RegistrationFieldDefinition[];
  NextToken?: string;
}
export const DescribeRegistrationFieldDefinitionsResult = S.suspend(() =>
  S.Struct({
    RegistrationType: S.String,
    RegistrationFieldDefinitions: RegistrationFieldDefinitionList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRegistrationFieldDefinitionsResult",
}) as any as S.Schema<DescribeRegistrationFieldDefinitionsResult>;
export interface DescribeRegistrationTypeDefinitionsResult {
  RegistrationTypeDefinitions: RegistrationTypeDefinition[];
  NextToken?: string;
}
export const DescribeRegistrationTypeDefinitionsResult = S.suspend(() =>
  S.Struct({
    RegistrationTypeDefinitions: RegistrationTypeDefinitionList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRegistrationTypeDefinitionsResult",
}) as any as S.Schema<DescribeRegistrationTypeDefinitionsResult>;
export interface DescribeRegistrationVersionsResult {
  RegistrationArn: string;
  RegistrationId: string;
  RegistrationVersions: RegistrationVersionInformation[];
  NextToken?: string;
}
export const DescribeRegistrationVersionsResult = S.suspend(() =>
  S.Struct({
    RegistrationArn: S.String,
    RegistrationId: S.String,
    RegistrationVersions: RegistrationVersionInformationList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRegistrationVersionsResult",
}) as any as S.Schema<DescribeRegistrationVersionsResult>;
export interface ValidationExceptionField {
  Name: string;
  Message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ Name: S.String, Message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
  T.Retryable(),
).pipe(C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
  },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceId: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(C.withRetryableError, C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(S.String),
    Fields: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Describes attributes of your Amazon Web Services account. The supported account attributes include account tier, which indicates whether your account is in the sandbox or production environment. When you're ready to move your account out of the sandbox, create an Amazon Web Services Support case for a service limit increase request.
 *
 * New accounts are placed into an SMS or voice sandbox. The sandbox protects both Amazon Web Services end recipients and SMS or voice recipients from fraud and abuse.
 */
export const describeAccountAttributes: {
  (
    input: DescribeAccountAttributesRequest,
  ): effect.Effect<
    DescribeAccountAttributesResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAccountAttributesRequest,
  ) => stream.Stream<
    DescribeAccountAttributesResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAccountAttributesRequest,
  ) => stream.Stream<
    AccountAttribute,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAccountAttributesRequest,
  output: DescribeAccountAttributesResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AccountAttributes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes the specified configuration sets or all in your account.
 *
 * If you specify configuration set names, the output includes information for only the specified configuration sets. If you specify filters, the output includes information for only those configuration sets that meet the filter criteria. If you don't specify configuration set names or filters, the output includes information for all configuration sets.
 *
 * If you specify a configuration set name that isn't valid, an error is returned.
 */
export const describeConfigurationSets: {
  (
    input: DescribeConfigurationSetsRequest,
  ): effect.Effect<
    DescribeConfigurationSetsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeConfigurationSetsRequest,
  ) => stream.Stream<
    DescribeConfigurationSetsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeConfigurationSetsRequest,
  ) => stream.Stream<
    ConfigurationSetInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeConfigurationSetsRequest,
  output: DescribeConfigurationSetsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConfigurationSets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes the specified keywords or all keywords on your origination phone number or pool.
 *
 * A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, End User Messaging SMS responds with a customizable message.
 *
 * If you specify a keyword that isn't valid, an error is returned.
 */
export const describeKeywords: {
  (
    input: DescribeKeywordsRequest,
  ): effect.Effect<
    DescribeKeywordsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeKeywordsRequest,
  ) => stream.Stream<
    DescribeKeywordsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeKeywordsRequest,
  ) => stream.Stream<
    KeywordInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeKeywordsRequest,
  output: DescribeKeywordsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Keywords",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes the specified opted out destination numbers or all opted out destination numbers in an opt-out list.
 *
 * If you specify opted out numbers, the output includes information for only the specified opted out numbers. If you specify filters, the output includes information for only those opted out numbers that meet the filter criteria. If you don't specify opted out numbers or filters, the output includes information for all opted out destination numbers in your opt-out list.
 *
 * If you specify an opted out number that isn't valid, an exception is returned.
 */
export const describeOptedOutNumbers: {
  (
    input: DescribeOptedOutNumbersRequest,
  ): effect.Effect<
    DescribeOptedOutNumbersResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOptedOutNumbersRequest,
  ) => stream.Stream<
    DescribeOptedOutNumbersResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOptedOutNumbersRequest,
  ) => stream.Stream<
    OptedOutNumberInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOptedOutNumbersRequest,
  output: DescribeOptedOutNumbersResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OptedOutNumbers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes the specified origination phone number, or all the phone numbers in your account.
 *
 * If you specify phone number IDs, the output includes information for only the specified phone numbers. If you specify filters, the output includes information for only those phone numbers that meet the filter criteria. If you don't specify phone number IDs or filters, the output includes information for all phone numbers.
 *
 * If you specify a phone number ID that isn't valid, an error is returned.
 */
export const describePhoneNumbers: {
  (
    input: DescribePhoneNumbersRequest,
  ): effect.Effect<
    DescribePhoneNumbersResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePhoneNumbersRequest,
  ) => stream.Stream<
    DescribePhoneNumbersResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribePhoneNumbersRequest,
  ) => stream.Stream<
    PhoneNumberInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePhoneNumbersRequest,
  output: DescribePhoneNumbersResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
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
 * Retrieves the specified pools or all pools associated with your Amazon Web Services account.
 *
 * If you specify pool IDs, the output includes information for only the specified pools. If you specify filters, the output includes information for only those pools that meet the filter criteria. If you don't specify pool IDs or filters, the output includes information for all pools.
 *
 * If you specify a pool ID that isn't valid, an error is returned.
 *
 * A pool is a collection of phone numbers and SenderIds. A pool can include one or more phone numbers and SenderIds that are associated with your Amazon Web Services account.
 */
export const describePools: {
  (
    input: DescribePoolsRequest,
  ): effect.Effect<
    DescribePoolsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePoolsRequest,
  ) => stream.Stream<
    DescribePoolsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribePoolsRequest,
  ) => stream.Stream<
    PoolInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePoolsRequest,
  output: DescribePoolsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Pools",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the protect configurations that match any of filters. If a filter isn’t provided then all protect configurations are returned.
 */
export const describeProtectConfigurations: {
  (
    input: DescribeProtectConfigurationsRequest,
  ): effect.Effect<
    DescribeProtectConfigurationsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeProtectConfigurationsRequest,
  ) => stream.Stream<
    DescribeProtectConfigurationsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeProtectConfigurationsRequest,
  ) => stream.Stream<
    ProtectConfigurationInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeProtectConfigurationsRequest,
  output: DescribeProtectConfigurationsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ProtectConfigurations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the specified registration attachments or all registration attachments associated with your Amazon Web Services account.
 */
export const describeRegistrationAttachments: {
  (
    input: DescribeRegistrationAttachmentsRequest,
  ): effect.Effect<
    DescribeRegistrationAttachmentsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRegistrationAttachmentsRequest,
  ) => stream.Stream<
    DescribeRegistrationAttachmentsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRegistrationAttachmentsRequest,
  ) => stream.Stream<
    RegistrationAttachmentsInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRegistrationAttachmentsRequest,
  output: DescribeRegistrationAttachmentsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RegistrationAttachments",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the specified registrations.
 */
export const describeRegistrations: {
  (
    input: DescribeRegistrationsRequest,
  ): effect.Effect<
    DescribeRegistrationsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRegistrationsRequest,
  ) => stream.Stream<
    DescribeRegistrationsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRegistrationsRequest,
  ) => stream.Stream<
    RegistrationInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRegistrationsRequest,
  output: DescribeRegistrationsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Registrations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the specified registration section definitions. You can use DescribeRegistrationSectionDefinitions to view the requirements for creating, filling out, and submitting each registration type.
 */
export const describeRegistrationSectionDefinitions: {
  (
    input: DescribeRegistrationSectionDefinitionsRequest,
  ): effect.Effect<
    DescribeRegistrationSectionDefinitionsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRegistrationSectionDefinitionsRequest,
  ) => stream.Stream<
    DescribeRegistrationSectionDefinitionsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRegistrationSectionDefinitionsRequest,
  ) => stream.Stream<
    RegistrationSectionDefinition,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRegistrationSectionDefinitionsRequest,
  output: DescribeRegistrationSectionDefinitionsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RegistrationSectionDefinitions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes the specified SenderIds or all SenderIds associated with your Amazon Web Services account.
 *
 * If you specify SenderIds, the output includes information for only the specified SenderIds. If you specify filters, the output includes information for only those SenderIds that meet the filter criteria. If you don't specify SenderIds or filters, the output includes information for all SenderIds.
 *
 * f you specify a sender ID that isn't valid, an error is returned.
 */
export const describeSenderIds: {
  (
    input: DescribeSenderIdsRequest,
  ): effect.Effect<
    DescribeSenderIdsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSenderIdsRequest,
  ) => stream.Stream<
    DescribeSenderIdsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSenderIdsRequest,
  ) => stream.Stream<
    SenderIdInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSenderIdsRequest,
  output: DescribeSenderIdsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SenderIds",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the specified verified destination numbers.
 */
export const describeVerifiedDestinationNumbers: {
  (
    input: DescribeVerifiedDestinationNumbersRequest,
  ): effect.Effect<
    DescribeVerifiedDestinationNumbersResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeVerifiedDestinationNumbersRequest,
  ) => stream.Stream<
    DescribeVerifiedDestinationNumbersResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeVerifiedDestinationNumbersRequest,
  ) => stream.Stream<
    VerifiedDestinationNumberInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeVerifiedDestinationNumbersRequest,
  output: DescribeVerifiedDestinationNumbersResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "VerifiedDestinationNumbers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all associated origination identities in your pool.
 *
 * If you specify filters, the output includes information for only those origination identities that meet the filter criteria.
 */
export const listPoolOriginationIdentities: {
  (
    input: ListPoolOriginationIdentitiesRequest,
  ): effect.Effect<
    ListPoolOriginationIdentitiesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPoolOriginationIdentitiesRequest,
  ) => stream.Stream<
    ListPoolOriginationIdentitiesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPoolOriginationIdentitiesRequest,
  ) => stream.Stream<
    OriginationIdentityMetadata,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPoolOriginationIdentitiesRequest,
  output: ListPoolOriginationIdentitiesResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OriginationIdentities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve all of the protect configuration rule set number overrides that match the filters.
 */
export const listProtectConfigurationRuleSetNumberOverrides: {
  (
    input: ListProtectConfigurationRuleSetNumberOverridesRequest,
  ): effect.Effect<
    ListProtectConfigurationRuleSetNumberOverridesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProtectConfigurationRuleSetNumberOverridesRequest,
  ) => stream.Stream<
    ListProtectConfigurationRuleSetNumberOverridesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProtectConfigurationRuleSetNumberOverridesRequest,
  ) => stream.Stream<
    ProtectConfigurationRuleSetNumberOverride,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProtectConfigurationRuleSetNumberOverridesRequest,
  output: ListProtectConfigurationRuleSetNumberOverridesResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RuleSetNumberOverrides",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve all of the origination identities that are associated with a registration.
 */
export const listRegistrationAssociations: {
  (
    input: ListRegistrationAssociationsRequest,
  ): effect.Effect<
    ListRegistrationAssociationsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRegistrationAssociationsRequest,
  ) => stream.Stream<
    ListRegistrationAssociationsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRegistrationAssociationsRequest,
  ) => stream.Stream<
    RegistrationAssociationMetadata,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRegistrationAssociationsRequest,
  output: ListRegistrationAssociationsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RegistrationAssociations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Update a country rule set to `ALLOW`, `BLOCK`, `MONITOR`, or `FILTER` messages to be sent to the specified destination counties. You can update one or multiple countries at a time. The updates are only applied to the specified NumberCapability type.
 */
export const updateProtectConfigurationCountryRuleSet: (
  input: UpdateProtectConfigurationCountryRuleSetRequest,
) => effect.Effect<
  UpdateProtectConfigurationCountryRuleSetResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns information about a destination phone number, including whether the number type and whether it is valid, the carrier, and more.
 */
export const carrierLookup: (
  input: CarrierLookupRequest,
) => effect.Effect<
  CarrierLookupResult,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an existing configuration set.
 *
 * A configuration set is a set of rules that you apply to voice and SMS messages that you send. In a configuration set, you can specify a destination for specific types of events related to voice and SMS messages.
 */
export const deleteConfigurationSet: (
  input: DeleteConfigurationSetRequest,
) => effect.Effect<
  DeleteConfigurationSetResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfigurationSetRequest,
  output: DeleteConfigurationSetResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing keyword from an origination phone number or pool.
 *
 * A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, End User Messaging SMS responds with a customizable message.
 *
 * Keywords "HELP" and "STOP" can't be deleted or modified.
 */
export const deleteKeyword: (
  input: DeleteKeywordRequest,
) => effect.Effect<
  DeleteKeywordResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Describes the specified opt-out list or all opt-out lists in your account.
 *
 * If you specify opt-out list names, the output includes information for only the specified opt-out lists. Opt-out lists include only those that meet the filter criteria. If you don't specify opt-out list names or filters, the output includes information for all opt-out lists.
 *
 * If you specify an opt-out list name that isn't valid, an error is returned.
 */
export const describeOptOutLists: {
  (
    input: DescribeOptOutListsRequest,
  ): effect.Effect<
    DescribeOptOutListsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOptOutListsRequest,
  ) => stream.Stream<
    DescribeOptOutListsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOptOutListsRequest,
  ) => stream.Stream<
    OptOutListInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOptOutListsRequest,
  output: DescribeOptOutListsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "OptOutLists",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the specified registration field values.
 */
export const describeRegistrationFieldValues: {
  (
    input: DescribeRegistrationFieldValuesRequest,
  ): effect.Effect<
    DescribeRegistrationFieldValuesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRegistrationFieldValuesRequest,
  ) => stream.Stream<
    DescribeRegistrationFieldValuesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRegistrationFieldValuesRequest,
  ) => stream.Stream<
    RegistrationFieldValueInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRegistrationFieldValuesRequest,
  output: DescribeRegistrationFieldValuesResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RegistrationFieldValues",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Before you can send test messages to a verified destination phone number you need to opt-in the verified destination phone number. Creates a new text message with a verification code and send it to a verified destination phone number. Once you have the verification code use VerifyDestinationNumber to opt-in the verified destination phone number to receive messages.
 */
export const sendDestinationNumberVerificationCode: (
  input: SendDestinationNumberVerificationCodeRequest,
) => effect.Effect<
  SendDestinationNumberVerificationCodeResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an existing default message type on a configuration set.
 *
 * A message type is a type of messages that you plan to send. If you send account-related messages or time-sensitive messages such as one-time passcodes, choose **Transactional**. If you plan to send messages that contain marketing material or other promotional content, choose **Promotional**. This setting applies to your entire Amazon Web Services account.
 */
export const deleteDefaultMessageType: (
  input: DeleteDefaultMessageTypeRequest,
) => effect.Effect<
  DeleteDefaultMessageTypeResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDefaultMessageTypeRequest,
  output: DeleteDefaultMessageTypeResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing default sender ID on a configuration set.
 *
 * A default sender ID is the identity that appears on recipients' devices when they receive SMS messages. Support for sender ID capabilities varies by country or region.
 */
export const deleteDefaultSenderId: (
  input: DeleteDefaultSenderIdRequest,
) => effect.Effect<
  DeleteDefaultSenderIdResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDefaultSenderIdRequest,
  output: DeleteDefaultSenderIdResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing event destination.
 *
 * An event destination is a location where you send response information about the messages that you send. For example, when a message is delivered successfully, you can send information about that event to an Amazon CloudWatch destination, or send notifications to endpoints that are subscribed to an Amazon SNS topic.
 */
export const deleteEventDestination: (
  input: DeleteEventDestinationRequest,
) => effect.Effect<
  DeleteEventDestinationResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventDestinationRequest,
  output: DeleteEventDestinationResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Permanently delete the protect configuration rule set number override.
 */
export const deleteProtectConfigurationRuleSetNumberOverride: (
  input: DeleteProtectConfigurationRuleSetNumberOverrideRequest,
) => effect.Effect<
  DeleteProtectConfigurationRuleSetNumberOverrideResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the resource-based policy document attached to the End User Messaging SMS resource. A shared resource can be a Pool, Opt-out list, Sender Id, or Phone number.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieve the CountryRuleSet for the specified NumberCapability from a protect configuration.
 */
export const getProtectConfigurationCountryRuleSet: (
  input: GetProtectConfigurationCountryRuleSetRequest,
) => effect.Effect<
  GetProtectConfigurationCountryRuleSetResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => effect.Effect<
  GetResourcePolicyResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Set the MessageFeedbackStatus as `RECEIVED` or `FAILED` for the passed in MessageId.
 *
 * If you use message feedback then you must update message feedback record. When you receive a signal that a user has received the message you must use `PutMessageFeedback` to set the message feedback record as `RECEIVED`; Otherwise, an hour after the message feedback record is set to `FAILED`.
 */
export const putMessageFeedback: (
  input: PutMessageFeedbackRequest,
) => effect.Effect<
  PutMessageFeedbackResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putOptedOutNumber: (
  input: PutOptedOutNumberRequest,
) => effect.Effect<
  PutOptedOutNumberResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Attaches a resource-based policy to a End User Messaging SMS resource(phone number, sender Id, phone poll, or opt-out list) that is used for sharing the resource. A shared resource can be a Pool, Opt-out list, Sender Id, or Phone number. For more information about resource-based policies, see Working with shared resources in the *End User Messaging SMS User Guide*.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Set a protect configuration as your account default. You can only have one account default protect configuration at a time. The current account default protect configuration is replaced with the provided protect configuration.
 */
export const setAccountDefaultProtectConfiguration: (
  input: SetAccountDefaultProtectConfigurationRequest,
) => effect.Effect<
  SetAccountDefaultProtectConfigurationResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setDefaultMessageFeedbackEnabled: (
  input: SetDefaultMessageFeedbackEnabledRequest,
) => effect.Effect<
  SetDefaultMessageFeedbackEnabledResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setDefaultMessageType: (
  input: SetDefaultMessageTypeRequest,
) => effect.Effect<
  SetDefaultMessageTypeResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetDefaultMessageTypeRequest,
  output: SetDefaultMessageTypeResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sets default sender ID on a configuration set.
 *
 * When sending a text message to a destination country that supports sender IDs, the default sender ID on the configuration set specified will be used if no dedicated origination phone numbers or registered sender IDs are available in your account.
 */
export const setDefaultSenderId: (
  input: SetDefaultSenderIdRequest,
) => effect.Effect<
  SetDefaultSenderIdResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Update the setting for an existing protect configuration.
 */
export const updateProtectConfiguration: (
  input: UpdateProtectConfigurationRequest,
) => effect.Effect<
  UpdateProtectConfigurationResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProtectConfigurationRequest,
  output: UpdateProtectConfigurationResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an existing sender ID.
 */
export const updateSenderId: (
  input: UpdateSenderIdRequest,
) => effect.Effect<
  UpdateSenderIdResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds or overwrites only the specified tags for the specified resource. When you specify an existing tag key, the value is overwritten with the new value. Each tag consists of a key and an optional value. Tag keys must be unique per resource. For more information about tags, see Tags in the *End User Messaging SMS User Guide*.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes the association of the specified tags from a resource. For more information on tags see Tags in the *End User Messaging SMS User Guide*.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an existing opted out destination phone number from the specified opt-out list.
 *
 * Each destination phone number can only be deleted once every 30 days.
 *
 * If the specified destination phone number doesn't exist or if the opt-out list doesn't exist, an error is returned.
 */
export const deleteOptedOutNumber: (
  input: DeleteOptedOutNumberRequest,
) => effect.Effect<
  DeleteOptedOutNumberResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes an existing opt-out list. All opted out phone numbers in the opt-out list are deleted.
 *
 * If the specified opt-out list name doesn't exist or is in-use by an origination phone number or pool, an error is returned.
 */
export const deleteOptOutList: (
  input: DeleteOptOutListRequest,
) => effect.Effect<
  DeleteOptOutListResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePool: (
  input: DeletePoolRequest,
) => effect.Effect<
  DeletePoolResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProtectConfiguration: (
  input: DeleteProtectConfigurationRequest,
) => effect.Effect<
  DeleteProtectConfigurationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Permanently delete an existing registration from your account.
 */
export const deleteRegistration: (
  input: DeleteRegistrationRequest,
) => effect.Effect<
  DeleteRegistrationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRegistrationAttachment: (
  input: DeleteRegistrationAttachmentRequest,
) => effect.Effect<
  DeleteRegistrationAttachmentResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRegistrationFieldValue: (
  input: DeleteRegistrationFieldValueRequest,
) => effect.Effect<
  DeleteRegistrationFieldValueResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Delete a verified destination phone number.
 */
export const deleteVerifiedDestinationNumber: (
  input: DeleteVerifiedDestinationNumberRequest,
) => effect.Effect<
  DeleteVerifiedDestinationNumberResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateOriginationIdentity: (
  input: DisassociateOriginationIdentityRequest,
) => effect.Effect<
  DisassociateOriginationIdentityResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateProtectConfiguration: (
  input: DisassociateProtectConfigurationRequest,
) => effect.Effect<
  DisassociateProtectConfigurationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const discardRegistrationVersion: (
  input: DiscardRegistrationVersionRequest,
) => effect.Effect<
  DiscardRegistrationVersionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates or updates a keyword configuration on an origination phone number or pool.
 *
 * A keyword is a word that you can search for on a particular phone number or pool. It is also a specific word or phrase that an end user can send to your number to elicit a response, such as an informational message or a special offer. When your number receives a message that begins with a keyword, End User Messaging SMS responds with a customizable message.
 *
 * If you specify a keyword that isn't valid, an error is returned.
 */
export const putKeyword: (
  input: PutKeywordRequest,
) => effect.Effect<
  PutKeywordResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates or updates a field value for a registration.
 */
export const putRegistrationFieldValue: (
  input: PutRegistrationFieldValueRequest,
) => effect.Effect<
  PutRegistrationFieldValueResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Releases an existing origination phone number in your account. Once released, a phone number is no longer available for sending messages.
 *
 * If the origination phone number has deletion protection enabled or is associated with a pool, an error is returned.
 */
export const releasePhoneNumber: (
  input: ReleasePhoneNumberRequest,
) => effect.Effect<
  ReleasePhoneNumberResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const releaseSenderId: (
  input: ReleaseSenderIdRequest,
) => effect.Effect<
  ReleaseSenderIdResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const requestPhoneNumber: (
  input: RequestPhoneNumberRequest,
) => effect.Effect<
  RequestPhoneNumberResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new multimedia message (MMS) and sends it to a recipient's phone number.
 */
export const sendMediaMessage: (
  input: SendMediaMessageRequest,
) => effect.Effect<
  SendMediaMessageResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const sendTextMessage: (
  input: SendTextMessageRequest,
) => effect.Effect<
  SendTextMessageResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const sendVoiceMessage: (
  input: SendVoiceMessageRequest,
) => effect.Effect<
  SendVoiceMessageResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Submit the specified registration for review and approval.
 */
export const submitRegistrationVersion: (
  input: SubmitRegistrationVersionRequest,
) => effect.Effect<
  SubmitRegistrationVersionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates an existing event destination in a configuration set. You can update the IAM role ARN for CloudWatch Logs and Firehose. You can also enable or disable the event destination.
 *
 * You may want to update an event destination to change its matching event types or updating the destination resource ARN. You can't change an event destination's type between CloudWatch Logs, Firehose, and Amazon SNS.
 */
export const updateEventDestination: (
  input: UpdateEventDestinationRequest,
) => effect.Effect<
  UpdateEventDestinationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the configuration of an existing origination phone number. You can update the opt-out list, enable or disable two-way messaging, change the TwoWayChannelArn, enable or disable self-managed opt-outs, and enable or disable deletion protection.
 *
 * If the origination phone number is associated with a pool, an error is returned.
 */
export const updatePhoneNumber: (
  input: UpdatePhoneNumberRequest,
) => effect.Effect<
  UpdatePhoneNumberResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePool: (
  input: UpdatePoolRequest,
) => effect.Effect<
  UpdatePoolResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Use the verification code that was received by the verified destination phone number to opt-in the verified destination phone number to receive more messages.
 */
export const verifyDestinationNumber: (
  input: VerifyDestinationNumberRequest,
) => effect.Effect<
  VerifyDestinationNumberResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Associates the specified origination identity with a pool.
 *
 * If the origination identity is a phone number and is already associated with another pool, an error is returned. A sender ID can be associated with multiple pools.
 *
 * If the origination identity configuration doesn't match the pool's configuration, an error is returned.
 */
export const associateOriginationIdentity: (
  input: AssociateOriginationIdentityRequest,
) => effect.Effect<
  AssociateOriginationIdentityResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Associate a protect configuration with a configuration set. This replaces the configuration sets current protect configuration. A configuration set can only be associated with one protect configuration at a time. A protect configuration can be associated with multiple configuration sets.
 */
export const associateProtectConfiguration: (
  input: AssociateProtectConfigurationRequest,
) => effect.Effect<
  AssociateProtectConfigurationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new pool and associates the specified origination identity to the pool. A pool can include one or more phone numbers and SenderIds that are associated with your Amazon Web Services account.
 *
 * The new pool inherits its configuration from the specified origination identity. This includes keywords, message type, opt-out list, two-way configuration, and self-managed opt-out configuration. Deletion protection isn't inherited from the origination identity and defaults to false.
 *
 * If the origination identity is a phone number and is already associated with another pool, an error is returned. A sender ID can be associated with multiple pools.
 */
export const createPool: (
  input: CreatePoolRequest,
) => effect.Effect<
  CreatePoolResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Associate the registration with an origination identity such as a phone number or sender ID.
 */
export const createRegistrationAssociation: (
  input: CreateRegistrationAssociationRequest,
) => effect.Effect<
  CreateRegistrationAssociationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new event destination in a configuration set.
 *
 * An event destination is a location where you send message events. The event options are Amazon CloudWatch, Amazon Data Firehose, or Amazon SNS. For example, when a message is delivered successfully, you can send information about that event to an event destination, or send notifications to endpoints that are subscribed to an Amazon SNS topic.
 *
 * You can only create one event destination at a time. You must provide a value for a single event destination using either `CloudWatchLogsDestination`, `KinesisFirehoseDestination` or `SnsDestination`. If an event destination isn't provided then an exception is returned.
 *
 * Each configuration set can contain between 0 and 5 event destinations. Each event destination can contain a reference to a single destination, such as a CloudWatch or Firehose destination.
 */
export const createEventDestination: (
  input: CreateEventDestinationRequest,
) => effect.Effect<
  CreateEventDestinationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Create a new version of the registration and increase the **VersionNumber**. The previous version of the registration becomes read-only.
 */
export const createRegistrationVersion: (
  input: CreateRegistrationVersionRequest,
) => effect.Effect<
  CreateRegistrationVersionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Describes the current End User Messaging SMS SMS Voice V2 resource quotas for your account. The description for a quota includes the quota name, current usage toward that quota, and the quota's maximum value.
 *
 * When you establish an Amazon Web Services account, the account has initial quotas on the maximum number of configuration sets, opt-out lists, phone numbers, and pools that you can create in a given Region. For more information see Quotas in the *End User Messaging SMS User Guide*.
 */
export const describeAccountLimits: {
  (
    input: DescribeAccountLimitsRequest,
  ): effect.Effect<
    DescribeAccountLimitsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAccountLimitsRequest,
  ) => stream.Stream<
    DescribeAccountLimitsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAccountLimitsRequest,
  ) => stream.Stream<
    AccountLimit,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAccountLimitsRequest,
  output: DescribeAccountLimitsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AccountLimits",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes the current monthly spend limits for sending voice and text messages.
 *
 * When you establish an Amazon Web Services account, the account has initial monthly spend limit in a given Region. For more information on increasing your monthly spend limit, see Requesting increases to your monthly SMS, MMS, or Voice spending quota in the *End User Messaging SMS User Guide*.
 */
export const describeSpendLimits: {
  (
    input: DescribeSpendLimitsRequest,
  ): effect.Effect<
    DescribeSpendLimitsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSpendLimitsRequest,
  ) => stream.Stream<
    DescribeSpendLimitsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSpendLimitsRequest,
  ) => stream.Stream<
    SpendLimit,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSpendLimitsRequest,
  output: DescribeSpendLimitsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SpendLimits",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Sets an account level monthly spend limit override for sending MMS messages. The requested spend limit must be less than or equal to the `MaxLimit`, which is set by Amazon Web Services.
 */
export const setMediaMessageSpendLimitOverride: (
  input: SetMediaMessageSpendLimitOverrideRequest,
) => effect.Effect<
  SetMediaMessageSpendLimitOverrideResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setTextMessageSpendLimitOverride: (
  input: SetTextMessageSpendLimitOverrideRequest,
) => effect.Effect<
  SetTextMessageSpendLimitOverrideResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setVoiceMessageSpendLimitOverride: (
  input: SetVoiceMessageSpendLimitOverrideRequest,
) => effect.Effect<
  SetVoiceMessageSpendLimitOverrideResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an account-level monthly spending limit override for sending multimedia messages (MMS). Deleting a spend limit override will set the `EnforcedLimit` to equal the `MaxLimit`, which is controlled by Amazon Web Services. For more information on spend limits (quotas) see Quotas for Server Migration Service in the *Server Migration Service User Guide*.
 */
export const deleteMediaMessageSpendLimitOverride: (
  input: DeleteMediaMessageSpendLimitOverrideRequest,
) => effect.Effect<
  DeleteMediaMessageSpendLimitOverrideResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an account-level monthly spending limit override for sending text messages. Deleting a spend limit override will set the `EnforcedLimit` to equal the `MaxLimit`, which is controlled by Amazon Web Services. For more information on spend limits (quotas) see Quotas in the *End User Messaging SMS User Guide*.
 */
export const deleteTextMessageSpendLimitOverride: (
  input: DeleteTextMessageSpendLimitOverrideRequest,
) => effect.Effect<
  DeleteTextMessageSpendLimitOverrideResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an account level monthly spend limit override for sending voice messages. Deleting a spend limit override sets the `EnforcedLimit` equal to the `MaxLimit`, which is controlled by Amazon Web Services. For more information on spending limits (quotas) see Quotas in the *End User Messaging SMS User Guide*.
 */
export const deleteVoiceMessageSpendLimitOverride: (
  input: DeleteVoiceMessageSpendLimitOverrideRequest,
) => effect.Effect<
  DeleteVoiceMessageSpendLimitOverrideResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes the current account default protect configuration.
 */
export const deleteAccountDefaultProtectConfiguration: (
  input: DeleteAccountDefaultProtectConfigurationRequest,
) => effect.Effect<
  DeleteAccountDefaultProtectConfigurationResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Create or update a phone number rule override and associate it with a protect configuration.
 */
export const putProtectConfigurationRuleSetNumberOverride: (
  input: PutProtectConfigurationRuleSetNumberOverrideRequest,
) => effect.Effect<
  PutProtectConfigurationRuleSetNumberOverrideResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Request a new sender ID that doesn't require registration.
 */
export const requestSenderId: (
  input: RequestSenderIdRequest,
) => effect.Effect<
  RequestSenderIdResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new opt-out list.
 *
 * If the opt-out list name already exists, an error is returned.
 *
 * An opt-out list is a list of phone numbers that are opted out, meaning you can't send SMS or voice messages to them. If end user replies with the keyword "STOP," an entry for the phone number is added to the opt-out list. In addition to STOP, your recipients can use any supported opt-out keyword, such as CANCEL or OPTOUT. For a list of supported opt-out keywords, see SMS opt out in the End User Messaging SMS User Guide.
 */
export const createOptOutList: (
  input: CreateOptOutListRequest,
) => effect.Effect<
  CreateOptOutListResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Create a new protect configuration. By default all country rule sets for each capability are set to `ALLOW`. Update the country rule sets using `UpdateProtectConfigurationCountryRuleSet`. A protect configurations name is stored as a Tag with the key set to `Name` and value as the name of the protect configuration.
 */
export const createProtectConfiguration: (
  input: CreateProtectConfigurationRequest,
) => effect.Effect<
  CreateProtectConfigurationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Create a new registration attachment to use for uploading a file or a URL to a file. The maximum file size is 500KB and valid file extensions are PDF, JPEG and PNG. For example, many sender ID registrations require a signed “letter of authorization” (LOA) to be submitted.
 *
 * Use either `AttachmentUrl` or `AttachmentBody` to upload your attachment. If both are specified then an exception is returned.
 */
export const createRegistrationAttachment: (
  input: CreateRegistrationAttachmentRequest,
) => effect.Effect<
  CreateRegistrationAttachmentResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVerifiedDestinationNumber: (
  input: CreateVerifiedDestinationNumberRequest,
) => effect.Effect<
  CreateVerifiedDestinationNumberResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new configuration set. After you create the configuration set, you can add one or more event destinations to it.
 *
 * A configuration set is a set of rules that you apply to the SMS and voice messages that you send.
 *
 * When you send a message, you can optionally specify a single configuration set.
 */
export const createConfigurationSet: (
  input: CreateConfigurationSetRequest,
) => effect.Effect<
  CreateConfigurationSetResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new registration based on the **RegistrationType** field.
 */
export const createRegistration: (
  input: CreateRegistrationRequest,
) => effect.Effect<
  CreateRegistrationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the specified registration type field definitions. You can use DescribeRegistrationFieldDefinitions to view the requirements for creating, filling out, and submitting each registration type.
 */
export const describeRegistrationFieldDefinitions: {
  (
    input: DescribeRegistrationFieldDefinitionsRequest,
  ): effect.Effect<
    DescribeRegistrationFieldDefinitionsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRegistrationFieldDefinitionsRequest,
  ) => stream.Stream<
    DescribeRegistrationFieldDefinitionsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRegistrationFieldDefinitionsRequest,
  ) => stream.Stream<
    RegistrationFieldDefinition,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRegistrationFieldDefinitionsRequest,
  output: DescribeRegistrationFieldDefinitionsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RegistrationFieldDefinitions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the specified registration type definitions. You can use DescribeRegistrationTypeDefinitions to view the requirements for creating, filling out, and submitting each registration type.
 */
export const describeRegistrationTypeDefinitions: {
  (
    input: DescribeRegistrationTypeDefinitionsRequest,
  ): effect.Effect<
    DescribeRegistrationTypeDefinitionsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRegistrationTypeDefinitionsRequest,
  ) => stream.Stream<
    DescribeRegistrationTypeDefinitionsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRegistrationTypeDefinitionsRequest,
  ) => stream.Stream<
    RegistrationTypeDefinition,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRegistrationTypeDefinitionsRequest,
  output: DescribeRegistrationTypeDefinitionsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RegistrationTypeDefinitions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the specified registration version.
 */
export const describeRegistrationVersions: {
  (
    input: DescribeRegistrationVersionsRequest,
  ): effect.Effect<
    DescribeRegistrationVersionsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRegistrationVersionsRequest,
  ) => stream.Stream<
    DescribeRegistrationVersionsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRegistrationVersionsRequest,
  ) => stream.Stream<
    RegistrationVersionInformation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRegistrationVersionsRequest,
  output: DescribeRegistrationVersionsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RegistrationVersions",
    pageSize: "MaxResults",
  } as const,
}));

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
const ns = T.XmlNamespace("http://sns.amazonaws.com/doc/2010-03-31/");
const svc = T.AwsApiService({
  sdkId: "SNS",
  serviceShapeName: "AmazonSimpleNotificationService",
});
const auth = T.AwsAuthSigv4({ name: "sns" });
const ver = T.ServiceVersion("2010-03-31");
const proto = T.AwsProtocolsAwsQuery();
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
              `https://sns-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (Region === "us-gov-east-1") {
              return e("https://sns.us-gov-east-1.amazonaws.com");
            }
            if (Region === "us-gov-west-1") {
              return e("https://sns.us-gov-west-1.amazonaws.com");
            }
            return e(
              `https://sns-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://sns.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://sns.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type TopicARN = string;
export type Label = string;
export type Delegate = string;
export type Action = string;
export type PhoneNumber = string | redacted.Redacted<string>;
export type Token = string;
export type AuthenticateOnUnsubscribe = string;
export type PhoneNumberString = string | redacted.Redacted<string>;
export type TopicName = string;
export type AttributeValue = string;
export type SubscriptionARN = string;
export type NextToken = string;
export type MaxItemsListOriginationNumbers = number;
export type MaxItems = number;
export type AmazonResourceName = string;
export type Message = string;
export type Subject = string;
export type MessageStructure = string;
export type AttributeName = string;
export type Protocol = string;
export type Endpoint2 = string;
export type TagKey = string;
export type OTPCode = string;
export type TagValue = string;
export type Binary = Uint8Array;
export type Iso2CountryCode = string;
export type Account = string;
export type MessageId = string;

//# Schemas
export interface GetSMSSandboxAccountStatusInput {}
export const GetSMSSandboxAccountStatusInput = S.suspend(() =>
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
  identifier: "GetSMSSandboxAccountStatusInput",
}) as any as S.Schema<GetSMSSandboxAccountStatusInput>;
export type DelegatesList = string[];
export const DelegatesList = S.Array(S.String);
export type ActionsList = string[];
export const ActionsList = S.Array(S.String);
export type LanguageCodeString =
  | "en-US"
  | "en-GB"
  | "es-419"
  | "es-ES"
  | "de-DE"
  | "fr-CA"
  | "fr-FR"
  | "it-IT"
  | "ja-JP"
  | "pt-BR"
  | "kr-KR"
  | "zh-CN"
  | "zh-TW"
  | (string & {});
export const LanguageCodeString = S.String;
export type ListString = string[];
export const ListString = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AddPermissionInput {
  TopicArn: string;
  Label: string;
  AWSAccountId: string[];
  ActionName: string[];
}
export const AddPermissionInput = S.suspend(() =>
  S.Struct({
    TopicArn: S.String,
    Label: S.String,
    AWSAccountId: DelegatesList,
    ActionName: ActionsList,
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
  identifier: "AddPermissionInput",
}) as any as S.Schema<AddPermissionInput>;
export interface AddPermissionResponse {}
export const AddPermissionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddPermissionResponse",
}) as any as S.Schema<AddPermissionResponse>;
export interface CheckIfPhoneNumberIsOptedOutInput {
  phoneNumber: string | redacted.Redacted<string>;
}
export const CheckIfPhoneNumberIsOptedOutInput = S.suspend(() =>
  S.Struct({ phoneNumber: SensitiveString }).pipe(
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
  identifier: "CheckIfPhoneNumberIsOptedOutInput",
}) as any as S.Schema<CheckIfPhoneNumberIsOptedOutInput>;
export interface ConfirmSubscriptionInput {
  TopicArn: string;
  Token: string;
  AuthenticateOnUnsubscribe?: string;
}
export const ConfirmSubscriptionInput = S.suspend(() =>
  S.Struct({
    TopicArn: S.String,
    Token: S.String,
    AuthenticateOnUnsubscribe: S.optional(S.String),
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
  identifier: "ConfirmSubscriptionInput",
}) as any as S.Schema<ConfirmSubscriptionInput>;
export type MapStringToString = { [key: string]: string | undefined };
export const MapStringToString = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreatePlatformEndpointInput {
  PlatformApplicationArn: string;
  Token: string;
  CustomUserData?: string;
  Attributes?: { [key: string]: string | undefined };
}
export const CreatePlatformEndpointInput = S.suspend(() =>
  S.Struct({
    PlatformApplicationArn: S.String,
    Token: S.String,
    CustomUserData: S.optional(S.String),
    Attributes: S.optional(MapStringToString),
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
  identifier: "CreatePlatformEndpointInput",
}) as any as S.Schema<CreatePlatformEndpointInput>;
export interface CreateSMSSandboxPhoneNumberInput {
  PhoneNumber: string | redacted.Redacted<string>;
  LanguageCode?: LanguageCodeString;
}
export const CreateSMSSandboxPhoneNumberInput = S.suspend(() =>
  S.Struct({
    PhoneNumber: SensitiveString,
    LanguageCode: S.optional(LanguageCodeString),
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
  identifier: "CreateSMSSandboxPhoneNumberInput",
}) as any as S.Schema<CreateSMSSandboxPhoneNumberInput>;
export interface CreateSMSSandboxPhoneNumberResult {}
export const CreateSMSSandboxPhoneNumberResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateSMSSandboxPhoneNumberResult",
}) as any as S.Schema<CreateSMSSandboxPhoneNumberResult>;
export interface DeleteEndpointInput {
  EndpointArn: string;
}
export const DeleteEndpointInput = S.suspend(() =>
  S.Struct({ EndpointArn: S.String }).pipe(
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
  identifier: "DeleteEndpointInput",
}) as any as S.Schema<DeleteEndpointInput>;
export interface DeleteEndpointResponse {}
export const DeleteEndpointResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteEndpointResponse",
}) as any as S.Schema<DeleteEndpointResponse>;
export interface DeletePlatformApplicationInput {
  PlatformApplicationArn: string;
}
export const DeletePlatformApplicationInput = S.suspend(() =>
  S.Struct({ PlatformApplicationArn: S.String }).pipe(
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
  identifier: "DeletePlatformApplicationInput",
}) as any as S.Schema<DeletePlatformApplicationInput>;
export interface DeletePlatformApplicationResponse {}
export const DeletePlatformApplicationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePlatformApplicationResponse",
}) as any as S.Schema<DeletePlatformApplicationResponse>;
export interface DeleteSMSSandboxPhoneNumberInput {
  PhoneNumber: string | redacted.Redacted<string>;
}
export const DeleteSMSSandboxPhoneNumberInput = S.suspend(() =>
  S.Struct({ PhoneNumber: SensitiveString }).pipe(
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
  identifier: "DeleteSMSSandboxPhoneNumberInput",
}) as any as S.Schema<DeleteSMSSandboxPhoneNumberInput>;
export interface DeleteSMSSandboxPhoneNumberResult {}
export const DeleteSMSSandboxPhoneNumberResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSMSSandboxPhoneNumberResult",
}) as any as S.Schema<DeleteSMSSandboxPhoneNumberResult>;
export interface DeleteTopicInput {
  TopicArn: string;
}
export const DeleteTopicInput = S.suspend(() =>
  S.Struct({ TopicArn: S.String }).pipe(
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
  identifier: "DeleteTopicInput",
}) as any as S.Schema<DeleteTopicInput>;
export interface DeleteTopicResponse {}
export const DeleteTopicResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTopicResponse",
}) as any as S.Schema<DeleteTopicResponse>;
export interface GetDataProtectionPolicyInput {
  ResourceArn: string;
}
export const GetDataProtectionPolicyInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
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
  identifier: "GetDataProtectionPolicyInput",
}) as any as S.Schema<GetDataProtectionPolicyInput>;
export interface GetEndpointAttributesInput {
  EndpointArn: string;
}
export const GetEndpointAttributesInput = S.suspend(() =>
  S.Struct({ EndpointArn: S.String }).pipe(
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
  identifier: "GetEndpointAttributesInput",
}) as any as S.Schema<GetEndpointAttributesInput>;
export interface GetPlatformApplicationAttributesInput {
  PlatformApplicationArn: string;
}
export const GetPlatformApplicationAttributesInput = S.suspend(() =>
  S.Struct({ PlatformApplicationArn: S.String }).pipe(
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
  identifier: "GetPlatformApplicationAttributesInput",
}) as any as S.Schema<GetPlatformApplicationAttributesInput>;
export interface GetSMSAttributesInput {
  attributes?: string[];
}
export const GetSMSAttributesInput = S.suspend(() =>
  S.Struct({ attributes: S.optional(ListString) }).pipe(
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
  identifier: "GetSMSAttributesInput",
}) as any as S.Schema<GetSMSAttributesInput>;
export interface GetSMSSandboxAccountStatusResult {
  IsInSandbox: boolean;
}
export const GetSMSSandboxAccountStatusResult = S.suspend(() =>
  S.Struct({ IsInSandbox: S.Boolean }).pipe(ns),
).annotations({
  identifier: "GetSMSSandboxAccountStatusResult",
}) as any as S.Schema<GetSMSSandboxAccountStatusResult>;
export interface GetSubscriptionAttributesInput {
  SubscriptionArn: string;
}
export const GetSubscriptionAttributesInput = S.suspend(() =>
  S.Struct({ SubscriptionArn: S.String }).pipe(
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
  identifier: "GetSubscriptionAttributesInput",
}) as any as S.Schema<GetSubscriptionAttributesInput>;
export interface GetTopicAttributesInput {
  TopicArn: string;
}
export const GetTopicAttributesInput = S.suspend(() =>
  S.Struct({ TopicArn: S.String }).pipe(
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
  identifier: "GetTopicAttributesInput",
}) as any as S.Schema<GetTopicAttributesInput>;
export interface ListEndpointsByPlatformApplicationInput {
  PlatformApplicationArn: string;
  NextToken?: string;
}
export const ListEndpointsByPlatformApplicationInput = S.suspend(() =>
  S.Struct({
    PlatformApplicationArn: S.String,
    NextToken: S.optional(S.String),
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
  identifier: "ListEndpointsByPlatformApplicationInput",
}) as any as S.Schema<ListEndpointsByPlatformApplicationInput>;
export interface ListOriginationNumbersRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListOriginationNumbersRequest = S.suspend(() =>
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
  identifier: "ListOriginationNumbersRequest",
}) as any as S.Schema<ListOriginationNumbersRequest>;
export interface ListPhoneNumbersOptedOutInput {
  nextToken?: string;
}
export const ListPhoneNumbersOptedOutInput = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String) }).pipe(
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
  identifier: "ListPhoneNumbersOptedOutInput",
}) as any as S.Schema<ListPhoneNumbersOptedOutInput>;
export interface ListPlatformApplicationsInput {
  NextToken?: string;
}
export const ListPlatformApplicationsInput = S.suspend(() =>
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
  identifier: "ListPlatformApplicationsInput",
}) as any as S.Schema<ListPlatformApplicationsInput>;
export interface ListSMSSandboxPhoneNumbersInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListSMSSandboxPhoneNumbersInput = S.suspend(() =>
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
  identifier: "ListSMSSandboxPhoneNumbersInput",
}) as any as S.Schema<ListSMSSandboxPhoneNumbersInput>;
export interface ListSubscriptionsInput {
  NextToken?: string;
}
export const ListSubscriptionsInput = S.suspend(() =>
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
  identifier: "ListSubscriptionsInput",
}) as any as S.Schema<ListSubscriptionsInput>;
export interface ListSubscriptionsByTopicInput {
  TopicArn: string;
  NextToken?: string;
}
export const ListSubscriptionsByTopicInput = S.suspend(() =>
  S.Struct({ TopicArn: S.String, NextToken: S.optional(S.String) }).pipe(
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
  identifier: "ListSubscriptionsByTopicInput",
}) as any as S.Schema<ListSubscriptionsByTopicInput>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListTopicsInput {
  NextToken?: string;
}
export const ListTopicsInput = S.suspend(() =>
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
  identifier: "ListTopicsInput",
}) as any as S.Schema<ListTopicsInput>;
export interface OptInPhoneNumberInput {
  phoneNumber: string | redacted.Redacted<string>;
}
export const OptInPhoneNumberInput = S.suspend(() =>
  S.Struct({ phoneNumber: SensitiveString }).pipe(
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
  identifier: "OptInPhoneNumberInput",
}) as any as S.Schema<OptInPhoneNumberInput>;
export interface OptInPhoneNumberResponse {}
export const OptInPhoneNumberResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "OptInPhoneNumberResponse",
}) as any as S.Schema<OptInPhoneNumberResponse>;
export interface PutDataProtectionPolicyInput {
  ResourceArn: string;
  DataProtectionPolicy: string;
}
export const PutDataProtectionPolicyInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, DataProtectionPolicy: S.String }).pipe(
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
  identifier: "PutDataProtectionPolicyInput",
}) as any as S.Schema<PutDataProtectionPolicyInput>;
export interface PutDataProtectionPolicyResponse {}
export const PutDataProtectionPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutDataProtectionPolicyResponse",
}) as any as S.Schema<PutDataProtectionPolicyResponse>;
export interface RemovePermissionInput {
  TopicArn: string;
  Label: string;
}
export const RemovePermissionInput = S.suspend(() =>
  S.Struct({ TopicArn: S.String, Label: S.String }).pipe(
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
  identifier: "RemovePermissionInput",
}) as any as S.Schema<RemovePermissionInput>;
export interface RemovePermissionResponse {}
export const RemovePermissionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemovePermissionResponse",
}) as any as S.Schema<RemovePermissionResponse>;
export interface SetEndpointAttributesInput {
  EndpointArn: string;
  Attributes: { [key: string]: string | undefined };
}
export const SetEndpointAttributesInput = S.suspend(() =>
  S.Struct({ EndpointArn: S.String, Attributes: MapStringToString }).pipe(
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
  identifier: "SetEndpointAttributesInput",
}) as any as S.Schema<SetEndpointAttributesInput>;
export interface SetEndpointAttributesResponse {}
export const SetEndpointAttributesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetEndpointAttributesResponse",
}) as any as S.Schema<SetEndpointAttributesResponse>;
export interface SetPlatformApplicationAttributesInput {
  PlatformApplicationArn: string;
  Attributes: { [key: string]: string | undefined };
}
export const SetPlatformApplicationAttributesInput = S.suspend(() =>
  S.Struct({
    PlatformApplicationArn: S.String,
    Attributes: MapStringToString,
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
  identifier: "SetPlatformApplicationAttributesInput",
}) as any as S.Schema<SetPlatformApplicationAttributesInput>;
export interface SetPlatformApplicationAttributesResponse {}
export const SetPlatformApplicationAttributesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetPlatformApplicationAttributesResponse",
}) as any as S.Schema<SetPlatformApplicationAttributesResponse>;
export interface SetSMSAttributesInput {
  attributes: { [key: string]: string | undefined };
}
export const SetSMSAttributesInput = S.suspend(() =>
  S.Struct({ attributes: MapStringToString }).pipe(
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
  identifier: "SetSMSAttributesInput",
}) as any as S.Schema<SetSMSAttributesInput>;
export interface SetSMSAttributesResponse {}
export const SetSMSAttributesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetSMSAttributesResponse",
}) as any as S.Schema<SetSMSAttributesResponse>;
export interface SetSubscriptionAttributesInput {
  SubscriptionArn: string;
  AttributeName: string;
  AttributeValue?: string;
}
export const SetSubscriptionAttributesInput = S.suspend(() =>
  S.Struct({
    SubscriptionArn: S.String,
    AttributeName: S.String,
    AttributeValue: S.optional(S.String),
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
  identifier: "SetSubscriptionAttributesInput",
}) as any as S.Schema<SetSubscriptionAttributesInput>;
export interface SetSubscriptionAttributesResponse {}
export const SetSubscriptionAttributesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetSubscriptionAttributesResponse",
}) as any as S.Schema<SetSubscriptionAttributesResponse>;
export interface SetTopicAttributesInput {
  TopicArn: string;
  AttributeName: string;
  AttributeValue?: string;
}
export const SetTopicAttributesInput = S.suspend(() =>
  S.Struct({
    TopicArn: S.String,
    AttributeName: S.String,
    AttributeValue: S.optional(S.String),
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
  identifier: "SetTopicAttributesInput",
}) as any as S.Schema<SetTopicAttributesInput>;
export interface SetTopicAttributesResponse {}
export const SetTopicAttributesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetTopicAttributesResponse",
}) as any as S.Schema<SetTopicAttributesResponse>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
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
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UnsubscribeInput {
  SubscriptionArn: string;
}
export const UnsubscribeInput = S.suspend(() =>
  S.Struct({ SubscriptionArn: S.String }).pipe(
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
  identifier: "UnsubscribeInput",
}) as any as S.Schema<UnsubscribeInput>;
export interface UnsubscribeResponse {}
export const UnsubscribeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UnsubscribeResponse",
}) as any as S.Schema<UnsubscribeResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface VerifySMSSandboxPhoneNumberInput {
  PhoneNumber: string | redacted.Redacted<string>;
  OneTimePassword: string;
}
export const VerifySMSSandboxPhoneNumberInput = S.suspend(() =>
  S.Struct({ PhoneNumber: SensitiveString, OneTimePassword: S.String }).pipe(
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
  identifier: "VerifySMSSandboxPhoneNumberInput",
}) as any as S.Schema<VerifySMSSandboxPhoneNumberInput>;
export interface VerifySMSSandboxPhoneNumberResult {}
export const VerifySMSSandboxPhoneNumberResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "VerifySMSSandboxPhoneNumberResult",
}) as any as S.Schema<VerifySMSSandboxPhoneNumberResult>;
export type TopicAttributesMap = { [key: string]: string | undefined };
export const TopicAttributesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type PhoneNumberList = string | redacted.Redacted<string>[];
export const PhoneNumberList = S.Array(SensitiveString);
export interface MessageAttributeValue {
  DataType: string;
  StringValue?: string;
  BinaryValue?: Uint8Array;
}
export const MessageAttributeValue = S.suspend(() =>
  S.Struct({
    DataType: S.String,
    StringValue: S.optional(S.String),
    BinaryValue: S.optional(T.Blob),
  }),
).annotations({
  identifier: "MessageAttributeValue",
}) as any as S.Schema<MessageAttributeValue>;
export type MessageAttributeMap = {
  [key: string]: MessageAttributeValue | undefined;
};
export const MessageAttributeMap = S.Record({
  key: S.String.pipe(T.XmlName("Name")),
  value: S.UndefinedOr(
    MessageAttributeValue.pipe(T.XmlName("Value")).annotations({
      identifier: "MessageAttributeValue",
    }),
  ),
});
export interface PublishBatchRequestEntry {
  Id: string;
  Message: string;
  Subject?: string;
  MessageStructure?: string;
  MessageAttributes?: { [key: string]: MessageAttributeValue | undefined };
  MessageDeduplicationId?: string;
  MessageGroupId?: string;
}
export const PublishBatchRequestEntry = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Message: S.String,
    Subject: S.optional(S.String),
    MessageStructure: S.optional(S.String),
    MessageAttributes: S.optional(MessageAttributeMap),
    MessageDeduplicationId: S.optional(S.String),
    MessageGroupId: S.optional(S.String),
  }),
).annotations({
  identifier: "PublishBatchRequestEntry",
}) as any as S.Schema<PublishBatchRequestEntry>;
export type PublishBatchRequestEntryList = PublishBatchRequestEntry[];
export const PublishBatchRequestEntryList = S.Array(PublishBatchRequestEntry);
export type SubscriptionAttributesMap = { [key: string]: string | undefined };
export const SubscriptionAttributesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CheckIfPhoneNumberIsOptedOutResponse {
  isOptedOut?: boolean;
}
export const CheckIfPhoneNumberIsOptedOutResponse = S.suspend(() =>
  S.Struct({ isOptedOut: S.optional(S.Boolean) }).pipe(ns),
).annotations({
  identifier: "CheckIfPhoneNumberIsOptedOutResponse",
}) as any as S.Schema<CheckIfPhoneNumberIsOptedOutResponse>;
export interface ConfirmSubscriptionResponse {
  SubscriptionArn?: string;
}
export const ConfirmSubscriptionResponse = S.suspend(() =>
  S.Struct({ SubscriptionArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ConfirmSubscriptionResponse",
}) as any as S.Schema<ConfirmSubscriptionResponse>;
export interface CreatePlatformApplicationInput {
  Name: string;
  Platform: string;
  Attributes: { [key: string]: string | undefined };
}
export const CreatePlatformApplicationInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Platform: S.String,
    Attributes: MapStringToString,
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
  identifier: "CreatePlatformApplicationInput",
}) as any as S.Schema<CreatePlatformApplicationInput>;
export interface CreateEndpointResponse {
  EndpointArn?: string;
}
export const CreateEndpointResponse = S.suspend(() =>
  S.Struct({ EndpointArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateEndpointResponse",
}) as any as S.Schema<CreateEndpointResponse>;
export interface CreateTopicInput {
  Name: string;
  Attributes?: { [key: string]: string | undefined };
  Tags?: Tag[];
  DataProtectionPolicy?: string;
}
export const CreateTopicInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Attributes: S.optional(TopicAttributesMap),
    Tags: S.optional(TagList),
    DataProtectionPolicy: S.optional(S.String),
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
  identifier: "CreateTopicInput",
}) as any as S.Schema<CreateTopicInput>;
export interface GetDataProtectionPolicyResponse {
  DataProtectionPolicy?: string;
}
export const GetDataProtectionPolicyResponse = S.suspend(() =>
  S.Struct({ DataProtectionPolicy: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetDataProtectionPolicyResponse",
}) as any as S.Schema<GetDataProtectionPolicyResponse>;
export interface GetEndpointAttributesResponse {
  Attributes?: { [key: string]: string | undefined };
}
export const GetEndpointAttributesResponse = S.suspend(() =>
  S.Struct({ Attributes: S.optional(MapStringToString) }).pipe(ns),
).annotations({
  identifier: "GetEndpointAttributesResponse",
}) as any as S.Schema<GetEndpointAttributesResponse>;
export interface GetPlatformApplicationAttributesResponse {
  Attributes?: { [key: string]: string | undefined };
}
export const GetPlatformApplicationAttributesResponse = S.suspend(() =>
  S.Struct({ Attributes: S.optional(MapStringToString) }).pipe(ns),
).annotations({
  identifier: "GetPlatformApplicationAttributesResponse",
}) as any as S.Schema<GetPlatformApplicationAttributesResponse>;
export interface GetSMSAttributesResponse {
  attributes?: { [key: string]: string | undefined };
}
export const GetSMSAttributesResponse = S.suspend(() =>
  S.Struct({ attributes: S.optional(MapStringToString) }).pipe(ns),
).annotations({
  identifier: "GetSMSAttributesResponse",
}) as any as S.Schema<GetSMSAttributesResponse>;
export interface GetSubscriptionAttributesResponse {
  Attributes?: { [key: string]: string | undefined };
}
export const GetSubscriptionAttributesResponse = S.suspend(() =>
  S.Struct({ Attributes: S.optional(SubscriptionAttributesMap) }).pipe(ns),
).annotations({
  identifier: "GetSubscriptionAttributesResponse",
}) as any as S.Schema<GetSubscriptionAttributesResponse>;
export interface GetTopicAttributesResponse {
  Attributes?: { [key: string]: string | undefined };
}
export const GetTopicAttributesResponse = S.suspend(() =>
  S.Struct({ Attributes: S.optional(TopicAttributesMap) }).pipe(ns),
).annotations({
  identifier: "GetTopicAttributesResponse",
}) as any as S.Schema<GetTopicAttributesResponse>;
export interface ListPhoneNumbersOptedOutResponse {
  phoneNumbers?: string | redacted.Redacted<string>[];
  nextToken?: string;
}
export const ListPhoneNumbersOptedOutResponse = S.suspend(() =>
  S.Struct({
    phoneNumbers: S.optional(PhoneNumberList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPhoneNumbersOptedOutResponse",
}) as any as S.Schema<ListPhoneNumbersOptedOutResponse>;
export interface Subscription {
  SubscriptionArn?: string;
  Owner?: string;
  Protocol?: string;
  Endpoint?: string;
  TopicArn?: string;
}
export const Subscription = S.suspend(() =>
  S.Struct({
    SubscriptionArn: S.optional(S.String),
    Owner: S.optional(S.String),
    Protocol: S.optional(S.String),
    Endpoint: S.optional(S.String),
    TopicArn: S.optional(S.String),
  }),
).annotations({ identifier: "Subscription" }) as any as S.Schema<Subscription>;
export type SubscriptionsList = Subscription[];
export const SubscriptionsList = S.Array(Subscription);
export interface ListSubscriptionsByTopicResponse {
  Subscriptions?: Subscription[];
  NextToken?: string;
}
export const ListSubscriptionsByTopicResponse = S.suspend(() =>
  S.Struct({
    Subscriptions: S.optional(SubscriptionsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSubscriptionsByTopicResponse",
}) as any as S.Schema<ListSubscriptionsByTopicResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PublishBatchInput {
  TopicArn: string;
  PublishBatchRequestEntries: PublishBatchRequestEntry[];
}
export const PublishBatchInput = S.suspend(() =>
  S.Struct({
    TopicArn: S.String,
    PublishBatchRequestEntries: PublishBatchRequestEntryList,
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
  identifier: "PublishBatchInput",
}) as any as S.Schema<PublishBatchInput>;
export interface SubscribeInput {
  TopicArn: string;
  Protocol: string;
  Endpoint?: string;
  Attributes?: { [key: string]: string | undefined };
  ReturnSubscriptionArn?: boolean;
}
export const SubscribeInput = S.suspend(() =>
  S.Struct({
    TopicArn: S.String,
    Protocol: S.String,
    Endpoint: S.optional(S.String),
    Attributes: S.optional(SubscriptionAttributesMap),
    ReturnSubscriptionArn: S.optional(S.Boolean),
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
  identifier: "SubscribeInput",
}) as any as S.Schema<SubscribeInput>;
export type RouteType =
  | "Transactional"
  | "Promotional"
  | "Premium"
  | (string & {});
export const RouteType = S.String;
export type NumberCapability = "SMS" | "MMS" | "VOICE" | (string & {});
export const NumberCapability = S.String;
export type NumberCapabilityList = NumberCapability[];
export const NumberCapabilityList = S.Array(NumberCapability);
export type SMSSandboxPhoneNumberVerificationStatus =
  | "Pending"
  | "Verified"
  | (string & {});
export const SMSSandboxPhoneNumberVerificationStatus = S.String;
export interface Endpoint {
  EndpointArn?: string;
  Attributes?: { [key: string]: string | undefined };
}
export const Endpoint = S.suspend(() =>
  S.Struct({
    EndpointArn: S.optional(S.String),
    Attributes: S.optional(MapStringToString),
  }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export type ListOfEndpoints = Endpoint[];
export const ListOfEndpoints = S.Array(Endpoint);
export interface PhoneNumberInformation {
  CreatedAt?: Date;
  PhoneNumber?: string | redacted.Redacted<string>;
  Status?: string;
  Iso2CountryCode?: string;
  RouteType?: RouteType;
  NumberCapabilities?: NumberCapability[];
}
export const PhoneNumberInformation = S.suspend(() =>
  S.Struct({
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PhoneNumber: S.optional(SensitiveString),
    Status: S.optional(S.String),
    Iso2CountryCode: S.optional(S.String),
    RouteType: S.optional(RouteType),
    NumberCapabilities: S.optional(NumberCapabilityList),
  }),
).annotations({
  identifier: "PhoneNumberInformation",
}) as any as S.Schema<PhoneNumberInformation>;
export type PhoneNumberInformationList = PhoneNumberInformation[];
export const PhoneNumberInformationList = S.Array(PhoneNumberInformation);
export interface PlatformApplication {
  PlatformApplicationArn?: string;
  Attributes?: { [key: string]: string | undefined };
}
export const PlatformApplication = S.suspend(() =>
  S.Struct({
    PlatformApplicationArn: S.optional(S.String),
    Attributes: S.optional(MapStringToString),
  }),
).annotations({
  identifier: "PlatformApplication",
}) as any as S.Schema<PlatformApplication>;
export type ListOfPlatformApplications = PlatformApplication[];
export const ListOfPlatformApplications = S.Array(PlatformApplication);
export interface SMSSandboxPhoneNumber {
  PhoneNumber?: string | redacted.Redacted<string>;
  Status?: SMSSandboxPhoneNumberVerificationStatus;
}
export const SMSSandboxPhoneNumber = S.suspend(() =>
  S.Struct({
    PhoneNumber: S.optional(SensitiveString),
    Status: S.optional(SMSSandboxPhoneNumberVerificationStatus),
  }),
).annotations({
  identifier: "SMSSandboxPhoneNumber",
}) as any as S.Schema<SMSSandboxPhoneNumber>;
export type SMSSandboxPhoneNumberList = SMSSandboxPhoneNumber[];
export const SMSSandboxPhoneNumberList = S.Array(SMSSandboxPhoneNumber);
export interface Topic {
  TopicArn?: string;
}
export const Topic = S.suspend(() =>
  S.Struct({ TopicArn: S.optional(S.String) }),
).annotations({ identifier: "Topic" }) as any as S.Schema<Topic>;
export type TopicsList = Topic[];
export const TopicsList = S.Array(Topic);
export interface CreatePlatformApplicationResponse {
  PlatformApplicationArn?: string;
}
export const CreatePlatformApplicationResponse = S.suspend(() =>
  S.Struct({ PlatformApplicationArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreatePlatformApplicationResponse",
}) as any as S.Schema<CreatePlatformApplicationResponse>;
export interface CreateTopicResponse {
  TopicArn?: string;
}
export const CreateTopicResponse = S.suspend(() =>
  S.Struct({ TopicArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateTopicResponse",
}) as any as S.Schema<CreateTopicResponse>;
export interface ListEndpointsByPlatformApplicationResponse {
  Endpoints?: Endpoint[];
  NextToken?: string;
}
export const ListEndpointsByPlatformApplicationResponse = S.suspend(() =>
  S.Struct({
    Endpoints: S.optional(ListOfEndpoints),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListEndpointsByPlatformApplicationResponse",
}) as any as S.Schema<ListEndpointsByPlatformApplicationResponse>;
export interface ListOriginationNumbersResult {
  NextToken?: string;
  PhoneNumbers?: PhoneNumberInformation[];
}
export const ListOriginationNumbersResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PhoneNumbers: S.optional(PhoneNumberInformationList),
  }).pipe(ns),
).annotations({
  identifier: "ListOriginationNumbersResult",
}) as any as S.Schema<ListOriginationNumbersResult>;
export interface ListPlatformApplicationsResponse {
  PlatformApplications?: PlatformApplication[];
  NextToken?: string;
}
export const ListPlatformApplicationsResponse = S.suspend(() =>
  S.Struct({
    PlatformApplications: S.optional(ListOfPlatformApplications),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPlatformApplicationsResponse",
}) as any as S.Schema<ListPlatformApplicationsResponse>;
export interface ListSMSSandboxPhoneNumbersResult {
  PhoneNumbers: SMSSandboxPhoneNumber[];
  NextToken?: string;
}
export const ListSMSSandboxPhoneNumbersResult = S.suspend(() =>
  S.Struct({
    PhoneNumbers: SMSSandboxPhoneNumberList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSMSSandboxPhoneNumbersResult",
}) as any as S.Schema<ListSMSSandboxPhoneNumbersResult>;
export interface ListSubscriptionsResponse {
  Subscriptions?: Subscription[];
  NextToken?: string;
}
export const ListSubscriptionsResponse = S.suspend(() =>
  S.Struct({
    Subscriptions: S.optional(SubscriptionsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSubscriptionsResponse",
}) as any as S.Schema<ListSubscriptionsResponse>;
export interface ListTopicsResponse {
  Topics?: Topic[];
  NextToken?: string;
}
export const ListTopicsResponse = S.suspend(() =>
  S.Struct({
    Topics: S.optional(TopicsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTopicsResponse",
}) as any as S.Schema<ListTopicsResponse>;
export interface PublishInput {
  TopicArn?: string;
  TargetArn?: string;
  PhoneNumber?: string | redacted.Redacted<string>;
  Message: string;
  Subject?: string;
  MessageStructure?: string;
  MessageAttributes?: { [key: string]: MessageAttributeValue | undefined };
  MessageDeduplicationId?: string;
  MessageGroupId?: string;
}
export const PublishInput = S.suspend(() =>
  S.Struct({
    TopicArn: S.optional(S.String),
    TargetArn: S.optional(S.String),
    PhoneNumber: S.optional(SensitiveString),
    Message: S.String,
    Subject: S.optional(S.String),
    MessageStructure: S.optional(S.String),
    MessageAttributes: S.optional(MessageAttributeMap),
    MessageDeduplicationId: S.optional(S.String),
    MessageGroupId: S.optional(S.String),
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
).annotations({ identifier: "PublishInput" }) as any as S.Schema<PublishInput>;
export interface SubscribeResponse {
  SubscriptionArn?: string;
}
export const SubscribeResponse = S.suspend(() =>
  S.Struct({ SubscriptionArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "SubscribeResponse",
}) as any as S.Schema<SubscribeResponse>;
export interface PublishBatchResultEntry {
  Id?: string;
  MessageId?: string;
  SequenceNumber?: string;
}
export const PublishBatchResultEntry = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    MessageId: S.optional(S.String),
    SequenceNumber: S.optional(S.String),
  }),
).annotations({
  identifier: "PublishBatchResultEntry",
}) as any as S.Schema<PublishBatchResultEntry>;
export type PublishBatchResultEntryList = PublishBatchResultEntry[];
export const PublishBatchResultEntryList = S.Array(PublishBatchResultEntry);
export interface BatchResultErrorEntry {
  Id: string;
  Code: string;
  Message?: string;
  SenderFault: boolean;
}
export const BatchResultErrorEntry = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Code: S.String,
    Message: S.optional(S.String),
    SenderFault: S.Boolean,
  }),
).annotations({
  identifier: "BatchResultErrorEntry",
}) as any as S.Schema<BatchResultErrorEntry>;
export type BatchResultErrorEntryList = BatchResultErrorEntry[];
export const BatchResultErrorEntryList = S.Array(BatchResultErrorEntry);
export interface PublishResponse {
  MessageId?: string;
  SequenceNumber?: string;
}
export const PublishResponse = S.suspend(() =>
  S.Struct({
    MessageId: S.optional(S.String),
    SequenceNumber: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PublishResponse",
}) as any as S.Schema<PublishResponse>;
export interface PublishBatchResponse {
  Successful?: PublishBatchResultEntry[];
  Failed?: BatchResultErrorEntry[];
}
export const PublishBatchResponse = S.suspend(() =>
  S.Struct({
    Successful: S.optional(PublishBatchResultEntryList),
    Failed: S.optional(BatchResultErrorEntryList),
  }).pipe(ns),
).annotations({
  identifier: "PublishBatchResponse",
}) as any as S.Schema<PublishBatchResponse>;

//# Errors
export class AuthorizationErrorException extends S.TaggedError<AuthorizationErrorException>()(
  "AuthorizationErrorException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AuthorizationError", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalError", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class FilterPolicyLimitExceededException extends S.TaggedError<FilterPolicyLimitExceededException>()(
  "FilterPolicyLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "FilterPolicyLimitExceeded", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class ConcurrentAccessException extends S.TaggedError<ConcurrentAccessException>()(
  "ConcurrentAccessException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConcurrentAccess", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidParameter", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ThrottledException extends S.TaggedError<ThrottledException>()(
  "ThrottledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "Throttled", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class RequestLimitExceeded extends S.TaggedError<RequestLimitExceeded>()(
  "RequestLimitExceeded",
  {},
) {}
export class InvalidClientTokenId extends S.TaggedError<InvalidClientTokenId>()(
  "InvalidClientTokenId",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class EndpointDisabledException extends S.TaggedError<EndpointDisabledException>()(
  "EndpointDisabledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "EndpointDisabled", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class BatchEntryIdsNotDistinctException extends S.TaggedError<BatchEntryIdsNotDistinctException>()(
  "BatchEntryIdsNotDistinctException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "BatchEntryIdsNotDistinct", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidSecurityException extends S.TaggedError<InvalidSecurityException>()(
  "InvalidSecurityException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSecurity", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class OptedOutException extends S.TaggedError<OptedOutException>()(
  "OptedOutException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "OptedOut", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ParameterValueInvalid", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class BatchRequestTooLongException extends S.TaggedError<BatchRequestTooLongException>()(
  "BatchRequestTooLongException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "BatchRequestTooLong", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ReplayLimitExceededException extends S.TaggedError<ReplayLimitExceededException>()(
  "ReplayLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReplayLimitExceeded", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class UserErrorException extends S.TaggedError<UserErrorException>()(
  "UserErrorException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserError", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class StaleTagException extends S.TaggedError<StaleTagException>()(
  "StaleTagException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StaleTag", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TagPolicyException extends S.TaggedError<TagPolicyException>()(
  "TagPolicyException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagPolicy", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class VerificationException extends S.TaggedError<VerificationException>()(
  "VerificationException",
  { Message: S.String, Status: S.String },
) {}
export class KMSAccessDeniedException extends S.TaggedError<KMSAccessDeniedException>()(
  "KMSAccessDeniedException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSAccessDenied", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EmptyBatchRequestException extends S.TaggedError<EmptyBatchRequestException>()(
  "EmptyBatchRequestException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "EmptyBatchRequest", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubscriptionLimitExceededException extends S.TaggedError<SubscriptionLimitExceededException>()(
  "SubscriptionLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionLimitExceeded", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class TagLimitExceededException extends S.TaggedError<TagLimitExceededException>()(
  "TagLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagLimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class KMSDisabledException extends S.TaggedError<KMSDisabledException>()(
  "KMSDisabledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSDisabled", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidBatchEntryIdException extends S.TaggedError<InvalidBatchEntryIdException>()(
  "InvalidBatchEntryIdException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidBatchEntryId", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TopicLimitExceededException extends S.TaggedError<TopicLimitExceededException>()(
  "TopicLimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TopicLimitExceeded", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class KMSInvalidStateException extends S.TaggedError<KMSInvalidStateException>()(
  "KMSInvalidStateException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSInvalidState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class KMSNotFoundException extends S.TaggedError<KMSNotFoundException>()(
  "KMSNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSNotFound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class KMSOptInRequired extends S.TaggedError<KMSOptInRequired>()(
  "KMSOptInRequired",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSOptInRequired", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class KMSThrottlingException extends S.TaggedError<KMSThrottlingException>()(
  "KMSThrottlingException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSThrottling", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class PlatformApplicationDisabledException extends S.TaggedError<PlatformApplicationDisabledException>()(
  "PlatformApplicationDisabledException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "PlatformApplicationDisabled",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TooManyEntriesInBatchRequestException extends S.TaggedError<TooManyEntriesInBatchRequestException>()(
  "TooManyEntriesInBatchRequestException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TooManyEntriesInBatchRequest",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}

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
export const getSMSSandboxAccountStatus: (
  input: GetSMSSandboxAccountStatusInput,
) => effect.Effect<
  GetSMSSandboxAccountStatusResult,
  | AuthorizationErrorException
  | InternalErrorException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSMSSandboxAccountStatusInput,
  output: GetSMSSandboxAccountStatusResult,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    ThrottledException,
  ],
}));
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
export const createPlatformApplication: (
  input: CreatePlatformApplicationInput,
) => effect.Effect<
  CreatePlatformApplicationResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePlatformApplicationInput,
  output: CreatePlatformApplicationResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
  ],
}));
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
export const listPlatformApplications: {
  (
    input: ListPlatformApplicationsInput,
  ): effect.Effect<
    ListPlatformApplicationsResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPlatformApplicationsInput,
  ) => stream.Stream<
    ListPlatformApplicationsResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPlatformApplicationsInput,
  ) => stream.Stream<
    PlatformApplication,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSubscriptions: {
  (
    input: ListSubscriptionsInput,
  ): effect.Effect<
    ListSubscriptionsResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubscriptionsInput,
  ) => stream.Stream<
    ListSubscriptionsResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSubscriptionsInput,
  ) => stream.Stream<
    Subscription,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns a list of the requester's topics. Each call returns a limited list of topics,
 * up to 100. If there are more topics, a `NextToken` is also returned. Use the
 * `NextToken` parameter in a new `ListTopics` call to get
 * further results.
 *
 * This action is throttled at 30 transactions per second (TPS).
 */
export const listTopics: {
  (
    input: ListTopicsInput,
  ): effect.Effect<
    ListTopicsResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTopicsInput,
  ) => stream.Stream<
    ListTopicsResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTopicsInput,
  ) => stream.Stream<
    Topic,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const checkIfPhoneNumberIsOptedOut: (
  input: CheckIfPhoneNumberIsOptedOutInput,
) => effect.Effect<
  CheckIfPhoneNumberIsOptedOutResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSMSAttributes: (
  input: GetSMSAttributesInput,
) => effect.Effect<
  GetSMSAttributesResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPhoneNumbersOptedOut: {
  (
    input: ListPhoneNumbersOptedOutInput,
  ): effect.Effect<
    ListPhoneNumbersOptedOutResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | ThrottledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPhoneNumbersOptedOutInput,
  ) => stream.Stream<
    ListPhoneNumbersOptedOutResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | ThrottledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPhoneNumbersOptedOutInput,
  ) => stream.Stream<
    PhoneNumber,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | ThrottledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteEndpoint: (
  input: DeleteEndpointInput,
) => effect.Effect<
  DeleteEndpointResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointInput,
  output: DeleteEndpointResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Deletes a platform application object for one of the supported push notification
 * services, such as APNS and GCM (Firebase Cloud Messaging). For more information, see
 * Using Amazon SNS
 * Mobile Push Notifications.
 */
export const deletePlatformApplication: (
  input: DeletePlatformApplicationInput,
) => effect.Effect<
  DeletePlatformApplicationResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePlatformApplicationInput,
  output: DeletePlatformApplicationResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Use this request to opt in a phone number that is opted out, which enables you to
 * resume sending SMS messages to the number.
 *
 * You can opt in a phone number only once every 30 days.
 */
export const optInPhoneNumber: (
  input: OptInPhoneNumberInput,
) => effect.Effect<
  OptInPhoneNumberResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setSMSAttributes: (
  input: SetSMSAttributesInput,
) => effect.Effect<
  SetSMSAttributesResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | ThrottledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addPermission: (
  input: AddPermissionInput,
) => effect.Effect<
  AddPermissionResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddPermissionInput,
  output: AddPermissionResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Lists the calling Amazon Web Services account's dedicated origination numbers and their metadata.
 * For more information about origination numbers, see Origination numbers in the Amazon SNS Developer
 * Guide.
 */
export const listOriginationNumbers: {
  (
    input: ListOriginationNumbersRequest,
  ): effect.Effect<
    ListOriginationNumbersResult,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOriginationNumbersRequest,
  ) => stream.Stream<
    ListOriginationNumbersResult,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOriginationNumbersRequest,
  ) => stream.Stream<
    PhoneNumberInformation,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSMSSandboxPhoneNumbers: {
  (
    input: ListSMSSandboxPhoneNumbersInput,
  ): effect.Effect<
    ListSMSSandboxPhoneNumbersResult,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | ResourceNotFoundException
    | ThrottledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSMSSandboxPhoneNumbersInput,
  ) => stream.Stream<
    ListSMSSandboxPhoneNumbersResult,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | ResourceNotFoundException
    | ThrottledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSMSSandboxPhoneNumbersInput,
  ) => stream.Stream<
    SMSSandboxPhoneNumber,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | ResourceNotFoundException
    | ThrottledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listEndpointsByPlatformApplication: {
  (
    input: ListEndpointsByPlatformApplicationInput,
  ): effect.Effect<
    ListEndpointsByPlatformApplicationResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | NotFoundException
    | RequestLimitExceeded
    | InvalidClientTokenId
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEndpointsByPlatformApplicationInput,
  ) => stream.Stream<
    ListEndpointsByPlatformApplicationResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | NotFoundException
    | RequestLimitExceeded
    | InvalidClientTokenId
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEndpointsByPlatformApplicationInput,
  ) => stream.Stream<
    Endpoint,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | NotFoundException
    | RequestLimitExceeded
    | InvalidClientTokenId
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEndpointsByPlatformApplicationInput,
  output: ListEndpointsByPlatformApplicationResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
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
export const createPlatformEndpoint: (
  input: CreatePlatformEndpointInput,
) => effect.Effect<
  CreateEndpointResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePlatformEndpointInput,
  output: CreateEndpointResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Retrieves the endpoint attributes for a device on one of the supported push
 * notification services, such as GCM (Firebase Cloud Messaging) and APNS. For more
 * information, see Using Amazon SNS Mobile Push Notifications.
 */
export const getEndpointAttributes: (
  input: GetEndpointAttributesInput,
) => effect.Effect<
  GetEndpointAttributesResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEndpointAttributesInput,
  output: GetEndpointAttributesResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Retrieves the attributes of the platform application object for the supported push
 * notification services, such as APNS and GCM (Firebase Cloud Messaging). For more
 * information, see Using Amazon SNS Mobile Push Notifications.
 */
export const getPlatformApplicationAttributes: (
  input: GetPlatformApplicationAttributesInput,
) => effect.Effect<
  GetPlatformApplicationAttributesResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPlatformApplicationAttributesInput,
  output: GetPlatformApplicationAttributesResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Returns all of the properties of a subscription.
 */
export const getSubscriptionAttributes: (
  input: GetSubscriptionAttributesInput,
) => effect.Effect<
  GetSubscriptionAttributesResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSubscriptionAttributesInput,
  output: GetSubscriptionAttributesResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
  ],
}));
/**
 * Returns a list of the subscriptions to a specific topic. Each call returns a limited
 * list of subscriptions, up to 100. If there are more subscriptions, a
 * `NextToken` is also returned. Use the `NextToken` parameter in
 * a new `ListSubscriptionsByTopic` call to get further results.
 *
 * This action is throttled at 30 transactions per second (TPS).
 */
export const listSubscriptionsByTopic: {
  (
    input: ListSubscriptionsByTopicInput,
  ): effect.Effect<
    ListSubscriptionsByTopicResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | NotFoundException
    | RequestLimitExceeded
    | InvalidClientTokenId
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubscriptionsByTopicInput,
  ) => stream.Stream<
    ListSubscriptionsByTopicResponse,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | NotFoundException
    | RequestLimitExceeded
    | InvalidClientTokenId
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSubscriptionsByTopicInput,
  ) => stream.Stream<
    Subscription,
    | AuthorizationErrorException
    | InternalErrorException
    | InvalidParameterException
    | NotFoundException
    | RequestLimitExceeded
    | InvalidClientTokenId
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSubscriptionsByTopicInput,
  output: ListSubscriptionsByTopicResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
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
export const removePermission: (
  input: RemovePermissionInput,
) => effect.Effect<
  RemovePermissionResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemovePermissionInput,
  output: RemovePermissionResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Sets the attributes for an endpoint for a device on one of the supported push
 * notification services, such as GCM (Firebase Cloud Messaging) and APNS. For more
 * information, see Using Amazon SNS Mobile Push Notifications.
 */
export const setEndpointAttributes: (
  input: SetEndpointAttributesInput,
) => effect.Effect<
  SetEndpointAttributesResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetEndpointAttributesInput,
  output: SetEndpointAttributesResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Sets the attributes of the platform application object for the supported push
 * notification services, such as APNS and GCM (Firebase Cloud Messaging). For more
 * information, see Using Amazon SNS Mobile Push Notifications. For information on configuring
 * attributes for message delivery status, see Using Amazon SNS Application Attributes for
 * Message Delivery Status.
 */
export const setPlatformApplicationAttributes: (
  input: SetPlatformApplicationAttributesInput,
) => effect.Effect<
  SetPlatformApplicationAttributesResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetPlatformApplicationAttributesInput,
  output: SetPlatformApplicationAttributesResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Retrieves the specified inline `DataProtectionPolicy` document that is
 * stored in the specified Amazon SNS topic.
 */
export const getDataProtectionPolicy: (
  input: GetDataProtectionPolicyInput,
) => effect.Effect<
  GetDataProtectionPolicyResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | InvalidSecurityException
  | NotFoundException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataProtectionPolicyInput,
  output: GetDataProtectionPolicyResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    InvalidSecurityException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Returns all of the properties of a topic. Topic properties returned might differ based
 * on the authorization of the user.
 */
export const getTopicAttributes: (
  input: GetTopicAttributesInput,
) => effect.Effect<
  GetTopicAttributesResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | InvalidSecurityException
  | NotFoundException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTopicAttributesInput,
  output: GetTopicAttributesResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    InvalidSecurityException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Adds or updates an inline policy document that is stored in the specified Amazon SNS
 * topic.
 */
export const putDataProtectionPolicy: (
  input: PutDataProtectionPolicyInput,
) => effect.Effect<
  PutDataProtectionPolicyResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | InvalidSecurityException
  | NotFoundException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDataProtectionPolicyInput,
  output: PutDataProtectionPolicyResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    InvalidSecurityException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Allows a topic owner to set an attribute of the topic to a new value.
 *
 * To remove the ability to change topic permissions, you must deny permissions to
 * the `AddPermission`, `RemovePermission`, and
 * `SetTopicAttributes` actions in your IAM policy.
 */
export const setTopicAttributes: (
  input: SetTopicAttributesInput,
) => effect.Effect<
  SetTopicAttributesResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | InvalidSecurityException
  | NotFoundException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetTopicAttributesInput,
  output: SetTopicAttributesResponse,
  errors: [
    AuthorizationErrorException,
    InternalErrorException,
    InvalidParameterException,
    InvalidSecurityException,
    NotFoundException,
    RequestLimitExceeded,
    InvalidClientTokenId,
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
export const unsubscribe: (
  input: UnsubscribeInput,
) => effect.Effect<
  UnsubscribeResponse,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | InvalidSecurityException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSMSSandboxPhoneNumber: (
  input: CreateSMSSandboxPhoneNumberInput,
) => effect.Effect<
  CreateSMSSandboxPhoneNumberResult,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | OptedOutException
  | ThrottledException
  | UserErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * List all tags added to the specified Amazon SNS topic. For an overview, see Amazon SNS Tags in the
 * *Amazon Simple Notification Service Developer Guide*.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AuthorizationErrorException
  | ConcurrentAccessException
  | InvalidParameterException
  | ResourceNotFoundException
  | TagPolicyException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AuthorizationErrorException,
    ConcurrentAccessException,
    InvalidParameterException,
    ResourceNotFoundException,
    TagPolicyException,
    RequestLimitExceeded,
    InvalidClientTokenId,
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
export const verifySMSSandboxPhoneNumber: (
  input: VerifySMSSandboxPhoneNumberInput,
) => effect.Effect<
  VerifySMSSandboxPhoneNumberResult,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottledException
  | VerificationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Allows a subscription owner to set an attribute of the subscription to a new
 * value.
 */
export const setSubscriptionAttributes: (
  input: SetSubscriptionAttributesInput,
) => effect.Effect<
  SetSubscriptionAttributesResponse,
  | AuthorizationErrorException
  | FilterPolicyLimitExceededException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ReplayLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const deleteSMSSandboxPhoneNumber: (
  input: DeleteSMSSandboxPhoneNumberInput,
) => effect.Effect<
  DeleteSMSSandboxPhoneNumberResult,
  | AuthorizationErrorException
  | InternalErrorException
  | InvalidParameterException
  | ResourceNotFoundException
  | ThrottledException
  | UserErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a topic and all its subscriptions. Deleting a topic might prevent some
 * messages previously sent to the topic from being delivered to subscribers. This action
 * is idempotent, so deleting a topic that does not exist does not result in an
 * error.
 */
export const deleteTopic: (
  input: DeleteTopicInput,
) => effect.Effect<
  DeleteTopicResponse,
  | AuthorizationErrorException
  | ConcurrentAccessException
  | InternalErrorException
  | InvalidParameterException
  | InvalidStateException
  | NotFoundException
  | StaleTagException
  | TagPolicyException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
    RequestLimitExceeded,
    InvalidClientTokenId,
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
export const subscribe: (
  input: SubscribeInput,
) => effect.Effect<
  SubscribeResponse,
  | AuthorizationErrorException
  | FilterPolicyLimitExceededException
  | InternalErrorException
  | InvalidParameterException
  | InvalidSecurityException
  | NotFoundException
  | ReplayLimitExceededException
  | SubscriptionLimitExceededException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Verifies an endpoint owner's intent to receive messages by validating the token sent
 * to the endpoint by an earlier `Subscribe` action. If the token is valid, the
 * action creates a new subscription and returns its Amazon Resource Name (ARN). This call
 * requires an AWS signature only when the `AuthenticateOnUnsubscribe` flag is
 * set to "true".
 */
export const confirmSubscription: (
  input: ConfirmSubscriptionInput,
) => effect.Effect<
  ConfirmSubscriptionResponse,
  | AuthorizationErrorException
  | FilterPolicyLimitExceededException
  | InternalErrorException
  | InvalidParameterException
  | NotFoundException
  | ReplayLimitExceededException
  | SubscriptionLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AuthorizationErrorException
  | ConcurrentAccessException
  | InvalidParameterException
  | ResourceNotFoundException
  | StaleTagException
  | TagLimitExceededException
  | TagPolicyException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Remove tags from the specified Amazon SNS topic. For an overview, see Amazon SNS Tags in the
 * *Amazon SNS Developer Guide*.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AuthorizationErrorException
  | ConcurrentAccessException
  | InvalidParameterException
  | ResourceNotFoundException
  | StaleTagException
  | TagLimitExceededException
  | TagPolicyException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
    RequestLimitExceeded,
    InvalidClientTokenId,
  ],
}));
/**
 * Creates a topic to which notifications can be published. Users can create at most
 * 100,000 standard topics (at most 1,000 FIFO topics). For more information, see Creating an Amazon SNS
 * topic in the *Amazon SNS Developer Guide*. This action is
 * idempotent, so if the requester already owns a topic with the specified name, that
 * topic's ARN is returned without creating a new topic.
 */
export const createTopic: (
  input: CreateTopicInput,
) => effect.Effect<
  CreateTopicResponse,
  | AuthorizationErrorException
  | ConcurrentAccessException
  | InternalErrorException
  | InvalidParameterException
  | InvalidSecurityException
  | StaleTagException
  | TagLimitExceededException
  | TagPolicyException
  | TopicLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const publish: (
  input: PublishInput,
) => effect.Effect<
  PublishResponse,
  | AuthorizationErrorException
  | EndpointDisabledException
  | InternalErrorException
  | InvalidParameterException
  | InvalidParameterValueException
  | InvalidSecurityException
  | KMSAccessDeniedException
  | KMSDisabledException
  | KMSInvalidStateException
  | KMSNotFoundException
  | KMSOptInRequired
  | KMSThrottlingException
  | NotFoundException
  | PlatformApplicationDisabledException
  | ValidationException
  | RequestLimitExceeded
  | InvalidClientTokenId
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
    RequestLimitExceeded,
    InvalidClientTokenId,
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
export const publishBatch: (
  input: PublishBatchInput,
) => effect.Effect<
  PublishBatchResponse,
  | AuthorizationErrorException
  | BatchEntryIdsNotDistinctException
  | BatchRequestTooLongException
  | EmptyBatchRequestException
  | EndpointDisabledException
  | InternalErrorException
  | InvalidBatchEntryIdException
  | InvalidParameterException
  | InvalidParameterValueException
  | InvalidSecurityException
  | KMSAccessDeniedException
  | KMSDisabledException
  | KMSInvalidStateException
  | KMSNotFoundException
  | KMSOptInRequired
  | KMSThrottlingException
  | NotFoundException
  | PlatformApplicationDisabledException
  | TooManyEntriesInBatchRequestException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

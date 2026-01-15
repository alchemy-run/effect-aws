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
const ns = T.XmlNamespace("http://cognito-idp.amazonaws.com/doc/2016-04-18/");
const svc = T.AwsApiService({
  sdkId: "Cognito Identity Provider",
  serviceShapeName: "AWSCognitoIdentityProviderService",
});
const auth = T.AwsAuthSigv4({ name: "cognito-idp" });
const ver = T.ServiceVersion("2016-04-18");
const proto = T.AwsProtocolsAwsJson1_1();
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
            if (Region === "us-east-1") {
              return e("https://cognito-idp-fips.us-east-1.amazonaws.com");
            }
            if (Region === "us-east-2") {
              return e("https://cognito-idp-fips.us-east-2.amazonaws.com");
            }
            if (Region === "us-west-1") {
              return e("https://cognito-idp-fips.us-west-1.amazonaws.com");
            }
            if (Region === "us-west-2") {
              return e("https://cognito-idp-fips.us-west-2.amazonaws.com");
            }
            return e(
              `https://cognito-idp-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://cognito-idp-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            if ("aws" === _.getAttr(PartitionResult, "name")) {
              return e(`https://cognito-idp.${Region}.amazonaws.com`);
            }
            return e(
              `https://cognito-idp.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cognito-idp.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type UserPoolIdType = string;
export type UsernameType = string | redacted.Redacted<string>;
export type GroupNameType = string;
export type PasswordType = string | redacted.Redacted<string>;
export type ForceAliasCreation = boolean;
export type AttributeNameType = string;
export type StringType = string;
export type DeviceKeyType = string;
export type ClientIdType = string | redacted.Redacted<string>;
export type SessionType = string | redacted.Redacted<string>;
export type QueryLimitType = number;
export type SearchPaginationTokenType = string;
export type PaginationKey = string;
export type EventIdType = string;
export type TokenModelType = string | redacted.Redacted<string>;
export type Document = unknown;
export type DeviceNameType = string;
export type SecretHashType = string | redacted.Redacted<string>;
export type ConfirmationCodeType = string;
export type DescriptionType = string;
export type ArnType = string;
export type PrecedenceType = number;
export type ProviderNameTypeV2 = string;
export type IdpIdentifierType = string;
export type ResourceServerIdentifierType = string;
export type ResourceServerNameType = string;
export type TermsNameType = string;
export type UserImportJobNameType = string;
export type UserPoolNameType = string;
export type SmsVerificationMessageType = string;
export type EmailVerificationMessageType = string;
export type EmailVerificationSubjectType = string;
export type ClientNameType = string;
export type GenerateSecret = boolean;
export type RefreshTokenValidityType = number;
export type AccessTokenValidityType = number;
export type IdTokenValidityType = number;
export type ClientPermissionType = string;
export type ProviderNameType = string;
export type RedirectUrlType = string;
export type ScopeType = string;
export type WrappedBooleanType = boolean;
export type AuthSessionValidityType = number;
export type DomainType = string;
export type WrappedIntegerType = number;
export type ManagedLoginBrandingIdType = string;
export type TermsIdType = string;
export type UserImportJobIdType = string;
export type ClientSecretType = string | redacted.Redacted<string>;
export type ListProvidersLimitType = number;
export type PaginationKeyType = string;
export type ListResourceServersLimitType = number;
export type ListTermsRequestMaxResultsInteger = number;
export type PoolQueryLimitType = number;
export type QueryLimit = number;
export type UserFilterType = string;
export type WebAuthnCredentialsQueryLimitType = number;
export type CSSType = string;
export type ImageFileType = Uint8Array;
export type TagKeysType = string;
export type SoftwareTokenMFAUserCodeType = string | redacted.Redacted<string>;
export type CustomAttributeNameType = string;
export type AttributeValueType = string | redacted.Redacted<string>;
export type AttributeMappingKeyType = string;
export type AssetBytesType = Uint8Array;
export type ResourceIdType = string;
export type ResourceServerScopeNameType = string;
export type ResourceServerScopeDescriptionType = string;
export type LanguageIdType = string;
export type LinkUrlType = string;
export type EmailVerificationMessageByLinkType = string;
export type EmailVerificationSubjectByLinkType = string;
export type EmailAddressType = string;
export type SESConfigurationSet = string;
export type RegionCodeType = string;
export type TagValueType = string;
export type AdminCreateUserUnusedAccountValidityDaysType = number;
export type HexStringType = string;
export type RetryGracePeriodSecondsType = number;
export type EmailMfaMessageType = string;
export type EmailMfaSubjectType = string;
export type RelyingPartyIdType = string;
export type MessageType = string;
export type SecretCodeType = string | redacted.Redacted<string>;
export type PasswordPolicyMinLengthType = number;
export type PasswordHistorySizeType = number;
export type TemporaryPasswordValidityDaysType = number;
export type SmsInviteMessageType = string;
export type EmailInviteMessageType = string;
export type PriorityType = number;
export type S3ArnType = string;
export type PreSignedUrlType = string;
export type LongType = number;
export type CompletionMessageType = string;
export type IntegerType = number;
export type AWSAccountIdType = string;
export type S3BucketType = string;
export type DomainVersionType = string;
export type ImageUrlType = string;
export type CSSVersionType = string;
export type WebAuthnAuthenticatorAttachmentType = string;
export type WebAuthnAuthenticatorTransportType = string;
export type EmailNotificationSubjectType = string;
export type EmailNotificationBodyType = string;
export type AccountTakeoverActionNotifyType = boolean;
export type InvalidParameterExceptionReasonCodeType = string;

//# Schemas
export type MessageActionType = "RESEND" | "SUPPRESS" | (string & {});
export const MessageActionType = S.String;
export type DeliveryMediumType = "SMS" | "EMAIL" | (string & {});
export const DeliveryMediumType = S.String;
export type DeliveryMediumListType = DeliveryMediumType[];
export const DeliveryMediumListType = S.Array(DeliveryMediumType);
export type AttributeNameListType = string[];
export const AttributeNameListType = S.Array(S.String);
export type AuthFlowType =
  | "USER_SRP_AUTH"
  | "REFRESH_TOKEN_AUTH"
  | "REFRESH_TOKEN"
  | "CUSTOM_AUTH"
  | "ADMIN_NO_SRP_AUTH"
  | "USER_PASSWORD_AUTH"
  | "ADMIN_USER_PASSWORD_AUTH"
  | "USER_AUTH"
  | (string & {});
export const AuthFlowType = S.String;
export type ChallengeNameType =
  | "SMS_MFA"
  | "EMAIL_OTP"
  | "SOFTWARE_TOKEN_MFA"
  | "SELECT_MFA_TYPE"
  | "MFA_SETUP"
  | "PASSWORD_VERIFIER"
  | "CUSTOM_CHALLENGE"
  | "SELECT_CHALLENGE"
  | "DEVICE_SRP_AUTH"
  | "DEVICE_PASSWORD_VERIFIER"
  | "ADMIN_NO_SRP_AUTH"
  | "NEW_PASSWORD_REQUIRED"
  | "SMS_OTP"
  | "PASSWORD"
  | "WEB_AUTHN"
  | "PASSWORD_SRP"
  | (string & {});
export const ChallengeNameType = S.String;
export type FeedbackValueType = "Valid" | "Invalid" | (string & {});
export const FeedbackValueType = S.String;
export type DeviceRememberedStatusType =
  | "remembered"
  | "not_remembered"
  | (string & {});
export const DeviceRememberedStatusType = S.String;
export type IdentityProviderTypeType =
  | "SAML"
  | "Facebook"
  | "Google"
  | "LoginWithAmazon"
  | "SignInWithApple"
  | "OIDC"
  | (string & {});
export const IdentityProviderTypeType = S.String;
export type IdpIdentifiersListType = string[];
export const IdpIdentifiersListType = S.Array(S.String);
export type TermsSourceType = "LINK" | (string & {});
export const TermsSourceType = S.String;
export type TermsEnforcementType = "NONE" | (string & {});
export const TermsEnforcementType = S.String;
export type DeletionProtectionType = "ACTIVE" | "INACTIVE" | (string & {});
export const DeletionProtectionType = S.String;
export type VerifiedAttributeType = "phone_number" | "email" | (string & {});
export const VerifiedAttributeType = S.String;
export type VerifiedAttributesListType = VerifiedAttributeType[];
export const VerifiedAttributesListType = S.Array(VerifiedAttributeType);
export type AliasAttributeType =
  | "phone_number"
  | "email"
  | "preferred_username"
  | (string & {});
export const AliasAttributeType = S.String;
export type AliasAttributesListType = AliasAttributeType[];
export const AliasAttributesListType = S.Array(AliasAttributeType);
export type UsernameAttributeType = "phone_number" | "email" | (string & {});
export const UsernameAttributeType = S.String;
export type UsernameAttributesListType = UsernameAttributeType[];
export const UsernameAttributesListType = S.Array(UsernameAttributeType);
export type UserPoolMfaType = "OFF" | "ON" | "OPTIONAL" | (string & {});
export const UserPoolMfaType = S.String;
export type AttributeDataType =
  | "String"
  | "Number"
  | "DateTime"
  | "Boolean"
  | (string & {});
export const AttributeDataType = S.String;
export interface NumberAttributeConstraintsType {
  MinValue?: string;
  MaxValue?: string;
}
export const NumberAttributeConstraintsType = S.suspend(() =>
  S.Struct({ MinValue: S.optional(S.String), MaxValue: S.optional(S.String) }),
).annotations({
  identifier: "NumberAttributeConstraintsType",
}) as any as S.Schema<NumberAttributeConstraintsType>;
export interface StringAttributeConstraintsType {
  MinLength?: string;
  MaxLength?: string;
}
export const StringAttributeConstraintsType = S.suspend(() =>
  S.Struct({
    MinLength: S.optional(S.String),
    MaxLength: S.optional(S.String),
  }),
).annotations({
  identifier: "StringAttributeConstraintsType",
}) as any as S.Schema<StringAttributeConstraintsType>;
export interface SchemaAttributeType {
  Name?: string;
  AttributeDataType?: AttributeDataType;
  DeveloperOnlyAttribute?: boolean;
  Mutable?: boolean;
  Required?: boolean;
  NumberAttributeConstraints?: NumberAttributeConstraintsType;
  StringAttributeConstraints?: StringAttributeConstraintsType;
}
export const SchemaAttributeType = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    AttributeDataType: S.optional(AttributeDataType),
    DeveloperOnlyAttribute: S.optional(S.Boolean),
    Mutable: S.optional(S.Boolean),
    Required: S.optional(S.Boolean),
    NumberAttributeConstraints: S.optional(NumberAttributeConstraintsType),
    StringAttributeConstraints: S.optional(StringAttributeConstraintsType),
  }),
).annotations({
  identifier: "SchemaAttributeType",
}) as any as S.Schema<SchemaAttributeType>;
export type SchemaAttributesListType = SchemaAttributeType[];
export const SchemaAttributesListType = S.Array(SchemaAttributeType);
export type UserPoolTierType = "LITE" | "ESSENTIALS" | "PLUS" | (string & {});
export const UserPoolTierType = S.String;
export type ClientPermissionListType = string[];
export const ClientPermissionListType = S.Array(S.String);
export type ExplicitAuthFlowsType =
  | "ADMIN_NO_SRP_AUTH"
  | "CUSTOM_AUTH_FLOW_ONLY"
  | "USER_PASSWORD_AUTH"
  | "ALLOW_ADMIN_USER_PASSWORD_AUTH"
  | "ALLOW_CUSTOM_AUTH"
  | "ALLOW_USER_PASSWORD_AUTH"
  | "ALLOW_USER_SRP_AUTH"
  | "ALLOW_REFRESH_TOKEN_AUTH"
  | "ALLOW_USER_AUTH"
  | (string & {});
export const ExplicitAuthFlowsType = S.String;
export type ExplicitAuthFlowsListType = ExplicitAuthFlowsType[];
export const ExplicitAuthFlowsListType = S.Array(ExplicitAuthFlowsType);
export type SupportedIdentityProvidersListType = string[];
export const SupportedIdentityProvidersListType = S.Array(S.String);
export type CallbackURLsListType = string[];
export const CallbackURLsListType = S.Array(S.String);
export type LogoutURLsListType = string[];
export const LogoutURLsListType = S.Array(S.String);
export type OAuthFlowType =
  | "code"
  | "implicit"
  | "client_credentials"
  | (string & {});
export const OAuthFlowType = S.String;
export type OAuthFlowsType = OAuthFlowType[];
export const OAuthFlowsType = S.Array(OAuthFlowType);
export type ScopeListType = string[];
export const ScopeListType = S.Array(S.String);
export type PreventUserExistenceErrorTypes =
  | "LEGACY"
  | "ENABLED"
  | (string & {});
export const PreventUserExistenceErrorTypes = S.String;
export type SearchedAttributeNamesListType = string[];
export const SearchedAttributeNamesListType = S.Array(S.String);
export type UserPoolTagsListType = string[];
export const UserPoolTagsListType = S.Array(S.String);
export interface AdminAddUserToGroupRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  GroupName: string;
}
export const AdminAddUserToGroupRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    GroupName: S.String,
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
  identifier: "AdminAddUserToGroupRequest",
}) as any as S.Schema<AdminAddUserToGroupRequest>;
export interface AdminAddUserToGroupResponse {}
export const AdminAddUserToGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminAddUserToGroupResponse",
}) as any as S.Schema<AdminAddUserToGroupResponse>;
export interface AdminDeleteUserRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
}
export const AdminDeleteUserRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, Username: SensitiveString }).pipe(
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
  identifier: "AdminDeleteUserRequest",
}) as any as S.Schema<AdminDeleteUserRequest>;
export interface AdminDeleteUserResponse {}
export const AdminDeleteUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminDeleteUserResponse",
}) as any as S.Schema<AdminDeleteUserResponse>;
export interface AdminDeleteUserAttributesRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  UserAttributeNames: string[];
}
export const AdminDeleteUserAttributesRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    UserAttributeNames: AttributeNameListType,
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
  identifier: "AdminDeleteUserAttributesRequest",
}) as any as S.Schema<AdminDeleteUserAttributesRequest>;
export interface AdminDeleteUserAttributesResponse {}
export const AdminDeleteUserAttributesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminDeleteUserAttributesResponse",
}) as any as S.Schema<AdminDeleteUserAttributesResponse>;
export interface AdminDisableUserRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
}
export const AdminDisableUserRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, Username: SensitiveString }).pipe(
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
  identifier: "AdminDisableUserRequest",
}) as any as S.Schema<AdminDisableUserRequest>;
export interface AdminDisableUserResponse {}
export const AdminDisableUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminDisableUserResponse",
}) as any as S.Schema<AdminDisableUserResponse>;
export interface AdminEnableUserRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
}
export const AdminEnableUserRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, Username: SensitiveString }).pipe(
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
  identifier: "AdminEnableUserRequest",
}) as any as S.Schema<AdminEnableUserRequest>;
export interface AdminEnableUserResponse {}
export const AdminEnableUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminEnableUserResponse",
}) as any as S.Schema<AdminEnableUserResponse>;
export interface AdminForgetDeviceRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  DeviceKey: string;
}
export const AdminForgetDeviceRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    DeviceKey: S.String,
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
  identifier: "AdminForgetDeviceRequest",
}) as any as S.Schema<AdminForgetDeviceRequest>;
export interface AdminForgetDeviceResponse {}
export const AdminForgetDeviceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminForgetDeviceResponse",
}) as any as S.Schema<AdminForgetDeviceResponse>;
export interface AdminGetDeviceRequest {
  DeviceKey: string;
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
}
export const AdminGetDeviceRequest = S.suspend(() =>
  S.Struct({
    DeviceKey: S.String,
    UserPoolId: S.String,
    Username: SensitiveString,
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
  identifier: "AdminGetDeviceRequest",
}) as any as S.Schema<AdminGetDeviceRequest>;
export interface AdminGetUserRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
}
export const AdminGetUserRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, Username: SensitiveString }).pipe(
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
  identifier: "AdminGetUserRequest",
}) as any as S.Schema<AdminGetUserRequest>;
export interface ProviderUserIdentifierType {
  ProviderName?: string;
  ProviderAttributeName?: string;
  ProviderAttributeValue?: string;
}
export const ProviderUserIdentifierType = S.suspend(() =>
  S.Struct({
    ProviderName: S.optional(S.String),
    ProviderAttributeName: S.optional(S.String),
    ProviderAttributeValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ProviderUserIdentifierType",
}) as any as S.Schema<ProviderUserIdentifierType>;
export interface AdminLinkProviderForUserRequest {
  UserPoolId: string;
  DestinationUser: ProviderUserIdentifierType;
  SourceUser: ProviderUserIdentifierType;
}
export const AdminLinkProviderForUserRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    DestinationUser: ProviderUserIdentifierType,
    SourceUser: ProviderUserIdentifierType,
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
  identifier: "AdminLinkProviderForUserRequest",
}) as any as S.Schema<AdminLinkProviderForUserRequest>;
export interface AdminLinkProviderForUserResponse {}
export const AdminLinkProviderForUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminLinkProviderForUserResponse",
}) as any as S.Schema<AdminLinkProviderForUserResponse>;
export interface AdminListDevicesRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  Limit?: number;
  PaginationToken?: string;
}
export const AdminListDevicesRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    Limit: S.optional(S.Number),
    PaginationToken: S.optional(S.String),
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
  identifier: "AdminListDevicesRequest",
}) as any as S.Schema<AdminListDevicesRequest>;
export interface AdminListGroupsForUserRequest {
  Username: string | redacted.Redacted<string>;
  UserPoolId: string;
  Limit?: number;
  NextToken?: string;
}
export const AdminListGroupsForUserRequest = S.suspend(() =>
  S.Struct({
    Username: SensitiveString,
    UserPoolId: S.String,
    Limit: S.optional(S.Number),
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
  identifier: "AdminListGroupsForUserRequest",
}) as any as S.Schema<AdminListGroupsForUserRequest>;
export interface AdminListUserAuthEventsRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  MaxResults?: number;
  NextToken?: string;
}
export const AdminListUserAuthEventsRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    MaxResults: S.optional(S.Number),
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
  identifier: "AdminListUserAuthEventsRequest",
}) as any as S.Schema<AdminListUserAuthEventsRequest>;
export interface AdminRemoveUserFromGroupRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  GroupName: string;
}
export const AdminRemoveUserFromGroupRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    GroupName: S.String,
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
  identifier: "AdminRemoveUserFromGroupRequest",
}) as any as S.Schema<AdminRemoveUserFromGroupRequest>;
export interface AdminRemoveUserFromGroupResponse {}
export const AdminRemoveUserFromGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminRemoveUserFromGroupResponse",
}) as any as S.Schema<AdminRemoveUserFromGroupResponse>;
export type ClientMetadataType = { [key: string]: string | undefined };
export const ClientMetadataType = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface AdminResetUserPasswordRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  ClientMetadata?: { [key: string]: string | undefined };
}
export const AdminResetUserPasswordRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "AdminResetUserPasswordRequest",
}) as any as S.Schema<AdminResetUserPasswordRequest>;
export interface AdminResetUserPasswordResponse {}
export const AdminResetUserPasswordResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminResetUserPasswordResponse",
}) as any as S.Schema<AdminResetUserPasswordResponse>;
export interface AdminSetUserPasswordRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  Password: string | redacted.Redacted<string>;
  Permanent?: boolean;
}
export const AdminSetUserPasswordRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    Password: SensitiveString,
    Permanent: S.optional(S.Boolean),
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
  identifier: "AdminSetUserPasswordRequest",
}) as any as S.Schema<AdminSetUserPasswordRequest>;
export interface AdminSetUserPasswordResponse {}
export const AdminSetUserPasswordResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminSetUserPasswordResponse",
}) as any as S.Schema<AdminSetUserPasswordResponse>;
export interface AdminUpdateAuthEventFeedbackRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  EventId: string;
  FeedbackValue: FeedbackValueType;
}
export const AdminUpdateAuthEventFeedbackRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    EventId: S.String,
    FeedbackValue: FeedbackValueType,
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
  identifier: "AdminUpdateAuthEventFeedbackRequest",
}) as any as S.Schema<AdminUpdateAuthEventFeedbackRequest>;
export interface AdminUpdateAuthEventFeedbackResponse {}
export const AdminUpdateAuthEventFeedbackResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminUpdateAuthEventFeedbackResponse",
}) as any as S.Schema<AdminUpdateAuthEventFeedbackResponse>;
export interface AdminUpdateDeviceStatusRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  DeviceKey: string;
  DeviceRememberedStatus?: DeviceRememberedStatusType;
}
export const AdminUpdateDeviceStatusRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    DeviceKey: S.String,
    DeviceRememberedStatus: S.optional(DeviceRememberedStatusType),
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
  identifier: "AdminUpdateDeviceStatusRequest",
}) as any as S.Schema<AdminUpdateDeviceStatusRequest>;
export interface AdminUpdateDeviceStatusResponse {}
export const AdminUpdateDeviceStatusResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminUpdateDeviceStatusResponse",
}) as any as S.Schema<AdminUpdateDeviceStatusResponse>;
export interface AttributeType {
  Name: string;
  Value?: string | redacted.Redacted<string>;
}
export const AttributeType = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.optional(SensitiveString) }),
).annotations({
  identifier: "AttributeType",
}) as any as S.Schema<AttributeType>;
export type AttributeListType = AttributeType[];
export const AttributeListType = S.Array(AttributeType);
export interface AdminUpdateUserAttributesRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  UserAttributes: AttributeType[];
  ClientMetadata?: { [key: string]: string | undefined };
}
export const AdminUpdateUserAttributesRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    UserAttributes: AttributeListType,
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "AdminUpdateUserAttributesRequest",
}) as any as S.Schema<AdminUpdateUserAttributesRequest>;
export interface AdminUpdateUserAttributesResponse {}
export const AdminUpdateUserAttributesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminUpdateUserAttributesResponse",
}) as any as S.Schema<AdminUpdateUserAttributesResponse>;
export interface AdminUserGlobalSignOutRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
}
export const AdminUserGlobalSignOutRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, Username: SensitiveString }).pipe(
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
  identifier: "AdminUserGlobalSignOutRequest",
}) as any as S.Schema<AdminUserGlobalSignOutRequest>;
export interface AdminUserGlobalSignOutResponse {}
export const AdminUserGlobalSignOutResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminUserGlobalSignOutResponse",
}) as any as S.Schema<AdminUserGlobalSignOutResponse>;
export interface AssociateSoftwareTokenRequest {
  AccessToken?: string | redacted.Redacted<string>;
  Session?: string | redacted.Redacted<string>;
}
export const AssociateSoftwareTokenRequest = S.suspend(() =>
  S.Struct({
    AccessToken: S.optional(SensitiveString),
    Session: S.optional(SensitiveString),
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
  identifier: "AssociateSoftwareTokenRequest",
}) as any as S.Schema<AssociateSoftwareTokenRequest>;
export interface ChangePasswordRequest {
  PreviousPassword?: string | redacted.Redacted<string>;
  ProposedPassword: string | redacted.Redacted<string>;
  AccessToken: string | redacted.Redacted<string>;
}
export const ChangePasswordRequest = S.suspend(() =>
  S.Struct({
    PreviousPassword: S.optional(SensitiveString),
    ProposedPassword: SensitiveString,
    AccessToken: SensitiveString,
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
  identifier: "ChangePasswordRequest",
}) as any as S.Schema<ChangePasswordRequest>;
export interface ChangePasswordResponse {}
export const ChangePasswordResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ChangePasswordResponse",
}) as any as S.Schema<ChangePasswordResponse>;
export interface CompleteWebAuthnRegistrationRequest {
  AccessToken: string | redacted.Redacted<string>;
  Credential: any;
}
export const CompleteWebAuthnRegistrationRequest = S.suspend(() =>
  S.Struct({ AccessToken: SensitiveString, Credential: S.Any }).pipe(
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
  identifier: "CompleteWebAuthnRegistrationRequest",
}) as any as S.Schema<CompleteWebAuthnRegistrationRequest>;
export interface CompleteWebAuthnRegistrationResponse {}
export const CompleteWebAuthnRegistrationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CompleteWebAuthnRegistrationResponse",
}) as any as S.Schema<CompleteWebAuthnRegistrationResponse>;
export interface AnalyticsMetadataType {
  AnalyticsEndpointId?: string;
}
export const AnalyticsMetadataType = S.suspend(() =>
  S.Struct({ AnalyticsEndpointId: S.optional(S.String) }),
).annotations({
  identifier: "AnalyticsMetadataType",
}) as any as S.Schema<AnalyticsMetadataType>;
export interface UserContextDataType {
  IpAddress?: string;
  EncodedData?: string;
}
export const UserContextDataType = S.suspend(() =>
  S.Struct({
    IpAddress: S.optional(S.String),
    EncodedData: S.optional(S.String),
  }),
).annotations({
  identifier: "UserContextDataType",
}) as any as S.Schema<UserContextDataType>;
export interface ConfirmSignUpRequest {
  ClientId: string | redacted.Redacted<string>;
  SecretHash?: string | redacted.Redacted<string>;
  Username: string | redacted.Redacted<string>;
  ConfirmationCode: string;
  ForceAliasCreation?: boolean;
  AnalyticsMetadata?: AnalyticsMetadataType;
  UserContextData?: UserContextDataType;
  ClientMetadata?: { [key: string]: string | undefined };
  Session?: string | redacted.Redacted<string>;
}
export const ConfirmSignUpRequest = S.suspend(() =>
  S.Struct({
    ClientId: SensitiveString,
    SecretHash: S.optional(SensitiveString),
    Username: SensitiveString,
    ConfirmationCode: S.String,
    ForceAliasCreation: S.optional(S.Boolean),
    AnalyticsMetadata: S.optional(AnalyticsMetadataType),
    UserContextData: S.optional(UserContextDataType),
    ClientMetadata: S.optional(ClientMetadataType),
    Session: S.optional(SensitiveString),
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
  identifier: "ConfirmSignUpRequest",
}) as any as S.Schema<ConfirmSignUpRequest>;
export interface CreateGroupRequest {
  GroupName: string;
  UserPoolId: string;
  Description?: string;
  RoleArn?: string;
  Precedence?: number;
}
export const CreateGroupRequest = S.suspend(() =>
  S.Struct({
    GroupName: S.String,
    UserPoolId: S.String,
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Precedence: S.optional(S.Number),
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
  identifier: "CreateGroupRequest",
}) as any as S.Schema<CreateGroupRequest>;
export interface CreateUserImportJobRequest {
  JobName: string;
  UserPoolId: string;
  CloudWatchLogsRoleArn: string;
}
export const CreateUserImportJobRequest = S.suspend(() =>
  S.Struct({
    JobName: S.String,
    UserPoolId: S.String,
    CloudWatchLogsRoleArn: S.String,
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
  identifier: "CreateUserImportJobRequest",
}) as any as S.Schema<CreateUserImportJobRequest>;
export interface DeleteGroupRequest {
  GroupName: string;
  UserPoolId: string;
}
export const DeleteGroupRequest = S.suspend(() =>
  S.Struct({ GroupName: S.String, UserPoolId: S.String }).pipe(
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
  identifier: "DeleteGroupRequest",
}) as any as S.Schema<DeleteGroupRequest>;
export interface DeleteGroupResponse {}
export const DeleteGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteGroupResponse",
}) as any as S.Schema<DeleteGroupResponse>;
export interface DeleteIdentityProviderRequest {
  UserPoolId: string;
  ProviderName: string;
}
export const DeleteIdentityProviderRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, ProviderName: S.String }).pipe(
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
  identifier: "DeleteIdentityProviderRequest",
}) as any as S.Schema<DeleteIdentityProviderRequest>;
export interface DeleteIdentityProviderResponse {}
export const DeleteIdentityProviderResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteIdentityProviderResponse",
}) as any as S.Schema<DeleteIdentityProviderResponse>;
export interface DeleteManagedLoginBrandingRequest {
  ManagedLoginBrandingId: string;
  UserPoolId: string;
}
export const DeleteManagedLoginBrandingRequest = S.suspend(() =>
  S.Struct({ ManagedLoginBrandingId: S.String, UserPoolId: S.String }).pipe(
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
  identifier: "DeleteManagedLoginBrandingRequest",
}) as any as S.Schema<DeleteManagedLoginBrandingRequest>;
export interface DeleteManagedLoginBrandingResponse {}
export const DeleteManagedLoginBrandingResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteManagedLoginBrandingResponse",
}) as any as S.Schema<DeleteManagedLoginBrandingResponse>;
export interface DeleteResourceServerRequest {
  UserPoolId: string;
  Identifier: string;
}
export const DeleteResourceServerRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, Identifier: S.String }).pipe(
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
  identifier: "DeleteResourceServerRequest",
}) as any as S.Schema<DeleteResourceServerRequest>;
export interface DeleteResourceServerResponse {}
export const DeleteResourceServerResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteResourceServerResponse",
}) as any as S.Schema<DeleteResourceServerResponse>;
export interface DeleteTermsRequest {
  TermsId: string;
  UserPoolId: string;
}
export const DeleteTermsRequest = S.suspend(() =>
  S.Struct({ TermsId: S.String, UserPoolId: S.String }).pipe(
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
  identifier: "DeleteTermsRequest",
}) as any as S.Schema<DeleteTermsRequest>;
export interface DeleteTermsResponse {}
export const DeleteTermsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTermsResponse",
}) as any as S.Schema<DeleteTermsResponse>;
export interface DeleteUserRequest {
  AccessToken: string | redacted.Redacted<string>;
}
export const DeleteUserRequest = S.suspend(() =>
  S.Struct({ AccessToken: SensitiveString }).pipe(
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
  identifier: "DeleteUserRequest",
}) as any as S.Schema<DeleteUserRequest>;
export interface DeleteUserResponse {}
export const DeleteUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUserResponse",
}) as any as S.Schema<DeleteUserResponse>;
export interface DeleteUserAttributesRequest {
  UserAttributeNames: string[];
  AccessToken: string | redacted.Redacted<string>;
}
export const DeleteUserAttributesRequest = S.suspend(() =>
  S.Struct({
    UserAttributeNames: AttributeNameListType,
    AccessToken: SensitiveString,
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
  identifier: "DeleteUserAttributesRequest",
}) as any as S.Schema<DeleteUserAttributesRequest>;
export interface DeleteUserAttributesResponse {}
export const DeleteUserAttributesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUserAttributesResponse",
}) as any as S.Schema<DeleteUserAttributesResponse>;
export interface DeleteUserPoolRequest {
  UserPoolId: string;
}
export const DeleteUserPoolRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String }).pipe(
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
  identifier: "DeleteUserPoolRequest",
}) as any as S.Schema<DeleteUserPoolRequest>;
export interface DeleteUserPoolResponse {}
export const DeleteUserPoolResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUserPoolResponse",
}) as any as S.Schema<DeleteUserPoolResponse>;
export interface DeleteUserPoolClientRequest {
  UserPoolId: string;
  ClientId: string | redacted.Redacted<string>;
}
export const DeleteUserPoolClientRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, ClientId: SensitiveString }).pipe(
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
  identifier: "DeleteUserPoolClientRequest",
}) as any as S.Schema<DeleteUserPoolClientRequest>;
export interface DeleteUserPoolClientResponse {}
export const DeleteUserPoolClientResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUserPoolClientResponse",
}) as any as S.Schema<DeleteUserPoolClientResponse>;
export interface DeleteUserPoolDomainRequest {
  Domain: string;
  UserPoolId: string;
}
export const DeleteUserPoolDomainRequest = S.suspend(() =>
  S.Struct({ Domain: S.String, UserPoolId: S.String }).pipe(
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
  identifier: "DeleteUserPoolDomainRequest",
}) as any as S.Schema<DeleteUserPoolDomainRequest>;
export interface DeleteUserPoolDomainResponse {}
export const DeleteUserPoolDomainResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteUserPoolDomainResponse",
}) as any as S.Schema<DeleteUserPoolDomainResponse>;
export interface DeleteWebAuthnCredentialRequest {
  AccessToken: string | redacted.Redacted<string>;
  CredentialId: string;
}
export const DeleteWebAuthnCredentialRequest = S.suspend(() =>
  S.Struct({ AccessToken: SensitiveString, CredentialId: S.String }).pipe(
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
  identifier: "DeleteWebAuthnCredentialRequest",
}) as any as S.Schema<DeleteWebAuthnCredentialRequest>;
export interface DeleteWebAuthnCredentialResponse {}
export const DeleteWebAuthnCredentialResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteWebAuthnCredentialResponse",
}) as any as S.Schema<DeleteWebAuthnCredentialResponse>;
export interface DescribeIdentityProviderRequest {
  UserPoolId: string;
  ProviderName: string;
}
export const DescribeIdentityProviderRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, ProviderName: S.String }).pipe(
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
  identifier: "DescribeIdentityProviderRequest",
}) as any as S.Schema<DescribeIdentityProviderRequest>;
export interface DescribeManagedLoginBrandingRequest {
  UserPoolId: string;
  ManagedLoginBrandingId: string;
  ReturnMergedResources?: boolean;
}
export const DescribeManagedLoginBrandingRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ManagedLoginBrandingId: S.String,
    ReturnMergedResources: S.optional(S.Boolean),
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
  identifier: "DescribeManagedLoginBrandingRequest",
}) as any as S.Schema<DescribeManagedLoginBrandingRequest>;
export interface DescribeManagedLoginBrandingByClientRequest {
  UserPoolId: string;
  ClientId: string | redacted.Redacted<string>;
  ReturnMergedResources?: boolean;
}
export const DescribeManagedLoginBrandingByClientRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ClientId: SensitiveString,
    ReturnMergedResources: S.optional(S.Boolean),
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
  identifier: "DescribeManagedLoginBrandingByClientRequest",
}) as any as S.Schema<DescribeManagedLoginBrandingByClientRequest>;
export interface DescribeResourceServerRequest {
  UserPoolId: string;
  Identifier: string;
}
export const DescribeResourceServerRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, Identifier: S.String }).pipe(
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
  identifier: "DescribeResourceServerRequest",
}) as any as S.Schema<DescribeResourceServerRequest>;
export interface DescribeRiskConfigurationRequest {
  UserPoolId: string;
  ClientId?: string | redacted.Redacted<string>;
}
export const DescribeRiskConfigurationRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ClientId: S.optional(SensitiveString),
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
  identifier: "DescribeRiskConfigurationRequest",
}) as any as S.Schema<DescribeRiskConfigurationRequest>;
export interface DescribeTermsRequest {
  TermsId: string;
  UserPoolId: string;
}
export const DescribeTermsRequest = S.suspend(() =>
  S.Struct({ TermsId: S.String, UserPoolId: S.String }).pipe(
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
  identifier: "DescribeTermsRequest",
}) as any as S.Schema<DescribeTermsRequest>;
export interface DescribeUserImportJobRequest {
  UserPoolId: string;
  JobId: string;
}
export const DescribeUserImportJobRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, JobId: S.String }).pipe(
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
  identifier: "DescribeUserImportJobRequest",
}) as any as S.Schema<DescribeUserImportJobRequest>;
export interface DescribeUserPoolRequest {
  UserPoolId: string;
}
export const DescribeUserPoolRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String }).pipe(
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
  identifier: "DescribeUserPoolRequest",
}) as any as S.Schema<DescribeUserPoolRequest>;
export interface DescribeUserPoolClientRequest {
  UserPoolId: string;
  ClientId: string | redacted.Redacted<string>;
}
export const DescribeUserPoolClientRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, ClientId: SensitiveString }).pipe(
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
  identifier: "DescribeUserPoolClientRequest",
}) as any as S.Schema<DescribeUserPoolClientRequest>;
export interface DescribeUserPoolDomainRequest {
  Domain: string;
}
export const DescribeUserPoolDomainRequest = S.suspend(() =>
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
  identifier: "DescribeUserPoolDomainRequest",
}) as any as S.Schema<DescribeUserPoolDomainRequest>;
export interface ForgetDeviceRequest {
  AccessToken?: string | redacted.Redacted<string>;
  DeviceKey: string;
}
export const ForgetDeviceRequest = S.suspend(() =>
  S.Struct({
    AccessToken: S.optional(SensitiveString),
    DeviceKey: S.String,
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
  identifier: "ForgetDeviceRequest",
}) as any as S.Schema<ForgetDeviceRequest>;
export interface ForgetDeviceResponse {}
export const ForgetDeviceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ForgetDeviceResponse",
}) as any as S.Schema<ForgetDeviceResponse>;
export interface ForgotPasswordRequest {
  ClientId: string | redacted.Redacted<string>;
  SecretHash?: string | redacted.Redacted<string>;
  UserContextData?: UserContextDataType;
  Username: string | redacted.Redacted<string>;
  AnalyticsMetadata?: AnalyticsMetadataType;
  ClientMetadata?: { [key: string]: string | undefined };
}
export const ForgotPasswordRequest = S.suspend(() =>
  S.Struct({
    ClientId: SensitiveString,
    SecretHash: S.optional(SensitiveString),
    UserContextData: S.optional(UserContextDataType),
    Username: SensitiveString,
    AnalyticsMetadata: S.optional(AnalyticsMetadataType),
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "ForgotPasswordRequest",
}) as any as S.Schema<ForgotPasswordRequest>;
export interface GetCSVHeaderRequest {
  UserPoolId: string;
}
export const GetCSVHeaderRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String }).pipe(
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
  identifier: "GetCSVHeaderRequest",
}) as any as S.Schema<GetCSVHeaderRequest>;
export interface GetDeviceRequest {
  DeviceKey: string;
  AccessToken?: string | redacted.Redacted<string>;
}
export const GetDeviceRequest = S.suspend(() =>
  S.Struct({
    DeviceKey: S.String,
    AccessToken: S.optional(SensitiveString),
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
  identifier: "GetDeviceRequest",
}) as any as S.Schema<GetDeviceRequest>;
export interface GetGroupRequest {
  GroupName: string;
  UserPoolId: string;
}
export const GetGroupRequest = S.suspend(() =>
  S.Struct({ GroupName: S.String, UserPoolId: S.String }).pipe(
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
  identifier: "GetGroupRequest",
}) as any as S.Schema<GetGroupRequest>;
export interface GetIdentityProviderByIdentifierRequest {
  UserPoolId: string;
  IdpIdentifier: string;
}
export const GetIdentityProviderByIdentifierRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, IdpIdentifier: S.String }).pipe(
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
  identifier: "GetIdentityProviderByIdentifierRequest",
}) as any as S.Schema<GetIdentityProviderByIdentifierRequest>;
export interface GetLogDeliveryConfigurationRequest {
  UserPoolId: string;
}
export const GetLogDeliveryConfigurationRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String }).pipe(
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
  identifier: "GetLogDeliveryConfigurationRequest",
}) as any as S.Schema<GetLogDeliveryConfigurationRequest>;
export interface GetSigningCertificateRequest {
  UserPoolId: string;
}
export const GetSigningCertificateRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String }).pipe(
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
  identifier: "GetSigningCertificateRequest",
}) as any as S.Schema<GetSigningCertificateRequest>;
export interface GetTokensFromRefreshTokenRequest {
  RefreshToken: string | redacted.Redacted<string>;
  ClientId: string | redacted.Redacted<string>;
  ClientSecret?: string | redacted.Redacted<string>;
  DeviceKey?: string;
  ClientMetadata?: { [key: string]: string | undefined };
}
export const GetTokensFromRefreshTokenRequest = S.suspend(() =>
  S.Struct({
    RefreshToken: SensitiveString,
    ClientId: SensitiveString,
    ClientSecret: S.optional(SensitiveString),
    DeviceKey: S.optional(S.String),
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "GetTokensFromRefreshTokenRequest",
}) as any as S.Schema<GetTokensFromRefreshTokenRequest>;
export interface GetUICustomizationRequest {
  UserPoolId: string;
  ClientId?: string | redacted.Redacted<string>;
}
export const GetUICustomizationRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ClientId: S.optional(SensitiveString),
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
  identifier: "GetUICustomizationRequest",
}) as any as S.Schema<GetUICustomizationRequest>;
export interface GetUserRequest {
  AccessToken: string | redacted.Redacted<string>;
}
export const GetUserRequest = S.suspend(() =>
  S.Struct({ AccessToken: SensitiveString }).pipe(
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
  identifier: "GetUserRequest",
}) as any as S.Schema<GetUserRequest>;
export interface GetUserAttributeVerificationCodeRequest {
  AccessToken: string | redacted.Redacted<string>;
  AttributeName: string;
  ClientMetadata?: { [key: string]: string | undefined };
}
export const GetUserAttributeVerificationCodeRequest = S.suspend(() =>
  S.Struct({
    AccessToken: SensitiveString,
    AttributeName: S.String,
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "GetUserAttributeVerificationCodeRequest",
}) as any as S.Schema<GetUserAttributeVerificationCodeRequest>;
export interface GetUserAuthFactorsRequest {
  AccessToken: string | redacted.Redacted<string>;
}
export const GetUserAuthFactorsRequest = S.suspend(() =>
  S.Struct({ AccessToken: SensitiveString }).pipe(
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
  identifier: "GetUserAuthFactorsRequest",
}) as any as S.Schema<GetUserAuthFactorsRequest>;
export interface GetUserPoolMfaConfigRequest {
  UserPoolId: string;
}
export const GetUserPoolMfaConfigRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String }).pipe(
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
  identifier: "GetUserPoolMfaConfigRequest",
}) as any as S.Schema<GetUserPoolMfaConfigRequest>;
export interface GlobalSignOutRequest {
  AccessToken: string | redacted.Redacted<string>;
}
export const GlobalSignOutRequest = S.suspend(() =>
  S.Struct({ AccessToken: SensitiveString }).pipe(
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
  identifier: "GlobalSignOutRequest",
}) as any as S.Schema<GlobalSignOutRequest>;
export interface GlobalSignOutResponse {}
export const GlobalSignOutResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "GlobalSignOutResponse",
}) as any as S.Schema<GlobalSignOutResponse>;
export type AuthParametersType = { [key: string]: string | undefined };
export const AuthParametersType = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface InitiateAuthRequest {
  AuthFlow: AuthFlowType;
  AuthParameters?: { [key: string]: string | undefined };
  ClientMetadata?: { [key: string]: string | undefined };
  ClientId: string | redacted.Redacted<string>;
  AnalyticsMetadata?: AnalyticsMetadataType;
  UserContextData?: UserContextDataType;
  Session?: string | redacted.Redacted<string>;
}
export const InitiateAuthRequest = S.suspend(() =>
  S.Struct({
    AuthFlow: AuthFlowType,
    AuthParameters: S.optional(AuthParametersType),
    ClientMetadata: S.optional(ClientMetadataType),
    ClientId: SensitiveString,
    AnalyticsMetadata: S.optional(AnalyticsMetadataType),
    UserContextData: S.optional(UserContextDataType),
    Session: S.optional(SensitiveString),
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
  identifier: "InitiateAuthRequest",
}) as any as S.Schema<InitiateAuthRequest>;
export interface ListDevicesRequest {
  AccessToken: string | redacted.Redacted<string>;
  Limit?: number;
  PaginationToken?: string;
}
export const ListDevicesRequest = S.suspend(() =>
  S.Struct({
    AccessToken: SensitiveString,
    Limit: S.optional(S.Number),
    PaginationToken: S.optional(S.String),
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
  identifier: "ListDevicesRequest",
}) as any as S.Schema<ListDevicesRequest>;
export interface ListGroupsRequest {
  UserPoolId: string;
  Limit?: number;
  NextToken?: string;
}
export const ListGroupsRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Limit: S.optional(S.Number),
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
  identifier: "ListGroupsRequest",
}) as any as S.Schema<ListGroupsRequest>;
export interface ListIdentityProvidersRequest {
  UserPoolId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListIdentityProvidersRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    MaxResults: S.optional(S.Number),
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
  identifier: "ListIdentityProvidersRequest",
}) as any as S.Schema<ListIdentityProvidersRequest>;
export interface ListResourceServersRequest {
  UserPoolId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListResourceServersRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    MaxResults: S.optional(S.Number),
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
  identifier: "ListResourceServersRequest",
}) as any as S.Schema<ListResourceServersRequest>;
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
export interface ListTermsRequest {
  UserPoolId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTermsRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    MaxResults: S.optional(S.Number),
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
  identifier: "ListTermsRequest",
}) as any as S.Schema<ListTermsRequest>;
export interface ListUserImportJobsRequest {
  UserPoolId: string;
  MaxResults: number;
  PaginationToken?: string;
}
export const ListUserImportJobsRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    MaxResults: S.Number,
    PaginationToken: S.optional(S.String),
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
  identifier: "ListUserImportJobsRequest",
}) as any as S.Schema<ListUserImportJobsRequest>;
export interface ListUserPoolClientsRequest {
  UserPoolId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListUserPoolClientsRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    MaxResults: S.optional(S.Number),
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
  identifier: "ListUserPoolClientsRequest",
}) as any as S.Schema<ListUserPoolClientsRequest>;
export interface ListUserPoolsRequest {
  NextToken?: string;
  MaxResults: number;
}
export const ListUserPoolsRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), MaxResults: S.Number }).pipe(
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
  identifier: "ListUserPoolsRequest",
}) as any as S.Schema<ListUserPoolsRequest>;
export interface ListUsersRequest {
  UserPoolId: string;
  AttributesToGet?: string[];
  Limit?: number;
  PaginationToken?: string;
  Filter?: string;
}
export const ListUsersRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    AttributesToGet: S.optional(SearchedAttributeNamesListType),
    Limit: S.optional(S.Number),
    PaginationToken: S.optional(S.String),
    Filter: S.optional(S.String),
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
  identifier: "ListUsersRequest",
}) as any as S.Schema<ListUsersRequest>;
export interface ListUsersInGroupRequest {
  UserPoolId: string;
  GroupName: string;
  Limit?: number;
  NextToken?: string;
}
export const ListUsersInGroupRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    GroupName: S.String,
    Limit: S.optional(S.Number),
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
  identifier: "ListUsersInGroupRequest",
}) as any as S.Schema<ListUsersInGroupRequest>;
export interface ListWebAuthnCredentialsRequest {
  AccessToken: string | redacted.Redacted<string>;
  NextToken?: string;
  MaxResults?: number;
}
export const ListWebAuthnCredentialsRequest = S.suspend(() =>
  S.Struct({
    AccessToken: SensitiveString,
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
  identifier: "ListWebAuthnCredentialsRequest",
}) as any as S.Schema<ListWebAuthnCredentialsRequest>;
export interface ResendConfirmationCodeRequest {
  ClientId: string | redacted.Redacted<string>;
  SecretHash?: string | redacted.Redacted<string>;
  UserContextData?: UserContextDataType;
  Username: string | redacted.Redacted<string>;
  AnalyticsMetadata?: AnalyticsMetadataType;
  ClientMetadata?: { [key: string]: string | undefined };
}
export const ResendConfirmationCodeRequest = S.suspend(() =>
  S.Struct({
    ClientId: SensitiveString,
    SecretHash: S.optional(SensitiveString),
    UserContextData: S.optional(UserContextDataType),
    Username: SensitiveString,
    AnalyticsMetadata: S.optional(AnalyticsMetadataType),
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "ResendConfirmationCodeRequest",
}) as any as S.Schema<ResendConfirmationCodeRequest>;
export type ChallengeResponsesType = { [key: string]: string | undefined };
export const ChallengeResponsesType = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface RespondToAuthChallengeRequest {
  ClientId: string | redacted.Redacted<string>;
  ChallengeName: ChallengeNameType;
  Session?: string | redacted.Redacted<string>;
  ChallengeResponses?: { [key: string]: string | undefined };
  AnalyticsMetadata?: AnalyticsMetadataType;
  UserContextData?: UserContextDataType;
  ClientMetadata?: { [key: string]: string | undefined };
}
export const RespondToAuthChallengeRequest = S.suspend(() =>
  S.Struct({
    ClientId: SensitiveString,
    ChallengeName: ChallengeNameType,
    Session: S.optional(SensitiveString),
    ChallengeResponses: S.optional(ChallengeResponsesType),
    AnalyticsMetadata: S.optional(AnalyticsMetadataType),
    UserContextData: S.optional(UserContextDataType),
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "RespondToAuthChallengeRequest",
}) as any as S.Schema<RespondToAuthChallengeRequest>;
export interface RevokeTokenRequest {
  Token: string | redacted.Redacted<string>;
  ClientId: string | redacted.Redacted<string>;
  ClientSecret?: string | redacted.Redacted<string>;
}
export const RevokeTokenRequest = S.suspend(() =>
  S.Struct({
    Token: SensitiveString,
    ClientId: SensitiveString,
    ClientSecret: S.optional(SensitiveString),
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
  identifier: "RevokeTokenRequest",
}) as any as S.Schema<RevokeTokenRequest>;
export interface RevokeTokenResponse {}
export const RevokeTokenResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RevokeTokenResponse",
}) as any as S.Schema<RevokeTokenResponse>;
export interface SetUICustomizationRequest {
  UserPoolId: string;
  ClientId?: string | redacted.Redacted<string>;
  CSS?: string;
  ImageFile?: Uint8Array;
}
export const SetUICustomizationRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ClientId: S.optional(SensitiveString),
    CSS: S.optional(S.String),
    ImageFile: S.optional(T.Blob),
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
  identifier: "SetUICustomizationRequest",
}) as any as S.Schema<SetUICustomizationRequest>;
export interface SMSMfaSettingsType {
  Enabled?: boolean;
  PreferredMfa?: boolean;
}
export const SMSMfaSettingsType = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    PreferredMfa: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SMSMfaSettingsType",
}) as any as S.Schema<SMSMfaSettingsType>;
export interface SoftwareTokenMfaSettingsType {
  Enabled?: boolean;
  PreferredMfa?: boolean;
}
export const SoftwareTokenMfaSettingsType = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    PreferredMfa: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SoftwareTokenMfaSettingsType",
}) as any as S.Schema<SoftwareTokenMfaSettingsType>;
export interface EmailMfaSettingsType {
  Enabled?: boolean;
  PreferredMfa?: boolean;
}
export const EmailMfaSettingsType = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    PreferredMfa: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EmailMfaSettingsType",
}) as any as S.Schema<EmailMfaSettingsType>;
export interface SetUserMFAPreferenceRequest {
  SMSMfaSettings?: SMSMfaSettingsType;
  SoftwareTokenMfaSettings?: SoftwareTokenMfaSettingsType;
  EmailMfaSettings?: EmailMfaSettingsType;
  AccessToken: string | redacted.Redacted<string>;
}
export const SetUserMFAPreferenceRequest = S.suspend(() =>
  S.Struct({
    SMSMfaSettings: S.optional(SMSMfaSettingsType),
    SoftwareTokenMfaSettings: S.optional(SoftwareTokenMfaSettingsType),
    EmailMfaSettings: S.optional(EmailMfaSettingsType),
    AccessToken: SensitiveString,
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
  identifier: "SetUserMFAPreferenceRequest",
}) as any as S.Schema<SetUserMFAPreferenceRequest>;
export interface SetUserMFAPreferenceResponse {}
export const SetUserMFAPreferenceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetUserMFAPreferenceResponse",
}) as any as S.Schema<SetUserMFAPreferenceResponse>;
export interface MFAOptionType {
  DeliveryMedium?: DeliveryMediumType;
  AttributeName?: string;
}
export const MFAOptionType = S.suspend(() =>
  S.Struct({
    DeliveryMedium: S.optional(DeliveryMediumType),
    AttributeName: S.optional(S.String),
  }),
).annotations({
  identifier: "MFAOptionType",
}) as any as S.Schema<MFAOptionType>;
export type MFAOptionListType = MFAOptionType[];
export const MFAOptionListType = S.Array(MFAOptionType);
export interface SetUserSettingsRequest {
  AccessToken: string | redacted.Redacted<string>;
  MFAOptions: MFAOptionType[];
}
export const SetUserSettingsRequest = S.suspend(() =>
  S.Struct({
    AccessToken: SensitiveString,
    MFAOptions: MFAOptionListType,
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
  identifier: "SetUserSettingsRequest",
}) as any as S.Schema<SetUserSettingsRequest>;
export interface SetUserSettingsResponse {}
export const SetUserSettingsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetUserSettingsResponse",
}) as any as S.Schema<SetUserSettingsResponse>;
export interface SignUpRequest {
  ClientId: string | redacted.Redacted<string>;
  SecretHash?: string | redacted.Redacted<string>;
  Username: string | redacted.Redacted<string>;
  Password?: string | redacted.Redacted<string>;
  UserAttributes?: AttributeType[];
  ValidationData?: AttributeType[];
  AnalyticsMetadata?: AnalyticsMetadataType;
  UserContextData?: UserContextDataType;
  ClientMetadata?: { [key: string]: string | undefined };
}
export const SignUpRequest = S.suspend(() =>
  S.Struct({
    ClientId: SensitiveString,
    SecretHash: S.optional(SensitiveString),
    Username: SensitiveString,
    Password: S.optional(SensitiveString),
    UserAttributes: S.optional(AttributeListType),
    ValidationData: S.optional(AttributeListType),
    AnalyticsMetadata: S.optional(AnalyticsMetadataType),
    UserContextData: S.optional(UserContextDataType),
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "SignUpRequest",
}) as any as S.Schema<SignUpRequest>;
export interface StartUserImportJobRequest {
  UserPoolId: string;
  JobId: string;
}
export const StartUserImportJobRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, JobId: S.String }).pipe(
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
  identifier: "StartUserImportJobRequest",
}) as any as S.Schema<StartUserImportJobRequest>;
export interface StartWebAuthnRegistrationRequest {
  AccessToken: string | redacted.Redacted<string>;
}
export const StartWebAuthnRegistrationRequest = S.suspend(() =>
  S.Struct({ AccessToken: SensitiveString }).pipe(
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
  identifier: "StartWebAuthnRegistrationRequest",
}) as any as S.Schema<StartWebAuthnRegistrationRequest>;
export interface StopUserImportJobRequest {
  UserPoolId: string;
  JobId: string;
}
export const StopUserImportJobRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, JobId: S.String }).pipe(
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
  identifier: "StopUserImportJobRequest",
}) as any as S.Schema<StopUserImportJobRequest>;
export type UserPoolTagsType = { [key: string]: string | undefined };
export const UserPoolTagsType = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: UserPoolTagsType }).pipe(
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: UserPoolTagsListType }).pipe(
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
export interface UpdateAuthEventFeedbackRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  EventId: string;
  FeedbackToken: string | redacted.Redacted<string>;
  FeedbackValue: FeedbackValueType;
}
export const UpdateAuthEventFeedbackRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    EventId: S.String,
    FeedbackToken: SensitiveString,
    FeedbackValue: FeedbackValueType,
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
  identifier: "UpdateAuthEventFeedbackRequest",
}) as any as S.Schema<UpdateAuthEventFeedbackRequest>;
export interface UpdateAuthEventFeedbackResponse {}
export const UpdateAuthEventFeedbackResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateAuthEventFeedbackResponse",
}) as any as S.Schema<UpdateAuthEventFeedbackResponse>;
export interface UpdateDeviceStatusRequest {
  AccessToken: string | redacted.Redacted<string>;
  DeviceKey: string;
  DeviceRememberedStatus?: DeviceRememberedStatusType;
}
export const UpdateDeviceStatusRequest = S.suspend(() =>
  S.Struct({
    AccessToken: SensitiveString,
    DeviceKey: S.String,
    DeviceRememberedStatus: S.optional(DeviceRememberedStatusType),
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
  identifier: "UpdateDeviceStatusRequest",
}) as any as S.Schema<UpdateDeviceStatusRequest>;
export interface UpdateDeviceStatusResponse {}
export const UpdateDeviceStatusResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDeviceStatusResponse",
}) as any as S.Schema<UpdateDeviceStatusResponse>;
export interface UpdateGroupRequest {
  GroupName: string;
  UserPoolId: string;
  Description?: string;
  RoleArn?: string;
  Precedence?: number;
}
export const UpdateGroupRequest = S.suspend(() =>
  S.Struct({
    GroupName: S.String,
    UserPoolId: S.String,
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Precedence: S.optional(S.Number),
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
  identifier: "UpdateGroupRequest",
}) as any as S.Schema<UpdateGroupRequest>;
export type ProviderDetailsType = { [key: string]: string | undefined };
export const ProviderDetailsType = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type AttributeMappingType = { [key: string]: string | undefined };
export const AttributeMappingType = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface UpdateIdentityProviderRequest {
  UserPoolId: string;
  ProviderName: string;
  ProviderDetails?: { [key: string]: string | undefined };
  AttributeMapping?: { [key: string]: string | undefined };
  IdpIdentifiers?: string[];
}
export const UpdateIdentityProviderRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ProviderName: S.String,
    ProviderDetails: S.optional(ProviderDetailsType),
    AttributeMapping: S.optional(AttributeMappingType),
    IdpIdentifiers: S.optional(IdpIdentifiersListType),
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
  identifier: "UpdateIdentityProviderRequest",
}) as any as S.Schema<UpdateIdentityProviderRequest>;
export type AssetCategoryType =
  | "FAVICON_ICO"
  | "FAVICON_SVG"
  | "EMAIL_GRAPHIC"
  | "SMS_GRAPHIC"
  | "AUTH_APP_GRAPHIC"
  | "PASSWORD_GRAPHIC"
  | "PASSKEY_GRAPHIC"
  | "PAGE_HEADER_LOGO"
  | "PAGE_HEADER_BACKGROUND"
  | "PAGE_FOOTER_LOGO"
  | "PAGE_FOOTER_BACKGROUND"
  | "PAGE_BACKGROUND"
  | "FORM_BACKGROUND"
  | "FORM_LOGO"
  | "IDP_BUTTON_ICON"
  | (string & {});
export const AssetCategoryType = S.String;
export type ColorSchemeModeType = "LIGHT" | "DARK" | "DYNAMIC" | (string & {});
export const ColorSchemeModeType = S.String;
export type AssetExtensionType =
  | "ICO"
  | "JPEG"
  | "PNG"
  | "SVG"
  | "WEBP"
  | (string & {});
export const AssetExtensionType = S.String;
export interface AssetType {
  Category: AssetCategoryType;
  ColorMode: ColorSchemeModeType;
  Extension: AssetExtensionType;
  Bytes?: Uint8Array;
  ResourceId?: string;
}
export const AssetType = S.suspend(() =>
  S.Struct({
    Category: AssetCategoryType,
    ColorMode: ColorSchemeModeType,
    Extension: AssetExtensionType,
    Bytes: S.optional(T.Blob),
    ResourceId: S.optional(S.String),
  }),
).annotations({ identifier: "AssetType" }) as any as S.Schema<AssetType>;
export type AssetListType = AssetType[];
export const AssetListType = S.Array(AssetType);
export interface UpdateManagedLoginBrandingRequest {
  UserPoolId?: string;
  ManagedLoginBrandingId?: string;
  UseCognitoProvidedValues?: boolean;
  Settings?: any;
  Assets?: AssetType[];
}
export const UpdateManagedLoginBrandingRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.optional(S.String),
    ManagedLoginBrandingId: S.optional(S.String),
    UseCognitoProvidedValues: S.optional(S.Boolean),
    Settings: S.optional(S.Any),
    Assets: S.optional(AssetListType),
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
  identifier: "UpdateManagedLoginBrandingRequest",
}) as any as S.Schema<UpdateManagedLoginBrandingRequest>;
export interface ResourceServerScopeType {
  ScopeName: string;
  ScopeDescription: string;
}
export const ResourceServerScopeType = S.suspend(() =>
  S.Struct({ ScopeName: S.String, ScopeDescription: S.String }),
).annotations({
  identifier: "ResourceServerScopeType",
}) as any as S.Schema<ResourceServerScopeType>;
export type ResourceServerScopeListType = ResourceServerScopeType[];
export const ResourceServerScopeListType = S.Array(ResourceServerScopeType);
export interface UpdateResourceServerRequest {
  UserPoolId: string;
  Identifier: string;
  Name: string;
  Scopes?: ResourceServerScopeType[];
}
export const UpdateResourceServerRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Identifier: S.String,
    Name: S.String,
    Scopes: S.optional(ResourceServerScopeListType),
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
  identifier: "UpdateResourceServerRequest",
}) as any as S.Schema<UpdateResourceServerRequest>;
export type LinksType = { [key: string]: string | undefined };
export const LinksType = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface UpdateTermsRequest {
  TermsId: string;
  UserPoolId: string;
  TermsName?: string;
  TermsSource?: TermsSourceType;
  Enforcement?: TermsEnforcementType;
  Links?: { [key: string]: string | undefined };
}
export const UpdateTermsRequest = S.suspend(() =>
  S.Struct({
    TermsId: S.String,
    UserPoolId: S.String,
    TermsName: S.optional(S.String),
    TermsSource: S.optional(TermsSourceType),
    Enforcement: S.optional(TermsEnforcementType),
    Links: S.optional(LinksType),
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
  identifier: "UpdateTermsRequest",
}) as any as S.Schema<UpdateTermsRequest>;
export interface UpdateUserAttributesRequest {
  UserAttributes: AttributeType[];
  AccessToken: string | redacted.Redacted<string>;
  ClientMetadata?: { [key: string]: string | undefined };
}
export const UpdateUserAttributesRequest = S.suspend(() =>
  S.Struct({
    UserAttributes: AttributeListType,
    AccessToken: SensitiveString,
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "UpdateUserAttributesRequest",
}) as any as S.Schema<UpdateUserAttributesRequest>;
export interface PasswordPolicyType {
  MinimumLength?: number;
  RequireUppercase?: boolean;
  RequireLowercase?: boolean;
  RequireNumbers?: boolean;
  RequireSymbols?: boolean;
  PasswordHistorySize?: number;
  TemporaryPasswordValidityDays?: number;
}
export const PasswordPolicyType = S.suspend(() =>
  S.Struct({
    MinimumLength: S.optional(S.Number),
    RequireUppercase: S.optional(S.Boolean),
    RequireLowercase: S.optional(S.Boolean),
    RequireNumbers: S.optional(S.Boolean),
    RequireSymbols: S.optional(S.Boolean),
    PasswordHistorySize: S.optional(S.Number),
    TemporaryPasswordValidityDays: S.optional(S.Number),
  }),
).annotations({
  identifier: "PasswordPolicyType",
}) as any as S.Schema<PasswordPolicyType>;
export type AuthFactorType =
  | "PASSWORD"
  | "EMAIL_OTP"
  | "SMS_OTP"
  | "WEB_AUTHN"
  | (string & {});
export const AuthFactorType = S.String;
export type AllowedFirstAuthFactorsListType = AuthFactorType[];
export const AllowedFirstAuthFactorsListType = S.Array(AuthFactorType);
export interface SignInPolicyType {
  AllowedFirstAuthFactors?: AuthFactorType[];
}
export const SignInPolicyType = S.suspend(() =>
  S.Struct({
    AllowedFirstAuthFactors: S.optional(AllowedFirstAuthFactorsListType),
  }),
).annotations({
  identifier: "SignInPolicyType",
}) as any as S.Schema<SignInPolicyType>;
export interface UserPoolPolicyType {
  PasswordPolicy?: PasswordPolicyType;
  SignInPolicy?: SignInPolicyType;
}
export const UserPoolPolicyType = S.suspend(() =>
  S.Struct({
    PasswordPolicy: S.optional(PasswordPolicyType),
    SignInPolicy: S.optional(SignInPolicyType),
  }),
).annotations({
  identifier: "UserPoolPolicyType",
}) as any as S.Schema<UserPoolPolicyType>;
export type PreTokenGenerationLambdaVersionType =
  | "V1_0"
  | "V2_0"
  | "V3_0"
  | (string & {});
export const PreTokenGenerationLambdaVersionType = S.String;
export interface PreTokenGenerationVersionConfigType {
  LambdaVersion: PreTokenGenerationLambdaVersionType;
  LambdaArn: string;
}
export const PreTokenGenerationVersionConfigType = S.suspend(() =>
  S.Struct({
    LambdaVersion: PreTokenGenerationLambdaVersionType,
    LambdaArn: S.String,
  }),
).annotations({
  identifier: "PreTokenGenerationVersionConfigType",
}) as any as S.Schema<PreTokenGenerationVersionConfigType>;
export type CustomSMSSenderLambdaVersionType = "V1_0" | (string & {});
export const CustomSMSSenderLambdaVersionType = S.String;
export interface CustomSMSLambdaVersionConfigType {
  LambdaVersion: CustomSMSSenderLambdaVersionType;
  LambdaArn: string;
}
export const CustomSMSLambdaVersionConfigType = S.suspend(() =>
  S.Struct({
    LambdaVersion: CustomSMSSenderLambdaVersionType,
    LambdaArn: S.String,
  }),
).annotations({
  identifier: "CustomSMSLambdaVersionConfigType",
}) as any as S.Schema<CustomSMSLambdaVersionConfigType>;
export type CustomEmailSenderLambdaVersionType = "V1_0" | (string & {});
export const CustomEmailSenderLambdaVersionType = S.String;
export interface CustomEmailLambdaVersionConfigType {
  LambdaVersion: CustomEmailSenderLambdaVersionType;
  LambdaArn: string;
}
export const CustomEmailLambdaVersionConfigType = S.suspend(() =>
  S.Struct({
    LambdaVersion: CustomEmailSenderLambdaVersionType,
    LambdaArn: S.String,
  }),
).annotations({
  identifier: "CustomEmailLambdaVersionConfigType",
}) as any as S.Schema<CustomEmailLambdaVersionConfigType>;
export interface LambdaConfigType {
  PreSignUp?: string;
  CustomMessage?: string;
  PostConfirmation?: string;
  PreAuthentication?: string;
  PostAuthentication?: string;
  DefineAuthChallenge?: string;
  CreateAuthChallenge?: string;
  VerifyAuthChallengeResponse?: string;
  PreTokenGeneration?: string;
  UserMigration?: string;
  PreTokenGenerationConfig?: PreTokenGenerationVersionConfigType;
  CustomSMSSender?: CustomSMSLambdaVersionConfigType;
  CustomEmailSender?: CustomEmailLambdaVersionConfigType;
  KMSKeyID?: string;
}
export const LambdaConfigType = S.suspend(() =>
  S.Struct({
    PreSignUp: S.optional(S.String),
    CustomMessage: S.optional(S.String),
    PostConfirmation: S.optional(S.String),
    PreAuthentication: S.optional(S.String),
    PostAuthentication: S.optional(S.String),
    DefineAuthChallenge: S.optional(S.String),
    CreateAuthChallenge: S.optional(S.String),
    VerifyAuthChallengeResponse: S.optional(S.String),
    PreTokenGeneration: S.optional(S.String),
    UserMigration: S.optional(S.String),
    PreTokenGenerationConfig: S.optional(PreTokenGenerationVersionConfigType),
    CustomSMSSender: S.optional(CustomSMSLambdaVersionConfigType),
    CustomEmailSender: S.optional(CustomEmailLambdaVersionConfigType),
    KMSKeyID: S.optional(S.String),
  }),
).annotations({
  identifier: "LambdaConfigType",
}) as any as S.Schema<LambdaConfigType>;
export type DefaultEmailOptionType =
  | "CONFIRM_WITH_LINK"
  | "CONFIRM_WITH_CODE"
  | (string & {});
export const DefaultEmailOptionType = S.String;
export interface VerificationMessageTemplateType {
  SmsMessage?: string;
  EmailMessage?: string;
  EmailSubject?: string;
  EmailMessageByLink?: string;
  EmailSubjectByLink?: string;
  DefaultEmailOption?: DefaultEmailOptionType;
}
export const VerificationMessageTemplateType = S.suspend(() =>
  S.Struct({
    SmsMessage: S.optional(S.String),
    EmailMessage: S.optional(S.String),
    EmailSubject: S.optional(S.String),
    EmailMessageByLink: S.optional(S.String),
    EmailSubjectByLink: S.optional(S.String),
    DefaultEmailOption: S.optional(DefaultEmailOptionType),
  }),
).annotations({
  identifier: "VerificationMessageTemplateType",
}) as any as S.Schema<VerificationMessageTemplateType>;
export type AttributesRequireVerificationBeforeUpdateType =
  VerifiedAttributeType[];
export const AttributesRequireVerificationBeforeUpdateType = S.Array(
  VerifiedAttributeType,
);
export interface UserAttributeUpdateSettingsType {
  AttributesRequireVerificationBeforeUpdate?: VerifiedAttributeType[];
}
export const UserAttributeUpdateSettingsType = S.suspend(() =>
  S.Struct({
    AttributesRequireVerificationBeforeUpdate: S.optional(
      AttributesRequireVerificationBeforeUpdateType,
    ),
  }),
).annotations({
  identifier: "UserAttributeUpdateSettingsType",
}) as any as S.Schema<UserAttributeUpdateSettingsType>;
export interface DeviceConfigurationType {
  ChallengeRequiredOnNewDevice?: boolean;
  DeviceOnlyRememberedOnUserPrompt?: boolean;
}
export const DeviceConfigurationType = S.suspend(() =>
  S.Struct({
    ChallengeRequiredOnNewDevice: S.optional(S.Boolean),
    DeviceOnlyRememberedOnUserPrompt: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DeviceConfigurationType",
}) as any as S.Schema<DeviceConfigurationType>;
export type EmailSendingAccountType =
  | "COGNITO_DEFAULT"
  | "DEVELOPER"
  | (string & {});
export const EmailSendingAccountType = S.String;
export interface EmailConfigurationType {
  SourceArn?: string;
  ReplyToEmailAddress?: string;
  EmailSendingAccount?: EmailSendingAccountType;
  From?: string;
  ConfigurationSet?: string;
}
export const EmailConfigurationType = S.suspend(() =>
  S.Struct({
    SourceArn: S.optional(S.String),
    ReplyToEmailAddress: S.optional(S.String),
    EmailSendingAccount: S.optional(EmailSendingAccountType),
    From: S.optional(S.String),
    ConfigurationSet: S.optional(S.String),
  }),
).annotations({
  identifier: "EmailConfigurationType",
}) as any as S.Schema<EmailConfigurationType>;
export interface SmsConfigurationType {
  SnsCallerArn: string;
  ExternalId?: string;
  SnsRegion?: string;
}
export const SmsConfigurationType = S.suspend(() =>
  S.Struct({
    SnsCallerArn: S.String,
    ExternalId: S.optional(S.String),
    SnsRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "SmsConfigurationType",
}) as any as S.Schema<SmsConfigurationType>;
export interface MessageTemplateType {
  SMSMessage?: string;
  EmailMessage?: string;
  EmailSubject?: string;
}
export const MessageTemplateType = S.suspend(() =>
  S.Struct({
    SMSMessage: S.optional(S.String),
    EmailMessage: S.optional(S.String),
    EmailSubject: S.optional(S.String),
  }),
).annotations({
  identifier: "MessageTemplateType",
}) as any as S.Schema<MessageTemplateType>;
export interface AdminCreateUserConfigType {
  AllowAdminCreateUserOnly?: boolean;
  UnusedAccountValidityDays?: number;
  InviteMessageTemplate?: MessageTemplateType;
}
export const AdminCreateUserConfigType = S.suspend(() =>
  S.Struct({
    AllowAdminCreateUserOnly: S.optional(S.Boolean),
    UnusedAccountValidityDays: S.optional(S.Number),
    InviteMessageTemplate: S.optional(MessageTemplateType),
  }),
).annotations({
  identifier: "AdminCreateUserConfigType",
}) as any as S.Schema<AdminCreateUserConfigType>;
export type AdvancedSecurityModeType =
  | "OFF"
  | "AUDIT"
  | "ENFORCED"
  | (string & {});
export const AdvancedSecurityModeType = S.String;
export type AdvancedSecurityEnabledModeType =
  | "AUDIT"
  | "ENFORCED"
  | (string & {});
export const AdvancedSecurityEnabledModeType = S.String;
export interface AdvancedSecurityAdditionalFlowsType {
  CustomAuthMode?: AdvancedSecurityEnabledModeType;
}
export const AdvancedSecurityAdditionalFlowsType = S.suspend(() =>
  S.Struct({ CustomAuthMode: S.optional(AdvancedSecurityEnabledModeType) }),
).annotations({
  identifier: "AdvancedSecurityAdditionalFlowsType",
}) as any as S.Schema<AdvancedSecurityAdditionalFlowsType>;
export interface UserPoolAddOnsType {
  AdvancedSecurityMode: AdvancedSecurityModeType;
  AdvancedSecurityAdditionalFlows?: AdvancedSecurityAdditionalFlowsType;
}
export const UserPoolAddOnsType = S.suspend(() =>
  S.Struct({
    AdvancedSecurityMode: AdvancedSecurityModeType,
    AdvancedSecurityAdditionalFlows: S.optional(
      AdvancedSecurityAdditionalFlowsType,
    ),
  }),
).annotations({
  identifier: "UserPoolAddOnsType",
}) as any as S.Schema<UserPoolAddOnsType>;
export type RecoveryOptionNameType =
  | "verified_email"
  | "verified_phone_number"
  | "admin_only"
  | (string & {});
export const RecoveryOptionNameType = S.String;
export interface RecoveryOptionType {
  Priority: number;
  Name: RecoveryOptionNameType;
}
export const RecoveryOptionType = S.suspend(() =>
  S.Struct({ Priority: S.Number, Name: RecoveryOptionNameType }),
).annotations({
  identifier: "RecoveryOptionType",
}) as any as S.Schema<RecoveryOptionType>;
export type RecoveryMechanismsType = RecoveryOptionType[];
export const RecoveryMechanismsType = S.Array(RecoveryOptionType);
export interface AccountRecoverySettingType {
  RecoveryMechanisms?: RecoveryOptionType[];
}
export const AccountRecoverySettingType = S.suspend(() =>
  S.Struct({ RecoveryMechanisms: S.optional(RecoveryMechanismsType) }),
).annotations({
  identifier: "AccountRecoverySettingType",
}) as any as S.Schema<AccountRecoverySettingType>;
export interface UpdateUserPoolRequest {
  UserPoolId: string;
  Policies?: UserPoolPolicyType;
  DeletionProtection?: DeletionProtectionType;
  LambdaConfig?: LambdaConfigType;
  AutoVerifiedAttributes?: VerifiedAttributeType[];
  SmsVerificationMessage?: string;
  EmailVerificationMessage?: string;
  EmailVerificationSubject?: string;
  VerificationMessageTemplate?: VerificationMessageTemplateType;
  SmsAuthenticationMessage?: string;
  UserAttributeUpdateSettings?: UserAttributeUpdateSettingsType;
  MfaConfiguration?: UserPoolMfaType;
  DeviceConfiguration?: DeviceConfigurationType;
  EmailConfiguration?: EmailConfigurationType;
  SmsConfiguration?: SmsConfigurationType;
  UserPoolTags?: { [key: string]: string | undefined };
  AdminCreateUserConfig?: AdminCreateUserConfigType;
  UserPoolAddOns?: UserPoolAddOnsType;
  AccountRecoverySetting?: AccountRecoverySettingType;
  PoolName?: string;
  UserPoolTier?: UserPoolTierType;
}
export const UpdateUserPoolRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Policies: S.optional(UserPoolPolicyType),
    DeletionProtection: S.optional(DeletionProtectionType),
    LambdaConfig: S.optional(LambdaConfigType),
    AutoVerifiedAttributes: S.optional(VerifiedAttributesListType),
    SmsVerificationMessage: S.optional(S.String),
    EmailVerificationMessage: S.optional(S.String),
    EmailVerificationSubject: S.optional(S.String),
    VerificationMessageTemplate: S.optional(VerificationMessageTemplateType),
    SmsAuthenticationMessage: S.optional(S.String),
    UserAttributeUpdateSettings: S.optional(UserAttributeUpdateSettingsType),
    MfaConfiguration: S.optional(UserPoolMfaType),
    DeviceConfiguration: S.optional(DeviceConfigurationType),
    EmailConfiguration: S.optional(EmailConfigurationType),
    SmsConfiguration: S.optional(SmsConfigurationType),
    UserPoolTags: S.optional(UserPoolTagsType),
    AdminCreateUserConfig: S.optional(AdminCreateUserConfigType),
    UserPoolAddOns: S.optional(UserPoolAddOnsType),
    AccountRecoverySetting: S.optional(AccountRecoverySettingType),
    PoolName: S.optional(S.String),
    UserPoolTier: S.optional(UserPoolTierType),
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
  identifier: "UpdateUserPoolRequest",
}) as any as S.Schema<UpdateUserPoolRequest>;
export interface UpdateUserPoolResponse {}
export const UpdateUserPoolResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateUserPoolResponse",
}) as any as S.Schema<UpdateUserPoolResponse>;
export type TimeUnitsType =
  | "seconds"
  | "minutes"
  | "hours"
  | "days"
  | (string & {});
export const TimeUnitsType = S.String;
export interface TokenValidityUnitsType {
  AccessToken?: TimeUnitsType;
  IdToken?: TimeUnitsType;
  RefreshToken?: TimeUnitsType;
}
export const TokenValidityUnitsType = S.suspend(() =>
  S.Struct({
    AccessToken: S.optional(TimeUnitsType),
    IdToken: S.optional(TimeUnitsType),
    RefreshToken: S.optional(TimeUnitsType),
  }),
).annotations({
  identifier: "TokenValidityUnitsType",
}) as any as S.Schema<TokenValidityUnitsType>;
export interface AnalyticsConfigurationType {
  ApplicationId?: string;
  ApplicationArn?: string;
  RoleArn?: string;
  ExternalId?: string;
  UserDataShared?: boolean;
}
export const AnalyticsConfigurationType = S.suspend(() =>
  S.Struct({
    ApplicationId: S.optional(S.String),
    ApplicationArn: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ExternalId: S.optional(S.String),
    UserDataShared: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AnalyticsConfigurationType",
}) as any as S.Schema<AnalyticsConfigurationType>;
export type FeatureType = "ENABLED" | "DISABLED" | (string & {});
export const FeatureType = S.String;
export interface RefreshTokenRotationType {
  Feature: FeatureType;
  RetryGracePeriodSeconds?: number;
}
export const RefreshTokenRotationType = S.suspend(() =>
  S.Struct({
    Feature: FeatureType,
    RetryGracePeriodSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "RefreshTokenRotationType",
}) as any as S.Schema<RefreshTokenRotationType>;
export interface UpdateUserPoolClientRequest {
  UserPoolId: string;
  ClientId: string | redacted.Redacted<string>;
  ClientName?: string;
  RefreshTokenValidity?: number;
  AccessTokenValidity?: number;
  IdTokenValidity?: number;
  TokenValidityUnits?: TokenValidityUnitsType;
  ReadAttributes?: string[];
  WriteAttributes?: string[];
  ExplicitAuthFlows?: ExplicitAuthFlowsType[];
  SupportedIdentityProviders?: string[];
  CallbackURLs?: string[];
  LogoutURLs?: string[];
  DefaultRedirectURI?: string;
  AllowedOAuthFlows?: OAuthFlowType[];
  AllowedOAuthScopes?: string[];
  AllowedOAuthFlowsUserPoolClient?: boolean;
  AnalyticsConfiguration?: AnalyticsConfigurationType;
  PreventUserExistenceErrors?: PreventUserExistenceErrorTypes;
  EnableTokenRevocation?: boolean;
  EnablePropagateAdditionalUserContextData?: boolean;
  AuthSessionValidity?: number;
  RefreshTokenRotation?: RefreshTokenRotationType;
}
export const UpdateUserPoolClientRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ClientId: SensitiveString,
    ClientName: S.optional(S.String),
    RefreshTokenValidity: S.optional(S.Number),
    AccessTokenValidity: S.optional(S.Number),
    IdTokenValidity: S.optional(S.Number),
    TokenValidityUnits: S.optional(TokenValidityUnitsType),
    ReadAttributes: S.optional(ClientPermissionListType),
    WriteAttributes: S.optional(ClientPermissionListType),
    ExplicitAuthFlows: S.optional(ExplicitAuthFlowsListType),
    SupportedIdentityProviders: S.optional(SupportedIdentityProvidersListType),
    CallbackURLs: S.optional(CallbackURLsListType),
    LogoutURLs: S.optional(LogoutURLsListType),
    DefaultRedirectURI: S.optional(S.String),
    AllowedOAuthFlows: S.optional(OAuthFlowsType),
    AllowedOAuthScopes: S.optional(ScopeListType),
    AllowedOAuthFlowsUserPoolClient: S.optional(S.Boolean),
    AnalyticsConfiguration: S.optional(AnalyticsConfigurationType),
    PreventUserExistenceErrors: S.optional(PreventUserExistenceErrorTypes),
    EnableTokenRevocation: S.optional(S.Boolean),
    EnablePropagateAdditionalUserContextData: S.optional(S.Boolean),
    AuthSessionValidity: S.optional(S.Number),
    RefreshTokenRotation: S.optional(RefreshTokenRotationType),
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
  identifier: "UpdateUserPoolClientRequest",
}) as any as S.Schema<UpdateUserPoolClientRequest>;
export interface CustomDomainConfigType {
  CertificateArn: string;
}
export const CustomDomainConfigType = S.suspend(() =>
  S.Struct({ CertificateArn: S.String }),
).annotations({
  identifier: "CustomDomainConfigType",
}) as any as S.Schema<CustomDomainConfigType>;
export interface UpdateUserPoolDomainRequest {
  Domain: string;
  UserPoolId: string;
  ManagedLoginVersion?: number;
  CustomDomainConfig?: CustomDomainConfigType;
}
export const UpdateUserPoolDomainRequest = S.suspend(() =>
  S.Struct({
    Domain: S.String,
    UserPoolId: S.String,
    ManagedLoginVersion: S.optional(S.Number),
    CustomDomainConfig: S.optional(CustomDomainConfigType),
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
  identifier: "UpdateUserPoolDomainRequest",
}) as any as S.Schema<UpdateUserPoolDomainRequest>;
export interface VerifySoftwareTokenRequest {
  AccessToken?: string | redacted.Redacted<string>;
  Session?: string | redacted.Redacted<string>;
  UserCode: string | redacted.Redacted<string>;
  FriendlyDeviceName?: string;
}
export const VerifySoftwareTokenRequest = S.suspend(() =>
  S.Struct({
    AccessToken: S.optional(SensitiveString),
    Session: S.optional(SensitiveString),
    UserCode: SensitiveString,
    FriendlyDeviceName: S.optional(S.String),
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
  identifier: "VerifySoftwareTokenRequest",
}) as any as S.Schema<VerifySoftwareTokenRequest>;
export interface VerifyUserAttributeRequest {
  AccessToken: string | redacted.Redacted<string>;
  AttributeName: string;
  Code: string;
}
export const VerifyUserAttributeRequest = S.suspend(() =>
  S.Struct({
    AccessToken: SensitiveString,
    AttributeName: S.String,
    Code: S.String,
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
  identifier: "VerifyUserAttributeRequest",
}) as any as S.Schema<VerifyUserAttributeRequest>;
export interface VerifyUserAttributeResponse {}
export const VerifyUserAttributeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "VerifyUserAttributeResponse",
}) as any as S.Schema<VerifyUserAttributeResponse>;
export type LogLevel = "ERROR" | "INFO" | (string & {});
export const LogLevel = S.String;
export type EventSourceName =
  | "userNotification"
  | "userAuthEvents"
  | (string & {});
export const EventSourceName = S.String;
export type EventFilterType =
  | "SIGN_IN"
  | "PASSWORD_CHANGE"
  | "SIGN_UP"
  | (string & {});
export const EventFilterType = S.String;
export type EventFiltersType = EventFilterType[];
export const EventFiltersType = S.Array(EventFilterType);
export type BlockedIPRangeListType = string[];
export const BlockedIPRangeListType = S.Array(S.String);
export type SkippedIPRangeListType = string[];
export const SkippedIPRangeListType = S.Array(S.String);
export type UserVerificationType = "required" | "preferred" | (string & {});
export const UserVerificationType = S.String;
export type UserStatusType =
  | "UNCONFIRMED"
  | "CONFIRMED"
  | "ARCHIVED"
  | "COMPROMISED"
  | "UNKNOWN"
  | "RESET_REQUIRED"
  | "FORCE_CHANGE_PASSWORD"
  | "EXTERNAL_PROVIDER"
  | (string & {});
export const UserStatusType = S.String;
export type UserMFASettingListType = string[];
export const UserMFASettingListType = S.Array(S.String);
export interface DeviceType {
  DeviceKey?: string;
  DeviceAttributes?: AttributeType[];
  DeviceCreateDate?: Date;
  DeviceLastModifiedDate?: Date;
  DeviceLastAuthenticatedDate?: Date;
}
export const DeviceType = S.suspend(() =>
  S.Struct({
    DeviceKey: S.optional(S.String),
    DeviceAttributes: S.optional(AttributeListType),
    DeviceCreateDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DeviceLastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DeviceLastAuthenticatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "DeviceType" }) as any as S.Schema<DeviceType>;
export type DeviceListType = DeviceType[];
export const DeviceListType = S.Array(DeviceType);
export interface DeviceSecretVerifierConfigType {
  PasswordVerifier?: string;
  Salt?: string;
}
export const DeviceSecretVerifierConfigType = S.suspend(() =>
  S.Struct({
    PasswordVerifier: S.optional(S.String),
    Salt: S.optional(S.String),
  }),
).annotations({
  identifier: "DeviceSecretVerifierConfigType",
}) as any as S.Schema<DeviceSecretVerifierConfigType>;
export interface UsernameConfigurationType {
  CaseSensitive: boolean;
}
export const UsernameConfigurationType = S.suspend(() =>
  S.Struct({ CaseSensitive: S.Boolean }),
).annotations({
  identifier: "UsernameConfigurationType",
}) as any as S.Schema<UsernameConfigurationType>;
export type ListOfStringTypes = string[];
export const ListOfStringTypes = S.Array(S.String);
export type ConfiguredUserAuthFactorsListType = AuthFactorType[];
export const ConfiguredUserAuthFactorsListType = S.Array(AuthFactorType);
export type AvailableChallengeListType = ChallengeNameType[];
export const AvailableChallengeListType = S.Array(ChallengeNameType);
export interface ResourceServerType {
  UserPoolId?: string;
  Identifier?: string;
  Name?: string;
  Scopes?: ResourceServerScopeType[];
}
export const ResourceServerType = S.suspend(() =>
  S.Struct({
    UserPoolId: S.optional(S.String),
    Identifier: S.optional(S.String),
    Name: S.optional(S.String),
    Scopes: S.optional(ResourceServerScopeListType),
  }),
).annotations({
  identifier: "ResourceServerType",
}) as any as S.Schema<ResourceServerType>;
export type ResourceServersListType = ResourceServerType[];
export const ResourceServersListType = S.Array(ResourceServerType);
export type UserImportJobStatusType =
  | "Created"
  | "Pending"
  | "InProgress"
  | "Stopping"
  | "Expired"
  | "Stopped"
  | "Failed"
  | "Succeeded"
  | (string & {});
export const UserImportJobStatusType = S.String;
export interface UserImportJobType {
  JobName?: string;
  JobId?: string;
  UserPoolId?: string;
  PreSignedUrl?: string;
  CreationDate?: Date;
  StartDate?: Date;
  CompletionDate?: Date;
  Status?: UserImportJobStatusType;
  CloudWatchLogsRoleArn?: string;
  ImportedUsers?: number;
  SkippedUsers?: number;
  FailedUsers?: number;
  CompletionMessage?: string;
}
export const UserImportJobType = S.suspend(() =>
  S.Struct({
    JobName: S.optional(S.String),
    JobId: S.optional(S.String),
    UserPoolId: S.optional(S.String),
    PreSignedUrl: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletionDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(UserImportJobStatusType),
    CloudWatchLogsRoleArn: S.optional(S.String),
    ImportedUsers: S.optional(S.Number),
    SkippedUsers: S.optional(S.Number),
    FailedUsers: S.optional(S.Number),
    CompletionMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "UserImportJobType",
}) as any as S.Schema<UserImportJobType>;
export type UserImportJobsListType = UserImportJobType[];
export const UserImportJobsListType = S.Array(UserImportJobType);
export interface RiskExceptionConfigurationType {
  BlockedIPRangeList?: string[];
  SkippedIPRangeList?: string[];
}
export const RiskExceptionConfigurationType = S.suspend(() =>
  S.Struct({
    BlockedIPRangeList: S.optional(BlockedIPRangeListType),
    SkippedIPRangeList: S.optional(SkippedIPRangeListType),
  }),
).annotations({
  identifier: "RiskExceptionConfigurationType",
}) as any as S.Schema<RiskExceptionConfigurationType>;
export interface SmsMfaConfigType {
  SmsAuthenticationMessage?: string;
  SmsConfiguration?: SmsConfigurationType;
}
export const SmsMfaConfigType = S.suspend(() =>
  S.Struct({
    SmsAuthenticationMessage: S.optional(S.String),
    SmsConfiguration: S.optional(SmsConfigurationType),
  }),
).annotations({
  identifier: "SmsMfaConfigType",
}) as any as S.Schema<SmsMfaConfigType>;
export interface SoftwareTokenMfaConfigType {
  Enabled?: boolean;
}
export const SoftwareTokenMfaConfigType = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "SoftwareTokenMfaConfigType",
}) as any as S.Schema<SoftwareTokenMfaConfigType>;
export interface EmailMfaConfigType {
  Message?: string;
  Subject?: string;
}
export const EmailMfaConfigType = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String), Subject: S.optional(S.String) }),
).annotations({
  identifier: "EmailMfaConfigType",
}) as any as S.Schema<EmailMfaConfigType>;
export interface WebAuthnConfigurationType {
  RelyingPartyId?: string;
  UserVerification?: UserVerificationType;
}
export const WebAuthnConfigurationType = S.suspend(() =>
  S.Struct({
    RelyingPartyId: S.optional(S.String),
    UserVerification: S.optional(UserVerificationType),
  }),
).annotations({
  identifier: "WebAuthnConfigurationType",
}) as any as S.Schema<WebAuthnConfigurationType>;
export interface CodeDeliveryDetailsType {
  Destination?: string;
  DeliveryMedium?: DeliveryMediumType;
  AttributeName?: string;
}
export const CodeDeliveryDetailsType = S.suspend(() =>
  S.Struct({
    Destination: S.optional(S.String),
    DeliveryMedium: S.optional(DeliveryMediumType),
    AttributeName: S.optional(S.String),
  }),
).annotations({
  identifier: "CodeDeliveryDetailsType",
}) as any as S.Schema<CodeDeliveryDetailsType>;
export type CodeDeliveryDetailsListType = CodeDeliveryDetailsType[];
export const CodeDeliveryDetailsListType = S.Array(CodeDeliveryDetailsType);
export type VerifySoftwareTokenResponseType =
  | "SUCCESS"
  | "ERROR"
  | (string & {});
export const VerifySoftwareTokenResponseType = S.String;
export type CompromisedCredentialsEventActionType =
  | "BLOCK"
  | "NO_ACTION"
  | (string & {});
export const CompromisedCredentialsEventActionType = S.String;
export interface AdminConfirmSignUpRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  ClientMetadata?: { [key: string]: string | undefined };
}
export const AdminConfirmSignUpRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "AdminConfirmSignUpRequest",
}) as any as S.Schema<AdminConfirmSignUpRequest>;
export interface AdminConfirmSignUpResponse {}
export const AdminConfirmSignUpResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminConfirmSignUpResponse",
}) as any as S.Schema<AdminConfirmSignUpResponse>;
export interface AdminCreateUserRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  UserAttributes?: AttributeType[];
  ValidationData?: AttributeType[];
  TemporaryPassword?: string | redacted.Redacted<string>;
  ForceAliasCreation?: boolean;
  MessageAction?: MessageActionType;
  DesiredDeliveryMediums?: DeliveryMediumType[];
  ClientMetadata?: { [key: string]: string | undefined };
}
export const AdminCreateUserRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    UserAttributes: S.optional(AttributeListType),
    ValidationData: S.optional(AttributeListType),
    TemporaryPassword: S.optional(SensitiveString),
    ForceAliasCreation: S.optional(S.Boolean),
    MessageAction: S.optional(MessageActionType),
    DesiredDeliveryMediums: S.optional(DeliveryMediumListType),
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "AdminCreateUserRequest",
}) as any as S.Schema<AdminCreateUserRequest>;
export interface AdminDisableProviderForUserRequest {
  UserPoolId: string;
  User: ProviderUserIdentifierType;
}
export const AdminDisableProviderForUserRequest = S.suspend(() =>
  S.Struct({ UserPoolId: S.String, User: ProviderUserIdentifierType }).pipe(
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
  identifier: "AdminDisableProviderForUserRequest",
}) as any as S.Schema<AdminDisableProviderForUserRequest>;
export interface AdminDisableProviderForUserResponse {}
export const AdminDisableProviderForUserResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminDisableProviderForUserResponse",
}) as any as S.Schema<AdminDisableProviderForUserResponse>;
export interface AdminGetUserResponse {
  Username: string | redacted.Redacted<string>;
  UserAttributes?: AttributeType[];
  UserCreateDate?: Date;
  UserLastModifiedDate?: Date;
  Enabled?: boolean;
  UserStatus?: UserStatusType;
  MFAOptions?: MFAOptionType[];
  PreferredMfaSetting?: string;
  UserMFASettingList?: string[];
}
export const AdminGetUserResponse = S.suspend(() =>
  S.Struct({
    Username: SensitiveString,
    UserAttributes: S.optional(AttributeListType),
    UserCreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UserLastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Enabled: S.optional(S.Boolean),
    UserStatus: S.optional(UserStatusType),
    MFAOptions: S.optional(MFAOptionListType),
    PreferredMfaSetting: S.optional(S.String),
    UserMFASettingList: S.optional(UserMFASettingListType),
  }).pipe(ns),
).annotations({
  identifier: "AdminGetUserResponse",
}) as any as S.Schema<AdminGetUserResponse>;
export interface AdminListDevicesResponse {
  Devices?: DeviceType[];
  PaginationToken?: string;
}
export const AdminListDevicesResponse = S.suspend(() =>
  S.Struct({
    Devices: S.optional(DeviceListType),
    PaginationToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "AdminListDevicesResponse",
}) as any as S.Schema<AdminListDevicesResponse>;
export interface HttpHeader {
  headerName?: string;
  headerValue?: string;
}
export const HttpHeader = S.suspend(() =>
  S.Struct({
    headerName: S.optional(S.String),
    headerValue: S.optional(S.String),
  }),
).annotations({ identifier: "HttpHeader" }) as any as S.Schema<HttpHeader>;
export type HttpHeaderList = HttpHeader[];
export const HttpHeaderList = S.Array(HttpHeader);
export interface ContextDataType {
  IpAddress: string;
  ServerName: string;
  ServerPath: string;
  HttpHeaders: HttpHeader[];
  EncodedData?: string;
}
export const ContextDataType = S.suspend(() =>
  S.Struct({
    IpAddress: S.String,
    ServerName: S.String,
    ServerPath: S.String,
    HttpHeaders: HttpHeaderList,
    EncodedData: S.optional(S.String),
  }),
).annotations({
  identifier: "ContextDataType",
}) as any as S.Schema<ContextDataType>;
export interface AdminRespondToAuthChallengeRequest {
  UserPoolId: string;
  ClientId: string | redacted.Redacted<string>;
  ChallengeName: ChallengeNameType;
  ChallengeResponses?: { [key: string]: string | undefined };
  Session?: string | redacted.Redacted<string>;
  AnalyticsMetadata?: AnalyticsMetadataType;
  ContextData?: ContextDataType;
  ClientMetadata?: { [key: string]: string | undefined };
}
export const AdminRespondToAuthChallengeRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ClientId: SensitiveString,
    ChallengeName: ChallengeNameType,
    ChallengeResponses: S.optional(ChallengeResponsesType),
    Session: S.optional(SensitiveString),
    AnalyticsMetadata: S.optional(AnalyticsMetadataType),
    ContextData: S.optional(ContextDataType),
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "AdminRespondToAuthChallengeRequest",
}) as any as S.Schema<AdminRespondToAuthChallengeRequest>;
export interface AdminSetUserMFAPreferenceRequest {
  SMSMfaSettings?: SMSMfaSettingsType;
  SoftwareTokenMfaSettings?: SoftwareTokenMfaSettingsType;
  EmailMfaSettings?: EmailMfaSettingsType;
  Username: string | redacted.Redacted<string>;
  UserPoolId: string;
}
export const AdminSetUserMFAPreferenceRequest = S.suspend(() =>
  S.Struct({
    SMSMfaSettings: S.optional(SMSMfaSettingsType),
    SoftwareTokenMfaSettings: S.optional(SoftwareTokenMfaSettingsType),
    EmailMfaSettings: S.optional(EmailMfaSettingsType),
    Username: SensitiveString,
    UserPoolId: S.String,
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
  identifier: "AdminSetUserMFAPreferenceRequest",
}) as any as S.Schema<AdminSetUserMFAPreferenceRequest>;
export interface AdminSetUserMFAPreferenceResponse {}
export const AdminSetUserMFAPreferenceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminSetUserMFAPreferenceResponse",
}) as any as S.Schema<AdminSetUserMFAPreferenceResponse>;
export interface AdminSetUserSettingsRequest {
  UserPoolId: string;
  Username: string | redacted.Redacted<string>;
  MFAOptions: MFAOptionType[];
}
export const AdminSetUserSettingsRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Username: SensitiveString,
    MFAOptions: MFAOptionListType,
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
  identifier: "AdminSetUserSettingsRequest",
}) as any as S.Schema<AdminSetUserSettingsRequest>;
export interface AdminSetUserSettingsResponse {}
export const AdminSetUserSettingsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AdminSetUserSettingsResponse",
}) as any as S.Schema<AdminSetUserSettingsResponse>;
export interface AssociateSoftwareTokenResponse {
  SecretCode?: string | redacted.Redacted<string>;
  Session?: string | redacted.Redacted<string>;
}
export const AssociateSoftwareTokenResponse = S.suspend(() =>
  S.Struct({
    SecretCode: S.optional(SensitiveString),
    Session: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "AssociateSoftwareTokenResponse",
}) as any as S.Schema<AssociateSoftwareTokenResponse>;
export interface ConfirmDeviceRequest {
  AccessToken: string | redacted.Redacted<string>;
  DeviceKey: string;
  DeviceSecretVerifierConfig?: DeviceSecretVerifierConfigType;
  DeviceName?: string;
}
export const ConfirmDeviceRequest = S.suspend(() =>
  S.Struct({
    AccessToken: SensitiveString,
    DeviceKey: S.String,
    DeviceSecretVerifierConfig: S.optional(DeviceSecretVerifierConfigType),
    DeviceName: S.optional(S.String),
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
  identifier: "ConfirmDeviceRequest",
}) as any as S.Schema<ConfirmDeviceRequest>;
export interface ConfirmForgotPasswordRequest {
  ClientId: string | redacted.Redacted<string>;
  SecretHash?: string | redacted.Redacted<string>;
  Username: string | redacted.Redacted<string>;
  ConfirmationCode: string;
  Password: string | redacted.Redacted<string>;
  AnalyticsMetadata?: AnalyticsMetadataType;
  UserContextData?: UserContextDataType;
  ClientMetadata?: { [key: string]: string | undefined };
}
export const ConfirmForgotPasswordRequest = S.suspend(() =>
  S.Struct({
    ClientId: SensitiveString,
    SecretHash: S.optional(SensitiveString),
    Username: SensitiveString,
    ConfirmationCode: S.String,
    Password: SensitiveString,
    AnalyticsMetadata: S.optional(AnalyticsMetadataType),
    UserContextData: S.optional(UserContextDataType),
    ClientMetadata: S.optional(ClientMetadataType),
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
  identifier: "ConfirmForgotPasswordRequest",
}) as any as S.Schema<ConfirmForgotPasswordRequest>;
export interface ConfirmForgotPasswordResponse {}
export const ConfirmForgotPasswordResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ConfirmForgotPasswordResponse",
}) as any as S.Schema<ConfirmForgotPasswordResponse>;
export interface ConfirmSignUpResponse {
  Session?: string | redacted.Redacted<string>;
}
export const ConfirmSignUpResponse = S.suspend(() =>
  S.Struct({ Session: S.optional(SensitiveString) }).pipe(ns),
).annotations({
  identifier: "ConfirmSignUpResponse",
}) as any as S.Schema<ConfirmSignUpResponse>;
export interface GroupType {
  GroupName?: string;
  UserPoolId?: string;
  Description?: string;
  RoleArn?: string;
  Precedence?: number;
  LastModifiedDate?: Date;
  CreationDate?: Date;
}
export const GroupType = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String),
    UserPoolId: S.optional(S.String),
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Precedence: S.optional(S.Number),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "GroupType" }) as any as S.Schema<GroupType>;
export interface CreateGroupResponse {
  Group?: GroupType;
}
export const CreateGroupResponse = S.suspend(() =>
  S.Struct({ Group: S.optional(GroupType) }).pipe(ns),
).annotations({
  identifier: "CreateGroupResponse",
}) as any as S.Schema<CreateGroupResponse>;
export interface CreateIdentityProviderRequest {
  UserPoolId: string;
  ProviderName: string;
  ProviderType: IdentityProviderTypeType;
  ProviderDetails: { [key: string]: string | undefined };
  AttributeMapping?: { [key: string]: string | undefined };
  IdpIdentifiers?: string[];
}
export const CreateIdentityProviderRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ProviderName: S.String,
    ProviderType: IdentityProviderTypeType,
    ProviderDetails: ProviderDetailsType,
    AttributeMapping: S.optional(AttributeMappingType),
    IdpIdentifiers: S.optional(IdpIdentifiersListType),
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
  identifier: "CreateIdentityProviderRequest",
}) as any as S.Schema<CreateIdentityProviderRequest>;
export interface CreateManagedLoginBrandingRequest {
  UserPoolId: string;
  ClientId: string | redacted.Redacted<string>;
  UseCognitoProvidedValues?: boolean;
  Settings?: any;
  Assets?: AssetType[];
}
export const CreateManagedLoginBrandingRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ClientId: SensitiveString,
    UseCognitoProvidedValues: S.optional(S.Boolean),
    Settings: S.optional(S.Any),
    Assets: S.optional(AssetListType),
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
  identifier: "CreateManagedLoginBrandingRequest",
}) as any as S.Schema<CreateManagedLoginBrandingRequest>;
export interface CreateResourceServerRequest {
  UserPoolId: string;
  Identifier: string;
  Name: string;
  Scopes?: ResourceServerScopeType[];
}
export const CreateResourceServerRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    Identifier: S.String,
    Name: S.String,
    Scopes: S.optional(ResourceServerScopeListType),
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
  identifier: "CreateResourceServerRequest",
}) as any as S.Schema<CreateResourceServerRequest>;
export interface CreateTermsRequest {
  UserPoolId: string;
  ClientId: string | redacted.Redacted<string>;
  TermsName: string;
  TermsSource: TermsSourceType;
  Enforcement: TermsEnforcementType;
  Links?: { [key: string]: string | undefined };
}
export const CreateTermsRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ClientId: SensitiveString,
    TermsName: S.String,
    TermsSource: TermsSourceType,
    Enforcement: TermsEnforcementType,
    Links: S.optional(LinksType),
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
  identifier: "CreateTermsRequest",
}) as any as S.Schema<CreateTermsRequest>;
export interface CreateUserPoolClientRequest {
  UserPoolId: string;
  ClientName: string;
  GenerateSecret?: boolean;
  RefreshTokenValidity?: number;
  AccessTokenValidity?: number;
  IdTokenValidity?: number;
  TokenValidityUnits?: TokenValidityUnitsType;
  ReadAttributes?: string[];
  WriteAttributes?: string[];
  ExplicitAuthFlows?: ExplicitAuthFlowsType[];
  SupportedIdentityProviders?: string[];
  CallbackURLs?: string[];
  LogoutURLs?: string[];
  DefaultRedirectURI?: string;
  AllowedOAuthFlows?: OAuthFlowType[];
  AllowedOAuthScopes?: string[];
  AllowedOAuthFlowsUserPoolClient?: boolean;
  AnalyticsConfiguration?: AnalyticsConfigurationType;
  PreventUserExistenceErrors?: PreventUserExistenceErrorTypes;
  EnableTokenRevocation?: boolean;
  EnablePropagateAdditionalUserContextData?: boolean;
  AuthSessionValidity?: number;
  RefreshTokenRotation?: RefreshTokenRotationType;
}
export const CreateUserPoolClientRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ClientName: S.String,
    GenerateSecret: S.optional(S.Boolean),
    RefreshTokenValidity: S.optional(S.Number),
    AccessTokenValidity: S.optional(S.Number),
    IdTokenValidity: S.optional(S.Number),
    TokenValidityUnits: S.optional(TokenValidityUnitsType),
    ReadAttributes: S.optional(ClientPermissionListType),
    WriteAttributes: S.optional(ClientPermissionListType),
    ExplicitAuthFlows: S.optional(ExplicitAuthFlowsListType),
    SupportedIdentityProviders: S.optional(SupportedIdentityProvidersListType),
    CallbackURLs: S.optional(CallbackURLsListType),
    LogoutURLs: S.optional(LogoutURLsListType),
    DefaultRedirectURI: S.optional(S.String),
    AllowedOAuthFlows: S.optional(OAuthFlowsType),
    AllowedOAuthScopes: S.optional(ScopeListType),
    AllowedOAuthFlowsUserPoolClient: S.optional(S.Boolean),
    AnalyticsConfiguration: S.optional(AnalyticsConfigurationType),
    PreventUserExistenceErrors: S.optional(PreventUserExistenceErrorTypes),
    EnableTokenRevocation: S.optional(S.Boolean),
    EnablePropagateAdditionalUserContextData: S.optional(S.Boolean),
    AuthSessionValidity: S.optional(S.Number),
    RefreshTokenRotation: S.optional(RefreshTokenRotationType),
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
  identifier: "CreateUserPoolClientRequest",
}) as any as S.Schema<CreateUserPoolClientRequest>;
export interface CreateUserPoolDomainRequest {
  Domain: string;
  UserPoolId: string;
  ManagedLoginVersion?: number;
  CustomDomainConfig?: CustomDomainConfigType;
}
export const CreateUserPoolDomainRequest = S.suspend(() =>
  S.Struct({
    Domain: S.String,
    UserPoolId: S.String,
    ManagedLoginVersion: S.optional(S.Number),
    CustomDomainConfig: S.optional(CustomDomainConfigType),
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
  identifier: "CreateUserPoolDomainRequest",
}) as any as S.Schema<CreateUserPoolDomainRequest>;
export interface ManagedLoginBrandingType {
  ManagedLoginBrandingId?: string;
  UserPoolId?: string;
  UseCognitoProvidedValues?: boolean;
  Settings?: any;
  Assets?: AssetType[];
  CreationDate?: Date;
  LastModifiedDate?: Date;
}
export const ManagedLoginBrandingType = S.suspend(() =>
  S.Struct({
    ManagedLoginBrandingId: S.optional(S.String),
    UserPoolId: S.optional(S.String),
    UseCognitoProvidedValues: S.optional(S.Boolean),
    Settings: S.optional(S.Any),
    Assets: S.optional(AssetListType),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ManagedLoginBrandingType",
}) as any as S.Schema<ManagedLoginBrandingType>;
export interface DescribeManagedLoginBrandingByClientResponse {
  ManagedLoginBranding?: ManagedLoginBrandingType;
}
export const DescribeManagedLoginBrandingByClientResponse = S.suspend(() =>
  S.Struct({ ManagedLoginBranding: S.optional(ManagedLoginBrandingType) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeManagedLoginBrandingByClientResponse",
}) as any as S.Schema<DescribeManagedLoginBrandingByClientResponse>;
export interface DescribeUserImportJobResponse {
  UserImportJob?: UserImportJobType;
}
export const DescribeUserImportJobResponse = S.suspend(() =>
  S.Struct({ UserImportJob: S.optional(UserImportJobType) }).pipe(ns),
).annotations({
  identifier: "DescribeUserImportJobResponse",
}) as any as S.Schema<DescribeUserImportJobResponse>;
export interface GetCSVHeaderResponse {
  UserPoolId?: string;
  CSVHeader?: string[];
}
export const GetCSVHeaderResponse = S.suspend(() =>
  S.Struct({
    UserPoolId: S.optional(S.String),
    CSVHeader: S.optional(ListOfStringTypes),
  }).pipe(ns),
).annotations({
  identifier: "GetCSVHeaderResponse",
}) as any as S.Schema<GetCSVHeaderResponse>;
export interface GetDeviceResponse {
  Device: DeviceType;
}
export const GetDeviceResponse = S.suspend(() =>
  S.Struct({ Device: DeviceType }).pipe(ns),
).annotations({
  identifier: "GetDeviceResponse",
}) as any as S.Schema<GetDeviceResponse>;
export interface GetGroupResponse {
  Group?: GroupType;
}
export const GetGroupResponse = S.suspend(() =>
  S.Struct({ Group: S.optional(GroupType) }).pipe(ns),
).annotations({
  identifier: "GetGroupResponse",
}) as any as S.Schema<GetGroupResponse>;
export interface IdentityProviderType {
  UserPoolId?: string;
  ProviderName?: string;
  ProviderType?: IdentityProviderTypeType;
  ProviderDetails?: { [key: string]: string | undefined };
  AttributeMapping?: { [key: string]: string | undefined };
  IdpIdentifiers?: string[];
  LastModifiedDate?: Date;
  CreationDate?: Date;
}
export const IdentityProviderType = S.suspend(() =>
  S.Struct({
    UserPoolId: S.optional(S.String),
    ProviderName: S.optional(S.String),
    ProviderType: S.optional(IdentityProviderTypeType),
    ProviderDetails: S.optional(ProviderDetailsType),
    AttributeMapping: S.optional(AttributeMappingType),
    IdpIdentifiers: S.optional(IdpIdentifiersListType),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "IdentityProviderType",
}) as any as S.Schema<IdentityProviderType>;
export interface GetIdentityProviderByIdentifierResponse {
  IdentityProvider: IdentityProviderType;
}
export const GetIdentityProviderByIdentifierResponse = S.suspend(() =>
  S.Struct({ IdentityProvider: IdentityProviderType }).pipe(ns),
).annotations({
  identifier: "GetIdentityProviderByIdentifierResponse",
}) as any as S.Schema<GetIdentityProviderByIdentifierResponse>;
export interface GetSigningCertificateResponse {
  Certificate?: string;
}
export const GetSigningCertificateResponse = S.suspend(() =>
  S.Struct({ Certificate: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetSigningCertificateResponse",
}) as any as S.Schema<GetSigningCertificateResponse>;
export interface GetUserResponse {
  Username: string | redacted.Redacted<string>;
  UserAttributes: AttributeType[];
  MFAOptions?: MFAOptionType[];
  PreferredMfaSetting?: string;
  UserMFASettingList?: string[];
}
export const GetUserResponse = S.suspend(() =>
  S.Struct({
    Username: SensitiveString,
    UserAttributes: AttributeListType,
    MFAOptions: S.optional(MFAOptionListType),
    PreferredMfaSetting: S.optional(S.String),
    UserMFASettingList: S.optional(UserMFASettingListType),
  }).pipe(ns),
).annotations({
  identifier: "GetUserResponse",
}) as any as S.Schema<GetUserResponse>;
export interface GetUserAttributeVerificationCodeResponse {
  CodeDeliveryDetails?: CodeDeliveryDetailsType;
}
export const GetUserAttributeVerificationCodeResponse = S.suspend(() =>
  S.Struct({ CodeDeliveryDetails: S.optional(CodeDeliveryDetailsType) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetUserAttributeVerificationCodeResponse",
}) as any as S.Schema<GetUserAttributeVerificationCodeResponse>;
export interface GetUserAuthFactorsResponse {
  Username: string | redacted.Redacted<string>;
  PreferredMfaSetting?: string;
  UserMFASettingList?: string[];
  ConfiguredUserAuthFactors?: AuthFactorType[];
}
export const GetUserAuthFactorsResponse = S.suspend(() =>
  S.Struct({
    Username: SensitiveString,
    PreferredMfaSetting: S.optional(S.String),
    UserMFASettingList: S.optional(UserMFASettingListType),
    ConfiguredUserAuthFactors: S.optional(ConfiguredUserAuthFactorsListType),
  }).pipe(ns),
).annotations({
  identifier: "GetUserAuthFactorsResponse",
}) as any as S.Schema<GetUserAuthFactorsResponse>;
export interface GetUserPoolMfaConfigResponse {
  SmsMfaConfiguration?: SmsMfaConfigType;
  SoftwareTokenMfaConfiguration?: SoftwareTokenMfaConfigType;
  EmailMfaConfiguration?: EmailMfaConfigType;
  MfaConfiguration?: UserPoolMfaType;
  WebAuthnConfiguration?: WebAuthnConfigurationType;
}
export const GetUserPoolMfaConfigResponse = S.suspend(() =>
  S.Struct({
    SmsMfaConfiguration: S.optional(SmsMfaConfigType),
    SoftwareTokenMfaConfiguration: S.optional(SoftwareTokenMfaConfigType),
    EmailMfaConfiguration: S.optional(EmailMfaConfigType),
    MfaConfiguration: S.optional(UserPoolMfaType),
    WebAuthnConfiguration: S.optional(WebAuthnConfigurationType),
  }).pipe(ns),
).annotations({
  identifier: "GetUserPoolMfaConfigResponse",
}) as any as S.Schema<GetUserPoolMfaConfigResponse>;
export interface ListDevicesResponse {
  Devices?: DeviceType[];
  PaginationToken?: string;
}
export const ListDevicesResponse = S.suspend(() =>
  S.Struct({
    Devices: S.optional(DeviceListType),
    PaginationToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDevicesResponse",
}) as any as S.Schema<ListDevicesResponse>;
export type GroupListType = GroupType[];
export const GroupListType = S.Array(GroupType);
export interface ListGroupsResponse {
  Groups?: GroupType[];
  NextToken?: string;
}
export const ListGroupsResponse = S.suspend(() =>
  S.Struct({
    Groups: S.optional(GroupListType),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListGroupsResponse",
}) as any as S.Schema<ListGroupsResponse>;
export interface ListResourceServersResponse {
  ResourceServers: ResourceServerType[];
  NextToken?: string;
}
export const ListResourceServersResponse = S.suspend(() =>
  S.Struct({
    ResourceServers: ResourceServersListType,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListResourceServersResponse",
}) as any as S.Schema<ListResourceServersResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(UserPoolTagsType) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListUserImportJobsResponse {
  UserImportJobs?: UserImportJobType[];
  PaginationToken?: string;
}
export const ListUserImportJobsResponse = S.suspend(() =>
  S.Struct({
    UserImportJobs: S.optional(UserImportJobsListType),
    PaginationToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListUserImportJobsResponse",
}) as any as S.Schema<ListUserImportJobsResponse>;
export interface UserType {
  Username?: string | redacted.Redacted<string>;
  Attributes?: AttributeType[];
  UserCreateDate?: Date;
  UserLastModifiedDate?: Date;
  Enabled?: boolean;
  UserStatus?: UserStatusType;
  MFAOptions?: MFAOptionType[];
}
export const UserType = S.suspend(() =>
  S.Struct({
    Username: S.optional(SensitiveString),
    Attributes: S.optional(AttributeListType),
    UserCreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UserLastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Enabled: S.optional(S.Boolean),
    UserStatus: S.optional(UserStatusType),
    MFAOptions: S.optional(MFAOptionListType),
  }),
).annotations({ identifier: "UserType" }) as any as S.Schema<UserType>;
export type UsersListType = UserType[];
export const UsersListType = S.Array(UserType);
export interface ListUsersInGroupResponse {
  Users?: UserType[];
  NextToken?: string;
}
export const ListUsersInGroupResponse = S.suspend(() =>
  S.Struct({
    Users: S.optional(UsersListType),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListUsersInGroupResponse",
}) as any as S.Schema<ListUsersInGroupResponse>;
export interface ResendConfirmationCodeResponse {
  CodeDeliveryDetails?: CodeDeliveryDetailsType;
}
export const ResendConfirmationCodeResponse = S.suspend(() =>
  S.Struct({ CodeDeliveryDetails: S.optional(CodeDeliveryDetailsType) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ResendConfirmationCodeResponse",
}) as any as S.Schema<ResendConfirmationCodeResponse>;
export type ChallengeParametersType = { [key: string]: string | undefined };
export const ChallengeParametersType = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface NewDeviceMetadataType {
  DeviceKey?: string;
  DeviceGroupKey?: string;
}
export const NewDeviceMetadataType = S.suspend(() =>
  S.Struct({
    DeviceKey: S.optional(S.String),
    DeviceGroupKey: S.optional(S.String),
  }),
).annotations({
  identifier: "NewDeviceMetadataType",
}) as any as S.Schema<NewDeviceMetadataType>;
export interface AuthenticationResultType {
  AccessToken?: string | redacted.Redacted<string>;
  ExpiresIn?: number;
  TokenType?: string;
  RefreshToken?: string | redacted.Redacted<string>;
  IdToken?: string | redacted.Redacted<string>;
  NewDeviceMetadata?: NewDeviceMetadataType;
}
export const AuthenticationResultType = S.suspend(() =>
  S.Struct({
    AccessToken: S.optional(SensitiveString),
    ExpiresIn: S.optional(S.Number),
    TokenType: S.optional(S.String),
    RefreshToken: S.optional(SensitiveString),
    IdToken: S.optional(SensitiveString),
    NewDeviceMetadata: S.optional(NewDeviceMetadataType),
  }),
).annotations({
  identifier: "AuthenticationResultType",
}) as any as S.Schema<AuthenticationResultType>;
export interface RespondToAuthChallengeResponse {
  ChallengeName?: ChallengeNameType;
  Session?: string | redacted.Redacted<string>;
  ChallengeParameters?: { [key: string]: string | undefined };
  AuthenticationResult?: AuthenticationResultType;
}
export const RespondToAuthChallengeResponse = S.suspend(() =>
  S.Struct({
    ChallengeName: S.optional(ChallengeNameType),
    Session: S.optional(SensitiveString),
    ChallengeParameters: S.optional(ChallengeParametersType),
    AuthenticationResult: S.optional(AuthenticationResultType),
  }).pipe(ns),
).annotations({
  identifier: "RespondToAuthChallengeResponse",
}) as any as S.Schema<RespondToAuthChallengeResponse>;
export interface UICustomizationType {
  UserPoolId?: string;
  ClientId?: string | redacted.Redacted<string>;
  ImageUrl?: string;
  CSS?: string;
  CSSVersion?: string;
  LastModifiedDate?: Date;
  CreationDate?: Date;
}
export const UICustomizationType = S.suspend(() =>
  S.Struct({
    UserPoolId: S.optional(S.String),
    ClientId: S.optional(SensitiveString),
    ImageUrl: S.optional(S.String),
    CSS: S.optional(S.String),
    CSSVersion: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "UICustomizationType",
}) as any as S.Schema<UICustomizationType>;
export interface SetUICustomizationResponse {
  UICustomization: UICustomizationType;
}
export const SetUICustomizationResponse = S.suspend(() =>
  S.Struct({ UICustomization: UICustomizationType }).pipe(ns),
).annotations({
  identifier: "SetUICustomizationResponse",
}) as any as S.Schema<SetUICustomizationResponse>;
export interface SetUserPoolMfaConfigRequest {
  UserPoolId: string;
  SmsMfaConfiguration?: SmsMfaConfigType;
  SoftwareTokenMfaConfiguration?: SoftwareTokenMfaConfigType;
  EmailMfaConfiguration?: EmailMfaConfigType;
  MfaConfiguration?: UserPoolMfaType;
  WebAuthnConfiguration?: WebAuthnConfigurationType;
}
export const SetUserPoolMfaConfigRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    SmsMfaConfiguration: S.optional(SmsMfaConfigType),
    SoftwareTokenMfaConfiguration: S.optional(SoftwareTokenMfaConfigType),
    EmailMfaConfiguration: S.optional(EmailMfaConfigType),
    MfaConfiguration: S.optional(UserPoolMfaType),
    WebAuthnConfiguration: S.optional(WebAuthnConfigurationType),
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
  identifier: "SetUserPoolMfaConfigRequest",
}) as any as S.Schema<SetUserPoolMfaConfigRequest>;
export interface SignUpResponse {
  UserConfirmed: boolean;
  CodeDeliveryDetails?: CodeDeliveryDetailsType;
  UserSub: string;
  Session?: string | redacted.Redacted<string>;
}
export const SignUpResponse = S.suspend(() =>
  S.Struct({
    UserConfirmed: S.Boolean,
    CodeDeliveryDetails: S.optional(CodeDeliveryDetailsType),
    UserSub: S.String,
    Session: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "SignUpResponse",
}) as any as S.Schema<SignUpResponse>;
export interface StartUserImportJobResponse {
  UserImportJob?: UserImportJobType;
}
export const StartUserImportJobResponse = S.suspend(() =>
  S.Struct({ UserImportJob: S.optional(UserImportJobType) }).pipe(ns),
).annotations({
  identifier: "StartUserImportJobResponse",
}) as any as S.Schema<StartUserImportJobResponse>;
export interface StartWebAuthnRegistrationResponse {
  CredentialCreationOptions: any;
}
export const StartWebAuthnRegistrationResponse = S.suspend(() =>
  S.Struct({ CredentialCreationOptions: S.Any }).pipe(ns),
).annotations({
  identifier: "StartWebAuthnRegistrationResponse",
}) as any as S.Schema<StartWebAuthnRegistrationResponse>;
export interface StopUserImportJobResponse {
  UserImportJob?: UserImportJobType;
}
export const StopUserImportJobResponse = S.suspend(() =>
  S.Struct({ UserImportJob: S.optional(UserImportJobType) }).pipe(ns),
).annotations({
  identifier: "StopUserImportJobResponse",
}) as any as S.Schema<StopUserImportJobResponse>;
export interface UpdateGroupResponse {
  Group?: GroupType;
}
export const UpdateGroupResponse = S.suspend(() =>
  S.Struct({ Group: S.optional(GroupType) }).pipe(ns),
).annotations({
  identifier: "UpdateGroupResponse",
}) as any as S.Schema<UpdateGroupResponse>;
export interface UpdateIdentityProviderResponse {
  IdentityProvider: IdentityProviderType;
}
export const UpdateIdentityProviderResponse = S.suspend(() =>
  S.Struct({ IdentityProvider: IdentityProviderType }).pipe(ns),
).annotations({
  identifier: "UpdateIdentityProviderResponse",
}) as any as S.Schema<UpdateIdentityProviderResponse>;
export interface UpdateManagedLoginBrandingResponse {
  ManagedLoginBranding?: ManagedLoginBrandingType;
}
export const UpdateManagedLoginBrandingResponse = S.suspend(() =>
  S.Struct({ ManagedLoginBranding: S.optional(ManagedLoginBrandingType) }).pipe(
    ns,
  ),
).annotations({
  identifier: "UpdateManagedLoginBrandingResponse",
}) as any as S.Schema<UpdateManagedLoginBrandingResponse>;
export interface UpdateResourceServerResponse {
  ResourceServer: ResourceServerType;
}
export const UpdateResourceServerResponse = S.suspend(() =>
  S.Struct({ ResourceServer: ResourceServerType }).pipe(ns),
).annotations({
  identifier: "UpdateResourceServerResponse",
}) as any as S.Schema<UpdateResourceServerResponse>;
export interface TermsType {
  TermsId: string;
  UserPoolId: string;
  ClientId: string | redacted.Redacted<string>;
  TermsName: string;
  TermsSource: TermsSourceType;
  Enforcement: TermsEnforcementType;
  Links: { [key: string]: string | undefined };
  CreationDate: Date;
  LastModifiedDate: Date;
}
export const TermsType = S.suspend(() =>
  S.Struct({
    TermsId: S.String,
    UserPoolId: S.String,
    ClientId: SensitiveString,
    TermsName: S.String,
    TermsSource: TermsSourceType,
    Enforcement: TermsEnforcementType,
    Links: LinksType,
    CreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "TermsType" }) as any as S.Schema<TermsType>;
export interface UpdateTermsResponse {
  Terms?: TermsType;
}
export const UpdateTermsResponse = S.suspend(() =>
  S.Struct({ Terms: S.optional(TermsType) }).pipe(ns),
).annotations({
  identifier: "UpdateTermsResponse",
}) as any as S.Schema<UpdateTermsResponse>;
export interface UpdateUserAttributesResponse {
  CodeDeliveryDetailsList?: CodeDeliveryDetailsType[];
}
export const UpdateUserAttributesResponse = S.suspend(() =>
  S.Struct({
    CodeDeliveryDetailsList: S.optional(CodeDeliveryDetailsListType),
  }).pipe(ns),
).annotations({
  identifier: "UpdateUserAttributesResponse",
}) as any as S.Schema<UpdateUserAttributesResponse>;
export interface UserPoolClientType {
  UserPoolId?: string;
  ClientName?: string;
  ClientId?: string | redacted.Redacted<string>;
  ClientSecret?: string | redacted.Redacted<string>;
  LastModifiedDate?: Date;
  CreationDate?: Date;
  RefreshTokenValidity?: number;
  AccessTokenValidity?: number;
  IdTokenValidity?: number;
  TokenValidityUnits?: TokenValidityUnitsType;
  ReadAttributes?: string[];
  WriteAttributes?: string[];
  ExplicitAuthFlows?: ExplicitAuthFlowsType[];
  SupportedIdentityProviders?: string[];
  CallbackURLs?: string[];
  LogoutURLs?: string[];
  DefaultRedirectURI?: string;
  AllowedOAuthFlows?: OAuthFlowType[];
  AllowedOAuthScopes?: string[];
  AllowedOAuthFlowsUserPoolClient?: boolean;
  AnalyticsConfiguration?: AnalyticsConfigurationType;
  PreventUserExistenceErrors?: PreventUserExistenceErrorTypes;
  EnableTokenRevocation?: boolean;
  EnablePropagateAdditionalUserContextData?: boolean;
  AuthSessionValidity?: number;
  RefreshTokenRotation?: RefreshTokenRotationType;
}
export const UserPoolClientType = S.suspend(() =>
  S.Struct({
    UserPoolId: S.optional(S.String),
    ClientName: S.optional(S.String),
    ClientId: S.optional(SensitiveString),
    ClientSecret: S.optional(SensitiveString),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RefreshTokenValidity: S.optional(S.Number),
    AccessTokenValidity: S.optional(S.Number),
    IdTokenValidity: S.optional(S.Number),
    TokenValidityUnits: S.optional(TokenValidityUnitsType),
    ReadAttributes: S.optional(ClientPermissionListType),
    WriteAttributes: S.optional(ClientPermissionListType),
    ExplicitAuthFlows: S.optional(ExplicitAuthFlowsListType),
    SupportedIdentityProviders: S.optional(SupportedIdentityProvidersListType),
    CallbackURLs: S.optional(CallbackURLsListType),
    LogoutURLs: S.optional(LogoutURLsListType),
    DefaultRedirectURI: S.optional(S.String),
    AllowedOAuthFlows: S.optional(OAuthFlowsType),
    AllowedOAuthScopes: S.optional(ScopeListType),
    AllowedOAuthFlowsUserPoolClient: S.optional(S.Boolean),
    AnalyticsConfiguration: S.optional(AnalyticsConfigurationType),
    PreventUserExistenceErrors: S.optional(PreventUserExistenceErrorTypes),
    EnableTokenRevocation: S.optional(S.Boolean),
    EnablePropagateAdditionalUserContextData: S.optional(S.Boolean),
    AuthSessionValidity: S.optional(S.Number),
    RefreshTokenRotation: S.optional(RefreshTokenRotationType),
  }),
).annotations({
  identifier: "UserPoolClientType",
}) as any as S.Schema<UserPoolClientType>;
export interface UpdateUserPoolClientResponse {
  UserPoolClient?: UserPoolClientType;
}
export const UpdateUserPoolClientResponse = S.suspend(() =>
  S.Struct({ UserPoolClient: S.optional(UserPoolClientType) }).pipe(ns),
).annotations({
  identifier: "UpdateUserPoolClientResponse",
}) as any as S.Schema<UpdateUserPoolClientResponse>;
export interface UpdateUserPoolDomainResponse {
  ManagedLoginVersion?: number;
  CloudFrontDomain?: string;
}
export const UpdateUserPoolDomainResponse = S.suspend(() =>
  S.Struct({
    ManagedLoginVersion: S.optional(S.Number),
    CloudFrontDomain: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateUserPoolDomainResponse",
}) as any as S.Schema<UpdateUserPoolDomainResponse>;
export interface VerifySoftwareTokenResponse {
  Status?: VerifySoftwareTokenResponseType;
  Session?: string | redacted.Redacted<string>;
}
export const VerifySoftwareTokenResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(VerifySoftwareTokenResponseType),
    Session: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "VerifySoftwareTokenResponse",
}) as any as S.Schema<VerifySoftwareTokenResponse>;
export type EventType =
  | "SignIn"
  | "SignUp"
  | "ForgotPassword"
  | "PasswordChange"
  | "ResendCode"
  | (string & {});
export const EventType = S.String;
export type EventResponseType = "Pass" | "Fail" | "InProgress" | (string & {});
export const EventResponseType = S.String;
export type StatusType = "Enabled" | "Disabled" | (string & {});
export const StatusType = S.String;
export type DomainStatusType =
  | "CREATING"
  | "DELETING"
  | "UPDATING"
  | "ACTIVE"
  | "FAILED"
  | (string & {});
export const DomainStatusType = S.String;
export type WebAuthnAuthenticatorTransportsList = string[];
export const WebAuthnAuthenticatorTransportsList = S.Array(S.String);
export interface CloudWatchLogsConfigurationType {
  LogGroupArn?: string;
}
export const CloudWatchLogsConfigurationType = S.suspend(() =>
  S.Struct({ LogGroupArn: S.optional(S.String) }),
).annotations({
  identifier: "CloudWatchLogsConfigurationType",
}) as any as S.Schema<CloudWatchLogsConfigurationType>;
export interface S3ConfigurationType {
  BucketArn?: string;
}
export const S3ConfigurationType = S.suspend(() =>
  S.Struct({ BucketArn: S.optional(S.String) }),
).annotations({
  identifier: "S3ConfigurationType",
}) as any as S.Schema<S3ConfigurationType>;
export interface FirehoseConfigurationType {
  StreamArn?: string;
}
export const FirehoseConfigurationType = S.suspend(() =>
  S.Struct({ StreamArn: S.optional(S.String) }),
).annotations({
  identifier: "FirehoseConfigurationType",
}) as any as S.Schema<FirehoseConfigurationType>;
export interface CompromisedCredentialsActionsType {
  EventAction: CompromisedCredentialsEventActionType;
}
export const CompromisedCredentialsActionsType = S.suspend(() =>
  S.Struct({ EventAction: CompromisedCredentialsEventActionType }),
).annotations({
  identifier: "CompromisedCredentialsActionsType",
}) as any as S.Schema<CompromisedCredentialsActionsType>;
export type AccountTakeoverEventActionType =
  | "BLOCK"
  | "MFA_IF_CONFIGURED"
  | "MFA_REQUIRED"
  | "NO_ACTION"
  | (string & {});
export const AccountTakeoverEventActionType = S.String;
export type CustomAttributesListType = SchemaAttributeType[];
export const CustomAttributesListType = S.Array(SchemaAttributeType);
export interface CompromisedCredentialsRiskConfigurationType {
  EventFilter?: EventFilterType[];
  Actions: CompromisedCredentialsActionsType;
}
export const CompromisedCredentialsRiskConfigurationType = S.suspend(() =>
  S.Struct({
    EventFilter: S.optional(EventFiltersType),
    Actions: CompromisedCredentialsActionsType,
  }),
).annotations({
  identifier: "CompromisedCredentialsRiskConfigurationType",
}) as any as S.Schema<CompromisedCredentialsRiskConfigurationType>;
export interface NotifyEmailType {
  Subject: string;
  HtmlBody?: string;
  TextBody?: string;
}
export const NotifyEmailType = S.suspend(() =>
  S.Struct({
    Subject: S.String,
    HtmlBody: S.optional(S.String),
    TextBody: S.optional(S.String),
  }),
).annotations({
  identifier: "NotifyEmailType",
}) as any as S.Schema<NotifyEmailType>;
export interface NotifyConfigurationType {
  From?: string;
  ReplyTo?: string;
  SourceArn: string;
  BlockEmail?: NotifyEmailType;
  NoActionEmail?: NotifyEmailType;
  MfaEmail?: NotifyEmailType;
}
export const NotifyConfigurationType = S.suspend(() =>
  S.Struct({
    From: S.optional(S.String),
    ReplyTo: S.optional(S.String),
    SourceArn: S.String,
    BlockEmail: S.optional(NotifyEmailType),
    NoActionEmail: S.optional(NotifyEmailType),
    MfaEmail: S.optional(NotifyEmailType),
  }),
).annotations({
  identifier: "NotifyConfigurationType",
}) as any as S.Schema<NotifyConfigurationType>;
export interface AccountTakeoverActionType {
  Notify: boolean;
  EventAction: AccountTakeoverEventActionType;
}
export const AccountTakeoverActionType = S.suspend(() =>
  S.Struct({ Notify: S.Boolean, EventAction: AccountTakeoverEventActionType }),
).annotations({
  identifier: "AccountTakeoverActionType",
}) as any as S.Schema<AccountTakeoverActionType>;
export interface AccountTakeoverActionsType {
  LowAction?: AccountTakeoverActionType;
  MediumAction?: AccountTakeoverActionType;
  HighAction?: AccountTakeoverActionType;
}
export const AccountTakeoverActionsType = S.suspend(() =>
  S.Struct({
    LowAction: S.optional(AccountTakeoverActionType),
    MediumAction: S.optional(AccountTakeoverActionType),
    HighAction: S.optional(AccountTakeoverActionType),
  }),
).annotations({
  identifier: "AccountTakeoverActionsType",
}) as any as S.Schema<AccountTakeoverActionsType>;
export interface AccountTakeoverRiskConfigurationType {
  NotifyConfiguration?: NotifyConfigurationType;
  Actions: AccountTakeoverActionsType;
}
export const AccountTakeoverRiskConfigurationType = S.suspend(() =>
  S.Struct({
    NotifyConfiguration: S.optional(NotifyConfigurationType),
    Actions: AccountTakeoverActionsType,
  }),
).annotations({
  identifier: "AccountTakeoverRiskConfigurationType",
}) as any as S.Schema<AccountTakeoverRiskConfigurationType>;
export interface RiskConfigurationType {
  UserPoolId?: string;
  ClientId?: string | redacted.Redacted<string>;
  CompromisedCredentialsRiskConfiguration?: CompromisedCredentialsRiskConfigurationType;
  AccountTakeoverRiskConfiguration?: AccountTakeoverRiskConfigurationType;
  RiskExceptionConfiguration?: RiskExceptionConfigurationType;
  LastModifiedDate?: Date;
}
export const RiskConfigurationType = S.suspend(() =>
  S.Struct({
    UserPoolId: S.optional(S.String),
    ClientId: S.optional(SensitiveString),
    CompromisedCredentialsRiskConfiguration: S.optional(
      CompromisedCredentialsRiskConfigurationType,
    ),
    AccountTakeoverRiskConfiguration: S.optional(
      AccountTakeoverRiskConfigurationType,
    ),
    RiskExceptionConfiguration: S.optional(RiskExceptionConfigurationType),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "RiskConfigurationType",
}) as any as S.Schema<RiskConfigurationType>;
export interface UserPoolType {
  Id?: string;
  Name?: string;
  Policies?: UserPoolPolicyType;
  DeletionProtection?: DeletionProtectionType;
  LambdaConfig?: LambdaConfigType;
  Status?: StatusType;
  LastModifiedDate?: Date;
  CreationDate?: Date;
  SchemaAttributes?: SchemaAttributeType[];
  AutoVerifiedAttributes?: VerifiedAttributeType[];
  AliasAttributes?: AliasAttributeType[];
  UsernameAttributes?: UsernameAttributeType[];
  SmsVerificationMessage?: string;
  EmailVerificationMessage?: string;
  EmailVerificationSubject?: string;
  VerificationMessageTemplate?: VerificationMessageTemplateType;
  SmsAuthenticationMessage?: string;
  UserAttributeUpdateSettings?: UserAttributeUpdateSettingsType;
  MfaConfiguration?: UserPoolMfaType;
  DeviceConfiguration?: DeviceConfigurationType;
  EstimatedNumberOfUsers?: number;
  EmailConfiguration?: EmailConfigurationType;
  SmsConfiguration?: SmsConfigurationType;
  UserPoolTags?: { [key: string]: string | undefined };
  SmsConfigurationFailure?: string;
  EmailConfigurationFailure?: string;
  Domain?: string;
  CustomDomain?: string;
  AdminCreateUserConfig?: AdminCreateUserConfigType;
  UserPoolAddOns?: UserPoolAddOnsType;
  UsernameConfiguration?: UsernameConfigurationType;
  Arn?: string;
  AccountRecoverySetting?: AccountRecoverySettingType;
  UserPoolTier?: UserPoolTierType;
}
export const UserPoolType = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Policies: S.optional(UserPoolPolicyType),
    DeletionProtection: S.optional(DeletionProtectionType),
    LambdaConfig: S.optional(LambdaConfigType),
    Status: S.optional(StatusType),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SchemaAttributes: S.optional(SchemaAttributesListType),
    AutoVerifiedAttributes: S.optional(VerifiedAttributesListType),
    AliasAttributes: S.optional(AliasAttributesListType),
    UsernameAttributes: S.optional(UsernameAttributesListType),
    SmsVerificationMessage: S.optional(S.String),
    EmailVerificationMessage: S.optional(S.String),
    EmailVerificationSubject: S.optional(S.String),
    VerificationMessageTemplate: S.optional(VerificationMessageTemplateType),
    SmsAuthenticationMessage: S.optional(S.String),
    UserAttributeUpdateSettings: S.optional(UserAttributeUpdateSettingsType),
    MfaConfiguration: S.optional(UserPoolMfaType),
    DeviceConfiguration: S.optional(DeviceConfigurationType),
    EstimatedNumberOfUsers: S.optional(S.Number),
    EmailConfiguration: S.optional(EmailConfigurationType),
    SmsConfiguration: S.optional(SmsConfigurationType),
    UserPoolTags: S.optional(UserPoolTagsType),
    SmsConfigurationFailure: S.optional(S.String),
    EmailConfigurationFailure: S.optional(S.String),
    Domain: S.optional(S.String),
    CustomDomain: S.optional(S.String),
    AdminCreateUserConfig: S.optional(AdminCreateUserConfigType),
    UserPoolAddOns: S.optional(UserPoolAddOnsType),
    UsernameConfiguration: S.optional(UsernameConfigurationType),
    Arn: S.optional(S.String),
    AccountRecoverySetting: S.optional(AccountRecoverySettingType),
    UserPoolTier: S.optional(UserPoolTierType),
  }),
).annotations({ identifier: "UserPoolType" }) as any as S.Schema<UserPoolType>;
export interface DomainDescriptionType {
  UserPoolId?: string;
  AWSAccountId?: string;
  Domain?: string;
  S3Bucket?: string;
  CloudFrontDistribution?: string;
  Version?: string;
  Status?: DomainStatusType;
  CustomDomainConfig?: CustomDomainConfigType;
  ManagedLoginVersion?: number;
}
export const DomainDescriptionType = S.suspend(() =>
  S.Struct({
    UserPoolId: S.optional(S.String),
    AWSAccountId: S.optional(S.String),
    Domain: S.optional(S.String),
    S3Bucket: S.optional(S.String),
    CloudFrontDistribution: S.optional(S.String),
    Version: S.optional(S.String),
    Status: S.optional(DomainStatusType),
    CustomDomainConfig: S.optional(CustomDomainConfigType),
    ManagedLoginVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "DomainDescriptionType",
}) as any as S.Schema<DomainDescriptionType>;
export interface LogConfigurationType {
  LogLevel: LogLevel;
  EventSource: EventSourceName;
  CloudWatchLogsConfiguration?: CloudWatchLogsConfigurationType;
  S3Configuration?: S3ConfigurationType;
  FirehoseConfiguration?: FirehoseConfigurationType;
}
export const LogConfigurationType = S.suspend(() =>
  S.Struct({
    LogLevel: LogLevel,
    EventSource: EventSourceName,
    CloudWatchLogsConfiguration: S.optional(CloudWatchLogsConfigurationType),
    S3Configuration: S.optional(S3ConfigurationType),
    FirehoseConfiguration: S.optional(FirehoseConfigurationType),
  }),
).annotations({
  identifier: "LogConfigurationType",
}) as any as S.Schema<LogConfigurationType>;
export type LogConfigurationListType = LogConfigurationType[];
export const LogConfigurationListType = S.Array(LogConfigurationType);
export interface LogDeliveryConfigurationType {
  UserPoolId: string;
  LogConfigurations: LogConfigurationType[];
}
export const LogDeliveryConfigurationType = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    LogConfigurations: LogConfigurationListType,
  }),
).annotations({
  identifier: "LogDeliveryConfigurationType",
}) as any as S.Schema<LogDeliveryConfigurationType>;
export interface ProviderDescription {
  ProviderName?: string;
  ProviderType?: IdentityProviderTypeType;
  LastModifiedDate?: Date;
  CreationDate?: Date;
}
export const ProviderDescription = S.suspend(() =>
  S.Struct({
    ProviderName: S.optional(S.String),
    ProviderType: S.optional(IdentityProviderTypeType),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ProviderDescription",
}) as any as S.Schema<ProviderDescription>;
export type ProvidersListType = ProviderDescription[];
export const ProvidersListType = S.Array(ProviderDescription);
export interface TermsDescriptionType {
  TermsId: string;
  TermsName: string;
  Enforcement: TermsEnforcementType;
  CreationDate: Date;
  LastModifiedDate: Date;
}
export const TermsDescriptionType = S.suspend(() =>
  S.Struct({
    TermsId: S.String,
    TermsName: S.String,
    Enforcement: TermsEnforcementType,
    CreationDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedDate: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "TermsDescriptionType",
}) as any as S.Schema<TermsDescriptionType>;
export type TermsDescriptionListType = TermsDescriptionType[];
export const TermsDescriptionListType = S.Array(TermsDescriptionType);
export interface UserPoolClientDescription {
  ClientId?: string | redacted.Redacted<string>;
  UserPoolId?: string;
  ClientName?: string;
}
export const UserPoolClientDescription = S.suspend(() =>
  S.Struct({
    ClientId: S.optional(SensitiveString),
    UserPoolId: S.optional(S.String),
    ClientName: S.optional(S.String),
  }),
).annotations({
  identifier: "UserPoolClientDescription",
}) as any as S.Schema<UserPoolClientDescription>;
export type UserPoolClientListType = UserPoolClientDescription[];
export const UserPoolClientListType = S.Array(UserPoolClientDescription);
export interface UserPoolDescriptionType {
  Id?: string;
  Name?: string;
  LambdaConfig?: LambdaConfigType;
  Status?: StatusType;
  LastModifiedDate?: Date;
  CreationDate?: Date;
}
export const UserPoolDescriptionType = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    LambdaConfig: S.optional(LambdaConfigType),
    Status: S.optional(StatusType),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "UserPoolDescriptionType",
}) as any as S.Schema<UserPoolDescriptionType>;
export type UserPoolListType = UserPoolDescriptionType[];
export const UserPoolListType = S.Array(UserPoolDescriptionType);
export interface WebAuthnCredentialDescription {
  CredentialId: string;
  FriendlyCredentialName: string;
  RelyingPartyId: string;
  AuthenticatorAttachment?: string;
  AuthenticatorTransports: string[];
  CreatedAt: Date;
}
export const WebAuthnCredentialDescription = S.suspend(() =>
  S.Struct({
    CredentialId: S.String,
    FriendlyCredentialName: S.String,
    RelyingPartyId: S.String,
    AuthenticatorAttachment: S.optional(S.String),
    AuthenticatorTransports: WebAuthnAuthenticatorTransportsList,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "WebAuthnCredentialDescription",
}) as any as S.Schema<WebAuthnCredentialDescription>;
export type WebAuthnCredentialDescriptionListType =
  WebAuthnCredentialDescription[];
export const WebAuthnCredentialDescriptionListType = S.Array(
  WebAuthnCredentialDescription,
);
export type RiskDecisionType =
  | "NoRisk"
  | "AccountTakeover"
  | "Block"
  | (string & {});
export const RiskDecisionType = S.String;
export type RiskLevelType = "Low" | "Medium" | "High" | (string & {});
export const RiskLevelType = S.String;
export type ChallengeName = "Password" | "Mfa" | (string & {});
export const ChallengeName = S.String;
export type ChallengeResponse = "Success" | "Failure" | (string & {});
export const ChallengeResponse = S.String;
export interface AddCustomAttributesRequest {
  UserPoolId: string;
  CustomAttributes: SchemaAttributeType[];
}
export const AddCustomAttributesRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    CustomAttributes: CustomAttributesListType,
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
  identifier: "AddCustomAttributesRequest",
}) as any as S.Schema<AddCustomAttributesRequest>;
export interface AddCustomAttributesResponse {}
export const AddCustomAttributesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddCustomAttributesResponse",
}) as any as S.Schema<AddCustomAttributesResponse>;
export interface AdminCreateUserResponse {
  User?: UserType;
}
export const AdminCreateUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(UserType) }).pipe(ns),
).annotations({
  identifier: "AdminCreateUserResponse",
}) as any as S.Schema<AdminCreateUserResponse>;
export interface AdminGetDeviceResponse {
  Device: DeviceType;
}
export const AdminGetDeviceResponse = S.suspend(() =>
  S.Struct({ Device: DeviceType }).pipe(ns),
).annotations({
  identifier: "AdminGetDeviceResponse",
}) as any as S.Schema<AdminGetDeviceResponse>;
export interface AdminInitiateAuthRequest {
  UserPoolId: string;
  ClientId: string | redacted.Redacted<string>;
  AuthFlow: AuthFlowType;
  AuthParameters?: { [key: string]: string | undefined };
  ClientMetadata?: { [key: string]: string | undefined };
  AnalyticsMetadata?: AnalyticsMetadataType;
  ContextData?: ContextDataType;
  Session?: string | redacted.Redacted<string>;
}
export const AdminInitiateAuthRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ClientId: SensitiveString,
    AuthFlow: AuthFlowType,
    AuthParameters: S.optional(AuthParametersType),
    ClientMetadata: S.optional(ClientMetadataType),
    AnalyticsMetadata: S.optional(AnalyticsMetadataType),
    ContextData: S.optional(ContextDataType),
    Session: S.optional(SensitiveString),
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
  identifier: "AdminInitiateAuthRequest",
}) as any as S.Schema<AdminInitiateAuthRequest>;
export interface AdminListGroupsForUserResponse {
  Groups?: GroupType[];
  NextToken?: string;
}
export const AdminListGroupsForUserResponse = S.suspend(() =>
  S.Struct({
    Groups: S.optional(GroupListType),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "AdminListGroupsForUserResponse",
}) as any as S.Schema<AdminListGroupsForUserResponse>;
export interface AdminRespondToAuthChallengeResponse {
  ChallengeName?: ChallengeNameType;
  Session?: string | redacted.Redacted<string>;
  ChallengeParameters?: { [key: string]: string | undefined };
  AuthenticationResult?: AuthenticationResultType;
}
export const AdminRespondToAuthChallengeResponse = S.suspend(() =>
  S.Struct({
    ChallengeName: S.optional(ChallengeNameType),
    Session: S.optional(SensitiveString),
    ChallengeParameters: S.optional(ChallengeParametersType),
    AuthenticationResult: S.optional(AuthenticationResultType),
  }).pipe(ns),
).annotations({
  identifier: "AdminRespondToAuthChallengeResponse",
}) as any as S.Schema<AdminRespondToAuthChallengeResponse>;
export interface ConfirmDeviceResponse {
  UserConfirmationNecessary?: boolean;
}
export const ConfirmDeviceResponse = S.suspend(() =>
  S.Struct({ UserConfirmationNecessary: S.optional(S.Boolean) }).pipe(ns),
).annotations({
  identifier: "ConfirmDeviceResponse",
}) as any as S.Schema<ConfirmDeviceResponse>;
export interface CreateIdentityProviderResponse {
  IdentityProvider: IdentityProviderType;
}
export const CreateIdentityProviderResponse = S.suspend(() =>
  S.Struct({ IdentityProvider: IdentityProviderType }).pipe(ns),
).annotations({
  identifier: "CreateIdentityProviderResponse",
}) as any as S.Schema<CreateIdentityProviderResponse>;
export interface CreateManagedLoginBrandingResponse {
  ManagedLoginBranding?: ManagedLoginBrandingType;
}
export const CreateManagedLoginBrandingResponse = S.suspend(() =>
  S.Struct({ ManagedLoginBranding: S.optional(ManagedLoginBrandingType) }).pipe(
    ns,
  ),
).annotations({
  identifier: "CreateManagedLoginBrandingResponse",
}) as any as S.Schema<CreateManagedLoginBrandingResponse>;
export interface CreateResourceServerResponse {
  ResourceServer: ResourceServerType;
}
export const CreateResourceServerResponse = S.suspend(() =>
  S.Struct({ ResourceServer: ResourceServerType }).pipe(ns),
).annotations({
  identifier: "CreateResourceServerResponse",
}) as any as S.Schema<CreateResourceServerResponse>;
export interface CreateTermsResponse {
  Terms?: TermsType;
}
export const CreateTermsResponse = S.suspend(() =>
  S.Struct({ Terms: S.optional(TermsType) }).pipe(ns),
).annotations({
  identifier: "CreateTermsResponse",
}) as any as S.Schema<CreateTermsResponse>;
export interface CreateUserImportJobResponse {
  UserImportJob?: UserImportJobType;
}
export const CreateUserImportJobResponse = S.suspend(() =>
  S.Struct({ UserImportJob: S.optional(UserImportJobType) }).pipe(ns),
).annotations({
  identifier: "CreateUserImportJobResponse",
}) as any as S.Schema<CreateUserImportJobResponse>;
export interface CreateUserPoolRequest {
  PoolName: string;
  Policies?: UserPoolPolicyType;
  DeletionProtection?: DeletionProtectionType;
  LambdaConfig?: LambdaConfigType;
  AutoVerifiedAttributes?: VerifiedAttributeType[];
  AliasAttributes?: AliasAttributeType[];
  UsernameAttributes?: UsernameAttributeType[];
  SmsVerificationMessage?: string;
  EmailVerificationMessage?: string;
  EmailVerificationSubject?: string;
  VerificationMessageTemplate?: VerificationMessageTemplateType;
  SmsAuthenticationMessage?: string;
  MfaConfiguration?: UserPoolMfaType;
  UserAttributeUpdateSettings?: UserAttributeUpdateSettingsType;
  DeviceConfiguration?: DeviceConfigurationType;
  EmailConfiguration?: EmailConfigurationType;
  SmsConfiguration?: SmsConfigurationType;
  UserPoolTags?: { [key: string]: string | undefined };
  AdminCreateUserConfig?: AdminCreateUserConfigType;
  Schema?: SchemaAttributeType[];
  UserPoolAddOns?: UserPoolAddOnsType;
  UsernameConfiguration?: UsernameConfigurationType;
  AccountRecoverySetting?: AccountRecoverySettingType;
  UserPoolTier?: UserPoolTierType;
}
export const CreateUserPoolRequest = S.suspend(() =>
  S.Struct({
    PoolName: S.String,
    Policies: S.optional(UserPoolPolicyType),
    DeletionProtection: S.optional(DeletionProtectionType),
    LambdaConfig: S.optional(LambdaConfigType),
    AutoVerifiedAttributes: S.optional(VerifiedAttributesListType),
    AliasAttributes: S.optional(AliasAttributesListType),
    UsernameAttributes: S.optional(UsernameAttributesListType),
    SmsVerificationMessage: S.optional(S.String),
    EmailVerificationMessage: S.optional(S.String),
    EmailVerificationSubject: S.optional(S.String),
    VerificationMessageTemplate: S.optional(VerificationMessageTemplateType),
    SmsAuthenticationMessage: S.optional(S.String),
    MfaConfiguration: S.optional(UserPoolMfaType),
    UserAttributeUpdateSettings: S.optional(UserAttributeUpdateSettingsType),
    DeviceConfiguration: S.optional(DeviceConfigurationType),
    EmailConfiguration: S.optional(EmailConfigurationType),
    SmsConfiguration: S.optional(SmsConfigurationType),
    UserPoolTags: S.optional(UserPoolTagsType),
    AdminCreateUserConfig: S.optional(AdminCreateUserConfigType),
    Schema: S.optional(SchemaAttributesListType),
    UserPoolAddOns: S.optional(UserPoolAddOnsType),
    UsernameConfiguration: S.optional(UsernameConfigurationType),
    AccountRecoverySetting: S.optional(AccountRecoverySettingType),
    UserPoolTier: S.optional(UserPoolTierType),
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
  identifier: "CreateUserPoolRequest",
}) as any as S.Schema<CreateUserPoolRequest>;
export interface CreateUserPoolClientResponse {
  UserPoolClient?: UserPoolClientType;
}
export const CreateUserPoolClientResponse = S.suspend(() =>
  S.Struct({ UserPoolClient: S.optional(UserPoolClientType) }).pipe(ns),
).annotations({
  identifier: "CreateUserPoolClientResponse",
}) as any as S.Schema<CreateUserPoolClientResponse>;
export interface CreateUserPoolDomainResponse {
  ManagedLoginVersion?: number;
  CloudFrontDomain?: string;
}
export const CreateUserPoolDomainResponse = S.suspend(() =>
  S.Struct({
    ManagedLoginVersion: S.optional(S.Number),
    CloudFrontDomain: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateUserPoolDomainResponse",
}) as any as S.Schema<CreateUserPoolDomainResponse>;
export interface DescribeIdentityProviderResponse {
  IdentityProvider: IdentityProviderType;
}
export const DescribeIdentityProviderResponse = S.suspend(() =>
  S.Struct({ IdentityProvider: IdentityProviderType }).pipe(ns),
).annotations({
  identifier: "DescribeIdentityProviderResponse",
}) as any as S.Schema<DescribeIdentityProviderResponse>;
export interface DescribeManagedLoginBrandingResponse {
  ManagedLoginBranding?: ManagedLoginBrandingType;
}
export const DescribeManagedLoginBrandingResponse = S.suspend(() =>
  S.Struct({ ManagedLoginBranding: S.optional(ManagedLoginBrandingType) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeManagedLoginBrandingResponse",
}) as any as S.Schema<DescribeManagedLoginBrandingResponse>;
export interface DescribeResourceServerResponse {
  ResourceServer: ResourceServerType;
}
export const DescribeResourceServerResponse = S.suspend(() =>
  S.Struct({ ResourceServer: ResourceServerType }).pipe(ns),
).annotations({
  identifier: "DescribeResourceServerResponse",
}) as any as S.Schema<DescribeResourceServerResponse>;
export interface DescribeRiskConfigurationResponse {
  RiskConfiguration: RiskConfigurationType;
}
export const DescribeRiskConfigurationResponse = S.suspend(() =>
  S.Struct({ RiskConfiguration: RiskConfigurationType }).pipe(ns),
).annotations({
  identifier: "DescribeRiskConfigurationResponse",
}) as any as S.Schema<DescribeRiskConfigurationResponse>;
export interface DescribeTermsResponse {
  Terms?: TermsType;
}
export const DescribeTermsResponse = S.suspend(() =>
  S.Struct({ Terms: S.optional(TermsType) }).pipe(ns),
).annotations({
  identifier: "DescribeTermsResponse",
}) as any as S.Schema<DescribeTermsResponse>;
export interface DescribeUserPoolResponse {
  UserPool?: UserPoolType;
}
export const DescribeUserPoolResponse = S.suspend(() =>
  S.Struct({ UserPool: S.optional(UserPoolType) }).pipe(ns),
).annotations({
  identifier: "DescribeUserPoolResponse",
}) as any as S.Schema<DescribeUserPoolResponse>;
export interface DescribeUserPoolClientResponse {
  UserPoolClient?: UserPoolClientType;
}
export const DescribeUserPoolClientResponse = S.suspend(() =>
  S.Struct({ UserPoolClient: S.optional(UserPoolClientType) }).pipe(ns),
).annotations({
  identifier: "DescribeUserPoolClientResponse",
}) as any as S.Schema<DescribeUserPoolClientResponse>;
export interface DescribeUserPoolDomainResponse {
  DomainDescription?: DomainDescriptionType;
}
export const DescribeUserPoolDomainResponse = S.suspend(() =>
  S.Struct({ DomainDescription: S.optional(DomainDescriptionType) }).pipe(ns),
).annotations({
  identifier: "DescribeUserPoolDomainResponse",
}) as any as S.Schema<DescribeUserPoolDomainResponse>;
export interface ForgotPasswordResponse {
  CodeDeliveryDetails?: CodeDeliveryDetailsType;
}
export const ForgotPasswordResponse = S.suspend(() =>
  S.Struct({ CodeDeliveryDetails: S.optional(CodeDeliveryDetailsType) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ForgotPasswordResponse",
}) as any as S.Schema<ForgotPasswordResponse>;
export interface GetLogDeliveryConfigurationResponse {
  LogDeliveryConfiguration?: LogDeliveryConfigurationType;
}
export const GetLogDeliveryConfigurationResponse = S.suspend(() =>
  S.Struct({
    LogDeliveryConfiguration: S.optional(LogDeliveryConfigurationType),
  }).pipe(ns),
).annotations({
  identifier: "GetLogDeliveryConfigurationResponse",
}) as any as S.Schema<GetLogDeliveryConfigurationResponse>;
export interface GetUICustomizationResponse {
  UICustomization: UICustomizationType;
}
export const GetUICustomizationResponse = S.suspend(() =>
  S.Struct({ UICustomization: UICustomizationType }).pipe(ns),
).annotations({
  identifier: "GetUICustomizationResponse",
}) as any as S.Schema<GetUICustomizationResponse>;
export interface InitiateAuthResponse {
  ChallengeName?: ChallengeNameType;
  Session?: string | redacted.Redacted<string>;
  ChallengeParameters?: { [key: string]: string | undefined };
  AuthenticationResult?: AuthenticationResultType;
  AvailableChallenges?: ChallengeNameType[];
}
export const InitiateAuthResponse = S.suspend(() =>
  S.Struct({
    ChallengeName: S.optional(ChallengeNameType),
    Session: S.optional(SensitiveString),
    ChallengeParameters: S.optional(ChallengeParametersType),
    AuthenticationResult: S.optional(AuthenticationResultType),
    AvailableChallenges: S.optional(AvailableChallengeListType),
  }).pipe(ns),
).annotations({
  identifier: "InitiateAuthResponse",
}) as any as S.Schema<InitiateAuthResponse>;
export interface ListIdentityProvidersResponse {
  Providers: ProviderDescription[];
  NextToken?: string;
}
export const ListIdentityProvidersResponse = S.suspend(() =>
  S.Struct({
    Providers: ProvidersListType,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListIdentityProvidersResponse",
}) as any as S.Schema<ListIdentityProvidersResponse>;
export interface ListTermsResponse {
  Terms: TermsDescriptionType[];
  NextToken?: string;
}
export const ListTermsResponse = S.suspend(() =>
  S.Struct({
    Terms: TermsDescriptionListType,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTermsResponse",
}) as any as S.Schema<ListTermsResponse>;
export interface ListUserPoolClientsResponse {
  UserPoolClients?: UserPoolClientDescription[];
  NextToken?: string;
}
export const ListUserPoolClientsResponse = S.suspend(() =>
  S.Struct({
    UserPoolClients: S.optional(UserPoolClientListType),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListUserPoolClientsResponse",
}) as any as S.Schema<ListUserPoolClientsResponse>;
export interface ListUserPoolsResponse {
  UserPools?: UserPoolDescriptionType[];
  NextToken?: string;
}
export const ListUserPoolsResponse = S.suspend(() =>
  S.Struct({
    UserPools: S.optional(UserPoolListType),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListUserPoolsResponse",
}) as any as S.Schema<ListUserPoolsResponse>;
export interface ListUsersResponse {
  Users?: UserType[];
  PaginationToken?: string;
}
export const ListUsersResponse = S.suspend(() =>
  S.Struct({
    Users: S.optional(UsersListType),
    PaginationToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListUsersResponse",
}) as any as S.Schema<ListUsersResponse>;
export interface ListWebAuthnCredentialsResponse {
  Credentials: WebAuthnCredentialDescription[];
  NextToken?: string;
}
export const ListWebAuthnCredentialsResponse = S.suspend(() =>
  S.Struct({
    Credentials: WebAuthnCredentialDescriptionListType,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListWebAuthnCredentialsResponse",
}) as any as S.Schema<ListWebAuthnCredentialsResponse>;
export interface SetLogDeliveryConfigurationRequest {
  UserPoolId: string;
  LogConfigurations: LogConfigurationType[];
}
export const SetLogDeliveryConfigurationRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    LogConfigurations: LogConfigurationListType,
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
  identifier: "SetLogDeliveryConfigurationRequest",
}) as any as S.Schema<SetLogDeliveryConfigurationRequest>;
export interface SetUserPoolMfaConfigResponse {
  SmsMfaConfiguration?: SmsMfaConfigType;
  SoftwareTokenMfaConfiguration?: SoftwareTokenMfaConfigType;
  EmailMfaConfiguration?: EmailMfaConfigType;
  MfaConfiguration?: UserPoolMfaType;
  WebAuthnConfiguration?: WebAuthnConfigurationType;
}
export const SetUserPoolMfaConfigResponse = S.suspend(() =>
  S.Struct({
    SmsMfaConfiguration: S.optional(SmsMfaConfigType),
    SoftwareTokenMfaConfiguration: S.optional(SoftwareTokenMfaConfigType),
    EmailMfaConfiguration: S.optional(EmailMfaConfigType),
    MfaConfiguration: S.optional(UserPoolMfaType),
    WebAuthnConfiguration: S.optional(WebAuthnConfigurationType),
  }).pipe(ns),
).annotations({
  identifier: "SetUserPoolMfaConfigResponse",
}) as any as S.Schema<SetUserPoolMfaConfigResponse>;
export interface EventRiskType {
  RiskDecision?: RiskDecisionType;
  RiskLevel?: RiskLevelType;
  CompromisedCredentialsDetected?: boolean;
}
export const EventRiskType = S.suspend(() =>
  S.Struct({
    RiskDecision: S.optional(RiskDecisionType),
    RiskLevel: S.optional(RiskLevelType),
    CompromisedCredentialsDetected: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EventRiskType",
}) as any as S.Schema<EventRiskType>;
export interface ChallengeResponseType {
  ChallengeName?: ChallengeName;
  ChallengeResponse?: ChallengeResponse;
}
export const ChallengeResponseType = S.suspend(() =>
  S.Struct({
    ChallengeName: S.optional(ChallengeName),
    ChallengeResponse: S.optional(ChallengeResponse),
  }),
).annotations({
  identifier: "ChallengeResponseType",
}) as any as S.Schema<ChallengeResponseType>;
export type ChallengeResponseListType = ChallengeResponseType[];
export const ChallengeResponseListType = S.Array(ChallengeResponseType);
export interface EventContextDataType {
  IpAddress?: string;
  DeviceName?: string;
  Timezone?: string;
  City?: string;
  Country?: string;
}
export const EventContextDataType = S.suspend(() =>
  S.Struct({
    IpAddress: S.optional(S.String),
    DeviceName: S.optional(S.String),
    Timezone: S.optional(S.String),
    City: S.optional(S.String),
    Country: S.optional(S.String),
  }),
).annotations({
  identifier: "EventContextDataType",
}) as any as S.Schema<EventContextDataType>;
export interface EventFeedbackType {
  FeedbackValue: FeedbackValueType;
  Provider: string;
  FeedbackDate?: Date;
}
export const EventFeedbackType = S.suspend(() =>
  S.Struct({
    FeedbackValue: FeedbackValueType,
    Provider: S.String,
    FeedbackDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "EventFeedbackType",
}) as any as S.Schema<EventFeedbackType>;
export interface AuthEventType {
  EventId?: string;
  EventType?: EventType;
  CreationDate?: Date;
  EventResponse?: EventResponseType;
  EventRisk?: EventRiskType;
  ChallengeResponses?: ChallengeResponseType[];
  EventContextData?: EventContextDataType;
  EventFeedback?: EventFeedbackType;
}
export const AuthEventType = S.suspend(() =>
  S.Struct({
    EventId: S.optional(S.String),
    EventType: S.optional(EventType),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventResponse: S.optional(EventResponseType),
    EventRisk: S.optional(EventRiskType),
    ChallengeResponses: S.optional(ChallengeResponseListType),
    EventContextData: S.optional(EventContextDataType),
    EventFeedback: S.optional(EventFeedbackType),
  }),
).annotations({
  identifier: "AuthEventType",
}) as any as S.Schema<AuthEventType>;
export type AuthEventsType = AuthEventType[];
export const AuthEventsType = S.Array(AuthEventType);
export interface AdminInitiateAuthResponse {
  ChallengeName?: ChallengeNameType;
  Session?: string | redacted.Redacted<string>;
  ChallengeParameters?: { [key: string]: string | undefined };
  AuthenticationResult?: AuthenticationResultType;
  AvailableChallenges?: ChallengeNameType[];
}
export const AdminInitiateAuthResponse = S.suspend(() =>
  S.Struct({
    ChallengeName: S.optional(ChallengeNameType),
    Session: S.optional(SensitiveString),
    ChallengeParameters: S.optional(ChallengeParametersType),
    AuthenticationResult: S.optional(AuthenticationResultType),
    AvailableChallenges: S.optional(AvailableChallengeListType),
  }).pipe(ns),
).annotations({
  identifier: "AdminInitiateAuthResponse",
}) as any as S.Schema<AdminInitiateAuthResponse>;
export interface AdminListUserAuthEventsResponse {
  AuthEvents?: AuthEventType[];
  NextToken?: string;
}
export const AdminListUserAuthEventsResponse = S.suspend(() =>
  S.Struct({
    AuthEvents: S.optional(AuthEventsType),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "AdminListUserAuthEventsResponse",
}) as any as S.Schema<AdminListUserAuthEventsResponse>;
export interface CreateUserPoolResponse {
  UserPool?: UserPoolType;
}
export const CreateUserPoolResponse = S.suspend(() =>
  S.Struct({ UserPool: S.optional(UserPoolType) }).pipe(ns),
).annotations({
  identifier: "CreateUserPoolResponse",
}) as any as S.Schema<CreateUserPoolResponse>;
export interface GetTokensFromRefreshTokenResponse {
  AuthenticationResult?: AuthenticationResultType;
}
export const GetTokensFromRefreshTokenResponse = S.suspend(() =>
  S.Struct({ AuthenticationResult: S.optional(AuthenticationResultType) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetTokensFromRefreshTokenResponse",
}) as any as S.Schema<GetTokensFromRefreshTokenResponse>;
export interface SetLogDeliveryConfigurationResponse {
  LogDeliveryConfiguration?: LogDeliveryConfigurationType;
}
export const SetLogDeliveryConfigurationResponse = S.suspend(() =>
  S.Struct({
    LogDeliveryConfiguration: S.optional(LogDeliveryConfigurationType),
  }).pipe(ns),
).annotations({
  identifier: "SetLogDeliveryConfigurationResponse",
}) as any as S.Schema<SetLogDeliveryConfigurationResponse>;
export interface SetRiskConfigurationRequest {
  UserPoolId: string;
  ClientId?: string | redacted.Redacted<string>;
  CompromisedCredentialsRiskConfiguration?: CompromisedCredentialsRiskConfigurationType;
  AccountTakeoverRiskConfiguration?: AccountTakeoverRiskConfigurationType;
  RiskExceptionConfiguration?: RiskExceptionConfigurationType;
}
export const SetRiskConfigurationRequest = S.suspend(() =>
  S.Struct({
    UserPoolId: S.String,
    ClientId: S.optional(SensitiveString),
    CompromisedCredentialsRiskConfiguration: S.optional(
      CompromisedCredentialsRiskConfigurationType,
    ),
    AccountTakeoverRiskConfiguration: S.optional(
      AccountTakeoverRiskConfigurationType,
    ),
    RiskExceptionConfiguration: S.optional(RiskExceptionConfigurationType),
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
  identifier: "SetRiskConfigurationRequest",
}) as any as S.Schema<SetRiskConfigurationRequest>;
export interface SetRiskConfigurationResponse {
  RiskConfiguration: RiskConfigurationType;
}
export const SetRiskConfigurationResponse = S.suspend(() =>
  S.Struct({ RiskConfiguration: RiskConfigurationType }).pipe(ns),
).annotations({
  identifier: "SetRiskConfigurationResponse",
}) as any as S.Schema<SetRiskConfigurationResponse>;

//# Errors
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class AliasExistsException extends S.TaggedError<AliasExistsException>()(
  "AliasExistsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String), reasonCode: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidLambdaResponseException extends S.TaggedError<InvalidLambdaResponseException>()(
  "InvalidLambdaResponseException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CodeMismatchException extends S.TaggedError<CodeMismatchException>()(
  "CodeMismatchException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class GroupExistsException extends S.TaggedError<GroupExistsException>()(
  "GroupExistsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class CodeDeliveryFailureException extends S.TaggedError<CodeDeliveryFailureException>()(
  "CodeDeliveryFailureException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FeatureUnavailableInTierException extends S.TaggedError<FeatureUnavailableInTierException>()(
  "FeatureUnavailableInTierException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InvalidEmailRoleAccessPolicyException extends S.TaggedError<InvalidEmailRoleAccessPolicyException>()(
  "InvalidEmailRoleAccessPolicyException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidUserPoolConfigurationException extends S.TaggedError<InvalidUserPoolConfigurationException>()(
  "InvalidUserPoolConfigurationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DeviceKeyExistsException extends S.TaggedError<DeviceKeyExistsException>()(
  "DeviceKeyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ExpiredCodeException extends S.TaggedError<ExpiredCodeException>()(
  "ExpiredCodeException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DuplicateProviderException extends S.TaggedError<DuplicateProviderException>()(
  "DuplicateProviderException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidOAuthFlowException extends S.TaggedError<InvalidOAuthFlowException>()(
  "InvalidOAuthFlowException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidSmsRoleAccessPolicyException extends S.TaggedError<InvalidSmsRoleAccessPolicyException>()(
  "InvalidSmsRoleAccessPolicyException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidPasswordException extends S.TaggedError<InvalidPasswordException>()(
  "InvalidPasswordException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class EnableSoftwareTokenMFAException extends S.TaggedError<EnableSoftwareTokenMFAException>()(
  "EnableSoftwareTokenMFAException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RefreshTokenReuseException extends S.TaggedError<RefreshTokenReuseException>()(
  "RefreshTokenReuseException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidSmsRoleTrustRelationshipException extends S.TaggedError<InvalidSmsRoleTrustRelationshipException>()(
  "InvalidSmsRoleTrustRelationshipException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PasswordHistoryPolicyViolationException extends S.TaggedError<PasswordHistoryPolicyViolationException>()(
  "PasswordHistoryPolicyViolationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class UserNotFoundException extends S.TaggedError<UserNotFoundException>()(
  "UserNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UserPoolAddOnNotEnabledException extends S.TaggedError<UserPoolAddOnNotEnabledException>()(
  "UserPoolAddOnNotEnabledException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UserPoolTaggingException extends S.TaggedError<UserPoolTaggingException>()(
  "UserPoolTaggingException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PasswordResetRequiredException extends S.TaggedError<PasswordResetRequiredException>()(
  "PasswordResetRequiredException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedIdentityProviderException extends S.TaggedError<UnsupportedIdentityProviderException>()(
  "UnsupportedIdentityProviderException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PreconditionNotMetException extends S.TaggedError<PreconditionNotMetException>()(
  "PreconditionNotMetException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TermsExistsException extends S.TaggedError<TermsExistsException>()(
  "TermsExistsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UserImportInProgressException extends S.TaggedError<UserImportInProgressException>()(
  "UserImportInProgressException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SoftwareTokenMFANotFoundException extends S.TaggedError<SoftwareTokenMFANotFoundException>()(
  "SoftwareTokenMFANotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ManagedLoginBrandingExistsException extends S.TaggedError<ManagedLoginBrandingExistsException>()(
  "ManagedLoginBrandingExistsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class WebAuthnConfigurationMissingException extends S.TaggedError<WebAuthnConfigurationMissingException>()(
  "WebAuthnConfigurationMissingException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class WebAuthnChallengeNotFoundException extends S.TaggedError<WebAuthnChallengeNotFoundException>()(
  "WebAuthnChallengeNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyFailedAttemptsException extends S.TaggedError<TooManyFailedAttemptsException>()(
  "TooManyFailedAttemptsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ScopeDoesNotExistException extends S.TaggedError<ScopeDoesNotExistException>()(
  "ScopeDoesNotExistException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnexpectedLambdaException extends S.TaggedError<UnexpectedLambdaException>()(
  "UnexpectedLambdaException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UserNotConfirmedException extends S.TaggedError<UserNotConfirmedException>()(
  "UserNotConfirmedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class WebAuthnNotEnabledException extends S.TaggedError<WebAuthnNotEnabledException>()(
  "WebAuthnNotEnabledException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class WebAuthnClientMismatchException extends S.TaggedError<WebAuthnClientMismatchException>()(
  "WebAuthnClientMismatchException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MFAMethodNotFoundException extends S.TaggedError<MFAMethodNotFoundException>()(
  "MFAMethodNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TierChangeNotAllowedException extends S.TaggedError<TierChangeNotAllowedException>()(
  "TierChangeNotAllowedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class UsernameExistsException extends S.TaggedError<UsernameExistsException>()(
  "UsernameExistsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UserLambdaValidationException extends S.TaggedError<UserLambdaValidationException>()(
  "UserLambdaValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedTokenTypeException extends S.TaggedError<UnsupportedTokenTypeException>()(
  "UnsupportedTokenTypeException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class WebAuthnCredentialNotSupportedException extends S.TaggedError<WebAuthnCredentialNotSupportedException>()(
  "WebAuthnCredentialNotSupportedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedUserStateException extends S.TaggedError<UnsupportedUserStateException>()(
  "UnsupportedUserStateException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class WebAuthnOriginNotAllowedException extends S.TaggedError<WebAuthnOriginNotAllowedException>()(
  "WebAuthnOriginNotAllowedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class WebAuthnRelyingPartyMismatchException extends S.TaggedError<WebAuthnRelyingPartyMismatchException>()(
  "WebAuthnRelyingPartyMismatchException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Given a user pool ID, returns the signing certificate for SAML 2.0 federation.
 *
 * Issued certificates are valid for 10 years from the date of issue. Amazon Cognito issues and
 * assigns a new signing certificate annually. This renewal process returns a new value in
 * the response to `GetSigningCertificate`, but doesn't invalidate the original
 * certificate.
 *
 * For more information, see Signing SAML requests.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const getSigningCertificate: (
  input: GetSigningCertificateRequest,
) => effect.Effect<
  GetSigningCertificateResponse,
  | InternalErrorException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSigningCertificateRequest,
  output: GetSigningCertificateResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Given a user pool ID and identity provider (IdP) name, returns details about the
 * IdP.
 */
export const describeIdentityProvider: (
  input: DescribeIdentityProviderRequest,
) => effect.Effect<
  DescribeIdentityProviderResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIdentityProviderRequest,
  output: DescribeIdentityProviderResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given the ID of a managed login branding style, returns detailed information about the
 * style.
 */
export const describeManagedLoginBranding: (
  input: DescribeManagedLoginBrandingRequest,
) => effect.Effect<
  DescribeManagedLoginBrandingResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeManagedLoginBrandingRequest,
  output: DescribeManagedLoginBrandingResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Describes a resource server. For more information about resource servers, see Access control with resource servers.
 */
export const describeResourceServer: (
  input: DescribeResourceServerRequest,
) => effect.Effect<
  DescribeResourceServerResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourceServerRequest,
  output: DescribeResourceServerResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns details for the requested terms documents ID. For more information, see Terms documents.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const describeTerms: (
  input: DescribeTermsRequest,
) => effect.Effect<
  DescribeTermsResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTermsRequest,
  output: DescribeTermsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given an app client ID, returns configuration information. This operation is useful
 * when you want to inspect an existing app client and programmatically replicate the
 * configuration to another app client. For more information about app clients, see App clients.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const describeUserPoolClient: (
  input: DescribeUserPoolClientRequest,
) => effect.Effect<
  DescribeUserPoolClientResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserPoolClientRequest,
  output: DescribeUserPoolClientResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given a user pool domain name, returns information about the domain
 * configuration.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const describeUserPoolDomain: (
  input: DescribeUserPoolDomainRequest,
) => effect.Effect<
  DescribeUserPoolDomainResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserPoolDomainRequest,
  output: DescribeUserPoolDomainResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Given a user pool ID, returns the logging configuration. User pools can export
 * message-delivery error and threat-protection activity logs to external Amazon Web Services services. For more information, see Exporting user pool logs.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const getLogDeliveryConfiguration: (
  input: GetLogDeliveryConfigurationRequest,
) => effect.Effect<
  GetLogDeliveryConfigurationResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLogDeliveryConfigurationRequest,
  output: GetLogDeliveryConfigurationResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given a user pool ID or app client, returns information about classic hosted UI
 * branding that you applied, if any. Returns user-pool level branding information if no
 * app client branding is applied, or if you don't specify an app client ID. Returns
 * an empty object if you haven't applied hosted UI branding to either the client or
 * the user pool. For more information, see Hosted UI (classic) branding.
 */
export const getUICustomization: (
  input: GetUICustomizationRequest,
) => effect.Effect<
  GetUICustomizationResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUICustomizationRequest,
  output: GetUICustomizationResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given a user pool ID, returns information about configured identity providers (IdPs).
 * For more information about IdPs, see Third-party IdP sign-in.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const listIdentityProviders: {
  (
    input: ListIdentityProvidersRequest,
  ): effect.Effect<
    ListIdentityProvidersResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdentityProvidersRequest,
  ) => stream.Stream<
    ListIdentityProvidersResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdentityProvidersRequest,
  ) => stream.Stream<
    ProviderDescription,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIdentityProvidersRequest,
  output: ListIdentityProvidersResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Providers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns details about all terms documents for the requested user pool.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const listTerms: (
  input: ListTermsRequest,
) => effect.Effect<
  ListTermsResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTermsRequest,
  output: ListTermsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given a user pool ID, lists app clients. App clients are sets of rules for the access
 * that you want a user pool to grant to one application. For more information, see App clients.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const listUserPoolClients: {
  (
    input: ListUserPoolClientsRequest,
  ): effect.Effect<
    ListUserPoolClientsResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUserPoolClientsRequest,
  ) => stream.Stream<
    ListUserPoolClientsResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUserPoolClientsRequest,
  ) => stream.Stream<
    UserPoolClientDescription,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUserPoolClientsRequest,
  output: ListUserPoolClientsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "UserPoolClients",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists user pools and their details in the current Amazon Web Services account.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const listUserPools: {
  (
    input: ListUserPoolsRequest,
  ): effect.Effect<
    ListUserPoolsResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUserPoolsRequest,
  ) => stream.Stream<
    ListUserPoolsResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUserPoolsRequest,
  ) => stream.Stream<
    UserPoolDescriptionType,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUserPoolsRequest,
  output: ListUserPoolsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "UserPools",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Given a user pool ID, returns a list of users and their basic details in a user
 * pool.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const listUsers: {
  (
    input: ListUsersRequest,
  ): effect.Effect<
    ListUsersResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUsersRequest,
  ) => stream.Stream<
    ListUsersResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUsersRequest,
  ) => stream.Stream<
    UserType,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "PaginationToken",
    outputToken: "PaginationToken",
    items: "Users",
    pageSize: "Limit",
  } as const,
}));
/**
 * Given the ID of a user pool app client, returns detailed information about the style
 * assigned to the app client.
 */
export const describeManagedLoginBrandingByClient: (
  input: DescribeManagedLoginBrandingByClientRequest,
) => effect.Effect<
  DescribeManagedLoginBrandingByClientResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeManagedLoginBrandingByClientRequest,
  output: DescribeManagedLoginBrandingByClientResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Describes a user import job. For more information about user CSV import, see Importing users from a CSV file.
 */
export const describeUserImportJob: (
  input: DescribeUserImportJobRequest,
) => effect.Effect<
  DescribeUserImportJobResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserImportJobRequest,
  output: DescribeUserImportJobResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given a user pool ID, generates a comma-separated value (CSV) list populated with
 * available user attributes in the user pool. This list is the header for the CSV file
 * that determines the users in a user import job. Save the content of
 * `CSVHeader` in the response as a `.csv` file and populate it
 * with the usernames and attributes of users that you want to import. For more information
 * about CSV user import, see Importing users from a CSV file.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const getCSVHeader: (
  input: GetCSVHeaderRequest,
) => effect.Effect<
  GetCSVHeaderResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCSVHeaderRequest,
  output: GetCSVHeaderResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given a user pool ID and a group name, returns information about the user
 * group.
 *
 * For more information about user pool groups, see Adding groups to a user pool.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const getGroup: (
  input: GetGroupRequest,
) => effect.Effect<
  GetGroupResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGroupRequest,
  output: GetGroupResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given the identifier of an identity provider (IdP), for example
 * `examplecorp`, returns information about the user pool configuration for
 * that IdP. For more information about IdPs, see Third-party IdP sign-in.
 */
export const getIdentityProviderByIdentifier: (
  input: GetIdentityProviderByIdentifierRequest,
) => effect.Effect<
  GetIdentityProviderByIdentifierResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentityProviderByIdentifierRequest,
  output: GetIdentityProviderByIdentifierResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given a user pool ID, returns configuration for sign-in with WebAuthn authenticators
 * and for multi-factor authentication (MFA). This operation describes the
 * following:
 *
 * - The WebAuthn relying party (RP) ID and user-verification settings.
 *
 * - The required, optional, or disabled state of MFA for all user pool
 * users.
 *
 * - The message templates for email and SMS MFA.
 *
 * - The enabled or disabled state of time-based one-time password (TOTP)
 * MFA.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const getUserPoolMfaConfig: (
  input: GetUserPoolMfaConfigRequest,
) => effect.Effect<
  GetUserPoolMfaConfigResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserPoolMfaConfigRequest,
  output: GetUserPoolMfaConfigResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given a user pool ID, returns user pool groups and their details.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const listGroups: {
  (
    input: ListGroupsRequest,
  ): effect.Effect<
    ListGroupsResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupsRequest,
  ) => stream.Stream<
    ListGroupsResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupsRequest,
  ) => stream.Stream<
    GroupType,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Groups",
    pageSize: "Limit",
  } as const,
}));
/**
 * Given a user pool ID, returns all resource servers and their details. For more
 * information about resource servers, see Access control with resource servers.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const listResourceServers: {
  (
    input: ListResourceServersRequest,
  ): effect.Effect<
    ListResourceServersResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceServersRequest,
  ) => stream.Stream<
    ListResourceServersResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceServersRequest,
  ) => stream.Stream<
    ResourceServerType,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceServersRequest,
  output: ListResourceServersResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceServers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the tags that are assigned to an Amazon Cognito user pool. For more information, see
 * Tagging
 * resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given a user pool ID, returns user import jobs and their details. Import jobs are
 * retained in user pool configuration so that you can stage, stop, start, review, and
 * delete them. For more information about user import, see Importing users from a CSV file.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const listUserImportJobs: (
  input: ListUserImportJobsRequest,
) => effect.Effect<
  ListUserImportJobsResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUserImportJobsRequest,
  output: ListUserImportJobsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given a user pool ID and a group name, returns a list of users in the group. For more
 * information about user pool groups, see Adding groups to a user pool.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const listUsersInGroup: {
  (
    input: ListUsersInGroupRequest,
  ): effect.Effect<
    ListUsersInGroupResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUsersInGroupRequest,
  ) => stream.Stream<
    ListUsersInGroupResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUsersInGroupRequest,
  ) => stream.Stream<
    UserType,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersInGroupRequest,
  output: ListUsersInGroupResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Users",
    pageSize: "Limit",
  } as const,
}));
/**
 * Configures UI branding settings for domains with the hosted UI (classic) branding
 * version. Your user pool must have a domain. Configure a domain with .
 *
 * Set the default configuration for all clients with a `ClientId` of
 * `ALL`. When the `ClientId` value is an app client ID, the
 * settings you pass in this request apply to that app client and override the default
 * `ALL` configuration.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const setUICustomization: (
  input: SetUICustomizationRequest,
) => effect.Effect<
  SetUICustomizationResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetUICustomizationRequest,
  output: SetUICustomizationResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given the name of a user pool group, updates any of the properties for precedence,
 * IAM role, or description. For more information about user pool groups, see Adding groups to a user pool.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const updateGroup: (
  input: UpdateGroupRequest,
) => effect.Effect<
  UpdateGroupResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupRequest,
  output: UpdateGroupResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Configures the branding settings for a user pool style. This operation is the
 * programmatic option for the configuration of a style in the branding editor.
 *
 * Provides values for UI customization in a `Settings` JSON object and image
 * files in an `Assets` array.
 *
 * This operation has a 2-megabyte request-size limit and include the CSS settings and
 * image assets for your app client. Your branding settings might exceed 2MB in size. Amazon Cognito
 * doesn't require that you pass all parameters in one request and preserves existing
 * style settings that you don't specify. If your request is larger than 2MB, separate it
 * into multiple requests, each with a size smaller than the limit.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const updateManagedLoginBranding: (
  input: UpdateManagedLoginBrandingRequest,
) => effect.Effect<
  UpdateManagedLoginBrandingResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateManagedLoginBrandingRequest,
  output: UpdateManagedLoginBrandingResponse,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the name and scopes of a resource server. All other fields are read-only. For
 * more information about resource servers, see Access control with resource servers.
 *
 * If you don't provide a value for an attribute, it is set to the default
 * value.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const updateResourceServer: (
  input: UpdateResourceServerRequest,
) => effect.Effect<
  UpdateResourceServerResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceServerRequest,
  output: UpdateResourceServerResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a group from the specified user pool. When you delete a group, that group no
 * longer contributes to users' `cognito:preferred_group` or
 * `cognito:groups` claims, and no longer influence access-control decision
 * that are based on group membership. For more information about user pool groups, see
 * Adding groups to a user pool.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const deleteGroup: (
  input: DeleteGroupRequest,
) => effect.Effect<
  DeleteGroupResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a resource server. After you delete a resource server, users can no longer
 * generate access tokens with scopes that are associate with that resource server.
 *
 * Resource servers are associated with custom scopes and machine-to-machine (M2M)
 * authorization. For more information, see Access control with resource servers.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const deleteResourceServer: (
  input: DeleteResourceServerRequest,
) => effect.Effect<
  DeleteResourceServerResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceServerRequest,
  output: DeleteResourceServerResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Assigns a set of tags to an Amazon Cognito user pool. A tag is a label that you can use to
 * categorize and manage user pools in different ways, such as by purpose, owner,
 * environment, or other criteria.
 *
 * Each tag consists of a key and value, both of which you define. A key is a general
 * category for more specific values. For example, if you have two versions of a user pool,
 * one for testing and another for production, you might assign an `Environment`
 * tag key to both user pools. The value of this key might be `Test` for one
 * user pool, and `Production` for the other.
 *
 * Tags are useful for cost tracking and access control. You can activate your tags so
 * that they appear on the Billing and Cost Management console, where you can track the
 * costs associated with your user pools. In an Identity and Access Management policy, you can constrain
 * permissions for user pools based on specific tags or tag values.
 *
 * You can use this action up to 5 times per second, per account. A user pool can have as
 * many as 50 tags.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given tag IDs that you previously assigned to a user pool, removes them.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a managed login branding style. When you delete a style, you delete the
 * branding association for an app client. When an app client doesn't have a style
 * assigned, your managed login pages for that app client are nonfunctional until you
 * create a new style or switch the domain branding version.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const deleteManagedLoginBranding: (
  input: DeleteManagedLoginBrandingRequest,
) => effect.Effect<
  DeleteManagedLoginBrandingResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteManagedLoginBrandingRequest,
  output: DeleteManagedLoginBrandingResponse,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the terms documents with the requested ID from your app client.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const deleteTerms: (
  input: DeleteTermsRequest,
) => effect.Effect<
  DeleteTermsResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTermsRequest,
  output: DeleteTermsResponse,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a user pool app client. After you delete an app client, users can no longer
 * sign in to the associated application.
 */
export const deleteUserPoolClient: (
  input: DeleteUserPoolClientRequest,
) => effect.Effect<
  DeleteUserPoolClientResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserPoolClientRequest,
  output: DeleteUserPoolClientResponse,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given a user pool ID and domain identifier, deletes a user pool domain. After you
 * delete a user pool domain, your managed login pages and authorization server are no
 * longer available.
 */
export const deleteUserPoolDomain: (
  input: DeleteUserPoolDomainRequest,
) => effect.Effect<
  DeleteUserPoolDomainResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserPoolDomainRequest,
  output: DeleteUserPoolDomainResponse,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
/**
 * A user pool domain hosts managed login, an authorization server and web server for
 * authentication in your application. This operation updates the branding version for user
 * pool domains between `1` for hosted UI (classic) and `2` for
 * managed login. It also updates the SSL certificate for user pool custom domains.
 *
 * Changes to the domain branding version take up to one minute to take effect for a
 * prefix domain and up to five minutes for a custom domain.
 *
 * This operation doesn't change the name of your user pool domain. To change your
 * domain, delete it with `DeleteUserPoolDomain` and create a new domain with
 * `CreateUserPoolDomain`.
 *
 * You can pass the ARN of a new Certificate Manager certificate in this request. Typically, ACM
 * certificates automatically renew and you user pool can continue to use the same ARN. But
 * if you generate a new certificate for your custom domain name, replace the original
 * configuration with the new ARN in this request.
 *
 * ACM certificates for custom domains must be in the US East (N. Virginia)
 * Amazon Web Services Region. After you submit your request, Amazon Cognito requires up to 1 hour to distribute
 * your new certificate to your custom domain.
 *
 * For more information about adding a custom domain to your user pool, see Configuring a user pool domain.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const updateUserPoolDomain: (
  input: UpdateUserPoolDomainRequest,
) => effect.Effect<
  UpdateUserPoolDomainResponse,
  | ConcurrentModificationException
  | FeatureUnavailableInTierException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserPoolDomainRequest,
  output: UpdateUserPoolDomainResponse,
  errors: [
    ConcurrentModificationException,
    FeatureUnavailableInTierException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new group in the specified user pool. For more information about user pool
 * groups, see Adding groups to a user pool.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const createGroup: (
  input: CreateGroupRequest,
) => effect.Effect<
  CreateGroupResponse,
  | GroupExistsException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResponse,
  errors: [
    GroupExistsException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new OAuth2.0 resource server and defines custom scopes within it. Resource
 * servers are associated with custom scopes and machine-to-machine (M2M) authorization.
 * For more information, see Access control with resource servers.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const createResourceServer: (
  input: CreateResourceServerRequest,
) => effect.Effect<
  CreateResourceServerResponse,
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourceServerRequest,
  output: CreateResourceServerResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Generates a list of the currently signed-in user's registered passkey, or
 * WebAuthn, credentials.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const listWebAuthnCredentials: (
  input: ListWebAuthnCredentialsRequest,
) => effect.Effect<
  ListWebAuthnCredentialsResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWebAuthnCredentialsRequest,
  output: ListWebAuthnCredentialsResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a registered passkey, or WebAuthn, authenticator for the currently signed-in
 * user.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const deleteWebAuthnCredential: (
  input: DeleteWebAuthnCredentialRequest,
) => effect.Effect<
  DeleteWebAuthnCredentialResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWebAuthnCredentialRequest,
  output: DeleteWebAuthnCredentialResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * A user pool domain hosts managed login, an authorization server and web server for
 * authentication in your application. This operation creates a new user pool prefix domain
 * or custom domain and sets the managed login branding version. Set the branding version
 * to `1` for hosted UI (classic) or `2` for managed login. When you
 * choose a custom domain, you must provide an SSL certificate in the US East (N. Virginia)
 * Amazon Web Services Region in your request.
 *
 * Your prefix domain might take up to one minute to take effect. Your custom domain is
 * online within five minutes, but it can take up to one hour to distribute your SSL
 * certificate.
 *
 * For more information about adding a custom domain to your user pool, see Configuring a user pool domain.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const createUserPoolDomain: (
  input: CreateUserPoolDomainRequest,
) => effect.Effect<
  CreateUserPoolDomainResponse,
  | ConcurrentModificationException
  | FeatureUnavailableInTierException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserPoolDomainRequest,
  output: CreateUserPoolDomainResponse,
  errors: [
    ConcurrentModificationException,
    FeatureUnavailableInTierException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists a user's registered devices. Remembered devices are used in authentication
 * services where you offer a "Remember me" option for users who you want to permit to sign
 * in without MFA from a trusted device. Users can bypass MFA while your application
 * performs device SRP authentication on the back end. For more information, see Working with devices.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminListDevices: (
  input: AdminListDevicesRequest,
) => effect.Effect<
  AdminListDevicesResponse,
  | InternalErrorException
  | InvalidParameterException
  | InvalidUserPoolConfigurationException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminListDevicesRequest,
  output: AdminListDevicesResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    InvalidUserPoolConfigurationException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Given the device key, returns details for a user's device. For more information,
 * see Working with devices.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminGetDevice: (
  input: AdminGetDeviceRequest,
) => effect.Effect<
  AdminGetDeviceResponse,
  | InternalErrorException
  | InvalidParameterException
  | InvalidUserPoolConfigurationException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminGetDeviceRequest,
  output: AdminGetDeviceResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    InvalidUserPoolConfigurationException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds a configuration and trust relationship between a third-party identity provider
 * (IdP) and a user pool. Amazon Cognito accepts sign-in with third-party identity providers through
 * managed login and OIDC relying-party libraries. For more information, see Third-party IdP sign-in.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const createIdentityProvider: (
  input: CreateIdentityProviderRequest,
) => effect.Effect<
  CreateIdentityProviderResponse,
  | DuplicateProviderException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIdentityProviderRequest,
  output: CreateIdentityProviderResponse,
  errors: [
    DuplicateProviderException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Sets up or modifies the logging configuration of a user pool. User pools can export
 * user notification logs and, when threat protection is active, user-activity logs. For
 * more information, see Exporting user
 * pool logs.
 */
export const setLogDeliveryConfiguration: (
  input: SetLogDeliveryConfigurationRequest,
) => effect.Effect<
  SetLogDeliveryConfigurationResponse,
  | FeatureUnavailableInTierException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetLogDeliveryConfigurationRequest,
  output: SetLogDeliveryConfigurationResponse,
  errors: [
    FeatureUnavailableInTierException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the groups that a user belongs to. User pool groups are identifiers that you can
 * reference from the contents of ID and access tokens, and set preferred IAM roles for
 * identity-pool authentication. For more information, see Adding groups to a user pool.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminListGroupsForUser: {
  (
    input: AdminListGroupsForUserRequest,
  ): effect.Effect<
    AdminListGroupsForUserResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UserNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: AdminListGroupsForUserRequest,
  ) => stream.Stream<
    AdminListGroupsForUserResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UserNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: AdminListGroupsForUserRequest,
  ) => stream.Stream<
    GroupType,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UserNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: AdminListGroupsForUserRequest,
  output: AdminListGroupsForUserResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Groups",
    pageSize: "Limit",
  } as const,
}));
/**
 * Given an app client or user pool ID where threat protection is configured, describes
 * the risk configuration. This operation returns details about adaptive authentication,
 * compromised credentials, and IP-address allow- and denylists. For more information about
 * threat protection, see Threat protection.
 */
export const describeRiskConfiguration: (
  input: DescribeRiskConfigurationRequest,
) => effect.Effect<
  DescribeRiskConfigurationResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserPoolAddOnNotEnabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRiskConfigurationRequest,
  output: DescribeRiskConfigurationResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserPoolAddOnNotEnabledException,
  ],
}));
/**
 * Given a user pool ID, returns configuration information. This operation is useful when
 * you want to inspect an existing user pool and programmatically replicate the
 * configuration to another user pool.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const describeUserPool: (
  input: DescribeUserPoolRequest,
) => effect.Effect<
  DescribeUserPoolResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserPoolTaggingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserPoolRequest,
  output: DescribeUserPoolResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserPoolTaggingException,
  ],
}));
/**
 * Deletes a user pool identity provider (IdP). After you delete an IdP, users can no
 * longer sign in to your user pool through that IdP. For more information about user pool
 * IdPs, see Third-party IdP sign-in.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const deleteIdentityProvider: (
  input: DeleteIdentityProviderRequest,
) => effect.Effect<
  DeleteIdentityProviderResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnsupportedIdentityProviderException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentityProviderRequest,
  output: DeleteIdentityProviderResponse,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnsupportedIdentityProviderException,
  ],
}));
/**
 * Instructs your user pool to start importing users from a CSV file that contains their
 * usernames and attributes. For more information about importing users from a CSV file,
 * see Importing users from a CSV file.
 */
export const startUserImportJob: (
  input: StartUserImportJobRequest,
) => effect.Effect<
  StartUserImportJobResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | PreconditionNotMetException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartUserImportJobRequest,
  output: StartUserImportJobResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Modifies existing terms documents for the requested app client. When Terms and
 * conditions and Privacy policy documents are configured, the app client displays links to
 * them in the sign-up page of managed login for the app client.
 *
 * You can provide URLs for terms documents in the languages that are supported by managed login localization. Amazon Cognito directs users to the terms documents for
 * their current language, with fallback to `default` if no document exists for
 * the language.
 *
 * Each request accepts one type of terms document and a map of language-to-link for that
 * document type. You must provide both types of terms documents in at least one language
 * before Amazon Cognito displays your terms documents. Supply each type in separate
 * requests.
 *
 * For more information, see Terms documents.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const updateTerms: (
  input: UpdateTermsRequest,
) => effect.Effect<
  UpdateTermsResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TermsExistsException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTermsRequest,
  output: UpdateTermsResponse,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TermsExistsException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes a user pool. After you delete a user pool, users can no longer sign in to any
 * associated applications.
 *
 * When you delete a user pool, it's no longer visible or operational in your Amazon Web Services account. Amazon Cognito retains deleted user pools in an inactive state for 14
 * days, then begins a cleanup process that fully removes them from Amazon Web Services systems. In case
 * of accidental deletion, contact Amazon Web ServicesSupport within 14 days for restoration
 * assistance.
 *
 * Amazon Cognito begins full deletion of all resources from deleted user pools after 14 days. In
 * the case of large user pools, the cleanup process might take significant additional time
 * before all user data is permanently deleted.
 */
export const deleteUserPool: (
  input: DeleteUserPoolRequest,
) => effect.Effect<
  DeleteUserPoolResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserImportInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserPoolRequest,
  output: DeleteUserPoolResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserImportInProgressException,
  ],
}));
/**
 * Begins setup of time-based one-time password (TOTP) multi-factor authentication (MFA)
 * for a user, with a unique private key that Amazon Cognito generates and returns in the API
 * response. You can authorize an `AssociateSoftwareToken` request with either
 * the user's access token, or a session string from a challenge response that you received
 * from Amazon Cognito.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 */
export const associateSoftwareToken: (
  input: AssociateSoftwareTokenRequest,
) => effect.Effect<
  AssociateSoftwareTokenResponse,
  | ConcurrentModificationException
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | SoftwareTokenMFANotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateSoftwareTokenRequest,
  output: AssociateSoftwareTokenResponse,
  errors: [
    ConcurrentModificationException,
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    SoftwareTokenMFANotFoundException,
  ],
}));
/**
 * Creates a new set of branding settings for a user pool style and associates it with an
 * app client. This operation is the programmatic option for the creation of a new style in
 * the branding editor.
 *
 * Provides values for UI customization in a `Settings` JSON object and image
 * files in an `Assets` array. To send the JSON object `Document`
 * type parameter in `Settings`, you might need to update to the most recent
 * version of your Amazon Web Services SDK. To create a new style with default settings, set
 * `UseCognitoProvidedValues` to `true` and don't provide
 * values for any other options.
 *
 * This operation has a 2-megabyte request-size limit and include the CSS settings and
 * image assets for your app client. Your branding settings might exceed 2MB in size. Amazon Cognito
 * doesn't require that you pass all parameters in one request and preserves existing
 * style settings that you don't specify. If your request is larger than 2MB, separate it
 * into multiple requests, each with a size smaller than the limit.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const createManagedLoginBranding: (
  input: CreateManagedLoginBrandingRequest,
) => effect.Effect<
  CreateManagedLoginBrandingResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | ManagedLoginBrandingExistsException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateManagedLoginBrandingRequest,
  output: CreateManagedLoginBrandingResponse,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    ManagedLoginBrandingExistsException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an app client in a user pool. This operation sets basic and advanced
 * configuration options.
 *
 * Unlike app clients created in the console, Amazon Cognito doesn't automatically assign a
 * branding style to app clients that you configure with this API operation. Managed login and classic hosted UI pages aren't
 * available for your client until after you apply a branding style.
 *
 * If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const createUserPoolClient: (
  input: CreateUserPoolClientRequest,
) => effect.Effect<
  CreateUserPoolClientResponse,
  | FeatureUnavailableInTierException
  | InternalErrorException
  | InvalidOAuthFlowException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | ScopeDoesNotExistException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserPoolClientRequest,
  output: CreateUserPoolClientResponse,
  errors: [
    FeatureUnavailableInTierException,
    InternalErrorException,
    InvalidOAuthFlowException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    ScopeDoesNotExistException,
    TooManyRequestsException,
  ],
}));
/**
 * Sets user pool multi-factor authentication (MFA) and passkey configuration. For more
 * information about user pool MFA, see Adding MFA. For more information about WebAuthn passkeys see Authentication flows.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 */
export const setUserPoolMfaConfig: (
  input: SetUserPoolMfaConfigRequest,
) => effect.Effect<
  SetUserPoolMfaConfigResponse,
  | ConcurrentModificationException
  | FeatureUnavailableInTierException
  | InternalErrorException
  | InvalidParameterException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetUserPoolMfaConfigRequest,
  output: SetUserPoolMfaConfigResponse,
  errors: [
    ConcurrentModificationException,
    FeatureUnavailableInTierException,
    InternalErrorException,
    InvalidParameterException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Sets the specified user's password in a user pool. This operation administratively
 * sets a temporary or permanent password for a user. With this operation, you can bypass
 * self-service password changes and permit immediate sign-in with the password that you
 * set. To do this, set `Permanent` to `true`.
 *
 * You can also set a new temporary password in this request, send it to a user, and
 * require them to choose a new password on their next sign-in. To do this, set
 * `Permanent` to `false`.
 *
 * If the password is temporary, the user's `Status` becomes
 * `FORCE_CHANGE_PASSWORD`. When the user next tries to sign in, the
 * `InitiateAuth` or `AdminInitiateAuth` response includes the
 * `NEW_PASSWORD_REQUIRED` challenge. If the user doesn't sign in
 * before the temporary password expires, they can no longer sign in and you must repeat
 * this operation to set a temporary or permanent password for them.
 *
 * After the user sets a new password, or if you set a permanent password, their status
 * becomes `Confirmed`.
 *
 * `AdminSetUserPassword` can set a password for the user profile that Amazon Cognito
 * creates for third-party federated users. When you set a password, the federated user's
 * status changes from `EXTERNAL_PROVIDER` to `CONFIRMED`. A user in
 * this state can sign in as a federated user, and initiate authentication flows in the API
 * like a linked native user. They can also modify their password and attributes in
 * token-authenticated API requests like `ChangePassword` and
 * `UpdateUserAttributes`. As a best security practice and to keep users in
 * sync with your external IdP, don't set passwords on federated user profiles. To set up a
 * federated user for native sign-in with a linked native user, refer to Linking federated users to an existing user
 * profile.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminSetUserPassword: (
  input: AdminSetUserPasswordRequest,
) => effect.Effect<
  AdminSetUserPasswordResponse,
  | InternalErrorException
  | InvalidParameterException
  | InvalidPasswordException
  | NotAuthorizedException
  | PasswordHistoryPolicyViolationException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminSetUserPasswordRequest,
  output: AdminSetUserPasswordResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    InvalidPasswordException,
    NotAuthorizedException,
    PasswordHistoryPolicyViolationException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Given a username, returns details about a user profile in a user pool. You can specify
 * alias attributes in the `Username` request parameter.
 *
 * This operation contributes to your monthly active user (MAU) count for the purpose of
 * billing.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminGetUser: (
  input: AdminGetUserRequest,
) => effect.Effect<
  AdminGetUserResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminGetUserRequest,
  output: AdminGetUserResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * *This action is no longer supported.* You can use it to configure
 * only SMS MFA. You can't use it to configure time-based one-time password (TOTP) software
 * token MFA.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminSetUserSettings: (
  input: AdminSetUserSettingsRequest,
) => effect.Effect<
  AdminSetUserSettingsResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminSetUserSettingsRequest,
  output: AdminSetUserSettingsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    UserNotFoundException,
  ],
}));
/**
 * Deletes a user profile in your user pool.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminDeleteUser: (
  input: AdminDeleteUserRequest,
) => effect.Effect<
  AdminDeleteUserResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminDeleteUserRequest,
  output: AdminDeleteUserResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Deletes attribute values from a user. This operation doesn't affect tokens for
 * existing user sessions. The next ID token that the user receives will no longer have the
 * deleted attributes.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminDeleteUserAttributes: (
  input: AdminDeleteUserAttributesRequest,
) => effect.Effect<
  AdminDeleteUserAttributesResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminDeleteUserAttributesRequest,
  output: AdminDeleteUserAttributesResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Deactivates a user profile and revokes all access tokens for the user. A deactivated
 * user can't sign in, but still appears in the responses to `ListUsers`
 * API requests.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminDisableUser: (
  input: AdminDisableUserRequest,
) => effect.Effect<
  AdminDisableUserResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminDisableUserRequest,
  output: AdminDisableUserResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Activates sign-in for a user profile that previously had sign-in access
 * disabled.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminEnableUser: (
  input: AdminEnableUserRequest,
) => effect.Effect<
  AdminEnableUserResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminEnableUserRequest,
  output: AdminEnableUserResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Given a username and a group name, removes them from the group. User pool groups are
 * identifiers that you can reference from the contents of ID and access tokens, and set
 * preferred IAM roles for identity-pool authentication. For more information, see Adding groups to a user pool.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminRemoveUserFromGroup: (
  input: AdminRemoveUserFromGroupRequest,
) => effect.Effect<
  AdminRemoveUserFromGroupResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminRemoveUserFromGroupRequest,
  output: AdminRemoveUserFromGroupResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Provides the feedback for an authentication event generated by threat protection
 * features. Your response indicates that you think that the event either was from a valid
 * user or was an unwanted authentication attempt. This feedback improves the risk
 * evaluation decision for the user pool as part of Amazon Cognito threat protection.
 * To activate this setting, your user pool must be on the
 * Plus tier.
 *
 * To train the threat-protection model to recognize trusted and untrusted sign-in
 * characteristics, configure threat protection in audit-only mode and provide a mechanism
 * for users or administrators to submit feedback. Your feedback can tell Amazon Cognito that a risk
 * rating was assigned at a level you don't agree with.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminUpdateAuthEventFeedback: (
  input: AdminUpdateAuthEventFeedbackRequest,
) => effect.Effect<
  AdminUpdateAuthEventFeedbackResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | UserPoolAddOnNotEnabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminUpdateAuthEventFeedbackRequest,
  output: AdminUpdateAuthEventFeedbackResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
    UserPoolAddOnNotEnabledException,
  ],
}));
/**
 * Invalidates the identity, access, and refresh tokens that Amazon Cognito issued to a user. Call
 * this operation with your administrative credentials when your user signs out of your
 * app. This results in the following behavior.
 *
 * - Amazon Cognito no longer accepts *token-authorized* user operations
 * that you authorize with a signed-out user's access tokens. For more information,
 * see Using the Amazon Cognito user pools API and user pool
 * endpoints.
 *
 * Amazon Cognito returns an `Access Token has been revoked` error when your
 * app attempts to authorize a user pools API request with a revoked access token
 * that contains the scope `aws.cognito.signin.user.admin`.
 *
 * - Amazon Cognito no longer accepts a signed-out user's ID token in a GetId request to an identity pool with
 * `ServerSideTokenCheck` enabled for its user pool IdP
 * configuration in CognitoIdentityProvider.
 *
 * - Amazon Cognito no longer accepts a signed-out user's refresh tokens in refresh
 * requests.
 *
 * Other requests might be valid until your user's token expires. This operation
 * doesn't clear the managed login session cookie. To clear the session for
 * a user who signed in with managed login or the classic hosted UI, direct their browser
 * session to the logout endpoint.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminUserGlobalSignOut: (
  input: AdminUserGlobalSignOutRequest,
) => effect.Effect<
  AdminUserGlobalSignOutResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminUserGlobalSignOutRequest,
  output: AdminUserGlobalSignOutResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Provides the feedback for an authentication event generated by threat protection
 * features. The user's response indicates that you think that the event either was from a
 * valid user or was an unwanted authentication attempt. This feedback improves the risk
 * evaluation decision for the user pool as part of Amazon Cognito threat protection.
 * To activate this setting, your user pool must be on the
 * Plus tier.
 *
 * This operation requires a `FeedbackToken` that Amazon Cognito generates and adds to
 * notification emails when users have potentially suspicious authentication events. Users
 * invoke this operation when they select the link that corresponds to
 * `{one-click-link-valid}` or `{one-click-link-invalid}` in your
 * notification template. Because `FeedbackToken` is a required parameter, you
 * can't make requests to `UpdateAuthEventFeedback` without the contents of
 * the notification email message.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const updateAuthEventFeedback: (
  input: UpdateAuthEventFeedbackRequest,
) => effect.Effect<
  UpdateAuthEventFeedbackResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | UserPoolAddOnNotEnabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAuthEventFeedbackRequest,
  output: UpdateAuthEventFeedbackResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
    UserPoolAddOnNotEnabledException,
  ],
}));
/**
 * Prevents the user from signing in with the specified external (SAML or social)
 * identity provider (IdP). If the user that you want to deactivate is a Amazon Cognito user pools
 * native username + password user, they can't use their password to sign in. If the user
 * to deactivate is a linked external IdP user, any link between that user and an existing
 * user is removed. When the external user signs in again, and the user is no longer
 * attached to the previously linked `DestinationUser`, the user must create a
 * new user account.
 *
 * The value of `ProviderName` must match the name of a user pool IdP.
 *
 * To deactivate a local user, set `ProviderName` to `Cognito` and
 * the `ProviderAttributeName` to `Cognito_Subject`. The
 * `ProviderAttributeValue` must be user's local username.
 *
 * The `ProviderAttributeName` must always be `Cognito_Subject` for
 * social IdPs. The `ProviderAttributeValue` must always be the exact subject
 * that was used when the user was originally linked as a source user.
 *
 * For de-linking a SAML identity, there are two scenarios. If the linked identity has
 * not yet been used to sign in, the `ProviderAttributeName` and
 * `ProviderAttributeValue` must be the same values that were used for the
 * `SourceUser` when the identities were originally linked using
 * AdminLinkProviderForUser call. This is also true if the linking was done with
 * `ProviderAttributeName` set to `Cognito_Subject`. If the user
 * has already signed in, the `ProviderAttributeName` must be
 * `Cognito_Subject` and `ProviderAttributeValue` must be the
 * `NameID` from their SAML assertion.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminDisableProviderForUser: (
  input: AdminDisableProviderForUserRequest,
) => effect.Effect<
  AdminDisableProviderForUserResponse,
  | AliasExistsException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminDisableProviderForUserRequest,
  output: AdminDisableProviderForUserResponse,
  errors: [
    AliasExistsException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Links an existing user account in a user pool, or `DestinationUser`, to an
 * identity from an external IdP, or `SourceUser`, based on a specified
 * attribute name and value from the external IdP.
 *
 * This operation connects a local user profile with a user identity who hasn't yet
 * signed in from their third-party IdP. When the user signs in with their IdP, they get
 * access-control configuration from the local user profile. Linked local users can also
 * sign in with SDK-based API operations like `InitiateAuth` after they sign in
 * at least once through their IdP. For more information, see Linking federated users.
 *
 * The maximum number of federated identities linked to a user is five.
 *
 * Because this API allows a user with an external federated identity to sign in as a
 * local user, it is critical that it only be used with external IdPs and linked
 * attributes that you trust.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminLinkProviderForUser: (
  input: AdminLinkProviderForUserRequest,
) => effect.Effect<
  AdminLinkProviderForUserResponse,
  | AliasExistsException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminLinkProviderForUserRequest,
  output: AdminLinkProviderForUserResponse,
  errors: [
    AliasExistsException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Forgets, or deletes, a remembered device from a user's profile. After you forget
 * the device, the user can no longer complete device authentication with that device and
 * when applicable, must submit MFA codes again. For more information, see Working with devices.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminForgetDevice: (
  input: AdminForgetDeviceRequest,
) => effect.Effect<
  AdminForgetDeviceResponse,
  | InternalErrorException
  | InvalidParameterException
  | InvalidUserPoolConfigurationException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminForgetDeviceRequest,
  output: AdminForgetDeviceResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    InvalidUserPoolConfigurationException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Updates the status of a user's device so that it is marked as remembered or not
 * remembered for the purpose of device authentication. Device authentication is a
 * "remember me" mechanism that silently completes sign-in from trusted devices with a
 * device key instead of a user-provided MFA code. This operation changes the status of a
 * device without deleting it, so you can enable it again later. For more information about
 * device authentication, see Working with devices.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminUpdateDeviceStatus: (
  input: AdminUpdateDeviceStatusRequest,
) => effect.Effect<
  AdminUpdateDeviceStatusResponse,
  | InternalErrorException
  | InvalidParameterException
  | InvalidUserPoolConfigurationException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminUpdateDeviceStatusRequest,
  output: AdminUpdateDeviceStatusResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    InvalidUserPoolConfigurationException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Adds a user to a group. A user who is in a group can present a preferred-role claim to
 * an identity pool, and populates a `cognito:groups` claim to their access and
 * identity tokens.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminAddUserToGroup: (
  input: AdminAddUserToGroupRequest,
) => effect.Effect<
  AdminAddUserToGroupResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminAddUserToGroupRequest,
  output: AdminAddUserToGroupResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
  ],
}));
/**
 * Requests a history of user activity and any risks detected as part of Amazon Cognito threat
 * protection. For more information, see Viewing user event history.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminListUserAuthEvents: {
  (
    input: AdminListUserAuthEventsRequest,
  ): effect.Effect<
    AdminListUserAuthEventsResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UserNotFoundException
    | UserPoolAddOnNotEnabledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: AdminListUserAuthEventsRequest,
  ) => stream.Stream<
    AdminListUserAuthEventsResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UserNotFoundException
    | UserPoolAddOnNotEnabledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: AdminListUserAuthEventsRequest,
  ) => stream.Stream<
    AuthEventType,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | UserNotFoundException
    | UserPoolAddOnNotEnabledException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: AdminListUserAuthEventsRequest,
  output: AdminListUserAuthEventsResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotFoundException,
    UserPoolAddOnNotEnabledException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AuthEvents",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Configures threat protection for a user pool or app client. Sets configuration for the
 * following.
 *
 * - Responses to risks with adaptive authentication
 *
 * - Responses to vulnerable passwords with compromised-credentials
 * detection
 *
 * - Notifications to users who have had risky activity detected
 *
 * - IP-address denylist and allowlist
 *
 * To set the risk configuration for the user pool to defaults, send this request with
 * only the `UserPoolId` parameter. To reset the threat protection settings of
 * an app client to be inherited from the user pool, send `UserPoolId` and
 * `ClientId` parameters only. To change threat protection to audit-only or
 * off, update the value of `UserPoolAddOns` in an `UpdateUserPool`
 * request. To activate this setting, your user pool must be on the
 * Plus tier.
 */
export const setRiskConfiguration: (
  input: SetRiskConfigurationRequest,
) => effect.Effect<
  SetRiskConfigurationResponse,
  | CodeDeliveryFailureException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserPoolAddOnNotEnabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetRiskConfigurationRequest,
  output: SetRiskConfigurationResponse,
  errors: [
    CodeDeliveryFailureException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserPoolAddOnNotEnabledException,
  ],
}));
/**
 * Modifies the configuration and trust relationship between a third-party identity
 * provider (IdP) and a user pool. Amazon Cognito accepts sign-in with third-party identity
 * providers through managed login and OIDC relying-party libraries. For more information,
 * see Third-party IdP sign-in.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const updateIdentityProvider: (
  input: UpdateIdentityProviderRequest,
) => effect.Effect<
  UpdateIdentityProviderResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnsupportedIdentityProviderException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIdentityProviderRequest,
  output: UpdateIdentityProviderResponse,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnsupportedIdentityProviderException,
  ],
}));
/**
 * Instructs your user pool to stop a running job that's importing users from a CSV
 * file that contains their usernames and attributes. For more information about importing
 * users from a CSV file, see Importing users from a CSV file.
 */
export const stopUserImportJob: (
  input: StopUserImportJobRequest,
) => effect.Effect<
  StopUserImportJobResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | PreconditionNotMetException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopUserImportJobRequest,
  output: StopUserImportJobResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a user import job. You can import users into user pools from a comma-separated
 * values (CSV) file without adding Amazon Cognito MAU costs to your Amazon Web Services bill.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const createUserImportJob: (
  input: CreateUserImportJobRequest,
) => effect.Effect<
  CreateUserImportJobResponse,
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | PreconditionNotMetException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserImportJobRequest,
  output: CreateUserImportJobResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates terms documents for the requested app client. When Terms and conditions and
 * Privacy policy documents are configured, the app client displays links to them in the
 * sign-up page of managed login for the app client.
 *
 * You can provide URLs for terms documents in the languages that are supported by managed login localization. Amazon Cognito directs users to the terms documents for
 * their current language, with fallback to `default` if no document exists for
 * the language.
 *
 * Each request accepts one type of terms document and a map of language-to-link for that
 * document type. You must provide both types of terms documents in at least one language
 * before Amazon Cognito displays your terms documents. Supply each type in separate
 * requests.
 *
 * For more information, see Terms documents.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const createTerms: (
  input: CreateTermsRequest,
) => effect.Effect<
  CreateTermsResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TermsExistsException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTermsRequest,
  output: CreateTermsResponse,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TermsExistsException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds additional user attributes to the user pool schema. Custom attributes can be
 * mutable or immutable and have a `custom:` or `dev:` prefix. For
 * more information, see Custom attributes.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const addCustomAttributes: (
  input: AddCustomAttributesRequest,
) => effect.Effect<
  AddCustomAttributesResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserImportInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddCustomAttributesRequest,
  output: AddCustomAttributesResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserImportInProgressException,
  ],
}));
/**
 * Given a user pool app client ID, updates the configuration. To avoid setting
 * parameters to Amazon Cognito defaults, construct this API request to pass the existing
 * configuration of your app client, modified to include the changes that you want to
 * make.
 *
 * If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.
 *
 * Unlike app clients created in the console, Amazon Cognito doesn't automatically assign a
 * branding style to app clients that you configure with this API operation. Managed login and classic hosted UI pages aren't
 * available for your client until after you apply a branding style.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const updateUserPoolClient: (
  input: UpdateUserPoolClientRequest,
) => effect.Effect<
  UpdateUserPoolClientResponse,
  | ConcurrentModificationException
  | FeatureUnavailableInTierException
  | InternalErrorException
  | InvalidOAuthFlowException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | ScopeDoesNotExistException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserPoolClientRequest,
  output: UpdateUserPoolClientResponse,
  errors: [
    ConcurrentModificationException,
    FeatureUnavailableInTierException,
    InternalErrorException,
    InvalidOAuthFlowException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    ScopeDoesNotExistException,
    TooManyRequestsException,
  ],
}));
/**
 * Sets the user's multi-factor authentication (MFA) preference, including which MFA
 * options are activated, and if any are preferred. Only one factor can be set as
 * preferred. The preferred MFA factor will be used to authenticate a user if multiple
 * factors are activated. If multiple options are activated and no preference is set, a
 * challenge to choose an MFA option will be returned during sign-in.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminSetUserMFAPreference: (
  input: AdminSetUserMFAPreferenceRequest,
) => effect.Effect<
  AdminSetUserMFAPreferenceResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminSetUserMFAPreferenceRequest,
  output: AdminSetUserMFAPreferenceResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Requests credential creation options from your user pool for the currently signed-in
 * user. Returns information about the user pool, the user profile, and authentication
 * requirements. Users must provide this information in their request to enroll your
 * application with their passkey provider.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 */
export const startWebAuthnRegistration: (
  input: StartWebAuthnRegistrationRequest,
) => effect.Effect<
  StartWebAuthnRegistrationResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | TooManyRequestsException
  | WebAuthnConfigurationMissingException
  | WebAuthnNotEnabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartWebAuthnRegistrationRequest,
  output: StartWebAuthnRegistrationResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    TooManyRequestsException,
    WebAuthnConfigurationMissingException,
    WebAuthnNotEnabledException,
  ],
}));
/**
 * Updates the configuration of a user pool. To avoid setting parameters to Amazon Cognito
 * defaults, construct this API request to pass the existing configuration of your user
 * pool, modified to include the changes that you want to make.
 *
 * If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const updateUserPool: (
  input: UpdateUserPoolRequest,
) => effect.Effect<
  UpdateUserPoolResponse,
  | ConcurrentModificationException
  | FeatureUnavailableInTierException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidParameterException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TierChangeNotAllowedException
  | TooManyRequestsException
  | UserImportInProgressException
  | UserPoolTaggingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserPoolRequest,
  output: UpdateUserPoolResponse,
  errors: [
    ConcurrentModificationException,
    FeatureUnavailableInTierException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidParameterException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TierChangeNotAllowedException,
    TooManyRequestsException,
    UserImportInProgressException,
    UserPoolTaggingException,
  ],
}));
/**
 * Confirms a device that a user wants to remember. A remembered device is a "Remember me
 * on this device" option for user pools that perform authentication with the device key of
 * a trusted device in the back end, instead of a user-provided MFA code. For more
 * information about device authentication, see Working with user devices in your user pool.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const confirmDevice: (
  input: ConfirmDeviceRequest,
) => effect.Effect<
  ConfirmDeviceResponse,
  | DeviceKeyExistsException
  | ForbiddenException
  | InternalErrorException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidPasswordException
  | InvalidUserPoolConfigurationException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UsernameExistsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfirmDeviceRequest,
  output: ConfirmDeviceResponse,
  errors: [
    DeviceKeyExistsException,
    ForbiddenException,
    InternalErrorException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidPasswordException,
    InvalidUserPoolConfigurationException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UsernameExistsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Gets user attributes and and MFA settings for the currently signed-in user.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const getUser: (
  input: GetUserRequest,
) => effect.Effect<
  GetUserResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserRequest,
  output: GetUserResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Lists the authentication options for the currently signed-in user. Returns the
 * following:
 *
 * - The user's multi-factor authentication (MFA) preferences.
 *
 * - The user's options for choice-based authentication with the
 * `USER_AUTH` flow.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const getUserAuthFactors: (
  input: GetUserAuthFactorsRequest,
) => effect.Effect<
  GetUserAuthFactorsResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserAuthFactorsRequest,
  output: GetUserAuthFactorsResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Deletes the profile of the currently signed-in user. A deleted user profile can no
 * longer be used to sign in and can't be restored.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const deleteUser: (
  input: DeleteUserRequest,
) => effect.Effect<
  DeleteUserResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Deletes attributes from the currently signed-in user. For example, your application
 * can submit a request to this operation when a user wants to remove their
 * `birthdate` attribute value.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const deleteUserAttributes: (
  input: DeleteUserAttributesRequest,
) => effect.Effect<
  DeleteUserAttributesResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserAttributesRequest,
  output: DeleteUserAttributesResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Invalidates the identity, access, and refresh tokens that Amazon Cognito issued to a user. Call
 * this operation when your user signs out of your app. This results in the following
 * behavior.
 *
 * - Amazon Cognito no longer accepts *token-authorized* user operations
 * that you authorize with a signed-out user's access tokens. For more information,
 * see Using the Amazon Cognito user pools API and user pool
 * endpoints.
 *
 * Amazon Cognito returns an `Access Token has been revoked` error when your
 * app attempts to authorize a user pools API request with a revoked access token
 * that contains the scope `aws.cognito.signin.user.admin`.
 *
 * - Amazon Cognito no longer accepts a signed-out user's ID token in a GetId request to an identity pool with
 * `ServerSideTokenCheck` enabled for its user pool IdP
 * configuration in CognitoIdentityProvider.
 *
 * - Amazon Cognito no longer accepts a signed-out user's refresh tokens in refresh
 * requests.
 *
 * Other requests might be valid until your user's token expires. This operation
 * doesn't clear the managed login session cookie. To clear the session for
 * a user who signed in with managed login or the classic hosted UI, direct their browser
 * session to the logout endpoint.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const globalSignOut: (
  input: GlobalSignOutRequest,
) => effect.Effect<
  GlobalSignOutResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GlobalSignOutRequest,
  output: GlobalSignOutResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
  ],
}));
/**
 * Set the user's multi-factor authentication (MFA) method preference, including which
 * MFA factors are activated and if any are preferred. Only one factor can be set as
 * preferred. The preferred MFA factor will be used to authenticate a user if multiple
 * factors are activated. If multiple options are activated and no preference is set, a
 * challenge to choose an MFA option will be returned during sign-in. If an MFA type is
 * activated for a user, the user will be prompted for MFA during all sign-in attempts
 * unless device tracking is turned on and the device has been trusted. If you want MFA to
 * be applied selectively based on the assessed risk level of sign-in attempts, deactivate
 * MFA for users and turn on Adaptive Authentication for the user pool.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const setUserMFAPreference: (
  input: SetUserMFAPreferenceRequest,
) => effect.Effect<
  SetUserMFAPreferenceResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetUserMFAPreferenceRequest,
  output: SetUserMFAPreferenceResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * *This action is no longer supported.* You can use it to configure
 * only SMS MFA. You can't use it to configure time-based one-time password (TOTP) software
 * token or email MFA.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const setUserSettings: (
  input: SetUserSettingsRequest,
) => effect.Effect<
  SetUserSettingsResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetUserSettingsRequest,
  output: SetUserSettingsResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Given a device key, returns information about a remembered device for the current
 * user. For more information about device authentication, see Working with user devices in your user pool.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const getDevice: (
  input: GetDeviceRequest,
) => effect.Effect<
  GetDeviceResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | InvalidUserPoolConfigurationException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceRequest,
  output: GetDeviceResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    InvalidUserPoolConfigurationException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Lists the devices that Amazon Cognito has registered to the currently signed-in user. For more
 * information about device authentication, see Working with user devices in your user pool.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const listDevices: (
  input: ListDevicesRequest,
) => effect.Effect<
  ListDevicesResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | InvalidUserPoolConfigurationException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDevicesRequest,
  output: ListDevicesResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    InvalidUserPoolConfigurationException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Given a device key, deletes a remembered device as the currently signed-in user. For
 * more information about device authentication, see Working with user devices in your user pool.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const forgetDevice: (
  input: ForgetDeviceRequest,
) => effect.Effect<
  ForgetDeviceResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | InvalidUserPoolConfigurationException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ForgetDeviceRequest,
  output: ForgetDeviceResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    InvalidUserPoolConfigurationException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Updates the status of a the currently signed-in user's device so that it is
 * marked as remembered or not remembered for the purpose of device authentication. Device
 * authentication is a "remember me" mechanism that silently completes sign-in from trusted
 * devices with a device key instead of a user-provided MFA code. This operation changes
 * the status of a device without deleting it, so you can enable it again later. For more
 * information about device authentication, see Working with devices.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const updateDeviceStatus: (
  input: UpdateDeviceStatusRequest,
) => effect.Effect<
  UpdateDeviceStatusResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | InvalidUserPoolConfigurationException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDeviceStatusRequest,
  output: UpdateDeviceStatusResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    InvalidUserPoolConfigurationException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Registers the current user's time-based one-time password (TOTP) authenticator
 * with a code generated in their authenticator app from a private key that's supplied
 * by your user pool. Marks the user's software token MFA status as "verified" if
 * successful. The request takes an access token or a session string, but not both.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const verifySoftwareToken: (
  input: VerifySoftwareTokenRequest,
) => effect.Effect<
  VerifySoftwareTokenResponse,
  | CodeMismatchException
  | EnableSoftwareTokenMFAException
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | InvalidUserPoolConfigurationException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | SoftwareTokenMFANotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifySoftwareTokenRequest,
  output: VerifySoftwareTokenResponse,
  errors: [
    CodeMismatchException,
    EnableSoftwareTokenMFAException,
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    InvalidUserPoolConfigurationException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    SoftwareTokenMFANotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Submits a verification code for a signed-in user who has added or changed a value of
 * an auto-verified attribute. When successful, the user's attribute becomes verified
 * and the attribute `email_verified` or `phone_number_verified`
 * becomes `true`.
 *
 * If your user pool requires verification before Amazon Cognito updates the attribute value,
 * this operation updates the affected attribute to its pending value.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const verifyUserAttribute: (
  input: VerifyUserAttributeRequest,
) => effect.Effect<
  VerifyUserAttributeResponse,
  | AliasExistsException
  | CodeMismatchException
  | ExpiredCodeException
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyUserAttributeRequest,
  output: VerifyUserAttributeResponse,
  errors: [
    AliasExistsException,
    CodeMismatchException,
    ExpiredCodeException,
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Changes the password for the currently signed-in user.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const changePassword: (
  input: ChangePasswordRequest,
) => effect.Effect<
  ChangePasswordResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | InvalidPasswordException
  | LimitExceededException
  | NotAuthorizedException
  | PasswordHistoryPolicyViolationException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ChangePasswordRequest,
  output: ChangePasswordResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    InvalidPasswordException,
    LimitExceededException,
    NotAuthorizedException,
    PasswordHistoryPolicyViolationException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Creates a new Amazon Cognito user pool. This operation sets basic and advanced configuration
 * options.
 *
 * If you don't provide a value for an attribute, Amazon Cognito sets it to its default value.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const createUserPool: (
  input: CreateUserPoolRequest,
) => effect.Effect<
  CreateUserPoolResponse,
  | FeatureUnavailableInTierException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidParameterException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | LimitExceededException
  | NotAuthorizedException
  | TierChangeNotAllowedException
  | TooManyRequestsException
  | UserPoolTaggingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserPoolRequest,
  output: CreateUserPoolResponse,
  errors: [
    FeatureUnavailableInTierException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidParameterException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    LimitExceededException,
    NotAuthorizedException,
    TierChangeNotAllowedException,
    TooManyRequestsException,
    UserPoolTaggingException,
  ],
}));
/**
 * Given a refresh token, issues new ID, access, and optionally refresh tokens for the
 * user who owns the submitted token. This operation issues a new refresh token and
 * invalidates the original refresh token after an optional grace period when refresh token
 * rotation is enabled. If refresh token rotation is disabled, issues new ID and access
 * tokens only.
 */
export const getTokensFromRefreshToken: (
  input: GetTokensFromRefreshTokenRequest,
) => effect.Effect<
  GetTokensFromRefreshTokenResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | NotAuthorizedException
  | RefreshTokenReuseException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTokensFromRefreshTokenRequest,
  output: GetTokensFromRefreshTokenResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    NotAuthorizedException,
    RefreshTokenReuseException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotFoundException,
  ],
}));
/**
 * Revokes all of the access tokens generated by, and at the same time as, the specified
 * refresh token. After a token is revoked, you can't use the revoked token to access Amazon Cognito
 * user APIs, or to authorize access to your resource server.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const revokeToken: (
  input: RevokeTokenRequest,
) => effect.Effect<
  RevokeTokenResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | TooManyRequestsException
  | UnauthorizedException
  | UnsupportedOperationException
  | UnsupportedTokenTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeTokenRequest,
  output: RevokeTokenResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    TooManyRequestsException,
    UnauthorizedException,
    UnsupportedOperationException,
    UnsupportedTokenTypeException,
  ],
}));
/**
 * Creates a new user in the specified user pool.
 *
 * If `MessageAction` isn't set, the default is to send a welcome message via
 * email or phone (SMS).
 *
 * This message is based on a template that you configured in your call to create or
 * update a user pool. This template includes your custom sign-up instructions and
 * placeholders for user name and temporary password.
 *
 * Alternatively, you can call `AdminCreateUser` with `SUPPRESS`
 * for the `MessageAction` parameter, and Amazon Cognito won't send any email.
 *
 * In either case, if the user has a password, they will be in the
 * `FORCE_CHANGE_PASSWORD` state until they sign in and set their password.
 * Your invitation message template must have the `{####}` password placeholder
 * if your users have passwords. If your template doesn't have this placeholder, Amazon Cognito
 * doesn't deliver the invitation message. In this case, you must update your message
 * template and resend the password with a new `AdminCreateUser` request with a
 * `MessageAction` value of `RESEND`.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminCreateUser: (
  input: AdminCreateUserRequest,
) => effect.Effect<
  AdminCreateUserResponse,
  | CodeDeliveryFailureException
  | InternalErrorException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidPasswordException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | NotAuthorizedException
  | PreconditionNotMetException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UnsupportedUserStateException
  | UserLambdaValidationException
  | UsernameExistsException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminCreateUserRequest,
  output: AdminCreateUserResponse,
  errors: [
    CodeDeliveryFailureException,
    InternalErrorException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidPasswordException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    NotAuthorizedException,
    PreconditionNotMetException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UnsupportedUserStateException,
    UserLambdaValidationException,
    UsernameExistsException,
    UserNotFoundException,
  ],
}));
/**
 * Begins the password reset process. Sets the requested user’s account into a
 * `RESET_REQUIRED` status, and sends them a password-reset code. Your user
 * pool also sends the user a notification with a reset code and the information that their
 * password has been reset. At sign-in, your application or the managed login session
 * receives a challenge to complete the reset by confirming the code and setting a new
 * password.
 *
 * To use this API operation, your user pool must have self-service account recovery
 * configured.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminResetUserPassword: (
  input: AdminResetUserPasswordRequest,
) => effect.Effect<
  AdminResetUserPasswordResponse,
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminResetUserPasswordRequest,
  output: AdminResetUserPasswordResponse,
  errors: [
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotFoundException,
  ],
}));
/**
 * Confirms the account of a new user. This public API operation submits a code that
 * Amazon Cognito sent to your user when they signed up in your user pool. After your user enters
 * their code, they confirm ownership of the email address or phone number that they
 * provided, and their user account becomes active. Depending on your user pool
 * configuration, your users will receive their confirmation code in an email or SMS
 * message.
 *
 * Local users who signed up in your user pool are the only type of user who can confirm
 * sign-up with a code. Users who federate through an external identity provider (IdP) have
 * already been confirmed by their IdP.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const confirmSignUp: (
  input: ConfirmSignUpRequest,
) => effect.Effect<
  ConfirmSignUpResponse,
  | AliasExistsException
  | CodeMismatchException
  | ExpiredCodeException
  | ForbiddenException
  | InternalErrorException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyFailedAttemptsException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfirmSignUpRequest,
  output: ConfirmSignUpResponse,
  errors: [
    AliasExistsException,
    CodeMismatchException,
    ExpiredCodeException,
    ForbiddenException,
    InternalErrorException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyFailedAttemptsException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotFoundException,
  ],
}));
/**
 * Updates the currently signed-in user's attributes. To delete an attribute from
 * the user, submit the attribute in your API request with a blank value.
 *
 * For custom attributes, you must add a `custom:` prefix to the attribute
 * name, for example `custom:department`.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 */
export const updateUserAttributes: (
  input: UpdateUserAttributesRequest,
) => effect.Effect<
  UpdateUserAttributesResponse,
  | AliasExistsException
  | CodeDeliveryFailureException
  | CodeMismatchException
  | ExpiredCodeException
  | ForbiddenException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserAttributesRequest,
  output: UpdateUserAttributesResponse,
  errors: [
    AliasExistsException,
    CodeDeliveryFailureException,
    CodeMismatchException,
    ExpiredCodeException,
    ForbiddenException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Resends the code that confirms a new account for a user who has signed up in your user
 * pool. Amazon Cognito sends confirmation codes to the user attribute in the
 * `AutoVerifiedAttributes` property of your user pool. When you prompt new
 * users for the confirmation code, include a "Resend code" option that generates a call to
 * this API operation.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 */
export const resendConfirmationCode: (
  input: ResendConfirmationCodeRequest,
) => effect.Effect<
  ResendConfirmationCodeResponse,
  | CodeDeliveryFailureException
  | ForbiddenException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResendConfirmationCodeRequest,
  output: ResendConfirmationCodeResponse,
  errors: [
    CodeDeliveryFailureException,
    ForbiddenException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotFoundException,
  ],
}));
/**
 * Sends a password-reset confirmation code to the email address or phone number of the
 * requested username. The message delivery method is determined by the user's
 * available attributes and the `AccountRecoverySetting` configuration of the
 * user pool.
 *
 * For the `Username` parameter, you can use the username or an email, phone,
 * or preferred username alias.
 *
 * If neither a verified phone number nor a verified email exists, Amazon Cognito responds with an
 * `InvalidParameterException` error . If your app client has a client
 * secret and you don't provide a `SECRET_HASH` parameter, this API returns
 * `NotAuthorizedException`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 */
export const forgotPassword: (
  input: ForgotPasswordRequest,
) => effect.Effect<
  ForgotPasswordResponse,
  | CodeDeliveryFailureException
  | ForbiddenException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ForgotPasswordRequest,
  output: ForgotPasswordResponse,
  errors: [
    CodeDeliveryFailureException,
    ForbiddenException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotFoundException,
  ],
}));
/**
 * Updates the specified user's attributes. To delete an attribute from your user,
 * submit the attribute in your API request with a blank value.
 *
 * For custom attributes, you must add a `custom:` prefix to the attribute
 * name, for example `custom:department`.
 *
 * This operation can set a user's email address or phone number as verified and
 * permit immediate sign-in in user pools that require verification of these attributes. To
 * do this, set the `email_verified` or `phone_number_verified`
 * attribute to `true`.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 */
export const adminUpdateUserAttributes: (
  input: AdminUpdateUserAttributesRequest,
) => effect.Effect<
  AdminUpdateUserAttributesResponse,
  | AliasExistsException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminUpdateUserAttributesRequest,
  output: AdminUpdateUserAttributesResponse,
  errors: [
    AliasExistsException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotFoundException,
  ],
}));
/**
 * Given an attribute name, sends a user attribute verification code for the specified
 * attribute name to the currently signed-in user.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 */
export const getUserAttributeVerificationCode: (
  input: GetUserAttributeVerificationCodeRequest,
) => effect.Effect<
  GetUserAttributeVerificationCodeResponse,
  | CodeDeliveryFailureException
  | ForbiddenException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | LimitExceededException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserAttributeVerificationCodeRequest,
  output: GetUserAttributeVerificationCodeResponse,
  errors: [
    CodeDeliveryFailureException,
    ForbiddenException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    LimitExceededException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Declares an authentication flow and initiates sign-in for a user in the Amazon Cognito user
 * directory. Amazon Cognito might respond with an additional challenge or an
 * `AuthenticationResult` that contains the outcome of a successful
 * authentication. You can't sign in a user with a federated IdP with
 * `InitiateAuth`. For more information, see Authentication.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 */
export const initiateAuth: (
  input: InitiateAuthRequest,
) => effect.Effect<
  InitiateAuthResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | InvalidUserPoolConfigurationException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UnsupportedOperationException
  | UserLambdaValidationException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitiateAuthRequest,
  output: InitiateAuthResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    InvalidUserPoolConfigurationException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UnsupportedOperationException,
    UserLambdaValidationException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Registers a user with an app client and requests a user name, password, and user
 * attributes in the user pool.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 *
 * You might receive a `LimitExceeded` exception in response to this request
 * if you have exceeded a rate quota for email or SMS messages, and if your user pool
 * automatically verifies email addresses or phone numbers. When you get this exception in
 * the response, the user is successfully created and is in an `UNCONFIRMED`
 * state.
 */
export const signUp: (
  input: SignUpRequest,
) => effect.Effect<
  SignUpResponse,
  | CodeDeliveryFailureException
  | ForbiddenException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidPasswordException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UsernameExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SignUpRequest,
  output: SignUpResponse,
  errors: [
    CodeDeliveryFailureException,
    ForbiddenException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidPasswordException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UsernameExistsException,
  ],
}));
/**
 * This public API operation accepts a confirmation code that Amazon Cognito sent to a user and
 * accepts a new password for that user.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 */
export const confirmForgotPassword: (
  input: ConfirmForgotPasswordRequest,
) => effect.Effect<
  ConfirmForgotPasswordResponse,
  | CodeMismatchException
  | ExpiredCodeException
  | ForbiddenException
  | InternalErrorException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidPasswordException
  | LimitExceededException
  | NotAuthorizedException
  | PasswordHistoryPolicyViolationException
  | ResourceNotFoundException
  | TooManyFailedAttemptsException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConfirmForgotPasswordRequest,
  output: ConfirmForgotPasswordResponse,
  errors: [
    CodeMismatchException,
    ExpiredCodeException,
    ForbiddenException,
    InternalErrorException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidPasswordException,
    LimitExceededException,
    NotAuthorizedException,
    PasswordHistoryPolicyViolationException,
    ResourceNotFoundException,
    TooManyFailedAttemptsException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Confirms user sign-up as an administrator.
 *
 * This request sets a user account active in a user pool that requires confirmation of new user accounts before they can sign in. You can
 * configure your user pool to not send confirmation codes to new users and instead confirm
 * them with this API operation on the back end.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 *
 * To configure your user pool to require administrative confirmation of users, set
 * `AllowAdminCreateUserOnly` to `true` in a
 * `CreateUserPool` or `UpdateUserPool` request.
 */
export const adminConfirmSignUp: (
  input: AdminConfirmSignUpRequest,
) => effect.Effect<
  AdminConfirmSignUpResponse,
  | InternalErrorException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyFailedAttemptsException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminConfirmSignUpRequest,
  output: AdminConfirmSignUpResponse,
  errors: [
    InternalErrorException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyFailedAttemptsException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotFoundException,
  ],
}));
/**
 * Some API operations in a user pool generate a challenge, like a prompt for an MFA
 * code, for device authentication that bypasses MFA, or for a custom authentication
 * challenge. A `RespondToAuthChallenge` API request provides the answer to that
 * challenge, like a code or a secure remote password (SRP). The parameters of a response
 * to an authentication challenge vary with the type of challenge.
 *
 * For more information about custom authentication challenges, see Custom
 * authentication challenge Lambda triggers.
 *
 * Amazon Cognito doesn't evaluate Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you can't use IAM credentials to authorize requests, and you can't
 * grant IAM permissions in policies. For more information about authorization models in
 * Amazon Cognito, see Using the Amazon Cognito user pools API and user pool endpoints.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 */
export const respondToAuthChallenge: (
  input: RespondToAuthChallengeRequest,
) => effect.Effect<
  RespondToAuthChallengeResponse,
  | AliasExistsException
  | CodeMismatchException
  | ExpiredCodeException
  | ForbiddenException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidPasswordException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | InvalidUserPoolConfigurationException
  | MFAMethodNotFoundException
  | NotAuthorizedException
  | PasswordHistoryPolicyViolationException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | SoftwareTokenMFANotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RespondToAuthChallengeRequest,
  output: RespondToAuthChallengeResponse,
  errors: [
    AliasExistsException,
    CodeMismatchException,
    ExpiredCodeException,
    ForbiddenException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidPasswordException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    InvalidUserPoolConfigurationException,
    MFAMethodNotFoundException,
    NotAuthorizedException,
    PasswordHistoryPolicyViolationException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    SoftwareTokenMFANotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Some API operations in a user pool generate a challenge, like a prompt for an MFA
 * code, for device authentication that bypasses MFA, or for a custom authentication
 * challenge. An `AdminRespondToAuthChallenge` API request provides the answer
 * to that challenge, like a code or a secure remote password (SRP). The parameters of a
 * response to an authentication challenge vary with the type of challenge.
 *
 * For more information about custom authentication challenges, see Custom
 * authentication challenge Lambda triggers.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminRespondToAuthChallenge: (
  input: AdminRespondToAuthChallengeRequest,
) => effect.Effect<
  AdminRespondToAuthChallengeResponse,
  | AliasExistsException
  | CodeMismatchException
  | ExpiredCodeException
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidPasswordException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | InvalidUserPoolConfigurationException
  | MFAMethodNotFoundException
  | NotAuthorizedException
  | PasswordHistoryPolicyViolationException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | SoftwareTokenMFANotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UserLambdaValidationException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminRespondToAuthChallengeRequest,
  output: AdminRespondToAuthChallengeResponse,
  errors: [
    AliasExistsException,
    CodeMismatchException,
    ExpiredCodeException,
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidPasswordException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    InvalidUserPoolConfigurationException,
    MFAMethodNotFoundException,
    NotAuthorizedException,
    PasswordHistoryPolicyViolationException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    SoftwareTokenMFANotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UserLambdaValidationException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Starts sign-in for applications with a server-side component, for example a
 * traditional web application. This operation specifies the authentication flow that
 * you'd like to begin. The authentication flow that you specify must be supported in
 * your app client configuration. For more information about authentication flows, see
 * Authentication flows.
 *
 * This action might generate an SMS text message. Starting June 1, 2021, US telecom carriers
 * require you to register an origination phone number before you can send SMS messages
 * to US phone numbers. If you use SMS text messages in Amazon Cognito, you must register a
 * phone number with Amazon Pinpoint.
 * Amazon Cognito uses the registered number automatically. Otherwise, Amazon Cognito users who must
 * receive SMS messages might not be able to sign up, activate their accounts, or sign
 * in.
 *
 * If you have never used SMS text messages with Amazon Cognito or any other Amazon Web Services service,
 * Amazon Simple Notification Service might place your account in the SMS sandbox. In
 * sandbox
 * mode
 * , you can send messages only to verified phone
 * numbers. After you test your app while in the sandbox environment, you can move out
 * of the sandbox and into production. For more information, see SMS message settings for Amazon Cognito user pools in the Amazon Cognito
 * Developer Guide.
 *
 * Amazon Cognito evaluates Identity and Access Management (IAM) policies in requests for this API operation. For
 * this operation, you must use IAM credentials to authorize requests, and you must
 * grant yourself the corresponding IAM permission in a policy.
 *
 * **Learn more**
 *
 * - Signing Amazon Web Services API Requests
 *
 * - Using the Amazon Cognito user pools API and user pool endpoints
 */
export const adminInitiateAuth: (
  input: AdminInitiateAuthRequest,
) => effect.Effect<
  AdminInitiateAuthResponse,
  | InternalErrorException
  | InvalidEmailRoleAccessPolicyException
  | InvalidLambdaResponseException
  | InvalidParameterException
  | InvalidSmsRoleAccessPolicyException
  | InvalidSmsRoleTrustRelationshipException
  | InvalidUserPoolConfigurationException
  | MFAMethodNotFoundException
  | NotAuthorizedException
  | PasswordResetRequiredException
  | ResourceNotFoundException
  | TooManyRequestsException
  | UnexpectedLambdaException
  | UnsupportedOperationException
  | UserLambdaValidationException
  | UserNotConfirmedException
  | UserNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AdminInitiateAuthRequest,
  output: AdminInitiateAuthResponse,
  errors: [
    InternalErrorException,
    InvalidEmailRoleAccessPolicyException,
    InvalidLambdaResponseException,
    InvalidParameterException,
    InvalidSmsRoleAccessPolicyException,
    InvalidSmsRoleTrustRelationshipException,
    InvalidUserPoolConfigurationException,
    MFAMethodNotFoundException,
    NotAuthorizedException,
    PasswordResetRequiredException,
    ResourceNotFoundException,
    TooManyRequestsException,
    UnexpectedLambdaException,
    UnsupportedOperationException,
    UserLambdaValidationException,
    UserNotConfirmedException,
    UserNotFoundException,
  ],
}));
/**
 * Completes registration of a passkey authenticator for the currently signed-in
 * user.
 *
 * Authorize this action with a signed-in user's access token. It must include the scope `aws.cognito.signin.user.admin`.
 */
export const completeWebAuthnRegistration: (
  input: CompleteWebAuthnRegistrationRequest,
) => effect.Effect<
  CompleteWebAuthnRegistrationResponse,
  | ForbiddenException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | TooManyRequestsException
  | WebAuthnChallengeNotFoundException
  | WebAuthnClientMismatchException
  | WebAuthnCredentialNotSupportedException
  | WebAuthnNotEnabledException
  | WebAuthnOriginNotAllowedException
  | WebAuthnRelyingPartyMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompleteWebAuthnRegistrationRequest,
  output: CompleteWebAuthnRegistrationResponse,
  errors: [
    ForbiddenException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    TooManyRequestsException,
    WebAuthnChallengeNotFoundException,
    WebAuthnClientMismatchException,
    WebAuthnCredentialNotSupportedException,
    WebAuthnNotEnabledException,
    WebAuthnOriginNotAllowedException,
    WebAuthnRelyingPartyMismatchException,
  ],
}));

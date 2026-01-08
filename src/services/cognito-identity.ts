import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials as Creds } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace(
  "http://cognito-identity.amazonaws.com/doc/2014-06-30/",
);
const svc = T.AwsApiService({
  sdkId: "Cognito Identity",
  serviceShapeName: "AWSCognitoIdentityService",
});
const auth = T.AwsAuthSigv4({ name: "cognito-identity" });
const ver = T.ServiceVersion("2014-06-30");
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
              return e("https://cognito-identity-fips.us-east-1.amazonaws.com");
            }
            if (Region === "us-east-2") {
              return e("https://cognito-identity-fips.us-east-2.amazonaws.com");
            }
            if (Region === "us-west-1") {
              return e("https://cognito-identity-fips.us-west-1.amazonaws.com");
            }
            if (Region === "us-west-2") {
              return e("https://cognito-identity-fips.us-west-2.amazonaws.com");
            }
            return e(
              `https://cognito-identity-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://cognito-identity-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            if ("aws" === _.getAttr(PartitionResult, "name")) {
              return e(`https://cognito-identity.${Region}.amazonaws.com`);
            }
            return e(
              `https://cognito-identity.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cognito-identity.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type IdentityPoolName = string;
export type IdentityPoolUnauthenticated = boolean;
export type ClassicFlow = boolean;
export type DeveloperProviderName = string;
export type ARNString = string;
export type IdentityId = string;
export type IdentityPoolId = string;
export type AccountId = string;
export type TokenDuration = number;
export type IdentityProviderName = string;
export type QueryLimit = number;
export type PaginationKey = string;
export type HideDisabled = boolean;
export type DeveloperUserIdentifier = string;
export type UseDefaults = boolean;
export type TagKeysType = string;
export type IdentityProviderId = string;
export type CognitoIdentityProviderName = string;
export type CognitoIdentityProviderClientId = string;
export type CognitoIdentityProviderTokenCheck = boolean;
export type TagValueType = string;
export type IdentityProviderToken = string | redacted.Redacted<string>;
export type PrincipalTagID = string;
export type PrincipalTagValue = string;
export type RoleType = string;
export type OIDCToken = string | redacted.Redacted<string>;
export type ClaimName = string;
export type ClaimValue = string;
export type AccessKeyString = string;
export type SecretKeyString = string | redacted.Redacted<string>;
export type SessionTokenString = string;

//# Schemas
export type OIDCProviderList = string[];
export const OIDCProviderList = S.Array(S.String);
export type SAMLProviderList = string[];
export const SAMLProviderList = S.Array(S.String);
export type IdentityIdList = string[];
export const IdentityIdList = S.Array(S.String);
export type LoginsList = string[];
export const LoginsList = S.Array(S.String);
export type IdentityPoolTagsListType = string[];
export const IdentityPoolTagsListType = S.Array(S.String);
export interface DeleteIdentitiesInput {
  IdentityIdsToDelete: string[];
}
export const DeleteIdentitiesInput = S.suspend(() =>
  S.Struct({ IdentityIdsToDelete: IdentityIdList }).pipe(
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
  identifier: "DeleteIdentitiesInput",
}) as any as S.Schema<DeleteIdentitiesInput>;
export interface DeleteIdentityPoolInput {
  IdentityPoolId: string;
}
export const DeleteIdentityPoolInput = S.suspend(() =>
  S.Struct({ IdentityPoolId: S.String }).pipe(
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
  identifier: "DeleteIdentityPoolInput",
}) as any as S.Schema<DeleteIdentityPoolInput>;
export interface DeleteIdentityPoolResponse {}
export const DeleteIdentityPoolResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteIdentityPoolResponse",
}) as any as S.Schema<DeleteIdentityPoolResponse>;
export interface DescribeIdentityInput {
  IdentityId: string;
}
export const DescribeIdentityInput = S.suspend(() =>
  S.Struct({ IdentityId: S.String }).pipe(
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
  identifier: "DescribeIdentityInput",
}) as any as S.Schema<DescribeIdentityInput>;
export interface DescribeIdentityPoolInput {
  IdentityPoolId: string;
}
export const DescribeIdentityPoolInput = S.suspend(() =>
  S.Struct({ IdentityPoolId: S.String }).pipe(
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
  identifier: "DescribeIdentityPoolInput",
}) as any as S.Schema<DescribeIdentityPoolInput>;
export type LoginsMap = { [key: string]: string | redacted.Redacted<string> };
export const LoginsMap = S.Record({ key: S.String, value: SensitiveString });
export interface GetIdInput {
  AccountId?: string;
  IdentityPoolId: string;
  Logins?: { [key: string]: string | redacted.Redacted<string> };
}
export const GetIdInput = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    IdentityPoolId: S.String,
    Logins: S.optional(LoginsMap),
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
).annotations({ identifier: "GetIdInput" }) as any as S.Schema<GetIdInput>;
export interface GetIdentityPoolRolesInput {
  IdentityPoolId: string;
}
export const GetIdentityPoolRolesInput = S.suspend(() =>
  S.Struct({ IdentityPoolId: S.String }).pipe(
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
  identifier: "GetIdentityPoolRolesInput",
}) as any as S.Schema<GetIdentityPoolRolesInput>;
export interface GetOpenIdTokenInput {
  IdentityId: string;
  Logins?: { [key: string]: string | redacted.Redacted<string> };
}
export const GetOpenIdTokenInput = S.suspend(() =>
  S.Struct({ IdentityId: S.String, Logins: S.optional(LoginsMap) }).pipe(
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
  identifier: "GetOpenIdTokenInput",
}) as any as S.Schema<GetOpenIdTokenInput>;
export interface GetPrincipalTagAttributeMapInput {
  IdentityPoolId: string;
  IdentityProviderName: string;
}
export const GetPrincipalTagAttributeMapInput = S.suspend(() =>
  S.Struct({ IdentityPoolId: S.String, IdentityProviderName: S.String }).pipe(
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
  identifier: "GetPrincipalTagAttributeMapInput",
}) as any as S.Schema<GetPrincipalTagAttributeMapInput>;
export interface ListIdentitiesInput {
  IdentityPoolId: string;
  MaxResults: number;
  NextToken?: string;
  HideDisabled?: boolean;
}
export const ListIdentitiesInput = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String,
    MaxResults: S.Number,
    NextToken: S.optional(S.String),
    HideDisabled: S.optional(S.Boolean),
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
  identifier: "ListIdentitiesInput",
}) as any as S.Schema<ListIdentitiesInput>;
export interface ListIdentityPoolsInput {
  MaxResults: number;
  NextToken?: string;
}
export const ListIdentityPoolsInput = S.suspend(() =>
  S.Struct({ MaxResults: S.Number, NextToken: S.optional(S.String) }).pipe(
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
  identifier: "ListIdentityPoolsInput",
}) as any as S.Schema<ListIdentityPoolsInput>;
export interface ListTagsForResourceInput {
  ResourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
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
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface LookupDeveloperIdentityInput {
  IdentityPoolId: string;
  IdentityId?: string;
  DeveloperUserIdentifier?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const LookupDeveloperIdentityInput = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String,
    IdentityId: S.optional(S.String),
    DeveloperUserIdentifier: S.optional(S.String),
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
  identifier: "LookupDeveloperIdentityInput",
}) as any as S.Schema<LookupDeveloperIdentityInput>;
export interface MergeDeveloperIdentitiesInput {
  SourceUserIdentifier: string;
  DestinationUserIdentifier: string;
  DeveloperProviderName: string;
  IdentityPoolId: string;
}
export const MergeDeveloperIdentitiesInput = S.suspend(() =>
  S.Struct({
    SourceUserIdentifier: S.String,
    DestinationUserIdentifier: S.String,
    DeveloperProviderName: S.String,
    IdentityPoolId: S.String,
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
  identifier: "MergeDeveloperIdentitiesInput",
}) as any as S.Schema<MergeDeveloperIdentitiesInput>;
export type PrincipalTags = { [key: string]: string };
export const PrincipalTags = S.Record({ key: S.String, value: S.String });
export interface SetPrincipalTagAttributeMapInput {
  IdentityPoolId: string;
  IdentityProviderName: string;
  UseDefaults?: boolean;
  PrincipalTags?: { [key: string]: string };
}
export const SetPrincipalTagAttributeMapInput = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String,
    IdentityProviderName: S.String,
    UseDefaults: S.optional(S.Boolean),
    PrincipalTags: S.optional(PrincipalTags),
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
  identifier: "SetPrincipalTagAttributeMapInput",
}) as any as S.Schema<SetPrincipalTagAttributeMapInput>;
export type IdentityPoolTagsType = { [key: string]: string };
export const IdentityPoolTagsType = S.Record({
  key: S.String,
  value: S.String,
});
export interface TagResourceInput {
  ResourceArn: string;
  Tags: { [key: string]: string };
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: IdentityPoolTagsType }).pipe(
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
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UnlinkDeveloperIdentityInput {
  IdentityId: string;
  IdentityPoolId: string;
  DeveloperProviderName: string;
  DeveloperUserIdentifier: string;
}
export const UnlinkDeveloperIdentityInput = S.suspend(() =>
  S.Struct({
    IdentityId: S.String,
    IdentityPoolId: S.String,
    DeveloperProviderName: S.String,
    DeveloperUserIdentifier: S.String,
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
  identifier: "UnlinkDeveloperIdentityInput",
}) as any as S.Schema<UnlinkDeveloperIdentityInput>;
export interface UnlinkDeveloperIdentityResponse {}
export const UnlinkDeveloperIdentityResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UnlinkDeveloperIdentityResponse",
}) as any as S.Schema<UnlinkDeveloperIdentityResponse>;
export interface UnlinkIdentityInput {
  IdentityId: string;
  Logins: { [key: string]: string | redacted.Redacted<string> };
  LoginsToRemove: string[];
}
export const UnlinkIdentityInput = S.suspend(() =>
  S.Struct({
    IdentityId: S.String,
    Logins: LoginsMap,
    LoginsToRemove: LoginsList,
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
  identifier: "UnlinkIdentityInput",
}) as any as S.Schema<UnlinkIdentityInput>;
export interface UnlinkIdentityResponse {}
export const UnlinkIdentityResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UnlinkIdentityResponse",
}) as any as S.Schema<UnlinkIdentityResponse>;
export interface UntagResourceInput {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: IdentityPoolTagsListType }).pipe(
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
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type IdentityProviders = { [key: string]: string };
export const IdentityProviders = S.Record({ key: S.String, value: S.String });
export interface CognitoIdentityProvider {
  ProviderName?: string;
  ClientId?: string;
  ServerSideTokenCheck?: boolean;
}
export const CognitoIdentityProvider = S.suspend(() =>
  S.Struct({
    ProviderName: S.optional(S.String),
    ClientId: S.optional(S.String),
    ServerSideTokenCheck: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CognitoIdentityProvider",
}) as any as S.Schema<CognitoIdentityProvider>;
export type CognitoIdentityProviderList = CognitoIdentityProvider[];
export const CognitoIdentityProviderList = S.Array(CognitoIdentityProvider);
export interface IdentityPool {
  IdentityPoolId: string;
  IdentityPoolName: string;
  AllowUnauthenticatedIdentities: boolean;
  AllowClassicFlow?: boolean;
  SupportedLoginProviders?: { [key: string]: string };
  DeveloperProviderName?: string;
  OpenIdConnectProviderARNs?: string[];
  CognitoIdentityProviders?: CognitoIdentityProvider[];
  SamlProviderARNs?: string[];
  IdentityPoolTags?: { [key: string]: string };
}
export const IdentityPool = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String,
    IdentityPoolName: S.String,
    AllowUnauthenticatedIdentities: S.Boolean,
    AllowClassicFlow: S.optional(S.Boolean),
    SupportedLoginProviders: S.optional(IdentityProviders),
    DeveloperProviderName: S.optional(S.String),
    OpenIdConnectProviderARNs: S.optional(OIDCProviderList),
    CognitoIdentityProviders: S.optional(CognitoIdentityProviderList),
    SamlProviderARNs: S.optional(SAMLProviderList),
    IdentityPoolTags: S.optional(IdentityPoolTagsType),
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
).annotations({ identifier: "IdentityPool" }) as any as S.Schema<IdentityPool>;
export interface IdentityDescription {
  IdentityId?: string;
  Logins?: string[];
  CreationDate?: Date;
  LastModifiedDate?: Date;
}
export const IdentityDescription = S.suspend(() =>
  S.Struct({
    IdentityId: S.optional(S.String),
    Logins: S.optional(LoginsList),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "IdentityDescription",
}) as any as S.Schema<IdentityDescription>;
export type IdentitiesList = IdentityDescription[];
export const IdentitiesList = S.Array(IdentityDescription);
export type DeveloperUserIdentifierList = string[];
export const DeveloperUserIdentifierList = S.Array(S.String);
export type RolesMap = { [key: string]: string };
export const RolesMap = S.Record({ key: S.String, value: S.String });
export type RoleMappingType = "Token" | "Rules";
export const RoleMappingType = S.Literal("Token", "Rules");
export type AmbiguousRoleResolutionType = "AuthenticatedRole" | "Deny";
export const AmbiguousRoleResolutionType = S.Literal(
  "AuthenticatedRole",
  "Deny",
);
export interface CreateIdentityPoolInput {
  IdentityPoolName: string;
  AllowUnauthenticatedIdentities: boolean;
  AllowClassicFlow?: boolean;
  SupportedLoginProviders?: { [key: string]: string };
  DeveloperProviderName?: string;
  OpenIdConnectProviderARNs?: string[];
  CognitoIdentityProviders?: CognitoIdentityProvider[];
  SamlProviderARNs?: string[];
  IdentityPoolTags?: { [key: string]: string };
}
export const CreateIdentityPoolInput = S.suspend(() =>
  S.Struct({
    IdentityPoolName: S.String,
    AllowUnauthenticatedIdentities: S.Boolean,
    AllowClassicFlow: S.optional(S.Boolean),
    SupportedLoginProviders: S.optional(IdentityProviders),
    DeveloperProviderName: S.optional(S.String),
    OpenIdConnectProviderARNs: S.optional(OIDCProviderList),
    CognitoIdentityProviders: S.optional(CognitoIdentityProviderList),
    SamlProviderARNs: S.optional(SAMLProviderList),
    IdentityPoolTags: S.optional(IdentityPoolTagsType),
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
  identifier: "CreateIdentityPoolInput",
}) as any as S.Schema<CreateIdentityPoolInput>;
export interface GetCredentialsForIdentityInput {
  IdentityId: string;
  Logins?: { [key: string]: string | redacted.Redacted<string> };
  CustomRoleArn?: string;
}
export const GetCredentialsForIdentityInput = S.suspend(() =>
  S.Struct({
    IdentityId: S.String,
    Logins: S.optional(LoginsMap),
    CustomRoleArn: S.optional(S.String),
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
  identifier: "GetCredentialsForIdentityInput",
}) as any as S.Schema<GetCredentialsForIdentityInput>;
export interface GetIdResponse {
  IdentityId?: string;
}
export const GetIdResponse = S.suspend(() =>
  S.Struct({ IdentityId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetIdResponse",
}) as any as S.Schema<GetIdResponse>;
export type MappingRuleMatchType =
  | "Equals"
  | "Contains"
  | "StartsWith"
  | "NotEqual";
export const MappingRuleMatchType = S.Literal(
  "Equals",
  "Contains",
  "StartsWith",
  "NotEqual",
);
export interface MappingRule {
  Claim: string;
  MatchType: MappingRuleMatchType;
  Value: string;
  RoleARN: string;
}
export const MappingRule = S.suspend(() =>
  S.Struct({
    Claim: S.String,
    MatchType: MappingRuleMatchType,
    Value: S.String,
    RoleARN: S.String,
  }),
).annotations({ identifier: "MappingRule" }) as any as S.Schema<MappingRule>;
export type MappingRulesList = MappingRule[];
export const MappingRulesList = S.Array(MappingRule);
export interface RulesConfigurationType {
  Rules: MappingRule[];
}
export const RulesConfigurationType = S.suspend(() =>
  S.Struct({ Rules: MappingRulesList }),
).annotations({
  identifier: "RulesConfigurationType",
}) as any as S.Schema<RulesConfigurationType>;
export interface RoleMapping {
  Type: RoleMappingType;
  AmbiguousRoleResolution?: AmbiguousRoleResolutionType;
  RulesConfiguration?: RulesConfigurationType;
}
export const RoleMapping = S.suspend(() =>
  S.Struct({
    Type: RoleMappingType,
    AmbiguousRoleResolution: S.optional(AmbiguousRoleResolutionType),
    RulesConfiguration: S.optional(RulesConfigurationType),
  }),
).annotations({ identifier: "RoleMapping" }) as any as S.Schema<RoleMapping>;
export type RoleMappingMap = { [key: string]: RoleMapping };
export const RoleMappingMap = S.Record({ key: S.String, value: RoleMapping });
export interface GetIdentityPoolRolesResponse {
  IdentityPoolId?: string;
  Roles?: { [key: string]: string };
  RoleMappings?: { [key: string]: RoleMapping };
}
export const GetIdentityPoolRolesResponse = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.optional(S.String),
    Roles: S.optional(RolesMap),
    RoleMappings: S.optional(RoleMappingMap),
  }).pipe(ns),
).annotations({
  identifier: "GetIdentityPoolRolesResponse",
}) as any as S.Schema<GetIdentityPoolRolesResponse>;
export interface GetOpenIdTokenResponse {
  IdentityId?: string;
  Token?: string | redacted.Redacted<string>;
}
export const GetOpenIdTokenResponse = S.suspend(() =>
  S.Struct({
    IdentityId: S.optional(S.String),
    Token: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "GetOpenIdTokenResponse",
}) as any as S.Schema<GetOpenIdTokenResponse>;
export interface GetOpenIdTokenForDeveloperIdentityInput {
  IdentityPoolId: string;
  IdentityId?: string;
  Logins: { [key: string]: string | redacted.Redacted<string> };
  PrincipalTags?: { [key: string]: string };
  TokenDuration?: number;
}
export const GetOpenIdTokenForDeveloperIdentityInput = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String,
    IdentityId: S.optional(S.String),
    Logins: LoginsMap,
    PrincipalTags: S.optional(PrincipalTags),
    TokenDuration: S.optional(S.Number),
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
  identifier: "GetOpenIdTokenForDeveloperIdentityInput",
}) as any as S.Schema<GetOpenIdTokenForDeveloperIdentityInput>;
export interface GetPrincipalTagAttributeMapResponse {
  IdentityPoolId?: string;
  IdentityProviderName?: string;
  UseDefaults?: boolean;
  PrincipalTags?: { [key: string]: string };
}
export const GetPrincipalTagAttributeMapResponse = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.optional(S.String),
    IdentityProviderName: S.optional(S.String),
    UseDefaults: S.optional(S.Boolean),
    PrincipalTags: S.optional(PrincipalTags),
  }).pipe(ns),
).annotations({
  identifier: "GetPrincipalTagAttributeMapResponse",
}) as any as S.Schema<GetPrincipalTagAttributeMapResponse>;
export interface ListIdentitiesResponse {
  IdentityPoolId?: string;
  Identities?: IdentityDescription[];
  NextToken?: string;
}
export const ListIdentitiesResponse = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.optional(S.String),
    Identities: S.optional(IdentitiesList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListIdentitiesResponse",
}) as any as S.Schema<ListIdentitiesResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(IdentityPoolTagsType) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface LookupDeveloperIdentityResponse {
  IdentityId?: string;
  DeveloperUserIdentifierList?: string[];
  NextToken?: string;
}
export const LookupDeveloperIdentityResponse = S.suspend(() =>
  S.Struct({
    IdentityId: S.optional(S.String),
    DeveloperUserIdentifierList: S.optional(DeveloperUserIdentifierList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "LookupDeveloperIdentityResponse",
}) as any as S.Schema<LookupDeveloperIdentityResponse>;
export interface MergeDeveloperIdentitiesResponse {
  IdentityId?: string;
}
export const MergeDeveloperIdentitiesResponse = S.suspend(() =>
  S.Struct({ IdentityId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "MergeDeveloperIdentitiesResponse",
}) as any as S.Schema<MergeDeveloperIdentitiesResponse>;
export interface SetPrincipalTagAttributeMapResponse {
  IdentityPoolId?: string;
  IdentityProviderName?: string;
  UseDefaults?: boolean;
  PrincipalTags?: { [key: string]: string };
}
export const SetPrincipalTagAttributeMapResponse = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.optional(S.String),
    IdentityProviderName: S.optional(S.String),
    UseDefaults: S.optional(S.Boolean),
    PrincipalTags: S.optional(PrincipalTags),
  }).pipe(ns),
).annotations({
  identifier: "SetPrincipalTagAttributeMapResponse",
}) as any as S.Schema<SetPrincipalTagAttributeMapResponse>;
export type ErrorCode = "AccessDenied" | "InternalServerError";
export const ErrorCode = S.Literal("AccessDenied", "InternalServerError");
export interface UnprocessedIdentityId {
  IdentityId?: string;
  ErrorCode?: ErrorCode;
}
export const UnprocessedIdentityId = S.suspend(() =>
  S.Struct({
    IdentityId: S.optional(S.String),
    ErrorCode: S.optional(ErrorCode),
  }),
).annotations({
  identifier: "UnprocessedIdentityId",
}) as any as S.Schema<UnprocessedIdentityId>;
export type UnprocessedIdentityIdList = UnprocessedIdentityId[];
export const UnprocessedIdentityIdList = S.Array(UnprocessedIdentityId);
export interface IdentityPoolShortDescription {
  IdentityPoolId?: string;
  IdentityPoolName?: string;
}
export const IdentityPoolShortDescription = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.optional(S.String),
    IdentityPoolName: S.optional(S.String),
  }),
).annotations({
  identifier: "IdentityPoolShortDescription",
}) as any as S.Schema<IdentityPoolShortDescription>;
export type IdentityPoolsList = IdentityPoolShortDescription[];
export const IdentityPoolsList = S.Array(IdentityPoolShortDescription);
export interface DeleteIdentitiesResponse {
  UnprocessedIdentityIds?: UnprocessedIdentityId[];
}
export const DeleteIdentitiesResponse = S.suspend(() =>
  S.Struct({
    UnprocessedIdentityIds: S.optional(UnprocessedIdentityIdList),
  }).pipe(ns),
).annotations({
  identifier: "DeleteIdentitiesResponse",
}) as any as S.Schema<DeleteIdentitiesResponse>;
export interface GetOpenIdTokenForDeveloperIdentityResponse {
  IdentityId?: string;
  Token?: string | redacted.Redacted<string>;
}
export const GetOpenIdTokenForDeveloperIdentityResponse = S.suspend(() =>
  S.Struct({
    IdentityId: S.optional(S.String),
    Token: S.optional(SensitiveString),
  }).pipe(ns),
).annotations({
  identifier: "GetOpenIdTokenForDeveloperIdentityResponse",
}) as any as S.Schema<GetOpenIdTokenForDeveloperIdentityResponse>;
export interface ListIdentityPoolsResponse {
  IdentityPools?: IdentityPoolShortDescription[];
  NextToken?: string;
}
export const ListIdentityPoolsResponse = S.suspend(() =>
  S.Struct({
    IdentityPools: S.optional(IdentityPoolsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListIdentityPoolsResponse",
}) as any as S.Schema<ListIdentityPoolsResponse>;
export interface Credentials {
  AccessKeyId?: string;
  SecretKey?: string | redacted.Redacted<string>;
  SessionToken?: string;
  Expiration?: Date;
}
export const Credentials = S.suspend(() =>
  S.Struct({
    AccessKeyId: S.optional(S.String),
    SecretKey: S.optional(SensitiveString),
    SessionToken: S.optional(S.String),
    Expiration: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Credentials" }) as any as S.Schema<Credentials>;
export interface GetCredentialsForIdentityResponse {
  IdentityId?: string;
  Credentials?: Credentials;
}
export const GetCredentialsForIdentityResponse = S.suspend(() =>
  S.Struct({
    IdentityId: S.optional(S.String),
    Credentials: S.optional(Credentials),
  }).pipe(ns),
).annotations({
  identifier: "GetCredentialsForIdentityResponse",
}) as any as S.Schema<GetCredentialsForIdentityResponse>;
export interface SetIdentityPoolRolesInput {
  IdentityPoolId: string;
  Roles: { [key: string]: string };
  RoleMappings?: { [key: string]: RoleMapping };
}
export const SetIdentityPoolRolesInput = S.suspend(() =>
  S.Struct({
    IdentityPoolId: S.String,
    Roles: RolesMap,
    RoleMappings: S.optional(RoleMappingMap),
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
  identifier: "SetIdentityPoolRolesInput",
}) as any as S.Schema<SetIdentityPoolRolesInput>;
export interface SetIdentityPoolRolesResponse {}
export const SetIdentityPoolRolesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetIdentityPoolRolesResponse",
}) as any as S.Schema<SetIdentityPoolRolesResponse>;

//# Errors
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { message: S.optional(S.String) },
) {}
export class ExternalServiceException extends S.TaggedError<ExternalServiceException>()(
  "ExternalServiceException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class DeveloperUserAlreadyRegisteredException extends S.TaggedError<DeveloperUserAlreadyRegisteredException>()(
  "DeveloperUserAlreadyRegisteredException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidIdentityPoolConfigurationException extends S.TaggedError<InvalidIdentityPoolConfigurationException>()(
  "InvalidIdentityPoolConfigurationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}

//# Operations
/**
 * Deletes identities from an identity pool. You can specify a list of 1-60 identities
 * that you want to delete.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const deleteIdentities: (
  input: DeleteIdentitiesInput,
) => effect.Effect<
  DeleteIdentitiesResponse,
  | InternalErrorException
  | InvalidParameterException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentitiesInput,
  output: DeleteIdentitiesResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an identity pool. Once a pool is deleted, users will not be able to
 * authenticate with the pool.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const deleteIdentityPool: (
  input: DeleteIdentityPoolInput,
) => effect.Effect<
  DeleteIdentityPoolResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentityPoolInput,
  output: DeleteIdentityPoolResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Registers (or retrieves) a Cognito `IdentityId` and an OpenID Connect
 * token for a user authenticated by your backend authentication process. Supplying multiple
 * logins will create an implicit linked account. You can only specify one developer provider
 * as part of the `Logins` map, which is linked to the identity pool. The developer
 * provider is the "domain" by which Cognito will refer to your users.
 *
 * You can use `GetOpenIdTokenForDeveloperIdentity` to create a new identity
 * and to link new logins (that is, user credentials issued by a public provider or developer
 * provider) to an existing identity. When you want to create a new identity, the
 * `IdentityId` should be null. When you want to associate a new login with an
 * existing authenticated/unauthenticated identity, you can do so by providing the existing
 * `IdentityId`. This API will create the identity in the specified
 * `IdentityPoolId`.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const getOpenIdTokenForDeveloperIdentity: (
  input: GetOpenIdTokenForDeveloperIdentityInput,
) => effect.Effect<
  GetOpenIdTokenForDeveloperIdentityResponse,
  | DeveloperUserAlreadyRegisteredException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOpenIdTokenForDeveloperIdentityInput,
  output: GetOpenIdTokenForDeveloperIdentityResponse,
  errors: [
    DeveloperUserAlreadyRegisteredException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Sets the roles for an identity pool. These roles are used when making calls to GetCredentialsForIdentity action.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const setIdentityPoolRoles: (
  input: SetIdentityPoolRolesInput,
) => effect.Effect<
  SetIdentityPoolRolesResponse,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetIdentityPoolRolesInput,
  output: SetIdentityPoolRolesResponse,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists all of the Cognito identity pools registered for your account.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const listIdentityPools: {
  (
    input: ListIdentityPoolsInput,
  ): effect.Effect<
    ListIdentityPoolsResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIdentityPoolsInput,
  ) => stream.Stream<
    ListIdentityPoolsResponse,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIdentityPoolsInput,
  ) => stream.Stream<
    IdentityPoolShortDescription,
    | InternalErrorException
    | InvalidParameterException
    | NotAuthorizedException
    | ResourceNotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIdentityPoolsInput,
  output: ListIdentityPoolsResponse,
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
    items: "IdentityPools",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns metadata related to the given identity, including when the identity was
 * created and any associated linked logins.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const describeIdentity: (
  input: DescribeIdentityInput,
) => effect.Effect<
  IdentityDescription,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIdentityInput,
  output: IdentityDescription,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Use `GetPrincipalTagAttributeMap` to list all mappings between
 * `PrincipalTags` and user attributes.
 */
export const getPrincipalTagAttributeMap: (
  input: GetPrincipalTagAttributeMapInput,
) => effect.Effect<
  GetPrincipalTagAttributeMapResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPrincipalTagAttributeMapInput,
  output: GetPrincipalTagAttributeMapResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the identities in an identity pool.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const listIdentities: (
  input: ListIdentitiesInput,
) => effect.Effect<
  ListIdentitiesResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIdentitiesInput,
  output: ListIdentitiesResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Lists the tags that are assigned to an Amazon Cognito identity pool.
 *
 * A tag is a label that you can apply to identity pools to categorize and manage them in
 * different ways, such as by purpose, owner, environment, or other criteria.
 *
 * You can use this action up to 10 times per second, per account.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
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
 * You can use this operation to use default (username and clientID) attribute or custom
 * attribute mappings.
 */
export const setPrincipalTagAttributeMap: (
  input: SetPrincipalTagAttributeMapInput,
) => effect.Effect<
  SetPrincipalTagAttributeMapResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetPrincipalTagAttributeMapInput,
  output: SetPrincipalTagAttributeMapResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets details about a particular identity pool, including the pool name, ID
 * description, creation date, and current number of users.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const describeIdentityPool: (
  input: DescribeIdentityPoolInput,
) => effect.Effect<
  IdentityPool,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIdentityPoolInput,
  output: IdentityPool,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Assigns a set of tags to the specified Amazon Cognito identity pool. A tag is a label
 * that you can use to categorize and manage identity pools in different ways, such as by
 * purpose, owner, environment, or other criteria.
 *
 * Each tag consists of a key and value, both of which you define. A key is a general
 * category for more specific values. For example, if you have two versions of an identity
 * pool, one for testing and another for production, you might assign an
 * `Environment` tag key to both identity pools. The value of this key might be
 * `Test` for one identity pool and `Production` for the
 * other.
 *
 * Tags are useful for cost tracking and access control. You can activate your tags so that
 * they appear on the Billing and Cost Management console, where you can track the costs
 * associated with your identity pools. In an IAM policy, you can constrain
 * permissions for identity pools based on specific tags or tag values.
 *
 * You can use this action up to 5 times per second, per account. An identity pool can have
 * as many as 50 tags.
 */
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
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
 * Removes the specified tags from the specified Amazon Cognito identity pool. You can use
 * this action up to 5 times per second, per account
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
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
 * Updates the configuration of an identity pool.
 *
 * If you don't provide a value for a parameter, Amazon Cognito sets it to its default value.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const updateIdentityPool: (
  input: IdentityPool,
) => effect.Effect<
  IdentityPool,
  | ConcurrentModificationException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IdentityPool,
  output: IdentityPool,
  errors: [
    ConcurrentModificationException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the roles for an identity pool.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const getIdentityPoolRoles: (
  input: GetIdentityPoolRolesInput,
) => effect.Effect<
  GetIdentityPoolRolesResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdentityPoolRolesInput,
  output: GetIdentityPoolRolesResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the `IdentityID` associated with a
 * `DeveloperUserIdentifier` or the list of `DeveloperUserIdentifier`
 * values associated with an `IdentityId` for an existing identity. Either
 * `IdentityID` or `DeveloperUserIdentifier` must not be null. If you
 * supply only one of these values, the other value will be searched in the database and
 * returned as a part of the response. If you supply both,
 * `DeveloperUserIdentifier` will be matched against `IdentityID`. If
 * the values are verified against the database, the response returns both values and is the
 * same as the request. Otherwise, a `ResourceConflictException` is
 * thrown.
 *
 * `LookupDeveloperIdentity` is intended for low-throughput control plane
 * operations: for example, to enable customer service to locate an identity ID by username.
 * If you are using it for higher-volume operations such as user authentication, your requests
 * are likely to be throttled. GetOpenIdTokenForDeveloperIdentity is a
 * better option for higher-volume operations for user authentication.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const lookupDeveloperIdentity: (
  input: LookupDeveloperIdentityInput,
) => effect.Effect<
  LookupDeveloperIdentityResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: LookupDeveloperIdentityInput,
  output: LookupDeveloperIdentityResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Merges two users having different `IdentityId`s, existing in the same
 * identity pool, and identified by the same developer provider. You can use this action to
 * request that discrete users be merged and identified as a single user in the Cognito
 * environment. Cognito associates the given source user (`SourceUserIdentifier`)
 * with the `IdentityId` of the `DestinationUserIdentifier`. Only
 * developer-authenticated users can be merged. If the users to be merged are associated with
 * the same public provider, but as two different users, an exception will be
 * thrown.
 *
 * The number of linked logins is limited to 20. So, the number of linked logins for the
 * source user, `SourceUserIdentifier`, and the destination user,
 * `DestinationUserIdentifier`, together should not be larger than 20.
 * Otherwise, an exception will be thrown.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const mergeDeveloperIdentities: (
  input: MergeDeveloperIdentitiesInput,
) => effect.Effect<
  MergeDeveloperIdentitiesResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MergeDeveloperIdentitiesInput,
  output: MergeDeveloperIdentitiesResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Unlinks a federated identity from an existing account. Unlinked logins will be
 * considered new identities next time they are seen. Removing the last linked login will make
 * this identity inaccessible.
 *
 * This is a public API. You do not need any credentials to call this API.
 */
export const unlinkIdentity: (
  input: UnlinkIdentityInput,
) => effect.Effect<
  UnlinkIdentityResponse,
  | ExternalServiceException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnlinkIdentityInput,
  output: UnlinkIdentityResponse,
  errors: [
    ExternalServiceException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Unlinks a `DeveloperUserIdentifier` from an existing identity. Unlinked
 * developer users will be considered new identities next time they are seen. If, for a given
 * Cognito identity, you remove all federated identities as well as the developer user
 * identifier, the Cognito identity becomes inaccessible.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const unlinkDeveloperIdentity: (
  input: UnlinkDeveloperIdentityInput,
) => effect.Effect<
  UnlinkDeveloperIdentityResponse,
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnlinkDeveloperIdentityInput,
  output: UnlinkDeveloperIdentityResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets an OpenID token, using a known Cognito ID. This known Cognito ID is returned by
 * GetId. You can optionally add additional logins for the identity.
 * Supplying multiple logins creates an implicit link.
 *
 * The OpenID token is valid for 10 minutes.
 *
 * This is a public API. You do not need any credentials to call this API.
 */
export const getOpenIdToken: (
  input: GetOpenIdTokenInput,
) => effect.Effect<
  GetOpenIdTokenResponse,
  | ExternalServiceException
  | InternalErrorException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOpenIdTokenInput,
  output: GetOpenIdTokenResponse,
  errors: [
    ExternalServiceException,
    InternalErrorException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a new identity pool. The identity pool is a store of user identity
 * information that is specific to your Amazon Web Services account. The keys for
 * `SupportedLoginProviders` are as follows:
 *
 * - Facebook: `graph.facebook.com`
 *
 * - Google: `accounts.google.com`
 *
 * - Sign in With Apple: `appleid.apple.com`
 *
 * - Amazon: `www.amazon.com`
 *
 * - Twitter: `api.twitter.com`
 *
 * - Digits: `www.digits.com`
 *
 * If you don't provide a value for a parameter, Amazon Cognito sets it to its default value.
 *
 * You must use Amazon Web Services developer credentials to call this
 * operation.
 */
export const createIdentityPool: (
  input: CreateIdentityPoolInput,
) => effect.Effect<
  IdentityPool,
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceConflictException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIdentityPoolInput,
  output: IdentityPool,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceConflictException,
    TooManyRequestsException,
  ],
}));
/**
 * Generates (or retrieves) IdentityID. Supplying multiple logins will create an
 * implicit linked account.
 *
 * This is a public API. You do not need any credentials to call this API.
 */
export const getId: (
  input: GetIdInput,
) => effect.Effect<
  GetIdResponse,
  | ExternalServiceException
  | InternalErrorException
  | InvalidParameterException
  | LimitExceededException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdInput,
  output: GetIdResponse,
  errors: [
    ExternalServiceException,
    InternalErrorException,
    InvalidParameterException,
    LimitExceededException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns credentials for the provided identity ID. Any provided logins will be
 * validated against supported login providers. If the token is for
 * `cognito-identity.amazonaws.com`, it will be passed through to Security Token Service with the appropriate role for the token.
 *
 * This is a public API. You do not need any credentials to call this API.
 */
export const getCredentialsForIdentity: (
  input: GetCredentialsForIdentityInput,
) => effect.Effect<
  GetCredentialsForIdentityResponse,
  | ExternalServiceException
  | InternalErrorException
  | InvalidIdentityPoolConfigurationException
  | InvalidParameterException
  | NotAuthorizedException
  | ResourceConflictException
  | ResourceNotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCredentialsForIdentityInput,
  output: GetCredentialsForIdentityResponse,
  errors: [
    ExternalServiceException,
    InternalErrorException,
    InvalidIdentityPoolConfigurationException,
    InvalidParameterException,
    NotAuthorizedException,
    ResourceConflictException,
    ResourceNotFoundException,
    TooManyRequestsException,
  ],
}));

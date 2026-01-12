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
const ns = T.XmlNamespace("http://waf.amazonaws.com/doc/2019-07-29/");
const svc = T.AwsApiService({
  sdkId: "WAFV2",
  serviceShapeName: "AWSWAF_20190729",
});
const auth = T.AwsAuthSigv4({ name: "wafv2" });
const ver = T.ServiceVersion("2019-07-29");
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
            return e(
              `https://wafv2-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://wafv2-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://wafv2.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://wafv2.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceArn = string;
export type TokenDomain = string;
export type EntityName = string;
export type EntityDescription = string;
export type IPAddress = string;
export type CapacityUnit = number;
export type APIKey = string;
export type LockToken = string;
export type EntityId = string;
export type VendorName = string;
export type VersionKeyString = string;
export type MetricName = string;
export type ListMaxItems = number;
export type NextMarker = string;
export type PaginationLimit = number;
export type PolicyString = string;
export type TagKey = string;
export type RulePriority = number;
export type TagValue = string;
export type RegexPatternString = string;
export type ErrorMessage = string;
export type LabelName = string;
export type DownloadUrl = string;
export type OutputUrl = string;
export type ResponseContent = string;
export type TimeWindowSecond = number;
export type AttributeName = string;
export type AttributeValue = string;
export type TimeWindowDay = number;
export type PricingPlanFeatureName = string;
export type RequiredPricingPlanName = string;
export type ProductId = string;
export type ProductLink = string;
export type ProductTitle = string;
export type ProductDescription = string;
export type ReleaseNotes = string;
export type ConsumedCapacity = number;
export type APIKeyVersion = number;
export type SearchString = Uint8Array;
export type Size = number;
export type RateLimit = number;
export type EvaluationWindowSec = number;
export type LabelMatchKey = string;
export type ASN = number;
export type ResponseStatusCode = number;
export type FieldToProtectKeyName = string;
export type FieldToMatchData = string;
export type ParameterExceptionParameter = string;
export type ErrorReason = string;
export type PopulationSize = number;
export type TextTransformationPriority = number;
export type ForwardedIPHeaderName = string;
export type LoginPathString = string;
export type CustomHTTPHeaderName = string;
export type CustomHTTPHeaderValue = string;
export type JsonPointerPath = string;
export type SingleCookieName = string;
export type SampleWeight = number;
export type Action = string;
export type LabelNamespace = string;
export type FieldIdentifier = string;
export type EnableMachineLearning = boolean;
export type CreationPathString = string;
export type RegistrationPagePathString = string;
export type SourceType = string;
export type IPString = string;
export type Country = string;
export type URIString = string;
export type HTTPMethod = string;
export type HTTPVersion = string;
export type HeaderName = string;
export type HeaderValue = string;
export type ResponseCode = number;
export type SolveTimestamp = number;
export type SuccessCode = number;
export type FailureCode = number;
export type ResponseInspectionHeaderName = string;
export type SuccessValue = string;
export type FailureValue = string;

//# Schemas
export type Scope = "CLOUDFRONT" | "REGIONAL" | (string & {});
export const Scope = S.String;
export type APIKeyTokenDomains = string[];
export const APIKeyTokenDomains = S.Array(S.String);
export type IPAddressVersion = "IPV4" | "IPV6" | (string & {});
export const IPAddressVersion = S.String;
export type IPAddresses = string[];
export const IPAddresses = S.Array(S.String);
export type TokenDomains = string[];
export const TokenDomains = S.Array(S.String);
export type LogType = "WAF_LOGS" | (string & {});
export const LogType = S.String;
export type LogScope =
  | "CUSTOMER"
  | "SECURITY_LAKE"
  | "CLOUDWATCH_TELEMETRY_RULE_MANAGED"
  | (string & {});
export const LogScope = S.String;
export type Platform = "IOS" | "ANDROID" | (string & {});
export const Platform = S.String;
export type ResourceType =
  | "APPLICATION_LOAD_BALANCER"
  | "API_GATEWAY"
  | "APPSYNC"
  | "COGNITO_USER_POOL"
  | "APP_RUNNER_SERVICE"
  | "VERIFIED_ACCESS_INSTANCE"
  | "AMPLIFY"
  | (string & {});
export const ResourceType = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateWebACLRequest {
  WebACLArn: string;
  ResourceArn: string;
}
export const AssociateWebACLRequest = S.suspend(() =>
  S.Struct({ WebACLArn: S.String, ResourceArn: S.String }).pipe(
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
  identifier: "AssociateWebACLRequest",
}) as any as S.Schema<AssociateWebACLRequest>;
export interface AssociateWebACLResponse {}
export const AssociateWebACLResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateWebACLResponse",
}) as any as S.Schema<AssociateWebACLResponse>;
export interface CreateAPIKeyRequest {
  Scope: Scope;
  TokenDomains: string[];
}
export const CreateAPIKeyRequest = S.suspend(() =>
  S.Struct({ Scope: Scope, TokenDomains: APIKeyTokenDomains }).pipe(
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
  identifier: "CreateAPIKeyRequest",
}) as any as S.Schema<CreateAPIKeyRequest>;
export interface DeleteAPIKeyRequest {
  Scope: Scope;
  APIKey: string;
}
export const DeleteAPIKeyRequest = S.suspend(() =>
  S.Struct({ Scope: Scope, APIKey: S.String }).pipe(
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
  identifier: "DeleteAPIKeyRequest",
}) as any as S.Schema<DeleteAPIKeyRequest>;
export interface DeleteAPIKeyResponse {}
export const DeleteAPIKeyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAPIKeyResponse",
}) as any as S.Schema<DeleteAPIKeyResponse>;
export interface DeleteFirewallManagerRuleGroupsRequest {
  WebACLArn: string;
  WebACLLockToken: string;
}
export const DeleteFirewallManagerRuleGroupsRequest = S.suspend(() =>
  S.Struct({ WebACLArn: S.String, WebACLLockToken: S.String }).pipe(
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
  identifier: "DeleteFirewallManagerRuleGroupsRequest",
}) as any as S.Schema<DeleteFirewallManagerRuleGroupsRequest>;
export interface DeleteIPSetRequest {
  Name: string;
  Scope: Scope;
  Id: string;
  LockToken: string;
}
export const DeleteIPSetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Id: S.String,
    LockToken: S.String,
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
  identifier: "DeleteIPSetRequest",
}) as any as S.Schema<DeleteIPSetRequest>;
export interface DeleteIPSetResponse {}
export const DeleteIPSetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteIPSetResponse",
}) as any as S.Schema<DeleteIPSetResponse>;
export interface DeleteLoggingConfigurationRequest {
  ResourceArn: string;
  LogType?: LogType;
  LogScope?: LogScope;
}
export const DeleteLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    LogType: S.optional(LogType),
    LogScope: S.optional(LogScope),
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
  identifier: "DeleteLoggingConfigurationRequest",
}) as any as S.Schema<DeleteLoggingConfigurationRequest>;
export interface DeleteLoggingConfigurationResponse {}
export const DeleteLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLoggingConfigurationResponse",
}) as any as S.Schema<DeleteLoggingConfigurationResponse>;
export interface DeletePermissionPolicyRequest {
  ResourceArn: string;
}
export const DeletePermissionPolicyRequest = S.suspend(() =>
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
  identifier: "DeletePermissionPolicyRequest",
}) as any as S.Schema<DeletePermissionPolicyRequest>;
export interface DeletePermissionPolicyResponse {}
export const DeletePermissionPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePermissionPolicyResponse",
}) as any as S.Schema<DeletePermissionPolicyResponse>;
export interface DeleteRegexPatternSetRequest {
  Name: string;
  Scope: Scope;
  Id: string;
  LockToken: string;
}
export const DeleteRegexPatternSetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Id: S.String,
    LockToken: S.String,
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
  identifier: "DeleteRegexPatternSetRequest",
}) as any as S.Schema<DeleteRegexPatternSetRequest>;
export interface DeleteRegexPatternSetResponse {}
export const DeleteRegexPatternSetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRegexPatternSetResponse",
}) as any as S.Schema<DeleteRegexPatternSetResponse>;
export interface DeleteRuleGroupRequest {
  Name: string;
  Scope: Scope;
  Id: string;
  LockToken: string;
}
export const DeleteRuleGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Id: S.String,
    LockToken: S.String,
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
  identifier: "DeleteRuleGroupRequest",
}) as any as S.Schema<DeleteRuleGroupRequest>;
export interface DeleteRuleGroupResponse {}
export const DeleteRuleGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRuleGroupResponse",
}) as any as S.Schema<DeleteRuleGroupResponse>;
export interface DeleteWebACLRequest {
  Name: string;
  Scope: Scope;
  Id: string;
  LockToken: string;
}
export const DeleteWebACLRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Id: S.String,
    LockToken: S.String,
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
  identifier: "DeleteWebACLRequest",
}) as any as S.Schema<DeleteWebACLRequest>;
export interface DeleteWebACLResponse {}
export const DeleteWebACLResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteWebACLResponse",
}) as any as S.Schema<DeleteWebACLResponse>;
export interface DescribeAllManagedProductsRequest {
  Scope: Scope;
}
export const DescribeAllManagedProductsRequest = S.suspend(() =>
  S.Struct({ Scope: Scope }).pipe(
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
  identifier: "DescribeAllManagedProductsRequest",
}) as any as S.Schema<DescribeAllManagedProductsRequest>;
export interface DescribeManagedProductsByVendorRequest {
  VendorName: string;
  Scope: Scope;
}
export const DescribeManagedProductsByVendorRequest = S.suspend(() =>
  S.Struct({ VendorName: S.String, Scope: Scope }).pipe(
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
  identifier: "DescribeManagedProductsByVendorRequest",
}) as any as S.Schema<DescribeManagedProductsByVendorRequest>;
export interface DescribeManagedRuleGroupRequest {
  VendorName: string;
  Name: string;
  Scope: Scope;
  VersionName?: string;
}
export const DescribeManagedRuleGroupRequest = S.suspend(() =>
  S.Struct({
    VendorName: S.String,
    Name: S.String,
    Scope: Scope,
    VersionName: S.optional(S.String),
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
  identifier: "DescribeManagedRuleGroupRequest",
}) as any as S.Schema<DescribeManagedRuleGroupRequest>;
export interface DisassociateWebACLRequest {
  ResourceArn: string;
}
export const DisassociateWebACLRequest = S.suspend(() =>
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
  identifier: "DisassociateWebACLRequest",
}) as any as S.Schema<DisassociateWebACLRequest>;
export interface DisassociateWebACLResponse {}
export const DisassociateWebACLResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateWebACLResponse",
}) as any as S.Schema<DisassociateWebACLResponse>;
export interface GenerateMobileSdkReleaseUrlRequest {
  Platform: Platform;
  ReleaseVersion: string;
}
export const GenerateMobileSdkReleaseUrlRequest = S.suspend(() =>
  S.Struct({ Platform: Platform, ReleaseVersion: S.String }).pipe(
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
  identifier: "GenerateMobileSdkReleaseUrlRequest",
}) as any as S.Schema<GenerateMobileSdkReleaseUrlRequest>;
export interface GetDecryptedAPIKeyRequest {
  Scope: Scope;
  APIKey: string;
}
export const GetDecryptedAPIKeyRequest = S.suspend(() =>
  S.Struct({ Scope: Scope, APIKey: S.String }).pipe(
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
  identifier: "GetDecryptedAPIKeyRequest",
}) as any as S.Schema<GetDecryptedAPIKeyRequest>;
export interface GetIPSetRequest {
  Name: string;
  Scope: Scope;
  Id: string;
}
export const GetIPSetRequest = S.suspend(() =>
  S.Struct({ Name: S.String, Scope: Scope, Id: S.String }).pipe(
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
  identifier: "GetIPSetRequest",
}) as any as S.Schema<GetIPSetRequest>;
export interface GetLoggingConfigurationRequest {
  ResourceArn: string;
  LogType?: LogType;
  LogScope?: LogScope;
}
export const GetLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    LogType: S.optional(LogType),
    LogScope: S.optional(LogScope),
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
  identifier: "GetLoggingConfigurationRequest",
}) as any as S.Schema<GetLoggingConfigurationRequest>;
export interface GetManagedRuleSetRequest {
  Name: string;
  Scope: Scope;
  Id: string;
}
export const GetManagedRuleSetRequest = S.suspend(() =>
  S.Struct({ Name: S.String, Scope: Scope, Id: S.String }).pipe(
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
  identifier: "GetManagedRuleSetRequest",
}) as any as S.Schema<GetManagedRuleSetRequest>;
export interface GetMobileSdkReleaseRequest {
  Platform: Platform;
  ReleaseVersion: string;
}
export const GetMobileSdkReleaseRequest = S.suspend(() =>
  S.Struct({ Platform: Platform, ReleaseVersion: S.String }).pipe(
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
  identifier: "GetMobileSdkReleaseRequest",
}) as any as S.Schema<GetMobileSdkReleaseRequest>;
export interface GetPermissionPolicyRequest {
  ResourceArn: string;
}
export const GetPermissionPolicyRequest = S.suspend(() =>
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
  identifier: "GetPermissionPolicyRequest",
}) as any as S.Schema<GetPermissionPolicyRequest>;
export interface GetRateBasedStatementManagedKeysRequest {
  Scope: Scope;
  WebACLName: string;
  WebACLId: string;
  RuleGroupRuleName?: string;
  RuleName: string;
}
export const GetRateBasedStatementManagedKeysRequest = S.suspend(() =>
  S.Struct({
    Scope: Scope,
    WebACLName: S.String,
    WebACLId: S.String,
    RuleGroupRuleName: S.optional(S.String),
    RuleName: S.String,
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
  identifier: "GetRateBasedStatementManagedKeysRequest",
}) as any as S.Schema<GetRateBasedStatementManagedKeysRequest>;
export interface GetRegexPatternSetRequest {
  Name: string;
  Scope: Scope;
  Id: string;
}
export const GetRegexPatternSetRequest = S.suspend(() =>
  S.Struct({ Name: S.String, Scope: Scope, Id: S.String }).pipe(
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
  identifier: "GetRegexPatternSetRequest",
}) as any as S.Schema<GetRegexPatternSetRequest>;
export interface GetRuleGroupRequest {
  Name?: string;
  Scope?: Scope;
  Id?: string;
  ARN?: string;
}
export const GetRuleGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Scope: S.optional(Scope),
    Id: S.optional(S.String),
    ARN: S.optional(S.String),
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
  identifier: "GetRuleGroupRequest",
}) as any as S.Schema<GetRuleGroupRequest>;
export interface GetWebACLRequest {
  Name?: string;
  Scope?: Scope;
  Id?: string;
  ARN?: string;
}
export const GetWebACLRequest = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Scope: S.optional(Scope),
    Id: S.optional(S.String),
    ARN: S.optional(S.String),
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
  identifier: "GetWebACLRequest",
}) as any as S.Schema<GetWebACLRequest>;
export interface GetWebACLForResourceRequest {
  ResourceArn: string;
}
export const GetWebACLForResourceRequest = S.suspend(() =>
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
  identifier: "GetWebACLForResourceRequest",
}) as any as S.Schema<GetWebACLForResourceRequest>;
export interface ListAPIKeysRequest {
  Scope: Scope;
  NextMarker?: string;
  Limit?: number;
}
export const ListAPIKeysRequest = S.suspend(() =>
  S.Struct({
    Scope: Scope,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListAPIKeysRequest",
}) as any as S.Schema<ListAPIKeysRequest>;
export interface ListAvailableManagedRuleGroupsRequest {
  Scope: Scope;
  NextMarker?: string;
  Limit?: number;
}
export const ListAvailableManagedRuleGroupsRequest = S.suspend(() =>
  S.Struct({
    Scope: Scope,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListAvailableManagedRuleGroupsRequest",
}) as any as S.Schema<ListAvailableManagedRuleGroupsRequest>;
export interface ListAvailableManagedRuleGroupVersionsRequest {
  VendorName: string;
  Name: string;
  Scope: Scope;
  NextMarker?: string;
  Limit?: number;
}
export const ListAvailableManagedRuleGroupVersionsRequest = S.suspend(() =>
  S.Struct({
    VendorName: S.String,
    Name: S.String,
    Scope: Scope,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListAvailableManagedRuleGroupVersionsRequest",
}) as any as S.Schema<ListAvailableManagedRuleGroupVersionsRequest>;
export interface ListIPSetsRequest {
  Scope: Scope;
  NextMarker?: string;
  Limit?: number;
}
export const ListIPSetsRequest = S.suspend(() =>
  S.Struct({
    Scope: Scope,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListIPSetsRequest",
}) as any as S.Schema<ListIPSetsRequest>;
export interface ListLoggingConfigurationsRequest {
  Scope: Scope;
  NextMarker?: string;
  Limit?: number;
  LogScope?: LogScope;
}
export const ListLoggingConfigurationsRequest = S.suspend(() =>
  S.Struct({
    Scope: Scope,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
    LogScope: S.optional(LogScope),
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
  identifier: "ListLoggingConfigurationsRequest",
}) as any as S.Schema<ListLoggingConfigurationsRequest>;
export interface ListManagedRuleSetsRequest {
  Scope: Scope;
  NextMarker?: string;
  Limit?: number;
}
export const ListManagedRuleSetsRequest = S.suspend(() =>
  S.Struct({
    Scope: Scope,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListManagedRuleSetsRequest",
}) as any as S.Schema<ListManagedRuleSetsRequest>;
export interface ListMobileSdkReleasesRequest {
  Platform: Platform;
  NextMarker?: string;
  Limit?: number;
}
export const ListMobileSdkReleasesRequest = S.suspend(() =>
  S.Struct({
    Platform: Platform,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListMobileSdkReleasesRequest",
}) as any as S.Schema<ListMobileSdkReleasesRequest>;
export interface ListRegexPatternSetsRequest {
  Scope: Scope;
  NextMarker?: string;
  Limit?: number;
}
export const ListRegexPatternSetsRequest = S.suspend(() =>
  S.Struct({
    Scope: Scope,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListRegexPatternSetsRequest",
}) as any as S.Schema<ListRegexPatternSetsRequest>;
export interface ListResourcesForWebACLRequest {
  WebACLArn: string;
  ResourceType?: ResourceType;
}
export const ListResourcesForWebACLRequest = S.suspend(() =>
  S.Struct({
    WebACLArn: S.String,
    ResourceType: S.optional(ResourceType),
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
  identifier: "ListResourcesForWebACLRequest",
}) as any as S.Schema<ListResourcesForWebACLRequest>;
export interface ListRuleGroupsRequest {
  Scope: Scope;
  NextMarker?: string;
  Limit?: number;
}
export const ListRuleGroupsRequest = S.suspend(() =>
  S.Struct({
    Scope: Scope,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListRuleGroupsRequest",
}) as any as S.Schema<ListRuleGroupsRequest>;
export interface ListTagsForResourceRequest {
  NextMarker?: string;
  Limit?: number;
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
    ResourceARN: S.String,
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListWebACLsRequest {
  Scope: Scope;
  NextMarker?: string;
  Limit?: number;
}
export const ListWebACLsRequest = S.suspend(() =>
  S.Struct({
    Scope: Scope,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListWebACLsRequest",
}) as any as S.Schema<ListWebACLsRequest>;
export interface PutPermissionPolicyRequest {
  ResourceArn: string;
  Policy: string;
}
export const PutPermissionPolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Policy: S.String }).pipe(
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
  identifier: "PutPermissionPolicyRequest",
}) as any as S.Schema<PutPermissionPolicyRequest>;
export interface PutPermissionPolicyResponse {}
export const PutPermissionPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutPermissionPolicyResponse",
}) as any as S.Schema<PutPermissionPolicyResponse>;
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
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
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
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
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
export interface UpdateIPSetRequest {
  Name: string;
  Scope: Scope;
  Id: string;
  Description?: string;
  Addresses: string[];
  LockToken: string;
}
export const UpdateIPSetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Id: S.String,
    Description: S.optional(S.String),
    Addresses: IPAddresses,
    LockToken: S.String,
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
  identifier: "UpdateIPSetRequest",
}) as any as S.Schema<UpdateIPSetRequest>;
export interface UpdateManagedRuleSetVersionExpiryDateRequest {
  Name: string;
  Scope: Scope;
  Id: string;
  LockToken: string;
  VersionToExpire: string;
  ExpiryTimestamp: Date;
}
export const UpdateManagedRuleSetVersionExpiryDateRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Id: S.String,
    LockToken: S.String,
    VersionToExpire: S.String,
    ExpiryTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
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
  identifier: "UpdateManagedRuleSetVersionExpiryDateRequest",
}) as any as S.Schema<UpdateManagedRuleSetVersionExpiryDateRequest>;
export interface Regex {
  RegexString?: string;
}
export const Regex = S.suspend(() =>
  S.Struct({ RegexString: S.optional(S.String) }),
).annotations({ identifier: "Regex" }) as any as S.Schema<Regex>;
export type RegularExpressionList = Regex[];
export const RegularExpressionList = S.Array(Regex);
export interface UpdateRegexPatternSetRequest {
  Name: string;
  Scope: Scope;
  Id: string;
  Description?: string;
  RegularExpressionList: Regex[];
  LockToken: string;
}
export const UpdateRegexPatternSetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Id: S.String,
    Description: S.optional(S.String),
    RegularExpressionList: RegularExpressionList,
    LockToken: S.String,
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
  identifier: "UpdateRegexPatternSetRequest",
}) as any as S.Schema<UpdateRegexPatternSetRequest>;
export interface SingleHeader {
  Name: string;
}
export const SingleHeader = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({ identifier: "SingleHeader" }) as any as S.Schema<SingleHeader>;
export interface SingleQueryArgument {
  Name: string;
}
export const SingleQueryArgument = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "SingleQueryArgument",
}) as any as S.Schema<SingleQueryArgument>;
export interface AllQueryArguments {}
export const AllQueryArguments = S.suspend(() => S.Struct({})).annotations({
  identifier: "AllQueryArguments",
}) as any as S.Schema<AllQueryArguments>;
export interface UriPath {}
export const UriPath = S.suspend(() => S.Struct({})).annotations({
  identifier: "UriPath",
}) as any as S.Schema<UriPath>;
export interface QueryString {}
export const QueryString = S.suspend(() => S.Struct({})).annotations({
  identifier: "QueryString",
}) as any as S.Schema<QueryString>;
export type OversizeHandling =
  | "CONTINUE"
  | "MATCH"
  | "NO_MATCH"
  | (string & {});
export const OversizeHandling = S.String;
export interface Body {
  OversizeHandling?: OversizeHandling;
}
export const Body = S.suspend(() =>
  S.Struct({ OversizeHandling: S.optional(OversizeHandling) }),
).annotations({ identifier: "Body" }) as any as S.Schema<Body>;
export interface Method {}
export const Method = S.suspend(() => S.Struct({})).annotations({
  identifier: "Method",
}) as any as S.Schema<Method>;
export interface All {}
export const All = S.suspend(() => S.Struct({})).annotations({
  identifier: "All",
}) as any as S.Schema<All>;
export type JsonPointerPaths = string[];
export const JsonPointerPaths = S.Array(S.String);
export interface JsonMatchPattern {
  All?: All;
  IncludedPaths?: string[];
}
export const JsonMatchPattern = S.suspend(() =>
  S.Struct({
    All: S.optional(All),
    IncludedPaths: S.optional(JsonPointerPaths),
  }),
).annotations({
  identifier: "JsonMatchPattern",
}) as any as S.Schema<JsonMatchPattern>;
export type JsonMatchScope = "ALL" | "KEY" | "VALUE" | (string & {});
export const JsonMatchScope = S.String;
export type BodyParsingFallbackBehavior =
  | "MATCH"
  | "NO_MATCH"
  | "EVALUATE_AS_STRING"
  | (string & {});
export const BodyParsingFallbackBehavior = S.String;
export interface JsonBody {
  MatchPattern: JsonMatchPattern;
  MatchScope: JsonMatchScope;
  InvalidFallbackBehavior?: BodyParsingFallbackBehavior;
  OversizeHandling?: OversizeHandling;
}
export const JsonBody = S.suspend(() =>
  S.Struct({
    MatchPattern: JsonMatchPattern,
    MatchScope: JsonMatchScope,
    InvalidFallbackBehavior: S.optional(BodyParsingFallbackBehavior),
    OversizeHandling: S.optional(OversizeHandling),
  }),
).annotations({ identifier: "JsonBody" }) as any as S.Schema<JsonBody>;
export type HeaderNames = string[];
export const HeaderNames = S.Array(S.String);
export interface HeaderMatchPattern {
  All?: All;
  IncludedHeaders?: string[];
  ExcludedHeaders?: string[];
}
export const HeaderMatchPattern = S.suspend(() =>
  S.Struct({
    All: S.optional(All),
    IncludedHeaders: S.optional(HeaderNames),
    ExcludedHeaders: S.optional(HeaderNames),
  }),
).annotations({
  identifier: "HeaderMatchPattern",
}) as any as S.Schema<HeaderMatchPattern>;
export type MapMatchScope = "ALL" | "KEY" | "VALUE" | (string & {});
export const MapMatchScope = S.String;
export interface Headers {
  MatchPattern: HeaderMatchPattern;
  MatchScope: MapMatchScope;
  OversizeHandling: OversizeHandling;
}
export const Headers = S.suspend(() =>
  S.Struct({
    MatchPattern: HeaderMatchPattern,
    MatchScope: MapMatchScope,
    OversizeHandling: OversizeHandling,
  }),
).annotations({ identifier: "Headers" }) as any as S.Schema<Headers>;
export type CookieNames = string[];
export const CookieNames = S.Array(S.String);
export interface CookieMatchPattern {
  All?: All;
  IncludedCookies?: string[];
  ExcludedCookies?: string[];
}
export const CookieMatchPattern = S.suspend(() =>
  S.Struct({
    All: S.optional(All),
    IncludedCookies: S.optional(CookieNames),
    ExcludedCookies: S.optional(CookieNames),
  }),
).annotations({
  identifier: "CookieMatchPattern",
}) as any as S.Schema<CookieMatchPattern>;
export interface Cookies {
  MatchPattern: CookieMatchPattern;
  MatchScope: MapMatchScope;
  OversizeHandling: OversizeHandling;
}
export const Cookies = S.suspend(() =>
  S.Struct({
    MatchPattern: CookieMatchPattern,
    MatchScope: MapMatchScope,
    OversizeHandling: OversizeHandling,
  }),
).annotations({ identifier: "Cookies" }) as any as S.Schema<Cookies>;
export interface HeaderOrder {
  OversizeHandling: OversizeHandling;
}
export const HeaderOrder = S.suspend(() =>
  S.Struct({ OversizeHandling: OversizeHandling }),
).annotations({ identifier: "HeaderOrder" }) as any as S.Schema<HeaderOrder>;
export type FallbackBehavior = "MATCH" | "NO_MATCH" | (string & {});
export const FallbackBehavior = S.String;
export interface JA3Fingerprint {
  FallbackBehavior: FallbackBehavior;
}
export const JA3Fingerprint = S.suspend(() =>
  S.Struct({ FallbackBehavior: FallbackBehavior }),
).annotations({
  identifier: "JA3Fingerprint",
}) as any as S.Schema<JA3Fingerprint>;
export interface JA4Fingerprint {
  FallbackBehavior: FallbackBehavior;
}
export const JA4Fingerprint = S.suspend(() =>
  S.Struct({ FallbackBehavior: FallbackBehavior }),
).annotations({
  identifier: "JA4Fingerprint",
}) as any as S.Schema<JA4Fingerprint>;
export interface UriFragment {
  FallbackBehavior?: FallbackBehavior;
}
export const UriFragment = S.suspend(() =>
  S.Struct({ FallbackBehavior: S.optional(FallbackBehavior) }),
).annotations({ identifier: "UriFragment" }) as any as S.Schema<UriFragment>;
export interface FieldToMatch {
  SingleHeader?: SingleHeader;
  SingleQueryArgument?: SingleQueryArgument;
  AllQueryArguments?: AllQueryArguments;
  UriPath?: UriPath;
  QueryString?: QueryString;
  Body?: Body;
  Method?: Method;
  JsonBody?: JsonBody;
  Headers?: Headers;
  Cookies?: Cookies;
  HeaderOrder?: HeaderOrder;
  JA3Fingerprint?: JA3Fingerprint;
  JA4Fingerprint?: JA4Fingerprint;
  UriFragment?: UriFragment;
}
export const FieldToMatch = S.suspend(() =>
  S.Struct({
    SingleHeader: S.optional(SingleHeader),
    SingleQueryArgument: S.optional(SingleQueryArgument),
    AllQueryArguments: S.optional(AllQueryArguments),
    UriPath: S.optional(UriPath),
    QueryString: S.optional(QueryString),
    Body: S.optional(Body),
    Method: S.optional(Method),
    JsonBody: S.optional(JsonBody),
    Headers: S.optional(Headers),
    Cookies: S.optional(Cookies),
    HeaderOrder: S.optional(HeaderOrder),
    JA3Fingerprint: S.optional(JA3Fingerprint),
    JA4Fingerprint: S.optional(JA4Fingerprint),
    UriFragment: S.optional(UriFragment),
  }),
).annotations({ identifier: "FieldToMatch" }) as any as S.Schema<FieldToMatch>;
export type TextTransformationType =
  | "NONE"
  | "COMPRESS_WHITE_SPACE"
  | "HTML_ENTITY_DECODE"
  | "LOWERCASE"
  | "CMD_LINE"
  | "URL_DECODE"
  | "BASE64_DECODE"
  | "HEX_DECODE"
  | "MD5"
  | "REPLACE_COMMENTS"
  | "ESCAPE_SEQ_DECODE"
  | "SQL_HEX_DECODE"
  | "CSS_DECODE"
  | "JS_DECODE"
  | "NORMALIZE_PATH"
  | "NORMALIZE_PATH_WIN"
  | "REMOVE_NULLS"
  | "REPLACE_NULLS"
  | "BASE64_DECODE_EXT"
  | "URL_DECODE_UNI"
  | "UTF8_TO_UNICODE"
  | (string & {});
export const TextTransformationType = S.String;
export interface TextTransformation {
  Priority: number;
  Type: TextTransformationType;
}
export const TextTransformation = S.suspend(() =>
  S.Struct({ Priority: S.Number, Type: TextTransformationType }),
).annotations({
  identifier: "TextTransformation",
}) as any as S.Schema<TextTransformation>;
export type TextTransformations = TextTransformation[];
export const TextTransformations = S.Array(TextTransformation);
export type PositionalConstraint =
  | "EXACTLY"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "CONTAINS"
  | "CONTAINS_WORD"
  | (string & {});
export const PositionalConstraint = S.String;
export interface ByteMatchStatement {
  SearchString: Uint8Array;
  FieldToMatch: FieldToMatch;
  TextTransformations: TextTransformation[];
  PositionalConstraint: PositionalConstraint;
}
export const ByteMatchStatement = S.suspend(() =>
  S.Struct({
    SearchString: T.Blob,
    FieldToMatch: FieldToMatch,
    TextTransformations: TextTransformations,
    PositionalConstraint: PositionalConstraint,
  }),
).annotations({
  identifier: "ByteMatchStatement",
}) as any as S.Schema<ByteMatchStatement>;
export type SensitivityLevel = "LOW" | "HIGH" | (string & {});
export const SensitivityLevel = S.String;
export interface SqliMatchStatement {
  FieldToMatch: FieldToMatch;
  TextTransformations: TextTransformation[];
  SensitivityLevel?: SensitivityLevel;
}
export const SqliMatchStatement = S.suspend(() =>
  S.Struct({
    FieldToMatch: FieldToMatch,
    TextTransformations: TextTransformations,
    SensitivityLevel: S.optional(SensitivityLevel),
  }),
).annotations({
  identifier: "SqliMatchStatement",
}) as any as S.Schema<SqliMatchStatement>;
export interface XssMatchStatement {
  FieldToMatch: FieldToMatch;
  TextTransformations: TextTransformation[];
}
export const XssMatchStatement = S.suspend(() =>
  S.Struct({
    FieldToMatch: FieldToMatch,
    TextTransformations: TextTransformations,
  }),
).annotations({
  identifier: "XssMatchStatement",
}) as any as S.Schema<XssMatchStatement>;
export type ComparisonOperator =
  | "EQ"
  | "NE"
  | "LE"
  | "LT"
  | "GE"
  | "GT"
  | (string & {});
export const ComparisonOperator = S.String;
export interface SizeConstraintStatement {
  FieldToMatch: FieldToMatch;
  ComparisonOperator: ComparisonOperator;
  Size: number;
  TextTransformations: TextTransformation[];
}
export const SizeConstraintStatement = S.suspend(() =>
  S.Struct({
    FieldToMatch: FieldToMatch,
    ComparisonOperator: ComparisonOperator,
    Size: S.Number,
    TextTransformations: TextTransformations,
  }),
).annotations({
  identifier: "SizeConstraintStatement",
}) as any as S.Schema<SizeConstraintStatement>;
export type CountryCode =
  | "AF"
  | "AX"
  | "AL"
  | "DZ"
  | "AS"
  | "AD"
  | "AO"
  | "AI"
  | "AQ"
  | "AG"
  | "AR"
  | "AM"
  | "AW"
  | "AU"
  | "AT"
  | "AZ"
  | "BS"
  | "BH"
  | "BD"
  | "BB"
  | "BY"
  | "BE"
  | "BZ"
  | "BJ"
  | "BM"
  | "BT"
  | "BO"
  | "BQ"
  | "BA"
  | "BW"
  | "BV"
  | "BR"
  | "IO"
  | "BN"
  | "BG"
  | "BF"
  | "BI"
  | "KH"
  | "CM"
  | "CA"
  | "CV"
  | "KY"
  | "CF"
  | "TD"
  | "CL"
  | "CN"
  | "CX"
  | "CC"
  | "CO"
  | "KM"
  | "CG"
  | "CD"
  | "CK"
  | "CR"
  | "CI"
  | "HR"
  | "CU"
  | "CW"
  | "CY"
  | "CZ"
  | "DK"
  | "DJ"
  | "DM"
  | "DO"
  | "EC"
  | "EG"
  | "SV"
  | "GQ"
  | "ER"
  | "EE"
  | "ET"
  | "FK"
  | "FO"
  | "FJ"
  | "FI"
  | "FR"
  | "GF"
  | "PF"
  | "TF"
  | "GA"
  | "GM"
  | "GE"
  | "DE"
  | "GH"
  | "GI"
  | "GR"
  | "GL"
  | "GD"
  | "GP"
  | "GU"
  | "GT"
  | "GG"
  | "GN"
  | "GW"
  | "GY"
  | "HT"
  | "HM"
  | "VA"
  | "HN"
  | "HK"
  | "HU"
  | "IS"
  | "IN"
  | "ID"
  | "IR"
  | "IQ"
  | "IE"
  | "IM"
  | "IL"
  | "IT"
  | "JM"
  | "JP"
  | "JE"
  | "JO"
  | "KZ"
  | "KE"
  | "KI"
  | "KP"
  | "KR"
  | "KW"
  | "KG"
  | "LA"
  | "LV"
  | "LB"
  | "LS"
  | "LR"
  | "LY"
  | "LI"
  | "LT"
  | "LU"
  | "MO"
  | "MK"
  | "MG"
  | "MW"
  | "MY"
  | "MV"
  | "ML"
  | "MT"
  | "MH"
  | "MQ"
  | "MR"
  | "MU"
  | "YT"
  | "MX"
  | "FM"
  | "MD"
  | "MC"
  | "MN"
  | "ME"
  | "MS"
  | "MA"
  | "MZ"
  | "MM"
  | "NA"
  | "NR"
  | "NP"
  | "NL"
  | "NC"
  | "NZ"
  | "NI"
  | "NE"
  | "NG"
  | "NU"
  | "NF"
  | "MP"
  | "NO"
  | "OM"
  | "PK"
  | "PW"
  | "PS"
  | "PA"
  | "PG"
  | "PY"
  | "PE"
  | "PH"
  | "PN"
  | "PL"
  | "PT"
  | "PR"
  | "QA"
  | "RE"
  | "RO"
  | "RU"
  | "RW"
  | "BL"
  | "SH"
  | "KN"
  | "LC"
  | "MF"
  | "PM"
  | "VC"
  | "WS"
  | "SM"
  | "ST"
  | "SA"
  | "SN"
  | "RS"
  | "SC"
  | "SL"
  | "SG"
  | "SX"
  | "SK"
  | "SI"
  | "SB"
  | "SO"
  | "ZA"
  | "GS"
  | "SS"
  | "ES"
  | "LK"
  | "SD"
  | "SR"
  | "SJ"
  | "SZ"
  | "SE"
  | "CH"
  | "SY"
  | "TW"
  | "TJ"
  | "TZ"
  | "TH"
  | "TL"
  | "TG"
  | "TK"
  | "TO"
  | "TT"
  | "TN"
  | "TR"
  | "TM"
  | "TC"
  | "TV"
  | "UG"
  | "UA"
  | "AE"
  | "GB"
  | "US"
  | "UM"
  | "UY"
  | "UZ"
  | "VU"
  | "VE"
  | "VN"
  | "VG"
  | "VI"
  | "WF"
  | "EH"
  | "YE"
  | "ZM"
  | "ZW"
  | "XK"
  | (string & {});
export const CountryCode = S.String;
export type CountryCodes = CountryCode[];
export const CountryCodes = S.Array(CountryCode);
export interface ForwardedIPConfig {
  HeaderName: string;
  FallbackBehavior: FallbackBehavior;
}
export const ForwardedIPConfig = S.suspend(() =>
  S.Struct({ HeaderName: S.String, FallbackBehavior: FallbackBehavior }),
).annotations({
  identifier: "ForwardedIPConfig",
}) as any as S.Schema<ForwardedIPConfig>;
export interface GeoMatchStatement {
  CountryCodes?: CountryCode[];
  ForwardedIPConfig?: ForwardedIPConfig;
}
export const GeoMatchStatement = S.suspend(() =>
  S.Struct({
    CountryCodes: S.optional(CountryCodes),
    ForwardedIPConfig: S.optional(ForwardedIPConfig),
  }),
).annotations({
  identifier: "GeoMatchStatement",
}) as any as S.Schema<GeoMatchStatement>;
export interface ExcludedRule {
  Name: string;
}
export const ExcludedRule = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({ identifier: "ExcludedRule" }) as any as S.Schema<ExcludedRule>;
export type ExcludedRules = ExcludedRule[];
export const ExcludedRules = S.Array(ExcludedRule);
export interface CustomHTTPHeader {
  Name: string;
  Value: string;
}
export const CustomHTTPHeader = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "CustomHTTPHeader",
}) as any as S.Schema<CustomHTTPHeader>;
export type CustomHTTPHeaders = CustomHTTPHeader[];
export const CustomHTTPHeaders = S.Array(CustomHTTPHeader);
export interface CustomResponse {
  ResponseCode: number;
  CustomResponseBodyKey?: string;
  ResponseHeaders?: CustomHTTPHeader[];
}
export const CustomResponse = S.suspend(() =>
  S.Struct({
    ResponseCode: S.Number,
    CustomResponseBodyKey: S.optional(S.String),
    ResponseHeaders: S.optional(CustomHTTPHeaders),
  }),
).annotations({
  identifier: "CustomResponse",
}) as any as S.Schema<CustomResponse>;
export interface BlockAction {
  CustomResponse?: CustomResponse;
}
export const BlockAction = S.suspend(() =>
  S.Struct({ CustomResponse: S.optional(CustomResponse) }),
).annotations({ identifier: "BlockAction" }) as any as S.Schema<BlockAction>;
export interface CustomRequestHandling {
  InsertHeaders: CustomHTTPHeader[];
}
export const CustomRequestHandling = S.suspend(() =>
  S.Struct({ InsertHeaders: CustomHTTPHeaders }),
).annotations({
  identifier: "CustomRequestHandling",
}) as any as S.Schema<CustomRequestHandling>;
export interface AllowAction {
  CustomRequestHandling?: CustomRequestHandling;
}
export const AllowAction = S.suspend(() =>
  S.Struct({ CustomRequestHandling: S.optional(CustomRequestHandling) }),
).annotations({ identifier: "AllowAction" }) as any as S.Schema<AllowAction>;
export interface CountAction {
  CustomRequestHandling?: CustomRequestHandling;
}
export const CountAction = S.suspend(() =>
  S.Struct({ CustomRequestHandling: S.optional(CustomRequestHandling) }),
).annotations({ identifier: "CountAction" }) as any as S.Schema<CountAction>;
export interface CaptchaAction {
  CustomRequestHandling?: CustomRequestHandling;
}
export const CaptchaAction = S.suspend(() =>
  S.Struct({ CustomRequestHandling: S.optional(CustomRequestHandling) }),
).annotations({
  identifier: "CaptchaAction",
}) as any as S.Schema<CaptchaAction>;
export interface ChallengeAction {
  CustomRequestHandling?: CustomRequestHandling;
}
export const ChallengeAction = S.suspend(() =>
  S.Struct({ CustomRequestHandling: S.optional(CustomRequestHandling) }),
).annotations({
  identifier: "ChallengeAction",
}) as any as S.Schema<ChallengeAction>;
export interface RuleAction {
  Block?: BlockAction;
  Allow?: AllowAction;
  Count?: CountAction;
  Captcha?: CaptchaAction;
  Challenge?: ChallengeAction;
}
export const RuleAction = S.suspend(() =>
  S.Struct({
    Block: S.optional(BlockAction),
    Allow: S.optional(AllowAction),
    Count: S.optional(CountAction),
    Captcha: S.optional(CaptchaAction),
    Challenge: S.optional(ChallengeAction),
  }),
).annotations({ identifier: "RuleAction" }) as any as S.Schema<RuleAction>;
export interface RuleActionOverride {
  Name: string;
  ActionToUse: RuleAction;
}
export const RuleActionOverride = S.suspend(() =>
  S.Struct({ Name: S.String, ActionToUse: RuleAction }),
).annotations({
  identifier: "RuleActionOverride",
}) as any as S.Schema<RuleActionOverride>;
export type RuleActionOverrides = RuleActionOverride[];
export const RuleActionOverrides = S.Array(RuleActionOverride);
export interface RuleGroupReferenceStatement {
  ARN: string;
  ExcludedRules?: ExcludedRule[];
  RuleActionOverrides?: RuleActionOverride[];
}
export const RuleGroupReferenceStatement = S.suspend(() =>
  S.Struct({
    ARN: S.String,
    ExcludedRules: S.optional(ExcludedRules),
    RuleActionOverrides: S.optional(RuleActionOverrides),
  }),
).annotations({
  identifier: "RuleGroupReferenceStatement",
}) as any as S.Schema<RuleGroupReferenceStatement>;
export type ForwardedIPPosition = "FIRST" | "LAST" | "ANY" | (string & {});
export const ForwardedIPPosition = S.String;
export interface IPSetForwardedIPConfig {
  HeaderName: string;
  FallbackBehavior: FallbackBehavior;
  Position: ForwardedIPPosition;
}
export const IPSetForwardedIPConfig = S.suspend(() =>
  S.Struct({
    HeaderName: S.String,
    FallbackBehavior: FallbackBehavior,
    Position: ForwardedIPPosition,
  }),
).annotations({
  identifier: "IPSetForwardedIPConfig",
}) as any as S.Schema<IPSetForwardedIPConfig>;
export interface IPSetReferenceStatement {
  ARN: string;
  IPSetForwardedIPConfig?: IPSetForwardedIPConfig;
}
export const IPSetReferenceStatement = S.suspend(() =>
  S.Struct({
    ARN: S.String,
    IPSetForwardedIPConfig: S.optional(IPSetForwardedIPConfig),
  }),
).annotations({
  identifier: "IPSetReferenceStatement",
}) as any as S.Schema<IPSetReferenceStatement>;
export interface RegexPatternSetReferenceStatement {
  ARN: string;
  FieldToMatch: FieldToMatch;
  TextTransformations: TextTransformation[];
}
export const RegexPatternSetReferenceStatement = S.suspend(() =>
  S.Struct({
    ARN: S.String,
    FieldToMatch: FieldToMatch,
    TextTransformations: TextTransformations,
  }),
).annotations({
  identifier: "RegexPatternSetReferenceStatement",
}) as any as S.Schema<RegexPatternSetReferenceStatement>;
export type LabelMatchScope = "LABEL" | "NAMESPACE" | (string & {});
export const LabelMatchScope = S.String;
export interface LabelMatchStatement {
  Scope: LabelMatchScope;
  Key: string;
}
export const LabelMatchStatement = S.suspend(() =>
  S.Struct({ Scope: LabelMatchScope, Key: S.String }),
).annotations({
  identifier: "LabelMatchStatement",
}) as any as S.Schema<LabelMatchStatement>;
export interface RegexMatchStatement {
  RegexString: string;
  FieldToMatch: FieldToMatch;
  TextTransformations: TextTransformation[];
}
export const RegexMatchStatement = S.suspend(() =>
  S.Struct({
    RegexString: S.String,
    FieldToMatch: FieldToMatch,
    TextTransformations: TextTransformations,
  }),
).annotations({
  identifier: "RegexMatchStatement",
}) as any as S.Schema<RegexMatchStatement>;
export type AsnList = number[];
export const AsnList = S.Array(S.Number);
export interface AsnMatchStatement {
  AsnList: number[];
  ForwardedIPConfig?: ForwardedIPConfig;
}
export const AsnMatchStatement = S.suspend(() =>
  S.Struct({
    AsnList: AsnList,
    ForwardedIPConfig: S.optional(ForwardedIPConfig),
  }),
).annotations({
  identifier: "AsnMatchStatement",
}) as any as S.Schema<AsnMatchStatement>;
export interface Statement {
  ByteMatchStatement?: ByteMatchStatement;
  SqliMatchStatement?: SqliMatchStatement;
  XssMatchStatement?: XssMatchStatement;
  SizeConstraintStatement?: SizeConstraintStatement;
  GeoMatchStatement?: GeoMatchStatement;
  RuleGroupReferenceStatement?: RuleGroupReferenceStatement;
  IPSetReferenceStatement?: IPSetReferenceStatement;
  RegexPatternSetReferenceStatement?: RegexPatternSetReferenceStatement;
  RateBasedStatement?: RateBasedStatement;
  AndStatement?: AndStatement;
  OrStatement?: OrStatement;
  NotStatement?: NotStatement;
  ManagedRuleGroupStatement?: ManagedRuleGroupStatement;
  LabelMatchStatement?: LabelMatchStatement;
  RegexMatchStatement?: RegexMatchStatement;
  AsnMatchStatement?: AsnMatchStatement;
}
export const Statement = S.suspend(() =>
  S.Struct({
    ByteMatchStatement: S.optional(ByteMatchStatement),
    SqliMatchStatement: S.optional(SqliMatchStatement),
    XssMatchStatement: S.optional(XssMatchStatement),
    SizeConstraintStatement: S.optional(SizeConstraintStatement),
    GeoMatchStatement: S.optional(GeoMatchStatement),
    RuleGroupReferenceStatement: S.optional(RuleGroupReferenceStatement),
    IPSetReferenceStatement: S.optional(IPSetReferenceStatement),
    RegexPatternSetReferenceStatement: S.optional(
      RegexPatternSetReferenceStatement,
    ),
    RateBasedStatement: S.optional(
      S.suspend(
        (): S.Schema<RateBasedStatement, any> => RateBasedStatement,
      ).annotations({ identifier: "RateBasedStatement" }),
    ),
    AndStatement: S.optional(
      S.suspend((): S.Schema<AndStatement, any> => AndStatement).annotations({
        identifier: "AndStatement",
      }),
    ),
    OrStatement: S.optional(
      S.suspend((): S.Schema<OrStatement, any> => OrStatement).annotations({
        identifier: "OrStatement",
      }),
    ),
    NotStatement: S.optional(
      S.suspend((): S.Schema<NotStatement, any> => NotStatement).annotations({
        identifier: "NotStatement",
      }),
    ),
    ManagedRuleGroupStatement: S.optional(
      S.suspend(
        (): S.Schema<ManagedRuleGroupStatement, any> =>
          ManagedRuleGroupStatement,
      ).annotations({ identifier: "ManagedRuleGroupStatement" }),
    ),
    LabelMatchStatement: S.optional(LabelMatchStatement),
    RegexMatchStatement: S.optional(RegexMatchStatement),
    AsnMatchStatement: S.optional(AsnMatchStatement),
  }),
).annotations({ identifier: "Statement" }) as any as S.Schema<Statement>;
export interface NoneAction {}
export const NoneAction = S.suspend(() => S.Struct({})).annotations({
  identifier: "NoneAction",
}) as any as S.Schema<NoneAction>;
export interface OverrideAction {
  Count?: CountAction;
  None?: NoneAction;
}
export const OverrideAction = S.suspend(() =>
  S.Struct({ Count: S.optional(CountAction), None: S.optional(NoneAction) }),
).annotations({
  identifier: "OverrideAction",
}) as any as S.Schema<OverrideAction>;
export interface Label {
  Name: string;
}
export const Label = S.suspend(() => S.Struct({ Name: S.String })).annotations({
  identifier: "Label",
}) as any as S.Schema<Label>;
export type Labels = Label[];
export const Labels = S.Array(Label);
export interface VisibilityConfig {
  SampledRequestsEnabled: boolean;
  CloudWatchMetricsEnabled: boolean;
  MetricName: string;
}
export const VisibilityConfig = S.suspend(() =>
  S.Struct({
    SampledRequestsEnabled: S.Boolean,
    CloudWatchMetricsEnabled: S.Boolean,
    MetricName: S.String,
  }),
).annotations({
  identifier: "VisibilityConfig",
}) as any as S.Schema<VisibilityConfig>;
export interface ImmunityTimeProperty {
  ImmunityTime: number;
}
export const ImmunityTimeProperty = S.suspend(() =>
  S.Struct({ ImmunityTime: S.Number }),
).annotations({
  identifier: "ImmunityTimeProperty",
}) as any as S.Schema<ImmunityTimeProperty>;
export interface CaptchaConfig {
  ImmunityTimeProperty?: ImmunityTimeProperty;
}
export const CaptchaConfig = S.suspend(() =>
  S.Struct({ ImmunityTimeProperty: S.optional(ImmunityTimeProperty) }),
).annotations({
  identifier: "CaptchaConfig",
}) as any as S.Schema<CaptchaConfig>;
export interface ChallengeConfig {
  ImmunityTimeProperty?: ImmunityTimeProperty;
}
export const ChallengeConfig = S.suspend(() =>
  S.Struct({ ImmunityTimeProperty: S.optional(ImmunityTimeProperty) }),
).annotations({
  identifier: "ChallengeConfig",
}) as any as S.Schema<ChallengeConfig>;
export interface Rule {
  Name: string;
  Priority: number;
  Statement: Statement;
  Action?: RuleAction;
  OverrideAction?: OverrideAction;
  RuleLabels?: Label[];
  VisibilityConfig: VisibilityConfig;
  CaptchaConfig?: CaptchaConfig;
  ChallengeConfig?: ChallengeConfig;
}
export const Rule = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Priority: S.Number,
    Statement: Statement,
    Action: S.optional(RuleAction),
    OverrideAction: S.optional(OverrideAction),
    RuleLabels: S.optional(Labels),
    VisibilityConfig: VisibilityConfig,
    CaptchaConfig: S.optional(CaptchaConfig),
    ChallengeConfig: S.optional(ChallengeConfig),
  }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export type Rules = Rule[];
export const Rules = S.Array(Rule);
export type ResponseContentType =
  | "TEXT_PLAIN"
  | "TEXT_HTML"
  | "APPLICATION_JSON"
  | (string & {});
export const ResponseContentType = S.String;
export interface CustomResponseBody {
  ContentType: ResponseContentType;
  Content: string;
}
export const CustomResponseBody = S.suspend(() =>
  S.Struct({ ContentType: ResponseContentType, Content: S.String }),
).annotations({
  identifier: "CustomResponseBody",
}) as any as S.Schema<CustomResponseBody>;
export type CustomResponseBodies = {
  [key: string]: CustomResponseBody | undefined;
};
export const CustomResponseBodies = S.Record({
  key: S.String,
  value: S.UndefinedOr(CustomResponseBody),
});
export interface UpdateRuleGroupRequest {
  Name: string;
  Scope: Scope;
  Id: string;
  Description?: string;
  Rules?: Rule[];
  VisibilityConfig: VisibilityConfig;
  LockToken: string;
  CustomResponseBodies?: { [key: string]: CustomResponseBody | undefined };
}
export const UpdateRuleGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Id: S.String,
    Description: S.optional(S.String),
    Rules: S.optional(Rules),
    VisibilityConfig: VisibilityConfig,
    LockToken: S.String,
    CustomResponseBodies: S.optional(CustomResponseBodies),
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
  identifier: "UpdateRuleGroupRequest",
}) as any as S.Schema<UpdateRuleGroupRequest>;
export interface DefaultAction {
  Block?: BlockAction;
  Allow?: AllowAction;
}
export const DefaultAction = S.suspend(() =>
  S.Struct({ Block: S.optional(BlockAction), Allow: S.optional(AllowAction) }),
).annotations({
  identifier: "DefaultAction",
}) as any as S.Schema<DefaultAction>;
export type FieldToProtectType =
  | "SINGLE_HEADER"
  | "SINGLE_COOKIE"
  | "SINGLE_QUERY_ARGUMENT"
  | "QUERY_STRING"
  | "BODY"
  | (string & {});
export const FieldToProtectType = S.String;
export type FieldToProtectKeys = string[];
export const FieldToProtectKeys = S.Array(S.String);
export interface FieldToProtect {
  FieldType: FieldToProtectType;
  FieldKeys?: string[];
}
export const FieldToProtect = S.suspend(() =>
  S.Struct({
    FieldType: FieldToProtectType,
    FieldKeys: S.optional(FieldToProtectKeys),
  }),
).annotations({
  identifier: "FieldToProtect",
}) as any as S.Schema<FieldToProtect>;
export type DataProtectionAction = "SUBSTITUTION" | "HASH" | (string & {});
export const DataProtectionAction = S.String;
export interface DataProtection {
  Field: FieldToProtect;
  Action: DataProtectionAction;
  ExcludeRuleMatchDetails?: boolean;
  ExcludeRateBasedDetails?: boolean;
}
export const DataProtection = S.suspend(() =>
  S.Struct({
    Field: FieldToProtect,
    Action: DataProtectionAction,
    ExcludeRuleMatchDetails: S.optional(S.Boolean),
    ExcludeRateBasedDetails: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DataProtection",
}) as any as S.Schema<DataProtection>;
export type DataProtections = DataProtection[];
export const DataProtections = S.Array(DataProtection);
export interface DataProtectionConfig {
  DataProtections: DataProtection[];
}
export const DataProtectionConfig = S.suspend(() =>
  S.Struct({ DataProtections: DataProtections }),
).annotations({
  identifier: "DataProtectionConfig",
}) as any as S.Schema<DataProtectionConfig>;
export type AssociatedResourceType =
  | "CLOUDFRONT"
  | "API_GATEWAY"
  | "COGNITO_USER_POOL"
  | "APP_RUNNER_SERVICE"
  | "VERIFIED_ACCESS_INSTANCE"
  | (string & {});
export const AssociatedResourceType = S.String;
export type SizeInspectionLimit =
  | "KB_16"
  | "KB_32"
  | "KB_48"
  | "KB_64"
  | (string & {});
export const SizeInspectionLimit = S.String;
export interface RequestBodyAssociatedResourceTypeConfig {
  DefaultSizeInspectionLimit: SizeInspectionLimit;
}
export const RequestBodyAssociatedResourceTypeConfig = S.suspend(() =>
  S.Struct({ DefaultSizeInspectionLimit: SizeInspectionLimit }),
).annotations({
  identifier: "RequestBodyAssociatedResourceTypeConfig",
}) as any as S.Schema<RequestBodyAssociatedResourceTypeConfig>;
export type RequestBody = {
  [key in AssociatedResourceType]?: RequestBodyAssociatedResourceTypeConfig;
};
export const RequestBody = S.partial(
  S.Record({
    key: AssociatedResourceType,
    value: S.UndefinedOr(RequestBodyAssociatedResourceTypeConfig),
  }),
);
export interface AssociationConfig {
  RequestBody?: {
    [key: string]: RequestBodyAssociatedResourceTypeConfig | undefined;
  };
}
export const AssociationConfig = S.suspend(() =>
  S.Struct({ RequestBody: S.optional(RequestBody) }),
).annotations({
  identifier: "AssociationConfig",
}) as any as S.Schema<AssociationConfig>;
export type LowReputationMode =
  | "ACTIVE_UNDER_DDOS"
  | "ALWAYS_ON"
  | (string & {});
export const LowReputationMode = S.String;
export interface OnSourceDDoSProtectionConfig {
  ALBLowReputationMode: LowReputationMode;
}
export const OnSourceDDoSProtectionConfig = S.suspend(() =>
  S.Struct({ ALBLowReputationMode: LowReputationMode }),
).annotations({
  identifier: "OnSourceDDoSProtectionConfig",
}) as any as S.Schema<OnSourceDDoSProtectionConfig>;
export type AttributeValues = string[];
export const AttributeValues = S.Array(S.String);
export interface ApplicationAttribute {
  Name?: string;
  Values?: string[];
}
export const ApplicationAttribute = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Values: S.optional(AttributeValues) }),
).annotations({
  identifier: "ApplicationAttribute",
}) as any as S.Schema<ApplicationAttribute>;
export type ApplicationAttributes = ApplicationAttribute[];
export const ApplicationAttributes = S.Array(ApplicationAttribute);
export interface ApplicationConfig {
  Attributes?: ApplicationAttribute[];
}
export const ApplicationConfig = S.suspend(() =>
  S.Struct({ Attributes: S.optional(ApplicationAttributes) }),
).annotations({
  identifier: "ApplicationConfig",
}) as any as S.Schema<ApplicationConfig>;
export interface UpdateWebACLRequest {
  Name: string;
  Scope: Scope;
  Id: string;
  DefaultAction: DefaultAction;
  Description?: string;
  Rules?: Rule[];
  VisibilityConfig: VisibilityConfig;
  DataProtectionConfig?: DataProtectionConfig;
  LockToken: string;
  CustomResponseBodies?: { [key: string]: CustomResponseBody | undefined };
  CaptchaConfig?: CaptchaConfig;
  ChallengeConfig?: ChallengeConfig;
  TokenDomains?: string[];
  AssociationConfig?: AssociationConfig;
  OnSourceDDoSProtectionConfig?: OnSourceDDoSProtectionConfig;
  ApplicationConfig?: ApplicationConfig;
}
export const UpdateWebACLRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Id: S.String,
    DefaultAction: DefaultAction,
    Description: S.optional(S.String),
    Rules: S.optional(Rules),
    VisibilityConfig: VisibilityConfig,
    DataProtectionConfig: S.optional(DataProtectionConfig),
    LockToken: S.String,
    CustomResponseBodies: S.optional(CustomResponseBodies),
    CaptchaConfig: S.optional(CaptchaConfig),
    ChallengeConfig: S.optional(ChallengeConfig),
    TokenDomains: S.optional(TokenDomains),
    AssociationConfig: S.optional(AssociationConfig),
    OnSourceDDoSProtectionConfig: S.optional(OnSourceDDoSProtectionConfig),
    ApplicationConfig: S.optional(ApplicationConfig),
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
  identifier: "UpdateWebACLRequest",
}) as any as S.Schema<UpdateWebACLRequest>;
export type LogDestinationConfigs = string[];
export const LogDestinationConfigs = S.Array(S.String);
export interface TimeWindow {
  StartTime: Date;
  EndTime: Date;
}
export const TimeWindow = S.suspend(() =>
  S.Struct({
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "TimeWindow" }) as any as S.Schema<TimeWindow>;
export type RedactedFields = FieldToMatch[];
export const RedactedFields = S.Array(FieldToMatch);
export type FilterBehavior = "KEEP" | "DROP" | (string & {});
export const FilterBehavior = S.String;
export type FilterRequirement = "MEETS_ALL" | "MEETS_ANY" | (string & {});
export const FilterRequirement = S.String;
export type ActionValue =
  | "ALLOW"
  | "BLOCK"
  | "COUNT"
  | "CAPTCHA"
  | "CHALLENGE"
  | "EXCLUDED_AS_COUNT"
  | (string & {});
export const ActionValue = S.String;
export interface ActionCondition {
  Action: ActionValue;
}
export const ActionCondition = S.suspend(() =>
  S.Struct({ Action: ActionValue }),
).annotations({
  identifier: "ActionCondition",
}) as any as S.Schema<ActionCondition>;
export interface LabelNameCondition {
  LabelName: string;
}
export const LabelNameCondition = S.suspend(() =>
  S.Struct({ LabelName: S.String }),
).annotations({
  identifier: "LabelNameCondition",
}) as any as S.Schema<LabelNameCondition>;
export interface Condition {
  ActionCondition?: ActionCondition;
  LabelNameCondition?: LabelNameCondition;
}
export const Condition = S.suspend(() =>
  S.Struct({
    ActionCondition: S.optional(ActionCondition),
    LabelNameCondition: S.optional(LabelNameCondition),
  }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export type Conditions = Condition[];
export const Conditions = S.Array(Condition);
export interface Filter {
  Behavior: FilterBehavior;
  Requirement: FilterRequirement;
  Conditions: Condition[];
}
export const Filter = S.suspend(() =>
  S.Struct({
    Behavior: FilterBehavior,
    Requirement: FilterRequirement,
    Conditions: Conditions,
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface LoggingFilter {
  Filters: Filter[];
  DefaultBehavior: FilterBehavior;
}
export const LoggingFilter = S.suspend(() =>
  S.Struct({ Filters: Filters, DefaultBehavior: FilterBehavior }),
).annotations({
  identifier: "LoggingFilter",
}) as any as S.Schema<LoggingFilter>;
export interface LoggingConfiguration {
  ResourceArn: string;
  LogDestinationConfigs: string[];
  RedactedFields?: FieldToMatch[];
  ManagedByFirewallManager?: boolean;
  LoggingFilter?: LoggingFilter;
  LogType?: LogType;
  LogScope?: LogScope;
}
export const LoggingConfiguration = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    LogDestinationConfigs: LogDestinationConfigs,
    RedactedFields: S.optional(RedactedFields),
    ManagedByFirewallManager: S.optional(S.Boolean),
    LoggingFilter: S.optional(LoggingFilter),
    LogType: S.optional(LogType),
    LogScope: S.optional(LogScope),
  }),
).annotations({
  identifier: "LoggingConfiguration",
}) as any as S.Schema<LoggingConfiguration>;
export type LoggingConfigurations = LoggingConfiguration[];
export const LoggingConfigurations = S.Array(LoggingConfiguration);
export type ResourceArns = string[];
export const ResourceArns = S.Array(S.String);
export interface CreateAPIKeyResponse {
  APIKey?: string;
}
export const CreateAPIKeyResponse = S.suspend(() =>
  S.Struct({ APIKey: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateAPIKeyResponse",
}) as any as S.Schema<CreateAPIKeyResponse>;
export interface CreateIPSetRequest {
  Name: string;
  Scope: Scope;
  Description?: string;
  IPAddressVersion: IPAddressVersion;
  Addresses: string[];
  Tags?: Tag[];
}
export const CreateIPSetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Description: S.optional(S.String),
    IPAddressVersion: IPAddressVersion,
    Addresses: IPAddresses,
    Tags: S.optional(TagList),
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
  identifier: "CreateIPSetRequest",
}) as any as S.Schema<CreateIPSetRequest>;
export interface CreateRegexPatternSetRequest {
  Name: string;
  Scope: Scope;
  Description?: string;
  RegularExpressionList: Regex[];
  Tags?: Tag[];
}
export const CreateRegexPatternSetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Description: S.optional(S.String),
    RegularExpressionList: RegularExpressionList,
    Tags: S.optional(TagList),
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
  identifier: "CreateRegexPatternSetRequest",
}) as any as S.Schema<CreateRegexPatternSetRequest>;
export interface DeleteFirewallManagerRuleGroupsResponse {
  NextWebACLLockToken?: string;
}
export const DeleteFirewallManagerRuleGroupsResponse = S.suspend(() =>
  S.Struct({ NextWebACLLockToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteFirewallManagerRuleGroupsResponse",
}) as any as S.Schema<DeleteFirewallManagerRuleGroupsResponse>;
export interface ManagedProductDescriptor {
  VendorName?: string;
  ManagedRuleSetName?: string;
  ProductId?: string;
  ProductLink?: string;
  ProductTitle?: string;
  ProductDescription?: string;
  SnsTopicArn?: string;
  IsVersioningSupported?: boolean;
  IsAdvancedManagedRuleSet?: boolean;
}
export const ManagedProductDescriptor = S.suspend(() =>
  S.Struct({
    VendorName: S.optional(S.String),
    ManagedRuleSetName: S.optional(S.String),
    ProductId: S.optional(S.String),
    ProductLink: S.optional(S.String),
    ProductTitle: S.optional(S.String),
    ProductDescription: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    IsVersioningSupported: S.optional(S.Boolean),
    IsAdvancedManagedRuleSet: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ManagedProductDescriptor",
}) as any as S.Schema<ManagedProductDescriptor>;
export type ManagedProductDescriptors = ManagedProductDescriptor[];
export const ManagedProductDescriptors = S.Array(ManagedProductDescriptor);
export interface DescribeManagedProductsByVendorResponse {
  ManagedProducts?: ManagedProductDescriptor[];
}
export const DescribeManagedProductsByVendorResponse = S.suspend(() =>
  S.Struct({ ManagedProducts: S.optional(ManagedProductDescriptors) }).pipe(ns),
).annotations({
  identifier: "DescribeManagedProductsByVendorResponse",
}) as any as S.Schema<DescribeManagedProductsByVendorResponse>;
export interface GenerateMobileSdkReleaseUrlResponse {
  Url?: string;
}
export const GenerateMobileSdkReleaseUrlResponse = S.suspend(() =>
  S.Struct({ Url: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GenerateMobileSdkReleaseUrlResponse",
}) as any as S.Schema<GenerateMobileSdkReleaseUrlResponse>;
export interface GetDecryptedAPIKeyResponse {
  TokenDomains?: string[];
  CreationTimestamp?: Date;
}
export const GetDecryptedAPIKeyResponse = S.suspend(() =>
  S.Struct({
    TokenDomains: S.optional(TokenDomains),
    CreationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "GetDecryptedAPIKeyResponse",
}) as any as S.Schema<GetDecryptedAPIKeyResponse>;
export interface GetLoggingConfigurationResponse {
  LoggingConfiguration?: LoggingConfiguration;
}
export const GetLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({ LoggingConfiguration: S.optional(LoggingConfiguration) }).pipe(ns),
).annotations({
  identifier: "GetLoggingConfigurationResponse",
}) as any as S.Schema<GetLoggingConfigurationResponse>;
export interface GetPermissionPolicyResponse {
  Policy?: string;
}
export const GetPermissionPolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GetPermissionPolicyResponse",
}) as any as S.Schema<GetPermissionPolicyResponse>;
export interface GetSampledRequestsRequest {
  WebAclArn: string;
  RuleMetricName: string;
  Scope: Scope;
  TimeWindow: TimeWindow;
  MaxItems: number;
}
export const GetSampledRequestsRequest = S.suspend(() =>
  S.Struct({
    WebAclArn: S.String,
    RuleMetricName: S.String,
    Scope: Scope,
    TimeWindow: TimeWindow,
    MaxItems: S.Number,
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
  identifier: "GetSampledRequestsRequest",
}) as any as S.Schema<GetSampledRequestsRequest>;
export type PayloadType = "JSON" | "FORM_ENCODED" | (string & {});
export const PayloadType = S.String;
export interface UsernameField {
  Identifier: string;
}
export const UsernameField = S.suspend(() =>
  S.Struct({ Identifier: S.String }),
).annotations({
  identifier: "UsernameField",
}) as any as S.Schema<UsernameField>;
export interface PasswordField {
  Identifier: string;
}
export const PasswordField = S.suspend(() =>
  S.Struct({ Identifier: S.String }),
).annotations({
  identifier: "PasswordField",
}) as any as S.Schema<PasswordField>;
export type InspectionLevel = "COMMON" | "TARGETED" | (string & {});
export const InspectionLevel = S.String;
export interface AWSManagedRulesBotControlRuleSet {
  InspectionLevel: InspectionLevel;
  EnableMachineLearning?: boolean;
}
export const AWSManagedRulesBotControlRuleSet = S.suspend(() =>
  S.Struct({
    InspectionLevel: InspectionLevel,
    EnableMachineLearning: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AWSManagedRulesBotControlRuleSet",
}) as any as S.Schema<AWSManagedRulesBotControlRuleSet>;
export interface RequestInspection {
  PayloadType: PayloadType;
  UsernameField: UsernameField;
  PasswordField: PasswordField;
}
export const RequestInspection = S.suspend(() =>
  S.Struct({
    PayloadType: PayloadType,
    UsernameField: UsernameField,
    PasswordField: PasswordField,
  }),
).annotations({
  identifier: "RequestInspection",
}) as any as S.Schema<RequestInspection>;
export type ResponseInspectionStatusCodeSuccessCodes = number[];
export const ResponseInspectionStatusCodeSuccessCodes = S.Array(S.Number);
export type ResponseInspectionStatusCodeFailureCodes = number[];
export const ResponseInspectionStatusCodeFailureCodes = S.Array(S.Number);
export interface ResponseInspectionStatusCode {
  SuccessCodes: number[];
  FailureCodes: number[];
}
export const ResponseInspectionStatusCode = S.suspend(() =>
  S.Struct({
    SuccessCodes: ResponseInspectionStatusCodeSuccessCodes,
    FailureCodes: ResponseInspectionStatusCodeFailureCodes,
  }),
).annotations({
  identifier: "ResponseInspectionStatusCode",
}) as any as S.Schema<ResponseInspectionStatusCode>;
export type ResponseInspectionHeaderSuccessValues = string[];
export const ResponseInspectionHeaderSuccessValues = S.Array(S.String);
export type ResponseInspectionHeaderFailureValues = string[];
export const ResponseInspectionHeaderFailureValues = S.Array(S.String);
export interface ResponseInspectionHeader {
  Name: string;
  SuccessValues: string[];
  FailureValues: string[];
}
export const ResponseInspectionHeader = S.suspend(() =>
  S.Struct({
    Name: S.String,
    SuccessValues: ResponseInspectionHeaderSuccessValues,
    FailureValues: ResponseInspectionHeaderFailureValues,
  }),
).annotations({
  identifier: "ResponseInspectionHeader",
}) as any as S.Schema<ResponseInspectionHeader>;
export type ResponseInspectionBodyContainsSuccessStrings = string[];
export const ResponseInspectionBodyContainsSuccessStrings = S.Array(S.String);
export type ResponseInspectionBodyContainsFailureStrings = string[];
export const ResponseInspectionBodyContainsFailureStrings = S.Array(S.String);
export interface ResponseInspectionBodyContains {
  SuccessStrings: string[];
  FailureStrings: string[];
}
export const ResponseInspectionBodyContains = S.suspend(() =>
  S.Struct({
    SuccessStrings: ResponseInspectionBodyContainsSuccessStrings,
    FailureStrings: ResponseInspectionBodyContainsFailureStrings,
  }),
).annotations({
  identifier: "ResponseInspectionBodyContains",
}) as any as S.Schema<ResponseInspectionBodyContains>;
export type ResponseInspectionJsonSuccessValues = string[];
export const ResponseInspectionJsonSuccessValues = S.Array(S.String);
export type ResponseInspectionJsonFailureValues = string[];
export const ResponseInspectionJsonFailureValues = S.Array(S.String);
export interface ResponseInspectionJson {
  Identifier: string;
  SuccessValues: string[];
  FailureValues: string[];
}
export const ResponseInspectionJson = S.suspend(() =>
  S.Struct({
    Identifier: S.String,
    SuccessValues: ResponseInspectionJsonSuccessValues,
    FailureValues: ResponseInspectionJsonFailureValues,
  }),
).annotations({
  identifier: "ResponseInspectionJson",
}) as any as S.Schema<ResponseInspectionJson>;
export interface ResponseInspection {
  StatusCode?: ResponseInspectionStatusCode;
  Header?: ResponseInspectionHeader;
  BodyContains?: ResponseInspectionBodyContains;
  Json?: ResponseInspectionJson;
}
export const ResponseInspection = S.suspend(() =>
  S.Struct({
    StatusCode: S.optional(ResponseInspectionStatusCode),
    Header: S.optional(ResponseInspectionHeader),
    BodyContains: S.optional(ResponseInspectionBodyContains),
    Json: S.optional(ResponseInspectionJson),
  }),
).annotations({
  identifier: "ResponseInspection",
}) as any as S.Schema<ResponseInspection>;
export interface AWSManagedRulesATPRuleSet {
  LoginPath: string;
  RequestInspection?: RequestInspection;
  ResponseInspection?: ResponseInspection;
  EnableRegexInPath?: boolean;
}
export const AWSManagedRulesATPRuleSet = S.suspend(() =>
  S.Struct({
    LoginPath: S.String,
    RequestInspection: S.optional(RequestInspection),
    ResponseInspection: S.optional(ResponseInspection),
    EnableRegexInPath: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AWSManagedRulesATPRuleSet",
}) as any as S.Schema<AWSManagedRulesATPRuleSet>;
export interface EmailField {
  Identifier: string;
}
export const EmailField = S.suspend(() =>
  S.Struct({ Identifier: S.String }),
).annotations({ identifier: "EmailField" }) as any as S.Schema<EmailField>;
export interface PhoneNumberField {
  Identifier: string;
}
export const PhoneNumberField = S.suspend(() =>
  S.Struct({ Identifier: S.String }),
).annotations({
  identifier: "PhoneNumberField",
}) as any as S.Schema<PhoneNumberField>;
export type PhoneNumberFields = PhoneNumberField[];
export const PhoneNumberFields = S.Array(PhoneNumberField);
export interface AddressField {
  Identifier: string;
}
export const AddressField = S.suspend(() =>
  S.Struct({ Identifier: S.String }),
).annotations({ identifier: "AddressField" }) as any as S.Schema<AddressField>;
export type AddressFields = AddressField[];
export const AddressFields = S.Array(AddressField);
export interface RequestInspectionACFP {
  PayloadType: PayloadType;
  UsernameField?: UsernameField;
  PasswordField?: PasswordField;
  EmailField?: EmailField;
  PhoneNumberFields?: PhoneNumberField[];
  AddressFields?: AddressField[];
}
export const RequestInspectionACFP = S.suspend(() =>
  S.Struct({
    PayloadType: PayloadType,
    UsernameField: S.optional(UsernameField),
    PasswordField: S.optional(PasswordField),
    EmailField: S.optional(EmailField),
    PhoneNumberFields: S.optional(PhoneNumberFields),
    AddressFields: S.optional(AddressFields),
  }),
).annotations({
  identifier: "RequestInspectionACFP",
}) as any as S.Schema<RequestInspectionACFP>;
export interface AWSManagedRulesACFPRuleSet {
  CreationPath: string;
  RegistrationPagePath: string;
  RequestInspection: RequestInspectionACFP;
  ResponseInspection?: ResponseInspection;
  EnableRegexInPath?: boolean;
}
export const AWSManagedRulesACFPRuleSet = S.suspend(() =>
  S.Struct({
    CreationPath: S.String,
    RegistrationPagePath: S.String,
    RequestInspection: RequestInspectionACFP,
    ResponseInspection: S.optional(ResponseInspection),
    EnableRegexInPath: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AWSManagedRulesACFPRuleSet",
}) as any as S.Schema<AWSManagedRulesACFPRuleSet>;
export type UsageOfAction = "ENABLED" | "DISABLED" | (string & {});
export const UsageOfAction = S.String;
export type SensitivityToAct = "LOW" | "MEDIUM" | "HIGH" | (string & {});
export const SensitivityToAct = S.String;
export interface ClientSideAction {
  UsageOfAction: UsageOfAction;
  Sensitivity?: SensitivityToAct;
  ExemptUriRegularExpressions?: Regex[];
}
export const ClientSideAction = S.suspend(() =>
  S.Struct({
    UsageOfAction: UsageOfAction,
    Sensitivity: S.optional(SensitivityToAct),
    ExemptUriRegularExpressions: S.optional(RegularExpressionList),
  }),
).annotations({
  identifier: "ClientSideAction",
}) as any as S.Schema<ClientSideAction>;
export interface ClientSideActionConfig {
  Challenge: ClientSideAction;
}
export const ClientSideActionConfig = S.suspend(() =>
  S.Struct({ Challenge: ClientSideAction }),
).annotations({
  identifier: "ClientSideActionConfig",
}) as any as S.Schema<ClientSideActionConfig>;
export interface AWSManagedRulesAntiDDoSRuleSet {
  ClientSideActionConfig: ClientSideActionConfig;
  SensitivityToBlock?: SensitivityToAct;
}
export const AWSManagedRulesAntiDDoSRuleSet = S.suspend(() =>
  S.Struct({
    ClientSideActionConfig: ClientSideActionConfig,
    SensitivityToBlock: S.optional(SensitivityToAct),
  }),
).annotations({
  identifier: "AWSManagedRulesAntiDDoSRuleSet",
}) as any as S.Schema<AWSManagedRulesAntiDDoSRuleSet>;
export interface ManagedRuleGroupConfig {
  LoginPath?: string;
  PayloadType?: PayloadType;
  UsernameField?: UsernameField;
  PasswordField?: PasswordField;
  AWSManagedRulesBotControlRuleSet?: AWSManagedRulesBotControlRuleSet;
  AWSManagedRulesATPRuleSet?: AWSManagedRulesATPRuleSet;
  AWSManagedRulesACFPRuleSet?: AWSManagedRulesACFPRuleSet;
  AWSManagedRulesAntiDDoSRuleSet?: AWSManagedRulesAntiDDoSRuleSet;
}
export const ManagedRuleGroupConfig = S.suspend(() =>
  S.Struct({
    LoginPath: S.optional(S.String),
    PayloadType: S.optional(PayloadType),
    UsernameField: S.optional(UsernameField),
    PasswordField: S.optional(PasswordField),
    AWSManagedRulesBotControlRuleSet: S.optional(
      AWSManagedRulesBotControlRuleSet,
    ),
    AWSManagedRulesATPRuleSet: S.optional(AWSManagedRulesATPRuleSet),
    AWSManagedRulesACFPRuleSet: S.optional(AWSManagedRulesACFPRuleSet),
    AWSManagedRulesAntiDDoSRuleSet: S.optional(AWSManagedRulesAntiDDoSRuleSet),
  }),
).annotations({
  identifier: "ManagedRuleGroupConfig",
}) as any as S.Schema<ManagedRuleGroupConfig>;
export type ManagedRuleGroupConfigs = ManagedRuleGroupConfig[];
export const ManagedRuleGroupConfigs = S.Array(ManagedRuleGroupConfig);
export interface ManagedRuleGroupStatement {
  VendorName: string;
  Name: string;
  Version?: string;
  ExcludedRules?: ExcludedRule[];
  ScopeDownStatement?: Statement;
  ManagedRuleGroupConfigs?: ManagedRuleGroupConfig[];
  RuleActionOverrides?: RuleActionOverride[];
}
export const ManagedRuleGroupStatement = S.suspend(() =>
  S.Struct({
    VendorName: S.String,
    Name: S.String,
    Version: S.optional(S.String),
    ExcludedRules: S.optional(ExcludedRules),
    ScopeDownStatement: S.optional(
      S.suspend((): S.Schema<Statement, any> => Statement).annotations({
        identifier: "Statement",
      }),
    ),
    ManagedRuleGroupConfigs: S.optional(ManagedRuleGroupConfigs),
    RuleActionOverrides: S.optional(RuleActionOverrides),
  }),
).annotations({
  identifier: "ManagedRuleGroupStatement",
}) as any as S.Schema<ManagedRuleGroupStatement>;
export interface FirewallManagerStatement {
  ManagedRuleGroupStatement?: ManagedRuleGroupStatement;
  RuleGroupReferenceStatement?: RuleGroupReferenceStatement;
}
export const FirewallManagerStatement = S.suspend(() =>
  S.Struct({
    ManagedRuleGroupStatement: S.optional(ManagedRuleGroupStatement),
    RuleGroupReferenceStatement: S.optional(RuleGroupReferenceStatement),
  }),
).annotations({
  identifier: "FirewallManagerStatement",
}) as any as S.Schema<FirewallManagerStatement>;
export interface FirewallManagerRuleGroup {
  Name: string;
  Priority: number;
  FirewallManagerStatement: FirewallManagerStatement;
  OverrideAction: OverrideAction;
  VisibilityConfig: VisibilityConfig;
}
export const FirewallManagerRuleGroup = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Priority: S.Number,
    FirewallManagerStatement: FirewallManagerStatement,
    OverrideAction: OverrideAction,
    VisibilityConfig: VisibilityConfig,
  }),
).annotations({
  identifier: "FirewallManagerRuleGroup",
}) as any as S.Schema<FirewallManagerRuleGroup>;
export type FirewallManagerRuleGroups = FirewallManagerRuleGroup[];
export const FirewallManagerRuleGroups = S.Array(FirewallManagerRuleGroup);
export interface WebACL {
  Name: string;
  Id: string;
  ARN: string;
  DefaultAction: DefaultAction;
  Description?: string;
  Rules?: Rule[];
  VisibilityConfig: VisibilityConfig;
  DataProtectionConfig?: DataProtectionConfig;
  Capacity?: number;
  PreProcessFirewallManagerRuleGroups?: FirewallManagerRuleGroup[];
  PostProcessFirewallManagerRuleGroups?: FirewallManagerRuleGroup[];
  ManagedByFirewallManager?: boolean;
  LabelNamespace?: string;
  CustomResponseBodies?: { [key: string]: CustomResponseBody | undefined };
  CaptchaConfig?: CaptchaConfig;
  ChallengeConfig?: ChallengeConfig;
  TokenDomains?: string[];
  AssociationConfig?: AssociationConfig;
  RetrofittedByFirewallManager?: boolean;
  OnSourceDDoSProtectionConfig?: OnSourceDDoSProtectionConfig;
  ApplicationConfig?: ApplicationConfig;
}
export const WebACL = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Id: S.String,
    ARN: S.String,
    DefaultAction: DefaultAction,
    Description: S.optional(S.String),
    Rules: S.optional(Rules),
    VisibilityConfig: VisibilityConfig,
    DataProtectionConfig: S.optional(DataProtectionConfig),
    Capacity: S.optional(S.Number),
    PreProcessFirewallManagerRuleGroups: S.optional(FirewallManagerRuleGroups),
    PostProcessFirewallManagerRuleGroups: S.optional(FirewallManagerRuleGroups),
    ManagedByFirewallManager: S.optional(S.Boolean),
    LabelNamespace: S.optional(S.String),
    CustomResponseBodies: S.optional(CustomResponseBodies),
    CaptchaConfig: S.optional(CaptchaConfig),
    ChallengeConfig: S.optional(ChallengeConfig),
    TokenDomains: S.optional(TokenDomains),
    AssociationConfig: S.optional(AssociationConfig),
    RetrofittedByFirewallManager: S.optional(S.Boolean),
    OnSourceDDoSProtectionConfig: S.optional(OnSourceDDoSProtectionConfig),
    ApplicationConfig: S.optional(ApplicationConfig),
  }),
).annotations({ identifier: "WebACL" }) as any as S.Schema<WebACL>;
export interface GetWebACLForResourceResponse {
  WebACL?: WebACL;
}
export const GetWebACLForResourceResponse = S.suspend(() =>
  S.Struct({ WebACL: S.optional(WebACL) }).pipe(ns),
).annotations({
  identifier: "GetWebACLForResourceResponse",
}) as any as S.Schema<GetWebACLForResourceResponse>;
export interface ListLoggingConfigurationsResponse {
  LoggingConfigurations?: LoggingConfiguration[];
  NextMarker?: string;
}
export const ListLoggingConfigurationsResponse = S.suspend(() =>
  S.Struct({
    LoggingConfigurations: S.optional(LoggingConfigurations),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLoggingConfigurationsResponse",
}) as any as S.Schema<ListLoggingConfigurationsResponse>;
export interface ListResourcesForWebACLResponse {
  ResourceArns?: string[];
}
export const ListResourcesForWebACLResponse = S.suspend(() =>
  S.Struct({ ResourceArns: S.optional(ResourceArns) }).pipe(ns),
).annotations({
  identifier: "ListResourcesForWebACLResponse",
}) as any as S.Schema<ListResourcesForWebACLResponse>;
export interface UpdateIPSetResponse {
  NextLockToken?: string;
}
export const UpdateIPSetResponse = S.suspend(() =>
  S.Struct({ NextLockToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateIPSetResponse",
}) as any as S.Schema<UpdateIPSetResponse>;
export interface UpdateManagedRuleSetVersionExpiryDateResponse {
  ExpiringVersion?: string;
  ExpiryTimestamp?: Date;
  NextLockToken?: string;
}
export const UpdateManagedRuleSetVersionExpiryDateResponse = S.suspend(() =>
  S.Struct({
    ExpiringVersion: S.optional(S.String),
    ExpiryTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NextLockToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateManagedRuleSetVersionExpiryDateResponse",
}) as any as S.Schema<UpdateManagedRuleSetVersionExpiryDateResponse>;
export interface UpdateRegexPatternSetResponse {
  NextLockToken?: string;
}
export const UpdateRegexPatternSetResponse = S.suspend(() =>
  S.Struct({ NextLockToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateRegexPatternSetResponse",
}) as any as S.Schema<UpdateRegexPatternSetResponse>;
export interface UpdateRuleGroupResponse {
  NextLockToken?: string;
}
export const UpdateRuleGroupResponse = S.suspend(() =>
  S.Struct({ NextLockToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateRuleGroupResponse",
}) as any as S.Schema<UpdateRuleGroupResponse>;
export interface UpdateWebACLResponse {
  NextLockToken?: string;
}
export const UpdateWebACLResponse = S.suspend(() =>
  S.Struct({ NextLockToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateWebACLResponse",
}) as any as S.Schema<UpdateWebACLResponse>;
export interface VersionToPublish {
  AssociatedRuleGroupArn?: string;
  ForecastedLifetime?: number;
}
export const VersionToPublish = S.suspend(() =>
  S.Struct({
    AssociatedRuleGroupArn: S.optional(S.String),
    ForecastedLifetime: S.optional(S.Number),
  }),
).annotations({
  identifier: "VersionToPublish",
}) as any as S.Schema<VersionToPublish>;
export type RateBasedStatementAggregateKeyType =
  | "IP"
  | "FORWARDED_IP"
  | "CUSTOM_KEYS"
  | "CONSTANT"
  | (string & {});
export const RateBasedStatementAggregateKeyType = S.String;
export type Statements = Statement[];
export const Statements = S.Array(
  S.suspend((): S.Schema<Statement, any> => Statement).annotations({
    identifier: "Statement",
  }),
) as any as S.Schema<Statements>;
export interface DisallowedFeature {
  Feature?: string;
  RequiredPricingPlan?: string;
}
export const DisallowedFeature = S.suspend(() =>
  S.Struct({
    Feature: S.optional(S.String),
    RequiredPricingPlan: S.optional(S.String),
  }),
).annotations({
  identifier: "DisallowedFeature",
}) as any as S.Schema<DisallowedFeature>;
export type DisallowedFeatures = DisallowedFeature[];
export const DisallowedFeatures = S.Array(DisallowedFeature);
export interface RuleSummary {
  Name?: string;
  Action?: RuleAction;
}
export const RuleSummary = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Action: S.optional(RuleAction) }),
).annotations({ identifier: "RuleSummary" }) as any as S.Schema<RuleSummary>;
export type RuleSummaries = RuleSummary[];
export const RuleSummaries = S.Array(RuleSummary);
export interface LabelSummary {
  Name?: string;
}
export const LabelSummary = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({ identifier: "LabelSummary" }) as any as S.Schema<LabelSummary>;
export type LabelSummaries = LabelSummary[];
export const LabelSummaries = S.Array(LabelSummary);
export interface IPSet {
  Name: string;
  Id: string;
  ARN: string;
  Description?: string;
  IPAddressVersion: IPAddressVersion;
  Addresses: string[];
}
export const IPSet = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Id: S.String,
    ARN: S.String,
    Description: S.optional(S.String),
    IPAddressVersion: IPAddressVersion,
    Addresses: IPAddresses,
  }),
).annotations({ identifier: "IPSet" }) as any as S.Schema<IPSet>;
export interface MobileSdkRelease {
  ReleaseVersion?: string;
  Timestamp?: Date;
  ReleaseNotes?: string;
  Tags?: Tag[];
}
export const MobileSdkRelease = S.suspend(() =>
  S.Struct({
    ReleaseVersion: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ReleaseNotes: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "MobileSdkRelease",
}) as any as S.Schema<MobileSdkRelease>;
export type ParameterExceptionField =
  | "WEB_ACL"
  | "RULE_GROUP"
  | "REGEX_PATTERN_SET"
  | "IP_SET"
  | "MANAGED_RULE_SET"
  | "RULE"
  | "EXCLUDED_RULE"
  | "STATEMENT"
  | "BYTE_MATCH_STATEMENT"
  | "SQLI_MATCH_STATEMENT"
  | "XSS_MATCH_STATEMENT"
  | "SIZE_CONSTRAINT_STATEMENT"
  | "GEO_MATCH_STATEMENT"
  | "RATE_BASED_STATEMENT"
  | "RULE_GROUP_REFERENCE_STATEMENT"
  | "REGEX_PATTERN_REFERENCE_STATEMENT"
  | "IP_SET_REFERENCE_STATEMENT"
  | "MANAGED_RULE_SET_STATEMENT"
  | "LABEL_MATCH_STATEMENT"
  | "AND_STATEMENT"
  | "OR_STATEMENT"
  | "NOT_STATEMENT"
  | "IP_ADDRESS"
  | "IP_ADDRESS_VERSION"
  | "FIELD_TO_MATCH"
  | "TEXT_TRANSFORMATION"
  | "SINGLE_QUERY_ARGUMENT"
  | "SINGLE_HEADER"
  | "DEFAULT_ACTION"
  | "RULE_ACTION"
  | "ENTITY_LIMIT"
  | "OVERRIDE_ACTION"
  | "SCOPE_VALUE"
  | "RESOURCE_ARN"
  | "RESOURCE_TYPE"
  | "TAGS"
  | "TAG_KEYS"
  | "METRIC_NAME"
  | "FIREWALL_MANAGER_STATEMENT"
  | "FALLBACK_BEHAVIOR"
  | "POSITION"
  | "FORWARDED_IP_CONFIG"
  | "IP_SET_FORWARDED_IP_CONFIG"
  | "HEADER_NAME"
  | "CUSTOM_REQUEST_HANDLING"
  | "RESPONSE_CONTENT_TYPE"
  | "CUSTOM_RESPONSE"
  | "CUSTOM_RESPONSE_BODY"
  | "JSON_MATCH_PATTERN"
  | "JSON_MATCH_SCOPE"
  | "BODY_PARSING_FALLBACK_BEHAVIOR"
  | "LOGGING_FILTER"
  | "FILTER_CONDITION"
  | "EXPIRE_TIMESTAMP"
  | "CHANGE_PROPAGATION_STATUS"
  | "ASSOCIABLE_RESOURCE"
  | "LOG_DESTINATION"
  | "MANAGED_RULE_GROUP_CONFIG"
  | "PAYLOAD_TYPE"
  | "HEADER_MATCH_PATTERN"
  | "COOKIE_MATCH_PATTERN"
  | "MAP_MATCH_SCOPE"
  | "OVERSIZE_HANDLING"
  | "CHALLENGE_CONFIG"
  | "TOKEN_DOMAIN"
  | "ATP_RULE_SET_RESPONSE_INSPECTION"
  | "ASSOCIATED_RESOURCE_TYPE"
  | "SCOPE_DOWN"
  | "CUSTOM_KEYS"
  | "ACP_RULE_SET_RESPONSE_INSPECTION"
  | "DATA_PROTECTION_CONFIG"
  | "LOW_REPUTATION_MODE"
  | (string & {});
export const ParameterExceptionField = S.String;
export interface RateBasedStatementManagedKeysIPSet {
  IPAddressVersion?: IPAddressVersion;
  Addresses?: string[];
}
export const RateBasedStatementManagedKeysIPSet = S.suspend(() =>
  S.Struct({
    IPAddressVersion: S.optional(IPAddressVersion),
    Addresses: S.optional(IPAddresses),
  }),
).annotations({
  identifier: "RateBasedStatementManagedKeysIPSet",
}) as any as S.Schema<RateBasedStatementManagedKeysIPSet>;
export interface RegexPatternSet {
  Name?: string;
  Id?: string;
  ARN?: string;
  Description?: string;
  RegularExpressionList?: Regex[];
}
export const RegexPatternSet = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    ARN: S.optional(S.String),
    Description: S.optional(S.String),
    RegularExpressionList: S.optional(RegularExpressionList),
  }),
).annotations({
  identifier: "RegexPatternSet",
}) as any as S.Schema<RegexPatternSet>;
export interface RuleGroup {
  Name: string;
  Id: string;
  Capacity: number;
  ARN: string;
  Description?: string;
  Rules?: Rule[];
  VisibilityConfig: VisibilityConfig;
  LabelNamespace?: string;
  CustomResponseBodies?: { [key: string]: CustomResponseBody | undefined };
  AvailableLabels?: LabelSummary[];
  ConsumedLabels?: LabelSummary[];
}
export const RuleGroup = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Id: S.String,
    Capacity: S.Number,
    ARN: S.String,
    Description: S.optional(S.String),
    Rules: S.optional(Rules),
    VisibilityConfig: VisibilityConfig,
    LabelNamespace: S.optional(S.String),
    CustomResponseBodies: S.optional(CustomResponseBodies),
    AvailableLabels: S.optional(LabelSummaries),
    ConsumedLabels: S.optional(LabelSummaries),
  }),
).annotations({ identifier: "RuleGroup" }) as any as S.Schema<RuleGroup>;
export interface APIKeySummary {
  TokenDomains?: string[];
  APIKey?: string;
  CreationTimestamp?: Date;
  Version?: number;
}
export const APIKeySummary = S.suspend(() =>
  S.Struct({
    TokenDomains: S.optional(TokenDomains),
    APIKey: S.optional(S.String),
    CreationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Version: S.optional(S.Number),
  }),
).annotations({
  identifier: "APIKeySummary",
}) as any as S.Schema<APIKeySummary>;
export type APIKeySummaries = APIKeySummary[];
export const APIKeySummaries = S.Array(APIKeySummary);
export interface ManagedRuleGroupSummary {
  VendorName?: string;
  Name?: string;
  VersioningSupported?: boolean;
  Description?: string;
}
export const ManagedRuleGroupSummary = S.suspend(() =>
  S.Struct({
    VendorName: S.optional(S.String),
    Name: S.optional(S.String),
    VersioningSupported: S.optional(S.Boolean),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "ManagedRuleGroupSummary",
}) as any as S.Schema<ManagedRuleGroupSummary>;
export type ManagedRuleGroupSummaries = ManagedRuleGroupSummary[];
export const ManagedRuleGroupSummaries = S.Array(ManagedRuleGroupSummary);
export interface ManagedRuleGroupVersion {
  Name?: string;
  LastUpdateTimestamp?: Date;
}
export const ManagedRuleGroupVersion = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    LastUpdateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ManagedRuleGroupVersion",
}) as any as S.Schema<ManagedRuleGroupVersion>;
export type ManagedRuleGroupVersions = ManagedRuleGroupVersion[];
export const ManagedRuleGroupVersions = S.Array(ManagedRuleGroupVersion);
export interface IPSetSummary {
  Name?: string;
  Id?: string;
  Description?: string;
  LockToken?: string;
  ARN?: string;
}
export const IPSetSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Description: S.optional(S.String),
    LockToken: S.optional(S.String),
    ARN: S.optional(S.String),
  }),
).annotations({ identifier: "IPSetSummary" }) as any as S.Schema<IPSetSummary>;
export type IPSetSummaries = IPSetSummary[];
export const IPSetSummaries = S.Array(IPSetSummary);
export interface ManagedRuleSetSummary {
  Name?: string;
  Id?: string;
  Description?: string;
  LockToken?: string;
  ARN?: string;
  LabelNamespace?: string;
}
export const ManagedRuleSetSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Description: S.optional(S.String),
    LockToken: S.optional(S.String),
    ARN: S.optional(S.String),
    LabelNamespace: S.optional(S.String),
  }),
).annotations({
  identifier: "ManagedRuleSetSummary",
}) as any as S.Schema<ManagedRuleSetSummary>;
export type ManagedRuleSetSummaries = ManagedRuleSetSummary[];
export const ManagedRuleSetSummaries = S.Array(ManagedRuleSetSummary);
export interface ReleaseSummary {
  ReleaseVersion?: string;
  Timestamp?: Date;
}
export const ReleaseSummary = S.suspend(() =>
  S.Struct({
    ReleaseVersion: S.optional(S.String),
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ReleaseSummary",
}) as any as S.Schema<ReleaseSummary>;
export type ReleaseSummaries = ReleaseSummary[];
export const ReleaseSummaries = S.Array(ReleaseSummary);
export interface RegexPatternSetSummary {
  Name?: string;
  Id?: string;
  Description?: string;
  LockToken?: string;
  ARN?: string;
}
export const RegexPatternSetSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Description: S.optional(S.String),
    LockToken: S.optional(S.String),
    ARN: S.optional(S.String),
  }),
).annotations({
  identifier: "RegexPatternSetSummary",
}) as any as S.Schema<RegexPatternSetSummary>;
export type RegexPatternSetSummaries = RegexPatternSetSummary[];
export const RegexPatternSetSummaries = S.Array(RegexPatternSetSummary);
export interface RuleGroupSummary {
  Name?: string;
  Id?: string;
  Description?: string;
  LockToken?: string;
  ARN?: string;
}
export const RuleGroupSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Description: S.optional(S.String),
    LockToken: S.optional(S.String),
    ARN: S.optional(S.String),
  }),
).annotations({
  identifier: "RuleGroupSummary",
}) as any as S.Schema<RuleGroupSummary>;
export type RuleGroupSummaries = RuleGroupSummary[];
export const RuleGroupSummaries = S.Array(RuleGroupSummary);
export interface TagInfoForResource {
  ResourceARN?: string;
  TagList?: Tag[];
}
export const TagInfoForResource = S.suspend(() =>
  S.Struct({ ResourceARN: S.optional(S.String), TagList: S.optional(TagList) }),
).annotations({
  identifier: "TagInfoForResource",
}) as any as S.Schema<TagInfoForResource>;
export interface WebACLSummary {
  Name?: string;
  Id?: string;
  Description?: string;
  LockToken?: string;
  ARN?: string;
}
export const WebACLSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    Description: S.optional(S.String),
    LockToken: S.optional(S.String),
    ARN: S.optional(S.String),
  }),
).annotations({
  identifier: "WebACLSummary",
}) as any as S.Schema<WebACLSummary>;
export type WebACLSummaries = WebACLSummary[];
export const WebACLSummaries = S.Array(WebACLSummary);
export type VersionsToPublish = { [key: string]: VersionToPublish | undefined };
export const VersionsToPublish = S.Record({
  key: S.String,
  value: S.UndefinedOr(VersionToPublish),
});
export interface AndStatement {
  Statements: Statement[];
}
export const AndStatement = S.suspend(() =>
  S.Struct({
    Statements: S.suspend(() => Statements).annotations({
      identifier: "Statements",
    }),
  }),
).annotations({ identifier: "AndStatement" }) as any as S.Schema<AndStatement>;
export interface OrStatement {
  Statements: Statement[];
}
export const OrStatement = S.suspend(() =>
  S.Struct({
    Statements: S.suspend(() => Statements).annotations({
      identifier: "Statements",
    }),
  }),
).annotations({ identifier: "OrStatement" }) as any as S.Schema<OrStatement>;
export interface NotStatement {
  Statement: Statement;
}
export const NotStatement = S.suspend(() =>
  S.Struct({
    Statement: S.suspend((): S.Schema<Statement, any> => Statement).annotations(
      { identifier: "Statement" },
    ),
  }),
).annotations({ identifier: "NotStatement" }) as any as S.Schema<NotStatement>;
export interface RateLimitHTTPMethod {}
export const RateLimitHTTPMethod = S.suspend(() => S.Struct({})).annotations({
  identifier: "RateLimitHTTPMethod",
}) as any as S.Schema<RateLimitHTTPMethod>;
export interface RateLimitForwardedIP {}
export const RateLimitForwardedIP = S.suspend(() => S.Struct({})).annotations({
  identifier: "RateLimitForwardedIP",
}) as any as S.Schema<RateLimitForwardedIP>;
export interface RateLimitIP {}
export const RateLimitIP = S.suspend(() => S.Struct({})).annotations({
  identifier: "RateLimitIP",
}) as any as S.Schema<RateLimitIP>;
export interface RateLimitAsn {}
export const RateLimitAsn = S.suspend(() => S.Struct({})).annotations({
  identifier: "RateLimitAsn",
}) as any as S.Schema<RateLimitAsn>;
export interface CreateIPSetResponse {
  Summary?: IPSetSummary;
}
export const CreateIPSetResponse = S.suspend(() =>
  S.Struct({ Summary: S.optional(IPSetSummary) }).pipe(ns),
).annotations({
  identifier: "CreateIPSetResponse",
}) as any as S.Schema<CreateIPSetResponse>;
export interface CreateRegexPatternSetResponse {
  Summary?: RegexPatternSetSummary;
}
export const CreateRegexPatternSetResponse = S.suspend(() =>
  S.Struct({ Summary: S.optional(RegexPatternSetSummary) }).pipe(ns),
).annotations({
  identifier: "CreateRegexPatternSetResponse",
}) as any as S.Schema<CreateRegexPatternSetResponse>;
export interface CreateRuleGroupRequest {
  Name: string;
  Scope: Scope;
  Capacity: number;
  Description?: string;
  Rules?: Rule[];
  VisibilityConfig: VisibilityConfig;
  Tags?: Tag[];
  CustomResponseBodies?: { [key: string]: CustomResponseBody | undefined };
}
export const CreateRuleGroupRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Capacity: S.Number,
    Description: S.optional(S.String),
    Rules: S.optional(Rules),
    VisibilityConfig: VisibilityConfig,
    Tags: S.optional(TagList),
    CustomResponseBodies: S.optional(CustomResponseBodies),
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
  identifier: "CreateRuleGroupRequest",
}) as any as S.Schema<CreateRuleGroupRequest>;
export interface DescribeAllManagedProductsResponse {
  ManagedProducts?: ManagedProductDescriptor[];
}
export const DescribeAllManagedProductsResponse = S.suspend(() =>
  S.Struct({ ManagedProducts: S.optional(ManagedProductDescriptors) }).pipe(ns),
).annotations({
  identifier: "DescribeAllManagedProductsResponse",
}) as any as S.Schema<DescribeAllManagedProductsResponse>;
export interface DescribeManagedRuleGroupResponse {
  VersionName?: string;
  SnsTopicArn?: string;
  Capacity?: number;
  Rules?: RuleSummary[];
  LabelNamespace?: string;
  AvailableLabels?: LabelSummary[];
  ConsumedLabels?: LabelSummary[];
}
export const DescribeManagedRuleGroupResponse = S.suspend(() =>
  S.Struct({
    VersionName: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    Capacity: S.optional(S.Number),
    Rules: S.optional(RuleSummaries),
    LabelNamespace: S.optional(S.String),
    AvailableLabels: S.optional(LabelSummaries),
    ConsumedLabels: S.optional(LabelSummaries),
  }).pipe(ns),
).annotations({
  identifier: "DescribeManagedRuleGroupResponse",
}) as any as S.Schema<DescribeManagedRuleGroupResponse>;
export interface GetIPSetResponse {
  IPSet?: IPSet;
  LockToken?: string;
}
export const GetIPSetResponse = S.suspend(() =>
  S.Struct({ IPSet: S.optional(IPSet), LockToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetIPSetResponse",
}) as any as S.Schema<GetIPSetResponse>;
export interface GetMobileSdkReleaseResponse {
  MobileSdkRelease?: MobileSdkRelease;
}
export const GetMobileSdkReleaseResponse = S.suspend(() =>
  S.Struct({ MobileSdkRelease: S.optional(MobileSdkRelease) }).pipe(ns),
).annotations({
  identifier: "GetMobileSdkReleaseResponse",
}) as any as S.Schema<GetMobileSdkReleaseResponse>;
export interface GetRateBasedStatementManagedKeysResponse {
  ManagedKeysIPV4?: RateBasedStatementManagedKeysIPSet;
  ManagedKeysIPV6?: RateBasedStatementManagedKeysIPSet;
}
export const GetRateBasedStatementManagedKeysResponse = S.suspend(() =>
  S.Struct({
    ManagedKeysIPV4: S.optional(RateBasedStatementManagedKeysIPSet),
    ManagedKeysIPV6: S.optional(RateBasedStatementManagedKeysIPSet),
  }).pipe(ns),
).annotations({
  identifier: "GetRateBasedStatementManagedKeysResponse",
}) as any as S.Schema<GetRateBasedStatementManagedKeysResponse>;
export interface GetRegexPatternSetResponse {
  RegexPatternSet?: RegexPatternSet;
  LockToken?: string;
}
export const GetRegexPatternSetResponse = S.suspend(() =>
  S.Struct({
    RegexPatternSet: S.optional(RegexPatternSet),
    LockToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetRegexPatternSetResponse",
}) as any as S.Schema<GetRegexPatternSetResponse>;
export interface GetRuleGroupResponse {
  RuleGroup?: RuleGroup;
  LockToken?: string;
}
export const GetRuleGroupResponse = S.suspend(() =>
  S.Struct({
    RuleGroup: S.optional(RuleGroup),
    LockToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetRuleGroupResponse",
}) as any as S.Schema<GetRuleGroupResponse>;
export interface ListAPIKeysResponse {
  NextMarker?: string;
  APIKeySummaries?: APIKeySummary[];
  ApplicationIntegrationURL?: string;
}
export const ListAPIKeysResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    APIKeySummaries: S.optional(APIKeySummaries),
    ApplicationIntegrationURL: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAPIKeysResponse",
}) as any as S.Schema<ListAPIKeysResponse>;
export interface ListAvailableManagedRuleGroupsResponse {
  NextMarker?: string;
  ManagedRuleGroups?: ManagedRuleGroupSummary[];
}
export const ListAvailableManagedRuleGroupsResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    ManagedRuleGroups: S.optional(ManagedRuleGroupSummaries),
  }).pipe(ns),
).annotations({
  identifier: "ListAvailableManagedRuleGroupsResponse",
}) as any as S.Schema<ListAvailableManagedRuleGroupsResponse>;
export interface ListAvailableManagedRuleGroupVersionsResponse {
  NextMarker?: string;
  Versions?: ManagedRuleGroupVersion[];
  CurrentDefaultVersion?: string;
}
export const ListAvailableManagedRuleGroupVersionsResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    Versions: S.optional(ManagedRuleGroupVersions),
    CurrentDefaultVersion: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAvailableManagedRuleGroupVersionsResponse",
}) as any as S.Schema<ListAvailableManagedRuleGroupVersionsResponse>;
export interface ListIPSetsResponse {
  NextMarker?: string;
  IPSets?: IPSetSummary[];
}
export const ListIPSetsResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    IPSets: S.optional(IPSetSummaries),
  }).pipe(ns),
).annotations({
  identifier: "ListIPSetsResponse",
}) as any as S.Schema<ListIPSetsResponse>;
export interface ListManagedRuleSetsResponse {
  NextMarker?: string;
  ManagedRuleSets?: ManagedRuleSetSummary[];
}
export const ListManagedRuleSetsResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    ManagedRuleSets: S.optional(ManagedRuleSetSummaries),
  }).pipe(ns),
).annotations({
  identifier: "ListManagedRuleSetsResponse",
}) as any as S.Schema<ListManagedRuleSetsResponse>;
export interface ListMobileSdkReleasesResponse {
  ReleaseSummaries?: ReleaseSummary[];
  NextMarker?: string;
}
export const ListMobileSdkReleasesResponse = S.suspend(() =>
  S.Struct({
    ReleaseSummaries: S.optional(ReleaseSummaries),
    NextMarker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListMobileSdkReleasesResponse",
}) as any as S.Schema<ListMobileSdkReleasesResponse>;
export interface ListRegexPatternSetsResponse {
  NextMarker?: string;
  RegexPatternSets?: RegexPatternSetSummary[];
}
export const ListRegexPatternSetsResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    RegexPatternSets: S.optional(RegexPatternSetSummaries),
  }).pipe(ns),
).annotations({
  identifier: "ListRegexPatternSetsResponse",
}) as any as S.Schema<ListRegexPatternSetsResponse>;
export interface ListRuleGroupsResponse {
  NextMarker?: string;
  RuleGroups?: RuleGroupSummary[];
}
export const ListRuleGroupsResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    RuleGroups: S.optional(RuleGroupSummaries),
  }).pipe(ns),
).annotations({
  identifier: "ListRuleGroupsResponse",
}) as any as S.Schema<ListRuleGroupsResponse>;
export interface ListTagsForResourceResponse {
  NextMarker?: string;
  TagInfoForResource?: TagInfoForResource;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    TagInfoForResource: S.optional(TagInfoForResource),
  }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListWebACLsResponse {
  NextMarker?: string;
  WebACLs?: WebACLSummary[];
}
export const ListWebACLsResponse = S.suspend(() =>
  S.Struct({
    NextMarker: S.optional(S.String),
    WebACLs: S.optional(WebACLSummaries),
  }).pipe(ns),
).annotations({
  identifier: "ListWebACLsResponse",
}) as any as S.Schema<ListWebACLsResponse>;
export interface PutManagedRuleSetVersionsRequest {
  Name: string;
  Scope: Scope;
  Id: string;
  LockToken: string;
  RecommendedVersion?: string;
  VersionsToPublish?: { [key: string]: VersionToPublish | undefined };
}
export const PutManagedRuleSetVersionsRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    Id: S.String,
    LockToken: S.String,
    RecommendedVersion: S.optional(S.String),
    VersionsToPublish: S.optional(VersionsToPublish),
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
  identifier: "PutManagedRuleSetVersionsRequest",
}) as any as S.Schema<PutManagedRuleSetVersionsRequest>;
export interface ManagedRuleSetVersion {
  AssociatedRuleGroupArn?: string;
  Capacity?: number;
  ForecastedLifetime?: number;
  PublishTimestamp?: Date;
  LastUpdateTimestamp?: Date;
  ExpiryTimestamp?: Date;
}
export const ManagedRuleSetVersion = S.suspend(() =>
  S.Struct({
    AssociatedRuleGroupArn: S.optional(S.String),
    Capacity: S.optional(S.Number),
    ForecastedLifetime: S.optional(S.Number),
    PublishTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdateTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ExpiryTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ManagedRuleSetVersion",
}) as any as S.Schema<ManagedRuleSetVersion>;
export type FailureReason =
  | "TOKEN_MISSING"
  | "TOKEN_EXPIRED"
  | "TOKEN_INVALID"
  | "TOKEN_DOMAIN_MISMATCH"
  | (string & {});
export const FailureReason = S.String;
export interface RateLimitHeader {
  Name: string;
  TextTransformations: TextTransformation[];
}
export const RateLimitHeader = S.suspend(() =>
  S.Struct({ Name: S.String, TextTransformations: TextTransformations }),
).annotations({
  identifier: "RateLimitHeader",
}) as any as S.Schema<RateLimitHeader>;
export interface RateLimitCookie {
  Name: string;
  TextTransformations: TextTransformation[];
}
export const RateLimitCookie = S.suspend(() =>
  S.Struct({ Name: S.String, TextTransformations: TextTransformations }),
).annotations({
  identifier: "RateLimitCookie",
}) as any as S.Schema<RateLimitCookie>;
export interface RateLimitQueryArgument {
  Name: string;
  TextTransformations: TextTransformation[];
}
export const RateLimitQueryArgument = S.suspend(() =>
  S.Struct({ Name: S.String, TextTransformations: TextTransformations }),
).annotations({
  identifier: "RateLimitQueryArgument",
}) as any as S.Schema<RateLimitQueryArgument>;
export interface RateLimitQueryString {
  TextTransformations: TextTransformation[];
}
export const RateLimitQueryString = S.suspend(() =>
  S.Struct({ TextTransformations: TextTransformations }),
).annotations({
  identifier: "RateLimitQueryString",
}) as any as S.Schema<RateLimitQueryString>;
export interface RateLimitLabelNamespace {
  Namespace: string;
}
export const RateLimitLabelNamespace = S.suspend(() =>
  S.Struct({ Namespace: S.String }),
).annotations({
  identifier: "RateLimitLabelNamespace",
}) as any as S.Schema<RateLimitLabelNamespace>;
export interface RateLimitUriPath {
  TextTransformations: TextTransformation[];
}
export const RateLimitUriPath = S.suspend(() =>
  S.Struct({ TextTransformations: TextTransformations }),
).annotations({
  identifier: "RateLimitUriPath",
}) as any as S.Schema<RateLimitUriPath>;
export interface RateLimitJA3Fingerprint {
  FallbackBehavior: FallbackBehavior;
}
export const RateLimitJA3Fingerprint = S.suspend(() =>
  S.Struct({ FallbackBehavior: FallbackBehavior }),
).annotations({
  identifier: "RateLimitJA3Fingerprint",
}) as any as S.Schema<RateLimitJA3Fingerprint>;
export interface RateLimitJA4Fingerprint {
  FallbackBehavior: FallbackBehavior;
}
export const RateLimitJA4Fingerprint = S.suspend(() =>
  S.Struct({ FallbackBehavior: FallbackBehavior }),
).annotations({
  identifier: "RateLimitJA4Fingerprint",
}) as any as S.Schema<RateLimitJA4Fingerprint>;
export interface CreateRuleGroupResponse {
  Summary?: RuleGroupSummary;
}
export const CreateRuleGroupResponse = S.suspend(() =>
  S.Struct({ Summary: S.optional(RuleGroupSummary) }).pipe(ns),
).annotations({
  identifier: "CreateRuleGroupResponse",
}) as any as S.Schema<CreateRuleGroupResponse>;
export interface PutManagedRuleSetVersionsResponse {
  NextLockToken?: string;
}
export const PutManagedRuleSetVersionsResponse = S.suspend(() =>
  S.Struct({ NextLockToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutManagedRuleSetVersionsResponse",
}) as any as S.Schema<PutManagedRuleSetVersionsResponse>;
export type PublishedVersions = {
  [key: string]: ManagedRuleSetVersion | undefined;
};
export const PublishedVersions = S.Record({
  key: S.String,
  value: S.UndefinedOr(ManagedRuleSetVersion),
});
export interface HTTPHeader {
  Name?: string;
  Value?: string;
}
export const HTTPHeader = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "HTTPHeader" }) as any as S.Schema<HTTPHeader>;
export type HTTPHeaders = HTTPHeader[];
export const HTTPHeaders = S.Array(HTTPHeader);
export interface HTTPRequest {
  ClientIP?: string;
  Country?: string;
  URI?: string;
  Method?: string;
  HTTPVersion?: string;
  Headers?: HTTPHeader[];
}
export const HTTPRequest = S.suspend(() =>
  S.Struct({
    ClientIP: S.optional(S.String),
    Country: S.optional(S.String),
    URI: S.optional(S.String),
    Method: S.optional(S.String),
    HTTPVersion: S.optional(S.String),
    Headers: S.optional(HTTPHeaders),
  }),
).annotations({ identifier: "HTTPRequest" }) as any as S.Schema<HTTPRequest>;
export interface CaptchaResponse {
  ResponseCode?: number;
  SolveTimestamp?: number;
  FailureReason?: FailureReason;
}
export const CaptchaResponse = S.suspend(() =>
  S.Struct({
    ResponseCode: S.optional(S.Number),
    SolveTimestamp: S.optional(S.Number),
    FailureReason: S.optional(FailureReason),
  }),
).annotations({
  identifier: "CaptchaResponse",
}) as any as S.Schema<CaptchaResponse>;
export interface ChallengeResponse {
  ResponseCode?: number;
  SolveTimestamp?: number;
  FailureReason?: FailureReason;
}
export const ChallengeResponse = S.suspend(() =>
  S.Struct({
    ResponseCode: S.optional(S.Number),
    SolveTimestamp: S.optional(S.Number),
    FailureReason: S.optional(FailureReason),
  }),
).annotations({
  identifier: "ChallengeResponse",
}) as any as S.Schema<ChallengeResponse>;
export interface RateBasedStatementCustomKey {
  Header?: RateLimitHeader;
  Cookie?: RateLimitCookie;
  QueryArgument?: RateLimitQueryArgument;
  QueryString?: RateLimitQueryString;
  HTTPMethod?: RateLimitHTTPMethod;
  ForwardedIP?: RateLimitForwardedIP;
  IP?: RateLimitIP;
  LabelNamespace?: RateLimitLabelNamespace;
  UriPath?: RateLimitUriPath;
  JA3Fingerprint?: RateLimitJA3Fingerprint;
  JA4Fingerprint?: RateLimitJA4Fingerprint;
  ASN?: RateLimitAsn;
}
export const RateBasedStatementCustomKey = S.suspend(() =>
  S.Struct({
    Header: S.optional(RateLimitHeader),
    Cookie: S.optional(RateLimitCookie),
    QueryArgument: S.optional(RateLimitQueryArgument),
    QueryString: S.optional(RateLimitQueryString),
    HTTPMethod: S.optional(RateLimitHTTPMethod),
    ForwardedIP: S.optional(RateLimitForwardedIP),
    IP: S.optional(RateLimitIP),
    LabelNamespace: S.optional(RateLimitLabelNamespace),
    UriPath: S.optional(RateLimitUriPath),
    JA3Fingerprint: S.optional(RateLimitJA3Fingerprint),
    JA4Fingerprint: S.optional(RateLimitJA4Fingerprint),
    ASN: S.optional(RateLimitAsn),
  }),
).annotations({
  identifier: "RateBasedStatementCustomKey",
}) as any as S.Schema<RateBasedStatementCustomKey>;
export type RateBasedStatementCustomKeys = RateBasedStatementCustomKey[];
export const RateBasedStatementCustomKeys = S.Array(
  RateBasedStatementCustomKey,
);
export interface ManagedRuleSet {
  Name: string;
  Id: string;
  ARN: string;
  Description?: string;
  PublishedVersions?: { [key: string]: ManagedRuleSetVersion | undefined };
  RecommendedVersion?: string;
  LabelNamespace?: string;
}
export const ManagedRuleSet = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Id: S.String,
    ARN: S.String,
    Description: S.optional(S.String),
    PublishedVersions: S.optional(PublishedVersions),
    RecommendedVersion: S.optional(S.String),
    LabelNamespace: S.optional(S.String),
  }),
).annotations({
  identifier: "ManagedRuleSet",
}) as any as S.Schema<ManagedRuleSet>;
export interface SampledHTTPRequest {
  Request: HTTPRequest;
  Weight: number;
  Timestamp?: Date;
  Action?: string;
  RuleNameWithinRuleGroup?: string;
  RequestHeadersInserted?: HTTPHeader[];
  ResponseCodeSent?: number;
  Labels?: Label[];
  CaptchaResponse?: CaptchaResponse;
  ChallengeResponse?: ChallengeResponse;
  OverriddenAction?: string;
}
export const SampledHTTPRequest = S.suspend(() =>
  S.Struct({
    Request: HTTPRequest,
    Weight: S.Number,
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Action: S.optional(S.String),
    RuleNameWithinRuleGroup: S.optional(S.String),
    RequestHeadersInserted: S.optional(HTTPHeaders),
    ResponseCodeSent: S.optional(S.Number),
    Labels: S.optional(Labels),
    CaptchaResponse: S.optional(CaptchaResponse),
    ChallengeResponse: S.optional(ChallengeResponse),
    OverriddenAction: S.optional(S.String),
  }),
).annotations({
  identifier: "SampledHTTPRequest",
}) as any as S.Schema<SampledHTTPRequest>;
export type SampledHTTPRequests = SampledHTTPRequest[];
export const SampledHTTPRequests = S.Array(SampledHTTPRequest);
export interface RateBasedStatement {
  Limit: number;
  EvaluationWindowSec?: number;
  AggregateKeyType: RateBasedStatementAggregateKeyType;
  ScopeDownStatement?: Statement;
  ForwardedIPConfig?: ForwardedIPConfig;
  CustomKeys?: RateBasedStatementCustomKey[];
}
export const RateBasedStatement = S.suspend(() =>
  S.Struct({
    Limit: S.Number,
    EvaluationWindowSec: S.optional(S.Number),
    AggregateKeyType: RateBasedStatementAggregateKeyType,
    ScopeDownStatement: S.optional(
      S.suspend((): S.Schema<Statement, any> => Statement).annotations({
        identifier: "Statement",
      }),
    ),
    ForwardedIPConfig: S.optional(ForwardedIPConfig),
    CustomKeys: S.optional(RateBasedStatementCustomKeys),
  }),
).annotations({
  identifier: "RateBasedStatement",
}) as any as S.Schema<RateBasedStatement>;
export interface CreateWebACLRequest {
  Name: string;
  Scope: Scope;
  DefaultAction: DefaultAction;
  Description?: string;
  Rules?: Rule[];
  VisibilityConfig: VisibilityConfig;
  DataProtectionConfig?: DataProtectionConfig;
  Tags?: Tag[];
  CustomResponseBodies?: { [key: string]: CustomResponseBody | undefined };
  CaptchaConfig?: CaptchaConfig;
  ChallengeConfig?: ChallengeConfig;
  TokenDomains?: string[];
  AssociationConfig?: AssociationConfig;
  OnSourceDDoSProtectionConfig?: OnSourceDDoSProtectionConfig;
  ApplicationConfig?: ApplicationConfig;
}
export const CreateWebACLRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Scope: Scope,
    DefaultAction: DefaultAction,
    Description: S.optional(S.String),
    Rules: S.optional(Rules),
    VisibilityConfig: VisibilityConfig,
    DataProtectionConfig: S.optional(DataProtectionConfig),
    Tags: S.optional(TagList),
    CustomResponseBodies: S.optional(CustomResponseBodies),
    CaptchaConfig: S.optional(CaptchaConfig),
    ChallengeConfig: S.optional(ChallengeConfig),
    TokenDomains: S.optional(TokenDomains),
    AssociationConfig: S.optional(AssociationConfig),
    OnSourceDDoSProtectionConfig: S.optional(OnSourceDDoSProtectionConfig),
    ApplicationConfig: S.optional(ApplicationConfig),
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
  identifier: "CreateWebACLRequest",
}) as any as S.Schema<CreateWebACLRequest>;
export interface GetManagedRuleSetResponse {
  ManagedRuleSet?: ManagedRuleSet;
  LockToken?: string;
}
export const GetManagedRuleSetResponse = S.suspend(() =>
  S.Struct({
    ManagedRuleSet: S.optional(ManagedRuleSet),
    LockToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetManagedRuleSetResponse",
}) as any as S.Schema<GetManagedRuleSetResponse>;
export interface GetSampledRequestsResponse {
  SampledRequests?: SampledHTTPRequest[];
  PopulationSize?: number;
  TimeWindow?: TimeWindow;
}
export const GetSampledRequestsResponse = S.suspend(() =>
  S.Struct({
    SampledRequests: S.optional(SampledHTTPRequests),
    PopulationSize: S.optional(S.Number),
    TimeWindow: S.optional(TimeWindow),
  }).pipe(ns),
).annotations({
  identifier: "GetSampledRequestsResponse",
}) as any as S.Schema<GetSampledRequestsResponse>;
export interface GetWebACLResponse {
  WebACL?: WebACL;
  LockToken?: string;
  ApplicationIntegrationURL?: string;
}
export const GetWebACLResponse = S.suspend(() =>
  S.Struct({
    WebACL: S.optional(WebACL),
    LockToken: S.optional(S.String),
    ApplicationIntegrationURL: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetWebACLResponse",
}) as any as S.Schema<GetWebACLResponse>;
export interface CreateWebACLResponse {
  Summary?: WebACLSummary;
}
export const CreateWebACLResponse = S.suspend(() =>
  S.Struct({ Summary: S.optional(WebACLSummary) }).pipe(ns),
).annotations({
  identifier: "CreateWebACLResponse",
}) as any as S.Schema<CreateWebACLResponse>;
export interface PutLoggingConfigurationRequest {
  LoggingConfiguration: LoggingConfiguration;
}
export const PutLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({ LoggingConfiguration: LoggingConfiguration }).pipe(
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
  identifier: "PutLoggingConfigurationRequest",
}) as any as S.Schema<PutLoggingConfigurationRequest>;
export interface PutLoggingConfigurationResponse {
  LoggingConfiguration?: LoggingConfiguration;
}
export const PutLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({ LoggingConfiguration: S.optional(LoggingConfiguration) }).pipe(ns),
).annotations({
  identifier: "PutLoggingConfigurationResponse",
}) as any as S.Schema<PutLoggingConfigurationResponse>;
export interface CheckCapacityRequest {
  Scope: Scope;
  Rules: Rule[];
}
export const CheckCapacityRequest = S.suspend(() =>
  S.Struct({ Scope: Scope, Rules: Rules }).pipe(
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
  identifier: "CheckCapacityRequest",
}) as any as S.Schema<CheckCapacityRequest>;
export interface CheckCapacityResponse {
  Capacity?: number;
}
export const CheckCapacityResponse = S.suspend(() =>
  S.Struct({ Capacity: S.optional(S.Number) }).pipe(ns),
).annotations({
  identifier: "CheckCapacityResponse",
}) as any as S.Schema<CheckCapacityResponse>;

//# Errors
export class WAFInternalErrorException extends S.TaggedError<WAFInternalErrorException>()(
  "WAFInternalErrorException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class WAFAssociatedItemException extends S.TaggedError<WAFAssociatedItemException>()(
  "WAFAssociatedItemException",
  { Message: S.optional(S.String) },
) {}
export class WAFFeatureNotIncludedInPricingPlanException extends S.TaggedError<WAFFeatureNotIncludedInPricingPlanException>()(
  "WAFFeatureNotIncludedInPricingPlanException",
  {
    Message: S.optional(S.String),
    DisallowedFeatures: S.optional(DisallowedFeatures),
  },
) {}
export class WAFInvalidOperationException extends S.TaggedError<WAFInvalidOperationException>()(
  "WAFInvalidOperationException",
  { Message: S.optional(S.String) },
) {}
export class WAFInvalidParameterException extends S.TaggedError<WAFInvalidParameterException>()(
  "WAFInvalidParameterException",
  {
    message: S.optional(S.String),
    Field: S.optional(ParameterExceptionField),
    Parameter: S.optional(S.String),
    Reason: S.optional(S.String),
  },
) {}
export class WAFDuplicateItemException extends S.TaggedError<WAFDuplicateItemException>()(
  "WAFDuplicateItemException",
  { Message: S.optional(S.String) },
) {}
export class WAFConfigurationWarningException extends S.TaggedError<WAFConfigurationWarningException>()(
  "WAFConfigurationWarningException",
  { Message: S.optional(S.String) },
) {}
export class WAFExpiredManagedRuleGroupVersionException extends S.TaggedError<WAFExpiredManagedRuleGroupVersionException>()(
  "WAFExpiredManagedRuleGroupVersionException",
  { Message: S.optional(S.String) },
) {}
export class WAFNonexistentItemException extends S.TaggedError<WAFNonexistentItemException>()(
  "WAFNonexistentItemException",
  { Message: S.optional(S.String) },
) {}
export class WAFInvalidResourceException extends S.TaggedError<WAFInvalidResourceException>()(
  "WAFInvalidResourceException",
  { Message: S.optional(S.String) },
) {}
export class WAFLimitsExceededException extends S.TaggedError<WAFLimitsExceededException>()(
  "WAFLimitsExceededException",
  { Message: S.optional(S.String), SourceType: S.optional(S.String) },
) {}
export class WAFInvalidPermissionPolicyException extends S.TaggedError<WAFInvalidPermissionPolicyException>()(
  "WAFInvalidPermissionPolicyException",
  { Message: S.optional(S.String) },
) {}
export class WAFOptimisticLockException extends S.TaggedError<WAFOptimisticLockException>()(
  "WAFOptimisticLockException",
  { Message: S.optional(S.String) },
) {}
export class WAFUnsupportedAggregateKeyTypeException extends S.TaggedError<WAFUnsupportedAggregateKeyTypeException>()(
  "WAFUnsupportedAggregateKeyTypeException",
  { Message: S.optional(S.String) },
) {}
export class WAFTagOperationException extends S.TaggedError<WAFTagOperationException>()(
  "WAFTagOperationException",
  { Message: S.optional(S.String) },
) {}
export class WAFUnavailableEntityException extends S.TaggedError<WAFUnavailableEntityException>()(
  "WAFUnavailableEntityException",
  { Message: S.optional(S.String) },
) {}
export class WAFTagOperationInternalErrorException extends S.TaggedError<WAFTagOperationInternalErrorException>()(
  "WAFTagOperationInternalErrorException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class WAFSubscriptionNotFoundException extends S.TaggedError<WAFSubscriptionNotFoundException>()(
  "WAFSubscriptionNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class WAFLogDestinationPermissionIssueException extends S.TaggedError<WAFLogDestinationPermissionIssueException>()(
  "WAFLogDestinationPermissionIssueException",
  { Message: S.optional(S.String) },
) {}
export class WAFServiceLinkedRoleErrorException extends S.TaggedError<WAFServiceLinkedRoleErrorException>()(
  "WAFServiceLinkedRoleErrorException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves an array of managed rule groups that are available for you to use. This list
 * includes all Amazon Web Services Managed Rules rule groups and all of the Amazon Web Services Marketplace managed rule groups that you're
 * subscribed to.
 */
export const listAvailableManagedRuleGroups: (
  input: ListAvailableManagedRuleGroupsRequest,
) => effect.Effect<
  ListAvailableManagedRuleGroupsResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAvailableManagedRuleGroupsRequest,
  output: ListAvailableManagedRuleGroupsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
  ],
}));
/**
 * Retrieves an array of IPSetSummary objects for the IP sets that you
 * manage.
 */
export const listIPSets: (
  input: ListIPSetsRequest,
) => effect.Effect<
  ListIPSetsResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIPSetsRequest,
  output: ListIPSetsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
  ],
}));
/**
 * Retrieves the managed rule sets that you own.
 *
 * This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.
 *
 * Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are `ListManagedRuleSets`, `GetManagedRuleSet`, `PutManagedRuleSetVersions`, and `UpdateManagedRuleSetVersionExpiryDate`.
 */
export const listManagedRuleSets: (
  input: ListManagedRuleSetsRequest,
) => effect.Effect<
  ListManagedRuleSetsResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListManagedRuleSetsRequest,
  output: ListManagedRuleSetsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
  ],
}));
/**
 * Retrieves a list of the available releases for the mobile SDK and the specified device
 * platform.
 *
 * The mobile SDK is not generally available. Customers who have access to the mobile SDK can use it to establish and manage WAF tokens for use in HTTP(S) requests from a mobile device to WAF. For more information, see
 * WAF client application integration in the *WAF Developer Guide*.
 */
export const listMobileSdkReleases: (
  input: ListMobileSdkReleasesRequest,
) => effect.Effect<
  ListMobileSdkReleasesResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMobileSdkReleasesRequest,
  output: ListMobileSdkReleasesResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
  ],
}));
/**
 * Retrieves an array of RegexPatternSetSummary objects for the regex
 * pattern sets that you manage.
 */
export const listRegexPatternSets: (
  input: ListRegexPatternSetsRequest,
) => effect.Effect<
  ListRegexPatternSetsResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRegexPatternSetsRequest,
  output: ListRegexPatternSetsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
  ],
}));
/**
 * Retrieves an array of RuleGroupSummary objects for the rule groups
 * that you manage.
 */
export const listRuleGroups: (
  input: ListRuleGroupsRequest,
) => effect.Effect<
  ListRuleGroupsResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRuleGroupsRequest,
  output: ListRuleGroupsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
  ],
}));
/**
 * Retrieves an array of WebACLSummary objects for the web ACLs that you
 * manage.
 */
export const listWebACLs: (
  input: ListWebACLsRequest,
) => effect.Effect<
  ListWebACLsResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWebACLsRequest,
  output: ListWebACLsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
  ],
}));
/**
 * Provides high-level information for the managed rule groups owned by a specific vendor.
 */
export const describeManagedProductsByVendor: (
  input: DescribeManagedProductsByVendorRequest,
) => effect.Effect<
  DescribeManagedProductsByVendorResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeManagedProductsByVendorRequest,
  output: DescribeManagedProductsByVendorResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
  ],
}));
/**
 * Retrieves an array of your LoggingConfiguration objects.
 */
export const listLoggingConfigurations: (
  input: ListLoggingConfigurationsRequest,
) => effect.Effect<
  ListLoggingConfigurationsResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLoggingConfigurationsRequest,
  output: ListLoggingConfigurationsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
  ],
}));
/**
 * Provides high-level information for the Amazon Web Services Managed Rules rule groups and Amazon Web Services Marketplace managed rule groups.
 */
export const describeAllManagedProducts: (
  input: DescribeAllManagedProductsRequest,
) => effect.Effect<
  DescribeAllManagedProductsResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAllManagedProductsRequest,
  output: DescribeAllManagedProductsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
  ],
}));
/**
 * Returns the IAM policy that is attached to the specified rule group.
 *
 * You must be the owner of the rule group to perform this operation.
 */
export const getPermissionPolicy: (
  input: GetPermissionPolicyRequest,
) => effect.Effect<
  GetPermissionPolicyResponse,
  | WAFInternalErrorException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPermissionPolicyRequest,
  output: GetPermissionPolicyResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Retrieves a list of the API keys that you've defined for the specified scope.
 *
 * API keys are required for the integration of the CAPTCHA API in your JavaScript client applications.
 * The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users.
 * For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the *WAF Developer Guide*.
 */
export const listAPIKeys: (
  input: ListAPIKeysRequest,
) => effect.Effect<
  ListAPIKeysResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFInvalidResourceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAPIKeysRequest,
  output: ListAPIKeysResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFInvalidResourceException,
  ],
}));
/**
 * Use this to share a rule group with other accounts.
 *
 * This action attaches an IAM policy to the specified resource. You must be the owner of the rule group to perform this operation.
 *
 * This action is subject to the following restrictions:
 *
 * - You can attach only one policy with each `PutPermissionPolicy`
 * request.
 *
 * - The ARN in the request must be a valid WAF RuleGroup ARN and the
 * rule group must exist in the same Region.
 *
 * - The user making the request must be the owner of the rule group.
 *
 * If a rule group has been shared with your account, you can access it through the call `GetRuleGroup`,
 * and you can reference it in `CreateWebACL` and `UpdateWebACL`.
 * Rule groups that are shared with you don't appear in your WAF console rule groups listing.
 */
export const putPermissionPolicy: (
  input: PutPermissionPolicyRequest,
) => effect.Effect<
  PutPermissionPolicyResponse,
  | WAFInternalErrorException
  | WAFInvalidParameterException
  | WAFInvalidPermissionPolicyException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPermissionPolicyRequest,
  output: PutPermissionPolicyResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidParameterException,
    WAFInvalidPermissionPolicyException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Retrieves the specified RegexPatternSet.
 */
export const getRegexPatternSet: (
  input: GetRegexPatternSetRequest,
) => effect.Effect<
  GetRegexPatternSetResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegexPatternSetRequest,
  output: GetRegexPatternSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Retrieves the specified RuleGroup.
 */
export const getRuleGroup: (
  input: GetRuleGroupRequest,
) => effect.Effect<
  GetRuleGroupResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRuleGroupRequest,
  output: GetRuleGroupResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Returns a list of the available versions for the specified managed rule group.
 */
export const listAvailableManagedRuleGroupVersions: (
  input: ListAvailableManagedRuleGroupVersionsRequest,
) => effect.Effect<
  ListAvailableManagedRuleGroupVersionsResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAvailableManagedRuleGroupVersionsRequest,
  output: ListAvailableManagedRuleGroupVersionsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Generates a presigned download URL for the specified release of the mobile SDK.
 *
 * The mobile SDK is not generally available. Customers who have access to the mobile SDK can use it to establish and manage WAF tokens for use in HTTP(S) requests from a mobile device to WAF. For more information, see
 * WAF client application integration in the *WAF Developer Guide*.
 */
export const generateMobileSdkReleaseUrl: (
  input: GenerateMobileSdkReleaseUrlRequest,
) => effect.Effect<
  GenerateMobileSdkReleaseUrlResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateMobileSdkReleaseUrlRequest,
  output: GenerateMobileSdkReleaseUrlResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Returns the LoggingConfiguration for the specified web ACL.
 */
export const getLoggingConfiguration: (
  input: GetLoggingConfigurationRequest,
) => effect.Effect<
  GetLoggingConfigurationResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLoggingConfigurationRequest,
  output: GetLoggingConfigurationResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Retrieves an array of the Amazon Resource Names (ARNs) for the resources that
 * are associated with the specified web ACL.
 *
 * For Amazon CloudFront, don't use this call. Instead, use the CloudFront call
 * `ListDistributionsByWebACLId`. For information, see ListDistributionsByWebACLId
 * in the *Amazon CloudFront API Reference*.
 *
 * **Required permissions for customer-managed IAM policies**
 *
 * This call requires permissions that are specific to the protected resource type.
 * For details, see Permissions for ListResourcesForWebACL in the *WAF Developer Guide*.
 */
export const listResourcesForWebACL: (
  input: ListResourcesForWebACLRequest,
) => effect.Effect<
  ListResourcesForWebACLResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListResourcesForWebACLRequest,
  output: ListResourcesForWebACLResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Disassociates the specified resource from its web ACL
 * association, if it has one.
 *
 * Use this for all resource types except for Amazon CloudFront distributions. For Amazon CloudFront, call `UpdateDistribution` for the distribution and provide an empty web ACL ID. For information, see UpdateDistribution in the *Amazon CloudFront API Reference*.
 *
 * **Required permissions for customer-managed IAM policies**
 *
 * This call requires permissions that are specific to the protected resource type.
 * For details, see Permissions for DisassociateWebACL in the *WAF Developer Guide*.
 */
export const disassociateWebACL: (
  input: DisassociateWebACLRequest,
) => effect.Effect<
  DisassociateWebACLResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateWebACLRequest,
  output: DisassociateWebACLResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Permanently deletes an IAM policy from the specified rule group.
 *
 * You must be the owner of the rule group to perform this operation.
 */
export const deletePermissionPolicy: (
  input: DeletePermissionPolicyRequest,
) => effect.Effect<
  DeletePermissionPolicyResponse,
  | WAFInternalErrorException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePermissionPolicyRequest,
  output: DeletePermissionPolicyResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Retrieves the specified IPSet.
 */
export const getIPSet: (
  input: GetIPSetRequest,
) => effect.Effect<
  GetIPSetResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIPSetRequest,
  output: GetIPSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Retrieves information for the specified mobile SDK release, including release notes and
 * tags.
 *
 * The mobile SDK is not generally available. Customers who have access to the mobile SDK can use it to establish and manage WAF tokens for use in HTTP(S) requests from a mobile device to WAF. For more information, see
 * WAF client application integration in the *WAF Developer Guide*.
 */
export const getMobileSdkRelease: (
  input: GetMobileSdkReleaseRequest,
) => effect.Effect<
  GetMobileSdkReleaseResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMobileSdkReleaseRequest,
  output: GetMobileSdkReleaseResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Returns your API key in decrypted form. Use this to check the token domains that you have defined for the key.
 *
 * API keys are required for the integration of the CAPTCHA API in your JavaScript client applications.
 * The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users.
 * For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the *WAF Developer Guide*.
 */
export const getDecryptedAPIKey: (
  input: GetDecryptedAPIKeyRequest,
) => effect.Effect<
  GetDecryptedAPIKeyResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFInvalidResourceException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDecryptedAPIKeyRequest,
  output: GetDecryptedAPIKeyResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFInvalidResourceException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Provides high-level information for a managed rule group, including descriptions of the rules.
 */
export const describeManagedRuleGroup: (
  input: DescribeManagedRuleGroupRequest,
) => effect.Effect<
  DescribeManagedRuleGroupResponse,
  | WAFExpiredManagedRuleGroupVersionException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFInvalidResourceException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeManagedRuleGroupRequest,
  output: DescribeManagedRuleGroupResponse,
  errors: [
    WAFExpiredManagedRuleGroupVersionException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFInvalidResourceException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Creates an API key that contains a set of token domains.
 *
 * API keys are required for the integration of the CAPTCHA API in your JavaScript client applications.
 * The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users.
 * For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the *WAF Developer Guide*.
 *
 * You can use a single key for up to 5 domains. After you generate a key, you can copy it for use in your JavaScript
 * integration.
 */
export const createAPIKey: (
  input: CreateAPIKeyRequest,
) => effect.Effect<
  CreateAPIKeyResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFLimitsExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAPIKeyRequest,
  output: CreateAPIKeyResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
  ],
}));
/**
 * Retrieves the specified managed rule set.
 *
 * This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.
 *
 * Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are `ListManagedRuleSets`, `GetManagedRuleSet`, `PutManagedRuleSetVersions`, and `UpdateManagedRuleSetVersionExpiryDate`.
 */
export const getManagedRuleSet: (
  input: GetManagedRuleSetRequest,
) => effect.Effect<
  GetManagedRuleSetResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetManagedRuleSetRequest,
  output: GetManagedRuleSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Gets detailed information about a specified number of requests--a sample--that WAF
 * randomly selects from among the first 5,000 requests that your Amazon Web Services resource received
 * during a time range that you choose. You can specify a sample size of up to 500 requests,
 * and you can specify any time range in the previous three hours.
 *
 * `GetSampledRequests` returns a time range, which is usually the time range that
 * you specified. However, if your resource (such as a CloudFront distribution) received 5,000
 * requests before the specified time range elapsed, `GetSampledRequests` returns
 * an updated time range. This new time range indicates the actual period during which WAF
 * selected the requests in the sample.
 */
export const getSampledRequests: (
  input: GetSampledRequestsRequest,
) => effect.Effect<
  GetSampledRequestsResponse,
  | WAFInternalErrorException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSampledRequestsRequest,
  output: GetSampledRequestsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Retrieves the specified WebACL.
 */
export const getWebACL: (
  input: GetWebACLRequest,
) => effect.Effect<
  GetWebACLResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWebACLRequest,
  output: GetWebACLResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Defines the versions of your managed rule set that you are offering to the customers.
 * Customers see your offerings as managed rule groups with versioning.
 *
 * This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.
 *
 * Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are `ListManagedRuleSets`, `GetManagedRuleSet`, `PutManagedRuleSetVersions`, and `UpdateManagedRuleSetVersionExpiryDate`.
 *
 * Customers retrieve their managed rule group list by calling ListAvailableManagedRuleGroups. The name that you provide here for your
 * managed rule set is the name the customer sees for the corresponding managed rule group.
 * Customers can retrieve the available versions for a managed rule group by calling ListAvailableManagedRuleGroupVersions. You provide a rule group
 * specification for each version. For each managed rule set, you must specify a version that
 * you recommend using.
 *
 * To initiate the expiration of a managed rule group version, use UpdateManagedRuleSetVersionExpiryDate.
 */
export const putManagedRuleSetVersions: (
  input: PutManagedRuleSetVersionsRequest,
) => effect.Effect<
  PutManagedRuleSetVersionsResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutManagedRuleSetVersionsRequest,
  output: PutManagedRuleSetVersionsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
  ],
}));
/**
 * Retrieves the IP addresses that are currently blocked by a rate-based rule instance. This
 * is only available for rate-based rules that aggregate solely on the IP address or on the forwarded IP
 * address.
 *
 * The maximum
 * number of addresses that can be blocked for a single rate-based rule instance is 10,000.
 * If more than 10,000 addresses exceed the rate limit, those with the highest rates are
 * blocked.
 *
 * For a rate-based rule that you've defined inside a rule group, provide the name of the
 * rule group reference statement in your request, in addition to the rate-based rule name and
 * the web ACL name.
 *
 * WAF monitors web requests and manages keys independently for each unique combination
 * of web ACL, optional rule group, and rate-based rule. For example, if you define a
 * rate-based rule inside a rule group, and then use the rule group in a web ACL, WAF
 * monitors web requests and manages keys for that web ACL, rule group reference statement,
 * and rate-based rule instance. If you use the same rule group in a second web ACL, WAF
 * monitors web requests and manages keys for this second usage completely independent of your
 * first.
 */
export const getRateBasedStatementManagedKeys: (
  input: GetRateBasedStatementManagedKeysRequest,
) => effect.Effect<
  GetRateBasedStatementManagedKeysResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFUnsupportedAggregateKeyTypeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRateBasedStatementManagedKeysRequest,
  output: GetRateBasedStatementManagedKeysResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFUnsupportedAggregateKeyTypeException,
  ],
}));
/**
 * Retrieves the WebACL for the specified resource.
 *
 * This call uses `GetWebACL`, to verify that your account has permission to access the retrieved web ACL.
 * If you get an error that indicates that your account isn't authorized to perform `wafv2:GetWebACL` on the resource,
 * that error won't be included in your CloudTrail event history.
 *
 * For Amazon CloudFront, don't use this call. Instead, call the CloudFront action
 * `GetDistributionConfig`. For information, see GetDistributionConfig in the *Amazon CloudFront API Reference*.
 *
 * **Required permissions for customer-managed IAM policies**
 *
 * This call requires permissions that are specific to the protected resource type.
 * For details, see Permissions for GetWebACLForResource in the *WAF Developer Guide*.
 */
export const getWebACLForResource: (
  input: GetWebACLForResourceRequest,
) => effect.Effect<
  GetWebACLForResourceResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFUnavailableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWebACLForResourceRequest,
  output: GetWebACLForResourceResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFUnavailableEntityException,
  ],
}));
/**
 * Updates the specified IPSet.
 *
 * This operation completely replaces the mutable specifications that you already have for the IP set with the ones that you provide to this call.
 *
 * To modify an IP set, do the following:
 *
 * - Retrieve it by calling GetIPSet
 *
 * - Update its settings as needed
 *
 * - Provide the complete IP set specification to this call
 *
 * **Temporary inconsistencies during updates**
 *
 * When you create or change a web ACL or other WAF resources, the changes take a small amount of time to propagate to all areas where the resources are stored. The propagation time can be from a few seconds to a number of minutes.
 *
 * The following are examples of the temporary inconsistencies that you might notice during change propagation:
 *
 * - After you create a web ACL, if you try to associate it with a resource, you might get an exception indicating that the web ACL is unavailable.
 *
 * - After you add a rule group to a web ACL, the new rule group rules might be in effect in one area where the web ACL is used and not in another.
 *
 * - After you change a rule action setting, you might see the old action in some places and the new action in others.
 *
 * - After you add an IP address to an IP set that is in use in a blocking rule, the new address might be blocked in one area while still allowed in another.
 */
export const updateIPSet: (
  input: UpdateIPSetRequest,
) => effect.Effect<
  UpdateIPSetResponse,
  | WAFDuplicateItemException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFLimitsExceededException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIPSetRequest,
  output: UpdateIPSetResponse,
  errors: [
    WAFDuplicateItemException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
  ],
}));
/**
 * Deletes all rule groups that are managed by Firewall Manager from the specified WebACL.
 *
 * You can only use this if `ManagedByFirewallManager` and `RetrofittedByFirewallManager` are both false in the web ACL.
 */
export const deleteFirewallManagerRuleGroups: (
  input: DeleteFirewallManagerRuleGroupsRequest,
) => effect.Effect<
  DeleteFirewallManagerRuleGroupsResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFirewallManagerRuleGroupsRequest,
  output: DeleteFirewallManagerRuleGroupsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
  ],
}));
/**
 * Updates the expiration information for your managed rule set. Use this to initiate the
 * expiration of a managed rule group version. After you initiate expiration for a version,
 * WAF excludes it from the response to ListAvailableManagedRuleGroupVersions for the managed rule group.
 *
 * This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.
 *
 * Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are `ListManagedRuleSets`, `GetManagedRuleSet`, `PutManagedRuleSetVersions`, and `UpdateManagedRuleSetVersionExpiryDate`.
 */
export const updateManagedRuleSetVersionExpiryDate: (
  input: UpdateManagedRuleSetVersionExpiryDateRequest,
) => effect.Effect<
  UpdateManagedRuleSetVersionExpiryDateResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateManagedRuleSetVersionExpiryDateRequest,
  output: UpdateManagedRuleSetVersionExpiryDateResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
  ],
}));
/**
 * Deletes the LoggingConfiguration from the specified web ACL.
 */
export const deleteLoggingConfiguration: (
  input: DeleteLoggingConfigurationRequest,
) => effect.Effect<
  DeleteLoggingConfigurationResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLoggingConfigurationRequest,
  output: DeleteLoggingConfigurationResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
  ],
}));
/**
 * Deletes the specified API key.
 *
 * After you delete a key, it can take up to 24 hours for WAF to disallow use of the key in all regions.
 */
export const deleteAPIKey: (
  input: DeleteAPIKeyRequest,
) => effect.Effect<
  DeleteAPIKeyResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAPIKeyRequest,
  output: DeleteAPIKeyResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
  ],
}));
/**
 * Updates the specified RegexPatternSet.
 *
 * This operation completely replaces the mutable specifications that you already have for the regex pattern set with the ones that you provide to this call.
 *
 * To modify a regex pattern set, do the following:
 *
 * - Retrieve it by calling GetRegexPatternSet
 *
 * - Update its settings as needed
 *
 * - Provide the complete regex pattern set specification to this call
 *
 * **Temporary inconsistencies during updates**
 *
 * When you create or change a web ACL or other WAF resources, the changes take a small amount of time to propagate to all areas where the resources are stored. The propagation time can be from a few seconds to a number of minutes.
 *
 * The following are examples of the temporary inconsistencies that you might notice during change propagation:
 *
 * - After you create a web ACL, if you try to associate it with a resource, you might get an exception indicating that the web ACL is unavailable.
 *
 * - After you add a rule group to a web ACL, the new rule group rules might be in effect in one area where the web ACL is used and not in another.
 *
 * - After you change a rule action setting, you might see the old action in some places and the new action in others.
 *
 * - After you add an IP address to an IP set that is in use in a blocking rule, the new address might be blocked in one area while still allowed in another.
 */
export const updateRegexPatternSet: (
  input: UpdateRegexPatternSetRequest,
) => effect.Effect<
  UpdateRegexPatternSetResponse,
  | WAFDuplicateItemException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFLimitsExceededException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRegexPatternSetRequest,
  output: UpdateRegexPatternSetResponse,
  errors: [
    WAFDuplicateItemException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
  ],
}));
/**
 * Associates a web ACL with a resource, to protect the resource.
 *
 * Use this for all resource types except for Amazon CloudFront distributions. For Amazon CloudFront, call `UpdateDistribution` for the distribution and provide the Amazon Resource Name (ARN) of the web ACL in the web ACL ID. For information, see UpdateDistribution in the *Amazon CloudFront Developer Guide*.
 *
 * **Required permissions for customer-managed IAM policies**
 *
 * This call requires permissions that are specific to the protected resource type.
 * For details, see Permissions for AssociateWebACL in the *WAF Developer Guide*.
 *
 * **Temporary inconsistencies during updates**
 *
 * When you create or change a web ACL or other WAF resources, the changes take a small amount of time to propagate to all areas where the resources are stored. The propagation time can be from a few seconds to a number of minutes.
 *
 * The following are examples of the temporary inconsistencies that you might notice during change propagation:
 *
 * - After you create a web ACL, if you try to associate it with a resource, you might get an exception indicating that the web ACL is unavailable.
 *
 * - After you add a rule group to a web ACL, the new rule group rules might be in effect in one area where the web ACL is used and not in another.
 *
 * - After you change a rule action setting, you might see the old action in some places and the new action in others.
 *
 * - After you add an IP address to an IP set that is in use in a blocking rule, the new address might be blocked in one area while still allowed in another.
 */
export const associateWebACL: (
  input: AssociateWebACLRequest,
) => effect.Effect<
  AssociateWebACLResponse,
  | WAFFeatureNotIncludedInPricingPlanException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFLimitsExceededException
  | WAFNonexistentItemException
  | WAFUnavailableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateWebACLRequest,
  output: AssociateWebACLResponse,
  errors: [
    WAFFeatureNotIncludedInPricingPlanException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentItemException,
    WAFUnavailableEntityException,
  ],
}));
/**
 * Retrieves the TagInfoForResource for the specified resource. Tags are
 * key:value pairs that you can use to categorize and manage your resources, for purposes like
 * billing. For example, you might set the tag key to "customer" and the value to the customer
 * name or ID. You can specify one or more tags to add to each Amazon Web Services resource, up to 50 tags
 * for a resource.
 *
 * You can tag the Amazon Web Services resources that you manage through WAF: web ACLs, rule
 * groups, IP sets, and regex pattern sets. You can't manage or view tags through the WAF
 * console.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFTagOperationException
  | WAFTagOperationInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * Updates the specified WebACL. While updating a web ACL, WAF provides
 * continuous coverage to the resources that you have associated with the web ACL.
 *
 * This operation completely replaces the mutable specifications that you already have for the web ACL with the ones that you provide to this call.
 *
 * To modify a web ACL, do the following:
 *
 * - Retrieve it by calling GetWebACL
 *
 * - Update its settings as needed
 *
 * - Provide the complete web ACL specification to this call
 *
 * A web ACL defines a collection of rules to use to inspect and control web requests. Each rule has a statement that defines what to look for in web requests and an action that WAF applies to requests that match the statement. In the web ACL, you assign a default action to take (allow, block) for any request that does not match any of the rules. The rules in a web ACL can be a combination of the types Rule, RuleGroup, and managed rule group. You can associate a web ACL with one or more Amazon Web Services resources to protect. The resource types include Amazon CloudFront distribution, Amazon API Gateway REST API, Application Load Balancer, AppSync GraphQL API, Amazon Cognito user pool, App Runner service, Amplify application, and Amazon Web Services Verified Access instance.
 *
 * **Temporary inconsistencies during updates**
 *
 * When you create or change a web ACL or other WAF resources, the changes take a small amount of time to propagate to all areas where the resources are stored. The propagation time can be from a few seconds to a number of minutes.
 *
 * The following are examples of the temporary inconsistencies that you might notice during change propagation:
 *
 * - After you create a web ACL, if you try to associate it with a resource, you might get an exception indicating that the web ACL is unavailable.
 *
 * - After you add a rule group to a web ACL, the new rule group rules might be in effect in one area where the web ACL is used and not in another.
 *
 * - After you change a rule action setting, you might see the old action in some places and the new action in others.
 *
 * - After you add an IP address to an IP set that is in use in a blocking rule, the new address might be blocked in one area while still allowed in another.
 */
export const updateWebACL: (
  input: UpdateWebACLRequest,
) => effect.Effect<
  UpdateWebACLResponse,
  | WAFConfigurationWarningException
  | WAFDuplicateItemException
  | WAFExpiredManagedRuleGroupVersionException
  | WAFFeatureNotIncludedInPricingPlanException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFInvalidResourceException
  | WAFLimitsExceededException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | WAFSubscriptionNotFoundException
  | WAFUnavailableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWebACLRequest,
  output: UpdateWebACLResponse,
  errors: [
    WAFConfigurationWarningException,
    WAFDuplicateItemException,
    WAFExpiredManagedRuleGroupVersionException,
    WAFFeatureNotIncludedInPricingPlanException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFInvalidResourceException,
    WAFLimitsExceededException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
    WAFSubscriptionNotFoundException,
    WAFUnavailableEntityException,
  ],
}));
/**
 * Deletes the specified IPSet.
 */
export const deleteIPSet: (
  input: DeleteIPSetRequest,
) => effect.Effect<
  DeleteIPSetResponse,
  | WAFAssociatedItemException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | WAFTagOperationException
  | WAFTagOperationInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIPSetRequest,
  output: DeleteIPSetResponse,
  errors: [
    WAFAssociatedItemException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * Deletes the specified RegexPatternSet.
 */
export const deleteRegexPatternSet: (
  input: DeleteRegexPatternSetRequest,
) => effect.Effect<
  DeleteRegexPatternSetResponse,
  | WAFAssociatedItemException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | WAFTagOperationException
  | WAFTagOperationInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRegexPatternSetRequest,
  output: DeleteRegexPatternSetResponse,
  errors: [
    WAFAssociatedItemException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * Deletes the specified RuleGroup.
 */
export const deleteRuleGroup: (
  input: DeleteRuleGroupRequest,
) => effect.Effect<
  DeleteRuleGroupResponse,
  | WAFAssociatedItemException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | WAFTagOperationException
  | WAFTagOperationInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleGroupRequest,
  output: DeleteRuleGroupResponse,
  errors: [
    WAFAssociatedItemException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * Deletes the specified WebACL.
 *
 * You can only use this if `ManagedByFirewallManager` is false in the web ACL.
 *
 * Before deleting any web ACL, first disassociate it from all resources.
 *
 * - To retrieve a list of the resources that are associated with a web ACL, use the
 * following calls:
 *
 * - For Amazon CloudFront distributions, use the CloudFront call
 * `ListDistributionsByWebACLId`. For information, see ListDistributionsByWebACLId
 * in the *Amazon CloudFront API Reference*.
 *
 * - For all other resources, call ListResourcesForWebACL.
 *
 * - To disassociate a resource from a web ACL, use the following calls:
 *
 * - For Amazon CloudFront distributions, provide an empty web ACL ID in the CloudFront call
 * `UpdateDistribution`. For information, see UpdateDistribution
 * in the *Amazon CloudFront API Reference*.
 *
 * - For all other resources, call DisassociateWebACL.
 */
export const deleteWebACL: (
  input: DeleteWebACLRequest,
) => effect.Effect<
  DeleteWebACLResponse,
  | WAFAssociatedItemException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | WAFTagOperationException
  | WAFTagOperationInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWebACLRequest,
  output: DeleteWebACLResponse,
  errors: [
    WAFAssociatedItemException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * Creates an IPSet, which you use to identify web requests that
 * originate from specific IP addresses or ranges of IP addresses. For example, if you're
 * receiving a lot of requests from a ranges of IP addresses, you can configure WAF to
 * block them using an IPSet that lists those IP addresses.
 */
export const createIPSet: (
  input: CreateIPSetRequest,
) => effect.Effect<
  CreateIPSetResponse,
  | WAFDuplicateItemException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFLimitsExceededException
  | WAFOptimisticLockException
  | WAFTagOperationException
  | WAFTagOperationInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIPSetRequest,
  output: CreateIPSetResponse,
  errors: [
    WAFDuplicateItemException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFOptimisticLockException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * Creates a RegexPatternSet, which you reference in a RegexPatternSetReferenceStatement, to have WAF inspect a web request
 * component for the specified patterns.
 */
export const createRegexPatternSet: (
  input: CreateRegexPatternSetRequest,
) => effect.Effect<
  CreateRegexPatternSetResponse,
  | WAFDuplicateItemException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFLimitsExceededException
  | WAFOptimisticLockException
  | WAFTagOperationException
  | WAFTagOperationInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRegexPatternSetRequest,
  output: CreateRegexPatternSetResponse,
  errors: [
    WAFDuplicateItemException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFOptimisticLockException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * Disassociates tags from an Amazon Web Services resource. Tags are key:value pairs that you can
 * associate with Amazon Web Services resources. For example, the tag key might be "customer" and the tag
 * value might be "companyA." You can specify one or more tags to add to each container. You
 * can add up to 50 tags to each Amazon Web Services resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFNonexistentItemException
  | WAFTagOperationException
  | WAFTagOperationInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * Associates tags with the specified Amazon Web Services resource. Tags are key:value pairs that you can
 * use to categorize and manage your resources, for purposes like billing. For example, you
 * might set the tag key to "customer" and the value to the customer name or ID. You can
 * specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a
 * resource.
 *
 * You can tag the Amazon Web Services resources that you manage through WAF: web ACLs, rule
 * groups, IP sets, and regex pattern sets. You can't manage or view tags through the WAF
 * console.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFLimitsExceededException
  | WAFNonexistentItemException
  | WAFTagOperationException
  | WAFTagOperationInternalErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentItemException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * Updates the specified RuleGroup.
 *
 * This operation completely replaces the mutable specifications that you already have for the rule group with the ones that you provide to this call.
 *
 * To modify a rule group, do the following:
 *
 * - Retrieve it by calling GetRuleGroup
 *
 * - Update its settings as needed
 *
 * - Provide the complete rule group specification to this call
 *
 * A rule group defines a collection of rules to inspect and control web requests that you can use in a WebACL. When you create a rule group, you define an immutable capacity limit. If you update a rule group, you must stay within the capacity. This allows others to reuse the rule group with confidence in its capacity requirements.
 *
 * **Temporary inconsistencies during updates**
 *
 * When you create or change a web ACL or other WAF resources, the changes take a small amount of time to propagate to all areas where the resources are stored. The propagation time can be from a few seconds to a number of minutes.
 *
 * The following are examples of the temporary inconsistencies that you might notice during change propagation:
 *
 * - After you create a web ACL, if you try to associate it with a resource, you might get an exception indicating that the web ACL is unavailable.
 *
 * - After you add a rule group to a web ACL, the new rule group rules might be in effect in one area where the web ACL is used and not in another.
 *
 * - After you change a rule action setting, you might see the old action in some places and the new action in others.
 *
 * - After you add an IP address to an IP set that is in use in a blocking rule, the new address might be blocked in one area while still allowed in another.
 */
export const updateRuleGroup: (
  input: UpdateRuleGroupRequest,
) => effect.Effect<
  UpdateRuleGroupResponse,
  | WAFConfigurationWarningException
  | WAFDuplicateItemException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFLimitsExceededException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | WAFSubscriptionNotFoundException
  | WAFUnavailableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleGroupRequest,
  output: UpdateRuleGroupResponse,
  errors: [
    WAFConfigurationWarningException,
    WAFDuplicateItemException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
    WAFSubscriptionNotFoundException,
    WAFUnavailableEntityException,
  ],
}));
/**
 * Creates a RuleGroup per the specifications provided.
 *
 * A rule group defines a collection of rules to inspect and control web requests that you can use in a WebACL. When you create a rule group, you define an immutable capacity limit. If you update a rule group, you must stay within the capacity. This allows others to reuse the rule group with confidence in its capacity requirements.
 */
export const createRuleGroup: (
  input: CreateRuleGroupRequest,
) => effect.Effect<
  CreateRuleGroupResponse,
  | WAFDuplicateItemException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFLimitsExceededException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | WAFSubscriptionNotFoundException
  | WAFTagOperationException
  | WAFTagOperationInternalErrorException
  | WAFUnavailableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleGroupRequest,
  output: CreateRuleGroupResponse,
  errors: [
    WAFDuplicateItemException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
    WAFSubscriptionNotFoundException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
    WAFUnavailableEntityException,
  ],
}));
/**
 * Creates a WebACL per the specifications provided.
 *
 * A web ACL defines a collection of rules to use to inspect and control web requests. Each rule has a statement that defines what to look for in web requests and an action that WAF applies to requests that match the statement. In the web ACL, you assign a default action to take (allow, block) for any request that does not match any of the rules. The rules in a web ACL can be a combination of the types Rule, RuleGroup, and managed rule group. You can associate a web ACL with one or more Amazon Web Services resources to protect. The resource types include Amazon CloudFront distribution, Amazon API Gateway REST API, Application Load Balancer, AppSync GraphQL API, Amazon Cognito user pool, App Runner service, Amplify application, and Amazon Web Services Verified Access instance.
 */
export const createWebACL: (
  input: CreateWebACLRequest,
) => effect.Effect<
  CreateWebACLResponse,
  | WAFConfigurationWarningException
  | WAFDuplicateItemException
  | WAFExpiredManagedRuleGroupVersionException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFInvalidResourceException
  | WAFLimitsExceededException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | WAFSubscriptionNotFoundException
  | WAFTagOperationException
  | WAFTagOperationInternalErrorException
  | WAFUnavailableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWebACLRequest,
  output: CreateWebACLResponse,
  errors: [
    WAFConfigurationWarningException,
    WAFDuplicateItemException,
    WAFExpiredManagedRuleGroupVersionException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFInvalidResourceException,
    WAFLimitsExceededException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
    WAFSubscriptionNotFoundException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
    WAFUnavailableEntityException,
  ],
}));
/**
 * Returns the web ACL capacity unit (WCU) requirements for a specified scope and set of rules.
 * You can use this to check the capacity requirements for the rules you want to use in a
 * RuleGroup or WebACL.
 *
 * WAF uses WCUs to calculate and control the operating
 * resources that are used to run your rules, rule groups, and web ACLs. WAF
 * calculates capacity differently for each rule type, to reflect the relative cost of each rule.
 * Simple rules that cost little to run use fewer WCUs than more complex rules
 * that use more processing power.
 * Rule group capacity is fixed at creation, which helps users plan their
 * web ACL WCU usage when they use a rule group. For more information, see WAF web ACL capacity units (WCU)
 * in the *WAF Developer Guide*.
 */
export const checkCapacity: (
  input: CheckCapacityRequest,
) => effect.Effect<
  CheckCapacityResponse,
  | WAFExpiredManagedRuleGroupVersionException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFInvalidResourceException
  | WAFLimitsExceededException
  | WAFNonexistentItemException
  | WAFSubscriptionNotFoundException
  | WAFUnavailableEntityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckCapacityRequest,
  output: CheckCapacityResponse,
  errors: [
    WAFExpiredManagedRuleGroupVersionException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFInvalidResourceException,
    WAFLimitsExceededException,
    WAFNonexistentItemException,
    WAFSubscriptionNotFoundException,
    WAFUnavailableEntityException,
  ],
}));
/**
 * Enables the specified LoggingConfiguration, to start logging from a
 * web ACL, according to the configuration provided.
 *
 * If you configure data protection for the web ACL, the protection applies to the data that WAF sends to the logs.
 *
 * This operation completely replaces any mutable specifications that you already have for a logging configuration with the ones that you provide to this call.
 *
 * To modify an existing logging configuration, do the following:
 *
 * - Retrieve it by calling GetLoggingConfiguration
 *
 * - Update its settings as needed
 *
 * - Provide the complete logging configuration specification to this call
 *
 * You can define one logging destination per web ACL.
 *
 * You can access information about the traffic that WAF inspects using the following
 * steps:
 *
 * - Create your logging destination. You can use an Amazon CloudWatch Logs log group, an Amazon Simple Storage Service (Amazon S3) bucket, or an Amazon Kinesis Data Firehose.
 *
 * The name that you give the destination must start with `aws-waf-logs-`. Depending on the type of destination, you might need to configure additional settings or permissions.
 *
 * For configuration requirements and pricing information for each destination type, see
 * Logging web ACL traffic
 * in the *WAF Developer Guide*.
 *
 * - Associate your logging destination to your web ACL using a
 * `PutLoggingConfiguration` request.
 *
 * When you successfully enable logging using a `PutLoggingConfiguration`
 * request, WAF creates an additional role or policy that is required to write
 * logs to the logging destination. For an Amazon CloudWatch Logs log group, WAF creates a resource policy on the log group.
 * For an Amazon S3 bucket, WAF creates a bucket policy. For an Amazon Kinesis Data Firehose, WAF creates a service-linked role.
 *
 * For additional information about web ACL logging, see
 * Logging web ACL traffic information
 * in the *WAF Developer Guide*.
 */
export const putLoggingConfiguration: (
  input: PutLoggingConfigurationRequest,
) => effect.Effect<
  PutLoggingConfigurationResponse,
  | WAFFeatureNotIncludedInPricingPlanException
  | WAFInternalErrorException
  | WAFInvalidOperationException
  | WAFInvalidParameterException
  | WAFLimitsExceededException
  | WAFLogDestinationPermissionIssueException
  | WAFNonexistentItemException
  | WAFOptimisticLockException
  | WAFServiceLinkedRoleErrorException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLoggingConfigurationRequest,
  output: PutLoggingConfigurationResponse,
  errors: [
    WAFFeatureNotIncludedInPricingPlanException,
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFLogDestinationPermissionIssueException,
    WAFNonexistentItemException,
    WAFOptimisticLockException,
    WAFServiceLinkedRoleErrorException,
  ],
}));

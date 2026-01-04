import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://waf.amazonaws.com/doc/2019-07-29/");
const svc = T.AwsApiService({
  sdkId: "WAFV2",
  serviceShapeName: "AWSWAF_20190729",
});
const auth = T.AwsAuthSigv4({ name: "wafv2" });
const ver = T.ServiceVersion("2019-07-29");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://wafv2-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://wafv2-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://wafv2.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://wafv2.{Region}.{PartitionResult#dnsSuffix}",
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
export const APIKeyTokenDomains = S.Array(S.String);
export const IPAddresses = S.Array(S.String);
export const TokenDomains = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateWebACLRequest extends S.Class<AssociateWebACLRequest>(
  "AssociateWebACLRequest",
)(
  { WebACLArn: S.String, ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateWebACLResponse extends S.Class<AssociateWebACLResponse>(
  "AssociateWebACLResponse",
)({}, ns) {}
export class CreateAPIKeyRequest extends S.Class<CreateAPIKeyRequest>(
  "CreateAPIKeyRequest",
)(
  { Scope: S.String, TokenDomains: APIKeyTokenDomains },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAPIKeyRequest extends S.Class<DeleteAPIKeyRequest>(
  "DeleteAPIKeyRequest",
)(
  { Scope: S.String, APIKey: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAPIKeyResponse extends S.Class<DeleteAPIKeyResponse>(
  "DeleteAPIKeyResponse",
)({}, ns) {}
export class DeleteFirewallManagerRuleGroupsRequest extends S.Class<DeleteFirewallManagerRuleGroupsRequest>(
  "DeleteFirewallManagerRuleGroupsRequest",
)(
  { WebACLArn: S.String, WebACLLockToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIPSetRequest extends S.Class<DeleteIPSetRequest>(
  "DeleteIPSetRequest",
)(
  { Name: S.String, Scope: S.String, Id: S.String, LockToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIPSetResponse extends S.Class<DeleteIPSetResponse>(
  "DeleteIPSetResponse",
)({}, ns) {}
export class DeleteLoggingConfigurationRequest extends S.Class<DeleteLoggingConfigurationRequest>(
  "DeleteLoggingConfigurationRequest",
)(
  {
    ResourceArn: S.String,
    LogType: S.optional(S.String),
    LogScope: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLoggingConfigurationResponse extends S.Class<DeleteLoggingConfigurationResponse>(
  "DeleteLoggingConfigurationResponse",
)({}, ns) {}
export class DeletePermissionPolicyRequest extends S.Class<DeletePermissionPolicyRequest>(
  "DeletePermissionPolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePermissionPolicyResponse extends S.Class<DeletePermissionPolicyResponse>(
  "DeletePermissionPolicyResponse",
)({}, ns) {}
export class DeleteRegexPatternSetRequest extends S.Class<DeleteRegexPatternSetRequest>(
  "DeleteRegexPatternSetRequest",
)(
  { Name: S.String, Scope: S.String, Id: S.String, LockToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRegexPatternSetResponse extends S.Class<DeleteRegexPatternSetResponse>(
  "DeleteRegexPatternSetResponse",
)({}, ns) {}
export class DeleteRuleGroupRequest extends S.Class<DeleteRuleGroupRequest>(
  "DeleteRuleGroupRequest",
)(
  { Name: S.String, Scope: S.String, Id: S.String, LockToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRuleGroupResponse extends S.Class<DeleteRuleGroupResponse>(
  "DeleteRuleGroupResponse",
)({}, ns) {}
export class DeleteWebACLRequest extends S.Class<DeleteWebACLRequest>(
  "DeleteWebACLRequest",
)(
  { Name: S.String, Scope: S.String, Id: S.String, LockToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWebACLResponse extends S.Class<DeleteWebACLResponse>(
  "DeleteWebACLResponse",
)({}, ns) {}
export class DescribeAllManagedProductsRequest extends S.Class<DescribeAllManagedProductsRequest>(
  "DescribeAllManagedProductsRequest",
)(
  { Scope: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeManagedProductsByVendorRequest extends S.Class<DescribeManagedProductsByVendorRequest>(
  "DescribeManagedProductsByVendorRequest",
)(
  { VendorName: S.String, Scope: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeManagedRuleGroupRequest extends S.Class<DescribeManagedRuleGroupRequest>(
  "DescribeManagedRuleGroupRequest",
)(
  {
    VendorName: S.String,
    Name: S.String,
    Scope: S.String,
    VersionName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateWebACLRequest extends S.Class<DisassociateWebACLRequest>(
  "DisassociateWebACLRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateWebACLResponse extends S.Class<DisassociateWebACLResponse>(
  "DisassociateWebACLResponse",
)({}, ns) {}
export class GenerateMobileSdkReleaseUrlRequest extends S.Class<GenerateMobileSdkReleaseUrlRequest>(
  "GenerateMobileSdkReleaseUrlRequest",
)(
  { Platform: S.String, ReleaseVersion: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDecryptedAPIKeyRequest extends S.Class<GetDecryptedAPIKeyRequest>(
  "GetDecryptedAPIKeyRequest",
)(
  { Scope: S.String, APIKey: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIPSetRequest extends S.Class<GetIPSetRequest>(
  "GetIPSetRequest",
)(
  { Name: S.String, Scope: S.String, Id: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLoggingConfigurationRequest extends S.Class<GetLoggingConfigurationRequest>(
  "GetLoggingConfigurationRequest",
)(
  {
    ResourceArn: S.String,
    LogType: S.optional(S.String),
    LogScope: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetManagedRuleSetRequest extends S.Class<GetManagedRuleSetRequest>(
  "GetManagedRuleSetRequest",
)(
  { Name: S.String, Scope: S.String, Id: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMobileSdkReleaseRequest extends S.Class<GetMobileSdkReleaseRequest>(
  "GetMobileSdkReleaseRequest",
)(
  { Platform: S.String, ReleaseVersion: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPermissionPolicyRequest extends S.Class<GetPermissionPolicyRequest>(
  "GetPermissionPolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRateBasedStatementManagedKeysRequest extends S.Class<GetRateBasedStatementManagedKeysRequest>(
  "GetRateBasedStatementManagedKeysRequest",
)(
  {
    Scope: S.String,
    WebACLName: S.String,
    WebACLId: S.String,
    RuleGroupRuleName: S.optional(S.String),
    RuleName: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRegexPatternSetRequest extends S.Class<GetRegexPatternSetRequest>(
  "GetRegexPatternSetRequest",
)(
  { Name: S.String, Scope: S.String, Id: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRuleGroupRequest extends S.Class<GetRuleGroupRequest>(
  "GetRuleGroupRequest",
)(
  {
    Name: S.optional(S.String),
    Scope: S.optional(S.String),
    Id: S.optional(S.String),
    ARN: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetWebACLRequest extends S.Class<GetWebACLRequest>(
  "GetWebACLRequest",
)(
  {
    Name: S.optional(S.String),
    Scope: S.optional(S.String),
    Id: S.optional(S.String),
    ARN: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetWebACLForResourceRequest extends S.Class<GetWebACLForResourceRequest>(
  "GetWebACLForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAPIKeysRequest extends S.Class<ListAPIKeysRequest>(
  "ListAPIKeysRequest",
)(
  {
    Scope: S.String,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAvailableManagedRuleGroupsRequest extends S.Class<ListAvailableManagedRuleGroupsRequest>(
  "ListAvailableManagedRuleGroupsRequest",
)(
  {
    Scope: S.String,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAvailableManagedRuleGroupVersionsRequest extends S.Class<ListAvailableManagedRuleGroupVersionsRequest>(
  "ListAvailableManagedRuleGroupVersionsRequest",
)(
  {
    VendorName: S.String,
    Name: S.String,
    Scope: S.String,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListIPSetsRequest extends S.Class<ListIPSetsRequest>(
  "ListIPSetsRequest",
)(
  {
    Scope: S.String,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLoggingConfigurationsRequest extends S.Class<ListLoggingConfigurationsRequest>(
  "ListLoggingConfigurationsRequest",
)(
  {
    Scope: S.String,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
    LogScope: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListManagedRuleSetsRequest extends S.Class<ListManagedRuleSetsRequest>(
  "ListManagedRuleSetsRequest",
)(
  {
    Scope: S.String,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMobileSdkReleasesRequest extends S.Class<ListMobileSdkReleasesRequest>(
  "ListMobileSdkReleasesRequest",
)(
  {
    Platform: S.String,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRegexPatternSetsRequest extends S.Class<ListRegexPatternSetsRequest>(
  "ListRegexPatternSetsRequest",
)(
  {
    Scope: S.String,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourcesForWebACLRequest extends S.Class<ListResourcesForWebACLRequest>(
  "ListResourcesForWebACLRequest",
)(
  { WebACLArn: S.String, ResourceType: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRuleGroupsRequest extends S.Class<ListRuleGroupsRequest>(
  "ListRuleGroupsRequest",
)(
  {
    Scope: S.String,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
    ResourceARN: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWebACLsRequest extends S.Class<ListWebACLsRequest>(
  "ListWebACLsRequest",
)(
  {
    Scope: S.String,
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutPermissionPolicyRequest extends S.Class<PutPermissionPolicyRequest>(
  "PutPermissionPolicyRequest",
)(
  { ResourceArn: S.String, Policy: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutPermissionPolicyResponse extends S.Class<PutPermissionPolicyResponse>(
  "PutPermissionPolicyResponse",
)({}, ns) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class UpdateIPSetRequest extends S.Class<UpdateIPSetRequest>(
  "UpdateIPSetRequest",
)(
  {
    Name: S.String,
    Scope: S.String,
    Id: S.String,
    Description: S.optional(S.String),
    Addresses: IPAddresses,
    LockToken: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateManagedRuleSetVersionExpiryDateRequest extends S.Class<UpdateManagedRuleSetVersionExpiryDateRequest>(
  "UpdateManagedRuleSetVersionExpiryDateRequest",
)(
  {
    Name: S.String,
    Scope: S.String,
    Id: S.String,
    LockToken: S.String,
    VersionToExpire: S.String,
    ExpiryTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Regex extends S.Class<Regex>("Regex")({
  RegexString: S.optional(S.String),
}) {}
export const RegularExpressionList = S.Array(Regex);
export class UpdateRegexPatternSetRequest extends S.Class<UpdateRegexPatternSetRequest>(
  "UpdateRegexPatternSetRequest",
)(
  {
    Name: S.String,
    Scope: S.String,
    Id: S.String,
    Description: S.optional(S.String),
    RegularExpressionList: RegularExpressionList,
    LockToken: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SingleHeader extends S.Class<SingleHeader>("SingleHeader")({
  Name: S.String,
}) {}
export class SingleQueryArgument extends S.Class<SingleQueryArgument>(
  "SingleQueryArgument",
)({ Name: S.String }) {}
export class AllQueryArguments extends S.Class<AllQueryArguments>(
  "AllQueryArguments",
)({}) {}
export class UriPath extends S.Class<UriPath>("UriPath")({}) {}
export class QueryString extends S.Class<QueryString>("QueryString")({}) {}
export class Body extends S.Class<Body>("Body")({
  OversizeHandling: S.optional(S.String),
}) {}
export class Method extends S.Class<Method>("Method")({}) {}
export class All extends S.Class<All>("All")({}) {}
export const JsonPointerPaths = S.Array(S.String);
export class JsonMatchPattern extends S.Class<JsonMatchPattern>(
  "JsonMatchPattern",
)({ All: S.optional(All), IncludedPaths: S.optional(JsonPointerPaths) }) {}
export class JsonBody extends S.Class<JsonBody>("JsonBody")({
  MatchPattern: JsonMatchPattern,
  MatchScope: S.String,
  InvalidFallbackBehavior: S.optional(S.String),
  OversizeHandling: S.optional(S.String),
}) {}
export const HeaderNames = S.Array(S.String);
export class HeaderMatchPattern extends S.Class<HeaderMatchPattern>(
  "HeaderMatchPattern",
)({
  All: S.optional(All),
  IncludedHeaders: S.optional(HeaderNames),
  ExcludedHeaders: S.optional(HeaderNames),
}) {}
export class Headers extends S.Class<Headers>("Headers")({
  MatchPattern: HeaderMatchPattern,
  MatchScope: S.String,
  OversizeHandling: S.String,
}) {}
export const CookieNames = S.Array(S.String);
export class CookieMatchPattern extends S.Class<CookieMatchPattern>(
  "CookieMatchPattern",
)({
  All: S.optional(All),
  IncludedCookies: S.optional(CookieNames),
  ExcludedCookies: S.optional(CookieNames),
}) {}
export class Cookies extends S.Class<Cookies>("Cookies")({
  MatchPattern: CookieMatchPattern,
  MatchScope: S.String,
  OversizeHandling: S.String,
}) {}
export class HeaderOrder extends S.Class<HeaderOrder>("HeaderOrder")({
  OversizeHandling: S.String,
}) {}
export class JA3Fingerprint extends S.Class<JA3Fingerprint>("JA3Fingerprint")({
  FallbackBehavior: S.String,
}) {}
export class JA4Fingerprint extends S.Class<JA4Fingerprint>("JA4Fingerprint")({
  FallbackBehavior: S.String,
}) {}
export class UriFragment extends S.Class<UriFragment>("UriFragment")({
  FallbackBehavior: S.optional(S.String),
}) {}
export class FieldToMatch extends S.Class<FieldToMatch>("FieldToMatch")({
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
}) {}
export class TextTransformation extends S.Class<TextTransformation>(
  "TextTransformation",
)({ Priority: S.Number, Type: S.String }) {}
export const TextTransformations = S.Array(TextTransformation);
export class ByteMatchStatement extends S.Class<ByteMatchStatement>(
  "ByteMatchStatement",
)({
  SearchString: T.Blob,
  FieldToMatch: FieldToMatch,
  TextTransformations: TextTransformations,
  PositionalConstraint: S.String,
}) {}
export class SqliMatchStatement extends S.Class<SqliMatchStatement>(
  "SqliMatchStatement",
)({
  FieldToMatch: FieldToMatch,
  TextTransformations: TextTransformations,
  SensitivityLevel: S.optional(S.String),
}) {}
export class XssMatchStatement extends S.Class<XssMatchStatement>(
  "XssMatchStatement",
)({ FieldToMatch: FieldToMatch, TextTransformations: TextTransformations }) {}
export class SizeConstraintStatement extends S.Class<SizeConstraintStatement>(
  "SizeConstraintStatement",
)({
  FieldToMatch: FieldToMatch,
  ComparisonOperator: S.String,
  Size: S.Number,
  TextTransformations: TextTransformations,
}) {}
export const CountryCodes = S.Array(S.String);
export class ForwardedIPConfig extends S.Class<ForwardedIPConfig>(
  "ForwardedIPConfig",
)({ HeaderName: S.String, FallbackBehavior: S.String }) {}
export class GeoMatchStatement extends S.Class<GeoMatchStatement>(
  "GeoMatchStatement",
)({
  CountryCodes: S.optional(CountryCodes),
  ForwardedIPConfig: S.optional(ForwardedIPConfig),
}) {}
export class ExcludedRule extends S.Class<ExcludedRule>("ExcludedRule")({
  Name: S.String,
}) {}
export const ExcludedRules = S.Array(ExcludedRule);
export class CustomHTTPHeader extends S.Class<CustomHTTPHeader>(
  "CustomHTTPHeader",
)({ Name: S.String, Value: S.String }) {}
export const CustomHTTPHeaders = S.Array(CustomHTTPHeader);
export class CustomResponse extends S.Class<CustomResponse>("CustomResponse")({
  ResponseCode: S.Number,
  CustomResponseBodyKey: S.optional(S.String),
  ResponseHeaders: S.optional(CustomHTTPHeaders),
}) {}
export class BlockAction extends S.Class<BlockAction>("BlockAction")({
  CustomResponse: S.optional(CustomResponse),
}) {}
export class CustomRequestHandling extends S.Class<CustomRequestHandling>(
  "CustomRequestHandling",
)({ InsertHeaders: CustomHTTPHeaders }) {}
export class AllowAction extends S.Class<AllowAction>("AllowAction")({
  CustomRequestHandling: S.optional(CustomRequestHandling),
}) {}
export class CountAction extends S.Class<CountAction>("CountAction")({
  CustomRequestHandling: S.optional(CustomRequestHandling),
}) {}
export class CaptchaAction extends S.Class<CaptchaAction>("CaptchaAction")({
  CustomRequestHandling: S.optional(CustomRequestHandling),
}) {}
export class ChallengeAction extends S.Class<ChallengeAction>(
  "ChallengeAction",
)({ CustomRequestHandling: S.optional(CustomRequestHandling) }) {}
export class RuleAction extends S.Class<RuleAction>("RuleAction")({
  Block: S.optional(BlockAction),
  Allow: S.optional(AllowAction),
  Count: S.optional(CountAction),
  Captcha: S.optional(CaptchaAction),
  Challenge: S.optional(ChallengeAction),
}) {}
export class RuleActionOverride extends S.Class<RuleActionOverride>(
  "RuleActionOverride",
)({ Name: S.String, ActionToUse: RuleAction }) {}
export const RuleActionOverrides = S.Array(RuleActionOverride);
export class RuleGroupReferenceStatement extends S.Class<RuleGroupReferenceStatement>(
  "RuleGroupReferenceStatement",
)({
  ARN: S.String,
  ExcludedRules: S.optional(ExcludedRules),
  RuleActionOverrides: S.optional(RuleActionOverrides),
}) {}
export class IPSetForwardedIPConfig extends S.Class<IPSetForwardedIPConfig>(
  "IPSetForwardedIPConfig",
)({ HeaderName: S.String, FallbackBehavior: S.String, Position: S.String }) {}
export class IPSetReferenceStatement extends S.Class<IPSetReferenceStatement>(
  "IPSetReferenceStatement",
)({
  ARN: S.String,
  IPSetForwardedIPConfig: S.optional(IPSetForwardedIPConfig),
}) {}
export class RegexPatternSetReferenceStatement extends S.Class<RegexPatternSetReferenceStatement>(
  "RegexPatternSetReferenceStatement",
)({
  ARN: S.String,
  FieldToMatch: FieldToMatch,
  TextTransformations: TextTransformations,
}) {}
export class LabelMatchStatement extends S.Class<LabelMatchStatement>(
  "LabelMatchStatement",
)({ Scope: S.String, Key: S.String }) {}
export class RegexMatchStatement extends S.Class<RegexMatchStatement>(
  "RegexMatchStatement",
)({
  RegexString: S.String,
  FieldToMatch: FieldToMatch,
  TextTransformations: TextTransformations,
}) {}
export const AsnList = S.Array(S.Number);
export class AsnMatchStatement extends S.Class<AsnMatchStatement>(
  "AsnMatchStatement",
)({ AsnList: AsnList, ForwardedIPConfig: S.optional(ForwardedIPConfig) }) {}
export class Statement extends S.Class<Statement>("Statement")({
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
    S.suspend((): S.Schema<RateBasedStatement, any> => RateBasedStatement),
  ),
  AndStatement: S.optional(
    S.suspend((): S.Schema<AndStatement, any> => AndStatement),
  ),
  OrStatement: S.optional(
    S.suspend((): S.Schema<OrStatement, any> => OrStatement),
  ),
  NotStatement: S.optional(
    S.suspend((): S.Schema<NotStatement, any> => NotStatement),
  ),
  ManagedRuleGroupStatement: S.optional(
    S.suspend(
      (): S.Schema<ManagedRuleGroupStatement, any> => ManagedRuleGroupStatement,
    ),
  ),
  LabelMatchStatement: S.optional(LabelMatchStatement),
  RegexMatchStatement: S.optional(RegexMatchStatement),
  AsnMatchStatement: S.optional(AsnMatchStatement),
}) {}
export class NoneAction extends S.Class<NoneAction>("NoneAction")({}) {}
export class OverrideAction extends S.Class<OverrideAction>("OverrideAction")({
  Count: S.optional(CountAction),
  None: S.optional(NoneAction),
}) {}
export class Label extends S.Class<Label>("Label")({ Name: S.String }) {}
export const Labels = S.Array(Label);
export class VisibilityConfig extends S.Class<VisibilityConfig>(
  "VisibilityConfig",
)({
  SampledRequestsEnabled: S.Boolean,
  CloudWatchMetricsEnabled: S.Boolean,
  MetricName: S.String,
}) {}
export class ImmunityTimeProperty extends S.Class<ImmunityTimeProperty>(
  "ImmunityTimeProperty",
)({ ImmunityTime: S.Number }) {}
export class CaptchaConfig extends S.Class<CaptchaConfig>("CaptchaConfig")({
  ImmunityTimeProperty: S.optional(ImmunityTimeProperty),
}) {}
export class ChallengeConfig extends S.Class<ChallengeConfig>(
  "ChallengeConfig",
)({ ImmunityTimeProperty: S.optional(ImmunityTimeProperty) }) {}
export class Rule extends S.Class<Rule>("Rule")({
  Name: S.String,
  Priority: S.Number,
  Statement: Statement,
  Action: S.optional(RuleAction),
  OverrideAction: S.optional(OverrideAction),
  RuleLabels: S.optional(Labels),
  VisibilityConfig: VisibilityConfig,
  CaptchaConfig: S.optional(CaptchaConfig),
  ChallengeConfig: S.optional(ChallengeConfig),
}) {}
export const Rules = S.Array(Rule);
export class CustomResponseBody extends S.Class<CustomResponseBody>(
  "CustomResponseBody",
)({ ContentType: S.String, Content: S.String }) {}
export const CustomResponseBodies = S.Record({
  key: S.String,
  value: CustomResponseBody,
});
export class UpdateRuleGroupRequest extends S.Class<UpdateRuleGroupRequest>(
  "UpdateRuleGroupRequest",
)(
  {
    Name: S.String,
    Scope: S.String,
    Id: S.String,
    Description: S.optional(S.String),
    Rules: S.optional(Rules),
    VisibilityConfig: VisibilityConfig,
    LockToken: S.String,
    CustomResponseBodies: S.optional(CustomResponseBodies),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DefaultAction extends S.Class<DefaultAction>("DefaultAction")({
  Block: S.optional(BlockAction),
  Allow: S.optional(AllowAction),
}) {}
export const FieldToProtectKeys = S.Array(S.String);
export class FieldToProtect extends S.Class<FieldToProtect>("FieldToProtect")({
  FieldType: S.String,
  FieldKeys: S.optional(FieldToProtectKeys),
}) {}
export class DataProtection extends S.Class<DataProtection>("DataProtection")({
  Field: FieldToProtect,
  Action: S.String,
  ExcludeRuleMatchDetails: S.optional(S.Boolean),
  ExcludeRateBasedDetails: S.optional(S.Boolean),
}) {}
export const DataProtections = S.Array(DataProtection);
export class DataProtectionConfig extends S.Class<DataProtectionConfig>(
  "DataProtectionConfig",
)({ DataProtections: DataProtections }) {}
export class RequestBodyAssociatedResourceTypeConfig extends S.Class<RequestBodyAssociatedResourceTypeConfig>(
  "RequestBodyAssociatedResourceTypeConfig",
)({ DefaultSizeInspectionLimit: S.String }) {}
export const RequestBody = S.Record({
  key: S.String,
  value: RequestBodyAssociatedResourceTypeConfig,
});
export class AssociationConfig extends S.Class<AssociationConfig>(
  "AssociationConfig",
)({ RequestBody: S.optional(RequestBody) }) {}
export class OnSourceDDoSProtectionConfig extends S.Class<OnSourceDDoSProtectionConfig>(
  "OnSourceDDoSProtectionConfig",
)({ ALBLowReputationMode: S.String }) {}
export const AttributeValues = S.Array(S.String);
export class ApplicationAttribute extends S.Class<ApplicationAttribute>(
  "ApplicationAttribute",
)({ Name: S.optional(S.String), Values: S.optional(AttributeValues) }) {}
export const ApplicationAttributes = S.Array(ApplicationAttribute);
export class ApplicationConfig extends S.Class<ApplicationConfig>(
  "ApplicationConfig",
)({ Attributes: S.optional(ApplicationAttributes) }) {}
export class UpdateWebACLRequest extends S.Class<UpdateWebACLRequest>(
  "UpdateWebACLRequest",
)(
  {
    Name: S.String,
    Scope: S.String,
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const LogDestinationConfigs = S.Array(S.String);
export class TimeWindow extends S.Class<TimeWindow>("TimeWindow")({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const RedactedFields = S.Array(FieldToMatch);
export class ActionCondition extends S.Class<ActionCondition>(
  "ActionCondition",
)({ Action: S.String }) {}
export class LabelNameCondition extends S.Class<LabelNameCondition>(
  "LabelNameCondition",
)({ LabelName: S.String }) {}
export class Condition extends S.Class<Condition>("Condition")({
  ActionCondition: S.optional(ActionCondition),
  LabelNameCondition: S.optional(LabelNameCondition),
}) {}
export const Conditions = S.Array(Condition);
export class Filter extends S.Class<Filter>("Filter")({
  Behavior: S.String,
  Requirement: S.String,
  Conditions: Conditions,
}) {}
export const Filters = S.Array(Filter);
export class LoggingFilter extends S.Class<LoggingFilter>("LoggingFilter")({
  Filters: Filters,
  DefaultBehavior: S.String,
}) {}
export class LoggingConfiguration extends S.Class<LoggingConfiguration>(
  "LoggingConfiguration",
)({
  ResourceArn: S.String,
  LogDestinationConfigs: LogDestinationConfigs,
  RedactedFields: S.optional(RedactedFields),
  ManagedByFirewallManager: S.optional(S.Boolean),
  LoggingFilter: S.optional(LoggingFilter),
  LogType: S.optional(S.String),
  LogScope: S.optional(S.String),
}) {}
export const LoggingConfigurations = S.Array(LoggingConfiguration);
export const ResourceArns = S.Array(S.String);
export class CreateAPIKeyResponse extends S.Class<CreateAPIKeyResponse>(
  "CreateAPIKeyResponse",
)({ APIKey: S.optional(S.String) }, ns) {}
export class CreateIPSetRequest extends S.Class<CreateIPSetRequest>(
  "CreateIPSetRequest",
)(
  {
    Name: S.String,
    Scope: S.String,
    Description: S.optional(S.String),
    IPAddressVersion: S.String,
    Addresses: IPAddresses,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRegexPatternSetRequest extends S.Class<CreateRegexPatternSetRequest>(
  "CreateRegexPatternSetRequest",
)(
  {
    Name: S.String,
    Scope: S.String,
    Description: S.optional(S.String),
    RegularExpressionList: RegularExpressionList,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFirewallManagerRuleGroupsResponse extends S.Class<DeleteFirewallManagerRuleGroupsResponse>(
  "DeleteFirewallManagerRuleGroupsResponse",
)({ NextWebACLLockToken: S.optional(S.String) }, ns) {}
export class ManagedProductDescriptor extends S.Class<ManagedProductDescriptor>(
  "ManagedProductDescriptor",
)({
  VendorName: S.optional(S.String),
  ManagedRuleSetName: S.optional(S.String),
  ProductId: S.optional(S.String),
  ProductLink: S.optional(S.String),
  ProductTitle: S.optional(S.String),
  ProductDescription: S.optional(S.String),
  SnsTopicArn: S.optional(S.String),
  IsVersioningSupported: S.optional(S.Boolean),
  IsAdvancedManagedRuleSet: S.optional(S.Boolean),
}) {}
export const ManagedProductDescriptors = S.Array(ManagedProductDescriptor);
export class DescribeManagedProductsByVendorResponse extends S.Class<DescribeManagedProductsByVendorResponse>(
  "DescribeManagedProductsByVendorResponse",
)({ ManagedProducts: S.optional(ManagedProductDescriptors) }, ns) {}
export class GenerateMobileSdkReleaseUrlResponse extends S.Class<GenerateMobileSdkReleaseUrlResponse>(
  "GenerateMobileSdkReleaseUrlResponse",
)({ Url: S.optional(S.String) }, ns) {}
export class GetDecryptedAPIKeyResponse extends S.Class<GetDecryptedAPIKeyResponse>(
  "GetDecryptedAPIKeyResponse",
)(
  {
    TokenDomains: S.optional(TokenDomains),
    CreationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class GetLoggingConfigurationResponse extends S.Class<GetLoggingConfigurationResponse>(
  "GetLoggingConfigurationResponse",
)({ LoggingConfiguration: S.optional(LoggingConfiguration) }, ns) {}
export class GetPermissionPolicyResponse extends S.Class<GetPermissionPolicyResponse>(
  "GetPermissionPolicyResponse",
)({ Policy: S.optional(S.String) }, ns) {}
export class GetSampledRequestsRequest extends S.Class<GetSampledRequestsRequest>(
  "GetSampledRequestsRequest",
)(
  {
    WebAclArn: S.String,
    RuleMetricName: S.String,
    Scope: S.String,
    TimeWindow: TimeWindow,
    MaxItems: S.Number,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UsernameField extends S.Class<UsernameField>("UsernameField")({
  Identifier: S.String,
}) {}
export class PasswordField extends S.Class<PasswordField>("PasswordField")({
  Identifier: S.String,
}) {}
export class AWSManagedRulesBotControlRuleSet extends S.Class<AWSManagedRulesBotControlRuleSet>(
  "AWSManagedRulesBotControlRuleSet",
)({
  InspectionLevel: S.String,
  EnableMachineLearning: S.optional(S.Boolean),
}) {}
export class RequestInspection extends S.Class<RequestInspection>(
  "RequestInspection",
)({
  PayloadType: S.String,
  UsernameField: UsernameField,
  PasswordField: PasswordField,
}) {}
export const ResponseInspectionStatusCodeSuccessCodes = S.Array(S.Number);
export const ResponseInspectionStatusCodeFailureCodes = S.Array(S.Number);
export class ResponseInspectionStatusCode extends S.Class<ResponseInspectionStatusCode>(
  "ResponseInspectionStatusCode",
)({
  SuccessCodes: ResponseInspectionStatusCodeSuccessCodes,
  FailureCodes: ResponseInspectionStatusCodeFailureCodes,
}) {}
export const ResponseInspectionHeaderSuccessValues = S.Array(S.String);
export const ResponseInspectionHeaderFailureValues = S.Array(S.String);
export class ResponseInspectionHeader extends S.Class<ResponseInspectionHeader>(
  "ResponseInspectionHeader",
)({
  Name: S.String,
  SuccessValues: ResponseInspectionHeaderSuccessValues,
  FailureValues: ResponseInspectionHeaderFailureValues,
}) {}
export const ResponseInspectionBodyContainsSuccessStrings = S.Array(S.String);
export const ResponseInspectionBodyContainsFailureStrings = S.Array(S.String);
export class ResponseInspectionBodyContains extends S.Class<ResponseInspectionBodyContains>(
  "ResponseInspectionBodyContains",
)({
  SuccessStrings: ResponseInspectionBodyContainsSuccessStrings,
  FailureStrings: ResponseInspectionBodyContainsFailureStrings,
}) {}
export const ResponseInspectionJsonSuccessValues = S.Array(S.String);
export const ResponseInspectionJsonFailureValues = S.Array(S.String);
export class ResponseInspectionJson extends S.Class<ResponseInspectionJson>(
  "ResponseInspectionJson",
)({
  Identifier: S.String,
  SuccessValues: ResponseInspectionJsonSuccessValues,
  FailureValues: ResponseInspectionJsonFailureValues,
}) {}
export class ResponseInspection extends S.Class<ResponseInspection>(
  "ResponseInspection",
)({
  StatusCode: S.optional(ResponseInspectionStatusCode),
  Header: S.optional(ResponseInspectionHeader),
  BodyContains: S.optional(ResponseInspectionBodyContains),
  Json: S.optional(ResponseInspectionJson),
}) {}
export class AWSManagedRulesATPRuleSet extends S.Class<AWSManagedRulesATPRuleSet>(
  "AWSManagedRulesATPRuleSet",
)({
  LoginPath: S.String,
  RequestInspection: S.optional(RequestInspection),
  ResponseInspection: S.optional(ResponseInspection),
  EnableRegexInPath: S.optional(S.Boolean),
}) {}
export class EmailField extends S.Class<EmailField>("EmailField")({
  Identifier: S.String,
}) {}
export class PhoneNumberField extends S.Class<PhoneNumberField>(
  "PhoneNumberField",
)({ Identifier: S.String }) {}
export const PhoneNumberFields = S.Array(PhoneNumberField);
export class AddressField extends S.Class<AddressField>("AddressField")({
  Identifier: S.String,
}) {}
export const AddressFields = S.Array(AddressField);
export class RequestInspectionACFP extends S.Class<RequestInspectionACFP>(
  "RequestInspectionACFP",
)({
  PayloadType: S.String,
  UsernameField: S.optional(UsernameField),
  PasswordField: S.optional(PasswordField),
  EmailField: S.optional(EmailField),
  PhoneNumberFields: S.optional(PhoneNumberFields),
  AddressFields: S.optional(AddressFields),
}) {}
export class AWSManagedRulesACFPRuleSet extends S.Class<AWSManagedRulesACFPRuleSet>(
  "AWSManagedRulesACFPRuleSet",
)({
  CreationPath: S.String,
  RegistrationPagePath: S.String,
  RequestInspection: RequestInspectionACFP,
  ResponseInspection: S.optional(ResponseInspection),
  EnableRegexInPath: S.optional(S.Boolean),
}) {}
export class ClientSideAction extends S.Class<ClientSideAction>(
  "ClientSideAction",
)({
  UsageOfAction: S.String,
  Sensitivity: S.optional(S.String),
  ExemptUriRegularExpressions: S.optional(RegularExpressionList),
}) {}
export class ClientSideActionConfig extends S.Class<ClientSideActionConfig>(
  "ClientSideActionConfig",
)({ Challenge: ClientSideAction }) {}
export class AWSManagedRulesAntiDDoSRuleSet extends S.Class<AWSManagedRulesAntiDDoSRuleSet>(
  "AWSManagedRulesAntiDDoSRuleSet",
)({
  ClientSideActionConfig: ClientSideActionConfig,
  SensitivityToBlock: S.optional(S.String),
}) {}
export class ManagedRuleGroupConfig extends S.Class<ManagedRuleGroupConfig>(
  "ManagedRuleGroupConfig",
)({
  LoginPath: S.optional(S.String),
  PayloadType: S.optional(S.String),
  UsernameField: S.optional(UsernameField),
  PasswordField: S.optional(PasswordField),
  AWSManagedRulesBotControlRuleSet: S.optional(
    AWSManagedRulesBotControlRuleSet,
  ),
  AWSManagedRulesATPRuleSet: S.optional(AWSManagedRulesATPRuleSet),
  AWSManagedRulesACFPRuleSet: S.optional(AWSManagedRulesACFPRuleSet),
  AWSManagedRulesAntiDDoSRuleSet: S.optional(AWSManagedRulesAntiDDoSRuleSet),
}) {}
export const ManagedRuleGroupConfigs = S.Array(ManagedRuleGroupConfig);
export class ManagedRuleGroupStatement extends S.Class<ManagedRuleGroupStatement>(
  "ManagedRuleGroupStatement",
)({
  VendorName: S.String,
  Name: S.String,
  Version: S.optional(S.String),
  ExcludedRules: S.optional(ExcludedRules),
  ScopeDownStatement: S.optional(
    S.suspend((): S.Schema<Statement, any> => Statement),
  ),
  ManagedRuleGroupConfigs: S.optional(ManagedRuleGroupConfigs),
  RuleActionOverrides: S.optional(RuleActionOverrides),
}) {}
export class FirewallManagerStatement extends S.Class<FirewallManagerStatement>(
  "FirewallManagerStatement",
)({
  ManagedRuleGroupStatement: S.optional(ManagedRuleGroupStatement),
  RuleGroupReferenceStatement: S.optional(RuleGroupReferenceStatement),
}) {}
export class FirewallManagerRuleGroup extends S.Class<FirewallManagerRuleGroup>(
  "FirewallManagerRuleGroup",
)({
  Name: S.String,
  Priority: S.Number,
  FirewallManagerStatement: FirewallManagerStatement,
  OverrideAction: OverrideAction,
  VisibilityConfig: VisibilityConfig,
}) {}
export const FirewallManagerRuleGroups = S.Array(FirewallManagerRuleGroup);
export class WebACL extends S.Class<WebACL>("WebACL")({
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
}) {}
export class GetWebACLForResourceResponse extends S.Class<GetWebACLForResourceResponse>(
  "GetWebACLForResourceResponse",
)({ WebACL: S.optional(WebACL) }, ns) {}
export class ListLoggingConfigurationsResponse extends S.Class<ListLoggingConfigurationsResponse>(
  "ListLoggingConfigurationsResponse",
)(
  {
    LoggingConfigurations: S.optional(LoggingConfigurations),
    NextMarker: S.optional(S.String),
  },
  ns,
) {}
export class ListResourcesForWebACLResponse extends S.Class<ListResourcesForWebACLResponse>(
  "ListResourcesForWebACLResponse",
)({ ResourceArns: S.optional(ResourceArns) }, ns) {}
export class UpdateIPSetResponse extends S.Class<UpdateIPSetResponse>(
  "UpdateIPSetResponse",
)({ NextLockToken: S.optional(S.String) }, ns) {}
export class UpdateManagedRuleSetVersionExpiryDateResponse extends S.Class<UpdateManagedRuleSetVersionExpiryDateResponse>(
  "UpdateManagedRuleSetVersionExpiryDateResponse",
)(
  {
    ExpiringVersion: S.optional(S.String),
    ExpiryTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NextLockToken: S.optional(S.String),
  },
  ns,
) {}
export class UpdateRegexPatternSetResponse extends S.Class<UpdateRegexPatternSetResponse>(
  "UpdateRegexPatternSetResponse",
)({ NextLockToken: S.optional(S.String) }, ns) {}
export class UpdateRuleGroupResponse extends S.Class<UpdateRuleGroupResponse>(
  "UpdateRuleGroupResponse",
)({ NextLockToken: S.optional(S.String) }, ns) {}
export class UpdateWebACLResponse extends S.Class<UpdateWebACLResponse>(
  "UpdateWebACLResponse",
)({ NextLockToken: S.optional(S.String) }, ns) {}
export class VersionToPublish extends S.Class<VersionToPublish>(
  "VersionToPublish",
)({
  AssociatedRuleGroupArn: S.optional(S.String),
  ForecastedLifetime: S.optional(S.Number),
}) {}
export type Statements = Statement[];
export const Statements = S.Array(
  S.suspend((): S.Schema<Statement, any> => Statement),
) as any as S.Schema<Statements>;
export class DisallowedFeature extends S.Class<DisallowedFeature>(
  "DisallowedFeature",
)({
  Feature: S.optional(S.String),
  RequiredPricingPlan: S.optional(S.String),
}) {}
export const DisallowedFeatures = S.Array(DisallowedFeature);
export class RuleSummary extends S.Class<RuleSummary>("RuleSummary")({
  Name: S.optional(S.String),
  Action: S.optional(RuleAction),
}) {}
export const RuleSummaries = S.Array(RuleSummary);
export class LabelSummary extends S.Class<LabelSummary>("LabelSummary")({
  Name: S.optional(S.String),
}) {}
export const LabelSummaries = S.Array(LabelSummary);
export class IPSet extends S.Class<IPSet>("IPSet")({
  Name: S.String,
  Id: S.String,
  ARN: S.String,
  Description: S.optional(S.String),
  IPAddressVersion: S.String,
  Addresses: IPAddresses,
}) {}
export class MobileSdkRelease extends S.Class<MobileSdkRelease>(
  "MobileSdkRelease",
)({
  ReleaseVersion: S.optional(S.String),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReleaseNotes: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export class RateBasedStatementManagedKeysIPSet extends S.Class<RateBasedStatementManagedKeysIPSet>(
  "RateBasedStatementManagedKeysIPSet",
)({
  IPAddressVersion: S.optional(S.String),
  Addresses: S.optional(IPAddresses),
}) {}
export class RegexPatternSet extends S.Class<RegexPatternSet>(
  "RegexPatternSet",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  ARN: S.optional(S.String),
  Description: S.optional(S.String),
  RegularExpressionList: S.optional(RegularExpressionList),
}) {}
export class RuleGroup extends S.Class<RuleGroup>("RuleGroup")({
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
}) {}
export class APIKeySummary extends S.Class<APIKeySummary>("APIKeySummary")({
  TokenDomains: S.optional(TokenDomains),
  APIKey: S.optional(S.String),
  CreationTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Version: S.optional(S.Number),
}) {}
export const APIKeySummaries = S.Array(APIKeySummary);
export class ManagedRuleGroupSummary extends S.Class<ManagedRuleGroupSummary>(
  "ManagedRuleGroupSummary",
)({
  VendorName: S.optional(S.String),
  Name: S.optional(S.String),
  VersioningSupported: S.optional(S.Boolean),
  Description: S.optional(S.String),
}) {}
export const ManagedRuleGroupSummaries = S.Array(ManagedRuleGroupSummary);
export class ManagedRuleGroupVersion extends S.Class<ManagedRuleGroupVersion>(
  "ManagedRuleGroupVersion",
)({
  Name: S.optional(S.String),
  LastUpdateTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ManagedRuleGroupVersions = S.Array(ManagedRuleGroupVersion);
export class IPSetSummary extends S.Class<IPSetSummary>("IPSetSummary")({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Description: S.optional(S.String),
  LockToken: S.optional(S.String),
  ARN: S.optional(S.String),
}) {}
export const IPSetSummaries = S.Array(IPSetSummary);
export class ManagedRuleSetSummary extends S.Class<ManagedRuleSetSummary>(
  "ManagedRuleSetSummary",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Description: S.optional(S.String),
  LockToken: S.optional(S.String),
  ARN: S.optional(S.String),
  LabelNamespace: S.optional(S.String),
}) {}
export const ManagedRuleSetSummaries = S.Array(ManagedRuleSetSummary);
export class ReleaseSummary extends S.Class<ReleaseSummary>("ReleaseSummary")({
  ReleaseVersion: S.optional(S.String),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ReleaseSummaries = S.Array(ReleaseSummary);
export class RegexPatternSetSummary extends S.Class<RegexPatternSetSummary>(
  "RegexPatternSetSummary",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Description: S.optional(S.String),
  LockToken: S.optional(S.String),
  ARN: S.optional(S.String),
}) {}
export const RegexPatternSetSummaries = S.Array(RegexPatternSetSummary);
export class RuleGroupSummary extends S.Class<RuleGroupSummary>(
  "RuleGroupSummary",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Description: S.optional(S.String),
  LockToken: S.optional(S.String),
  ARN: S.optional(S.String),
}) {}
export const RuleGroupSummaries = S.Array(RuleGroupSummary);
export class TagInfoForResource extends S.Class<TagInfoForResource>(
  "TagInfoForResource",
)({ ResourceARN: S.optional(S.String), TagList: S.optional(TagList) }) {}
export class WebACLSummary extends S.Class<WebACLSummary>("WebACLSummary")({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Description: S.optional(S.String),
  LockToken: S.optional(S.String),
  ARN: S.optional(S.String),
}) {}
export const WebACLSummaries = S.Array(WebACLSummary);
export const VersionsToPublish = S.Record({
  key: S.String,
  value: VersionToPublish,
});
export class AndStatement extends S.Class<AndStatement>("AndStatement")({
  Statements: S.suspend(() => Statements),
}) {}
export class OrStatement extends S.Class<OrStatement>("OrStatement")({
  Statements: S.suspend(() => Statements),
}) {}
export class NotStatement extends S.Class<NotStatement>("NotStatement")({
  Statement: S.suspend((): S.Schema<Statement, any> => Statement),
}) {}
export class RateLimitHTTPMethod extends S.Class<RateLimitHTTPMethod>(
  "RateLimitHTTPMethod",
)({}) {}
export class RateLimitForwardedIP extends S.Class<RateLimitForwardedIP>(
  "RateLimitForwardedIP",
)({}) {}
export class RateLimitIP extends S.Class<RateLimitIP>("RateLimitIP")({}) {}
export class RateLimitAsn extends S.Class<RateLimitAsn>("RateLimitAsn")({}) {}
export class CreateIPSetResponse extends S.Class<CreateIPSetResponse>(
  "CreateIPSetResponse",
)({ Summary: S.optional(IPSetSummary) }, ns) {}
export class CreateRegexPatternSetResponse extends S.Class<CreateRegexPatternSetResponse>(
  "CreateRegexPatternSetResponse",
)({ Summary: S.optional(RegexPatternSetSummary) }, ns) {}
export class CreateRuleGroupRequest extends S.Class<CreateRuleGroupRequest>(
  "CreateRuleGroupRequest",
)(
  {
    Name: S.String,
    Scope: S.String,
    Capacity: S.Number,
    Description: S.optional(S.String),
    Rules: S.optional(Rules),
    VisibilityConfig: VisibilityConfig,
    Tags: S.optional(TagList),
    CustomResponseBodies: S.optional(CustomResponseBodies),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAllManagedProductsResponse extends S.Class<DescribeAllManagedProductsResponse>(
  "DescribeAllManagedProductsResponse",
)({ ManagedProducts: S.optional(ManagedProductDescriptors) }, ns) {}
export class DescribeManagedRuleGroupResponse extends S.Class<DescribeManagedRuleGroupResponse>(
  "DescribeManagedRuleGroupResponse",
)(
  {
    VersionName: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    Capacity: S.optional(S.Number),
    Rules: S.optional(RuleSummaries),
    LabelNamespace: S.optional(S.String),
    AvailableLabels: S.optional(LabelSummaries),
    ConsumedLabels: S.optional(LabelSummaries),
  },
  ns,
) {}
export class GetIPSetResponse extends S.Class<GetIPSetResponse>(
  "GetIPSetResponse",
)({ IPSet: S.optional(IPSet), LockToken: S.optional(S.String) }, ns) {}
export class GetMobileSdkReleaseResponse extends S.Class<GetMobileSdkReleaseResponse>(
  "GetMobileSdkReleaseResponse",
)({ MobileSdkRelease: S.optional(MobileSdkRelease) }, ns) {}
export class GetRateBasedStatementManagedKeysResponse extends S.Class<GetRateBasedStatementManagedKeysResponse>(
  "GetRateBasedStatementManagedKeysResponse",
)(
  {
    ManagedKeysIPV4: S.optional(RateBasedStatementManagedKeysIPSet),
    ManagedKeysIPV6: S.optional(RateBasedStatementManagedKeysIPSet),
  },
  ns,
) {}
export class GetRegexPatternSetResponse extends S.Class<GetRegexPatternSetResponse>(
  "GetRegexPatternSetResponse",
)(
  {
    RegexPatternSet: S.optional(RegexPatternSet),
    LockToken: S.optional(S.String),
  },
  ns,
) {}
export class GetRuleGroupResponse extends S.Class<GetRuleGroupResponse>(
  "GetRuleGroupResponse",
)({ RuleGroup: S.optional(RuleGroup), LockToken: S.optional(S.String) }, ns) {}
export class ListAPIKeysResponse extends S.Class<ListAPIKeysResponse>(
  "ListAPIKeysResponse",
)(
  {
    NextMarker: S.optional(S.String),
    APIKeySummaries: S.optional(APIKeySummaries),
    ApplicationIntegrationURL: S.optional(S.String),
  },
  ns,
) {}
export class ListAvailableManagedRuleGroupsResponse extends S.Class<ListAvailableManagedRuleGroupsResponse>(
  "ListAvailableManagedRuleGroupsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    ManagedRuleGroups: S.optional(ManagedRuleGroupSummaries),
  },
  ns,
) {}
export class ListAvailableManagedRuleGroupVersionsResponse extends S.Class<ListAvailableManagedRuleGroupVersionsResponse>(
  "ListAvailableManagedRuleGroupVersionsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    Versions: S.optional(ManagedRuleGroupVersions),
    CurrentDefaultVersion: S.optional(S.String),
  },
  ns,
) {}
export class ListIPSetsResponse extends S.Class<ListIPSetsResponse>(
  "ListIPSetsResponse",
)(
  { NextMarker: S.optional(S.String), IPSets: S.optional(IPSetSummaries) },
  ns,
) {}
export class ListManagedRuleSetsResponse extends S.Class<ListManagedRuleSetsResponse>(
  "ListManagedRuleSetsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    ManagedRuleSets: S.optional(ManagedRuleSetSummaries),
  },
  ns,
) {}
export class ListMobileSdkReleasesResponse extends S.Class<ListMobileSdkReleasesResponse>(
  "ListMobileSdkReleasesResponse",
)(
  {
    ReleaseSummaries: S.optional(ReleaseSummaries),
    NextMarker: S.optional(S.String),
  },
  ns,
) {}
export class ListRegexPatternSetsResponse extends S.Class<ListRegexPatternSetsResponse>(
  "ListRegexPatternSetsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    RegexPatternSets: S.optional(RegexPatternSetSummaries),
  },
  ns,
) {}
export class ListRuleGroupsResponse extends S.Class<ListRuleGroupsResponse>(
  "ListRuleGroupsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    RuleGroups: S.optional(RuleGroupSummaries),
  },
  ns,
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)(
  {
    NextMarker: S.optional(S.String),
    TagInfoForResource: S.optional(TagInfoForResource),
  },
  ns,
) {}
export class ListWebACLsResponse extends S.Class<ListWebACLsResponse>(
  "ListWebACLsResponse",
)(
  { NextMarker: S.optional(S.String), WebACLs: S.optional(WebACLSummaries) },
  ns,
) {}
export class PutManagedRuleSetVersionsRequest extends S.Class<PutManagedRuleSetVersionsRequest>(
  "PutManagedRuleSetVersionsRequest",
)(
  {
    Name: S.String,
    Scope: S.String,
    Id: S.String,
    LockToken: S.String,
    RecommendedVersion: S.optional(S.String),
    VersionsToPublish: S.optional(VersionsToPublish),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ManagedRuleSetVersion extends S.Class<ManagedRuleSetVersion>(
  "ManagedRuleSetVersion",
)({
  AssociatedRuleGroupArn: S.optional(S.String),
  Capacity: S.optional(S.Number),
  ForecastedLifetime: S.optional(S.Number),
  PublishTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdateTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ExpiryTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RateLimitHeader extends S.Class<RateLimitHeader>(
  "RateLimitHeader",
)({ Name: S.String, TextTransformations: TextTransformations }) {}
export class RateLimitCookie extends S.Class<RateLimitCookie>(
  "RateLimitCookie",
)({ Name: S.String, TextTransformations: TextTransformations }) {}
export class RateLimitQueryArgument extends S.Class<RateLimitQueryArgument>(
  "RateLimitQueryArgument",
)({ Name: S.String, TextTransformations: TextTransformations }) {}
export class RateLimitQueryString extends S.Class<RateLimitQueryString>(
  "RateLimitQueryString",
)({ TextTransformations: TextTransformations }) {}
export class RateLimitLabelNamespace extends S.Class<RateLimitLabelNamespace>(
  "RateLimitLabelNamespace",
)({ Namespace: S.String }) {}
export class RateLimitUriPath extends S.Class<RateLimitUriPath>(
  "RateLimitUriPath",
)({ TextTransformations: TextTransformations }) {}
export class RateLimitJA3Fingerprint extends S.Class<RateLimitJA3Fingerprint>(
  "RateLimitJA3Fingerprint",
)({ FallbackBehavior: S.String }) {}
export class RateLimitJA4Fingerprint extends S.Class<RateLimitJA4Fingerprint>(
  "RateLimitJA4Fingerprint",
)({ FallbackBehavior: S.String }) {}
export class CreateRuleGroupResponse extends S.Class<CreateRuleGroupResponse>(
  "CreateRuleGroupResponse",
)({ Summary: S.optional(RuleGroupSummary) }, ns) {}
export class PutManagedRuleSetVersionsResponse extends S.Class<PutManagedRuleSetVersionsResponse>(
  "PutManagedRuleSetVersionsResponse",
)({ NextLockToken: S.optional(S.String) }, ns) {}
export const PublishedVersions = S.Record({
  key: S.String,
  value: ManagedRuleSetVersion,
});
export class HTTPHeader extends S.Class<HTTPHeader>("HTTPHeader")({
  Name: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const HTTPHeaders = S.Array(HTTPHeader);
export class HTTPRequest extends S.Class<HTTPRequest>("HTTPRequest")({
  ClientIP: S.optional(S.String),
  Country: S.optional(S.String),
  URI: S.optional(S.String),
  Method: S.optional(S.String),
  HTTPVersion: S.optional(S.String),
  Headers: S.optional(HTTPHeaders),
}) {}
export class CaptchaResponse extends S.Class<CaptchaResponse>(
  "CaptchaResponse",
)({
  ResponseCode: S.optional(S.Number),
  SolveTimestamp: S.optional(S.Number),
  FailureReason: S.optional(S.String),
}) {}
export class ChallengeResponse extends S.Class<ChallengeResponse>(
  "ChallengeResponse",
)({
  ResponseCode: S.optional(S.Number),
  SolveTimestamp: S.optional(S.Number),
  FailureReason: S.optional(S.String),
}) {}
export class RateBasedStatementCustomKey extends S.Class<RateBasedStatementCustomKey>(
  "RateBasedStatementCustomKey",
)({
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
}) {}
export const RateBasedStatementCustomKeys = S.Array(
  RateBasedStatementCustomKey,
);
export class ManagedRuleSet extends S.Class<ManagedRuleSet>("ManagedRuleSet")({
  Name: S.String,
  Id: S.String,
  ARN: S.String,
  Description: S.optional(S.String),
  PublishedVersions: S.optional(PublishedVersions),
  RecommendedVersion: S.optional(S.String),
  LabelNamespace: S.optional(S.String),
}) {}
export class SampledHTTPRequest extends S.Class<SampledHTTPRequest>(
  "SampledHTTPRequest",
)({
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
}) {}
export const SampledHTTPRequests = S.Array(SampledHTTPRequest);
export class RateBasedStatement extends S.Class<RateBasedStatement>(
  "RateBasedStatement",
)({
  Limit: S.Number,
  EvaluationWindowSec: S.optional(S.Number),
  AggregateKeyType: S.String,
  ScopeDownStatement: S.optional(
    S.suspend((): S.Schema<Statement, any> => Statement),
  ),
  ForwardedIPConfig: S.optional(ForwardedIPConfig),
  CustomKeys: S.optional(RateBasedStatementCustomKeys),
}) {}
export class CreateWebACLRequest extends S.Class<CreateWebACLRequest>(
  "CreateWebACLRequest",
)(
  {
    Name: S.String,
    Scope: S.String,
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetManagedRuleSetResponse extends S.Class<GetManagedRuleSetResponse>(
  "GetManagedRuleSetResponse",
)(
  {
    ManagedRuleSet: S.optional(ManagedRuleSet),
    LockToken: S.optional(S.String),
  },
  ns,
) {}
export class GetSampledRequestsResponse extends S.Class<GetSampledRequestsResponse>(
  "GetSampledRequestsResponse",
)(
  {
    SampledRequests: S.optional(SampledHTTPRequests),
    PopulationSize: S.optional(S.Number),
    TimeWindow: S.optional(TimeWindow),
  },
  ns,
) {}
export class GetWebACLResponse extends S.Class<GetWebACLResponse>(
  "GetWebACLResponse",
)(
  {
    WebACL: S.optional(WebACL),
    LockToken: S.optional(S.String),
    ApplicationIntegrationURL: S.optional(S.String),
  },
  ns,
) {}
export class CreateWebACLResponse extends S.Class<CreateWebACLResponse>(
  "CreateWebACLResponse",
)({ Summary: S.optional(WebACLSummary) }, ns) {}
export class PutLoggingConfigurationRequest extends S.Class<PutLoggingConfigurationRequest>(
  "PutLoggingConfigurationRequest",
)(
  { LoggingConfiguration: LoggingConfiguration },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutLoggingConfigurationResponse extends S.Class<PutLoggingConfigurationResponse>(
  "PutLoggingConfigurationResponse",
)({ LoggingConfiguration: S.optional(LoggingConfiguration) }, ns) {}
export class CheckCapacityRequest extends S.Class<CheckCapacityRequest>(
  "CheckCapacityRequest",
)(
  { Scope: S.String, Rules: Rules },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CheckCapacityResponse extends S.Class<CheckCapacityResponse>(
  "CheckCapacityResponse",
)({ Capacity: S.optional(S.Number) }, ns) {}

//# Errors
export class WAFInternalErrorException extends S.TaggedError<WAFInternalErrorException>()(
  "WAFInternalErrorException",
  {},
) {}
export class WAFAssociatedItemException extends S.TaggedError<WAFAssociatedItemException>()(
  "WAFAssociatedItemException",
  {},
) {}
export class WAFInvalidOperationException extends S.TaggedError<WAFInvalidOperationException>()(
  "WAFInvalidOperationException",
  {},
) {}
export class WAFInvalidParameterException extends S.TaggedError<WAFInvalidParameterException>()(
  "WAFInvalidParameterException",
  {},
) {}
export class WAFNonexistentItemException extends S.TaggedError<WAFNonexistentItemException>()(
  "WAFNonexistentItemException",
  {},
) {}
export class WAFOptimisticLockException extends S.TaggedError<WAFOptimisticLockException>()(
  "WAFOptimisticLockException",
  {},
) {}
export class WAFTagOperationException extends S.TaggedError<WAFTagOperationException>()(
  "WAFTagOperationException",
  {},
) {}
export class WAFLimitsExceededException extends S.TaggedError<WAFLimitsExceededException>()(
  "WAFLimitsExceededException",
  {},
) {}
export class WAFTagOperationInternalErrorException extends S.TaggedError<WAFTagOperationInternalErrorException>()(
  "WAFTagOperationInternalErrorException",
  {},
) {}
export class WAFInvalidPermissionPolicyException extends S.TaggedError<WAFInvalidPermissionPolicyException>()(
  "WAFInvalidPermissionPolicyException",
  { Message: S.optional(S.String) },
) {}
export class WAFDuplicateItemException extends S.TaggedError<WAFDuplicateItemException>()(
  "WAFDuplicateItemException",
  {},
) {}
export class WAFConfigurationWarningException extends S.TaggedError<WAFConfigurationWarningException>()(
  "WAFConfigurationWarningException",
  {},
) {}
export class WAFFeatureNotIncludedInPricingPlanException extends S.TaggedError<WAFFeatureNotIncludedInPricingPlanException>()(
  "WAFFeatureNotIncludedInPricingPlanException",
  {
    Message: S.optional(S.String),
    DisallowedFeatures: S.optional(DisallowedFeatures),
  },
) {}
export class WAFUnavailableEntityException extends S.TaggedError<WAFUnavailableEntityException>()(
  "WAFUnavailableEntityException",
  {},
) {}
export class WAFExpiredManagedRuleGroupVersionException extends S.TaggedError<WAFExpiredManagedRuleGroupVersionException>()(
  "WAFExpiredManagedRuleGroupVersionException",
  {},
) {}
export class WAFInvalidResourceException extends S.TaggedError<WAFInvalidResourceException>()(
  "WAFInvalidResourceException",
  {},
) {}
export class WAFSubscriptionNotFoundException extends S.TaggedError<WAFSubscriptionNotFoundException>()(
  "WAFSubscriptionNotFoundException",
  {},
) {}
export class WAFUnsupportedAggregateKeyTypeException extends S.TaggedError<WAFUnsupportedAggregateKeyTypeException>()(
  "WAFUnsupportedAggregateKeyTypeException",
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
export const disassociateWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an API key that contains a set of token domains.
 *
 * API keys are required for the integration of the CAPTCHA API in your JavaScript client applications.
 * The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users.
 * For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the *WAF Developer Guide*.
 *
 * You can use a single key for up to 5 domains. After you generate a key, you can copy it for use in your JavaScript
 * integration.
 */
export const createAPIKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specified API key.
 *
 * After you delete a key, it can take up to 24 hours for WAF to disallow use of the key in all regions.
 */
export const deleteAPIKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes all rule groups that are managed by Firewall Manager from the specified WebACL.
 *
 * You can only use this if `ManagedByFirewallManager` and `RetrofittedByFirewallManager` are both false in the web ACL.
 */
export const deleteFirewallManagerRuleGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specified IPSet.
 */
export const deleteIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the LoggingConfiguration from the specified web ACL.
 */
export const deleteLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLoggingConfigurationRequest,
    output: DeleteLoggingConfigurationResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
      WAFNonexistentItemException,
      WAFOptimisticLockException,
    ],
  }),
);
/**
 * Permanently deletes an IAM policy from the specified rule group.
 *
 * You must be the owner of the rule group to perform this operation.
 */
export const deletePermissionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePermissionPolicyRequest,
    output: DeletePermissionPolicyResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidParameterException,
      WAFNonexistentItemException,
    ],
  }),
);
/**
 * Deletes the specified RegexPatternSet.
 */
export const deleteRegexPatternSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes the specified RuleGroup.
 */
export const deleteRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Provides high-level information for the managed rule groups owned by a specific vendor.
 */
export const describeManagedProductsByVendor =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeManagedProductsByVendorRequest,
    output: DescribeManagedProductsByVendorResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
    ],
  }));
/**
 * Generates a presigned download URL for the specified release of the mobile SDK.
 *
 * The mobile SDK is not generally available. Customers who have access to the mobile SDK can use it to establish and manage WAF tokens for use in HTTP(S) requests from a mobile device to WAF. For more information, see
 * WAF client application integration in the *WAF Developer Guide*.
 */
export const generateMobileSdkReleaseUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GenerateMobileSdkReleaseUrlRequest,
    output: GenerateMobileSdkReleaseUrlResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
      WAFNonexistentItemException,
    ],
  }),
);
/**
 * Returns the LoggingConfiguration for the specified web ACL.
 */
export const getLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLoggingConfigurationRequest,
    output: GetLoggingConfigurationResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
      WAFNonexistentItemException,
    ],
  }),
);
/**
 * Returns the IAM policy that is attached to the specified rule group.
 *
 * You must be the owner of the rule group to perform this operation.
 */
export const getPermissionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPermissionPolicyRequest,
  output: GetPermissionPolicyResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
  ],
}));
/**
 * Retrieves an array of your LoggingConfiguration objects.
 */
export const listLoggingConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListLoggingConfigurationsRequest,
    output: ListLoggingConfigurationsResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
    ],
  }),
);
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
export const listResourcesForWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourcesForWebACLRequest,
    output: ListResourcesForWebACLResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
      WAFNonexistentItemException,
    ],
  }),
);
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
export const putPermissionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Disassociates tags from an Amazon Web Services resource. Tags are key:value pairs that you can
 * associate with Amazon Web Services resources. For example, the tag key might be "customer" and the tag
 * value might be "companyA." You can specify one or more tags to add to each container. You
 * can add up to 50 tags to each Amazon Web Services resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the expiration information for your managed rule set. Use this to initiate the
 * expiration of a managed rule group version. After you initiate expiration for a version,
 * WAF excludes it from the response to ListAvailableManagedRuleGroupVersions for the managed rule group.
 *
 * This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.
 *
 * Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are `ListManagedRuleSets`, `GetManagedRuleSet`, `PutManagedRuleSetVersions`, and `UpdateManagedRuleSetVersionExpiryDate`.
 */
export const updateManagedRuleSetVersionExpiryDate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRegexPatternSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const associateWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an IPSet, which you use to identify web requests that
 * originate from specific IP addresses or ranges of IP addresses. For example, if you're
 * receiving a lot of requests from a ranges of IP addresses, you can configure WAF to
 * block them using an IPSet that lists those IP addresses.
 */
export const createIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRegexPatternSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Provides high-level information for the Amazon Web Services Managed Rules rule groups and Amazon Web Services Marketplace managed rule groups.
 */
export const describeAllManagedProducts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAllManagedProductsRequest,
    output: DescribeAllManagedProductsResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
    ],
  }),
);
/**
 * Provides high-level information for a managed rule group, including descriptions of the rules.
 */
export const describeManagedRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns your API key in decrypted form. Use this to check the token domains that you have defined for the key.
 *
 * API keys are required for the integration of the CAPTCHA API in your JavaScript client applications.
 * The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users.
 * For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the *WAF Developer Guide*.
 */
export const getDecryptedAPIKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the specified IPSet.
 */
export const getIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMobileSdkRelease = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the specified RegexPatternSet.
 */
export const getRegexPatternSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWebACLForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWebACLForResourceRequest,
    output: GetWebACLForResourceResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
      WAFNonexistentItemException,
      WAFUnavailableEntityException,
    ],
  }),
);
/**
 * Retrieves a list of the API keys that you've defined for the specified scope.
 *
 * API keys are required for the integration of the CAPTCHA API in your JavaScript client applications.
 * The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users.
 * For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the *WAF Developer Guide*.
 */
export const listAPIKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves an array of managed rule groups that are available for you to use. This list
 * includes all Amazon Web Services Managed Rules rule groups and all of the Amazon Web Services Marketplace managed rule groups that you're
 * subscribed to.
 */
export const listAvailableManagedRuleGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAvailableManagedRuleGroupsRequest,
    output: ListAvailableManagedRuleGroupsResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
    ],
  }));
/**
 * Returns a list of the available versions for the specified managed rule group.
 */
export const listAvailableManagedRuleGroupVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves an array of IPSetSummary objects for the IP sets that you
 * manage.
 */
export const listIPSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listManagedRuleSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listMobileSdkReleases = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMobileSdkReleasesRequest,
    output: ListMobileSdkReleasesResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
    ],
  }),
);
/**
 * Retrieves an array of RegexPatternSetSummary objects for the regex
 * pattern sets that you manage.
 */
export const listRegexPatternSets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRegexPatternSetsRequest,
    output: ListRegexPatternSetsResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
    ],
  }),
);
/**
 * Retrieves an array of RuleGroupSummary objects for the rule groups
 * that you manage.
 */
export const listRuleGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRuleGroupsRequest,
  output: ListRuleGroupsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves an array of WebACLSummary objects for the web ACLs that you
 * manage.
 */
export const listWebACLs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWebACLsRequest,
  output: ListWebACLsResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
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
export const updateIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a RuleGroup per the specifications provided.
 *
 * A rule group defines a collection of rules to inspect and control web requests that you can use in a WebACL. When you create a rule group, you define an immutable capacity limit. If you update a rule group, you must stay within the capacity. This allows others to reuse the rule group with confidence in its capacity requirements.
 */
export const createRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRateBasedStatementManagedKeys =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putManagedRuleSetVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutManagedRuleSetVersionsRequest,
    output: PutManagedRuleSetVersionsResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
      WAFNonexistentItemException,
      WAFOptimisticLockException,
    ],
  }),
);
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
export const updateRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the specified managed rule set.
 *
 * This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.
 *
 * Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are `ListManagedRuleSets`, `GetManagedRuleSet`, `PutManagedRuleSetVersions`, and `UpdateManagedRuleSetVersionExpiryDate`.
 */
export const getManagedRuleSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSampledRequests = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a WebACL per the specifications provided.
 *
 * A web ACL defines a collection of rules to use to inspect and control web requests. Each rule has a statement that defines what to look for in web requests and an action that WAF applies to requests that match the statement. In the web ACL, you assign a default action to take (allow, block) for any request that does not match any of the rules. The rules in a web ACL can be a combination of the types Rule, RuleGroup, and managed rule group. You can associate a web ACL with one or more Amazon Web Services resources to protect. The resource types include Amazon CloudFront distribution, Amazon API Gateway REST API, Application Load Balancer, AppSync GraphQL API, Amazon Cognito user pool, App Runner service, Amplify application, and Amazon Web Services Verified Access instance.
 */
export const createWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const checkCapacity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);

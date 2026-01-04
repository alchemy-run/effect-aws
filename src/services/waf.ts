import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://waf.amazonaws.com/doc/2015-08-24/");
const svc = T.AwsApiService({
  sdkId: "WAF",
  serviceShapeName: "AWSWAF_20150824",
});
const auth = T.AwsAuthSigv4({ name: "waf" });
const ver = T.ServiceVersion("2015-08-24");
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
                {
                  fn: "stringEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                    "aws",
                  ],
                },
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, false] },
              ],
              endpoint: {
                url: "https://waf.amazonaws.com",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "waf",
                      signingRegion: "us-east-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                    "aws",
                  ],
                },
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, false] },
              ],
              endpoint: {
                url: "https://waf-fips.amazonaws.com",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "waf",
                      signingRegion: "us-east-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
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
                        url: "https://waf-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://waf-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://waf.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://waf.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetChangeTokenRequest extends S.Class<GetChangeTokenRequest>(
  "GetChangeTokenRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagKeyList = S.Array(S.String);
export class CreateByteMatchSetRequest extends S.Class<CreateByteMatchSetRequest>(
  "CreateByteMatchSetRequest",
)(
  { Name: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGeoMatchSetRequest extends S.Class<CreateGeoMatchSetRequest>(
  "CreateGeoMatchSetRequest",
)(
  { Name: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateIPSetRequest extends S.Class<CreateIPSetRequest>(
  "CreateIPSetRequest",
)(
  { Name: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRegexMatchSetRequest extends S.Class<CreateRegexMatchSetRequest>(
  "CreateRegexMatchSetRequest",
)(
  { Name: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRegexPatternSetRequest extends S.Class<CreateRegexPatternSetRequest>(
  "CreateRegexPatternSetRequest",
)(
  { Name: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateRuleRequest extends S.Class<CreateRuleRequest>(
  "CreateRuleRequest",
)(
  {
    Name: S.String,
    MetricName: S.String,
    ChangeToken: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRuleGroupRequest extends S.Class<CreateRuleGroupRequest>(
  "CreateRuleGroupRequest",
)(
  {
    Name: S.String,
    MetricName: S.String,
    ChangeToken: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSizeConstraintSetRequest extends S.Class<CreateSizeConstraintSetRequest>(
  "CreateSizeConstraintSetRequest",
)(
  { Name: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSqlInjectionMatchSetRequest extends S.Class<CreateSqlInjectionMatchSetRequest>(
  "CreateSqlInjectionMatchSetRequest",
)(
  { Name: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWebACLMigrationStackRequest extends S.Class<CreateWebACLMigrationStackRequest>(
  "CreateWebACLMigrationStackRequest",
)(
  {
    WebACLId: S.String,
    S3BucketName: S.String,
    IgnoreUnsupportedType: S.Boolean,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateXssMatchSetRequest extends S.Class<CreateXssMatchSetRequest>(
  "CreateXssMatchSetRequest",
)(
  { Name: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteByteMatchSetRequest extends S.Class<DeleteByteMatchSetRequest>(
  "DeleteByteMatchSetRequest",
)(
  { ByteMatchSetId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGeoMatchSetRequest extends S.Class<DeleteGeoMatchSetRequest>(
  "DeleteGeoMatchSetRequest",
)(
  { GeoMatchSetId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIPSetRequest extends S.Class<DeleteIPSetRequest>(
  "DeleteIPSetRequest",
)(
  { IPSetId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLoggingConfigurationRequest extends S.Class<DeleteLoggingConfigurationRequest>(
  "DeleteLoggingConfigurationRequest",
)(
  { ResourceArn: S.String },
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
export class DeleteRateBasedRuleRequest extends S.Class<DeleteRateBasedRuleRequest>(
  "DeleteRateBasedRuleRequest",
)(
  { RuleId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRegexMatchSetRequest extends S.Class<DeleteRegexMatchSetRequest>(
  "DeleteRegexMatchSetRequest",
)(
  { RegexMatchSetId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRegexPatternSetRequest extends S.Class<DeleteRegexPatternSetRequest>(
  "DeleteRegexPatternSetRequest",
)(
  { RegexPatternSetId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRuleRequest extends S.Class<DeleteRuleRequest>(
  "DeleteRuleRequest",
)(
  { RuleId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRuleGroupRequest extends S.Class<DeleteRuleGroupRequest>(
  "DeleteRuleGroupRequest",
)(
  { RuleGroupId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSizeConstraintSetRequest extends S.Class<DeleteSizeConstraintSetRequest>(
  "DeleteSizeConstraintSetRequest",
)(
  { SizeConstraintSetId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSqlInjectionMatchSetRequest extends S.Class<DeleteSqlInjectionMatchSetRequest>(
  "DeleteSqlInjectionMatchSetRequest",
)(
  { SqlInjectionMatchSetId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWebACLRequest extends S.Class<DeleteWebACLRequest>(
  "DeleteWebACLRequest",
)(
  { WebACLId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteXssMatchSetRequest extends S.Class<DeleteXssMatchSetRequest>(
  "DeleteXssMatchSetRequest",
)(
  { XssMatchSetId: S.String, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetByteMatchSetRequest extends S.Class<GetByteMatchSetRequest>(
  "GetByteMatchSetRequest",
)(
  { ByteMatchSetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetChangeTokenResponse extends S.Class<GetChangeTokenResponse>(
  "GetChangeTokenResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class GetChangeTokenStatusRequest extends S.Class<GetChangeTokenStatusRequest>(
  "GetChangeTokenStatusRequest",
)(
  { ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetGeoMatchSetRequest extends S.Class<GetGeoMatchSetRequest>(
  "GetGeoMatchSetRequest",
)(
  { GeoMatchSetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIPSetRequest extends S.Class<GetIPSetRequest>(
  "GetIPSetRequest",
)(
  { IPSetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLoggingConfigurationRequest extends S.Class<GetLoggingConfigurationRequest>(
  "GetLoggingConfigurationRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPermissionPolicyRequest extends S.Class<GetPermissionPolicyRequest>(
  "GetPermissionPolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRateBasedRuleRequest extends S.Class<GetRateBasedRuleRequest>(
  "GetRateBasedRuleRequest",
)(
  { RuleId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRateBasedRuleManagedKeysRequest extends S.Class<GetRateBasedRuleManagedKeysRequest>(
  "GetRateBasedRuleManagedKeysRequest",
)(
  { RuleId: S.String, NextMarker: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRegexMatchSetRequest extends S.Class<GetRegexMatchSetRequest>(
  "GetRegexMatchSetRequest",
)(
  { RegexMatchSetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRegexPatternSetRequest extends S.Class<GetRegexPatternSetRequest>(
  "GetRegexPatternSetRequest",
)(
  { RegexPatternSetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRuleRequest extends S.Class<GetRuleRequest>("GetRuleRequest")(
  { RuleId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRuleGroupRequest extends S.Class<GetRuleGroupRequest>(
  "GetRuleGroupRequest",
)(
  { RuleGroupId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSizeConstraintSetRequest extends S.Class<GetSizeConstraintSetRequest>(
  "GetSizeConstraintSetRequest",
)(
  { SizeConstraintSetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSqlInjectionMatchSetRequest extends S.Class<GetSqlInjectionMatchSetRequest>(
  "GetSqlInjectionMatchSetRequest",
)(
  { SqlInjectionMatchSetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetWebACLRequest extends S.Class<GetWebACLRequest>(
  "GetWebACLRequest",
)(
  { WebACLId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetXssMatchSetRequest extends S.Class<GetXssMatchSetRequest>(
  "GetXssMatchSetRequest",
)(
  { XssMatchSetId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListActivatedRulesInRuleGroupRequest extends S.Class<ListActivatedRulesInRuleGroupRequest>(
  "ListActivatedRulesInRuleGroupRequest",
)(
  {
    RuleGroupId: S.optional(S.String),
    NextMarker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListByteMatchSetsRequest extends S.Class<ListByteMatchSetsRequest>(
  "ListByteMatchSetsRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGeoMatchSetsRequest extends S.Class<ListGeoMatchSetsRequest>(
  "ListGeoMatchSetsRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListIPSetsRequest extends S.Class<ListIPSetsRequest>(
  "ListIPSetsRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLoggingConfigurationsRequest extends S.Class<ListLoggingConfigurationsRequest>(
  "ListLoggingConfigurationsRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRateBasedRulesRequest extends S.Class<ListRateBasedRulesRequest>(
  "ListRateBasedRulesRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRegexMatchSetsRequest extends S.Class<ListRegexMatchSetsRequest>(
  "ListRegexMatchSetsRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRegexPatternSetsRequest extends S.Class<ListRegexPatternSetsRequest>(
  "ListRegexPatternSetsRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRuleGroupsRequest extends S.Class<ListRuleGroupsRequest>(
  "ListRuleGroupsRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRulesRequest extends S.Class<ListRulesRequest>(
  "ListRulesRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSizeConstraintSetsRequest extends S.Class<ListSizeConstraintSetsRequest>(
  "ListSizeConstraintSetsRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSqlInjectionMatchSetsRequest extends S.Class<ListSqlInjectionMatchSetsRequest>(
  "ListSqlInjectionMatchSetsRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSubscribedRuleGroupsRequest extends S.Class<ListSubscribedRuleGroupsRequest>(
  "ListSubscribedRuleGroupsRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
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
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListXssMatchSetsRequest extends S.Class<ListXssMatchSetsRequest>(
  "ListXssMatchSetsRequest",
)(
  { NextMarker: S.optional(S.String), Limit: S.optional(S.Number) },
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
export class Predicate extends S.Class<Predicate>("Predicate")({
  Negated: S.Boolean,
  Type: S.String,
  DataId: S.String,
}) {}
export class RuleUpdate extends S.Class<RuleUpdate>("RuleUpdate")({
  Action: S.String,
  Predicate: Predicate,
}) {}
export const RuleUpdates = S.Array(RuleUpdate);
export class UpdateRuleRequest extends S.Class<UpdateRuleRequest>(
  "UpdateRuleRequest",
)(
  { RuleId: S.String, ChangeToken: S.String, Updates: RuleUpdates },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const LogDestinationConfigs = S.Array(S.String);
export class WafAction extends S.Class<WafAction>("WafAction")({
  Type: S.String,
}) {}
export const ManagedKeys = S.Array(S.String);
export class TimeWindow extends S.Class<TimeWindow>("TimeWindow")({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class WafOverrideAction extends S.Class<WafOverrideAction>(
  "WafOverrideAction",
)({ Type: S.String }) {}
export class ExcludedRule extends S.Class<ExcludedRule>("ExcludedRule")({
  RuleId: S.String,
}) {}
export const ExcludedRules = S.Array(ExcludedRule);
export class ActivatedRule extends S.Class<ActivatedRule>("ActivatedRule")({
  Priority: S.Number,
  RuleId: S.String,
  Action: S.optional(WafAction),
  OverrideAction: S.optional(WafOverrideAction),
  Type: S.optional(S.String),
  ExcludedRules: S.optional(ExcludedRules),
}) {}
export const ActivatedRules = S.Array(ActivatedRule);
export class FieldToMatch extends S.Class<FieldToMatch>("FieldToMatch")({
  Type: S.String,
  Data: S.optional(S.String),
}) {}
export const RedactedFields = S.Array(FieldToMatch);
export class LoggingConfiguration extends S.Class<LoggingConfiguration>(
  "LoggingConfiguration",
)({
  ResourceArn: S.String,
  LogDestinationConfigs: LogDestinationConfigs,
  RedactedFields: S.optional(RedactedFields),
}) {}
export const LoggingConfigurations = S.Array(LoggingConfiguration);
export class RegexPatternSetUpdate extends S.Class<RegexPatternSetUpdate>(
  "RegexPatternSetUpdate",
)({ Action: S.String, RegexPatternString: S.String }) {}
export const RegexPatternSetUpdates = S.Array(RegexPatternSetUpdate);
export class WebACLUpdate extends S.Class<WebACLUpdate>("WebACLUpdate")({
  Action: S.String,
  ActivatedRule: ActivatedRule,
}) {}
export const WebACLUpdates = S.Array(WebACLUpdate);
export class CreateRateBasedRuleRequest extends S.Class<CreateRateBasedRuleRequest>(
  "CreateRateBasedRuleRequest",
)(
  {
    Name: S.String,
    MetricName: S.String,
    RateKey: S.String,
    RateLimit: S.Number,
    ChangeToken: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWebACLRequest extends S.Class<CreateWebACLRequest>(
  "CreateWebACLRequest",
)(
  {
    Name: S.String,
    MetricName: S.String,
    DefaultAction: WafAction,
    ChangeToken: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWebACLMigrationStackResponse extends S.Class<CreateWebACLMigrationStackResponse>(
  "CreateWebACLMigrationStackResponse",
)({ S3ObjectUrl: S.String }, ns) {}
export class DeleteByteMatchSetResponse extends S.Class<DeleteByteMatchSetResponse>(
  "DeleteByteMatchSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class DeleteGeoMatchSetResponse extends S.Class<DeleteGeoMatchSetResponse>(
  "DeleteGeoMatchSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class DeleteIPSetResponse extends S.Class<DeleteIPSetResponse>(
  "DeleteIPSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class DeleteRateBasedRuleResponse extends S.Class<DeleteRateBasedRuleResponse>(
  "DeleteRateBasedRuleResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class DeleteRegexMatchSetResponse extends S.Class<DeleteRegexMatchSetResponse>(
  "DeleteRegexMatchSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class DeleteRegexPatternSetResponse extends S.Class<DeleteRegexPatternSetResponse>(
  "DeleteRegexPatternSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class DeleteRuleResponse extends S.Class<DeleteRuleResponse>(
  "DeleteRuleResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class DeleteRuleGroupResponse extends S.Class<DeleteRuleGroupResponse>(
  "DeleteRuleGroupResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class DeleteSizeConstraintSetResponse extends S.Class<DeleteSizeConstraintSetResponse>(
  "DeleteSizeConstraintSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class DeleteSqlInjectionMatchSetResponse extends S.Class<DeleteSqlInjectionMatchSetResponse>(
  "DeleteSqlInjectionMatchSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class DeleteWebACLResponse extends S.Class<DeleteWebACLResponse>(
  "DeleteWebACLResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class DeleteXssMatchSetResponse extends S.Class<DeleteXssMatchSetResponse>(
  "DeleteXssMatchSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class ByteMatchTuple extends S.Class<ByteMatchTuple>("ByteMatchTuple")({
  FieldToMatch: FieldToMatch,
  TargetString: T.Blob,
  TextTransformation: S.String,
  PositionalConstraint: S.String,
}) {}
export const ByteMatchTuples = S.Array(ByteMatchTuple);
export class ByteMatchSet extends S.Class<ByteMatchSet>("ByteMatchSet")({
  ByteMatchSetId: S.String,
  Name: S.optional(S.String),
  ByteMatchTuples: ByteMatchTuples,
}) {}
export class GetByteMatchSetResponse extends S.Class<GetByteMatchSetResponse>(
  "GetByteMatchSetResponse",
)({ ByteMatchSet: S.optional(ByteMatchSet) }, ns) {}
export class GetChangeTokenStatusResponse extends S.Class<GetChangeTokenStatusResponse>(
  "GetChangeTokenStatusResponse",
)({ ChangeTokenStatus: S.optional(S.String) }, ns) {}
export class GeoMatchConstraint extends S.Class<GeoMatchConstraint>(
  "GeoMatchConstraint",
)({ Type: S.String, Value: S.String }) {}
export const GeoMatchConstraints = S.Array(GeoMatchConstraint);
export class GeoMatchSet extends S.Class<GeoMatchSet>("GeoMatchSet")({
  GeoMatchSetId: S.String,
  Name: S.optional(S.String),
  GeoMatchConstraints: GeoMatchConstraints,
}) {}
export class GetGeoMatchSetResponse extends S.Class<GetGeoMatchSetResponse>(
  "GetGeoMatchSetResponse",
)({ GeoMatchSet: S.optional(GeoMatchSet) }, ns) {}
export class IPSetDescriptor extends S.Class<IPSetDescriptor>(
  "IPSetDescriptor",
)({ Type: S.String, Value: S.String }) {}
export const IPSetDescriptors = S.Array(IPSetDescriptor);
export class IPSet extends S.Class<IPSet>("IPSet")({
  IPSetId: S.String,
  Name: S.optional(S.String),
  IPSetDescriptors: IPSetDescriptors,
}) {}
export class GetIPSetResponse extends S.Class<GetIPSetResponse>(
  "GetIPSetResponse",
)({ IPSet: S.optional(IPSet) }, ns) {}
export class GetLoggingConfigurationResponse extends S.Class<GetLoggingConfigurationResponse>(
  "GetLoggingConfigurationResponse",
)({ LoggingConfiguration: S.optional(LoggingConfiguration) }, ns) {}
export class GetPermissionPolicyResponse extends S.Class<GetPermissionPolicyResponse>(
  "GetPermissionPolicyResponse",
)({ Policy: S.optional(S.String) }, ns) {}
export class GetRateBasedRuleManagedKeysResponse extends S.Class<GetRateBasedRuleManagedKeysResponse>(
  "GetRateBasedRuleManagedKeysResponse",
)(
  { ManagedKeys: S.optional(ManagedKeys), NextMarker: S.optional(S.String) },
  ns,
) {}
export class RegexMatchTuple extends S.Class<RegexMatchTuple>(
  "RegexMatchTuple",
)({
  FieldToMatch: FieldToMatch,
  TextTransformation: S.String,
  RegexPatternSetId: S.String,
}) {}
export const RegexMatchTuples = S.Array(RegexMatchTuple);
export class RegexMatchSet extends S.Class<RegexMatchSet>("RegexMatchSet")({
  RegexMatchSetId: S.optional(S.String),
  Name: S.optional(S.String),
  RegexMatchTuples: S.optional(RegexMatchTuples),
}) {}
export class GetRegexMatchSetResponse extends S.Class<GetRegexMatchSetResponse>(
  "GetRegexMatchSetResponse",
)({ RegexMatchSet: S.optional(RegexMatchSet) }, ns) {}
export const RegexPatternStrings = S.Array(S.String);
export class RegexPatternSet extends S.Class<RegexPatternSet>(
  "RegexPatternSet",
)({
  RegexPatternSetId: S.String,
  Name: S.optional(S.String),
  RegexPatternStrings: RegexPatternStrings,
}) {}
export class GetRegexPatternSetResponse extends S.Class<GetRegexPatternSetResponse>(
  "GetRegexPatternSetResponse",
)({ RegexPatternSet: S.optional(RegexPatternSet) }, ns) {}
export const Predicates = S.Array(Predicate);
export class Rule extends S.Class<Rule>("Rule")({
  RuleId: S.String,
  Name: S.optional(S.String),
  MetricName: S.optional(S.String),
  Predicates: Predicates,
}) {}
export class GetRuleResponse extends S.Class<GetRuleResponse>(
  "GetRuleResponse",
)({ Rule: S.optional(Rule) }, ns) {}
export class RuleGroup extends S.Class<RuleGroup>("RuleGroup")({
  RuleGroupId: S.String,
  Name: S.optional(S.String),
  MetricName: S.optional(S.String),
}) {}
export class GetRuleGroupResponse extends S.Class<GetRuleGroupResponse>(
  "GetRuleGroupResponse",
)({ RuleGroup: S.optional(RuleGroup) }, ns) {}
export class GetSampledRequestsRequest extends S.Class<GetSampledRequestsRequest>(
  "GetSampledRequestsRequest",
)(
  {
    WebAclId: S.String,
    RuleId: S.String,
    TimeWindow: TimeWindow,
    MaxItems: S.Number,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SizeConstraint extends S.Class<SizeConstraint>("SizeConstraint")({
  FieldToMatch: FieldToMatch,
  TextTransformation: S.String,
  ComparisonOperator: S.String,
  Size: S.Number,
}) {}
export const SizeConstraints = S.Array(SizeConstraint);
export class SizeConstraintSet extends S.Class<SizeConstraintSet>(
  "SizeConstraintSet",
)({
  SizeConstraintSetId: S.String,
  Name: S.optional(S.String),
  SizeConstraints: SizeConstraints,
}) {}
export class GetSizeConstraintSetResponse extends S.Class<GetSizeConstraintSetResponse>(
  "GetSizeConstraintSetResponse",
)({ SizeConstraintSet: S.optional(SizeConstraintSet) }, ns) {}
export class SqlInjectionMatchTuple extends S.Class<SqlInjectionMatchTuple>(
  "SqlInjectionMatchTuple",
)({ FieldToMatch: FieldToMatch, TextTransformation: S.String }) {}
export const SqlInjectionMatchTuples = S.Array(SqlInjectionMatchTuple);
export class SqlInjectionMatchSet extends S.Class<SqlInjectionMatchSet>(
  "SqlInjectionMatchSet",
)({
  SqlInjectionMatchSetId: S.String,
  Name: S.optional(S.String),
  SqlInjectionMatchTuples: SqlInjectionMatchTuples,
}) {}
export class GetSqlInjectionMatchSetResponse extends S.Class<GetSqlInjectionMatchSetResponse>(
  "GetSqlInjectionMatchSetResponse",
)({ SqlInjectionMatchSet: S.optional(SqlInjectionMatchSet) }, ns) {}
export class XssMatchTuple extends S.Class<XssMatchTuple>("XssMatchTuple")({
  FieldToMatch: FieldToMatch,
  TextTransformation: S.String,
}) {}
export const XssMatchTuples = S.Array(XssMatchTuple);
export class XssMatchSet extends S.Class<XssMatchSet>("XssMatchSet")({
  XssMatchSetId: S.String,
  Name: S.optional(S.String),
  XssMatchTuples: XssMatchTuples,
}) {}
export class GetXssMatchSetResponse extends S.Class<GetXssMatchSetResponse>(
  "GetXssMatchSetResponse",
)({ XssMatchSet: S.optional(XssMatchSet) }, ns) {}
export class ListActivatedRulesInRuleGroupResponse extends S.Class<ListActivatedRulesInRuleGroupResponse>(
  "ListActivatedRulesInRuleGroupResponse",
)(
  {
    NextMarker: S.optional(S.String),
    ActivatedRules: S.optional(ActivatedRules),
  },
  ns,
) {}
export class ListLoggingConfigurationsResponse extends S.Class<ListLoggingConfigurationsResponse>(
  "ListLoggingConfigurationsResponse",
)(
  {
    LoggingConfigurations: S.optional(LoggingConfigurations),
    NextMarker: S.optional(S.String),
  },
  ns,
) {}
export class RuleSummary extends S.Class<RuleSummary>("RuleSummary")({
  RuleId: S.String,
  Name: S.String,
}) {}
export const RuleSummaries = S.Array(RuleSummary);
export class ListRulesResponse extends S.Class<ListRulesResponse>(
  "ListRulesResponse",
)({ NextMarker: S.optional(S.String), Rules: S.optional(RuleSummaries) }, ns) {}
export class UpdateRegexPatternSetRequest extends S.Class<UpdateRegexPatternSetRequest>(
  "UpdateRegexPatternSetRequest",
)(
  {
    RegexPatternSetId: S.String,
    Updates: RegexPatternSetUpdates,
    ChangeToken: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRuleResponse extends S.Class<UpdateRuleResponse>(
  "UpdateRuleResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class UpdateWebACLRequest extends S.Class<UpdateWebACLRequest>(
  "UpdateWebACLRequest",
)(
  {
    WebACLId: S.String,
    ChangeToken: S.String,
    Updates: S.optional(WebACLUpdates),
    DefaultAction: S.optional(WafAction),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RateBasedRule extends S.Class<RateBasedRule>("RateBasedRule")({
  RuleId: S.String,
  Name: S.optional(S.String),
  MetricName: S.optional(S.String),
  MatchPredicates: Predicates,
  RateKey: S.String,
  RateLimit: S.Number,
}) {}
export class WebACL extends S.Class<WebACL>("WebACL")({
  WebACLId: S.String,
  Name: S.optional(S.String),
  MetricName: S.optional(S.String),
  DefaultAction: WafAction,
  Rules: ActivatedRules,
  WebACLArn: S.optional(S.String),
}) {}
export class ByteMatchSetSummary extends S.Class<ByteMatchSetSummary>(
  "ByteMatchSetSummary",
)({ ByteMatchSetId: S.String, Name: S.String }) {}
export const ByteMatchSetSummaries = S.Array(ByteMatchSetSummary);
export class GeoMatchSetSummary extends S.Class<GeoMatchSetSummary>(
  "GeoMatchSetSummary",
)({ GeoMatchSetId: S.String, Name: S.String }) {}
export const GeoMatchSetSummaries = S.Array(GeoMatchSetSummary);
export class IPSetSummary extends S.Class<IPSetSummary>("IPSetSummary")({
  IPSetId: S.String,
  Name: S.String,
}) {}
export const IPSetSummaries = S.Array(IPSetSummary);
export class RegexMatchSetSummary extends S.Class<RegexMatchSetSummary>(
  "RegexMatchSetSummary",
)({ RegexMatchSetId: S.String, Name: S.String }) {}
export const RegexMatchSetSummaries = S.Array(RegexMatchSetSummary);
export class RegexPatternSetSummary extends S.Class<RegexPatternSetSummary>(
  "RegexPatternSetSummary",
)({ RegexPatternSetId: S.String, Name: S.String }) {}
export const RegexPatternSetSummaries = S.Array(RegexPatternSetSummary);
export class RuleGroupSummary extends S.Class<RuleGroupSummary>(
  "RuleGroupSummary",
)({ RuleGroupId: S.String, Name: S.String }) {}
export const RuleGroupSummaries = S.Array(RuleGroupSummary);
export class SizeConstraintSetSummary extends S.Class<SizeConstraintSetSummary>(
  "SizeConstraintSetSummary",
)({ SizeConstraintSetId: S.String, Name: S.String }) {}
export const SizeConstraintSetSummaries = S.Array(SizeConstraintSetSummary);
export class SqlInjectionMatchSetSummary extends S.Class<SqlInjectionMatchSetSummary>(
  "SqlInjectionMatchSetSummary",
)({ SqlInjectionMatchSetId: S.String, Name: S.String }) {}
export const SqlInjectionMatchSetSummaries = S.Array(
  SqlInjectionMatchSetSummary,
);
export class SubscribedRuleGroupSummary extends S.Class<SubscribedRuleGroupSummary>(
  "SubscribedRuleGroupSummary",
)({ RuleGroupId: S.String, Name: S.String, MetricName: S.String }) {}
export const SubscribedRuleGroupSummaries = S.Array(SubscribedRuleGroupSummary);
export class TagInfoForResource extends S.Class<TagInfoForResource>(
  "TagInfoForResource",
)({ ResourceARN: S.optional(S.String), TagList: S.optional(TagList) }) {}
export class WebACLSummary extends S.Class<WebACLSummary>("WebACLSummary")({
  WebACLId: S.String,
  Name: S.String,
}) {}
export const WebACLSummaries = S.Array(WebACLSummary);
export class XssMatchSetSummary extends S.Class<XssMatchSetSummary>(
  "XssMatchSetSummary",
)({ XssMatchSetId: S.String, Name: S.String }) {}
export const XssMatchSetSummaries = S.Array(XssMatchSetSummary);
export class ByteMatchSetUpdate extends S.Class<ByteMatchSetUpdate>(
  "ByteMatchSetUpdate",
)({ Action: S.String, ByteMatchTuple: ByteMatchTuple }) {}
export const ByteMatchSetUpdates = S.Array(ByteMatchSetUpdate);
export class GeoMatchSetUpdate extends S.Class<GeoMatchSetUpdate>(
  "GeoMatchSetUpdate",
)({ Action: S.String, GeoMatchConstraint: GeoMatchConstraint }) {}
export const GeoMatchSetUpdates = S.Array(GeoMatchSetUpdate);
export class IPSetUpdate extends S.Class<IPSetUpdate>("IPSetUpdate")({
  Action: S.String,
  IPSetDescriptor: IPSetDescriptor,
}) {}
export const IPSetUpdates = S.Array(IPSetUpdate);
export class RegexMatchSetUpdate extends S.Class<RegexMatchSetUpdate>(
  "RegexMatchSetUpdate",
)({ Action: S.String, RegexMatchTuple: RegexMatchTuple }) {}
export const RegexMatchSetUpdates = S.Array(RegexMatchSetUpdate);
export class SizeConstraintSetUpdate extends S.Class<SizeConstraintSetUpdate>(
  "SizeConstraintSetUpdate",
)({ Action: S.String, SizeConstraint: SizeConstraint }) {}
export const SizeConstraintSetUpdates = S.Array(SizeConstraintSetUpdate);
export class SqlInjectionMatchSetUpdate extends S.Class<SqlInjectionMatchSetUpdate>(
  "SqlInjectionMatchSetUpdate",
)({ Action: S.String, SqlInjectionMatchTuple: SqlInjectionMatchTuple }) {}
export const SqlInjectionMatchSetUpdates = S.Array(SqlInjectionMatchSetUpdate);
export class XssMatchSetUpdate extends S.Class<XssMatchSetUpdate>(
  "XssMatchSetUpdate",
)({ Action: S.String, XssMatchTuple: XssMatchTuple }) {}
export const XssMatchSetUpdates = S.Array(XssMatchSetUpdate);
export class CreateByteMatchSetResponse extends S.Class<CreateByteMatchSetResponse>(
  "CreateByteMatchSetResponse",
)(
  { ByteMatchSet: S.optional(ByteMatchSet), ChangeToken: S.optional(S.String) },
  ns,
) {}
export class CreateGeoMatchSetResponse extends S.Class<CreateGeoMatchSetResponse>(
  "CreateGeoMatchSetResponse",
)(
  { GeoMatchSet: S.optional(GeoMatchSet), ChangeToken: S.optional(S.String) },
  ns,
) {}
export class CreateIPSetResponse extends S.Class<CreateIPSetResponse>(
  "CreateIPSetResponse",
)({ IPSet: S.optional(IPSet), ChangeToken: S.optional(S.String) }, ns) {}
export class CreateRateBasedRuleResponse extends S.Class<CreateRateBasedRuleResponse>(
  "CreateRateBasedRuleResponse",
)({ Rule: S.optional(RateBasedRule), ChangeToken: S.optional(S.String) }, ns) {}
export class CreateRegexMatchSetResponse extends S.Class<CreateRegexMatchSetResponse>(
  "CreateRegexMatchSetResponse",
)(
  {
    RegexMatchSet: S.optional(RegexMatchSet),
    ChangeToken: S.optional(S.String),
  },
  ns,
) {}
export class CreateRegexPatternSetResponse extends S.Class<CreateRegexPatternSetResponse>(
  "CreateRegexPatternSetResponse",
)(
  {
    RegexPatternSet: S.optional(RegexPatternSet),
    ChangeToken: S.optional(S.String),
  },
  ns,
) {}
export class CreateRuleResponse extends S.Class<CreateRuleResponse>(
  "CreateRuleResponse",
)({ Rule: S.optional(Rule), ChangeToken: S.optional(S.String) }, ns) {}
export class CreateRuleGroupResponse extends S.Class<CreateRuleGroupResponse>(
  "CreateRuleGroupResponse",
)(
  { RuleGroup: S.optional(RuleGroup), ChangeToken: S.optional(S.String) },
  ns,
) {}
export class CreateSizeConstraintSetResponse extends S.Class<CreateSizeConstraintSetResponse>(
  "CreateSizeConstraintSetResponse",
)(
  {
    SizeConstraintSet: S.optional(SizeConstraintSet),
    ChangeToken: S.optional(S.String),
  },
  ns,
) {}
export class CreateSqlInjectionMatchSetResponse extends S.Class<CreateSqlInjectionMatchSetResponse>(
  "CreateSqlInjectionMatchSetResponse",
)(
  {
    SqlInjectionMatchSet: S.optional(SqlInjectionMatchSet),
    ChangeToken: S.optional(S.String),
  },
  ns,
) {}
export class CreateWebACLResponse extends S.Class<CreateWebACLResponse>(
  "CreateWebACLResponse",
)({ WebACL: S.optional(WebACL), ChangeToken: S.optional(S.String) }, ns) {}
export class CreateXssMatchSetResponse extends S.Class<CreateXssMatchSetResponse>(
  "CreateXssMatchSetResponse",
)(
  { XssMatchSet: S.optional(XssMatchSet), ChangeToken: S.optional(S.String) },
  ns,
) {}
export class GetRateBasedRuleResponse extends S.Class<GetRateBasedRuleResponse>(
  "GetRateBasedRuleResponse",
)({ Rule: S.optional(RateBasedRule) }, ns) {}
export class GetWebACLResponse extends S.Class<GetWebACLResponse>(
  "GetWebACLResponse",
)({ WebACL: S.optional(WebACL) }, ns) {}
export class ListByteMatchSetsResponse extends S.Class<ListByteMatchSetsResponse>(
  "ListByteMatchSetsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    ByteMatchSets: S.optional(ByteMatchSetSummaries),
  },
  ns,
) {}
export class ListGeoMatchSetsResponse extends S.Class<ListGeoMatchSetsResponse>(
  "ListGeoMatchSetsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    GeoMatchSets: S.optional(GeoMatchSetSummaries),
  },
  ns,
) {}
export class ListIPSetsResponse extends S.Class<ListIPSetsResponse>(
  "ListIPSetsResponse",
)(
  { NextMarker: S.optional(S.String), IPSets: S.optional(IPSetSummaries) },
  ns,
) {}
export class ListRateBasedRulesResponse extends S.Class<ListRateBasedRulesResponse>(
  "ListRateBasedRulesResponse",
)({ NextMarker: S.optional(S.String), Rules: S.optional(RuleSummaries) }, ns) {}
export class ListRegexMatchSetsResponse extends S.Class<ListRegexMatchSetsResponse>(
  "ListRegexMatchSetsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    RegexMatchSets: S.optional(RegexMatchSetSummaries),
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
export class ListSizeConstraintSetsResponse extends S.Class<ListSizeConstraintSetsResponse>(
  "ListSizeConstraintSetsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    SizeConstraintSets: S.optional(SizeConstraintSetSummaries),
  },
  ns,
) {}
export class ListSqlInjectionMatchSetsResponse extends S.Class<ListSqlInjectionMatchSetsResponse>(
  "ListSqlInjectionMatchSetsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    SqlInjectionMatchSets: S.optional(SqlInjectionMatchSetSummaries),
  },
  ns,
) {}
export class ListSubscribedRuleGroupsResponse extends S.Class<ListSubscribedRuleGroupsResponse>(
  "ListSubscribedRuleGroupsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    RuleGroups: S.optional(SubscribedRuleGroupSummaries),
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
export class ListXssMatchSetsResponse extends S.Class<ListXssMatchSetsResponse>(
  "ListXssMatchSetsResponse",
)(
  {
    NextMarker: S.optional(S.String),
    XssMatchSets: S.optional(XssMatchSetSummaries),
  },
  ns,
) {}
export class PutLoggingConfigurationRequest extends S.Class<PutLoggingConfigurationRequest>(
  "PutLoggingConfigurationRequest",
)(
  { LoggingConfiguration: LoggingConfiguration },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateByteMatchSetRequest extends S.Class<UpdateByteMatchSetRequest>(
  "UpdateByteMatchSetRequest",
)(
  {
    ByteMatchSetId: S.String,
    ChangeToken: S.String,
    Updates: ByteMatchSetUpdates,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateGeoMatchSetRequest extends S.Class<UpdateGeoMatchSetRequest>(
  "UpdateGeoMatchSetRequest",
)(
  {
    GeoMatchSetId: S.String,
    ChangeToken: S.String,
    Updates: GeoMatchSetUpdates,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateIPSetRequest extends S.Class<UpdateIPSetRequest>(
  "UpdateIPSetRequest",
)(
  { IPSetId: S.String, ChangeToken: S.String, Updates: IPSetUpdates },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRateBasedRuleRequest extends S.Class<UpdateRateBasedRuleRequest>(
  "UpdateRateBasedRuleRequest",
)(
  {
    RuleId: S.String,
    ChangeToken: S.String,
    Updates: RuleUpdates,
    RateLimit: S.Number,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRegexMatchSetRequest extends S.Class<UpdateRegexMatchSetRequest>(
  "UpdateRegexMatchSetRequest",
)(
  {
    RegexMatchSetId: S.String,
    Updates: RegexMatchSetUpdates,
    ChangeToken: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRegexPatternSetResponse extends S.Class<UpdateRegexPatternSetResponse>(
  "UpdateRegexPatternSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class UpdateSizeConstraintSetRequest extends S.Class<UpdateSizeConstraintSetRequest>(
  "UpdateSizeConstraintSetRequest",
)(
  {
    SizeConstraintSetId: S.String,
    ChangeToken: S.String,
    Updates: SizeConstraintSetUpdates,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSqlInjectionMatchSetRequest extends S.Class<UpdateSqlInjectionMatchSetRequest>(
  "UpdateSqlInjectionMatchSetRequest",
)(
  {
    SqlInjectionMatchSetId: S.String,
    ChangeToken: S.String,
    Updates: SqlInjectionMatchSetUpdates,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateWebACLResponse extends S.Class<UpdateWebACLResponse>(
  "UpdateWebACLResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class UpdateXssMatchSetRequest extends S.Class<UpdateXssMatchSetRequest>(
  "UpdateXssMatchSetRequest",
)(
  {
    XssMatchSetId: S.String,
    ChangeToken: S.String,
    Updates: XssMatchSetUpdates,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RuleGroupUpdate extends S.Class<RuleGroupUpdate>(
  "RuleGroupUpdate",
)({ Action: S.String, ActivatedRule: ActivatedRule }) {}
export const RuleGroupUpdates = S.Array(RuleGroupUpdate);
export class PutLoggingConfigurationResponse extends S.Class<PutLoggingConfigurationResponse>(
  "PutLoggingConfigurationResponse",
)({ LoggingConfiguration: S.optional(LoggingConfiguration) }, ns) {}
export class UpdateByteMatchSetResponse extends S.Class<UpdateByteMatchSetResponse>(
  "UpdateByteMatchSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class UpdateGeoMatchSetResponse extends S.Class<UpdateGeoMatchSetResponse>(
  "UpdateGeoMatchSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class UpdateIPSetResponse extends S.Class<UpdateIPSetResponse>(
  "UpdateIPSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class UpdateRateBasedRuleResponse extends S.Class<UpdateRateBasedRuleResponse>(
  "UpdateRateBasedRuleResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class UpdateRegexMatchSetResponse extends S.Class<UpdateRegexMatchSetResponse>(
  "UpdateRegexMatchSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class UpdateRuleGroupRequest extends S.Class<UpdateRuleGroupRequest>(
  "UpdateRuleGroupRequest",
)(
  { RuleGroupId: S.String, Updates: RuleGroupUpdates, ChangeToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSizeConstraintSetResponse extends S.Class<UpdateSizeConstraintSetResponse>(
  "UpdateSizeConstraintSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class UpdateSqlInjectionMatchSetResponse extends S.Class<UpdateSqlInjectionMatchSetResponse>(
  "UpdateSqlInjectionMatchSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class UpdateXssMatchSetResponse extends S.Class<UpdateXssMatchSetResponse>(
  "UpdateXssMatchSetResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class HTTPHeader extends S.Class<HTTPHeader>("HTTPHeader")({
  Name: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const HTTPHeaders = S.Array(HTTPHeader);
export class UpdateRuleGroupResponse extends S.Class<UpdateRuleGroupResponse>(
  "UpdateRuleGroupResponse",
)({ ChangeToken: S.optional(S.String) }, ns) {}
export class HTTPRequest extends S.Class<HTTPRequest>("HTTPRequest")({
  ClientIP: S.optional(S.String),
  Country: S.optional(S.String),
  URI: S.optional(S.String),
  Method: S.optional(S.String),
  HTTPVersion: S.optional(S.String),
  Headers: S.optional(HTTPHeaders),
}) {}
export class SampledHTTPRequest extends S.Class<SampledHTTPRequest>(
  "SampledHTTPRequest",
)({
  Request: HTTPRequest,
  Weight: S.Number,
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Action: S.optional(S.String),
  RuleWithinRuleGroup: S.optional(S.String),
}) {}
export const SampledHTTPRequests = S.Array(SampledHTTPRequest);
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

//# Errors
export class WAFInternalErrorException extends S.TaggedError<WAFInternalErrorException>()(
  "WAFInternalErrorException",
  {},
) {}
export class WAFBadRequestException extends S.TaggedError<WAFBadRequestException>()(
  "WAFBadRequestException",
  {},
) {}
export class WAFInvalidAccountException extends S.TaggedError<WAFInvalidAccountException>()(
  "WAFInvalidAccountException",
  {},
) {}
export class WAFNonEmptyEntityException extends S.TaggedError<WAFNonEmptyEntityException>()(
  "WAFNonEmptyEntityException",
  {},
) {}
export class WAFNonexistentItemException extends S.TaggedError<WAFNonexistentItemException>()(
  "WAFNonexistentItemException",
  {},
) {}
export class WAFReferencedItemException extends S.TaggedError<WAFReferencedItemException>()(
  "WAFReferencedItemException",
  {},
) {}
export class WAFStaleDataException extends S.TaggedError<WAFStaleDataException>()(
  "WAFStaleDataException",
  {},
) {}
export class WAFTagOperationException extends S.TaggedError<WAFTagOperationException>()(
  "WAFTagOperationException",
  {},
) {}
export class WAFTagOperationInternalErrorException extends S.TaggedError<WAFTagOperationInternalErrorException>()(
  "WAFTagOperationInternalErrorException",
  {},
) {}
export class WAFInvalidParameterException extends S.TaggedError<WAFInvalidParameterException>()(
  "WAFInvalidParameterException",
  {},
) {}
export class WAFInvalidPermissionPolicyException extends S.TaggedError<WAFInvalidPermissionPolicyException>()(
  "WAFInvalidPermissionPolicyException",
  { message: S.optional(S.String) },
) {}
export class WAFInvalidOperationException extends S.TaggedError<WAFInvalidOperationException>()(
  "WAFInvalidOperationException",
  {},
) {}
export class WAFLimitsExceededException extends S.TaggedError<WAFLimitsExceededException>()(
  "WAFLimitsExceededException",
  {},
) {}
export class WAFDisallowedNameException extends S.TaggedError<WAFDisallowedNameException>()(
  "WAFDisallowedNameException",
  {},
) {}
export class WAFEntityMigrationException extends S.TaggedError<WAFEntityMigrationException>()(
  "WAFEntityMigrationException",
  {
    message: S.optional(S.String),
    MigrationErrorType: S.optional(S.String),
    MigrationErrorReason: S.optional(S.String),
  },
) {}
export class WAFNonexistentContainerException extends S.TaggedError<WAFNonexistentContainerException>()(
  "WAFNonexistentContainerException",
  { message: S.optional(S.String) },
) {}
export class WAFInvalidRegexPatternException extends S.TaggedError<WAFInvalidRegexPatternException>()(
  "WAFInvalidRegexPatternException",
  { message: S.optional(S.String) },
) {}
export class WAFSubscriptionNotFoundException extends S.TaggedError<WAFSubscriptionNotFoundException>()(
  "WAFSubscriptionNotFoundException",
  { message: S.optional(S.String) },
) {}
export class WAFServiceLinkedRoleErrorException extends S.TaggedError<WAFServiceLinkedRoleErrorException>()(
  "WAFServiceLinkedRoleErrorException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * When you want to create, update, or delete AWS WAF objects, get a change token and include the change token in the create, update, or delete request. Change tokens ensure that your application doesn't submit conflicting requests to AWS WAF.
 *
 * Each create, update, or delete request must use a unique change token. If your application submits a `GetChangeToken` request
 * and then submits a second `GetChangeToken` request before submitting a create, update, or delete request, the second
 * `GetChangeToken` request returns the same value as the first `GetChangeToken` request.
 *
 * When you use a change token in a create, update, or delete request, the status of the change token changes to `PENDING`,
 * which indicates that AWS WAF is propagating the change to all AWS WAF servers. Use `GetChangeTokenStatus` to determine the
 * status of your change token.
 */
export const getChangeToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChangeTokenRequest,
  output: GetChangeTokenResponse,
  errors: [WAFInternalErrorException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes the LoggingConfiguration from the specified web
 * ACL.
 */
export const deleteLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLoggingConfigurationRequest,
    output: DeleteLoggingConfigurationResponse,
    errors: [
      WAFInternalErrorException,
      WAFNonexistentItemException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes an IAM policy from the specified RuleGroup.
 *
 * The user making the request must be the owner of the RuleGroup.
 */
export const deletePermissionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePermissionPolicyRequest,
    output: DeletePermissionPolicyResponse,
    errors: [
      WAFInternalErrorException,
      WAFNonexistentItemException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes a RegexMatchSet. You can't delete a `RegexMatchSet` if it's still used in any `Rules`
 * or if it still includes any `RegexMatchTuples` objects (any filters).
 *
 * If you just want to remove a `RegexMatchSet` from a `Rule`, use UpdateRule.
 *
 * To permanently delete a `RegexMatchSet`, perform the following steps:
 *
 * - Update the `RegexMatchSet` to remove filters, if any. For more information, see UpdateRegexMatchSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `DeleteRegexMatchSet` request.
 *
 * - Submit a `DeleteRegexMatchSet` request.
 */
export const deleteRegexMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRegexMatchSetRequest,
  output: DeleteRegexMatchSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonEmptyEntityException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes a RegexPatternSet. You can't delete a `RegexPatternSet` if it's still used in any `RegexMatchSet`
 * or if the `RegexPatternSet` is not empty.
 */
export const deleteRegexPatternSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRegexPatternSetRequest,
    output: DeleteRegexPatternSetResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidAccountException,
      WAFNonEmptyEntityException,
      WAFNonexistentItemException,
      WAFReferencedItemException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes a SizeConstraintSet. You can't delete a `SizeConstraintSet` if it's still used in any `Rules`
 * or if it still includes any SizeConstraint objects (any filters).
 *
 * If you just want to remove a `SizeConstraintSet` from a `Rule`, use UpdateRule.
 *
 * To permanently delete a `SizeConstraintSet`, perform the following steps:
 *
 * - Update the `SizeConstraintSet` to remove filters, if any. For more information, see UpdateSizeConstraintSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `DeleteSizeConstraintSet` request.
 *
 * - Submit a `DeleteSizeConstraintSet` request.
 */
export const deleteSizeConstraintSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSizeConstraintSetRequest,
    output: DeleteSizeConstraintSetResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidAccountException,
      WAFNonEmptyEntityException,
      WAFNonexistentItemException,
      WAFReferencedItemException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes a SqlInjectionMatchSet. You can't delete a `SqlInjectionMatchSet` if it's
 * still used in any `Rules` or if it still contains any SqlInjectionMatchTuple objects.
 *
 * If you just want to remove a `SqlInjectionMatchSet` from a `Rule`, use UpdateRule.
 *
 * To permanently delete a `SqlInjectionMatchSet` from AWS WAF, perform the following steps:
 *
 * - Update the `SqlInjectionMatchSet` to remove filters, if any. For more information, see
 * UpdateSqlInjectionMatchSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `DeleteSqlInjectionMatchSet` request.
 *
 * - Submit a `DeleteSqlInjectionMatchSet` request.
 */
export const deleteSqlInjectionMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSqlInjectionMatchSetRequest,
    output: DeleteSqlInjectionMatchSetResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidAccountException,
      WAFNonEmptyEntityException,
      WAFNonexistentItemException,
      WAFReferencedItemException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes a WebACL. You can't delete a `WebACL` if it still contains any `Rules`.
 *
 * To delete a `WebACL`, perform the following steps:
 *
 * - Update the `WebACL` to remove `Rules`, if any. For more information, see UpdateWebACL.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `DeleteWebACL` request.
 *
 * - Submit a `DeleteWebACL` request.
 */
export const deleteWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWebACLRequest,
  output: DeleteWebACLResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonEmptyEntityException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes an XssMatchSet. You can't delete an `XssMatchSet` if it's
 * still used in any `Rules` or if it still contains any XssMatchTuple objects.
 *
 * If you just want to remove an `XssMatchSet` from a `Rule`, use UpdateRule.
 *
 * To permanently delete an `XssMatchSet` from AWS WAF, perform the following steps:
 *
 * - Update the `XssMatchSet` to remove filters, if any. For more information, see
 * UpdateXssMatchSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `DeleteXssMatchSet` request.
 *
 * - Submit a `DeleteXssMatchSet` request.
 */
export const deleteXssMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteXssMatchSetRequest,
  output: DeleteXssMatchSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonEmptyEntityException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the ByteMatchSet specified by `ByteMatchSetId`.
 */
export const getByteMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetByteMatchSetRequest,
  output: GetByteMatchSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonexistentItemException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the status of a `ChangeToken` that you got by calling GetChangeToken. `ChangeTokenStatus` is
 * one of the following values:
 *
 * - `PROVISIONED`: You requested the change token by calling `GetChangeToken`, but you haven't used it yet
 * in a call to create, update, or delete an AWS WAF object.
 *
 * - `PENDING`: AWS WAF is propagating the create, update, or delete request to all AWS WAF servers.
 *
 * - `INSYNC`: Propagation is complete.
 */
export const getChangeTokenStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetChangeTokenStatusRequest,
    output: GetChangeTokenStatusResponse,
    errors: [WAFInternalErrorException, WAFNonexistentItemException],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the GeoMatchSet that is specified by `GeoMatchSetId`.
 */
export const getGeoMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGeoMatchSetRequest,
  output: GetGeoMatchSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonexistentItemException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the IPSet that is specified by `IPSetId`.
 */
export const getIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIPSetRequest,
  output: GetIPSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonexistentItemException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the LoggingConfiguration for the specified web ACL.
 */
export const getLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLoggingConfigurationRequest,
    output: GetLoggingConfigurationResponse,
    errors: [WAFInternalErrorException, WAFNonexistentItemException],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the IAM policy attached to the RuleGroup.
 */
export const getPermissionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPermissionPolicyRequest,
  output: GetPermissionPolicyResponse,
  errors: [WAFInternalErrorException, WAFNonexistentItemException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of IP addresses currently being blocked by the RateBasedRule that is specified by the `RuleId`. The maximum
 * number of managed keys that will be blocked is 10,000. If more than 10,000 addresses exceed
 * the rate limit, the 10,000 addresses with the highest rates will be blocked.
 */
export const getRateBasedRuleManagedKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRateBasedRuleManagedKeysRequest,
    output: GetRateBasedRuleManagedKeysResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidAccountException,
      WAFInvalidParameterException,
      WAFNonexistentItemException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the RegexMatchSet specified by `RegexMatchSetId`.
 */
export const getRegexMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegexMatchSetRequest,
  output: GetRegexMatchSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonexistentItemException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the RegexPatternSet specified by `RegexPatternSetId`.
 */
export const getRegexPatternSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegexPatternSetRequest,
  output: GetRegexPatternSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonexistentItemException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the Rule that is specified by the `RuleId` that you included in the `GetRule` request.
 */
export const getRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRuleRequest,
  output: GetRuleResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonexistentItemException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the RuleGroup that is specified by the `RuleGroupId` that you included in the `GetRuleGroup` request.
 *
 * To view the rules in a rule group, use ListActivatedRulesInRuleGroup.
 */
export const getRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRuleGroupRequest,
  output: GetRuleGroupResponse,
  errors: [WAFInternalErrorException, WAFNonexistentItemException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the SizeConstraintSet specified by `SizeConstraintSetId`.
 */
export const getSizeConstraintSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSizeConstraintSetRequest,
    output: GetSizeConstraintSetResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidAccountException,
      WAFNonexistentItemException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the SqlInjectionMatchSet that is specified by `SqlInjectionMatchSetId`.
 */
export const getSqlInjectionMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSqlInjectionMatchSetRequest,
    output: GetSqlInjectionMatchSetResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidAccountException,
      WAFNonexistentItemException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the XssMatchSet that is specified by `XssMatchSetId`.
 */
export const getXssMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetXssMatchSetRequest,
  output: GetXssMatchSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonexistentItemException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of ActivatedRule objects.
 */
export const listActivatedRulesInRuleGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListActivatedRulesInRuleGroupRequest,
    output: ListActivatedRulesInRuleGroupResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidParameterException,
      WAFNonexistentItemException,
    ],
  }));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of LoggingConfiguration objects.
 */
export const listLoggingConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListLoggingConfigurationsRequest,
    output: ListLoggingConfigurationsResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidParameterException,
      WAFNonexistentItemException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of RuleSummary objects.
 */
export const listRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRulesRequest,
  output: ListRulesResponse,
  errors: [WAFInternalErrorException, WAFInvalidAccountException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Attaches an IAM policy to the specified resource. The only supported use for this action is to share a RuleGroup across accounts.
 *
 * The `PutPermissionPolicy` is subject to the following restrictions:
 *
 * - You can attach only one policy with each `PutPermissionPolicy` request.
 *
 * - The policy must include an `Effect`, `Action` and `Principal`.
 *
 * - `Effect` must specify `Allow`.
 *
 * - The `Action` in the policy must be `waf:UpdateWebACL`, `waf-regional:UpdateWebACL`, `waf:GetRuleGroup` and `waf-regional:GetRuleGroup` . Any extra or wildcard actions in the policy will be rejected.
 *
 * - The policy cannot include a `Resource` parameter.
 *
 * - The ARN in the request must be a valid WAF RuleGroup ARN and the RuleGroup must exist in the same region.
 *
 * - The user making the request must be the owner of the RuleGroup.
 *
 * - Your policy must be composed using IAM Policy version 2012-10-17.
 *
 * For more information, see IAM Policies.
 *
 * An example of a valid policy parameter is shown in the Examples section below.
 */
export const putPermissionPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPermissionPolicyRequest,
  output: PutPermissionPolicyResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidPermissionPolicyException,
    WAFNonexistentItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    WAFBadRequestException,
    WAFInternalErrorException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates an GeoMatchSet, which you use to specify which web requests you want to allow or block based on the country
 * that the requests originate from. For example, if you're receiving a lot of requests from one or more countries and you want to block the requests, you can create an `GeoMatchSet` that contains those countries and then configure AWS WAF to block the requests.
 *
 * To create and configure a `GeoMatchSet`, perform the following steps:
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `CreateGeoMatchSet` request.
 *
 * - Submit a `CreateGeoMatchSet` request.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateGeoMatchSet request.
 *
 * - Submit an `UpdateGeoMatchSetSet` request to specify the countries that you want AWS WAF to watch for.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const createGeoMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGeoMatchSetRequest,
  output: CreateGeoMatchSetResponse,
  errors: [
    WAFDisallowedNameException,
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates an IPSet, which you use to specify which web requests
 * that
 * you want to allow or block based on the IP addresses that the requests
 * originate from. For example, if you're receiving a lot of requests from one or more
 * individual IP addresses or one or more ranges of IP addresses and you want to block the
 * requests, you can create an `IPSet` that contains those IP addresses and then
 * configure AWS WAF to block the requests.
 *
 * To create and configure an `IPSet`, perform the following steps:
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `CreateIPSet` request.
 *
 * - Submit a `CreateIPSet` request.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateIPSet request.
 *
 * - Submit an `UpdateIPSet` request to specify the IP addresses that you want AWS WAF to watch for.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const createIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIPSetRequest,
  output: CreateIPSetResponse,
  errors: [
    WAFDisallowedNameException,
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates a RateBasedRule. The `RateBasedRule` contains a
 * `RateLimit`, which specifies the maximum number of requests that AWS WAF allows
 * from a specified IP address in a five-minute period.
 * The `RateBasedRule` also
 * contains the `IPSet` objects, `ByteMatchSet` objects, and other
 * predicates that identify the requests that you want to count or block if these requests
 * exceed the `RateLimit`.
 *
 * If you add more than one predicate to a `RateBasedRule`, a request not
 * only must exceed the `RateLimit`, but it also must match all the
 * conditions to be counted or blocked. For example, suppose you add the following to a
 * `RateBasedRule`:
 *
 * - An `IPSet` that matches the IP address `192.0.2.44/32`
 *
 * - A `ByteMatchSet` that matches `BadBot` in the
 * `User-Agent` header
 *
 * Further, you specify a `RateLimit` of 1,000.
 *
 * You then add the `RateBasedRule` to a `WebACL` and specify that
 * you want to block requests that meet the conditions in the rule. For a request to be
 * blocked, it must come from the IP address 192.0.2.44 *and* the
 * `User-Agent` header in the request must contain the value
 * `BadBot`. Further, requests that match these two conditions must be received at
 * a rate of more than 1,000 requests every five minutes. If both conditions are met and the
 * rate is exceeded, AWS WAF blocks the requests. If the rate drops below 1,000 for a
 * five-minute period, AWS WAF no longer blocks the requests.
 *
 * As a second example, suppose you want to limit requests to a particular page on your site. To do this, you could add the following to a
 * `RateBasedRule`:
 *
 * - A `ByteMatchSet` with `FieldToMatch` of `URI`
 *
 * - A `PositionalConstraint` of `STARTS_WITH`
 *
 * - A `TargetString` of `login`
 *
 * Further, you specify a `RateLimit` of 1,000.
 *
 * By adding this `RateBasedRule` to a `WebACL`, you could limit requests to your login page without affecting the rest of your site.
 *
 * To create and configure a `RateBasedRule`, perform the following
 * steps:
 *
 * - Create and update the predicates that you want to include in the rule. For more
 * information, see CreateByteMatchSet, CreateIPSet,
 * and CreateSqlInjectionMatchSet.
 *
 * - Use GetChangeToken to get the change token that you provide
 * in the `ChangeToken` parameter of a `CreateRule`
 * request.
 *
 * - Submit a `CreateRateBasedRule` request.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the
 * `ChangeToken` parameter of an UpdateRule
 * request.
 *
 * - Submit an `UpdateRateBasedRule` request to specify the predicates
 * that you want to include in the rule.
 *
 * - Create and update a `WebACL` that contains the
 * `RateBasedRule`. For more information, see CreateWebACL.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests,
 * see the AWS WAF Developer
 * Guide.
 */
export const createRateBasedRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRateBasedRuleRequest,
  output: CreateRateBasedRuleResponse,
  errors: [
    WAFBadRequestException,
    WAFDisallowedNameException,
    WAFInternalErrorException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFStaleDataException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates a RegexMatchSet. You then use UpdateRegexMatchSet to identify the part of a
 * web request that you want AWS WAF to inspect, such as the values of the `User-Agent` header or the query string.
 * For example, you can create a `RegexMatchSet` that contains a `RegexMatchTuple` that looks for any requests with `User-Agent` headers
 * that match a `RegexPatternSet` with pattern `B[a@]dB[o0]t`. You can then configure AWS WAF to reject those requests.
 *
 * To create and configure a `RegexMatchSet`, perform the following steps:
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `CreateRegexMatchSet` request.
 *
 * - Submit a `CreateRegexMatchSet` request.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * `UpdateRegexMatchSet` request.
 *
 * - Submit an UpdateRegexMatchSet request to specify the part of the request that you want AWS WAF to inspect
 * (for example, the header or the URI) and the value, using a `RegexPatternSet`, that you want AWS WAF to watch for.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const createRegexMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRegexMatchSetRequest,
  output: CreateRegexMatchSetResponse,
  errors: [
    WAFDisallowedNameException,
    WAFInternalErrorException,
    WAFLimitsExceededException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates a `RegexPatternSet`. You then use UpdateRegexPatternSet to specify the regular expression (regex) pattern that you want AWS WAF to search for, such as `B[a@]dB[o0]t`. You can then configure AWS WAF to reject those requests.
 *
 * To create and configure a `RegexPatternSet`, perform the following steps:
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `CreateRegexPatternSet` request.
 *
 * - Submit a `CreateRegexPatternSet` request.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * `UpdateRegexPatternSet` request.
 *
 * - Submit an UpdateRegexPatternSet request to specify the string that you want AWS WAF to watch for.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const createRegexPatternSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRegexPatternSetRequest,
    output: CreateRegexPatternSetResponse,
    errors: [
      WAFDisallowedNameException,
      WAFInternalErrorException,
      WAFLimitsExceededException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates a `Rule`, which contains the `IPSet` objects,
 * `ByteMatchSet` objects, and other predicates that identify the requests that
 * you want to block. If you add more than one predicate to a `Rule`, a request
 * must match all of the specifications to be allowed or blocked. For example, suppose
 * that
 * you add the following to a `Rule`:
 *
 * - An `IPSet` that matches the IP address `192.0.2.44/32`
 *
 * - A `ByteMatchSet` that matches `BadBot` in the `User-Agent` header
 *
 * You then add the `Rule` to a `WebACL` and specify that you want to blocks requests that satisfy the `Rule`.
 * For a request to be blocked, it must come from the IP address 192.0.2.44 *and* the `User-Agent` header in the request
 * must contain the value `BadBot`.
 *
 * To create and configure a `Rule`, perform the following steps:
 *
 * - Create and update the predicates that you want to include in the `Rule`. For more information, see
 * CreateByteMatchSet, CreateIPSet, and CreateSqlInjectionMatchSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `CreateRule` request.
 *
 * - Submit a `CreateRule` request.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateRule request.
 *
 * - Submit an `UpdateRule` request to specify the predicates that you want to include in the `Rule`.
 *
 * - Create and update a `WebACL` that contains the `Rule`. For more information, see CreateWebACL.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const createRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleRequest,
  output: CreateRuleResponse,
  errors: [
    WAFBadRequestException,
    WAFDisallowedNameException,
    WAFInternalErrorException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFStaleDataException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates a `RuleGroup`. A rule group is a collection of predefined rules that you add to a web ACL. You use UpdateRuleGroup to add rules to the rule group.
 *
 * Rule groups are subject to the following limits:
 *
 * - Three rule groups per account. You can request an increase to this limit by contacting customer support.
 *
 * - One rule group per web ACL.
 *
 * - Ten rules per rule group.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const createRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleGroupRequest,
  output: CreateRuleGroupResponse,
  errors: [
    WAFBadRequestException,
    WAFDisallowedNameException,
    WAFInternalErrorException,
    WAFLimitsExceededException,
    WAFStaleDataException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates a `SizeConstraintSet`. You then use UpdateSizeConstraintSet to identify the part of a
 * web request that you want AWS WAF to check for length, such as the length of the `User-Agent` header or the length of the query string.
 * For example, you can create a `SizeConstraintSet` that matches any requests that have a query string that is longer than 100 bytes.
 * You can then configure AWS WAF to reject those requests.
 *
 * To create and configure a `SizeConstraintSet`, perform the following steps:
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `CreateSizeConstraintSet` request.
 *
 * - Submit a `CreateSizeConstraintSet` request.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * `UpdateSizeConstraintSet` request.
 *
 * - Submit an UpdateSizeConstraintSet request to specify the part of the request that you want AWS WAF to inspect
 * (for example, the header or the URI) and the value that you want AWS WAF to watch for.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const createSizeConstraintSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSizeConstraintSetRequest,
    output: CreateSizeConstraintSetResponse,
    errors: [
      WAFDisallowedNameException,
      WAFInternalErrorException,
      WAFInvalidAccountException,
      WAFInvalidParameterException,
      WAFLimitsExceededException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates a SqlInjectionMatchSet, which you use to allow, block, or count requests that contain snippets of SQL code in a
 * specified part of web requests. AWS WAF searches for character sequences that are likely to be malicious strings.
 *
 * To create and configure a `SqlInjectionMatchSet`, perform the following steps:
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `CreateSqlInjectionMatchSet` request.
 *
 * - Submit a `CreateSqlInjectionMatchSet` request.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateSqlInjectionMatchSet request.
 *
 * - Submit an UpdateSqlInjectionMatchSet request to specify the parts of web requests in which you want to
 * allow, block, or count malicious SQL code.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const createSqlInjectionMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSqlInjectionMatchSetRequest,
    output: CreateSqlInjectionMatchSetResponse,
    errors: [
      WAFDisallowedNameException,
      WAFInternalErrorException,
      WAFInvalidAccountException,
      WAFInvalidParameterException,
      WAFLimitsExceededException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates a `WebACL`, which contains the `Rules` that identify the CloudFront web requests that you want to allow, block, or count.
 * AWS WAF evaluates `Rules` in order based on the value of `Priority` for each `Rule`.
 *
 * You also specify a default action, either `ALLOW` or `BLOCK`. If a web request doesn't match
 * any of the `Rules` in a `WebACL`, AWS WAF responds to the request with the default action.
 *
 * To create and configure a `WebACL`, perform the following steps:
 *
 * - Create and update the `ByteMatchSet` objects and other predicates that you want to include in `Rules`.
 * For more information, see CreateByteMatchSet, UpdateByteMatchSet, CreateIPSet, UpdateIPSet,
 * CreateSqlInjectionMatchSet, and UpdateSqlInjectionMatchSet.
 *
 * - Create and update the `Rules` that you want to include in the `WebACL`. For more information, see
 * CreateRule and UpdateRule.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `CreateWebACL` request.
 *
 * - Submit a `CreateWebACL` request.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateWebACL request.
 *
 * - Submit an UpdateWebACL request to specify the `Rules` that you want to include in the `WebACL`,
 * to specify the default action, and to associate the `WebACL` with a CloudFront distribution.
 *
 * For more information about how to use the AWS WAF API, see the AWS WAF Developer Guide.
 */
export const createWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWebACLRequest,
  output: CreateWebACLResponse,
  errors: [
    WAFBadRequestException,
    WAFDisallowedNameException,
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFStaleDataException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * Creates an AWS CloudFormation WAFV2 template for the specified web ACL in the specified Amazon S3 bucket.
 * Then, in CloudFormation, you create a stack from the template, to create the web ACL and its resources in AWS WAFV2.
 * Use this to migrate your AWS WAF Classic web ACL to the latest version of AWS WAF.
 *
 * This is part of a larger migration procedure for web ACLs from AWS WAF Classic to the latest version of AWS WAF.
 * For the full procedure, including caveats and manual steps to complete
 * the migration and switch over to the new web ACL, see
 * Migrating your AWS WAF Classic resources to AWS WAF in the AWS WAF
 * Developer Guide.
 */
export const createWebACLMigrationStack = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWebACLMigrationStackRequest,
    output: CreateWebACLMigrationStackResponse,
    errors: [
      WAFEntityMigrationException,
      WAFInternalErrorException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
      WAFNonexistentItemException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates an XssMatchSet, which you use to allow, block, or count requests that contain cross-site scripting attacks
 * in the specified part of web requests. AWS WAF searches for character sequences that are likely to be malicious strings.
 *
 * To create and configure an `XssMatchSet`, perform the following steps:
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `CreateXssMatchSet` request.
 *
 * - Submit a `CreateXssMatchSet` request.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateXssMatchSet request.
 *
 * - Submit an UpdateXssMatchSet request to specify the parts of web requests in which you want to
 * allow, block, or count cross-site scripting attacks.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const createXssMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateXssMatchSetRequest,
  output: CreateXssMatchSetResponse,
  errors: [
    WAFDisallowedNameException,
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes a ByteMatchSet. You can't delete a `ByteMatchSet` if it's still used in any `Rules`
 * or if it still includes any ByteMatchTuple objects (any filters).
 *
 * If you just want to remove a `ByteMatchSet` from a `Rule`, use UpdateRule.
 *
 * To permanently delete a `ByteMatchSet`, perform the following steps:
 *
 * - Update the `ByteMatchSet` to remove filters, if any. For more information, see UpdateByteMatchSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `DeleteByteMatchSet` request.
 *
 * - Submit a `DeleteByteMatchSet` request.
 */
export const deleteByteMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteByteMatchSetRequest,
  output: DeleteByteMatchSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonEmptyEntityException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes a GeoMatchSet. You can't delete a `GeoMatchSet` if it's still used in any `Rules` or
 * if it still includes any countries.
 *
 * If you just want to remove a `GeoMatchSet` from a `Rule`, use UpdateRule.
 *
 * To permanently delete a `GeoMatchSet` from AWS WAF, perform the following steps:
 *
 * - Update the `GeoMatchSet` to remove any countries. For more information, see UpdateGeoMatchSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `DeleteGeoMatchSet` request.
 *
 * - Submit a `DeleteGeoMatchSet` request.
 */
export const deleteGeoMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGeoMatchSetRequest,
  output: DeleteGeoMatchSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonEmptyEntityException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes an IPSet. You can't delete an `IPSet` if it's still used in any `Rules` or
 * if it still includes any IP addresses.
 *
 * If you just want to remove an `IPSet` from a `Rule`, use UpdateRule.
 *
 * To permanently delete an `IPSet` from AWS WAF, perform the following steps:
 *
 * - Update the `IPSet` to remove IP address ranges, if any. For more information, see UpdateIPSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `DeleteIPSet` request.
 *
 * - Submit a `DeleteIPSet` request.
 */
export const deleteIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIPSetRequest,
  output: DeleteIPSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonEmptyEntityException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes a RateBasedRule. You can't delete a rule if
 * it's still used in any `WebACL` objects or if it still includes any predicates,
 * such as `ByteMatchSet` objects.
 *
 * If you just want to remove a rule from a `WebACL`, use UpdateWebACL.
 *
 * To permanently delete a `RateBasedRule` from AWS WAF, perform the following
 * steps:
 *
 * - Update the `RateBasedRule` to remove predicates, if any. For more
 * information, see UpdateRateBasedRule.
 *
 * - Use GetChangeToken to get the change token that you provide
 * in the `ChangeToken` parameter of a `DeleteRateBasedRule`
 * request.
 *
 * - Submit a `DeleteRateBasedRule` request.
 */
export const deleteRateBasedRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRateBasedRuleRequest,
  output: DeleteRateBasedRuleResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonEmptyEntityException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes a Rule. You can't delete a `Rule` if it's still used in any `WebACL`
 * objects or if it still includes any predicates, such as `ByteMatchSet` objects.
 *
 * If you just want to remove a `Rule` from a `WebACL`, use UpdateWebACL.
 *
 * To permanently delete a `Rule` from AWS WAF, perform the following steps:
 *
 * - Update the `Rule` to remove predicates, if any. For more information, see UpdateRule.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `DeleteRule` request.
 *
 * - Submit a `DeleteRule` request.
 */
export const deleteRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonEmptyEntityException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Permanently deletes a RuleGroup. You can't delete a `RuleGroup` if it's still used in any `WebACL`
 * objects or if it still includes any rules.
 *
 * If you just want to remove a `RuleGroup` from a `WebACL`, use UpdateWebACL.
 *
 * To permanently delete a `RuleGroup` from AWS WAF, perform the following steps:
 *
 * - Update the `RuleGroup` to remove rules, if any. For more information, see UpdateRuleGroup.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `DeleteRuleGroup` request.
 *
 * - Submit a `DeleteRuleGroup` request.
 */
export const deleteRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleGroupRequest,
  output: DeleteRuleGroupResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFNonEmptyEntityException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the RateBasedRule that is specified by the
 * `RuleId` that you included in the `GetRateBasedRule`
 * request.
 */
export const getRateBasedRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRateBasedRuleRequest,
  output: GetRateBasedRuleResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonexistentItemException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns the WebACL that is specified by `WebACLId`.
 */
export const getWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWebACLRequest,
  output: GetWebACLResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFNonexistentItemException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of ByteMatchSetSummary objects.
 */
export const listByteMatchSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListByteMatchSetsRequest,
  output: ListByteMatchSetsResponse,
  errors: [WAFInternalErrorException, WAFInvalidAccountException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of GeoMatchSetSummary objects in the response.
 */
export const listGeoMatchSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGeoMatchSetsRequest,
  output: ListGeoMatchSetsResponse,
  errors: [WAFInternalErrorException, WAFInvalidAccountException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of IPSetSummary objects in the response.
 */
export const listIPSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListIPSetsRequest,
  output: ListIPSetsResponse,
  errors: [WAFInternalErrorException, WAFInvalidAccountException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of RuleSummary objects.
 */
export const listRateBasedRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRateBasedRulesRequest,
  output: ListRateBasedRulesResponse,
  errors: [WAFInternalErrorException, WAFInvalidAccountException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of RegexMatchSetSummary objects.
 */
export const listRegexMatchSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRegexMatchSetsRequest,
  output: ListRegexMatchSetsResponse,
  errors: [WAFInternalErrorException, WAFInvalidAccountException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of RegexPatternSetSummary objects.
 */
export const listRegexPatternSets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRegexPatternSetsRequest,
    output: ListRegexPatternSetsResponse,
    errors: [WAFInternalErrorException, WAFInvalidAccountException],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of RuleGroup objects.
 */
export const listRuleGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRuleGroupsRequest,
  output: ListRuleGroupsResponse,
  errors: [WAFInternalErrorException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of SizeConstraintSetSummary objects.
 */
export const listSizeConstraintSets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSizeConstraintSetsRequest,
    output: ListSizeConstraintSetsResponse,
    errors: [WAFInternalErrorException, WAFInvalidAccountException],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of SqlInjectionMatchSet objects.
 */
export const listSqlInjectionMatchSets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSqlInjectionMatchSetsRequest,
    output: ListSqlInjectionMatchSetsResponse,
    errors: [WAFInternalErrorException, WAFInvalidAccountException],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of RuleGroup objects that you are subscribed to.
 */
export const listSubscribedRuleGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSubscribedRuleGroupsRequest,
    output: ListSubscribedRuleGroupsResponse,
    errors: [WAFInternalErrorException, WAFNonexistentItemException],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Retrieves the tags associated with the specified AWS resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each AWS resource, up to 50 tags for a resource.
 *
 * Tagging is only available through the API, SDKs, and CLI. You can't manage or view tags through the AWS WAF Classic console. You can tag the AWS resources that you manage through AWS WAF Classic: web ACLs, rule groups, and rules.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    WAFBadRequestException,
    WAFInternalErrorException,
    WAFInvalidParameterException,
    WAFNonexistentItemException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of WebACLSummary objects in the response.
 */
export const listWebACLs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWebACLsRequest,
  output: ListWebACLsResponse,
  errors: [WAFInternalErrorException, WAFInvalidAccountException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Returns an array of XssMatchSet objects.
 */
export const listXssMatchSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListXssMatchSetsRequest,
  output: ListXssMatchSetsResponse,
  errors: [WAFInternalErrorException, WAFInvalidAccountException],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Associates tags with the specified AWS resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each AWS resource, up to 50 tags for a resource.
 *
 * Tagging is only available through the API, SDKs, and CLI. You can't manage or view tags through the AWS WAF Classic console. You can use this action to tag the AWS resources that you manage through AWS WAF Classic: web ACLs, rule groups, and rules.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    WAFBadRequestException,
    WAFInternalErrorException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentItemException,
    WAFTagOperationException,
    WAFTagOperationInternalErrorException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes Predicate objects in a `Rule`. Each
 * `Predicate` object identifies a predicate, such as a ByteMatchSet or an IPSet, that specifies the web requests
 * that you want to allow, block, or count. If you add more than one predicate to a
 * `Rule`, a request must match all of the specifications to be allowed,
 * blocked, or counted. For example, suppose
 * that
 * you add the following to a `Rule`:
 *
 * - A `ByteMatchSet` that matches the value `BadBot` in the `User-Agent` header
 *
 * - An `IPSet` that matches the IP address `192.0.2.44`
 *
 * You then add the `Rule` to a `WebACL` and specify that you want to block requests that satisfy the `Rule`.
 * For a request to be blocked, the `User-Agent` header in the request must contain the value `BadBot`
 * *and* the request must originate from the IP address 192.0.2.44.
 *
 * To create and configure a `Rule`, perform the following steps:
 *
 * - Create and update the predicates that you want to include in the `Rule`.
 *
 * - Create the `Rule`. See CreateRule.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateRule request.
 *
 * - Submit an `UpdateRule` request to add predicates to the `Rule`.
 *
 * - Create and update a `WebACL` that contains the `Rule`. See CreateWebACL.
 *
 * If you want to replace one `ByteMatchSet` or `IPSet` with another, you delete the existing one and
 * add the new one.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const updateRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleRequest,
  output: UpdateRuleResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentContainerException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Creates a `ByteMatchSet`. You then use UpdateByteMatchSet to identify the part of a
 * web request that you want AWS WAF to inspect, such as the values of the `User-Agent` header or the query string.
 * For example, you can create a `ByteMatchSet` that matches any requests with `User-Agent` headers
 * that contain the string `BadBot`. You can then configure AWS WAF to reject those requests.
 *
 * To create and configure a `ByteMatchSet`, perform the following steps:
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of a
 * `CreateByteMatchSet` request.
 *
 * - Submit a `CreateByteMatchSet` request.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * `UpdateByteMatchSet` request.
 *
 * - Submit an UpdateByteMatchSet request to specify the part of the request that you want AWS WAF to inspect
 * (for example, the header or the URI) and the value that you want AWS WAF to watch for.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const createByteMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateByteMatchSetRequest,
  output: CreateByteMatchSetResponse,
  errors: [
    WAFDisallowedNameException,
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes ByteMatchTuple objects (filters) in a ByteMatchSet. For each `ByteMatchTuple` object,
 * you specify the following values:
 *
 * - Whether to insert or delete the object from the array. If you want to change a `ByteMatchSetUpdate` object,
 * you delete the existing object and add a new one.
 *
 * - The part of a web request that you want AWS WAF to inspect, such as a query string or the value of the `User-Agent` header.
 *
 * - The bytes (typically a string that corresponds with ASCII characters) that you want AWS WAF to look for. For more information, including how you specify
 * the values for the AWS WAF API and the AWS CLI or SDKs, see `TargetString` in the ByteMatchTuple data type.
 *
 * - Where to look, such as at the beginning or the end of a query string.
 *
 * - Whether to perform any conversions on the request, such as converting it to lowercase, before inspecting it for the specified string.
 *
 * For example, you can add a `ByteMatchSetUpdate` object that matches web requests in which `User-Agent` headers contain
 * the string `BadBot`. You can then configure AWS WAF to block those requests.
 *
 * To create and configure a `ByteMatchSet`, perform the following steps:
 *
 * - Create a `ByteMatchSet.` For more information, see CreateByteMatchSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of an
 * `UpdateByteMatchSet` request.
 *
 * - Submit an `UpdateByteMatchSet` request to specify the part of the request that you want AWS WAF to inspect
 * (for example, the header or the URI) and the value that you want AWS WAF to watch for.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const updateByteMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateByteMatchSetRequest,
  output: UpdateByteMatchSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentContainerException,
    WAFNonexistentItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes GeoMatchConstraint objects in an `GeoMatchSet`. For each `GeoMatchConstraint` object,
 * you specify the following values:
 *
 * - Whether to insert or delete the object from the array. If you want to change an `GeoMatchConstraint` object, you delete the existing object and add a new one.
 *
 * - The `Type`. The only valid value for `Type` is `Country`.
 *
 * - The `Value`, which is a two character code for the country to add to the `GeoMatchConstraint` object. Valid codes are listed in GeoMatchConstraint$Value.
 *
 * To create and configure an `GeoMatchSet`, perform the following steps:
 *
 * - Submit a CreateGeoMatchSet request.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateGeoMatchSet request.
 *
 * - Submit an `UpdateGeoMatchSet` request to specify the country that you want AWS WAF to watch for.
 *
 * When you update an `GeoMatchSet`, you specify the country that you want to add and/or the country that you want to delete.
 * If you want to change a country, you delete the existing country and add the new one.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const updateGeoMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGeoMatchSetRequest,
  output: UpdateGeoMatchSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentContainerException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes IPSetDescriptor objects in an
 * `IPSet`. For each `IPSetDescriptor` object, you specify the following
 * values:
 *
 * - Whether to insert or delete the object from the array. If you want to change an
 * `IPSetDescriptor` object, you delete the existing object and add a new
 * one.
 *
 * - The IP address version, `IPv4` or `IPv6`.
 *
 * - The IP address in CIDR notation, for example, `192.0.2.0/24` (for
 * the range of IP addresses from `192.0.2.0` to `192.0.2.255`) or
 * `192.0.2.44/32` (for the individual IP address
 * `192.0.2.44`).
 *
 * AWS WAF supports IPv4 address ranges: /8 and any range between /16 through /32. AWS
 * WAF supports IPv6 address ranges: /24, /32, /48, /56, /64, and /128. For more
 * information about CIDR notation, see the Wikipedia entry Classless
 * Inter-Domain Routing.
 *
 * IPv6 addresses can be represented using any of the following formats:
 *
 * - 1111:0000:0000:0000:0000:0000:0000:0111/128
 *
 * - 1111:0:0:0:0:0:0:0111/128
 *
 * - 1111::0111/128
 *
 * - 1111::111/128
 *
 * You use an `IPSet` to specify which web requests you want to allow or
 * block based on the IP addresses that the requests originated from. For example, if you're
 * receiving a lot of requests from one or a small number of IP addresses and you want to
 * block the requests, you can create an `IPSet` that specifies those IP addresses,
 * and then configure AWS WAF to block the requests.
 *
 * To create and configure an `IPSet`, perform the following steps:
 *
 * - Submit a CreateIPSet request.
 *
 * - Use GetChangeToken to get the change token that you provide
 * in the `ChangeToken` parameter of an UpdateIPSet
 * request.
 *
 * - Submit an `UpdateIPSet` request to specify the IP addresses that you
 * want AWS WAF to watch for.
 *
 * When you update an `IPSet`, you specify the IP addresses that you want to
 * add and/or the IP addresses that you want to delete. If you want to change an IP address,
 * you delete the existing IP address and add the new one.
 *
 * You can insert a maximum of 1000 addresses in a single
 * request.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP
 * requests, see the AWS WAF
 * Developer Guide.
 */
export const updateIPSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateIPSetRequest,
  output: UpdateIPSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentContainerException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes Predicate objects in a rule and updates the
 * `RateLimit` in the rule.
 *
 * Each `Predicate` object identifies a predicate, such as a ByteMatchSet or an IPSet, that specifies the web requests
 * that you want to block or count. The `RateLimit` specifies the number of
 * requests every five minutes that triggers the rule.
 *
 * If you add more than one predicate to a `RateBasedRule`, a request must
 * match all the predicates and exceed the `RateLimit` to be counted or blocked.
 * For example, suppose you add the following to a `RateBasedRule`:
 *
 * - An `IPSet` that matches the IP address `192.0.2.44/32`
 *
 * - A `ByteMatchSet` that matches `BadBot` in the
 * `User-Agent` header
 *
 * Further, you specify a
 * `RateLimit` of 1,000.
 *
 * You then add the `RateBasedRule` to a `WebACL` and specify that
 * you want to block requests that satisfy the rule. For a request to be blocked, it must come
 * from the IP address 192.0.2.44 *and* the `User-Agent` header
 * in the request must contain the value `BadBot`. Further, requests that match
 * these two conditions much be received at a rate of more than 1,000 every five minutes. If
 * the rate drops below this limit, AWS WAF no longer blocks the requests.
 *
 * As a second example, suppose you want to limit requests to a particular page on your site. To do this, you could add the following to a
 * `RateBasedRule`:
 *
 * - A `ByteMatchSet` with `FieldToMatch` of `URI`
 *
 * - A `PositionalConstraint` of `STARTS_WITH`
 *
 * - A `TargetString` of `login`
 *
 * Further, you specify a `RateLimit` of 1,000.
 *
 * By adding this `RateBasedRule` to a `WebACL`, you could limit requests to your login page without affecting the rest of your site.
 */
export const updateRateBasedRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRateBasedRuleRequest,
  output: UpdateRateBasedRuleResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentContainerException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes RegexMatchTuple objects (filters) in a RegexMatchSet. For each `RegexMatchSetUpdate` object,
 * you specify the following values:
 *
 * - Whether to insert or delete the object from the array. If you want to change a `RegexMatchSetUpdate` object,
 * you delete the existing object and add a new one.
 *
 * - The part of a web request that you want AWS WAF to inspectupdate, such as a query string or the value of the `User-Agent` header.
 *
 * - The identifier of the pattern (a regular expression) that you want AWS WAF to look for. For more information, see RegexPatternSet.
 *
 * - Whether to perform any conversions on the request, such as converting it to lowercase, before inspecting it for the specified string.
 *
 * For example, you can create a `RegexPatternSet` that matches any requests with `User-Agent` headers
 * that contain the string `B[a@]dB[o0]t`. You can then configure AWS WAF to reject those requests.
 *
 * To create and configure a `RegexMatchSet`, perform the following steps:
 *
 * - Create a `RegexMatchSet.` For more information, see CreateRegexMatchSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of an
 * `UpdateRegexMatchSet` request.
 *
 * - Submit an `UpdateRegexMatchSet` request to specify the part of the request that you want AWS WAF to inspect
 * (for example, the header or the URI) and the identifier of the `RegexPatternSet` that contain the regular expression patters you want AWS WAF to watch for.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const updateRegexMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRegexMatchSetRequest,
  output: UpdateRegexMatchSetResponse,
  errors: [
    WAFDisallowedNameException,
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidOperationException,
    WAFLimitsExceededException,
    WAFNonexistentContainerException,
    WAFNonexistentItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes `RegexPatternString` objects in a RegexPatternSet. For each `RegexPatternString` object,
 * you specify the following values:
 *
 * - Whether to insert or delete the `RegexPatternString`.
 *
 * - The regular expression pattern that you want to insert or delete. For more information, see RegexPatternSet.
 *
 * For example, you can create a `RegexPatternString` such as `B[a@]dB[o0]t`. AWS WAF will match this `RegexPatternString` to:
 *
 * - BadBot
 *
 * - BadB0t
 *
 * - B@dBot
 *
 * - B@dB0t
 *
 * To create and configure a `RegexPatternSet`, perform the following steps:
 *
 * - Create a `RegexPatternSet.` For more information, see CreateRegexPatternSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of an
 * `UpdateRegexPatternSet` request.
 *
 * - Submit an `UpdateRegexPatternSet` request to specify the regular expression pattern that you want AWS WAF to watch for.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const updateRegexPatternSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRegexPatternSetRequest,
    output: UpdateRegexPatternSetResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidAccountException,
      WAFInvalidOperationException,
      WAFInvalidRegexPatternException,
      WAFLimitsExceededException,
      WAFNonexistentContainerException,
      WAFNonexistentItemException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes SizeConstraint objects (filters) in a SizeConstraintSet. For each `SizeConstraint` object,
 * you specify the following values:
 *
 * - Whether to insert or delete the object from the array. If you want to change a `SizeConstraintSetUpdate` object,
 * you delete the existing object and add a new one.
 *
 * - The part of a web request that you want AWS WAF to evaluate, such as the length of a query string or the length of the
 * `User-Agent` header.
 *
 * - Whether to perform any transformations on the request, such as converting it to lowercase, before checking its length.
 * Note that transformations of the request body are not supported because the AWS resource forwards only the first `8192` bytes
 * of your request to AWS WAF.
 *
 * You can only specify a single type of TextTransformation.
 *
 * - A `ComparisonOperator` used for evaluating the selected part of the request against the specified `Size`, such as
 * equals, greater than, less than, and so on.
 *
 * - The length, in bytes, that you want AWS WAF to watch for in selected part of the request. The length is computed after applying the transformation.
 *
 * For example, you can add a `SizeConstraintSetUpdate` object that matches web requests in which the length of the
 * `User-Agent` header is greater than 100 bytes. You can then configure AWS WAF to block those requests.
 *
 * To create and configure a `SizeConstraintSet`, perform the following steps:
 *
 * - Create a `SizeConstraintSet.` For more information, see CreateSizeConstraintSet.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of an
 * `UpdateSizeConstraintSet` request.
 *
 * - Submit an `UpdateSizeConstraintSet` request to specify the part of the request that you want AWS WAF to inspect
 * (for example, the header or the URI) and the value that you want AWS WAF to watch for.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const updateSizeConstraintSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSizeConstraintSetRequest,
    output: UpdateSizeConstraintSetResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidAccountException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
      WAFLimitsExceededException,
      WAFNonexistentContainerException,
      WAFNonexistentItemException,
      WAFReferencedItemException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes SqlInjectionMatchTuple objects (filters) in a SqlInjectionMatchSet.
 * For each `SqlInjectionMatchTuple` object, you specify the following values:
 *
 * - `Action`: Whether to insert the object into or delete the object from the array. To change a
 * `SqlInjectionMatchTuple`, you delete the existing object and add a new one.
 *
 * - `FieldToMatch`: The part of web requests that you want AWS WAF to inspect and, if you want AWS WAF to inspect a header or custom query parameter,
 * the name of the header or parameter.
 *
 * - `TextTransformation`: Which text transformation, if any, to perform on the web request before
 * inspecting the request for snippets of malicious SQL code.
 *
 * You can only specify a single type of TextTransformation.
 *
 * You use `SqlInjectionMatchSet` objects to specify which CloudFront
 * requests that
 * you want to allow, block, or count. For example, if you're receiving
 * requests that contain snippets of SQL code in the query string and you want to block the
 * requests, you can create a `SqlInjectionMatchSet` with the applicable settings,
 * and then configure AWS WAF to block the requests.
 *
 * To create and configure a `SqlInjectionMatchSet`, perform the following steps:
 *
 * - Submit a CreateSqlInjectionMatchSet request.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateIPSet request.
 *
 * - Submit an `UpdateSqlInjectionMatchSet` request to specify the parts of web requests that you want AWS WAF to
 * inspect for snippets of SQL code.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const updateSqlInjectionMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSqlInjectionMatchSetRequest,
    output: UpdateSqlInjectionMatchSetResponse,
    errors: [
      WAFInternalErrorException,
      WAFInvalidAccountException,
      WAFInvalidOperationException,
      WAFInvalidParameterException,
      WAFLimitsExceededException,
      WAFNonexistentContainerException,
      WAFNonexistentItemException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes ActivatedRule objects in a `WebACL`. Each `Rule` identifies
 * web requests that you want to allow, block, or count. When you update a `WebACL`, you specify the following values:
 *
 * - A default action for the `WebACL`, either `ALLOW` or `BLOCK`.
 * AWS WAF performs the default action if a request doesn't match the criteria in any of the `Rules` in a `WebACL`.
 *
 * - The `Rules` that you want to add
 * or
 * delete. If you want to replace one `Rule` with another, you delete the
 * existing `Rule` and add the new one.
 *
 * - For each `Rule`, whether you want AWS WAF to allow requests, block requests, or count requests that match
 * the conditions in the `Rule`.
 *
 * - The order in which you want AWS WAF to evaluate the `Rules` in a
 * `WebACL`. If you add more than one `Rule` to a
 * `WebACL`, AWS WAF evaluates each request against the `Rules`
 * in order based on the value of `Priority`. (The `Rule` that has
 * the lowest value for `Priority` is evaluated first.) When a web request
 * matches all
 * the
 * predicates (such as `ByteMatchSets` and `IPSets`) in a
 * `Rule`, AWS WAF immediately takes the corresponding action, allow or
 * block, and doesn't evaluate the request against the remaining `Rules` in
 * the `WebACL`, if any.
 *
 * To create and configure a `WebACL`, perform the following steps:
 *
 * - Create and update the predicates that you want to include in `Rules`.
 * For more information, see CreateByteMatchSet, UpdateByteMatchSet, CreateIPSet, UpdateIPSet,
 * CreateSqlInjectionMatchSet, and UpdateSqlInjectionMatchSet.
 *
 * - Create and update the `Rules` that you want to include in the `WebACL`. For more information, see
 * CreateRule and UpdateRule.
 *
 * - Create a `WebACL`. See CreateWebACL.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateWebACL request.
 *
 * - Submit an `UpdateWebACL` request to specify the `Rules`
 * that you want to include in the `WebACL`, to specify the default action,
 * and to associate the `WebACL` with a CloudFront distribution.
 *
 * The `ActivatedRule` can be a rule group. If you specify a rule group
 * as your
 * `ActivatedRule`
 * ,
 * you can exclude specific rules from that rule group.
 *
 * If you already have a rule group associated with a web ACL and want to submit
 * an `UpdateWebACL` request to exclude certain rules from that rule group,
 * you must first remove the rule group from the web ACL, the re-insert it again,
 * specifying the excluded rules.
 * For details,
 * see
 * ActivatedRule$ExcludedRules
 * .
 *
 * Be aware that if you try to add a RATE_BASED rule to a web ACL without setting the rule type when first creating the rule, the UpdateWebACL request will fail because the request tries to add a REGULAR rule (the default rule type) with the specified ID, which does not exist.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the AWS WAF Developer Guide.
 */
export const updateWebACL = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWebACLRequest,
  output: UpdateWebACLResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentContainerException,
    WAFNonexistentItemException,
    WAFReferencedItemException,
    WAFStaleDataException,
    WAFSubscriptionNotFoundException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes XssMatchTuple objects (filters) in an XssMatchSet.
 * For each `XssMatchTuple` object, you specify the following values:
 *
 * - `Action`: Whether to insert the object into or delete the object from the
 * array. To change an
 * `XssMatchTuple`, you delete the existing object and add a new
 * one.
 *
 * - `FieldToMatch`: The part of web requests that you want AWS WAF to inspect and, if you want AWS WAF to inspect a header or custom query parameter,
 * the name of the header or parameter.
 *
 * - `TextTransformation`: Which text transformation, if any, to perform on the web request before
 * inspecting the request for cross-site scripting attacks.
 *
 * You can only specify a single type of TextTransformation.
 *
 * You use `XssMatchSet` objects to specify which CloudFront requests
 * that
 * you want to allow, block, or count. For example, if you're receiving
 * requests that contain cross-site scripting attacks in the request body and you want to
 * block the requests, you can create an `XssMatchSet` with the applicable
 * settings, and then configure AWS WAF to block the requests.
 *
 * To create and configure an `XssMatchSet`, perform the following steps:
 *
 * - Submit a CreateXssMatchSet request.
 *
 * - Use GetChangeToken to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateIPSet request.
 *
 * - Submit an `UpdateXssMatchSet` request to specify the parts of web requests that you want AWS WAF to
 * inspect for cross-site scripting attacks.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const updateXssMatchSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateXssMatchSetRequest,
  output: UpdateXssMatchSetResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidAccountException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentContainerException,
    WAFNonexistentItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Associates a LoggingConfiguration with a specified web ACL.
 *
 * You can access information about all traffic that AWS WAF inspects using the following
 * steps:
 *
 * - Create an Amazon Kinesis Data
 * Firehose.
 *
 * Create the data firehose with a PUT source and in the region that you are operating. However, if you are capturing logs for Amazon CloudFront, always create the firehose in US East (N. Virginia).
 *
 * Do not create the data firehose using a `Kinesis stream` as your source.
 *
 * - Associate that firehose to your web ACL using a `PutLoggingConfiguration` request.
 *
 * When you successfully enable logging using a `PutLoggingConfiguration` request, AWS WAF will create a service linked role with the necessary permissions to write logs to the Amazon Kinesis Data Firehose. For more information, see Logging Web ACL Traffic Information in the *AWS WAF Developer Guide*.
 */
export const putLoggingConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutLoggingConfigurationRequest,
    output: PutLoggingConfigurationResponse,
    errors: [
      WAFInternalErrorException,
      WAFNonexistentItemException,
      WAFServiceLinkedRoleErrorException,
      WAFStaleDataException,
    ],
  }),
);
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Inserts or deletes ActivatedRule objects in a `RuleGroup`.
 *
 * You can only insert `REGULAR` rules into a rule group.
 *
 * You can have a maximum of ten rules per rule group.
 *
 * To create and configure a `RuleGroup`, perform the following steps:
 *
 * - Create and update the `Rules` that you want to include in the `RuleGroup`. See CreateRule.
 *
 * - Use `GetChangeToken` to get the change token that you provide in the `ChangeToken` parameter of an
 * UpdateRuleGroup request.
 *
 * - Submit an `UpdateRuleGroup` request to add `Rules` to the `RuleGroup`.
 *
 * - Create and update a `WebACL` that contains the `RuleGroup`. See CreateWebACL.
 *
 * If you want to replace one `Rule` with another, you delete the existing one and
 * add the new one.
 *
 * For more information about how to use the AWS WAF API to allow or block HTTP requests, see the
 * AWS WAF Developer Guide.
 */
export const updateRuleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleGroupRequest,
  output: UpdateRuleGroupResponse,
  errors: [
    WAFInternalErrorException,
    WAFInvalidOperationException,
    WAFInvalidParameterException,
    WAFLimitsExceededException,
    WAFNonexistentContainerException,
    WAFNonexistentItemException,
    WAFStaleDataException,
  ],
}));
/**
 * This is **AWS WAF Classic** documentation. For
 * more information, see AWS
 * WAF Classic in the developer guide.
 *
 * For the latest version of AWS
 * WAF, use the AWS WAFV2 API and see the AWS WAF Developer Guide. With the latest version, AWS WAF has a single set of endpoints for regional and global use.
 *
 * Gets detailed information about a specified number of requests--a sample--that AWS WAF randomly selects from among the first 5,000 requests that your AWS resource received during a time range that you choose. You can specify a sample size of up to 500 requests, and you can specify any time range in the previous three hours.
 *
 * `GetSampledRequests` returns a time range, which is usually the time range that you specified. However, if your resource
 * (such as a CloudFront distribution) received 5,000 requests before the specified time range elapsed, `GetSampledRequests`
 * returns an updated time range. This new time range indicates the actual period during which AWS WAF selected the requests in the sample.
 */
export const getSampledRequests = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSampledRequestsRequest,
  output: GetSampledRequestsResponse,
  errors: [WAFInternalErrorException, WAFNonexistentItemException],
}));

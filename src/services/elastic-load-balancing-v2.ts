import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace(
  "http://elasticloadbalancing.amazonaws.com/doc/2015-12-01/",
);
const svc = T.AwsApiService({
  sdkId: "Elastic Load Balancing v2",
  serviceShapeName: "ElasticLoadBalancing_v10",
});
const auth = T.AwsAuthSigv4({ name: "elasticloadbalancing" });
const ver = T.ServiceVersion("2015-12-01");
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
                        url: "https://elasticloadbalancing-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://elasticloadbalancing.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://elasticloadbalancing-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://elasticloadbalancing.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://elasticloadbalancing.{Region}.{PartitionResult#dnsSuffix}",
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
export const ResourceArns = S.Array(S.String);
export const AlpnPolicyName = S.Array(S.String);
export const Subnets = S.Array(S.String);
export const SecurityGroups = S.Array(S.String);
export const ListenerArns = S.Array(S.String);
export const LoadBalancerArns = S.Array(S.String);
export const LoadBalancerNames = S.Array(S.String);
export const RuleArns = S.Array(S.String);
export const SslPolicyNames = S.Array(S.String);
export const TargetGroupArns = S.Array(S.String);
export const TargetGroupNames = S.Array(S.String);
export const ListOfDescribeTargetHealthIncludeOptions = S.Array(S.String);
export const RevocationIds = S.Array(S.Number);
export const TrustStoreArns = S.Array(S.String);
export const TrustStoreNames = S.Array(S.String);
export const RemoveIpamPools = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class CreateTrustStoreInput extends S.Class<CreateTrustStoreInput>(
  "CreateTrustStoreInput",
)(
  {
    Name: S.String,
    CaCertificatesBundleS3Bucket: S.String,
    CaCertificatesBundleS3Key: S.String,
    CaCertificatesBundleS3ObjectVersion: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteListenerInput extends S.Class<DeleteListenerInput>(
  "DeleteListenerInput",
)(
  { ListenerArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteListenerOutput extends S.Class<DeleteListenerOutput>(
  "DeleteListenerOutput",
)({}, ns) {}
export class DeleteLoadBalancerInput extends S.Class<DeleteLoadBalancerInput>(
  "DeleteLoadBalancerInput",
)(
  { LoadBalancerArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLoadBalancerOutput extends S.Class<DeleteLoadBalancerOutput>(
  "DeleteLoadBalancerOutput",
)({}, ns) {}
export class DeleteRuleInput extends S.Class<DeleteRuleInput>(
  "DeleteRuleInput",
)(
  { RuleArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRuleOutput extends S.Class<DeleteRuleOutput>(
  "DeleteRuleOutput",
)({}, ns) {}
export class DeleteSharedTrustStoreAssociationInput extends S.Class<DeleteSharedTrustStoreAssociationInput>(
  "DeleteSharedTrustStoreAssociationInput",
)(
  { TrustStoreArn: S.String, ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSharedTrustStoreAssociationOutput extends S.Class<DeleteSharedTrustStoreAssociationOutput>(
  "DeleteSharedTrustStoreAssociationOutput",
)({}, ns) {}
export class DeleteTargetGroupInput extends S.Class<DeleteTargetGroupInput>(
  "DeleteTargetGroupInput",
)(
  { TargetGroupArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTargetGroupOutput extends S.Class<DeleteTargetGroupOutput>(
  "DeleteTargetGroupOutput",
)({}, ns) {}
export class DeleteTrustStoreInput extends S.Class<DeleteTrustStoreInput>(
  "DeleteTrustStoreInput",
)(
  { TrustStoreArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTrustStoreOutput extends S.Class<DeleteTrustStoreOutput>(
  "DeleteTrustStoreOutput",
)({}, ns) {}
export class DescribeAccountLimitsInput extends S.Class<DescribeAccountLimitsInput>(
  "DescribeAccountLimitsInput",
)(
  { Marker: S.optional(S.String), PageSize: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCapacityReservationInput extends S.Class<DescribeCapacityReservationInput>(
  "DescribeCapacityReservationInput",
)(
  { LoadBalancerArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeListenerAttributesInput extends S.Class<DescribeListenerAttributesInput>(
  "DescribeListenerAttributesInput",
)(
  { ListenerArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeListenerCertificatesInput extends S.Class<DescribeListenerCertificatesInput>(
  "DescribeListenerCertificatesInput",
)(
  {
    ListenerArn: S.String,
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeListenersInput extends S.Class<DescribeListenersInput>(
  "DescribeListenersInput",
)(
  {
    LoadBalancerArn: S.optional(S.String),
    ListenerArns: S.optional(ListenerArns),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLoadBalancerAttributesInput extends S.Class<DescribeLoadBalancerAttributesInput>(
  "DescribeLoadBalancerAttributesInput",
)(
  { LoadBalancerArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLoadBalancersInput extends S.Class<DescribeLoadBalancersInput>(
  "DescribeLoadBalancersInput",
)(
  {
    LoadBalancerArns: S.optional(LoadBalancerArns),
    Names: S.optional(LoadBalancerNames),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRulesInput extends S.Class<DescribeRulesInput>(
  "DescribeRulesInput",
)(
  {
    ListenerArn: S.optional(S.String),
    RuleArns: S.optional(RuleArns),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSSLPoliciesInput extends S.Class<DescribeSSLPoliciesInput>(
  "DescribeSSLPoliciesInput",
)(
  {
    Names: S.optional(SslPolicyNames),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
    LoadBalancerType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTagsInput extends S.Class<DescribeTagsInput>(
  "DescribeTagsInput",
)(
  { ResourceArns: ResourceArns },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTargetGroupAttributesInput extends S.Class<DescribeTargetGroupAttributesInput>(
  "DescribeTargetGroupAttributesInput",
)(
  { TargetGroupArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTargetGroupsInput extends S.Class<DescribeTargetGroupsInput>(
  "DescribeTargetGroupsInput",
)(
  {
    LoadBalancerArn: S.optional(S.String),
    TargetGroupArns: S.optional(TargetGroupArns),
    Names: S.optional(TargetGroupNames),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TargetDescription extends S.Class<TargetDescription>(
  "TargetDescription",
)({
  Id: S.String,
  Port: S.optional(S.Number),
  AvailabilityZone: S.optional(S.String),
  QuicServerId: S.optional(S.String),
}) {}
export const TargetDescriptions = S.Array(TargetDescription);
export class DescribeTargetHealthInput extends S.Class<DescribeTargetHealthInput>(
  "DescribeTargetHealthInput",
)(
  {
    TargetGroupArn: S.String,
    Targets: S.optional(TargetDescriptions),
    Include: S.optional(ListOfDescribeTargetHealthIncludeOptions),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTrustStoreAssociationsInput extends S.Class<DescribeTrustStoreAssociationsInput>(
  "DescribeTrustStoreAssociationsInput",
)(
  {
    TrustStoreArn: S.String,
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTrustStoreRevocationsInput extends S.Class<DescribeTrustStoreRevocationsInput>(
  "DescribeTrustStoreRevocationsInput",
)(
  {
    TrustStoreArn: S.String,
    RevocationIds: S.optional(RevocationIds),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTrustStoresInput extends S.Class<DescribeTrustStoresInput>(
  "DescribeTrustStoresInput",
)(
  {
    TrustStoreArns: S.optional(TrustStoreArns),
    Names: S.optional(TrustStoreNames),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyInput extends S.Class<GetResourcePolicyInput>(
  "GetResourcePolicyInput",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTrustStoreCaCertificatesBundleInput extends S.Class<GetTrustStoreCaCertificatesBundleInput>(
  "GetTrustStoreCaCertificatesBundleInput",
)(
  { TrustStoreArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTrustStoreRevocationContentInput extends S.Class<GetTrustStoreRevocationContentInput>(
  "GetTrustStoreRevocationContentInput",
)(
  { TrustStoreArn: S.String, RevocationId: S.Number },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IpamPools extends S.Class<IpamPools>("IpamPools")({
  Ipv4IpamPoolId: S.optional(S.String),
}) {}
export class ModifyIpPoolsInput extends S.Class<ModifyIpPoolsInput>(
  "ModifyIpPoolsInput",
)(
  {
    LoadBalancerArn: S.String,
    IpamPools: S.optional(IpamPools),
    RemoveIpamPools: S.optional(RemoveIpamPools),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Certificate extends S.Class<Certificate>("Certificate")({
  CertificateArn: S.optional(S.String),
  IsDefault: S.optional(S.Boolean),
}) {}
export const CertificateList = S.Array(Certificate);
export const AuthenticateOidcActionAuthenticationRequestExtraParams = S.Record({
  key: S.String,
  value: S.String,
});
export class AuthenticateOidcActionConfig extends S.Class<AuthenticateOidcActionConfig>(
  "AuthenticateOidcActionConfig",
)({
  Issuer: S.String,
  AuthorizationEndpoint: S.String,
  TokenEndpoint: S.String,
  UserInfoEndpoint: S.String,
  ClientId: S.String,
  ClientSecret: S.optional(S.String),
  SessionCookieName: S.optional(S.String),
  Scope: S.optional(S.String),
  SessionTimeout: S.optional(S.Number),
  AuthenticationRequestExtraParams: S.optional(
    AuthenticateOidcActionAuthenticationRequestExtraParams,
  ),
  OnUnauthenticatedRequest: S.optional(S.String),
  UseExistingClientSecret: S.optional(S.Boolean),
}) {}
export const AuthenticateCognitoActionAuthenticationRequestExtraParams =
  S.Record({ key: S.String, value: S.String });
export class AuthenticateCognitoActionConfig extends S.Class<AuthenticateCognitoActionConfig>(
  "AuthenticateCognitoActionConfig",
)({
  UserPoolArn: S.String,
  UserPoolClientId: S.String,
  UserPoolDomain: S.String,
  SessionCookieName: S.optional(S.String),
  Scope: S.optional(S.String),
  SessionTimeout: S.optional(S.Number),
  AuthenticationRequestExtraParams: S.optional(
    AuthenticateCognitoActionAuthenticationRequestExtraParams,
  ),
  OnUnauthenticatedRequest: S.optional(S.String),
}) {}
export class RedirectActionConfig extends S.Class<RedirectActionConfig>(
  "RedirectActionConfig",
)({
  Protocol: S.optional(S.String),
  Port: S.optional(S.String),
  Host: S.optional(S.String),
  Path: S.optional(S.String),
  Query: S.optional(S.String),
  StatusCode: S.String,
}) {}
export class FixedResponseActionConfig extends S.Class<FixedResponseActionConfig>(
  "FixedResponseActionConfig",
)({
  MessageBody: S.optional(S.String),
  StatusCode: S.String,
  ContentType: S.optional(S.String),
}) {}
export class TargetGroupTuple extends S.Class<TargetGroupTuple>(
  "TargetGroupTuple",
)({ TargetGroupArn: S.optional(S.String), Weight: S.optional(S.Number) }) {}
export const TargetGroupList = S.Array(TargetGroupTuple);
export class TargetGroupStickinessConfig extends S.Class<TargetGroupStickinessConfig>(
  "TargetGroupStickinessConfig",
)({ Enabled: S.optional(S.Boolean), DurationSeconds: S.optional(S.Number) }) {}
export class ForwardActionConfig extends S.Class<ForwardActionConfig>(
  "ForwardActionConfig",
)({
  TargetGroups: S.optional(TargetGroupList),
  TargetGroupStickinessConfig: S.optional(TargetGroupStickinessConfig),
}) {}
export const JwtValidationActionAdditionalClaimValues = S.Array(S.String);
export class JwtValidationActionAdditionalClaim extends S.Class<JwtValidationActionAdditionalClaim>(
  "JwtValidationActionAdditionalClaim",
)({
  Format: S.String,
  Name: S.String,
  Values: JwtValidationActionAdditionalClaimValues,
}) {}
export const JwtValidationActionAdditionalClaims = S.Array(
  JwtValidationActionAdditionalClaim,
);
export class JwtValidationActionConfig extends S.Class<JwtValidationActionConfig>(
  "JwtValidationActionConfig",
)({
  JwksEndpoint: S.String,
  Issuer: S.String,
  AdditionalClaims: S.optional(JwtValidationActionAdditionalClaims),
}) {}
export class Action extends S.Class<Action>("Action")({
  Type: S.String,
  TargetGroupArn: S.optional(S.String),
  AuthenticateOidcConfig: S.optional(AuthenticateOidcActionConfig),
  AuthenticateCognitoConfig: S.optional(AuthenticateCognitoActionConfig),
  Order: S.optional(S.Number),
  RedirectConfig: S.optional(RedirectActionConfig),
  FixedResponseConfig: S.optional(FixedResponseActionConfig),
  ForwardConfig: S.optional(ForwardActionConfig),
  JwtValidationConfig: S.optional(JwtValidationActionConfig),
}) {}
export const Actions = S.Array(Action);
export class MutualAuthenticationAttributes extends S.Class<MutualAuthenticationAttributes>(
  "MutualAuthenticationAttributes",
)({
  Mode: S.optional(S.String),
  TrustStoreArn: S.optional(S.String),
  IgnoreClientCertificateExpiry: S.optional(S.Boolean),
  TrustStoreAssociationStatus: S.optional(S.String),
  AdvertiseTrustStoreCaNames: S.optional(S.String),
}) {}
export class ModifyListenerInput extends S.Class<ModifyListenerInput>(
  "ModifyListenerInput",
)(
  {
    ListenerArn: S.String,
    Port: S.optional(S.Number),
    Protocol: S.optional(S.String),
    SslPolicy: S.optional(S.String),
    Certificates: S.optional(CertificateList),
    DefaultActions: S.optional(Actions),
    AlpnPolicy: S.optional(AlpnPolicyName),
    MutualAuthentication: S.optional(MutualAuthenticationAttributes),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ListOfString = S.Array(S.String);
export class HostHeaderConditionConfig extends S.Class<HostHeaderConditionConfig>(
  "HostHeaderConditionConfig",
)({
  Values: S.optional(ListOfString),
  RegexValues: S.optional(ListOfString),
}) {}
export class PathPatternConditionConfig extends S.Class<PathPatternConditionConfig>(
  "PathPatternConditionConfig",
)({
  Values: S.optional(ListOfString),
  RegexValues: S.optional(ListOfString),
}) {}
export class HttpHeaderConditionConfig extends S.Class<HttpHeaderConditionConfig>(
  "HttpHeaderConditionConfig",
)({
  HttpHeaderName: S.optional(S.String),
  Values: S.optional(ListOfString),
  RegexValues: S.optional(ListOfString),
}) {}
export class QueryStringKeyValuePair extends S.Class<QueryStringKeyValuePair>(
  "QueryStringKeyValuePair",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const QueryStringKeyValuePairList = S.Array(QueryStringKeyValuePair);
export class QueryStringConditionConfig extends S.Class<QueryStringConditionConfig>(
  "QueryStringConditionConfig",
)({ Values: S.optional(QueryStringKeyValuePairList) }) {}
export class HttpRequestMethodConditionConfig extends S.Class<HttpRequestMethodConditionConfig>(
  "HttpRequestMethodConditionConfig",
)({ Values: S.optional(ListOfString) }) {}
export class SourceIpConditionConfig extends S.Class<SourceIpConditionConfig>(
  "SourceIpConditionConfig",
)({ Values: S.optional(ListOfString) }) {}
export class RuleCondition extends S.Class<RuleCondition>("RuleCondition")({
  Field: S.optional(S.String),
  Values: S.optional(ListOfString),
  HostHeaderConfig: S.optional(HostHeaderConditionConfig),
  PathPatternConfig: S.optional(PathPatternConditionConfig),
  HttpHeaderConfig: S.optional(HttpHeaderConditionConfig),
  QueryStringConfig: S.optional(QueryStringConditionConfig),
  HttpRequestMethodConfig: S.optional(HttpRequestMethodConditionConfig),
  SourceIpConfig: S.optional(SourceIpConditionConfig),
  RegexValues: S.optional(ListOfString),
}) {}
export const RuleConditionList = S.Array(RuleCondition);
export class RewriteConfig extends S.Class<RewriteConfig>("RewriteConfig")({
  Regex: S.String,
  Replace: S.String,
}) {}
export const RewriteConfigList = S.Array(RewriteConfig);
export class HostHeaderRewriteConfig extends S.Class<HostHeaderRewriteConfig>(
  "HostHeaderRewriteConfig",
)({ Rewrites: S.optional(RewriteConfigList) }) {}
export class UrlRewriteConfig extends S.Class<UrlRewriteConfig>(
  "UrlRewriteConfig",
)({ Rewrites: S.optional(RewriteConfigList) }) {}
export class RuleTransform extends S.Class<RuleTransform>("RuleTransform")({
  Type: S.String,
  HostHeaderRewriteConfig: S.optional(HostHeaderRewriteConfig),
  UrlRewriteConfig: S.optional(UrlRewriteConfig),
}) {}
export const RuleTransformList = S.Array(RuleTransform);
export class ModifyRuleInput extends S.Class<ModifyRuleInput>(
  "ModifyRuleInput",
)(
  {
    RuleArn: S.String,
    Conditions: S.optional(RuleConditionList),
    Actions: S.optional(Actions),
    Transforms: S.optional(RuleTransformList),
    ResetTransforms: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Matcher extends S.Class<Matcher>("Matcher")({
  HttpCode: S.optional(S.String),
  GrpcCode: S.optional(S.String),
}) {}
export class ModifyTargetGroupInput extends S.Class<ModifyTargetGroupInput>(
  "ModifyTargetGroupInput",
)(
  {
    TargetGroupArn: S.String,
    HealthCheckProtocol: S.optional(S.String),
    HealthCheckPort: S.optional(S.String),
    HealthCheckPath: S.optional(S.String),
    HealthCheckEnabled: S.optional(S.Boolean),
    HealthCheckIntervalSeconds: S.optional(S.Number),
    HealthCheckTimeoutSeconds: S.optional(S.Number),
    HealthyThresholdCount: S.optional(S.Number),
    UnhealthyThresholdCount: S.optional(S.Number),
    Matcher: S.optional(Matcher),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyTrustStoreInput extends S.Class<ModifyTrustStoreInput>(
  "ModifyTrustStoreInput",
)(
  {
    TrustStoreArn: S.String,
    CaCertificatesBundleS3Bucket: S.String,
    CaCertificatesBundleS3Key: S.String,
    CaCertificatesBundleS3ObjectVersion: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterTargetsInput extends S.Class<RegisterTargetsInput>(
  "RegisterTargetsInput",
)(
  { TargetGroupArn: S.String, Targets: TargetDescriptions },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterTargetsOutput extends S.Class<RegisterTargetsOutput>(
  "RegisterTargetsOutput",
)({}, ns) {}
export class RemoveListenerCertificatesInput extends S.Class<RemoveListenerCertificatesInput>(
  "RemoveListenerCertificatesInput",
)(
  { ListenerArn: S.String, Certificates: CertificateList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveListenerCertificatesOutput extends S.Class<RemoveListenerCertificatesOutput>(
  "RemoveListenerCertificatesOutput",
)({}, ns) {}
export class RemoveTagsInput extends S.Class<RemoveTagsInput>(
  "RemoveTagsInput",
)(
  { ResourceArns: ResourceArns, TagKeys: TagKeys },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsOutput extends S.Class<RemoveTagsOutput>(
  "RemoveTagsOutput",
)({}, ns) {}
export class RemoveTrustStoreRevocationsInput extends S.Class<RemoveTrustStoreRevocationsInput>(
  "RemoveTrustStoreRevocationsInput",
)(
  { TrustStoreArn: S.String, RevocationIds: RevocationIds },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTrustStoreRevocationsOutput extends S.Class<RemoveTrustStoreRevocationsOutput>(
  "RemoveTrustStoreRevocationsOutput",
)({}, ns) {}
export class SetIpAddressTypeInput extends S.Class<SetIpAddressTypeInput>(
  "SetIpAddressTypeInput",
)(
  { LoadBalancerArn: S.String, IpAddressType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetSecurityGroupsInput extends S.Class<SetSecurityGroupsInput>(
  "SetSecurityGroupsInput",
)(
  {
    LoadBalancerArn: S.String,
    SecurityGroups: SecurityGroups,
    EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SubnetMapping extends S.Class<SubnetMapping>("SubnetMapping")({
  SubnetId: S.optional(S.String),
  AllocationId: S.optional(S.String),
  PrivateIPv4Address: S.optional(S.String),
  IPv6Address: S.optional(S.String),
  SourceNatIpv6Prefix: S.optional(S.String),
}) {}
export const SubnetMappings = S.Array(SubnetMapping);
export class SetSubnetsInput extends S.Class<SetSubnetsInput>(
  "SetSubnetsInput",
)(
  {
    LoadBalancerArn: S.String,
    Subnets: S.optional(Subnets),
    SubnetMappings: S.optional(SubnetMappings),
    IpAddressType: S.optional(S.String),
    EnablePrefixForIpv6SourceNat: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RevocationContent extends S.Class<RevocationContent>(
  "RevocationContent",
)({
  S3Bucket: S.optional(S.String),
  S3Key: S.optional(S.String),
  S3ObjectVersion: S.optional(S.String),
  RevocationType: S.optional(S.String),
}) {}
export const RevocationContents = S.Array(RevocationContent);
export class MinimumLoadBalancerCapacity extends S.Class<MinimumLoadBalancerCapacity>(
  "MinimumLoadBalancerCapacity",
)({ CapacityUnits: S.optional(S.Number) }) {}
export class ListenerAttribute extends S.Class<ListenerAttribute>(
  "ListenerAttribute",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const ListenerAttributes = S.Array(ListenerAttribute);
export class LoadBalancerAttribute extends S.Class<LoadBalancerAttribute>(
  "LoadBalancerAttribute",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const LoadBalancerAttributes = S.Array(LoadBalancerAttribute);
export class TargetGroupAttribute extends S.Class<TargetGroupAttribute>(
  "TargetGroupAttribute",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const TargetGroupAttributes = S.Array(TargetGroupAttribute);
export class RulePriorityPair extends S.Class<RulePriorityPair>(
  "RulePriorityPair",
)({ RuleArn: S.optional(S.String), Priority: S.optional(S.Number) }) {}
export const RulePriorityList = S.Array(RulePriorityPair);
export class AddListenerCertificatesInput extends S.Class<AddListenerCertificatesInput>(
  "AddListenerCertificatesInput",
)(
  { ListenerArn: S.String, Certificates: CertificateList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddTagsInput extends S.Class<AddTagsInput>("AddTagsInput")(
  { ResourceArns: ResourceArns, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddTagsOutput extends S.Class<AddTagsOutput>("AddTagsOutput")(
  {},
  ns,
) {}
export class AddTrustStoreRevocationsInput extends S.Class<AddTrustStoreRevocationsInput>(
  "AddTrustStoreRevocationsInput",
)(
  {
    TrustStoreArn: S.String,
    RevocationContents: S.optional(RevocationContents),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLoadBalancerInput extends S.Class<CreateLoadBalancerInput>(
  "CreateLoadBalancerInput",
)(
  {
    Name: S.String,
    Subnets: S.optional(Subnets),
    SubnetMappings: S.optional(SubnetMappings),
    SecurityGroups: S.optional(SecurityGroups),
    Scheme: S.optional(S.String),
    Tags: S.optional(TagList),
    Type: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    CustomerOwnedIpv4Pool: S.optional(S.String),
    EnablePrefixForIpv6SourceNat: S.optional(S.String),
    IpamPools: S.optional(IpamPools),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTargetGroupInput extends S.Class<CreateTargetGroupInput>(
  "CreateTargetGroupInput",
)(
  {
    Name: S.String,
    Protocol: S.optional(S.String),
    ProtocolVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    VpcId: S.optional(S.String),
    HealthCheckProtocol: S.optional(S.String),
    HealthCheckPort: S.optional(S.String),
    HealthCheckEnabled: S.optional(S.Boolean),
    HealthCheckPath: S.optional(S.String),
    HealthCheckIntervalSeconds: S.optional(S.Number),
    HealthCheckTimeoutSeconds: S.optional(S.Number),
    HealthyThresholdCount: S.optional(S.Number),
    UnhealthyThresholdCount: S.optional(S.Number),
    Matcher: S.optional(Matcher),
    TargetType: S.optional(S.String),
    Tags: S.optional(TagList),
    IpAddressType: S.optional(S.String),
    TargetControlPort: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterTargetsInput extends S.Class<DeregisterTargetsInput>(
  "DeregisterTargetsInput",
)(
  { TargetGroupArn: S.String, Targets: TargetDescriptions },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterTargetsOutput extends S.Class<DeregisterTargetsOutput>(
  "DeregisterTargetsOutput",
)({}, ns) {}
export class DescribeListenerAttributesOutput extends S.Class<DescribeListenerAttributesOutput>(
  "DescribeListenerAttributesOutput",
)({ Attributes: S.optional(ListenerAttributes) }, ns) {}
export class DescribeListenerCertificatesOutput extends S.Class<DescribeListenerCertificatesOutput>(
  "DescribeListenerCertificatesOutput",
)(
  {
    Certificates: S.optional(CertificateList),
    NextMarker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeLoadBalancerAttributesOutput extends S.Class<DescribeLoadBalancerAttributesOutput>(
  "DescribeLoadBalancerAttributesOutput",
)({ Attributes: S.optional(LoadBalancerAttributes) }, ns) {}
export class DescribeTargetGroupAttributesOutput extends S.Class<DescribeTargetGroupAttributesOutput>(
  "DescribeTargetGroupAttributesOutput",
)({ Attributes: S.optional(TargetGroupAttributes) }, ns) {}
export class TrustStore extends S.Class<TrustStore>("TrustStore")({
  Name: S.optional(S.String),
  TrustStoreArn: S.optional(S.String),
  Status: S.optional(S.String),
  NumberOfCaCertificates: S.optional(S.Number),
  TotalRevokedEntries: S.optional(S.Number),
}) {}
export const TrustStores = S.Array(TrustStore);
export class DescribeTrustStoresOutput extends S.Class<DescribeTrustStoresOutput>(
  "DescribeTrustStoresOutput",
)(
  { TrustStores: S.optional(TrustStores), NextMarker: S.optional(S.String) },
  ns,
) {}
export class GetResourcePolicyOutput extends S.Class<GetResourcePolicyOutput>(
  "GetResourcePolicyOutput",
)({ Policy: S.optional(S.String) }, ns) {}
export class GetTrustStoreCaCertificatesBundleOutput extends S.Class<GetTrustStoreCaCertificatesBundleOutput>(
  "GetTrustStoreCaCertificatesBundleOutput",
)({ Location: S.optional(S.String) }, ns) {}
export class GetTrustStoreRevocationContentOutput extends S.Class<GetTrustStoreRevocationContentOutput>(
  "GetTrustStoreRevocationContentOutput",
)({ Location: S.optional(S.String) }, ns) {}
export class ModifyCapacityReservationInput extends S.Class<ModifyCapacityReservationInput>(
  "ModifyCapacityReservationInput",
)(
  {
    LoadBalancerArn: S.String,
    MinimumLoadBalancerCapacity: S.optional(MinimumLoadBalancerCapacity),
    ResetCapacityReservation: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyIpPoolsOutput extends S.Class<ModifyIpPoolsOutput>(
  "ModifyIpPoolsOutput",
)({ IpamPools: S.optional(IpamPools) }, ns) {}
export class Listener extends S.Class<Listener>("Listener")({
  ListenerArn: S.optional(S.String),
  LoadBalancerArn: S.optional(S.String),
  Port: S.optional(S.Number),
  Protocol: S.optional(S.String),
  Certificates: S.optional(CertificateList),
  SslPolicy: S.optional(S.String),
  DefaultActions: S.optional(Actions),
  AlpnPolicy: S.optional(AlpnPolicyName),
  MutualAuthentication: S.optional(MutualAuthenticationAttributes),
}) {}
export const Listeners = S.Array(Listener);
export class ModifyListenerOutput extends S.Class<ModifyListenerOutput>(
  "ModifyListenerOutput",
)({ Listeners: S.optional(Listeners) }, ns) {}
export class ModifyListenerAttributesInput extends S.Class<ModifyListenerAttributesInput>(
  "ModifyListenerAttributesInput",
)(
  { ListenerArn: S.String, Attributes: ListenerAttributes },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyLoadBalancerAttributesInput extends S.Class<ModifyLoadBalancerAttributesInput>(
  "ModifyLoadBalancerAttributesInput",
)(
  { LoadBalancerArn: S.String, Attributes: LoadBalancerAttributes },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Rule extends S.Class<Rule>("Rule")({
  RuleArn: S.optional(S.String),
  Priority: S.optional(S.String),
  Conditions: S.optional(RuleConditionList),
  Actions: S.optional(Actions),
  IsDefault: S.optional(S.Boolean),
  Transforms: S.optional(RuleTransformList),
}) {}
export const Rules = S.Array(Rule);
export class ModifyRuleOutput extends S.Class<ModifyRuleOutput>(
  "ModifyRuleOutput",
)({ Rules: S.optional(Rules) }, ns) {}
export class TargetGroup extends S.Class<TargetGroup>("TargetGroup")({
  TargetGroupArn: S.optional(S.String),
  TargetGroupName: S.optional(S.String),
  Protocol: S.optional(S.String),
  Port: S.optional(S.Number),
  VpcId: S.optional(S.String),
  HealthCheckProtocol: S.optional(S.String),
  HealthCheckPort: S.optional(S.String),
  HealthCheckEnabled: S.optional(S.Boolean),
  HealthCheckIntervalSeconds: S.optional(S.Number),
  HealthCheckTimeoutSeconds: S.optional(S.Number),
  HealthyThresholdCount: S.optional(S.Number),
  UnhealthyThresholdCount: S.optional(S.Number),
  HealthCheckPath: S.optional(S.String),
  Matcher: S.optional(Matcher),
  LoadBalancerArns: S.optional(LoadBalancerArns),
  TargetType: S.optional(S.String),
  ProtocolVersion: S.optional(S.String),
  IpAddressType: S.optional(S.String),
  TargetControlPort: S.optional(S.Number),
}) {}
export const TargetGroups = S.Array(TargetGroup);
export class ModifyTargetGroupOutput extends S.Class<ModifyTargetGroupOutput>(
  "ModifyTargetGroupOutput",
)({ TargetGroups: S.optional(TargetGroups) }, ns) {}
export class ModifyTargetGroupAttributesInput extends S.Class<ModifyTargetGroupAttributesInput>(
  "ModifyTargetGroupAttributesInput",
)(
  { TargetGroupArn: S.String, Attributes: TargetGroupAttributes },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyTrustStoreOutput extends S.Class<ModifyTrustStoreOutput>(
  "ModifyTrustStoreOutput",
)({ TrustStores: S.optional(TrustStores) }, ns) {}
export class SetIpAddressTypeOutput extends S.Class<SetIpAddressTypeOutput>(
  "SetIpAddressTypeOutput",
)({ IpAddressType: S.optional(S.String) }, ns) {}
export class SetRulePrioritiesInput extends S.Class<SetRulePrioritiesInput>(
  "SetRulePrioritiesInput",
)(
  { RulePriorities: RulePriorityList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetSecurityGroupsOutput extends S.Class<SetSecurityGroupsOutput>(
  "SetSecurityGroupsOutput",
)(
  {
    SecurityGroupIds: S.optional(SecurityGroups),
    EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic: S.optional(S.String),
  },
  ns,
) {}
export const SslProtocols = S.Array(S.String);
export const SourceNatIpv6Prefixes = S.Array(S.String);
export class Limit extends S.Class<Limit>("Limit")({
  Name: S.optional(S.String),
  Max: S.optional(S.String),
}) {}
export const Limits = S.Array(Limit);
export class TagDescription extends S.Class<TagDescription>("TagDescription")({
  ResourceArn: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const TagDescriptions = S.Array(TagDescription);
export class TrustStoreAssociation extends S.Class<TrustStoreAssociation>(
  "TrustStoreAssociation",
)({ ResourceArn: S.optional(S.String) }) {}
export const TrustStoreAssociations = S.Array(TrustStoreAssociation);
export class DescribeTrustStoreRevocation extends S.Class<DescribeTrustStoreRevocation>(
  "DescribeTrustStoreRevocation",
)({
  TrustStoreArn: S.optional(S.String),
  RevocationId: S.optional(S.Number),
  RevocationType: S.optional(S.String),
  NumberOfRevokedEntries: S.optional(S.Number),
}) {}
export const DescribeTrustStoreRevocationResponse = S.Array(
  DescribeTrustStoreRevocation,
);
export class AddListenerCertificatesOutput extends S.Class<AddListenerCertificatesOutput>(
  "AddListenerCertificatesOutput",
)({ Certificates: S.optional(CertificateList) }, ns) {}
export class LoadBalancerState extends S.Class<LoadBalancerState>(
  "LoadBalancerState",
)({ Code: S.optional(S.String), Reason: S.optional(S.String) }) {}
export class LoadBalancerAddress extends S.Class<LoadBalancerAddress>(
  "LoadBalancerAddress",
)({
  IpAddress: S.optional(S.String),
  AllocationId: S.optional(S.String),
  PrivateIPv4Address: S.optional(S.String),
  IPv6Address: S.optional(S.String),
}) {}
export const LoadBalancerAddresses = S.Array(LoadBalancerAddress);
export class AvailabilityZone extends S.Class<AvailabilityZone>(
  "AvailabilityZone",
)({
  ZoneName: S.optional(S.String),
  SubnetId: S.optional(S.String),
  OutpostId: S.optional(S.String),
  LoadBalancerAddresses: S.optional(LoadBalancerAddresses),
  SourceNatIpv6Prefixes: S.optional(SourceNatIpv6Prefixes),
}) {}
export const AvailabilityZones = S.Array(AvailabilityZone);
export class LoadBalancer extends S.Class<LoadBalancer>("LoadBalancer")({
  LoadBalancerArn: S.optional(S.String),
  DNSName: S.optional(S.String),
  CanonicalHostedZoneId: S.optional(S.String),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LoadBalancerName: S.optional(S.String),
  Scheme: S.optional(S.String),
  VpcId: S.optional(S.String),
  State: S.optional(LoadBalancerState),
  Type: S.optional(S.String),
  AvailabilityZones: S.optional(AvailabilityZones),
  SecurityGroups: S.optional(SecurityGroups),
  IpAddressType: S.optional(S.String),
  CustomerOwnedIpv4Pool: S.optional(S.String),
  EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic: S.optional(S.String),
  EnablePrefixForIpv6SourceNat: S.optional(S.String),
  IpamPools: S.optional(IpamPools),
}) {}
export const LoadBalancers = S.Array(LoadBalancer);
export class CreateLoadBalancerOutput extends S.Class<CreateLoadBalancerOutput>(
  "CreateLoadBalancerOutput",
)({ LoadBalancers: S.optional(LoadBalancers) }, ns) {}
export class CreateTargetGroupOutput extends S.Class<CreateTargetGroupOutput>(
  "CreateTargetGroupOutput",
)({ TargetGroups: S.optional(TargetGroups) }, ns) {}
export class CreateTrustStoreOutput extends S.Class<CreateTrustStoreOutput>(
  "CreateTrustStoreOutput",
)({ TrustStores: S.optional(TrustStores) }, ns) {}
export class DescribeAccountLimitsOutput extends S.Class<DescribeAccountLimitsOutput>(
  "DescribeAccountLimitsOutput",
)({ Limits: S.optional(Limits), NextMarker: S.optional(S.String) }, ns) {}
export class DescribeListenersOutput extends S.Class<DescribeListenersOutput>(
  "DescribeListenersOutput",
)({ Listeners: S.optional(Listeners), NextMarker: S.optional(S.String) }, ns) {}
export class DescribeRulesOutput extends S.Class<DescribeRulesOutput>(
  "DescribeRulesOutput",
)({ Rules: S.optional(Rules), NextMarker: S.optional(S.String) }, ns) {}
export class DescribeTagsOutput extends S.Class<DescribeTagsOutput>(
  "DescribeTagsOutput",
)({ TagDescriptions: S.optional(TagDescriptions) }, ns) {}
export class DescribeTargetGroupsOutput extends S.Class<DescribeTargetGroupsOutput>(
  "DescribeTargetGroupsOutput",
)(
  { TargetGroups: S.optional(TargetGroups), NextMarker: S.optional(S.String) },
  ns,
) {}
export class DescribeTrustStoreAssociationsOutput extends S.Class<DescribeTrustStoreAssociationsOutput>(
  "DescribeTrustStoreAssociationsOutput",
)(
  {
    TrustStoreAssociations: S.optional(TrustStoreAssociations),
    NextMarker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeTrustStoreRevocationsOutput extends S.Class<DescribeTrustStoreRevocationsOutput>(
  "DescribeTrustStoreRevocationsOutput",
)(
  {
    TrustStoreRevocations: S.optional(DescribeTrustStoreRevocationResponse),
    NextMarker: S.optional(S.String),
  },
  ns,
) {}
export class CapacityReservationStatus extends S.Class<CapacityReservationStatus>(
  "CapacityReservationStatus",
)({ Code: S.optional(S.String), Reason: S.optional(S.String) }) {}
export class ZonalCapacityReservationState extends S.Class<ZonalCapacityReservationState>(
  "ZonalCapacityReservationState",
)({
  State: S.optional(CapacityReservationStatus),
  AvailabilityZone: S.optional(S.String),
  EffectiveCapacityUnits: S.optional(S.Number),
}) {}
export const ZonalCapacityReservationStates = S.Array(
  ZonalCapacityReservationState,
);
export class ModifyCapacityReservationOutput extends S.Class<ModifyCapacityReservationOutput>(
  "ModifyCapacityReservationOutput",
)(
  {
    LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DecreaseRequestsRemaining: S.optional(S.Number),
    MinimumLoadBalancerCapacity: S.optional(MinimumLoadBalancerCapacity),
    CapacityReservationState: S.optional(ZonalCapacityReservationStates),
  },
  ns,
) {}
export class ModifyListenerAttributesOutput extends S.Class<ModifyListenerAttributesOutput>(
  "ModifyListenerAttributesOutput",
)({ Attributes: S.optional(ListenerAttributes) }, ns) {}
export class ModifyLoadBalancerAttributesOutput extends S.Class<ModifyLoadBalancerAttributesOutput>(
  "ModifyLoadBalancerAttributesOutput",
)({ Attributes: S.optional(LoadBalancerAttributes) }, ns) {}
export class ModifyTargetGroupAttributesOutput extends S.Class<ModifyTargetGroupAttributesOutput>(
  "ModifyTargetGroupAttributesOutput",
)({ Attributes: S.optional(TargetGroupAttributes) }, ns) {}
export class SetRulePrioritiesOutput extends S.Class<SetRulePrioritiesOutput>(
  "SetRulePrioritiesOutput",
)({ Rules: S.optional(Rules) }, ns) {}
export class Cipher extends S.Class<Cipher>("Cipher")({
  Name: S.optional(S.String),
  Priority: S.optional(S.Number),
}) {}
export const Ciphers = S.Array(Cipher);
export class TargetHealth extends S.Class<TargetHealth>("TargetHealth")({
  State: S.optional(S.String),
  Reason: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class AnomalyDetection extends S.Class<AnomalyDetection>(
  "AnomalyDetection",
)({ Result: S.optional(S.String), MitigationInEffect: S.optional(S.String) }) {}
export class AdministrativeOverride extends S.Class<AdministrativeOverride>(
  "AdministrativeOverride",
)({
  State: S.optional(S.String),
  Reason: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class TrustStoreRevocation extends S.Class<TrustStoreRevocation>(
  "TrustStoreRevocation",
)({
  TrustStoreArn: S.optional(S.String),
  RevocationId: S.optional(S.Number),
  RevocationType: S.optional(S.String),
  NumberOfRevokedEntries: S.optional(S.Number),
}) {}
export const TrustStoreRevocations = S.Array(TrustStoreRevocation);
export class SslPolicy extends S.Class<SslPolicy>("SslPolicy")({
  SslProtocols: S.optional(SslProtocols),
  Ciphers: S.optional(Ciphers),
  Name: S.optional(S.String),
  SupportedLoadBalancerTypes: S.optional(ListOfString),
}) {}
export const SslPolicies = S.Array(SslPolicy);
export class TargetHealthDescription extends S.Class<TargetHealthDescription>(
  "TargetHealthDescription",
)({
  Target: S.optional(TargetDescription),
  HealthCheckPort: S.optional(S.String),
  TargetHealth: S.optional(TargetHealth),
  AnomalyDetection: S.optional(AnomalyDetection),
  AdministrativeOverride: S.optional(AdministrativeOverride),
}) {}
export const TargetHealthDescriptions = S.Array(TargetHealthDescription);
export class AddTrustStoreRevocationsOutput extends S.Class<AddTrustStoreRevocationsOutput>(
  "AddTrustStoreRevocationsOutput",
)({ TrustStoreRevocations: S.optional(TrustStoreRevocations) }, ns) {}
export class CreateListenerInput extends S.Class<CreateListenerInput>(
  "CreateListenerInput",
)(
  {
    LoadBalancerArn: S.String,
    Protocol: S.optional(S.String),
    Port: S.optional(S.Number),
    SslPolicy: S.optional(S.String),
    Certificates: S.optional(CertificateList),
    DefaultActions: Actions,
    AlpnPolicy: S.optional(AlpnPolicyName),
    Tags: S.optional(TagList),
    MutualAuthentication: S.optional(MutualAuthenticationAttributes),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRuleInput extends S.Class<CreateRuleInput>(
  "CreateRuleInput",
)(
  {
    ListenerArn: S.String,
    Conditions: RuleConditionList,
    Priority: S.Number,
    Actions: Actions,
    Tags: S.optional(TagList),
    Transforms: S.optional(RuleTransformList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCapacityReservationOutput extends S.Class<DescribeCapacityReservationOutput>(
  "DescribeCapacityReservationOutput",
)(
  {
    LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DecreaseRequestsRemaining: S.optional(S.Number),
    MinimumLoadBalancerCapacity: S.optional(MinimumLoadBalancerCapacity),
    CapacityReservationState: S.optional(ZonalCapacityReservationStates),
  },
  ns,
) {}
export class DescribeLoadBalancersOutput extends S.Class<DescribeLoadBalancersOutput>(
  "DescribeLoadBalancersOutput",
)(
  {
    LoadBalancers: S.optional(LoadBalancers),
    NextMarker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeSSLPoliciesOutput extends S.Class<DescribeSSLPoliciesOutput>(
  "DescribeSSLPoliciesOutput",
)(
  { SslPolicies: S.optional(SslPolicies), NextMarker: S.optional(S.String) },
  ns,
) {}
export class DescribeTargetHealthOutput extends S.Class<DescribeTargetHealthOutput>(
  "DescribeTargetHealthOutput",
)({ TargetHealthDescriptions: S.optional(TargetHealthDescriptions) }, ns) {}
export class SetSubnetsOutput extends S.Class<SetSubnetsOutput>(
  "SetSubnetsOutput",
)(
  {
    AvailabilityZones: S.optional(AvailabilityZones),
    IpAddressType: S.optional(S.String),
    EnablePrefixForIpv6SourceNat: S.optional(S.String),
  },
  ns,
) {}
export class CreateListenerOutput extends S.Class<CreateListenerOutput>(
  "CreateListenerOutput",
)({ Listeners: S.optional(Listeners) }, ns) {}
export class CreateRuleOutput extends S.Class<CreateRuleOutput>(
  "CreateRuleOutput",
)({ Rules: S.optional(Rules) }, ns) {}

//# Errors
export class ListenerNotFoundException extends S.TaggedError<ListenerNotFoundException>()(
  "ListenerNotFoundException",
  {},
  T.AwsQueryError({ code: "ListenerNotFound", httpResponseCode: 400 }),
) {}
export class OperationNotPermittedException extends S.TaggedError<OperationNotPermittedException>()(
  "OperationNotPermittedException",
  {},
  T.AwsQueryError({ code: "OperationNotPermitted", httpResponseCode: 400 }),
) {}
export class LoadBalancerNotFoundException extends S.TaggedError<LoadBalancerNotFoundException>()(
  "LoadBalancerNotFoundException",
  {},
  T.AwsQueryError({ code: "LoadBalancerNotFound", httpResponseCode: 400 }),
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {},
  T.AwsQueryError({ code: "ResourceInUse", httpResponseCode: 400 }),
) {}
export class RuleNotFoundException extends S.TaggedError<RuleNotFoundException>()(
  "RuleNotFoundException",
  {},
  T.AwsQueryError({ code: "RuleNotFound", httpResponseCode: 400 }),
) {}
export class DeleteAssociationSameAccountException extends S.TaggedError<DeleteAssociationSameAccountException>()(
  "DeleteAssociationSameAccountException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DeleteAssociationSameAccount",
    httpResponseCode: 400,
  }),
) {}
export class TrustStoreInUseException extends S.TaggedError<TrustStoreInUseException>()(
  "TrustStoreInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TrustStoreInUse", httpResponseCode: 400 }),
) {}
export class InvalidTargetException extends S.TaggedError<InvalidTargetException>()(
  "InvalidTargetException",
  {},
  T.AwsQueryError({ code: "InvalidTarget", httpResponseCode: 400 }),
) {}
export class TargetGroupNotFoundException extends S.TaggedError<TargetGroupNotFoundException>()(
  "TargetGroupNotFoundException",
  {},
  T.AwsQueryError({ code: "TargetGroupNotFound", httpResponseCode: 400 }),
) {}
export class TrustStoreNotFoundException extends S.TaggedError<TrustStoreNotFoundException>()(
  "TrustStoreNotFoundException",
  {},
  T.AwsQueryError({ code: "TrustStoreNotFound", httpResponseCode: 400 }),
) {}
export class RevocationIdNotFoundException extends S.TaggedError<RevocationIdNotFoundException>()(
  "RevocationIdNotFoundException",
  {},
  T.AwsQueryError({ code: "RevocationIdNotFound", httpResponseCode: 400 }),
) {}
export class InvalidConfigurationRequestException extends S.TaggedError<InvalidConfigurationRequestException>()(
  "InvalidConfigurationRequestException",
  {},
  T.AwsQueryError({
    code: "InvalidConfigurationRequest",
    httpResponseCode: 400,
  }),
) {}
export class DuplicateTagKeysException extends S.TaggedError<DuplicateTagKeysException>()(
  "DuplicateTagKeysException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateTagKeys", httpResponseCode: 400 }),
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  {},
  T.AwsQueryError({ code: "TooManyTags", httpResponseCode: 400 }),
) {}
export class CaCertificatesBundleNotFoundException extends S.TaggedError<CaCertificatesBundleNotFoundException>()(
  "CaCertificatesBundleNotFoundException",
  {},
  T.AwsQueryError({
    code: "CaCertificatesBundleNotFound",
    httpResponseCode: 400,
  }),
) {}
export class TrustStoreAssociationNotFoundException extends S.TaggedError<TrustStoreAssociationNotFoundException>()(
  "TrustStoreAssociationNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AssociationNotFound", httpResponseCode: 400 }),
) {}
export class UnsupportedProtocolException extends S.TaggedError<UnsupportedProtocolException>()(
  "UnsupportedProtocolException",
  {},
  T.AwsQueryError({ code: "UnsupportedProtocol", httpResponseCode: 400 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFound", httpResponseCode: 400 }),
) {}
export class ALPNPolicyNotSupportedException extends S.TaggedError<ALPNPolicyNotSupportedException>()(
  "ALPNPolicyNotSupportedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ALPNPolicyNotFound", httpResponseCode: 400 }),
) {}
export class CertificateNotFoundException extends S.TaggedError<CertificateNotFoundException>()(
  "CertificateNotFoundException",
  {},
  T.AwsQueryError({ code: "CertificateNotFound", httpResponseCode: 400 }),
) {}
export class IncompatibleProtocolsException extends S.TaggedError<IncompatibleProtocolsException>()(
  "IncompatibleProtocolsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "IncompatibleProtocols", httpResponseCode: 400 }),
) {}
export class TooManyRegistrationsForTargetIdException extends S.TaggedError<TooManyRegistrationsForTargetIdException>()(
  "TooManyRegistrationsForTargetIdException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TooManyRegistrationsForTargetId",
    httpResponseCode: 400,
  }),
) {}
export class InvalidSubnetException extends S.TaggedError<InvalidSubnetException>()(
  "InvalidSubnetException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
) {}
export class InvalidSecurityGroupException extends S.TaggedError<InvalidSecurityGroupException>()(
  "InvalidSecurityGroupException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSecurityGroup", httpResponseCode: 400 }),
) {}
export class AllocationIdNotFoundException extends S.TaggedError<AllocationIdNotFoundException>()(
  "AllocationIdNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AllocationIdNotFound", httpResponseCode: 400 }),
) {}
export class DuplicateTargetGroupNameException extends S.TaggedError<DuplicateTargetGroupNameException>()(
  "DuplicateTargetGroupNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateTargetGroupName", httpResponseCode: 400 }),
) {}
export class DuplicateTrustStoreNameException extends S.TaggedError<DuplicateTrustStoreNameException>()(
  "DuplicateTrustStoreNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateTrustStoreName", httpResponseCode: 400 }),
) {}
export class InvalidCaCertificatesBundleException extends S.TaggedError<InvalidCaCertificatesBundleException>()(
  "InvalidCaCertificatesBundleException",
  {},
  T.AwsQueryError({
    code: "InvalidCaCertificatesBundle",
    httpResponseCode: 400,
  }),
) {}
export class CapacityDecreaseRequestsLimitExceededException extends S.TaggedError<CapacityDecreaseRequestsLimitExceededException>()(
  "CapacityDecreaseRequestsLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CapacityDecreaseRequestLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class DuplicateListenerException extends S.TaggedError<DuplicateListenerException>()(
  "DuplicateListenerException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateListener", httpResponseCode: 400 }),
) {}
export class InvalidLoadBalancerActionException extends S.TaggedError<InvalidLoadBalancerActionException>()(
  "InvalidLoadBalancerActionException",
  {},
  T.AwsQueryError({ code: "InvalidLoadBalancerAction", httpResponseCode: 400 }),
) {}
export class SSLPolicyNotFoundException extends S.TaggedError<SSLPolicyNotFoundException>()(
  "SSLPolicyNotFoundException",
  {},
  T.AwsQueryError({ code: "SSLPolicyNotFound", httpResponseCode: 400 }),
) {}
export class TargetGroupAssociationLimitException extends S.TaggedError<TargetGroupAssociationLimitException>()(
  "TargetGroupAssociationLimitException",
  {},
  T.AwsQueryError({
    code: "TargetGroupAssociationLimit",
    httpResponseCode: 400,
  }),
) {}
export class TooManyTargetsException extends S.TaggedError<TooManyTargetsException>()(
  "TooManyTargetsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyTargets", httpResponseCode: 400 }),
) {}
export class PriorityInUseException extends S.TaggedError<PriorityInUseException>()(
  "PriorityInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "PriorityInUse", httpResponseCode: 400 }),
) {}
export class AvailabilityZoneNotSupportedException extends S.TaggedError<AvailabilityZoneNotSupportedException>()(
  "AvailabilityZoneNotSupportedException",
  {},
  T.AwsQueryError({
    code: "AvailabilityZoneNotSupported",
    httpResponseCode: 400,
  }),
) {}
export class CapacityReservationPendingException extends S.TaggedError<CapacityReservationPendingException>()(
  "CapacityReservationPendingException",
  {},
  T.AwsQueryError({
    code: "CapacityReservationPending",
    httpResponseCode: 400,
  }),
) {}
export class TooManyCertificatesException extends S.TaggedError<TooManyCertificatesException>()(
  "TooManyCertificatesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyCertificates", httpResponseCode: 400 }),
) {}
export class InvalidRevocationContentException extends S.TaggedError<InvalidRevocationContentException>()(
  "InvalidRevocationContentException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRevocationContent", httpResponseCode: 400 }),
) {}
export class TooManyActionsException extends S.TaggedError<TooManyActionsException>()(
  "TooManyActionsException",
  {},
  T.AwsQueryError({ code: "TooManyActions", httpResponseCode: 400 }),
) {}
export class TooManyTargetGroupsException extends S.TaggedError<TooManyTargetGroupsException>()(
  "TooManyTargetGroupsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyTargetGroups", httpResponseCode: 400 }),
) {}
export class TooManyTrustStoresException extends S.TaggedError<TooManyTrustStoresException>()(
  "TooManyTrustStoresException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyTrustStores", httpResponseCode: 400 }),
) {}
export class HealthUnavailableException extends S.TaggedError<HealthUnavailableException>()(
  "HealthUnavailableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "HealthUnavailable", httpResponseCode: 500 }),
) {}
export class TooManyListenersException extends S.TaggedError<TooManyListenersException>()(
  "TooManyListenersException",
  {},
  T.AwsQueryError({ code: "TooManyListeners", httpResponseCode: 400 }),
) {}
export class TooManyUniqueTargetGroupsPerLoadBalancerException extends S.TaggedError<TooManyUniqueTargetGroupsPerLoadBalancerException>()(
  "TooManyUniqueTargetGroupsPerLoadBalancerException",
  {},
  T.AwsQueryError({
    code: "TooManyUniqueTargetGroupsPerLoadBalancer",
    httpResponseCode: 400,
  }),
) {}
export class SubnetNotFoundException extends S.TaggedError<SubnetNotFoundException>()(
  "SubnetNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetNotFound", httpResponseCode: 400 }),
) {}
export class RevocationContentNotFoundException extends S.TaggedError<RevocationContentNotFoundException>()(
  "RevocationContentNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "RevocationContentNotFound", httpResponseCode: 400 }),
) {}
export class DuplicateLoadBalancerNameException extends S.TaggedError<DuplicateLoadBalancerNameException>()(
  "DuplicateLoadBalancerNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateLoadBalancerName", httpResponseCode: 400 }),
) {}
export class TooManyRulesException extends S.TaggedError<TooManyRulesException>()(
  "TooManyRulesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyRules", httpResponseCode: 400 }),
) {}
export class CapacityUnitsLimitExceededException extends S.TaggedError<CapacityUnitsLimitExceededException>()(
  "CapacityUnitsLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CapacityUnitsLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class TrustStoreNotReadyException extends S.TaggedError<TrustStoreNotReadyException>()(
  "TrustStoreNotReadyException",
  {},
  T.AwsQueryError({ code: "TrustStoreNotReady", httpResponseCode: 400 }),
) {}
export class TooManyTrustStoreRevocationEntriesException extends S.TaggedError<TooManyTrustStoreRevocationEntriesException>()(
  "TooManyTrustStoreRevocationEntriesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TooManyTrustStoreRevocationEntries",
    httpResponseCode: 400,
  }),
) {}
export class InvalidSchemeException extends S.TaggedError<InvalidSchemeException>()(
  "InvalidSchemeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidScheme", httpResponseCode: 400 }),
) {}
export class InsufficientCapacityException extends S.TaggedError<InsufficientCapacityException>()(
  "InsufficientCapacityException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InsufficientCapacity", httpResponseCode: 500 }),
) {}
export class TooManyLoadBalancersException extends S.TaggedError<TooManyLoadBalancersException>()(
  "TooManyLoadBalancersException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyLoadBalancers", httpResponseCode: 400 }),
) {}
export class PriorRequestNotCompleteException extends S.TaggedError<PriorRequestNotCompleteException>()(
  "PriorRequestNotCompleteException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "PriorRequestNotComplete", httpResponseCode: 429 }),
) {}

//# Operations
/**
 * Removes the specified certificate from the certificate list for the specified HTTPS or TLS
 * listener.
 */
export const removeListenerCertificates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveListenerCertificatesInput,
    output: RemoveListenerCertificatesOutput,
    errors: [ListenerNotFoundException, OperationNotPermittedException],
  }),
);
/**
 * Deletes the specified listener.
 *
 * Alternatively, your listener is deleted when you delete the load balancer to which it is
 * attached.
 */
export const deleteListener = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteListenerInput,
  output: DeleteListenerOutput,
  errors: [ListenerNotFoundException, ResourceInUseException],
}));
/**
 * Deletes the specified Application Load Balancer, Network Load Balancer, or Gateway Load
 * Balancer. Deleting a load balancer also deletes its listeners.
 *
 * You can't delete a load balancer if deletion protection is enabled. If the load balancer
 * does not exist or has already been deleted, the call succeeds.
 *
 * Deleting a load balancer does not affect its registered targets. For example, your EC2
 * instances continue to run and are still registered to their target groups. If you no longer
 * need these EC2 instances, you can stop or terminate them.
 */
export const deleteLoadBalancer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLoadBalancerInput,
  output: DeleteLoadBalancerOutput,
  errors: [
    LoadBalancerNotFoundException,
    OperationNotPermittedException,
    ResourceInUseException,
  ],
}));
/**
 * Deletes the specified rule.
 *
 * You can't delete the default rule.
 */
export const deleteRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleInput,
  output: DeleteRuleOutput,
  errors: [OperationNotPermittedException, RuleNotFoundException],
}));
/**
 * Deletes the specified target group.
 *
 * You can delete a target group if it is not referenced by any actions. Deleting a target
 * group also deletes any associated health checks. Deleting a target group does not affect its
 * registered targets. For example, any EC2 instances continue to run until you stop or terminate
 * them.
 */
export const deleteTargetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTargetGroupInput,
  output: DeleteTargetGroupOutput,
  errors: [ResourceInUseException],
}));
/**
 * Describes the attributes for the specified listener.
 */
export const describeListenerAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeListenerAttributesInput,
    output: DescribeListenerAttributesOutput,
    errors: [ListenerNotFoundException],
  }),
);
/**
 * Describes the default certificate and the certificate list for the specified HTTPS or TLS
 * listener.
 *
 * If the default certificate is also in the certificate list, it appears twice in the
 * results (once with `IsDefault` set to true and once with `IsDefault` set
 * to false).
 *
 * For more information, see SSL certificates in the *Application Load Balancers Guide* or
 * Server certificates in the Network Load Balancers
 * Guide.
 */
export const describeListenerCertificates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeListenerCertificatesInput,
    output: DescribeListenerCertificatesOutput,
    errors: [ListenerNotFoundException],
  }));
/**
 * Describes the attributes for the specified Application Load Balancer, Network Load
 * Balancer, or Gateway Load Balancer.
 *
 * For more information, see the following:
 *
 * - Load balancer attributes in the Application Load Balancers
 * Guide
 *
 * - Load balancer attributes in the Network Load Balancers
 * Guide
 *
 * - Load balancer attributes in the Gateway Load Balancers
 * Guide
 */
export const describeLoadBalancerAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeLoadBalancerAttributesInput,
    output: DescribeLoadBalancerAttributesOutput,
    errors: [LoadBalancerNotFoundException],
  }));
/**
 * Describes the attributes for the specified target group.
 *
 * For more information, see the following:
 *
 * - Target group attributes in the Application Load Balancers
 * Guide
 *
 * - Target group attributes in the Network Load Balancers
 * Guide
 *
 * - Target group attributes in the Gateway Load Balancers
 * Guide
 */
export const describeTargetGroupAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeTargetGroupAttributesInput,
    output: DescribeTargetGroupAttributesOutput,
    errors: [TargetGroupNotFoundException],
  }));
/**
 * Describes all trust stores for the specified account.
 */
export const describeTrustStores = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTrustStoresInput,
  output: DescribeTrustStoresOutput,
  errors: [TrustStoreNotFoundException],
}));
/**
 * Retrieves the ca certificate bundle.
 *
 * This action returns a pre-signed S3 URI which is
 * active for ten minutes.
 */
export const getTrustStoreCaCertificatesBundle =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTrustStoreCaCertificatesBundleInput,
    output: GetTrustStoreCaCertificatesBundleOutput,
    errors: [TrustStoreNotFoundException],
  }));
/**
 * Retrieves the specified revocation file.
 *
 * This action returns a pre-signed S3 URI which is
 * active for ten minutes.
 */
export const getTrustStoreRevocationContent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTrustStoreRevocationContentInput,
    output: GetTrustStoreRevocationContentOutput,
    errors: [RevocationIdNotFoundException, TrustStoreNotFoundException],
  }));
/**
 * [Application Load Balancers] Modify the IP pool associated to a load balancer.
 */
export const modifyIpPools = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyIpPoolsInput,
  output: ModifyIpPoolsOutput,
  errors: [LoadBalancerNotFoundException],
}));
/**
 * Removes the specified revocation file from the specified trust store.
 */
export const removeTrustStoreRevocations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveTrustStoreRevocationsInput,
    output: RemoveTrustStoreRevocationsOutput,
    errors: [RevocationIdNotFoundException, TrustStoreNotFoundException],
  }),
);
/**
 * Adds the specified tags to the specified Elastic Load Balancing resource. You can tag your
 * Application Load Balancers, Network Load Balancers, Gateway Load Balancers, target groups,
 * trust stores, listeners, and rules.
 *
 * Each tag consists of a key and an optional value. If a resource already has a tag with the
 * same key, `AddTags` updates its value.
 */
export const addTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsInput,
  output: AddTagsOutput,
  errors: [
    DuplicateTagKeysException,
    ListenerNotFoundException,
    LoadBalancerNotFoundException,
    RuleNotFoundException,
    TargetGroupNotFoundException,
    TooManyTagsException,
    TrustStoreNotFoundException,
  ],
}));
/**
 * Deletes a shared trust store association.
 */
export const deleteSharedTrustStoreAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteSharedTrustStoreAssociationInput,
    output: DeleteSharedTrustStoreAssociationOutput,
    errors: [
      DeleteAssociationSameAccountException,
      TrustStoreAssociationNotFoundException,
      TrustStoreNotFoundException,
    ],
  }));
/**
 * Deletes a trust store.
 */
export const deleteTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrustStoreInput,
  output: DeleteTrustStoreOutput,
  errors: [TrustStoreInUseException, TrustStoreNotFoundException],
}));
/**
 * Deregisters the specified targets from the specified target group. After the targets are
 * deregistered, they no longer receive traffic from the load balancer.
 *
 * The load balancer stops sending requests to targets that are deregistering, but uses
 * connection draining to ensure that in-flight traffic completes on the existing connections.
 * This deregistration delay is configured by default but can be updated for each target group.
 *
 * For more information, see the following:
 *
 * -
 * Deregistration delay in the *Application Load Balancers User Guide*
 *
 * -
 * Deregistration delay in the *Network Load Balancers User Guide*
 *
 * -
 * Deregistration delay in the *Gateway Load Balancers User Guide*
 *
 * Note: If the specified target does not exist, the action returns successfully.
 */
export const deregisterTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterTargetsInput,
  output: DeregisterTargetsOutput,
  errors: [InvalidTargetException, TargetGroupNotFoundException],
}));
/**
 * Describes the current Elastic Load Balancing resource limits for your Amazon Web Services
 * account.
 *
 * For more information, see the following:
 *
 * - Quotas for your
 * Application Load Balancers
 *
 * - Quotas for your
 * Network Load Balancers
 *
 * - Quotas for your Gateway
 * Load Balancers
 */
export const describeAccountLimits = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountLimitsInput,
    output: DescribeAccountLimitsOutput,
    errors: [],
  }),
);
/**
 * Describes the specified rules or the rules for the specified listener. You must specify
 * either a listener or rules.
 */
export const describeRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRulesInput,
  output: DescribeRulesOutput,
  errors: [
    ListenerNotFoundException,
    RuleNotFoundException,
    UnsupportedProtocolException,
  ],
}));
/**
 * Describes the tags for the specified Elastic Load Balancing resources. You can describe
 * the tags for one or more Application Load Balancers, Network Load Balancers, Gateway Load
 * Balancers, target groups, listeners, or rules.
 */
export const describeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTagsInput,
  output: DescribeTagsOutput,
  errors: [
    ListenerNotFoundException,
    LoadBalancerNotFoundException,
    RuleNotFoundException,
    TargetGroupNotFoundException,
    TrustStoreNotFoundException,
  ],
}));
/**
 * Describes the specified target groups or all of your target groups. By default, all target
 * groups are described. Alternatively, you can specify one of the following to filter the
 * results: the ARN of the load balancer, the names of one or more target groups, or the ARNs of
 * one or more target groups.
 */
export const describeTargetGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTargetGroupsInput,
    output: DescribeTargetGroupsOutput,
    errors: [LoadBalancerNotFoundException, TargetGroupNotFoundException],
  }),
);
/**
 * Describes all resources associated with the specified trust store.
 */
export const describeTrustStoreAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeTrustStoreAssociationsInput,
    output: DescribeTrustStoreAssociationsOutput,
    errors: [TrustStoreNotFoundException],
  }));
/**
 * Describes the revocation files in use by the specified trust store or revocation
 * files.
 */
export const describeTrustStoreRevocations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeTrustStoreRevocationsInput,
    output: DescribeTrustStoreRevocationsOutput,
    errors: [RevocationIdNotFoundException, TrustStoreNotFoundException],
  }));
/**
 * Retrieves the resource policy for a specified resource.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyInput,
  output: GetResourcePolicyOutput,
  errors: [ResourceNotFoundException],
}));
/**
 * Modifies the specified attributes of the specified listener.
 */
export const modifyListenerAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyListenerAttributesInput,
    output: ModifyListenerAttributesOutput,
    errors: [InvalidConfigurationRequestException, ListenerNotFoundException],
  }),
);
/**
 * Modifies the specified attributes of the specified Application Load Balancer, Network Load
 * Balancer, or Gateway Load Balancer.
 *
 * If any of the specified attributes can't be modified as requested, the call fails. Any
 * existing attributes that you do not modify retain their current values.
 */
export const modifyLoadBalancerAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyLoadBalancerAttributesInput,
    output: ModifyLoadBalancerAttributesOutput,
    errors: [
      InvalidConfigurationRequestException,
      LoadBalancerNotFoundException,
    ],
  }));
/**
 * Modifies the health checks used when evaluating the health state of the targets in the
 * specified target group.
 */
export const modifyTargetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyTargetGroupInput,
  output: ModifyTargetGroupOutput,
  errors: [InvalidConfigurationRequestException, TargetGroupNotFoundException],
}));
/**
 * Modifies the specified attributes of the specified target group.
 */
export const modifyTargetGroupAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyTargetGroupAttributesInput,
    output: ModifyTargetGroupAttributesOutput,
    errors: [
      InvalidConfigurationRequestException,
      TargetGroupNotFoundException,
    ],
  }),
);
/**
 * Removes the specified tags from the specified Elastic Load Balancing resources. You can
 * remove the tags for one or more Application Load Balancers, Network Load Balancers, Gateway
 * Load Balancers, target groups, listeners, or rules.
 */
export const removeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsInput,
  output: RemoveTagsOutput,
  errors: [
    ListenerNotFoundException,
    LoadBalancerNotFoundException,
    RuleNotFoundException,
    TargetGroupNotFoundException,
    TooManyTagsException,
    TrustStoreNotFoundException,
  ],
}));
/**
 * Sets the type of IP addresses used by the subnets of the specified load balancer.
 */
export const setIpAddressType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetIpAddressTypeInput,
  output: SetIpAddressTypeOutput,
  errors: [
    InvalidConfigurationRequestException,
    InvalidSubnetException,
    LoadBalancerNotFoundException,
  ],
}));
/**
 * Associates the specified security groups with the specified Application Load Balancer or
 * Network Load Balancer. The specified security groups override the previously associated
 * security groups.
 *
 * You can't perform this operation on a Network Load Balancer unless you specified a
 * security group for the load balancer when you created it.
 *
 * You can't associate a security group with a Gateway Load Balancer.
 */
export const setSecurityGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetSecurityGroupsInput,
  output: SetSecurityGroupsOutput,
  errors: [
    InvalidConfigurationRequestException,
    InvalidSecurityGroupException,
    LoadBalancerNotFoundException,
  ],
}));
/**
 * Describes the capacity reservation status for the specified load balancer.
 */
export const describeCapacityReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCapacityReservationInput,
    output: DescribeCapacityReservationOutput,
    errors: [LoadBalancerNotFoundException],
  }),
);
/**
 * Describes the specified listeners or the listeners for the specified Application Load
 * Balancer, Network Load Balancer, or Gateway Load Balancer. You must specify either a load
 * balancer or one or more listeners.
 */
export const describeListeners = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeListenersInput,
  output: DescribeListenersOutput,
  errors: [
    ListenerNotFoundException,
    LoadBalancerNotFoundException,
    UnsupportedProtocolException,
  ],
}));
/**
 * Describes the specified load balancers or all of your load balancers.
 */
export const describeLoadBalancers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLoadBalancersInput,
    output: DescribeLoadBalancersOutput,
    errors: [LoadBalancerNotFoundException],
  }),
);
/**
 * Update the ca certificate bundle for the specified trust store.
 */
export const modifyTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyTrustStoreInput,
  output: ModifyTrustStoreOutput,
  errors: [
    CaCertificatesBundleNotFoundException,
    InvalidCaCertificatesBundleException,
    TrustStoreNotFoundException,
  ],
}));
/**
 * Registers the specified targets with the specified target group.
 *
 * If the target is an EC2 instance, it must be in the `running` state when you
 * register it.
 *
 * By default, the load balancer routes requests to registered targets using the protocol and
 * port for the target group. Alternatively, you can override the port for a target when you
 * register it. You can register each EC2 instance or IP address with the same target group
 * multiple times using different ports.
 *
 * For more information, see the following:
 *
 * - Register
 * targets for your Application Load Balancer
 *
 * - Register targets
 * for your Network Load Balancer
 *
 * - Register targets for your
 * Gateway Load Balancer
 */
export const registerTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterTargetsInput,
  output: RegisterTargetsOutput,
  errors: [
    InvalidTargetException,
    TargetGroupNotFoundException,
    TooManyRegistrationsForTargetIdException,
    TooManyTargetsException,
  ],
}));
/**
 * Sets the priorities of the specified rules.
 *
 * You can reorder the rules as long as there are no priority conflicts in the new order. Any
 * existing rules that you do not specify retain their current priority.
 */
export const setRulePriorities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetRulePrioritiesInput,
  output: SetRulePrioritiesOutput,
  errors: [
    OperationNotPermittedException,
    PriorityInUseException,
    RuleNotFoundException,
  ],
}));
/**
 * Adds the specified SSL server certificate to the certificate list for the specified HTTPS
 * or TLS listener.
 *
 * If the certificate in already in the certificate list, the call is successful but the
 * certificate is not added again.
 *
 * For more information, see SSL
 * certificates in the *Application Load Balancers Guide* or Server
 * certificates in the *Network Load Balancers Guide*.
 */
export const addListenerCertificates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddListenerCertificatesInput,
    output: AddListenerCertificatesOutput,
    errors: [
      CertificateNotFoundException,
      ListenerNotFoundException,
      TooManyCertificatesException,
    ],
  }),
);
/**
 * Creates a target group.
 *
 * For more information, see the following:
 *
 * - Target
 * groups for your Application Load Balancers
 *
 * - Target groups
 * for your Network Load Balancers
 *
 * - Target groups for your
 * Gateway Load Balancers
 *
 * This operation is idempotent, which means that it completes at most one time. If you
 * attempt to create multiple target groups with the same settings, each call succeeds.
 */
export const createTargetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTargetGroupInput,
  output: CreateTargetGroupOutput,
  errors: [
    DuplicateTargetGroupNameException,
    InvalidConfigurationRequestException,
    TooManyTagsException,
    TooManyTargetGroupsException,
  ],
}));
/**
 * Creates a trust store.
 *
 * For more information, see Mutual TLS for Application Load Balancers.
 */
export const createTrustStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrustStoreInput,
  output: CreateTrustStoreOutput,
  errors: [
    CaCertificatesBundleNotFoundException,
    DuplicateTagKeysException,
    DuplicateTrustStoreNameException,
    InvalidCaCertificatesBundleException,
    TooManyTagsException,
    TooManyTrustStoresException,
  ],
}));
/**
 * Describes the specified policies or all policies used for SSL negotiation.
 *
 * For more information, see Security policies in the *Application Load Balancers Guide* and
 * Security policies in the *Network Load Balancers Guide*.
 */
export const describeSSLPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSSLPoliciesInput,
  output: DescribeSSLPoliciesOutput,
  errors: [SSLPolicyNotFoundException],
}));
/**
 * Describes the health of the specified targets or all of your targets.
 */
export const describeTargetHealth = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTargetHealthInput,
    output: DescribeTargetHealthOutput,
    errors: [
      HealthUnavailableException,
      InvalidTargetException,
      TargetGroupNotFoundException,
    ],
  }),
);
/**
 * Replaces the specified properties of the specified rule. Any properties that you do not
 * specify are unchanged.
 *
 * To add an item to a list, remove an item from a list, or update an item in a list, you
 * must provide the entire list. For example, to add an action, specify a list with the current
 * actions plus the new action.
 */
export const modifyRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyRuleInput,
  output: ModifyRuleOutput,
  errors: [
    IncompatibleProtocolsException,
    InvalidLoadBalancerActionException,
    OperationNotPermittedException,
    RuleNotFoundException,
    TargetGroupAssociationLimitException,
    TargetGroupNotFoundException,
    TooManyActionsException,
    TooManyRegistrationsForTargetIdException,
    TooManyTargetsException,
    TooManyUniqueTargetGroupsPerLoadBalancerException,
    UnsupportedProtocolException,
  ],
}));
/**
 * Enables the Availability Zones for the specified public subnets for the specified
 * Application Load Balancer, Network Load Balancer or Gateway Load Balancer. The specified subnets
 * replace the previously enabled subnets.
 */
export const setSubnets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetSubnetsInput,
  output: SetSubnetsOutput,
  errors: [
    AllocationIdNotFoundException,
    AvailabilityZoneNotSupportedException,
    CapacityReservationPendingException,
    InvalidConfigurationRequestException,
    InvalidSubnetException,
    LoadBalancerNotFoundException,
    SubnetNotFoundException,
  ],
}));
/**
 * Creates a rule for the specified listener. The listener must be associated with an
 * Application Load Balancer.
 *
 * Each rule consists of a priority, one or more actions, one or more conditions, and
 * up to two optional transforms. Rules are evaluated in priority order, from the lowest value
 * to the highest value. When the conditions for a rule are met, its actions are performed.
 * If the conditions for no rules are met, the actions for the default rule are performed.
 * For more information, see Listener rules in the *Application Load Balancers Guide*.
 */
export const createRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleInput,
  output: CreateRuleOutput,
  errors: [
    IncompatibleProtocolsException,
    InvalidConfigurationRequestException,
    InvalidLoadBalancerActionException,
    ListenerNotFoundException,
    PriorityInUseException,
    TargetGroupAssociationLimitException,
    TargetGroupNotFoundException,
    TooManyActionsException,
    TooManyRegistrationsForTargetIdException,
    TooManyRulesException,
    TooManyTagsException,
    TooManyTargetGroupsException,
    TooManyTargetsException,
    TooManyUniqueTargetGroupsPerLoadBalancerException,
    UnsupportedProtocolException,
  ],
}));
/**
 * Replaces the specified properties of the specified listener. Any properties that you do
 * not specify remain unchanged.
 *
 * Changing the protocol from HTTPS to HTTP, or from TLS to TCP, removes the security policy
 * and default certificate properties. If you change the protocol from HTTP to HTTPS, or from TCP
 * to TLS, you must add the security policy and default certificate properties.
 *
 * To add an item to a list, remove an item from a list, or update an item in a list, you
 * must provide the entire list. For example, to add an action, specify a list with the current
 * actions plus the new action.
 */
export const modifyListener = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyListenerInput,
  output: ModifyListenerOutput,
  errors: [
    ALPNPolicyNotSupportedException,
    CertificateNotFoundException,
    DuplicateListenerException,
    IncompatibleProtocolsException,
    InvalidConfigurationRequestException,
    InvalidLoadBalancerActionException,
    ListenerNotFoundException,
    SSLPolicyNotFoundException,
    TargetGroupAssociationLimitException,
    TargetGroupNotFoundException,
    TooManyActionsException,
    TooManyCertificatesException,
    TooManyListenersException,
    TooManyRegistrationsForTargetIdException,
    TooManyTargetsException,
    TooManyUniqueTargetGroupsPerLoadBalancerException,
    TrustStoreNotFoundException,
    TrustStoreNotReadyException,
    UnsupportedProtocolException,
  ],
}));
/**
 * Adds the specified revocation file to the specified trust store.
 */
export const addTrustStoreRevocations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddTrustStoreRevocationsInput,
    output: AddTrustStoreRevocationsOutput,
    errors: [
      InvalidRevocationContentException,
      RevocationContentNotFoundException,
      TooManyTrustStoreRevocationEntriesException,
      TrustStoreNotFoundException,
    ],
  }),
);
/**
 * Creates a listener for the specified Application Load Balancer, Network Load Balancer, or
 * Gateway Load Balancer.
 *
 * For more information, see the following:
 *
 * - Listeners for
 * your Application Load Balancers
 *
 * - Listeners for
 * your Network Load Balancers
 *
 * - Listeners for your
 * Gateway Load Balancers
 *
 * This operation is idempotent, which means that it completes at most one time. If you
 * attempt to create multiple listeners with the same settings, each call succeeds.
 */
export const createListener = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateListenerInput,
  output: CreateListenerOutput,
  errors: [
    ALPNPolicyNotSupportedException,
    CertificateNotFoundException,
    DuplicateListenerException,
    IncompatibleProtocolsException,
    InvalidConfigurationRequestException,
    InvalidLoadBalancerActionException,
    LoadBalancerNotFoundException,
    SSLPolicyNotFoundException,
    TargetGroupAssociationLimitException,
    TargetGroupNotFoundException,
    TooManyActionsException,
    TooManyCertificatesException,
    TooManyListenersException,
    TooManyRegistrationsForTargetIdException,
    TooManyTagsException,
    TooManyTargetsException,
    TooManyUniqueTargetGroupsPerLoadBalancerException,
    TrustStoreNotFoundException,
    TrustStoreNotReadyException,
    UnsupportedProtocolException,
  ],
}));
/**
 * Creates an Application Load Balancer, Network Load Balancer, or Gateway Load
 * Balancer.
 *
 * For more information, see the following:
 *
 * - Application Load Balancers
 *
 * - Network Load
 * Balancers
 *
 * - Gateway Load
 * Balancers
 *
 * This operation is idempotent, which means that it completes at most one time. If you
 * attempt to create multiple load balancers with the same settings, each call succeeds.
 */
export const createLoadBalancer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLoadBalancerInput,
  output: CreateLoadBalancerOutput,
  errors: [
    AllocationIdNotFoundException,
    AvailabilityZoneNotSupportedException,
    DuplicateLoadBalancerNameException,
    DuplicateTagKeysException,
    InvalidConfigurationRequestException,
    InvalidSchemeException,
    InvalidSecurityGroupException,
    InvalidSubnetException,
    OperationNotPermittedException,
    ResourceInUseException,
    SubnetNotFoundException,
    TooManyLoadBalancersException,
    TooManyTagsException,
  ],
}));
/**
 * Modifies the capacity reservation of the specified load balancer.
 *
 * When modifying capacity reservation, you must include at least one `MinimumLoadBalancerCapacity`
 * or `ResetCapacityReservation`.
 */
export const modifyCapacityReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyCapacityReservationInput,
    output: ModifyCapacityReservationOutput,
    errors: [
      CapacityDecreaseRequestsLimitExceededException,
      CapacityReservationPendingException,
      CapacityUnitsLimitExceededException,
      InsufficientCapacityException,
      InvalidConfigurationRequestException,
      LoadBalancerNotFoundException,
      OperationNotPermittedException,
      PriorRequestNotCompleteException,
    ],
  }),
);

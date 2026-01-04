import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace(
  "http://elasticloadbalancing.amazonaws.com/doc/2012-06-01/",
);
const svc = T.AwsApiService({
  sdkId: "Elastic Load Balancing",
  serviceShapeName: "ElasticLoadBalancing_v7",
});
const auth = T.AwsAuthSigv4({ name: "elasticloadbalancing" });
const ver = T.ServiceVersion("2012-06-01");
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
export const LoadBalancerNames = S.Array(S.String);
export const SecurityGroups = S.Array(S.String);
export const Subnets = S.Array(S.String);
export const AvailabilityZones = S.Array(S.String);
export const Ports = S.Array(S.Number);
export const PolicyNames = S.Array(S.String);
export const PolicyTypeNames = S.Array(S.String);
export const LoadBalancerNamesMax20 = S.Array(S.String);
export class ApplySecurityGroupsToLoadBalancerInput extends S.Class<ApplySecurityGroupsToLoadBalancerInput>(
  "ApplySecurityGroupsToLoadBalancerInput",
)(
  { LoadBalancerName: S.String, SecurityGroups: SecurityGroups },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachLoadBalancerToSubnetsInput extends S.Class<AttachLoadBalancerToSubnetsInput>(
  "AttachLoadBalancerToSubnetsInput",
)(
  { LoadBalancerName: S.String, Subnets: Subnets },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAppCookieStickinessPolicyInput extends S.Class<CreateAppCookieStickinessPolicyInput>(
  "CreateAppCookieStickinessPolicyInput",
)(
  { LoadBalancerName: S.String, PolicyName: S.String, CookieName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAppCookieStickinessPolicyOutput extends S.Class<CreateAppCookieStickinessPolicyOutput>(
  "CreateAppCookieStickinessPolicyOutput",
)({}, ns) {}
export class CreateLBCookieStickinessPolicyInput extends S.Class<CreateLBCookieStickinessPolicyInput>(
  "CreateLBCookieStickinessPolicyInput",
)(
  {
    LoadBalancerName: S.String,
    PolicyName: S.String,
    CookieExpirationPeriod: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLBCookieStickinessPolicyOutput extends S.Class<CreateLBCookieStickinessPolicyOutput>(
  "CreateLBCookieStickinessPolicyOutput",
)({}, ns) {}
export class Listener extends S.Class<Listener>("Listener")({
  Protocol: S.String,
  LoadBalancerPort: S.Number,
  InstanceProtocol: S.optional(S.String),
  InstancePort: S.Number,
  SSLCertificateId: S.optional(S.String),
}) {}
export const Listeners = S.Array(Listener);
export class CreateLoadBalancerListenerInput extends S.Class<CreateLoadBalancerListenerInput>(
  "CreateLoadBalancerListenerInput",
)(
  { LoadBalancerName: S.String, Listeners: Listeners },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLoadBalancerListenerOutput extends S.Class<CreateLoadBalancerListenerOutput>(
  "CreateLoadBalancerListenerOutput",
)({}, ns) {}
export class DeleteAccessPointInput extends S.Class<DeleteAccessPointInput>(
  "DeleteAccessPointInput",
)(
  { LoadBalancerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccessPointOutput extends S.Class<DeleteAccessPointOutput>(
  "DeleteAccessPointOutput",
)({}, ns) {}
export class DeleteLoadBalancerListenerInput extends S.Class<DeleteLoadBalancerListenerInput>(
  "DeleteLoadBalancerListenerInput",
)(
  { LoadBalancerName: S.String, LoadBalancerPorts: Ports },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLoadBalancerListenerOutput extends S.Class<DeleteLoadBalancerListenerOutput>(
  "DeleteLoadBalancerListenerOutput",
)({}, ns) {}
export class DeleteLoadBalancerPolicyInput extends S.Class<DeleteLoadBalancerPolicyInput>(
  "DeleteLoadBalancerPolicyInput",
)(
  { LoadBalancerName: S.String, PolicyName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLoadBalancerPolicyOutput extends S.Class<DeleteLoadBalancerPolicyOutput>(
  "DeleteLoadBalancerPolicyOutput",
)({}, ns) {}
export class DescribeAccountLimitsInput extends S.Class<DescribeAccountLimitsInput>(
  "DescribeAccountLimitsInput",
)(
  { Marker: S.optional(S.String), PageSize: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Instance extends S.Class<Instance>("Instance")({
  InstanceId: S.optional(S.String),
}) {}
export const Instances = S.Array(Instance);
export class DescribeEndPointStateInput extends S.Class<DescribeEndPointStateInput>(
  "DescribeEndPointStateInput",
)(
  { LoadBalancerName: S.String, Instances: S.optional(Instances) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLoadBalancerAttributesInput extends S.Class<DescribeLoadBalancerAttributesInput>(
  "DescribeLoadBalancerAttributesInput",
)(
  { LoadBalancerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLoadBalancerPoliciesInput extends S.Class<DescribeLoadBalancerPoliciesInput>(
  "DescribeLoadBalancerPoliciesInput",
)(
  {
    LoadBalancerName: S.optional(S.String),
    PolicyNames: S.optional(PolicyNames),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLoadBalancerPolicyTypesInput extends S.Class<DescribeLoadBalancerPolicyTypesInput>(
  "DescribeLoadBalancerPolicyTypesInput",
)(
  { PolicyTypeNames: S.optional(PolicyTypeNames) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAccessPointsInput extends S.Class<DescribeAccessPointsInput>(
  "DescribeAccessPointsInput",
)(
  {
    LoadBalancerNames: S.optional(LoadBalancerNames),
    Marker: S.optional(S.String),
    PageSize: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTagsInput extends S.Class<DescribeTagsInput>(
  "DescribeTagsInput",
)(
  { LoadBalancerNames: LoadBalancerNamesMax20 },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachLoadBalancerFromSubnetsInput extends S.Class<DetachLoadBalancerFromSubnetsInput>(
  "DetachLoadBalancerFromSubnetsInput",
)(
  { LoadBalancerName: S.String, Subnets: Subnets },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveAvailabilityZonesInput extends S.Class<RemoveAvailabilityZonesInput>(
  "RemoveAvailabilityZonesInput",
)(
  { LoadBalancerName: S.String, AvailabilityZones: AvailabilityZones },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddAvailabilityZonesInput extends S.Class<AddAvailabilityZonesInput>(
  "AddAvailabilityZonesInput",
)(
  { LoadBalancerName: S.String, AvailabilityZones: AvailabilityZones },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterEndPointsInput extends S.Class<RegisterEndPointsInput>(
  "RegisterEndPointsInput",
)(
  { LoadBalancerName: S.String, Instances: Instances },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetLoadBalancerListenerSSLCertificateInput extends S.Class<SetLoadBalancerListenerSSLCertificateInput>(
  "SetLoadBalancerListenerSSLCertificateInput",
)(
  {
    LoadBalancerName: S.String,
    LoadBalancerPort: S.Number,
    SSLCertificateId: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetLoadBalancerListenerSSLCertificateOutput extends S.Class<SetLoadBalancerListenerSSLCertificateOutput>(
  "SetLoadBalancerListenerSSLCertificateOutput",
)({}, ns) {}
export class SetLoadBalancerPoliciesForBackendServerInput extends S.Class<SetLoadBalancerPoliciesForBackendServerInput>(
  "SetLoadBalancerPoliciesForBackendServerInput",
)(
  {
    LoadBalancerName: S.String,
    InstancePort: S.Number,
    PolicyNames: PolicyNames,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetLoadBalancerPoliciesForBackendServerOutput extends S.Class<SetLoadBalancerPoliciesForBackendServerOutput>(
  "SetLoadBalancerPoliciesForBackendServerOutput",
)({}, ns) {}
export class SetLoadBalancerPoliciesOfListenerInput extends S.Class<SetLoadBalancerPoliciesOfListenerInput>(
  "SetLoadBalancerPoliciesOfListenerInput",
)(
  {
    LoadBalancerName: S.String,
    LoadBalancerPort: S.Number,
    PolicyNames: PolicyNames,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetLoadBalancerPoliciesOfListenerOutput extends S.Class<SetLoadBalancerPoliciesOfListenerOutput>(
  "SetLoadBalancerPoliciesOfListenerOutput",
)({}, ns) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class HealthCheck extends S.Class<HealthCheck>("HealthCheck")({
  Target: S.String,
  Interval: S.Number,
  Timeout: S.Number,
  UnhealthyThreshold: S.Number,
  HealthyThreshold: S.Number,
}) {}
export class PolicyAttribute extends S.Class<PolicyAttribute>(
  "PolicyAttribute",
)({
  AttributeName: S.optional(S.String),
  AttributeValue: S.optional(S.String),
}) {}
export const PolicyAttributes = S.Array(PolicyAttribute);
export class TagKeyOnly extends S.Class<TagKeyOnly>("TagKeyOnly")({
  Key: S.optional(S.String),
}) {}
export const TagKeyList = S.Array(TagKeyOnly);
export class AddTagsInput extends S.Class<AddTagsInput>("AddTagsInput")(
  { LoadBalancerNames: LoadBalancerNames, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddTagsOutput extends S.Class<AddTagsOutput>("AddTagsOutput")(
  {},
  ns,
) {}
export class ApplySecurityGroupsToLoadBalancerOutput extends S.Class<ApplySecurityGroupsToLoadBalancerOutput>(
  "ApplySecurityGroupsToLoadBalancerOutput",
)({ SecurityGroups: S.optional(SecurityGroups) }, ns) {}
export class AttachLoadBalancerToSubnetsOutput extends S.Class<AttachLoadBalancerToSubnetsOutput>(
  "AttachLoadBalancerToSubnetsOutput",
)({ Subnets: S.optional(Subnets) }, ns) {}
export class ConfigureHealthCheckInput extends S.Class<ConfigureHealthCheckInput>(
  "ConfigureHealthCheckInput",
)(
  { LoadBalancerName: S.String, HealthCheck: HealthCheck },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAccessPointInput extends S.Class<CreateAccessPointInput>(
  "CreateAccessPointInput",
)(
  {
    LoadBalancerName: S.String,
    Listeners: Listeners,
    AvailabilityZones: S.optional(AvailabilityZones),
    Subnets: S.optional(Subnets),
    SecurityGroups: S.optional(SecurityGroups),
    Scheme: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLoadBalancerPolicyInput extends S.Class<CreateLoadBalancerPolicyInput>(
  "CreateLoadBalancerPolicyInput",
)(
  {
    LoadBalancerName: S.String,
    PolicyName: S.String,
    PolicyTypeName: S.String,
    PolicyAttributes: S.optional(PolicyAttributes),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLoadBalancerPolicyOutput extends S.Class<CreateLoadBalancerPolicyOutput>(
  "CreateLoadBalancerPolicyOutput",
)({}, ns) {}
export class DeregisterEndPointsInput extends S.Class<DeregisterEndPointsInput>(
  "DeregisterEndPointsInput",
)(
  { LoadBalancerName: S.String, Instances: Instances },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CrossZoneLoadBalancing extends S.Class<CrossZoneLoadBalancing>(
  "CrossZoneLoadBalancing",
)({ Enabled: S.Boolean }) {}
export class AccessLog extends S.Class<AccessLog>("AccessLog")({
  Enabled: S.Boolean,
  S3BucketName: S.optional(S.String),
  EmitInterval: S.optional(S.Number),
  S3BucketPrefix: S.optional(S.String),
}) {}
export class ConnectionDraining extends S.Class<ConnectionDraining>(
  "ConnectionDraining",
)({ Enabled: S.Boolean, Timeout: S.optional(S.Number) }) {}
export class ConnectionSettings extends S.Class<ConnectionSettings>(
  "ConnectionSettings",
)({ IdleTimeout: S.Number }) {}
export class AdditionalAttribute extends S.Class<AdditionalAttribute>(
  "AdditionalAttribute",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AdditionalAttributes = S.Array(AdditionalAttribute);
export class LoadBalancerAttributes extends S.Class<LoadBalancerAttributes>(
  "LoadBalancerAttributes",
)({
  CrossZoneLoadBalancing: S.optional(CrossZoneLoadBalancing),
  AccessLog: S.optional(AccessLog),
  ConnectionDraining: S.optional(ConnectionDraining),
  ConnectionSettings: S.optional(ConnectionSettings),
  AdditionalAttributes: S.optional(AdditionalAttributes),
}) {}
export class DescribeLoadBalancerAttributesOutput extends S.Class<DescribeLoadBalancerAttributesOutput>(
  "DescribeLoadBalancerAttributesOutput",
)({ LoadBalancerAttributes: S.optional(LoadBalancerAttributes) }, ns) {}
export class DetachLoadBalancerFromSubnetsOutput extends S.Class<DetachLoadBalancerFromSubnetsOutput>(
  "DetachLoadBalancerFromSubnetsOutput",
)({ Subnets: S.optional(Subnets) }, ns) {}
export class RemoveAvailabilityZonesOutput extends S.Class<RemoveAvailabilityZonesOutput>(
  "RemoveAvailabilityZonesOutput",
)({ AvailabilityZones: S.optional(AvailabilityZones) }, ns) {}
export class AddAvailabilityZonesOutput extends S.Class<AddAvailabilityZonesOutput>(
  "AddAvailabilityZonesOutput",
)({ AvailabilityZones: S.optional(AvailabilityZones) }, ns) {}
export class RegisterEndPointsOutput extends S.Class<RegisterEndPointsOutput>(
  "RegisterEndPointsOutput",
)({ Instances: S.optional(Instances) }, ns) {}
export class RemoveTagsInput extends S.Class<RemoveTagsInput>(
  "RemoveTagsInput",
)(
  { LoadBalancerNames: LoadBalancerNames, Tags: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsOutput extends S.Class<RemoveTagsOutput>(
  "RemoveTagsOutput",
)({}, ns) {}
export class Limit extends S.Class<Limit>("Limit")({
  Name: S.optional(S.String),
  Max: S.optional(S.String),
}) {}
export const Limits = S.Array(Limit);
export class InstanceState extends S.Class<InstanceState>("InstanceState")({
  InstanceId: S.optional(S.String),
  State: S.optional(S.String),
  ReasonCode: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const InstanceStates = S.Array(InstanceState);
export class TagDescription extends S.Class<TagDescription>("TagDescription")({
  LoadBalancerName: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const TagDescriptions = S.Array(TagDescription);
export class ConfigureHealthCheckOutput extends S.Class<ConfigureHealthCheckOutput>(
  "ConfigureHealthCheckOutput",
)({ HealthCheck: S.optional(HealthCheck) }, ns) {}
export class CreateAccessPointOutput extends S.Class<CreateAccessPointOutput>(
  "CreateAccessPointOutput",
)({ DNSName: S.optional(S.String) }, ns) {}
export class DeregisterEndPointsOutput extends S.Class<DeregisterEndPointsOutput>(
  "DeregisterEndPointsOutput",
)({ Instances: S.optional(Instances) }, ns) {}
export class DescribeAccountLimitsOutput extends S.Class<DescribeAccountLimitsOutput>(
  "DescribeAccountLimitsOutput",
)({ Limits: S.optional(Limits), NextMarker: S.optional(S.String) }, ns) {}
export class DescribeEndPointStateOutput extends S.Class<DescribeEndPointStateOutput>(
  "DescribeEndPointStateOutput",
)({ InstanceStates: S.optional(InstanceStates) }, ns) {}
export class DescribeTagsOutput extends S.Class<DescribeTagsOutput>(
  "DescribeTagsOutput",
)({ TagDescriptions: S.optional(TagDescriptions) }, ns) {}
export class ModifyLoadBalancerAttributesInput extends S.Class<ModifyLoadBalancerAttributesInput>(
  "ModifyLoadBalancerAttributesInput",
)(
  {
    LoadBalancerName: S.String,
    LoadBalancerAttributes: LoadBalancerAttributes,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PolicyAttributeDescription extends S.Class<PolicyAttributeDescription>(
  "PolicyAttributeDescription",
)({
  AttributeName: S.optional(S.String),
  AttributeValue: S.optional(S.String),
}) {}
export const PolicyAttributeDescriptions = S.Array(PolicyAttributeDescription);
export class PolicyAttributeTypeDescription extends S.Class<PolicyAttributeTypeDescription>(
  "PolicyAttributeTypeDescription",
)({
  AttributeName: S.optional(S.String),
  AttributeType: S.optional(S.String),
  Description: S.optional(S.String),
  DefaultValue: S.optional(S.String),
  Cardinality: S.optional(S.String),
}) {}
export const PolicyAttributeTypeDescriptions = S.Array(
  PolicyAttributeTypeDescription,
);
export class ListenerDescription extends S.Class<ListenerDescription>(
  "ListenerDescription",
)({ Listener: S.optional(Listener), PolicyNames: S.optional(PolicyNames) }) {}
export const ListenerDescriptions = S.Array(ListenerDescription);
export class BackendServerDescription extends S.Class<BackendServerDescription>(
  "BackendServerDescription",
)({
  InstancePort: S.optional(S.Number),
  PolicyNames: S.optional(PolicyNames),
}) {}
export const BackendServerDescriptions = S.Array(BackendServerDescription);
export class SourceSecurityGroup extends S.Class<SourceSecurityGroup>(
  "SourceSecurityGroup",
)({ OwnerAlias: S.optional(S.String), GroupName: S.optional(S.String) }) {}
export class PolicyDescription extends S.Class<PolicyDescription>(
  "PolicyDescription",
)({
  PolicyName: S.optional(S.String),
  PolicyTypeName: S.optional(S.String),
  PolicyAttributeDescriptions: S.optional(PolicyAttributeDescriptions),
}) {}
export const PolicyDescriptions = S.Array(PolicyDescription);
export class PolicyTypeDescription extends S.Class<PolicyTypeDescription>(
  "PolicyTypeDescription",
)({
  PolicyTypeName: S.optional(S.String),
  Description: S.optional(S.String),
  PolicyAttributeTypeDescriptions: S.optional(PolicyAttributeTypeDescriptions),
}) {}
export const PolicyTypeDescriptions = S.Array(PolicyTypeDescription);
export class AppCookieStickinessPolicy extends S.Class<AppCookieStickinessPolicy>(
  "AppCookieStickinessPolicy",
)({ PolicyName: S.optional(S.String), CookieName: S.optional(S.String) }) {}
export const AppCookieStickinessPolicies = S.Array(AppCookieStickinessPolicy);
export class LBCookieStickinessPolicy extends S.Class<LBCookieStickinessPolicy>(
  "LBCookieStickinessPolicy",
)({
  PolicyName: S.optional(S.String),
  CookieExpirationPeriod: S.optional(S.Number),
}) {}
export const LBCookieStickinessPolicies = S.Array(LBCookieStickinessPolicy);
export class DescribeLoadBalancerPoliciesOutput extends S.Class<DescribeLoadBalancerPoliciesOutput>(
  "DescribeLoadBalancerPoliciesOutput",
)({ PolicyDescriptions: S.optional(PolicyDescriptions) }, ns) {}
export class DescribeLoadBalancerPolicyTypesOutput extends S.Class<DescribeLoadBalancerPolicyTypesOutput>(
  "DescribeLoadBalancerPolicyTypesOutput",
)({ PolicyTypeDescriptions: S.optional(PolicyTypeDescriptions) }, ns) {}
export class ModifyLoadBalancerAttributesOutput extends S.Class<ModifyLoadBalancerAttributesOutput>(
  "ModifyLoadBalancerAttributesOutput",
)(
  {
    LoadBalancerName: S.optional(S.String),
    LoadBalancerAttributes: S.optional(LoadBalancerAttributes),
  },
  ns,
) {}
export class Policies extends S.Class<Policies>("Policies")({
  AppCookieStickinessPolicies: S.optional(AppCookieStickinessPolicies),
  LBCookieStickinessPolicies: S.optional(LBCookieStickinessPolicies),
  OtherPolicies: S.optional(PolicyNames),
}) {}
export class LoadBalancerDescription extends S.Class<LoadBalancerDescription>(
  "LoadBalancerDescription",
)({
  LoadBalancerName: S.optional(S.String),
  DNSName: S.optional(S.String),
  CanonicalHostedZoneName: S.optional(S.String),
  CanonicalHostedZoneNameID: S.optional(S.String),
  ListenerDescriptions: S.optional(ListenerDescriptions),
  Policies: S.optional(Policies),
  BackendServerDescriptions: S.optional(BackendServerDescriptions),
  AvailabilityZones: S.optional(AvailabilityZones),
  Subnets: S.optional(Subnets),
  VPCId: S.optional(S.String),
  Instances: S.optional(Instances),
  HealthCheck: S.optional(HealthCheck),
  SourceSecurityGroup: S.optional(SourceSecurityGroup),
  SecurityGroups: S.optional(SecurityGroups),
  CreatedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Scheme: S.optional(S.String),
}) {}
export const LoadBalancerDescriptions = S.Array(LoadBalancerDescription);
export class DescribeAccessPointsOutput extends S.Class<DescribeAccessPointsOutput>(
  "DescribeAccessPointsOutput",
)(
  {
    LoadBalancerDescriptions: S.optional(LoadBalancerDescriptions),
    NextMarker: S.optional(S.String),
  },
  ns,
) {}

//# Errors
export class AccessPointNotFoundException extends S.TaggedError<AccessPointNotFoundException>()(
  "AccessPointNotFoundException",
  {},
  T.AwsQueryError({ code: "LoadBalancerNotFound", httpResponseCode: 400 }),
) {}
export class CertificateNotFoundException extends S.TaggedError<CertificateNotFoundException>()(
  "CertificateNotFoundException",
  {},
  T.AwsQueryError({ code: "CertificateNotFound", httpResponseCode: 400 }),
) {}
export class InvalidConfigurationRequestException extends S.TaggedError<InvalidConfigurationRequestException>()(
  "InvalidConfigurationRequestException",
  {},
  T.AwsQueryError({
    code: "InvalidConfigurationRequest",
    httpResponseCode: 409,
  }),
) {}
export class ListenerNotFoundException extends S.TaggedError<ListenerNotFoundException>()(
  "ListenerNotFoundException",
  {},
  T.AwsQueryError({ code: "ListenerNotFound", httpResponseCode: 400 }),
) {}
export class PolicyNotFoundException extends S.TaggedError<PolicyNotFoundException>()(
  "PolicyNotFoundException",
  {},
  T.AwsQueryError({ code: "PolicyNotFound", httpResponseCode: 400 }),
) {}
export class DuplicatePolicyNameException extends S.TaggedError<DuplicatePolicyNameException>()(
  "DuplicatePolicyNameException",
  {},
  T.AwsQueryError({ code: "DuplicatePolicyName", httpResponseCode: 400 }),
) {}
export class TooManyPoliciesException extends S.TaggedError<TooManyPoliciesException>()(
  "TooManyPoliciesException",
  {},
  T.AwsQueryError({ code: "TooManyPolicies", httpResponseCode: 400 }),
) {}
export class DuplicateTagKeysException extends S.TaggedError<DuplicateTagKeysException>()(
  "DuplicateTagKeysException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateTagKeys", httpResponseCode: 400 }),
) {}
export class InvalidSecurityGroupException extends S.TaggedError<InvalidSecurityGroupException>()(
  "InvalidSecurityGroupException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSecurityGroup", httpResponseCode: 400 }),
) {}
export class InvalidSubnetException extends S.TaggedError<InvalidSubnetException>()(
  "InvalidSubnetException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
) {}
export class DuplicateListenerException extends S.TaggedError<DuplicateListenerException>()(
  "DuplicateListenerException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateListener", httpResponseCode: 400 }),
) {}
export class UnsupportedProtocolException extends S.TaggedError<UnsupportedProtocolException>()(
  "UnsupportedProtocolException",
  {},
  T.AwsQueryError({ code: "UnsupportedProtocol", httpResponseCode: 400 }),
) {}
export class PolicyTypeNotFoundException extends S.TaggedError<PolicyTypeNotFoundException>()(
  "PolicyTypeNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "PolicyTypeNotFound", httpResponseCode: 400 }),
) {}
export class InvalidEndPointException extends S.TaggedError<InvalidEndPointException>()(
  "InvalidEndPointException",
  {},
  T.AwsQueryError({ code: "InvalidInstance", httpResponseCode: 400 }),
) {}
export class LoadBalancerAttributeNotFoundException extends S.TaggedError<LoadBalancerAttributeNotFoundException>()(
  "LoadBalancerAttributeNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "LoadBalancerAttributeNotFound",
    httpResponseCode: 400,
  }),
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyTags", httpResponseCode: 400 }),
) {}
export class SubnetNotFoundException extends S.TaggedError<SubnetNotFoundException>()(
  "SubnetNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetNotFound", httpResponseCode: 400 }),
) {}
export class DuplicateAccessPointNameException extends S.TaggedError<DuplicateAccessPointNameException>()(
  "DuplicateAccessPointNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateLoadBalancerName", httpResponseCode: 400 }),
) {}
export class InvalidSchemeException extends S.TaggedError<InvalidSchemeException>()(
  "InvalidSchemeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidScheme", httpResponseCode: 400 }),
) {}
export class OperationNotPermittedException extends S.TaggedError<OperationNotPermittedException>()(
  "OperationNotPermittedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "OperationNotPermitted", httpResponseCode: 400 }),
) {}
export class DependencyThrottleException extends S.TaggedError<DependencyThrottleException>()(
  "DependencyThrottleException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "DependencyThrottle", httpResponseCode: 400 }),
) {}
export class TooManyAccessPointsException extends S.TaggedError<TooManyAccessPointsException>()(
  "TooManyAccessPointsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyLoadBalancers", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * Deletes the specified load balancer.
 *
 * If you are attempting to recreate a load balancer, you must reconfigure all settings. The DNS name associated with a deleted load balancer are no longer usable. The name and associated DNS record of the deleted load balancer no longer exist and traffic sent to any of its IP addresses is no longer delivered to your instances.
 *
 * If the load balancer does not exist or has already been deleted, the call to
 * `DeleteLoadBalancer` still succeeds.
 */
export const deleteLoadBalancer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPointInput,
  output: DeleteAccessPointOutput,
  errors: [],
}));
/**
 * Deletes the specified listeners from the specified load balancer.
 */
export const deleteLoadBalancerListeners = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLoadBalancerListenerInput,
    output: DeleteLoadBalancerListenerOutput,
    errors: [AccessPointNotFoundException],
  }),
);
/**
 * Replaces the current set of policies for the specified load balancer port with the specified set of policies.
 *
 * To enable back-end server authentication, use SetLoadBalancerPoliciesForBackendServer.
 *
 * For more information about setting policies, see
 * Update the SSL Negotiation Configuration,
 * Duration-Based Session Stickiness, and
 * Application-Controlled Session Stickiness
 * in the *Classic Load Balancers Guide*.
 */
export const setLoadBalancerPoliciesOfListener =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetLoadBalancerPoliciesOfListenerInput,
    output: SetLoadBalancerPoliciesOfListenerOutput,
    errors: [
      AccessPointNotFoundException,
      InvalidConfigurationRequestException,
      ListenerNotFoundException,
      PolicyNotFoundException,
    ],
  }));
/**
 * Generates a stickiness policy with sticky session lifetimes controlled by the lifetime of the browser (user-agent) or a specified expiration period. This policy can be associated only with HTTP/HTTPS listeners.
 *
 * When a load balancer implements this policy, the load balancer uses a special cookie to track the instance for each request. When the load balancer receives a request, it first checks to see if this cookie is present in the request.
 * If so, the load balancer sends the request to the application server specified in the cookie. If not, the load balancer sends the request to a server that is chosen based on the existing load-balancing algorithm.
 *
 * A cookie is inserted into the response for binding subsequent requests from the same user to that server. The validity of the cookie is based on the cookie expiration time, which is specified in the policy configuration.
 *
 * For more information, see Duration-Based Session Stickiness
 * in the *Classic Load Balancers Guide*.
 */
export const createLBCookieStickinessPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateLBCookieStickinessPolicyInput,
    output: CreateLBCookieStickinessPolicyOutput,
    errors: [
      AccessPointNotFoundException,
      DuplicatePolicyNameException,
      InvalidConfigurationRequestException,
      TooManyPoliciesException,
    ],
  }));
/**
 * Deletes the specified policy from the specified load balancer. This policy must not be enabled for any listeners.
 */
export const deleteLoadBalancerPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLoadBalancerPolicyInput,
    output: DeleteLoadBalancerPolicyOutput,
    errors: [
      AccessPointNotFoundException,
      InvalidConfigurationRequestException,
    ],
  }),
);
/**
 * Removes the specified subnets from the set of configured subnets for the load balancer.
 *
 * After a subnet is removed, all EC2 instances registered with the load balancer
 * in the removed subnet go into the `OutOfService` state. Then,
 * the load balancer balances the traffic among the remaining routable subnets.
 */
export const detachLoadBalancerFromSubnets =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DetachLoadBalancerFromSubnetsInput,
    output: DetachLoadBalancerFromSubnetsOutput,
    errors: [
      AccessPointNotFoundException,
      InvalidConfigurationRequestException,
    ],
  }));
/**
 * Removes the specified Availability Zones from the set of Availability Zones for the specified load balancer
 * in EC2-Classic or a default VPC.
 *
 * For load balancers in a non-default VPC, use DetachLoadBalancerFromSubnets.
 *
 * There must be at least one Availability Zone registered with a load balancer at all times.
 * After an Availability Zone is removed, all instances registered with the load balancer that are in the removed
 * Availability Zone go into the `OutOfService` state. Then, the load balancer attempts to equally balance
 * the traffic among its remaining Availability Zones.
 *
 * For more information, see Add or Remove Availability Zones
 * in the *Classic Load Balancers Guide*.
 */
export const disableAvailabilityZonesForLoadBalancer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RemoveAvailabilityZonesInput,
    output: RemoveAvailabilityZonesOutput,
    errors: [
      AccessPointNotFoundException,
      InvalidConfigurationRequestException,
    ],
  }));
/**
 * Adds the specified Availability Zones to the set of Availability Zones for the specified load balancer
 * in EC2-Classic or a default VPC.
 *
 * For load balancers in a non-default VPC, use AttachLoadBalancerToSubnets.
 *
 * The load balancer evenly distributes requests across all its registered Availability Zones
 * that contain instances. For more information, see Add or Remove Availability Zones
 * in the *Classic Load Balancers Guide*.
 */
export const enableAvailabilityZonesForLoadBalancer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AddAvailabilityZonesInput,
    output: AddAvailabilityZonesOutput,
    errors: [AccessPointNotFoundException],
  }));
/**
 * Removes one or more tags from the specified load balancer.
 */
export const removeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsInput,
  output: RemoveTagsOutput,
  errors: [AccessPointNotFoundException],
}));
/**
 * Replaces the set of policies associated with the specified port on which the EC2 instance is listening with a new set of policies.
 * At this time, only the back-end server authentication policy type can be applied to the instance ports; this policy type is composed of multiple public key policies.
 *
 * Each time you use `SetLoadBalancerPoliciesForBackendServer` to enable the policies,
 * use the `PolicyNames` parameter to list the policies that you want to enable.
 *
 * You can use DescribeLoadBalancers or DescribeLoadBalancerPolicies to verify that the policy
 * is associated with the EC2 instance.
 *
 * For more information about enabling back-end instance authentication, see Configure Back-end Instance Authentication
 * in the *Classic Load Balancers Guide*. For more information about Proxy Protocol, see
 * Configure Proxy Protocol Support
 * in the *Classic Load Balancers Guide*.
 */
export const setLoadBalancerPoliciesForBackendServer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetLoadBalancerPoliciesForBackendServerInput,
    output: SetLoadBalancerPoliciesForBackendServerOutput,
    errors: [
      AccessPointNotFoundException,
      InvalidConfigurationRequestException,
      PolicyNotFoundException,
    ],
  }));
/**
 * Associates one or more security groups with your load balancer in a virtual private cloud (VPC). The specified security groups override the previously associated security groups.
 *
 * For more information, see Security Groups for Load Balancers in a VPC
 * in the *Classic Load Balancers Guide*.
 */
export const applySecurityGroupsToLoadBalancer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ApplySecurityGroupsToLoadBalancerInput,
    output: ApplySecurityGroupsToLoadBalancerOutput,
    errors: [
      AccessPointNotFoundException,
      InvalidConfigurationRequestException,
      InvalidSecurityGroupException,
    ],
  }));
/**
 * Specifies the health check settings to use when evaluating the health state of your EC2 instances.
 *
 * For more information, see Configure Health Checks for Your Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const configureHealthCheck = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ConfigureHealthCheckInput,
    output: ConfigureHealthCheckOutput,
    errors: [AccessPointNotFoundException],
  }),
);
/**
 * Generates a stickiness policy with sticky session lifetimes that follow that of an application-generated cookie. This policy can be associated only with HTTP/HTTPS listeners.
 *
 * This policy is similar to the policy created by CreateLBCookieStickinessPolicy,
 * except that the lifetime of the special Elastic Load Balancing cookie, `AWSELB`,
 * follows the lifetime of the application-generated cookie specified in the policy configuration.
 * The load balancer only inserts a new stickiness cookie when the application response
 * includes a new application cookie.
 *
 * If the application cookie is explicitly removed or expires, the session stops being sticky until a new application cookie is issued.
 *
 * For more information, see Application-Controlled Session Stickiness
 * in the *Classic Load Balancers Guide*.
 */
export const createAppCookieStickinessPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateAppCookieStickinessPolicyInput,
    output: CreateAppCookieStickinessPolicyOutput,
    errors: [
      AccessPointNotFoundException,
      DuplicatePolicyNameException,
      InvalidConfigurationRequestException,
      TooManyPoliciesException,
    ],
  }));
/**
 * Creates one or more listeners for the specified load balancer. If a listener with the specified port does not already exist, it is created; otherwise, the properties of the new listener must match the properties of the existing listener.
 *
 * For more information, see Listeners for Your Classic Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const createLoadBalancerListeners = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLoadBalancerListenerInput,
    output: CreateLoadBalancerListenerOutput,
    errors: [
      AccessPointNotFoundException,
      CertificateNotFoundException,
      DuplicateListenerException,
      InvalidConfigurationRequestException,
      UnsupportedProtocolException,
    ],
  }),
);
/**
 * Creates a policy with the specified attributes for the specified load balancer.
 *
 * Policies are settings that are saved for your load balancer and that can be applied to the listener or the application server, depending on the policy type.
 */
export const createLoadBalancerPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLoadBalancerPolicyInput,
    output: CreateLoadBalancerPolicyOutput,
    errors: [
      AccessPointNotFoundException,
      DuplicatePolicyNameException,
      InvalidConfigurationRequestException,
      PolicyTypeNotFoundException,
      TooManyPoliciesException,
    ],
  }),
);
/**
 * Deregisters the specified instances from the specified load balancer. After the instance is deregistered, it no longer receives traffic from the load balancer.
 *
 * You can use DescribeLoadBalancers to verify that the instance is deregistered from the load balancer.
 *
 * For more information, see Register or De-Register EC2 Instances
 * in the *Classic Load Balancers Guide*.
 */
export const deregisterInstancesFromLoadBalancer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeregisterEndPointsInput,
    output: DeregisterEndPointsOutput,
    errors: [AccessPointNotFoundException, InvalidEndPointException],
  }));
/**
 * Describes the current Elastic Load Balancing resource limits for your AWS account.
 *
 * For more information, see Limits for Your Classic Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const describeAccountLimits = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountLimitsInput,
    output: DescribeAccountLimitsOutput,
    errors: [],
  }),
);
/**
 * Describes the state of the specified instances with respect to the specified load balancer. If no instances are specified, the call describes the state of all instances that are currently registered with the load balancer. If instances are specified, their state is returned even if they are no longer registered with the load balancer. The state of terminated instances is not returned.
 */
export const describeInstanceHealth = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEndPointStateInput,
    output: DescribeEndPointStateOutput,
    errors: [AccessPointNotFoundException, InvalidEndPointException],
  }),
);
/**
 * Describes the attributes for the specified load balancer.
 */
export const describeLoadBalancerAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeLoadBalancerAttributesInput,
    output: DescribeLoadBalancerAttributesOutput,
    errors: [
      AccessPointNotFoundException,
      LoadBalancerAttributeNotFoundException,
    ],
  }));
/**
 * Describes the tags associated with the specified load balancers.
 */
export const describeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTagsInput,
  output: DescribeTagsOutput,
  errors: [AccessPointNotFoundException],
}));
/**
 * Adds the specified instances to the specified load balancer.
 *
 * The instance must be a running instance in the same network as the load balancer (EC2-Classic or the same VPC). If you have EC2-Classic instances and a load balancer in a VPC with ClassicLink enabled, you can link the EC2-Classic instances to that VPC and then register the linked EC2-Classic instances with the load balancer in the VPC.
 *
 * Note that `RegisterInstanceWithLoadBalancer` completes when the request has been registered.
 * Instance registration takes a little time to complete. To check the state of the registered instances, use
 * DescribeLoadBalancers or DescribeInstanceHealth.
 *
 * After the instance is registered, it starts receiving traffic
 * and requests from the load balancer. Any instance that is not
 * in one of the Availability Zones registered for the load balancer
 * is moved to the `OutOfService` state. If an Availability Zone
 * is added to the load balancer later, any instances registered with the
 * load balancer move to the `InService` state.
 *
 * To deregister instances from a load balancer, use DeregisterInstancesFromLoadBalancer.
 *
 * For more information, see Register or De-Register EC2 Instances
 * in the *Classic Load Balancers Guide*.
 */
export const registerInstancesWithLoadBalancer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RegisterEndPointsInput,
    output: RegisterEndPointsOutput,
    errors: [AccessPointNotFoundException, InvalidEndPointException],
  }));
/**
 * Sets the certificate that terminates the specified listener's SSL connections. The specified certificate replaces any prior certificate that was used on the same load balancer and port.
 *
 * For more information about updating your SSL certificate, see
 * Replace the SSL Certificate for Your Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const setLoadBalancerListenerSSLCertificate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SetLoadBalancerListenerSSLCertificateInput,
    output: SetLoadBalancerListenerSSLCertificateOutput,
    errors: [
      AccessPointNotFoundException,
      CertificateNotFoundException,
      InvalidConfigurationRequestException,
      ListenerNotFoundException,
      UnsupportedProtocolException,
    ],
  }));
/**
 * Adds the specified tags to the specified load balancer. Each load balancer can have a maximum of 10 tags.
 *
 * Each tag consists of a key and an optional value. If a tag with the same key is already associated
 * with the load balancer, `AddTags` updates its value.
 *
 * For more information, see Tag Your Classic Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const addTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsInput,
  output: AddTagsOutput,
  errors: [
    AccessPointNotFoundException,
    DuplicateTagKeysException,
    TooManyTagsException,
  ],
}));
/**
 * Adds one or more subnets to the set of configured subnets for the specified load balancer.
 *
 * The load balancer evenly distributes requests across all registered subnets.
 * For more information, see Add or Remove Subnets for Your Load Balancer in a VPC
 * in the *Classic Load Balancers Guide*.
 */
export const attachLoadBalancerToSubnets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AttachLoadBalancerToSubnetsInput,
    output: AttachLoadBalancerToSubnetsOutput,
    errors: [
      AccessPointNotFoundException,
      InvalidConfigurationRequestException,
      InvalidSubnetException,
      SubnetNotFoundException,
    ],
  }),
);
/**
 * Describes the specified policies.
 *
 * If you specify a load balancer name, the action returns the descriptions of all policies created for the load balancer.
 * If you specify a policy name associated with your load balancer, the action returns the description of that policy.
 * If you don't specify a load balancer name, the action returns descriptions of the specified sample policies, or descriptions of all sample policies.
 * The names of the sample policies have the `ELBSample-` prefix.
 */
export const describeLoadBalancerPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeLoadBalancerPoliciesInput,
    output: DescribeLoadBalancerPoliciesOutput,
    errors: [AccessPointNotFoundException, PolicyNotFoundException],
  }));
/**
 * Describes the specified load balancer policy types or all load balancer policy types.
 *
 * The description of each type indicates how it can be used. For example,
 * some policies can be used only with layer 7 listeners,
 * some policies can be used only with layer 4 listeners,
 * and some policies can be used only with your EC2 instances.
 *
 * You can use CreateLoadBalancerPolicy to create a policy configuration for any of these policy types.
 * Then, depending on the policy type, use either SetLoadBalancerPoliciesOfListener or
 * SetLoadBalancerPoliciesForBackendServer to set the policy.
 */
export const describeLoadBalancerPolicyTypes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeLoadBalancerPolicyTypesInput,
    output: DescribeLoadBalancerPolicyTypesOutput,
    errors: [PolicyTypeNotFoundException],
  }));
/**
 * Modifies the attributes of the specified load balancer.
 *
 * You can modify the load balancer attributes, such as `AccessLogs`, `ConnectionDraining`, and
 * `CrossZoneLoadBalancing` by either enabling or disabling them. Or, you can modify the load balancer attribute
 * `ConnectionSettings` by specifying an idle connection timeout value for your load balancer.
 *
 * For more information, see the following in the *Classic Load Balancers Guide*:
 *
 * - Cross-Zone Load Balancing
 *
 * - Connection Draining
 *
 * - Access Logs
 *
 * - Idle Connection Timeout
 */
export const modifyLoadBalancerAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyLoadBalancerAttributesInput,
    output: ModifyLoadBalancerAttributesOutput,
    errors: [
      AccessPointNotFoundException,
      InvalidConfigurationRequestException,
      LoadBalancerAttributeNotFoundException,
    ],
  }));
/**
 * Describes the specified the load balancers. If no load balancers are specified, the call describes all of your load balancers.
 */
export const describeLoadBalancers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccessPointsInput,
    output: DescribeAccessPointsOutput,
    errors: [AccessPointNotFoundException, DependencyThrottleException],
  }),
);
/**
 * Creates a Classic Load Balancer.
 *
 * You can add listeners, security groups, subnets, and tags when you create your load balancer,
 * or you can add them later using CreateLoadBalancerListeners,
 * ApplySecurityGroupsToLoadBalancer, AttachLoadBalancerToSubnets,
 * and AddTags.
 *
 * To describe your current load balancers, see DescribeLoadBalancers.
 * When you are finished with a load balancer, you can delete it using
 * DeleteLoadBalancer.
 *
 * You can create up to 20 load balancers per region per account.
 * You can request an increase for the number of load balancers for your account.
 * For more information, see Limits for Your Classic Load Balancer
 * in the *Classic Load Balancers Guide*.
 */
export const createLoadBalancer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessPointInput,
  output: CreateAccessPointOutput,
  errors: [
    CertificateNotFoundException,
    DuplicateAccessPointNameException,
    DuplicateTagKeysException,
    InvalidConfigurationRequestException,
    InvalidSchemeException,
    InvalidSecurityGroupException,
    InvalidSubnetException,
    OperationNotPermittedException,
    SubnetNotFoundException,
    TooManyAccessPointsException,
    TooManyTagsException,
    UnsupportedProtocolException,
  ],
}));

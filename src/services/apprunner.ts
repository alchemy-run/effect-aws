import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://apprunner.amazonaws.com/doc/2020-05-15/");
const svc = T.AwsApiService({
  sdkId: "AppRunner",
  serviceShapeName: "AppRunner",
});
const auth = T.AwsAuthSigv4({ name: "apprunner" });
const ver = T.ServiceVersion("2020-05-15");
const proto = T.AwsProtocolsAwsJson1_0();
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
                        url: "https://apprunner-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://apprunner-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://apprunner.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://apprunner.{Region}.{PartitionResult#dnsSuffix}",
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
export const StringList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateCustomDomainRequest extends S.Class<AssociateCustomDomainRequest>(
  "AssociateCustomDomainRequest",
)(
  {
    ServiceArn: S.String,
    DomainName: S.String,
    EnableWWWSubdomain: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class CreateConnectionRequest extends S.Class<CreateConnectionRequest>(
  "CreateConnectionRequest",
)(
  {
    ConnectionName: S.String,
    ProviderType: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVpcConnectorRequest extends S.Class<CreateVpcConnectorRequest>(
  "CreateVpcConnectorRequest",
)(
  {
    VpcConnectorName: S.String,
    Subnets: StringList,
    SecurityGroups: S.optional(StringList),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAutoScalingConfigurationRequest extends S.Class<DeleteAutoScalingConfigurationRequest>(
  "DeleteAutoScalingConfigurationRequest",
)(
  {
    AutoScalingConfigurationArn: S.String,
    DeleteAllRevisions: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConnectionRequest extends S.Class<DeleteConnectionRequest>(
  "DeleteConnectionRequest",
)(
  { ConnectionArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteObservabilityConfigurationRequest extends S.Class<DeleteObservabilityConfigurationRequest>(
  "DeleteObservabilityConfigurationRequest",
)(
  { ObservabilityConfigurationArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceRequest extends S.Class<DeleteServiceRequest>(
  "DeleteServiceRequest",
)(
  { ServiceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVpcConnectorRequest extends S.Class<DeleteVpcConnectorRequest>(
  "DeleteVpcConnectorRequest",
)(
  { VpcConnectorArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVpcIngressConnectionRequest extends S.Class<DeleteVpcIngressConnectionRequest>(
  "DeleteVpcIngressConnectionRequest",
)(
  { VpcIngressConnectionArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAutoScalingConfigurationRequest extends S.Class<DescribeAutoScalingConfigurationRequest>(
  "DescribeAutoScalingConfigurationRequest",
)(
  { AutoScalingConfigurationArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCustomDomainsRequest extends S.Class<DescribeCustomDomainsRequest>(
  "DescribeCustomDomainsRequest",
)(
  {
    ServiceArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeObservabilityConfigurationRequest extends S.Class<DescribeObservabilityConfigurationRequest>(
  "DescribeObservabilityConfigurationRequest",
)(
  { ObservabilityConfigurationArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServiceRequest extends S.Class<DescribeServiceRequest>(
  "DescribeServiceRequest",
)(
  { ServiceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeVpcConnectorRequest extends S.Class<DescribeVpcConnectorRequest>(
  "DescribeVpcConnectorRequest",
)(
  { VpcConnectorArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeVpcIngressConnectionRequest extends S.Class<DescribeVpcIngressConnectionRequest>(
  "DescribeVpcIngressConnectionRequest",
)(
  { VpcIngressConnectionArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateCustomDomainRequest extends S.Class<DisassociateCustomDomainRequest>(
  "DisassociateCustomDomainRequest",
)(
  { ServiceArn: S.String, DomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAutoScalingConfigurationsRequest extends S.Class<ListAutoScalingConfigurationsRequest>(
  "ListAutoScalingConfigurationsRequest",
)(
  {
    AutoScalingConfigurationName: S.optional(S.String),
    LatestOnly: S.optional(S.Boolean),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConnectionsRequest extends S.Class<ListConnectionsRequest>(
  "ListConnectionsRequest",
)(
  {
    ConnectionName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListObservabilityConfigurationsRequest extends S.Class<ListObservabilityConfigurationsRequest>(
  "ListObservabilityConfigurationsRequest",
)(
  {
    ObservabilityConfigurationName: S.optional(S.String),
    LatestOnly: S.optional(S.Boolean),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOperationsRequest extends S.Class<ListOperationsRequest>(
  "ListOperationsRequest",
)(
  {
    ServiceArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServicesRequest extends S.Class<ListServicesRequest>(
  "ListServicesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServicesForAutoScalingConfigurationRequest extends S.Class<ListServicesForAutoScalingConfigurationRequest>(
  "ListServicesForAutoScalingConfigurationRequest",
)(
  {
    AutoScalingConfigurationArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListVpcConnectorsRequest extends S.Class<ListVpcConnectorsRequest>(
  "ListVpcConnectorsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PauseServiceRequest extends S.Class<PauseServiceRequest>(
  "PauseServiceRequest",
)(
  { ServiceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResumeServiceRequest extends S.Class<ResumeServiceRequest>(
  "ResumeServiceRequest",
)(
  { ServiceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDeploymentRequest extends S.Class<StartDeploymentRequest>(
  "StartDeploymentRequest",
)(
  { ServiceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
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
export class UpdateDefaultAutoScalingConfigurationRequest extends S.Class<UpdateDefaultAutoScalingConfigurationRequest>(
  "UpdateDefaultAutoScalingConfigurationRequest",
)(
  { AutoScalingConfigurationArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SourceCodeVersion extends S.Class<SourceCodeVersion>(
  "SourceCodeVersion",
)({ Type: S.String, Value: S.String }) {}
export const RuntimeEnvironmentVariables = S.Record({
  key: S.String,
  value: S.String,
});
export const RuntimeEnvironmentSecrets = S.Record({
  key: S.String,
  value: S.String,
});
export class CodeConfigurationValues extends S.Class<CodeConfigurationValues>(
  "CodeConfigurationValues",
)({
  Runtime: S.String,
  BuildCommand: S.optional(S.String),
  StartCommand: S.optional(S.String),
  Port: S.optional(S.String),
  RuntimeEnvironmentVariables: S.optional(RuntimeEnvironmentVariables),
  RuntimeEnvironmentSecrets: S.optional(RuntimeEnvironmentSecrets),
}) {}
export class CodeConfiguration extends S.Class<CodeConfiguration>(
  "CodeConfiguration",
)({
  ConfigurationSource: S.String,
  CodeConfigurationValues: S.optional(CodeConfigurationValues),
}) {}
export class CodeRepository extends S.Class<CodeRepository>("CodeRepository")({
  RepositoryUrl: S.String,
  SourceCodeVersion: SourceCodeVersion,
  CodeConfiguration: S.optional(CodeConfiguration),
  SourceDirectory: S.optional(S.String),
}) {}
export class ImageConfiguration extends S.Class<ImageConfiguration>(
  "ImageConfiguration",
)({
  RuntimeEnvironmentVariables: S.optional(RuntimeEnvironmentVariables),
  StartCommand: S.optional(S.String),
  Port: S.optional(S.String),
  RuntimeEnvironmentSecrets: S.optional(RuntimeEnvironmentSecrets),
}) {}
export class ImageRepository extends S.Class<ImageRepository>(
  "ImageRepository",
)({
  ImageIdentifier: S.String,
  ImageConfiguration: S.optional(ImageConfiguration),
  ImageRepositoryType: S.String,
}) {}
export class AuthenticationConfiguration extends S.Class<AuthenticationConfiguration>(
  "AuthenticationConfiguration",
)({
  ConnectionArn: S.optional(S.String),
  AccessRoleArn: S.optional(S.String),
}) {}
export class SourceConfiguration extends S.Class<SourceConfiguration>(
  "SourceConfiguration",
)({
  CodeRepository: S.optional(CodeRepository),
  ImageRepository: S.optional(ImageRepository),
  AutoDeploymentsEnabled: S.optional(S.Boolean),
  AuthenticationConfiguration: S.optional(AuthenticationConfiguration),
}) {}
export class InstanceConfiguration extends S.Class<InstanceConfiguration>(
  "InstanceConfiguration",
)({
  Cpu: S.optional(S.String),
  Memory: S.optional(S.String),
  InstanceRoleArn: S.optional(S.String),
}) {}
export class HealthCheckConfiguration extends S.Class<HealthCheckConfiguration>(
  "HealthCheckConfiguration",
)({
  Protocol: S.optional(S.String),
  Path: S.optional(S.String),
  Interval: S.optional(S.Number),
  Timeout: S.optional(S.Number),
  HealthyThreshold: S.optional(S.Number),
  UnhealthyThreshold: S.optional(S.Number),
}) {}
export class EgressConfiguration extends S.Class<EgressConfiguration>(
  "EgressConfiguration",
)({
  EgressType: S.optional(S.String),
  VpcConnectorArn: S.optional(S.String),
}) {}
export class IngressConfiguration extends S.Class<IngressConfiguration>(
  "IngressConfiguration",
)({ IsPubliclyAccessible: S.optional(S.Boolean) }) {}
export class NetworkConfiguration extends S.Class<NetworkConfiguration>(
  "NetworkConfiguration",
)({
  EgressConfiguration: S.optional(EgressConfiguration),
  IngressConfiguration: S.optional(IngressConfiguration),
  IpAddressType: S.optional(S.String),
}) {}
export class ServiceObservabilityConfiguration extends S.Class<ServiceObservabilityConfiguration>(
  "ServiceObservabilityConfiguration",
)({
  ObservabilityEnabled: S.Boolean,
  ObservabilityConfigurationArn: S.optional(S.String),
}) {}
export class UpdateServiceRequest extends S.Class<UpdateServiceRequest>(
  "UpdateServiceRequest",
)(
  {
    ServiceArn: S.String,
    SourceConfiguration: S.optional(SourceConfiguration),
    InstanceConfiguration: S.optional(InstanceConfiguration),
    AutoScalingConfigurationArn: S.optional(S.String),
    HealthCheckConfiguration: S.optional(HealthCheckConfiguration),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    ObservabilityConfiguration: S.optional(ServiceObservabilityConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IngressVpcConfiguration extends S.Class<IngressVpcConfiguration>(
  "IngressVpcConfiguration",
)({ VpcId: S.optional(S.String), VpcEndpointId: S.optional(S.String) }) {}
export class UpdateVpcIngressConnectionRequest extends S.Class<UpdateVpcIngressConnectionRequest>(
  "UpdateVpcIngressConnectionRequest",
)(
  {
    VpcIngressConnectionArn: S.String,
    IngressVpcConfiguration: IngressVpcConfiguration,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TraceConfiguration extends S.Class<TraceConfiguration>(
  "TraceConfiguration",
)({ Vendor: S.String }) {}
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({ KmsKey: S.String }) {}
export class CertificateValidationRecord extends S.Class<CertificateValidationRecord>(
  "CertificateValidationRecord",
)({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Value: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const CertificateValidationRecordList = S.Array(
  CertificateValidationRecord,
);
export class CustomDomain extends S.Class<CustomDomain>("CustomDomain")({
  DomainName: S.String,
  EnableWWWSubdomain: S.Boolean,
  CertificateValidationRecords: S.optional(CertificateValidationRecordList),
  Status: S.String,
}) {}
export const CustomDomainList = S.Array(CustomDomain);
export const ServiceArnList = S.Array(S.String);
export class VpcConnector extends S.Class<VpcConnector>("VpcConnector")({
  VpcConnectorName: S.optional(S.String),
  VpcConnectorArn: S.optional(S.String),
  VpcConnectorRevision: S.optional(S.Number),
  Subnets: S.optional(StringList),
  SecurityGroups: S.optional(StringList),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const VpcConnectors = S.Array(VpcConnector);
export class ListVpcIngressConnectionsFilter extends S.Class<ListVpcIngressConnectionsFilter>(
  "ListVpcIngressConnectionsFilter",
)({ ServiceArn: S.optional(S.String), VpcEndpointId: S.optional(S.String) }) {}
export class CreateAutoScalingConfigurationRequest extends S.Class<CreateAutoScalingConfigurationRequest>(
  "CreateAutoScalingConfigurationRequest",
)(
  {
    AutoScalingConfigurationName: S.String,
    MaxConcurrency: S.optional(S.Number),
    MinSize: S.optional(S.Number),
    MaxSize: S.optional(S.Number),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateObservabilityConfigurationRequest extends S.Class<CreateObservabilityConfigurationRequest>(
  "CreateObservabilityConfigurationRequest",
)(
  {
    ObservabilityConfigurationName: S.String,
    TraceConfiguration: S.optional(TraceConfiguration),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVpcIngressConnectionRequest extends S.Class<CreateVpcIngressConnectionRequest>(
  "CreateVpcIngressConnectionRequest",
)(
  {
    ServiceArn: S.String,
    VpcIngressConnectionName: S.String,
    IngressVpcConfiguration: IngressVpcConfiguration,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Connection extends S.Class<Connection>("Connection")({
  ConnectionName: S.optional(S.String),
  ConnectionArn: S.optional(S.String),
  ProviderType: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DeleteConnectionResponse extends S.Class<DeleteConnectionResponse>(
  "DeleteConnectionResponse",
)({ Connection: S.optional(Connection) }, ns) {}
export class DeleteVpcConnectorResponse extends S.Class<DeleteVpcConnectorResponse>(
  "DeleteVpcConnectorResponse",
)({ VpcConnector: VpcConnector }, ns) {}
export class AutoScalingConfiguration extends S.Class<AutoScalingConfiguration>(
  "AutoScalingConfiguration",
)({
  AutoScalingConfigurationArn: S.optional(S.String),
  AutoScalingConfigurationName: S.optional(S.String),
  AutoScalingConfigurationRevision: S.optional(S.Number),
  Latest: S.optional(S.Boolean),
  Status: S.optional(S.String),
  MaxConcurrency: S.optional(S.Number),
  MinSize: S.optional(S.Number),
  MaxSize: S.optional(S.Number),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HasAssociatedService: S.optional(S.Boolean),
  IsDefault: S.optional(S.Boolean),
}) {}
export class DescribeAutoScalingConfigurationResponse extends S.Class<DescribeAutoScalingConfigurationResponse>(
  "DescribeAutoScalingConfigurationResponse",
)({ AutoScalingConfiguration: AutoScalingConfiguration }, ns) {}
export class VpcDNSTarget extends S.Class<VpcDNSTarget>("VpcDNSTarget")({
  VpcIngressConnectionArn: S.optional(S.String),
  VpcId: S.optional(S.String),
  DomainName: S.optional(S.String),
}) {}
export const VpcDNSTargetList = S.Array(VpcDNSTarget);
export class DescribeCustomDomainsResponse extends S.Class<DescribeCustomDomainsResponse>(
  "DescribeCustomDomainsResponse",
)(
  {
    DNSTarget: S.String,
    ServiceArn: S.String,
    CustomDomains: CustomDomainList,
    VpcDNSTargets: VpcDNSTargetList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ObservabilityConfiguration extends S.Class<ObservabilityConfiguration>(
  "ObservabilityConfiguration",
)({
  ObservabilityConfigurationArn: S.optional(S.String),
  ObservabilityConfigurationName: S.optional(S.String),
  TraceConfiguration: S.optional(TraceConfiguration),
  ObservabilityConfigurationRevision: S.optional(S.Number),
  Latest: S.optional(S.Boolean),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeObservabilityConfigurationResponse extends S.Class<DescribeObservabilityConfigurationResponse>(
  "DescribeObservabilityConfigurationResponse",
)({ ObservabilityConfiguration: ObservabilityConfiguration }, ns) {}
export class AutoScalingConfigurationSummary extends S.Class<AutoScalingConfigurationSummary>(
  "AutoScalingConfigurationSummary",
)({
  AutoScalingConfigurationArn: S.optional(S.String),
  AutoScalingConfigurationName: S.optional(S.String),
  AutoScalingConfigurationRevision: S.optional(S.Number),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HasAssociatedService: S.optional(S.Boolean),
  IsDefault: S.optional(S.Boolean),
}) {}
export class Service extends S.Class<Service>("Service")({
  ServiceName: S.String,
  ServiceId: S.String,
  ServiceArn: S.String,
  ServiceUrl: S.optional(S.String),
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  DeletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.String,
  SourceConfiguration: SourceConfiguration,
  InstanceConfiguration: InstanceConfiguration,
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  HealthCheckConfiguration: S.optional(HealthCheckConfiguration),
  AutoScalingConfigurationSummary: AutoScalingConfigurationSummary,
  NetworkConfiguration: NetworkConfiguration,
  ObservabilityConfiguration: S.optional(ServiceObservabilityConfiguration),
}) {}
export class DescribeServiceResponse extends S.Class<DescribeServiceResponse>(
  "DescribeServiceResponse",
)({ Service: Service }, ns) {}
export class DescribeVpcConnectorResponse extends S.Class<DescribeVpcConnectorResponse>(
  "DescribeVpcConnectorResponse",
)({ VpcConnector: VpcConnector }, ns) {}
export class VpcIngressConnection extends S.Class<VpcIngressConnection>(
  "VpcIngressConnection",
)({
  VpcIngressConnectionArn: S.optional(S.String),
  VpcIngressConnectionName: S.optional(S.String),
  ServiceArn: S.optional(S.String),
  Status: S.optional(S.String),
  AccountId: S.optional(S.String),
  DomainName: S.optional(S.String),
  IngressVpcConfiguration: S.optional(IngressVpcConfiguration),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeVpcIngressConnectionResponse extends S.Class<DescribeVpcIngressConnectionResponse>(
  "DescribeVpcIngressConnectionResponse",
)({ VpcIngressConnection: VpcIngressConnection }, ns) {}
export class DisassociateCustomDomainResponse extends S.Class<DisassociateCustomDomainResponse>(
  "DisassociateCustomDomainResponse",
)(
  {
    DNSTarget: S.String,
    ServiceArn: S.String,
    CustomDomain: CustomDomain,
    VpcDNSTargets: VpcDNSTargetList,
  },
  ns,
) {}
export class ListServicesForAutoScalingConfigurationResponse extends S.Class<ListServicesForAutoScalingConfigurationResponse>(
  "ListServicesForAutoScalingConfigurationResponse",
)({ ServiceArnList: ServiceArnList, NextToken: S.optional(S.String) }, ns) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export class ListVpcConnectorsResponse extends S.Class<ListVpcConnectorsResponse>(
  "ListVpcConnectorsResponse",
)({ VpcConnectors: VpcConnectors, NextToken: S.optional(S.String) }, ns) {}
export class ListVpcIngressConnectionsRequest extends S.Class<ListVpcIngressConnectionsRequest>(
  "ListVpcIngressConnectionsRequest",
)(
  {
    Filter: S.optional(ListVpcIngressConnectionsFilter),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PauseServiceResponse extends S.Class<PauseServiceResponse>(
  "PauseServiceResponse",
)({ Service: Service, OperationId: S.optional(S.String) }, ns) {}
export class ResumeServiceResponse extends S.Class<ResumeServiceResponse>(
  "ResumeServiceResponse",
)({ Service: Service, OperationId: S.optional(S.String) }, ns) {}
export class StartDeploymentResponse extends S.Class<StartDeploymentResponse>(
  "StartDeploymentResponse",
)({ OperationId: S.String }, ns) {}
export class UpdateDefaultAutoScalingConfigurationResponse extends S.Class<UpdateDefaultAutoScalingConfigurationResponse>(
  "UpdateDefaultAutoScalingConfigurationResponse",
)({ AutoScalingConfiguration: AutoScalingConfiguration }, ns) {}
export class UpdateServiceResponse extends S.Class<UpdateServiceResponse>(
  "UpdateServiceResponse",
)({ Service: Service, OperationId: S.String }, ns) {}
export class UpdateVpcIngressConnectionResponse extends S.Class<UpdateVpcIngressConnectionResponse>(
  "UpdateVpcIngressConnectionResponse",
)({ VpcIngressConnection: VpcIngressConnection }, ns) {}
export const AutoScalingConfigurationSummaryList = S.Array(
  AutoScalingConfigurationSummary,
);
export class ConnectionSummary extends S.Class<ConnectionSummary>(
  "ConnectionSummary",
)({
  ConnectionName: S.optional(S.String),
  ConnectionArn: S.optional(S.String),
  ProviderType: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ConnectionSummaryList = S.Array(ConnectionSummary);
export class ObservabilityConfigurationSummary extends S.Class<ObservabilityConfigurationSummary>(
  "ObservabilityConfigurationSummary",
)({
  ObservabilityConfigurationArn: S.optional(S.String),
  ObservabilityConfigurationName: S.optional(S.String),
  ObservabilityConfigurationRevision: S.optional(S.Number),
}) {}
export const ObservabilityConfigurationSummaryList = S.Array(
  ObservabilityConfigurationSummary,
);
export class OperationSummary extends S.Class<OperationSummary>(
  "OperationSummary",
)({
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  Status: S.optional(S.String),
  TargetArn: S.optional(S.String),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OperationSummaryList = S.Array(OperationSummary);
export class ServiceSummary extends S.Class<ServiceSummary>("ServiceSummary")({
  ServiceName: S.optional(S.String),
  ServiceId: S.optional(S.String),
  ServiceArn: S.optional(S.String),
  ServiceUrl: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
}) {}
export const ServiceSummaryList = S.Array(ServiceSummary);
export class CreateAutoScalingConfigurationResponse extends S.Class<CreateAutoScalingConfigurationResponse>(
  "CreateAutoScalingConfigurationResponse",
)({ AutoScalingConfiguration: AutoScalingConfiguration }, ns) {}
export class CreateConnectionResponse extends S.Class<CreateConnectionResponse>(
  "CreateConnectionResponse",
)({ Connection: Connection }, ns) {}
export class CreateObservabilityConfigurationResponse extends S.Class<CreateObservabilityConfigurationResponse>(
  "CreateObservabilityConfigurationResponse",
)({ ObservabilityConfiguration: ObservabilityConfiguration }, ns) {}
export class CreateVpcConnectorResponse extends S.Class<CreateVpcConnectorResponse>(
  "CreateVpcConnectorResponse",
)({ VpcConnector: VpcConnector }, ns) {}
export class CreateVpcIngressConnectionResponse extends S.Class<CreateVpcIngressConnectionResponse>(
  "CreateVpcIngressConnectionResponse",
)({ VpcIngressConnection: VpcIngressConnection }, ns) {}
export class DeleteAutoScalingConfigurationResponse extends S.Class<DeleteAutoScalingConfigurationResponse>(
  "DeleteAutoScalingConfigurationResponse",
)({ AutoScalingConfiguration: AutoScalingConfiguration }, ns) {}
export class DeleteObservabilityConfigurationResponse extends S.Class<DeleteObservabilityConfigurationResponse>(
  "DeleteObservabilityConfigurationResponse",
)({ ObservabilityConfiguration: ObservabilityConfiguration }, ns) {}
export class DeleteServiceResponse extends S.Class<DeleteServiceResponse>(
  "DeleteServiceResponse",
)({ Service: Service, OperationId: S.String }, ns) {}
export class DeleteVpcIngressConnectionResponse extends S.Class<DeleteVpcIngressConnectionResponse>(
  "DeleteVpcIngressConnectionResponse",
)({ VpcIngressConnection: VpcIngressConnection }, ns) {}
export class ListAutoScalingConfigurationsResponse extends S.Class<ListAutoScalingConfigurationsResponse>(
  "ListAutoScalingConfigurationsResponse",
)(
  {
    AutoScalingConfigurationSummaryList: AutoScalingConfigurationSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListConnectionsResponse extends S.Class<ListConnectionsResponse>(
  "ListConnectionsResponse",
)(
  {
    ConnectionSummaryList: ConnectionSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListObservabilityConfigurationsResponse extends S.Class<ListObservabilityConfigurationsResponse>(
  "ListObservabilityConfigurationsResponse",
)(
  {
    ObservabilityConfigurationSummaryList:
      ObservabilityConfigurationSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListOperationsResponse extends S.Class<ListOperationsResponse>(
  "ListOperationsResponse",
)(
  {
    OperationSummaryList: S.optional(OperationSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListServicesResponse extends S.Class<ListServicesResponse>(
  "ListServicesResponse",
)(
  { ServiceSummaryList: ServiceSummaryList, NextToken: S.optional(S.String) },
  ns,
) {}
export class VpcIngressConnectionSummary extends S.Class<VpcIngressConnectionSummary>(
  "VpcIngressConnectionSummary",
)({
  VpcIngressConnectionArn: S.optional(S.String),
  ServiceArn: S.optional(S.String),
}) {}
export const VpcIngressConnectionSummaryList = S.Array(
  VpcIngressConnectionSummary,
);
export class AssociateCustomDomainResponse extends S.Class<AssociateCustomDomainResponse>(
  "AssociateCustomDomainResponse",
)(
  {
    DNSTarget: S.String,
    ServiceArn: S.String,
    CustomDomain: CustomDomain,
    VpcDNSTargets: VpcDNSTargetList,
  },
  ns,
) {}
export class ListVpcIngressConnectionsResponse extends S.Class<ListVpcIngressConnectionsResponse>(
  "ListVpcIngressConnectionsResponse",
)(
  {
    VpcIngressConnectionSummaryList: VpcIngressConnectionSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class CreateServiceRequest extends S.Class<CreateServiceRequest>(
  "CreateServiceRequest",
)(
  {
    ServiceName: S.String,
    SourceConfiguration: SourceConfiguration,
    InstanceConfiguration: S.optional(InstanceConfiguration),
    Tags: S.optional(TagList),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    HealthCheckConfiguration: S.optional(HealthCheckConfiguration),
    AutoScalingConfigurationArn: S.optional(S.String),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    ObservabilityConfiguration: S.optional(ServiceObservabilityConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServiceResponse extends S.Class<CreateServiceResponse>(
  "CreateServiceResponse",
)({ Service: Service, OperationId: S.String }, ns) {}

//# Errors
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  {},
  T.AwsQueryError({ code: "InternalServiceError", httpResponseCode: 500 }),
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
  T.AwsQueryError({ code: "InvalidRequest", httpResponseCode: 400 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
  T.AwsQueryError({ code: "ResourceNotfound", httpResponseCode: 400 }),
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  {},
  T.AwsQueryError({ code: "InvalidState", httpResponseCode: 400 }),
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
  T.AwsQueryError({ code: "ServiceQuotaExceeded", httpResponseCode: 402 }),
) {}

//# Operations
/**
 * Delete an App Runner VPC connector resource. You can't delete a
 * connector that's used by one or more App Runner services.
 */
export const deleteVpcConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVpcConnectorRequest,
  output: DeleteVpcConnectorResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Return a full description of an App Runner automatic scaling configuration resource.
 */
export const describeAutoScalingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAutoScalingConfigurationRequest,
    output: DescribeAutoScalingConfigurationResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Return a description of custom domain names that are associated with an App Runner service.
 */
export const describeCustomDomains = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCustomDomainsRequest,
    output: DescribeCustomDomainsResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Return a full description of an App Runner observability configuration resource.
 */
export const describeObservabilityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeObservabilityConfigurationRequest,
    output: DescribeObservabilityConfigurationResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Return a full description of an App Runner service.
 */
export const describeService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeServiceRequest,
  output: DescribeServiceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Return a description of an App Runner VPC connector resource.
 */
export const describeVpcConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeVpcConnectorRequest,
    output: DescribeVpcConnectorResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Return a full description of an App Runner VPC Ingress Connection resource.
 */
export const describeVpcIngressConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeVpcIngressConnectionRequest,
    output: DescribeVpcIngressConnectionResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Returns a list of the associated App Runner services using an auto scaling configuration.
 */
export const listServicesForAutoScalingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListServicesForAutoScalingConfigurationRequest,
    output: ListServicesForAutoScalingConfigurationResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }));
/**
 * List tags that are associated with for an App Runner resource. The response contains a list of tag key-value pairs.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of App Runner VPC connectors in your Amazon Web Services account.
 */
export const listVpcConnectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVpcConnectorsRequest,
  output: ListVpcConnectorsResponse,
  errors: [InternalServiceErrorException, InvalidRequestException],
}));
/**
 * Pause an active App Runner service. App Runner reduces compute capacity for the service to zero and loses state (for example, ephemeral storage is
 * removed).
 *
 * This is an asynchronous operation. On a successful call, you can use the returned `OperationId` and the ListOperations
 * call to track the operation's progress.
 */
export const pauseService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PauseServiceRequest,
  output: PauseServiceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Resume an active App Runner service. App Runner provisions compute capacity for the service.
 *
 * This is an asynchronous operation. On a successful call, you can use the returned `OperationId` and the ListOperations
 * call to track the operation's progress.
 */
export const resumeService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeServiceRequest,
  output: ResumeServiceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Initiate a manual deployment of the latest commit in a source code repository or the latest image in a source image repository to an App Runner
 * service.
 *
 * For a source code repository, App Runner retrieves the commit and builds a Docker image. For a source image repository, App Runner retrieves the latest Docker
 * image. In both cases, App Runner then deploys the new image to your service and starts a new container instance.
 *
 * This is an asynchronous operation. On a successful call, you can use the returned `OperationId` and the ListOperations
 * call to track the operation's progress.
 */
export const startDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDeploymentRequest,
  output: StartDeploymentResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Add tags to, or update the tag values of, an App Runner resource. A tag is a key-value pair.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Remove tags from an App Runner resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Update an auto scaling configuration to be the default. The existing default auto scaling configuration will be set to non-default
 * automatically.
 */
export const updateDefaultAutoScalingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDefaultAutoScalingConfigurationRequest,
    output: UpdateDefaultAutoScalingConfigurationResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Update an App Runner service. You can update the source configuration and instance configuration of the service. You can also update the ARN of the auto
 * scaling configuration resource that's associated with the service. However, you can't change the name or the encryption configuration of the service.
 * These can be set only when you create the service.
 *
 * To update the tags applied to your service, use the separate actions TagResource and UntagResource.
 *
 * This is an asynchronous operation. On a successful call, you can use the returned `OperationId` and the ListOperations
 * call to track the operation's progress.
 */
export const updateService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceRequest,
  output: UpdateServiceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Update an existing App Runner VPC Ingress Connection resource. The VPC Ingress Connection must be in one of the following states to be updated:
 *
 * - AVAILABLE
 *
 * - FAILED_CREATION
 *
 * - FAILED_UPDATE
 */
export const updateVpcIngressConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateVpcIngressConnectionRequest,
    output: UpdateVpcIngressConnectionResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      InvalidStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Create an App Runner connection resource. App Runner requires a connection resource when you create App Runner services that access private repositories from
 * certain third-party providers. You can share a connection across multiple services.
 *
 * A connection resource is needed to access GitHub and Bitbucket repositories. Both require
 * a user interface approval process through the App Runner console before you can use the
 * connection.
 */
export const createConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectionRequest,
  output: CreateConnectionResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Create an App Runner observability configuration resource. App Runner requires this resource when you create or update App Runner services and you want to enable
 * non-default observability features. You can share an observability configuration across multiple services.
 *
 * Create multiple revisions of a configuration by calling this action multiple times using the same `ObservabilityConfigurationName`. The
 * call returns incremental `ObservabilityConfigurationRevision` values. When you create a service and configure an observability configuration
 * resource, the service uses the latest active revision of the observability configuration by default. You can optionally configure the service to use a
 * specific revision.
 *
 * The observability configuration resource is designed to configure multiple features (currently one feature, tracing). This action takes optional
 * parameters that describe the configuration of these features (currently one parameter, `TraceConfiguration`). If you don't specify a feature
 * parameter, App Runner doesn't enable the feature.
 */
export const createObservabilityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateObservabilityConfigurationRequest,
    output: CreateObservabilityConfigurationResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Create an App Runner VPC connector resource. App Runner requires this resource when you want to associate your App Runner service to a custom Amazon Virtual Private Cloud
 * (Amazon VPC).
 */
export const createVpcConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcConnectorRequest,
  output: CreateVpcConnectorResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Create an App Runner VPC Ingress Connection resource. App Runner requires this resource when you want to associate your App Runner service with an Amazon VPC endpoint.
 */
export const createVpcIngressConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateVpcIngressConnectionRequest,
    output: CreateVpcIngressConnectionResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      InvalidStateException,
      ServiceQuotaExceededException,
    ],
  }),
);
/**
 * Delete an App Runner automatic scaling configuration resource. You can delete a top level auto scaling configuration, a specific revision of one, or all
 * revisions associated with the top level configuration. You can't delete the default auto scaling configuration or a configuration that's used by one or
 * more App Runner services.
 */
export const deleteAutoScalingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteAutoScalingConfigurationRequest,
    output: DeleteAutoScalingConfigurationResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Delete an App Runner connection. You must first ensure that there are no running App Runner services that use this connection. If there are any, the
 * `DeleteConnection` action fails.
 */
export const deleteConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: DeleteConnectionResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Delete an App Runner observability configuration resource. You can delete a specific revision or the latest active revision. You can't delete a
 * configuration that's used by one or more App Runner services.
 */
export const deleteObservabilityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteObservabilityConfigurationRequest,
    output: DeleteObservabilityConfigurationResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Delete an App Runner service.
 *
 * This is an asynchronous operation. On a successful call, you can use the returned `OperationId` and the ListOperations
 * call to track the operation's progress.
 *
 * Make sure that you don't have any active VPCIngressConnections associated with the service you want to delete.
 */
export const deleteService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceRequest,
  output: DeleteServiceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Delete an App Runner VPC Ingress Connection resource that's associated with an App Runner service. The VPC Ingress Connection must be in one of the following states to be deleted:
 *
 * - `AVAILABLE`
 *
 * - `FAILED_CREATION`
 *
 * - `FAILED_UPDATE`
 *
 * - `FAILED_DELETION`
 */
export const deleteVpcIngressConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVpcIngressConnectionRequest,
    output: DeleteVpcIngressConnectionResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      InvalidStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Disassociate a custom domain name from an App Runner service.
 *
 * Certificates tracking domain validity are associated with a custom domain and are stored in AWS
 * Certificate Manager (ACM). These certificates aren't deleted as part of this action. App Runner delays certificate deletion for
 * 30 days after a domain is disassociated from your service.
 */
export const disassociateCustomDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateCustomDomainRequest,
    output: DisassociateCustomDomainResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      InvalidStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns a list of active App Runner automatic scaling configurations in your Amazon Web Services account. You can query the revisions for a specific
 * configuration name or the revisions for all active configurations in your account. You can optionally query only the latest revision of each requested
 * name.
 *
 * To retrieve a full description of a particular configuration revision, call and provide one of
 * the ARNs returned by `ListAutoScalingConfigurations`.
 */
export const listAutoScalingConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAutoScalingConfigurationsRequest,
    output: ListAutoScalingConfigurationsResponse,
    errors: [InternalServiceErrorException, InvalidRequestException],
  }));
/**
 * Returns a list of App Runner connections that are associated with your Amazon Web Services account.
 */
export const listConnections = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConnectionsRequest,
  output: ListConnectionsResponse,
  errors: [InternalServiceErrorException, InvalidRequestException],
}));
/**
 * Returns a list of active App Runner observability configurations in your Amazon Web Services account. You can query the revisions for a specific
 * configuration name or the revisions for all active configurations in your account. You can optionally query only the latest revision of each requested
 * name.
 *
 * To retrieve a full description of a particular configuration revision, call and provide one
 * of the ARNs returned by `ListObservabilityConfigurations`.
 */
export const listObservabilityConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListObservabilityConfigurationsRequest,
    output: ListObservabilityConfigurationsResponse,
    errors: [InternalServiceErrorException, InvalidRequestException],
  }));
/**
 * Return a list of operations that occurred on an App Runner service.
 *
 * The resulting list of OperationSummary objects is sorted in reverse chronological order. The first object on the list represents the
 * last started operation.
 */
export const listOperations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOperationsRequest,
  output: ListOperationsResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of running App Runner services in your Amazon Web Services account.
 */
export const listServices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServicesRequest,
  output: ListServicesResponse,
  errors: [InternalServiceErrorException, InvalidRequestException],
}));
/**
 * Associate your own domain name with the App Runner subdomain URL of your App Runner service.
 *
 * After you call `AssociateCustomDomain` and receive a successful response, use the information in the CustomDomain record
 * that's returned to add CNAME records to your Domain Name System (DNS). For each mapped domain name, add a mapping to the target App Runner subdomain and one or
 * more certificate validation records. App Runner then performs DNS validation to verify that you own or control the domain name that you associated. App Runner tracks
 * domain validity in a certificate stored in AWS Certificate Manager (ACM).
 */
export const associateCustomDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateCustomDomainRequest,
    output: AssociateCustomDomainResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      InvalidStateException,
    ],
  }),
);
/**
 * Create an App Runner automatic scaling configuration resource. App Runner requires this resource when you create or update App Runner services and you require
 * non-default auto scaling settings. You can share an auto scaling configuration across multiple services.
 *
 * Create multiple revisions of a configuration by calling this action multiple times using the same `AutoScalingConfigurationName`. The call
 * returns incremental `AutoScalingConfigurationRevision` values. When you create a service and configure an auto scaling configuration resource,
 * the service uses the latest active revision of the auto scaling configuration by default. You can optionally configure the service to use a specific
 * revision.
 *
 * Configure a higher `MinSize` to increase the spread of your App Runner service over more Availability Zones in the Amazon Web Services Region. The
 * tradeoff is a higher minimal cost.
 *
 * Configure a lower `MaxSize` to control your cost. The tradeoff is lower responsiveness during peak demand.
 */
export const createAutoScalingConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateAutoScalingConfigurationRequest,
    output: CreateAutoScalingConfigurationResponse,
    errors: [
      InternalServiceErrorException,
      InvalidRequestException,
      ServiceQuotaExceededException,
    ],
  }));
/**
 * Return a list of App Runner VPC Ingress Connections in your Amazon Web Services account.
 */
export const listVpcIngressConnections = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListVpcIngressConnectionsRequest,
    output: ListVpcIngressConnectionsResponse,
    errors: [InternalServiceErrorException, InvalidRequestException],
  }),
);
/**
 * Create an App Runner service. After the service is created, the action also automatically starts a deployment.
 *
 * This is an asynchronous operation. On a successful call, you can use the returned `OperationId` and the ListOperations call to track the operation's progress.
 */
export const createService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceRequest,
  output: CreateServiceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ServiceQuotaExceededException,
  ],
}));

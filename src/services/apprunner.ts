import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://apprunner.amazonaws.com/doc/2020-05-15/");
const svc = T.AwsApiService({
  sdkId: "AppRunner",
  serviceShapeName: "AppRunner",
});
const auth = T.AwsAuthSigv4({ name: "apprunner" });
const ver = T.ServiceVersion("2020-05-15");
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
              `https://apprunner-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://apprunner-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://apprunner.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://apprunner.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AppRunnerResourceArn = string;
export type DomainName = string;
export type AutoScalingConfigurationName = string;
export type ASConfigMaxConcurrency = number;
export type ASConfigMinSize = number;
export type ASConfigMaxSize = number;
export type ConnectionName = string;
export type ObservabilityConfigurationName = string;
export type ServiceName = string;
export type VpcConnectorName = string;
export type VpcIngressConnectionName = string;
export type DescribeCustomDomainsMaxResults = number;
export type MaxResults = number;
export type NextToken = string;
export type ListOperationsMaxResults = number;
export type ServiceMaxResults = number;
export type TagKey = string;
export type TagValue = string;
export type Cpu = string;
export type Memory = string;
export type RoleArn = string;
export type KmsKeyArn = string;
export type HealthCheckPath = string;
export type HealthCheckInterval = number;
export type HealthCheckTimeout = number;
export type HealthCheckHealthyThreshold = number;
export type HealthCheckUnhealthyThreshold = number;
export type UUID = string;
export type ErrorMessage = string;
export type SourceDirectory = string;
export type ImageIdentifier = string;
export type Integer = number;
export type AutoScalingConfigurationRevision = number;
export type MaxConcurrency = number;
export type MinSize = number;
export type MaxSize = number;
export type ServiceId = string;
export type CustomerAccountId = string;
export type StartCommand = string | Redacted.Redacted<string>;
export type BuildCommand = string | Redacted.Redacted<string>;
export type RuntimeEnvironmentVariablesKey = string | Redacted.Redacted<string>;
export type RuntimeEnvironmentVariablesValue =
  | string
  | Redacted.Redacted<string>;
export type RuntimeEnvironmentSecretsName = string | Redacted.Redacted<string>;
export type RuntimeEnvironmentSecretsValue = string | Redacted.Redacted<string>;

//# Schemas
export type StringList = string[];
export const StringList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateCustomDomainRequest {
  ServiceArn: string;
  DomainName: string;
  EnableWWWSubdomain?: boolean;
}
export const AssociateCustomDomainRequest = S.suspend(() =>
  S.Struct({
    ServiceArn: S.String,
    DomainName: S.String,
    EnableWWWSubdomain: S.optional(S.Boolean),
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
  identifier: "AssociateCustomDomainRequest",
}) as any as S.Schema<AssociateCustomDomainRequest>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateConnectionRequest {
  ConnectionName: string;
  ProviderType: string;
  Tags?: TagList;
}
export const CreateConnectionRequest = S.suspend(() =>
  S.Struct({
    ConnectionName: S.String,
    ProviderType: S.String,
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
  identifier: "CreateConnectionRequest",
}) as any as S.Schema<CreateConnectionRequest>;
export interface CreateVpcConnectorRequest {
  VpcConnectorName: string;
  Subnets: StringList;
  SecurityGroups?: StringList;
  Tags?: TagList;
}
export const CreateVpcConnectorRequest = S.suspend(() =>
  S.Struct({
    VpcConnectorName: S.String,
    Subnets: StringList,
    SecurityGroups: S.optional(StringList),
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
  identifier: "CreateVpcConnectorRequest",
}) as any as S.Schema<CreateVpcConnectorRequest>;
export interface DeleteAutoScalingConfigurationRequest {
  AutoScalingConfigurationArn: string;
  DeleteAllRevisions?: boolean;
}
export const DeleteAutoScalingConfigurationRequest = S.suspend(() =>
  S.Struct({
    AutoScalingConfigurationArn: S.String,
    DeleteAllRevisions: S.optional(S.Boolean),
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
  identifier: "DeleteAutoScalingConfigurationRequest",
}) as any as S.Schema<DeleteAutoScalingConfigurationRequest>;
export interface DeleteConnectionRequest {
  ConnectionArn: string;
}
export const DeleteConnectionRequest = S.suspend(() =>
  S.Struct({ ConnectionArn: S.String }).pipe(
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
  identifier: "DeleteConnectionRequest",
}) as any as S.Schema<DeleteConnectionRequest>;
export interface DeleteObservabilityConfigurationRequest {
  ObservabilityConfigurationArn: string;
}
export const DeleteObservabilityConfigurationRequest = S.suspend(() =>
  S.Struct({ ObservabilityConfigurationArn: S.String }).pipe(
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
  identifier: "DeleteObservabilityConfigurationRequest",
}) as any as S.Schema<DeleteObservabilityConfigurationRequest>;
export interface DeleteServiceRequest {
  ServiceArn: string;
}
export const DeleteServiceRequest = S.suspend(() =>
  S.Struct({ ServiceArn: S.String }).pipe(
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
  identifier: "DeleteServiceRequest",
}) as any as S.Schema<DeleteServiceRequest>;
export interface DeleteVpcConnectorRequest {
  VpcConnectorArn: string;
}
export const DeleteVpcConnectorRequest = S.suspend(() =>
  S.Struct({ VpcConnectorArn: S.String }).pipe(
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
  identifier: "DeleteVpcConnectorRequest",
}) as any as S.Schema<DeleteVpcConnectorRequest>;
export interface DeleteVpcIngressConnectionRequest {
  VpcIngressConnectionArn: string;
}
export const DeleteVpcIngressConnectionRequest = S.suspend(() =>
  S.Struct({ VpcIngressConnectionArn: S.String }).pipe(
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
  identifier: "DeleteVpcIngressConnectionRequest",
}) as any as S.Schema<DeleteVpcIngressConnectionRequest>;
export interface DescribeAutoScalingConfigurationRequest {
  AutoScalingConfigurationArn: string;
}
export const DescribeAutoScalingConfigurationRequest = S.suspend(() =>
  S.Struct({ AutoScalingConfigurationArn: S.String }).pipe(
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
  identifier: "DescribeAutoScalingConfigurationRequest",
}) as any as S.Schema<DescribeAutoScalingConfigurationRequest>;
export interface DescribeCustomDomainsRequest {
  ServiceArn: string;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeCustomDomainsRequest = S.suspend(() =>
  S.Struct({
    ServiceArn: S.String,
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
  identifier: "DescribeCustomDomainsRequest",
}) as any as S.Schema<DescribeCustomDomainsRequest>;
export interface DescribeObservabilityConfigurationRequest {
  ObservabilityConfigurationArn: string;
}
export const DescribeObservabilityConfigurationRequest = S.suspend(() =>
  S.Struct({ ObservabilityConfigurationArn: S.String }).pipe(
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
  identifier: "DescribeObservabilityConfigurationRequest",
}) as any as S.Schema<DescribeObservabilityConfigurationRequest>;
export interface DescribeServiceRequest {
  ServiceArn: string;
}
export const DescribeServiceRequest = S.suspend(() =>
  S.Struct({ ServiceArn: S.String }).pipe(
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
  identifier: "DescribeServiceRequest",
}) as any as S.Schema<DescribeServiceRequest>;
export interface DescribeVpcConnectorRequest {
  VpcConnectorArn: string;
}
export const DescribeVpcConnectorRequest = S.suspend(() =>
  S.Struct({ VpcConnectorArn: S.String }).pipe(
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
  identifier: "DescribeVpcConnectorRequest",
}) as any as S.Schema<DescribeVpcConnectorRequest>;
export interface DescribeVpcIngressConnectionRequest {
  VpcIngressConnectionArn: string;
}
export const DescribeVpcIngressConnectionRequest = S.suspend(() =>
  S.Struct({ VpcIngressConnectionArn: S.String }).pipe(
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
  identifier: "DescribeVpcIngressConnectionRequest",
}) as any as S.Schema<DescribeVpcIngressConnectionRequest>;
export interface DisassociateCustomDomainRequest {
  ServiceArn: string;
  DomainName: string;
}
export const DisassociateCustomDomainRequest = S.suspend(() =>
  S.Struct({ ServiceArn: S.String, DomainName: S.String }).pipe(
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
  identifier: "DisassociateCustomDomainRequest",
}) as any as S.Schema<DisassociateCustomDomainRequest>;
export interface ListAutoScalingConfigurationsRequest {
  AutoScalingConfigurationName?: string;
  LatestOnly?: boolean;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAutoScalingConfigurationsRequest = S.suspend(() =>
  S.Struct({
    AutoScalingConfigurationName: S.optional(S.String),
    LatestOnly: S.optional(S.Boolean),
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
  identifier: "ListAutoScalingConfigurationsRequest",
}) as any as S.Schema<ListAutoScalingConfigurationsRequest>;
export interface ListConnectionsRequest {
  ConnectionName?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListConnectionsRequest = S.suspend(() =>
  S.Struct({
    ConnectionName: S.optional(S.String),
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
  identifier: "ListConnectionsRequest",
}) as any as S.Schema<ListConnectionsRequest>;
export interface ListObservabilityConfigurationsRequest {
  ObservabilityConfigurationName?: string;
  LatestOnly?: boolean;
  MaxResults?: number;
  NextToken?: string;
}
export const ListObservabilityConfigurationsRequest = S.suspend(() =>
  S.Struct({
    ObservabilityConfigurationName: S.optional(S.String),
    LatestOnly: S.optional(S.Boolean),
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
  identifier: "ListObservabilityConfigurationsRequest",
}) as any as S.Schema<ListObservabilityConfigurationsRequest>;
export interface ListOperationsRequest {
  ServiceArn: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListOperationsRequest = S.suspend(() =>
  S.Struct({
    ServiceArn: S.String,
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
  identifier: "ListOperationsRequest",
}) as any as S.Schema<ListOperationsRequest>;
export interface ListServicesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListServicesRequest = S.suspend(() =>
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
  identifier: "ListServicesRequest",
}) as any as S.Schema<ListServicesRequest>;
export interface ListServicesForAutoScalingConfigurationRequest {
  AutoScalingConfigurationArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListServicesForAutoScalingConfigurationRequest = S.suspend(() =>
  S.Struct({
    AutoScalingConfigurationArn: S.String,
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
  identifier: "ListServicesForAutoScalingConfigurationRequest",
}) as any as S.Schema<ListServicesForAutoScalingConfigurationRequest>;
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
export interface ListVpcConnectorsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListVpcConnectorsRequest = S.suspend(() =>
  S.Struct({
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
  identifier: "ListVpcConnectorsRequest",
}) as any as S.Schema<ListVpcConnectorsRequest>;
export interface PauseServiceRequest {
  ServiceArn: string;
}
export const PauseServiceRequest = S.suspend(() =>
  S.Struct({ ServiceArn: S.String }).pipe(
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
  identifier: "PauseServiceRequest",
}) as any as S.Schema<PauseServiceRequest>;
export interface ResumeServiceRequest {
  ServiceArn: string;
}
export const ResumeServiceRequest = S.suspend(() =>
  S.Struct({ ServiceArn: S.String }).pipe(
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
  identifier: "ResumeServiceRequest",
}) as any as S.Schema<ResumeServiceRequest>;
export interface StartDeploymentRequest {
  ServiceArn: string;
}
export const StartDeploymentRequest = S.suspend(() =>
  S.Struct({ ServiceArn: S.String }).pipe(
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
  identifier: "StartDeploymentRequest",
}) as any as S.Schema<StartDeploymentRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: TagList;
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
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
export interface UpdateDefaultAutoScalingConfigurationRequest {
  AutoScalingConfigurationArn: string;
}
export const UpdateDefaultAutoScalingConfigurationRequest = S.suspend(() =>
  S.Struct({ AutoScalingConfigurationArn: S.String }).pipe(
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
  identifier: "UpdateDefaultAutoScalingConfigurationRequest",
}) as any as S.Schema<UpdateDefaultAutoScalingConfigurationRequest>;
export interface SourceCodeVersion {
  Type: string;
  Value: string;
}
export const SourceCodeVersion = S.suspend(() =>
  S.Struct({ Type: S.String, Value: S.String }),
).annotations({
  identifier: "SourceCodeVersion",
}) as any as S.Schema<SourceCodeVersion>;
export type RuntimeEnvironmentVariables = {
  [key: string]: string | Redacted.Redacted<string>;
};
export const RuntimeEnvironmentVariables = S.Record({
  key: S.String,
  value: SensitiveString,
});
export type RuntimeEnvironmentSecrets = {
  [key: string]: string | Redacted.Redacted<string>;
};
export const RuntimeEnvironmentSecrets = S.Record({
  key: S.String,
  value: SensitiveString,
});
export interface CodeConfigurationValues {
  Runtime: string;
  BuildCommand?: string | Redacted.Redacted<string>;
  StartCommand?: string | Redacted.Redacted<string>;
  Port?: string;
  RuntimeEnvironmentVariables?: RuntimeEnvironmentVariables;
  RuntimeEnvironmentSecrets?: RuntimeEnvironmentSecrets;
}
export const CodeConfigurationValues = S.suspend(() =>
  S.Struct({
    Runtime: S.String,
    BuildCommand: S.optional(SensitiveString),
    StartCommand: S.optional(SensitiveString),
    Port: S.optional(S.String),
    RuntimeEnvironmentVariables: S.optional(RuntimeEnvironmentVariables),
    RuntimeEnvironmentSecrets: S.optional(RuntimeEnvironmentSecrets),
  }),
).annotations({
  identifier: "CodeConfigurationValues",
}) as any as S.Schema<CodeConfigurationValues>;
export interface CodeConfiguration {
  ConfigurationSource: string;
  CodeConfigurationValues?: CodeConfigurationValues;
}
export const CodeConfiguration = S.suspend(() =>
  S.Struct({
    ConfigurationSource: S.String,
    CodeConfigurationValues: S.optional(CodeConfigurationValues),
  }),
).annotations({
  identifier: "CodeConfiguration",
}) as any as S.Schema<CodeConfiguration>;
export interface CodeRepository {
  RepositoryUrl: string;
  SourceCodeVersion: SourceCodeVersion;
  CodeConfiguration?: CodeConfiguration;
  SourceDirectory?: string;
}
export const CodeRepository = S.suspend(() =>
  S.Struct({
    RepositoryUrl: S.String,
    SourceCodeVersion: SourceCodeVersion,
    CodeConfiguration: S.optional(CodeConfiguration),
    SourceDirectory: S.optional(S.String),
  }),
).annotations({
  identifier: "CodeRepository",
}) as any as S.Schema<CodeRepository>;
export interface ImageConfiguration {
  RuntimeEnvironmentVariables?: RuntimeEnvironmentVariables;
  StartCommand?: string | Redacted.Redacted<string>;
  Port?: string;
  RuntimeEnvironmentSecrets?: RuntimeEnvironmentSecrets;
}
export const ImageConfiguration = S.suspend(() =>
  S.Struct({
    RuntimeEnvironmentVariables: S.optional(RuntimeEnvironmentVariables),
    StartCommand: S.optional(SensitiveString),
    Port: S.optional(S.String),
    RuntimeEnvironmentSecrets: S.optional(RuntimeEnvironmentSecrets),
  }),
).annotations({
  identifier: "ImageConfiguration",
}) as any as S.Schema<ImageConfiguration>;
export interface ImageRepository {
  ImageIdentifier: string;
  ImageConfiguration?: ImageConfiguration;
  ImageRepositoryType: string;
}
export const ImageRepository = S.suspend(() =>
  S.Struct({
    ImageIdentifier: S.String,
    ImageConfiguration: S.optional(ImageConfiguration),
    ImageRepositoryType: S.String,
  }),
).annotations({
  identifier: "ImageRepository",
}) as any as S.Schema<ImageRepository>;
export interface AuthenticationConfiguration {
  ConnectionArn?: string;
  AccessRoleArn?: string;
}
export const AuthenticationConfiguration = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.optional(S.String),
    AccessRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AuthenticationConfiguration",
}) as any as S.Schema<AuthenticationConfiguration>;
export interface SourceConfiguration {
  CodeRepository?: CodeRepository;
  ImageRepository?: ImageRepository;
  AutoDeploymentsEnabled?: boolean;
  AuthenticationConfiguration?: AuthenticationConfiguration;
}
export const SourceConfiguration = S.suspend(() =>
  S.Struct({
    CodeRepository: S.optional(CodeRepository),
    ImageRepository: S.optional(ImageRepository),
    AutoDeploymentsEnabled: S.optional(S.Boolean),
    AuthenticationConfiguration: S.optional(AuthenticationConfiguration),
  }),
).annotations({
  identifier: "SourceConfiguration",
}) as any as S.Schema<SourceConfiguration>;
export interface InstanceConfiguration {
  Cpu?: string;
  Memory?: string;
  InstanceRoleArn?: string;
}
export const InstanceConfiguration = S.suspend(() =>
  S.Struct({
    Cpu: S.optional(S.String),
    Memory: S.optional(S.String),
    InstanceRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceConfiguration",
}) as any as S.Schema<InstanceConfiguration>;
export interface HealthCheckConfiguration {
  Protocol?: string;
  Path?: string;
  Interval?: number;
  Timeout?: number;
  HealthyThreshold?: number;
  UnhealthyThreshold?: number;
}
export const HealthCheckConfiguration = S.suspend(() =>
  S.Struct({
    Protocol: S.optional(S.String),
    Path: S.optional(S.String),
    Interval: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    HealthyThreshold: S.optional(S.Number),
    UnhealthyThreshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "HealthCheckConfiguration",
}) as any as S.Schema<HealthCheckConfiguration>;
export interface EgressConfiguration {
  EgressType?: string;
  VpcConnectorArn?: string;
}
export const EgressConfiguration = S.suspend(() =>
  S.Struct({
    EgressType: S.optional(S.String),
    VpcConnectorArn: S.optional(S.String),
  }),
).annotations({
  identifier: "EgressConfiguration",
}) as any as S.Schema<EgressConfiguration>;
export interface IngressConfiguration {
  IsPubliclyAccessible?: boolean;
}
export const IngressConfiguration = S.suspend(() =>
  S.Struct({ IsPubliclyAccessible: S.optional(S.Boolean) }),
).annotations({
  identifier: "IngressConfiguration",
}) as any as S.Schema<IngressConfiguration>;
export interface NetworkConfiguration {
  EgressConfiguration?: EgressConfiguration;
  IngressConfiguration?: IngressConfiguration;
  IpAddressType?: string;
}
export const NetworkConfiguration = S.suspend(() =>
  S.Struct({
    EgressConfiguration: S.optional(EgressConfiguration),
    IngressConfiguration: S.optional(IngressConfiguration),
    IpAddressType: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkConfiguration",
}) as any as S.Schema<NetworkConfiguration>;
export interface ServiceObservabilityConfiguration {
  ObservabilityEnabled: boolean;
  ObservabilityConfigurationArn?: string;
}
export const ServiceObservabilityConfiguration = S.suspend(() =>
  S.Struct({
    ObservabilityEnabled: S.Boolean,
    ObservabilityConfigurationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceObservabilityConfiguration",
}) as any as S.Schema<ServiceObservabilityConfiguration>;
export interface UpdateServiceRequest {
  ServiceArn: string;
  SourceConfiguration?: SourceConfiguration;
  InstanceConfiguration?: InstanceConfiguration;
  AutoScalingConfigurationArn?: string;
  HealthCheckConfiguration?: HealthCheckConfiguration;
  NetworkConfiguration?: NetworkConfiguration;
  ObservabilityConfiguration?: ServiceObservabilityConfiguration;
}
export const UpdateServiceRequest = S.suspend(() =>
  S.Struct({
    ServiceArn: S.String,
    SourceConfiguration: S.optional(SourceConfiguration),
    InstanceConfiguration: S.optional(InstanceConfiguration),
    AutoScalingConfigurationArn: S.optional(S.String),
    HealthCheckConfiguration: S.optional(HealthCheckConfiguration),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    ObservabilityConfiguration: S.optional(ServiceObservabilityConfiguration),
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
  identifier: "UpdateServiceRequest",
}) as any as S.Schema<UpdateServiceRequest>;
export interface IngressVpcConfiguration {
  VpcId?: string;
  VpcEndpointId?: string;
}
export const IngressVpcConfiguration = S.suspend(() =>
  S.Struct({
    VpcId: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "IngressVpcConfiguration",
}) as any as S.Schema<IngressVpcConfiguration>;
export interface UpdateVpcIngressConnectionRequest {
  VpcIngressConnectionArn: string;
  IngressVpcConfiguration: IngressVpcConfiguration;
}
export const UpdateVpcIngressConnectionRequest = S.suspend(() =>
  S.Struct({
    VpcIngressConnectionArn: S.String,
    IngressVpcConfiguration: IngressVpcConfiguration,
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
  identifier: "UpdateVpcIngressConnectionRequest",
}) as any as S.Schema<UpdateVpcIngressConnectionRequest>;
export interface TraceConfiguration {
  Vendor: string;
}
export const TraceConfiguration = S.suspend(() =>
  S.Struct({ Vendor: S.String }),
).annotations({
  identifier: "TraceConfiguration",
}) as any as S.Schema<TraceConfiguration>;
export interface EncryptionConfiguration {
  KmsKey: string;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({ KmsKey: S.String }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface CertificateValidationRecord {
  Name?: string;
  Type?: string;
  Value?: string;
  Status?: string;
}
export const CertificateValidationRecord = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Value: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "CertificateValidationRecord",
}) as any as S.Schema<CertificateValidationRecord>;
export type CertificateValidationRecordList = CertificateValidationRecord[];
export const CertificateValidationRecordList = S.Array(
  CertificateValidationRecord,
);
export interface CustomDomain {
  DomainName: string;
  EnableWWWSubdomain: boolean;
  CertificateValidationRecords?: CertificateValidationRecordList;
  Status: string;
}
export const CustomDomain = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    EnableWWWSubdomain: S.Boolean,
    CertificateValidationRecords: S.optional(CertificateValidationRecordList),
    Status: S.String,
  }),
).annotations({ identifier: "CustomDomain" }) as any as S.Schema<CustomDomain>;
export type CustomDomainList = CustomDomain[];
export const CustomDomainList = S.Array(CustomDomain);
export type ServiceArnList = string[];
export const ServiceArnList = S.Array(S.String);
export interface VpcConnector {
  VpcConnectorName?: string;
  VpcConnectorArn?: string;
  VpcConnectorRevision?: number;
  Subnets?: StringList;
  SecurityGroups?: StringList;
  Status?: string;
  CreatedAt?: Date;
  DeletedAt?: Date;
}
export const VpcConnector = S.suspend(() =>
  S.Struct({
    VpcConnectorName: S.optional(S.String),
    VpcConnectorArn: S.optional(S.String),
    VpcConnectorRevision: S.optional(S.Number),
    Subnets: S.optional(StringList),
    SecurityGroups: S.optional(StringList),
    Status: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DeletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "VpcConnector" }) as any as S.Schema<VpcConnector>;
export type VpcConnectors = VpcConnector[];
export const VpcConnectors = S.Array(VpcConnector);
export interface ListVpcIngressConnectionsFilter {
  ServiceArn?: string;
  VpcEndpointId?: string;
}
export const ListVpcIngressConnectionsFilter = S.suspend(() =>
  S.Struct({
    ServiceArn: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListVpcIngressConnectionsFilter",
}) as any as S.Schema<ListVpcIngressConnectionsFilter>;
export interface CreateAutoScalingConfigurationRequest {
  AutoScalingConfigurationName: string;
  MaxConcurrency?: number;
  MinSize?: number;
  MaxSize?: number;
  Tags?: TagList;
}
export const CreateAutoScalingConfigurationRequest = S.suspend(() =>
  S.Struct({
    AutoScalingConfigurationName: S.String,
    MaxConcurrency: S.optional(S.Number),
    MinSize: S.optional(S.Number),
    MaxSize: S.optional(S.Number),
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
  identifier: "CreateAutoScalingConfigurationRequest",
}) as any as S.Schema<CreateAutoScalingConfigurationRequest>;
export interface CreateObservabilityConfigurationRequest {
  ObservabilityConfigurationName: string;
  TraceConfiguration?: TraceConfiguration;
  Tags?: TagList;
}
export const CreateObservabilityConfigurationRequest = S.suspend(() =>
  S.Struct({
    ObservabilityConfigurationName: S.String,
    TraceConfiguration: S.optional(TraceConfiguration),
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
  identifier: "CreateObservabilityConfigurationRequest",
}) as any as S.Schema<CreateObservabilityConfigurationRequest>;
export interface CreateVpcIngressConnectionRequest {
  ServiceArn: string;
  VpcIngressConnectionName: string;
  IngressVpcConfiguration: IngressVpcConfiguration;
  Tags?: TagList;
}
export const CreateVpcIngressConnectionRequest = S.suspend(() =>
  S.Struct({
    ServiceArn: S.String,
    VpcIngressConnectionName: S.String,
    IngressVpcConfiguration: IngressVpcConfiguration,
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
  identifier: "CreateVpcIngressConnectionRequest",
}) as any as S.Schema<CreateVpcIngressConnectionRequest>;
export interface Connection {
  ConnectionName?: string;
  ConnectionArn?: string;
  ProviderType?: string;
  Status?: string;
  CreatedAt?: Date;
}
export const Connection = S.suspend(() =>
  S.Struct({
    ConnectionName: S.optional(S.String),
    ConnectionArn: S.optional(S.String),
    ProviderType: S.optional(S.String),
    Status: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Connection" }) as any as S.Schema<Connection>;
export interface DeleteConnectionResponse {
  Connection?: Connection;
}
export const DeleteConnectionResponse = S.suspend(() =>
  S.Struct({ Connection: S.optional(Connection) }).pipe(ns),
).annotations({
  identifier: "DeleteConnectionResponse",
}) as any as S.Schema<DeleteConnectionResponse>;
export interface DeleteVpcConnectorResponse {
  VpcConnector: VpcConnector;
}
export const DeleteVpcConnectorResponse = S.suspend(() =>
  S.Struct({ VpcConnector: VpcConnector }).pipe(ns),
).annotations({
  identifier: "DeleteVpcConnectorResponse",
}) as any as S.Schema<DeleteVpcConnectorResponse>;
export interface AutoScalingConfiguration {
  AutoScalingConfigurationArn?: string;
  AutoScalingConfigurationName?: string;
  AutoScalingConfigurationRevision?: number;
  Latest?: boolean;
  Status?: string;
  MaxConcurrency?: number;
  MinSize?: number;
  MaxSize?: number;
  CreatedAt?: Date;
  DeletedAt?: Date;
  HasAssociatedService?: boolean;
  IsDefault?: boolean;
}
export const AutoScalingConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "AutoScalingConfiguration",
}) as any as S.Schema<AutoScalingConfiguration>;
export interface DescribeAutoScalingConfigurationResponse {
  AutoScalingConfiguration: AutoScalingConfiguration;
}
export const DescribeAutoScalingConfigurationResponse = S.suspend(() =>
  S.Struct({ AutoScalingConfiguration: AutoScalingConfiguration }).pipe(ns),
).annotations({
  identifier: "DescribeAutoScalingConfigurationResponse",
}) as any as S.Schema<DescribeAutoScalingConfigurationResponse>;
export interface VpcDNSTarget {
  VpcIngressConnectionArn?: string;
  VpcId?: string;
  DomainName?: string;
}
export const VpcDNSTarget = S.suspend(() =>
  S.Struct({
    VpcIngressConnectionArn: S.optional(S.String),
    VpcId: S.optional(S.String),
    DomainName: S.optional(S.String),
  }),
).annotations({ identifier: "VpcDNSTarget" }) as any as S.Schema<VpcDNSTarget>;
export type VpcDNSTargetList = VpcDNSTarget[];
export const VpcDNSTargetList = S.Array(VpcDNSTarget);
export interface DescribeCustomDomainsResponse {
  DNSTarget: string;
  ServiceArn: string;
  CustomDomains: CustomDomainList;
  VpcDNSTargets: VpcDNSTargetList;
  NextToken?: string;
}
export const DescribeCustomDomainsResponse = S.suspend(() =>
  S.Struct({
    DNSTarget: S.String,
    ServiceArn: S.String,
    CustomDomains: CustomDomainList,
    VpcDNSTargets: VpcDNSTargetList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeCustomDomainsResponse",
}) as any as S.Schema<DescribeCustomDomainsResponse>;
export interface ObservabilityConfiguration {
  ObservabilityConfigurationArn?: string;
  ObservabilityConfigurationName?: string;
  TraceConfiguration?: TraceConfiguration;
  ObservabilityConfigurationRevision?: number;
  Latest?: boolean;
  Status?: string;
  CreatedAt?: Date;
  DeletedAt?: Date;
}
export const ObservabilityConfiguration = S.suspend(() =>
  S.Struct({
    ObservabilityConfigurationArn: S.optional(S.String),
    ObservabilityConfigurationName: S.optional(S.String),
    TraceConfiguration: S.optional(TraceConfiguration),
    ObservabilityConfigurationRevision: S.optional(S.Number),
    Latest: S.optional(S.Boolean),
    Status: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DeletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ObservabilityConfiguration",
}) as any as S.Schema<ObservabilityConfiguration>;
export interface DescribeObservabilityConfigurationResponse {
  ObservabilityConfiguration: ObservabilityConfiguration;
}
export const DescribeObservabilityConfigurationResponse = S.suspend(() =>
  S.Struct({ ObservabilityConfiguration: ObservabilityConfiguration }).pipe(ns),
).annotations({
  identifier: "DescribeObservabilityConfigurationResponse",
}) as any as S.Schema<DescribeObservabilityConfigurationResponse>;
export interface AutoScalingConfigurationSummary {
  AutoScalingConfigurationArn?: string;
  AutoScalingConfigurationName?: string;
  AutoScalingConfigurationRevision?: number;
  Status?: string;
  CreatedAt?: Date;
  HasAssociatedService?: boolean;
  IsDefault?: boolean;
}
export const AutoScalingConfigurationSummary = S.suspend(() =>
  S.Struct({
    AutoScalingConfigurationArn: S.optional(S.String),
    AutoScalingConfigurationName: S.optional(S.String),
    AutoScalingConfigurationRevision: S.optional(S.Number),
    Status: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HasAssociatedService: S.optional(S.Boolean),
    IsDefault: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AutoScalingConfigurationSummary",
}) as any as S.Schema<AutoScalingConfigurationSummary>;
export interface Service {
  ServiceName: string;
  ServiceId: string;
  ServiceArn: string;
  ServiceUrl?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  DeletedAt?: Date;
  Status: string;
  SourceConfiguration: SourceConfiguration;
  InstanceConfiguration: InstanceConfiguration;
  EncryptionConfiguration?: EncryptionConfiguration;
  HealthCheckConfiguration?: HealthCheckConfiguration;
  AutoScalingConfigurationSummary: AutoScalingConfigurationSummary;
  NetworkConfiguration: NetworkConfiguration;
  ObservabilityConfiguration?: ServiceObservabilityConfiguration;
}
export const Service = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Service" }) as any as S.Schema<Service>;
export interface DescribeServiceResponse {
  Service: Service;
}
export const DescribeServiceResponse = S.suspend(() =>
  S.Struct({ Service: Service }).pipe(ns),
).annotations({
  identifier: "DescribeServiceResponse",
}) as any as S.Schema<DescribeServiceResponse>;
export interface DescribeVpcConnectorResponse {
  VpcConnector: VpcConnector;
}
export const DescribeVpcConnectorResponse = S.suspend(() =>
  S.Struct({ VpcConnector: VpcConnector }).pipe(ns),
).annotations({
  identifier: "DescribeVpcConnectorResponse",
}) as any as S.Schema<DescribeVpcConnectorResponse>;
export interface VpcIngressConnection {
  VpcIngressConnectionArn?: string;
  VpcIngressConnectionName?: string;
  ServiceArn?: string;
  Status?: string;
  AccountId?: string;
  DomainName?: string;
  IngressVpcConfiguration?: IngressVpcConfiguration;
  CreatedAt?: Date;
  DeletedAt?: Date;
}
export const VpcIngressConnection = S.suspend(() =>
  S.Struct({
    VpcIngressConnectionArn: S.optional(S.String),
    VpcIngressConnectionName: S.optional(S.String),
    ServiceArn: S.optional(S.String),
    Status: S.optional(S.String),
    AccountId: S.optional(S.String),
    DomainName: S.optional(S.String),
    IngressVpcConfiguration: S.optional(IngressVpcConfiguration),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DeletedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "VpcIngressConnection",
}) as any as S.Schema<VpcIngressConnection>;
export interface DescribeVpcIngressConnectionResponse {
  VpcIngressConnection: VpcIngressConnection;
}
export const DescribeVpcIngressConnectionResponse = S.suspend(() =>
  S.Struct({ VpcIngressConnection: VpcIngressConnection }).pipe(ns),
).annotations({
  identifier: "DescribeVpcIngressConnectionResponse",
}) as any as S.Schema<DescribeVpcIngressConnectionResponse>;
export interface DisassociateCustomDomainResponse {
  DNSTarget: string;
  ServiceArn: string;
  CustomDomain: CustomDomain;
  VpcDNSTargets: VpcDNSTargetList;
}
export const DisassociateCustomDomainResponse = S.suspend(() =>
  S.Struct({
    DNSTarget: S.String,
    ServiceArn: S.String,
    CustomDomain: CustomDomain,
    VpcDNSTargets: VpcDNSTargetList,
  }).pipe(ns),
).annotations({
  identifier: "DisassociateCustomDomainResponse",
}) as any as S.Schema<DisassociateCustomDomainResponse>;
export interface ListServicesForAutoScalingConfigurationResponse {
  ServiceArnList: ServiceArnList;
  NextToken?: string;
}
export const ListServicesForAutoScalingConfigurationResponse = S.suspend(() =>
  S.Struct({
    ServiceArnList: ServiceArnList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListServicesForAutoScalingConfigurationResponse",
}) as any as S.Schema<ListServicesForAutoScalingConfigurationResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListVpcConnectorsResponse {
  VpcConnectors: VpcConnectors;
  NextToken?: string;
}
export const ListVpcConnectorsResponse = S.suspend(() =>
  S.Struct({
    VpcConnectors: VpcConnectors,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListVpcConnectorsResponse",
}) as any as S.Schema<ListVpcConnectorsResponse>;
export interface ListVpcIngressConnectionsRequest {
  Filter?: ListVpcIngressConnectionsFilter;
  MaxResults?: number;
  NextToken?: string;
}
export const ListVpcIngressConnectionsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(ListVpcIngressConnectionsFilter),
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
  identifier: "ListVpcIngressConnectionsRequest",
}) as any as S.Schema<ListVpcIngressConnectionsRequest>;
export interface PauseServiceResponse {
  Service: Service;
  OperationId?: string;
}
export const PauseServiceResponse = S.suspend(() =>
  S.Struct({ Service: Service, OperationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PauseServiceResponse",
}) as any as S.Schema<PauseServiceResponse>;
export interface ResumeServiceResponse {
  Service: Service;
  OperationId?: string;
}
export const ResumeServiceResponse = S.suspend(() =>
  S.Struct({ Service: Service, OperationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ResumeServiceResponse",
}) as any as S.Schema<ResumeServiceResponse>;
export interface StartDeploymentResponse {
  OperationId: string;
}
export const StartDeploymentResponse = S.suspend(() =>
  S.Struct({ OperationId: S.String }).pipe(ns),
).annotations({
  identifier: "StartDeploymentResponse",
}) as any as S.Schema<StartDeploymentResponse>;
export interface UpdateDefaultAutoScalingConfigurationResponse {
  AutoScalingConfiguration: AutoScalingConfiguration;
}
export const UpdateDefaultAutoScalingConfigurationResponse = S.suspend(() =>
  S.Struct({ AutoScalingConfiguration: AutoScalingConfiguration }).pipe(ns),
).annotations({
  identifier: "UpdateDefaultAutoScalingConfigurationResponse",
}) as any as S.Schema<UpdateDefaultAutoScalingConfigurationResponse>;
export interface UpdateServiceResponse {
  Service: Service;
  OperationId: string;
}
export const UpdateServiceResponse = S.suspend(() =>
  S.Struct({ Service: Service, OperationId: S.String }).pipe(ns),
).annotations({
  identifier: "UpdateServiceResponse",
}) as any as S.Schema<UpdateServiceResponse>;
export interface UpdateVpcIngressConnectionResponse {
  VpcIngressConnection: VpcIngressConnection;
}
export const UpdateVpcIngressConnectionResponse = S.suspend(() =>
  S.Struct({ VpcIngressConnection: VpcIngressConnection }).pipe(ns),
).annotations({
  identifier: "UpdateVpcIngressConnectionResponse",
}) as any as S.Schema<UpdateVpcIngressConnectionResponse>;
export type AutoScalingConfigurationSummaryList =
  AutoScalingConfigurationSummary[];
export const AutoScalingConfigurationSummaryList = S.Array(
  AutoScalingConfigurationSummary,
);
export interface ConnectionSummary {
  ConnectionName?: string;
  ConnectionArn?: string;
  ProviderType?: string;
  Status?: string;
  CreatedAt?: Date;
}
export const ConnectionSummary = S.suspend(() =>
  S.Struct({
    ConnectionName: S.optional(S.String),
    ConnectionArn: S.optional(S.String),
    ProviderType: S.optional(S.String),
    Status: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ConnectionSummary",
}) as any as S.Schema<ConnectionSummary>;
export type ConnectionSummaryList = ConnectionSummary[];
export const ConnectionSummaryList = S.Array(ConnectionSummary);
export interface ObservabilityConfigurationSummary {
  ObservabilityConfigurationArn?: string;
  ObservabilityConfigurationName?: string;
  ObservabilityConfigurationRevision?: number;
}
export const ObservabilityConfigurationSummary = S.suspend(() =>
  S.Struct({
    ObservabilityConfigurationArn: S.optional(S.String),
    ObservabilityConfigurationName: S.optional(S.String),
    ObservabilityConfigurationRevision: S.optional(S.Number),
  }),
).annotations({
  identifier: "ObservabilityConfigurationSummary",
}) as any as S.Schema<ObservabilityConfigurationSummary>;
export type ObservabilityConfigurationSummaryList =
  ObservabilityConfigurationSummary[];
export const ObservabilityConfigurationSummaryList = S.Array(
  ObservabilityConfigurationSummary,
);
export interface OperationSummary {
  Id?: string;
  Type?: string;
  Status?: string;
  TargetArn?: string;
  StartedAt?: Date;
  EndedAt?: Date;
  UpdatedAt?: Date;
}
export const OperationSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Type: S.optional(S.String),
    Status: S.optional(S.String),
    TargetArn: S.optional(S.String),
    StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "OperationSummary",
}) as any as S.Schema<OperationSummary>;
export type OperationSummaryList = OperationSummary[];
export const OperationSummaryList = S.Array(OperationSummary);
export interface ServiceSummary {
  ServiceName?: string;
  ServiceId?: string;
  ServiceArn?: string;
  ServiceUrl?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Status?: string;
}
export const ServiceSummary = S.suspend(() =>
  S.Struct({
    ServiceName: S.optional(S.String),
    ServiceId: S.optional(S.String),
    ServiceArn: S.optional(S.String),
    ServiceUrl: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceSummary",
}) as any as S.Schema<ServiceSummary>;
export type ServiceSummaryList = ServiceSummary[];
export const ServiceSummaryList = S.Array(ServiceSummary);
export interface CreateAutoScalingConfigurationResponse {
  AutoScalingConfiguration: AutoScalingConfiguration;
}
export const CreateAutoScalingConfigurationResponse = S.suspend(() =>
  S.Struct({ AutoScalingConfiguration: AutoScalingConfiguration }).pipe(ns),
).annotations({
  identifier: "CreateAutoScalingConfigurationResponse",
}) as any as S.Schema<CreateAutoScalingConfigurationResponse>;
export interface CreateConnectionResponse {
  Connection: Connection;
}
export const CreateConnectionResponse = S.suspend(() =>
  S.Struct({ Connection: Connection }).pipe(ns),
).annotations({
  identifier: "CreateConnectionResponse",
}) as any as S.Schema<CreateConnectionResponse>;
export interface CreateObservabilityConfigurationResponse {
  ObservabilityConfiguration: ObservabilityConfiguration;
}
export const CreateObservabilityConfigurationResponse = S.suspend(() =>
  S.Struct({ ObservabilityConfiguration: ObservabilityConfiguration }).pipe(ns),
).annotations({
  identifier: "CreateObservabilityConfigurationResponse",
}) as any as S.Schema<CreateObservabilityConfigurationResponse>;
export interface CreateVpcConnectorResponse {
  VpcConnector: VpcConnector;
}
export const CreateVpcConnectorResponse = S.suspend(() =>
  S.Struct({ VpcConnector: VpcConnector }).pipe(ns),
).annotations({
  identifier: "CreateVpcConnectorResponse",
}) as any as S.Schema<CreateVpcConnectorResponse>;
export interface CreateVpcIngressConnectionResponse {
  VpcIngressConnection: VpcIngressConnection;
}
export const CreateVpcIngressConnectionResponse = S.suspend(() =>
  S.Struct({ VpcIngressConnection: VpcIngressConnection }).pipe(ns),
).annotations({
  identifier: "CreateVpcIngressConnectionResponse",
}) as any as S.Schema<CreateVpcIngressConnectionResponse>;
export interface DeleteAutoScalingConfigurationResponse {
  AutoScalingConfiguration: AutoScalingConfiguration;
}
export const DeleteAutoScalingConfigurationResponse = S.suspend(() =>
  S.Struct({ AutoScalingConfiguration: AutoScalingConfiguration }).pipe(ns),
).annotations({
  identifier: "DeleteAutoScalingConfigurationResponse",
}) as any as S.Schema<DeleteAutoScalingConfigurationResponse>;
export interface DeleteObservabilityConfigurationResponse {
  ObservabilityConfiguration: ObservabilityConfiguration;
}
export const DeleteObservabilityConfigurationResponse = S.suspend(() =>
  S.Struct({ ObservabilityConfiguration: ObservabilityConfiguration }).pipe(ns),
).annotations({
  identifier: "DeleteObservabilityConfigurationResponse",
}) as any as S.Schema<DeleteObservabilityConfigurationResponse>;
export interface DeleteServiceResponse {
  Service: Service;
  OperationId: string;
}
export const DeleteServiceResponse = S.suspend(() =>
  S.Struct({ Service: Service, OperationId: S.String }).pipe(ns),
).annotations({
  identifier: "DeleteServiceResponse",
}) as any as S.Schema<DeleteServiceResponse>;
export interface DeleteVpcIngressConnectionResponse {
  VpcIngressConnection: VpcIngressConnection;
}
export const DeleteVpcIngressConnectionResponse = S.suspend(() =>
  S.Struct({ VpcIngressConnection: VpcIngressConnection }).pipe(ns),
).annotations({
  identifier: "DeleteVpcIngressConnectionResponse",
}) as any as S.Schema<DeleteVpcIngressConnectionResponse>;
export interface ListAutoScalingConfigurationsResponse {
  AutoScalingConfigurationSummaryList: AutoScalingConfigurationSummaryList;
  NextToken?: string;
}
export const ListAutoScalingConfigurationsResponse = S.suspend(() =>
  S.Struct({
    AutoScalingConfigurationSummaryList: AutoScalingConfigurationSummaryList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAutoScalingConfigurationsResponse",
}) as any as S.Schema<ListAutoScalingConfigurationsResponse>;
export interface ListConnectionsResponse {
  ConnectionSummaryList: ConnectionSummaryList;
  NextToken?: string;
}
export const ListConnectionsResponse = S.suspend(() =>
  S.Struct({
    ConnectionSummaryList: ConnectionSummaryList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListConnectionsResponse",
}) as any as S.Schema<ListConnectionsResponse>;
export interface ListObservabilityConfigurationsResponse {
  ObservabilityConfigurationSummaryList: ObservabilityConfigurationSummaryList;
  NextToken?: string;
}
export const ListObservabilityConfigurationsResponse = S.suspend(() =>
  S.Struct({
    ObservabilityConfigurationSummaryList:
      ObservabilityConfigurationSummaryList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListObservabilityConfigurationsResponse",
}) as any as S.Schema<ListObservabilityConfigurationsResponse>;
export interface ListOperationsResponse {
  OperationSummaryList?: OperationSummaryList;
  NextToken?: string;
}
export const ListOperationsResponse = S.suspend(() =>
  S.Struct({
    OperationSummaryList: S.optional(OperationSummaryList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListOperationsResponse",
}) as any as S.Schema<ListOperationsResponse>;
export interface ListServicesResponse {
  ServiceSummaryList: ServiceSummaryList;
  NextToken?: string;
}
export const ListServicesResponse = S.suspend(() =>
  S.Struct({
    ServiceSummaryList: ServiceSummaryList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListServicesResponse",
}) as any as S.Schema<ListServicesResponse>;
export interface VpcIngressConnectionSummary {
  VpcIngressConnectionArn?: string;
  ServiceArn?: string;
}
export const VpcIngressConnectionSummary = S.suspend(() =>
  S.Struct({
    VpcIngressConnectionArn: S.optional(S.String),
    ServiceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "VpcIngressConnectionSummary",
}) as any as S.Schema<VpcIngressConnectionSummary>;
export type VpcIngressConnectionSummaryList = VpcIngressConnectionSummary[];
export const VpcIngressConnectionSummaryList = S.Array(
  VpcIngressConnectionSummary,
);
export interface AssociateCustomDomainResponse {
  DNSTarget: string;
  ServiceArn: string;
  CustomDomain: CustomDomain;
  VpcDNSTargets: VpcDNSTargetList;
}
export const AssociateCustomDomainResponse = S.suspend(() =>
  S.Struct({
    DNSTarget: S.String,
    ServiceArn: S.String,
    CustomDomain: CustomDomain,
    VpcDNSTargets: VpcDNSTargetList,
  }).pipe(ns),
).annotations({
  identifier: "AssociateCustomDomainResponse",
}) as any as S.Schema<AssociateCustomDomainResponse>;
export interface ListVpcIngressConnectionsResponse {
  VpcIngressConnectionSummaryList: VpcIngressConnectionSummaryList;
  NextToken?: string;
}
export const ListVpcIngressConnectionsResponse = S.suspend(() =>
  S.Struct({
    VpcIngressConnectionSummaryList: VpcIngressConnectionSummaryList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListVpcIngressConnectionsResponse",
}) as any as S.Schema<ListVpcIngressConnectionsResponse>;
export interface CreateServiceRequest {
  ServiceName: string;
  SourceConfiguration: SourceConfiguration;
  InstanceConfiguration?: InstanceConfiguration;
  Tags?: TagList;
  EncryptionConfiguration?: EncryptionConfiguration;
  HealthCheckConfiguration?: HealthCheckConfiguration;
  AutoScalingConfigurationArn?: string;
  NetworkConfiguration?: NetworkConfiguration;
  ObservabilityConfiguration?: ServiceObservabilityConfiguration;
}
export const CreateServiceRequest = S.suspend(() =>
  S.Struct({
    ServiceName: S.String,
    SourceConfiguration: SourceConfiguration,
    InstanceConfiguration: S.optional(InstanceConfiguration),
    Tags: S.optional(TagList),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    HealthCheckConfiguration: S.optional(HealthCheckConfiguration),
    AutoScalingConfigurationArn: S.optional(S.String),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    ObservabilityConfiguration: S.optional(ServiceObservabilityConfiguration),
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
  identifier: "CreateServiceRequest",
}) as any as S.Schema<CreateServiceRequest>;
export interface CreateServiceResponse {
  Service: Service;
  OperationId: string;
}
export const CreateServiceResponse = S.suspend(() =>
  S.Struct({ Service: Service, OperationId: S.String }).pipe(ns),
).annotations({
  identifier: "CreateServiceResponse",
}) as any as S.Schema<CreateServiceResponse>;

//# Errors
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServiceError", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRequest", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotfound", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ServiceQuotaExceeded", httpResponseCode: 402 }),
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Returns a list of App Runner VPC connectors in your Amazon Web Services account.
 */
export const listVpcConnectors: {
  (
    input: ListVpcConnectorsRequest,
  ): Effect.Effect<
    ListVpcConnectorsResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVpcConnectorsRequest,
  ) => Stream.Stream<
    ListVpcConnectorsResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVpcConnectorsRequest,
  ) => Stream.Stream<
    unknown,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVpcConnectorsRequest,
  output: ListVpcConnectorsResponse,
  errors: [InternalServiceErrorException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of active App Runner automatic scaling configurations in your Amazon Web Services account. You can query the revisions for a specific
 * configuration name or the revisions for all active configurations in your account. You can optionally query only the latest revision of each requested
 * name.
 *
 * To retrieve a full description of a particular configuration revision, call and provide one of
 * the ARNs returned by `ListAutoScalingConfigurations`.
 */
export const listAutoScalingConfigurations: {
  (
    input: ListAutoScalingConfigurationsRequest,
  ): Effect.Effect<
    ListAutoScalingConfigurationsResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutoScalingConfigurationsRequest,
  ) => Stream.Stream<
    ListAutoScalingConfigurationsResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutoScalingConfigurationsRequest,
  ) => Stream.Stream<
    unknown,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutoScalingConfigurationsRequest,
  output: ListAutoScalingConfigurationsResponse,
  errors: [InternalServiceErrorException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of App Runner connections that are associated with your Amazon Web Services account.
 */
export const listConnections: {
  (
    input: ListConnectionsRequest,
  ): Effect.Effect<
    ListConnectionsResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectionsRequest,
  ) => Stream.Stream<
    ListConnectionsResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectionsRequest,
  ) => Stream.Stream<
    unknown,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectionsRequest,
  output: ListConnectionsResponse,
  errors: [InternalServiceErrorException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of active App Runner observability configurations in your Amazon Web Services account. You can query the revisions for a specific
 * configuration name or the revisions for all active configurations in your account. You can optionally query only the latest revision of each requested
 * name.
 *
 * To retrieve a full description of a particular configuration revision, call and provide one
 * of the ARNs returned by `ListObservabilityConfigurations`.
 */
export const listObservabilityConfigurations: {
  (
    input: ListObservabilityConfigurationsRequest,
  ): Effect.Effect<
    ListObservabilityConfigurationsResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListObservabilityConfigurationsRequest,
  ) => Stream.Stream<
    ListObservabilityConfigurationsResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListObservabilityConfigurationsRequest,
  ) => Stream.Stream<
    unknown,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListObservabilityConfigurationsRequest,
  output: ListObservabilityConfigurationsResponse,
  errors: [InternalServiceErrorException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of running App Runner services in your Amazon Web Services account.
 */
export const listServices: {
  (
    input: ListServicesRequest,
  ): Effect.Effect<
    ListServicesResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServicesRequest,
  ) => Stream.Stream<
    ListServicesResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServicesRequest,
  ) => Stream.Stream<
    unknown,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServicesRequest,
  output: ListServicesResponse,
  errors: [InternalServiceErrorException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Return a list of App Runner VPC Ingress Connections in your Amazon Web Services account.
 */
export const listVpcIngressConnections: {
  (
    input: ListVpcIngressConnectionsRequest,
  ): Effect.Effect<
    ListVpcIngressConnectionsResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVpcIngressConnectionsRequest,
  ) => Stream.Stream<
    ListVpcIngressConnectionsResponse,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVpcIngressConnectionsRequest,
  ) => Stream.Stream<
    unknown,
    InternalServiceErrorException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVpcIngressConnectionsRequest,
  output: ListVpcIngressConnectionsResponse,
  errors: [InternalServiceErrorException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Update an auto scaling configuration to be the default. The existing default auto scaling configuration will be set to non-default
 * automatically.
 */
export const updateDefaultAutoScalingConfiguration: (
  input: UpdateDefaultAutoScalingConfigurationRequest,
) => Effect.Effect<
  UpdateDefaultAutoScalingConfigurationResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDefaultAutoScalingConfigurationRequest,
  output: UpdateDefaultAutoScalingConfigurationResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
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
export const createAutoScalingConfiguration: (
  input: CreateAutoScalingConfigurationRequest,
) => Effect.Effect<
  CreateAutoScalingConfigurationResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutoScalingConfigurationRequest,
  output: CreateAutoScalingConfigurationResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ServiceQuotaExceededException,
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
export const updateService: (
  input: UpdateServiceRequest,
) => Effect.Effect<
  UpdateServiceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVpcIngressConnection: (
  input: UpdateVpcIngressConnectionRequest,
) => Effect.Effect<
  UpdateVpcIngressConnectionResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVpcIngressConnectionRequest,
  output: UpdateVpcIngressConnectionResponse,
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
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Disassociate a custom domain name from an App Runner service.
 *
 * Certificates tracking domain validity are associated with a custom domain and are stored in AWS
 * Certificate Manager (ACM). These certificates aren't deleted as part of this action. App Runner delays certificate deletion for
 * 30 days after a domain is disassociated from your service.
 */
export const disassociateCustomDomain: (
  input: DisassociateCustomDomainRequest,
) => Effect.Effect<
  DisassociateCustomDomainResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateCustomDomainRequest,
  output: DisassociateCustomDomainResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * List tags that are associated with for an App Runner resource. The response contains a list of tag key-value pairs.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Pause an active App Runner service. App Runner reduces compute capacity for the service to zero and loses state (for example, ephemeral storage is
 * removed).
 *
 * This is an asynchronous operation. On a successful call, you can use the returned `OperationId` and the ListOperations
 * call to track the operation's progress.
 */
export const pauseService: (
  input: PauseServiceRequest,
) => Effect.Effect<
  PauseServiceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const resumeService: (
  input: ResumeServiceRequest,
) => Effect.Effect<
  ResumeServiceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Create an App Runner VPC Ingress Connection resource. App Runner requires this resource when you want to associate your App Runner service with an Amazon VPC endpoint.
 */
export const createVpcIngressConnection: (
  input: CreateVpcIngressConnectionRequest,
) => Effect.Effect<
  CreateVpcIngressConnectionResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcIngressConnectionRequest,
  output: CreateVpcIngressConnectionResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    InvalidStateException,
    ServiceQuotaExceededException,
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
export const deleteService: (
  input: DeleteServiceRequest,
) => Effect.Effect<
  DeleteServiceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVpcIngressConnection: (
  input: DeleteVpcIngressConnectionRequest,
) => Effect.Effect<
  DeleteVpcIngressConnectionResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVpcIngressConnectionRequest,
  output: DeleteVpcIngressConnectionResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    InvalidStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associate your own domain name with the App Runner subdomain URL of your App Runner service.
 *
 * After you call `AssociateCustomDomain` and receive a successful response, use the information in the CustomDomain record
 * that's returned to add CNAME records to your Domain Name System (DNS). For each mapped domain name, add a mapping to the target App Runner subdomain and one or
 * more certificate validation records. App Runner then performs DNS validation to verify that you own or control the domain name that you associated. App Runner tracks
 * domain validity in a certificate stored in AWS Certificate Manager (ACM).
 */
export const associateCustomDomain: (
  input: AssociateCustomDomainRequest,
) => Effect.Effect<
  AssociateCustomDomainResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateCustomDomainRequest,
  output: AssociateCustomDomainResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    InvalidStateException,
  ],
}));
/**
 * Delete an App Runner connection. You must first ensure that there are no running App Runner services that use this connection. If there are any, the
 * `DeleteConnection` action fails.
 */
export const deleteConnection: (
  input: DeleteConnectionRequest,
) => Effect.Effect<
  DeleteConnectionResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: DeleteConnectionResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Delete an App Runner VPC connector resource. You can't delete a
 * connector that's used by one or more App Runner services.
 */
export const deleteVpcConnector: (
  input: DeleteVpcConnectorRequest,
) => Effect.Effect<
  DeleteVpcConnectorResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeAutoScalingConfiguration: (
  input: DescribeAutoScalingConfigurationRequest,
) => Effect.Effect<
  DescribeAutoScalingConfigurationResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeCustomDomains: {
  (
    input: DescribeCustomDomainsRequest,
  ): Effect.Effect<
    DescribeCustomDomainsResponse,
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCustomDomainsRequest,
  ) => Stream.Stream<
    DescribeCustomDomainsResponse,
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCustomDomainsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCustomDomainsRequest,
  output: DescribeCustomDomainsResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Return a full description of an App Runner observability configuration resource.
 */
export const describeObservabilityConfiguration: (
  input: DescribeObservabilityConfigurationRequest,
) => Effect.Effect<
  DescribeObservabilityConfigurationResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeService: (
  input: DescribeServiceRequest,
) => Effect.Effect<
  DescribeServiceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeVpcConnector: (
  input: DescribeVpcConnectorRequest,
) => Effect.Effect<
  DescribeVpcConnectorResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVpcConnectorRequest,
  output: DescribeVpcConnectorResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Return a full description of an App Runner VPC Ingress Connection resource.
 */
export const describeVpcIngressConnection: (
  input: DescribeVpcIngressConnectionRequest,
) => Effect.Effect<
  DescribeVpcIngressConnectionResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listServicesForAutoScalingConfiguration: {
  (
    input: ListServicesForAutoScalingConfigurationRequest,
  ): Effect.Effect<
    ListServicesForAutoScalingConfigurationResponse,
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServicesForAutoScalingConfigurationRequest,
  ) => Stream.Stream<
    ListServicesForAutoScalingConfigurationResponse,
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServicesForAutoScalingConfigurationRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServicesForAutoScalingConfigurationRequest,
  output: ListServicesForAutoScalingConfigurationResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
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
export const startDeployment: (
  input: StartDeploymentRequest,
) => Effect.Effect<
  StartDeploymentResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDeploymentRequest,
  output: StartDeploymentResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Delete an App Runner automatic scaling configuration resource. You can delete a top level auto scaling configuration, a specific revision of one, or all
 * revisions associated with the top level configuration. You can't delete the default auto scaling configuration or a configuration that's used by one or
 * more App Runner services.
 */
export const deleteAutoScalingConfiguration: (
  input: DeleteAutoScalingConfigurationRequest,
) => Effect.Effect<
  DeleteAutoScalingConfigurationResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAutoScalingConfigurationRequest,
  output: DeleteAutoScalingConfigurationResponse,
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
export const deleteObservabilityConfiguration: (
  input: DeleteObservabilityConfigurationRequest,
) => Effect.Effect<
  DeleteObservabilityConfigurationResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteObservabilityConfigurationRequest,
  output: DeleteObservabilityConfigurationResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Return a list of operations that occurred on an App Runner service.
 *
 * The resulting list of OperationSummary objects is sorted in reverse chronological order. The first object on the list represents the
 * last started operation.
 */
export const listOperations: {
  (
    input: ListOperationsRequest,
  ): Effect.Effect<
    ListOperationsResponse,
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOperationsRequest,
  ) => Stream.Stream<
    ListOperationsResponse,
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOperationsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOperationsRequest,
  output: ListOperationsResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Add tags to, or update the tag values of, an App Runner resource. A tag is a key-value pair.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | InvalidStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Create an App Runner connection resource. App Runner requires a connection resource when you create App Runner services that access private repositories from
 * certain third-party providers. You can share a connection across multiple services.
 *
 * A connection resource is needed to access GitHub and Bitbucket repositories. Both require
 * a user interface approval process through the App Runner console before you can use the
 * connection.
 */
export const createConnection: (
  input: CreateConnectionRequest,
) => Effect.Effect<
  CreateConnectionResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createObservabilityConfiguration: (
  input: CreateObservabilityConfigurationRequest,
) => Effect.Effect<
  CreateObservabilityConfigurationResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createVpcConnector: (
  input: CreateVpcConnectorRequest,
) => Effect.Effect<
  CreateVpcConnectorResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVpcConnectorRequest,
  output: CreateVpcConnectorResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Create an App Runner service. After the service is created, the action also automatically starts a deployment.
 *
 * This is an asynchronous operation. On a successful call, you can use the returned `OperationId` and the ListOperations call to track the operation's progress.
 */
export const createService: (
  input: CreateServiceRequest,
) => Effect.Effect<
  CreateServiceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceRequest,
  output: CreateServiceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ServiceQuotaExceededException,
  ],
}));

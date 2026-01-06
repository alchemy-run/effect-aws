import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials as Creds } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace(
  "http://elasticmapreduce.amazonaws.com/doc/2009-03-31",
);
const svc = T.AwsApiService({
  sdkId: "EMR",
  serviceShapeName: "ElasticMapReduce",
});
const auth = T.AwsAuthSigv4({ name: "elasticmapreduce" });
const ver = T.ServiceVersion("2009-03-31");
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
                        url: "https://elasticmapreduce-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://elasticmapreduce.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://elasticmapreduce-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://elasticmapreduce.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://elasticmapreduce.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type XmlStringMaxLen256 = string;
export type ArnType = string;
export type ResourceId = string;
export type XmlString = string;
export type ClusterId = string;
export type MaxResultsNumber = number;
export type StepId = string;
export type Marker = string;
export type InstanceGroupId = string;
export type InstanceFleetId = string;
export type Integer = number;
export type WholeNumber = number;
export type InstanceType = string;
export type InstanceId = string;
export type Long = number;
export type UtilizationPerformanceIndexInteger = number;
export type IAMRoleArn = string;
export type UriString = string;
export type ErrorCode = string;
export type ErrorMessage = string;
export type NonNegativeDouble = number;
export type Port = number;
export type OptionalArnType = string;
export type Float = number;
export type ThroughputVal = number;

//# Schemas
export interface GetBlockPublicAccessConfigurationInput {}
export const GetBlockPublicAccessConfigurationInput = S.suspend(() =>
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
  identifier: "GetBlockPublicAccessConfigurationInput",
}) as any as S.Schema<GetBlockPublicAccessConfigurationInput>;
export type StepIdsList = string[];
export const StepIdsList = S.Array(S.String);
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type XmlStringList = string[];
export const XmlStringList = S.Array(S.String);
export type JobFlowExecutionStateList = string[];
export const JobFlowExecutionStateList = S.Array(S.String);
export type ClusterStateList = string[];
export const ClusterStateList = S.Array(S.String);
export type InstanceGroupTypeList = string[];
export const InstanceGroupTypeList = S.Array(S.String);
export type InstanceStateList = string[];
export const InstanceStateList = S.Array(S.String);
export type StepStateList = string[];
export const StepStateList = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export type SupportedProductsList = string[];
export const SupportedProductsList = S.Array(S.String);
export interface CancelStepsInput {
  ClusterId: string;
  StepIds: StepIdsList;
  StepCancellationOption?: string;
}
export const CancelStepsInput = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    StepIds: StepIdsList,
    StepCancellationOption: S.optional(S.String),
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
  identifier: "CancelStepsInput",
}) as any as S.Schema<CancelStepsInput>;
export interface CreateSecurityConfigurationInput {
  Name: string;
  SecurityConfiguration: string;
}
export const CreateSecurityConfigurationInput = S.suspend(() =>
  S.Struct({ Name: S.String, SecurityConfiguration: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSecurityConfigurationInput",
}) as any as S.Schema<CreateSecurityConfigurationInput>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateStudioInput {
  Name: string;
  Description?: string;
  AuthMode: string;
  VpcId: string;
  SubnetIds: SubnetIdList;
  ServiceRole: string;
  UserRole?: string;
  WorkspaceSecurityGroupId: string;
  EngineSecurityGroupId: string;
  DefaultS3Location: string;
  IdpAuthUrl?: string;
  IdpRelayStateParameterName?: string;
  Tags?: TagList;
  TrustedIdentityPropagationEnabled?: boolean;
  IdcUserAssignment?: string;
  IdcInstanceArn?: string;
  EncryptionKeyArn?: string;
}
export const CreateStudioInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    AuthMode: S.String,
    VpcId: S.String,
    SubnetIds: SubnetIdList,
    ServiceRole: S.String,
    UserRole: S.optional(S.String),
    WorkspaceSecurityGroupId: S.String,
    EngineSecurityGroupId: S.String,
    DefaultS3Location: S.String,
    IdpAuthUrl: S.optional(S.String),
    IdpRelayStateParameterName: S.optional(S.String),
    Tags: S.optional(TagList),
    TrustedIdentityPropagationEnabled: S.optional(S.Boolean),
    IdcUserAssignment: S.optional(S.String),
    IdcInstanceArn: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
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
  identifier: "CreateStudioInput",
}) as any as S.Schema<CreateStudioInput>;
export interface CreateStudioSessionMappingInput {
  StudioId: string;
  IdentityId?: string;
  IdentityName?: string;
  IdentityType: string;
  SessionPolicyArn: string;
}
export const CreateStudioSessionMappingInput = S.suspend(() =>
  S.Struct({
    StudioId: S.String,
    IdentityId: S.optional(S.String),
    IdentityName: S.optional(S.String),
    IdentityType: S.String,
    SessionPolicyArn: S.String,
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
  identifier: "CreateStudioSessionMappingInput",
}) as any as S.Schema<CreateStudioSessionMappingInput>;
export interface CreateStudioSessionMappingResponse {}
export const CreateStudioSessionMappingResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateStudioSessionMappingResponse",
}) as any as S.Schema<CreateStudioSessionMappingResponse>;
export interface DeleteSecurityConfigurationInput {
  Name: string;
}
export const DeleteSecurityConfigurationInput = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSecurityConfigurationInput",
}) as any as S.Schema<DeleteSecurityConfigurationInput>;
export interface DeleteSecurityConfigurationOutput {}
export const DeleteSecurityConfigurationOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSecurityConfigurationOutput",
}) as any as S.Schema<DeleteSecurityConfigurationOutput>;
export interface DeleteStudioInput {
  StudioId: string;
}
export const DeleteStudioInput = S.suspend(() =>
  S.Struct({ StudioId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteStudioInput",
}) as any as S.Schema<DeleteStudioInput>;
export interface DeleteStudioResponse {}
export const DeleteStudioResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteStudioResponse",
}) as any as S.Schema<DeleteStudioResponse>;
export interface DeleteStudioSessionMappingInput {
  StudioId: string;
  IdentityId?: string;
  IdentityName?: string;
  IdentityType: string;
}
export const DeleteStudioSessionMappingInput = S.suspend(() =>
  S.Struct({
    StudioId: S.String,
    IdentityId: S.optional(S.String),
    IdentityName: S.optional(S.String),
    IdentityType: S.String,
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
  identifier: "DeleteStudioSessionMappingInput",
}) as any as S.Schema<DeleteStudioSessionMappingInput>;
export interface DeleteStudioSessionMappingResponse {}
export const DeleteStudioSessionMappingResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteStudioSessionMappingResponse",
}) as any as S.Schema<DeleteStudioSessionMappingResponse>;
export interface DescribeClusterInput {
  ClusterId: string;
}
export const DescribeClusterInput = S.suspend(() =>
  S.Struct({ ClusterId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterInput",
}) as any as S.Schema<DescribeClusterInput>;
export interface DescribeJobFlowsInput {
  CreatedAfter?: Date;
  CreatedBefore?: Date;
  JobFlowIds?: XmlStringList;
  JobFlowStates?: JobFlowExecutionStateList;
}
export const DescribeJobFlowsInput = S.suspend(() =>
  S.Struct({
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobFlowIds: S.optional(XmlStringList),
    JobFlowStates: S.optional(JobFlowExecutionStateList),
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
  identifier: "DescribeJobFlowsInput",
}) as any as S.Schema<DescribeJobFlowsInput>;
export interface DescribeNotebookExecutionInput {
  NotebookExecutionId: string;
}
export const DescribeNotebookExecutionInput = S.suspend(() =>
  S.Struct({ NotebookExecutionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeNotebookExecutionInput",
}) as any as S.Schema<DescribeNotebookExecutionInput>;
export interface DescribePersistentAppUIInput {
  PersistentAppUIId: string;
}
export const DescribePersistentAppUIInput = S.suspend(() =>
  S.Struct({ PersistentAppUIId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePersistentAppUIInput",
}) as any as S.Schema<DescribePersistentAppUIInput>;
export interface DescribeReleaseLabelInput {
  ReleaseLabel?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeReleaseLabelInput = S.suspend(() =>
  S.Struct({
    ReleaseLabel: S.optional(S.String),
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
  identifier: "DescribeReleaseLabelInput",
}) as any as S.Schema<DescribeReleaseLabelInput>;
export interface DescribeSecurityConfigurationInput {
  Name: string;
}
export const DescribeSecurityConfigurationInput = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSecurityConfigurationInput",
}) as any as S.Schema<DescribeSecurityConfigurationInput>;
export interface DescribeStepInput {
  ClusterId: string;
  StepId: string;
}
export const DescribeStepInput = S.suspend(() =>
  S.Struct({ ClusterId: S.String, StepId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeStepInput",
}) as any as S.Schema<DescribeStepInput>;
export interface DescribeStudioInput {
  StudioId: string;
}
export const DescribeStudioInput = S.suspend(() =>
  S.Struct({ StudioId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeStudioInput",
}) as any as S.Schema<DescribeStudioInput>;
export interface GetAutoTerminationPolicyInput {
  ClusterId: string;
}
export const GetAutoTerminationPolicyInput = S.suspend(() =>
  S.Struct({ ClusterId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutoTerminationPolicyInput",
}) as any as S.Schema<GetAutoTerminationPolicyInput>;
export interface GetClusterSessionCredentialsInput {
  ClusterId: string;
  ExecutionRoleArn?: string;
}
export const GetClusterSessionCredentialsInput = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    ExecutionRoleArn: S.optional(S.String),
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
  identifier: "GetClusterSessionCredentialsInput",
}) as any as S.Schema<GetClusterSessionCredentialsInput>;
export interface GetManagedScalingPolicyInput {
  ClusterId: string;
}
export const GetManagedScalingPolicyInput = S.suspend(() =>
  S.Struct({ ClusterId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetManagedScalingPolicyInput",
}) as any as S.Schema<GetManagedScalingPolicyInput>;
export interface GetOnClusterAppUIPresignedURLInput {
  ClusterId: string;
  OnClusterAppUIType?: string;
  ApplicationId?: string;
  DryRun?: boolean;
  ExecutionRoleArn?: string;
}
export const GetOnClusterAppUIPresignedURLInput = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    OnClusterAppUIType: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
    ExecutionRoleArn: S.optional(S.String),
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
  identifier: "GetOnClusterAppUIPresignedURLInput",
}) as any as S.Schema<GetOnClusterAppUIPresignedURLInput>;
export interface GetPersistentAppUIPresignedURLInput {
  PersistentAppUIId: string;
  PersistentAppUIType?: string;
  ApplicationId?: string;
  AuthProxyCall?: boolean;
  ExecutionRoleArn?: string;
}
export const GetPersistentAppUIPresignedURLInput = S.suspend(() =>
  S.Struct({
    PersistentAppUIId: S.String,
    PersistentAppUIType: S.optional(S.String),
    ApplicationId: S.optional(S.String),
    AuthProxyCall: S.optional(S.Boolean),
    ExecutionRoleArn: S.optional(S.String),
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
  identifier: "GetPersistentAppUIPresignedURLInput",
}) as any as S.Schema<GetPersistentAppUIPresignedURLInput>;
export interface GetStudioSessionMappingInput {
  StudioId: string;
  IdentityId?: string;
  IdentityName?: string;
  IdentityType: string;
}
export const GetStudioSessionMappingInput = S.suspend(() =>
  S.Struct({
    StudioId: S.String,
    IdentityId: S.optional(S.String),
    IdentityName: S.optional(S.String),
    IdentityType: S.String,
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
  identifier: "GetStudioSessionMappingInput",
}) as any as S.Schema<GetStudioSessionMappingInput>;
export interface ListBootstrapActionsInput {
  ClusterId: string;
  Marker?: string;
}
export const ListBootstrapActionsInput = S.suspend(() =>
  S.Struct({ ClusterId: S.String, Marker: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBootstrapActionsInput",
}) as any as S.Schema<ListBootstrapActionsInput>;
export interface ListClustersInput {
  CreatedAfter?: Date;
  CreatedBefore?: Date;
  ClusterStates?: ClusterStateList;
  Marker?: string;
}
export const ListClustersInput = S.suspend(() =>
  S.Struct({
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ClusterStates: S.optional(ClusterStateList),
    Marker: S.optional(S.String),
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
  identifier: "ListClustersInput",
}) as any as S.Schema<ListClustersInput>;
export interface ListInstanceFleetsInput {
  ClusterId: string;
  Marker?: string;
}
export const ListInstanceFleetsInput = S.suspend(() =>
  S.Struct({ ClusterId: S.String, Marker: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInstanceFleetsInput",
}) as any as S.Schema<ListInstanceFleetsInput>;
export interface ListInstanceGroupsInput {
  ClusterId: string;
  Marker?: string;
}
export const ListInstanceGroupsInput = S.suspend(() =>
  S.Struct({ ClusterId: S.String, Marker: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInstanceGroupsInput",
}) as any as S.Schema<ListInstanceGroupsInput>;
export interface ListInstancesInput {
  ClusterId: string;
  InstanceGroupId?: string;
  InstanceGroupTypes?: InstanceGroupTypeList;
  InstanceFleetId?: string;
  InstanceFleetType?: string;
  InstanceStates?: InstanceStateList;
  Marker?: string;
}
export const ListInstancesInput = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    InstanceGroupId: S.optional(S.String),
    InstanceGroupTypes: S.optional(InstanceGroupTypeList),
    InstanceFleetId: S.optional(S.String),
    InstanceFleetType: S.optional(S.String),
    InstanceStates: S.optional(InstanceStateList),
    Marker: S.optional(S.String),
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
  identifier: "ListInstancesInput",
}) as any as S.Schema<ListInstancesInput>;
export interface ListNotebookExecutionsInput {
  EditorId?: string;
  Status?: string;
  From?: Date;
  To?: Date;
  Marker?: string;
  ExecutionEngineId?: string;
}
export const ListNotebookExecutionsInput = S.suspend(() =>
  S.Struct({
    EditorId: S.optional(S.String),
    Status: S.optional(S.String),
    From: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    To: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Marker: S.optional(S.String),
    ExecutionEngineId: S.optional(S.String),
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
  identifier: "ListNotebookExecutionsInput",
}) as any as S.Schema<ListNotebookExecutionsInput>;
export interface ListSecurityConfigurationsInput {
  Marker?: string;
}
export const ListSecurityConfigurationsInput = S.suspend(() =>
  S.Struct({ Marker: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSecurityConfigurationsInput",
}) as any as S.Schema<ListSecurityConfigurationsInput>;
export interface ListStepsInput {
  ClusterId: string;
  StepStates?: StepStateList;
  StepIds?: XmlStringList;
  Marker?: string;
}
export const ListStepsInput = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    StepStates: S.optional(StepStateList),
    StepIds: S.optional(XmlStringList),
    Marker: S.optional(S.String),
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
  identifier: "ListStepsInput",
}) as any as S.Schema<ListStepsInput>;
export interface ListStudiosInput {
  Marker?: string;
}
export const ListStudiosInput = S.suspend(() =>
  S.Struct({ Marker: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStudiosInput",
}) as any as S.Schema<ListStudiosInput>;
export interface ListStudioSessionMappingsInput {
  StudioId?: string;
  IdentityType?: string;
  Marker?: string;
}
export const ListStudioSessionMappingsInput = S.suspend(() =>
  S.Struct({
    StudioId: S.optional(S.String),
    IdentityType: S.optional(S.String),
    Marker: S.optional(S.String),
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
  identifier: "ListStudioSessionMappingsInput",
}) as any as S.Schema<ListStudioSessionMappingsInput>;
export interface ListSupportedInstanceTypesInput {
  ReleaseLabel: string;
  Marker?: string;
}
export const ListSupportedInstanceTypesInput = S.suspend(() =>
  S.Struct({ ReleaseLabel: S.String, Marker: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSupportedInstanceTypesInput",
}) as any as S.Schema<ListSupportedInstanceTypesInput>;
export interface ModifyClusterInput {
  ClusterId: string;
  StepConcurrencyLevel?: number;
  ExtendedSupport?: boolean;
}
export const ModifyClusterInput = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    StepConcurrencyLevel: S.optional(S.Number),
    ExtendedSupport: S.optional(S.Boolean),
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
  identifier: "ModifyClusterInput",
}) as any as S.Schema<ModifyClusterInput>;
export interface PortRange {
  MinRange: number;
  MaxRange?: number;
}
export const PortRange = S.suspend(() =>
  S.Struct({ MinRange: S.Number, MaxRange: S.optional(S.Number) }),
).annotations({ identifier: "PortRange" }) as any as S.Schema<PortRange>;
export type PortRanges = PortRange[];
export const PortRanges = S.Array(PortRange);
export type ConfigurationList = Configuration[];
export const ConfigurationList = S.Array(
  S.suspend((): S.Schema<Configuration, any> => Configuration).annotations({
    identifier: "Configuration",
  }),
) as any as S.Schema<ConfigurationList>;
export type StringMap = { [key: string]: string };
export const StringMap = S.Record({ key: S.String, value: S.String });
export interface BlockPublicAccessConfiguration {
  BlockPublicSecurityGroupRules: boolean;
  PermittedPublicSecurityGroupRuleRanges?: PortRanges;
  Classification?: string;
  Configurations?: ConfigurationList;
  Properties?: StringMap;
}
export const BlockPublicAccessConfiguration = S.suspend(() =>
  S.Struct({
    BlockPublicSecurityGroupRules: S.Boolean,
    PermittedPublicSecurityGroupRuleRanges: S.optional(PortRanges),
    Classification: S.optional(S.String),
    Configurations: S.optional(ConfigurationList),
    Properties: S.optional(StringMap),
  }),
).annotations({
  identifier: "BlockPublicAccessConfiguration",
}) as any as S.Schema<BlockPublicAccessConfiguration>;
export interface PutBlockPublicAccessConfigurationInput {
  BlockPublicAccessConfiguration: BlockPublicAccessConfiguration;
}
export const PutBlockPublicAccessConfigurationInput = S.suspend(() =>
  S.Struct({
    BlockPublicAccessConfiguration: BlockPublicAccessConfiguration,
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
  identifier: "PutBlockPublicAccessConfigurationInput",
}) as any as S.Schema<PutBlockPublicAccessConfigurationInput>;
export interface PutBlockPublicAccessConfigurationOutput {}
export const PutBlockPublicAccessConfigurationOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutBlockPublicAccessConfigurationOutput",
}) as any as S.Schema<PutBlockPublicAccessConfigurationOutput>;
export interface RemoveAutoScalingPolicyInput {
  ClusterId: string;
  InstanceGroupId: string;
}
export const RemoveAutoScalingPolicyInput = S.suspend(() =>
  S.Struct({ ClusterId: S.String, InstanceGroupId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveAutoScalingPolicyInput",
}) as any as S.Schema<RemoveAutoScalingPolicyInput>;
export interface RemoveAutoScalingPolicyOutput {}
export const RemoveAutoScalingPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveAutoScalingPolicyOutput",
}) as any as S.Schema<RemoveAutoScalingPolicyOutput>;
export interface RemoveAutoTerminationPolicyInput {
  ClusterId: string;
}
export const RemoveAutoTerminationPolicyInput = S.suspend(() =>
  S.Struct({ ClusterId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveAutoTerminationPolicyInput",
}) as any as S.Schema<RemoveAutoTerminationPolicyInput>;
export interface RemoveAutoTerminationPolicyOutput {}
export const RemoveAutoTerminationPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveAutoTerminationPolicyOutput",
}) as any as S.Schema<RemoveAutoTerminationPolicyOutput>;
export interface RemoveManagedScalingPolicyInput {
  ClusterId: string;
}
export const RemoveManagedScalingPolicyInput = S.suspend(() =>
  S.Struct({ ClusterId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveManagedScalingPolicyInput",
}) as any as S.Schema<RemoveManagedScalingPolicyInput>;
export interface RemoveManagedScalingPolicyOutput {}
export const RemoveManagedScalingPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveManagedScalingPolicyOutput",
}) as any as S.Schema<RemoveManagedScalingPolicyOutput>;
export interface RemoveTagsInput {
  ResourceId: string;
  TagKeys: StringList;
}
export const RemoveTagsInput = S.suspend(() =>
  S.Struct({ ResourceId: S.String, TagKeys: StringList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveTagsInput",
}) as any as S.Schema<RemoveTagsInput>;
export interface RemoveTagsOutput {}
export const RemoveTagsOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTagsOutput",
}) as any as S.Schema<RemoveTagsOutput>;
export interface SetKeepJobFlowAliveWhenNoStepsInput {
  JobFlowIds: XmlStringList;
  KeepJobFlowAliveWhenNoSteps: boolean;
}
export const SetKeepJobFlowAliveWhenNoStepsInput = S.suspend(() =>
  S.Struct({
    JobFlowIds: XmlStringList,
    KeepJobFlowAliveWhenNoSteps: S.Boolean,
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
  identifier: "SetKeepJobFlowAliveWhenNoStepsInput",
}) as any as S.Schema<SetKeepJobFlowAliveWhenNoStepsInput>;
export interface SetKeepJobFlowAliveWhenNoStepsResponse {}
export const SetKeepJobFlowAliveWhenNoStepsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetKeepJobFlowAliveWhenNoStepsResponse",
}) as any as S.Schema<SetKeepJobFlowAliveWhenNoStepsResponse>;
export interface SetTerminationProtectionInput {
  JobFlowIds: XmlStringList;
  TerminationProtected: boolean;
}
export const SetTerminationProtectionInput = S.suspend(() =>
  S.Struct({ JobFlowIds: XmlStringList, TerminationProtected: S.Boolean }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetTerminationProtectionInput",
}) as any as S.Schema<SetTerminationProtectionInput>;
export interface SetTerminationProtectionResponse {}
export const SetTerminationProtectionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetTerminationProtectionResponse",
}) as any as S.Schema<SetTerminationProtectionResponse>;
export interface SetUnhealthyNodeReplacementInput {
  JobFlowIds: XmlStringList;
  UnhealthyNodeReplacement: boolean;
}
export const SetUnhealthyNodeReplacementInput = S.suspend(() =>
  S.Struct({
    JobFlowIds: XmlStringList,
    UnhealthyNodeReplacement: S.Boolean,
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
  identifier: "SetUnhealthyNodeReplacementInput",
}) as any as S.Schema<SetUnhealthyNodeReplacementInput>;
export interface SetUnhealthyNodeReplacementResponse {}
export const SetUnhealthyNodeReplacementResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetUnhealthyNodeReplacementResponse",
}) as any as S.Schema<SetUnhealthyNodeReplacementResponse>;
export interface SetVisibleToAllUsersInput {
  JobFlowIds: XmlStringList;
  VisibleToAllUsers: boolean;
}
export const SetVisibleToAllUsersInput = S.suspend(() =>
  S.Struct({ JobFlowIds: XmlStringList, VisibleToAllUsers: S.Boolean }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetVisibleToAllUsersInput",
}) as any as S.Schema<SetVisibleToAllUsersInput>;
export interface SetVisibleToAllUsersResponse {}
export const SetVisibleToAllUsersResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetVisibleToAllUsersResponse",
}) as any as S.Schema<SetVisibleToAllUsersResponse>;
export interface StopNotebookExecutionInput {
  NotebookExecutionId: string;
}
export const StopNotebookExecutionInput = S.suspend(() =>
  S.Struct({ NotebookExecutionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopNotebookExecutionInput",
}) as any as S.Schema<StopNotebookExecutionInput>;
export interface StopNotebookExecutionResponse {}
export const StopNotebookExecutionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "StopNotebookExecutionResponse",
}) as any as S.Schema<StopNotebookExecutionResponse>;
export interface TerminateJobFlowsInput {
  JobFlowIds: XmlStringList;
}
export const TerminateJobFlowsInput = S.suspend(() =>
  S.Struct({ JobFlowIds: XmlStringList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TerminateJobFlowsInput",
}) as any as S.Schema<TerminateJobFlowsInput>;
export interface TerminateJobFlowsResponse {}
export const TerminateJobFlowsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TerminateJobFlowsResponse",
}) as any as S.Schema<TerminateJobFlowsResponse>;
export interface UpdateStudioInput {
  StudioId: string;
  Name?: string;
  Description?: string;
  SubnetIds?: SubnetIdList;
  DefaultS3Location?: string;
  EncryptionKeyArn?: string;
}
export const UpdateStudioInput = S.suspend(() =>
  S.Struct({
    StudioId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    SubnetIds: S.optional(SubnetIdList),
    DefaultS3Location: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
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
  identifier: "UpdateStudioInput",
}) as any as S.Schema<UpdateStudioInput>;
export interface UpdateStudioResponse {}
export const UpdateStudioResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateStudioResponse",
}) as any as S.Schema<UpdateStudioResponse>;
export interface UpdateStudioSessionMappingInput {
  StudioId: string;
  IdentityId?: string;
  IdentityName?: string;
  IdentityType: string;
  SessionPolicyArn: string;
}
export const UpdateStudioSessionMappingInput = S.suspend(() =>
  S.Struct({
    StudioId: S.String,
    IdentityId: S.optional(S.String),
    IdentityName: S.optional(S.String),
    IdentityType: S.String,
    SessionPolicyArn: S.String,
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
  identifier: "UpdateStudioSessionMappingInput",
}) as any as S.Schema<UpdateStudioSessionMappingInput>;
export interface UpdateStudioSessionMappingResponse {}
export const UpdateStudioSessionMappingResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateStudioSessionMappingResponse",
}) as any as S.Schema<UpdateStudioSessionMappingResponse>;
export type EC2InstanceIdsToTerminateList = string[];
export const EC2InstanceIdsToTerminateList = S.Array(S.String);
export interface VolumeSpecification {
  VolumeType: string;
  Iops?: number;
  SizeInGB: number;
  Throughput?: number;
}
export const VolumeSpecification = S.suspend(() =>
  S.Struct({
    VolumeType: S.String,
    Iops: S.optional(S.Number),
    SizeInGB: S.Number,
    Throughput: S.optional(S.Number),
  }),
).annotations({
  identifier: "VolumeSpecification",
}) as any as S.Schema<VolumeSpecification>;
export interface EbsBlockDeviceConfig {
  VolumeSpecification: VolumeSpecification;
  VolumesPerInstance?: number;
}
export const EbsBlockDeviceConfig = S.suspend(() =>
  S.Struct({
    VolumeSpecification: VolumeSpecification,
    VolumesPerInstance: S.optional(S.Number),
  }),
).annotations({
  identifier: "EbsBlockDeviceConfig",
}) as any as S.Schema<EbsBlockDeviceConfig>;
export type EbsBlockDeviceConfigList = EbsBlockDeviceConfig[];
export const EbsBlockDeviceConfigList = S.Array(EbsBlockDeviceConfig);
export interface EbsConfiguration {
  EbsBlockDeviceConfigs?: EbsBlockDeviceConfigList;
  EbsOptimized?: boolean;
}
export const EbsConfiguration = S.suspend(() =>
  S.Struct({
    EbsBlockDeviceConfigs: S.optional(EbsBlockDeviceConfigList),
    EbsOptimized: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EbsConfiguration",
}) as any as S.Schema<EbsConfiguration>;
export interface InstanceTypeConfig {
  InstanceType: string;
  WeightedCapacity?: number;
  BidPrice?: string;
  BidPriceAsPercentageOfOnDemandPrice?: number;
  EbsConfiguration?: EbsConfiguration;
  Configurations?: ConfigurationList;
  CustomAmiId?: string;
  Priority?: number;
}
export const InstanceTypeConfig = S.suspend(() =>
  S.Struct({
    InstanceType: S.String,
    WeightedCapacity: S.optional(S.Number),
    BidPrice: S.optional(S.String),
    BidPriceAsPercentageOfOnDemandPrice: S.optional(S.Number),
    EbsConfiguration: S.optional(EbsConfiguration),
    Configurations: S.optional(ConfigurationList),
    CustomAmiId: S.optional(S.String),
    Priority: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceTypeConfig",
}) as any as S.Schema<InstanceTypeConfig>;
export type InstanceTypeConfigList = InstanceTypeConfig[];
export const InstanceTypeConfigList = S.Array(InstanceTypeConfig);
export interface SpotProvisioningSpecification {
  TimeoutDurationMinutes: number;
  TimeoutAction: string;
  BlockDurationMinutes?: number;
  AllocationStrategy?: string;
}
export const SpotProvisioningSpecification = S.suspend(() =>
  S.Struct({
    TimeoutDurationMinutes: S.Number,
    TimeoutAction: S.String,
    BlockDurationMinutes: S.optional(S.Number),
    AllocationStrategy: S.optional(S.String),
  }),
).annotations({
  identifier: "SpotProvisioningSpecification",
}) as any as S.Schema<SpotProvisioningSpecification>;
export interface OnDemandCapacityReservationOptions {
  UsageStrategy?: string;
  CapacityReservationPreference?: string;
  CapacityReservationResourceGroupArn?: string;
}
export const OnDemandCapacityReservationOptions = S.suspend(() =>
  S.Struct({
    UsageStrategy: S.optional(S.String),
    CapacityReservationPreference: S.optional(S.String),
    CapacityReservationResourceGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "OnDemandCapacityReservationOptions",
}) as any as S.Schema<OnDemandCapacityReservationOptions>;
export interface OnDemandProvisioningSpecification {
  AllocationStrategy: string;
  CapacityReservationOptions?: OnDemandCapacityReservationOptions;
}
export const OnDemandProvisioningSpecification = S.suspend(() =>
  S.Struct({
    AllocationStrategy: S.String,
    CapacityReservationOptions: S.optional(OnDemandCapacityReservationOptions),
  }),
).annotations({
  identifier: "OnDemandProvisioningSpecification",
}) as any as S.Schema<OnDemandProvisioningSpecification>;
export interface InstanceFleetProvisioningSpecifications {
  SpotSpecification?: SpotProvisioningSpecification;
  OnDemandSpecification?: OnDemandProvisioningSpecification;
}
export const InstanceFleetProvisioningSpecifications = S.suspend(() =>
  S.Struct({
    SpotSpecification: S.optional(SpotProvisioningSpecification),
    OnDemandSpecification: S.optional(OnDemandProvisioningSpecification),
  }),
).annotations({
  identifier: "InstanceFleetProvisioningSpecifications",
}) as any as S.Schema<InstanceFleetProvisioningSpecifications>;
export interface SpotResizingSpecification {
  TimeoutDurationMinutes?: number;
  AllocationStrategy?: string;
}
export const SpotResizingSpecification = S.suspend(() =>
  S.Struct({
    TimeoutDurationMinutes: S.optional(S.Number),
    AllocationStrategy: S.optional(S.String),
  }),
).annotations({
  identifier: "SpotResizingSpecification",
}) as any as S.Schema<SpotResizingSpecification>;
export interface OnDemandResizingSpecification {
  TimeoutDurationMinutes?: number;
  AllocationStrategy?: string;
  CapacityReservationOptions?: OnDemandCapacityReservationOptions;
}
export const OnDemandResizingSpecification = S.suspend(() =>
  S.Struct({
    TimeoutDurationMinutes: S.optional(S.Number),
    AllocationStrategy: S.optional(S.String),
    CapacityReservationOptions: S.optional(OnDemandCapacityReservationOptions),
  }),
).annotations({
  identifier: "OnDemandResizingSpecification",
}) as any as S.Schema<OnDemandResizingSpecification>;
export interface InstanceFleetResizingSpecifications {
  SpotResizeSpecification?: SpotResizingSpecification;
  OnDemandResizeSpecification?: OnDemandResizingSpecification;
}
export const InstanceFleetResizingSpecifications = S.suspend(() =>
  S.Struct({
    SpotResizeSpecification: S.optional(SpotResizingSpecification),
    OnDemandResizeSpecification: S.optional(OnDemandResizingSpecification),
  }),
).annotations({
  identifier: "InstanceFleetResizingSpecifications",
}) as any as S.Schema<InstanceFleetResizingSpecifications>;
export interface InstanceFleetConfig {
  Name?: string;
  InstanceFleetType: string;
  TargetOnDemandCapacity?: number;
  TargetSpotCapacity?: number;
  InstanceTypeConfigs?: InstanceTypeConfigList;
  LaunchSpecifications?: InstanceFleetProvisioningSpecifications;
  ResizeSpecifications?: InstanceFleetResizingSpecifications;
  Context?: string;
}
export const InstanceFleetConfig = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    InstanceFleetType: S.String,
    TargetOnDemandCapacity: S.optional(S.Number),
    TargetSpotCapacity: S.optional(S.Number),
    InstanceTypeConfigs: S.optional(InstanceTypeConfigList),
    LaunchSpecifications: S.optional(InstanceFleetProvisioningSpecifications),
    ResizeSpecifications: S.optional(InstanceFleetResizingSpecifications),
    Context: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceFleetConfig",
}) as any as S.Schema<InstanceFleetConfig>;
export type InstanceFleetConfigList = InstanceFleetConfig[];
export const InstanceFleetConfigList = S.Array(InstanceFleetConfig);
export type XmlStringMaxLen256List = string[];
export const XmlStringMaxLen256List = S.Array(S.String);
export type SecurityGroupsList = string[];
export const SecurityGroupsList = S.Array(S.String);
export interface EMRContainersConfig {
  JobRunId?: string;
}
export const EMRContainersConfig = S.suspend(() =>
  S.Struct({ JobRunId: S.optional(S.String) }),
).annotations({
  identifier: "EMRContainersConfig",
}) as any as S.Schema<EMRContainersConfig>;
export interface BlockPublicAccessConfigurationMetadata {
  CreationDateTime: Date;
  CreatedByArn: string;
}
export const BlockPublicAccessConfigurationMetadata = S.suspend(() =>
  S.Struct({
    CreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    CreatedByArn: S.String,
  }),
).annotations({
  identifier: "BlockPublicAccessConfigurationMetadata",
}) as any as S.Schema<BlockPublicAccessConfigurationMetadata>;
export interface ReleaseLabelFilter {
  Prefix?: string;
  Application?: string;
}
export const ReleaseLabelFilter = S.suspend(() =>
  S.Struct({ Prefix: S.optional(S.String), Application: S.optional(S.String) }),
).annotations({
  identifier: "ReleaseLabelFilter",
}) as any as S.Schema<ReleaseLabelFilter>;
export interface InstanceFleetModifyConfig {
  InstanceFleetId: string;
  TargetOnDemandCapacity?: number;
  TargetSpotCapacity?: number;
  ResizeSpecifications?: InstanceFleetResizingSpecifications;
  InstanceTypeConfigs?: InstanceTypeConfigList;
  Context?: string;
}
export const InstanceFleetModifyConfig = S.suspend(() =>
  S.Struct({
    InstanceFleetId: S.String,
    TargetOnDemandCapacity: S.optional(S.Number),
    TargetSpotCapacity: S.optional(S.Number),
    ResizeSpecifications: S.optional(InstanceFleetResizingSpecifications),
    InstanceTypeConfigs: S.optional(InstanceTypeConfigList),
    Context: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceFleetModifyConfig",
}) as any as S.Schema<InstanceFleetModifyConfig>;
export interface AutoTerminationPolicy {
  IdleTimeout?: number;
}
export const AutoTerminationPolicy = S.suspend(() =>
  S.Struct({ IdleTimeout: S.optional(S.Number) }),
).annotations({
  identifier: "AutoTerminationPolicy",
}) as any as S.Schema<AutoTerminationPolicy>;
export interface SupportedProductConfig {
  Name?: string;
  Args?: XmlStringList;
}
export const SupportedProductConfig = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Args: S.optional(XmlStringList) }),
).annotations({
  identifier: "SupportedProductConfig",
}) as any as S.Schema<SupportedProductConfig>;
export type NewSupportedProductsList = SupportedProductConfig[];
export const NewSupportedProductsList = S.Array(SupportedProductConfig);
export interface Application {
  Name?: string;
  Version?: string;
  Args?: StringList;
  AdditionalInfo?: StringMap;
}
export const Application = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Version: S.optional(S.String),
    Args: S.optional(StringList),
    AdditionalInfo: S.optional(StringMap),
  }),
).annotations({ identifier: "Application" }) as any as S.Schema<Application>;
export type ApplicationList = Application[];
export const ApplicationList = S.Array(Application);
export interface Configuration {
  Classification?: string;
  Configurations?: ConfigurationList;
  Properties?: StringMap;
}
export const Configuration = S.suspend(() =>
  S.Struct({
    Classification: S.optional(S.String),
    Configurations: S.optional(
      S.suspend(() => ConfigurationList).annotations({
        identifier: "ConfigurationList",
      }),
    ),
    Properties: S.optional(StringMap),
  }),
).annotations({
  identifier: "Configuration",
}) as any as S.Schema<Configuration>;
export interface KerberosAttributes {
  Realm: string;
  KdcAdminPassword: string;
  CrossRealmTrustPrincipalPassword?: string;
  ADDomainJoinUser?: string;
  ADDomainJoinPassword?: string;
}
export const KerberosAttributes = S.suspend(() =>
  S.Struct({
    Realm: S.String,
    KdcAdminPassword: S.String,
    CrossRealmTrustPrincipalPassword: S.optional(S.String),
    ADDomainJoinUser: S.optional(S.String),
    ADDomainJoinPassword: S.optional(S.String),
  }),
).annotations({
  identifier: "KerberosAttributes",
}) as any as S.Schema<KerberosAttributes>;
export interface PlacementGroupConfig {
  InstanceRole: string;
  PlacementStrategy?: string;
}
export const PlacementGroupConfig = S.suspend(() =>
  S.Struct({ InstanceRole: S.String, PlacementStrategy: S.optional(S.String) }),
).annotations({
  identifier: "PlacementGroupConfig",
}) as any as S.Schema<PlacementGroupConfig>;
export type PlacementGroupConfigList = PlacementGroupConfig[];
export const PlacementGroupConfigList = S.Array(PlacementGroupConfig);
export interface ExecutionEngineConfig {
  Id: string;
  Type?: string;
  MasterInstanceSecurityGroupId?: string;
  ExecutionRoleArn?: string;
}
export const ExecutionEngineConfig = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Type: S.optional(S.String),
    MasterInstanceSecurityGroupId: S.optional(S.String),
    ExecutionRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ExecutionEngineConfig",
}) as any as S.Schema<ExecutionEngineConfig>;
export interface NotebookS3LocationFromInput {
  Bucket?: string;
  Key?: string;
}
export const NotebookS3LocationFromInput = S.suspend(() =>
  S.Struct({ Bucket: S.optional(S.String), Key: S.optional(S.String) }),
).annotations({
  identifier: "NotebookS3LocationFromInput",
}) as any as S.Schema<NotebookS3LocationFromInput>;
export interface OutputNotebookS3LocationFromInput {
  Bucket?: string;
  Key?: string;
}
export const OutputNotebookS3LocationFromInput = S.suspend(() =>
  S.Struct({ Bucket: S.optional(S.String), Key: S.optional(S.String) }),
).annotations({
  identifier: "OutputNotebookS3LocationFromInput",
}) as any as S.Schema<OutputNotebookS3LocationFromInput>;
export type EnvironmentVariablesMap = { [key: string]: string };
export const EnvironmentVariablesMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface AddTagsInput {
  ResourceId: string;
  Tags: TagList;
}
export const AddTagsInput = S.suspend(() =>
  S.Struct({ ResourceId: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "AddTagsInput" }) as any as S.Schema<AddTagsInput>;
export interface AddTagsOutput {}
export const AddTagsOutput = S.suspend(() => S.Struct({}).pipe(ns)).annotations(
  { identifier: "AddTagsOutput" },
) as any as S.Schema<AddTagsOutput>;
export interface CreatePersistentAppUIInput {
  TargetResourceArn: string;
  EMRContainersConfig?: EMRContainersConfig;
  Tags?: TagList;
  XReferer?: string;
  ProfilerType?: string;
}
export const CreatePersistentAppUIInput = S.suspend(() =>
  S.Struct({
    TargetResourceArn: S.String,
    EMRContainersConfig: S.optional(EMRContainersConfig),
    Tags: S.optional(TagList),
    XReferer: S.optional(S.String),
    ProfilerType: S.optional(S.String),
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
  identifier: "CreatePersistentAppUIInput",
}) as any as S.Schema<CreatePersistentAppUIInput>;
export interface CreateSecurityConfigurationOutput {
  Name: string;
  CreationDateTime: Date;
}
export const CreateSecurityConfigurationOutput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    CreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }).pipe(ns),
).annotations({
  identifier: "CreateSecurityConfigurationOutput",
}) as any as S.Schema<CreateSecurityConfigurationOutput>;
export interface CreateStudioOutput {
  StudioId?: string;
  Url?: string;
}
export const CreateStudioOutput = S.suspend(() =>
  S.Struct({ StudioId: S.optional(S.String), Url: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "CreateStudioOutput",
}) as any as S.Schema<CreateStudioOutput>;
export interface DescribeSecurityConfigurationOutput {
  Name?: string;
  SecurityConfiguration?: string;
  CreationDateTime?: Date;
}
export const DescribeSecurityConfigurationOutput = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
    CreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSecurityConfigurationOutput",
}) as any as S.Schema<DescribeSecurityConfigurationOutput>;
export interface GetAutoTerminationPolicyOutput {
  AutoTerminationPolicy?: AutoTerminationPolicy;
}
export const GetAutoTerminationPolicyOutput = S.suspend(() =>
  S.Struct({ AutoTerminationPolicy: S.optional(AutoTerminationPolicy) }).pipe(
    ns,
  ),
).annotations({
  identifier: "GetAutoTerminationPolicyOutput",
}) as any as S.Schema<GetAutoTerminationPolicyOutput>;
export interface ComputeLimits {
  UnitType: string;
  MinimumCapacityUnits: number;
  MaximumCapacityUnits: number;
  MaximumOnDemandCapacityUnits?: number;
  MaximumCoreCapacityUnits?: number;
}
export const ComputeLimits = S.suspend(() =>
  S.Struct({
    UnitType: S.String,
    MinimumCapacityUnits: S.Number,
    MaximumCapacityUnits: S.Number,
    MaximumOnDemandCapacityUnits: S.optional(S.Number),
    MaximumCoreCapacityUnits: S.optional(S.Number),
  }),
).annotations({
  identifier: "ComputeLimits",
}) as any as S.Schema<ComputeLimits>;
export interface ManagedScalingPolicy {
  ComputeLimits?: ComputeLimits;
  UtilizationPerformanceIndex?: number;
  ScalingStrategy?: string;
}
export const ManagedScalingPolicy = S.suspend(() =>
  S.Struct({
    ComputeLimits: S.optional(ComputeLimits),
    UtilizationPerformanceIndex: S.optional(S.Number),
    ScalingStrategy: S.optional(S.String),
  }),
).annotations({
  identifier: "ManagedScalingPolicy",
}) as any as S.Schema<ManagedScalingPolicy>;
export interface GetManagedScalingPolicyOutput {
  ManagedScalingPolicy?: ManagedScalingPolicy;
}
export const GetManagedScalingPolicyOutput = S.suspend(() =>
  S.Struct({ ManagedScalingPolicy: S.optional(ManagedScalingPolicy) }).pipe(ns),
).annotations({
  identifier: "GetManagedScalingPolicyOutput",
}) as any as S.Schema<GetManagedScalingPolicyOutput>;
export interface GetOnClusterAppUIPresignedURLOutput {
  PresignedURLReady?: boolean;
  PresignedURL?: string;
}
export const GetOnClusterAppUIPresignedURLOutput = S.suspend(() =>
  S.Struct({
    PresignedURLReady: S.optional(S.Boolean),
    PresignedURL: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetOnClusterAppUIPresignedURLOutput",
}) as any as S.Schema<GetOnClusterAppUIPresignedURLOutput>;
export interface GetPersistentAppUIPresignedURLOutput {
  PresignedURLReady?: boolean;
  PresignedURL?: string;
}
export const GetPersistentAppUIPresignedURLOutput = S.suspend(() =>
  S.Struct({
    PresignedURLReady: S.optional(S.Boolean),
    PresignedURL: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetPersistentAppUIPresignedURLOutput",
}) as any as S.Schema<GetPersistentAppUIPresignedURLOutput>;
export interface ListReleaseLabelsInput {
  Filters?: ReleaseLabelFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListReleaseLabelsInput = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ReleaseLabelFilter),
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
  identifier: "ListReleaseLabelsInput",
}) as any as S.Schema<ListReleaseLabelsInput>;
export interface ModifyClusterOutput {
  StepConcurrencyLevel?: number;
  ExtendedSupport?: boolean;
}
export const ModifyClusterOutput = S.suspend(() =>
  S.Struct({
    StepConcurrencyLevel: S.optional(S.Number),
    ExtendedSupport: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "ModifyClusterOutput",
}) as any as S.Schema<ModifyClusterOutput>;
export interface ModifyInstanceFleetInput {
  ClusterId: string;
  InstanceFleet: InstanceFleetModifyConfig;
}
export const ModifyInstanceFleetInput = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    InstanceFleet: InstanceFleetModifyConfig,
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
  identifier: "ModifyInstanceFleetInput",
}) as any as S.Schema<ModifyInstanceFleetInput>;
export interface ModifyInstanceFleetResponse {}
export const ModifyInstanceFleetResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ModifyInstanceFleetResponse",
}) as any as S.Schema<ModifyInstanceFleetResponse>;
export interface PutAutoTerminationPolicyInput {
  ClusterId: string;
  AutoTerminationPolicy?: AutoTerminationPolicy;
}
export const PutAutoTerminationPolicyInput = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    AutoTerminationPolicy: S.optional(AutoTerminationPolicy),
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
  identifier: "PutAutoTerminationPolicyInput",
}) as any as S.Schema<PutAutoTerminationPolicyInput>;
export interface PutAutoTerminationPolicyOutput {}
export const PutAutoTerminationPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutAutoTerminationPolicyOutput",
}) as any as S.Schema<PutAutoTerminationPolicyOutput>;
export interface StartNotebookExecutionInput {
  EditorId?: string;
  RelativePath?: string;
  NotebookExecutionName?: string;
  NotebookParams?: string;
  ExecutionEngine: ExecutionEngineConfig;
  ServiceRole: string;
  NotebookInstanceSecurityGroupId?: string;
  Tags?: TagList;
  NotebookS3Location?: NotebookS3LocationFromInput;
  OutputNotebookS3Location?: OutputNotebookS3LocationFromInput;
  OutputNotebookFormat?: string;
  EnvironmentVariables?: EnvironmentVariablesMap;
}
export const StartNotebookExecutionInput = S.suspend(() =>
  S.Struct({
    EditorId: S.optional(S.String),
    RelativePath: S.optional(S.String),
    NotebookExecutionName: S.optional(S.String),
    NotebookParams: S.optional(S.String),
    ExecutionEngine: ExecutionEngineConfig,
    ServiceRole: S.String,
    NotebookInstanceSecurityGroupId: S.optional(S.String),
    Tags: S.optional(TagList),
    NotebookS3Location: S.optional(NotebookS3LocationFromInput),
    OutputNotebookS3Location: S.optional(OutputNotebookS3LocationFromInput),
    OutputNotebookFormat: S.optional(S.String),
    EnvironmentVariables: S.optional(EnvironmentVariablesMap),
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
  identifier: "StartNotebookExecutionInput",
}) as any as S.Schema<StartNotebookExecutionInput>;
export type PersistentAppUITypeList = string[];
export const PersistentAppUITypeList = S.Array(S.String);
export interface ScalingConstraints {
  MinCapacity: number;
  MaxCapacity: number;
}
export const ScalingConstraints = S.suspend(() =>
  S.Struct({ MinCapacity: S.Number, MaxCapacity: S.Number }),
).annotations({
  identifier: "ScalingConstraints",
}) as any as S.Schema<ScalingConstraints>;
export interface PlacementType {
  AvailabilityZone?: string;
  AvailabilityZones?: XmlStringMaxLen256List;
}
export const PlacementType = S.suspend(() =>
  S.Struct({
    AvailabilityZone: S.optional(S.String),
    AvailabilityZones: S.optional(XmlStringMaxLen256List),
  }),
).annotations({
  identifier: "PlacementType",
}) as any as S.Schema<PlacementType>;
export interface ScriptBootstrapActionConfig {
  Path: string;
  Args?: XmlStringList;
}
export const ScriptBootstrapActionConfig = S.suspend(() =>
  S.Struct({ Path: S.String, Args: S.optional(XmlStringList) }),
).annotations({
  identifier: "ScriptBootstrapActionConfig",
}) as any as S.Schema<ScriptBootstrapActionConfig>;
export type EC2InstanceIdsList = string[];
export const EC2InstanceIdsList = S.Array(S.String);
export interface CancelStepsInfo {
  StepId?: string;
  Status?: string;
  Reason?: string;
}
export const CancelStepsInfo = S.suspend(() =>
  S.Struct({
    StepId: S.optional(S.String),
    Status: S.optional(S.String),
    Reason: S.optional(S.String),
  }),
).annotations({
  identifier: "CancelStepsInfo",
}) as any as S.Schema<CancelStepsInfo>;
export type CancelStepsInfoList = CancelStepsInfo[];
export const CancelStepsInfoList = S.Array(CancelStepsInfo);
export interface PersistentAppUI {
  PersistentAppUIId?: string;
  PersistentAppUITypeList?: PersistentAppUITypeList;
  PersistentAppUIStatus?: string;
  AuthorId?: string;
  CreationTime?: Date;
  LastModifiedTime?: Date;
  LastStateChangeReason?: string;
  Tags?: TagList;
}
export const PersistentAppUI = S.suspend(() =>
  S.Struct({
    PersistentAppUIId: S.optional(S.String),
    PersistentAppUITypeList: S.optional(PersistentAppUITypeList),
    PersistentAppUIStatus: S.optional(S.String),
    AuthorId: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastStateChangeReason: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "PersistentAppUI",
}) as any as S.Schema<PersistentAppUI>;
export interface SimplifiedApplication {
  Name?: string;
  Version?: string;
}
export const SimplifiedApplication = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Version: S.optional(S.String) }),
).annotations({
  identifier: "SimplifiedApplication",
}) as any as S.Schema<SimplifiedApplication>;
export type SimplifiedApplicationList = SimplifiedApplication[];
export const SimplifiedApplicationList = S.Array(SimplifiedApplication);
export interface OSRelease {
  Label?: string;
}
export const OSRelease = S.suspend(() =>
  S.Struct({ Label: S.optional(S.String) }),
).annotations({ identifier: "OSRelease" }) as any as S.Schema<OSRelease>;
export type OSReleaseList = OSRelease[];
export const OSReleaseList = S.Array(OSRelease);
export interface Studio {
  StudioId?: string;
  StudioArn?: string;
  Name?: string;
  Description?: string;
  AuthMode?: string;
  VpcId?: string;
  SubnetIds?: SubnetIdList;
  ServiceRole?: string;
  UserRole?: string;
  WorkspaceSecurityGroupId?: string;
  EngineSecurityGroupId?: string;
  Url?: string;
  CreationTime?: Date;
  DefaultS3Location?: string;
  IdpAuthUrl?: string;
  IdpRelayStateParameterName?: string;
  Tags?: TagList;
  IdcInstanceArn?: string;
  TrustedIdentityPropagationEnabled?: boolean;
  IdcUserAssignment?: string;
  EncryptionKeyArn?: string;
}
export const Studio = S.suspend(() =>
  S.Struct({
    StudioId: S.optional(S.String),
    StudioArn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    AuthMode: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetIds: S.optional(SubnetIdList),
    ServiceRole: S.optional(S.String),
    UserRole: S.optional(S.String),
    WorkspaceSecurityGroupId: S.optional(S.String),
    EngineSecurityGroupId: S.optional(S.String),
    Url: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DefaultS3Location: S.optional(S.String),
    IdpAuthUrl: S.optional(S.String),
    IdpRelayStateParameterName: S.optional(S.String),
    Tags: S.optional(TagList),
    IdcInstanceArn: S.optional(S.String),
    TrustedIdentityPropagationEnabled: S.optional(S.Boolean),
    IdcUserAssignment: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
  }),
).annotations({ identifier: "Studio" }) as any as S.Schema<Studio>;
export interface SessionMappingDetail {
  StudioId?: string;
  IdentityId?: string;
  IdentityName?: string;
  IdentityType?: string;
  SessionPolicyArn?: string;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const SessionMappingDetail = S.suspend(() =>
  S.Struct({
    StudioId: S.optional(S.String),
    IdentityId: S.optional(S.String),
    IdentityName: S.optional(S.String),
    IdentityType: S.optional(S.String),
    SessionPolicyArn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "SessionMappingDetail",
}) as any as S.Schema<SessionMappingDetail>;
export interface Command {
  Name?: string;
  ScriptPath?: string;
  Args?: StringList;
}
export const Command = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ScriptPath: S.optional(S.String),
    Args: S.optional(StringList),
  }),
).annotations({ identifier: "Command" }) as any as S.Schema<Command>;
export type CommandList = Command[];
export const CommandList = S.Array(Command);
export interface ClusterStateChangeReason {
  Code?: string;
  Message?: string;
}
export const ClusterStateChangeReason = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "ClusterStateChangeReason",
}) as any as S.Schema<ClusterStateChangeReason>;
export interface ClusterTimeline {
  CreationDateTime?: Date;
  ReadyDateTime?: Date;
  EndDateTime?: Date;
}
export const ClusterTimeline = S.suspend(() =>
  S.Struct({
    CreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ClusterTimeline",
}) as any as S.Schema<ClusterTimeline>;
export type ErrorData = StringMap[];
export const ErrorData = S.Array(StringMap);
export interface ErrorDetail {
  ErrorCode?: string;
  ErrorData?: ErrorData;
  ErrorMessage?: string;
}
export const ErrorDetail = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorData: S.optional(ErrorData),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ErrorDetail" }) as any as S.Schema<ErrorDetail>;
export type ErrorDetailList = ErrorDetail[];
export const ErrorDetailList = S.Array(ErrorDetail);
export interface ClusterStatus {
  State?: string;
  StateChangeReason?: ClusterStateChangeReason;
  Timeline?: ClusterTimeline;
  ErrorDetails?: ErrorDetailList;
}
export const ClusterStatus = S.suspend(() =>
  S.Struct({
    State: S.optional(S.String),
    StateChangeReason: S.optional(ClusterStateChangeReason),
    Timeline: S.optional(ClusterTimeline),
    ErrorDetails: S.optional(ErrorDetailList),
  }),
).annotations({
  identifier: "ClusterStatus",
}) as any as S.Schema<ClusterStatus>;
export interface ClusterSummary {
  Id?: string;
  Name?: string;
  Status?: ClusterStatus;
  NormalizedInstanceHours?: number;
  ClusterArn?: string;
  OutpostArn?: string;
}
export const ClusterSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(ClusterStatus),
    NormalizedInstanceHours: S.optional(S.Number),
    ClusterArn: S.optional(S.String),
    OutpostArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterSummary",
}) as any as S.Schema<ClusterSummary>;
export type ClusterSummaryList = ClusterSummary[];
export const ClusterSummaryList = S.Array(ClusterSummary);
export interface NotebookS3LocationForOutput {
  Bucket?: string;
  Key?: string;
}
export const NotebookS3LocationForOutput = S.suspend(() =>
  S.Struct({ Bucket: S.optional(S.String), Key: S.optional(S.String) }),
).annotations({
  identifier: "NotebookS3LocationForOutput",
}) as any as S.Schema<NotebookS3LocationForOutput>;
export interface NotebookExecutionSummary {
  NotebookExecutionId?: string;
  EditorId?: string;
  NotebookExecutionName?: string;
  Status?: string;
  StartTime?: Date;
  EndTime?: Date;
  NotebookS3Location?: NotebookS3LocationForOutput;
  ExecutionEngineId?: string;
}
export const NotebookExecutionSummary = S.suspend(() =>
  S.Struct({
    NotebookExecutionId: S.optional(S.String),
    EditorId: S.optional(S.String),
    NotebookExecutionName: S.optional(S.String),
    Status: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NotebookS3Location: S.optional(NotebookS3LocationForOutput),
    ExecutionEngineId: S.optional(S.String),
  }),
).annotations({
  identifier: "NotebookExecutionSummary",
}) as any as S.Schema<NotebookExecutionSummary>;
export type NotebookExecutionSummaryList = NotebookExecutionSummary[];
export const NotebookExecutionSummaryList = S.Array(NotebookExecutionSummary);
export interface SecurityConfigurationSummary {
  Name?: string;
  CreationDateTime?: Date;
}
export const SecurityConfigurationSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "SecurityConfigurationSummary",
}) as any as S.Schema<SecurityConfigurationSummary>;
export type SecurityConfigurationList = SecurityConfigurationSummary[];
export const SecurityConfigurationList = S.Array(SecurityConfigurationSummary);
export interface HadoopStepConfig {
  Jar?: string;
  Properties?: StringMap;
  MainClass?: string;
  Args?: StringList;
}
export const HadoopStepConfig = S.suspend(() =>
  S.Struct({
    Jar: S.optional(S.String),
    Properties: S.optional(StringMap),
    MainClass: S.optional(S.String),
    Args: S.optional(StringList),
  }),
).annotations({
  identifier: "HadoopStepConfig",
}) as any as S.Schema<HadoopStepConfig>;
export interface StepStateChangeReason {
  Code?: string;
  Message?: string;
}
export const StepStateChangeReason = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "StepStateChangeReason",
}) as any as S.Schema<StepStateChangeReason>;
export interface FailureDetails {
  Reason?: string;
  Message?: string;
  LogFile?: string;
}
export const FailureDetails = S.suspend(() =>
  S.Struct({
    Reason: S.optional(S.String),
    Message: S.optional(S.String),
    LogFile: S.optional(S.String),
  }),
).annotations({
  identifier: "FailureDetails",
}) as any as S.Schema<FailureDetails>;
export interface StepTimeline {
  CreationDateTime?: Date;
  StartDateTime?: Date;
  EndDateTime?: Date;
}
export const StepTimeline = S.suspend(() =>
  S.Struct({
    CreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StartDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "StepTimeline" }) as any as S.Schema<StepTimeline>;
export interface StepStatus {
  State?: string;
  StateChangeReason?: StepStateChangeReason;
  FailureDetails?: FailureDetails;
  Timeline?: StepTimeline;
}
export const StepStatus = S.suspend(() =>
  S.Struct({
    State: S.optional(S.String),
    StateChangeReason: S.optional(StepStateChangeReason),
    FailureDetails: S.optional(FailureDetails),
    Timeline: S.optional(StepTimeline),
  }),
).annotations({ identifier: "StepStatus" }) as any as S.Schema<StepStatus>;
export interface StepSummary {
  Id?: string;
  Name?: string;
  Config?: HadoopStepConfig;
  ActionOnFailure?: string;
  Status?: StepStatus;
  LogUri?: string;
  EncryptionKeyArn?: string;
}
export const StepSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Config: S.optional(HadoopStepConfig),
    ActionOnFailure: S.optional(S.String),
    Status: S.optional(StepStatus),
    LogUri: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
  }),
).annotations({ identifier: "StepSummary" }) as any as S.Schema<StepSummary>;
export type StepSummaryList = StepSummary[];
export const StepSummaryList = S.Array(StepSummary);
export interface StudioSummary {
  StudioId?: string;
  Name?: string;
  VpcId?: string;
  Description?: string;
  Url?: string;
  AuthMode?: string;
  CreationTime?: Date;
}
export const StudioSummary = S.suspend(() =>
  S.Struct({
    StudioId: S.optional(S.String),
    Name: S.optional(S.String),
    VpcId: S.optional(S.String),
    Description: S.optional(S.String),
    Url: S.optional(S.String),
    AuthMode: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "StudioSummary",
}) as any as S.Schema<StudioSummary>;
export type StudioSummaryList = StudioSummary[];
export const StudioSummaryList = S.Array(StudioSummary);
export interface SessionMappingSummary {
  StudioId?: string;
  IdentityId?: string;
  IdentityName?: string;
  IdentityType?: string;
  SessionPolicyArn?: string;
  CreationTime?: Date;
}
export const SessionMappingSummary = S.suspend(() =>
  S.Struct({
    StudioId: S.optional(S.String),
    IdentityId: S.optional(S.String),
    IdentityName: S.optional(S.String),
    IdentityType: S.optional(S.String),
    SessionPolicyArn: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SessionMappingSummary",
}) as any as S.Schema<SessionMappingSummary>;
export type SessionMappingSummaryList = SessionMappingSummary[];
export const SessionMappingSummaryList = S.Array(SessionMappingSummary);
export interface SupportedInstanceType {
  Type?: string;
  MemoryGB?: number;
  StorageGB?: number;
  VCPU?: number;
  Is64BitsOnly?: boolean;
  InstanceFamilyId?: string;
  EbsOptimizedAvailable?: boolean;
  EbsOptimizedByDefault?: boolean;
  NumberOfDisks?: number;
  EbsStorageOnly?: boolean;
  Architecture?: string;
}
export const SupportedInstanceType = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    MemoryGB: S.optional(S.Number),
    StorageGB: S.optional(S.Number),
    VCPU: S.optional(S.Number),
    Is64BitsOnly: S.optional(S.Boolean),
    InstanceFamilyId: S.optional(S.String),
    EbsOptimizedAvailable: S.optional(S.Boolean),
    EbsOptimizedByDefault: S.optional(S.Boolean),
    NumberOfDisks: S.optional(S.Number),
    EbsStorageOnly: S.optional(S.Boolean),
    Architecture: S.optional(S.String),
  }),
).annotations({
  identifier: "SupportedInstanceType",
}) as any as S.Schema<SupportedInstanceType>;
export type SupportedInstanceTypesList = SupportedInstanceType[];
export const SupportedInstanceTypesList = S.Array(SupportedInstanceType);
export interface SimpleScalingPolicyConfiguration {
  AdjustmentType?: string;
  ScalingAdjustment: number;
  CoolDown?: number;
}
export const SimpleScalingPolicyConfiguration = S.suspend(() =>
  S.Struct({
    AdjustmentType: S.optional(S.String),
    ScalingAdjustment: S.Number,
    CoolDown: S.optional(S.Number),
  }),
).annotations({
  identifier: "SimpleScalingPolicyConfiguration",
}) as any as S.Schema<SimpleScalingPolicyConfiguration>;
export interface ScalingAction {
  Market?: string;
  SimpleScalingPolicyConfiguration: SimpleScalingPolicyConfiguration;
}
export const ScalingAction = S.suspend(() =>
  S.Struct({
    Market: S.optional(S.String),
    SimpleScalingPolicyConfiguration: SimpleScalingPolicyConfiguration,
  }),
).annotations({
  identifier: "ScalingAction",
}) as any as S.Schema<ScalingAction>;
export interface MetricDimension {
  Key?: string;
  Value?: string;
}
export const MetricDimension = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "MetricDimension",
}) as any as S.Schema<MetricDimension>;
export type MetricDimensionList = MetricDimension[];
export const MetricDimensionList = S.Array(MetricDimension);
export interface CloudWatchAlarmDefinition {
  ComparisonOperator: string;
  EvaluationPeriods?: number;
  MetricName: string;
  Namespace?: string;
  Period: number;
  Statistic?: string;
  Threshold: number;
  Unit?: string;
  Dimensions?: MetricDimensionList;
}
export const CloudWatchAlarmDefinition = S.suspend(() =>
  S.Struct({
    ComparisonOperator: S.String,
    EvaluationPeriods: S.optional(S.Number),
    MetricName: S.String,
    Namespace: S.optional(S.String),
    Period: S.Number,
    Statistic: S.optional(S.String),
    Threshold: S.Number,
    Unit: S.optional(S.String),
    Dimensions: S.optional(MetricDimensionList),
  }),
).annotations({
  identifier: "CloudWatchAlarmDefinition",
}) as any as S.Schema<CloudWatchAlarmDefinition>;
export interface ScalingTrigger {
  CloudWatchAlarmDefinition: CloudWatchAlarmDefinition;
}
export const ScalingTrigger = S.suspend(() =>
  S.Struct({ CloudWatchAlarmDefinition: CloudWatchAlarmDefinition }),
).annotations({
  identifier: "ScalingTrigger",
}) as any as S.Schema<ScalingTrigger>;
export interface ScalingRule {
  Name: string;
  Description?: string;
  Action: ScalingAction;
  Trigger: ScalingTrigger;
}
export const ScalingRule = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Action: ScalingAction,
    Trigger: ScalingTrigger,
  }),
).annotations({ identifier: "ScalingRule" }) as any as S.Schema<ScalingRule>;
export type ScalingRuleList = ScalingRule[];
export const ScalingRuleList = S.Array(ScalingRule);
export interface AutoScalingPolicy {
  Constraints: ScalingConstraints;
  Rules: ScalingRuleList;
}
export const AutoScalingPolicy = S.suspend(() =>
  S.Struct({ Constraints: ScalingConstraints, Rules: ScalingRuleList }),
).annotations({
  identifier: "AutoScalingPolicy",
}) as any as S.Schema<AutoScalingPolicy>;
export interface InstanceGroupConfig {
  Name?: string;
  Market?: string;
  InstanceRole: string;
  BidPrice?: string;
  InstanceType: string;
  InstanceCount: number;
  Configurations?: ConfigurationList;
  EbsConfiguration?: EbsConfiguration;
  AutoScalingPolicy?: AutoScalingPolicy;
  CustomAmiId?: string;
}
export const InstanceGroupConfig = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Market: S.optional(S.String),
    InstanceRole: S.String,
    BidPrice: S.optional(S.String),
    InstanceType: S.String,
    InstanceCount: S.Number,
    Configurations: S.optional(ConfigurationList),
    EbsConfiguration: S.optional(EbsConfiguration),
    AutoScalingPolicy: S.optional(AutoScalingPolicy),
    CustomAmiId: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceGroupConfig",
}) as any as S.Schema<InstanceGroupConfig>;
export type InstanceGroupConfigList = InstanceGroupConfig[];
export const InstanceGroupConfigList = S.Array(InstanceGroupConfig);
export interface JobFlowInstancesConfig {
  MasterInstanceType?: string;
  SlaveInstanceType?: string;
  InstanceCount?: number;
  InstanceGroups?: InstanceGroupConfigList;
  InstanceFleets?: InstanceFleetConfigList;
  Ec2KeyName?: string;
  Placement?: PlacementType;
  KeepJobFlowAliveWhenNoSteps?: boolean;
  TerminationProtected?: boolean;
  UnhealthyNodeReplacement?: boolean;
  HadoopVersion?: string;
  Ec2SubnetId?: string;
  Ec2SubnetIds?: XmlStringMaxLen256List;
  EmrManagedMasterSecurityGroup?: string;
  EmrManagedSlaveSecurityGroup?: string;
  ServiceAccessSecurityGroup?: string;
  AdditionalMasterSecurityGroups?: SecurityGroupsList;
  AdditionalSlaveSecurityGroups?: SecurityGroupsList;
}
export const JobFlowInstancesConfig = S.suspend(() =>
  S.Struct({
    MasterInstanceType: S.optional(S.String),
    SlaveInstanceType: S.optional(S.String),
    InstanceCount: S.optional(S.Number),
    InstanceGroups: S.optional(InstanceGroupConfigList),
    InstanceFleets: S.optional(InstanceFleetConfigList),
    Ec2KeyName: S.optional(S.String),
    Placement: S.optional(PlacementType),
    KeepJobFlowAliveWhenNoSteps: S.optional(S.Boolean),
    TerminationProtected: S.optional(S.Boolean),
    UnhealthyNodeReplacement: S.optional(S.Boolean),
    HadoopVersion: S.optional(S.String),
    Ec2SubnetId: S.optional(S.String),
    Ec2SubnetIds: S.optional(XmlStringMaxLen256List),
    EmrManagedMasterSecurityGroup: S.optional(S.String),
    EmrManagedSlaveSecurityGroup: S.optional(S.String),
    ServiceAccessSecurityGroup: S.optional(S.String),
    AdditionalMasterSecurityGroups: S.optional(SecurityGroupsList),
    AdditionalSlaveSecurityGroups: S.optional(SecurityGroupsList),
  }),
).annotations({
  identifier: "JobFlowInstancesConfig",
}) as any as S.Schema<JobFlowInstancesConfig>;
export interface BootstrapActionConfig {
  Name: string;
  ScriptBootstrapAction: ScriptBootstrapActionConfig;
}
export const BootstrapActionConfig = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ScriptBootstrapAction: ScriptBootstrapActionConfig,
  }),
).annotations({
  identifier: "BootstrapActionConfig",
}) as any as S.Schema<BootstrapActionConfig>;
export type BootstrapActionConfigList = BootstrapActionConfig[];
export const BootstrapActionConfigList = S.Array(BootstrapActionConfig);
export interface KeyValue {
  Key?: string;
  Value?: string;
}
export const KeyValue = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "KeyValue" }) as any as S.Schema<KeyValue>;
export type KeyValueList = KeyValue[];
export const KeyValueList = S.Array(KeyValue);
export interface S3MonitoringConfiguration {
  LogUri?: string;
  EncryptionKeyArn?: string;
}
export const S3MonitoringConfiguration = S.suspend(() =>
  S.Struct({
    LogUri: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "S3MonitoringConfiguration",
}) as any as S.Schema<S3MonitoringConfiguration>;
export interface InstanceResizePolicy {
  InstancesToTerminate?: EC2InstanceIdsList;
  InstancesToProtect?: EC2InstanceIdsList;
  InstanceTerminationTimeout?: number;
}
export const InstanceResizePolicy = S.suspend(() =>
  S.Struct({
    InstancesToTerminate: S.optional(EC2InstanceIdsList),
    InstancesToProtect: S.optional(EC2InstanceIdsList),
    InstanceTerminationTimeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceResizePolicy",
}) as any as S.Schema<InstanceResizePolicy>;
export type LogTypesMap = { [key: string]: XmlStringList };
export const LogTypesMap = S.Record({ key: S.String, value: XmlStringList });
export interface CancelStepsOutput {
  CancelStepsInfoList?: CancelStepsInfoList;
}
export const CancelStepsOutput = S.suspend(() =>
  S.Struct({ CancelStepsInfoList: S.optional(CancelStepsInfoList) }).pipe(ns),
).annotations({
  identifier: "CancelStepsOutput",
}) as any as S.Schema<CancelStepsOutput>;
export interface CreatePersistentAppUIOutput {
  PersistentAppUIId?: string;
  RuntimeRoleEnabledCluster?: boolean;
}
export const CreatePersistentAppUIOutput = S.suspend(() =>
  S.Struct({
    PersistentAppUIId: S.optional(S.String),
    RuntimeRoleEnabledCluster: S.optional(S.Boolean),
  }).pipe(ns),
).annotations({
  identifier: "CreatePersistentAppUIOutput",
}) as any as S.Schema<CreatePersistentAppUIOutput>;
export interface DescribePersistentAppUIOutput {
  PersistentAppUI?: PersistentAppUI;
}
export const DescribePersistentAppUIOutput = S.suspend(() =>
  S.Struct({ PersistentAppUI: S.optional(PersistentAppUI) }).pipe(ns),
).annotations({
  identifier: "DescribePersistentAppUIOutput",
}) as any as S.Schema<DescribePersistentAppUIOutput>;
export interface DescribeReleaseLabelOutput {
  ReleaseLabel?: string;
  Applications?: SimplifiedApplicationList;
  NextToken?: string;
  AvailableOSReleases?: OSReleaseList;
}
export const DescribeReleaseLabelOutput = S.suspend(() =>
  S.Struct({
    ReleaseLabel: S.optional(S.String),
    Applications: S.optional(SimplifiedApplicationList),
    NextToken: S.optional(S.String),
    AvailableOSReleases: S.optional(OSReleaseList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeReleaseLabelOutput",
}) as any as S.Schema<DescribeReleaseLabelOutput>;
export interface DescribeStudioOutput {
  Studio?: Studio;
}
export const DescribeStudioOutput = S.suspend(() =>
  S.Struct({ Studio: S.optional(Studio) }).pipe(ns),
).annotations({
  identifier: "DescribeStudioOutput",
}) as any as S.Schema<DescribeStudioOutput>;
export interface GetBlockPublicAccessConfigurationOutput {
  BlockPublicAccessConfiguration: BlockPublicAccessConfiguration;
  BlockPublicAccessConfigurationMetadata: BlockPublicAccessConfigurationMetadata;
}
export const GetBlockPublicAccessConfigurationOutput = S.suspend(() =>
  S.Struct({
    BlockPublicAccessConfiguration: BlockPublicAccessConfiguration,
    BlockPublicAccessConfigurationMetadata:
      BlockPublicAccessConfigurationMetadata,
  }).pipe(ns),
).annotations({
  identifier: "GetBlockPublicAccessConfigurationOutput",
}) as any as S.Schema<GetBlockPublicAccessConfigurationOutput>;
export interface GetStudioSessionMappingOutput {
  SessionMapping?: SessionMappingDetail;
}
export const GetStudioSessionMappingOutput = S.suspend(() =>
  S.Struct({ SessionMapping: S.optional(SessionMappingDetail) }).pipe(ns),
).annotations({
  identifier: "GetStudioSessionMappingOutput",
}) as any as S.Schema<GetStudioSessionMappingOutput>;
export interface ListBootstrapActionsOutput {
  BootstrapActions?: CommandList;
  Marker?: string;
}
export const ListBootstrapActionsOutput = S.suspend(() =>
  S.Struct({
    BootstrapActions: S.optional(CommandList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListBootstrapActionsOutput",
}) as any as S.Schema<ListBootstrapActionsOutput>;
export interface ListClustersOutput {
  Clusters?: ClusterSummaryList;
  Marker?: string;
}
export const ListClustersOutput = S.suspend(() =>
  S.Struct({
    Clusters: S.optional(ClusterSummaryList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListClustersOutput",
}) as any as S.Schema<ListClustersOutput>;
export interface ListNotebookExecutionsOutput {
  NotebookExecutions?: NotebookExecutionSummaryList;
  Marker?: string;
}
export const ListNotebookExecutionsOutput = S.suspend(() =>
  S.Struct({
    NotebookExecutions: S.optional(NotebookExecutionSummaryList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListNotebookExecutionsOutput",
}) as any as S.Schema<ListNotebookExecutionsOutput>;
export interface ListReleaseLabelsOutput {
  ReleaseLabels?: StringList;
  NextToken?: string;
}
export const ListReleaseLabelsOutput = S.suspend(() =>
  S.Struct({
    ReleaseLabels: S.optional(StringList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListReleaseLabelsOutput",
}) as any as S.Schema<ListReleaseLabelsOutput>;
export interface ListSecurityConfigurationsOutput {
  SecurityConfigurations?: SecurityConfigurationList;
  Marker?: string;
}
export const ListSecurityConfigurationsOutput = S.suspend(() =>
  S.Struct({
    SecurityConfigurations: S.optional(SecurityConfigurationList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSecurityConfigurationsOutput",
}) as any as S.Schema<ListSecurityConfigurationsOutput>;
export interface ListStepsOutput {
  Steps?: StepSummaryList;
  Marker?: string;
}
export const ListStepsOutput = S.suspend(() =>
  S.Struct({
    Steps: S.optional(StepSummaryList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStepsOutput",
}) as any as S.Schema<ListStepsOutput>;
export interface ListStudiosOutput {
  Studios?: StudioSummaryList;
  Marker?: string;
}
export const ListStudiosOutput = S.suspend(() =>
  S.Struct({
    Studios: S.optional(StudioSummaryList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStudiosOutput",
}) as any as S.Schema<ListStudiosOutput>;
export interface ListStudioSessionMappingsOutput {
  SessionMappings?: SessionMappingSummaryList;
  Marker?: string;
}
export const ListStudioSessionMappingsOutput = S.suspend(() =>
  S.Struct({
    SessionMappings: S.optional(SessionMappingSummaryList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListStudioSessionMappingsOutput",
}) as any as S.Schema<ListStudioSessionMappingsOutput>;
export interface ListSupportedInstanceTypesOutput {
  SupportedInstanceTypes?: SupportedInstanceTypesList;
  Marker?: string;
}
export const ListSupportedInstanceTypesOutput = S.suspend(() =>
  S.Struct({
    SupportedInstanceTypes: S.optional(SupportedInstanceTypesList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSupportedInstanceTypesOutput",
}) as any as S.Schema<ListSupportedInstanceTypesOutput>;
export interface PutManagedScalingPolicyInput {
  ClusterId: string;
  ManagedScalingPolicy: ManagedScalingPolicy;
}
export const PutManagedScalingPolicyInput = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    ManagedScalingPolicy: ManagedScalingPolicy,
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
  identifier: "PutManagedScalingPolicyInput",
}) as any as S.Schema<PutManagedScalingPolicyInput>;
export interface PutManagedScalingPolicyOutput {}
export const PutManagedScalingPolicyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutManagedScalingPolicyOutput",
}) as any as S.Schema<PutManagedScalingPolicyOutput>;
export interface StartNotebookExecutionOutput {
  NotebookExecutionId?: string;
}
export const StartNotebookExecutionOutput = S.suspend(() =>
  S.Struct({ NotebookExecutionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartNotebookExecutionOutput",
}) as any as S.Schema<StartNotebookExecutionOutput>;
export interface HadoopJarStepConfig {
  Properties?: KeyValueList;
  Jar: string;
  MainClass?: string;
  Args?: XmlStringList;
}
export const HadoopJarStepConfig = S.suspend(() =>
  S.Struct({
    Properties: S.optional(KeyValueList),
    Jar: S.String,
    MainClass: S.optional(S.String),
    Args: S.optional(XmlStringList),
  }),
).annotations({
  identifier: "HadoopJarStepConfig",
}) as any as S.Schema<HadoopJarStepConfig>;
export interface StepMonitoringConfiguration {
  S3MonitoringConfiguration?: S3MonitoringConfiguration;
}
export const StepMonitoringConfiguration = S.suspend(() =>
  S.Struct({
    S3MonitoringConfiguration: S.optional(S3MonitoringConfiguration),
  }),
).annotations({
  identifier: "StepMonitoringConfiguration",
}) as any as S.Schema<StepMonitoringConfiguration>;
export interface Ec2InstanceAttributes {
  Ec2KeyName?: string;
  Ec2SubnetId?: string;
  RequestedEc2SubnetIds?: XmlStringMaxLen256List;
  Ec2AvailabilityZone?: string;
  RequestedEc2AvailabilityZones?: XmlStringMaxLen256List;
  IamInstanceProfile?: string;
  EmrManagedMasterSecurityGroup?: string;
  EmrManagedSlaveSecurityGroup?: string;
  ServiceAccessSecurityGroup?: string;
  AdditionalMasterSecurityGroups?: StringList;
  AdditionalSlaveSecurityGroups?: StringList;
}
export const Ec2InstanceAttributes = S.suspend(() =>
  S.Struct({
    Ec2KeyName: S.optional(S.String),
    Ec2SubnetId: S.optional(S.String),
    RequestedEc2SubnetIds: S.optional(XmlStringMaxLen256List),
    Ec2AvailabilityZone: S.optional(S.String),
    RequestedEc2AvailabilityZones: S.optional(XmlStringMaxLen256List),
    IamInstanceProfile: S.optional(S.String),
    EmrManagedMasterSecurityGroup: S.optional(S.String),
    EmrManagedSlaveSecurityGroup: S.optional(S.String),
    ServiceAccessSecurityGroup: S.optional(S.String),
    AdditionalMasterSecurityGroups: S.optional(StringList),
    AdditionalSlaveSecurityGroups: S.optional(StringList),
  }),
).annotations({
  identifier: "Ec2InstanceAttributes",
}) as any as S.Schema<Ec2InstanceAttributes>;
export interface JobFlowExecutionStatusDetail {
  State: string;
  CreationDateTime: Date;
  StartDateTime?: Date;
  ReadyDateTime?: Date;
  EndDateTime?: Date;
  LastStateChangeReason?: string;
}
export const JobFlowExecutionStatusDetail = S.suspend(() =>
  S.Struct({
    State: S.String,
    CreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    StartDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastStateChangeReason: S.optional(S.String),
  }),
).annotations({
  identifier: "JobFlowExecutionStatusDetail",
}) as any as S.Schema<JobFlowExecutionStatusDetail>;
export interface BootstrapActionDetail {
  BootstrapActionConfig?: BootstrapActionConfig;
}
export const BootstrapActionDetail = S.suspend(() =>
  S.Struct({ BootstrapActionConfig: S.optional(BootstrapActionConfig) }),
).annotations({
  identifier: "BootstrapActionDetail",
}) as any as S.Schema<BootstrapActionDetail>;
export type BootstrapActionDetailList = BootstrapActionDetail[];
export const BootstrapActionDetailList = S.Array(BootstrapActionDetail);
export interface OutputNotebookS3LocationForOutput {
  Bucket?: string;
  Key?: string;
}
export const OutputNotebookS3LocationForOutput = S.suspend(() =>
  S.Struct({ Bucket: S.optional(S.String), Key: S.optional(S.String) }),
).annotations({
  identifier: "OutputNotebookS3LocationForOutput",
}) as any as S.Schema<OutputNotebookS3LocationForOutput>;
export interface UsernamePassword {
  Username?: string;
  Password?: string;
}
export const UsernamePassword = S.suspend(() =>
  S.Struct({ Username: S.optional(S.String), Password: S.optional(S.String) }),
).annotations({
  identifier: "UsernamePassword",
}) as any as S.Schema<UsernamePassword>;
export interface EbsBlockDevice {
  VolumeSpecification?: VolumeSpecification;
  Device?: string;
}
export const EbsBlockDevice = S.suspend(() =>
  S.Struct({
    VolumeSpecification: S.optional(VolumeSpecification),
    Device: S.optional(S.String),
  }),
).annotations({
  identifier: "EbsBlockDevice",
}) as any as S.Schema<EbsBlockDevice>;
export type EbsBlockDeviceList = EbsBlockDevice[];
export const EbsBlockDeviceList = S.Array(EbsBlockDevice);
export interface InstanceTypeSpecification {
  InstanceType?: string;
  WeightedCapacity?: number;
  BidPrice?: string;
  BidPriceAsPercentageOfOnDemandPrice?: number;
  Configurations?: ConfigurationList;
  EbsBlockDevices?: EbsBlockDeviceList;
  EbsOptimized?: boolean;
  CustomAmiId?: string;
  Priority?: number;
}
export const InstanceTypeSpecification = S.suspend(() =>
  S.Struct({
    InstanceType: S.optional(S.String),
    WeightedCapacity: S.optional(S.Number),
    BidPrice: S.optional(S.String),
    BidPriceAsPercentageOfOnDemandPrice: S.optional(S.Number),
    Configurations: S.optional(ConfigurationList),
    EbsBlockDevices: S.optional(EbsBlockDeviceList),
    EbsOptimized: S.optional(S.Boolean),
    CustomAmiId: S.optional(S.String),
    Priority: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceTypeSpecification",
}) as any as S.Schema<InstanceTypeSpecification>;
export type InstanceTypeSpecificationList = InstanceTypeSpecification[];
export const InstanceTypeSpecificationList = S.Array(InstanceTypeSpecification);
export interface EbsVolume {
  Device?: string;
  VolumeId?: string;
}
export const EbsVolume = S.suspend(() =>
  S.Struct({ Device: S.optional(S.String), VolumeId: S.optional(S.String) }),
).annotations({ identifier: "EbsVolume" }) as any as S.Schema<EbsVolume>;
export type EbsVolumeList = EbsVolume[];
export const EbsVolumeList = S.Array(EbsVolume);
export interface ShrinkPolicy {
  DecommissionTimeout?: number;
  InstanceResizePolicy?: InstanceResizePolicy;
}
export const ShrinkPolicy = S.suspend(() =>
  S.Struct({
    DecommissionTimeout: S.optional(S.Number),
    InstanceResizePolicy: S.optional(InstanceResizePolicy),
  }),
).annotations({ identifier: "ShrinkPolicy" }) as any as S.Schema<ShrinkPolicy>;
export interface CloudWatchLogConfiguration {
  Enabled: boolean;
  LogGroupName?: string;
  LogStreamNamePrefix?: string;
  EncryptionKeyArn?: string;
  LogTypes?: LogTypesMap;
}
export const CloudWatchLogConfiguration = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    LogGroupName: S.optional(S.String),
    LogStreamNamePrefix: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    LogTypes: S.optional(LogTypesMap),
  }),
).annotations({
  identifier: "CloudWatchLogConfiguration",
}) as any as S.Schema<CloudWatchLogConfiguration>;
export interface StepConfig {
  Name: string;
  ActionOnFailure?: string;
  HadoopJarStep: HadoopJarStepConfig;
  StepMonitoringConfiguration?: StepMonitoringConfiguration;
}
export const StepConfig = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ActionOnFailure: S.optional(S.String),
    HadoopJarStep: HadoopJarStepConfig,
    StepMonitoringConfiguration: S.optional(StepMonitoringConfiguration),
  }),
).annotations({ identifier: "StepConfig" }) as any as S.Schema<StepConfig>;
export type StepConfigList = StepConfig[];
export const StepConfigList = S.Array(StepConfig);
export interface NotebookExecution {
  NotebookExecutionId?: string;
  EditorId?: string;
  ExecutionEngine?: ExecutionEngineConfig;
  NotebookExecutionName?: string;
  NotebookParams?: string;
  Status?: string;
  StartTime?: Date;
  EndTime?: Date;
  Arn?: string;
  OutputNotebookURI?: string;
  LastStateChangeReason?: string;
  NotebookInstanceSecurityGroupId?: string;
  Tags?: TagList;
  NotebookS3Location?: NotebookS3LocationForOutput;
  OutputNotebookS3Location?: OutputNotebookS3LocationForOutput;
  OutputNotebookFormat?: string;
  EnvironmentVariables?: EnvironmentVariablesMap;
}
export const NotebookExecution = S.suspend(() =>
  S.Struct({
    NotebookExecutionId: S.optional(S.String),
    EditorId: S.optional(S.String),
    ExecutionEngine: S.optional(ExecutionEngineConfig),
    NotebookExecutionName: S.optional(S.String),
    NotebookParams: S.optional(S.String),
    Status: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Arn: S.optional(S.String),
    OutputNotebookURI: S.optional(S.String),
    LastStateChangeReason: S.optional(S.String),
    NotebookInstanceSecurityGroupId: S.optional(S.String),
    Tags: S.optional(TagList),
    NotebookS3Location: S.optional(NotebookS3LocationForOutput),
    OutputNotebookS3Location: S.optional(OutputNotebookS3LocationForOutput),
    OutputNotebookFormat: S.optional(S.String),
    EnvironmentVariables: S.optional(EnvironmentVariablesMap),
  }),
).annotations({
  identifier: "NotebookExecution",
}) as any as S.Schema<NotebookExecution>;
export type Credentials = { UsernamePassword: UsernamePassword };
export const Credentials = S.Union(
  S.Struct({ UsernamePassword: UsernamePassword }),
);
export interface InstanceGroupModifyConfig {
  InstanceGroupId: string;
  InstanceCount?: number;
  EC2InstanceIdsToTerminate?: EC2InstanceIdsToTerminateList;
  ShrinkPolicy?: ShrinkPolicy;
  ReconfigurationType?: string;
  Configurations?: ConfigurationList;
}
export const InstanceGroupModifyConfig = S.suspend(() =>
  S.Struct({
    InstanceGroupId: S.String,
    InstanceCount: S.optional(S.Number),
    EC2InstanceIdsToTerminate: S.optional(EC2InstanceIdsToTerminateList),
    ShrinkPolicy: S.optional(ShrinkPolicy),
    ReconfigurationType: S.optional(S.String),
    Configurations: S.optional(ConfigurationList),
  }),
).annotations({
  identifier: "InstanceGroupModifyConfig",
}) as any as S.Schema<InstanceGroupModifyConfig>;
export type InstanceGroupModifyConfigList = InstanceGroupModifyConfig[];
export const InstanceGroupModifyConfigList = S.Array(InstanceGroupModifyConfig);
export interface MonitoringConfiguration {
  CloudWatchLogConfiguration?: CloudWatchLogConfiguration;
}
export const MonitoringConfiguration = S.suspend(() =>
  S.Struct({
    CloudWatchLogConfiguration: S.optional(CloudWatchLogConfiguration),
  }),
).annotations({
  identifier: "MonitoringConfiguration",
}) as any as S.Schema<MonitoringConfiguration>;
export interface InstanceGroupDetail {
  InstanceGroupId?: string;
  Name?: string;
  Market: string;
  InstanceRole: string;
  BidPrice?: string;
  InstanceType: string;
  InstanceRequestCount: number;
  InstanceRunningCount: number;
  State: string;
  LastStateChangeReason?: string;
  CreationDateTime: Date;
  StartDateTime?: Date;
  ReadyDateTime?: Date;
  EndDateTime?: Date;
  CustomAmiId?: string;
}
export const InstanceGroupDetail = S.suspend(() =>
  S.Struct({
    InstanceGroupId: S.optional(S.String),
    Name: S.optional(S.String),
    Market: S.String,
    InstanceRole: S.String,
    BidPrice: S.optional(S.String),
    InstanceType: S.String,
    InstanceRequestCount: S.Number,
    InstanceRunningCount: S.Number,
    State: S.String,
    LastStateChangeReason: S.optional(S.String),
    CreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    StartDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CustomAmiId: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceGroupDetail",
}) as any as S.Schema<InstanceGroupDetail>;
export type InstanceGroupDetailList = InstanceGroupDetail[];
export const InstanceGroupDetailList = S.Array(InstanceGroupDetail);
export interface StepExecutionStatusDetail {
  State: string;
  CreationDateTime: Date;
  StartDateTime?: Date;
  EndDateTime?: Date;
  LastStateChangeReason?: string;
}
export const StepExecutionStatusDetail = S.suspend(() =>
  S.Struct({
    State: S.String,
    CreationDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    StartDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastStateChangeReason: S.optional(S.String),
  }),
).annotations({
  identifier: "StepExecutionStatusDetail",
}) as any as S.Schema<StepExecutionStatusDetail>;
export interface InstanceFleetStateChangeReason {
  Code?: string;
  Message?: string;
}
export const InstanceFleetStateChangeReason = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "InstanceFleetStateChangeReason",
}) as any as S.Schema<InstanceFleetStateChangeReason>;
export interface InstanceFleetTimeline {
  CreationDateTime?: Date;
  ReadyDateTime?: Date;
  EndDateTime?: Date;
}
export const InstanceFleetTimeline = S.suspend(() =>
  S.Struct({
    CreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "InstanceFleetTimeline",
}) as any as S.Schema<InstanceFleetTimeline>;
export interface InstanceGroupStateChangeReason {
  Code?: string;
  Message?: string;
}
export const InstanceGroupStateChangeReason = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "InstanceGroupStateChangeReason",
}) as any as S.Schema<InstanceGroupStateChangeReason>;
export interface InstanceGroupTimeline {
  CreationDateTime?: Date;
  ReadyDateTime?: Date;
  EndDateTime?: Date;
}
export const InstanceGroupTimeline = S.suspend(() =>
  S.Struct({
    CreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "InstanceGroupTimeline",
}) as any as S.Schema<InstanceGroupTimeline>;
export interface InstanceStateChangeReason {
  Code?: string;
  Message?: string;
}
export const InstanceStateChangeReason = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "InstanceStateChangeReason",
}) as any as S.Schema<InstanceStateChangeReason>;
export interface InstanceTimeline {
  CreationDateTime?: Date;
  ReadyDateTime?: Date;
  EndDateTime?: Date;
}
export const InstanceTimeline = S.suspend(() =>
  S.Struct({
    CreationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReadyDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "InstanceTimeline",
}) as any as S.Schema<InstanceTimeline>;
export interface AddJobFlowStepsInput {
  JobFlowId: string;
  Steps: StepConfigList;
  ExecutionRoleArn?: string;
}
export const AddJobFlowStepsInput = S.suspend(() =>
  S.Struct({
    JobFlowId: S.String,
    Steps: StepConfigList,
    ExecutionRoleArn: S.optional(S.String),
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
  identifier: "AddJobFlowStepsInput",
}) as any as S.Schema<AddJobFlowStepsInput>;
export interface DescribeNotebookExecutionOutput {
  NotebookExecution?: NotebookExecution;
}
export const DescribeNotebookExecutionOutput = S.suspend(() =>
  S.Struct({ NotebookExecution: S.optional(NotebookExecution) }).pipe(ns),
).annotations({
  identifier: "DescribeNotebookExecutionOutput",
}) as any as S.Schema<DescribeNotebookExecutionOutput>;
export interface GetClusterSessionCredentialsOutput {
  Credentials?: (typeof Credentials)["Type"];
  ExpiresAt?: Date;
}
export const GetClusterSessionCredentialsOutput = S.suspend(() =>
  S.Struct({
    Credentials: S.optional(Credentials),
    ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "GetClusterSessionCredentialsOutput",
}) as any as S.Schema<GetClusterSessionCredentialsOutput>;
export interface ModifyInstanceGroupsInput {
  ClusterId?: string;
  InstanceGroups?: InstanceGroupModifyConfigList;
}
export const ModifyInstanceGroupsInput = S.suspend(() =>
  S.Struct({
    ClusterId: S.optional(S.String),
    InstanceGroups: S.optional(InstanceGroupModifyConfigList),
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
  identifier: "ModifyInstanceGroupsInput",
}) as any as S.Schema<ModifyInstanceGroupsInput>;
export interface ModifyInstanceGroupsResponse {}
export const ModifyInstanceGroupsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ModifyInstanceGroupsResponse",
}) as any as S.Schema<ModifyInstanceGroupsResponse>;
export interface RunJobFlowInput {
  Name: string;
  LogUri?: string;
  LogEncryptionKmsKeyId?: string;
  AdditionalInfo?: string;
  AmiVersion?: string;
  ReleaseLabel?: string;
  Instances: JobFlowInstancesConfig;
  Steps?: StepConfigList;
  BootstrapActions?: BootstrapActionConfigList;
  SupportedProducts?: SupportedProductsList;
  NewSupportedProducts?: NewSupportedProductsList;
  Applications?: ApplicationList;
  Configurations?: ConfigurationList;
  VisibleToAllUsers?: boolean;
  JobFlowRole?: string;
  ServiceRole?: string;
  Tags?: TagList;
  SecurityConfiguration?: string;
  AutoScalingRole?: string;
  ScaleDownBehavior?: string;
  CustomAmiId?: string;
  EbsRootVolumeSize?: number;
  RepoUpgradeOnBoot?: string;
  KerberosAttributes?: KerberosAttributes;
  StepConcurrencyLevel?: number;
  ManagedScalingPolicy?: ManagedScalingPolicy;
  PlacementGroupConfigs?: PlacementGroupConfigList;
  AutoTerminationPolicy?: AutoTerminationPolicy;
  OSReleaseLabel?: string;
  EbsRootVolumeIops?: number;
  EbsRootVolumeThroughput?: number;
  ExtendedSupport?: boolean;
  MonitoringConfiguration?: MonitoringConfiguration;
}
export const RunJobFlowInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    LogUri: S.optional(S.String),
    LogEncryptionKmsKeyId: S.optional(S.String),
    AdditionalInfo: S.optional(S.String),
    AmiVersion: S.optional(S.String),
    ReleaseLabel: S.optional(S.String),
    Instances: JobFlowInstancesConfig,
    Steps: S.optional(StepConfigList),
    BootstrapActions: S.optional(BootstrapActionConfigList),
    SupportedProducts: S.optional(SupportedProductsList),
    NewSupportedProducts: S.optional(NewSupportedProductsList),
    Applications: S.optional(ApplicationList),
    Configurations: S.optional(ConfigurationList),
    VisibleToAllUsers: S.optional(S.Boolean),
    JobFlowRole: S.optional(S.String),
    ServiceRole: S.optional(S.String),
    Tags: S.optional(TagList),
    SecurityConfiguration: S.optional(S.String),
    AutoScalingRole: S.optional(S.String),
    ScaleDownBehavior: S.optional(S.String),
    CustomAmiId: S.optional(S.String),
    EbsRootVolumeSize: S.optional(S.Number),
    RepoUpgradeOnBoot: S.optional(S.String),
    KerberosAttributes: S.optional(KerberosAttributes),
    StepConcurrencyLevel: S.optional(S.Number),
    ManagedScalingPolicy: S.optional(ManagedScalingPolicy),
    PlacementGroupConfigs: S.optional(PlacementGroupConfigList),
    AutoTerminationPolicy: S.optional(AutoTerminationPolicy),
    OSReleaseLabel: S.optional(S.String),
    EbsRootVolumeIops: S.optional(S.Number),
    EbsRootVolumeThroughput: S.optional(S.Number),
    ExtendedSupport: S.optional(S.Boolean),
    MonitoringConfiguration: S.optional(MonitoringConfiguration),
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
  identifier: "RunJobFlowInput",
}) as any as S.Schema<RunJobFlowInput>;
export interface JobFlowInstancesDetail {
  MasterInstanceType: string;
  MasterPublicDnsName?: string;
  MasterInstanceId?: string;
  SlaveInstanceType: string;
  InstanceCount: number;
  InstanceGroups?: InstanceGroupDetailList;
  NormalizedInstanceHours?: number;
  Ec2KeyName?: string;
  Ec2SubnetId?: string;
  Placement?: PlacementType;
  KeepJobFlowAliveWhenNoSteps?: boolean;
  TerminationProtected?: boolean;
  UnhealthyNodeReplacement?: boolean;
  HadoopVersion?: string;
}
export const JobFlowInstancesDetail = S.suspend(() =>
  S.Struct({
    MasterInstanceType: S.String,
    MasterPublicDnsName: S.optional(S.String),
    MasterInstanceId: S.optional(S.String),
    SlaveInstanceType: S.String,
    InstanceCount: S.Number,
    InstanceGroups: S.optional(InstanceGroupDetailList),
    NormalizedInstanceHours: S.optional(S.Number),
    Ec2KeyName: S.optional(S.String),
    Ec2SubnetId: S.optional(S.String),
    Placement: S.optional(PlacementType),
    KeepJobFlowAliveWhenNoSteps: S.optional(S.Boolean),
    TerminationProtected: S.optional(S.Boolean),
    UnhealthyNodeReplacement: S.optional(S.Boolean),
    HadoopVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "JobFlowInstancesDetail",
}) as any as S.Schema<JobFlowInstancesDetail>;
export interface StepDetail {
  StepConfig: StepConfig;
  ExecutionStatusDetail: StepExecutionStatusDetail;
}
export const StepDetail = S.suspend(() =>
  S.Struct({
    StepConfig: StepConfig,
    ExecutionStatusDetail: StepExecutionStatusDetail,
  }),
).annotations({ identifier: "StepDetail" }) as any as S.Schema<StepDetail>;
export type StepDetailList = StepDetail[];
export const StepDetailList = S.Array(StepDetail);
export interface InstanceFleetStatus {
  State?: string;
  StateChangeReason?: InstanceFleetStateChangeReason;
  Timeline?: InstanceFleetTimeline;
}
export const InstanceFleetStatus = S.suspend(() =>
  S.Struct({
    State: S.optional(S.String),
    StateChangeReason: S.optional(InstanceFleetStateChangeReason),
    Timeline: S.optional(InstanceFleetTimeline),
  }),
).annotations({
  identifier: "InstanceFleetStatus",
}) as any as S.Schema<InstanceFleetStatus>;
export interface InstanceGroupStatus {
  State?: string;
  StateChangeReason?: InstanceGroupStateChangeReason;
  Timeline?: InstanceGroupTimeline;
}
export const InstanceGroupStatus = S.suspend(() =>
  S.Struct({
    State: S.optional(S.String),
    StateChangeReason: S.optional(InstanceGroupStateChangeReason),
    Timeline: S.optional(InstanceGroupTimeline),
  }),
).annotations({
  identifier: "InstanceGroupStatus",
}) as any as S.Schema<InstanceGroupStatus>;
export interface InstanceStatus {
  State?: string;
  StateChangeReason?: InstanceStateChangeReason;
  Timeline?: InstanceTimeline;
}
export const InstanceStatus = S.suspend(() =>
  S.Struct({
    State: S.optional(S.String),
    StateChangeReason: S.optional(InstanceStateChangeReason),
    Timeline: S.optional(InstanceTimeline),
  }),
).annotations({
  identifier: "InstanceStatus",
}) as any as S.Schema<InstanceStatus>;
export interface AutoScalingPolicyStateChangeReason {
  Code?: string;
  Message?: string;
}
export const AutoScalingPolicyStateChangeReason = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "AutoScalingPolicyStateChangeReason",
}) as any as S.Schema<AutoScalingPolicyStateChangeReason>;
export interface Cluster {
  Id?: string;
  Name?: string;
  Status?: ClusterStatus;
  Ec2InstanceAttributes?: Ec2InstanceAttributes;
  InstanceCollectionType?: string;
  LogUri?: string;
  LogEncryptionKmsKeyId?: string;
  RequestedAmiVersion?: string;
  RunningAmiVersion?: string;
  ReleaseLabel?: string;
  AutoTerminate?: boolean;
  TerminationProtected?: boolean;
  UnhealthyNodeReplacement?: boolean;
  VisibleToAllUsers?: boolean;
  Applications?: ApplicationList;
  Tags?: TagList;
  ServiceRole?: string;
  NormalizedInstanceHours?: number;
  MasterPublicDnsName?: string;
  Configurations?: ConfigurationList;
  SecurityConfiguration?: string;
  AutoScalingRole?: string;
  ScaleDownBehavior?: string;
  CustomAmiId?: string;
  EbsRootVolumeSize?: number;
  RepoUpgradeOnBoot?: string;
  KerberosAttributes?: KerberosAttributes;
  ClusterArn?: string;
  OutpostArn?: string;
  StepConcurrencyLevel?: number;
  PlacementGroups?: PlacementGroupConfigList;
  OSReleaseLabel?: string;
  EbsRootVolumeIops?: number;
  EbsRootVolumeThroughput?: number;
  ExtendedSupport?: boolean;
  MonitoringConfiguration?: MonitoringConfiguration;
}
export const Cluster = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(ClusterStatus),
    Ec2InstanceAttributes: S.optional(Ec2InstanceAttributes),
    InstanceCollectionType: S.optional(S.String),
    LogUri: S.optional(S.String),
    LogEncryptionKmsKeyId: S.optional(S.String),
    RequestedAmiVersion: S.optional(S.String),
    RunningAmiVersion: S.optional(S.String),
    ReleaseLabel: S.optional(S.String),
    AutoTerminate: S.optional(S.Boolean),
    TerminationProtected: S.optional(S.Boolean),
    UnhealthyNodeReplacement: S.optional(S.Boolean),
    VisibleToAllUsers: S.optional(S.Boolean),
    Applications: S.optional(ApplicationList),
    Tags: S.optional(TagList),
    ServiceRole: S.optional(S.String),
    NormalizedInstanceHours: S.optional(S.Number),
    MasterPublicDnsName: S.optional(S.String),
    Configurations: S.optional(ConfigurationList),
    SecurityConfiguration: S.optional(S.String),
    AutoScalingRole: S.optional(S.String),
    ScaleDownBehavior: S.optional(S.String),
    CustomAmiId: S.optional(S.String),
    EbsRootVolumeSize: S.optional(S.Number),
    RepoUpgradeOnBoot: S.optional(S.String),
    KerberosAttributes: S.optional(KerberosAttributes),
    ClusterArn: S.optional(S.String),
    OutpostArn: S.optional(S.String),
    StepConcurrencyLevel: S.optional(S.Number),
    PlacementGroups: S.optional(PlacementGroupConfigList),
    OSReleaseLabel: S.optional(S.String),
    EbsRootVolumeIops: S.optional(S.Number),
    EbsRootVolumeThroughput: S.optional(S.Number),
    ExtendedSupport: S.optional(S.Boolean),
    MonitoringConfiguration: S.optional(MonitoringConfiguration),
  }),
).annotations({ identifier: "Cluster" }) as any as S.Schema<Cluster>;
export interface JobFlowDetail {
  JobFlowId: string;
  Name: string;
  LogUri?: string;
  LogEncryptionKmsKeyId?: string;
  AmiVersion?: string;
  ExecutionStatusDetail: JobFlowExecutionStatusDetail;
  Instances: JobFlowInstancesDetail;
  Steps?: StepDetailList;
  BootstrapActions?: BootstrapActionDetailList;
  SupportedProducts?: SupportedProductsList;
  VisibleToAllUsers?: boolean;
  JobFlowRole?: string;
  ServiceRole?: string;
  AutoScalingRole?: string;
  ScaleDownBehavior?: string;
}
export const JobFlowDetail = S.suspend(() =>
  S.Struct({
    JobFlowId: S.String,
    Name: S.String,
    LogUri: S.optional(S.String),
    LogEncryptionKmsKeyId: S.optional(S.String),
    AmiVersion: S.optional(S.String),
    ExecutionStatusDetail: JobFlowExecutionStatusDetail,
    Instances: JobFlowInstancesDetail,
    Steps: S.optional(StepDetailList),
    BootstrapActions: S.optional(BootstrapActionDetailList),
    SupportedProducts: S.optional(SupportedProductsList),
    VisibleToAllUsers: S.optional(S.Boolean),
    JobFlowRole: S.optional(S.String),
    ServiceRole: S.optional(S.String),
    AutoScalingRole: S.optional(S.String),
    ScaleDownBehavior: S.optional(S.String),
  }),
).annotations({
  identifier: "JobFlowDetail",
}) as any as S.Schema<JobFlowDetail>;
export type JobFlowDetailList = JobFlowDetail[];
export const JobFlowDetailList = S.Array(JobFlowDetail);
export interface Step {
  Id?: string;
  Name?: string;
  Config?: HadoopStepConfig;
  ActionOnFailure?: string;
  Status?: StepStatus;
  ExecutionRoleArn?: string;
  LogUri?: string;
  EncryptionKeyArn?: string;
}
export const Step = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Config: S.optional(HadoopStepConfig),
    ActionOnFailure: S.optional(S.String),
    Status: S.optional(StepStatus),
    ExecutionRoleArn: S.optional(S.String),
    LogUri: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
  }),
).annotations({ identifier: "Step" }) as any as S.Schema<Step>;
export interface InstanceFleet {
  Id?: string;
  Name?: string;
  Status?: InstanceFleetStatus;
  InstanceFleetType?: string;
  TargetOnDemandCapacity?: number;
  TargetSpotCapacity?: number;
  ProvisionedOnDemandCapacity?: number;
  ProvisionedSpotCapacity?: number;
  InstanceTypeSpecifications?: InstanceTypeSpecificationList;
  LaunchSpecifications?: InstanceFleetProvisioningSpecifications;
  ResizeSpecifications?: InstanceFleetResizingSpecifications;
  Context?: string;
}
export const InstanceFleet = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(InstanceFleetStatus),
    InstanceFleetType: S.optional(S.String),
    TargetOnDemandCapacity: S.optional(S.Number),
    TargetSpotCapacity: S.optional(S.Number),
    ProvisionedOnDemandCapacity: S.optional(S.Number),
    ProvisionedSpotCapacity: S.optional(S.Number),
    InstanceTypeSpecifications: S.optional(InstanceTypeSpecificationList),
    LaunchSpecifications: S.optional(InstanceFleetProvisioningSpecifications),
    ResizeSpecifications: S.optional(InstanceFleetResizingSpecifications),
    Context: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceFleet",
}) as any as S.Schema<InstanceFleet>;
export type InstanceFleetList = InstanceFleet[];
export const InstanceFleetList = S.Array(InstanceFleet);
export interface Instance {
  Id?: string;
  Ec2InstanceId?: string;
  PublicDnsName?: string;
  PublicIpAddress?: string;
  PrivateDnsName?: string;
  PrivateIpAddress?: string;
  Status?: InstanceStatus;
  InstanceGroupId?: string;
  InstanceFleetId?: string;
  Market?: string;
  InstanceType?: string;
  EbsVolumes?: EbsVolumeList;
}
export const Instance = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Ec2InstanceId: S.optional(S.String),
    PublicDnsName: S.optional(S.String),
    PublicIpAddress: S.optional(S.String),
    PrivateDnsName: S.optional(S.String),
    PrivateIpAddress: S.optional(S.String),
    Status: S.optional(InstanceStatus),
    InstanceGroupId: S.optional(S.String),
    InstanceFleetId: S.optional(S.String),
    Market: S.optional(S.String),
    InstanceType: S.optional(S.String),
    EbsVolumes: S.optional(EbsVolumeList),
  }),
).annotations({ identifier: "Instance" }) as any as S.Schema<Instance>;
export type InstanceList = Instance[];
export const InstanceList = S.Array(Instance);
export interface AutoScalingPolicyStatus {
  State?: string;
  StateChangeReason?: AutoScalingPolicyStateChangeReason;
}
export const AutoScalingPolicyStatus = S.suspend(() =>
  S.Struct({
    State: S.optional(S.String),
    StateChangeReason: S.optional(AutoScalingPolicyStateChangeReason),
  }),
).annotations({
  identifier: "AutoScalingPolicyStatus",
}) as any as S.Schema<AutoScalingPolicyStatus>;
export interface AddInstanceFleetInput {
  ClusterId: string;
  InstanceFleet: InstanceFleetConfig;
}
export const AddInstanceFleetInput = S.suspend(() =>
  S.Struct({ ClusterId: S.String, InstanceFleet: InstanceFleetConfig }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddInstanceFleetInput",
}) as any as S.Schema<AddInstanceFleetInput>;
export interface AddInstanceGroupsInput {
  InstanceGroups: InstanceGroupConfigList;
  JobFlowId: string;
}
export const AddInstanceGroupsInput = S.suspend(() =>
  S.Struct({
    InstanceGroups: InstanceGroupConfigList,
    JobFlowId: S.String,
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
  identifier: "AddInstanceGroupsInput",
}) as any as S.Schema<AddInstanceGroupsInput>;
export interface AddJobFlowStepsOutput {
  StepIds?: StepIdsList;
}
export const AddJobFlowStepsOutput = S.suspend(() =>
  S.Struct({ StepIds: S.optional(StepIdsList) }).pipe(ns),
).annotations({
  identifier: "AddJobFlowStepsOutput",
}) as any as S.Schema<AddJobFlowStepsOutput>;
export interface DescribeClusterOutput {
  Cluster?: Cluster;
}
export const DescribeClusterOutput = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "DescribeClusterOutput",
}) as any as S.Schema<DescribeClusterOutput>;
export interface DescribeJobFlowsOutput {
  JobFlows?: JobFlowDetailList;
}
export const DescribeJobFlowsOutput = S.suspend(() =>
  S.Struct({ JobFlows: S.optional(JobFlowDetailList) }).pipe(ns),
).annotations({
  identifier: "DescribeJobFlowsOutput",
}) as any as S.Schema<DescribeJobFlowsOutput>;
export interface DescribeStepOutput {
  Step?: Step;
}
export const DescribeStepOutput = S.suspend(() =>
  S.Struct({ Step: S.optional(Step) }).pipe(ns),
).annotations({
  identifier: "DescribeStepOutput",
}) as any as S.Schema<DescribeStepOutput>;
export interface ListInstanceFleetsOutput {
  InstanceFleets?: InstanceFleetList;
  Marker?: string;
}
export const ListInstanceFleetsOutput = S.suspend(() =>
  S.Struct({
    InstanceFleets: S.optional(InstanceFleetList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInstanceFleetsOutput",
}) as any as S.Schema<ListInstanceFleetsOutput>;
export interface ListInstancesOutput {
  Instances?: InstanceList;
  Marker?: string;
}
export const ListInstancesOutput = S.suspend(() =>
  S.Struct({
    Instances: S.optional(InstanceList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInstancesOutput",
}) as any as S.Schema<ListInstancesOutput>;
export interface RunJobFlowOutput {
  JobFlowId?: string;
  ClusterArn?: string;
}
export const RunJobFlowOutput = S.suspend(() =>
  S.Struct({
    JobFlowId: S.optional(S.String),
    ClusterArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "RunJobFlowOutput",
}) as any as S.Schema<RunJobFlowOutput>;
export interface AutoScalingPolicyDescription {
  Status?: AutoScalingPolicyStatus;
  Constraints?: ScalingConstraints;
  Rules?: ScalingRuleList;
}
export const AutoScalingPolicyDescription = S.suspend(() =>
  S.Struct({
    Status: S.optional(AutoScalingPolicyStatus),
    Constraints: S.optional(ScalingConstraints),
    Rules: S.optional(ScalingRuleList),
  }),
).annotations({
  identifier: "AutoScalingPolicyDescription",
}) as any as S.Schema<AutoScalingPolicyDescription>;
export type InstanceGroupIdsList = string[];
export const InstanceGroupIdsList = S.Array(S.String);
export interface InstanceGroup {
  Id?: string;
  Name?: string;
  Market?: string;
  InstanceGroupType?: string;
  BidPrice?: string;
  InstanceType?: string;
  RequestedInstanceCount?: number;
  RunningInstanceCount?: number;
  Status?: InstanceGroupStatus;
  Configurations?: ConfigurationList;
  ConfigurationsVersion?: number;
  LastSuccessfullyAppliedConfigurations?: ConfigurationList;
  LastSuccessfullyAppliedConfigurationsVersion?: number;
  EbsBlockDevices?: EbsBlockDeviceList;
  EbsOptimized?: boolean;
  ShrinkPolicy?: ShrinkPolicy;
  AutoScalingPolicy?: AutoScalingPolicyDescription;
  CustomAmiId?: string;
}
export const InstanceGroup = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Market: S.optional(S.String),
    InstanceGroupType: S.optional(S.String),
    BidPrice: S.optional(S.String),
    InstanceType: S.optional(S.String),
    RequestedInstanceCount: S.optional(S.Number),
    RunningInstanceCount: S.optional(S.Number),
    Status: S.optional(InstanceGroupStatus),
    Configurations: S.optional(ConfigurationList),
    ConfigurationsVersion: S.optional(S.Number),
    LastSuccessfullyAppliedConfigurations: S.optional(ConfigurationList),
    LastSuccessfullyAppliedConfigurationsVersion: S.optional(S.Number),
    EbsBlockDevices: S.optional(EbsBlockDeviceList),
    EbsOptimized: S.optional(S.Boolean),
    ShrinkPolicy: S.optional(ShrinkPolicy),
    AutoScalingPolicy: S.optional(AutoScalingPolicyDescription),
    CustomAmiId: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceGroup",
}) as any as S.Schema<InstanceGroup>;
export type InstanceGroupList = InstanceGroup[];
export const InstanceGroupList = S.Array(InstanceGroup);
export interface AddInstanceFleetOutput {
  ClusterId?: string;
  InstanceFleetId?: string;
  ClusterArn?: string;
}
export const AddInstanceFleetOutput = S.suspend(() =>
  S.Struct({
    ClusterId: S.optional(S.String),
    InstanceFleetId: S.optional(S.String),
    ClusterArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "AddInstanceFleetOutput",
}) as any as S.Schema<AddInstanceFleetOutput>;
export interface AddInstanceGroupsOutput {
  JobFlowId?: string;
  InstanceGroupIds?: InstanceGroupIdsList;
  ClusterArn?: string;
}
export const AddInstanceGroupsOutput = S.suspend(() =>
  S.Struct({
    JobFlowId: S.optional(S.String),
    InstanceGroupIds: S.optional(InstanceGroupIdsList),
    ClusterArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "AddInstanceGroupsOutput",
}) as any as S.Schema<AddInstanceGroupsOutput>;
export interface ListInstanceGroupsOutput {
  InstanceGroups?: InstanceGroupList;
  Marker?: string;
}
export const ListInstanceGroupsOutput = S.suspend(() =>
  S.Struct({
    InstanceGroups: S.optional(InstanceGroupList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListInstanceGroupsOutput",
}) as any as S.Schema<ListInstanceGroupsOutput>;
export interface PutAutoScalingPolicyInput {
  ClusterId: string;
  InstanceGroupId: string;
  AutoScalingPolicy: AutoScalingPolicy;
}
export const PutAutoScalingPolicyInput = S.suspend(() =>
  S.Struct({
    ClusterId: S.String,
    InstanceGroupId: S.String,
    AutoScalingPolicy: AutoScalingPolicy,
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
  identifier: "PutAutoScalingPolicyInput",
}) as any as S.Schema<PutAutoScalingPolicyInput>;
export interface PutAutoScalingPolicyOutput {
  ClusterId?: string;
  InstanceGroupId?: string;
  AutoScalingPolicy?: AutoScalingPolicyDescription;
  ClusterArn?: string;
}
export const PutAutoScalingPolicyOutput = S.suspend(() =>
  S.Struct({
    ClusterId: S.optional(S.String),
    InstanceGroupId: S.optional(S.String),
    AutoScalingPolicy: S.optional(AutoScalingPolicyDescription),
    ClusterArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PutAutoScalingPolicyOutput",
}) as any as S.Schema<PutAutoScalingPolicyOutput>;

//# Errors
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  {},
  T.AwsQueryError({ code: "InternalFailure", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes an automatic scaling policy from a specified instance group within an Amazon EMR cluster.
 */
export const removeAutoScalingPolicy: (
  input: RemoveAutoScalingPolicyInput,
) => Effect.Effect<
  RemoveAutoScalingPolicyOutput,
  CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveAutoScalingPolicyInput,
  output: RemoveAutoScalingPolicyOutput,
  errors: [],
}));
/**
 * Removes an auto-termination policy from an Amazon EMR cluster.
 */
export const removeAutoTerminationPolicy: (
  input: RemoveAutoTerminationPolicyInput,
) => Effect.Effect<
  RemoveAutoTerminationPolicyOutput,
  CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveAutoTerminationPolicyInput,
  output: RemoveAutoTerminationPolicyOutput,
  errors: [],
}));
/**
 * Removes a managed scaling policy from a specified Amazon EMR cluster.
 */
export const removeManagedScalingPolicy: (
  input: RemoveManagedScalingPolicyInput,
) => Effect.Effect<
  RemoveManagedScalingPolicyOutput,
  CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveManagedScalingPolicyInput,
  output: RemoveManagedScalingPolicyOutput,
  errors: [],
}));
/**
 * You can use the `SetKeepJobFlowAliveWhenNoSteps` to configure a cluster (job flow) to terminate after the step execution, i.e., all your
 * steps are executed. If you want a transient cluster that shuts down after the last of the current executing steps are completed,
 * you can configure `SetKeepJobFlowAliveWhenNoSteps` to false. If you want a long running cluster, configure `SetKeepJobFlowAliveWhenNoSteps` to true.
 *
 * For more information, see Managing Cluster Termination in the *Amazon EMR Management Guide*.
 */
export const setKeepJobFlowAliveWhenNoSteps: (
  input: SetKeepJobFlowAliveWhenNoStepsInput,
) => Effect.Effect<
  SetKeepJobFlowAliveWhenNoStepsResponse,
  InternalServerError | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetKeepJobFlowAliveWhenNoStepsInput,
  output: SetKeepJobFlowAliveWhenNoStepsResponse,
  errors: [InternalServerError],
}));
/**
 * SetTerminationProtection locks a cluster (job flow) so the Amazon EC2 instances
 * in the cluster cannot be terminated by user intervention, an API call, or in the event of a
 * job-flow error. The cluster still terminates upon successful completion of the job flow.
 * Calling `SetTerminationProtection` on a cluster is similar to calling the
 * Amazon EC2
 * `DisableAPITermination` API on all Amazon EC2 instances in a
 * cluster.
 *
 * `SetTerminationProtection` is used to prevent accidental termination of a
 * cluster and to ensure that in the event of an error, the instances persist so that you can
 * recover any data stored in their ephemeral instance storage.
 *
 * To terminate a cluster that has been locked by setting
 * `SetTerminationProtection` to `true`, you must first unlock the
 * job flow by a subsequent call to `SetTerminationProtection` in which you set the
 * value to `false`.
 *
 * For more information, see Managing Cluster
 * Termination in the *Amazon EMR Management Guide*.
 */
export const setTerminationProtection: (
  input: SetTerminationProtectionInput,
) => Effect.Effect<
  SetTerminationProtectionResponse,
  InternalServerError | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetTerminationProtectionInput,
  output: SetTerminationProtectionResponse,
  errors: [InternalServerError],
}));
/**
 * Specify whether to enable unhealthy node replacement, which lets Amazon EMR gracefully
 * replace core nodes on a cluster if any nodes become unhealthy. For example, a node becomes
 * unhealthy if disk usage is above 90%. If unhealthy node replacement is on and `TerminationProtected` are off,
 * Amazon EMR immediately terminates the unhealthy core nodes. To use unhealthy node replacement
 * and retain unhealthy core nodes, use to turn on
 * termination protection. In such cases, Amazon EMR adds
 * the unhealthy nodes to a denylist, reducing job interruptions and failures.
 *
 * If unhealthy node replacement is on, Amazon EMR
 * notifies YARN and other applications on the cluster to stop scheduling tasks
 * with these nodes, moves the data, and then terminates the nodes.
 *
 * For more information, see graceful
 * node replacement in the *Amazon EMR Management Guide*.
 */
export const setUnhealthyNodeReplacement: (
  input: SetUnhealthyNodeReplacementInput,
) => Effect.Effect<
  SetUnhealthyNodeReplacementResponse,
  InternalServerError | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetUnhealthyNodeReplacementInput,
  output: SetUnhealthyNodeReplacementResponse,
  errors: [InternalServerError],
}));
/**
 * The SetVisibleToAllUsers parameter is no longer supported. Your cluster may be
 * visible to all users in your account. To restrict cluster access using an IAM policy, see Identity and Access
 * Management for Amazon EMR.
 *
 * Sets the Cluster$VisibleToAllUsers value for an Amazon EMR
 * cluster. When `true`, IAM principals in the Amazon Web Services account can perform Amazon EMR cluster actions that their IAM policies allow. When `false`, only the IAM
 * principal that created the cluster and the Amazon Web Services account root user can perform
 * Amazon EMR actions on the cluster, regardless of IAM permissions
 * policies attached to other IAM principals.
 *
 * This action works on running clusters. When you create a cluster, use the RunJobFlowInput$VisibleToAllUsers parameter.
 *
 * For more information, see Understanding the Amazon EMR Cluster VisibleToAllUsers Setting in the
 * *Amazon EMR Management Guide*.
 */
export const setVisibleToAllUsers: (
  input: SetVisibleToAllUsersInput,
) => Effect.Effect<
  SetVisibleToAllUsersResponse,
  InternalServerError | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetVisibleToAllUsersInput,
  output: SetVisibleToAllUsersResponse,
  errors: [InternalServerError],
}));
/**
 * TerminateJobFlows shuts a list of clusters (job flows) down. When a job flow is shut
 * down, any step not yet completed is canceled and the Amazon EC2 instances on which
 * the cluster is running are stopped. Any log files not already saved are uploaded to Amazon S3 if a LogUri was specified when the cluster was created.
 *
 * The maximum number of clusters allowed is 10. The call to `TerminateJobFlows`
 * is asynchronous. Depending on the configuration of the cluster, it may take up to 1-5
 * minutes for the cluster to completely terminate and release allocated resources, such as
 * Amazon EC2 instances.
 */
export const terminateJobFlows: (
  input: TerminateJobFlowsInput,
) => Effect.Effect<
  TerminateJobFlowsResponse,
  InternalServerError | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateJobFlowsInput,
  output: TerminateJobFlowsResponse,
  errors: [InternalServerError],
}));
/**
 * Maps a user or group to the Amazon EMR Studio specified by
 * `StudioId`, and applies a session policy to refine Studio permissions for that
 * user or group. Use `CreateStudioSessionMapping` to assign users to a Studio when
 * you use IAM Identity Center authentication. For instructions on how to assign users to a
 * Studio when you use IAM authentication, see Assign a user or group to your EMR Studio.
 */
export const createStudioSessionMapping: (
  input: CreateStudioSessionMappingInput,
) => Effect.Effect<
  CreateStudioSessionMappingResponse,
  InternalServerError | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStudioSessionMappingInput,
  output: CreateStudioSessionMappingResponse,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * Deletes a security configuration.
 */
export const deleteSecurityConfiguration: (
  input: DeleteSecurityConfigurationInput,
) => Effect.Effect<
  DeleteSecurityConfigurationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSecurityConfigurationInput,
  output: DeleteSecurityConfigurationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Provides the details of a security configuration by returning the configuration
 * JSON.
 */
export const describeSecurityConfiguration: (
  input: DescribeSecurityConfigurationInput,
) => Effect.Effect<
  DescribeSecurityConfigurationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSecurityConfigurationInput,
  output: DescribeSecurityConfigurationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns the auto-termination policy for an Amazon EMR cluster.
 */
export const getAutoTerminationPolicy: (
  input: GetAutoTerminationPolicyInput,
) => Effect.Effect<
  GetAutoTerminationPolicyOutput,
  CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutoTerminationPolicyInput,
  output: GetAutoTerminationPolicyOutput,
  errors: [],
}));
/**
 * Fetches the attached managed scaling policy for an Amazon EMR cluster.
 */
export const getManagedScalingPolicy: (
  input: GetManagedScalingPolicyInput,
) => Effect.Effect<
  GetManagedScalingPolicyOutput,
  CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetManagedScalingPolicyInput,
  output: GetManagedScalingPolicyOutput,
  errors: [],
}));
/**
 * The presigned URL properties for the cluster's application user interface.
 */
export const getOnClusterAppUIPresignedURL: (
  input: GetOnClusterAppUIPresignedURLInput,
) => Effect.Effect<
  GetOnClusterAppUIPresignedURLOutput,
  InternalServerError | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetOnClusterAppUIPresignedURLInput,
  output: GetOnClusterAppUIPresignedURLOutput,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * The presigned URL properties for the cluster's application user interface.
 */
export const getPersistentAppUIPresignedURL: (
  input: GetPersistentAppUIPresignedURLInput,
) => Effect.Effect<
  GetPersistentAppUIPresignedURLOutput,
  InternalServerError | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPersistentAppUIPresignedURLInput,
  output: GetPersistentAppUIPresignedURLOutput,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * Modifies the number of steps that can be executed concurrently for the cluster specified
 * using ClusterID.
 */
export const modifyCluster: (
  input: ModifyClusterInput,
) => Effect.Effect<
  ModifyClusterOutput,
  InternalServerError | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterInput,
  output: ModifyClusterOutput,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * Modifies the target On-Demand and target Spot capacities for the instance fleet with the
 * specified InstanceFleetID within the cluster specified using ClusterID. The call either
 * succeeds or fails atomically.
 *
 * The instance fleet configuration is available only in Amazon EMR releases
 * 4.8.0 and later, excluding 5.0.x versions.
 */
export const modifyInstanceFleet: (
  input: ModifyInstanceFleetInput,
) => Effect.Effect<
  ModifyInstanceFleetResponse,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyInstanceFleetInput,
  output: ModifyInstanceFleetResponse,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Auto-termination is supported in Amazon EMR releases 5.30.0 and 6.1.0 and
 * later. For more information, see Using an
 * auto-termination policy.
 *
 * Creates or updates an auto-termination policy for an Amazon EMR cluster. An
 * auto-termination policy defines the amount of idle time in seconds after which a cluster
 * automatically terminates. For alternative cluster termination options, see Control
 * cluster termination.
 */
export const putAutoTerminationPolicy: (
  input: PutAutoTerminationPolicyInput,
) => Effect.Effect<
  PutAutoTerminationPolicyOutput,
  CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAutoTerminationPolicyInput,
  output: PutAutoTerminationPolicyOutput,
  errors: [],
}));
/**
 * Removes a user or group from an Amazon EMR Studio.
 */
export const deleteStudioSessionMapping: (
  input: DeleteStudioSessionMappingInput,
) => Effect.Effect<
  DeleteStudioSessionMappingResponse,
  InternalServerError | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStudioSessionMappingInput,
  output: DeleteStudioSessionMappingResponse,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * Stops a notebook execution.
 */
export const stopNotebookExecution: (
  input: StopNotebookExecutionInput,
) => Effect.Effect<
  StopNotebookExecutionResponse,
  InternalServerError | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopNotebookExecutionInput,
  output: StopNotebookExecutionResponse,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * Updates the session policy attached to the user or group for the specified Amazon EMR Studio.
 */
export const updateStudioSessionMapping: (
  input: UpdateStudioSessionMappingInput,
) => Effect.Effect<
  UpdateStudioSessionMappingResponse,
  InternalServerError | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStudioSessionMappingInput,
  output: UpdateStudioSessionMappingResponse,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * Removes an Amazon EMR Studio from the Studio metadata store.
 */
export const deleteStudio: (
  input: DeleteStudioInput,
) => Effect.Effect<
  DeleteStudioResponse,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStudioInput,
  output: DeleteStudioResponse,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates or updates an Amazon EMR block public access configuration for your
 * Amazon Web Services account in the current Region. For more information see Configure Block
 * Public Access for Amazon EMR in the Amazon EMR
 * Management Guide.
 */
export const putBlockPublicAccessConfiguration: (
  input: PutBlockPublicAccessConfigurationInput,
) => Effect.Effect<
  PutBlockPublicAccessConfigurationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBlockPublicAccessConfigurationInput,
  output: PutBlockPublicAccessConfigurationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Removes tags from an Amazon EMR resource, such as a cluster or Amazon EMR Studio. Tags make it easier to associate resources in various ways, such as grouping
 * clusters to track your Amazon EMR resource allocation costs. For more information,
 * see Tag
 * Clusters.
 *
 * The following example removes the stack tag with value Prod from a cluster:
 */
export const removeTags: (
  input: RemoveTagsInput,
) => Effect.Effect<
  RemoveTagsOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsInput,
  output: RemoveTagsOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Updates an Amazon EMR Studio configuration, including attributes such as name,
 * description, and subnets.
 */
export const updateStudio: (
  input: UpdateStudioInput,
) => Effect.Effect<
  UpdateStudioResponse,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStudioInput,
  output: UpdateStudioResponse,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Adds tags to an Amazon EMR resource, such as a cluster or an Amazon EMR
 * Studio. Tags make it easier to associate resources in various ways, such as grouping
 * clusters to track your Amazon EMR resource allocation costs. For more information,
 * see Tag
 * Clusters.
 */
export const addTags: (
  input: AddTagsInput,
) => Effect.Effect<
  AddTagsOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsInput,
  output: AddTagsOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates a security configuration, which is stored in the service and can be specified
 * when a cluster is created.
 */
export const createSecurityConfiguration: (
  input: CreateSecurityConfigurationInput,
) => Effect.Effect<
  CreateSecurityConfigurationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSecurityConfigurationInput,
  output: CreateSecurityConfigurationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates a new Amazon EMR Studio.
 */
export const createStudio: (
  input: CreateStudioInput,
) => Effect.Effect<
  CreateStudioOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStudioInput,
  output: CreateStudioOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Cancels a pending step or steps in a running cluster. Available only in Amazon EMR versions 4.8.0 and later, excluding version 5.0.0. A maximum of 256 steps are allowed in
 * each CancelSteps request. CancelSteps is idempotent but asynchronous; it does not guarantee
 * that a step will be canceled, even if the request is successfully submitted. When you use
 * Amazon EMR releases 5.28.0 and later, you can cancel steps that are in a
 * `PENDING` or `RUNNING` state. In earlier versions of Amazon EMR, you can only cancel steps that are in a `PENDING` state.
 */
export const cancelSteps: (
  input: CancelStepsInput,
) => Effect.Effect<
  CancelStepsOutput,
  InternalServerError | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelStepsInput,
  output: CancelStepsOutput,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * Creates a persistent application user interface.
 */
export const createPersistentAppUI: (
  input: CreatePersistentAppUIInput,
) => Effect.Effect<
  CreatePersistentAppUIOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePersistentAppUIInput,
  output: CreatePersistentAppUIOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Describes a persistent application user interface.
 */
export const describePersistentAppUI: (
  input: DescribePersistentAppUIInput,
) => Effect.Effect<
  DescribePersistentAppUIOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePersistentAppUIInput,
  output: DescribePersistentAppUIOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Provides Amazon EMR release label details, such as the releases available the
 * Region where the API request is run, and the available applications for a specific Amazon EMR release label. Can also list Amazon EMR releases that support a
 * specified version of Spark.
 */
export const describeReleaseLabel: (
  input: DescribeReleaseLabelInput,
) => Effect.Effect<
  DescribeReleaseLabelOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReleaseLabelInput,
  output: DescribeReleaseLabelOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns details for the specified Amazon EMR Studio including ID, Name, VPC,
 * Studio access URL, and so on.
 */
export const describeStudio: (
  input: DescribeStudioInput,
) => Effect.Effect<
  DescribeStudioOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStudioInput,
  output: DescribeStudioOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns the Amazon EMR block public access configuration for your Amazon Web Services account in the current Region. For more information see Configure Block
 * Public Access for Amazon EMR in the Amazon EMR
 * Management Guide.
 */
export const getBlockPublicAccessConfiguration: (
  input: GetBlockPublicAccessConfigurationInput,
) => Effect.Effect<
  GetBlockPublicAccessConfigurationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBlockPublicAccessConfigurationInput,
  output: GetBlockPublicAccessConfigurationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Fetches mapping details for the specified Amazon EMR Studio and identity (user
 * or group).
 */
export const getStudioSessionMapping: (
  input: GetStudioSessionMappingInput,
) => Effect.Effect<
  GetStudioSessionMappingOutput,
  InternalServerError | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStudioSessionMappingInput,
  output: GetStudioSessionMappingOutput,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * Provides information about the bootstrap actions associated with a cluster.
 */
export const listBootstrapActions: {
  (
    input: ListBootstrapActionsInput,
  ): Effect.Effect<
    ListBootstrapActionsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBootstrapActionsInput,
  ) => Stream.Stream<
    ListBootstrapActionsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBootstrapActionsInput,
  ) => Stream.Stream<
    Command,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBootstrapActionsInput,
  output: ListBootstrapActionsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "BootstrapActions",
  } as const,
}));
/**
 * Provides the status of all clusters visible to this Amazon Web Services account. Allows
 * you to filter the list of clusters based on certain criteria; for example, filtering by
 * cluster creation date and time or by status. This call returns a maximum of 50 clusters in
 * unsorted order per call, but returns a marker to track the paging of the cluster list
 * across multiple ListClusters calls.
 */
export const listClusters: {
  (
    input: ListClustersInput,
  ): Effect.Effect<
    ListClustersOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClustersInput,
  ) => Stream.Stream<
    ListClustersOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClustersInput,
  ) => Stream.Stream<
    ClusterSummary,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClustersInput,
  output: ListClustersOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Clusters",
  } as const,
}));
/**
 * Provides summaries of all notebook executions. You can filter the list based on multiple
 * criteria such as status, time range, and editor id. Returns a maximum of 50 notebook
 * executions and a marker to track the paging of a longer notebook execution list across
 * multiple `ListNotebookExecutions` calls.
 */
export const listNotebookExecutions: {
  (
    input: ListNotebookExecutionsInput,
  ): Effect.Effect<
    ListNotebookExecutionsOutput,
    InternalServerError | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNotebookExecutionsInput,
  ) => Stream.Stream<
    ListNotebookExecutionsOutput,
    InternalServerError | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNotebookExecutionsInput,
  ) => Stream.Stream<
    NotebookExecutionSummary,
    InternalServerError | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNotebookExecutionsInput,
  output: ListNotebookExecutionsOutput,
  errors: [InternalServerError, InvalidRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "NotebookExecutions",
  } as const,
}));
/**
 * Retrieves release labels of Amazon EMR services in the Region where the API is
 * called.
 */
export const listReleaseLabels: {
  (
    input: ListReleaseLabelsInput,
  ): Effect.Effect<
    ListReleaseLabelsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReleaseLabelsInput,
  ) => Stream.Stream<
    ListReleaseLabelsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReleaseLabelsInput,
  ) => Stream.Stream<
    unknown,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReleaseLabelsInput,
  output: ListReleaseLabelsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the security configurations visible to this account, providing their creation
 * dates and times, and their names. This call returns a maximum of 50 clusters per call, but
 * returns a marker to track the paging of the cluster list across multiple
 * ListSecurityConfigurations calls.
 */
export const listSecurityConfigurations: {
  (
    input: ListSecurityConfigurationsInput,
  ): Effect.Effect<
    ListSecurityConfigurationsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecurityConfigurationsInput,
  ) => Stream.Stream<
    ListSecurityConfigurationsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecurityConfigurationsInput,
  ) => Stream.Stream<
    SecurityConfigurationSummary,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSecurityConfigurationsInput,
  output: ListSecurityConfigurationsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "SecurityConfigurations",
  } as const,
}));
/**
 * Provides a list of steps for the cluster in reverse order unless you specify
 * `stepIds` with the request or filter by `StepStates`. You can
 * specify a maximum of 10 `stepIDs`. The CLI automatically
 * paginates results to return a list greater than 50 steps. To return more than 50 steps
 * using the CLI, specify a `Marker`, which is a pagination token
 * that indicates the next set of steps to retrieve.
 */
export const listSteps: {
  (
    input: ListStepsInput,
  ): Effect.Effect<
    ListStepsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStepsInput,
  ) => Stream.Stream<
    ListStepsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStepsInput,
  ) => Stream.Stream<
    StepSummary,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStepsInput,
  output: ListStepsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Steps",
  } as const,
}));
/**
 * Returns a list of all Amazon EMR Studios associated with the Amazon Web Services account. The list includes details such as ID, Studio Access URL, and
 * creation time for each Studio.
 */
export const listStudios: {
  (
    input: ListStudiosInput,
  ): Effect.Effect<
    ListStudiosOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStudiosInput,
  ) => Stream.Stream<
    ListStudiosOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStudiosInput,
  ) => Stream.Stream<
    StudioSummary,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStudiosInput,
  output: ListStudiosOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Studios",
  } as const,
}));
/**
 * Returns a list of all user or group session mappings for the Amazon EMR Studio
 * specified by `StudioId`.
 */
export const listStudioSessionMappings: {
  (
    input: ListStudioSessionMappingsInput,
  ): Effect.Effect<
    ListStudioSessionMappingsOutput,
    InternalServerError | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStudioSessionMappingsInput,
  ) => Stream.Stream<
    ListStudioSessionMappingsOutput,
    InternalServerError | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStudioSessionMappingsInput,
  ) => Stream.Stream<
    SessionMappingSummary,
    InternalServerError | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStudioSessionMappingsInput,
  output: ListStudioSessionMappingsOutput,
  errors: [InternalServerError, InvalidRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "SessionMappings",
  } as const,
}));
/**
 * A list of the instance types that Amazon EMR supports. You can filter the
 * list by Amazon Web Services Region and Amazon EMR release.
 */
export const listSupportedInstanceTypes: {
  (
    input: ListSupportedInstanceTypesInput,
  ): Effect.Effect<
    ListSupportedInstanceTypesOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSupportedInstanceTypesInput,
  ) => Stream.Stream<
    ListSupportedInstanceTypesOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSupportedInstanceTypesInput,
  ) => Stream.Stream<
    unknown,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSupportedInstanceTypesInput,
  output: ListSupportedInstanceTypesOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: { inputToken: "Marker", outputToken: "Marker" } as const,
}));
/**
 * Creates or updates a managed scaling policy for an Amazon EMR cluster. The
 * managed scaling policy defines the limits for resources, such as Amazon EC2
 * instances that can be added or terminated from a cluster. The policy only applies to the
 * core and task nodes. The master node cannot be scaled after initial configuration.
 */
export const putManagedScalingPolicy: (
  input: PutManagedScalingPolicyInput,
) => Effect.Effect<
  PutManagedScalingPolicyOutput,
  CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutManagedScalingPolicyInput,
  output: PutManagedScalingPolicyOutput,
  errors: [],
}));
/**
 * Starts a notebook execution.
 */
export const startNotebookExecution: (
  input: StartNotebookExecutionInput,
) => Effect.Effect<
  StartNotebookExecutionOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartNotebookExecutionInput,
  output: StartNotebookExecutionOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Provides details of a notebook execution.
 */
export const describeNotebookExecution: (
  input: DescribeNotebookExecutionInput,
) => Effect.Effect<
  DescribeNotebookExecutionOutput,
  InternalServerError | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNotebookExecutionInput,
  output: DescribeNotebookExecutionOutput,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * Provides temporary, HTTP basic credentials that are associated with a given runtime
 * IAM role and used by a cluster with fine-grained access control
 * activated. You can use these credentials to connect to cluster endpoints that support
 * username and password authentication.
 */
export const getClusterSessionCredentials: (
  input: GetClusterSessionCredentialsInput,
) => Effect.Effect<
  GetClusterSessionCredentialsOutput,
  InternalServerError | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterSessionCredentialsInput,
  output: GetClusterSessionCredentialsOutput,
  errors: [InternalServerError, InvalidRequestException],
}));
/**
 * ModifyInstanceGroups modifies the number of nodes and configuration settings of an
 * instance group. The input parameters include the new target instance count for the group
 * and the instance group ID. The call will either succeed or fail atomically.
 */
export const modifyInstanceGroups: (
  input: ModifyInstanceGroupsInput,
) => Effect.Effect<
  ModifyInstanceGroupsResponse,
  InternalServerError | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyInstanceGroupsInput,
  output: ModifyInstanceGroupsResponse,
  errors: [InternalServerError],
}));
/**
 * AddJobFlowSteps adds new steps to a running cluster. A maximum of 256 steps are allowed
 * in each job flow.
 *
 * If your cluster is long-running (such as a Hive data warehouse) or complex, you may
 * require more than 256 steps to process your data. You can bypass the 256-step limitation in
 * various ways, including using SSH to connect to the master node and submitting queries
 * directly to the software running on the master node, such as Hive and Hadoop.
 *
 * A step specifies the location of a JAR file stored either on the master node of the
 * cluster or in Amazon S3. Each step is performed by the main function of the main
 * class of the JAR file. The main class can be specified either in the manifest of the JAR or
 * by using the MainFunction parameter of the step.
 *
 * Amazon EMR executes each step in the order listed. For a step to be considered
 * complete, the main function must exit with a zero exit code and all Hadoop jobs started
 * while the step was running must have completed and run successfully.
 *
 * You can only add steps to a cluster that is in one of the following states: STARTING,
 * BOOTSTRAPPING, RUNNING, or WAITING.
 *
 * The string values passed into `HadoopJarStep` object cannot exceed a total
 * of 10240 characters.
 */
export const addJobFlowSteps: (
  input: AddJobFlowStepsInput,
) => Effect.Effect<
  AddJobFlowStepsOutput,
  InternalServerError | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddJobFlowStepsInput,
  output: AddJobFlowStepsOutput,
  errors: [InternalServerError],
}));
/**
 * Provides cluster-level details including status, hardware and software configuration,
 * VPC settings, and so on.
 */
export const describeCluster: (
  input: DescribeClusterInput,
) => Effect.Effect<
  DescribeClusterOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterInput,
  output: DescribeClusterOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * This API is no longer supported and will eventually be removed. We recommend you use
 * ListClusters, DescribeCluster, ListSteps, ListInstanceGroups and ListBootstrapActions instead.
 *
 * DescribeJobFlows returns a list of job flows that match all of the supplied parameters.
 * The parameters can include a list of job flow IDs, job flow states, and restrictions on job
 * flow creation date and time.
 *
 * Regardless of supplied parameters, only job flows created within the last two months are
 * returned.
 *
 * If no parameters are supplied, then job flows matching either of the following criteria
 * are returned:
 *
 * - Job flows created and completed in the last two weeks
 *
 * - Job flows created within the last two months that are in one of the following
 * states: `RUNNING`, `WAITING`, `SHUTTING_DOWN`,
 * `STARTING`
 *
 * Amazon EMR can return a maximum of 512 job flow descriptions.
 */
export const describeJobFlows: (
  input: DescribeJobFlowsInput,
) => Effect.Effect<
  DescribeJobFlowsOutput,
  InternalServerError | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobFlowsInput,
  output: DescribeJobFlowsOutput,
  errors: [InternalServerError],
}));
/**
 * Provides more detail about the cluster step.
 */
export const describeStep: (
  input: DescribeStepInput,
) => Effect.Effect<
  DescribeStepOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStepInput,
  output: DescribeStepOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Lists all available details about the instance fleets in a cluster.
 *
 * The instance fleet configuration is available only in Amazon EMR releases
 * 4.8.0 and later, excluding 5.0.x versions.
 */
export const listInstanceFleets: {
  (
    input: ListInstanceFleetsInput,
  ): Effect.Effect<
    ListInstanceFleetsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInstanceFleetsInput,
  ) => Stream.Stream<
    ListInstanceFleetsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInstanceFleetsInput,
  ) => Stream.Stream<
    InstanceFleet,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInstanceFleetsInput,
  output: ListInstanceFleetsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "InstanceFleets",
  } as const,
}));
/**
 * Provides information for all active Amazon EC2 instances and Amazon EC2
 * instances terminated in the last 30 days, up to a maximum of 2,000. Amazon EC2
 * instances in any of the following states are considered active: AWAITING_FULFILLMENT,
 * PROVISIONING, BOOTSTRAPPING, RUNNING.
 */
export const listInstances: {
  (
    input: ListInstancesInput,
  ): Effect.Effect<
    ListInstancesOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInstancesInput,
  ) => Stream.Stream<
    ListInstancesOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInstancesInput,
  ) => Stream.Stream<
    Instance,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInstancesInput,
  output: ListInstancesOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Instances",
  } as const,
}));
/**
 * RunJobFlow creates and starts running a new cluster (job flow). The cluster runs the
 * steps specified. After the steps complete, the cluster stops and the HDFS partition is
 * lost. To prevent loss of data, configure the last step of the job flow to store results in
 * Amazon S3. If the JobFlowInstancesConfig
 * `KeepJobFlowAliveWhenNoSteps` parameter is set to `TRUE`, the cluster
 * transitions to the WAITING state rather than shutting down after the steps have completed.
 *
 * For additional protection, you can set the JobFlowInstancesConfig
 * `TerminationProtected` parameter to `TRUE` to lock the cluster and
 * prevent it from being terminated by API call, user intervention, or in the event of a job
 * flow error.
 *
 * A maximum of 256 steps are allowed in each job flow.
 *
 * If your cluster is long-running (such as a Hive data warehouse) or complex, you may
 * require more than 256 steps to process your data. You can bypass the 256-step limitation in
 * various ways, including using the SSH shell to connect to the master node and submitting
 * queries directly to the software running on the master node, such as Hive and
 * Hadoop.
 *
 * For long-running clusters, we recommend that you periodically store your results.
 *
 * The instance fleets configuration is available only in Amazon EMR releases
 * 4.8.0 and later, excluding 5.0.x versions. The RunJobFlow request can contain
 * InstanceFleets parameters or InstanceGroups parameters, but not both.
 */
export const runJobFlow: (
  input: RunJobFlowInput,
) => Effect.Effect<
  RunJobFlowOutput,
  InternalServerError | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RunJobFlowInput,
  output: RunJobFlowOutput,
  errors: [InternalServerError],
}));
/**
 * Adds an instance fleet to a running cluster.
 *
 * The instance fleet configuration is available only in Amazon EMR releases
 * 4.8.0 and later, excluding 5.0.x.
 */
export const addInstanceFleet: (
  input: AddInstanceFleetInput,
) => Effect.Effect<
  AddInstanceFleetOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddInstanceFleetInput,
  output: AddInstanceFleetOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Adds one or more instance groups to a running cluster.
 */
export const addInstanceGroups: (
  input: AddInstanceGroupsInput,
) => Effect.Effect<
  AddInstanceGroupsOutput,
  InternalServerError | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddInstanceGroupsInput,
  output: AddInstanceGroupsOutput,
  errors: [InternalServerError],
}));
/**
 * Provides all available details about the instance groups in a cluster.
 */
export const listInstanceGroups: {
  (
    input: ListInstanceGroupsInput,
  ): Effect.Effect<
    ListInstanceGroupsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInstanceGroupsInput,
  ) => Stream.Stream<
    ListInstanceGroupsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInstanceGroupsInput,
  ) => Stream.Stream<
    InstanceGroup,
    InternalServerException | InvalidRequestException | CommonErrors,
    Creds | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInstanceGroupsInput,
  output: ListInstanceGroupsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "InstanceGroups",
  } as const,
}));
/**
 * Creates or updates an automatic scaling policy for a core instance group or task
 * instance group in an Amazon EMR cluster. The automatic scaling policy defines how
 * an instance group dynamically adds and terminates Amazon EC2 instances in response
 * to the value of a CloudWatch metric.
 */
export const putAutoScalingPolicy: (
  input: PutAutoScalingPolicyInput,
) => Effect.Effect<
  PutAutoScalingPolicyOutput,
  CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAutoScalingPolicyInput,
  output: PutAutoScalingPolicyOutput,
  errors: [],
}));

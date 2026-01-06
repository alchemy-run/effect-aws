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
const ns = T.XmlNamespace("http://memorydb.amazonaws.com/doc/2021-01-01/");
const svc = T.AwsApiService({
  sdkId: "MemoryDB",
  serviceShapeName: "AmazonMemoryDB",
});
const auth = T.AwsAuthSigv4({ name: "memorydb" });
const ver = T.ServiceVersion("2021-01-01");
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
                        url: "https://memory-db-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://memory-db-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://memory-db.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
              conditions: [
                { fn: "stringEquals", argv: [{ ref: "Region" }, "fips"] },
              ],
              endpoint: {
                url: "https://memory-db-fips.us-west-1.amazonaws.com",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "memorydb",
                      signingRegion: "us-west-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://memory-db.{Region}.{PartitionResult#dnsSuffix}",
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
export type TargetBucket = string;
export type KmsKeyId = string;
export type UserName = string;
export type IntegerOptional = number;
export type ACLName = string;
export type AccessString = string;
export type FilterName = string;
export type FilterValue = string;
export type Integer = number;
export type Double = number;
export type ExceptionMessage = string;
export type AwsQueryErrorMessage = string;

//# Schemas
export type ClusterNameList = string[];
export const ClusterNameList = S.Array(S.String);
export type UserNameListInput = string[];
export const UserNameListInput = S.Array(S.String);
export type SecurityGroupIdsList = string[];
export const SecurityGroupIdsList = S.Array(
  S.String.pipe(T.XmlName("SecurityGroupId")),
);
export type SnapshotArnsList = string[];
export const SnapshotArnsList = S.Array(
  S.String.pipe(T.XmlName("SnapshotArn")),
);
export type SubnetIdentifierList = string[];
export const SubnetIdentifierList = S.Array(
  S.String.pipe(T.XmlName("SubnetIdentifier")),
);
export type ServiceUpdateStatusList = string[];
export const ServiceUpdateStatusList = S.Array(S.String);
export type ParameterNameList = string[];
export const ParameterNameList = S.Array(S.String);
export type KeyList = string[];
export const KeyList = S.Array(S.String);
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(
  Tag.pipe(T.XmlName("Tag")).annotations({ identifier: "Tag" }),
);
export interface CreateACLRequest {
  ACLName: string;
  UserNames?: UserNameListInput;
  Tags?: TagList;
}
export const CreateACLRequest = S.suspend(() =>
  S.Struct({
    ACLName: S.String,
    UserNames: S.optional(UserNameListInput),
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
  identifier: "CreateACLRequest",
}) as any as S.Schema<CreateACLRequest>;
export interface CreateClusterRequest {
  ClusterName: string;
  NodeType: string;
  MultiRegionClusterName?: string;
  ParameterGroupName?: string;
  Description?: string;
  NumShards?: number;
  NumReplicasPerShard?: number;
  SubnetGroupName?: string;
  SecurityGroupIds?: SecurityGroupIdsList;
  MaintenanceWindow?: string;
  Port?: number;
  SnsTopicArn?: string;
  TLSEnabled?: boolean;
  KmsKeyId?: string;
  SnapshotArns?: SnapshotArnsList;
  SnapshotName?: string;
  SnapshotRetentionLimit?: number;
  Tags?: TagList;
  SnapshotWindow?: string;
  ACLName: string;
  Engine?: string;
  EngineVersion?: string;
  AutoMinorVersionUpgrade?: boolean;
  DataTiering?: boolean;
  NetworkType?: string;
  IpDiscovery?: string;
}
export const CreateClusterRequest = S.suspend(() =>
  S.Struct({
    ClusterName: S.String,
    NodeType: S.String,
    MultiRegionClusterName: S.optional(S.String),
    ParameterGroupName: S.optional(S.String),
    Description: S.optional(S.String),
    NumShards: S.optional(S.Number),
    NumReplicasPerShard: S.optional(S.Number),
    SubnetGroupName: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIdsList),
    MaintenanceWindow: S.optional(S.String),
    Port: S.optional(S.Number),
    SnsTopicArn: S.optional(S.String),
    TLSEnabled: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    SnapshotArns: S.optional(SnapshotArnsList),
    SnapshotName: S.optional(S.String),
    SnapshotRetentionLimit: S.optional(S.Number),
    Tags: S.optional(TagList),
    SnapshotWindow: S.optional(S.String),
    ACLName: S.String,
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    DataTiering: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    IpDiscovery: S.optional(S.String),
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
  identifier: "CreateClusterRequest",
}) as any as S.Schema<CreateClusterRequest>;
export interface CreateMultiRegionClusterRequest {
  MultiRegionClusterNameSuffix: string;
  Description?: string;
  Engine?: string;
  EngineVersion?: string;
  NodeType: string;
  MultiRegionParameterGroupName?: string;
  NumShards?: number;
  TLSEnabled?: boolean;
  Tags?: TagList;
}
export const CreateMultiRegionClusterRequest = S.suspend(() =>
  S.Struct({
    MultiRegionClusterNameSuffix: S.String,
    Description: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    NodeType: S.String,
    MultiRegionParameterGroupName: S.optional(S.String),
    NumShards: S.optional(S.Number),
    TLSEnabled: S.optional(S.Boolean),
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
  identifier: "CreateMultiRegionClusterRequest",
}) as any as S.Schema<CreateMultiRegionClusterRequest>;
export interface CreateParameterGroupRequest {
  ParameterGroupName: string;
  Family: string;
  Description?: string;
  Tags?: TagList;
}
export const CreateParameterGroupRequest = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.String,
    Family: S.String,
    Description: S.optional(S.String),
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
  identifier: "CreateParameterGroupRequest",
}) as any as S.Schema<CreateParameterGroupRequest>;
export interface CreateSnapshotRequest {
  ClusterName: string;
  SnapshotName: string;
  KmsKeyId?: string;
  Tags?: TagList;
}
export const CreateSnapshotRequest = S.suspend(() =>
  S.Struct({
    ClusterName: S.String,
    SnapshotName: S.String,
    KmsKeyId: S.optional(S.String),
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
  identifier: "CreateSnapshotRequest",
}) as any as S.Schema<CreateSnapshotRequest>;
export interface CreateSubnetGroupRequest {
  SubnetGroupName: string;
  Description?: string;
  SubnetIds: SubnetIdentifierList;
  Tags?: TagList;
}
export const CreateSubnetGroupRequest = S.suspend(() =>
  S.Struct({
    SubnetGroupName: S.String,
    Description: S.optional(S.String),
    SubnetIds: SubnetIdentifierList,
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
  identifier: "CreateSubnetGroupRequest",
}) as any as S.Schema<CreateSubnetGroupRequest>;
export interface DeleteACLRequest {
  ACLName: string;
}
export const DeleteACLRequest = S.suspend(() =>
  S.Struct({ ACLName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteACLRequest",
}) as any as S.Schema<DeleteACLRequest>;
export interface DeleteClusterRequest {
  ClusterName: string;
  MultiRegionClusterName?: string;
  FinalSnapshotName?: string;
}
export const DeleteClusterRequest = S.suspend(() =>
  S.Struct({
    ClusterName: S.String,
    MultiRegionClusterName: S.optional(S.String),
    FinalSnapshotName: S.optional(S.String),
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
  identifier: "DeleteClusterRequest",
}) as any as S.Schema<DeleteClusterRequest>;
export interface DeleteMultiRegionClusterRequest {
  MultiRegionClusterName: string;
}
export const DeleteMultiRegionClusterRequest = S.suspend(() =>
  S.Struct({ MultiRegionClusterName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMultiRegionClusterRequest",
}) as any as S.Schema<DeleteMultiRegionClusterRequest>;
export interface DeleteParameterGroupRequest {
  ParameterGroupName: string;
}
export const DeleteParameterGroupRequest = S.suspend(() =>
  S.Struct({ ParameterGroupName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteParameterGroupRequest",
}) as any as S.Schema<DeleteParameterGroupRequest>;
export interface DeleteSnapshotRequest {
  SnapshotName: string;
}
export const DeleteSnapshotRequest = S.suspend(() =>
  S.Struct({ SnapshotName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSnapshotRequest",
}) as any as S.Schema<DeleteSnapshotRequest>;
export interface DeleteSubnetGroupRequest {
  SubnetGroupName: string;
}
export const DeleteSubnetGroupRequest = S.suspend(() =>
  S.Struct({ SubnetGroupName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSubnetGroupRequest",
}) as any as S.Schema<DeleteSubnetGroupRequest>;
export interface DeleteUserRequest {
  UserName: string;
}
export const DeleteUserRequest = S.suspend(() =>
  S.Struct({ UserName: S.String }).pipe(
    T.all(
      ns,
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
export interface DescribeACLsRequest {
  ACLName?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeACLsRequest = S.suspend(() =>
  S.Struct({
    ACLName: S.optional(S.String),
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
  identifier: "DescribeACLsRequest",
}) as any as S.Schema<DescribeACLsRequest>;
export interface DescribeClustersRequest {
  ClusterName?: string;
  MaxResults?: number;
  NextToken?: string;
  ShowShardDetails?: boolean;
}
export const DescribeClustersRequest = S.suspend(() =>
  S.Struct({
    ClusterName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ShowShardDetails: S.optional(S.Boolean),
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
  identifier: "DescribeClustersRequest",
}) as any as S.Schema<DescribeClustersRequest>;
export interface DescribeEngineVersionsRequest {
  Engine?: string;
  EngineVersion?: string;
  ParameterGroupFamily?: string;
  MaxResults?: number;
  NextToken?: string;
  DefaultOnly?: boolean;
}
export const DescribeEngineVersionsRequest = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    ParameterGroupFamily: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    DefaultOnly: S.optional(S.Boolean),
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
  identifier: "DescribeEngineVersionsRequest",
}) as any as S.Schema<DescribeEngineVersionsRequest>;
export interface DescribeEventsRequest {
  SourceName?: string;
  SourceType?: string;
  StartTime?: Date;
  EndTime?: Date;
  Duration?: number;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeEventsRequest = S.suspend(() =>
  S.Struct({
    SourceName: S.optional(S.String),
    SourceType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Duration: S.optional(S.Number),
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
  identifier: "DescribeEventsRequest",
}) as any as S.Schema<DescribeEventsRequest>;
export interface DescribeMultiRegionClustersRequest {
  MultiRegionClusterName?: string;
  MaxResults?: number;
  NextToken?: string;
  ShowClusterDetails?: boolean;
}
export const DescribeMultiRegionClustersRequest = S.suspend(() =>
  S.Struct({
    MultiRegionClusterName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ShowClusterDetails: S.optional(S.Boolean),
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
  identifier: "DescribeMultiRegionClustersRequest",
}) as any as S.Schema<DescribeMultiRegionClustersRequest>;
export interface DescribeMultiRegionParameterGroupsRequest {
  MultiRegionParameterGroupName?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeMultiRegionParameterGroupsRequest = S.suspend(() =>
  S.Struct({
    MultiRegionParameterGroupName: S.optional(S.String),
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
  identifier: "DescribeMultiRegionParameterGroupsRequest",
}) as any as S.Schema<DescribeMultiRegionParameterGroupsRequest>;
export interface DescribeMultiRegionParametersRequest {
  MultiRegionParameterGroupName: string;
  Source?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeMultiRegionParametersRequest = S.suspend(() =>
  S.Struct({
    MultiRegionParameterGroupName: S.String,
    Source: S.optional(S.String),
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
  identifier: "DescribeMultiRegionParametersRequest",
}) as any as S.Schema<DescribeMultiRegionParametersRequest>;
export interface DescribeParameterGroupsRequest {
  ParameterGroupName?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeParameterGroupsRequest = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.optional(S.String),
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
  identifier: "DescribeParameterGroupsRequest",
}) as any as S.Schema<DescribeParameterGroupsRequest>;
export interface DescribeParametersRequest {
  ParameterGroupName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeParametersRequest = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.String,
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
  identifier: "DescribeParametersRequest",
}) as any as S.Schema<DescribeParametersRequest>;
export interface DescribeReservedNodesRequest {
  ReservationId?: string;
  ReservedNodesOfferingId?: string;
  NodeType?: string;
  Duration?: string;
  OfferingType?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeReservedNodesRequest = S.suspend(() =>
  S.Struct({
    ReservationId: S.optional(S.String),
    ReservedNodesOfferingId: S.optional(S.String),
    NodeType: S.optional(S.String),
    Duration: S.optional(S.String),
    OfferingType: S.optional(S.String),
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
  identifier: "DescribeReservedNodesRequest",
}) as any as S.Schema<DescribeReservedNodesRequest>;
export interface DescribeReservedNodesOfferingsRequest {
  ReservedNodesOfferingId?: string;
  NodeType?: string;
  Duration?: string;
  OfferingType?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeReservedNodesOfferingsRequest = S.suspend(() =>
  S.Struct({
    ReservedNodesOfferingId: S.optional(S.String),
    NodeType: S.optional(S.String),
    Duration: S.optional(S.String),
    OfferingType: S.optional(S.String),
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
  identifier: "DescribeReservedNodesOfferingsRequest",
}) as any as S.Schema<DescribeReservedNodesOfferingsRequest>;
export interface DescribeServiceUpdatesRequest {
  ServiceUpdateName?: string;
  ClusterNames?: ClusterNameList;
  Status?: ServiceUpdateStatusList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeServiceUpdatesRequest = S.suspend(() =>
  S.Struct({
    ServiceUpdateName: S.optional(S.String),
    ClusterNames: S.optional(ClusterNameList),
    Status: S.optional(ServiceUpdateStatusList),
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
  identifier: "DescribeServiceUpdatesRequest",
}) as any as S.Schema<DescribeServiceUpdatesRequest>;
export interface DescribeSnapshotsRequest {
  ClusterName?: string;
  SnapshotName?: string;
  Source?: string;
  NextToken?: string;
  MaxResults?: number;
  ShowDetail?: boolean;
}
export const DescribeSnapshotsRequest = S.suspend(() =>
  S.Struct({
    ClusterName: S.optional(S.String),
    SnapshotName: S.optional(S.String),
    Source: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ShowDetail: S.optional(S.Boolean),
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
  identifier: "DescribeSnapshotsRequest",
}) as any as S.Schema<DescribeSnapshotsRequest>;
export interface DescribeSubnetGroupsRequest {
  SubnetGroupName?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeSubnetGroupsRequest = S.suspend(() =>
  S.Struct({
    SubnetGroupName: S.optional(S.String),
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
  identifier: "DescribeSubnetGroupsRequest",
}) as any as S.Schema<DescribeSubnetGroupsRequest>;
export interface FailoverShardRequest {
  ClusterName: string;
  ShardName: string;
}
export const FailoverShardRequest = S.suspend(() =>
  S.Struct({ ClusterName: S.String, ShardName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "FailoverShardRequest",
}) as any as S.Schema<FailoverShardRequest>;
export interface ListAllowedMultiRegionClusterUpdatesRequest {
  MultiRegionClusterName: string;
}
export const ListAllowedMultiRegionClusterUpdatesRequest = S.suspend(() =>
  S.Struct({ MultiRegionClusterName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAllowedMultiRegionClusterUpdatesRequest",
}) as any as S.Schema<ListAllowedMultiRegionClusterUpdatesRequest>;
export interface ListAllowedNodeTypeUpdatesRequest {
  ClusterName: string;
}
export const ListAllowedNodeTypeUpdatesRequest = S.suspend(() =>
  S.Struct({ ClusterName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAllowedNodeTypeUpdatesRequest",
}) as any as S.Schema<ListAllowedNodeTypeUpdatesRequest>;
export interface ListTagsRequest {
  ResourceArn: string;
}
export const ListTagsRequest = S.suspend(() =>
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
  identifier: "ListTagsRequest",
}) as any as S.Schema<ListTagsRequest>;
export interface PurchaseReservedNodesOfferingRequest {
  ReservedNodesOfferingId: string;
  ReservationId?: string;
  NodeCount?: number;
  Tags?: TagList;
}
export const PurchaseReservedNodesOfferingRequest = S.suspend(() =>
  S.Struct({
    ReservedNodesOfferingId: S.String,
    ReservationId: S.optional(S.String),
    NodeCount: S.optional(S.Number),
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
  identifier: "PurchaseReservedNodesOfferingRequest",
}) as any as S.Schema<PurchaseReservedNodesOfferingRequest>;
export interface ResetParameterGroupRequest {
  ParameterGroupName: string;
  AllParameters?: boolean;
  ParameterNames?: ParameterNameList;
}
export const ResetParameterGroupRequest = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.String,
    AllParameters: S.optional(S.Boolean),
    ParameterNames: S.optional(ParameterNameList),
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
  identifier: "ResetParameterGroupRequest",
}) as any as S.Schema<ResetParameterGroupRequest>;
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: KeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: KeyList }).pipe(
    T.all(
      ns,
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
export interface UpdateACLRequest {
  ACLName: string;
  UserNamesToAdd?: UserNameListInput;
  UserNamesToRemove?: UserNameListInput;
}
export const UpdateACLRequest = S.suspend(() =>
  S.Struct({
    ACLName: S.String,
    UserNamesToAdd: S.optional(UserNameListInput),
    UserNamesToRemove: S.optional(UserNameListInput),
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
  identifier: "UpdateACLRequest",
}) as any as S.Schema<UpdateACLRequest>;
export interface ShardConfigurationRequest {
  ShardCount?: number;
}
export const ShardConfigurationRequest = S.suspend(() =>
  S.Struct({ ShardCount: S.optional(S.Number) }),
).annotations({
  identifier: "ShardConfigurationRequest",
}) as any as S.Schema<ShardConfigurationRequest>;
export interface UpdateMultiRegionClusterRequest {
  MultiRegionClusterName: string;
  NodeType?: string;
  Description?: string;
  EngineVersion?: string;
  ShardConfiguration?: ShardConfigurationRequest;
  MultiRegionParameterGroupName?: string;
  UpdateStrategy?: string;
}
export const UpdateMultiRegionClusterRequest = S.suspend(() =>
  S.Struct({
    MultiRegionClusterName: S.String,
    NodeType: S.optional(S.String),
    Description: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    ShardConfiguration: S.optional(ShardConfigurationRequest),
    MultiRegionParameterGroupName: S.optional(S.String),
    UpdateStrategy: S.optional(S.String),
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
  identifier: "UpdateMultiRegionClusterRequest",
}) as any as S.Schema<UpdateMultiRegionClusterRequest>;
export interface UpdateSubnetGroupRequest {
  SubnetGroupName: string;
  Description?: string;
  SubnetIds?: SubnetIdentifierList;
}
export const UpdateSubnetGroupRequest = S.suspend(() =>
  S.Struct({
    SubnetGroupName: S.String,
    Description: S.optional(S.String),
    SubnetIds: S.optional(SubnetIdentifierList),
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
  identifier: "UpdateSubnetGroupRequest",
}) as any as S.Schema<UpdateSubnetGroupRequest>;
export type PasswordListInput = string[];
export const PasswordListInput = S.Array(S.String);
export interface AuthenticationMode {
  Type?: string;
  Passwords?: PasswordListInput;
}
export const AuthenticationMode = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Passwords: S.optional(PasswordListInput),
  }),
).annotations({
  identifier: "AuthenticationMode",
}) as any as S.Schema<AuthenticationMode>;
export interface UpdateUserRequest {
  UserName: string;
  AuthenticationMode?: AuthenticationMode;
  AccessString?: string;
}
export const UpdateUserRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    AuthenticationMode: S.optional(AuthenticationMode),
    AccessString: S.optional(S.String),
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
  identifier: "UpdateUserRequest",
}) as any as S.Schema<UpdateUserRequest>;
export type FilterValueList = string[];
export const FilterValueList = S.Array(S.String);
export interface ServiceUpdateRequest {
  ServiceUpdateNameToApply?: string;
}
export const ServiceUpdateRequest = S.suspend(() =>
  S.Struct({ ServiceUpdateNameToApply: S.optional(S.String) }),
).annotations({
  identifier: "ServiceUpdateRequest",
}) as any as S.Schema<ServiceUpdateRequest>;
export type UserNameList = string[];
export const UserNameList = S.Array(S.String);
export interface ACLPendingChanges {
  UserNamesToRemove?: UserNameList;
  UserNamesToAdd?: UserNameList;
}
export const ACLPendingChanges = S.suspend(() =>
  S.Struct({
    UserNamesToRemove: S.optional(UserNameList),
    UserNamesToAdd: S.optional(UserNameList),
  }),
).annotations({
  identifier: "ACLPendingChanges",
}) as any as S.Schema<ACLPendingChanges>;
export type ACLClusterNameList = string[];
export const ACLClusterNameList = S.Array(S.String);
export interface ACL {
  Name?: string;
  Status?: string;
  UserNames?: UserNameList;
  MinimumEngineVersion?: string;
  PendingChanges?: ACLPendingChanges;
  Clusters?: ACLClusterNameList;
  ARN?: string;
}
export const ACL = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    UserNames: S.optional(UserNameList),
    MinimumEngineVersion: S.optional(S.String),
    PendingChanges: S.optional(ACLPendingChanges),
    Clusters: S.optional(ACLClusterNameList),
    ARN: S.optional(S.String),
  }),
).annotations({ identifier: "ACL" }) as any as S.Schema<ACL>;
export type ACLList = ACL[];
export const ACLList = S.Array(ACL);
export interface SlotMigration {
  ProgressPercentage?: number;
}
export const SlotMigration = S.suspend(() =>
  S.Struct({ ProgressPercentage: S.optional(S.Number) }),
).annotations({
  identifier: "SlotMigration",
}) as any as S.Schema<SlotMigration>;
export interface ReshardingStatus {
  SlotMigration?: SlotMigration;
}
export const ReshardingStatus = S.suspend(() =>
  S.Struct({ SlotMigration: S.optional(SlotMigration) }),
).annotations({
  identifier: "ReshardingStatus",
}) as any as S.Schema<ReshardingStatus>;
export interface ACLsUpdateStatus {
  ACLToApply?: string;
}
export const ACLsUpdateStatus = S.suspend(() =>
  S.Struct({ ACLToApply: S.optional(S.String) }),
).annotations({
  identifier: "ACLsUpdateStatus",
}) as any as S.Schema<ACLsUpdateStatus>;
export interface PendingModifiedServiceUpdate {
  ServiceUpdateName?: string;
  Status?: string;
}
export const PendingModifiedServiceUpdate = S.suspend(() =>
  S.Struct({
    ServiceUpdateName: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "PendingModifiedServiceUpdate",
}) as any as S.Schema<PendingModifiedServiceUpdate>;
export type PendingModifiedServiceUpdateList = PendingModifiedServiceUpdate[];
export const PendingModifiedServiceUpdateList = S.Array(
  PendingModifiedServiceUpdate.pipe(
    T.XmlName("PendingModifiedServiceUpdate"),
  ).annotations({ identifier: "PendingModifiedServiceUpdate" }),
);
export interface ClusterPendingUpdates {
  Resharding?: ReshardingStatus;
  ACLs?: ACLsUpdateStatus;
  ServiceUpdates?: PendingModifiedServiceUpdateList;
}
export const ClusterPendingUpdates = S.suspend(() =>
  S.Struct({
    Resharding: S.optional(ReshardingStatus),
    ACLs: S.optional(ACLsUpdateStatus),
    ServiceUpdates: S.optional(PendingModifiedServiceUpdateList),
  }),
).annotations({
  identifier: "ClusterPendingUpdates",
}) as any as S.Schema<ClusterPendingUpdates>;
export interface Endpoint {
  Address?: string;
  Port?: number;
}
export const Endpoint = S.suspend(() =>
  S.Struct({ Address: S.optional(S.String), Port: S.optional(S.Number) }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export interface Node {
  Name?: string;
  Status?: string;
  AvailabilityZone?: string;
  CreateTime?: Date;
  Endpoint?: Endpoint;
}
export const Node = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Endpoint: S.optional(Endpoint),
  }),
).annotations({ identifier: "Node" }) as any as S.Schema<Node>;
export type NodeList = Node[];
export const NodeList = S.Array(
  Node.pipe(T.XmlName("Node")).annotations({ identifier: "Node" }),
);
export interface Shard {
  Name?: string;
  Status?: string;
  Slots?: string;
  Nodes?: NodeList;
  NumberOfNodes?: number;
}
export const Shard = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    Slots: S.optional(S.String),
    Nodes: S.optional(NodeList),
    NumberOfNodes: S.optional(S.Number),
  }),
).annotations({ identifier: "Shard" }) as any as S.Schema<Shard>;
export type ShardList = Shard[];
export const ShardList = S.Array(
  Shard.pipe(T.XmlName("Shard")).annotations({ identifier: "Shard" }),
);
export interface SecurityGroupMembership {
  SecurityGroupId?: string;
  Status?: string;
}
export const SecurityGroupMembership = S.suspend(() =>
  S.Struct({
    SecurityGroupId: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "SecurityGroupMembership",
}) as any as S.Schema<SecurityGroupMembership>;
export type SecurityGroupMembershipList = SecurityGroupMembership[];
export const SecurityGroupMembershipList = S.Array(SecurityGroupMembership);
export interface Cluster {
  Name?: string;
  Description?: string;
  Status?: string;
  PendingUpdates?: ClusterPendingUpdates;
  MultiRegionClusterName?: string;
  NumberOfShards?: number;
  Shards?: ShardList;
  AvailabilityMode?: string;
  ClusterEndpoint?: Endpoint;
  NodeType?: string;
  Engine?: string;
  EngineVersion?: string;
  EnginePatchVersion?: string;
  ParameterGroupName?: string;
  ParameterGroupStatus?: string;
  SecurityGroups?: SecurityGroupMembershipList;
  SubnetGroupName?: string;
  TLSEnabled?: boolean;
  KmsKeyId?: string;
  ARN?: string;
  SnsTopicArn?: string;
  SnsTopicStatus?: string;
  SnapshotRetentionLimit?: number;
  MaintenanceWindow?: string;
  SnapshotWindow?: string;
  ACLName?: string;
  AutoMinorVersionUpgrade?: boolean;
  DataTiering?: string;
  NetworkType?: string;
  IpDiscovery?: string;
}
export const Cluster = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    PendingUpdates: S.optional(ClusterPendingUpdates),
    MultiRegionClusterName: S.optional(S.String),
    NumberOfShards: S.optional(S.Number),
    Shards: S.optional(ShardList),
    AvailabilityMode: S.optional(S.String),
    ClusterEndpoint: S.optional(Endpoint),
    NodeType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    EnginePatchVersion: S.optional(S.String),
    ParameterGroupName: S.optional(S.String),
    ParameterGroupStatus: S.optional(S.String),
    SecurityGroups: S.optional(SecurityGroupMembershipList),
    SubnetGroupName: S.optional(S.String),
    TLSEnabled: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    ARN: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    SnsTopicStatus: S.optional(S.String),
    SnapshotRetentionLimit: S.optional(S.Number),
    MaintenanceWindow: S.optional(S.String),
    SnapshotWindow: S.optional(S.String),
    ACLName: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    DataTiering: S.optional(S.String),
    NetworkType: S.optional(S.String),
    IpDiscovery: S.optional(S.String),
  }),
).annotations({ identifier: "Cluster" }) as any as S.Schema<Cluster>;
export type ClusterList = Cluster[];
export const ClusterList = S.Array(
  Cluster.pipe(T.XmlName("Cluster")).annotations({ identifier: "Cluster" }),
);
export interface RegionalCluster {
  ClusterName?: string;
  Region?: string;
  Status?: string;
  ARN?: string;
}
export const RegionalCluster = S.suspend(() =>
  S.Struct({
    ClusterName: S.optional(S.String),
    Region: S.optional(S.String),
    Status: S.optional(S.String),
    ARN: S.optional(S.String),
  }),
).annotations({
  identifier: "RegionalCluster",
}) as any as S.Schema<RegionalCluster>;
export type RegionalClusterList = RegionalCluster[];
export const RegionalClusterList = S.Array(
  RegionalCluster.pipe(T.XmlName("RegionalCluster")).annotations({
    identifier: "RegionalCluster",
  }),
);
export interface MultiRegionCluster {
  MultiRegionClusterName?: string;
  Description?: string;
  Status?: string;
  NodeType?: string;
  Engine?: string;
  EngineVersion?: string;
  NumberOfShards?: number;
  Clusters?: RegionalClusterList;
  MultiRegionParameterGroupName?: string;
  TLSEnabled?: boolean;
  ARN?: string;
}
export const MultiRegionCluster = S.suspend(() =>
  S.Struct({
    MultiRegionClusterName: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    NodeType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    NumberOfShards: S.optional(S.Number),
    Clusters: S.optional(RegionalClusterList),
    MultiRegionParameterGroupName: S.optional(S.String),
    TLSEnabled: S.optional(S.Boolean),
    ARN: S.optional(S.String),
  }),
).annotations({
  identifier: "MultiRegionCluster",
}) as any as S.Schema<MultiRegionCluster>;
export type MultiRegionClusterList = MultiRegionCluster[];
export const MultiRegionClusterList = S.Array(MultiRegionCluster);
export interface ParameterGroup {
  Name?: string;
  Family?: string;
  Description?: string;
  ARN?: string;
}
export const ParameterGroup = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Family: S.optional(S.String),
    Description: S.optional(S.String),
    ARN: S.optional(S.String),
  }),
).annotations({
  identifier: "ParameterGroup",
}) as any as S.Schema<ParameterGroup>;
export type ParameterGroupList = ParameterGroup[];
export const ParameterGroupList = S.Array(
  ParameterGroup.pipe(T.XmlName("ParameterGroup")).annotations({
    identifier: "ParameterGroup",
  }),
);
export interface ShardConfiguration {
  Slots?: string;
  ReplicaCount?: number;
}
export const ShardConfiguration = S.suspend(() =>
  S.Struct({ Slots: S.optional(S.String), ReplicaCount: S.optional(S.Number) }),
).annotations({
  identifier: "ShardConfiguration",
}) as any as S.Schema<ShardConfiguration>;
export interface ShardDetail {
  Name?: string;
  Configuration?: ShardConfiguration;
  Size?: string;
  SnapshotCreationTime?: Date;
}
export const ShardDetail = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Configuration: S.optional(ShardConfiguration),
    Size: S.optional(S.String),
    SnapshotCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "ShardDetail" }) as any as S.Schema<ShardDetail>;
export type ShardDetails = ShardDetail[];
export const ShardDetails = S.Array(ShardDetail);
export interface ClusterConfiguration {
  Name?: string;
  Description?: string;
  NodeType?: string;
  Engine?: string;
  EngineVersion?: string;
  MaintenanceWindow?: string;
  TopicArn?: string;
  Port?: number;
  ParameterGroupName?: string;
  SubnetGroupName?: string;
  VpcId?: string;
  SnapshotRetentionLimit?: number;
  SnapshotWindow?: string;
  NumShards?: number;
  Shards?: ShardDetails;
  MultiRegionParameterGroupName?: string;
  MultiRegionClusterName?: string;
}
export const ClusterConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    NodeType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    MaintenanceWindow: S.optional(S.String),
    TopicArn: S.optional(S.String),
    Port: S.optional(S.Number),
    ParameterGroupName: S.optional(S.String),
    SubnetGroupName: S.optional(S.String),
    VpcId: S.optional(S.String),
    SnapshotRetentionLimit: S.optional(S.Number),
    SnapshotWindow: S.optional(S.String),
    NumShards: S.optional(S.Number),
    Shards: S.optional(ShardDetails),
    MultiRegionParameterGroupName: S.optional(S.String),
    MultiRegionClusterName: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterConfiguration",
}) as any as S.Schema<ClusterConfiguration>;
export interface Snapshot {
  Name?: string;
  Status?: string;
  Source?: string;
  KmsKeyId?: string;
  ARN?: string;
  ClusterConfiguration?: ClusterConfiguration;
  DataTiering?: string;
}
export const Snapshot = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    Source: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    ARN: S.optional(S.String),
    ClusterConfiguration: S.optional(ClusterConfiguration),
    DataTiering: S.optional(S.String),
  }),
).annotations({ identifier: "Snapshot" }) as any as S.Schema<Snapshot>;
export type SnapshotList = Snapshot[];
export const SnapshotList = S.Array(Snapshot);
export interface AvailabilityZone {
  Name?: string;
}
export const AvailabilityZone = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "AvailabilityZone",
}) as any as S.Schema<AvailabilityZone>;
export type NetworkTypeList = string[];
export const NetworkTypeList = S.Array(S.String);
export interface Subnet {
  Identifier?: string;
  AvailabilityZone?: AvailabilityZone;
  SupportedNetworkTypes?: NetworkTypeList;
}
export const Subnet = S.suspend(() =>
  S.Struct({
    Identifier: S.optional(S.String),
    AvailabilityZone: S.optional(AvailabilityZone),
    SupportedNetworkTypes: S.optional(NetworkTypeList),
  }),
).annotations({ identifier: "Subnet" }) as any as S.Schema<Subnet>;
export type SubnetList = Subnet[];
export const SubnetList = S.Array(
  Subnet.pipe(T.XmlName("Subnet")).annotations({ identifier: "Subnet" }),
);
export interface SubnetGroup {
  Name?: string;
  Description?: string;
  VpcId?: string;
  Subnets?: SubnetList;
  ARN?: string;
  SupportedNetworkTypes?: NetworkTypeList;
}
export const SubnetGroup = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    VpcId: S.optional(S.String),
    Subnets: S.optional(SubnetList),
    ARN: S.optional(S.String),
    SupportedNetworkTypes: S.optional(NetworkTypeList),
  }),
).annotations({ identifier: "SubnetGroup" }) as any as S.Schema<SubnetGroup>;
export type SubnetGroupList = SubnetGroup[];
export const SubnetGroupList = S.Array(SubnetGroup);
export interface Filter {
  Name: string;
  Values: FilterValueList;
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export type NodeTypeList = string[];
export const NodeTypeList = S.Array(S.String);
export interface ReplicaConfigurationRequest {
  ReplicaCount?: number;
}
export const ReplicaConfigurationRequest = S.suspend(() =>
  S.Struct({ ReplicaCount: S.optional(S.Number) }),
).annotations({
  identifier: "ReplicaConfigurationRequest",
}) as any as S.Schema<ReplicaConfigurationRequest>;
export interface ParameterNameValue {
  ParameterName?: string;
  ParameterValue?: string;
}
export const ParameterNameValue = S.suspend(() =>
  S.Struct({
    ParameterName: S.optional(S.String),
    ParameterValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ParameterNameValue",
}) as any as S.Schema<ParameterNameValue>;
export type ParameterNameValueList = ParameterNameValue[];
export const ParameterNameValueList = S.Array(
  ParameterNameValue.pipe(T.XmlName("ParameterNameValue")).annotations({
    identifier: "ParameterNameValue",
  }),
);
export interface BatchUpdateClusterRequest {
  ClusterNames: ClusterNameList;
  ServiceUpdate?: ServiceUpdateRequest;
}
export const BatchUpdateClusterRequest = S.suspend(() =>
  S.Struct({
    ClusterNames: ClusterNameList,
    ServiceUpdate: S.optional(ServiceUpdateRequest),
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
  identifier: "BatchUpdateClusterRequest",
}) as any as S.Schema<BatchUpdateClusterRequest>;
export interface CopySnapshotRequest {
  SourceSnapshotName: string;
  TargetSnapshotName: string;
  TargetBucket?: string;
  KmsKeyId?: string;
  Tags?: TagList;
}
export const CopySnapshotRequest = S.suspend(() =>
  S.Struct({
    SourceSnapshotName: S.String,
    TargetSnapshotName: S.String,
    TargetBucket: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
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
  identifier: "CopySnapshotRequest",
}) as any as S.Schema<CopySnapshotRequest>;
export interface CreateUserRequest {
  UserName: string;
  AuthenticationMode: AuthenticationMode;
  AccessString: string;
  Tags?: TagList;
}
export const CreateUserRequest = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    AuthenticationMode: AuthenticationMode,
    AccessString: S.String,
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
  identifier: "CreateUserRequest",
}) as any as S.Schema<CreateUserRequest>;
export interface DeleteACLResponse {
  ACL?: ACL;
}
export const DeleteACLResponse = S.suspend(() =>
  S.Struct({ ACL: S.optional(ACL) }).pipe(ns),
).annotations({
  identifier: "DeleteACLResponse",
}) as any as S.Schema<DeleteACLResponse>;
export interface DeleteClusterResponse {
  Cluster?: Cluster;
}
export const DeleteClusterResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "DeleteClusterResponse",
}) as any as S.Schema<DeleteClusterResponse>;
export interface DeleteMultiRegionClusterResponse {
  MultiRegionCluster?: MultiRegionCluster;
}
export const DeleteMultiRegionClusterResponse = S.suspend(() =>
  S.Struct({ MultiRegionCluster: S.optional(MultiRegionCluster) }).pipe(ns),
).annotations({
  identifier: "DeleteMultiRegionClusterResponse",
}) as any as S.Schema<DeleteMultiRegionClusterResponse>;
export interface DeleteParameterGroupResponse {
  ParameterGroup?: ParameterGroup;
}
export const DeleteParameterGroupResponse = S.suspend(() =>
  S.Struct({ ParameterGroup: S.optional(ParameterGroup) }).pipe(ns),
).annotations({
  identifier: "DeleteParameterGroupResponse",
}) as any as S.Schema<DeleteParameterGroupResponse>;
export interface DeleteSnapshotResponse {
  Snapshot?: Snapshot;
}
export const DeleteSnapshotResponse = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "DeleteSnapshotResponse",
}) as any as S.Schema<DeleteSnapshotResponse>;
export interface DeleteSubnetGroupResponse {
  SubnetGroup?: SubnetGroup;
}
export const DeleteSubnetGroupResponse = S.suspend(() =>
  S.Struct({ SubnetGroup: S.optional(SubnetGroup) }).pipe(ns),
).annotations({
  identifier: "DeleteSubnetGroupResponse",
}) as any as S.Schema<DeleteSubnetGroupResponse>;
export interface DescribeACLsResponse {
  ACLs?: ACLList;
  NextToken?: string;
}
export const DescribeACLsResponse = S.suspend(() =>
  S.Struct({ ACLs: S.optional(ACLList), NextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeACLsResponse",
}) as any as S.Schema<DescribeACLsResponse>;
export interface DescribeClustersResponse {
  NextToken?: string;
  Clusters?: ClusterList;
}
export const DescribeClustersResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Clusters: S.optional(ClusterList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeClustersResponse",
}) as any as S.Schema<DescribeClustersResponse>;
export interface DescribeMultiRegionClustersResponse {
  NextToken?: string;
  MultiRegionClusters?: MultiRegionClusterList;
}
export const DescribeMultiRegionClustersResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MultiRegionClusters: S.optional(MultiRegionClusterList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMultiRegionClustersResponse",
}) as any as S.Schema<DescribeMultiRegionClustersResponse>;
export interface DescribeParameterGroupsResponse {
  NextToken?: string;
  ParameterGroups?: ParameterGroupList;
}
export const DescribeParameterGroupsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ParameterGroups: S.optional(ParameterGroupList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeParameterGroupsResponse",
}) as any as S.Schema<DescribeParameterGroupsResponse>;
export interface DescribeSnapshotsResponse {
  NextToken?: string;
  Snapshots?: SnapshotList;
}
export const DescribeSnapshotsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Snapshots: S.optional(SnapshotList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSnapshotsResponse",
}) as any as S.Schema<DescribeSnapshotsResponse>;
export interface DescribeSubnetGroupsResponse {
  NextToken?: string;
  SubnetGroups?: SubnetGroupList;
}
export const DescribeSubnetGroupsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    SubnetGroups: S.optional(SubnetGroupList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSubnetGroupsResponse",
}) as any as S.Schema<DescribeSubnetGroupsResponse>;
export interface DescribeUsersRequest {
  UserName?: string;
  Filters?: FilterList;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeUsersRequest = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    Filters: S.optional(FilterList),
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
  identifier: "DescribeUsersRequest",
}) as any as S.Schema<DescribeUsersRequest>;
export interface FailoverShardResponse {
  Cluster?: Cluster;
}
export const FailoverShardResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "FailoverShardResponse",
}) as any as S.Schema<FailoverShardResponse>;
export interface ListAllowedMultiRegionClusterUpdatesResponse {
  ScaleUpNodeTypes?: NodeTypeList;
  ScaleDownNodeTypes?: NodeTypeList;
}
export const ListAllowedMultiRegionClusterUpdatesResponse = S.suspend(() =>
  S.Struct({
    ScaleUpNodeTypes: S.optional(NodeTypeList),
    ScaleDownNodeTypes: S.optional(NodeTypeList),
  }).pipe(ns),
).annotations({
  identifier: "ListAllowedMultiRegionClusterUpdatesResponse",
}) as any as S.Schema<ListAllowedMultiRegionClusterUpdatesResponse>;
export interface ListAllowedNodeTypeUpdatesResponse {
  ScaleUpNodeTypes?: NodeTypeList;
  ScaleDownNodeTypes?: NodeTypeList;
}
export const ListAllowedNodeTypeUpdatesResponse = S.suspend(() =>
  S.Struct({
    ScaleUpNodeTypes: S.optional(NodeTypeList),
    ScaleDownNodeTypes: S.optional(NodeTypeList),
  }).pipe(ns),
).annotations({
  identifier: "ListAllowedNodeTypeUpdatesResponse",
}) as any as S.Schema<ListAllowedNodeTypeUpdatesResponse>;
export interface ListTagsResponse {
  TagList?: TagList;
}
export const ListTagsResponse = S.suspend(() =>
  S.Struct({ TagList: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsResponse",
}) as any as S.Schema<ListTagsResponse>;
export interface RecurringCharge {
  RecurringChargeAmount?: number;
  RecurringChargeFrequency?: string;
}
export const RecurringCharge = S.suspend(() =>
  S.Struct({
    RecurringChargeAmount: S.optional(S.Number),
    RecurringChargeFrequency: S.optional(S.String),
  }),
).annotations({
  identifier: "RecurringCharge",
}) as any as S.Schema<RecurringCharge>;
export type RecurringChargeList = RecurringCharge[];
export const RecurringChargeList = S.Array(
  RecurringCharge.pipe(T.XmlName("RecurringCharge")).annotations({
    identifier: "RecurringCharge",
  }),
);
export interface ReservedNode {
  ReservationId?: string;
  ReservedNodesOfferingId?: string;
  NodeType?: string;
  StartTime?: Date;
  Duration?: number;
  FixedPrice?: number;
  NodeCount?: number;
  OfferingType?: string;
  State?: string;
  RecurringCharges?: RecurringChargeList;
  ARN?: string;
}
export const ReservedNode = S.suspend(() =>
  S.Struct({
    ReservationId: S.optional(S.String),
    ReservedNodesOfferingId: S.optional(S.String),
    NodeType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Duration: S.optional(S.Number),
    FixedPrice: S.optional(S.Number),
    NodeCount: S.optional(S.Number),
    OfferingType: S.optional(S.String),
    State: S.optional(S.String),
    RecurringCharges: S.optional(RecurringChargeList),
    ARN: S.optional(S.String),
  }),
).annotations({ identifier: "ReservedNode" }) as any as S.Schema<ReservedNode>;
export interface PurchaseReservedNodesOfferingResponse {
  ReservedNode?: ReservedNode;
}
export const PurchaseReservedNodesOfferingResponse = S.suspend(() =>
  S.Struct({ ReservedNode: S.optional(ReservedNode) }).pipe(ns),
).annotations({
  identifier: "PurchaseReservedNodesOfferingResponse",
}) as any as S.Schema<PurchaseReservedNodesOfferingResponse>;
export interface ResetParameterGroupResponse {
  ParameterGroup?: ParameterGroup;
}
export const ResetParameterGroupResponse = S.suspend(() =>
  S.Struct({ ParameterGroup: S.optional(ParameterGroup) }).pipe(ns),
).annotations({
  identifier: "ResetParameterGroupResponse",
}) as any as S.Schema<ResetParameterGroupResponse>;
export interface TagResourceResponse {
  TagList?: TagList;
}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({ TagList: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceResponse {
  TagList?: TagList;
}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({ TagList: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateACLResponse {
  ACL?: ACL;
}
export const UpdateACLResponse = S.suspend(() =>
  S.Struct({ ACL: S.optional(ACL) }).pipe(ns),
).annotations({
  identifier: "UpdateACLResponse",
}) as any as S.Schema<UpdateACLResponse>;
export interface UpdateClusterRequest {
  ClusterName: string;
  Description?: string;
  SecurityGroupIds?: SecurityGroupIdsList;
  MaintenanceWindow?: string;
  SnsTopicArn?: string;
  SnsTopicStatus?: string;
  ParameterGroupName?: string;
  SnapshotWindow?: string;
  SnapshotRetentionLimit?: number;
  NodeType?: string;
  Engine?: string;
  EngineVersion?: string;
  ReplicaConfiguration?: ReplicaConfigurationRequest;
  ShardConfiguration?: ShardConfigurationRequest;
  ACLName?: string;
  IpDiscovery?: string;
}
export const UpdateClusterRequest = S.suspend(() =>
  S.Struct({
    ClusterName: S.String,
    Description: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIdsList),
    MaintenanceWindow: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    SnsTopicStatus: S.optional(S.String),
    ParameterGroupName: S.optional(S.String),
    SnapshotWindow: S.optional(S.String),
    SnapshotRetentionLimit: S.optional(S.Number),
    NodeType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    ReplicaConfiguration: S.optional(ReplicaConfigurationRequest),
    ShardConfiguration: S.optional(ShardConfigurationRequest),
    ACLName: S.optional(S.String),
    IpDiscovery: S.optional(S.String),
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
  identifier: "UpdateClusterRequest",
}) as any as S.Schema<UpdateClusterRequest>;
export interface UpdateMultiRegionClusterResponse {
  MultiRegionCluster?: MultiRegionCluster;
}
export const UpdateMultiRegionClusterResponse = S.suspend(() =>
  S.Struct({ MultiRegionCluster: S.optional(MultiRegionCluster) }).pipe(ns),
).annotations({
  identifier: "UpdateMultiRegionClusterResponse",
}) as any as S.Schema<UpdateMultiRegionClusterResponse>;
export interface UpdateParameterGroupRequest {
  ParameterGroupName: string;
  ParameterNameValues: ParameterNameValueList;
}
export const UpdateParameterGroupRequest = S.suspend(() =>
  S.Struct({
    ParameterGroupName: S.String,
    ParameterNameValues: ParameterNameValueList,
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
  identifier: "UpdateParameterGroupRequest",
}) as any as S.Schema<UpdateParameterGroupRequest>;
export interface UpdateSubnetGroupResponse {
  SubnetGroup?: SubnetGroup;
}
export const UpdateSubnetGroupResponse = S.suspend(() =>
  S.Struct({ SubnetGroup: S.optional(SubnetGroup) }).pipe(ns),
).annotations({
  identifier: "UpdateSubnetGroupResponse",
}) as any as S.Schema<UpdateSubnetGroupResponse>;
export type ACLNameList = string[];
export const ACLNameList = S.Array(S.String);
export interface Authentication {
  Type?: string;
  PasswordCount?: number;
}
export const Authentication = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), PasswordCount: S.optional(S.Number) }),
).annotations({
  identifier: "Authentication",
}) as any as S.Schema<Authentication>;
export interface User {
  Name?: string;
  Status?: string;
  AccessString?: string;
  ACLNames?: ACLNameList;
  MinimumEngineVersion?: string;
  Authentication?: Authentication;
  ARN?: string;
}
export const User = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    AccessString: S.optional(S.String),
    ACLNames: S.optional(ACLNameList),
    MinimumEngineVersion: S.optional(S.String),
    Authentication: S.optional(Authentication),
    ARN: S.optional(S.String),
  }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export interface UpdateUserResponse {
  User?: User;
}
export const UpdateUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }).pipe(ns),
).annotations({
  identifier: "UpdateUserResponse",
}) as any as S.Schema<UpdateUserResponse>;
export interface EngineVersionInfo {
  Engine?: string;
  EngineVersion?: string;
  EnginePatchVersion?: string;
  ParameterGroupFamily?: string;
}
export const EngineVersionInfo = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    EnginePatchVersion: S.optional(S.String),
    ParameterGroupFamily: S.optional(S.String),
  }),
).annotations({
  identifier: "EngineVersionInfo",
}) as any as S.Schema<EngineVersionInfo>;
export type EngineVersionInfoList = EngineVersionInfo[];
export const EngineVersionInfoList = S.Array(EngineVersionInfo);
export interface Event {
  SourceName?: string;
  SourceType?: string;
  Message?: string;
  Date?: Date;
}
export const Event = S.suspend(() =>
  S.Struct({
    SourceName: S.optional(S.String),
    SourceType: S.optional(S.String),
    Message: S.optional(S.String),
    Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type EventList = Event[];
export const EventList = S.Array(
  Event.pipe(T.XmlName("Event")).annotations({ identifier: "Event" }),
);
export interface MultiRegionParameterGroup {
  Name?: string;
  Family?: string;
  Description?: string;
  ARN?: string;
}
export const MultiRegionParameterGroup = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Family: S.optional(S.String),
    Description: S.optional(S.String),
    ARN: S.optional(S.String),
  }),
).annotations({
  identifier: "MultiRegionParameterGroup",
}) as any as S.Schema<MultiRegionParameterGroup>;
export type MultiRegionParameterGroupList = MultiRegionParameterGroup[];
export const MultiRegionParameterGroupList = S.Array(
  MultiRegionParameterGroup.pipe(
    T.XmlName("MultiRegionParameterGroup"),
  ).annotations({ identifier: "MultiRegionParameterGroup" }),
);
export interface MultiRegionParameter {
  Name?: string;
  Value?: string;
  Description?: string;
  Source?: string;
  DataType?: string;
  AllowedValues?: string;
  MinimumEngineVersion?: string;
}
export const MultiRegionParameter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Value: S.optional(S.String),
    Description: S.optional(S.String),
    Source: S.optional(S.String),
    DataType: S.optional(S.String),
    AllowedValues: S.optional(S.String),
    MinimumEngineVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "MultiRegionParameter",
}) as any as S.Schema<MultiRegionParameter>;
export type MultiRegionParametersList = MultiRegionParameter[];
export const MultiRegionParametersList = S.Array(
  MultiRegionParameter.pipe(T.XmlName("MultiRegionParameter")).annotations({
    identifier: "MultiRegionParameter",
  }),
);
export interface Parameter {
  Name?: string;
  Value?: string;
  Description?: string;
  DataType?: string;
  AllowedValues?: string;
  MinimumEngineVersion?: string;
}
export const Parameter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Value: S.optional(S.String),
    Description: S.optional(S.String),
    DataType: S.optional(S.String),
    AllowedValues: S.optional(S.String),
    MinimumEngineVersion: S.optional(S.String),
  }),
).annotations({ identifier: "Parameter" }) as any as S.Schema<Parameter>;
export type ParametersList = Parameter[];
export const ParametersList = S.Array(
  Parameter.pipe(T.XmlName("Parameter")).annotations({
    identifier: "Parameter",
  }),
);
export interface ReservedNodesOffering {
  ReservedNodesOfferingId?: string;
  NodeType?: string;
  Duration?: number;
  FixedPrice?: number;
  OfferingType?: string;
  RecurringCharges?: RecurringChargeList;
}
export const ReservedNodesOffering = S.suspend(() =>
  S.Struct({
    ReservedNodesOfferingId: S.optional(S.String),
    NodeType: S.optional(S.String),
    Duration: S.optional(S.Number),
    FixedPrice: S.optional(S.Number),
    OfferingType: S.optional(S.String),
    RecurringCharges: S.optional(RecurringChargeList),
  }),
).annotations({
  identifier: "ReservedNodesOffering",
}) as any as S.Schema<ReservedNodesOffering>;
export type ReservedNodesOfferingList = ReservedNodesOffering[];
export const ReservedNodesOfferingList = S.Array(
  ReservedNodesOffering.pipe(T.XmlName("ReservedNodesOffering")).annotations({
    identifier: "ReservedNodesOffering",
  }),
);
export interface ServiceUpdate {
  ClusterName?: string;
  ServiceUpdateName?: string;
  ReleaseDate?: Date;
  Description?: string;
  Status?: string;
  Type?: string;
  Engine?: string;
  NodesUpdated?: string;
  AutoUpdateStartDate?: Date;
}
export const ServiceUpdate = S.suspend(() =>
  S.Struct({
    ClusterName: S.optional(S.String),
    ServiceUpdateName: S.optional(S.String),
    ReleaseDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    Type: S.optional(S.String),
    Engine: S.optional(S.String),
    NodesUpdated: S.optional(S.String),
    AutoUpdateStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ServiceUpdate",
}) as any as S.Schema<ServiceUpdate>;
export type ServiceUpdateList = ServiceUpdate[];
export const ServiceUpdateList = S.Array(
  ServiceUpdate.pipe(T.XmlName("ServiceUpdate")).annotations({
    identifier: "ServiceUpdate",
  }),
);
export type UserList = User[];
export const UserList = S.Array(User);
export interface CopySnapshotResponse {
  Snapshot?: Snapshot;
}
export const CopySnapshotResponse = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "CopySnapshotResponse",
}) as any as S.Schema<CopySnapshotResponse>;
export interface CreateParameterGroupResponse {
  ParameterGroup?: ParameterGroup;
}
export const CreateParameterGroupResponse = S.suspend(() =>
  S.Struct({ ParameterGroup: S.optional(ParameterGroup) }).pipe(ns),
).annotations({
  identifier: "CreateParameterGroupResponse",
}) as any as S.Schema<CreateParameterGroupResponse>;
export interface CreateUserResponse {
  User?: User;
}
export const CreateUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }).pipe(ns),
).annotations({
  identifier: "CreateUserResponse",
}) as any as S.Schema<CreateUserResponse>;
export interface DescribeEngineVersionsResponse {
  NextToken?: string;
  EngineVersions?: EngineVersionInfoList;
}
export const DescribeEngineVersionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    EngineVersions: S.optional(EngineVersionInfoList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeEngineVersionsResponse",
}) as any as S.Schema<DescribeEngineVersionsResponse>;
export interface DescribeEventsResponse {
  NextToken?: string;
  Events?: EventList;
}
export const DescribeEventsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Events: S.optional(EventList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeEventsResponse",
}) as any as S.Schema<DescribeEventsResponse>;
export interface DescribeMultiRegionParameterGroupsResponse {
  NextToken?: string;
  MultiRegionParameterGroups?: MultiRegionParameterGroupList;
}
export const DescribeMultiRegionParameterGroupsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MultiRegionParameterGroups: S.optional(MultiRegionParameterGroupList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMultiRegionParameterGroupsResponse",
}) as any as S.Schema<DescribeMultiRegionParameterGroupsResponse>;
export interface DescribeMultiRegionParametersResponse {
  NextToken?: string;
  MultiRegionParameters?: MultiRegionParametersList;
}
export const DescribeMultiRegionParametersResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MultiRegionParameters: S.optional(MultiRegionParametersList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMultiRegionParametersResponse",
}) as any as S.Schema<DescribeMultiRegionParametersResponse>;
export interface DescribeParametersResponse {
  NextToken?: string;
  Parameters?: ParametersList;
}
export const DescribeParametersResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Parameters: S.optional(ParametersList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeParametersResponse",
}) as any as S.Schema<DescribeParametersResponse>;
export interface DescribeReservedNodesOfferingsResponse {
  NextToken?: string;
  ReservedNodesOfferings?: ReservedNodesOfferingList;
}
export const DescribeReservedNodesOfferingsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ReservedNodesOfferings: S.optional(ReservedNodesOfferingList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeReservedNodesOfferingsResponse",
}) as any as S.Schema<DescribeReservedNodesOfferingsResponse>;
export interface DescribeServiceUpdatesResponse {
  NextToken?: string;
  ServiceUpdates?: ServiceUpdateList;
}
export const DescribeServiceUpdatesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ServiceUpdates: S.optional(ServiceUpdateList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeServiceUpdatesResponse",
}) as any as S.Schema<DescribeServiceUpdatesResponse>;
export interface DescribeUsersResponse {
  Users?: UserList;
  NextToken?: string;
}
export const DescribeUsersResponse = S.suspend(() =>
  S.Struct({
    Users: S.optional(UserList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeUsersResponse",
}) as any as S.Schema<DescribeUsersResponse>;
export interface UpdateClusterResponse {
  Cluster?: Cluster;
}
export const UpdateClusterResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "UpdateClusterResponse",
}) as any as S.Schema<UpdateClusterResponse>;
export interface UpdateParameterGroupResponse {
  ParameterGroup?: ParameterGroup;
}
export const UpdateParameterGroupResponse = S.suspend(() =>
  S.Struct({ ParameterGroup: S.optional(ParameterGroup) }).pipe(ns),
).annotations({
  identifier: "UpdateParameterGroupResponse",
}) as any as S.Schema<UpdateParameterGroupResponse>;
export interface UnprocessedCluster {
  ClusterName?: string;
  ErrorType?: string;
  ErrorMessage?: string;
}
export const UnprocessedCluster = S.suspend(() =>
  S.Struct({
    ClusterName: S.optional(S.String),
    ErrorType: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedCluster",
}) as any as S.Schema<UnprocessedCluster>;
export type UnprocessedClusterList = UnprocessedCluster[];
export const UnprocessedClusterList = S.Array(
  UnprocessedCluster.pipe(T.XmlName("UnprocessedCluster")).annotations({
    identifier: "UnprocessedCluster",
  }),
);
export type ReservedNodeList = ReservedNode[];
export const ReservedNodeList = S.Array(
  ReservedNode.pipe(T.XmlName("ReservedNode")).annotations({
    identifier: "ReservedNode",
  }),
);
export interface BatchUpdateClusterResponse {
  ProcessedClusters?: ClusterList;
  UnprocessedClusters?: UnprocessedClusterList;
}
export const BatchUpdateClusterResponse = S.suspend(() =>
  S.Struct({
    ProcessedClusters: S.optional(ClusterList),
    UnprocessedClusters: S.optional(UnprocessedClusterList),
  }).pipe(ns),
).annotations({
  identifier: "BatchUpdateClusterResponse",
}) as any as S.Schema<BatchUpdateClusterResponse>;
export interface CreateACLResponse {
  ACL?: ACL;
}
export const CreateACLResponse = S.suspend(() =>
  S.Struct({ ACL: S.optional(ACL) }).pipe(ns),
).annotations({
  identifier: "CreateACLResponse",
}) as any as S.Schema<CreateACLResponse>;
export interface CreateMultiRegionClusterResponse {
  MultiRegionCluster?: MultiRegionCluster;
}
export const CreateMultiRegionClusterResponse = S.suspend(() =>
  S.Struct({ MultiRegionCluster: S.optional(MultiRegionCluster) }).pipe(ns),
).annotations({
  identifier: "CreateMultiRegionClusterResponse",
}) as any as S.Schema<CreateMultiRegionClusterResponse>;
export interface DeleteUserResponse {
  User?: User;
}
export const DeleteUserResponse = S.suspend(() =>
  S.Struct({ User: S.optional(User) }).pipe(ns),
).annotations({
  identifier: "DeleteUserResponse",
}) as any as S.Schema<DeleteUserResponse>;
export interface DescribeReservedNodesResponse {
  NextToken?: string;
  ReservedNodes?: ReservedNodeList;
}
export const DescribeReservedNodesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ReservedNodes: S.optional(ReservedNodeList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeReservedNodesResponse",
}) as any as S.Schema<DescribeReservedNodesResponse>;
export interface CreateSubnetGroupResponse {
  SubnetGroup?: SubnetGroup;
}
export const CreateSubnetGroupResponse = S.suspend(() =>
  S.Struct({ SubnetGroup: S.optional(SubnetGroup) }).pipe(ns),
).annotations({
  identifier: "CreateSubnetGroupResponse",
}) as any as S.Schema<CreateSubnetGroupResponse>;
export interface CreateClusterResponse {
  Cluster?: Cluster;
}
export const CreateClusterResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "CreateClusterResponse",
}) as any as S.Schema<CreateClusterResponse>;
export interface CreateSnapshotResponse {
  Snapshot?: Snapshot;
}
export const CreateSnapshotResponse = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "CreateSnapshotResponse",
}) as any as S.Schema<CreateSnapshotResponse>;

//# Errors
export class ACLNotFoundFault extends S.TaggedError<ACLNotFoundFault>()(
  "ACLNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ACLNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ClusterNotFoundFault extends S.TaggedError<ClusterNotFoundFault>()(
  "ClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ClusterNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidMultiRegionClusterStateFault extends S.TaggedError<InvalidMultiRegionClusterStateFault>()(
  "InvalidMultiRegionClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidMultiRegionClusterState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterCombinationException extends S.TaggedError<InvalidParameterCombinationException>()(
  "InvalidParameterCombinationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidParameterCombination",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ServiceLinkedRoleNotFoundFault extends S.TaggedError<ServiceLinkedRoleNotFoundFault>()(
  "ServiceLinkedRoleNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServiceLinkedRoleNotFoundFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class APICallRateForCustomerExceededFault extends S.TaggedError<APICallRateForCustomerExceededFault>()(
  "APICallRateForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "APICallRateForCustomerExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidSubnet extends S.TaggedError<InvalidSubnet>()(
  "InvalidSubnet",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DuplicateUserNameFault extends S.TaggedError<DuplicateUserNameFault>()(
  "DuplicateUserNameFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateUserName", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidACLStateFault extends S.TaggedError<InvalidACLStateFault>()(
  "InvalidACLStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidACLState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidClusterStateFault extends S.TaggedError<InvalidClusterStateFault>()(
  "InvalidClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidClusterState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidParameterValue", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterGroupStateFault extends S.TaggedError<InvalidParameterGroupStateFault>()(
  "InvalidParameterGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidParameterGroupState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubnetGroupInUseFault extends S.TaggedError<SubnetGroupInUseFault>()(
  "SubnetGroupInUseFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class UserNotFoundFault extends S.TaggedError<UserNotFoundFault>()(
  "UserNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ClusterQuotaForCustomerExceededFault extends S.TaggedError<ClusterQuotaForCustomerExceededFault>()(
  "ClusterQuotaForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterQuotaForCustomerExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubnetGroupNotFoundFault extends S.TaggedError<SubnetGroupNotFoundFault>()(
  "SubnetGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidARNFault extends S.TaggedError<InvalidARNFault>()(
  "InvalidARNFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidARN", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class DefaultUserRequired extends S.TaggedError<DefaultUserRequired>()(
  "DefaultUserRequired",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DefaultUserRequired", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ACLAlreadyExistsFault extends S.TaggedError<ACLAlreadyExistsFault>()(
  "ACLAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ACLAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class MultiRegionClusterNotFoundFault extends S.TaggedError<MultiRegionClusterNotFoundFault>()(
  "MultiRegionClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "MultiRegionClusterNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class ParameterGroupNotFoundFault extends S.TaggedError<ParameterGroupNotFoundFault>()(
  "ParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ParameterGroupNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidUserStateFault extends S.TaggedError<InvalidUserStateFault>()(
  "InvalidUserStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidUserState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ReservedNodeNotFoundFault extends S.TaggedError<ReservedNodeNotFoundFault>()(
  "ReservedNodeNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReservedNodeNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidKMSKeyFault extends S.TaggedError<InvalidKMSKeyFault>()(
  "InvalidKMSKeyFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidKMSKeyFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubnetInUse extends S.TaggedError<SubnetInUse>()(
  "SubnetInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class MultiRegionParameterGroupNotFoundFault extends S.TaggedError<MultiRegionParameterGroupNotFoundFault>()(
  "MultiRegionParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "MultiRegionParameterGroupNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedNodesOfferingNotFoundFault extends S.TaggedError<ReservedNodesOfferingNotFoundFault>()(
  "ReservedNodesOfferingNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedNodesOfferingNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidSnapshotStateFault extends S.TaggedError<InvalidSnapshotStateFault>()(
  "InvalidSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSnapshotState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SnapshotNotFoundFault extends S.TaggedError<SnapshotNotFoundFault>()(
  "SnapshotNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SnapshotNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ReservedNodeAlreadyExistsFault extends S.TaggedError<ReservedNodeAlreadyExistsFault>()(
  "ReservedNodeAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReservedNodeAlreadyExists", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ServiceUpdateNotFoundFault extends S.TaggedError<ServiceUpdateNotFoundFault>()(
  "ServiceUpdateNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServiceUpdateNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class TagQuotaPerResourceExceeded extends S.TaggedError<TagQuotaPerResourceExceeded>()(
  "TagQuotaPerResourceExceeded",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TagQuotaPerResourceExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SnapshotAlreadyExistsFault extends S.TaggedError<SnapshotAlreadyExistsFault>()(
  "SnapshotAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ParameterGroupAlreadyExistsFault extends S.TaggedError<ParameterGroupAlreadyExistsFault>()(
  "ParameterGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ParameterGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class MultiRegionClusterAlreadyExistsFault extends S.TaggedError<MultiRegionClusterAlreadyExistsFault>()(
  "MultiRegionClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "MultiRegionClusterAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ACLQuotaExceededFault extends S.TaggedError<ACLQuotaExceededFault>()(
  "ACLQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ACLQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubnetGroupAlreadyExistsFault extends S.TaggedError<SubnetGroupAlreadyExistsFault>()(
  "SubnetGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidNodeStateFault extends S.TaggedError<InvalidNodeStateFault>()(
  "InvalidNodeStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidNodeState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubnetNotAllowedFault extends S.TaggedError<SubnetNotAllowedFault>()(
  "SubnetNotAllowedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetNotAllowedFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ReservedNodeQuotaExceededFault extends S.TaggedError<ReservedNodeQuotaExceededFault>()(
  "ReservedNodeQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReservedNodeQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class UserAlreadyExistsFault extends S.TaggedError<UserAlreadyExistsFault>()(
  "UserAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TagNotFoundFault extends S.TaggedError<TagNotFoundFault>()(
  "TagNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ParameterGroupQuotaExceededFault extends S.TaggedError<ParameterGroupQuotaExceededFault>()(
  "ParameterGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ShardNotFoundFault extends S.TaggedError<ShardNotFoundFault>()(
  "ShardNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ShardNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class SnapshotQuotaExceededFault extends S.TaggedError<SnapshotQuotaExceededFault>()(
  "SnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterAlreadyExistsFault extends S.TaggedError<ClusterAlreadyExistsFault>()(
  "ClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ClusterAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SubnetGroupQuotaExceededFault extends S.TaggedError<SubnetGroupQuotaExceededFault>()(
  "SubnetGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetGroupQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubnetQuotaExceededFault extends S.TaggedError<SubnetQuotaExceededFault>()(
  "SubnetQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetQuotaExceededFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class UserQuotaExceededFault extends S.TaggedError<UserQuotaExceededFault>()(
  "UserQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TestFailoverNotAvailableFault extends S.TaggedError<TestFailoverNotAvailableFault>()(
  "TestFailoverNotAvailableFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TestFailoverNotAvailableFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InsufficientClusterCapacityFault extends S.TaggedError<InsufficientClusterCapacityFault>()(
  "InsufficientClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientClusterCapacity",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class NodeQuotaForClusterExceededFault extends S.TaggedError<NodeQuotaForClusterExceededFault>()(
  "NodeQuotaForClusterExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NodeQuotaForClusterExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidCredentialsException extends S.TaggedError<InvalidCredentialsException>()(
  "InvalidCredentialsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCredentialsException",
    httpResponseCode: 408,
  }),
).pipe(C.withTimeoutError) {}
export class NodeQuotaForCustomerExceededFault extends S.TaggedError<NodeQuotaForCustomerExceededFault>()(
  "NodeQuotaForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NodeQuotaForCustomerExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class NoOperationFault extends S.TaggedError<NoOperationFault>()(
  "NoOperationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NoOperationFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ShardsPerClusterQuotaExceededFault extends S.TaggedError<ShardsPerClusterQuotaExceededFault>()(
  "ShardsPerClusterQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ShardsPerClusterQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of ACLs.
 */
export const describeACLs: {
  (
    input: DescribeACLsRequest,
  ): Effect.Effect<
    DescribeACLsResponse,
    ACLNotFoundFault | InvalidParameterCombinationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeACLsRequest,
  ) => Stream.Stream<
    DescribeACLsResponse,
    ACLNotFoundFault | InvalidParameterCombinationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeACLsRequest,
  ) => Stream.Stream<
    ACL,
    ACLNotFoundFault | InvalidParameterCombinationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeACLsRequest,
  output: DescribeACLsResponse,
  errors: [ACLNotFoundFault, InvalidParameterCombinationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ACLs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of users.
 */
export const describeUsers: {
  (
    input: DescribeUsersRequest,
  ): Effect.Effect<
    DescribeUsersResponse,
    InvalidParameterCombinationException | UserNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeUsersRequest,
  ) => Stream.Stream<
    DescribeUsersResponse,
    InvalidParameterCombinationException | UserNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeUsersRequest,
  ) => Stream.Stream<
    User,
    InvalidParameterCombinationException | UserNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeUsersRequest,
  output: DescribeUsersResponse,
  errors: [InvalidParameterCombinationException, UserNotFoundFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Users",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Changes the list of users that belong to the Access Control List.
 */
export const updateACL: (
  input: UpdateACLRequest,
) => Effect.Effect<
  UpdateACLResponse,
  | ACLNotFoundFault
  | DefaultUserRequired
  | DuplicateUserNameFault
  | InvalidACLStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateACLRequest,
  output: UpdateACLResponse,
  errors: [
    ACLNotFoundFault,
    DefaultUserRequired,
    DuplicateUserNameFault,
    InvalidACLStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    UserNotFoundFault,
  ],
}));
/**
 * Returns a list of the available Redis OSS engine versions.
 */
export const describeEngineVersions: {
  (
    input: DescribeEngineVersionsRequest,
  ): Effect.Effect<
    DescribeEngineVersionsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEngineVersionsRequest,
  ) => Stream.Stream<
    DescribeEngineVersionsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEngineVersionsRequest,
  ) => Stream.Stream<
    EngineVersionInfo,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEngineVersionsRequest,
  output: DescribeEngineVersionsResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "EngineVersions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns events related to clusters, security groups, and parameter groups. You can obtain events specific to a particular cluster, security group, or parameter group by providing the name as a parameter.
 *
 * By default, only the events occurring within the last hour are returned; however, you can retrieve up to 14 days' worth of events if necessary.
 */
export const describeEvents: {
  (
    input: DescribeEventsRequest,
  ): Effect.Effect<
    DescribeEventsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventsRequest,
  ) => Stream.Stream<
    DescribeEventsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventsRequest,
  ) => Stream.Stream<
    Event,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEventsRequest,
  output: DescribeEventsResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Events",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns details of the service updates.
 */
export const describeServiceUpdates: {
  (
    input: DescribeServiceUpdatesRequest,
  ): Effect.Effect<
    DescribeServiceUpdatesResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeServiceUpdatesRequest,
  ) => Stream.Stream<
    DescribeServiceUpdatesResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeServiceUpdatesRequest,
  ) => Stream.Stream<
    ServiceUpdate,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeServiceUpdatesRequest,
  output: DescribeServiceUpdatesResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ServiceUpdates",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about all provisioned clusters if no cluster identifier is specified, or about a specific cluster if a cluster name is supplied.
 */
export const describeClusters: {
  (
    input: DescribeClustersRequest,
  ): Effect.Effect<
    DescribeClustersResponse,
    | ClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClustersRequest,
  ) => Stream.Stream<
    DescribeClustersResponse,
    | ClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClustersRequest,
  ) => Stream.Stream<
    Cluster,
    | ClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClustersRequest,
  output: DescribeClustersResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Clusters",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all available node types that you can scale to from your cluster's current node type.
 *
 * When you use the UpdateCluster operation to scale your cluster, the value of the NodeType parameter must be one of the node types returned by this operation.
 */
export const listAllowedNodeTypeUpdates: (
  input: ListAllowedNodeTypeUpdatesRequest,
) => Effect.Effect<
  ListAllowedNodeTypeUpdatesResponse,
  | ClusterNotFoundFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAllowedNodeTypeUpdatesRequest,
  output: ListAllowedNodeTypeUpdatesResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Deletes an Access Control List. The ACL must first be disassociated from the cluster before it can be deleted. For more information, see Authenticating users with Access Contol Lists (ACLs).
 */
export const deleteACL: (
  input: DeleteACLRequest,
) => Effect.Effect<
  DeleteACLResponse,
  | ACLNotFoundFault
  | InvalidACLStateFault
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteACLRequest,
  output: DeleteACLResponse,
  errors: [
    ACLNotFoundFault,
    InvalidACLStateFault,
    InvalidParameterValueException,
  ],
}));
/**
 * Returns a list of subnet group descriptions. If a subnet group name is specified, the list contains only the description of that group.
 */
export const describeSubnetGroups: {
  (
    input: DescribeSubnetGroupsRequest,
  ): Effect.Effect<
    DescribeSubnetGroupsResponse,
    ServiceLinkedRoleNotFoundFault | SubnetGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSubnetGroupsRequest,
  ) => Stream.Stream<
    DescribeSubnetGroupsResponse,
    ServiceLinkedRoleNotFoundFault | SubnetGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSubnetGroupsRequest,
  ) => Stream.Stream<
    SubnetGroup,
    ServiceLinkedRoleNotFoundFault | SubnetGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSubnetGroupsRequest,
  output: DescribeSubnetGroupsResponse,
  errors: [ServiceLinkedRoleNotFoundFault, SubnetGroupNotFoundFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SubnetGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes a subnet group. You cannot delete a default subnet group or one that is associated with any clusters.
 */
export const deleteSubnetGroup: (
  input: DeleteSubnetGroupRequest,
) => Effect.Effect<
  DeleteSubnetGroupResponse,
  | ServiceLinkedRoleNotFoundFault
  | SubnetGroupInUseFault
  | SubnetGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubnetGroupRequest,
  output: DeleteSubnetGroupResponse,
  errors: [
    ServiceLinkedRoleNotFoundFault,
    SubnetGroupInUseFault,
    SubnetGroupNotFoundFault,
  ],
}));
/**
 * Deletes an existing multi-Region cluster.
 */
export const deleteMultiRegionCluster: (
  input: DeleteMultiRegionClusterRequest,
) => Effect.Effect<
  DeleteMultiRegionClusterResponse,
  | InvalidMultiRegionClusterStateFault
  | InvalidParameterValueException
  | MultiRegionClusterNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMultiRegionClusterRequest,
  output: DeleteMultiRegionClusterResponse,
  errors: [
    InvalidMultiRegionClusterStateFault,
    InvalidParameterValueException,
    MultiRegionClusterNotFoundFault,
  ],
}));
/**
 * Deletes the specified parameter group. You cannot delete a parameter group if it is associated with any clusters.
 * You cannot delete the default parameter groups in your account.
 */
export const deleteParameterGroup: (
  input: DeleteParameterGroupRequest,
) => Effect.Effect<
  DeleteParameterGroupResponse,
  | InvalidParameterCombinationException
  | InvalidParameterGroupStateFault
  | InvalidParameterValueException
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteParameterGroupRequest,
  output: DeleteParameterGroupResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterGroupStateFault,
    InvalidParameterValueException,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Deletes a user. The user will be removed from all ACLs and in turn removed from all clusters.
 */
export const deleteUser: (
  input: DeleteUserRequest,
) => Effect.Effect<
  DeleteUserResponse,
  | InvalidParameterValueException
  | InvalidUserStateFault
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    InvalidParameterValueException,
    InvalidUserStateFault,
    UserNotFoundFault,
  ],
}));
/**
 * Returns information about reserved nodes for this account, or about a specified reserved node.
 */
export const describeReservedNodes: {
  (
    input: DescribeReservedNodesRequest,
  ): Effect.Effect<
    DescribeReservedNodesResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedNodeNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedNodesRequest,
  ) => Stream.Stream<
    DescribeReservedNodesResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedNodeNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedNodesRequest,
  ) => Stream.Stream<
    ReservedNode,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedNodeNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReservedNodesRequest,
  output: DescribeReservedNodesResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ReservedNodeNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ReservedNodes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of multi-region parameter groups.
 */
export const describeMultiRegionParameterGroups: (
  input: DescribeMultiRegionParameterGroupsRequest,
) => Effect.Effect<
  DescribeMultiRegionParameterGroupsResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | MultiRegionParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMultiRegionParameterGroupsRequest,
  output: DescribeMultiRegionParameterGroupsResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    MultiRegionParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Lists available reserved node offerings.
 */
export const describeReservedNodesOfferings: {
  (
    input: DescribeReservedNodesOfferingsRequest,
  ): Effect.Effect<
    DescribeReservedNodesOfferingsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedNodesOfferingNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedNodesOfferingsRequest,
  ) => Stream.Stream<
    DescribeReservedNodesOfferingsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedNodesOfferingNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedNodesOfferingsRequest,
  ) => Stream.Stream<
    ReservedNodesOffering,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedNodesOfferingNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReservedNodesOfferingsRequest,
  output: DescribeReservedNodesOfferingsResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ReservedNodesOfferingNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ReservedNodesOfferings",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about cluster snapshots. By default, DescribeSnapshots lists all of your snapshots; it can optionally describe a single snapshot,
 * or just the snapshots associated with a particular cluster.
 */
export const describeSnapshots: {
  (
    input: DescribeSnapshotsRequest,
  ): Effect.Effect<
    DescribeSnapshotsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | SnapshotNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSnapshotsRequest,
  ) => Stream.Stream<
    DescribeSnapshotsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | SnapshotNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSnapshotsRequest,
  ) => Stream.Stream<
    Snapshot,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceLinkedRoleNotFoundFault
    | SnapshotNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSnapshotsRequest,
  output: DescribeSnapshotsResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
    SnapshotNotFoundFault,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Snapshots",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Apply the service update to a list of clusters supplied. For more information on service updates and applying them, see Applying the service updates.
 */
export const batchUpdateCluster: (
  input: BatchUpdateClusterRequest,
) => Effect.Effect<
  BatchUpdateClusterResponse,
  InvalidParameterValueException | ServiceUpdateNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateClusterRequest,
  output: BatchUpdateClusterResponse,
  errors: [InvalidParameterValueException, ServiceUpdateNotFoundFault],
}));
/**
 * Deletes a cluster. It also deletes all associated nodes and node endpoints.
 *
 * `CreateSnapshot` permission is required to create a final snapshot.
 * Without this permission, the API call will fail with an `Access Denied` exception.
 */
export const deleteCluster: (
  input: DeleteClusterRequest,
) => Effect.Effect<
  DeleteClusterResponse,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | SnapshotAlreadyExistsFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
    SnapshotAlreadyExistsFault,
  ],
}));
/**
 * Lists all tags currently on a named resource. A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track your MemoryDB resources. For more information, see Tagging your MemoryDB resources.
 *
 * When you add or remove tags from multi region clusters, you might not immediately see the latest effective tags in the ListTags API response due to it being eventually consistent specifically for multi region clusters. For more information, see Tagging your MemoryDB resources.
 */
export const listTags: (
  input: ListTagsRequest,
) => Effect.Effect<
  ListTagsResponse,
  | ACLNotFoundFault
  | ClusterNotFoundFault
  | InvalidARNFault
  | InvalidClusterStateFault
  | MultiRegionClusterNotFoundFault
  | MultiRegionParameterGroupNotFoundFault
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | SnapshotNotFoundFault
  | SubnetGroupNotFoundFault
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    ACLNotFoundFault,
    ClusterNotFoundFault,
    InvalidARNFault,
    InvalidClusterStateFault,
    MultiRegionClusterNotFoundFault,
    MultiRegionParameterGroupNotFoundFault,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
    SnapshotNotFoundFault,
    SubnetGroupNotFoundFault,
    UserNotFoundFault,
  ],
}));
/**
 * Returns details about one or more multi-Region clusters.
 */
export const describeMultiRegionClusters: {
  (
    input: DescribeMultiRegionClustersRequest,
  ): Effect.Effect<
    DescribeMultiRegionClustersResponse,
    | ClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | MultiRegionClusterNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMultiRegionClustersRequest,
  ) => Stream.Stream<
    DescribeMultiRegionClustersResponse,
    | ClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | MultiRegionClusterNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMultiRegionClustersRequest,
  ) => Stream.Stream<
    MultiRegionCluster,
    | ClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | MultiRegionClusterNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMultiRegionClustersRequest,
  output: DescribeMultiRegionClustersResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    MultiRegionClusterNotFoundFault,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "MultiRegionClusters",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the configuration of an existing multi-Region cluster.
 */
export const updateMultiRegionCluster: (
  input: UpdateMultiRegionClusterRequest,
) => Effect.Effect<
  UpdateMultiRegionClusterResponse,
  | InvalidMultiRegionClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | MultiRegionClusterNotFoundFault
  | MultiRegionParameterGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMultiRegionClusterRequest,
  output: UpdateMultiRegionClusterResponse,
  errors: [
    InvalidMultiRegionClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    MultiRegionClusterNotFoundFault,
    MultiRegionParameterGroupNotFoundFault,
  ],
}));
/**
 * Lists the allowed updates for a multi-Region cluster.
 */
export const listAllowedMultiRegionClusterUpdates: (
  input: ListAllowedMultiRegionClusterUpdatesRequest,
) => Effect.Effect<
  ListAllowedMultiRegionClusterUpdatesResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | MultiRegionClusterNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAllowedMultiRegionClusterUpdatesRequest,
  output: ListAllowedMultiRegionClusterUpdatesResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    MultiRegionClusterNotFoundFault,
  ],
}));
/**
 * Use this operation to add tags to a resource. A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track all your MemoryDB resources. For more information, see Tagging your MemoryDB resources.
 *
 * When you add tags to multi region clusters, you might not immediately see the latest effective tags in the ListTags API response due to it being eventually consistent specifically for multi region clusters. For more information, see Tagging your MemoryDB resources.
 *
 * You can specify cost-allocation tags for your MemoryDB resources, Amazon generates a cost allocation report as a comma-separated value
 * (CSV) file with your usage and costs aggregated by your tags. You can apply tags that represent business categories
 * (such as cost centers, application names, or owners) to organize your costs across multiple services.
 *
 * For more information, see Using Cost Allocation Tags.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | ACLNotFoundFault
  | ClusterNotFoundFault
  | InvalidARNFault
  | InvalidClusterStateFault
  | InvalidParameterValueException
  | MultiRegionClusterNotFoundFault
  | MultiRegionParameterGroupNotFoundFault
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | SnapshotNotFoundFault
  | SubnetGroupNotFoundFault
  | TagQuotaPerResourceExceeded
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ACLNotFoundFault,
    ClusterNotFoundFault,
    InvalidARNFault,
    InvalidClusterStateFault,
    InvalidParameterValueException,
    MultiRegionClusterNotFoundFault,
    MultiRegionParameterGroupNotFoundFault,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
    SnapshotNotFoundFault,
    SubnetGroupNotFoundFault,
    TagQuotaPerResourceExceeded,
    UserNotFoundFault,
  ],
}));
/**
 * Returns the detailed parameter list for a particular parameter group.
 */
export const describeParameters: {
  (
    input: DescribeParametersRequest,
  ): Effect.Effect<
    DescribeParametersResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ParameterGroupNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeParametersRequest,
  ) => Stream.Stream<
    DescribeParametersResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ParameterGroupNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeParametersRequest,
  ) => Stream.Stream<
    Parameter,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ParameterGroupNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeParametersRequest,
  output: DescribeParametersResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Parameters",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of parameter group descriptions. If a parameter group name is specified, the list contains only the descriptions for that group.
 */
export const describeParameterGroups: {
  (
    input: DescribeParameterGroupsRequest,
  ): Effect.Effect<
    DescribeParameterGroupsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ParameterGroupNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeParameterGroupsRequest,
  ) => Stream.Stream<
    DescribeParameterGroupsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ParameterGroupNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeParameterGroupsRequest,
  ) => Stream.Stream<
    ParameterGroup,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ParameterGroupNotFoundFault
    | ServiceLinkedRoleNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeParameterGroupsRequest,
  output: DescribeParameterGroupsResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ParameterGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the parameters of a parameter group. You can modify up to 20 parameters in a single request by submitting a list parameter name and value pairs.
 */
export const updateParameterGroup: (
  input: UpdateParameterGroupRequest,
) => Effect.Effect<
  UpdateParameterGroupResponse,
  | InvalidParameterCombinationException
  | InvalidParameterGroupStateFault
  | InvalidParameterValueException
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateParameterGroupRequest,
  output: UpdateParameterGroupResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterGroupStateFault,
    InvalidParameterValueException,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Modifies the parameters of a parameter group to the engine or system default value. You can reset specific parameters by submitting a list of parameter names. To reset the entire parameter group, specify the AllParameters and ParameterGroupName parameters.
 */
export const resetParameterGroup: (
  input: ResetParameterGroupRequest,
) => Effect.Effect<
  ResetParameterGroupResponse,
  | InvalidParameterCombinationException
  | InvalidParameterGroupStateFault
  | InvalidParameterValueException
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetParameterGroupRequest,
  output: ResetParameterGroupResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterGroupStateFault,
    InvalidParameterValueException,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Changes user password(s) and/or access string.
 */
export const updateUser: (
  input: UpdateUserRequest,
) => Effect.Effect<
  UpdateUserResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidUserStateFault
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidUserStateFault,
    UserNotFoundFault,
  ],
}));
/**
 * Creates a new multi-Region cluster.
 */
export const createMultiRegionCluster: (
  input: CreateMultiRegionClusterRequest,
) => Effect.Effect<
  CreateMultiRegionClusterResponse,
  | ClusterQuotaForCustomerExceededFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | MultiRegionClusterAlreadyExistsFault
  | MultiRegionParameterGroupNotFoundFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMultiRegionClusterRequest,
  output: CreateMultiRegionClusterResponse,
  errors: [
    ClusterQuotaForCustomerExceededFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    MultiRegionClusterAlreadyExistsFault,
    MultiRegionParameterGroupNotFoundFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Returns the detailed parameter list for a particular multi-region parameter group.
 */
export const describeMultiRegionParameters: (
  input: DescribeMultiRegionParametersRequest,
) => Effect.Effect<
  DescribeMultiRegionParametersResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | MultiRegionParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMultiRegionParametersRequest,
  output: DescribeMultiRegionParametersResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    MultiRegionParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Deletes an existing snapshot. When you receive a successful response from this operation, MemoryDB immediately begins deleting the snapshot; you cannot cancel or revert this operation.
 */
export const deleteSnapshot: (
  input: DeleteSnapshotRequest,
) => Effect.Effect<
  DeleteSnapshotResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidSnapshotStateFault
  | ServiceLinkedRoleNotFoundFault
  | SnapshotNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSnapshotRequest,
  output: DeleteSnapshotResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidSnapshotStateFault,
    ServiceLinkedRoleNotFoundFault,
    SnapshotNotFoundFault,
  ],
}));
/**
 * Creates an Access Control List. For more information, see Authenticating users with Access Contol Lists (ACLs).
 */
export const createACL: (
  input: CreateACLRequest,
) => Effect.Effect<
  CreateACLResponse,
  | ACLAlreadyExistsFault
  | ACLQuotaExceededFault
  | DefaultUserRequired
  | DuplicateUserNameFault
  | InvalidParameterValueException
  | TagQuotaPerResourceExceeded
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateACLRequest,
  output: CreateACLResponse,
  errors: [
    ACLAlreadyExistsFault,
    ACLQuotaExceededFault,
    DefaultUserRequired,
    DuplicateUserNameFault,
    InvalidParameterValueException,
    TagQuotaPerResourceExceeded,
    UserNotFoundFault,
  ],
}));
/**
 * Allows you to purchase a reserved node offering. Reserved nodes are not eligible for cancellation and are non-refundable.
 */
export const purchaseReservedNodesOffering: (
  input: PurchaseReservedNodesOfferingRequest,
) => Effect.Effect<
  PurchaseReservedNodesOfferingResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ReservedNodeAlreadyExistsFault
  | ReservedNodeQuotaExceededFault
  | ReservedNodesOfferingNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurchaseReservedNodesOfferingRequest,
  output: PurchaseReservedNodesOfferingResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ReservedNodeAlreadyExistsFault,
    ReservedNodeQuotaExceededFault,
    ReservedNodesOfferingNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Use this operation to remove tags on a resource. A tag is a key-value pair where the key and value are case-sensitive. You can use tags to categorize and track all your MemoryDB resources. For more information, see Tagging your MemoryDB resources.
 *
 * When you remove tags from multi region clusters, you might not immediately see the latest effective tags in the ListTags API response due to it being eventually consistent specifically for multi region clusters. For more information, see Tagging your MemoryDB resources.
 *
 * You can specify cost-allocation tags for your MemoryDB resources, Amazon generates a cost allocation report as a comma-separated value
 * (CSV) file with your usage and costs aggregated by your tags. You can apply tags that represent business categories
 * (such as cost centers, application names, or owners) to organize your costs across multiple services.
 *
 * For more information, see Using Cost Allocation Tags.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | ACLNotFoundFault
  | ClusterNotFoundFault
  | InvalidARNFault
  | InvalidClusterStateFault
  | InvalidParameterValueException
  | MultiRegionClusterNotFoundFault
  | MultiRegionParameterGroupNotFoundFault
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | SnapshotNotFoundFault
  | SubnetGroupNotFoundFault
  | TagNotFoundFault
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ACLNotFoundFault,
    ClusterNotFoundFault,
    InvalidARNFault,
    InvalidClusterStateFault,
    InvalidParameterValueException,
    MultiRegionClusterNotFoundFault,
    MultiRegionParameterGroupNotFoundFault,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
    SnapshotNotFoundFault,
    SubnetGroupNotFoundFault,
    TagNotFoundFault,
    UserNotFoundFault,
  ],
}));
/**
 * Creates a new MemoryDB parameter group. A parameter group is a collection of parameters and their values that are applied to all of the nodes in any cluster. For
 * more information, see Configuring engine parameters using parameter groups.
 */
export const createParameterGroup: (
  input: CreateParameterGroupRequest,
) => Effect.Effect<
  CreateParameterGroupResponse,
  | InvalidParameterCombinationException
  | InvalidParameterGroupStateFault
  | InvalidParameterValueException
  | ParameterGroupAlreadyExistsFault
  | ParameterGroupQuotaExceededFault
  | ServiceLinkedRoleNotFoundFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateParameterGroupRequest,
  output: CreateParameterGroupResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterGroupStateFault,
    InvalidParameterValueException,
    ParameterGroupAlreadyExistsFault,
    ParameterGroupQuotaExceededFault,
    ServiceLinkedRoleNotFoundFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Makes a copy of an existing snapshot.
 */
export const copySnapshot: (
  input: CopySnapshotRequest,
) => Effect.Effect<
  CopySnapshotResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidSnapshotStateFault
  | ServiceLinkedRoleNotFoundFault
  | SnapshotAlreadyExistsFault
  | SnapshotNotFoundFault
  | SnapshotQuotaExceededFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopySnapshotRequest,
  output: CopySnapshotResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidSnapshotStateFault,
    ServiceLinkedRoleNotFoundFault,
    SnapshotAlreadyExistsFault,
    SnapshotNotFoundFault,
    SnapshotQuotaExceededFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Creates a copy of an entire cluster at a specific moment in time.
 */
export const createSnapshot: (
  input: CreateSnapshotRequest,
) => Effect.Effect<
  CreateSnapshotResponse,
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | SnapshotAlreadyExistsFault
  | SnapshotQuotaExceededFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotRequest,
  output: CreateSnapshotResponse,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
    SnapshotAlreadyExistsFault,
    SnapshotQuotaExceededFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Updates a subnet group. For more information, see Updating a subnet group
 */
export const updateSubnetGroup: (
  input: UpdateSubnetGroupRequest,
) => Effect.Effect<
  UpdateSubnetGroupResponse,
  | InvalidSubnet
  | ServiceLinkedRoleNotFoundFault
  | SubnetGroupNotFoundFault
  | SubnetInUse
  | SubnetNotAllowedFault
  | SubnetQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSubnetGroupRequest,
  output: UpdateSubnetGroupResponse,
  errors: [
    InvalidSubnet,
    ServiceLinkedRoleNotFoundFault,
    SubnetGroupNotFoundFault,
    SubnetInUse,
    SubnetNotAllowedFault,
    SubnetQuotaExceededFault,
  ],
}));
/**
 * Creates a MemoryDB user. For more information, see Authenticating users with Access Contol Lists (ACLs).
 */
export const createUser: (
  input: CreateUserRequest,
) => Effect.Effect<
  CreateUserResponse,
  | DuplicateUserNameFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | TagQuotaPerResourceExceeded
  | UserAlreadyExistsFault
  | UserQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    DuplicateUserNameFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    TagQuotaPerResourceExceeded,
    UserAlreadyExistsFault,
    UserQuotaExceededFault,
  ],
}));
/**
 * Used to failover a shard. This API is designed for testing the behavior of your application in case of MemoryDB failover. It is not designed to be used as a production-level tool for initiating
 * a failover to overcome a problem you may have with the cluster. Moreover, in certain conditions such as large scale operational events, Amazon may block this API.
 */
export const failoverShard: (
  input: FailoverShardRequest,
) => Effect.Effect<
  FailoverShardResponse,
  | APICallRateForCustomerExceededFault
  | ClusterNotFoundFault
  | InvalidClusterStateFault
  | InvalidKMSKeyFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ShardNotFoundFault
  | TestFailoverNotAvailableFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FailoverShardRequest,
  output: FailoverShardResponse,
  errors: [
    APICallRateForCustomerExceededFault,
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidKMSKeyFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ShardNotFoundFault,
    TestFailoverNotAvailableFault,
  ],
}));
/**
 * Creates a subnet group. A subnet group is a collection of subnets (typically private) that you can designate for your clusters running in an Amazon Virtual Private Cloud (VPC) environment.
 *
 * When you create a cluster in an Amazon VPC, you must specify a subnet group. MemoryDB uses that subnet group to choose a subnet and IP addresses within that subnet to associate with your nodes.
 * For more information, see Subnets and subnet groups.
 */
export const createSubnetGroup: (
  input: CreateSubnetGroupRequest,
) => Effect.Effect<
  CreateSubnetGroupResponse,
  | InvalidSubnet
  | ServiceLinkedRoleNotFoundFault
  | SubnetGroupAlreadyExistsFault
  | SubnetGroupQuotaExceededFault
  | SubnetNotAllowedFault
  | SubnetQuotaExceededFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubnetGroupRequest,
  output: CreateSubnetGroupResponse,
  errors: [
    InvalidSubnet,
    ServiceLinkedRoleNotFoundFault,
    SubnetGroupAlreadyExistsFault,
    SubnetGroupQuotaExceededFault,
    SubnetNotAllowedFault,
    SubnetQuotaExceededFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Creates a cluster. All nodes in the cluster run the same protocol-compliant engine software.
 */
export const createCluster: (
  input: CreateClusterRequest,
) => Effect.Effect<
  CreateClusterResponse,
  | ACLNotFoundFault
  | ClusterAlreadyExistsFault
  | ClusterQuotaForCustomerExceededFault
  | InsufficientClusterCapacityFault
  | InvalidACLStateFault
  | InvalidCredentialsException
  | InvalidMultiRegionClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidVPCNetworkStateFault
  | MultiRegionClusterNotFoundFault
  | NodeQuotaForClusterExceededFault
  | NodeQuotaForCustomerExceededFault
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | ShardsPerClusterQuotaExceededFault
  | SubnetGroupNotFoundFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [
    ACLNotFoundFault,
    ClusterAlreadyExistsFault,
    ClusterQuotaForCustomerExceededFault,
    InsufficientClusterCapacityFault,
    InvalidACLStateFault,
    InvalidCredentialsException,
    InvalidMultiRegionClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidVPCNetworkStateFault,
    MultiRegionClusterNotFoundFault,
    NodeQuotaForClusterExceededFault,
    NodeQuotaForCustomerExceededFault,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
    ShardsPerClusterQuotaExceededFault,
    SubnetGroupNotFoundFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Modifies the settings for a cluster. You can use this operation to change one or more cluster configuration settings by specifying the settings and the new values.
 */
export const updateCluster: (
  input: UpdateClusterRequest,
) => Effect.Effect<
  UpdateClusterResponse,
  | ACLNotFoundFault
  | ClusterNotFoundFault
  | ClusterQuotaForCustomerExceededFault
  | InvalidACLStateFault
  | InvalidClusterStateFault
  | InvalidKMSKeyFault
  | InvalidNodeStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidVPCNetworkStateFault
  | NodeQuotaForClusterExceededFault
  | NodeQuotaForCustomerExceededFault
  | NoOperationFault
  | ParameterGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | ShardsPerClusterQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterRequest,
  output: UpdateClusterResponse,
  errors: [
    ACLNotFoundFault,
    ClusterNotFoundFault,
    ClusterQuotaForCustomerExceededFault,
    InvalidACLStateFault,
    InvalidClusterStateFault,
    InvalidKMSKeyFault,
    InvalidNodeStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidVPCNetworkStateFault,
    NodeQuotaForClusterExceededFault,
    NodeQuotaForCustomerExceededFault,
    NoOperationFault,
    ParameterGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
    ShardsPerClusterQuotaExceededFault,
  ],
}));

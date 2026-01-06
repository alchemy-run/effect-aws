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
const svc = T.AwsApiService({
  sdkId: "ManagedBlockchain",
  serviceShapeName: "TaigaWebService",
});
const auth = T.AwsAuthSigv4({ name: "managedblockchain" });
const ver = T.ServiceVersion("2018-09-24");
const proto = T.AwsProtocolsRestJson1();
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
                        url: "https://managedblockchain-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://managedblockchain-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://managedblockchain.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://managedblockchain.{Region}.{PartitionResult#dnsSuffix}",
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
export type ClientRequestTokenString = string;
export type ResourceIdString = string;
export type NameString = string;
export type DescriptionString = string;
export type FrameworkVersionString = string;
export type AccessorListMaxResults = number;
export type PaginationToken = string;
export type ProposalListMaxResults = number;
export type MemberListMaxResults = number;
export type NetworkListMaxResults = number;
export type NodeListMaxResults = number;
export type ArnString = string;
export type TagKey = string;
export type TagValue = string;
export type NetworkMemberNameString = string;
export type InstanceTypeString = string;
export type AvailabilityZoneString = string;
export type ThresholdPercentageInt = number;
export type ProposalDurationInt = number;
export type PrincipalString = string;
export type AccessorBillingTokenString = string;
export type VoteCount = number;
export type UsernameString = string;
export type PasswordString = string | Redacted.Redacted<string>;
export type ExceptionMessage = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteAccessorInput {
  AccessorId: string;
}
export const DeleteAccessorInput = S.suspend(() =>
  S.Struct({ AccessorId: S.String.pipe(T.HttpLabel("AccessorId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/accessors/{AccessorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAccessorInput",
}) as any as S.Schema<DeleteAccessorInput>;
export interface DeleteAccessorOutput {}
export const DeleteAccessorOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAccessorOutput",
}) as any as S.Schema<DeleteAccessorOutput>;
export interface DeleteMemberInput {
  NetworkId: string;
  MemberId: string;
}
export const DeleteMemberInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    MemberId: S.String.pipe(T.HttpLabel("MemberId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/networks/{NetworkId}/members/{MemberId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMemberInput",
}) as any as S.Schema<DeleteMemberInput>;
export interface DeleteMemberOutput {}
export const DeleteMemberOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteMemberOutput",
}) as any as S.Schema<DeleteMemberOutput>;
export interface DeleteNodeInput {
  NetworkId: string;
  MemberId?: string;
  NodeId: string;
}
export const DeleteNodeInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    MemberId: S.optional(S.String).pipe(T.HttpQuery("memberId")),
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/networks/{NetworkId}/nodes/{NodeId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteNodeInput",
}) as any as S.Schema<DeleteNodeInput>;
export interface DeleteNodeOutput {}
export const DeleteNodeOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteNodeOutput",
}) as any as S.Schema<DeleteNodeOutput>;
export interface GetAccessorInput {
  AccessorId: string;
}
export const GetAccessorInput = S.suspend(() =>
  S.Struct({ AccessorId: S.String.pipe(T.HttpLabel("AccessorId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accessors/{AccessorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccessorInput",
}) as any as S.Schema<GetAccessorInput>;
export interface GetMemberInput {
  NetworkId: string;
  MemberId: string;
}
export const GetMemberInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    MemberId: S.String.pipe(T.HttpLabel("MemberId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/networks/{NetworkId}/members/{MemberId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMemberInput",
}) as any as S.Schema<GetMemberInput>;
export interface GetNetworkInput {
  NetworkId: string;
}
export const GetNetworkInput = S.suspend(() =>
  S.Struct({ NetworkId: S.String.pipe(T.HttpLabel("NetworkId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{NetworkId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetNetworkInput",
}) as any as S.Schema<GetNetworkInput>;
export interface GetNodeInput {
  NetworkId: string;
  MemberId?: string;
  NodeId: string;
}
export const GetNodeInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    MemberId: S.optional(S.String).pipe(T.HttpQuery("memberId")),
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{NetworkId}/nodes/{NodeId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetNodeInput" }) as any as S.Schema<GetNodeInput>;
export interface GetProposalInput {
  NetworkId: string;
  ProposalId: string;
}
export const GetProposalInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    ProposalId: S.String.pipe(T.HttpLabel("ProposalId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/networks/{NetworkId}/proposals/{ProposalId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProposalInput",
}) as any as S.Schema<GetProposalInput>;
export interface ListAccessorsInput {
  MaxResults?: number;
  NextToken?: string;
  NetworkType?: string;
}
export const ListAccessorsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    NetworkType: S.optional(S.String).pipe(T.HttpQuery("networkType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accessors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAccessorsInput",
}) as any as S.Schema<ListAccessorsInput>;
export interface ListInvitationsInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListInvitationsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/invitations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInvitationsInput",
}) as any as S.Schema<ListInvitationsInput>;
export interface ListMembersInput {
  NetworkId: string;
  Name?: string;
  Status?: string;
  IsOwned?: boolean;
  MaxResults?: number;
  NextToken?: string;
}
export const ListMembersInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    Name: S.optional(S.String).pipe(T.HttpQuery("name")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    IsOwned: S.optional(S.Boolean).pipe(T.HttpQuery("isOwned")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{NetworkId}/members" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMembersInput",
}) as any as S.Schema<ListMembersInput>;
export interface ListNetworksInput {
  Name?: string;
  Framework?: string;
  Status?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListNetworksInput = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String).pipe(T.HttpQuery("name")),
    Framework: S.optional(S.String).pipe(T.HttpQuery("framework")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNetworksInput",
}) as any as S.Schema<ListNetworksInput>;
export interface ListNodesInput {
  NetworkId: string;
  MemberId?: string;
  Status?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListNodesInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    MemberId: S.optional(S.String).pipe(T.HttpQuery("memberId")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{NetworkId}/nodes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNodesInput",
}) as any as S.Schema<ListNodesInput>;
export interface ListProposalsInput {
  NetworkId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListProposalsInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/networks/{NetworkId}/proposals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProposalsInput",
}) as any as S.Schema<ListProposalsInput>;
export interface ListProposalVotesInput {
  NetworkId: string;
  ProposalId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListProposalVotesInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    ProposalId: S.String.pipe(T.HttpLabel("ProposalId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/networks/{NetworkId}/proposals/{ProposalId}/votes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProposalVotesInput",
}) as any as S.Schema<ListProposalVotesInput>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
export interface RejectInvitationInput {
  InvitationId: string;
}
export const RejectInvitationInput = S.suspend(() =>
  S.Struct({ InvitationId: S.String.pipe(T.HttpLabel("InvitationId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/invitations/{InvitationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RejectInvitationInput",
}) as any as S.Schema<RejectInvitationInput>;
export interface RejectInvitationOutput {}
export const RejectInvitationOutput = S.suspend(() => S.Struct({})).annotations(
  { identifier: "RejectInvitationOutput" },
) as any as S.Schema<RejectInvitationOutput>;
export type InputTagMap = { [key: string]: string };
export const InputTagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: InputTagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: InputTagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface VoteOnProposalInput {
  NetworkId: string;
  ProposalId: string;
  VoterMemberId: string;
  Vote: string;
}
export const VoteOnProposalInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    ProposalId: S.String.pipe(T.HttpLabel("ProposalId")),
    VoterMemberId: S.String,
    Vote: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/networks/{NetworkId}/proposals/{ProposalId}/votes",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "VoteOnProposalInput",
}) as any as S.Schema<VoteOnProposalInput>;
export interface VoteOnProposalOutput {}
export const VoteOnProposalOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "VoteOnProposalOutput",
}) as any as S.Schema<VoteOnProposalOutput>;
export interface LogConfiguration {
  Enabled?: boolean;
}
export const LogConfiguration = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "LogConfiguration",
}) as any as S.Schema<LogConfiguration>;
export interface LogConfigurations {
  Cloudwatch?: LogConfiguration;
}
export const LogConfigurations = S.suspend(() =>
  S.Struct({ Cloudwatch: S.optional(LogConfiguration) }),
).annotations({
  identifier: "LogConfigurations",
}) as any as S.Schema<LogConfigurations>;
export interface NodeFabricLogPublishingConfiguration {
  ChaincodeLogs?: LogConfigurations;
  PeerLogs?: LogConfigurations;
}
export const NodeFabricLogPublishingConfiguration = S.suspend(() =>
  S.Struct({
    ChaincodeLogs: S.optional(LogConfigurations),
    PeerLogs: S.optional(LogConfigurations),
  }),
).annotations({
  identifier: "NodeFabricLogPublishingConfiguration",
}) as any as S.Schema<NodeFabricLogPublishingConfiguration>;
export interface NodeLogPublishingConfiguration {
  Fabric?: NodeFabricLogPublishingConfiguration;
}
export const NodeLogPublishingConfiguration = S.suspend(() =>
  S.Struct({ Fabric: S.optional(NodeFabricLogPublishingConfiguration) }),
).annotations({
  identifier: "NodeLogPublishingConfiguration",
}) as any as S.Schema<NodeLogPublishingConfiguration>;
export interface NodeConfiguration {
  InstanceType: string;
  AvailabilityZone?: string;
  LogPublishingConfiguration?: NodeLogPublishingConfiguration;
  StateDB?: string;
}
export const NodeConfiguration = S.suspend(() =>
  S.Struct({
    InstanceType: S.String,
    AvailabilityZone: S.optional(S.String),
    LogPublishingConfiguration: S.optional(NodeLogPublishingConfiguration),
    StateDB: S.optional(S.String),
  }),
).annotations({
  identifier: "NodeConfiguration",
}) as any as S.Schema<NodeConfiguration>;
export interface CreateAccessorInput {
  ClientRequestToken: string;
  AccessorType: string;
  Tags?: InputTagMap;
  NetworkType?: string;
}
export const CreateAccessorInput = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.String,
    AccessorType: S.String,
    Tags: S.optional(InputTagMap),
    NetworkType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/accessors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAccessorInput",
}) as any as S.Schema<CreateAccessorInput>;
export interface CreateNodeInput {
  ClientRequestToken: string;
  NetworkId: string;
  MemberId?: string;
  NodeConfiguration: NodeConfiguration;
  Tags?: InputTagMap;
}
export const CreateNodeInput = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.String,
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    MemberId: S.optional(S.String),
    NodeConfiguration: NodeConfiguration,
    Tags: S.optional(InputTagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/networks/{NetworkId}/nodes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNodeInput",
}) as any as S.Schema<CreateNodeInput>;
export interface NetworkFabricConfiguration {
  Edition: string;
}
export const NetworkFabricConfiguration = S.suspend(() =>
  S.Struct({ Edition: S.String }),
).annotations({
  identifier: "NetworkFabricConfiguration",
}) as any as S.Schema<NetworkFabricConfiguration>;
export interface ApprovalThresholdPolicy {
  ThresholdPercentage?: number;
  ProposalDurationInHours?: number;
  ThresholdComparator?: string;
}
export const ApprovalThresholdPolicy = S.suspend(() =>
  S.Struct({
    ThresholdPercentage: S.optional(S.Number),
    ProposalDurationInHours: S.optional(S.Number),
    ThresholdComparator: S.optional(S.String),
  }),
).annotations({
  identifier: "ApprovalThresholdPolicy",
}) as any as S.Schema<ApprovalThresholdPolicy>;
export interface InviteAction {
  Principal: string;
}
export const InviteAction = S.suspend(() =>
  S.Struct({ Principal: S.String }),
).annotations({ identifier: "InviteAction" }) as any as S.Schema<InviteAction>;
export type InviteActionList = InviteAction[];
export const InviteActionList = S.Array(InviteAction);
export interface RemoveAction {
  MemberId: string;
}
export const RemoveAction = S.suspend(() =>
  S.Struct({ MemberId: S.String }),
).annotations({ identifier: "RemoveAction" }) as any as S.Schema<RemoveAction>;
export type RemoveActionList = RemoveAction[];
export const RemoveActionList = S.Array(RemoveAction);
export interface NetworkFrameworkConfiguration {
  Fabric?: NetworkFabricConfiguration;
}
export const NetworkFrameworkConfiguration = S.suspend(() =>
  S.Struct({ Fabric: S.optional(NetworkFabricConfiguration) }),
).annotations({
  identifier: "NetworkFrameworkConfiguration",
}) as any as S.Schema<NetworkFrameworkConfiguration>;
export interface VotingPolicy {
  ApprovalThresholdPolicy?: ApprovalThresholdPolicy;
}
export const VotingPolicy = S.suspend(() =>
  S.Struct({ ApprovalThresholdPolicy: S.optional(ApprovalThresholdPolicy) }),
).annotations({ identifier: "VotingPolicy" }) as any as S.Schema<VotingPolicy>;
export interface ProposalActions {
  Invitations?: InviteActionList;
  Removals?: RemoveActionList;
}
export const ProposalActions = S.suspend(() =>
  S.Struct({
    Invitations: S.optional(InviteActionList),
    Removals: S.optional(RemoveActionList),
  }),
).annotations({
  identifier: "ProposalActions",
}) as any as S.Schema<ProposalActions>;
export type OutputTagMap = { [key: string]: string };
export const OutputTagMap = S.Record({ key: S.String, value: S.String });
export interface Accessor {
  Id?: string;
  Type?: string;
  BillingToken?: string;
  Status?: string;
  CreationDate?: Date;
  Arn?: string;
  Tags?: OutputTagMap;
  NetworkType?: string;
}
export const Accessor = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Type: S.optional(S.String),
    BillingToken: S.optional(S.String),
    Status: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Arn: S.optional(S.String),
    Tags: S.optional(OutputTagMap),
    NetworkType: S.optional(S.String),
  }),
).annotations({ identifier: "Accessor" }) as any as S.Schema<Accessor>;
export interface Proposal {
  ProposalId?: string;
  NetworkId?: string;
  Description?: string;
  Actions?: ProposalActions;
  ProposedByMemberId?: string;
  ProposedByMemberName?: string;
  Status?: string;
  CreationDate?: Date;
  ExpirationDate?: Date;
  YesVoteCount?: number;
  NoVoteCount?: number;
  OutstandingVoteCount?: number;
  Tags?: OutputTagMap;
  Arn?: string;
}
export const Proposal = S.suspend(() =>
  S.Struct({
    ProposalId: S.optional(S.String),
    NetworkId: S.optional(S.String),
    Description: S.optional(S.String),
    Actions: S.optional(ProposalActions),
    ProposedByMemberId: S.optional(S.String),
    ProposedByMemberName: S.optional(S.String),
    Status: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    YesVoteCount: S.optional(S.Number),
    NoVoteCount: S.optional(S.Number),
    OutstandingVoteCount: S.optional(S.Number),
    Tags: S.optional(OutputTagMap),
    Arn: S.optional(S.String),
  }),
).annotations({ identifier: "Proposal" }) as any as S.Schema<Proposal>;
export interface AccessorSummary {
  Id?: string;
  Type?: string;
  Status?: string;
  CreationDate?: Date;
  Arn?: string;
  NetworkType?: string;
}
export const AccessorSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Type: S.optional(S.String),
    Status: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Arn: S.optional(S.String),
    NetworkType: S.optional(S.String),
  }),
).annotations({
  identifier: "AccessorSummary",
}) as any as S.Schema<AccessorSummary>;
export type AccessorSummaryList = AccessorSummary[];
export const AccessorSummaryList = S.Array(AccessorSummary);
export interface NetworkSummary {
  Id?: string;
  Name?: string;
  Description?: string;
  Framework?: string;
  FrameworkVersion?: string;
  Status?: string;
  CreationDate?: Date;
  Arn?: string;
}
export const NetworkSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Framework: S.optional(S.String),
    FrameworkVersion: S.optional(S.String),
    Status: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkSummary",
}) as any as S.Schema<NetworkSummary>;
export interface Invitation {
  InvitationId?: string;
  CreationDate?: Date;
  ExpirationDate?: Date;
  Status?: string;
  NetworkSummary?: NetworkSummary;
  Arn?: string;
}
export const Invitation = S.suspend(() =>
  S.Struct({
    InvitationId: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Status: S.optional(S.String),
    NetworkSummary: S.optional(NetworkSummary),
    Arn: S.optional(S.String),
  }),
).annotations({ identifier: "Invitation" }) as any as S.Schema<Invitation>;
export type InvitationList = Invitation[];
export const InvitationList = S.Array(Invitation);
export interface MemberSummary {
  Id?: string;
  Name?: string;
  Description?: string;
  Status?: string;
  CreationDate?: Date;
  IsOwned?: boolean;
  Arn?: string;
}
export const MemberSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    IsOwned: S.optional(S.Boolean),
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "MemberSummary",
}) as any as S.Schema<MemberSummary>;
export type MemberSummaryList = MemberSummary[];
export const MemberSummaryList = S.Array(MemberSummary);
export type NetworkSummaryList = NetworkSummary[];
export const NetworkSummaryList = S.Array(NetworkSummary);
export interface NodeSummary {
  Id?: string;
  Status?: string;
  CreationDate?: Date;
  AvailabilityZone?: string;
  InstanceType?: string;
  Arn?: string;
}
export const NodeSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Status: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    AvailabilityZone: S.optional(S.String),
    InstanceType: S.optional(S.String),
    Arn: S.optional(S.String),
  }),
).annotations({ identifier: "NodeSummary" }) as any as S.Schema<NodeSummary>;
export type NodeSummaryList = NodeSummary[];
export const NodeSummaryList = S.Array(NodeSummary);
export interface ProposalSummary {
  ProposalId?: string;
  Description?: string;
  ProposedByMemberId?: string;
  ProposedByMemberName?: string;
  Status?: string;
  CreationDate?: Date;
  ExpirationDate?: Date;
  Arn?: string;
}
export const ProposalSummary = S.suspend(() =>
  S.Struct({
    ProposalId: S.optional(S.String),
    Description: S.optional(S.String),
    ProposedByMemberId: S.optional(S.String),
    ProposedByMemberName: S.optional(S.String),
    Status: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "ProposalSummary",
}) as any as S.Schema<ProposalSummary>;
export type ProposalSummaryList = ProposalSummary[];
export const ProposalSummaryList = S.Array(ProposalSummary);
export interface VoteSummary {
  Vote?: string;
  MemberName?: string;
  MemberId?: string;
}
export const VoteSummary = S.suspend(() =>
  S.Struct({
    Vote: S.optional(S.String),
    MemberName: S.optional(S.String),
    MemberId: S.optional(S.String),
  }),
).annotations({ identifier: "VoteSummary" }) as any as S.Schema<VoteSummary>;
export type ProposalVoteList = VoteSummary[];
export const ProposalVoteList = S.Array(VoteSummary);
export interface MemberFabricConfiguration {
  AdminUsername: string;
  AdminPassword: string | Redacted.Redacted<string>;
}
export const MemberFabricConfiguration = S.suspend(() =>
  S.Struct({ AdminUsername: S.String, AdminPassword: SensitiveString }),
).annotations({
  identifier: "MemberFabricConfiguration",
}) as any as S.Schema<MemberFabricConfiguration>;
export interface CreateAccessorOutput {
  AccessorId?: string;
  BillingToken?: string;
  NetworkType?: string;
}
export const CreateAccessorOutput = S.suspend(() =>
  S.Struct({
    AccessorId: S.optional(S.String),
    BillingToken: S.optional(S.String),
    NetworkType: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAccessorOutput",
}) as any as S.Schema<CreateAccessorOutput>;
export interface MemberFrameworkConfiguration {
  Fabric?: MemberFabricConfiguration;
}
export const MemberFrameworkConfiguration = S.suspend(() =>
  S.Struct({ Fabric: S.optional(MemberFabricConfiguration) }),
).annotations({
  identifier: "MemberFrameworkConfiguration",
}) as any as S.Schema<MemberFrameworkConfiguration>;
export interface MemberFabricLogPublishingConfiguration {
  CaLogs?: LogConfigurations;
}
export const MemberFabricLogPublishingConfiguration = S.suspend(() =>
  S.Struct({ CaLogs: S.optional(LogConfigurations) }),
).annotations({
  identifier: "MemberFabricLogPublishingConfiguration",
}) as any as S.Schema<MemberFabricLogPublishingConfiguration>;
export interface MemberLogPublishingConfiguration {
  Fabric?: MemberFabricLogPublishingConfiguration;
}
export const MemberLogPublishingConfiguration = S.suspend(() =>
  S.Struct({ Fabric: S.optional(MemberFabricLogPublishingConfiguration) }),
).annotations({
  identifier: "MemberLogPublishingConfiguration",
}) as any as S.Schema<MemberLogPublishingConfiguration>;
export interface MemberConfiguration {
  Name: string;
  Description?: string;
  FrameworkConfiguration: MemberFrameworkConfiguration;
  LogPublishingConfiguration?: MemberLogPublishingConfiguration;
  Tags?: InputTagMap;
  KmsKeyArn?: string;
}
export const MemberConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    FrameworkConfiguration: MemberFrameworkConfiguration,
    LogPublishingConfiguration: S.optional(MemberLogPublishingConfiguration),
    Tags: S.optional(InputTagMap),
    KmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "MemberConfiguration",
}) as any as S.Schema<MemberConfiguration>;
export interface CreateNetworkInput {
  ClientRequestToken: string;
  Name: string;
  Description?: string;
  Framework: string;
  FrameworkVersion: string;
  FrameworkConfiguration?: NetworkFrameworkConfiguration;
  VotingPolicy: VotingPolicy;
  MemberConfiguration: MemberConfiguration;
  Tags?: InputTagMap;
}
export const CreateNetworkInput = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    Framework: S.String,
    FrameworkVersion: S.String,
    FrameworkConfiguration: S.optional(NetworkFrameworkConfiguration),
    VotingPolicy: VotingPolicy,
    MemberConfiguration: MemberConfiguration,
    Tags: S.optional(InputTagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/networks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateNetworkInput",
}) as any as S.Schema<CreateNetworkInput>;
export interface CreateNodeOutput {
  NodeId?: string;
}
export const CreateNodeOutput = S.suspend(() =>
  S.Struct({ NodeId: S.optional(S.String) }),
).annotations({
  identifier: "CreateNodeOutput",
}) as any as S.Schema<CreateNodeOutput>;
export interface CreateProposalInput {
  ClientRequestToken: string;
  NetworkId: string;
  MemberId: string;
  Actions: ProposalActions;
  Description?: string;
  Tags?: InputTagMap;
}
export const CreateProposalInput = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.String,
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    MemberId: S.String,
    Actions: ProposalActions,
    Description: S.optional(S.String),
    Tags: S.optional(InputTagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/networks/{NetworkId}/proposals" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProposalInput",
}) as any as S.Schema<CreateProposalInput>;
export interface GetAccessorOutput {
  Accessor?: Accessor;
}
export const GetAccessorOutput = S.suspend(() =>
  S.Struct({ Accessor: S.optional(Accessor) }),
).annotations({
  identifier: "GetAccessorOutput",
}) as any as S.Schema<GetAccessorOutput>;
export interface GetProposalOutput {
  Proposal?: Proposal;
}
export const GetProposalOutput = S.suspend(() =>
  S.Struct({ Proposal: S.optional(Proposal) }),
).annotations({
  identifier: "GetProposalOutput",
}) as any as S.Schema<GetProposalOutput>;
export interface ListAccessorsOutput {
  Accessors?: AccessorSummaryList;
  NextToken?: string;
}
export const ListAccessorsOutput = S.suspend(() =>
  S.Struct({
    Accessors: S.optional(AccessorSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAccessorsOutput",
}) as any as S.Schema<ListAccessorsOutput>;
export interface ListInvitationsOutput {
  Invitations?: InvitationList;
  NextToken?: string;
}
export const ListInvitationsOutput = S.suspend(() =>
  S.Struct({
    Invitations: S.optional(InvitationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInvitationsOutput",
}) as any as S.Schema<ListInvitationsOutput>;
export interface ListMembersOutput {
  Members?: MemberSummaryList;
  NextToken?: string;
}
export const ListMembersOutput = S.suspend(() =>
  S.Struct({
    Members: S.optional(MemberSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMembersOutput",
}) as any as S.Schema<ListMembersOutput>;
export interface ListNetworksOutput {
  Networks?: NetworkSummaryList;
  NextToken?: string;
}
export const ListNetworksOutput = S.suspend(() =>
  S.Struct({
    Networks: S.optional(NetworkSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNetworksOutput",
}) as any as S.Schema<ListNetworksOutput>;
export interface ListNodesOutput {
  Nodes?: NodeSummaryList;
  NextToken?: string;
}
export const ListNodesOutput = S.suspend(() =>
  S.Struct({
    Nodes: S.optional(NodeSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNodesOutput",
}) as any as S.Schema<ListNodesOutput>;
export interface ListProposalsOutput {
  Proposals?: ProposalSummaryList;
  NextToken?: string;
}
export const ListProposalsOutput = S.suspend(() =>
  S.Struct({
    Proposals: S.optional(ProposalSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProposalsOutput",
}) as any as S.Schema<ListProposalsOutput>;
export interface ListProposalVotesOutput {
  ProposalVotes?: ProposalVoteList;
  NextToken?: string;
}
export const ListProposalVotesOutput = S.suspend(() =>
  S.Struct({
    ProposalVotes: S.optional(ProposalVoteList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProposalVotesOutput",
}) as any as S.Schema<ListProposalVotesOutput>;
export interface ListTagsForResourceResponse {
  Tags?: OutputTagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(OutputTagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateNodeInput {
  NetworkId: string;
  MemberId?: string;
  NodeId: string;
  LogPublishingConfiguration?: NodeLogPublishingConfiguration;
}
export const UpdateNodeInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    MemberId: S.optional(S.String),
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
    LogPublishingConfiguration: S.optional(NodeLogPublishingConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/networks/{NetworkId}/nodes/{NodeId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateNodeInput",
}) as any as S.Schema<UpdateNodeInput>;
export interface UpdateNodeOutput {}
export const UpdateNodeOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateNodeOutput",
}) as any as S.Schema<UpdateNodeOutput>;
export interface MemberFabricAttributes {
  AdminUsername?: string;
  CaEndpoint?: string;
}
export const MemberFabricAttributes = S.suspend(() =>
  S.Struct({
    AdminUsername: S.optional(S.String),
    CaEndpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "MemberFabricAttributes",
}) as any as S.Schema<MemberFabricAttributes>;
export interface NetworkFabricAttributes {
  OrderingServiceEndpoint?: string;
  Edition?: string;
}
export const NetworkFabricAttributes = S.suspend(() =>
  S.Struct({
    OrderingServiceEndpoint: S.optional(S.String),
    Edition: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkFabricAttributes",
}) as any as S.Schema<NetworkFabricAttributes>;
export interface NetworkEthereumAttributes {
  ChainId?: string;
}
export const NetworkEthereumAttributes = S.suspend(() =>
  S.Struct({ ChainId: S.optional(S.String) }),
).annotations({
  identifier: "NetworkEthereumAttributes",
}) as any as S.Schema<NetworkEthereumAttributes>;
export interface NodeFabricAttributes {
  PeerEndpoint?: string;
  PeerEventEndpoint?: string;
}
export const NodeFabricAttributes = S.suspend(() =>
  S.Struct({
    PeerEndpoint: S.optional(S.String),
    PeerEventEndpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "NodeFabricAttributes",
}) as any as S.Schema<NodeFabricAttributes>;
export interface NodeEthereumAttributes {
  HttpEndpoint?: string;
  WebSocketEndpoint?: string;
}
export const NodeEthereumAttributes = S.suspend(() =>
  S.Struct({
    HttpEndpoint: S.optional(S.String),
    WebSocketEndpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "NodeEthereumAttributes",
}) as any as S.Schema<NodeEthereumAttributes>;
export interface CreateMemberInput {
  ClientRequestToken: string;
  InvitationId: string;
  NetworkId: string;
  MemberConfiguration: MemberConfiguration;
}
export const CreateMemberInput = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.String,
    InvitationId: S.String,
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    MemberConfiguration: MemberConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/networks/{NetworkId}/members" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMemberInput",
}) as any as S.Schema<CreateMemberInput>;
export interface CreateNetworkOutput {
  NetworkId?: string;
  MemberId?: string;
}
export const CreateNetworkOutput = S.suspend(() =>
  S.Struct({ NetworkId: S.optional(S.String), MemberId: S.optional(S.String) }),
).annotations({
  identifier: "CreateNetworkOutput",
}) as any as S.Schema<CreateNetworkOutput>;
export interface CreateProposalOutput {
  ProposalId?: string;
}
export const CreateProposalOutput = S.suspend(() =>
  S.Struct({ ProposalId: S.optional(S.String) }),
).annotations({
  identifier: "CreateProposalOutput",
}) as any as S.Schema<CreateProposalOutput>;
export interface MemberFrameworkAttributes {
  Fabric?: MemberFabricAttributes;
}
export const MemberFrameworkAttributes = S.suspend(() =>
  S.Struct({ Fabric: S.optional(MemberFabricAttributes) }),
).annotations({
  identifier: "MemberFrameworkAttributes",
}) as any as S.Schema<MemberFrameworkAttributes>;
export interface NetworkFrameworkAttributes {
  Fabric?: NetworkFabricAttributes;
  Ethereum?: NetworkEthereumAttributes;
}
export const NetworkFrameworkAttributes = S.suspend(() =>
  S.Struct({
    Fabric: S.optional(NetworkFabricAttributes),
    Ethereum: S.optional(NetworkEthereumAttributes),
  }),
).annotations({
  identifier: "NetworkFrameworkAttributes",
}) as any as S.Schema<NetworkFrameworkAttributes>;
export interface NodeFrameworkAttributes {
  Fabric?: NodeFabricAttributes;
  Ethereum?: NodeEthereumAttributes;
}
export const NodeFrameworkAttributes = S.suspend(() =>
  S.Struct({
    Fabric: S.optional(NodeFabricAttributes),
    Ethereum: S.optional(NodeEthereumAttributes),
  }),
).annotations({
  identifier: "NodeFrameworkAttributes",
}) as any as S.Schema<NodeFrameworkAttributes>;
export interface Member {
  NetworkId?: string;
  Id?: string;
  Name?: string;
  Description?: string;
  FrameworkAttributes?: MemberFrameworkAttributes;
  LogPublishingConfiguration?: MemberLogPublishingConfiguration;
  Status?: string;
  CreationDate?: Date;
  Tags?: OutputTagMap;
  Arn?: string;
  KmsKeyArn?: string;
}
export const Member = S.suspend(() =>
  S.Struct({
    NetworkId: S.optional(S.String),
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    FrameworkAttributes: S.optional(MemberFrameworkAttributes),
    LogPublishingConfiguration: S.optional(MemberLogPublishingConfiguration),
    Status: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Tags: S.optional(OutputTagMap),
    Arn: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
  }),
).annotations({ identifier: "Member" }) as any as S.Schema<Member>;
export interface Network {
  Id?: string;
  Name?: string;
  Description?: string;
  Framework?: string;
  FrameworkVersion?: string;
  FrameworkAttributes?: NetworkFrameworkAttributes;
  VpcEndpointServiceName?: string;
  VotingPolicy?: VotingPolicy;
  Status?: string;
  CreationDate?: Date;
  Tags?: OutputTagMap;
  Arn?: string;
}
export const Network = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Framework: S.optional(S.String),
    FrameworkVersion: S.optional(S.String),
    FrameworkAttributes: S.optional(NetworkFrameworkAttributes),
    VpcEndpointServiceName: S.optional(S.String),
    VotingPolicy: S.optional(VotingPolicy),
    Status: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Tags: S.optional(OutputTagMap),
    Arn: S.optional(S.String),
  }),
).annotations({ identifier: "Network" }) as any as S.Schema<Network>;
export interface Node {
  NetworkId?: string;
  MemberId?: string;
  Id?: string;
  InstanceType?: string;
  AvailabilityZone?: string;
  FrameworkAttributes?: NodeFrameworkAttributes;
  LogPublishingConfiguration?: NodeLogPublishingConfiguration;
  StateDB?: string;
  Status?: string;
  CreationDate?: Date;
  Tags?: OutputTagMap;
  Arn?: string;
  KmsKeyArn?: string;
}
export const Node = S.suspend(() =>
  S.Struct({
    NetworkId: S.optional(S.String),
    MemberId: S.optional(S.String),
    Id: S.optional(S.String),
    InstanceType: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    FrameworkAttributes: S.optional(NodeFrameworkAttributes),
    LogPublishingConfiguration: S.optional(NodeLogPublishingConfiguration),
    StateDB: S.optional(S.String),
    Status: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Tags: S.optional(OutputTagMap),
    Arn: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
  }),
).annotations({ identifier: "Node" }) as any as S.Schema<Node>;
export interface CreateMemberOutput {
  MemberId?: string;
}
export const CreateMemberOutput = S.suspend(() =>
  S.Struct({ MemberId: S.optional(S.String) }),
).annotations({
  identifier: "CreateMemberOutput",
}) as any as S.Schema<CreateMemberOutput>;
export interface GetMemberOutput {
  Member?: Member;
}
export const GetMemberOutput = S.suspend(() =>
  S.Struct({ Member: S.optional(Member) }),
).annotations({
  identifier: "GetMemberOutput",
}) as any as S.Schema<GetMemberOutput>;
export interface GetNetworkOutput {
  Network?: Network;
}
export const GetNetworkOutput = S.suspend(() =>
  S.Struct({ Network: S.optional(Network) }),
).annotations({
  identifier: "GetNetworkOutput",
}) as any as S.Schema<GetNetworkOutput>;
export interface GetNodeOutput {
  Node?: Node;
}
export const GetNodeOutput = S.suspend(() =>
  S.Struct({ Node: S.optional(Node) }),
).annotations({
  identifier: "GetNodeOutput",
}) as any as S.Schema<GetNodeOutput>;
export interface UpdateMemberInput {
  NetworkId: string;
  MemberId: string;
  LogPublishingConfiguration?: MemberLogPublishingConfiguration;
}
export const UpdateMemberInput = S.suspend(() =>
  S.Struct({
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    MemberId: S.String.pipe(T.HttpLabel("MemberId")),
    LogPublishingConfiguration: S.optional(MemberLogPublishingConfiguration),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/networks/{NetworkId}/members/{MemberId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMemberInput",
}) as any as S.Schema<UpdateMemberInput>;
export interface UpdateMemberOutput {}
export const UpdateMemberOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateMemberOutput",
}) as any as S.Schema<UpdateMemberOutput>;

//# Errors
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  {},
).pipe(C.withServerError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class IllegalActionException extends S.TaggedError<IllegalActionException>()(
  "IllegalActionException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotReadyException extends S.TaggedError<ResourceNotReadyException>()(
  "ResourceNotReadyException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of the accessors and their properties. Accessor objects are containers that have the
 * information required for token based access to your Ethereum nodes.
 */
export const listAccessors: {
  (
    input: ListAccessorsInput,
  ): Effect.Effect<
    ListAccessorsOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessorsInput,
  ) => Stream.Stream<
    ListAccessorsOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessorsInput,
  ) => Stream.Stream<
    AccessorSummary,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccessorsInput,
  output: ListAccessorsOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Accessors",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of the members in a network and properties of their configurations.
 *
 * Applies only to Hyperledger Fabric.
 */
export const listMembers: {
  (
    input: ListMembersInput,
  ): Effect.Effect<
    ListMembersOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMembersInput,
  ) => Stream.Stream<
    ListMembersOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMembersInput,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMembersInput,
  output: ListMembersOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about the networks in which the current Amazon Web Services account participates.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 */
export const listNetworks: {
  (
    input: ListNetworksInput,
  ): Effect.Effect<
    ListNetworksOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNetworksInput,
  ) => Stream.Stream<
    ListNetworksOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNetworksInput,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNetworksInput,
  output: ListNetworksOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about the nodes within a network.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 */
export const listNodes: {
  (
    input: ListNodesInput,
  ): Effect.Effect<
    ListNodesOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNodesInput,
  ) => Stream.Stream<
    ListNodesOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNodesInput,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNodesInput,
  output: ListNodesOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the list of votes for a specified proposal, including the value of each vote and the unique identifier of the member that cast the vote.
 *
 * Applies only to Hyperledger Fabric.
 */
export const listProposalVotes: {
  (
    input: ListProposalVotesInput,
  ): Effect.Effect<
    ListProposalVotesOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProposalVotesInput,
  ) => Stream.Stream<
    ListProposalVotesOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProposalVotesInput,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProposalVotesInput,
  output: ListProposalVotesOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates a node configuration with new parameters.
 *
 * Applies only to Hyperledger Fabric.
 */
export const updateNode: (
  input: UpdateNodeInput,
) => Effect.Effect<
  UpdateNodeOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNodeInput,
  output: UpdateNodeOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Rejects an invitation to join a network. This action can be called by a principal in an Amazon Web Services account that has received an invitation to create a member and join a network.
 *
 * Applies only to Hyperledger Fabric.
 */
export const rejectInvitation: (
  input: RejectInvitationInput,
) => Effect.Effect<
  RejectInvitationOutput,
  | AccessDeniedException
  | IllegalActionException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectInvitationInput,
  output: RejectInvitationOutput,
  errors: [
    AccessDeniedException,
    IllegalActionException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes an accessor that your Amazon Web Services account owns. An accessor object is a container that has the
 * information required for token based access to your Ethereum nodes including, the
 * `BILLING_TOKEN`. After an accessor is deleted, the status of the accessor changes
 * from `AVAILABLE` to `PENDING_DELETION`. An accessor in the
 * `PENDING_DELETION` state can’t be used for new WebSocket requests or
 * HTTP requests. However, WebSocket connections that were initiated while the accessor was in the
 * `AVAILABLE` state remain open until they expire (up to 2 hours).
 */
export const deleteAccessor: (
  input: DeleteAccessorInput,
) => Effect.Effect<
  DeleteAccessorOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessorInput,
  output: DeleteAccessorOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns detailed information about an accessor. An accessor object is a container that has the
 * information required for token based access to your Ethereum nodes.
 */
export const getAccessor: (
  input: GetAccessorInput,
) => Effect.Effect<
  GetAccessorOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessorInput,
  output: GetAccessorOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns detailed information about a proposal.
 *
 * Applies only to Hyperledger Fabric.
 */
export const getProposal: (
  input: GetProposalInput,
) => Effect.Effect<
  GetProposalOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProposalInput,
  output: GetProposalOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of proposals for the network.
 *
 * Applies only to Hyperledger Fabric.
 */
export const listProposals: {
  (
    input: ListProposalsInput,
  ): Effect.Effect<
    ListProposalsOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProposalsInput,
  ) => Stream.Stream<
    ListProposalsOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProposalsInput,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProposalsInput,
  output: ListProposalsOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Casts a vote for a specified `ProposalId` on behalf of a member. The member to vote as, specified by `VoterMemberId`, must be in the same Amazon Web Services account as the principal that calls the action.
 *
 * Applies only to Hyperledger Fabric.
 */
export const voteOnProposal: (
  input: VoteOnProposalInput,
) => Effect.Effect<
  VoteOnProposalOutput,
  | AccessDeniedException
  | IllegalActionException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VoteOnProposalInput,
  output: VoteOnProposalOutput,
  errors: [
    AccessDeniedException,
    IllegalActionException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of all invitations for the current Amazon Web Services account.
 *
 * Applies only to Hyperledger Fabric.
 */
export const listInvitations: {
  (
    input: ListInvitationsInput,
  ): Effect.Effect<
    ListInvitationsOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceLimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInvitationsInput,
  ) => Stream.Stream<
    ListInvitationsOutput,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceLimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInvitationsInput,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceErrorException
    | InvalidRequestException
    | ResourceLimitExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInvitationsInput,
  output: ListInvitationsOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes a member. Deleting a member removes the member and all associated resources from the network. `DeleteMember` can only be called for a specified `MemberId` if the principal performing the action is associated with the Amazon Web Services account that owns the member. In all other cases, the `DeleteMember` action is carried out as the result of an approved proposal to remove a member. If `MemberId` is the last member in a network specified by the last Amazon Web Services account, the network is deleted also.
 *
 * Applies only to Hyperledger Fabric.
 */
export const deleteMember: (
  input: DeleteMemberInput,
) => Effect.Effect<
  DeleteMemberOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ResourceNotReadyException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMemberInput,
  output: DeleteMemberOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ResourceNotReadyException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a node that your Amazon Web Services account owns. All data on the node is lost and cannot be recovered.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 */
export const deleteNode: (
  input: DeleteNodeInput,
) => Effect.Effect<
  DeleteNodeOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ResourceNotReadyException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNodeInput,
  output: DeleteNodeOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ResourceNotReadyException,
    ThrottlingException,
  ],
}));
/**
 * Removes the specified tags from the Amazon Managed Blockchain resource.
 *
 * For more information about tags, see Tagging Resources in the *Amazon Managed Blockchain Ethereum Developer Guide*, or Tagging Resources in the *Amazon Managed Blockchain Hyperledger Fabric Developer Guide*.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ResourceNotReadyException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ResourceNotReadyException,
  ],
}));
/**
 * Returns a list of tags for the specified resource. Each tag consists of a key and optional value.
 *
 * For more information about tags, see Tagging Resources in the *Amazon Managed Blockchain Ethereum Developer Guide*, or Tagging Resources in the *Amazon Managed Blockchain Hyperledger Fabric Developer Guide*.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ResourceNotReadyException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ResourceNotReadyException,
  ],
}));
/**
 * Returns detailed information about a member.
 *
 * Applies only to Hyperledger Fabric.
 */
export const getMember: (
  input: GetMemberInput,
) => Effect.Effect<
  GetMemberOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMemberInput,
  output: GetMemberOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns detailed information about a network.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 */
export const getNetwork: (
  input: GetNetworkInput,
) => Effect.Effect<
  GetNetworkOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNetworkInput,
  output: GetNetworkOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns detailed information about a node.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 */
export const getNode: (
  input: GetNodeInput,
) => Effect.Effect<
  GetNodeOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNodeInput,
  output: GetNodeOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds or overwrites the specified tags for the specified Amazon Managed Blockchain resource. Each tag consists of a key and optional value.
 *
 * When you specify a tag key that already exists, the tag value is overwritten with the new value. Use `UntagResource` to remove tag keys.
 *
 * A resource can have up to 50 tags. If you try to create more than 50 tags for a resource, your request fails and returns an error.
 *
 * For more information about tags, see Tagging Resources in the *Amazon Managed Blockchain Ethereum Developer Guide*, or Tagging Resources in the *Amazon Managed Blockchain Hyperledger Fabric Developer Guide*.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ResourceNotReadyException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ResourceNotReadyException,
    TooManyTagsException,
  ],
}));
/**
 * Updates a member configuration with new parameters.
 *
 * Applies only to Hyperledger Fabric.
 */
export const updateMember: (
  input: UpdateMemberInput,
) => Effect.Effect<
  UpdateMemberOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMemberInput,
  output: UpdateMemberOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Creates a node on the specified blockchain network.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 */
export const createNode: (
  input: CreateNodeInput,
) => Effect.Effect<
  CreateNodeOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ResourceNotReadyException
  | ThrottlingException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNodeInput,
  output: CreateNodeOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ResourceNotReadyException,
    ThrottlingException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a new accessor for use with Amazon Managed Blockchain service that supports token based access.
 * The accessor contains information required for token based access.
 */
export const createAccessor: (
  input: CreateAccessorInput,
) => Effect.Effect<
  CreateAccessorOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ResourceLimitExceededException
  | ThrottlingException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessorInput,
  output: CreateAccessorOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ResourceLimitExceededException,
    ThrottlingException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a new blockchain network using Amazon Managed Blockchain.
 *
 * Applies only to Hyperledger Fabric.
 */
export const createNetwork: (
  input: CreateNetworkInput,
) => Effect.Effect<
  CreateNetworkOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ResourceLimitExceededException
  | ThrottlingException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNetworkInput,
  output: CreateNetworkOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ResourceLimitExceededException,
    ThrottlingException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a proposal for a change to the network that other members of the network can vote on, for example, a proposal to add a new member to the network. Any member can create a proposal.
 *
 * Applies only to Hyperledger Fabric.
 */
export const createProposal: (
  input: CreateProposalInput,
) => Effect.Effect<
  CreateProposalOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceNotFoundException
  | ResourceNotReadyException
  | ThrottlingException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProposalInput,
  output: CreateProposalOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ResourceNotReadyException,
    ThrottlingException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a member within a Managed Blockchain network.
 *
 * Applies only to Hyperledger Fabric.
 */
export const createMember: (
  input: CreateMemberInput,
) => Effect.Effect<
  CreateMemberOutput,
  | AccessDeniedException
  | InternalServiceErrorException
  | InvalidRequestException
  | ResourceAlreadyExistsException
  | ResourceLimitExceededException
  | ResourceNotFoundException
  | ResourceNotReadyException
  | ThrottlingException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMemberInput,
  output: CreateMemberOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ResourceLimitExceededException,
    ResourceNotFoundException,
    ResourceNotReadyException,
    ThrottlingException,
    TooManyTagsException,
  ],
}));

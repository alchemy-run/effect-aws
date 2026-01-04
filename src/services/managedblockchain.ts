import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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

//# Schemas
export const TagKeyList = S.Array(S.String);
export class DeleteAccessorInput extends S.Class<DeleteAccessorInput>(
  "DeleteAccessorInput",
)(
  { AccessorId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/accessors/{AccessorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAccessorOutput extends S.Class<DeleteAccessorOutput>(
  "DeleteAccessorOutput",
)({}) {}
export class DeleteMemberInput extends S.Class<DeleteMemberInput>(
  "DeleteMemberInput",
)(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    MemberId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteMemberOutput extends S.Class<DeleteMemberOutput>(
  "DeleteMemberOutput",
)({}) {}
export class DeleteNodeInput extends S.Class<DeleteNodeInput>(
  "DeleteNodeInput",
)(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    MemberId: S.optional(S.String).pipe(T.HttpQuery("memberId")),
    NodeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/networks/{NetworkId}/nodes/{NodeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNodeOutput extends S.Class<DeleteNodeOutput>(
  "DeleteNodeOutput",
)({}) {}
export class GetAccessorInput extends S.Class<GetAccessorInput>(
  "GetAccessorInput",
)(
  { AccessorId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/accessors/{AccessorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMemberInput extends S.Class<GetMemberInput>("GetMemberInput")(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    MemberId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{NetworkId}/members/{MemberId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNetworkInput extends S.Class<GetNetworkInput>(
  "GetNetworkInput",
)(
  { NetworkId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{NetworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetNodeInput extends S.Class<GetNodeInput>("GetNodeInput")(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    MemberId: S.optional(S.String).pipe(T.HttpQuery("memberId")),
    NodeId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{NetworkId}/nodes/{NodeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetProposalInput extends S.Class<GetProposalInput>(
  "GetProposalInput",
)(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    ProposalId: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class ListAccessorsInput extends S.Class<ListAccessorsInput>(
  "ListAccessorsInput",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    NetworkType: S.optional(S.String).pipe(T.HttpQuery("networkType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/accessors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInvitationsInput extends S.Class<ListInvitationsInput>(
  "ListInvitationsInput",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/invitations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMembersInput extends S.Class<ListMembersInput>(
  "ListMembersInput",
)(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    Name: S.optional(S.String).pipe(T.HttpQuery("name")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    IsOwned: S.optional(S.Boolean).pipe(T.HttpQuery("isOwned")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{NetworkId}/members" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNetworksInput extends S.Class<ListNetworksInput>(
  "ListNetworksInput",
)(
  {
    Name: S.optional(S.String).pipe(T.HttpQuery("name")),
    Framework: S.optional(S.String).pipe(T.HttpQuery("framework")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNodesInput extends S.Class<ListNodesInput>("ListNodesInput")(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    MemberId: S.optional(S.String).pipe(T.HttpQuery("memberId")),
    Status: S.optional(S.String).pipe(T.HttpQuery("status")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{NetworkId}/nodes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProposalsInput extends S.Class<ListProposalsInput>(
  "ListProposalsInput",
)(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/networks/{NetworkId}/proposals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListProposalVotesInput extends S.Class<ListProposalVotesInput>(
  "ListProposalVotesInput",
)(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    ProposalId: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
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
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectInvitationInput extends S.Class<RejectInvitationInput>(
  "RejectInvitationInput",
)(
  { InvitationId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/invitations/{InvitationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectInvitationOutput extends S.Class<RejectInvitationOutput>(
  "RejectInvitationOutput",
)({}) {}
export const InputTagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: InputTagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class VoteOnProposalInput extends S.Class<VoteOnProposalInput>(
  "VoteOnProposalInput",
)(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    ProposalId: S.String.pipe(T.HttpLabel()),
    VoterMemberId: S.String,
    Vote: S.String,
  },
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
) {}
export class VoteOnProposalOutput extends S.Class<VoteOnProposalOutput>(
  "VoteOnProposalOutput",
)({}) {}
export class LogConfiguration extends S.Class<LogConfiguration>(
  "LogConfiguration",
)({ Enabled: S.optional(S.Boolean) }) {}
export class LogConfigurations extends S.Class<LogConfigurations>(
  "LogConfigurations",
)({ Cloudwatch: S.optional(LogConfiguration) }) {}
export class NodeFabricLogPublishingConfiguration extends S.Class<NodeFabricLogPublishingConfiguration>(
  "NodeFabricLogPublishingConfiguration",
)({
  ChaincodeLogs: S.optional(LogConfigurations),
  PeerLogs: S.optional(LogConfigurations),
}) {}
export class NodeLogPublishingConfiguration extends S.Class<NodeLogPublishingConfiguration>(
  "NodeLogPublishingConfiguration",
)({ Fabric: S.optional(NodeFabricLogPublishingConfiguration) }) {}
export class NodeConfiguration extends S.Class<NodeConfiguration>(
  "NodeConfiguration",
)({
  InstanceType: S.String,
  AvailabilityZone: S.optional(S.String),
  LogPublishingConfiguration: S.optional(NodeLogPublishingConfiguration),
  StateDB: S.optional(S.String),
}) {}
export class CreateAccessorInput extends S.Class<CreateAccessorInput>(
  "CreateAccessorInput",
)(
  {
    ClientRequestToken: S.String,
    AccessorType: S.String,
    Tags: S.optional(InputTagMap),
    NetworkType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accessors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNodeInput extends S.Class<CreateNodeInput>(
  "CreateNodeInput",
)(
  {
    ClientRequestToken: S.String,
    NetworkId: S.String.pipe(T.HttpLabel()),
    MemberId: S.optional(S.String),
    NodeConfiguration: NodeConfiguration,
    Tags: S.optional(InputTagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks/{NetworkId}/nodes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class NetworkFabricConfiguration extends S.Class<NetworkFabricConfiguration>(
  "NetworkFabricConfiguration",
)({ Edition: S.String }) {}
export class ApprovalThresholdPolicy extends S.Class<ApprovalThresholdPolicy>(
  "ApprovalThresholdPolicy",
)({
  ThresholdPercentage: S.optional(S.Number),
  ProposalDurationInHours: S.optional(S.Number),
  ThresholdComparator: S.optional(S.String),
}) {}
export class InviteAction extends S.Class<InviteAction>("InviteAction")({
  Principal: S.String,
}) {}
export const InviteActionList = S.Array(InviteAction);
export class RemoveAction extends S.Class<RemoveAction>("RemoveAction")({
  MemberId: S.String,
}) {}
export const RemoveActionList = S.Array(RemoveAction);
export class NetworkFrameworkConfiguration extends S.Class<NetworkFrameworkConfiguration>(
  "NetworkFrameworkConfiguration",
)({ Fabric: S.optional(NetworkFabricConfiguration) }) {}
export class VotingPolicy extends S.Class<VotingPolicy>("VotingPolicy")({
  ApprovalThresholdPolicy: S.optional(ApprovalThresholdPolicy),
}) {}
export class ProposalActions extends S.Class<ProposalActions>(
  "ProposalActions",
)({
  Invitations: S.optional(InviteActionList),
  Removals: S.optional(RemoveActionList),
}) {}
export const OutputTagMap = S.Record({ key: S.String, value: S.String });
export class Accessor extends S.Class<Accessor>("Accessor")({
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  BillingToken: S.optional(S.String),
  Status: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Arn: S.optional(S.String),
  Tags: S.optional(OutputTagMap),
  NetworkType: S.optional(S.String),
}) {}
export class Proposal extends S.Class<Proposal>("Proposal")({
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
}) {}
export class AccessorSummary extends S.Class<AccessorSummary>(
  "AccessorSummary",
)({
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  Status: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Arn: S.optional(S.String),
  NetworkType: S.optional(S.String),
}) {}
export const AccessorSummaryList = S.Array(AccessorSummary);
export class NetworkSummary extends S.Class<NetworkSummary>("NetworkSummary")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Framework: S.optional(S.String),
  FrameworkVersion: S.optional(S.String),
  Status: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Arn: S.optional(S.String),
}) {}
export class Invitation extends S.Class<Invitation>("Invitation")({
  InvitationId: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Status: S.optional(S.String),
  NetworkSummary: S.optional(NetworkSummary),
  Arn: S.optional(S.String),
}) {}
export const InvitationList = S.Array(Invitation);
export class MemberSummary extends S.Class<MemberSummary>("MemberSummary")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  IsOwned: S.optional(S.Boolean),
  Arn: S.optional(S.String),
}) {}
export const MemberSummaryList = S.Array(MemberSummary);
export const NetworkSummaryList = S.Array(NetworkSummary);
export class NodeSummary extends S.Class<NodeSummary>("NodeSummary")({
  Id: S.optional(S.String),
  Status: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  AvailabilityZone: S.optional(S.String),
  InstanceType: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export const NodeSummaryList = S.Array(NodeSummary);
export class ProposalSummary extends S.Class<ProposalSummary>(
  "ProposalSummary",
)({
  ProposalId: S.optional(S.String),
  Description: S.optional(S.String),
  ProposedByMemberId: S.optional(S.String),
  ProposedByMemberName: S.optional(S.String),
  Status: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Arn: S.optional(S.String),
}) {}
export const ProposalSummaryList = S.Array(ProposalSummary);
export class VoteSummary extends S.Class<VoteSummary>("VoteSummary")({
  Vote: S.optional(S.String),
  MemberName: S.optional(S.String),
  MemberId: S.optional(S.String),
}) {}
export const ProposalVoteList = S.Array(VoteSummary);
export class MemberFabricConfiguration extends S.Class<MemberFabricConfiguration>(
  "MemberFabricConfiguration",
)({ AdminUsername: S.String, AdminPassword: S.String }) {}
export class CreateAccessorOutput extends S.Class<CreateAccessorOutput>(
  "CreateAccessorOutput",
)({
  AccessorId: S.optional(S.String),
  BillingToken: S.optional(S.String),
  NetworkType: S.optional(S.String),
}) {}
export class MemberFrameworkConfiguration extends S.Class<MemberFrameworkConfiguration>(
  "MemberFrameworkConfiguration",
)({ Fabric: S.optional(MemberFabricConfiguration) }) {}
export class MemberFabricLogPublishingConfiguration extends S.Class<MemberFabricLogPublishingConfiguration>(
  "MemberFabricLogPublishingConfiguration",
)({ CaLogs: S.optional(LogConfigurations) }) {}
export class MemberLogPublishingConfiguration extends S.Class<MemberLogPublishingConfiguration>(
  "MemberLogPublishingConfiguration",
)({ Fabric: S.optional(MemberFabricLogPublishingConfiguration) }) {}
export class MemberConfiguration extends S.Class<MemberConfiguration>(
  "MemberConfiguration",
)({
  Name: S.String,
  Description: S.optional(S.String),
  FrameworkConfiguration: MemberFrameworkConfiguration,
  LogPublishingConfiguration: S.optional(MemberLogPublishingConfiguration),
  Tags: S.optional(InputTagMap),
  KmsKeyArn: S.optional(S.String),
}) {}
export class CreateNetworkInput extends S.Class<CreateNetworkInput>(
  "CreateNetworkInput",
)(
  {
    ClientRequestToken: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    Framework: S.String,
    FrameworkVersion: S.String,
    FrameworkConfiguration: S.optional(NetworkFrameworkConfiguration),
    VotingPolicy: VotingPolicy,
    MemberConfiguration: MemberConfiguration,
    Tags: S.optional(InputTagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNodeOutput extends S.Class<CreateNodeOutput>(
  "CreateNodeOutput",
)({ NodeId: S.optional(S.String) }) {}
export class CreateProposalInput extends S.Class<CreateProposalInput>(
  "CreateProposalInput",
)(
  {
    ClientRequestToken: S.String,
    NetworkId: S.String.pipe(T.HttpLabel()),
    MemberId: S.String,
    Actions: ProposalActions,
    Description: S.optional(S.String),
    Tags: S.optional(InputTagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks/{NetworkId}/proposals" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAccessorOutput extends S.Class<GetAccessorOutput>(
  "GetAccessorOutput",
)({ Accessor: S.optional(Accessor) }) {}
export class GetProposalOutput extends S.Class<GetProposalOutput>(
  "GetProposalOutput",
)({ Proposal: S.optional(Proposal) }) {}
export class ListAccessorsOutput extends S.Class<ListAccessorsOutput>(
  "ListAccessorsOutput",
)({
  Accessors: S.optional(AccessorSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListInvitationsOutput extends S.Class<ListInvitationsOutput>(
  "ListInvitationsOutput",
)({
  Invitations: S.optional(InvitationList),
  NextToken: S.optional(S.String),
}) {}
export class ListMembersOutput extends S.Class<ListMembersOutput>(
  "ListMembersOutput",
)({
  Members: S.optional(MemberSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListNetworksOutput extends S.Class<ListNetworksOutput>(
  "ListNetworksOutput",
)({
  Networks: S.optional(NetworkSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListNodesOutput extends S.Class<ListNodesOutput>(
  "ListNodesOutput",
)({ Nodes: S.optional(NodeSummaryList), NextToken: S.optional(S.String) }) {}
export class ListProposalsOutput extends S.Class<ListProposalsOutput>(
  "ListProposalsOutput",
)({
  Proposals: S.optional(ProposalSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListProposalVotesOutput extends S.Class<ListProposalVotesOutput>(
  "ListProposalVotesOutput",
)({
  ProposalVotes: S.optional(ProposalVoteList),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(OutputTagMap) }) {}
export class UpdateNodeInput extends S.Class<UpdateNodeInput>(
  "UpdateNodeInput",
)(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    MemberId: S.optional(S.String),
    NodeId: S.String.pipe(T.HttpLabel()),
    LogPublishingConfiguration: S.optional(NodeLogPublishingConfiguration),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/networks/{NetworkId}/nodes/{NodeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNodeOutput extends S.Class<UpdateNodeOutput>(
  "UpdateNodeOutput",
)({}) {}
export class MemberFabricAttributes extends S.Class<MemberFabricAttributes>(
  "MemberFabricAttributes",
)({ AdminUsername: S.optional(S.String), CaEndpoint: S.optional(S.String) }) {}
export class NetworkFabricAttributes extends S.Class<NetworkFabricAttributes>(
  "NetworkFabricAttributes",
)({
  OrderingServiceEndpoint: S.optional(S.String),
  Edition: S.optional(S.String),
}) {}
export class NetworkEthereumAttributes extends S.Class<NetworkEthereumAttributes>(
  "NetworkEthereumAttributes",
)({ ChainId: S.optional(S.String) }) {}
export class NodeFabricAttributes extends S.Class<NodeFabricAttributes>(
  "NodeFabricAttributes",
)({
  PeerEndpoint: S.optional(S.String),
  PeerEventEndpoint: S.optional(S.String),
}) {}
export class NodeEthereumAttributes extends S.Class<NodeEthereumAttributes>(
  "NodeEthereumAttributes",
)({
  HttpEndpoint: S.optional(S.String),
  WebSocketEndpoint: S.optional(S.String),
}) {}
export class CreateMemberInput extends S.Class<CreateMemberInput>(
  "CreateMemberInput",
)(
  {
    ClientRequestToken: S.String,
    InvitationId: S.String,
    NetworkId: S.String.pipe(T.HttpLabel()),
    MemberConfiguration: MemberConfiguration,
  },
  T.all(
    T.Http({ method: "POST", uri: "/networks/{NetworkId}/members" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNetworkOutput extends S.Class<CreateNetworkOutput>(
  "CreateNetworkOutput",
)({ NetworkId: S.optional(S.String), MemberId: S.optional(S.String) }) {}
export class CreateProposalOutput extends S.Class<CreateProposalOutput>(
  "CreateProposalOutput",
)({ ProposalId: S.optional(S.String) }) {}
export class MemberFrameworkAttributes extends S.Class<MemberFrameworkAttributes>(
  "MemberFrameworkAttributes",
)({ Fabric: S.optional(MemberFabricAttributes) }) {}
export class NetworkFrameworkAttributes extends S.Class<NetworkFrameworkAttributes>(
  "NetworkFrameworkAttributes",
)({
  Fabric: S.optional(NetworkFabricAttributes),
  Ethereum: S.optional(NetworkEthereumAttributes),
}) {}
export class NodeFrameworkAttributes extends S.Class<NodeFrameworkAttributes>(
  "NodeFrameworkAttributes",
)({
  Fabric: S.optional(NodeFabricAttributes),
  Ethereum: S.optional(NodeEthereumAttributes),
}) {}
export class Member extends S.Class<Member>("Member")({
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
}) {}
export class Network extends S.Class<Network>("Network")({
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
}) {}
export class Node extends S.Class<Node>("Node")({
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
}) {}
export class CreateMemberOutput extends S.Class<CreateMemberOutput>(
  "CreateMemberOutput",
)({ MemberId: S.optional(S.String) }) {}
export class GetMemberOutput extends S.Class<GetMemberOutput>(
  "GetMemberOutput",
)({ Member: S.optional(Member) }) {}
export class GetNetworkOutput extends S.Class<GetNetworkOutput>(
  "GetNetworkOutput",
)({ Network: S.optional(Network) }) {}
export class GetNodeOutput extends S.Class<GetNodeOutput>("GetNodeOutput")({
  Node: S.optional(Node),
}) {}
export class UpdateMemberInput extends S.Class<UpdateMemberInput>(
  "UpdateMemberInput",
)(
  {
    NetworkId: S.String.pipe(T.HttpLabel()),
    MemberId: S.String.pipe(T.HttpLabel()),
    LogPublishingConfiguration: S.optional(MemberLogPublishingConfiguration),
  },
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
) {}
export class UpdateMemberOutput extends S.Class<UpdateMemberOutput>(
  "UpdateMemberOutput",
)({}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ResourceNotReadyException extends S.TaggedError<ResourceNotReadyException>()(
  "ResourceNotReadyException",
  {},
) {}
export class IllegalActionException extends S.TaggedError<IllegalActionException>()(
  "IllegalActionException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  {},
) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes the specified tags from the Amazon Managed Blockchain resource.
 *
 * For more information about tags, see Tagging Resources in the *Amazon Managed Blockchain Ethereum Developer Guide*, or Tagging Resources in the *Amazon Managed Blockchain Hyperledger Fabric Developer Guide*.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Casts a vote for a specified `ProposalId` on behalf of a member. The member to vote as, specified by `VoterMemberId`, must be in the same Amazon Web Services account as the principal that calls the action.
 *
 * Applies only to Hyperledger Fabric.
 */
export const voteOnProposal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an accessor that your Amazon Web Services account owns. An accessor object is a container that has the
 * information required for token based access to your Ethereum nodes including, the
 * `BILLING_TOKEN`. After an accessor is deleted, the status of the accessor changes
 * from `AVAILABLE` to `PENDING_DELETION`. An accessor in the
 * `PENDING_DELETION` state can’t be used for new WebSocket requests or
 * HTTP requests. However, WebSocket connections that were initiated while the accessor was in the
 * `AVAILABLE` state remain open until they expire (up to 2 hours).
 */
export const deleteAccessor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a member. Deleting a member removes the member and all associated resources from the network. `DeleteMember` can only be called for a specified `MemberId` if the principal performing the action is associated with the Amazon Web Services account that owns the member. In all other cases, the `DeleteMember` action is carried out as the result of an approved proposal to remove a member. If `MemberId` is the last member in a network specified by the last Amazon Web Services account, the network is deleted also.
 *
 * Applies only to Hyperledger Fabric.
 */
export const deleteMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Rejects an invitation to join a network. This action can be called by a principal in an Amazon Web Services account that has received an invitation to create a member and join a network.
 *
 * Applies only to Hyperledger Fabric.
 */
export const rejectInvitation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns detailed information about an accessor. An accessor object is a container that has the
 * information required for token based access to your Ethereum nodes.
 */
export const getAccessor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getProposal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of the accessors and their properties. Accessor objects are containers that have the
 * information required for token based access to your Ethereum nodes.
 */
export const listAccessors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccessorsInput,
  output: ListAccessorsOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of all invitations for the current Amazon Web Services account.
 *
 * Applies only to Hyperledger Fabric.
 */
export const listInvitations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a list of the members in a network and properties of their configurations.
 *
 * Applies only to Hyperledger Fabric.
 */
export const listMembers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMembersInput,
  output: ListMembersOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Returns information about the networks in which the current Amazon Web Services account participates.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 */
export const listNetworks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNetworksInput,
  output: ListNetworksOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Returns information about the nodes within a network.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 */
export const listNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNodesInput,
  output: ListNodesOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of proposals for the network.
 *
 * Applies only to Hyperledger Fabric.
 */
export const listProposals = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProposalsInput,
  output: ListProposalsOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Returns the list of votes for a specified proposal, including the value of each vote and the unique identifier of the member that cast the vote.
 *
 * Applies only to Hyperledger Fabric.
 */
export const listProposalVotes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProposalVotesInput,
  output: ListProposalVotesOutput,
  errors: [
    AccessDeniedException,
    InternalServiceErrorException,
    InvalidRequestException,
    ThrottlingException,
  ],
}));
/**
 * Returns a list of tags for the specified resource. Each tag consists of a key and optional value.
 *
 * For more information about tags, see Tagging Resources in the *Amazon Managed Blockchain Ethereum Developer Guide*, or Tagging Resources in the *Amazon Managed Blockchain Hyperledger Fabric Developer Guide*.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds or overwrites the specified tags for the specified Amazon Managed Blockchain resource. Each tag consists of a key and optional value.
 *
 * When you specify a tag key that already exists, the tag value is overwritten with the new value. Use `UntagResource` to remove tag keys.
 *
 * A resource can have up to 50 tags. If you try to create more than 50 tags for a resource, your request fails and returns an error.
 *
 * For more information about tags, see Tagging Resources in the *Amazon Managed Blockchain Ethereum Developer Guide*, or Tagging Resources in the *Amazon Managed Blockchain Hyperledger Fabric Developer Guide*.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates a node configuration with new parameters.
 *
 * Applies only to Hyperledger Fabric.
 */
export const updateNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new accessor for use with Amazon Managed Blockchain service that supports token based access.
 * The accessor contains information required for token based access.
 */
export const createAccessor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a node on the specified blockchain network.
 *
 * Applies to Hyperledger Fabric and Ethereum.
 */
export const createNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a proposal for a change to the network that other members of the network can vote on, for example, a proposal to add a new member to the network. Any member can create a proposal.
 *
 * Applies only to Hyperledger Fabric.
 */
export const createProposal = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
/**
 * Returns detailed information about a member.
 *
 * Applies only to Hyperledger Fabric.
 */
export const getMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates a member configuration with new parameters.
 *
 * Applies only to Hyperledger Fabric.
 */
export const updateMember = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

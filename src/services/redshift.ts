import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://redshift.amazonaws.com/doc/2012-12-01/");
const svc = T.AwsApiService({
  sdkId: "Redshift",
  serviceShapeName: "RedshiftServiceVersion20121201",
});
const auth = T.AwsAuthSigv4({ name: "redshift" });
const ver = T.ServiceVersion("2012-12-01");
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
                        url: "https://redshift-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://redshift.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://redshift-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://redshift.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://redshift.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeStorageRequest extends S.Class<DescribeStorageRequest>(
  "DescribeStorageRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const VpcIdentifierList = S.Array(
  S.String.pipe(T.XmlName("VpcIdentifier")),
);
export class DeleteClusterSnapshotMessage extends S.Class<DeleteClusterSnapshotMessage>(
  "DeleteClusterSnapshotMessage",
)(
  {
    SnapshotIdentifier: S.String,
    SnapshotClusterIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const DeleteClusterSnapshotMessageList = S.Array(
  DeleteClusterSnapshotMessage.pipe(T.XmlName("DeleteClusterSnapshotMessage")),
);
export const SnapshotIdentifierList = S.Array(
  S.String.pipe(T.XmlName("String")),
);
export const ClusterSecurityGroupNameList = S.Array(
  S.String.pipe(T.XmlName("ClusterSecurityGroupName")),
);
export const VpcSecurityGroupIdList = S.Array(
  S.String.pipe(T.XmlName("VpcSecurityGroupId")),
);
export const IamRoleArnList = S.Array(S.String.pipe(T.XmlName("IamRoleArn")));
export const SubnetIdentifierList = S.Array(
  S.String.pipe(T.XmlName("SubnetIdentifier")),
);
export const SourceIdsList = S.Array(S.String.pipe(T.XmlName("SourceId")));
export const EventCategoriesList = S.Array(
  S.String.pipe(T.XmlName("EventCategory")),
);
export const TagKeyList = S.Array(S.String.pipe(T.XmlName("TagKey")));
export const ScheduleDefinitionList = S.Array(
  S.String.pipe(T.XmlName("ScheduleDefinition")),
);
export const ConsumerIdentifierList = S.Array(S.String);
export const AttributeNameList = S.Array(
  S.String.pipe(T.XmlName("AttributeName")),
);
export const TagValueList = S.Array(S.String.pipe(T.XmlName("TagValue")));
export const LogTypeList = S.Array(S.String);
export const DbGroupList = S.Array(S.String.pipe(T.XmlName("DbGroup")));
export const ClusterIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ClusterIdentifier")),
);
export class AcceptReservedNodeExchangeInputMessage extends S.Class<AcceptReservedNodeExchangeInputMessage>(
  "AcceptReservedNodeExchangeInputMessage",
)(
  { ReservedNodeId: S.String, TargetReservedNodeOfferingId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PartnerIntegrationInputMessage extends S.Class<PartnerIntegrationInputMessage>(
  "PartnerIntegrationInputMessage",
)(
  {
    AccountId: S.String,
    ClusterIdentifier: S.String,
    DatabaseName: S.String,
    PartnerName: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateDataShareConsumerMessage extends S.Class<AssociateDataShareConsumerMessage>(
  "AssociateDataShareConsumerMessage",
)(
  {
    DataShareArn: S.String,
    AssociateEntireAccount: S.optional(S.Boolean),
    ConsumerArn: S.optional(S.String),
    ConsumerRegion: S.optional(S.String),
    AllowWrites: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AuthorizeClusterSecurityGroupIngressMessage extends S.Class<AuthorizeClusterSecurityGroupIngressMessage>(
  "AuthorizeClusterSecurityGroupIngressMessage",
)(
  {
    ClusterSecurityGroupName: S.String,
    CIDRIP: S.optional(S.String),
    EC2SecurityGroupName: S.optional(S.String),
    EC2SecurityGroupOwnerId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AuthorizeDataShareMessage extends S.Class<AuthorizeDataShareMessage>(
  "AuthorizeDataShareMessage",
)(
  {
    DataShareArn: S.String,
    ConsumerIdentifier: S.String,
    AllowWrites: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AuthorizeEndpointAccessMessage extends S.Class<AuthorizeEndpointAccessMessage>(
  "AuthorizeEndpointAccessMessage",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    Account: S.String,
    VpcIds: S.optional(VpcIdentifierList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AuthorizeSnapshotAccessMessage extends S.Class<AuthorizeSnapshotAccessMessage>(
  "AuthorizeSnapshotAccessMessage",
)(
  {
    SnapshotIdentifier: S.optional(S.String),
    SnapshotArn: S.optional(S.String),
    SnapshotClusterIdentifier: S.optional(S.String),
    AccountWithRestoreAccess: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDeleteClusterSnapshotsRequest extends S.Class<BatchDeleteClusterSnapshotsRequest>(
  "BatchDeleteClusterSnapshotsRequest",
)(
  { Identifiers: DeleteClusterSnapshotMessageList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchModifyClusterSnapshotsMessage extends S.Class<BatchModifyClusterSnapshotsMessage>(
  "BatchModifyClusterSnapshotsMessage",
)(
  {
    SnapshotIdentifierList: SnapshotIdentifierList,
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    Force: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelResizeMessage extends S.Class<CancelResizeMessage>(
  "CancelResizeMessage",
)(
  { ClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CopyClusterSnapshotMessage extends S.Class<CopyClusterSnapshotMessage>(
  "CopyClusterSnapshotMessage",
)(
  {
    SourceSnapshotIdentifier: S.String,
    SourceSnapshotClusterIdentifier: S.optional(S.String),
    TargetSnapshotIdentifier: S.String,
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAuthenticationProfileMessage extends S.Class<CreateAuthenticationProfileMessage>(
  "CreateAuthenticationProfileMessage",
)(
  {
    AuthenticationProfileName: S.String,
    AuthenticationProfileContent: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag.pipe(T.XmlName("Tag")));
export class CreateClusterParameterGroupMessage extends S.Class<CreateClusterParameterGroupMessage>(
  "CreateClusterParameterGroupMessage",
)(
  {
    ParameterGroupName: S.String,
    ParameterGroupFamily: S.String,
    Description: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateClusterSecurityGroupMessage extends S.Class<CreateClusterSecurityGroupMessage>(
  "CreateClusterSecurityGroupMessage",
)(
  {
    ClusterSecurityGroupName: S.String,
    Description: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateClusterSnapshotMessage extends S.Class<CreateClusterSnapshotMessage>(
  "CreateClusterSnapshotMessage",
)(
  {
    SnapshotIdentifier: S.String,
    ClusterIdentifier: S.String,
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateClusterSubnetGroupMessage extends S.Class<CreateClusterSubnetGroupMessage>(
  "CreateClusterSubnetGroupMessage",
)(
  {
    ClusterSubnetGroupName: S.String,
    Description: S.String,
    SubnetIds: SubnetIdentifierList,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCustomDomainAssociationMessage extends S.Class<CreateCustomDomainAssociationMessage>(
  "CreateCustomDomainAssociationMessage",
)(
  {
    CustomDomainName: S.String,
    CustomDomainCertificateArn: S.String,
    ClusterIdentifier: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEndpointAccessMessage extends S.Class<CreateEndpointAccessMessage>(
  "CreateEndpointAccessMessage",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    EndpointName: S.String,
    SubnetGroupName: S.String,
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEventSubscriptionMessage extends S.Class<CreateEventSubscriptionMessage>(
  "CreateEventSubscriptionMessage",
)(
  {
    SubscriptionName: S.String,
    SnsTopicArn: S.String,
    SourceType: S.optional(S.String),
    SourceIds: S.optional(SourceIdsList),
    EventCategories: S.optional(EventCategoriesList),
    Severity: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateHsmClientCertificateMessage extends S.Class<CreateHsmClientCertificateMessage>(
  "CreateHsmClientCertificateMessage",
)(
  { HsmClientCertificateIdentifier: S.String, Tags: S.optional(TagList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateHsmConfigurationMessage extends S.Class<CreateHsmConfigurationMessage>(
  "CreateHsmConfigurationMessage",
)(
  {
    HsmConfigurationIdentifier: S.String,
    Description: S.String,
    HsmIpAddress: S.String,
    HsmPartitionName: S.String,
    HsmPartitionPassword: S.String,
    HsmServerPublicCertificate: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSnapshotCopyGrantMessage extends S.Class<CreateSnapshotCopyGrantMessage>(
  "CreateSnapshotCopyGrantMessage",
)(
  {
    SnapshotCopyGrantName: S.String,
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSnapshotScheduleMessage extends S.Class<CreateSnapshotScheduleMessage>(
  "CreateSnapshotScheduleMessage",
)(
  {
    ScheduleDefinitions: S.optional(ScheduleDefinitionList),
    ScheduleIdentifier: S.optional(S.String),
    ScheduleDescription: S.optional(S.String),
    Tags: S.optional(TagList),
    DryRun: S.optional(S.Boolean),
    NextInvocations: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTagsMessage extends S.Class<CreateTagsMessage>(
  "CreateTagsMessage",
)(
  { ResourceName: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTagsResponse extends S.Class<CreateTagsResponse>(
  "CreateTagsResponse",
)({}, ns) {}
export class CreateUsageLimitMessage extends S.Class<CreateUsageLimitMessage>(
  "CreateUsageLimitMessage",
)(
  {
    ClusterIdentifier: S.String,
    FeatureType: S.String,
    LimitType: S.String,
    Amount: S.Number,
    Period: S.optional(S.String),
    BreachAction: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeauthorizeDataShareMessage extends S.Class<DeauthorizeDataShareMessage>(
  "DeauthorizeDataShareMessage",
)(
  { DataShareArn: S.String, ConsumerIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAuthenticationProfileMessage extends S.Class<DeleteAuthenticationProfileMessage>(
  "DeleteAuthenticationProfileMessage",
)(
  { AuthenticationProfileName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterMessage extends S.Class<DeleteClusterMessage>(
  "DeleteClusterMessage",
)(
  {
    ClusterIdentifier: S.String,
    SkipFinalClusterSnapshot: S.optional(S.Boolean),
    FinalClusterSnapshotIdentifier: S.optional(S.String),
    FinalClusterSnapshotRetentionPeriod: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterParameterGroupMessage extends S.Class<DeleteClusterParameterGroupMessage>(
  "DeleteClusterParameterGroupMessage",
)(
  { ParameterGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterParameterGroupResponse extends S.Class<DeleteClusterParameterGroupResponse>(
  "DeleteClusterParameterGroupResponse",
)({}, ns) {}
export class DeleteClusterSecurityGroupMessage extends S.Class<DeleteClusterSecurityGroupMessage>(
  "DeleteClusterSecurityGroupMessage",
)(
  { ClusterSecurityGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterSecurityGroupResponse extends S.Class<DeleteClusterSecurityGroupResponse>(
  "DeleteClusterSecurityGroupResponse",
)({}, ns) {}
export class DeleteClusterSubnetGroupMessage extends S.Class<DeleteClusterSubnetGroupMessage>(
  "DeleteClusterSubnetGroupMessage",
)(
  { ClusterSubnetGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterSubnetGroupResponse extends S.Class<DeleteClusterSubnetGroupResponse>(
  "DeleteClusterSubnetGroupResponse",
)({}, ns) {}
export class DeleteCustomDomainAssociationMessage extends S.Class<DeleteCustomDomainAssociationMessage>(
  "DeleteCustomDomainAssociationMessage",
)(
  { ClusterIdentifier: S.String, CustomDomainName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCustomDomainAssociationResponse extends S.Class<DeleteCustomDomainAssociationResponse>(
  "DeleteCustomDomainAssociationResponse",
)({}, ns) {}
export class DeleteEndpointAccessMessage extends S.Class<DeleteEndpointAccessMessage>(
  "DeleteEndpointAccessMessage",
)(
  { EndpointName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEventSubscriptionMessage extends S.Class<DeleteEventSubscriptionMessage>(
  "DeleteEventSubscriptionMessage",
)(
  { SubscriptionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEventSubscriptionResponse extends S.Class<DeleteEventSubscriptionResponse>(
  "DeleteEventSubscriptionResponse",
)({}, ns) {}
export class DeleteHsmClientCertificateMessage extends S.Class<DeleteHsmClientCertificateMessage>(
  "DeleteHsmClientCertificateMessage",
)(
  { HsmClientCertificateIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHsmClientCertificateResponse extends S.Class<DeleteHsmClientCertificateResponse>(
  "DeleteHsmClientCertificateResponse",
)({}, ns) {}
export class DeleteHsmConfigurationMessage extends S.Class<DeleteHsmConfigurationMessage>(
  "DeleteHsmConfigurationMessage",
)(
  { HsmConfigurationIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHsmConfigurationResponse extends S.Class<DeleteHsmConfigurationResponse>(
  "DeleteHsmConfigurationResponse",
)({}, ns) {}
export class DeleteIntegrationMessage extends S.Class<DeleteIntegrationMessage>(
  "DeleteIntegrationMessage",
)(
  { IntegrationArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PartnerIntegrationOutputMessage extends S.Class<PartnerIntegrationOutputMessage>(
  "PartnerIntegrationOutputMessage",
)(
  { DatabaseName: S.optional(S.String), PartnerName: S.optional(S.String) },
  ns,
) {}
export class DeleteRedshiftIdcApplicationMessage extends S.Class<DeleteRedshiftIdcApplicationMessage>(
  "DeleteRedshiftIdcApplicationMessage",
)(
  { RedshiftIdcApplicationArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRedshiftIdcApplicationResponse extends S.Class<DeleteRedshiftIdcApplicationResponse>(
  "DeleteRedshiftIdcApplicationResponse",
)({}, ns) {}
export class DeleteResourcePolicyMessage extends S.Class<DeleteResourcePolicyMessage>(
  "DeleteResourcePolicyMessage",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}, ns) {}
export class DeleteScheduledActionMessage extends S.Class<DeleteScheduledActionMessage>(
  "DeleteScheduledActionMessage",
)(
  { ScheduledActionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScheduledActionResponse extends S.Class<DeleteScheduledActionResponse>(
  "DeleteScheduledActionResponse",
)({}, ns) {}
export class DeleteSnapshotCopyGrantMessage extends S.Class<DeleteSnapshotCopyGrantMessage>(
  "DeleteSnapshotCopyGrantMessage",
)(
  { SnapshotCopyGrantName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSnapshotCopyGrantResponse extends S.Class<DeleteSnapshotCopyGrantResponse>(
  "DeleteSnapshotCopyGrantResponse",
)({}, ns) {}
export class DeleteSnapshotScheduleMessage extends S.Class<DeleteSnapshotScheduleMessage>(
  "DeleteSnapshotScheduleMessage",
)(
  { ScheduleIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSnapshotScheduleResponse extends S.Class<DeleteSnapshotScheduleResponse>(
  "DeleteSnapshotScheduleResponse",
)({}, ns) {}
export class DeleteTagsMessage extends S.Class<DeleteTagsMessage>(
  "DeleteTagsMessage",
)(
  { ResourceName: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTagsResponse extends S.Class<DeleteTagsResponse>(
  "DeleteTagsResponse",
)({}, ns) {}
export class DeleteUsageLimitMessage extends S.Class<DeleteUsageLimitMessage>(
  "DeleteUsageLimitMessage",
)(
  { UsageLimitId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUsageLimitResponse extends S.Class<DeleteUsageLimitResponse>(
  "DeleteUsageLimitResponse",
)({}, ns) {}
export class DescribeAccountAttributesMessage extends S.Class<DescribeAccountAttributesMessage>(
  "DescribeAccountAttributesMessage",
)(
  { AttributeNames: S.optional(AttributeNameList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAuthenticationProfilesMessage extends S.Class<DescribeAuthenticationProfilesMessage>(
  "DescribeAuthenticationProfilesMessage",
)(
  { AuthenticationProfileName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterDbRevisionsMessage extends S.Class<DescribeClusterDbRevisionsMessage>(
  "DescribeClusterDbRevisionsMessage",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterParameterGroupsMessage extends S.Class<DescribeClusterParameterGroupsMessage>(
  "DescribeClusterParameterGroupsMessage",
)(
  {
    ParameterGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterParametersMessage extends S.Class<DescribeClusterParametersMessage>(
  "DescribeClusterParametersMessage",
)(
  {
    ParameterGroupName: S.String,
    Source: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClustersMessage extends S.Class<DescribeClustersMessage>(
  "DescribeClustersMessage",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterSecurityGroupsMessage extends S.Class<DescribeClusterSecurityGroupsMessage>(
  "DescribeClusterSecurityGroupsMessage",
)(
  {
    ClusterSecurityGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterSubnetGroupsMessage extends S.Class<DescribeClusterSubnetGroupsMessage>(
  "DescribeClusterSubnetGroupsMessage",
)(
  {
    ClusterSubnetGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterTracksMessage extends S.Class<DescribeClusterTracksMessage>(
  "DescribeClusterTracksMessage",
)(
  {
    MaintenanceTrackName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterVersionsMessage extends S.Class<DescribeClusterVersionsMessage>(
  "DescribeClusterVersionsMessage",
)(
  {
    ClusterVersion: S.optional(S.String),
    ClusterParameterGroupFamily: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCustomDomainAssociationsMessage extends S.Class<DescribeCustomDomainAssociationsMessage>(
  "DescribeCustomDomainAssociationsMessage",
)(
  {
    CustomDomainName: S.optional(S.String),
    CustomDomainCertificateArn: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDataSharesMessage extends S.Class<DescribeDataSharesMessage>(
  "DescribeDataSharesMessage",
)(
  {
    DataShareArn: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDataSharesForConsumerMessage extends S.Class<DescribeDataSharesForConsumerMessage>(
  "DescribeDataSharesForConsumerMessage",
)(
  {
    ConsumerArn: S.optional(S.String),
    Status: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDataSharesForProducerMessage extends S.Class<DescribeDataSharesForProducerMessage>(
  "DescribeDataSharesForProducerMessage",
)(
  {
    ProducerArn: S.optional(S.String),
    Status: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDefaultClusterParametersMessage extends S.Class<DescribeDefaultClusterParametersMessage>(
  "DescribeDefaultClusterParametersMessage",
)(
  {
    ParameterGroupFamily: S.String,
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEndpointAccessMessage extends S.Class<DescribeEndpointAccessMessage>(
  "DescribeEndpointAccessMessage",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    EndpointName: S.optional(S.String),
    VpcId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEndpointAuthorizationMessage extends S.Class<DescribeEndpointAuthorizationMessage>(
  "DescribeEndpointAuthorizationMessage",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    Account: S.optional(S.String),
    Grantee: S.optional(S.Boolean),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventCategoriesMessage extends S.Class<DescribeEventCategoriesMessage>(
  "DescribeEventCategoriesMessage",
)(
  { SourceType: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventsMessage extends S.Class<DescribeEventsMessage>(
  "DescribeEventsMessage",
)(
  {
    SourceIdentifier: S.optional(S.String),
    SourceType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Duration: S.optional(S.Number),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventSubscriptionsMessage extends S.Class<DescribeEventSubscriptionsMessage>(
  "DescribeEventSubscriptionsMessage",
)(
  {
    SubscriptionName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeHsmClientCertificatesMessage extends S.Class<DescribeHsmClientCertificatesMessage>(
  "DescribeHsmClientCertificatesMessage",
)(
  {
    HsmClientCertificateIdentifier: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeHsmConfigurationsMessage extends S.Class<DescribeHsmConfigurationsMessage>(
  "DescribeHsmConfigurationsMessage",
)(
  {
    HsmConfigurationIdentifier: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInboundIntegrationsMessage extends S.Class<DescribeInboundIntegrationsMessage>(
  "DescribeInboundIntegrationsMessage",
)(
  {
    IntegrationArn: S.optional(S.String),
    TargetArn: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLoggingStatusMessage extends S.Class<DescribeLoggingStatusMessage>(
  "DescribeLoggingStatusMessage",
)(
  { ClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOrderableClusterOptionsMessage extends S.Class<DescribeOrderableClusterOptionsMessage>(
  "DescribeOrderableClusterOptionsMessage",
)(
  {
    ClusterVersion: S.optional(S.String),
    NodeType: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePartnersInputMessage extends S.Class<DescribePartnersInputMessage>(
  "DescribePartnersInputMessage",
)(
  {
    AccountId: S.String,
    ClusterIdentifier: S.String,
    DatabaseName: S.optional(S.String),
    PartnerName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRedshiftIdcApplicationsMessage extends S.Class<DescribeRedshiftIdcApplicationsMessage>(
  "DescribeRedshiftIdcApplicationsMessage",
)(
  {
    RedshiftIdcApplicationArn: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReservedNodeExchangeStatusInputMessage extends S.Class<DescribeReservedNodeExchangeStatusInputMessage>(
  "DescribeReservedNodeExchangeStatusInputMessage",
)(
  {
    ReservedNodeId: S.optional(S.String),
    ReservedNodeExchangeRequestId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReservedNodeOfferingsMessage extends S.Class<DescribeReservedNodeOfferingsMessage>(
  "DescribeReservedNodeOfferingsMessage",
)(
  {
    ReservedNodeOfferingId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReservedNodesMessage extends S.Class<DescribeReservedNodesMessage>(
  "DescribeReservedNodesMessage",
)(
  {
    ReservedNodeId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeResizeMessage extends S.Class<DescribeResizeMessage>(
  "DescribeResizeMessage",
)(
  { ClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSnapshotCopyGrantsMessage extends S.Class<DescribeSnapshotCopyGrantsMessage>(
  "DescribeSnapshotCopyGrantsMessage",
)(
  {
    SnapshotCopyGrantName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSnapshotSchedulesMessage extends S.Class<DescribeSnapshotSchedulesMessage>(
  "DescribeSnapshotSchedulesMessage",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    ScheduleIdentifier: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CustomerStorageMessage extends S.Class<CustomerStorageMessage>(
  "CustomerStorageMessage",
)(
  {
    TotalBackupSizeInMegaBytes: S.optional(S.Number),
    TotalProvisionedStorageInMegaBytes: S.optional(S.Number),
  },
  ns,
) {}
export class DescribeTableRestoreStatusMessage extends S.Class<DescribeTableRestoreStatusMessage>(
  "DescribeTableRestoreStatusMessage",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    TableRestoreRequestId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTagsMessage extends S.Class<DescribeTagsMessage>(
  "DescribeTagsMessage",
)(
  {
    ResourceName: S.optional(S.String),
    ResourceType: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeUsageLimitsMessage extends S.Class<DescribeUsageLimitsMessage>(
  "DescribeUsageLimitsMessage",
)(
  {
    UsageLimitId: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    FeatureType: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableLoggingMessage extends S.Class<DisableLoggingMessage>(
  "DisableLoggingMessage",
)(
  { ClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableSnapshotCopyMessage extends S.Class<DisableSnapshotCopyMessage>(
  "DisableSnapshotCopyMessage",
)(
  { ClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateDataShareConsumerMessage extends S.Class<DisassociateDataShareConsumerMessage>(
  "DisassociateDataShareConsumerMessage",
)(
  {
    DataShareArn: S.String,
    DisassociateEntireAccount: S.optional(S.Boolean),
    ConsumerArn: S.optional(S.String),
    ConsumerRegion: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableLoggingMessage extends S.Class<EnableLoggingMessage>(
  "EnableLoggingMessage",
)(
  {
    ClusterIdentifier: S.String,
    BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    LogDestinationType: S.optional(S.String),
    LogExports: S.optional(LogTypeList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableSnapshotCopyMessage extends S.Class<EnableSnapshotCopyMessage>(
  "EnableSnapshotCopyMessage",
)(
  {
    ClusterIdentifier: S.String,
    DestinationRegion: S.String,
    RetentionPeriod: S.optional(S.Number),
    SnapshotCopyGrantName: S.optional(S.String),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FailoverPrimaryComputeInputMessage extends S.Class<FailoverPrimaryComputeInputMessage>(
  "FailoverPrimaryComputeInputMessage",
)(
  { ClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetClusterCredentialsMessage extends S.Class<GetClusterCredentialsMessage>(
  "GetClusterCredentialsMessage",
)(
  {
    DbUser: S.String,
    DbName: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    DurationSeconds: S.optional(S.Number),
    AutoCreate: S.optional(S.Boolean),
    DbGroups: S.optional(DbGroupList),
    CustomDomainName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetClusterCredentialsWithIAMMessage extends S.Class<GetClusterCredentialsWithIAMMessage>(
  "GetClusterCredentialsWithIAMMessage",
)(
  {
    DbName: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    DurationSeconds: S.optional(S.Number),
    CustomDomainName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIdentityCenterAuthTokenRequest extends S.Class<GetIdentityCenterAuthTokenRequest>(
  "GetIdentityCenterAuthTokenRequest",
)(
  { ClusterIds: ClusterIdentifierList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetReservedNodeExchangeConfigurationOptionsInputMessage extends S.Class<GetReservedNodeExchangeConfigurationOptionsInputMessage>(
  "GetReservedNodeExchangeConfigurationOptionsInputMessage",
)(
  {
    ActionType: S.String,
    ClusterIdentifier: S.optional(S.String),
    SnapshotIdentifier: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetReservedNodeExchangeOfferingsInputMessage extends S.Class<GetReservedNodeExchangeOfferingsInputMessage>(
  "GetReservedNodeExchangeOfferingsInputMessage",
)(
  {
    ReservedNodeId: S.String,
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyMessage extends S.Class<GetResourcePolicyMessage>(
  "GetResourcePolicyMessage",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRecommendationsMessage extends S.Class<ListRecommendationsMessage>(
  "ListRecommendationsMessage",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    NamespaceArn: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyAquaInputMessage extends S.Class<ModifyAquaInputMessage>(
  "ModifyAquaInputMessage",
)(
  {
    ClusterIdentifier: S.String,
    AquaConfigurationStatus: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyAuthenticationProfileMessage extends S.Class<ModifyAuthenticationProfileMessage>(
  "ModifyAuthenticationProfileMessage",
)(
  {
    AuthenticationProfileName: S.String,
    AuthenticationProfileContent: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyClusterMessage extends S.Class<ModifyClusterMessage>(
  "ModifyClusterMessage",
)(
  {
    ClusterIdentifier: S.String,
    ClusterType: S.optional(S.String),
    NodeType: S.optional(S.String),
    NumberOfNodes: S.optional(S.Number),
    ClusterSecurityGroups: S.optional(ClusterSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    MasterUserPassword: S.optional(S.String),
    ClusterParameterGroupName: S.optional(S.String),
    AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    PreferredMaintenanceWindow: S.optional(S.String),
    ClusterVersion: S.optional(S.String),
    AllowVersionUpgrade: S.optional(S.Boolean),
    HsmClientCertificateIdentifier: S.optional(S.String),
    HsmConfigurationIdentifier: S.optional(S.String),
    NewClusterIdentifier: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    ElasticIp: S.optional(S.String),
    EnhancedVpcRouting: S.optional(S.Boolean),
    MaintenanceTrackName: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    AvailabilityZoneRelocation: S.optional(S.Boolean),
    AvailabilityZone: S.optional(S.String),
    Port: S.optional(S.Number),
    ManageMasterPassword: S.optional(S.Boolean),
    MasterPasswordSecretKmsKeyId: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyClusterDbRevisionMessage extends S.Class<ModifyClusterDbRevisionMessage>(
  "ModifyClusterDbRevisionMessage",
)(
  { ClusterIdentifier: S.String, RevisionTarget: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyClusterIamRolesMessage extends S.Class<ModifyClusterIamRolesMessage>(
  "ModifyClusterIamRolesMessage",
)(
  {
    ClusterIdentifier: S.String,
    AddIamRoles: S.optional(IamRoleArnList),
    RemoveIamRoles: S.optional(IamRoleArnList),
    DefaultIamRoleArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyClusterMaintenanceMessage extends S.Class<ModifyClusterMaintenanceMessage>(
  "ModifyClusterMaintenanceMessage",
)(
  {
    ClusterIdentifier: S.String,
    DeferMaintenance: S.optional(S.Boolean),
    DeferMaintenanceIdentifier: S.optional(S.String),
    DeferMaintenanceStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    DeferMaintenanceEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    DeferMaintenanceDuration: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyClusterSnapshotMessage extends S.Class<ModifyClusterSnapshotMessage>(
  "ModifyClusterSnapshotMessage",
)(
  {
    SnapshotIdentifier: S.String,
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    Force: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyClusterSnapshotScheduleMessage extends S.Class<ModifyClusterSnapshotScheduleMessage>(
  "ModifyClusterSnapshotScheduleMessage",
)(
  {
    ClusterIdentifier: S.String,
    ScheduleIdentifier: S.optional(S.String),
    DisassociateSchedule: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyClusterSnapshotScheduleResponse extends S.Class<ModifyClusterSnapshotScheduleResponse>(
  "ModifyClusterSnapshotScheduleResponse",
)({}, ns) {}
export class ModifyClusterSubnetGroupMessage extends S.Class<ModifyClusterSubnetGroupMessage>(
  "ModifyClusterSubnetGroupMessage",
)(
  {
    ClusterSubnetGroupName: S.String,
    Description: S.optional(S.String),
    SubnetIds: SubnetIdentifierList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyCustomDomainAssociationMessage extends S.Class<ModifyCustomDomainAssociationMessage>(
  "ModifyCustomDomainAssociationMessage",
)(
  {
    CustomDomainName: S.String,
    CustomDomainCertificateArn: S.String,
    ClusterIdentifier: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyEndpointAccessMessage extends S.Class<ModifyEndpointAccessMessage>(
  "ModifyEndpointAccessMessage",
)(
  {
    EndpointName: S.String,
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyEventSubscriptionMessage extends S.Class<ModifyEventSubscriptionMessage>(
  "ModifyEventSubscriptionMessage",
)(
  {
    SubscriptionName: S.String,
    SnsTopicArn: S.optional(S.String),
    SourceType: S.optional(S.String),
    SourceIds: S.optional(SourceIdsList),
    EventCategories: S.optional(EventCategoriesList),
    Severity: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyIntegrationMessage extends S.Class<ModifyIntegrationMessage>(
  "ModifyIntegrationMessage",
)(
  {
    IntegrationArn: S.String,
    Description: S.optional(S.String),
    IntegrationName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyLakehouseConfigurationMessage extends S.Class<ModifyLakehouseConfigurationMessage>(
  "ModifyLakehouseConfigurationMessage",
)(
  {
    ClusterIdentifier: S.String,
    LakehouseRegistration: S.optional(S.String),
    CatalogName: S.optional(S.String),
    LakehouseIdcRegistration: S.optional(S.String),
    LakehouseIdcApplicationArn: S.optional(S.String),
    DryRun: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const AuthorizedAudienceList = S.Array(S.String);
export class AuthorizedTokenIssuer extends S.Class<AuthorizedTokenIssuer>(
  "AuthorizedTokenIssuer",
)({
  TrustedTokenIssuerArn: S.optional(S.String),
  AuthorizedAudiencesList: S.optional(AuthorizedAudienceList),
}) {}
export const AuthorizedTokenIssuerList = S.Array(AuthorizedTokenIssuer);
export class LakeFormationQuery extends S.Class<LakeFormationQuery>(
  "LakeFormationQuery",
)({ Authorization: S.String }) {}
export const LakeFormationScopeUnion = S.Union(
  S.Struct({ LakeFormationQuery: LakeFormationQuery }),
);
export const LakeFormationServiceIntegrations = S.Array(
  LakeFormationScopeUnion,
);
export class ReadWriteAccess extends S.Class<ReadWriteAccess>(
  "ReadWriteAccess",
)({ Authorization: S.String }) {}
export const S3AccessGrantsScopeUnion = S.Union(
  S.Struct({ ReadWriteAccess: ReadWriteAccess }),
);
export const S3AccessGrantsServiceIntegrations = S.Array(
  S3AccessGrantsScopeUnion,
);
export class Connect extends S.Class<Connect>("Connect")({
  Authorization: S.String,
}) {}
export const RedshiftScopeUnion = S.Union(S.Struct({ Connect: Connect }));
export const RedshiftServiceIntegrations = S.Array(RedshiftScopeUnion);
export const ServiceIntegrationsUnion = S.Union(
  S.Struct({ LakeFormation: LakeFormationServiceIntegrations }),
  S.Struct({ S3AccessGrants: S3AccessGrantsServiceIntegrations }),
  S.Struct({ Redshift: RedshiftServiceIntegrations }),
);
export const ServiceIntegrationList = S.Array(ServiceIntegrationsUnion);
export class ModifyRedshiftIdcApplicationMessage extends S.Class<ModifyRedshiftIdcApplicationMessage>(
  "ModifyRedshiftIdcApplicationMessage",
)(
  {
    RedshiftIdcApplicationArn: S.String,
    IdentityNamespace: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
    IdcDisplayName: S.optional(S.String),
    AuthorizedTokenIssuerList: S.optional(AuthorizedTokenIssuerList),
    ServiceIntegrations: S.optional(ServiceIntegrationList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResizeClusterMessage extends S.Class<ResizeClusterMessage>(
  "ResizeClusterMessage",
)(
  {
    ClusterIdentifier: S.String,
    ClusterType: S.optional(S.String),
    NodeType: S.optional(S.String),
    NumberOfNodes: S.optional(S.Number),
    Classic: S.optional(S.Boolean),
    ReservedNodeId: S.optional(S.String),
    TargetReservedNodeOfferingId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PauseClusterMessage extends S.Class<PauseClusterMessage>(
  "PauseClusterMessage",
)(
  { ClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResumeClusterMessage extends S.Class<ResumeClusterMessage>(
  "ResumeClusterMessage",
)(
  { ClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ScheduledActionType extends S.Class<ScheduledActionType>(
  "ScheduledActionType",
)({
  ResizeCluster: S.optional(ResizeClusterMessage),
  PauseCluster: S.optional(PauseClusterMessage),
  ResumeCluster: S.optional(ResumeClusterMessage),
}) {}
export class ModifyScheduledActionMessage extends S.Class<ModifyScheduledActionMessage>(
  "ModifyScheduledActionMessage",
)(
  {
    ScheduledActionName: S.String,
    TargetAction: S.optional(ScheduledActionType),
    Schedule: S.optional(S.String),
    IamRole: S.optional(S.String),
    ScheduledActionDescription: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Enable: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifySnapshotCopyRetentionPeriodMessage extends S.Class<ModifySnapshotCopyRetentionPeriodMessage>(
  "ModifySnapshotCopyRetentionPeriodMessage",
)(
  {
    ClusterIdentifier: S.String,
    RetentionPeriod: S.Number,
    Manual: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifySnapshotScheduleMessage extends S.Class<ModifySnapshotScheduleMessage>(
  "ModifySnapshotScheduleMessage",
)(
  { ScheduleIdentifier: S.String, ScheduleDefinitions: ScheduleDefinitionList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyUsageLimitMessage extends S.Class<ModifyUsageLimitMessage>(
  "ModifyUsageLimitMessage",
)(
  {
    UsageLimitId: S.String,
    Amount: S.optional(S.Number),
    BreachAction: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PurchaseReservedNodeOfferingMessage extends S.Class<PurchaseReservedNodeOfferingMessage>(
  "PurchaseReservedNodeOfferingMessage",
)(
  { ReservedNodeOfferingId: S.String, NodeCount: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyMessage extends S.Class<PutResourcePolicyMessage>(
  "PutResourcePolicyMessage",
)(
  { ResourceArn: S.String, Policy: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootClusterMessage extends S.Class<RebootClusterMessage>(
  "RebootClusterMessage",
)(
  { ClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ServerlessIdentifier extends S.Class<ServerlessIdentifier>(
  "ServerlessIdentifier",
)({ NamespaceIdentifier: S.String, WorkgroupIdentifier: S.String }) {}
export class ProvisionedIdentifier extends S.Class<ProvisionedIdentifier>(
  "ProvisionedIdentifier",
)({ ClusterIdentifier: S.String }) {}
export const NamespaceIdentifierUnion = S.Union(
  S.Struct({ ServerlessIdentifier: ServerlessIdentifier }),
  S.Struct({ ProvisionedIdentifier: ProvisionedIdentifier }),
);
export class RegisterNamespaceInputMessage extends S.Class<RegisterNamespaceInputMessage>(
  "RegisterNamespaceInputMessage",
)(
  {
    NamespaceIdentifier: NamespaceIdentifierUnion,
    ConsumerIdentifiers: ConsumerIdentifierList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RejectDataShareMessage extends S.Class<RejectDataShareMessage>(
  "RejectDataShareMessage",
)(
  { DataShareArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Parameter extends S.Class<Parameter>("Parameter")({
  ParameterName: S.optional(S.String),
  ParameterValue: S.optional(S.String),
  Description: S.optional(S.String),
  Source: S.optional(S.String),
  DataType: S.optional(S.String),
  AllowedValues: S.optional(S.String),
  ApplyType: S.optional(S.String),
  IsModifiable: S.optional(S.Boolean),
  MinimumEngineVersion: S.optional(S.String),
}) {}
export const ParametersList = S.Array(Parameter.pipe(T.XmlName("Parameter")));
export class ResetClusterParameterGroupMessage extends S.Class<ResetClusterParameterGroupMessage>(
  "ResetClusterParameterGroupMessage",
)(
  {
    ParameterGroupName: S.String,
    ResetAllParameters: S.optional(S.Boolean),
    Parameters: S.optional(ParametersList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreFromClusterSnapshotMessage extends S.Class<RestoreFromClusterSnapshotMessage>(
  "RestoreFromClusterSnapshotMessage",
)(
  {
    ClusterIdentifier: S.String,
    SnapshotIdentifier: S.optional(S.String),
    SnapshotArn: S.optional(S.String),
    SnapshotClusterIdentifier: S.optional(S.String),
    Port: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    AllowVersionUpgrade: S.optional(S.Boolean),
    ClusterSubnetGroupName: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    OwnerAccount: S.optional(S.String),
    HsmClientCertificateIdentifier: S.optional(S.String),
    HsmConfigurationIdentifier: S.optional(S.String),
    ElasticIp: S.optional(S.String),
    ClusterParameterGroupName: S.optional(S.String),
    ClusterSecurityGroups: S.optional(ClusterSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    PreferredMaintenanceWindow: S.optional(S.String),
    AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    KmsKeyId: S.optional(S.String),
    NodeType: S.optional(S.String),
    EnhancedVpcRouting: S.optional(S.Boolean),
    AdditionalInfo: S.optional(S.String),
    IamRoles: S.optional(IamRoleArnList),
    MaintenanceTrackName: S.optional(S.String),
    SnapshotScheduleIdentifier: S.optional(S.String),
    NumberOfNodes: S.optional(S.Number),
    AvailabilityZoneRelocation: S.optional(S.Boolean),
    AquaConfigurationStatus: S.optional(S.String),
    DefaultIamRoleArn: S.optional(S.String),
    ReservedNodeId: S.optional(S.String),
    TargetReservedNodeOfferingId: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    ManageMasterPassword: S.optional(S.Boolean),
    MasterPasswordSecretKmsKeyId: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    CatalogName: S.optional(S.String),
    RedshiftIdcApplicationArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreTableFromClusterSnapshotMessage extends S.Class<RestoreTableFromClusterSnapshotMessage>(
  "RestoreTableFromClusterSnapshotMessage",
)(
  {
    ClusterIdentifier: S.String,
    SnapshotIdentifier: S.String,
    SourceDatabaseName: S.String,
    SourceSchemaName: S.optional(S.String),
    SourceTableName: S.String,
    TargetDatabaseName: S.optional(S.String),
    TargetSchemaName: S.optional(S.String),
    NewTableName: S.String,
    EnableCaseSensitiveIdentifier: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RevokeClusterSecurityGroupIngressMessage extends S.Class<RevokeClusterSecurityGroupIngressMessage>(
  "RevokeClusterSecurityGroupIngressMessage",
)(
  {
    ClusterSecurityGroupName: S.String,
    CIDRIP: S.optional(S.String),
    EC2SecurityGroupName: S.optional(S.String),
    EC2SecurityGroupOwnerId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RevokeEndpointAccessMessage extends S.Class<RevokeEndpointAccessMessage>(
  "RevokeEndpointAccessMessage",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    Account: S.optional(S.String),
    VpcIds: S.optional(VpcIdentifierList),
    Force: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RevokeSnapshotAccessMessage extends S.Class<RevokeSnapshotAccessMessage>(
  "RevokeSnapshotAccessMessage",
)(
  {
    SnapshotIdentifier: S.optional(S.String),
    SnapshotArn: S.optional(S.String),
    SnapshotClusterIdentifier: S.optional(S.String),
    AccountWithRestoreAccess: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RotateEncryptionKeyMessage extends S.Class<RotateEncryptionKeyMessage>(
  "RotateEncryptionKeyMessage",
)(
  { ClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePartnerStatusInputMessage extends S.Class<UpdatePartnerStatusInputMessage>(
  "UpdatePartnerStatusInputMessage",
)(
  {
    AccountId: S.String,
    ClusterIdentifier: S.String,
    DatabaseName: S.String,
    PartnerName: S.String,
    Status: S.String,
    StatusMessage: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const DescribeIntegrationsFilterValueList = S.Array(
  S.String.pipe(T.XmlName("Value")),
);
export const ValueStringList = S.Array(S.String.pipe(T.XmlName("item")));
export class SnapshotErrorMessage extends S.Class<SnapshotErrorMessage>(
  "SnapshotErrorMessage",
)({
  SnapshotIdentifier: S.optional(S.String),
  SnapshotClusterIdentifier: S.optional(S.String),
  FailureCode: S.optional(S.String),
  FailureReason: S.optional(S.String),
}) {}
export const BatchSnapshotOperationErrors = S.Array(
  SnapshotErrorMessage.pipe(T.XmlName("SnapshotErrorMessage")),
);
export const ImportTablesCompleted = S.Array(S.String);
export const ImportTablesInProgress = S.Array(S.String);
export const ImportTablesNotStarted = S.Array(S.String);
export const EncryptionContextMap = S.Record({
  key: S.String,
  value: S.String,
});
export const ScheduledSnapshotTimeList = S.Array(
  S.Date.pipe(T.TimestampFormat("date-time")).pipe(T.XmlName("SnapshotTime")),
);
export class ClusterParameterGroup extends S.Class<ClusterParameterGroup>(
  "ClusterParameterGroup",
)({
  ParameterGroupName: S.optional(S.String),
  ParameterGroupFamily: S.optional(S.String),
  Description: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const ParameterGroupList = S.Array(
  ClusterParameterGroup.pipe(T.XmlName("ClusterParameterGroup")),
);
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({
  NetworkInterfaceId: S.optional(S.String),
  SubnetId: S.optional(S.String),
  PrivateIpAddress: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  Ipv6Address: S.optional(S.String),
}) {}
export const NetworkInterfaceList = S.Array(
  NetworkInterface.pipe(T.XmlName("NetworkInterface")),
);
export class VpcEndpoint extends S.Class<VpcEndpoint>("VpcEndpoint")({
  VpcEndpointId: S.optional(S.String),
  VpcId: S.optional(S.String),
  NetworkInterfaces: S.optional(NetworkInterfaceList),
}) {}
export const VpcEndpointsList = S.Array(
  VpcEndpoint.pipe(T.XmlName("VpcEndpoint")),
);
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  Address: S.optional(S.String),
  Port: S.optional(S.Number),
  VpcEndpoints: S.optional(VpcEndpointsList),
}) {}
export class ClusterSecurityGroupMembership extends S.Class<ClusterSecurityGroupMembership>(
  "ClusterSecurityGroupMembership",
)({
  ClusterSecurityGroupName: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const ClusterSecurityGroupMembershipList = S.Array(
  ClusterSecurityGroupMembership.pipe(T.XmlName("ClusterSecurityGroup")),
);
export class VpcSecurityGroupMembership extends S.Class<VpcSecurityGroupMembership>(
  "VpcSecurityGroupMembership",
)({ VpcSecurityGroupId: S.optional(S.String), Status: S.optional(S.String) }) {}
export const VpcSecurityGroupMembershipList = S.Array(
  VpcSecurityGroupMembership.pipe(T.XmlName("VpcSecurityGroup")),
);
export class ClusterParameterStatus extends S.Class<ClusterParameterStatus>(
  "ClusterParameterStatus",
)({
  ParameterName: S.optional(S.String),
  ParameterApplyStatus: S.optional(S.String),
  ParameterApplyErrorDescription: S.optional(S.String),
}) {}
export const ClusterParameterStatusList = S.Array(ClusterParameterStatus);
export class ClusterParameterGroupStatus extends S.Class<ClusterParameterGroupStatus>(
  "ClusterParameterGroupStatus",
)({
  ParameterGroupName: S.optional(S.String),
  ParameterApplyStatus: S.optional(S.String),
  ClusterParameterStatusList: S.optional(ClusterParameterStatusList),
}) {}
export const ClusterParameterGroupStatusList = S.Array(
  ClusterParameterGroupStatus.pipe(T.XmlName("ClusterParameterGroup")),
);
export class PendingModifiedValues extends S.Class<PendingModifiedValues>(
  "PendingModifiedValues",
)({
  MasterUserPassword: S.optional(S.String),
  NodeType: S.optional(S.String),
  NumberOfNodes: S.optional(S.Number),
  ClusterType: S.optional(S.String),
  ClusterVersion: S.optional(S.String),
  AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
  ClusterIdentifier: S.optional(S.String),
  PubliclyAccessible: S.optional(S.Boolean),
  EnhancedVpcRouting: S.optional(S.Boolean),
  MaintenanceTrackName: S.optional(S.String),
  EncryptionType: S.optional(S.String),
}) {}
export class RestoreStatus extends S.Class<RestoreStatus>("RestoreStatus")({
  Status: S.optional(S.String),
  CurrentRestoreRateInMegaBytesPerSecond: S.optional(S.Number),
  SnapshotSizeInMegaBytes: S.optional(S.Number),
  ProgressInMegaBytes: S.optional(S.Number),
  ElapsedTimeInSeconds: S.optional(S.Number),
  EstimatedTimeToCompletionInSeconds: S.optional(S.Number),
}) {}
export class DataTransferProgress extends S.Class<DataTransferProgress>(
  "DataTransferProgress",
)({
  Status: S.optional(S.String),
  CurrentRateInMegaBytesPerSecond: S.optional(S.Number),
  TotalDataInMegaBytes: S.optional(S.Number),
  DataTransferredInMegaBytes: S.optional(S.Number),
  EstimatedTimeToCompletionInSeconds: S.optional(S.Number),
  ElapsedTimeInSeconds: S.optional(S.Number),
}) {}
export class HsmStatus extends S.Class<HsmStatus>("HsmStatus")({
  HsmClientCertificateIdentifier: S.optional(S.String),
  HsmConfigurationIdentifier: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class ClusterSnapshotCopyStatus extends S.Class<ClusterSnapshotCopyStatus>(
  "ClusterSnapshotCopyStatus",
)({
  DestinationRegion: S.optional(S.String),
  RetentionPeriod: S.optional(S.Number),
  ManualSnapshotRetentionPeriod: S.optional(S.Number),
  SnapshotCopyGrantName: S.optional(S.String),
}) {}
export class ClusterNode extends S.Class<ClusterNode>("ClusterNode")({
  NodeRole: S.optional(S.String),
  PrivateIPAddress: S.optional(S.String),
  PublicIPAddress: S.optional(S.String),
}) {}
export const ClusterNodesList = S.Array(ClusterNode);
export class ElasticIpStatus extends S.Class<ElasticIpStatus>(
  "ElasticIpStatus",
)({ ElasticIp: S.optional(S.String), Status: S.optional(S.String) }) {}
export class ClusterIamRole extends S.Class<ClusterIamRole>("ClusterIamRole")({
  IamRoleArn: S.optional(S.String),
  ApplyStatus: S.optional(S.String),
}) {}
export const ClusterIamRoleList = S.Array(
  ClusterIamRole.pipe(T.XmlName("ClusterIamRole")),
);
export const PendingActionsList = S.Array(S.String);
export class DeferredMaintenanceWindow extends S.Class<DeferredMaintenanceWindow>(
  "DeferredMaintenanceWindow",
)({
  DeferMaintenanceIdentifier: S.optional(S.String),
  DeferMaintenanceStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  DeferMaintenanceEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export const DeferredMaintenanceWindowsList = S.Array(
  DeferredMaintenanceWindow.pipe(T.XmlName("DeferredMaintenanceWindow")),
);
export class ResizeInfo extends S.Class<ResizeInfo>("ResizeInfo")({
  ResizeType: S.optional(S.String),
  AllowCancelResize: S.optional(S.Boolean),
}) {}
export class AquaConfiguration extends S.Class<AquaConfiguration>(
  "AquaConfiguration",
)({
  AquaStatus: S.optional(S.String),
  AquaConfigurationStatus: S.optional(S.String),
}) {}
export class ReservedNodeExchangeStatus extends S.Class<ReservedNodeExchangeStatus>(
  "ReservedNodeExchangeStatus",
)({
  ReservedNodeExchangeRequestId: S.optional(S.String),
  Status: S.optional(S.String),
  RequestTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SourceReservedNodeId: S.optional(S.String),
  SourceReservedNodeType: S.optional(S.String),
  SourceReservedNodeCount: S.optional(S.Number),
  TargetReservedNodeOfferingId: S.optional(S.String),
  TargetReservedNodeType: S.optional(S.String),
  TargetReservedNodeCount: S.optional(S.Number),
}) {}
export class SecondaryClusterInfo extends S.Class<SecondaryClusterInfo>(
  "SecondaryClusterInfo",
)({
  AvailabilityZone: S.optional(S.String),
  ClusterNodes: S.optional(ClusterNodesList),
}) {}
export class Cluster extends S.Class<Cluster>("Cluster")({
  ClusterIdentifier: S.optional(S.String),
  NodeType: S.optional(S.String),
  ClusterStatus: S.optional(S.String),
  ClusterAvailabilityStatus: S.optional(S.String),
  ModifyStatus: S.optional(S.String),
  MasterUsername: S.optional(S.String),
  DBName: S.optional(S.String),
  Endpoint: S.optional(Endpoint),
  ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
  ManualSnapshotRetentionPeriod: S.optional(S.Number),
  ClusterSecurityGroups: S.optional(ClusterSecurityGroupMembershipList),
  VpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
  ClusterParameterGroups: S.optional(ClusterParameterGroupStatusList),
  ClusterSubnetGroupName: S.optional(S.String),
  VpcId: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  PreferredMaintenanceWindow: S.optional(S.String),
  PendingModifiedValues: S.optional(PendingModifiedValues),
  ClusterVersion: S.optional(S.String),
  AllowVersionUpgrade: S.optional(S.Boolean),
  NumberOfNodes: S.optional(S.Number),
  PubliclyAccessible: S.optional(S.Boolean),
  Encrypted: S.optional(S.Boolean),
  RestoreStatus: S.optional(RestoreStatus),
  DataTransferProgress: S.optional(DataTransferProgress),
  HsmStatus: S.optional(HsmStatus),
  ClusterSnapshotCopyStatus: S.optional(ClusterSnapshotCopyStatus),
  ClusterPublicKey: S.optional(S.String),
  ClusterNodes: S.optional(ClusterNodesList),
  ElasticIpStatus: S.optional(ElasticIpStatus),
  ClusterRevisionNumber: S.optional(S.String),
  Tags: S.optional(TagList),
  KmsKeyId: S.optional(S.String),
  EnhancedVpcRouting: S.optional(S.Boolean),
  IamRoles: S.optional(ClusterIamRoleList),
  PendingActions: S.optional(PendingActionsList),
  MaintenanceTrackName: S.optional(S.String),
  ElasticResizeNumberOfNodeOptions: S.optional(S.String),
  DeferredMaintenanceWindows: S.optional(DeferredMaintenanceWindowsList),
  SnapshotScheduleIdentifier: S.optional(S.String),
  SnapshotScheduleState: S.optional(S.String),
  ExpectedNextSnapshotScheduleTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  ExpectedNextSnapshotScheduleTimeStatus: S.optional(S.String),
  NextMaintenanceWindowStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  ResizeInfo: S.optional(ResizeInfo),
  AvailabilityZoneRelocationStatus: S.optional(S.String),
  ClusterNamespaceArn: S.optional(S.String),
  TotalStorageCapacityInMegaBytes: S.optional(S.Number),
  AquaConfiguration: S.optional(AquaConfiguration),
  DefaultIamRoleArn: S.optional(S.String),
  ReservedNodeExchangeStatus: S.optional(ReservedNodeExchangeStatus),
  CustomDomainName: S.optional(S.String),
  CustomDomainCertificateArn: S.optional(S.String),
  CustomDomainCertificateExpiryDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  MasterPasswordSecretArn: S.optional(S.String),
  MasterPasswordSecretKmsKeyId: S.optional(S.String),
  IpAddressType: S.optional(S.String),
  MultiAZ: S.optional(S.String),
  MultiAZSecondary: S.optional(SecondaryClusterInfo),
  LakehouseRegistrationStatus: S.optional(S.String),
  CatalogArn: S.optional(S.String),
}) {}
export const ClusterList = S.Array(Cluster.pipe(T.XmlName("Cluster")));
export class EC2SecurityGroup extends S.Class<EC2SecurityGroup>(
  "EC2SecurityGroup",
)({
  Status: S.optional(S.String),
  EC2SecurityGroupName: S.optional(S.String),
  EC2SecurityGroupOwnerId: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const EC2SecurityGroupList = S.Array(
  EC2SecurityGroup.pipe(T.XmlName("EC2SecurityGroup")),
);
export class IPRange extends S.Class<IPRange>("IPRange")({
  Status: S.optional(S.String),
  CIDRIP: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const IPRangeList = S.Array(IPRange.pipe(T.XmlName("IPRange")));
export class ClusterSecurityGroup extends S.Class<ClusterSecurityGroup>(
  "ClusterSecurityGroup",
)({
  ClusterSecurityGroupName: S.optional(S.String),
  Description: S.optional(S.String),
  EC2SecurityGroups: S.optional(EC2SecurityGroupList),
  IPRanges: S.optional(IPRangeList),
  Tags: S.optional(TagList),
}) {}
export const ClusterSecurityGroups = S.Array(
  ClusterSecurityGroup.pipe(T.XmlName("ClusterSecurityGroup")),
);
export class SnapshotSortingEntity extends S.Class<SnapshotSortingEntity>(
  "SnapshotSortingEntity",
)({ Attribute: S.String, SortOrder: S.optional(S.String) }) {}
export const SnapshotSortingEntityList = S.Array(
  SnapshotSortingEntity.pipe(T.XmlName("SnapshotSortingEntity")),
);
export class SupportedPlatform extends S.Class<SupportedPlatform>(
  "SupportedPlatform",
)({ Name: S.optional(S.String) }) {}
export const SupportedPlatformsList = S.Array(
  SupportedPlatform.pipe(T.XmlName("SupportedPlatform")),
);
export class AvailabilityZone extends S.Class<AvailabilityZone>(
  "AvailabilityZone",
)({
  Name: S.optional(S.String),
  SupportedPlatforms: S.optional(SupportedPlatformsList),
}) {}
export class Subnet extends S.Class<Subnet>("Subnet")({
  SubnetIdentifier: S.optional(S.String),
  SubnetAvailabilityZone: S.optional(AvailabilityZone),
  SubnetStatus: S.optional(S.String),
}) {}
export const SubnetList = S.Array(Subnet.pipe(T.XmlName("Subnet")));
export class ClusterSubnetGroup extends S.Class<ClusterSubnetGroup>(
  "ClusterSubnetGroup",
)({
  ClusterSubnetGroupName: S.optional(S.String),
  Description: S.optional(S.String),
  VpcId: S.optional(S.String),
  SubnetGroupStatus: S.optional(S.String),
  Subnets: S.optional(SubnetList),
  Tags: S.optional(TagList),
  SupportedClusterIpAddressTypes: S.optional(ValueStringList),
}) {}
export const ClusterSubnetGroups = S.Array(
  ClusterSubnetGroup.pipe(T.XmlName("ClusterSubnetGroup")),
);
export class DataShareAssociation extends S.Class<DataShareAssociation>(
  "DataShareAssociation",
)({
  ConsumerIdentifier: S.optional(S.String),
  Status: S.optional(S.String),
  ConsumerRegion: S.optional(S.String),
  CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StatusChangeDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ProducerAllowedWrites: S.optional(S.Boolean),
  ConsumerAcceptedWrites: S.optional(S.Boolean),
}) {}
export const DataShareAssociationList = S.Array(DataShareAssociation);
export class DataShare extends S.Class<DataShare>("DataShare")(
  {
    DataShareArn: S.optional(S.String),
    ProducerArn: S.optional(S.String),
    AllowPubliclyAccessibleConsumers: S.optional(S.Boolean),
    DataShareAssociations: S.optional(DataShareAssociationList),
    ManagedBy: S.optional(S.String),
    DataShareType: S.optional(S.String),
  },
  ns,
) {}
export const DataShareList = S.Array(DataShare);
export class EndpointAccess extends S.Class<EndpointAccess>("EndpointAccess")(
  {
    ClusterIdentifier: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
    SubnetGroupName: S.optional(S.String),
    EndpointStatus: S.optional(S.String),
    EndpointName: S.optional(S.String),
    EndpointCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Port: S.optional(S.Number),
    Address: S.optional(S.String),
    VpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
    VpcEndpoint: S.optional(VpcEndpoint),
  },
  ns,
) {}
export const EndpointAccesses = S.Array(EndpointAccess);
export class EndpointAuthorization extends S.Class<EndpointAuthorization>(
  "EndpointAuthorization",
)(
  {
    Grantor: S.optional(S.String),
    Grantee: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    AuthorizeTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ClusterStatus: S.optional(S.String),
    Status: S.optional(S.String),
    AllowedAllVPCs: S.optional(S.Boolean),
    AllowedVPCs: S.optional(VpcIdentifierList),
    EndpointCount: S.optional(S.Number),
  },
  ns,
) {}
export const EndpointAuthorizations = S.Array(EndpointAuthorization);
export class EventSubscription extends S.Class<EventSubscription>(
  "EventSubscription",
)({
  CustomerAwsId: S.optional(S.String),
  CustSubscriptionId: S.optional(S.String),
  SnsTopicArn: S.optional(S.String),
  Status: S.optional(S.String),
  SubscriptionCreationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  SourceType: S.optional(S.String),
  SourceIdsList: S.optional(SourceIdsList),
  EventCategoriesList: S.optional(EventCategoriesList),
  Severity: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
  Tags: S.optional(TagList),
}) {}
export const EventSubscriptionsList = S.Array(
  EventSubscription.pipe(T.XmlName("EventSubscription")),
);
export class HsmClientCertificate extends S.Class<HsmClientCertificate>(
  "HsmClientCertificate",
)({
  HsmClientCertificateIdentifier: S.optional(S.String),
  HsmClientCertificatePublicKey: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const HsmClientCertificateList = S.Array(
  HsmClientCertificate.pipe(T.XmlName("HsmClientCertificate")),
);
export class HsmConfiguration extends S.Class<HsmConfiguration>(
  "HsmConfiguration",
)({
  HsmConfigurationIdentifier: S.optional(S.String),
  Description: S.optional(S.String),
  HsmIpAddress: S.optional(S.String),
  HsmPartitionName: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const HsmConfigurationList = S.Array(
  HsmConfiguration.pipe(T.XmlName("HsmConfiguration")),
);
export class DescribeIntegrationsFilter extends S.Class<DescribeIntegrationsFilter>(
  "DescribeIntegrationsFilter",
)({ Name: S.String, Values: DescribeIntegrationsFilterValueList }) {}
export const DescribeIntegrationsFilterList = S.Array(
  DescribeIntegrationsFilter.pipe(T.XmlName("DescribeIntegrationsFilter")),
);
export class NodeConfigurationOptionsFilter extends S.Class<NodeConfigurationOptionsFilter>(
  "NodeConfigurationOptionsFilter",
)({
  Name: S.optional(S.String),
  Operator: S.optional(S.String),
  Values: S.optional(ValueStringList).pipe(T.XmlName("Value")),
}) {}
export const NodeConfigurationOptionsFilterList = S.Array(
  NodeConfigurationOptionsFilter.pipe(
    T.XmlName("NodeConfigurationOptionsFilter"),
  ),
);
export class RecurringCharge extends S.Class<RecurringCharge>(
  "RecurringCharge",
)({
  RecurringChargeAmount: S.optional(S.Number),
  RecurringChargeFrequency: S.optional(S.String),
}) {}
export const RecurringChargeList = S.Array(
  RecurringCharge.pipe(T.XmlName("RecurringCharge")),
);
export class ReservedNode extends S.Class<ReservedNode>("ReservedNode")({
  ReservedNodeId: S.optional(S.String),
  ReservedNodeOfferingId: S.optional(S.String),
  NodeType: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Duration: S.optional(S.Number),
  FixedPrice: S.optional(S.Number),
  UsagePrice: S.optional(S.Number),
  CurrencyCode: S.optional(S.String),
  NodeCount: S.optional(S.Number),
  State: S.optional(S.String),
  OfferingType: S.optional(S.String),
  RecurringCharges: S.optional(RecurringChargeList),
  ReservedNodeOfferingType: S.optional(S.String),
}) {}
export const ReservedNodeList = S.Array(
  ReservedNode.pipe(T.XmlName("ReservedNode")),
);
export class ScheduledActionFilter extends S.Class<ScheduledActionFilter>(
  "ScheduledActionFilter",
)({ Name: S.String, Values: ValueStringList }) {}
export const ScheduledActionFilterList = S.Array(
  ScheduledActionFilter.pipe(T.XmlName("ScheduledActionFilter")),
);
export class SnapshotCopyGrant extends S.Class<SnapshotCopyGrant>(
  "SnapshotCopyGrant",
)({
  SnapshotCopyGrantName: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const SnapshotCopyGrantList = S.Array(
  SnapshotCopyGrant.pipe(T.XmlName("SnapshotCopyGrant")),
);
export class ClusterAssociatedToSchedule extends S.Class<ClusterAssociatedToSchedule>(
  "ClusterAssociatedToSchedule",
)({
  ClusterIdentifier: S.optional(S.String),
  ScheduleAssociationState: S.optional(S.String),
}) {}
export const AssociatedClusterList = S.Array(
  ClusterAssociatedToSchedule.pipe(T.XmlName("ClusterAssociatedToSchedule")),
);
export class SnapshotSchedule extends S.Class<SnapshotSchedule>(
  "SnapshotSchedule",
)(
  {
    ScheduleDefinitions: S.optional(ScheduleDefinitionList),
    ScheduleIdentifier: S.optional(S.String),
    ScheduleDescription: S.optional(S.String),
    Tags: S.optional(TagList),
    NextInvocations: S.optional(ScheduledSnapshotTimeList),
    AssociatedClusterCount: S.optional(S.Number),
    AssociatedClusters: S.optional(AssociatedClusterList),
  },
  ns,
) {}
export const SnapshotScheduleList = S.Array(
  SnapshotSchedule.pipe(T.XmlName("SnapshotSchedule")),
);
export class UsageLimit extends S.Class<UsageLimit>("UsageLimit")(
  {
    UsageLimitId: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    FeatureType: S.optional(S.String),
    LimitType: S.optional(S.String),
    Amount: S.optional(S.Number),
    Period: S.optional(S.String),
    BreachAction: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  ns,
) {}
export const UsageLimits = S.Array(UsageLimit);
export const ScheduledActionTimeList = S.Array(
  S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.XmlName("ScheduledActionTime"),
  ),
);
export class BatchModifyClusterSnapshotsOutputMessage extends S.Class<BatchModifyClusterSnapshotsOutputMessage>(
  "BatchModifyClusterSnapshotsOutputMessage",
)(
  {
    Resources: S.optional(SnapshotIdentifierList),
    Errors: S.optional(BatchSnapshotOperationErrors),
  },
  ns,
) {}
export class ResizeProgressMessage extends S.Class<ResizeProgressMessage>(
  "ResizeProgressMessage",
)(
  {
    TargetNodeType: S.optional(S.String),
    TargetNumberOfNodes: S.optional(S.Number),
    TargetClusterType: S.optional(S.String),
    Status: S.optional(S.String),
    ImportTablesCompleted: S.optional(ImportTablesCompleted),
    ImportTablesInProgress: S.optional(ImportTablesInProgress),
    ImportTablesNotStarted: S.optional(ImportTablesNotStarted),
    AvgResizeRateInMegaBytesPerSecond: S.optional(S.Number),
    TotalResizeDataInMegaBytes: S.optional(S.Number),
    ProgressInMegaBytes: S.optional(S.Number),
    ElapsedTimeInSeconds: S.optional(S.Number),
    EstimatedTimeToCompletionInSeconds: S.optional(S.Number),
    ResizeType: S.optional(S.String),
    Message: S.optional(S.String),
    TargetEncryptionType: S.optional(S.String),
    DataTransferProgressPercent: S.optional(S.Number),
  },
  ns,
) {}
export class AccountWithRestoreAccess extends S.Class<AccountWithRestoreAccess>(
  "AccountWithRestoreAccess",
)({ AccountId: S.optional(S.String), AccountAlias: S.optional(S.String) }) {}
export const AccountsWithRestoreAccessList = S.Array(
  AccountWithRestoreAccess.pipe(T.XmlName("AccountWithRestoreAccess")),
);
export const RestorableNodeTypeList = S.Array(
  S.String.pipe(T.XmlName("NodeType")),
);
export class Snapshot extends S.Class<Snapshot>("Snapshot")({
  SnapshotIdentifier: S.optional(S.String),
  ClusterIdentifier: S.optional(S.String),
  SnapshotCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Status: S.optional(S.String),
  Port: S.optional(S.Number),
  AvailabilityZone: S.optional(S.String),
  ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  MasterUsername: S.optional(S.String),
  ClusterVersion: S.optional(S.String),
  EngineFullVersion: S.optional(S.String),
  SnapshotType: S.optional(S.String),
  NodeType: S.optional(S.String),
  NumberOfNodes: S.optional(S.Number),
  DBName: S.optional(S.String),
  VpcId: S.optional(S.String),
  Encrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  EncryptedWithHSM: S.optional(S.Boolean),
  AccountsWithRestoreAccess: S.optional(AccountsWithRestoreAccessList),
  OwnerAccount: S.optional(S.String),
  TotalBackupSizeInMegaBytes: S.optional(S.Number),
  ActualIncrementalBackupSizeInMegaBytes: S.optional(S.Number),
  BackupProgressInMegaBytes: S.optional(S.Number),
  CurrentBackupRateInMegaBytesPerSecond: S.optional(S.Number),
  EstimatedSecondsToCompletion: S.optional(S.Number),
  ElapsedTimeInSeconds: S.optional(S.Number),
  SourceRegion: S.optional(S.String),
  Tags: S.optional(TagList),
  RestorableNodeTypes: S.optional(RestorableNodeTypeList),
  EnhancedVpcRouting: S.optional(S.Boolean),
  MaintenanceTrackName: S.optional(S.String),
  ManualSnapshotRetentionPeriod: S.optional(S.Number),
  ManualSnapshotRemainingDays: S.optional(S.Number),
  SnapshotRetentionStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  MasterPasswordSecretArn: S.optional(S.String),
  MasterPasswordSecretKmsKeyId: S.optional(S.String),
  SnapshotArn: S.optional(S.String),
}) {}
export class CopyClusterSnapshotResult extends S.Class<CopyClusterSnapshotResult>(
  "CopyClusterSnapshotResult",
)({ Snapshot: S.optional(Snapshot) }, ns) {}
export class CreateAuthenticationProfileResult extends S.Class<CreateAuthenticationProfileResult>(
  "CreateAuthenticationProfileResult",
)(
  {
    AuthenticationProfileName: S.optional(S.String),
    AuthenticationProfileContent: S.optional(S.String),
  },
  ns,
) {}
export class CreateClusterMessage extends S.Class<CreateClusterMessage>(
  "CreateClusterMessage",
)(
  {
    DBName: S.optional(S.String),
    ClusterIdentifier: S.String,
    ClusterType: S.optional(S.String),
    NodeType: S.String,
    MasterUsername: S.String,
    MasterUserPassword: S.optional(S.String),
    ClusterSecurityGroups: S.optional(ClusterSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    ClusterSubnetGroupName: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    ClusterParameterGroupName: S.optional(S.String),
    AutomatedSnapshotRetentionPeriod: S.optional(S.Number),
    ManualSnapshotRetentionPeriod: S.optional(S.Number),
    Port: S.optional(S.Number),
    ClusterVersion: S.optional(S.String),
    AllowVersionUpgrade: S.optional(S.Boolean),
    NumberOfNodes: S.optional(S.Number),
    PubliclyAccessible: S.optional(S.Boolean),
    Encrypted: S.optional(S.Boolean),
    HsmClientCertificateIdentifier: S.optional(S.String),
    HsmConfigurationIdentifier: S.optional(S.String),
    ElasticIp: S.optional(S.String),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    EnhancedVpcRouting: S.optional(S.Boolean),
    AdditionalInfo: S.optional(S.String),
    IamRoles: S.optional(IamRoleArnList),
    MaintenanceTrackName: S.optional(S.String),
    SnapshotScheduleIdentifier: S.optional(S.String),
    AvailabilityZoneRelocation: S.optional(S.Boolean),
    AquaConfigurationStatus: S.optional(S.String),
    DefaultIamRoleArn: S.optional(S.String),
    LoadSampleData: S.optional(S.String),
    ManageMasterPassword: S.optional(S.Boolean),
    MasterPasswordSecretKmsKeyId: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    RedshiftIdcApplicationArn: S.optional(S.String),
    CatalogName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateClusterSecurityGroupResult extends S.Class<CreateClusterSecurityGroupResult>(
  "CreateClusterSecurityGroupResult",
)({ ClusterSecurityGroup: S.optional(ClusterSecurityGroup) }, ns) {}
export class CreateClusterSnapshotResult extends S.Class<CreateClusterSnapshotResult>(
  "CreateClusterSnapshotResult",
)({ Snapshot: S.optional(Snapshot) }, ns) {}
export class CreateCustomDomainAssociationResult extends S.Class<CreateCustomDomainAssociationResult>(
  "CreateCustomDomainAssociationResult",
)(
  {
    CustomDomainName: S.optional(S.String),
    CustomDomainCertificateArn: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    CustomDomainCertExpiryTime: S.optional(S.String),
  },
  ns,
) {}
export class CreateIntegrationMessage extends S.Class<CreateIntegrationMessage>(
  "CreateIntegrationMessage",
)(
  {
    SourceArn: S.String,
    TargetArn: S.String,
    IntegrationName: S.String,
    KMSKeyId: S.optional(S.String),
    TagList: S.optional(TagList),
    AdditionalEncryptionContext: S.optional(EncryptionContextMap),
    Description: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateScheduledActionMessage extends S.Class<CreateScheduledActionMessage>(
  "CreateScheduledActionMessage",
)(
  {
    ScheduledActionName: S.String,
    TargetAction: ScheduledActionType,
    Schedule: S.String,
    IamRole: S.String,
    ScheduledActionDescription: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Enable: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAuthenticationProfileResult extends S.Class<DeleteAuthenticationProfileResult>(
  "DeleteAuthenticationProfileResult",
)({ AuthenticationProfileName: S.optional(S.String) }, ns) {}
export class DeleteClusterSnapshotResult extends S.Class<DeleteClusterSnapshotResult>(
  "DeleteClusterSnapshotResult",
)({ Snapshot: S.optional(Snapshot) }, ns) {}
export class ClusterParameterGroupsMessage extends S.Class<ClusterParameterGroupsMessage>(
  "ClusterParameterGroupsMessage",
)(
  {
    Marker: S.optional(S.String),
    ParameterGroups: S.optional(ParameterGroupList),
  },
  ns,
) {}
export class ClusterParameterGroupDetails extends S.Class<ClusterParameterGroupDetails>(
  "ClusterParameterGroupDetails",
)(
  { Parameters: S.optional(ParametersList), Marker: S.optional(S.String) },
  ns,
) {}
export class ClustersMessage extends S.Class<ClustersMessage>(
  "ClustersMessage",
)({ Marker: S.optional(S.String), Clusters: S.optional(ClusterList) }, ns) {}
export class ClusterSecurityGroupMessage extends S.Class<ClusterSecurityGroupMessage>(
  "ClusterSecurityGroupMessage",
)(
  {
    Marker: S.optional(S.String),
    ClusterSecurityGroups: S.optional(ClusterSecurityGroups),
  },
  ns,
) {}
export class DescribeClusterSnapshotsMessage extends S.Class<DescribeClusterSnapshotsMessage>(
  "DescribeClusterSnapshotsMessage",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    SnapshotIdentifier: S.optional(S.String),
    SnapshotArn: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    OwnerAccount: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
    TagValues: S.optional(TagValueList),
    ClusterExists: S.optional(S.Boolean),
    SortingEntities: S.optional(SnapshotSortingEntityList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ClusterSubnetGroupMessage extends S.Class<ClusterSubnetGroupMessage>(
  "ClusterSubnetGroupMessage",
)(
  {
    Marker: S.optional(S.String),
    ClusterSubnetGroups: S.optional(ClusterSubnetGroups),
  },
  ns,
) {}
export class DescribeDataSharesResult extends S.Class<DescribeDataSharesResult>(
  "DescribeDataSharesResult",
)(
  { DataShares: S.optional(DataShareList), Marker: S.optional(S.String) },
  ns,
) {}
export class DescribeDataSharesForConsumerResult extends S.Class<DescribeDataSharesForConsumerResult>(
  "DescribeDataSharesForConsumerResult",
)(
  { DataShares: S.optional(DataShareList), Marker: S.optional(S.String) },
  ns,
) {}
export class DescribeDataSharesForProducerResult extends S.Class<DescribeDataSharesForProducerResult>(
  "DescribeDataSharesForProducerResult",
)(
  { DataShares: S.optional(DataShareList), Marker: S.optional(S.String) },
  ns,
) {}
export class EndpointAccessList extends S.Class<EndpointAccessList>(
  "EndpointAccessList",
)(
  {
    EndpointAccessList: S.optional(EndpointAccesses),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class EndpointAuthorizationList extends S.Class<EndpointAuthorizationList>(
  "EndpointAuthorizationList",
)(
  {
    EndpointAuthorizationList: S.optional(EndpointAuthorizations),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class EventSubscriptionsMessage extends S.Class<EventSubscriptionsMessage>(
  "EventSubscriptionsMessage",
)(
  {
    Marker: S.optional(S.String),
    EventSubscriptionsList: S.optional(EventSubscriptionsList),
  },
  ns,
) {}
export class HsmClientCertificateMessage extends S.Class<HsmClientCertificateMessage>(
  "HsmClientCertificateMessage",
)(
  {
    Marker: S.optional(S.String),
    HsmClientCertificates: S.optional(HsmClientCertificateList),
  },
  ns,
) {}
export class HsmConfigurationMessage extends S.Class<HsmConfigurationMessage>(
  "HsmConfigurationMessage",
)(
  {
    Marker: S.optional(S.String),
    HsmConfigurations: S.optional(HsmConfigurationList),
  },
  ns,
) {}
export class DescribeIntegrationsMessage extends S.Class<DescribeIntegrationsMessage>(
  "DescribeIntegrationsMessage",
)(
  {
    IntegrationArn: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    Filters: S.optional(DescribeIntegrationsFilterList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class LoggingStatus extends S.Class<LoggingStatus>("LoggingStatus")(
  {
    LoggingEnabled: S.optional(S.Boolean),
    BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    LastSuccessfulDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    LastFailureTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastFailureMessage: S.optional(S.String),
    LogDestinationType: S.optional(S.String),
    LogExports: S.optional(LogTypeList),
  },
  ns,
) {}
export class DescribeNodeConfigurationOptionsMessage extends S.Class<DescribeNodeConfigurationOptionsMessage>(
  "DescribeNodeConfigurationOptionsMessage",
)(
  {
    ActionType: S.String,
    ClusterIdentifier: S.optional(S.String),
    SnapshotIdentifier: S.optional(S.String),
    SnapshotArn: S.optional(S.String),
    OwnerAccount: S.optional(S.String),
    Filters: S.optional(NodeConfigurationOptionsFilterList).pipe(
      T.XmlName("Filter"),
    ),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ReservedNodesMessage extends S.Class<ReservedNodesMessage>(
  "ReservedNodesMessage",
)(
  { Marker: S.optional(S.String), ReservedNodes: S.optional(ReservedNodeList) },
  ns,
) {}
export class DescribeScheduledActionsMessage extends S.Class<DescribeScheduledActionsMessage>(
  "DescribeScheduledActionsMessage",
)(
  {
    ScheduledActionName: S.optional(S.String),
    TargetActionType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Active: S.optional(S.Boolean),
    Filters: S.optional(ScheduledActionFilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SnapshotCopyGrantMessage extends S.Class<SnapshotCopyGrantMessage>(
  "SnapshotCopyGrantMessage",
)(
  {
    Marker: S.optional(S.String),
    SnapshotCopyGrants: S.optional(SnapshotCopyGrantList),
  },
  ns,
) {}
export class DescribeSnapshotSchedulesOutputMessage extends S.Class<DescribeSnapshotSchedulesOutputMessage>(
  "DescribeSnapshotSchedulesOutputMessage",
)(
  {
    SnapshotSchedules: S.optional(SnapshotScheduleList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class UsageLimitList extends S.Class<UsageLimitList>("UsageLimitList")(
  { UsageLimits: S.optional(UsageLimits), Marker: S.optional(S.String) },
  ns,
) {}
export class DisableSnapshotCopyResult extends S.Class<DisableSnapshotCopyResult>(
  "DisableSnapshotCopyResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class EnableSnapshotCopyResult extends S.Class<EnableSnapshotCopyResult>(
  "EnableSnapshotCopyResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class FailoverPrimaryComputeResult extends S.Class<FailoverPrimaryComputeResult>(
  "FailoverPrimaryComputeResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class ClusterCredentials extends S.Class<ClusterCredentials>(
  "ClusterCredentials",
)(
  {
    DbUser: S.optional(S.String),
    DbPassword: S.optional(S.String),
    Expiration: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  },
  ns,
) {}
export class ClusterExtendedCredentials extends S.Class<ClusterExtendedCredentials>(
  "ClusterExtendedCredentials",
)(
  {
    DbUser: S.optional(S.String),
    DbPassword: S.optional(S.String),
    Expiration: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NextRefreshTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  },
  ns,
) {}
export class GetIdentityCenterAuthTokenResponse extends S.Class<GetIdentityCenterAuthTokenResponse>(
  "GetIdentityCenterAuthTokenResponse",
)(
  {
    Token: S.optional(S.String),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  },
  ns,
) {}
export class ReservedNodeOffering extends S.Class<ReservedNodeOffering>(
  "ReservedNodeOffering",
)({
  ReservedNodeOfferingId: S.optional(S.String),
  NodeType: S.optional(S.String),
  Duration: S.optional(S.Number),
  FixedPrice: S.optional(S.Number),
  UsagePrice: S.optional(S.Number),
  CurrencyCode: S.optional(S.String),
  OfferingType: S.optional(S.String),
  RecurringCharges: S.optional(RecurringChargeList),
  ReservedNodeOfferingType: S.optional(S.String),
}) {}
export const ReservedNodeOfferingList = S.Array(
  ReservedNodeOffering.pipe(T.XmlName("ReservedNodeOffering")),
);
export class GetReservedNodeExchangeOfferingsOutputMessage extends S.Class<GetReservedNodeExchangeOfferingsOutputMessage>(
  "GetReservedNodeExchangeOfferingsOutputMessage",
)(
  {
    Marker: S.optional(S.String),
    ReservedNodeOfferings: S.optional(ReservedNodeOfferingList),
  },
  ns,
) {}
export class ModifyAuthenticationProfileResult extends S.Class<ModifyAuthenticationProfileResult>(
  "ModifyAuthenticationProfileResult",
)(
  {
    AuthenticationProfileName: S.optional(S.String),
    AuthenticationProfileContent: S.optional(S.String),
  },
  ns,
) {}
export class ModifyClusterResult extends S.Class<ModifyClusterResult>(
  "ModifyClusterResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class ModifyClusterDbRevisionResult extends S.Class<ModifyClusterDbRevisionResult>(
  "ModifyClusterDbRevisionResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class ModifyClusterIamRolesResult extends S.Class<ModifyClusterIamRolesResult>(
  "ModifyClusterIamRolesResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class ModifyClusterMaintenanceResult extends S.Class<ModifyClusterMaintenanceResult>(
  "ModifyClusterMaintenanceResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class ModifyClusterParameterGroupMessage extends S.Class<ModifyClusterParameterGroupMessage>(
  "ModifyClusterParameterGroupMessage",
)(
  { ParameterGroupName: S.String, Parameters: ParametersList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyClusterSnapshotResult extends S.Class<ModifyClusterSnapshotResult>(
  "ModifyClusterSnapshotResult",
)({ Snapshot: S.optional(Snapshot) }, ns) {}
export class ModifyClusterSubnetGroupResult extends S.Class<ModifyClusterSubnetGroupResult>(
  "ModifyClusterSubnetGroupResult",
)({ ClusterSubnetGroup: S.optional(ClusterSubnetGroup) }, ns) {}
export class ModifyCustomDomainAssociationResult extends S.Class<ModifyCustomDomainAssociationResult>(
  "ModifyCustomDomainAssociationResult",
)(
  {
    CustomDomainName: S.optional(S.String),
    CustomDomainCertificateArn: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    CustomDomainCertExpiryTime: S.optional(S.String),
  },
  ns,
) {}
export class ModifyEventSubscriptionResult extends S.Class<ModifyEventSubscriptionResult>(
  "ModifyEventSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class LakehouseConfiguration extends S.Class<LakehouseConfiguration>(
  "LakehouseConfiguration",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    LakehouseIdcApplicationArn: S.optional(S.String),
    LakehouseRegistrationStatus: S.optional(S.String),
    CatalogArn: S.optional(S.String),
  },
  ns,
) {}
export class RedshiftIdcApplication extends S.Class<RedshiftIdcApplication>(
  "RedshiftIdcApplication",
)({
  IdcInstanceArn: S.optional(S.String),
  RedshiftIdcApplicationName: S.optional(S.String),
  RedshiftIdcApplicationArn: S.optional(S.String),
  IdentityNamespace: S.optional(S.String),
  IdcDisplayName: S.optional(S.String),
  IamRoleArn: S.optional(S.String),
  IdcManagedApplicationArn: S.optional(S.String),
  IdcOnboardStatus: S.optional(S.String),
  AuthorizedTokenIssuerList: S.optional(AuthorizedTokenIssuerList),
  ServiceIntegrations: S.optional(ServiceIntegrationList),
  ApplicationType: S.optional(S.String),
  Tags: S.optional(TagList),
  SsoTagKeys: S.optional(TagKeyList),
}) {}
export class ModifyRedshiftIdcApplicationResult extends S.Class<ModifyRedshiftIdcApplicationResult>(
  "ModifyRedshiftIdcApplicationResult",
)({ RedshiftIdcApplication: S.optional(RedshiftIdcApplication) }, ns) {}
export class ScheduledAction extends S.Class<ScheduledAction>(
  "ScheduledAction",
)(
  {
    ScheduledActionName: S.optional(S.String),
    TargetAction: S.optional(ScheduledActionType),
    Schedule: S.optional(S.String),
    IamRole: S.optional(S.String),
    ScheduledActionDescription: S.optional(S.String),
    State: S.optional(S.String),
    NextInvocations: S.optional(ScheduledActionTimeList),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  },
  ns,
) {}
export class ModifySnapshotCopyRetentionPeriodResult extends S.Class<ModifySnapshotCopyRetentionPeriodResult>(
  "ModifySnapshotCopyRetentionPeriodResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class PauseClusterResult extends S.Class<PauseClusterResult>(
  "PauseClusterResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class PurchaseReservedNodeOfferingResult extends S.Class<PurchaseReservedNodeOfferingResult>(
  "PurchaseReservedNodeOfferingResult",
)({ ReservedNode: S.optional(ReservedNode) }, ns) {}
export class ResourcePolicy extends S.Class<ResourcePolicy>("ResourcePolicy")({
  ResourceArn: S.optional(S.String),
  Policy: S.optional(S.String),
}) {}
export class PutResourcePolicyResult extends S.Class<PutResourcePolicyResult>(
  "PutResourcePolicyResult",
)({ ResourcePolicy: S.optional(ResourcePolicy) }, ns) {}
export class RebootClusterResult extends S.Class<RebootClusterResult>(
  "RebootClusterResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class RegisterNamespaceOutputMessage extends S.Class<RegisterNamespaceOutputMessage>(
  "RegisterNamespaceOutputMessage",
)({ Status: S.optional(S.String) }, ns) {}
export class ClusterParameterGroupNameMessage extends S.Class<ClusterParameterGroupNameMessage>(
  "ClusterParameterGroupNameMessage",
)(
  {
    ParameterGroupName: S.optional(S.String),
    ParameterGroupStatus: S.optional(S.String),
  },
  ns,
) {}
export class ResizeClusterResult extends S.Class<ResizeClusterResult>(
  "ResizeClusterResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class RestoreFromClusterSnapshotResult extends S.Class<RestoreFromClusterSnapshotResult>(
  "RestoreFromClusterSnapshotResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class TableRestoreStatus extends S.Class<TableRestoreStatus>(
  "TableRestoreStatus",
)({
  TableRestoreRequestId: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  RequestTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ProgressInMegaBytes: S.optional(S.Number),
  TotalDataInMegaBytes: S.optional(S.Number),
  ClusterIdentifier: S.optional(S.String),
  SnapshotIdentifier: S.optional(S.String),
  SourceDatabaseName: S.optional(S.String),
  SourceSchemaName: S.optional(S.String),
  SourceTableName: S.optional(S.String),
  TargetDatabaseName: S.optional(S.String),
  TargetSchemaName: S.optional(S.String),
  NewTableName: S.optional(S.String),
}) {}
export class RestoreTableFromClusterSnapshotResult extends S.Class<RestoreTableFromClusterSnapshotResult>(
  "RestoreTableFromClusterSnapshotResult",
)({ TableRestoreStatus: S.optional(TableRestoreStatus) }, ns) {}
export class ResumeClusterResult extends S.Class<ResumeClusterResult>(
  "ResumeClusterResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class RevokeClusterSecurityGroupIngressResult extends S.Class<RevokeClusterSecurityGroupIngressResult>(
  "RevokeClusterSecurityGroupIngressResult",
)({ ClusterSecurityGroup: S.optional(ClusterSecurityGroup) }, ns) {}
export class RevokeSnapshotAccessResult extends S.Class<RevokeSnapshotAccessResult>(
  "RevokeSnapshotAccessResult",
)({ Snapshot: S.optional(Snapshot) }, ns) {}
export class RotateEncryptionKeyResult extends S.Class<RotateEncryptionKeyResult>(
  "RotateEncryptionKeyResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export const BatchSnapshotOperationErrorList = S.Array(
  SnapshotErrorMessage.pipe(T.XmlName("SnapshotErrorMessage")),
);
export class IntegrationError extends S.Class<IntegrationError>(
  "IntegrationError",
)({ ErrorCode: S.String, ErrorMessage: S.optional(S.String) }) {}
export const IntegrationErrorList = S.Array(
  IntegrationError.pipe(T.XmlName("IntegrationError")),
);
export class AuthenticationProfile extends S.Class<AuthenticationProfile>(
  "AuthenticationProfile",
)({
  AuthenticationProfileName: S.optional(S.String),
  AuthenticationProfileContent: S.optional(S.String),
}) {}
export const AuthenticationProfileList = S.Array(AuthenticationProfile);
export const SnapshotList = S.Array(Snapshot.pipe(T.XmlName("Snapshot")));
export class ClusterVersion extends S.Class<ClusterVersion>("ClusterVersion")({
  ClusterVersion: S.optional(S.String),
  ClusterParameterGroupFamily: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const ClusterVersionList = S.Array(
  ClusterVersion.pipe(T.XmlName("ClusterVersion")),
);
export class DefaultClusterParameters extends S.Class<DefaultClusterParameters>(
  "DefaultClusterParameters",
)({
  ParameterGroupFamily: S.optional(S.String),
  Marker: S.optional(S.String),
  Parameters: S.optional(ParametersList),
}) {}
export class Event extends S.Class<Event>("Event")({
  SourceIdentifier: S.optional(S.String),
  SourceType: S.optional(S.String),
  Message: S.optional(S.String),
  EventCategories: S.optional(EventCategoriesList),
  Severity: S.optional(S.String),
  Date: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EventId: S.optional(S.String),
}) {}
export const EventList = S.Array(Event.pipe(T.XmlName("Event")));
export class InboundIntegration extends S.Class<InboundIntegration>(
  "InboundIntegration",
)({
  IntegrationArn: S.optional(S.String),
  SourceArn: S.optional(S.String),
  TargetArn: S.optional(S.String),
  Status: S.optional(S.String),
  Errors: S.optional(IntegrationErrorList),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const InboundIntegrationList = S.Array(
  InboundIntegration.pipe(T.XmlName("InboundIntegration")),
);
export class Integration extends S.Class<Integration>("Integration")(
  {
    IntegrationArn: S.optional(S.String),
    IntegrationName: S.optional(S.String),
    SourceArn: S.optional(S.String),
    TargetArn: S.optional(S.String),
    Status: S.optional(S.String),
    Errors: S.optional(IntegrationErrorList),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Description: S.optional(S.String),
    KMSKeyId: S.optional(S.String),
    AdditionalEncryptionContext: S.optional(EncryptionContextMap),
    Tags: S.optional(TagList),
  },
  ns,
) {}
export const IntegrationList = S.Array(
  Integration.pipe(T.XmlName("Integration")),
);
export class PartnerIntegrationInfo extends S.Class<PartnerIntegrationInfo>(
  "PartnerIntegrationInfo",
)({
  DatabaseName: S.optional(S.String),
  PartnerName: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const PartnerIntegrationInfoList = S.Array(
  PartnerIntegrationInfo.pipe(T.XmlName("PartnerIntegrationInfo")),
);
export const RedshiftIdcApplicationList = S.Array(RedshiftIdcApplication);
export const ReservedNodeExchangeStatusList = S.Array(
  ReservedNodeExchangeStatus.pipe(T.XmlName("ReservedNodeExchangeStatus")),
);
export const ScheduledActionList = S.Array(
  ScheduledAction.pipe(T.XmlName("ScheduledAction")),
);
export const TableRestoreStatusList = S.Array(
  TableRestoreStatus.pipe(T.XmlName("TableRestoreStatus")),
);
export class TaggedResource extends S.Class<TaggedResource>("TaggedResource")({
  Tag: S.optional(Tag),
  ResourceName: S.optional(S.String),
  ResourceType: S.optional(S.String),
}) {}
export const TaggedResourceList = S.Array(
  TaggedResource.pipe(T.XmlName("TaggedResource")),
);
export class ReservedNodeConfigurationOption extends S.Class<ReservedNodeConfigurationOption>(
  "ReservedNodeConfigurationOption",
)({
  SourceReservedNode: S.optional(ReservedNode),
  TargetReservedNodeCount: S.optional(S.Number),
  TargetReservedNodeOffering: S.optional(ReservedNodeOffering),
}) {}
export const ReservedNodeConfigurationOptionList = S.Array(
  ReservedNodeConfigurationOption.pipe(
    T.XmlName("ReservedNodeConfigurationOption"),
  ),
);
export class BatchDeleteClusterSnapshotsResult extends S.Class<BatchDeleteClusterSnapshotsResult>(
  "BatchDeleteClusterSnapshotsResult",
)(
  {
    Resources: S.optional(SnapshotIdentifierList),
    Errors: S.optional(BatchSnapshotOperationErrorList),
  },
  ns,
) {}
export class CreateClusterResult extends S.Class<CreateClusterResult>(
  "CreateClusterResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class CreateClusterParameterGroupResult extends S.Class<CreateClusterParameterGroupResult>(
  "CreateClusterParameterGroupResult",
)({ ClusterParameterGroup: S.optional(ClusterParameterGroup) }, ns) {}
export class CreateEventSubscriptionResult extends S.Class<CreateEventSubscriptionResult>(
  "CreateEventSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class CreateHsmClientCertificateResult extends S.Class<CreateHsmClientCertificateResult>(
  "CreateHsmClientCertificateResult",
)({ HsmClientCertificate: S.optional(HsmClientCertificate) }, ns) {}
export class CreateHsmConfigurationResult extends S.Class<CreateHsmConfigurationResult>(
  "CreateHsmConfigurationResult",
)({ HsmConfiguration: S.optional(HsmConfiguration) }, ns) {}
export class CreateSnapshotCopyGrantResult extends S.Class<CreateSnapshotCopyGrantResult>(
  "CreateSnapshotCopyGrantResult",
)({ SnapshotCopyGrant: S.optional(SnapshotCopyGrant) }, ns) {}
export class DeregisterNamespaceInputMessage extends S.Class<DeregisterNamespaceInputMessage>(
  "DeregisterNamespaceInputMessage",
)(
  {
    NamespaceIdentifier: NamespaceIdentifierUnion,
    ConsumerIdentifiers: ConsumerIdentifierList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAuthenticationProfilesResult extends S.Class<DescribeAuthenticationProfilesResult>(
  "DescribeAuthenticationProfilesResult",
)({ AuthenticationProfiles: S.optional(AuthenticationProfileList) }, ns) {}
export class SnapshotMessage extends S.Class<SnapshotMessage>(
  "SnapshotMessage",
)({ Marker: S.optional(S.String), Snapshots: S.optional(SnapshotList) }, ns) {}
export class ClusterVersionsMessage extends S.Class<ClusterVersionsMessage>(
  "ClusterVersionsMessage",
)(
  {
    Marker: S.optional(S.String),
    ClusterVersions: S.optional(ClusterVersionList),
  },
  ns,
) {}
export class DescribeDefaultClusterParametersResult extends S.Class<DescribeDefaultClusterParametersResult>(
  "DescribeDefaultClusterParametersResult",
)({ DefaultClusterParameters: S.optional(DefaultClusterParameters) }, ns) {}
export class EventsMessage extends S.Class<EventsMessage>("EventsMessage")(
  { Marker: S.optional(S.String), Events: S.optional(EventList) },
  ns,
) {}
export class InboundIntegrationsMessage extends S.Class<InboundIntegrationsMessage>(
  "InboundIntegrationsMessage",
)(
  {
    Marker: S.optional(S.String),
    InboundIntegrations: S.optional(InboundIntegrationList),
  },
  ns,
) {}
export class IntegrationsMessage extends S.Class<IntegrationsMessage>(
  "IntegrationsMessage",
)(
  { Marker: S.optional(S.String), Integrations: S.optional(IntegrationList) },
  ns,
) {}
export class DescribePartnersOutputMessage extends S.Class<DescribePartnersOutputMessage>(
  "DescribePartnersOutputMessage",
)({ PartnerIntegrationInfoList: S.optional(PartnerIntegrationInfoList) }, ns) {}
export class DescribeRedshiftIdcApplicationsResult extends S.Class<DescribeRedshiftIdcApplicationsResult>(
  "DescribeRedshiftIdcApplicationsResult",
)(
  {
    RedshiftIdcApplications: S.optional(RedshiftIdcApplicationList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeReservedNodeExchangeStatusOutputMessage extends S.Class<DescribeReservedNodeExchangeStatusOutputMessage>(
  "DescribeReservedNodeExchangeStatusOutputMessage",
)(
  {
    ReservedNodeExchangeStatusDetails: S.optional(
      ReservedNodeExchangeStatusList,
    ),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ReservedNodeOfferingsMessage extends S.Class<ReservedNodeOfferingsMessage>(
  "ReservedNodeOfferingsMessage",
)(
  {
    Marker: S.optional(S.String),
    ReservedNodeOfferings: S.optional(ReservedNodeOfferingList),
  },
  ns,
) {}
export class ScheduledActionsMessage extends S.Class<ScheduledActionsMessage>(
  "ScheduledActionsMessage",
)(
  {
    Marker: S.optional(S.String),
    ScheduledActions: S.optional(ScheduledActionList),
  },
  ns,
) {}
export class TableRestoreStatusMessage extends S.Class<TableRestoreStatusMessage>(
  "TableRestoreStatusMessage",
)(
  {
    TableRestoreStatusDetails: S.optional(TableRestoreStatusList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class TaggedResourceListMessage extends S.Class<TaggedResourceListMessage>(
  "TaggedResourceListMessage",
)(
  {
    TaggedResources: S.optional(TaggedResourceList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class GetReservedNodeExchangeConfigurationOptionsOutputMessage extends S.Class<GetReservedNodeExchangeConfigurationOptionsOutputMessage>(
  "GetReservedNodeExchangeConfigurationOptionsOutputMessage",
)(
  {
    Marker: S.optional(S.String),
    ReservedNodeConfigurationOptionList: S.optional(
      ReservedNodeConfigurationOptionList,
    ),
  },
  ns,
) {}
export class GetResourcePolicyResult extends S.Class<GetResourcePolicyResult>(
  "GetResourcePolicyResult",
)({ ResourcePolicy: S.optional(ResourcePolicy) }, ns) {}
export class ModifyAquaOutputMessage extends S.Class<ModifyAquaOutputMessage>(
  "ModifyAquaOutputMessage",
)({ AquaConfiguration: S.optional(AquaConfiguration) }, ns) {}
export class AttributeValueTarget extends S.Class<AttributeValueTarget>(
  "AttributeValueTarget",
)({ AttributeValue: S.optional(S.String) }) {}
export const AttributeValueList = S.Array(
  AttributeValueTarget.pipe(T.XmlName("AttributeValueTarget")),
);
export class RevisionTarget extends S.Class<RevisionTarget>("RevisionTarget")({
  DatabaseRevision: S.optional(S.String),
  Description: S.optional(S.String),
  DatabaseRevisionReleaseDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export const RevisionTargetsList = S.Array(
  RevisionTarget.pipe(T.XmlName("RevisionTarget")),
);
export class CertificateAssociation extends S.Class<CertificateAssociation>(
  "CertificateAssociation",
)({
  CustomDomainName: S.optional(S.String),
  ClusterIdentifier: S.optional(S.String),
}) {}
export const CertificateAssociationList = S.Array(
  CertificateAssociation.pipe(T.XmlName("CertificateAssociation")),
);
export class EventInfoMap extends S.Class<EventInfoMap>("EventInfoMap")({
  EventId: S.optional(S.String),
  EventCategories: S.optional(EventCategoriesList),
  EventDescription: S.optional(S.String),
  Severity: S.optional(S.String),
}) {}
export const EventInfoMapList = S.Array(
  EventInfoMap.pipe(T.XmlName("EventInfoMap")),
);
export class RecommendedAction extends S.Class<RecommendedAction>(
  "RecommendedAction",
)({
  Text: S.optional(S.String),
  Database: S.optional(S.String),
  Command: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const RecommendedActionList = S.Array(
  RecommendedAction.pipe(T.XmlName("RecommendedAction")),
);
export class ReferenceLink extends S.Class<ReferenceLink>("ReferenceLink")({
  Text: S.optional(S.String),
  Link: S.optional(S.String),
}) {}
export const ReferenceLinkList = S.Array(
  ReferenceLink.pipe(T.XmlName("ReferenceLink")),
);
export class AccountAttribute extends S.Class<AccountAttribute>(
  "AccountAttribute",
)({
  AttributeName: S.optional(S.String),
  AttributeValues: S.optional(AttributeValueList),
}) {}
export const AttributeList = S.Array(
  AccountAttribute.pipe(T.XmlName("AccountAttribute")),
);
export class ClusterDbRevision extends S.Class<ClusterDbRevision>(
  "ClusterDbRevision",
)({
  ClusterIdentifier: S.optional(S.String),
  CurrentDatabaseRevision: S.optional(S.String),
  DatabaseRevisionReleaseDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  RevisionTargets: S.optional(RevisionTargetsList),
}) {}
export const ClusterDbRevisionsList = S.Array(
  ClusterDbRevision.pipe(T.XmlName("ClusterDbRevision")),
);
export class Association extends S.Class<Association>("Association")({
  CustomDomainCertificateArn: S.optional(S.String),
  CustomDomainCertificateExpiryDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  CertificateAssociations: S.optional(CertificateAssociationList),
}) {}
export const AssociationList = S.Array(
  Association.pipe(T.XmlName("Association")),
);
export class EventCategoriesMap extends S.Class<EventCategoriesMap>(
  "EventCategoriesMap",
)({ SourceType: S.optional(S.String), Events: S.optional(EventInfoMapList) }) {}
export const EventCategoriesMapList = S.Array(
  EventCategoriesMap.pipe(T.XmlName("EventCategoriesMap")),
);
export class NodeConfigurationOption extends S.Class<NodeConfigurationOption>(
  "NodeConfigurationOption",
)({
  NodeType: S.optional(S.String),
  NumberOfNodes: S.optional(S.Number),
  EstimatedDiskUtilizationPercent: S.optional(S.Number),
  Mode: S.optional(S.String),
}) {}
export const NodeConfigurationOptionList = S.Array(
  NodeConfigurationOption.pipe(T.XmlName("NodeConfigurationOption")),
);
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
  Id: S.optional(S.String),
  ClusterIdentifier: S.optional(S.String),
  NamespaceArn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  RecommendationType: S.optional(S.String),
  Title: S.optional(S.String),
  Description: S.optional(S.String),
  Observation: S.optional(S.String),
  ImpactRanking: S.optional(S.String),
  RecommendationText: S.optional(S.String),
  RecommendedActions: S.optional(RecommendedActionList),
  ReferenceLinks: S.optional(ReferenceLinkList),
}) {}
export const RecommendationList = S.Array(
  Recommendation.pipe(T.XmlName("Recommendation")),
);
export class SupportedOperation extends S.Class<SupportedOperation>(
  "SupportedOperation",
)({ OperationName: S.optional(S.String) }) {}
export const SupportedOperationList = S.Array(
  SupportedOperation.pipe(T.XmlName("SupportedOperation")),
);
export class AcceptReservedNodeExchangeOutputMessage extends S.Class<AcceptReservedNodeExchangeOutputMessage>(
  "AcceptReservedNodeExchangeOutputMessage",
)({ ExchangedReservedNode: S.optional(ReservedNode) }, ns) {}
export class AuthorizeClusterSecurityGroupIngressResult extends S.Class<AuthorizeClusterSecurityGroupIngressResult>(
  "AuthorizeClusterSecurityGroupIngressResult",
)({ ClusterSecurityGroup: S.optional(ClusterSecurityGroup) }, ns) {}
export class AuthorizeSnapshotAccessResult extends S.Class<AuthorizeSnapshotAccessResult>(
  "AuthorizeSnapshotAccessResult",
)({ Snapshot: S.optional(Snapshot) }, ns) {}
export class CreateClusterSubnetGroupResult extends S.Class<CreateClusterSubnetGroupResult>(
  "CreateClusterSubnetGroupResult",
)({ ClusterSubnetGroup: S.optional(ClusterSubnetGroup) }, ns) {}
export class CreateRedshiftIdcApplicationMessage extends S.Class<CreateRedshiftIdcApplicationMessage>(
  "CreateRedshiftIdcApplicationMessage",
)(
  {
    IdcInstanceArn: S.String,
    RedshiftIdcApplicationName: S.String,
    IdentityNamespace: S.optional(S.String),
    IdcDisplayName: S.String,
    IamRoleArn: S.String,
    AuthorizedTokenIssuerList: S.optional(AuthorizedTokenIssuerList),
    ServiceIntegrations: S.optional(ServiceIntegrationList),
    ApplicationType: S.optional(S.String),
    Tags: S.optional(TagList),
    SsoTagKeys: S.optional(TagKeyList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterNamespaceOutputMessage extends S.Class<DeregisterNamespaceOutputMessage>(
  "DeregisterNamespaceOutputMessage",
)({ Status: S.optional(S.String) }, ns) {}
export class AccountAttributeList extends S.Class<AccountAttributeList>(
  "AccountAttributeList",
)({ AccountAttributes: S.optional(AttributeList) }, ns) {}
export class ClusterDbRevisionsMessage extends S.Class<ClusterDbRevisionsMessage>(
  "ClusterDbRevisionsMessage",
)(
  {
    Marker: S.optional(S.String),
    ClusterDbRevisions: S.optional(ClusterDbRevisionsList),
  },
  ns,
) {}
export class CustomDomainAssociationsMessage extends S.Class<CustomDomainAssociationsMessage>(
  "CustomDomainAssociationsMessage",
)(
  { Marker: S.optional(S.String), Associations: S.optional(AssociationList) },
  ns,
) {}
export class EventCategoriesMessage extends S.Class<EventCategoriesMessage>(
  "EventCategoriesMessage",
)({ EventCategoriesMapList: S.optional(EventCategoriesMapList) }, ns) {}
export class NodeConfigurationOptionsMessage extends S.Class<NodeConfigurationOptionsMessage>(
  "NodeConfigurationOptionsMessage",
)(
  {
    NodeConfigurationOptionList: S.optional(NodeConfigurationOptionList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListRecommendationsResult extends S.Class<ListRecommendationsResult>(
  "ListRecommendationsResult",
)(
  {
    Recommendations: S.optional(RecommendationList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class UpdateTarget extends S.Class<UpdateTarget>("UpdateTarget")({
  MaintenanceTrackName: S.optional(S.String),
  DatabaseVersion: S.optional(S.String),
  SupportedOperations: S.optional(SupportedOperationList),
}) {}
export const EligibleTracksToUpdateList = S.Array(
  UpdateTarget.pipe(T.XmlName("UpdateTarget")),
);
export const AvailabilityZoneList = S.Array(
  AvailabilityZone.pipe(T.XmlName("AvailabilityZone")),
);
export class MaintenanceTrack extends S.Class<MaintenanceTrack>(
  "MaintenanceTrack",
)({
  MaintenanceTrackName: S.optional(S.String),
  DatabaseVersion: S.optional(S.String),
  UpdateTargets: S.optional(EligibleTracksToUpdateList),
}) {}
export const TrackList = S.Array(
  MaintenanceTrack.pipe(T.XmlName("MaintenanceTrack")),
);
export class OrderableClusterOption extends S.Class<OrderableClusterOption>(
  "OrderableClusterOption",
)({
  ClusterVersion: S.optional(S.String),
  ClusterType: S.optional(S.String),
  NodeType: S.optional(S.String),
  AvailabilityZones: S.optional(AvailabilityZoneList),
}) {}
export const OrderableClusterOptionsList = S.Array(
  OrderableClusterOption.pipe(T.XmlName("OrderableClusterOption")),
);
export class CreateRedshiftIdcApplicationResult extends S.Class<CreateRedshiftIdcApplicationResult>(
  "CreateRedshiftIdcApplicationResult",
)({ RedshiftIdcApplication: S.optional(RedshiftIdcApplication) }, ns) {}
export class DeleteClusterResult extends S.Class<DeleteClusterResult>(
  "DeleteClusterResult",
)({ Cluster: S.optional(Cluster) }, ns) {}
export class TrackListMessage extends S.Class<TrackListMessage>(
  "TrackListMessage",
)(
  { MaintenanceTracks: S.optional(TrackList), Marker: S.optional(S.String) },
  ns,
) {}
export class OrderableClusterOptionsMessage extends S.Class<OrderableClusterOptionsMessage>(
  "OrderableClusterOptionsMessage",
)(
  {
    OrderableClusterOptions: S.optional(OrderableClusterOptionsList),
    Marker: S.optional(S.String),
  },
  ns,
) {}

//# Errors
export class InvalidDataShareFault extends S.TaggedError<InvalidDataShareFault>()(
  "InvalidDataShareFault",
  {},
  T.AwsQueryError({ code: "InvalidDataShareFault", httpResponseCode: 400 }),
) {}
export class ClusterNotFoundFault extends S.TaggedError<ClusterNotFoundFault>()(
  "ClusterNotFoundFault",
  {},
  T.AwsQueryError({ code: "ClusterNotFound", httpResponseCode: 404 }),
) {}
export class InvalidClusterStateFault extends S.TaggedError<InvalidClusterStateFault>()(
  "InvalidClusterStateFault",
  {},
  T.AwsQueryError({ code: "InvalidClusterState", httpResponseCode: 400 }),
) {}
export class UnsupportedOperationFault extends S.TaggedError<UnsupportedOperationFault>()(
  "UnsupportedOperationFault",
  {},
  T.AwsQueryError({ code: "UnsupportedOperation", httpResponseCode: 400 }),
) {}
export class InvalidClusterSnapshotScheduleStateFault extends S.TaggedError<InvalidClusterSnapshotScheduleStateFault>()(
  "InvalidClusterSnapshotScheduleStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidClusterSnapshotScheduleState",
    httpResponseCode: 400,
  }),
) {}
export class EndpointNotFoundFault extends S.TaggedError<EndpointNotFoundFault>()(
  "EndpointNotFoundFault",
  {},
  T.AwsQueryError({ code: "EndpointNotFound", httpResponseCode: 404 }),
) {}
export class PartnerNotFoundFault extends S.TaggedError<PartnerNotFoundFault>()(
  "PartnerNotFoundFault",
  {},
  T.AwsQueryError({ code: "PartnerNotFound", httpResponseCode: 404 }),
) {}
export class UnauthorizedPartnerIntegrationFault extends S.TaggedError<UnauthorizedPartnerIntegrationFault>()(
  "UnauthorizedPartnerIntegrationFault",
  {},
  T.AwsQueryError({
    code: "UnauthorizedPartnerIntegration",
    httpResponseCode: 401,
  }),
) {}
export class ResizeNotFoundFault extends S.TaggedError<ResizeNotFoundFault>()(
  "ResizeNotFoundFault",
  {},
  T.AwsQueryError({ code: "ResizeNotFound", httpResponseCode: 404 }),
) {}
export class ClusterSnapshotAlreadyExistsFault extends S.TaggedError<ClusterSnapshotAlreadyExistsFault>()(
  "ClusterSnapshotAlreadyExistsFault",
  {},
  T.AwsQueryError({
    code: "ClusterSnapshotAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class CustomCnameAssociationFault extends S.TaggedError<CustomCnameAssociationFault>()(
  "CustomCnameAssociationFault",
  {},
  T.AwsQueryError({
    code: "CustomCnameAssociationFault",
    httpResponseCode: 400,
  }),
) {}
export class IntegrationAlreadyExistsFault extends S.TaggedError<IntegrationAlreadyExistsFault>()(
  "IntegrationAlreadyExistsFault",
  {},
  T.AwsQueryError({
    code: "IntegrationAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidTagFault extends S.TaggedError<InvalidTagFault>()(
  "InvalidTagFault",
  {},
  T.AwsQueryError({ code: "InvalidTagFault", httpResponseCode: 400 }),
) {}
export class ResourceNotFoundFault extends S.TaggedError<ResourceNotFoundFault>()(
  "ResourceNotFoundFault",
  {},
  T.AwsQueryError({ code: "ResourceNotFoundFault", httpResponseCode: 404 }),
) {}
export class InvalidUsageLimitFault extends S.TaggedError<InvalidUsageLimitFault>()(
  "InvalidUsageLimitFault",
  {},
  T.AwsQueryError({ code: "InvalidUsageLimit", httpResponseCode: 400 }),
) {}
export class ClusterParameterGroupNotFoundFault extends S.TaggedError<ClusterParameterGroupNotFoundFault>()(
  "ClusterParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterParameterGroupNotFound",
    httpResponseCode: 404,
  }),
) {}
export class ClusterSecurityGroupNotFoundFault extends S.TaggedError<ClusterSecurityGroupNotFoundFault>()(
  "ClusterSecurityGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSecurityGroupNotFound",
    httpResponseCode: 404,
  }),
) {}
export class InvalidClusterSecurityGroupStateFault extends S.TaggedError<InvalidClusterSecurityGroupStateFault>()(
  "InvalidClusterSecurityGroupStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidClusterSecurityGroupState",
    httpResponseCode: 400,
  }),
) {}
export class ClusterSubnetGroupNotFoundFault extends S.TaggedError<ClusterSubnetGroupNotFoundFault>()(
  "ClusterSubnetGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSubnetGroupNotFoundFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidSubscriptionStateFault extends S.TaggedError<InvalidSubscriptionStateFault>()(
  "InvalidSubscriptionStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidSubscriptionStateFault",
    httpResponseCode: 400,
  }),
) {}
export class HsmClientCertificateNotFoundFault extends S.TaggedError<HsmClientCertificateNotFoundFault>()(
  "HsmClientCertificateNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmClientCertificateNotFoundFault",
    httpResponseCode: 400,
  }),
) {}
export class HsmConfigurationNotFoundFault extends S.TaggedError<HsmConfigurationNotFoundFault>()(
  "HsmConfigurationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmConfigurationNotFoundFault",
    httpResponseCode: 400,
  }),
) {}
export class DependentServiceAccessDeniedFault extends S.TaggedError<DependentServiceAccessDeniedFault>()(
  "DependentServiceAccessDeniedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DependentServiceAccessDenied",
    httpResponseCode: 403,
  }),
) {}
export class ScheduledActionNotFoundFault extends S.TaggedError<ScheduledActionNotFoundFault>()(
  "ScheduledActionNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ScheduledActionNotFound", httpResponseCode: 400 }),
) {}
export class InvalidSnapshotCopyGrantStateFault extends S.TaggedError<InvalidSnapshotCopyGrantStateFault>()(
  "InvalidSnapshotCopyGrantStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidSnapshotCopyGrantStateFault",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotScheduleNotFoundFault extends S.TaggedError<SnapshotScheduleNotFoundFault>()(
  "SnapshotScheduleNotFoundFault",
  {},
  T.AwsQueryError({ code: "SnapshotScheduleNotFound", httpResponseCode: 400 }),
) {}
export class InvalidNamespaceFault extends S.TaggedError<InvalidNamespaceFault>()(
  "InvalidNamespaceFault",
  {},
  T.AwsQueryError({ code: "InvalidNamespaceFault", httpResponseCode: 400 }),
) {}
export class SubscriptionNotFoundFault extends S.TaggedError<SubscriptionNotFoundFault>()(
  "SubscriptionNotFoundFault",
  {},
  T.AwsQueryError({ code: "SubscriptionNotFound", httpResponseCode: 404 }),
) {}
export class DependentServiceUnavailableFault extends S.TaggedError<DependentServiceUnavailableFault>()(
  "DependentServiceUnavailableFault",
  {},
  T.AwsQueryError({
    code: "DependentServiceUnavailableFault",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotCopyGrantNotFoundFault extends S.TaggedError<SnapshotCopyGrantNotFoundFault>()(
  "SnapshotCopyGrantNotFoundFault",
  {},
  T.AwsQueryError({
    code: "SnapshotCopyGrantNotFoundFault",
    httpResponseCode: 400,
  }),
) {}
export class BucketNotFoundFault extends S.TaggedError<BucketNotFoundFault>()(
  "BucketNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "BucketNotFoundFault", httpResponseCode: 400 }),
) {}
export class UnauthorizedOperation extends S.TaggedError<UnauthorizedOperation>()(
  "UnauthorizedOperation",
  {},
  T.AwsQueryError({ code: "UnauthorizedOperation", httpResponseCode: 400 }),
) {}
export class AuthenticationProfileNotFoundFault extends S.TaggedError<AuthenticationProfileNotFoundFault>()(
  "AuthenticationProfileNotFoundFault",
  {},
  T.AwsQueryError({
    code: "AuthenticationProfileNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class InvalidClusterParameterGroupStateFault extends S.TaggedError<InvalidClusterParameterGroupStateFault>()(
  "InvalidClusterParameterGroupStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidClusterParameterGroupState",
    httpResponseCode: 400,
  }),
) {}
export class ClusterSnapshotNotFoundFault extends S.TaggedError<ClusterSnapshotNotFoundFault>()(
  "ClusterSnapshotNotFoundFault",
  {},
  T.AwsQueryError({ code: "ClusterSnapshotNotFound", httpResponseCode: 404 }),
) {}
export class CustomDomainAssociationNotFoundFault extends S.TaggedError<CustomDomainAssociationNotFoundFault>()(
  "CustomDomainAssociationNotFoundFault",
  {},
  T.AwsQueryError({
    code: "CustomDomainAssociationNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class InvalidEndpointStateFault extends S.TaggedError<InvalidEndpointStateFault>()(
  "InvalidEndpointStateFault",
  {},
  T.AwsQueryError({ code: "InvalidEndpointState", httpResponseCode: 400 }),
) {}
export class IntegrationConflictOperationFault extends S.TaggedError<IntegrationConflictOperationFault>()(
  "IntegrationConflictOperationFault",
  {},
  T.AwsQueryError({
    code: "IntegrationConflictOperationFault",
    httpResponseCode: 400,
  }),
) {}
export class RedshiftIdcApplicationNotExistsFault extends S.TaggedError<RedshiftIdcApplicationNotExistsFault>()(
  "RedshiftIdcApplicationNotExistsFault",
  {},
  T.AwsQueryError({
    code: "RedshiftIdcApplicationNotExists",
    httpResponseCode: 404,
  }),
) {}
export class InvalidScheduledActionFault extends S.TaggedError<InvalidScheduledActionFault>()(
  "InvalidScheduledActionFault",
  {},
  T.AwsQueryError({ code: "InvalidScheduledAction", httpResponseCode: 400 }),
) {}
export class InvalidScheduleFault extends S.TaggedError<InvalidScheduleFault>()(
  "InvalidScheduleFault",
  {},
  T.AwsQueryError({ code: "InvalidSchedule", httpResponseCode: 400 }),
) {}
export class UsageLimitNotFoundFault extends S.TaggedError<UsageLimitNotFoundFault>()(
  "UsageLimitNotFoundFault",
  {},
  T.AwsQueryError({ code: "UsageLimitNotFound", httpResponseCode: 404 }),
) {}
export class InsufficientClusterCapacityFault extends S.TaggedError<InsufficientClusterCapacityFault>()(
  "InsufficientClusterCapacityFault",
  {},
  T.AwsQueryError({
    code: "InsufficientClusterCapacity",
    httpResponseCode: 400,
  }),
) {}
export class EndpointAuthorizationNotFoundFault extends S.TaggedError<EndpointAuthorizationNotFoundFault>()(
  "EndpointAuthorizationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EndpointAuthorizationNotFound",
    httpResponseCode: 404,
  }),
) {}
export class AccessToSnapshotDeniedFault extends S.TaggedError<AccessToSnapshotDeniedFault>()(
  "AccessToSnapshotDeniedFault",
  {},
  T.AwsQueryError({ code: "AccessToSnapshotDenied", httpResponseCode: 400 }),
) {}
export class AuthorizationNotFoundFault extends S.TaggedError<AuthorizationNotFoundFault>()(
  "AuthorizationNotFoundFault",
  {},
  T.AwsQueryError({ code: "AuthorizationNotFound", httpResponseCode: 404 }),
) {}
export class EndpointAuthorizationAlreadyExistsFault extends S.TaggedError<EndpointAuthorizationAlreadyExistsFault>()(
  "EndpointAuthorizationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EndpointAuthorizationAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class BatchModifyClusterSnapshotsLimitExceededFault extends S.TaggedError<BatchModifyClusterSnapshotsLimitExceededFault>()(
  "BatchModifyClusterSnapshotsLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "BatchModifyClusterSnapshotsLimitExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidRetentionPeriodFault extends S.TaggedError<InvalidRetentionPeriodFault>()(
  "InvalidRetentionPeriodFault",
  {},
  T.AwsQueryError({
    code: "InvalidRetentionPeriodFault",
    httpResponseCode: 400,
  }),
) {}
export class ClusterSnapshotQuotaExceededFault extends S.TaggedError<ClusterSnapshotQuotaExceededFault>()(
  "ClusterSnapshotQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "ClusterSnapshotQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidClusterSnapshotStateFault extends S.TaggedError<InvalidClusterSnapshotStateFault>()(
  "InvalidClusterSnapshotStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidClusterSnapshotState",
    httpResponseCode: 400,
  }),
) {}
export class AuthenticationProfileAlreadyExistsFault extends S.TaggedError<AuthenticationProfileAlreadyExistsFault>()(
  "AuthenticationProfileAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthenticationProfileAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class AuthenticationProfileQuotaExceededFault extends S.TaggedError<AuthenticationProfileQuotaExceededFault>()(
  "AuthenticationProfileQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "AuthenticationProfileQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class ClusterAlreadyExistsFault extends S.TaggedError<ClusterAlreadyExistsFault>()(
  "ClusterAlreadyExistsFault",
  {},
  T.AwsQueryError({ code: "ClusterAlreadyExists", httpResponseCode: 400 }),
) {}
export class ClusterSecurityGroupAlreadyExistsFault extends S.TaggedError<ClusterSecurityGroupAlreadyExistsFault>()(
  "ClusterSecurityGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSecurityGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class TagLimitExceededFault extends S.TaggedError<TagLimitExceededFault>()(
  "TagLimitExceededFault",
  {},
  T.AwsQueryError({ code: "TagLimitExceededFault", httpResponseCode: 400 }),
) {}
export class DependentServiceRequestThrottlingFault extends S.TaggedError<DependentServiceRequestThrottlingFault>()(
  "DependentServiceRequestThrottlingFault",
  {},
  T.AwsQueryError({
    code: "DependentServiceRequestThrottlingFault",
    httpResponseCode: 400,
  }),
) {}
export class LimitExceededFault extends S.TaggedError<LimitExceededFault>()(
  "LimitExceededFault",
  {},
  T.AwsQueryError({ code: "LimitExceededFault", httpResponseCode: 400 }),
) {}
export class InvalidAuthenticationProfileRequestFault extends S.TaggedError<InvalidAuthenticationProfileRequestFault>()(
  "InvalidAuthenticationProfileRequestFault",
  {},
  T.AwsQueryError({
    code: "InvalidAuthenticationProfileRequestFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidClusterSubnetGroupStateFault extends S.TaggedError<InvalidClusterSubnetGroupStateFault>()(
  "InvalidClusterSubnetGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidClusterSubnetGroupStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidHsmClientCertificateStateFault extends S.TaggedError<InvalidHsmClientCertificateStateFault>()(
  "InvalidHsmClientCertificateStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidHsmClientCertificateStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidHsmConfigurationStateFault extends S.TaggedError<InvalidHsmConfigurationStateFault>()(
  "InvalidHsmConfigurationStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidHsmConfigurationStateFault",
    httpResponseCode: 400,
  }),
) {}
export class IntegrationConflictStateFault extends S.TaggedError<IntegrationConflictStateFault>()(
  "IntegrationConflictStateFault",
  {},
  T.AwsQueryError({
    code: "IntegrationConflictStateFault",
    httpResponseCode: 400,
  }),
) {}
export class IntegrationNotFoundFault extends S.TaggedError<IntegrationNotFoundFault>()(
  "IntegrationNotFoundFault",
  {},
  T.AwsQueryError({ code: "IntegrationNotFoundFault", httpResponseCode: 404 }),
) {}
export class ReservedNodeNotFoundFault extends S.TaggedError<ReservedNodeNotFoundFault>()(
  "ReservedNodeNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReservedNodeNotFound", httpResponseCode: 404 }),
) {}
export class SnapshotCopyAlreadyDisabledFault extends S.TaggedError<SnapshotCopyAlreadyDisabledFault>()(
  "SnapshotCopyAlreadyDisabledFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotCopyAlreadyDisabledFault",
    httpResponseCode: 400,
  }),
) {}
export class InsufficientS3BucketPolicyFault extends S.TaggedError<InsufficientS3BucketPolicyFault>()(
  "InsufficientS3BucketPolicyFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientS3BucketPolicyFault",
    httpResponseCode: 400,
  }),
) {}
export class CopyToRegionDisabledFault extends S.TaggedError<CopyToRegionDisabledFault>()(
  "CopyToRegionDisabledFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "CopyToRegionDisabledFault", httpResponseCode: 400 }),
) {}
export class RedshiftInvalidParameterFault extends S.TaggedError<RedshiftInvalidParameterFault>()(
  "RedshiftInvalidParameterFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "RedshiftInvalidParameter", httpResponseCode: 400 }),
) {}
export class InvalidReservedNodeStateFault extends S.TaggedError<InvalidReservedNodeStateFault>()(
  "InvalidReservedNodeStateFault",
  {},
  T.AwsQueryError({ code: "InvalidReservedNodeState", httpResponseCode: 400 }),
) {}
export class ReservedNodeAlreadyMigratedFault extends S.TaggedError<ReservedNodeAlreadyMigratedFault>()(
  "ReservedNodeAlreadyMigratedFault",
  {},
  T.AwsQueryError({
    code: "ReservedNodeAlreadyMigrated",
    httpResponseCode: 400,
  }),
) {}
export class ReservedNodeOfferingNotFoundFault extends S.TaggedError<ReservedNodeOfferingNotFoundFault>()(
  "ReservedNodeOfferingNotFoundFault",
  {},
  T.AwsQueryError({
    code: "ReservedNodeOfferingNotFound",
    httpResponseCode: 404,
  }),
) {}
export class ClusterOnLatestRevisionFault extends S.TaggedError<ClusterOnLatestRevisionFault>()(
  "ClusterOnLatestRevisionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ClusterOnLatestRevision", httpResponseCode: 400 }),
) {}
export class ClusterSubnetQuotaExceededFault extends S.TaggedError<ClusterSubnetQuotaExceededFault>()(
  "ClusterSubnetQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSubnetQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class SNSInvalidTopicFault extends S.TaggedError<SNSInvalidTopicFault>()(
  "SNSInvalidTopicFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSInvalidTopic", httpResponseCode: 400 }),
) {}
export class ScheduledActionTypeUnsupportedFault extends S.TaggedError<ScheduledActionTypeUnsupportedFault>()(
  "ScheduledActionTypeUnsupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ScheduledActionTypeUnsupported",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotScheduleUpdateInProgressFault extends S.TaggedError<SnapshotScheduleUpdateInProgressFault>()(
  "SnapshotScheduleUpdateInProgressFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotScheduleUpdateInProgress",
    httpResponseCode: 400,
  }),
) {}
export class ReservedNodeAlreadyExistsFault extends S.TaggedError<ReservedNodeAlreadyExistsFault>()(
  "ReservedNodeAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReservedNodeAlreadyExists", httpResponseCode: 404 }),
) {}
export class ConflictPolicyUpdateFault extends S.TaggedError<ConflictPolicyUpdateFault>()(
  "ConflictPolicyUpdateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConflictPolicyUpdateFault", httpResponseCode: 409 }),
) {}
export class InvalidPolicyFault extends S.TaggedError<InvalidPolicyFault>()(
  "InvalidPolicyFault",
  {},
  T.AwsQueryError({ code: "InvalidPolicyFault", httpResponseCode: 400 }),
) {}
export class ClusterQuotaExceededFault extends S.TaggedError<ClusterQuotaExceededFault>()(
  "ClusterQuotaExceededFault",
  {},
  T.AwsQueryError({ code: "ClusterQuotaExceeded", httpResponseCode: 400 }),
) {}
export class InvalidClusterTrackFault extends S.TaggedError<InvalidClusterTrackFault>()(
  "InvalidClusterTrackFault",
  {},
  T.AwsQueryError({ code: "InvalidClusterTrack", httpResponseCode: 400 }),
) {}
export class InProgressTableRestoreQuotaExceededFault extends S.TaggedError<InProgressTableRestoreQuotaExceededFault>()(
  "InProgressTableRestoreQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InProgressTableRestoreQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidAuthorizationStateFault extends S.TaggedError<InvalidAuthorizationStateFault>()(
  "InvalidAuthorizationStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidAuthorizationState", httpResponseCode: 400 }),
) {}
export class EndpointAuthorizationsPerClusterLimitExceededFault extends S.TaggedError<EndpointAuthorizationsPerClusterLimitExceededFault>()(
  "EndpointAuthorizationsPerClusterLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EndpointAuthorizationsPerClusterLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class AuthorizationAlreadyExistsFault extends S.TaggedError<AuthorizationAlreadyExistsFault>()(
  "AuthorizationAlreadyExistsFault",
  {},
  T.AwsQueryError({
    code: "AuthorizationAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class BatchDeleteRequestSizeExceededFault extends S.TaggedError<BatchDeleteRequestSizeExceededFault>()(
  "BatchDeleteRequestSizeExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "BatchDeleteRequestSizeExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidElasticIpFault extends S.TaggedError<InvalidElasticIpFault>()(
  "InvalidElasticIpFault",
  {},
  T.AwsQueryError({ code: "InvalidElasticIpFault", httpResponseCode: 400 }),
) {}
export class InvalidSubnet extends S.TaggedError<InvalidSubnet>()(
  "InvalidSubnet",
  {},
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
) {}
export class ClusterParameterGroupAlreadyExistsFault extends S.TaggedError<ClusterParameterGroupAlreadyExistsFault>()(
  "ClusterParameterGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterParameterGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class ClusterSecurityGroupQuotaExceededFault extends S.TaggedError<ClusterSecurityGroupQuotaExceededFault>()(
  "ClusterSecurityGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "QuotaExceeded.ClusterSecurityGroup",
    httpResponseCode: 400,
  }),
) {}
export class EventSubscriptionQuotaExceededFault extends S.TaggedError<EventSubscriptionQuotaExceededFault>()(
  "EventSubscriptionQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventSubscriptionQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class SNSNoAuthorizationFault extends S.TaggedError<SNSNoAuthorizationFault>()(
  "SNSNoAuthorizationFault",
  {},
  T.AwsQueryError({ code: "SNSNoAuthorization", httpResponseCode: 400 }),
) {}
export class HsmClientCertificateAlreadyExistsFault extends S.TaggedError<HsmClientCertificateAlreadyExistsFault>()(
  "HsmClientCertificateAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmClientCertificateAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class HsmConfigurationAlreadyExistsFault extends S.TaggedError<HsmConfigurationAlreadyExistsFault>()(
  "HsmConfigurationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmConfigurationAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class IntegrationQuotaExceededFault extends S.TaggedError<IntegrationQuotaExceededFault>()(
  "IntegrationQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class ScheduledActionAlreadyExistsFault extends S.TaggedError<ScheduledActionAlreadyExistsFault>()(
  "ScheduledActionAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ScheduledActionAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotCopyGrantAlreadyExistsFault extends S.TaggedError<SnapshotCopyGrantAlreadyExistsFault>()(
  "SnapshotCopyGrantAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotCopyGrantAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class ScheduleDefinitionTypeUnsupportedFault extends S.TaggedError<ScheduleDefinitionTypeUnsupportedFault>()(
  "ScheduleDefinitionTypeUnsupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ScheduleDefinitionTypeUnsupported",
    httpResponseCode: 400,
  }),
) {}
export class UsageLimitAlreadyExistsFault extends S.TaggedError<UsageLimitAlreadyExistsFault>()(
  "UsageLimitAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UsageLimitAlreadyExists", httpResponseCode: 400 }),
) {}
export class InvalidClusterSubnetStateFault extends S.TaggedError<InvalidClusterSubnetStateFault>()(
  "InvalidClusterSubnetStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidClusterSubnetStateFault",
    httpResponseCode: 400,
  }),
) {}
export class ReservedNodeExchangeNotFoundFault extends S.TaggedError<ReservedNodeExchangeNotFoundFault>()(
  "ReservedNodeExchangeNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedNodeExchangeNotFond",
    httpResponseCode: 404,
  }),
) {}
export class TableRestoreNotFoundFault extends S.TaggedError<TableRestoreNotFoundFault>()(
  "TableRestoreNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TableRestoreNotFoundFault", httpResponseCode: 400 }),
) {}
export class InvalidS3BucketNameFault extends S.TaggedError<InvalidS3BucketNameFault>()(
  "InvalidS3BucketNameFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidS3BucketNameFault", httpResponseCode: 400 }),
) {}
export class IncompatibleOrderableOptions extends S.TaggedError<IncompatibleOrderableOptions>()(
  "IncompatibleOrderableOptions",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IncompatibleOrderableOptions",
    httpResponseCode: 400,
  }),
) {}
export class SNSTopicArnNotFoundFault extends S.TaggedError<SNSTopicArnNotFoundFault>()(
  "SNSTopicArnNotFoundFault",
  {},
  T.AwsQueryError({ code: "SNSTopicArnNotFound", httpResponseCode: 404 }),
) {}
export class SnapshotCopyDisabledFault extends S.TaggedError<SnapshotCopyDisabledFault>()(
  "SnapshotCopyDisabledFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SnapshotCopyDisabledFault", httpResponseCode: 400 }),
) {}
export class ReservedNodeQuotaExceededFault extends S.TaggedError<ReservedNodeQuotaExceededFault>()(
  "ReservedNodeQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReservedNodeQuotaExceeded", httpResponseCode: 400 }),
) {}
export class NumberOfNodesPerClusterLimitExceededFault extends S.TaggedError<NumberOfNodesPerClusterLimitExceededFault>()(
  "NumberOfNodesPerClusterLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NumberOfNodesPerClusterLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidTableRestoreArgumentFault extends S.TaggedError<InvalidTableRestoreArgumentFault>()(
  "InvalidTableRestoreArgumentFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidTableRestoreArgument",
    httpResponseCode: 400,
  }),
) {}
export class AuthorizationQuotaExceededFault extends S.TaggedError<AuthorizationQuotaExceededFault>()(
  "AuthorizationQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "AuthorizationQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
) {}
export class Ipv6CidrBlockNotFoundFault extends S.TaggedError<Ipv6CidrBlockNotFoundFault>()(
  "Ipv6CidrBlockNotFoundFault",
  {},
  T.AwsQueryError({
    code: "Ipv6CidrBlockNotFoundFault",
    httpResponseCode: 400,
  }),
) {}
export class NumberOfNodesQuotaExceededFault extends S.TaggedError<NumberOfNodesQuotaExceededFault>()(
  "NumberOfNodesQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "NumberOfNodesQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class ClusterParameterGroupQuotaExceededFault extends S.TaggedError<ClusterParameterGroupQuotaExceededFault>()(
  "ClusterParameterGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class ClusterSubnetGroupAlreadyExistsFault extends S.TaggedError<ClusterSubnetGroupAlreadyExistsFault>()(
  "ClusterSubnetGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSubnetGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class AccessToClusterDeniedFault extends S.TaggedError<AccessToClusterDeniedFault>()(
  "AccessToClusterDeniedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessToClusterDenied", httpResponseCode: 400 }),
) {}
export class SourceNotFoundFault extends S.TaggedError<SourceNotFoundFault>()(
  "SourceNotFoundFault",
  {},
  T.AwsQueryError({ code: "SourceNotFound", httpResponseCode: 404 }),
) {}
export class HsmClientCertificateQuotaExceededFault extends S.TaggedError<HsmClientCertificateQuotaExceededFault>()(
  "HsmClientCertificateQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmClientCertificateQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class HsmConfigurationQuotaExceededFault extends S.TaggedError<HsmConfigurationQuotaExceededFault>()(
  "HsmConfigurationQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HsmConfigurationQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class IntegrationSourceNotFoundFault extends S.TaggedError<IntegrationSourceNotFoundFault>()(
  "IntegrationSourceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationSourceNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class ScheduledActionQuotaExceededFault extends S.TaggedError<ScheduledActionQuotaExceededFault>()(
  "ScheduledActionQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ScheduledActionQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotCopyGrantQuotaExceededFault extends S.TaggedError<SnapshotCopyGrantQuotaExceededFault>()(
  "SnapshotCopyGrantQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotCopyGrantQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotScheduleAlreadyExistsFault extends S.TaggedError<SnapshotScheduleAlreadyExistsFault>()(
  "SnapshotScheduleAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotScheduleAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class InvalidS3KeyPrefixFault extends S.TaggedError<InvalidS3KeyPrefixFault>()(
  "InvalidS3KeyPrefixFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidS3KeyPrefixFault", httpResponseCode: 400 }),
) {}
export class SnapshotCopyAlreadyEnabledFault extends S.TaggedError<SnapshotCopyAlreadyEnabledFault>()(
  "SnapshotCopyAlreadyEnabledFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotCopyAlreadyEnabledFault",
    httpResponseCode: 400,
  }),
) {}
export class SubnetAlreadyInUse extends S.TaggedError<SubnetAlreadyInUse>()(
  "SubnetAlreadyInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetAlreadyInUse", httpResponseCode: 400 }),
) {}
export class InvalidRestoreFault extends S.TaggedError<InvalidRestoreFault>()(
  "InvalidRestoreFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRestore", httpResponseCode: 406 }),
) {}
export class ClusterSubnetGroupQuotaExceededFault extends S.TaggedError<ClusterSubnetGroupQuotaExceededFault>()(
  "ClusterSubnetGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterSubnetGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class EndpointAlreadyExistsFault extends S.TaggedError<EndpointAlreadyExistsFault>()(
  "EndpointAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "EndpointAlreadyExists", httpResponseCode: 400 }),
) {}
export class SubscriptionAlreadyExistFault extends S.TaggedError<SubscriptionAlreadyExistFault>()(
  "SubscriptionAlreadyExistFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionAlreadyExist", httpResponseCode: 400 }),
) {}
export class SubscriptionCategoryNotFoundFault extends S.TaggedError<SubscriptionCategoryNotFoundFault>()(
  "SubscriptionCategoryNotFoundFault",
  {},
  T.AwsQueryError({
    code: "SubscriptionCategoryNotFound",
    httpResponseCode: 404,
  }),
) {}
export class IntegrationTargetNotFoundFault extends S.TaggedError<IntegrationTargetNotFoundFault>()(
  "IntegrationTargetNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IntegrationTargetNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class RedshiftIdcApplicationAlreadyExistsFault extends S.TaggedError<RedshiftIdcApplicationAlreadyExistsFault>()(
  "RedshiftIdcApplicationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "RedshiftIdcApplicationAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotScheduleQuotaExceededFault extends S.TaggedError<SnapshotScheduleQuotaExceededFault>()(
  "SnapshotScheduleQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotScheduleQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class UnknownSnapshotCopyRegionFault extends S.TaggedError<UnknownSnapshotCopyRegionFault>()(
  "UnknownSnapshotCopyRegionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnknownSnapshotCopyRegionFault",
    httpResponseCode: 404,
  }),
) {}
export class TableLimitExceededFault extends S.TaggedError<TableLimitExceededFault>()(
  "TableLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TableLimitExceeded", httpResponseCode: 400 }),
) {}
export class UnsupportedOptionFault extends S.TaggedError<UnsupportedOptionFault>()(
  "UnsupportedOptionFault",
  {},
  T.AwsQueryError({ code: "UnsupportedOptionFault", httpResponseCode: 400 }),
) {}
export class SubscriptionEventIdNotFoundFault extends S.TaggedError<SubscriptionEventIdNotFoundFault>()(
  "SubscriptionEventIdNotFoundFault",
  {},
  T.AwsQueryError({
    code: "SubscriptionEventIdNotFound",
    httpResponseCode: 404,
  }),
) {}
export class EndpointsPerAuthorizationLimitExceededFault extends S.TaggedError<EndpointsPerAuthorizationLimitExceededFault>()(
  "EndpointsPerAuthorizationLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EndpointsPerAuthorizationLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class SubscriptionSeverityNotFoundFault extends S.TaggedError<SubscriptionSeverityNotFoundFault>()(
  "SubscriptionSeverityNotFoundFault",
  {},
  T.AwsQueryError({
    code: "SubscriptionSeverityNotFound",
    httpResponseCode: 404,
  }),
) {}
export class RedshiftIdcApplicationQuotaExceededFault extends S.TaggedError<RedshiftIdcApplicationQuotaExceededFault>()(
  "RedshiftIdcApplicationQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "RedshiftIdcApplicationQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class EndpointsPerClusterLimitExceededFault extends S.TaggedError<EndpointsPerClusterLimitExceededFault>()(
  "EndpointsPerClusterLimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EndpointsPerClusterLimitExceeded",
    httpResponseCode: 400,
  }),
) {}

//# Operations
/**
 * From a datashare producer account, removes authorization from the specified datashare.
 */
export const deauthorizeDataShare = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeauthorizeDataShareMessage,
    output: DataShare,
    errors: [InvalidDataShareFault],
  }),
);
/**
 * Returns account level backups storage size and provisional storage.
 */
export const describeStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStorageRequest,
  output: CustomerStorageMessage,
  errors: [],
}));
/**
 * Stops logging information, such as queries and connection attempts, for the
 * specified Amazon Redshift cluster.
 */
export const disableLogging = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableLoggingMessage,
  output: LoggingStatus,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * From a datashare consumer account, rejects the specified datashare.
 */
export const rejectDataShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectDataShareMessage,
  output: DataShare,
  errors: [InvalidDataShareFault],
}));
/**
 * Adds a partner integration to a cluster.
 * This operation authorizes a partner to push status updates for the specified database.
 * To complete the integration, you also set up the integration on the partner website.
 */
export const addPartner = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PartnerIntegrationInputMessage,
  output: PartnerIntegrationOutputMessage,
  errors: [
    ClusterNotFoundFault,
    PartnerNotFoundFault,
    UnauthorizedPartnerIntegrationFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * From a data producer account, authorizes the sharing of a datashare with one or more
 * consumer accounts or managing entities. To authorize a datashare for a data consumer,
 * the producer account must have the correct access permissions.
 */
export const authorizeDataShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AuthorizeDataShareMessage,
  output: DataShare,
  errors: [InvalidDataShareFault],
}));
/**
 * Cancels a resize operation for a cluster.
 */
export const cancelResize = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelResizeMessage,
  output: ResizeProgressMessage,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    ResizeNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Used to create a custom domain name for a cluster. Properties include the custom domain name, the
 * cluster the custom domain is associated with, and the certificate Amazon Resource Name (ARN).
 */
export const createCustomDomainAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCustomDomainAssociationMessage,
    output: CreateCustomDomainAssociationResult,
    errors: [
      ClusterNotFoundFault,
      CustomCnameAssociationFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Deletes an Amazon Redshift security group.
 *
 * You cannot delete a security group that is associated with any clusters. You
 * cannot delete the default security group.
 *
 * For information about managing security groups, go to
 * Amazon Redshift Cluster Security Groups in the
 * *Amazon Redshift Cluster Management Guide*.
 */
export const deleteClusterSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteClusterSecurityGroupMessage,
    output: DeleteClusterSecurityGroupResponse,
    errors: [
      ClusterSecurityGroupNotFoundFault,
      InvalidClusterSecurityGroupStateFault,
    ],
  }),
);
/**
 * Deletes a partner integration from a cluster. Data can still flow to the cluster until the integration is deleted at the partner's website.
 */
export const deletePartner = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PartnerIntegrationInputMessage,
  output: PartnerIntegrationOutputMessage,
  errors: [
    ClusterNotFoundFault,
    PartnerNotFoundFault,
    UnauthorizedPartnerIntegrationFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Deletes the resource policy for a specified resource.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyMessage,
    output: DeleteResourcePolicyResponse,
    errors: [ResourceNotFoundFault, UnsupportedOperationFault],
  }),
);
/**
 * Deletes a snapshot schedule.
 */
export const deleteSnapshotSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSnapshotScheduleMessage,
    output: DeleteSnapshotScheduleResponse,
    errors: [
      InvalidClusterSnapshotScheduleStateFault,
      SnapshotScheduleNotFoundFault,
    ],
  }),
);
/**
 * Deletes tags from a resource. You must provide the ARN of the resource
 * from which you want to delete the tag or tags.
 */
export const deleteTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsMessage,
  output: DeleteTagsResponse,
  errors: [InvalidTagFault, ResourceNotFoundFault],
}));
/**
 * Returns a list of Amazon Redshift parameter groups, including parameter groups you
 * created and the default parameter group. For each parameter group, the response includes
 * the parameter group name, description, and parameter group family name. You can
 * optionally specify a name to retrieve the description of a specific parameter
 * group.
 *
 * For more information about parameters and parameter groups, go to
 * Amazon Redshift Parameter Groups
 * in the *Amazon Redshift Cluster Management Guide*.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all parameter groups that match any combination of the specified keys and values. For
 * example, if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all parameter groups that
 * have any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, parameter groups are
 * returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeClusterParameterGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeClusterParameterGroupsMessage,
    output: ClusterParameterGroupsMessage,
    errors: [ClusterParameterGroupNotFoundFault, InvalidTagFault],
  }));
/**
 * Returns a detailed list of parameters contained within the specified Amazon Redshift
 * parameter group. For each parameter the response includes information such as parameter
 * name, description, data type, value, whether the parameter value is modifiable, and so
 * on.
 *
 * You can specify *source* filter to retrieve parameters of only
 * specific type. For example, to retrieve parameters that were modified by a user action
 * such as from ModifyClusterParameterGroup, you can specify
 * *source* equal to *user*.
 *
 * For more information about parameters and parameter groups, go to
 * Amazon Redshift Parameter Groups
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeClusterParameters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeClusterParametersMessage,
    output: ClusterParameterGroupDetails,
    errors: [ClusterParameterGroupNotFoundFault],
  }),
);
/**
 * Returns properties of provisioned clusters including general cluster properties,
 * cluster database properties, maintenance and backup properties, and security and access
 * properties. This operation supports pagination.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all clusters that match any combination of the specified keys and values. For example,
 * if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all clusters that have any
 * combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, clusters are returned
 * regardless of whether they have tag keys or values associated with them.
 */
export const describeClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClustersMessage,
  output: ClustersMessage,
  errors: [ClusterNotFoundFault, InvalidTagFault],
}));
/**
 * Returns information about Amazon Redshift security groups. If the name of a security
 * group is specified, the response will contain only information about only that security
 * group.
 *
 * For information about managing security groups, go to
 * Amazon Redshift Cluster Security Groups in the
 * *Amazon Redshift Cluster Management Guide*.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all security groups that match any combination of the specified keys and values. For
 * example, if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all security groups that
 * have any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, security groups are
 * returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeClusterSecurityGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeClusterSecurityGroupsMessage,
    output: ClusterSecurityGroupMessage,
    errors: [ClusterSecurityGroupNotFoundFault, InvalidTagFault],
  }));
/**
 * Returns one or more cluster subnet group objects, which contain metadata about your
 * cluster subnet groups. By default, this operation returns information about all cluster
 * subnet groups that are defined in your Amazon Web Services account.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all subnet groups that match any combination of the specified keys and values. For
 * example, if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all subnet groups that have
 * any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, subnet groups are
 * returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeClusterSubnetGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeClusterSubnetGroupsMessage,
    output: ClusterSubnetGroupMessage,
    errors: [ClusterSubnetGroupNotFoundFault, InvalidTagFault],
  }),
);
/**
 * Shows the status of any inbound or outbound datashares available in the specified
 * account.
 */
export const describeDataShares = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDataSharesMessage,
  output: DescribeDataSharesResult,
  errors: [InvalidDataShareFault],
}));
/**
 * Returns a list of datashares where the account identifier being called is a consumer account identifier.
 */
export const describeDataSharesForConsumer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDataSharesForConsumerMessage,
    output: DescribeDataSharesForConsumerResult,
    errors: [InvalidNamespaceFault],
  }));
/**
 * Returns a list of datashares when the account identifier being called is a producer account identifier.
 */
export const describeDataSharesForProducer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDataSharesForProducerMessage,
    output: DescribeDataSharesForProducerResult,
    errors: [InvalidNamespaceFault],
  }));
/**
 * Describes a Redshift-managed VPC endpoint.
 */
export const describeEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEndpointAccessMessage,
    output: EndpointAccessList,
    errors: [
      ClusterNotFoundFault,
      EndpointNotFoundFault,
      InvalidClusterStateFault,
    ],
  }),
);
/**
 * Describes an endpoint authorization.
 */
export const describeEndpointAuthorization =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeEndpointAuthorizationMessage,
    output: EndpointAuthorizationList,
    errors: [ClusterNotFoundFault, UnsupportedOperationFault],
  }));
/**
 * Lists descriptions of all the Amazon Redshift event notification subscriptions for a
 * customer account. If you specify a subscription name, lists the description for that
 * subscription.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all event notification subscriptions that match any combination of the specified keys
 * and values. For example, if you have `owner` and `environment` for
 * tag keys, and `admin` and `test` for tag values, all subscriptions
 * that have any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, subscriptions are
 * returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeEventSubscriptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventSubscriptionsMessage,
    output: EventSubscriptionsMessage,
    errors: [InvalidTagFault, SubscriptionNotFoundFault],
  }),
);
/**
 * Returns information about the specified HSM client certificate. If no certificate
 * ID is specified, returns information about all the HSM certificates owned by your Amazon Web Services account.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all HSM client certificates that match any combination of the specified keys and values.
 * For example, if you have `owner` and `environment` for tag keys,
 * and `admin` and `test` for tag values, all HSM client certificates
 * that have any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, HSM client certificates
 * are returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeHsmClientCertificates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeHsmClientCertificatesMessage,
    output: HsmClientCertificateMessage,
    errors: [HsmClientCertificateNotFoundFault, InvalidTagFault],
  }));
/**
 * Returns information about the specified Amazon Redshift HSM configuration. If no
 * configuration ID is specified, returns information about all the HSM configurations
 * owned by your Amazon Web Services account.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all HSM connections that match any combination of the specified keys and values. For
 * example, if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all HSM connections that
 * have any combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, HSM connections are
 * returned regardless of whether they have tag keys or values associated with
 * them.
 */
export const describeHsmConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeHsmConfigurationsMessage,
    output: HsmConfigurationMessage,
    errors: [HsmConfigurationNotFoundFault, InvalidTagFault],
  }),
);
/**
 * Describes whether information, such as queries and connection attempts, is being
 * logged for the specified Amazon Redshift cluster.
 */
export const describeLoggingStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLoggingStatusMessage,
    output: LoggingStatus,
    errors: [ClusterNotFoundFault, UnsupportedOperationFault],
  }),
);
/**
 * Returns information about the last resize operation for the specified cluster. If
 * no resize operation has ever been initiated for the specified cluster, a HTTP
 * 404 error is returned. If a resize operation was initiated and completed, the
 * status of the resize remains as `SUCCEEDED` until the next resize.
 *
 * A resize operation can be requested using ModifyCluster and
 * specifying a different number or type of nodes for the cluster.
 */
export const describeResize = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResizeMessage,
  output: ResizeProgressMessage,
  errors: [
    ClusterNotFoundFault,
    ResizeNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Returns a list of snapshot copy grants owned by the Amazon Web Services account in the destination
 * region.
 *
 * For more information about managing snapshot copy grants, go to
 * Amazon Redshift Database Encryption
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeSnapshotCopyGrants = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSnapshotCopyGrantsMessage,
    output: SnapshotCopyGrantMessage,
    errors: [InvalidTagFault, SnapshotCopyGrantNotFoundFault],
  }),
);
/**
 * Returns a list of snapshot schedules.
 */
export const describeSnapshotSchedules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSnapshotSchedulesMessage,
    output: DescribeSnapshotSchedulesOutputMessage,
    errors: [],
  }),
);
/**
 * Shows usage limits on a cluster.
 * Results are filtered based on the combination of input usage limit identifier, cluster identifier, and feature type parameters:
 *
 * - If usage limit identifier, cluster identifier, and feature type are not provided,
 * then all usage limit objects for the current account in the current region are returned.
 *
 * - If usage limit identifier is provided,
 * then the corresponding usage limit object is returned.
 *
 * - If cluster identifier is provided,
 * then all usage limit objects for the specified cluster are returned.
 *
 * - If cluster identifier and feature type are provided,
 * then all usage limit objects for the combination of cluster and feature are returned.
 */
export const describeUsageLimits = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUsageLimitsMessage,
  output: UsageLimitList,
  errors: [ClusterNotFoundFault, UnsupportedOperationFault],
}));
/**
 * From a datashare consumer account, remove association for the specified datashare.
 */
export const disassociateDataShareConsumer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateDataShareConsumerMessage,
    output: DataShare,
    errors: [InvalidDataShareFault, InvalidNamespaceFault],
  }));
/**
 * Fails over the primary compute unit of the specified Multi-AZ cluster to another Availability Zone.
 */
export const failoverPrimaryCompute = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: FailoverPrimaryComputeInputMessage,
    output: FailoverPrimaryComputeResult,
    errors: [
      ClusterNotFoundFault,
      InvalidClusterStateFault,
      UnauthorizedOperation,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Returns a database user name and temporary password with temporary authorization to
 * log on to an Amazon Redshift database. The action returns the database user name
 * prefixed with `IAM:` if `AutoCreate` is `False` or
 * `IAMA:` if `AutoCreate` is `True`. You can
 * optionally specify one or more database user groups that the user will join at log on.
 * By default, the temporary credentials expire in 900 seconds. You can optionally specify
 * a duration between 900 seconds (15 minutes) and 3600 seconds (60 minutes). For more
 * information, see Using IAM Authentication
 * to Generate Database User Credentials in the Amazon Redshift Cluster Management Guide.
 *
 * The Identity and Access Management (IAM) user or role that runs
 * GetClusterCredentials must have an IAM policy attached that allows access to all
 * necessary actions and resources. For more information about permissions, see Resource Policies for GetClusterCredentials in the
 * Amazon Redshift Cluster Management Guide.
 *
 * If the `DbGroups` parameter is specified, the IAM policy must allow the
 * `redshift:JoinGroup` action with access to the listed
 * `dbgroups`.
 *
 * In addition, if the `AutoCreate` parameter is set to `True`,
 * then the policy must include the `redshift:CreateClusterUser`
 * permission.
 *
 * If the `DbName` parameter is specified, the IAM policy must allow access
 * to the resource `dbname` for the specified database name.
 */
export const getClusterCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetClusterCredentialsMessage,
    output: ClusterCredentials,
    errors: [ClusterNotFoundFault, UnsupportedOperationFault],
  }),
);
/**
 * Returns a database user name and temporary password with temporary authorization to
 * log in to an Amazon Redshift database.
 * The database user is mapped 1:1 to the source Identity and Access Management (IAM) identity.
 * For more information about IAM identities, see IAM Identities (users, user groups, and roles) in the
 * Amazon Web Services Identity and Access Management User Guide.
 *
 * The Identity and Access Management (IAM) identity that runs
 * this operation must have an IAM policy attached that allows access to all
 * necessary actions and resources.
 * For more information about permissions, see Using identity-based policies (IAM policies) in the
 * Amazon Redshift Cluster Management Guide.
 */
export const getClusterCredentialsWithIAM =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetClusterCredentialsWithIAMMessage,
    output: ClusterExtendedCredentials,
    errors: [ClusterNotFoundFault, UnsupportedOperationFault],
  }));
/**
 * Modifies the list of Identity and Access Management (IAM) roles that can be
 * used by the cluster to access other Amazon Web Services services.
 *
 * The maximum number of IAM roles that you can associate is subject to a quota.
 * For more information, go to Quotas and limits
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const modifyClusterIamRoles = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyClusterIamRolesMessage,
    output: ModifyClusterIamRolesResult,
    errors: [ClusterNotFoundFault, InvalidClusterStateFault],
  }),
);
/**
 * Modifies the maintenance settings of a cluster.
 */
export const modifyClusterMaintenance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyClusterMaintenanceMessage,
    output: ModifyClusterMaintenanceResult,
    errors: [ClusterNotFoundFault, InvalidClusterStateFault],
  }),
);
/**
 * Modifies the parameters of a parameter group. For the parameters parameter, it can't contain ASCII characters.
 *
 * For more information about parameters and parameter groups, go to
 * Amazon Redshift Parameter Groups
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const modifyClusterParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyClusterParameterGroupMessage,
    output: ClusterParameterGroupNameMessage,
    errors: [
      ClusterParameterGroupNotFoundFault,
      InvalidClusterParameterGroupStateFault,
    ],
  }),
);
/**
 * Modifies a snapshot schedule for a cluster.
 */
export const modifyClusterSnapshotSchedule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyClusterSnapshotScheduleMessage,
    output: ModifyClusterSnapshotScheduleResponse,
    errors: [
      ClusterNotFoundFault,
      InvalidClusterSnapshotScheduleStateFault,
      SnapshotScheduleNotFoundFault,
    ],
  }));
/**
 * Contains information for changing a custom domain association.
 */
export const modifyCustomDomainAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyCustomDomainAssociationMessage,
    output: ModifyCustomDomainAssociationResult,
    errors: [
      ClusterNotFoundFault,
      CustomCnameAssociationFault,
      CustomDomainAssociationNotFoundFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Modifies a Redshift-managed VPC endpoint.
 */
export const modifyEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyEndpointAccessMessage,
    output: EndpointAccess,
    errors: [
      ClusterNotFoundFault,
      EndpointNotFoundFault,
      InvalidClusterSecurityGroupStateFault,
      InvalidClusterStateFault,
      InvalidEndpointStateFault,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Changes an existing Amazon Redshift IAM Identity Center application.
 */
export const modifyRedshiftIdcApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyRedshiftIdcApplicationMessage,
    output: ModifyRedshiftIdcApplicationResult,
    errors: [
      DependentServiceAccessDeniedFault,
      DependentServiceUnavailableFault,
      RedshiftIdcApplicationNotExistsFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Modifies a usage limit in a cluster.
 * You can't modify the feature type or period of a usage limit.
 */
export const modifyUsageLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyUsageLimitMessage,
  output: UsageLimit,
  errors: [
    InvalidUsageLimitFault,
    UnsupportedOperationFault,
    UsageLimitNotFoundFault,
  ],
}));
/**
 * Pauses a cluster.
 */
export const pauseCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PauseClusterMessage,
  output: PauseClusterResult,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Reboots a cluster. This action is taken as soon as possible. It results in a
 * momentary outage to the cluster, during which the cluster status is set to
 * `rebooting`. A cluster event is created when the reboot is completed. Any
 * pending cluster modifications (see ModifyCluster) are applied at this
 * reboot.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const rebootCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootClusterMessage,
  output: RebootClusterResult,
  errors: [ClusterNotFoundFault, InvalidClusterStateFault],
}));
/**
 * Registers a cluster or serverless namespace to the Amazon Web Services Glue Data Catalog.
 */
export const registerNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterNamespaceInputMessage,
  output: RegisterNamespaceOutputMessage,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidNamespaceFault,
  ],
}));
/**
 * Sets one or more parameters of the specified parameter group to their default
 * values and sets the source values of the parameters to "engine-default". To reset the
 * entire parameter group specify the *ResetAllParameters* parameter.
 * For parameter changes to take effect you must reboot any associated clusters.
 */
export const resetClusterParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResetClusterParameterGroupMessage,
    output: ClusterParameterGroupNameMessage,
    errors: [
      ClusterParameterGroupNotFoundFault,
      InvalidClusterParameterGroupStateFault,
    ],
  }),
);
/**
 * Resumes a paused cluster.
 */
export const resumeCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeClusterMessage,
  output: ResumeClusterResult,
  errors: [
    ClusterNotFoundFault,
    InsufficientClusterCapacityFault,
    InvalidClusterStateFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Removes the ability of the specified Amazon Web Services account to restore the specified
 * snapshot. If the account is currently restoring the snapshot, the restore will run to
 * completion.
 *
 * For more information about working with snapshots, go to
 * Amazon Redshift Snapshots
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const revokeSnapshotAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RevokeSnapshotAccessMessage,
    output: RevokeSnapshotAccessResult,
    errors: [
      AccessToSnapshotDeniedFault,
      AuthorizationNotFoundFault,
      ClusterSnapshotNotFoundFault,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Updates the status of a partner integration.
 */
export const updatePartnerStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePartnerStatusInputMessage,
  output: PartnerIntegrationOutputMessage,
  errors: [
    ClusterNotFoundFault,
    PartnerNotFoundFault,
    UnauthorizedPartnerIntegrationFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * From a datashare consumer account, associates a datashare with the
 * account (AssociateEntireAccount) or the specified namespace (ConsumerArn). If you make this association, the consumer
 * can consume the datashare.
 */
export const associateDataShareConsumer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateDataShareConsumerMessage,
    output: DataShare,
    errors: [InvalidDataShareFault, InvalidNamespaceFault],
  }),
);
/**
 * Modifies the settings for a set of cluster snapshots.
 */
export const batchModifyClusterSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchModifyClusterSnapshotsMessage,
    output: BatchModifyClusterSnapshotsOutputMessage,
    errors: [
      BatchModifyClusterSnapshotsLimitExceededFault,
      InvalidRetentionPeriodFault,
    ],
  }),
);
/**
 * Copies the specified automated cluster snapshot to a new manual cluster snapshot.
 * The source must be an automated snapshot and it must be in the available
 * state.
 *
 * When you delete a cluster, Amazon Redshift deletes any automated snapshots of the
 * cluster. Also, when the retention period of the snapshot expires, Amazon Redshift
 * automatically deletes it. If you want to keep an automated snapshot for a longer period,
 * you can make a manual copy of the snapshot. Manual snapshots are retained until you
 * delete them.
 *
 * For more information about working with snapshots, go to
 * Amazon Redshift Snapshots
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const copyClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyClusterSnapshotMessage,
  output: CopyClusterSnapshotResult,
  errors: [
    ClusterNotFoundFault,
    ClusterSnapshotAlreadyExistsFault,
    ClusterSnapshotNotFoundFault,
    ClusterSnapshotQuotaExceededFault,
    InvalidClusterSnapshotStateFault,
    InvalidRetentionPeriodFault,
  ],
}));
/**
 * Creates a manual snapshot of the specified cluster. The cluster must be in the
 * `available` state.
 *
 * For more information about working with snapshots, go to
 * Amazon Redshift Snapshots
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const createClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateClusterSnapshotMessage,
    output: CreateClusterSnapshotResult,
    errors: [
      ClusterNotFoundFault,
      ClusterSnapshotAlreadyExistsFault,
      ClusterSnapshotQuotaExceededFault,
      InvalidClusterStateFault,
      InvalidRetentionPeriodFault,
      InvalidTagFault,
      TagLimitExceededFault,
    ],
  }),
);
/**
 * Adds tags to a cluster.
 *
 * A resource can have up to 50 tags. If you try to create more than 50 tags for a
 * resource, you will receive an error and the attempt will fail.
 *
 * If you specify a key that already exists for the resource, the value for that key
 * will be updated with the new value.
 */
export const createTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTagsMessage,
  output: CreateTagsResponse,
  errors: [
    InvalidClusterStateFault,
    InvalidTagFault,
    ResourceNotFoundFault,
    TagLimitExceededFault,
  ],
}));
/**
 * Deletes an authentication profile.
 */
export const deleteAuthenticationProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAuthenticationProfileMessage,
    output: DeleteAuthenticationProfileResult,
    errors: [
      AuthenticationProfileNotFoundFault,
      InvalidAuthenticationProfileRequestFault,
    ],
  }),
);
/**
 * Deletes a specified Amazon Redshift parameter group.
 *
 * You cannot delete a parameter group if it is associated with a
 * cluster.
 */
export const deleteClusterParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteClusterParameterGroupMessage,
    output: DeleteClusterParameterGroupResponse,
    errors: [
      ClusterParameterGroupNotFoundFault,
      InvalidClusterParameterGroupStateFault,
    ],
  }),
);
/**
 * Deletes the specified manual snapshot. The snapshot must be in the
 * `available` state, with no other users authorized to access the snapshot.
 *
 * Unlike automated snapshots, manual snapshots are retained even after you delete
 * your cluster. Amazon Redshift does not delete your manual snapshots. You must delete manual
 * snapshot explicitly to avoid getting charged. If other accounts are authorized to access
 * the snapshot, you must revoke all of the authorizations before you can delete the
 * snapshot.
 */
export const deleteClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteClusterSnapshotMessage,
    output: DeleteClusterSnapshotResult,
    errors: [ClusterSnapshotNotFoundFault, InvalidClusterSnapshotStateFault],
  }),
);
/**
 * Contains information about deleting a custom domain association for a cluster.
 */
export const deleteCustomDomainAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCustomDomainAssociationMessage,
    output: DeleteCustomDomainAssociationResponse,
    errors: [
      ClusterNotFoundFault,
      CustomCnameAssociationFault,
      CustomDomainAssociationNotFoundFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Deletes a Redshift-managed VPC endpoint.
 */
export const deleteEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEndpointAccessMessage,
    output: EndpointAccess,
    errors: [
      ClusterNotFoundFault,
      EndpointNotFoundFault,
      InvalidClusterSecurityGroupStateFault,
      InvalidClusterStateFault,
      InvalidEndpointStateFault,
    ],
  }),
);
/**
 * Deletes an Amazon Redshift event notification subscription.
 */
export const deleteEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEventSubscriptionMessage,
    output: DeleteEventSubscriptionResponse,
    errors: [InvalidSubscriptionStateFault, SubscriptionNotFoundFault],
  }),
);
/**
 * Deletes the specified HSM client certificate.
 */
export const deleteHsmClientCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteHsmClientCertificateMessage,
    output: DeleteHsmClientCertificateResponse,
    errors: [
      HsmClientCertificateNotFoundFault,
      InvalidHsmClientCertificateStateFault,
    ],
  }),
);
/**
 * Deletes the specified Amazon Redshift HSM configuration.
 */
export const deleteHsmConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteHsmConfigurationMessage,
    output: DeleteHsmConfigurationResponse,
    errors: [HsmConfigurationNotFoundFault, InvalidHsmConfigurationStateFault],
  }),
);
/**
 * Deletes an Amazon Redshift IAM Identity Center application.
 */
export const deleteRedshiftIdcApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteRedshiftIdcApplicationMessage,
    output: DeleteRedshiftIdcApplicationResponse,
    errors: [
      DependentServiceAccessDeniedFault,
      DependentServiceUnavailableFault,
      RedshiftIdcApplicationNotExistsFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Deletes a scheduled action.
 */
export const deleteScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteScheduledActionMessage,
    output: DeleteScheduledActionResponse,
    errors: [ScheduledActionNotFoundFault, UnauthorizedOperation],
  }),
);
/**
 * Deletes the specified snapshot copy grant.
 */
export const deleteSnapshotCopyGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSnapshotCopyGrantMessage,
    output: DeleteSnapshotCopyGrantResponse,
    errors: [
      InvalidSnapshotCopyGrantStateFault,
      SnapshotCopyGrantNotFoundFault,
    ],
  }),
);
/**
 * Deletes a usage limit from a cluster.
 */
export const deleteUsageLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUsageLimitMessage,
  output: DeleteUsageLimitResponse,
  errors: [UnsupportedOperationFault, UsageLimitNotFoundFault],
}));
/**
 * Describes an authentication profile.
 */
export const describeAuthenticationProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAuthenticationProfilesMessage,
    output: DescribeAuthenticationProfilesResult,
    errors: [
      AuthenticationProfileNotFoundFault,
      InvalidAuthenticationProfileRequestFault,
    ],
  }));
/**
 * Returns one or more snapshot objects, which contain metadata about your cluster
 * snapshots. By default, this operation returns information about all snapshots of all
 * clusters that are owned by your Amazon Web Services account. No information is returned for
 * snapshots owned by inactive Amazon Web Services accounts.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all snapshots that match any combination of the specified keys and values. For example,
 * if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all snapshots that have any
 * combination of those values are returned. Only snapshots that you own are returned in
 * the response; shared snapshots are not returned with the tag key and tag value request
 * parameters.
 *
 * If both tag keys and values are omitted from the request, snapshots are returned
 * regardless of whether they have tag keys or values associated with them.
 */
export const describeClusterSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeClusterSnapshotsMessage,
    output: SnapshotMessage,
    errors: [
      ClusterNotFoundFault,
      ClusterSnapshotNotFoundFault,
      InvalidTagFault,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Returns descriptions of the available Amazon Redshift cluster versions. You can call this
 * operation even before creating any clusters to learn more about the Amazon Redshift versions.
 *
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeClusterVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeClusterVersionsMessage,
    output: ClusterVersionsMessage,
    errors: [],
  }),
);
/**
 * Returns a list of parameter settings for the specified parameter group
 * family.
 *
 * For more information about parameters and parameter groups, go to
 * Amazon Redshift Parameter Groups
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeDefaultClusterParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDefaultClusterParametersMessage,
    output: DescribeDefaultClusterParametersResult,
    errors: [],
  }));
/**
 * Returns events related to clusters, security groups, snapshots, and parameter
 * groups for the past 14 days. Events specific to a particular cluster, security group,
 * snapshot or parameter group can be obtained by providing the name as a parameter. By
 * default, the past hour of events are returned.
 */
export const describeEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventsMessage,
  output: EventsMessage,
  errors: [],
}));
/**
 * Returns a list of inbound integrations.
 */
export const describeInboundIntegrations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInboundIntegrationsMessage,
    output: InboundIntegrationsMessage,
    errors: [
      IntegrationNotFoundFault,
      InvalidNamespaceFault,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Describes one or more zero-ETL or S3 event integrations with Amazon Redshift.
 */
export const describeIntegrations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeIntegrationsMessage,
    output: IntegrationsMessage,
    errors: [IntegrationNotFoundFault, UnsupportedOperationFault],
  }),
);
/**
 * Returns information about the partner integrations defined for a cluster.
 */
export const describePartners = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePartnersInputMessage,
  output: DescribePartnersOutputMessage,
  errors: [
    ClusterNotFoundFault,
    UnauthorizedPartnerIntegrationFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Lists the Amazon Redshift IAM Identity Center applications.
 */
export const describeRedshiftIdcApplications =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRedshiftIdcApplicationsMessage,
    output: DescribeRedshiftIdcApplicationsResult,
    errors: [
      DependentServiceAccessDeniedFault,
      DependentServiceUnavailableFault,
      RedshiftIdcApplicationNotExistsFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Returns the descriptions of the reserved nodes.
 */
export const describeReservedNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeReservedNodesMessage,
    output: ReservedNodesMessage,
    errors: [DependentServiceUnavailableFault, ReservedNodeNotFoundFault],
  }),
);
/**
 * Describes properties of scheduled actions.
 */
export const describeScheduledActions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeScheduledActionsMessage,
    output: ScheduledActionsMessage,
    errors: [ScheduledActionNotFoundFault, UnauthorizedOperation],
  }),
);
/**
 * Returns a list of tags. You can return tags from a specific resource by specifying
 * an ARN, or you can return all tags for a given type of resource, such as clusters,
 * snapshots, and so on.
 *
 * The following are limitations for `DescribeTags`:
 *
 * - You cannot specify an ARN and a resource-type value together in the same
 * request.
 *
 * - You cannot use the `MaxRecords` and `Marker`
 * parameters together with the ARN parameter.
 *
 * - The `MaxRecords` parameter can be a range from 10 to 50 results
 * to return in a request.
 *
 * If you specify both tag keys and tag values in the same request, Amazon Redshift returns
 * all resources that match any combination of the specified keys and values. For example,
 * if you have `owner` and `environment` for tag keys, and
 * `admin` and `test` for tag values, all resources that have any
 * combination of those values are returned.
 *
 * If both tag keys and values are omitted from the request, resources are returned
 * regardless of whether they have tag keys or values associated with them.
 */
export const describeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTagsMessage,
  output: TaggedResourceListMessage,
  errors: [InvalidTagFault, ResourceNotFoundFault],
}));
/**
 * Disables the automatic copying of snapshots from one region to another region for a
 * specified cluster.
 *
 * If your cluster and its snapshots are encrypted using an encrypted symmetric key
 * from Key Management Service, use DeleteSnapshotCopyGrant to delete the grant that
 * grants Amazon Redshift permission to the key in the destination region.
 */
export const disableSnapshotCopy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableSnapshotCopyMessage,
  output: DisableSnapshotCopyResult,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    SnapshotCopyAlreadyDisabledFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
  ],
}));
/**
 * Generates an encrypted authentication token that propagates the caller's
 * Amazon Web Services IAM Identity Center identity to Amazon Redshift clusters. This API extracts the
 * Amazon Web Services IAM Identity Center identity from enhanced credentials and creates a secure token
 * that Amazon Redshift drivers can use for authentication.
 *
 * The token is encrypted using Key Management Service (KMS) and can only be
 * decrypted by the specified Amazon Redshift clusters. The token contains the caller's
 * Amazon Web Services IAM Identity Center identity information and is valid for a limited time period.
 *
 * This API is exclusively for use with Amazon Web Services IAM Identity Center enhanced credentials. If the
 * caller is not using enhanced credentials with embedded Amazon Web Services IAM Identity Center identity, the API will
 * return an error.
 */
export const getIdentityCenterAuthToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetIdentityCenterAuthTokenRequest,
    output: GetIdentityCenterAuthTokenResponse,
    errors: [
      ClusterNotFoundFault,
      InvalidClusterStateFault,
      RedshiftInvalidParameterFault,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Returns an array of DC2 ReservedNodeOfferings that matches the payment type, term,
 * and usage price of the given DC1 reserved node.
 */
export const getReservedNodeExchangeOfferings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetReservedNodeExchangeOfferingsInputMessage,
    output: GetReservedNodeExchangeOfferingsOutputMessage,
    errors: [
      DependentServiceUnavailableFault,
      InvalidReservedNodeStateFault,
      ReservedNodeAlreadyMigratedFault,
      ReservedNodeNotFoundFault,
      ReservedNodeOfferingNotFoundFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * This operation is retired. Calling this operation does not change AQUA configuration. Amazon Redshift automatically determines whether to use AQUA (Advanced Query Accelerator).
 */
export const modifyAquaConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyAquaInputMessage,
    output: ModifyAquaOutputMessage,
    errors: [
      ClusterNotFoundFault,
      InvalidClusterStateFault,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Modifies an authentication profile.
 */
export const modifyAuthenticationProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyAuthenticationProfileMessage,
    output: ModifyAuthenticationProfileResult,
    errors: [
      AuthenticationProfileNotFoundFault,
      AuthenticationProfileQuotaExceededFault,
      InvalidAuthenticationProfileRequestFault,
    ],
  }),
);
/**
 * Modifies the database revision of a cluster. The database revision is a unique
 * revision of the database running in a cluster.
 */
export const modifyClusterDbRevision = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyClusterDbRevisionMessage,
    output: ModifyClusterDbRevisionResult,
    errors: [
      ClusterNotFoundFault,
      ClusterOnLatestRevisionFault,
      InvalidClusterStateFault,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Modifies the settings for a snapshot.
 *
 * This exanmple modifies the manual retention period setting for a cluster snapshot.
 */
export const modifyClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyClusterSnapshotMessage,
    output: ModifyClusterSnapshotResult,
    errors: [
      ClusterSnapshotNotFoundFault,
      InvalidClusterSnapshotStateFault,
      InvalidRetentionPeriodFault,
    ],
  }),
);
/**
 * Modifies a zero-ETL integration or S3 event integration with Amazon Redshift.
 */
export const modifyIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyIntegrationMessage,
  output: Integration,
  errors: [
    IntegrationAlreadyExistsFault,
    IntegrationConflictOperationFault,
    IntegrationConflictStateFault,
    IntegrationNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Modifies the lakehouse configuration for a cluster. This operation allows you to manage Amazon Redshift federated permissions and Amazon Web Services IAM Identity Center trusted identity propagation.
 */
export const modifyLakehouseConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyLakehouseConfigurationMessage,
    output: LakehouseConfiguration,
    errors: [
      ClusterNotFoundFault,
      DependentServiceAccessDeniedFault,
      DependentServiceUnavailableFault,
      InvalidClusterStateFault,
      RedshiftIdcApplicationNotExistsFault,
      UnauthorizedOperation,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Modifies a scheduled action.
 */
export const modifyScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyScheduledActionMessage,
    output: ScheduledAction,
    errors: [
      ClusterNotFoundFault,
      InvalidScheduledActionFault,
      InvalidScheduleFault,
      ScheduledActionNotFoundFault,
      ScheduledActionTypeUnsupportedFault,
      UnauthorizedOperation,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Modifies a snapshot schedule. Any schedule associated with a cluster is modified
 * asynchronously.
 */
export const modifySnapshotSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifySnapshotScheduleMessage,
    output: SnapshotSchedule,
    errors: [
      InvalidScheduleFault,
      SnapshotScheduleNotFoundFault,
      SnapshotScheduleUpdateInProgressFault,
    ],
  }),
);
/**
 * Updates the resource policy for a specified resource.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyMessage,
  output: PutResourcePolicyResult,
  errors: [
    ConflictPolicyUpdateFault,
    InvalidPolicyFault,
    ResourceNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Revokes an ingress rule in an Amazon Redshift security group for a previously authorized
 * IP range or Amazon EC2 security group. To add an ingress rule, see AuthorizeClusterSecurityGroupIngress.
 * For information about managing security groups, go to
 * Amazon Redshift Cluster Security Groups in the
 * *Amazon Redshift Cluster Management Guide*.
 */
export const revokeClusterSecurityGroupIngress =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RevokeClusterSecurityGroupIngressMessage,
    output: RevokeClusterSecurityGroupIngressResult,
    errors: [
      AuthorizationNotFoundFault,
      ClusterSecurityGroupNotFoundFault,
      InvalidClusterSecurityGroupStateFault,
    ],
  }));
/**
 * Revokes access to a cluster.
 */
export const revokeEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RevokeEndpointAccessMessage,
    output: EndpointAuthorization,
    errors: [
      ClusterNotFoundFault,
      EndpointAuthorizationNotFoundFault,
      EndpointNotFoundFault,
      InvalidAuthorizationStateFault,
      InvalidClusterSecurityGroupStateFault,
      InvalidClusterStateFault,
      InvalidEndpointStateFault,
    ],
  }),
);
/**
 * Rotates the encryption keys for a cluster.
 */
export const rotateEncryptionKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RotateEncryptionKeyMessage,
  output: RotateEncryptionKeyResult,
  errors: [
    ClusterNotFoundFault,
    DependentServiceRequestThrottlingFault,
    InvalidClusterStateFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Exchanges a DC1 Reserved Node for a DC2 Reserved Node with no changes to the
 * configuration (term, payment type, or number of nodes) and no additional costs.
 */
export const acceptReservedNodeExchange = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AcceptReservedNodeExchangeInputMessage,
    output: AcceptReservedNodeExchangeOutputMessage,
    errors: [
      DependentServiceUnavailableFault,
      InvalidReservedNodeStateFault,
      ReservedNodeAlreadyExistsFault,
      ReservedNodeAlreadyMigratedFault,
      ReservedNodeNotFoundFault,
      ReservedNodeOfferingNotFoundFault,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Grants access to a cluster.
 */
export const authorizeEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AuthorizeEndpointAccessMessage,
    output: EndpointAuthorization,
    errors: [
      ClusterNotFoundFault,
      EndpointAuthorizationAlreadyExistsFault,
      EndpointAuthorizationsPerClusterLimitExceededFault,
      InvalidAuthorizationStateFault,
      InvalidClusterStateFault,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Deletes a set of cluster snapshots.
 */
export const batchDeleteClusterSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteClusterSnapshotsRequest,
    output: BatchDeleteClusterSnapshotsResult,
    errors: [BatchDeleteRequestSizeExceededFault],
  }),
);
/**
 * Creates an authentication profile with the specified parameters.
 */
export const createAuthenticationProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAuthenticationProfileMessage,
    output: CreateAuthenticationProfileResult,
    errors: [
      AuthenticationProfileAlreadyExistsFault,
      AuthenticationProfileQuotaExceededFault,
      InvalidAuthenticationProfileRequestFault,
    ],
  }),
);
/**
 * Creates a new Amazon Redshift security group. You use security groups to control access
 * to non-VPC clusters.
 *
 * For information about managing security groups, go to
 * Amazon Redshift Cluster Security Groups in the
 * *Amazon Redshift Cluster Management Guide*.
 */
export const createClusterSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateClusterSecurityGroupMessage,
    output: CreateClusterSecurityGroupResult,
    errors: [
      ClusterSecurityGroupAlreadyExistsFault,
      ClusterSecurityGroupQuotaExceededFault,
      InvalidTagFault,
      TagLimitExceededFault,
    ],
  }),
);
/**
 * Creates a usage limit for a specified Amazon Redshift feature on a cluster.
 * The usage limit is identified by the returned usage limit identifier.
 */
export const createUsageLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUsageLimitMessage,
  output: UsageLimit,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidUsageLimitFault,
    LimitExceededFault,
    TagLimitExceededFault,
    UnsupportedOperationFault,
    UsageLimitAlreadyExistsFault,
  ],
}));
/**
 * Deletes the specified cluster subnet group.
 */
export const deleteClusterSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteClusterSubnetGroupMessage,
    output: DeleteClusterSubnetGroupResponse,
    errors: [
      ClusterSubnetGroupNotFoundFault,
      InvalidClusterSubnetGroupStateFault,
      InvalidClusterSubnetStateFault,
    ],
  }),
);
/**
 * Deletes a zero-ETL integration or S3 event integration with Amazon Redshift.
 */
export const deleteIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationMessage,
  output: Integration,
  errors: [
    IntegrationConflictOperationFault,
    IntegrationConflictStateFault,
    IntegrationNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Deregisters a cluster or serverless namespace from the Amazon Web Services Glue Data Catalog.
 */
export const deregisterNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterNamespaceInputMessage,
  output: DeregisterNamespaceOutputMessage,
  errors: [
    ClusterNotFoundFault,
    InvalidClusterStateFault,
    InvalidNamespaceFault,
  ],
}));
/**
 * Returns a list of attributes attached to an account
 */
export const describeAccountAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountAttributesMessage,
    output: AccountAttributeList,
    errors: [],
  }),
);
/**
 * Returns an array of `ClusterDbRevision` objects.
 */
export const describeClusterDbRevisions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeClusterDbRevisionsMessage,
    output: ClusterDbRevisionsMessage,
    errors: [ClusterNotFoundFault, InvalidClusterStateFault],
  }),
);
/**
 * Contains information about custom domain associations for a cluster.
 */
export const describeCustomDomainAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeCustomDomainAssociationsMessage,
    output: CustomDomainAssociationsMessage,
    errors: [CustomDomainAssociationNotFoundFault, UnsupportedOperationFault],
  }));
/**
 * Displays a list of event categories for all event source types, or for a specified
 * source type. For a list of the event categories and source types, go to Amazon Redshift Event
 * Notifications.
 */
export const describeEventCategories = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventCategoriesMessage,
    output: EventCategoriesMessage,
    errors: [],
  }),
);
/**
 * Returns properties of possible node configurations such as node type, number of nodes, and
 * disk usage for the specified action type.
 */
export const describeNodeConfigurationOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeNodeConfigurationOptionsMessage,
    output: NodeConfigurationOptionsMessage,
    errors: [
      AccessToSnapshotDeniedFault,
      ClusterNotFoundFault,
      ClusterSnapshotNotFoundFault,
      InvalidClusterSnapshotStateFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Returns exchange status details and associated metadata for a reserved-node
 * exchange. Statuses include such values as in progress and requested.
 */
export const describeReservedNodeExchangeStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeReservedNodeExchangeStatusInputMessage,
    output: DescribeReservedNodeExchangeStatusOutputMessage,
    errors: [
      ReservedNodeExchangeNotFoundFault,
      ReservedNodeNotFoundFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Returns a list of the available reserved node offerings by Amazon Redshift with their
 * descriptions including the node type, the fixed and recurring costs of reserving the
 * node and duration the node will be reserved for you. These descriptions help you
 * determine which reserve node offering you want to purchase. You then use the unique
 * offering ID in you call to PurchaseReservedNodeOffering to reserve one
 * or more nodes for your Amazon Redshift cluster.
 *
 * For more information about reserved node offerings, go to
 * Purchasing Reserved Nodes
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeReservedNodeOfferings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeReservedNodeOfferingsMessage,
    output: ReservedNodeOfferingsMessage,
    errors: [
      DependentServiceUnavailableFault,
      ReservedNodeOfferingNotFoundFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Lists the status of one or more table restore requests made using the RestoreTableFromClusterSnapshot API action. If you don't specify a value
 * for the `TableRestoreRequestId` parameter, then
 * `DescribeTableRestoreStatus` returns the status of all table restore
 * requests ordered by the date and time of the request in ascending order. Otherwise
 * `DescribeTableRestoreStatus` returns the status of the table specified by
 * `TableRestoreRequestId`.
 */
export const describeTableRestoreStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTableRestoreStatusMessage,
    output: TableRestoreStatusMessage,
    errors: [ClusterNotFoundFault, TableRestoreNotFoundFault],
  }),
);
/**
 * Gets the configuration options for the reserved-node exchange. These options
 * include information about the source reserved node and target reserved node offering.
 * Details include the node type, the price, the node count, and the offering type.
 */
export const getReservedNodeExchangeConfigurationOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetReservedNodeExchangeConfigurationOptionsInputMessage,
    output: GetReservedNodeExchangeConfigurationOptionsOutputMessage,
    errors: [
      ClusterNotFoundFault,
      ClusterSnapshotNotFoundFault,
      DependentServiceUnavailableFault,
      InvalidReservedNodeStateFault,
      ReservedNodeAlreadyMigratedFault,
      ReservedNodeNotFoundFault,
      ReservedNodeOfferingNotFoundFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Get the resource policy for a specified resource.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyMessage,
  output: GetResourcePolicyResult,
  errors: [
    InvalidPolicyFault,
    ResourceNotFoundFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * List the Amazon Redshift Advisor recommendations for one or multiple Amazon Redshift clusters in an Amazon Web Services account.
 */
export const listRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRecommendationsMessage,
  output: ListRecommendationsResult,
  errors: [ClusterNotFoundFault, UnsupportedOperationFault],
}));
/**
 * Modifies the number of days to retain snapshots in the destination Amazon Web Services Region after
 * they are copied from the source Amazon Web Services Region. By default, this operation only changes the
 * retention period of copied automated snapshots. The retention periods for both new and
 * existing copied automated snapshots are updated with the new retention period. You can
 * set the manual option to change only the retention periods of copied manual snapshots.
 * If you set this option, only newly copied manual snapshots have the new retention
 * period.
 */
export const modifySnapshotCopyRetentionPeriod =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifySnapshotCopyRetentionPeriodMessage,
    output: ModifySnapshotCopyRetentionPeriodResult,
    errors: [
      ClusterNotFoundFault,
      InvalidClusterStateFault,
      InvalidRetentionPeriodFault,
      SnapshotCopyDisabledFault,
      UnauthorizedOperation,
    ],
  }));
/**
 * Allows you to purchase reserved nodes. Amazon Redshift offers a predefined set of
 * reserved node offerings. You can purchase one or more of the offerings. You can call the
 * DescribeReservedNodeOfferings API to obtain the available reserved
 * node offerings. You can call this API by providing a specific reserved node offering and
 * the number of nodes you want to reserve.
 *
 * For more information about reserved node offerings, go to
 * Purchasing Reserved Nodes
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const purchaseReservedNodeOffering =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PurchaseReservedNodeOfferingMessage,
    output: PurchaseReservedNodeOfferingResult,
    errors: [
      ReservedNodeAlreadyExistsFault,
      ReservedNodeOfferingNotFoundFault,
      ReservedNodeQuotaExceededFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Creates a new table from a table in an Amazon Redshift cluster snapshot. You must
 * create the new table within the Amazon Redshift cluster that the snapshot was taken
 * from.
 *
 * You cannot use `RestoreTableFromClusterSnapshot` to restore a table with
 * the same name as an existing table in an Amazon Redshift cluster. That is, you cannot
 * overwrite an existing table in a cluster with a restored table. If you want to replace
 * your original table with a new, restored table, then rename or drop your original table
 * before you call `RestoreTableFromClusterSnapshot`. When you have renamed your
 * original table, then you can pass the original name of the table as the
 * `NewTableName` parameter value in the call to
 * `RestoreTableFromClusterSnapshot`. This way, you can replace the original
 * table with the table created from the snapshot.
 *
 * You can't use this operation to restore tables with
 * interleaved sort keys.
 */
export const restoreTableFromClusterSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RestoreTableFromClusterSnapshotMessage,
    output: RestoreTableFromClusterSnapshotResult,
    errors: [
      ClusterNotFoundFault,
      ClusterSnapshotNotFoundFault,
      InProgressTableRestoreQuotaExceededFault,
      InvalidClusterSnapshotStateFault,
      InvalidClusterStateFault,
      InvalidTableRestoreArgumentFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Adds an inbound (ingress) rule to an Amazon Redshift security group. Depending on whether
 * the application accessing your cluster is running on the Internet or an Amazon EC2
 * instance, you can authorize inbound access to either a Classless Interdomain Routing
 * (CIDR)/Internet Protocol (IP) range or to an Amazon EC2 security group. You can add as
 * many as 20 ingress rules to an Amazon Redshift security group.
 *
 * If you authorize access to an Amazon EC2 security group, specify
 * *EC2SecurityGroupName* and
 * *EC2SecurityGroupOwnerId*. The Amazon EC2 security group and
 * Amazon Redshift cluster must be in the same Amazon Web Services Region.
 *
 * If you authorize access to a CIDR/IP address range, specify
 * *CIDRIP*. For an overview of CIDR blocks, see the Wikipedia
 * article on Classless Inter-Domain Routing.
 *
 * You must also associate the security group with a cluster so that clients running
 * on these IP addresses or the EC2 instance are authorized to connect to the cluster. For
 * information about managing security groups, go to Working with Security
 * Groups in the *Amazon Redshift Cluster Management Guide*.
 */
export const authorizeClusterSecurityGroupIngress =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AuthorizeClusterSecurityGroupIngressMessage,
    output: AuthorizeClusterSecurityGroupIngressResult,
    errors: [
      AuthorizationAlreadyExistsFault,
      AuthorizationQuotaExceededFault,
      ClusterSecurityGroupNotFoundFault,
      InvalidClusterSecurityGroupStateFault,
    ],
  }));
/**
 * Authorizes the specified Amazon Web Services account to restore the specified
 * snapshot.
 *
 * For more information about working with snapshots, go to
 * Amazon Redshift Snapshots
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const authorizeSnapshotAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AuthorizeSnapshotAccessMessage,
    output: AuthorizeSnapshotAccessResult,
    errors: [
      AuthorizationAlreadyExistsFault,
      AuthorizationQuotaExceededFault,
      ClusterSnapshotNotFoundFault,
      DependentServiceRequestThrottlingFault,
      InvalidClusterSnapshotStateFault,
      LimitExceededFault,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Creates a new cluster with the specified parameters.
 *
 * To create a cluster in Virtual Private Cloud (VPC), you must provide a cluster
 * subnet group name. The cluster subnet group identifies the subnets of your VPC that
 * Amazon Redshift uses when creating the cluster.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that
 * you own in a Region from reaching or being reached from the internet through internet
 * gateways and egress-only internet gateways. If a subnet group for a
 * provisioned cluster is in an account with VPC BPA turned on, the following capabilities
 * are blocked:
 *
 * - Creating a public cluster
 *
 * - Restoring a public cluster
 *
 * - Modifying a private cluster to be public
 *
 * - Adding a subnet with VPC BPA turned on to the subnet group when there's at
 * least one public cluster within the group
 *
 * For more information about VPC BPA, see Block public access to VPCs and
 * subnets in the *Amazon VPC User Guide*.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterMessage,
  output: CreateClusterResult,
  errors: [
    ClusterAlreadyExistsFault,
    ClusterParameterGroupNotFoundFault,
    ClusterQuotaExceededFault,
    ClusterSecurityGroupNotFoundFault,
    ClusterSubnetGroupNotFoundFault,
    DependentServiceAccessDeniedFault,
    DependentServiceRequestThrottlingFault,
    DependentServiceUnavailableFault,
    HsmClientCertificateNotFoundFault,
    HsmConfigurationNotFoundFault,
    InsufficientClusterCapacityFault,
    InvalidClusterSubnetGroupStateFault,
    InvalidClusterTrackFault,
    InvalidElasticIpFault,
    InvalidRetentionPeriodFault,
    InvalidSubnet,
    InvalidTagFault,
    InvalidVPCNetworkStateFault,
    Ipv6CidrBlockNotFoundFault,
    LimitExceededFault,
    NumberOfNodesPerClusterLimitExceededFault,
    NumberOfNodesQuotaExceededFault,
    RedshiftIdcApplicationNotExistsFault,
    SnapshotScheduleNotFoundFault,
    TagLimitExceededFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
  ],
}));
/**
 * Creates an Amazon Redshift parameter group.
 *
 * Creating parameter groups is independent of creating clusters. You can associate a
 * cluster with a parameter group when you create the cluster. You can also associate an
 * existing cluster with a parameter group after the cluster is created by using ModifyCluster.
 *
 * Parameters in the parameter group define specific behavior that applies to the
 * databases you create on the cluster.
 * For more information about parameters and parameter groups, go to
 * Amazon Redshift Parameter Groups
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const createClusterParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateClusterParameterGroupMessage,
    output: CreateClusterParameterGroupResult,
    errors: [
      ClusterParameterGroupAlreadyExistsFault,
      ClusterParameterGroupQuotaExceededFault,
      InvalidTagFault,
      TagLimitExceededFault,
    ],
  }),
);
/**
 * Creates an HSM client certificate that an Amazon Redshift cluster will use to connect to
 * the client's HSM in order to store and retrieve the keys used to encrypt the cluster
 * databases.
 *
 * The command returns a public key, which you must store in the HSM. In addition to
 * creating the HSM certificate, you must create an Amazon Redshift HSM configuration that
 * provides a cluster the information needed to store and use encryption keys in the HSM.
 * For more information, go to Hardware Security Modules
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const createHsmClientCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateHsmClientCertificateMessage,
    output: CreateHsmClientCertificateResult,
    errors: [
      HsmClientCertificateAlreadyExistsFault,
      HsmClientCertificateQuotaExceededFault,
      InvalidTagFault,
      TagLimitExceededFault,
    ],
  }),
);
/**
 * Creates an HSM configuration that contains the information required by an Amazon Redshift
 * cluster to store and use database encryption keys in a Hardware Security Module (HSM).
 * After creating the HSM configuration, you can specify it as a parameter when creating a
 * cluster. The cluster will then store its encryption keys in the HSM.
 *
 * In addition to creating an HSM configuration, you must also create an HSM client
 * certificate. For more information, go to Hardware Security Modules
 * in the Amazon Redshift Cluster Management Guide.
 */
export const createHsmConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateHsmConfigurationMessage,
    output: CreateHsmConfigurationResult,
    errors: [
      HsmConfigurationAlreadyExistsFault,
      HsmConfigurationQuotaExceededFault,
      InvalidTagFault,
      TagLimitExceededFault,
    ],
  }),
);
/**
 * Creates a scheduled action. A scheduled action contains a schedule and an Amazon Redshift API action.
 * For example, you can create a schedule of when to run the `ResizeCluster` API operation.
 */
export const createScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateScheduledActionMessage,
    output: ScheduledAction,
    errors: [
      ClusterNotFoundFault,
      InvalidScheduledActionFault,
      InvalidScheduleFault,
      ScheduledActionAlreadyExistsFault,
      ScheduledActionQuotaExceededFault,
      ScheduledActionTypeUnsupportedFault,
      UnauthorizedOperation,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Creates a snapshot copy grant that permits Amazon Redshift to use an encrypted symmetric key
 * from Key Management Service (KMS) to encrypt copied snapshots in a
 * destination region.
 *
 * For more information about managing snapshot copy grants, go to
 * Amazon Redshift Database Encryption
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const createSnapshotCopyGrant = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSnapshotCopyGrantMessage,
    output: CreateSnapshotCopyGrantResult,
    errors: [
      DependentServiceRequestThrottlingFault,
      InvalidTagFault,
      LimitExceededFault,
      SnapshotCopyGrantAlreadyExistsFault,
      SnapshotCopyGrantQuotaExceededFault,
      TagLimitExceededFault,
    ],
  }),
);
/**
 * Deletes a previously provisioned cluster without its final snapshot being created. A successful response from the web
 * service indicates that the request was received correctly. Use DescribeClusters to monitor the status of the deletion. The delete
 * operation cannot be canceled or reverted once submitted.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 *
 * If you want to shut down the cluster and retain it for future use, set
 * *SkipFinalClusterSnapshot* to `false` and specify a
 * name for *FinalClusterSnapshotIdentifier*. You can later restore this
 * snapshot to resume using the cluster. If a final cluster snapshot is requested, the
 * status of the cluster will be "final-snapshot" while the snapshot is being taken, then
 * it's "deleting" once Amazon Redshift begins deleting the cluster.
 *
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const deleteCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterMessage,
  output: DeleteClusterResult,
  errors: [
    ClusterNotFoundFault,
    ClusterSnapshotAlreadyExistsFault,
    ClusterSnapshotQuotaExceededFault,
    InvalidClusterStateFault,
    InvalidRetentionPeriodFault,
  ],
}));
/**
 * Returns a list of all the available maintenance tracks.
 */
export const describeClusterTracks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeClusterTracksMessage,
    output: TrackListMessage,
    errors: [InvalidClusterTrackFault, UnauthorizedOperation],
  }),
);
/**
 * Returns a list of orderable cluster options. Before you create a new cluster you
 * can use this operation to find what options are available, such as the EC2 Availability
 * Zones (AZ) in the specific Amazon Web Services Region that you can specify, and the node types you can
 * request. The node types differ by available storage, memory, CPU and price. With the
 * cost involved you might want to obtain a list of cluster options in the specific region
 * and specify values when creating a cluster.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const describeOrderableClusterOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeOrderableClusterOptionsMessage,
    output: OrderableClusterOptionsMessage,
    errors: [],
  }));
/**
 * Starts logging information, such as queries and connection attempts, for the
 * specified Amazon Redshift cluster.
 */
export const enableLogging = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableLoggingMessage,
  output: LoggingStatus,
  errors: [
    BucketNotFoundFault,
    ClusterNotFoundFault,
    InsufficientS3BucketPolicyFault,
    InvalidClusterStateFault,
    InvalidS3BucketNameFault,
    InvalidS3KeyPrefixFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Modifies a cluster subnet group to include the specified list of VPC subnets. The
 * operation replaces the existing list of subnets with the new list of subnets.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that
 * you own in a Region from reaching or being reached from the internet through internet
 * gateways and egress-only internet gateways. If a subnet group for a
 * provisioned cluster is in an account with VPC BPA turned on, the following capabilities
 * are blocked:
 *
 * - Creating a public cluster
 *
 * - Restoring a public cluster
 *
 * - Modifying a private cluster to be public
 *
 * - Adding a subnet with VPC BPA turned on to the subnet group when there's at
 * least one public cluster within the group
 *
 * For more information about VPC BPA, see Block public access to VPCs and
 * subnets in the *Amazon VPC User Guide*.
 */
export const modifyClusterSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyClusterSubnetGroupMessage,
    output: ModifyClusterSubnetGroupResult,
    errors: [
      ClusterSubnetGroupNotFoundFault,
      ClusterSubnetQuotaExceededFault,
      DependentServiceRequestThrottlingFault,
      InvalidSubnet,
      SubnetAlreadyInUse,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Creates a new cluster from a snapshot. By default, Amazon Redshift creates the resulting
 * cluster with the same configuration as the original cluster from which the snapshot was
 * created, except that the new cluster is created with the default cluster security and
 * parameter groups. After Amazon Redshift creates the cluster, you can use the ModifyCluster API to associate a different security group and different
 * parameter group with the restored cluster. If you are using a DS node type, you can also
 * choose to change to another DS node type of the same size during restore.
 *
 * If you restore a cluster into a VPC, you must provide a cluster subnet group where
 * you want the cluster restored.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that
 * you own in a Region from reaching or being reached from the internet through internet
 * gateways and egress-only internet gateways. If a subnet group for a
 * provisioned cluster is in an account with VPC BPA turned on, the following capabilities
 * are blocked:
 *
 * - Creating a public cluster
 *
 * - Restoring a public cluster
 *
 * - Modifying a private cluster to be public
 *
 * - Adding a subnet with VPC BPA turned on to the subnet group when there's at
 * least one public cluster within the group
 *
 * For more information about VPC BPA, see Block public access to VPCs and
 * subnets in the *Amazon VPC User Guide*.
 *
 * For more information about working with snapshots, go to
 * Amazon Redshift Snapshots
 * in the *Amazon Redshift Cluster Management Guide*.
 */
export const restoreFromClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestoreFromClusterSnapshotMessage,
    output: RestoreFromClusterSnapshotResult,
    errors: [
      AccessToSnapshotDeniedFault,
      ClusterAlreadyExistsFault,
      ClusterParameterGroupNotFoundFault,
      ClusterQuotaExceededFault,
      ClusterSecurityGroupNotFoundFault,
      ClusterSnapshotNotFoundFault,
      ClusterSubnetGroupNotFoundFault,
      DependentServiceAccessDeniedFault,
      DependentServiceRequestThrottlingFault,
      DependentServiceUnavailableFault,
      HsmClientCertificateNotFoundFault,
      HsmConfigurationNotFoundFault,
      InsufficientClusterCapacityFault,
      InvalidClusterSnapshotStateFault,
      InvalidClusterSubnetGroupStateFault,
      InvalidClusterTrackFault,
      InvalidElasticIpFault,
      InvalidReservedNodeStateFault,
      InvalidRestoreFault,
      InvalidSubnet,
      InvalidTagFault,
      InvalidVPCNetworkStateFault,
      Ipv6CidrBlockNotFoundFault,
      LimitExceededFault,
      NumberOfNodesPerClusterLimitExceededFault,
      NumberOfNodesQuotaExceededFault,
      RedshiftIdcApplicationNotExistsFault,
      ReservedNodeAlreadyExistsFault,
      ReservedNodeAlreadyMigratedFault,
      ReservedNodeNotFoundFault,
      ReservedNodeOfferingNotFoundFault,
      SnapshotScheduleNotFoundFault,
      TagLimitExceededFault,
      UnauthorizedOperation,
      UnsupportedOperationFault,
    ],
  }),
);
/**
 * Creates a new Amazon Redshift subnet group. You must provide a list of one or more
 * subnets in your existing Amazon Virtual Private Cloud (Amazon VPC) when creating
 * Amazon Redshift subnet group.
 *
 * For information about subnet groups, go to
 * Amazon Redshift Cluster Subnet Groups in the
 * *Amazon Redshift Cluster Management Guide*.
 */
export const createClusterSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateClusterSubnetGroupMessage,
    output: CreateClusterSubnetGroupResult,
    errors: [
      ClusterSubnetGroupAlreadyExistsFault,
      ClusterSubnetGroupQuotaExceededFault,
      ClusterSubnetQuotaExceededFault,
      DependentServiceRequestThrottlingFault,
      InvalidSubnet,
      InvalidTagFault,
      TagLimitExceededFault,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Creates a zero-ETL integration or S3 event integration with Amazon Redshift.
 */
export const createIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIntegrationMessage,
  output: Integration,
  errors: [
    IntegrationAlreadyExistsFault,
    IntegrationConflictOperationFault,
    IntegrationQuotaExceededFault,
    IntegrationSourceNotFoundFault,
    IntegrationTargetNotFoundFault,
    InvalidClusterStateFault,
    InvalidTagFault,
    TagLimitExceededFault,
    UnsupportedOperationFault,
  ],
}));
/**
 * Create a snapshot schedule that can be associated to a cluster and which overrides the default system backup schedule.
 */
export const createSnapshotSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSnapshotScheduleMessage,
    output: SnapshotSchedule,
    errors: [
      InvalidScheduleFault,
      InvalidTagFault,
      ScheduleDefinitionTypeUnsupportedFault,
      SnapshotScheduleAlreadyExistsFault,
      SnapshotScheduleQuotaExceededFault,
      TagLimitExceededFault,
    ],
  }),
);
/**
 * Enables the automatic copy of snapshots from one region to another region for a
 * specified cluster.
 */
export const enableSnapshotCopy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableSnapshotCopyMessage,
  output: EnableSnapshotCopyResult,
  errors: [
    ClusterNotFoundFault,
    CopyToRegionDisabledFault,
    DependentServiceRequestThrottlingFault,
    IncompatibleOrderableOptions,
    InvalidClusterStateFault,
    InvalidRetentionPeriodFault,
    LimitExceededFault,
    SnapshotCopyAlreadyEnabledFault,
    SnapshotCopyGrantNotFoundFault,
    UnauthorizedOperation,
    UnknownSnapshotCopyRegionFault,
  ],
}));
/**
 * Modifies the settings for a cluster.
 *
 * You can also change node type and the number of nodes to scale up or down the
 * cluster. When resizing a cluster, you must specify both the number of nodes and the node
 * type even if one of the parameters does not change.
 *
 * You can add another security or
 * parameter group, or change the admin user password. Resetting a cluster password or modifying the security groups associated with a cluster do not need a reboot. However, modifying a parameter group requires a reboot for parameters to take effect.
 * For more information about managing clusters, go to
 * Amazon Redshift Clusters
 * in the *Amazon Redshift Cluster Management Guide*.
 *
 * VPC Block Public Access (BPA) enables you to block resources in VPCs and subnets that
 * you own in a Region from reaching or being reached from the internet through internet
 * gateways and egress-only internet gateways. If a subnet group for a
 * provisioned cluster is in an account with VPC BPA turned on, the following capabilities
 * are blocked:
 *
 * - Creating a public cluster
 *
 * - Restoring a public cluster
 *
 * - Modifying a private cluster to be public
 *
 * - Adding a subnet with VPC BPA turned on to the subnet group when there's at
 * least one public cluster within the group
 *
 * For more information about VPC BPA, see Block public access to VPCs and
 * subnets in the *Amazon VPC User Guide*.
 */
export const modifyCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyClusterMessage,
  output: ModifyClusterResult,
  errors: [
    ClusterAlreadyExistsFault,
    ClusterNotFoundFault,
    ClusterParameterGroupNotFoundFault,
    ClusterSecurityGroupNotFoundFault,
    CustomCnameAssociationFault,
    DependentServiceRequestThrottlingFault,
    HsmClientCertificateNotFoundFault,
    HsmConfigurationNotFoundFault,
    InsufficientClusterCapacityFault,
    InvalidClusterSecurityGroupStateFault,
    InvalidClusterStateFault,
    InvalidClusterTrackFault,
    InvalidElasticIpFault,
    InvalidRetentionPeriodFault,
    Ipv6CidrBlockNotFoundFault,
    LimitExceededFault,
    NumberOfNodesPerClusterLimitExceededFault,
    NumberOfNodesQuotaExceededFault,
    TableLimitExceededFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
    UnsupportedOptionFault,
  ],
}));
/**
 * Changes the size of the cluster. You can change the cluster's type, or change the
 * number or type of nodes. The default behavior is to use the elastic resize method. With
 * an elastic resize, your cluster is available for read and write operations more quickly
 * than with the classic resize method.
 *
 * Elastic resize operations have the following restrictions:
 *
 * - You can only resize clusters of the following types:
 *
 * - dc2.large
 *
 * - dc2.8xlarge
 *
 * - ra3.large
 *
 * - ra3.xlplus
 *
 * - ra3.4xlarge
 *
 * - ra3.16xlarge
 *
 * - The type of nodes that you add must match the node type for the
 * cluster.
 */
export const resizeCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResizeClusterMessage,
  output: ResizeClusterResult,
  errors: [
    ClusterNotFoundFault,
    DependentServiceUnavailableFault,
    InsufficientClusterCapacityFault,
    InvalidClusterStateFault,
    InvalidReservedNodeStateFault,
    LimitExceededFault,
    NumberOfNodesPerClusterLimitExceededFault,
    NumberOfNodesQuotaExceededFault,
    ReservedNodeAlreadyExistsFault,
    ReservedNodeAlreadyMigratedFault,
    ReservedNodeNotFoundFault,
    ReservedNodeOfferingNotFoundFault,
    UnauthorizedOperation,
    UnsupportedOperationFault,
    UnsupportedOptionFault,
  ],
}));
/**
 * Creates an Amazon Redshift event notification subscription. This action requires an ARN
 * (Amazon Resource Name) of an Amazon SNS topic created by either the Amazon Redshift console,
 * the Amazon SNS console, or the Amazon SNS API. To obtain an ARN with Amazon SNS, you
 * must create a topic in Amazon SNS and subscribe to the topic. The ARN is displayed in
 * the SNS console.
 *
 * You can specify the source type, and lists of Amazon Redshift source IDs, event
 * categories, and event severities. Notifications will be sent for all events you want
 * that match those criteria. For example, you can specify source type = cluster, source ID
 * = my-cluster-1 and mycluster2, event categories = Availability, Backup, and severity =
 * ERROR. The subscription will only send notifications for those ERROR events in the
 * Availability and Backup categories for the specified clusters.
 *
 * If you specify both the source type and source IDs, such as source type = cluster
 * and source identifier = my-cluster-1, notifications will be sent for all the cluster
 * events for my-cluster-1. If you specify a source type but do not specify a source
 * identifier, you will receive notice of the events for the objects of that type in your
 * Amazon Web Services account. If you do not specify either the SourceType nor the SourceIdentifier, you
 * will be notified of events generated from all Amazon Redshift sources belonging to your Amazon Web Services account. You must specify a source type if you specify a source ID.
 */
export const createEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEventSubscriptionMessage,
    output: CreateEventSubscriptionResult,
    errors: [
      EventSubscriptionQuotaExceededFault,
      InvalidTagFault,
      SNSInvalidTopicFault,
      SNSNoAuthorizationFault,
      SNSTopicArnNotFoundFault,
      SourceNotFoundFault,
      SubscriptionAlreadyExistFault,
      SubscriptionCategoryNotFoundFault,
      SubscriptionEventIdNotFoundFault,
      SubscriptionSeverityNotFoundFault,
      TagLimitExceededFault,
    ],
  }),
);
/**
 * Creates an Amazon Redshift application for use with IAM Identity Center.
 */
export const createRedshiftIdcApplication =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateRedshiftIdcApplicationMessage,
    output: CreateRedshiftIdcApplicationResult,
    errors: [
      DependentServiceAccessDeniedFault,
      DependentServiceUnavailableFault,
      InvalidTagFault,
      RedshiftIdcApplicationAlreadyExistsFault,
      RedshiftIdcApplicationQuotaExceededFault,
      TagLimitExceededFault,
      UnsupportedOperationFault,
    ],
  }));
/**
 * Modifies an existing Amazon Redshift event notification subscription.
 */
export const modifyEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyEventSubscriptionMessage,
    output: ModifyEventSubscriptionResult,
    errors: [
      InvalidSubscriptionStateFault,
      SNSInvalidTopicFault,
      SNSNoAuthorizationFault,
      SNSTopicArnNotFoundFault,
      SourceNotFoundFault,
      SubscriptionCategoryNotFoundFault,
      SubscriptionEventIdNotFoundFault,
      SubscriptionNotFoundFault,
      SubscriptionSeverityNotFoundFault,
    ],
  }),
);
/**
 * Creates a Redshift-managed VPC endpoint.
 */
export const createEndpointAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEndpointAccessMessage,
    output: EndpointAccess,
    errors: [
      AccessToClusterDeniedFault,
      ClusterNotFoundFault,
      ClusterSubnetGroupNotFoundFault,
      EndpointAlreadyExistsFault,
      EndpointsPerAuthorizationLimitExceededFault,
      EndpointsPerClusterLimitExceededFault,
      InvalidClusterSecurityGroupStateFault,
      InvalidClusterStateFault,
      UnauthorizedOperation,
      UnsupportedOperationFault,
    ],
  }),
);

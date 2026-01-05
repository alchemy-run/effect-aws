import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://rds.amazonaws.com/doc/2014-10-31/");
const svc = T.AwsApiService({
  sdkId: "Neptune",
  serviceShapeName: "AmazonRDSv19",
});
const auth = T.AwsAuthSigv4({ name: "rds" });
const ver = T.ServiceVersion("2014-10-31");
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
                        url: "https://rds-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://rds.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://rds-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://rds.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://rds.{Region}.{PartitionResult#dnsSuffix}",
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
export const AvailabilityZones = S.Array(
  S.String.pipe(T.XmlName("AvailabilityZone")),
);
export const VpcSecurityGroupIdList = S.Array(
  S.String.pipe(T.XmlName("VpcSecurityGroupId")),
);
export const LogTypeList = S.Array(S.String);
export const StringList = S.Array(S.String);
export const DBSecurityGroupNameList = S.Array(
  S.String.pipe(T.XmlName("DBSecurityGroupName")),
);
export const SubnetIdentifierList = S.Array(
  S.String.pipe(T.XmlName("SubnetIdentifier")),
);
export const EventCategoriesList = S.Array(
  S.String.pipe(T.XmlName("EventCategory")),
);
export const SourceIdsList = S.Array(S.String.pipe(T.XmlName("SourceId")));
export const AttributeValueList = S.Array(
  S.String.pipe(T.XmlName("AttributeValue")),
);
export const KeyList = S.Array(S.String);
export class AddRoleToDBClusterMessage extends S.Class<AddRoleToDBClusterMessage>(
  "AddRoleToDBClusterMessage",
)(
  {
    DBClusterIdentifier: S.String,
    RoleArn: S.String,
    FeatureName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddRoleToDBClusterResponse extends S.Class<AddRoleToDBClusterResponse>(
  "AddRoleToDBClusterResponse",
)({}, ns) {}
export class AddSourceIdentifierToSubscriptionMessage extends S.Class<AddSourceIdentifierToSubscriptionMessage>(
  "AddSourceIdentifierToSubscriptionMessage",
)(
  { SubscriptionName: S.String, SourceIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ApplyPendingMaintenanceActionMessage extends S.Class<ApplyPendingMaintenanceActionMessage>(
  "ApplyPendingMaintenanceActionMessage",
)(
  { ResourceIdentifier: S.String, ApplyAction: S.String, OptInType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag.pipe(T.XmlName("Tag")));
export class CopyDBClusterParameterGroupMessage extends S.Class<CopyDBClusterParameterGroupMessage>(
  "CopyDBClusterParameterGroupMessage",
)(
  {
    SourceDBClusterParameterGroupIdentifier: S.String,
    TargetDBClusterParameterGroupIdentifier: S.String,
    TargetDBClusterParameterGroupDescription: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CopyDBClusterSnapshotMessage extends S.Class<CopyDBClusterSnapshotMessage>(
  "CopyDBClusterSnapshotMessage",
)(
  {
    SourceDBClusterSnapshotIdentifier: S.String,
    TargetDBClusterSnapshotIdentifier: S.String,
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(S.String),
    CopyTags: S.optional(S.Boolean),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CopyDBParameterGroupMessage extends S.Class<CopyDBParameterGroupMessage>(
  "CopyDBParameterGroupMessage",
)(
  {
    SourceDBParameterGroupIdentifier: S.String,
    TargetDBParameterGroupIdentifier: S.String,
    TargetDBParameterGroupDescription: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBClusterEndpointMessage extends S.Class<CreateDBClusterEndpointMessage>(
  "CreateDBClusterEndpointMessage",
)(
  {
    DBClusterIdentifier: S.String,
    DBClusterEndpointIdentifier: S.String,
    EndpointType: S.String,
    StaticMembers: S.optional(StringList),
    ExcludedMembers: S.optional(StringList),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBClusterParameterGroupMessage extends S.Class<CreateDBClusterParameterGroupMessage>(
  "CreateDBClusterParameterGroupMessage",
)(
  {
    DBClusterParameterGroupName: S.String,
    DBParameterGroupFamily: S.String,
    Description: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBClusterSnapshotMessage extends S.Class<CreateDBClusterSnapshotMessage>(
  "CreateDBClusterSnapshotMessage",
)(
  {
    DBClusterSnapshotIdentifier: S.String,
    DBClusterIdentifier: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBInstanceMessage extends S.Class<CreateDBInstanceMessage>(
  "CreateDBInstanceMessage",
)(
  {
    DBName: S.optional(S.String),
    DBInstanceIdentifier: S.String,
    AllocatedStorage: S.optional(S.Number),
    DBInstanceClass: S.String,
    Engine: S.String,
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(S.String),
    DBSecurityGroups: S.optional(DBSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    AvailabilityZone: S.optional(S.String),
    DBSubnetGroupName: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    DBParameterGroupName: S.optional(S.String),
    BackupRetentionPeriod: S.optional(S.Number),
    PreferredBackupWindow: S.optional(S.String),
    Port: S.optional(S.Number),
    MultiAZ: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    LicenseModel: S.optional(S.String),
    Iops: S.optional(S.Number),
    OptionGroupName: S.optional(S.String),
    CharacterSetName: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    DBClusterIdentifier: S.String,
    StorageType: S.optional(S.String),
    TdeCredentialArn: S.optional(S.String),
    TdeCredentialPassword: S.optional(S.String),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    Domain: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    MonitoringInterval: S.optional(S.Number),
    MonitoringRoleArn: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    PromotionTier: S.optional(S.Number),
    Timezone: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBParameterGroupMessage extends S.Class<CreateDBParameterGroupMessage>(
  "CreateDBParameterGroupMessage",
)(
  {
    DBParameterGroupName: S.String,
    DBParameterGroupFamily: S.String,
    Description: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBSubnetGroupMessage extends S.Class<CreateDBSubnetGroupMessage>(
  "CreateDBSubnetGroupMessage",
)(
  {
    DBSubnetGroupName: S.String,
    DBSubnetGroupDescription: S.String,
    SubnetIds: SubnetIdentifierList,
    Tags: S.optional(TagList),
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
    EventCategories: S.optional(EventCategoriesList),
    SourceIds: S.optional(SourceIdsList),
    Enabled: S.optional(S.Boolean),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGlobalClusterMessage extends S.Class<CreateGlobalClusterMessage>(
  "CreateGlobalClusterMessage",
)(
  {
    GlobalClusterIdentifier: S.String,
    SourceDBClusterIdentifier: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    StorageEncrypted: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBClusterMessage extends S.Class<DeleteDBClusterMessage>(
  "DeleteDBClusterMessage",
)(
  {
    DBClusterIdentifier: S.String,
    SkipFinalSnapshot: S.optional(S.Boolean),
    FinalDBSnapshotIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBClusterEndpointMessage extends S.Class<DeleteDBClusterEndpointMessage>(
  "DeleteDBClusterEndpointMessage",
)(
  { DBClusterEndpointIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBClusterParameterGroupMessage extends S.Class<DeleteDBClusterParameterGroupMessage>(
  "DeleteDBClusterParameterGroupMessage",
)(
  { DBClusterParameterGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBClusterParameterGroupResponse extends S.Class<DeleteDBClusterParameterGroupResponse>(
  "DeleteDBClusterParameterGroupResponse",
)({}, ns) {}
export class DeleteDBClusterSnapshotMessage extends S.Class<DeleteDBClusterSnapshotMessage>(
  "DeleteDBClusterSnapshotMessage",
)(
  { DBClusterSnapshotIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBInstanceMessage extends S.Class<DeleteDBInstanceMessage>(
  "DeleteDBInstanceMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    SkipFinalSnapshot: S.optional(S.Boolean),
    FinalDBSnapshotIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBParameterGroupMessage extends S.Class<DeleteDBParameterGroupMessage>(
  "DeleteDBParameterGroupMessage",
)(
  { DBParameterGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBParameterGroupResponse extends S.Class<DeleteDBParameterGroupResponse>(
  "DeleteDBParameterGroupResponse",
)({}, ns) {}
export class DeleteDBSubnetGroupMessage extends S.Class<DeleteDBSubnetGroupMessage>(
  "DeleteDBSubnetGroupMessage",
)(
  { DBSubnetGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDBSubnetGroupResponse extends S.Class<DeleteDBSubnetGroupResponse>(
  "DeleteDBSubnetGroupResponse",
)({}, ns) {}
export class DeleteEventSubscriptionMessage extends S.Class<DeleteEventSubscriptionMessage>(
  "DeleteEventSubscriptionMessage",
)(
  { SubscriptionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGlobalClusterMessage extends S.Class<DeleteGlobalClusterMessage>(
  "DeleteGlobalClusterMessage",
)(
  { GlobalClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FilterValueList = S.Array(S.String.pipe(T.XmlName("Value")));
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.String,
  Values: FilterValueList,
}) {}
export const FilterList = S.Array(Filter.pipe(T.XmlName("Filter")));
export class DescribeDBClusterParameterGroupsMessage extends S.Class<DescribeDBClusterParameterGroupsMessage>(
  "DescribeDBClusterParameterGroupsMessage",
)(
  {
    DBClusterParameterGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClusterParametersMessage extends S.Class<DescribeDBClusterParametersMessage>(
  "DescribeDBClusterParametersMessage",
)(
  {
    DBClusterParameterGroupName: S.String,
    Source: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClustersMessage extends S.Class<DescribeDBClustersMessage>(
  "DescribeDBClustersMessage",
)(
  {
    DBClusterIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClusterSnapshotAttributesMessage extends S.Class<DescribeDBClusterSnapshotAttributesMessage>(
  "DescribeDBClusterSnapshotAttributesMessage",
)(
  { DBClusterSnapshotIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBClusterSnapshotsMessage extends S.Class<DescribeDBClusterSnapshotsMessage>(
  "DescribeDBClusterSnapshotsMessage",
)(
  {
    DBClusterIdentifier: S.optional(S.String),
    DBClusterSnapshotIdentifier: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    IncludeShared: S.optional(S.Boolean),
    IncludePublic: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBEngineVersionsMessage extends S.Class<DescribeDBEngineVersionsMessage>(
  "DescribeDBEngineVersionsMessage",
)(
  {
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    DBParameterGroupFamily: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    DefaultOnly: S.optional(S.Boolean),
    ListSupportedCharacterSets: S.optional(S.Boolean),
    ListSupportedTimezones: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBInstancesMessage extends S.Class<DescribeDBInstancesMessage>(
  "DescribeDBInstancesMessage",
)(
  {
    DBInstanceIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBParameterGroupsMessage extends S.Class<DescribeDBParameterGroupsMessage>(
  "DescribeDBParameterGroupsMessage",
)(
  {
    DBParameterGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBParametersMessage extends S.Class<DescribeDBParametersMessage>(
  "DescribeDBParametersMessage",
)(
  {
    DBParameterGroupName: S.String,
    Source: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDBSubnetGroupsMessage extends S.Class<DescribeDBSubnetGroupsMessage>(
  "DescribeDBSubnetGroupsMessage",
)(
  {
    DBSubnetGroupName: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEngineDefaultClusterParametersMessage extends S.Class<DescribeEngineDefaultClusterParametersMessage>(
  "DescribeEngineDefaultClusterParametersMessage",
)(
  {
    DBParameterGroupFamily: S.String,
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEngineDefaultParametersMessage extends S.Class<DescribeEngineDefaultParametersMessage>(
  "DescribeEngineDefaultParametersMessage",
)(
  {
    DBParameterGroupFamily: S.String,
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventCategoriesMessage extends S.Class<DescribeEventCategoriesMessage>(
  "DescribeEventCategoriesMessage",
)(
  { SourceType: S.optional(S.String), Filters: S.optional(FilterList) },
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
    EventCategories: S.optional(EventCategoriesList),
    Filters: S.optional(FilterList),
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
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGlobalClustersMessage extends S.Class<DescribeGlobalClustersMessage>(
  "DescribeGlobalClustersMessage",
)(
  {
    GlobalClusterIdentifier: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOrderableDBInstanceOptionsMessage extends S.Class<DescribeOrderableDBInstanceOptionsMessage>(
  "DescribeOrderableDBInstanceOptionsMessage",
)(
  {
    Engine: S.String,
    EngineVersion: S.optional(S.String),
    DBInstanceClass: S.optional(S.String),
    LicenseModel: S.optional(S.String),
    Vpc: S.optional(S.Boolean),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePendingMaintenanceActionsMessage extends S.Class<DescribePendingMaintenanceActionsMessage>(
  "DescribePendingMaintenanceActionsMessage",
)(
  {
    ResourceIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeValidDBInstanceModificationsMessage extends S.Class<DescribeValidDBInstanceModificationsMessage>(
  "DescribeValidDBInstanceModificationsMessage",
)(
  { DBInstanceIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FailoverDBClusterMessage extends S.Class<FailoverDBClusterMessage>(
  "FailoverDBClusterMessage",
)(
  {
    DBClusterIdentifier: S.optional(S.String),
    TargetDBInstanceIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FailoverGlobalClusterMessage extends S.Class<FailoverGlobalClusterMessage>(
  "FailoverGlobalClusterMessage",
)(
  {
    GlobalClusterIdentifier: S.String,
    TargetDbClusterIdentifier: S.String,
    AllowDataLoss: S.optional(S.Boolean),
    Switchover: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceMessage extends S.Class<ListTagsForResourceMessage>(
  "ListTagsForResourceMessage",
)(
  { ResourceName: S.String, Filters: S.optional(FilterList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBClusterEndpointMessage extends S.Class<ModifyDBClusterEndpointMessage>(
  "ModifyDBClusterEndpointMessage",
)(
  {
    DBClusterEndpointIdentifier: S.String,
    EndpointType: S.optional(S.String),
    StaticMembers: S.optional(StringList),
    ExcludedMembers: S.optional(StringList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBClusterSnapshotAttributeMessage extends S.Class<ModifyDBClusterSnapshotAttributeMessage>(
  "ModifyDBClusterSnapshotAttributeMessage",
)(
  {
    DBClusterSnapshotIdentifier: S.String,
    AttributeName: S.String,
    ValuesToAdd: S.optional(AttributeValueList),
    ValuesToRemove: S.optional(AttributeValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CloudwatchLogsExportConfiguration extends S.Class<CloudwatchLogsExportConfiguration>(
  "CloudwatchLogsExportConfiguration",
)({
  EnableLogTypes: S.optional(LogTypeList),
  DisableLogTypes: S.optional(LogTypeList),
}) {}
export class ModifyDBInstanceMessage extends S.Class<ModifyDBInstanceMessage>(
  "ModifyDBInstanceMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    AllocatedStorage: S.optional(S.Number),
    DBInstanceClass: S.optional(S.String),
    DBSubnetGroupName: S.optional(S.String),
    DBSecurityGroups: S.optional(DBSecurityGroupNameList),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    ApplyImmediately: S.optional(S.Boolean),
    MasterUserPassword: S.optional(S.String),
    DBParameterGroupName: S.optional(S.String),
    BackupRetentionPeriod: S.optional(S.Number),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    AllowMajorVersionUpgrade: S.optional(S.Boolean),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    LicenseModel: S.optional(S.String),
    Iops: S.optional(S.Number),
    OptionGroupName: S.optional(S.String),
    NewDBInstanceIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
    TdeCredentialArn: S.optional(S.String),
    TdeCredentialPassword: S.optional(S.String),
    CACertificateIdentifier: S.optional(S.String),
    Domain: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    MonitoringInterval: S.optional(S.Number),
    DBPortNumber: S.optional(S.Number),
    PubliclyAccessible: S.optional(S.Boolean),
    MonitoringRoleArn: S.optional(S.String),
    DomainIAMRoleName: S.optional(S.String),
    PromotionTier: S.optional(S.Number),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    CloudwatchLogsExportConfiguration: S.optional(
      CloudwatchLogsExportConfiguration,
    ),
    DeletionProtection: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Parameter extends S.Class<Parameter>("Parameter")({
  ParameterName: S.optional(S.String),
  ParameterValue: S.optional(S.String),
  Description: S.optional(S.String),
  Source: S.optional(S.String),
  ApplyType: S.optional(S.String),
  DataType: S.optional(S.String),
  AllowedValues: S.optional(S.String),
  IsModifiable: S.optional(S.Boolean),
  MinimumEngineVersion: S.optional(S.String),
  ApplyMethod: S.optional(S.String),
}) {}
export const ParametersList = S.Array(Parameter.pipe(T.XmlName("Parameter")));
export class ModifyDBParameterGroupMessage extends S.Class<ModifyDBParameterGroupMessage>(
  "ModifyDBParameterGroupMessage",
)(
  { DBParameterGroupName: S.String, Parameters: ParametersList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBSubnetGroupMessage extends S.Class<ModifyDBSubnetGroupMessage>(
  "ModifyDBSubnetGroupMessage",
)(
  {
    DBSubnetGroupName: S.String,
    DBSubnetGroupDescription: S.optional(S.String),
    SubnetIds: SubnetIdentifierList,
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
    EventCategories: S.optional(EventCategoriesList),
    Enabled: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyGlobalClusterMessage extends S.Class<ModifyGlobalClusterMessage>(
  "ModifyGlobalClusterMessage",
)(
  {
    GlobalClusterIdentifier: S.String,
    NewGlobalClusterIdentifier: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    AllowMajorVersionUpgrade: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PromoteReadReplicaDBClusterMessage extends S.Class<PromoteReadReplicaDBClusterMessage>(
  "PromoteReadReplicaDBClusterMessage",
)(
  { DBClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootDBInstanceMessage extends S.Class<RebootDBInstanceMessage>(
  "RebootDBInstanceMessage",
)(
  { DBInstanceIdentifier: S.String, ForceFailover: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveFromGlobalClusterMessage extends S.Class<RemoveFromGlobalClusterMessage>(
  "RemoveFromGlobalClusterMessage",
)(
  { GlobalClusterIdentifier: S.String, DbClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveRoleFromDBClusterMessage extends S.Class<RemoveRoleFromDBClusterMessage>(
  "RemoveRoleFromDBClusterMessage",
)(
  {
    DBClusterIdentifier: S.String,
    RoleArn: S.String,
    FeatureName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveRoleFromDBClusterResponse extends S.Class<RemoveRoleFromDBClusterResponse>(
  "RemoveRoleFromDBClusterResponse",
)({}, ns) {}
export class RemoveSourceIdentifierFromSubscriptionMessage extends S.Class<RemoveSourceIdentifierFromSubscriptionMessage>(
  "RemoveSourceIdentifierFromSubscriptionMessage",
)(
  { SubscriptionName: S.String, SourceIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsFromResourceMessage extends S.Class<RemoveTagsFromResourceMessage>(
  "RemoveTagsFromResourceMessage",
)(
  { ResourceName: S.String, TagKeys: KeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsFromResourceResponse extends S.Class<RemoveTagsFromResourceResponse>(
  "RemoveTagsFromResourceResponse",
)({}, ns) {}
export class ResetDBClusterParameterGroupMessage extends S.Class<ResetDBClusterParameterGroupMessage>(
  "ResetDBClusterParameterGroupMessage",
)(
  {
    DBClusterParameterGroupName: S.String,
    ResetAllParameters: S.optional(S.Boolean),
    Parameters: S.optional(ParametersList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResetDBParameterGroupMessage extends S.Class<ResetDBParameterGroupMessage>(
  "ResetDBParameterGroupMessage",
)(
  {
    DBParameterGroupName: S.String,
    ResetAllParameters: S.optional(S.Boolean),
    Parameters: S.optional(ParametersList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ServerlessV2ScalingConfiguration extends S.Class<ServerlessV2ScalingConfiguration>(
  "ServerlessV2ScalingConfiguration",
)({ MinCapacity: S.optional(S.Number), MaxCapacity: S.optional(S.Number) }) {}
export class RestoreDBClusterFromSnapshotMessage extends S.Class<RestoreDBClusterFromSnapshotMessage>(
  "RestoreDBClusterFromSnapshotMessage",
)(
  {
    AvailabilityZones: S.optional(AvailabilityZones),
    DBClusterIdentifier: S.String,
    SnapshotIdentifier: S.String,
    Engine: S.String,
    EngineVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    DBSubnetGroupName: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DBClusterParameterGroupName: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    StorageType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreDBClusterToPointInTimeMessage extends S.Class<RestoreDBClusterToPointInTimeMessage>(
  "RestoreDBClusterToPointInTimeMessage",
)(
  {
    DBClusterIdentifier: S.String,
    RestoreType: S.optional(S.String),
    SourceDBClusterIdentifier: S.String,
    RestoreToTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    UseLatestRestorableTime: S.optional(S.Boolean),
    Port: S.optional(S.Number),
    DBSubnetGroupName: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DBClusterParameterGroupName: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    StorageType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDBClusterMessage extends S.Class<StartDBClusterMessage>(
  "StartDBClusterMessage",
)(
  { DBClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopDBClusterMessage extends S.Class<StopDBClusterMessage>(
  "StopDBClusterMessage",
)(
  { DBClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SwitchoverGlobalClusterMessage extends S.Class<SwitchoverGlobalClusterMessage>(
  "SwitchoverGlobalClusterMessage",
)(
  { GlobalClusterIdentifier: S.String, TargetDbClusterIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DBClusterParameterGroup extends S.Class<DBClusterParameterGroup>(
  "DBClusterParameterGroup",
)({
  DBClusterParameterGroupName: S.optional(S.String),
  DBParameterGroupFamily: S.optional(S.String),
  Description: S.optional(S.String),
  DBClusterParameterGroupArn: S.optional(S.String),
}) {}
export const DBClusterParameterGroupList = S.Array(
  DBClusterParameterGroup.pipe(T.XmlName("DBClusterParameterGroup")),
);
export class DBClusterOptionGroupStatus extends S.Class<DBClusterOptionGroupStatus>(
  "DBClusterOptionGroupStatus",
)({
  DBClusterOptionGroupName: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const DBClusterOptionGroupMemberships = S.Array(
  DBClusterOptionGroupStatus.pipe(T.XmlName("DBClusterOptionGroup")),
);
export const ReadReplicaIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ReadReplicaIdentifier")),
);
export class DBClusterMember extends S.Class<DBClusterMember>(
  "DBClusterMember",
)({
  DBInstanceIdentifier: S.optional(S.String),
  IsClusterWriter: S.optional(S.Boolean),
  DBClusterParameterGroupStatus: S.optional(S.String),
  PromotionTier: S.optional(S.Number),
}) {}
export const DBClusterMemberList = S.Array(
  DBClusterMember.pipe(T.XmlName("DBClusterMember")),
);
export class VpcSecurityGroupMembership extends S.Class<VpcSecurityGroupMembership>(
  "VpcSecurityGroupMembership",
)({ VpcSecurityGroupId: S.optional(S.String), Status: S.optional(S.String) }) {}
export const VpcSecurityGroupMembershipList = S.Array(
  VpcSecurityGroupMembership.pipe(T.XmlName("VpcSecurityGroupMembership")),
);
export class DBClusterRole extends S.Class<DBClusterRole>("DBClusterRole")({
  RoleArn: S.optional(S.String),
  Status: S.optional(S.String),
  FeatureName: S.optional(S.String),
}) {}
export const DBClusterRoles = S.Array(
  DBClusterRole.pipe(T.XmlName("DBClusterRole")),
);
export class PendingCloudwatchLogsExports extends S.Class<PendingCloudwatchLogsExports>(
  "PendingCloudwatchLogsExports",
)({
  LogTypesToEnable: S.optional(LogTypeList),
  LogTypesToDisable: S.optional(LogTypeList),
}) {}
export class ClusterPendingModifiedValues extends S.Class<ClusterPendingModifiedValues>(
  "ClusterPendingModifiedValues",
)({
  PendingCloudwatchLogsExports: S.optional(PendingCloudwatchLogsExports),
  DBClusterIdentifier: S.optional(S.String),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  EngineVersion: S.optional(S.String),
  BackupRetentionPeriod: S.optional(S.Number),
  StorageType: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  Iops: S.optional(S.Number),
}) {}
export class ServerlessV2ScalingConfigurationInfo extends S.Class<ServerlessV2ScalingConfigurationInfo>(
  "ServerlessV2ScalingConfigurationInfo",
)({ MinCapacity: S.optional(S.Number), MaxCapacity: S.optional(S.Number) }) {}
export class DBCluster extends S.Class<DBCluster>("DBCluster")({
  AllocatedStorage: S.optional(S.Number),
  AvailabilityZones: S.optional(AvailabilityZones),
  BackupRetentionPeriod: S.optional(S.Number),
  CharacterSetName: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  DBClusterIdentifier: S.optional(S.String),
  DBClusterParameterGroup: S.optional(S.String),
  DBSubnetGroup: S.optional(S.String),
  Status: S.optional(S.String),
  PercentProgress: S.optional(S.String),
  EarliestRestorableTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  Endpoint: S.optional(S.String),
  ReaderEndpoint: S.optional(S.String),
  MultiAZ: S.optional(S.Boolean),
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  LatestRestorableTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Port: S.optional(S.Number),
  MasterUsername: S.optional(S.String),
  DBClusterOptionGroupMemberships: S.optional(DBClusterOptionGroupMemberships),
  PreferredBackupWindow: S.optional(S.String),
  PreferredMaintenanceWindow: S.optional(S.String),
  ReplicationSourceIdentifier: S.optional(S.String),
  ReadReplicaIdentifiers: S.optional(ReadReplicaIdentifierList),
  DBClusterMembers: S.optional(DBClusterMemberList),
  VpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
  HostedZoneId: S.optional(S.String),
  StorageEncrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  DbClusterResourceId: S.optional(S.String),
  DBClusterArn: S.optional(S.String),
  AssociatedRoles: S.optional(DBClusterRoles),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  CloneGroupId: S.optional(S.String),
  ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CopyTagsToSnapshot: S.optional(S.Boolean),
  EnabledCloudwatchLogsExports: S.optional(LogTypeList),
  PendingModifiedValues: S.optional(ClusterPendingModifiedValues),
  DeletionProtection: S.optional(S.Boolean),
  CrossAccountClone: S.optional(S.Boolean),
  AutomaticRestartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ServerlessV2ScalingConfiguration: S.optional(
    ServerlessV2ScalingConfigurationInfo,
  ),
  GlobalClusterIdentifier: S.optional(S.String),
  IOOptimizedNextAllowedModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  StorageType: S.optional(S.String),
}) {}
export const DBClusterList = S.Array(DBCluster.pipe(T.XmlName("DBCluster")));
export class DBClusterSnapshot extends S.Class<DBClusterSnapshot>(
  "DBClusterSnapshot",
)({
  AvailabilityZones: S.optional(AvailabilityZones),
  DBClusterSnapshotIdentifier: S.optional(S.String),
  DBClusterIdentifier: S.optional(S.String),
  SnapshotCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Engine: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  Status: S.optional(S.String),
  Port: S.optional(S.Number),
  VpcId: S.optional(S.String),
  ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  MasterUsername: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  SnapshotType: S.optional(S.String),
  PercentProgress: S.optional(S.Number),
  StorageEncrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  DBClusterSnapshotArn: S.optional(S.String),
  SourceDBClusterSnapshotArn: S.optional(S.String),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  StorageType: S.optional(S.String),
}) {}
export const DBClusterSnapshotList = S.Array(
  DBClusterSnapshot.pipe(T.XmlName("DBClusterSnapshot")),
);
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  Address: S.optional(S.String),
  Port: S.optional(S.Number),
  HostedZoneId: S.optional(S.String),
}) {}
export class DBSecurityGroupMembership extends S.Class<DBSecurityGroupMembership>(
  "DBSecurityGroupMembership",
)({
  DBSecurityGroupName: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const DBSecurityGroupMembershipList = S.Array(
  DBSecurityGroupMembership.pipe(T.XmlName("DBSecurityGroup")),
);
export class DBParameterGroupStatus extends S.Class<DBParameterGroupStatus>(
  "DBParameterGroupStatus",
)({
  DBParameterGroupName: S.optional(S.String),
  ParameterApplyStatus: S.optional(S.String),
}) {}
export const DBParameterGroupStatusList = S.Array(
  DBParameterGroupStatus.pipe(T.XmlName("DBParameterGroup")),
);
export class AvailabilityZone extends S.Class<AvailabilityZone>(
  "AvailabilityZone",
)({ Name: S.optional(S.String) }) {}
export class Subnet extends S.Class<Subnet>("Subnet")({
  SubnetIdentifier: S.optional(S.String),
  SubnetAvailabilityZone: S.optional(AvailabilityZone),
  SubnetStatus: S.optional(S.String),
}) {}
export const SubnetList = S.Array(Subnet.pipe(T.XmlName("Subnet")));
export class DBSubnetGroup extends S.Class<DBSubnetGroup>("DBSubnetGroup")({
  DBSubnetGroupName: S.optional(S.String),
  DBSubnetGroupDescription: S.optional(S.String),
  VpcId: S.optional(S.String),
  SubnetGroupStatus: S.optional(S.String),
  Subnets: S.optional(SubnetList),
  DBSubnetGroupArn: S.optional(S.String),
}) {}
export class PendingModifiedValues extends S.Class<PendingModifiedValues>(
  "PendingModifiedValues",
)({
  DBInstanceClass: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  MasterUserPassword: S.optional(S.String),
  Port: S.optional(S.Number),
  BackupRetentionPeriod: S.optional(S.Number),
  MultiAZ: S.optional(S.Boolean),
  EngineVersion: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  Iops: S.optional(S.Number),
  DBInstanceIdentifier: S.optional(S.String),
  StorageType: S.optional(S.String),
  CACertificateIdentifier: S.optional(S.String),
  DBSubnetGroupName: S.optional(S.String),
  PendingCloudwatchLogsExports: S.optional(PendingCloudwatchLogsExports),
}) {}
export const ReadReplicaDBInstanceIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ReadReplicaDBInstanceIdentifier")),
);
export const ReadReplicaDBClusterIdentifierList = S.Array(
  S.String.pipe(T.XmlName("ReadReplicaDBClusterIdentifier")),
);
export class OptionGroupMembership extends S.Class<OptionGroupMembership>(
  "OptionGroupMembership",
)({ OptionGroupName: S.optional(S.String), Status: S.optional(S.String) }) {}
export const OptionGroupMembershipList = S.Array(
  OptionGroupMembership.pipe(T.XmlName("OptionGroupMembership")),
);
export class DBInstanceStatusInfo extends S.Class<DBInstanceStatusInfo>(
  "DBInstanceStatusInfo",
)({
  StatusType: S.optional(S.String),
  Normal: S.optional(S.Boolean),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const DBInstanceStatusInfoList = S.Array(
  DBInstanceStatusInfo.pipe(T.XmlName("DBInstanceStatusInfo")),
);
export class DomainMembership extends S.Class<DomainMembership>(
  "DomainMembership",
)({
  Domain: S.optional(S.String),
  Status: S.optional(S.String),
  FQDN: S.optional(S.String),
  IAMRoleName: S.optional(S.String),
}) {}
export const DomainMembershipList = S.Array(
  DomainMembership.pipe(T.XmlName("DomainMembership")),
);
export class DBInstance extends S.Class<DBInstance>("DBInstance")({
  DBInstanceIdentifier: S.optional(S.String),
  DBInstanceClass: S.optional(S.String),
  Engine: S.optional(S.String),
  DBInstanceStatus: S.optional(S.String),
  MasterUsername: S.optional(S.String),
  DBName: S.optional(S.String),
  Endpoint: S.optional(Endpoint),
  AllocatedStorage: S.optional(S.Number),
  InstanceCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PreferredBackupWindow: S.optional(S.String),
  BackupRetentionPeriod: S.optional(S.Number),
  DBSecurityGroups: S.optional(DBSecurityGroupMembershipList),
  VpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
  DBParameterGroups: S.optional(DBParameterGroupStatusList),
  AvailabilityZone: S.optional(S.String),
  DBSubnetGroup: S.optional(DBSubnetGroup),
  PreferredMaintenanceWindow: S.optional(S.String),
  PendingModifiedValues: S.optional(PendingModifiedValues),
  LatestRestorableTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  MultiAZ: S.optional(S.Boolean),
  EngineVersion: S.optional(S.String),
  AutoMinorVersionUpgrade: S.optional(S.Boolean),
  ReadReplicaSourceDBInstanceIdentifier: S.optional(S.String),
  ReadReplicaDBInstanceIdentifiers: S.optional(
    ReadReplicaDBInstanceIdentifierList,
  ),
  ReadReplicaDBClusterIdentifiers: S.optional(
    ReadReplicaDBClusterIdentifierList,
  ),
  LicenseModel: S.optional(S.String),
  Iops: S.optional(S.Number),
  OptionGroupMemberships: S.optional(OptionGroupMembershipList),
  CharacterSetName: S.optional(S.String),
  SecondaryAvailabilityZone: S.optional(S.String),
  PubliclyAccessible: S.optional(S.Boolean),
  StatusInfos: S.optional(DBInstanceStatusInfoList),
  StorageType: S.optional(S.String),
  TdeCredentialArn: S.optional(S.String),
  DbInstancePort: S.optional(S.Number),
  DBClusterIdentifier: S.optional(S.String),
  StorageEncrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  DbiResourceId: S.optional(S.String),
  CACertificateIdentifier: S.optional(S.String),
  DomainMemberships: S.optional(DomainMembershipList),
  CopyTagsToSnapshot: S.optional(S.Boolean),
  MonitoringInterval: S.optional(S.Number),
  EnhancedMonitoringResourceArn: S.optional(S.String),
  MonitoringRoleArn: S.optional(S.String),
  PromotionTier: S.optional(S.Number),
  DBInstanceArn: S.optional(S.String),
  Timezone: S.optional(S.String),
  IAMDatabaseAuthenticationEnabled: S.optional(S.Boolean),
  PerformanceInsightsEnabled: S.optional(S.Boolean),
  PerformanceInsightsKMSKeyId: S.optional(S.String),
  EnabledCloudwatchLogsExports: S.optional(LogTypeList),
  DeletionProtection: S.optional(S.Boolean),
}) {}
export const DBInstanceList = S.Array(DBInstance.pipe(T.XmlName("DBInstance")));
export class DBParameterGroup extends S.Class<DBParameterGroup>(
  "DBParameterGroup",
)({
  DBParameterGroupName: S.optional(S.String),
  DBParameterGroupFamily: S.optional(S.String),
  Description: S.optional(S.String),
  DBParameterGroupArn: S.optional(S.String),
}) {}
export const DBParameterGroupList = S.Array(
  DBParameterGroup.pipe(T.XmlName("DBParameterGroup")),
);
export const DBSubnetGroups = S.Array(
  DBSubnetGroup.pipe(T.XmlName("DBSubnetGroup")),
);
export class EventSubscription extends S.Class<EventSubscription>(
  "EventSubscription",
)({
  CustomerAwsId: S.optional(S.String),
  CustSubscriptionId: S.optional(S.String),
  SnsTopicArn: S.optional(S.String),
  Status: S.optional(S.String),
  SubscriptionCreationTime: S.optional(S.String),
  SourceType: S.optional(S.String),
  SourceIdsList: S.optional(SourceIdsList),
  EventCategoriesList: S.optional(EventCategoriesList),
  Enabled: S.optional(S.Boolean),
  EventSubscriptionArn: S.optional(S.String),
}) {}
export const EventSubscriptionsList = S.Array(
  EventSubscription.pipe(T.XmlName("EventSubscription")),
);
export const ReadersArnList = S.Array(S.String);
export class GlobalClusterMember extends S.Class<GlobalClusterMember>(
  "GlobalClusterMember",
)({
  DBClusterArn: S.optional(S.String),
  Readers: S.optional(ReadersArnList),
  IsWriter: S.optional(S.Boolean),
}) {}
export const GlobalClusterMemberList = S.Array(
  GlobalClusterMember.pipe(T.XmlName("GlobalClusterMember")),
);
export class FailoverState extends S.Class<FailoverState>("FailoverState")({
  Status: S.optional(S.String),
  FromDbClusterArn: S.optional(S.String),
  ToDbClusterArn: S.optional(S.String),
  IsDataLossAllowed: S.optional(S.Boolean),
}) {}
export class GlobalCluster extends S.Class<GlobalCluster>("GlobalCluster")({
  GlobalClusterIdentifier: S.optional(S.String),
  GlobalClusterResourceId: S.optional(S.String),
  GlobalClusterArn: S.optional(S.String),
  Status: S.optional(S.String),
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  StorageEncrypted: S.optional(S.Boolean),
  DeletionProtection: S.optional(S.Boolean),
  GlobalClusterMembers: S.optional(GlobalClusterMemberList),
  FailoverState: S.optional(FailoverState),
}) {}
export const GlobalClusterList = S.Array(
  GlobalCluster.pipe(T.XmlName("GlobalClusterMember")),
);
export class PendingMaintenanceAction extends S.Class<PendingMaintenanceAction>(
  "PendingMaintenanceAction",
)({
  Action: S.optional(S.String),
  AutoAppliedAfterDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ForcedApplyDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  OptInStatus: S.optional(S.String),
  CurrentApplyDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Description: S.optional(S.String),
}) {}
export const PendingMaintenanceActionDetails = S.Array(
  PendingMaintenanceAction.pipe(T.XmlName("PendingMaintenanceAction")),
);
export class ResourcePendingMaintenanceActions extends S.Class<ResourcePendingMaintenanceActions>(
  "ResourcePendingMaintenanceActions",
)({
  ResourceIdentifier: S.optional(S.String),
  PendingMaintenanceActionDetails: S.optional(PendingMaintenanceActionDetails),
}) {}
export const PendingMaintenanceActions = S.Array(
  ResourcePendingMaintenanceActions.pipe(
    T.XmlName("ResourcePendingMaintenanceActions"),
  ),
);
export class AddTagsToResourceMessage extends S.Class<AddTagsToResourceMessage>(
  "AddTagsToResourceMessage",
)(
  { ResourceName: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddTagsToResourceResponse extends S.Class<AddTagsToResourceResponse>(
  "AddTagsToResourceResponse",
)({}, ns) {}
export class CreateDBClusterMessage extends S.Class<CreateDBClusterMessage>(
  "CreateDBClusterMessage",
)(
  {
    AvailabilityZones: S.optional(AvailabilityZones),
    BackupRetentionPeriod: S.optional(S.Number),
    CharacterSetName: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    DatabaseName: S.optional(S.String),
    DBClusterIdentifier: S.String,
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    DBSubnetGroupName: S.optional(S.String),
    Engine: S.String,
    EngineVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    ReplicationSourceIdentifier: S.optional(S.String),
    Tags: S.optional(TagList),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    GlobalClusterIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBClusterEndpointOutput extends S.Class<CreateDBClusterEndpointOutput>(
  "CreateDBClusterEndpointOutput",
)(
  {
    DBClusterEndpointIdentifier: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    DBClusterEndpointResourceIdentifier: S.optional(S.String),
    Endpoint: S.optional(S.String),
    Status: S.optional(S.String),
    EndpointType: S.optional(S.String),
    CustomEndpointType: S.optional(S.String),
    StaticMembers: S.optional(StringList),
    ExcludedMembers: S.optional(StringList),
    DBClusterEndpointArn: S.optional(S.String),
  },
  ns,
) {}
export class CreateDBClusterParameterGroupResult extends S.Class<CreateDBClusterParameterGroupResult>(
  "CreateDBClusterParameterGroupResult",
)({ DBClusterParameterGroup: S.optional(DBClusterParameterGroup) }, ns) {}
export class CreateDBClusterSnapshotResult extends S.Class<CreateDBClusterSnapshotResult>(
  "CreateDBClusterSnapshotResult",
)({ DBClusterSnapshot: S.optional(DBClusterSnapshot) }, ns) {}
export class CreateDBParameterGroupResult extends S.Class<CreateDBParameterGroupResult>(
  "CreateDBParameterGroupResult",
)({ DBParameterGroup: S.optional(DBParameterGroup) }, ns) {}
export class CreateEventSubscriptionResult extends S.Class<CreateEventSubscriptionResult>(
  "CreateEventSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class DeleteDBClusterEndpointOutput extends S.Class<DeleteDBClusterEndpointOutput>(
  "DeleteDBClusterEndpointOutput",
)(
  {
    DBClusterEndpointIdentifier: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    DBClusterEndpointResourceIdentifier: S.optional(S.String),
    Endpoint: S.optional(S.String),
    Status: S.optional(S.String),
    EndpointType: S.optional(S.String),
    CustomEndpointType: S.optional(S.String),
    StaticMembers: S.optional(StringList),
    ExcludedMembers: S.optional(StringList),
    DBClusterEndpointArn: S.optional(S.String),
  },
  ns,
) {}
export class DeleteDBClusterSnapshotResult extends S.Class<DeleteDBClusterSnapshotResult>(
  "DeleteDBClusterSnapshotResult",
)({ DBClusterSnapshot: S.optional(DBClusterSnapshot) }, ns) {}
export class DeleteDBInstanceResult extends S.Class<DeleteDBInstanceResult>(
  "DeleteDBInstanceResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class DeleteEventSubscriptionResult extends S.Class<DeleteEventSubscriptionResult>(
  "DeleteEventSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class DeleteGlobalClusterResult extends S.Class<DeleteGlobalClusterResult>(
  "DeleteGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class DescribeDBClusterEndpointsMessage extends S.Class<DescribeDBClusterEndpointsMessage>(
  "DescribeDBClusterEndpointsMessage",
)(
  {
    DBClusterIdentifier: S.optional(S.String),
    DBClusterEndpointIdentifier: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DBClusterParameterGroupsMessage extends S.Class<DBClusterParameterGroupsMessage>(
  "DBClusterParameterGroupsMessage",
)(
  {
    Marker: S.optional(S.String),
    DBClusterParameterGroups: S.optional(DBClusterParameterGroupList),
  },
  ns,
) {}
export class DBClusterParameterGroupDetails extends S.Class<DBClusterParameterGroupDetails>(
  "DBClusterParameterGroupDetails",
)(
  { Parameters: S.optional(ParametersList), Marker: S.optional(S.String) },
  ns,
) {}
export class DBClusterMessage extends S.Class<DBClusterMessage>(
  "DBClusterMessage",
)(
  { Marker: S.optional(S.String), DBClusters: S.optional(DBClusterList) },
  ns,
) {}
export class DBClusterSnapshotMessage extends S.Class<DBClusterSnapshotMessage>(
  "DBClusterSnapshotMessage",
)(
  {
    Marker: S.optional(S.String),
    DBClusterSnapshots: S.optional(DBClusterSnapshotList),
  },
  ns,
) {}
export class DBInstanceMessage extends S.Class<DBInstanceMessage>(
  "DBInstanceMessage",
)(
  { Marker: S.optional(S.String), DBInstances: S.optional(DBInstanceList) },
  ns,
) {}
export class DBParameterGroupsMessage extends S.Class<DBParameterGroupsMessage>(
  "DBParameterGroupsMessage",
)(
  {
    Marker: S.optional(S.String),
    DBParameterGroups: S.optional(DBParameterGroupList),
  },
  ns,
) {}
export class DBParameterGroupDetails extends S.Class<DBParameterGroupDetails>(
  "DBParameterGroupDetails",
)(
  { Parameters: S.optional(ParametersList), Marker: S.optional(S.String) },
  ns,
) {}
export class DBSubnetGroupMessage extends S.Class<DBSubnetGroupMessage>(
  "DBSubnetGroupMessage",
)(
  { Marker: S.optional(S.String), DBSubnetGroups: S.optional(DBSubnetGroups) },
  ns,
) {}
export class EngineDefaults extends S.Class<EngineDefaults>("EngineDefaults")({
  DBParameterGroupFamily: S.optional(S.String),
  Marker: S.optional(S.String),
  Parameters: S.optional(ParametersList),
}) {}
export class DescribeEngineDefaultParametersResult extends S.Class<DescribeEngineDefaultParametersResult>(
  "DescribeEngineDefaultParametersResult",
)({ EngineDefaults: S.optional(EngineDefaults) }, ns) {}
export class EventSubscriptionsMessage extends S.Class<EventSubscriptionsMessage>(
  "EventSubscriptionsMessage",
)(
  {
    Marker: S.optional(S.String),
    EventSubscriptionsList: S.optional(EventSubscriptionsList),
  },
  ns,
) {}
export class GlobalClustersMessage extends S.Class<GlobalClustersMessage>(
  "GlobalClustersMessage",
)(
  {
    Marker: S.optional(S.String),
    GlobalClusters: S.optional(GlobalClusterList),
  },
  ns,
) {}
export class PendingMaintenanceActionsMessage extends S.Class<PendingMaintenanceActionsMessage>(
  "PendingMaintenanceActionsMessage",
)(
  {
    PendingMaintenanceActions: S.optional(PendingMaintenanceActions),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class FailoverDBClusterResult extends S.Class<FailoverDBClusterResult>(
  "FailoverDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class FailoverGlobalClusterResult extends S.Class<FailoverGlobalClusterResult>(
  "FailoverGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class TagListMessage extends S.Class<TagListMessage>("TagListMessage")(
  { TagList: S.optional(TagList) },
  ns,
) {}
export class ModifyDBClusterMessage extends S.Class<ModifyDBClusterMessage>(
  "ModifyDBClusterMessage",
)(
  {
    DBClusterIdentifier: S.String,
    NewDBClusterIdentifier: S.optional(S.String),
    ApplyImmediately: S.optional(S.Boolean),
    BackupRetentionPeriod: S.optional(S.Number),
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Port: S.optional(S.Number),
    MasterUserPassword: S.optional(S.String),
    OptionGroupName: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    EnableIAMDatabaseAuthentication: S.optional(S.Boolean),
    CloudwatchLogsExportConfiguration: S.optional(
      CloudwatchLogsExportConfiguration,
    ),
    EngineVersion: S.optional(S.String),
    AllowMajorVersionUpgrade: S.optional(S.Boolean),
    DBInstanceParameterGroupName: S.optional(S.String),
    DeletionProtection: S.optional(S.Boolean),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    StorageType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyDBClusterEndpointOutput extends S.Class<ModifyDBClusterEndpointOutput>(
  "ModifyDBClusterEndpointOutput",
)(
  {
    DBClusterEndpointIdentifier: S.optional(S.String),
    DBClusterIdentifier: S.optional(S.String),
    DBClusterEndpointResourceIdentifier: S.optional(S.String),
    Endpoint: S.optional(S.String),
    Status: S.optional(S.String),
    EndpointType: S.optional(S.String),
    CustomEndpointType: S.optional(S.String),
    StaticMembers: S.optional(StringList),
    ExcludedMembers: S.optional(StringList),
    DBClusterEndpointArn: S.optional(S.String),
  },
  ns,
) {}
export class ModifyDBClusterParameterGroupMessage extends S.Class<ModifyDBClusterParameterGroupMessage>(
  "ModifyDBClusterParameterGroupMessage",
)(
  { DBClusterParameterGroupName: S.String, Parameters: ParametersList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DBClusterSnapshotAttribute extends S.Class<DBClusterSnapshotAttribute>(
  "DBClusterSnapshotAttribute",
)({
  AttributeName: S.optional(S.String),
  AttributeValues: S.optional(AttributeValueList),
}) {}
export const DBClusterSnapshotAttributeList = S.Array(
  DBClusterSnapshotAttribute.pipe(T.XmlName("DBClusterSnapshotAttribute")),
);
export class DBClusterSnapshotAttributesResult extends S.Class<DBClusterSnapshotAttributesResult>(
  "DBClusterSnapshotAttributesResult",
)({
  DBClusterSnapshotIdentifier: S.optional(S.String),
  DBClusterSnapshotAttributes: S.optional(DBClusterSnapshotAttributeList),
}) {}
export class ModifyDBClusterSnapshotAttributeResult extends S.Class<ModifyDBClusterSnapshotAttributeResult>(
  "ModifyDBClusterSnapshotAttributeResult",
)(
  {
    DBClusterSnapshotAttributesResult: S.optional(
      DBClusterSnapshotAttributesResult,
    ),
  },
  ns,
) {}
export class ModifyDBInstanceResult extends S.Class<ModifyDBInstanceResult>(
  "ModifyDBInstanceResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class DBParameterGroupNameMessage extends S.Class<DBParameterGroupNameMessage>(
  "DBParameterGroupNameMessage",
)({ DBParameterGroupName: S.optional(S.String) }, ns) {}
export class ModifyDBSubnetGroupResult extends S.Class<ModifyDBSubnetGroupResult>(
  "ModifyDBSubnetGroupResult",
)({ DBSubnetGroup: S.optional(DBSubnetGroup) }, ns) {}
export class ModifyEventSubscriptionResult extends S.Class<ModifyEventSubscriptionResult>(
  "ModifyEventSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class ModifyGlobalClusterResult extends S.Class<ModifyGlobalClusterResult>(
  "ModifyGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class PromoteReadReplicaDBClusterResult extends S.Class<PromoteReadReplicaDBClusterResult>(
  "PromoteReadReplicaDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class RebootDBInstanceResult extends S.Class<RebootDBInstanceResult>(
  "RebootDBInstanceResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class RemoveFromGlobalClusterResult extends S.Class<RemoveFromGlobalClusterResult>(
  "RemoveFromGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class RemoveSourceIdentifierFromSubscriptionResult extends S.Class<RemoveSourceIdentifierFromSubscriptionResult>(
  "RemoveSourceIdentifierFromSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class DBClusterParameterGroupNameMessage extends S.Class<DBClusterParameterGroupNameMessage>(
  "DBClusterParameterGroupNameMessage",
)({ DBClusterParameterGroupName: S.optional(S.String) }, ns) {}
export class RestoreDBClusterFromSnapshotResult extends S.Class<RestoreDBClusterFromSnapshotResult>(
  "RestoreDBClusterFromSnapshotResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class RestoreDBClusterToPointInTimeResult extends S.Class<RestoreDBClusterToPointInTimeResult>(
  "RestoreDBClusterToPointInTimeResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class StartDBClusterResult extends S.Class<StartDBClusterResult>(
  "StartDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class StopDBClusterResult extends S.Class<StopDBClusterResult>(
  "StopDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class SwitchoverGlobalClusterResult extends S.Class<SwitchoverGlobalClusterResult>(
  "SwitchoverGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class CharacterSet extends S.Class<CharacterSet>("CharacterSet")({
  CharacterSetName: S.optional(S.String),
  CharacterSetDescription: S.optional(S.String),
}) {}
export const SupportedCharacterSetsList = S.Array(
  CharacterSet.pipe(T.XmlName("CharacterSet")),
);
export class EventCategoriesMap extends S.Class<EventCategoriesMap>(
  "EventCategoriesMap",
)({
  SourceType: S.optional(S.String),
  EventCategories: S.optional(EventCategoriesList),
}) {}
export const EventCategoriesMapList = S.Array(
  EventCategoriesMap.pipe(T.XmlName("EventCategoriesMap")),
);
export class Event extends S.Class<Event>("Event")({
  SourceIdentifier: S.optional(S.String),
  SourceType: S.optional(S.String),
  Message: S.optional(S.String),
  EventCategories: S.optional(EventCategoriesList),
  Date: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SourceArn: S.optional(S.String),
}) {}
export const EventList = S.Array(Event.pipe(T.XmlName("Event")));
export class AddSourceIdentifierToSubscriptionResult extends S.Class<AddSourceIdentifierToSubscriptionResult>(
  "AddSourceIdentifierToSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class CopyDBClusterParameterGroupResult extends S.Class<CopyDBClusterParameterGroupResult>(
  "CopyDBClusterParameterGroupResult",
)({ DBClusterParameterGroup: S.optional(DBClusterParameterGroup) }, ns) {}
export class CopyDBClusterSnapshotResult extends S.Class<CopyDBClusterSnapshotResult>(
  "CopyDBClusterSnapshotResult",
)({ DBClusterSnapshot: S.optional(DBClusterSnapshot) }, ns) {}
export class CopyDBParameterGroupResult extends S.Class<CopyDBParameterGroupResult>(
  "CopyDBParameterGroupResult",
)({ DBParameterGroup: S.optional(DBParameterGroup) }, ns) {}
export class CreateDBClusterResult extends S.Class<CreateDBClusterResult>(
  "CreateDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class DescribeEngineDefaultClusterParametersResult extends S.Class<DescribeEngineDefaultClusterParametersResult>(
  "DescribeEngineDefaultClusterParametersResult",
)({ EngineDefaults: S.optional(EngineDefaults) }, ns) {}
export class EventCategoriesMessage extends S.Class<EventCategoriesMessage>(
  "EventCategoriesMessage",
)({ EventCategoriesMapList: S.optional(EventCategoriesMapList) }, ns) {}
export class EventsMessage extends S.Class<EventsMessage>("EventsMessage")(
  { Marker: S.optional(S.String), Events: S.optional(EventList) },
  ns,
) {}
export class ModifyDBClusterResult extends S.Class<ModifyDBClusterResult>(
  "ModifyDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class UpgradeTarget extends S.Class<UpgradeTarget>("UpgradeTarget")({
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  Description: S.optional(S.String),
  AutoUpgrade: S.optional(S.Boolean),
  IsMajorVersionUpgrade: S.optional(S.Boolean),
  SupportsGlobalDatabases: S.optional(S.Boolean),
}) {}
export const ValidUpgradeTargetList = S.Array(
  UpgradeTarget.pipe(T.XmlName("UpgradeTarget")),
);
export class Timezone extends S.Class<Timezone>("Timezone")({
  TimezoneName: S.optional(S.String),
}) {}
export const SupportedTimezonesList = S.Array(
  Timezone.pipe(T.XmlName("Timezone")),
);
export const AvailabilityZoneList = S.Array(
  AvailabilityZone.pipe(T.XmlName("AvailabilityZone")),
);
export class DBClusterEndpoint extends S.Class<DBClusterEndpoint>(
  "DBClusterEndpoint",
)({
  DBClusterEndpointIdentifier: S.optional(S.String),
  DBClusterIdentifier: S.optional(S.String),
  DBClusterEndpointResourceIdentifier: S.optional(S.String),
  Endpoint: S.optional(S.String),
  Status: S.optional(S.String),
  EndpointType: S.optional(S.String),
  CustomEndpointType: S.optional(S.String),
  StaticMembers: S.optional(StringList),
  ExcludedMembers: S.optional(StringList),
  DBClusterEndpointArn: S.optional(S.String),
}) {}
export const DBClusterEndpointList = S.Array(
  DBClusterEndpoint.pipe(T.XmlName("DBClusterEndpointList")),
);
export class DBEngineVersion extends S.Class<DBEngineVersion>(
  "DBEngineVersion",
)({
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  DBParameterGroupFamily: S.optional(S.String),
  DBEngineDescription: S.optional(S.String),
  DBEngineVersionDescription: S.optional(S.String),
  DefaultCharacterSet: S.optional(CharacterSet),
  SupportedCharacterSets: S.optional(SupportedCharacterSetsList),
  ValidUpgradeTarget: S.optional(ValidUpgradeTargetList),
  SupportedTimezones: S.optional(SupportedTimezonesList),
  ExportableLogTypes: S.optional(LogTypeList),
  SupportsLogExportsToCloudwatchLogs: S.optional(S.Boolean),
  SupportsReadReplica: S.optional(S.Boolean),
  SupportsGlobalDatabases: S.optional(S.Boolean),
}) {}
export const DBEngineVersionList = S.Array(
  DBEngineVersion.pipe(T.XmlName("DBEngineVersion")),
);
export class OrderableDBInstanceOption extends S.Class<OrderableDBInstanceOption>(
  "OrderableDBInstanceOption",
)({
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  DBInstanceClass: S.optional(S.String),
  LicenseModel: S.optional(S.String),
  AvailabilityZones: S.optional(AvailabilityZoneList),
  MultiAZCapable: S.optional(S.Boolean),
  ReadReplicaCapable: S.optional(S.Boolean),
  Vpc: S.optional(S.Boolean),
  SupportsStorageEncryption: S.optional(S.Boolean),
  StorageType: S.optional(S.String),
  SupportsIops: S.optional(S.Boolean),
  SupportsEnhancedMonitoring: S.optional(S.Boolean),
  SupportsIAMDatabaseAuthentication: S.optional(S.Boolean),
  SupportsPerformanceInsights: S.optional(S.Boolean),
  MinStorageSize: S.optional(S.Number),
  MaxStorageSize: S.optional(S.Number),
  MinIopsPerDbInstance: S.optional(S.Number),
  MaxIopsPerDbInstance: S.optional(S.Number),
  MinIopsPerGib: S.optional(S.Number),
  MaxIopsPerGib: S.optional(S.Number),
  SupportsGlobalDatabases: S.optional(S.Boolean),
}) {}
export const OrderableDBInstanceOptionsList = S.Array(
  OrderableDBInstanceOption.pipe(T.XmlName("OrderableDBInstanceOption")),
);
export class Range extends S.Class<Range>("Range")({
  From: S.optional(S.Number),
  To: S.optional(S.Number),
  Step: S.optional(S.Number),
}) {}
export const RangeList = S.Array(Range.pipe(T.XmlName("Range")));
export class DoubleRange extends S.Class<DoubleRange>("DoubleRange")({
  From: S.optional(S.Number),
  To: S.optional(S.Number),
}) {}
export const DoubleRangeList = S.Array(
  DoubleRange.pipe(T.XmlName("DoubleRange")),
);
export class ApplyPendingMaintenanceActionResult extends S.Class<ApplyPendingMaintenanceActionResult>(
  "ApplyPendingMaintenanceActionResult",
)(
  {
    ResourcePendingMaintenanceActions: S.optional(
      ResourcePendingMaintenanceActions,
    ),
  },
  ns,
) {}
export class CreateDBSubnetGroupResult extends S.Class<CreateDBSubnetGroupResult>(
  "CreateDBSubnetGroupResult",
)({ DBSubnetGroup: S.optional(DBSubnetGroup) }, ns) {}
export class CreateGlobalClusterResult extends S.Class<CreateGlobalClusterResult>(
  "CreateGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
export class DeleteDBClusterResult extends S.Class<DeleteDBClusterResult>(
  "DeleteDBClusterResult",
)({ DBCluster: S.optional(DBCluster) }, ns) {}
export class DBClusterEndpointMessage extends S.Class<DBClusterEndpointMessage>(
  "DBClusterEndpointMessage",
)(
  {
    Marker: S.optional(S.String),
    DBClusterEndpoints: S.optional(DBClusterEndpointList),
  },
  ns,
) {}
export class DescribeDBClusterSnapshotAttributesResult extends S.Class<DescribeDBClusterSnapshotAttributesResult>(
  "DescribeDBClusterSnapshotAttributesResult",
)(
  {
    DBClusterSnapshotAttributesResult: S.optional(
      DBClusterSnapshotAttributesResult,
    ),
  },
  ns,
) {}
export class DBEngineVersionMessage extends S.Class<DBEngineVersionMessage>(
  "DBEngineVersionMessage",
)(
  {
    Marker: S.optional(S.String),
    DBEngineVersions: S.optional(DBEngineVersionList),
  },
  ns,
) {}
export class OrderableDBInstanceOptionsMessage extends S.Class<OrderableDBInstanceOptionsMessage>(
  "OrderableDBInstanceOptionsMessage",
)(
  {
    OrderableDBInstanceOptions: S.optional(OrderableDBInstanceOptionsList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ValidStorageOptions extends S.Class<ValidStorageOptions>(
  "ValidStorageOptions",
)({
  StorageType: S.optional(S.String),
  StorageSize: S.optional(RangeList),
  ProvisionedIops: S.optional(RangeList),
  IopsToStorageRatio: S.optional(DoubleRangeList),
}) {}
export const ValidStorageOptionsList = S.Array(
  ValidStorageOptions.pipe(T.XmlName("ValidStorageOptions")),
);
export class ValidDBInstanceModificationsMessage extends S.Class<ValidDBInstanceModificationsMessage>(
  "ValidDBInstanceModificationsMessage",
)({ Storage: S.optional(ValidStorageOptionsList) }) {}
export class CreateDBInstanceResult extends S.Class<CreateDBInstanceResult>(
  "CreateDBInstanceResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}
export class DescribeValidDBInstanceModificationsResult extends S.Class<DescribeValidDBInstanceModificationsResult>(
  "DescribeValidDBInstanceModificationsResult",
)(
  {
    ValidDBInstanceModificationsMessage: S.optional(
      ValidDBInstanceModificationsMessage,
    ),
  },
  ns,
) {}

//# Errors
export class DBClusterNotFoundFault extends S.TaggedError<DBClusterNotFoundFault>()(
  "DBClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBClusterNotFoundFault", httpResponseCode: 404 }),
) {}
export class DBParameterGroupNotFoundFault extends S.TaggedError<DBParameterGroupNotFoundFault>()(
  "DBParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBParameterGroupNotFound", httpResponseCode: 404 }),
) {}
export class DBSubnetGroupNotFoundFault extends S.TaggedError<DBSubnetGroupNotFoundFault>()(
  "DBSubnetGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class DBClusterRoleAlreadyExistsFault extends S.TaggedError<DBClusterRoleAlreadyExistsFault>()(
  "DBClusterRoleAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterRoleAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class DBInstanceNotFoundFault extends S.TaggedError<DBInstanceNotFoundFault>()(
  "DBInstanceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBInstanceNotFound", httpResponseCode: 404 }),
) {}
export class DBClusterEndpointAlreadyExistsFault extends S.TaggedError<DBClusterEndpointAlreadyExistsFault>()(
  "DBClusterEndpointAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterEndpointAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class DBParameterGroupAlreadyExistsFault extends S.TaggedError<DBParameterGroupAlreadyExistsFault>()(
  "DBParameterGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBParameterGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterSnapshotAlreadyExistsFault extends S.TaggedError<DBClusterSnapshotAlreadyExistsFault>()(
  "DBClusterSnapshotAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterSnapshotAlreadyExistsFault",
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
export class DBClusterEndpointNotFoundFault extends S.TaggedError<DBClusterEndpointNotFoundFault>()(
  "DBClusterEndpointNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterEndpointNotFoundFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBParameterGroupStateFault extends S.TaggedError<InvalidDBParameterGroupStateFault>()(
  "InvalidDBParameterGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBParameterGroupState",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterSnapshotNotFoundFault extends S.TaggedError<DBClusterSnapshotNotFoundFault>()(
  "DBClusterSnapshotNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterSnapshotNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class InvalidDBSubnetGroupStateFault extends S.TaggedError<InvalidDBSubnetGroupStateFault>()(
  "InvalidDBSubnetGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBSubnetGroupStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidEventSubscriptionStateFault extends S.TaggedError<InvalidEventSubscriptionStateFault>()(
  "InvalidEventSubscriptionStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidEventSubscriptionState",
    httpResponseCode: 400,
  }),
) {}
export class GlobalClusterNotFoundFault extends S.TaggedError<GlobalClusterNotFoundFault>()(
  "GlobalClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalClusterNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class SubscriptionNotFoundFault extends S.TaggedError<SubscriptionNotFoundFault>()(
  "SubscriptionNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionNotFound", httpResponseCode: 404 }),
) {}
export class ResourceNotFoundFault extends S.TaggedError<ResourceNotFoundFault>()(
  "ResourceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundFault", httpResponseCode: 404 }),
) {}
export class InvalidDBClusterStateFault extends S.TaggedError<InvalidDBClusterStateFault>()(
  "InvalidDBClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterStateFault",
    httpResponseCode: 400,
  }),
) {}
export class AuthorizationNotFoundFault extends S.TaggedError<AuthorizationNotFoundFault>()(
  "AuthorizationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AuthorizationNotFound", httpResponseCode: 404 }),
) {}
export class DBSubnetGroupDoesNotCoverEnoughAZs extends S.TaggedError<DBSubnetGroupDoesNotCoverEnoughAZs>()(
  "DBSubnetGroupDoesNotCoverEnoughAZs",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupDoesNotCoverEnoughAZs",
    httpResponseCode: 400,
  }),
) {}
export class SourceNotFoundFault extends S.TaggedError<SourceNotFoundFault>()(
  "SourceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SourceNotFound", httpResponseCode: 404 }),
) {}
export class DBClusterAlreadyExistsFault extends S.TaggedError<DBClusterAlreadyExistsFault>()(
  "DBClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterRoleNotFoundFault extends S.TaggedError<DBClusterRoleNotFoundFault>()(
  "DBClusterRoleNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBClusterRoleNotFound", httpResponseCode: 404 }),
) {}
export class DBClusterRoleQuotaExceededFault extends S.TaggedError<DBClusterRoleQuotaExceededFault>()(
  "DBClusterRoleQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterRoleQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class DBSnapshotNotFoundFault extends S.TaggedError<DBSnapshotNotFoundFault>()(
  "DBSnapshotNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSnapshotNotFound", httpResponseCode: 404 }),
) {}
export class DBClusterEndpointQuotaExceededFault extends S.TaggedError<DBClusterEndpointQuotaExceededFault>()(
  "DBClusterEndpointQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterEndpointQuotaExceededFault",
    httpResponseCode: 403,
  }),
) {}
export class DBParameterGroupQuotaExceededFault extends S.TaggedError<DBParameterGroupQuotaExceededFault>()(
  "DBParameterGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBClusterSnapshotStateFault extends S.TaggedError<InvalidDBClusterSnapshotStateFault>()(
  "InvalidDBClusterSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterSnapshotStateFault",
    httpResponseCode: 400,
  }),
) {}
export class SNSInvalidTopicFault extends S.TaggedError<SNSInvalidTopicFault>()(
  "SNSInvalidTopicFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSInvalidTopic", httpResponseCode: 400 }),
) {}
export class InvalidDBClusterEndpointStateFault extends S.TaggedError<InvalidDBClusterEndpointStateFault>()(
  "InvalidDBClusterEndpointStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterEndpointStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBSubnetStateFault extends S.TaggedError<InvalidDBSubnetStateFault>()(
  "InvalidDBSubnetStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBSubnetStateFault", httpResponseCode: 400 }),
) {}
export class InvalidGlobalClusterStateFault extends S.TaggedError<InvalidGlobalClusterStateFault>()(
  "InvalidGlobalClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidGlobalClusterStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBInstanceStateFault extends S.TaggedError<InvalidDBInstanceStateFault>()(
  "InvalidDBInstanceStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBInstanceState", httpResponseCode: 400 }),
) {}
export class CertificateNotFoundFault extends S.TaggedError<CertificateNotFoundFault>()(
  "CertificateNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "CertificateNotFound", httpResponseCode: 404 }),
) {}
export class DBSubnetQuotaExceededFault extends S.TaggedError<DBSubnetQuotaExceededFault>()(
  "DBSubnetQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class DBClusterParameterGroupNotFoundFault extends S.TaggedError<DBClusterParameterGroupNotFoundFault>()(
  "DBClusterParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterParameterGroupNotFound",
    httpResponseCode: 404,
  }),
) {}
export class DBSnapshotAlreadyExistsFault extends S.TaggedError<DBSnapshotAlreadyExistsFault>()(
  "DBSnapshotAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSnapshotAlreadyExists", httpResponseCode: 400 }),
) {}
export class SnapshotQuotaExceededFault extends S.TaggedError<SnapshotQuotaExceededFault>()(
  "SnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SnapshotQuotaExceeded", httpResponseCode: 400 }),
) {}
export class DBSubnetGroupAlreadyExistsFault extends S.TaggedError<DBSubnetGroupAlreadyExistsFault>()(
  "DBSubnetGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class SNSNoAuthorizationFault extends S.TaggedError<SNSNoAuthorizationFault>()(
  "SNSNoAuthorizationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSNoAuthorization", httpResponseCode: 400 }),
) {}
export class GlobalClusterAlreadyExistsFault extends S.TaggedError<GlobalClusterAlreadyExistsFault>()(
  "GlobalClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalClusterAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class DBInstanceAlreadyExistsFault extends S.TaggedError<DBInstanceAlreadyExistsFault>()(
  "DBInstanceAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBInstanceAlreadyExists", httpResponseCode: 400 }),
) {}
export class InvalidSubnet extends S.TaggedError<InvalidSubnet>()(
  "InvalidSubnet",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
) {}
export class DBClusterQuotaExceededFault extends S.TaggedError<DBClusterQuotaExceededFault>()(
  "DBClusterQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterQuotaExceededFault",
    httpResponseCode: 403,
  }),
) {}
export class KMSKeyNotAccessibleFault extends S.TaggedError<KMSKeyNotAccessibleFault>()(
  "KMSKeyNotAccessibleFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSKeyNotAccessibleFault", httpResponseCode: 400 }),
) {}
export class SharedSnapshotQuotaExceededFault extends S.TaggedError<SharedSnapshotQuotaExceededFault>()(
  "SharedSnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SharedSnapshotQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBSecurityGroupStateFault extends S.TaggedError<InvalidDBSecurityGroupStateFault>()(
  "InvalidDBSecurityGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBSecurityGroupState",
    httpResponseCode: 400,
  }),
) {}
export class DBSubnetGroupQuotaExceededFault extends S.TaggedError<DBSubnetGroupQuotaExceededFault>()(
  "DBSubnetGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBSubnetGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class SNSTopicArnNotFoundFault extends S.TaggedError<SNSTopicArnNotFoundFault>()(
  "SNSTopicArnNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSTopicArnNotFound", httpResponseCode: 404 }),
) {}
export class GlobalClusterQuotaExceededFault extends S.TaggedError<GlobalClusterQuotaExceededFault>()(
  "GlobalClusterQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalClusterQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class DBSecurityGroupNotFoundFault extends S.TaggedError<DBSecurityGroupNotFoundFault>()(
  "DBSecurityGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSecurityGroupNotFound", httpResponseCode: 404 }),
) {}
export class SubnetAlreadyInUse extends S.TaggedError<SubnetAlreadyInUse>()(
  "SubnetAlreadyInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetAlreadyInUse", httpResponseCode: 400 }),
) {}
export class InsufficientDBClusterCapacityFault extends S.TaggedError<InsufficientDBClusterCapacityFault>()(
  "InsufficientDBClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientDBClusterCapacityFault",
    httpResponseCode: 403,
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
export class InsufficientStorageClusterCapacityFault extends S.TaggedError<InsufficientStorageClusterCapacityFault>()(
  "InsufficientStorageClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientStorageClusterCapacity",
    httpResponseCode: 400,
  }),
) {}
export class SubscriptionAlreadyExistFault extends S.TaggedError<SubscriptionAlreadyExistFault>()(
  "SubscriptionAlreadyExistFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubscriptionAlreadyExist", httpResponseCode: 400 }),
) {}
export class DBUpgradeDependencyFailureFault extends S.TaggedError<DBUpgradeDependencyFailureFault>()(
  "DBUpgradeDependencyFailureFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBUpgradeDependencyFailure",
    httpResponseCode: 400,
  }),
) {}
export class SubscriptionCategoryNotFoundFault extends S.TaggedError<SubscriptionCategoryNotFoundFault>()(
  "SubscriptionCategoryNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SubscriptionCategoryNotFound",
    httpResponseCode: 404,
  }),
) {}
export class DomainNotFoundFault extends S.TaggedError<DomainNotFoundFault>()(
  "DomainNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DomainNotFoundFault", httpResponseCode: 404 }),
) {}
export class StorageQuotaExceededFault extends S.TaggedError<StorageQuotaExceededFault>()(
  "StorageQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StorageQuotaExceeded", httpResponseCode: 400 }),
) {}
export class InvalidDBSnapshotStateFault extends S.TaggedError<InvalidDBSnapshotStateFault>()(
  "InvalidDBSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBSnapshotState", httpResponseCode: 400 }),
) {}
export class InstanceQuotaExceededFault extends S.TaggedError<InstanceQuotaExceededFault>()(
  "InstanceQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InstanceQuotaExceeded", httpResponseCode: 400 }),
) {}
export class StorageTypeNotSupportedFault extends S.TaggedError<StorageTypeNotSupportedFault>()(
  "StorageTypeNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StorageTypeNotSupported", httpResponseCode: 400 }),
) {}
export class InvalidRestoreFault extends S.TaggedError<InvalidRestoreFault>()(
  "InvalidRestoreFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRestoreFault", httpResponseCode: 400 }),
) {}
export class InsufficientDBInstanceCapacityFault extends S.TaggedError<InsufficientDBInstanceCapacityFault>()(
  "InsufficientDBInstanceCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientDBInstanceCapacity",
    httpResponseCode: 400,
  }),
) {}
export class OptionGroupNotFoundFault extends S.TaggedError<OptionGroupNotFoundFault>()(
  "OptionGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "OptionGroupNotFoundFault", httpResponseCode: 404 }),
) {}
export class ProvisionedIopsNotAvailableInAZFault extends S.TaggedError<ProvisionedIopsNotAvailableInAZFault>()(
  "ProvisionedIopsNotAvailableInAZFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ProvisionedIopsNotAvailableInAZFault",
    httpResponseCode: 400,
  }),
) {}

//# Operations
/**
 * Returns a list of `DBClusterParameterGroup` descriptions. If a
 * `DBClusterParameterGroupName` parameter is specified, the list will contain only
 * the description of the specified DB cluster parameter group.
 */
export const describeDBClusterParameterGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDBClusterParameterGroupsMessage,
    output: DBClusterParameterGroupsMessage,
    errors: [DBParameterGroupNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "DBClusterParameterGroups",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns the detailed parameter list for a particular DB cluster parameter group.
 */
export const describeDBClusterParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDBClusterParametersMessage,
    output: DBClusterParameterGroupDetails,
    errors: [DBParameterGroupNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "Parameters",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns information about provisioned DB clusters, and supports
 * pagination.
 *
 * This operation can also return information for Amazon RDS clusters
 * and Amazon DocDB clusters.
 */
export const describeDBClusters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeDBClustersMessage,
    output: DBClusterMessage,
    errors: [DBClusterNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "DBClusters",
      pageSize: "MaxRecords",
    } as const,
  }),
);
/**
 * Returns a list of `DBParameterGroup` descriptions. If a
 * `DBParameterGroupName` is specified, the list will contain only the description of
 * the specified DB parameter group.
 */
export const describeDBParameterGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDBParameterGroupsMessage,
    output: DBParameterGroupsMessage,
    errors: [DBParameterGroupNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "DBParameterGroups",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns the detailed parameter list for a particular DB parameter group.
 */
export const describeDBParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDBParametersMessage,
    output: DBParameterGroupDetails,
    errors: [DBParameterGroupNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "Parameters",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a list of DBSubnetGroup descriptions. If a DBSubnetGroupName is specified, the
 * list will contain only the descriptions of the specified DBSubnetGroup.
 *
 * For an overview of CIDR ranges, go to the Wikipedia Tutorial.
 */
export const describeDBSubnetGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDBSubnetGroupsMessage,
    output: DBSubnetGroupMessage,
    errors: [DBSubnetGroupNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "DBSubnetGroups",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns the default engine and system parameter information for the specified database
 * engine.
 */
export const describeEngineDefaultParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeEngineDefaultParametersMessage,
    output: DescribeEngineDefaultParametersResult,
    errors: [],
    pagination: {
      inputToken: "Marker",
      outputToken: "EngineDefaults.Marker",
      items: "EngineDefaults.Parameters",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Deletes a specified DB cluster parameter group. The DB cluster parameter group to be
 * deleted can't be associated with any DB clusters.
 */
export const deleteDBClusterParameterGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDBClusterParameterGroupMessage,
    output: DeleteDBClusterParameterGroupResponse,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }));
/**
 * Returns the default engine and system parameter information for the cluster database
 * engine.
 */
export const describeEngineDefaultClusterParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeEngineDefaultClusterParametersMessage,
    output: DescribeEngineDefaultClusterParametersResult,
    errors: [],
  }));
/**
 * Displays a list of categories for all event source types, or, if specified, for a
 * specified source type.
 */
export const describeEventCategories = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventCategoriesMessage,
    output: EventCategoriesMessage,
    errors: [],
  }),
);
/**
 * Returns events related to DB instances, DB security groups, DB snapshots, and DB parameter
 * groups for the past 14 days. Events specific to a particular DB instance, DB security group,
 * database snapshot, or DB parameter group can be obtained by providing the name as a parameter.
 * By default, the past hour of events are returned.
 */
export const describeEvents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeEventsMessage,
    output: EventsMessage,
    errors: [],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "Events",
      pageSize: "MaxRecords",
    } as const,
  }),
);
/**
 * Lists all the subscription descriptions for a customer account. The description for a
 * subscription includes SubscriptionName, SNSTopicARN, CustomerID, SourceType, SourceID,
 * CreationTime, and Status.
 *
 * If you specify a SubscriptionName, lists the description for that subscription.
 */
export const describeEventSubscriptions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeEventSubscriptionsMessage,
    output: EventSubscriptionsMessage,
    errors: [SubscriptionNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "EventSubscriptionsList",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a list of resources (for example, DB instances) that have at least one pending
 * maintenance action.
 */
export const describePendingMaintenanceActions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribePendingMaintenanceActionsMessage,
    output: PendingMaintenanceActionsMessage,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "PendingMaintenanceActions",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Removes a source identifier from an existing event notification subscription.
 */
export const removeSourceIdentifierFromSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RemoveSourceIdentifierFromSubscriptionMessage,
    output: RemoveSourceIdentifierFromSubscriptionResult,
    errors: [SourceNotFoundFault, SubscriptionNotFoundFault],
  }));
/**
 * Disassociates an Identity and Access Management (IAM) role from a DB cluster.
 */
export const removeRoleFromDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveRoleFromDBClusterMessage,
    output: RemoveRoleFromDBClusterResponse,
    errors: [
      DBClusterNotFoundFault,
      DBClusterRoleNotFoundFault,
      InvalidDBClusterStateFault,
    ],
  }),
);
/**
 * Returns information about provisioned instances, and supports pagination.
 *
 * This operation can also return information for Amazon RDS instances
 * and Amazon DocDB instances.
 */
export const describeDBInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDBInstancesMessage,
    output: DBInstanceMessage,
    errors: [DBInstanceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "DBInstances",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Modifies the parameters of a DB cluster parameter group. To modify more than one
 * parameter, submit a list of the following: `ParameterName`,
 * `ParameterValue`, and `ApplyMethod`. A maximum of 20 parameters can be
 * modified in a single request.
 *
 * Changes to dynamic parameters are applied immediately. Changes to static parameters
 * require a reboot without failover to the DB cluster associated with the parameter group
 * before the change can take effect.
 *
 * After you create a DB cluster parameter group, you should wait at least 5 minutes before
 * creating your first DB cluster that uses that DB cluster parameter group as the default
 * parameter group. This allows Amazon Neptune to fully complete the create action before the
 * parameter group is used as the default for a new DB cluster. This is especially important
 * for parameters that are critical when creating the default database for a DB cluster, such
 * as the character set for the default database defined by the
 * `character_set_database` parameter. You can use the Parameter
 * Groups option of the Amazon Neptune console or the DescribeDBClusterParameters command to verify that your DB cluster parameter
 * group has been created or modified.
 */
export const modifyDBClusterParameterGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyDBClusterParameterGroupMessage,
    output: DBClusterParameterGroupNameMessage,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }));
/**
 * Modifies the parameters of a DB parameter group. To modify more than one parameter,
 * submit a list of the following: `ParameterName`, `ParameterValue`, and
 * `ApplyMethod`. A maximum of 20 parameters can be modified in a single request.
 *
 * Changes to dynamic parameters are applied immediately. Changes to static parameters
 * require a reboot without failover to the DB instance associated with the parameter group
 * before the change can take effect.
 *
 * After you modify a DB parameter group, you should wait at least 5 minutes before
 * creating your first DB instance that uses that DB parameter group as the default parameter
 * group. This allows Amazon Neptune to fully complete the modify action before the parameter
 * group is used as the default for a new DB instance. This is especially important for
 * parameters that are critical when creating the default database for a DB instance, such as
 * the character set for the default database defined by the
 * `character_set_database` parameter. You can use the Parameter
 * Groups option of the Amazon Neptune console or the
 * *DescribeDBParameters* command to verify that your DB parameter group has
 * been created or modified.
 */
export const modifyDBParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyDBParameterGroupMessage,
    output: DBParameterGroupNameMessage,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }),
);
/**
 * Modifies the parameters of a DB cluster parameter group to the default value. To reset
 * specific parameters submit a list of the following: `ParameterName` and
 * `ApplyMethod`. To reset the entire DB cluster parameter group, specify the
 * `DBClusterParameterGroupName` and `ResetAllParameters` parameters.
 *
 * When resetting the entire group, dynamic parameters are updated immediately and static
 * parameters are set to `pending-reboot` to take effect on the next DB instance
 * restart or RebootDBInstance request. You must call RebootDBInstance for every DB instance in your DB cluster
 * that you want the updated static parameter to apply to.
 */
export const resetDBClusterParameterGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ResetDBClusterParameterGroupMessage,
    output: DBClusterParameterGroupNameMessage,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }));
/**
 * Deletes a specified DBParameterGroup. The DBParameterGroup to be deleted can't be
 * associated with any DB instances.
 */
export const deleteDBParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDBParameterGroupMessage,
    output: DeleteDBParameterGroupResponse,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }),
);
/**
 * Modifies the parameters of a DB parameter group to the engine/system default value. To
 * reset specific parameters, provide a list of the following: `ParameterName` and
 * `ApplyMethod`. To reset the entire DB parameter group, specify the
 * `DBParameterGroup` name and `ResetAllParameters` parameters. When
 * resetting the entire group, dynamic parameters are updated immediately and static parameters
 * are set to `pending-reboot` to take effect on the next DB instance restart or
 * `RebootDBInstance` request.
 */
export const resetDBParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResetDBParameterGroupMessage,
    output: DBParameterGroupNameMessage,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }),
);
/**
 * Returns information about DB cluster snapshots. This API action supports
 * pagination.
 */
export const describeDBClusterSnapshots =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDBClusterSnapshotsMessage,
    output: DBClusterSnapshotMessage,
    errors: [DBClusterSnapshotNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "DBClusterSnapshots",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns information about Neptune global database clusters. This API
 * supports pagination.
 */
export const describeGlobalClusters =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeGlobalClustersMessage,
    output: GlobalClustersMessage,
    errors: [GlobalClusterNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "GlobalClusters",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Deletes an event notification subscription.
 */
export const deleteEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEventSubscriptionMessage,
    output: DeleteEventSubscriptionResult,
    errors: [InvalidEventSubscriptionStateFault, SubscriptionNotFoundFault],
  }),
);
/**
 * Not supported.
 */
export const promoteReadReplicaDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PromoteReadReplicaDBClusterMessage,
    output: PromoteReadReplicaDBClusterResult,
    errors: [DBClusterNotFoundFault, InvalidDBClusterStateFault],
  }),
);
/**
 * Adds a source identifier to an existing event notification subscription.
 */
export const addSourceIdentifierToSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AddSourceIdentifierToSubscriptionMessage,
    output: AddSourceIdentifierToSubscriptionResult,
    errors: [SourceNotFoundFault, SubscriptionNotFoundFault],
  }));
/**
 * Associates an Identity and Access Management (IAM) role with an
 * Neptune DB cluster.
 */
export const addRoleToDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddRoleToDBClusterMessage,
  output: AddRoleToDBClusterResponse,
  errors: [
    DBClusterNotFoundFault,
    DBClusterRoleAlreadyExistsFault,
    DBClusterRoleQuotaExceededFault,
    InvalidDBClusterStateFault,
  ],
}));
/**
 * Adds metadata tags to an Amazon Neptune resource. These tags can also be used with cost
 * allocation reporting to track cost associated with Amazon Neptune resources, or used in a
 * Condition statement in an IAM policy for Amazon Neptune.
 */
export const addTagsToResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToResourceMessage,
  output: AddTagsToResourceResponse,
  errors: [
    DBClusterNotFoundFault,
    DBInstanceNotFoundFault,
    DBSnapshotNotFoundFault,
  ],
}));
/**
 * Applies a pending maintenance action to a resource (for example, to a DB instance).
 */
export const applyPendingMaintenanceAction =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ApplyPendingMaintenanceActionMessage,
    output: ApplyPendingMaintenanceActionResult,
    errors: [ResourceNotFoundFault],
  }));
/**
 * Creates a new DB cluster parameter group.
 *
 * Parameters in a DB cluster parameter group apply to all of the instances in a DB
 * cluster.
 *
 * A DB cluster parameter group is initially created with the default
 * parameters for the database engine used by instances in the DB cluster.
 * To provide custom values for any of the parameters, you must modify the
 * group after creating it using ModifyDBClusterParameterGroup.
 * Once you've created a DB cluster parameter group, you need to associate it
 * with your DB cluster using ModifyDBCluster.
 * When you associate a new DB cluster parameter group with a running DB cluster,
 * you need to reboot the DB instances in the DB cluster without failover for the
 * new DB cluster parameter group and associated settings to take effect.
 *
 * After you create a DB cluster parameter group, you should wait at least
 * 5 minutes before creating your first DB cluster that uses that DB cluster
 * parameter group as the default parameter group. This allows Amazon Neptune
 * to fully complete the create action before the DB cluster parameter group
 * is used as the default for a new DB cluster. This is especially important for
 * parameters that are critical when creating the default database for a DB
 * cluster, such as the character set for the default database defined by the
 * `character_set_database` parameter. You can use the Parameter
 * Groups option of the Amazon Neptune
 * console or the DescribeDBClusterParameters
 * command to verify that your DB cluster parameter group has been created or modified.
 */
export const createDBClusterParameterGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDBClusterParameterGroupMessage,
    output: CreateDBClusterParameterGroupResult,
    errors: [
      DBParameterGroupAlreadyExistsFault,
      DBParameterGroupQuotaExceededFault,
    ],
  }));
/**
 * Deletes a custom endpoint and removes it from an Amazon Neptune DB cluster.
 */
export const deleteDBClusterEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDBClusterEndpointMessage,
    output: DeleteDBClusterEndpointOutput,
    errors: [
      DBClusterEndpointNotFoundFault,
      InvalidDBClusterEndpointStateFault,
      InvalidDBClusterStateFault,
    ],
  }),
);
/**
 * Deletes a DB subnet group.
 *
 * The specified database subnet group must not be associated with any DB instances.
 */
export const deleteDBSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBSubnetGroupMessage,
  output: DeleteDBSubnetGroupResponse,
  errors: [
    DBSubnetGroupNotFoundFault,
    InvalidDBSubnetGroupStateFault,
    InvalidDBSubnetStateFault,
  ],
}));
/**
 * Deletes a global database. The primary and all secondary clusters must
 * already be detached or deleted first.
 */
export const deleteGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlobalClusterMessage,
  output: DeleteGlobalClusterResult,
  errors: [GlobalClusterNotFoundFault, InvalidGlobalClusterStateFault],
}));
/**
 * Returns information about endpoints for an Amazon Neptune DB cluster.
 *
 * This operation can also return information for Amazon RDS clusters
 * and Amazon DocDB clusters.
 */
export const describeDBClusterEndpoints =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDBClusterEndpointsMessage,
    output: DBClusterEndpointMessage,
    errors: [DBClusterNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "DBClusterEndpoints",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a list of DB cluster snapshot attribute names and values for a manual DB cluster
 * snapshot.
 *
 * When sharing snapshots with other Amazon accounts,
 * `DescribeDBClusterSnapshotAttributes` returns the `restore` attribute
 * and a list of IDs for the Amazon accounts that are authorized to copy or restore the manual DB
 * cluster snapshot. If `all` is included in the list of values for the
 * `restore` attribute, then the manual DB cluster snapshot is public and can be
 * copied or restored by all Amazon accounts.
 *
 * To add or remove access for an Amazon account to copy or restore a manual DB cluster
 * snapshot, or to make the manual DB cluster snapshot public or private, use the ModifyDBClusterSnapshotAttribute API action.
 */
export const describeDBClusterSnapshotAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDBClusterSnapshotAttributesMessage,
    output: DescribeDBClusterSnapshotAttributesResult,
    errors: [DBClusterSnapshotNotFoundFault],
  }));
/**
 * Returns a list of the available DB engines.
 */
export const describeDBEngineVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDBEngineVersionsMessage,
    output: DBEngineVersionMessage,
    errors: [],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "DBEngineVersions",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a list of orderable DB instance options for the specified engine.
 */
export const describeOrderableDBInstanceOptions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeOrderableDBInstanceOptionsMessage,
    output: OrderableDBInstanceOptionsMessage,
    errors: [],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "OrderableDBInstanceOptions",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Forces a failover for a DB cluster.
 *
 * A failover for a DB cluster promotes one of the Read Replicas (read-only instances) in the
 * DB cluster to be the primary instance (the cluster writer).
 *
 * Amazon Neptune will automatically fail over to a Read Replica, if one exists, when the
 * primary instance fails. You can force a failover when you want to simulate a failure of a
 * primary instance for testing. Because each instance in a DB cluster has its own endpoint
 * address, you will need to clean up and re-establish any existing connections that use those
 * endpoint addresses when the failover is complete.
 */
export const failoverDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FailoverDBClusterMessage,
  output: FailoverDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
  ],
}));
/**
 * Lists all tags on an Amazon Neptune resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceMessage,
  output: TagListMessage,
  errors: [
    DBClusterNotFoundFault,
    DBInstanceNotFoundFault,
    DBSnapshotNotFoundFault,
  ],
}));
/**
 * Removes metadata tags from an Amazon Neptune resource.
 */
export const removeTagsFromResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveTagsFromResourceMessage,
    output: RemoveTagsFromResourceResponse,
    errors: [
      DBClusterNotFoundFault,
      DBInstanceNotFoundFault,
      DBSnapshotNotFoundFault,
    ],
  }),
);
/**
 * Creates a new DB parameter group.
 *
 * A DB parameter group is initially created with the default parameters for the database
 * engine used by the DB instance. To provide custom values for any of the parameters, you must
 * modify the group after creating it using *ModifyDBParameterGroup*. Once
 * you've created a DB parameter group, you need to associate it with your DB instance using
 * *ModifyDBInstance*. When you associate a new DB parameter group with a
 * running DB instance, you need to reboot the DB instance without failover for the new DB
 * parameter group and associated settings to take effect.
 *
 * After you create a DB parameter group, you should wait at least 5 minutes before
 * creating your first DB instance that uses that DB parameter group as the default parameter
 * group. This allows Amazon Neptune to fully complete the create action before the parameter
 * group is used as the default for a new DB instance. This is especially important for
 * parameters that are critical when creating the default database for a DB instance, such as
 * the character set for the default database defined by the
 * `character_set_database` parameter. You can use the Parameter
 * Groups option of the Amazon Neptune console or the
 * *DescribeDBParameters* command to verify that your DB parameter group has
 * been created or modified.
 */
export const createDBParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDBParameterGroupMessage,
    output: CreateDBParameterGroupResult,
    errors: [
      DBParameterGroupAlreadyExistsFault,
      DBParameterGroupQuotaExceededFault,
    ],
  }),
);
/**
 * Copies the specified DB cluster parameter group.
 */
export const copyDBClusterParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CopyDBClusterParameterGroupMessage,
    output: CopyDBClusterParameterGroupResult,
    errors: [
      DBParameterGroupAlreadyExistsFault,
      DBParameterGroupNotFoundFault,
      DBParameterGroupQuotaExceededFault,
    ],
  }),
);
/**
 * Copies the specified DB parameter group.
 */
export const copyDBParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CopyDBParameterGroupMessage,
    output: CopyDBParameterGroupResult,
    errors: [
      DBParameterGroupAlreadyExistsFault,
      DBParameterGroupNotFoundFault,
      DBParameterGroupQuotaExceededFault,
    ],
  }),
);
/**
 * Deletes a DB cluster snapshot. If the snapshot is being copied, the copy operation is
 * terminated.
 *
 * The DB cluster snapshot must be in the `available` state to be
 * deleted.
 */
export const deleteDBClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDBClusterSnapshotMessage,
    output: DeleteDBClusterSnapshotResult,
    errors: [
      DBClusterSnapshotNotFoundFault,
      InvalidDBClusterSnapshotStateFault,
    ],
  }),
);
/**
 * Modifies the properties of an endpoint in an Amazon Neptune DB cluster.
 */
export const modifyDBClusterEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyDBClusterEndpointMessage,
    output: ModifyDBClusterEndpointOutput,
    errors: [
      DBClusterEndpointNotFoundFault,
      DBInstanceNotFoundFault,
      InvalidDBClusterEndpointStateFault,
      InvalidDBClusterStateFault,
      InvalidDBInstanceStateFault,
    ],
  }),
);
/**
 * Initiates the failover process for a Neptune global database.
 *
 * A failover for a Neptune global database promotes one of secondary
 * read-only DB clusters to be the primary DB cluster and demotes the
 * primary DB cluster to being a secondary (read-only) DB cluster. In other
 * words, the role of the current primary DB cluster and the selected
 * target secondary DB cluster are switched. The selected secondary DB cluster
 * assumes full read/write capabilities for the Neptune global database.
 *
 * This action applies **only** to
 * Neptune global databases. This action is only intended for use on healthy
 * Neptune global databases with healthy Neptune DB clusters and no region-wide
 * outages, to test disaster recovery scenarios or to reconfigure the global
 * database topology.
 */
export const failoverGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: FailoverGlobalClusterMessage,
    output: FailoverGlobalClusterResult,
    errors: [
      DBClusterNotFoundFault,
      GlobalClusterNotFoundFault,
      InvalidDBClusterStateFault,
      InvalidGlobalClusterStateFault,
    ],
  }),
);
/**
 * Modify a setting for an Amazon Neptune global cluster. You can change one
 * or more database configuration parameters by specifying these parameters
 * and their new values in the request.
 */
export const modifyGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyGlobalClusterMessage,
  output: ModifyGlobalClusterResult,
  errors: [GlobalClusterNotFoundFault, InvalidGlobalClusterStateFault],
}));
/**
 * Detaches a Neptune DB cluster from a Neptune global database. A secondary
 * cluster becomes a normal standalone cluster with read-write capability
 * instead of being read-only, and no longer receives data from a the
 * primary cluster.
 */
export const removeFromGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveFromGlobalClusterMessage,
    output: RemoveFromGlobalClusterResult,
    errors: [
      DBClusterNotFoundFault,
      GlobalClusterNotFoundFault,
      InvalidGlobalClusterStateFault,
    ],
  }),
);
/**
 * Switches over the specified secondary DB cluster to be the new primary DB cluster in the global
 * database cluster. Switchover operations were previously called "managed planned failovers."
 *
 * Promotes the specified secondary cluster to assume full read/write capabilities and demotes the current
 * primary cluster to a secondary (read-only) cluster, maintaining the original replication topology. All secondary
 * clusters are synchronized with the primary at the beginning of the process so the new primary continues operations
 * for the global database without losing any data. Your database is unavailable for a short time while the primary
 * and selected secondary clusters are assuming their new roles.
 *
 * This operation is intended for controlled environments, for operations such as "regional rotation" or
 * to fall back to the original primary after a global database failover.
 */
export const switchoverGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SwitchoverGlobalClusterMessage,
    output: SwitchoverGlobalClusterResult,
    errors: [
      DBClusterNotFoundFault,
      GlobalClusterNotFoundFault,
      InvalidDBClusterStateFault,
      InvalidGlobalClusterStateFault,
    ],
  }),
);
/**
 * You might need to reboot your DB instance, usually for maintenance reasons. For example,
 * if you make certain modifications, or if you change the DB parameter group associated with the
 * DB instance, you must reboot the instance for the changes to take effect.
 *
 * Rebooting a DB instance restarts the database engine service. Rebooting a DB instance
 * results in a momentary outage, during which the DB instance status is set to rebooting.
 */
export const rebootDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDBInstanceMessage,
  output: RebootDBInstanceResult,
  errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
}));
/**
 * Starts an Amazon Neptune DB cluster that was stopped using the Amazon
 * console, the Amazon CLI stop-db-cluster command, or the StopDBCluster API.
 */
export const startDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDBClusterMessage,
  output: StartDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
  ],
}));
/**
 * Stops an Amazon Neptune DB cluster. When you stop a DB cluster, Neptune
 * retains the DB cluster's metadata, including its endpoints and DB parameter
 * groups.
 *
 * Neptune also retains the transaction logs so you can do a point-in-time
 * restore if necessary.
 */
export const stopDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDBClusterMessage,
  output: StopDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
  ],
}));
/**
 * Creates a new custom endpoint and associates it with an Amazon Neptune DB cluster.
 */
export const createDBClusterEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDBClusterEndpointMessage,
    output: CreateDBClusterEndpointOutput,
    errors: [
      DBClusterEndpointAlreadyExistsFault,
      DBClusterEndpointQuotaExceededFault,
      DBClusterNotFoundFault,
      DBInstanceNotFoundFault,
      InvalidDBClusterStateFault,
      InvalidDBInstanceStateFault,
    ],
  }),
);
/**
 * Creates a snapshot of a DB cluster.
 */
export const createDBClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDBClusterSnapshotMessage,
    output: CreateDBClusterSnapshotResult,
    errors: [
      DBClusterNotFoundFault,
      DBClusterSnapshotAlreadyExistsFault,
      InvalidDBClusterSnapshotStateFault,
      InvalidDBClusterStateFault,
      SnapshotQuotaExceededFault,
    ],
  }),
);
/**
 * You can call DescribeValidDBInstanceModifications
 * to learn what modifications you can make to your DB instance. You can use this
 * information when you call ModifyDBInstance.
 */
export const describeValidDBInstanceModifications =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeValidDBInstanceModificationsMessage,
    output: DescribeValidDBInstanceModificationsResult,
    errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
  }));
/**
 * Copies a snapshot of a DB cluster.
 *
 * To copy a DB cluster snapshot from a shared manual DB cluster snapshot,
 * `SourceDBClusterSnapshotIdentifier` must be the Amazon Resource Name (ARN) of the
 * shared DB cluster snapshot.
 */
export const copyDBClusterSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CopyDBClusterSnapshotMessage,
    output: CopyDBClusterSnapshotResult,
    errors: [
      DBClusterSnapshotAlreadyExistsFault,
      DBClusterSnapshotNotFoundFault,
      InvalidDBClusterSnapshotStateFault,
      InvalidDBClusterStateFault,
      KMSKeyNotAccessibleFault,
      SnapshotQuotaExceededFault,
    ],
  }),
);
/**
 * Adds an attribute and values to, or removes an attribute and values from, a manual DB
 * cluster snapshot.
 *
 * To share a manual DB cluster snapshot with other Amazon accounts, specify
 * `restore` as the `AttributeName` and use the `ValuesToAdd`
 * parameter to add a list of IDs of the Amazon accounts that are authorized to restore the manual
 * DB cluster snapshot. Use the value `all` to make the manual DB cluster snapshot
 * public, which means that it can be copied or restored by all Amazon accounts. Do not add the
 * `all` value for any manual DB cluster snapshots that contain private information
 * that you don't want available to all Amazon accounts. If a manual DB cluster snapshot is
 * encrypted, it can be shared, but only by specifying a list of authorized Amazon account IDs for
 * the `ValuesToAdd` parameter. You can't use `all` as a value for that
 * parameter in this case.
 *
 * To view which Amazon accounts have access to copy or restore a manual DB cluster snapshot, or
 * whether a manual DB cluster snapshot public or private, use the DescribeDBClusterSnapshotAttributes API action.
 */
export const modifyDBClusterSnapshotAttribute =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyDBClusterSnapshotAttributeMessage,
    output: ModifyDBClusterSnapshotAttributeResult,
    errors: [
      DBClusterSnapshotNotFoundFault,
      InvalidDBClusterSnapshotStateFault,
      SharedSnapshotQuotaExceededFault,
    ],
  }));
/**
 * The DeleteDBCluster action deletes a previously provisioned DB cluster. When you delete a
 * DB cluster, all automated backups for that DB cluster are deleted and can't be recovered.
 * Manual DB cluster snapshots of the specified DB cluster are not deleted.
 *
 * Note that the DB Cluster cannot be deleted if deletion protection is enabled. To
 * delete it, you must first set its `DeletionProtection` field to
 * `False`.
 */
export const deleteDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBClusterMessage,
  output: DeleteDBClusterResult,
  errors: [
    DBClusterNotFoundFault,
    DBClusterSnapshotAlreadyExistsFault,
    InvalidDBClusterSnapshotStateFault,
    InvalidDBClusterStateFault,
    SnapshotQuotaExceededFault,
  ],
}));
/**
 * The DeleteDBInstance action deletes a previously provisioned DB instance. When you delete
 * a DB instance, all automated backups for that instance are deleted and can't be recovered.
 * Manual DB snapshots of the DB instance to be deleted by `DeleteDBInstance` are not
 * deleted.
 *
 * If you request a final DB snapshot the status of the Amazon Neptune DB instance is
 * `deleting` until the DB snapshot is created. The API action
 * `DescribeDBInstance` is used to monitor the status of this operation. The action
 * can't be canceled or reverted once submitted.
 *
 * Note that when a DB instance is in a failure state and has a status of
 * `failed`, `incompatible-restore`, or `incompatible-network`,
 * you can only delete it when the `SkipFinalSnapshot` parameter is set to
 * `true`.
 *
 * You can't delete a DB instance if it is the only instance in the DB cluster, or
 * if it has deletion protection enabled.
 */
export const deleteDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDBInstanceMessage,
  output: DeleteDBInstanceResult,
  errors: [
    DBInstanceNotFoundFault,
    DBSnapshotAlreadyExistsFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    SnapshotQuotaExceededFault,
  ],
}));
/**
 * Creates a new DB subnet group. DB subnet groups must contain at least one subnet in at
 * least two AZs in the Amazon Region.
 */
export const createDBSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBSubnetGroupMessage,
  output: CreateDBSubnetGroupResult,
  errors: [
    DBSubnetGroupAlreadyExistsFault,
    DBSubnetGroupDoesNotCoverEnoughAZs,
    DBSubnetGroupQuotaExceededFault,
    DBSubnetQuotaExceededFault,
    InvalidSubnet,
  ],
}));
/**
 * Creates a Neptune global database spread across multiple Amazon Regions.
 * The global database contains a single primary cluster with read-write
 * capability, and read-only secondary clusters that receive data from the
 * primary cluster through high-speed replication performed by the Neptune
 * storage subsystem.
 *
 * You can create a global database that is initially empty, and then
 * add a primary cluster and secondary clusters to it, or you can specify
 * an existing Neptune cluster during the create operation to become the
 * primary cluster of the global database.
 */
export const createGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGlobalClusterMessage,
  output: CreateGlobalClusterResult,
  errors: [
    DBClusterNotFoundFault,
    GlobalClusterAlreadyExistsFault,
    GlobalClusterQuotaExceededFault,
    InvalidDBClusterStateFault,
  ],
}));
/**
 * Modifies an existing DB subnet group. DB subnet groups must contain at least one subnet in
 * at least two AZs in the Amazon Region.
 */
export const modifyDBSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBSubnetGroupMessage,
  output: ModifyDBSubnetGroupResult,
  errors: [
    DBSubnetGroupDoesNotCoverEnoughAZs,
    DBSubnetGroupNotFoundFault,
    DBSubnetQuotaExceededFault,
    InvalidSubnet,
    SubnetAlreadyInUse,
  ],
}));
/**
 * Modifies an existing event notification subscription. Note that you can't modify the
 * source identifiers using this call; to change source identifiers for a subscription, use the
 * AddSourceIdentifierToSubscription and RemoveSourceIdentifierFromSubscription calls.
 *
 * You can see a list of the event categories for a given SourceType
 * by using the **DescribeEventCategories** action.
 */
export const modifyEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyEventSubscriptionMessage,
    output: ModifyEventSubscriptionResult,
    errors: [
      EventSubscriptionQuotaExceededFault,
      SNSInvalidTopicFault,
      SNSNoAuthorizationFault,
      SNSTopicArnNotFoundFault,
      SubscriptionCategoryNotFoundFault,
      SubscriptionNotFoundFault,
    ],
  }),
);
/**
 * Creates an event notification subscription. This action requires a topic ARN (Amazon
 * Resource Name) created by either the Neptune console, the SNS console, or the SNS API. To
 * obtain an ARN with SNS, you must create a topic in Amazon SNS and subscribe to the topic. The
 * ARN is displayed in the SNS console.
 *
 * You can specify the type of source (SourceType) you want to be notified of, provide a list
 * of Neptune sources (SourceIds) that triggers the events, and provide a list of event
 * categories (EventCategories) for events you want to be notified of. For example, you can
 * specify SourceType = db-instance, SourceIds = mydbinstance1, mydbinstance2 and EventCategories
 * = Availability, Backup.
 *
 * If you specify both the SourceType and SourceIds, such as SourceType = db-instance and
 * SourceIdentifier = myDBInstance1, you are notified of all the db-instance events for the
 * specified source. If you specify a SourceType but do not specify a SourceIdentifier, you
 * receive notice of the events for that source type for all your Neptune sources. If you do not
 * specify either the SourceType nor the SourceIdentifier, you are notified of events generated
 * from all Neptune sources belonging to your customer account.
 */
export const createEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEventSubscriptionMessage,
    output: CreateEventSubscriptionResult,
    errors: [
      EventSubscriptionQuotaExceededFault,
      SNSInvalidTopicFault,
      SNSNoAuthorizationFault,
      SNSTopicArnNotFoundFault,
      SourceNotFoundFault,
      SubscriptionAlreadyExistFault,
      SubscriptionCategoryNotFoundFault,
    ],
  }),
);
/**
 * Creates a new Amazon Neptune DB cluster.
 *
 * You can use the `ReplicationSourceIdentifier` parameter to create the DB
 * cluster as a Read Replica of another DB cluster or Amazon Neptune DB instance.
 *
 * Note that when you create a new cluster using `CreateDBCluster` directly,
 * deletion protection is disabled by default (when you create a new production cluster in
 * the console, deletion protection is enabled by default). You can only delete a DB
 * cluster if its `DeletionProtection` field is set to `false`.
 */
export const createDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBClusterMessage,
  output: CreateDBClusterResult,
  errors: [
    DBClusterAlreadyExistsFault,
    DBClusterNotFoundFault,
    DBClusterParameterGroupNotFoundFault,
    DBClusterQuotaExceededFault,
    DBInstanceNotFoundFault,
    DBSubnetGroupDoesNotCoverEnoughAZs,
    DBSubnetGroupNotFoundFault,
    GlobalClusterNotFoundFault,
    InsufficientStorageClusterCapacityFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    InvalidDBSubnetGroupStateFault,
    InvalidGlobalClusterStateFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    StorageQuotaExceededFault,
  ],
}));
/**
 * Modify a setting for a DB cluster. You can change one or more database configuration
 * parameters by specifying these parameters and the new values in the request.
 */
export const modifyDBCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBClusterMessage,
  output: ModifyDBClusterResult,
  errors: [
    DBClusterAlreadyExistsFault,
    DBClusterNotFoundFault,
    DBClusterParameterGroupNotFoundFault,
    DBSubnetGroupNotFoundFault,
    InvalidDBClusterStateFault,
    InvalidDBInstanceStateFault,
    InvalidDBSecurityGroupStateFault,
    InvalidDBSubnetGroupStateFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
  ],
}));
/**
 * Restores a DB cluster to an arbitrary point in time. Users can restore to any point in
 * time before `LatestRestorableTime` for up to `BackupRetentionPeriod`
 * days. The target DB cluster is created from the source DB cluster with the same configuration
 * as the original DB cluster, except that the new DB cluster is created with the default DB
 * security group.
 *
 * This action only restores the DB cluster, not the DB instances for that DB cluster. You
 * must invoke the CreateDBInstance action to create DB instances for the
 * restored DB cluster, specifying the identifier of the restored DB cluster in
 * `DBClusterIdentifier`. You can create DB instances only after the
 * `RestoreDBClusterToPointInTime` action has completed and the DB cluster is
 * available.
 */
export const restoreDBClusterToPointInTime =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RestoreDBClusterToPointInTimeMessage,
    output: RestoreDBClusterToPointInTimeResult,
    errors: [
      DBClusterAlreadyExistsFault,
      DBClusterNotFoundFault,
      DBClusterParameterGroupNotFoundFault,
      DBClusterQuotaExceededFault,
      DBClusterSnapshotNotFoundFault,
      DBSubnetGroupNotFoundFault,
      InsufficientDBClusterCapacityFault,
      InsufficientStorageClusterCapacityFault,
      InvalidDBClusterSnapshotStateFault,
      InvalidDBClusterStateFault,
      InvalidDBSnapshotStateFault,
      InvalidRestoreFault,
      InvalidSubnet,
      InvalidVPCNetworkStateFault,
      KMSKeyNotAccessibleFault,
      OptionGroupNotFoundFault,
      StorageQuotaExceededFault,
    ],
  }));
/**
 * Creates a new DB cluster from a DB snapshot or DB cluster snapshot.
 *
 * If a DB snapshot is specified, the target DB cluster is created from the source DB
 * snapshot with a default configuration and default security group.
 *
 * If a DB cluster snapshot is specified, the target DB cluster is created from the source DB
 * cluster restore point with the same configuration as the original source DB cluster, except
 * that the new DB cluster is created with the default security group.
 */
export const restoreDBClusterFromSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RestoreDBClusterFromSnapshotMessage,
    output: RestoreDBClusterFromSnapshotResult,
    errors: [
      DBClusterAlreadyExistsFault,
      DBClusterParameterGroupNotFoundFault,
      DBClusterQuotaExceededFault,
      DBClusterSnapshotNotFoundFault,
      DBSnapshotNotFoundFault,
      DBSubnetGroupNotFoundFault,
      InsufficientDBClusterCapacityFault,
      InsufficientStorageClusterCapacityFault,
      InvalidDBClusterSnapshotStateFault,
      InvalidDBSnapshotStateFault,
      InvalidRestoreFault,
      InvalidSubnet,
      InvalidVPCNetworkStateFault,
      KMSKeyNotAccessibleFault,
      OptionGroupNotFoundFault,
      StorageQuotaExceededFault,
    ],
  }));
/**
 * Modifies settings for a DB instance. You can change one or more database configuration
 * parameters by specifying these parameters and the new values in the request. To learn what
 * modifications you can make to your DB instance, call DescribeValidDBInstanceModifications before you call ModifyDBInstance.
 */
export const modifyDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDBInstanceMessage,
  output: ModifyDBInstanceResult,
  errors: [
    AuthorizationNotFoundFault,
    CertificateNotFoundFault,
    DBInstanceAlreadyExistsFault,
    DBInstanceNotFoundFault,
    DBParameterGroupNotFoundFault,
    DBSecurityGroupNotFoundFault,
    DBUpgradeDependencyFailureFault,
    DomainNotFoundFault,
    InsufficientDBInstanceCapacityFault,
    InvalidDBInstanceStateFault,
    InvalidDBSecurityGroupStateFault,
    InvalidVPCNetworkStateFault,
    OptionGroupNotFoundFault,
    ProvisionedIopsNotAvailableInAZFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
  ],
}));
/**
 * Creates a new DB instance.
 */
export const createDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDBInstanceMessage,
  output: CreateDBInstanceResult,
  errors: [
    AuthorizationNotFoundFault,
    DBClusterNotFoundFault,
    DBInstanceAlreadyExistsFault,
    DBParameterGroupNotFoundFault,
    DBSecurityGroupNotFoundFault,
    DBSubnetGroupDoesNotCoverEnoughAZs,
    DBSubnetGroupNotFoundFault,
    DomainNotFoundFault,
    InstanceQuotaExceededFault,
    InsufficientDBInstanceCapacityFault,
    InvalidDBClusterStateFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    OptionGroupNotFoundFault,
    ProvisionedIopsNotAvailableInAZFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
  ],
}));

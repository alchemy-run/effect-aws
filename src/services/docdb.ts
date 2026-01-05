import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://rds.amazonaws.com/doc/2014-10-31/");
const svc = T.AwsApiService({
  sdkId: "DocDB",
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
    DBInstanceIdentifier: S.String,
    DBInstanceClass: S.String,
    Engine: S.String,
    AvailabilityZone: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    DBClusterIdentifier: S.String,
    CopyTagsToSnapshot: S.optional(S.Boolean),
    PromotionTier: S.optional(S.Number),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    CACertificateIdentifier: S.optional(S.String),
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
    DatabaseName: S.optional(S.String),
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
  { DBInstanceIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
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
    Filters: S.optional(FilterList),
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
export class ModifyDBInstanceMessage extends S.Class<ModifyDBInstanceMessage>(
  "ModifyDBInstanceMessage",
)(
  {
    DBInstanceIdentifier: S.String,
    DBInstanceClass: S.optional(S.String),
    ApplyImmediately: S.optional(S.Boolean),
    PreferredMaintenanceWindow: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    NewDBInstanceIdentifier: S.optional(S.String),
    CACertificateIdentifier: S.optional(S.String),
    CopyTagsToSnapshot: S.optional(S.Boolean),
    PromotionTier: S.optional(S.Number),
    EnablePerformanceInsights: S.optional(S.Boolean),
    PerformanceInsightsKMSKeyId: S.optional(S.String),
    CertificateRotationRestart: S.optional(S.Boolean),
  },
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
  },
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
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
    DBClusterParameterGroupName: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    StorageType: S.optional(S.String),
    NetworkType: S.optional(S.String),
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
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    StorageType: S.optional(S.String),
    NetworkType: S.optional(S.String),
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
}) {}
export const DBClusterRoles = S.Array(
  DBClusterRole.pipe(T.XmlName("DBClusterRole")),
);
export class ServerlessV2ScalingConfigurationInfo extends S.Class<ServerlessV2ScalingConfigurationInfo>(
  "ServerlessV2ScalingConfigurationInfo",
)({ MinCapacity: S.optional(S.Number), MaxCapacity: S.optional(S.Number) }) {}
export class ClusterMasterUserSecret extends S.Class<ClusterMasterUserSecret>(
  "ClusterMasterUserSecret",
)({
  SecretArn: S.optional(S.String),
  SecretStatus: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
}) {}
export class DBCluster extends S.Class<DBCluster>("DBCluster")({
  AvailabilityZones: S.optional(AvailabilityZones),
  BackupRetentionPeriod: S.optional(S.Number),
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
  CloneGroupId: S.optional(S.String),
  ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EnabledCloudwatchLogsExports: S.optional(LogTypeList),
  DeletionProtection: S.optional(S.Boolean),
  IOOptimizedNextAllowedModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  StorageType: S.optional(S.String),
  ServerlessV2ScalingConfiguration: S.optional(
    ServerlessV2ScalingConfigurationInfo,
  ),
  MasterUserSecret: S.optional(ClusterMasterUserSecret),
  NetworkType: S.optional(S.String),
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
  Status: S.optional(S.String),
  Port: S.optional(S.Number),
  VpcId: S.optional(S.String),
  ClusterCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  MasterUsername: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  SnapshotType: S.optional(S.String),
  PercentProgress: S.optional(S.Number),
  StorageEncrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  DBClusterSnapshotArn: S.optional(S.String),
  SourceDBClusterSnapshotArn: S.optional(S.String),
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
export class AvailabilityZone extends S.Class<AvailabilityZone>(
  "AvailabilityZone",
)({ Name: S.optional(S.String) }) {}
export class Subnet extends S.Class<Subnet>("Subnet")({
  SubnetIdentifier: S.optional(S.String),
  SubnetAvailabilityZone: S.optional(AvailabilityZone),
  SubnetStatus: S.optional(S.String),
}) {}
export const SubnetList = S.Array(Subnet.pipe(T.XmlName("Subnet")));
export const NetworkTypeList = S.Array(S.String);
export class DBSubnetGroup extends S.Class<DBSubnetGroup>("DBSubnetGroup")({
  DBSubnetGroupName: S.optional(S.String),
  DBSubnetGroupDescription: S.optional(S.String),
  VpcId: S.optional(S.String),
  SubnetGroupStatus: S.optional(S.String),
  Subnets: S.optional(SubnetList),
  DBSubnetGroupArn: S.optional(S.String),
  SupportedNetworkTypes: S.optional(NetworkTypeList),
}) {}
export class PendingCloudwatchLogsExports extends S.Class<PendingCloudwatchLogsExports>(
  "PendingCloudwatchLogsExports",
)({
  LogTypesToEnable: S.optional(LogTypeList),
  LogTypesToDisable: S.optional(LogTypeList),
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
export class CertificateDetails extends S.Class<CertificateDetails>(
  "CertificateDetails",
)({
  CAIdentifier: S.optional(S.String),
  ValidTill: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class DBInstance extends S.Class<DBInstance>("DBInstance")({
  DBInstanceIdentifier: S.optional(S.String),
  DBInstanceClass: S.optional(S.String),
  Engine: S.optional(S.String),
  DBInstanceStatus: S.optional(S.String),
  Endpoint: S.optional(Endpoint),
  InstanceCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PreferredBackupWindow: S.optional(S.String),
  BackupRetentionPeriod: S.optional(S.Number),
  VpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
  AvailabilityZone: S.optional(S.String),
  DBSubnetGroup: S.optional(DBSubnetGroup),
  PreferredMaintenanceWindow: S.optional(S.String),
  PendingModifiedValues: S.optional(PendingModifiedValues),
  LatestRestorableTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EngineVersion: S.optional(S.String),
  AutoMinorVersionUpgrade: S.optional(S.Boolean),
  PubliclyAccessible: S.optional(S.Boolean),
  StatusInfos: S.optional(DBInstanceStatusInfoList),
  DBClusterIdentifier: S.optional(S.String),
  StorageEncrypted: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  DbiResourceId: S.optional(S.String),
  CACertificateIdentifier: S.optional(S.String),
  CopyTagsToSnapshot: S.optional(S.Boolean),
  PromotionTier: S.optional(S.Number),
  DBInstanceArn: S.optional(S.String),
  EnabledCloudwatchLogsExports: S.optional(LogTypeList),
  CertificateDetails: S.optional(CertificateDetails),
  PerformanceInsightsEnabled: S.optional(S.Boolean),
  PerformanceInsightsKMSKeyId: S.optional(S.String),
}) {}
export const DBInstanceList = S.Array(DBInstance.pipe(T.XmlName("DBInstance")));
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
  SynchronizationStatus: S.optional(S.String),
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
  DatabaseName: S.optional(S.String),
  StorageEncrypted: S.optional(S.Boolean),
  DeletionProtection: S.optional(S.Boolean),
  GlobalClusterMembers: S.optional(GlobalClusterMemberList),
  FailoverState: S.optional(FailoverState),
  TagList: S.optional(TagList),
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
export class CloudwatchLogsExportConfiguration extends S.Class<CloudwatchLogsExportConfiguration>(
  "CloudwatchLogsExportConfiguration",
)({
  EnableLogTypes: S.optional(LogTypeList),
  DisableLogTypes: S.optional(LogTypeList),
}) {}
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
    DBClusterIdentifier: S.String,
    DBClusterParameterGroupName: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    DBSubnetGroupName: S.optional(S.String),
    Engine: S.String,
    EngineVersion: S.optional(S.String),
    Port: S.optional(S.Number),
    MasterUsername: S.optional(S.String),
    MasterUserPassword: S.optional(S.String),
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    Tags: S.optional(TagList),
    StorageEncrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    PreSignedUrl: S.optional(S.String),
    EnableCloudwatchLogsExports: S.optional(LogTypeList),
    DeletionProtection: S.optional(S.Boolean),
    GlobalClusterIdentifier: S.optional(S.String),
    StorageType: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    ManageMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    NetworkType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDBClusterParameterGroupResult extends S.Class<CreateDBClusterParameterGroupResult>(
  "CreateDBClusterParameterGroupResult",
)({ DBClusterParameterGroup: S.optional(DBClusterParameterGroup) }, ns) {}
export class CreateDBClusterSnapshotResult extends S.Class<CreateDBClusterSnapshotResult>(
  "CreateDBClusterSnapshotResult",
)({ DBClusterSnapshot: S.optional(DBClusterSnapshot) }, ns) {}
export class CreateEventSubscriptionResult extends S.Class<CreateEventSubscriptionResult>(
  "CreateEventSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
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
export class DescribeCertificatesMessage extends S.Class<DescribeCertificatesMessage>(
  "DescribeCertificatesMessage",
)(
  {
    CertificateIdentifier: S.optional(S.String),
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
export class DBSubnetGroupMessage extends S.Class<DBSubnetGroupMessage>(
  "DBSubnetGroupMessage",
)(
  { Marker: S.optional(S.String), DBSubnetGroups: S.optional(DBSubnetGroups) },
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
    PreferredBackupWindow: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    CloudwatchLogsExportConfiguration: S.optional(
      CloudwatchLogsExportConfiguration,
    ),
    EngineVersion: S.optional(S.String),
    AllowMajorVersionUpgrade: S.optional(S.Boolean),
    DeletionProtection: S.optional(S.Boolean),
    StorageType: S.optional(S.String),
    ServerlessV2ScalingConfiguration: S.optional(
      ServerlessV2ScalingConfiguration,
    ),
    ManageMasterUserPassword: S.optional(S.Boolean),
    MasterUserSecretKmsKeyId: S.optional(S.String),
    RotateMasterUserPassword: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
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
export class ModifyDBSubnetGroupResult extends S.Class<ModifyDBSubnetGroupResult>(
  "ModifyDBSubnetGroupResult",
)({ DBSubnetGroup: S.optional(DBSubnetGroup) }, ns) {}
export class ModifyEventSubscriptionResult extends S.Class<ModifyEventSubscriptionResult>(
  "ModifyEventSubscriptionResult",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class ModifyGlobalClusterResult extends S.Class<ModifyGlobalClusterResult>(
  "ModifyGlobalClusterResult",
)({ GlobalCluster: S.optional(GlobalCluster) }, ns) {}
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
export const CACertificateIdentifiersList = S.Array(S.String);
export class EngineDefaults extends S.Class<EngineDefaults>("EngineDefaults")({
  DBParameterGroupFamily: S.optional(S.String),
  Marker: S.optional(S.String),
  Parameters: S.optional(ParametersList),
}) {}
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
}) {}
export const ValidUpgradeTargetList = S.Array(
  UpgradeTarget.pipe(T.XmlName("UpgradeTarget")),
);
export class ServerlessV2FeaturesSupport extends S.Class<ServerlessV2FeaturesSupport>(
  "ServerlessV2FeaturesSupport",
)({ MinCapacity: S.optional(S.Number), MaxCapacity: S.optional(S.Number) }) {}
export const AvailabilityZoneList = S.Array(
  AvailabilityZone.pipe(T.XmlName("AvailabilityZone")),
);
export class Certificate extends S.Class<Certificate>("Certificate")({
  CertificateIdentifier: S.optional(S.String),
  CertificateType: S.optional(S.String),
  Thumbprint: S.optional(S.String),
  ValidFrom: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ValidTill: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CertificateArn: S.optional(S.String),
}) {}
export const CertificateList = S.Array(
  Certificate.pipe(T.XmlName("Certificate")),
);
export class DBEngineVersion extends S.Class<DBEngineVersion>(
  "DBEngineVersion",
)({
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  DBParameterGroupFamily: S.optional(S.String),
  DBEngineDescription: S.optional(S.String),
  DBEngineVersionDescription: S.optional(S.String),
  ValidUpgradeTarget: S.optional(ValidUpgradeTargetList),
  ExportableLogTypes: S.optional(LogTypeList),
  SupportsLogExportsToCloudwatchLogs: S.optional(S.Boolean),
  SupportedCACertificateIdentifiers: S.optional(CACertificateIdentifiersList),
  SupportsCertificateRotationWithoutRestart: S.optional(S.Boolean),
  ServerlessV2FeaturesSupport: S.optional(ServerlessV2FeaturesSupport),
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
  Vpc: S.optional(S.Boolean),
  StorageType: S.optional(S.String),
}) {}
export const OrderableDBInstanceOptionsList = S.Array(
  OrderableDBInstanceOption.pipe(T.XmlName("OrderableDBInstanceOption")),
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
export class CertificateMessage extends S.Class<CertificateMessage>(
  "CertificateMessage",
)(
  { Certificates: S.optional(CertificateList), Marker: S.optional(S.String) },
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
export class CreateDBInstanceResult extends S.Class<CreateDBInstanceResult>(
  "CreateDBInstanceResult",
)({ DBInstance: S.optional(DBInstance) }, ns) {}

//# Errors
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
export class DBClusterNotFoundFault extends S.TaggedError<DBClusterNotFoundFault>()(
  "DBClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBClusterNotFoundFault", httpResponseCode: 404 }),
) {}
export class DBParameterGroupAlreadyExistsFault extends S.TaggedError<DBParameterGroupAlreadyExistsFault>()(
  "DBParameterGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBParameterGroupAlreadyExists",
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
export class DBInstanceNotFoundFault extends S.TaggedError<DBInstanceNotFoundFault>()(
  "DBInstanceNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBInstanceNotFound", httpResponseCode: 404 }),
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
export class InvalidDBClusterStateFault extends S.TaggedError<InvalidDBClusterStateFault>()(
  "InvalidDBClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterStateFault",
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
export class DBParameterGroupQuotaExceededFault extends S.TaggedError<DBParameterGroupQuotaExceededFault>()(
  "DBParameterGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class SNSInvalidTopicFault extends S.TaggedError<SNSInvalidTopicFault>()(
  "SNSInvalidTopicFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SNSInvalidTopic", httpResponseCode: 400 }),
) {}
export class InvalidDBClusterSnapshotStateFault extends S.TaggedError<InvalidDBClusterSnapshotStateFault>()(
  "InvalidDBClusterSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidDBClusterSnapshotStateFault",
    httpResponseCode: 400,
  }),
) {}
export class DBSnapshotAlreadyExistsFault extends S.TaggedError<DBSnapshotAlreadyExistsFault>()(
  "DBSnapshotAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSnapshotAlreadyExists", httpResponseCode: 400 }),
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
export class DBClusterQuotaExceededFault extends S.TaggedError<DBClusterQuotaExceededFault>()(
  "DBClusterQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterQuotaExceededFault",
    httpResponseCode: 403,
  }),
) {}
export class InvalidDBInstanceStateFault extends S.TaggedError<InvalidDBInstanceStateFault>()(
  "InvalidDBInstanceStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBInstanceState", httpResponseCode: 400 }),
) {}
export class DBSnapshotNotFoundFault extends S.TaggedError<DBSnapshotNotFoundFault>()(
  "DBSnapshotNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DBSnapshotNotFound", httpResponseCode: 404 }),
) {}
export class DBClusterParameterGroupNotFoundFault extends S.TaggedError<DBClusterParameterGroupNotFoundFault>()(
  "DBClusterParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DBClusterParameterGroupNotFound",
    httpResponseCode: 404,
  }),
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
export class SharedSnapshotQuotaExceededFault extends S.TaggedError<SharedSnapshotQuotaExceededFault>()(
  "SharedSnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SharedSnapshotQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotQuotaExceededFault extends S.TaggedError<SnapshotQuotaExceededFault>()(
  "SnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SnapshotQuotaExceeded", httpResponseCode: 400 }),
) {}
export class KMSKeyNotAccessibleFault extends S.TaggedError<KMSKeyNotAccessibleFault>()(
  "KMSKeyNotAccessibleFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "KMSKeyNotAccessibleFault", httpResponseCode: 400 }),
) {}
export class InsufficientStorageClusterCapacityFault extends S.TaggedError<InsufficientStorageClusterCapacityFault>()(
  "InsufficientStorageClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientStorageClusterCapacity",
    httpResponseCode: 400,
  }),
) {}
export class InsufficientDBClusterCapacityFault extends S.TaggedError<InsufficientDBClusterCapacityFault>()(
  "InsufficientDBClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientDBClusterCapacityFault",
    httpResponseCode: 403,
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
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidDBSnapshotStateFault extends S.TaggedError<InvalidDBSnapshotStateFault>()(
  "InvalidDBSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDBSnapshotState", httpResponseCode: 400 }),
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
export class InstanceQuotaExceededFault extends S.TaggedError<InstanceQuotaExceededFault>()(
  "InstanceQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InstanceQuotaExceeded", httpResponseCode: 400 }),
) {}
export class NetworkTypeNotSupported extends S.TaggedError<NetworkTypeNotSupported>()(
  "NetworkTypeNotSupported",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NetworkTypeNotSupported", httpResponseCode: 400 }),
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
export class StorageQuotaExceededFault extends S.TaggedError<StorageQuotaExceededFault>()(
  "StorageQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StorageQuotaExceeded", httpResponseCode: 400 }),
) {}
export class StorageTypeNotSupportedFault extends S.TaggedError<StorageTypeNotSupportedFault>()(
  "StorageTypeNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "StorageTypeNotSupported", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * Returns a list of `DBClusterParameterGroup` descriptions. If a `DBClusterParameterGroupName` parameter is specified, the list contains only the description of the specified cluster parameter group.
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
 * Returns the detailed parameter list for a particular cluster parameter
 * group.
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
 * Returns a list of `DBSubnetGroup` descriptions. If a
 * `DBSubnetGroupName` is specified, the list will contain only the descriptions of the specified `DBSubnetGroup`.
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
 * Returns information about provisioned Amazon DocumentDB clusters. This API
 * operation supports pagination. For certain management features
 * such as cluster and instance lifecycle management, Amazon DocumentDB leverages
 * operational technology that is shared with Amazon RDS and Amazon
 * Neptune. Use the `filterName=engine,Values=docdb` filter
 * parameter to return only Amazon DocumentDB clusters.
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
 * Deletes a specified cluster parameter group. The cluster parameter group to be deleted can't be associated with any clusters.
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
 * Returns events related to instances, security groups, snapshots, and DB parameter groups for the past 14 days. You can obtain events specific to a particular DB instance, security group, snapshot, or parameter group by providing the name as a parameter. By default, the events of the past hour are returned.
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
 * Lists all the subscription descriptions for a customer account. The description for a subscription includes `SubscriptionName`, `SNSTopicARN`, `CustomerID`, `SourceType`, `SourceID`, `CreationTime`, and `Status`.
 *
 * If you specify a `SubscriptionName`, lists the description for that subscription.
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
 * Returns a list of resources (for example, instances) that have at least one pending
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
 * Removes a source identifier from an existing Amazon DocumentDB event notification
 * subscription.
 */
export const removeSourceIdentifierFromSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RemoveSourceIdentifierFromSubscriptionMessage,
    output: RemoveSourceIdentifierFromSubscriptionResult,
    errors: [SourceNotFoundFault, SubscriptionNotFoundFault],
  }));
/**
 * Modifies the parameters of a cluster parameter group. To modify more than one
 * parameter, submit a list of the following: `ParameterName`,
 * `ParameterValue`, and `ApplyMethod`. A maximum of 20
 * parameters can be modified in a single request.
 *
 * Changes to dynamic parameters are applied immediately. Changes to static
 * parameters require a reboot or maintenance window
 *
 * before the change can take effect.
 *
 * After you create a cluster parameter group, you should wait at least 5 minutes
 * before creating your first cluster that uses that cluster parameter group as
 * the default parameter group. This allows Amazon DocumentDB to fully complete the create action
 * before the parameter group is used as the default for a new cluster. This step is
 * especially important for parameters that are critical when creating the default
 * database for a cluster, such as the character set for the default database
 * defined by the `character_set_database` parameter.
 */
export const modifyDBClusterParameterGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyDBClusterParameterGroupMessage,
    output: DBClusterParameterGroupNameMessage,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }));
/**
 * Modifies the parameters of a cluster parameter group to the default value. To
 * reset specific parameters, submit a list of the following: `ParameterName`
 * and `ApplyMethod`. To reset the entire cluster parameter group, specify
 * the `DBClusterParameterGroupName` and `ResetAllParameters`
 * parameters.
 *
 * When you reset the entire group, dynamic parameters are updated immediately and
 * static parameters are set to `pending-reboot` to take effect on the next DB
 * instance reboot.
 */
export const resetDBClusterParameterGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ResetDBClusterParameterGroupMessage,
    output: DBClusterParameterGroupNameMessage,
    errors: [DBParameterGroupNotFoundFault, InvalidDBParameterGroupStateFault],
  }));
/**
 * Returns information about cluster snapshots. This API operation supports pagination.
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
 * Returns information about provisioned Amazon DocumentDB instances. This API supports pagination.
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
 * Returns information about Amazon DocumentDB global clusters. This API supports pagination.
 *
 * This action only applies to Amazon DocumentDB clusters.
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
 * Deletes an Amazon DocumentDB event notification subscription.
 */
export const deleteEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEventSubscriptionMessage,
    output: DeleteEventSubscriptionResult,
    errors: [InvalidEventSubscriptionStateFault, SubscriptionNotFoundFault],
  }),
);
/**
 * Adds a source identifier to an existing event notification
 * subscription.
 */
export const addSourceIdentifierToSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AddSourceIdentifierToSubscriptionMessage,
    output: AddSourceIdentifierToSubscriptionResult,
    errors: [SourceNotFoundFault, SubscriptionNotFoundFault],
  }));
/**
 * Creates a new cluster parameter group.
 *
 * Parameters in a cluster parameter group apply to all of the
 * instances in a cluster.
 *
 * A cluster parameter group is initially created with the default
 * parameters for the database engine used by instances in the cluster.
 * In Amazon DocumentDB, you cannot make modifications directly to the
 * `default.docdb3.6` cluster parameter group. If your
 * Amazon DocumentDB cluster is using the default cluster parameter group and you
 * want to modify a value in it, you must first
 * create a new parameter group
 * or
 * copy an existing parameter group,
 * modify it, and then apply the modified parameter group to your
 * cluster. For the new cluster parameter group and associated settings
 * to take effect, you must then reboot the instances in the cluster
 * without failover. For more information,
 * see
 * Modifying Amazon DocumentDB Cluster Parameter Groups.
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
 * Deletes a cluster snapshot. If the snapshot is being copied, the copy operation is terminated.
 *
 * The cluster snapshot must be in the `available` state to be deleted.
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
 * Deletes a subnet group.
 *
 * The specified database subnet group must not be associated with any DB
 * instances.
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
 * Deletes a global cluster. The primary and secondary clusters must already be detached or deleted before attempting to delete a global cluster.
 *
 * This action only applies to Amazon DocumentDB clusters.
 */
export const deleteGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlobalClusterMessage,
  output: DeleteGlobalClusterResult,
  errors: [GlobalClusterNotFoundFault, InvalidGlobalClusterStateFault],
}));
/**
 * Returns a list of cluster snapshot attribute names and values for a manual DB
 * cluster snapshot.
 *
 * When you share snapshots with other Amazon Web Services accounts,
 * `DescribeDBClusterSnapshotAttributes` returns the `restore` attribute and a list of IDs for the Amazon Web Services accounts that are authorized to copy or restore the manual cluster snapshot. If `all` is included in the list of values for the `restore` attribute, then the manual cluster snapshot is public and can be copied or restored by all Amazon Web Services accounts.
 */
export const describeDBClusterSnapshotAttributes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDBClusterSnapshotAttributesMessage,
    output: DescribeDBClusterSnapshotAttributesResult,
    errors: [DBClusterSnapshotNotFoundFault],
  }));
/**
 * Returns a list of the available engines.
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
 * Returns a list of orderable instance options for the specified engine.
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
 * Restarts the stopped cluster that is specified by `DBClusterIdentifier`.
 * For more information, see Stopping and
 * Starting an Amazon DocumentDB Cluster.
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
 * Copies the specified cluster parameter group.
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
 * Removes metadata tags from an Amazon DocumentDB resource.
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
 * Modify a setting for an Amazon DocumentDB global cluster. You can change one or more configuration parameters (for example: deletion protection), or the global cluster identifier by specifying these parameters and the new values in the request.
 *
 * This action only applies to Amazon DocumentDB clusters.
 */
export const modifyGlobalCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyGlobalClusterMessage,
  output: ModifyGlobalClusterResult,
  errors: [GlobalClusterNotFoundFault, InvalidGlobalClusterStateFault],
}));
/**
 * Switches over the specified secondary Amazon DocumentDB cluster to be the new primary Amazon DocumentDB cluster in the global database cluster.
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
 * Promotes the specified secondary DB cluster to be the primary DB cluster in the global cluster when failing over a global cluster occurs.
 *
 * Use this operation to respond to an unplanned event, such as a regional disaster in the primary region.
 * Failing over can result in a loss of write transaction data that wasn't replicated to the chosen secondary before the failover event occurred.
 * However, the recovery process that promotes a DB instance on the chosen seconday DB cluster to be the primary writer DB instance guarantees that the data is in a transactionally consistent state.
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
 * Detaches an Amazon DocumentDB secondary cluster from a global cluster. The cluster becomes a standalone cluster with read-write capability instead of being read-only and receiving data from a primary in a different region.
 *
 * This action only applies to Amazon DocumentDB clusters.
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
 * Returns a list of certificate authority (CA) certificates provided by Amazon DocumentDB for this Amazon Web Services account.
 */
export const describeCertificates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeCertificatesMessage,
    output: CertificateMessage,
    errors: [CertificateNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "Certificates",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * You might need to reboot your instance, usually for maintenance reasons. For
 * example, if you make certain changes, or if you change the cluster parameter group
 * that is associated with the instance, you must reboot the instance for the changes to
 * take effect.
 *
 * Rebooting an instance restarts the database engine service. Rebooting an instance
 * results in a momentary outage, during which the instance status is set to
 * *rebooting*.
 */
export const rebootDBInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootDBInstanceMessage,
  output: RebootDBInstanceResult,
  errors: [DBInstanceNotFoundFault, InvalidDBInstanceStateFault],
}));
/**
 * Stops the running cluster that is specified by `DBClusterIdentifier`. The
 * cluster must be in the *available* state. For more information, see
 * Stopping and
 * Starting an Amazon DocumentDB Cluster.
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
 * Forces a failover for a cluster.
 *
 * A failover for a cluster promotes one of the Amazon DocumentDB replicas (read-only instances) in the cluster to be the primary instance (the cluster writer).
 *
 * If the primary instance fails, Amazon DocumentDB automatically fails over to an Amazon DocumentDB replica, if one exists. You can force a failover when you want to simulate a failure of a primary instance for testing.
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
 * Applies a pending maintenance action to a resource (for example,
 * to an Amazon DocumentDB instance).
 */
export const applyPendingMaintenanceAction =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ApplyPendingMaintenanceActionMessage,
    output: ApplyPendingMaintenanceActionResult,
    errors: [
      InvalidDBClusterStateFault,
      InvalidDBInstanceStateFault,
      ResourceNotFoundFault,
    ],
  }));
/**
 * Adds metadata tags to an Amazon DocumentDB resource. You can use these tags
 * with cost allocation reporting to track costs that are associated
 * with Amazon DocumentDB resources or in a `Condition` statement in
 * an Identity and Access Management (IAM) policy for Amazon DocumentDB.
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
 * Lists all tags on an Amazon DocumentDB resource.
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
 * Adds an attribute and values to, or removes an attribute and values from, a manual cluster snapshot.
 *
 * To share a manual cluster snapshot with other Amazon Web Services accounts, specify `restore` as the `AttributeName`, and use the `ValuesToAdd` parameter to add a list of IDs of the Amazon Web Services accounts that are authorized to restore the manual cluster snapshot. Use the value `all` to make the manual cluster snapshot public, which means that it can be copied or restored by all Amazon Web Services accounts. Do not add the `all` value for any manual cluster snapshots that contain private information that you don't want available to all Amazon Web Services accounts. If a manual cluster snapshot is encrypted, it can be shared, but only by specifying a list of authorized Amazon Web Services account IDs for the `ValuesToAdd` parameter. You can't use `all` as a value for that parameter in this case.
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
 * Creates a snapshot of a cluster.
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
 * Copies a snapshot of a cluster.
 *
 * To copy a cluster snapshot from a shared manual cluster snapshot,
 * `SourceDBClusterSnapshotIdentifier` must be the Amazon
 * Resource Name (ARN) of the shared cluster snapshot. You can only
 * copy a shared DB cluster snapshot, whether encrypted or not, in the
 * same Amazon Web Services Region.
 *
 * To cancel the copy operation after it is in progress, delete the
 * target cluster snapshot identified by
 * `TargetDBClusterSnapshotIdentifier` while that cluster
 * snapshot is in the *copying* status.
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
 * Deletes a previously provisioned cluster. When you delete a cluster, all automated backups for that cluster are deleted and can't be recovered. Manual DB cluster snapshots of the specified cluster are not deleted.
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
 * Deletes a previously provisioned instance.
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
 * Creates a new subnet group. subnet groups must contain at least one subnet in at
 * least two Availability Zones in the Amazon Web Services Region.
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
 * Creates an Amazon DocumentDB global cluster that can span multiple multiple Amazon Web Services Regions.
 * The global cluster contains one primary cluster with read-write capability, and up-to 10 read-only secondary clusters. Global clusters uses storage-based fast replication across regions with latencies less than one second, using dedicated infrastructure with no impact to your workload’s performance.
 *
 * You can create a global cluster that is initially empty, and then add a primary and a secondary to it.
 * Or you can specify an existing cluster during the create operation, and this cluster becomes the primary of the global cluster.
 *
 * This action only applies to Amazon DocumentDB clusters.
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
 * Modifies an existing subnet group. subnet groups must contain at least one subnet in at least two Availability Zones in the Amazon Web Services Region.
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
 * Modifies an existing Amazon DocumentDB event notification subscription.
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
 * Creates an Amazon DocumentDB event notification subscription. This action requires a topic Amazon Resource Name (ARN) created by using the Amazon DocumentDB console, the Amazon SNS console, or the Amazon SNS API. To obtain an ARN with Amazon SNS, you must create a topic in Amazon SNS and subscribe to the topic. The ARN is displayed in the Amazon SNS console.
 *
 * You can specify the type of source (`SourceType`) that you want to be notified of. You can also provide a list of Amazon DocumentDB sources (`SourceIds`) that trigger the events, and you can provide a list of event categories (`EventCategories`) for events that you want to be notified of. For example, you can specify `SourceType = db-instance`, `SourceIds = mydbinstance1, mydbinstance2` and `EventCategories = Availability, Backup`.
 *
 * If you specify both the `SourceType` and `SourceIds` (such as `SourceType = db-instance` and `SourceIdentifier = myDBInstance1`), you are notified of all the `db-instance` events for the specified source. If you specify a `SourceType` but do not specify a `SourceIdentifier`, you receive notice of the events for that source type for all your Amazon DocumentDB sources. If you do not specify either the `SourceType` or the `SourceIdentifier`, you are notified of events generated from all Amazon DocumentDB sources belonging to your customer account.
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
 * Creates a new Amazon DocumentDB cluster.
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
    NetworkTypeNotSupported,
    StorageQuotaExceededFault,
  ],
}));
/**
 * Restores a cluster to an arbitrary point in time. Users can restore to any point in
 * time before `LatestRestorableTime` for up to
 * `BackupRetentionPeriod` days. The target cluster is created from the
 * source cluster with the same configuration as the original cluster, except that
 * the new cluster is created with the default security group.
 */
export const restoreDBClusterToPointInTime =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RestoreDBClusterToPointInTimeMessage,
    output: RestoreDBClusterToPointInTimeResult,
    errors: [
      DBClusterAlreadyExistsFault,
      DBClusterNotFoundFault,
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
      NetworkTypeNotSupported,
      StorageQuotaExceededFault,
    ],
  }));
/**
 * Modifies a setting for an Amazon DocumentDB cluster. You can change one or more database
 * configuration parameters by specifying these parameters and the new values in the
 * request.
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
    NetworkTypeNotSupported,
    StorageQuotaExceededFault,
  ],
}));
/**
 * Creates a new cluster from a snapshot or cluster snapshot.
 *
 * If a snapshot is specified, the target cluster is created from the source DB snapshot with a default configuration and default security group.
 *
 * If a cluster snapshot is specified, the target cluster is created from the source cluster restore point with the same configuration as the original source DB cluster, except that the new cluster is created with the default security group.
 */
export const restoreDBClusterFromSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RestoreDBClusterFromSnapshotMessage,
    output: RestoreDBClusterFromSnapshotResult,
    errors: [
      DBClusterAlreadyExistsFault,
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
      NetworkTypeNotSupported,
      StorageQuotaExceededFault,
    ],
  }));
/**
 * Modifies settings for an instance. You can change one or more database configuration parameters by specifying these parameters and the new values in the request.
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
    InsufficientDBInstanceCapacityFault,
    InvalidDBInstanceStateFault,
    InvalidDBSecurityGroupStateFault,
    InvalidVPCNetworkStateFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
  ],
}));
/**
 * Creates a new instance.
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
    InstanceQuotaExceededFault,
    InsufficientDBInstanceCapacityFault,
    InvalidDBClusterStateFault,
    InvalidSubnet,
    InvalidVPCNetworkStateFault,
    KMSKeyNotAccessibleFault,
    StorageQuotaExceededFault,
    StorageTypeNotSupportedFault,
  ],
}));

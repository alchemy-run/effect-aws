import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://dms.amazonaws.com/doc/2016-01-01/");
const svc = T.AwsApiService({
  sdkId: "Database Migration Service",
  serviceShapeName: "AmazonDMSv20160101",
});
const auth = T.AwsAuthSigv4({ name: "dms" });
const ver = T.ServiceVersion("2016-01-01");
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
                        url: "https://dms-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://dms.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-iso",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://dms.{Region}.c2s.ic.gov",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-iso-b",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://dms.{Region}.sc2s.sgov.gov",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://dms-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://dms.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://dms.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeAccountAttributesMessage extends S.Class<DescribeAccountAttributesMessage>(
  "DescribeAccountAttributesMessage",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RunFleetAdvisorLsaAnalysisRequest extends S.Class<RunFleetAdvisorLsaAnalysisRequest>(
  "RunFleetAdvisorLsaAnalysisRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const EventCategoriesList = S.Array(
  S.String.pipe(T.XmlName("EventCategory")),
);
export const SourceIdsList = S.Array(S.String.pipe(T.XmlName("SourceId")));
export const StringList = S.Array(S.String);
export const VpcSecurityGroupIdList = S.Array(
  S.String.pipe(T.XmlName("VpcSecurityGroupId")),
);
export const SubnetIdentifierList = S.Array(
  S.String.pipe(T.XmlName("SubnetIdentifier")),
);
export const AssessmentReportTypesList = S.Array(S.String);
export const ArnList = S.Array(S.String);
export const KeyList = S.Array(S.String);
export const IncludeTestList = S.Array(S.String);
export const ExcludeTestList = S.Array(S.String);
export class ApplyPendingMaintenanceActionMessage extends S.Class<ApplyPendingMaintenanceActionMessage>(
  "ApplyPendingMaintenanceActionMessage",
)(
  {
    ReplicationInstanceArn: S.String,
    ApplyAction: S.String,
    OptInType: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelMetadataModelConversionMessage extends S.Class<CancelMetadataModelConversionMessage>(
  "CancelMetadataModelConversionMessage",
)(
  { MigrationProjectIdentifier: S.String, RequestIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelMetadataModelCreationMessage extends S.Class<CancelMetadataModelCreationMessage>(
  "CancelMetadataModelCreationMessage",
)(
  { MigrationProjectIdentifier: S.String, RequestIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelReplicationTaskAssessmentRunMessage extends S.Class<CancelReplicationTaskAssessmentRunMessage>(
  "CancelReplicationTaskAssessmentRunMessage",
)(
  { ReplicationTaskAssessmentRunArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  ResourceArn: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag.pipe(T.XmlName("Tag")));
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
export class CreateFleetAdvisorCollectorRequest extends S.Class<CreateFleetAdvisorCollectorRequest>(
  "CreateFleetAdvisorCollectorRequest",
)(
  {
    CollectorName: S.String,
    Description: S.optional(S.String),
    ServiceAccessRoleArn: S.String,
    S3BucketName: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateInstanceProfileMessage extends S.Class<CreateInstanceProfileMessage>(
  "CreateInstanceProfileMessage",
)(
  {
    AvailabilityZone: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    NetworkType: S.optional(S.String),
    InstanceProfileName: S.optional(S.String),
    Description: S.optional(S.String),
    SubnetGroupIdentifier: S.optional(S.String),
    VpcSecurityGroups: S.optional(StringList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateReplicationSubnetGroupMessage extends S.Class<CreateReplicationSubnetGroupMessage>(
  "CreateReplicationSubnetGroupMessage",
)(
  {
    ReplicationSubnetGroupIdentifier: S.String,
    ReplicationSubnetGroupDescription: S.String,
    SubnetIds: SubnetIdentifierList,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateReplicationTaskMessage extends S.Class<CreateReplicationTaskMessage>(
  "CreateReplicationTaskMessage",
)(
  {
    ReplicationTaskIdentifier: S.String,
    SourceEndpointArn: S.String,
    TargetEndpointArn: S.String,
    ReplicationInstanceArn: S.String,
    MigrationType: S.String,
    TableMappings: S.String,
    ReplicationTaskSettings: S.optional(S.String),
    CdcStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CdcStartPosition: S.optional(S.String),
    CdcStopPosition: S.optional(S.String),
    Tags: S.optional(TagList),
    TaskData: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCertificateMessage extends S.Class<DeleteCertificateMessage>(
  "DeleteCertificateMessage",
)(
  { CertificateArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConnectionMessage extends S.Class<DeleteConnectionMessage>(
  "DeleteConnectionMessage",
)(
  { EndpointArn: S.String, ReplicationInstanceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDataMigrationMessage extends S.Class<DeleteDataMigrationMessage>(
  "DeleteDataMigrationMessage",
)(
  { DataMigrationIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDataProviderMessage extends S.Class<DeleteDataProviderMessage>(
  "DeleteDataProviderMessage",
)(
  { DataProviderIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEndpointMessage extends S.Class<DeleteEndpointMessage>(
  "DeleteEndpointMessage",
)(
  { EndpointArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEventSubscriptionMessage extends S.Class<DeleteEventSubscriptionMessage>(
  "DeleteEventSubscriptionMessage",
)(
  { SubscriptionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCollectorRequest extends S.Class<DeleteCollectorRequest>(
  "DeleteCollectorRequest",
)(
  { CollectorReferencedId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFleetAdvisorCollectorResponse extends S.Class<DeleteFleetAdvisorCollectorResponse>(
  "DeleteFleetAdvisorCollectorResponse",
)({}, ns) {}
export class DeleteFleetAdvisorDatabasesRequest extends S.Class<DeleteFleetAdvisorDatabasesRequest>(
  "DeleteFleetAdvisorDatabasesRequest",
)(
  { DatabaseIds: StringList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteInstanceProfileMessage extends S.Class<DeleteInstanceProfileMessage>(
  "DeleteInstanceProfileMessage",
)(
  { InstanceProfileIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMigrationProjectMessage extends S.Class<DeleteMigrationProjectMessage>(
  "DeleteMigrationProjectMessage",
)(
  { MigrationProjectIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteReplicationConfigMessage extends S.Class<DeleteReplicationConfigMessage>(
  "DeleteReplicationConfigMessage",
)(
  { ReplicationConfigArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteReplicationInstanceMessage extends S.Class<DeleteReplicationInstanceMessage>(
  "DeleteReplicationInstanceMessage",
)(
  { ReplicationInstanceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteReplicationSubnetGroupMessage extends S.Class<DeleteReplicationSubnetGroupMessage>(
  "DeleteReplicationSubnetGroupMessage",
)(
  { ReplicationSubnetGroupIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteReplicationSubnetGroupResponse extends S.Class<DeleteReplicationSubnetGroupResponse>(
  "DeleteReplicationSubnetGroupResponse",
)({}, ns) {}
export class DeleteReplicationTaskMessage extends S.Class<DeleteReplicationTaskMessage>(
  "DeleteReplicationTaskMessage",
)(
  { ReplicationTaskArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteReplicationTaskAssessmentRunMessage extends S.Class<DeleteReplicationTaskAssessmentRunMessage>(
  "DeleteReplicationTaskAssessmentRunMessage",
)(
  { ReplicationTaskAssessmentRunArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeApplicableIndividualAssessmentsMessage extends S.Class<DescribeApplicableIndividualAssessmentsMessage>(
  "DescribeApplicableIndividualAssessmentsMessage",
)(
  {
    ReplicationTaskArn: S.optional(S.String),
    ReplicationInstanceArn: S.optional(S.String),
    ReplicationConfigArn: S.optional(S.String),
    SourceEngineName: S.optional(S.String),
    TargetEngineName: S.optional(S.String),
    MigrationType: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FilterValueList = S.Array(S.String.pipe(T.XmlName("Value")));
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.String,
  Values: FilterValueList,
}) {}
export const FilterList = S.Array(Filter.pipe(T.XmlName("Filter")));
export class DescribeConnectionsMessage extends S.Class<DescribeConnectionsMessage>(
  "DescribeConnectionsMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConversionConfigurationMessage extends S.Class<DescribeConversionConfigurationMessage>(
  "DescribeConversionConfigurationMessage",
)(
  { MigrationProjectIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDataMigrationsMessage extends S.Class<DescribeDataMigrationsMessage>(
  "DescribeDataMigrationsMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    WithoutSettings: S.optional(S.Boolean),
    WithoutStatistics: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDataProvidersMessage extends S.Class<DescribeDataProvidersMessage>(
  "DescribeDataProvidersMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEndpointsMessage extends S.Class<DescribeEndpointsMessage>(
  "DescribeEndpointsMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEndpointSettingsMessage extends S.Class<DescribeEndpointSettingsMessage>(
  "DescribeEndpointSettingsMessage",
)(
  {
    EngineName: S.String,
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEndpointTypesMessage extends S.Class<DescribeEndpointTypesMessage>(
  "DescribeEndpointTypesMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEngineVersionsMessage extends S.Class<DescribeEngineVersionsMessage>(
  "DescribeEngineVersionsMessage",
)(
  { MaxRecords: S.optional(S.Number), Marker: S.optional(S.String) },
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
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
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
export class DescribeExtensionPackAssociationsMessage extends S.Class<DescribeExtensionPackAssociationsMessage>(
  "DescribeExtensionPackAssociationsMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetAdvisorCollectorsRequest extends S.Class<DescribeFleetAdvisorCollectorsRequest>(
  "DescribeFleetAdvisorCollectorsRequest",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetAdvisorDatabasesRequest extends S.Class<DescribeFleetAdvisorDatabasesRequest>(
  "DescribeFleetAdvisorDatabasesRequest",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetAdvisorLsaAnalysisRequest extends S.Class<DescribeFleetAdvisorLsaAnalysisRequest>(
  "DescribeFleetAdvisorLsaAnalysisRequest",
)(
  { MaxRecords: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetAdvisorSchemaObjectSummaryRequest extends S.Class<DescribeFleetAdvisorSchemaObjectSummaryRequest>(
  "DescribeFleetAdvisorSchemaObjectSummaryRequest",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFleetAdvisorSchemasRequest extends S.Class<DescribeFleetAdvisorSchemasRequest>(
  "DescribeFleetAdvisorSchemasRequest",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInstanceProfilesMessage extends S.Class<DescribeInstanceProfilesMessage>(
  "DescribeInstanceProfilesMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetadataModelMessage extends S.Class<DescribeMetadataModelMessage>(
  "DescribeMetadataModelMessage",
)(
  {
    SelectionRules: S.String,
    MigrationProjectIdentifier: S.String,
    Origin: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetadataModelAssessmentsMessage extends S.Class<DescribeMetadataModelAssessmentsMessage>(
  "DescribeMetadataModelAssessmentsMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetadataModelChildrenMessage extends S.Class<DescribeMetadataModelChildrenMessage>(
  "DescribeMetadataModelChildrenMessage",
)(
  {
    SelectionRules: S.String,
    MigrationProjectIdentifier: S.String,
    Origin: S.String,
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetadataModelConversionsMessage extends S.Class<DescribeMetadataModelConversionsMessage>(
  "DescribeMetadataModelConversionsMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetadataModelCreationsMessage extends S.Class<DescribeMetadataModelCreationsMessage>(
  "DescribeMetadataModelCreationsMessage",
)(
  {
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    MigrationProjectIdentifier: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetadataModelExportsAsScriptMessage extends S.Class<DescribeMetadataModelExportsAsScriptMessage>(
  "DescribeMetadataModelExportsAsScriptMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetadataModelExportsToTargetMessage extends S.Class<DescribeMetadataModelExportsToTargetMessage>(
  "DescribeMetadataModelExportsToTargetMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetadataModelImportsMessage extends S.Class<DescribeMetadataModelImportsMessage>(
  "DescribeMetadataModelImportsMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMigrationProjectsMessage extends S.Class<DescribeMigrationProjectsMessage>(
  "DescribeMigrationProjectsMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOrderableReplicationInstancesMessage extends S.Class<DescribeOrderableReplicationInstancesMessage>(
  "DescribeOrderableReplicationInstancesMessage",
)(
  { MaxRecords: S.optional(S.Number), Marker: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePendingMaintenanceActionsMessage extends S.Class<DescribePendingMaintenanceActionsMessage>(
  "DescribePendingMaintenanceActionsMessage",
)(
  {
    ReplicationInstanceArn: S.optional(S.String),
    Filters: S.optional(FilterList),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRecommendationLimitationsRequest extends S.Class<DescribeRecommendationLimitationsRequest>(
  "DescribeRecommendationLimitationsRequest",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRecommendationsRequest extends S.Class<DescribeRecommendationsRequest>(
  "DescribeRecommendationsRequest",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRefreshSchemasStatusMessage extends S.Class<DescribeRefreshSchemasStatusMessage>(
  "DescribeRefreshSchemasStatusMessage",
)(
  { EndpointArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplicationConfigsMessage extends S.Class<DescribeReplicationConfigsMessage>(
  "DescribeReplicationConfigsMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplicationInstancesMessage extends S.Class<DescribeReplicationInstancesMessage>(
  "DescribeReplicationInstancesMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplicationInstanceTaskLogsMessage extends S.Class<DescribeReplicationInstanceTaskLogsMessage>(
  "DescribeReplicationInstanceTaskLogsMessage",
)(
  {
    ReplicationInstanceArn: S.String,
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplicationsMessage extends S.Class<DescribeReplicationsMessage>(
  "DescribeReplicationsMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplicationSubnetGroupsMessage extends S.Class<DescribeReplicationSubnetGroupsMessage>(
  "DescribeReplicationSubnetGroupsMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplicationTableStatisticsMessage extends S.Class<DescribeReplicationTableStatisticsMessage>(
  "DescribeReplicationTableStatisticsMessage",
)(
  {
    ReplicationConfigArn: S.String,
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    Filters: S.optional(FilterList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplicationTaskAssessmentResultsMessage extends S.Class<DescribeReplicationTaskAssessmentResultsMessage>(
  "DescribeReplicationTaskAssessmentResultsMessage",
)(
  {
    ReplicationTaskArn: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplicationTaskAssessmentRunsMessage extends S.Class<DescribeReplicationTaskAssessmentRunsMessage>(
  "DescribeReplicationTaskAssessmentRunsMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplicationTaskIndividualAssessmentsMessage extends S.Class<DescribeReplicationTaskIndividualAssessmentsMessage>(
  "DescribeReplicationTaskIndividualAssessmentsMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplicationTasksMessage extends S.Class<DescribeReplicationTasksMessage>(
  "DescribeReplicationTasksMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    WithoutSettings: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSchemasMessage extends S.Class<DescribeSchemasMessage>(
  "DescribeSchemasMessage",
)(
  {
    EndpointArn: S.String,
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTableStatisticsMessage extends S.Class<DescribeTableStatisticsMessage>(
  "DescribeTableStatisticsMessage",
)(
  {
    ReplicationTaskArn: S.String,
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    Filters: S.optional(FilterList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExportMetadataModelAssessmentMessage extends S.Class<ExportMetadataModelAssessmentMessage>(
  "ExportMetadataModelAssessmentMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    SelectionRules: S.String,
    FileName: S.optional(S.String),
    AssessmentReportTypes: S.optional(AssessmentReportTypesList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTargetSelectionRulesMessage extends S.Class<GetTargetSelectionRulesMessage>(
  "GetTargetSelectionRulesMessage",
)(
  { MigrationProjectIdentifier: S.String, SelectionRules: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportCertificateMessage extends S.Class<ImportCertificateMessage>(
  "ImportCertificateMessage",
)(
  {
    CertificateIdentifier: S.String,
    CertificatePem: S.optional(S.String),
    CertificateWallet: S.optional(T.Blob),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceMessage extends S.Class<ListTagsForResourceMessage>(
  "ListTagsForResourceMessage",
)(
  { ResourceArn: S.optional(S.String), ResourceArnList: S.optional(ArnList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyConversionConfigurationMessage extends S.Class<ModifyConversionConfigurationMessage>(
  "ModifyConversionConfigurationMessage",
)(
  { MigrationProjectIdentifier: S.String, ConversionConfiguration: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SourceDataSetting extends S.Class<SourceDataSetting>(
  "SourceDataSetting",
)({
  CDCStartPosition: S.optional(S.String),
  CDCStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CDCStopTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SlotName: S.optional(S.String),
}) {}
export const SourceDataSettings = S.Array(SourceDataSetting);
export class TargetDataSetting extends S.Class<TargetDataSetting>(
  "TargetDataSetting",
)({ TablePreparationMode: S.optional(S.String) }) {}
export const TargetDataSettings = S.Array(TargetDataSetting);
export class ModifyDataMigrationMessage extends S.Class<ModifyDataMigrationMessage>(
  "ModifyDataMigrationMessage",
)(
  {
    DataMigrationIdentifier: S.String,
    DataMigrationName: S.optional(S.String),
    EnableCloudwatchLogs: S.optional(S.Boolean),
    ServiceAccessRoleArn: S.optional(S.String),
    DataMigrationType: S.optional(S.String),
    SourceDataSettings: S.optional(SourceDataSettings),
    TargetDataSettings: S.optional(TargetDataSettings),
    NumberOfJobs: S.optional(S.Number),
    SelectionRules: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RedshiftDataProviderSettings extends S.Class<RedshiftDataProviderSettings>(
  "RedshiftDataProviderSettings",
)({
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  S3Path: S.optional(S.String),
  S3AccessRoleArn: S.optional(S.String),
}) {}
export class PostgreSqlDataProviderSettings extends S.Class<PostgreSqlDataProviderSettings>(
  "PostgreSqlDataProviderSettings",
)({
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  SslMode: S.optional(S.String),
  CertificateArn: S.optional(S.String),
  S3Path: S.optional(S.String),
  S3AccessRoleArn: S.optional(S.String),
}) {}
export class MySqlDataProviderSettings extends S.Class<MySqlDataProviderSettings>(
  "MySqlDataProviderSettings",
)({
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  SslMode: S.optional(S.String),
  CertificateArn: S.optional(S.String),
  S3Path: S.optional(S.String),
  S3AccessRoleArn: S.optional(S.String),
}) {}
export class OracleDataProviderSettings extends S.Class<OracleDataProviderSettings>(
  "OracleDataProviderSettings",
)({
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  SslMode: S.optional(S.String),
  CertificateArn: S.optional(S.String),
  AsmServer: S.optional(S.String),
  SecretsManagerOracleAsmSecretId: S.optional(S.String),
  SecretsManagerOracleAsmAccessRoleArn: S.optional(S.String),
  SecretsManagerSecurityDbEncryptionSecretId: S.optional(S.String),
  SecretsManagerSecurityDbEncryptionAccessRoleArn: S.optional(S.String),
  S3Path: S.optional(S.String),
  S3AccessRoleArn: S.optional(S.String),
}) {}
export class SybaseAseDataProviderSettings extends S.Class<SybaseAseDataProviderSettings>(
  "SybaseAseDataProviderSettings",
)({
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  SslMode: S.optional(S.String),
  EncryptPassword: S.optional(S.Boolean),
  CertificateArn: S.optional(S.String),
}) {}
export class MicrosoftSqlServerDataProviderSettings extends S.Class<MicrosoftSqlServerDataProviderSettings>(
  "MicrosoftSqlServerDataProviderSettings",
)({
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  SslMode: S.optional(S.String),
  CertificateArn: S.optional(S.String),
  S3Path: S.optional(S.String),
  S3AccessRoleArn: S.optional(S.String),
}) {}
export class DocDbDataProviderSettings extends S.Class<DocDbDataProviderSettings>(
  "DocDbDataProviderSettings",
)({
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  SslMode: S.optional(S.String),
  CertificateArn: S.optional(S.String),
}) {}
export class MariaDbDataProviderSettings extends S.Class<MariaDbDataProviderSettings>(
  "MariaDbDataProviderSettings",
)({
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  SslMode: S.optional(S.String),
  CertificateArn: S.optional(S.String),
  S3Path: S.optional(S.String),
  S3AccessRoleArn: S.optional(S.String),
}) {}
export class IbmDb2LuwDataProviderSettings extends S.Class<IbmDb2LuwDataProviderSettings>(
  "IbmDb2LuwDataProviderSettings",
)({
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  SslMode: S.optional(S.String),
  CertificateArn: S.optional(S.String),
  S3Path: S.optional(S.String),
  S3AccessRoleArn: S.optional(S.String),
}) {}
export class IbmDb2zOsDataProviderSettings extends S.Class<IbmDb2zOsDataProviderSettings>(
  "IbmDb2zOsDataProviderSettings",
)({
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  SslMode: S.optional(S.String),
  CertificateArn: S.optional(S.String),
  S3Path: S.optional(S.String),
  S3AccessRoleArn: S.optional(S.String),
}) {}
export class MongoDbDataProviderSettings extends S.Class<MongoDbDataProviderSettings>(
  "MongoDbDataProviderSettings",
)({
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  SslMode: S.optional(S.String),
  CertificateArn: S.optional(S.String),
  AuthType: S.optional(S.String),
  AuthSource: S.optional(S.String),
  AuthMechanism: S.optional(S.String),
}) {}
export const DataProviderSettings = S.Union(
  S.Struct({ RedshiftSettings: RedshiftDataProviderSettings }),
  S.Struct({ PostgreSqlSettings: PostgreSqlDataProviderSettings }),
  S.Struct({ MySqlSettings: MySqlDataProviderSettings }),
  S.Struct({ OracleSettings: OracleDataProviderSettings }),
  S.Struct({ SybaseAseSettings: SybaseAseDataProviderSettings }),
  S.Struct({
    MicrosoftSqlServerSettings: MicrosoftSqlServerDataProviderSettings,
  }),
  S.Struct({ DocDbSettings: DocDbDataProviderSettings }),
  S.Struct({ MariaDbSettings: MariaDbDataProviderSettings }),
  S.Struct({ IbmDb2LuwSettings: IbmDb2LuwDataProviderSettings }),
  S.Struct({ IbmDb2zOsSettings: IbmDb2zOsDataProviderSettings }),
  S.Struct({ MongoDbSettings: MongoDbDataProviderSettings }),
);
export class ModifyDataProviderMessage extends S.Class<ModifyDataProviderMessage>(
  "ModifyDataProviderMessage",
)(
  {
    DataProviderIdentifier: S.String,
    DataProviderName: S.optional(S.String),
    Description: S.optional(S.String),
    Engine: S.optional(S.String),
    Virtual: S.optional(S.Boolean),
    ExactSettings: S.optional(S.Boolean),
    Settings: S.optional(DataProviderSettings),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DynamoDbSettings extends S.Class<DynamoDbSettings>(
  "DynamoDbSettings",
)({ ServiceAccessRoleArn: S.String }) {}
export class S3Settings extends S.Class<S3Settings>("S3Settings")({
  ServiceAccessRoleArn: S.optional(S.String),
  ExternalTableDefinition: S.optional(S.String),
  CsvRowDelimiter: S.optional(S.String),
  CsvDelimiter: S.optional(S.String),
  BucketFolder: S.optional(S.String),
  BucketName: S.optional(S.String),
  CompressionType: S.optional(S.String),
  EncryptionMode: S.optional(S.String),
  ServerSideEncryptionKmsKeyId: S.optional(S.String),
  DataFormat: S.optional(S.String),
  EncodingType: S.optional(S.String),
  DictPageSizeLimit: S.optional(S.Number),
  RowGroupLength: S.optional(S.Number),
  DataPageSize: S.optional(S.Number),
  ParquetVersion: S.optional(S.String),
  EnableStatistics: S.optional(S.Boolean),
  IncludeOpForFullLoad: S.optional(S.Boolean),
  CdcInsertsOnly: S.optional(S.Boolean),
  TimestampColumnName: S.optional(S.String),
  ParquetTimestampInMillisecond: S.optional(S.Boolean),
  CdcInsertsAndUpdates: S.optional(S.Boolean),
  DatePartitionEnabled: S.optional(S.Boolean),
  DatePartitionSequence: S.optional(S.String),
  DatePartitionDelimiter: S.optional(S.String),
  UseCsvNoSupValue: S.optional(S.Boolean),
  CsvNoSupValue: S.optional(S.String),
  PreserveTransactions: S.optional(S.Boolean),
  CdcPath: S.optional(S.String),
  UseTaskStartTimeForFullLoadTimestamp: S.optional(S.Boolean),
  CannedAclForObjects: S.optional(S.String),
  AddColumnName: S.optional(S.Boolean),
  CdcMaxBatchInterval: S.optional(S.Number),
  CdcMinFileSize: S.optional(S.Number),
  CsvNullValue: S.optional(S.String),
  IgnoreHeaderRows: S.optional(S.Number),
  MaxFileSize: S.optional(S.Number),
  Rfc4180: S.optional(S.Boolean),
  DatePartitionTimezone: S.optional(S.String),
  AddTrailingPaddingCharacter: S.optional(S.Boolean),
  ExpectedBucketOwner: S.optional(S.String),
  GlueCatalogGeneration: S.optional(S.Boolean),
}) {}
export class DmsTransferSettings extends S.Class<DmsTransferSettings>(
  "DmsTransferSettings",
)({
  ServiceAccessRoleArn: S.optional(S.String),
  BucketName: S.optional(S.String),
}) {}
export class MongoDbSettings extends S.Class<MongoDbSettings>(
  "MongoDbSettings",
)({
  Username: S.optional(S.String),
  Password: S.optional(S.String),
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  AuthType: S.optional(S.String),
  AuthMechanism: S.optional(S.String),
  NestingLevel: S.optional(S.String),
  ExtractDocId: S.optional(S.String),
  DocsToInvestigate: S.optional(S.String),
  AuthSource: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  SecretsManagerAccessRoleArn: S.optional(S.String),
  SecretsManagerSecretId: S.optional(S.String),
  UseUpdateLookUp: S.optional(S.Boolean),
  ReplicateShardCollections: S.optional(S.Boolean),
}) {}
export class KinesisSettings extends S.Class<KinesisSettings>(
  "KinesisSettings",
)({
  StreamArn: S.optional(S.String),
  MessageFormat: S.optional(S.String),
  ServiceAccessRoleArn: S.optional(S.String),
  IncludeTransactionDetails: S.optional(S.Boolean),
  IncludePartitionValue: S.optional(S.Boolean),
  PartitionIncludeSchemaTable: S.optional(S.Boolean),
  IncludeTableAlterOperations: S.optional(S.Boolean),
  IncludeControlDetails: S.optional(S.Boolean),
  IncludeNullAndEmpty: S.optional(S.Boolean),
  NoHexPrefix: S.optional(S.Boolean),
  UseLargeIntegerValue: S.optional(S.Boolean),
}) {}
export class KafkaSettings extends S.Class<KafkaSettings>("KafkaSettings")({
  Broker: S.optional(S.String),
  Topic: S.optional(S.String),
  MessageFormat: S.optional(S.String),
  IncludeTransactionDetails: S.optional(S.Boolean),
  IncludePartitionValue: S.optional(S.Boolean),
  PartitionIncludeSchemaTable: S.optional(S.Boolean),
  IncludeTableAlterOperations: S.optional(S.Boolean),
  IncludeControlDetails: S.optional(S.Boolean),
  MessageMaxBytes: S.optional(S.Number),
  IncludeNullAndEmpty: S.optional(S.Boolean),
  SecurityProtocol: S.optional(S.String),
  SslClientCertificateArn: S.optional(S.String),
  SslClientKeyArn: S.optional(S.String),
  SslClientKeyPassword: S.optional(S.String),
  SslCaCertificateArn: S.optional(S.String),
  SaslUsername: S.optional(S.String),
  SaslPassword: S.optional(S.String),
  NoHexPrefix: S.optional(S.Boolean),
  SaslMechanism: S.optional(S.String),
  SslEndpointIdentificationAlgorithm: S.optional(S.String),
  UseLargeIntegerValue: S.optional(S.Boolean),
}) {}
export class ElasticsearchSettings extends S.Class<ElasticsearchSettings>(
  "ElasticsearchSettings",
)({
  ServiceAccessRoleArn: S.String,
  EndpointUri: S.String,
  FullLoadErrorPercentage: S.optional(S.Number),
  ErrorRetryDuration: S.optional(S.Number),
  UseNewMappingType: S.optional(S.Boolean),
}) {}
export class NeptuneSettings extends S.Class<NeptuneSettings>(
  "NeptuneSettings",
)({
  ServiceAccessRoleArn: S.optional(S.String),
  S3BucketName: S.String,
  S3BucketFolder: S.String,
  ErrorRetryDuration: S.optional(S.Number),
  MaxFileSize: S.optional(S.Number),
  MaxRetryCount: S.optional(S.Number),
  IamAuthEnabled: S.optional(S.Boolean),
}) {}
export class RedshiftSettings extends S.Class<RedshiftSettings>(
  "RedshiftSettings",
)({
  AcceptAnyDate: S.optional(S.Boolean),
  AfterConnectScript: S.optional(S.String),
  BucketFolder: S.optional(S.String),
  BucketName: S.optional(S.String),
  CaseSensitiveNames: S.optional(S.Boolean),
  CompUpdate: S.optional(S.Boolean),
  ConnectionTimeout: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  DateFormat: S.optional(S.String),
  EmptyAsNull: S.optional(S.Boolean),
  EncryptionMode: S.optional(S.String),
  ExplicitIds: S.optional(S.Boolean),
  FileTransferUploadStreams: S.optional(S.Number),
  LoadTimeout: S.optional(S.Number),
  MaxFileSize: S.optional(S.Number),
  Password: S.optional(S.String),
  Port: S.optional(S.Number),
  RemoveQuotes: S.optional(S.Boolean),
  ReplaceInvalidChars: S.optional(S.String),
  ReplaceChars: S.optional(S.String),
  ServerName: S.optional(S.String),
  ServiceAccessRoleArn: S.optional(S.String),
  ServerSideEncryptionKmsKeyId: S.optional(S.String),
  TimeFormat: S.optional(S.String),
  TrimBlanks: S.optional(S.Boolean),
  TruncateColumns: S.optional(S.Boolean),
  Username: S.optional(S.String),
  WriteBufferSize: S.optional(S.Number),
  SecretsManagerAccessRoleArn: S.optional(S.String),
  SecretsManagerSecretId: S.optional(S.String),
  MapBooleanAsBoolean: S.optional(S.Boolean),
}) {}
export class PostgreSQLSettings extends S.Class<PostgreSQLSettings>(
  "PostgreSQLSettings",
)({
  AfterConnectScript: S.optional(S.String),
  CaptureDdls: S.optional(S.Boolean),
  MaxFileSize: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  DdlArtifactsSchema: S.optional(S.String),
  ExecuteTimeout: S.optional(S.Number),
  FailTasksOnLobTruncation: S.optional(S.Boolean),
  HeartbeatEnable: S.optional(S.Boolean),
  HeartbeatSchema: S.optional(S.String),
  HeartbeatFrequency: S.optional(S.Number),
  Password: S.optional(S.String),
  Port: S.optional(S.Number),
  ServerName: S.optional(S.String),
  Username: S.optional(S.String),
  SlotName: S.optional(S.String),
  PluginName: S.optional(S.String),
  SecretsManagerAccessRoleArn: S.optional(S.String),
  SecretsManagerSecretId: S.optional(S.String),
  TrimSpaceInChar: S.optional(S.Boolean),
  MapBooleanAsBoolean: S.optional(S.Boolean),
  MapJsonbAsClob: S.optional(S.Boolean),
  MapLongVarcharAs: S.optional(S.String),
  DatabaseMode: S.optional(S.String),
  BabelfishDatabaseName: S.optional(S.String),
  DisableUnicodeSourceFilter: S.optional(S.Boolean),
  ServiceAccessRoleArn: S.optional(S.String),
  AuthenticationMethod: S.optional(S.String),
}) {}
export class MySQLSettings extends S.Class<MySQLSettings>("MySQLSettings")({
  AfterConnectScript: S.optional(S.String),
  CleanSourceMetadataOnMismatch: S.optional(S.Boolean),
  DatabaseName: S.optional(S.String),
  EventsPollInterval: S.optional(S.Number),
  TargetDbType: S.optional(S.String),
  MaxFileSize: S.optional(S.Number),
  ParallelLoadThreads: S.optional(S.Number),
  Password: S.optional(S.String),
  Port: S.optional(S.Number),
  ServerName: S.optional(S.String),
  ServerTimezone: S.optional(S.String),
  Username: S.optional(S.String),
  SecretsManagerAccessRoleArn: S.optional(S.String),
  SecretsManagerSecretId: S.optional(S.String),
  ExecuteTimeout: S.optional(S.Number),
  ServiceAccessRoleArn: S.optional(S.String),
  AuthenticationMethod: S.optional(S.String),
}) {}
export const IntegerList = S.Array(S.Number);
export class OracleSettings extends S.Class<OracleSettings>("OracleSettings")({
  AddSupplementalLogging: S.optional(S.Boolean),
  ArchivedLogDestId: S.optional(S.Number),
  AdditionalArchivedLogDestId: S.optional(S.Number),
  ExtraArchivedLogDestIds: S.optional(IntegerList),
  AllowSelectNestedTables: S.optional(S.Boolean),
  ParallelAsmReadThreads: S.optional(S.Number),
  ReadAheadBlocks: S.optional(S.Number),
  AccessAlternateDirectly: S.optional(S.Boolean),
  UseAlternateFolderForOnline: S.optional(S.Boolean),
  OraclePathPrefix: S.optional(S.String),
  UsePathPrefix: S.optional(S.String),
  ReplacePathPrefix: S.optional(S.Boolean),
  EnableHomogenousTablespace: S.optional(S.Boolean),
  DirectPathNoLog: S.optional(S.Boolean),
  ArchivedLogsOnly: S.optional(S.Boolean),
  AsmPassword: S.optional(S.String),
  AsmServer: S.optional(S.String),
  AsmUser: S.optional(S.String),
  CharLengthSemantics: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  DirectPathParallelLoad: S.optional(S.Boolean),
  FailTasksOnLobTruncation: S.optional(S.Boolean),
  NumberDatatypeScale: S.optional(S.Number),
  Password: S.optional(S.String),
  Port: S.optional(S.Number),
  ReadTableSpaceName: S.optional(S.Boolean),
  RetryInterval: S.optional(S.Number),
  SecurityDbEncryption: S.optional(S.String),
  SecurityDbEncryptionName: S.optional(S.String),
  ServerName: S.optional(S.String),
  SpatialDataOptionToGeoJsonFunctionName: S.optional(S.String),
  StandbyDelayTime: S.optional(S.Number),
  Username: S.optional(S.String),
  UseBFile: S.optional(S.Boolean),
  UseDirectPathFullLoad: S.optional(S.Boolean),
  UseLogminerReader: S.optional(S.Boolean),
  SecretsManagerAccessRoleArn: S.optional(S.String),
  SecretsManagerSecretId: S.optional(S.String),
  SecretsManagerOracleAsmAccessRoleArn: S.optional(S.String),
  SecretsManagerOracleAsmSecretId: S.optional(S.String),
  TrimSpaceInChar: S.optional(S.Boolean),
  ConvertTimestampWithZoneToUTC: S.optional(S.Boolean),
  OpenTransactionWindow: S.optional(S.Number),
  AuthenticationMethod: S.optional(S.String),
}) {}
export class SybaseSettings extends S.Class<SybaseSettings>("SybaseSettings")({
  DatabaseName: S.optional(S.String),
  Password: S.optional(S.String),
  Port: S.optional(S.Number),
  ServerName: S.optional(S.String),
  Username: S.optional(S.String),
  SecretsManagerAccessRoleArn: S.optional(S.String),
  SecretsManagerSecretId: S.optional(S.String),
}) {}
export class MicrosoftSQLServerSettings extends S.Class<MicrosoftSQLServerSettings>(
  "MicrosoftSQLServerSettings",
)({
  Port: S.optional(S.Number),
  BcpPacketSize: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  ControlTablesFileGroup: S.optional(S.String),
  Password: S.optional(S.String),
  QuerySingleAlwaysOnNode: S.optional(S.Boolean),
  ReadBackupOnly: S.optional(S.Boolean),
  SafeguardPolicy: S.optional(S.String),
  ServerName: S.optional(S.String),
  Username: S.optional(S.String),
  UseBcpFullLoad: S.optional(S.Boolean),
  UseThirdPartyBackupDevice: S.optional(S.Boolean),
  SecretsManagerAccessRoleArn: S.optional(S.String),
  SecretsManagerSecretId: S.optional(S.String),
  TrimSpaceInChar: S.optional(S.Boolean),
  TlogAccessMode: S.optional(S.String),
  ForceLobLookup: S.optional(S.Boolean),
  AuthenticationMethod: S.optional(S.String),
}) {}
export class IBMDb2Settings extends S.Class<IBMDb2Settings>("IBMDb2Settings")({
  DatabaseName: S.optional(S.String),
  Password: S.optional(S.String),
  Port: S.optional(S.Number),
  ServerName: S.optional(S.String),
  SetDataCaptureChanges: S.optional(S.Boolean),
  CurrentLsn: S.optional(S.String),
  MaxKBytesPerRead: S.optional(S.Number),
  Username: S.optional(S.String),
  SecretsManagerAccessRoleArn: S.optional(S.String),
  SecretsManagerSecretId: S.optional(S.String),
  LoadTimeout: S.optional(S.Number),
  WriteBufferSize: S.optional(S.Number),
  MaxFileSize: S.optional(S.Number),
  KeepCsvFiles: S.optional(S.Boolean),
}) {}
export class DocDbSettings extends S.Class<DocDbSettings>("DocDbSettings")({
  Username: S.optional(S.String),
  Password: S.optional(S.String),
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  NestingLevel: S.optional(S.String),
  ExtractDocId: S.optional(S.Boolean),
  DocsToInvestigate: S.optional(S.Number),
  KmsKeyId: S.optional(S.String),
  SecretsManagerAccessRoleArn: S.optional(S.String),
  SecretsManagerSecretId: S.optional(S.String),
  UseUpdateLookUp: S.optional(S.Boolean),
  ReplicateShardCollections: S.optional(S.Boolean),
}) {}
export class RedisSettings extends S.Class<RedisSettings>("RedisSettings")({
  ServerName: S.String,
  Port: S.Number,
  SslSecurityProtocol: S.optional(S.String),
  AuthType: S.optional(S.String),
  AuthUserName: S.optional(S.String),
  AuthPassword: S.optional(S.String),
  SslCaCertificateArn: S.optional(S.String),
}) {}
export class GcpMySQLSettings extends S.Class<GcpMySQLSettings>(
  "GcpMySQLSettings",
)({
  AfterConnectScript: S.optional(S.String),
  CleanSourceMetadataOnMismatch: S.optional(S.Boolean),
  DatabaseName: S.optional(S.String),
  EventsPollInterval: S.optional(S.Number),
  TargetDbType: S.optional(S.String),
  MaxFileSize: S.optional(S.Number),
  ParallelLoadThreads: S.optional(S.Number),
  Password: S.optional(S.String),
  Port: S.optional(S.Number),
  ServerName: S.optional(S.String),
  ServerTimezone: S.optional(S.String),
  Username: S.optional(S.String),
  SecretsManagerAccessRoleArn: S.optional(S.String),
  SecretsManagerSecretId: S.optional(S.String),
}) {}
export class TimestreamSettings extends S.Class<TimestreamSettings>(
  "TimestreamSettings",
)({
  DatabaseName: S.String,
  MemoryDuration: S.Number,
  MagneticDuration: S.Number,
  CdcInsertsAndUpdates: S.optional(S.Boolean),
  EnableMagneticStoreWrites: S.optional(S.Boolean),
}) {}
export class ModifyEndpointMessage extends S.Class<ModifyEndpointMessage>(
  "ModifyEndpointMessage",
)(
  {
    EndpointArn: S.String,
    EndpointIdentifier: S.optional(S.String),
    EndpointType: S.optional(S.String),
    EngineName: S.optional(S.String),
    Username: S.optional(S.String),
    Password: S.optional(S.String),
    ServerName: S.optional(S.String),
    Port: S.optional(S.Number),
    DatabaseName: S.optional(S.String),
    ExtraConnectionAttributes: S.optional(S.String),
    CertificateArn: S.optional(S.String),
    SslMode: S.optional(S.String),
    ServiceAccessRoleArn: S.optional(S.String),
    ExternalTableDefinition: S.optional(S.String),
    DynamoDbSettings: S.optional(DynamoDbSettings),
    S3Settings: S.optional(S3Settings),
    DmsTransferSettings: S.optional(DmsTransferSettings),
    MongoDbSettings: S.optional(MongoDbSettings),
    KinesisSettings: S.optional(KinesisSettings),
    KafkaSettings: S.optional(KafkaSettings),
    ElasticsearchSettings: S.optional(ElasticsearchSettings),
    NeptuneSettings: S.optional(NeptuneSettings),
    RedshiftSettings: S.optional(RedshiftSettings),
    PostgreSQLSettings: S.optional(PostgreSQLSettings),
    MySQLSettings: S.optional(MySQLSettings),
    OracleSettings: S.optional(OracleSettings),
    SybaseSettings: S.optional(SybaseSettings),
    MicrosoftSQLServerSettings: S.optional(MicrosoftSQLServerSettings),
    IBMDb2Settings: S.optional(IBMDb2Settings),
    DocDbSettings: S.optional(DocDbSettings),
    RedisSettings: S.optional(RedisSettings),
    ExactSettings: S.optional(S.Boolean),
    GcpMySQLSettings: S.optional(GcpMySQLSettings),
    TimestreamSettings: S.optional(TimestreamSettings),
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
export class ModifyInstanceProfileMessage extends S.Class<ModifyInstanceProfileMessage>(
  "ModifyInstanceProfileMessage",
)(
  {
    InstanceProfileIdentifier: S.String,
    AvailabilityZone: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    InstanceProfileName: S.optional(S.String),
    Description: S.optional(S.String),
    SubnetGroupIdentifier: S.optional(S.String),
    VpcSecurityGroups: S.optional(StringList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DataProviderDescriptorDefinition extends S.Class<DataProviderDescriptorDefinition>(
  "DataProviderDescriptorDefinition",
)({
  DataProviderIdentifier: S.String,
  SecretsManagerSecretId: S.optional(S.String),
  SecretsManagerAccessRoleArn: S.optional(S.String),
}) {}
export const DataProviderDescriptorDefinitionList = S.Array(
  DataProviderDescriptorDefinition,
);
export class SCApplicationAttributes extends S.Class<SCApplicationAttributes>(
  "SCApplicationAttributes",
)({
  S3BucketPath: S.optional(S.String),
  S3BucketRoleArn: S.optional(S.String),
}) {}
export class ModifyMigrationProjectMessage extends S.Class<ModifyMigrationProjectMessage>(
  "ModifyMigrationProjectMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    MigrationProjectName: S.optional(S.String),
    SourceDataProviderDescriptors: S.optional(
      DataProviderDescriptorDefinitionList,
    ),
    TargetDataProviderDescriptors: S.optional(
      DataProviderDescriptorDefinitionList,
    ),
    InstanceProfileIdentifier: S.optional(S.String),
    TransformationRules: S.optional(S.String),
    Description: S.optional(S.String),
    SchemaConversionApplicationAttributes: S.optional(SCApplicationAttributes),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ComputeConfig extends S.Class<ComputeConfig>("ComputeConfig")({
  AvailabilityZone: S.optional(S.String),
  DnsNameServers: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  MaxCapacityUnits: S.optional(S.Number),
  MinCapacityUnits: S.optional(S.Number),
  MultiAZ: S.optional(S.Boolean),
  PreferredMaintenanceWindow: S.optional(S.String),
  ReplicationSubnetGroupId: S.optional(S.String),
  VpcSecurityGroupIds: S.optional(StringList),
}) {}
export class ModifyReplicationConfigMessage extends S.Class<ModifyReplicationConfigMessage>(
  "ModifyReplicationConfigMessage",
)(
  {
    ReplicationConfigArn: S.String,
    ReplicationConfigIdentifier: S.optional(S.String),
    ReplicationType: S.optional(S.String),
    TableMappings: S.optional(S.String),
    ReplicationSettings: S.optional(S.String),
    SupplementalSettings: S.optional(S.String),
    ComputeConfig: S.optional(ComputeConfig),
    SourceEndpointArn: S.optional(S.String),
    TargetEndpointArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class KerberosAuthenticationSettings extends S.Class<KerberosAuthenticationSettings>(
  "KerberosAuthenticationSettings",
)({
  KeyCacheSecretId: S.optional(S.String),
  KeyCacheSecretIamArn: S.optional(S.String),
  Krb5FileContents: S.optional(S.String),
}) {}
export class ModifyReplicationInstanceMessage extends S.Class<ModifyReplicationInstanceMessage>(
  "ModifyReplicationInstanceMessage",
)(
  {
    ReplicationInstanceArn: S.String,
    AllocatedStorage: S.optional(S.Number),
    ApplyImmediately: S.optional(S.Boolean),
    ReplicationInstanceClass: S.optional(S.String),
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    PreferredMaintenanceWindow: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    AllowMajorVersionUpgrade: S.optional(S.Boolean),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    ReplicationInstanceIdentifier: S.optional(S.String),
    NetworkType: S.optional(S.String),
    KerberosAuthenticationSettings: S.optional(KerberosAuthenticationSettings),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyReplicationSubnetGroupMessage extends S.Class<ModifyReplicationSubnetGroupMessage>(
  "ModifyReplicationSubnetGroupMessage",
)(
  {
    ReplicationSubnetGroupIdentifier: S.String,
    ReplicationSubnetGroupDescription: S.optional(S.String),
    SubnetIds: SubnetIdentifierList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyReplicationTaskMessage extends S.Class<ModifyReplicationTaskMessage>(
  "ModifyReplicationTaskMessage",
)(
  {
    ReplicationTaskArn: S.String,
    ReplicationTaskIdentifier: S.optional(S.String),
    MigrationType: S.optional(S.String),
    TableMappings: S.optional(S.String),
    ReplicationTaskSettings: S.optional(S.String),
    CdcStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CdcStartPosition: S.optional(S.String),
    CdcStopPosition: S.optional(S.String),
    TaskData: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class MoveReplicationTaskMessage extends S.Class<MoveReplicationTaskMessage>(
  "MoveReplicationTaskMessage",
)(
  { ReplicationTaskArn: S.String, TargetReplicationInstanceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootReplicationInstanceMessage extends S.Class<RebootReplicationInstanceMessage>(
  "RebootReplicationInstanceMessage",
)(
  {
    ReplicationInstanceArn: S.String,
    ForceFailover: S.optional(S.Boolean),
    ForcePlannedFailover: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RefreshSchemasMessage extends S.Class<RefreshSchemasMessage>(
  "RefreshSchemasMessage",
)(
  { EndpointArn: S.String, ReplicationInstanceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TableToReload extends S.Class<TableToReload>("TableToReload")({
  SchemaName: S.String,
  TableName: S.String,
}) {}
export const TableListToReload = S.Array(TableToReload);
export class ReloadTablesMessage extends S.Class<ReloadTablesMessage>(
  "ReloadTablesMessage",
)(
  {
    ReplicationTaskArn: S.String,
    TablesToReload: TableListToReload,
    ReloadOption: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsFromResourceMessage extends S.Class<RemoveTagsFromResourceMessage>(
  "RemoveTagsFromResourceMessage",
)(
  { ResourceArn: S.String, TagKeys: KeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsFromResourceResponse extends S.Class<RemoveTagsFromResourceResponse>(
  "RemoveTagsFromResourceResponse",
)({}, ns) {}
export class RunFleetAdvisorLsaAnalysisResponse extends S.Class<RunFleetAdvisorLsaAnalysisResponse>(
  "RunFleetAdvisorLsaAnalysisResponse",
)({ LsaAnalysisId: S.optional(S.String), Status: S.optional(S.String) }, ns) {}
export class StartDataMigrationMessage extends S.Class<StartDataMigrationMessage>(
  "StartDataMigrationMessage",
)(
  { DataMigrationIdentifier: S.String, StartType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartExtensionPackAssociationMessage extends S.Class<StartExtensionPackAssociationMessage>(
  "StartExtensionPackAssociationMessage",
)(
  { MigrationProjectIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMetadataModelAssessmentMessage extends S.Class<StartMetadataModelAssessmentMessage>(
  "StartMetadataModelAssessmentMessage",
)(
  { MigrationProjectIdentifier: S.String, SelectionRules: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMetadataModelConversionMessage extends S.Class<StartMetadataModelConversionMessage>(
  "StartMetadataModelConversionMessage",
)(
  { MigrationProjectIdentifier: S.String, SelectionRules: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMetadataModelExportAsScriptMessage extends S.Class<StartMetadataModelExportAsScriptMessage>(
  "StartMetadataModelExportAsScriptMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    SelectionRules: S.String,
    Origin: S.String,
    FileName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMetadataModelExportToTargetMessage extends S.Class<StartMetadataModelExportToTargetMessage>(
  "StartMetadataModelExportToTargetMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    SelectionRules: S.String,
    OverwriteExtensionPack: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMetadataModelImportMessage extends S.Class<StartMetadataModelImportMessage>(
  "StartMetadataModelImportMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    SelectionRules: S.String,
    Origin: S.String,
    Refresh: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartReplicationMessage extends S.Class<StartReplicationMessage>(
  "StartReplicationMessage",
)(
  {
    ReplicationConfigArn: S.String,
    StartReplicationType: S.String,
    PremigrationAssessmentSettings: S.optional(S.String),
    CdcStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CdcStartPosition: S.optional(S.String),
    CdcStopPosition: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartReplicationTaskMessage extends S.Class<StartReplicationTaskMessage>(
  "StartReplicationTaskMessage",
)(
  {
    ReplicationTaskArn: S.String,
    StartReplicationTaskType: S.String,
    CdcStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CdcStartPosition: S.optional(S.String),
    CdcStopPosition: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartReplicationTaskAssessmentMessage extends S.Class<StartReplicationTaskAssessmentMessage>(
  "StartReplicationTaskAssessmentMessage",
)(
  { ReplicationTaskArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartReplicationTaskAssessmentRunMessage extends S.Class<StartReplicationTaskAssessmentRunMessage>(
  "StartReplicationTaskAssessmentRunMessage",
)(
  {
    ReplicationTaskArn: S.String,
    ServiceAccessRoleArn: S.String,
    ResultLocationBucket: S.String,
    ResultLocationFolder: S.optional(S.String),
    ResultEncryptionMode: S.optional(S.String),
    ResultKmsKeyArn: S.optional(S.String),
    AssessmentRunName: S.String,
    IncludeOnly: S.optional(IncludeTestList),
    Exclude: S.optional(ExcludeTestList),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopDataMigrationMessage extends S.Class<StopDataMigrationMessage>(
  "StopDataMigrationMessage",
)(
  { DataMigrationIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopReplicationMessage extends S.Class<StopReplicationMessage>(
  "StopReplicationMessage",
)(
  { ReplicationConfigArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopReplicationTaskMessage extends S.Class<StopReplicationTaskMessage>(
  "StopReplicationTaskMessage",
)(
  { ReplicationTaskArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TestConnectionMessage extends S.Class<TestConnectionMessage>(
  "TestConnectionMessage",
)(
  { ReplicationInstanceArn: S.String, EndpointArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSubscriptionsToEventBridgeMessage extends S.Class<UpdateSubscriptionsToEventBridgeMessage>(
  "UpdateSubscriptionsToEventBridgeMessage",
)(
  { ForceMove: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RecommendationSettings extends S.Class<RecommendationSettings>(
  "RecommendationSettings",
)({ InstanceSizingType: S.String, WorkloadType: S.String }) {}
export class StartRecommendationsRequestEntry extends S.Class<StartRecommendationsRequestEntry>(
  "StartRecommendationsRequestEntry",
)({ DatabaseId: S.String, Settings: RecommendationSettings }) {}
export const StartRecommendationsRequestEntryList = S.Array(
  StartRecommendationsRequestEntry,
);
export class AccountQuota extends S.Class<AccountQuota>("AccountQuota")({
  AccountQuotaName: S.optional(S.String),
  Used: S.optional(S.Number),
  Max: S.optional(S.Number),
}) {}
export const AccountQuotaList = S.Array(
  AccountQuota.pipe(T.XmlName("AccountQuota")),
);
export const IndividualAssessmentNameList = S.Array(S.String);
export class Connection extends S.Class<Connection>("Connection")({
  ReplicationInstanceArn: S.optional(S.String),
  EndpointArn: S.optional(S.String),
  Status: S.optional(S.String),
  LastFailureMessage: S.optional(S.String),
  EndpointIdentifier: S.optional(S.String),
  ReplicationInstanceIdentifier: S.optional(S.String),
}) {}
export const ConnectionList = S.Array(Connection.pipe(T.XmlName("Connection")));
export class DataMigrationSettings extends S.Class<DataMigrationSettings>(
  "DataMigrationSettings",
)({
  NumberOfJobs: S.optional(S.Number),
  CloudwatchLogsEnabled: S.optional(S.Boolean),
  SelectionRules: S.optional(S.String),
}) {}
export class DataMigrationStatistics extends S.Class<DataMigrationStatistics>(
  "DataMigrationStatistics",
)({
  TablesLoaded: S.optional(S.Number),
  ElapsedTimeMillis: S.optional(S.Number),
  TablesLoading: S.optional(S.Number),
  FullLoadPercentage: S.optional(S.Number),
  CDCLatency: S.optional(S.Number),
  TablesQueued: S.optional(S.Number),
  TablesErrored: S.optional(S.Number),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StopTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const PublicIpAddressList = S.Array(S.String);
export const DataMigrationCidrBlock = S.Array(S.String);
export class DataMigration extends S.Class<DataMigration>("DataMigration")({
  DataMigrationName: S.optional(S.String),
  DataMigrationArn: S.optional(S.String),
  DataMigrationCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  DataMigrationStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  DataMigrationEndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ServiceAccessRoleArn: S.optional(S.String),
  MigrationProjectArn: S.optional(S.String),
  DataMigrationType: S.optional(S.String),
  DataMigrationSettings: S.optional(DataMigrationSettings),
  SourceDataSettings: S.optional(SourceDataSettings),
  TargetDataSettings: S.optional(TargetDataSettings),
  DataMigrationStatistics: S.optional(DataMigrationStatistics),
  DataMigrationStatus: S.optional(S.String),
  PublicIpAddresses: S.optional(PublicIpAddressList),
  DataMigrationCidrBlocks: S.optional(DataMigrationCidrBlock),
  LastFailureMessage: S.optional(S.String),
  StopReason: S.optional(S.String),
}) {}
export const DataMigrations = S.Array(DataMigration);
export class DataProvider extends S.Class<DataProvider>("DataProvider")({
  DataProviderName: S.optional(S.String),
  DataProviderArn: S.optional(S.String),
  DataProviderCreationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  Description: S.optional(S.String),
  Engine: S.optional(S.String),
  Virtual: S.optional(S.Boolean),
  Settings: S.optional(DataProviderSettings),
}) {}
export const DataProviderList = S.Array(
  DataProvider.pipe(T.XmlName("DataProvider")),
);
export class LakehouseSettings extends S.Class<LakehouseSettings>(
  "LakehouseSettings",
)({ Arn: S.String }) {}
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  EndpointIdentifier: S.optional(S.String),
  EndpointType: S.optional(S.String),
  EngineName: S.optional(S.String),
  EngineDisplayName: S.optional(S.String),
  Username: S.optional(S.String),
  ServerName: S.optional(S.String),
  Port: S.optional(S.Number),
  DatabaseName: S.optional(S.String),
  ExtraConnectionAttributes: S.optional(S.String),
  Status: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  EndpointArn: S.optional(S.String),
  CertificateArn: S.optional(S.String),
  SslMode: S.optional(S.String),
  ServiceAccessRoleArn: S.optional(S.String),
  ExternalTableDefinition: S.optional(S.String),
  ExternalId: S.optional(S.String),
  IsReadOnly: S.optional(S.Boolean),
  DynamoDbSettings: S.optional(DynamoDbSettings),
  S3Settings: S.optional(S3Settings),
  DmsTransferSettings: S.optional(DmsTransferSettings),
  MongoDbSettings: S.optional(MongoDbSettings),
  KinesisSettings: S.optional(KinesisSettings),
  KafkaSettings: S.optional(KafkaSettings),
  ElasticsearchSettings: S.optional(ElasticsearchSettings),
  NeptuneSettings: S.optional(NeptuneSettings),
  RedshiftSettings: S.optional(RedshiftSettings),
  PostgreSQLSettings: S.optional(PostgreSQLSettings),
  MySQLSettings: S.optional(MySQLSettings),
  OracleSettings: S.optional(OracleSettings),
  SybaseSettings: S.optional(SybaseSettings),
  MicrosoftSQLServerSettings: S.optional(MicrosoftSQLServerSettings),
  IBMDb2Settings: S.optional(IBMDb2Settings),
  DocDbSettings: S.optional(DocDbSettings),
  RedisSettings: S.optional(RedisSettings),
  GcpMySQLSettings: S.optional(GcpMySQLSettings),
  TimestreamSettings: S.optional(TimestreamSettings),
  LakehouseSettings: S.optional(LakehouseSettings),
}) {}
export const EndpointList = S.Array(Endpoint.pipe(T.XmlName("Endpoint")));
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
}) {}
export const EventSubscriptionsList = S.Array(
  EventSubscription.pipe(T.XmlName("EventSubscription")),
);
export class DefaultErrorDetails extends S.Class<DefaultErrorDetails>(
  "DefaultErrorDetails",
)({ Message: S.optional(S.String) }) {}
export const ErrorDetails = S.Union(
  S.Struct({ defaultErrorDetails: DefaultErrorDetails }),
);
export class ExportSqlDetails extends S.Class<ExportSqlDetails>(
  "ExportSqlDetails",
)({ S3ObjectKey: S.optional(S.String), ObjectURL: S.optional(S.String) }) {}
export class ProcessedObject extends S.Class<ProcessedObject>(
  "ProcessedObject",
)({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  EndpointType: S.optional(S.String),
}) {}
export class Progress extends S.Class<Progress>("Progress")({
  ProgressPercent: S.optional(S.Number),
  TotalObjects: S.optional(S.Number),
  ProgressStep: S.optional(S.String),
  ProcessedObject: S.optional(ProcessedObject),
}) {}
export class SchemaConversionRequest extends S.Class<SchemaConversionRequest>(
  "SchemaConversionRequest",
)({
  Status: S.optional(S.String),
  RequestIdentifier: S.optional(S.String),
  MigrationProjectArn: S.optional(S.String),
  Error: S.optional(ErrorDetails),
  ExportSqlDetails: S.optional(ExportSqlDetails),
  Progress: S.optional(Progress),
}) {}
export const SchemaConversionRequestList = S.Array(SchemaConversionRequest);
export class InstanceProfile extends S.Class<InstanceProfile>(
  "InstanceProfile",
)({
  InstanceProfileArn: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  PubliclyAccessible: S.optional(S.Boolean),
  NetworkType: S.optional(S.String),
  InstanceProfileName: S.optional(S.String),
  Description: S.optional(S.String),
  InstanceProfileCreationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  SubnetGroupIdentifier: S.optional(S.String),
  VpcSecurityGroups: S.optional(StringList),
}) {}
export const InstanceProfileList = S.Array(
  InstanceProfile.pipe(T.XmlName("InstanceProfile")),
);
export class DataProviderDescriptor extends S.Class<DataProviderDescriptor>(
  "DataProviderDescriptor",
)({
  SecretsManagerSecretId: S.optional(S.String),
  SecretsManagerAccessRoleArn: S.optional(S.String),
  DataProviderName: S.optional(S.String),
  DataProviderArn: S.optional(S.String),
}) {}
export const DataProviderDescriptorList = S.Array(DataProviderDescriptor);
export class MigrationProject extends S.Class<MigrationProject>(
  "MigrationProject",
)({
  MigrationProjectName: S.optional(S.String),
  MigrationProjectArn: S.optional(S.String),
  MigrationProjectCreationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  SourceDataProviderDescriptors: S.optional(DataProviderDescriptorList),
  TargetDataProviderDescriptors: S.optional(DataProviderDescriptorList),
  InstanceProfileArn: S.optional(S.String),
  InstanceProfileName: S.optional(S.String),
  TransformationRules: S.optional(S.String),
  Description: S.optional(S.String),
  SchemaConversionApplicationAttributes: S.optional(SCApplicationAttributes),
}) {}
export const MigrationProjectList = S.Array(
  MigrationProject.pipe(T.XmlName("MigrationProject")),
);
export class PendingMaintenanceAction extends S.Class<PendingMaintenanceAction>(
  "PendingMaintenanceAction",
)({
  Action: S.optional(S.String),
  AutoAppliedAfterDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ForcedApplyDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  OptInStatus: S.optional(S.String),
  CurrentApplyDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
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
export class ReplicationConfig extends S.Class<ReplicationConfig>(
  "ReplicationConfig",
)({
  ReplicationConfigIdentifier: S.optional(S.String),
  ReplicationConfigArn: S.optional(S.String),
  SourceEndpointArn: S.optional(S.String),
  TargetEndpointArn: S.optional(S.String),
  ReplicationType: S.optional(S.String),
  ComputeConfig: S.optional(ComputeConfig),
  ReplicationSettings: S.optional(S.String),
  SupplementalSettings: S.optional(S.String),
  TableMappings: S.optional(S.String),
  ReplicationConfigCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ReplicationConfigUpdateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  IsReadOnly: S.optional(S.Boolean),
}) {}
export const ReplicationConfigList = S.Array(
  ReplicationConfig.pipe(T.XmlName("ReplicationConfig")),
);
export class VpcSecurityGroupMembership extends S.Class<VpcSecurityGroupMembership>(
  "VpcSecurityGroupMembership",
)({ VpcSecurityGroupId: S.optional(S.String), Status: S.optional(S.String) }) {}
export const VpcSecurityGroupMembershipList = S.Array(
  VpcSecurityGroupMembership.pipe(T.XmlName("VpcSecurityGroupMembership")),
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
export class ReplicationSubnetGroup extends S.Class<ReplicationSubnetGroup>(
  "ReplicationSubnetGroup",
)({
  ReplicationSubnetGroupIdentifier: S.optional(S.String),
  ReplicationSubnetGroupDescription: S.optional(S.String),
  VpcId: S.optional(S.String),
  SubnetGroupStatus: S.optional(S.String),
  Subnets: S.optional(SubnetList),
  SupportedNetworkTypes: S.optional(StringList),
  IsReadOnly: S.optional(S.Boolean),
}) {}
export class ReplicationPendingModifiedValues extends S.Class<ReplicationPendingModifiedValues>(
  "ReplicationPendingModifiedValues",
)({
  ReplicationInstanceClass: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  MultiAZ: S.optional(S.Boolean),
  EngineVersion: S.optional(S.String),
  NetworkType: S.optional(S.String),
}) {}
export const ReplicationInstancePublicIpAddressList = S.Array(S.String);
export const ReplicationInstancePrivateIpAddressList = S.Array(S.String);
export const ReplicationInstanceIpv6AddressList = S.Array(S.String);
export class ReplicationInstance extends S.Class<ReplicationInstance>(
  "ReplicationInstance",
)({
  ReplicationInstanceIdentifier: S.optional(S.String),
  ReplicationInstanceClass: S.optional(S.String),
  ReplicationInstanceStatus: S.optional(S.String),
  AllocatedStorage: S.optional(S.Number),
  InstanceCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  VpcSecurityGroups: S.optional(VpcSecurityGroupMembershipList),
  AvailabilityZone: S.optional(S.String),
  ReplicationSubnetGroup: S.optional(ReplicationSubnetGroup),
  PreferredMaintenanceWindow: S.optional(S.String),
  PendingModifiedValues: S.optional(ReplicationPendingModifiedValues),
  MultiAZ: S.optional(S.Boolean),
  EngineVersion: S.optional(S.String),
  AutoMinorVersionUpgrade: S.optional(S.Boolean),
  KmsKeyId: S.optional(S.String),
  ReplicationInstanceArn: S.optional(S.String),
  ReplicationInstancePublicIpAddress: S.optional(S.String),
  ReplicationInstancePrivateIpAddress: S.optional(S.String),
  ReplicationInstancePublicIpAddresses: S.optional(
    ReplicationInstancePublicIpAddressList,
  ),
  ReplicationInstancePrivateIpAddresses: S.optional(
    ReplicationInstancePrivateIpAddressList,
  ),
  ReplicationInstanceIpv6Addresses: S.optional(
    ReplicationInstanceIpv6AddressList,
  ),
  PubliclyAccessible: S.optional(S.Boolean),
  SecondaryAvailabilityZone: S.optional(S.String),
  FreeUntil: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DnsNameServers: S.optional(S.String),
  NetworkType: S.optional(S.String),
  KerberosAuthenticationSettings: S.optional(KerberosAuthenticationSettings),
}) {}
export const ReplicationInstanceList = S.Array(
  ReplicationInstance.pipe(T.XmlName("ReplicationInstance")),
);
export const ReplicationSubnetGroups = S.Array(
  ReplicationSubnetGroup.pipe(T.XmlName("ReplicationSubnetGroup")),
);
export class ReplicationTaskAssessmentRunProgress extends S.Class<ReplicationTaskAssessmentRunProgress>(
  "ReplicationTaskAssessmentRunProgress",
)({
  IndividualAssessmentCount: S.optional(S.Number),
  IndividualAssessmentCompletedCount: S.optional(S.Number),
}) {}
export class ReplicationTaskAssessmentRunResultStatistic extends S.Class<ReplicationTaskAssessmentRunResultStatistic>(
  "ReplicationTaskAssessmentRunResultStatistic",
)({
  Passed: S.optional(S.Number),
  Failed: S.optional(S.Number),
  Error: S.optional(S.Number),
  Warning: S.optional(S.Number),
  Cancelled: S.optional(S.Number),
  Skipped: S.optional(S.Number),
}) {}
export class ReplicationTaskAssessmentRun extends S.Class<ReplicationTaskAssessmentRun>(
  "ReplicationTaskAssessmentRun",
)({
  ReplicationTaskAssessmentRunArn: S.optional(S.String),
  ReplicationTaskArn: S.optional(S.String),
  Status: S.optional(S.String),
  ReplicationTaskAssessmentRunCreationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AssessmentProgress: S.optional(ReplicationTaskAssessmentRunProgress),
  LastFailureMessage: S.optional(S.String),
  ServiceAccessRoleArn: S.optional(S.String),
  ResultLocationBucket: S.optional(S.String),
  ResultLocationFolder: S.optional(S.String),
  ResultEncryptionMode: S.optional(S.String),
  ResultKmsKeyArn: S.optional(S.String),
  AssessmentRunName: S.optional(S.String),
  IsLatestTaskAssessmentRun: S.optional(S.Boolean),
  ResultStatistic: S.optional(ReplicationTaskAssessmentRunResultStatistic),
}) {}
export const ReplicationTaskAssessmentRunList = S.Array(
  ReplicationTaskAssessmentRun,
);
export class ReplicationTaskStats extends S.Class<ReplicationTaskStats>(
  "ReplicationTaskStats",
)({
  FullLoadProgressPercent: S.optional(S.Number),
  ElapsedTimeMillis: S.optional(S.Number),
  TablesLoaded: S.optional(S.Number),
  TablesLoading: S.optional(S.Number),
  TablesQueued: S.optional(S.Number),
  TablesErrored: S.optional(S.Number),
  FreshStartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StopDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FullLoadStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  FullLoadFinishDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ReplicationTask extends S.Class<ReplicationTask>(
  "ReplicationTask",
)({
  ReplicationTaskIdentifier: S.optional(S.String),
  SourceEndpointArn: S.optional(S.String),
  TargetEndpointArn: S.optional(S.String),
  ReplicationInstanceArn: S.optional(S.String),
  MigrationType: S.optional(S.String),
  TableMappings: S.optional(S.String),
  ReplicationTaskSettings: S.optional(S.String),
  Status: S.optional(S.String),
  LastFailureMessage: S.optional(S.String),
  StopReason: S.optional(S.String),
  ReplicationTaskCreationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ReplicationTaskStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CdcStartPosition: S.optional(S.String),
  CdcStopPosition: S.optional(S.String),
  RecoveryCheckpoint: S.optional(S.String),
  ReplicationTaskArn: S.optional(S.String),
  ReplicationTaskStats: S.optional(ReplicationTaskStats),
  TaskData: S.optional(S.String),
  TargetReplicationInstanceArn: S.optional(S.String),
}) {}
export const ReplicationTaskList = S.Array(
  ReplicationTask.pipe(T.XmlName("ReplicationTask")),
);
export const SchemaList = S.Array(S.String);
export class TableStatistics extends S.Class<TableStatistics>(
  "TableStatistics",
)({
  SchemaName: S.optional(S.String),
  TableName: S.optional(S.String),
  Inserts: S.optional(S.Number),
  Deletes: S.optional(S.Number),
  Updates: S.optional(S.Number),
  Ddls: S.optional(S.Number),
  AppliedInserts: S.optional(S.Number),
  AppliedDeletes: S.optional(S.Number),
  AppliedUpdates: S.optional(S.Number),
  AppliedDdls: S.optional(S.Number),
  FullLoadRows: S.optional(S.Number),
  FullLoadCondtnlChkFailedRows: S.optional(S.Number),
  FullLoadErrorRows: S.optional(S.Number),
  FullLoadStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  FullLoadEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FullLoadReloaded: S.optional(S.Boolean),
  LastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TableState: S.optional(S.String),
  ValidationPendingRecords: S.optional(S.Number),
  ValidationFailedRecords: S.optional(S.Number),
  ValidationSuspendedRecords: S.optional(S.Number),
  ValidationState: S.optional(S.String),
  ValidationStateDetails: S.optional(S.String),
  ResyncState: S.optional(S.String),
  ResyncRowsAttempted: S.optional(S.Number),
  ResyncRowsSucceeded: S.optional(S.Number),
  ResyncRowsFailed: S.optional(S.Number),
  ResyncProgress: S.optional(S.Number),
}) {}
export const TableStatisticsList = S.Array(TableStatistics);
export class AddTagsToResourceMessage extends S.Class<AddTagsToResourceMessage>(
  "AddTagsToResourceMessage",
)(
  { ResourceArn: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddTagsToResourceResponse extends S.Class<AddTagsToResourceResponse>(
  "AddTagsToResourceResponse",
)({}, ns) {}
export class BatchStartRecommendationsRequest extends S.Class<BatchStartRecommendationsRequest>(
  "BatchStartRecommendationsRequest",
)(
  { Data: S.optional(StartRecommendationsRequestEntryList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelMetadataModelCreationResponse extends S.Class<CancelMetadataModelCreationResponse>(
  "CancelMetadataModelCreationResponse",
)({ Request: S.optional(SchemaConversionRequest) }, ns) {}
export class CreateDataMigrationMessage extends S.Class<CreateDataMigrationMessage>(
  "CreateDataMigrationMessage",
)(
  {
    DataMigrationName: S.optional(S.String),
    MigrationProjectIdentifier: S.String,
    DataMigrationType: S.String,
    ServiceAccessRoleArn: S.String,
    EnableCloudwatchLogs: S.optional(S.Boolean),
    SourceDataSettings: S.optional(SourceDataSettings),
    TargetDataSettings: S.optional(TargetDataSettings),
    NumberOfJobs: S.optional(S.Number),
    Tags: S.optional(TagList),
    SelectionRules: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEndpointMessage extends S.Class<CreateEndpointMessage>(
  "CreateEndpointMessage",
)(
  {
    EndpointIdentifier: S.String,
    EndpointType: S.String,
    EngineName: S.String,
    Username: S.optional(S.String),
    Password: S.optional(S.String),
    ServerName: S.optional(S.String),
    Port: S.optional(S.Number),
    DatabaseName: S.optional(S.String),
    ExtraConnectionAttributes: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
    CertificateArn: S.optional(S.String),
    SslMode: S.optional(S.String),
    ServiceAccessRoleArn: S.optional(S.String),
    ExternalTableDefinition: S.optional(S.String),
    DynamoDbSettings: S.optional(DynamoDbSettings),
    S3Settings: S.optional(S3Settings),
    DmsTransferSettings: S.optional(DmsTransferSettings),
    MongoDbSettings: S.optional(MongoDbSettings),
    KinesisSettings: S.optional(KinesisSettings),
    KafkaSettings: S.optional(KafkaSettings),
    ElasticsearchSettings: S.optional(ElasticsearchSettings),
    NeptuneSettings: S.optional(NeptuneSettings),
    RedshiftSettings: S.optional(RedshiftSettings),
    PostgreSQLSettings: S.optional(PostgreSQLSettings),
    MySQLSettings: S.optional(MySQLSettings),
    OracleSettings: S.optional(OracleSettings),
    SybaseSettings: S.optional(SybaseSettings),
    MicrosoftSQLServerSettings: S.optional(MicrosoftSQLServerSettings),
    IBMDb2Settings: S.optional(IBMDb2Settings),
    ResourceIdentifier: S.optional(S.String),
    DocDbSettings: S.optional(DocDbSettings),
    RedisSettings: S.optional(RedisSettings),
    GcpMySQLSettings: S.optional(GcpMySQLSettings),
    TimestreamSettings: S.optional(TimestreamSettings),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFleetAdvisorCollectorResponse extends S.Class<CreateFleetAdvisorCollectorResponse>(
  "CreateFleetAdvisorCollectorResponse",
)(
  {
    CollectorReferencedId: S.optional(S.String),
    CollectorName: S.optional(S.String),
    Description: S.optional(S.String),
    ServiceAccessRoleArn: S.optional(S.String),
    S3BucketName: S.optional(S.String),
  },
  ns,
) {}
export class CreateMigrationProjectMessage extends S.Class<CreateMigrationProjectMessage>(
  "CreateMigrationProjectMessage",
)(
  {
    MigrationProjectName: S.optional(S.String),
    SourceDataProviderDescriptors: DataProviderDescriptorDefinitionList,
    TargetDataProviderDescriptors: DataProviderDescriptorDefinitionList,
    InstanceProfileIdentifier: S.String,
    TransformationRules: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
    SchemaConversionApplicationAttributes: S.optional(SCApplicationAttributes),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateReplicationConfigMessage extends S.Class<CreateReplicationConfigMessage>(
  "CreateReplicationConfigMessage",
)(
  {
    ReplicationConfigIdentifier: S.String,
    SourceEndpointArn: S.String,
    TargetEndpointArn: S.String,
    ComputeConfig: ComputeConfig,
    ReplicationType: S.String,
    TableMappings: S.String,
    ReplicationSettings: S.optional(S.String),
    SupplementalSettings: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateReplicationInstanceMessage extends S.Class<CreateReplicationInstanceMessage>(
  "CreateReplicationInstanceMessage",
)(
  {
    ReplicationInstanceIdentifier: S.String,
    AllocatedStorage: S.optional(S.Number),
    ReplicationInstanceClass: S.String,
    VpcSecurityGroupIds: S.optional(VpcSecurityGroupIdList),
    AvailabilityZone: S.optional(S.String),
    ReplicationSubnetGroupIdentifier: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    MultiAZ: S.optional(S.Boolean),
    EngineVersion: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    PubliclyAccessible: S.optional(S.Boolean),
    DnsNameServers: S.optional(S.String),
    ResourceIdentifier: S.optional(S.String),
    NetworkType: S.optional(S.String),
    KerberosAuthenticationSettings: S.optional(KerberosAuthenticationSettings),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEventSubscriptionResponse extends S.Class<DeleteEventSubscriptionResponse>(
  "DeleteEventSubscriptionResponse",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class DeleteFleetAdvisorDatabasesResponse extends S.Class<DeleteFleetAdvisorDatabasesResponse>(
  "DeleteFleetAdvisorDatabasesResponse",
)({ DatabaseIds: S.optional(StringList) }, ns) {}
export class DeleteInstanceProfileResponse extends S.Class<DeleteInstanceProfileResponse>(
  "DeleteInstanceProfileResponse",
)({ InstanceProfile: S.optional(InstanceProfile) }, ns) {}
export class DeleteReplicationTaskResponse extends S.Class<DeleteReplicationTaskResponse>(
  "DeleteReplicationTaskResponse",
)({ ReplicationTask: S.optional(ReplicationTask) }, ns) {}
export class DeleteReplicationTaskAssessmentRunResponse extends S.Class<DeleteReplicationTaskAssessmentRunResponse>(
  "DeleteReplicationTaskAssessmentRunResponse",
)(
  { ReplicationTaskAssessmentRun: S.optional(ReplicationTaskAssessmentRun) },
  ns,
) {}
export class DescribeAccountAttributesResponse extends S.Class<DescribeAccountAttributesResponse>(
  "DescribeAccountAttributesResponse",
)(
  {
    AccountQuotas: S.optional(AccountQuotaList),
    UniqueAccountIdentifier: S.optional(S.String),
  },
  ns,
) {}
export class DescribeApplicableIndividualAssessmentsResponse extends S.Class<DescribeApplicableIndividualAssessmentsResponse>(
  "DescribeApplicableIndividualAssessmentsResponse",
)(
  {
    IndividualAssessmentNames: S.optional(IndividualAssessmentNameList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeCertificatesMessage extends S.Class<DescribeCertificatesMessage>(
  "DescribeCertificatesMessage",
)(
  {
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConnectionsResponse extends S.Class<DescribeConnectionsResponse>(
  "DescribeConnectionsResponse",
)(
  { Marker: S.optional(S.String), Connections: S.optional(ConnectionList) },
  ns,
) {}
export class DescribeConversionConfigurationResponse extends S.Class<DescribeConversionConfigurationResponse>(
  "DescribeConversionConfigurationResponse",
)(
  {
    MigrationProjectIdentifier: S.optional(S.String),
    ConversionConfiguration: S.optional(S.String),
  },
  ns,
) {}
export class DescribeDataMigrationsResponse extends S.Class<DescribeDataMigrationsResponse>(
  "DescribeDataMigrationsResponse",
)(
  { DataMigrations: S.optional(DataMigrations), Marker: S.optional(S.String) },
  ns,
) {}
export class DescribeDataProvidersResponse extends S.Class<DescribeDataProvidersResponse>(
  "DescribeDataProvidersResponse",
)(
  { Marker: S.optional(S.String), DataProviders: S.optional(DataProviderList) },
  ns,
) {}
export class DescribeEndpointsResponse extends S.Class<DescribeEndpointsResponse>(
  "DescribeEndpointsResponse",
)({ Marker: S.optional(S.String), Endpoints: S.optional(EndpointList) }, ns) {}
export class DescribeEventSubscriptionsResponse extends S.Class<DescribeEventSubscriptionsResponse>(
  "DescribeEventSubscriptionsResponse",
)(
  {
    Marker: S.optional(S.String),
    EventSubscriptionsList: S.optional(EventSubscriptionsList),
  },
  ns,
) {}
export class DescribeExtensionPackAssociationsResponse extends S.Class<DescribeExtensionPackAssociationsResponse>(
  "DescribeExtensionPackAssociationsResponse",
)(
  {
    Marker: S.optional(S.String),
    Requests: S.optional(SchemaConversionRequestList),
  },
  ns,
) {}
export class DescribeInstanceProfilesResponse extends S.Class<DescribeInstanceProfilesResponse>(
  "DescribeInstanceProfilesResponse",
)(
  {
    Marker: S.optional(S.String),
    InstanceProfiles: S.optional(InstanceProfileList),
  },
  ns,
) {}
export class DescribeMetadataModelAssessmentsResponse extends S.Class<DescribeMetadataModelAssessmentsResponse>(
  "DescribeMetadataModelAssessmentsResponse",
)(
  {
    Marker: S.optional(S.String),
    Requests: S.optional(SchemaConversionRequestList),
  },
  ns,
) {}
export class MetadataModelReference extends S.Class<MetadataModelReference>(
  "MetadataModelReference",
)({
  MetadataModelName: S.optional(S.String),
  SelectionRules: S.optional(S.String),
}) {}
export const MetadataModelReferenceList = S.Array(MetadataModelReference);
export class DescribeMetadataModelChildrenResponse extends S.Class<DescribeMetadataModelChildrenResponse>(
  "DescribeMetadataModelChildrenResponse",
)(
  {
    Marker: S.optional(S.String),
    MetadataModelChildren: S.optional(MetadataModelReferenceList),
  },
  ns,
) {}
export class DescribeMetadataModelConversionsResponse extends S.Class<DescribeMetadataModelConversionsResponse>(
  "DescribeMetadataModelConversionsResponse",
)(
  {
    Marker: S.optional(S.String),
    Requests: S.optional(SchemaConversionRequestList),
  },
  ns,
) {}
export class DescribeMetadataModelCreationsResponse extends S.Class<DescribeMetadataModelCreationsResponse>(
  "DescribeMetadataModelCreationsResponse",
)(
  {
    Marker: S.optional(S.String),
    Requests: S.optional(SchemaConversionRequestList),
  },
  ns,
) {}
export class DescribeMetadataModelExportsAsScriptResponse extends S.Class<DescribeMetadataModelExportsAsScriptResponse>(
  "DescribeMetadataModelExportsAsScriptResponse",
)(
  {
    Marker: S.optional(S.String),
    Requests: S.optional(SchemaConversionRequestList),
  },
  ns,
) {}
export class DescribeMetadataModelExportsToTargetResponse extends S.Class<DescribeMetadataModelExportsToTargetResponse>(
  "DescribeMetadataModelExportsToTargetResponse",
)(
  {
    Marker: S.optional(S.String),
    Requests: S.optional(SchemaConversionRequestList),
  },
  ns,
) {}
export class DescribeMetadataModelImportsResponse extends S.Class<DescribeMetadataModelImportsResponse>(
  "DescribeMetadataModelImportsResponse",
)(
  {
    Marker: S.optional(S.String),
    Requests: S.optional(SchemaConversionRequestList),
  },
  ns,
) {}
export class DescribeMigrationProjectsResponse extends S.Class<DescribeMigrationProjectsResponse>(
  "DescribeMigrationProjectsResponse",
)(
  {
    Marker: S.optional(S.String),
    MigrationProjects: S.optional(MigrationProjectList),
  },
  ns,
) {}
export class DescribePendingMaintenanceActionsResponse extends S.Class<DescribePendingMaintenanceActionsResponse>(
  "DescribePendingMaintenanceActionsResponse",
)(
  {
    PendingMaintenanceActions: S.optional(PendingMaintenanceActions),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeReplicationConfigsResponse extends S.Class<DescribeReplicationConfigsResponse>(
  "DescribeReplicationConfigsResponse",
)(
  {
    Marker: S.optional(S.String),
    ReplicationConfigs: S.optional(ReplicationConfigList),
  },
  ns,
) {}
export class DescribeReplicationInstancesResponse extends S.Class<DescribeReplicationInstancesResponse>(
  "DescribeReplicationInstancesResponse",
)(
  {
    Marker: S.optional(S.String),
    ReplicationInstances: S.optional(ReplicationInstanceList),
  },
  ns,
) {}
export class DescribeReplicationSubnetGroupsResponse extends S.Class<DescribeReplicationSubnetGroupsResponse>(
  "DescribeReplicationSubnetGroupsResponse",
)(
  {
    Marker: S.optional(S.String),
    ReplicationSubnetGroups: S.optional(ReplicationSubnetGroups),
  },
  ns,
) {}
export class DescribeReplicationTaskAssessmentRunsResponse extends S.Class<DescribeReplicationTaskAssessmentRunsResponse>(
  "DescribeReplicationTaskAssessmentRunsResponse",
)(
  {
    Marker: S.optional(S.String),
    ReplicationTaskAssessmentRuns: S.optional(ReplicationTaskAssessmentRunList),
  },
  ns,
) {}
export class DescribeReplicationTasksResponse extends S.Class<DescribeReplicationTasksResponse>(
  "DescribeReplicationTasksResponse",
)(
  {
    Marker: S.optional(S.String),
    ReplicationTasks: S.optional(ReplicationTaskList),
  },
  ns,
) {}
export class DescribeSchemasResponse extends S.Class<DescribeSchemasResponse>(
  "DescribeSchemasResponse",
)({ Marker: S.optional(S.String), Schemas: S.optional(SchemaList) }, ns) {}
export class DescribeTableStatisticsResponse extends S.Class<DescribeTableStatisticsResponse>(
  "DescribeTableStatisticsResponse",
)(
  {
    ReplicationTaskArn: S.optional(S.String),
    TableStatistics: S.optional(TableStatisticsList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class GetTargetSelectionRulesResponse extends S.Class<GetTargetSelectionRulesResponse>(
  "GetTargetSelectionRulesResponse",
)({ TargetSelectionRules: S.optional(S.String) }, ns) {}
export class Certificate extends S.Class<Certificate>("Certificate")({
  CertificateIdentifier: S.optional(S.String),
  CertificateCreationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CertificatePem: S.optional(S.String),
  CertificateWallet: S.optional(T.Blob),
  CertificateArn: S.optional(S.String),
  CertificateOwner: S.optional(S.String),
  ValidFromDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ValidToDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SigningAlgorithm: S.optional(S.String),
  KeyLength: S.optional(S.Number),
  KmsKeyId: S.optional(S.String),
}) {}
export class ImportCertificateResponse extends S.Class<ImportCertificateResponse>(
  "ImportCertificateResponse",
)({ Certificate: S.optional(Certificate) }, ns) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ TagList: S.optional(TagList) }, ns) {}
export class ModifyConversionConfigurationResponse extends S.Class<ModifyConversionConfigurationResponse>(
  "ModifyConversionConfigurationResponse",
)({ MigrationProjectIdentifier: S.optional(S.String) }, ns) {}
export class ModifyDataMigrationResponse extends S.Class<ModifyDataMigrationResponse>(
  "ModifyDataMigrationResponse",
)({ DataMigration: S.optional(DataMigration) }, ns) {}
export class ModifyDataProviderResponse extends S.Class<ModifyDataProviderResponse>(
  "ModifyDataProviderResponse",
)({ DataProvider: S.optional(DataProvider) }, ns) {}
export class ModifyEndpointResponse extends S.Class<ModifyEndpointResponse>(
  "ModifyEndpointResponse",
)({ Endpoint: S.optional(Endpoint) }, ns) {}
export class ModifyEventSubscriptionResponse extends S.Class<ModifyEventSubscriptionResponse>(
  "ModifyEventSubscriptionResponse",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class ModifyInstanceProfileResponse extends S.Class<ModifyInstanceProfileResponse>(
  "ModifyInstanceProfileResponse",
)({ InstanceProfile: S.optional(InstanceProfile) }, ns) {}
export class ModifyMigrationProjectResponse extends S.Class<ModifyMigrationProjectResponse>(
  "ModifyMigrationProjectResponse",
)({ MigrationProject: S.optional(MigrationProject) }, ns) {}
export class ModifyReplicationConfigResponse extends S.Class<ModifyReplicationConfigResponse>(
  "ModifyReplicationConfigResponse",
)({ ReplicationConfig: S.optional(ReplicationConfig) }, ns) {}
export class ModifyReplicationInstanceResponse extends S.Class<ModifyReplicationInstanceResponse>(
  "ModifyReplicationInstanceResponse",
)({ ReplicationInstance: S.optional(ReplicationInstance) }, ns) {}
export class ModifyReplicationSubnetGroupResponse extends S.Class<ModifyReplicationSubnetGroupResponse>(
  "ModifyReplicationSubnetGroupResponse",
)({ ReplicationSubnetGroup: S.optional(ReplicationSubnetGroup) }, ns) {}
export class ModifyReplicationTaskResponse extends S.Class<ModifyReplicationTaskResponse>(
  "ModifyReplicationTaskResponse",
)({ ReplicationTask: S.optional(ReplicationTask) }, ns) {}
export class MoveReplicationTaskResponse extends S.Class<MoveReplicationTaskResponse>(
  "MoveReplicationTaskResponse",
)({ ReplicationTask: S.optional(ReplicationTask) }, ns) {}
export class RebootReplicationInstanceResponse extends S.Class<RebootReplicationInstanceResponse>(
  "RebootReplicationInstanceResponse",
)({ ReplicationInstance: S.optional(ReplicationInstance) }, ns) {}
export class RefreshSchemasStatus extends S.Class<RefreshSchemasStatus>(
  "RefreshSchemasStatus",
)({
  EndpointArn: S.optional(S.String),
  ReplicationInstanceArn: S.optional(S.String),
  Status: S.optional(S.String),
  LastRefreshDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastFailureMessage: S.optional(S.String),
}) {}
export class RefreshSchemasResponse extends S.Class<RefreshSchemasResponse>(
  "RefreshSchemasResponse",
)({ RefreshSchemasStatus: S.optional(RefreshSchemasStatus) }, ns) {}
export class ReloadReplicationTablesMessage extends S.Class<ReloadReplicationTablesMessage>(
  "ReloadReplicationTablesMessage",
)(
  {
    ReplicationConfigArn: S.String,
    TablesToReload: TableListToReload,
    ReloadOption: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ReloadTablesResponse extends S.Class<ReloadTablesResponse>(
  "ReloadTablesResponse",
)({ ReplicationTaskArn: S.optional(S.String) }, ns) {}
export class StartDataMigrationResponse extends S.Class<StartDataMigrationResponse>(
  "StartDataMigrationResponse",
)({ DataMigration: S.optional(DataMigration) }, ns) {}
export class StartExtensionPackAssociationResponse extends S.Class<StartExtensionPackAssociationResponse>(
  "StartExtensionPackAssociationResponse",
)({ RequestIdentifier: S.optional(S.String) }, ns) {}
export class StartMetadataModelAssessmentResponse extends S.Class<StartMetadataModelAssessmentResponse>(
  "StartMetadataModelAssessmentResponse",
)({ RequestIdentifier: S.optional(S.String) }, ns) {}
export class StartMetadataModelConversionResponse extends S.Class<StartMetadataModelConversionResponse>(
  "StartMetadataModelConversionResponse",
)({ RequestIdentifier: S.optional(S.String) }, ns) {}
export class StartMetadataModelExportAsScriptResponse extends S.Class<StartMetadataModelExportAsScriptResponse>(
  "StartMetadataModelExportAsScriptResponse",
)({ RequestIdentifier: S.optional(S.String) }, ns) {}
export class StartMetadataModelExportToTargetResponse extends S.Class<StartMetadataModelExportToTargetResponse>(
  "StartMetadataModelExportToTargetResponse",
)({ RequestIdentifier: S.optional(S.String) }, ns) {}
export class StartMetadataModelImportResponse extends S.Class<StartMetadataModelImportResponse>(
  "StartMetadataModelImportResponse",
)({ RequestIdentifier: S.optional(S.String) }, ns) {}
export class StartRecommendationsRequest extends S.Class<StartRecommendationsRequest>(
  "StartRecommendationsRequest",
)(
  { DatabaseId: S.String, Settings: RecommendationSettings },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartRecommendationsResponse extends S.Class<StartRecommendationsResponse>(
  "StartRecommendationsResponse",
)({}, ns) {}
export class ProvisionData extends S.Class<ProvisionData>("ProvisionData")({
  ProvisionState: S.optional(S.String),
  ProvisionedCapacityUnits: S.optional(S.Number),
  DateProvisioned: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IsNewProvisioningAvailable: S.optional(S.Boolean),
  DateNewProvisioningDataAvailable: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ReasonForNewProvisioningData: S.optional(S.String),
}) {}
export class PremigrationAssessmentStatus extends S.Class<PremigrationAssessmentStatus>(
  "PremigrationAssessmentStatus",
)({
  PremigrationAssessmentRunArn: S.optional(S.String),
  FailOnAssessmentFailure: S.optional(S.Boolean),
  Status: S.optional(S.String),
  PremigrationAssessmentRunCreationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AssessmentProgress: S.optional(ReplicationTaskAssessmentRunProgress),
  LastFailureMessage: S.optional(S.String),
  ResultLocationBucket: S.optional(S.String),
  ResultLocationFolder: S.optional(S.String),
  ResultEncryptionMode: S.optional(S.String),
  ResultKmsKeyArn: S.optional(S.String),
  ResultStatistic: S.optional(ReplicationTaskAssessmentRunResultStatistic),
}) {}
export const PremigrationAssessmentStatusList = S.Array(
  PremigrationAssessmentStatus,
);
export class ReplicationStats extends S.Class<ReplicationStats>(
  "ReplicationStats",
)({
  FullLoadProgressPercent: S.optional(S.Number),
  ElapsedTimeMillis: S.optional(S.Number),
  TablesLoaded: S.optional(S.Number),
  TablesLoading: S.optional(S.Number),
  TablesQueued: S.optional(S.Number),
  TablesErrored: S.optional(S.Number),
  FreshStartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StopDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FullLoadStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  FullLoadFinishDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class Replication extends S.Class<Replication>("Replication")({
  ReplicationConfigIdentifier: S.optional(S.String),
  ReplicationConfigArn: S.optional(S.String),
  SourceEndpointArn: S.optional(S.String),
  TargetEndpointArn: S.optional(S.String),
  ReplicationType: S.optional(S.String),
  Status: S.optional(S.String),
  ProvisionData: S.optional(ProvisionData),
  PremigrationAssessmentStatuses: S.optional(PremigrationAssessmentStatusList),
  StopReason: S.optional(S.String),
  FailureMessages: S.optional(StringList),
  ReplicationStats: S.optional(ReplicationStats),
  StartReplicationType: S.optional(S.String),
  CdcStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CdcStartPosition: S.optional(S.String),
  CdcStopPosition: S.optional(S.String),
  RecoveryCheckpoint: S.optional(S.String),
  ReplicationCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ReplicationUpdateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ReplicationLastStopTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ReplicationDeprovisionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  IsReadOnly: S.optional(S.Boolean),
}) {}
export class StartReplicationResponse extends S.Class<StartReplicationResponse>(
  "StartReplicationResponse",
)({ Replication: S.optional(Replication) }, ns) {}
export class StartReplicationTaskResponse extends S.Class<StartReplicationTaskResponse>(
  "StartReplicationTaskResponse",
)({ ReplicationTask: S.optional(ReplicationTask) }, ns) {}
export class StartReplicationTaskAssessmentResponse extends S.Class<StartReplicationTaskAssessmentResponse>(
  "StartReplicationTaskAssessmentResponse",
)({ ReplicationTask: S.optional(ReplicationTask) }, ns) {}
export class StartReplicationTaskAssessmentRunResponse extends S.Class<StartReplicationTaskAssessmentRunResponse>(
  "StartReplicationTaskAssessmentRunResponse",
)(
  { ReplicationTaskAssessmentRun: S.optional(ReplicationTaskAssessmentRun) },
  ns,
) {}
export class StopDataMigrationResponse extends S.Class<StopDataMigrationResponse>(
  "StopDataMigrationResponse",
)({ DataMigration: S.optional(DataMigration) }, ns) {}
export class StopReplicationResponse extends S.Class<StopReplicationResponse>(
  "StopReplicationResponse",
)({ Replication: S.optional(Replication) }, ns) {}
export class StopReplicationTaskResponse extends S.Class<StopReplicationTaskResponse>(
  "StopReplicationTaskResponse",
)({ ReplicationTask: S.optional(ReplicationTask) }, ns) {}
export class TestConnectionResponse extends S.Class<TestConnectionResponse>(
  "TestConnectionResponse",
)({ Connection: S.optional(Connection) }, ns) {}
export class UpdateSubscriptionsToEventBridgeResponse extends S.Class<UpdateSubscriptionsToEventBridgeResponse>(
  "UpdateSubscriptionsToEventBridgeResponse",
)({ Result: S.optional(S.String) }, ns) {}
export const EndpointSettingEnumValues = S.Array(S.String);
export const AvailableUpgradesList = S.Array(S.String);
export const AvailabilityZonesList = S.Array(S.String);
export class StatementProperties extends S.Class<StatementProperties>(
  "StatementProperties",
)({ Definition: S.String }) {}
export const CertificateList = S.Array(
  Certificate.pipe(T.XmlName("Certificate")),
);
export class EndpointSetting extends S.Class<EndpointSetting>(
  "EndpointSetting",
)({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  EnumValues: S.optional(EndpointSettingEnumValues),
  Sensitive: S.optional(S.Boolean),
  Units: S.optional(S.String),
  Applicability: S.optional(S.String),
  IntValueMin: S.optional(S.Number),
  IntValueMax: S.optional(S.Number),
  DefaultValue: S.optional(S.String),
}) {}
export const EndpointSettingsList = S.Array(EndpointSetting);
export class SupportedEndpointType extends S.Class<SupportedEndpointType>(
  "SupportedEndpointType",
)({
  EngineName: S.optional(S.String),
  SupportsCDC: S.optional(S.Boolean),
  EndpointType: S.optional(S.String),
  ReplicationInstanceEngineMinimumVersion: S.optional(S.String),
  EngineDisplayName: S.optional(S.String),
}) {}
export const SupportedEndpointTypeList = S.Array(
  SupportedEndpointType.pipe(T.XmlName("SupportedEndpointType")),
);
export class EngineVersion extends S.Class<EngineVersion>("EngineVersion")({
  Version: S.optional(S.String),
  Lifecycle: S.optional(S.String),
  ReleaseStatus: S.optional(S.String),
  LaunchDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AutoUpgradeDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeprecationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ForceUpgradeDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AvailableUpgrades: S.optional(AvailableUpgradesList),
}) {}
export const EngineVersionList = S.Array(
  EngineVersion.pipe(T.XmlName("EngineVersion")),
);
export class EventCategoryGroup extends S.Class<EventCategoryGroup>(
  "EventCategoryGroup",
)({
  SourceType: S.optional(S.String),
  EventCategories: S.optional(EventCategoriesList),
}) {}
export const EventCategoryGroupList = S.Array(
  EventCategoryGroup.pipe(T.XmlName("EventCategoryGroup")),
);
export class Event extends S.Class<Event>("Event")({
  SourceIdentifier: S.optional(S.String),
  SourceType: S.optional(S.String),
  Message: S.optional(S.String),
  EventCategories: S.optional(EventCategoriesList),
  Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EventList = S.Array(Event.pipe(T.XmlName("Event")));
export class FleetAdvisorLsaAnalysisResponse extends S.Class<FleetAdvisorLsaAnalysisResponse>(
  "FleetAdvisorLsaAnalysisResponse",
)({ LsaAnalysisId: S.optional(S.String), Status: S.optional(S.String) }) {}
export const FleetAdvisorLsaAnalysisResponseList = S.Array(
  FleetAdvisorLsaAnalysisResponse,
);
export class FleetAdvisorSchemaObjectResponse extends S.Class<FleetAdvisorSchemaObjectResponse>(
  "FleetAdvisorSchemaObjectResponse",
)({
  SchemaId: S.optional(S.String),
  ObjectType: S.optional(S.String),
  NumberOfObjects: S.optional(S.Number),
  CodeLineCount: S.optional(S.Number),
  CodeSize: S.optional(S.Number),
}) {}
export const FleetAdvisorSchemaObjectList = S.Array(
  FleetAdvisorSchemaObjectResponse,
);
export class OrderableReplicationInstance extends S.Class<OrderableReplicationInstance>(
  "OrderableReplicationInstance",
)({
  EngineVersion: S.optional(S.String),
  ReplicationInstanceClass: S.optional(S.String),
  StorageType: S.optional(S.String),
  MinAllocatedStorage: S.optional(S.Number),
  MaxAllocatedStorage: S.optional(S.Number),
  DefaultAllocatedStorage: S.optional(S.Number),
  IncludedAllocatedStorage: S.optional(S.Number),
  AvailabilityZones: S.optional(AvailabilityZonesList),
  ReleaseStatus: S.optional(S.String),
}) {}
export const OrderableReplicationInstanceList = S.Array(
  OrderableReplicationInstance.pipe(T.XmlName("OrderableReplicationInstance")),
);
export class Limitation extends S.Class<Limitation>("Limitation")({
  DatabaseId: S.optional(S.String),
  EngineName: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Impact: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const LimitationList = S.Array(Limitation);
export class ReplicationInstanceTaskLog extends S.Class<ReplicationInstanceTaskLog>(
  "ReplicationInstanceTaskLog",
)({
  ReplicationTaskName: S.optional(S.String),
  ReplicationTaskArn: S.optional(S.String),
  ReplicationInstanceTaskLogSize: S.optional(S.Number),
}) {}
export const ReplicationInstanceTaskLogsList = S.Array(
  ReplicationInstanceTaskLog,
);
export const ReplicationTableStatisticsList = S.Array(TableStatistics);
export class ReplicationTaskAssessmentResult extends S.Class<ReplicationTaskAssessmentResult>(
  "ReplicationTaskAssessmentResult",
)({
  ReplicationTaskIdentifier: S.optional(S.String),
  ReplicationTaskArn: S.optional(S.String),
  ReplicationTaskLastAssessmentDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AssessmentStatus: S.optional(S.String),
  AssessmentResultsFile: S.optional(S.String),
  AssessmentResults: S.optional(S.String),
  S3ObjectUrl: S.optional(S.String),
}) {}
export const ReplicationTaskAssessmentResultList = S.Array(
  ReplicationTaskAssessmentResult.pipe(
    T.XmlName("ReplicationTaskAssessmentResult"),
  ),
);
export class ReplicationTaskIndividualAssessment extends S.Class<ReplicationTaskIndividualAssessment>(
  "ReplicationTaskIndividualAssessment",
)({
  ReplicationTaskIndividualAssessmentArn: S.optional(S.String),
  ReplicationTaskAssessmentRunArn: S.optional(S.String),
  IndividualAssessmentName: S.optional(S.String),
  Status: S.optional(S.String),
  ReplicationTaskIndividualAssessmentStartDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ReplicationTaskIndividualAssessmentList = S.Array(
  ReplicationTaskIndividualAssessment,
);
export class ExportMetadataModelAssessmentResultEntry extends S.Class<ExportMetadataModelAssessmentResultEntry>(
  "ExportMetadataModelAssessmentResultEntry",
)({ S3ObjectKey: S.optional(S.String), ObjectURL: S.optional(S.String) }) {}
export const MetadataModelProperties = S.Union(
  S.Struct({ StatementProperties: StatementProperties }),
);
export class CreateDataMigrationResponse extends S.Class<CreateDataMigrationResponse>(
  "CreateDataMigrationResponse",
)({ DataMigration: S.optional(DataMigration) }, ns) {}
export class CreateDataProviderMessage extends S.Class<CreateDataProviderMessage>(
  "CreateDataProviderMessage",
)(
  {
    DataProviderName: S.optional(S.String),
    Description: S.optional(S.String),
    Engine: S.String,
    Virtual: S.optional(S.Boolean),
    Settings: DataProviderSettings,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEndpointResponse extends S.Class<CreateEndpointResponse>(
  "CreateEndpointResponse",
)({ Endpoint: S.optional(Endpoint) }, ns) {}
export class CreateEventSubscriptionResponse extends S.Class<CreateEventSubscriptionResponse>(
  "CreateEventSubscriptionResponse",
)({ EventSubscription: S.optional(EventSubscription) }, ns) {}
export class CreateInstanceProfileResponse extends S.Class<CreateInstanceProfileResponse>(
  "CreateInstanceProfileResponse",
)({ InstanceProfile: S.optional(InstanceProfile) }, ns) {}
export class CreateMigrationProjectResponse extends S.Class<CreateMigrationProjectResponse>(
  "CreateMigrationProjectResponse",
)({ MigrationProject: S.optional(MigrationProject) }, ns) {}
export class CreateReplicationConfigResponse extends S.Class<CreateReplicationConfigResponse>(
  "CreateReplicationConfigResponse",
)({ ReplicationConfig: S.optional(ReplicationConfig) }, ns) {}
export class CreateReplicationInstanceResponse extends S.Class<CreateReplicationInstanceResponse>(
  "CreateReplicationInstanceResponse",
)({ ReplicationInstance: S.optional(ReplicationInstance) }, ns) {}
export class DeleteCertificateResponse extends S.Class<DeleteCertificateResponse>(
  "DeleteCertificateResponse",
)({ Certificate: S.optional(Certificate) }, ns) {}
export class DeleteConnectionResponse extends S.Class<DeleteConnectionResponse>(
  "DeleteConnectionResponse",
)({ Connection: S.optional(Connection) }, ns) {}
export class DeleteDataProviderResponse extends S.Class<DeleteDataProviderResponse>(
  "DeleteDataProviderResponse",
)({ DataProvider: S.optional(DataProvider) }, ns) {}
export class DeleteReplicationConfigResponse extends S.Class<DeleteReplicationConfigResponse>(
  "DeleteReplicationConfigResponse",
)({ ReplicationConfig: S.optional(ReplicationConfig) }, ns) {}
export class DescribeCertificatesResponse extends S.Class<DescribeCertificatesResponse>(
  "DescribeCertificatesResponse",
)(
  { Marker: S.optional(S.String), Certificates: S.optional(CertificateList) },
  ns,
) {}
export class DescribeEndpointSettingsResponse extends S.Class<DescribeEndpointSettingsResponse>(
  "DescribeEndpointSettingsResponse",
)(
  {
    Marker: S.optional(S.String),
    EndpointSettings: S.optional(EndpointSettingsList),
  },
  ns,
) {}
export class DescribeEndpointTypesResponse extends S.Class<DescribeEndpointTypesResponse>(
  "DescribeEndpointTypesResponse",
)(
  {
    Marker: S.optional(S.String),
    SupportedEndpointTypes: S.optional(SupportedEndpointTypeList),
  },
  ns,
) {}
export class DescribeEngineVersionsResponse extends S.Class<DescribeEngineVersionsResponse>(
  "DescribeEngineVersionsResponse",
)(
  {
    EngineVersions: S.optional(EngineVersionList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeEventCategoriesResponse extends S.Class<DescribeEventCategoriesResponse>(
  "DescribeEventCategoriesResponse",
)({ EventCategoryGroupList: S.optional(EventCategoryGroupList) }, ns) {}
export class DescribeEventsResponse extends S.Class<DescribeEventsResponse>(
  "DescribeEventsResponse",
)({ Marker: S.optional(S.String), Events: S.optional(EventList) }, ns) {}
export class DescribeFleetAdvisorLsaAnalysisResponse extends S.Class<DescribeFleetAdvisorLsaAnalysisResponse>(
  "DescribeFleetAdvisorLsaAnalysisResponse",
)(
  {
    Analysis: S.optional(FleetAdvisorLsaAnalysisResponseList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeFleetAdvisorSchemaObjectSummaryResponse extends S.Class<DescribeFleetAdvisorSchemaObjectSummaryResponse>(
  "DescribeFleetAdvisorSchemaObjectSummaryResponse",
)(
  {
    FleetAdvisorSchemaObjects: S.optional(FleetAdvisorSchemaObjectList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeMetadataModelResponse extends S.Class<DescribeMetadataModelResponse>(
  "DescribeMetadataModelResponse",
)(
  {
    MetadataModelName: S.optional(S.String),
    MetadataModelType: S.optional(S.String),
    TargetMetadataModels: S.optional(MetadataModelReferenceList),
    Definition: S.optional(S.String),
  },
  ns,
) {}
export class DescribeOrderableReplicationInstancesResponse extends S.Class<DescribeOrderableReplicationInstancesResponse>(
  "DescribeOrderableReplicationInstancesResponse",
)(
  {
    OrderableReplicationInstances: S.optional(OrderableReplicationInstanceList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeRecommendationLimitationsResponse extends S.Class<DescribeRecommendationLimitationsResponse>(
  "DescribeRecommendationLimitationsResponse",
)(
  { NextToken: S.optional(S.String), Limitations: S.optional(LimitationList) },
  ns,
) {}
export class DescribeRefreshSchemasStatusResponse extends S.Class<DescribeRefreshSchemasStatusResponse>(
  "DescribeRefreshSchemasStatusResponse",
)({ RefreshSchemasStatus: S.optional(RefreshSchemasStatus) }, ns) {}
export class DescribeReplicationInstanceTaskLogsResponse extends S.Class<DescribeReplicationInstanceTaskLogsResponse>(
  "DescribeReplicationInstanceTaskLogsResponse",
)(
  {
    ReplicationInstanceArn: S.optional(S.String),
    ReplicationInstanceTaskLogs: S.optional(ReplicationInstanceTaskLogsList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeReplicationTableStatisticsResponse extends S.Class<DescribeReplicationTableStatisticsResponse>(
  "DescribeReplicationTableStatisticsResponse",
)(
  {
    ReplicationConfigArn: S.optional(S.String),
    Marker: S.optional(S.String),
    ReplicationTableStatistics: S.optional(ReplicationTableStatisticsList),
  },
  ns,
) {}
export class DescribeReplicationTaskAssessmentResultsResponse extends S.Class<DescribeReplicationTaskAssessmentResultsResponse>(
  "DescribeReplicationTaskAssessmentResultsResponse",
)(
  {
    Marker: S.optional(S.String),
    BucketName: S.optional(S.String),
    ReplicationTaskAssessmentResults: S.optional(
      ReplicationTaskAssessmentResultList,
    ),
  },
  ns,
) {}
export class DescribeReplicationTaskIndividualAssessmentsResponse extends S.Class<DescribeReplicationTaskIndividualAssessmentsResponse>(
  "DescribeReplicationTaskIndividualAssessmentsResponse",
)(
  {
    Marker: S.optional(S.String),
    ReplicationTaskIndividualAssessments: S.optional(
      ReplicationTaskIndividualAssessmentList,
    ),
  },
  ns,
) {}
export class ExportMetadataModelAssessmentResponse extends S.Class<ExportMetadataModelAssessmentResponse>(
  "ExportMetadataModelAssessmentResponse",
)(
  {
    PdfReport: S.optional(ExportMetadataModelAssessmentResultEntry),
    CsvReport: S.optional(ExportMetadataModelAssessmentResultEntry),
  },
  ns,
) {}
export class ReloadReplicationTablesResponse extends S.Class<ReloadReplicationTablesResponse>(
  "ReloadReplicationTablesResponse",
)({ ReplicationConfigArn: S.optional(S.String) }, ns) {}
export class StartMetadataModelCreationMessage extends S.Class<StartMetadataModelCreationMessage>(
  "StartMetadataModelCreationMessage",
)(
  {
    MigrationProjectIdentifier: S.String,
    SelectionRules: S.String,
    MetadataModelName: S.String,
    Properties: MetadataModelProperties,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CollectorHealthCheck extends S.Class<CollectorHealthCheck>(
  "CollectorHealthCheck",
)({
  CollectorStatus: S.optional(S.String),
  LocalCollectorS3Access: S.optional(S.Boolean),
  WebCollectorS3Access: S.optional(S.Boolean),
  WebCollectorGrantedRoleBasedAccess: S.optional(S.Boolean),
}) {}
export class InventoryData extends S.Class<InventoryData>("InventoryData")({
  NumberOfDatabases: S.optional(S.Number),
  NumberOfSchemas: S.optional(S.Number),
}) {}
export class ServerShortInfoResponse extends S.Class<ServerShortInfoResponse>(
  "ServerShortInfoResponse",
)({
  ServerId: S.optional(S.String),
  IpAddress: S.optional(S.String),
  ServerName: S.optional(S.String),
}) {}
export class DatabaseInstanceSoftwareDetailsResponse extends S.Class<DatabaseInstanceSoftwareDetailsResponse>(
  "DatabaseInstanceSoftwareDetailsResponse",
)({
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  EngineEdition: S.optional(S.String),
  ServicePack: S.optional(S.String),
  SupportLevel: S.optional(S.String),
  OsArchitecture: S.optional(S.Number),
  Tooltip: S.optional(S.String),
}) {}
export class CollectorShortInfoResponse extends S.Class<CollectorShortInfoResponse>(
  "CollectorShortInfoResponse",
)({
  CollectorReferencedId: S.optional(S.String),
  CollectorName: S.optional(S.String),
}) {}
export const CollectorsList = S.Array(CollectorShortInfoResponse);
export class DatabaseShortInfoResponse extends S.Class<DatabaseShortInfoResponse>(
  "DatabaseShortInfoResponse",
)({
  DatabaseId: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  DatabaseIpAddress: S.optional(S.String),
  DatabaseEngine: S.optional(S.String),
}) {}
export class SchemaShortInfoResponse extends S.Class<SchemaShortInfoResponse>(
  "SchemaShortInfoResponse",
)({
  SchemaId: S.optional(S.String),
  SchemaName: S.optional(S.String),
  DatabaseId: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  DatabaseIpAddress: S.optional(S.String),
}) {}
export class BatchStartRecommendationsErrorEntry extends S.Class<BatchStartRecommendationsErrorEntry>(
  "BatchStartRecommendationsErrorEntry",
)({
  DatabaseId: S.optional(S.String),
  Message: S.optional(S.String),
  Code: S.optional(S.String),
}) {}
export const BatchStartRecommendationsErrorEntryList = S.Array(
  BatchStartRecommendationsErrorEntry,
);
export class CollectorResponse extends S.Class<CollectorResponse>(
  "CollectorResponse",
)({
  CollectorReferencedId: S.optional(S.String),
  CollectorName: S.optional(S.String),
  CollectorVersion: S.optional(S.String),
  VersionStatus: S.optional(S.String),
  Description: S.optional(S.String),
  S3BucketName: S.optional(S.String),
  ServiceAccessRoleArn: S.optional(S.String),
  CollectorHealthCheck: S.optional(CollectorHealthCheck),
  LastDataReceived: S.optional(S.String),
  RegisteredDate: S.optional(S.String),
  CreatedDate: S.optional(S.String),
  ModifiedDate: S.optional(S.String),
  InventoryData: S.optional(InventoryData),
}) {}
export const CollectorResponses = S.Array(CollectorResponse);
export class DatabaseResponse extends S.Class<DatabaseResponse>(
  "DatabaseResponse",
)({
  DatabaseId: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  IpAddress: S.optional(S.String),
  NumberOfSchemas: S.optional(S.Number),
  Server: S.optional(ServerShortInfoResponse),
  SoftwareDetails: S.optional(DatabaseInstanceSoftwareDetailsResponse),
  Collectors: S.optional(CollectorsList),
}) {}
export const DatabaseList = S.Array(DatabaseResponse);
export class SchemaResponse extends S.Class<SchemaResponse>("SchemaResponse")({
  CodeLineCount: S.optional(S.Number),
  CodeSize: S.optional(S.Number),
  Complexity: S.optional(S.String),
  Server: S.optional(ServerShortInfoResponse),
  DatabaseInstance: S.optional(DatabaseShortInfoResponse),
  SchemaId: S.optional(S.String),
  SchemaName: S.optional(S.String),
  OriginalSchema: S.optional(SchemaShortInfoResponse),
  Similarity: S.optional(S.Number),
}) {}
export const FleetAdvisorSchemaList = S.Array(SchemaResponse);
export const ReplicationList = S.Array(
  Replication.pipe(T.XmlName("Replication")),
);
export class ApplyPendingMaintenanceActionResponse extends S.Class<ApplyPendingMaintenanceActionResponse>(
  "ApplyPendingMaintenanceActionResponse",
)(
  {
    ResourcePendingMaintenanceActions: S.optional(
      ResourcePendingMaintenanceActions,
    ),
  },
  ns,
) {}
export class BatchStartRecommendationsResponse extends S.Class<BatchStartRecommendationsResponse>(
  "BatchStartRecommendationsResponse",
)({ ErrorEntries: S.optional(BatchStartRecommendationsErrorEntryList) }, ns) {}
export class CancelReplicationTaskAssessmentRunResponse extends S.Class<CancelReplicationTaskAssessmentRunResponse>(
  "CancelReplicationTaskAssessmentRunResponse",
)(
  { ReplicationTaskAssessmentRun: S.optional(ReplicationTaskAssessmentRun) },
  ns,
) {}
export class CreateDataProviderResponse extends S.Class<CreateDataProviderResponse>(
  "CreateDataProviderResponse",
)({ DataProvider: S.optional(DataProvider) }, ns) {}
export class CreateReplicationTaskResponse extends S.Class<CreateReplicationTaskResponse>(
  "CreateReplicationTaskResponse",
)({ ReplicationTask: S.optional(ReplicationTask) }, ns) {}
export class DeleteDataMigrationResponse extends S.Class<DeleteDataMigrationResponse>(
  "DeleteDataMigrationResponse",
)({ DataMigration: S.optional(DataMigration) }, ns) {}
export class DeleteEndpointResponse extends S.Class<DeleteEndpointResponse>(
  "DeleteEndpointResponse",
)({ Endpoint: S.optional(Endpoint) }, ns) {}
export class DeleteMigrationProjectResponse extends S.Class<DeleteMigrationProjectResponse>(
  "DeleteMigrationProjectResponse",
)({ MigrationProject: S.optional(MigrationProject) }, ns) {}
export class DeleteReplicationInstanceResponse extends S.Class<DeleteReplicationInstanceResponse>(
  "DeleteReplicationInstanceResponse",
)({ ReplicationInstance: S.optional(ReplicationInstance) }, ns) {}
export class DescribeFleetAdvisorCollectorsResponse extends S.Class<DescribeFleetAdvisorCollectorsResponse>(
  "DescribeFleetAdvisorCollectorsResponse",
)(
  {
    Collectors: S.optional(CollectorResponses),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeFleetAdvisorDatabasesResponse extends S.Class<DescribeFleetAdvisorDatabasesResponse>(
  "DescribeFleetAdvisorDatabasesResponse",
)(
  { Databases: S.optional(DatabaseList), NextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeFleetAdvisorSchemasResponse extends S.Class<DescribeFleetAdvisorSchemasResponse>(
  "DescribeFleetAdvisorSchemasResponse",
)(
  {
    FleetAdvisorSchemas: S.optional(FleetAdvisorSchemaList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeReplicationsResponse extends S.Class<DescribeReplicationsResponse>(
  "DescribeReplicationsResponse",
)(
  { Marker: S.optional(S.String), Replications: S.optional(ReplicationList) },
  ns,
) {}
export class StartMetadataModelCreationResponse extends S.Class<StartMetadataModelCreationResponse>(
  "StartMetadataModelCreationResponse",
)({ RequestIdentifier: S.optional(S.String) }, ns) {}
export class RdsRequirements extends S.Class<RdsRequirements>(
  "RdsRequirements",
)({
  EngineEdition: S.optional(S.String),
  InstanceVcpu: S.optional(S.Number),
  InstanceMemory: S.optional(S.Number),
  StorageSize: S.optional(S.Number),
  StorageIops: S.optional(S.Number),
  DeploymentOption: S.optional(S.String),
  EngineVersion: S.optional(S.String),
}) {}
export class RdsConfiguration extends S.Class<RdsConfiguration>(
  "RdsConfiguration",
)({
  EngineEdition: S.optional(S.String),
  InstanceType: S.optional(S.String),
  InstanceVcpu: S.optional(S.Number),
  InstanceMemory: S.optional(S.Number),
  StorageType: S.optional(S.String),
  StorageSize: S.optional(S.Number),
  StorageIops: S.optional(S.Number),
  DeploymentOption: S.optional(S.String),
  EngineVersion: S.optional(S.String),
}) {}
export class RdsRecommendation extends S.Class<RdsRecommendation>(
  "RdsRecommendation",
)({
  RequirementsToTarget: S.optional(RdsRequirements),
  TargetConfiguration: S.optional(RdsConfiguration),
}) {}
export class CancelMetadataModelConversionResponse extends S.Class<CancelMetadataModelConversionResponse>(
  "CancelMetadataModelConversionResponse",
)({ Request: S.optional(SchemaConversionRequest) }, ns) {}
export class CreateReplicationSubnetGroupResponse extends S.Class<CreateReplicationSubnetGroupResponse>(
  "CreateReplicationSubnetGroupResponse",
)({ ReplicationSubnetGroup: S.optional(ReplicationSubnetGroup) }, ns) {}
export class RecommendationData extends S.Class<RecommendationData>(
  "RecommendationData",
)({ RdsEngine: S.optional(RdsRecommendation) }) {}
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
  DatabaseId: S.optional(S.String),
  EngineName: S.optional(S.String),
  CreatedDate: S.optional(S.String),
  Status: S.optional(S.String),
  Preferred: S.optional(S.Boolean),
  Settings: S.optional(RecommendationSettings),
  Data: S.optional(RecommendationData),
}) {}
export const RecommendationList = S.Array(Recommendation);
export class DescribeRecommendationsResponse extends S.Class<DescribeRecommendationsResponse>(
  "DescribeRecommendationsResponse",
)(
  {
    NextToken: S.optional(S.String),
    Recommendations: S.optional(RecommendationList),
  },
  ns,
) {}

//# Errors
export class AccessDeniedFault extends S.TaggedError<AccessDeniedFault>()(
  "AccessDeniedFault",
  { message: S.optional(S.String) },
) {}
export class InvalidResourceStateFault extends S.TaggedError<InvalidResourceStateFault>()(
  "InvalidResourceStateFault",
  { message: S.optional(S.String) },
) {}
export class CollectorNotFoundFault extends S.TaggedError<CollectorNotFoundFault>()(
  "CollectorNotFoundFault",
  { message: S.optional(S.String) },
) {}
export class InvalidOperationFault extends S.TaggedError<InvalidOperationFault>()(
  "InvalidOperationFault",
  { message: S.optional(S.String) },
) {}
export class FailedDependencyFault extends S.TaggedError<FailedDependencyFault>()(
  "FailedDependencyFault",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundFault extends S.TaggedError<ResourceNotFoundFault>()(
  "ResourceNotFoundFault",
  { message: S.optional(S.String) },
) {}
export class InvalidCertificateFault extends S.TaggedError<InvalidCertificateFault>()(
  "InvalidCertificateFault",
  { message: S.optional(S.String) },
) {}
export class KMSAccessDeniedFault extends S.TaggedError<KMSAccessDeniedFault>()(
  "KMSAccessDeniedFault",
  { message: S.optional(S.String) },
) {}
export class InsufficientResourceCapacityFault extends S.TaggedError<InsufficientResourceCapacityFault>()(
  "InsufficientResourceCapacityFault",
  { message: S.optional(S.String) },
) {}
export class InvalidSubnet extends S.TaggedError<InvalidSubnet>()(
  "InvalidSubnet",
  { message: S.optional(S.String) },
) {}
export class KMSKeyNotAccessibleFault extends S.TaggedError<KMSKeyNotAccessibleFault>()(
  "KMSKeyNotAccessibleFault",
  { message: S.optional(S.String) },
) {}
export class ResourceQuotaExceededFault extends S.TaggedError<ResourceQuotaExceededFault>()(
  "ResourceQuotaExceededFault",
  { message: S.optional(S.String) },
) {}
export class KMSDisabledFault extends S.TaggedError<KMSDisabledFault>()(
  "KMSDisabledFault",
  { message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsFault extends S.TaggedError<ResourceAlreadyExistsFault>()(
  "ResourceAlreadyExistsFault",
  { message: S.optional(S.String), resourceArn: S.optional(S.String) },
) {}
export class ReplicationSubnetGroupDoesNotCoverEnoughAZs extends S.TaggedError<ReplicationSubnetGroupDoesNotCoverEnoughAZs>()(
  "ReplicationSubnetGroupDoesNotCoverEnoughAZs",
  { message: S.optional(S.String) },
) {}
export class S3AccessDeniedFault extends S.TaggedError<S3AccessDeniedFault>()(
  "S3AccessDeniedFault",
  { message: S.optional(S.String) },
) {}
export class KMSInvalidStateFault extends S.TaggedError<KMSInvalidStateFault>()(
  "KMSInvalidStateFault",
  { message: S.optional(S.String) },
) {}
export class StorageQuotaExceededFault extends S.TaggedError<StorageQuotaExceededFault>()(
  "StorageQuotaExceededFault",
  { message: S.optional(S.String) },
) {}
export class SubnetAlreadyInUse extends S.TaggedError<SubnetAlreadyInUse>()(
  "SubnetAlreadyInUse",
  { message: S.optional(S.String) },
) {}
export class S3ResourceNotFoundFault extends S.TaggedError<S3ResourceNotFoundFault>()(
  "S3ResourceNotFoundFault",
  { message: S.optional(S.String) },
) {}
export class KMSFault extends S.TaggedError<KMSFault>()("KMSFault", {
  message: S.optional(S.String),
}) {}
export class KMSNotFoundFault extends S.TaggedError<KMSNotFoundFault>()(
  "KMSNotFoundFault",
  { message: S.optional(S.String) },
) {}
export class UpgradeDependencyFailureFault extends S.TaggedError<UpgradeDependencyFailureFault>()(
  "UpgradeDependencyFailureFault",
  { message: S.optional(S.String) },
) {}
export class KMSThrottlingFault extends S.TaggedError<KMSThrottlingFault>()(
  "KMSThrottlingFault",
  { message: S.optional(S.String) },
) {}
export class SNSInvalidTopicFault extends S.TaggedError<SNSInvalidTopicFault>()(
  "SNSInvalidTopicFault",
  { message: S.optional(S.String) },
) {}
export class SNSNoAuthorizationFault extends S.TaggedError<SNSNoAuthorizationFault>()(
  "SNSNoAuthorizationFault",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists all of the DMS attributes for a customer account. These attributes include DMS
 * quotas for the account and a unique account identifier in a particular DMS region. DMS
 * quotas include a list of resource quotas supported by the account, such as the number of
 * replication instances allowed. The description for each resource quota, includes the quota
 * name, current usage toward that quota, and the quota's maximum value. DMS uses the unique
 * account identifier to name each artifact used by DMS in the given region.
 *
 * This command does not take any parameters.
 */
export const describeAccountAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountAttributesMessage,
    output: DescribeAccountAttributesResponse,
    errors: [],
  }),
);
/**
 * Returns a paginated list of extension pack associations for the specified migration
 * project. An extension pack is an add-on module that emulates functions present in a source
 * database that are required when converting objects to the target database.
 */
export const describeExtensionPackAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeExtensionPackAssociationsMessage,
    output: DescribeExtensionPackAssociationsResponse,
    errors: [],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Migrates 10 active and enabled Amazon SNS subscriptions at a time and converts them to
 * corresponding Amazon EventBridge rules. By default, this operation migrates subscriptions
 * only when all your replication instance versions are 3.4.5 or higher. If any replication
 * instances are from versions earlier than 3.4.5, the operation raises an error and tells you
 * to upgrade these instances to version 3.4.5 or higher. To enable migration regardless of
 * version, set the `Force` option to true. However, if you don't upgrade instances
 * earlier than version 3.4.5, some types of events might not be available when you use Amazon
 * EventBridge.
 *
 * To call this operation, make sure that you have certain permissions added to your user
 * account. For more information, see Migrating event subscriptions to Amazon EventBridge in the
 * *Amazon Web Services Database Migration Service User Guide*.
 */
export const updateSubscriptionsToEventBridge =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSubscriptionsToEventBridgeMessage,
    output: UpdateSubscriptionsToEventBridgeResponse,
    errors: [AccessDeniedFault, InvalidResourceStateFault],
  }));
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Deletes the specified Fleet Advisor collector.
 */
export const deleteFleetAdvisorCollector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCollectorRequest,
    output: DeleteFleetAdvisorCollectorResponse,
    errors: [
      AccessDeniedFault,
      CollectorNotFoundFault,
      InvalidResourceStateFault,
    ],
  }),
);
/**
 * Describes the status of the connections that have been made between the replication
 * instance and an endpoint. Connections are created when you test an endpoint.
 */
export const describeConnections =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeConnectionsMessage,
    output: DescribeConnectionsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns information about the possible endpoint settings available when you create an
 * endpoint for a specific database engine.
 */
export const describeEndpointSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeEndpointSettingsMessage,
    output: DescribeEndpointSettingsResponse,
    errors: [],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns information about the type of endpoints available.
 */
export const describeEndpointTypes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeEndpointTypesMessage,
    output: DescribeEndpointTypesResponse,
    errors: [],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns information about the replication instance versions used in the project.
 */
export const describeEngineVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeEngineVersionsMessage,
    output: DescribeEngineVersionsResponse,
    errors: [],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Lists categories for all event source types, or, if specified, for a specified source
 * type. You can see a list of the event categories and source types in Working with Events
 * and Notifications in the *Database Migration Service User Guide.*
 */
export const describeEventCategories = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventCategoriesMessage,
    output: DescribeEventCategoriesResponse,
    errors: [],
  }),
);
/**
 * Lists events for a given source identifier and source type. You can also specify a
 * start and end time. For more information on DMS events, see Working with Events and
 * Notifications in the *Database Migration Service User Guide.*
 */
export const describeEvents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeEventsMessage,
    output: DescribeEventsResponse,
    errors: [],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }),
);
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Provides descriptions of large-scale assessment (LSA) analyses produced by your Fleet
 * Advisor collectors.
 */
export const describeFleetAdvisorLsaAnalysis =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeFleetAdvisorLsaAnalysisRequest,
    output: DescribeFleetAdvisorLsaAnalysisResponse,
    errors: [InvalidResourceStateFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Provides descriptions of the schemas discovered by your Fleet Advisor
 * collectors.
 */
export const describeFleetAdvisorSchemaObjectSummary =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeFleetAdvisorSchemaObjectSummaryRequest,
    output: DescribeFleetAdvisorSchemaObjectSummaryResponse,
    errors: [InvalidResourceStateFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Gets detailed information about the specified metadata model, including its definition and corresponding converted objects in the target database if applicable.
 */
export const describeMetadataModel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeMetadataModelMessage,
    output: DescribeMetadataModelResponse,
    errors: [AccessDeniedFault, ResourceNotFoundFault],
  }),
);
/**
 * Returns information about the replication instance types that can be created in the
 * specified region.
 */
export const describeOrderableReplicationInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeOrderableReplicationInstancesMessage,
    output: DescribeOrderableReplicationInstancesResponse,
    errors: [],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Returns a paginated list of limitations for recommendations of target Amazon Web Services
 * engines.
 */
export const describeRecommendationLimitations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeRecommendationLimitationsRequest,
    output: DescribeRecommendationLimitationsResponse,
    errors: [AccessDeniedFault, InvalidResourceStateFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns the status of the RefreshSchemas operation.
 */
export const describeRefreshSchemasStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeRefreshSchemasStatusMessage,
    output: DescribeRefreshSchemasStatusResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
  }));
/**
 * Returns information about the task logs for the specified task.
 */
export const describeReplicationInstanceTaskLogs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReplicationInstanceTaskLogsMessage,
    output: DescribeReplicationInstanceTaskLogsResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns table and schema statistics for one or more provisioned replications that use a
 * given DMS Serverless replication configuration.
 */
export const describeReplicationTableStatistics =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReplicationTableStatisticsMessage,
    output: DescribeReplicationTableStatisticsResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns the task assessment results from the Amazon S3 bucket that DMS creates in your
 * Amazon Web Services account. This action always returns the latest results.
 *
 * For more information about DMS task assessments, see Creating a task assessment
 * report in the *Database Migration Service User Guide*.
 */
export const describeReplicationTaskAssessmentResults =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReplicationTaskAssessmentResultsMessage,
    output: DescribeReplicationTaskAssessmentResultsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a paginated list of individual assessments based on filter settings.
 *
 * These filter settings can specify a combination of premigration assessment runs,
 * migration tasks, and assessment status values.
 */
export const describeReplicationTaskIndividualAssessments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReplicationTaskIndividualAssessmentsMessage,
    output: DescribeReplicationTaskIndividualAssessmentsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Saves a copy of a database migration assessment report to your Amazon S3 bucket. DMS can
 * save your assessment report as a comma-separated value (CSV) or a PDF file.
 */
export const exportMetadataModelAssessment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ExportMetadataModelAssessmentMessage,
    output: ExportMetadataModelAssessmentResponse,
    errors: [ResourceNotFoundFault],
  }));
/**
 * Reloads the target database table with the source data for a given DMS Serverless
 * replication configuration.
 *
 * You can only use this operation with a task in the RUNNING state, otherwise the service
 * will throw an `InvalidResourceStateFault` exception.
 */
export const reloadReplicationTables = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ReloadReplicationTablesMessage,
    output: ReloadReplicationTablesResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
  }),
);
/**
 * Returns information about data migrations.
 */
export const describeDataMigrations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDataMigrationsMessage,
    output: DescribeDataMigrationsResponse,
    errors: [
      FailedDependencyFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "DataMigrations",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a paginated list of data providers for your account in the current
 * region.
 */
export const describeDataProviders =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDataProvidersMessage,
    output: DescribeDataProvidersResponse,
    errors: [AccessDeniedFault, FailedDependencyFault, ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a paginated list of instance profiles for your account in the current
 * region.
 */
export const describeInstanceProfiles =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeInstanceProfilesMessage,
    output: DescribeInstanceProfilesResponse,
    errors: [AccessDeniedFault, FailedDependencyFault, ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a paginated list of migration projects for your account in the current
 * region.
 */
export const describeMigrationProjects =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeMigrationProjectsMessage,
    output: DescribeMigrationProjectsResponse,
    errors: [AccessDeniedFault, FailedDependencyFault, ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Modifies an existing DMS data migration.
 */
export const modifyDataMigration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDataMigrationMessage,
  output: ModifyDataMigrationResponse,
  errors: [
    FailedDependencyFault,
    InvalidResourceStateFault,
    ResourceNotFoundFault,
  ],
}));
/**
 * Modifies the specified data provider using the provided settings.
 *
 * You must remove the data provider from all migration projects before you can modify
 * it.
 */
export const modifyDataProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyDataProviderMessage,
  output: ModifyDataProviderResponse,
  errors: [
    AccessDeniedFault,
    FailedDependencyFault,
    InvalidResourceStateFault,
    ResourceNotFoundFault,
  ],
}));
/**
 * Starts the specified data migration.
 */
export const startDataMigration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDataMigrationMessage,
  output: StartDataMigrationResponse,
  errors: [
    FailedDependencyFault,
    InvalidOperationFault,
    InvalidResourceStateFault,
    ResourceNotFoundFault,
    ResourceQuotaExceededFault,
  ],
}));
/**
 * Stops the specified data migration.
 */
export const stopDataMigration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopDataMigrationMessage,
  output: StopDataMigrationResponse,
  errors: [
    FailedDependencyFault,
    InvalidResourceStateFault,
    ResourceNotFoundFault,
  ],
}));
/**
 * Deletes the specified data provider.
 *
 * All migration projects associated with the data provider must be deleted or modified
 * before you can delete the data provider.
 */
export const deleteDataProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataProviderMessage,
  output: DeleteDataProviderResponse,
  errors: [
    AccessDeniedFault,
    FailedDependencyFault,
    InvalidResourceStateFault,
    ResourceNotFoundFault,
  ],
}));
/**
 * Returns configuration parameters for a schema conversion project.
 */
export const describeConversionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeConversionConfigurationMessage,
    output: DescribeConversionConfigurationResponse,
    errors: [ResourceNotFoundFault],
  }));
/**
 * Returns information about the endpoints for your account in the current region.
 */
export const describeEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeEndpointsMessage,
    output: DescribeEndpointsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }),
);
/**
 * Lists all the event subscriptions for a customer account. The description of a
 * subscription includes `SubscriptionName`, `SNSTopicARN`,
 * `CustomerID`, `SourceType`, `SourceID`,
 * `CreationTime`, and `Status`.
 *
 * If you specify `SubscriptionName`, this action lists the description for that
 * subscription.
 */
export const describeEventSubscriptions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeEventSubscriptionsMessage,
    output: DescribeEventSubscriptionsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a paginated list of metadata model assessments for your account in the current
 * region.
 */
export const describeMetadataModelAssessments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeMetadataModelAssessmentsMessage,
    output: DescribeMetadataModelAssessmentsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Gets a list of child metadata models for the specified metadata model in the database hierarchy.
 */
export const describeMetadataModelChildren =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeMetadataModelChildrenMessage,
    output: DescribeMetadataModelChildrenResponse,
    errors: [AccessDeniedFault, ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "MetadataModelChildren",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a paginated list of metadata model conversions for a migration project.
 */
export const describeMetadataModelConversions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeMetadataModelConversionsMessage,
    output: DescribeMetadataModelConversionsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a paginated list of metadata model creation requests for a migration project.
 */
export const describeMetadataModelCreations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeMetadataModelCreationsMessage,
    output: DescribeMetadataModelCreationsResponse,
    errors: [AccessDeniedFault, ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      items: "Requests",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a paginated list of metadata model exports.
 */
export const describeMetadataModelExportsAsScript =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeMetadataModelExportsAsScriptMessage,
    output: DescribeMetadataModelExportsAsScriptResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a paginated list of metadata model exports.
 */
export const describeMetadataModelExportsToTarget =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeMetadataModelExportsToTargetMessage,
    output: DescribeMetadataModelExportsToTargetResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a paginated list of metadata model imports.
 */
export const describeMetadataModelImports =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeMetadataModelImportsMessage,
    output: DescribeMetadataModelImportsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a list of upcoming maintenance events for replication instances in your account
 * in the current Region.
 */
export const describePendingMaintenanceActions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribePendingMaintenanceActionsMessage,
    output: DescribePendingMaintenanceActionsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns one or more existing DMS Serverless replication configurations as a list of
 * structures.
 */
export const describeReplicationConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReplicationConfigsMessage,
    output: DescribeReplicationConfigsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns information about replication instances for your account in the current
 * region.
 */
export const describeReplicationInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReplicationInstancesMessage,
    output: DescribeReplicationInstancesResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns information about the replication subnet groups.
 */
export const describeReplicationSubnetGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReplicationSubnetGroupsMessage,
    output: DescribeReplicationSubnetGroupsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns a paginated list of premigration assessment runs based on filter
 * settings.
 *
 * These filter settings can specify a combination of premigration assessment runs,
 * migration tasks, replication instances, and assessment run status values.
 *
 * This operation doesn't return information about individual assessments. For this
 * information, see the `DescribeReplicationTaskIndividualAssessments`
 * operation.
 */
export const describeReplicationTaskAssessmentRuns =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReplicationTaskAssessmentRunsMessage,
    output: DescribeReplicationTaskAssessmentRunsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns information about replication tasks for your account in the current
 * region.
 */
export const describeReplicationTasks =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReplicationTasksMessage,
    output: DescribeReplicationTasksResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Removes metadata tags from an DMS resource, including replication instance, endpoint,
 * subnet group, and migration task. For more information, see
 * `Tag`
 * data type
 * description.
 */
export const removeTagsFromResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveTagsFromResourceMessage,
    output: RemoveTagsFromResourceResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
  }),
);
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Starts the analysis of your source database to provide recommendations of target
 * engines.
 *
 * You can create recommendations for multiple source databases using BatchStartRecommendations.
 */
export const startRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartRecommendationsRequest,
    output: StartRecommendationsResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * For a given DMS Serverless replication configuration, DMS connects to the source
 * endpoint and collects the metadata to analyze the replication workload. Using this
 * metadata, DMS then computes and provisions the required capacity and starts replicating
 * to the target endpoint using the server resources that DMS has provisioned for the DMS
 * Serverless replication.
 */
export const startReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartReplicationMessage,
  output: StartReplicationResponse,
  errors: [AccessDeniedFault, InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Starts the replication task.
 *
 * For more information about DMS tasks, see Working with Migration Tasks in the
 * *Database Migration Service User Guide.*
 */
export const startReplicationTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartReplicationTaskMessage,
    output: StartReplicationTaskResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * Starts the replication task assessment for unsupported data types in the source
 * database.
 *
 * You can only use this operation for a task if the following conditions are true:
 *
 * - The task must be in the `stopped` state.
 *
 * - The task must have successful connections to the source and target.
 *
 * If either of these conditions are not met, an `InvalidResourceStateFault`
 * error will result.
 *
 * For information about DMS task assessments, see Creating a task assessment report in the Database Migration Service User
 * Guide.
 */
export const startReplicationTaskAssessment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartReplicationTaskAssessmentMessage,
    output: StartReplicationTaskAssessmentResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
  }));
/**
 * For a given DMS Serverless replication configuration, DMS stops any and all ongoing
 * DMS Serverless replications. This command doesn't deprovision the stopped
 * replications.
 */
export const stopReplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopReplicationMessage,
  output: StopReplicationResponse,
  errors: [AccessDeniedFault, InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Stops the replication task.
 */
export const stopReplicationTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopReplicationTaskMessage,
  output: StopReplicationTaskResponse,
  errors: [InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Deletes a subnet group.
 */
export const deleteReplicationSubnetGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteReplicationSubnetGroupMessage,
    output: DeleteReplicationSubnetGroupResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }));
/**
 * Cancels a single metadata model creation operation that was started with `StartMetadataModelCreation`.
 */
export const cancelMetadataModelCreation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelMetadataModelCreationMessage,
    output: CancelMetadataModelCreationResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * Deletes an DMS event subscription.
 */
export const deleteEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEventSubscriptionMessage,
    output: DeleteEventSubscriptionResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Runs large-scale assessment (LSA) analysis on every Fleet Advisor collector in your account.
 */
export const runFleetAdvisorLsaAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RunFleetAdvisorLsaAnalysisRequest,
    output: RunFleetAdvisorLsaAnalysisResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
  }),
);
/**
 * Adds metadata tags to an DMS resource, including replication instance, endpoint,
 * subnet group, and migration task. These tags can also be used with cost allocation
 * reporting to track cost associated with DMS resources, or used in a Condition statement in
 * an IAM policy for DMS. For more information, see
 * `Tag`
 * data type
 * description.
 */
export const addTagsToResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToResourceMessage,
  output: AddTagsToResourceResponse,
  errors: [InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Deletes the specified replication task.
 */
export const deleteReplicationTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteReplicationTaskMessage,
    output: DeleteReplicationTaskResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
  }),
);
/**
 * Deletes the record of a single premigration assessment run.
 *
 * This operation removes all metadata that DMS maintains about this assessment run.
 * However, the operation leaves untouched all information about this assessment run that is
 * stored in your Amazon S3 bucket.
 */
export const deleteReplicationTaskAssessmentRun =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteReplicationTaskAssessmentRunMessage,
    output: DeleteReplicationTaskAssessmentRunResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }));
/**
 * Provides a list of individual assessments that you can specify for a new premigration
 * assessment run, given one or more parameters.
 *
 * If you specify an existing migration task, this operation provides the default
 * individual assessments you can specify for that task. Otherwise, the specified parameters
 * model elements of a possible migration task on which to base a premigration assessment
 * run.
 *
 * To use these migration task modeling parameters, you must specify an existing
 * replication instance, a source database engine, a target database engine, and a migration
 * type. This combination of parameters potentially limits the default individual assessments
 * available for an assessment run created for a corresponding migration task.
 *
 * If you specify no parameters, this operation provides a list of all possible individual
 * assessments that you can specify for an assessment run. If you specify any one of the task
 * modeling parameters, you must specify all of them or the operation cannot provide a list of
 * individual assessments. The only parameter that you can specify alone is for an existing
 * migration task. The specified task definition then determines the default list of
 * individual assessments that you can specify in an assessment run for the task.
 */
export const describeApplicableIndividualAssessments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeApplicableIndividualAssessmentsMessage,
    output: DescribeApplicableIndividualAssessmentsResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Returns information about the schema for the specified endpoint.
 */
export const describeSchemas = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeSchemasMessage,
    output: DescribeSchemasResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }),
);
/**
 * Returns table statistics on the database migration task, including table name, rows
 * inserted, rows updated, and rows deleted.
 *
 * Note that the "last updated" column the DMS console only indicates the time that DMS
 * last updated the table statistics record for a table. It does not indicate the time of the
 * last update to the table.
 */
export const describeTableStatistics =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeTableStatisticsMessage,
    output: DescribeTableStatisticsResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Converts source selection rules into their target counterparts for schema conversion operations.
 */
export const getTargetSelectionRules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTargetSelectionRulesMessage,
    output: GetTargetSelectionRulesResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * Lists all metadata tags attached to an DMS resource, including replication instance,
 * endpoint, subnet group, and migration task. For more information, see
 * `Tag`
 *
 * data type description.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceMessage,
  output: ListTagsForResourceResponse,
  errors: [InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Modifies the specified schema conversion configuration using the provided parameters.
 */
export const modifyConversionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyConversionConfigurationMessage,
    output: ModifyConversionConfigurationResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
  }));
/**
 * Reboots a replication instance. Rebooting results in a momentary outage, until the
 * replication instance becomes available again.
 */
export const rebootReplicationInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RebootReplicationInstanceMessage,
    output: RebootReplicationInstanceResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
  }),
);
/**
 * Reloads the target database table with the source data.
 *
 * You can only use this operation with a task in the `RUNNING` state, otherwise
 * the service will throw an `InvalidResourceStateFault` exception.
 */
export const reloadTables = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReloadTablesMessage,
  output: ReloadTablesResponse,
  errors: [InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Deletes the specified certificate.
 */
export const deleteCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCertificateMessage,
  output: DeleteCertificateResponse,
  errors: [InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Deletes the connection between a replication instance and an endpoint.
 */
export const deleteConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionMessage,
  output: DeleteConnectionResponse,
  errors: [AccessDeniedFault, InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Deletes the specified Fleet Advisor collector databases.
 */
export const deleteFleetAdvisorDatabases = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFleetAdvisorDatabasesRequest,
    output: DeleteFleetAdvisorDatabasesResponse,
    errors: [AccessDeniedFault, InvalidOperationFault, ResourceNotFoundFault],
  }),
);
/**
 * Deletes the specified instance profile.
 *
 * All migration projects associated with the instance profile must be deleted or
 * modified before you can delete the instance profile.
 */
export const deleteInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInstanceProfileMessage,
    output: DeleteInstanceProfileResponse,
    errors: [
      AccessDeniedFault,
      FailedDependencyFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * Deletes an DMS Serverless replication configuration. This effectively deprovisions any
 * and all replications that use this configuration. You can't delete the configuration for an
 * DMS Serverless replication that is ongoing. You can delete the configuration when the
 * replication is in a non-RUNNING and non-STARTING state.
 */
export const deleteReplicationConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteReplicationConfigMessage,
    output: DeleteReplicationConfigResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * Provides a description of the certificate.
 */
export const describeCertificates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeCertificatesMessage,
    output: DescribeCertificatesResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Tests the connection between the replication instance and the endpoint.
 */
export const testConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestConnectionMessage,
  output: TestConnectionResponse,
  errors: [
    AccessDeniedFault,
    InvalidResourceStateFault,
    KMSKeyNotAccessibleFault,
    ResourceNotFoundFault,
    ResourceQuotaExceededFault,
  ],
}));
/**
 * Moves a replication task from its current replication instance to a different target
 * replication instance using the specified parameters. The target replication instance must
 * be created with the same or later DMS version as the current replication instance.
 */
export const moveReplicationTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MoveReplicationTaskMessage,
  output: MoveReplicationTaskResponse,
  errors: [
    AccessDeniedFault,
    InvalidResourceStateFault,
    KMSKeyNotAccessibleFault,
    ResourceNotFoundFault,
    ResourceQuotaExceededFault,
  ],
}));
/**
 * Populates the schema for the specified endpoint. This is an asynchronous operation and
 * can take several minutes. You can check the status of this operation by calling the
 * DescribeRefreshSchemasStatus operation.
 */
export const refreshSchemas = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RefreshSchemasMessage,
  output: RefreshSchemasResponse,
  errors: [
    InvalidResourceStateFault,
    KMSKeyNotAccessibleFault,
    ResourceNotFoundFault,
    ResourceQuotaExceededFault,
  ],
}));
/**
 * Applies a pending maintenance action to a resource (for example, to a replication
 * instance).
 */
export const applyPendingMaintenanceAction =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ApplyPendingMaintenanceActionMessage,
    output: ApplyPendingMaintenanceActionResponse,
    errors: [ResourceNotFoundFault],
  }));
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Starts the analysis of up to 20 source databases to recommend target engines for each
 * source database. This is a batch version of StartRecommendations.
 *
 * The result of analysis of each source database is reported individually in the
 * response. Because the batch request can result in a combination of successful and
 * unsuccessful actions, you should check for batch errors even when the call returns an
 * HTTP status code of `200`.
 */
export const batchStartRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchStartRecommendationsRequest,
    output: BatchStartRecommendationsResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * Cancels a single premigration assessment run.
 *
 * This operation prevents any individual assessments from running if they haven't started
 * running. It also attempts to cancel any individual assessments that are currently
 * running.
 */
export const cancelReplicationTaskAssessmentRun =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelReplicationTaskAssessmentRunMessage,
    output: CancelReplicationTaskAssessmentRunResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }));
/**
 * Deletes the specified data migration.
 */
export const deleteDataMigration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataMigrationMessage,
  output: DeleteDataMigrationResponse,
  errors: [
    FailedDependencyFault,
    InvalidResourceStateFault,
    ResourceNotFoundFault,
  ],
}));
/**
 * Deletes the specified endpoint.
 *
 * All tasks associated with the endpoint must be deleted before you can delete the
 * endpoint.
 */
export const deleteEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointMessage,
  output: DeleteEndpointResponse,
  errors: [InvalidResourceStateFault, ResourceNotFoundFault],
}));
/**
 * Deletes the specified migration project.
 *
 * The migration project must be closed before you can delete it.
 */
export const deleteMigrationProject = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMigrationProjectMessage,
    output: DeleteMigrationProjectResponse,
    errors: [
      AccessDeniedFault,
      FailedDependencyFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * Deletes the specified replication instance.
 *
 * You must delete any migration tasks that are associated with the replication instance
 * before you can delete it.
 */
export const deleteReplicationInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteReplicationInstanceMessage,
    output: DeleteReplicationInstanceResponse,
    errors: [InvalidResourceStateFault, ResourceNotFoundFault],
  }),
);
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Returns a list of the Fleet Advisor collectors in your account.
 */
export const describeFleetAdvisorCollectors =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeFleetAdvisorCollectorsRequest,
    output: DescribeFleetAdvisorCollectorsResponse,
    errors: [InvalidResourceStateFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Returns a list of Fleet Advisor databases in your account.
 */
export const describeFleetAdvisorDatabases =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeFleetAdvisorDatabasesRequest,
    output: DescribeFleetAdvisorDatabasesResponse,
    errors: [InvalidResourceStateFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Returns a list of schemas detected by Fleet Advisor Collectors in your account.
 */
export const describeFleetAdvisorSchemas =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeFleetAdvisorSchemasRequest,
    output: DescribeFleetAdvisorSchemasResponse,
    errors: [InvalidResourceStateFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Provides details on replication progress by returning status information for one or more
 * provisioned DMS Serverless replications.
 */
export const describeReplications =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeReplicationsMessage,
    output: DescribeReplicationsResponse,
    errors: [ResourceNotFoundFault],
    pagination: {
      inputToken: "Marker",
      outputToken: "Marker",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Creates source metadata model of the given type with the specified properties for schema conversion operations.
 *
 * This action supports only these directions: from SQL Server to Aurora PostgreSQL, or from SQL Server to RDS for PostgreSQL.
 */
export const startMetadataModelCreation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMetadataModelCreationMessage,
    output: StartMetadataModelCreationResponse,
    errors: [
      AccessDeniedFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
    ],
  }),
);
/**
 * Creates a data migration using the provided settings.
 */
export const createDataMigration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataMigrationMessage,
  output: CreateDataMigrationResponse,
  errors: [
    FailedDependencyFault,
    InvalidOperationFault,
    ResourceAlreadyExistsFault,
    ResourceNotFoundFault,
    ResourceQuotaExceededFault,
  ],
}));
/**
 * Modifies the specified endpoint.
 *
 * For a MySQL source or target endpoint, don't explicitly specify the database using
 * the `DatabaseName` request parameter on the `ModifyEndpoint` API
 * call. Specifying `DatabaseName` when you modify a MySQL endpoint replicates
 * all the task tables to this single database. For MySQL endpoints, you specify the
 * database only when you specify the schema in the table-mapping rules of the DMS
 * task.
 */
export const modifyEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyEndpointMessage,
  output: ModifyEndpointResponse,
  errors: [
    AccessDeniedFault,
    InvalidResourceStateFault,
    KMSKeyNotAccessibleFault,
    ResourceAlreadyExistsFault,
    ResourceNotFoundFault,
  ],
}));
/**
 * Modifies the specified replication task.
 *
 * You can't modify the task endpoints. The task must be stopped before you can modify it.
 *
 * For more information about DMS tasks, see Working with Migration Tasks in the
 * *Database Migration Service User Guide*.
 */
export const modifyReplicationTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyReplicationTaskMessage,
    output: ModifyReplicationTaskResponse,
    errors: [
      InvalidResourceStateFault,
      KMSKeyNotAccessibleFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * Creates an endpoint using the provided settings.
 *
 * For a MySQL source or target endpoint, don't explicitly specify the database using
 * the `DatabaseName` request parameter on the `CreateEndpoint` API
 * call. Specifying `DatabaseName` when you create a MySQL endpoint replicates
 * all the task tables to this single database. For MySQL endpoints, you specify the
 * database only when you specify the schema in the table-mapping rules of the DMS
 * task.
 */
export const createEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEndpointMessage,
  output: CreateEndpointResponse,
  errors: [
    AccessDeniedFault,
    InvalidResourceStateFault,
    KMSKeyNotAccessibleFault,
    ResourceAlreadyExistsFault,
    ResourceNotFoundFault,
    ResourceQuotaExceededFault,
    S3AccessDeniedFault,
  ],
}));
/**
 * Uploads the specified certificate.
 */
export const importCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportCertificateMessage,
  output: ImportCertificateResponse,
  errors: [
    InvalidCertificateFault,
    KMSKeyNotAccessibleFault,
    ResourceAlreadyExistsFault,
    ResourceQuotaExceededFault,
  ],
}));
/**
 * Creates a data provider using the provided settings. A data provider stores a data store
 * type and location information about your database.
 */
export const createDataProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataProviderMessage,
  output: CreateDataProviderResponse,
  errors: [
    AccessDeniedFault,
    FailedDependencyFault,
    ResourceAlreadyExistsFault,
    ResourceQuotaExceededFault,
  ],
}));
/**
 * Creates a replication task using the specified parameters.
 */
export const createReplicationTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateReplicationTaskMessage,
    output: CreateReplicationTaskResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      KMSKeyNotAccessibleFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
    ],
  }),
);
/**
 * Modifies an existing DMS Serverless replication configuration that you can use to
 * start a replication. This command includes input validation and logic to check the state of
 * any replication that uses this configuration. You can only modify a replication
 * configuration before any replication that uses it has started. As soon as you have
 * initially started a replication with a given configuiration, you can't modify that
 * configuration, even if you stop it.
 *
 * Other run statuses that allow you to run this command include FAILED and CREATED. A
 * provisioning state that allows you to run this command is FAILED_PROVISION.
 */
export const modifyReplicationConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyReplicationConfigMessage,
    output: ModifyReplicationConfigResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      InvalidSubnet,
      KMSKeyNotAccessibleFault,
      ReplicationSubnetGroupDoesNotCoverEnoughAZs,
      ResourceNotFoundFault,
    ],
  }),
);
/**
 * Creates a configuration that you can later provide to configure and start an DMS
 * Serverless replication. You can also provide options to validate the configuration inputs
 * before you start the replication.
 */
export const createReplicationConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateReplicationConfigMessage,
    output: CreateReplicationConfigResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      InvalidSubnet,
      KMSKeyNotAccessibleFault,
      ReplicationSubnetGroupDoesNotCoverEnoughAZs,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
    ],
  }),
);
/**
 * Cancels a single metadata model conversion operation that was started with `StartMetadataModelConversion`.
 */
export const cancelMetadataModelConversion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelMetadataModelConversionMessage,
    output: CancelMetadataModelConversionResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
    ],
  }));
/**
 * Creates a replication subnet group given a list of the subnet IDs in a VPC.
 *
 * The VPC needs to have at least one subnet in at least two availability zones in the
 * Amazon Web Services Region, otherwise the service will throw a
 * `ReplicationSubnetGroupDoesNotCoverEnoughAZs` exception.
 *
 * If a replication subnet group exists in your Amazon Web Services account, the
 * CreateReplicationSubnetGroup action returns the following error message: The Replication
 * Subnet Group already exists. In this case, delete the existing replication subnet group. To
 * do so, use the DeleteReplicationSubnetGroup action. Optionally, choose Subnet groups in the
 * DMS console, then choose your subnet group. Next, choose Delete from Actions.
 */
export const createReplicationSubnetGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateReplicationSubnetGroupMessage,
    output: CreateReplicationSubnetGroupResponse,
    errors: [
      AccessDeniedFault,
      InvalidSubnet,
      ReplicationSubnetGroupDoesNotCoverEnoughAZs,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
    ],
  }));
/**
 * Modifies the settings for the specified replication subnet group.
 */
export const modifyReplicationSubnetGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ModifyReplicationSubnetGroupMessage,
    output: ModifyReplicationSubnetGroupResponse,
    errors: [
      AccessDeniedFault,
      InvalidSubnet,
      ReplicationSubnetGroupDoesNotCoverEnoughAZs,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      SubnetAlreadyInUse,
    ],
  }));
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Creates a Fleet Advisor collector using the specified parameters.
 */
export const createFleetAdvisorCollector = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFleetAdvisorCollectorRequest,
    output: CreateFleetAdvisorCollectorResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      ResourceQuotaExceededFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }),
);
/**
 * Creates the replication instance using the specified parameters.
 *
 * DMS requires that your account have certain roles with appropriate permissions before
 * you can create a replication instance. For information on the required roles, see Creating the IAM Roles to Use With the CLI and DMS API. For information on
 * the required permissions, see IAM
 * Permissions Needed to Use DMS.
 *
 * If you don't specify a version when creating a replication instance, DMS will
 * create the instance using the default engine version. For information about the default
 * engine version, see Release Notes.
 */
export const createReplicationInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateReplicationInstanceMessage,
    output: CreateReplicationInstanceResponse,
    errors: [
      AccessDeniedFault,
      InsufficientResourceCapacityFault,
      InvalidResourceStateFault,
      InvalidSubnet,
      KMSKeyNotAccessibleFault,
      ReplicationSubnetGroupDoesNotCoverEnoughAZs,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      StorageQuotaExceededFault,
    ],
  }),
);
/**
 * Applies the extension pack to your target database. An extension pack is an add-on
 * module that emulates functions present in a source database that are required when
 * converting objects to the target database.
 */
export const startExtensionPackAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartExtensionPackAssociationMessage,
    output: StartExtensionPackAssociationResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      KMSKeyNotAccessibleFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }));
/**
 * Creates the instance profile using the specified parameters.
 */
export const createInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateInstanceProfileMessage,
    output: CreateInstanceProfileResponse,
    errors: [
      AccessDeniedFault,
      FailedDependencyFault,
      InvalidResourceStateFault,
      KMSKeyNotAccessibleFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }),
);
/**
 * Creates the migration project using the specified parameters.
 *
 * You can run this action only after you create an instance profile and data providers
 * using CreateInstanceProfile and CreateDataProvider.
 */
export const createMigrationProject = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMigrationProjectMessage,
    output: CreateMigrationProjectResponse,
    errors: [
      AccessDeniedFault,
      FailedDependencyFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }),
);
/**
 * Creates a database migration assessment report by assessing the migration complexity for
 * your source database. A database migration assessment report summarizes all of the schema
 * conversion tasks. It also details the action items for database objects that can't be
 * converted to the database engine of your target database instance.
 */
export const startMetadataModelAssessment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartMetadataModelAssessmentMessage,
    output: StartMetadataModelAssessmentResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      KMSKeyNotAccessibleFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }));
/**
 * Converts your source database objects to a format compatible with the target database.
 */
export const startMetadataModelConversion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartMetadataModelConversionMessage,
    output: StartMetadataModelConversionResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      KMSKeyNotAccessibleFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }));
/**
 * Saves your converted code to a file as a SQL script, and stores this file on your Amazon S3
 * bucket.
 */
export const startMetadataModelExportAsScript =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartMetadataModelExportAsScriptMessage,
    output: StartMetadataModelExportAsScriptResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      KMSKeyNotAccessibleFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }));
/**
 * Applies converted database objects to your target database.
 */
export const startMetadataModelExportToTarget =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartMetadataModelExportToTargetMessage,
    output: StartMetadataModelExportToTargetResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      KMSKeyNotAccessibleFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }));
/**
 * Loads the metadata for all the dependent database objects of the parent object.
 *
 * This operation uses your project's Amazon S3 bucket as a metadata cache to improve
 * performance.
 */
export const startMetadataModelImport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMetadataModelImportMessage,
    output: StartMetadataModelImportResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      KMSKeyNotAccessibleFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }),
);
/**
 * Modifies the specified instance profile using the provided parameters.
 *
 * All migration projects associated with the instance profile must be deleted or
 * modified before you can modify the instance profile.
 */
export const modifyInstanceProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyInstanceProfileMessage,
    output: ModifyInstanceProfileResponse,
    errors: [
      AccessDeniedFault,
      FailedDependencyFault,
      InvalidResourceStateFault,
      KMSKeyNotAccessibleFault,
      ResourceNotFoundFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }),
);
/**
 * Modifies the specified migration project using the provided parameters.
 *
 * The migration project must be closed before you can modify it.
 */
export const modifyMigrationProject = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyMigrationProjectMessage,
    output: ModifyMigrationProjectResponse,
    errors: [
      AccessDeniedFault,
      FailedDependencyFault,
      InvalidResourceStateFault,
      ResourceNotFoundFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }),
);
/**
 * End of support notice: On May 20, 2026, Amazon Web Services will end support for Amazon Web Services DMS Fleet Advisor;. After May 20, 2026, you will no longer be able to access the Amazon Web Services DMS Fleet Advisor; console or Amazon Web Services DMS Fleet Advisor; resources. For more information, see Amazon Web Services DMS Fleet Advisor end of support.
 *
 * Returns a paginated list of target engine recommendations for your source
 * databases.
 */
export const describeRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeRecommendationsRequest,
    output: DescribeRecommendationsResponse,
    errors: [AccessDeniedFault, InvalidResourceStateFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Modifies the replication instance to apply new settings. You can change one or more
 * parameters by specifying these parameters and the new values in the request.
 *
 * Some settings are applied during the maintenance window.
 */
export const modifyReplicationInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyReplicationInstanceMessage,
    output: ModifyReplicationInstanceResponse,
    errors: [
      AccessDeniedFault,
      InsufficientResourceCapacityFault,
      InvalidResourceStateFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      StorageQuotaExceededFault,
      UpgradeDependencyFailureFault,
    ],
  }),
);
/**
 * Starts a new premigration assessment run for one or more individual assessments of a
 * migration task.
 *
 * The assessments that you can specify depend on the source and target database engine and
 * the migration type defined for the given task. To run this operation, your migration task
 * must already be created. After you run this operation, you can review the status of each
 * individual assessment. You can also run the migration task manually after the assessment
 * run and its individual assessments complete.
 */
export const startReplicationTaskAssessmentRun =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartReplicationTaskAssessmentRunMessage,
    output: StartReplicationTaskAssessmentRunResponse,
    errors: [
      AccessDeniedFault,
      InvalidResourceStateFault,
      KMSAccessDeniedFault,
      KMSDisabledFault,
      KMSFault,
      KMSInvalidStateFault,
      KMSKeyNotAccessibleFault,
      KMSNotFoundFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      S3AccessDeniedFault,
      S3ResourceNotFoundFault,
    ],
  }));
/**
 * Modifies an existing DMS event notification subscription.
 */
export const modifyEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyEventSubscriptionMessage,
    output: ModifyEventSubscriptionResponse,
    errors: [
      AccessDeniedFault,
      KMSAccessDeniedFault,
      KMSDisabledFault,
      KMSInvalidStateFault,
      KMSNotFoundFault,
      KMSThrottlingFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      SNSInvalidTopicFault,
      SNSNoAuthorizationFault,
    ],
  }),
);
/**
 * Creates an DMS event notification subscription.
 *
 * You can specify the type of source (`SourceType`) you want to be notified of,
 * provide a list of DMS source IDs (`SourceIds`) that triggers the events, and
 * provide a list of event categories (`EventCategories`) for events you want to be
 * notified of. If you specify both the `SourceType` and `SourceIds`,
 * such as `SourceType = replication-instance` and SourceIdentifier =
 * my-replinstance, you will be notified of all the replication instance events for
 * the specified source. If you specify a `SourceType` but don't specify a
 * `SourceIdentifier`, you receive notice of the events for that source type for
 * all your DMS sources. If you don't specify either `SourceType` nor
 * `SourceIdentifier`, you will be notified of events generated from all DMS
 * sources belonging to your customer account.
 *
 * For more information about DMS events, see Working with Events and
 * Notifications in the *Database Migration Service User Guide.*
 */
export const createEventSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEventSubscriptionMessage,
    output: CreateEventSubscriptionResponse,
    errors: [
      KMSAccessDeniedFault,
      KMSDisabledFault,
      KMSInvalidStateFault,
      KMSNotFoundFault,
      KMSThrottlingFault,
      ResourceAlreadyExistsFault,
      ResourceNotFoundFault,
      ResourceQuotaExceededFault,
      SNSInvalidTopicFault,
      SNSNoAuthorizationFault,
    ],
  }),
);

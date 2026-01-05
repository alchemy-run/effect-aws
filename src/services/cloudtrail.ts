import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://cloudtrail.amazonaws.com/doc/2013-11-01/");
const svc = T.AwsApiService({
  sdkId: "CloudTrail",
  serviceShapeName: "CloudTrail_20131101",
});
const auth = T.AwsAuthSigv4({ name: "cloudtrail" });
const ver = T.ServiceVersion("2013-11-01");
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
                        url: "https://cloudtrail-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          argv: [{ ref: "Region" }, "us-gov-east-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://cloudtrail.us-gov-east-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://cloudtrail.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://cloudtrail-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://cloudtrail.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://cloudtrail.{Region}.{PartitionResult#dnsSuffix}",
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
export const TrailNameList = S.Array(S.String);
export const EventDataStoreList = S.Array(S.String);
export const ResourceIdList = S.Array(S.String);
export const ImportDestinations = S.Array(S.String);
export const QueryParameters = S.Array(S.String);
export class CancelQueryRequest extends S.Class<CancelQueryRequest>(
  "CancelQueryRequest",
)(
  {
    EventDataStore: S.optional(S.String),
    QueryId: S.String,
    EventDataStoreOwnerAccountId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const TagsList = S.Array(Tag);
export class CreateTrailRequest extends S.Class<CreateTrailRequest>(
  "CreateTrailRequest",
)(
  {
    Name: S.String,
    S3BucketName: S.String,
    S3KeyPrefix: S.optional(S.String),
    SnsTopicName: S.optional(S.String),
    IncludeGlobalServiceEvents: S.optional(S.Boolean),
    IsMultiRegionTrail: S.optional(S.Boolean),
    EnableLogFileValidation: S.optional(S.Boolean),
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    CloudWatchLogsRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    IsOrganizationTrail: S.optional(S.Boolean),
    TagsList: S.optional(TagsList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteChannelRequest extends S.Class<DeleteChannelRequest>(
  "DeleteChannelRequest",
)(
  { Channel: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteChannelResponse extends S.Class<DeleteChannelResponse>(
  "DeleteChannelResponse",
)({}, ns) {}
export class DeleteDashboardRequest extends S.Class<DeleteDashboardRequest>(
  "DeleteDashboardRequest",
)(
  { DashboardId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDashboardResponse extends S.Class<DeleteDashboardResponse>(
  "DeleteDashboardResponse",
)({}, ns) {}
export class DeleteEventDataStoreRequest extends S.Class<DeleteEventDataStoreRequest>(
  "DeleteEventDataStoreRequest",
)(
  { EventDataStore: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEventDataStoreResponse extends S.Class<DeleteEventDataStoreResponse>(
  "DeleteEventDataStoreResponse",
)({}, ns) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}, ns) {}
export class DeleteTrailRequest extends S.Class<DeleteTrailRequest>(
  "DeleteTrailRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTrailResponse extends S.Class<DeleteTrailResponse>(
  "DeleteTrailResponse",
)({}, ns) {}
export class DeregisterOrganizationDelegatedAdminRequest extends S.Class<DeregisterOrganizationDelegatedAdminRequest>(
  "DeregisterOrganizationDelegatedAdminRequest",
)(
  { DelegatedAdminAccountId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterOrganizationDelegatedAdminResponse extends S.Class<DeregisterOrganizationDelegatedAdminResponse>(
  "DeregisterOrganizationDelegatedAdminResponse",
)({}, ns) {}
export class DescribeQueryRequest extends S.Class<DescribeQueryRequest>(
  "DescribeQueryRequest",
)(
  {
    EventDataStore: S.optional(S.String),
    QueryId: S.optional(S.String),
    QueryAlias: S.optional(S.String),
    RefreshId: S.optional(S.String),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTrailsRequest extends S.Class<DescribeTrailsRequest>(
  "DescribeTrailsRequest",
)(
  {
    trailNameList: S.optional(TrailNameList),
    includeShadowTrails: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableFederationRequest extends S.Class<DisableFederationRequest>(
  "DisableFederationRequest",
)(
  { EventDataStore: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableFederationRequest extends S.Class<EnableFederationRequest>(
  "EnableFederationRequest",
)(
  { EventDataStore: S.String, FederationRoleArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GenerateQueryRequest extends S.Class<GenerateQueryRequest>(
  "GenerateQueryRequest",
)(
  { EventDataStores: EventDataStoreList, Prompt: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetChannelRequest extends S.Class<GetChannelRequest>(
  "GetChannelRequest",
)(
  { Channel: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDashboardRequest extends S.Class<GetDashboardRequest>(
  "GetDashboardRequest",
)(
  { DashboardId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEventConfigurationRequest extends S.Class<GetEventConfigurationRequest>(
  "GetEventConfigurationRequest",
)(
  { TrailName: S.optional(S.String), EventDataStore: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEventDataStoreRequest extends S.Class<GetEventDataStoreRequest>(
  "GetEventDataStoreRequest",
)(
  { EventDataStore: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEventSelectorsRequest extends S.Class<GetEventSelectorsRequest>(
  "GetEventSelectorsRequest",
)(
  { TrailName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetImportRequest extends S.Class<GetImportRequest>(
  "GetImportRequest",
)(
  { ImportId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetInsightSelectorsRequest extends S.Class<GetInsightSelectorsRequest>(
  "GetInsightSelectorsRequest",
)(
  { TrailName: S.optional(S.String), EventDataStore: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetQueryResultsRequest extends S.Class<GetQueryResultsRequest>(
  "GetQueryResultsRequest",
)(
  {
    EventDataStore: S.optional(S.String),
    QueryId: S.String,
    NextToken: S.optional(S.String),
    MaxQueryResults: S.optional(S.Number),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTrailRequest extends S.Class<GetTrailRequest>(
  "GetTrailRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTrailStatusRequest extends S.Class<GetTrailStatusRequest>(
  "GetTrailStatusRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListChannelsRequest extends S.Class<ListChannelsRequest>(
  "ListChannelsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDashboardsRequest extends S.Class<ListDashboardsRequest>(
  "ListDashboardsRequest",
)(
  {
    NamePrefix: S.optional(S.String),
    Type: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEventDataStoresRequest extends S.Class<ListEventDataStoresRequest>(
  "ListEventDataStoresRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListImportFailuresRequest extends S.Class<ListImportFailuresRequest>(
  "ListImportFailuresRequest",
)(
  {
    ImportId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListImportsRequest extends S.Class<ListImportsRequest>(
  "ListImportsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    Destination: S.optional(S.String),
    ImportStatus: S.optional(S.String),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInsightsMetricDataRequest extends S.Class<ListInsightsMetricDataRequest>(
  "ListInsightsMetricDataRequest",
)(
  {
    TrailName: S.optional(S.String),
    EventSource: S.String,
    EventName: S.String,
    InsightType: S.String,
    ErrorCode: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Period: S.optional(S.Number),
    DataType: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPublicKeysRequest extends S.Class<ListPublicKeysRequest>(
  "ListPublicKeysRequest",
)(
  {
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListQueriesRequest extends S.Class<ListQueriesRequest>(
  "ListQueriesRequest",
)(
  {
    EventDataStore: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    QueryStatus: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsRequest extends S.Class<ListTagsRequest>(
  "ListTagsRequest",
)(
  { ResourceIdList: ResourceIdList, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTrailsRequest extends S.Class<ListTrailsRequest>(
  "ListTrailsRequest",
)(
  { NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  { ResourceArn: S.String, ResourcePolicy: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterOrganizationDelegatedAdminRequest extends S.Class<RegisterOrganizationDelegatedAdminRequest>(
  "RegisterOrganizationDelegatedAdminRequest",
)(
  { MemberAccountId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterOrganizationDelegatedAdminResponse extends S.Class<RegisterOrganizationDelegatedAdminResponse>(
  "RegisterOrganizationDelegatedAdminResponse",
)({}, ns) {}
export class RemoveTagsRequest extends S.Class<RemoveTagsRequest>(
  "RemoveTagsRequest",
)(
  { ResourceId: S.String, TagsList: TagsList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsResponse extends S.Class<RemoveTagsResponse>(
  "RemoveTagsResponse",
)({}, ns) {}
export class RestoreEventDataStoreRequest extends S.Class<RestoreEventDataStoreRequest>(
  "RestoreEventDataStoreRequest",
)(
  { EventDataStore: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchSampleQueriesRequest extends S.Class<SearchSampleQueriesRequest>(
  "SearchSampleQueriesRequest",
)(
  {
    SearchPhrase: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartEventDataStoreIngestionRequest extends S.Class<StartEventDataStoreIngestionRequest>(
  "StartEventDataStoreIngestionRequest",
)(
  { EventDataStore: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartEventDataStoreIngestionResponse extends S.Class<StartEventDataStoreIngestionResponse>(
  "StartEventDataStoreIngestionResponse",
)({}, ns) {}
export class StartLoggingRequest extends S.Class<StartLoggingRequest>(
  "StartLoggingRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartLoggingResponse extends S.Class<StartLoggingResponse>(
  "StartLoggingResponse",
)({}, ns) {}
export class StartQueryRequest extends S.Class<StartQueryRequest>(
  "StartQueryRequest",
)(
  {
    QueryStatement: S.optional(S.String),
    DeliveryS3Uri: S.optional(S.String),
    QueryAlias: S.optional(S.String),
    QueryParameters: S.optional(QueryParameters),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopEventDataStoreIngestionRequest extends S.Class<StopEventDataStoreIngestionRequest>(
  "StopEventDataStoreIngestionRequest",
)(
  { EventDataStore: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopEventDataStoreIngestionResponse extends S.Class<StopEventDataStoreIngestionResponse>(
  "StopEventDataStoreIngestionResponse",
)({}, ns) {}
export class StopImportRequest extends S.Class<StopImportRequest>(
  "StopImportRequest",
)(
  { ImportId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopLoggingRequest extends S.Class<StopLoggingRequest>(
  "StopLoggingRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopLoggingResponse extends S.Class<StopLoggingResponse>(
  "StopLoggingResponse",
)({}, ns) {}
export class Destination extends S.Class<Destination>("Destination")({
  Type: S.String,
  Location: S.String,
}) {}
export const Destinations = S.Array(Destination);
export class UpdateChannelRequest extends S.Class<UpdateChannelRequest>(
  "UpdateChannelRequest",
)(
  {
    Channel: S.String,
    Destinations: S.optional(Destinations),
    Name: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ViewPropertiesMap = S.Record({ key: S.String, value: S.String });
export class RequestWidget extends S.Class<RequestWidget>("RequestWidget")({
  QueryStatement: S.String,
  QueryParameters: S.optional(QueryParameters),
  ViewProperties: ViewPropertiesMap,
}) {}
export const RequestWidgetList = S.Array(RequestWidget);
export class RefreshScheduleFrequency extends S.Class<RefreshScheduleFrequency>(
  "RefreshScheduleFrequency",
)({ Unit: S.optional(S.String), Value: S.optional(S.Number) }) {}
export class RefreshSchedule extends S.Class<RefreshSchedule>(
  "RefreshSchedule",
)({
  Frequency: S.optional(RefreshScheduleFrequency),
  Status: S.optional(S.String),
  TimeOfDay: S.optional(S.String),
}) {}
export class UpdateDashboardRequest extends S.Class<UpdateDashboardRequest>(
  "UpdateDashboardRequest",
)(
  {
    DashboardId: S.String,
    Widgets: S.optional(RequestWidgetList),
    RefreshSchedule: S.optional(RefreshSchedule),
    TerminationProtectionEnabled: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Operator = S.Array(S.String);
export class AdvancedFieldSelector extends S.Class<AdvancedFieldSelector>(
  "AdvancedFieldSelector",
)({
  Field: S.String,
  Equals: S.optional(Operator),
  StartsWith: S.optional(Operator),
  EndsWith: S.optional(Operator),
  NotEquals: S.optional(Operator),
  NotStartsWith: S.optional(Operator),
  NotEndsWith: S.optional(Operator),
}) {}
export const AdvancedFieldSelectors = S.Array(AdvancedFieldSelector);
export class AdvancedEventSelector extends S.Class<AdvancedEventSelector>(
  "AdvancedEventSelector",
)({ Name: S.optional(S.String), FieldSelectors: AdvancedFieldSelectors }) {}
export const AdvancedEventSelectors = S.Array(AdvancedEventSelector);
export class UpdateEventDataStoreRequest extends S.Class<UpdateEventDataStoreRequest>(
  "UpdateEventDataStoreRequest",
)(
  {
    EventDataStore: S.String,
    Name: S.optional(S.String),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    BillingMode: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTrailRequest extends S.Class<UpdateTrailRequest>(
  "UpdateTrailRequest",
)(
  {
    Name: S.String,
    S3BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    SnsTopicName: S.optional(S.String),
    IncludeGlobalServiceEvents: S.optional(S.Boolean),
    IsMultiRegionTrail: S.optional(S.Boolean),
    EnableLogFileValidation: S.optional(S.Boolean),
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    CloudWatchLogsRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    IsOrganizationTrail: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const OperatorTargetList = S.Array(S.String);
export const Templates = S.Array(S.String);
export const ExcludeManagementEventSources = S.Array(S.String);
export const SourceEventCategories = S.Array(S.String);
export const ListInsightsDataDimensions = S.Record({
  key: S.String,
  value: S.String,
});
export const Timestamps = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export const InsightsMetricValues = S.Array(S.Number);
export class LookupAttribute extends S.Class<LookupAttribute>(
  "LookupAttribute",
)({ AttributeKey: S.String, AttributeValue: S.String }) {}
export const LookupAttributesList = S.Array(LookupAttribute);
export class ContextKeySelector extends S.Class<ContextKeySelector>(
  "ContextKeySelector",
)({ Type: S.String, Equals: OperatorTargetList }) {}
export const ContextKeySelectors = S.Array(ContextKeySelector);
export class AggregationConfiguration extends S.Class<AggregationConfiguration>(
  "AggregationConfiguration",
)({ Templates: Templates, EventCategory: S.String }) {}
export const AggregationConfigurations = S.Array(AggregationConfiguration);
export class InsightSelector extends S.Class<InsightSelector>(
  "InsightSelector",
)({
  InsightType: S.optional(S.String),
  EventCategories: S.optional(SourceEventCategories),
}) {}
export const InsightSelectors = S.Array(InsightSelector);
export const QueryParameterValues = S.Record({
  key: S.String,
  value: S.String,
});
export const DataResourceValues = S.Array(S.String);
export class AddTagsRequest extends S.Class<AddTagsRequest>("AddTagsRequest")(
  { ResourceId: S.String, TagsList: TagsList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddTagsResponse extends S.Class<AddTagsResponse>(
  "AddTagsResponse",
)({}, ns) {}
export class CancelQueryResponse extends S.Class<CancelQueryResponse>(
  "CancelQueryResponse",
)(
  {
    QueryId: S.String,
    QueryStatus: S.String,
    EventDataStoreOwnerAccountId: S.optional(S.String),
  },
  ns,
) {}
export class CreateChannelRequest extends S.Class<CreateChannelRequest>(
  "CreateChannelRequest",
)(
  {
    Name: S.String,
    Source: S.String,
    Destinations: Destinations,
    Tags: S.optional(TagsList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTrailResponse extends S.Class<CreateTrailResponse>(
  "CreateTrailResponse",
)(
  {
    Name: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    SnsTopicName: S.optional(S.String),
    SnsTopicARN: S.optional(S.String),
    IncludeGlobalServiceEvents: S.optional(S.Boolean),
    IsMultiRegionTrail: S.optional(S.Boolean),
    TrailARN: S.optional(S.String),
    LogFileValidationEnabled: S.optional(S.Boolean),
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    CloudWatchLogsRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    IsOrganizationTrail: S.optional(S.Boolean),
  },
  ns,
) {}
export class DisableFederationResponse extends S.Class<DisableFederationResponse>(
  "DisableFederationResponse",
)(
  {
    EventDataStoreArn: S.optional(S.String),
    FederationStatus: S.optional(S.String),
  },
  ns,
) {}
export class EnableFederationResponse extends S.Class<EnableFederationResponse>(
  "EnableFederationResponse",
)(
  {
    EventDataStoreArn: S.optional(S.String),
    FederationStatus: S.optional(S.String),
    FederationRoleArn: S.optional(S.String),
  },
  ns,
) {}
export class GenerateQueryResponse extends S.Class<GenerateQueryResponse>(
  "GenerateQueryResponse",
)(
  {
    QueryStatement: S.optional(S.String),
    QueryAlias: S.optional(S.String),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  },
  ns,
) {}
export class GetEventConfigurationResponse extends S.Class<GetEventConfigurationResponse>(
  "GetEventConfigurationResponse",
)(
  {
    TrailARN: S.optional(S.String),
    EventDataStoreArn: S.optional(S.String),
    MaxEventSize: S.optional(S.String),
    ContextKeySelectors: S.optional(ContextKeySelectors),
    AggregationConfigurations: S.optional(AggregationConfigurations),
  },
  ns,
) {}
export class DataResource extends S.Class<DataResource>("DataResource")({
  Type: S.optional(S.String),
  Values: S.optional(DataResourceValues),
}) {}
export const DataResources = S.Array(DataResource);
export class EventSelector extends S.Class<EventSelector>("EventSelector")({
  ReadWriteType: S.optional(S.String),
  IncludeManagementEvents: S.optional(S.Boolean),
  DataResources: S.optional(DataResources),
  ExcludeManagementEventSources: S.optional(ExcludeManagementEventSources),
}) {}
export const EventSelectors = S.Array(EventSelector);
export class GetEventSelectorsResponse extends S.Class<GetEventSelectorsResponse>(
  "GetEventSelectorsResponse",
)(
  {
    TrailARN: S.optional(S.String),
    EventSelectors: S.optional(EventSelectors),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
  },
  ns,
) {}
export class GetInsightSelectorsResponse extends S.Class<GetInsightSelectorsResponse>(
  "GetInsightSelectorsResponse",
)(
  {
    TrailARN: S.optional(S.String),
    InsightSelectors: S.optional(InsightSelectors),
    EventDataStoreArn: S.optional(S.String),
    InsightsDestination: S.optional(S.String),
  },
  ns,
) {}
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)(
  {
    ResourceArn: S.optional(S.String),
    ResourcePolicy: S.optional(S.String),
    DelegatedAdminResourcePolicy: S.optional(S.String),
  },
  ns,
) {}
export class Trail extends S.Class<Trail>("Trail")({
  Name: S.optional(S.String),
  S3BucketName: S.optional(S.String),
  S3KeyPrefix: S.optional(S.String),
  SnsTopicName: S.optional(S.String),
  SnsTopicARN: S.optional(S.String),
  IncludeGlobalServiceEvents: S.optional(S.Boolean),
  IsMultiRegionTrail: S.optional(S.Boolean),
  HomeRegion: S.optional(S.String),
  TrailARN: S.optional(S.String),
  LogFileValidationEnabled: S.optional(S.Boolean),
  CloudWatchLogsLogGroupArn: S.optional(S.String),
  CloudWatchLogsRoleArn: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  HasCustomEventSelectors: S.optional(S.Boolean),
  HasInsightSelectors: S.optional(S.Boolean),
  IsOrganizationTrail: S.optional(S.Boolean),
}) {}
export class GetTrailResponse extends S.Class<GetTrailResponse>(
  "GetTrailResponse",
)({ Trail: S.optional(Trail) }, ns) {}
export class GetTrailStatusResponse extends S.Class<GetTrailStatusResponse>(
  "GetTrailStatusResponse",
)(
  {
    IsLogging: S.optional(S.Boolean),
    LatestDeliveryError: S.optional(S.String),
    LatestNotificationError: S.optional(S.String),
    LatestDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestNotificationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StartLoggingTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StopLoggingTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestCloudWatchLogsDeliveryError: S.optional(S.String),
    LatestCloudWatchLogsDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestDigestDeliveryTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestDigestDeliveryError: S.optional(S.String),
    LatestDeliveryAttemptTime: S.optional(S.String),
    LatestNotificationAttemptTime: S.optional(S.String),
    LatestNotificationAttemptSucceeded: S.optional(S.String),
    LatestDeliveryAttemptSucceeded: S.optional(S.String),
    TimeLoggingStarted: S.optional(S.String),
    TimeLoggingStopped: S.optional(S.String),
  },
  ns,
) {}
export class ListInsightsDataRequest extends S.Class<ListInsightsDataRequest>(
  "ListInsightsDataRequest",
)(
  {
    InsightSource: S.String,
    DataType: S.String,
    Dimensions: S.optional(ListInsightsDataDimensions),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInsightsMetricDataResponse extends S.Class<ListInsightsMetricDataResponse>(
  "ListInsightsMetricDataResponse",
)(
  {
    TrailARN: S.optional(S.String),
    EventSource: S.optional(S.String),
    EventName: S.optional(S.String),
    InsightType: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    Timestamps: S.optional(Timestamps),
    Values: S.optional(InsightsMetricValues),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class LookupEventsRequest extends S.Class<LookupEventsRequest>(
  "LookupEventsRequest",
)(
  {
    LookupAttributes: S.optional(LookupAttributesList),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventCategory: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutEventConfigurationRequest extends S.Class<PutEventConfigurationRequest>(
  "PutEventConfigurationRequest",
)(
  {
    TrailName: S.optional(S.String),
    EventDataStore: S.optional(S.String),
    MaxEventSize: S.optional(S.String),
    ContextKeySelectors: S.optional(ContextKeySelectors),
    AggregationConfigurations: S.optional(AggregationConfigurations),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutInsightSelectorsRequest extends S.Class<PutInsightSelectorsRequest>(
  "PutInsightSelectorsRequest",
)(
  {
    TrailName: S.optional(S.String),
    InsightSelectors: InsightSelectors,
    EventDataStore: S.optional(S.String),
    InsightsDestination: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)(
  {
    ResourceArn: S.optional(S.String),
    ResourcePolicy: S.optional(S.String),
    DelegatedAdminResourcePolicy: S.optional(S.String),
  },
  ns,
) {}
export class RestoreEventDataStoreResponse extends S.Class<RestoreEventDataStoreResponse>(
  "RestoreEventDataStoreResponse",
)(
  {
    EventDataStoreArn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KmsKeyId: S.optional(S.String),
    BillingMode: S.optional(S.String),
  },
  ns,
) {}
export class StartDashboardRefreshRequest extends S.Class<StartDashboardRefreshRequest>(
  "StartDashboardRefreshRequest",
)(
  {
    DashboardId: S.String,
    QueryParameterValues: S.optional(QueryParameterValues),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartQueryResponse extends S.Class<StartQueryResponse>(
  "StartQueryResponse",
)(
  {
    QueryId: S.optional(S.String),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  },
  ns,
) {}
export class S3ImportSource extends S.Class<S3ImportSource>("S3ImportSource")({
  S3LocationUri: S.String,
  S3BucketRegion: S.String,
  S3BucketAccessRoleArn: S.String,
}) {}
export class ImportSource extends S.Class<ImportSource>("ImportSource")({
  S3: S3ImportSource,
}) {}
export class ImportStatistics extends S.Class<ImportStatistics>(
  "ImportStatistics",
)({
  PrefixesFound: S.optional(S.Number),
  PrefixesCompleted: S.optional(S.Number),
  FilesCompleted: S.optional(S.Number),
  EventsCompleted: S.optional(S.Number),
  FailedEntries: S.optional(S.Number),
}) {}
export class StopImportResponse extends S.Class<StopImportResponse>(
  "StopImportResponse",
)(
  {
    ImportId: S.optional(S.String),
    ImportSource: S.optional(ImportSource),
    Destinations: S.optional(ImportDestinations),
    ImportStatus: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StartEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ImportStatistics: S.optional(ImportStatistics),
  },
  ns,
) {}
export class UpdateChannelResponse extends S.Class<UpdateChannelResponse>(
  "UpdateChannelResponse",
)(
  {
    ChannelArn: S.optional(S.String),
    Name: S.optional(S.String),
    Source: S.optional(S.String),
    Destinations: S.optional(Destinations),
  },
  ns,
) {}
export class Widget extends S.Class<Widget>("Widget")({
  QueryAlias: S.optional(S.String),
  QueryStatement: S.optional(S.String),
  QueryParameters: S.optional(QueryParameters),
  ViewProperties: S.optional(ViewPropertiesMap),
}) {}
export const WidgetList = S.Array(Widget);
export class UpdateDashboardResponse extends S.Class<UpdateDashboardResponse>(
  "UpdateDashboardResponse",
)(
  {
    DashboardArn: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Widgets: S.optional(WidgetList),
    RefreshSchedule: S.optional(RefreshSchedule),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class UpdateEventDataStoreResponse extends S.Class<UpdateEventDataStoreResponse>(
  "UpdateEventDataStoreResponse",
)(
  {
    EventDataStoreArn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KmsKeyId: S.optional(S.String),
    BillingMode: S.optional(S.String),
    FederationStatus: S.optional(S.String),
    FederationRoleArn: S.optional(S.String),
  },
  ns,
) {}
export class UpdateTrailResponse extends S.Class<UpdateTrailResponse>(
  "UpdateTrailResponse",
)(
  {
    Name: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    S3KeyPrefix: S.optional(S.String),
    SnsTopicName: S.optional(S.String),
    SnsTopicARN: S.optional(S.String),
    IncludeGlobalServiceEvents: S.optional(S.Boolean),
    IsMultiRegionTrail: S.optional(S.Boolean),
    TrailARN: S.optional(S.String),
    LogFileValidationEnabled: S.optional(S.Boolean),
    CloudWatchLogsLogGroupArn: S.optional(S.String),
    CloudWatchLogsRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    IsOrganizationTrail: S.optional(S.Boolean),
  },
  ns,
) {}
export class QueryStatisticsForDescribeQuery extends S.Class<QueryStatisticsForDescribeQuery>(
  "QueryStatisticsForDescribeQuery",
)({
  EventsMatched: S.optional(S.Number),
  EventsScanned: S.optional(S.Number),
  BytesScanned: S.optional(S.Number),
  ExecutionTimeInMillis: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const TrailList = S.Array(Trail);
export class SourceConfig extends S.Class<SourceConfig>("SourceConfig")({
  ApplyToAllRegions: S.optional(S.Boolean),
  AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
}) {}
export class IngestionStatus extends S.Class<IngestionStatus>(
  "IngestionStatus",
)({
  LatestIngestionSuccessTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LatestIngestionSuccessEventID: S.optional(S.String),
  LatestIngestionErrorCode: S.optional(S.String),
  LatestIngestionAttemptTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LatestIngestionAttemptEventID: S.optional(S.String),
}) {}
export class PartitionKey extends S.Class<PartitionKey>("PartitionKey")({
  Name: S.String,
  Type: S.String,
}) {}
export const PartitionKeyList = S.Array(PartitionKey);
export class QueryStatistics extends S.Class<QueryStatistics>(
  "QueryStatistics",
)({
  ResultsCount: S.optional(S.Number),
  TotalResultsCount: S.optional(S.Number),
  BytesScanned: S.optional(S.Number),
}) {}
export const QueryResultColumn = S.Record({ key: S.String, value: S.String });
export const QueryResultRow = S.Array(QueryResultColumn);
export const QueryResultRows = S.Array(QueryResultRow);
export class Channel extends S.Class<Channel>("Channel")({
  ChannelArn: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const Channels = S.Array(Channel);
export class DashboardDetail extends S.Class<DashboardDetail>(
  "DashboardDetail",
)({ DashboardArn: S.optional(S.String), Type: S.optional(S.String) }) {}
export const Dashboards = S.Array(DashboardDetail);
export class EventDataStore extends S.Class<EventDataStore>("EventDataStore")({
  EventDataStoreArn: S.optional(S.String),
  Name: S.optional(S.String),
  TerminationProtectionEnabled: S.optional(S.Boolean),
  Status: S.optional(S.String),
  AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
  MultiRegionEnabled: S.optional(S.Boolean),
  OrganizationEnabled: S.optional(S.Boolean),
  RetentionPeriod: S.optional(S.Number),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EventDataStores = S.Array(EventDataStore);
export class ImportFailureListItem extends S.Class<ImportFailureListItem>(
  "ImportFailureListItem",
)({
  Location: S.optional(S.String),
  Status: S.optional(S.String),
  ErrorType: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ImportFailureList = S.Array(ImportFailureListItem);
export class ImportsListItem extends S.Class<ImportsListItem>(
  "ImportsListItem",
)({
  ImportId: S.optional(S.String),
  ImportStatus: S.optional(S.String),
  Destinations: S.optional(ImportDestinations),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ImportsList = S.Array(ImportsListItem);
export class PublicKey extends S.Class<PublicKey>("PublicKey")({
  Value: S.optional(T.Blob),
  ValidityStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ValidityEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Fingerprint: S.optional(S.String),
}) {}
export const PublicKeyList = S.Array(PublicKey);
export class Query extends S.Class<Query>("Query")({
  QueryId: S.optional(S.String),
  QueryStatus: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const Queries = S.Array(Query);
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  ResourceId: S.optional(S.String),
  TagsList: S.optional(TagsList),
}) {}
export const ResourceTagList = S.Array(ResourceTag);
export class TrailInfo extends S.Class<TrailInfo>("TrailInfo")({
  TrailARN: S.optional(S.String),
  Name: S.optional(S.String),
  HomeRegion: S.optional(S.String),
}) {}
export const Trails = S.Array(TrailInfo);
export class SearchSampleQueriesSearchResult extends S.Class<SearchSampleQueriesSearchResult>(
  "SearchSampleQueriesSearchResult",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  SQL: S.optional(S.String),
  Relevance: S.optional(S.Number),
}) {}
export const SearchSampleQueriesSearchResults = S.Array(
  SearchSampleQueriesSearchResult,
);
export class CreateChannelResponse extends S.Class<CreateChannelResponse>(
  "CreateChannelResponse",
)(
  {
    ChannelArn: S.optional(S.String),
    Name: S.optional(S.String),
    Source: S.optional(S.String),
    Destinations: S.optional(Destinations),
    Tags: S.optional(TagsList),
  },
  ns,
) {}
export class CreateDashboardRequest extends S.Class<CreateDashboardRequest>(
  "CreateDashboardRequest",
)(
  {
    Name: S.String,
    RefreshSchedule: S.optional(RefreshSchedule),
    TagsList: S.optional(TagsList),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    Widgets: S.optional(RequestWidgetList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEventDataStoreRequest extends S.Class<CreateEventDataStoreRequest>(
  "CreateEventDataStoreRequest",
)(
  {
    Name: S.String,
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    TagsList: S.optional(TagsList),
    KmsKeyId: S.optional(S.String),
    StartIngestion: S.optional(S.Boolean),
    BillingMode: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeQueryResponse extends S.Class<DescribeQueryResponse>(
  "DescribeQueryResponse",
)(
  {
    QueryId: S.optional(S.String),
    QueryString: S.optional(S.String),
    QueryStatus: S.optional(S.String),
    QueryStatistics: S.optional(QueryStatisticsForDescribeQuery),
    ErrorMessage: S.optional(S.String),
    DeliveryS3Uri: S.optional(S.String),
    DeliveryStatus: S.optional(S.String),
    Prompt: S.optional(S.String),
    EventDataStoreOwnerAccountId: S.optional(S.String),
  },
  ns,
) {}
export class DescribeTrailsResponse extends S.Class<DescribeTrailsResponse>(
  "DescribeTrailsResponse",
)({ trailList: S.optional(TrailList) }, ns) {}
export class GetChannelResponse extends S.Class<GetChannelResponse>(
  "GetChannelResponse",
)(
  {
    ChannelArn: S.optional(S.String),
    Name: S.optional(S.String),
    Source: S.optional(S.String),
    SourceConfig: S.optional(SourceConfig),
    Destinations: S.optional(Destinations),
    IngestionStatus: S.optional(IngestionStatus),
  },
  ns,
) {}
export class GetDashboardResponse extends S.Class<GetDashboardResponse>(
  "GetDashboardResponse",
)(
  {
    DashboardArn: S.optional(S.String),
    Type: S.optional(S.String),
    Status: S.optional(S.String),
    Widgets: S.optional(WidgetList),
    RefreshSchedule: S.optional(RefreshSchedule),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastRefreshId: S.optional(S.String),
    LastRefreshFailureReason: S.optional(S.String),
    TerminationProtectionEnabled: S.optional(S.Boolean),
  },
  ns,
) {}
export class GetEventDataStoreResponse extends S.Class<GetEventDataStoreResponse>(
  "GetEventDataStoreResponse",
)(
  {
    EventDataStoreArn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KmsKeyId: S.optional(S.String),
    BillingMode: S.optional(S.String),
    FederationStatus: S.optional(S.String),
    FederationRoleArn: S.optional(S.String),
    PartitionKeys: S.optional(PartitionKeyList),
  },
  ns,
) {}
export class GetImportResponse extends S.Class<GetImportResponse>(
  "GetImportResponse",
)(
  {
    ImportId: S.optional(S.String),
    Destinations: S.optional(ImportDestinations),
    ImportSource: S.optional(ImportSource),
    StartEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ImportStatus: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ImportStatistics: S.optional(ImportStatistics),
  },
  ns,
) {}
export class GetQueryResultsResponse extends S.Class<GetQueryResultsResponse>(
  "GetQueryResultsResponse",
)(
  {
    QueryStatus: S.optional(S.String),
    QueryStatistics: S.optional(QueryStatistics),
    QueryResultRows: S.optional(QueryResultRows),
    NextToken: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  },
  ns,
) {}
export class ListChannelsResponse extends S.Class<ListChannelsResponse>(
  "ListChannelsResponse",
)({ Channels: S.optional(Channels), NextToken: S.optional(S.String) }, ns) {}
export class ListDashboardsResponse extends S.Class<ListDashboardsResponse>(
  "ListDashboardsResponse",
)(
  { Dashboards: S.optional(Dashboards), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListEventDataStoresResponse extends S.Class<ListEventDataStoresResponse>(
  "ListEventDataStoresResponse",
)(
  {
    EventDataStores: S.optional(EventDataStores),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListImportFailuresResponse extends S.Class<ListImportFailuresResponse>(
  "ListImportFailuresResponse",
)(
  { Failures: S.optional(ImportFailureList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListImportsResponse extends S.Class<ListImportsResponse>(
  "ListImportsResponse",
)({ Imports: S.optional(ImportsList), NextToken: S.optional(S.String) }, ns) {}
export class ListPublicKeysResponse extends S.Class<ListPublicKeysResponse>(
  "ListPublicKeysResponse",
)(
  { PublicKeyList: S.optional(PublicKeyList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListQueriesResponse extends S.Class<ListQueriesResponse>(
  "ListQueriesResponse",
)({ Queries: S.optional(Queries), NextToken: S.optional(S.String) }, ns) {}
export class ListTagsResponse extends S.Class<ListTagsResponse>(
  "ListTagsResponse",
)(
  {
    ResourceTagList: S.optional(ResourceTagList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTrailsResponse extends S.Class<ListTrailsResponse>(
  "ListTrailsResponse",
)({ Trails: S.optional(Trails), NextToken: S.optional(S.String) }, ns) {}
export class Resource extends S.Class<Resource>("Resource")({
  ResourceType: S.optional(S.String),
  ResourceName: S.optional(S.String),
}) {}
export const ResourceList = S.Array(Resource);
export class Event extends S.Class<Event>("Event")({
  EventId: S.optional(S.String),
  EventName: S.optional(S.String),
  ReadOnly: S.optional(S.String),
  AccessKeyId: S.optional(S.String),
  EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EventSource: S.optional(S.String),
  Username: S.optional(S.String),
  Resources: S.optional(ResourceList),
  CloudTrailEvent: S.optional(S.String),
}) {}
export const EventsList = S.Array(Event);
export class LookupEventsResponse extends S.Class<LookupEventsResponse>(
  "LookupEventsResponse",
)({ Events: S.optional(EventsList), NextToken: S.optional(S.String) }, ns) {}
export class PutEventConfigurationResponse extends S.Class<PutEventConfigurationResponse>(
  "PutEventConfigurationResponse",
)(
  {
    TrailARN: S.optional(S.String),
    EventDataStoreArn: S.optional(S.String),
    MaxEventSize: S.optional(S.String),
    ContextKeySelectors: S.optional(ContextKeySelectors),
    AggregationConfigurations: S.optional(AggregationConfigurations),
  },
  ns,
) {}
export class PutEventSelectorsRequest extends S.Class<PutEventSelectorsRequest>(
  "PutEventSelectorsRequest",
)(
  {
    TrailName: S.String,
    EventSelectors: S.optional(EventSelectors),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutInsightSelectorsResponse extends S.Class<PutInsightSelectorsResponse>(
  "PutInsightSelectorsResponse",
)(
  {
    TrailARN: S.optional(S.String),
    InsightSelectors: S.optional(InsightSelectors),
    EventDataStoreArn: S.optional(S.String),
    InsightsDestination: S.optional(S.String),
  },
  ns,
) {}
export class SearchSampleQueriesResponse extends S.Class<SearchSampleQueriesResponse>(
  "SearchSampleQueriesResponse",
)(
  {
    SearchResults: S.optional(SearchSampleQueriesSearchResults),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class StartDashboardRefreshResponse extends S.Class<StartDashboardRefreshResponse>(
  "StartDashboardRefreshResponse",
)({ RefreshId: S.optional(S.String) }, ns) {}
export class StartImportRequest extends S.Class<StartImportRequest>(
  "StartImportRequest",
)(
  {
    Destinations: S.optional(ImportDestinations),
    ImportSource: S.optional(ImportSource),
    StartEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ImportId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDashboardResponse extends S.Class<CreateDashboardResponse>(
  "CreateDashboardResponse",
)(
  {
    DashboardArn: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Widgets: S.optional(WidgetList),
    TagsList: S.optional(TagsList),
    RefreshSchedule: S.optional(RefreshSchedule),
    TerminationProtectionEnabled: S.optional(S.Boolean),
  },
  ns,
) {}
export class CreateEventDataStoreResponse extends S.Class<CreateEventDataStoreResponse>(
  "CreateEventDataStoreResponse",
)(
  {
    EventDataStoreArn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
    MultiRegionEnabled: S.optional(S.Boolean),
    OrganizationEnabled: S.optional(S.Boolean),
    RetentionPeriod: S.optional(S.Number),
    TerminationProtectionEnabled: S.optional(S.Boolean),
    TagsList: S.optional(TagsList),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KmsKeyId: S.optional(S.String),
    BillingMode: S.optional(S.String),
  },
  ns,
) {}
export class PutEventSelectorsResponse extends S.Class<PutEventSelectorsResponse>(
  "PutEventSelectorsResponse",
)(
  {
    TrailARN: S.optional(S.String),
    EventSelectors: S.optional(EventSelectors),
    AdvancedEventSelectors: S.optional(AdvancedEventSelectors),
  },
  ns,
) {}
export class StartImportResponse extends S.Class<StartImportResponse>(
  "StartImportResponse",
)(
  {
    ImportId: S.optional(S.String),
    Destinations: S.optional(ImportDestinations),
    ImportSource: S.optional(ImportSource),
    StartEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ImportStatus: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    UpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class ListInsightsDataResponse extends S.Class<ListInsightsDataResponse>(
  "ListInsightsDataResponse",
)({ Events: S.optional(EventsList), NextToken: S.optional(S.String) }, ns) {}

//# Errors
export class ChannelARNInvalidException extends S.TaggedError<ChannelARNInvalidException>()(
  "ChannelARNInvalidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChannelARNInvalid", httpResponseCode: 400 }),
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConflictException", httpResponseCode: 409 }),
) {}
export class ChannelExistsForEDSException extends S.TaggedError<ChannelExistsForEDSException>()(
  "ChannelExistsForEDSException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChannelExistsForEDS", httpResponseCode: 400 }),
) {}
export class CloudTrailARNInvalidException extends S.TaggedError<CloudTrailARNInvalidException>()(
  "CloudTrailARNInvalidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "CloudTrailARNInvalid", httpResponseCode: 400 }),
) {}
export class AccountNotFoundException extends S.TaggedError<AccountNotFoundException>()(
  "AccountNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccountNotFound", httpResponseCode: 404 }),
) {}
export class CloudTrailAccessNotEnabledException extends S.TaggedError<CloudTrailAccessNotEnabledException>()(
  "CloudTrailAccessNotEnabledException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CloudTrailAccessNotEnabled",
    httpResponseCode: 400,
  }),
) {}
export class ChannelNotFoundException extends S.TaggedError<ChannelNotFoundException>()(
  "ChannelNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChannelNotFound", httpResponseCode: 404 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFound", httpResponseCode: 400 }),
) {}
export class EventDataStoreARNInvalidException extends S.TaggedError<EventDataStoreARNInvalidException>()(
  "EventDataStoreARNInvalidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "EventDataStoreARNInvalid", httpResponseCode: 400 }),
) {}
export class InsufficientDependencyServiceAccessPermissionException extends S.TaggedError<InsufficientDependencyServiceAccessPermissionException>()(
  "InsufficientDependencyServiceAccessPermissionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientDependencyServiceAccessPermission",
    httpResponseCode: 400,
  }),
) {}
export class AccountNotRegisteredException extends S.TaggedError<AccountNotRegisteredException>()(
  "AccountNotRegisteredException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccountNotRegistered", httpResponseCode: 400 }),
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceAccessDenied", httpResponseCode: 403 }),
) {}
export class InvalidTrailNameException extends S.TaggedError<InvalidTrailNameException>()(
  "InvalidTrailNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTrailName", httpResponseCode: 400 }),
) {}
export class InsightNotEnabledException extends S.TaggedError<InsightNotEnabledException>()(
  "InsightNotEnabledException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InsightNotEnabled", httpResponseCode: 400 }),
) {}
export class OperationNotPermittedException extends S.TaggedError<OperationNotPermittedException>()(
  "OperationNotPermittedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "OperationNotPermitted", httpResponseCode: 400 }),
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidParameter", httpResponseCode: 400 }),
) {}
export class ImportNotFoundException extends S.TaggedError<ImportNotFoundException>()(
  "ImportNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ImportNotFound", httpResponseCode: 404 }),
) {}
export class ChannelAlreadyExistsException extends S.TaggedError<ChannelAlreadyExistsException>()(
  "ChannelAlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChannelAlreadyExists", httpResponseCode: 400 }),
) {}
export class EventDataStoreNotFoundException extends S.TaggedError<EventDataStoreNotFoundException>()(
  "EventDataStoreNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "EventDataStoreNotFound", httpResponseCode: 404 }),
) {}
export class AccountRegisteredException extends S.TaggedError<AccountRegisteredException>()(
  "AccountRegisteredException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccountRegistered", httpResponseCode: 400 }),
) {}
export class CloudTrailInvalidClientTokenIdException extends S.TaggedError<CloudTrailInvalidClientTokenIdException>()(
  "CloudTrailInvalidClientTokenIdException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CloudTrailInvalidClientTokenId",
    httpResponseCode: 400,
  }),
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "UnsupportedOperation", httpResponseCode: 400 }),
) {}
export class EventDataStoreFederationEnabledException extends S.TaggedError<EventDataStoreFederationEnabledException>()(
  "EventDataStoreFederationEnabledException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventDataStoreFederationEnabled",
    httpResponseCode: 400,
  }),
) {}
export class InvalidHomeRegionException extends S.TaggedError<InvalidHomeRegionException>()(
  "InvalidHomeRegionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidHomeRegion", httpResponseCode: 400 }),
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConcurrentModification", httpResponseCode: 400 }),
) {}
export class NoManagementAccountSLRExistsException extends S.TaggedError<NoManagementAccountSLRExistsException>()(
  "NoManagementAccountSLRExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NoManagementAccountSLRExists",
    httpResponseCode: 403,
  }),
) {}
export class InvalidParameterCombinationException extends S.TaggedError<InvalidParameterCombinationException>()(
  "InvalidParameterCombinationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidParameterCombinationError",
    httpResponseCode: 400,
  }),
) {}
export class ResourceARNNotValidException extends S.TaggedError<ResourceARNNotValidException>()(
  "ResourceARNNotValidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceARNNotValid", httpResponseCode: 400 }),
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidNextToken", httpResponseCode: 400 }),
) {}
export class InvalidMaxResultsException extends S.TaggedError<InvalidMaxResultsException>()(
  "InvalidMaxResultsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidMaxResults", httpResponseCode: 400 }),
) {}
export class InvalidTimeRangeException extends S.TaggedError<InvalidTimeRangeException>()(
  "InvalidTimeRangeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTimeRange", httpResponseCode: 400 }),
) {}
export class InvalidEventCategoryException extends S.TaggedError<InvalidEventCategoryException>()(
  "InvalidEventCategoryException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidEventCategory", httpResponseCode: 400 }),
) {}
export class InsufficientEncryptionPolicyException extends S.TaggedError<InsufficientEncryptionPolicyException>()(
  "InsufficientEncryptionPolicyException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientEncryptionPolicy",
    httpResponseCode: 400,
  }),
) {}
export class InactiveEventDataStoreException extends S.TaggedError<InactiveEventDataStoreException>()(
  "InactiveEventDataStoreException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InactiveEventDataStore", httpResponseCode: 400 }),
) {}
export class EventDataStoreMaxLimitExceededException extends S.TaggedError<EventDataStoreMaxLimitExceededException>()(
  "EventDataStoreMaxLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventDataStoreMaxLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class EventDataStoreAlreadyExistsException extends S.TaggedError<EventDataStoreAlreadyExistsException>()(
  "EventDataStoreAlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventDataStoreAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class GenerateResponseException extends S.TaggedError<GenerateResponseException>()(
  "GenerateResponseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "GenerateResponse", httpResponseCode: 400 }),
) {}
export class InvalidEventDataStoreCategoryException extends S.TaggedError<InvalidEventDataStoreCategoryException>()(
  "InvalidEventDataStoreCategoryException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidEventDataStoreCategory",
    httpResponseCode: 400,
  }),
) {}
export class CannotDelegateManagementAccountException extends S.TaggedError<CannotDelegateManagementAccountException>()(
  "CannotDelegateManagementAccountException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CannotDelegateManagementAccount",
    httpResponseCode: 400,
  }),
) {}
export class TrailNotFoundException extends S.TaggedError<TrailNotFoundException>()(
  "TrailNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TrailNotFound", httpResponseCode: 404 }),
) {}
export class NotOrganizationManagementAccountException extends S.TaggedError<NotOrganizationManagementAccountException>()(
  "NotOrganizationManagementAccountException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NotOrganizationManagementAccount",
    httpResponseCode: 403,
  }),
) {}
export class ChannelMaxLimitExceededException extends S.TaggedError<ChannelMaxLimitExceededException>()(
  "ChannelMaxLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ChannelMaxLimitExceeded", httpResponseCode: 400 }),
) {}
export class CloudWatchLogsDeliveryUnavailableException extends S.TaggedError<CloudWatchLogsDeliveryUnavailableException>()(
  "CloudWatchLogsDeliveryUnavailableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CloudWatchLogsDeliveryUnavailable",
    httpResponseCode: 400,
  }),
) {}
export class EventDataStoreHasOngoingImportException extends S.TaggedError<EventDataStoreHasOngoingImportException>()(
  "EventDataStoreHasOngoingImportException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventDataStoreHasOngoingImport",
    httpResponseCode: 400,
  }),
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ThrottlingException", httpResponseCode: 429 }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourcePolicyNotFoundException extends S.TaggedError<ResourcePolicyNotFoundException>()(
  "ResourcePolicyNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourcePolicyNotFound", httpResponseCode: 404 }),
) {}
export class InvalidTokenException extends S.TaggedError<InvalidTokenException>()(
  "InvalidTokenException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidToken", httpResponseCode: 400 }),
) {}
export class InvalidLookupAttributesException extends S.TaggedError<InvalidLookupAttributesException>()(
  "InvalidLookupAttributesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidLookupAttributes", httpResponseCode: 400 }),
) {}
export class InvalidEventSelectorsException extends S.TaggedError<InvalidEventSelectorsException>()(
  "InvalidEventSelectorsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidEventSelectors", httpResponseCode: 400 }),
) {}
export class InsufficientS3BucketPolicyException extends S.TaggedError<InsufficientS3BucketPolicyException>()(
  "InsufficientS3BucketPolicyException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientS3BucketPolicy",
    httpResponseCode: 403,
  }),
) {}
export class AccountHasOngoingImportException extends S.TaggedError<AccountHasOngoingImportException>()(
  "AccountHasOngoingImportException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccountHasOngoingImport", httpResponseCode: 400 }),
) {}
export class InvalidQueryStatementException extends S.TaggedError<InvalidQueryStatementException>()(
  "InvalidQueryStatementException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidQueryStatement", httpResponseCode: 400 }),
) {}
export class InvalidEventDataStoreStatusException extends S.TaggedError<InvalidEventDataStoreStatusException>()(
  "InvalidEventDataStoreStatusException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidEventDataStoreStatus",
    httpResponseCode: 400,
  }),
) {}
export class NotOrganizationMasterAccountException extends S.TaggedError<NotOrganizationMasterAccountException>()(
  "NotOrganizationMasterAccountException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NotOrganizationMasterAccount",
    httpResponseCode: 400,
  }),
) {}
export class DelegatedAdminAccountLimitExceededException extends S.TaggedError<DelegatedAdminAccountLimitExceededException>()(
  "DelegatedAdminAccountLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DelegatedAdminAccountLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class ResourcePolicyNotValidException extends S.TaggedError<ResourcePolicyNotValidException>()(
  "ResourcePolicyNotValidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourcePolicyNotValid", httpResponseCode: 400 }),
) {}
export class OrganizationNotInAllFeaturesModeException extends S.TaggedError<OrganizationNotInAllFeaturesModeException>()(
  "OrganizationNotInAllFeaturesModeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "OrganizationNotInAllFeaturesMode",
    httpResponseCode: 400,
  }),
) {}
export class InvalidSourceException extends S.TaggedError<InvalidSourceException>()(
  "InvalidSourceException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSource", httpResponseCode: 400 }),
) {}
export class InvalidTagParameterException extends S.TaggedError<InvalidTagParameterException>()(
  "InvalidTagParameterException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidTagParameter", httpResponseCode: 400 }),
) {}
export class InactiveQueryException extends S.TaggedError<InactiveQueryException>()(
  "InactiveQueryException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InactiveQuery", httpResponseCode: 400 }),
) {}
export class QueryIdNotFoundException extends S.TaggedError<QueryIdNotFoundException>()(
  "QueryIdNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "QueryIdNotFound", httpResponseCode: 404 }),
) {}
export class InvalidDateRangeException extends S.TaggedError<InvalidDateRangeException>()(
  "InvalidDateRangeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidDateRange", httpResponseCode: 400 }),
) {}
export class InsufficientIAMAccessPermissionException extends S.TaggedError<InsufficientIAMAccessPermissionException>()(
  "InsufficientIAMAccessPermissionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientIAMAccessPermission",
    httpResponseCode: 400,
  }),
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ServiceQuotaExceeded", httpResponseCode: 400 }),
) {}
export class EventDataStoreTerminationProtectedException extends S.TaggedError<EventDataStoreTerminationProtectedException>()(
  "EventDataStoreTerminationProtectedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "EventDataStoreTerminationProtectedException",
    httpResponseCode: 400,
  }),
) {}
export class ResourceTypeNotSupportedException extends S.TaggedError<ResourceTypeNotSupportedException>()(
  "ResourceTypeNotSupportedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceTypeNotSupported", httpResponseCode: 400 }),
) {}
export class InvalidInsightSelectorsException extends S.TaggedError<InvalidInsightSelectorsException>()(
  "InvalidInsightSelectorsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidInsightSelectors", httpResponseCode: 400 }),
) {}
export class InsufficientSnsTopicPolicyException extends S.TaggedError<InsufficientSnsTopicPolicyException>()(
  "InsufficientSnsTopicPolicyException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientSnsTopicPolicy",
    httpResponseCode: 403,
  }),
) {}
export class OrganizationsNotInUseException extends S.TaggedError<OrganizationsNotInUseException>()(
  "OrganizationsNotInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "OrganizationsNotInUse", httpResponseCode: 404 }),
) {}
export class InvalidKmsKeyIdException extends S.TaggedError<InvalidKmsKeyIdException>()(
  "InvalidKmsKeyIdException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidKmsKeyId", httpResponseCode: 400 }),
) {}
export class InvalidS3BucketNameException extends S.TaggedError<InvalidS3BucketNameException>()(
  "InvalidS3BucketNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidS3BucketName", httpResponseCode: 400 }),
) {}
export class InvalidQueryStatusException extends S.TaggedError<InvalidQueryStatusException>()(
  "InvalidQueryStatusException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidQueryStatus", httpResponseCode: 400 }),
) {}
export class InvalidImportSourceException extends S.TaggedError<InvalidImportSourceException>()(
  "InvalidImportSourceException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidImportSource", httpResponseCode: 400 }),
) {}
export class TagsLimitExceededException extends S.TaggedError<TagsLimitExceededException>()(
  "TagsLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagsLimitExceeded", httpResponseCode: 400 }),
) {}
export class KmsException extends S.TaggedError<KmsException>()(
  "KmsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "KmsException", httpResponseCode: 400 }),
) {}
export class InvalidCloudWatchLogsLogGroupArnException extends S.TaggedError<InvalidCloudWatchLogsLogGroupArnException>()(
  "InvalidCloudWatchLogsLogGroupArnException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCloudWatchLogsLogGroupArn",
    httpResponseCode: 400,
  }),
) {}
export class InvalidS3PrefixException extends S.TaggedError<InvalidS3PrefixException>()(
  "InvalidS3PrefixException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidS3Prefix", httpResponseCode: 400 }),
) {}
export class S3BucketDoesNotExistException extends S.TaggedError<S3BucketDoesNotExistException>()(
  "S3BucketDoesNotExistException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "S3BucketDoesNotExist", httpResponseCode: 404 }),
) {}
export class InvalidCloudWatchLogsRoleArnException extends S.TaggedError<InvalidCloudWatchLogsRoleArnException>()(
  "InvalidCloudWatchLogsRoleArnException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCloudWatchLogsRoleArn",
    httpResponseCode: 400,
  }),
) {}
export class MaxConcurrentQueriesException extends S.TaggedError<MaxConcurrentQueriesException>()(
  "MaxConcurrentQueriesException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "MaxConcurrentQueries", httpResponseCode: 429 }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class KmsKeyNotFoundException extends S.TaggedError<KmsKeyNotFoundException>()(
  "KmsKeyNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "KmsKeyNotFound", httpResponseCode: 400 }),
) {}
export class InvalidSnsTopicNameException extends S.TaggedError<InvalidSnsTopicNameException>()(
  "InvalidSnsTopicNameException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSnsTopicName", httpResponseCode: 400 }),
) {}
export class KmsKeyDisabledException extends S.TaggedError<KmsKeyDisabledException>()(
  "KmsKeyDisabledException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "KmsKeyDisabled", httpResponseCode: 400 }),
) {}
export class TrailNotProvidedException extends S.TaggedError<TrailNotProvidedException>()(
  "TrailNotProvidedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TrailNotProvided", httpResponseCode: 404 }),
) {}
export class MaximumNumberOfTrailsExceededException extends S.TaggedError<MaximumNumberOfTrailsExceededException>()(
  "MaximumNumberOfTrailsExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "MaximumNumberOfTrailsExceeded",
    httpResponseCode: 403,
  }),
) {}
export class TrailAlreadyExistsException extends S.TaggedError<TrailAlreadyExistsException>()(
  "TrailAlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TrailAlreadyExists", httpResponseCode: 400 }),
) {}

//# Operations
/**
 * Deletes the specified dashboard. You cannot delete a dashboard that has termination protection enabled.
 */
export const deleteDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDashboardRequest,
  output: DeleteDashboardResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Lists the channels in the current account, and their source names.
 */
export const listChannels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListChannelsRequest,
    output: ListChannelsResponse,
    errors: [
      InvalidNextTokenException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns information about all event data stores in the account, in the current
 * Region.
 */
export const listEventDataStores =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEventDataStoresRequest,
    output: ListEventDataStoresResponse,
    errors: [
      InvalidMaxResultsException,
      InvalidNextTokenException,
      NoManagementAccountSLRExistsException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns the specified dashboard.
 */
export const getDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDashboardRequest,
  output: GetDashboardResponse,
  errors: [ResourceNotFoundException, UnsupportedOperationException],
}));
/**
 * Returns information about all dashboards in the account, in the current Region.
 */
export const listDashboards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDashboardsRequest,
  output: ListDashboardsResponse,
  errors: [UnsupportedOperationException],
}));
/**
 * Returns Insights metrics data for trails that have enabled Insights. The request must include the `EventSource`,
 * `EventName`, and `InsightType` parameters.
 *
 * If the `InsightType` is set to `ApiErrorRateInsight`, the request must also include the `ErrorCode` parameter.
 *
 * The following are the available time periods for `ListInsightsMetricData`. Each cutoff is inclusive.
 *
 * - Data points with a period of 60 seconds (1-minute) are available for 15 days.
 *
 * - Data points with a period of 300 seconds (5-minute) are available for 63 days.
 *
 * - Data points with a period of 3600 seconds (1 hour) are available for 90 days.
 *
 * To use `ListInsightsMetricData` operation, you must have the following permissions:
 *
 * - If `ListInsightsMetricData` is invoked with `TrailName` parameter, access to the `ListInsightsMetricData` API operation is linked to the `cloudtrail:LookupEvents` action and `cloudtrail:ListInsightsData`. To use this operation,
 * you must have permissions to perform the `cloudtrail:LookupEvents` and `cloudtrail:ListInsightsData` action on the specific trail.
 *
 * - If `ListInsightsMetricData` is invoked without `TrailName` parameter, access to the `ListInsightsMetricData` API operation is linked to the `cloudtrail:LookupEvents` action only. To use this operation,
 * you must have permissions to perform the `cloudtrail:LookupEvents` action.
 */
export const listInsightsMetricData =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListInsightsMetricDataRequest,
    output: ListInsightsMetricDataResponse,
    errors: [
      InvalidParameterException,
      InvalidTrailNameException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists trails that are in the current account.
 */
export const listTrails = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTrailsRequest,
  output: ListTrailsResponse,
  errors: [OperationNotPermittedException, UnsupportedOperationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Trails",
  } as const,
}));
/**
 * Searches sample queries and returns a list of sample queries that are sorted by relevance.
 * To search for sample queries, provide a natural language `SearchPhrase` in English.
 */
export const searchSampleQueries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchSampleQueriesRequest,
  output: SearchSampleQueriesResponse,
  errors: [
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Stops a specified import.
 */
export const stopImport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopImportRequest,
  output: StopImportResponse,
  errors: [
    ImportNotFoundException,
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes a channel.
 */
export const deleteChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelRequest,
  output: DeleteChannelResponse,
  errors: [
    ChannelARNInvalidException,
    ChannelNotFoundException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns information about a specific channel.
 */
export const getChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelRequest,
  output: GetChannelResponse,
  errors: [
    ChannelARNInvalidException,
    ChannelNotFoundException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns information about a specific import.
 */
export const getImport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportRequest,
  output: GetImportResponse,
  errors: [
    ImportNotFoundException,
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Generates a query from a natural language prompt. This operation uses generative artificial intelligence
 * (generative AI) to produce a ready-to-use SQL query from the prompt.
 *
 * The prompt can be a question or a statement about the event data
 * in your event data store. For example, you can enter prompts like "What are my
 * top errors in the past month?" and “Give me a list of users that used SNS.”
 *
 * The prompt must be in English. For information about limitations, permissions, and supported Regions, see
 * Create CloudTrail Lake queries from natural language prompts
 * in the *CloudTrail * user guide.
 *
 * Do not include any personally identifying, confidential, or sensitive information
 * in your prompts.
 *
 * This feature uses generative AI large language models (LLMs); we recommend double-checking the
 * LLM response.
 */
export const generateQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateQueryRequest,
  output: GenerateQueryResponse,
  errors: [
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    GenerateResponseException,
    InactiveEventDataStoreException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns settings information for a specified trail.
 */
export const getTrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrailRequest,
  output: GetTrailResponse,
  errors: [
    CloudTrailARNInvalidException,
    InvalidTrailNameException,
    OperationNotPermittedException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves settings for one or more trails associated with the current Region for your
 * account.
 */
export const describeTrails = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTrailsRequest,
  output: DescribeTrailsResponse,
  errors: [
    CloudTrailARNInvalidException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns information about an event data store specified as either an ARN or the ID
 * portion of the ARN.
 */
export const getEventDataStore = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventDataStoreRequest,
  output: GetEventDataStoreResponse,
  errors: [
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns a list of failures for the specified import.
 */
export const listImportFailures = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListImportFailuresRequest,
    output: ListImportFailuresResponse,
    errors: [
      InvalidNextTokenException,
      InvalidParameterException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Failures",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns information on all imports, or a select set of imports by
 * `ImportStatus` or `Destination`.
 */
export const listImports = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListImportsRequest,
    output: ListImportsResponse,
    errors: [
      EventDataStoreARNInvalidException,
      InvalidNextTokenException,
      InvalidParameterException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Imports",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Updates a channel specified by a required channel ARN or UUID.
 */
export const updateChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelRequest,
  output: UpdateChannelResponse,
  errors: [
    ChannelAlreadyExistsException,
    ChannelARNInvalidException,
    ChannelNotFoundException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidEventDataStoreCategoryException,
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns a JSON-formatted list of information about the specified trail. Fields include
 * information on delivery errors, Amazon SNS and Amazon S3 errors, and start
 * and stop logging times for each trail. This operation returns trail status from a single
 * Region. To return trail status from all Regions, you must call the operation on each
 * Region.
 */
export const getTrailStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrailStatusRequest,
  output: GetTrailStatusResponse,
  errors: [
    CloudTrailARNInvalidException,
    InvalidTrailNameException,
    OperationNotPermittedException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Describes the settings for the event selectors that you configured for your trail. The
 * information returned for your event selectors includes the following:
 *
 * - If your event selector includes read-only events, write-only events, or all
 * events. This applies to management events, data events, and network activity events.
 *
 * - If your event selector includes management events.
 *
 * - If your event selector includes network activity events, the event sources
 * for which you are logging network activity events.
 *
 * - If your event selector includes data events, the resources on which you are
 * logging data events.
 *
 * For more information about logging management, data, and network activity events, see the following topics
 * in the *CloudTrail User Guide*:
 *
 * - Logging management events
 *
 * - Logging data events
 *
 * - Logging network activity events
 */
export const getEventSelectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventSelectorsRequest,
  output: GetEventSelectorsResponse,
  errors: [
    CloudTrailARNInvalidException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Describes the settings for the Insights event selectors that you configured for your
 * trail or event data store. `GetInsightSelectors` shows if CloudTrail Insights logging is enabled
 * and which Insights types are configured with corresponding event categories. If you run
 * `GetInsightSelectors` on a trail or event data store that does not have Insights events enabled,
 * the operation throws the exception `InsightNotEnabledException`
 *
 * Specify either the `EventDataStore` parameter to get Insights event selectors for an event data store,
 * or the `TrailName` parameter to the get Insights event selectors for a trail. You cannot specify these parameters together.
 *
 * For more information, see Working with CloudTrail Insights in the *CloudTrail User Guide*.
 */
export const getInsightSelectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInsightSelectorsRequest,
  output: GetInsightSelectorsResponse,
  errors: [
    CloudTrailARNInvalidException,
    InsightNotEnabledException,
    InvalidParameterCombinationException,
    InvalidParameterException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns Insights events generated on a trail that logs data events. You can list Insights events that occurred in a Region within the last 90 days.
 *
 * ListInsightsData supports the following Dimensions for Insights events:
 *
 * - Event ID
 *
 * - Event name
 *
 * - Event source
 *
 * All dimensions are optional. The default number of results returned is 50, with a
 * maximum of 50 possible. The response includes a token that you can use to get the next page
 * of results.
 *
 * The rate of ListInsightsData requests is limited to two per second, per account, per Region. If
 * this limit is exceeded, a throttling error occurs.
 */
export const listInsightsData = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInsightsDataRequest,
    output: ListInsightsDataResponse,
    errors: [
      InvalidParameterException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Events",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns all public keys whose private keys were used to sign the digest files within the
 * specified time range. The public key is needed to validate digest files that were signed
 * with its corresponding private key.
 *
 * CloudTrail uses different private and public key pairs per Region. Each digest
 * file is signed with a private key unique to its Region. When you validate a digest file
 * from a specific Region, you must look in the same Region for its corresponding public
 * key.
 */
export const listPublicKeys = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPublicKeysRequest,
    output: ListPublicKeysResponse,
    errors: [
      InvalidTimeRangeException,
      InvalidTokenException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "PublicKeyList",
    } as const,
  }),
);
/**
 * Looks up management events or CloudTrail Insights events that are captured by CloudTrail.
 * You can look up events that occurred in a Region within the last 90 days.
 *
 * `LookupEvents` returns recent Insights events for trails that enable Insights. To view Insights events for an event data store, you can run queries on your
 * Insights event data store, and you can also view the Lake dashboard for Insights.
 *
 * Lookup supports the following attributes for management events:
 *
 * - Amazon Web Services access key
 *
 * - Event ID
 *
 * - Event name
 *
 * - Event source
 *
 * - Read only
 *
 * - Resource name
 *
 * - Resource type
 *
 * - User name
 *
 * Lookup supports the following attributes for Insights events:
 *
 * - Event ID
 *
 * - Event name
 *
 * - Event source
 *
 * All attributes are optional. The default number of results returned is 50, with a
 * maximum of 50 possible. The response includes a token that you can use to get the next page
 * of results.
 *
 * The rate of lookup requests is limited to two per second, per account, per Region. If
 * this limit is exceeded, a throttling error occurs.
 */
export const lookupEvents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: LookupEventsRequest,
    output: LookupEventsResponse,
    errors: [
      InvalidEventCategoryException,
      InvalidLookupAttributesException,
      InvalidMaxResultsException,
      InvalidNextTokenException,
      InvalidTimeRangeException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Events",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Starts the recording of Amazon Web Services API calls and log file delivery for a trail.
 * For a trail that is enabled in all Regions, this operation must be called from the Region
 * in which the trail was created. This operation cannot be called on the shadow trails
 * (replicated trails in other Regions) of a trail that is enabled in all Regions.
 */
export const startLogging = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartLoggingRequest,
  output: StartLoggingResponse,
  errors: [
    CloudTrailARNInvalidException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidHomeRegionException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns metadata about a query, including query run time in milliseconds, number of
 * events scanned and matched, and query status. If the query results were delivered to an S3 bucket,
 * the response also provides the S3 URI and the delivery status.
 *
 * You must specify either `QueryId` or `QueryAlias`. Specifying the `QueryAlias` parameter
 * returns information about the last query run for the alias. You can provide
 * `RefreshId` along with `QueryAlias` to view the query results
 * of a dashboard query for the specified `RefreshId`.
 */
export const describeQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeQueryRequest,
  output: DescribeQueryResponse,
  errors: [
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    QueryIdNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates the event configuration settings for the specified event data store or trail. This operation supports updating the maximum event size, adding or modifying context key selectors for event data store, and configuring aggregation settings for the trail.
 */
export const putEventConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutEventConfigurationRequest,
    output: PutEventConfigurationResponse,
    errors: [
      CloudTrailARNInvalidException,
      ConflictException,
      EventDataStoreARNInvalidException,
      EventDataStoreNotFoundException,
      InactiveEventDataStoreException,
      InsufficientDependencyServiceAccessPermissionException,
      InsufficientIAMAccessPermissionException,
      InvalidEventDataStoreCategoryException,
      InvalidEventDataStoreStatusException,
      InvalidHomeRegionException,
      InvalidParameterCombinationException,
      InvalidParameterException,
      InvalidTrailNameException,
      NoManagementAccountSLRExistsException,
      NotOrganizationMasterAccountException,
      OperationNotPermittedException,
      ThrottlingException,
      TrailNotFoundException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Starts a refresh of the specified dashboard.
 *
 * Each time a dashboard is refreshed, CloudTrail runs queries to populate the dashboard's widgets. CloudTrail must be granted permissions to run the `StartQuery` operation on your behalf. To provide permissions, run the `PutResourcePolicy` operation to attach a resource-based policy to each event data store. For more information,
 * see Example: Allow CloudTrail to run queries to populate a dashboard in the *CloudTrail User Guide*.
 */
export const startDashboardRefresh = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartDashboardRefreshRequest,
    output: StartDashboardRefreshResponse,
    errors: [
      EventDataStoreNotFoundException,
      InactiveEventDataStoreException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Creates a custom dashboard or the Highlights dashboard.
 *
 * - **Custom dashboards** - Custom dashboards allow you to query
 * events in any event data store type. You can add up to 10 widgets to a custom dashboard. You can manually refresh a custom dashboard, or you can set a refresh schedule.
 *
 * - **Highlights dashboard** - You can create
 * the Highlights dashboard to see a summary of key user activities and API usage across all your event data stores.
 * CloudTrail Lake manages the Highlights dashboard and refreshes the dashboard every 6 hours. To create the Highlights dashboard, you must set and enable a refresh schedule.
 *
 * CloudTrail runs queries to populate the dashboard's widgets during a manual or scheduled refresh. CloudTrail must be granted permissions to run the `StartQuery` operation on your behalf. To provide permissions, run the `PutResourcePolicy` operation to attach a resource-based policy to each event data store. For more information,
 * see Example: Allow CloudTrail to run queries to populate a dashboard in the *CloudTrail User Guide*.
 *
 * To set a refresh schedule, CloudTrail must be granted permissions to run the `StartDashboardRefresh` operation to refresh the dashboard on your behalf. To provide permissions, run the `PutResourcePolicy` operation to attach a resource-based policy to the dashboard. For more information,
 * see
 * Resource-based policy example for a dashboard in the *CloudTrail User Guide*.
 *
 * For more information about dashboards, see CloudTrail Lake dashboards in the *CloudTrail User Guide*.
 */
export const createDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDashboardRequest,
  output: CreateDashboardResponse,
  errors: [
    ConflictException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientEncryptionPolicyException,
    InvalidQueryStatementException,
    InvalidTagParameterException,
    ServiceQuotaExceededException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves the current event configuration settings for the specified event data store or trail. The response includes maximum event size configuration, the context key selectors configured for the event data store, and any aggregation settings configured for the trail.
 */
export const getEventConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEventConfigurationRequest,
    output: GetEventConfigurationResponse,
    errors: [
      CloudTrailARNInvalidException,
      EventDataStoreARNInvalidException,
      EventDataStoreNotFoundException,
      InvalidEventDataStoreCategoryException,
      InvalidEventDataStoreStatusException,
      InvalidParameterCombinationException,
      InvalidParameterException,
      InvalidTrailNameException,
      NoManagementAccountSLRExistsException,
      OperationNotPermittedException,
      TrailNotFoundException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Starts the ingestion of live events on an event data store specified as either an ARN or the ID portion of the ARN. To start ingestion, the event data store `Status` must be `STOPPED_INGESTION`
 * and the `eventCategory` must be `Management`, `Data`, `NetworkActivity`, or `ConfigurationItem`.
 */
export const startEventDataStoreIngestion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartEventDataStoreIngestionRequest,
    output: StartEventDataStoreIngestionResponse,
    errors: [
      ConflictException,
      EventDataStoreARNInvalidException,
      EventDataStoreNotFoundException,
      InsufficientDependencyServiceAccessPermissionException,
      InvalidEventDataStoreCategoryException,
      InvalidEventDataStoreStatusException,
      InvalidParameterException,
      NoManagementAccountSLRExistsException,
      NotOrganizationMasterAccountException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
  }));
/**
 * Stops the ingestion of live events on an event data store specified as either an ARN or the ID portion of the ARN. To stop ingestion, the event data store `Status` must be `ENABLED`
 * and the `eventCategory` must be `Management`, `Data`, `NetworkActivity`, or `ConfigurationItem`.
 */
export const stopEventDataStoreIngestion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopEventDataStoreIngestionRequest,
    output: StopEventDataStoreIngestionResponse,
    errors: [
      ConflictException,
      EventDataStoreARNInvalidException,
      EventDataStoreNotFoundException,
      InsufficientDependencyServiceAccessPermissionException,
      InvalidEventDataStoreCategoryException,
      InvalidEventDataStoreStatusException,
      InvalidParameterException,
      NoManagementAccountSLRExistsException,
      NotOrganizationMasterAccountException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Suspends the recording of Amazon Web Services API calls and log file delivery for the
 * specified trail. Under most circumstances, there is no need to use this action. You can
 * update a trail without stopping it first. This action is the only way to stop recording.
 * For a trail enabled in all Regions, this operation must be called from the Region in which
 * the trail was created, or an `InvalidHomeRegionException` will occur. This
 * operation cannot be called on the shadow trails (replicated trails in other Regions) of a
 * trail enabled in all Regions.
 */
export const stopLogging = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopLoggingRequest,
  output: StopLoggingResponse,
  errors: [
    CloudTrailARNInvalidException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidHomeRegionException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes a trail. This operation must be called from the Region in which the trail was
 * created. `DeleteTrail` cannot be called on the shadow trails (replicated trails
 * in other Regions) of a trail that is enabled in all Regions.
 *
 * While deleting a CloudTrail trail is an irreversible action, CloudTrail does not
 * delete log files in the Amazon S3 bucket for that trail, the Amazon S3 bucket itself, or the
 * CloudWatchlog group to which the trail delivers events. Deleting a multi-Region trail
 * will stop logging of events in all Amazon Web Services Regions enabled in your Amazon Web Services account. Deleting a
 * single-Region trail will stop logging of events in that Region only. It will not stop
 * logging of events in other Regions even if the trails in those other Regions have
 * identical names to the deleted trail.
 *
 * For information about account closure and deletion of CloudTrail trails, see https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-account-closure.html.
 */
export const deleteTrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrailRequest,
  output: DeleteTrailResponse,
  errors: [
    CloudTrailARNInvalidException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidHomeRegionException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Configures event selectors (also referred to as *basic event selectors*) or advanced event selectors for your trail. You can use
 * either `AdvancedEventSelectors` or `EventSelectors`, but not both. If
 * you apply `AdvancedEventSelectors` to a trail, any existing
 * `EventSelectors` are overwritten.
 *
 * You can use `AdvancedEventSelectors` to
 * log management events, data events for all resource types, and network activity events.
 *
 * You can use `EventSelectors` to log management events and data events for the following resource types:
 *
 * - `AWS::DynamoDB::Table`
 *
 * - `AWS::Lambda::Function`
 *
 * - `AWS::S3::Object`
 *
 * You can't use `EventSelectors` to log network activity events.
 *
 * If you want your trail to log Insights events, be sure the event selector or advanced event selector enables
 * logging of the Insights event types you want configured for your trail. For more information about logging Insights events, see Working with CloudTrail Insights in the *CloudTrail User Guide*.
 * By default, trails created without specific event selectors are configured to
 * log all read and write management events, and no data events or network activity events.
 *
 * When an event occurs in your account, CloudTrail evaluates the event selectors or
 * advanced event selectors in all trails. For each trail, if the event matches any event
 * selector, the trail processes and logs the event. If the event doesn't match any event
 * selector, the trail doesn't log the event.
 *
 * Example
 *
 * - You create an event selector for a trail and specify that you want to log write-only
 * events.
 *
 * - The EC2 `GetConsoleOutput` and `RunInstances` API operations
 * occur in your account.
 *
 * - CloudTrail evaluates whether the events match your event selectors.
 *
 * - The `RunInstances` is a write-only event and it matches your event
 * selector. The trail logs the event.
 *
 * - The `GetConsoleOutput` is a read-only event that doesn't match your
 * event selector. The trail doesn't log the event.
 *
 * The `PutEventSelectors` operation must be called from the Region in which the
 * trail was created; otherwise, an `InvalidHomeRegionException` exception is
 * thrown.
 *
 * You can configure up to five event selectors for each trail.
 *
 * You can add advanced event selectors, and conditions for your advanced event selectors,
 * up to a maximum of 500 values for all conditions and selectors on a trail. For more information, see
 * Logging management events, Logging
 * data events, Logging
 * network activity events, and Quotas in CloudTrail in the CloudTrail User
 * Guide.
 */
export const putEventSelectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEventSelectorsRequest,
  output: PutEventSelectorsResponse,
  errors: [
    CloudTrailARNInvalidException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidEventSelectorsException,
    InvalidHomeRegionException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Gets event data results of a query. You must specify the `QueryID` value
 * returned by the `StartQuery` operation.
 */
export const getQueryResults = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetQueryResultsRequest,
    output: GetQueryResultsResponse,
    errors: [
      EventDataStoreARNInvalidException,
      EventDataStoreNotFoundException,
      InactiveEventDataStoreException,
      InsufficientEncryptionPolicyException,
      InvalidMaxResultsException,
      InvalidNextTokenException,
      InvalidParameterException,
      NoManagementAccountSLRExistsException,
      OperationNotPermittedException,
      QueryIdNotFoundException,
      UnsupportedOperationException,
    ],
    pagination: { inputToken: "NextToken", outputToken: "NextToken" } as const,
  }),
);
/**
 * Cancels a query if the query is not in a terminated state, such as
 * `CANCELLED`, `FAILED`, `TIMED_OUT`, or
 * `FINISHED`. You must specify an ARN value for `EventDataStore`.
 * The ID of the query that you want to cancel is also required. When you run
 * `CancelQuery`, the query status might show as `CANCELLED` even if
 * the operation is not yet finished.
 */
export const cancelQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelQueryRequest,
  output: CancelQueryResponse,
  errors: [
    ConflictException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InactiveQueryException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    QueryIdNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates the specified dashboard.
 *
 * To set a refresh schedule, CloudTrail must be granted permissions to run the `StartDashboardRefresh` operation to refresh the dashboard on your behalf. To provide permissions, run the `PutResourcePolicy` operation to attach a resource-based policy to the dashboard. For more information,
 * see
 * Resource-based policy example for a dashboard in the *CloudTrail User Guide*.
 *
 * CloudTrail runs queries to populate the dashboard's widgets during a manual or scheduled refresh. CloudTrail must be granted permissions to run the `StartQuery` operation on your behalf. To provide permissions, run the `PutResourcePolicy` operation to attach a resource-based policy to each event data store. For more information,
 * see Example: Allow CloudTrail to run queries to populate a dashboard in the *CloudTrail User Guide*.
 */
export const updateDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDashboardRequest,
  output: UpdateDashboardResponse,
  errors: [
    ConflictException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientEncryptionPolicyException,
    InvalidQueryStatementException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    UnsupportedOperationException,
  ],
}));
/**
 * Disables the event data store specified by `EventDataStore`, which accepts an
 * event data store ARN. After you run `DeleteEventDataStore`, the event data store
 * enters a `PENDING_DELETION` state, and is automatically deleted after a wait
 * period of seven days. `TerminationProtectionEnabled` must be set to
 * `False` on the event data store and the `FederationStatus` must be `DISABLED`.
 * You cannot delete an event data store if `TerminationProtectionEnabled`
 * is `True` or the `FederationStatus` is `ENABLED`.
 *
 * After you run `DeleteEventDataStore` on an event data store, you cannot run
 * `ListQueries`, `DescribeQuery`, or `GetQueryResults` on
 * queries that are using an event data store in a `PENDING_DELETION` state. An
 * event data store in the `PENDING_DELETION` state does not incur costs.
 */
export const deleteEventDataStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEventDataStoreRequest,
    output: DeleteEventDataStoreResponse,
    errors: [
      ChannelExistsForEDSException,
      ConflictException,
      EventDataStoreARNInvalidException,
      EventDataStoreFederationEnabledException,
      EventDataStoreHasOngoingImportException,
      EventDataStoreNotFoundException,
      EventDataStoreTerminationProtectedException,
      InactiveEventDataStoreException,
      InsufficientDependencyServiceAccessPermissionException,
      InvalidParameterException,
      NoManagementAccountSLRExistsException,
      NotOrganizationMasterAccountException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Retrieves the JSON text of the resource-based policy document attached to the CloudTrail event data store, dashboard, or channel.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    OperationNotPermittedException,
    ResourceARNNotValidException,
    ResourceNotFoundException,
    ResourcePolicyNotFoundException,
    ResourceTypeNotSupportedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Attaches a resource-based permission policy to a CloudTrail event data store, dashboard, or channel. For more information about resource-based policies, see
 * CloudTrail resource-based policy examples
 * in the *CloudTrail User Guide*.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    ConflictException,
    OperationNotPermittedException,
    ResourceARNNotValidException,
    ResourceNotFoundException,
    ResourcePolicyNotValidException,
    ResourceTypeNotSupportedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes the resource-based policy attached to the CloudTrail event data store, dashboard, or channel.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      ConflictException,
      OperationNotPermittedException,
      ResourceARNNotValidException,
      ResourceNotFoundException,
      ResourcePolicyNotFoundException,
      ResourceTypeNotSupportedException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Lists the tags for the specified trails, event data stores, dashboards, or channels in the current Region.
 */
export const listTags = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    ChannelARNInvalidException,
    CloudTrailARNInvalidException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidTokenException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    ResourceNotFoundException,
    ResourceTypeNotSupportedException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ResourceTagList",
  } as const,
}));
/**
 * Removes the specified tags from a trail, event data store, dashboard, or channel.
 */
export const removeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsRequest,
  output: RemoveTagsResponse,
  errors: [
    ChannelARNInvalidException,
    ChannelNotFoundException,
    CloudTrailARNInvalidException,
    ConflictException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidTagParameterException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ResourceNotFoundException,
    ResourceTypeNotSupportedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Removes CloudTrail delegated administrator permissions from a member account in
 * an organization.
 */
export const deregisterOrganizationDelegatedAdmin =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeregisterOrganizationDelegatedAdminRequest,
    output: DeregisterOrganizationDelegatedAdminResponse,
    errors: [
      AccountNotFoundException,
      AccountNotRegisteredException,
      CloudTrailAccessNotEnabledException,
      ConflictException,
      InsufficientDependencyServiceAccessPermissionException,
      InvalidParameterException,
      NotOrganizationManagementAccountException,
      OperationNotPermittedException,
      OrganizationNotInAllFeaturesModeException,
      OrganizationsNotInUseException,
      UnsupportedOperationException,
    ],
  }));
/**
 * Returns a list of queries and query statuses for the past seven days. You must specify
 * an ARN value for `EventDataStore`. Optionally, to shorten the list of results,
 * you can specify a time range, formatted as timestamps, by adding `StartTime` and
 * `EndTime` parameters, and a `QueryStatus` value. Valid values for
 * `QueryStatus` include `QUEUED`, `RUNNING`,
 * `FINISHED`, `FAILED`, `TIMED_OUT`, or
 * `CANCELLED`.
 */
export const listQueries = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListQueriesRequest,
    output: ListQueriesResponse,
    errors: [
      EventDataStoreARNInvalidException,
      EventDataStoreNotFoundException,
      InactiveEventDataStoreException,
      InvalidDateRangeException,
      InvalidMaxResultsException,
      InvalidNextTokenException,
      InvalidParameterException,
      InvalidQueryStatusException,
      NoManagementAccountSLRExistsException,
      OperationNotPermittedException,
      UnsupportedOperationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Starts an import of logged trail events from a source S3 bucket to a destination event
 * data store. By default, CloudTrail only imports events contained in the S3 bucket's
 * `CloudTrail` prefix and the prefixes inside the `CloudTrail` prefix, and does not check prefixes for other Amazon Web Services
 * services. If you want to import CloudTrail events contained in another prefix, you
 * must include the prefix in the `S3LocationUri`. For more considerations about
 * importing trail events, see Considerations for copying trail events in the *CloudTrail User Guide*.
 *
 * When you start a new import, the `Destinations` and
 * `ImportSource` parameters are required. Before starting a new import, disable
 * any access control lists (ACLs) attached to the source S3 bucket. For more information
 * about disabling ACLs, see Controlling ownership of
 * objects and disabling ACLs for your bucket.
 *
 * When you retry an import, the `ImportID` parameter is required.
 *
 * If the destination event data store is for an organization, you must use the
 * management account to import trail events. You cannot use the delegated administrator
 * account for the organization.
 */
export const startImport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportRequest,
  output: StartImportResponse,
  errors: [
    AccountHasOngoingImportException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    ImportNotFoundException,
    InactiveEventDataStoreException,
    InsufficientEncryptionPolicyException,
    InvalidEventDataStoreCategoryException,
    InvalidEventDataStoreStatusException,
    InvalidImportSourceException,
    InvalidParameterException,
    OperationNotPermittedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Enables Lake query federation on the specified event data store. Federating an event data store lets you view the metadata associated with the event data store in the Glue
 * Data Catalog and run
 * SQL queries against your event data using Amazon Athena. The table metadata stored in the Glue Data Catalog
 * lets the Athena query engine know how to find, read, and process the data that you want to query.
 *
 * When you enable Lake query federation, CloudTrail
 * creates a managed database named `aws:cloudtrail` (if the database doesn't already exist) and a managed federated table in
 * the Glue Data Catalog. The event data store ID is used for the table name. CloudTrail registers the role ARN and event data store in
 * Lake Formation, the service responsible for allowing fine-grained access control
 * of the federated resources in the Glue Data Catalog.
 *
 * For more information about Lake query federation, see Federate an event data store.
 */
export const enableFederation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableFederationRequest,
  output: EnableFederationResponse,
  errors: [
    AccessDeniedException,
    CloudTrailAccessNotEnabledException,
    ConcurrentModificationException,
    EventDataStoreARNInvalidException,
    EventDataStoreFederationEnabledException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    UnsupportedOperationException,
  ],
}));
/**
 * Disables Lake query federation on the specified event data store. When you disable federation, CloudTrail disables
 * the integration with Glue, Lake Formation, and Amazon Athena.
 * After disabling Lake query federation, you can no longer query your event data in Amazon Athena.
 *
 * No CloudTrail Lake data is deleted when you disable federation and you can continue to run queries in CloudTrail Lake.
 */
export const disableFederation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableFederationRequest,
  output: DisableFederationResponse,
  errors: [
    AccessDeniedException,
    CloudTrailAccessNotEnabledException,
    ConcurrentModificationException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientDependencyServiceAccessPermissionException,
    InvalidParameterException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    UnsupportedOperationException,
  ],
}));
/**
 * Restores a deleted event data store specified by `EventDataStore`, which
 * accepts an event data store ARN. You can only restore a deleted event data store within the
 * seven-day wait period after deletion. Restoring an event data store can take several
 * minutes, depending on the size of the event data store.
 */
export const restoreEventDataStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestoreEventDataStoreRequest,
    output: RestoreEventDataStoreResponse,
    errors: [
      CloudTrailAccessNotEnabledException,
      EventDataStoreARNInvalidException,
      EventDataStoreMaxLimitExceededException,
      EventDataStoreNotFoundException,
      InsufficientDependencyServiceAccessPermissionException,
      InvalidEventDataStoreStatusException,
      InvalidParameterException,
      NoManagementAccountSLRExistsException,
      NotOrganizationMasterAccountException,
      OperationNotPermittedException,
      OrganizationNotInAllFeaturesModeException,
      OrganizationsNotInUseException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Registers an organization’s member account as the CloudTrail delegated administrator.
 */
export const registerOrganizationDelegatedAdmin =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RegisterOrganizationDelegatedAdminRequest,
    output: RegisterOrganizationDelegatedAdminResponse,
    errors: [
      AccountNotFoundException,
      AccountRegisteredException,
      CannotDelegateManagementAccountException,
      CloudTrailAccessNotEnabledException,
      ConflictException,
      DelegatedAdminAccountLimitExceededException,
      InsufficientDependencyServiceAccessPermissionException,
      InsufficientIAMAccessPermissionException,
      InvalidParameterException,
      NotOrganizationManagementAccountException,
      OperationNotPermittedException,
      OrganizationNotInAllFeaturesModeException,
      OrganizationsNotInUseException,
      UnsupportedOperationException,
    ],
  }));
/**
 * Creates a channel for CloudTrail to ingest events from a partner or external source.
 * After you create a channel, a CloudTrail Lake event data store can log events
 * from the partner or source that you specify.
 */
export const createChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelRequest,
  output: CreateChannelResponse,
  errors: [
    ChannelAlreadyExistsException,
    ChannelMaxLimitExceededException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidEventDataStoreCategoryException,
    InvalidParameterException,
    InvalidSourceException,
    InvalidTagParameterException,
    OperationNotPermittedException,
    TagsLimitExceededException,
    UnsupportedOperationException,
  ],
}));
/**
 * Adds one or more tags to a trail, event data store, dashboard, or channel, up to a limit of 50. Overwrites an
 * existing tag's value when a new value is specified for an existing tag key. Tag key names
 * must be unique; you cannot have two keys with the same name but different
 * values. If you specify a key without a value, the tag will be created with the specified
 * key and a value of null. You can tag a trail or event data store that applies to all
 * Amazon Web Services Regions only from the Region in which the trail or event data store
 * was created (also known as its home Region).
 */
export const addTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsRequest,
  output: AddTagsResponse,
  errors: [
    ChannelARNInvalidException,
    ChannelNotFoundException,
    CloudTrailARNInvalidException,
    ConflictException,
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InvalidTagParameterException,
    InvalidTrailNameException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    ResourceNotFoundException,
    ResourceTypeNotSupportedException,
    TagsLimitExceededException,
    UnsupportedOperationException,
  ],
}));
/**
 * Lets you enable Insights event logging on specific event categories by specifying the Insights selectors that you
 * want to enable on an existing trail or event data store. You also use `PutInsightSelectors` to turn
 * off Insights event logging, by passing an empty list of Insights types. The valid Insights
 * event types are `ApiErrorRateInsight` and
 * `ApiCallRateInsight`, and valid EventCategories are `Management` and `Data`.
 *
 * Insights on data events are not supported on event data stores. For event data stores, you can only enable Insights on management events.
 *
 * To enable Insights on an event data store, you must specify the ARNs (or ID suffix of the ARNs) for the source event data store (`EventDataStore`) and the destination event data store (`InsightsDestination`). The source event data store logs management events and enables Insights.
 * The destination event data store logs Insights events based upon the management event activity of the source event data store. The source and destination event data stores must belong to the same Amazon Web Services account.
 *
 * To log Insights events for a trail, you must specify the name (`TrailName`) of the CloudTrail trail for which you want to change or add Insights
 * selectors.
 *
 * - For Management events Insights: To log CloudTrail Insights on the API call rate, the trail or event data store must log `write` management events.
 * To log CloudTrail Insights on the API error rate, the trail or event data store must log `read` or `write` management events.
 *
 * - For Data events Insights: To log CloudTrail Insights on the API call rate or API error rate, the trail must log `read` or `write` data events. Data events Insights are not supported on event data store.
 *
 * To log CloudTrail Insights events on API call volume, the trail or event data store
 * must log `write` management events. To log CloudTrail
 * Insights events on API error rate, the trail or event data store must log `read` or
 * `write` management events. You can call `GetEventSelectors` on a trail
 * to check whether the trail logs management events. You can call `GetEventDataStore` on an
 * event data store to check whether the event data store logs management events.
 *
 * For more information, see Working with CloudTrail Insights in the *CloudTrail User Guide*.
 */
export const putInsightSelectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutInsightSelectorsRequest,
  output: PutInsightSelectorsResponse,
  errors: [
    CloudTrailARNInvalidException,
    InsufficientEncryptionPolicyException,
    InsufficientS3BucketPolicyException,
    InvalidHomeRegionException,
    InvalidInsightSelectorsException,
    InvalidParameterCombinationException,
    InvalidParameterException,
    InvalidTrailNameException,
    KmsException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    S3BucketDoesNotExistException,
    ThrottlingException,
    TrailNotFoundException,
    UnsupportedOperationException,
  ],
}));
/**
 * Starts a CloudTrail Lake query. Use the `QueryStatement`
 * parameter to provide your SQL query, enclosed in single quotation marks. Use the optional
 * `DeliveryS3Uri` parameter to deliver the query results to an S3
 * bucket.
 *
 * `StartQuery` requires you specify either the `QueryStatement` parameter, or a `QueryAlias` and any `QueryParameters`. In the current release,
 * the `QueryAlias` and `QueryParameters` parameters are used only for the queries that populate the CloudTrail Lake dashboards.
 */
export const startQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartQueryRequest,
  output: StartQueryResponse,
  errors: [
    EventDataStoreARNInvalidException,
    EventDataStoreNotFoundException,
    InactiveEventDataStoreException,
    InsufficientEncryptionPolicyException,
    InsufficientS3BucketPolicyException,
    InvalidParameterException,
    InvalidQueryStatementException,
    InvalidS3BucketNameException,
    InvalidS3PrefixException,
    MaxConcurrentQueriesException,
    NoManagementAccountSLRExistsException,
    OperationNotPermittedException,
    S3BucketDoesNotExistException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a new event data store.
 */
export const createEventDataStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEventDataStoreRequest,
    output: CreateEventDataStoreResponse,
    errors: [
      CloudTrailAccessNotEnabledException,
      ConflictException,
      EventDataStoreAlreadyExistsException,
      EventDataStoreMaxLimitExceededException,
      InsufficientDependencyServiceAccessPermissionException,
      InsufficientEncryptionPolicyException,
      InvalidEventSelectorsException,
      InvalidKmsKeyIdException,
      InvalidParameterException,
      InvalidTagParameterException,
      KmsException,
      KmsKeyNotFoundException,
      NoManagementAccountSLRExistsException,
      NotOrganizationMasterAccountException,
      OperationNotPermittedException,
      OrganizationNotInAllFeaturesModeException,
      OrganizationsNotInUseException,
      ThrottlingException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Updates an event data store. The required `EventDataStore` value is an ARN or
 * the ID portion of the ARN. Other parameters are optional, but at least one optional
 * parameter must be specified, or CloudTrail throws an error.
 * `RetentionPeriod` is in days, and valid values are integers between 7 and
 * 3653 if the `BillingMode` is set to `EXTENDABLE_RETENTION_PRICING`, or between 7 and 2557 if `BillingMode` is set to `FIXED_RETENTION_PRICING`. By default, `TerminationProtection` is enabled.
 *
 * For event data stores for CloudTrail events, `AdvancedEventSelectors`
 * includes or excludes management, data, or network activity events in your event data store. For more
 * information about `AdvancedEventSelectors`, see AdvancedEventSelectors.
 *
 * For event data stores for CloudTrail Insights events, Config configuration items, Audit Manager evidence, or non-Amazon Web Services events,
 * `AdvancedEventSelectors` includes events of that type in your event data store.
 */
export const updateEventDataStore = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEventDataStoreRequest,
    output: UpdateEventDataStoreResponse,
    errors: [
      CloudTrailAccessNotEnabledException,
      ConflictException,
      EventDataStoreAlreadyExistsException,
      EventDataStoreARNInvalidException,
      EventDataStoreHasOngoingImportException,
      EventDataStoreNotFoundException,
      InactiveEventDataStoreException,
      InsufficientDependencyServiceAccessPermissionException,
      InsufficientEncryptionPolicyException,
      InvalidEventSelectorsException,
      InvalidInsightSelectorsException,
      InvalidKmsKeyIdException,
      InvalidParameterException,
      KmsException,
      KmsKeyNotFoundException,
      NoManagementAccountSLRExistsException,
      NotOrganizationMasterAccountException,
      OperationNotPermittedException,
      OrganizationNotInAllFeaturesModeException,
      OrganizationsNotInUseException,
      ThrottlingException,
      UnsupportedOperationException,
    ],
  }),
);
/**
 * Updates trail settings that control what events you are logging, and how to handle log
 * files. Changes to a trail do not require stopping the CloudTrail service. Use this
 * action to designate an existing bucket for log delivery. If the existing bucket has
 * previously been a target for CloudTrail log files, an IAM policy
 * exists for the bucket. `UpdateTrail` must be called from the Region in which the
 * trail was created; otherwise, an `InvalidHomeRegionException` is thrown.
 */
export const updateTrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrailRequest,
  output: UpdateTrailResponse,
  errors: [
    CloudTrailAccessNotEnabledException,
    CloudTrailARNInvalidException,
    CloudTrailInvalidClientTokenIdException,
    CloudWatchLogsDeliveryUnavailableException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InsufficientEncryptionPolicyException,
    InsufficientS3BucketPolicyException,
    InsufficientSnsTopicPolicyException,
    InvalidCloudWatchLogsLogGroupArnException,
    InvalidCloudWatchLogsRoleArnException,
    InvalidEventSelectorsException,
    InvalidHomeRegionException,
    InvalidKmsKeyIdException,
    InvalidParameterCombinationException,
    InvalidParameterException,
    InvalidS3BucketNameException,
    InvalidS3PrefixException,
    InvalidSnsTopicNameException,
    InvalidTrailNameException,
    KmsException,
    KmsKeyDisabledException,
    KmsKeyNotFoundException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    S3BucketDoesNotExistException,
    ThrottlingException,
    TrailNotFoundException,
    TrailNotProvidedException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a trail that specifies the settings for delivery of log data to an Amazon S3 bucket.
 */
export const createTrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrailRequest,
  output: CreateTrailResponse,
  errors: [
    CloudTrailAccessNotEnabledException,
    CloudTrailInvalidClientTokenIdException,
    CloudWatchLogsDeliveryUnavailableException,
    ConflictException,
    InsufficientDependencyServiceAccessPermissionException,
    InsufficientEncryptionPolicyException,
    InsufficientS3BucketPolicyException,
    InsufficientSnsTopicPolicyException,
    InvalidCloudWatchLogsLogGroupArnException,
    InvalidCloudWatchLogsRoleArnException,
    InvalidKmsKeyIdException,
    InvalidParameterCombinationException,
    InvalidParameterException,
    InvalidS3BucketNameException,
    InvalidS3PrefixException,
    InvalidSnsTopicNameException,
    InvalidTagParameterException,
    InvalidTrailNameException,
    KmsException,
    KmsKeyDisabledException,
    KmsKeyNotFoundException,
    MaximumNumberOfTrailsExceededException,
    NoManagementAccountSLRExistsException,
    NotOrganizationMasterAccountException,
    OperationNotPermittedException,
    OrganizationNotInAllFeaturesModeException,
    OrganizationsNotInUseException,
    S3BucketDoesNotExistException,
    TagsLimitExceededException,
    ThrottlingException,
    TrailAlreadyExistsException,
    TrailNotProvidedException,
    UnsupportedOperationException,
  ],
}));

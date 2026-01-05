import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "RUM", serviceShapeName: "RUM" });
const auth = T.AwsAuthSigv4({ name: "rum" });
const ver = T.ServiceVersion("2018-05-10");
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
                        url: "https://rum-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://rum-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://rum.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://rum.{Region}.{PartitionResult#dnsSuffix}",
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
export const AppMonitorDomainList = S.Array(S.String);
export const MetricDefinitionIds = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
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
export class GetAppMonitorRequest extends S.Class<GetAppMonitorRequest>(
  "GetAppMonitorRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "GET", uri: "/appmonitor/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppMonitorRequest extends S.Class<DeleteAppMonitorRequest>(
  "DeleteAppMonitorRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/appmonitor/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppMonitorResponse extends S.Class<DeleteAppMonitorResponse>(
  "DeleteAppMonitorResponse",
)({}) {}
export class ListAppMonitorsRequest extends S.Class<ListAppMonitorsRequest>(
  "ListAppMonitorsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/appmonitors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteRumMetricDefinitionsRequest extends S.Class<BatchDeleteRumMetricDefinitionsRequest>(
  "BatchDeleteRumMetricDefinitionsRequest",
)(
  {
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String.pipe(T.HttpQuery("destination")),
    DestinationArn: S.optional(S.String).pipe(T.HttpQuery("destinationArn")),
    MetricDefinitionIds: MetricDefinitionIds.pipe(
      T.HttpQuery("metricDefinitionIds"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/rummetrics/{AppMonitorName}/metrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetRumMetricDefinitionsRequest extends S.Class<BatchGetRumMetricDefinitionsRequest>(
  "BatchGetRumMetricDefinitionsRequest",
)(
  {
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String.pipe(T.HttpQuery("destination")),
    DestinationArn: S.optional(S.String).pipe(T.HttpQuery("destinationArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/rummetrics/{AppMonitorName}/metrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export const Pages = S.Array(S.String);
export const FavoritePages = S.Array(S.String);
export const Telemetries = S.Array(S.String);
export class AppMonitorConfiguration extends S.Class<AppMonitorConfiguration>(
  "AppMonitorConfiguration",
)({
  IdentityPoolId: S.optional(S.String),
  ExcludedPages: S.optional(Pages),
  IncludedPages: S.optional(Pages),
  FavoritePages: S.optional(FavoritePages),
  SessionSampleRate: S.optional(S.Number),
  GuestRoleArn: S.optional(S.String),
  AllowCookies: S.optional(S.Boolean),
  Telemetries: S.optional(Telemetries),
  EnableXRay: S.optional(S.Boolean),
}) {}
export class CustomEvents extends S.Class<CustomEvents>("CustomEvents")({
  Status: S.optional(S.String),
}) {}
export class JavaScriptSourceMaps extends S.Class<JavaScriptSourceMaps>(
  "JavaScriptSourceMaps",
)({ Status: S.String, S3Uri: S.optional(S.String) }) {}
export class DeobfuscationConfiguration extends S.Class<DeobfuscationConfiguration>(
  "DeobfuscationConfiguration",
)({ JavaScriptSourceMaps: S.optional(JavaScriptSourceMaps) }) {}
export class CreateAppMonitorRequest extends S.Class<CreateAppMonitorRequest>(
  "CreateAppMonitorRequest",
)(
  {
    Name: S.String,
    Domain: S.optional(S.String),
    DomainList: S.optional(AppMonitorDomainList),
    Tags: S.optional(TagMap),
    AppMonitorConfiguration: S.optional(AppMonitorConfiguration),
    CwLogEnabled: S.optional(S.Boolean),
    CustomEvents: S.optional(CustomEvents),
    DeobfuscationConfiguration: S.optional(DeobfuscationConfiguration),
    Platform: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/appmonitor" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    PolicyRevisionId: S.optional(S.String).pipe(
      T.HttpQuery("policyRevisionId"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/appmonitor/{Name}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRumMetricsDestinationRequest extends S.Class<DeleteRumMetricsDestinationRequest>(
  "DeleteRumMetricsDestinationRequest",
)(
  {
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String.pipe(T.HttpQuery("destination")),
    DestinationArn: S.optional(S.String).pipe(T.HttpQuery("destinationArn")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/rummetrics/{AppMonitorName}/metricsdestination",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRumMetricsDestinationResponse extends S.Class<DeleteRumMetricsDestinationResponse>(
  "DeleteRumMetricsDestinationResponse",
)({}) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "GET", uri: "/appmonitor/{Name}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRumMetricsDestinationsRequest extends S.Class<ListRumMetricsDestinationsRequest>(
  "ListRumMetricsDestinationsRequest",
)(
  {
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/rummetrics/{AppMonitorName}/metricsdestination",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    PolicyDocument: S.String,
    PolicyRevisionId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/appmonitor/{Name}/policy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutRumMetricsDestinationRequest extends S.Class<PutRumMetricsDestinationRequest>(
  "PutRumMetricsDestinationRequest",
)(
  {
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String,
    DestinationArn: S.optional(S.String),
    IamRoleArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/rummetrics/{AppMonitorName}/metricsdestination",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutRumMetricsDestinationResponse extends S.Class<PutRumMetricsDestinationResponse>(
  "PutRumMetricsDestinationResponse",
)({}) {}
export const DimensionKeysMap = S.Record({ key: S.String, value: S.String });
export class MetricDefinitionRequest extends S.Class<MetricDefinitionRequest>(
  "MetricDefinitionRequest",
)({
  Name: S.String,
  ValueKey: S.optional(S.String),
  UnitLabel: S.optional(S.String),
  DimensionKeys: S.optional(DimensionKeysMap),
  EventPattern: S.optional(S.String),
  Namespace: S.optional(S.String),
}) {}
export class UpdateRumMetricDefinitionRequest extends S.Class<UpdateRumMetricDefinitionRequest>(
  "UpdateRumMetricDefinitionRequest",
)(
  {
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String,
    DestinationArn: S.optional(S.String),
    MetricDefinition: MetricDefinitionRequest,
    MetricDefinitionId: S.String,
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/rummetrics/{AppMonitorName}/metrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRumMetricDefinitionResponse extends S.Class<UpdateRumMetricDefinitionResponse>(
  "UpdateRumMetricDefinitionResponse",
)({}) {}
export const QueryFilterValueList = S.Array(S.String);
export class AppMonitorDetails extends S.Class<AppMonitorDetails>(
  "AppMonitorDetails",
)({
  name: S.optional(S.String),
  id: S.optional(S.String),
  version: S.optional(S.String),
}) {}
export class UserDetails extends S.Class<UserDetails>("UserDetails")({
  userId: S.optional(S.String),
  sessionId: S.optional(S.String),
}) {}
export class RumEvent extends S.Class<RumEvent>("RumEvent")({
  id: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  type: S.String,
  metadata: S.optional(S.String),
  details: S.String,
}) {}
export const RumEventList = S.Array(RumEvent);
export class TimeRange extends S.Class<TimeRange>("TimeRange")({
  After: S.Number,
  Before: S.optional(S.Number),
}) {}
export class QueryFilter extends S.Class<QueryFilter>("QueryFilter")({
  Name: S.optional(S.String),
  Values: S.optional(QueryFilterValueList),
}) {}
export const QueryFilters = S.Array(QueryFilter);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ ResourceArn: S.String, Tags: TagMap }) {}
export class PutRumEventsRequest extends S.Class<PutRumEventsRequest>(
  "PutRumEventsRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel("Id")),
    BatchId: S.String,
    AppMonitorDetails: AppMonitorDetails,
    UserDetails: UserDetails,
    RumEvents: RumEventList,
    Alias: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/appmonitors/{Id}/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutRumEventsResponse extends S.Class<PutRumEventsResponse>(
  "PutRumEventsResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagMap },
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
export class CreateAppMonitorResponse extends S.Class<CreateAppMonitorResponse>(
  "CreateAppMonitorResponse",
)({ Id: S.optional(S.String) }) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({ PolicyRevisionId: S.optional(S.String) }) {}
export class GetAppMonitorDataRequest extends S.Class<GetAppMonitorDataRequest>(
  "GetAppMonitorDataRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    TimeRange: TimeRange,
    Filters: S.optional(QueryFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/appmonitor/{Name}/data" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({
  PolicyDocument: S.optional(S.String),
  PolicyRevisionId: S.optional(S.String),
}) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({
  PolicyDocument: S.optional(S.String),
  PolicyRevisionId: S.optional(S.String),
}) {}
export class AppMonitorSummary extends S.Class<AppMonitorSummary>(
  "AppMonitorSummary",
)({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  Created: S.optional(S.String),
  LastModified: S.optional(S.String),
  State: S.optional(S.String),
  Platform: S.optional(S.String),
}) {}
export const AppMonitorSummaryList = S.Array(AppMonitorSummary);
export const MetricDefinitionsRequest = S.Array(MetricDefinitionRequest);
export class BatchDeleteRumMetricDefinitionsError extends S.Class<BatchDeleteRumMetricDefinitionsError>(
  "BatchDeleteRumMetricDefinitionsError",
)({
  MetricDefinitionId: S.String,
  ErrorCode: S.String,
  ErrorMessage: S.String,
}) {}
export const BatchDeleteRumMetricDefinitionsErrors = S.Array(
  BatchDeleteRumMetricDefinitionsError,
);
export class MetricDefinition extends S.Class<MetricDefinition>(
  "MetricDefinition",
)({
  MetricDefinitionId: S.String,
  Name: S.String,
  ValueKey: S.optional(S.String),
  UnitLabel: S.optional(S.String),
  DimensionKeys: S.optional(DimensionKeysMap),
  EventPattern: S.optional(S.String),
  Namespace: S.optional(S.String),
}) {}
export const MetricDefinitions = S.Array(MetricDefinition);
export const EventDataList = S.Array(S.String);
export class MetricDestinationSummary extends S.Class<MetricDestinationSummary>(
  "MetricDestinationSummary",
)({
  Destination: S.optional(S.String),
  DestinationArn: S.optional(S.String),
  IamRoleArn: S.optional(S.String),
}) {}
export const MetricDestinationSummaryList = S.Array(MetricDestinationSummary);
export class UpdateAppMonitorRequest extends S.Class<UpdateAppMonitorRequest>(
  "UpdateAppMonitorRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    Domain: S.optional(S.String),
    DomainList: S.optional(AppMonitorDomainList),
    AppMonitorConfiguration: S.optional(AppMonitorConfiguration),
    CwLogEnabled: S.optional(S.Boolean),
    CustomEvents: S.optional(CustomEvents),
    DeobfuscationConfiguration: S.optional(DeobfuscationConfiguration),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/appmonitor/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateAppMonitorResponse extends S.Class<UpdateAppMonitorResponse>(
  "UpdateAppMonitorResponse",
)({}) {}
export class ListAppMonitorsResponse extends S.Class<ListAppMonitorsResponse>(
  "ListAppMonitorsResponse",
)({
  NextToken: S.optional(S.String),
  AppMonitorSummaries: S.optional(AppMonitorSummaryList),
}) {}
export class BatchCreateRumMetricDefinitionsRequest extends S.Class<BatchCreateRumMetricDefinitionsRequest>(
  "BatchCreateRumMetricDefinitionsRequest",
)(
  {
    AppMonitorName: S.String.pipe(T.HttpLabel("AppMonitorName")),
    Destination: S.String,
    DestinationArn: S.optional(S.String),
    MetricDefinitions: MetricDefinitionsRequest,
  },
  T.all(
    T.Http({ method: "POST", uri: "/rummetrics/{AppMonitorName}/metrics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteRumMetricDefinitionsResponse extends S.Class<BatchDeleteRumMetricDefinitionsResponse>(
  "BatchDeleteRumMetricDefinitionsResponse",
)({
  Errors: BatchDeleteRumMetricDefinitionsErrors,
  MetricDefinitionIds: S.optional(MetricDefinitionIds),
}) {}
export class BatchGetRumMetricDefinitionsResponse extends S.Class<BatchGetRumMetricDefinitionsResponse>(
  "BatchGetRumMetricDefinitionsResponse",
)({
  MetricDefinitions: S.optional(MetricDefinitions),
  NextToken: S.optional(S.String),
}) {}
export class GetAppMonitorDataResponse extends S.Class<GetAppMonitorDataResponse>(
  "GetAppMonitorDataResponse",
)({ Events: S.optional(EventDataList), NextToken: S.optional(S.String) }) {}
export class ListRumMetricsDestinationsResponse extends S.Class<ListRumMetricsDestinationsResponse>(
  "ListRumMetricsDestinationsResponse",
)({
  Destinations: S.optional(MetricDestinationSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class CwLog extends S.Class<CwLog>("CwLog")({
  CwLogEnabled: S.optional(S.Boolean),
  CwLogGroup: S.optional(S.String),
}) {}
export class DataStorage extends S.Class<DataStorage>("DataStorage")({
  CwLog: S.optional(CwLog),
}) {}
export class AppMonitor extends S.Class<AppMonitor>("AppMonitor")({
  Name: S.optional(S.String),
  Domain: S.optional(S.String),
  DomainList: S.optional(AppMonitorDomainList),
  Id: S.optional(S.String),
  Created: S.optional(S.String),
  LastModified: S.optional(S.String),
  Tags: S.optional(TagMap),
  State: S.optional(S.String),
  AppMonitorConfiguration: S.optional(AppMonitorConfiguration),
  DataStorage: S.optional(DataStorage),
  CustomEvents: S.optional(CustomEvents),
  DeobfuscationConfiguration: S.optional(DeobfuscationConfiguration),
  Platform: S.optional(S.String),
}) {}
export class BatchCreateRumMetricDefinitionsError extends S.Class<BatchCreateRumMetricDefinitionsError>(
  "BatchCreateRumMetricDefinitionsError",
)({
  MetricDefinition: MetricDefinitionRequest,
  ErrorCode: S.String,
  ErrorMessage: S.String,
}) {}
export const BatchCreateRumMetricDefinitionsErrors = S.Array(
  BatchCreateRumMetricDefinitionsError,
);
export class GetAppMonitorResponse extends S.Class<GetAppMonitorResponse>(
  "GetAppMonitorResponse",
)({ AppMonitor: S.optional(AppMonitor) }) {}
export class BatchCreateRumMetricDefinitionsResponse extends S.Class<BatchCreateRumMetricDefinitionsResponse>(
  "BatchCreateRumMetricDefinitionsResponse",
)({
  Errors: BatchCreateRumMetricDefinitionsErrors,
  MetricDefinitions: S.optional(MetricDefinitions),
}) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceName: S.String,
    resourceType: S.optional(S.String),
  },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceName: S.String,
    resourceType: S.optional(S.String),
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class InvalidPolicyRevisionIdException extends S.TaggedError<InvalidPolicyRevisionIdException>()(
  "InvalidPolicyRevisionIdException",
  { message: S.String },
) {}
export class PolicyNotFoundException extends S.TaggedError<PolicyNotFoundException>()(
  "PolicyNotFoundException",
  { message: S.String },
) {}
export class MalformedPolicyDocumentException extends S.TaggedError<MalformedPolicyDocumentException>()(
  "MalformedPolicyDocumentException",
  { message: S.String },
) {}
export class PolicySizeLimitExceededException extends S.TaggedError<PolicySizeLimitExceededException>()(
  "PolicySizeLimitExceededException",
  { message: S.String },
) {}

//# Operations
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing app monitor. This immediately stops the collection of data.
 */
export const deleteAppMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppMonitorRequest,
  output: DeleteAppMonitorResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the list of metrics and dimensions that a RUM app monitor is sending to a single destination.
 */
export const batchGetRumMetricDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: BatchGetRumMetricDefinitionsRequest,
    output: BatchGetRumMetricDefinitionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "MetricDefinitions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns a list of destinations that you have created to receive RUM extended metrics, for the specified app monitor.
 *
 * For more information about extended metrics, see AddRumMetrics.
 */
export const listRumMetricsDestinations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRumMetricsDestinationsRequest,
    output: ListRumMetricsDestinationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Destinations",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Displays the tags associated with a CloudWatch RUM resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified CloudWatch RUM resource. Currently, the only resources that can be tagged app monitors.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters.
 *
 * You can use the `TagResource` action with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the alarm. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a resource.
 *
 * For more information, see Tagging Amazon Web Services resources.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a Amazon CloudWatch RUM app monitor, which collects telemetry data from your application and sends that data to RUM. The data includes performance and reliability information such as page load time, client-side errors, and user behavior.
 *
 * You use this operation only to create a new app monitor. To update an existing app monitor, use UpdateAppMonitor instead.
 *
 * After you create an app monitor, sign in to the CloudWatch RUM console to get the JavaScript code snippet to add to your web application. For more information, see How do I find a code snippet that I've already generated?
 */
export const createAppMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppMonitorRequest,
  output: CreateAppMonitorResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use this operation to retrieve information about a resource-based policy that is attached to an app monitor.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    PolicyNotFoundException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the Amazon CloudWatch RUM app monitors in the account.
 */
export const listAppMonitors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAppMonitorsRequest,
    output: ListAppMonitorsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AppMonitorSummaries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Removes the specified metrics from being sent to an extended metrics destination.
 *
 * If some metric definition IDs specified in a `BatchDeleteRumMetricDefinitions` operations are not valid, those metric definitions fail and return errors, but all valid metric definition IDs in the same operation are still deleted.
 *
 * The maximum number of metric definitions that you can specify in one `BatchDeleteRumMetricDefinitions` operation is 200.
 */
export const batchDeleteRumMetricDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDeleteRumMetricDefinitionsRequest,
    output: BatchDeleteRumMetricDefinitionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves the raw performance events that RUM has collected from your web application, so that you can do your own processing or analysis of this data.
 */
export const getAppMonitorData = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetAppMonitorDataRequest,
    output: GetAppMonitorDataResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
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
 * Sends telemetry events about your application performance and user behavior to CloudWatch RUM. The code snippet that RUM generates for you to add to your application includes `PutRumEvents` operations to send this data to RUM.
 *
 * Each `PutRumEvents` operation can send a batch of events from one user session.
 */
export const putRumEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRumEventsRequest,
  output: PutRumEventsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a destination for CloudWatch RUM extended metrics, so that the specified app monitor stops sending extended metrics to that destination.
 */
export const deleteRumMetricsDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRumMetricsDestinationRequest,
    output: DeleteRumMetricsDestinationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates or updates a destination to receive extended metrics from CloudWatch RUM. You can send extended metrics to CloudWatch or to a CloudWatch Evidently experiment.
 *
 * For more information about extended metrics, see BatchCreateRumMetricDefinitions.
 */
export const putRumMetricsDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutRumMetricsDestinationRequest,
    output: PutRumMetricsDestinationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the configuration of an existing app monitor. When you use this operation, only the parts of the app monitor configuration that you specify in this operation are changed. For any parameters that you omit, the existing values are kept.
 *
 * You can't use this operation to change the tags of an existing app monitor. To change the tags of an existing app monitor, use TagResource.
 *
 * To create a new app monitor, use CreateAppMonitor.
 *
 * After you update an app monitor, sign in to the CloudWatch RUM console to get the updated JavaScript code snippet to add to your web application. For more information, see How do I find a code snippet that I've already generated?
 */
export const updateAppMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppMonitorRequest,
  output: UpdateAppMonitorResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Modifies one existing metric definition for CloudWatch RUM extended metrics. For more information about extended metrics, see BatchCreateRumMetricsDefinitions.
 */
export const updateRumMetricDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRumMetricDefinitionRequest,
    output: UpdateRumMetricDefinitionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Removes the association of a resource-based policy from an app monitor.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      InvalidPolicyRevisionIdException,
      PolicyNotFoundException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the complete configuration information for one app monitor.
 */
export const getAppMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppMonitorRequest,
  output: GetAppMonitorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Specifies the extended metrics and custom metrics that you want a CloudWatch RUM app monitor to send to a destination. Valid destinations include CloudWatch and Evidently.
 *
 * By default, RUM app monitors send some metrics to CloudWatch. These default metrics are listed in CloudWatch metrics that you can collect with CloudWatch RUM.
 *
 * In addition to these default metrics, you can choose to send extended metrics, custom metrics, or both.
 *
 * - Extended metrics let you send metrics with additional dimensions that aren't included in the default metrics. You can also send extended metrics to both Evidently and CloudWatch. The valid dimension names for the additional dimensions for extended metrics are `BrowserName`, `CountryCode`, `DeviceType`, `FileType`, `OSName`, and `PageId`. For more information, see Extended metrics that you can send to CloudWatch and CloudWatch Evidently.
 *
 * - Custom metrics are metrics that you define. You can send custom metrics to CloudWatch. CloudWatch Evidently, or both. With custom metrics, you can use any metric name and namespace. To derive the metrics, you can use any custom events, built-in events, custom attributes, or default attributes.
 *
 * You can't send custom metrics to the `AWS/RUM` namespace. You must send custom metrics to a custom namespace that you define. The namespace that you use can't start with `AWS/`. CloudWatch RUM prepends `RUM/CustomMetrics/` to the custom namespace that you define, so the final namespace for your metrics in CloudWatch is `RUM/CustomMetrics/*your-custom-namespace* `.
 *
 * The maximum number of metric definitions that you can specify in one `BatchCreateRumMetricDefinitions` operation is 200.
 *
 * The maximum number of metric definitions that one destination can contain is 2000.
 *
 * Extended metrics sent to CloudWatch and RUM custom metrics are charged as CloudWatch custom metrics. Each combination of additional dimension name and dimension value counts as a custom metric. For more information, see Amazon CloudWatch Pricing.
 *
 * You must have already created a destination for the metrics before you send them. For more information, see PutRumMetricsDestination.
 *
 * If some metric definitions specified in a `BatchCreateRumMetricDefinitions` operations are not valid, those metric definitions fail and return errors, but all valid metric definitions in the same operation still succeed.
 */
export const batchCreateRumMetricDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchCreateRumMetricDefinitionsRequest,
    output: BatchCreateRumMetricDefinitionsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Use this operation to assign a resource-based policy to a CloudWatch RUM app monitor to control access to it. Each app monitor can have one resource-based policy. The maximum size of the policy is 4 KB. To learn more about using resource policies with RUM, see Using resource-based policies with CloudWatch RUM.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidPolicyRevisionIdException,
    MalformedPolicyDocumentException,
    PolicySizeLimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

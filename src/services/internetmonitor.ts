import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "InternetMonitor",
  serviceShapeName: "InternetMonitor20210603",
});
const auth = T.AwsAuthSigv4({ name: "internetmonitor" });
const ver = T.ServiceVersion("2021-06-03");
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
                        url: "https://internetmonitor-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://internetmonitor-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://internetmonitor.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://internetmonitor.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const SetOfARNs = S.Array(S.String);
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
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
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class GetInternetEventInput extends S.Class<GetInternetEventInput>(
  "GetInternetEventInput",
)(
  { EventId: S.String.pipe(T.HttpLabel("EventId")) },
  T.all(
    T.Http({ method: "GET", uri: "/v20210603/InternetEvents/{EventId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInternetEventsInput extends S.Class<ListInternetEventsInput>(
  "ListInternetEventsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(
      T.HttpQuery("InternetEventMaxResults"),
    ),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("StartTime"),
    ),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("EndTime"),
    ),
    EventStatus: S.optional(S.String).pipe(T.HttpQuery("EventStatus")),
    EventType: S.optional(S.String).pipe(T.HttpQuery("EventType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v20210603/InternetEvents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMonitorInput extends S.Class<GetMonitorInput>(
  "GetMonitorInput",
)(
  {
    MonitorName: S.String.pipe(T.HttpLabel("MonitorName")),
    LinkedAccountId: S.optional(S.String).pipe(T.HttpQuery("LinkedAccountId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v20210603/Monitors/{MonitorName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3Config extends S.Class<S3Config>("S3Config")({
  BucketName: S.optional(S.String),
  BucketPrefix: S.optional(S.String),
  LogDeliveryStatus: S.optional(S.String),
}) {}
export class InternetMeasurementsLogDelivery extends S.Class<InternetMeasurementsLogDelivery>(
  "InternetMeasurementsLogDelivery",
)({ S3Config: S.optional(S3Config) }) {}
export class LocalHealthEventsConfig extends S.Class<LocalHealthEventsConfig>(
  "LocalHealthEventsConfig",
)({
  Status: S.optional(S.String),
  HealthScoreThreshold: S.optional(S.Number),
  MinTrafficImpact: S.optional(S.Number),
}) {}
export class HealthEventsConfig extends S.Class<HealthEventsConfig>(
  "HealthEventsConfig",
)({
  AvailabilityScoreThreshold: S.optional(S.Number),
  PerformanceScoreThreshold: S.optional(S.Number),
  AvailabilityLocalHealthEventsConfig: S.optional(LocalHealthEventsConfig),
  PerformanceLocalHealthEventsConfig: S.optional(LocalHealthEventsConfig),
}) {}
export class UpdateMonitorInput extends S.Class<UpdateMonitorInput>(
  "UpdateMonitorInput",
)(
  {
    MonitorName: S.String.pipe(T.HttpLabel("MonitorName")),
    ResourcesToAdd: S.optional(SetOfARNs),
    ResourcesToRemove: S.optional(SetOfARNs),
    Status: S.optional(S.String),
    ClientToken: S.optional(S.String),
    MaxCityNetworksToMonitor: S.optional(S.Number),
    InternetMeasurementsLogDelivery: S.optional(
      InternetMeasurementsLogDelivery,
    ),
    TrafficPercentageToMonitor: S.optional(S.Number),
    HealthEventsConfig: S.optional(HealthEventsConfig),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/v20210603/Monitors/{MonitorName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMonitorInput extends S.Class<DeleteMonitorInput>(
  "DeleteMonitorInput",
)(
  { MonitorName: S.String.pipe(T.HttpLabel("MonitorName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/v20210603/Monitors/{MonitorName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMonitorOutput extends S.Class<DeleteMonitorOutput>(
  "DeleteMonitorOutput",
)({}) {}
export class ListMonitorsInput extends S.Class<ListMonitorsInput>(
  "ListMonitorsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    MonitorStatus: S.optional(S.String).pipe(T.HttpQuery("MonitorStatus")),
    IncludeLinkedAccounts: S.optional(S.Boolean).pipe(
      T.HttpQuery("IncludeLinkedAccounts"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v20210603/Monitors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueryResultsInput extends S.Class<GetQueryResultsInput>(
  "GetQueryResultsInput",
)(
  {
    MonitorName: S.String.pipe(T.HttpLabel("MonitorName")),
    QueryId: S.String.pipe(T.HttpLabel("QueryId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20210603/Monitors/{MonitorName}/Queries/{QueryId}/Results",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueryStatusInput extends S.Class<GetQueryStatusInput>(
  "GetQueryStatusInput",
)(
  {
    MonitorName: S.String.pipe(T.HttpLabel("MonitorName")),
    QueryId: S.String.pipe(T.HttpLabel("QueryId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20210603/Monitors/{MonitorName}/Queries/{QueryId}/Status",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopQueryInput extends S.Class<StopQueryInput>("StopQueryInput")(
  {
    MonitorName: S.String.pipe(T.HttpLabel("MonitorName")),
    QueryId: S.String.pipe(T.HttpLabel("QueryId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/v20210603/Monitors/{MonitorName}/Queries/{QueryId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopQueryOutput extends S.Class<StopQueryOutput>(
  "StopQueryOutput",
)({}) {}
export class GetHealthEventInput extends S.Class<GetHealthEventInput>(
  "GetHealthEventInput",
)(
  {
    MonitorName: S.String.pipe(T.HttpLabel("MonitorName")),
    EventId: S.String.pipe(T.HttpLabel("EventId")),
    LinkedAccountId: S.optional(S.String).pipe(T.HttpQuery("LinkedAccountId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20210603/Monitors/{MonitorName}/HealthEvents/{EventId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListHealthEventsInput extends S.Class<ListHealthEventsInput>(
  "ListHealthEventsInput",
)(
  {
    MonitorName: S.String.pipe(T.HttpLabel("MonitorName")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("StartTime"),
    ),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("EndTime"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    EventStatus: S.optional(S.String).pipe(T.HttpQuery("EventStatus")),
    LinkedAccountId: S.optional(S.String).pipe(T.HttpQuery("LinkedAccountId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v20210603/Monitors/{MonitorName}/HealthEvents",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FilterList = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export const QueryRow = S.Array(S.String);
export const QueryData = S.Array(QueryRow);
export class FilterParameter extends S.Class<FilterParameter>(
  "FilterParameter",
)({
  Field: S.optional(S.String),
  Operator: S.optional(S.String),
  Values: S.optional(FilterList),
}) {}
export const FilterParameters = S.Array(FilterParameter);
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: S.optional(TagMap) }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
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
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class GetMonitorOutput extends S.Class<GetMonitorOutput>(
  "GetMonitorOutput",
)({
  MonitorName: S.String,
  MonitorArn: S.String,
  Resources: SetOfARNs,
  Status: S.String,
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  ModifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  ProcessingStatus: S.optional(S.String),
  ProcessingStatusInfo: S.optional(S.String),
  Tags: S.optional(TagMap),
  MaxCityNetworksToMonitor: S.optional(S.Number),
  InternetMeasurementsLogDelivery: S.optional(InternetMeasurementsLogDelivery),
  TrafficPercentageToMonitor: S.optional(S.Number),
  HealthEventsConfig: S.optional(HealthEventsConfig),
}) {}
export class UpdateMonitorOutput extends S.Class<UpdateMonitorOutput>(
  "UpdateMonitorOutput",
)({ MonitorArn: S.String, Status: S.String }) {}
export class GetQueryStatusOutput extends S.Class<GetQueryStatusOutput>(
  "GetQueryStatusOutput",
)({ Status: S.String }) {}
export class StartQueryInput extends S.Class<StartQueryInput>(
  "StartQueryInput",
)(
  {
    MonitorName: S.String.pipe(T.HttpLabel("MonitorName")),
    StartTime: S.Date.pipe(T.TimestampFormat("date-time")),
    EndTime: S.Date.pipe(T.TimestampFormat("date-time")),
    QueryType: S.String,
    FilterParameters: S.optional(FilterParameters),
    LinkedAccountId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/v20210603/Monitors/{MonitorName}/Queries",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Ipv4PrefixList = S.Array(S.String);
export class ClientLocation extends S.Class<ClientLocation>("ClientLocation")({
  ASName: S.String,
  ASNumber: S.Number,
  Country: S.String,
  Subdivision: S.optional(S.String),
  Metro: S.optional(S.String),
  City: S.String,
  Latitude: S.Number,
  Longitude: S.Number,
}) {}
export class InternetEventSummary extends S.Class<InternetEventSummary>(
  "InternetEventSummary",
)({
  EventId: S.String,
  EventArn: S.String,
  StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ClientLocation: ClientLocation,
  EventType: S.String,
  EventStatus: S.String,
}) {}
export const InternetEventsList = S.Array(InternetEventSummary);
export class Monitor extends S.Class<Monitor>("Monitor")({
  MonitorName: S.String,
  MonitorArn: S.String,
  Status: S.String,
  ProcessingStatus: S.optional(S.String),
}) {}
export const MonitorList = S.Array(Monitor);
export class QueryField extends S.Class<QueryField>("QueryField")({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const QueryFields = S.Array(QueryField);
export class Network extends S.Class<Network>("Network")({
  ASName: S.String,
  ASNumber: S.Number,
}) {}
export const NetworkList = S.Array(Network);
export class NetworkImpairment extends S.Class<NetworkImpairment>(
  "NetworkImpairment",
)({ Networks: NetworkList, AsPath: NetworkList, NetworkEventType: S.String }) {}
export class AvailabilityMeasurement extends S.Class<AvailabilityMeasurement>(
  "AvailabilityMeasurement",
)({
  ExperienceScore: S.optional(S.Number),
  PercentOfTotalTrafficImpacted: S.optional(S.Number),
  PercentOfClientLocationImpacted: S.optional(S.Number),
}) {}
export class RoundTripTime extends S.Class<RoundTripTime>("RoundTripTime")({
  P50: S.optional(S.Number),
  P90: S.optional(S.Number),
  P95: S.optional(S.Number),
}) {}
export class PerformanceMeasurement extends S.Class<PerformanceMeasurement>(
  "PerformanceMeasurement",
)({
  ExperienceScore: S.optional(S.Number),
  PercentOfTotalTrafficImpacted: S.optional(S.Number),
  PercentOfClientLocationImpacted: S.optional(S.Number),
  RoundTripTime: S.optional(RoundTripTime),
}) {}
export class InternetHealth extends S.Class<InternetHealth>("InternetHealth")({
  Availability: S.optional(AvailabilityMeasurement),
  Performance: S.optional(PerformanceMeasurement),
}) {}
export class ImpactedLocation extends S.Class<ImpactedLocation>(
  "ImpactedLocation",
)({
  ASName: S.String,
  ASNumber: S.Number,
  Country: S.String,
  Subdivision: S.optional(S.String),
  Metro: S.optional(S.String),
  City: S.optional(S.String),
  Latitude: S.optional(S.Number),
  Longitude: S.optional(S.Number),
  CountryCode: S.optional(S.String),
  SubdivisionCode: S.optional(S.String),
  ServiceLocation: S.optional(S.String),
  Status: S.String,
  CausedBy: S.optional(NetworkImpairment),
  InternetHealth: S.optional(InternetHealth),
  Ipv4Prefixes: S.optional(Ipv4PrefixList),
}) {}
export const ImpactedLocationsList = S.Array(ImpactedLocation);
export class HealthEvent extends S.Class<HealthEvent>("HealthEvent")({
  EventArn: S.String,
  EventId: S.String,
  StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  ImpactedLocations: ImpactedLocationsList,
  Status: S.String,
  PercentOfTotalTrafficImpacted: S.optional(S.Number),
  ImpactType: S.String,
  HealthScoreThreshold: S.optional(S.Number),
}) {}
export const HealthEventList = S.Array(HealthEvent);
export class GetInternetEventOutput extends S.Class<GetInternetEventOutput>(
  "GetInternetEventOutput",
)({
  EventId: S.String,
  EventArn: S.String,
  StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ClientLocation: ClientLocation,
  EventType: S.String,
  EventStatus: S.String,
}) {}
export class ListInternetEventsOutput extends S.Class<ListInternetEventsOutput>(
  "ListInternetEventsOutput",
)({ InternetEvents: InternetEventsList, NextToken: S.optional(S.String) }) {}
export class CreateMonitorInput extends S.Class<CreateMonitorInput>(
  "CreateMonitorInput",
)(
  {
    MonitorName: S.String,
    Resources: S.optional(SetOfARNs),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagMap),
    MaxCityNetworksToMonitor: S.optional(S.Number),
    InternetMeasurementsLogDelivery: S.optional(
      InternetMeasurementsLogDelivery,
    ),
    TrafficPercentageToMonitor: S.optional(S.Number),
    HealthEventsConfig: S.optional(HealthEventsConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v20210603/Monitors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMonitorsOutput extends S.Class<ListMonitorsOutput>(
  "ListMonitorsOutput",
)({ Monitors: MonitorList, NextToken: S.optional(S.String) }) {}
export class GetQueryResultsOutput extends S.Class<GetQueryResultsOutput>(
  "GetQueryResultsOutput",
)({ Fields: QueryFields, Data: QueryData, NextToken: S.optional(S.String) }) {}
export class StartQueryOutput extends S.Class<StartQueryOutput>(
  "StartQueryOutput",
)({ QueryId: S.String }) {}
export class ListHealthEventsOutput extends S.Class<ListHealthEventsOutput>(
  "ListHealthEventsOutput",
)({ HealthEvents: HealthEventList, NextToken: S.optional(S.String) }) {}
export class CreateMonitorOutput extends S.Class<CreateMonitorOutput>(
  "CreateMonitorOutput",
)({ Arn: S.String, Status: S.String }) {}
export class GetHealthEventOutput extends S.Class<GetHealthEventOutput>(
  "GetHealthEventOutput",
)({
  EventArn: S.String,
  EventId: S.String,
  StartedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  EndedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  ImpactedLocations: ImpactedLocationsList,
  Status: S.String,
  PercentOfTotalTrafficImpacted: S.optional(S.Number),
  ImpactType: S.String,
  HealthScoreThreshold: S.optional(S.Number),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Gets information about a monitor in Amazon CloudWatch Internet Monitor based on a monitor name. The information returned includes the Amazon Resource Name (ARN), create time,
 * modified time, resources included in the monitor, and status information.
 */
export const getMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMonitorInput,
  output: GetMonitorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Return the data for a query with the Amazon CloudWatch Internet Monitor query interface. Specify the query that you want to return results for by providing
 * a `QueryId` and a monitor name.
 *
 * For more information about using the query interface, including examples, see
 * Using the Amazon CloudWatch Internet Monitor query interface
 * in the Amazon CloudWatch Internet Monitor User Guide.
 */
export const getQueryResults = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetQueryResultsInput,
    output: GetQueryResultsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      LimitExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all of your monitors for Amazon CloudWatch Internet Monitor and their statuses, along with the Amazon Resource Name (ARN) and name of each monitor.
 */
export const listMonitors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMonitorsInput,
    output: ListMonitorsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Monitors",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all health events for a monitor in Amazon CloudWatch Internet Monitor. Returns information for health events including the event start and end times, and
 * the status.
 *
 * Health events that have start times during the time frame that is requested are not included in the list of health events.
 */
export const listHealthEvents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListHealthEventsInput,
    output: ListHealthEventsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "HealthEvents",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Deletes a monitor in Amazon CloudWatch Internet Monitor.
 */
export const deleteMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMonitorInput,
  output: DeleteMonitorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information that Amazon CloudWatch Internet Monitor has generated about an internet event. Internet Monitor displays information about
 * recent global health events, called internet events, on a global outages map that is available to all Amazon Web Services
 * customers.
 *
 * The information returned here includes the impacted location,
 * when the event started and (if the event is over) ended, the type of event (`PERFORMANCE` or `AVAILABILITY`),
 * and the status (`ACTIVE` or `RESOLVED`).
 */
export const getInternetEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInternetEventInput,
  output: GetInternetEventOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists internet events that cause performance or availability issues for client locations. Amazon CloudWatch Internet Monitor displays information about
 * recent global health events, called internet events, on a global outages map that is available to all Amazon Web Services
 * customers.
 *
 * You can constrain the list of internet events returned by providing a start time and end time to define a total
 * time frame for events you want to list. Both start time and end time specify the time when an event started. End time
 * is optional. If you don't include it, the default end time is the current time.
 *
 * You can also limit the events returned to a specific status
 * (`ACTIVE` or `RESOLVED`) or type (`PERFORMANCE` or `AVAILABILITY`).
 */
export const listInternetEvents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListInternetEventsInput,
    output: ListInternetEventsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "InternetEvents",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Start a query to return data for a specific query type for the Amazon CloudWatch Internet Monitor query interface. Specify a time period
 * for the data that you want returned by using `StartTime` and `EndTime`. You filter the query
 * results to return by providing parameters that you specify with `FilterParameters`.
 *
 * For more information about using the query interface, including examples, see
 * Using the Amazon CloudWatch Internet Monitor query interface
 * in the Amazon CloudWatch Internet Monitor User Guide.
 */
export const startQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartQueryInput,
  output: StartQueryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the current status of a query for the Amazon CloudWatch Internet Monitor query interface, for a specified query ID and monitor.
 * When you run a query, check the status to make sure that the query has `SUCCEEDED` before you review the results.
 *
 * - `QUEUED`: The query is scheduled to run.
 *
 * - `RUNNING`: The query is in progress but not complete.
 *
 * - `SUCCEEDED`: The query completed sucessfully.
 *
 * - `FAILED`: The query failed due to an error.
 *
 * - `CANCELED`: The query was canceled.
 */
export const getQueryStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueryStatusInput,
  output: GetQueryStatusOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stop a query that is progress for a specific monitor.
 */
export const stopQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopQueryInput,
  output: StopQueryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a monitor in Amazon CloudWatch Internet Monitor. A monitor is built based on information from the application resources that you add: VPCs,
 * Network Load Balancers (NLBs), Amazon CloudFront distributions, and Amazon WorkSpaces directories. Internet Monitor then publishes internet measurements from Amazon Web Services
 * that are specific to the *city-networks*. That is, the locations and ASNs (typically internet service providers or ISPs),
 * where clients access your application. For more information, see Using Amazon CloudWatch Internet Monitor in the Amazon CloudWatch User
 * Guide.
 *
 * When you create a monitor, you choose the percentage of traffic that you want to monitor. You can also set a maximum limit for the
 * number of city-networks where client traffic is monitored, that caps the total traffic that Internet Monitor monitors. A city-network
 * maximum is the limit of city-networks, but you only pay for the number of city-networks that are actually monitored. You can update your monitor
 * at any time to change the percentage of traffic to monitor or the city-networks maximum. For more information, see Choosing a city-network maximum value in the *Amazon CloudWatch User Guide*.
 */
export const createMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMonitorInput,
  output: CreateMonitorOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    LimitExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a monitor. You can update a monitor to change the percentage of traffic to monitor or the maximum number of city-networks
 * (locations and ASNs), to add or remove resources, or to change the status of the monitor. Note that you can't change the name of a monitor.
 *
 * The city-network maximum that you choose is the limit, but you only pay for the number of city-networks that are actually monitored.
 * For more information, see Choosing a city-network maximum value in the *Amazon CloudWatch User Guide*.
 */
export const updateMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMonitorInput,
  output: UpdateMonitorOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets information that Amazon CloudWatch Internet Monitor has created and stored about a health event for a specified monitor. This information includes the impacted locations,
 * and all the information related to the event, by location.
 *
 * The information returned includes the impact on performance, availability, and round-trip time, information about the network providers (ASNs),
 * the event type, and so on.
 *
 * Information rolled up at the global traffic level is also returned, including the impact type and total traffic impact.
 */
export const getHealthEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHealthEventInput,
  output: GetHealthEventOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags for a resource. Tags are supported only for monitors in Amazon CloudWatch Internet Monitor.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds a tag to a resource. Tags are supported only for monitors in Amazon CloudWatch Internet Monitor. You can add a maximum of 50 tags in Internet Monitor.
 *
 * A minimum of one tag is required for this call. It returns an error if you use the `TagResource` request with 0 tags.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));

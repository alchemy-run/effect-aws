import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "GameLiftStreams",
  serviceShapeName: "GameLiftStreams",
});
const auth = T.AwsAuthSigv4({ name: "gameliftstreams" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      rules: [
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
                  ],
                  endpoint: {
                    url: "https://gameliftstreams-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://gameliftstreams.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const Identifiers = S.Array(S.String);
export const LocationsList = S.Array(S.String);
export const LocationList = S.Array(S.String);
export const GameLaunchArgList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const FilePaths = S.Array(S.String);
export class AssociateApplicationsInput extends S.Class<AssociateApplicationsInput>(
  "AssociateApplicationsInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    ApplicationIdentifiers: Identifiers,
  },
  T.all(
    T.Http({ method: "POST", uri: "/streamgroups/{Identifier}/associations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateStreamSessionConnectionInput extends S.Class<CreateStreamSessionConnectionInput>(
  "CreateStreamSessionConnectionInput",
)(
  {
    ClientToken: S.optional(S.String),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    StreamSessionIdentifier: S.String.pipe(
      T.HttpLabel("StreamSessionIdentifier"),
    ),
    SignalRequest: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/streamgroups/{Identifier}/streamsessions/{StreamSessionIdentifier}/connections",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateApplicationsInput extends S.Class<DisassociateApplicationsInput>(
  "DisassociateApplicationsInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    ApplicationIdentifiers: Identifiers,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/streamgroups/{Identifier}/disassociations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportStreamSessionFilesInput extends S.Class<ExportStreamSessionFilesInput>(
  "ExportStreamSessionFilesInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    StreamSessionIdentifier: S.String.pipe(
      T.HttpLabel("StreamSessionIdentifier"),
    ),
    OutputUri: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/streamgroups/{Identifier}/streamsessions/{StreamSessionIdentifier}/exportfiles",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExportStreamSessionFilesOutput extends S.Class<ExportStreamSessionFilesOutput>(
  "ExportStreamSessionFilesOutput",
)({}) {}
export class GetStreamSessionInput extends S.Class<GetStreamSessionInput>(
  "GetStreamSessionInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    StreamSessionIdentifier: S.String.pipe(
      T.HttpLabel("StreamSessionIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/streamgroups/{Identifier}/streamsessions/{StreamSessionIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStreamSessionsInput extends S.Class<ListStreamSessionsInput>(
  "ListStreamSessionsInput",
)(
  {
    Status: S.optional(S.String).pipe(T.HttpQuery("Status")),
    ExportFilesStatus: S.optional(S.String).pipe(
      T.HttpQuery("ExportFilesStatus"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/streamgroups/{Identifier}/streamsessions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStreamSessionsByAccountInput extends S.Class<ListStreamSessionsByAccountInput>(
  "ListStreamSessionsByAccountInput",
)(
  {
    Status: S.optional(S.String).pipe(T.HttpQuery("Status")),
    ExportFilesStatus: S.optional(S.String).pipe(
      T.HttpQuery("ExportFilesStatus"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/streamsessions" }),
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
export class RemoveStreamGroupLocationsInput extends S.Class<RemoveStreamGroupLocationsInput>(
  "RemoveStreamGroupLocationsInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Locations: LocationsList.pipe(T.HttpQuery("locations")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/streamgroups/{Identifier}/locations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveStreamGroupLocationsResponse extends S.Class<RemoveStreamGroupLocationsResponse>(
  "RemoveStreamGroupLocationsResponse",
)({}) {}
export class TerminateStreamSessionInput extends S.Class<TerminateStreamSessionInput>(
  "TerminateStreamSessionInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    StreamSessionIdentifier: S.String.pipe(
      T.HttpLabel("StreamSessionIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/streamgroups/{Identifier}/streamsessions/{StreamSessionIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TerminateStreamSessionResponse extends S.Class<TerminateStreamSessionResponse>(
  "TerminateStreamSessionResponse",
)({}) {}
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
export class GetApplicationInput extends S.Class<GetApplicationInput>(
  "GetApplicationInput",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApplicationInput extends S.Class<UpdateApplicationInput>(
  "UpdateApplicationInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Description: S.optional(S.String),
    ApplicationLogPaths: S.optional(FilePaths),
    ApplicationLogOutputUri: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/applications/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationInput extends S.Class<DeleteApplicationInput>(
  "DeleteApplicationInput",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/applications/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({}) {}
export class ListApplicationsInput extends S.Class<ListApplicationsInput>(
  "ListApplicationsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LocationConfiguration extends S.Class<LocationConfiguration>(
  "LocationConfiguration",
)({
  LocationName: S.String,
  AlwaysOnCapacity: S.optional(S.Number),
  OnDemandCapacity: S.optional(S.Number),
  TargetIdleCapacity: S.optional(S.Number),
  MaximumCapacity: S.optional(S.Number),
}) {}
export const LocationConfigurations = S.Array(LocationConfiguration);
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateStreamGroupInput extends S.Class<CreateStreamGroupInput>(
  "CreateStreamGroupInput",
)(
  {
    Description: S.String,
    StreamClass: S.String,
    DefaultApplicationIdentifier: S.optional(S.String),
    LocationConfigurations: S.optional(LocationConfigurations),
    Tags: S.optional(Tags),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/streamgroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStreamGroupInput extends S.Class<GetStreamGroupInput>(
  "GetStreamGroupInput",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/streamgroups/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateStreamGroupInput extends S.Class<UpdateStreamGroupInput>(
  "UpdateStreamGroupInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    LocationConfigurations: S.optional(LocationConfigurations),
    Description: S.optional(S.String),
    DefaultApplicationIdentifier: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/streamgroups/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteStreamGroupInput extends S.Class<DeleteStreamGroupInput>(
  "DeleteStreamGroupInput",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/streamgroups/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteStreamGroupResponse extends S.Class<DeleteStreamGroupResponse>(
  "DeleteStreamGroupResponse",
)({}) {}
export class ListStreamGroupsInput extends S.Class<ListStreamGroupsInput>(
  "ListStreamGroupsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/streamgroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ArnList = S.Array(S.String);
export const EnvironmentVariables = S.Record({
  key: S.String,
  value: S.String,
});
export class PerformanceStatsConfiguration extends S.Class<PerformanceStatsConfiguration>(
  "PerformanceStatsConfiguration",
)({ SharedWithClient: S.optional(S.Boolean) }) {}
export class RuntimeEnvironment extends S.Class<RuntimeEnvironment>(
  "RuntimeEnvironment",
)({ Type: S.String, Version: S.String }) {}
export class AddStreamGroupLocationsInput extends S.Class<AddStreamGroupLocationsInput>(
  "AddStreamGroupLocationsInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    LocationConfigurations: LocationConfigurations,
  },
  T.all(
    T.Http({ method: "POST", uri: "/streamgroups/{Identifier}/locations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateApplicationsOutput extends S.Class<AssociateApplicationsOutput>(
  "AssociateApplicationsOutput",
)({ Arn: S.optional(S.String), ApplicationArns: S.optional(ArnList) }) {}
export class CreateStreamSessionConnectionOutput extends S.Class<CreateStreamSessionConnectionOutput>(
  "CreateStreamSessionConnectionOutput",
)({ SignalResponse: S.optional(S.String) }) {}
export class DisassociateApplicationsOutput extends S.Class<DisassociateApplicationsOutput>(
  "DisassociateApplicationsOutput",
)({ Arn: S.optional(S.String), ApplicationArns: S.optional(ArnList) }) {}
export class ExportFilesMetadata extends S.Class<ExportFilesMetadata>(
  "ExportFilesMetadata",
)({
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  OutputUri: S.optional(S.String),
}) {}
export class StreamSessionSummary extends S.Class<StreamSessionSummary>(
  "StreamSessionSummary",
)({
  Arn: S.optional(S.String),
  UserId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  Protocol: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ApplicationArn: S.optional(S.String),
  ExportFilesMetadata: S.optional(ExportFilesMetadata),
  Location: S.optional(S.String),
}) {}
export const StreamSessionSummaryList = S.Array(StreamSessionSummary);
export class ListStreamSessionsByAccountOutput extends S.Class<ListStreamSessionsByAccountOutput>(
  "ListStreamSessionsByAccountOutput",
)({
  Items: S.optional(StreamSessionSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags) }) {}
export class StartStreamSessionInput extends S.Class<StartStreamSessionInput>(
  "StartStreamSessionInput",
)(
  {
    ClientToken: S.optional(S.String),
    Description: S.optional(S.String),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Protocol: S.String,
    SignalRequest: S.String,
    ApplicationIdentifier: S.String,
    UserId: S.optional(S.String),
    Locations: S.optional(LocationList),
    ConnectionTimeoutSeconds: S.optional(S.Number),
    SessionLengthSeconds: S.optional(S.Number),
    AdditionalLaunchArgs: S.optional(GameLaunchArgList),
    AdditionalEnvironmentVariables: S.optional(EnvironmentVariables),
    PerformanceStatsConfiguration: S.optional(PerformanceStatsConfiguration),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/streamgroups/{Identifier}/streamsessions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: Tags },
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
export class CreateApplicationInput extends S.Class<CreateApplicationInput>(
  "CreateApplicationInput",
)(
  {
    Description: S.String,
    RuntimeEnvironment: RuntimeEnvironment,
    ExecutablePath: S.String,
    ApplicationSourceUri: S.String,
    ApplicationLogPaths: S.optional(FilePaths),
    ApplicationLogOutputUri: S.optional(S.String),
    Tags: S.optional(Tags),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReplicationStatus extends S.Class<ReplicationStatus>(
  "ReplicationStatus",
)({ Location: S.optional(S.String), Status: S.optional(S.String) }) {}
export const ReplicationStatuses = S.Array(ReplicationStatus);
export class UpdateApplicationOutput extends S.Class<UpdateApplicationOutput>(
  "UpdateApplicationOutput",
)({
  Arn: S.String,
  Description: S.optional(S.String),
  RuntimeEnvironment: S.optional(RuntimeEnvironment),
  ExecutablePath: S.optional(S.String),
  ApplicationLogPaths: S.optional(FilePaths),
  ApplicationLogOutputUri: S.optional(S.String),
  ApplicationSourceUri: S.optional(S.String),
  Id: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  ReplicationStatuses: S.optional(ReplicationStatuses),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AssociatedStreamGroups: S.optional(ArnList),
}) {}
export class DefaultApplication extends S.Class<DefaultApplication>(
  "DefaultApplication",
)({ Id: S.optional(S.String), Arn: S.optional(S.String) }) {}
export class LocationState extends S.Class<LocationState>("LocationState")({
  LocationName: S.optional(S.String),
  Status: S.optional(S.String),
  AlwaysOnCapacity: S.optional(S.Number),
  OnDemandCapacity: S.optional(S.Number),
  TargetIdleCapacity: S.optional(S.Number),
  MaximumCapacity: S.optional(S.Number),
  RequestedCapacity: S.optional(S.Number),
  AllocatedCapacity: S.optional(S.Number),
  IdleCapacity: S.optional(S.Number),
}) {}
export const LocationStates = S.Array(LocationState);
export class GetStreamGroupOutput extends S.Class<GetStreamGroupOutput>(
  "GetStreamGroupOutput",
)({
  Arn: S.String,
  Description: S.optional(S.String),
  DefaultApplication: S.optional(DefaultApplication),
  LocationStates: S.optional(LocationStates),
  StreamClass: S.optional(S.String),
  Id: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AssociatedApplications: S.optional(ArnList),
}) {}
export class UpdateStreamGroupOutput extends S.Class<UpdateStreamGroupOutput>(
  "UpdateStreamGroupOutput",
)({
  Arn: S.String,
  Description: S.optional(S.String),
  DefaultApplication: S.optional(DefaultApplication),
  LocationStates: S.optional(LocationStates),
  StreamClass: S.optional(S.String),
  Id: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AssociatedApplications: S.optional(ArnList),
}) {}
export class ApplicationSummary extends S.Class<ApplicationSummary>(
  "ApplicationSummary",
)({
  Arn: S.String,
  Id: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RuntimeEnvironment: S.optional(RuntimeEnvironment),
}) {}
export const ApplicationSummaryList = S.Array(ApplicationSummary);
export class StreamGroupSummary extends S.Class<StreamGroupSummary>(
  "StreamGroupSummary",
)({
  Arn: S.String,
  Id: S.optional(S.String),
  Description: S.optional(S.String),
  DefaultApplication: S.optional(DefaultApplication),
  StreamClass: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const StreamGroupSummaryList = S.Array(StreamGroupSummary);
export class AddStreamGroupLocationsOutput extends S.Class<AddStreamGroupLocationsOutput>(
  "AddStreamGroupLocationsOutput",
)({ Identifier: S.String, Locations: LocationStates }) {}
export class GetStreamSessionOutput extends S.Class<GetStreamSessionOutput>(
  "GetStreamSessionOutput",
)({
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  StreamGroupId: S.optional(S.String),
  UserId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  Protocol: S.optional(S.String),
  Location: S.optional(S.String),
  SignalRequest: S.optional(S.String),
  SignalResponse: S.optional(S.String),
  ConnectionTimeoutSeconds: S.optional(S.Number),
  SessionLengthSeconds: S.optional(S.Number),
  AdditionalLaunchArgs: S.optional(GameLaunchArgList),
  AdditionalEnvironmentVariables: S.optional(EnvironmentVariables),
  PerformanceStatsConfiguration: S.optional(PerformanceStatsConfiguration),
  LogFileLocationUri: S.optional(S.String),
  WebSdkProtocolUrl: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ApplicationArn: S.optional(S.String),
  ExportFilesMetadata: S.optional(ExportFilesMetadata),
}) {}
export class ListStreamSessionsOutput extends S.Class<ListStreamSessionsOutput>(
  "ListStreamSessionsOutput",
)({
  Items: S.optional(StreamSessionSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class StartStreamSessionOutput extends S.Class<StartStreamSessionOutput>(
  "StartStreamSessionOutput",
)({
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  StreamGroupId: S.optional(S.String),
  UserId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  Protocol: S.optional(S.String),
  Location: S.optional(S.String),
  SignalRequest: S.optional(S.String),
  SignalResponse: S.optional(S.String),
  ConnectionTimeoutSeconds: S.optional(S.Number),
  SessionLengthSeconds: S.optional(S.Number),
  AdditionalLaunchArgs: S.optional(GameLaunchArgList),
  AdditionalEnvironmentVariables: S.optional(EnvironmentVariables),
  PerformanceStatsConfiguration: S.optional(PerformanceStatsConfiguration),
  LogFileLocationUri: S.optional(S.String),
  WebSdkProtocolUrl: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ApplicationArn: S.optional(S.String),
  ExportFilesMetadata: S.optional(ExportFilesMetadata),
}) {}
export class CreateApplicationOutput extends S.Class<CreateApplicationOutput>(
  "CreateApplicationOutput",
)({
  Arn: S.String,
  Description: S.optional(S.String),
  RuntimeEnvironment: S.optional(RuntimeEnvironment),
  ExecutablePath: S.optional(S.String),
  ApplicationLogPaths: S.optional(FilePaths),
  ApplicationLogOutputUri: S.optional(S.String),
  ApplicationSourceUri: S.optional(S.String),
  Id: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  ReplicationStatuses: S.optional(ReplicationStatuses),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AssociatedStreamGroups: S.optional(ArnList),
}) {}
export class GetApplicationOutput extends S.Class<GetApplicationOutput>(
  "GetApplicationOutput",
)({
  Arn: S.String,
  Description: S.optional(S.String),
  RuntimeEnvironment: S.optional(RuntimeEnvironment),
  ExecutablePath: S.optional(S.String),
  ApplicationLogPaths: S.optional(FilePaths),
  ApplicationLogOutputUri: S.optional(S.String),
  ApplicationSourceUri: S.optional(S.String),
  Id: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  ReplicationStatuses: S.optional(ReplicationStatuses),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AssociatedStreamGroups: S.optional(ArnList),
}) {}
export class ListApplicationsOutput extends S.Class<ListApplicationsOutput>(
  "ListApplicationsOutput",
)({
  Items: S.optional(ApplicationSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class CreateStreamGroupOutput extends S.Class<CreateStreamGroupOutput>(
  "CreateStreamGroupOutput",
)({
  Arn: S.String,
  Description: S.optional(S.String),
  DefaultApplication: S.optional(DefaultApplication),
  LocationStates: S.optional(LocationStates),
  StreamClass: S.optional(S.String),
  Id: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExpiresAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AssociatedApplications: S.optional(ArnList),
}) {}
export class ListStreamGroupsOutput extends S.Class<ListStreamGroupsOutput>(
  "ListStreamGroupsOutput",
)({
  Items: S.optional(StreamGroupSummaryList),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
) {}

//# Operations
/**
 * Retrieves a list of all Amazon GameLift Streams applications that are associated with the Amazon Web Services account in use. This operation returns applications in all statuses, in no particular order. You can paginate the results as needed.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListApplicationsInput,
    output: ListApplicationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves properties for a Amazon GameLift Streams stream session resource. Specify the Amazon Resource Name (ARN) of the stream session that you want to retrieve and its stream group ARN. If the operation is successful, it returns properties for the requested resource.
 */
export const getStreamSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStreamSessionInput,
  output: GetStreamSessionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of Amazon GameLift Streams stream sessions that a stream group is hosting.
 *
 * To retrieve stream sessions, specify the stream group, and optionally filter by stream session status. You can paginate the results as needed.
 *
 * This operation returns the requested stream sessions in no particular order.
 */
export const listStreamSessions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListStreamSessionsInput,
    output: ListStreamSessionsOutput,
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
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves properties for an Amazon GameLift Streams application resource. Specify the ID of the application that you want to retrieve. If the operation is successful, it returns properties for the requested application.
 */
export const getApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationInput,
  output: GetApplicationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the mutable configuration settings for a Amazon GameLift Streams application resource. You can change the `Description`, `ApplicationLogOutputUri`, and `ApplicationLogPaths`.
 *
 * To update application settings, specify the application ID and provide the new values. If the operation is successful, it returns the complete updated set of settings for the application.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationInput,
  output: UpdateApplicationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves properties for a Amazon GameLift Streams stream group resource. Specify the ID of the stream group that you want to retrieve. If the operation is successful, it returns properties for the requested stream group.
 */
export const getStreamGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStreamGroupInput,
  output: GetStreamGroupOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a set of remote locations from this stream group. To remove a location, the stream group must be in `ACTIVE` status. When you remove a location, Amazon GameLift Streams releases allocated compute resources in that location. Stream sessions can no longer start from removed locations in a stream group. Amazon GameLift Streams also deletes the content files of all associated applications that were in Amazon GameLift Streams's internal Amazon S3 bucket at this location.
 *
 * You cannot remove the Amazon Web Services Region location where you initially created this stream group, known as the primary location. However, you can set the stream capacity to zero to avoid incurring costs for allocated compute resources in that location.
 */
export const removeStreamGroupLocations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveStreamGroupLocationsInput,
    output: RemoveStreamGroupLocationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Permanently terminates an active stream session. When called, the stream session status changes to `TERMINATING`. You can terminate a stream session in any status except `ACTIVATING`. If the stream session is in `ACTIVATING` status, an exception is thrown.
 */
export const terminateStreamSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TerminateStreamSessionInput,
    output: TerminateStreamSessionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * When you disassociate, or unlink, an application from a stream group, you can no longer stream this application by using that stream group's allocated compute resources. Any streams in process will continue until they terminate, which helps avoid interrupting an end-user's stream. Amazon GameLift Streams will not initiate new streams in the stream group using the disassociated application. The disassociate action does not affect the stream capacity of a stream group. To disassociate an application, the stream group must be in `ACTIVE` status.
 *
 * If you disassociate the default application, Amazon GameLift Streams will automatically choose a new default application from the remaining associated applications. To change which application is the default application, call UpdateStreamGroup and specify a new `DefaultApplicationIdentifier`.
 */
export const disassociateApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateApplicationsInput,
    output: DisassociateApplicationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Permanently deletes an Amazon GameLift Streams application resource. This also deletes the application content files stored with Amazon GameLift Streams. However, this does not delete the original files that you uploaded to your Amazon S3 bucket; you can delete these any time after Amazon GameLift Streams creates an application, which is the only time Amazon GameLift Streams accesses your Amazon S3 bucket.
 *
 * You can only delete an application that meets the following conditions:
 *
 * - The application is in `READY` or `ERROR` status. You cannot delete an application that's in `PROCESSING` or `INITIALIZED` status.
 *
 * - The application is not the default application of any stream groups. You must first delete the stream group by using DeleteStreamGroup.
 *
 * - The application is not linked to any stream groups. You must first unlink the stream group by using DisassociateApplications.
 *
 * - An application is not streaming in any ongoing stream session. You must wait until the client ends the stream session or call TerminateStreamSession to end the stream.
 *
 * If any active stream groups exist for this application, this request returns a `ValidationException`.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationInput,
  output: DeleteApplicationResponse,
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
 * Permanently deletes all compute resources and information related to a stream group. To delete a stream group, specify the unique stream group identifier. During the deletion process, the stream group's status is `DELETING`. This operation stops streams in progress and prevents new streams from starting. As a best practice, before deleting the stream group, call ListStreamSessions to check for streams in progress and take action to stop them. When you delete a stream group, any application associations referring to that stream group are automatically removed.
 */
export const deleteStreamGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStreamGroupInput,
  output: DeleteStreamGroupResponse,
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
 * Enables clients to reconnect to a stream session while preserving all session state and data in the disconnected session. This reconnection process can be initiated when a stream session is in either `PENDING_CLIENT_RECONNECTION` or `ACTIVE` status. The process works as follows:
 *
 * - Initial disconnect:
 *
 * - When a client disconnects or loses connection, the stream session transitions from `CONNECTED` to `PENDING_CLIENT_RECONNECTION`
 *
 * - Reconnection time window:
 *
 * - Clients have `ConnectionTimeoutSeconds` (defined in StartStreamSession) to reconnect before session termination
 *
 * - Your backend server must call **CreateStreamSessionConnection** to initiate reconnection
 *
 * - Session transitions to `RECONNECTING` status
 *
 * - Reconnection completion:
 *
 * - On successful **CreateStreamSessionConnection**, session status changes to `ACTIVE`
 *
 * - Provide the new connection information to the requesting client
 *
 * - Client must establish connection within `ConnectionTimeoutSeconds`
 *
 * - Session terminates automatically if client fails to connect in time
 *
 * For more information about the stream session lifecycle, see Stream sessions in the *Amazon GameLift Streams Developer Guide*.
 *
 * To begin re-connecting to an existing stream session, specify the stream group ID and stream session ID that you want to reconnect to, and the signal request to use with the stream.
 */
export const createStreamSessionConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateStreamSessionConnectionInput,
    output: CreateStreamSessionConnectionOutput,
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
 * This action initiates a new stream session and outputs connection information that clients can use to access the stream. A stream session refers to an instance of a stream that Amazon GameLift Streams transmits from the server to the end-user. A stream session runs on a compute resource that a stream group has allocated. The start stream session process works as follows:
 *
 * - Prerequisites:
 *
 * - You must have a stream group in `ACTIVE` status
 *
 * - You must have idle or on-demand capacity in a stream group in the location you want to stream from
 *
 * - You must have at least one application associated to the stream group (use AssociateApplications if needed)
 *
 * - Start stream request:
 *
 * - Your backend server calls **StartStreamSession** to initiate connection
 *
 * - Amazon GameLift Streams creates the stream session resource, assigns an Amazon Resource Name (ARN) value, and begins searching for available stream capacity to run the stream
 *
 * - Session transitions to `ACTIVATING` status
 *
 * - Placement completion:
 *
 * - If Amazon GameLift Streams is successful in finding capacity for the stream, the stream session status changes to `ACTIVE` status and **StartStreamSession** returns stream connection information
 *
 * - If Amazon GameLift Streams was not successful in finding capacity within the placement timeout period (defined according to the capacity type and platform type), the stream session status changes to `ERROR` status and **StartStreamSession** returns a `StatusReason` of `placementTimeout`
 *
 * - Connection completion:
 *
 * - Provide the new connection information to the requesting client
 *
 * - Client must establish connection within `ConnectionTimeoutSeconds` (specified in **StartStreamSession** parameters)
 *
 * - Session terminates automatically if client fails to connect in time
 *
 * For more information about the stream session lifecycle, see Stream sessions in the *Amazon GameLift Streams Developer Guide*.
 *
 * Timeouts to be aware of that affect a stream session:
 *
 * - **Placement timeout**: The amount of time that Amazon GameLift Streams has to find capacity for a stream request. Placement timeout varies based on the capacity type used to fulfill your stream request:
 *
 * - **Always-on capacity**: 75 seconds
 *
 * - **On-demand capacity**:
 *
 * - Linux/Proton runtimes: 90 seconds
 *
 * - Windows runtime: 10 minutes
 *
 * - **Connection timeout**: The amount of time that Amazon GameLift Streams waits for a client to connect to a stream session in `ACTIVE` status, or reconnect to a stream session in `PENDING_CLIENT_RECONNECTION` status, the latter of which occurs when a client disconnects or loses connection from a stream session. If no client connects before the timeout, Amazon GameLift Streams terminates the stream session. This value is specified by `ConnectionTimeoutSeconds` in the `StartStreamSession` parameters.
 *
 * - **Idle timeout**: A stream session will be terminated if no user input has been received for 60 minutes.
 *
 * - **Maximum session length**: A stream session will be terminated after this amount of time has elapsed since it started, regardless of any existing client connections. This value is specified by `SessionLengthSeconds` in the `StartStreamSession` parameters.
 *
 * To start a new stream session, specify a stream group ID and application ID, along with the transport protocol and signal request to use with the stream session.
 *
 * For stream groups that have multiple locations, provide a set of locations ordered by priority using a `Locations` parameter. Amazon GameLift Streams will start a single stream session in the next available location. An application must be finished replicating to a remote location before the remote location can host a stream.
 *
 * To reconnect to a stream session after a client disconnects or loses connection, use CreateStreamSessionConnection.
 */
export const startStreamSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartStreamSessionInput,
  output: StartStreamSessionOutput,
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
 * Retrieves a list of all Amazon GameLift Streams stream groups that are associated with the Amazon Web Services account in use. This operation returns stream groups in all statuses, in no particular order. You can paginate the results as needed.
 */
export const listStreamGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListStreamGroupsInput,
    output: ListStreamGroupsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieves a list of Amazon GameLift Streams stream sessions that this user account has access to.
 *
 * In the returned list of stream sessions, the `ExportFilesMetadata` property only shows the `Status` value. To get the `OutpurUri` and `StatusReason` values, use GetStreamSession.
 *
 * We don't recommend using this operation to regularly check stream session statuses because it's costly. Instead, to check status updates for a specific stream session, use GetStreamSession.
 */
export const listStreamSessionsByAccount =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListStreamSessionsByAccountInput,
    output: ListStreamSessionsByAccountOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Items",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves all tags assigned to a Amazon GameLift Streams resource. To list tags for a resource, specify the ARN value for the resource.
 *
 * **Learn more**
 *
 * Tagging Amazon Web Services Resources in the *Amazon Web Services General Reference*
 *
 * Amazon Web Services Tagging Strategies
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns one or more tags to a Amazon GameLift Streams resource. Use tags to organize Amazon Web Services resources for a range of purposes. You can assign tags to the following Amazon GameLift Streams resource types:
 *
 * - Application
 *
 * - StreamGroup
 *
 * **Learn more**
 *
 * Tagging Amazon Web Services Resources in the *Amazon Web Services General Reference*
 *
 * Amazon Web Services Tagging Strategies
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from a Amazon GameLift Streams resource. To remove tags, specify the Amazon GameLift Streams resource and a list of one or more tags to remove.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Export the files that your application modifies or generates in a stream session, which can help you debug or verify your application. When your application runs, it generates output files such as logs, diagnostic information, crash dumps, save files, user data, screenshots, and so on. The files can be defined by the engine or frameworks that your application uses, or information that you've programmed your application to output.
 *
 * You can only call this action on a stream session that is in progress, specifically in one of the following statuses `ACTIVE`, `CONNECTED`, `PENDING_CLIENT_RECONNECTION`, and `RECONNECTING`. You must provide an Amazon Simple Storage Service (Amazon S3) bucket to store the files in. When the session ends, Amazon GameLift Streams produces a compressed folder that contains all of the files and directories that were modified or created by the application during the stream session. AWS uses your security credentials to authenticate and authorize access to your Amazon S3 bucket.
 *
 * Amazon GameLift Streams collects the following generated and modified files. Find them in the corresponding folders in the `.zip` archive.
 *
 * - `application/`: The folder where your application or game is stored.
 *
 * - `profile/`: The user profile folder.
 *
 * - `temp/`: The system temp folder.
 *
 * To verify the status of the exported files, use GetStreamSession.
 *
 * To delete the files, delete the object in the S3 bucket.
 */
export const exportStreamSessionFiles = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExportStreamSessionFilesInput,
    output: ExportStreamSessionFilesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an application resource in Amazon GameLift Streams, which specifies the application content you want to stream, such as a game build or other software, and configures the settings to run it.
 *
 * Before you create an application, upload your application content files to an Amazon Simple Storage Service (Amazon S3) bucket. For more information, see **Getting Started** in the Amazon GameLift Streams Developer Guide.
 *
 * Make sure that your files in the Amazon S3 bucket are the correct version you want to use. If you change the files at a later time, you will need to create a new Amazon GameLift Streams application.
 *
 * If the request is successful, Amazon GameLift Streams begins to create an application and sets the status to `INITIALIZED`. When an application reaches `READY` status, you can use the application to set up stream groups and start streams. To track application status, call GetApplication.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationInput,
  output: CreateApplicationOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration settings for an Amazon GameLift Streams stream group resource. To update a stream group, it must be in `ACTIVE` status. You can change the description, the set of locations, and the requested capacity of a stream group per location. If you want to change the stream class, create a new stream group.
 *
 * Stream capacity represents the number of concurrent streams that can be active at a time. You set stream capacity per location, per stream group. The following capacity settings are available:
 *
 * - **Always-on capacity**: This setting, if non-zero, indicates minimum streaming capacity which is allocated to you and is never released back to the service. You pay for this base level of capacity at all times, whether used or idle.
 *
 * - **Maximum capacity**: This indicates the maximum capacity that the service can allocate for you. Newly created streams may take a few minutes to start. Capacity is released back to the service when idle. You pay for capacity that is allocated to you until it is released.
 *
 * - **Target-idle capacity**: This indicates idle capacity which the service pre-allocates and holds for you in anticipation of future activity. This helps to insulate your users from capacity-allocation delays. You pay for capacity which is held in this intentional idle state.
 *
 * Values for capacity must be whole number multiples of the tenancy value of the stream group's stream class.
 *
 * To update a stream group, specify the stream group's Amazon Resource Name (ARN) and provide the new values. If the request is successful, Amazon GameLift Streams returns the complete updated metadata for the stream group. Expired stream groups cannot be updated.
 */
export const updateStreamGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStreamGroupInput,
  output: UpdateStreamGroupOutput,
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
 * When you associate, or link, an application with a stream group, then Amazon GameLift Streams can launch the application using the stream group's allocated compute resources. The stream group must be in `ACTIVE` status. You can reverse this action by using DisassociateApplications.
 *
 * If a stream group does not already have a linked application, Amazon GameLift Streams will automatically assign the first application provided in `ApplicationIdentifiers` as the default.
 */
export const associateApplications = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateApplicationsInput,
    output: AssociateApplicationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Add locations that can host stream sessions. To add a location, the stream group must be in `ACTIVE` status. You configure locations and their corresponding capacity for each stream group. Creating a stream group in a location that's nearest to your end users can help minimize latency and improve quality.
 *
 * This operation provisions stream capacity at the specified locations. By default, all locations have 1 or 2 capacity, depending on the stream class option: 2 for 'High' and 1 for 'Ultra' and 'Win2022'. This operation also copies the content files of all associated applications to an internal S3 bucket at each location. This allows Amazon GameLift Streams to host performant stream sessions.
 */
export const addStreamGroupLocations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddStreamGroupLocationsInput,
    output: AddStreamGroupLocationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Stream groups manage how Amazon GameLift Streams allocates resources and handles concurrent streams, allowing you to effectively manage capacity and costs. Within a stream group, you specify an application to stream, streaming locations and their capacity, and the stream class you want to use when streaming applications to your end-users. A stream class defines the hardware configuration of the compute resources that Amazon GameLift Streams will use when streaming, such as the CPU, GPU, and memory.
 *
 * Stream capacity represents the number of concurrent streams that can be active at a time. You set stream capacity per location, per stream group. The following capacity settings are available:
 *
 * - **Always-on capacity**: This setting, if non-zero, indicates minimum streaming capacity which is allocated to you and is never released back to the service. You pay for this base level of capacity at all times, whether used or idle.
 *
 * - **Maximum capacity**: This indicates the maximum capacity that the service can allocate for you. Newly created streams may take a few minutes to start. Capacity is released back to the service when idle. You pay for capacity that is allocated to you until it is released.
 *
 * - **Target-idle capacity**: This indicates idle capacity which the service pre-allocates and holds for you in anticipation of future activity. This helps to insulate your users from capacity-allocation delays. You pay for capacity which is held in this intentional idle state.
 *
 * Values for capacity must be whole number multiples of the tenancy value of the stream group's stream class.
 *
 * To adjust the capacity of any `ACTIVE` stream group, call UpdateStreamGroup.
 *
 * If the `CreateStreamGroup` request is successful, Amazon GameLift Streams assigns a unique ID to the stream group resource and sets the status to `ACTIVATING`. It can take a few minutes for Amazon GameLift Streams to finish creating the stream group while it searches for unallocated compute resources and provisions them. When complete, the stream group status will be `ACTIVE` and you can start stream sessions by using StartStreamSession. To check the stream group's status, call GetStreamGroup.
 *
 * Stream groups should be recreated every 3-4 weeks to pick up important service updates and fixes. Stream groups that are older than 180 days can no longer be updated with new application associations. Stream groups expire when they are 365 days old, at which point they can no longer stream sessions. The exact expiration date is indicated by the date value in the `ExpiresAt` field.
 */
export const createStreamGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStreamGroupInput,
  output: CreateStreamGroupOutput,
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

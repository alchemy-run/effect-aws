import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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
export class AssociateApplicationsInput extends S.Class<AssociateApplicationsInput>(
  "AssociateApplicationsInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
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
    Identifier: S.String.pipe(T.HttpLabel()),
    StreamSessionIdentifier: S.String.pipe(T.HttpLabel()),
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
    Identifier: S.String.pipe(T.HttpLabel()),
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
    Identifier: S.String.pipe(T.HttpLabel()),
    StreamSessionIdentifier: S.String.pipe(T.HttpLabel()),
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
    Identifier: S.String.pipe(T.HttpLabel()),
    StreamSessionIdentifier: S.String.pipe(T.HttpLabel()),
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
    Identifier: S.String.pipe(T.HttpLabel()),
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
export class RemoveStreamGroupLocationsInput extends S.Class<RemoveStreamGroupLocationsInput>(
  "RemoveStreamGroupLocationsInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
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
    Identifier: S.String.pipe(T.HttpLabel()),
    StreamSessionIdentifier: S.String.pipe(T.HttpLabel()),
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
export const ArnList = S.Array(S.String);
export const EnvironmentVariables = S.Record({
  key: S.String,
  value: S.String,
});
export class PerformanceStatsConfiguration extends S.Class<PerformanceStatsConfiguration>(
  "PerformanceStatsConfiguration",
)({ SharedWithClient: S.optional(S.Boolean) }) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class AddStreamGroupLocationsInput extends S.Class<AddStreamGroupLocationsInput>(
  "AddStreamGroupLocationsInput",
)(
  {
    Identifier: S.String.pipe(T.HttpLabel()),
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
    Identifier: S.String.pipe(T.HttpLabel()),
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
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: Tags },
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
export class AddStreamGroupLocationsOutput extends S.Class<AddStreamGroupLocationsOutput>(
  "AddStreamGroupLocationsOutput",
)({ Identifier: S.String, Locations: LocationStates }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
) {}

//# Operations
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
 * Retrieves a list of Amazon GameLift Streams stream sessions that this user account has access to.
 *
 * In the returned list of stream sessions, the `ExportFilesMetadata` property only shows the `Status` value. To get the `OutpurUri` and `StatusReason` values, use GetStreamSession.
 *
 * We don't recommend using this operation to regularly check stream session statuses because it's costly. Instead, to check status updates for a specific stream session, use GetStreamSession.
 */
export const listStreamSessionsByAccount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListStreamSessionsByAccountInput,
    output: ListStreamSessionsByAccountOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
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
export const listStreamSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStreamSessionsInput,
  output: ListStreamSessionsOutput,
  errors: [
    AccessDeniedException,
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

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "SimSpaceWeaver",
  serviceShapeName: "SimSpaceWeaver",
});
const auth = T.AwsAuthSigv4({ name: "simspaceweaver" });
const ver = T.ServiceVersion("2022-10-28");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://simspaceweaver-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://simspaceweaver-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://simspaceweaver.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://simspaceweaver.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
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
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class DescribeSimulationInput extends S.Class<DescribeSimulationInput>(
  "DescribeSimulationInput",
)(
  { Simulation: S.String.pipe(T.HttpQuery("simulation")) },
  T.all(
    T.Http({ method: "GET", uri: "/describesimulation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopSimulationInput extends S.Class<StopSimulationInput>(
  "StopSimulationInput",
)(
  { Simulation: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/stopsimulation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopSimulationOutput extends S.Class<StopSimulationOutput>(
  "StopSimulationOutput",
)({}) {}
export class DeleteSimulationInput extends S.Class<DeleteSimulationInput>(
  "DeleteSimulationInput",
)(
  { Simulation: S.String.pipe(T.HttpQuery("simulation")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/deletesimulation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSimulationOutput extends S.Class<DeleteSimulationOutput>(
  "DeleteSimulationOutput",
)({}) {}
export class ListSimulationsInput extends S.Class<ListSimulationsInput>(
  "ListSimulationsInput",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/listsimulations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppInput extends S.Class<DeleteAppInput>("DeleteAppInput")(
  {
    Simulation: S.String.pipe(T.HttpQuery("simulation")),
    Domain: S.String.pipe(T.HttpQuery("domain")),
    App: S.String.pipe(T.HttpQuery("app")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/deleteapp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppOutput extends S.Class<DeleteAppOutput>(
  "DeleteAppOutput",
)({}) {}
export class DescribeAppInput extends S.Class<DescribeAppInput>(
  "DescribeAppInput",
)(
  {
    Simulation: S.String.pipe(T.HttpQuery("simulation")),
    Domain: S.String.pipe(T.HttpQuery("domain")),
    App: S.String.pipe(T.HttpQuery("app")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/describeapp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppsInput extends S.Class<ListAppsInput>("ListAppsInput")(
  {
    Simulation: S.String.pipe(T.HttpQuery("simulation")),
    Domain: S.optional(S.String).pipe(T.HttpQuery("domain")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/listapps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartClockInput extends S.Class<StartClockInput>(
  "StartClockInput",
)(
  { Simulation: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/startclock" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartClockOutput extends S.Class<StartClockOutput>(
  "StartClockOutput",
)({}) {}
export class StopAppInput extends S.Class<StopAppInput>("StopAppInput")(
  { Simulation: S.String, Domain: S.String, App: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/stopapp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopAppOutput extends S.Class<StopAppOutput>("StopAppOutput")(
  {},
) {}
export class StopClockInput extends S.Class<StopClockInput>("StopClockInput")(
  { Simulation: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/stopclock" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopClockOutput extends S.Class<StopClockOutput>(
  "StopClockOutput",
)({}) {}
export const LaunchCommandList = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export class S3Location extends S.Class<S3Location>("S3Location")({
  BucketName: S.String,
  ObjectKey: S.String,
}) {}
export class S3Destination extends S.Class<S3Destination>("S3Destination")({
  BucketName: S.String,
  ObjectKeyPrefix: S.optional(S.String),
}) {}
export class LaunchOverrides extends S.Class<LaunchOverrides>(
  "LaunchOverrides",
)({ LaunchCommands: S.optional(LaunchCommandList) }) {}
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
export class StartSimulationInput extends S.Class<StartSimulationInput>(
  "StartSimulationInput",
)(
  {
    ClientToken: S.optional(S.String),
    Name: S.String,
    Description: S.optional(S.String),
    RoleArn: S.String,
    SchemaS3Location: S.optional(S3Location),
    MaximumDuration: S.optional(S.String),
    Tags: S.optional(TagMap),
    SnapshotS3Location: S.optional(S3Location),
  },
  T.all(
    T.Http({ method: "POST", uri: "/startsimulation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSnapshotInput extends S.Class<CreateSnapshotInput>(
  "CreateSnapshotInput",
)(
  { Simulation: S.String, Destination: S3Destination },
  T.all(
    T.Http({ method: "POST", uri: "/createsnapshot" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSnapshotOutput extends S.Class<CreateSnapshotOutput>(
  "CreateSnapshotOutput",
)({}) {}
export class StartAppInput extends S.Class<StartAppInput>("StartAppInput")(
  {
    ClientToken: S.optional(S.String),
    Simulation: S.String,
    Domain: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    LaunchOverrides: S.optional(LaunchOverrides),
  },
  T.all(
    T.Http({ method: "POST", uri: "/startapp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SimulationMetadata extends S.Class<SimulationMetadata>(
  "SimulationMetadata",
)({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  TargetStatus: S.optional(S.String),
}) {}
export const SimulationList = S.Array(SimulationMetadata);
export class SimulationAppMetadata extends S.Class<SimulationAppMetadata>(
  "SimulationAppMetadata",
)({
  Name: S.optional(S.String),
  Simulation: S.optional(S.String),
  Domain: S.optional(S.String),
  Status: S.optional(S.String),
  TargetStatus: S.optional(S.String),
}) {}
export const SimulationAppList = S.Array(SimulationAppMetadata);
export class StartSimulationOutput extends S.Class<StartSimulationOutput>(
  "StartSimulationOutput",
)({
  Arn: S.optional(S.String),
  ExecutionId: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListSimulationsOutput extends S.Class<ListSimulationsOutput>(
  "ListSimulationsOutput",
)({
  Simulations: S.optional(SimulationList),
  NextToken: S.optional(S.String),
}) {}
export class ListAppsOutput extends S.Class<ListAppsOutput>("ListAppsOutput")({
  Apps: S.optional(SimulationAppList),
  NextToken: S.optional(S.String),
}) {}
export class StartAppOutput extends S.Class<StartAppOutput>("StartAppOutput")({
  Name: S.optional(S.String),
  Domain: S.optional(S.String),
  Simulation: S.optional(S.String),
}) {}
export class Domain extends S.Class<Domain>("Domain")({
  Name: S.optional(S.String),
  Lifecycle: S.optional(S.String),
}) {}
export const DomainList = S.Array(Domain);
export class SimulationClock extends S.Class<SimulationClock>(
  "SimulationClock",
)({ Status: S.optional(S.String), TargetStatus: S.optional(S.String) }) {}
export const SimulationClockList = S.Array(SimulationClock);
export class SimulationAppPortMapping extends S.Class<SimulationAppPortMapping>(
  "SimulationAppPortMapping",
)({ Declared: S.optional(S.Number), Actual: S.optional(S.Number) }) {}
export const AppPortMappings = S.Array(SimulationAppPortMapping);
export class LiveSimulationState extends S.Class<LiveSimulationState>(
  "LiveSimulationState",
)({
  Domains: S.optional(DomainList),
  Clocks: S.optional(SimulationClockList),
}) {}
export class SimulationAppEndpointInfo extends S.Class<SimulationAppEndpointInfo>(
  "SimulationAppEndpointInfo",
)({
  Address: S.optional(S.String),
  IngressPortMappings: S.optional(AppPortMappings),
}) {}
export class CloudWatchLogsLogGroup extends S.Class<CloudWatchLogsLogGroup>(
  "CloudWatchLogsLogGroup",
)({ LogGroupArn: S.optional(S.String) }) {}
export class DescribeAppOutput extends S.Class<DescribeAppOutput>(
  "DescribeAppOutput",
)({
  Name: S.optional(S.String),
  Simulation: S.optional(S.String),
  Domain: S.optional(S.String),
  Status: S.optional(S.String),
  TargetStatus: S.optional(S.String),
  LaunchOverrides: S.optional(LaunchOverrides),
  Description: S.optional(S.String),
  EndpointInfo: S.optional(SimulationAppEndpointInfo),
}) {}
export class LogDestination extends S.Class<LogDestination>("LogDestination")({
  CloudWatchLogsLogGroup: S.optional(CloudWatchLogsLogGroup),
}) {}
export const LogDestinations = S.Array(LogDestination);
export class LoggingConfiguration extends S.Class<LoggingConfiguration>(
  "LoggingConfiguration",
)({ Destinations: S.optional(LogDestinations) }) {}
export class DescribeSimulationOutput extends S.Class<DescribeSimulationOutput>(
  "DescribeSimulationOutput",
)({
  Name: S.optional(S.String),
  ExecutionId: S.optional(S.String),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  RoleArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  TargetStatus: S.optional(S.String),
  SchemaS3Location: S.optional(S3Location),
  SchemaError: S.optional(S.String),
  LoggingConfiguration: S.optional(LoggingConfiguration),
  LiveSimulationState: S.optional(LiveSimulationState),
  MaximumDuration: S.optional(S.String),
  SnapshotS3Location: S.optional(S3Location),
  StartError: S.optional(S.String),
}) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes tags from a SimSpace Weaver resource. For more information about tags, see Tagging Amazon Web Services resources in the
 * *Amazon Web Services General Reference*.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Adds tags to a SimSpace Weaver resource. For more information about tags, see Tagging Amazon Web Services resources in the
 * *Amazon Web Services General Reference*.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    ResourceNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Lists all tags on a SimSpace Weaver resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Stops the given simulation.
 *
 * You can't restart a simulation after you stop it. If you want to restart a simulation, then
 * you must stop it, delete it, and start a new instance of it.
 */
export const stopSimulation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopSimulationInput,
  output: StopSimulationOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the state of the given custom app.
 */
export const describeApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppInput,
  output: DescribeAppOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the SimSpace Weaver simulations in the Amazon Web Services account used to make the API call.
 */
export const listSimulations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSimulationsInput,
    output: ListSimulationsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
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
 * Lists all custom apps or service apps for the given simulation and domain.
 */
export const listApps = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppsInput,
  output: ListAppsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a snapshot of the specified simulation.
 * A snapshot is a file that contains simulation state data at a specific time.
 * The state data saved in a snapshot includes entity data from the State Fabric,
 * the simulation configuration specified in the schema, and the clock tick number.
 * You can use the snapshot to initialize a new simulation.
 * For more information about snapshots, see Snapshots
 * in the *SimSpace Weaver User Guide*.
 *
 * You specify a `Destination` when you create a snapshot.
 * The `Destination` is the name of an Amazon S3 bucket and an optional
 * `ObjectKeyPrefix`. The `ObjectKeyPrefix` is
 * usually the name of a folder in the bucket. SimSpace Weaver creates a
 * `snapshot` folder inside the `Destination` and
 * places the snapshot file there.
 *
 * The snapshot file is an Amazon S3 object. It has an object key with the
 * form:
 * *object-key-prefix*\/snapshot/*simulation-name*-*YYMMdd*-*HHmm*-*ss*.zip, where:
 *
 * -
 * *YY*
 * is the 2-digit year
 *
 * -
 * *MM*
 * is the 2-digit month
 *
 * -
 * *dd*
 * is the 2-digit day of the month
 *
 * -
 * *HH*
 * is the 2-digit hour (24-hour clock)
 *
 * -
 * *mm*
 * is the 2-digit minutes
 *
 * -
 * *ss*
 * is the 2-digit seconds
 */
export const createSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotInput,
  output: CreateSnapshotOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes all SimSpace Weaver resources assigned to the given simulation.
 *
 * Your simulation uses resources in other Amazon Web Services. This API operation doesn't delete
 * resources in other Amazon Web Services.
 */
export const deleteSimulation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSimulationInput,
  output: DeleteSimulationOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the instance of the given custom app.
 */
export const deleteApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppInput,
  output: DeleteAppOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Starts the simulation clock.
 */
export const startClock = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartClockInput,
  output: StartClockOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Stops the given custom app and shuts down all of its allocated compute resources.
 */
export const stopApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopAppInput,
  output: StopAppOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Stops the simulation clock.
 */
export const stopClock = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopClockInput,
  output: StopClockOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns the current state of the given simulation.
 */
export const describeSimulation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSimulationInput,
  output: DescribeSimulationOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Starts a custom app with the configuration specified in the simulation schema.
 */
export const startApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAppInput,
  output: StartAppOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Starts a simulation with the given name. You must choose to start your
 * simulation from a schema or from a snapshot.
 * For more information about the schema, see the schema reference
 * in the *SimSpace Weaver User Guide*.
 * For more information about snapshots, see Snapshots
 * in the *SimSpace Weaver User Guide*.
 */
export const startSimulation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSimulationInput,
  output: StartSimulationOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));

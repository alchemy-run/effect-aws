import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "MWAA", serviceShapeName: "AmazonMWAA" });
const auth = T.AwsAuthSigv4({ name: "airflow" });
const ver = T.ServiceVersion("2020-07-01");
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
                        url: "https://airflow-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://airflow-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://airflow.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://airflow.{Region}.{PartitionResult#dnsSuffix}",
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
export class CreateCliTokenRequest extends S.Class<CreateCliTokenRequest>(
  "CreateCliTokenRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "POST", uri: "/clitoken/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWebLoginTokenRequest extends S.Class<CreateWebLoginTokenRequest>(
  "CreateWebLoginTokenRequest",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "POST", uri: "/webtoken/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentInput extends S.Class<DeleteEnvironmentInput>(
  "DeleteEnvironmentInput",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/environments/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentOutput extends S.Class<DeleteEnvironmentOutput>(
  "DeleteEnvironmentOutput",
)({}) {}
export class GetEnvironmentInput extends S.Class<GetEnvironmentInput>(
  "GetEnvironmentInput",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "GET", uri: "/environments/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeRestApiRequest extends S.Class<InvokeRestApiRequest>(
  "InvokeRestApiRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    Path: S.String,
    Method: S.String,
    QueryParameters: S.optional(S.Any),
    Body: S.optional(S.Any),
  },
  T.all(
    T.Http({ method: "POST", uri: "/restapi/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnvironmentsInput extends S.Class<ListEnvironmentsInput>(
  "ListEnvironmentsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/environments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
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
export const TagMap = S.Record({ key: S.String, value: S.String });
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
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export const SubnetList = S.Array(S.String);
export const SecurityGroupList = S.Array(S.String);
export class NetworkConfiguration extends S.Class<NetworkConfiguration>(
  "NetworkConfiguration",
)({
  SubnetIds: S.optional(SubnetList),
  SecurityGroupIds: S.optional(SecurityGroupList),
}) {}
export const AirflowConfigurationOptions = S.Record({
  key: S.String,
  value: S.String,
});
export const EnvironmentList = S.Array(S.String);
export class UpdateNetworkConfigurationInput extends S.Class<UpdateNetworkConfigurationInput>(
  "UpdateNetworkConfigurationInput",
)({ SecurityGroupIds: SecurityGroupList }) {}
export class CreateCliTokenResponse extends S.Class<CreateCliTokenResponse>(
  "CreateCliTokenResponse",
)({
  CliToken: S.optional(S.String),
  WebServerHostname: S.optional(S.String),
}) {}
export class CreateWebLoginTokenResponse extends S.Class<CreateWebLoginTokenResponse>(
  "CreateWebLoginTokenResponse",
)({
  WebToken: S.optional(S.String),
  WebServerHostname: S.optional(S.String),
  IamIdentity: S.optional(S.String),
  AirflowIdentity: S.optional(S.String),
}) {}
export class InvokeRestApiResponse extends S.Class<InvokeRestApiResponse>(
  "InvokeRestApiResponse",
)({
  RestApiStatusCode: S.optional(S.Number),
  RestApiResponse: S.optional(S.Any),
}) {}
export class ListEnvironmentsOutput extends S.Class<ListEnvironmentsOutput>(
  "ListEnvironmentsOutput",
)({ Environments: EnvironmentList, NextToken: S.optional(S.String) }) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: S.optional(TagMap) }) {}
export class ModuleLoggingConfigurationInput extends S.Class<ModuleLoggingConfigurationInput>(
  "ModuleLoggingConfigurationInput",
)({ Enabled: S.Boolean, LogLevel: S.String }) {}
export class LoggingConfigurationInput extends S.Class<LoggingConfigurationInput>(
  "LoggingConfigurationInput",
)({
  DagProcessingLogs: S.optional(ModuleLoggingConfigurationInput),
  SchedulerLogs: S.optional(ModuleLoggingConfigurationInput),
  WebserverLogs: S.optional(ModuleLoggingConfigurationInput),
  WorkerLogs: S.optional(ModuleLoggingConfigurationInput),
  TaskLogs: S.optional(ModuleLoggingConfigurationInput),
}) {}
export class UpdateEnvironmentInput extends S.Class<UpdateEnvironmentInput>(
  "UpdateEnvironmentInput",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    ExecutionRoleArn: S.optional(S.String),
    AirflowConfigurationOptions: S.optional(AirflowConfigurationOptions),
    AirflowVersion: S.optional(S.String),
    DagS3Path: S.optional(S.String),
    EnvironmentClass: S.optional(S.String),
    LoggingConfiguration: S.optional(LoggingConfigurationInput),
    MaxWorkers: S.optional(S.Number),
    MinWorkers: S.optional(S.Number),
    MaxWebservers: S.optional(S.Number),
    MinWebservers: S.optional(S.Number),
    WorkerReplacementStrategy: S.optional(S.String),
    NetworkConfiguration: S.optional(UpdateNetworkConfigurationInput),
    PluginsS3Path: S.optional(S.String),
    PluginsS3ObjectVersion: S.optional(S.String),
    RequirementsS3Path: S.optional(S.String),
    RequirementsS3ObjectVersion: S.optional(S.String),
    Schedulers: S.optional(S.Number),
    SourceBucketArn: S.optional(S.String),
    StartupScriptS3Path: S.optional(S.String),
    StartupScriptS3ObjectVersion: S.optional(S.String),
    WebserverAccessMode: S.optional(S.String),
    WeeklyMaintenanceWindowStart: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/environments/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Dimension extends S.Class<Dimension>("Dimension")({
  Name: S.String,
  Value: S.String,
}) {}
export const Dimensions = S.Array(Dimension);
export class StatisticSet extends S.Class<StatisticSet>("StatisticSet")({
  SampleCount: S.optional(S.Number),
  Sum: S.optional(S.Number),
  Minimum: S.optional(S.Number),
  Maximum: S.optional(S.Number),
}) {}
export class MetricDatum extends S.Class<MetricDatum>("MetricDatum")({
  MetricName: S.String,
  Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Dimensions: S.optional(Dimensions),
  Value: S.optional(S.Number),
  Unit: S.optional(S.String),
  StatisticValues: S.optional(StatisticSet),
}) {}
export const MetricData = S.Array(MetricDatum);
export class CreateEnvironmentInput extends S.Class<CreateEnvironmentInput>(
  "CreateEnvironmentInput",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    ExecutionRoleArn: S.String,
    SourceBucketArn: S.String,
    DagS3Path: S.String,
    NetworkConfiguration: NetworkConfiguration,
    PluginsS3Path: S.optional(S.String),
    PluginsS3ObjectVersion: S.optional(S.String),
    RequirementsS3Path: S.optional(S.String),
    RequirementsS3ObjectVersion: S.optional(S.String),
    StartupScriptS3Path: S.optional(S.String),
    StartupScriptS3ObjectVersion: S.optional(S.String),
    AirflowConfigurationOptions: S.optional(AirflowConfigurationOptions),
    EnvironmentClass: S.optional(S.String),
    MaxWorkers: S.optional(S.Number),
    KmsKey: S.optional(S.String),
    AirflowVersion: S.optional(S.String),
    LoggingConfiguration: S.optional(LoggingConfigurationInput),
    WeeklyMaintenanceWindowStart: S.optional(S.String),
    Tags: S.optional(TagMap),
    WebserverAccessMode: S.optional(S.String),
    MinWorkers: S.optional(S.Number),
    Schedulers: S.optional(S.Number),
    EndpointManagement: S.optional(S.String),
    MinWebservers: S.optional(S.Number),
    MaxWebservers: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/environments/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublishMetricsInput extends S.Class<PublishMetricsInput>(
  "PublishMetricsInput",
)(
  {
    EnvironmentName: S.String.pipe(T.HttpLabel("EnvironmentName")),
    MetricData: MetricData,
  },
  T.all(
    T.Http({ method: "POST", uri: "/metrics/environments/{EnvironmentName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublishMetricsOutput extends S.Class<PublishMetricsOutput>(
  "PublishMetricsOutput",
)({}) {}
export class UpdateEnvironmentOutput extends S.Class<UpdateEnvironmentOutput>(
  "UpdateEnvironmentOutput",
)({ Arn: S.optional(S.String) }) {}
export class ModuleLoggingConfiguration extends S.Class<ModuleLoggingConfiguration>(
  "ModuleLoggingConfiguration",
)({
  Enabled: S.optional(S.Boolean),
  LogLevel: S.optional(S.String),
  CloudWatchLogGroupArn: S.optional(S.String),
}) {}
export class UpdateError extends S.Class<UpdateError>("UpdateError")({
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export class CreateEnvironmentOutput extends S.Class<CreateEnvironmentOutput>(
  "CreateEnvironmentOutput",
)({ Arn: S.optional(S.String) }) {}
export class LoggingConfiguration extends S.Class<LoggingConfiguration>(
  "LoggingConfiguration",
)({
  DagProcessingLogs: S.optional(ModuleLoggingConfiguration),
  SchedulerLogs: S.optional(ModuleLoggingConfiguration),
  WebserverLogs: S.optional(ModuleLoggingConfiguration),
  WorkerLogs: S.optional(ModuleLoggingConfiguration),
  TaskLogs: S.optional(ModuleLoggingConfiguration),
}) {}
export class LastUpdate extends S.Class<LastUpdate>("LastUpdate")({
  Status: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Error: S.optional(UpdateError),
  Source: S.optional(S.String),
  WorkerReplacementStrategy: S.optional(S.String),
}) {}
export class Environment extends S.Class<Environment>("Environment")({
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  Arn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  WebserverUrl: S.optional(S.String),
  ExecutionRoleArn: S.optional(S.String),
  ServiceRoleArn: S.optional(S.String),
  KmsKey: S.optional(S.String),
  AirflowVersion: S.optional(S.String),
  SourceBucketArn: S.optional(S.String),
  DagS3Path: S.optional(S.String),
  PluginsS3Path: S.optional(S.String),
  PluginsS3ObjectVersion: S.optional(S.String),
  RequirementsS3Path: S.optional(S.String),
  RequirementsS3ObjectVersion: S.optional(S.String),
  StartupScriptS3Path: S.optional(S.String),
  StartupScriptS3ObjectVersion: S.optional(S.String),
  AirflowConfigurationOptions: S.optional(AirflowConfigurationOptions),
  EnvironmentClass: S.optional(S.String),
  MaxWorkers: S.optional(S.Number),
  NetworkConfiguration: S.optional(NetworkConfiguration),
  LoggingConfiguration: S.optional(LoggingConfiguration),
  LastUpdate: S.optional(LastUpdate),
  WeeklyMaintenanceWindowStart: S.optional(S.String),
  Tags: S.optional(TagMap),
  WebserverAccessMode: S.optional(S.String),
  MinWorkers: S.optional(S.Number),
  Schedulers: S.optional(S.Number),
  WebserverVpcEndpointService: S.optional(S.String),
  DatabaseVpcEndpointService: S.optional(S.String),
  CeleryExecutorQueue: S.optional(S.String),
  EndpointManagement: S.optional(S.String),
  MinWebservers: S.optional(S.Number),
  MaxWebservers: S.optional(S.Number),
}) {}
export class GetEnvironmentOutput extends S.Class<GetEnvironmentOutput>(
  "GetEnvironmentOutput",
)({ Environment: S.optional(Environment) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class RestApiClientException extends S.TaggedError<RestApiClientException>()(
  "RestApiClientException",
  {
    RestApiStatusCode: S.optional(S.Number),
    RestApiResponse: S.optional(S.Any),
  },
) {}
export class RestApiServerException extends S.TaggedError<RestApiServerException>()(
  "RestApiServerException",
  {
    RestApiStatusCode: S.optional(S.Number),
    RestApiResponse: S.optional(S.Any),
  },
) {}

//# Operations
/**
 * Creates a CLI token for the Airflow CLI. To learn more, see Creating an Apache Airflow CLI token.
 */
export const createCliToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCliTokenRequest,
  output: CreateCliTokenResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the Amazon Managed Workflows for Apache Airflow (MWAA) environments.
 */
export const listEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEnvironmentsInput,
  output: ListEnvironmentsOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * **Internal only**. Publishes environment health metrics to Amazon CloudWatch.
 */
export const publishMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishMetricsInput,
  output: PublishMetricsOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Updates an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
 */
export const updateEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentInput,
  output: UpdateEnvironmentOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon Managed Workflows for Apache Airflow (Amazon MWAA) environment.
 */
export const deleteEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentInput,
  output: DeleteEnvironmentOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the key-value tag pairs associated to the Amazon Managed Workflows for Apache Airflow (MWAA) environment. For example, `"Environment": "Staging"`.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates key-value tag pairs to your Amazon Managed Workflows for Apache Airflow (MWAA) environment.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes key-value tag pairs associated to your Amazon Managed Workflows for Apache Airflow (MWAA) environment. For example, `"Environment": "Staging"`.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a web login token for the Airflow Web UI. To learn more, see Creating an Apache Airflow web login token.
 */
export const createWebLoginToken = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWebLoginTokenRequest,
  output: CreateWebLoginTokenResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Managed Workflows for Apache Airflow (Amazon MWAA) environment.
 */
export const createEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentInput,
  output: CreateEnvironmentOutput,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Describes an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
 */
export const getEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentInput,
  output: GetEnvironmentOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Invokes the Apache Airflow REST API on the webserver with the specified inputs. To
 * learn more, see Using the Apache Airflow REST API
 */
export const invokeRestApi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeRestApiRequest,
  output: InvokeRestApiResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    RestApiClientException,
    RestApiServerException,
    ValidationException,
  ],
}));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "drs",
  serviceShapeName: "ElasticDisasterRecoveryService",
});
const auth = T.AwsAuthSigv4({ name: "drs" });
const ver = T.ServiceVersion("2020-02-26");
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
                        url: "https://drs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://drs-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://drs.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://drs.{Region}.{PartitionResult#dnsSuffix}",
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
export class InitializeServiceRequest extends S.Class<InitializeServiceRequest>(
  "InitializeServiceRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/InitializeService" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InitializeServiceResponse extends S.Class<InitializeServiceResponse>(
  "InitializeServiceResponse",
)({}) {}
export const TagKeys = S.Array(S.String);
export class DeleteLaunchActionRequest extends S.Class<DeleteLaunchActionRequest>(
  "DeleteLaunchActionRequest",
)(
  { resourceId: S.String, actionId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/DeleteLaunchAction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLaunchActionResponse extends S.Class<DeleteLaunchActionResponse>(
  "DeleteLaunchActionResponse",
)({}) {}
export class ListExtensibleSourceServersRequest extends S.Class<ListExtensibleSourceServersRequest>(
  "ListExtensibleSourceServersRequest",
)(
  {
    stagingAccountID: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListExtensibleSourceServers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListStagingAccountsRequest extends S.Class<ListStagingAccountsRequest>(
  "ListStagingAccountsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/ListStagingAccounts" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagsMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export const LaunchActionIds = S.Array(S.String);
export class LaunchActionsRequestFilters extends S.Class<LaunchActionsRequestFilters>(
  "LaunchActionsRequestFilters",
)({ actionIds: S.optional(LaunchActionIds) }) {}
export class CreateExtendedSourceServerRequest extends S.Class<CreateExtendedSourceServerRequest>(
  "CreateExtendedSourceServerRequest",
)(
  { sourceServerArn: S.String, tags: S.optional(TagsMap) },
  T.all(
    T.Http({ method: "POST", uri: "/CreateExtendedSourceServer" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLaunchActionsRequest extends S.Class<ListLaunchActionsRequest>(
  "ListLaunchActionsRequest",
)(
  {
    resourceId: S.String,
    filters: S.optional(LaunchActionsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListLaunchActions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class LaunchActionParameter extends S.Class<LaunchActionParameter>(
  "LaunchActionParameter",
)({ value: S.optional(S.String), type: S.optional(S.String) }) {}
export class StagingSourceServer extends S.Class<StagingSourceServer>(
  "StagingSourceServer",
)({
  hostname: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagsMap),
}) {}
export const StagingSourceServersList = S.Array(StagingSourceServer);
export class Account extends S.Class<Account>("Account")({
  accountID: S.optional(S.String),
}) {}
export const Accounts = S.Array(Account);
export const LaunchActionParameters = S.Record({
  key: S.String,
  value: LaunchActionParameter,
});
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.optional(S.String), message: S.optional(S.String) }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class ListExtensibleSourceServersResponse extends S.Class<ListExtensibleSourceServersResponse>(
  "ListExtensibleSourceServersResponse",
)({
  items: S.optional(StagingSourceServersList),
  nextToken: S.optional(S.String),
}) {}
export class ListStagingAccountsResponse extends S.Class<ListStagingAccountsResponse>(
  "ListStagingAccountsResponse",
)({ accounts: S.optional(Accounts), nextToken: S.optional(S.String) }) {}
export class PutLaunchActionRequest extends S.Class<PutLaunchActionRequest>(
  "PutLaunchActionRequest",
)(
  {
    resourceId: S.String,
    actionCode: S.String,
    order: S.Number,
    actionId: S.String,
    optional: S.Boolean,
    active: S.Boolean,
    name: S.String,
    actionVersion: S.String,
    category: S.String,
    parameters: S.optional(LaunchActionParameters),
    description: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/PutLaunchAction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LaunchAction extends S.Class<LaunchAction>("LaunchAction")({
  actionId: S.optional(S.String),
  actionCode: S.optional(S.String),
  type: S.optional(S.String),
  name: S.optional(S.String),
  active: S.optional(S.Boolean),
  order: S.optional(S.Number),
  actionVersion: S.optional(S.String),
  optional: S.optional(S.Boolean),
  parameters: S.optional(LaunchActionParameters),
  description: S.optional(S.String),
  category: S.optional(S.String),
}) {}
export const LaunchActions = S.Array(LaunchAction);
export class ListLaunchActionsResponse extends S.Class<ListLaunchActionsResponse>(
  "ListLaunchActionsResponse",
)({ items: S.optional(LaunchActions), nextToken: S.optional(S.String) }) {}
export class PutLaunchActionResponse extends S.Class<PutLaunchActionResponse>(
  "PutLaunchActionResponse",
)({
  resourceId: S.optional(S.String),
  actionId: S.optional(S.String),
  actionCode: S.optional(S.String),
  type: S.optional(S.String),
  name: S.optional(S.String),
  active: S.optional(S.Boolean),
  order: S.optional(S.Number),
  actionVersion: S.optional(S.String),
  optional: S.optional(S.Boolean),
  parameters: S.optional(LaunchActionParameters),
  description: S.optional(S.String),
  category: S.optional(S.String),
}) {}
export class StagingArea extends S.Class<StagingArea>("StagingArea")({
  status: S.optional(S.String),
  stagingAccountID: S.optional(S.String),
  stagingSourceServerArn: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export class SourceCloudProperties extends S.Class<SourceCloudProperties>(
  "SourceCloudProperties",
)({
  originAccountID: S.optional(S.String),
  originRegion: S.optional(S.String),
  originAvailabilityZone: S.optional(S.String),
  sourceOutpostArn: S.optional(S.String),
}) {}
export const IPsList = S.Array(S.String);
export class DataReplicationInfoReplicatedDisk extends S.Class<DataReplicationInfoReplicatedDisk>(
  "DataReplicationInfoReplicatedDisk",
)({
  deviceName: S.optional(S.String),
  totalStorageBytes: S.optional(S.Number),
  replicatedStorageBytes: S.optional(S.Number),
  rescannedStorageBytes: S.optional(S.Number),
  backloggedStorageBytes: S.optional(S.Number),
  volumeStatus: S.optional(S.String),
}) {}
export const DataReplicationInfoReplicatedDisks = S.Array(
  DataReplicationInfoReplicatedDisk,
);
export class DataReplicationError extends S.Class<DataReplicationError>(
  "DataReplicationError",
)({ error: S.optional(S.String), rawError: S.optional(S.String) }) {}
export class IdentificationHints extends S.Class<IdentificationHints>(
  "IdentificationHints",
)({
  fqdn: S.optional(S.String),
  hostname: S.optional(S.String),
  vmWareUuid: S.optional(S.String),
  awsInstanceID: S.optional(S.String),
}) {}
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({
  macAddress: S.optional(S.String),
  ips: S.optional(IPsList),
  isPrimary: S.optional(S.Boolean),
}) {}
export const NetworkInterfaces = S.Array(NetworkInterface);
export class Disk extends S.Class<Disk>("Disk")({
  deviceName: S.optional(S.String),
  bytes: S.optional(S.Number),
}) {}
export const Disks = S.Array(Disk);
export class CPU extends S.Class<CPU>("CPU")({
  cores: S.optional(S.Number),
  modelName: S.optional(S.String),
}) {}
export const Cpus = S.Array(CPU);
export class OS extends S.Class<OS>("OS")({
  fullString: S.optional(S.String),
}) {}
export class SourceProperties extends S.Class<SourceProperties>(
  "SourceProperties",
)({
  lastUpdatedDateTime: S.optional(S.String),
  recommendedInstanceType: S.optional(S.String),
  identificationHints: S.optional(IdentificationHints),
  networkInterfaces: S.optional(NetworkInterfaces),
  disks: S.optional(Disks),
  cpus: S.optional(Cpus),
  ramBytes: S.optional(S.Number),
  os: S.optional(OS),
  supportsNitroInstances: S.optional(S.Boolean),
}) {}
export class DataReplicationInitiationStep extends S.Class<DataReplicationInitiationStep>(
  "DataReplicationInitiationStep",
)({ name: S.optional(S.String), status: S.optional(S.String) }) {}
export const DataReplicationInitiationSteps = S.Array(
  DataReplicationInitiationStep,
);
export class LifeCycleLastLaunchInitiated extends S.Class<LifeCycleLastLaunchInitiated>(
  "LifeCycleLastLaunchInitiated",
)({
  apiCallDateTime: S.optional(S.String),
  jobID: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export class DataReplicationInitiation extends S.Class<DataReplicationInitiation>(
  "DataReplicationInitiation",
)({
  startDateTime: S.optional(S.String),
  nextAttemptDateTime: S.optional(S.String),
  steps: S.optional(DataReplicationInitiationSteps),
}) {}
export class LifeCycleLastLaunch extends S.Class<LifeCycleLastLaunch>(
  "LifeCycleLastLaunch",
)({
  initiated: S.optional(LifeCycleLastLaunchInitiated),
  status: S.optional(S.String),
}) {}
export class DataReplicationInfo extends S.Class<DataReplicationInfo>(
  "DataReplicationInfo",
)({
  lagDuration: S.optional(S.String),
  etaDateTime: S.optional(S.String),
  replicatedDisks: S.optional(DataReplicationInfoReplicatedDisks),
  dataReplicationState: S.optional(S.String),
  dataReplicationInitiation: S.optional(DataReplicationInitiation),
  dataReplicationError: S.optional(DataReplicationError),
  stagingAvailabilityZone: S.optional(S.String),
  stagingOutpostArn: S.optional(S.String),
}) {}
export class LifeCycle extends S.Class<LifeCycle>("LifeCycle")({
  addedToServiceDateTime: S.optional(S.String),
  firstByteDateTime: S.optional(S.String),
  elapsedReplicationDuration: S.optional(S.String),
  lastSeenByServiceDateTime: S.optional(S.String),
  lastLaunch: S.optional(LifeCycleLastLaunch),
}) {}
export class SourceServer extends S.Class<SourceServer>("SourceServer")({
  sourceServerID: S.optional(S.String),
  arn: S.optional(S.String),
  tags: S.optional(TagsMap),
  recoveryInstanceId: S.optional(S.String),
  lastLaunchResult: S.optional(S.String),
  dataReplicationInfo: S.optional(DataReplicationInfo),
  lifeCycle: S.optional(LifeCycle),
  sourceProperties: S.optional(SourceProperties),
  stagingArea: S.optional(StagingArea),
  sourceCloudProperties: S.optional(SourceCloudProperties),
  replicationDirection: S.optional(S.String),
  reversedDirectionSourceServerArn: S.optional(S.String),
  sourceNetworkID: S.optional(S.String),
  agentVersion: S.optional(S.String),
}) {}
export class CreateExtendedSourceServerResponse extends S.Class<CreateExtendedSourceServerResponse>(
  "CreateExtendedSourceServerResponse",
)({ sourceServer: S.optional(SourceServer) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String), code: S.optional(S.String) },
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
export class UninitializedAccountException extends S.TaggedError<UninitializedAccountException>()(
  "UninitializedAccountException",
  { message: S.optional(S.String), code: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}

//# Operations
/**
 * Initialize Elastic Disaster Recovery.
 */
export const initializeService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitializeServiceRequest,
  output: InitializeServiceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List all tags for your Elastic Disaster Recovery resources.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds or overwrites only the specified tags for the specified Elastic Disaster Recovery resource or resources. When you specify an existing tag key, the value is overwritten with the new value. Each resource can have a maximum of 50 tags. Each tag consists of a key and optional value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a resource launch action.
 */
export const deleteLaunchAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLaunchActionRequest,
  output: DeleteLaunchActionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Returns a list of source servers on a staging account that are extensible, which means that:
 * a. The source server is not already extended into this Account.
 * b. The source server on the Account we’re reading from is not an extension of another source server.
 */
export const listExtensibleSourceServers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListExtensibleSourceServersRequest,
    output: ListExtensibleSourceServersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);
/**
 * Returns an array of staging accounts for existing extended source servers.
 */
export const listStagingAccounts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStagingAccountsRequest,
  output: ListStagingAccountsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified set of tags from the specified set of Elastic Disaster Recovery resources.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists resource launch actions.
 */
export const listLaunchActions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLaunchActionsRequest,
  output: ListLaunchActionsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Puts a resource launch action.
 */
export const putLaunchAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLaunchActionRequest,
  output: PutLaunchActionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Create an extended source server in the target Account based on the source server in staging account.
 */
export const createExtendedSourceServer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateExtendedSourceServerRequest,
    output: CreateExtendedSourceServerResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      UninitializedAccountException,
      ValidationException,
    ],
  }),
);

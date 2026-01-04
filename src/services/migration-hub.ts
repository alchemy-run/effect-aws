import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Migration Hub",
  serviceShapeName: "AWSMigrationHub",
});
const auth = T.AwsAuthSigv4({ name: "mgh" });
const ver = T.ServiceVersion("2017-05-31");
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
                        url: "https://mgh-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://mgh-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://mgh.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://mgh.{Region}.{PartitionResult#dnsSuffix}",
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
export const ApplicationIds = S.Array(S.String);
export class CreateProgressUpdateStreamRequest extends S.Class<CreateProgressUpdateStreamRequest>(
  "CreateProgressUpdateStreamRequest",
)(
  { ProgressUpdateStreamName: S.String, DryRun: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProgressUpdateStreamResult extends S.Class<CreateProgressUpdateStreamResult>(
  "CreateProgressUpdateStreamResult",
)({}) {}
export class DeleteProgressUpdateStreamRequest extends S.Class<DeleteProgressUpdateStreamRequest>(
  "DeleteProgressUpdateStreamRequest",
)(
  { ProgressUpdateStreamName: S.String, DryRun: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProgressUpdateStreamResult extends S.Class<DeleteProgressUpdateStreamResult>(
  "DeleteProgressUpdateStreamResult",
)({}) {}
export class DescribeApplicationStateRequest extends S.Class<DescribeApplicationStateRequest>(
  "DescribeApplicationStateRequest",
)(
  { ApplicationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMigrationTaskRequest extends S.Class<DescribeMigrationTaskRequest>(
  "DescribeMigrationTaskRequest",
)(
  { ProgressUpdateStream: S.String, MigrationTaskName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateCreatedArtifactRequest extends S.Class<DisassociateCreatedArtifactRequest>(
  "DisassociateCreatedArtifactRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    CreatedArtifactName: S.String,
    DryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateCreatedArtifactResult extends S.Class<DisassociateCreatedArtifactResult>(
  "DisassociateCreatedArtifactResult",
)({}) {}
export class DisassociateDiscoveredResourceRequest extends S.Class<DisassociateDiscoveredResourceRequest>(
  "DisassociateDiscoveredResourceRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    ConfigurationId: S.String,
    DryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateDiscoveredResourceResult extends S.Class<DisassociateDiscoveredResourceResult>(
  "DisassociateDiscoveredResourceResult",
)({}) {}
export class DisassociateSourceResourceRequest extends S.Class<DisassociateSourceResourceRequest>(
  "DisassociateSourceResourceRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    SourceResourceName: S.String,
    DryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateSourceResourceResult extends S.Class<DisassociateSourceResourceResult>(
  "DisassociateSourceResourceResult",
)({}) {}
export class ImportMigrationTaskRequest extends S.Class<ImportMigrationTaskRequest>(
  "ImportMigrationTaskRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    DryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportMigrationTaskResult extends S.Class<ImportMigrationTaskResult>(
  "ImportMigrationTaskResult",
)({}) {}
export class ListApplicationStatesRequest extends S.Class<ListApplicationStatesRequest>(
  "ListApplicationStatesRequest",
)(
  {
    ApplicationIds: S.optional(ApplicationIds),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCreatedArtifactsRequest extends S.Class<ListCreatedArtifactsRequest>(
  "ListCreatedArtifactsRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDiscoveredResourcesRequest extends S.Class<ListDiscoveredResourcesRequest>(
  "ListDiscoveredResourcesRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMigrationTasksRequest extends S.Class<ListMigrationTasksRequest>(
  "ListMigrationTasksRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResourceName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMigrationTaskUpdatesRequest extends S.Class<ListMigrationTaskUpdatesRequest>(
  "ListMigrationTaskUpdatesRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProgressUpdateStreamsRequest extends S.Class<ListProgressUpdateStreamsRequest>(
  "ListProgressUpdateStreamsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSourceResourcesRequest extends S.Class<ListSourceResourcesRequest>(
  "ListSourceResourcesRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NotifyApplicationStateRequest extends S.Class<NotifyApplicationStateRequest>(
  "NotifyApplicationStateRequest",
)(
  {
    ApplicationId: S.String,
    Status: S.String,
    UpdateDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NotifyApplicationStateResult extends S.Class<NotifyApplicationStateResult>(
  "NotifyApplicationStateResult",
)({}) {}
export class CreatedArtifact extends S.Class<CreatedArtifact>(
  "CreatedArtifact",
)({ Name: S.String, Description: S.optional(S.String) }) {}
export class DiscoveredResource extends S.Class<DiscoveredResource>(
  "DiscoveredResource",
)({ ConfigurationId: S.String, Description: S.optional(S.String) }) {}
export class SourceResource extends S.Class<SourceResource>("SourceResource")({
  Name: S.String,
  Description: S.optional(S.String),
  StatusDetail: S.optional(S.String),
}) {}
export const CreatedArtifactList = S.Array(CreatedArtifact);
export const DiscoveredResourceList = S.Array(DiscoveredResource);
export const SourceResourceList = S.Array(SourceResource);
export class Task extends S.Class<Task>("Task")({
  Status: S.String,
  StatusDetail: S.optional(S.String),
  ProgressPercent: S.optional(S.Number),
}) {}
export class ResourceAttribute extends S.Class<ResourceAttribute>(
  "ResourceAttribute",
)({ Type: S.String, Value: S.String }) {}
export const ResourceAttributeList = S.Array(ResourceAttribute);
export class AssociateCreatedArtifactRequest extends S.Class<AssociateCreatedArtifactRequest>(
  "AssociateCreatedArtifactRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    CreatedArtifact: CreatedArtifact,
    DryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateCreatedArtifactResult extends S.Class<AssociateCreatedArtifactResult>(
  "AssociateCreatedArtifactResult",
)({}) {}
export class AssociateDiscoveredResourceRequest extends S.Class<AssociateDiscoveredResourceRequest>(
  "AssociateDiscoveredResourceRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    DiscoveredResource: DiscoveredResource,
    DryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateDiscoveredResourceResult extends S.Class<AssociateDiscoveredResourceResult>(
  "AssociateDiscoveredResourceResult",
)({}) {}
export class AssociateSourceResourceRequest extends S.Class<AssociateSourceResourceRequest>(
  "AssociateSourceResourceRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    SourceResource: SourceResource,
    DryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateSourceResourceResult extends S.Class<AssociateSourceResourceResult>(
  "AssociateSourceResourceResult",
)({}) {}
export class DescribeApplicationStateResult extends S.Class<DescribeApplicationStateResult>(
  "DescribeApplicationStateResult",
)({
  ApplicationStatus: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListCreatedArtifactsResult extends S.Class<ListCreatedArtifactsResult>(
  "ListCreatedArtifactsResult",
)({
  NextToken: S.optional(S.String),
  CreatedArtifactList: S.optional(CreatedArtifactList),
}) {}
export class ListDiscoveredResourcesResult extends S.Class<ListDiscoveredResourcesResult>(
  "ListDiscoveredResourcesResult",
)({
  NextToken: S.optional(S.String),
  DiscoveredResourceList: S.optional(DiscoveredResourceList),
}) {}
export class ListSourceResourcesResult extends S.Class<ListSourceResourcesResult>(
  "ListSourceResourcesResult",
)({
  NextToken: S.optional(S.String),
  SourceResourceList: S.optional(SourceResourceList),
}) {}
export class NotifyMigrationTaskStateRequest extends S.Class<NotifyMigrationTaskStateRequest>(
  "NotifyMigrationTaskStateRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    Task: Task,
    UpdateDateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    NextUpdateSeconds: S.Number,
    DryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NotifyMigrationTaskStateResult extends S.Class<NotifyMigrationTaskStateResult>(
  "NotifyMigrationTaskStateResult",
)({}) {}
export class PutResourceAttributesRequest extends S.Class<PutResourceAttributesRequest>(
  "PutResourceAttributesRequest",
)(
  {
    ProgressUpdateStream: S.String,
    MigrationTaskName: S.String,
    ResourceAttributeList: ResourceAttributeList,
    DryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutResourceAttributesResult extends S.Class<PutResourceAttributesResult>(
  "PutResourceAttributesResult",
)({}) {}
export const LatestResourceAttributeList = S.Array(ResourceAttribute);
export class MigrationTask extends S.Class<MigrationTask>("MigrationTask")({
  ProgressUpdateStream: S.optional(S.String),
  MigrationTaskName: S.optional(S.String),
  Task: S.optional(Task),
  UpdateDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceAttributeList: S.optional(LatestResourceAttributeList),
}) {}
export class ApplicationState extends S.Class<ApplicationState>(
  "ApplicationState",
)({
  ApplicationId: S.optional(S.String),
  ApplicationStatus: S.optional(S.String),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ApplicationStateList = S.Array(ApplicationState);
export class MigrationTaskSummary extends S.Class<MigrationTaskSummary>(
  "MigrationTaskSummary",
)({
  ProgressUpdateStream: S.optional(S.String),
  MigrationTaskName: S.optional(S.String),
  Status: S.optional(S.String),
  ProgressPercent: S.optional(S.Number),
  StatusDetail: S.optional(S.String),
  UpdateDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const MigrationTaskSummaryList = S.Array(MigrationTaskSummary);
export class MigrationTaskUpdate extends S.Class<MigrationTaskUpdate>(
  "MigrationTaskUpdate",
)({
  UpdateDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdateType: S.optional(S.String),
  MigrationTaskState: S.optional(Task),
}) {}
export const MigrationTaskUpdateList = S.Array(MigrationTaskUpdate);
export class ProgressUpdateStreamSummary extends S.Class<ProgressUpdateStreamSummary>(
  "ProgressUpdateStreamSummary",
)({ ProgressUpdateStreamName: S.optional(S.String) }) {}
export const ProgressUpdateStreamSummaryList = S.Array(
  ProgressUpdateStreamSummary,
);
export class DescribeMigrationTaskResult extends S.Class<DescribeMigrationTaskResult>(
  "DescribeMigrationTaskResult",
)({ MigrationTask: S.optional(MigrationTask) }) {}
export class ListApplicationStatesResult extends S.Class<ListApplicationStatesResult>(
  "ListApplicationStatesResult",
)({
  ApplicationStateList: S.optional(ApplicationStateList),
  NextToken: S.optional(S.String),
}) {}
export class ListMigrationTasksResult extends S.Class<ListMigrationTasksResult>(
  "ListMigrationTasksResult",
)({
  NextToken: S.optional(S.String),
  MigrationTaskSummaryList: S.optional(MigrationTaskSummaryList),
}) {}
export class ListMigrationTaskUpdatesResult extends S.Class<ListMigrationTaskUpdatesResult>(
  "ListMigrationTaskUpdatesResult",
)({
  NextToken: S.optional(S.String),
  MigrationTaskUpdateList: S.optional(MigrationTaskUpdateList),
}) {}
export class ListProgressUpdateStreamsResult extends S.Class<ListProgressUpdateStreamsResult>(
  "ListProgressUpdateStreamsResult",
)({
  ProgressUpdateStreamSummaryList: S.optional(ProgressUpdateStreamSummaryList),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class DryRunOperation extends S.TaggedError<DryRunOperation>()(
  "DryRunOperation",
  {},
) {}
export class HomeRegionNotSetException extends S.TaggedError<HomeRegionNotSetException>()(
  "HomeRegionNotSetException",
  {},
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  {},
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class PolicyErrorException extends S.TaggedError<PolicyErrorException>()(
  "PolicyErrorException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class UnauthorizedOperation extends S.TaggedError<UnauthorizedOperation>()(
  "UnauthorizedOperation",
  {},
) {}

//# Operations
/**
 * Creates a progress update stream which is an AWS resource used for access control as
 * well as a namespace for migration task names that is implicitly linked to your AWS account.
 * It must uniquely identify the migration tool as it is used for all updates made by the
 * tool; however, it does not need to be unique for each AWS account because it is scoped to
 * the AWS account.
 */
export const createProgressUpdateStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProgressUpdateStreamRequest,
    output: CreateProgressUpdateStreamResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Deletes a progress update stream, including all of its tasks, which was previously
 * created as an AWS resource used for access control. This API has the following
 * traits:
 *
 * - The only parameter needed for `DeleteProgressUpdateStream` is the
 * stream name (same as a `CreateProgressUpdateStream` call).
 *
 * - The call will return, and a background process will asynchronously delete the
 * stream and all of its resources (tasks, associated resources, resource attributes,
 * created artifacts).
 *
 * - If the stream takes time to be deleted, it might still show up on a
 * `ListProgressUpdateStreams` call.
 *
 * - `CreateProgressUpdateStream`, `ImportMigrationTask`,
 * `NotifyMigrationTaskState`, and all Associate[*] APIs related to the
 * tasks belonging to the stream will throw "InvalidInputException" if the stream of the
 * same name is in the process of being deleted.
 *
 * - Once the stream and all of its resources are deleted,
 * `CreateProgressUpdateStream` for a stream of the same name will
 * succeed, and that stream will be an entirely new logical resource (without any
 * resources associated with the old stream).
 */
export const deleteProgressUpdateStream = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProgressUpdateStreamRequest,
    output: DeleteProgressUpdateStreamResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Gets the migration status of an application.
 */
export const describeApplicationState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeApplicationStateRequest,
    output: DescribeApplicationStateResult,
    errors: [
      AccessDeniedException,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      PolicyErrorException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Disassociates a created artifact of an AWS resource with a migration task performed by a
 * migration tool that was previously associated. This API has the following traits:
 *
 * - A migration user can call the `DisassociateCreatedArtifacts` operation
 * to disassociate a created AWS Artifact from a migration task.
 *
 * - The created artifact name must be provided in ARN (Amazon Resource Name) format
 * which will contain information about type and region; for example:
 * `arn:aws:ec2:us-east-1:488216288981:image/ami-6d0ba87b`.
 *
 * - Examples of the AWS resource behind the created artifact are, AMI's, EC2 instance,
 * or RDS instance, etc.
 */
export const disassociateCreatedArtifact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateCreatedArtifactRequest,
    output: DisassociateCreatedArtifactResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Disassociate an Application Discovery Service discovered resource from a migration
 * task.
 */
export const disassociateDiscoveredResource =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisassociateDiscoveredResourceRequest,
    output: DisassociateDiscoveredResourceResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedOperation,
    ],
  }));
/**
 * Removes the association between a source resource and a migration task.
 */
export const disassociateSourceResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateSourceResourceRequest,
    output: DisassociateSourceResourceResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Registers a new migration task which represents a server, database, etc., being migrated
 * to AWS by a migration tool.
 *
 * This API is a prerequisite to calling the `NotifyMigrationTaskState` API as
 * the migration tool must first register the migration task with Migration Hub.
 */
export const importMigrationTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportMigrationTaskRequest,
  output: ImportMigrationTaskResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    UnauthorizedOperation,
  ],
}));
/**
 * Lists the created artifacts attached to a given migration task in an update stream. This
 * API has the following traits:
 *
 * - Gets the list of the created artifacts while
 * migration is taking place.
 *
 * - Shows the artifacts created by the migration tool that was associated by the
 * `AssociateCreatedArtifact` API.
 *
 * - Lists created artifacts in a paginated interface.
 */
export const listCreatedArtifacts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCreatedArtifactsRequest,
    output: ListCreatedArtifactsResult,
    errors: [
      AccessDeniedException,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists discovered resources associated with the given `MigrationTask`.
 */
export const listDiscoveredResources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDiscoveredResourcesRequest,
    output: ListDiscoveredResourcesResult,
    errors: [
      AccessDeniedException,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists all the source resource that are associated with the specified
 * `MigrationTaskName` and `ProgressUpdateStream`.
 */
export const listSourceResources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSourceResourcesRequest,
  output: ListSourceResourcesResult,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Sets the migration state of an application. For a given application identified by the
 * value passed to `ApplicationId`, its status is set or updated by passing one of
 * three values to `Status`: NOT_STARTED | IN_PROGRESS |
 * COMPLETED.
 */
export const notifyApplicationState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: NotifyApplicationStateRequest,
    output: NotifyApplicationStateResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      PolicyErrorException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Notifies Migration Hub of the current status, progress, or other detail regarding a
 * migration task. This API has the following traits:
 *
 * - Migration tools will call the `NotifyMigrationTaskState` API to share
 * the latest progress and status.
 *
 * - `MigrationTaskName` is used for addressing updates to the correct
 * target.
 *
 * - `ProgressUpdateStream` is used for access control and to provide a
 * namespace for each migration tool.
 */
export const notifyMigrationTaskState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: NotifyMigrationTaskStateRequest,
    output: NotifyMigrationTaskStateResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Provides identifying details of the resource being migrated so that it can be associated
 * in the Application Discovery Service repository. This association occurs asynchronously
 * after `PutResourceAttributes` returns.
 *
 * - Keep in mind that subsequent calls to PutResourceAttributes will override
 * previously stored attributes. For example, if it is first called with a MAC
 * address, but later, it is desired to *add* an IP address, it
 * will then be required to call it with *both* the IP and MAC
 * addresses to prevent overriding the MAC address.
 *
 * - Note the instructions regarding the special use case of the
 * `ResourceAttributeList`
 * parameter when specifying any
 * "VM" related value.
 *
 * Because this is an asynchronous call, it will always return 200, whether an
 * association occurs or not. To confirm if an association was found based on the provided
 * details, call `ListDiscoveredResources`.
 */
export const putResourceAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutResourceAttributesRequest,
    output: PutResourceAttributesResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Associates a created artifact of an AWS cloud resource, the target receiving the
 * migration, with the migration task performed by a migration tool. This API has the
 * following traits:
 *
 * - Migration tools can call the `AssociateCreatedArtifact` operation to
 * indicate which AWS artifact is associated with a migration task.
 *
 * - The created artifact name must be provided in ARN (Amazon Resource Name) format
 * which will contain information about type and region; for example:
 * `arn:aws:ec2:us-east-1:488216288981:image/ami-6d0ba87b`.
 *
 * - Examples of the AWS resource behind the created artifact are, AMI's, EC2 instance,
 * or DMS endpoint, etc.
 */
export const associateCreatedArtifact = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateCreatedArtifactRequest,
    output: AssociateCreatedArtifactResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Associates a discovered resource ID from Application Discovery Service with a migration
 * task.
 */
export const associateDiscoveredResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateDiscoveredResourceRequest,
    output: AssociateDiscoveredResourceResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      PolicyErrorException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Associates a source resource with a migration task. For example, the source resource can
 * be a source server, an application, or a migration wave.
 */
export const associateSourceResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateSourceResourceRequest,
    output: AssociateSourceResourceResult,
    errors: [
      AccessDeniedException,
      DryRunOperation,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      UnauthorizedOperation,
    ],
  }),
);
/**
 * Retrieves a list of all attributes associated with a specific migration task.
 */
export const describeMigrationTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeMigrationTaskRequest,
    output: DescribeMigrationTaskResult,
    errors: [
      AccessDeniedException,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists all the migration statuses for your applications. If you use the optional
 * `ApplicationIds` parameter, only the migration statuses for those
 * applications will be returned.
 */
export const listApplicationStates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListApplicationStatesRequest,
    output: ListApplicationStatesResult,
    errors: [
      AccessDeniedException,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists all, or filtered by resource name, migration tasks associated with the user
 * account making this call. This API has the following traits:
 *
 * - Can show a summary list of the most recent migration tasks.
 *
 * - Can show a summary list of migration tasks associated with a given discovered
 * resource.
 *
 * - Lists migration tasks in a paginated interface.
 */
export const listMigrationTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMigrationTasksRequest,
  output: ListMigrationTasksResult,
  errors: [
    AccessDeniedException,
    HomeRegionNotSetException,
    InternalServerError,
    InvalidInputException,
    PolicyErrorException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * This is a paginated API that returns all the migration-task states for the specified
 * `MigrationTaskName` and `ProgressUpdateStream`.
 */
export const listMigrationTaskUpdates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMigrationTaskUpdatesRequest,
    output: ListMigrationTaskUpdatesResult,
    errors: [
      AccessDeniedException,
      InternalServerError,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Lists progress update streams associated with the user account making this call.
 */
export const listProgressUpdateStreams = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListProgressUpdateStreamsRequest,
    output: ListProgressUpdateStreamsResult,
    errors: [
      AccessDeniedException,
      HomeRegionNotSetException,
      InternalServerError,
      InvalidInputException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);

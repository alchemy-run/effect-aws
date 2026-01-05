import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Scheduler",
  serviceShapeName: "AWSChronosService",
});
const auth = T.AwsAuthSigv4({ name: "scheduler" });
const ver = T.ServiceVersion("2021-06-30");
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
                                url: "https://scheduler-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://scheduler-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://scheduler.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://scheduler.{Region}.{PartitionResult#dnsSuffix}",
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
    TagKeys: TagKeyList.pipe(T.HttpQuery("TagKeys")),
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
export class GetScheduleInput extends S.Class<GetScheduleInput>(
  "GetScheduleInput",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    GroupName: S.optional(S.String).pipe(T.HttpQuery("groupName")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/schedules/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeadLetterConfig extends S.Class<DeadLetterConfig>(
  "DeadLetterConfig",
)({ Arn: S.optional(S.String) }) {}
export class RetryPolicy extends S.Class<RetryPolicy>("RetryPolicy")({
  MaximumEventAgeInSeconds: S.optional(S.Number),
  MaximumRetryAttempts: S.optional(S.Number),
}) {}
export const Subnets = S.Array(S.String);
export const SecurityGroups = S.Array(S.String);
export class AwsVpcConfiguration extends S.Class<AwsVpcConfiguration>(
  "AwsVpcConfiguration",
)({
  Subnets: Subnets,
  SecurityGroups: S.optional(SecurityGroups),
  AssignPublicIp: S.optional(S.String),
}) {}
export class NetworkConfiguration extends S.Class<NetworkConfiguration>(
  "NetworkConfiguration",
)({ awsvpcConfiguration: S.optional(AwsVpcConfiguration) }) {}
export class CapacityProviderStrategyItem extends S.Class<CapacityProviderStrategyItem>(
  "CapacityProviderStrategyItem",
)({
  capacityProvider: S.String,
  weight: S.optional(S.Number),
  base: S.optional(S.Number),
}) {}
export const CapacityProviderStrategy = S.Array(CapacityProviderStrategyItem);
export class PlacementConstraint extends S.Class<PlacementConstraint>(
  "PlacementConstraint",
)({ type: S.optional(S.String), expression: S.optional(S.String) }) {}
export const PlacementConstraints = S.Array(PlacementConstraint);
export class PlacementStrategy extends S.Class<PlacementStrategy>(
  "PlacementStrategy",
)({ type: S.optional(S.String), field: S.optional(S.String) }) {}
export const PlacementStrategies = S.Array(PlacementStrategy);
export const TagMap = S.Record({ key: S.String, value: S.String });
export const Tags = S.Array(TagMap);
export class EcsParameters extends S.Class<EcsParameters>("EcsParameters")({
  TaskDefinitionArn: S.String,
  TaskCount: S.optional(S.Number),
  LaunchType: S.optional(S.String),
  NetworkConfiguration: S.optional(NetworkConfiguration),
  PlatformVersion: S.optional(S.String),
  Group: S.optional(S.String),
  CapacityProviderStrategy: S.optional(CapacityProviderStrategy),
  EnableECSManagedTags: S.optional(S.Boolean),
  EnableExecuteCommand: S.optional(S.Boolean),
  PlacementConstraints: S.optional(PlacementConstraints),
  PlacementStrategy: S.optional(PlacementStrategies),
  PropagateTags: S.optional(S.String),
  ReferenceId: S.optional(S.String),
  Tags: S.optional(Tags),
}) {}
export class EventBridgeParameters extends S.Class<EventBridgeParameters>(
  "EventBridgeParameters",
)({ DetailType: S.String, Source: S.String }) {}
export class KinesisParameters extends S.Class<KinesisParameters>(
  "KinesisParameters",
)({ PartitionKey: S.String }) {}
export class SageMakerPipelineParameter extends S.Class<SageMakerPipelineParameter>(
  "SageMakerPipelineParameter",
)({ Name: S.String, Value: S.String }) {}
export const SageMakerPipelineParameterList = S.Array(
  SageMakerPipelineParameter,
);
export class SageMakerPipelineParameters extends S.Class<SageMakerPipelineParameters>(
  "SageMakerPipelineParameters",
)({ PipelineParameterList: S.optional(SageMakerPipelineParameterList) }) {}
export class SqsParameters extends S.Class<SqsParameters>("SqsParameters")({
  MessageGroupId: S.optional(S.String),
}) {}
export class Target extends S.Class<Target>("Target")({
  Arn: S.String,
  RoleArn: S.String,
  DeadLetterConfig: S.optional(DeadLetterConfig),
  RetryPolicy: S.optional(RetryPolicy),
  Input: S.optional(S.String),
  EcsParameters: S.optional(EcsParameters),
  EventBridgeParameters: S.optional(EventBridgeParameters),
  KinesisParameters: S.optional(KinesisParameters),
  SageMakerPipelineParameters: S.optional(SageMakerPipelineParameters),
  SqsParameters: S.optional(SqsParameters),
}) {}
export class FlexibleTimeWindow extends S.Class<FlexibleTimeWindow>(
  "FlexibleTimeWindow",
)({ Mode: S.String, MaximumWindowInMinutes: S.optional(S.Number) }) {}
export class UpdateScheduleInput extends S.Class<UpdateScheduleInput>(
  "UpdateScheduleInput",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    GroupName: S.optional(S.String),
    ScheduleExpression: S.String,
    StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    ScheduleExpressionTimezone: S.optional(S.String),
    State: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    Target: Target,
    FlexibleTimeWindow: FlexibleTimeWindow,
    ClientToken: S.optional(S.String),
    ActionAfterCompletion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/schedules/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScheduleInput extends S.Class<DeleteScheduleInput>(
  "DeleteScheduleInput",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    GroupName: S.optional(S.String).pipe(T.HttpQuery("groupName")),
    ClientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/schedules/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScheduleOutput extends S.Class<DeleteScheduleOutput>(
  "DeleteScheduleOutput",
)({}) {}
export class ListSchedulesInput extends S.Class<ListSchedulesInput>(
  "ListSchedulesInput",
)(
  {
    GroupName: S.optional(S.String).pipe(T.HttpQuery("ScheduleGroup")),
    NamePrefix: S.optional(S.String).pipe(T.HttpQuery("NamePrefix")),
    State: S.optional(S.String).pipe(T.HttpQuery("State")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/schedules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateScheduleGroupInput extends S.Class<CreateScheduleGroupInput>(
  "CreateScheduleGroupInput",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/schedule-groups/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetScheduleGroupInput extends S.Class<GetScheduleGroupInput>(
  "GetScheduleGroupInput",
)(
  { Name: S.String.pipe(T.HttpLabel("Name")) },
  T.all(
    T.Http({ method: "GET", uri: "/schedule-groups/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScheduleGroupInput extends S.Class<DeleteScheduleGroupInput>(
  "DeleteScheduleGroupInput",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    ClientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/schedule-groups/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScheduleGroupOutput extends S.Class<DeleteScheduleGroupOutput>(
  "DeleteScheduleGroupOutput",
)({}) {}
export class ListScheduleGroupsInput extends S.Class<ListScheduleGroupsInput>(
  "ListScheduleGroupsInput",
)(
  {
    NamePrefix: S.optional(S.String).pipe(T.HttpQuery("NamePrefix")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/schedule-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: S.optional(TagList) }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagList },
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
export class GetScheduleOutput extends S.Class<GetScheduleOutput>(
  "GetScheduleOutput",
)({
  Arn: S.optional(S.String),
  GroupName: S.optional(S.String),
  Name: S.optional(S.String),
  ScheduleExpression: S.optional(S.String),
  StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
  ScheduleExpressionTimezone: S.optional(S.String),
  State: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  KmsKeyArn: S.optional(S.String),
  Target: S.optional(Target),
  FlexibleTimeWindow: S.optional(FlexibleTimeWindow),
  ActionAfterCompletion: S.optional(S.String),
}) {}
export class UpdateScheduleOutput extends S.Class<UpdateScheduleOutput>(
  "UpdateScheduleOutput",
)({ ScheduleArn: S.String }) {}
export class CreateScheduleGroupOutput extends S.Class<CreateScheduleGroupOutput>(
  "CreateScheduleGroupOutput",
)({ ScheduleGroupArn: S.String }) {}
export class GetScheduleGroupOutput extends S.Class<GetScheduleGroupOutput>(
  "GetScheduleGroupOutput",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  State: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class ScheduleGroupSummary extends S.Class<ScheduleGroupSummary>(
  "ScheduleGroupSummary",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  State: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ScheduleGroupList = S.Array(ScheduleGroupSummary);
export class ListScheduleGroupsOutput extends S.Class<ListScheduleGroupsOutput>(
  "ListScheduleGroupsOutput",
)({ NextToken: S.optional(S.String), ScheduleGroups: ScheduleGroupList }) {}
export class TargetSummary extends S.Class<TargetSummary>("TargetSummary")({
  Arn: S.String,
}) {}
export class ScheduleSummary extends S.Class<ScheduleSummary>(
  "ScheduleSummary",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  GroupName: S.optional(S.String),
  State: S.optional(S.String),
  CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationDate: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Target: S.optional(TargetSummary),
}) {}
export const ScheduleList = S.Array(ScheduleSummary);
export class ListSchedulesOutput extends S.Class<ListSchedulesOutput>(
  "ListSchedulesOutput",
)({ NextToken: S.optional(S.String), Schedules: ScheduleList }) {}
export class CreateScheduleInput extends S.Class<CreateScheduleInput>(
  "CreateScheduleInput",
)(
  {
    Name: S.String.pipe(T.HttpLabel("Name")),
    GroupName: S.optional(S.String),
    ScheduleExpression: S.String,
    StartDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    ScheduleExpressionTimezone: S.optional(S.String),
    State: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    Target: Target,
    FlexibleTimeWindow: FlexibleTimeWindow,
    ClientToken: S.optional(S.String),
    ActionAfterCompletion: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/schedules/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateScheduleOutput extends S.Class<CreateScheduleOutput>(
  "CreateScheduleOutput",
)({ ScheduleArn: S.String }) {}

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
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
 * Returns a paginated list of your schedule groups.
 */
export const listScheduleGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListScheduleGroupsInput,
    output: ListScheduleGroupsOutput,
    errors: [InternalServerException, ThrottlingException, ValidationException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ScheduleGroups",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates the specified schedule group.
 */
export const createScheduleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScheduleGroupInput,
  output: CreateScheduleGroupOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from the specified EventBridge Scheduler schedule group.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the specified schedule.
 */
export const getSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetScheduleInput,
  output: GetScheduleOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the specified schedule. When you call `UpdateSchedule`, EventBridge Scheduler uses all values, including empty values, specified in the request and
 * overrides the existing schedule. This is by design. This means that if you do not set an optional field in your request, that field will be set to
 * its system-default value after the update.
 *
 * Before calling this operation, we recommend that you call the `GetSchedule` API operation and make a note of all optional parameters
 * for your `UpdateSchedule` call.
 */
export const updateSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateScheduleInput,
  output: UpdateScheduleOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the specified schedule group.
 */
export const getScheduleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetScheduleGroupInput,
  output: GetScheduleGroupOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified schedule.
 */
export const deleteSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduleInput,
  output: DeleteScheduleOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified schedule group. Deleting a schedule group results in EventBridge Scheduler deleting all schedules associated with the group.
 * When you delete a group, it remains in a `DELETING` state until all of its associated schedules are deleted.
 * Schedules associated with the group that are set to run while the schedule group is in the process of being deleted might continue to invoke their targets
 * until the schedule group and its associated schedules are deleted.
 *
 * This operation is eventually consistent.
 */
export const deleteScheduleGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduleGroupInput,
  output: DeleteScheduleGroupOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified EventBridge Scheduler resource. You can only assign tags to schedule groups.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags associated with the Scheduler resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a paginated list of your EventBridge Scheduler schedules.
 */
export const listSchedules = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListSchedulesInput,
    output: ListSchedulesOutput,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Schedules",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates the specified schedule.
 */
export const createSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScheduleInput,
  output: CreateScheduleOutput,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

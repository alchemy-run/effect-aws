import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Scheduler",
  serviceShapeName: "AWSChronosService",
});
const auth = T.AwsAuthSigv4({ name: "scheduler" });
const ver = T.ServiceVersion("2021-06-30");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://scheduler-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://scheduler-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://scheduler.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://scheduler.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type TagResourceArn = string;
export type TagKey = string;
export type Name = string;
export type ScheduleGroupName = string;
export type ScheduleExpression = string;
export type Description = string;
export type ScheduleExpressionTimezone = string;
export type ScheduleState = string;
export type KmsKeyArn = string;
export type ClientToken = string;
export type ActionAfterCompletion = string;
export type NamePrefix = string;
export type NextToken = string;
export type MaxResults = number;
export type ScheduleGroupNamePrefix = string;
export type TagValue = string;
export type TargetArn = string;
export type RoleArn = string;
export type TargetInput = string;
export type FlexibleTimeWindowMode = string;
export type MaximumWindowInMinutes = number;
export type ScheduleArn = string;
export type ScheduleGroupArn = string;
export type ScheduleGroupState = string;
export type ResourceArn = string;
export type MaximumEventAgeInSeconds = number;
export type MaximumRetryAttempts = number;
export type TaskDefinitionArn = string;
export type TaskCount = number;
export type LaunchType = string;
export type PlatformVersion = string;
export type Group = string;
export type PropagateTags = string;
export type ReferenceId = string;
export type DetailType = string;
export type Source = string;
export type TargetPartitionKey = string;
export type MessageGroupId = string;
export type CapacityProvider = string;
export type CapacityProviderStrategyItemWeight = number;
export type CapacityProviderStrategyItemBase = number;
export type PlacementConstraintType = string;
export type PlacementConstraintExpression = string;
export type PlacementStrategyType = string;
export type PlacementStrategyField = string;
export type SageMakerPipelineParameterName = string;
export type SageMakerPipelineParameterValue = string;
export type Subnet = string;
export type SecurityGroup = string;
export type AssignPublicIp = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface ListTagsForResourceInput {
  ResourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface UntagResourceInput {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("TagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface GetScheduleInput {
  Name: string;
  GroupName?: string;
}
export const GetScheduleInput = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    GroupName: S.optional(S.String).pipe(T.HttpQuery("groupName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/schedules/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetScheduleInput",
}) as any as S.Schema<GetScheduleInput>;
export interface DeadLetterConfig {
  Arn?: string;
}
export const DeadLetterConfig = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "DeadLetterConfig",
}) as any as S.Schema<DeadLetterConfig>;
export interface RetryPolicy {
  MaximumEventAgeInSeconds?: number;
  MaximumRetryAttempts?: number;
}
export const RetryPolicy = S.suspend(() =>
  S.Struct({
    MaximumEventAgeInSeconds: S.optional(S.Number),
    MaximumRetryAttempts: S.optional(S.Number),
  }),
).annotations({ identifier: "RetryPolicy" }) as any as S.Schema<RetryPolicy>;
export type Subnets = string[];
export const Subnets = S.Array(S.String);
export type SecurityGroups = string[];
export const SecurityGroups = S.Array(S.String);
export interface AwsVpcConfiguration {
  Subnets: Subnets;
  SecurityGroups?: SecurityGroups;
  AssignPublicIp?: string;
}
export const AwsVpcConfiguration = S.suspend(() =>
  S.Struct({
    Subnets: Subnets,
    SecurityGroups: S.optional(SecurityGroups),
    AssignPublicIp: S.optional(S.String),
  }),
).annotations({
  identifier: "AwsVpcConfiguration",
}) as any as S.Schema<AwsVpcConfiguration>;
export interface NetworkConfiguration {
  awsvpcConfiguration?: AwsVpcConfiguration;
}
export const NetworkConfiguration = S.suspend(() =>
  S.Struct({ awsvpcConfiguration: S.optional(AwsVpcConfiguration) }),
).annotations({
  identifier: "NetworkConfiguration",
}) as any as S.Schema<NetworkConfiguration>;
export interface CapacityProviderStrategyItem {
  capacityProvider: string;
  weight?: number;
  base?: number;
}
export const CapacityProviderStrategyItem = S.suspend(() =>
  S.Struct({
    capacityProvider: S.String,
    weight: S.optional(S.Number),
    base: S.optional(S.Number),
  }),
).annotations({
  identifier: "CapacityProviderStrategyItem",
}) as any as S.Schema<CapacityProviderStrategyItem>;
export type CapacityProviderStrategy = CapacityProviderStrategyItem[];
export const CapacityProviderStrategy = S.Array(CapacityProviderStrategyItem);
export interface PlacementConstraint {
  type?: string;
  expression?: string;
}
export const PlacementConstraint = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), expression: S.optional(S.String) }),
).annotations({
  identifier: "PlacementConstraint",
}) as any as S.Schema<PlacementConstraint>;
export type PlacementConstraints = PlacementConstraint[];
export const PlacementConstraints = S.Array(PlacementConstraint);
export interface PlacementStrategy {
  type?: string;
  field?: string;
}
export const PlacementStrategy = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), field: S.optional(S.String) }),
).annotations({
  identifier: "PlacementStrategy",
}) as any as S.Schema<PlacementStrategy>;
export type PlacementStrategies = PlacementStrategy[];
export const PlacementStrategies = S.Array(PlacementStrategy);
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export type Tags = TagMap[];
export const Tags = S.Array(TagMap);
export interface EcsParameters {
  TaskDefinitionArn: string;
  TaskCount?: number;
  LaunchType?: string;
  NetworkConfiguration?: NetworkConfiguration;
  PlatformVersion?: string;
  Group?: string;
  CapacityProviderStrategy?: CapacityProviderStrategy;
  EnableECSManagedTags?: boolean;
  EnableExecuteCommand?: boolean;
  PlacementConstraints?: PlacementConstraints;
  PlacementStrategy?: PlacementStrategies;
  PropagateTags?: string;
  ReferenceId?: string;
  Tags?: Tags;
}
export const EcsParameters = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "EcsParameters",
}) as any as S.Schema<EcsParameters>;
export interface EventBridgeParameters {
  DetailType: string;
  Source: string;
}
export const EventBridgeParameters = S.suspend(() =>
  S.Struct({ DetailType: S.String, Source: S.String }),
).annotations({
  identifier: "EventBridgeParameters",
}) as any as S.Schema<EventBridgeParameters>;
export interface KinesisParameters {
  PartitionKey: string;
}
export const KinesisParameters = S.suspend(() =>
  S.Struct({ PartitionKey: S.String }),
).annotations({
  identifier: "KinesisParameters",
}) as any as S.Schema<KinesisParameters>;
export interface SageMakerPipelineParameter {
  Name: string;
  Value: string;
}
export const SageMakerPipelineParameter = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "SageMakerPipelineParameter",
}) as any as S.Schema<SageMakerPipelineParameter>;
export type SageMakerPipelineParameterList = SageMakerPipelineParameter[];
export const SageMakerPipelineParameterList = S.Array(
  SageMakerPipelineParameter,
);
export interface SageMakerPipelineParameters {
  PipelineParameterList?: SageMakerPipelineParameterList;
}
export const SageMakerPipelineParameters = S.suspend(() =>
  S.Struct({
    PipelineParameterList: S.optional(SageMakerPipelineParameterList),
  }),
).annotations({
  identifier: "SageMakerPipelineParameters",
}) as any as S.Schema<SageMakerPipelineParameters>;
export interface SqsParameters {
  MessageGroupId?: string;
}
export const SqsParameters = S.suspend(() =>
  S.Struct({ MessageGroupId: S.optional(S.String) }),
).annotations({
  identifier: "SqsParameters",
}) as any as S.Schema<SqsParameters>;
export interface Target {
  Arn: string;
  RoleArn: string;
  DeadLetterConfig?: DeadLetterConfig;
  RetryPolicy?: RetryPolicy;
  Input?: string;
  EcsParameters?: EcsParameters;
  EventBridgeParameters?: EventBridgeParameters;
  KinesisParameters?: KinesisParameters;
  SageMakerPipelineParameters?: SageMakerPipelineParameters;
  SqsParameters?: SqsParameters;
}
export const Target = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Target" }) as any as S.Schema<Target>;
export interface FlexibleTimeWindow {
  Mode: string;
  MaximumWindowInMinutes?: number;
}
export const FlexibleTimeWindow = S.suspend(() =>
  S.Struct({ Mode: S.String, MaximumWindowInMinutes: S.optional(S.Number) }),
).annotations({
  identifier: "FlexibleTimeWindow",
}) as any as S.Schema<FlexibleTimeWindow>;
export interface UpdateScheduleInput {
  Name: string;
  GroupName?: string;
  ScheduleExpression: string;
  StartDate?: Date;
  EndDate?: Date;
  Description?: string;
  ScheduleExpressionTimezone?: string;
  State?: string;
  KmsKeyArn?: string;
  Target: Target;
  FlexibleTimeWindow: FlexibleTimeWindow;
  ClientToken?: string;
  ActionAfterCompletion?: string;
}
export const UpdateScheduleInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/schedules/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateScheduleInput",
}) as any as S.Schema<UpdateScheduleInput>;
export interface DeleteScheduleInput {
  Name: string;
  GroupName?: string;
  ClientToken?: string;
}
export const DeleteScheduleInput = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    GroupName: S.optional(S.String).pipe(T.HttpQuery("groupName")),
    ClientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/schedules/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteScheduleInput",
}) as any as S.Schema<DeleteScheduleInput>;
export interface DeleteScheduleOutput {}
export const DeleteScheduleOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteScheduleOutput",
}) as any as S.Schema<DeleteScheduleOutput>;
export interface ListSchedulesInput {
  GroupName?: string;
  NamePrefix?: string;
  State?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListSchedulesInput = S.suspend(() =>
  S.Struct({
    GroupName: S.optional(S.String).pipe(T.HttpQuery("ScheduleGroup")),
    NamePrefix: S.optional(S.String).pipe(T.HttpQuery("NamePrefix")),
    State: S.optional(S.String).pipe(T.HttpQuery("State")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/schedules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSchedulesInput",
}) as any as S.Schema<ListSchedulesInput>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateScheduleGroupInput {
  Name: string;
  Tags?: TagList;
  ClientToken?: string;
}
export const CreateScheduleGroupInput = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/schedule-groups/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateScheduleGroupInput",
}) as any as S.Schema<CreateScheduleGroupInput>;
export interface GetScheduleGroupInput {
  Name: string;
}
export const GetScheduleGroupInput = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/schedule-groups/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetScheduleGroupInput",
}) as any as S.Schema<GetScheduleGroupInput>;
export interface DeleteScheduleGroupInput {
  Name: string;
  ClientToken?: string;
}
export const DeleteScheduleGroupInput = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    ClientToken: S.optional(S.String).pipe(T.HttpQuery("clientToken")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/schedule-groups/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteScheduleGroupInput",
}) as any as S.Schema<DeleteScheduleGroupInput>;
export interface DeleteScheduleGroupOutput {}
export const DeleteScheduleGroupOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteScheduleGroupOutput",
}) as any as S.Schema<DeleteScheduleGroupOutput>;
export interface ListScheduleGroupsInput {
  NamePrefix?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListScheduleGroupsInput = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String).pipe(T.HttpQuery("NamePrefix")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/schedule-groups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListScheduleGroupsInput",
}) as any as S.Schema<ListScheduleGroupsInput>;
export interface ListTagsForResourceOutput {
  Tags?: TagList;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  ResourceArn: string;
  Tags: TagList;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface GetScheduleOutput {
  Arn?: string;
  GroupName?: string;
  Name?: string;
  ScheduleExpression?: string;
  StartDate?: Date;
  EndDate?: Date;
  Description?: string;
  ScheduleExpressionTimezone?: string;
  State?: string;
  CreationDate?: Date;
  LastModificationDate?: Date;
  KmsKeyArn?: string;
  Target?: Target;
  FlexibleTimeWindow?: FlexibleTimeWindow;
  ActionAfterCompletion?: string;
}
export const GetScheduleOutput = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetScheduleOutput",
}) as any as S.Schema<GetScheduleOutput>;
export interface UpdateScheduleOutput {
  ScheduleArn: string;
}
export const UpdateScheduleOutput = S.suspend(() =>
  S.Struct({ ScheduleArn: S.String }),
).annotations({
  identifier: "UpdateScheduleOutput",
}) as any as S.Schema<UpdateScheduleOutput>;
export interface CreateScheduleGroupOutput {
  ScheduleGroupArn: string;
}
export const CreateScheduleGroupOutput = S.suspend(() =>
  S.Struct({ ScheduleGroupArn: S.String }),
).annotations({
  identifier: "CreateScheduleGroupOutput",
}) as any as S.Schema<CreateScheduleGroupOutput>;
export interface GetScheduleGroupOutput {
  Arn?: string;
  Name?: string;
  State?: string;
  CreationDate?: Date;
  LastModificationDate?: Date;
}
export const GetScheduleGroupOutput = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    State: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "GetScheduleGroupOutput",
}) as any as S.Schema<GetScheduleGroupOutput>;
export interface ScheduleGroupSummary {
  Arn?: string;
  Name?: string;
  State?: string;
  CreationDate?: Date;
  LastModificationDate?: Date;
}
export const ScheduleGroupSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    State: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ScheduleGroupSummary",
}) as any as S.Schema<ScheduleGroupSummary>;
export type ScheduleGroupList = ScheduleGroupSummary[];
export const ScheduleGroupList = S.Array(ScheduleGroupSummary);
export interface ListScheduleGroupsOutput {
  NextToken?: string;
  ScheduleGroups: ScheduleGroupList;
}
export const ListScheduleGroupsOutput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ScheduleGroups: ScheduleGroupList,
  }),
).annotations({
  identifier: "ListScheduleGroupsOutput",
}) as any as S.Schema<ListScheduleGroupsOutput>;
export interface TargetSummary {
  Arn: string;
}
export const TargetSummary = S.suspend(() =>
  S.Struct({ Arn: S.String }),
).annotations({
  identifier: "TargetSummary",
}) as any as S.Schema<TargetSummary>;
export interface ScheduleSummary {
  Arn?: string;
  Name?: string;
  GroupName?: string;
  State?: string;
  CreationDate?: Date;
  LastModificationDate?: Date;
  Target?: TargetSummary;
}
export const ScheduleSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    GroupName: S.optional(S.String),
    State: S.optional(S.String),
    CreationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModificationDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Target: S.optional(TargetSummary),
  }),
).annotations({
  identifier: "ScheduleSummary",
}) as any as S.Schema<ScheduleSummary>;
export type ScheduleList = ScheduleSummary[];
export const ScheduleList = S.Array(ScheduleSummary);
export interface ListSchedulesOutput {
  NextToken?: string;
  Schedules: ScheduleList;
}
export const ListSchedulesOutput = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Schedules: ScheduleList }),
).annotations({
  identifier: "ListSchedulesOutput",
}) as any as S.Schema<ListSchedulesOutput>;
export interface CreateScheduleInput {
  Name: string;
  GroupName?: string;
  ScheduleExpression: string;
  StartDate?: Date;
  EndDate?: Date;
  Description?: string;
  ScheduleExpressionTimezone?: string;
  State?: string;
  KmsKeyArn?: string;
  Target: Target;
  FlexibleTimeWindow: FlexibleTimeWindow;
  ClientToken?: string;
  ActionAfterCompletion?: string;
}
export const CreateScheduleInput = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/schedules/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateScheduleInput",
}) as any as S.Schema<CreateScheduleInput>;
export interface CreateScheduleOutput {
  ScheduleArn: string;
}
export const CreateScheduleOutput = S.suspend(() =>
  S.Struct({ ScheduleArn: S.String }),
).annotations({
  identifier: "CreateScheduleOutput",
}) as any as S.Schema<CreateScheduleOutput>;

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a paginated list of your schedule groups.
 */
export const listScheduleGroups: {
  (
    input: ListScheduleGroupsInput,
  ): Effect.Effect<
    ListScheduleGroupsOutput,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListScheduleGroupsInput,
  ) => Stream.Stream<
    ListScheduleGroupsOutput,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListScheduleGroupsInput,
  ) => Stream.Stream<
    ScheduleGroupSummary,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListScheduleGroupsInput,
  output: ListScheduleGroupsOutput,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ScheduleGroups",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates the specified schedule group.
 */
export const createScheduleGroup: (
  input: CreateScheduleGroupInput,
) => Effect.Effect<
  CreateScheduleGroupOutput,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSchedule: (
  input: GetScheduleInput,
) => Effect.Effect<
  GetScheduleOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSchedule: (
  input: UpdateScheduleInput,
) => Effect.Effect<
  UpdateScheduleOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getScheduleGroup: (
  input: GetScheduleGroupInput,
) => Effect.Effect<
  GetScheduleGroupOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSchedule: (
  input: DeleteScheduleInput,
) => Effect.Effect<
  DeleteScheduleOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteScheduleGroup: (
  input: DeleteScheduleGroupInput,
) => Effect.Effect<
  DeleteScheduleGroupOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listSchedules: {
  (
    input: ListSchedulesInput,
  ): Effect.Effect<
    ListSchedulesOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchedulesInput,
  ) => Stream.Stream<
    ListSchedulesOutput,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchedulesInput,
  ) => Stream.Stream<
    ScheduleSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Creates the specified schedule.
 */
export const createSchedule: (
  input: CreateScheduleInput,
) => Effect.Effect<
  CreateScheduleOutput,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

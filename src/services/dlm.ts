import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({ sdkId: "DLM", serviceShapeName: "dlm_20180112" });
const auth = T.AwsAuthSigv4({ name: "dlm" });
const ver = T.ServiceVersion("2018-01-12");
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
              `https://dlm-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://dlm.${Region}.amazonaws.com`);
            }
            return e(
              `https://dlm-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://dlm.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://dlm.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ExecutionRoleArn = string;
export type PolicyDescription = string;
export type CreateInterval = number;
export type RetainInterval = number;
export type CopyTagsNullable = boolean;
export type ExtendDeletion = boolean;
export type PolicyId = string;
export type TagFilter = string;
export type PolicyArn = string;
export type TagKey = string;
export type TagValue = string;
export type TargetRegion = string;
export type ExcludeBootVolumes = boolean;
export type VolumeTypeValues = string;
export type ErrorMessage = string;
export type ErrorCode = string;
export type ScheduleName = string;
export type CopyTags = boolean;
export type ExcludeBootVolume = boolean;
export type NoReboot = boolean;
export type ActionName = string;
export type DefaultPolicy = boolean;
export type StatusMessage = string;
export type Interval = number;
export type CronExpression = string;
export type StandardTierRetainRuleCount = number;
export type StandardTierRetainRuleInterval = number;
export type Count = number;
export type AvailabilityZone = string;
export type Target = string;
export type Encrypted = boolean;
export type CmkArn = string;
export type AwsAccountId = string;
export type DescriptionRegex = string;
export type Parameter = string;
export type ExecutionHandler = string;
export type ExecuteOperationOnScriptFailure = boolean;
export type ScriptExecutionTimeout = number;
export type ScriptMaximumRetryCount = number;

//# Schemas
export type SettablePolicyStateValues = "ENABLED" | "DISABLED" | (string & {});
export const SettablePolicyStateValues = S.String;
export type DefaultPolicyTypeValues = "VOLUME" | "INSTANCE" | (string & {});
export const DefaultPolicyTypeValues = S.String;
export type PolicyIdList = string[];
export const PolicyIdList = S.Array(S.String);
export type GettablePolicyStateValues =
  | "ENABLED"
  | "DISABLED"
  | "ERROR"
  | (string & {});
export const GettablePolicyStateValues = S.String;
export type ResourceTypeValues = "VOLUME" | "INSTANCE" | (string & {});
export const ResourceTypeValues = S.String;
export type ResourceTypeValuesList = ResourceTypeValues[];
export const ResourceTypeValuesList = S.Array(ResourceTypeValues);
export type TargetTagsFilterList = string[];
export const TargetTagsFilterList = S.Array(S.String);
export type TagsToAddFilterList = string[];
export const TagsToAddFilterList = S.Array(S.String);
export type DefaultPoliciesTypeValues =
  | "VOLUME"
  | "INSTANCE"
  | "ALL"
  | (string & {});
export const DefaultPoliciesTypeValues = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteLifecyclePolicyRequest {
  PolicyId: string;
}
export const DeleteLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({ PolicyId: S.String.pipe(T.HttpLabel("PolicyId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/policies/{PolicyId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLifecyclePolicyRequest",
}) as any as S.Schema<DeleteLifecyclePolicyRequest>;
export interface DeleteLifecyclePolicyResponse {}
export const DeleteLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLifecyclePolicyResponse",
}) as any as S.Schema<DeleteLifecyclePolicyResponse>;
export interface GetLifecyclePoliciesRequest {
  PolicyIds?: string[];
  State?: GettablePolicyStateValues;
  ResourceTypes?: ResourceTypeValues[];
  TargetTags?: string[];
  TagsToAdd?: string[];
  DefaultPolicyType?: DefaultPoliciesTypeValues;
}
export const GetLifecyclePoliciesRequest = S.suspend(() =>
  S.Struct({
    PolicyIds: S.optional(PolicyIdList).pipe(T.HttpQuery("policyIds")),
    State: S.optional(GettablePolicyStateValues).pipe(T.HttpQuery("state")),
    ResourceTypes: S.optional(ResourceTypeValuesList).pipe(
      T.HttpQuery("resourceTypes"),
    ),
    TargetTags: S.optional(TargetTagsFilterList).pipe(
      T.HttpQuery("targetTags"),
    ),
    TagsToAdd: S.optional(TagsToAddFilterList).pipe(T.HttpQuery("tagsToAdd")),
    DefaultPolicyType: S.optional(DefaultPoliciesTypeValues).pipe(
      T.HttpQuery("defaultPolicyType"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLifecyclePoliciesRequest",
}) as any as S.Schema<GetLifecyclePoliciesRequest>;
export interface GetLifecyclePolicyRequest {
  PolicyId: string;
}
export const GetLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({ PolicyId: S.String.pipe(T.HttpLabel("PolicyId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/policies/{PolicyId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLifecyclePolicyRequest",
}) as any as S.Schema<GetLifecyclePolicyRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface TagResourceRequest {
  ResourceArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(TagMap),
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
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys?: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: S.optional(TagKeyList).pipe(T.HttpQuery("tagKeys")),
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type PolicyTypeValues =
  | "EBS_SNAPSHOT_MANAGEMENT"
  | "IMAGE_MANAGEMENT"
  | "EVENT_BASED_POLICY"
  | (string & {});
export const PolicyTypeValues = S.String;
export type ResourceLocationValues =
  | "CLOUD"
  | "OUTPOST"
  | "LOCAL_ZONE"
  | (string & {});
export const ResourceLocationValues = S.String;
export type ResourceLocationList = ResourceLocationValues[];
export const ResourceLocationList = S.Array(ResourceLocationValues);
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TargetTagList = Tag[];
export const TargetTagList = S.Array(Tag);
export type TagsToAddList = Tag[];
export const TagsToAddList = S.Array(Tag);
export type VariableTagsList = Tag[];
export const VariableTagsList = S.Array(Tag);
export type LocationValues =
  | "CLOUD"
  | "OUTPOST_LOCAL"
  | "LOCAL_ZONE"
  | (string & {});
export const LocationValues = S.String;
export type IntervalUnitValues = "HOURS" | (string & {});
export const IntervalUnitValues = S.String;
export type TimesList = string[];
export const TimesList = S.Array(S.String);
export type StageValues = "PRE" | "POST" | (string & {});
export const StageValues = S.String;
export type StagesList = StageValues[];
export const StagesList = S.Array(StageValues);
export type ExecutionHandlerServiceValues =
  | "AWS_SYSTEMS_MANAGER"
  | (string & {});
export const ExecutionHandlerServiceValues = S.String;
export interface Script {
  Stages?: StageValues[];
  ExecutionHandlerService?: ExecutionHandlerServiceValues;
  ExecutionHandler?: string;
  ExecuteOperationOnScriptFailure?: boolean;
  ExecutionTimeout?: number;
  MaximumRetryCount?: number;
}
export const Script = S.suspend(() =>
  S.Struct({
    Stages: S.optional(StagesList),
    ExecutionHandlerService: S.optional(ExecutionHandlerServiceValues),
    ExecutionHandler: S.optional(S.String),
    ExecuteOperationOnScriptFailure: S.optional(S.Boolean),
    ExecutionTimeout: S.optional(S.Number),
    MaximumRetryCount: S.optional(S.Number),
  }),
).annotations({ identifier: "Script" }) as any as S.Schema<Script>;
export type ScriptsList = Script[];
export const ScriptsList = S.Array(Script);
export interface CreateRule {
  Location?: LocationValues;
  Interval?: number;
  IntervalUnit?: IntervalUnitValues;
  Times?: string[];
  CronExpression?: string;
  Scripts?: Script[];
}
export const CreateRule = S.suspend(() =>
  S.Struct({
    Location: S.optional(LocationValues),
    Interval: S.optional(S.Number),
    IntervalUnit: S.optional(IntervalUnitValues),
    Times: S.optional(TimesList),
    CronExpression: S.optional(S.String),
    Scripts: S.optional(ScriptsList),
  }),
).annotations({ identifier: "CreateRule" }) as any as S.Schema<CreateRule>;
export type RetentionIntervalUnitValues =
  | "DAYS"
  | "WEEKS"
  | "MONTHS"
  | "YEARS"
  | (string & {});
export const RetentionIntervalUnitValues = S.String;
export interface RetainRule {
  Count?: number;
  Interval?: number;
  IntervalUnit?: RetentionIntervalUnitValues;
}
export const RetainRule = S.suspend(() =>
  S.Struct({
    Count: S.optional(S.Number),
    Interval: S.optional(S.Number),
    IntervalUnit: S.optional(RetentionIntervalUnitValues),
  }),
).annotations({ identifier: "RetainRule" }) as any as S.Schema<RetainRule>;
export type AvailabilityZoneList = string[];
export const AvailabilityZoneList = S.Array(S.String);
export interface FastRestoreRule {
  Count?: number;
  Interval?: number;
  IntervalUnit?: RetentionIntervalUnitValues;
  AvailabilityZones?: string[];
}
export const FastRestoreRule = S.suspend(() =>
  S.Struct({
    Count: S.optional(S.Number),
    Interval: S.optional(S.Number),
    IntervalUnit: S.optional(RetentionIntervalUnitValues),
    AvailabilityZones: S.optional(AvailabilityZoneList),
  }),
).annotations({
  identifier: "FastRestoreRule",
}) as any as S.Schema<FastRestoreRule>;
export interface CrossRegionCopyRetainRule {
  Interval?: number;
  IntervalUnit?: RetentionIntervalUnitValues;
}
export const CrossRegionCopyRetainRule = S.suspend(() =>
  S.Struct({
    Interval: S.optional(S.Number),
    IntervalUnit: S.optional(RetentionIntervalUnitValues),
  }),
).annotations({
  identifier: "CrossRegionCopyRetainRule",
}) as any as S.Schema<CrossRegionCopyRetainRule>;
export interface CrossRegionCopyDeprecateRule {
  Interval?: number;
  IntervalUnit?: RetentionIntervalUnitValues;
}
export const CrossRegionCopyDeprecateRule = S.suspend(() =>
  S.Struct({
    Interval: S.optional(S.Number),
    IntervalUnit: S.optional(RetentionIntervalUnitValues),
  }),
).annotations({
  identifier: "CrossRegionCopyDeprecateRule",
}) as any as S.Schema<CrossRegionCopyDeprecateRule>;
export interface CrossRegionCopyRule {
  TargetRegion?: string;
  Target?: string;
  Encrypted?: boolean;
  CmkArn?: string;
  CopyTags?: boolean;
  RetainRule?: CrossRegionCopyRetainRule;
  DeprecateRule?: CrossRegionCopyDeprecateRule;
}
export const CrossRegionCopyRule = S.suspend(() =>
  S.Struct({
    TargetRegion: S.optional(S.String),
    Target: S.optional(S.String),
    Encrypted: S.optional(S.Boolean),
    CmkArn: S.optional(S.String),
    CopyTags: S.optional(S.Boolean),
    RetainRule: S.optional(CrossRegionCopyRetainRule),
    DeprecateRule: S.optional(CrossRegionCopyDeprecateRule),
  }),
).annotations({
  identifier: "CrossRegionCopyRule",
}) as any as S.Schema<CrossRegionCopyRule>;
export type CrossRegionCopyRules = CrossRegionCopyRule[];
export const CrossRegionCopyRules = S.Array(CrossRegionCopyRule);
export type ShareTargetAccountList = string[];
export const ShareTargetAccountList = S.Array(S.String);
export interface ShareRule {
  TargetAccounts?: string[];
  UnshareInterval?: number;
  UnshareIntervalUnit?: RetentionIntervalUnitValues;
}
export const ShareRule = S.suspend(() =>
  S.Struct({
    TargetAccounts: S.optional(ShareTargetAccountList),
    UnshareInterval: S.optional(S.Number),
    UnshareIntervalUnit: S.optional(RetentionIntervalUnitValues),
  }),
).annotations({ identifier: "ShareRule" }) as any as S.Schema<ShareRule>;
export type ShareRules = ShareRule[];
export const ShareRules = S.Array(ShareRule);
export interface DeprecateRule {
  Count?: number;
  Interval?: number;
  IntervalUnit?: RetentionIntervalUnitValues;
}
export const DeprecateRule = S.suspend(() =>
  S.Struct({
    Count: S.optional(S.Number),
    Interval: S.optional(S.Number),
    IntervalUnit: S.optional(RetentionIntervalUnitValues),
  }),
).annotations({
  identifier: "DeprecateRule",
}) as any as S.Schema<DeprecateRule>;
export interface RetentionArchiveTier {
  Count?: number;
  Interval?: number;
  IntervalUnit?: RetentionIntervalUnitValues;
}
export const RetentionArchiveTier = S.suspend(() =>
  S.Struct({
    Count: S.optional(S.Number),
    Interval: S.optional(S.Number),
    IntervalUnit: S.optional(RetentionIntervalUnitValues),
  }),
).annotations({
  identifier: "RetentionArchiveTier",
}) as any as S.Schema<RetentionArchiveTier>;
export interface ArchiveRetainRule {
  RetentionArchiveTier?: RetentionArchiveTier;
}
export const ArchiveRetainRule = S.suspend(() =>
  S.Struct({ RetentionArchiveTier: S.optional(RetentionArchiveTier) }),
).annotations({
  identifier: "ArchiveRetainRule",
}) as any as S.Schema<ArchiveRetainRule>;
export interface ArchiveRule {
  RetainRule?: ArchiveRetainRule;
}
export const ArchiveRule = S.suspend(() =>
  S.Struct({ RetainRule: S.optional(ArchiveRetainRule) }),
).annotations({ identifier: "ArchiveRule" }) as any as S.Schema<ArchiveRule>;
export interface Schedule {
  Name?: string;
  CopyTags?: boolean;
  TagsToAdd?: Tag[];
  VariableTags?: Tag[];
  CreateRule?: CreateRule;
  RetainRule?: RetainRule;
  FastRestoreRule?: FastRestoreRule;
  CrossRegionCopyRules?: CrossRegionCopyRule[];
  ShareRules?: ShareRule[];
  DeprecateRule?: DeprecateRule;
  ArchiveRule?: ArchiveRule;
}
export const Schedule = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CopyTags: S.optional(S.Boolean),
    TagsToAdd: S.optional(TagsToAddList),
    VariableTags: S.optional(VariableTagsList),
    CreateRule: S.optional(CreateRule),
    RetainRule: S.optional(RetainRule),
    FastRestoreRule: S.optional(FastRestoreRule),
    CrossRegionCopyRules: S.optional(CrossRegionCopyRules),
    ShareRules: S.optional(ShareRules),
    DeprecateRule: S.optional(DeprecateRule),
    ArchiveRule: S.optional(ArchiveRule),
  }),
).annotations({ identifier: "Schedule" }) as any as S.Schema<Schedule>;
export type ScheduleList = Schedule[];
export const ScheduleList = S.Array(Schedule);
export type ExcludeDataVolumeTagList = Tag[];
export const ExcludeDataVolumeTagList = S.Array(Tag);
export interface Parameters {
  ExcludeBootVolume?: boolean;
  NoReboot?: boolean;
  ExcludeDataVolumeTags?: Tag[];
}
export const Parameters = S.suspend(() =>
  S.Struct({
    ExcludeBootVolume: S.optional(S.Boolean),
    NoReboot: S.optional(S.Boolean),
    ExcludeDataVolumeTags: S.optional(ExcludeDataVolumeTagList),
  }),
).annotations({ identifier: "Parameters" }) as any as S.Schema<Parameters>;
export type EventSourceValues = "MANAGED_CWE" | (string & {});
export const EventSourceValues = S.String;
export type EventTypeValues = "shareSnapshot" | (string & {});
export const EventTypeValues = S.String;
export type SnapshotOwnerList = string[];
export const SnapshotOwnerList = S.Array(S.String);
export interface EventParameters {
  EventType?: EventTypeValues;
  SnapshotOwner?: string[];
  DescriptionRegex?: string;
}
export const EventParameters = S.suspend(() =>
  S.Struct({
    EventType: S.optional(EventTypeValues),
    SnapshotOwner: S.optional(SnapshotOwnerList),
    DescriptionRegex: S.optional(S.String),
  }),
).annotations({
  identifier: "EventParameters",
}) as any as S.Schema<EventParameters>;
export interface EventSource {
  Type?: EventSourceValues;
  Parameters?: EventParameters;
}
export const EventSource = S.suspend(() =>
  S.Struct({
    Type: S.optional(EventSourceValues),
    Parameters: S.optional(EventParameters),
  }),
).annotations({ identifier: "EventSource" }) as any as S.Schema<EventSource>;
export interface EncryptionConfiguration {
  Encrypted?: boolean;
  CmkArn?: string;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({ Encrypted: S.optional(S.Boolean), CmkArn: S.optional(S.String) }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface CrossRegionCopyAction {
  Target?: string;
  EncryptionConfiguration?: EncryptionConfiguration;
  RetainRule?: CrossRegionCopyRetainRule;
}
export const CrossRegionCopyAction = S.suspend(() =>
  S.Struct({
    Target: S.optional(S.String),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    RetainRule: S.optional(CrossRegionCopyRetainRule),
  }),
).annotations({
  identifier: "CrossRegionCopyAction",
}) as any as S.Schema<CrossRegionCopyAction>;
export type CrossRegionCopyActionList = CrossRegionCopyAction[];
export const CrossRegionCopyActionList = S.Array(CrossRegionCopyAction);
export interface Action {
  Name?: string;
  CrossRegionCopy?: CrossRegionCopyAction[];
}
export const Action = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CrossRegionCopy: S.optional(CrossRegionCopyActionList),
  }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export type ActionList = Action[];
export const ActionList = S.Array(Action);
export type PolicyLanguageValues = "SIMPLIFIED" | "STANDARD" | (string & {});
export const PolicyLanguageValues = S.String;
export interface CrossRegionCopyTarget {
  TargetRegion?: string;
}
export const CrossRegionCopyTarget = S.suspend(() =>
  S.Struct({ TargetRegion: S.optional(S.String) }),
).annotations({
  identifier: "CrossRegionCopyTarget",
}) as any as S.Schema<CrossRegionCopyTarget>;
export type CrossRegionCopyTargetList = CrossRegionCopyTarget[];
export const CrossRegionCopyTargetList = S.Array(CrossRegionCopyTarget);
export type ExcludeVolumeTypesList = string[];
export const ExcludeVolumeTypesList = S.Array(S.String);
export type ExcludeTagsList = Tag[];
export const ExcludeTagsList = S.Array(Tag);
export interface Exclusions {
  ExcludeBootVolumes?: boolean;
  ExcludeVolumeTypes?: string[];
  ExcludeTags?: Tag[];
}
export const Exclusions = S.suspend(() =>
  S.Struct({
    ExcludeBootVolumes: S.optional(S.Boolean),
    ExcludeVolumeTypes: S.optional(ExcludeVolumeTypesList),
    ExcludeTags: S.optional(ExcludeTagsList),
  }),
).annotations({ identifier: "Exclusions" }) as any as S.Schema<Exclusions>;
export interface PolicyDetails {
  PolicyType?: PolicyTypeValues;
  ResourceTypes?: ResourceTypeValues[];
  ResourceLocations?: ResourceLocationValues[];
  TargetTags?: Tag[];
  Schedules?: Schedule[];
  Parameters?: Parameters;
  EventSource?: EventSource;
  Actions?: Action[];
  PolicyLanguage?: PolicyLanguageValues;
  ResourceType?: ResourceTypeValues;
  CreateInterval?: number;
  RetainInterval?: number;
  CopyTags?: boolean;
  CrossRegionCopyTargets?: CrossRegionCopyTarget[];
  ExtendDeletion?: boolean;
  Exclusions?: Exclusions;
}
export const PolicyDetails = S.suspend(() =>
  S.Struct({
    PolicyType: S.optional(PolicyTypeValues),
    ResourceTypes: S.optional(ResourceTypeValuesList),
    ResourceLocations: S.optional(ResourceLocationList),
    TargetTags: S.optional(TargetTagList),
    Schedules: S.optional(ScheduleList),
    Parameters: S.optional(Parameters),
    EventSource: S.optional(EventSource),
    Actions: S.optional(ActionList),
    PolicyLanguage: S.optional(PolicyLanguageValues),
    ResourceType: S.optional(ResourceTypeValues),
    CreateInterval: S.optional(S.Number),
    RetainInterval: S.optional(S.Number),
    CopyTags: S.optional(S.Boolean),
    CrossRegionCopyTargets: S.optional(CrossRegionCopyTargetList),
    ExtendDeletion: S.optional(S.Boolean),
    Exclusions: S.optional(Exclusions),
  }),
).annotations({
  identifier: "PolicyDetails",
}) as any as S.Schema<PolicyDetails>;
export interface UpdateLifecyclePolicyRequest {
  PolicyId: string;
  ExecutionRoleArn?: string;
  State?: SettablePolicyStateValues;
  Description?: string;
  PolicyDetails?: PolicyDetails;
  CreateInterval?: number;
  RetainInterval?: number;
  CopyTags?: boolean;
  ExtendDeletion?: boolean;
  CrossRegionCopyTargets?: CrossRegionCopyTarget[];
  Exclusions?: Exclusions;
}
export const UpdateLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyId: S.String.pipe(T.HttpLabel("PolicyId")),
    ExecutionRoleArn: S.optional(S.String),
    State: S.optional(SettablePolicyStateValues),
    Description: S.optional(S.String),
    PolicyDetails: S.optional(PolicyDetails),
    CreateInterval: S.optional(S.Number),
    RetainInterval: S.optional(S.Number),
    CopyTags: S.optional(S.Boolean),
    ExtendDeletion: S.optional(S.Boolean),
    CrossRegionCopyTargets: S.optional(CrossRegionCopyTargetList),
    Exclusions: S.optional(Exclusions),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/policies/{PolicyId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLifecyclePolicyRequest",
}) as any as S.Schema<UpdateLifecyclePolicyRequest>;
export interface UpdateLifecyclePolicyResponse {}
export const UpdateLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLifecyclePolicyResponse",
}) as any as S.Schema<UpdateLifecyclePolicyResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface LifecyclePolicySummary {
  PolicyId?: string;
  Description?: string;
  State?: GettablePolicyStateValues;
  Tags?: { [key: string]: string | undefined };
  PolicyType?: PolicyTypeValues;
  DefaultPolicy?: boolean;
}
export const LifecyclePolicySummary = S.suspend(() =>
  S.Struct({
    PolicyId: S.optional(S.String),
    Description: S.optional(S.String),
    State: S.optional(GettablePolicyStateValues),
    Tags: S.optional(TagMap),
    PolicyType: S.optional(PolicyTypeValues),
    DefaultPolicy: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LifecyclePolicySummary",
}) as any as S.Schema<LifecyclePolicySummary>;
export type LifecyclePolicySummaryList = LifecyclePolicySummary[];
export const LifecyclePolicySummaryList = S.Array(LifecyclePolicySummary);
export interface LifecyclePolicy {
  PolicyId?: string;
  Description?: string;
  State?: GettablePolicyStateValues;
  StatusMessage?: string;
  ExecutionRoleArn?: string;
  DateCreated?: Date;
  DateModified?: Date;
  PolicyDetails?: PolicyDetails;
  Tags?: { [key: string]: string | undefined };
  PolicyArn?: string;
  DefaultPolicy?: boolean;
}
export const LifecyclePolicy = S.suspend(() =>
  S.Struct({
    PolicyId: S.optional(S.String),
    Description: S.optional(S.String),
    State: S.optional(GettablePolicyStateValues),
    StatusMessage: S.optional(S.String),
    ExecutionRoleArn: S.optional(S.String),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DateModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PolicyDetails: S.optional(PolicyDetails),
    Tags: S.optional(TagMap),
    PolicyArn: S.optional(S.String),
    DefaultPolicy: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LifecyclePolicy",
}) as any as S.Schema<LifecyclePolicy>;
export type ParameterList = string[];
export const ParameterList = S.Array(S.String);
export interface GetLifecyclePoliciesResponse {
  Policies?: LifecyclePolicySummary[];
}
export const GetLifecyclePoliciesResponse = S.suspend(() =>
  S.Struct({ Policies: S.optional(LifecyclePolicySummaryList) }),
).annotations({
  identifier: "GetLifecyclePoliciesResponse",
}) as any as S.Schema<GetLifecyclePoliciesResponse>;
export interface GetLifecyclePolicyResponse {
  Policy?: LifecyclePolicy & {
    PolicyDetails: PolicyDetails & {
      TargetTags: (Tag & { Key: string; Value: string })[];
      Schedules: (Schedule & {
        TagsToAdd: (Tag & { Key: string; Value: string })[];
        VariableTags: (Tag & { Key: string; Value: string })[];
        CreateRule: CreateRule & {
          Scripts: (Script & { ExecutionHandler: ExecutionHandler })[];
        };
        FastRestoreRule: FastRestoreRule & {
          AvailabilityZones: AvailabilityZoneList;
        };
        CrossRegionCopyRules: (CrossRegionCopyRule & {
          Encrypted: Encrypted;
        })[];
        ShareRules: (ShareRule & { TargetAccounts: ShareTargetAccountList })[];
        ArchiveRule: ArchiveRule & {
          RetainRule: ArchiveRetainRule & {
            RetentionArchiveTier: RetentionArchiveTier;
          };
        };
      })[];
      Parameters: Parameters & {
        ExcludeDataVolumeTags: (Tag & { Key: string; Value: string })[];
      };
      EventSource: EventSource & {
        Type: EventSourceValues;
        Parameters: EventParameters & {
          EventType: EventTypeValues;
          SnapshotOwner: SnapshotOwnerList;
          DescriptionRegex: DescriptionRegex;
        };
      };
      Actions: (Action & {
        Name: ActionName;
        CrossRegionCopy: (CrossRegionCopyAction & {
          Target: Target;
          EncryptionConfiguration: EncryptionConfiguration & {
            Encrypted: Encrypted;
          };
        })[];
      })[];
      Exclusions: Exclusions & {
        ExcludeTags: (Tag & { Key: string; Value: string })[];
      };
    };
  };
}
export const GetLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(LifecyclePolicy) }),
).annotations({
  identifier: "GetLifecyclePolicyResponse",
}) as any as S.Schema<GetLifecyclePolicyResponse>;
export interface CreateLifecyclePolicyRequest {
  ExecutionRoleArn?: string;
  Description?: string;
  State?: SettablePolicyStateValues;
  PolicyDetails?: PolicyDetails;
  Tags?: { [key: string]: string | undefined };
  DefaultPolicy?: DefaultPolicyTypeValues;
  CreateInterval?: number;
  RetainInterval?: number;
  CopyTags?: boolean;
  ExtendDeletion?: boolean;
  CrossRegionCopyTargets?: CrossRegionCopyTarget[];
  Exclusions?: Exclusions;
}
export const CreateLifecyclePolicyRequest = S.suspend(() =>
  S.Struct({
    ExecutionRoleArn: S.optional(S.String),
    Description: S.optional(S.String),
    State: S.optional(SettablePolicyStateValues),
    PolicyDetails: S.optional(PolicyDetails),
    Tags: S.optional(TagMap),
    DefaultPolicy: S.optional(DefaultPolicyTypeValues),
    CreateInterval: S.optional(S.Number),
    RetainInterval: S.optional(S.Number),
    CopyTags: S.optional(S.Boolean),
    ExtendDeletion: S.optional(S.Boolean),
    CrossRegionCopyTargets: S.optional(CrossRegionCopyTargetList),
    Exclusions: S.optional(Exclusions),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLifecyclePolicyRequest",
}) as any as S.Schema<CreateLifecyclePolicyRequest>;
export interface CreateLifecyclePolicyResponse {
  PolicyId?: string;
}
export const CreateLifecyclePolicyResponse = S.suspend(() =>
  S.Struct({ PolicyId: S.optional(S.String) }),
).annotations({
  identifier: "CreateLifecyclePolicyResponse",
}) as any as S.Schema<CreateLifecyclePolicyResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
).pipe(C.withServerError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    ResourceType: S.optional(S.String),
  },
).pipe(C.withThrottlingError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    RequiredParameters: S.optional(ParameterList),
    MutuallyExclusiveParameters: S.optional(ParameterList),
  },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    Code: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ResourceIds: S.optional(PolicyIdList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes the specified lifecycle policy and halts the automated operations that the
 * policy specified.
 *
 * For more information about deleting a policy, see Delete lifecycle
 * policies.
 */
export const deleteLifecyclePolicy: (
  input: DeleteLifecyclePolicyRequest,
) => effect.Effect<
  DeleteLifecyclePolicyResponse,
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLifecyclePolicyRequest,
  output: DeleteLifecyclePolicyResponse,
  errors: [
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets detailed information about the specified lifecycle policy.
 */
export const getLifecyclePolicy: (
  input: GetLifecyclePolicyRequest,
) => effect.Effect<
  GetLifecyclePolicyResponse,
  | InternalServerException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLifecyclePolicyRequest,
  output: GetLifecyclePolicyResponse,
  errors: [
    InternalServerException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds the specified tags to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the specified lifecycle policy.
 *
 * For more information about updating a policy, see Modify lifecycle
 * policies.
 */
export const updateLifecyclePolicy: (
  input: UpdateLifecyclePolicyRequest,
) => effect.Effect<
  UpdateLifecyclePolicyResponse,
  | InternalServerException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLifecyclePolicyRequest,
  output: UpdateLifecyclePolicyResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets summary information about all or the specified data lifecycle policies.
 *
 * To get complete information about a policy, use GetLifecyclePolicy.
 */
export const getLifecyclePolicies: (
  input: GetLifecyclePoliciesRequest,
) => effect.Effect<
  GetLifecyclePoliciesResponse,
  | InternalServerException
  | InvalidRequestException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLifecyclePoliciesRequest,
  output: GetLifecyclePoliciesResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an Amazon Data Lifecycle Manager lifecycle policy. Amazon Data Lifecycle Manager supports the following policy types:
 *
 * - Custom EBS snapshot policy
 *
 * - Custom EBS-backed AMI policy
 *
 * - Cross-account copy event policy
 *
 * - Default policy for EBS snapshots
 *
 * - Default policy for EBS-backed AMIs
 *
 * For more information, see
 * Default policies vs custom policies.
 *
 * If you create a default policy, you can specify the request parameters either in
 * the request body, or in the PolicyDetails request structure, but not both.
 */
export const createLifecyclePolicy: (
  input: CreateLifecyclePolicyRequest,
) => effect.Effect<
  CreateLifecyclePolicyResponse,
  | InternalServerException
  | InvalidRequestException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLifecyclePolicyRequest,
  output: CreateLifecyclePolicyResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    LimitExceededException,
  ],
}));

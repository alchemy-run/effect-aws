import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({ sdkId: "DLM", serviceShapeName: "dlm_20180112" });
const auth = T.AwsAuthSigv4({ name: "dlm" });
const ver = T.ServiceVersion("2018-01-12");
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
                        url: "https://dlm-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://dlm.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://dlm-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://dlm.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://dlm.{Region}.{PartitionResult#dnsSuffix}",
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
export const PolicyIdList = S.Array(S.String);
export const ResourceTypeValuesList = S.Array(S.String);
export const TargetTagsFilterList = S.Array(S.String);
export const TagsToAddFilterList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeleteLifecyclePolicyRequest extends S.Class<DeleteLifecyclePolicyRequest>(
  "DeleteLifecyclePolicyRequest",
)(
  { PolicyId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/policies/{PolicyId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLifecyclePolicyResponse extends S.Class<DeleteLifecyclePolicyResponse>(
  "DeleteLifecyclePolicyResponse",
)({}) {}
export class GetLifecyclePoliciesRequest extends S.Class<GetLifecyclePoliciesRequest>(
  "GetLifecyclePoliciesRequest",
)(
  {
    PolicyIds: S.optional(PolicyIdList).pipe(T.HttpQuery("policyIds")),
    State: S.optional(S.String).pipe(T.HttpQuery("state")),
    ResourceTypes: S.optional(ResourceTypeValuesList).pipe(
      T.HttpQuery("resourceTypes"),
    ),
    TargetTags: S.optional(TargetTagsFilterList).pipe(
      T.HttpQuery("targetTags"),
    ),
    TagsToAdd: S.optional(TagsToAddFilterList).pipe(T.HttpQuery("tagsToAdd")),
    DefaultPolicyType: S.optional(S.String).pipe(
      T.HttpQuery("defaultPolicyType"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLifecyclePolicyRequest extends S.Class<GetLifecyclePolicyRequest>(
  "GetLifecyclePolicyRequest",
)(
  { PolicyId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/policies/{PolicyId}" }),
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
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: TagMap },
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
export const ResourceLocationList = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TargetTagList = S.Array(Tag);
export const TagsToAddList = S.Array(Tag);
export const VariableTagsList = S.Array(Tag);
export const TimesList = S.Array(S.String);
export const StagesList = S.Array(S.String);
export class Script extends S.Class<Script>("Script")({
  Stages: S.optional(StagesList),
  ExecutionHandlerService: S.optional(S.String),
  ExecutionHandler: S.String,
  ExecuteOperationOnScriptFailure: S.optional(S.Boolean),
  ExecutionTimeout: S.optional(S.Number),
  MaximumRetryCount: S.optional(S.Number),
}) {}
export const ScriptsList = S.Array(Script);
export class CreateRule extends S.Class<CreateRule>("CreateRule")({
  Location: S.optional(S.String),
  Interval: S.optional(S.Number),
  IntervalUnit: S.optional(S.String),
  Times: S.optional(TimesList),
  CronExpression: S.optional(S.String),
  Scripts: S.optional(ScriptsList),
}) {}
export class RetainRule extends S.Class<RetainRule>("RetainRule")({
  Count: S.optional(S.Number),
  Interval: S.optional(S.Number),
  IntervalUnit: S.optional(S.String),
}) {}
export const AvailabilityZoneList = S.Array(S.String);
export class FastRestoreRule extends S.Class<FastRestoreRule>(
  "FastRestoreRule",
)({
  Count: S.optional(S.Number),
  Interval: S.optional(S.Number),
  IntervalUnit: S.optional(S.String),
  AvailabilityZones: AvailabilityZoneList,
}) {}
export class CrossRegionCopyRetainRule extends S.Class<CrossRegionCopyRetainRule>(
  "CrossRegionCopyRetainRule",
)({ Interval: S.optional(S.Number), IntervalUnit: S.optional(S.String) }) {}
export class CrossRegionCopyDeprecateRule extends S.Class<CrossRegionCopyDeprecateRule>(
  "CrossRegionCopyDeprecateRule",
)({ Interval: S.optional(S.Number), IntervalUnit: S.optional(S.String) }) {}
export class CrossRegionCopyRule extends S.Class<CrossRegionCopyRule>(
  "CrossRegionCopyRule",
)({
  TargetRegion: S.optional(S.String),
  Target: S.optional(S.String),
  Encrypted: S.Boolean,
  CmkArn: S.optional(S.String),
  CopyTags: S.optional(S.Boolean),
  RetainRule: S.optional(CrossRegionCopyRetainRule),
  DeprecateRule: S.optional(CrossRegionCopyDeprecateRule),
}) {}
export const CrossRegionCopyRules = S.Array(CrossRegionCopyRule);
export const ShareTargetAccountList = S.Array(S.String);
export class ShareRule extends S.Class<ShareRule>("ShareRule")({
  TargetAccounts: ShareTargetAccountList,
  UnshareInterval: S.optional(S.Number),
  UnshareIntervalUnit: S.optional(S.String),
}) {}
export const ShareRules = S.Array(ShareRule);
export class DeprecateRule extends S.Class<DeprecateRule>("DeprecateRule")({
  Count: S.optional(S.Number),
  Interval: S.optional(S.Number),
  IntervalUnit: S.optional(S.String),
}) {}
export class RetentionArchiveTier extends S.Class<RetentionArchiveTier>(
  "RetentionArchiveTier",
)({
  Count: S.optional(S.Number),
  Interval: S.optional(S.Number),
  IntervalUnit: S.optional(S.String),
}) {}
export class ArchiveRetainRule extends S.Class<ArchiveRetainRule>(
  "ArchiveRetainRule",
)({ RetentionArchiveTier: RetentionArchiveTier }) {}
export class ArchiveRule extends S.Class<ArchiveRule>("ArchiveRule")({
  RetainRule: ArchiveRetainRule,
}) {}
export class Schedule extends S.Class<Schedule>("Schedule")({
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
}) {}
export const ScheduleList = S.Array(Schedule);
export const ExcludeDataVolumeTagList = S.Array(Tag);
export class Parameters extends S.Class<Parameters>("Parameters")({
  ExcludeBootVolume: S.optional(S.Boolean),
  NoReboot: S.optional(S.Boolean),
  ExcludeDataVolumeTags: S.optional(ExcludeDataVolumeTagList),
}) {}
export const SnapshotOwnerList = S.Array(S.String);
export class EventParameters extends S.Class<EventParameters>(
  "EventParameters",
)({
  EventType: S.String,
  SnapshotOwner: SnapshotOwnerList,
  DescriptionRegex: S.String,
}) {}
export class EventSource extends S.Class<EventSource>("EventSource")({
  Type: S.String,
  Parameters: S.optional(EventParameters),
}) {}
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({ Encrypted: S.Boolean, CmkArn: S.optional(S.String) }) {}
export class CrossRegionCopyAction extends S.Class<CrossRegionCopyAction>(
  "CrossRegionCopyAction",
)({
  Target: S.String,
  EncryptionConfiguration: EncryptionConfiguration,
  RetainRule: S.optional(CrossRegionCopyRetainRule),
}) {}
export const CrossRegionCopyActionList = S.Array(CrossRegionCopyAction);
export class Action extends S.Class<Action>("Action")({
  Name: S.String,
  CrossRegionCopy: CrossRegionCopyActionList,
}) {}
export const ActionList = S.Array(Action);
export class CrossRegionCopyTarget extends S.Class<CrossRegionCopyTarget>(
  "CrossRegionCopyTarget",
)({ TargetRegion: S.optional(S.String) }) {}
export const CrossRegionCopyTargetList = S.Array(CrossRegionCopyTarget);
export const ExcludeVolumeTypesList = S.Array(S.String);
export const ExcludeTagsList = S.Array(Tag);
export class Exclusions extends S.Class<Exclusions>("Exclusions")({
  ExcludeBootVolumes: S.optional(S.Boolean),
  ExcludeVolumeTypes: S.optional(ExcludeVolumeTypesList),
  ExcludeTags: S.optional(ExcludeTagsList),
}) {}
export class PolicyDetails extends S.Class<PolicyDetails>("PolicyDetails")({
  PolicyType: S.optional(S.String),
  ResourceTypes: S.optional(ResourceTypeValuesList),
  ResourceLocations: S.optional(ResourceLocationList),
  TargetTags: S.optional(TargetTagList),
  Schedules: S.optional(ScheduleList),
  Parameters: S.optional(Parameters),
  EventSource: S.optional(EventSource),
  Actions: S.optional(ActionList),
  PolicyLanguage: S.optional(S.String),
  ResourceType: S.optional(S.String),
  CreateInterval: S.optional(S.Number),
  RetainInterval: S.optional(S.Number),
  CopyTags: S.optional(S.Boolean),
  CrossRegionCopyTargets: S.optional(CrossRegionCopyTargetList),
  ExtendDeletion: S.optional(S.Boolean),
  Exclusions: S.optional(Exclusions),
}) {}
export class UpdateLifecyclePolicyRequest extends S.Class<UpdateLifecyclePolicyRequest>(
  "UpdateLifecyclePolicyRequest",
)(
  {
    PolicyId: S.String.pipe(T.HttpLabel()),
    ExecutionRoleArn: S.optional(S.String),
    State: S.optional(S.String),
    Description: S.optional(S.String),
    PolicyDetails: S.optional(PolicyDetails),
    CreateInterval: S.optional(S.Number),
    RetainInterval: S.optional(S.Number),
    CopyTags: S.optional(S.Boolean),
    ExtendDeletion: S.optional(S.Boolean),
    CrossRegionCopyTargets: S.optional(CrossRegionCopyTargetList),
    Exclusions: S.optional(Exclusions),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/policies/{PolicyId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateLifecyclePolicyResponse extends S.Class<UpdateLifecyclePolicyResponse>(
  "UpdateLifecyclePolicyResponse",
)({}) {}
export const ParameterList = S.Array(S.String);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class LifecyclePolicySummary extends S.Class<LifecyclePolicySummary>(
  "LifecyclePolicySummary",
)({
  PolicyId: S.optional(S.String),
  Description: S.optional(S.String),
  State: S.optional(S.String),
  Tags: S.optional(TagMap),
  PolicyType: S.optional(S.String),
  DefaultPolicy: S.optional(S.Boolean),
}) {}
export const LifecyclePolicySummaryList = S.Array(LifecyclePolicySummary);
export class LifecyclePolicy extends S.Class<LifecyclePolicy>(
  "LifecyclePolicy",
)({
  PolicyId: S.optional(S.String),
  Description: S.optional(S.String),
  State: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  ExecutionRoleArn: S.optional(S.String),
  DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  DateModified: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PolicyDetails: S.optional(PolicyDetails),
  Tags: S.optional(TagMap),
  PolicyArn: S.optional(S.String),
  DefaultPolicy: S.optional(S.Boolean),
}) {}
export class GetLifecyclePoliciesResponse extends S.Class<GetLifecyclePoliciesResponse>(
  "GetLifecyclePoliciesResponse",
)({ Policies: S.optional(LifecyclePolicySummaryList) }) {}
export class GetLifecyclePolicyResponse extends S.Class<GetLifecyclePolicyResponse>(
  "GetLifecyclePolicyResponse",
)({ Policy: S.optional(LifecyclePolicy) }) {}
export class CreateLifecyclePolicyRequest extends S.Class<CreateLifecyclePolicyRequest>(
  "CreateLifecyclePolicyRequest",
)(
  {
    ExecutionRoleArn: S.String,
    Description: S.String,
    State: S.String,
    PolicyDetails: S.optional(PolicyDetails),
    Tags: S.optional(TagMap),
    DefaultPolicy: S.optional(S.String),
    CreateInterval: S.optional(S.Number),
    RetainInterval: S.optional(S.Number),
    CopyTags: S.optional(S.Boolean),
    ExtendDeletion: S.optional(S.Boolean),
    CrossRegionCopyTargets: S.optional(CrossRegionCopyTargetList),
    Exclusions: S.optional(Exclusions),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateLifecyclePolicyResponse extends S.Class<CreateLifecyclePolicyResponse>(
  "CreateLifecyclePolicyResponse",
)({ PolicyId: S.optional(S.String) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}

//# Operations
/**
 * Deletes the specified lifecycle policy and halts the automated operations that the
 * policy specified.
 *
 * For more information about deleting a policy, see Delete lifecycle
 * policies.
 */
export const deleteLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLifecyclePolicyRequest,
    output: DeleteLifecyclePolicyResponse,
    errors: [
      InternalServerException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLifecyclePolicyRequest,
    output: UpdateLifecyclePolicyResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets summary information about all or the specified data lifecycle policies.
 *
 * To get complete information about a policy, use GetLifecyclePolicy.
 */
export const getLifecyclePolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLifecyclePoliciesRequest,
    output: GetLifecyclePoliciesResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets detailed information about the specified lifecycle policy.
 */
export const getLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLifecyclePolicyRequest,
  output: GetLifecyclePolicyResponse,
  errors: [
    InternalServerException,
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
export const createLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLifecyclePolicyRequest,
    output: CreateLifecyclePolicyResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      LimitExceededException,
    ],
  }),
);

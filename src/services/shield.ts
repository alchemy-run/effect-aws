import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://ddp.amazonaws.com/doc/2016-06-02/");
const svc = T.AwsApiService({
  sdkId: "Shield",
  serviceShapeName: "AWSShield_20160616",
});
const auth = T.AwsAuthSigv4({ name: "shield" });
const ver = T.ServiceVersion("2016-06-02");
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
                {
                  fn: "stringEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                    "aws",
                  ],
                },
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, false] },
              ],
              endpoint: {
                url: "https://shield.us-east-1.amazonaws.com",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "shield",
                      signingRegion: "us-east-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
            {
              conditions: [
                {
                  fn: "stringEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                    "aws",
                  ],
                },
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, false] },
              ],
              endpoint: {
                url: "https://shield-fips.us-east-1.amazonaws.com",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "shield",
                      signingRegion: "us-east-1",
                    },
                  ],
                },
                headers: {},
              },
              type: "endpoint",
            },
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
                        url: "https://shield-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://shield-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://shield.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://shield.{Region}.{PartitionResult#dnsSuffix}",
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
export class CreateSubscriptionRequest extends S.Class<CreateSubscriptionRequest>(
  "CreateSubscriptionRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSubscriptionResponse extends S.Class<CreateSubscriptionResponse>(
  "CreateSubscriptionResponse",
)({}, ns) {}
export class DeleteSubscriptionRequest extends S.Class<DeleteSubscriptionRequest>(
  "DeleteSubscriptionRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSubscriptionResponse extends S.Class<DeleteSubscriptionResponse>(
  "DeleteSubscriptionResponse",
)({}, ns) {}
export class DescribeAttackStatisticsRequest extends S.Class<DescribeAttackStatisticsRequest>(
  "DescribeAttackStatisticsRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDRTAccessRequest extends S.Class<DescribeDRTAccessRequest>(
  "DescribeDRTAccessRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEmergencyContactSettingsRequest extends S.Class<DescribeEmergencyContactSettingsRequest>(
  "DescribeEmergencyContactSettingsRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSubscriptionRequest extends S.Class<DescribeSubscriptionRequest>(
  "DescribeSubscriptionRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableProactiveEngagementRequest extends S.Class<DisableProactiveEngagementRequest>(
  "DisableProactiveEngagementRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableProactiveEngagementResponse extends S.Class<DisableProactiveEngagementResponse>(
  "DisableProactiveEngagementResponse",
)({}, ns) {}
export class DisassociateDRTRoleRequest extends S.Class<DisassociateDRTRoleRequest>(
  "DisassociateDRTRoleRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateDRTRoleResponse extends S.Class<DisassociateDRTRoleResponse>(
  "DisassociateDRTRoleResponse",
)({}, ns) {}
export class EnableProactiveEngagementRequest extends S.Class<EnableProactiveEngagementRequest>(
  "EnableProactiveEngagementRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableProactiveEngagementResponse extends S.Class<EnableProactiveEngagementResponse>(
  "EnableProactiveEngagementResponse",
)({}, ns) {}
export class GetSubscriptionStateRequest extends S.Class<GetSubscriptionStateRequest>(
  "GetSubscriptionStateRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ProtectionGroupMembers = S.Array(S.String);
export const LogBucketList = S.Array(S.String);
export const ResourceArnFilterList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AssociateDRTLogBucketRequest extends S.Class<AssociateDRTLogBucketRequest>(
  "AssociateDRTLogBucketRequest",
)(
  { LogBucket: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateDRTLogBucketResponse extends S.Class<AssociateDRTLogBucketResponse>(
  "AssociateDRTLogBucketResponse",
)({}, ns) {}
export class AssociateDRTRoleRequest extends S.Class<AssociateDRTRoleRequest>(
  "AssociateDRTRoleRequest",
)(
  { RoleArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateDRTRoleResponse extends S.Class<AssociateDRTRoleResponse>(
  "AssociateDRTRoleResponse",
)({}, ns) {}
export class AssociateHealthCheckRequest extends S.Class<AssociateHealthCheckRequest>(
  "AssociateHealthCheckRequest",
)(
  { ProtectionId: S.String, HealthCheckArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateHealthCheckResponse extends S.Class<AssociateHealthCheckResponse>(
  "AssociateHealthCheckResponse",
)({}, ns) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class CreateProtectionGroupRequest extends S.Class<CreateProtectionGroupRequest>(
  "CreateProtectionGroupRequest",
)(
  {
    ProtectionGroupId: S.String,
    Aggregation: S.String,
    Pattern: S.String,
    ResourceType: S.optional(S.String),
    Members: S.optional(ProtectionGroupMembers),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProtectionGroupResponse extends S.Class<CreateProtectionGroupResponse>(
  "CreateProtectionGroupResponse",
)({}, ns) {}
export class DeleteProtectionRequest extends S.Class<DeleteProtectionRequest>(
  "DeleteProtectionRequest",
)(
  { ProtectionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProtectionResponse extends S.Class<DeleteProtectionResponse>(
  "DeleteProtectionResponse",
)({}, ns) {}
export class DeleteProtectionGroupRequest extends S.Class<DeleteProtectionGroupRequest>(
  "DeleteProtectionGroupRequest",
)(
  { ProtectionGroupId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProtectionGroupResponse extends S.Class<DeleteProtectionGroupResponse>(
  "DeleteProtectionGroupResponse",
)({}, ns) {}
export class DescribeAttackRequest extends S.Class<DescribeAttackRequest>(
  "DescribeAttackRequest",
)(
  { AttackId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDRTAccessResponse extends S.Class<DescribeDRTAccessResponse>(
  "DescribeDRTAccessResponse",
)(
  { RoleArn: S.optional(S.String), LogBucketList: S.optional(LogBucketList) },
  ns,
) {}
export class EmergencyContact extends S.Class<EmergencyContact>(
  "EmergencyContact",
)({
  EmailAddress: S.String,
  PhoneNumber: S.optional(S.String),
  ContactNotes: S.optional(S.String),
}) {}
export const EmergencyContactList = S.Array(EmergencyContact);
export class DescribeEmergencyContactSettingsResponse extends S.Class<DescribeEmergencyContactSettingsResponse>(
  "DescribeEmergencyContactSettingsResponse",
)({ EmergencyContactList: S.optional(EmergencyContactList) }, ns) {}
export class DescribeProtectionRequest extends S.Class<DescribeProtectionRequest>(
  "DescribeProtectionRequest",
)(
  { ProtectionId: S.optional(S.String), ResourceArn: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProtectionGroupRequest extends S.Class<DescribeProtectionGroupRequest>(
  "DescribeProtectionGroupRequest",
)(
  { ProtectionGroupId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableApplicationLayerAutomaticResponseRequest extends S.Class<DisableApplicationLayerAutomaticResponseRequest>(
  "DisableApplicationLayerAutomaticResponseRequest",
)(
  { ResourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableApplicationLayerAutomaticResponseResponse extends S.Class<DisableApplicationLayerAutomaticResponseResponse>(
  "DisableApplicationLayerAutomaticResponseResponse",
)({}, ns) {}
export class DisassociateDRTLogBucketRequest extends S.Class<DisassociateDRTLogBucketRequest>(
  "DisassociateDRTLogBucketRequest",
)(
  { LogBucket: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateDRTLogBucketResponse extends S.Class<DisassociateDRTLogBucketResponse>(
  "DisassociateDRTLogBucketResponse",
)({}, ns) {}
export class DisassociateHealthCheckRequest extends S.Class<DisassociateHealthCheckRequest>(
  "DisassociateHealthCheckRequest",
)(
  { ProtectionId: S.String, HealthCheckArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateHealthCheckResponse extends S.Class<DisassociateHealthCheckResponse>(
  "DisassociateHealthCheckResponse",
)({}, ns) {}
export class GetSubscriptionStateResponse extends S.Class<GetSubscriptionStateResponse>(
  "GetSubscriptionStateResponse",
)({ SubscriptionState: S.String }, ns) {}
export class TimeRange extends S.Class<TimeRange>("TimeRange")({
  FromInclusive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ToExclusive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListAttacksRequest extends S.Class<ListAttacksRequest>(
  "ListAttacksRequest",
)(
  {
    ResourceArns: S.optional(ResourceArnFilterList),
    StartTime: S.optional(TimeRange),
    EndTime: S.optional(TimeRange),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourcesInProtectionGroupRequest extends S.Class<ListResourcesInProtectionGroupRequest>(
  "ListResourcesInProtectionGroupRequest",
)(
  {
    ProtectionGroupId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class BlockAction extends S.Class<BlockAction>("BlockAction")({}) {}
export class CountAction extends S.Class<CountAction>("CountAction")({}) {}
export class ResponseAction extends S.Class<ResponseAction>("ResponseAction")({
  Block: S.optional(BlockAction),
  Count: S.optional(CountAction),
}) {}
export class UpdateApplicationLayerAutomaticResponseRequest extends S.Class<UpdateApplicationLayerAutomaticResponseRequest>(
  "UpdateApplicationLayerAutomaticResponseRequest",
)(
  { ResourceArn: S.String, Action: ResponseAction },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateApplicationLayerAutomaticResponseResponse extends S.Class<UpdateApplicationLayerAutomaticResponseResponse>(
  "UpdateApplicationLayerAutomaticResponseResponse",
)({}, ns) {}
export class UpdateEmergencyContactSettingsRequest extends S.Class<UpdateEmergencyContactSettingsRequest>(
  "UpdateEmergencyContactSettingsRequest",
)(
  { EmergencyContactList: S.optional(EmergencyContactList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEmergencyContactSettingsResponse extends S.Class<UpdateEmergencyContactSettingsResponse>(
  "UpdateEmergencyContactSettingsResponse",
)({}, ns) {}
export class UpdateProtectionGroupRequest extends S.Class<UpdateProtectionGroupRequest>(
  "UpdateProtectionGroupRequest",
)(
  {
    ProtectionGroupId: S.String,
    Aggregation: S.String,
    Pattern: S.String,
    ResourceType: S.optional(S.String),
    Members: S.optional(ProtectionGroupMembers),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProtectionGroupResponse extends S.Class<UpdateProtectionGroupResponse>(
  "UpdateProtectionGroupResponse",
)({}, ns) {}
export class UpdateSubscriptionRequest extends S.Class<UpdateSubscriptionRequest>(
  "UpdateSubscriptionRequest",
)(
  { AutoRenew: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSubscriptionResponse extends S.Class<UpdateSubscriptionResponse>(
  "UpdateSubscriptionResponse",
)({}, ns) {}
export const ProtectionGroupIdFilters = S.Array(S.String);
export const ProtectionGroupPatternFilters = S.Array(S.String);
export const ProtectedResourceTypeFilters = S.Array(S.String);
export const ProtectionGroupAggregationFilters = S.Array(S.String);
export const ResourceArnFilters = S.Array(S.String);
export const ProtectionNameFilters = S.Array(S.String);
export class InclusionProtectionGroupFilters extends S.Class<InclusionProtectionGroupFilters>(
  "InclusionProtectionGroupFilters",
)({
  ProtectionGroupIds: S.optional(ProtectionGroupIdFilters),
  Patterns: S.optional(ProtectionGroupPatternFilters),
  ResourceTypes: S.optional(ProtectedResourceTypeFilters),
  Aggregations: S.optional(ProtectionGroupAggregationFilters),
}) {}
export class InclusionProtectionFilters extends S.Class<InclusionProtectionFilters>(
  "InclusionProtectionFilters",
)({
  ResourceArns: S.optional(ResourceArnFilters),
  ProtectionNames: S.optional(ProtectionNameFilters),
  ResourceTypes: S.optional(ProtectedResourceTypeFilters),
}) {}
export const ResourceArnList = S.Array(S.String);
export class AssociateProactiveEngagementDetailsRequest extends S.Class<AssociateProactiveEngagementDetailsRequest>(
  "AssociateProactiveEngagementDetailsRequest",
)(
  { EmergencyContactList: EmergencyContactList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateProactiveEngagementDetailsResponse extends S.Class<AssociateProactiveEngagementDetailsResponse>(
  "AssociateProactiveEngagementDetailsResponse",
)({}, ns) {}
export class CreateProtectionRequest extends S.Class<CreateProtectionRequest>(
  "CreateProtectionRequest",
)(
  { Name: S.String, ResourceArn: S.String, Tags: S.optional(TagList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableApplicationLayerAutomaticResponseRequest extends S.Class<EnableApplicationLayerAutomaticResponseRequest>(
  "EnableApplicationLayerAutomaticResponseRequest",
)(
  { ResourceArn: S.String, Action: ResponseAction },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableApplicationLayerAutomaticResponseResponse extends S.Class<EnableApplicationLayerAutomaticResponseResponse>(
  "EnableApplicationLayerAutomaticResponseResponse",
)({}, ns) {}
export class ListProtectionGroupsRequest extends S.Class<ListProtectionGroupsRequest>(
  "ListProtectionGroupsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    InclusionFilters: S.optional(InclusionProtectionGroupFilters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProtectionsRequest extends S.Class<ListProtectionsRequest>(
  "ListProtectionsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    InclusionFilters: S.optional(InclusionProtectionFilters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourcesInProtectionGroupResponse extends S.Class<ListResourcesInProtectionGroupResponse>(
  "ListResourcesInProtectionGroupResponse",
)({ ResourceArns: ResourceArnList, NextToken: S.optional(S.String) }, ns) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export const HealthCheckIds = S.Array(S.String);
export class Limit extends S.Class<Limit>("Limit")({
  Type: S.optional(S.String),
  Max: S.optional(S.Number),
}) {}
export const Limits = S.Array(Limit);
export class ProtectionGroup extends S.Class<ProtectionGroup>(
  "ProtectionGroup",
)({
  ProtectionGroupId: S.String,
  Aggregation: S.String,
  Pattern: S.String,
  ResourceType: S.optional(S.String),
  Members: ProtectionGroupMembers,
  ProtectionGroupArn: S.optional(S.String),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export const ProtectionGroups = S.Array(ProtectionGroup);
export class ApplicationLayerAutomaticResponseConfiguration extends S.Class<ApplicationLayerAutomaticResponseConfiguration>(
  "ApplicationLayerAutomaticResponseConfiguration",
)({ Status: S.String, Action: ResponseAction }) {}
export class Protection extends S.Class<Protection>("Protection")({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  HealthCheckIds: S.optional(HealthCheckIds),
  ProtectionArn: S.optional(S.String),
  ApplicationLayerAutomaticResponseConfiguration: S.optional(
    ApplicationLayerAutomaticResponseConfiguration,
  ),
}) {}
export const Protections = S.Array(Protection);
export class AttackVolumeStatistics extends S.Class<AttackVolumeStatistics>(
  "AttackVolumeStatistics",
)({ Max: S.Number }) {}
export class ProtectionLimits extends S.Class<ProtectionLimits>(
  "ProtectionLimits",
)({ ProtectedResourceTypeLimits: Limits }) {}
export class CreateProtectionResponse extends S.Class<CreateProtectionResponse>(
  "CreateProtectionResponse",
)({ ProtectionId: S.optional(S.String) }, ns) {}
export class DescribeProtectionGroupResponse extends S.Class<DescribeProtectionGroupResponse>(
  "DescribeProtectionGroupResponse",
)({ ProtectionGroup: ProtectionGroup }, ns) {}
export class ListProtectionGroupsResponse extends S.Class<ListProtectionGroupsResponse>(
  "ListProtectionGroupsResponse",
)(
  { ProtectionGroups: ProtectionGroups, NextToken: S.optional(S.String) },
  ns,
) {}
export class ListProtectionsResponse extends S.Class<ListProtectionsResponse>(
  "ListProtectionsResponse",
)(
  { Protections: S.optional(Protections), NextToken: S.optional(S.String) },
  ns,
) {}
export class SummarizedCounter extends S.Class<SummarizedCounter>(
  "SummarizedCounter",
)({
  Name: S.optional(S.String),
  Max: S.optional(S.Number),
  Average: S.optional(S.Number),
  Sum: S.optional(S.Number),
  N: S.optional(S.Number),
  Unit: S.optional(S.String),
}) {}
export const SummarizedCounterList = S.Array(SummarizedCounter);
export class Mitigation extends S.Class<Mitigation>("Mitigation")({
  MitigationName: S.optional(S.String),
}) {}
export const MitigationList = S.Array(Mitigation);
export class AttackVolume extends S.Class<AttackVolume>("AttackVolume")({
  BitsPerSecond: S.optional(AttackVolumeStatistics),
  PacketsPerSecond: S.optional(AttackVolumeStatistics),
  RequestsPerSecond: S.optional(AttackVolumeStatistics),
}) {}
export class AttackVectorDescription extends S.Class<AttackVectorDescription>(
  "AttackVectorDescription",
)({ VectorType: S.String }) {}
export const AttackVectorDescriptionList = S.Array(AttackVectorDescription);
export class AttackStatisticsDataItem extends S.Class<AttackStatisticsDataItem>(
  "AttackStatisticsDataItem",
)({ AttackVolume: S.optional(AttackVolume), AttackCount: S.Number }) {}
export const AttackStatisticsDataList = S.Array(AttackStatisticsDataItem);
export class AttackSummary extends S.Class<AttackSummary>("AttackSummary")({
  AttackId: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AttackVectors: S.optional(AttackVectorDescriptionList),
}) {}
export const AttackSummaries = S.Array(AttackSummary);
export class SummarizedAttackVector extends S.Class<SummarizedAttackVector>(
  "SummarizedAttackVector",
)({
  VectorType: S.String,
  VectorCounters: S.optional(SummarizedCounterList),
}) {}
export const SummarizedAttackVectorList = S.Array(SummarizedAttackVector);
export class Contributor extends S.Class<Contributor>("Contributor")({
  Name: S.optional(S.String),
  Value: S.optional(S.Number),
}) {}
export const TopContributors = S.Array(Contributor);
export class DescribeAttackStatisticsResponse extends S.Class<DescribeAttackStatisticsResponse>(
  "DescribeAttackStatisticsResponse",
)({ TimeRange: TimeRange, DataItems: AttackStatisticsDataList }, ns) {}
export class DescribeProtectionResponse extends S.Class<DescribeProtectionResponse>(
  "DescribeProtectionResponse",
)({ Protection: S.optional(Protection) }, ns) {}
export class ProtectionGroupArbitraryPatternLimits extends S.Class<ProtectionGroupArbitraryPatternLimits>(
  "ProtectionGroupArbitraryPatternLimits",
)({ MaxMembers: S.Number }) {}
export class ListAttacksResponse extends S.Class<ListAttacksResponse>(
  "ListAttacksResponse",
)(
  {
    AttackSummaries: S.optional(AttackSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class SubResourceSummary extends S.Class<SubResourceSummary>(
  "SubResourceSummary",
)({
  Type: S.optional(S.String),
  Id: S.optional(S.String),
  AttackVectors: S.optional(SummarizedAttackVectorList),
  Counters: S.optional(SummarizedCounterList),
}) {}
export const SubResourceSummaryList = S.Array(SubResourceSummary);
export class AttackProperty extends S.Class<AttackProperty>("AttackProperty")({
  AttackLayer: S.optional(S.String),
  AttackPropertyIdentifier: S.optional(S.String),
  TopContributors: S.optional(TopContributors),
  Unit: S.optional(S.String),
  Total: S.optional(S.Number),
}) {}
export const AttackProperties = S.Array(AttackProperty);
export class ProtectionGroupPatternTypeLimits extends S.Class<ProtectionGroupPatternTypeLimits>(
  "ProtectionGroupPatternTypeLimits",
)({ ArbitraryPatternLimits: ProtectionGroupArbitraryPatternLimits }) {}
export class AttackDetail extends S.Class<AttackDetail>("AttackDetail")({
  AttackId: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  SubResources: S.optional(SubResourceSummaryList),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AttackCounters: S.optional(SummarizedCounterList),
  AttackProperties: S.optional(AttackProperties),
  Mitigations: S.optional(MitigationList),
}) {}
export class ProtectionGroupLimits extends S.Class<ProtectionGroupLimits>(
  "ProtectionGroupLimits",
)({
  MaxProtectionGroups: S.Number,
  PatternTypeLimits: ProtectionGroupPatternTypeLimits,
}) {}
export class DescribeAttackResponse extends S.Class<DescribeAttackResponse>(
  "DescribeAttackResponse",
)({ Attack: S.optional(AttackDetail) }, ns) {}
export class SubscriptionLimits extends S.Class<SubscriptionLimits>(
  "SubscriptionLimits",
)({
  ProtectionLimits: ProtectionLimits,
  ProtectionGroupLimits: ProtectionGroupLimits,
}) {}
export class Subscription extends S.Class<Subscription>("Subscription")({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TimeCommitmentInSeconds: S.optional(S.Number),
  AutoRenew: S.optional(S.String),
  Limits: S.optional(Limits),
  ProactiveEngagementStatus: S.optional(S.String),
  SubscriptionLimits: SubscriptionLimits,
  SubscriptionArn: S.optional(S.String),
}) {}
export class DescribeSubscriptionResponse extends S.Class<DescribeSubscriptionResponse>(
  "DescribeSubscriptionResponse",
)({ Subscription: S.optional(Subscription) }, ns) {}

//# Errors
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { message: S.optional(S.String) },
) {}
export class AccessDeniedForDependencyException extends S.TaggedError<AccessDeniedForDependencyException>()(
  "AccessDeniedForDependencyException",
  { message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String), resourceType: S.optional(S.String) },
) {}
export class OptimisticLockException extends S.TaggedError<OptimisticLockException>()(
  "OptimisticLockException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String), resourceType: S.optional(S.String) },
) {}
export class InvalidOperationException extends S.TaggedError<InvalidOperationException>()(
  "InvalidOperationException",
  { message: S.optional(S.String) },
) {}
export class LockedSubscriptionException extends S.TaggedError<LockedSubscriptionException>()(
  "LockedSubscriptionException",
  { message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    fields: S.optional(ValidationExceptionFieldList),
  },
) {}
export class InvalidPaginationTokenException extends S.TaggedError<InvalidPaginationTokenException>()(
  "InvalidPaginationTokenException",
  { message: S.optional(S.String) },
) {}
export class InvalidResourceException extends S.TaggedError<InvalidResourceException>()(
  "InvalidResourceException",
  { message: S.optional(S.String) },
) {}
export class NoAssociatedRoleException extends S.TaggedError<NoAssociatedRoleException>()(
  "NoAssociatedRoleException",
  { message: S.optional(S.String) },
) {}
export class LimitsExceededException extends S.TaggedError<LimitsExceededException>()(
  "LimitsExceededException",
  {
    message: S.optional(S.String),
    Type: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns the `SubscriptionState`, either `Active` or `Inactive`.
 */
export const getSubscriptionState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSubscriptionStateRequest,
    output: GetSubscriptionStateResponse,
    errors: [InternalErrorException],
  }),
);
/**
 * Activates Shield Advanced for an account.
 *
 * For accounts that are members of an Organizations organization, Shield Advanced subscriptions are billed against the organization's payer account,
 * regardless of whether the payer account itself is subscribed.
 *
 * When you initially create a subscription, your subscription is set to be automatically renewed at the end of the existing subscription period. You can change this by submitting an `UpdateSubscription` request.
 */
export const createSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubscriptionRequest,
  output: CreateSubscriptionResponse,
  errors: [InternalErrorException, ResourceAlreadyExistsException],
}));
/**
 * Returns the current role and list of Amazon S3 log buckets used by the Shield Response Team (SRT) to access your Amazon Web Services account while assisting with attack mitigation.
 */
export const describeDRTAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDRTAccessRequest,
  output: DescribeDRTAccessResponse,
  errors: [InternalErrorException, ResourceNotFoundException],
}));
/**
 * Removes Shield Advanced from an account. Shield Advanced requires a 1-year subscription commitment. You cannot delete a subscription prior to the completion of that commitment.
 */
export const deleteSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSubscriptionRequest,
  output: DeleteSubscriptionResponse,
  errors: [
    InternalErrorException,
    LockedSubscriptionException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes the specified protection group.
 */
export const deleteProtectionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteProtectionGroupRequest,
    output: DeleteProtectionGroupResponse,
    errors: [
      InternalErrorException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * A list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you if you have proactive engagement enabled, for escalations to the SRT and to initiate proactive customer support.
 */
export const describeEmergencyContactSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeEmergencyContactSettingsRequest,
    output: DescribeEmergencyContactSettingsResponse,
    errors: [InternalErrorException, ResourceNotFoundException],
  }));
/**
 * Deletes an Shield Advanced Protection.
 */
export const deleteProtection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProtectionRequest,
  output: DeleteProtectionResponse,
  errors: [
    InternalErrorException,
    OptimisticLockException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes the Shield Response Team's (SRT) access to your Amazon Web Services account.
 */
export const disassociateDRTRole = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateDRTRoleRequest,
  output: DisassociateDRTRoleResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    OptimisticLockException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the specification for the specified protection group.
 */
export const describeProtectionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeProtectionGroupRequest,
    output: DescribeProtectionGroupResponse,
    errors: [InternalErrorException, ResourceNotFoundException],
  }),
);
/**
 * Retrieves the resources that are included in the protection group.
 */
export const listResourcesInProtectionGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListResourcesInProtectionGroupRequest,
    output: ListResourcesInProtectionGroupResponse,
    errors: [
      InternalErrorException,
      InvalidPaginationTokenException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Gets information about Amazon Web Services tags for a specified Amazon Resource Name (ARN) in Shield.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalErrorException,
    InvalidResourceException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes the Shield Response Team's (SRT) access to the specified Amazon S3 bucket containing the logs that you shared previously.
 */
export const disassociateDRTLogBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateDRTLogBucketRequest,
    output: DisassociateDRTLogBucketResponse,
    errors: [
      AccessDeniedForDependencyException,
      InternalErrorException,
      InvalidOperationException,
      NoAssociatedRoleException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Adds or updates tags for a resource in Shield.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    InvalidResourceException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes tags from a resource in Shield.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    InvalidResourceException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the details of the list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you if you have proactive engagement enabled, for escalations to the SRT and to initiate proactive customer support.
 */
export const updateEmergencyContactSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateEmergencyContactSettingsRequest,
    output: UpdateEmergencyContactSettingsResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Updates an existing protection group. A protection group is a grouping of protected resources so they can be handled as a collective. This resource grouping improves the accuracy of detection and reduces false positives.
 */
export const updateProtectionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateProtectionGroupRequest,
    output: UpdateProtectionGroupResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates the details of an existing subscription. Only enter values for parameters you want to change. Empty parameters are not updated.
 *
 * For accounts that are members of an Organizations organization, Shield Advanced subscriptions are billed against the organization's payer account,
 * regardless of whether the payer account itself is subscribed.
 */
export const updateSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSubscriptionRequest,
  output: UpdateSubscriptionResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    LockedSubscriptionException,
    OptimisticLockException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disable the Shield Advanced automatic application layer DDoS mitigation feature for the protected resource. This
 * stops Shield Advanced from creating, verifying, and applying WAF rules for attacks that it detects for the resource.
 */
export const disableApplicationLayerAutomaticResponse =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableApplicationLayerAutomaticResponseRequest,
    output: DisableApplicationLayerAutomaticResponseResponse,
    errors: [
      InternalErrorException,
      InvalidOperationException,
      InvalidParameterException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Authorizes the Shield Response Team (SRT) using the specified role, to access your Amazon Web Services account to assist with DDoS attack mitigation during potential attacks. This enables the SRT to inspect your WAF configuration and create or update WAF rules and web ACLs.
 *
 * You can associate only one `RoleArn` with your subscription. If you submit an `AssociateDRTRole` request for an account that already has an associated role, the new `RoleArn` will replace the existing `RoleArn`.
 *
 * Prior to making the `AssociateDRTRole` request, you must attach the `AWSShieldDRTAccessPolicy` managed policy to the role that you'll specify in the request. You can access this policy in the IAM console at AWSShieldDRTAccessPolicy. For more information see Adding and removing IAM identity permissions. The role must also trust the service principal
 * `drt.shield.amazonaws.com`. For more information, see IAM JSON policy elements: Principal.
 *
 * The SRT will have access only to your WAF and Shield resources. By submitting this request, you authorize the SRT to inspect your WAF and Shield configuration and create and update WAF rules and web ACLs on your behalf. The SRT takes these actions only if explicitly authorized by you.
 *
 * You must have the `iam:PassRole` permission to make an `AssociateDRTRole` request. For more information, see Granting a user permissions to pass a role to an Amazon Web Services service.
 *
 * To use the services of the SRT and make an `AssociateDRTRole` request, you must be subscribed to the Business Support plan or the Enterprise Support plan.
 */
export const associateDRTRole = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateDRTRoleRequest,
  output: AssociateDRTRoleResponse,
  errors: [
    AccessDeniedForDependencyException,
    InternalErrorException,
    InvalidOperationException,
    InvalidParameterException,
    OptimisticLockException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an existing Shield Advanced automatic application layer DDoS mitigation configuration for the specified resource.
 */
export const updateApplicationLayerAutomaticResponse =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateApplicationLayerAutomaticResponseRequest,
    output: UpdateApplicationLayerAutomaticResponseResponse,
    errors: [
      InternalErrorException,
      InvalidOperationException,
      InvalidParameterException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Removes authorization from the Shield Response Team (SRT) to notify contacts about escalations to the SRT and to initiate proactive customer support.
 */
export const disableProactiveEngagement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisableProactiveEngagementRequest,
    output: DisableProactiveEngagementResponse,
    errors: [
      InternalErrorException,
      InvalidOperationException,
      InvalidParameterException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Authorizes the Shield Response Team (SRT) to use email and phone to notify contacts about escalations to the SRT and to initiate proactive customer support.
 */
export const enableProactiveEngagement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: EnableProactiveEngagementRequest,
    output: EnableProactiveEngagementResponse,
    errors: [
      InternalErrorException,
      InvalidOperationException,
      InvalidParameterException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Initializes proactive engagement and sets the list of contacts for the Shield Response Team (SRT) to use. You must provide at least one phone number in the emergency contact list.
 *
 * After you have initialized proactive engagement using this call, to disable or enable proactive engagement, use the calls `DisableProactiveEngagement` and `EnableProactiveEngagement`.
 *
 * This call defines the list of email addresses and phone numbers that the SRT can use to contact you for escalations to the SRT and to initiate proactive customer support.
 *
 * The contacts that you provide in the request replace any contacts that were already defined. If you already have contacts defined and want to use them, retrieve the list using `DescribeEmergencyContactSettings` and then provide it to this call.
 */
export const associateProactiveEngagementDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AssociateProactiveEngagementDetailsRequest,
    output: AssociateProactiveEngagementDetailsResponse,
    errors: [
      InternalErrorException,
      InvalidOperationException,
      InvalidParameterException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Retrieves ProtectionGroup objects for the account. You can retrieve all protection groups or you can provide
 * filtering criteria and retrieve just the subset of protection groups that match the criteria.
 */
export const listProtectionGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListProtectionGroupsRequest,
    output: ListProtectionGroupsResponse,
    errors: [
      InternalErrorException,
      InvalidPaginationTokenException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Retrieves Protection objects for the account. You can retrieve all protections or you can provide
 * filtering criteria and retrieve just the subset of protections that match the criteria.
 */
export const listProtections = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProtectionsRequest,
  output: ListProtectionsResponse,
  errors: [
    InternalErrorException,
    InvalidPaginationTokenException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes health-based detection from the Shield Advanced protection for a resource. Shield Advanced health-based detection uses the health of your Amazon Web Services resource to improve responsiveness and accuracy in attack detection and response.
 *
 * You define the health check in Route 53 and then associate or disassociate it with your Shield Advanced protection. For more information, see Shield Advanced Health-Based Detection in the *WAF Developer Guide*.
 */
export const disassociateHealthCheck = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateHealthCheckRequest,
    output: DisassociateHealthCheckResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      InvalidResourceException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Provides information about the number and type of attacks Shield has detected in the last year for all resources that belong to your account, regardless of whether you've defined Shield protections for them. This operation is available to Shield customers as well as to Shield Advanced customers.
 *
 * The operation returns data for the time range of midnight UTC, one year ago, to midnight UTC, today. For example, if the current time is `2020-10-26 15:39:32 PDT`, equal to `2020-10-26 22:39:32 UTC`, then the time range for the attack data returned is from `2019-10-26 00:00:00 UTC` to `2020-10-26 00:00:00 UTC`.
 *
 * The time range indicates the period covered by the attack statistics data items.
 */
export const describeAttackStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAttackStatisticsRequest,
    output: DescribeAttackStatisticsResponse,
    errors: [InternalErrorException],
  }),
);
/**
 * Lists the details of a Protection object.
 */
export const describeProtection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProtectionRequest,
  output: DescribeProtectionResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns all ongoing DDoS attacks or all DDoS attacks during a specified time
 * period.
 */
export const listAttacks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAttacksRequest,
  output: ListAttacksResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    InvalidParameterException,
  ],
}));
/**
 * Adds health-based detection to the Shield Advanced protection for a resource. Shield Advanced health-based detection uses the health of your Amazon Web Services resource to improve responsiveness and accuracy in attack detection and response.
 *
 * You define the health check in Route 53 and then associate it with your Shield Advanced protection. For more information, see Shield Advanced Health-Based Detection in the *WAF Developer Guide*.
 */
export const associateHealthCheck = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateHealthCheckRequest,
    output: AssociateHealthCheckResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      InvalidResourceException,
      LimitsExceededException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates a grouping of protected resources so they can be handled as a collective. This resource grouping improves the accuracy of detection and reduces false positives.
 */
export const createProtectionGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateProtectionGroupRequest,
    output: CreateProtectionGroupResponse,
    errors: [
      InternalErrorException,
      InvalidParameterException,
      LimitsExceededException,
      OptimisticLockException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Enable the Shield Advanced automatic application layer DDoS mitigation for the protected resource.
 *
 * This feature is available for Amazon CloudFront distributions and Application Load Balancers only.
 *
 * This causes Shield Advanced to create, verify, and apply WAF rules for DDoS attacks that it detects for the
 * resource. Shield Advanced applies the rules in a Shield rule group inside the web ACL that you've associated
 * with the resource. For information about how automatic mitigation works and the requirements for using it, see
 * Shield Advanced automatic application layer DDoS mitigation.
 *
 * Don't use this action to make changes to automatic mitigation settings when it's already enabled for a resource. Instead, use UpdateApplicationLayerAutomaticResponse.
 *
 * To use this feature, you must associate a web ACL with the protected resource. The web ACL must be created using the latest version of WAF (v2). You can associate the web ACL through the Shield Advanced console
 * at https://console.aws.amazon.com/wafv2/shieldv2#/. For more information,
 * see Getting Started with Shield Advanced. You can also associate the web ACL to the resource through the WAF console or the WAF API, but you must manage Shield Advanced automatic mitigation through Shield Advanced. For information about WAF, see
 * WAF Developer Guide.
 */
export const enableApplicationLayerAutomaticResponse =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableApplicationLayerAutomaticResponseRequest,
    output: EnableApplicationLayerAutomaticResponseResponse,
    errors: [
      InternalErrorException,
      InvalidOperationException,
      InvalidParameterException,
      LimitsExceededException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Authorizes the Shield Response Team (SRT) to access the specified Amazon S3 bucket containing log data such as Application Load Balancer access logs, CloudFront logs, or logs from third party sources. You can associate up to 10 Amazon S3 buckets with your subscription.
 *
 * To use the services of the SRT and make an `AssociateDRTLogBucket` request, you must be subscribed to the Business Support plan or the Enterprise Support plan.
 */
export const associateDRTLogBucket = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateDRTLogBucketRequest,
    output: AssociateDRTLogBucketResponse,
    errors: [
      AccessDeniedForDependencyException,
      InternalErrorException,
      InvalidOperationException,
      InvalidParameterException,
      LimitsExceededException,
      NoAssociatedRoleException,
      OptimisticLockException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Enables Shield Advanced for a specific Amazon Web Services resource. The resource can be an Amazon CloudFront distribution, Amazon Route 53 hosted zone, Global Accelerator standard accelerator, Elastic IP Address, Application Load Balancer, or a Classic Load Balancer. You can protect Amazon EC2 instances and Network Load Balancers by association with protected Amazon EC2 Elastic IP addresses.
 *
 * You can add protection to only a single resource with each `CreateProtection` request. You can add protection to multiple resources
 * at once through the Shield Advanced console at https://console.aws.amazon.com/wafv2/shieldv2#/.
 * For more information see
 * Getting Started with Shield Advanced
 * and Adding Shield Advanced protection to Amazon Web Services resources.
 */
export const createProtection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProtectionRequest,
  output: CreateProtectionResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    InvalidParameterException,
    InvalidResourceException,
    LimitsExceededException,
    OptimisticLockException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes the details of a DDoS attack.
 */
export const describeAttack = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAttackRequest,
  output: DescribeAttackResponse,
  errors: [AccessDeniedException, InternalErrorException],
}));
/**
 * Provides details about the Shield Advanced subscription for an account.
 */
export const describeSubscription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSubscriptionRequest,
    output: DescribeSubscriptionResponse,
    errors: [InternalErrorException, ResourceNotFoundException],
  }),
);

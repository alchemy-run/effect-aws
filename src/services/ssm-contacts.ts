import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "SSM Contacts",
  serviceShapeName: "SSMContacts",
});
const auth = T.AwsAuthSigv4({ name: "ssm-contacts" });
const ver = T.ServiceVersion("2021-05-03");
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
                        url: "https://ssm-contacts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://ssm-contacts-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://ssm-contacts.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://ssm-contacts.{Region}.{PartitionResult#dnsSuffix}",
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
export const RotationContactsArnList = S.Array(S.String);
export const RotationOverrideContactsArnList = S.Array(S.String);
export const RotationPreviewMemberList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class AcceptPageRequest extends S.Class<AcceptPageRequest>(
  "AcceptPageRequest",
)(
  {
    PageId: S.String,
    ContactChannelId: S.optional(S.String),
    AcceptType: S.String,
    Note: S.optional(S.String),
    AcceptCode: S.String,
    AcceptCodeValidation: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AcceptPageResult extends S.Class<AcceptPageResult>(
  "AcceptPageResult",
)({}) {}
export class ActivateContactChannelRequest extends S.Class<ActivateContactChannelRequest>(
  "ActivateContactChannelRequest",
)(
  { ContactChannelId: S.String, ActivationCode: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ActivateContactChannelResult extends S.Class<ActivateContactChannelResult>(
  "ActivateContactChannelResult",
)({}) {}
export class CreateRotationOverrideRequest extends S.Class<CreateRotationOverrideRequest>(
  "CreateRotationOverrideRequest",
)(
  {
    RotationId: S.String,
    NewContactIds: RotationOverrideContactsArnList,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeactivateContactChannelRequest extends S.Class<DeactivateContactChannelRequest>(
  "DeactivateContactChannelRequest",
)(
  { ContactChannelId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeactivateContactChannelResult extends S.Class<DeactivateContactChannelResult>(
  "DeactivateContactChannelResult",
)({}) {}
export class DeleteContactRequest extends S.Class<DeleteContactRequest>(
  "DeleteContactRequest",
)(
  { ContactId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteContactResult extends S.Class<DeleteContactResult>(
  "DeleteContactResult",
)({}) {}
export class DeleteContactChannelRequest extends S.Class<DeleteContactChannelRequest>(
  "DeleteContactChannelRequest",
)(
  { ContactChannelId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteContactChannelResult extends S.Class<DeleteContactChannelResult>(
  "DeleteContactChannelResult",
)({}) {}
export class DeleteRotationRequest extends S.Class<DeleteRotationRequest>(
  "DeleteRotationRequest",
)(
  { RotationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRotationResult extends S.Class<DeleteRotationResult>(
  "DeleteRotationResult",
)({}) {}
export class DeleteRotationOverrideRequest extends S.Class<DeleteRotationOverrideRequest>(
  "DeleteRotationOverrideRequest",
)(
  { RotationId: S.String, RotationOverrideId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRotationOverrideResult extends S.Class<DeleteRotationOverrideResult>(
  "DeleteRotationOverrideResult",
)({}) {}
export class DescribeEngagementRequest extends S.Class<DescribeEngagementRequest>(
  "DescribeEngagementRequest",
)(
  { EngagementId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePageRequest extends S.Class<DescribePageRequest>(
  "DescribePageRequest",
)(
  { PageId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetContactRequest extends S.Class<GetContactRequest>(
  "GetContactRequest",
)(
  { ContactId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetContactChannelRequest extends S.Class<GetContactChannelRequest>(
  "GetContactChannelRequest",
)(
  { ContactChannelId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetContactPolicyRequest extends S.Class<GetContactPolicyRequest>(
  "GetContactPolicyRequest",
)(
  { ContactArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRotationRequest extends S.Class<GetRotationRequest>(
  "GetRotationRequest",
)(
  { RotationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRotationOverrideRequest extends S.Class<GetRotationOverrideRequest>(
  "GetRotationOverrideRequest",
)(
  { RotationId: S.String, RotationOverrideId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListContactChannelsRequest extends S.Class<ListContactChannelsRequest>(
  "ListContactChannelsRequest",
)(
  {
    ContactId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListContactsRequest extends S.Class<ListContactsRequest>(
  "ListContactsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    AliasPrefix: S.optional(S.String),
    Type: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPageReceiptsRequest extends S.Class<ListPageReceiptsRequest>(
  "ListPageReceiptsRequest",
)(
  {
    PageId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPageResolutionsRequest extends S.Class<ListPageResolutionsRequest>(
  "ListPageResolutionsRequest",
)(
  { NextToken: S.optional(S.String), PageId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPagesByContactRequest extends S.Class<ListPagesByContactRequest>(
  "ListPagesByContactRequest",
)(
  {
    ContactId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPagesByEngagementRequest extends S.Class<ListPagesByEngagementRequest>(
  "ListPagesByEngagementRequest",
)(
  {
    EngagementId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRotationOverridesRequest extends S.Class<ListRotationOverridesRequest>(
  "ListRotationOverridesRequest",
)(
  {
    RotationId: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRotationsRequest extends S.Class<ListRotationsRequest>(
  "ListRotationsRequest",
)(
  {
    RotationNamePrefix: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRotationShiftsRequest extends S.Class<ListRotationShiftsRequest>(
  "ListRotationShiftsRequest",
)(
  {
    RotationId: S.String,
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutContactPolicyRequest extends S.Class<PutContactPolicyRequest>(
  "PutContactPolicyRequest",
)(
  { ContactArn: S.String, Policy: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutContactPolicyResult extends S.Class<PutContactPolicyResult>(
  "PutContactPolicyResult",
)({}) {}
export class SendActivationCodeRequest extends S.Class<SendActivationCodeRequest>(
  "SendActivationCodeRequest",
)(
  { ContactChannelId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendActivationCodeResult extends S.Class<SendActivationCodeResult>(
  "SendActivationCodeResult",
)({}) {}
export class StartEngagementRequest extends S.Class<StartEngagementRequest>(
  "StartEngagementRequest",
)(
  {
    ContactId: S.String,
    Sender: S.String,
    Subject: S.String,
    Content: S.String,
    PublicSubject: S.optional(S.String),
    PublicContent: S.optional(S.String),
    IncidentId: S.optional(S.String),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopEngagementRequest extends S.Class<StopEngagementRequest>(
  "StopEngagementRequest",
)(
  { EngagementId: S.String, Reason: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopEngagementResult extends S.Class<StopEngagementResult>(
  "StopEngagementResult",
)({}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagsList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagsList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResult extends S.Class<TagResourceResult>(
  "TagResourceResult",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResult extends S.Class<UntagResourceResult>(
  "UntagResourceResult",
)({}) {}
export class ChannelTargetInfo extends S.Class<ChannelTargetInfo>(
  "ChannelTargetInfo",
)({
  ContactChannelId: S.String,
  RetryIntervalInMinutes: S.optional(S.Number),
}) {}
export class ContactTargetInfo extends S.Class<ContactTargetInfo>(
  "ContactTargetInfo",
)({ ContactId: S.optional(S.String), IsEssential: S.Boolean }) {}
export class Target extends S.Class<Target>("Target")({
  ChannelTargetInfo: S.optional(ChannelTargetInfo),
  ContactTargetInfo: S.optional(ContactTargetInfo),
}) {}
export const TargetsList = S.Array(Target);
export class Stage extends S.Class<Stage>("Stage")({
  DurationInMinutes: S.Number,
  Targets: TargetsList,
}) {}
export const StagesList = S.Array(Stage);
export const SsmContactsArnList = S.Array(S.String);
export class Plan extends S.Class<Plan>("Plan")({
  Stages: S.optional(StagesList),
  RotationIds: S.optional(SsmContactsArnList),
}) {}
export class UpdateContactRequest extends S.Class<UpdateContactRequest>(
  "UpdateContactRequest",
)(
  {
    ContactId: S.String,
    DisplayName: S.optional(S.String),
    Plan: S.optional(Plan),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateContactResult extends S.Class<UpdateContactResult>(
  "UpdateContactResult",
)({}) {}
export class ContactChannelAddress extends S.Class<ContactChannelAddress>(
  "ContactChannelAddress",
)({ SimpleAddress: S.optional(S.String) }) {}
export class UpdateContactChannelRequest extends S.Class<UpdateContactChannelRequest>(
  "UpdateContactChannelRequest",
)(
  {
    ContactChannelId: S.String,
    Name: S.optional(S.String),
    DeliveryAddress: S.optional(ContactChannelAddress),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateContactChannelResult extends S.Class<UpdateContactChannelResult>(
  "UpdateContactChannelResult",
)({}) {}
export class HandOffTime extends S.Class<HandOffTime>("HandOffTime")({
  HourOfDay: S.Number,
  MinuteOfHour: S.Number,
}) {}
export class MonthlySetting extends S.Class<MonthlySetting>("MonthlySetting")({
  DayOfMonth: S.Number,
  HandOffTime: HandOffTime,
}) {}
export const MonthlySettings = S.Array(MonthlySetting);
export class WeeklySetting extends S.Class<WeeklySetting>("WeeklySetting")({
  DayOfWeek: S.String,
  HandOffTime: HandOffTime,
}) {}
export const WeeklySettings = S.Array(WeeklySetting);
export const DailySettings = S.Array(HandOffTime);
export class CoverageTime extends S.Class<CoverageTime>("CoverageTime")({
  Start: S.optional(HandOffTime),
  End: S.optional(HandOffTime),
}) {}
export const CoverageTimes = S.Array(CoverageTime);
export const ShiftCoveragesMap = S.Record({
  key: S.String,
  value: CoverageTimes,
});
export class RecurrenceSettings extends S.Class<RecurrenceSettings>(
  "RecurrenceSettings",
)({
  MonthlySettings: S.optional(MonthlySettings),
  WeeklySettings: S.optional(WeeklySettings),
  DailySettings: S.optional(DailySettings),
  NumberOfOnCalls: S.Number,
  ShiftCoverages: S.optional(ShiftCoveragesMap),
  RecurrenceMultiplier: S.Number,
}) {}
export class UpdateRotationRequest extends S.Class<UpdateRotationRequest>(
  "UpdateRotationRequest",
)(
  {
    RotationId: S.String,
    ContactIds: S.optional(RotationContactsArnList),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TimeZoneId: S.optional(S.String),
    Recurrence: RecurrenceSettings,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRotationResult extends S.Class<UpdateRotationResult>(
  "UpdateRotationResult",
)({}) {}
export const RotationOverridePreviewMemberList = S.Array(S.String);
export class TimeRange extends S.Class<TimeRange>("TimeRange")({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class PreviewOverride extends S.Class<PreviewOverride>(
  "PreviewOverride",
)({
  NewMembers: S.optional(RotationOverridePreviewMemberList),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const OverrideList = S.Array(PreviewOverride);
export class CreateContactChannelRequest extends S.Class<CreateContactChannelRequest>(
  "CreateContactChannelRequest",
)(
  {
    ContactId: S.String,
    Name: S.String,
    Type: S.String,
    DeliveryAddress: ContactChannelAddress,
    DeferActivation: S.optional(S.Boolean),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRotationOverrideResult extends S.Class<CreateRotationOverrideResult>(
  "CreateRotationOverrideResult",
)({ RotationOverrideId: S.String }) {}
export class DescribeEngagementResult extends S.Class<DescribeEngagementResult>(
  "DescribeEngagementResult",
)({
  ContactArn: S.String,
  EngagementArn: S.String,
  Sender: S.String,
  Subject: S.String,
  Content: S.String,
  PublicSubject: S.optional(S.String),
  PublicContent: S.optional(S.String),
  IncidentId: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribePageResult extends S.Class<DescribePageResult>(
  "DescribePageResult",
)({
  PageArn: S.String,
  EngagementArn: S.String,
  ContactArn: S.String,
  Sender: S.String,
  Subject: S.String,
  Content: S.String,
  PublicSubject: S.optional(S.String),
  PublicContent: S.optional(S.String),
  IncidentId: S.optional(S.String),
  SentTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReadTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeliveryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetContactResult extends S.Class<GetContactResult>(
  "GetContactResult",
)({
  ContactArn: S.String,
  Alias: S.String,
  DisplayName: S.optional(S.String),
  Type: S.String,
  Plan: Plan,
}) {}
export class GetContactChannelResult extends S.Class<GetContactChannelResult>(
  "GetContactChannelResult",
)({
  ContactArn: S.String,
  ContactChannelArn: S.String,
  Name: S.String,
  Type: S.String,
  DeliveryAddress: ContactChannelAddress,
  ActivationStatus: S.optional(S.String),
}) {}
export class GetContactPolicyResult extends S.Class<GetContactPolicyResult>(
  "GetContactPolicyResult",
)({ ContactArn: S.optional(S.String), Policy: S.optional(S.String) }) {}
export class GetRotationResult extends S.Class<GetRotationResult>(
  "GetRotationResult",
)({
  RotationArn: S.String,
  Name: S.String,
  ContactIds: RotationContactsArnList,
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  TimeZoneId: S.String,
  Recurrence: RecurrenceSettings,
}) {}
export class GetRotationOverrideResult extends S.Class<GetRotationOverrideResult>(
  "GetRotationOverrideResult",
)({
  RotationOverrideId: S.optional(S.String),
  RotationArn: S.optional(S.String),
  NewContactIds: S.optional(SsmContactsArnList),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListEngagementsRequest extends S.Class<ListEngagementsRequest>(
  "ListEngagementsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    IncidentId: S.optional(S.String),
    TimeRangeValue: S.optional(TimeRange),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Page extends S.Class<Page>("Page")({
  PageArn: S.String,
  EngagementArn: S.String,
  ContactArn: S.String,
  Sender: S.String,
  IncidentId: S.optional(S.String),
  SentTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeliveryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReadTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const PagesList = S.Array(Page);
export class ListPagesByEngagementResult extends S.Class<ListPagesByEngagementResult>(
  "ListPagesByEngagementResult",
)({ NextToken: S.optional(S.String), Pages: PagesList }) {}
export class ListPreviewRotationShiftsRequest extends S.Class<ListPreviewRotationShiftsRequest>(
  "ListPreviewRotationShiftsRequest",
)(
  {
    RotationStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Members: RotationPreviewMemberList,
    TimeZoneId: S.String,
    Recurrence: RecurrenceSettings,
    Overrides: S.optional(OverrideList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResult extends S.Class<ListTagsForResourceResult>(
  "ListTagsForResourceResult",
)({ Tags: S.optional(TagsList) }) {}
export class StartEngagementResult extends S.Class<StartEngagementResult>(
  "StartEngagementResult",
)({ EngagementArn: S.String }) {}
export class ContactChannel extends S.Class<ContactChannel>("ContactChannel")({
  ContactChannelArn: S.String,
  ContactArn: S.String,
  Name: S.String,
  Type: S.optional(S.String),
  DeliveryAddress: ContactChannelAddress,
  ActivationStatus: S.String,
}) {}
export const ContactChannelList = S.Array(ContactChannel);
export class Contact extends S.Class<Contact>("Contact")({
  ContactArn: S.String,
  Alias: S.String,
  DisplayName: S.optional(S.String),
  Type: S.String,
}) {}
export const ContactsList = S.Array(Contact);
export class Receipt extends S.Class<Receipt>("Receipt")({
  ContactChannelArn: S.optional(S.String),
  ReceiptType: S.String,
  ReceiptInfo: S.optional(S.String),
  ReceiptTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ReceiptsList = S.Array(Receipt);
export class ResolutionContact extends S.Class<ResolutionContact>(
  "ResolutionContact",
)({ ContactArn: S.String, Type: S.String, StageIndex: S.optional(S.Number) }) {}
export const ResolutionList = S.Array(ResolutionContact);
export class RotationOverride extends S.Class<RotationOverride>(
  "RotationOverride",
)({
  RotationOverrideId: S.String,
  NewContactIds: SsmContactsArnList,
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const RotationOverrides = S.Array(RotationOverride);
export class Rotation extends S.Class<Rotation>("Rotation")({
  RotationArn: S.String,
  Name: S.String,
  ContactIds: S.optional(SsmContactsArnList),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TimeZoneId: S.optional(S.String),
  Recurrence: S.optional(RecurrenceSettings),
}) {}
export const Rotations = S.Array(Rotation);
export class CreateContactChannelResult extends S.Class<CreateContactChannelResult>(
  "CreateContactChannelResult",
)({ ContactChannelArn: S.String }) {}
export class ListContactChannelsResult extends S.Class<ListContactChannelsResult>(
  "ListContactChannelsResult",
)({ NextToken: S.optional(S.String), ContactChannels: ContactChannelList }) {}
export class ListContactsResult extends S.Class<ListContactsResult>(
  "ListContactsResult",
)({ NextToken: S.optional(S.String), Contacts: S.optional(ContactsList) }) {}
export class ListPageReceiptsResult extends S.Class<ListPageReceiptsResult>(
  "ListPageReceiptsResult",
)({ NextToken: S.optional(S.String), Receipts: S.optional(ReceiptsList) }) {}
export class ListPageResolutionsResult extends S.Class<ListPageResolutionsResult>(
  "ListPageResolutionsResult",
)({ NextToken: S.optional(S.String), PageResolutions: ResolutionList }) {}
export class ListPagesByContactResult extends S.Class<ListPagesByContactResult>(
  "ListPagesByContactResult",
)({ NextToken: S.optional(S.String), Pages: PagesList }) {}
export class ShiftDetails extends S.Class<ShiftDetails>("ShiftDetails")({
  OverriddenContactIds: SsmContactsArnList,
}) {}
export class RotationShift extends S.Class<RotationShift>("RotationShift")({
  ContactIds: S.optional(SsmContactsArnList),
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Type: S.optional(S.String),
  ShiftDetails: S.optional(ShiftDetails),
}) {}
export const RotationShifts = S.Array(RotationShift);
export class ListPreviewRotationShiftsResult extends S.Class<ListPreviewRotationShiftsResult>(
  "ListPreviewRotationShiftsResult",
)({
  RotationShifts: S.optional(RotationShifts),
  NextToken: S.optional(S.String),
}) {}
export class ListRotationOverridesResult extends S.Class<ListRotationOverridesResult>(
  "ListRotationOverridesResult",
)({
  RotationOverrides: S.optional(RotationOverrides),
  NextToken: S.optional(S.String),
}) {}
export class ListRotationsResult extends S.Class<ListRotationsResult>(
  "ListRotationsResult",
)({ NextToken: S.optional(S.String), Rotations: Rotations }) {}
export class Engagement extends S.Class<Engagement>("Engagement")({
  EngagementArn: S.String,
  ContactArn: S.String,
  Sender: S.String,
  IncidentId: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EngagementsList = S.Array(Engagement);
export class DependentEntity extends S.Class<DependentEntity>(
  "DependentEntity",
)({ RelationType: S.String, DependentResourceIds: SsmContactsArnList }) {}
export const DependentEntityList = S.Array(DependentEntity);
export class CreateRotationRequest extends S.Class<CreateRotationRequest>(
  "CreateRotationRequest",
)(
  {
    Name: S.String,
    ContactIds: RotationContactsArnList,
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TimeZoneId: S.String,
    Recurrence: RecurrenceSettings,
    Tags: S.optional(TagsList),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEngagementsResult extends S.Class<ListEngagementsResult>(
  "ListEngagementsResult",
)({ NextToken: S.optional(S.String), Engagements: EngagementsList }) {}
export class ListRotationShiftsResult extends S.Class<ListRotationShiftsResult>(
  "ListRotationShiftsResult",
)({
  RotationShifts: S.optional(RotationShifts),
  NextToken: S.optional(S.String),
}) {}
export class CreateContactRequest extends S.Class<CreateContactRequest>(
  "CreateContactRequest",
)(
  {
    Alias: S.String,
    DisplayName: S.optional(S.String),
    Type: S.String,
    Plan: Plan,
    Tags: S.optional(TagsList),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRotationResult extends S.Class<CreateRotationResult>(
  "CreateRotationResult",
)({ RotationArn: S.String }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ Name: S.String, Message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class CreateContactResult extends S.Class<CreateContactResult>(
  "CreateContactResult",
)({ ContactArn: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class DataEncryptionException extends S.TaggedError<DataEncryptionException>()(
  "DataEncryptionException",
  { Message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    DependentEntities: S.optional(DependentEntityList),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    QuotaCode: S.String,
    ServiceCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.optional(S.String),
    Fields: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Lists all contacts and escalation plans in Incident Manager.
 */
export const listContacts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListContactsRequest,
  output: ListContactsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all engagements that have happened in an incident.
 */
export const listEngagements = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEngagementsRequest,
  output: ListEngagementsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * To remove a contact from Incident Manager, you can delete the contact. However, deleting a
 * contact does not remove it from escalation plans and related response plans. Deleting an
 * escalation plan also does not remove it from all related response plans. To modify an
 * escalation plan, we recommend using the UpdateContact action to specify a
 * different existing contact.
 */
export const deleteContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContactRequest,
  output: DeleteContactResult,
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
 * Incident Manager uses engagements to engage contacts and escalation plans during an incident.
 * Use this command to describe the engagement that occurred during an incident.
 */
export const describeEngagement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEngagementRequest,
  output: DescribeEngagementResult,
  errors: [
    AccessDeniedException,
    DataEncryptionException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all contact channels for the specified contact.
 */
export const listContactChannels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListContactChannelsRequest,
  output: ListContactChannelsResult,
  errors: [
    AccessDeniedException,
    DataEncryptionException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all of the engagements to contact channels that have been acknowledged.
 */
export const listPageReceipts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPageReceiptsRequest,
  output: ListPageReceiptsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the resolution path of an engagement. For example, the escalation plan engaged
 * in an incident might target an on-call schedule that includes several contacts in a
 * rotation, but just one contact on-call when the incident starts. The resolution path
 * indicates the hierarchy of escalation plan > on-call schedule >
 * contact.
 */
export const listPageResolutions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPageResolutionsRequest,
  output: ListPageResolutionsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the engagements to a contact's contact channels.
 */
export const listPagesByContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPagesByContactRequest,
  output: ListPagesByContactResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of overrides currently specified for an on-call rotation.
 */
export const listRotationOverrides = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRotationOverridesRequest,
    output: ListRotationOverridesResult,
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
 * Retrieves a list of on-call rotations.
 */
export const listRotations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRotationsRequest,
  output: ListRotationsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the resource policies attached to the specified contact or escalation
 * plan.
 */
export const getContactPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContactPolicyRequest,
  output: GetContactPolicyResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an on-call rotation.
 */
export const getRotation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRotationRequest,
  output: GetRotationResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about an override to an on-call rotation.
 */
export const getRotationOverride = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRotationOverrideRequest,
  output: GetRotationOverrideResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the engagements to contact channels that occurred by engaging a contact.
 */
export const listPagesByEngagement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPagesByEngagementRequest,
    output: ListPagesByEngagementResult,
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
 * Lists the tags of a contact, escalation plan, rotation, or on-call schedule.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Activates a contact's contact channel. Incident Manager can't engage a contact until the
 * contact channel has been activated.
 */
export const activateContactChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ActivateContactChannelRequest,
    output: ActivateContactChannelResult,
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
 * To no longer receive Incident Manager engagements to a contact channel, you can deactivate
 * the channel.
 */
export const deactivateContactChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeactivateContactChannelRequest,
    output: DeactivateContactChannelResult,
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
 * To stop receiving engagements on a contact channel, you can delete the channel from a
 * contact. Deleting the contact channel does not remove it from the contact's engagement
 * plan, but the stage that includes the channel will be ignored. If you delete the only
 * contact channel for a contact, you'll no longer be able to engage that contact during an
 * incident.
 */
export const deleteContactChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteContactChannelRequest,
    output: DeleteContactChannelResult,
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
 * Deletes an existing override for an on-call rotation.
 */
export const deleteRotationOverride = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRotationOverrideRequest,
    output: DeleteRotationOverrideResult,
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
 * Stops an engagement before it finishes the final stage of the escalation plan or
 * engagement plan. Further contacts aren't engaged.
 */
export const stopEngagement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopEngagementRequest,
  output: StopEngagementResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists details of the engagement to a contact channel.
 */
export const describePage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePageRequest,
  output: DescribePageResult,
  errors: [
    AccessDeniedException,
    DataEncryptionException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified contact or escalation plan.
 */
export const getContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContactRequest,
  output: GetContactResult,
  errors: [
    AccessDeniedException,
    DataEncryptionException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List details about a specific contact channel.
 */
export const getContactChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContactChannelRequest,
  output: GetContactChannelResult,
  errors: [
    AccessDeniedException,
    DataEncryptionException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts an engagement to a contact or escalation plan. The engagement engages each
 * contact specified in the incident.
 */
export const startEngagement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartEngagementRequest,
  output: StartEngagementResult,
  errors: [
    AccessDeniedException,
    DataEncryptionException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of shifts based on rotation configuration parameters.
 *
 * The Incident Manager primarily uses this operation to populate the **Preview** calendar. It is not typically run by end users.
 */
export const listPreviewRotationShifts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPreviewRotationShiftsRequest,
    output: ListPreviewRotationShiftsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Used to acknowledge an engagement to a contact channel during an incident.
 */
export const acceptPage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptPageRequest,
  output: AcceptPageResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a rotation from the system. If a rotation belongs to more than one on-call
 * schedule, this operation deletes it from all of them.
 */
export const deleteRotation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRotationRequest,
  output: DeleteRotationResult,
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
 * Adds a resource policy to the specified contact or escalation plan. The resource policy
 * is used to share the contact or escalation plan using Resource Access Manager (RAM). For more information about cross-account sharing, see Setting up
 * cross-account functionality.
 */
export const putContactPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutContactPolicyRequest,
  output: PutContactPolicyResult,
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
 * Updates a contact's contact channel.
 */
export const updateContactChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateContactChannelRequest,
    output: UpdateContactChannelResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      DataEncryptionException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the information specified for an on-call rotation.
 */
export const updateRotation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRotationRequest,
  output: UpdateRotationResult,
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
 * A contact channel is the method that Incident Manager uses to engage your contact.
 */
export const createContactChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateContactChannelRequest,
    output: CreateContactChannelResult,
    errors: [
      AccessDeniedException,
      ConflictException,
      DataEncryptionException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of shifts generated by an existing rotation in the system.
 */
export const listRotationShifts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRotationShiftsRequest,
  output: ListRotationShiftsResult,
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
 * Creates an override for a rotation in an on-call schedule.
 */
export const createRotationOverride = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRotationOverrideRequest,
    output: CreateRotationOverrideResult,
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
 * Tags a contact or escalation plan. You can tag only contacts and escalation plans in the
 * first region of your replication set.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends an activation code to a contact channel. The contact can use this code to activate
 * the contact channel in the console or with the `ActivateChannel` operation.
 * Incident Manager can't engage a contact channel until it has been activated.
 */
export const sendActivationCode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendActivationCodeRequest,
  output: SendActivationCodeResult,
  errors: [
    AccessDeniedException,
    DataEncryptionException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the contact or escalation plan specified.
 */
export const updateContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContactRequest,
  output: UpdateContactResult,
  errors: [
    AccessDeniedException,
    DataEncryptionException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a rotation in an on-call schedule.
 */
export const createRotation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRotationRequest,
  output: CreateRotationResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Contacts are either the contacts that Incident Manager engages during an incident or the
 * escalation plans that Incident Manager uses to engage contacts in phases during an
 * incident.
 */
export const createContact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContactRequest,
  output: CreateContactResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    DataEncryptionException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

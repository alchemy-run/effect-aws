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

//# Newtypes
export type SsmContactsArn = string;
export type ReceiptInfo = string;
export type AcceptCode = string;
export type ActivationCode = string;
export type ContactAlias = string;
export type ContactName = string;
export type IdempotencyToken = string;
export type ChannelName = string;
export type RotationName = string;
export type TimeZoneId = string;
export type Uuid = string;
export type PaginationToken = string;
export type MaxResults = number;
export type IncidentId = string;
export type Member = string;
export type AmazonResourceName = string;
export type Policy = string;
export type Sender = string;
export type Subject = string;
export type Content = string;
export type PublicSubject = string;
export type PublicContent = string;
export type StopReason = string;
export type TagKey = string;
export type TagValue = string;
export type SimpleAddress = string;
export type NumberOfOnCalls = number;
export type RecurrenceMultiplier = number;
export type StageDurationInMins = number;
export type DayOfMonth = number;
export type HourOfDay = number;
export type MinuteOfHour = number;
export type StageIndex = number;
export type RetryAfterSeconds = number;
export type RetryIntervalInMinutes = number;

//# Schemas
export type RotationContactsArnList = string[];
export const RotationContactsArnList = S.Array(S.String);
export type RotationOverrideContactsArnList = string[];
export const RotationOverrideContactsArnList = S.Array(S.String);
export type RotationPreviewMemberList = string[];
export const RotationPreviewMemberList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AcceptPageRequest {
  PageId: string;
  ContactChannelId?: string;
  AcceptType: string;
  Note?: string;
  AcceptCode: string;
  AcceptCodeValidation?: string;
}
export const AcceptPageRequest = S.suspend(() =>
  S.Struct({
    PageId: S.String,
    ContactChannelId: S.optional(S.String),
    AcceptType: S.String,
    Note: S.optional(S.String),
    AcceptCode: S.String,
    AcceptCodeValidation: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AcceptPageRequest",
}) as any as S.Schema<AcceptPageRequest>;
export interface AcceptPageResult {}
export const AcceptPageResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "AcceptPageResult",
}) as any as S.Schema<AcceptPageResult>;
export interface ActivateContactChannelRequest {
  ContactChannelId: string;
  ActivationCode: string;
}
export const ActivateContactChannelRequest = S.suspend(() =>
  S.Struct({ ContactChannelId: S.String, ActivationCode: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ActivateContactChannelRequest",
}) as any as S.Schema<ActivateContactChannelRequest>;
export interface ActivateContactChannelResult {}
export const ActivateContactChannelResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ActivateContactChannelResult",
}) as any as S.Schema<ActivateContactChannelResult>;
export interface CreateRotationOverrideRequest {
  RotationId: string;
  NewContactIds: RotationOverrideContactsArnList;
  StartTime: Date;
  EndTime: Date;
  IdempotencyToken?: string;
}
export const CreateRotationOverrideRequest = S.suspend(() =>
  S.Struct({
    RotationId: S.String,
    NewContactIds: RotationOverrideContactsArnList,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    IdempotencyToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRotationOverrideRequest",
}) as any as S.Schema<CreateRotationOverrideRequest>;
export interface DeactivateContactChannelRequest {
  ContactChannelId: string;
}
export const DeactivateContactChannelRequest = S.suspend(() =>
  S.Struct({ ContactChannelId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeactivateContactChannelRequest",
}) as any as S.Schema<DeactivateContactChannelRequest>;
export interface DeactivateContactChannelResult {}
export const DeactivateContactChannelResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeactivateContactChannelResult",
}) as any as S.Schema<DeactivateContactChannelResult>;
export interface DeleteContactRequest {
  ContactId: string;
}
export const DeleteContactRequest = S.suspend(() =>
  S.Struct({ ContactId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteContactRequest",
}) as any as S.Schema<DeleteContactRequest>;
export interface DeleteContactResult {}
export const DeleteContactResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteContactResult",
}) as any as S.Schema<DeleteContactResult>;
export interface DeleteContactChannelRequest {
  ContactChannelId: string;
}
export const DeleteContactChannelRequest = S.suspend(() =>
  S.Struct({ ContactChannelId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteContactChannelRequest",
}) as any as S.Schema<DeleteContactChannelRequest>;
export interface DeleteContactChannelResult {}
export const DeleteContactChannelResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteContactChannelResult",
}) as any as S.Schema<DeleteContactChannelResult>;
export interface DeleteRotationRequest {
  RotationId: string;
}
export const DeleteRotationRequest = S.suspend(() =>
  S.Struct({ RotationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRotationRequest",
}) as any as S.Schema<DeleteRotationRequest>;
export interface DeleteRotationResult {}
export const DeleteRotationResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteRotationResult",
}) as any as S.Schema<DeleteRotationResult>;
export interface DeleteRotationOverrideRequest {
  RotationId: string;
  RotationOverrideId: string;
}
export const DeleteRotationOverrideRequest = S.suspend(() =>
  S.Struct({ RotationId: S.String, RotationOverrideId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRotationOverrideRequest",
}) as any as S.Schema<DeleteRotationOverrideRequest>;
export interface DeleteRotationOverrideResult {}
export const DeleteRotationOverrideResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRotationOverrideResult",
}) as any as S.Schema<DeleteRotationOverrideResult>;
export interface DescribeEngagementRequest {
  EngagementId: string;
}
export const DescribeEngagementRequest = S.suspend(() =>
  S.Struct({ EngagementId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEngagementRequest",
}) as any as S.Schema<DescribeEngagementRequest>;
export interface DescribePageRequest {
  PageId: string;
}
export const DescribePageRequest = S.suspend(() =>
  S.Struct({ PageId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribePageRequest",
}) as any as S.Schema<DescribePageRequest>;
export interface GetContactRequest {
  ContactId: string;
}
export const GetContactRequest = S.suspend(() =>
  S.Struct({ ContactId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetContactRequest",
}) as any as S.Schema<GetContactRequest>;
export interface GetContactChannelRequest {
  ContactChannelId: string;
}
export const GetContactChannelRequest = S.suspend(() =>
  S.Struct({ ContactChannelId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetContactChannelRequest",
}) as any as S.Schema<GetContactChannelRequest>;
export interface GetContactPolicyRequest {
  ContactArn: string;
}
export const GetContactPolicyRequest = S.suspend(() =>
  S.Struct({ ContactArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetContactPolicyRequest",
}) as any as S.Schema<GetContactPolicyRequest>;
export interface GetRotationRequest {
  RotationId: string;
}
export const GetRotationRequest = S.suspend(() =>
  S.Struct({ RotationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRotationRequest",
}) as any as S.Schema<GetRotationRequest>;
export interface GetRotationOverrideRequest {
  RotationId: string;
  RotationOverrideId: string;
}
export const GetRotationOverrideRequest = S.suspend(() =>
  S.Struct({ RotationId: S.String, RotationOverrideId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRotationOverrideRequest",
}) as any as S.Schema<GetRotationOverrideRequest>;
export interface ListContactChannelsRequest {
  ContactId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListContactChannelsRequest = S.suspend(() =>
  S.Struct({
    ContactId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListContactChannelsRequest",
}) as any as S.Schema<ListContactChannelsRequest>;
export interface ListContactsRequest {
  NextToken?: string;
  MaxResults?: number;
  AliasPrefix?: string;
  Type?: string;
}
export const ListContactsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    AliasPrefix: S.optional(S.String),
    Type: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListContactsRequest",
}) as any as S.Schema<ListContactsRequest>;
export interface ListPageReceiptsRequest {
  PageId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListPageReceiptsRequest = S.suspend(() =>
  S.Struct({
    PageId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPageReceiptsRequest",
}) as any as S.Schema<ListPageReceiptsRequest>;
export interface ListPageResolutionsRequest {
  NextToken?: string;
  PageId: string;
}
export const ListPageResolutionsRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), PageId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPageResolutionsRequest",
}) as any as S.Schema<ListPageResolutionsRequest>;
export interface ListPagesByContactRequest {
  ContactId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListPagesByContactRequest = S.suspend(() =>
  S.Struct({
    ContactId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPagesByContactRequest",
}) as any as S.Schema<ListPagesByContactRequest>;
export interface ListPagesByEngagementRequest {
  EngagementId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListPagesByEngagementRequest = S.suspend(() =>
  S.Struct({
    EngagementId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPagesByEngagementRequest",
}) as any as S.Schema<ListPagesByEngagementRequest>;
export interface ListRotationOverridesRequest {
  RotationId: string;
  StartTime: Date;
  EndTime: Date;
  NextToken?: string;
  MaxResults?: number;
}
export const ListRotationOverridesRequest = S.suspend(() =>
  S.Struct({
    RotationId: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRotationOverridesRequest",
}) as any as S.Schema<ListRotationOverridesRequest>;
export interface ListRotationsRequest {
  RotationNamePrefix?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListRotationsRequest = S.suspend(() =>
  S.Struct({
    RotationNamePrefix: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRotationsRequest",
}) as any as S.Schema<ListRotationsRequest>;
export interface ListRotationShiftsRequest {
  RotationId: string;
  StartTime?: Date;
  EndTime: Date;
  NextToken?: string;
  MaxResults?: number;
}
export const ListRotationShiftsRequest = S.suspend(() =>
  S.Struct({
    RotationId: S.String,
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRotationShiftsRequest",
}) as any as S.Schema<ListRotationShiftsRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface PutContactPolicyRequest {
  ContactArn: string;
  Policy: string;
}
export const PutContactPolicyRequest = S.suspend(() =>
  S.Struct({ ContactArn: S.String, Policy: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutContactPolicyRequest",
}) as any as S.Schema<PutContactPolicyRequest>;
export interface PutContactPolicyResult {}
export const PutContactPolicyResult = S.suspend(() => S.Struct({})).annotations(
  { identifier: "PutContactPolicyResult" },
) as any as S.Schema<PutContactPolicyResult>;
export interface SendActivationCodeRequest {
  ContactChannelId: string;
}
export const SendActivationCodeRequest = S.suspend(() =>
  S.Struct({ ContactChannelId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendActivationCodeRequest",
}) as any as S.Schema<SendActivationCodeRequest>;
export interface SendActivationCodeResult {}
export const SendActivationCodeResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SendActivationCodeResult",
}) as any as S.Schema<SendActivationCodeResult>;
export interface StartEngagementRequest {
  ContactId: string;
  Sender: string;
  Subject: string;
  Content: string;
  PublicSubject?: string;
  PublicContent?: string;
  IncidentId?: string;
  IdempotencyToken?: string;
}
export const StartEngagementRequest = S.suspend(() =>
  S.Struct({
    ContactId: S.String,
    Sender: S.String,
    Subject: S.String,
    Content: S.String,
    PublicSubject: S.optional(S.String),
    PublicContent: S.optional(S.String),
    IncidentId: S.optional(S.String),
    IdempotencyToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartEngagementRequest",
}) as any as S.Schema<StartEngagementRequest>;
export interface StopEngagementRequest {
  EngagementId: string;
  Reason?: string;
}
export const StopEngagementRequest = S.suspend(() =>
  S.Struct({ EngagementId: S.String, Reason: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopEngagementRequest",
}) as any as S.Schema<StopEngagementRequest>;
export interface StopEngagementResult {}
export const StopEngagementResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopEngagementResult",
}) as any as S.Schema<StopEngagementResult>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagsList = Tag[];
export const TagsList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: TagsList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagsList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResult {}
export const TagResourceResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResult",
}) as any as S.Schema<TagResourceResult>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResult {}
export const UntagResourceResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResult",
}) as any as S.Schema<UntagResourceResult>;
export interface ChannelTargetInfo {
  ContactChannelId: string;
  RetryIntervalInMinutes?: number;
}
export const ChannelTargetInfo = S.suspend(() =>
  S.Struct({
    ContactChannelId: S.String,
    RetryIntervalInMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "ChannelTargetInfo",
}) as any as S.Schema<ChannelTargetInfo>;
export interface ContactTargetInfo {
  ContactId?: string;
  IsEssential: boolean;
}
export const ContactTargetInfo = S.suspend(() =>
  S.Struct({ ContactId: S.optional(S.String), IsEssential: S.Boolean }),
).annotations({
  identifier: "ContactTargetInfo",
}) as any as S.Schema<ContactTargetInfo>;
export interface Target {
  ChannelTargetInfo?: ChannelTargetInfo;
  ContactTargetInfo?: ContactTargetInfo;
}
export const Target = S.suspend(() =>
  S.Struct({
    ChannelTargetInfo: S.optional(ChannelTargetInfo),
    ContactTargetInfo: S.optional(ContactTargetInfo),
  }),
).annotations({ identifier: "Target" }) as any as S.Schema<Target>;
export type TargetsList = Target[];
export const TargetsList = S.Array(Target);
export interface Stage {
  DurationInMinutes: number;
  Targets: TargetsList;
}
export const Stage = S.suspend(() =>
  S.Struct({ DurationInMinutes: S.Number, Targets: TargetsList }),
).annotations({ identifier: "Stage" }) as any as S.Schema<Stage>;
export type StagesList = Stage[];
export const StagesList = S.Array(Stage);
export type SsmContactsArnList = string[];
export const SsmContactsArnList = S.Array(S.String);
export interface Plan {
  Stages?: StagesList;
  RotationIds?: SsmContactsArnList;
}
export const Plan = S.suspend(() =>
  S.Struct({
    Stages: S.optional(StagesList),
    RotationIds: S.optional(SsmContactsArnList),
  }),
).annotations({ identifier: "Plan" }) as any as S.Schema<Plan>;
export interface UpdateContactRequest {
  ContactId: string;
  DisplayName?: string;
  Plan?: Plan;
}
export const UpdateContactRequest = S.suspend(() =>
  S.Struct({
    ContactId: S.String,
    DisplayName: S.optional(S.String),
    Plan: S.optional(Plan),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateContactRequest",
}) as any as S.Schema<UpdateContactRequest>;
export interface UpdateContactResult {}
export const UpdateContactResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateContactResult",
}) as any as S.Schema<UpdateContactResult>;
export interface ContactChannelAddress {
  SimpleAddress?: string;
}
export const ContactChannelAddress = S.suspend(() =>
  S.Struct({ SimpleAddress: S.optional(S.String) }),
).annotations({
  identifier: "ContactChannelAddress",
}) as any as S.Schema<ContactChannelAddress>;
export interface UpdateContactChannelRequest {
  ContactChannelId: string;
  Name?: string;
  DeliveryAddress?: ContactChannelAddress;
}
export const UpdateContactChannelRequest = S.suspend(() =>
  S.Struct({
    ContactChannelId: S.String,
    Name: S.optional(S.String),
    DeliveryAddress: S.optional(ContactChannelAddress),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateContactChannelRequest",
}) as any as S.Schema<UpdateContactChannelRequest>;
export interface UpdateContactChannelResult {}
export const UpdateContactChannelResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateContactChannelResult",
}) as any as S.Schema<UpdateContactChannelResult>;
export interface HandOffTime {
  HourOfDay: number;
  MinuteOfHour: number;
}
export const HandOffTime = S.suspend(() =>
  S.Struct({ HourOfDay: S.Number, MinuteOfHour: S.Number }),
).annotations({ identifier: "HandOffTime" }) as any as S.Schema<HandOffTime>;
export interface MonthlySetting {
  DayOfMonth: number;
  HandOffTime: HandOffTime;
}
export const MonthlySetting = S.suspend(() =>
  S.Struct({ DayOfMonth: S.Number, HandOffTime: HandOffTime }),
).annotations({
  identifier: "MonthlySetting",
}) as any as S.Schema<MonthlySetting>;
export type MonthlySettings = MonthlySetting[];
export const MonthlySettings = S.Array(MonthlySetting);
export interface WeeklySetting {
  DayOfWeek: string;
  HandOffTime: HandOffTime;
}
export const WeeklySetting = S.suspend(() =>
  S.Struct({ DayOfWeek: S.String, HandOffTime: HandOffTime }),
).annotations({
  identifier: "WeeklySetting",
}) as any as S.Schema<WeeklySetting>;
export type WeeklySettings = WeeklySetting[];
export const WeeklySettings = S.Array(WeeklySetting);
export type DailySettings = HandOffTime[];
export const DailySettings = S.Array(HandOffTime);
export interface CoverageTime {
  Start?: HandOffTime;
  End?: HandOffTime;
}
export const CoverageTime = S.suspend(() =>
  S.Struct({ Start: S.optional(HandOffTime), End: S.optional(HandOffTime) }),
).annotations({ identifier: "CoverageTime" }) as any as S.Schema<CoverageTime>;
export type CoverageTimes = CoverageTime[];
export const CoverageTimes = S.Array(CoverageTime);
export type ShiftCoveragesMap = { [key: string]: CoverageTimes };
export const ShiftCoveragesMap = S.Record({
  key: S.String,
  value: CoverageTimes,
});
export interface RecurrenceSettings {
  MonthlySettings?: MonthlySettings;
  WeeklySettings?: WeeklySettings;
  DailySettings?: DailySettings;
  NumberOfOnCalls: number;
  ShiftCoverages?: ShiftCoveragesMap;
  RecurrenceMultiplier: number;
}
export const RecurrenceSettings = S.suspend(() =>
  S.Struct({
    MonthlySettings: S.optional(MonthlySettings),
    WeeklySettings: S.optional(WeeklySettings),
    DailySettings: S.optional(DailySettings),
    NumberOfOnCalls: S.Number,
    ShiftCoverages: S.optional(ShiftCoveragesMap),
    RecurrenceMultiplier: S.Number,
  }),
).annotations({
  identifier: "RecurrenceSettings",
}) as any as S.Schema<RecurrenceSettings>;
export interface UpdateRotationRequest {
  RotationId: string;
  ContactIds?: RotationContactsArnList;
  StartTime?: Date;
  TimeZoneId?: string;
  Recurrence: RecurrenceSettings;
}
export const UpdateRotationRequest = S.suspend(() =>
  S.Struct({
    RotationId: S.String,
    ContactIds: S.optional(RotationContactsArnList),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TimeZoneId: S.optional(S.String),
    Recurrence: RecurrenceSettings,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateRotationRequest",
}) as any as S.Schema<UpdateRotationRequest>;
export interface UpdateRotationResult {}
export const UpdateRotationResult = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateRotationResult",
}) as any as S.Schema<UpdateRotationResult>;
export type RotationOverridePreviewMemberList = string[];
export const RotationOverridePreviewMemberList = S.Array(S.String);
export interface TimeRange {
  StartTime?: Date;
  EndTime?: Date;
}
export const TimeRange = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "TimeRange" }) as any as S.Schema<TimeRange>;
export interface PreviewOverride {
  NewMembers?: RotationOverridePreviewMemberList;
  StartTime?: Date;
  EndTime?: Date;
}
export const PreviewOverride = S.suspend(() =>
  S.Struct({
    NewMembers: S.optional(RotationOverridePreviewMemberList),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "PreviewOverride",
}) as any as S.Schema<PreviewOverride>;
export type OverrideList = PreviewOverride[];
export const OverrideList = S.Array(PreviewOverride);
export interface CreateContactChannelRequest {
  ContactId: string;
  Name: string;
  Type: string;
  DeliveryAddress: ContactChannelAddress;
  DeferActivation?: boolean;
  IdempotencyToken?: string;
}
export const CreateContactChannelRequest = S.suspend(() =>
  S.Struct({
    ContactId: S.String,
    Name: S.String,
    Type: S.String,
    DeliveryAddress: ContactChannelAddress,
    DeferActivation: S.optional(S.Boolean),
    IdempotencyToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateContactChannelRequest",
}) as any as S.Schema<CreateContactChannelRequest>;
export interface CreateRotationOverrideResult {
  RotationOverrideId: string;
}
export const CreateRotationOverrideResult = S.suspend(() =>
  S.Struct({ RotationOverrideId: S.String }),
).annotations({
  identifier: "CreateRotationOverrideResult",
}) as any as S.Schema<CreateRotationOverrideResult>;
export interface DescribeEngagementResult {
  ContactArn: string;
  EngagementArn: string;
  Sender: string;
  Subject: string;
  Content: string;
  PublicSubject?: string;
  PublicContent?: string;
  IncidentId?: string;
  StartTime?: Date;
  StopTime?: Date;
}
export const DescribeEngagementResult = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DescribeEngagementResult",
}) as any as S.Schema<DescribeEngagementResult>;
export interface DescribePageResult {
  PageArn: string;
  EngagementArn: string;
  ContactArn: string;
  Sender: string;
  Subject: string;
  Content: string;
  PublicSubject?: string;
  PublicContent?: string;
  IncidentId?: string;
  SentTime?: Date;
  ReadTime?: Date;
  DeliveryTime?: Date;
}
export const DescribePageResult = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DescribePageResult",
}) as any as S.Schema<DescribePageResult>;
export interface GetContactResult {
  ContactArn: string;
  Alias: string;
  DisplayName?: string;
  Type: string;
  Plan: Plan;
}
export const GetContactResult = S.suspend(() =>
  S.Struct({
    ContactArn: S.String,
    Alias: S.String,
    DisplayName: S.optional(S.String),
    Type: S.String,
    Plan: Plan,
  }),
).annotations({
  identifier: "GetContactResult",
}) as any as S.Schema<GetContactResult>;
export interface GetContactChannelResult {
  ContactArn: string;
  ContactChannelArn: string;
  Name: string;
  Type: string;
  DeliveryAddress: ContactChannelAddress;
  ActivationStatus?: string;
}
export const GetContactChannelResult = S.suspend(() =>
  S.Struct({
    ContactArn: S.String,
    ContactChannelArn: S.String,
    Name: S.String,
    Type: S.String,
    DeliveryAddress: ContactChannelAddress,
    ActivationStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "GetContactChannelResult",
}) as any as S.Schema<GetContactChannelResult>;
export interface GetContactPolicyResult {
  ContactArn?: string;
  Policy?: string;
}
export const GetContactPolicyResult = S.suspend(() =>
  S.Struct({ ContactArn: S.optional(S.String), Policy: S.optional(S.String) }),
).annotations({
  identifier: "GetContactPolicyResult",
}) as any as S.Schema<GetContactPolicyResult>;
export interface GetRotationResult {
  RotationArn: string;
  Name: string;
  ContactIds: RotationContactsArnList;
  StartTime: Date;
  TimeZoneId: string;
  Recurrence: RecurrenceSettings;
}
export const GetRotationResult = S.suspend(() =>
  S.Struct({
    RotationArn: S.String,
    Name: S.String,
    ContactIds: RotationContactsArnList,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    TimeZoneId: S.String,
    Recurrence: RecurrenceSettings,
  }),
).annotations({
  identifier: "GetRotationResult",
}) as any as S.Schema<GetRotationResult>;
export interface GetRotationOverrideResult {
  RotationOverrideId?: string;
  RotationArn?: string;
  NewContactIds?: SsmContactsArnList;
  StartTime?: Date;
  EndTime?: Date;
  CreateTime?: Date;
}
export const GetRotationOverrideResult = S.suspend(() =>
  S.Struct({
    RotationOverrideId: S.optional(S.String),
    RotationArn: S.optional(S.String),
    NewContactIds: S.optional(SsmContactsArnList),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetRotationOverrideResult",
}) as any as S.Schema<GetRotationOverrideResult>;
export interface ListEngagementsRequest {
  NextToken?: string;
  MaxResults?: number;
  IncidentId?: string;
  TimeRangeValue?: TimeRange;
}
export const ListEngagementsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    IncidentId: S.optional(S.String),
    TimeRangeValue: S.optional(TimeRange),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEngagementsRequest",
}) as any as S.Schema<ListEngagementsRequest>;
export interface Page {
  PageArn: string;
  EngagementArn: string;
  ContactArn: string;
  Sender: string;
  IncidentId?: string;
  SentTime?: Date;
  DeliveryTime?: Date;
  ReadTime?: Date;
}
export const Page = S.suspend(() =>
  S.Struct({
    PageArn: S.String,
    EngagementArn: S.String,
    ContactArn: S.String,
    Sender: S.String,
    IncidentId: S.optional(S.String),
    SentTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DeliveryTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ReadTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Page" }) as any as S.Schema<Page>;
export type PagesList = Page[];
export const PagesList = S.Array(Page);
export interface ListPagesByEngagementResult {
  NextToken?: string;
  Pages: PagesList;
}
export const ListPagesByEngagementResult = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Pages: PagesList }),
).annotations({
  identifier: "ListPagesByEngagementResult",
}) as any as S.Schema<ListPagesByEngagementResult>;
export interface ListPreviewRotationShiftsRequest {
  RotationStartTime?: Date;
  StartTime?: Date;
  EndTime: Date;
  Members: RotationPreviewMemberList;
  TimeZoneId: string;
  Recurrence: RecurrenceSettings;
  Overrides?: OverrideList;
  NextToken?: string;
  MaxResults?: number;
}
export const ListPreviewRotationShiftsRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPreviewRotationShiftsRequest",
}) as any as S.Schema<ListPreviewRotationShiftsRequest>;
export interface ListTagsForResourceResult {
  Tags?: TagsList;
}
export const ListTagsForResourceResult = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagsList) }),
).annotations({
  identifier: "ListTagsForResourceResult",
}) as any as S.Schema<ListTagsForResourceResult>;
export interface StartEngagementResult {
  EngagementArn: string;
}
export const StartEngagementResult = S.suspend(() =>
  S.Struct({ EngagementArn: S.String }),
).annotations({
  identifier: "StartEngagementResult",
}) as any as S.Schema<StartEngagementResult>;
export interface ContactChannel {
  ContactChannelArn: string;
  ContactArn: string;
  Name: string;
  Type?: string;
  DeliveryAddress: ContactChannelAddress;
  ActivationStatus: string;
}
export const ContactChannel = S.suspend(() =>
  S.Struct({
    ContactChannelArn: S.String,
    ContactArn: S.String,
    Name: S.String,
    Type: S.optional(S.String),
    DeliveryAddress: ContactChannelAddress,
    ActivationStatus: S.String,
  }),
).annotations({
  identifier: "ContactChannel",
}) as any as S.Schema<ContactChannel>;
export type ContactChannelList = ContactChannel[];
export const ContactChannelList = S.Array(ContactChannel);
export interface Contact {
  ContactArn: string;
  Alias: string;
  DisplayName?: string;
  Type: string;
}
export const Contact = S.suspend(() =>
  S.Struct({
    ContactArn: S.String,
    Alias: S.String,
    DisplayName: S.optional(S.String),
    Type: S.String,
  }),
).annotations({ identifier: "Contact" }) as any as S.Schema<Contact>;
export type ContactsList = Contact[];
export const ContactsList = S.Array(Contact);
export interface Receipt {
  ContactChannelArn?: string;
  ReceiptType: string;
  ReceiptInfo?: string;
  ReceiptTime: Date;
}
export const Receipt = S.suspend(() =>
  S.Struct({
    ContactChannelArn: S.optional(S.String),
    ReceiptType: S.String,
    ReceiptInfo: S.optional(S.String),
    ReceiptTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "Receipt" }) as any as S.Schema<Receipt>;
export type ReceiptsList = Receipt[];
export const ReceiptsList = S.Array(Receipt);
export interface ResolutionContact {
  ContactArn: string;
  Type: string;
  StageIndex?: number;
}
export const ResolutionContact = S.suspend(() =>
  S.Struct({
    ContactArn: S.String,
    Type: S.String,
    StageIndex: S.optional(S.Number),
  }),
).annotations({
  identifier: "ResolutionContact",
}) as any as S.Schema<ResolutionContact>;
export type ResolutionList = ResolutionContact[];
export const ResolutionList = S.Array(ResolutionContact);
export interface RotationOverride {
  RotationOverrideId: string;
  NewContactIds: SsmContactsArnList;
  StartTime: Date;
  EndTime: Date;
  CreateTime: Date;
}
export const RotationOverride = S.suspend(() =>
  S.Struct({
    RotationOverrideId: S.String,
    NewContactIds: SsmContactsArnList,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "RotationOverride",
}) as any as S.Schema<RotationOverride>;
export type RotationOverrides = RotationOverride[];
export const RotationOverrides = S.Array(RotationOverride);
export interface Rotation {
  RotationArn: string;
  Name: string;
  ContactIds?: SsmContactsArnList;
  StartTime?: Date;
  TimeZoneId?: string;
  Recurrence?: RecurrenceSettings;
}
export const Rotation = S.suspend(() =>
  S.Struct({
    RotationArn: S.String,
    Name: S.String,
    ContactIds: S.optional(SsmContactsArnList),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TimeZoneId: S.optional(S.String),
    Recurrence: S.optional(RecurrenceSettings),
  }),
).annotations({ identifier: "Rotation" }) as any as S.Schema<Rotation>;
export type Rotations = Rotation[];
export const Rotations = S.Array(Rotation);
export interface CreateContactChannelResult {
  ContactChannelArn: string;
}
export const CreateContactChannelResult = S.suspend(() =>
  S.Struct({ ContactChannelArn: S.String }),
).annotations({
  identifier: "CreateContactChannelResult",
}) as any as S.Schema<CreateContactChannelResult>;
export interface ListContactChannelsResult {
  NextToken?: string;
  ContactChannels: ContactChannelList;
}
export const ListContactChannelsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ContactChannels: ContactChannelList,
  }),
).annotations({
  identifier: "ListContactChannelsResult",
}) as any as S.Schema<ListContactChannelsResult>;
export interface ListContactsResult {
  NextToken?: string;
  Contacts?: ContactsList;
}
export const ListContactsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Contacts: S.optional(ContactsList),
  }),
).annotations({
  identifier: "ListContactsResult",
}) as any as S.Schema<ListContactsResult>;
export interface ListPageReceiptsResult {
  NextToken?: string;
  Receipts?: ReceiptsList;
}
export const ListPageReceiptsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Receipts: S.optional(ReceiptsList),
  }),
).annotations({
  identifier: "ListPageReceiptsResult",
}) as any as S.Schema<ListPageReceiptsResult>;
export interface ListPageResolutionsResult {
  NextToken?: string;
  PageResolutions: ResolutionList;
}
export const ListPageResolutionsResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PageResolutions: ResolutionList,
  }),
).annotations({
  identifier: "ListPageResolutionsResult",
}) as any as S.Schema<ListPageResolutionsResult>;
export interface ListPagesByContactResult {
  NextToken?: string;
  Pages: PagesList;
}
export const ListPagesByContactResult = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Pages: PagesList }),
).annotations({
  identifier: "ListPagesByContactResult",
}) as any as S.Schema<ListPagesByContactResult>;
export interface ShiftDetails {
  OverriddenContactIds: SsmContactsArnList;
}
export const ShiftDetails = S.suspend(() =>
  S.Struct({ OverriddenContactIds: SsmContactsArnList }),
).annotations({ identifier: "ShiftDetails" }) as any as S.Schema<ShiftDetails>;
export interface RotationShift {
  ContactIds?: SsmContactsArnList;
  StartTime: Date;
  EndTime: Date;
  Type?: string;
  ShiftDetails?: ShiftDetails;
}
export const RotationShift = S.suspend(() =>
  S.Struct({
    ContactIds: S.optional(SsmContactsArnList),
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Type: S.optional(S.String),
    ShiftDetails: S.optional(ShiftDetails),
  }),
).annotations({
  identifier: "RotationShift",
}) as any as S.Schema<RotationShift>;
export type RotationShifts = RotationShift[];
export const RotationShifts = S.Array(RotationShift);
export interface ListPreviewRotationShiftsResult {
  RotationShifts?: RotationShifts;
  NextToken?: string;
}
export const ListPreviewRotationShiftsResult = S.suspend(() =>
  S.Struct({
    RotationShifts: S.optional(RotationShifts),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPreviewRotationShiftsResult",
}) as any as S.Schema<ListPreviewRotationShiftsResult>;
export interface ListRotationOverridesResult {
  RotationOverrides?: RotationOverrides;
  NextToken?: string;
}
export const ListRotationOverridesResult = S.suspend(() =>
  S.Struct({
    RotationOverrides: S.optional(RotationOverrides),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRotationOverridesResult",
}) as any as S.Schema<ListRotationOverridesResult>;
export interface ListRotationsResult {
  NextToken?: string;
  Rotations: Rotations;
}
export const ListRotationsResult = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Rotations: Rotations }),
).annotations({
  identifier: "ListRotationsResult",
}) as any as S.Schema<ListRotationsResult>;
export interface Engagement {
  EngagementArn: string;
  ContactArn: string;
  Sender: string;
  IncidentId?: string;
  StartTime?: Date;
  StopTime?: Date;
}
export const Engagement = S.suspend(() =>
  S.Struct({
    EngagementArn: S.String,
    ContactArn: S.String,
    Sender: S.String,
    IncidentId: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Engagement" }) as any as S.Schema<Engagement>;
export type EngagementsList = Engagement[];
export const EngagementsList = S.Array(Engagement);
export interface DependentEntity {
  RelationType: string;
  DependentResourceIds: SsmContactsArnList;
}
export const DependentEntity = S.suspend(() =>
  S.Struct({
    RelationType: S.String,
    DependentResourceIds: SsmContactsArnList,
  }),
).annotations({
  identifier: "DependentEntity",
}) as any as S.Schema<DependentEntity>;
export type DependentEntityList = DependentEntity[];
export const DependentEntityList = S.Array(DependentEntity);
export interface CreateRotationRequest {
  Name: string;
  ContactIds: RotationContactsArnList;
  StartTime?: Date;
  TimeZoneId: string;
  Recurrence: RecurrenceSettings;
  Tags?: TagsList;
  IdempotencyToken?: string;
}
export const CreateRotationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ContactIds: RotationContactsArnList,
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TimeZoneId: S.String,
    Recurrence: RecurrenceSettings,
    Tags: S.optional(TagsList),
    IdempotencyToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRotationRequest",
}) as any as S.Schema<CreateRotationRequest>;
export interface ListEngagementsResult {
  NextToken?: string;
  Engagements: EngagementsList;
}
export const ListEngagementsResult = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Engagements: EngagementsList }),
).annotations({
  identifier: "ListEngagementsResult",
}) as any as S.Schema<ListEngagementsResult>;
export interface ListRotationShiftsResult {
  RotationShifts?: RotationShifts;
  NextToken?: string;
}
export const ListRotationShiftsResult = S.suspend(() =>
  S.Struct({
    RotationShifts: S.optional(RotationShifts),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRotationShiftsResult",
}) as any as S.Schema<ListRotationShiftsResult>;
export interface CreateContactRequest {
  Alias: string;
  DisplayName?: string;
  Type: string;
  Plan: Plan;
  Tags?: TagsList;
  IdempotencyToken?: string;
}
export const CreateContactRequest = S.suspend(() =>
  S.Struct({
    Alias: S.String,
    DisplayName: S.optional(S.String),
    Type: S.String,
    Plan: Plan,
    Tags: S.optional(TagsList),
    IdempotencyToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateContactRequest",
}) as any as S.Schema<CreateContactRequest>;
export interface CreateRotationResult {
  RotationArn: string;
}
export const CreateRotationResult = S.suspend(() =>
  S.Struct({ RotationArn: S.String }),
).annotations({
  identifier: "CreateRotationResult",
}) as any as S.Schema<CreateRotationResult>;
export interface ValidationExceptionField {
  Name: string;
  Message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ Name: S.String, Message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface CreateContactResult {
  ContactArn: string;
}
export const CreateContactResult = S.suspend(() =>
  S.Struct({ ContactArn: S.String }),
).annotations({
  identifier: "CreateContactResult",
}) as any as S.Schema<CreateContactResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class DataEncryptionException extends S.TaggedError<DataEncryptionException>()(
  "DataEncryptionException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    Message: S.String,
    ResourceId: S.String,
    ResourceType: S.String,
    DependentEntities: S.optional(DependentEntityList),
  },
).pipe(C.withConflictError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    QuotaCode: S.String,
    ServiceCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.optional(S.String),
    Fields: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists all contacts and escalation plans in Incident Manager.
 */
export const listContacts: {
  (
    input: ListContactsRequest,
  ): Effect.Effect<
    ListContactsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListContactsRequest,
  ) => Stream.Stream<
    ListContactsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListContactsRequest,
  ) => Stream.Stream<
    Contact,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListContactsRequest,
  output: ListContactsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Contacts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all engagements that have happened in an incident.
 */
export const listEngagements: {
  (
    input: ListEngagementsRequest,
  ): Effect.Effect<
    ListEngagementsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngagementsRequest,
  ) => Stream.Stream<
    ListEngagementsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngagementsRequest,
  ) => Stream.Stream<
    Engagement,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngagementsRequest,
  output: ListEngagementsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Engagements",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * To remove a contact from Incident Manager, you can delete the contact. However, deleting a
 * contact does not remove it from escalation plans and related response plans. Deleting an
 * escalation plan also does not remove it from all related response plans. To modify an
 * escalation plan, we recommend using the UpdateContact action to specify a
 * different existing contact.
 */
export const deleteContact: (
  input: DeleteContactRequest,
) => Effect.Effect<
  DeleteContactResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeEngagement: (
  input: DescribeEngagementRequest,
) => Effect.Effect<
  DescribeEngagementResult,
  | AccessDeniedException
  | DataEncryptionException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listContactChannels: {
  (
    input: ListContactChannelsRequest,
  ): Effect.Effect<
    ListContactChannelsResult,
    | AccessDeniedException
    | DataEncryptionException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListContactChannelsRequest,
  ) => Stream.Stream<
    ListContactChannelsResult,
    | AccessDeniedException
    | DataEncryptionException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListContactChannelsRequest,
  ) => Stream.Stream<
    ContactChannel,
    | AccessDeniedException
    | DataEncryptionException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ContactChannels",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all of the engagements to contact channels that have been acknowledged.
 */
export const listPageReceipts: {
  (
    input: ListPageReceiptsRequest,
  ): Effect.Effect<
    ListPageReceiptsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPageReceiptsRequest,
  ) => Stream.Stream<
    ListPageReceiptsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPageReceiptsRequest,
  ) => Stream.Stream<
    Receipt,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPageReceiptsRequest,
  output: ListPageReceiptsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Receipts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the resolution path of an engagement. For example, the escalation plan engaged
 * in an incident might target an on-call schedule that includes several contacts in a
 * rotation, but just one contact on-call when the incident starts. The resolution path
 * indicates the hierarchy of escalation plan > on-call schedule >
 * contact.
 */
export const listPageResolutions: {
  (
    input: ListPageResolutionsRequest,
  ): Effect.Effect<
    ListPageResolutionsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPageResolutionsRequest,
  ) => Stream.Stream<
    ListPageResolutionsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPageResolutionsRequest,
  ) => Stream.Stream<
    ResolutionContact,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPageResolutionsRequest,
  output: ListPageResolutionsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PageResolutions",
  } as const,
}));
/**
 * Lists the engagements to a contact's contact channels.
 */
export const listPagesByContact: {
  (
    input: ListPagesByContactRequest,
  ): Effect.Effect<
    ListPagesByContactResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPagesByContactRequest,
  ) => Stream.Stream<
    ListPagesByContactResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPagesByContactRequest,
  ) => Stream.Stream<
    Page,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPagesByContactRequest,
  output: ListPagesByContactResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Pages",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of overrides currently specified for an on-call rotation.
 */
export const listRotationOverrides: {
  (
    input: ListRotationOverridesRequest,
  ): Effect.Effect<
    ListRotationOverridesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRotationOverridesRequest,
  ) => Stream.Stream<
    ListRotationOverridesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRotationOverridesRequest,
  ) => Stream.Stream<
    RotationOverride,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRotationOverridesRequest,
  output: ListRotationOverridesResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RotationOverrides",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of on-call rotations.
 */
export const listRotations: {
  (
    input: ListRotationsRequest,
  ): Effect.Effect<
    ListRotationsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRotationsRequest,
  ) => Stream.Stream<
    ListRotationsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRotationsRequest,
  ) => Stream.Stream<
    Rotation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRotationsRequest,
  output: ListRotationsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Rotations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the resource policies attached to the specified contact or escalation
 * plan.
 */
export const getContactPolicy: (
  input: GetContactPolicyRequest,
) => Effect.Effect<
  GetContactPolicyResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRotation: (
  input: GetRotationRequest,
) => Effect.Effect<
  GetRotationResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRotationOverride: (
  input: GetRotationOverrideRequest,
) => Effect.Effect<
  GetRotationOverrideResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPagesByEngagement: {
  (
    input: ListPagesByEngagementRequest,
  ): Effect.Effect<
    ListPagesByEngagementResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPagesByEngagementRequest,
  ) => Stream.Stream<
    ListPagesByEngagementResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPagesByEngagementRequest,
  ) => Stream.Stream<
    Page,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPagesByEngagementRequest,
  output: ListPagesByEngagementResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Pages",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the tags of a contact, escalation plan, rotation, or on-call schedule.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const activateContactChannel: (
  input: ActivateContactChannelRequest,
) => Effect.Effect<
  ActivateContactChannelResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivateContactChannelRequest,
  output: ActivateContactChannelResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * To no longer receive Incident Manager engagements to a contact channel, you can deactivate
 * the channel.
 */
export const deactivateContactChannel: (
  input: DeactivateContactChannelRequest,
) => Effect.Effect<
  DeactivateContactChannelResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeactivateContactChannelRequest,
  output: DeactivateContactChannelResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * To stop receiving engagements on a contact channel, you can delete the channel from a
 * contact. Deleting the contact channel does not remove it from the contact's engagement
 * plan, but the stage that includes the channel will be ignored. If you delete the only
 * contact channel for a contact, you'll no longer be able to engage that contact during an
 * incident.
 */
export const deleteContactChannel: (
  input: DeleteContactChannelRequest,
) => Effect.Effect<
  DeleteContactChannelResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContactChannelRequest,
  output: DeleteContactChannelResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing override for an on-call rotation.
 */
export const deleteRotationOverride: (
  input: DeleteRotationOverrideRequest,
) => Effect.Effect<
  DeleteRotationOverrideResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRotationOverrideRequest,
  output: DeleteRotationOverrideResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops an engagement before it finishes the final stage of the escalation plan or
 * engagement plan. Further contacts aren't engaged.
 */
export const stopEngagement: (
  input: StopEngagementRequest,
) => Effect.Effect<
  StopEngagementResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describePage: (
  input: DescribePageRequest,
) => Effect.Effect<
  DescribePageResult,
  | AccessDeniedException
  | DataEncryptionException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getContact: (
  input: GetContactRequest,
) => Effect.Effect<
  GetContactResult,
  | AccessDeniedException
  | DataEncryptionException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getContactChannel: (
  input: GetContactChannelRequest,
) => Effect.Effect<
  GetContactChannelResult,
  | AccessDeniedException
  | DataEncryptionException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startEngagement: (
  input: StartEngagementRequest,
) => Effect.Effect<
  StartEngagementResult,
  | AccessDeniedException
  | DataEncryptionException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPreviewRotationShifts: {
  (
    input: ListPreviewRotationShiftsRequest,
  ): Effect.Effect<
    ListPreviewRotationShiftsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPreviewRotationShiftsRequest,
  ) => Stream.Stream<
    ListPreviewRotationShiftsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPreviewRotationShiftsRequest,
  ) => Stream.Stream<
    RotationShift,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPreviewRotationShiftsRequest,
  output: ListPreviewRotationShiftsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RotationShifts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Used to acknowledge an engagement to a contact channel during an incident.
 */
export const acceptPage: (
  input: AcceptPageRequest,
) => Effect.Effect<
  AcceptPageResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRotation: (
  input: DeleteRotationRequest,
) => Effect.Effect<
  DeleteRotationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putContactPolicy: (
  input: PutContactPolicyRequest,
) => Effect.Effect<
  PutContactPolicyResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateContactChannel: (
  input: UpdateContactChannelRequest,
) => Effect.Effect<
  UpdateContactChannelResult,
  | AccessDeniedException
  | ConflictException
  | DataEncryptionException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates the information specified for an on-call rotation.
 */
export const updateRotation: (
  input: UpdateRotationRequest,
) => Effect.Effect<
  UpdateRotationResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createContactChannel: (
  input: CreateContactChannelRequest,
) => Effect.Effect<
  CreateContactChannelResult,
  | AccessDeniedException
  | ConflictException
  | DataEncryptionException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a list of shifts generated by an existing rotation in the system.
 */
export const listRotationShifts: {
  (
    input: ListRotationShiftsRequest,
  ): Effect.Effect<
    ListRotationShiftsResult,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRotationShiftsRequest,
  ) => Stream.Stream<
    ListRotationShiftsResult,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRotationShiftsRequest,
  ) => Stream.Stream<
    RotationShift,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RotationShifts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates an override for a rotation in an on-call schedule.
 */
export const createRotationOverride: (
  input: CreateRotationOverrideRequest,
) => Effect.Effect<
  CreateRotationOverrideResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Tags a contact or escalation plan. You can tag only contacts and escalation plans in the
 * first region of your replication set.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const sendActivationCode: (
  input: SendActivationCodeRequest,
) => Effect.Effect<
  SendActivationCodeResult,
  | AccessDeniedException
  | DataEncryptionException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateContact: (
  input: UpdateContactRequest,
) => Effect.Effect<
  UpdateContactResult,
  | AccessDeniedException
  | DataEncryptionException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRotation: (
  input: CreateRotationRequest,
) => Effect.Effect<
  CreateRotationResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createContact: (
  input: CreateContactRequest,
) => Effect.Effect<
  CreateContactResult,
  | AccessDeniedException
  | ConflictException
  | DataEncryptionException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

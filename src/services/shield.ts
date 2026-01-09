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
const ns = T.XmlNamespace("http://ddp.amazonaws.com/doc/2016-06-02/");
const svc = T.AwsApiService({
  sdkId: "Shield",
  serviceShapeName: "AWSShield_20160616",
});
const auth = T.AwsAuthSigv4({ name: "shield" });
const ver = T.ServiceVersion("2016-06-02");
const proto = T.AwsProtocolsAwsJson1_1();
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
  const _p0 = () => ({
    authSchemes: [
      { name: "sigv4", signingName: "shield", signingRegion: "us-east-1" },
    ],
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e("https://shield.us-east-1.amazonaws.com", _p0(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e("https://shield-fips.us-east-1.amazonaws.com", _p0(), {});
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://shield-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://shield-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://shield.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://shield.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type LogBucket = string;
export type RoleArn = string;
export type ProtectionId = string;
export type HealthCheckArn = string;
export type ProtectionName = string;
export type ResourceArn = string;
export type ProtectionGroupId = string;
export type ErrorMessage = string;
export type AttackId = string;
export type Token = string;
export type MaxResults = number;
export type TagKey = string;
export type EmailAddress = string;
export type PhoneNumber = string;
export type ContactNotes = string;
export type TagValue = string;
export type DurationInSeconds = number;
export type AttackTimestamp = Date;
export type HealthCheckId = string;
export type LimitType = string;
export type LimitNumber = number;

//# Schemas
export interface CreateSubscriptionRequest {}
export const CreateSubscriptionRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSubscriptionRequest",
}) as any as S.Schema<CreateSubscriptionRequest>;
export interface CreateSubscriptionResponse {}
export const CreateSubscriptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateSubscriptionResponse",
}) as any as S.Schema<CreateSubscriptionResponse>;
export interface DeleteSubscriptionRequest {}
export const DeleteSubscriptionRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSubscriptionRequest",
}) as any as S.Schema<DeleteSubscriptionRequest>;
export interface DeleteSubscriptionResponse {}
export const DeleteSubscriptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSubscriptionResponse",
}) as any as S.Schema<DeleteSubscriptionResponse>;
export interface DescribeAttackStatisticsRequest {}
export const DescribeAttackStatisticsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAttackStatisticsRequest",
}) as any as S.Schema<DescribeAttackStatisticsRequest>;
export interface DescribeDRTAccessRequest {}
export const DescribeDRTAccessRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDRTAccessRequest",
}) as any as S.Schema<DescribeDRTAccessRequest>;
export interface DescribeEmergencyContactSettingsRequest {}
export const DescribeEmergencyContactSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEmergencyContactSettingsRequest",
}) as any as S.Schema<DescribeEmergencyContactSettingsRequest>;
export interface DescribeSubscriptionRequest {}
export const DescribeSubscriptionRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSubscriptionRequest",
}) as any as S.Schema<DescribeSubscriptionRequest>;
export interface DisableProactiveEngagementRequest {}
export const DisableProactiveEngagementRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableProactiveEngagementRequest",
}) as any as S.Schema<DisableProactiveEngagementRequest>;
export interface DisableProactiveEngagementResponse {}
export const DisableProactiveEngagementResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableProactiveEngagementResponse",
}) as any as S.Schema<DisableProactiveEngagementResponse>;
export interface DisassociateDRTRoleRequest {}
export const DisassociateDRTRoleRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateDRTRoleRequest",
}) as any as S.Schema<DisassociateDRTRoleRequest>;
export interface DisassociateDRTRoleResponse {}
export const DisassociateDRTRoleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateDRTRoleResponse",
}) as any as S.Schema<DisassociateDRTRoleResponse>;
export interface EnableProactiveEngagementRequest {}
export const EnableProactiveEngagementRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableProactiveEngagementRequest",
}) as any as S.Schema<EnableProactiveEngagementRequest>;
export interface EnableProactiveEngagementResponse {}
export const EnableProactiveEngagementResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableProactiveEngagementResponse",
}) as any as S.Schema<EnableProactiveEngagementResponse>;
export interface GetSubscriptionStateRequest {}
export const GetSubscriptionStateRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSubscriptionStateRequest",
}) as any as S.Schema<GetSubscriptionStateRequest>;
export type ProtectionGroupAggregation = "SUM" | "MEAN" | "MAX" | (string & {});
export const ProtectionGroupAggregation = S.String;
export type ProtectionGroupPattern =
  | "ALL"
  | "ARBITRARY"
  | "BY_RESOURCE_TYPE"
  | (string & {});
export const ProtectionGroupPattern = S.String;
export type ProtectedResourceType =
  | "CLOUDFRONT_DISTRIBUTION"
  | "ROUTE_53_HOSTED_ZONE"
  | "ELASTIC_IP_ALLOCATION"
  | "CLASSIC_LOAD_BALANCER"
  | "APPLICATION_LOAD_BALANCER"
  | "GLOBAL_ACCELERATOR"
  | (string & {});
export const ProtectedResourceType = S.String;
export type ProtectionGroupMembers = string[];
export const ProtectionGroupMembers = S.Array(S.String);
export type LogBucketList = string[];
export const LogBucketList = S.Array(S.String);
export type SubscriptionState = "ACTIVE" | "INACTIVE" | (string & {});
export const SubscriptionState = S.String;
export type ResourceArnFilterList = string[];
export const ResourceArnFilterList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type AutoRenew = "ENABLED" | "DISABLED" | (string & {});
export const AutoRenew = S.String;
export interface AssociateDRTLogBucketRequest {
  LogBucket: string;
}
export const AssociateDRTLogBucketRequest = S.suspend(() =>
  S.Struct({ LogBucket: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateDRTLogBucketRequest",
}) as any as S.Schema<AssociateDRTLogBucketRequest>;
export interface AssociateDRTLogBucketResponse {}
export const AssociateDRTLogBucketResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateDRTLogBucketResponse",
}) as any as S.Schema<AssociateDRTLogBucketResponse>;
export interface AssociateDRTRoleRequest {
  RoleArn: string;
}
export const AssociateDRTRoleRequest = S.suspend(() =>
  S.Struct({ RoleArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateDRTRoleRequest",
}) as any as S.Schema<AssociateDRTRoleRequest>;
export interface AssociateDRTRoleResponse {}
export const AssociateDRTRoleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateDRTRoleResponse",
}) as any as S.Schema<AssociateDRTRoleResponse>;
export interface AssociateHealthCheckRequest {
  ProtectionId: string;
  HealthCheckArn: string;
}
export const AssociateHealthCheckRequest = S.suspend(() =>
  S.Struct({ ProtectionId: S.String, HealthCheckArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateHealthCheckRequest",
}) as any as S.Schema<AssociateHealthCheckRequest>;
export interface AssociateHealthCheckResponse {}
export const AssociateHealthCheckResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateHealthCheckResponse",
}) as any as S.Schema<AssociateHealthCheckResponse>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateProtectionGroupRequest {
  ProtectionGroupId: string;
  Aggregation: ProtectionGroupAggregation;
  Pattern: ProtectionGroupPattern;
  ResourceType?: ProtectedResourceType;
  Members?: string[];
  Tags?: Tag[];
}
export const CreateProtectionGroupRequest = S.suspend(() =>
  S.Struct({
    ProtectionGroupId: S.String,
    Aggregation: ProtectionGroupAggregation,
    Pattern: ProtectionGroupPattern,
    ResourceType: S.optional(ProtectedResourceType),
    Members: S.optional(ProtectionGroupMembers),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProtectionGroupRequest",
}) as any as S.Schema<CreateProtectionGroupRequest>;
export interface CreateProtectionGroupResponse {}
export const CreateProtectionGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateProtectionGroupResponse",
}) as any as S.Schema<CreateProtectionGroupResponse>;
export interface DeleteProtectionRequest {
  ProtectionId: string;
}
export const DeleteProtectionRequest = S.suspend(() =>
  S.Struct({ ProtectionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProtectionRequest",
}) as any as S.Schema<DeleteProtectionRequest>;
export interface DeleteProtectionResponse {}
export const DeleteProtectionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteProtectionResponse",
}) as any as S.Schema<DeleteProtectionResponse>;
export interface DeleteProtectionGroupRequest {
  ProtectionGroupId: string;
}
export const DeleteProtectionGroupRequest = S.suspend(() =>
  S.Struct({ ProtectionGroupId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProtectionGroupRequest",
}) as any as S.Schema<DeleteProtectionGroupRequest>;
export interface DeleteProtectionGroupResponse {}
export const DeleteProtectionGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteProtectionGroupResponse",
}) as any as S.Schema<DeleteProtectionGroupResponse>;
export interface DescribeAttackRequest {
  AttackId: string;
}
export const DescribeAttackRequest = S.suspend(() =>
  S.Struct({ AttackId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAttackRequest",
}) as any as S.Schema<DescribeAttackRequest>;
export interface DescribeDRTAccessResponse {
  RoleArn?: string;
  LogBucketList?: string[];
}
export const DescribeDRTAccessResponse = S.suspend(() =>
  S.Struct({
    RoleArn: S.optional(S.String),
    LogBucketList: S.optional(LogBucketList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDRTAccessResponse",
}) as any as S.Schema<DescribeDRTAccessResponse>;
export interface EmergencyContact {
  EmailAddress: string;
  PhoneNumber?: string;
  ContactNotes?: string;
}
export const EmergencyContact = S.suspend(() =>
  S.Struct({
    EmailAddress: S.String,
    PhoneNumber: S.optional(S.String),
    ContactNotes: S.optional(S.String),
  }),
).annotations({
  identifier: "EmergencyContact",
}) as any as S.Schema<EmergencyContact>;
export type EmergencyContactList = EmergencyContact[];
export const EmergencyContactList = S.Array(EmergencyContact);
export interface DescribeEmergencyContactSettingsResponse {
  EmergencyContactList?: EmergencyContact[];
}
export const DescribeEmergencyContactSettingsResponse = S.suspend(() =>
  S.Struct({ EmergencyContactList: S.optional(EmergencyContactList) }).pipe(ns),
).annotations({
  identifier: "DescribeEmergencyContactSettingsResponse",
}) as any as S.Schema<DescribeEmergencyContactSettingsResponse>;
export interface DescribeProtectionRequest {
  ProtectionId?: string;
  ResourceArn?: string;
}
export const DescribeProtectionRequest = S.suspend(() =>
  S.Struct({
    ProtectionId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeProtectionRequest",
}) as any as S.Schema<DescribeProtectionRequest>;
export interface DescribeProtectionGroupRequest {
  ProtectionGroupId: string;
}
export const DescribeProtectionGroupRequest = S.suspend(() =>
  S.Struct({ ProtectionGroupId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeProtectionGroupRequest",
}) as any as S.Schema<DescribeProtectionGroupRequest>;
export interface DisableApplicationLayerAutomaticResponseRequest {
  ResourceArn: string;
}
export const DisableApplicationLayerAutomaticResponseRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableApplicationLayerAutomaticResponseRequest",
}) as any as S.Schema<DisableApplicationLayerAutomaticResponseRequest>;
export interface DisableApplicationLayerAutomaticResponseResponse {}
export const DisableApplicationLayerAutomaticResponseResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableApplicationLayerAutomaticResponseResponse",
}) as any as S.Schema<DisableApplicationLayerAutomaticResponseResponse>;
export interface DisassociateDRTLogBucketRequest {
  LogBucket: string;
}
export const DisassociateDRTLogBucketRequest = S.suspend(() =>
  S.Struct({ LogBucket: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateDRTLogBucketRequest",
}) as any as S.Schema<DisassociateDRTLogBucketRequest>;
export interface DisassociateDRTLogBucketResponse {}
export const DisassociateDRTLogBucketResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateDRTLogBucketResponse",
}) as any as S.Schema<DisassociateDRTLogBucketResponse>;
export interface DisassociateHealthCheckRequest {
  ProtectionId: string;
  HealthCheckArn: string;
}
export const DisassociateHealthCheckRequest = S.suspend(() =>
  S.Struct({ ProtectionId: S.String, HealthCheckArn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateHealthCheckRequest",
}) as any as S.Schema<DisassociateHealthCheckRequest>;
export interface DisassociateHealthCheckResponse {}
export const DisassociateHealthCheckResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateHealthCheckResponse",
}) as any as S.Schema<DisassociateHealthCheckResponse>;
export interface GetSubscriptionStateResponse {
  SubscriptionState: SubscriptionState;
}
export const GetSubscriptionStateResponse = S.suspend(() =>
  S.Struct({ SubscriptionState: SubscriptionState }).pipe(ns),
).annotations({
  identifier: "GetSubscriptionStateResponse",
}) as any as S.Schema<GetSubscriptionStateResponse>;
export interface TimeRange {
  FromInclusive?: Date;
  ToExclusive?: Date;
}
export const TimeRange = S.suspend(() =>
  S.Struct({
    FromInclusive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ToExclusive: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "TimeRange" }) as any as S.Schema<TimeRange>;
export interface ListAttacksRequest {
  ResourceArns?: string[];
  StartTime?: TimeRange;
  EndTime?: TimeRange;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAttacksRequest = S.suspend(() =>
  S.Struct({
    ResourceArns: S.optional(ResourceArnFilterList),
    StartTime: S.optional(TimeRange),
    EndTime: S.optional(TimeRange),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAttacksRequest",
}) as any as S.Schema<ListAttacksRequest>;
export interface ListResourcesInProtectionGroupRequest {
  ProtectionGroupId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListResourcesInProtectionGroupRequest = S.suspend(() =>
  S.Struct({
    ProtectionGroupId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListResourcesInProtectionGroupRequest",
}) as any as S.Schema<ListResourcesInProtectionGroupRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface BlockAction {}
export const BlockAction = S.suspend(() => S.Struct({})).annotations({
  identifier: "BlockAction",
}) as any as S.Schema<BlockAction>;
export interface CountAction {}
export const CountAction = S.suspend(() => S.Struct({})).annotations({
  identifier: "CountAction",
}) as any as S.Schema<CountAction>;
export interface ResponseAction {
  Block?: BlockAction;
  Count?: CountAction;
}
export const ResponseAction = S.suspend(() =>
  S.Struct({ Block: S.optional(BlockAction), Count: S.optional(CountAction) }),
).annotations({
  identifier: "ResponseAction",
}) as any as S.Schema<ResponseAction>;
export interface UpdateApplicationLayerAutomaticResponseRequest {
  ResourceArn: string;
  Action: ResponseAction;
}
export const UpdateApplicationLayerAutomaticResponseRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Action: ResponseAction }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationLayerAutomaticResponseRequest",
}) as any as S.Schema<UpdateApplicationLayerAutomaticResponseRequest>;
export interface UpdateApplicationLayerAutomaticResponseResponse {}
export const UpdateApplicationLayerAutomaticResponseResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateApplicationLayerAutomaticResponseResponse",
}) as any as S.Schema<UpdateApplicationLayerAutomaticResponseResponse>;
export interface UpdateEmergencyContactSettingsRequest {
  EmergencyContactList?: EmergencyContact[];
}
export const UpdateEmergencyContactSettingsRequest = S.suspend(() =>
  S.Struct({ EmergencyContactList: S.optional(EmergencyContactList) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEmergencyContactSettingsRequest",
}) as any as S.Schema<UpdateEmergencyContactSettingsRequest>;
export interface UpdateEmergencyContactSettingsResponse {}
export const UpdateEmergencyContactSettingsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateEmergencyContactSettingsResponse",
}) as any as S.Schema<UpdateEmergencyContactSettingsResponse>;
export interface UpdateProtectionGroupRequest {
  ProtectionGroupId: string;
  Aggregation: ProtectionGroupAggregation;
  Pattern: ProtectionGroupPattern;
  ResourceType?: ProtectedResourceType;
  Members?: string[];
}
export const UpdateProtectionGroupRequest = S.suspend(() =>
  S.Struct({
    ProtectionGroupId: S.String,
    Aggregation: ProtectionGroupAggregation,
    Pattern: ProtectionGroupPattern,
    ResourceType: S.optional(ProtectedResourceType),
    Members: S.optional(ProtectionGroupMembers),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProtectionGroupRequest",
}) as any as S.Schema<UpdateProtectionGroupRequest>;
export interface UpdateProtectionGroupResponse {}
export const UpdateProtectionGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateProtectionGroupResponse",
}) as any as S.Schema<UpdateProtectionGroupResponse>;
export interface UpdateSubscriptionRequest {
  AutoRenew?: AutoRenew;
}
export const UpdateSubscriptionRequest = S.suspend(() =>
  S.Struct({ AutoRenew: S.optional(AutoRenew) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSubscriptionRequest",
}) as any as S.Schema<UpdateSubscriptionRequest>;
export interface UpdateSubscriptionResponse {}
export const UpdateSubscriptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateSubscriptionResponse",
}) as any as S.Schema<UpdateSubscriptionResponse>;
export type ProactiveEngagementStatus =
  | "ENABLED"
  | "DISABLED"
  | "PENDING"
  | (string & {});
export const ProactiveEngagementStatus = S.String;
export type ProtectionGroupIdFilters = string[];
export const ProtectionGroupIdFilters = S.Array(S.String);
export type ProtectionGroupPatternFilters = ProtectionGroupPattern[];
export const ProtectionGroupPatternFilters = S.Array(ProtectionGroupPattern);
export type ProtectedResourceTypeFilters = ProtectedResourceType[];
export const ProtectedResourceTypeFilters = S.Array(ProtectedResourceType);
export type ProtectionGroupAggregationFilters = ProtectionGroupAggregation[];
export const ProtectionGroupAggregationFilters = S.Array(
  ProtectionGroupAggregation,
);
export type ResourceArnFilters = string[];
export const ResourceArnFilters = S.Array(S.String);
export type ProtectionNameFilters = string[];
export const ProtectionNameFilters = S.Array(S.String);
export type ValidationExceptionReason =
  | "FIELD_VALIDATION_FAILED"
  | "OTHER"
  | (string & {});
export const ValidationExceptionReason = S.String;
export interface InclusionProtectionGroupFilters {
  ProtectionGroupIds?: string[];
  Patterns?: ProtectionGroupPattern[];
  ResourceTypes?: ProtectedResourceType[];
  Aggregations?: ProtectionGroupAggregation[];
}
export const InclusionProtectionGroupFilters = S.suspend(() =>
  S.Struct({
    ProtectionGroupIds: S.optional(ProtectionGroupIdFilters),
    Patterns: S.optional(ProtectionGroupPatternFilters),
    ResourceTypes: S.optional(ProtectedResourceTypeFilters),
    Aggregations: S.optional(ProtectionGroupAggregationFilters),
  }),
).annotations({
  identifier: "InclusionProtectionGroupFilters",
}) as any as S.Schema<InclusionProtectionGroupFilters>;
export interface InclusionProtectionFilters {
  ResourceArns?: string[];
  ProtectionNames?: string[];
  ResourceTypes?: ProtectedResourceType[];
}
export const InclusionProtectionFilters = S.suspend(() =>
  S.Struct({
    ResourceArns: S.optional(ResourceArnFilters),
    ProtectionNames: S.optional(ProtectionNameFilters),
    ResourceTypes: S.optional(ProtectedResourceTypeFilters),
  }),
).annotations({
  identifier: "InclusionProtectionFilters",
}) as any as S.Schema<InclusionProtectionFilters>;
export type ResourceArnList = string[];
export const ResourceArnList = S.Array(S.String);
export interface AssociateProactiveEngagementDetailsRequest {
  EmergencyContactList: EmergencyContact[];
}
export const AssociateProactiveEngagementDetailsRequest = S.suspend(() =>
  S.Struct({ EmergencyContactList: EmergencyContactList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateProactiveEngagementDetailsRequest",
}) as any as S.Schema<AssociateProactiveEngagementDetailsRequest>;
export interface AssociateProactiveEngagementDetailsResponse {}
export const AssociateProactiveEngagementDetailsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateProactiveEngagementDetailsResponse",
}) as any as S.Schema<AssociateProactiveEngagementDetailsResponse>;
export interface CreateProtectionRequest {
  Name: string;
  ResourceArn: string;
  Tags?: Tag[];
}
export const CreateProtectionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ResourceArn: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProtectionRequest",
}) as any as S.Schema<CreateProtectionRequest>;
export interface EnableApplicationLayerAutomaticResponseRequest {
  ResourceArn: string;
  Action: ResponseAction;
}
export const EnableApplicationLayerAutomaticResponseRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Action: ResponseAction }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableApplicationLayerAutomaticResponseRequest",
}) as any as S.Schema<EnableApplicationLayerAutomaticResponseRequest>;
export interface EnableApplicationLayerAutomaticResponseResponse {}
export const EnableApplicationLayerAutomaticResponseResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableApplicationLayerAutomaticResponseResponse",
}) as any as S.Schema<EnableApplicationLayerAutomaticResponseResponse>;
export interface ListProtectionGroupsRequest {
  NextToken?: string;
  MaxResults?: number;
  InclusionFilters?: InclusionProtectionGroupFilters;
}
export const ListProtectionGroupsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    InclusionFilters: S.optional(InclusionProtectionGroupFilters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProtectionGroupsRequest",
}) as any as S.Schema<ListProtectionGroupsRequest>;
export interface ListProtectionsRequest {
  NextToken?: string;
  MaxResults?: number;
  InclusionFilters?: InclusionProtectionFilters;
}
export const ListProtectionsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    InclusionFilters: S.optional(InclusionProtectionFilters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProtectionsRequest",
}) as any as S.Schema<ListProtectionsRequest>;
export interface ListResourcesInProtectionGroupResponse {
  ResourceArns: string[];
  NextToken?: string;
}
export const ListResourcesInProtectionGroupResponse = S.suspend(() =>
  S.Struct({
    ResourceArns: ResourceArnList,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListResourcesInProtectionGroupResponse",
}) as any as S.Schema<ListResourcesInProtectionGroupResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export type HealthCheckIds = string[];
export const HealthCheckIds = S.Array(S.String);
export interface Limit {
  Type?: string;
  Max?: number;
}
export const Limit = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Max: S.optional(S.Number) }),
).annotations({ identifier: "Limit" }) as any as S.Schema<Limit>;
export type Limits = Limit[];
export const Limits = S.Array(Limit);
export interface ProtectionGroup {
  ProtectionGroupId: string;
  Aggregation: ProtectionGroupAggregation;
  Pattern: ProtectionGroupPattern;
  ResourceType?: ProtectedResourceType;
  Members: string[];
  ProtectionGroupArn?: string;
}
export const ProtectionGroup = S.suspend(() =>
  S.Struct({
    ProtectionGroupId: S.String,
    Aggregation: ProtectionGroupAggregation,
    Pattern: ProtectionGroupPattern,
    ResourceType: S.optional(ProtectedResourceType),
    Members: ProtectionGroupMembers,
    ProtectionGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ProtectionGroup",
}) as any as S.Schema<ProtectionGroup>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export type ProtectionGroups = ProtectionGroup[];
export const ProtectionGroups = S.Array(ProtectionGroup);
export type ApplicationLayerAutomaticResponseStatus =
  | "ENABLED"
  | "DISABLED"
  | (string & {});
export const ApplicationLayerAutomaticResponseStatus = S.String;
export interface ApplicationLayerAutomaticResponseConfiguration {
  Status: ApplicationLayerAutomaticResponseStatus;
  Action: ResponseAction;
}
export const ApplicationLayerAutomaticResponseConfiguration = S.suspend(() =>
  S.Struct({
    Status: ApplicationLayerAutomaticResponseStatus,
    Action: ResponseAction,
  }),
).annotations({
  identifier: "ApplicationLayerAutomaticResponseConfiguration",
}) as any as S.Schema<ApplicationLayerAutomaticResponseConfiguration>;
export interface Protection {
  Id?: string;
  Name?: string;
  ResourceArn?: string;
  HealthCheckIds?: string[];
  ProtectionArn?: string;
  ApplicationLayerAutomaticResponseConfiguration?: ApplicationLayerAutomaticResponseConfiguration;
}
export const Protection = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    HealthCheckIds: S.optional(HealthCheckIds),
    ProtectionArn: S.optional(S.String),
    ApplicationLayerAutomaticResponseConfiguration: S.optional(
      ApplicationLayerAutomaticResponseConfiguration,
    ),
  }),
).annotations({ identifier: "Protection" }) as any as S.Schema<Protection>;
export type Protections = Protection[];
export const Protections = S.Array(Protection);
export type SubResourceType = "IP" | "URL" | (string & {});
export const SubResourceType = S.String;
export type AttackLayer = "NETWORK" | "APPLICATION" | (string & {});
export const AttackLayer = S.String;
export type AttackPropertyIdentifier =
  | "DESTINATION_URL"
  | "REFERRER"
  | "SOURCE_ASN"
  | "SOURCE_COUNTRY"
  | "SOURCE_IP_ADDRESS"
  | "SOURCE_USER_AGENT"
  | "WORDPRESS_PINGBACK_REFLECTOR"
  | "WORDPRESS_PINGBACK_SOURCE"
  | (string & {});
export const AttackPropertyIdentifier = S.String;
export type Unit = "BITS" | "BYTES" | "PACKETS" | "REQUESTS" | (string & {});
export const Unit = S.String;
export interface AttackVolumeStatistics {
  Max: number;
}
export const AttackVolumeStatistics = S.suspend(() =>
  S.Struct({ Max: S.Number }),
).annotations({
  identifier: "AttackVolumeStatistics",
}) as any as S.Schema<AttackVolumeStatistics>;
export interface ProtectionLimits {
  ProtectedResourceTypeLimits: Limit[];
}
export const ProtectionLimits = S.suspend(() =>
  S.Struct({ ProtectedResourceTypeLimits: Limits }),
).annotations({
  identifier: "ProtectionLimits",
}) as any as S.Schema<ProtectionLimits>;
export interface CreateProtectionResponse {
  ProtectionId?: string;
}
export const CreateProtectionResponse = S.suspend(() =>
  S.Struct({ ProtectionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateProtectionResponse",
}) as any as S.Schema<CreateProtectionResponse>;
export interface DescribeProtectionGroupResponse {
  ProtectionGroup: ProtectionGroup;
}
export const DescribeProtectionGroupResponse = S.suspend(() =>
  S.Struct({ ProtectionGroup: ProtectionGroup }).pipe(ns),
).annotations({
  identifier: "DescribeProtectionGroupResponse",
}) as any as S.Schema<DescribeProtectionGroupResponse>;
export interface ListProtectionGroupsResponse {
  ProtectionGroups: ProtectionGroup[];
  NextToken?: string;
}
export const ListProtectionGroupsResponse = S.suspend(() =>
  S.Struct({
    ProtectionGroups: ProtectionGroups,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListProtectionGroupsResponse",
}) as any as S.Schema<ListProtectionGroupsResponse>;
export interface ListProtectionsResponse {
  Protections?: Protection[];
  NextToken?: string;
}
export const ListProtectionsResponse = S.suspend(() =>
  S.Struct({
    Protections: S.optional(Protections),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListProtectionsResponse",
}) as any as S.Schema<ListProtectionsResponse>;
export interface SummarizedCounter {
  Name?: string;
  Max?: number;
  Average?: number;
  Sum?: number;
  N?: number;
  Unit?: string;
}
export const SummarizedCounter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Max: S.optional(S.Number),
    Average: S.optional(S.Number),
    Sum: S.optional(S.Number),
    N: S.optional(S.Number),
    Unit: S.optional(S.String),
  }),
).annotations({
  identifier: "SummarizedCounter",
}) as any as S.Schema<SummarizedCounter>;
export type SummarizedCounterList = SummarizedCounter[];
export const SummarizedCounterList = S.Array(SummarizedCounter);
export interface Mitigation {
  MitigationName?: string;
}
export const Mitigation = S.suspend(() =>
  S.Struct({ MitigationName: S.optional(S.String) }),
).annotations({ identifier: "Mitigation" }) as any as S.Schema<Mitigation>;
export type MitigationList = Mitigation[];
export const MitigationList = S.Array(Mitigation);
export interface AttackVolume {
  BitsPerSecond?: AttackVolumeStatistics;
  PacketsPerSecond?: AttackVolumeStatistics;
  RequestsPerSecond?: AttackVolumeStatistics;
}
export const AttackVolume = S.suspend(() =>
  S.Struct({
    BitsPerSecond: S.optional(AttackVolumeStatistics),
    PacketsPerSecond: S.optional(AttackVolumeStatistics),
    RequestsPerSecond: S.optional(AttackVolumeStatistics),
  }),
).annotations({ identifier: "AttackVolume" }) as any as S.Schema<AttackVolume>;
export interface AttackVectorDescription {
  VectorType: string;
}
export const AttackVectorDescription = S.suspend(() =>
  S.Struct({ VectorType: S.String }),
).annotations({
  identifier: "AttackVectorDescription",
}) as any as S.Schema<AttackVectorDescription>;
export type AttackVectorDescriptionList = AttackVectorDescription[];
export const AttackVectorDescriptionList = S.Array(AttackVectorDescription);
export interface AttackStatisticsDataItem {
  AttackVolume?: AttackVolume;
  AttackCount: number;
}
export const AttackStatisticsDataItem = S.suspend(() =>
  S.Struct({ AttackVolume: S.optional(AttackVolume), AttackCount: S.Number }),
).annotations({
  identifier: "AttackStatisticsDataItem",
}) as any as S.Schema<AttackStatisticsDataItem>;
export type AttackStatisticsDataList = AttackStatisticsDataItem[];
export const AttackStatisticsDataList = S.Array(AttackStatisticsDataItem);
export interface AttackSummary {
  AttackId?: string;
  ResourceArn?: string;
  StartTime?: Date;
  EndTime?: Date;
  AttackVectors?: AttackVectorDescription[];
}
export const AttackSummary = S.suspend(() =>
  S.Struct({
    AttackId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AttackVectors: S.optional(AttackVectorDescriptionList),
  }),
).annotations({
  identifier: "AttackSummary",
}) as any as S.Schema<AttackSummary>;
export type AttackSummaries = AttackSummary[];
export const AttackSummaries = S.Array(AttackSummary);
export interface SummarizedAttackVector {
  VectorType: string;
  VectorCounters?: SummarizedCounter[];
}
export const SummarizedAttackVector = S.suspend(() =>
  S.Struct({
    VectorType: S.String,
    VectorCounters: S.optional(SummarizedCounterList),
  }),
).annotations({
  identifier: "SummarizedAttackVector",
}) as any as S.Schema<SummarizedAttackVector>;
export type SummarizedAttackVectorList = SummarizedAttackVector[];
export const SummarizedAttackVectorList = S.Array(SummarizedAttackVector);
export interface Contributor {
  Name?: string;
  Value?: number;
}
export const Contributor = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.Number) }),
).annotations({ identifier: "Contributor" }) as any as S.Schema<Contributor>;
export type TopContributors = Contributor[];
export const TopContributors = S.Array(Contributor);
export interface DescribeAttackStatisticsResponse {
  TimeRange: TimeRange;
  DataItems: AttackStatisticsDataItem[];
}
export const DescribeAttackStatisticsResponse = S.suspend(() =>
  S.Struct({ TimeRange: TimeRange, DataItems: AttackStatisticsDataList }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeAttackStatisticsResponse",
}) as any as S.Schema<DescribeAttackStatisticsResponse>;
export interface DescribeProtectionResponse {
  Protection?: Protection;
}
export const DescribeProtectionResponse = S.suspend(() =>
  S.Struct({ Protection: S.optional(Protection) }).pipe(ns),
).annotations({
  identifier: "DescribeProtectionResponse",
}) as any as S.Schema<DescribeProtectionResponse>;
export interface ProtectionGroupArbitraryPatternLimits {
  MaxMembers: number;
}
export const ProtectionGroupArbitraryPatternLimits = S.suspend(() =>
  S.Struct({ MaxMembers: S.Number }),
).annotations({
  identifier: "ProtectionGroupArbitraryPatternLimits",
}) as any as S.Schema<ProtectionGroupArbitraryPatternLimits>;
export interface ListAttacksResponse {
  AttackSummaries?: AttackSummary[];
  NextToken?: string;
}
export const ListAttacksResponse = S.suspend(() =>
  S.Struct({
    AttackSummaries: S.optional(AttackSummaries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAttacksResponse",
}) as any as S.Schema<ListAttacksResponse>;
export interface SubResourceSummary {
  Type?: SubResourceType;
  Id?: string;
  AttackVectors?: SummarizedAttackVector[];
  Counters?: SummarizedCounter[];
}
export const SubResourceSummary = S.suspend(() =>
  S.Struct({
    Type: S.optional(SubResourceType),
    Id: S.optional(S.String),
    AttackVectors: S.optional(SummarizedAttackVectorList),
    Counters: S.optional(SummarizedCounterList),
  }),
).annotations({
  identifier: "SubResourceSummary",
}) as any as S.Schema<SubResourceSummary>;
export type SubResourceSummaryList = SubResourceSummary[];
export const SubResourceSummaryList = S.Array(SubResourceSummary);
export interface AttackProperty {
  AttackLayer?: AttackLayer;
  AttackPropertyIdentifier?: AttackPropertyIdentifier;
  TopContributors?: Contributor[];
  Unit?: Unit;
  Total?: number;
}
export const AttackProperty = S.suspend(() =>
  S.Struct({
    AttackLayer: S.optional(AttackLayer),
    AttackPropertyIdentifier: S.optional(AttackPropertyIdentifier),
    TopContributors: S.optional(TopContributors),
    Unit: S.optional(Unit),
    Total: S.optional(S.Number),
  }),
).annotations({
  identifier: "AttackProperty",
}) as any as S.Schema<AttackProperty>;
export type AttackProperties = AttackProperty[];
export const AttackProperties = S.Array(AttackProperty);
export interface ProtectionGroupPatternTypeLimits {
  ArbitraryPatternLimits: ProtectionGroupArbitraryPatternLimits;
}
export const ProtectionGroupPatternTypeLimits = S.suspend(() =>
  S.Struct({ ArbitraryPatternLimits: ProtectionGroupArbitraryPatternLimits }),
).annotations({
  identifier: "ProtectionGroupPatternTypeLimits",
}) as any as S.Schema<ProtectionGroupPatternTypeLimits>;
export interface AttackDetail {
  AttackId?: string;
  ResourceArn?: string;
  SubResources?: SubResourceSummary[];
  StartTime?: Date;
  EndTime?: Date;
  AttackCounters?: SummarizedCounter[];
  AttackProperties?: AttackProperty[];
  Mitigations?: Mitigation[];
}
export const AttackDetail = S.suspend(() =>
  S.Struct({
    AttackId: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    SubResources: S.optional(SubResourceSummaryList),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AttackCounters: S.optional(SummarizedCounterList),
    AttackProperties: S.optional(AttackProperties),
    Mitigations: S.optional(MitigationList),
  }),
).annotations({ identifier: "AttackDetail" }) as any as S.Schema<AttackDetail>;
export interface ProtectionGroupLimits {
  MaxProtectionGroups: number;
  PatternTypeLimits: ProtectionGroupPatternTypeLimits;
}
export const ProtectionGroupLimits = S.suspend(() =>
  S.Struct({
    MaxProtectionGroups: S.Number,
    PatternTypeLimits: ProtectionGroupPatternTypeLimits,
  }),
).annotations({
  identifier: "ProtectionGroupLimits",
}) as any as S.Schema<ProtectionGroupLimits>;
export interface DescribeAttackResponse {
  Attack?: AttackDetail;
}
export const DescribeAttackResponse = S.suspend(() =>
  S.Struct({ Attack: S.optional(AttackDetail) }).pipe(ns),
).annotations({
  identifier: "DescribeAttackResponse",
}) as any as S.Schema<DescribeAttackResponse>;
export interface SubscriptionLimits {
  ProtectionLimits: ProtectionLimits;
  ProtectionGroupLimits: ProtectionGroupLimits;
}
export const SubscriptionLimits = S.suspend(() =>
  S.Struct({
    ProtectionLimits: ProtectionLimits,
    ProtectionGroupLimits: ProtectionGroupLimits,
  }),
).annotations({
  identifier: "SubscriptionLimits",
}) as any as S.Schema<SubscriptionLimits>;
export interface Subscription {
  StartTime?: Date;
  EndTime?: Date;
  TimeCommitmentInSeconds?: number;
  AutoRenew?: AutoRenew;
  Limits?: Limit[];
  ProactiveEngagementStatus?: ProactiveEngagementStatus;
  SubscriptionLimits: SubscriptionLimits;
  SubscriptionArn?: string;
}
export const Subscription = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TimeCommitmentInSeconds: S.optional(S.Number),
    AutoRenew: S.optional(AutoRenew),
    Limits: S.optional(Limits),
    ProactiveEngagementStatus: S.optional(ProactiveEngagementStatus),
    SubscriptionLimits: SubscriptionLimits,
    SubscriptionArn: S.optional(S.String),
  }),
).annotations({ identifier: "Subscription" }) as any as S.Schema<Subscription>;
export interface DescribeSubscriptionResponse {
  Subscription?: Subscription;
}
export const DescribeSubscriptionResponse = S.suspend(() =>
  S.Struct({ Subscription: S.optional(Subscription) }).pipe(ns),
).annotations({
  identifier: "DescribeSubscriptionResponse",
}) as any as S.Schema<DescribeSubscriptionResponse>;

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
    reason: S.optional(ValidationExceptionReason),
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
export const getSubscriptionState: (
  input: GetSubscriptionStateRequest,
) => effect.Effect<
  GetSubscriptionStateResponse,
  InternalErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSubscriptionStateRequest,
  output: GetSubscriptionStateResponse,
  errors: [InternalErrorException],
}));
/**
 * Activates Shield Advanced for an account.
 *
 * For accounts that are members of an Organizations organization, Shield Advanced subscriptions are billed against the organization's payer account,
 * regardless of whether the payer account itself is subscribed.
 *
 * When you initially create a subscription, your subscription is set to be automatically renewed at the end of the existing subscription period. You can change this by submitting an `UpdateSubscription` request.
 */
export const createSubscription: (
  input: CreateSubscriptionRequest,
) => effect.Effect<
  CreateSubscriptionResponse,
  InternalErrorException | ResourceAlreadyExistsException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSubscriptionRequest,
  output: CreateSubscriptionResponse,
  errors: [InternalErrorException, ResourceAlreadyExistsException],
}));
/**
 * Returns the current role and list of Amazon S3 log buckets used by the Shield Response Team (SRT) to access your Amazon Web Services account while assisting with attack mitigation.
 */
export const describeDRTAccess: (
  input: DescribeDRTAccessRequest,
) => effect.Effect<
  DescribeDRTAccessResponse,
  InternalErrorException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDRTAccessRequest,
  output: DescribeDRTAccessResponse,
  errors: [InternalErrorException, ResourceNotFoundException],
}));
/**
 * Removes Shield Advanced from an account. Shield Advanced requires a 1-year subscription commitment. You cannot delete a subscription prior to the completion of that commitment.
 */
export const deleteSubscription: (
  input: DeleteSubscriptionRequest,
) => effect.Effect<
  DeleteSubscriptionResponse,
  | InternalErrorException
  | LockedSubscriptionException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProtectionGroup: (
  input: DeleteProtectionGroupRequest,
) => effect.Effect<
  DeleteProtectionGroupResponse,
  | InternalErrorException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProtectionGroupRequest,
  output: DeleteProtectionGroupResponse,
  errors: [
    InternalErrorException,
    OptimisticLockException,
    ResourceNotFoundException,
  ],
}));
/**
 * A list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you if you have proactive engagement enabled, for escalations to the SRT and to initiate proactive customer support.
 */
export const describeEmergencyContactSettings: (
  input: DescribeEmergencyContactSettingsRequest,
) => effect.Effect<
  DescribeEmergencyContactSettingsResponse,
  InternalErrorException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEmergencyContactSettingsRequest,
  output: DescribeEmergencyContactSettingsResponse,
  errors: [InternalErrorException, ResourceNotFoundException],
}));
/**
 * Deletes an Shield Advanced Protection.
 */
export const deleteProtection: (
  input: DeleteProtectionRequest,
) => effect.Effect<
  DeleteProtectionResponse,
  | InternalErrorException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateDRTRole: (
  input: DisassociateDRTRoleRequest,
) => effect.Effect<
  DisassociateDRTRoleResponse,
  | InternalErrorException
  | InvalidOperationException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeProtectionGroup: (
  input: DescribeProtectionGroupRequest,
) => effect.Effect<
  DescribeProtectionGroupResponse,
  InternalErrorException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProtectionGroupRequest,
  output: DescribeProtectionGroupResponse,
  errors: [InternalErrorException, ResourceNotFoundException],
}));
/**
 * Retrieves the resources that are included in the protection group.
 */
export const listResourcesInProtectionGroup: {
  (
    input: ListResourcesInProtectionGroupRequest,
  ): effect.Effect<
    ListResourcesInProtectionGroupResponse,
    | InternalErrorException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourcesInProtectionGroupRequest,
  ) => stream.Stream<
    ListResourcesInProtectionGroupResponse,
    | InternalErrorException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourcesInProtectionGroupRequest,
  ) => stream.Stream<
    unknown,
    | InternalErrorException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourcesInProtectionGroupRequest,
  output: ListResourcesInProtectionGroupResponse,
  errors: [
    InternalErrorException,
    InvalidPaginationTokenException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets information about Amazon Web Services tags for a specified Amazon Resource Name (ARN) in Shield.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalErrorException
  | InvalidResourceException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateDRTLogBucket: (
  input: DisassociateDRTLogBucketRequest,
) => effect.Effect<
  DisassociateDRTLogBucketResponse,
  | AccessDeniedForDependencyException
  | InternalErrorException
  | InvalidOperationException
  | NoAssociatedRoleException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Adds or updates tags for a resource in Shield.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalErrorException
  | InvalidParameterException
  | InvalidResourceException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalErrorException
  | InvalidParameterException
  | InvalidResourceException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateEmergencyContactSettings: (
  input: UpdateEmergencyContactSettingsRequest,
) => effect.Effect<
  UpdateEmergencyContactSettingsResponse,
  | InternalErrorException
  | InvalidParameterException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProtectionGroup: (
  input: UpdateProtectionGroupRequest,
) => effect.Effect<
  UpdateProtectionGroupResponse,
  | InternalErrorException
  | InvalidParameterException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProtectionGroupRequest,
  output: UpdateProtectionGroupResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    OptimisticLockException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the details of an existing subscription. Only enter values for parameters you want to change. Empty parameters are not updated.
 *
 * For accounts that are members of an Organizations organization, Shield Advanced subscriptions are billed against the organization's payer account,
 * regardless of whether the payer account itself is subscribed.
 */
export const updateSubscription: (
  input: UpdateSubscriptionRequest,
) => effect.Effect<
  UpdateSubscriptionResponse,
  | InternalErrorException
  | InvalidParameterException
  | LockedSubscriptionException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disableApplicationLayerAutomaticResponse: (
  input: DisableApplicationLayerAutomaticResponseRequest,
) => effect.Effect<
  DisableApplicationLayerAutomaticResponseResponse,
  | InternalErrorException
  | InvalidOperationException
  | InvalidParameterException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateDRTRole: (
  input: AssociateDRTRoleRequest,
) => effect.Effect<
  AssociateDRTRoleResponse,
  | AccessDeniedForDependencyException
  | InternalErrorException
  | InvalidOperationException
  | InvalidParameterException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApplicationLayerAutomaticResponse: (
  input: UpdateApplicationLayerAutomaticResponseRequest,
) => effect.Effect<
  UpdateApplicationLayerAutomaticResponseResponse,
  | InternalErrorException
  | InvalidOperationException
  | InvalidParameterException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disableProactiveEngagement: (
  input: DisableProactiveEngagementRequest,
) => effect.Effect<
  DisableProactiveEngagementResponse,
  | InternalErrorException
  | InvalidOperationException
  | InvalidParameterException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableProactiveEngagementRequest,
  output: DisableProactiveEngagementResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    InvalidParameterException,
    OptimisticLockException,
    ResourceNotFoundException,
  ],
}));
/**
 * Authorizes the Shield Response Team (SRT) to use email and phone to notify contacts about escalations to the SRT and to initiate proactive customer support.
 */
export const enableProactiveEngagement: (
  input: EnableProactiveEngagementRequest,
) => effect.Effect<
  EnableProactiveEngagementResponse,
  | InternalErrorException
  | InvalidOperationException
  | InvalidParameterException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableProactiveEngagementRequest,
  output: EnableProactiveEngagementResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    InvalidParameterException,
    OptimisticLockException,
    ResourceNotFoundException,
  ],
}));
/**
 * Initializes proactive engagement and sets the list of contacts for the Shield Response Team (SRT) to use. You must provide at least one phone number in the emergency contact list.
 *
 * After you have initialized proactive engagement using this call, to disable or enable proactive engagement, use the calls `DisableProactiveEngagement` and `EnableProactiveEngagement`.
 *
 * This call defines the list of email addresses and phone numbers that the SRT can use to contact you for escalations to the SRT and to initiate proactive customer support.
 *
 * The contacts that you provide in the request replace any contacts that were already defined. If you already have contacts defined and want to use them, retrieve the list using `DescribeEmergencyContactSettings` and then provide it to this call.
 */
export const associateProactiveEngagementDetails: (
  input: AssociateProactiveEngagementDetailsRequest,
) => effect.Effect<
  AssociateProactiveEngagementDetailsResponse,
  | InternalErrorException
  | InvalidOperationException
  | InvalidParameterException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listProtectionGroups: {
  (
    input: ListProtectionGroupsRequest,
  ): effect.Effect<
    ListProtectionGroupsResponse,
    | InternalErrorException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProtectionGroupsRequest,
  ) => stream.Stream<
    ListProtectionGroupsResponse,
    | InternalErrorException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProtectionGroupsRequest,
  ) => stream.Stream<
    unknown,
    | InternalErrorException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProtectionGroupsRequest,
  output: ListProtectionGroupsResponse,
  errors: [
    InternalErrorException,
    InvalidPaginationTokenException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves Protection objects for the account. You can retrieve all protections or you can provide
 * filtering criteria and retrieve just the subset of protections that match the criteria.
 */
export const listProtections: {
  (
    input: ListProtectionsRequest,
  ): effect.Effect<
    ListProtectionsResponse,
    | InternalErrorException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProtectionsRequest,
  ) => stream.Stream<
    ListProtectionsResponse,
    | InternalErrorException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProtectionsRequest,
  ) => stream.Stream<
    Protection,
    | InternalErrorException
    | InvalidPaginationTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProtectionsRequest,
  output: ListProtectionsResponse,
  errors: [
    InternalErrorException,
    InvalidPaginationTokenException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Protections",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Removes health-based detection from the Shield Advanced protection for a resource. Shield Advanced health-based detection uses the health of your Amazon Web Services resource to improve responsiveness and accuracy in attack detection and response.
 *
 * You define the health check in Route 53 and then associate or disassociate it with your Shield Advanced protection. For more information, see Shield Advanced Health-Based Detection in the *WAF Developer Guide*.
 */
export const disassociateHealthCheck: (
  input: DisassociateHealthCheckRequest,
) => effect.Effect<
  DisassociateHealthCheckResponse,
  | InternalErrorException
  | InvalidParameterException
  | InvalidResourceException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateHealthCheckRequest,
  output: DisassociateHealthCheckResponse,
  errors: [
    InternalErrorException,
    InvalidParameterException,
    InvalidResourceException,
    OptimisticLockException,
    ResourceNotFoundException,
  ],
}));
/**
 * Provides information about the number and type of attacks Shield has detected in the last year for all resources that belong to your account, regardless of whether you've defined Shield protections for them. This operation is available to Shield customers as well as to Shield Advanced customers.
 *
 * The operation returns data for the time range of midnight UTC, one year ago, to midnight UTC, today. For example, if the current time is `2020-10-26 15:39:32 PDT`, equal to `2020-10-26 22:39:32 UTC`, then the time range for the attack data returned is from `2019-10-26 00:00:00 UTC` to `2020-10-26 00:00:00 UTC`.
 *
 * The time range indicates the period covered by the attack statistics data items.
 */
export const describeAttackStatistics: (
  input: DescribeAttackStatisticsRequest,
) => effect.Effect<
  DescribeAttackStatisticsResponse,
  InternalErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAttackStatisticsRequest,
  output: DescribeAttackStatisticsResponse,
  errors: [InternalErrorException],
}));
/**
 * Lists the details of a Protection object.
 */
export const describeProtection: (
  input: DescribeProtectionRequest,
) => effect.Effect<
  DescribeProtectionResponse,
  | InternalErrorException
  | InvalidParameterException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAttacks: {
  (
    input: ListAttacksRequest,
  ): effect.Effect<
    ListAttacksResponse,
    | InternalErrorException
    | InvalidOperationException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttacksRequest,
  ) => stream.Stream<
    ListAttacksResponse,
    | InternalErrorException
    | InvalidOperationException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttacksRequest,
  ) => stream.Stream<
    AttackSummary,
    | InternalErrorException
    | InvalidOperationException
    | InvalidParameterException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAttacksRequest,
  output: ListAttacksResponse,
  errors: [
    InternalErrorException,
    InvalidOperationException,
    InvalidParameterException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AttackSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Adds health-based detection to the Shield Advanced protection for a resource. Shield Advanced health-based detection uses the health of your Amazon Web Services resource to improve responsiveness and accuracy in attack detection and response.
 *
 * You define the health check in Route 53 and then associate it with your Shield Advanced protection. For more information, see Shield Advanced Health-Based Detection in the *WAF Developer Guide*.
 */
export const associateHealthCheck: (
  input: AssociateHealthCheckRequest,
) => effect.Effect<
  AssociateHealthCheckResponse,
  | InternalErrorException
  | InvalidParameterException
  | InvalidResourceException
  | LimitsExceededException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a grouping of protected resources so they can be handled as a collective. This resource grouping improves the accuracy of detection and reduces false positives.
 */
export const createProtectionGroup: (
  input: CreateProtectionGroupRequest,
) => effect.Effect<
  CreateProtectionGroupResponse,
  | InternalErrorException
  | InvalidParameterException
  | LimitsExceededException
  | OptimisticLockException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const enableApplicationLayerAutomaticResponse: (
  input: EnableApplicationLayerAutomaticResponseRequest,
) => effect.Effect<
  EnableApplicationLayerAutomaticResponseResponse,
  | InternalErrorException
  | InvalidOperationException
  | InvalidParameterException
  | LimitsExceededException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateDRTLogBucket: (
  input: AssociateDRTLogBucketRequest,
) => effect.Effect<
  AssociateDRTLogBucketResponse,
  | AccessDeniedForDependencyException
  | InternalErrorException
  | InvalidOperationException
  | InvalidParameterException
  | LimitsExceededException
  | NoAssociatedRoleException
  | OptimisticLockException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Enables Shield Advanced for a specific Amazon Web Services resource. The resource can be an Amazon CloudFront distribution, Amazon Route 53 hosted zone, Global Accelerator standard accelerator, Elastic IP Address, Application Load Balancer, or a Classic Load Balancer. You can protect Amazon EC2 instances and Network Load Balancers by association with protected Amazon EC2 Elastic IP addresses.
 *
 * You can add protection to only a single resource with each `CreateProtection` request. You can add protection to multiple resources
 * at once through the Shield Advanced console at https://console.aws.amazon.com/wafv2/shieldv2#/.
 * For more information see
 * Getting Started with Shield Advanced
 * and Adding Shield Advanced protection to Amazon Web Services resources.
 */
export const createProtection: (
  input: CreateProtectionRequest,
) => effect.Effect<
  CreateProtectionResponse,
  | InternalErrorException
  | InvalidOperationException
  | InvalidParameterException
  | InvalidResourceException
  | LimitsExceededException
  | OptimisticLockException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeAttack: (
  input: DescribeAttackRequest,
) => effect.Effect<
  DescribeAttackResponse,
  AccessDeniedException | InternalErrorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAttackRequest,
  output: DescribeAttackResponse,
  errors: [AccessDeniedException, InternalErrorException],
}));
/**
 * Provides details about the Shield Advanced subscription for an account.
 */
export const describeSubscription: (
  input: DescribeSubscriptionRequest,
) => effect.Effect<
  DescribeSubscriptionResponse,
  InternalErrorException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSubscriptionRequest,
  output: DescribeSubscriptionResponse,
  errors: [InternalErrorException, ResourceNotFoundException],
}));

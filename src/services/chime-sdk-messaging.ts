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
const svc = T.AwsApiService({
  sdkId: "Chime SDK Messaging",
  serviceShapeName: "ChimeMessagingService",
});
const auth = T.AwsAuthSigv4({ name: "chime" });
const ver = T.ServiceVersion("2021-05-15");
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
              `https://messaging-chime-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://messaging-chime-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://messaging-chime.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://messaging-chime.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ChimeArn = string;
export type SubChannelId = string;
export type CallbackIdType = string;
export type NonNullableBoolean = boolean;
export type NonEmptyResourceName = string | redacted.Redacted<string>;
export type Metadata = string | redacted.Redacted<string>;
export type ClientRequestToken = string | redacted.Redacted<string>;
export type ChannelId = string | redacted.Redacted<string>;
export type MessageId = string;
export type MaxResults = number;
export type NextToken = string | redacted.Redacted<string>;
export type NonEmptyContent = string | redacted.Redacted<string>;
export type ContentType = string | redacted.Redacted<string>;
export type TagKey = string | redacted.Redacted<string>;
export type TagValue = string | redacted.Redacted<string>;
export type MaximumSubChannels = number;
export type TargetMembershipsPerSubChannel = number;
export type MinimumMembershipPercentage = number;
export type ExpirationDays = number;
export type ChannelFlowExecutionOrder = number;
export type SearchFieldValue = string;
export type PushNotificationTitle = string | redacted.Redacted<string>;
export type PushNotificationBody = string | redacted.Redacted<string>;
export type MessageAttributeName = string | redacted.Redacted<string>;
export type FilterRule = string | redacted.Redacted<string>;
export type MessageAttributeStringValue = string | redacted.Redacted<string>;
export type ResourceName = string | redacted.Redacted<string>;
export type Content = string | redacted.Redacted<string>;
export type StatusDetail = string;
export type UrlType = string;
export type MembershipCount = number;
export type LambdaFunctionArn = string;

//# Schemas
export type ChannelMembershipType = "DEFAULT" | "HIDDEN" | (string & {});
export const ChannelMembershipType = S.String;
export type MemberArns = string[];
export const MemberArns = S.Array(S.String);
export type ChannelMode = "UNRESTRICTED" | "RESTRICTED" | (string & {});
export const ChannelMode = S.String;
export type ChannelPrivacy = "PUBLIC" | "PRIVATE" | (string & {});
export const ChannelPrivacy = S.String;
export type ChannelMemberArns = string[];
export const ChannelMemberArns = S.Array(S.String);
export type ChannelModeratorArns = string[];
export const ChannelModeratorArns = S.Array(S.String);
export type NetworkType = "IPV4_ONLY" | "DUAL_STACK" | (string & {});
export const NetworkType = S.String;
export type SortOrder = "ASCENDING" | "DESCENDING" | (string & {});
export const SortOrder = S.String;
export type ChannelMessageType = "STANDARD" | "CONTROL" | (string & {});
export const ChannelMessageType = S.String;
export type ChannelMessagePersistenceType =
  | "PERSISTENT"
  | "NON_PERSISTENT"
  | (string & {});
export const ChannelMessagePersistenceType = S.String;
export type TagKeyList = string | redacted.Redacted<string>[];
export const TagKeyList = S.Array(SensitiveString);
export interface AssociateChannelFlowRequest {
  ChannelArn: string;
  ChannelFlowArn: string;
  ChimeBearer: string;
}
export const AssociateChannelFlowRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    ChannelFlowArn: S.String,
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channels/{ChannelArn}/channel-flow" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateChannelFlowRequest",
}) as any as S.Schema<AssociateChannelFlowRequest>;
export interface AssociateChannelFlowResponse {}
export const AssociateChannelFlowResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateChannelFlowResponse",
}) as any as S.Schema<AssociateChannelFlowResponse>;
export interface BatchCreateChannelMembershipRequest {
  ChannelArn: string;
  Type?: ChannelMembershipType;
  MemberArns: string[];
  ChimeBearer: string;
  SubChannelId?: string;
}
export const BatchCreateChannelMembershipRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    Type: S.optional(ChannelMembershipType),
    MemberArns: MemberArns,
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    SubChannelId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/channels/{ChannelArn}/memberships?operation=batch-create",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchCreateChannelMembershipRequest",
}) as any as S.Schema<BatchCreateChannelMembershipRequest>;
export interface CreateChannelBanRequest {
  ChannelArn: string;
  MemberArn: string;
  ChimeBearer: string;
}
export const CreateChannelBanRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MemberArn: S.String,
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channels/{ChannelArn}/bans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelBanRequest",
}) as any as S.Schema<CreateChannelBanRequest>;
export interface CreateChannelMembershipRequest {
  ChannelArn: string;
  MemberArn: string;
  Type: ChannelMembershipType;
  ChimeBearer: string;
  SubChannelId?: string;
}
export const CreateChannelMembershipRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MemberArn: S.String,
    Type: ChannelMembershipType,
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    SubChannelId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channels/{ChannelArn}/memberships" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelMembershipRequest",
}) as any as S.Schema<CreateChannelMembershipRequest>;
export interface CreateChannelModeratorRequest {
  ChannelArn: string;
  ChannelModeratorArn: string;
  ChimeBearer: string;
}
export const CreateChannelModeratorRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    ChannelModeratorArn: S.String,
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channels/{ChannelArn}/moderators" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelModeratorRequest",
}) as any as S.Schema<CreateChannelModeratorRequest>;
export interface DeleteChannelRequest {
  ChannelArn: string;
  ChimeBearer: string;
}
export const DeleteChannelRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/channels/{ChannelArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelRequest",
}) as any as S.Schema<DeleteChannelRequest>;
export interface DeleteChannelResponse {}
export const DeleteChannelResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteChannelResponse",
}) as any as S.Schema<DeleteChannelResponse>;
export interface DeleteChannelBanRequest {
  ChannelArn: string;
  MemberArn: string;
  ChimeBearer: string;
}
export const DeleteChannelBanRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MemberArn: S.String.pipe(T.HttpLabel("MemberArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/channels/{ChannelArn}/bans/{MemberArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelBanRequest",
}) as any as S.Schema<DeleteChannelBanRequest>;
export interface DeleteChannelBanResponse {}
export const DeleteChannelBanResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteChannelBanResponse",
}) as any as S.Schema<DeleteChannelBanResponse>;
export interface DeleteChannelFlowRequest {
  ChannelFlowArn: string;
}
export const DeleteChannelFlowRequest = S.suspend(() =>
  S.Struct({
    ChannelFlowArn: S.String.pipe(T.HttpLabel("ChannelFlowArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/channel-flows/{ChannelFlowArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelFlowRequest",
}) as any as S.Schema<DeleteChannelFlowRequest>;
export interface DeleteChannelFlowResponse {}
export const DeleteChannelFlowResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteChannelFlowResponse",
}) as any as S.Schema<DeleteChannelFlowResponse>;
export interface DeleteChannelMembershipRequest {
  ChannelArn: string;
  MemberArn: string;
  ChimeBearer: string;
  SubChannelId?: string;
}
export const DeleteChannelMembershipRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MemberArn: S.String.pipe(T.HttpLabel("MemberArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    SubChannelId: S.optional(S.String).pipe(T.HttpQuery("sub-channel-id")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/channels/{ChannelArn}/memberships/{MemberArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelMembershipRequest",
}) as any as S.Schema<DeleteChannelMembershipRequest>;
export interface DeleteChannelMembershipResponse {}
export const DeleteChannelMembershipResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteChannelMembershipResponse",
}) as any as S.Schema<DeleteChannelMembershipResponse>;
export interface DeleteChannelMessageRequest {
  ChannelArn: string;
  MessageId: string;
  ChimeBearer: string;
  SubChannelId?: string;
}
export const DeleteChannelMessageRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MessageId: S.String.pipe(T.HttpLabel("MessageId")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    SubChannelId: S.optional(S.String).pipe(T.HttpQuery("sub-channel-id")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/channels/{ChannelArn}/messages/{MessageId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelMessageRequest",
}) as any as S.Schema<DeleteChannelMessageRequest>;
export interface DeleteChannelMessageResponse {}
export const DeleteChannelMessageResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteChannelMessageResponse",
}) as any as S.Schema<DeleteChannelMessageResponse>;
export interface DeleteChannelModeratorRequest {
  ChannelArn: string;
  ChannelModeratorArn: string;
  ChimeBearer: string;
}
export const DeleteChannelModeratorRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    ChannelModeratorArn: S.String.pipe(T.HttpLabel("ChannelModeratorArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/channels/{ChannelArn}/moderators/{ChannelModeratorArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChannelModeratorRequest",
}) as any as S.Schema<DeleteChannelModeratorRequest>;
export interface DeleteChannelModeratorResponse {}
export const DeleteChannelModeratorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteChannelModeratorResponse",
}) as any as S.Schema<DeleteChannelModeratorResponse>;
export interface DeleteMessagingStreamingConfigurationsRequest {
  AppInstanceArn: string;
}
export const DeleteMessagingStreamingConfigurationsRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/app-instances/{AppInstanceArn}/streaming-configurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMessagingStreamingConfigurationsRequest",
}) as any as S.Schema<DeleteMessagingStreamingConfigurationsRequest>;
export interface DeleteMessagingStreamingConfigurationsResponse {}
export const DeleteMessagingStreamingConfigurationsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMessagingStreamingConfigurationsResponse",
}) as any as S.Schema<DeleteMessagingStreamingConfigurationsResponse>;
export interface DescribeChannelRequest {
  ChannelArn: string;
  ChimeBearer: string;
}
export const DescribeChannelRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels/{ChannelArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChannelRequest",
}) as any as S.Schema<DescribeChannelRequest>;
export interface DescribeChannelBanRequest {
  ChannelArn: string;
  MemberArn: string;
  ChimeBearer: string;
}
export const DescribeChannelBanRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MemberArn: S.String.pipe(T.HttpLabel("MemberArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels/{ChannelArn}/bans/{MemberArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChannelBanRequest",
}) as any as S.Schema<DescribeChannelBanRequest>;
export interface DescribeChannelFlowRequest {
  ChannelFlowArn: string;
}
export const DescribeChannelFlowRequest = S.suspend(() =>
  S.Struct({
    ChannelFlowArn: S.String.pipe(T.HttpLabel("ChannelFlowArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channel-flows/{ChannelFlowArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChannelFlowRequest",
}) as any as S.Schema<DescribeChannelFlowRequest>;
export interface DescribeChannelMembershipRequest {
  ChannelArn: string;
  MemberArn: string;
  ChimeBearer: string;
  SubChannelId?: string;
}
export const DescribeChannelMembershipRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MemberArn: S.String.pipe(T.HttpLabel("MemberArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    SubChannelId: S.optional(S.String).pipe(T.HttpQuery("sub-channel-id")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channels/{ChannelArn}/memberships/{MemberArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChannelMembershipRequest",
}) as any as S.Schema<DescribeChannelMembershipRequest>;
export interface DescribeChannelMembershipForAppInstanceUserRequest {
  ChannelArn: string;
  AppInstanceUserArn: string;
  ChimeBearer: string;
}
export const DescribeChannelMembershipForAppInstanceUserRequest = S.suspend(
  () =>
    S.Struct({
      ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
      AppInstanceUserArn: S.String.pipe(T.HttpQuery("app-instance-user-arn")),
      ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    }).pipe(
      T.all(
        T.Http({
          method: "GET",
          uri: "/channels/{ChannelArn}?scope=app-instance-user-membership",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DescribeChannelMembershipForAppInstanceUserRequest",
}) as any as S.Schema<DescribeChannelMembershipForAppInstanceUserRequest>;
export interface DescribeChannelModeratedByAppInstanceUserRequest {
  ChannelArn: string;
  AppInstanceUserArn: string;
  ChimeBearer: string;
}
export const DescribeChannelModeratedByAppInstanceUserRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    AppInstanceUserArn: S.String.pipe(T.HttpQuery("app-instance-user-arn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channels/{ChannelArn}?scope=app-instance-user-moderated-channel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChannelModeratedByAppInstanceUserRequest",
}) as any as S.Schema<DescribeChannelModeratedByAppInstanceUserRequest>;
export interface DescribeChannelModeratorRequest {
  ChannelArn: string;
  ChannelModeratorArn: string;
  ChimeBearer: string;
}
export const DescribeChannelModeratorRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    ChannelModeratorArn: S.String.pipe(T.HttpLabel("ChannelModeratorArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channels/{ChannelArn}/moderators/{ChannelModeratorArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeChannelModeratorRequest",
}) as any as S.Schema<DescribeChannelModeratorRequest>;
export interface DisassociateChannelFlowRequest {
  ChannelArn: string;
  ChannelFlowArn: string;
  ChimeBearer: string;
}
export const DisassociateChannelFlowRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    ChannelFlowArn: S.String.pipe(T.HttpLabel("ChannelFlowArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/channels/{ChannelArn}/channel-flow/{ChannelFlowArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateChannelFlowRequest",
}) as any as S.Schema<DisassociateChannelFlowRequest>;
export interface DisassociateChannelFlowResponse {}
export const DisassociateChannelFlowResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateChannelFlowResponse",
}) as any as S.Schema<DisassociateChannelFlowResponse>;
export interface GetChannelMembershipPreferencesRequest {
  ChannelArn: string;
  MemberArn: string;
  ChimeBearer: string;
}
export const GetChannelMembershipPreferencesRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MemberArn: S.String.pipe(T.HttpLabel("MemberArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channels/{ChannelArn}/memberships/{MemberArn}/preferences",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChannelMembershipPreferencesRequest",
}) as any as S.Schema<GetChannelMembershipPreferencesRequest>;
export interface GetChannelMessageRequest {
  ChannelArn: string;
  MessageId: string;
  ChimeBearer: string;
  SubChannelId?: string;
}
export const GetChannelMessageRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MessageId: S.String.pipe(T.HttpLabel("MessageId")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    SubChannelId: S.optional(S.String).pipe(T.HttpQuery("sub-channel-id")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channels/{ChannelArn}/messages/{MessageId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChannelMessageRequest",
}) as any as S.Schema<GetChannelMessageRequest>;
export interface GetChannelMessageStatusRequest {
  ChannelArn: string;
  MessageId: string;
  ChimeBearer: string;
  SubChannelId?: string;
}
export const GetChannelMessageStatusRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MessageId: S.String.pipe(T.HttpLabel("MessageId")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    SubChannelId: S.optional(S.String).pipe(T.HttpQuery("sub-channel-id")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channels/{ChannelArn}/messages/{MessageId}?scope=message-status",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChannelMessageStatusRequest",
}) as any as S.Schema<GetChannelMessageStatusRequest>;
export interface GetMessagingSessionEndpointRequest {
  NetworkType?: NetworkType;
}
export const GetMessagingSessionEndpointRequest = S.suspend(() =>
  S.Struct({
    NetworkType: S.optional(NetworkType).pipe(T.HttpQuery("network-type")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/endpoints/messaging-session" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMessagingSessionEndpointRequest",
}) as any as S.Schema<GetMessagingSessionEndpointRequest>;
export interface GetMessagingStreamingConfigurationsRequest {
  AppInstanceArn: string;
}
export const GetMessagingStreamingConfigurationsRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/app-instances/{AppInstanceArn}/streaming-configurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMessagingStreamingConfigurationsRequest",
}) as any as S.Schema<GetMessagingStreamingConfigurationsRequest>;
export interface ListChannelBansRequest {
  ChannelArn: string;
  MaxResults?: number;
  NextToken?: string | redacted.Redacted<string>;
  ChimeBearer: string;
}
export const ListChannelBansRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels/{ChannelArn}/bans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelBansRequest",
}) as any as S.Schema<ListChannelBansRequest>;
export interface ListChannelFlowsRequest {
  AppInstanceArn: string;
  MaxResults?: number;
  NextToken?: string | redacted.Redacted<string>;
}
export const ListChannelFlowsRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpQuery("app-instance-arn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channel-flows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelFlowsRequest",
}) as any as S.Schema<ListChannelFlowsRequest>;
export interface ListChannelMembershipsRequest {
  ChannelArn: string;
  Type?: ChannelMembershipType;
  MaxResults?: number;
  NextToken?: string | redacted.Redacted<string>;
  ChimeBearer: string;
  SubChannelId?: string;
}
export const ListChannelMembershipsRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    Type: S.optional(ChannelMembershipType).pipe(T.HttpQuery("type")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    SubChannelId: S.optional(S.String).pipe(T.HttpQuery("sub-channel-id")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels/{ChannelArn}/memberships" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelMembershipsRequest",
}) as any as S.Schema<ListChannelMembershipsRequest>;
export interface ListChannelMembershipsForAppInstanceUserRequest {
  AppInstanceUserArn?: string;
  MaxResults?: number;
  NextToken?: string | redacted.Redacted<string>;
  ChimeBearer: string;
}
export const ListChannelMembershipsForAppInstanceUserRequest = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.optional(S.String).pipe(
      T.HttpQuery("app-instance-user-arn"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channels?scope=app-instance-user-memberships",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelMembershipsForAppInstanceUserRequest",
}) as any as S.Schema<ListChannelMembershipsForAppInstanceUserRequest>;
export interface ListChannelMessagesRequest {
  ChannelArn: string;
  SortOrder?: SortOrder;
  NotBefore?: Date;
  NotAfter?: Date;
  MaxResults?: number;
  NextToken?: string | redacted.Redacted<string>;
  ChimeBearer: string;
  SubChannelId?: string;
}
export const ListChannelMessagesRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    SortOrder: S.optional(SortOrder).pipe(T.HttpQuery("sort-order")),
    NotBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("not-before"),
    ),
    NotAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))).pipe(
      T.HttpQuery("not-after"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    SubChannelId: S.optional(S.String).pipe(T.HttpQuery("sub-channel-id")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels/{ChannelArn}/messages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelMessagesRequest",
}) as any as S.Schema<ListChannelMessagesRequest>;
export interface ListChannelModeratorsRequest {
  ChannelArn: string;
  MaxResults?: number;
  NextToken?: string | redacted.Redacted<string>;
  ChimeBearer: string;
}
export const ListChannelModeratorsRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels/{ChannelArn}/moderators" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelModeratorsRequest",
}) as any as S.Schema<ListChannelModeratorsRequest>;
export interface ListChannelsRequest {
  AppInstanceArn: string;
  Privacy?: ChannelPrivacy;
  MaxResults?: number;
  NextToken?: string | redacted.Redacted<string>;
  ChimeBearer: string;
}
export const ListChannelsRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpQuery("app-instance-arn")),
    Privacy: S.optional(ChannelPrivacy).pipe(T.HttpQuery("privacy")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelsRequest",
}) as any as S.Schema<ListChannelsRequest>;
export interface ListChannelsAssociatedWithChannelFlowRequest {
  ChannelFlowArn: string;
  MaxResults?: number;
  NextToken?: string | redacted.Redacted<string>;
}
export const ListChannelsAssociatedWithChannelFlowRequest = S.suspend(() =>
  S.Struct({
    ChannelFlowArn: S.String.pipe(T.HttpQuery("channel-flow-arn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channels?scope=channel-flow-associations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelsAssociatedWithChannelFlowRequest",
}) as any as S.Schema<ListChannelsAssociatedWithChannelFlowRequest>;
export interface ListChannelsModeratedByAppInstanceUserRequest {
  AppInstanceUserArn?: string;
  MaxResults?: number;
  NextToken?: string | redacted.Redacted<string>;
  ChimeBearer: string;
}
export const ListChannelsModeratedByAppInstanceUserRequest = S.suspend(() =>
  S.Struct({
    AppInstanceUserArn: S.optional(S.String).pipe(
      T.HttpQuery("app-instance-user-arn"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/channels?scope=app-instance-user-moderated-channels",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelsModeratedByAppInstanceUserRequest",
}) as any as S.Schema<ListChannelsModeratedByAppInstanceUserRequest>;
export interface ListSubChannelsRequest {
  ChannelArn: string;
  ChimeBearer: string;
  MaxResults?: number;
  NextToken?: string | redacted.Redacted<string>;
}
export const ListSubChannelsRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/channels/{ChannelArn}/subchannels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSubChannelsRequest",
}) as any as S.Schema<ListSubChannelsRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String.pipe(T.HttpQuery("arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags" }),
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
export type ExpirationCriterion =
  | "CREATED_TIMESTAMP"
  | "LAST_MESSAGE_TIMESTAMP"
  | (string & {});
export const ExpirationCriterion = S.String;
export interface ExpirationSettings {
  ExpirationDays: number;
  ExpirationCriterion: ExpirationCriterion;
}
export const ExpirationSettings = S.suspend(() =>
  S.Struct({
    ExpirationDays: S.Number,
    ExpirationCriterion: ExpirationCriterion,
  }),
).annotations({
  identifier: "ExpirationSettings",
}) as any as S.Schema<ExpirationSettings>;
export interface PutChannelExpirationSettingsRequest {
  ChannelArn: string;
  ChimeBearer?: string;
  ExpirationSettings?: ExpirationSettings;
}
export const PutChannelExpirationSettingsRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    ChimeBearer: S.optional(S.String).pipe(T.HttpHeader("x-amz-chime-bearer")),
    ExpirationSettings: S.optional(ExpirationSettings),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/channels/{ChannelArn}/expiration-settings",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutChannelExpirationSettingsRequest",
}) as any as S.Schema<PutChannelExpirationSettingsRequest>;
export interface RedactChannelMessageRequest {
  ChannelArn: string;
  MessageId: string;
  ChimeBearer: string;
  SubChannelId?: string;
}
export const RedactChannelMessageRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MessageId: S.String.pipe(T.HttpLabel("MessageId")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    SubChannelId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/channels/{ChannelArn}/messages/{MessageId}?operation=redact",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RedactChannelMessageRequest",
}) as any as S.Schema<RedactChannelMessageRequest>;
export interface Tag {
  Key: string | redacted.Redacted<string>;
  Value: string | redacted.Redacted<string>;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: SensitiveString, Value: SensitiveString }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags?operation=tag-resource" }),
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
  ResourceARN: string;
  TagKeys: string | redacted.Redacted<string>[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags?operation=untag-resource" }),
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
export interface UpdateChannelRequest {
  ChannelArn: string;
  Name?: string | redacted.Redacted<string>;
  Mode?: ChannelMode;
  Metadata?: string | redacted.Redacted<string>;
  ChimeBearer: string;
}
export const UpdateChannelRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    Name: S.optional(SensitiveString),
    Mode: S.optional(ChannelMode),
    Metadata: S.optional(SensitiveString),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channels/{ChannelArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelRequest",
}) as any as S.Schema<UpdateChannelRequest>;
export type InvocationType = "ASYNC" | (string & {});
export const InvocationType = S.String;
export interface LambdaConfiguration {
  ResourceArn: string;
  InvocationType: InvocationType;
}
export const LambdaConfiguration = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, InvocationType: InvocationType }),
).annotations({
  identifier: "LambdaConfiguration",
}) as any as S.Schema<LambdaConfiguration>;
export interface ProcessorConfiguration {
  Lambda: LambdaConfiguration;
}
export const ProcessorConfiguration = S.suspend(() =>
  S.Struct({ Lambda: LambdaConfiguration }),
).annotations({
  identifier: "ProcessorConfiguration",
}) as any as S.Schema<ProcessorConfiguration>;
export type FallbackAction = "CONTINUE" | "ABORT" | (string & {});
export const FallbackAction = S.String;
export interface Processor {
  Name: string | redacted.Redacted<string>;
  Configuration: ProcessorConfiguration;
  ExecutionOrder: number;
  FallbackAction: FallbackAction;
}
export const Processor = S.suspend(() =>
  S.Struct({
    Name: SensitiveString,
    Configuration: ProcessorConfiguration,
    ExecutionOrder: S.Number,
    FallbackAction: FallbackAction,
  }),
).annotations({ identifier: "Processor" }) as any as S.Schema<Processor>;
export type ProcessorList = Processor[];
export const ProcessorList = S.Array(Processor);
export interface UpdateChannelFlowRequest {
  ChannelFlowArn: string;
  Processors: Processor[];
  Name: string | redacted.Redacted<string>;
}
export const UpdateChannelFlowRequest = S.suspend(() =>
  S.Struct({
    ChannelFlowArn: S.String.pipe(T.HttpLabel("ChannelFlowArn")),
    Processors: ProcessorList,
    Name: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channel-flows/{ChannelFlowArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelFlowRequest",
}) as any as S.Schema<UpdateChannelFlowRequest>;
export interface UpdateChannelMessageRequest {
  ChannelArn: string;
  MessageId: string;
  Content: string | redacted.Redacted<string>;
  Metadata?: string | redacted.Redacted<string>;
  ChimeBearer: string;
  SubChannelId?: string;
  ContentType?: string | redacted.Redacted<string>;
}
export const UpdateChannelMessageRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MessageId: S.String.pipe(T.HttpLabel("MessageId")),
    Content: SensitiveString,
    Metadata: S.optional(SensitiveString),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    SubChannelId: S.optional(S.String),
    ContentType: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/channels/{ChannelArn}/messages/{MessageId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelMessageRequest",
}) as any as S.Schema<UpdateChannelMessageRequest>;
export interface UpdateChannelReadMarkerRequest {
  ChannelArn: string;
  ChimeBearer: string;
}
export const UpdateChannelReadMarkerRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channels/{ChannelArn}/readMarker" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelReadMarkerRequest",
}) as any as S.Schema<UpdateChannelReadMarkerRequest>;
export type MessagingDataType = "Channel" | "ChannelMessage" | (string & {});
export const MessagingDataType = S.String;
export type SearchFieldKey = "MEMBERS" | (string & {});
export const SearchFieldKey = S.String;
export type SearchFieldValues = string[];
export const SearchFieldValues = S.Array(S.String);
export type SearchFieldOperator = "EQUALS" | "INCLUDES" | (string & {});
export const SearchFieldOperator = S.String;
export type PushNotificationType = "DEFAULT" | "VOIP" | (string & {});
export const PushNotificationType = S.String;
export type ErrorCode =
  | "BadRequest"
  | "Conflict"
  | "Forbidden"
  | "NotFound"
  | "PreconditionFailed"
  | "ResourceLimitExceeded"
  | "ServiceFailure"
  | "AccessDenied"
  | "ServiceUnavailable"
  | "Throttled"
  | "Throttling"
  | "Unauthorized"
  | "Unprocessable"
  | "VoiceConnectorGroupAssociationsExist"
  | "PhoneNumberAssociationsExist"
  | (string & {});
export const ErrorCode = S.String;
export interface PushNotificationConfiguration {
  Title?: string | redacted.Redacted<string>;
  Body?: string | redacted.Redacted<string>;
  Type?: PushNotificationType;
}
export const PushNotificationConfiguration = S.suspend(() =>
  S.Struct({
    Title: S.optional(SensitiveString),
    Body: S.optional(SensitiveString),
    Type: S.optional(PushNotificationType),
  }),
).annotations({
  identifier: "PushNotificationConfiguration",
}) as any as S.Schema<PushNotificationConfiguration>;
export type MessageAttributeStringValues = string | redacted.Redacted<string>[];
export const MessageAttributeStringValues = S.Array(SensitiveString);
export interface MessageAttributeValue {
  StringValues?: string | redacted.Redacted<string>[];
}
export const MessageAttributeValue = S.suspend(() =>
  S.Struct({ StringValues: S.optional(MessageAttributeStringValues) }),
).annotations({
  identifier: "MessageAttributeValue",
}) as any as S.Schema<MessageAttributeValue>;
export type MessageAttributeMap = {
  [key: string]: MessageAttributeValue | undefined;
};
export const MessageAttributeMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(MessageAttributeValue),
});
export interface ChannelMessageCallback {
  MessageId: string;
  Content?: string | redacted.Redacted<string>;
  Metadata?: string | redacted.Redacted<string>;
  PushNotification?: PushNotificationConfiguration;
  MessageAttributes?: { [key: string]: MessageAttributeValue | undefined };
  SubChannelId?: string;
  ContentType?: string | redacted.Redacted<string>;
}
export const ChannelMessageCallback = S.suspend(() =>
  S.Struct({
    MessageId: S.String,
    Content: S.optional(SensitiveString),
    Metadata: S.optional(SensitiveString),
    PushNotification: S.optional(PushNotificationConfiguration),
    MessageAttributes: S.optional(MessageAttributeMap),
    SubChannelId: S.optional(S.String),
    ContentType: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ChannelMessageCallback",
}) as any as S.Schema<ChannelMessageCallback>;
export interface ElasticChannelConfiguration {
  MaximumSubChannels: number;
  TargetMembershipsPerSubChannel: number;
  MinimumMembershipPercentage: number;
}
export const ElasticChannelConfiguration = S.suspend(() =>
  S.Struct({
    MaximumSubChannels: S.Number,
    TargetMembershipsPerSubChannel: S.Number,
    MinimumMembershipPercentage: S.Number,
  }),
).annotations({
  identifier: "ElasticChannelConfiguration",
}) as any as S.Schema<ElasticChannelConfiguration>;
export interface ChannelSummary {
  Name?: string | redacted.Redacted<string>;
  ChannelArn?: string;
  Mode?: ChannelMode;
  Privacy?: ChannelPrivacy;
  Metadata?: string | redacted.Redacted<string>;
  LastMessageTimestamp?: Date;
}
export const ChannelSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    ChannelArn: S.optional(S.String),
    Mode: S.optional(ChannelMode),
    Privacy: S.optional(ChannelPrivacy),
    Metadata: S.optional(SensitiveString),
    LastMessageTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ChannelSummary",
}) as any as S.Schema<ChannelSummary>;
export interface AppInstanceUserMembershipSummary {
  Type?: ChannelMembershipType;
  ReadMarkerTimestamp?: Date;
  SubChannelId?: string;
}
export const AppInstanceUserMembershipSummary = S.suspend(() =>
  S.Struct({
    Type: S.optional(ChannelMembershipType),
    ReadMarkerTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SubChannelId: S.optional(S.String),
  }),
).annotations({
  identifier: "AppInstanceUserMembershipSummary",
}) as any as S.Schema<AppInstanceUserMembershipSummary>;
export interface ChannelMembershipForAppInstanceUserSummary {
  ChannelSummary?: ChannelSummary;
  AppInstanceUserMembershipSummary?: AppInstanceUserMembershipSummary;
}
export const ChannelMembershipForAppInstanceUserSummary = S.suspend(() =>
  S.Struct({
    ChannelSummary: S.optional(ChannelSummary),
    AppInstanceUserMembershipSummary: S.optional(
      AppInstanceUserMembershipSummary,
    ),
  }),
).annotations({
  identifier: "ChannelMembershipForAppInstanceUserSummary",
}) as any as S.Schema<ChannelMembershipForAppInstanceUserSummary>;
export type ChannelMembershipForAppInstanceUserSummaryList =
  ChannelMembershipForAppInstanceUserSummary[];
export const ChannelMembershipForAppInstanceUserSummaryList = S.Array(
  ChannelMembershipForAppInstanceUserSummary,
);
export interface ChannelModeratedByAppInstanceUserSummary {
  ChannelSummary?: ChannelSummary;
}
export const ChannelModeratedByAppInstanceUserSummary = S.suspend(() =>
  S.Struct({ ChannelSummary: S.optional(ChannelSummary) }),
).annotations({
  identifier: "ChannelModeratedByAppInstanceUserSummary",
}) as any as S.Schema<ChannelModeratedByAppInstanceUserSummary>;
export type ChannelModeratedByAppInstanceUserSummaryList =
  ChannelModeratedByAppInstanceUserSummary[];
export const ChannelModeratedByAppInstanceUserSummaryList = S.Array(
  ChannelModeratedByAppInstanceUserSummary,
);
export interface StreamingConfiguration {
  DataType: MessagingDataType;
  ResourceArn: string;
}
export const StreamingConfiguration = S.suspend(() =>
  S.Struct({ DataType: MessagingDataType, ResourceArn: S.String }),
).annotations({
  identifier: "StreamingConfiguration",
}) as any as S.Schema<StreamingConfiguration>;
export type StreamingConfigurationList = StreamingConfiguration[];
export const StreamingConfigurationList = S.Array(StreamingConfiguration);
export interface SearchField {
  Key: SearchFieldKey;
  Values: string[];
  Operator: SearchFieldOperator;
}
export const SearchField = S.suspend(() =>
  S.Struct({
    Key: SearchFieldKey,
    Values: SearchFieldValues,
    Operator: SearchFieldOperator,
  }),
).annotations({ identifier: "SearchField" }) as any as S.Schema<SearchField>;
export type SearchFields = SearchField[];
export const SearchFields = S.Array(SearchField);
export interface Target {
  MemberArn?: string;
}
export const Target = S.suspend(() =>
  S.Struct({ MemberArn: S.optional(S.String) }),
).annotations({ identifier: "Target" }) as any as S.Schema<Target>;
export type TargetList = Target[];
export const TargetList = S.Array(Target);
export type AllowNotifications = "ALL" | "NONE" | "FILTERED" | (string & {});
export const AllowNotifications = S.String;
export interface ChannelFlowCallbackRequest {
  CallbackId: string;
  ChannelArn: string;
  DeleteResource?: boolean;
  ChannelMessage: ChannelMessageCallback;
}
export const ChannelFlowCallbackRequest = S.suspend(() =>
  S.Struct({
    CallbackId: S.String.pipe(T.IdempotencyToken()),
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    DeleteResource: S.optional(S.Boolean),
    ChannelMessage: ChannelMessageCallback,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/channels/{ChannelArn}?operation=channel-flow-callback",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ChannelFlowCallbackRequest",
}) as any as S.Schema<ChannelFlowCallbackRequest>;
export interface CreateChannelRequest {
  AppInstanceArn: string;
  Name: string | redacted.Redacted<string>;
  Mode?: ChannelMode;
  Privacy?: ChannelPrivacy;
  Metadata?: string | redacted.Redacted<string>;
  ClientRequestToken: string | redacted.Redacted<string>;
  Tags?: Tag[];
  ChimeBearer: string;
  ChannelId?: string | redacted.Redacted<string>;
  MemberArns?: string[];
  ModeratorArns?: string[];
  ElasticChannelConfiguration?: ElasticChannelConfiguration;
  ExpirationSettings?: ExpirationSettings;
}
export const CreateChannelRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String,
    Name: SensitiveString,
    Mode: S.optional(ChannelMode),
    Privacy: S.optional(ChannelPrivacy),
    Metadata: S.optional(SensitiveString),
    ClientRequestToken: SensitiveString.pipe(T.IdempotencyToken()),
    Tags: S.optional(TagList),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    ChannelId: S.optional(SensitiveString),
    MemberArns: S.optional(ChannelMemberArns),
    ModeratorArns: S.optional(ChannelModeratorArns),
    ElasticChannelConfiguration: S.optional(ElasticChannelConfiguration),
    ExpirationSettings: S.optional(ExpirationSettings),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelRequest",
}) as any as S.Schema<CreateChannelRequest>;
export interface Identity {
  Arn?: string;
  Name?: string | redacted.Redacted<string>;
}
export const Identity = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Name: S.optional(SensitiveString) }),
).annotations({ identifier: "Identity" }) as any as S.Schema<Identity>;
export interface CreateChannelMembershipResponse {
  ChannelArn?: string;
  Member?: Identity;
  SubChannelId?: string;
}
export const CreateChannelMembershipResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    Member: S.optional(Identity),
    SubChannelId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateChannelMembershipResponse",
}) as any as S.Schema<CreateChannelMembershipResponse>;
export interface CreateChannelModeratorResponse {
  ChannelArn?: string;
  ChannelModerator?: Identity;
}
export const CreateChannelModeratorResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    ChannelModerator: S.optional(Identity),
  }),
).annotations({
  identifier: "CreateChannelModeratorResponse",
}) as any as S.Schema<CreateChannelModeratorResponse>;
export interface PushNotificationPreferences {
  AllowNotifications: AllowNotifications;
  FilterRule?: string | redacted.Redacted<string>;
}
export const PushNotificationPreferences = S.suspend(() =>
  S.Struct({
    AllowNotifications: AllowNotifications,
    FilterRule: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "PushNotificationPreferences",
}) as any as S.Schema<PushNotificationPreferences>;
export interface ChannelMembershipPreferences {
  PushNotifications?: PushNotificationPreferences;
}
export const ChannelMembershipPreferences = S.suspend(() =>
  S.Struct({ PushNotifications: S.optional(PushNotificationPreferences) }),
).annotations({
  identifier: "ChannelMembershipPreferences",
}) as any as S.Schema<ChannelMembershipPreferences>;
export interface GetChannelMembershipPreferencesResponse {
  ChannelArn?: string;
  Member?: Identity;
  Preferences?: ChannelMembershipPreferences;
}
export const GetChannelMembershipPreferencesResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    Member: S.optional(Identity),
    Preferences: S.optional(ChannelMembershipPreferences),
  }),
).annotations({
  identifier: "GetChannelMembershipPreferencesResponse",
}) as any as S.Schema<GetChannelMembershipPreferencesResponse>;
export interface GetMessagingStreamingConfigurationsResponse {
  StreamingConfigurations?: StreamingConfiguration[];
}
export const GetMessagingStreamingConfigurationsResponse = S.suspend(() =>
  S.Struct({ StreamingConfigurations: S.optional(StreamingConfigurationList) }),
).annotations({
  identifier: "GetMessagingStreamingConfigurationsResponse",
}) as any as S.Schema<GetMessagingStreamingConfigurationsResponse>;
export interface ListChannelMembershipsForAppInstanceUserResponse {
  ChannelMemberships?: ChannelMembershipForAppInstanceUserSummary[];
  NextToken?: string | redacted.Redacted<string>;
}
export const ListChannelMembershipsForAppInstanceUserResponse = S.suspend(() =>
  S.Struct({
    ChannelMemberships: S.optional(
      ChannelMembershipForAppInstanceUserSummaryList,
    ),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListChannelMembershipsForAppInstanceUserResponse",
}) as any as S.Schema<ListChannelMembershipsForAppInstanceUserResponse>;
export interface ListChannelsModeratedByAppInstanceUserResponse {
  Channels?: ChannelModeratedByAppInstanceUserSummary[];
  NextToken?: string | redacted.Redacted<string>;
}
export const ListChannelsModeratedByAppInstanceUserResponse = S.suspend(() =>
  S.Struct({
    Channels: S.optional(ChannelModeratedByAppInstanceUserSummaryList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListChannelsModeratedByAppInstanceUserResponse",
}) as any as S.Schema<ListChannelsModeratedByAppInstanceUserResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutChannelExpirationSettingsResponse {
  ChannelArn?: string;
  ExpirationSettings?: ExpirationSettings;
}
export const PutChannelExpirationSettingsResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    ExpirationSettings: S.optional(ExpirationSettings),
  }),
).annotations({
  identifier: "PutChannelExpirationSettingsResponse",
}) as any as S.Schema<PutChannelExpirationSettingsResponse>;
export interface PutMessagingStreamingConfigurationsRequest {
  AppInstanceArn: string;
  StreamingConfigurations: StreamingConfiguration[];
}
export const PutMessagingStreamingConfigurationsRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String.pipe(T.HttpLabel("AppInstanceArn")),
    StreamingConfigurations: StreamingConfigurationList,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/app-instances/{AppInstanceArn}/streaming-configurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutMessagingStreamingConfigurationsRequest",
}) as any as S.Schema<PutMessagingStreamingConfigurationsRequest>;
export interface RedactChannelMessageResponse {
  ChannelArn?: string;
  MessageId?: string;
  SubChannelId?: string;
}
export const RedactChannelMessageResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    MessageId: S.optional(S.String),
    SubChannelId: S.optional(S.String),
  }),
).annotations({
  identifier: "RedactChannelMessageResponse",
}) as any as S.Schema<RedactChannelMessageResponse>;
export interface SearchChannelsRequest {
  ChimeBearer?: string;
  Fields: SearchField[];
  MaxResults?: number;
  NextToken?: string | redacted.Redacted<string>;
}
export const SearchChannelsRequest = S.suspend(() =>
  S.Struct({
    ChimeBearer: S.optional(S.String).pipe(T.HttpHeader("x-amz-chime-bearer")),
    Fields: SearchFields,
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("max-results")),
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("next-token")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channels?operation=search" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchChannelsRequest",
}) as any as S.Schema<SearchChannelsRequest>;
export interface UpdateChannelResponse {
  ChannelArn?: string;
}
export const UpdateChannelResponse = S.suspend(() =>
  S.Struct({ ChannelArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateChannelResponse",
}) as any as S.Schema<UpdateChannelResponse>;
export interface UpdateChannelFlowResponse {
  ChannelFlowArn?: string;
}
export const UpdateChannelFlowResponse = S.suspend(() =>
  S.Struct({ ChannelFlowArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateChannelFlowResponse",
}) as any as S.Schema<UpdateChannelFlowResponse>;
export type ChannelMessageStatus =
  | "SENT"
  | "PENDING"
  | "FAILED"
  | "DENIED"
  | (string & {});
export const ChannelMessageStatus = S.String;
export interface ChannelMessageStatusStructure {
  Value?: ChannelMessageStatus;
  Detail?: string;
}
export const ChannelMessageStatusStructure = S.suspend(() =>
  S.Struct({
    Value: S.optional(ChannelMessageStatus),
    Detail: S.optional(S.String),
  }),
).annotations({
  identifier: "ChannelMessageStatusStructure",
}) as any as S.Schema<ChannelMessageStatusStructure>;
export interface UpdateChannelMessageResponse {
  ChannelArn?: string;
  MessageId?: string;
  Status?: ChannelMessageStatusStructure;
  SubChannelId?: string;
}
export const UpdateChannelMessageResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    MessageId: S.optional(S.String),
    Status: S.optional(ChannelMessageStatusStructure),
    SubChannelId: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateChannelMessageResponse",
}) as any as S.Schema<UpdateChannelMessageResponse>;
export interface UpdateChannelReadMarkerResponse {
  ChannelArn?: string;
}
export const UpdateChannelReadMarkerResponse = S.suspend(() =>
  S.Struct({ ChannelArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateChannelReadMarkerResponse",
}) as any as S.Schema<UpdateChannelReadMarkerResponse>;
export type Members = Identity[];
export const Members = S.Array(Identity);
export interface BatchChannelMemberships {
  InvitedBy?: Identity;
  Type?: ChannelMembershipType;
  Members?: Identity[];
  ChannelArn?: string;
  SubChannelId?: string;
}
export const BatchChannelMemberships = S.suspend(() =>
  S.Struct({
    InvitedBy: S.optional(Identity),
    Type: S.optional(ChannelMembershipType),
    Members: S.optional(Members),
    ChannelArn: S.optional(S.String),
    SubChannelId: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchChannelMemberships",
}) as any as S.Schema<BatchChannelMemberships>;
export interface BatchCreateChannelMembershipError {
  MemberArn?: string;
  ErrorCode?: ErrorCode;
  ErrorMessage?: string;
}
export const BatchCreateChannelMembershipError = S.suspend(() =>
  S.Struct({
    MemberArn: S.optional(S.String),
    ErrorCode: S.optional(ErrorCode),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchCreateChannelMembershipError",
}) as any as S.Schema<BatchCreateChannelMembershipError>;
export type BatchCreateChannelMembershipErrors =
  BatchCreateChannelMembershipError[];
export const BatchCreateChannelMembershipErrors = S.Array(
  BatchCreateChannelMembershipError,
);
export interface Channel {
  Name?: string | redacted.Redacted<string>;
  ChannelArn?: string;
  Mode?: ChannelMode;
  Privacy?: ChannelPrivacy;
  Metadata?: string | redacted.Redacted<string>;
  CreatedBy?: Identity;
  CreatedTimestamp?: Date;
  LastMessageTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
  ChannelFlowArn?: string;
  ElasticChannelConfiguration?: ElasticChannelConfiguration;
  ExpirationSettings?: ExpirationSettings;
}
export const Channel = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    ChannelArn: S.optional(S.String),
    Mode: S.optional(ChannelMode),
    Privacy: S.optional(ChannelPrivacy),
    Metadata: S.optional(SensitiveString),
    CreatedBy: S.optional(Identity),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastMessageTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ChannelFlowArn: S.optional(S.String),
    ElasticChannelConfiguration: S.optional(ElasticChannelConfiguration),
    ExpirationSettings: S.optional(ExpirationSettings),
  }),
).annotations({ identifier: "Channel" }) as any as S.Schema<Channel>;
export interface ChannelBan {
  Member?: Identity;
  ChannelArn?: string;
  CreatedTimestamp?: Date;
  CreatedBy?: Identity;
}
export const ChannelBan = S.suspend(() =>
  S.Struct({
    Member: S.optional(Identity),
    ChannelArn: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedBy: S.optional(Identity),
  }),
).annotations({ identifier: "ChannelBan" }) as any as S.Schema<ChannelBan>;
export interface ChannelFlow {
  ChannelFlowArn?: string;
  Processors?: Processor[];
  Name?: string | redacted.Redacted<string>;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
}
export const ChannelFlow = S.suspend(() =>
  S.Struct({
    ChannelFlowArn: S.optional(S.String),
    Processors: S.optional(ProcessorList),
    Name: S.optional(SensitiveString),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "ChannelFlow" }) as any as S.Schema<ChannelFlow>;
export interface ChannelMembership {
  InvitedBy?: Identity;
  Type?: ChannelMembershipType;
  Member?: Identity;
  ChannelArn?: string;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
  SubChannelId?: string;
}
export const ChannelMembership = S.suspend(() =>
  S.Struct({
    InvitedBy: S.optional(Identity),
    Type: S.optional(ChannelMembershipType),
    Member: S.optional(Identity),
    ChannelArn: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SubChannelId: S.optional(S.String),
  }),
).annotations({
  identifier: "ChannelMembership",
}) as any as S.Schema<ChannelMembership>;
export interface ChannelModerator {
  Moderator?: Identity;
  ChannelArn?: string;
  CreatedTimestamp?: Date;
  CreatedBy?: Identity;
}
export const ChannelModerator = S.suspend(() =>
  S.Struct({
    Moderator: S.optional(Identity),
    ChannelArn: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedBy: S.optional(Identity),
  }),
).annotations({
  identifier: "ChannelModerator",
}) as any as S.Schema<ChannelModerator>;
export interface ChannelMessage {
  ChannelArn?: string;
  MessageId?: string;
  Content?: string | redacted.Redacted<string>;
  Metadata?: string | redacted.Redacted<string>;
  Type?: ChannelMessageType;
  CreatedTimestamp?: Date;
  LastEditedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
  Sender?: Identity;
  Redacted?: boolean;
  Persistence?: ChannelMessagePersistenceType;
  Status?: ChannelMessageStatusStructure;
  MessageAttributes?: { [key: string]: MessageAttributeValue | undefined };
  SubChannelId?: string;
  ContentType?: string | redacted.Redacted<string>;
  Target?: Target[];
}
export const ChannelMessage = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    MessageId: S.optional(S.String),
    Content: S.optional(SensitiveString),
    Metadata: S.optional(SensitiveString),
    Type: S.optional(ChannelMessageType),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastEditedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Sender: S.optional(Identity),
    Redacted: S.optional(S.Boolean),
    Persistence: S.optional(ChannelMessagePersistenceType),
    Status: S.optional(ChannelMessageStatusStructure),
    MessageAttributes: S.optional(MessageAttributeMap),
    SubChannelId: S.optional(S.String),
    ContentType: S.optional(SensitiveString),
    Target: S.optional(TargetList),
  }),
).annotations({
  identifier: "ChannelMessage",
}) as any as S.Schema<ChannelMessage>;
export interface MessagingSessionEndpoint {
  Url?: string;
}
export const MessagingSessionEndpoint = S.suspend(() =>
  S.Struct({ Url: S.optional(S.String) }),
).annotations({
  identifier: "MessagingSessionEndpoint",
}) as any as S.Schema<MessagingSessionEndpoint>;
export interface ChannelBanSummary {
  Member?: Identity;
}
export const ChannelBanSummary = S.suspend(() =>
  S.Struct({ Member: S.optional(Identity) }),
).annotations({
  identifier: "ChannelBanSummary",
}) as any as S.Schema<ChannelBanSummary>;
export type ChannelBanSummaryList = ChannelBanSummary[];
export const ChannelBanSummaryList = S.Array(ChannelBanSummary);
export interface ChannelFlowSummary {
  ChannelFlowArn?: string;
  Name?: string | redacted.Redacted<string>;
  Processors?: Processor[];
}
export const ChannelFlowSummary = S.suspend(() =>
  S.Struct({
    ChannelFlowArn: S.optional(S.String),
    Name: S.optional(SensitiveString),
    Processors: S.optional(ProcessorList),
  }),
).annotations({
  identifier: "ChannelFlowSummary",
}) as any as S.Schema<ChannelFlowSummary>;
export type ChannelFlowSummaryList = ChannelFlowSummary[];
export const ChannelFlowSummaryList = S.Array(ChannelFlowSummary);
export interface ChannelMembershipSummary {
  Member?: Identity;
}
export const ChannelMembershipSummary = S.suspend(() =>
  S.Struct({ Member: S.optional(Identity) }),
).annotations({
  identifier: "ChannelMembershipSummary",
}) as any as S.Schema<ChannelMembershipSummary>;
export type ChannelMembershipSummaryList = ChannelMembershipSummary[];
export const ChannelMembershipSummaryList = S.Array(ChannelMembershipSummary);
export interface ChannelMessageSummary {
  MessageId?: string;
  Content?: string | redacted.Redacted<string>;
  Metadata?: string | redacted.Redacted<string>;
  Type?: ChannelMessageType;
  CreatedTimestamp?: Date;
  LastUpdatedTimestamp?: Date;
  LastEditedTimestamp?: Date;
  Sender?: Identity;
  Redacted?: boolean;
  Status?: ChannelMessageStatusStructure;
  MessageAttributes?: { [key: string]: MessageAttributeValue | undefined };
  ContentType?: string | redacted.Redacted<string>;
  Target?: Target[];
}
export const ChannelMessageSummary = S.suspend(() =>
  S.Struct({
    MessageId: S.optional(S.String),
    Content: S.optional(SensitiveString),
    Metadata: S.optional(SensitiveString),
    Type: S.optional(ChannelMessageType),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastEditedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Sender: S.optional(Identity),
    Redacted: S.optional(S.Boolean),
    Status: S.optional(ChannelMessageStatusStructure),
    MessageAttributes: S.optional(MessageAttributeMap),
    ContentType: S.optional(SensitiveString),
    Target: S.optional(TargetList),
  }),
).annotations({
  identifier: "ChannelMessageSummary",
}) as any as S.Schema<ChannelMessageSummary>;
export type ChannelMessageSummaryList = ChannelMessageSummary[];
export const ChannelMessageSummaryList = S.Array(ChannelMessageSummary);
export interface ChannelModeratorSummary {
  Moderator?: Identity;
}
export const ChannelModeratorSummary = S.suspend(() =>
  S.Struct({ Moderator: S.optional(Identity) }),
).annotations({
  identifier: "ChannelModeratorSummary",
}) as any as S.Schema<ChannelModeratorSummary>;
export type ChannelModeratorSummaryList = ChannelModeratorSummary[];
export const ChannelModeratorSummaryList = S.Array(ChannelModeratorSummary);
export type ChannelSummaryList = ChannelSummary[];
export const ChannelSummaryList = S.Array(ChannelSummary);
export interface ChannelAssociatedWithFlowSummary {
  Name?: string | redacted.Redacted<string>;
  ChannelArn?: string;
  Mode?: ChannelMode;
  Privacy?: ChannelPrivacy;
  Metadata?: string | redacted.Redacted<string>;
}
export const ChannelAssociatedWithFlowSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(SensitiveString),
    ChannelArn: S.optional(S.String),
    Mode: S.optional(ChannelMode),
    Privacy: S.optional(ChannelPrivacy),
    Metadata: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ChannelAssociatedWithFlowSummary",
}) as any as S.Schema<ChannelAssociatedWithFlowSummary>;
export type ChannelAssociatedWithFlowSummaryList =
  ChannelAssociatedWithFlowSummary[];
export const ChannelAssociatedWithFlowSummaryList = S.Array(
  ChannelAssociatedWithFlowSummary,
);
export interface SubChannelSummary {
  SubChannelId?: string;
  MembershipCount?: number;
}
export const SubChannelSummary = S.suspend(() =>
  S.Struct({
    SubChannelId: S.optional(S.String),
    MembershipCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "SubChannelSummary",
}) as any as S.Schema<SubChannelSummary>;
export type SubChannelSummaryList = SubChannelSummary[];
export const SubChannelSummaryList = S.Array(SubChannelSummary);
export interface BatchCreateChannelMembershipResponse {
  BatchChannelMemberships?: BatchChannelMemberships;
  Errors?: BatchCreateChannelMembershipError[];
}
export const BatchCreateChannelMembershipResponse = S.suspend(() =>
  S.Struct({
    BatchChannelMemberships: S.optional(BatchChannelMemberships),
    Errors: S.optional(BatchCreateChannelMembershipErrors),
  }),
).annotations({
  identifier: "BatchCreateChannelMembershipResponse",
}) as any as S.Schema<BatchCreateChannelMembershipResponse>;
export interface ChannelFlowCallbackResponse {
  ChannelArn?: string;
  CallbackId?: string;
}
export const ChannelFlowCallbackResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    CallbackId: S.optional(S.String),
  }),
).annotations({
  identifier: "ChannelFlowCallbackResponse",
}) as any as S.Schema<ChannelFlowCallbackResponse>;
export interface CreateChannelResponse {
  ChannelArn?: string;
}
export const CreateChannelResponse = S.suspend(() =>
  S.Struct({ ChannelArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateChannelResponse",
}) as any as S.Schema<CreateChannelResponse>;
export interface CreateChannelBanResponse {
  ChannelArn?: string;
  Member?: Identity;
}
export const CreateChannelBanResponse = S.suspend(() =>
  S.Struct({ ChannelArn: S.optional(S.String), Member: S.optional(Identity) }),
).annotations({
  identifier: "CreateChannelBanResponse",
}) as any as S.Schema<CreateChannelBanResponse>;
export interface DescribeChannelResponse {
  Channel?: Channel;
}
export const DescribeChannelResponse = S.suspend(() =>
  S.Struct({ Channel: S.optional(Channel) }),
).annotations({
  identifier: "DescribeChannelResponse",
}) as any as S.Schema<DescribeChannelResponse>;
export interface DescribeChannelBanResponse {
  ChannelBan?: ChannelBan;
}
export const DescribeChannelBanResponse = S.suspend(() =>
  S.Struct({ ChannelBan: S.optional(ChannelBan) }),
).annotations({
  identifier: "DescribeChannelBanResponse",
}) as any as S.Schema<DescribeChannelBanResponse>;
export interface DescribeChannelFlowResponse {
  ChannelFlow?: ChannelFlow;
}
export const DescribeChannelFlowResponse = S.suspend(() =>
  S.Struct({ ChannelFlow: S.optional(ChannelFlow) }),
).annotations({
  identifier: "DescribeChannelFlowResponse",
}) as any as S.Schema<DescribeChannelFlowResponse>;
export interface DescribeChannelMembershipResponse {
  ChannelMembership?: ChannelMembership;
}
export const DescribeChannelMembershipResponse = S.suspend(() =>
  S.Struct({ ChannelMembership: S.optional(ChannelMembership) }),
).annotations({
  identifier: "DescribeChannelMembershipResponse",
}) as any as S.Schema<DescribeChannelMembershipResponse>;
export interface DescribeChannelModeratedByAppInstanceUserResponse {
  Channel?: ChannelModeratedByAppInstanceUserSummary;
}
export const DescribeChannelModeratedByAppInstanceUserResponse = S.suspend(() =>
  S.Struct({ Channel: S.optional(ChannelModeratedByAppInstanceUserSummary) }),
).annotations({
  identifier: "DescribeChannelModeratedByAppInstanceUserResponse",
}) as any as S.Schema<DescribeChannelModeratedByAppInstanceUserResponse>;
export interface DescribeChannelModeratorResponse {
  ChannelModerator?: ChannelModerator;
}
export const DescribeChannelModeratorResponse = S.suspend(() =>
  S.Struct({ ChannelModerator: S.optional(ChannelModerator) }),
).annotations({
  identifier: "DescribeChannelModeratorResponse",
}) as any as S.Schema<DescribeChannelModeratorResponse>;
export interface GetChannelMessageResponse {
  ChannelMessage?: ChannelMessage;
}
export const GetChannelMessageResponse = S.suspend(() =>
  S.Struct({ ChannelMessage: S.optional(ChannelMessage) }),
).annotations({
  identifier: "GetChannelMessageResponse",
}) as any as S.Schema<GetChannelMessageResponse>;
export interface GetChannelMessageStatusResponse {
  Status?: ChannelMessageStatusStructure;
}
export const GetChannelMessageStatusResponse = S.suspend(() =>
  S.Struct({ Status: S.optional(ChannelMessageStatusStructure) }),
).annotations({
  identifier: "GetChannelMessageStatusResponse",
}) as any as S.Schema<GetChannelMessageStatusResponse>;
export interface GetMessagingSessionEndpointResponse {
  Endpoint?: MessagingSessionEndpoint;
}
export const GetMessagingSessionEndpointResponse = S.suspend(() =>
  S.Struct({ Endpoint: S.optional(MessagingSessionEndpoint) }),
).annotations({
  identifier: "GetMessagingSessionEndpointResponse",
}) as any as S.Schema<GetMessagingSessionEndpointResponse>;
export interface ListChannelBansResponse {
  ChannelArn?: string;
  NextToken?: string | redacted.Redacted<string>;
  ChannelBans?: ChannelBanSummary[];
}
export const ListChannelBansResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    NextToken: S.optional(SensitiveString),
    ChannelBans: S.optional(ChannelBanSummaryList),
  }),
).annotations({
  identifier: "ListChannelBansResponse",
}) as any as S.Schema<ListChannelBansResponse>;
export interface ListChannelFlowsResponse {
  ChannelFlows?: ChannelFlowSummary[];
  NextToken?: string | redacted.Redacted<string>;
}
export const ListChannelFlowsResponse = S.suspend(() =>
  S.Struct({
    ChannelFlows: S.optional(ChannelFlowSummaryList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListChannelFlowsResponse",
}) as any as S.Schema<ListChannelFlowsResponse>;
export interface ListChannelMembershipsResponse {
  ChannelArn?: string;
  ChannelMemberships?: ChannelMembershipSummary[];
  NextToken?: string | redacted.Redacted<string>;
}
export const ListChannelMembershipsResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    ChannelMemberships: S.optional(ChannelMembershipSummaryList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListChannelMembershipsResponse",
}) as any as S.Schema<ListChannelMembershipsResponse>;
export interface ListChannelMessagesResponse {
  ChannelArn?: string;
  NextToken?: string | redacted.Redacted<string>;
  ChannelMessages?: ChannelMessageSummary[];
  SubChannelId?: string;
}
export const ListChannelMessagesResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    NextToken: S.optional(SensitiveString),
    ChannelMessages: S.optional(ChannelMessageSummaryList),
    SubChannelId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListChannelMessagesResponse",
}) as any as S.Schema<ListChannelMessagesResponse>;
export interface ListChannelModeratorsResponse {
  ChannelArn?: string;
  NextToken?: string | redacted.Redacted<string>;
  ChannelModerators?: ChannelModeratorSummary[];
}
export const ListChannelModeratorsResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    NextToken: S.optional(SensitiveString),
    ChannelModerators: S.optional(ChannelModeratorSummaryList),
  }),
).annotations({
  identifier: "ListChannelModeratorsResponse",
}) as any as S.Schema<ListChannelModeratorsResponse>;
export interface ListChannelsResponse {
  Channels?: ChannelSummary[];
  NextToken?: string | redacted.Redacted<string>;
}
export const ListChannelsResponse = S.suspend(() =>
  S.Struct({
    Channels: S.optional(ChannelSummaryList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListChannelsResponse",
}) as any as S.Schema<ListChannelsResponse>;
export interface ListChannelsAssociatedWithChannelFlowResponse {
  Channels?: ChannelAssociatedWithFlowSummary[];
  NextToken?: string | redacted.Redacted<string>;
}
export const ListChannelsAssociatedWithChannelFlowResponse = S.suspend(() =>
  S.Struct({
    Channels: S.optional(ChannelAssociatedWithFlowSummaryList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListChannelsAssociatedWithChannelFlowResponse",
}) as any as S.Schema<ListChannelsAssociatedWithChannelFlowResponse>;
export interface ListSubChannelsResponse {
  ChannelArn?: string;
  SubChannels?: SubChannelSummary[];
  NextToken?: string | redacted.Redacted<string>;
}
export const ListSubChannelsResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    SubChannels: S.optional(SubChannelSummaryList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListSubChannelsResponse",
}) as any as S.Schema<ListSubChannelsResponse>;
export interface PutChannelMembershipPreferencesRequest {
  ChannelArn: string;
  MemberArn: string;
  ChimeBearer: string;
  Preferences: ChannelMembershipPreferences;
}
export const PutChannelMembershipPreferencesRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    MemberArn: S.String.pipe(T.HttpLabel("MemberArn")),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    Preferences: ChannelMembershipPreferences,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/channels/{ChannelArn}/memberships/{MemberArn}/preferences",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutChannelMembershipPreferencesRequest",
}) as any as S.Schema<PutChannelMembershipPreferencesRequest>;
export interface PutMessagingStreamingConfigurationsResponse {
  StreamingConfigurations?: StreamingConfiguration[];
}
export const PutMessagingStreamingConfigurationsResponse = S.suspend(() =>
  S.Struct({ StreamingConfigurations: S.optional(StreamingConfigurationList) }),
).annotations({
  identifier: "PutMessagingStreamingConfigurationsResponse",
}) as any as S.Schema<PutMessagingStreamingConfigurationsResponse>;
export interface SearchChannelsResponse {
  Channels?: ChannelSummary[];
  NextToken?: string | redacted.Redacted<string>;
}
export const SearchChannelsResponse = S.suspend(() =>
  S.Struct({
    Channels: S.optional(ChannelSummaryList),
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "SearchChannelsResponse",
}) as any as S.Schema<SearchChannelsResponse>;
export interface SendChannelMessageRequest {
  ChannelArn: string;
  Content: string | redacted.Redacted<string>;
  Type: ChannelMessageType;
  Persistence: ChannelMessagePersistenceType;
  Metadata?: string | redacted.Redacted<string>;
  ClientRequestToken: string | redacted.Redacted<string>;
  ChimeBearer: string;
  PushNotification?: PushNotificationConfiguration;
  MessageAttributes?: { [key: string]: MessageAttributeValue | undefined };
  SubChannelId?: string;
  ContentType?: string | redacted.Redacted<string>;
  Target?: Target[];
}
export const SendChannelMessageRequest = S.suspend(() =>
  S.Struct({
    ChannelArn: S.String.pipe(T.HttpLabel("ChannelArn")),
    Content: SensitiveString,
    Type: ChannelMessageType,
    Persistence: ChannelMessagePersistenceType,
    Metadata: S.optional(SensitiveString),
    ClientRequestToken: SensitiveString.pipe(T.IdempotencyToken()),
    ChimeBearer: S.String.pipe(T.HttpHeader("x-amz-chime-bearer")),
    PushNotification: S.optional(PushNotificationConfiguration),
    MessageAttributes: S.optional(MessageAttributeMap),
    SubChannelId: S.optional(S.String),
    ContentType: S.optional(SensitiveString),
    Target: S.optional(TargetList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channels/{ChannelArn}/messages" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendChannelMessageRequest",
}) as any as S.Schema<SendChannelMessageRequest>;
export interface CreateChannelFlowRequest {
  AppInstanceArn: string;
  Processors: Processor[];
  Name: string | redacted.Redacted<string>;
  Tags?: Tag[];
  ClientRequestToken: string | redacted.Redacted<string>;
}
export const CreateChannelFlowRequest = S.suspend(() =>
  S.Struct({
    AppInstanceArn: S.String,
    Processors: ProcessorList,
    Name: SensitiveString,
    Tags: S.optional(TagList),
    ClientRequestToken: SensitiveString.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channel-flows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelFlowRequest",
}) as any as S.Schema<CreateChannelFlowRequest>;
export interface DescribeChannelMembershipForAppInstanceUserResponse {
  ChannelMembership?: ChannelMembershipForAppInstanceUserSummary;
}
export const DescribeChannelMembershipForAppInstanceUserResponse = S.suspend(
  () =>
    S.Struct({
      ChannelMembership: S.optional(ChannelMembershipForAppInstanceUserSummary),
    }),
).annotations({
  identifier: "DescribeChannelMembershipForAppInstanceUserResponse",
}) as any as S.Schema<DescribeChannelMembershipForAppInstanceUserResponse>;
export interface PutChannelMembershipPreferencesResponse {
  ChannelArn?: string;
  Member?: Identity;
  Preferences?: ChannelMembershipPreferences;
}
export const PutChannelMembershipPreferencesResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    Member: S.optional(Identity),
    Preferences: S.optional(ChannelMembershipPreferences),
  }),
).annotations({
  identifier: "PutChannelMembershipPreferencesResponse",
}) as any as S.Schema<PutChannelMembershipPreferencesResponse>;
export interface SendChannelMessageResponse {
  ChannelArn?: string;
  MessageId?: string;
  Status?: ChannelMessageStatusStructure;
  SubChannelId?: string;
}
export const SendChannelMessageResponse = S.suspend(() =>
  S.Struct({
    ChannelArn: S.optional(S.String),
    MessageId: S.optional(S.String),
    Status: S.optional(ChannelMessageStatusStructure),
    SubChannelId: S.optional(S.String),
  }),
).annotations({
  identifier: "SendChannelMessageResponse",
}) as any as S.Schema<SendChannelMessageResponse>;
export interface CreateChannelFlowResponse {
  ChannelFlowArn?: string;
}
export const CreateChannelFlowResponse = S.suspend(() =>
  S.Struct({ ChannelFlowArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateChannelFlowResponse",
}) as any as S.Schema<CreateChannelFlowResponse>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Code: S.optional(ErrorCode), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Code: S.optional(ErrorCode), Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Code: S.optional(ErrorCode), Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  { Code: S.optional(ErrorCode), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Code: S.optional(ErrorCode), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceLimitExceededException extends S.TaggedError<ResourceLimitExceededException>()(
  "ResourceLimitExceededException",
  { Code: S.optional(ErrorCode), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Code: S.optional(ErrorCode), Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ThrottledClientException extends S.TaggedError<ThrottledClientException>()(
  "ThrottledClientException",
  { Code: S.optional(ErrorCode), Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class UnauthorizedClientException extends S.TaggedError<UnauthorizedClientException>()(
  "UnauthorizedClientException",
  { Code: S.optional(ErrorCode), Message: S.optional(S.String) },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Gets the membership preferences of an `AppInstanceUser` or `AppInstanceBot`
 * for the specified channel. A user or a bot must be a member of the channel and own the membership in order to retrieve membership preferences.
 * Users or bots in the `AppInstanceAdmin` and channel moderator roles can't
 * retrieve preferences for other users or bots. Banned users or bots can't retrieve membership preferences for the
 * channel from which they are banned.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const getChannelMembershipPreferences: (
  input: GetChannelMembershipPreferencesRequest,
) => effect.Effect<
  GetChannelMembershipPreferencesResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelMembershipPreferencesRequest,
  output: GetChannelMembershipPreferencesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Gets the full details of a channel message.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const getChannelMessage: (
  input: GetChannelMessageRequest,
) => effect.Effect<
  GetChannelMessageResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelMessageRequest,
  output: GetChannelMessageResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Sets the membership preferences of an `AppInstanceUser` or `AppInstanceBot`
 * for the specified channel. The user or bot must be a member of the channel. Only the user or bot who owns the
 * membership can set preferences. Users or bots in the `AppInstanceAdmin` and channel moderator roles can't set
 * preferences for other users. Banned users or bots can't set membership preferences for the channel from
 * which they are banned.
 *
 * The x-amz-chime-bearer request header is mandatory. Use the ARN of an
 * `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in the
 * header.
 */
export const putChannelMembershipPreferences: (
  input: PutChannelMembershipPreferencesRequest,
) => effect.Effect<
  PutChannelMembershipPreferencesResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutChannelMembershipPreferencesRequest,
  output: PutChannelMembershipPreferencesResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Sends a message to a particular channel that the member is a part of.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 *
 * Also, `STANDARD` messages can be up to 4KB in size and contain metadata. Metadata is arbitrary,
 * and you can use it in a variety of ways, such as containing a link to an attachment.
 *
 * `CONTROL` messages are limited to 30 bytes and do not contain metadata.
 */
export const sendChannelMessage: (
  input: SendChannelMessageRequest,
) => effect.Effect<
  SendChannelMessageResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendChannelMessageRequest,
  output: SendChannelMessageResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a new `ChannelModerator`. A channel moderator can:
 *
 * - Add and remove other members of the channel.
 *
 * - Add and remove other moderators of the channel.
 *
 * - Add and remove user bans for the channel.
 *
 * - Redact messages in the channel.
 *
 * - List messages in the channel.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot`of the user that makes the API call as the value in
 * the header.
 */
export const createChannelModerator: (
  input: CreateChannelModeratorRequest,
) => effect.Effect<
  CreateChannelModeratorResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelModeratorRequest,
  output: CreateChannelModeratorResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Gets message status for a specified `messageId`. Use this API to determine the intermediate status of messages going through channel flow processing. The API provides an alternative to
 * retrieving message status if the event was not received because a client wasn't connected to a websocket.
 *
 * Messages can have any one of these statuses.
 *
 * ### SENT
 *
 * Message processed successfully
 *
 * ### PENDING
 *
 * Ongoing processing
 *
 * ### FAILED
 *
 * Processing failed
 *
 * ### DENIED
 *
 * Message denied by the processor
 *
 * - This API does not return statuses for denied messages, because we don't store them once the processor denies them.
 *
 * - Only the message sender can invoke this API.
 *
 * - The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const getChannelMessageStatus: (
  input: GetChannelMessageStatusRequest,
) => effect.Effect<
  GetChannelMessageStatusResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelMessageStatusRequest,
  output: GetChannelMessageStatusResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * The details of the endpoint for the messaging session.
 */
export const getMessagingSessionEndpoint: (
  input: GetMessagingSessionEndpointRequest,
) => effect.Effect<
  GetMessagingSessionEndpointResponse,
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMessagingSessionEndpointRequest,
  output: GetMessagingSessionEndpointResponse,
  errors: [
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Lists all the users and bots banned from a particular channel.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const listChannelBans: {
  (
    input: ListChannelBansRequest,
  ): effect.Effect<
    ListChannelBansResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelBansRequest,
  ) => stream.Stream<
    ListChannelBansResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelBansRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelBansRequest,
  output: ListChannelBansResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a paginated lists of all the channel flows created under a single Chime. This is a developer API.
 */
export const listChannelFlows: {
  (
    input: ListChannelFlowsRequest,
  ): effect.Effect<
    ListChannelFlowsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelFlowsRequest,
  ) => stream.Stream<
    ListChannelFlowsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelFlowsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelFlowsRequest,
  output: ListChannelFlowsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all channel memberships in a channel.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 *
 * If you want to list the channels to which a specific app instance user belongs, see the
 * ListChannelMembershipsForAppInstanceUser API.
 */
export const listChannelMemberships: {
  (
    input: ListChannelMembershipsRequest,
  ): effect.Effect<
    ListChannelMembershipsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelMembershipsRequest,
  ) => stream.Stream<
    ListChannelMembershipsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelMembershipsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelMembershipsRequest,
  output: ListChannelMembershipsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all the messages in a channel. Returns a paginated list of
 * `ChannelMessages`. By default, sorted by creation timestamp in descending
 * order.
 *
 * Redacted messages appear in the results as empty, since they are only redacted, not
 * deleted. Deleted messages do not appear in the results. This action always returns the
 * latest version of an edited message.
 *
 * Also, the `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const listChannelMessages: {
  (
    input: ListChannelMessagesRequest,
  ): effect.Effect<
    ListChannelMessagesResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelMessagesRequest,
  ) => stream.Stream<
    ListChannelMessagesResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelMessagesRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelMessagesRequest,
  output: ListChannelMessagesResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the moderators for a channel.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const listChannelModerators: {
  (
    input: ListChannelModeratorsRequest,
  ): effect.Effect<
    ListChannelModeratorsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelModeratorsRequest,
  ) => stream.Stream<
    ListChannelModeratorsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelModeratorsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelModeratorsRequest,
  output: ListChannelModeratorsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all Channels created under a single Chime App as a paginated list. You can specify
 * filters to narrow results.
 *
 * **Functionality & restrictions**
 *
 * - Use privacy = `PUBLIC` to retrieve all public channels in the
 * account.
 *
 * - Only an `AppInstanceAdmin` can set privacy = `PRIVATE` to
 * list the private channels in an account.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const listChannels: {
  (
    input: ListChannelsRequest,
  ): effect.Effect<
    ListChannelsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelsRequest,
  ) => stream.Stream<
    ListChannelsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelsRequest,
  output: ListChannelsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all channels associated with a specified channel flow. You can associate a channel flow with multiple channels, but you can only associate a channel with one channel flow. This is a developer API.
 */
export const listChannelsAssociatedWithChannelFlow: {
  (
    input: ListChannelsAssociatedWithChannelFlowRequest,
  ): effect.Effect<
    ListChannelsAssociatedWithChannelFlowResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelsAssociatedWithChannelFlowRequest,
  ) => stream.Stream<
    ListChannelsAssociatedWithChannelFlowResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelsAssociatedWithChannelFlowRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelsAssociatedWithChannelFlowRequest,
  output: ListChannelsAssociatedWithChannelFlowResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the SubChannels in an elastic channel when given a channel ID. Available only to the app instance admins and channel moderators of elastic channels.
 */
export const listSubChannels: {
  (
    input: ListSubChannelsRequest,
  ): effect.Effect<
    ListSubChannelsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSubChannelsRequest,
  ) => stream.Stream<
    ListSubChannelsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSubChannelsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSubChannelsRequest,
  output: ListSubChannelsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Allows the `ChimeBearer` to search channels by channel members. Users or bots can search
 * across the channels that they belong to. Users in the `AppInstanceAdmin` role can search across
 * all channels.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 *
 * This operation isn't supported for `AppInstanceUsers` with a large number of memberships.
 */
export const searchChannels: {
  (
    input: SearchChannelsRequest,
  ): effect.Effect<
    SearchChannelsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchChannelsRequest,
  ) => stream.Stream<
    SearchChannelsResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchChannelsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchChannelsRequest,
  output: SearchChannelsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Sets the number of days before the channel is automatically deleted.
 *
 * - A background process deletes expired channels within 6 hours of expiration.
 * Actual deletion times may vary.
 *
 * - Expired channels that have not yet been deleted appear as active, and you can update
 * their expiration settings. The system honors the new settings.
 *
 * - The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const putChannelExpirationSettings: (
  input: PutChannelExpirationSettingsRequest,
) => effect.Effect<
  PutChannelExpirationSettingsResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutChannelExpirationSettingsRequest,
  output: PutChannelExpirationSettingsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Redacts message content and metadata. The message exists in the back end, but the
 * action returns null content, and the state shows as redacted.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const redactChannelMessage: (
  input: RedactChannelMessageRequest,
) => effect.Effect<
  RedactChannelMessageResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RedactChannelMessageRequest,
  output: RedactChannelMessageResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Update a channel's attributes.
 *
 * **Restriction**: You can't change a channel's privacy.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const updateChannel: (
  input: UpdateChannelRequest,
) => effect.Effect<
  UpdateChannelResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelRequest,
  output: UpdateChannelResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates channel flow attributes. This is a developer API.
 */
export const updateChannelFlow: (
  input: UpdateChannelFlowRequest,
) => effect.Effect<
  UpdateChannelFlowResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelFlowRequest,
  output: UpdateChannelFlowResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Updates the content of a message.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const updateChannelMessage: (
  input: UpdateChannelMessageRequest,
) => effect.Effect<
  UpdateChannelMessageResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelMessageRequest,
  output: UpdateChannelMessageResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * The details of the time when a user last read messages in a channel.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const updateChannelReadMarker: (
  input: UpdateChannelReadMarkerRequest,
) => effect.Effect<
  UpdateChannelReadMarkerResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelReadMarkerRequest,
  output: UpdateChannelReadMarkerResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Immediately makes a channel and its memberships inaccessible and marks them for
 * deletion. This is an irreversible process.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUserArn` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const deleteChannel: (
  input: DeleteChannelRequest,
) => effect.Effect<
  DeleteChannelResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelRequest,
  output: DeleteChannelResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes a channel flow, an irreversible process. This is a developer API.
 *
 * This API works only when the channel flow is not associated with any channel. To get a list of all channels that a channel flow is associated with, use the
 * `ListChannelsAssociatedWithChannelFlow` API. Use the `DisassociateChannelFlow` API to disassociate a channel flow from all channels.
 */
export const deleteChannelFlow: (
  input: DeleteChannelFlowRequest,
) => effect.Effect<
  DeleteChannelFlowResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelFlowRequest,
  output: DeleteChannelFlowResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Removes a member from a channel.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * `AppInstanceUserArn` of the user that makes the API call as the value in
 * the header.
 */
export const deleteChannelMembership: (
  input: DeleteChannelMembershipRequest,
) => effect.Effect<
  DeleteChannelMembershipResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelMembershipRequest,
  output: DeleteChannelMembershipResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Lists all channels that an `AppInstanceUser` or `AppInstanceBot` is a part of.
 * Only an `AppInstanceAdmin` can call the API with a user ARN that is not their own.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const listChannelMembershipsForAppInstanceUser: {
  (
    input: ListChannelMembershipsForAppInstanceUserRequest,
  ): effect.Effect<
    ListChannelMembershipsForAppInstanceUserResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelMembershipsForAppInstanceUserRequest,
  ) => stream.Stream<
    ListChannelMembershipsForAppInstanceUserResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelMembershipsForAppInstanceUserRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelMembershipsForAppInstanceUserRequest,
  output: ListChannelMembershipsForAppInstanceUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * A list of the channels moderated by an `AppInstanceUser`.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const listChannelsModeratedByAppInstanceUser: {
  (
    input: ListChannelsModeratedByAppInstanceUserRequest,
  ): effect.Effect<
    ListChannelsModeratedByAppInstanceUserResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelsModeratedByAppInstanceUserRequest,
  ) => stream.Stream<
    ListChannelsModeratedByAppInstanceUserResponse,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelsModeratedByAppInstanceUserRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ForbiddenException
    | ServiceFailureException
    | ServiceUnavailableException
    | ThrottledClientException
    | UnauthorizedClientException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelsModeratedByAppInstanceUserRequest,
  output: ListChannelsModeratedByAppInstanceUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the tags applied to an Amazon Chime SDK messaging resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Removes a member from a channel's ban list.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const deleteChannelBan: (
  input: DeleteChannelBanRequest,
) => effect.Effect<
  DeleteChannelBanResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelBanRequest,
  output: DeleteChannelBanResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes a channel message. Only admins can perform this action. Deletion makes messages
 * inaccessible immediately. A background process deletes any revisions created by
 * `UpdateChannelMessage`.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const deleteChannelMessage: (
  input: DeleteChannelMessageRequest,
) => effect.Effect<
  DeleteChannelMessageResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelMessageRequest,
  output: DeleteChannelMessageResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes a channel moderator.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const deleteChannelModerator: (
  input: DeleteChannelModeratorRequest,
) => effect.Effect<
  DeleteChannelModeratorResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelModeratorRequest,
  output: DeleteChannelModeratorResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Deletes the streaming configurations for an `AppInstance`. For more information, see
 * Streaming messaging data in the *Amazon Chime SDK Developer Guide*.
 */
export const deleteMessagingStreamingConfigurations: (
  input: DeleteMessagingStreamingConfigurationsRequest,
) => effect.Effect<
  DeleteMessagingStreamingConfigurationsResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMessagingStreamingConfigurationsRequest,
  output: DeleteMessagingStreamingConfigurationsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Removes the specified tags from the specified Amazon Chime SDK messaging resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Calls back Amazon Chime SDK messaging with a processing response message. This should be invoked from the processor Lambda. This is a developer API.
 *
 * You can return one of the following processing responses:
 *
 * - Update message content or metadata
 *
 * - Deny a message
 *
 * - Make no changes to the message
 */
export const channelFlowCallback: (
  input: ChannelFlowCallbackRequest,
) => effect.Effect<
  ChannelFlowCallbackResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ChannelFlowCallbackRequest,
  output: ChannelFlowCallbackResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns the full details of a channel in an Amazon Chime
 * `AppInstance`.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const describeChannel: (
  input: DescribeChannelRequest,
) => effect.Effect<
  DescribeChannelResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelRequest,
  output: DescribeChannelResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns the full details of a channel flow in an Amazon Chime `AppInstance`. This is a developer API.
 */
export const describeChannelFlow: (
  input: DescribeChannelFlowRequest,
) => effect.Effect<
  DescribeChannelFlowResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelFlowRequest,
  output: DescribeChannelFlowResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns the full details of a channel moderated by the specified
 * `AppInstanceUser` or `AppInstanceBot`.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const describeChannelModeratedByAppInstanceUser: (
  input: DescribeChannelModeratedByAppInstanceUserRequest,
) => effect.Effect<
  DescribeChannelModeratedByAppInstanceUserResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelModeratedByAppInstanceUserRequest,
  output: DescribeChannelModeratedByAppInstanceUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns the details of a channel based on the membership of the specified
 * `AppInstanceUser` or `AppInstanceBot`.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const describeChannelMembershipForAppInstanceUser: (
  input: DescribeChannelMembershipForAppInstanceUserRequest,
) => effect.Effect<
  DescribeChannelMembershipForAppInstanceUserResponse,
  | BadRequestException
  | ForbiddenException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelMembershipForAppInstanceUserRequest,
  output: DescribeChannelMembershipForAppInstanceUserResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Sets the data streaming configuration for an `AppInstance`. For more information, see
 * Streaming messaging data in the *Amazon Chime SDK Developer Guide*.
 */
export const putMessagingStreamingConfigurations: (
  input: PutMessagingStreamingConfigurationsRequest,
) => effect.Effect<
  PutMessagingStreamingConfigurationsResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMessagingStreamingConfigurationsRequest,
  output: PutMessagingStreamingConfigurationsResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Adds a member to a channel. The `InvitedBy` field in `ChannelMembership`
 * is derived from the request header. A channel member can:
 *
 * - List messages
 *
 * - Send messages
 *
 * - Receive messages
 *
 * - Edit their own messages
 *
 * - Leave the channel
 *
 * Privacy settings impact this action as follows:
 *
 * - Public Channels: You do not need to be a member to list messages, but you must be
 * a member to send messages.
 *
 * - Private Channels: You must be a member to list or send messages.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUserArn` or `AppInstanceBot` that makes the API call
 * as the value in the header.
 */
export const createChannelMembership: (
  input: CreateChannelMembershipRequest,
) => effect.Effect<
  CreateChannelMembershipResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelMembershipRequest,
  output: CreateChannelMembershipResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Disassociates a channel flow from all its channels. Once disassociated, all messages to
 * that channel stop going through the channel flow processor.
 *
 * Only administrators or channel moderators can disassociate a channel flow.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const disassociateChannelFlow: (
  input: DisassociateChannelFlowRequest,
) => effect.Effect<
  DisassociateChannelFlowResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateChannelFlowRequest,
  output: DisassociateChannelFlowResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Retrieves the data streaming configuration for an `AppInstance`. For more information, see
 * Streaming messaging data in the *Amazon Chime SDK Developer Guide*.
 */
export const getMessagingStreamingConfigurations: (
  input: GetMessagingStreamingConfigurationsRequest,
) => effect.Effect<
  GetMessagingStreamingConfigurationsResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMessagingStreamingConfigurationsRequest,
  output: GetMessagingStreamingConfigurationsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Associates a channel flow with a channel. Once associated, all messages to that channel go through channel flow processors. To stop processing, use the
 * `DisassociateChannelFlow` API.
 *
 * Only administrators or channel moderators can associate a channel flow. The
 * `x-amz-chime-bearer` request header is mandatory. Use the ARN of the
 * `AppInstanceUser` or `AppInstanceBot`
 * that makes the API call as the value in the header.
 */
export const associateChannelFlow: (
  input: AssociateChannelFlowRequest,
) => effect.Effect<
  AssociateChannelFlowResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateChannelFlowRequest,
  output: AssociateChannelFlowResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Adds a specified number of users and bots to a channel.
 */
export const batchCreateChannelMembership: (
  input: BatchCreateChannelMembershipRequest,
) => effect.Effect<
  BatchCreateChannelMembershipResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateChannelMembershipRequest,
  output: BatchCreateChannelMembershipResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns the full details of a channel ban.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const describeChannelBan: (
  input: DescribeChannelBanRequest,
) => effect.Effect<
  DescribeChannelBanResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelBanRequest,
  output: DescribeChannelBanResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns the full details of a user's channel membership.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const describeChannelMembership: (
  input: DescribeChannelMembershipRequest,
) => effect.Effect<
  DescribeChannelMembershipResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelMembershipRequest,
  output: DescribeChannelMembershipResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Returns the full details of a single ChannelModerator.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * `AppInstanceUserArn` of the user that makes the API call as the value in
 * the header.
 */
export const describeChannelModerator: (
  input: DescribeChannelModeratorRequest,
) => effect.Effect<
  DescribeChannelModeratorResponse,
  | BadRequestException
  | ForbiddenException
  | NotFoundException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelModeratorRequest,
  output: DescribeChannelModeratorResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    NotFoundException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Applies the specified tags to the specified Amazon Chime SDK messaging resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a channel to which you can add users and send messages.
 *
 * **Restriction**: You can't change a channel's
 * privacy.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const createChannel: (
  input: CreateChannelRequest,
) => effect.Effect<
  CreateChannelResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelRequest,
  output: CreateChannelResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Permanently bans a member from a channel. Moderators can't add banned members to a
 * channel. To undo a ban, you first have to `DeleteChannelBan`, and then
 * `CreateChannelMembership`. Bans are cleaned up when you delete users or
 * channels.
 *
 * If you ban a user who is already part of a channel, that user is automatically kicked
 * from the channel.
 *
 * The `x-amz-chime-bearer` request header is mandatory. Use the
 * ARN of the `AppInstanceUser` or `AppInstanceBot` that makes the API call as the value in
 * the header.
 */
export const createChannelBan: (
  input: CreateChannelBanRequest,
) => effect.Effect<
  CreateChannelBanResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelBanRequest,
  output: CreateChannelBanResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));
/**
 * Creates a channel flow, a container for processors. Processors are AWS Lambda functions
 * that perform actions on chat messages, such as stripping out profanity. You can associate
 * channel flows with channels, and the processors in the channel flow then take action on all
 * messages sent to that channel. This is a developer API.
 *
 * Channel flows process the following items:
 *
 * - New and updated messages
 *
 * - Persistent and non-persistent messages
 *
 * - The Standard message type
 *
 * Channel flows don't process Control or System messages. For more information about the message types provided by Chime SDK messaging, refer to
 * Message types in the *Amazon Chime developer guide*.
 */
export const createChannelFlow: (
  input: CreateChannelFlowRequest,
) => effect.Effect<
  CreateChannelFlowResponse,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | ResourceLimitExceededException
  | ServiceFailureException
  | ServiceUnavailableException
  | ThrottledClientException
  | UnauthorizedClientException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelFlowRequest,
  output: CreateChannelFlowResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    ResourceLimitExceededException,
    ServiceFailureException,
    ServiceUnavailableException,
    ThrottledClientException,
    UnauthorizedClientException,
  ],
}));

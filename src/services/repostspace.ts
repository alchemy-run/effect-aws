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
  sdkId: "repostspace",
  serviceShapeName: "RepostSpace",
});
const auth = T.AwsAuthSigv4({ name: "repostspace" });
const ver = T.ServiceVersion("2022-05-13");
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
              `https://repostspace-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://repostspace-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://repostspace.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://repostspace.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type SpaceId = string;
export type ChannelId = string;
export type AccessorId = string;
export type ChannelName = string | Redacted.Redacted<string>;
export type ChannelDescription = string | Redacted.Redacted<string>;
export type SpaceName = string | Redacted.Redacted<string>;
export type SpaceSubdomain = string;
export type SpaceDescription = string | Redacted.Redacted<string>;
export type KMSKey = string;
export type Arn = string;
export type AdminId = string;
export type ListChannelsLimit = number;
export type ListSpacesLimit = number;
export type InviteTitle = string | Redacted.Redacted<string>;
export type InviteBody = string | Redacted.Redacted<string>;
export type TagKey = string;
export type TagValue = string;
export type EmailDomain = string | Redacted.Redacted<string>;
export type ProvisioningStatus = string;
export type ClientId = string;
export type IdentityStoreId = string;
export type Url = string;
export type StorageLimit = number;
export type UserCount = number;
export type ContentSize = number;
export type ErrorCode = number;
export type ErrorMessage = string;
export type GroupCount = number;

//# Schemas
export type AccessorIdList = string[];
export const AccessorIdList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface BatchAddChannelRoleToAccessorsInput {
  spaceId: string;
  channelId: string;
  accessorIds: AccessorIdList;
  channelRole: string;
}
export const BatchAddChannelRoleToAccessorsInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    channelId: S.String.pipe(T.HttpLabel("channelId")),
    accessorIds: AccessorIdList,
    channelRole: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/spaces/{spaceId}/channels/{channelId}/roles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchAddChannelRoleToAccessorsInput",
}) as any as S.Schema<BatchAddChannelRoleToAccessorsInput>;
export interface BatchAddRoleInput {
  spaceId: string;
  accessorIds: AccessorIdList;
  role: string;
}
export const BatchAddRoleInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    accessorIds: AccessorIdList,
    role: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/spaces/{spaceId}/roles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchAddRoleInput",
}) as any as S.Schema<BatchAddRoleInput>;
export interface BatchRemoveChannelRoleFromAccessorsInput {
  spaceId: string;
  channelId: string;
  accessorIds: AccessorIdList;
  channelRole: string;
}
export const BatchRemoveChannelRoleFromAccessorsInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    channelId: S.String.pipe(T.HttpLabel("channelId")),
    accessorIds: AccessorIdList,
    channelRole: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/spaces/{spaceId}/channels/{channelId}/roles",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchRemoveChannelRoleFromAccessorsInput",
}) as any as S.Schema<BatchRemoveChannelRoleFromAccessorsInput>;
export interface BatchRemoveRoleInput {
  spaceId: string;
  accessorIds: AccessorIdList;
  role: string;
}
export const BatchRemoveRoleInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    accessorIds: AccessorIdList,
    role: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/spaces/{spaceId}/roles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchRemoveRoleInput",
}) as any as S.Schema<BatchRemoveRoleInput>;
export interface CreateChannelInput {
  spaceId: string;
  channelName: string | Redacted.Redacted<string>;
  channelDescription?: string | Redacted.Redacted<string>;
}
export const CreateChannelInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    channelName: SensitiveString,
    channelDescription: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/spaces/{spaceId}/channels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChannelInput",
}) as any as S.Schema<CreateChannelInput>;
export interface DeleteSpaceInput {
  spaceId: string;
}
export const DeleteSpaceInput = S.suspend(() =>
  S.Struct({ spaceId: S.String.pipe(T.HttpLabel("spaceId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/spaces/{spaceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSpaceInput",
}) as any as S.Schema<DeleteSpaceInput>;
export interface DeleteSpaceResponse {}
export const DeleteSpaceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteSpaceResponse",
}) as any as S.Schema<DeleteSpaceResponse>;
export interface DeregisterAdminInput {
  spaceId: string;
  adminId: string;
}
export const DeregisterAdminInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    adminId: S.String.pipe(T.HttpLabel("adminId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/spaces/{spaceId}/admins/{adminId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterAdminInput",
}) as any as S.Schema<DeregisterAdminInput>;
export interface DeregisterAdminResponse {}
export const DeregisterAdminResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterAdminResponse",
}) as any as S.Schema<DeregisterAdminResponse>;
export interface GetChannelInput {
  spaceId: string;
  channelId: string;
}
export const GetChannelInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    channelId: S.String.pipe(T.HttpLabel("channelId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/spaces/{spaceId}/channels/{channelId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChannelInput",
}) as any as S.Schema<GetChannelInput>;
export interface GetSpaceInput {
  spaceId: string;
}
export const GetSpaceInput = S.suspend(() =>
  S.Struct({ spaceId: S.String.pipe(T.HttpLabel("spaceId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/spaces/{spaceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSpaceInput",
}) as any as S.Schema<GetSpaceInput>;
export interface ListChannelsInput {
  spaceId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListChannelsInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/spaces/{spaceId}/channels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChannelsInput",
}) as any as S.Schema<ListChannelsInput>;
export interface ListSpacesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListSpacesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/spaces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSpacesInput",
}) as any as S.Schema<ListSpacesInput>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface RegisterAdminInput {
  spaceId: string;
  adminId: string;
}
export const RegisterAdminInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    adminId: S.String.pipe(T.HttpLabel("adminId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/spaces/{spaceId}/admins/{adminId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterAdminInput",
}) as any as S.Schema<RegisterAdminInput>;
export interface RegisterAdminResponse {}
export const RegisterAdminResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "RegisterAdminResponse",
}) as any as S.Schema<RegisterAdminResponse>;
export interface SendInvitesInput {
  spaceId: string;
  accessorIds: AccessorIdList;
  title: string | Redacted.Redacted<string>;
  body: string | Redacted.Redacted<string>;
}
export const SendInvitesInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    accessorIds: AccessorIdList,
    title: SensitiveString,
    body: SensitiveString,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/spaces/{spaceId}/invite" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendInvitesInput",
}) as any as S.Schema<SendInvitesInput>;
export interface SendInvitesResponse {}
export const SendInvitesResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "SendInvitesResponse",
}) as any as S.Schema<SendInvitesResponse>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export interface UpdateChannelInput {
  spaceId: string;
  channelId: string;
  channelName: string | Redacted.Redacted<string>;
  channelDescription?: string | Redacted.Redacted<string>;
}
export const UpdateChannelInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    channelId: S.String.pipe(T.HttpLabel("channelId")),
    channelName: SensitiveString,
    channelDescription: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/spaces/{spaceId}/channels/{channelId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateChannelInput",
}) as any as S.Schema<UpdateChannelInput>;
export interface UpdateChannelOutput {}
export const UpdateChannelOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateChannelOutput",
}) as any as S.Schema<UpdateChannelOutput>;
export type AllowedDomainsList = string | Redacted.Redacted<string>[];
export const AllowedDomainsList = S.Array(SensitiveString);
export interface SupportedEmailDomainsParameters {
  enabled?: string;
  allowedDomains?: AllowedDomainsList;
}
export const SupportedEmailDomainsParameters = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.String),
    allowedDomains: S.optional(AllowedDomainsList),
  }),
).annotations({
  identifier: "SupportedEmailDomainsParameters",
}) as any as S.Schema<SupportedEmailDomainsParameters>;
export interface UpdateSpaceInput {
  spaceId: string;
  description?: string | Redacted.Redacted<string>;
  tier?: string;
  roleArn?: string;
  supportedEmailDomains?: SupportedEmailDomainsParameters;
}
export const UpdateSpaceInput = S.suspend(() =>
  S.Struct({
    spaceId: S.String.pipe(T.HttpLabel("spaceId")),
    description: S.optional(SensitiveString),
    tier: S.optional(S.String),
    roleArn: S.optional(S.String),
    supportedEmailDomains: S.optional(SupportedEmailDomainsParameters),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/spaces/{spaceId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSpaceInput",
}) as any as S.Schema<UpdateSpaceInput>;
export interface UpdateSpaceResponse {}
export const UpdateSpaceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateSpaceResponse",
}) as any as S.Schema<UpdateSpaceResponse>;
export type UserAdmins = string[];
export const UserAdmins = S.Array(S.String);
export type GroupAdmins = string[];
export const GroupAdmins = S.Array(S.String);
export interface BatchError {
  accessorId: string;
  error: number;
  message: string;
}
export const BatchError = S.suspend(() =>
  S.Struct({ accessorId: S.String, error: S.Number, message: S.String }),
).annotations({ identifier: "BatchError" }) as any as S.Schema<BatchError>;
export type BatchErrorList = BatchError[];
export const BatchErrorList = S.Array(BatchError);
export interface BatchAddRoleOutput {
  addedAccessorIds: AccessorIdList;
  errors: BatchErrorList;
}
export const BatchAddRoleOutput = S.suspend(() =>
  S.Struct({ addedAccessorIds: AccessorIdList, errors: BatchErrorList }),
).annotations({
  identifier: "BatchAddRoleOutput",
}) as any as S.Schema<BatchAddRoleOutput>;
export interface BatchRemoveChannelRoleFromAccessorsOutput {
  removedAccessorIds: AccessorIdList;
  errors: BatchErrorList;
}
export const BatchRemoveChannelRoleFromAccessorsOutput = S.suspend(() =>
  S.Struct({ removedAccessorIds: AccessorIdList, errors: BatchErrorList }),
).annotations({
  identifier: "BatchRemoveChannelRoleFromAccessorsOutput",
}) as any as S.Schema<BatchRemoveChannelRoleFromAccessorsOutput>;
export interface BatchRemoveRoleOutput {
  removedAccessorIds: AccessorIdList;
  errors: BatchErrorList;
}
export const BatchRemoveRoleOutput = S.suspend(() =>
  S.Struct({ removedAccessorIds: AccessorIdList, errors: BatchErrorList }),
).annotations({
  identifier: "BatchRemoveRoleOutput",
}) as any as S.Schema<BatchRemoveRoleOutput>;
export interface CreateChannelOutput {
  channelId: string;
}
export const CreateChannelOutput = S.suspend(() =>
  S.Struct({ channelId: S.String }),
).annotations({
  identifier: "CreateChannelOutput",
}) as any as S.Schema<CreateChannelOutput>;
export interface CreateSpaceInput {
  name: string | Redacted.Redacted<string>;
  subdomain: string;
  tier: string;
  description?: string | Redacted.Redacted<string>;
  userKMSKey?: string;
  tags?: Tags;
  roleArn?: string;
  supportedEmailDomains?: SupportedEmailDomainsParameters;
}
export const CreateSpaceInput = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    subdomain: S.String,
    tier: S.String,
    description: S.optional(SensitiveString),
    userKMSKey: S.optional(S.String),
    tags: S.optional(Tags),
    roleArn: S.optional(S.String),
    supportedEmailDomains: S.optional(SupportedEmailDomainsParameters),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/spaces" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSpaceInput",
}) as any as S.Schema<CreateSpaceInput>;
export interface ListTagsForResourceResponse {
  tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export type ChannelRoleList = string[];
export const ChannelRoleList = S.Array(S.String);
export type RoleList = string[];
export const RoleList = S.Array(S.String);
export type ChannelRoles = { [key: string]: ChannelRoleList };
export const ChannelRoles = S.Record({ key: S.String, value: ChannelRoleList });
export type Roles = { [key: string]: RoleList };
export const Roles = S.Record({ key: S.String, value: RoleList });
export interface SupportedEmailDomainsStatus {
  enabled?: string;
  allowedDomains?: AllowedDomainsList;
}
export const SupportedEmailDomainsStatus = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.String),
    allowedDomains: S.optional(AllowedDomainsList),
  }),
).annotations({
  identifier: "SupportedEmailDomainsStatus",
}) as any as S.Schema<SupportedEmailDomainsStatus>;
export interface ChannelData {
  spaceId: string;
  channelId: string;
  channelName: string | Redacted.Redacted<string>;
  channelDescription?: string | Redacted.Redacted<string>;
  createDateTime: Date;
  deleteDateTime?: Date;
  channelStatus: string;
  userCount: number;
  groupCount: number;
}
export const ChannelData = S.suspend(() =>
  S.Struct({
    spaceId: S.String,
    channelId: S.String,
    channelName: SensitiveString,
    channelDescription: S.optional(SensitiveString),
    createDateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    deleteDateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    channelStatus: S.String,
    userCount: S.Number,
    groupCount: S.Number,
  }),
).annotations({ identifier: "ChannelData" }) as any as S.Schema<ChannelData>;
export type ChannelsList = ChannelData[];
export const ChannelsList = S.Array(ChannelData);
export interface SpaceData {
  spaceId: string;
  arn: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  status: string;
  configurationStatus: string;
  vanityDomainStatus: string;
  vanityDomain: string;
  randomDomain: string;
  tier: string;
  storageLimit: number;
  createDateTime: Date;
  deleteDateTime?: Date;
  userKMSKey?: string;
  userCount?: number;
  contentSize?: number;
  supportedEmailDomains?: SupportedEmailDomainsStatus;
}
export const SpaceData = S.suspend(() =>
  S.Struct({
    spaceId: S.String,
    arn: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    status: S.String,
    configurationStatus: S.String,
    vanityDomainStatus: S.String,
    vanityDomain: S.String,
    randomDomain: S.String,
    tier: S.String,
    storageLimit: S.Number,
    createDateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    deleteDateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    userKMSKey: S.optional(S.String),
    userCount: S.optional(S.Number),
    contentSize: S.optional(S.Number),
    supportedEmailDomains: S.optional(SupportedEmailDomainsStatus),
  }),
).annotations({ identifier: "SpaceData" }) as any as S.Schema<SpaceData>;
export type SpacesList = SpaceData[];
export const SpacesList = S.Array(SpaceData);
export interface BatchAddChannelRoleToAccessorsOutput {
  addedAccessorIds: AccessorIdList;
  errors: BatchErrorList;
}
export const BatchAddChannelRoleToAccessorsOutput = S.suspend(() =>
  S.Struct({ addedAccessorIds: AccessorIdList, errors: BatchErrorList }),
).annotations({
  identifier: "BatchAddChannelRoleToAccessorsOutput",
}) as any as S.Schema<BatchAddChannelRoleToAccessorsOutput>;
export interface CreateSpaceOutput {
  spaceId: string;
}
export const CreateSpaceOutput = S.suspend(() =>
  S.Struct({ spaceId: S.String }),
).annotations({
  identifier: "CreateSpaceOutput",
}) as any as S.Schema<CreateSpaceOutput>;
export interface GetChannelOutput {
  spaceId: string;
  channelId: string;
  channelName: string | Redacted.Redacted<string>;
  channelDescription?: string | Redacted.Redacted<string>;
  createDateTime: Date;
  deleteDateTime?: Date;
  channelRoles?: ChannelRoles;
  channelStatus: string;
}
export const GetChannelOutput = S.suspend(() =>
  S.Struct({
    spaceId: S.String,
    channelId: S.String,
    channelName: SensitiveString,
    channelDescription: S.optional(SensitiveString),
    createDateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    deleteDateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    channelRoles: S.optional(ChannelRoles),
    channelStatus: S.String,
  }),
).annotations({
  identifier: "GetChannelOutput",
}) as any as S.Schema<GetChannelOutput>;
export interface GetSpaceOutput {
  spaceId: string;
  arn: string;
  name: string | Redacted.Redacted<string>;
  status: string;
  configurationStatus: string;
  clientId: string;
  identityStoreId?: string;
  applicationArn?: string;
  description?: string | Redacted.Redacted<string>;
  vanityDomainStatus: string;
  vanityDomain: string;
  randomDomain: string;
  customerRoleArn?: string;
  createDateTime: Date;
  deleteDateTime?: Date;
  tier: string;
  storageLimit: number;
  userAdmins?: UserAdmins;
  groupAdmins?: GroupAdmins;
  roles?: Roles;
  userKMSKey?: string;
  userCount?: number;
  contentSize?: number;
  supportedEmailDomains?: SupportedEmailDomainsStatus;
}
export const GetSpaceOutput = S.suspend(() =>
  S.Struct({
    spaceId: S.String,
    arn: S.String,
    name: SensitiveString,
    status: S.String,
    configurationStatus: S.String,
    clientId: S.String,
    identityStoreId: S.optional(S.String),
    applicationArn: S.optional(S.String),
    description: S.optional(SensitiveString),
    vanityDomainStatus: S.String,
    vanityDomain: S.String,
    randomDomain: S.String,
    customerRoleArn: S.optional(S.String),
    createDateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    deleteDateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    tier: S.String,
    storageLimit: S.Number,
    userAdmins: S.optional(UserAdmins),
    groupAdmins: S.optional(GroupAdmins),
    roles: S.optional(Roles),
    userKMSKey: S.optional(S.String),
    userCount: S.optional(S.Number),
    contentSize: S.optional(S.Number),
    supportedEmailDomains: S.optional(SupportedEmailDomainsStatus),
  }),
).annotations({
  identifier: "GetSpaceOutput",
}) as any as S.Schema<GetSpaceOutput>;
export interface ListChannelsOutput {
  channels: ChannelsList;
  nextToken?: string;
}
export const ListChannelsOutput = S.suspend(() =>
  S.Struct({ channels: ChannelsList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListChannelsOutput",
}) as any as S.Schema<ListChannelsOutput>;
export interface ListSpacesOutput {
  spaces: SpacesList;
  nextToken?: string;
}
export const ListSpacesOutput = S.suspend(() =>
  S.Struct({ spaces: SpacesList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSpacesOutput",
}) as any as S.Schema<ListSpacesOutput>;
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

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns the list of channel within a private re:Post with some information about each channel.
 */
export const listChannels: {
  (
    input: ListChannelsInput,
  ): Effect.Effect<
    ListChannelsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChannelsInput,
  ) => Stream.Stream<
    ListChannelsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChannelsInput,
  ) => Stream.Stream<
    ChannelData,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChannelsInput,
  output: ListChannelsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "channels",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Displays information about a channel in a private re:Post.
 */
export const getChannel: (
  input: GetChannelInput,
) => Effect.Effect<
  GetChannelOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChannelInput,
  output: GetChannelOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Displays information about the AWS re:Post Private private re:Post.
 */
export const getSpace: (
  input: GetSpaceInput,
) => Effect.Effect<
  GetSpaceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSpaceInput,
  output: GetSpaceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Modifies an existing channel.
 */
export const updateChannel: (
  input: UpdateChannelInput,
) => Effect.Effect<
  UpdateChannelOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelInput,
  output: UpdateChannelOutput,
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
 * Returns the tags that are associated with the AWS re:Post Private resource specified by the resourceArn. The only resource that can be tagged is a private re:Post.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the user or group from the list of administrators of the private re:Post.
 */
export const deregisterAdmin: (
  input: DeregisterAdminInput,
) => Effect.Effect<
  DeregisterAdminResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterAdminInput,
  output: DeregisterAdminResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a user or group to the list of administrators of the private re:Post.
 */
export const registerAdmin: (
  input: RegisterAdminInput,
) => Effect.Effect<
  RegisterAdminResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterAdminInput,
  output: RegisterAdminResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends an invitation email to selected users and groups.
 */
export const sendInvites: (
  input: SendInvitesInput,
) => Effect.Effect<
  SendInvitesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendInvitesInput,
  output: SendInvitesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates tags with an AWS re:Post Private resource. Currently, the only resource that can be tagged is the private re:Post. If you specify a new tag key for the resource, the tag is appended to the list of tags that are associated with the resource. If you specify a tag key that’s already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the association of the tag with the AWS re:Post Private resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Add a role to multiple users or groups in a private re:Post.
 */
export const batchAddRole: (
  input: BatchAddRoleInput,
) => Effect.Effect<
  BatchAddRoleOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchAddRoleInput,
  output: BatchAddRoleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Remove a role from multiple users or groups in a private re:Post channel.
 */
export const batchRemoveChannelRoleFromAccessors: (
  input: BatchRemoveChannelRoleFromAccessorsInput,
) => Effect.Effect<
  BatchRemoveChannelRoleFromAccessorsOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchRemoveChannelRoleFromAccessorsInput,
  output: BatchRemoveChannelRoleFromAccessorsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Remove a role from multiple users or groups in a private re:Post.
 */
export const batchRemoveRole: (
  input: BatchRemoveRoleInput,
) => Effect.Effect<
  BatchRemoveRoleOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchRemoveRoleInput,
  output: BatchRemoveRoleOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Add role to multiple users or groups in a private re:Post channel.
 */
export const batchAddChannelRoleToAccessors: (
  input: BatchAddChannelRoleToAccessorsInput,
) => Effect.Effect<
  BatchAddChannelRoleToAccessorsOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchAddChannelRoleToAccessorsInput,
  output: BatchAddChannelRoleToAccessorsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Modifies an existing AWS re:Post Private private re:Post.
 */
export const updateSpace: (
  input: UpdateSpaceInput,
) => Effect.Effect<
  UpdateSpaceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSpaceInput,
  output: UpdateSpaceResponse,
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
 * Returns a list of AWS re:Post Private private re:Posts in the account with some information about each private re:Post.
 */
export const listSpaces: {
  (
    input: ListSpacesInput,
  ): Effect.Effect<
    ListSpacesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSpacesInput,
  ) => Stream.Stream<
    ListSpacesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSpacesInput,
  ) => Stream.Stream<
    SpaceData,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSpacesInput,
  output: ListSpacesOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "spaces",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes an AWS re:Post Private private re:Post.
 */
export const deleteSpace: (
  input: DeleteSpaceInput,
) => Effect.Effect<
  DeleteSpaceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSpaceInput,
  output: DeleteSpaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a channel in an AWS re:Post Private private re:Post.
 */
export const createChannel: (
  input: CreateChannelInput,
) => Effect.Effect<
  CreateChannelOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelInput,
  output: CreateChannelOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an AWS re:Post Private private re:Post.
 */
export const createSpace: (
  input: CreateSpaceInput,
) => Effect.Effect<
  CreateSpaceOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSpaceInput,
  output: CreateSpaceOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

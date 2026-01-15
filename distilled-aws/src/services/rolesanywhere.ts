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
  sdkId: "RolesAnywhere",
  serviceShapeName: "RolesAnywhere",
});
const auth = T.AwsAuthSigv4({ name: "rolesanywhere" });
const ver = T.ServiceVersion("2018-05-10");
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
              `https://rolesanywhere-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://rolesanywhere-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://rolesanywhere.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://rolesanywhere.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AmazonResourceName = string;
export type Uuid = string;
export type TagKey = string | redacted.Redacted<string>;
export type ResourceName = string;
export type TrustAnchorArn = string;
export type RoleArn = string;
export type CertificateField = string;
export type NotificationEvent = string;
export type NotificationChannel = string;
export type TagValue = string | redacted.Redacted<string>;
export type ProfileArn = string;
export type TrustAnchorType = string;

//# Schemas
export type TagKeyList = string | redacted.Redacted<string>[];
export const TagKeyList = S.Array(SensitiveString);
export type RoleArnList = string[];
export const RoleArnList = S.Array(S.String);
export type ManagedPolicyList = string[];
export const ManagedPolicyList = S.Array(S.String);
export interface MappingRule {
  specifier: string;
}
export const MappingRule = S.suspend(() =>
  S.Struct({ specifier: S.String }),
).annotations({ identifier: "MappingRule" }) as any as S.Schema<MappingRule>;
export type MappingRules = MappingRule[];
export const MappingRules = S.Array(MappingRule);
export interface AttributeMapping {
  certificateField?: string;
  mappingRules?: MappingRule[];
}
export const AttributeMapping = S.suspend(() =>
  S.Struct({
    certificateField: S.optional(S.String),
    mappingRules: S.optional(MappingRules),
  }),
).annotations({
  identifier: "AttributeMapping",
}) as any as S.Schema<AttributeMapping>;
export type AttributeMappings = AttributeMapping[];
export const AttributeMappings = S.Array(AttributeMapping);
export interface ProfileDetail {
  profileId?: string;
  profileArn?: string;
  name?: string;
  requireInstanceProperties?: boolean;
  enabled?: boolean;
  createdBy?: string;
  sessionPolicy?: string;
  roleArns?: string[];
  managedPolicyArns?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  durationSeconds?: number;
  acceptRoleSessionName?: boolean;
  attributeMappings?: AttributeMapping[];
}
export const ProfileDetail = S.suspend(() =>
  S.Struct({
    profileId: S.optional(S.String),
    profileArn: S.optional(S.String),
    name: S.optional(S.String),
    requireInstanceProperties: S.optional(S.Boolean),
    enabled: S.optional(S.Boolean),
    createdBy: S.optional(S.String),
    sessionPolicy: S.optional(S.String),
    roleArns: S.optional(RoleArnList),
    managedPolicyArns: S.optional(ManagedPolicyList),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    durationSeconds: S.optional(S.Number),
    acceptRoleSessionName: S.optional(S.Boolean),
    attributeMappings: S.optional(AttributeMappings),
  }),
).annotations({
  identifier: "ProfileDetail",
}) as any as S.Schema<ProfileDetail>;
export type ProfileDetails = ProfileDetail[];
export const ProfileDetails = S.Array(ProfileDetail);
export type SpecifierList = string[];
export const SpecifierList = S.Array(S.String);
export type SourceData =
  | { x509CertificateData: string; acmPcaArn?: never }
  | { x509CertificateData?: never; acmPcaArn: string };
export const SourceData = S.Union(
  S.Struct({ x509CertificateData: S.String }),
  S.Struct({ acmPcaArn: S.String }),
);
export interface Source {
  sourceType?: string;
  sourceData?: SourceData;
}
export const Source = S.suspend(() =>
  S.Struct({
    sourceType: S.optional(S.String),
    sourceData: S.optional(SourceData),
  }),
).annotations({ identifier: "Source" }) as any as S.Schema<Source>;
export interface NotificationSettingDetail {
  enabled: boolean;
  event: string;
  threshold?: number;
  channel?: string;
  configuredBy?: string;
}
export const NotificationSettingDetail = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    event: S.String,
    threshold: S.optional(S.Number),
    channel: S.optional(S.String),
    configuredBy: S.optional(S.String),
  }),
).annotations({
  identifier: "NotificationSettingDetail",
}) as any as S.Schema<NotificationSettingDetail>;
export type NotificationSettingDetails = NotificationSettingDetail[];
export const NotificationSettingDetails = S.Array(NotificationSettingDetail);
export interface TrustAnchorDetail {
  trustAnchorId?: string;
  trustAnchorArn?: string;
  name?: string;
  source?: Source;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  notificationSettings?: NotificationSettingDetail[];
}
export const TrustAnchorDetail = S.suspend(() =>
  S.Struct({
    trustAnchorId: S.optional(S.String),
    trustAnchorArn: S.optional(S.String),
    name: S.optional(S.String),
    source: S.optional(Source),
    enabled: S.optional(S.Boolean),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    notificationSettings: S.optional(NotificationSettingDetails),
  }),
).annotations({
  identifier: "TrustAnchorDetail",
}) as any as S.Schema<TrustAnchorDetail>;
export type TrustAnchorDetails = TrustAnchorDetail[];
export const TrustAnchorDetails = S.Array(TrustAnchorDetail);
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ListTagsForResource" }),
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
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string | redacted.Redacted<string>[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UntagResource" }),
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
export interface Tag {
  key: string | redacted.Redacted<string>;
  value: string | redacted.Redacted<string>;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: SensitiveString, value: SensitiveString }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface ImportCrlRequest {
  name: string;
  crlData: Uint8Array;
  enabled?: boolean;
  tags?: Tag[];
  trustAnchorArn: string;
}
export const ImportCrlRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    crlData: T.Blob,
    enabled: S.optional(S.Boolean),
    tags: S.optional(TagList),
    trustAnchorArn: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/crls" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportCrlRequest",
}) as any as S.Schema<ImportCrlRequest>;
export interface ScalarCrlRequest {
  crlId: string;
}
export const ScalarCrlRequest = S.suspend(() =>
  S.Struct({ crlId: S.String.pipe(T.HttpLabel("crlId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/crl/{crlId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ScalarCrlRequest",
}) as any as S.Schema<ScalarCrlRequest>;
export interface UpdateCrlRequest {
  crlId: string;
  name?: string;
  crlData?: Uint8Array;
}
export const UpdateCrlRequest = S.suspend(() =>
  S.Struct({
    crlId: S.String.pipe(T.HttpLabel("crlId")),
    name: S.optional(S.String),
    crlData: S.optional(T.Blob),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/crl/{crlId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCrlRequest",
}) as any as S.Schema<UpdateCrlRequest>;
export interface ListRequest {
  nextToken?: string;
  pageSize?: number;
}
export const ListRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    pageSize: S.optional(S.Number).pipe(T.HttpQuery("pageSize")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/trustanchors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "ListRequest" }) as any as S.Schema<ListRequest>;
export interface CreateProfileRequest {
  name: string;
  requireInstanceProperties?: boolean;
  sessionPolicy?: string;
  roleArns: string[];
  managedPolicyArns?: string[];
  durationSeconds?: number;
  enabled?: boolean;
  tags?: Tag[];
  acceptRoleSessionName?: boolean;
}
export const CreateProfileRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    requireInstanceProperties: S.optional(S.Boolean),
    sessionPolicy: S.optional(S.String),
    roleArns: RoleArnList,
    managedPolicyArns: S.optional(ManagedPolicyList),
    durationSeconds: S.optional(S.Number),
    enabled: S.optional(S.Boolean),
    tags: S.optional(TagList),
    acceptRoleSessionName: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProfileRequest",
}) as any as S.Schema<CreateProfileRequest>;
export interface ScalarProfileRequest {
  profileId: string;
}
export const ScalarProfileRequest = S.suspend(() =>
  S.Struct({ profileId: S.String.pipe(T.HttpLabel("profileId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/profile/{profileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ScalarProfileRequest",
}) as any as S.Schema<ScalarProfileRequest>;
export interface UpdateProfileRequest {
  profileId: string;
  name?: string;
  sessionPolicy?: string;
  roleArns?: string[];
  managedPolicyArns?: string[];
  durationSeconds?: number;
  acceptRoleSessionName?: boolean;
}
export const UpdateProfileRequest = S.suspend(() =>
  S.Struct({
    profileId: S.String.pipe(T.HttpLabel("profileId")),
    name: S.optional(S.String),
    sessionPolicy: S.optional(S.String),
    roleArns: S.optional(RoleArnList),
    managedPolicyArns: S.optional(ManagedPolicyList),
    durationSeconds: S.optional(S.Number),
    acceptRoleSessionName: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/profile/{profileId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProfileRequest",
}) as any as S.Schema<UpdateProfileRequest>;
export interface ListProfilesResponse {
  nextToken?: string;
  profiles?: ProfileDetail[];
}
export const ListProfilesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    profiles: S.optional(ProfileDetails),
  }),
).annotations({
  identifier: "ListProfilesResponse",
}) as any as S.Schema<ListProfilesResponse>;
export interface DeleteAttributeMappingRequest {
  profileId: string;
  certificateField: string;
  specifiers?: string[];
}
export const DeleteAttributeMappingRequest = S.suspend(() =>
  S.Struct({
    profileId: S.String.pipe(T.HttpLabel("profileId")),
    certificateField: S.String.pipe(T.HttpQuery("certificateField")),
    specifiers: S.optional(SpecifierList).pipe(T.HttpQuery("specifiers")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/profiles/{profileId}/mappings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAttributeMappingRequest",
}) as any as S.Schema<DeleteAttributeMappingRequest>;
export interface ScalarSubjectRequest {
  subjectId: string;
}
export const ScalarSubjectRequest = S.suspend(() =>
  S.Struct({ subjectId: S.String.pipe(T.HttpLabel("subjectId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/subject/{subjectId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ScalarSubjectRequest",
}) as any as S.Schema<ScalarSubjectRequest>;
export interface ScalarTrustAnchorRequest {
  trustAnchorId: string;
}
export const ScalarTrustAnchorRequest = S.suspend(() =>
  S.Struct({ trustAnchorId: S.String.pipe(T.HttpLabel("trustAnchorId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/trustanchor/{trustAnchorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ScalarTrustAnchorRequest",
}) as any as S.Schema<ScalarTrustAnchorRequest>;
export interface UpdateTrustAnchorRequest {
  trustAnchorId: string;
  name?: string;
  source?: Source;
}
export const UpdateTrustAnchorRequest = S.suspend(() =>
  S.Struct({
    trustAnchorId: S.String.pipe(T.HttpLabel("trustAnchorId")),
    name: S.optional(S.String),
    source: S.optional(Source),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/trustanchor/{trustAnchorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTrustAnchorRequest",
}) as any as S.Schema<UpdateTrustAnchorRequest>;
export interface ListTrustAnchorsResponse {
  nextToken?: string;
  trustAnchors?: TrustAnchorDetail[];
}
export const ListTrustAnchorsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    trustAnchors: S.optional(TrustAnchorDetails),
  }),
).annotations({
  identifier: "ListTrustAnchorsResponse",
}) as any as S.Schema<ListTrustAnchorsResponse>;
export interface NotificationSetting {
  enabled: boolean;
  event: string;
  threshold?: number;
  channel?: string;
}
export const NotificationSetting = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    event: S.String,
    threshold: S.optional(S.Number),
    channel: S.optional(S.String),
  }),
).annotations({
  identifier: "NotificationSetting",
}) as any as S.Schema<NotificationSetting>;
export type NotificationSettings = NotificationSetting[];
export const NotificationSettings = S.Array(NotificationSetting);
export interface NotificationSettingKey {
  event: string;
  channel?: string;
}
export const NotificationSettingKey = S.suspend(() =>
  S.Struct({ event: S.String, channel: S.optional(S.String) }),
).annotations({
  identifier: "NotificationSettingKey",
}) as any as S.Schema<NotificationSettingKey>;
export type NotificationSettingKeys = NotificationSettingKey[];
export const NotificationSettingKeys = S.Array(NotificationSettingKey);
export interface CrlDetail {
  crlId?: string;
  crlArn?: string;
  name?: string;
  enabled?: boolean;
  crlData?: Uint8Array;
  trustAnchorArn?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export const CrlDetail = S.suspend(() =>
  S.Struct({
    crlId: S.optional(S.String),
    crlArn: S.optional(S.String),
    name: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    crlData: S.optional(T.Blob),
    trustAnchorArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "CrlDetail" }) as any as S.Schema<CrlDetail>;
export type CrlDetails = CrlDetail[];
export const CrlDetails = S.Array(CrlDetail);
export interface SubjectSummary {
  subjectArn?: string;
  subjectId?: string;
  enabled?: boolean;
  x509Subject?: string;
  lastSeenAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export const SubjectSummary = S.suspend(() =>
  S.Struct({
    subjectArn: S.optional(S.String),
    subjectId: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    x509Subject: S.optional(S.String),
    lastSeenAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "SubjectSummary",
}) as any as S.Schema<SubjectSummary>;
export type SubjectSummaries = SubjectSummary[];
export const SubjectSummaries = S.Array(SubjectSummary);
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutNotificationSettingsRequest {
  trustAnchorId: string;
  notificationSettings: NotificationSetting[];
}
export const PutNotificationSettingsRequest = S.suspend(() =>
  S.Struct({
    trustAnchorId: S.String,
    notificationSettings: NotificationSettings,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/put-notifications-settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutNotificationSettingsRequest",
}) as any as S.Schema<PutNotificationSettingsRequest>;
export interface ResetNotificationSettingsRequest {
  trustAnchorId: string;
  notificationSettingKeys: NotificationSettingKey[];
}
export const ResetNotificationSettingsRequest = S.suspend(() =>
  S.Struct({
    trustAnchorId: S.String,
    notificationSettingKeys: NotificationSettingKeys,
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/reset-notifications-settings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetNotificationSettingsRequest",
}) as any as S.Schema<ResetNotificationSettingsRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TagResource" }),
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
export interface CrlDetailResponse {
  crl: CrlDetail;
}
export const CrlDetailResponse = S.suspend(() =>
  S.Struct({ crl: CrlDetail }),
).annotations({
  identifier: "CrlDetailResponse",
}) as any as S.Schema<CrlDetailResponse>;
export interface ListCrlsResponse {
  nextToken?: string;
  crls?: CrlDetail[];
}
export const ListCrlsResponse = S.suspend(() =>
  S.Struct({ nextToken: S.optional(S.String), crls: S.optional(CrlDetails) }),
).annotations({
  identifier: "ListCrlsResponse",
}) as any as S.Schema<ListCrlsResponse>;
export interface DeleteAttributeMappingResponse {
  profile: ProfileDetail;
}
export const DeleteAttributeMappingResponse = S.suspend(() =>
  S.Struct({ profile: ProfileDetail }),
).annotations({
  identifier: "DeleteAttributeMappingResponse",
}) as any as S.Schema<DeleteAttributeMappingResponse>;
export interface PutAttributeMappingRequest {
  profileId: string;
  certificateField: string;
  mappingRules: MappingRule[];
}
export const PutAttributeMappingRequest = S.suspend(() =>
  S.Struct({
    profileId: S.String.pipe(T.HttpLabel("profileId")),
    certificateField: S.String,
    mappingRules: MappingRules,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/profiles/{profileId}/mappings" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAttributeMappingRequest",
}) as any as S.Schema<PutAttributeMappingRequest>;
export interface ListSubjectsResponse {
  subjects?: SubjectSummary[];
  nextToken?: string;
}
export const ListSubjectsResponse = S.suspend(() =>
  S.Struct({
    subjects: S.optional(SubjectSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSubjectsResponse",
}) as any as S.Schema<ListSubjectsResponse>;
export interface PutNotificationSettingsResponse {
  trustAnchor: TrustAnchorDetail;
}
export const PutNotificationSettingsResponse = S.suspend(() =>
  S.Struct({ trustAnchor: TrustAnchorDetail }),
).annotations({
  identifier: "PutNotificationSettingsResponse",
}) as any as S.Schema<PutNotificationSettingsResponse>;
export interface ResetNotificationSettingsResponse {
  trustAnchor: TrustAnchorDetail;
}
export const ResetNotificationSettingsResponse = S.suspend(() =>
  S.Struct({ trustAnchor: TrustAnchorDetail }),
).annotations({
  identifier: "ResetNotificationSettingsResponse",
}) as any as S.Schema<ResetNotificationSettingsResponse>;
export interface ProfileDetailResponse {
  profile?: ProfileDetail;
}
export const ProfileDetailResponse = S.suspend(() =>
  S.Struct({ profile: S.optional(ProfileDetail) }),
).annotations({
  identifier: "ProfileDetailResponse",
}) as any as S.Schema<ProfileDetailResponse>;
export interface PutAttributeMappingResponse {
  profile: ProfileDetail;
}
export const PutAttributeMappingResponse = S.suspend(() =>
  S.Struct({ profile: ProfileDetail }),
).annotations({
  identifier: "PutAttributeMappingResponse",
}) as any as S.Schema<PutAttributeMappingResponse>;
export interface CreateTrustAnchorRequest {
  name: string;
  source: Source;
  enabled?: boolean;
  tags?: Tag[];
  notificationSettings?: NotificationSetting[];
}
export const CreateTrustAnchorRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    source: Source,
    enabled: S.optional(S.Boolean),
    tags: S.optional(TagList),
    notificationSettings: S.optional(NotificationSettings),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/trustanchors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTrustAnchorRequest",
}) as any as S.Schema<CreateTrustAnchorRequest>;
export interface TrustAnchorDetailResponse {
  trustAnchor: TrustAnchorDetail;
}
export const TrustAnchorDetailResponse = S.suspend(() =>
  S.Struct({ trustAnchor: TrustAnchorDetail }),
).annotations({
  identifier: "TrustAnchorDetailResponse",
}) as any as S.Schema<TrustAnchorDetailResponse>;
export interface CredentialSummary {
  seenAt?: Date;
  serialNumber?: string;
  issuer?: string;
  enabled?: boolean;
  x509CertificateData?: string;
  failed?: boolean;
}
export const CredentialSummary = S.suspend(() =>
  S.Struct({
    seenAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    serialNumber: S.optional(S.String),
    issuer: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    x509CertificateData: S.optional(S.String),
    failed: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CredentialSummary",
}) as any as S.Schema<CredentialSummary>;
export type CredentialSummaries = CredentialSummary[];
export const CredentialSummaries = S.Array(CredentialSummary);
export type InstancePropertyMap = { [key: string]: string | undefined };
export const InstancePropertyMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface InstanceProperty {
  seenAt?: Date;
  properties?: { [key: string]: string | undefined };
  failed?: boolean;
}
export const InstanceProperty = S.suspend(() =>
  S.Struct({
    seenAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    properties: S.optional(InstancePropertyMap),
    failed: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "InstanceProperty",
}) as any as S.Schema<InstanceProperty>;
export type InstanceProperties = InstanceProperty[];
export const InstanceProperties = S.Array(InstanceProperty);
export interface SubjectDetail {
  subjectArn?: string;
  subjectId?: string;
  enabled?: boolean;
  x509Subject?: string;
  lastSeenAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  credentials?: CredentialSummary[];
  instanceProperties?: InstanceProperty[];
}
export const SubjectDetail = S.suspend(() =>
  S.Struct({
    subjectArn: S.optional(S.String),
    subjectId: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    x509Subject: S.optional(S.String),
    lastSeenAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    credentials: S.optional(CredentialSummaries),
    instanceProperties: S.optional(InstanceProperties),
  }),
).annotations({
  identifier: "SubjectDetail",
}) as any as S.Schema<SubjectDetail>;
export interface SubjectDetailResponse {
  subject?: SubjectDetail;
}
export const SubjectDetailResponse = S.suspend(() =>
  S.Struct({ subject: S.optional(SubjectDetail) }),
).annotations({
  identifier: "SubjectDetailResponse",
}) as any as S.Schema<SubjectDetailResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Gets a certificate revocation list (CRL).
 *
 * **Required permissions: ** `rolesanywhere:GetCrl`.
 */
export const getCrl: (
  input: ScalarCrlRequest,
) => effect.Effect<
  CrlDetailResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarCrlRequest,
  output: CrlDetailResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes a certificate revocation list (CRL).
 *
 * **Required permissions: ** `rolesanywhere:DeleteCrl`.
 */
export const deleteCrl: (
  input: ScalarCrlRequest,
) => effect.Effect<
  CrlDetailResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarCrlRequest,
  output: CrlDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Creates a *profile*, a list of the roles that Roles Anywhere service is trusted to assume. You use profiles to intersect permissions with IAM managed policies.
 *
 * **Required permissions: ** `rolesanywhere:CreateProfile`.
 */
export const createProfile: (
  input: CreateProfileRequest,
) => effect.Effect<
  ProfileDetailResponse,
  AccessDeniedException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProfileRequest,
  output: ProfileDetailResponse,
  errors: [AccessDeniedException, ValidationException],
}));
/**
 * Delete an entry from the attribute mapping rules enforced by a given profile.
 */
export const deleteAttributeMapping: (
  input: DeleteAttributeMappingRequest,
) => effect.Effect<
  DeleteAttributeMappingResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAttributeMappingRequest,
  output: DeleteAttributeMappingResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the subjects in the authenticated account and Amazon Web Services Region.
 *
 * **Required permissions: ** `rolesanywhere:ListSubjects`.
 */
export const listSubjects: {
  (
    input: ListRequest,
  ): effect.Effect<
    ListSubjectsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRequest,
  ) => stream.Stream<
    ListSubjectsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRequest,
  ) => stream.Stream<
    SubjectSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRequest,
  output: ListSubjectsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "subjects",
  } as const,
}));
/**
 * Disables a certificate revocation list (CRL).
 *
 * **Required permissions: ** `rolesanywhere:DisableCrl`.
 */
export const disableCrl: (
  input: ScalarCrlRequest,
) => effect.Effect<
  CrlDetailResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarCrlRequest,
  output: CrlDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Gets a profile.
 *
 * **Required permissions: ** `rolesanywhere:GetProfile`.
 */
export const getProfile: (
  input: ScalarProfileRequest,
) => effect.Effect<
  ProfileDetailResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarProfileRequest,
  output: ProfileDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Updates a *profile*, a list of the roles that IAM Roles Anywhere service is trusted to assume. You use profiles to intersect permissions with IAM managed policies.
 *
 * **Required permissions: ** `rolesanywhere:UpdateProfile`.
 */
export const updateProfile: (
  input: UpdateProfileRequest,
) => effect.Effect<
  ProfileDetailResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProfileRequest,
  output: ProfileDetailResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets a trust anchor.
 *
 * **Required permissions: ** `rolesanywhere:GetTrustAnchor`.
 */
export const getTrustAnchor: (
  input: ScalarTrustAnchorRequest,
) => effect.Effect<
  TrustAnchorDetailResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates a trust anchor. You establish trust between IAM Roles Anywhere and your certificate authority (CA) by configuring a trust anchor. You can define a trust anchor as a reference to an Private Certificate Authority (Private CA) or by uploading a CA certificate. Your Amazon Web Services workloads can authenticate with the trust anchor using certificates issued by the CA in exchange for temporary Amazon Web Services credentials.
 *
 * **Required permissions: ** `rolesanywhere:UpdateTrustAnchor`.
 */
export const updateTrustAnchor: (
  input: UpdateTrustAnchorRequest,
) => effect.Effect<
  TrustAnchorDetailResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Enables a certificate revocation list (CRL). When enabled, certificates stored in the CRL are unauthorized to receive session credentials.
 *
 * **Required permissions: ** `rolesanywhere:EnableCrl`.
 */
export const enableCrl: (
  input: ScalarCrlRequest,
) => effect.Effect<
  CrlDetailResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarCrlRequest,
  output: CrlDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Disables a profile. When disabled, temporary credential requests with this profile fail.
 *
 * **Required permissions: ** `rolesanywhere:DisableProfile`.
 */
export const disableProfile: (
  input: ScalarProfileRequest,
) => effect.Effect<
  ProfileDetailResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarProfileRequest,
  output: ProfileDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Enables temporary credential requests for a profile.
 *
 * **Required permissions: ** `rolesanywhere:EnableProfile`.
 */
export const enableProfile: (
  input: ScalarProfileRequest,
) => effect.Effect<
  ProfileDetailResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarProfileRequest,
  output: ProfileDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Disables a trust anchor. When disabled, temporary credential requests specifying this trust anchor are unauthorized.
 *
 * **Required permissions: ** `rolesanywhere:DisableTrustAnchor`.
 */
export const disableTrustAnchor: (
  input: ScalarTrustAnchorRequest,
) => effect.Effect<
  TrustAnchorDetailResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Enables a trust anchor. When enabled, certificates in the trust anchor chain are authorized for trust validation.
 *
 * **Required permissions: ** `rolesanywhere:EnableTrustAnchor`.
 */
export const enableTrustAnchor: (
  input: ScalarTrustAnchorRequest,
) => effect.Effect<
  TrustAnchorDetailResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Removes tags from the resource.
 *
 * **Required permissions: ** `rolesanywhere:UntagResource`.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the certificate revocation list (CRL). A CRL is a list of certificates that have been revoked by the issuing certificate authority (CA). IAM Roles Anywhere validates against the CRL before issuing credentials.
 *
 * **Required permissions: ** `rolesanywhere:UpdateCrl`.
 */
export const updateCrl: (
  input: UpdateCrlRequest,
) => effect.Effect<
  CrlDetailResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCrlRequest,
  output: CrlDetailResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the tags attached to the resource.
 *
 * **Required permissions: ** `rolesanywhere:ListTagsForResource`.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists all profiles in the authenticated account and Amazon Web Services Region.
 *
 * **Required permissions: ** `rolesanywhere:ListProfiles`.
 */
export const listProfiles: {
  (
    input: ListRequest,
  ): effect.Effect<
    ListProfilesResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRequest,
  ) => stream.Stream<
    ListProfilesResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRequest,
  ) => stream.Stream<
    ProfileDetail,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRequest,
  output: ListProfilesResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "profiles",
  } as const,
}));
/**
 * Lists the trust anchors in the authenticated account and Amazon Web Services Region.
 *
 * **Required permissions: ** `rolesanywhere:ListTrustAnchors`.
 */
export const listTrustAnchors: {
  (
    input: ListRequest,
  ): effect.Effect<
    ListTrustAnchorsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRequest,
  ) => stream.Stream<
    ListTrustAnchorsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRequest,
  ) => stream.Stream<
    TrustAnchorDetail,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRequest,
  output: ListTrustAnchorsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "trustAnchors",
  } as const,
}));
/**
 * Imports the certificate revocation list (CRL). A CRL is a list of certificates that have been revoked by the issuing certificate Authority (CA).In order to be properly imported, a CRL must be in PEM format. IAM Roles Anywhere validates against the CRL before issuing credentials.
 *
 * **Required permissions: ** `rolesanywhere:ImportCrl`.
 */
export const importCrl: (
  input: ImportCrlRequest,
) => effect.Effect<
  CrlDetailResponse,
  AccessDeniedException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportCrlRequest,
  output: CrlDetailResponse,
  errors: [AccessDeniedException, ValidationException],
}));
/**
 * Lists all certificate revocation lists (CRL) in the authenticated account and Amazon Web Services Region.
 *
 * **Required permissions: ** `rolesanywhere:ListCrls`.
 */
export const listCrls: {
  (
    input: ListRequest,
  ): effect.Effect<
    ListCrlsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRequest,
  ) => stream.Stream<
    ListCrlsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRequest,
  ) => stream.Stream<
    CrlDetail,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRequest,
  output: ListCrlsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "crls",
  } as const,
}));
/**
 * Attaches a list of *notification settings* to a trust anchor.
 *
 * A notification setting includes information such as event name, threshold, status of the notification setting, and the channel to notify.
 *
 * **Required permissions: ** `rolesanywhere:PutNotificationSettings`.
 */
export const putNotificationSettings: (
  input: PutNotificationSettingsRequest,
) => effect.Effect<
  PutNotificationSettingsResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutNotificationSettingsRequest,
  output: PutNotificationSettingsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Resets the *custom notification setting* to IAM Roles Anywhere default setting.
 *
 * **Required permissions: ** `rolesanywhere:ResetNotificationSettings`.
 */
export const resetNotificationSettings: (
  input: ResetNotificationSettingsRequest,
) => effect.Effect<
  ResetNotificationSettingsResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetNotificationSettingsRequest,
  output: ResetNotificationSettingsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a profile.
 *
 * **Required permissions: ** `rolesanywhere:DeleteProfile`.
 */
export const deleteProfile: (
  input: ScalarProfileRequest,
) => effect.Effect<
  ProfileDetailResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarProfileRequest,
  output: ProfileDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Put an entry in the attribute mapping rules that will be enforced by a given profile. A mapping specifies a certificate field and one or more specifiers that have contextual meanings.
 */
export const putAttributeMapping: (
  input: PutAttributeMappingRequest,
) => effect.Effect<
  PutAttributeMappingResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAttributeMappingRequest,
  output: PutAttributeMappingResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a trust anchor to establish trust between IAM Roles Anywhere and your certificate authority (CA). You can define a trust anchor as a reference to an Private Certificate Authority (Private CA) or by uploading a CA certificate. Your Amazon Web Services workloads can authenticate with the trust anchor using certificates issued by the CA in exchange for temporary Amazon Web Services credentials.
 *
 * **Required permissions: ** `rolesanywhere:CreateTrustAnchor`.
 */
export const createTrustAnchor: (
  input: CreateTrustAnchorRequest,
) => effect.Effect<
  TrustAnchorDetailResponse,
  AccessDeniedException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [AccessDeniedException, ValidationException],
}));
/**
 * Deletes a trust anchor.
 *
 * **Required permissions: ** `rolesanywhere:DeleteTrustAnchor`.
 */
export const deleteTrustAnchor: (
  input: ScalarTrustAnchorRequest,
) => effect.Effect<
  TrustAnchorDetailResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarTrustAnchorRequest,
  output: TrustAnchorDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Attaches tags to a resource.
 *
 * **Required permissions: ** `rolesanywhere:TagResource`.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Gets a *subject*, which associates a certificate identity with authentication attempts. The subject stores auditing information such as the status of the last authentication attempt, the certificate data used in the attempt, and the last time the associated identity attempted authentication.
 *
 * **Required permissions: ** `rolesanywhere:GetSubject`.
 */
export const getSubject: (
  input: ScalarSubjectRequest,
) => effect.Effect<
  SubjectDetailResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalarSubjectRequest,
  output: SubjectDetailResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));

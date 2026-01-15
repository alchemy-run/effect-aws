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
  sdkId: "WorkMail",
  serviceShapeName: "WorkMailService",
});
const auth = T.AwsAuthSigv4({ name: "workmail" });
const ver = T.ServiceVersion("2017-10-01");
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
              `https://workmail-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://workmail-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://workmail.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://workmail.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type OrganizationId = string;
export type EntityIdentifier = string;
export type ImpersonationRoleId = string;
export type IdempotencyClientToken = string;
export type MailboxExportJobId = string;
export type WorkMailIdentifier = string;
export type EmailAddress = string;
export type DomainName = string;
export type GroupName = string;
export type IdentityCenterApplicationName = string;
export type InstanceArn = string;
export type ImpersonationRoleName = string;
export type ImpersonationRoleDescription = string;
export type MobileDeviceAccessRuleName = string;
export type MobileDeviceAccessRuleDescription = string;
export type DeviceType = string;
export type DeviceModel = string;
export type DeviceOperatingSystem = string;
export type DeviceUserAgent = string;
export type DirectoryId = string;
export type OrganizationName = string;
export type KmsKeyArn = string;
export type ResourceName = string;
export type ResourceDescription = string | redacted.Redacted<string>;
export type UserName = string;
export type UserAttribute = string | redacted.Redacted<string>;
export type Password = string | redacted.Redacted<string>;
export type IdentityProviderUserId = string;
export type AccessControlRuleName = string;
export type ApplicationArn = string;
export type DeviceId = string;
export type MobileDeviceAccessRuleId = string;
export type PersonalAccessTokenId = string;
export type ShortString = string;
export type WorkMailDomainName = string;
export type IpAddress = string;
export type AccessControlRuleAction = string;
export type NextToken = string;
export type MaxResults = number;
export type AmazonResourceName = string;
export type AccessControlRuleDescription = string;
export type IpRange = string;
export type RoleArn = string;
export type LogGroupArn = string;
export type PolicyDescription = string | redacted.Redacted<string>;
export type Description = string;
export type S3BucketName = string;
export type S3ObjectKey = string;
export type TagKey = string;
export type MailboxQuota = number;
export type NewResourceDescription = string | redacted.Redacted<string>;
export type IdentityProviderUserIdForUpdate = string;
export type Url = string;
export type ExternalUserName = string;
export type LambdaArn = string;
export type ImpersonationRuleId = string;
export type ImpersonationRuleName = string;
export type ImpersonationRuleDescription = string;
export type HostedZoneId = string;
export type IdentityProviderUserIdPrefix = string;
export type PersonalAccessTokenLifetimeInDays = number;
export type RetentionPeriod = number;
export type TagValue = string;
export type ImpersonationToken = string;
export type ExpiresIn = number;
export type ResourceId = string;
export type Percentage = number;
export type MailboxExportErrorInfo = string;
export type IdentityProviderIdentityStoreId = string;
export type MailboxSize = number;
export type PersonalAccessTokenName = string;
export type PersonalAccessTokenScope = string;

//# Schemas
export type ImpersonationRoleType = "FULL_ACCESS" | "READ_ONLY" | (string & {});
export const ImpersonationRoleType = S.String;
export type MobileDeviceAccessRuleEffect = "ALLOW" | "DENY" | (string & {});
export const MobileDeviceAccessRuleEffect = S.String;
export type DeviceTypeList = string[];
export const DeviceTypeList = S.Array(S.String);
export type DeviceModelList = string[];
export const DeviceModelList = S.Array(S.String);
export type DeviceOperatingSystemList = string[];
export const DeviceOperatingSystemList = S.Array(S.String);
export type DeviceUserAgentList = string[];
export const DeviceUserAgentList = S.Array(S.String);
export type ResourceType = "ROOM" | "EQUIPMENT" | (string & {});
export const ResourceType = S.String;
export type UserRole =
  | "USER"
  | "RESOURCE"
  | "SYSTEM_USER"
  | "REMOTE_USER"
  | (string & {});
export const UserRole = S.String;
export type AccessControlRuleEffect = "ALLOW" | "DENY" | (string & {});
export const AccessControlRuleEffect = S.String;
export type IpRangeList = string[];
export const IpRangeList = S.Array(S.String);
export type ActionsList = string[];
export const ActionsList = S.Array(S.String);
export type UserIdList = string[];
export const UserIdList = S.Array(S.String);
export type ImpersonationRoleIdList = string[];
export const ImpersonationRoleIdList = S.Array(S.String);
export type IdentityProviderAuthenticationMode =
  | "IDENTITY_PROVIDER_ONLY"
  | "IDENTITY_PROVIDER_AND_DIRECTORY"
  | (string & {});
export const IdentityProviderAuthenticationMode = S.String;
export type PermissionType =
  | "FULL_ACCESS"
  | "SEND_AS"
  | "SEND_ON_BEHALF"
  | (string & {});
export const PermissionType = S.String;
export type PermissionValues = PermissionType[];
export const PermissionValues = S.Array(PermissionType);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AssociateDelegateToResourceRequest {
  OrganizationId: string;
  ResourceId: string;
  EntityId: string;
}
export const AssociateDelegateToResourceRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    ResourceId: S.String,
    EntityId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateDelegateToResourceRequest",
}) as any as S.Schema<AssociateDelegateToResourceRequest>;
export interface AssociateDelegateToResourceResponse {}
export const AssociateDelegateToResourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateDelegateToResourceResponse",
}) as any as S.Schema<AssociateDelegateToResourceResponse>;
export interface AssociateMemberToGroupRequest {
  OrganizationId: string;
  GroupId: string;
  MemberId: string;
}
export const AssociateMemberToGroupRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    GroupId: S.String,
    MemberId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateMemberToGroupRequest",
}) as any as S.Schema<AssociateMemberToGroupRequest>;
export interface AssociateMemberToGroupResponse {}
export const AssociateMemberToGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateMemberToGroupResponse",
}) as any as S.Schema<AssociateMemberToGroupResponse>;
export interface AssumeImpersonationRoleRequest {
  OrganizationId: string;
  ImpersonationRoleId: string;
}
export const AssumeImpersonationRoleRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, ImpersonationRoleId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssumeImpersonationRoleRequest",
}) as any as S.Schema<AssumeImpersonationRoleRequest>;
export interface CancelMailboxExportJobRequest {
  ClientToken: string;
  JobId: string;
  OrganizationId: string;
}
export const CancelMailboxExportJobRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    JobId: S.String,
    OrganizationId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelMailboxExportJobRequest",
}) as any as S.Schema<CancelMailboxExportJobRequest>;
export interface CancelMailboxExportJobResponse {}
export const CancelMailboxExportJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelMailboxExportJobResponse",
}) as any as S.Schema<CancelMailboxExportJobResponse>;
export interface CreateAliasRequest {
  OrganizationId: string;
  EntityId: string;
  Alias: string;
}
export const CreateAliasRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    EntityId: S.String,
    Alias: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAliasRequest",
}) as any as S.Schema<CreateAliasRequest>;
export interface CreateAliasResponse {}
export const CreateAliasResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateAliasResponse",
}) as any as S.Schema<CreateAliasResponse>;
export interface CreateGroupRequest {
  OrganizationId: string;
  Name: string;
  HiddenFromGlobalAddressList?: boolean;
}
export const CreateGroupRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    Name: S.String,
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateGroupRequest",
}) as any as S.Schema<CreateGroupRequest>;
export interface CreateIdentityCenterApplicationRequest {
  Name: string;
  InstanceArn: string;
  ClientToken?: string;
}
export const CreateIdentityCenterApplicationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    InstanceArn: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateIdentityCenterApplicationRequest",
}) as any as S.Schema<CreateIdentityCenterApplicationRequest>;
export interface CreateMobileDeviceAccessRuleRequest {
  OrganizationId: string;
  ClientToken?: string;
  Name: string;
  Description?: string;
  Effect: MobileDeviceAccessRuleEffect;
  DeviceTypes?: string[];
  NotDeviceTypes?: string[];
  DeviceModels?: string[];
  NotDeviceModels?: string[];
  DeviceOperatingSystems?: string[];
  NotDeviceOperatingSystems?: string[];
  DeviceUserAgents?: string[];
  NotDeviceUserAgents?: string[];
}
export const CreateMobileDeviceAccessRuleRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Name: S.String,
    Description: S.optional(S.String),
    Effect: MobileDeviceAccessRuleEffect,
    DeviceTypes: S.optional(DeviceTypeList),
    NotDeviceTypes: S.optional(DeviceTypeList),
    DeviceModels: S.optional(DeviceModelList),
    NotDeviceModels: S.optional(DeviceModelList),
    DeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
    NotDeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
    DeviceUserAgents: S.optional(DeviceUserAgentList),
    NotDeviceUserAgents: S.optional(DeviceUserAgentList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateMobileDeviceAccessRuleRequest",
}) as any as S.Schema<CreateMobileDeviceAccessRuleRequest>;
export interface CreateResourceRequest {
  OrganizationId: string;
  Name: string;
  Type: ResourceType;
  Description?: string | redacted.Redacted<string>;
  HiddenFromGlobalAddressList?: boolean;
}
export const CreateResourceRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    Name: S.String,
    Type: ResourceType,
    Description: S.optional(SensitiveString),
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateResourceRequest",
}) as any as S.Schema<CreateResourceRequest>;
export interface CreateUserRequest {
  OrganizationId: string;
  Name: string;
  DisplayName: string | redacted.Redacted<string>;
  Password?: string | redacted.Redacted<string>;
  Role?: UserRole;
  FirstName?: string | redacted.Redacted<string>;
  LastName?: string | redacted.Redacted<string>;
  HiddenFromGlobalAddressList?: boolean;
  IdentityProviderUserId?: string;
}
export const CreateUserRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    Name: S.String,
    DisplayName: SensitiveString,
    Password: S.optional(SensitiveString),
    Role: S.optional(UserRole),
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
    IdentityProviderUserId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateUserRequest",
}) as any as S.Schema<CreateUserRequest>;
export interface DeleteAccessControlRuleRequest {
  OrganizationId: string;
  Name: string;
}
export const DeleteAccessControlRuleRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAccessControlRuleRequest",
}) as any as S.Schema<DeleteAccessControlRuleRequest>;
export interface DeleteAccessControlRuleResponse {}
export const DeleteAccessControlRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccessControlRuleResponse",
}) as any as S.Schema<DeleteAccessControlRuleResponse>;
export interface DeleteAliasRequest {
  OrganizationId: string;
  EntityId: string;
  Alias: string;
}
export const DeleteAliasRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    EntityId: S.String,
    Alias: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAliasRequest",
}) as any as S.Schema<DeleteAliasRequest>;
export interface DeleteAliasResponse {}
export const DeleteAliasResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAliasResponse",
}) as any as S.Schema<DeleteAliasResponse>;
export interface DeleteAvailabilityConfigurationRequest {
  OrganizationId: string;
  DomainName: string;
}
export const DeleteAvailabilityConfigurationRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, DomainName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAvailabilityConfigurationRequest",
}) as any as S.Schema<DeleteAvailabilityConfigurationRequest>;
export interface DeleteAvailabilityConfigurationResponse {}
export const DeleteAvailabilityConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAvailabilityConfigurationResponse",
}) as any as S.Schema<DeleteAvailabilityConfigurationResponse>;
export interface DeleteEmailMonitoringConfigurationRequest {
  OrganizationId: string;
}
export const DeleteEmailMonitoringConfigurationRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEmailMonitoringConfigurationRequest",
}) as any as S.Schema<DeleteEmailMonitoringConfigurationRequest>;
export interface DeleteEmailMonitoringConfigurationResponse {}
export const DeleteEmailMonitoringConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEmailMonitoringConfigurationResponse",
}) as any as S.Schema<DeleteEmailMonitoringConfigurationResponse>;
export interface DeleteGroupRequest {
  OrganizationId: string;
  GroupId: string;
}
export const DeleteGroupRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, GroupId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteGroupRequest",
}) as any as S.Schema<DeleteGroupRequest>;
export interface DeleteGroupResponse {}
export const DeleteGroupResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteGroupResponse",
}) as any as S.Schema<DeleteGroupResponse>;
export interface DeleteIdentityCenterApplicationRequest {
  ApplicationArn: string;
}
export const DeleteIdentityCenterApplicationRequest = S.suspend(() =>
  S.Struct({ ApplicationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteIdentityCenterApplicationRequest",
}) as any as S.Schema<DeleteIdentityCenterApplicationRequest>;
export interface DeleteIdentityCenterApplicationResponse {}
export const DeleteIdentityCenterApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIdentityCenterApplicationResponse",
}) as any as S.Schema<DeleteIdentityCenterApplicationResponse>;
export interface DeleteIdentityProviderConfigurationRequest {
  OrganizationId: string;
}
export const DeleteIdentityProviderConfigurationRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteIdentityProviderConfigurationRequest",
}) as any as S.Schema<DeleteIdentityProviderConfigurationRequest>;
export interface DeleteIdentityProviderConfigurationResponse {}
export const DeleteIdentityProviderConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIdentityProviderConfigurationResponse",
}) as any as S.Schema<DeleteIdentityProviderConfigurationResponse>;
export interface DeleteImpersonationRoleRequest {
  OrganizationId: string;
  ImpersonationRoleId: string;
}
export const DeleteImpersonationRoleRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, ImpersonationRoleId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteImpersonationRoleRequest",
}) as any as S.Schema<DeleteImpersonationRoleRequest>;
export interface DeleteImpersonationRoleResponse {}
export const DeleteImpersonationRoleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteImpersonationRoleResponse",
}) as any as S.Schema<DeleteImpersonationRoleResponse>;
export interface DeleteMailboxPermissionsRequest {
  OrganizationId: string;
  EntityId: string;
  GranteeId: string;
}
export const DeleteMailboxPermissionsRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    EntityId: S.String,
    GranteeId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteMailboxPermissionsRequest",
}) as any as S.Schema<DeleteMailboxPermissionsRequest>;
export interface DeleteMailboxPermissionsResponse {}
export const DeleteMailboxPermissionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMailboxPermissionsResponse",
}) as any as S.Schema<DeleteMailboxPermissionsResponse>;
export interface DeleteMobileDeviceAccessOverrideRequest {
  OrganizationId: string;
  UserId: string;
  DeviceId: string;
}
export const DeleteMobileDeviceAccessOverrideRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    UserId: S.String,
    DeviceId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteMobileDeviceAccessOverrideRequest",
}) as any as S.Schema<DeleteMobileDeviceAccessOverrideRequest>;
export interface DeleteMobileDeviceAccessOverrideResponse {}
export const DeleteMobileDeviceAccessOverrideResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMobileDeviceAccessOverrideResponse",
}) as any as S.Schema<DeleteMobileDeviceAccessOverrideResponse>;
export interface DeleteMobileDeviceAccessRuleRequest {
  OrganizationId: string;
  MobileDeviceAccessRuleId: string;
}
export const DeleteMobileDeviceAccessRuleRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    MobileDeviceAccessRuleId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteMobileDeviceAccessRuleRequest",
}) as any as S.Schema<DeleteMobileDeviceAccessRuleRequest>;
export interface DeleteMobileDeviceAccessRuleResponse {}
export const DeleteMobileDeviceAccessRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMobileDeviceAccessRuleResponse",
}) as any as S.Schema<DeleteMobileDeviceAccessRuleResponse>;
export interface DeleteOrganizationRequest {
  ClientToken?: string;
  OrganizationId: string;
  DeleteDirectory: boolean;
  ForceDelete?: boolean;
  DeleteIdentityCenterApplication?: boolean;
}
export const DeleteOrganizationRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    OrganizationId: S.String,
    DeleteDirectory: S.Boolean,
    ForceDelete: S.optional(S.Boolean),
    DeleteIdentityCenterApplication: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteOrganizationRequest",
}) as any as S.Schema<DeleteOrganizationRequest>;
export interface DeletePersonalAccessTokenRequest {
  OrganizationId: string;
  PersonalAccessTokenId: string;
}
export const DeletePersonalAccessTokenRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, PersonalAccessTokenId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePersonalAccessTokenRequest",
}) as any as S.Schema<DeletePersonalAccessTokenRequest>;
export interface DeletePersonalAccessTokenResponse {}
export const DeletePersonalAccessTokenResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePersonalAccessTokenResponse",
}) as any as S.Schema<DeletePersonalAccessTokenResponse>;
export interface DeleteResourceRequest {
  OrganizationId: string;
  ResourceId: string;
}
export const DeleteResourceRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, ResourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResourceRequest",
}) as any as S.Schema<DeleteResourceRequest>;
export interface DeleteResourceResponse {}
export const DeleteResourceResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteResourceResponse" },
) as any as S.Schema<DeleteResourceResponse>;
export interface DeleteRetentionPolicyRequest {
  OrganizationId: string;
  Id: string;
}
export const DeleteRetentionPolicyRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRetentionPolicyRequest",
}) as any as S.Schema<DeleteRetentionPolicyRequest>;
export interface DeleteRetentionPolicyResponse {}
export const DeleteRetentionPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRetentionPolicyResponse",
}) as any as S.Schema<DeleteRetentionPolicyResponse>;
export interface DeleteUserRequest {
  OrganizationId: string;
  UserId: string;
}
export const DeleteUserRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, UserId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteUserRequest",
}) as any as S.Schema<DeleteUserRequest>;
export interface DeleteUserResponse {}
export const DeleteUserResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteUserResponse",
}) as any as S.Schema<DeleteUserResponse>;
export interface DeregisterFromWorkMailRequest {
  OrganizationId: string;
  EntityId: string;
}
export const DeregisterFromWorkMailRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, EntityId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeregisterFromWorkMailRequest",
}) as any as S.Schema<DeregisterFromWorkMailRequest>;
export interface DeregisterFromWorkMailResponse {}
export const DeregisterFromWorkMailResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterFromWorkMailResponse",
}) as any as S.Schema<DeregisterFromWorkMailResponse>;
export interface DeregisterMailDomainRequest {
  OrganizationId: string;
  DomainName: string;
}
export const DeregisterMailDomainRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, DomainName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeregisterMailDomainRequest",
}) as any as S.Schema<DeregisterMailDomainRequest>;
export interface DeregisterMailDomainResponse {}
export const DeregisterMailDomainResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterMailDomainResponse",
}) as any as S.Schema<DeregisterMailDomainResponse>;
export interface DescribeEmailMonitoringConfigurationRequest {
  OrganizationId: string;
}
export const DescribeEmailMonitoringConfigurationRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEmailMonitoringConfigurationRequest",
}) as any as S.Schema<DescribeEmailMonitoringConfigurationRequest>;
export interface DescribeEntityRequest {
  OrganizationId: string;
  Email: string;
}
export const DescribeEntityRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, Email: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEntityRequest",
}) as any as S.Schema<DescribeEntityRequest>;
export interface DescribeGroupRequest {
  OrganizationId: string;
  GroupId: string;
}
export const DescribeGroupRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, GroupId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeGroupRequest",
}) as any as S.Schema<DescribeGroupRequest>;
export interface DescribeIdentityProviderConfigurationRequest {
  OrganizationId: string;
}
export const DescribeIdentityProviderConfigurationRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeIdentityProviderConfigurationRequest",
}) as any as S.Schema<DescribeIdentityProviderConfigurationRequest>;
export interface DescribeInboundDmarcSettingsRequest {
  OrganizationId: string;
}
export const DescribeInboundDmarcSettingsRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeInboundDmarcSettingsRequest",
}) as any as S.Schema<DescribeInboundDmarcSettingsRequest>;
export interface DescribeMailboxExportJobRequest {
  JobId: string;
  OrganizationId: string;
}
export const DescribeMailboxExportJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String, OrganizationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeMailboxExportJobRequest",
}) as any as S.Schema<DescribeMailboxExportJobRequest>;
export interface DescribeOrganizationRequest {
  OrganizationId: string;
}
export const DescribeOrganizationRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeOrganizationRequest",
}) as any as S.Schema<DescribeOrganizationRequest>;
export interface DescribeResourceRequest {
  OrganizationId: string;
  ResourceId: string;
}
export const DescribeResourceRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, ResourceId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeResourceRequest",
}) as any as S.Schema<DescribeResourceRequest>;
export interface DescribeUserRequest {
  OrganizationId: string;
  UserId: string;
}
export const DescribeUserRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, UserId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeUserRequest",
}) as any as S.Schema<DescribeUserRequest>;
export interface DisassociateDelegateFromResourceRequest {
  OrganizationId: string;
  ResourceId: string;
  EntityId: string;
}
export const DisassociateDelegateFromResourceRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    ResourceId: S.String,
    EntityId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateDelegateFromResourceRequest",
}) as any as S.Schema<DisassociateDelegateFromResourceRequest>;
export interface DisassociateDelegateFromResourceResponse {}
export const DisassociateDelegateFromResourceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateDelegateFromResourceResponse",
}) as any as S.Schema<DisassociateDelegateFromResourceResponse>;
export interface DisassociateMemberFromGroupRequest {
  OrganizationId: string;
  GroupId: string;
  MemberId: string;
}
export const DisassociateMemberFromGroupRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    GroupId: S.String,
    MemberId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateMemberFromGroupRequest",
}) as any as S.Schema<DisassociateMemberFromGroupRequest>;
export interface DisassociateMemberFromGroupResponse {}
export const DisassociateMemberFromGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateMemberFromGroupResponse",
}) as any as S.Schema<DisassociateMemberFromGroupResponse>;
export interface GetAccessControlEffectRequest {
  OrganizationId: string;
  IpAddress: string;
  Action: string;
  UserId?: string;
  ImpersonationRoleId?: string;
}
export const GetAccessControlEffectRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    IpAddress: S.String,
    Action: S.String,
    UserId: S.optional(S.String),
    ImpersonationRoleId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAccessControlEffectRequest",
}) as any as S.Schema<GetAccessControlEffectRequest>;
export interface GetDefaultRetentionPolicyRequest {
  OrganizationId: string;
}
export const GetDefaultRetentionPolicyRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDefaultRetentionPolicyRequest",
}) as any as S.Schema<GetDefaultRetentionPolicyRequest>;
export interface GetImpersonationRoleRequest {
  OrganizationId: string;
  ImpersonationRoleId: string;
}
export const GetImpersonationRoleRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, ImpersonationRoleId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetImpersonationRoleRequest",
}) as any as S.Schema<GetImpersonationRoleRequest>;
export interface GetImpersonationRoleEffectRequest {
  OrganizationId: string;
  ImpersonationRoleId: string;
  TargetUser: string;
}
export const GetImpersonationRoleEffectRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    ImpersonationRoleId: S.String,
    TargetUser: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetImpersonationRoleEffectRequest",
}) as any as S.Schema<GetImpersonationRoleEffectRequest>;
export interface GetMailboxDetailsRequest {
  OrganizationId: string;
  UserId: string;
}
export const GetMailboxDetailsRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, UserId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetMailboxDetailsRequest",
}) as any as S.Schema<GetMailboxDetailsRequest>;
export interface GetMailDomainRequest {
  OrganizationId: string;
  DomainName: string;
}
export const GetMailDomainRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, DomainName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetMailDomainRequest",
}) as any as S.Schema<GetMailDomainRequest>;
export interface GetMobileDeviceAccessEffectRequest {
  OrganizationId: string;
  DeviceType?: string;
  DeviceModel?: string;
  DeviceOperatingSystem?: string;
  DeviceUserAgent?: string;
}
export const GetMobileDeviceAccessEffectRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    DeviceType: S.optional(S.String),
    DeviceModel: S.optional(S.String),
    DeviceOperatingSystem: S.optional(S.String),
    DeviceUserAgent: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetMobileDeviceAccessEffectRequest",
}) as any as S.Schema<GetMobileDeviceAccessEffectRequest>;
export interface GetMobileDeviceAccessOverrideRequest {
  OrganizationId: string;
  UserId: string;
  DeviceId: string;
}
export const GetMobileDeviceAccessOverrideRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    UserId: S.String,
    DeviceId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetMobileDeviceAccessOverrideRequest",
}) as any as S.Schema<GetMobileDeviceAccessOverrideRequest>;
export interface GetPersonalAccessTokenMetadataRequest {
  OrganizationId: string;
  PersonalAccessTokenId: string;
}
export const GetPersonalAccessTokenMetadataRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, PersonalAccessTokenId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPersonalAccessTokenMetadataRequest",
}) as any as S.Schema<GetPersonalAccessTokenMetadataRequest>;
export interface ListAccessControlRulesRequest {
  OrganizationId: string;
}
export const ListAccessControlRulesRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAccessControlRulesRequest",
}) as any as S.Schema<ListAccessControlRulesRequest>;
export interface ListAliasesRequest {
  OrganizationId: string;
  EntityId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAliasesRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    EntityId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAliasesRequest",
}) as any as S.Schema<ListAliasesRequest>;
export interface ListAvailabilityConfigurationsRequest {
  OrganizationId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAvailabilityConfigurationsRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAvailabilityConfigurationsRequest",
}) as any as S.Schema<ListAvailabilityConfigurationsRequest>;
export interface ListGroupMembersRequest {
  OrganizationId: string;
  GroupId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListGroupMembersRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    GroupId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListGroupMembersRequest",
}) as any as S.Schema<ListGroupMembersRequest>;
export interface ListImpersonationRolesRequest {
  OrganizationId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListImpersonationRolesRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListImpersonationRolesRequest",
}) as any as S.Schema<ListImpersonationRolesRequest>;
export interface ListMailboxExportJobsRequest {
  OrganizationId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListMailboxExportJobsRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMailboxExportJobsRequest",
}) as any as S.Schema<ListMailboxExportJobsRequest>;
export interface ListMailboxPermissionsRequest {
  OrganizationId: string;
  EntityId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListMailboxPermissionsRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    EntityId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMailboxPermissionsRequest",
}) as any as S.Schema<ListMailboxPermissionsRequest>;
export interface ListMailDomainsRequest {
  OrganizationId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListMailDomainsRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMailDomainsRequest",
}) as any as S.Schema<ListMailDomainsRequest>;
export interface ListMobileDeviceAccessOverridesRequest {
  OrganizationId: string;
  UserId?: string;
  DeviceId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListMobileDeviceAccessOverridesRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    UserId: S.optional(S.String),
    DeviceId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMobileDeviceAccessOverridesRequest",
}) as any as S.Schema<ListMobileDeviceAccessOverridesRequest>;
export interface ListMobileDeviceAccessRulesRequest {
  OrganizationId: string;
}
export const ListMobileDeviceAccessRulesRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMobileDeviceAccessRulesRequest",
}) as any as S.Schema<ListMobileDeviceAccessRulesRequest>;
export interface ListOrganizationsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListOrganizationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListOrganizationsRequest",
}) as any as S.Schema<ListOrganizationsRequest>;
export interface ListPersonalAccessTokensRequest {
  OrganizationId: string;
  UserId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListPersonalAccessTokensRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    UserId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPersonalAccessTokensRequest",
}) as any as S.Schema<ListPersonalAccessTokensRequest>;
export interface ListResourceDelegatesRequest {
  OrganizationId: string;
  ResourceId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListResourceDelegatesRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    ResourceId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResourceDelegatesRequest",
}) as any as S.Schema<ListResourceDelegatesRequest>;
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
export interface PutAccessControlRuleRequest {
  Name: string;
  Effect: AccessControlRuleEffect;
  Description: string;
  IpRanges?: string[];
  NotIpRanges?: string[];
  Actions?: string[];
  NotActions?: string[];
  UserIds?: string[];
  NotUserIds?: string[];
  OrganizationId: string;
  ImpersonationRoleIds?: string[];
  NotImpersonationRoleIds?: string[];
}
export const PutAccessControlRuleRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Effect: AccessControlRuleEffect,
    Description: S.String,
    IpRanges: S.optional(IpRangeList),
    NotIpRanges: S.optional(IpRangeList),
    Actions: S.optional(ActionsList),
    NotActions: S.optional(ActionsList),
    UserIds: S.optional(UserIdList),
    NotUserIds: S.optional(UserIdList),
    OrganizationId: S.String,
    ImpersonationRoleIds: S.optional(ImpersonationRoleIdList),
    NotImpersonationRoleIds: S.optional(ImpersonationRoleIdList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutAccessControlRuleRequest",
}) as any as S.Schema<PutAccessControlRuleRequest>;
export interface PutAccessControlRuleResponse {}
export const PutAccessControlRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutAccessControlRuleResponse",
}) as any as S.Schema<PutAccessControlRuleResponse>;
export interface PutEmailMonitoringConfigurationRequest {
  OrganizationId: string;
  RoleArn?: string;
  LogGroupArn: string;
}
export const PutEmailMonitoringConfigurationRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    RoleArn: S.optional(S.String),
    LogGroupArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutEmailMonitoringConfigurationRequest",
}) as any as S.Schema<PutEmailMonitoringConfigurationRequest>;
export interface PutEmailMonitoringConfigurationResponse {}
export const PutEmailMonitoringConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutEmailMonitoringConfigurationResponse",
}) as any as S.Schema<PutEmailMonitoringConfigurationResponse>;
export interface PutInboundDmarcSettingsRequest {
  OrganizationId: string;
  Enforced: boolean;
}
export const PutInboundDmarcSettingsRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, Enforced: S.Boolean }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutInboundDmarcSettingsRequest",
}) as any as S.Schema<PutInboundDmarcSettingsRequest>;
export interface PutInboundDmarcSettingsResponse {}
export const PutInboundDmarcSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutInboundDmarcSettingsResponse",
}) as any as S.Schema<PutInboundDmarcSettingsResponse>;
export interface PutMailboxPermissionsRequest {
  OrganizationId: string;
  EntityId: string;
  GranteeId: string;
  PermissionValues: PermissionType[];
}
export const PutMailboxPermissionsRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    EntityId: S.String,
    GranteeId: S.String,
    PermissionValues: PermissionValues,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutMailboxPermissionsRequest",
}) as any as S.Schema<PutMailboxPermissionsRequest>;
export interface PutMailboxPermissionsResponse {}
export const PutMailboxPermissionsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutMailboxPermissionsResponse",
}) as any as S.Schema<PutMailboxPermissionsResponse>;
export interface PutMobileDeviceAccessOverrideRequest {
  OrganizationId: string;
  UserId: string;
  DeviceId: string;
  Effect: MobileDeviceAccessRuleEffect;
  Description?: string;
}
export const PutMobileDeviceAccessOverrideRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    UserId: S.String,
    DeviceId: S.String,
    Effect: MobileDeviceAccessRuleEffect,
    Description: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutMobileDeviceAccessOverrideRequest",
}) as any as S.Schema<PutMobileDeviceAccessOverrideRequest>;
export interface PutMobileDeviceAccessOverrideResponse {}
export const PutMobileDeviceAccessOverrideResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutMobileDeviceAccessOverrideResponse",
}) as any as S.Schema<PutMobileDeviceAccessOverrideResponse>;
export interface RegisterMailDomainRequest {
  ClientToken?: string;
  OrganizationId: string;
  DomainName: string;
}
export const RegisterMailDomainRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    OrganizationId: S.String,
    DomainName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RegisterMailDomainRequest",
}) as any as S.Schema<RegisterMailDomainRequest>;
export interface RegisterMailDomainResponse {}
export const RegisterMailDomainResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RegisterMailDomainResponse",
}) as any as S.Schema<RegisterMailDomainResponse>;
export interface RegisterToWorkMailRequest {
  OrganizationId: string;
  EntityId: string;
  Email: string;
}
export const RegisterToWorkMailRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    EntityId: S.String,
    Email: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RegisterToWorkMailRequest",
}) as any as S.Schema<RegisterToWorkMailRequest>;
export interface RegisterToWorkMailResponse {}
export const RegisterToWorkMailResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RegisterToWorkMailResponse",
}) as any as S.Schema<RegisterToWorkMailResponse>;
export interface ResetPasswordRequest {
  OrganizationId: string;
  UserId: string;
  Password: string | redacted.Redacted<string>;
}
export const ResetPasswordRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    UserId: S.String,
    Password: SensitiveString,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ResetPasswordRequest",
}) as any as S.Schema<ResetPasswordRequest>;
export interface ResetPasswordResponse {}
export const ResetPasswordResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "ResetPasswordResponse",
}) as any as S.Schema<ResetPasswordResponse>;
export interface StartMailboxExportJobRequest {
  ClientToken: string;
  OrganizationId: string;
  EntityId: string;
  Description?: string;
  RoleArn: string;
  KmsKeyArn: string;
  S3BucketName: string;
  S3Prefix: string;
}
export const StartMailboxExportJobRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    OrganizationId: S.String,
    EntityId: S.String,
    Description: S.optional(S.String),
    RoleArn: S.String,
    KmsKeyArn: S.String,
    S3BucketName: S.String,
    S3Prefix: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartMailboxExportJobRequest",
}) as any as S.Schema<StartMailboxExportJobRequest>;
export interface EwsAvailabilityProvider {
  EwsEndpoint: string;
  EwsUsername: string;
  EwsPassword: string | redacted.Redacted<string>;
}
export const EwsAvailabilityProvider = S.suspend(() =>
  S.Struct({
    EwsEndpoint: S.String,
    EwsUsername: S.String,
    EwsPassword: SensitiveString,
  }),
).annotations({
  identifier: "EwsAvailabilityProvider",
}) as any as S.Schema<EwsAvailabilityProvider>;
export interface LambdaAvailabilityProvider {
  LambdaArn: string;
}
export const LambdaAvailabilityProvider = S.suspend(() =>
  S.Struct({ LambdaArn: S.String }),
).annotations({
  identifier: "LambdaAvailabilityProvider",
}) as any as S.Schema<LambdaAvailabilityProvider>;
export interface TestAvailabilityConfigurationRequest {
  OrganizationId: string;
  DomainName?: string;
  EwsProvider?: EwsAvailabilityProvider;
  LambdaProvider?: LambdaAvailabilityProvider;
}
export const TestAvailabilityConfigurationRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    DomainName: S.optional(S.String),
    EwsProvider: S.optional(EwsAvailabilityProvider),
    LambdaProvider: S.optional(LambdaAvailabilityProvider),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TestAvailabilityConfigurationRequest",
}) as any as S.Schema<TestAvailabilityConfigurationRequest>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateAvailabilityConfigurationRequest {
  OrganizationId: string;
  DomainName: string;
  EwsProvider?: EwsAvailabilityProvider;
  LambdaProvider?: LambdaAvailabilityProvider;
}
export const UpdateAvailabilityConfigurationRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    DomainName: S.String,
    EwsProvider: S.optional(EwsAvailabilityProvider),
    LambdaProvider: S.optional(LambdaAvailabilityProvider),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAvailabilityConfigurationRequest",
}) as any as S.Schema<UpdateAvailabilityConfigurationRequest>;
export interface UpdateAvailabilityConfigurationResponse {}
export const UpdateAvailabilityConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateAvailabilityConfigurationResponse",
}) as any as S.Schema<UpdateAvailabilityConfigurationResponse>;
export interface UpdateDefaultMailDomainRequest {
  OrganizationId: string;
  DomainName: string;
}
export const UpdateDefaultMailDomainRequest = S.suspend(() =>
  S.Struct({ OrganizationId: S.String, DomainName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDefaultMailDomainRequest",
}) as any as S.Schema<UpdateDefaultMailDomainRequest>;
export interface UpdateDefaultMailDomainResponse {}
export const UpdateDefaultMailDomainResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDefaultMailDomainResponse",
}) as any as S.Schema<UpdateDefaultMailDomainResponse>;
export interface UpdateGroupRequest {
  OrganizationId: string;
  GroupId: string;
  HiddenFromGlobalAddressList?: boolean;
}
export const UpdateGroupRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    GroupId: S.String,
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateGroupRequest",
}) as any as S.Schema<UpdateGroupRequest>;
export interface UpdateGroupResponse {}
export const UpdateGroupResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateGroupResponse",
}) as any as S.Schema<UpdateGroupResponse>;
export type AccessEffect = "ALLOW" | "DENY" | (string & {});
export const AccessEffect = S.String;
export type TargetUsers = string[];
export const TargetUsers = S.Array(S.String);
export interface ImpersonationRule {
  ImpersonationRuleId: string;
  Name?: string;
  Description?: string;
  Effect: AccessEffect;
  TargetUsers?: string[];
  NotTargetUsers?: string[];
}
export const ImpersonationRule = S.suspend(() =>
  S.Struct({
    ImpersonationRuleId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Effect: AccessEffect,
    TargetUsers: S.optional(TargetUsers),
    NotTargetUsers: S.optional(TargetUsers),
  }),
).annotations({
  identifier: "ImpersonationRule",
}) as any as S.Schema<ImpersonationRule>;
export type ImpersonationRuleList = ImpersonationRule[];
export const ImpersonationRuleList = S.Array(ImpersonationRule);
export interface UpdateImpersonationRoleRequest {
  OrganizationId: string;
  ImpersonationRoleId: string;
  Name: string;
  Type: ImpersonationRoleType;
  Description?: string;
  Rules: ImpersonationRule[];
}
export const UpdateImpersonationRoleRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    ImpersonationRoleId: S.String,
    Name: S.String,
    Type: ImpersonationRoleType,
    Description: S.optional(S.String),
    Rules: ImpersonationRuleList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateImpersonationRoleRequest",
}) as any as S.Schema<UpdateImpersonationRoleRequest>;
export interface UpdateImpersonationRoleResponse {}
export const UpdateImpersonationRoleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateImpersonationRoleResponse",
}) as any as S.Schema<UpdateImpersonationRoleResponse>;
export interface UpdateMailboxQuotaRequest {
  OrganizationId: string;
  UserId: string;
  MailboxQuota: number;
}
export const UpdateMailboxQuotaRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    UserId: S.String,
    MailboxQuota: S.Number,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateMailboxQuotaRequest",
}) as any as S.Schema<UpdateMailboxQuotaRequest>;
export interface UpdateMailboxQuotaResponse {}
export const UpdateMailboxQuotaResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateMailboxQuotaResponse",
}) as any as S.Schema<UpdateMailboxQuotaResponse>;
export interface UpdateMobileDeviceAccessRuleRequest {
  OrganizationId: string;
  MobileDeviceAccessRuleId: string;
  Name: string;
  Description?: string;
  Effect: MobileDeviceAccessRuleEffect;
  DeviceTypes?: string[];
  NotDeviceTypes?: string[];
  DeviceModels?: string[];
  NotDeviceModels?: string[];
  DeviceOperatingSystems?: string[];
  NotDeviceOperatingSystems?: string[];
  DeviceUserAgents?: string[];
  NotDeviceUserAgents?: string[];
}
export const UpdateMobileDeviceAccessRuleRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    MobileDeviceAccessRuleId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    Effect: MobileDeviceAccessRuleEffect,
    DeviceTypes: S.optional(DeviceTypeList),
    NotDeviceTypes: S.optional(DeviceTypeList),
    DeviceModels: S.optional(DeviceModelList),
    NotDeviceModels: S.optional(DeviceModelList),
    DeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
    NotDeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
    DeviceUserAgents: S.optional(DeviceUserAgentList),
    NotDeviceUserAgents: S.optional(DeviceUserAgentList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateMobileDeviceAccessRuleRequest",
}) as any as S.Schema<UpdateMobileDeviceAccessRuleRequest>;
export interface UpdateMobileDeviceAccessRuleResponse {}
export const UpdateMobileDeviceAccessRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateMobileDeviceAccessRuleResponse",
}) as any as S.Schema<UpdateMobileDeviceAccessRuleResponse>;
export interface UpdatePrimaryEmailAddressRequest {
  OrganizationId: string;
  EntityId: string;
  Email: string;
}
export const UpdatePrimaryEmailAddressRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    EntityId: S.String,
    Email: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePrimaryEmailAddressRequest",
}) as any as S.Schema<UpdatePrimaryEmailAddressRequest>;
export interface UpdatePrimaryEmailAddressResponse {}
export const UpdatePrimaryEmailAddressResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdatePrimaryEmailAddressResponse",
}) as any as S.Schema<UpdatePrimaryEmailAddressResponse>;
export interface UpdateUserRequest {
  OrganizationId: string;
  UserId: string;
  Role?: UserRole;
  DisplayName?: string | redacted.Redacted<string>;
  FirstName?: string | redacted.Redacted<string>;
  LastName?: string | redacted.Redacted<string>;
  HiddenFromGlobalAddressList?: boolean;
  Initials?: string | redacted.Redacted<string>;
  Telephone?: string | redacted.Redacted<string>;
  Street?: string | redacted.Redacted<string>;
  JobTitle?: string | redacted.Redacted<string>;
  City?: string | redacted.Redacted<string>;
  Company?: string | redacted.Redacted<string>;
  ZipCode?: string | redacted.Redacted<string>;
  Department?: string | redacted.Redacted<string>;
  Country?: string | redacted.Redacted<string>;
  Office?: string | redacted.Redacted<string>;
  IdentityProviderUserId?: string;
}
export const UpdateUserRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    UserId: S.String,
    Role: S.optional(UserRole),
    DisplayName: S.optional(SensitiveString),
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
    Initials: S.optional(SensitiveString),
    Telephone: S.optional(SensitiveString),
    Street: S.optional(SensitiveString),
    JobTitle: S.optional(SensitiveString),
    City: S.optional(SensitiveString),
    Company: S.optional(SensitiveString),
    ZipCode: S.optional(SensitiveString),
    Department: S.optional(SensitiveString),
    Country: S.optional(SensitiveString),
    Office: S.optional(SensitiveString),
    IdentityProviderUserId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateUserRequest",
}) as any as S.Schema<UpdateUserRequest>;
export interface UpdateUserResponse {}
export const UpdateUserResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateUserResponse",
}) as any as S.Schema<UpdateUserResponse>;
export type EntityState = "ENABLED" | "DISABLED" | "DELETED" | (string & {});
export const EntityState = S.String;
export type PersonalAccessTokenConfigurationStatus =
  | "ACTIVE"
  | "INACTIVE"
  | (string & {});
export const PersonalAccessTokenConfigurationStatus = S.String;
export type FolderName =
  | "INBOX"
  | "DELETED_ITEMS"
  | "SENT_ITEMS"
  | "DRAFTS"
  | "JUNK_EMAIL"
  | (string & {});
export const FolderName = S.String;
export type RetentionAction =
  | "NONE"
  | "DELETE"
  | "PERMANENTLY_DELETE"
  | (string & {});
export const RetentionAction = S.String;
export interface Domain {
  DomainName: string;
  HostedZoneId?: string;
}
export const Domain = S.suspend(() =>
  S.Struct({ DomainName: S.String, HostedZoneId: S.optional(S.String) }),
).annotations({ identifier: "Domain" }) as any as S.Schema<Domain>;
export type Domains = Domain[];
export const Domains = S.Array(Domain);
export type EntityType = "GROUP" | "USER" | "RESOURCE" | (string & {});
export const EntityType = S.String;
export type MailboxExportJobState =
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | (string & {});
export const MailboxExportJobState = S.String;
export type AccessControlRuleNameList = string[];
export const AccessControlRuleNameList = S.Array(S.String);
export type DnsRecordVerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "FAILED"
  | (string & {});
export const DnsRecordVerificationStatus = S.String;
export type PersonalAccessTokenScopeList = string[];
export const PersonalAccessTokenScopeList = S.Array(S.String);
export type Aliases = string[];
export const Aliases = S.Array(S.String);
export interface ListGroupsFilters {
  NamePrefix?: string;
  PrimaryEmailPrefix?: string;
  State?: EntityState;
}
export const ListGroupsFilters = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String),
    PrimaryEmailPrefix: S.optional(S.String),
    State: S.optional(EntityState),
  }),
).annotations({
  identifier: "ListGroupsFilters",
}) as any as S.Schema<ListGroupsFilters>;
export interface ListGroupsForEntityFilters {
  GroupNamePrefix?: string;
}
export const ListGroupsForEntityFilters = S.suspend(() =>
  S.Struct({ GroupNamePrefix: S.optional(S.String) }),
).annotations({
  identifier: "ListGroupsForEntityFilters",
}) as any as S.Schema<ListGroupsForEntityFilters>;
export interface ListResourcesFilters {
  NamePrefix?: string;
  PrimaryEmailPrefix?: string;
  State?: EntityState;
}
export const ListResourcesFilters = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String),
    PrimaryEmailPrefix: S.optional(S.String),
    State: S.optional(EntityState),
  }),
).annotations({
  identifier: "ListResourcesFilters",
}) as any as S.Schema<ListResourcesFilters>;
export interface ListUsersFilters {
  UsernamePrefix?: string;
  DisplayNamePrefix?: string | redacted.Redacted<string>;
  PrimaryEmailPrefix?: string;
  State?: EntityState;
  IdentityProviderUserIdPrefix?: string;
}
export const ListUsersFilters = S.suspend(() =>
  S.Struct({
    UsernamePrefix: S.optional(S.String),
    DisplayNamePrefix: S.optional(SensitiveString),
    PrimaryEmailPrefix: S.optional(S.String),
    State: S.optional(EntityState),
    IdentityProviderUserIdPrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "ListUsersFilters",
}) as any as S.Schema<ListUsersFilters>;
export interface IdentityCenterConfiguration {
  InstanceArn: string;
  ApplicationArn: string;
}
export const IdentityCenterConfiguration = S.suspend(() =>
  S.Struct({ InstanceArn: S.String, ApplicationArn: S.String }),
).annotations({
  identifier: "IdentityCenterConfiguration",
}) as any as S.Schema<IdentityCenterConfiguration>;
export interface PersonalAccessTokenConfiguration {
  Status: PersonalAccessTokenConfigurationStatus;
  LifetimeInDays?: number;
}
export const PersonalAccessTokenConfiguration = S.suspend(() =>
  S.Struct({
    Status: PersonalAccessTokenConfigurationStatus,
    LifetimeInDays: S.optional(S.Number),
  }),
).annotations({
  identifier: "PersonalAccessTokenConfiguration",
}) as any as S.Schema<PersonalAccessTokenConfiguration>;
export interface FolderConfiguration {
  Name: FolderName;
  Action: RetentionAction;
  Period?: number;
}
export const FolderConfiguration = S.suspend(() =>
  S.Struct({
    Name: FolderName,
    Action: RetentionAction,
    Period: S.optional(S.Number),
  }),
).annotations({
  identifier: "FolderConfiguration",
}) as any as S.Schema<FolderConfiguration>;
export type FolderConfigurations = FolderConfiguration[];
export const FolderConfigurations = S.Array(FolderConfiguration);
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface BookingOptions {
  AutoAcceptRequests?: boolean;
  AutoDeclineRecurringRequests?: boolean;
  AutoDeclineConflictingRequests?: boolean;
}
export const BookingOptions = S.suspend(() =>
  S.Struct({
    AutoAcceptRequests: S.optional(S.Boolean),
    AutoDeclineRecurringRequests: S.optional(S.Boolean),
    AutoDeclineConflictingRequests: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "BookingOptions",
}) as any as S.Schema<BookingOptions>;
export interface AssumeImpersonationRoleResponse {
  Token?: string;
  ExpiresIn?: number;
}
export const AssumeImpersonationRoleResponse = S.suspend(() =>
  S.Struct({ Token: S.optional(S.String), ExpiresIn: S.optional(S.Number) }),
).annotations({
  identifier: "AssumeImpersonationRoleResponse",
}) as any as S.Schema<AssumeImpersonationRoleResponse>;
export interface CreateAvailabilityConfigurationRequest {
  ClientToken?: string;
  OrganizationId: string;
  DomainName: string;
  EwsProvider?: EwsAvailabilityProvider;
  LambdaProvider?: LambdaAvailabilityProvider;
}
export const CreateAvailabilityConfigurationRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    OrganizationId: S.String,
    DomainName: S.String,
    EwsProvider: S.optional(EwsAvailabilityProvider),
    LambdaProvider: S.optional(LambdaAvailabilityProvider),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAvailabilityConfigurationRequest",
}) as any as S.Schema<CreateAvailabilityConfigurationRequest>;
export interface CreateAvailabilityConfigurationResponse {}
export const CreateAvailabilityConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateAvailabilityConfigurationResponse",
}) as any as S.Schema<CreateAvailabilityConfigurationResponse>;
export interface CreateGroupResponse {
  GroupId?: string;
}
export const CreateGroupResponse = S.suspend(() =>
  S.Struct({ GroupId: S.optional(S.String) }),
).annotations({
  identifier: "CreateGroupResponse",
}) as any as S.Schema<CreateGroupResponse>;
export interface CreateIdentityCenterApplicationResponse {
  ApplicationArn?: string;
}
export const CreateIdentityCenterApplicationResponse = S.suspend(() =>
  S.Struct({ ApplicationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateIdentityCenterApplicationResponse",
}) as any as S.Schema<CreateIdentityCenterApplicationResponse>;
export interface CreateImpersonationRoleRequest {
  ClientToken?: string;
  OrganizationId: string;
  Name: string;
  Type: ImpersonationRoleType;
  Description?: string;
  Rules: ImpersonationRule[];
}
export const CreateImpersonationRoleRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    OrganizationId: S.String,
    Name: S.String,
    Type: ImpersonationRoleType,
    Description: S.optional(S.String),
    Rules: ImpersonationRuleList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateImpersonationRoleRequest",
}) as any as S.Schema<CreateImpersonationRoleRequest>;
export interface CreateMobileDeviceAccessRuleResponse {
  MobileDeviceAccessRuleId?: string;
}
export const CreateMobileDeviceAccessRuleResponse = S.suspend(() =>
  S.Struct({ MobileDeviceAccessRuleId: S.optional(S.String) }),
).annotations({
  identifier: "CreateMobileDeviceAccessRuleResponse",
}) as any as S.Schema<CreateMobileDeviceAccessRuleResponse>;
export interface CreateOrganizationRequest {
  DirectoryId?: string;
  Alias: string;
  ClientToken?: string;
  Domains?: Domain[];
  KmsKeyArn?: string;
  EnableInteroperability?: boolean;
}
export const CreateOrganizationRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    Alias: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    Domains: S.optional(Domains),
    KmsKeyArn: S.optional(S.String),
    EnableInteroperability: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateOrganizationRequest",
}) as any as S.Schema<CreateOrganizationRequest>;
export interface CreateResourceResponse {
  ResourceId?: string;
}
export const CreateResourceResponse = S.suspend(() =>
  S.Struct({ ResourceId: S.optional(S.String) }),
).annotations({
  identifier: "CreateResourceResponse",
}) as any as S.Schema<CreateResourceResponse>;
export interface CreateUserResponse {
  UserId?: string;
}
export const CreateUserResponse = S.suspend(() =>
  S.Struct({ UserId: S.optional(S.String) }),
).annotations({
  identifier: "CreateUserResponse",
}) as any as S.Schema<CreateUserResponse>;
export interface DeleteOrganizationResponse {
  OrganizationId?: string;
  State?: string;
}
export const DeleteOrganizationResponse = S.suspend(() =>
  S.Struct({
    OrganizationId: S.optional(S.String),
    State: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteOrganizationResponse",
}) as any as S.Schema<DeleteOrganizationResponse>;
export interface DescribeEmailMonitoringConfigurationResponse {
  RoleArn?: string;
  LogGroupArn?: string;
}
export const DescribeEmailMonitoringConfigurationResponse = S.suspend(() =>
  S.Struct({
    RoleArn: S.optional(S.String),
    LogGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeEmailMonitoringConfigurationResponse",
}) as any as S.Schema<DescribeEmailMonitoringConfigurationResponse>;
export interface DescribeEntityResponse {
  EntityId?: string;
  Name?: string;
  Type?: EntityType;
}
export const DescribeEntityResponse = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(EntityType),
  }),
).annotations({
  identifier: "DescribeEntityResponse",
}) as any as S.Schema<DescribeEntityResponse>;
export interface DescribeGroupResponse {
  GroupId?: string;
  Name?: string;
  Email?: string;
  State?: EntityState;
  EnabledDate?: Date;
  DisabledDate?: Date;
  HiddenFromGlobalAddressList?: boolean;
}
export const DescribeGroupResponse = S.suspend(() =>
  S.Struct({
    GroupId: S.optional(S.String),
    Name: S.optional(S.String),
    Email: S.optional(S.String),
    State: S.optional(EntityState),
    EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DescribeGroupResponse",
}) as any as S.Schema<DescribeGroupResponse>;
export interface DescribeIdentityProviderConfigurationResponse {
  AuthenticationMode?: IdentityProviderAuthenticationMode;
  IdentityCenterConfiguration?: IdentityCenterConfiguration;
  PersonalAccessTokenConfiguration?: PersonalAccessTokenConfiguration;
}
export const DescribeIdentityProviderConfigurationResponse = S.suspend(() =>
  S.Struct({
    AuthenticationMode: S.optional(IdentityProviderAuthenticationMode),
    IdentityCenterConfiguration: S.optional(IdentityCenterConfiguration),
    PersonalAccessTokenConfiguration: S.optional(
      PersonalAccessTokenConfiguration,
    ),
  }),
).annotations({
  identifier: "DescribeIdentityProviderConfigurationResponse",
}) as any as S.Schema<DescribeIdentityProviderConfigurationResponse>;
export interface DescribeInboundDmarcSettingsResponse {
  Enforced?: boolean;
}
export const DescribeInboundDmarcSettingsResponse = S.suspend(() =>
  S.Struct({ Enforced: S.optional(S.Boolean) }),
).annotations({
  identifier: "DescribeInboundDmarcSettingsResponse",
}) as any as S.Schema<DescribeInboundDmarcSettingsResponse>;
export interface DescribeMailboxExportJobResponse {
  EntityId?: string;
  Description?: string;
  RoleArn?: string;
  KmsKeyArn?: string;
  S3BucketName?: string;
  S3Prefix?: string;
  S3Path?: string;
  EstimatedProgress?: number;
  State?: MailboxExportJobState;
  ErrorInfo?: string;
  StartTime?: Date;
  EndTime?: Date;
}
export const DescribeMailboxExportJobResponse = S.suspend(() =>
  S.Struct({
    EntityId: S.optional(S.String),
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    S3Prefix: S.optional(S.String),
    S3Path: S.optional(S.String),
    EstimatedProgress: S.optional(S.Number),
    State: S.optional(MailboxExportJobState),
    ErrorInfo: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeMailboxExportJobResponse",
}) as any as S.Schema<DescribeMailboxExportJobResponse>;
export interface DescribeOrganizationResponse {
  OrganizationId?: string;
  Alias?: string;
  State?: string;
  DirectoryId?: string;
  DirectoryType?: string;
  DefaultMailDomain?: string;
  CompletedDate?: Date;
  ErrorMessage?: string;
  ARN?: string;
  MigrationAdmin?: string;
  InteroperabilityEnabled?: boolean;
}
export const DescribeOrganizationResponse = S.suspend(() =>
  S.Struct({
    OrganizationId: S.optional(S.String),
    Alias: S.optional(S.String),
    State: S.optional(S.String),
    DirectoryId: S.optional(S.String),
    DirectoryType: S.optional(S.String),
    DefaultMailDomain: S.optional(S.String),
    CompletedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ErrorMessage: S.optional(S.String),
    ARN: S.optional(S.String),
    MigrationAdmin: S.optional(S.String),
    InteroperabilityEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DescribeOrganizationResponse",
}) as any as S.Schema<DescribeOrganizationResponse>;
export interface DescribeResourceResponse {
  ResourceId?: string;
  Email?: string;
  Name?: string;
  Type?: ResourceType;
  BookingOptions?: BookingOptions;
  State?: EntityState;
  EnabledDate?: Date;
  DisabledDate?: Date;
  Description?: string | redacted.Redacted<string>;
  HiddenFromGlobalAddressList?: boolean;
}
export const DescribeResourceResponse = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String),
    Email: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(ResourceType),
    BookingOptions: S.optional(BookingOptions),
    State: S.optional(EntityState),
    EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(SensitiveString),
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DescribeResourceResponse",
}) as any as S.Schema<DescribeResourceResponse>;
export interface DescribeUserResponse {
  UserId?: string;
  Name?: string;
  Email?: string;
  DisplayName?: string | redacted.Redacted<string>;
  State?: EntityState;
  UserRole?: UserRole;
  EnabledDate?: Date;
  DisabledDate?: Date;
  MailboxProvisionedDate?: Date;
  MailboxDeprovisionedDate?: Date;
  FirstName?: string | redacted.Redacted<string>;
  LastName?: string | redacted.Redacted<string>;
  HiddenFromGlobalAddressList?: boolean;
  Initials?: string | redacted.Redacted<string>;
  Telephone?: string | redacted.Redacted<string>;
  Street?: string | redacted.Redacted<string>;
  JobTitle?: string | redacted.Redacted<string>;
  City?: string | redacted.Redacted<string>;
  Company?: string | redacted.Redacted<string>;
  ZipCode?: string | redacted.Redacted<string>;
  Department?: string | redacted.Redacted<string>;
  Country?: string | redacted.Redacted<string>;
  Office?: string | redacted.Redacted<string>;
  IdentityProviderUserId?: string;
  IdentityProviderIdentityStoreId?: string;
}
export const DescribeUserResponse = S.suspend(() =>
  S.Struct({
    UserId: S.optional(S.String),
    Name: S.optional(S.String),
    Email: S.optional(S.String),
    DisplayName: S.optional(SensitiveString),
    State: S.optional(EntityState),
    UserRole: S.optional(UserRole),
    EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MailboxProvisionedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MailboxDeprovisionedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FirstName: S.optional(SensitiveString),
    LastName: S.optional(SensitiveString),
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
    Initials: S.optional(SensitiveString),
    Telephone: S.optional(SensitiveString),
    Street: S.optional(SensitiveString),
    JobTitle: S.optional(SensitiveString),
    City: S.optional(SensitiveString),
    Company: S.optional(SensitiveString),
    ZipCode: S.optional(SensitiveString),
    Department: S.optional(SensitiveString),
    Country: S.optional(SensitiveString),
    Office: S.optional(SensitiveString),
    IdentityProviderUserId: S.optional(S.String),
    IdentityProviderIdentityStoreId: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeUserResponse",
}) as any as S.Schema<DescribeUserResponse>;
export interface GetAccessControlEffectResponse {
  Effect?: AccessControlRuleEffect;
  MatchedRules?: string[];
}
export const GetAccessControlEffectResponse = S.suspend(() =>
  S.Struct({
    Effect: S.optional(AccessControlRuleEffect),
    MatchedRules: S.optional(AccessControlRuleNameList),
  }),
).annotations({
  identifier: "GetAccessControlEffectResponse",
}) as any as S.Schema<GetAccessControlEffectResponse>;
export interface GetDefaultRetentionPolicyResponse {
  Id?: string;
  Name?: string;
  Description?: string;
  FolderConfigurations?: FolderConfiguration[];
}
export const GetDefaultRetentionPolicyResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    FolderConfigurations: S.optional(FolderConfigurations),
  }),
).annotations({
  identifier: "GetDefaultRetentionPolicyResponse",
}) as any as S.Schema<GetDefaultRetentionPolicyResponse>;
export interface GetImpersonationRoleResponse {
  ImpersonationRoleId?: string;
  Name?: string;
  Type?: ImpersonationRoleType;
  Description?: string;
  Rules?: ImpersonationRule[];
  DateCreated?: Date;
  DateModified?: Date;
}
export const GetImpersonationRoleResponse = S.suspend(() =>
  S.Struct({
    ImpersonationRoleId: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(ImpersonationRoleType),
    Description: S.optional(S.String),
    Rules: S.optional(ImpersonationRuleList),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetImpersonationRoleResponse",
}) as any as S.Schema<GetImpersonationRoleResponse>;
export interface GetMailboxDetailsResponse {
  MailboxQuota?: number;
  MailboxSize?: number;
}
export const GetMailboxDetailsResponse = S.suspend(() =>
  S.Struct({
    MailboxQuota: S.optional(S.Number),
    MailboxSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetMailboxDetailsResponse",
}) as any as S.Schema<GetMailboxDetailsResponse>;
export interface GetMobileDeviceAccessOverrideResponse {
  UserId?: string;
  DeviceId?: string;
  Effect?: MobileDeviceAccessRuleEffect;
  Description?: string;
  DateCreated?: Date;
  DateModified?: Date;
}
export const GetMobileDeviceAccessOverrideResponse = S.suspend(() =>
  S.Struct({
    UserId: S.optional(S.String),
    DeviceId: S.optional(S.String),
    Effect: S.optional(MobileDeviceAccessRuleEffect),
    Description: S.optional(S.String),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetMobileDeviceAccessOverrideResponse",
}) as any as S.Schema<GetMobileDeviceAccessOverrideResponse>;
export interface GetPersonalAccessTokenMetadataResponse {
  PersonalAccessTokenId?: string;
  UserId?: string;
  Name?: string;
  DateCreated?: Date;
  DateLastUsed?: Date;
  ExpiresTime?: Date;
  Scopes?: string[];
}
export const GetPersonalAccessTokenMetadataResponse = S.suspend(() =>
  S.Struct({
    PersonalAccessTokenId: S.optional(S.String),
    UserId: S.optional(S.String),
    Name: S.optional(S.String),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DateLastUsed: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExpiresTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Scopes: S.optional(PersonalAccessTokenScopeList),
  }),
).annotations({
  identifier: "GetPersonalAccessTokenMetadataResponse",
}) as any as S.Schema<GetPersonalAccessTokenMetadataResponse>;
export interface ListAliasesResponse {
  Aliases?: string[];
  NextToken?: string;
}
export const ListAliasesResponse = S.suspend(() =>
  S.Struct({ Aliases: S.optional(Aliases), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAliasesResponse",
}) as any as S.Schema<ListAliasesResponse>;
export interface ListGroupsRequest {
  OrganizationId: string;
  NextToken?: string;
  MaxResults?: number;
  Filters?: ListGroupsFilters;
}
export const ListGroupsRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(ListGroupsFilters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListGroupsRequest",
}) as any as S.Schema<ListGroupsRequest>;
export interface ListGroupsForEntityRequest {
  OrganizationId: string;
  EntityId: string;
  Filters?: ListGroupsForEntityFilters;
  NextToken?: string;
  MaxResults?: number;
}
export const ListGroupsForEntityRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    EntityId: S.String,
    Filters: S.optional(ListGroupsForEntityFilters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListGroupsForEntityRequest",
}) as any as S.Schema<ListGroupsForEntityRequest>;
export interface ListResourcesRequest {
  OrganizationId: string;
  NextToken?: string;
  MaxResults?: number;
  Filters?: ListResourcesFilters;
}
export const ListResourcesRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(ListResourcesFilters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResourcesRequest",
}) as any as S.Schema<ListResourcesRequest>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListUsersRequest {
  OrganizationId: string;
  NextToken?: string;
  MaxResults?: number;
  Filters?: ListUsersFilters;
}
export const ListUsersRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(ListUsersFilters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListUsersRequest",
}) as any as S.Schema<ListUsersRequest>;
export interface PutIdentityProviderConfigurationRequest {
  OrganizationId: string;
  AuthenticationMode: IdentityProviderAuthenticationMode;
  IdentityCenterConfiguration: IdentityCenterConfiguration;
  PersonalAccessTokenConfiguration: PersonalAccessTokenConfiguration;
}
export const PutIdentityProviderConfigurationRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    AuthenticationMode: IdentityProviderAuthenticationMode,
    IdentityCenterConfiguration: IdentityCenterConfiguration,
    PersonalAccessTokenConfiguration: PersonalAccessTokenConfiguration,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutIdentityProviderConfigurationRequest",
}) as any as S.Schema<PutIdentityProviderConfigurationRequest>;
export interface PutIdentityProviderConfigurationResponse {}
export const PutIdentityProviderConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutIdentityProviderConfigurationResponse",
}) as any as S.Schema<PutIdentityProviderConfigurationResponse>;
export interface PutRetentionPolicyRequest {
  OrganizationId: string;
  Id?: string;
  Name: string;
  Description?: string | redacted.Redacted<string>;
  FolderConfigurations: FolderConfiguration[];
}
export const PutRetentionPolicyRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    Id: S.optional(S.String),
    Name: S.String,
    Description: S.optional(SensitiveString),
    FolderConfigurations: FolderConfigurations,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutRetentionPolicyRequest",
}) as any as S.Schema<PutRetentionPolicyRequest>;
export interface PutRetentionPolicyResponse {}
export const PutRetentionPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutRetentionPolicyResponse",
}) as any as S.Schema<PutRetentionPolicyResponse>;
export interface StartMailboxExportJobResponse {
  JobId?: string;
}
export const StartMailboxExportJobResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StartMailboxExportJobResponse",
}) as any as S.Schema<StartMailboxExportJobResponse>;
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface TestAvailabilityConfigurationResponse {
  TestPassed?: boolean;
  FailureReason?: string;
}
export const TestAvailabilityConfigurationResponse = S.suspend(() =>
  S.Struct({
    TestPassed: S.optional(S.Boolean),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "TestAvailabilityConfigurationResponse",
}) as any as S.Schema<TestAvailabilityConfigurationResponse>;
export interface UpdateResourceRequest {
  OrganizationId: string;
  ResourceId: string;
  Name?: string;
  BookingOptions?: BookingOptions;
  Description?: string | redacted.Redacted<string>;
  Type?: ResourceType;
  HiddenFromGlobalAddressList?: boolean;
}
export const UpdateResourceRequest = S.suspend(() =>
  S.Struct({
    OrganizationId: S.String,
    ResourceId: S.String,
    Name: S.optional(S.String),
    BookingOptions: S.optional(BookingOptions),
    Description: S.optional(SensitiveString),
    Type: S.optional(ResourceType),
    HiddenFromGlobalAddressList: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateResourceRequest",
}) as any as S.Schema<UpdateResourceRequest>;
export interface UpdateResourceResponse {}
export const UpdateResourceResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdateResourceResponse" },
) as any as S.Schema<UpdateResourceResponse>;
export type AvailabilityProviderType = "EWS" | "LAMBDA" | (string & {});
export const AvailabilityProviderType = S.String;
export type MemberType = "GROUP" | "USER" | (string & {});
export const MemberType = S.String;
export interface ImpersonationMatchedRule {
  ImpersonationRuleId?: string;
  Name?: string;
}
export const ImpersonationMatchedRule = S.suspend(() =>
  S.Struct({
    ImpersonationRuleId: S.optional(S.String),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "ImpersonationMatchedRule",
}) as any as S.Schema<ImpersonationMatchedRule>;
export type ImpersonationMatchedRuleList = ImpersonationMatchedRule[];
export const ImpersonationMatchedRuleList = S.Array(ImpersonationMatchedRule);
export interface DnsRecord {
  Type?: string;
  Hostname?: string;
  Value?: string;
}
export const DnsRecord = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Hostname: S.optional(S.String),
    Value: S.optional(S.String),
  }),
).annotations({ identifier: "DnsRecord" }) as any as S.Schema<DnsRecord>;
export type DnsRecords = DnsRecord[];
export const DnsRecords = S.Array(DnsRecord);
export interface MobileDeviceAccessMatchedRule {
  MobileDeviceAccessRuleId?: string;
  Name?: string;
}
export const MobileDeviceAccessMatchedRule = S.suspend(() =>
  S.Struct({
    MobileDeviceAccessRuleId: S.optional(S.String),
    Name: S.optional(S.String),
  }),
).annotations({
  identifier: "MobileDeviceAccessMatchedRule",
}) as any as S.Schema<MobileDeviceAccessMatchedRule>;
export type MobileDeviceAccessMatchedRuleList = MobileDeviceAccessMatchedRule[];
export const MobileDeviceAccessMatchedRuleList = S.Array(
  MobileDeviceAccessMatchedRule,
);
export interface AccessControlRule {
  Name?: string;
  Effect?: AccessControlRuleEffect;
  Description?: string;
  IpRanges?: string[];
  NotIpRanges?: string[];
  Actions?: string[];
  NotActions?: string[];
  UserIds?: string[];
  NotUserIds?: string[];
  DateCreated?: Date;
  DateModified?: Date;
  ImpersonationRoleIds?: string[];
  NotImpersonationRoleIds?: string[];
}
export const AccessControlRule = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Effect: S.optional(AccessControlRuleEffect),
    Description: S.optional(S.String),
    IpRanges: S.optional(IpRangeList),
    NotIpRanges: S.optional(IpRangeList),
    Actions: S.optional(ActionsList),
    NotActions: S.optional(ActionsList),
    UserIds: S.optional(UserIdList),
    NotUserIds: S.optional(UserIdList),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ImpersonationRoleIds: S.optional(ImpersonationRoleIdList),
    NotImpersonationRoleIds: S.optional(ImpersonationRoleIdList),
  }),
).annotations({
  identifier: "AccessControlRule",
}) as any as S.Schema<AccessControlRule>;
export type AccessControlRulesList = AccessControlRule[];
export const AccessControlRulesList = S.Array(AccessControlRule);
export interface Member {
  Id?: string;
  Name?: string;
  Type?: MemberType;
  State?: EntityState;
  EnabledDate?: Date;
  DisabledDate?: Date;
}
export const Member = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(MemberType),
    State: S.optional(EntityState),
    EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Member" }) as any as S.Schema<Member>;
export type Members = Member[];
export const Members = S.Array(Member);
export interface ImpersonationRole {
  ImpersonationRoleId?: string;
  Name?: string;
  Type?: ImpersonationRoleType;
  DateCreated?: Date;
  DateModified?: Date;
}
export const ImpersonationRole = S.suspend(() =>
  S.Struct({
    ImpersonationRoleId: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(ImpersonationRoleType),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ImpersonationRole",
}) as any as S.Schema<ImpersonationRole>;
export type ImpersonationRoleList = ImpersonationRole[];
export const ImpersonationRoleList = S.Array(ImpersonationRole);
export interface MailboxExportJob {
  JobId?: string;
  EntityId?: string;
  Description?: string;
  S3BucketName?: string;
  S3Path?: string;
  EstimatedProgress?: number;
  State?: MailboxExportJobState;
  StartTime?: Date;
  EndTime?: Date;
}
export const MailboxExportJob = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    EntityId: S.optional(S.String),
    Description: S.optional(S.String),
    S3BucketName: S.optional(S.String),
    S3Path: S.optional(S.String),
    EstimatedProgress: S.optional(S.Number),
    State: S.optional(MailboxExportJobState),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "MailboxExportJob",
}) as any as S.Schema<MailboxExportJob>;
export type Jobs = MailboxExportJob[];
export const Jobs = S.Array(MailboxExportJob);
export interface Permission {
  GranteeId: string;
  GranteeType: MemberType;
  PermissionValues: PermissionType[];
}
export const Permission = S.suspend(() =>
  S.Struct({
    GranteeId: S.String,
    GranteeType: MemberType,
    PermissionValues: PermissionValues,
  }),
).annotations({ identifier: "Permission" }) as any as S.Schema<Permission>;
export type Permissions = Permission[];
export const Permissions = S.Array(Permission);
export interface MailDomainSummary {
  DomainName?: string;
  DefaultDomain?: boolean;
}
export const MailDomainSummary = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    DefaultDomain: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "MailDomainSummary",
}) as any as S.Schema<MailDomainSummary>;
export type MailDomains = MailDomainSummary[];
export const MailDomains = S.Array(MailDomainSummary);
export interface MobileDeviceAccessOverride {
  UserId?: string;
  DeviceId?: string;
  Effect?: MobileDeviceAccessRuleEffect;
  Description?: string;
  DateCreated?: Date;
  DateModified?: Date;
}
export const MobileDeviceAccessOverride = S.suspend(() =>
  S.Struct({
    UserId: S.optional(S.String),
    DeviceId: S.optional(S.String),
    Effect: S.optional(MobileDeviceAccessRuleEffect),
    Description: S.optional(S.String),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "MobileDeviceAccessOverride",
}) as any as S.Schema<MobileDeviceAccessOverride>;
export type MobileDeviceAccessOverridesList = MobileDeviceAccessOverride[];
export const MobileDeviceAccessOverridesList = S.Array(
  MobileDeviceAccessOverride,
);
export interface MobileDeviceAccessRule {
  MobileDeviceAccessRuleId?: string;
  Name?: string;
  Description?: string;
  Effect?: MobileDeviceAccessRuleEffect;
  DeviceTypes?: string[];
  NotDeviceTypes?: string[];
  DeviceModels?: string[];
  NotDeviceModels?: string[];
  DeviceOperatingSystems?: string[];
  NotDeviceOperatingSystems?: string[];
  DeviceUserAgents?: string[];
  NotDeviceUserAgents?: string[];
  DateCreated?: Date;
  DateModified?: Date;
}
export const MobileDeviceAccessRule = S.suspend(() =>
  S.Struct({
    MobileDeviceAccessRuleId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Effect: S.optional(MobileDeviceAccessRuleEffect),
    DeviceTypes: S.optional(DeviceTypeList),
    NotDeviceTypes: S.optional(DeviceTypeList),
    DeviceModels: S.optional(DeviceModelList),
    NotDeviceModels: S.optional(DeviceModelList),
    DeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
    NotDeviceOperatingSystems: S.optional(DeviceOperatingSystemList),
    DeviceUserAgents: S.optional(DeviceUserAgentList),
    NotDeviceUserAgents: S.optional(DeviceUserAgentList),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "MobileDeviceAccessRule",
}) as any as S.Schema<MobileDeviceAccessRule>;
export type MobileDeviceAccessRulesList = MobileDeviceAccessRule[];
export const MobileDeviceAccessRulesList = S.Array(MobileDeviceAccessRule);
export interface OrganizationSummary {
  OrganizationId?: string;
  Alias?: string;
  DefaultMailDomain?: string;
  ErrorMessage?: string;
  State?: string;
}
export const OrganizationSummary = S.suspend(() =>
  S.Struct({
    OrganizationId: S.optional(S.String),
    Alias: S.optional(S.String),
    DefaultMailDomain: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    State: S.optional(S.String),
  }),
).annotations({
  identifier: "OrganizationSummary",
}) as any as S.Schema<OrganizationSummary>;
export type OrganizationSummaries = OrganizationSummary[];
export const OrganizationSummaries = S.Array(OrganizationSummary);
export interface PersonalAccessTokenSummary {
  PersonalAccessTokenId?: string;
  UserId?: string;
  Name?: string;
  DateCreated?: Date;
  DateLastUsed?: Date;
  ExpiresTime?: Date;
  Scopes?: string[];
}
export const PersonalAccessTokenSummary = S.suspend(() =>
  S.Struct({
    PersonalAccessTokenId: S.optional(S.String),
    UserId: S.optional(S.String),
    Name: S.optional(S.String),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DateLastUsed: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExpiresTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Scopes: S.optional(PersonalAccessTokenScopeList),
  }),
).annotations({
  identifier: "PersonalAccessTokenSummary",
}) as any as S.Schema<PersonalAccessTokenSummary>;
export type PersonalAccessTokenSummaryList = PersonalAccessTokenSummary[];
export const PersonalAccessTokenSummaryList = S.Array(
  PersonalAccessTokenSummary,
);
export interface Delegate {
  Id: string;
  Type: MemberType;
}
export const Delegate = S.suspend(() =>
  S.Struct({ Id: S.String, Type: MemberType }),
).annotations({ identifier: "Delegate" }) as any as S.Schema<Delegate>;
export type ResourceDelegates = Delegate[];
export const ResourceDelegates = S.Array(Delegate);
export interface CreateImpersonationRoleResponse {
  ImpersonationRoleId?: string;
}
export const CreateImpersonationRoleResponse = S.suspend(() =>
  S.Struct({ ImpersonationRoleId: S.optional(S.String) }),
).annotations({
  identifier: "CreateImpersonationRoleResponse",
}) as any as S.Schema<CreateImpersonationRoleResponse>;
export interface CreateOrganizationResponse {
  OrganizationId?: string;
}
export const CreateOrganizationResponse = S.suspend(() =>
  S.Struct({ OrganizationId: S.optional(S.String) }),
).annotations({
  identifier: "CreateOrganizationResponse",
}) as any as S.Schema<CreateOrganizationResponse>;
export interface GetImpersonationRoleEffectResponse {
  Type?: ImpersonationRoleType;
  Effect?: AccessEffect;
  MatchedRules?: ImpersonationMatchedRule[];
}
export const GetImpersonationRoleEffectResponse = S.suspend(() =>
  S.Struct({
    Type: S.optional(ImpersonationRoleType),
    Effect: S.optional(AccessEffect),
    MatchedRules: S.optional(ImpersonationMatchedRuleList),
  }),
).annotations({
  identifier: "GetImpersonationRoleEffectResponse",
}) as any as S.Schema<GetImpersonationRoleEffectResponse>;
export interface GetMailDomainResponse {
  Records?: DnsRecord[];
  IsTestDomain?: boolean;
  IsDefault?: boolean;
  OwnershipVerificationStatus?: DnsRecordVerificationStatus;
  DkimVerificationStatus?: DnsRecordVerificationStatus;
}
export const GetMailDomainResponse = S.suspend(() =>
  S.Struct({
    Records: S.optional(DnsRecords),
    IsTestDomain: S.optional(S.Boolean),
    IsDefault: S.optional(S.Boolean),
    OwnershipVerificationStatus: S.optional(DnsRecordVerificationStatus),
    DkimVerificationStatus: S.optional(DnsRecordVerificationStatus),
  }),
).annotations({
  identifier: "GetMailDomainResponse",
}) as any as S.Schema<GetMailDomainResponse>;
export interface GetMobileDeviceAccessEffectResponse {
  Effect?: MobileDeviceAccessRuleEffect;
  MatchedRules?: MobileDeviceAccessMatchedRule[];
}
export const GetMobileDeviceAccessEffectResponse = S.suspend(() =>
  S.Struct({
    Effect: S.optional(MobileDeviceAccessRuleEffect),
    MatchedRules: S.optional(MobileDeviceAccessMatchedRuleList),
  }),
).annotations({
  identifier: "GetMobileDeviceAccessEffectResponse",
}) as any as S.Schema<GetMobileDeviceAccessEffectResponse>;
export interface ListAccessControlRulesResponse {
  Rules?: AccessControlRule[];
}
export const ListAccessControlRulesResponse = S.suspend(() =>
  S.Struct({ Rules: S.optional(AccessControlRulesList) }),
).annotations({
  identifier: "ListAccessControlRulesResponse",
}) as any as S.Schema<ListAccessControlRulesResponse>;
export interface ListGroupMembersResponse {
  Members?: Member[];
  NextToken?: string;
}
export const ListGroupMembersResponse = S.suspend(() =>
  S.Struct({ Members: S.optional(Members), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListGroupMembersResponse",
}) as any as S.Schema<ListGroupMembersResponse>;
export interface ListImpersonationRolesResponse {
  Roles?: ImpersonationRole[];
  NextToken?: string;
}
export const ListImpersonationRolesResponse = S.suspend(() =>
  S.Struct({
    Roles: S.optional(ImpersonationRoleList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListImpersonationRolesResponse",
}) as any as S.Schema<ListImpersonationRolesResponse>;
export interface ListMailboxExportJobsResponse {
  Jobs?: MailboxExportJob[];
  NextToken?: string;
}
export const ListMailboxExportJobsResponse = S.suspend(() =>
  S.Struct({ Jobs: S.optional(Jobs), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListMailboxExportJobsResponse",
}) as any as S.Schema<ListMailboxExportJobsResponse>;
export interface ListMailboxPermissionsResponse {
  Permissions?: Permission[];
  NextToken?: string;
}
export const ListMailboxPermissionsResponse = S.suspend(() =>
  S.Struct({
    Permissions: S.optional(Permissions),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMailboxPermissionsResponse",
}) as any as S.Schema<ListMailboxPermissionsResponse>;
export interface ListMailDomainsResponse {
  MailDomains?: MailDomainSummary[];
  NextToken?: string;
}
export const ListMailDomainsResponse = S.suspend(() =>
  S.Struct({
    MailDomains: S.optional(MailDomains),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMailDomainsResponse",
}) as any as S.Schema<ListMailDomainsResponse>;
export interface ListMobileDeviceAccessOverridesResponse {
  Overrides?: MobileDeviceAccessOverride[];
  NextToken?: string;
}
export const ListMobileDeviceAccessOverridesResponse = S.suspend(() =>
  S.Struct({
    Overrides: S.optional(MobileDeviceAccessOverridesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMobileDeviceAccessOverridesResponse",
}) as any as S.Schema<ListMobileDeviceAccessOverridesResponse>;
export interface ListMobileDeviceAccessRulesResponse {
  Rules?: MobileDeviceAccessRule[];
}
export const ListMobileDeviceAccessRulesResponse = S.suspend(() =>
  S.Struct({ Rules: S.optional(MobileDeviceAccessRulesList) }),
).annotations({
  identifier: "ListMobileDeviceAccessRulesResponse",
}) as any as S.Schema<ListMobileDeviceAccessRulesResponse>;
export interface ListOrganizationsResponse {
  OrganizationSummaries?: OrganizationSummary[];
  NextToken?: string;
}
export const ListOrganizationsResponse = S.suspend(() =>
  S.Struct({
    OrganizationSummaries: S.optional(OrganizationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOrganizationsResponse",
}) as any as S.Schema<ListOrganizationsResponse>;
export interface ListPersonalAccessTokensResponse {
  NextToken?: string;
  PersonalAccessTokenSummaries?: PersonalAccessTokenSummary[];
}
export const ListPersonalAccessTokensResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    PersonalAccessTokenSummaries: S.optional(PersonalAccessTokenSummaryList),
  }),
).annotations({
  identifier: "ListPersonalAccessTokensResponse",
}) as any as S.Schema<ListPersonalAccessTokensResponse>;
export interface ListResourceDelegatesResponse {
  Delegates?: Delegate[];
  NextToken?: string;
}
export const ListResourceDelegatesResponse = S.suspend(() =>
  S.Struct({
    Delegates: S.optional(ResourceDelegates),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceDelegatesResponse",
}) as any as S.Schema<ListResourceDelegatesResponse>;
export interface RedactedEwsAvailabilityProvider {
  EwsEndpoint?: string;
  EwsUsername?: string;
}
export const RedactedEwsAvailabilityProvider = S.suspend(() =>
  S.Struct({
    EwsEndpoint: S.optional(S.String),
    EwsUsername: S.optional(S.String),
  }),
).annotations({
  identifier: "RedactedEwsAvailabilityProvider",
}) as any as S.Schema<RedactedEwsAvailabilityProvider>;
export interface AvailabilityConfiguration {
  DomainName?: string;
  ProviderType?: AvailabilityProviderType;
  EwsProvider?: RedactedEwsAvailabilityProvider;
  LambdaProvider?: LambdaAvailabilityProvider;
  DateCreated?: Date;
  DateModified?: Date;
}
export const AvailabilityConfiguration = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    ProviderType: S.optional(AvailabilityProviderType),
    EwsProvider: S.optional(RedactedEwsAvailabilityProvider),
    LambdaProvider: S.optional(LambdaAvailabilityProvider),
    DateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DateModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AvailabilityConfiguration",
}) as any as S.Schema<AvailabilityConfiguration>;
export type AvailabilityConfigurationList = AvailabilityConfiguration[];
export const AvailabilityConfigurationList = S.Array(AvailabilityConfiguration);
export interface Group {
  Id?: string;
  Email?: string;
  Name?: string;
  State?: EntityState;
  EnabledDate?: Date;
  DisabledDate?: Date;
}
export const Group = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Email: S.optional(S.String),
    Name: S.optional(S.String),
    State: S.optional(EntityState),
    EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Group" }) as any as S.Schema<Group>;
export type Groups = Group[];
export const Groups = S.Array(Group);
export interface GroupIdentifier {
  GroupId?: string;
  GroupName?: string;
}
export const GroupIdentifier = S.suspend(() =>
  S.Struct({ GroupId: S.optional(S.String), GroupName: S.optional(S.String) }),
).annotations({
  identifier: "GroupIdentifier",
}) as any as S.Schema<GroupIdentifier>;
export type GroupIdentifiers = GroupIdentifier[];
export const GroupIdentifiers = S.Array(GroupIdentifier);
export interface Resource {
  Id?: string;
  Email?: string;
  Name?: string;
  Type?: ResourceType;
  State?: EntityState;
  EnabledDate?: Date;
  DisabledDate?: Date;
  Description?: string | redacted.Redacted<string>;
}
export const Resource = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Email: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(ResourceType),
    State: S.optional(EntityState),
    EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type Resources = Resource[];
export const Resources = S.Array(Resource);
export interface User {
  Id?: string;
  Email?: string;
  Name?: string;
  DisplayName?: string;
  State?: EntityState;
  UserRole?: UserRole;
  EnabledDate?: Date;
  DisabledDate?: Date;
  IdentityProviderUserId?: string;
  IdentityProviderIdentityStoreId?: string;
}
export const User = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Email: S.optional(S.String),
    Name: S.optional(S.String),
    DisplayName: S.optional(S.String),
    State: S.optional(EntityState),
    UserRole: S.optional(UserRole),
    EnabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DisabledDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IdentityProviderUserId: S.optional(S.String),
    IdentityProviderIdentityStoreId: S.optional(S.String),
  }),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type Users = User[];
export const Users = S.Array(User);
export interface ListAvailabilityConfigurationsResponse {
  AvailabilityConfigurations?: AvailabilityConfiguration[];
  NextToken?: string;
}
export const ListAvailabilityConfigurationsResponse = S.suspend(() =>
  S.Struct({
    AvailabilityConfigurations: S.optional(AvailabilityConfigurationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAvailabilityConfigurationsResponse",
}) as any as S.Schema<ListAvailabilityConfigurationsResponse>;
export interface ListGroupsResponse {
  Groups?: Group[];
  NextToken?: string;
}
export const ListGroupsResponse = S.suspend(() =>
  S.Struct({ Groups: S.optional(Groups), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListGroupsResponse",
}) as any as S.Schema<ListGroupsResponse>;
export interface ListGroupsForEntityResponse {
  Groups?: GroupIdentifier[];
  NextToken?: string;
}
export const ListGroupsForEntityResponse = S.suspend(() =>
  S.Struct({
    Groups: S.optional(GroupIdentifiers),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListGroupsForEntityResponse",
}) as any as S.Schema<ListGroupsForEntityResponse>;
export interface ListResourcesResponse {
  Resources?: Resource[];
  NextToken?: string;
}
export const ListResourcesResponse = S.suspend(() =>
  S.Struct({
    Resources: S.optional(Resources),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourcesResponse",
}) as any as S.Schema<ListResourcesResponse>;
export interface ListUsersResponse {
  Users?: User[];
  NextToken?: string;
}
export const ListUsersResponse = S.suspend(() =>
  S.Struct({ Users: S.optional(Users), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListUsersResponse",
}) as any as S.Schema<ListUsersResponse>;

//# Errors
export class EntityNotFoundException extends S.TaggedError<EntityNotFoundException>()(
  "EntityNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class DirectoryServiceAuthenticationFailedException extends S.TaggedError<DirectoryServiceAuthenticationFailedException>()(
  "DirectoryServiceAuthenticationFailedException",
  { Message: S.optional(S.String) },
) {}
export class EmailAddressInUseException extends S.TaggedError<EmailAddressInUseException>()(
  "EmailAddressInUseException",
  { Message: S.optional(S.String) },
) {}
export class OrganizationNotFoundException extends S.TaggedError<OrganizationNotFoundException>()(
  "OrganizationNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String) },
) {}
export class EntityStateException extends S.TaggedError<EntityStateException>()(
  "EntityStateException",
  { Message: S.optional(S.String) },
) {}
export class InvalidCustomSesConfigurationException extends S.TaggedError<InvalidCustomSesConfigurationException>()(
  "InvalidCustomSesConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DirectoryUnavailableException extends S.TaggedError<DirectoryUnavailableException>()(
  "DirectoryUnavailableException",
  { Message: S.optional(S.String) },
) {}
export class OrganizationStateException extends S.TaggedError<OrganizationStateException>()(
  "OrganizationStateException",
  { Message: S.optional(S.String) },
) {}
export class MailDomainInUseException extends S.TaggedError<MailDomainInUseException>()(
  "MailDomainInUseException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class MailDomainNotFoundException extends S.TaggedError<MailDomainNotFoundException>()(
  "MailDomainNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class DirectoryInUseException extends S.TaggedError<DirectoryInUseException>()(
  "DirectoryInUseException",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String) },
) {}
export class NameAvailabilityException extends S.TaggedError<NameAvailabilityException>()(
  "NameAvailabilityException",
  { Message: S.optional(S.String) },
) {}
export class InvalidPasswordException extends S.TaggedError<InvalidPasswordException>()(
  "InvalidPasswordException",
  { Message: S.optional(S.String) },
) {}
export class InvalidConfigurationException extends S.TaggedError<InvalidConfigurationException>()(
  "InvalidConfigurationException",
  { Message: S.optional(S.String) },
) {}
export class EntityAlreadyRegisteredException extends S.TaggedError<EntityAlreadyRegisteredException>()(
  "EntityAlreadyRegisteredException",
  { Message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MailDomainStateException extends S.TaggedError<MailDomainStateException>()(
  "MailDomainStateException",
  { Message: S.optional(S.String) },
) {}
export class ReservedNameException extends S.TaggedError<ReservedNameException>()(
  "ReservedNameException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Provides more information regarding a given organization based on its
 * identifier.
 */
export const describeOrganization: (
  input: DescribeOrganizationRequest,
) => effect.Effect<
  DescribeOrganizationResponse,
  InvalidParameterException | OrganizationNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOrganizationRequest,
  output: DescribeOrganizationResponse,
  errors: [InvalidParameterException, OrganizationNotFoundException],
}));
/**
 * Untags the specified tags from the specified WorkMail organization
 * resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Creates the WorkMail application in IAM Identity Center that can be used later in the WorkMail - IdC integration. For more information, see PutIdentityProviderConfiguration. This action does not affect the authentication settings for any WorkMail organizations.
 */
export const createIdentityCenterApplication: (
  input: CreateIdentityCenterApplicationRequest,
) => effect.Effect<
  CreateIdentityCenterApplicationResponse,
  InvalidParameterException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIdentityCenterApplicationRequest,
  output: CreateIdentityCenterApplicationResponse,
  errors: [InvalidParameterException],
}));
/**
 * Lists the tags applied to an WorkMail organization resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes an access control rule for the specified WorkMail organization.
 *
 * Deleting already deleted and non-existing rules does not produce an error. In those cases, the service sends back an HTTP 200 response with an empty HTTP body.
 */
export const deleteAccessControlRule: (
  input: DeleteAccessControlRuleRequest,
) => effect.Effect<
  DeleteAccessControlRuleResponse,
  OrganizationNotFoundException | OrganizationStateException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessControlRuleRequest,
  output: DeleteAccessControlRuleResponse,
  errors: [OrganizationNotFoundException, OrganizationStateException],
}));
/**
 * Removes a domain from WorkMail, stops email routing to WorkMail, and removes the authorization allowing WorkMail use. SES keeps the domain because other applications may use it. You must first
 * remove any email address used by WorkMail entities before you remove the domain.
 */
export const deregisterMailDomain: (
  input: DeregisterMailDomainRequest,
) => effect.Effect<
  DeregisterMailDomainResponse,
  | InvalidCustomSesConfigurationException
  | InvalidParameterException
  | MailDomainInUseException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterMailDomainRequest,
  output: DeregisterMailDomainResponse,
  errors: [
    InvalidCustomSesConfigurationException,
    InvalidParameterException,
    MailDomainInUseException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Tests whether the given impersonation role can impersonate a target user.
 */
export const getImpersonationRoleEffect: (
  input: GetImpersonationRoleEffectRequest,
) => effect.Effect<
  GetImpersonationRoleEffectResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImpersonationRoleEffectRequest,
  output: GetImpersonationRoleEffectResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Simulates the effect of the mobile device access rules for the given attributes of a sample access event. Use this method to test the effects of the current set of mobile device access
 * rules for the WorkMail organization for a particular user's attributes.
 */
export const getMobileDeviceAccessEffect: (
  input: GetMobileDeviceAccessEffectRequest,
) => effect.Effect<
  GetMobileDeviceAccessEffectResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMobileDeviceAccessEffectRequest,
  output: GetMobileDeviceAccessEffectResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Lists the access control rules for the specified organization.
 */
export const listAccessControlRules: (
  input: ListAccessControlRulesRequest,
) => effect.Effect<
  ListAccessControlRulesResponse,
  OrganizationNotFoundException | OrganizationStateException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccessControlRulesRequest,
  output: ListAccessControlRulesResponse,
  errors: [OrganizationNotFoundException, OrganizationStateException],
}));
/**
 * Returns an overview of the members of a group. Users and groups can be members of a
 * group.
 */
export const listGroupMembers: {
  (
    input: ListGroupMembersRequest,
  ): effect.Effect<
    ListGroupMembersResponse,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupMembersRequest,
  ) => stream.Stream<
    ListGroupMembersResponse,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupMembersRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupMembersRequest,
  output: ListGroupMembersResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the impersonation roles for the given WorkMail organization.
 */
export const listImpersonationRoles: {
  (
    input: ListImpersonationRolesRequest,
  ): effect.Effect<
    ListImpersonationRolesResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListImpersonationRolesRequest,
  ) => stream.Stream<
    ListImpersonationRolesResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListImpersonationRolesRequest,
  ) => stream.Stream<
    unknown,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImpersonationRolesRequest,
  output: ListImpersonationRolesResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the mailbox export jobs started for the specified organization within the last
 * seven days.
 */
export const listMailboxExportJobs: {
  (
    input: ListMailboxExportJobsRequest,
  ): effect.Effect<
    ListMailboxExportJobsResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMailboxExportJobsRequest,
  ) => stream.Stream<
    ListMailboxExportJobsResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMailboxExportJobsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMailboxExportJobsRequest,
  output: ListMailboxExportJobsResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the mailbox permissions associated with a user, group, or resource
 * mailbox.
 */
export const listMailboxPermissions: {
  (
    input: ListMailboxPermissionsRequest,
  ): effect.Effect<
    ListMailboxPermissionsResponse,
    | EntityNotFoundException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMailboxPermissionsRequest,
  ) => stream.Stream<
    ListMailboxPermissionsResponse,
    | EntityNotFoundException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMailboxPermissionsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMailboxPermissionsRequest,
  output: ListMailboxPermissionsResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the mail domains in a given WorkMail organization.
 */
export const listMailDomains: {
  (
    input: ListMailDomainsRequest,
  ): effect.Effect<
    ListMailDomainsResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMailDomainsRequest,
  ) => stream.Stream<
    ListMailDomainsResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMailDomainsRequest,
  ) => stream.Stream<
    unknown,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMailDomainsRequest,
  output: ListMailDomainsResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the mobile device access overrides for any given combination of WorkMail organization, user, or device.
 */
export const listMobileDeviceAccessOverrides: {
  (
    input: ListMobileDeviceAccessOverridesRequest,
  ): effect.Effect<
    ListMobileDeviceAccessOverridesResponse,
    | EntityNotFoundException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMobileDeviceAccessOverridesRequest,
  ) => stream.Stream<
    ListMobileDeviceAccessOverridesResponse,
    | EntityNotFoundException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMobileDeviceAccessOverridesRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMobileDeviceAccessOverridesRequest,
  output: ListMobileDeviceAccessOverridesResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the mobile device access rules for the specified WorkMail organization.
 */
export const listMobileDeviceAccessRules: (
  input: ListMobileDeviceAccessRulesRequest,
) => effect.Effect<
  ListMobileDeviceAccessRulesResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMobileDeviceAccessRulesRequest,
  output: ListMobileDeviceAccessRulesResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Returns summaries of the customer's organizations.
 */
export const listOrganizations: {
  (
    input: ListOrganizationsRequest,
  ): effect.Effect<
    ListOrganizationsResponse,
    InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOrganizationsRequest,
  ) => stream.Stream<
    ListOrganizationsResponse,
    InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOrganizationsRequest,
  ) => stream.Stream<
    unknown,
    InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOrganizationsRequest,
  output: ListOrganizationsResponse,
  errors: [InvalidParameterException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a summary of your Personal Access Tokens.
 */
export const listPersonalAccessTokens: {
  (
    input: ListPersonalAccessTokensRequest,
  ): effect.Effect<
    ListPersonalAccessTokensResponse,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPersonalAccessTokensRequest,
  ) => stream.Stream<
    ListPersonalAccessTokensResponse,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPersonalAccessTokensRequest,
  ) => stream.Stream<
    PersonalAccessTokenSummary,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPersonalAccessTokensRequest,
  output: ListPersonalAccessTokensResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PersonalAccessTokenSummaries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Puts a retention policy to the specified organization.
 */
export const putRetentionPolicy: (
  input: PutRetentionPolicyRequest,
) => effect.Effect<
  PutRetentionPolicyResponse,
  | InvalidParameterException
  | LimitExceededException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRetentionPolicyRequest,
  output: PutRetentionPolicyResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Provides information regarding the user.
 */
export const describeUser: (
  input: DescribeUserRequest,
) => effect.Effect<
  DescribeUserResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserRequest,
  output: DescribeUserResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes the email monitoring configuration for a specified organization.
 */
export const deleteEmailMonitoringConfiguration: (
  input: DeleteEmailMonitoringConfigurationRequest,
) => effect.Effect<
  DeleteEmailMonitoringConfigurationResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEmailMonitoringConfigurationRequest,
  output: DeleteEmailMonitoringConfigurationResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes an WorkMail organization and all underlying AWS resources managed by WorkMail as part of the organization. You can choose whether to delete the associated directory. For more information, see Removing an organization in the *WorkMail Administrator Guide*.
 */
export const deleteOrganization: (
  input: DeleteOrganizationRequest,
) => effect.Effect<
  DeleteOrganizationResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOrganizationRequest,
  output: DeleteOrganizationResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Describes the current email monitoring configuration for a specified organization.
 */
export const describeEmailMonitoringConfiguration: (
  input: DescribeEmailMonitoringConfigurationRequest,
) => effect.Effect<
  DescribeEmailMonitoringConfigurationResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEmailMonitoringConfigurationRequest,
  output: DescribeEmailMonitoringConfigurationResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns basic details about an entity in WorkMail.
 */
export const describeEntity: (
  input: DescribeEntityRequest,
) => effect.Effect<
  DescribeEntityResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEntityRequest,
  output: DescribeEntityResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Returns the data available for the group.
 */
export const describeGroup: (
  input: DescribeGroupRequest,
) => effect.Effect<
  DescribeGroupResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGroupRequest,
  output: DescribeGroupResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Returns detailed information on the current IdC setup for the WorkMail organization.
 */
export const describeIdentityProviderConfiguration: (
  input: DescribeIdentityProviderConfigurationRequest,
) => effect.Effect<
  DescribeIdentityProviderConfigurationResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeIdentityProviderConfigurationRequest,
  output: DescribeIdentityProviderConfigurationResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the settings in a DMARC policy for a specified organization.
 */
export const describeInboundDmarcSettings: (
  input: DescribeInboundDmarcSettingsRequest,
) => effect.Effect<
  DescribeInboundDmarcSettingsResponse,
  OrganizationNotFoundException | OrganizationStateException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInboundDmarcSettingsRequest,
  output: DescribeInboundDmarcSettingsResponse,
  errors: [OrganizationNotFoundException, OrganizationStateException],
}));
/**
 * Describes the current status of a mailbox export job.
 */
export const describeMailboxExportJob: (
  input: DescribeMailboxExportJobRequest,
) => effect.Effect<
  DescribeMailboxExportJobResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMailboxExportJobRequest,
  output: DescribeMailboxExportJobResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Gets the effects of an organization's access control rules as they apply to a
 * specified IPv4 address, access protocol action, and user ID or impersonation role ID. You must provide either the user ID or impersonation role ID. Impersonation role ID can only be used with Action EWS.
 */
export const getAccessControlEffect: (
  input: GetAccessControlEffectRequest,
) => effect.Effect<
  GetAccessControlEffectResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessControlEffectRequest,
  output: GetAccessControlEffectResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets the default retention policy details for the specified organization.
 */
export const getDefaultRetentionPolicy: (
  input: GetDefaultRetentionPolicyRequest,
) => effect.Effect<
  GetDefaultRetentionPolicyResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDefaultRetentionPolicyRequest,
  output: GetDefaultRetentionPolicyResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Gets the impersonation role details for the given WorkMail organization.
 */
export const getImpersonationRole: (
  input: GetImpersonationRoleRequest,
) => effect.Effect<
  GetImpersonationRoleResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImpersonationRoleRequest,
  output: GetImpersonationRoleResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Requests a user's mailbox details for a specified organization and user.
 */
export const getMailboxDetails: (
  input: GetMailboxDetailsRequest,
) => effect.Effect<
  GetMailboxDetailsResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMailboxDetailsRequest,
  output: GetMailboxDetailsResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Gets the mobile device access override for the given WorkMail organization, user, and device.
 */
export const getMobileDeviceAccessOverride: (
  input: GetMobileDeviceAccessOverrideRequest,
) => effect.Effect<
  GetMobileDeviceAccessOverrideResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMobileDeviceAccessOverrideRequest,
  output: GetMobileDeviceAccessOverrideResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Requests details of a specific Personal Access Token within the WorkMail organization.
 */
export const getPersonalAccessTokenMetadata: (
  input: GetPersonalAccessTokenMetadataRequest,
) => effect.Effect<
  GetPersonalAccessTokenMetadataResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPersonalAccessTokenMetadataRequest,
  output: GetPersonalAccessTokenMetadataResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a paginated call to list the aliases associated with a given
 * entity.
 */
export const listAliases: {
  (
    input: ListAliasesRequest,
  ): effect.Effect<
    ListAliasesResponse,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAliasesRequest,
  ) => stream.Stream<
    ListAliasesResponse,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAliasesRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAliasesRequest,
  output: ListAliasesResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Enables integration between IAM Identity Center (IdC) and WorkMail to proxy authentication requests for mailbox users. You can connect your IdC directory or your external directory to WorkMail through
 * IdC and manage access to WorkMail mailboxes in a single place. For enhanced protection, you could enable Multifactor Authentication (MFA) and Personal Access Tokens.
 */
export const putIdentityProviderConfiguration: (
  input: PutIdentityProviderConfigurationRequest,
) => effect.Effect<
  PutIdentityProviderConfigurationResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutIdentityProviderConfigurationRequest,
  output: PutIdentityProviderConfigurationResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Performs a test on an availability provider to ensure that access is allowed. For EWS, it verifies the provided credentials can be used to successfully log in. For Lambda, it verifies that the Lambda function can be invoked and that the resource access
 * policy was configured to deny anonymous access. An anonymous invocation is one done without providing either a `SourceArn` or `SourceAccount` header.
 *
 * The request must contain either one provider definition (`EwsProvider` or
 * `LambdaProvider`) or the `DomainName` parameter. If the
 * `DomainName` parameter is provided, the configuration stored under the
 * `DomainName` will be tested.
 */
export const testAvailabilityConfiguration: (
  input: TestAvailabilityConfigurationRequest,
) => effect.Effect<
  TestAvailabilityConfigurationResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestAvailabilityConfigurationRequest,
  output: TestAvailabilityConfigurationResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Cancels a mailbox export job.
 *
 * If the mailbox export job is near completion, it might not be possible to cancel
 * it.
 */
export const cancelMailboxExportJob: (
  input: CancelMailboxExportJobRequest,
) => effect.Effect<
  CancelMailboxExportJobResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelMailboxExportJobRequest,
  output: CancelMailboxExportJobResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Remove one or more specified aliases from a set of aliases for a given
 * user.
 */
export const deleteAlias: (
  input: DeleteAliasRequest,
) => effect.Effect<
  DeleteAliasResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAliasRequest,
  output: DeleteAliasResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes permissions granted to a member (user or group).
 */
export const deleteMailboxPermissions: (
  input: DeleteMailboxPermissionsRequest,
) => effect.Effect<
  DeleteMailboxPermissionsResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMailboxPermissionsRequest,
  output: DeleteMailboxPermissionsResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes the mobile device access override for the given WorkMail organization, user, and device.
 *
 * Deleting already deleted and non-existing overrides does not produce an error. In those cases, the service sends back an HTTP 200 response with an empty HTTP body.
 */
export const deleteMobileDeviceAccessOverride: (
  input: DeleteMobileDeviceAccessOverrideRequest,
) => effect.Effect<
  DeleteMobileDeviceAccessOverrideResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMobileDeviceAccessOverrideRequest,
  output: DeleteMobileDeviceAccessOverrideResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Mark a user, group, or resource as no longer used in WorkMail. This action
 * disassociates the mailbox and schedules it for clean-up. WorkMail keeps mailboxes for 30 days
 * before they are permanently removed. The functionality in the console is
 * *Disable*.
 */
export const deregisterFromWorkMail: (
  input: DeregisterFromWorkMailRequest,
) => effect.Effect<
  DeregisterFromWorkMailResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterFromWorkMailRequest,
  output: DeregisterFromWorkMailResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Sets permissions for a user, group, or resource. This replaces any pre-existing
 * permissions.
 */
export const putMailboxPermissions: (
  input: PutMailboxPermissionsRequest,
) => effect.Effect<
  PutMailboxPermissionsResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMailboxPermissionsRequest,
  output: PutMailboxPermissionsResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Creates or updates a mobile device access override for the given WorkMail organization, user, and device.
 */
export const putMobileDeviceAccessOverride: (
  input: PutMobileDeviceAccessOverrideRequest,
) => effect.Effect<
  PutMobileDeviceAccessOverrideResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMobileDeviceAccessOverrideRequest,
  output: PutMobileDeviceAccessOverrideResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Updates a user's current mailbox quota for a specified organization and
 * user.
 */
export const updateMailboxQuota: (
  input: UpdateMailboxQuotaRequest,
) => effect.Effect<
  UpdateMailboxQuotaResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMailboxQuotaRequest,
  output: UpdateMailboxQuotaResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Updates a mobile device access rule for the specified WorkMail organization.
 */
export const updateMobileDeviceAccessRule: (
  input: UpdateMobileDeviceAccessRuleRequest,
) => effect.Effect<
  UpdateMobileDeviceAccessRuleResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMobileDeviceAccessRuleRequest,
  output: UpdateMobileDeviceAccessRuleResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes the `AvailabilityConfiguration` for the given WorkMail organization and domain.
 */
export const deleteAvailabilityConfiguration: (
  input: DeleteAvailabilityConfigurationRequest,
) => effect.Effect<
  DeleteAvailabilityConfigurationResponse,
  OrganizationNotFoundException | OrganizationStateException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAvailabilityConfigurationRequest,
  output: DeleteAvailabilityConfigurationResponse,
  errors: [OrganizationNotFoundException, OrganizationStateException],
}));
/**
 * Enables or disables a DMARC policy for a given organization.
 */
export const putInboundDmarcSettings: (
  input: PutInboundDmarcSettingsRequest,
) => effect.Effect<
  PutInboundDmarcSettingsResponse,
  OrganizationNotFoundException | OrganizationStateException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutInboundDmarcSettingsRequest,
  output: PutInboundDmarcSettingsResponse,
  errors: [OrganizationNotFoundException, OrganizationStateException],
}));
/**
 * Deletes the IAM Identity Center application from WorkMail. This action does not affect the authentication settings for any WorkMail organizations.
 */
export const deleteIdentityCenterApplication: (
  input: DeleteIdentityCenterApplicationRequest,
) => effect.Effect<
  DeleteIdentityCenterApplicationResponse,
  InvalidParameterException | OrganizationStateException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentityCenterApplicationRequest,
  output: DeleteIdentityCenterApplicationResponse,
  errors: [InvalidParameterException, OrganizationStateException],
}));
/**
 * Disables the integration between IdC and WorkMail. Authentication will continue with the directory as it was before the IdC integration. You might have to reset your directory passwords and reconfigure your desktop and mobile email clients.
 */
export const deleteIdentityProviderConfiguration: (
  input: DeleteIdentityProviderConfigurationRequest,
) => effect.Effect<
  DeleteIdentityProviderConfigurationResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIdentityProviderConfigurationRequest,
  output: DeleteIdentityProviderConfigurationResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes an impersonation role for the given WorkMail organization.
 */
export const deleteImpersonationRole: (
  input: DeleteImpersonationRoleRequest,
) => effect.Effect<
  DeleteImpersonationRoleResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImpersonationRoleRequest,
  output: DeleteImpersonationRoleResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes a mobile device access rule for the specified WorkMail organization.
 *
 * Deleting already deleted and non-existing rules does not produce an error. In those cases, the service sends back an HTTP 200 response with an empty HTTP body.
 */
export const deleteMobileDeviceAccessRule: (
  input: DeleteMobileDeviceAccessRuleRequest,
) => effect.Effect<
  DeleteMobileDeviceAccessRuleResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMobileDeviceAccessRuleRequest,
  output: DeleteMobileDeviceAccessRuleResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes the Personal Access Token from the provided WorkMail Organization.
 */
export const deletePersonalAccessToken: (
  input: DeletePersonalAccessTokenRequest,
) => effect.Effect<
  DeletePersonalAccessTokenResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePersonalAccessTokenRequest,
  output: DeletePersonalAccessTokenResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes the specified retention policy from the specified organization.
 */
export const deleteRetentionPolicy: (
  input: DeleteRetentionPolicyRequest,
) => effect.Effect<
  DeleteRetentionPolicyResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRetentionPolicyRequest,
  output: DeleteRetentionPolicyResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Creates or updates the email monitoring configuration for a specified organization.
 */
export const putEmailMonitoringConfiguration: (
  input: PutEmailMonitoringConfigurationRequest,
) => effect.Effect<
  PutEmailMonitoringConfigurationResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEmailMonitoringConfigurationRequest,
  output: PutEmailMonitoringConfigurationResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an existing `AvailabilityConfiguration` for the given WorkMail
 * organization and domain.
 */
export const updateAvailabilityConfiguration: (
  input: UpdateAvailabilityConfigurationRequest,
) => effect.Effect<
  UpdateAvailabilityConfigurationResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAvailabilityConfigurationRequest,
  output: UpdateAvailabilityConfigurationResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Assumes an impersonation role for the given WorkMail organization. This method returns an
 * authentication token you can use to make impersonated calls.
 */
export const assumeImpersonationRole: (
  input: AssumeImpersonationRoleRequest,
) => effect.Effect<
  AssumeImpersonationRoleResponse,
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssumeImpersonationRoleRequest,
  output: AssumeImpersonationRoleResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Starts a mailbox export job to export MIME-format email messages and calendar items
 * from the specified mailbox to the specified Amazon Simple Storage Service (Amazon S3)
 * bucket. For more information, see Exporting mailbox content in
 * the *WorkMail Administrator Guide*.
 */
export const startMailboxExportJob: (
  input: StartMailboxExportJobRequest,
) => effect.Effect<
  StartMailboxExportJobResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | LimitExceededException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMailboxExportJobRequest,
  output: StartMailboxExportJobResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    LimitExceededException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Adds a new access control rule for the specified organization. The rule allows or
 * denies access to the organization for the specified IPv4 addresses, access protocol
 * actions, user IDs and impersonation IDs. Adding a new rule with the same name as an existing rule replaces
 * the older rule.
 */
export const putAccessControlRule: (
  input: PutAccessControlRuleRequest,
) => effect.Effect<
  PutAccessControlRuleResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | LimitExceededException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccessControlRuleRequest,
  output: PutAccessControlRuleResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    LimitExceededException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an impersonation role for the given WorkMail organization.
 */
export const updateImpersonationRole: (
  input: UpdateImpersonationRoleRequest,
) => effect.Effect<
  UpdateImpersonationRoleResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | LimitExceededException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateImpersonationRoleRequest,
  output: UpdateImpersonationRoleResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    LimitExceededException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Registers a new domain in WorkMail and SES, and configures it for use by WorkMail. Emails received by SES for this domain are routed to the specified WorkMail organization, and WorkMail has
 * permanent permission to use the specified domain for sending your users' emails.
 */
export const registerMailDomain: (
  input: RegisterMailDomainRequest,
) => effect.Effect<
  RegisterMailDomainResponse,
  | InvalidParameterException
  | LimitExceededException
  | MailDomainInUseException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterMailDomainRequest,
  output: RegisterMailDomainResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    MailDomainInUseException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Creates a new mobile device access rule for the specified WorkMail organization.
 */
export const createMobileDeviceAccessRule: (
  input: CreateMobileDeviceAccessRuleRequest,
) => effect.Effect<
  CreateMobileDeviceAccessRuleResponse,
  | InvalidParameterException
  | LimitExceededException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMobileDeviceAccessRuleRequest,
  output: CreateMobileDeviceAccessRuleResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Creates an impersonation role for the given WorkMail organization.
 *
 * *Idempotency* ensures that an API request completes no more than one
 * time. With an idempotent request, if the original request completes successfully, any
 * subsequent retries also complete successfully without performing any further
 * actions.
 */
export const createImpersonationRole: (
  input: CreateImpersonationRoleRequest,
) => effect.Effect<
  CreateImpersonationRoleResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | LimitExceededException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImpersonationRoleRequest,
  output: CreateImpersonationRoleResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    LimitExceededException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Gets details for a mail domain, including domain records required to configure your domain with recommended security.
 */
export const getMailDomain: (
  input: GetMailDomainRequest,
) => effect.Effect<
  GetMailDomainResponse,
  | InvalidParameterException
  | MailDomainNotFoundException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMailDomainRequest,
  output: GetMailDomainResponse,
  errors: [
    InvalidParameterException,
    MailDomainNotFoundException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * List all the `AvailabilityConfiguration`'s for the given WorkMail organization.
 */
export const listAvailabilityConfigurations: {
  (
    input: ListAvailabilityConfigurationsRequest,
  ): effect.Effect<
    ListAvailabilityConfigurationsResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAvailabilityConfigurationsRequest,
  ) => stream.Stream<
    ListAvailabilityConfigurationsResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAvailabilityConfigurationsRequest,
  ) => stream.Stream<
    AvailabilityConfiguration,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAvailabilityConfigurationsRequest,
  output: ListAvailabilityConfigurationsResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AvailabilityConfigurations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns summaries of the organization's groups.
 */
export const listGroups: {
  (
    input: ListGroupsRequest,
  ): effect.Effect<
    ListGroupsResponse,
    | EntityNotFoundException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupsRequest,
  ) => stream.Stream<
    ListGroupsResponse,
    | EntityNotFoundException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupsRequest,
  output: ListGroupsResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns all the groups to which an entity belongs.
 */
export const listGroupsForEntity: {
  (
    input: ListGroupsForEntityRequest,
  ): effect.Effect<
    ListGroupsForEntityResponse,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGroupsForEntityRequest,
  ) => stream.Stream<
    ListGroupsForEntityResponse,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGroupsForEntityRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGroupsForEntityRequest,
  output: ListGroupsForEntityResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the delegates associated with a resource. Users and groups can be resource
 * delegates and answer requests on behalf of the resource.
 */
export const listResourceDelegates: {
  (
    input: ListResourceDelegatesRequest,
  ): effect.Effect<
    ListResourceDelegatesResponse,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceDelegatesRequest,
  ) => stream.Stream<
    ListResourceDelegatesResponse,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceDelegatesRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | EntityStateException
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourceDelegatesRequest,
  output: ListResourceDelegatesResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns summaries of the organization's resources.
 */
export const listResources: {
  (
    input: ListResourcesRequest,
  ): effect.Effect<
    ListResourcesResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourcesRequest,
  ) => stream.Stream<
    ListResourcesResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourcesRequest,
  ) => stream.Stream<
    unknown,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListResourcesRequest,
  output: ListResourcesResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns summaries of the organization's users.
 */
export const listUsers: {
  (
    input: ListUsersRequest,
  ): effect.Effect<
    ListUsersResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUsersRequest,
  ) => stream.Stream<
    ListUsersResponse,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUsersRequest,
  ) => stream.Stream<
    unknown,
    | InvalidParameterException
    | OrganizationNotFoundException
    | OrganizationStateException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Applies the specified tags to the specified WorkMailorganization
 * resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InvalidParameterException
  | OrganizationStateException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidParameterException,
    OrganizationStateException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Updates the default mail domain for an organization. The default mail domain is used by the WorkMail AWS Console to suggest an email address when enabling a mail user. You can only have one default domain.
 */
export const updateDefaultMailDomain: (
  input: UpdateDefaultMailDomainRequest,
) => effect.Effect<
  UpdateDefaultMailDomainResponse,
  | InvalidParameterException
  | MailDomainNotFoundException
  | MailDomainStateException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDefaultMailDomainRequest,
  output: UpdateDefaultMailDomainResponse,
  errors: [
    InvalidParameterException,
    MailDomainNotFoundException,
    MailDomainStateException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Deletes a group from WorkMail.
 */
export const deleteGroup: (
  input: DeleteGroupRequest,
) => effect.Effect<
  DeleteGroupResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGroupRequest,
  output: DeleteGroupResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes a user from WorkMail and all subsequent systems. Before you can delete a
 * user, the user state must be `DISABLED`. Use the DescribeUser
 * action to confirm the user state.
 *
 * Deleting a user is permanent and cannot be undone. WorkMail archives user mailboxes for
 * 30 days before they are permanently removed.
 */
export const deleteUser: (
  input: DeleteUserRequest,
) => effect.Effect<
  DeleteUserResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Removes a member from a group.
 */
export const disassociateMemberFromGroup: (
  input: DisassociateMemberFromGroupRequest,
) => effect.Effect<
  DisassociateMemberFromGroupResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateMemberFromGroupRequest,
  output: DisassociateMemberFromGroupResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates data for the user. To have the latest information, it must be preceded by a
 * DescribeUser call. The dataset in the request should be the one
 * expected when performing another `DescribeUser` call.
 */
export const updateUser: (
  input: UpdateUserRequest,
) => effect.Effect<
  UpdateUserResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes the specified resource.
 */
export const deleteResource: (
  input: DeleteResourceRequest,
) => effect.Effect<
  DeleteResourceResponse,
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceRequest,
  output: DeleteResourceResponse,
  errors: [
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Returns the data available for the resource.
 */
export const describeResource: (
  input: DescribeResourceRequest,
) => effect.Effect<
  DescribeResourceResponse,
  | EntityNotFoundException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourceRequest,
  output: DescribeResourceResponse,
  errors: [
    EntityNotFoundException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Removes a member from the resource's set of delegates.
 */
export const disassociateDelegateFromResource: (
  input: DisassociateDelegateFromResourceRequest,
) => effect.Effect<
  DisassociateDelegateFromResourceResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateDelegateFromResourceRequest,
  output: DisassociateDelegateFromResourceResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates attributes in a group.
 */
export const updateGroup: (
  input: UpdateGroupRequest,
) => effect.Effect<
  UpdateGroupResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGroupRequest,
  output: UpdateGroupResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Adds a member (user or group) to the resource's set of delegates.
 */
export const associateDelegateToResource: (
  input: AssociateDelegateToResourceRequest,
) => effect.Effect<
  AssociateDelegateToResourceResponse,
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateDelegateToResourceRequest,
  output: AssociateDelegateToResourceResponse,
  errors: [
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Adds a member (user or group) to the group's set.
 */
export const associateMemberToGroup: (
  input: AssociateMemberToGroupRequest,
) => effect.Effect<
  AssociateMemberToGroupResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateMemberToGroupRequest,
  output: AssociateMemberToGroupResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates an `AvailabilityConfiguration` for the given WorkMail organization and domain.
 */
export const createAvailabilityConfiguration: (
  input: CreateAvailabilityConfigurationRequest,
) => effect.Effect<
  CreateAvailabilityConfigurationResponse,
  | InvalidParameterException
  | LimitExceededException
  | NameAvailabilityException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAvailabilityConfigurationRequest,
  output: CreateAvailabilityConfigurationResponse,
  errors: [
    InvalidParameterException,
    LimitExceededException,
    NameAvailabilityException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Creates a new WorkMail organization. Optionally, you can choose to associate an existing AWS Directory Service directory with your organization. If an AWS Directory Service directory ID is specified, the organization alias must match the directory alias. If you choose not to associate an existing directory with your organization, then we create a new WorkMail directory for you. For more information, see Adding an organization in the *WorkMail Administrator Guide*.
 *
 * You can associate multiple email domains with an organization, then choose your
 * default email domain from the WorkMail console. You can also associate a domain that is managed
 * in an Amazon Route 53 public hosted zone. For more information, see Adding a
 * domain and Choosing the default domain
 * in the *WorkMail Administrator Guide*.
 *
 * Optionally, you can use a customer managed key from AWS Key Management Service (AWS
 * KMS) to encrypt email for your organization. If you don't associate an AWS KMS key, WorkMail
 * creates a default, AWS managed key for you.
 */
export const createOrganization: (
  input: CreateOrganizationRequest,
) => effect.Effect<
  CreateOrganizationResponse,
  | DirectoryInUseException
  | DirectoryUnavailableException
  | InvalidParameterException
  | LimitExceededException
  | NameAvailabilityException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOrganizationRequest,
  output: CreateOrganizationResponse,
  errors: [
    DirectoryInUseException,
    DirectoryUnavailableException,
    InvalidParameterException,
    LimitExceededException,
    NameAvailabilityException,
  ],
}));
/**
 * Allows the administrator to reset the password for a user.
 */
export const resetPassword: (
  input: ResetPasswordRequest,
) => effect.Effect<
  ResetPasswordResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | InvalidPasswordException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetPasswordRequest,
  output: ResetPasswordResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    InvalidPasswordException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Adds an alias to the set of a given member (user or group) of WorkMail.
 */
export const createAlias: (
  input: CreateAliasRequest,
) => effect.Effect<
  CreateAliasResponse,
  | EmailAddressInUseException
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | LimitExceededException
  | MailDomainNotFoundException
  | MailDomainStateException
  | OrganizationNotFoundException
  | OrganizationStateException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAliasRequest,
  output: CreateAliasResponse,
  errors: [
    EmailAddressInUseException,
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    LimitExceededException,
    MailDomainNotFoundException,
    MailDomainStateException,
    OrganizationNotFoundException,
    OrganizationStateException,
  ],
}));
/**
 * Updates the primary email for a user, group, or resource. The current email is moved
 * into the list of aliases (or swapped between an existing alias and the current primary
 * email), and the email provided in the input is promoted as the primary.
 */
export const updatePrimaryEmailAddress: (
  input: UpdatePrimaryEmailAddressRequest,
) => effect.Effect<
  UpdatePrimaryEmailAddressResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | EmailAddressInUseException
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | MailDomainNotFoundException
  | MailDomainStateException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePrimaryEmailAddressRequest,
  output: UpdatePrimaryEmailAddressResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EmailAddressInUseException,
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    MailDomainNotFoundException,
    MailDomainStateException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates data for the resource. To have the latest information, it must be preceded by
 * a DescribeResource call. The dataset in the request should be the one
 * expected when performing another `DescribeResource` call.
 */
export const updateResource: (
  input: UpdateResourceRequest,
) => effect.Effect<
  UpdateResourceResponse,
  | DirectoryUnavailableException
  | EmailAddressInUseException
  | EntityNotFoundException
  | EntityStateException
  | InvalidConfigurationException
  | InvalidParameterException
  | MailDomainNotFoundException
  | MailDomainStateException
  | NameAvailabilityException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceRequest,
  output: UpdateResourceResponse,
  errors: [
    DirectoryUnavailableException,
    EmailAddressInUseException,
    EntityNotFoundException,
    EntityStateException,
    InvalidConfigurationException,
    InvalidParameterException,
    MailDomainNotFoundException,
    MailDomainStateException,
    NameAvailabilityException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Registers an existing and disabled user, group, or resource for WorkMail use by
 * associating a mailbox and calendaring capabilities. It performs no change if the user,
 * group, or resource is enabled and fails if the user, group, or resource is deleted. This
 * operation results in the accumulation of costs. For more information, see Pricing. The equivalent console
 * functionality for this operation is *Enable*.
 *
 * Users can either be created by calling the CreateUser API operation
 * or they can be synchronized from your directory. For more information, see DeregisterFromWorkMail.
 */
export const registerToWorkMail: (
  input: RegisterToWorkMailRequest,
) => effect.Effect<
  RegisterToWorkMailResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | EmailAddressInUseException
  | EntityAlreadyRegisteredException
  | EntityNotFoundException
  | EntityStateException
  | InvalidParameterException
  | MailDomainNotFoundException
  | MailDomainStateException
  | OrganizationNotFoundException
  | OrganizationStateException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterToWorkMailRequest,
  output: RegisterToWorkMailResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    EmailAddressInUseException,
    EntityAlreadyRegisteredException,
    EntityNotFoundException,
    EntityStateException,
    InvalidParameterException,
    MailDomainNotFoundException,
    MailDomainStateException,
    OrganizationNotFoundException,
    OrganizationStateException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a group that can be used in WorkMail by calling the RegisterToWorkMail operation.
 */
export const createGroup: (
  input: CreateGroupRequest,
) => effect.Effect<
  CreateGroupResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | InvalidParameterException
  | NameAvailabilityException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ReservedNameException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGroupRequest,
  output: CreateGroupResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    InvalidParameterException,
    NameAvailabilityException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ReservedNameException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a user who can be used in WorkMail by calling the RegisterToWorkMail operation.
 */
export const createUser: (
  input: CreateUserRequest,
) => effect.Effect<
  CreateUserResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | InvalidParameterException
  | InvalidPasswordException
  | NameAvailabilityException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ReservedNameException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    InvalidParameterException,
    InvalidPasswordException,
    NameAvailabilityException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ReservedNameException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a new WorkMail resource.
 */
export const createResource: (
  input: CreateResourceRequest,
) => effect.Effect<
  CreateResourceResponse,
  | DirectoryServiceAuthenticationFailedException
  | DirectoryUnavailableException
  | InvalidParameterException
  | NameAvailabilityException
  | OrganizationNotFoundException
  | OrganizationStateException
  | ReservedNameException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourceRequest,
  output: CreateResourceResponse,
  errors: [
    DirectoryServiceAuthenticationFailedException,
    DirectoryUnavailableException,
    InvalidParameterException,
    NameAvailabilityException,
    OrganizationNotFoundException,
    OrganizationStateException,
    ReservedNameException,
    UnsupportedOperationException,
  ],
}));

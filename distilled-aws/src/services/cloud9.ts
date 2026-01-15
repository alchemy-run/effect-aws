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
  sdkId: "Cloud9",
  serviceShapeName: "AWSCloud9WorkspaceManagementService",
});
const auth = T.AwsAuthSigv4({ name: "cloud9" });
const ver = T.ServiceVersion("2017-09-23");
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
              `https://cloud9-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://cloud9-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://cloud9.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cloud9.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type EnvironmentName = string;
export type EnvironmentDescription = string | redacted.Redacted<string>;
export type ClientRequestToken = string;
export type InstanceType = string;
export type SubnetId = string;
export type ImageId = string;
export type AutomaticStopTimeMinutes = number;
export type UserArn = string;
export type EnvironmentId = string;
export type MaxResults = number;
export type EnvironmentArn = string;
export type TagKey = string | redacted.Redacted<string>;
export type TagValue = string | redacted.Redacted<string>;

//# Schemas
export type ConnectionType = "CONNECT_SSH" | "CONNECT_SSM" | (string & {});
export const ConnectionType = S.String;
export type MemberPermissions = "read-write" | "read-only" | (string & {});
export const MemberPermissions = S.String;
export type Permissions = "owner" | "read-write" | "read-only" | (string & {});
export const Permissions = S.String;
export type PermissionsList = Permissions[];
export const PermissionsList = S.Array(Permissions);
export type BoundedEnvironmentIdList = string[];
export const BoundedEnvironmentIdList = S.Array(S.String);
export type TagKeyList = string | redacted.Redacted<string>[];
export const TagKeyList = S.Array(SensitiveString);
export type ManagedCredentialsAction = "ENABLE" | "DISABLE" | (string & {});
export const ManagedCredentialsAction = S.String;
export interface CreateEnvironmentMembershipRequest {
  environmentId: string;
  userArn: string;
  permissions: MemberPermissions;
}
export const CreateEnvironmentMembershipRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String,
    userArn: S.String,
    permissions: MemberPermissions,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEnvironmentMembershipRequest",
}) as any as S.Schema<CreateEnvironmentMembershipRequest>;
export interface DeleteEnvironmentRequest {
  environmentId: string;
}
export const DeleteEnvironmentRequest = S.suspend(() =>
  S.Struct({ environmentId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEnvironmentRequest",
}) as any as S.Schema<DeleteEnvironmentRequest>;
export interface DeleteEnvironmentResult {}
export const DeleteEnvironmentResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnvironmentResult",
}) as any as S.Schema<DeleteEnvironmentResult>;
export interface DeleteEnvironmentMembershipRequest {
  environmentId: string;
  userArn: string;
}
export const DeleteEnvironmentMembershipRequest = S.suspend(() =>
  S.Struct({ environmentId: S.String, userArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEnvironmentMembershipRequest",
}) as any as S.Schema<DeleteEnvironmentMembershipRequest>;
export interface DeleteEnvironmentMembershipResult {}
export const DeleteEnvironmentMembershipResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnvironmentMembershipResult",
}) as any as S.Schema<DeleteEnvironmentMembershipResult>;
export interface DescribeEnvironmentMembershipsRequest {
  userArn?: string;
  environmentId?: string;
  permissions?: Permissions[];
  nextToken?: string;
  maxResults?: number;
}
export const DescribeEnvironmentMembershipsRequest = S.suspend(() =>
  S.Struct({
    userArn: S.optional(S.String),
    environmentId: S.optional(S.String),
    permissions: S.optional(PermissionsList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEnvironmentMembershipsRequest",
}) as any as S.Schema<DescribeEnvironmentMembershipsRequest>;
export interface DescribeEnvironmentsRequest {
  environmentIds: string[];
}
export const DescribeEnvironmentsRequest = S.suspend(() =>
  S.Struct({ environmentIds: BoundedEnvironmentIdList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEnvironmentsRequest",
}) as any as S.Schema<DescribeEnvironmentsRequest>;
export interface DescribeEnvironmentStatusRequest {
  environmentId: string;
}
export const DescribeEnvironmentStatusRequest = S.suspend(() =>
  S.Struct({ environmentId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEnvironmentStatusRequest",
}) as any as S.Schema<DescribeEnvironmentStatusRequest>;
export interface ListEnvironmentsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEnvironmentsRequest",
}) as any as S.Schema<ListEnvironmentsRequest>;
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
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
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
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateEnvironmentRequest {
  environmentId: string;
  name?: string;
  description?: string | redacted.Redacted<string>;
  managedCredentialsAction?: ManagedCredentialsAction;
}
export const UpdateEnvironmentRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String,
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    managedCredentialsAction: S.optional(ManagedCredentialsAction),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEnvironmentRequest",
}) as any as S.Schema<UpdateEnvironmentRequest>;
export interface UpdateEnvironmentResult {}
export const UpdateEnvironmentResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateEnvironmentResult",
}) as any as S.Schema<UpdateEnvironmentResult>;
export interface UpdateEnvironmentMembershipRequest {
  environmentId: string;
  userArn: string;
  permissions: MemberPermissions;
}
export const UpdateEnvironmentMembershipRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String,
    userArn: S.String,
    permissions: MemberPermissions,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEnvironmentMembershipRequest",
}) as any as S.Schema<UpdateEnvironmentMembershipRequest>;
export interface EnvironmentMember {
  permissions: Permissions;
  userId: string;
  userArn: string;
  environmentId: string;
  lastAccess?: Date;
}
export const EnvironmentMember = S.suspend(() =>
  S.Struct({
    permissions: Permissions,
    userId: S.String,
    userArn: S.String,
    environmentId: S.String,
    lastAccess: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "EnvironmentMember",
}) as any as S.Schema<EnvironmentMember>;
export type EnvironmentMembersList = EnvironmentMember[];
export const EnvironmentMembersList = S.Array(EnvironmentMember);
export type EnvironmentStatus =
  | "error"
  | "creating"
  | "connecting"
  | "ready"
  | "stopping"
  | "stopped"
  | "deleting"
  | (string & {});
export const EnvironmentStatus = S.String;
export type EnvironmentIdList = string[];
export const EnvironmentIdList = S.Array(S.String);
export interface CreateEnvironmentEC2Request {
  name: string;
  description?: string | redacted.Redacted<string>;
  clientRequestToken?: string;
  instanceType: string;
  subnetId?: string;
  imageId: string;
  automaticStopTimeMinutes?: number;
  ownerArn?: string;
  tags?: Tag[];
  connectionType?: ConnectionType;
  dryRun?: boolean;
}
export const CreateEnvironmentEC2Request = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(SensitiveString),
    clientRequestToken: S.optional(S.String),
    instanceType: S.String,
    subnetId: S.optional(S.String),
    imageId: S.String,
    automaticStopTimeMinutes: S.optional(S.Number),
    ownerArn: S.optional(S.String),
    tags: S.optional(TagList),
    connectionType: S.optional(ConnectionType),
    dryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEnvironmentEC2Request",
}) as any as S.Schema<CreateEnvironmentEC2Request>;
export interface DescribeEnvironmentMembershipsResult {
  memberships?: EnvironmentMember[];
  nextToken?: string;
}
export const DescribeEnvironmentMembershipsResult = S.suspend(() =>
  S.Struct({
    memberships: S.optional(EnvironmentMembersList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeEnvironmentMembershipsResult",
}) as any as S.Schema<DescribeEnvironmentMembershipsResult>;
export interface DescribeEnvironmentStatusResult {
  status: EnvironmentStatus;
  message: string;
}
export const DescribeEnvironmentStatusResult = S.suspend(() =>
  S.Struct({ status: EnvironmentStatus, message: S.String }),
).annotations({
  identifier: "DescribeEnvironmentStatusResult",
}) as any as S.Schema<DescribeEnvironmentStatusResult>;
export interface ListEnvironmentsResult {
  nextToken?: string;
  environmentIds?: string[];
}
export const ListEnvironmentsResult = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    environmentIds: S.optional(EnvironmentIdList),
  }),
).annotations({
  identifier: "ListEnvironmentsResult",
}) as any as S.Schema<ListEnvironmentsResult>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateEnvironmentMembershipResult {
  membership?: EnvironmentMember;
}
export const UpdateEnvironmentMembershipResult = S.suspend(() =>
  S.Struct({ membership: S.optional(EnvironmentMember) }),
).annotations({
  identifier: "UpdateEnvironmentMembershipResult",
}) as any as S.Schema<UpdateEnvironmentMembershipResult>;
export type EnvironmentType = "ssh" | "ec2" | (string & {});
export const EnvironmentType = S.String;
export type ManagedCredentialsStatus =
  | "ENABLED_ON_CREATE"
  | "ENABLED_BY_OWNER"
  | "DISABLED_BY_DEFAULT"
  | "DISABLED_BY_OWNER"
  | "DISABLED_BY_COLLABORATOR"
  | "PENDING_REMOVAL_BY_COLLABORATOR"
  | "PENDING_START_REMOVAL_BY_COLLABORATOR"
  | "PENDING_REMOVAL_BY_OWNER"
  | "PENDING_START_REMOVAL_BY_OWNER"
  | "FAILED_REMOVAL_BY_COLLABORATOR"
  | "FAILED_REMOVAL_BY_OWNER"
  | (string & {});
export const ManagedCredentialsStatus = S.String;
export type EnvironmentLifecycleStatus =
  | "CREATING"
  | "CREATED"
  | "CREATE_FAILED"
  | "DELETING"
  | "DELETE_FAILED"
  | (string & {});
export const EnvironmentLifecycleStatus = S.String;
export interface CreateEnvironmentEC2Result {
  environmentId?: string;
}
export const CreateEnvironmentEC2Result = S.suspend(() =>
  S.Struct({ environmentId: S.optional(S.String) }),
).annotations({
  identifier: "CreateEnvironmentEC2Result",
}) as any as S.Schema<CreateEnvironmentEC2Result>;
export interface CreateEnvironmentMembershipResult {
  membership: EnvironmentMember;
}
export const CreateEnvironmentMembershipResult = S.suspend(() =>
  S.Struct({ membership: EnvironmentMember }),
).annotations({
  identifier: "CreateEnvironmentMembershipResult",
}) as any as S.Schema<CreateEnvironmentMembershipResult>;
export interface EnvironmentLifecycle {
  status?: EnvironmentLifecycleStatus;
  reason?: string;
  failureResource?: string;
}
export const EnvironmentLifecycle = S.suspend(() =>
  S.Struct({
    status: S.optional(EnvironmentLifecycleStatus),
    reason: S.optional(S.String),
    failureResource: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentLifecycle",
}) as any as S.Schema<EnvironmentLifecycle>;
export interface Environment {
  id?: string;
  name?: string;
  description?: string | redacted.Redacted<string>;
  type: EnvironmentType;
  connectionType?: ConnectionType;
  arn: string;
  ownerArn: string;
  lifecycle?: EnvironmentLifecycle;
  managedCredentialsStatus?: ManagedCredentialsStatus;
}
export const Environment = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    type: EnvironmentType,
    connectionType: S.optional(ConnectionType),
    arn: S.String,
    ownerArn: S.String,
    lifecycle: S.optional(EnvironmentLifecycle),
    managedCredentialsStatus: S.optional(ManagedCredentialsStatus),
  }),
).annotations({ identifier: "Environment" }) as any as S.Schema<Environment>;
export type EnvironmentList = Environment[];
export const EnvironmentList = S.Array(Environment);
export interface DescribeEnvironmentsResult {
  environments?: Environment[];
}
export const DescribeEnvironmentsResult = S.suspend(() =>
  S.Struct({ environments: S.optional(EnvironmentList) }),
).annotations({
  identifier: "DescribeEnvironmentsResult",
}) as any as S.Schema<DescribeEnvironmentsResult>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {
    message: S.optional(S.String),
    className: S.optional(S.String),
    code: S.optional(S.Number),
  },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    className: S.optional(S.String),
    code: S.optional(S.Number),
  },
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {
    message: S.optional(S.String),
    className: S.optional(S.String),
    code: S.optional(S.Number),
  },
) {}
export class ConcurrentAccessException extends S.TaggedError<ConcurrentAccessException>()(
  "ConcurrentAccessException",
  {
    message: S.optional(S.String),
    className: S.optional(S.String),
    code: S.optional(S.Number),
  },
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {
    message: S.optional(S.String),
    className: S.optional(S.String),
    code: S.optional(S.Number),
  },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {
    message: S.optional(S.String),
    className: S.optional(S.String),
    code: S.optional(S.Number),
  },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {
    message: S.optional(S.String),
    className: S.optional(S.String),
    code: S.optional(S.Number),
  },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  {
    message: S.optional(S.String),
    className: S.optional(S.String),
    code: S.optional(S.Number),
  },
) {}

//# Operations
/**
 * Gets a list of the tags associated with an Cloud9 development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Adds tags to an Cloud9 development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 *
 * Tags that you add to an Cloud9 environment by using this method will NOT be
 * automatically propagated to underlying resources.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | ConcurrentAccessException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    ConcurrentAccessException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Removes tags from an Cloud9 development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | ConcurrentAccessException
  | InternalServerErrorException
  | NotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    ConcurrentAccessException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Deletes an Cloud9 development environment. If an Amazon EC2 instance is connected to the
 * environment, also terminates the instance.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const deleteEnvironment: (
  input: DeleteEnvironmentRequest,
) => effect.Effect<
  DeleteEnvironmentResult,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentRequest,
  output: DeleteEnvironmentResult,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets information about Cloud9 development environments.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const describeEnvironments: (
  input: DescribeEnvironmentsRequest,
) => effect.Effect<
  DescribeEnvironmentsResult,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEnvironmentsRequest,
  output: DescribeEnvironmentsResult,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets information about environment members for an Cloud9 development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const describeEnvironmentMemberships: {
  (
    input: DescribeEnvironmentMembershipsRequest,
  ): effect.Effect<
    DescribeEnvironmentMembershipsResult,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | LimitExceededException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEnvironmentMembershipsRequest,
  ) => stream.Stream<
    DescribeEnvironmentMembershipsResult,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | LimitExceededException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEnvironmentMembershipsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | LimitExceededException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEnvironmentMembershipsRequest,
  output: DescribeEnvironmentMembershipsResult,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets status information for an Cloud9 development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const describeEnvironmentStatus: (
  input: DescribeEnvironmentStatusRequest,
) => effect.Effect<
  DescribeEnvironmentStatusResult,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEnvironmentStatusRequest,
  output: DescribeEnvironmentStatusResult,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets a list of Cloud9 development environment identifiers.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const listEnvironments: {
  (
    input: ListEnvironmentsRequest,
  ): effect.Effect<
    ListEnvironmentsResult,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | LimitExceededException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentsRequest,
  ) => stream.Stream<
    ListEnvironmentsResult,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | LimitExceededException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentsRequest,
  ) => stream.Stream<
    unknown,
    | BadRequestException
    | ConflictException
    | ForbiddenException
    | InternalServerErrorException
    | LimitExceededException
    | NotFoundException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnvironmentsRequest,
  output: ListEnvironmentsResult,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Changes the settings of an existing environment member for an Cloud9 development
 * environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const updateEnvironmentMembership: (
  input: UpdateEnvironmentMembershipRequest,
) => effect.Effect<
  UpdateEnvironmentMembershipResult,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentMembershipRequest,
  output: UpdateEnvironmentMembershipResult,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an environment member from a development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const deleteEnvironmentMembership: (
  input: DeleteEnvironmentMembershipRequest,
) => effect.Effect<
  DeleteEnvironmentMembershipResult,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentMembershipRequest,
  output: DeleteEnvironmentMembershipResult,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Changes the settings of an existing Cloud9 development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const updateEnvironment: (
  input: UpdateEnvironmentRequest,
) => effect.Effect<
  UpdateEnvironmentResult,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentRequest,
  output: UpdateEnvironmentResult,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an Cloud9 development environment, launches an Amazon Elastic Compute Cloud (Amazon EC2) instance, and
 * then connects from the instance to the environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const createEnvironmentEC2: (
  input: CreateEnvironmentEC2Request,
) => effect.Effect<
  CreateEnvironmentEC2Result,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentEC2Request,
  output: CreateEnvironmentEC2Result,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Adds an environment member to an Cloud9 development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const createEnvironmentMembership: (
  input: CreateEnvironmentMembershipRequest,
) => effect.Effect<
  CreateEnvironmentMembershipResult,
  | BadRequestException
  | ConflictException
  | ForbiddenException
  | InternalServerErrorException
  | LimitExceededException
  | NotFoundException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentMembershipRequest,
  output: CreateEnvironmentMembershipResult,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    LimitExceededException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));

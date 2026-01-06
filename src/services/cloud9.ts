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
  sdkId: "Cloud9",
  serviceShapeName: "AWSCloud9WorkspaceManagementService",
});
const auth = T.AwsAuthSigv4({ name: "cloud9" });
const ver = T.ServiceVersion("2017-09-23");
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
                        url: "https://cloud9-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://cloud9-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://cloud9.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://cloud9.{Region}.{PartitionResult#dnsSuffix}",
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
export type EnvironmentName = string;
export type EnvironmentDescription = string | Redacted.Redacted<string>;
export type ClientRequestToken = string;
export type InstanceType = string;
export type SubnetId = string;
export type ImageId = string;
export type AutomaticStopTimeMinutes = number;
export type UserArn = string;
export type EnvironmentId = string;
export type MaxResults = number;
export type EnvironmentArn = string;
export type TagKey = string | Redacted.Redacted<string>;
export type TagValue = string | Redacted.Redacted<string>;
export type Integer = number;

//# Schemas
export type PermissionsList = string[];
export const PermissionsList = S.Array(S.String);
export type BoundedEnvironmentIdList = string[];
export const BoundedEnvironmentIdList = S.Array(S.String);
export type TagKeyList = string | Redacted.Redacted<string>[];
export const TagKeyList = S.Array(SensitiveString);
export interface CreateEnvironmentMembershipRequest {
  environmentId: string;
  userArn: string;
  permissions: string;
}
export const CreateEnvironmentMembershipRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String,
    userArn: S.String,
    permissions: S.String,
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
  permissions?: PermissionsList;
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
  environmentIds: BoundedEnvironmentIdList;
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
  Key: string | Redacted.Redacted<string>;
  Value: string | Redacted.Redacted<string>;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: SensitiveString, Value: SensitiveString }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: TagList;
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
  TagKeys: TagKeyList;
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
  description?: string | Redacted.Redacted<string>;
  managedCredentialsAction?: string;
}
export const UpdateEnvironmentRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String,
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    managedCredentialsAction: S.optional(S.String),
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
  permissions: string;
}
export const UpdateEnvironmentMembershipRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String,
    userArn: S.String,
    permissions: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEnvironmentMembershipRequest",
}) as any as S.Schema<UpdateEnvironmentMembershipRequest>;
export interface EnvironmentMember {
  permissions: string;
  userId: string;
  userArn: string;
  environmentId: string;
  lastAccess?: Date;
}
export const EnvironmentMember = S.suspend(() =>
  S.Struct({
    permissions: S.String,
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
export type EnvironmentIdList = string[];
export const EnvironmentIdList = S.Array(S.String);
export interface CreateEnvironmentEC2Request {
  name: string;
  description?: string | Redacted.Redacted<string>;
  clientRequestToken?: string;
  instanceType: string;
  subnetId?: string;
  imageId: string;
  automaticStopTimeMinutes?: number;
  ownerArn?: string;
  tags?: TagList;
  connectionType?: string;
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
    connectionType: S.optional(S.String),
    dryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEnvironmentEC2Request",
}) as any as S.Schema<CreateEnvironmentEC2Request>;
export interface DescribeEnvironmentMembershipsResult {
  memberships?: EnvironmentMembersList;
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
  status: string;
  message: string;
}
export const DescribeEnvironmentStatusResult = S.suspend(() =>
  S.Struct({ status: S.String, message: S.String }),
).annotations({
  identifier: "DescribeEnvironmentStatusResult",
}) as any as S.Schema<DescribeEnvironmentStatusResult>;
export interface ListEnvironmentsResult {
  nextToken?: string;
  environmentIds?: EnvironmentIdList;
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
  Tags?: TagList;
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
  status?: string;
  reason?: string;
  failureResource?: string;
}
export const EnvironmentLifecycle = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    reason: S.optional(S.String),
    failureResource: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentLifecycle",
}) as any as S.Schema<EnvironmentLifecycle>;
export interface Environment {
  id?: string;
  name?: string;
  description?: string | Redacted.Redacted<string>;
  type: string;
  connectionType?: string;
  arn: string;
  ownerArn: string;
  lifecycle?: EnvironmentLifecycle;
  managedCredentialsStatus?: string;
}
export const Environment = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(SensitiveString),
    type: S.String,
    connectionType: S.optional(S.String),
    arn: S.String,
    ownerArn: S.String,
    lifecycle: S.optional(EnvironmentLifecycle),
    managedCredentialsStatus: S.optional(S.String),
  }),
).annotations({ identifier: "Environment" }) as any as S.Schema<Environment>;
export type EnvironmentList = Environment[];
export const EnvironmentList = S.Array(Environment);
export interface DescribeEnvironmentsResult {
  environments?: EnvironmentList;
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
  ): Effect.Effect<
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
  ) => Stream.Stream<
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
  ) => Stream.Stream<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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
) => Effect.Effect<
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

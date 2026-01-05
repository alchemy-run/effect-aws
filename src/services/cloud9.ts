import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export const PermissionsList = S.Array(S.String);
export const BoundedEnvironmentIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CreateEnvironmentMembershipRequest extends S.Class<CreateEnvironmentMembershipRequest>(
  "CreateEnvironmentMembershipRequest",
)(
  { environmentId: S.String, userArn: S.String, permissions: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEnvironmentRequest extends S.Class<DeleteEnvironmentRequest>(
  "DeleteEnvironmentRequest",
)(
  { environmentId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEnvironmentResult extends S.Class<DeleteEnvironmentResult>(
  "DeleteEnvironmentResult",
)({}) {}
export class DeleteEnvironmentMembershipRequest extends S.Class<DeleteEnvironmentMembershipRequest>(
  "DeleteEnvironmentMembershipRequest",
)(
  { environmentId: S.String, userArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEnvironmentMembershipResult extends S.Class<DeleteEnvironmentMembershipResult>(
  "DeleteEnvironmentMembershipResult",
)({}) {}
export class DescribeEnvironmentMembershipsRequest extends S.Class<DescribeEnvironmentMembershipsRequest>(
  "DescribeEnvironmentMembershipsRequest",
)(
  {
    userArn: S.optional(S.String),
    environmentId: S.optional(S.String),
    permissions: S.optional(PermissionsList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEnvironmentsRequest extends S.Class<DescribeEnvironmentsRequest>(
  "DescribeEnvironmentsRequest",
)(
  { environmentIds: BoundedEnvironmentIdList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEnvironmentStatusRequest extends S.Class<DescribeEnvironmentStatusRequest>(
  "DescribeEnvironmentStatusRequest",
)(
  { environmentId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEnvironmentsRequest extends S.Class<ListEnvironmentsRequest>(
  "ListEnvironmentsRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateEnvironmentRequest extends S.Class<UpdateEnvironmentRequest>(
  "UpdateEnvironmentRequest",
)(
  {
    environmentId: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    managedCredentialsAction: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEnvironmentResult extends S.Class<UpdateEnvironmentResult>(
  "UpdateEnvironmentResult",
)({}) {}
export class UpdateEnvironmentMembershipRequest extends S.Class<UpdateEnvironmentMembershipRequest>(
  "UpdateEnvironmentMembershipRequest",
)(
  { environmentId: S.String, userArn: S.String, permissions: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnvironmentMember extends S.Class<EnvironmentMember>(
  "EnvironmentMember",
)({
  permissions: S.String,
  userId: S.String,
  userArn: S.String,
  environmentId: S.String,
  lastAccess: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EnvironmentMembersList = S.Array(EnvironmentMember);
export const EnvironmentIdList = S.Array(S.String);
export class CreateEnvironmentEC2Request extends S.Class<CreateEnvironmentEC2Request>(
  "CreateEnvironmentEC2Request",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    instanceType: S.String,
    subnetId: S.optional(S.String),
    imageId: S.String,
    automaticStopTimeMinutes: S.optional(S.Number),
    ownerArn: S.optional(S.String),
    tags: S.optional(TagList),
    connectionType: S.optional(S.String),
    dryRun: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEnvironmentMembershipsResult extends S.Class<DescribeEnvironmentMembershipsResult>(
  "DescribeEnvironmentMembershipsResult",
)({
  memberships: S.optional(EnvironmentMembersList),
  nextToken: S.optional(S.String),
}) {}
export class DescribeEnvironmentStatusResult extends S.Class<DescribeEnvironmentStatusResult>(
  "DescribeEnvironmentStatusResult",
)({ status: S.String, message: S.String }) {}
export class ListEnvironmentsResult extends S.Class<ListEnvironmentsResult>(
  "ListEnvironmentsResult",
)({
  nextToken: S.optional(S.String),
  environmentIds: S.optional(EnvironmentIdList),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class UpdateEnvironmentMembershipResult extends S.Class<UpdateEnvironmentMembershipResult>(
  "UpdateEnvironmentMembershipResult",
)({ membership: S.optional(EnvironmentMember) }) {}
export class CreateEnvironmentEC2Result extends S.Class<CreateEnvironmentEC2Result>(
  "CreateEnvironmentEC2Result",
)({ environmentId: S.optional(S.String) }) {}
export class CreateEnvironmentMembershipResult extends S.Class<CreateEnvironmentMembershipResult>(
  "CreateEnvironmentMembershipResult",
)({ membership: EnvironmentMember }) {}
export class EnvironmentLifecycle extends S.Class<EnvironmentLifecycle>(
  "EnvironmentLifecycle",
)({
  status: S.optional(S.String),
  reason: S.optional(S.String),
  failureResource: S.optional(S.String),
}) {}
export class Environment extends S.Class<Environment>("Environment")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  type: S.String,
  connectionType: S.optional(S.String),
  arn: S.String,
  ownerArn: S.String,
  lifecycle: S.optional(EnvironmentLifecycle),
  managedCredentialsStatus: S.optional(S.String),
}) {}
export const EnvironmentList = S.Array(Environment);
export class DescribeEnvironmentsResult extends S.Class<DescribeEnvironmentsResult>(
  "DescribeEnvironmentsResult",
)({ environments: S.optional(EnvironmentList) }) {}

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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Gets information about environment members for an Cloud9 development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const describeEnvironmentMemberships =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeEnvironmentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const listEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Changes the settings of an existing environment member for an Cloud9 development
 * environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const updateEnvironmentMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes an environment member from a development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const deleteEnvironmentMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Changes the settings of an existing Cloud9 development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const updateEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createEnvironmentEC2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Adds an environment member to an Cloud9 development environment.
 *
 * Cloud9 is no longer available to new customers. Existing customers of
 * Cloud9 can continue to use the service as normal.
 * Learn more"
 */
export const createEnvironmentMembership = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);

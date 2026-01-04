import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "SecurityLake",
  serviceShapeName: "SecurityLake",
});
const auth = T.AwsAuthSigv4({ name: "securitylake" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://securitylake-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://securitylake-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://securitylake.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://securitylake.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export class DeleteDataLakeExceptionSubscriptionRequest extends S.Class<DeleteDataLakeExceptionSubscriptionRequest>(
  "DeleteDataLakeExceptionSubscriptionRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/datalake/exceptions/subscription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDataLakeExceptionSubscriptionResponse extends S.Class<DeleteDataLakeExceptionSubscriptionResponse>(
  "DeleteDataLakeExceptionSubscriptionResponse",
)({}) {}
export class DeregisterDataLakeDelegatedAdministratorRequest extends S.Class<DeregisterDataLakeDelegatedAdministratorRequest>(
  "DeregisterDataLakeDelegatedAdministratorRequest",
)(
  {},
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/datalake/delegate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterDataLakeDelegatedAdministratorResponse extends S.Class<DeregisterDataLakeDelegatedAdministratorResponse>(
  "DeregisterDataLakeDelegatedAdministratorResponse",
)({}) {}
export class GetDataLakeExceptionSubscriptionRequest extends S.Class<GetDataLakeExceptionSubscriptionRequest>(
  "GetDataLakeExceptionSubscriptionRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/v1/datalake/exceptions/subscription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const RegionList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CreateDataLakeExceptionSubscriptionRequest extends S.Class<CreateDataLakeExceptionSubscriptionRequest>(
  "CreateDataLakeExceptionSubscriptionRequest",
)(
  {
    subscriptionProtocol: S.String,
    notificationEndpoint: S.String,
    exceptionTimeToLive: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/exceptions/subscription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataLakeExceptionSubscriptionResponse extends S.Class<CreateDataLakeExceptionSubscriptionResponse>(
  "CreateDataLakeExceptionSubscriptionResponse",
)({}) {}
export class GetDataLakeExceptionSubscriptionResponse extends S.Class<GetDataLakeExceptionSubscriptionResponse>(
  "GetDataLakeExceptionSubscriptionResponse",
)({
  subscriptionProtocol: S.optional(S.String),
  notificationEndpoint: S.optional(S.String),
  exceptionTimeToLive: S.optional(S.Number),
}) {}
export class ListDataLakeExceptionsRequest extends S.Class<ListDataLakeExceptionsRequest>(
  "ListDataLakeExceptionsRequest",
)(
  {
    regions: S.optional(RegionList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/exceptions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterDataLakeDelegatedAdministratorRequest extends S.Class<RegisterDataLakeDelegatedAdministratorRequest>(
  "RegisterDataLakeDelegatedAdministratorRequest",
)(
  { accountId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v1/datalake/delegate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterDataLakeDelegatedAdministratorResponse extends S.Class<RegisterDataLakeDelegatedAdministratorResponse>(
  "RegisterDataLakeDelegatedAdministratorResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateDataLakeExceptionSubscriptionRequest extends S.Class<UpdateDataLakeExceptionSubscriptionRequest>(
  "UpdateDataLakeExceptionSubscriptionRequest",
)(
  {
    subscriptionProtocol: S.String,
    notificationEndpoint: S.String,
    exceptionTimeToLive: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/datalake/exceptions/subscription" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateDataLakeExceptionSubscriptionResponse extends S.Class<UpdateDataLakeExceptionSubscriptionResponse>(
  "UpdateDataLakeExceptionSubscriptionResponse",
)({}) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagList },
  T.all(
    T.Http({ method: "POST", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class DataLakeException extends S.Class<DataLakeException>(
  "DataLakeException",
)({
  region: S.optional(S.String),
  exception: S.optional(S.String),
  remediation: S.optional(S.String),
  timestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const DataLakeExceptionList = S.Array(DataLakeException);
export class ListDataLakeExceptionsResponse extends S.Class<ListDataLakeExceptionsResponse>(
  "ListDataLakeExceptionsResponse",
)({
  exceptions: S.optional(DataLakeExceptionList),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}

//# Operations
/**
 * Designates the Amazon Security Lake delegated administrator account for the organization. This
 * API can only be called by the organization management account. The organization management
 * account cannot be the delegated administrator account.
 */
export const registerDataLakeDelegatedAdministrator =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RegisterDataLakeDelegatedAdministratorRequest,
    output: RegisterDataLakeDelegatedAdministratorResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Removes one or more tags (keys and values) from an Amazon Security Lake resource: a subscriber, or the data lake configuration for your
 * Amazon Web Services account in a particular Amazon Web Services Region.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Updates the specified notification subscription in Amazon Security Lake for the organization
 * you specify.
 */
export const updateDataLakeExceptionSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDataLakeExceptionSubscriptionRequest,
    output: UpdateDataLakeExceptionSubscriptionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Creates the specified notification subscription in Amazon Security Lake for the organization
 * you specify. The notification subscription is created for exceptions that cannot be resolved by Security Lake automatically.
 */
export const createDataLakeExceptionSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDataLakeExceptionSubscriptionRequest,
    output: CreateDataLakeExceptionSubscriptionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes the specified notification subscription in Amazon Security Lake for the organization
 * you specify.
 */
export const deleteDataLakeExceptionSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDataLakeExceptionSubscriptionRequest,
    output: DeleteDataLakeExceptionSubscriptionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Deletes the Amazon Security Lake delegated administrator account for the organization. This API
 * can only be called by the organization management account. The organization management
 * account cannot be the delegated administrator account.
 */
export const deregisterDataLakeDelegatedAdministrator =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeregisterDataLakeDelegatedAdministratorRequest,
    output: DeregisterDataLakeDelegatedAdministratorResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves the protocol and endpoint that were provided when subscribing to Amazon SNS topics for exception notifications.
 */
export const getDataLakeExceptionSubscription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDataLakeExceptionSubscriptionRequest,
    output: GetDataLakeExceptionSubscriptionResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves the tags (keys and values) that are associated with an Amazon Security Lake resource: a subscriber, or the data lake configuration for
 * your Amazon Web Services account in a particular Amazon Web Services Region.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds or updates one or more tags that are associated with an Amazon Security Lake resource: a subscriber, or the data lake configuration for your
 * Amazon Web Services account in a particular Amazon Web Services Region. A *tag* is a label that you can define and associate with
 * Amazon Web Services resources. Each tag consists of a required *tag key* and an associated *tag value*. A
 * *tag key* is a general label that acts as a category for a more specific tag value. A *tag value* acts as a
 * descriptor for a tag key. Tags can help you identify, categorize, and manage resources in different ways, such as by owner, environment, or other
 * criteria. For more information, see
 * Tagging Amazon Security Lake resources in the
 * *Amazon Security Lake User Guide*.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists the Amazon Security Lake exceptions that you can use to find the source of problems and
 * fix them.
 */
export const listDataLakeExceptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDataLakeExceptionsRequest,
    output: ListDataLakeExceptionsResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);

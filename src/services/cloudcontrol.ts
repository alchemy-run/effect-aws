import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "CloudControl",
  serviceShapeName: "CloudApiService",
});
const auth = T.AwsAuthSigv4({ name: "cloudcontrolapi" });
const ver = T.ServiceVersion("2021-09-30");
const proto = T.AwsProtocolsAwsJson1_0();
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
                        url: "https://cloudcontrolapi-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://cloudcontrolapi-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://cloudcontrolapi.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://cloudcontrolapi.{Region}.{PartitionResult#dnsSuffix}",
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
export class CancelResourceRequestInput extends S.Class<CancelResourceRequestInput>(
  "CancelResourceRequestInput",
)(
  { RequestToken: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateResourceInput extends S.Class<CreateResourceInput>(
  "CreateResourceInput",
)(
  {
    TypeName: S.String,
    TypeVersionId: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ClientToken: S.optional(S.String),
    DesiredState: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourceInput extends S.Class<DeleteResourceInput>(
  "DeleteResourceInput",
)(
  {
    TypeName: S.String,
    TypeVersionId: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Identifier: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourceInput extends S.Class<GetResourceInput>(
  "GetResourceInput",
)(
  {
    TypeName: S.String,
    TypeVersionId: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Identifier: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourceRequestStatusInput extends S.Class<GetResourceRequestStatusInput>(
  "GetResourceRequestStatusInput",
)(
  { RequestToken: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourcesInput extends S.Class<ListResourcesInput>(
  "ListResourcesInput",
)(
  {
    TypeName: S.String,
    TypeVersionId: S.optional(S.String),
    RoleArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResourceModel: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateResourceInput extends S.Class<UpdateResourceInput>(
  "UpdateResourceInput",
)(
  {
    TypeName: S.String,
    TypeVersionId: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Identifier: S.String,
    PatchDocument: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Operations = S.Array(S.String);
export const OperationStatuses = S.Array(S.String);
export class ResourceRequestStatusFilter extends S.Class<ResourceRequestStatusFilter>(
  "ResourceRequestStatusFilter",
)({
  Operations: S.optional(Operations),
  OperationStatuses: S.optional(OperationStatuses),
}) {}
export class ResourceDescription extends S.Class<ResourceDescription>(
  "ResourceDescription",
)({ Identifier: S.optional(S.String), Properties: S.optional(S.String) }) {}
export const ResourceDescriptions = S.Array(ResourceDescription);
export class ProgressEvent extends S.Class<ProgressEvent>("ProgressEvent")({
  TypeName: S.optional(S.String),
  Identifier: S.optional(S.String),
  RequestToken: S.optional(S.String),
  HooksRequestToken: S.optional(S.String),
  Operation: S.optional(S.String),
  OperationStatus: S.optional(S.String),
  EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceModel: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  RetryAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateResourceOutput extends S.Class<CreateResourceOutput>(
  "CreateResourceOutput",
)({ ProgressEvent: S.optional(ProgressEvent) }) {}
export class DeleteResourceOutput extends S.Class<DeleteResourceOutput>(
  "DeleteResourceOutput",
)({ ProgressEvent: S.optional(ProgressEvent) }) {}
export class ListResourceRequestsInput extends S.Class<ListResourceRequestsInput>(
  "ListResourceRequestsInput",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ResourceRequestStatusFilter: S.optional(ResourceRequestStatusFilter),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourcesOutput extends S.Class<ListResourcesOutput>(
  "ListResourcesOutput",
)({
  TypeName: S.optional(S.String),
  ResourceDescriptions: S.optional(ResourceDescriptions),
  NextToken: S.optional(S.String),
}) {}
export class UpdateResourceOutput extends S.Class<UpdateResourceOutput>(
  "UpdateResourceOutput",
)({ ProgressEvent: S.optional(ProgressEvent) }) {}
export class HookProgressEvent extends S.Class<HookProgressEvent>(
  "HookProgressEvent",
)({
  HookTypeName: S.optional(S.String),
  HookTypeVersionId: S.optional(S.String),
  HookTypeArn: S.optional(S.String),
  InvocationPoint: S.optional(S.String),
  HookStatus: S.optional(S.String),
  HookEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HookStatusMessage: S.optional(S.String),
  FailureMode: S.optional(S.String),
}) {}
export const HooksProgressEvent = S.Array(HookProgressEvent);
export const ResourceRequestStatusSummaries = S.Array(ProgressEvent);
export class CancelResourceRequestOutput extends S.Class<CancelResourceRequestOutput>(
  "CancelResourceRequestOutput",
)({ ProgressEvent: S.optional(ProgressEvent) }) {}
export class GetResourceOutput extends S.Class<GetResourceOutput>(
  "GetResourceOutput",
)({
  TypeName: S.optional(S.String),
  ResourceDescription: S.optional(ResourceDescription),
}) {}
export class GetResourceRequestStatusOutput extends S.Class<GetResourceRequestStatusOutput>(
  "GetResourceRequestStatusOutput",
)({
  ProgressEvent: S.optional(ProgressEvent),
  HooksProgressEvent: S.optional(HooksProgressEvent),
}) {}
export class ListResourceRequestsOutput extends S.Class<ListResourceRequestsOutput>(
  "ListResourceRequestsOutput",
)({
  ResourceRequestStatusSummaries: S.optional(ResourceRequestStatusSummaries),
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AlreadyExistsException", httpResponseCode: 400 }),
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ConcurrentModificationException",
    httpResponseCode: 500,
  }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ClientTokenConflictException extends S.TaggedError<ClientTokenConflictException>()(
  "ClientTokenConflictException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClientTokenConflictException",
    httpResponseCode: 409,
  }),
) {}
export class GeneralServiceException extends S.TaggedError<GeneralServiceException>()(
  "GeneralServiceException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "GeneralServiceException", httpResponseCode: 400 }),
) {}
export class RequestTokenNotFoundException extends S.TaggedError<RequestTokenNotFoundException>()(
  "RequestTokenNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "RequestTokenNotFoundException",
    httpResponseCode: 404,
  }),
) {}
export class ConcurrentOperationException extends S.TaggedError<ConcurrentOperationException>()(
  "ConcurrentOperationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ConcurrentOperationException",
    httpResponseCode: 409,
  }),
) {}
export class HandlerFailureException extends S.TaggedError<HandlerFailureException>()(
  "HandlerFailureException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "HandlerFailureException", httpResponseCode: 502 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class HandlerInternalFailureException extends S.TaggedError<HandlerInternalFailureException>()(
  "HandlerInternalFailureException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HandlerInternalFailureException",
    httpResponseCode: 502,
  }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidCredentialsException extends S.TaggedError<InvalidCredentialsException>()(
  "InvalidCredentialsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCredentialsException",
    httpResponseCode: 401,
  }),
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRequestException", httpResponseCode: 400 }),
) {}
export class NetworkFailureException extends S.TaggedError<NetworkFailureException>()(
  "NetworkFailureException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "NetworkFailureException", httpResponseCode: 502 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class NotStabilizedException extends S.TaggedError<NotStabilizedException>()(
  "NotStabilizedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "NotStabilizedException", httpResponseCode: 400 }),
) {}
export class NotUpdatableException extends S.TaggedError<NotUpdatableException>()(
  "NotUpdatableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "NotUpdatableException", httpResponseCode: 400 }),
) {}
export class PrivateTypeException extends S.TaggedError<PrivateTypeException>()(
  "PrivateTypeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "PrivateTypeException", httpResponseCode: 400 }),
) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceConflictException", httpResponseCode: 409 }),
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
) {}
export class ServiceInternalErrorException extends S.TaggedError<ServiceInternalErrorException>()(
  "ServiceInternalErrorException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServiceInternalErrorException",
    httpResponseCode: 502,
  }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ServiceLimitExceededException extends S.TaggedError<ServiceLimitExceededException>()(
  "ServiceLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServiceLimitExceededException",
    httpResponseCode: 400,
  }),
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ThrottlingException", httpResponseCode: 429 }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class TypeNotFoundException extends S.TaggedError<TypeNotFoundException>()(
  "TypeNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TypeNotFoundException", httpResponseCode: 404 }),
) {}
export class UnsupportedActionException extends S.TaggedError<UnsupportedActionException>()(
  "UnsupportedActionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnsupportedActionException",
    httpResponseCode: 405,
  }),
) {}

//# Operations
/**
 * Returns existing resource operation requests. This includes requests of all status types.
 * For more information, see Listing active resource operation requests in the
 * *Amazon Web Services Cloud Control API User Guide*.
 *
 * Resource operation requests expire after 7 days.
 */
export const listResourceRequests =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListResourceRequestsInput,
    output: ListResourceRequestsOutput,
    errors: [],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ResourceRequestStatusSummaries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Returns the current status of a resource operation request. For more information, see
 * Tracking the progress of resource operation requests in the
 * *Amazon Web Services Cloud Control API User Guide*.
 */
export const getResourceRequestStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourceRequestStatusInput,
    output: GetResourceRequestStatusOutput,
    errors: [RequestTokenNotFoundException],
  }),
);
/**
 * Cancels the specified resource operation request. For more information, see Canceling resource operation requests in the
 * *Amazon Web Services Cloud Control API User Guide*.
 *
 * Only resource operations requests with a status of `PENDING` or
 * `IN_PROGRESS` can be canceled.
 */
export const cancelResourceRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelResourceRequestInput,
    output: CancelResourceRequestOutput,
    errors: [ConcurrentModificationException, RequestTokenNotFoundException],
  }),
);
/**
 * Returns information about the current state of the specified resource. For details, see
 * Reading a resource's current state.
 *
 * You can use this action to return information about an existing resource in your account
 * and Amazon Web Services Region, whether those resources were provisioned using Cloud Control API.
 */
export const getResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceInput,
  output: GetResourceOutput,
  errors: [
    AlreadyExistsException,
    GeneralServiceException,
    HandlerFailureException,
    HandlerInternalFailureException,
    InvalidCredentialsException,
    InvalidRequestException,
    NetworkFailureException,
    NotStabilizedException,
    NotUpdatableException,
    PrivateTypeException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceInternalErrorException,
    ServiceLimitExceededException,
    ThrottlingException,
    TypeNotFoundException,
    UnsupportedActionException,
  ],
}));
/**
 * Deletes the specified resource. For details, see Deleting a
 * resource in the *Amazon Web Services Cloud Control API User Guide*.
 *
 * After you have initiated a resource deletion request, you can monitor the progress of your
 * request by calling GetResourceRequestStatus using the `RequestToken` of the
 * `ProgressEvent` returned by `DeleteResource`.
 */
export const deleteResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceInput,
  output: DeleteResourceOutput,
  errors: [
    AlreadyExistsException,
    ClientTokenConflictException,
    ConcurrentOperationException,
    GeneralServiceException,
    HandlerFailureException,
    HandlerInternalFailureException,
    InvalidCredentialsException,
    InvalidRequestException,
    NetworkFailureException,
    NotStabilizedException,
    NotUpdatableException,
    PrivateTypeException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceInternalErrorException,
    ServiceLimitExceededException,
    ThrottlingException,
    TypeNotFoundException,
    UnsupportedActionException,
  ],
}));
/**
 * Updates the specified property values in the resource.
 *
 * You specify your resource property updates as a list of patch operations contained in a
 * JSON patch document that adheres to the
 * RFC 6902 - JavaScript Object
 * Notation (JSON) Patch
 * standard.
 *
 * For details on how Cloud Control API performs resource update operations, see Updating a resource in the *Amazon Web Services Cloud Control API User Guide*.
 *
 * After you have initiated a resource update request, you can monitor the progress of your
 * request by calling GetResourceRequestStatus using the `RequestToken` of the
 * `ProgressEvent` returned by `UpdateResource`.
 *
 * For more information about the properties of a specific resource, refer to the related
 * topic for the resource in the Resource and property types reference in the *CloudFormation Users Guide*.
 */
export const updateResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceInput,
  output: UpdateResourceOutput,
  errors: [
    AlreadyExistsException,
    ClientTokenConflictException,
    ConcurrentOperationException,
    GeneralServiceException,
    HandlerFailureException,
    HandlerInternalFailureException,
    InvalidCredentialsException,
    InvalidRequestException,
    NetworkFailureException,
    NotStabilizedException,
    NotUpdatableException,
    PrivateTypeException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceInternalErrorException,
    ServiceLimitExceededException,
    ThrottlingException,
    TypeNotFoundException,
    UnsupportedActionException,
  ],
}));
/**
 * Returns information about the specified resources. For more information, see Discovering resources in the *Amazon Web Services Cloud Control API User Guide*.
 *
 * You can use this action to return information about existing resources in your account and
 * Amazon Web Services Region, whether those resources were provisioned using Cloud Control API.
 */
export const listResources = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListResourcesInput,
    output: ListResourcesOutput,
    errors: [
      AlreadyExistsException,
      GeneralServiceException,
      HandlerFailureException,
      HandlerInternalFailureException,
      InvalidCredentialsException,
      InvalidRequestException,
      NetworkFailureException,
      NotStabilizedException,
      NotUpdatableException,
      PrivateTypeException,
      ResourceConflictException,
      ResourceNotFoundException,
      ServiceInternalErrorException,
      ServiceLimitExceededException,
      ThrottlingException,
      TypeNotFoundException,
      UnsupportedActionException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ResourceDescriptions",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Creates the specified resource. For more information, see Creating a
 * resource in the *Amazon Web Services Cloud Control API User Guide*.
 *
 * After you have initiated a resource creation request, you can monitor the progress of your
 * request by calling GetResourceRequestStatus using the `RequestToken` of the
 * `ProgressEvent` type returned by `CreateResource`.
 */
export const createResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateResourceInput,
  output: CreateResourceOutput,
  errors: [
    AlreadyExistsException,
    ClientTokenConflictException,
    ConcurrentOperationException,
    GeneralServiceException,
    HandlerFailureException,
    HandlerInternalFailureException,
    InvalidCredentialsException,
    InvalidRequestException,
    NetworkFailureException,
    NotStabilizedException,
    NotUpdatableException,
    PrivateTypeException,
    ResourceConflictException,
    ResourceNotFoundException,
    ServiceInternalErrorException,
    ServiceLimitExceededException,
    ThrottlingException,
    TypeNotFoundException,
    UnsupportedActionException,
  ],
}));

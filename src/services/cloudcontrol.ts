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

//# Newtypes
export type RequestToken = string;
export type TypeName = string;
export type TypeVersionId = string;
export type RoleArn = string;
export type ClientToken = string;
export type Properties = string | Redacted.Redacted<string>;
export type Identifier = string;
export type MaxResults = number;
export type NextToken = string;
export type HandlerNextToken = string;
export type PatchDocument = string | Redacted.Redacted<string>;
export type Operation = string;
export type OperationStatus = string;
export type StatusMessage = string;
export type HandlerErrorCode = string;
export type HookTypeArn = string;
export type HookInvocationPoint = string;
export type HookStatus = string;
export type HookFailureMode = string;
export type ErrorMessage = string;

//# Schemas
export interface CancelResourceRequestInput {
  RequestToken: string;
}
export const CancelResourceRequestInput = S.suspend(() =>
  S.Struct({ RequestToken: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelResourceRequestInput",
}) as any as S.Schema<CancelResourceRequestInput>;
export interface CreateResourceInput {
  TypeName: string;
  TypeVersionId?: string;
  RoleArn?: string;
  ClientToken?: string;
  DesiredState: string | Redacted.Redacted<string>;
}
export const CreateResourceInput = S.suspend(() =>
  S.Struct({
    TypeName: S.String,
    TypeVersionId: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ClientToken: S.optional(S.String),
    DesiredState: SensitiveString,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateResourceInput",
}) as any as S.Schema<CreateResourceInput>;
export interface DeleteResourceInput {
  TypeName: string;
  TypeVersionId?: string;
  RoleArn?: string;
  ClientToken?: string;
  Identifier: string;
}
export const DeleteResourceInput = S.suspend(() =>
  S.Struct({
    TypeName: S.String,
    TypeVersionId: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Identifier: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResourceInput",
}) as any as S.Schema<DeleteResourceInput>;
export interface GetResourceInput {
  TypeName: string;
  TypeVersionId?: string;
  RoleArn?: string;
  Identifier: string;
}
export const GetResourceInput = S.suspend(() =>
  S.Struct({
    TypeName: S.String,
    TypeVersionId: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Identifier: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourceInput",
}) as any as S.Schema<GetResourceInput>;
export interface GetResourceRequestStatusInput {
  RequestToken: string;
}
export const GetResourceRequestStatusInput = S.suspend(() =>
  S.Struct({ RequestToken: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourceRequestStatusInput",
}) as any as S.Schema<GetResourceRequestStatusInput>;
export interface ListResourcesInput {
  TypeName: string;
  TypeVersionId?: string;
  RoleArn?: string;
  NextToken?: string;
  MaxResults?: number;
  ResourceModel?: string | Redacted.Redacted<string>;
}
export const ListResourcesInput = S.suspend(() =>
  S.Struct({
    TypeName: S.String,
    TypeVersionId: S.optional(S.String),
    RoleArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResourceModel: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResourcesInput",
}) as any as S.Schema<ListResourcesInput>;
export interface UpdateResourceInput {
  TypeName: string;
  TypeVersionId?: string;
  RoleArn?: string;
  ClientToken?: string;
  Identifier: string;
  PatchDocument: string | Redacted.Redacted<string>;
}
export const UpdateResourceInput = S.suspend(() =>
  S.Struct({
    TypeName: S.String,
    TypeVersionId: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Identifier: S.String,
    PatchDocument: SensitiveString,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateResourceInput",
}) as any as S.Schema<UpdateResourceInput>;
export type Operations = string[];
export const Operations = S.Array(S.String);
export type OperationStatuses = string[];
export const OperationStatuses = S.Array(S.String);
export interface ResourceRequestStatusFilter {
  Operations?: Operations;
  OperationStatuses?: OperationStatuses;
}
export const ResourceRequestStatusFilter = S.suspend(() =>
  S.Struct({
    Operations: S.optional(Operations),
    OperationStatuses: S.optional(OperationStatuses),
  }),
).annotations({
  identifier: "ResourceRequestStatusFilter",
}) as any as S.Schema<ResourceRequestStatusFilter>;
export interface ResourceDescription {
  Identifier?: string;
  Properties?: string | Redacted.Redacted<string>;
}
export const ResourceDescription = S.suspend(() =>
  S.Struct({
    Identifier: S.optional(S.String),
    Properties: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ResourceDescription",
}) as any as S.Schema<ResourceDescription>;
export type ResourceDescriptions = ResourceDescription[];
export const ResourceDescriptions = S.Array(ResourceDescription);
export interface ProgressEvent {
  TypeName?: string;
  Identifier?: string;
  RequestToken?: string;
  HooksRequestToken?: string;
  Operation?: string;
  OperationStatus?: string;
  EventTime?: Date;
  ResourceModel?: string | Redacted.Redacted<string>;
  StatusMessage?: string;
  ErrorCode?: string;
  RetryAfter?: Date;
}
export const ProgressEvent = S.suspend(() =>
  S.Struct({
    TypeName: S.optional(S.String),
    Identifier: S.optional(S.String),
    RequestToken: S.optional(S.String),
    HooksRequestToken: S.optional(S.String),
    Operation: S.optional(S.String),
    OperationStatus: S.optional(S.String),
    EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ResourceModel: S.optional(SensitiveString),
    StatusMessage: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    RetryAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ProgressEvent",
}) as any as S.Schema<ProgressEvent>;
export interface CreateResourceOutput {
  ProgressEvent?: ProgressEvent;
}
export const CreateResourceOutput = S.suspend(() =>
  S.Struct({ ProgressEvent: S.optional(ProgressEvent) }),
).annotations({
  identifier: "CreateResourceOutput",
}) as any as S.Schema<CreateResourceOutput>;
export interface DeleteResourceOutput {
  ProgressEvent?: ProgressEvent;
}
export const DeleteResourceOutput = S.suspend(() =>
  S.Struct({ ProgressEvent: S.optional(ProgressEvent) }),
).annotations({
  identifier: "DeleteResourceOutput",
}) as any as S.Schema<DeleteResourceOutput>;
export interface ListResourceRequestsInput {
  MaxResults?: number;
  NextToken?: string;
  ResourceRequestStatusFilter?: ResourceRequestStatusFilter;
}
export const ListResourceRequestsInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ResourceRequestStatusFilter: S.optional(ResourceRequestStatusFilter),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListResourceRequestsInput",
}) as any as S.Schema<ListResourceRequestsInput>;
export interface ListResourcesOutput {
  TypeName?: string;
  ResourceDescriptions?: ResourceDescriptions;
  NextToken?: string;
}
export const ListResourcesOutput = S.suspend(() =>
  S.Struct({
    TypeName: S.optional(S.String),
    ResourceDescriptions: S.optional(ResourceDescriptions),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourcesOutput",
}) as any as S.Schema<ListResourcesOutput>;
export interface UpdateResourceOutput {
  ProgressEvent?: ProgressEvent;
}
export const UpdateResourceOutput = S.suspend(() =>
  S.Struct({ ProgressEvent: S.optional(ProgressEvent) }),
).annotations({
  identifier: "UpdateResourceOutput",
}) as any as S.Schema<UpdateResourceOutput>;
export interface HookProgressEvent {
  HookTypeName?: string;
  HookTypeVersionId?: string;
  HookTypeArn?: string;
  InvocationPoint?: string;
  HookStatus?: string;
  HookEventTime?: Date;
  HookStatusMessage?: string;
  FailureMode?: string;
}
export const HookProgressEvent = S.suspend(() =>
  S.Struct({
    HookTypeName: S.optional(S.String),
    HookTypeVersionId: S.optional(S.String),
    HookTypeArn: S.optional(S.String),
    InvocationPoint: S.optional(S.String),
    HookStatus: S.optional(S.String),
    HookEventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    HookStatusMessage: S.optional(S.String),
    FailureMode: S.optional(S.String),
  }),
).annotations({
  identifier: "HookProgressEvent",
}) as any as S.Schema<HookProgressEvent>;
export type HooksProgressEvent = HookProgressEvent[];
export const HooksProgressEvent = S.Array(HookProgressEvent);
export type ResourceRequestStatusSummaries = ProgressEvent[];
export const ResourceRequestStatusSummaries = S.Array(ProgressEvent);
export interface CancelResourceRequestOutput {
  ProgressEvent?: ProgressEvent;
}
export const CancelResourceRequestOutput = S.suspend(() =>
  S.Struct({ ProgressEvent: S.optional(ProgressEvent) }),
).annotations({
  identifier: "CancelResourceRequestOutput",
}) as any as S.Schema<CancelResourceRequestOutput>;
export interface GetResourceOutput {
  TypeName?: string;
  ResourceDescription?: ResourceDescription;
}
export const GetResourceOutput = S.suspend(() =>
  S.Struct({
    TypeName: S.optional(S.String),
    ResourceDescription: S.optional(ResourceDescription),
  }),
).annotations({
  identifier: "GetResourceOutput",
}) as any as S.Schema<GetResourceOutput>;
export interface GetResourceRequestStatusOutput {
  ProgressEvent?: ProgressEvent;
  HooksProgressEvent?: HooksProgressEvent;
}
export const GetResourceRequestStatusOutput = S.suspend(() =>
  S.Struct({
    ProgressEvent: S.optional(ProgressEvent),
    HooksProgressEvent: S.optional(HooksProgressEvent),
  }),
).annotations({
  identifier: "GetResourceRequestStatusOutput",
}) as any as S.Schema<GetResourceRequestStatusOutput>;
export interface ListResourceRequestsOutput {
  ResourceRequestStatusSummaries?: ResourceRequestStatusSummaries;
  NextToken?: string;
}
export const ListResourceRequestsOutput = S.suspend(() =>
  S.Struct({
    ResourceRequestStatusSummaries: S.optional(ResourceRequestStatusSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListResourceRequestsOutput",
}) as any as S.Schema<ListResourceRequestsOutput>;

//# Errors
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AlreadyExistsException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ConcurrentModificationException",
    httpResponseCode: 500,
  }),
).pipe(C.withServerError) {}
export class ClientTokenConflictException extends S.TaggedError<ClientTokenConflictException>()(
  "ClientTokenConflictException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClientTokenConflictException",
    httpResponseCode: 409,
  }),
).pipe(C.withConflictError) {}
export class GeneralServiceException extends S.TaggedError<GeneralServiceException>()(
  "GeneralServiceException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "GeneralServiceException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class RequestTokenNotFoundException extends S.TaggedError<RequestTokenNotFoundException>()(
  "RequestTokenNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "RequestTokenNotFoundException",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class ConcurrentOperationException extends S.TaggedError<ConcurrentOperationException>()(
  "ConcurrentOperationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ConcurrentOperationException",
    httpResponseCode: 409,
  }),
).pipe(C.withConflictError) {}
export class HandlerFailureException extends S.TaggedError<HandlerFailureException>()(
  "HandlerFailureException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "HandlerFailureException", httpResponseCode: 502 }),
).pipe(C.withServerError) {}
export class HandlerInternalFailureException extends S.TaggedError<HandlerInternalFailureException>()(
  "HandlerInternalFailureException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "HandlerInternalFailureException",
    httpResponseCode: 502,
  }),
).pipe(C.withServerError) {}
export class InvalidCredentialsException extends S.TaggedError<InvalidCredentialsException>()(
  "InvalidCredentialsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCredentialsException",
    httpResponseCode: 401,
  }),
).pipe(C.withAuthError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidRequestException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class NetworkFailureException extends S.TaggedError<NetworkFailureException>()(
  "NetworkFailureException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "NetworkFailureException", httpResponseCode: 502 }),
).pipe(C.withServerError) {}
export class NotStabilizedException extends S.TaggedError<NotStabilizedException>()(
  "NotStabilizedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "NotStabilizedException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class NotUpdatableException extends S.TaggedError<NotUpdatableException>()(
  "NotUpdatableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "NotUpdatableException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class PrivateTypeException extends S.TaggedError<PrivateTypeException>()(
  "PrivateTypeException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "PrivateTypeException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceConflictException extends S.TaggedError<ResourceConflictException>()(
  "ResourceConflictException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceConflictException", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ServiceInternalErrorException extends S.TaggedError<ServiceInternalErrorException>()(
  "ServiceInternalErrorException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServiceInternalErrorException",
    httpResponseCode: 502,
  }),
).pipe(C.withServerError) {}
export class ServiceLimitExceededException extends S.TaggedError<ServiceLimitExceededException>()(
  "ServiceLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServiceLimitExceededException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ThrottlingException", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class TypeNotFoundException extends S.TaggedError<TypeNotFoundException>()(
  "TypeNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TypeNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class UnsupportedActionException extends S.TaggedError<UnsupportedActionException>()(
  "UnsupportedActionException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "UnsupportedActionException",
    httpResponseCode: 405,
  }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns existing resource operation requests. This includes requests of all status types.
 * For more information, see Listing active resource operation requests in the
 * *Amazon Web Services Cloud Control API User Guide*.
 *
 * Resource operation requests expire after 7 days.
 */
export const listResourceRequests: {
  (
    input: ListResourceRequestsInput,
  ): Effect.Effect<
    ListResourceRequestsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourceRequestsInput,
  ) => Stream.Stream<
    ListResourceRequestsOutput,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourceRequestsInput,
  ) => Stream.Stream<
    ProgressEvent,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getResourceRequestStatus: (
  input: GetResourceRequestStatusInput,
) => Effect.Effect<
  GetResourceRequestStatusOutput,
  RequestTokenNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceRequestStatusInput,
  output: GetResourceRequestStatusOutput,
  errors: [RequestTokenNotFoundException],
}));
/**
 * Cancels the specified resource operation request. For more information, see Canceling resource operation requests in the
 * *Amazon Web Services Cloud Control API User Guide*.
 *
 * Only resource operations requests with a status of `PENDING` or
 * `IN_PROGRESS` can be canceled.
 */
export const cancelResourceRequest: (
  input: CancelResourceRequestInput,
) => Effect.Effect<
  CancelResourceRequestOutput,
  | ConcurrentModificationException
  | RequestTokenNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelResourceRequestInput,
  output: CancelResourceRequestOutput,
  errors: [ConcurrentModificationException, RequestTokenNotFoundException],
}));
/**
 * Returns information about the current state of the specified resource. For details, see
 * Reading a resource's current state.
 *
 * You can use this action to return information about an existing resource in your account
 * and Amazon Web Services Region, whether those resources were provisioned using Cloud Control API.
 */
export const getResource: (
  input: GetResourceInput,
) => Effect.Effect<
  GetResourceOutput,
  | AlreadyExistsException
  | GeneralServiceException
  | HandlerFailureException
  | HandlerInternalFailureException
  | InvalidCredentialsException
  | InvalidRequestException
  | NetworkFailureException
  | NotStabilizedException
  | NotUpdatableException
  | PrivateTypeException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceInternalErrorException
  | ServiceLimitExceededException
  | ThrottlingException
  | TypeNotFoundException
  | UnsupportedActionException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteResource: (
  input: DeleteResourceInput,
) => Effect.Effect<
  DeleteResourceOutput,
  | AlreadyExistsException
  | ClientTokenConflictException
  | ConcurrentOperationException
  | GeneralServiceException
  | HandlerFailureException
  | HandlerInternalFailureException
  | InvalidCredentialsException
  | InvalidRequestException
  | NetworkFailureException
  | NotStabilizedException
  | NotUpdatableException
  | PrivateTypeException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceInternalErrorException
  | ServiceLimitExceededException
  | ThrottlingException
  | TypeNotFoundException
  | UnsupportedActionException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateResource: (
  input: UpdateResourceInput,
) => Effect.Effect<
  UpdateResourceOutput,
  | AlreadyExistsException
  | ClientTokenConflictException
  | ConcurrentOperationException
  | GeneralServiceException
  | HandlerFailureException
  | HandlerInternalFailureException
  | InvalidCredentialsException
  | InvalidRequestException
  | NetworkFailureException
  | NotStabilizedException
  | NotUpdatableException
  | PrivateTypeException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceInternalErrorException
  | ServiceLimitExceededException
  | ThrottlingException
  | TypeNotFoundException
  | UnsupportedActionException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listResources: {
  (
    input: ListResourcesInput,
  ): Effect.Effect<
    ListResourcesOutput,
    | AlreadyExistsException
    | GeneralServiceException
    | HandlerFailureException
    | HandlerInternalFailureException
    | InvalidCredentialsException
    | InvalidRequestException
    | NetworkFailureException
    | NotStabilizedException
    | NotUpdatableException
    | PrivateTypeException
    | ResourceConflictException
    | ResourceNotFoundException
    | ServiceInternalErrorException
    | ServiceLimitExceededException
    | ThrottlingException
    | TypeNotFoundException
    | UnsupportedActionException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListResourcesInput,
  ) => Stream.Stream<
    ListResourcesOutput,
    | AlreadyExistsException
    | GeneralServiceException
    | HandlerFailureException
    | HandlerInternalFailureException
    | InvalidCredentialsException
    | InvalidRequestException
    | NetworkFailureException
    | NotStabilizedException
    | NotUpdatableException
    | PrivateTypeException
    | ResourceConflictException
    | ResourceNotFoundException
    | ServiceInternalErrorException
    | ServiceLimitExceededException
    | ThrottlingException
    | TypeNotFoundException
    | UnsupportedActionException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListResourcesInput,
  ) => Stream.Stream<
    ResourceDescription,
    | AlreadyExistsException
    | GeneralServiceException
    | HandlerFailureException
    | HandlerInternalFailureException
    | InvalidCredentialsException
    | InvalidRequestException
    | NetworkFailureException
    | NotStabilizedException
    | NotUpdatableException
    | PrivateTypeException
    | ResourceConflictException
    | ResourceNotFoundException
    | ServiceInternalErrorException
    | ServiceLimitExceededException
    | ThrottlingException
    | TypeNotFoundException
    | UnsupportedActionException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Creates the specified resource. For more information, see Creating a
 * resource in the *Amazon Web Services Cloud Control API User Guide*.
 *
 * After you have initiated a resource creation request, you can monitor the progress of your
 * request by calling GetResourceRequestStatus using the `RequestToken` of the
 * `ProgressEvent` type returned by `CreateResource`.
 */
export const createResource: (
  input: CreateResourceInput,
) => Effect.Effect<
  CreateResourceOutput,
  | AlreadyExistsException
  | ClientTokenConflictException
  | ConcurrentOperationException
  | GeneralServiceException
  | HandlerFailureException
  | HandlerInternalFailureException
  | InvalidCredentialsException
  | InvalidRequestException
  | NetworkFailureException
  | NotStabilizedException
  | NotUpdatableException
  | PrivateTypeException
  | ResourceConflictException
  | ResourceNotFoundException
  | ServiceInternalErrorException
  | ServiceLimitExceededException
  | ThrottlingException
  | TypeNotFoundException
  | UnsupportedActionException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

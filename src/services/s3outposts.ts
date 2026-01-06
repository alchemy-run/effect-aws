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
  sdkId: "S3Outposts",
  serviceShapeName: "S3Outposts",
});
const auth = T.AwsAuthSigv4({ name: "s3-outposts" });
const ver = T.ServiceVersion("2017-07-25");
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
                        url: "https://s3-outposts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://s3-outposts-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://s3-outposts.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://s3-outposts.{Region}.{PartitionResult#dnsSuffix}",
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
export type OutpostId = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type CustomerOwnedIpv4Pool = string;
export type EndpointId = string;
export type NextToken = string;
export type MaxResults = number;
export type EndpointArn = string;
export type ErrorMessage = string;
export type CidrBlock = string;
export type VpcId = string;
export type OutpostArn = string;
export type S3OutpostArn = string;
export type AwsAccountId = string;
export type CapacityInBytes = number;
export type NetworkInterfaceId = string;
export type ErrorCode = string;
export type Message = string;

//# Schemas
export interface CreateEndpointRequest {
  OutpostId: string;
  SubnetId: string;
  SecurityGroupId: string;
  AccessType?: string;
  CustomerOwnedIpv4Pool?: string;
}
export const CreateEndpointRequest = S.suspend(() =>
  S.Struct({
    OutpostId: S.String,
    SubnetId: S.String,
    SecurityGroupId: S.String,
    AccessType: S.optional(S.String),
    CustomerOwnedIpv4Pool: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/S3Outposts/CreateEndpoint" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEndpointRequest",
}) as any as S.Schema<CreateEndpointRequest>;
export interface DeleteEndpointRequest {
  EndpointId: string;
  OutpostId: string;
}
export const DeleteEndpointRequest = S.suspend(() =>
  S.Struct({
    EndpointId: S.String.pipe(T.HttpQuery("endpointId")),
    OutpostId: S.String.pipe(T.HttpQuery("outpostId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/S3Outposts/DeleteEndpoint" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEndpointRequest",
}) as any as S.Schema<DeleteEndpointRequest>;
export interface DeleteEndpointResponse {}
export const DeleteEndpointResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteEndpointResponse" },
) as any as S.Schema<DeleteEndpointResponse>;
export interface ListEndpointsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListEndpointsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/S3Outposts/ListEndpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEndpointsRequest",
}) as any as S.Schema<ListEndpointsRequest>;
export interface ListOutpostsWithS3Request {
  NextToken?: string;
  MaxResults?: number;
}
export const ListOutpostsWithS3Request = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/S3Outposts/ListOutpostsWithS3" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOutpostsWithS3Request",
}) as any as S.Schema<ListOutpostsWithS3Request>;
export interface ListSharedEndpointsRequest {
  NextToken?: string;
  MaxResults?: number;
  OutpostId: string;
}
export const ListSharedEndpointsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    OutpostId: S.String.pipe(T.HttpQuery("outpostId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/S3Outposts/ListSharedEndpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSharedEndpointsRequest",
}) as any as S.Schema<ListSharedEndpointsRequest>;
export interface CreateEndpointResult {
  EndpointArn?: string;
}
export const CreateEndpointResult = S.suspend(() =>
  S.Struct({ EndpointArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateEndpointResult",
}) as any as S.Schema<CreateEndpointResult>;
export interface NetworkInterface {
  NetworkInterfaceId?: string;
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({ NetworkInterfaceId: S.optional(S.String) }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export type NetworkInterfaces = NetworkInterface[];
export const NetworkInterfaces = S.Array(NetworkInterface);
export interface FailedReason {
  ErrorCode?: string;
  Message?: string;
}
export const FailedReason = S.suspend(() =>
  S.Struct({ ErrorCode: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({ identifier: "FailedReason" }) as any as S.Schema<FailedReason>;
export interface Endpoint {
  EndpointArn?: string;
  OutpostsId?: string;
  CidrBlock?: string;
  Status?: string;
  CreationTime?: Date;
  NetworkInterfaces?: NetworkInterfaces;
  VpcId?: string;
  SubnetId?: string;
  SecurityGroupId?: string;
  AccessType?: string;
  CustomerOwnedIpv4Pool?: string;
  FailedReason?: FailedReason;
}
export const Endpoint = S.suspend(() =>
  S.Struct({
    EndpointArn: S.optional(S.String),
    OutpostsId: S.optional(S.String),
    CidrBlock: S.optional(S.String),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NetworkInterfaces: S.optional(NetworkInterfaces),
    VpcId: S.optional(S.String),
    SubnetId: S.optional(S.String),
    SecurityGroupId: S.optional(S.String),
    AccessType: S.optional(S.String),
    CustomerOwnedIpv4Pool: S.optional(S.String),
    FailedReason: S.optional(FailedReason),
  }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export type Endpoints = Endpoint[];
export const Endpoints = S.Array(Endpoint);
export interface ListSharedEndpointsResult {
  Endpoints?: Endpoints;
  NextToken?: string;
}
export const ListSharedEndpointsResult = S.suspend(() =>
  S.Struct({
    Endpoints: S.optional(Endpoints),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSharedEndpointsResult",
}) as any as S.Schema<ListSharedEndpointsResult>;
export interface Outpost {
  OutpostArn?: string;
  S3OutpostArn?: string;
  OutpostId?: string;
  OwnerId?: string;
  CapacityInBytes?: number;
}
export const Outpost = S.suspend(() =>
  S.Struct({
    OutpostArn: S.optional(S.String),
    S3OutpostArn: S.optional(S.String),
    OutpostId: S.optional(S.String),
    OwnerId: S.optional(S.String),
    CapacityInBytes: S.optional(S.Number),
  }),
).annotations({ identifier: "Outpost" }) as any as S.Schema<Outpost>;
export type Outposts = Outpost[];
export const Outposts = S.Array(Outpost);
export interface ListOutpostsWithS3Result {
  Outposts?: Outposts;
  NextToken?: string;
}
export const ListOutpostsWithS3Result = S.suspend(() =>
  S.Struct({ Outposts: S.optional(Outposts), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListOutpostsWithS3Result",
}) as any as S.Schema<ListOutpostsWithS3Result>;
export interface ListEndpointsResult {
  Endpoints?: Endpoints;
  NextToken?: string;
}
export const ListEndpointsResult = S.suspend(() =>
  S.Struct({
    Endpoints: S.optional(Endpoints),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEndpointsResult",
}) as any as S.Schema<ListEndpointsResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class OutpostOfflineException extends S.TaggedError<OutpostOfflineException>()(
  "OutpostOfflineException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists the Outposts with S3 on Outposts capacity for your Amazon Web Services account.
 * Includes S3 on Outposts that you have access to as the Outposts owner, or as a shared user
 * from Resource Access Manager (RAM).
 */
export const listOutpostsWithS3: {
  (
    input: ListOutpostsWithS3Request,
  ): Effect.Effect<
    ListOutpostsWithS3Result,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOutpostsWithS3Request,
  ) => Stream.Stream<
    ListOutpostsWithS3Result,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOutpostsWithS3Request,
  ) => Stream.Stream<
    Outpost,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOutpostsWithS3Request,
  output: ListOutpostsWithS3Result,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Outposts",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all endpoints associated with an Outpost that has been shared by Amazon Web Services Resource Access Manager (RAM).
 *
 * Related actions include:
 *
 * - CreateEndpoint
 *
 * - DeleteEndpoint
 */
export const listSharedEndpoints: {
  (
    input: ListSharedEndpointsRequest,
  ): Effect.Effect<
    ListSharedEndpointsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSharedEndpointsRequest,
  ) => Stream.Stream<
    ListSharedEndpointsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSharedEndpointsRequest,
  ) => Stream.Stream<
    Endpoint,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSharedEndpointsRequest,
  output: ListSharedEndpointsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Endpoints",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates an endpoint and associates it with the specified Outpost.
 *
 * It can take up to 5 minutes for this action to finish.
 *
 * Related actions include:
 *
 * - DeleteEndpoint
 *
 * - ListEndpoints
 */
export const createEndpoint: (
  input: CreateEndpointRequest,
) => Effect.Effect<
  CreateEndpointResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | OutpostOfflineException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEndpointRequest,
  output: CreateEndpointResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    OutpostOfflineException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an endpoint.
 *
 * It can take up to 5 minutes for this action to finish.
 *
 * Related actions include:
 *
 * - CreateEndpoint
 *
 * - ListEndpoints
 */
export const deleteEndpoint: (
  input: DeleteEndpointRequest,
) => Effect.Effect<
  DeleteEndpointResponse,
  | AccessDeniedException
  | InternalServerException
  | OutpostOfflineException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointRequest,
  output: DeleteEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    OutpostOfflineException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists endpoints associated with the specified Outpost.
 *
 * Related actions include:
 *
 * - CreateEndpoint
 *
 * - DeleteEndpoint
 */
export const listEndpoints: {
  (
    input: ListEndpointsRequest,
  ): Effect.Effect<
    ListEndpointsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEndpointsRequest,
  ) => Stream.Stream<
    ListEndpointsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEndpointsRequest,
  ) => Stream.Stream<
    Endpoint,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEndpointsRequest,
  output: ListEndpointsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Endpoints",
    pageSize: "MaxResults",
  } as const,
}));

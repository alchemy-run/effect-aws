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
  sdkId: "IoTSecureTunneling",
  serviceShapeName: "IoTSecuredTunneling",
});
const auth = T.AwsAuthSigv4({ name: "IoTSecuredTunneling" });
const ver = T.ServiceVersion("2018-10-05");
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://api.iot-tunneling-fips.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws-cn",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://api.iot-tunneling-fips.{Region}.api.amazonwebservices.com.cn",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws-us-gov",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://api.iot-tunneling-fips.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://api.tunneling.iot-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://api.tunneling.iot-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://api.iot-tunneling.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws-cn",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://api.iot-tunneling.{Region}.api.amazonwebservices.com.cn",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws-us-gov",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://api.iot-tunneling.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://api.tunneling.iot.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://api.tunneling.iot.{Region}.{PartitionResult#dnsSuffix}",
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
export type TunnelId = string;
export type AmazonResourceName = string;
export type ThingName = string;
export type MaxResults = number;
export type NextToken = string;
export type Description = string;
export type TagKey = string;
export type TagValue = string;
export type Service = string;
export type TimeoutInMin = number;
export type ErrorMessage = string;
export type TunnelArn = string;
export type ClientAccessToken = string | Redacted.Redacted<string>;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CloseTunnelRequest {
  tunnelId: string;
  delete?: boolean;
}
export const CloseTunnelRequest = S.suspend(() =>
  S.Struct({
    tunnelId: S.String.pipe(T.HttpLabel("tunnelId")),
    delete: S.optional(S.Boolean).pipe(T.HttpQuery("delete")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tunnels/{tunnelId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CloseTunnelRequest",
}) as any as S.Schema<CloseTunnelRequest>;
export interface CloseTunnelResponse {}
export const CloseTunnelResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CloseTunnelResponse",
}) as any as S.Schema<CloseTunnelResponse>;
export interface DescribeTunnelRequest {
  tunnelId: string;
}
export const DescribeTunnelRequest = S.suspend(() =>
  S.Struct({ tunnelId: S.String.pipe(T.HttpLabel("tunnelId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tunnels/{tunnelId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTunnelRequest",
}) as any as S.Schema<DescribeTunnelRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags" }),
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
export interface ListTunnelsRequest {
  thingName?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListTunnelsRequest = S.suspend(() =>
  S.Struct({
    thingName: S.optional(S.String).pipe(T.HttpQuery("thingName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tunnels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTunnelsRequest",
}) as any as S.Schema<ListTunnelsRequest>;
export type ServiceList = string[];
export const ServiceList = S.Array(S.String);
export interface DestinationConfig {
  thingName?: string;
  services: ServiceList;
}
export const DestinationConfig = S.suspend(() =>
  S.Struct({ thingName: S.optional(S.String), services: ServiceList }),
).annotations({
  identifier: "DestinationConfig",
}) as any as S.Schema<DestinationConfig>;
export interface RotateTunnelAccessTokenRequest {
  tunnelId: string;
  clientMode: string;
  destinationConfig?: DestinationConfig;
}
export const RotateTunnelAccessTokenRequest = S.suspend(() =>
  S.Struct({
    tunnelId: S.String.pipe(T.HttpLabel("tunnelId")),
    clientMode: S.String,
    destinationConfig: S.optional(DestinationConfig),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tunnel/{tunnelId}/rotate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RotateTunnelAccessTokenRequest",
}) as any as S.Schema<RotateTunnelAccessTokenRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags" }),
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
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/untag" }),
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
export interface TimeoutConfig {
  maxLifetimeTimeoutMinutes?: number;
}
export const TimeoutConfig = S.suspend(() =>
  S.Struct({ maxLifetimeTimeoutMinutes: S.optional(S.Number) }),
).annotations({
  identifier: "TimeoutConfig",
}) as any as S.Schema<TimeoutConfig>;
export interface ListTagsForResourceResponse {
  tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface OpenTunnelRequest {
  description?: string;
  tags?: TagList;
  destinationConfig?: DestinationConfig;
  timeoutConfig?: TimeoutConfig;
}
export const OpenTunnelRequest = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    tags: S.optional(TagList),
    destinationConfig: S.optional(DestinationConfig),
    timeoutConfig: S.optional(TimeoutConfig),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tunnels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "OpenTunnelRequest",
}) as any as S.Schema<OpenTunnelRequest>;
export interface RotateTunnelAccessTokenResponse {
  tunnelArn?: string;
  sourceAccessToken?: string | Redacted.Redacted<string>;
  destinationAccessToken?: string | Redacted.Redacted<string>;
}
export const RotateTunnelAccessTokenResponse = S.suspend(() =>
  S.Struct({
    tunnelArn: S.optional(S.String),
    sourceAccessToken: S.optional(SensitiveString),
    destinationAccessToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "RotateTunnelAccessTokenResponse",
}) as any as S.Schema<RotateTunnelAccessTokenResponse>;
export interface TunnelSummary {
  tunnelId?: string;
  tunnelArn?: string;
  status?: string;
  description?: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}
export const TunnelSummary = S.suspend(() =>
  S.Struct({
    tunnelId: S.optional(S.String),
    tunnelArn: S.optional(S.String),
    status: S.optional(S.String),
    description: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "TunnelSummary",
}) as any as S.Schema<TunnelSummary>;
export type TunnelSummaryList = TunnelSummary[];
export const TunnelSummaryList = S.Array(TunnelSummary);
export interface ListTunnelsResponse {
  tunnelSummaries?: TunnelSummaryList;
  nextToken?: string;
}
export const ListTunnelsResponse = S.suspend(() =>
  S.Struct({
    tunnelSummaries: S.optional(TunnelSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTunnelsResponse",
}) as any as S.Schema<ListTunnelsResponse>;
export interface OpenTunnelResponse {
  tunnelId?: string;
  tunnelArn?: string;
  sourceAccessToken?: string | Redacted.Redacted<string>;
  destinationAccessToken?: string | Redacted.Redacted<string>;
}
export const OpenTunnelResponse = S.suspend(() =>
  S.Struct({
    tunnelId: S.optional(S.String),
    tunnelArn: S.optional(S.String),
    sourceAccessToken: S.optional(SensitiveString),
    destinationAccessToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "OpenTunnelResponse",
}) as any as S.Schema<OpenTunnelResponse>;
export interface ConnectionState {
  status?: string;
  lastUpdatedAt?: Date;
}
export const ConnectionState = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ConnectionState",
}) as any as S.Schema<ConnectionState>;
export interface Tunnel {
  tunnelId?: string;
  tunnelArn?: string;
  status?: string;
  sourceConnectionState?: ConnectionState;
  destinationConnectionState?: ConnectionState;
  description?: string;
  destinationConfig?: DestinationConfig;
  timeoutConfig?: TimeoutConfig;
  tags?: TagList;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}
export const Tunnel = S.suspend(() =>
  S.Struct({
    tunnelId: S.optional(S.String),
    tunnelArn: S.optional(S.String),
    status: S.optional(S.String),
    sourceConnectionState: S.optional(ConnectionState),
    destinationConnectionState: S.optional(ConnectionState),
    description: S.optional(S.String),
    destinationConfig: S.optional(DestinationConfig),
    timeoutConfig: S.optional(TimeoutConfig),
    tags: S.optional(TagList),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Tunnel" }) as any as S.Schema<Tunnel>;
export interface DescribeTunnelResponse {
  tunnel?: Tunnel;
}
export const DescribeTunnelResponse = S.suspend(() =>
  S.Struct({ tunnel: S.optional(Tunnel) }),
).annotations({
  identifier: "DescribeTunnelResponse",
}) as any as S.Schema<DescribeTunnelResponse>;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceededException", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}

//# Operations
/**
 * Closes a tunnel identified by the unique tunnel id. When a `CloseTunnel`
 * request is received, we close the WebSocket connections between the client and proxy
 * server so no data can be transmitted.
 *
 * Requires permission to access the CloseTunnel action.
 */
export const closeTunnel: (
  input: CloseTunnelRequest,
) => Effect.Effect<
  CloseTunnelResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CloseTunnelRequest,
  output: CloseTunnelResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Revokes the current client access token (CAT) and returns new CAT for clients to
 * use when reconnecting to secure tunneling to access the same tunnel.
 *
 * Requires permission to access the RotateTunnelAccessToken action.
 *
 * Rotating the CAT doesn't extend the tunnel duration. For example, say the tunnel
 * duration is 12 hours and the tunnel has already been open for 4 hours. When you
 * rotate the access tokens, the new tokens that are generated can only be used for the
 * remaining 8 hours.
 */
export const rotateTunnelAccessToken: (
  input: RotateTunnelAccessTokenRequest,
) => Effect.Effect<
  RotateTunnelAccessTokenResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RotateTunnelAccessTokenRequest,
  output: RotateTunnelAccessTokenResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * A resource tag.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Removes a tag from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * List all tunnels for an Amazon Web Services account. Tunnels are listed by creation time in
 * descending order, newer tunnels will be listed before older tunnels.
 *
 * Requires permission to access the ListTunnels action.
 */
export const listTunnels: {
  (
    input: ListTunnelsRequest,
  ): Effect.Effect<
    ListTunnelsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTunnelsRequest,
  ) => Stream.Stream<
    ListTunnelsResponse,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTunnelsRequest,
  ) => Stream.Stream<
    unknown,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTunnelsRequest,
  output: ListTunnelsResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about a tunnel identified by the unique tunnel id.
 *
 * Requires permission to access the DescribeTunnel action.
 */
export const describeTunnel: (
  input: DescribeTunnelRequest,
) => Effect.Effect<
  DescribeTunnelResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTunnelRequest,
  output: DescribeTunnelResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Creates a new tunnel, and returns two client access tokens for clients to use to
 * connect to the IoT Secure Tunneling proxy server.
 *
 * Requires permission to access the OpenTunnel action.
 */
export const openTunnel: (
  input: OpenTunnelRequest,
) => Effect.Effect<
  OpenTunnelResponse,
  LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: OpenTunnelRequest,
  output: OpenTunnelResponse,
  errors: [LimitExceededException],
}));

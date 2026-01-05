import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export const TagKeyList = S.Array(S.String);
export class CloseTunnelRequest extends S.Class<CloseTunnelRequest>(
  "CloseTunnelRequest",
)(
  {
    tunnelId: S.String.pipe(T.HttpLabel("tunnelId")),
    delete: S.optional(S.Boolean).pipe(T.HttpQuery("delete")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tunnels/{tunnelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CloseTunnelResponse extends S.Class<CloseTunnelResponse>(
  "CloseTunnelResponse",
)({}) {}
export class DescribeTunnelRequest extends S.Class<DescribeTunnelRequest>(
  "DescribeTunnelRequest",
)(
  { tunnelId: S.String.pipe(T.HttpLabel("tunnelId")) },
  T.all(
    T.Http({ method: "GET", uri: "/tunnels/{tunnelId}" }),
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
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")) },
  T.all(T.Http({ method: "GET", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class ListTunnelsRequest extends S.Class<ListTunnelsRequest>(
  "ListTunnelsRequest",
)(
  {
    thingName: S.optional(S.String).pipe(T.HttpQuery("thingName")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/tunnels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ServiceList = S.Array(S.String);
export class DestinationConfig extends S.Class<DestinationConfig>(
  "DestinationConfig",
)({ thingName: S.optional(S.String), services: ServiceList }) {}
export class RotateTunnelAccessTokenRequest extends S.Class<RotateTunnelAccessTokenRequest>(
  "RotateTunnelAccessTokenRequest",
)(
  {
    tunnelId: S.String.pipe(T.HttpLabel("tunnelId")),
    clientMode: S.String,
    destinationConfig: S.optional(DestinationConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tunnel/{tunnelId}/rotate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/tags" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeyList },
  T.all(
    T.Http({ method: "POST", uri: "/untag" }),
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
export class TimeoutConfig extends S.Class<TimeoutConfig>("TimeoutConfig")({
  maxLifetimeTimeoutMinutes: S.optional(S.Number),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagList) }) {}
export class OpenTunnelRequest extends S.Class<OpenTunnelRequest>(
  "OpenTunnelRequest",
)(
  {
    description: S.optional(S.String),
    tags: S.optional(TagList),
    destinationConfig: S.optional(DestinationConfig),
    timeoutConfig: S.optional(TimeoutConfig),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tunnels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RotateTunnelAccessTokenResponse extends S.Class<RotateTunnelAccessTokenResponse>(
  "RotateTunnelAccessTokenResponse",
)({
  tunnelArn: S.optional(S.String),
  sourceAccessToken: S.optional(S.String),
  destinationAccessToken: S.optional(S.String),
}) {}
export class TunnelSummary extends S.Class<TunnelSummary>("TunnelSummary")({
  tunnelId: S.optional(S.String),
  tunnelArn: S.optional(S.String),
  status: S.optional(S.String),
  description: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const TunnelSummaryList = S.Array(TunnelSummary);
export class ListTunnelsResponse extends S.Class<ListTunnelsResponse>(
  "ListTunnelsResponse",
)({
  tunnelSummaries: S.optional(TunnelSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class OpenTunnelResponse extends S.Class<OpenTunnelResponse>(
  "OpenTunnelResponse",
)({
  tunnelId: S.optional(S.String),
  tunnelArn: S.optional(S.String),
  sourceAccessToken: S.optional(S.String),
  destinationAccessToken: S.optional(S.String),
}) {}
export class ConnectionState extends S.Class<ConnectionState>(
  "ConnectionState",
)({
  status: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class Tunnel extends S.Class<Tunnel>("Tunnel")({
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
}) {}
export class DescribeTunnelResponse extends S.Class<DescribeTunnelResponse>(
  "DescribeTunnelResponse",
)({ tunnel: S.optional(Tunnel) }) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceededException", httpResponseCode: 403 }),
) {}

//# Operations
/**
 * Closes a tunnel identified by the unique tunnel id. When a `CloseTunnel`
 * request is received, we close the WebSocket connections between the client and proxy
 * server so no data can be transmitted.
 *
 * Requires permission to access the CloseTunnel action.
 */
export const closeTunnel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CloseTunnelRequest,
  output: CloseTunnelResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const rotateTunnelAccessToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RotateTunnelAccessTokenRequest,
    output: RotateTunnelAccessTokenResponse,
    errors: [ResourceNotFoundException],
  }),
);
/**
 * A resource tag.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Removes a tag from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTunnels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTunnelsRequest,
    output: ListTunnelsResponse,
    errors: [],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Gets information about a tunnel identified by the unique tunnel id.
 *
 * Requires permission to access the DescribeTunnel action.
 */
export const describeTunnel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const openTunnel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: OpenTunnelRequest,
  output: OpenTunnelResponse,
  errors: [LimitExceededException],
}));

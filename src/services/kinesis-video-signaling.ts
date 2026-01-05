import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Kinesis Video Signaling",
  serviceShapeName: "AWSAcuitySignalingService",
});
const auth = T.AwsAuthSigv4({ name: "kinesisvideo" });
const ver = T.ServiceVersion("2019-12-04");
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
                        url: "https://kinesisvideo-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://kinesisvideo-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://kinesisvideo.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://kinesisvideo.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetIceServerConfigRequest extends S.Class<GetIceServerConfigRequest>(
  "GetIceServerConfigRequest",
)(
  {
    ChannelARN: S.String,
    ClientId: S.optional(S.String),
    Service: S.optional(S.String),
    Username: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/v1/get-ice-server-config" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendAlexaOfferToMasterRequest extends S.Class<SendAlexaOfferToMasterRequest>(
  "SendAlexaOfferToMasterRequest",
)(
  { ChannelARN: S.String, SenderClientId: S.String, MessagePayload: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/v1/send-alexa-offer-to-master" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendAlexaOfferToMasterResponse extends S.Class<SendAlexaOfferToMasterResponse>(
  "SendAlexaOfferToMasterResponse",
)({ Answer: S.optional(S.String) }) {}
export const Uris = S.Array(S.String);
export class IceServer extends S.Class<IceServer>("IceServer")({
  Uris: S.optional(Uris),
  Username: S.optional(S.String),
  Password: S.optional(S.String),
  Ttl: S.optional(S.Number),
}) {}
export const IceServerList = S.Array(IceServer);
export class GetIceServerConfigResponse extends S.Class<GetIceServerConfigResponse>(
  "GetIceServerConfigResponse",
)({ IceServerList: S.optional(IceServerList) }) {}

//# Errors
export class ClientLimitExceededException extends S.TaggedError<ClientLimitExceededException>()(
  "ClientLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { Message: S.optional(S.String) },
) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  { Message: S.optional(S.String) },
) {}
export class InvalidClientException extends S.TaggedError<InvalidClientException>()(
  "InvalidClientException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class SessionExpiredException extends S.TaggedError<SessionExpiredException>()(
  "SessionExpiredException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * This API allows you to connect WebRTC-enabled devices with Alexa display devices. When
 * invoked, it sends the Alexa Session Description Protocol (SDP) offer to the master peer.
 * The offer is delivered as soon as the master is connected to the specified signaling
 * channel. This API returns the SDP answer from the connected master. If the master is not
 * connected to the signaling channel, redelivery requests are made until the message
 * expires.
 */
export const sendAlexaOfferToMaster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendAlexaOfferToMasterRequest,
    output: SendAlexaOfferToMasterResponse,
    errors: [
      ClientLimitExceededException,
      InvalidArgumentException,
      NotAuthorizedException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets the Interactive Connectivity Establishment (ICE) server configuration
 * information, including URIs, username, and password which can be used to configure the
 * WebRTC connection. The ICE component uses this configuration information to setup the
 * WebRTC connection, including authenticating with the Traversal Using Relays around NAT
 * (TURN) relay server.
 *
 * TURN is a protocol that is used to improve the connectivity of peer-to-peer
 * applications. By providing a cloud-based relay service, TURN ensures that a connection
 * can be established even when one or more peers are incapable of a direct peer-to-peer
 * connection. For more information, see A REST API For
 * Access To TURN Services.
 *
 * You can invoke this API to establish a fallback mechanism in case either of the peers
 * is unable to establish a direct peer-to-peer connection over a signaling channel. You
 * must specify either a signaling channel ARN or the client ID in order to invoke this
 * API.
 */
export const getIceServerConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIceServerConfigRequest,
  output: GetIceServerConfigResponse,
  errors: [
    ClientLimitExceededException,
    InvalidArgumentException,
    InvalidClientException,
    NotAuthorizedException,
    ResourceNotFoundException,
    SessionExpiredException,
  ],
}));

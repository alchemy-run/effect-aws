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
  sdkId: "ApiGatewayManagementApi",
  serviceShapeName: "ApiGatewayManagementApi",
});
const auth = T.AwsAuthSigv4({ name: "execute-api" });
const ver = T.ServiceVersion("2018-11-29");
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
                        url: "https://execute-api-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://execute-api-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://execute-api.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://execute-api.{Region}.{PartitionResult#dnsSuffix}",
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
export type __string = string;

//# Schemas
export interface DeleteConnectionRequest {
  ConnectionId: string;
}
export const DeleteConnectionRequest = S.suspend(() =>
  S.Struct({ ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/@connections/{ConnectionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectionRequest",
}) as any as S.Schema<DeleteConnectionRequest>;
export interface DeleteConnectionResponse {}
export const DeleteConnectionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConnectionResponse",
}) as any as S.Schema<DeleteConnectionResponse>;
export interface GetConnectionRequest {
  ConnectionId: string;
}
export const GetConnectionRequest = S.suspend(() =>
  S.Struct({ ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/@connections/{ConnectionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectionRequest",
}) as any as S.Schema<GetConnectionRequest>;
export interface PostToConnectionRequest {
  Data: T.StreamingInputBody;
  ConnectionId: string;
}
export const PostToConnectionRequest = S.suspend(() =>
  S.Struct({
    Data: T.StreamingInput.pipe(T.HttpPayload()),
    ConnectionId: S.String.pipe(T.HttpLabel("ConnectionId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/@connections/{ConnectionId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PostToConnectionRequest",
}) as any as S.Schema<PostToConnectionRequest>;
export interface PostToConnectionResponse {}
export const PostToConnectionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PostToConnectionResponse",
}) as any as S.Schema<PostToConnectionResponse>;
export interface Identity {
  SourceIp: string;
  UserAgent: string;
}
export const Identity = S.suspend(() =>
  S.Struct({
    SourceIp: S.String.pipe(T.JsonName("sourceIp")),
    UserAgent: S.String.pipe(T.JsonName("userAgent")),
  }),
).annotations({ identifier: "Identity" }) as any as S.Schema<Identity>;
export interface GetConnectionResponse {
  ConnectedAt?: Date;
  Identity?: Identity;
  LastActiveAt?: Date;
}
export const GetConnectionResponse = S.suspend(() =>
  S.Struct({
    ConnectedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("connectedAt"),
    ),
    Identity: S.optional(Identity)
      .pipe(T.JsonName("identity"))
      .annotations({ identifier: "Identity" }),
    LastActiveAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.JsonName("lastActiveAt"),
    ),
  }),
).annotations({
  identifier: "GetConnectionResponse",
}) as any as S.Schema<GetConnectionResponse>;

//# Errors
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {},
).pipe(C.withAuthError) {}
export class GoneException extends S.TaggedError<GoneException>()(
  "GoneException",
  {},
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
).pipe(C.withThrottlingError) {}
export class PayloadTooLargeException extends S.TaggedError<PayloadTooLargeException>()(
  "PayloadTooLargeException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Delete the connection with the provided id.
 */
export const deleteConnection: (
  input: DeleteConnectionRequest,
) => Effect.Effect<
  DeleteConnectionResponse,
  ForbiddenException | GoneException | LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: DeleteConnectionResponse,
  errors: [ForbiddenException, GoneException, LimitExceededException],
}));
/**
 * Sends the provided data to the specified connection.
 */
export const postToConnection: (
  input: PostToConnectionRequest,
) => Effect.Effect<
  PostToConnectionResponse,
  | ForbiddenException
  | GoneException
  | LimitExceededException
  | PayloadTooLargeException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PostToConnectionRequest,
  output: PostToConnectionResponse,
  errors: [
    ForbiddenException,
    GoneException,
    LimitExceededException,
    PayloadTooLargeException,
  ],
}));
/**
 * Get information about the connection with the provided id.
 */
export const getConnection: (
  input: GetConnectionRequest,
) => Effect.Effect<
  GetConnectionResponse,
  ForbiddenException | GoneException | LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionRequest,
  output: GetConnectionResponse,
  errors: [ForbiddenException, GoneException, LimitExceededException],
}));

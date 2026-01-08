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
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://execute-api-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://execute-api-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://execute-api.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://execute-api.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
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

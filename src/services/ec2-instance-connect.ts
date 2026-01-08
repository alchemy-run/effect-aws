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
  sdkId: "EC2 Instance Connect",
  serviceShapeName: "AWSEC2InstanceConnectService",
});
const auth = T.AwsAuthSigv4({ name: "ec2-instance-connect" });
const ver = T.ServiceVersion("2018-04-02");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://ec2-instance-connect-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://ec2-instance-connect-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ec2-instance-connect.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ec2-instance-connect.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type InstanceId = string;
export type SerialPort = number;
export type SSHPublicKey = string;
export type InstanceOSUser = string;
export type AvailabilityZone = string;
export type RequestId = string;

//# Schemas
export interface SendSerialConsoleSSHPublicKeyRequest {
  InstanceId: string;
  SerialPort?: number;
  SSHPublicKey: string;
}
export const SendSerialConsoleSSHPublicKeyRequest = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    SerialPort: S.optional(S.Number),
    SSHPublicKey: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendSerialConsoleSSHPublicKeyRequest",
}) as any as S.Schema<SendSerialConsoleSSHPublicKeyRequest>;
export interface SendSSHPublicKeyRequest {
  InstanceId: string;
  InstanceOSUser: string;
  SSHPublicKey: string;
  AvailabilityZone?: string;
}
export const SendSSHPublicKeyRequest = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    InstanceOSUser: S.String,
    SSHPublicKey: S.String,
    AvailabilityZone: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendSSHPublicKeyRequest",
}) as any as S.Schema<SendSSHPublicKeyRequest>;
export interface SendSerialConsoleSSHPublicKeyResponse {
  RequestId?: string;
  Success?: boolean;
}
export const SendSerialConsoleSSHPublicKeyResponse = S.suspend(() =>
  S.Struct({ RequestId: S.optional(S.String), Success: S.optional(S.Boolean) }),
).annotations({
  identifier: "SendSerialConsoleSSHPublicKeyResponse",
}) as any as S.Schema<SendSerialConsoleSSHPublicKeyResponse>;
export interface SendSSHPublicKeyResponse {
  RequestId?: string;
  Success?: boolean;
}
export const SendSSHPublicKeyResponse = S.suspend(() =>
  S.Struct({ RequestId: S.optional(S.String), Success: S.optional(S.Boolean) }),
).annotations({
  identifier: "SendSSHPublicKeyResponse",
}) as any as S.Schema<SendSSHPublicKeyResponse>;

//# Errors
export class AuthException extends S.TaggedError<AuthException>()(
  "AuthException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "Forbidden", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class EC2InstanceNotFoundException extends S.TaggedError<EC2InstanceNotFoundException>()(
  "EC2InstanceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "EC2InstanceNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class EC2InstanceStateInvalidException extends S.TaggedError<EC2InstanceStateInvalidException>()(
  "EC2InstanceStateInvalidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "EC2InstanceStateInvalid", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EC2InstanceTypeInvalidException extends S.TaggedError<EC2InstanceTypeInvalidException>()(
  "EC2InstanceTypeInvalidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "EC2InstanceTypeInvalid", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class EC2InstanceUnavailableException extends S.TaggedError<EC2InstanceUnavailableException>()(
  "EC2InstanceUnavailableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "EC2InstanceUnavailable", httpResponseCode: 503 }),
).pipe(C.withServerError) {}
export class InvalidArgsException extends S.TaggedError<InvalidArgsException>()(
  "InvalidArgsException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidArguments", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServerError", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class SerialConsoleAccessDisabledException extends S.TaggedError<SerialConsoleAccessDisabledException>()(
  "SerialConsoleAccessDisabledException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SerialConsoleAccessDisabled",
    httpResponseCode: 403,
  }),
).pipe(C.withAuthError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyRequests", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class SerialConsoleSessionLimitExceededException extends S.TaggedError<SerialConsoleSessionLimitExceededException>()(
  "SerialConsoleSessionLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SerialConsoleSessionLimitExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SerialConsoleSessionUnavailableException extends S.TaggedError<SerialConsoleSessionUnavailableException>()(
  "SerialConsoleSessionUnavailableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SerialConsoleSessionUnavailable",
    httpResponseCode: 500,
  }),
).pipe(C.withServerError) {}
export class SerialConsoleSessionUnsupportedException extends S.TaggedError<SerialConsoleSessionUnsupportedException>()(
  "SerialConsoleSessionUnsupportedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SerialConsoleSessionUnsupported",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Pushes an SSH public key to the specified EC2 instance for use by the specified user.
 * The key remains for 60 seconds. For more information, see Connect to
 * your Linux instance using EC2 Instance Connect in the Amazon EC2
 * User Guide.
 */
export const sendSSHPublicKey: (
  input: SendSSHPublicKeyRequest,
) => Effect.Effect<
  SendSSHPublicKeyResponse,
  | AuthException
  | EC2InstanceNotFoundException
  | EC2InstanceStateInvalidException
  | EC2InstanceUnavailableException
  | InvalidArgsException
  | ServiceException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendSSHPublicKeyRequest,
  output: SendSSHPublicKeyResponse,
  errors: [
    AuthException,
    EC2InstanceNotFoundException,
    EC2InstanceStateInvalidException,
    EC2InstanceUnavailableException,
    InvalidArgsException,
    ServiceException,
    ThrottlingException,
  ],
}));
/**
 * Pushes an SSH public key to the specified EC2 instance. The key remains for 60
 * seconds, which gives you 60 seconds to establish a serial console connection to the
 * instance using SSH. For more information, see EC2 Serial Console in
 * the *Amazon EC2 User Guide*.
 */
export const sendSerialConsoleSSHPublicKey: (
  input: SendSerialConsoleSSHPublicKeyRequest,
) => Effect.Effect<
  SendSerialConsoleSSHPublicKeyResponse,
  | AuthException
  | EC2InstanceNotFoundException
  | EC2InstanceStateInvalidException
  | EC2InstanceTypeInvalidException
  | EC2InstanceUnavailableException
  | InvalidArgsException
  | SerialConsoleAccessDisabledException
  | SerialConsoleSessionLimitExceededException
  | SerialConsoleSessionUnavailableException
  | SerialConsoleSessionUnsupportedException
  | ServiceException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendSerialConsoleSSHPublicKeyRequest,
  output: SendSerialConsoleSSHPublicKeyResponse,
  errors: [
    AuthException,
    EC2InstanceNotFoundException,
    EC2InstanceStateInvalidException,
    EC2InstanceTypeInvalidException,
    EC2InstanceUnavailableException,
    InvalidArgsException,
    SerialConsoleAccessDisabledException,
    SerialConsoleSessionLimitExceededException,
    SerialConsoleSessionUnavailableException,
    SerialConsoleSessionUnsupportedException,
    ServiceException,
    ThrottlingException,
  ],
}));

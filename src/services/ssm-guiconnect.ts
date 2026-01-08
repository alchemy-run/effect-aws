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
  sdkId: "SSM GuiConnect",
  serviceShapeName: "SSMGuiConnect",
});
const auth = T.AwsAuthSigv4({ name: "ssm-guiconnect" });
const ver = T.ServiceVersion("2021-05-01");
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
              `https://ssm-guiconnect-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://ssm-guiconnect-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ssm-guiconnect.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ssm-guiconnect.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClientToken = string;
export type AccountId = string;
export type BucketName = string;
export type ErrorMessage = string;

//# Schemas
export interface GetConnectionRecordingPreferencesRequest {}
export const GetConnectionRecordingPreferencesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetConnectionRecordingPreferencesRequest",
}) as any as S.Schema<GetConnectionRecordingPreferencesRequest>;
export interface DeleteConnectionRecordingPreferencesRequest {
  ClientToken?: string;
}
export const DeleteConnectionRecordingPreferencesRequest = S.suspend(() =>
  S.Struct({ ClientToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteConnectionRecordingPreferences" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectionRecordingPreferencesRequest",
}) as any as S.Schema<DeleteConnectionRecordingPreferencesRequest>;
export interface S3Bucket {
  BucketOwner: string;
  BucketName: string;
}
export const S3Bucket = S.suspend(() =>
  S.Struct({ BucketOwner: S.String, BucketName: S.String }),
).annotations({ identifier: "S3Bucket" }) as any as S.Schema<S3Bucket>;
export type S3Buckets = S3Bucket[];
export const S3Buckets = S.Array(S3Bucket);
export interface RecordingDestinations {
  S3Buckets: S3Buckets;
}
export const RecordingDestinations = S.suspend(() =>
  S.Struct({ S3Buckets: S3Buckets }),
).annotations({
  identifier: "RecordingDestinations",
}) as any as S.Schema<RecordingDestinations>;
export interface ConnectionRecordingPreferences {
  RecordingDestinations: RecordingDestinations;
  KMSKeyArn: string;
}
export const ConnectionRecordingPreferences = S.suspend(() =>
  S.Struct({
    RecordingDestinations: RecordingDestinations,
    KMSKeyArn: S.String,
  }),
).annotations({
  identifier: "ConnectionRecordingPreferences",
}) as any as S.Schema<ConnectionRecordingPreferences>;
export interface UpdateConnectionRecordingPreferencesRequest {
  ConnectionRecordingPreferences: ConnectionRecordingPreferences;
  ClientToken?: string;
}
export const UpdateConnectionRecordingPreferencesRequest = S.suspend(() =>
  S.Struct({
    ConnectionRecordingPreferences: ConnectionRecordingPreferences,
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateConnectionRecordingPreferences" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConnectionRecordingPreferencesRequest",
}) as any as S.Schema<UpdateConnectionRecordingPreferencesRequest>;
export interface DeleteConnectionRecordingPreferencesResponse {
  ClientToken?: string;
}
export const DeleteConnectionRecordingPreferencesResponse = S.suspend(() =>
  S.Struct({ ClientToken: S.optional(S.String) }),
).annotations({
  identifier: "DeleteConnectionRecordingPreferencesResponse",
}) as any as S.Schema<DeleteConnectionRecordingPreferencesResponse>;
export interface UpdateConnectionRecordingPreferencesResponse {
  ClientToken?: string;
  ConnectionRecordingPreferences?: ConnectionRecordingPreferences;
}
export const UpdateConnectionRecordingPreferencesResponse = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String),
    ConnectionRecordingPreferences: S.optional(ConnectionRecordingPreferences),
  }),
).annotations({
  identifier: "UpdateConnectionRecordingPreferencesResponse",
}) as any as S.Schema<UpdateConnectionRecordingPreferencesResponse>;
export interface GetConnectionRecordingPreferencesResponse {
  ClientToken?: string;
  ConnectionRecordingPreferences?: ConnectionRecordingPreferences;
}
export const GetConnectionRecordingPreferencesResponse = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String),
    ConnectionRecordingPreferences: S.optional(ConnectionRecordingPreferences),
  }),
).annotations({
  identifier: "GetConnectionRecordingPreferencesResponse",
}) as any as S.Schema<GetConnectionRecordingPreferencesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes the preferences for recording RDP connections.
 */
export const deleteConnectionRecordingPreferences: (
  input: DeleteConnectionRecordingPreferencesRequest,
) => Effect.Effect<
  DeleteConnectionRecordingPreferencesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRecordingPreferencesRequest,
  output: DeleteConnectionRecordingPreferencesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the preferences for recording RDP connections.
 */
export const updateConnectionRecordingPreferences: (
  input: UpdateConnectionRecordingPreferencesRequest,
) => Effect.Effect<
  UpdateConnectionRecordingPreferencesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectionRecordingPreferencesRequest,
  output: UpdateConnectionRecordingPreferencesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the preferences specified for recording RDP connections in the requesting Amazon Web Services account and Amazon Web Services Region.
 */
export const getConnectionRecordingPreferences: (
  input: GetConnectionRecordingPreferencesRequest,
) => Effect.Effect<
  GetConnectionRecordingPreferencesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionRecordingPreferencesRequest,
  output: GetConnectionRecordingPreferencesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

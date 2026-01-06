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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://ssm-guiconnect-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://ssm-guiconnect-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://ssm-guiconnect.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://ssm-guiconnect.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
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

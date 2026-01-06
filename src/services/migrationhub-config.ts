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
  sdkId: "MigrationHub Config",
  serviceShapeName: "AWSMigrationHubMultiAccountService",
});
const auth = T.AwsAuthSigv4({ name: "mgh" });
const ver = T.ServiceVersion("2019-06-30");
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
                      conditions: [],
                      endpoint: {
                        url: "https://migrationhub-config-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://migrationhub-config-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://migrationhub-config.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://migrationhub-config.{Region}.{PartitionResult#dnsSuffix}",
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
export type HomeRegion = string;
export type ControlId = string;
export type DescribeHomeRegionControlsMaxResults = number;
export type Token = string;
export type TargetId = string;
export type ErrorMessage = string;
export type RetryAfterSeconds = number;

//# Schemas
export interface GetHomeRegionRequest {}
export const GetHomeRegionRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetHomeRegionRequest",
}) as any as S.Schema<GetHomeRegionRequest>;
export interface DeleteHomeRegionControlRequest {
  ControlId: string;
}
export const DeleteHomeRegionControlRequest = S.suspend(() =>
  S.Struct({ ControlId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteHomeRegionControlRequest",
}) as any as S.Schema<DeleteHomeRegionControlRequest>;
export interface DeleteHomeRegionControlResult {}
export const DeleteHomeRegionControlResult = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteHomeRegionControlResult",
}) as any as S.Schema<DeleteHomeRegionControlResult>;
export interface Target {
  Type: string;
  Id?: string;
}
export const Target = S.suspend(() =>
  S.Struct({ Type: S.String, Id: S.optional(S.String) }),
).annotations({ identifier: "Target" }) as any as S.Schema<Target>;
export interface DescribeHomeRegionControlsRequest {
  ControlId?: string;
  HomeRegion?: string;
  Target?: Target;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeHomeRegionControlsRequest = S.suspend(() =>
  S.Struct({
    ControlId: S.optional(S.String),
    HomeRegion: S.optional(S.String),
    Target: S.optional(Target),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeHomeRegionControlsRequest",
}) as any as S.Schema<DescribeHomeRegionControlsRequest>;
export interface GetHomeRegionResult {
  HomeRegion?: string;
}
export const GetHomeRegionResult = S.suspend(() =>
  S.Struct({ HomeRegion: S.optional(S.String) }),
).annotations({
  identifier: "GetHomeRegionResult",
}) as any as S.Schema<GetHomeRegionResult>;
export interface CreateHomeRegionControlRequest {
  HomeRegion: string;
  Target: Target;
  DryRun?: boolean;
}
export const CreateHomeRegionControlRequest = S.suspend(() =>
  S.Struct({
    HomeRegion: S.String,
    Target: Target,
    DryRun: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateHomeRegionControlRequest",
}) as any as S.Schema<CreateHomeRegionControlRequest>;
export interface HomeRegionControl {
  ControlId?: string;
  HomeRegion?: string;
  Target?: Target;
  RequestedTime?: Date;
}
export const HomeRegionControl = S.suspend(() =>
  S.Struct({
    ControlId: S.optional(S.String),
    HomeRegion: S.optional(S.String),
    Target: S.optional(Target),
    RequestedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "HomeRegionControl",
}) as any as S.Schema<HomeRegionControl>;
export type HomeRegionControls = HomeRegionControl[];
export const HomeRegionControls = S.Array(HomeRegionControl);
export interface CreateHomeRegionControlResult {
  HomeRegionControl?: HomeRegionControl;
}
export const CreateHomeRegionControlResult = S.suspend(() =>
  S.Struct({ HomeRegionControl: S.optional(HomeRegionControl) }),
).annotations({
  identifier: "CreateHomeRegionControlResult",
}) as any as S.Schema<CreateHomeRegionControlResult>;
export interface DescribeHomeRegionControlsResult {
  HomeRegionControls?: HomeRegionControls;
  NextToken?: string;
}
export const DescribeHomeRegionControlsResult = S.suspend(() =>
  S.Struct({
    HomeRegionControls: S.optional(HomeRegionControls),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeHomeRegionControlsResult",
}) as any as S.Schema<DescribeHomeRegionControlsResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { Message: S.optional(S.String) },
) {}
export class DryRunOperation extends S.TaggedError<DryRunOperation>()(
  "DryRunOperation",
  { Message: S.optional(S.String) },
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { Message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * This operation deletes the home region configuration for the calling account. The operation does not delete discovery or migration tracking data in the home region.
 */
export const deleteHomeRegionControl: (
  input: DeleteHomeRegionControlRequest,
) => Effect.Effect<
  DeleteHomeRegionControlResult,
  | AccessDeniedException
  | InternalServerError
  | InvalidInputException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHomeRegionControlRequest,
  output: DeleteHomeRegionControlResult,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidInputException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * This API permits filtering on the `ControlId` and `HomeRegion`
 * fields.
 */
export const describeHomeRegionControls: {
  (
    input: DescribeHomeRegionControlsRequest,
  ): Effect.Effect<
    DescribeHomeRegionControlsResult,
    | AccessDeniedException
    | InternalServerError
    | InvalidInputException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeHomeRegionControlsRequest,
  ) => Stream.Stream<
    DescribeHomeRegionControlsResult,
    | AccessDeniedException
    | InternalServerError
    | InvalidInputException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeHomeRegionControlsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerError
    | InvalidInputException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeHomeRegionControlsRequest,
  output: DescribeHomeRegionControlsResult,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidInputException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the calling account’s home region, if configured. This API is used by other AWS
 * services to determine the regional endpoint for calling AWS Application Discovery Service and
 * Migration Hub. You must call `GetHomeRegion` at least once before you call any
 * other AWS Application Discovery Service and AWS Migration Hub APIs, to obtain the account's
 * Migration Hub home region.
 */
export const getHomeRegion: (
  input: GetHomeRegionRequest,
) => Effect.Effect<
  GetHomeRegionResult,
  | AccessDeniedException
  | InternalServerError
  | InvalidInputException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetHomeRegionRequest,
  output: GetHomeRegionResult,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidInputException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * This API sets up the home region for the calling account only.
 */
export const createHomeRegionControl: (
  input: CreateHomeRegionControlRequest,
) => Effect.Effect<
  CreateHomeRegionControlResult,
  | AccessDeniedException
  | DryRunOperation
  | InternalServerError
  | InvalidInputException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHomeRegionControlRequest,
  output: CreateHomeRegionControlResult,
  errors: [
    AccessDeniedException,
    DryRunOperation,
    InternalServerError,
    InvalidInputException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));

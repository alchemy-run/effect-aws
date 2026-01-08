import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
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
              `https://migrationhub-config-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://migrationhub-config-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://migrationhub-config.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://migrationhub-config.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type HomeRegion = string;
export type DryRun = boolean;
export type ControlId = string;
export type DescribeHomeRegionControlsMaxResults = number;
export type Token = string;
export type TargetId = string;
export type ErrorMessage = string;
export type RequestedTime = Date;
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
export type TargetType = "ACCOUNT";
export const TargetType = S.Literal("ACCOUNT");
export interface Target {
  Type: TargetType;
  Id?: string;
}
export const Target = S.suspend(() =>
  S.Struct({ Type: TargetType, Id: S.optional(S.String) }),
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
  HomeRegionControls?: HomeRegionControl[];
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
) => effect.Effect<
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
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
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
) => effect.Effect<
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
) => effect.Effect<
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

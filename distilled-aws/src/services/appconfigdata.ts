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
  sdkId: "AppConfigData",
  serviceShapeName: "AppConfigData",
});
const auth = T.AwsAuthSigv4({ name: "appconfig" });
const ver = T.ServiceVersion("2021-11-11");
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
              `https://appconfigdata-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://appconfigdata.${Region}.amazonaws.com`);
            }
            return e(
              `https://appconfigdata-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://appconfigdata.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://appconfigdata.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Token = string;
export type Identifier = string;
export type OptionalPollSeconds = number;
export type BadRequestReason = string;
export type InvalidParameterProblem = string;
export type ResourceType = string;

//# Schemas
export interface GetLatestConfigurationRequest {
  ConfigurationToken: string;
}
export const GetLatestConfigurationRequest = S.suspend(() =>
  S.Struct({
    ConfigurationToken: S.String.pipe(T.HttpQuery("configuration_token")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/configuration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLatestConfigurationRequest",
}) as any as S.Schema<GetLatestConfigurationRequest>;
export interface StartConfigurationSessionRequest {
  ApplicationIdentifier: string;
  EnvironmentIdentifier: string;
  ConfigurationProfileIdentifier: string;
  RequiredMinimumPollIntervalInSeconds?: number;
}
export const StartConfigurationSessionRequest = S.suspend(() =>
  S.Struct({
    ApplicationIdentifier: S.String,
    EnvironmentIdentifier: S.String,
    ConfigurationProfileIdentifier: S.String,
    RequiredMinimumPollIntervalInSeconds: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configurationsessions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartConfigurationSessionRequest",
}) as any as S.Schema<StartConfigurationSessionRequest>;
export interface GetLatestConfigurationResponse {
  NextPollConfigurationToken?: string;
  NextPollIntervalInSeconds?: number;
  ContentType?: string;
  Configuration?: T.StreamingOutputBody;
  VersionLabel?: string;
}
export const GetLatestConfigurationResponse = S.suspend(() =>
  S.Struct({
    NextPollConfigurationToken: S.optional(S.String).pipe(
      T.HttpHeader("Next-Poll-Configuration-Token"),
    ),
    NextPollIntervalInSeconds: S.optional(S.Number).pipe(
      T.HttpHeader("Next-Poll-Interval-In-Seconds"),
    ),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    Configuration: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    VersionLabel: S.optional(S.String).pipe(T.HttpHeader("Version-Label")),
  }),
).annotations({
  identifier: "GetLatestConfigurationResponse",
}) as any as S.Schema<GetLatestConfigurationResponse>;
export interface StartConfigurationSessionResponse {
  InitialConfigurationToken?: string;
}
export const StartConfigurationSessionResponse = S.suspend(() =>
  S.Struct({ InitialConfigurationToken: S.optional(S.String) }),
).annotations({
  identifier: "StartConfigurationSessionResponse",
}) as any as S.Schema<StartConfigurationSessionResponse>;
export interface InvalidParameterDetail {
  Problem?: string;
}
export const InvalidParameterDetail = S.suspend(() =>
  S.Struct({ Problem: S.optional(S.String) }),
).annotations({
  identifier: "InvalidParameterDetail",
}) as any as S.Schema<InvalidParameterDetail>;
export type InvalidParameterMap = {
  [key: string]: InvalidParameterDetail | undefined;
};
export const InvalidParameterMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(InvalidParameterDetail),
});
export type BadRequestDetails = {
  InvalidParameters: { [key: string]: InvalidParameterDetail | undefined };
};
export const BadRequestDetails = S.Union(
  S.Struct({ InvalidParameters: InvalidParameterMap }),
);
export type StringMap = { [key: string]: string | undefined };
export const StringMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {
    Message: S.optional(S.String),
    Reason: S.optional(S.String),
    Details: S.optional(BadRequestDetails),
  },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    Message: S.optional(S.String),
    ResourceType: S.optional(S.String),
    ReferencedBy: S.optional(StringMap),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Retrieves the latest deployed configuration. This API may return empty configuration
 * data if the client already has the latest version. For more information about this API
 * action and to view example CLI commands that show how to use it with the StartConfigurationSession API action, see Retrieving the
 * configuration in the *AppConfig User Guide*.
 *
 * Note the following important information.
 *
 * - Each configuration token is only valid for one call to
 * `GetLatestConfiguration`. The `GetLatestConfiguration`
 * response includes a `NextPollConfigurationToken` that should always
 * replace the token used for the just-completed call in preparation for the next
 * one.
 *
 * - `GetLatestConfiguration` is a priced call. For more information, see
 * Pricing.
 */
export const getLatestConfiguration: (
  input: GetLatestConfigurationRequest,
) => effect.Effect<
  GetLatestConfigurationResponse,
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLatestConfigurationRequest,
  output: GetLatestConfigurationResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Starts a configuration session used to retrieve a deployed configuration. For more
 * information about this API action and to view example CLI commands that show how to use
 * it with the GetLatestConfiguration API action, see Retrieving the
 * configuration in the *AppConfig User Guide*.
 */
export const startConfigurationSession: (
  input: StartConfigurationSessionRequest,
) => effect.Effect<
  StartConfigurationSessionResponse,
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartConfigurationSessionRequest,
  output: StartConfigurationSessionResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));

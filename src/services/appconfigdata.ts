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
  sdkId: "AppConfigData",
  serviceShapeName: "AppConfigData",
});
const auth = T.AwsAuthSigv4({ name: "appconfig" });
const ver = T.ServiceVersion("2021-11-11");
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
                        url: "https://appconfigdata-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://appconfigdata.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://appconfigdata-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://appconfigdata.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://appconfigdata.{Region}.{PartitionResult#dnsSuffix}",
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
export type Token = string;
export type Identifier = string;
export type OptionalPollSeconds = number;
export type Integer = number;
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
export type InvalidParameterMap = { [key: string]: InvalidParameterDetail };
export const InvalidParameterMap = S.Record({
  key: S.String,
  value: InvalidParameterDetail,
});
export type BadRequestDetails = { InvalidParameters: InvalidParameterMap };
export const BadRequestDetails = S.Union(
  S.Struct({ InvalidParameters: InvalidParameterMap }),
);
export type StringMap = { [key: string]: string };
export const StringMap = S.Record({ key: S.String, value: S.String });

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
) => Effect.Effect<
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
) => Effect.Effect<
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

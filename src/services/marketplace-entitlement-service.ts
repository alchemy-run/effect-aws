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
  sdkId: "Marketplace Entitlement Service",
  serviceShapeName: "AWSMPEntitlementService",
});
const auth = T.AwsAuthSigv4({ name: "aws-marketplace" });
const ver = T.ServiceVersion("2017-01-11");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://entitlement-marketplace.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://entitlement-marketplace.{Region}.amazonaws.com.cn",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-cn",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://entitlement-marketplace.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "stringEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "name"],
                        },
                        "aws-eusc",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://entitlement-marketplace.{Region}.amazonaws.eu",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
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
                          endpoint: {
                            url: "https://entitlement.marketplace-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
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
                          endpoint: {
                            url: "https://entitlement.marketplace-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
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
                          endpoint: {
                            url: "https://entitlement.marketplace.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://entitlement.marketplace.{Region}.{PartitionResult#dnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Newtypes
export type ProductCode = string;
export type NonEmptyString = string;
export type PageSizeInteger = number;
export type FilterValue = string;
export type Integer = number;
export type Double = number;
export type ErrorMessage = string;

//# Schemas
export type FilterValueList = string[];
export const FilterValueList = S.Array(S.String);
export type GetEntitlementFilters = { [key: string]: FilterValueList };
export const GetEntitlementFilters = S.Record({
  key: S.String,
  value: FilterValueList,
});
export interface GetEntitlementsRequest {
  ProductCode: string;
  Filter?: GetEntitlementFilters;
  NextToken?: string;
  MaxResults?: number;
}
export const GetEntitlementsRequest = S.suspend(() =>
  S.Struct({
    ProductCode: S.String,
    Filter: S.optional(GetEntitlementFilters),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEntitlementsRequest",
}) as any as S.Schema<GetEntitlementsRequest>;
export interface EntitlementValue {
  IntegerValue?: number;
  DoubleValue?: number;
  BooleanValue?: boolean;
  StringValue?: string;
}
export const EntitlementValue = S.suspend(() =>
  S.Struct({
    IntegerValue: S.optional(S.Number),
    DoubleValue: S.optional(S.Number),
    BooleanValue: S.optional(S.Boolean),
    StringValue: S.optional(S.String),
  }),
).annotations({
  identifier: "EntitlementValue",
}) as any as S.Schema<EntitlementValue>;
export interface Entitlement {
  ProductCode?: string;
  Dimension?: string;
  CustomerIdentifier?: string;
  CustomerAWSAccountId?: string;
  Value?: EntitlementValue;
  ExpirationDate?: Date;
}
export const Entitlement = S.suspend(() =>
  S.Struct({
    ProductCode: S.optional(S.String),
    Dimension: S.optional(S.String),
    CustomerIdentifier: S.optional(S.String),
    CustomerAWSAccountId: S.optional(S.String),
    Value: S.optional(EntitlementValue),
    ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Entitlement" }) as any as S.Schema<Entitlement>;
export type EntitlementList = Entitlement[];
export const EntitlementList = S.Array(Entitlement);
export interface GetEntitlementsResult {
  Entitlements?: EntitlementList;
  NextToken?: string;
}
export const GetEntitlementsResult = S.suspend(() =>
  S.Struct({
    Entitlements: S.optional(EntitlementList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetEntitlementsResult",
}) as any as S.Schema<GetEntitlementsResult>;

//# Errors
export class InternalServiceErrorException extends S.TaggedError<InternalServiceErrorException>()(
  "InternalServiceErrorException",
  { message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * GetEntitlements retrieves entitlement values for a given product. The results can be
 * filtered based on customer identifier, AWS account ID, or product dimensions.
 *
 * The `CustomerIdentifier` parameter is on path for deprecation. Use `CustomerAWSAccountID` instead.
 *
 * These parameters are mutually exclusive. You can't specify both `CustomerIdentifier` and `CustomerAWSAccountID` in the same request.
 */
export const getEntitlements: {
  (
    input: GetEntitlementsRequest,
  ): Effect.Effect<
    GetEntitlementsResult,
    | InternalServiceErrorException
    | InvalidParameterException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetEntitlementsRequest,
  ) => Stream.Stream<
    GetEntitlementsResult,
    | InternalServiceErrorException
    | InvalidParameterException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetEntitlementsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServiceErrorException
    | InvalidParameterException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetEntitlementsRequest,
  output: GetEntitlementsResult,
  errors: [
    InternalServiceErrorException,
    InvalidParameterException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));

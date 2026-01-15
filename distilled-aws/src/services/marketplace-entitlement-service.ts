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
  sdkId: "Marketplace Entitlement Service",
  serviceShapeName: "AWSMPEntitlementService",
});
const auth = T.AwsAuthSigv4({ name: "aws-marketplace" });
const ver = T.ServiceVersion("2017-01-11");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://entitlement-marketplace.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://entitlement-marketplace.${Region}.amazonaws.com.cn`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://entitlement-marketplace.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(`https://entitlement-marketplace.${Region}.amazonaws.eu`);
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://entitlement.marketplace-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://entitlement.marketplace-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://entitlement.marketplace.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://entitlement.marketplace.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ProductCode = string;
export type NonEmptyString = string;
export type PageSizeInteger = number;
export type FilterValue = string;
export type ErrorMessage = string;

//# Schemas
export type GetEntitlementFilterName =
  | "CUSTOMER_IDENTIFIER"
  | "DIMENSION"
  | "CUSTOMER_AWS_ACCOUNT_ID"
  | (string & {});
export const GetEntitlementFilterName = S.String;
export type FilterValueList = string[];
export const FilterValueList = S.Array(S.String);
export type GetEntitlementFilters = {
  [key in GetEntitlementFilterName]?: string[];
};
export const GetEntitlementFilters = S.partial(
  S.Record({
    key: GetEntitlementFilterName,
    value: S.UndefinedOr(FilterValueList),
  }),
);
export interface GetEntitlementsRequest {
  ProductCode: string;
  Filter?: { [key: string]: string[] | undefined };
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
  Entitlements?: Entitlement[];
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
  ): effect.Effect<
    GetEntitlementsResult,
    | InternalServiceErrorException
    | InvalidParameterException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetEntitlementsRequest,
  ) => stream.Stream<
    GetEntitlementsResult,
    | InternalServiceErrorException
    | InvalidParameterException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetEntitlementsRequest,
  ) => stream.Stream<
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

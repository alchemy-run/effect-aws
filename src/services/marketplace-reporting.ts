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
  sdkId: "Marketplace Reporting",
  serviceShapeName: "AWSMarketplaceReporting",
});
const auth = T.AwsAuthSigv4({ name: "aws-marketplace" });
const ver = T.ServiceVersion("2018-05-10");
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
              `https://reporting-marketplace-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://reporting-marketplace-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://reporting-marketplace.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://reporting-marketplace.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DashboardIdentifier = string;
export type EmbeddingDomain = string;

//# Schemas
export type EmbeddingDomains = string[];
export const EmbeddingDomains = S.Array(S.String);
export interface GetBuyerDashboardInput {
  dashboardIdentifier: string;
  embeddingDomains: EmbeddingDomains;
}
export const GetBuyerDashboardInput = S.suspend(() =>
  S.Struct({
    dashboardIdentifier: S.String,
    embeddingDomains: EmbeddingDomains,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/getBuyerDashboard" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBuyerDashboardInput",
}) as any as S.Schema<GetBuyerDashboardInput>;
export interface GetBuyerDashboardOutput {
  embedUrl: string;
  dashboardIdentifier: string;
  embeddingDomains: EmbeddingDomains;
}
export const GetBuyerDashboardOutput = S.suspend(() =>
  S.Struct({
    embedUrl: S.String,
    dashboardIdentifier: S.String,
    embeddingDomains: EmbeddingDomains,
  }),
).annotations({
  identifier: "GetBuyerDashboardOutput",
}) as any as S.Schema<GetBuyerDashboardOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Generates an embedding URL for an Amazon QuickSight dashboard for an anonymous user.
 *
 * This API is available only to Amazon Web Services Organization management accounts or
 * delegated administrators registered for the procurement insights
 * (`procurement-insights.marketplace.amazonaws.com`) feature.
 *
 * The following rules apply to a generated URL:
 *
 * - It contains a temporary bearer token, valid for 5 minutes after it is generated. Once redeemed within that period, it cannot be re-used again.
 *
 * - It has a session lifetime of one hour. The 5-minute validity period runs separately from the session lifetime.
 */
export const getBuyerDashboard: (
  input: GetBuyerDashboardInput,
) => Effect.Effect<
  GetBuyerDashboardOutput,
  | AccessDeniedException
  | BadRequestException
  | InternalServerException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBuyerDashboardInput,
  output: GetBuyerDashboardOutput,
  errors: [
    AccessDeniedException,
    BadRequestException,
    InternalServerException,
    UnauthorizedException,
  ],
}));

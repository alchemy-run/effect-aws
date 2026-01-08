import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials as Creds } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "EKS Auth",
  serviceShapeName: "EKSAuthFrontend",
});
const auth = T.AwsAuthSigv4({ name: "eks-auth" });
const ver = T.ServiceVersion("2023-11-26");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseFIPS = false, Endpoint } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
          if (UseFIPS === true) {
            if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
              return e(
                `https://eks-auth-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              );
            }
            return err(
              "FIPS is enabled but this partition does not support FIPS",
            );
          }
          return e(
            `https://eks-auth.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://eks-auth-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        return e(
          `https://eks-auth.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClusterName = string;
export type JwtToken = string | Redacted.Redacted<string>;

//# Schemas
export interface AssumeRoleForPodIdentityRequest {
  clusterName: string;
  token: string | Redacted.Redacted<string>;
}
export const AssumeRoleForPodIdentityRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String.pipe(T.HttpLabel("clusterName")),
    token: SensitiveString,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/clusters/{clusterName}/assume-role-for-pod-identity",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssumeRoleForPodIdentityRequest",
}) as any as S.Schema<AssumeRoleForPodIdentityRequest>;
export interface Subject {
  namespace: string;
  serviceAccount: string;
}
export const Subject = S.suspend(() =>
  S.Struct({ namespace: S.String, serviceAccount: S.String }),
).annotations({ identifier: "Subject" }) as any as S.Schema<Subject>;
export interface PodIdentityAssociation {
  associationArn: string;
  associationId: string;
}
export const PodIdentityAssociation = S.suspend(() =>
  S.Struct({ associationArn: S.String, associationId: S.String }),
).annotations({
  identifier: "PodIdentityAssociation",
}) as any as S.Schema<PodIdentityAssociation>;
export interface AssumedRoleUser {
  arn: string;
  assumeRoleId: string;
}
export const AssumedRoleUser = S.suspend(() =>
  S.Struct({ arn: S.String, assumeRoleId: S.String }),
).annotations({
  identifier: "AssumedRoleUser",
}) as any as S.Schema<AssumedRoleUser>;
export interface Credentials {
  sessionToken: string;
  secretAccessKey: string;
  accessKeyId: string;
  expiration: Date;
}
export const Credentials = S.suspend(() =>
  S.Struct({
    sessionToken: S.String,
    secretAccessKey: S.String,
    accessKeyId: S.String,
    expiration: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "Credentials" }) as any as S.Schema<Credentials>;
export interface AssumeRoleForPodIdentityResponse {
  subject: Subject;
  audience: string;
  podIdentityAssociation: PodIdentityAssociation;
  assumedRoleUser: AssumedRoleUser;
  credentials: Credentials;
}
export const AssumeRoleForPodIdentityResponse = S.suspend(() =>
  S.Struct({
    subject: Subject,
    audience: S.String,
    podIdentityAssociation: PodIdentityAssociation,
    assumedRoleUser: AssumedRoleUser,
    credentials: Credentials,
  }),
).annotations({
  identifier: "AssumeRoleForPodIdentityResponse",
}) as any as S.Schema<AssumeRoleForPodIdentityResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ExpiredTokenException extends S.TaggedError<ExpiredTokenException>()(
  "ExpiredTokenException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidTokenException extends S.TaggedError<InvalidTokenException>()(
  "InvalidTokenException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * The Amazon EKS Auth API and the `AssumeRoleForPodIdentity` action are only used
 * by the EKS Pod Identity Agent.
 *
 * We recommend that applications use the Amazon Web Services SDKs to connect to Amazon Web Services services; if
 * credentials from an EKS Pod Identity association are available in the pod, the latest versions of the
 * SDKs use them automatically.
 */
export const assumeRoleForPodIdentity: (
  input: AssumeRoleForPodIdentityRequest,
) => Effect.Effect<
  AssumeRoleForPodIdentityResponse,
  | AccessDeniedException
  | ExpiredTokenException
  | InternalServerException
  | InvalidParameterException
  | InvalidRequestException
  | InvalidTokenException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Creds | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssumeRoleForPodIdentityRequest,
  output: AssumeRoleForPodIdentityResponse,
  errors: [
    AccessDeniedException,
    ExpiredTokenException,
    InternalServerException,
    InvalidParameterException,
    InvalidRequestException,
    InvalidTokenException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));

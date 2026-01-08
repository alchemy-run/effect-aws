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
  sdkId: "Pca Connector Scep",
  serviceShapeName: "PcaConnectorScep",
});
const auth = T.AwsAuthSigv4({ name: "pca-connector-scep" });
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
              `https://pca-connector-scep-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://pca-connector-scep-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://pca-connector-scep.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://pca-connector-scep.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ConnectorArn = string;
export type ClientToken = string;
export type ChallengeArn = string;
export type MaxResults = number;
export type NextToken = string;
export type CertificateAuthorityArn = string;
export type SensitiveString = string | Redacted.Redacted<string>;
export type AzureApplicationId = string;
export type AzureDomain = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface CreateChallengeRequest {
  ConnectorArn: string;
  ClientToken?: string;
  Tags?: Tags;
}
export const CreateChallengeRequest = S.suspend(() =>
  S.Struct({
    ConnectorArn: S.String,
    ClientToken: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/challenges" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateChallengeRequest",
}) as any as S.Schema<CreateChallengeRequest>;
export interface GetChallengeMetadataRequest {
  ChallengeArn: string;
}
export const GetChallengeMetadataRequest = S.suspend(() =>
  S.Struct({ ChallengeArn: S.String.pipe(T.HttpLabel("ChallengeArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/challengeMetadata/{ChallengeArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChallengeMetadataRequest",
}) as any as S.Schema<GetChallengeMetadataRequest>;
export interface DeleteChallengeRequest {
  ChallengeArn: string;
}
export const DeleteChallengeRequest = S.suspend(() =>
  S.Struct({ ChallengeArn: S.String.pipe(T.HttpLabel("ChallengeArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/challenges/{ChallengeArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteChallengeRequest",
}) as any as S.Schema<DeleteChallengeRequest>;
export interface DeleteChallengeResponse {}
export const DeleteChallengeResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteChallengeResponse",
}) as any as S.Schema<DeleteChallengeResponse>;
export interface ListChallengeMetadataRequest {
  MaxResults?: number;
  NextToken?: string;
  ConnectorArn: string;
}
export const ListChallengeMetadataRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    ConnectorArn: S.String.pipe(T.HttpQuery("ConnectorArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/challengeMetadata" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChallengeMetadataRequest",
}) as any as S.Schema<ListChallengeMetadataRequest>;
export interface GetChallengePasswordRequest {
  ChallengeArn: string;
}
export const GetChallengePasswordRequest = S.suspend(() =>
  S.Struct({ ChallengeArn: S.String.pipe(T.HttpLabel("ChallengeArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/challengePasswords/{ChallengeArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetChallengePasswordRequest",
}) as any as S.Schema<GetChallengePasswordRequest>;
export interface GetConnectorRequest {
  ConnectorArn: string;
}
export const GetConnectorRequest = S.suspend(() =>
  S.Struct({ ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/connectors/{ConnectorArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConnectorRequest",
}) as any as S.Schema<GetConnectorRequest>;
export interface DeleteConnectorRequest {
  ConnectorArn: string;
}
export const DeleteConnectorRequest = S.suspend(() =>
  S.Struct({ ConnectorArn: S.String.pipe(T.HttpLabel("ConnectorArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/connectors/{ConnectorArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectorRequest",
}) as any as S.Schema<DeleteConnectorRequest>;
export interface DeleteConnectorResponse {}
export const DeleteConnectorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConnectorResponse",
}) as any as S.Schema<DeleteConnectorResponse>;
export interface ListConnectorsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListConnectorsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectorsRequest",
}) as any as S.Schema<ListConnectorsRequest>;
export interface ListTagsForResourceResponse {
  Tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface GetChallengePasswordResponse {
  Password?: string | Redacted.Redacted<string>;
}
export const GetChallengePasswordResponse = S.suspend(() =>
  S.Struct({ Password: S.optional(SensitiveString) }),
).annotations({
  identifier: "GetChallengePasswordResponse",
}) as any as S.Schema<GetChallengePasswordResponse>;
export interface IntuneConfiguration {
  AzureApplicationId: string;
  Domain: string;
}
export const IntuneConfiguration = S.suspend(() =>
  S.Struct({ AzureApplicationId: S.String, Domain: S.String }),
).annotations({
  identifier: "IntuneConfiguration",
}) as any as S.Schema<IntuneConfiguration>;
export interface Challenge {
  Arn?: string;
  ConnectorArn?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Password?: string | Redacted.Redacted<string>;
}
export const Challenge = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ConnectorArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Password: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Challenge" }) as any as S.Schema<Challenge>;
export interface ChallengeMetadata {
  Arn?: string;
  ConnectorArn?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const ChallengeMetadata = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ConnectorArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ChallengeMetadata",
}) as any as S.Schema<ChallengeMetadata>;
export interface ChallengeMetadataSummary {
  Arn?: string;
  ConnectorArn?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const ChallengeMetadataSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ConnectorArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ChallengeMetadataSummary",
}) as any as S.Schema<ChallengeMetadataSummary>;
export type ChallengeMetadataList = ChallengeMetadataSummary[];
export const ChallengeMetadataList = S.Array(ChallengeMetadataSummary);
export type MobileDeviceManagement = { Intune: IntuneConfiguration };
export const MobileDeviceManagement = S.Union(
  S.Struct({ Intune: IntuneConfiguration }),
);
export interface OpenIdConfiguration {
  Issuer?: string;
  Subject?: string;
  Audience?: string;
}
export const OpenIdConfiguration = S.suspend(() =>
  S.Struct({
    Issuer: S.optional(S.String),
    Subject: S.optional(S.String),
    Audience: S.optional(S.String),
  }),
).annotations({
  identifier: "OpenIdConfiguration",
}) as any as S.Schema<OpenIdConfiguration>;
export interface ConnectorSummary {
  Arn?: string;
  CertificateAuthorityArn?: string;
  Type?: string;
  MobileDeviceManagement?: (typeof MobileDeviceManagement)["Type"];
  OpenIdConfiguration?: OpenIdConfiguration;
  Status?: string;
  StatusReason?: string;
  Endpoint?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const ConnectorSummary = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CertificateAuthorityArn: S.optional(S.String),
    Type: S.optional(S.String),
    MobileDeviceManagement: S.optional(MobileDeviceManagement),
    OpenIdConfiguration: S.optional(OpenIdConfiguration),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    Endpoint: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ConnectorSummary",
}) as any as S.Schema<ConnectorSummary>;
export type ConnectorList = ConnectorSummary[];
export const ConnectorList = S.Array(ConnectorSummary);
export interface CreateChallengeResponse {
  Challenge?: Challenge;
}
export const CreateChallengeResponse = S.suspend(() =>
  S.Struct({ Challenge: S.optional(Challenge) }),
).annotations({
  identifier: "CreateChallengeResponse",
}) as any as S.Schema<CreateChallengeResponse>;
export interface GetChallengeMetadataResponse {
  ChallengeMetadata?: ChallengeMetadata;
}
export const GetChallengeMetadataResponse = S.suspend(() =>
  S.Struct({ ChallengeMetadata: S.optional(ChallengeMetadata) }),
).annotations({
  identifier: "GetChallengeMetadataResponse",
}) as any as S.Schema<GetChallengeMetadataResponse>;
export interface ListChallengeMetadataResponse {
  Challenges?: ChallengeMetadataList;
  NextToken?: string;
}
export const ListChallengeMetadataResponse = S.suspend(() =>
  S.Struct({
    Challenges: S.optional(ChallengeMetadataList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListChallengeMetadataResponse",
}) as any as S.Schema<ListChallengeMetadataResponse>;
export interface CreateConnectorRequest {
  CertificateAuthorityArn: string;
  MobileDeviceManagement?: (typeof MobileDeviceManagement)["Type"];
  ClientToken?: string;
  Tags?: Tags;
}
export const CreateConnectorRequest = S.suspend(() =>
  S.Struct({
    CertificateAuthorityArn: S.String,
    MobileDeviceManagement: S.optional(MobileDeviceManagement),
    ClientToken: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/connectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectorRequest",
}) as any as S.Schema<CreateConnectorRequest>;
export interface ListConnectorsResponse {
  Connectors?: ConnectorList;
  NextToken?: string;
}
export const ListConnectorsResponse = S.suspend(() =>
  S.Struct({
    Connectors: S.optional(ConnectorList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectorsResponse",
}) as any as S.Schema<ListConnectorsResponse>;
export interface Connector {
  Arn?: string;
  CertificateAuthorityArn?: string;
  Type?: string;
  MobileDeviceManagement?: (typeof MobileDeviceManagement)["Type"];
  OpenIdConfiguration?: OpenIdConfiguration;
  Status?: string;
  StatusReason?: string;
  Endpoint?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const Connector = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CertificateAuthorityArn: S.optional(S.String),
    Type: S.optional(S.String),
    MobileDeviceManagement: S.optional(MobileDeviceManagement),
    OpenIdConfiguration: S.optional(OpenIdConfiguration),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    Endpoint: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Connector" }) as any as S.Schema<Connector>;
export interface CreateConnectorResponse {
  ConnectorArn?: string;
}
export const CreateConnectorResponse = S.suspend(() =>
  S.Struct({ ConnectorArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateConnectorResponse",
}) as any as S.Schema<CreateConnectorResponse>;
export interface GetConnectorResponse {
  Connector?: Connector;
}
export const GetConnectorResponse = S.suspend(() =>
  S.Struct({ Connector: S.optional(Connector) }),
).annotations({
  identifier: "GetConnectorResponse",
}) as any as S.Schema<GetConnectorResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withBadRequestError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceType: S.String,
    ServiceCode: S.String,
    QuotaCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String, Reason: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists the connectors belonging to your Amazon Web Services account.
 */
export const listConnectors: {
  (
    input: ListConnectorsRequest,
  ): Effect.Effect<
    ListConnectorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectorsRequest,
  ) => Stream.Stream<
    ListConnectorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectorsRequest,
  ) => Stream.Stream<
    ConnectorSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectorsRequest,
  output: ListConnectorsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Connectors",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a SCEP connector. A SCEP connector links Amazon Web Services Private Certificate Authority to your SCEP-compatible devices and mobile device management (MDM) systems. Before you create a connector, you must complete a set of prerequisites, including creation of a private certificate authority (CA) to use with this connector. For more information, see Connector for SCEP prerequisites.
 */
export const createConnector: (
  input: CreateConnectorRequest,
) => Effect.Effect<
  CreateConnectorResponse,
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
  input: CreateConnectorRequest,
  output: CreateConnectorResponse,
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
 * Retrieves the metadata for the specified Challenge.
 */
export const getChallengeMetadata: (
  input: GetChallengeMetadataRequest,
) => Effect.Effect<
  GetChallengeMetadataResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChallengeMetadataRequest,
  output: GetChallengeMetadataResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the challenge metadata for the specified ARN.
 */
export const listChallengeMetadata: {
  (
    input: ListChallengeMetadataRequest,
  ): Effect.Effect<
    ListChallengeMetadataResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChallengeMetadataRequest,
  ) => Stream.Stream<
    ListChallengeMetadataResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChallengeMetadataRequest,
  ) => Stream.Stream<
    ChallengeMetadataSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChallengeMetadataRequest,
  output: ListChallengeMetadataResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Challenges",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes the specified Challenge.
 */
export const deleteChallenge: (
  input: DeleteChallengeRequest,
) => Effect.Effect<
  DeleteChallengeResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChallengeRequest,
  output: DeleteChallengeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the challenge password for the specified Challenge.
 */
export const getChallengePassword: (
  input: GetChallengePasswordRequest,
) => Effect.Effect<
  GetChallengePasswordResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetChallengePasswordRequest,
  output: GetChallengePasswordResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the tags associated with the specified resource. Tags are key-value pairs that
 * you can use to categorize and manage your resources, for purposes like billing. For
 * example, you might set the tag key to "customer" and the value to the customer name or ID.
 * You can specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a
 * resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds one or more tags to your resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified Connector. This operation also deletes any challenges associated with the connector.
 */
export const deleteConnector: (
  input: DeleteConnectorRequest,
) => Effect.Effect<
  DeleteConnectorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectorRequest,
  output: DeleteConnectorResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from your resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about the specified Connector. Calling this action returns important details about the connector, such as the public SCEP URL where your clients can request certificates.
 */
export const getConnector: (
  input: GetConnectorRequest,
) => Effect.Effect<
  GetConnectorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectorRequest,
  output: GetConnectorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * For general-purpose connectors. Creates a *challenge password* for the specified connector. The SCEP protocol uses a challenge password to authenticate a request before issuing a certificate from a certificate authority (CA). Your SCEP clients include the challenge password as part of their certificate request to Connector for SCEP. To retrieve the connector Amazon Resource Names (ARNs) for the connectors in your account, call ListConnectors.
 *
 * To create additional challenge passwords for the connector, call `CreateChallenge` again. We recommend frequently rotating your challenge passwords.
 */
export const createChallenge: (
  input: CreateChallengeRequest,
) => Effect.Effect<
  CreateChallengeResponse,
  | AccessDeniedException
  | BadRequestException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChallengeRequest,
  output: CreateChallengeResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));

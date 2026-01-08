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
const ns = T.XmlNamespace(
  "https://object.mediastore.amazonaws.com/doc/2017-09-01",
);
const svc = T.AwsApiService({
  sdkId: "MediaStore Data",
  serviceShapeName: "MediaStoreObject_20170901",
});
const auth = T.AwsAuthSigv4({ name: "mediastore" });
const ver = T.ServiceVersion("2017-09-01");
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
              `https://data.mediastore-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://data.mediastore-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://data.mediastore.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://data.mediastore.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type PathNaming = string;
export type RangePattern = string;
export type ListPathNaming = string;
export type ListLimit = number;
export type PaginationToken = string;
export type ContentType = string;
export type StringPrimitive = string;
export type ErrorMessage = string;
export type ETag = string;
export type NonNegativeLong = number;
export type ContentRangePattern = string;
export type StatusCode = number;
export type SHA256Hash = string;
export type ItemName = string;

//# Schemas
export type StorageClass = "TEMPORAL";
export const StorageClass = S.Literal("TEMPORAL");
export type UploadAvailability = "STANDARD" | "STREAMING";
export const UploadAvailability = S.Literal("STANDARD", "STREAMING");
export interface DeleteObjectRequest {
  Path: string;
}
export const DeleteObjectRequest = S.suspend(() =>
  S.Struct({ Path: S.String.pipe(T.HttpLabel("Path")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/{Path+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteObjectRequest",
}) as any as S.Schema<DeleteObjectRequest>;
export interface DeleteObjectResponse {}
export const DeleteObjectResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteObjectResponse",
}) as any as S.Schema<DeleteObjectResponse>;
export interface DescribeObjectRequest {
  Path: string;
}
export const DescribeObjectRequest = S.suspend(() =>
  S.Struct({ Path: S.String.pipe(T.HttpLabel("Path")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "HEAD", uri: "/{Path+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeObjectRequest",
}) as any as S.Schema<DescribeObjectRequest>;
export interface GetObjectRequest {
  Path: string;
  Range?: string;
}
export const GetObjectRequest = S.suspend(() =>
  S.Struct({
    Path: S.String.pipe(T.HttpLabel("Path")),
    Range: S.optional(S.String).pipe(T.HttpHeader("Range")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/{Path+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetObjectRequest",
}) as any as S.Schema<GetObjectRequest>;
export interface ListItemsRequest {
  Path?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListItemsRequest = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String).pipe(T.HttpQuery("Path")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListItemsRequest",
}) as any as S.Schema<ListItemsRequest>;
export interface PutObjectRequest {
  Body: T.StreamingInputBody;
  Path: string;
  ContentType?: string;
  CacheControl?: string;
  StorageClass?: StorageClass;
  UploadAvailability?: UploadAvailability;
}
export const PutObjectRequest = S.suspend(() =>
  S.Struct({
    Body: T.StreamingInput.pipe(T.HttpPayload()),
    Path: S.String.pipe(T.HttpLabel("Path")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    StorageClass: S.optional(StorageClass).pipe(
      T.HttpHeader("x-amz-storage-class"),
    ),
    UploadAvailability: S.optional(UploadAvailability).pipe(
      T.HttpHeader("x-amz-upload-availability"),
    ),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/{Path+}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutObjectRequest",
}) as any as S.Schema<PutObjectRequest>;
export interface DescribeObjectResponse {
  ETag?: string;
  ContentType?: string;
  ContentLength?: number;
  CacheControl?: string;
  LastModified?: Date;
}
export const DescribeObjectResponse = S.suspend(() =>
  S.Struct({
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("Last-Modified"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "DescribeObjectResponse",
}) as any as S.Schema<DescribeObjectResponse>;
export interface GetObjectResponse {
  Body?: T.StreamingOutputBody;
  CacheControl?: string;
  ContentRange?: string;
  ContentLength?: number;
  ContentType?: string;
  ETag?: string;
  LastModified?: Date;
  StatusCode: number;
}
export const GetObjectResponse = S.suspend(() =>
  S.Struct({
    Body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ContentRange: S.optional(S.String).pipe(T.HttpHeader("Content-Range")),
    ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
      T.HttpHeader("Last-Modified"),
    ),
    StatusCode: S.Number.pipe(T.HttpResponseCode()),
  }).pipe(ns),
).annotations({
  identifier: "GetObjectResponse",
}) as any as S.Schema<GetObjectResponse>;
export interface PutObjectResponse {
  ContentSHA256?: string;
  ETag?: string;
  StorageClass?: StorageClass;
}
export const PutObjectResponse = S.suspend(() =>
  S.Struct({
    ContentSHA256: S.optional(S.String),
    ETag: S.optional(S.String),
    StorageClass: S.optional(StorageClass),
  }).pipe(ns),
).annotations({
  identifier: "PutObjectResponse",
}) as any as S.Schema<PutObjectResponse>;
export type ItemType = "OBJECT" | "FOLDER";
export const ItemType = S.Literal("OBJECT", "FOLDER");
export interface Item {
  Name?: string;
  Type?: ItemType;
  ETag?: string;
  LastModified?: Date;
  ContentType?: string;
  ContentLength?: number;
}
export const Item = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(ItemType),
    ETag: S.optional(S.String),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ContentType: S.optional(S.String),
    ContentLength: S.optional(S.Number),
  }),
).annotations({ identifier: "Item" }) as any as S.Schema<Item>;
export type ItemList = Item[];
export const ItemList = S.Array(Item);
export interface ListItemsResponse {
  Items?: Item[];
  NextToken?: string;
}
export const ListItemsResponse = S.suspend(() =>
  S.Struct({
    Items: S.optional(ItemList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListItemsResponse",
}) as any as S.Schema<ListItemsResponse>;

//# Errors
export class ContainerNotFoundException extends S.TaggedError<ContainerNotFoundException>()(
  "ContainerNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { Message: S.optional(S.String) },
) {}
export class ObjectNotFoundException extends S.TaggedError<ObjectNotFoundException>()(
  "ObjectNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RequestedRangeNotSatisfiableException extends S.TaggedError<RequestedRangeNotSatisfiableException>()(
  "RequestedRangeNotSatisfiableException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Provides a list of metadata entries about folders and objects in the specified
 * folder.
 */
export const listItems: {
  (
    input: ListItemsRequest,
  ): effect.Effect<
    ListItemsResponse,
    ContainerNotFoundException | InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListItemsRequest,
  ) => stream.Stream<
    ListItemsResponse,
    ContainerNotFoundException | InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListItemsRequest,
  ) => stream.Stream<
    unknown,
    ContainerNotFoundException | InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListItemsRequest,
  output: ListItemsResponse,
  errors: [ContainerNotFoundException, InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Uploads an object to the specified path. Object sizes are limited to 25 MB for standard upload availability and 10 MB for streaming upload availability.
 */
export const putObject: (
  input: PutObjectRequest,
) => effect.Effect<
  PutObjectResponse,
  ContainerNotFoundException | InternalServerError | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutObjectRequest,
  output: PutObjectResponse,
  errors: [ContainerNotFoundException, InternalServerError],
}));
/**
 * Deletes an object at the specified path.
 */
export const deleteObject: (
  input: DeleteObjectRequest,
) => effect.Effect<
  DeleteObjectResponse,
  | ContainerNotFoundException
  | InternalServerError
  | ObjectNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteObjectRequest,
  output: DeleteObjectResponse,
  errors: [
    ContainerNotFoundException,
    InternalServerError,
    ObjectNotFoundException,
  ],
}));
/**
 * Gets the headers for an object at the specified path.
 */
export const describeObject: (
  input: DescribeObjectRequest,
) => effect.Effect<
  DescribeObjectResponse,
  | ContainerNotFoundException
  | InternalServerError
  | ObjectNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeObjectRequest,
  output: DescribeObjectResponse,
  errors: [
    ContainerNotFoundException,
    InternalServerError,
    ObjectNotFoundException,
  ],
}));
/**
 * Downloads the object at the specified path. If the object’s upload availability is set to `streaming`, AWS Elemental MediaStore downloads the object even if it’s still uploading the object.
 */
export const getObject: (
  input: GetObjectRequest,
) => effect.Effect<
  GetObjectResponse,
  | ContainerNotFoundException
  | InternalServerError
  | ObjectNotFoundException
  | RequestedRangeNotSatisfiableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetObjectRequest,
  output: GetObjectResponse,
  errors: [
    ContainerNotFoundException,
    InternalServerError,
    ObjectNotFoundException,
    RequestedRangeNotSatisfiableException,
  ],
}));

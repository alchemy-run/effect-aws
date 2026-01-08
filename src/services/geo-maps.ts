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
  sdkId: "Geo Maps",
  serviceShapeName: "MapsService",
});
const auth = T.AwsAuthSigv4({ name: "geo-maps" });
const ver = T.ServiceVersion("2020-11-19");
const proto = T.AwsProtocolsRestJson1();
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
          UseDualStack === false
        ) {
          return e(
            `https://maps.geo.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://maps.geo-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://maps.geo-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://maps.geo.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            `https://maps.geo.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://maps.geo-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === false
        ) {
          return e(
            `https://maps.geo-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}/v2`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://maps.geo.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}/v2`,
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://geo-maps-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://geo-maps-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://geo-maps.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://geo-maps.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type MapStyle = string;
export type ColorScheme = string;
export type Variant = string;
export type PositionListString = string | Redacted.Redacted<string>;
export type PositionString = string | Redacted.Redacted<string>;
export type CompactOverlay = string | Redacted.Redacted<string>;
export type GeoJsonOverlay = string | Redacted.Redacted<string>;
export type SensitiveInteger = number;
export type ApiKey = string | Redacted.Redacted<string>;
export type LabelSize = string;
export type LanguageTag = string;
export type CountryCode = string | Redacted.Redacted<string>;
export type MapFeatureMode = string;
export type DistanceMeters = number;
export type ScaleBarUnit = string;
export type StaticMapStyle = string;
export type SensitiveFloat = number;
export type Terrain = string;
export type ContourDensity = string;
export type Traffic = string;
export type TravelMode = string;
export type TileAdditionalFeature = string;
export type Tileset = string;
export type SensitiveString = string | Redacted.Redacted<string>;
export type ValidationExceptionReason = string;

//# Schemas
export type TravelModeList = string[];
export const TravelModeList = S.Array(S.String);
export type TileAdditionalFeatureList = string[];
export const TileAdditionalFeatureList = S.Array(S.String);
export interface GetGlyphsRequest {
  FontStack: string;
  FontUnicodeRange: string;
}
export const GetGlyphsRequest = S.suspend(() =>
  S.Struct({
    FontStack: S.String.pipe(T.HttpLabel("FontStack")),
    FontUnicodeRange: S.String.pipe(T.HttpLabel("FontUnicodeRange")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/glyphs/{FontStack}/{FontUnicodeRange}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGlyphsRequest",
}) as any as S.Schema<GetGlyphsRequest>;
export interface GetSpritesRequest {
  FileName: string;
  Style: string;
  ColorScheme: string;
  Variant: string;
}
export const GetSpritesRequest = S.suspend(() =>
  S.Struct({
    FileName: S.String.pipe(T.HttpLabel("FileName")),
    Style: S.String.pipe(T.HttpLabel("Style")),
    ColorScheme: S.String.pipe(T.HttpLabel("ColorScheme")),
    Variant: S.String.pipe(T.HttpLabel("Variant")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/styles/{Style}/{ColorScheme}/{Variant}/sprites/{FileName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSpritesRequest",
}) as any as S.Schema<GetSpritesRequest>;
export interface GetStaticMapRequest {
  BoundingBox?: string | Redacted.Redacted<string>;
  BoundedPositions?: string | Redacted.Redacted<string>;
  Center?: string | Redacted.Redacted<string>;
  ColorScheme?: string;
  CompactOverlay?: string | Redacted.Redacted<string>;
  CropLabels?: boolean;
  GeoJsonOverlay?: string | Redacted.Redacted<string>;
  Height: number;
  Key?: string | Redacted.Redacted<string>;
  LabelSize?: string;
  Language?: string;
  Padding?: number;
  PoliticalView?: string | Redacted.Redacted<string>;
  PointsOfInterests?: string;
  Radius?: number;
  FileName: string;
  ScaleBarUnit?: string;
  Style?: string;
  Width: number;
  Zoom?: number;
}
export const GetStaticMapRequest = S.suspend(() =>
  S.Struct({
    BoundingBox: S.optional(SensitiveString).pipe(T.HttpQuery("bounding-box")),
    BoundedPositions: S.optional(SensitiveString).pipe(
      T.HttpQuery("bounded-positions"),
    ),
    Center: S.optional(SensitiveString).pipe(T.HttpQuery("center")),
    ColorScheme: S.optional(S.String).pipe(T.HttpQuery("color-scheme")),
    CompactOverlay: S.optional(SensitiveString).pipe(
      T.HttpQuery("compact-overlay"),
    ),
    CropLabels: S.optional(S.Boolean).pipe(T.HttpQuery("crop-labels")),
    GeoJsonOverlay: S.optional(SensitiveString).pipe(
      T.HttpQuery("geojson-overlay"),
    ),
    Height: S.Number.pipe(T.HttpQuery("height")),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
    LabelSize: S.optional(S.String).pipe(T.HttpQuery("label-size")),
    Language: S.optional(S.String).pipe(T.HttpQuery("lang")),
    Padding: S.optional(S.Number).pipe(T.HttpQuery("padding")),
    PoliticalView: S.optional(SensitiveString).pipe(
      T.HttpQuery("political-view"),
    ),
    PointsOfInterests: S.optional(S.String).pipe(T.HttpQuery("pois")),
    Radius: S.optional(S.Number).pipe(T.HttpQuery("radius")),
    FileName: S.String.pipe(T.HttpLabel("FileName")),
    ScaleBarUnit: S.optional(S.String).pipe(T.HttpQuery("scale-unit")),
    Style: S.optional(S.String).pipe(T.HttpQuery("style")),
    Width: S.Number.pipe(T.HttpQuery("width")),
    Zoom: S.optional(S.Number).pipe(T.HttpQuery("zoom")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/static/{FileName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStaticMapRequest",
}) as any as S.Schema<GetStaticMapRequest>;
export interface GetStyleDescriptorRequest {
  Style: string;
  ColorScheme?: string;
  PoliticalView?: string | Redacted.Redacted<string>;
  Terrain?: string;
  ContourDensity?: string;
  Traffic?: string;
  TravelModes?: TravelModeList;
  Key?: string | Redacted.Redacted<string>;
}
export const GetStyleDescriptorRequest = S.suspend(() =>
  S.Struct({
    Style: S.String.pipe(T.HttpLabel("Style")),
    ColorScheme: S.optional(S.String).pipe(T.HttpQuery("color-scheme")),
    PoliticalView: S.optional(SensitiveString).pipe(
      T.HttpQuery("political-view"),
    ),
    Terrain: S.optional(S.String).pipe(T.HttpQuery("terrain")),
    ContourDensity: S.optional(S.String).pipe(T.HttpQuery("contour-density")),
    Traffic: S.optional(S.String).pipe(T.HttpQuery("traffic")),
    TravelModes: S.optional(TravelModeList).pipe(T.HttpQuery("travel-modes")),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/styles/{Style}/descriptor" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetStyleDescriptorRequest",
}) as any as S.Schema<GetStyleDescriptorRequest>;
export interface GetTileRequest {
  AdditionalFeatures?: TileAdditionalFeatureList;
  Tileset: string;
  Z: string | Redacted.Redacted<string>;
  X: string | Redacted.Redacted<string>;
  Y: string | Redacted.Redacted<string>;
  Key?: string | Redacted.Redacted<string>;
}
export const GetTileRequest = S.suspend(() =>
  S.Struct({
    AdditionalFeatures: S.optional(TileAdditionalFeatureList).pipe(
      T.HttpQuery("additional-features"),
    ),
    Tileset: S.String.pipe(T.HttpLabel("Tileset")),
    Z: SensitiveString.pipe(T.HttpLabel("Z")),
    X: SensitiveString.pipe(T.HttpLabel("X")),
    Y: SensitiveString.pipe(T.HttpLabel("Y")),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tiles/{Tileset}/{Z}/{X}/{Y}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTileRequest",
}) as any as S.Schema<GetTileRequest>;
export interface GetGlyphsResponse {
  Blob?: Uint8Array;
  ContentType?: string;
  CacheControl?: string;
  ETag?: string;
}
export const GetGlyphsResponse = S.suspend(() =>
  S.Struct({
    Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }),
).annotations({
  identifier: "GetGlyphsResponse",
}) as any as S.Schema<GetGlyphsResponse>;
export interface GetSpritesResponse {
  Blob?: Uint8Array;
  ContentType?: string;
  CacheControl?: string;
  ETag?: string;
}
export const GetSpritesResponse = S.suspend(() =>
  S.Struct({
    Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }),
).annotations({
  identifier: "GetSpritesResponse",
}) as any as S.Schema<GetSpritesResponse>;
export interface GetStaticMapResponse {
  Blob?: Uint8Array;
  ContentType?: string;
  CacheControl?: string;
  ETag?: string;
  PricingBucket: string;
}
export const GetStaticMapResponse = S.suspend(() =>
  S.Struct({
    Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
  }),
).annotations({
  identifier: "GetStaticMapResponse",
}) as any as S.Schema<GetStaticMapResponse>;
export interface GetStyleDescriptorResponse {
  Blob?: Uint8Array;
  ContentType?: string;
  CacheControl?: string;
  ETag?: string;
}
export const GetStyleDescriptorResponse = S.suspend(() =>
  S.Struct({
    Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  }),
).annotations({
  identifier: "GetStyleDescriptorResponse",
}) as any as S.Schema<GetStyleDescriptorResponse>;
export interface GetTileResponse {
  Blob?: Uint8Array;
  ContentType?: string;
  CacheControl?: string;
  ETag?: string;
  PricingBucket: string;
}
export const GetTileResponse = S.suspend(() =>
  S.Struct({
    Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
  }),
).annotations({
  identifier: "GetTileResponse",
}) as any as S.Schema<GetTileResponse>;
export interface ValidationExceptionField {
  Name: string;
  Message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.JsonName("name")),
    Message: S.String.pipe(T.JsonName("message")),
  }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String.pipe(T.JsonName("message")) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String.pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String.pipe(T.JsonName("message")),
    Reason: S.String.pipe(T.JsonName("reason")),
    FieldList: ValidationExceptionFieldList.pipe(T.JsonName("fieldList")),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * `GetGlyphs` returns the map's glyphs.
 *
 * For more information, see Style labels with glyphs in the *Amazon Location Service Developer Guide*.
 */
export const getGlyphs: (
  input: GetGlyphsRequest,
) => Effect.Effect<
  GetGlyphsResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGlyphsRequest,
  output: GetGlyphsResponse,
  errors: [],
}));
/**
 * `GetSprites` returns the map's sprites.
 *
 * For more information, see Style iconography with sprites in the *Amazon Location Service Developer Guide*.
 */
export const getSprites: (
  input: GetSpritesRequest,
) => Effect.Effect<
  GetSpritesResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSpritesRequest,
  output: GetSpritesResponse,
  errors: [],
}));
/**
 * `GetStyleDescriptor` returns information about the style.
 *
 * For more information, see Style dynamic maps in the *Amazon Location Service Developer Guide*.
 */
export const getStyleDescriptor: (
  input: GetStyleDescriptorRequest,
) => Effect.Effect<
  GetStyleDescriptorResponse,
  CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStyleDescriptorRequest,
  output: GetStyleDescriptorResponse,
  errors: [],
}));
/**
 * `GetStaticMap` provides high-quality static map images with customizable options. You can modify the map's appearance and overlay additional information. It's an ideal solution for applications requiring tailored static map snapshots.
 *
 * For more information, see the following topics in the *Amazon Location Service Developer Guide*:
 *
 * - Static maps
 *
 * - Customize static maps
 *
 * - Overlay on the static map
 */
export const getStaticMap: (
  input: GetStaticMapRequest,
) => Effect.Effect<
  GetStaticMapResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStaticMapRequest,
  output: GetStaticMapResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * `GetTile` returns a tile. Map tiles are used by clients to render a map. they're addressed using a grid arrangement with an X coordinate, Y coordinate, and Z (zoom) level.
 *
 * For more information, see Tiles in the *Amazon Location Service Developer Guide*.
 */
export const getTile: (
  input: GetTileRequest,
) => Effect.Effect<
  GetTileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTileRequest,
  output: GetTileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

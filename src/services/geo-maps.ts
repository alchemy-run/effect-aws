import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Geo Maps",
  serviceShapeName: "MapsService",
});
const auth = T.AwsAuthSigv4({ name: "geo-maps" });
const ver = T.ServiceVersion("2020-11-19");
const proto = T.AwsProtocolsRestJson1();
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
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://maps.geo.{Region}.{PartitionResult#dnsSuffix}/v2",
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
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://maps.geo-fips.{Region}.{PartitionResult#dualStackDnsSuffix}/v2",
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
                        "aws",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://maps.geo-fips.{Region}.{PartitionResult#dnsSuffix}/v2",
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
                    url: "https://maps.geo.{Region}.{PartitionResult#dualStackDnsSuffix}/v2",
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
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://maps.geo.{Region}.{PartitionResult#dnsSuffix}/v2",
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
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://maps.geo-fips.{Region}.{PartitionResult#dualStackDnsSuffix}/v2",
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
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  endpoint: {
                    url: "https://maps.geo-fips.{Region}.{PartitionResult#dnsSuffix}/v2",
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
                        "aws-us-gov",
                      ],
                    },
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
                  ],
                  endpoint: {
                    url: "https://maps.geo.{Region}.{PartitionResult#dualStackDnsSuffix}/v2",
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
                            url: "https://geo-maps-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                            url: "https://geo-maps-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                            url: "https://geo-maps.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                    url: "https://geo-maps.{Region}.{PartitionResult#dnsSuffix}",
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

//# Schemas
export const TravelModeList = S.Array(S.String);
export const TileAdditionalFeatureList = S.Array(S.String);
export class GetGlyphsRequest extends S.Class<GetGlyphsRequest>(
  "GetGlyphsRequest",
)(
  {
    FontStack: S.String.pipe(T.HttpLabel("FontStack")),
    FontUnicodeRange: S.String.pipe(T.HttpLabel("FontUnicodeRange")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/glyphs/{FontStack}/{FontUnicodeRange}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSpritesRequest extends S.Class<GetSpritesRequest>(
  "GetSpritesRequest",
)(
  {
    FileName: S.String.pipe(T.HttpLabel("FileName")),
    Style: S.String.pipe(T.HttpLabel("Style")),
    ColorScheme: S.String.pipe(T.HttpLabel("ColorScheme")),
    Variant: S.String.pipe(T.HttpLabel("Variant")),
  },
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
) {}
export class GetStaticMapRequest extends S.Class<GetStaticMapRequest>(
  "GetStaticMapRequest",
)(
  {
    BoundingBox: S.optional(S.String).pipe(T.HttpQuery("bounding-box")),
    BoundedPositions: S.optional(S.String).pipe(
      T.HttpQuery("bounded-positions"),
    ),
    Center: S.optional(S.String).pipe(T.HttpQuery("center")),
    ColorScheme: S.optional(S.String).pipe(T.HttpQuery("color-scheme")),
    CompactOverlay: S.optional(S.String).pipe(T.HttpQuery("compact-overlay")),
    CropLabels: S.optional(S.Boolean).pipe(T.HttpQuery("crop-labels")),
    GeoJsonOverlay: S.optional(S.String).pipe(T.HttpQuery("geojson-overlay")),
    Height: S.Number.pipe(T.HttpQuery("height")),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
    LabelSize: S.optional(S.String).pipe(T.HttpQuery("label-size")),
    Language: S.optional(S.String).pipe(T.HttpQuery("lang")),
    Padding: S.optional(S.Number).pipe(T.HttpQuery("padding")),
    PoliticalView: S.optional(S.String).pipe(T.HttpQuery("political-view")),
    PointsOfInterests: S.optional(S.String).pipe(T.HttpQuery("pois")),
    Radius: S.optional(S.Number).pipe(T.HttpQuery("radius")),
    FileName: S.String.pipe(T.HttpLabel("FileName")),
    ScaleBarUnit: S.optional(S.String).pipe(T.HttpQuery("scale-unit")),
    Style: S.optional(S.String).pipe(T.HttpQuery("style")),
    Width: S.Number.pipe(T.HttpQuery("width")),
    Zoom: S.optional(S.Number).pipe(T.HttpQuery("zoom")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/static/{FileName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetStyleDescriptorRequest extends S.Class<GetStyleDescriptorRequest>(
  "GetStyleDescriptorRequest",
)(
  {
    Style: S.String.pipe(T.HttpLabel("Style")),
    ColorScheme: S.optional(S.String).pipe(T.HttpQuery("color-scheme")),
    PoliticalView: S.optional(S.String).pipe(T.HttpQuery("political-view")),
    Terrain: S.optional(S.String).pipe(T.HttpQuery("terrain")),
    ContourDensity: S.optional(S.String).pipe(T.HttpQuery("contour-density")),
    Traffic: S.optional(S.String).pipe(T.HttpQuery("traffic")),
    TravelModes: S.optional(TravelModeList).pipe(T.HttpQuery("travel-modes")),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/styles/{Style}/descriptor" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTileRequest extends S.Class<GetTileRequest>("GetTileRequest")(
  {
    AdditionalFeatures: S.optional(TileAdditionalFeatureList).pipe(
      T.HttpQuery("additional-features"),
    ),
    Tileset: S.String.pipe(T.HttpLabel("Tileset")),
    Z: S.String.pipe(T.HttpLabel("Z")),
    X: S.String.pipe(T.HttpLabel("X")),
    Y: S.String.pipe(T.HttpLabel("Y")),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/tiles/{Tileset}/{Z}/{X}/{Y}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGlyphsResponse extends S.Class<GetGlyphsResponse>(
  "GetGlyphsResponse",
)({
  Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
  ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
}) {}
export class GetSpritesResponse extends S.Class<GetSpritesResponse>(
  "GetSpritesResponse",
)({
  Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
  ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
}) {}
export class GetStaticMapResponse extends S.Class<GetStaticMapResponse>(
  "GetStaticMapResponse",
)({
  Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
  ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
}) {}
export class GetStyleDescriptorResponse extends S.Class<GetStyleDescriptorResponse>(
  "GetStyleDescriptorResponse",
)({
  Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
  ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
}) {}
export class GetTileResponse extends S.Class<GetTileResponse>(
  "GetTileResponse",
)({
  Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
  ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  PricingBucket: S.String.pipe(T.HttpHeader("x-amz-geo-pricing-bucket")),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Message: S.String.pipe(T.JsonName("message")),
}) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String.pipe(T.JsonName("message")),
    Reason: S.String.pipe(T.JsonName("reason")),
    FieldList: ValidationExceptionFieldList.pipe(T.JsonName("fieldList")),
  },
) {}

//# Operations
/**
 * `GetGlyphs` returns the map's glyphs.
 *
 * For more information, see Style labels with glyphs in the *Amazon Location Service Developer Guide*.
 */
export const getGlyphs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGlyphsRequest,
  output: GetGlyphsResponse,
  errors: [],
}));
/**
 * `GetSprites` returns the map's sprites.
 *
 * For more information, see Style iconography with sprites in the *Amazon Location Service Developer Guide*.
 */
export const getSprites = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSpritesRequest,
  output: GetSpritesResponse,
  errors: [],
}));
/**
 * `GetStyleDescriptor` returns information about the style.
 *
 * For more information, see Style dynamic maps in the *Amazon Location Service Developer Guide*.
 */
export const getStyleDescriptor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getStaticMap = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

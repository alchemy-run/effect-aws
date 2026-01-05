import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Location",
  serviceShapeName: "LocationService",
});
const auth = T.AwsAuthSigv4({ name: "geo" });
const ver = T.ServiceVersion("2020-11-19");
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
                        url: "https://geo-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [],
                      endpoint: {
                        url: "https://geo-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://geo.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://geo.{Region}.{PartitionResult#dnsSuffix}",
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

//# Schemas
export const TagKeys = S.Array(S.String);
export const IdList = S.Array(S.String);
export const Position = S.Array(S.Number);
export const BoundingBox = S.Array(S.Number);
export const CountryCodeList = S.Array(S.String);
export const FilterPlaceCategoryList = S.Array(S.String);
export const WaypointPositionList = S.Array(Position);
export const PositionList = S.Array(Position);
export const DeviceIdsList = S.Array(S.String);
export class DescribeKeyRequest extends S.Class<DescribeKeyRequest>(
  "DescribeKeyRequest",
)(
  { KeyName: S.String.pipe(T.HttpLabel("KeyName")) },
  T.all(
    T.Http({ method: "GET", uri: "/metadata/v0/keys/{KeyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ApiKeyActionList = S.Array(S.String);
export const GeoArnList = S.Array(S.String);
export const RefererPatternList = S.Array(S.String);
export class AndroidApp extends S.Class<AndroidApp>("AndroidApp")({
  Package: S.String,
  CertificateFingerprint: S.String,
}) {}
export const AndroidAppList = S.Array(AndroidApp);
export class AppleApp extends S.Class<AppleApp>("AppleApp")({
  BundleId: S.String,
}) {}
export const AppleAppList = S.Array(AppleApp);
export class ApiKeyRestrictions extends S.Class<ApiKeyRestrictions>(
  "ApiKeyRestrictions",
)({
  AllowActions: ApiKeyActionList,
  AllowResources: GeoArnList,
  AllowReferers: S.optional(RefererPatternList),
  AllowAndroidApps: S.optional(AndroidAppList),
  AllowAppleApps: S.optional(AppleAppList),
}) {}
export class UpdateKeyRequest extends S.Class<UpdateKeyRequest>(
  "UpdateKeyRequest",
)(
  {
    KeyName: S.String.pipe(T.HttpLabel("KeyName")),
    Description: S.optional(S.String),
    ExpireTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NoExpiry: S.optional(S.Boolean),
    ForceUpdate: S.optional(S.Boolean),
    Restrictions: S.optional(ApiKeyRestrictions),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/metadata/v0/keys/{KeyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKeyRequest extends S.Class<DeleteKeyRequest>(
  "DeleteKeyRequest",
)(
  {
    KeyName: S.String.pipe(T.HttpLabel("KeyName")),
    ForceDelete: S.optional(S.Boolean).pipe(T.HttpQuery("forceDelete")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/metadata/v0/keys/{KeyName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteKeyResponse extends S.Class<DeleteKeyResponse>(
  "DeleteKeyResponse",
)({}) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class CreateGeofenceCollectionRequest extends S.Class<CreateGeofenceCollectionRequest>(
  "CreateGeofenceCollectionRequest",
)(
  {
    CollectionName: S.String,
    PricingPlan: S.optional(S.String),
    PricingPlanDataSource: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
    KmsKeyId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/geofencing/v0/collections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeGeofenceCollectionRequest extends S.Class<DescribeGeofenceCollectionRequest>(
  "DescribeGeofenceCollectionRequest",
)(
  { CollectionName: S.String.pipe(T.HttpLabel("CollectionName")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/geofencing/v0/collections/{CollectionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateGeofenceCollectionRequest extends S.Class<UpdateGeofenceCollectionRequest>(
  "UpdateGeofenceCollectionRequest",
)(
  {
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    PricingPlan: S.optional(S.String),
    PricingPlanDataSource: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/geofencing/v0/collections/{CollectionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGeofenceCollectionRequest extends S.Class<DeleteGeofenceCollectionRequest>(
  "DeleteGeofenceCollectionRequest",
)(
  { CollectionName: S.String.pipe(T.HttpLabel("CollectionName")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/geofencing/v0/collections/{CollectionName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteGeofenceCollectionResponse extends S.Class<DeleteGeofenceCollectionResponse>(
  "DeleteGeofenceCollectionResponse",
)({}) {}
export class ListGeofenceCollectionsRequest extends S.Class<ListGeofenceCollectionsRequest>(
  "ListGeofenceCollectionsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/geofencing/v0/list-collections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteGeofenceRequest extends S.Class<BatchDeleteGeofenceRequest>(
  "BatchDeleteGeofenceRequest",
)(
  {
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    GeofenceIds: IdList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/geofencing/v0/collections/{CollectionName}/delete-geofences",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGeofenceRequest extends S.Class<GetGeofenceRequest>(
  "GetGeofenceRequest",
)(
  {
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    GeofenceId: S.String.pipe(T.HttpLabel("GeofenceId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/geofencing/v0/collections/{CollectionName}/geofences/{GeofenceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGeofencesRequest extends S.Class<ListGeofencesRequest>(
  "ListGeofencesRequest",
)(
  {
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/geofencing/v0/collections/{CollectionName}/list-geofences",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeMapRequest extends S.Class<DescribeMapRequest>(
  "DescribeMapRequest",
)(
  { MapName: S.String.pipe(T.HttpLabel("MapName")) },
  T.all(
    T.Http({ method: "GET", uri: "/maps/v0/maps/{MapName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMapRequest extends S.Class<DeleteMapRequest>(
  "DeleteMapRequest",
)(
  { MapName: S.String.pipe(T.HttpLabel("MapName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/maps/v0/maps/{MapName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMapResponse extends S.Class<DeleteMapResponse>(
  "DeleteMapResponse",
)({}) {}
export class ListMapsRequest extends S.Class<ListMapsRequest>(
  "ListMapsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/maps/v0/list-maps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMapGlyphsRequest extends S.Class<GetMapGlyphsRequest>(
  "GetMapGlyphsRequest",
)(
  {
    MapName: S.String.pipe(T.HttpLabel("MapName")),
    FontStack: S.String.pipe(T.HttpLabel("FontStack")),
    FontUnicodeRange: S.String.pipe(T.HttpLabel("FontUnicodeRange")),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/maps/v0/maps/{MapName}/glyphs/{FontStack}/{FontUnicodeRange}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMapSpritesRequest extends S.Class<GetMapSpritesRequest>(
  "GetMapSpritesRequest",
)(
  {
    MapName: S.String.pipe(T.HttpLabel("MapName")),
    FileName: S.String.pipe(T.HttpLabel("FileName")),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/maps/v0/maps/{MapName}/sprites/{FileName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMapStyleDescriptorRequest extends S.Class<GetMapStyleDescriptorRequest>(
  "GetMapStyleDescriptorRequest",
)(
  {
    MapName: S.String.pipe(T.HttpLabel("MapName")),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/maps/v0/maps/{MapName}/style-descriptor" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMapTileRequest extends S.Class<GetMapTileRequest>(
  "GetMapTileRequest",
)(
  {
    MapName: S.String.pipe(T.HttpLabel("MapName")),
    Z: S.String.pipe(T.HttpLabel("Z")),
    X: S.String.pipe(T.HttpLabel("X")),
    Y: S.String.pipe(T.HttpLabel("Y")),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/maps/v0/maps/{MapName}/tiles/{Z}/{X}/{Y}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePlaceIndexRequest extends S.Class<DescribePlaceIndexRequest>(
  "DescribePlaceIndexRequest",
)(
  { IndexName: S.String.pipe(T.HttpLabel("IndexName")) },
  T.all(
    T.Http({ method: "GET", uri: "/places/v0/indexes/{IndexName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DataSourceConfiguration extends S.Class<DataSourceConfiguration>(
  "DataSourceConfiguration",
)({ IntendedUse: S.optional(S.String) }) {}
export class UpdatePlaceIndexRequest extends S.Class<UpdatePlaceIndexRequest>(
  "UpdatePlaceIndexRequest",
)(
  {
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
    DataSourceConfiguration: S.optional(DataSourceConfiguration),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/places/v0/indexes/{IndexName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePlaceIndexRequest extends S.Class<DeletePlaceIndexRequest>(
  "DeletePlaceIndexRequest",
)(
  { IndexName: S.String.pipe(T.HttpLabel("IndexName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/places/v0/indexes/{IndexName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeletePlaceIndexResponse extends S.Class<DeletePlaceIndexResponse>(
  "DeletePlaceIndexResponse",
)({}) {}
export class ListPlaceIndexesRequest extends S.Class<ListPlaceIndexesRequest>(
  "ListPlaceIndexesRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/places/v0/list-indexes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPlaceRequest extends S.Class<GetPlaceRequest>(
  "GetPlaceRequest",
)(
  {
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    PlaceId: S.String.pipe(T.HttpLabel("PlaceId")),
    Language: S.optional(S.String).pipe(T.HttpQuery("language")),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/places/v0/indexes/{IndexName}/places/{PlaceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchPlaceIndexForPositionRequest extends S.Class<SearchPlaceIndexForPositionRequest>(
  "SearchPlaceIndexForPositionRequest",
)(
  {
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    Position: Position,
    MaxResults: S.optional(S.Number),
    Language: S.optional(S.String),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/places/v0/indexes/{IndexName}/search/position",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchPlaceIndexForSuggestionsRequest extends S.Class<SearchPlaceIndexForSuggestionsRequest>(
  "SearchPlaceIndexForSuggestionsRequest",
)(
  {
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    Text: S.String,
    BiasPosition: S.optional(Position),
    FilterBBox: S.optional(BoundingBox),
    FilterCountries: S.optional(CountryCodeList),
    MaxResults: S.optional(S.Number),
    Language: S.optional(S.String),
    FilterCategories: S.optional(FilterPlaceCategoryList),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/places/v0/indexes/{IndexName}/search/suggestions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchPlaceIndexForTextRequest extends S.Class<SearchPlaceIndexForTextRequest>(
  "SearchPlaceIndexForTextRequest",
)(
  {
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    Text: S.String,
    BiasPosition: S.optional(Position),
    FilterBBox: S.optional(BoundingBox),
    FilterCountries: S.optional(CountryCodeList),
    MaxResults: S.optional(S.Number),
    Language: S.optional(S.String),
    FilterCategories: S.optional(FilterPlaceCategoryList),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/places/v0/indexes/{IndexName}/search/text",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRouteCalculatorRequest extends S.Class<CreateRouteCalculatorRequest>(
  "CreateRouteCalculatorRequest",
)(
  {
    CalculatorName: S.String,
    DataSource: S.String,
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/routes/v0/calculators" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRouteCalculatorRequest extends S.Class<DescribeRouteCalculatorRequest>(
  "DescribeRouteCalculatorRequest",
)(
  { CalculatorName: S.String.pipe(T.HttpLabel("CalculatorName")) },
  T.all(
    T.Http({ method: "GET", uri: "/routes/v0/calculators/{CalculatorName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRouteCalculatorRequest extends S.Class<UpdateRouteCalculatorRequest>(
  "UpdateRouteCalculatorRequest",
)(
  {
    CalculatorName: S.String.pipe(T.HttpLabel("CalculatorName")),
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/routes/v0/calculators/{CalculatorName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRouteCalculatorRequest extends S.Class<DeleteRouteCalculatorRequest>(
  "DeleteRouteCalculatorRequest",
)(
  { CalculatorName: S.String.pipe(T.HttpLabel("CalculatorName")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/routes/v0/calculators/{CalculatorName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRouteCalculatorResponse extends S.Class<DeleteRouteCalculatorResponse>(
  "DeleteRouteCalculatorResponse",
)({}) {}
export class ListRouteCalculatorsRequest extends S.Class<ListRouteCalculatorsRequest>(
  "ListRouteCalculatorsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/routes/v0/list-calculators" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CalculateRouteCarModeOptions extends S.Class<CalculateRouteCarModeOptions>(
  "CalculateRouteCarModeOptions",
)({ AvoidFerries: S.optional(S.Boolean), AvoidTolls: S.optional(S.Boolean) }) {}
export class TruckDimensions extends S.Class<TruckDimensions>(
  "TruckDimensions",
)({
  Length: S.optional(S.Number),
  Height: S.optional(S.Number),
  Width: S.optional(S.Number),
  Unit: S.optional(S.String),
}) {}
export class TruckWeight extends S.Class<TruckWeight>("TruckWeight")({
  Total: S.optional(S.Number),
  Unit: S.optional(S.String),
}) {}
export class CalculateRouteTruckModeOptions extends S.Class<CalculateRouteTruckModeOptions>(
  "CalculateRouteTruckModeOptions",
)({
  AvoidFerries: S.optional(S.Boolean),
  AvoidTolls: S.optional(S.Boolean),
  Dimensions: S.optional(TruckDimensions),
  Weight: S.optional(TruckWeight),
}) {}
export class CalculateRouteMatrixRequest extends S.Class<CalculateRouteMatrixRequest>(
  "CalculateRouteMatrixRequest",
)(
  {
    CalculatorName: S.String.pipe(T.HttpLabel("CalculatorName")),
    DeparturePositions: PositionList,
    DestinationPositions: PositionList,
    TravelMode: S.optional(S.String),
    DepartureTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DepartNow: S.optional(S.Boolean),
    DistanceUnit: S.optional(S.String),
    CarModeOptions: S.optional(CalculateRouteCarModeOptions),
    TruckModeOptions: S.optional(CalculateRouteTruckModeOptions),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/routes/v0/calculators/{CalculatorName}/calculate/route-matrix",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTrackerRequest extends S.Class<CreateTrackerRequest>(
  "CreateTrackerRequest",
)(
  {
    TrackerName: S.String,
    PricingPlan: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    PricingPlanDataSource: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
    PositionFiltering: S.optional(S.String),
    EventBridgeEnabled: S.optional(S.Boolean),
    KmsKeyEnableGeospatialQueries: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/tracking/v0/trackers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTrackerRequest extends S.Class<DescribeTrackerRequest>(
  "DescribeTrackerRequest",
)(
  { TrackerName: S.String.pipe(T.HttpLabel("TrackerName")) },
  T.all(
    T.Http({ method: "GET", uri: "/tracking/v0/trackers/{TrackerName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTrackerRequest extends S.Class<UpdateTrackerRequest>(
  "UpdateTrackerRequest",
)(
  {
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    PricingPlan: S.optional(S.String),
    PricingPlanDataSource: S.optional(S.String),
    Description: S.optional(S.String),
    PositionFiltering: S.optional(S.String),
    EventBridgeEnabled: S.optional(S.Boolean),
    KmsKeyEnableGeospatialQueries: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/tracking/v0/trackers/{TrackerName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTrackerRequest extends S.Class<DeleteTrackerRequest>(
  "DeleteTrackerRequest",
)(
  { TrackerName: S.String.pipe(T.HttpLabel("TrackerName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/tracking/v0/trackers/{TrackerName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTrackerResponse extends S.Class<DeleteTrackerResponse>(
  "DeleteTrackerResponse",
)({}) {}
export class ListTrackersRequest extends S.Class<ListTrackersRequest>(
  "ListTrackersRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/tracking/v0/list-trackers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateTrackerConsumerRequest extends S.Class<AssociateTrackerConsumerRequest>(
  "AssociateTrackerConsumerRequest",
)(
  {
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    ConsumerArn: S.String,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/tracking/v0/trackers/{TrackerName}/consumers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AssociateTrackerConsumerResponse extends S.Class<AssociateTrackerConsumerResponse>(
  "AssociateTrackerConsumerResponse",
)({}) {}
export class BatchDeleteDevicePositionHistoryRequest extends S.Class<BatchDeleteDevicePositionHistoryRequest>(
  "BatchDeleteDevicePositionHistoryRequest",
)(
  {
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    DeviceIds: DeviceIdsList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/tracking/v0/trackers/{TrackerName}/delete-positions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchGetDevicePositionRequest extends S.Class<BatchGetDevicePositionRequest>(
  "BatchGetDevicePositionRequest",
)(
  { TrackerName: S.String.pipe(T.HttpLabel("TrackerName")), DeviceIds: IdList },
  T.all(
    T.Http({
      method: "POST",
      uri: "/tracking/v0/trackers/{TrackerName}/get-positions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PositionalAccuracy extends S.Class<PositionalAccuracy>(
  "PositionalAccuracy",
)({ Horizontal: S.Number }) {}
export const PositionPropertyMap = S.Record({ key: S.String, value: S.String });
export class DevicePositionUpdate extends S.Class<DevicePositionUpdate>(
  "DevicePositionUpdate",
)({
  DeviceId: S.String,
  SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
  Position: Position,
  Accuracy: S.optional(PositionalAccuracy),
  PositionProperties: S.optional(PositionPropertyMap),
}) {}
export const DevicePositionUpdateList = S.Array(DevicePositionUpdate);
export class BatchUpdateDevicePositionRequest extends S.Class<BatchUpdateDevicePositionRequest>(
  "BatchUpdateDevicePositionRequest",
)(
  {
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    Updates: DevicePositionUpdateList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/tracking/v0/trackers/{TrackerName}/positions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateTrackerConsumerRequest extends S.Class<DisassociateTrackerConsumerRequest>(
  "DisassociateTrackerConsumerRequest",
)(
  {
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    ConsumerArn: S.String.pipe(T.HttpLabel("ConsumerArn")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/tracking/v0/trackers/{TrackerName}/consumers/{ConsumerArn}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DisassociateTrackerConsumerResponse extends S.Class<DisassociateTrackerConsumerResponse>(
  "DisassociateTrackerConsumerResponse",
)({}) {}
export class GetDevicePositionRequest extends S.Class<GetDevicePositionRequest>(
  "GetDevicePositionRequest",
)(
  {
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    DeviceId: S.String.pipe(T.HttpLabel("DeviceId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/tracking/v0/trackers/{TrackerName}/devices/{DeviceId}/positions/latest",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDevicePositionHistoryRequest extends S.Class<GetDevicePositionHistoryRequest>(
  "GetDevicePositionHistoryRequest",
)(
  {
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    DeviceId: S.String.pipe(T.HttpLabel("DeviceId")),
    NextToken: S.optional(S.String),
    StartTimeInclusive: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTimeExclusive: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/tracking/v0/trackers/{TrackerName}/devices/{DeviceId}/list-positions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrackerConsumersRequest extends S.Class<ListTrackerConsumersRequest>(
  "ListTrackerConsumersRequest",
)(
  {
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/tracking/v0/trackers/{TrackerName}/list-consumers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const LinearRing = S.Array(Position);
export const LinearRings = S.Array(LinearRing);
export const MultiLinearRings = S.Array(LinearRings);
export const CustomLayerList = S.Array(S.String);
export class ApiKeyFilter extends S.Class<ApiKeyFilter>("ApiKeyFilter")({
  KeyStatus: S.optional(S.String),
}) {}
export class Circle extends S.Class<Circle>("Circle")({
  Center: Position,
  Radius: S.Number,
}) {}
export class GeofenceGeometry extends S.Class<GeofenceGeometry>(
  "GeofenceGeometry",
)({
  Polygon: S.optional(LinearRings),
  Circle: S.optional(Circle),
  Geobuf: S.optional(T.Blob),
  MultiPolygon: S.optional(MultiLinearRings),
}) {}
export const PropertyMap = S.Record({ key: S.String, value: S.String });
export class BatchPutGeofenceRequestEntry extends S.Class<BatchPutGeofenceRequestEntry>(
  "BatchPutGeofenceRequestEntry",
)({
  GeofenceId: S.String,
  Geometry: GeofenceGeometry,
  GeofenceProperties: S.optional(PropertyMap),
}) {}
export const BatchPutGeofenceRequestEntryList = S.Array(
  BatchPutGeofenceRequestEntry,
);
export class ForecastGeofenceEventsDeviceState extends S.Class<ForecastGeofenceEventsDeviceState>(
  "ForecastGeofenceEventsDeviceState",
)({ Position: Position, Speed: S.optional(S.Number) }) {}
export class MapConfiguration extends S.Class<MapConfiguration>(
  "MapConfiguration",
)({
  Style: S.String,
  PoliticalView: S.optional(S.String),
  CustomLayers: S.optional(CustomLayerList),
}) {}
export class MapConfigurationUpdate extends S.Class<MapConfigurationUpdate>(
  "MapConfigurationUpdate",
)({
  PoliticalView: S.optional(S.String),
  CustomLayers: S.optional(CustomLayerList),
}) {}
export class TrackingFilterGeometry extends S.Class<TrackingFilterGeometry>(
  "TrackingFilterGeometry",
)({ Polygon: S.optional(LinearRings) }) {}
export const ArnList = S.Array(S.String);
export class DescribeKeyResponse extends S.Class<DescribeKeyResponse>(
  "DescribeKeyResponse",
)({
  Key: S.String,
  KeyArn: S.String,
  KeyName: S.String,
  Restrictions: ApiKeyRestrictions,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  ExpireTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  Description: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export class UpdateKeyResponse extends S.Class<UpdateKeyResponse>(
  "UpdateKeyResponse",
)({
  KeyArn: S.String,
  KeyName: S.String,
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListKeysRequest extends S.Class<ListKeysRequest>(
  "ListKeysRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filter: S.optional(ApiKeyFilter),
  },
  T.all(
    T.Http({ method: "POST", uri: "/metadata/v0/list-keys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class CreateGeofenceCollectionResponse extends S.Class<CreateGeofenceCollectionResponse>(
  "CreateGeofenceCollectionResponse",
)({
  CollectionName: S.String,
  CollectionArn: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class DescribeGeofenceCollectionResponse extends S.Class<DescribeGeofenceCollectionResponse>(
  "DescribeGeofenceCollectionResponse",
)({
  CollectionName: S.String,
  CollectionArn: S.String,
  Description: S.String,
  PricingPlan: S.optional(S.String),
  PricingPlanDataSource: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  Tags: S.optional(TagMap),
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  GeofenceCount: S.optional(S.Number),
}) {}
export class UpdateGeofenceCollectionResponse extends S.Class<UpdateGeofenceCollectionResponse>(
  "UpdateGeofenceCollectionResponse",
)({
  CollectionName: S.String,
  CollectionArn: S.String,
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class BatchPutGeofenceRequest extends S.Class<BatchPutGeofenceRequest>(
  "BatchPutGeofenceRequest",
)(
  {
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    Entries: BatchPutGeofenceRequestEntryList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/geofencing/v0/collections/{CollectionName}/put-geofences",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ForecastGeofenceEventsRequest extends S.Class<ForecastGeofenceEventsRequest>(
  "ForecastGeofenceEventsRequest",
)(
  {
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    DeviceState: ForecastGeofenceEventsDeviceState,
    TimeHorizonMinutes: S.optional(S.Number),
    DistanceUnit: S.optional(S.String),
    SpeedUnit: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/geofencing/v0/collections/{CollectionName}/forecast-geofence-events",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGeofenceResponse extends S.Class<GetGeofenceResponse>(
  "GetGeofenceResponse",
)({
  GeofenceId: S.String,
  Geometry: GeofenceGeometry,
  Status: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  GeofenceProperties: S.optional(PropertyMap),
}) {}
export class CreateMapRequest extends S.Class<CreateMapRequest>(
  "CreateMapRequest",
)(
  {
    MapName: S.String,
    Configuration: MapConfiguration,
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/maps/v0/maps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeMapResponse extends S.Class<DescribeMapResponse>(
  "DescribeMapResponse",
)({
  MapName: S.String,
  MapArn: S.String,
  PricingPlan: S.optional(S.String),
  DataSource: S.String,
  Configuration: MapConfiguration,
  Description: S.String,
  Tags: S.optional(TagMap),
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class UpdateMapRequest extends S.Class<UpdateMapRequest>(
  "UpdateMapRequest",
)(
  {
    MapName: S.String.pipe(T.HttpLabel("MapName")),
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
    ConfigurationUpdate: S.optional(MapConfigurationUpdate),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/maps/v0/maps/{MapName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMapGlyphsResponse extends S.Class<GetMapGlyphsResponse>(
  "GetMapGlyphsResponse",
)({
  Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
}) {}
export class GetMapSpritesResponse extends S.Class<GetMapSpritesResponse>(
  "GetMapSpritesResponse",
)({
  Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
}) {}
export class GetMapStyleDescriptorResponse extends S.Class<GetMapStyleDescriptorResponse>(
  "GetMapStyleDescriptorResponse",
)({
  Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
}) {}
export class GetMapTileResponse extends S.Class<GetMapTileResponse>(
  "GetMapTileResponse",
)({
  Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
}) {}
export class CreatePlaceIndexRequest extends S.Class<CreatePlaceIndexRequest>(
  "CreatePlaceIndexRequest",
)(
  {
    IndexName: S.String,
    DataSource: S.String,
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
    DataSourceConfiguration: S.optional(DataSourceConfiguration),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/places/v0/indexes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribePlaceIndexResponse extends S.Class<DescribePlaceIndexResponse>(
  "DescribePlaceIndexResponse",
)({
  IndexName: S.String,
  IndexArn: S.String,
  PricingPlan: S.optional(S.String),
  Description: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  DataSource: S.String,
  DataSourceConfiguration: DataSourceConfiguration,
  Tags: S.optional(TagMap),
}) {}
export class UpdatePlaceIndexResponse extends S.Class<UpdatePlaceIndexResponse>(
  "UpdatePlaceIndexResponse",
)({
  IndexName: S.String,
  IndexArn: S.String,
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class CreateRouteCalculatorResponse extends S.Class<CreateRouteCalculatorResponse>(
  "CreateRouteCalculatorResponse",
)({
  CalculatorName: S.String,
  CalculatorArn: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class DescribeRouteCalculatorResponse extends S.Class<DescribeRouteCalculatorResponse>(
  "DescribeRouteCalculatorResponse",
)({
  CalculatorName: S.String,
  CalculatorArn: S.String,
  PricingPlan: S.optional(S.String),
  Description: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  DataSource: S.String,
  Tags: S.optional(TagMap),
}) {}
export class UpdateRouteCalculatorResponse extends S.Class<UpdateRouteCalculatorResponse>(
  "UpdateRouteCalculatorResponse",
)({
  CalculatorName: S.String,
  CalculatorArn: S.String,
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class CreateTrackerResponse extends S.Class<CreateTrackerResponse>(
  "CreateTrackerResponse",
)({
  TrackerName: S.String,
  TrackerArn: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class DescribeTrackerResponse extends S.Class<DescribeTrackerResponse>(
  "DescribeTrackerResponse",
)({
  TrackerName: S.String,
  TrackerArn: S.String,
  Description: S.String,
  PricingPlan: S.optional(S.String),
  PricingPlanDataSource: S.optional(S.String),
  Tags: S.optional(TagMap),
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  KmsKeyId: S.optional(S.String),
  PositionFiltering: S.optional(S.String),
  EventBridgeEnabled: S.optional(S.Boolean),
  KmsKeyEnableGeospatialQueries: S.optional(S.Boolean),
}) {}
export class UpdateTrackerResponse extends S.Class<UpdateTrackerResponse>(
  "UpdateTrackerResponse",
)({
  TrackerName: S.String,
  TrackerArn: S.String,
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetDevicePositionResponse extends S.Class<GetDevicePositionResponse>(
  "GetDevicePositionResponse",
)({
  DeviceId: S.optional(S.String),
  SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
  ReceivedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  Position: Position,
  Accuracy: S.optional(PositionalAccuracy),
  PositionProperties: S.optional(PositionPropertyMap),
}) {}
export class DevicePosition extends S.Class<DevicePosition>("DevicePosition")({
  DeviceId: S.optional(S.String),
  SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
  ReceivedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  Position: Position,
  Accuracy: S.optional(PositionalAccuracy),
  PositionProperties: S.optional(PositionPropertyMap),
}) {}
export const DevicePositionList = S.Array(DevicePosition);
export class GetDevicePositionHistoryResponse extends S.Class<GetDevicePositionHistoryResponse>(
  "GetDevicePositionHistoryResponse",
)({ DevicePositions: DevicePositionList, NextToken: S.optional(S.String) }) {}
export class ListDevicePositionsRequest extends S.Class<ListDevicePositionsRequest>(
  "ListDevicePositionsRequest",
)(
  {
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    FilterGeometry: S.optional(TrackingFilterGeometry),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/tracking/v0/trackers/{TrackerName}/list-positions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrackerConsumersResponse extends S.Class<ListTrackerConsumersResponse>(
  "ListTrackerConsumersResponse",
)({ ConsumerArns: ArnList, NextToken: S.optional(S.String) }) {}
export const PlaceCategoryList = S.Array(S.String);
export const PlaceSupplementalCategoryList = S.Array(S.String);
export class WiFiAccessPoint extends S.Class<WiFiAccessPoint>(
  "WiFiAccessPoint",
)({ MacAddress: S.String, Rss: S.Number }) {}
export const WiFiAccessPointList = S.Array(WiFiAccessPoint);
export class ListGeofenceCollectionsResponseEntry extends S.Class<ListGeofenceCollectionsResponseEntry>(
  "ListGeofenceCollectionsResponseEntry",
)({
  CollectionName: S.String,
  Description: S.String,
  PricingPlan: S.optional(S.String),
  PricingPlanDataSource: S.optional(S.String),
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListGeofenceCollectionsResponseEntryList = S.Array(
  ListGeofenceCollectionsResponseEntry,
);
export class ListGeofenceResponseEntry extends S.Class<ListGeofenceResponseEntry>(
  "ListGeofenceResponseEntry",
)({
  GeofenceId: S.String,
  Geometry: GeofenceGeometry,
  Status: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  GeofenceProperties: S.optional(PropertyMap),
}) {}
export const ListGeofenceResponseEntryList = S.Array(ListGeofenceResponseEntry);
export class ListMapsResponseEntry extends S.Class<ListMapsResponseEntry>(
  "ListMapsResponseEntry",
)({
  MapName: S.String,
  Description: S.String,
  DataSource: S.String,
  PricingPlan: S.optional(S.String),
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListMapsResponseEntryList = S.Array(ListMapsResponseEntry);
export class ListPlaceIndexesResponseEntry extends S.Class<ListPlaceIndexesResponseEntry>(
  "ListPlaceIndexesResponseEntry",
)({
  IndexName: S.String,
  Description: S.String,
  DataSource: S.String,
  PricingPlan: S.optional(S.String),
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListPlaceIndexesResponseEntryList = S.Array(
  ListPlaceIndexesResponseEntry,
);
export class SearchPlaceIndexForPositionSummary extends S.Class<SearchPlaceIndexForPositionSummary>(
  "SearchPlaceIndexForPositionSummary",
)({
  Position: Position,
  MaxResults: S.optional(S.Number),
  DataSource: S.String,
  Language: S.optional(S.String),
}) {}
export class PlaceGeometry extends S.Class<PlaceGeometry>("PlaceGeometry")({
  Point: S.optional(Position),
}) {}
export class TimeZone extends S.Class<TimeZone>("TimeZone")({
  Name: S.String,
  Offset: S.optional(S.Number),
}) {}
export class Place extends S.Class<Place>("Place")({
  Label: S.optional(S.String),
  Geometry: PlaceGeometry,
  AddressNumber: S.optional(S.String),
  Street: S.optional(S.String),
  Neighborhood: S.optional(S.String),
  Municipality: S.optional(S.String),
  SubRegion: S.optional(S.String),
  Region: S.optional(S.String),
  Country: S.optional(S.String),
  PostalCode: S.optional(S.String),
  Interpolated: S.optional(S.Boolean),
  TimeZone: S.optional(TimeZone),
  UnitType: S.optional(S.String),
  UnitNumber: S.optional(S.String),
  Categories: S.optional(PlaceCategoryList),
  SupplementalCategories: S.optional(PlaceSupplementalCategoryList),
  SubMunicipality: S.optional(S.String),
}) {}
export class SearchForPositionResult extends S.Class<SearchForPositionResult>(
  "SearchForPositionResult",
)({ Place: Place, Distance: S.Number, PlaceId: S.optional(S.String) }) {}
export const SearchForPositionResultList = S.Array(SearchForPositionResult);
export class SearchPlaceIndexForSuggestionsSummary extends S.Class<SearchPlaceIndexForSuggestionsSummary>(
  "SearchPlaceIndexForSuggestionsSummary",
)({
  Text: S.String,
  BiasPosition: S.optional(Position),
  FilterBBox: S.optional(BoundingBox),
  FilterCountries: S.optional(CountryCodeList),
  MaxResults: S.optional(S.Number),
  DataSource: S.String,
  Language: S.optional(S.String),
  FilterCategories: S.optional(FilterPlaceCategoryList),
}) {}
export class SearchForSuggestionsResult extends S.Class<SearchForSuggestionsResult>(
  "SearchForSuggestionsResult",
)({
  Text: S.String,
  PlaceId: S.optional(S.String),
  Categories: S.optional(PlaceCategoryList),
  SupplementalCategories: S.optional(PlaceSupplementalCategoryList),
}) {}
export const SearchForSuggestionsResultList = S.Array(
  SearchForSuggestionsResult,
);
export class SearchPlaceIndexForTextSummary extends S.Class<SearchPlaceIndexForTextSummary>(
  "SearchPlaceIndexForTextSummary",
)({
  Text: S.String,
  BiasPosition: S.optional(Position),
  FilterBBox: S.optional(BoundingBox),
  FilterCountries: S.optional(CountryCodeList),
  MaxResults: S.optional(S.Number),
  ResultBBox: S.optional(BoundingBox),
  DataSource: S.String,
  Language: S.optional(S.String),
  FilterCategories: S.optional(FilterPlaceCategoryList),
}) {}
export class SearchForTextResult extends S.Class<SearchForTextResult>(
  "SearchForTextResult",
)({
  Place: Place,
  Distance: S.optional(S.Number),
  Relevance: S.optional(S.Number),
  PlaceId: S.optional(S.String),
}) {}
export const SearchForTextResultList = S.Array(SearchForTextResult);
export class ListRouteCalculatorsResponseEntry extends S.Class<ListRouteCalculatorsResponseEntry>(
  "ListRouteCalculatorsResponseEntry",
)({
  CalculatorName: S.String,
  Description: S.String,
  DataSource: S.String,
  PricingPlan: S.optional(S.String),
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListRouteCalculatorsResponseEntryList = S.Array(
  ListRouteCalculatorsResponseEntry,
);
export class CalculateRouteMatrixSummary extends S.Class<CalculateRouteMatrixSummary>(
  "CalculateRouteMatrixSummary",
)({
  DataSource: S.String,
  RouteCount: S.Number,
  ErrorCount: S.Number,
  DistanceUnit: S.String,
}) {}
export class ListTrackersResponseEntry extends S.Class<ListTrackersResponseEntry>(
  "ListTrackersResponseEntry",
)({
  TrackerName: S.String,
  Description: S.String,
  PricingPlan: S.optional(S.String),
  PricingPlanDataSource: S.optional(S.String),
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListTrackersResponseEntryList = S.Array(ListTrackersResponseEntry);
export class BatchItemError extends S.Class<BatchItemError>("BatchItemError")({
  Code: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export class BatchDeleteDevicePositionHistoryError extends S.Class<BatchDeleteDevicePositionHistoryError>(
  "BatchDeleteDevicePositionHistoryError",
)({ DeviceId: S.String, Error: BatchItemError }) {}
export const BatchDeleteDevicePositionHistoryErrorList = S.Array(
  BatchDeleteDevicePositionHistoryError,
);
export class BatchGetDevicePositionError extends S.Class<BatchGetDevicePositionError>(
  "BatchGetDevicePositionError",
)({ DeviceId: S.String, Error: BatchItemError }) {}
export const BatchGetDevicePositionErrorList = S.Array(
  BatchGetDevicePositionError,
);
export class BatchUpdateDevicePositionError extends S.Class<BatchUpdateDevicePositionError>(
  "BatchUpdateDevicePositionError",
)({
  DeviceId: S.String,
  SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
  Error: BatchItemError,
}) {}
export const BatchUpdateDevicePositionErrorList = S.Array(
  BatchUpdateDevicePositionError,
);
export class CreateKeyRequest extends S.Class<CreateKeyRequest>(
  "CreateKeyRequest",
)(
  {
    KeyName: S.String,
    Restrictions: ApiKeyRestrictions,
    Description: S.optional(S.String),
    ExpireTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NoExpiry: S.optional(S.Boolean),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/metadata/v0/keys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGeofenceCollectionsResponse extends S.Class<ListGeofenceCollectionsResponse>(
  "ListGeofenceCollectionsResponse",
)({
  Entries: ListGeofenceCollectionsResponseEntryList,
  NextToken: S.optional(S.String),
}) {}
export class BatchEvaluateGeofencesRequest extends S.Class<BatchEvaluateGeofencesRequest>(
  "BatchEvaluateGeofencesRequest",
)(
  {
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    DevicePositionUpdates: DevicePositionUpdateList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/geofencing/v0/collections/{CollectionName}/positions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListGeofencesResponse extends S.Class<ListGeofencesResponse>(
  "ListGeofencesResponse",
)({
  Entries: ListGeofenceResponseEntryList,
  NextToken: S.optional(S.String),
}) {}
export class PutGeofenceRequest extends S.Class<PutGeofenceRequest>(
  "PutGeofenceRequest",
)(
  {
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    GeofenceId: S.String.pipe(T.HttpLabel("GeofenceId")),
    Geometry: GeofenceGeometry,
    GeofenceProperties: S.optional(PropertyMap),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/geofencing/v0/collections/{CollectionName}/geofences/{GeofenceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMapResponse extends S.Class<CreateMapResponse>(
  "CreateMapResponse",
)({
  MapName: S.String,
  MapArn: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class UpdateMapResponse extends S.Class<UpdateMapResponse>(
  "UpdateMapResponse",
)({
  MapName: S.String,
  MapArn: S.String,
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListMapsResponse extends S.Class<ListMapsResponse>(
  "ListMapsResponse",
)({ Entries: ListMapsResponseEntryList, NextToken: S.optional(S.String) }) {}
export class CreatePlaceIndexResponse extends S.Class<CreatePlaceIndexResponse>(
  "CreatePlaceIndexResponse",
)({
  IndexName: S.String,
  IndexArn: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListPlaceIndexesResponse extends S.Class<ListPlaceIndexesResponse>(
  "ListPlaceIndexesResponse",
)({
  Entries: ListPlaceIndexesResponseEntryList,
  NextToken: S.optional(S.String),
}) {}
export class SearchPlaceIndexForPositionResponse extends S.Class<SearchPlaceIndexForPositionResponse>(
  "SearchPlaceIndexForPositionResponse",
)({
  Summary: SearchPlaceIndexForPositionSummary,
  Results: SearchForPositionResultList,
}) {}
export class SearchPlaceIndexForSuggestionsResponse extends S.Class<SearchPlaceIndexForSuggestionsResponse>(
  "SearchPlaceIndexForSuggestionsResponse",
)({
  Summary: SearchPlaceIndexForSuggestionsSummary,
  Results: SearchForSuggestionsResultList,
}) {}
export class SearchPlaceIndexForTextResponse extends S.Class<SearchPlaceIndexForTextResponse>(
  "SearchPlaceIndexForTextResponse",
)({
  Summary: SearchPlaceIndexForTextSummary,
  Results: SearchForTextResultList,
}) {}
export class ListRouteCalculatorsResponse extends S.Class<ListRouteCalculatorsResponse>(
  "ListRouteCalculatorsResponse",
)({
  Entries: ListRouteCalculatorsResponseEntryList,
  NextToken: S.optional(S.String),
}) {}
export class CalculateRouteRequest extends S.Class<CalculateRouteRequest>(
  "CalculateRouteRequest",
)(
  {
    CalculatorName: S.String.pipe(T.HttpLabel("CalculatorName")),
    DeparturePosition: Position,
    DestinationPosition: Position,
    WaypointPositions: S.optional(WaypointPositionList),
    TravelMode: S.optional(S.String),
    DepartureTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DepartNow: S.optional(S.Boolean),
    DistanceUnit: S.optional(S.String),
    IncludeLegGeometry: S.optional(S.Boolean),
    CarModeOptions: S.optional(CalculateRouteCarModeOptions),
    TruckModeOptions: S.optional(CalculateRouteTruckModeOptions),
    ArrivalTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    OptimizeFor: S.optional(S.String),
    Key: S.optional(S.String).pipe(T.HttpQuery("key")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/routes/v0/calculators/{CalculatorName}/calculate/route",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTrackersResponse extends S.Class<ListTrackersResponse>(
  "ListTrackersResponse",
)({
  Entries: ListTrackersResponseEntryList,
  NextToken: S.optional(S.String),
}) {}
export class BatchDeleteDevicePositionHistoryResponse extends S.Class<BatchDeleteDevicePositionHistoryResponse>(
  "BatchDeleteDevicePositionHistoryResponse",
)({ Errors: BatchDeleteDevicePositionHistoryErrorList }) {}
export class BatchGetDevicePositionResponse extends S.Class<BatchGetDevicePositionResponse>(
  "BatchGetDevicePositionResponse",
)({
  Errors: BatchGetDevicePositionErrorList,
  DevicePositions: DevicePositionList,
}) {}
export class BatchUpdateDevicePositionResponse extends S.Class<BatchUpdateDevicePositionResponse>(
  "BatchUpdateDevicePositionResponse",
)({ Errors: BatchUpdateDevicePositionErrorList }) {}
export class RouteMatrixEntryError extends S.Class<RouteMatrixEntryError>(
  "RouteMatrixEntryError",
)({ Code: S.String, Message: S.optional(S.String) }) {}
export class LteLocalId extends S.Class<LteLocalId>("LteLocalId")({
  Earfcn: S.Number,
  Pci: S.Number,
}) {}
export class LteNetworkMeasurements extends S.Class<LteNetworkMeasurements>(
  "LteNetworkMeasurements",
)({
  Earfcn: S.Number,
  CellId: S.Number,
  Pci: S.Number,
  Rsrp: S.optional(S.Number),
  Rsrq: S.optional(S.Number),
}) {}
export const LteNetworkMeasurementsList = S.Array(LteNetworkMeasurements);
export class ListKeysResponseEntry extends S.Class<ListKeysResponseEntry>(
  "ListKeysResponseEntry",
)({
  KeyName: S.String,
  ExpireTime: S.Date.pipe(T.TimestampFormat("date-time")),
  Description: S.optional(S.String),
  Restrictions: ApiKeyRestrictions,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const ListKeysResponseEntryList = S.Array(ListKeysResponseEntry);
export class BatchDeleteGeofenceError extends S.Class<BatchDeleteGeofenceError>(
  "BatchDeleteGeofenceError",
)({ GeofenceId: S.String, Error: BatchItemError }) {}
export const BatchDeleteGeofenceErrorList = S.Array(BatchDeleteGeofenceError);
export class BatchPutGeofenceSuccess extends S.Class<BatchPutGeofenceSuccess>(
  "BatchPutGeofenceSuccess",
)({
  GeofenceId: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const BatchPutGeofenceSuccessList = S.Array(BatchPutGeofenceSuccess);
export class BatchPutGeofenceError extends S.Class<BatchPutGeofenceError>(
  "BatchPutGeofenceError",
)({ GeofenceId: S.String, Error: BatchItemError }) {}
export const BatchPutGeofenceErrorList = S.Array(BatchPutGeofenceError);
export class ForecastedEvent extends S.Class<ForecastedEvent>(
  "ForecastedEvent",
)({
  EventId: S.String,
  GeofenceId: S.String,
  IsDeviceInGeofence: S.Boolean,
  NearestDistance: S.Number,
  EventType: S.String,
  ForecastedBreachTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  GeofenceProperties: S.optional(PropertyMap),
}) {}
export const ForecastedEventsList = S.Array(ForecastedEvent);
export class RouteMatrixEntry extends S.Class<RouteMatrixEntry>(
  "RouteMatrixEntry",
)({
  Distance: S.optional(S.Number),
  DurationSeconds: S.optional(S.Number),
  Error: S.optional(RouteMatrixEntryError),
}) {}
export const RouteMatrixRow = S.Array(RouteMatrixEntry);
export const RouteMatrix = S.Array(RouteMatrixRow);
export class ListDevicePositionsResponseEntry extends S.Class<ListDevicePositionsResponseEntry>(
  "ListDevicePositionsResponseEntry",
)({
  DeviceId: S.String,
  SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
  Position: Position,
  Accuracy: S.optional(PositionalAccuracy),
  PositionProperties: S.optional(PositionPropertyMap),
}) {}
export const ListDevicePositionsResponseEntryList = S.Array(
  ListDevicePositionsResponseEntry,
);
export class LteCellDetails extends S.Class<LteCellDetails>("LteCellDetails")({
  CellId: S.Number,
  Mcc: S.Number,
  Mnc: S.Number,
  LocalId: S.optional(LteLocalId),
  NetworkMeasurements: S.optional(LteNetworkMeasurementsList),
  TimingAdvance: S.optional(S.Number),
  NrCapable: S.optional(S.Boolean),
  Rsrp: S.optional(S.Number),
  Rsrq: S.optional(S.Number),
  Tac: S.optional(S.Number),
}) {}
export const LteCellDetailsList = S.Array(LteCellDetails);
export class CreateKeyResponse extends S.Class<CreateKeyResponse>(
  "CreateKeyResponse",
)({
  Key: S.String,
  KeyArn: S.String,
  KeyName: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ListKeysResponse extends S.Class<ListKeysResponse>(
  "ListKeysResponse",
)({ Entries: ListKeysResponseEntryList, NextToken: S.optional(S.String) }) {}
export class BatchDeleteGeofenceResponse extends S.Class<BatchDeleteGeofenceResponse>(
  "BatchDeleteGeofenceResponse",
)({ Errors: BatchDeleteGeofenceErrorList }) {}
export class BatchPutGeofenceResponse extends S.Class<BatchPutGeofenceResponse>(
  "BatchPutGeofenceResponse",
)({
  Successes: BatchPutGeofenceSuccessList,
  Errors: BatchPutGeofenceErrorList,
}) {}
export class ForecastGeofenceEventsResponse extends S.Class<ForecastGeofenceEventsResponse>(
  "ForecastGeofenceEventsResponse",
)({
  ForecastedEvents: ForecastedEventsList,
  NextToken: S.optional(S.String),
  DistanceUnit: S.String,
  SpeedUnit: S.String,
}) {}
export class PutGeofenceResponse extends S.Class<PutGeofenceResponse>(
  "PutGeofenceResponse",
)({
  GeofenceId: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetPlaceResponse extends S.Class<GetPlaceResponse>(
  "GetPlaceResponse",
)({ Place: Place }) {}
export class CalculateRouteMatrixResponse extends S.Class<CalculateRouteMatrixResponse>(
  "CalculateRouteMatrixResponse",
)({
  RouteMatrix: RouteMatrix,
  SnappedDeparturePositions: S.optional(PositionList),
  SnappedDestinationPositions: S.optional(PositionList),
  Summary: CalculateRouteMatrixSummary,
}) {}
export class ListDevicePositionsResponse extends S.Class<ListDevicePositionsResponse>(
  "ListDevicePositionsResponse",
)({
  Entries: ListDevicePositionsResponseEntryList,
  NextToken: S.optional(S.String),
}) {}
export class CellSignals extends S.Class<CellSignals>("CellSignals")({
  LteCellDetails: LteCellDetailsList,
}) {}
export class BatchEvaluateGeofencesError extends S.Class<BatchEvaluateGeofencesError>(
  "BatchEvaluateGeofencesError",
)({
  DeviceId: S.String,
  SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
  Error: BatchItemError,
}) {}
export const BatchEvaluateGeofencesErrorList = S.Array(
  BatchEvaluateGeofencesError,
);
export class CalculateRouteSummary extends S.Class<CalculateRouteSummary>(
  "CalculateRouteSummary",
)({
  RouteBBox: BoundingBox,
  DataSource: S.String,
  Distance: S.Number,
  DurationSeconds: S.Number,
  DistanceUnit: S.String,
}) {}
export class DeviceState extends S.Class<DeviceState>("DeviceState")({
  DeviceId: S.String,
  SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
  Position: Position,
  Accuracy: S.optional(PositionalAccuracy),
  Ipv4Address: S.optional(S.String),
  WiFiAccessPoints: S.optional(WiFiAccessPointList),
  CellSignals: S.optional(CellSignals),
}) {}
export const LineString = S.Array(Position);
export class BatchEvaluateGeofencesResponse extends S.Class<BatchEvaluateGeofencesResponse>(
  "BatchEvaluateGeofencesResponse",
)({ Errors: BatchEvaluateGeofencesErrorList }) {}
export class VerifyDevicePositionRequest extends S.Class<VerifyDevicePositionRequest>(
  "VerifyDevicePositionRequest",
)(
  {
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    DeviceState: DeviceState,
    DistanceUnit: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/tracking/v0/trackers/{TrackerName}/positions/verify",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LegGeometry extends S.Class<LegGeometry>("LegGeometry")({
  LineString: S.optional(LineString),
}) {}
export class Step extends S.Class<Step>("Step")({
  StartPosition: Position,
  EndPosition: Position,
  Distance: S.Number,
  DurationSeconds: S.Number,
  GeometryOffset: S.optional(S.Number),
}) {}
export const StepList = S.Array(Step);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({
  Name: S.String.pipe(T.JsonName("name")),
  Message: S.String.pipe(T.JsonName("message")),
}) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class Leg extends S.Class<Leg>("Leg")({
  StartPosition: Position,
  EndPosition: Position,
  Distance: S.Number,
  DurationSeconds: S.Number,
  Geometry: S.optional(LegGeometry),
  Steps: StepList,
}) {}
export const LegList = S.Array(Leg);
export class CalculateRouteResponse extends S.Class<CalculateRouteResponse>(
  "CalculateRouteResponse",
)({ Legs: LegList, Summary: CalculateRouteSummary }) {}
export class InferredState extends S.Class<InferredState>("InferredState")({
  Position: S.optional(Position),
  Accuracy: S.optional(PositionalAccuracy),
  DeviationDistance: S.optional(S.Number),
  ProxyDetected: S.Boolean,
}) {}
export class VerifyDevicePositionResponse extends S.Class<VerifyDevicePositionResponse>(
  "VerifyDevicePositionResponse",
)({
  InferredState: InferredState,
  DeviceId: S.String,
  SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
  ReceivedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  DistanceUnit: S.String,
}) {}

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
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String.pipe(T.JsonName("message")) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
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
 * Lists geofence collections in your Amazon Web Services account.
 */
export const listGeofenceCollections =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListGeofenceCollectionsRequest,
    output: ListGeofenceCollectionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Entries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to `CalculateRoutes` or `CalculateIsolines` unless you require Grab data.
 *
 * - `CalculateRoute` is part of a previous Amazon Location Service Routes API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The version 2 `CalculateRoutes` operation gives better results for point-to-point routing, while the version 2 `CalculateIsolines` operation adds support for calculating service areas and travel time envelopes.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Routes API version 2 is found under `geo-routes` or `geo_routes`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Routes API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * Calculates a route given the following required parameters: `DeparturePosition` and `DestinationPosition`. Requires that you first create a route calculator resource.
 *
 * By default, a request that doesn't specify a departure time uses the best time of day to travel with the best traffic conditions when calculating the route.
 *
 * Additional options include:
 *
 * - Specifying a departure time using either `DepartureTime` or `DepartNow`. This calculates a route based on predictive traffic data at the given time.
 *
 * You can't specify both `DepartureTime` and `DepartNow` in a single request. Specifying both parameters returns a validation error.
 *
 * - Specifying a travel mode using TravelMode sets the transportation mode used to calculate the routes. This also lets you specify additional route preferences in `CarModeOptions` if traveling by `Car`, or `TruckModeOptions` if traveling by `Truck`.
 *
 * If you specify `walking` for the travel mode and your data provider is Esri, the start and destination must be within 40km.
 */
export const calculateRoute = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CalculateRouteRequest,
  output: CalculateRouteResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a batch of geofences from a geofence collection.
 *
 * This operation deletes the resource permanently.
 */
export const batchDeleteGeofence = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteGeofenceRequest,
  output: BatchDeleteGeofenceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * A batch request for storing geofence geometries into a given geofence collection, or updates the geometry of an existing geofence if a geofence ID is included in the request.
 */
export const batchPutGeofence = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchPutGeofenceRequest,
  output: BatchPutGeofenceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This action forecasts future geofence events that are likely to occur within a specified time horizon if a device continues moving at its current speed. Each forecasted event is associated with a geofence from a provided geofence collection. A forecast event can have one of the following states:
 *
 * `ENTER`: The device position is outside the referenced geofence, but the device may cross into the geofence during the forecasting time horizon if it maintains its current speed.
 *
 * `EXIT`: The device position is inside the referenced geofence, but the device may leave the geofence during the forecasted time horizon if the device maintains it's current speed.
 *
 * `IDLE`:The device is inside the geofence, and it will remain inside the geofence through the end of the time horizon if the device maintains it's current speed.
 *
 * Heading direction is not considered in the current version. The API takes a conservative approach and includes events that can occur for any heading.
 */
export const forecastGeofenceEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ForecastGeofenceEventsRequest,
    output: ForecastGeofenceEventsResponse,
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
      items: "ForecastedEvents",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Stores a geofence geometry in a given geofence collection, or updates the geometry of an existing geofence if a geofence ID is included in the request.
 */
export const putGeofence = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutGeofenceRequest,
  output: PutGeofenceResponse,
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
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the V2 `GetPlace` operation unless you require Grab data.
 *
 * - This version of `GetPlace` is part of a previous Amazon Location Service Places API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - Version 2 of the `GetPlace` operation interoperates with the rest of the Places V2 API, while this version does not.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Places API version 2 is found under `geo-places` or `geo_places`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Places API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Places V2 API Reference or the Developer Guide.
 *
 * Finds a place by its unique ID. A `PlaceId` is returned by other search operations.
 *
 * A PlaceId is valid only if all of the following are the same in the original search request and the call to `GetPlace`.
 *
 * - Customer Amazon Web Services account
 *
 * - Amazon Web Services Region
 *
 * - Data provider specified in the place index resource
 *
 * If your Place index resource is configured with Grab as your geolocation provider and Storage as Intended use, the GetPlace operation is unavailable. For more information, see AWS service terms.
 */
export const getPlace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPlaceRequest,
  output: GetPlaceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the V2 `CalculateRouteMatrix` unless you require Grab data.
 *
 * - This version of `CalculateRouteMatrix` is part of a previous Amazon Location Service Routes API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The version 2 `CalculateRouteMatrix` operation gives better results for matrix routing calculations.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Routes API version 2 is found under `geo-routes` or `geo_routes`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Routes API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Routes V2 API Reference or the Developer Guide.
 *
 * Calculates a route matrix given the following required parameters: `DeparturePositions` and `DestinationPositions`. `CalculateRouteMatrix` calculates routes and returns the travel time and travel distance from each departure position to each destination position in the request. For example, given departure positions A and B, and destination positions X and Y, `CalculateRouteMatrix` will return time and distance for routes from A to X, A to Y, B to X, and B to Y (in that order). The number of results returned (and routes calculated) will be the number of `DeparturePositions` times the number of `DestinationPositions`.
 *
 * Your account is charged for each route calculated, not the number of requests.
 *
 * Requires that you first create a route calculator resource.
 *
 * By default, a request that doesn't specify a departure time uses the best time of day to travel with the best traffic conditions when calculating routes.
 *
 * Additional options include:
 *
 * - Specifying a departure time using either `DepartureTime` or `DepartNow`. This calculates routes based on predictive traffic data at the given time.
 *
 * You can't specify both `DepartureTime` and `DepartNow` in a single request. Specifying both parameters returns a validation error.
 *
 * - Specifying a travel mode using TravelMode sets the transportation mode used to calculate the routes. This also lets you specify additional route preferences in `CarModeOptions` if traveling by `Car`, or `TruckModeOptions` if traveling by `Truck`.
 */
export const calculateRouteMatrix = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CalculateRouteMatrixRequest,
    output: CalculateRouteMatrixResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * A batch request to retrieve all device positions.
 */
export const listDevicePositions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDevicePositionsRequest,
    output: ListDevicePositionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Entries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists geofences stored in a given geofence collection.
 */
export const listGeofences = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListGeofencesRequest,
    output: ListGeofencesResponse,
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
      items: "Entries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This operation is no longer current and may be deprecated in the future. We recommend upgrading to the Maps API V2 unless you require `Grab` data.
 *
 * - `UpdateMap` is part of a previous Amazon Location Service Maps API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Maps API version 2 has a simplified interface that can be used without creating or managing map resources.
 *
 * - If you are using an AWS SDK or the AWS CLI, note that the Maps API version 2 is found under `geo-maps` or `geo_maps`, not under `location`.
 *
 * - Since `Grab` is not yet fully supported in Maps API version 2, we recommend you continue using API version 1 when using `Grab`.
 *
 * - Start your version 2 API journey with the Maps V2 API Reference or the Developer Guide.
 *
 * Updates the specified properties of a given map resource.
 */
export const updateMap = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMapRequest,
  output: UpdateMapResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to `ReverseGeocode` or `SearchNearby` unless you require Grab data.
 *
 * - `SearchPlaceIndexForPosition` is part of a previous Amazon Location Service Places API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The version 2 `ReverseGeocode` operation gives better results in the address reverse-geocoding use case, while the version 2 `SearchNearby` operation gives better results when searching for businesses and points of interest near a specific location.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Places API version 2 is found under `geo-places` or `geo_places`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Places API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * Reverse geocodes a given coordinate and returns a legible address. Allows you to search for Places or points of interest near a given position.
 */
export const searchPlaceIndexForPosition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchPlaceIndexForPositionRequest,
    output: SearchPlaceIndexForPositionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to `Suggest` or `Autocomplete` unless you require Grab data.
 *
 * - `SearchPlaceIndexForSuggestions` is part of a previous Amazon Location Service Places API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The version 2 `Suggest` operation gives better results for typeahead place search suggestions with fuzzy matching, while the version 2 `Autocomplete` operation gives better results for address completion based on partial input.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Places API version 2 is found under `geo-places` or `geo_places`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Places API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * Generates suggestions for addresses and points of interest based on partial or misspelled free-form text. This operation is also known as autocomplete, autosuggest, or fuzzy matching.
 *
 * Optional parameters let you narrow your search results by bounding box or country, or bias your search toward a specific position on the globe.
 *
 * You can search for suggested place names near a specified position by using `BiasPosition`, or filter results within a bounding box by using `FilterBBox`. These parameters are mutually exclusive; using both `BiasPosition` and `FilterBBox` in the same command returns an error.
 */
export const searchPlaceIndexForSuggestions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SearchPlaceIndexForSuggestionsRequest,
    output: SearchPlaceIndexForSuggestionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to `Geocode` or `SearchText` unless you require Grab data.
 *
 * - `SearchPlaceIndexForText` is part of a previous Amazon Location Service Places API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The version 2 `Geocode` operation gives better results in the address geocoding use case, while the version 2 `SearchText` operation gives better results when searching for businesses and points of interest.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Places API version 2 is found under `geo-places` or `geo_places`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Places API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * Geocodes free-form text, such as an address, name, city, or region to allow you to search for Places or points of interest.
 *
 * Optional parameters let you narrow your search results by bounding box or country, or bias your search toward a specific position on the globe.
 *
 * You can search for places near a given position using `BiasPosition`, or filter results within a bounding box using `FilterBBox`. Providing both parameters simultaneously returns an error.
 *
 * Search results are returned in order of highest to lowest relevance.
 */
export const searchPlaceIndexForText = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchPlaceIndexForTextRequest,
    output: SearchPlaceIndexForTextResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the position history of one or more devices from a tracker resource.
 */
export const batchDeleteDevicePositionHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchDeleteDevicePositionHistoryRequest,
    output: BatchDeleteDevicePositionHistoryResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Lists the latest device positions for requested devices.
 */
export const batchGetDevicePosition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetDevicePositionRequest,
    output: BatchGetDevicePositionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Uploads position update data for one or more devices to a tracker resource (up to 10 devices per batch). Amazon Location uses the data when it reports the last known device position and position history. Amazon Location retains location data for 30 days.
 *
 * Position updates are handled based on the `PositionFiltering` property of the tracker. When `PositionFiltering` is set to `TimeBased`, updates are evaluated against linked geofence collections, and location data is stored at a maximum of one position per 30 second interval. If your update frequency is more often than every 30 seconds, only one update per 30 seconds is stored for each unique device ID.
 *
 * When `PositionFiltering` is set to `DistanceBased` filtering, location data is stored and evaluated against linked geofence collections only if the device has moved more than 30 m (98.4 ft).
 *
 * When `PositionFiltering` is set to `AccuracyBased` filtering, location data is stored and evaluated against linked geofence collections only if the device has moved more than the measured accuracy. For example, if two consecutive updates from a device have a horizontal accuracy of 5 m and 10 m, the second update is neither stored or evaluated if the device has moved less than 15 m. If `PositionFiltering` is set to `AccuracyBased` filtering, Amazon Location uses the default value `{ "Horizontal": 0}` when accuracy is not provided on a `DevicePositionUpdate`.
 */
export const batchUpdateDevicePosition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchUpdateDevicePositionRequest,
    output: BatchUpdateDevicePositionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of tags that are applied to the specified Amazon Location resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the geofence collection details.
 */
export const describeGeofenceCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGeofenceCollectionRequest,
    output: DescribeGeofenceCollectionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the specified properties of a given geofence collection.
 */
export const updateGeofenceCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateGeofenceCollectionRequest,
    output: UpdateGeofenceCollectionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the geofence details from a geofence collection.
 *
 * The returned geometry will always match the geometry format used when the geofence was created.
 */
export const getGeofence = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGeofenceRequest,
  output: GetGeofenceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend upgrading to the Maps API V2 unless you require `Grab` data.
 *
 * - `DescribeMap` is part of a previous Amazon Location Service Maps API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Maps API version 2 has a simplified interface that can be used without creating or managing map resources.
 *
 * - If you are using an AWS SDK or the AWS CLI, note that the Maps API version 2 is found under `geo-maps` or `geo_maps`, not under `location`.
 *
 * - Since `Grab` is not yet fully supported in Maps API version 2, we recommend you continue using API version 1 when using `Grab`.
 *
 * - Start your version 2 API journey with the Maps V2 API Reference or the Developer Guide.
 *
 * Retrieves the map resource details.
 */
export const describeMap = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMapRequest,
  output: DescribeMapResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend upgrading to `GetGlyphs` unless you require `Grab` data.
 *
 * - `GetMapGlyphs` is part of a previous Amazon Location Service Maps API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The version 2 `GetGlyphs` operation gives a better user experience and is compatible with the remainder of the V2 Maps API.
 *
 * - If you are using an AWS SDK or the AWS CLI, note that the Maps API version 2 is found under `geo-maps` or `geo_maps`, not under `location`.
 *
 * - Since `Grab` is not yet fully supported in Maps API version 2, we recommend you continue using API version 1 when using `Grab`.
 *
 * - Start your version 2 API journey with the Maps V2 API Reference or the Developer Guide.
 *
 * Retrieves glyphs used to display labels on a map.
 */
export const getMapGlyphs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMapGlyphsRequest,
  output: GetMapGlyphsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend upgrading to `GetSprites` unless you require `Grab` data.
 *
 * - `GetMapSprites` is part of a previous Amazon Location Service Maps API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The version 2 `GetSprites` operation gives a better user experience and is compatible with the remainder of the V2 Maps API.
 *
 * - If you are using an AWS SDK or the AWS CLI, note that the Maps API version 2 is found under `geo-maps` or `geo_maps`, not under `location`.
 *
 * - Since `Grab` is not yet fully supported in Maps API version 2, we recommend you continue using API version 1 when using `Grab`.
 *
 * - Start your version 2 API journey with the Maps V2 API Reference or the Developer Guide.
 *
 * Retrieves the sprite sheet corresponding to a map resource. The sprite sheet is a PNG image paired with a JSON document describing the offsets of individual icons that will be displayed on a rendered map.
 */
export const getMapSprites = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMapSpritesRequest,
  output: GetMapSpritesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend upgrading to `GetStyleDescriptor` unless you require `Grab` data.
 *
 * - `GetMapStyleDescriptor` is part of a previous Amazon Location Service Maps API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The version 2 `GetStyleDescriptor` operation gives a better user experience and is compatible with the remainder of the V2 Maps API.
 *
 * - If you are using an AWS SDK or the AWS CLI, note that the Maps API version 2 is found under `geo-maps` or `geo_maps`, not under `location`.
 *
 * - Since `Grab` is not yet fully supported in Maps API version 2, we recommend you continue using API version 1 when using `Grab`.
 *
 * - Start your version 2 API journey with the Maps V2 API Reference or the Developer Guide.
 *
 * Retrieves the map style descriptor from a map resource.
 *
 * The style descriptor contains speciﬁcations on how features render on a map. For example, what data to display, what order to display the data in, and the style for the data. Style descriptors follow the Mapbox Style Specification.
 */
export const getMapStyleDescriptor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMapStyleDescriptorRequest,
    output: GetMapStyleDescriptorResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * This operation is no longer current and may be deprecated in the future. We recommend upgrading to `GetTile` unless you require `Grab` data.
 *
 * - `GetMapTile` is part of a previous Amazon Location Service Maps API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The version 2 `GetTile` operation gives a better user experience and is compatible with the remainder of the V2 Maps API.
 *
 * - If you are using an AWS SDK or the AWS CLI, note that the Maps API version 2 is found under `geo-maps` or `geo_maps`, not under `location`.
 *
 * - Since `Grab` is not yet fully supported in Maps API version 2, we recommend you continue using API version 1 when using `Grab`.
 *
 * - Start your version 2 API journey with the Maps V2 API Reference or the Developer Guide.
 *
 * Retrieves a vector data tile from the map resource. Map tiles are used by clients to render a map. they're addressed using a grid arrangement with an X coordinate, Y coordinate, and Z (zoom) level.
 *
 * The origin (0, 0) is the top left of the map. Increasing the zoom level by 1 doubles both the X and Y dimensions, so a tile containing data for the entire world at (0/0/0) will be split into 4 tiles at zoom 1 (1/0/0, 1/0/1, 1/1/0, 1/1/1).
 */
export const getMapTile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMapTileRequest,
  output: GetMapTileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the Places API V2 unless you require Grab data.
 *
 * - `DescribePlaceIndex` is part of a previous Amazon Location Service Places API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Places API version 2 has a simplified interface that can be used without creating or managing place index resources.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Places API version 2 is found under `geo-places` or `geo_places`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Places API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Places V2 API Reference or the Developer Guide.
 *
 * Retrieves the place index resource details.
 */
export const describePlaceIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePlaceIndexRequest,
  output: DescribePlaceIndexResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the Places API V2 unless you require Grab data.
 *
 * - `UpdatePlaceIndex` is part of a previous Amazon Location Service Places API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Places API version 2 has a simplified interface that can be used without creating or managing place index resources.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Places API version 2 is found under `geo-places` or `geo_places`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Places API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Places V2 API Reference or the Developer Guide.
 *
 * Updates the specified properties of a given place index resource.
 */
export const updatePlaceIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePlaceIndexRequest,
  output: UpdatePlaceIndexResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the Routes API V2 unless you require Grab data.
 *
 * - `DescribeRouteCalculator` is part of a previous Amazon Location Service Routes API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Routes API version 2 has a simplified interface that can be used without creating or managing route calculator resources.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Routes API version 2 is found under `geo-routes` or `geo_routes`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Routes API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Routes V2 API Reference or the Developer Guide.
 *
 * Retrieves the route calculator resource details.
 */
export const describeRouteCalculator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeRouteCalculatorRequest,
    output: DescribeRouteCalculatorResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the Routes API V2 unless you require Grab data.
 *
 * - `UpdateRouteCalculator` is part of a previous Amazon Location Service Routes API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Routes API version 2 has a simplified interface that can be used without creating or managing route calculator resources.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Routes API version 2 is found under `geo-routes` or `geo_routes`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Routes API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Routes V2 API Reference or the Developer Guide.
 *
 * Updates the specified properties for a given route calculator resource.
 */
export const updateRouteCalculator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRouteCalculatorRequest,
    output: UpdateRouteCalculatorResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the tracker resource details.
 */
export const describeTracker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTrackerRequest,
  output: DescribeTrackerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the specified properties of a given tracker resource.
 */
export const updateTracker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrackerRequest,
  output: UpdateTrackerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a device's most recent position according to its sample time.
 *
 * Device positions are deleted after 30 days.
 */
export const getDevicePosition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDevicePositionRequest,
  output: GetDevicePositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the device position history from a tracker resource within a specified range of time.
 *
 * Device positions are deleted after 30 days.
 */
export const getDevicePositionHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: GetDevicePositionHistoryRequest,
    output: GetDevicePositionHistoryResponse,
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
      items: "DevicePositions",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists geofence collections currently associated to the given tracker resource.
 */
export const listTrackerConsumers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTrackerConsumersRequest,
    output: ListTrackerConsumersResponse,
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
      items: "ConsumerArns",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Assigns one or more tags (key-value pairs) to the specified Amazon Location Service resource.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values.
 *
 * You can use the `TagResource` operation with an Amazon Location Service resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the tags already associated with the resource. If you specify a tag key that's already associated with the resource, the new tag value that you specify replaces the previous value for that tag.
 *
 * You can associate up to 50 tags with a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes one or more tags from the specified Amazon Location resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a geofence collection from your Amazon Web Services account.
 *
 * This operation deletes the resource permanently. If the geofence collection is the target of a tracker resource, the devices will no longer be monitored.
 */
export const deleteGeofenceCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteGeofenceCollectionRequest,
    output: DeleteGeofenceCollectionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * This operation is no longer current and may be deprecated in the future. We recommend upgrading to the Maps API V2 unless you require `Grab` data.
 *
 * - `DeleteMap` is part of a previous Amazon Location Service Maps API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Maps API version 2 has a simplified interface that can be used without creating or managing map resources.
 *
 * - If you are using an AWS SDK or the AWS CLI, note that the Maps API version 2 is found under `geo-maps` or `geo_maps`, not under `location`.
 *
 * - Since `Grab` is not yet fully supported in Maps API version 2, we recommend you continue using API version 1 when using `Grab`.
 *
 * - Start your version 2 API journey with the Maps V2 API Reference or the Developer Guide.
 *
 * Deletes a map resource from your Amazon Web Services account.
 *
 * This operation deletes the resource permanently. If the map is being used in an application, the map may not render.
 */
export const deleteMap = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMapRequest,
  output: DeleteMapResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the Places API V2 unless you require Grab data.
 *
 * - `DeletePlaceIndex` is part of a previous Amazon Location Service Places API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Places API version 2 has a simplified interface that can be used without creating or managing place index resources.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Places API version 2 is found under `geo-places` or `geo_places`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Places API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Places V2 API Reference or the Developer Guide.
 *
 * Deletes a place index resource from your Amazon Web Services account.
 *
 * This operation deletes the resource permanently.
 */
export const deletePlaceIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePlaceIndexRequest,
  output: DeletePlaceIndexResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the Routes API V2 unless you require Grab data.
 *
 * - `DeleteRouteCalculator` is part of a previous Amazon Location Service Routes API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Routes API version 2 has a simplified interface that can be used without creating or managing route calculator resources.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Routes API version 2 is found under `geo-routes` or `geo_routes`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Routes API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Routes V2 API Reference or the Developer Guide.
 *
 * Deletes a route calculator resource from your Amazon Web Services account.
 *
 * This operation deletes the resource permanently.
 */
export const deleteRouteCalculator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRouteCalculatorRequest,
    output: DeleteRouteCalculatorResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a tracker resource from your Amazon Web Services account.
 *
 * This operation deletes the resource permanently. If the tracker resource is in use, you may encounter an error. Make sure that the target resource isn't a dependency for your applications.
 */
export const deleteTracker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrackerRequest,
  output: DeleteTrackerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the association between a tracker resource and a geofence collection.
 *
 * Once you unlink a tracker resource from a geofence collection, the tracker positions will no longer be automatically evaluated against geofences.
 */
export const disassociateTrackerConsumer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateTrackerConsumerRequest,
    output: DisassociateTrackerConsumerResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the API key resource details.
 *
 * For more information, see Use API keys to authenticate in the *Amazon Location Service Developer Guide*.
 */
export const describeKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeKeyRequest,
  output: DescribeKeyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the specified properties of a given API key resource.
 */
export const updateKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateKeyRequest,
  output: UpdateKeyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an association between a geofence collection and a tracker resource. This allows the tracker resource to communicate location data to the linked geofence collection.
 *
 * You can associate up to five geofence collections to each tracker resource.
 *
 * Currently not supported — Cross-account configurations, such as creating associations between a tracker resource in one account and a geofence collection in another account.
 */
export const associateTrackerConsumer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateTrackerConsumerRequest,
    output: AssociateTrackerConsumerResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * This operation is no longer current and may be deprecated in the future. We recommend upgrading to the Maps API V2 unless you require `Grab` data.
 *
 * - `CreateMap` is part of a previous Amazon Location Service Maps API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Maps API version 2 has a simplified interface that can be used without creating or managing map resources.
 *
 * - If you are using an AWS SDK or the AWS CLI, note that the Maps API version 2 is found under `geo-maps` or `geo_maps`, not under `location`.
 *
 * - Since `Grab` is not yet fully supported in Maps API version 2, we recommend you continue using API version 1 when using `Grab`.
 *
 * - Start your version 2 API journey with the Maps V2 API Reference or the Developer Guide.
 *
 * Creates a map resource in your Amazon Web Services account, which provides map tiles of different styles sourced from global location data providers.
 *
 * If your application is tracking or routing assets you use in your business, such as delivery vehicles or employees, you must not use Esri as your geolocation provider. See section 82 of the Amazon Web Services service terms for more details.
 */
export const createMap = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMapRequest,
  output: CreateMapResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the Places API V2 unless you require Grab data.
 *
 * - `CreatePlaceIndex` is part of a previous Amazon Location Service Places API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Places API version 2 has a simplified interface that can be used without creating or managing place index resources.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Places API version 2 is found under `geo-places` or `geo_places`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Places API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Places V2 API Reference or the Developer Guide.
 *
 * Creates a place index resource in your Amazon Web Services account. Use a place index resource to geocode addresses and other text queries by using the `SearchPlaceIndexForText` operation, and reverse geocode coordinates by using the `SearchPlaceIndexForPosition` operation, and enable autosuggestions by using the `SearchPlaceIndexForSuggestions` operation.
 *
 * If your application is tracking or routing assets you use in your business, such as delivery vehicles or employees, you must not use Esri as your geolocation provider. See section 82 of the Amazon Web Services service terms for more details.
 */
export const createPlaceIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePlaceIndexRequest,
  output: CreatePlaceIndexResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the Routes API V2 unless you require Grab data.
 *
 * - `CreateRouteCalculator` is part of a previous Amazon Location Service Routes API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Routes API version 2 has a simplified interface that can be used without creating or managing route calculator resources.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Routes API version 2 is found under `geo-routes` or `geo_routes`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Routes API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Routes V2 API Reference or the Developer Guide.
 *
 * Creates a route calculator resource in your Amazon Web Services account.
 *
 * You can send requests to a route calculator resource to estimate travel time, distance, and get directions. A route calculator sources traffic and road network data from your chosen data provider.
 *
 * If your application is tracking or routing assets you use in your business, such as delivery vehicles or employees, you must not use Esri as your geolocation provider. See section 82 of the Amazon Web Services service terms for more details.
 */
export const createRouteCalculator = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRouteCalculatorRequest,
    output: CreateRouteCalculatorResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a tracker resource in your Amazon Web Services account, which lets you retrieve current and historical location of devices.
 */
export const createTracker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrackerRequest,
  output: CreateTrackerResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an API key resource in your Amazon Web Services account, which lets you grant actions for Amazon Location resources to the API key bearer.
 *
 * For more information, see Use API keys to authenticate in the *Amazon Location Service Developer Guide*.
 */
export const createKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateKeyRequest,
  output: CreateKeyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend upgrading to the Maps API V2 unless you require `Grab` data.
 *
 * - `ListMaps` is part of a previous Amazon Location Service Maps API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Maps API version 2 has a simplified interface that can be used without creating or managing map resources.
 *
 * - If you are using an AWS SDK or the AWS CLI, note that the Maps API version 2 is found under `geo-maps` or `geo_maps`, not under `location`.
 *
 * - Since `Grab` is not yet fully supported in Maps API version 2, we recommend you continue using API version 1 when using `Grab`.
 *
 * - Start your version 2 API journey with the Maps V2 API Reference or the Developer Guide.
 *
 * Lists map resources in your Amazon Web Services account.
 */
export const listMaps = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMapsRequest,
  output: ListMapsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Entries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the Places API V2 unless you require Grab data.
 *
 * - `ListPlaceIndexes` is part of a previous Amazon Location Service Places API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Places API version 2 has a simplified interface that can be used without creating or managing place index resources.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Places API version 2 is found under `geo-places` or `geo_places`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Places API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Places V2 API Reference or the Developer Guide.
 *
 * Lists place index resources in your Amazon Web Services account.
 */
export const listPlaceIndexes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPlaceIndexesRequest,
    output: ListPlaceIndexesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Entries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * This operation is no longer current and may be deprecated in the future. We recommend you upgrade to the Routes API V2 unless you require Grab data.
 *
 * - `ListRouteCalculators` is part of a previous Amazon Location Service Routes API (version 1) which has been superseded by a more intuitive, powerful, and complete API (version 2).
 *
 * - The Routes API version 2 has a simplified interface that can be used without creating or managing route calculator resources.
 *
 * - If you are using an Amazon Web Services SDK or the Amazon Web Services CLI, note that the Routes API version 2 is found under `geo-routes` or `geo_routes`, not under `location`.
 *
 * - Since Grab is not yet fully supported in Routes API version 2, we recommend you continue using API version 1 when using Grab.
 *
 * - Start your version 2 API journey with the Routes V2 API Reference or the Developer Guide.
 *
 * Lists route calculator resources in your Amazon Web Services account.
 */
export const listRouteCalculators =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRouteCalculatorsRequest,
    output: ListRouteCalculatorsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Entries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists tracker resources in your Amazon Web Services account.
 */
export const listTrackers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTrackersRequest,
    output: ListTrackersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Entries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Deletes the specified API key. The API key must have been deactivated more than 90 days previously.
 *
 * For more information, see Use API keys to authenticate in the *Amazon Location Service Developer Guide*.
 */
export const deleteKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteKeyRequest,
  output: DeleteKeyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists API key resources in your Amazon Web Services account.
 *
 * For more information, see Use API keys to authenticate in the *Amazon Location Service Developer Guide*.
 */
export const listKeys = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListKeysRequest,
  output: ListKeysResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Entries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a geofence collection, which manages and stores geofences.
 */
export const createGeofenceCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateGeofenceCollectionRequest,
    output: CreateGeofenceCollectionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Evaluates device positions against the geofence geometries from a given geofence collection.
 *
 * This operation always returns an empty response because geofences are asynchronously evaluated. The evaluation determines if the device has entered or exited a geofenced area, and then publishes one of the following events to Amazon EventBridge:
 *
 * - `ENTER` if Amazon Location determines that the tracked device has entered a geofenced area.
 *
 * - `EXIT` if Amazon Location determines that the tracked device has exited a geofenced area.
 *
 * The last geofence that a device was observed within is tracked for 30 days after the most recent device position update.
 *
 * Geofence evaluation uses the given device position. It does not account for the optional `Accuracy` of a `DevicePositionUpdate`.
 *
 * The `DeviceID` is used as a string to represent the device. You do not need to have a `Tracker` associated with the `DeviceID`.
 */
export const batchEvaluateGeofences = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchEvaluateGeofencesRequest,
    output: BatchEvaluateGeofencesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Verifies the integrity of the device's position by determining if it was reported behind a proxy, and by comparing it to an inferred position estimated based on the device's state.
 *
 * The Location Integrity SDK provides enhanced features related to device verification, and it is available for use by request. To get access to the SDK, contact Sales Support.
 */
export const verifyDevicePosition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: VerifyDevicePositionRequest,
    output: VerifyDevicePositionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);

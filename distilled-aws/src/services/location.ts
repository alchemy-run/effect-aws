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
  sdkId: "Location",
  serviceShapeName: "LocationService",
});
const auth = T.AwsAuthSigv4({ name: "geo" });
const ver = T.ServiceVersion("2020-11-19");
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
              `https://geo-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://geo-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://geo.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://geo.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceName = string;
export type ResourceDescription = string;
export type Token = string;
export type Arn = string;
export type PricingPlan = string;
export type KmsKeyId = string;
export type Id = string;
export type DistanceUnit = string;
export type SpeedUnit = string;
export type LargeToken = string;
export type ApiKey = string | redacted.Redacted<string>;
export type SensitiveString = string | redacted.Redacted<string>;
export type PlaceId = string | redacted.Redacted<string>;
export type LanguageTag = string;
export type PlaceIndexSearchResultLimit = number;
export type CountryCode3 = string | redacted.Redacted<string>;
export type PlaceCategory = string | redacted.Redacted<string>;
export type TravelMode = string;
export type SensitiveBoolean = boolean;
export type OptimizationMode = string;
export type PositionFiltering = string;
export type ApiKeyAction = string;
export type GeoArnV2 = string;
export type RefererPattern = string | redacted.Redacted<string>;
export type TagKey = string;
export type TagValue = string;
export type Status = string;
export type Base64EncodedGeobuf = Uint8Array | redacted.Redacted<Uint8Array>;
export type MapStyle = string;
export type CustomLayer = string;
export type CountryCode3OrEmpty = string | redacted.Redacted<string>;
export type IntendedUse = string;
export type GeoArn = string;
export type AndroidPackageName = string;
export type Sha1CertificateFingerprint = string;
export type AppleBundleId = string;
export type SensitiveDouble = number;
export type DimensionUnit = string;
export type VehicleWeightUnit = string;
export type PlaceSupplementalCategory = string | redacted.Redacted<string>;
export type EutranCellId = number;
export type Rsrp = number;
export type Rsrq = number;
export type BatchItemErrorCode = string;
export type SensitiveInteger = number;
export type RouteMatrixErrorCode = string;
export type Earfcn = number;
export type Pci = number;
export type Uuid = string;
export type NearestDistance = number;
export type ForecastedGeofenceEventType = string;
export type ValidationExceptionReason = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type IdList = string[];
export const IdList = S.Array(S.String);
export type Position = number[];
export const Position = S.Array(S.Number);
export type BoundingBox = number[];
export const BoundingBox = S.Array(S.Number);
export type CountryCodeList = string | redacted.Redacted<string>[];
export const CountryCodeList = S.Array(SensitiveString);
export type FilterPlaceCategoryList = string | redacted.Redacted<string>[];
export const FilterPlaceCategoryList = S.Array(SensitiveString);
export type WaypointPositionList = number[][];
export const WaypointPositionList = S.Array(Position);
export type PositionList = number[][];
export const PositionList = S.Array(Position);
export type DeviceIdsList = string[];
export const DeviceIdsList = S.Array(S.String);
export interface DescribeKeyRequest {
  KeyName: string;
}
export const DescribeKeyRequest = S.suspend(() =>
  S.Struct({ KeyName: S.String.pipe(T.HttpLabel("KeyName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/metadata/v0/keys/{KeyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeKeyRequest",
}) as any as S.Schema<DescribeKeyRequest>;
export type ApiKeyActionList = string[];
export const ApiKeyActionList = S.Array(S.String);
export type GeoArnList = string[];
export const GeoArnList = S.Array(S.String);
export type RefererPatternList = string | redacted.Redacted<string>[];
export const RefererPatternList = S.Array(SensitiveString);
export interface AndroidApp {
  Package: string;
  CertificateFingerprint: string;
}
export const AndroidApp = S.suspend(() =>
  S.Struct({ Package: S.String, CertificateFingerprint: S.String }),
).annotations({ identifier: "AndroidApp" }) as any as S.Schema<AndroidApp>;
export type AndroidAppList = AndroidApp[];
export const AndroidAppList = S.Array(AndroidApp);
export interface AppleApp {
  BundleId: string;
}
export const AppleApp = S.suspend(() =>
  S.Struct({ BundleId: S.String }),
).annotations({ identifier: "AppleApp" }) as any as S.Schema<AppleApp>;
export type AppleAppList = AppleApp[];
export const AppleAppList = S.Array(AppleApp);
export interface ApiKeyRestrictions {
  AllowActions: string[];
  AllowResources: string[];
  AllowReferers?: string | redacted.Redacted<string>[];
  AllowAndroidApps?: AndroidApp[];
  AllowAppleApps?: AppleApp[];
}
export const ApiKeyRestrictions = S.suspend(() =>
  S.Struct({
    AllowActions: ApiKeyActionList,
    AllowResources: GeoArnList,
    AllowReferers: S.optional(RefererPatternList),
    AllowAndroidApps: S.optional(AndroidAppList),
    AllowAppleApps: S.optional(AppleAppList),
  }),
).annotations({
  identifier: "ApiKeyRestrictions",
}) as any as S.Schema<ApiKeyRestrictions>;
export interface UpdateKeyRequest {
  KeyName: string;
  Description?: string;
  ExpireTime?: Date;
  NoExpiry?: boolean;
  ForceUpdate?: boolean;
  Restrictions?: ApiKeyRestrictions;
}
export const UpdateKeyRequest = S.suspend(() =>
  S.Struct({
    KeyName: S.String.pipe(T.HttpLabel("KeyName")),
    Description: S.optional(S.String),
    ExpireTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NoExpiry: S.optional(S.Boolean),
    ForceUpdate: S.optional(S.Boolean),
    Restrictions: S.optional(ApiKeyRestrictions),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/metadata/v0/keys/{KeyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateKeyRequest",
}) as any as S.Schema<UpdateKeyRequest>;
export interface DeleteKeyRequest {
  KeyName: string;
  ForceDelete?: boolean;
}
export const DeleteKeyRequest = S.suspend(() =>
  S.Struct({
    KeyName: S.String.pipe(T.HttpLabel("KeyName")),
    ForceDelete: S.optional(S.Boolean).pipe(T.HttpQuery("forceDelete")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/metadata/v0/keys/{KeyName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteKeyRequest",
}) as any as S.Schema<DeleteKeyRequest>;
export interface DeleteKeyResponse {}
export const DeleteKeyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteKeyResponse",
}) as any as S.Schema<DeleteKeyResponse>;
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
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap,
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
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export interface CreateGeofenceCollectionRequest {
  CollectionName: string;
  PricingPlan?: string;
  PricingPlanDataSource?: string;
  Description?: string;
  Tags?: { [key: string]: string | undefined };
  KmsKeyId?: string;
}
export const CreateGeofenceCollectionRequest = S.suspend(() =>
  S.Struct({
    CollectionName: S.String,
    PricingPlan: S.optional(S.String),
    PricingPlanDataSource: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
    KmsKeyId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/geofencing/v0/collections" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGeofenceCollectionRequest",
}) as any as S.Schema<CreateGeofenceCollectionRequest>;
export interface DescribeGeofenceCollectionRequest {
  CollectionName: string;
}
export const DescribeGeofenceCollectionRequest = S.suspend(() =>
  S.Struct({
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeGeofenceCollectionRequest",
}) as any as S.Schema<DescribeGeofenceCollectionRequest>;
export interface UpdateGeofenceCollectionRequest {
  CollectionName: string;
  PricingPlan?: string;
  PricingPlanDataSource?: string;
  Description?: string;
}
export const UpdateGeofenceCollectionRequest = S.suspend(() =>
  S.Struct({
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    PricingPlan: S.optional(S.String),
    PricingPlanDataSource: S.optional(S.String),
    Description: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateGeofenceCollectionRequest",
}) as any as S.Schema<UpdateGeofenceCollectionRequest>;
export interface DeleteGeofenceCollectionRequest {
  CollectionName: string;
}
export const DeleteGeofenceCollectionRequest = S.suspend(() =>
  S.Struct({
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteGeofenceCollectionRequest",
}) as any as S.Schema<DeleteGeofenceCollectionRequest>;
export interface DeleteGeofenceCollectionResponse {}
export const DeleteGeofenceCollectionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteGeofenceCollectionResponse",
}) as any as S.Schema<DeleteGeofenceCollectionResponse>;
export interface ListGeofenceCollectionsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListGeofenceCollectionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/geofencing/v0/list-collections" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGeofenceCollectionsRequest",
}) as any as S.Schema<ListGeofenceCollectionsRequest>;
export interface BatchDeleteGeofenceRequest {
  CollectionName: string;
  GeofenceIds: string[];
}
export const BatchDeleteGeofenceRequest = S.suspend(() =>
  S.Struct({
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    GeofenceIds: IdList,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchDeleteGeofenceRequest",
}) as any as S.Schema<BatchDeleteGeofenceRequest>;
export interface GetGeofenceRequest {
  CollectionName: string;
  GeofenceId: string;
}
export const GetGeofenceRequest = S.suspend(() =>
  S.Struct({
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    GeofenceId: S.String.pipe(T.HttpLabel("GeofenceId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetGeofenceRequest",
}) as any as S.Schema<GetGeofenceRequest>;
export interface ListGeofencesRequest {
  CollectionName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListGeofencesRequest = S.suspend(() =>
  S.Struct({
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListGeofencesRequest",
}) as any as S.Schema<ListGeofencesRequest>;
export interface DescribeMapRequest {
  MapName: string;
}
export const DescribeMapRequest = S.suspend(() =>
  S.Struct({ MapName: S.String.pipe(T.HttpLabel("MapName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/maps/v0/maps/{MapName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMapRequest",
}) as any as S.Schema<DescribeMapRequest>;
export interface DeleteMapRequest {
  MapName: string;
}
export const DeleteMapRequest = S.suspend(() =>
  S.Struct({ MapName: S.String.pipe(T.HttpLabel("MapName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/maps/v0/maps/{MapName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMapRequest",
}) as any as S.Schema<DeleteMapRequest>;
export interface DeleteMapResponse {}
export const DeleteMapResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteMapResponse",
}) as any as S.Schema<DeleteMapResponse>;
export interface ListMapsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListMapsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/maps/v0/list-maps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMapsRequest",
}) as any as S.Schema<ListMapsRequest>;
export interface GetMapGlyphsRequest {
  MapName: string;
  FontStack: string;
  FontUnicodeRange: string;
  Key?: string | redacted.Redacted<string>;
}
export const GetMapGlyphsRequest = S.suspend(() =>
  S.Struct({
    MapName: S.String.pipe(T.HttpLabel("MapName")),
    FontStack: S.String.pipe(T.HttpLabel("FontStack")),
    FontUnicodeRange: S.String.pipe(T.HttpLabel("FontUnicodeRange")),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetMapGlyphsRequest",
}) as any as S.Schema<GetMapGlyphsRequest>;
export interface GetMapSpritesRequest {
  MapName: string;
  FileName: string;
  Key?: string | redacted.Redacted<string>;
}
export const GetMapSpritesRequest = S.suspend(() =>
  S.Struct({
    MapName: S.String.pipe(T.HttpLabel("MapName")),
    FileName: S.String.pipe(T.HttpLabel("FileName")),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetMapSpritesRequest",
}) as any as S.Schema<GetMapSpritesRequest>;
export interface GetMapStyleDescriptorRequest {
  MapName: string;
  Key?: string | redacted.Redacted<string>;
}
export const GetMapStyleDescriptorRequest = S.suspend(() =>
  S.Struct({
    MapName: S.String.pipe(T.HttpLabel("MapName")),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/maps/v0/maps/{MapName}/style-descriptor",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMapStyleDescriptorRequest",
}) as any as S.Schema<GetMapStyleDescriptorRequest>;
export interface GetMapTileRequest {
  MapName: string;
  Z: string | redacted.Redacted<string>;
  X: string | redacted.Redacted<string>;
  Y: string | redacted.Redacted<string>;
  Key?: string | redacted.Redacted<string>;
}
export const GetMapTileRequest = S.suspend(() =>
  S.Struct({
    MapName: S.String.pipe(T.HttpLabel("MapName")),
    Z: SensitiveString.pipe(T.HttpLabel("Z")),
    X: SensitiveString.pipe(T.HttpLabel("X")),
    Y: SensitiveString.pipe(T.HttpLabel("Y")),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/maps/v0/maps/{MapName}/tiles/{Z}/{X}/{Y}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMapTileRequest",
}) as any as S.Schema<GetMapTileRequest>;
export interface DescribePlaceIndexRequest {
  IndexName: string;
}
export const DescribePlaceIndexRequest = S.suspend(() =>
  S.Struct({ IndexName: S.String.pipe(T.HttpLabel("IndexName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/places/v0/indexes/{IndexName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePlaceIndexRequest",
}) as any as S.Schema<DescribePlaceIndexRequest>;
export interface DataSourceConfiguration {
  IntendedUse?: string;
}
export const DataSourceConfiguration = S.suspend(() =>
  S.Struct({ IntendedUse: S.optional(S.String) }),
).annotations({
  identifier: "DataSourceConfiguration",
}) as any as S.Schema<DataSourceConfiguration>;
export interface UpdatePlaceIndexRequest {
  IndexName: string;
  PricingPlan?: string;
  Description?: string;
  DataSourceConfiguration?: DataSourceConfiguration;
}
export const UpdatePlaceIndexRequest = S.suspend(() =>
  S.Struct({
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
    DataSourceConfiguration: S.optional(DataSourceConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/places/v0/indexes/{IndexName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePlaceIndexRequest",
}) as any as S.Schema<UpdatePlaceIndexRequest>;
export interface DeletePlaceIndexRequest {
  IndexName: string;
}
export const DeletePlaceIndexRequest = S.suspend(() =>
  S.Struct({ IndexName: S.String.pipe(T.HttpLabel("IndexName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/places/v0/indexes/{IndexName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePlaceIndexRequest",
}) as any as S.Schema<DeletePlaceIndexRequest>;
export interface DeletePlaceIndexResponse {}
export const DeletePlaceIndexResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePlaceIndexResponse",
}) as any as S.Schema<DeletePlaceIndexResponse>;
export interface ListPlaceIndexesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListPlaceIndexesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/places/v0/list-indexes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPlaceIndexesRequest",
}) as any as S.Schema<ListPlaceIndexesRequest>;
export interface GetPlaceRequest {
  IndexName: string;
  PlaceId: string | redacted.Redacted<string>;
  Language?: string;
  Key?: string | redacted.Redacted<string>;
}
export const GetPlaceRequest = S.suspend(() =>
  S.Struct({
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    PlaceId: SensitiveString.pipe(T.HttpLabel("PlaceId")),
    Language: S.optional(S.String).pipe(T.HttpQuery("language")),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetPlaceRequest",
}) as any as S.Schema<GetPlaceRequest>;
export interface SearchPlaceIndexForPositionRequest {
  IndexName: string;
  Position: number[];
  MaxResults?: number;
  Language?: string;
  Key?: string | redacted.Redacted<string>;
}
export const SearchPlaceIndexForPositionRequest = S.suspend(() =>
  S.Struct({
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    Position: Position,
    MaxResults: S.optional(S.Number),
    Language: S.optional(S.String),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
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
  ),
).annotations({
  identifier: "SearchPlaceIndexForPositionRequest",
}) as any as S.Schema<SearchPlaceIndexForPositionRequest>;
export interface SearchPlaceIndexForSuggestionsRequest {
  IndexName: string;
  Text: string | redacted.Redacted<string>;
  BiasPosition?: number[];
  FilterBBox?: number[];
  FilterCountries?: string | redacted.Redacted<string>[];
  MaxResults?: number;
  Language?: string;
  FilterCategories?: string | redacted.Redacted<string>[];
  Key?: string | redacted.Redacted<string>;
}
export const SearchPlaceIndexForSuggestionsRequest = S.suspend(() =>
  S.Struct({
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    Text: SensitiveString,
    BiasPosition: S.optional(Position),
    FilterBBox: S.optional(BoundingBox),
    FilterCountries: S.optional(CountryCodeList),
    MaxResults: S.optional(S.Number),
    Language: S.optional(S.String),
    FilterCategories: S.optional(FilterPlaceCategoryList),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
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
  ),
).annotations({
  identifier: "SearchPlaceIndexForSuggestionsRequest",
}) as any as S.Schema<SearchPlaceIndexForSuggestionsRequest>;
export interface SearchPlaceIndexForTextRequest {
  IndexName: string;
  Text: string | redacted.Redacted<string>;
  BiasPosition?: number[];
  FilterBBox?: number[];
  FilterCountries?: string | redacted.Redacted<string>[];
  MaxResults?: number;
  Language?: string;
  FilterCategories?: string | redacted.Redacted<string>[];
  Key?: string | redacted.Redacted<string>;
}
export const SearchPlaceIndexForTextRequest = S.suspend(() =>
  S.Struct({
    IndexName: S.String.pipe(T.HttpLabel("IndexName")),
    Text: SensitiveString,
    BiasPosition: S.optional(Position),
    FilterBBox: S.optional(BoundingBox),
    FilterCountries: S.optional(CountryCodeList),
    MaxResults: S.optional(S.Number),
    Language: S.optional(S.String),
    FilterCategories: S.optional(FilterPlaceCategoryList),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
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
  ),
).annotations({
  identifier: "SearchPlaceIndexForTextRequest",
}) as any as S.Schema<SearchPlaceIndexForTextRequest>;
export interface CreateRouteCalculatorRequest {
  CalculatorName: string;
  DataSource: string;
  PricingPlan?: string;
  Description?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateRouteCalculatorRequest = S.suspend(() =>
  S.Struct({
    CalculatorName: S.String,
    DataSource: S.String,
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/routes/v0/calculators" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRouteCalculatorRequest",
}) as any as S.Schema<CreateRouteCalculatorRequest>;
export interface DescribeRouteCalculatorRequest {
  CalculatorName: string;
}
export const DescribeRouteCalculatorRequest = S.suspend(() =>
  S.Struct({
    CalculatorName: S.String.pipe(T.HttpLabel("CalculatorName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/routes/v0/calculators/{CalculatorName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRouteCalculatorRequest",
}) as any as S.Schema<DescribeRouteCalculatorRequest>;
export interface UpdateRouteCalculatorRequest {
  CalculatorName: string;
  PricingPlan?: string;
  Description?: string;
}
export const UpdateRouteCalculatorRequest = S.suspend(() =>
  S.Struct({
    CalculatorName: S.String.pipe(T.HttpLabel("CalculatorName")),
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/routes/v0/calculators/{CalculatorName}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRouteCalculatorRequest",
}) as any as S.Schema<UpdateRouteCalculatorRequest>;
export interface DeleteRouteCalculatorRequest {
  CalculatorName: string;
}
export const DeleteRouteCalculatorRequest = S.suspend(() =>
  S.Struct({
    CalculatorName: S.String.pipe(T.HttpLabel("CalculatorName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteRouteCalculatorRequest",
}) as any as S.Schema<DeleteRouteCalculatorRequest>;
export interface DeleteRouteCalculatorResponse {}
export const DeleteRouteCalculatorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRouteCalculatorResponse",
}) as any as S.Schema<DeleteRouteCalculatorResponse>;
export interface ListRouteCalculatorsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListRouteCalculatorsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/routes/v0/list-calculators" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRouteCalculatorsRequest",
}) as any as S.Schema<ListRouteCalculatorsRequest>;
export interface CalculateRouteCarModeOptions {
  AvoidFerries?: boolean;
  AvoidTolls?: boolean;
}
export const CalculateRouteCarModeOptions = S.suspend(() =>
  S.Struct({
    AvoidFerries: S.optional(S.Boolean),
    AvoidTolls: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CalculateRouteCarModeOptions",
}) as any as S.Schema<CalculateRouteCarModeOptions>;
export interface TruckDimensions {
  Length?: number;
  Height?: number;
  Width?: number;
  Unit?: string;
}
export const TruckDimensions = S.suspend(() =>
  S.Struct({
    Length: S.optional(S.Number),
    Height: S.optional(S.Number),
    Width: S.optional(S.Number),
    Unit: S.optional(S.String),
  }),
).annotations({
  identifier: "TruckDimensions",
}) as any as S.Schema<TruckDimensions>;
export interface TruckWeight {
  Total?: number;
  Unit?: string;
}
export const TruckWeight = S.suspend(() =>
  S.Struct({ Total: S.optional(S.Number), Unit: S.optional(S.String) }),
).annotations({ identifier: "TruckWeight" }) as any as S.Schema<TruckWeight>;
export interface CalculateRouteTruckModeOptions {
  AvoidFerries?: boolean;
  AvoidTolls?: boolean;
  Dimensions?: TruckDimensions;
  Weight?: TruckWeight;
}
export const CalculateRouteTruckModeOptions = S.suspend(() =>
  S.Struct({
    AvoidFerries: S.optional(S.Boolean),
    AvoidTolls: S.optional(S.Boolean),
    Dimensions: S.optional(TruckDimensions),
    Weight: S.optional(TruckWeight),
  }),
).annotations({
  identifier: "CalculateRouteTruckModeOptions",
}) as any as S.Schema<CalculateRouteTruckModeOptions>;
export interface CalculateRouteMatrixRequest {
  CalculatorName: string;
  DeparturePositions: number[][];
  DestinationPositions: number[][];
  TravelMode?: string;
  DepartureTime?: Date;
  DepartNow?: boolean;
  DistanceUnit?: string;
  CarModeOptions?: CalculateRouteCarModeOptions;
  TruckModeOptions?: CalculateRouteTruckModeOptions;
  Key?: string | redacted.Redacted<string>;
}
export const CalculateRouteMatrixRequest = S.suspend(() =>
  S.Struct({
    CalculatorName: S.String.pipe(T.HttpLabel("CalculatorName")),
    DeparturePositions: PositionList,
    DestinationPositions: PositionList,
    TravelMode: S.optional(S.String),
    DepartureTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    DepartNow: S.optional(S.Boolean),
    DistanceUnit: S.optional(S.String),
    CarModeOptions: S.optional(CalculateRouteCarModeOptions),
    TruckModeOptions: S.optional(CalculateRouteTruckModeOptions),
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
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
  ),
).annotations({
  identifier: "CalculateRouteMatrixRequest",
}) as any as S.Schema<CalculateRouteMatrixRequest>;
export interface CreateTrackerRequest {
  TrackerName: string;
  PricingPlan?: string;
  KmsKeyId?: string;
  PricingPlanDataSource?: string;
  Description?: string;
  Tags?: { [key: string]: string | undefined };
  PositionFiltering?: string;
  EventBridgeEnabled?: boolean;
  KmsKeyEnableGeospatialQueries?: boolean;
}
export const CreateTrackerRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String,
    PricingPlan: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    PricingPlanDataSource: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
    PositionFiltering: S.optional(S.String),
    EventBridgeEnabled: S.optional(S.Boolean),
    KmsKeyEnableGeospatialQueries: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tracking/v0/trackers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTrackerRequest",
}) as any as S.Schema<CreateTrackerRequest>;
export interface DescribeTrackerRequest {
  TrackerName: string;
}
export const DescribeTrackerRequest = S.suspend(() =>
  S.Struct({ TrackerName: S.String.pipe(T.HttpLabel("TrackerName")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tracking/v0/trackers/{TrackerName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTrackerRequest",
}) as any as S.Schema<DescribeTrackerRequest>;
export interface UpdateTrackerRequest {
  TrackerName: string;
  PricingPlan?: string;
  PricingPlanDataSource?: string;
  Description?: string;
  PositionFiltering?: string;
  EventBridgeEnabled?: boolean;
  KmsKeyEnableGeospatialQueries?: boolean;
}
export const UpdateTrackerRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    PricingPlan: S.optional(S.String),
    PricingPlanDataSource: S.optional(S.String),
    Description: S.optional(S.String),
    PositionFiltering: S.optional(S.String),
    EventBridgeEnabled: S.optional(S.Boolean),
    KmsKeyEnableGeospatialQueries: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/tracking/v0/trackers/{TrackerName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTrackerRequest",
}) as any as S.Schema<UpdateTrackerRequest>;
export interface DeleteTrackerRequest {
  TrackerName: string;
}
export const DeleteTrackerRequest = S.suspend(() =>
  S.Struct({ TrackerName: S.String.pipe(T.HttpLabel("TrackerName")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tracking/v0/trackers/{TrackerName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTrackerRequest",
}) as any as S.Schema<DeleteTrackerRequest>;
export interface DeleteTrackerResponse {}
export const DeleteTrackerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTrackerResponse",
}) as any as S.Schema<DeleteTrackerResponse>;
export interface ListTrackersRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListTrackersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tracking/v0/list-trackers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrackersRequest",
}) as any as S.Schema<ListTrackersRequest>;
export interface AssociateTrackerConsumerRequest {
  TrackerName: string;
  ConsumerArn: string;
}
export const AssociateTrackerConsumerRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    ConsumerArn: S.String,
  }).pipe(
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
  ),
).annotations({
  identifier: "AssociateTrackerConsumerRequest",
}) as any as S.Schema<AssociateTrackerConsumerRequest>;
export interface AssociateTrackerConsumerResponse {}
export const AssociateTrackerConsumerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AssociateTrackerConsumerResponse",
}) as any as S.Schema<AssociateTrackerConsumerResponse>;
export interface BatchDeleteDevicePositionHistoryRequest {
  TrackerName: string;
  DeviceIds: string[];
}
export const BatchDeleteDevicePositionHistoryRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    DeviceIds: DeviceIdsList,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchDeleteDevicePositionHistoryRequest",
}) as any as S.Schema<BatchDeleteDevicePositionHistoryRequest>;
export interface BatchGetDevicePositionRequest {
  TrackerName: string;
  DeviceIds: string[];
}
export const BatchGetDevicePositionRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    DeviceIds: IdList,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchGetDevicePositionRequest",
}) as any as S.Schema<BatchGetDevicePositionRequest>;
export interface PositionalAccuracy {
  Horizontal: number;
}
export const PositionalAccuracy = S.suspend(() =>
  S.Struct({ Horizontal: S.Number }),
).annotations({
  identifier: "PositionalAccuracy",
}) as any as S.Schema<PositionalAccuracy>;
export type PositionPropertyMap = { [key: string]: string | undefined };
export const PositionPropertyMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface DevicePositionUpdate {
  DeviceId: string;
  SampleTime: Date;
  Position: number[];
  Accuracy?: PositionalAccuracy;
  PositionProperties?: { [key: string]: string | undefined };
}
export const DevicePositionUpdate = S.suspend(() =>
  S.Struct({
    DeviceId: S.String,
    SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
    Position: Position,
    Accuracy: S.optional(PositionalAccuracy),
    PositionProperties: S.optional(PositionPropertyMap),
  }),
).annotations({
  identifier: "DevicePositionUpdate",
}) as any as S.Schema<DevicePositionUpdate>;
export type DevicePositionUpdateList = DevicePositionUpdate[];
export const DevicePositionUpdateList = S.Array(DevicePositionUpdate);
export interface BatchUpdateDevicePositionRequest {
  TrackerName: string;
  Updates: DevicePositionUpdate[];
}
export const BatchUpdateDevicePositionRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    Updates: DevicePositionUpdateList,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchUpdateDevicePositionRequest",
}) as any as S.Schema<BatchUpdateDevicePositionRequest>;
export interface DisassociateTrackerConsumerRequest {
  TrackerName: string;
  ConsumerArn: string;
}
export const DisassociateTrackerConsumerRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    ConsumerArn: S.String.pipe(T.HttpLabel("ConsumerArn")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DisassociateTrackerConsumerRequest",
}) as any as S.Schema<DisassociateTrackerConsumerRequest>;
export interface DisassociateTrackerConsumerResponse {}
export const DisassociateTrackerConsumerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisassociateTrackerConsumerResponse",
}) as any as S.Schema<DisassociateTrackerConsumerResponse>;
export interface GetDevicePositionRequest {
  TrackerName: string;
  DeviceId: string;
}
export const GetDevicePositionRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    DeviceId: S.String.pipe(T.HttpLabel("DeviceId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDevicePositionRequest",
}) as any as S.Schema<GetDevicePositionRequest>;
export interface GetDevicePositionHistoryRequest {
  TrackerName: string;
  DeviceId: string;
  NextToken?: string;
  StartTimeInclusive?: Date;
  EndTimeExclusive?: Date;
  MaxResults?: number;
}
export const GetDevicePositionHistoryRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    DeviceId: S.String.pipe(T.HttpLabel("DeviceId")),
    NextToken: S.optional(S.String),
    StartTimeInclusive: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTimeExclusive: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDevicePositionHistoryRequest",
}) as any as S.Schema<GetDevicePositionHistoryRequest>;
export interface ListTrackerConsumersRequest {
  TrackerName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTrackerConsumersRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListTrackerConsumersRequest",
}) as any as S.Schema<ListTrackerConsumersRequest>;
export type LinearRing = number[][];
export const LinearRing = S.Array(Position);
export type LinearRings = number[][][];
export const LinearRings = S.Array(LinearRing);
export type MultiLinearRings = number[][][][];
export const MultiLinearRings = S.Array(LinearRings);
export type CustomLayerList = string[];
export const CustomLayerList = S.Array(S.String);
export interface ApiKeyFilter {
  KeyStatus?: string;
}
export const ApiKeyFilter = S.suspend(() =>
  S.Struct({ KeyStatus: S.optional(S.String) }),
).annotations({ identifier: "ApiKeyFilter" }) as any as S.Schema<ApiKeyFilter>;
export interface Circle {
  Center: number[];
  Radius: number;
}
export const Circle = S.suspend(() =>
  S.Struct({ Center: Position, Radius: S.Number }),
).annotations({ identifier: "Circle" }) as any as S.Schema<Circle>;
export interface GeofenceGeometry {
  Polygon?: number[][][];
  Circle?: Circle;
  Geobuf?: Uint8Array | redacted.Redacted<Uint8Array>;
  MultiPolygon?: number[][][][];
}
export const GeofenceGeometry = S.suspend(() =>
  S.Struct({
    Polygon: S.optional(LinearRings),
    Circle: S.optional(Circle),
    Geobuf: S.optional(SensitiveBlob),
    MultiPolygon: S.optional(MultiLinearRings),
  }),
).annotations({
  identifier: "GeofenceGeometry",
}) as any as S.Schema<GeofenceGeometry>;
export type PropertyMap = { [key: string]: string | undefined };
export const PropertyMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface BatchPutGeofenceRequestEntry {
  GeofenceId: string;
  Geometry: GeofenceGeometry;
  GeofenceProperties?: { [key: string]: string | undefined };
}
export const BatchPutGeofenceRequestEntry = S.suspend(() =>
  S.Struct({
    GeofenceId: S.String,
    Geometry: GeofenceGeometry,
    GeofenceProperties: S.optional(PropertyMap),
  }),
).annotations({
  identifier: "BatchPutGeofenceRequestEntry",
}) as any as S.Schema<BatchPutGeofenceRequestEntry>;
export type BatchPutGeofenceRequestEntryList = BatchPutGeofenceRequestEntry[];
export const BatchPutGeofenceRequestEntryList = S.Array(
  BatchPutGeofenceRequestEntry,
);
export interface ForecastGeofenceEventsDeviceState {
  Position: number[];
  Speed?: number;
}
export const ForecastGeofenceEventsDeviceState = S.suspend(() =>
  S.Struct({ Position: Position, Speed: S.optional(S.Number) }),
).annotations({
  identifier: "ForecastGeofenceEventsDeviceState",
}) as any as S.Schema<ForecastGeofenceEventsDeviceState>;
export interface MapConfiguration {
  Style: string;
  PoliticalView?: string | redacted.Redacted<string>;
  CustomLayers?: string[];
}
export const MapConfiguration = S.suspend(() =>
  S.Struct({
    Style: S.String,
    PoliticalView: S.optional(SensitiveString),
    CustomLayers: S.optional(CustomLayerList),
  }),
).annotations({
  identifier: "MapConfiguration",
}) as any as S.Schema<MapConfiguration>;
export interface MapConfigurationUpdate {
  PoliticalView?: string | redacted.Redacted<string>;
  CustomLayers?: string[];
}
export const MapConfigurationUpdate = S.suspend(() =>
  S.Struct({
    PoliticalView: S.optional(SensitiveString),
    CustomLayers: S.optional(CustomLayerList),
  }),
).annotations({
  identifier: "MapConfigurationUpdate",
}) as any as S.Schema<MapConfigurationUpdate>;
export interface TrackingFilterGeometry {
  Polygon?: number[][][];
}
export const TrackingFilterGeometry = S.suspend(() =>
  S.Struct({ Polygon: S.optional(LinearRings) }),
).annotations({
  identifier: "TrackingFilterGeometry",
}) as any as S.Schema<TrackingFilterGeometry>;
export type ArnList = string[];
export const ArnList = S.Array(S.String);
export interface DescribeKeyResponse {
  Key: string | redacted.Redacted<string>;
  KeyArn: string;
  KeyName: string;
  Restrictions: ApiKeyRestrictions;
  CreateTime: Date;
  ExpireTime: Date;
  UpdateTime: Date;
  Description?: string;
  Tags?: { [key: string]: string | undefined };
}
export const DescribeKeyResponse = S.suspend(() =>
  S.Struct({
    Key: SensitiveString,
    KeyArn: S.String,
    KeyName: S.String,
    Restrictions: ApiKeyRestrictions,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    ExpireTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "DescribeKeyResponse",
}) as any as S.Schema<DescribeKeyResponse>;
export interface UpdateKeyResponse {
  KeyArn: string;
  KeyName: string;
  UpdateTime: Date;
}
export const UpdateKeyResponse = S.suspend(() =>
  S.Struct({
    KeyArn: S.String,
    KeyName: S.String,
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateKeyResponse",
}) as any as S.Schema<UpdateKeyResponse>;
export interface ListKeysRequest {
  MaxResults?: number;
  NextToken?: string;
  Filter?: ApiKeyFilter;
}
export const ListKeysRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filter: S.optional(ApiKeyFilter),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/metadata/v0/list-keys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListKeysRequest",
}) as any as S.Schema<ListKeysRequest>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface CreateGeofenceCollectionResponse {
  CollectionName: string;
  CollectionArn: string;
  CreateTime: Date;
}
export const CreateGeofenceCollectionResponse = S.suspend(() =>
  S.Struct({
    CollectionName: S.String,
    CollectionArn: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateGeofenceCollectionResponse",
}) as any as S.Schema<CreateGeofenceCollectionResponse>;
export interface DescribeGeofenceCollectionResponse {
  CollectionName: string;
  CollectionArn: string;
  Description: string;
  PricingPlan?: string;
  PricingPlanDataSource?: string;
  KmsKeyId?: string;
  Tags?: { [key: string]: string | undefined };
  CreateTime: Date;
  UpdateTime: Date;
  GeofenceCount?: number;
}
export const DescribeGeofenceCollectionResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DescribeGeofenceCollectionResponse",
}) as any as S.Schema<DescribeGeofenceCollectionResponse>;
export interface UpdateGeofenceCollectionResponse {
  CollectionName: string;
  CollectionArn: string;
  UpdateTime: Date;
}
export const UpdateGeofenceCollectionResponse = S.suspend(() =>
  S.Struct({
    CollectionName: S.String,
    CollectionArn: S.String,
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateGeofenceCollectionResponse",
}) as any as S.Schema<UpdateGeofenceCollectionResponse>;
export interface BatchPutGeofenceRequest {
  CollectionName: string;
  Entries: BatchPutGeofenceRequestEntry[];
}
export const BatchPutGeofenceRequest = S.suspend(() =>
  S.Struct({
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    Entries: BatchPutGeofenceRequestEntryList,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchPutGeofenceRequest",
}) as any as S.Schema<BatchPutGeofenceRequest>;
export interface ForecastGeofenceEventsRequest {
  CollectionName: string;
  DeviceState: ForecastGeofenceEventsDeviceState;
  TimeHorizonMinutes?: number;
  DistanceUnit?: string;
  SpeedUnit?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ForecastGeofenceEventsRequest = S.suspend(() =>
  S.Struct({
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    DeviceState: ForecastGeofenceEventsDeviceState,
    TimeHorizonMinutes: S.optional(S.Number),
    DistanceUnit: S.optional(S.String),
    SpeedUnit: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
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
  ),
).annotations({
  identifier: "ForecastGeofenceEventsRequest",
}) as any as S.Schema<ForecastGeofenceEventsRequest>;
export interface GetGeofenceResponse {
  GeofenceId: string;
  Geometry: GeofenceGeometry;
  Status: string;
  CreateTime: Date;
  UpdateTime: Date;
  GeofenceProperties?: { [key: string]: string | undefined };
}
export const GetGeofenceResponse = S.suspend(() =>
  S.Struct({
    GeofenceId: S.String,
    Geometry: GeofenceGeometry,
    Status: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    GeofenceProperties: S.optional(PropertyMap),
  }),
).annotations({
  identifier: "GetGeofenceResponse",
}) as any as S.Schema<GetGeofenceResponse>;
export interface CreateMapRequest {
  MapName: string;
  Configuration: MapConfiguration;
  PricingPlan?: string;
  Description?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateMapRequest = S.suspend(() =>
  S.Struct({
    MapName: S.String,
    Configuration: MapConfiguration,
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/maps/v0/maps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMapRequest",
}) as any as S.Schema<CreateMapRequest>;
export interface DescribeMapResponse {
  MapName: string;
  MapArn: string;
  PricingPlan?: string;
  DataSource: string;
  Configuration: MapConfiguration;
  Description: string;
  Tags?: { [key: string]: string | undefined };
  CreateTime: Date;
  UpdateTime: Date;
}
export const DescribeMapResponse = S.suspend(() =>
  S.Struct({
    MapName: S.String,
    MapArn: S.String,
    PricingPlan: S.optional(S.String),
    DataSource: S.String,
    Configuration: MapConfiguration,
    Description: S.String,
    Tags: S.optional(TagMap),
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "DescribeMapResponse",
}) as any as S.Schema<DescribeMapResponse>;
export interface UpdateMapRequest {
  MapName: string;
  PricingPlan?: string;
  Description?: string;
  ConfigurationUpdate?: MapConfigurationUpdate;
}
export const UpdateMapRequest = S.suspend(() =>
  S.Struct({
    MapName: S.String.pipe(T.HttpLabel("MapName")),
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
    ConfigurationUpdate: S.optional(MapConfigurationUpdate),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/maps/v0/maps/{MapName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMapRequest",
}) as any as S.Schema<UpdateMapRequest>;
export interface GetMapGlyphsResponse {
  Blob?: Uint8Array;
  ContentType?: string;
  CacheControl?: string;
}
export const GetMapGlyphsResponse = S.suspend(() =>
  S.Struct({
    Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
  }),
).annotations({
  identifier: "GetMapGlyphsResponse",
}) as any as S.Schema<GetMapGlyphsResponse>;
export interface GetMapSpritesResponse {
  Blob?: Uint8Array;
  ContentType?: string;
  CacheControl?: string;
}
export const GetMapSpritesResponse = S.suspend(() =>
  S.Struct({
    Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
  }),
).annotations({
  identifier: "GetMapSpritesResponse",
}) as any as S.Schema<GetMapSpritesResponse>;
export interface GetMapStyleDescriptorResponse {
  Blob?: Uint8Array;
  ContentType?: string;
  CacheControl?: string;
}
export const GetMapStyleDescriptorResponse = S.suspend(() =>
  S.Struct({
    Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
  }),
).annotations({
  identifier: "GetMapStyleDescriptorResponse",
}) as any as S.Schema<GetMapStyleDescriptorResponse>;
export interface GetMapTileResponse {
  Blob?: Uint8Array;
  ContentType?: string;
  CacheControl?: string;
}
export const GetMapTileResponse = S.suspend(() =>
  S.Struct({
    Blob: S.optional(T.Blob).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    CacheControl: S.optional(S.String).pipe(T.HttpHeader("Cache-Control")),
  }),
).annotations({
  identifier: "GetMapTileResponse",
}) as any as S.Schema<GetMapTileResponse>;
export interface CreatePlaceIndexRequest {
  IndexName: string;
  DataSource: string;
  PricingPlan?: string;
  Description?: string;
  DataSourceConfiguration?: DataSourceConfiguration;
  Tags?: { [key: string]: string | undefined };
}
export const CreatePlaceIndexRequest = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    DataSource: S.String,
    PricingPlan: S.optional(S.String),
    Description: S.optional(S.String),
    DataSourceConfiguration: S.optional(DataSourceConfiguration),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/places/v0/indexes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePlaceIndexRequest",
}) as any as S.Schema<CreatePlaceIndexRequest>;
export interface DescribePlaceIndexResponse {
  IndexName: string;
  IndexArn: string;
  PricingPlan?: string;
  Description: string;
  CreateTime: Date;
  UpdateTime: Date;
  DataSource: string;
  DataSourceConfiguration: DataSourceConfiguration;
  Tags?: { [key: string]: string | undefined };
}
export const DescribePlaceIndexResponse = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    IndexArn: S.String,
    PricingPlan: S.optional(S.String),
    Description: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    DataSource: S.String,
    DataSourceConfiguration: DataSourceConfiguration,
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "DescribePlaceIndexResponse",
}) as any as S.Schema<DescribePlaceIndexResponse>;
export interface UpdatePlaceIndexResponse {
  IndexName: string;
  IndexArn: string;
  UpdateTime: Date;
}
export const UpdatePlaceIndexResponse = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    IndexArn: S.String,
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdatePlaceIndexResponse",
}) as any as S.Schema<UpdatePlaceIndexResponse>;
export interface CreateRouteCalculatorResponse {
  CalculatorName: string;
  CalculatorArn: string;
  CreateTime: Date;
}
export const CreateRouteCalculatorResponse = S.suspend(() =>
  S.Struct({
    CalculatorName: S.String,
    CalculatorArn: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateRouteCalculatorResponse",
}) as any as S.Schema<CreateRouteCalculatorResponse>;
export interface DescribeRouteCalculatorResponse {
  CalculatorName: string;
  CalculatorArn: string;
  PricingPlan?: string;
  Description: string;
  CreateTime: Date;
  UpdateTime: Date;
  DataSource: string;
  Tags?: { [key: string]: string | undefined };
}
export const DescribeRouteCalculatorResponse = S.suspend(() =>
  S.Struct({
    CalculatorName: S.String,
    CalculatorArn: S.String,
    PricingPlan: S.optional(S.String),
    Description: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    DataSource: S.String,
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "DescribeRouteCalculatorResponse",
}) as any as S.Schema<DescribeRouteCalculatorResponse>;
export interface UpdateRouteCalculatorResponse {
  CalculatorName: string;
  CalculatorArn: string;
  UpdateTime: Date;
}
export const UpdateRouteCalculatorResponse = S.suspend(() =>
  S.Struct({
    CalculatorName: S.String,
    CalculatorArn: S.String,
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateRouteCalculatorResponse",
}) as any as S.Schema<UpdateRouteCalculatorResponse>;
export interface CreateTrackerResponse {
  TrackerName: string;
  TrackerArn: string;
  CreateTime: Date;
}
export const CreateTrackerResponse = S.suspend(() =>
  S.Struct({
    TrackerName: S.String,
    TrackerArn: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateTrackerResponse",
}) as any as S.Schema<CreateTrackerResponse>;
export interface DescribeTrackerResponse {
  TrackerName: string;
  TrackerArn: string;
  Description: string;
  PricingPlan?: string;
  PricingPlanDataSource?: string;
  Tags?: { [key: string]: string | undefined };
  CreateTime: Date;
  UpdateTime: Date;
  KmsKeyId?: string;
  PositionFiltering?: string;
  EventBridgeEnabled?: boolean;
  KmsKeyEnableGeospatialQueries?: boolean;
}
export const DescribeTrackerResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DescribeTrackerResponse",
}) as any as S.Schema<DescribeTrackerResponse>;
export interface UpdateTrackerResponse {
  TrackerName: string;
  TrackerArn: string;
  UpdateTime: Date;
}
export const UpdateTrackerResponse = S.suspend(() =>
  S.Struct({
    TrackerName: S.String,
    TrackerArn: S.String,
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateTrackerResponse",
}) as any as S.Schema<UpdateTrackerResponse>;
export interface GetDevicePositionResponse {
  DeviceId?: string;
  SampleTime: Date;
  ReceivedTime: Date;
  Position: number[];
  Accuracy?: PositionalAccuracy;
  PositionProperties?: { [key: string]: string | undefined };
}
export const GetDevicePositionResponse = S.suspend(() =>
  S.Struct({
    DeviceId: S.optional(S.String),
    SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
    ReceivedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    Position: Position,
    Accuracy: S.optional(PositionalAccuracy),
    PositionProperties: S.optional(PositionPropertyMap),
  }),
).annotations({
  identifier: "GetDevicePositionResponse",
}) as any as S.Schema<GetDevicePositionResponse>;
export interface DevicePosition {
  DeviceId?: string;
  SampleTime: Date;
  ReceivedTime: Date;
  Position: number[];
  Accuracy?: PositionalAccuracy;
  PositionProperties?: { [key: string]: string | undefined };
}
export const DevicePosition = S.suspend(() =>
  S.Struct({
    DeviceId: S.optional(S.String),
    SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
    ReceivedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    Position: Position,
    Accuracy: S.optional(PositionalAccuracy),
    PositionProperties: S.optional(PositionPropertyMap),
  }),
).annotations({
  identifier: "DevicePosition",
}) as any as S.Schema<DevicePosition>;
export type DevicePositionList = DevicePosition[];
export const DevicePositionList = S.Array(DevicePosition);
export interface GetDevicePositionHistoryResponse {
  DevicePositions: DevicePosition[];
  NextToken?: string;
}
export const GetDevicePositionHistoryResponse = S.suspend(() =>
  S.Struct({
    DevicePositions: DevicePositionList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDevicePositionHistoryResponse",
}) as any as S.Schema<GetDevicePositionHistoryResponse>;
export interface ListDevicePositionsRequest {
  TrackerName: string;
  MaxResults?: number;
  NextToken?: string;
  FilterGeometry?: TrackingFilterGeometry;
}
export const ListDevicePositionsRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    FilterGeometry: S.optional(TrackingFilterGeometry),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDevicePositionsRequest",
}) as any as S.Schema<ListDevicePositionsRequest>;
export interface ListTrackerConsumersResponse {
  ConsumerArns: string[];
  NextToken?: string;
}
export const ListTrackerConsumersResponse = S.suspend(() =>
  S.Struct({ ConsumerArns: ArnList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTrackerConsumersResponse",
}) as any as S.Schema<ListTrackerConsumersResponse>;
export type PlaceCategoryList = string | redacted.Redacted<string>[];
export const PlaceCategoryList = S.Array(SensitiveString);
export type PlaceSupplementalCategoryList =
  | string
  | redacted.Redacted<string>[];
export const PlaceSupplementalCategoryList = S.Array(SensitiveString);
export interface WiFiAccessPoint {
  MacAddress: string;
  Rss: number;
}
export const WiFiAccessPoint = S.suspend(() =>
  S.Struct({ MacAddress: S.String, Rss: S.Number }),
).annotations({
  identifier: "WiFiAccessPoint",
}) as any as S.Schema<WiFiAccessPoint>;
export type WiFiAccessPointList = WiFiAccessPoint[];
export const WiFiAccessPointList = S.Array(WiFiAccessPoint);
export interface ListGeofenceCollectionsResponseEntry {
  CollectionName: string;
  Description: string;
  PricingPlan?: string;
  PricingPlanDataSource?: string;
  CreateTime: Date;
  UpdateTime: Date;
}
export const ListGeofenceCollectionsResponseEntry = S.suspend(() =>
  S.Struct({
    CollectionName: S.String,
    Description: S.String,
    PricingPlan: S.optional(S.String),
    PricingPlanDataSource: S.optional(S.String),
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListGeofenceCollectionsResponseEntry",
}) as any as S.Schema<ListGeofenceCollectionsResponseEntry>;
export type ListGeofenceCollectionsResponseEntryList =
  ListGeofenceCollectionsResponseEntry[];
export const ListGeofenceCollectionsResponseEntryList = S.Array(
  ListGeofenceCollectionsResponseEntry,
);
export interface ListGeofenceResponseEntry {
  GeofenceId: string;
  Geometry: GeofenceGeometry;
  Status: string;
  CreateTime: Date;
  UpdateTime: Date;
  GeofenceProperties?: { [key: string]: string | undefined };
}
export const ListGeofenceResponseEntry = S.suspend(() =>
  S.Struct({
    GeofenceId: S.String,
    Geometry: GeofenceGeometry,
    Status: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    GeofenceProperties: S.optional(PropertyMap),
  }),
).annotations({
  identifier: "ListGeofenceResponseEntry",
}) as any as S.Schema<ListGeofenceResponseEntry>;
export type ListGeofenceResponseEntryList = ListGeofenceResponseEntry[];
export const ListGeofenceResponseEntryList = S.Array(ListGeofenceResponseEntry);
export interface ListMapsResponseEntry {
  MapName: string;
  Description: string;
  DataSource: string;
  PricingPlan?: string;
  CreateTime: Date;
  UpdateTime: Date;
}
export const ListMapsResponseEntry = S.suspend(() =>
  S.Struct({
    MapName: S.String,
    Description: S.String,
    DataSource: S.String,
    PricingPlan: S.optional(S.String),
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListMapsResponseEntry",
}) as any as S.Schema<ListMapsResponseEntry>;
export type ListMapsResponseEntryList = ListMapsResponseEntry[];
export const ListMapsResponseEntryList = S.Array(ListMapsResponseEntry);
export interface ListPlaceIndexesResponseEntry {
  IndexName: string;
  Description: string;
  DataSource: string;
  PricingPlan?: string;
  CreateTime: Date;
  UpdateTime: Date;
}
export const ListPlaceIndexesResponseEntry = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    Description: S.String,
    DataSource: S.String,
    PricingPlan: S.optional(S.String),
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListPlaceIndexesResponseEntry",
}) as any as S.Schema<ListPlaceIndexesResponseEntry>;
export type ListPlaceIndexesResponseEntryList = ListPlaceIndexesResponseEntry[];
export const ListPlaceIndexesResponseEntryList = S.Array(
  ListPlaceIndexesResponseEntry,
);
export interface SearchPlaceIndexForPositionSummary {
  Position: number[];
  MaxResults?: number;
  DataSource: string;
  Language?: string;
}
export const SearchPlaceIndexForPositionSummary = S.suspend(() =>
  S.Struct({
    Position: Position,
    MaxResults: S.optional(S.Number),
    DataSource: S.String,
    Language: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchPlaceIndexForPositionSummary",
}) as any as S.Schema<SearchPlaceIndexForPositionSummary>;
export interface PlaceGeometry {
  Point?: number[];
}
export const PlaceGeometry = S.suspend(() =>
  S.Struct({ Point: S.optional(Position) }),
).annotations({
  identifier: "PlaceGeometry",
}) as any as S.Schema<PlaceGeometry>;
export interface TimeZone {
  Name: string | redacted.Redacted<string>;
  Offset?: number;
}
export const TimeZone = S.suspend(() =>
  S.Struct({ Name: SensitiveString, Offset: S.optional(S.Number) }),
).annotations({ identifier: "TimeZone" }) as any as S.Schema<TimeZone>;
export interface Place {
  Label?: string | redacted.Redacted<string>;
  Geometry: PlaceGeometry;
  AddressNumber?: string | redacted.Redacted<string>;
  Street?: string | redacted.Redacted<string>;
  Neighborhood?: string | redacted.Redacted<string>;
  Municipality?: string | redacted.Redacted<string>;
  SubRegion?: string | redacted.Redacted<string>;
  Region?: string | redacted.Redacted<string>;
  Country?: string | redacted.Redacted<string>;
  PostalCode?: string | redacted.Redacted<string>;
  Interpolated?: boolean;
  TimeZone?: TimeZone;
  UnitType?: string | redacted.Redacted<string>;
  UnitNumber?: string | redacted.Redacted<string>;
  Categories?: string | redacted.Redacted<string>[];
  SupplementalCategories?: string | redacted.Redacted<string>[];
  SubMunicipality?: string | redacted.Redacted<string>;
}
export const Place = S.suspend(() =>
  S.Struct({
    Label: S.optional(SensitiveString),
    Geometry: PlaceGeometry,
    AddressNumber: S.optional(SensitiveString),
    Street: S.optional(SensitiveString),
    Neighborhood: S.optional(SensitiveString),
    Municipality: S.optional(SensitiveString),
    SubRegion: S.optional(SensitiveString),
    Region: S.optional(SensitiveString),
    Country: S.optional(SensitiveString),
    PostalCode: S.optional(SensitiveString),
    Interpolated: S.optional(S.Boolean),
    TimeZone: S.optional(TimeZone),
    UnitType: S.optional(SensitiveString),
    UnitNumber: S.optional(SensitiveString),
    Categories: S.optional(PlaceCategoryList),
    SupplementalCategories: S.optional(PlaceSupplementalCategoryList),
    SubMunicipality: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Place" }) as any as S.Schema<Place>;
export interface SearchForPositionResult {
  Place: Place;
  Distance: number;
  PlaceId?: string | redacted.Redacted<string>;
}
export const SearchForPositionResult = S.suspend(() =>
  S.Struct({
    Place: Place,
    Distance: S.Number,
    PlaceId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "SearchForPositionResult",
}) as any as S.Schema<SearchForPositionResult>;
export type SearchForPositionResultList = SearchForPositionResult[];
export const SearchForPositionResultList = S.Array(SearchForPositionResult);
export interface SearchPlaceIndexForSuggestionsSummary {
  Text: string | redacted.Redacted<string>;
  BiasPosition?: number[];
  FilterBBox?: number[];
  FilterCountries?: string | redacted.Redacted<string>[];
  MaxResults?: number;
  DataSource: string;
  Language?: string;
  FilterCategories?: string | redacted.Redacted<string>[];
}
export const SearchPlaceIndexForSuggestionsSummary = S.suspend(() =>
  S.Struct({
    Text: SensitiveString,
    BiasPosition: S.optional(Position),
    FilterBBox: S.optional(BoundingBox),
    FilterCountries: S.optional(CountryCodeList),
    MaxResults: S.optional(S.Number),
    DataSource: S.String,
    Language: S.optional(S.String),
    FilterCategories: S.optional(FilterPlaceCategoryList),
  }),
).annotations({
  identifier: "SearchPlaceIndexForSuggestionsSummary",
}) as any as S.Schema<SearchPlaceIndexForSuggestionsSummary>;
export interface SearchForSuggestionsResult {
  Text: string | redacted.Redacted<string>;
  PlaceId?: string | redacted.Redacted<string>;
  Categories?: string | redacted.Redacted<string>[];
  SupplementalCategories?: string | redacted.Redacted<string>[];
}
export const SearchForSuggestionsResult = S.suspend(() =>
  S.Struct({
    Text: SensitiveString,
    PlaceId: S.optional(SensitiveString),
    Categories: S.optional(PlaceCategoryList),
    SupplementalCategories: S.optional(PlaceSupplementalCategoryList),
  }),
).annotations({
  identifier: "SearchForSuggestionsResult",
}) as any as S.Schema<SearchForSuggestionsResult>;
export type SearchForSuggestionsResultList = SearchForSuggestionsResult[];
export const SearchForSuggestionsResultList = S.Array(
  SearchForSuggestionsResult,
);
export interface SearchPlaceIndexForTextSummary {
  Text: string | redacted.Redacted<string>;
  BiasPosition?: number[];
  FilterBBox?: number[];
  FilterCountries?: string | redacted.Redacted<string>[];
  MaxResults?: number;
  ResultBBox?: number[];
  DataSource: string;
  Language?: string;
  FilterCategories?: string | redacted.Redacted<string>[];
}
export const SearchPlaceIndexForTextSummary = S.suspend(() =>
  S.Struct({
    Text: SensitiveString,
    BiasPosition: S.optional(Position),
    FilterBBox: S.optional(BoundingBox),
    FilterCountries: S.optional(CountryCodeList),
    MaxResults: S.optional(S.Number),
    ResultBBox: S.optional(BoundingBox),
    DataSource: S.String,
    Language: S.optional(S.String),
    FilterCategories: S.optional(FilterPlaceCategoryList),
  }),
).annotations({
  identifier: "SearchPlaceIndexForTextSummary",
}) as any as S.Schema<SearchPlaceIndexForTextSummary>;
export interface SearchForTextResult {
  Place: Place;
  Distance?: number;
  Relevance?: number;
  PlaceId?: string | redacted.Redacted<string>;
}
export const SearchForTextResult = S.suspend(() =>
  S.Struct({
    Place: Place,
    Distance: S.optional(S.Number),
    Relevance: S.optional(S.Number),
    PlaceId: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "SearchForTextResult",
}) as any as S.Schema<SearchForTextResult>;
export type SearchForTextResultList = SearchForTextResult[];
export const SearchForTextResultList = S.Array(SearchForTextResult);
export interface ListRouteCalculatorsResponseEntry {
  CalculatorName: string;
  Description: string;
  DataSource: string;
  PricingPlan?: string;
  CreateTime: Date;
  UpdateTime: Date;
}
export const ListRouteCalculatorsResponseEntry = S.suspend(() =>
  S.Struct({
    CalculatorName: S.String,
    Description: S.String,
    DataSource: S.String,
    PricingPlan: S.optional(S.String),
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListRouteCalculatorsResponseEntry",
}) as any as S.Schema<ListRouteCalculatorsResponseEntry>;
export type ListRouteCalculatorsResponseEntryList =
  ListRouteCalculatorsResponseEntry[];
export const ListRouteCalculatorsResponseEntryList = S.Array(
  ListRouteCalculatorsResponseEntry,
);
export interface CalculateRouteMatrixSummary {
  DataSource: string;
  RouteCount: number;
  ErrorCount: number;
  DistanceUnit: string;
}
export const CalculateRouteMatrixSummary = S.suspend(() =>
  S.Struct({
    DataSource: S.String,
    RouteCount: S.Number,
    ErrorCount: S.Number,
    DistanceUnit: S.String,
  }),
).annotations({
  identifier: "CalculateRouteMatrixSummary",
}) as any as S.Schema<CalculateRouteMatrixSummary>;
export interface ListTrackersResponseEntry {
  TrackerName: string;
  Description: string;
  PricingPlan?: string;
  PricingPlanDataSource?: string;
  CreateTime: Date;
  UpdateTime: Date;
}
export const ListTrackersResponseEntry = S.suspend(() =>
  S.Struct({
    TrackerName: S.String,
    Description: S.String,
    PricingPlan: S.optional(S.String),
    PricingPlanDataSource: S.optional(S.String),
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListTrackersResponseEntry",
}) as any as S.Schema<ListTrackersResponseEntry>;
export type ListTrackersResponseEntryList = ListTrackersResponseEntry[];
export const ListTrackersResponseEntryList = S.Array(ListTrackersResponseEntry);
export interface BatchItemError {
  Code?: string;
  Message?: string;
}
export const BatchItemError = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "BatchItemError",
}) as any as S.Schema<BatchItemError>;
export interface BatchDeleteDevicePositionHistoryError {
  DeviceId: string;
  Error: BatchItemError;
}
export const BatchDeleteDevicePositionHistoryError = S.suspend(() =>
  S.Struct({ DeviceId: S.String, Error: BatchItemError }),
).annotations({
  identifier: "BatchDeleteDevicePositionHistoryError",
}) as any as S.Schema<BatchDeleteDevicePositionHistoryError>;
export type BatchDeleteDevicePositionHistoryErrorList =
  BatchDeleteDevicePositionHistoryError[];
export const BatchDeleteDevicePositionHistoryErrorList = S.Array(
  BatchDeleteDevicePositionHistoryError,
);
export interface BatchGetDevicePositionError {
  DeviceId: string;
  Error: BatchItemError;
}
export const BatchGetDevicePositionError = S.suspend(() =>
  S.Struct({ DeviceId: S.String, Error: BatchItemError }),
).annotations({
  identifier: "BatchGetDevicePositionError",
}) as any as S.Schema<BatchGetDevicePositionError>;
export type BatchGetDevicePositionErrorList = BatchGetDevicePositionError[];
export const BatchGetDevicePositionErrorList = S.Array(
  BatchGetDevicePositionError,
);
export interface BatchUpdateDevicePositionError {
  DeviceId: string;
  SampleTime: Date;
  Error: BatchItemError;
}
export const BatchUpdateDevicePositionError = S.suspend(() =>
  S.Struct({
    DeviceId: S.String,
    SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
    Error: BatchItemError,
  }),
).annotations({
  identifier: "BatchUpdateDevicePositionError",
}) as any as S.Schema<BatchUpdateDevicePositionError>;
export type BatchUpdateDevicePositionErrorList =
  BatchUpdateDevicePositionError[];
export const BatchUpdateDevicePositionErrorList = S.Array(
  BatchUpdateDevicePositionError,
);
export interface CreateKeyRequest {
  KeyName: string;
  Restrictions: ApiKeyRestrictions;
  Description?: string;
  ExpireTime?: Date;
  NoExpiry?: boolean;
  Tags?: { [key: string]: string | undefined };
}
export const CreateKeyRequest = S.suspend(() =>
  S.Struct({
    KeyName: S.String,
    Restrictions: ApiKeyRestrictions,
    Description: S.optional(S.String),
    ExpireTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NoExpiry: S.optional(S.Boolean),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/metadata/v0/keys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateKeyRequest",
}) as any as S.Schema<CreateKeyRequest>;
export interface ListGeofenceCollectionsResponse {
  Entries: ListGeofenceCollectionsResponseEntry[];
  NextToken?: string;
}
export const ListGeofenceCollectionsResponse = S.suspend(() =>
  S.Struct({
    Entries: ListGeofenceCollectionsResponseEntryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListGeofenceCollectionsResponse",
}) as any as S.Schema<ListGeofenceCollectionsResponse>;
export interface BatchEvaluateGeofencesRequest {
  CollectionName: string;
  DevicePositionUpdates: DevicePositionUpdate[];
}
export const BatchEvaluateGeofencesRequest = S.suspend(() =>
  S.Struct({
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    DevicePositionUpdates: DevicePositionUpdateList,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchEvaluateGeofencesRequest",
}) as any as S.Schema<BatchEvaluateGeofencesRequest>;
export interface ListGeofencesResponse {
  Entries: ListGeofenceResponseEntry[];
  NextToken?: string;
}
export const ListGeofencesResponse = S.suspend(() =>
  S.Struct({
    Entries: ListGeofenceResponseEntryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListGeofencesResponse",
}) as any as S.Schema<ListGeofencesResponse>;
export interface PutGeofenceRequest {
  CollectionName: string;
  GeofenceId: string;
  Geometry: GeofenceGeometry;
  GeofenceProperties?: { [key: string]: string | undefined };
}
export const PutGeofenceRequest = S.suspend(() =>
  S.Struct({
    CollectionName: S.String.pipe(T.HttpLabel("CollectionName")),
    GeofenceId: S.String.pipe(T.HttpLabel("GeofenceId")),
    Geometry: GeofenceGeometry,
    GeofenceProperties: S.optional(PropertyMap),
  }).pipe(
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
  ),
).annotations({
  identifier: "PutGeofenceRequest",
}) as any as S.Schema<PutGeofenceRequest>;
export interface CreateMapResponse {
  MapName: string;
  MapArn: string;
  CreateTime: Date;
}
export const CreateMapResponse = S.suspend(() =>
  S.Struct({
    MapName: S.String,
    MapArn: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateMapResponse",
}) as any as S.Schema<CreateMapResponse>;
export interface UpdateMapResponse {
  MapName: string;
  MapArn: string;
  UpdateTime: Date;
}
export const UpdateMapResponse = S.suspend(() =>
  S.Struct({
    MapName: S.String,
    MapArn: S.String,
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateMapResponse",
}) as any as S.Schema<UpdateMapResponse>;
export interface ListMapsResponse {
  Entries: ListMapsResponseEntry[];
  NextToken?: string;
}
export const ListMapsResponse = S.suspend(() =>
  S.Struct({
    Entries: ListMapsResponseEntryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMapsResponse",
}) as any as S.Schema<ListMapsResponse>;
export interface CreatePlaceIndexResponse {
  IndexName: string;
  IndexArn: string;
  CreateTime: Date;
}
export const CreatePlaceIndexResponse = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    IndexArn: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreatePlaceIndexResponse",
}) as any as S.Schema<CreatePlaceIndexResponse>;
export interface ListPlaceIndexesResponse {
  Entries: ListPlaceIndexesResponseEntry[];
  NextToken?: string;
}
export const ListPlaceIndexesResponse = S.suspend(() =>
  S.Struct({
    Entries: ListPlaceIndexesResponseEntryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPlaceIndexesResponse",
}) as any as S.Schema<ListPlaceIndexesResponse>;
export interface SearchPlaceIndexForPositionResponse {
  Summary: SearchPlaceIndexForPositionSummary;
  Results: SearchForPositionResult[];
}
export const SearchPlaceIndexForPositionResponse = S.suspend(() =>
  S.Struct({
    Summary: SearchPlaceIndexForPositionSummary,
    Results: SearchForPositionResultList,
  }),
).annotations({
  identifier: "SearchPlaceIndexForPositionResponse",
}) as any as S.Schema<SearchPlaceIndexForPositionResponse>;
export interface SearchPlaceIndexForSuggestionsResponse {
  Summary: SearchPlaceIndexForSuggestionsSummary;
  Results: SearchForSuggestionsResult[];
}
export const SearchPlaceIndexForSuggestionsResponse = S.suspend(() =>
  S.Struct({
    Summary: SearchPlaceIndexForSuggestionsSummary,
    Results: SearchForSuggestionsResultList,
  }),
).annotations({
  identifier: "SearchPlaceIndexForSuggestionsResponse",
}) as any as S.Schema<SearchPlaceIndexForSuggestionsResponse>;
export interface SearchPlaceIndexForTextResponse {
  Summary: SearchPlaceIndexForTextSummary;
  Results: SearchForTextResult[];
}
export const SearchPlaceIndexForTextResponse = S.suspend(() =>
  S.Struct({
    Summary: SearchPlaceIndexForTextSummary,
    Results: SearchForTextResultList,
  }),
).annotations({
  identifier: "SearchPlaceIndexForTextResponse",
}) as any as S.Schema<SearchPlaceIndexForTextResponse>;
export interface ListRouteCalculatorsResponse {
  Entries: ListRouteCalculatorsResponseEntry[];
  NextToken?: string;
}
export const ListRouteCalculatorsResponse = S.suspend(() =>
  S.Struct({
    Entries: ListRouteCalculatorsResponseEntryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRouteCalculatorsResponse",
}) as any as S.Schema<ListRouteCalculatorsResponse>;
export interface CalculateRouteRequest {
  CalculatorName: string;
  DeparturePosition: number[];
  DestinationPosition: number[];
  WaypointPositions?: number[][];
  TravelMode?: string;
  DepartureTime?: Date;
  DepartNow?: boolean;
  DistanceUnit?: string;
  IncludeLegGeometry?: boolean;
  CarModeOptions?: CalculateRouteCarModeOptions;
  TruckModeOptions?: CalculateRouteTruckModeOptions;
  ArrivalTime?: Date;
  OptimizeFor?: string;
  Key?: string | redacted.Redacted<string>;
}
export const CalculateRouteRequest = S.suspend(() =>
  S.Struct({
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
    Key: S.optional(SensitiveString).pipe(T.HttpQuery("key")),
  }).pipe(
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
  ),
).annotations({
  identifier: "CalculateRouteRequest",
}) as any as S.Schema<CalculateRouteRequest>;
export interface ListTrackersResponse {
  Entries: ListTrackersResponseEntry[];
  NextToken?: string;
}
export const ListTrackersResponse = S.suspend(() =>
  S.Struct({
    Entries: ListTrackersResponseEntryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTrackersResponse",
}) as any as S.Schema<ListTrackersResponse>;
export interface BatchDeleteDevicePositionHistoryResponse {
  Errors: BatchDeleteDevicePositionHistoryError[];
}
export const BatchDeleteDevicePositionHistoryResponse = S.suspend(() =>
  S.Struct({ Errors: BatchDeleteDevicePositionHistoryErrorList }),
).annotations({
  identifier: "BatchDeleteDevicePositionHistoryResponse",
}) as any as S.Schema<BatchDeleteDevicePositionHistoryResponse>;
export interface BatchGetDevicePositionResponse {
  Errors: BatchGetDevicePositionError[];
  DevicePositions: DevicePosition[];
}
export const BatchGetDevicePositionResponse = S.suspend(() =>
  S.Struct({
    Errors: BatchGetDevicePositionErrorList,
    DevicePositions: DevicePositionList,
  }),
).annotations({
  identifier: "BatchGetDevicePositionResponse",
}) as any as S.Schema<BatchGetDevicePositionResponse>;
export interface BatchUpdateDevicePositionResponse {
  Errors: BatchUpdateDevicePositionError[];
}
export const BatchUpdateDevicePositionResponse = S.suspend(() =>
  S.Struct({ Errors: BatchUpdateDevicePositionErrorList }),
).annotations({
  identifier: "BatchUpdateDevicePositionResponse",
}) as any as S.Schema<BatchUpdateDevicePositionResponse>;
export interface RouteMatrixEntryError {
  Code: string;
  Message?: string;
}
export const RouteMatrixEntryError = S.suspend(() =>
  S.Struct({ Code: S.String, Message: S.optional(S.String) }),
).annotations({
  identifier: "RouteMatrixEntryError",
}) as any as S.Schema<RouteMatrixEntryError>;
export interface LteLocalId {
  Earfcn: number;
  Pci: number;
}
export const LteLocalId = S.suspend(() =>
  S.Struct({ Earfcn: S.Number, Pci: S.Number }),
).annotations({ identifier: "LteLocalId" }) as any as S.Schema<LteLocalId>;
export interface LteNetworkMeasurements {
  Earfcn: number;
  CellId: number;
  Pci: number;
  Rsrp?: number;
  Rsrq?: number;
}
export const LteNetworkMeasurements = S.suspend(() =>
  S.Struct({
    Earfcn: S.Number,
    CellId: S.Number,
    Pci: S.Number,
    Rsrp: S.optional(S.Number),
    Rsrq: S.optional(S.Number),
  }),
).annotations({
  identifier: "LteNetworkMeasurements",
}) as any as S.Schema<LteNetworkMeasurements>;
export type LteNetworkMeasurementsList = LteNetworkMeasurements[];
export const LteNetworkMeasurementsList = S.Array(LteNetworkMeasurements);
export interface ListKeysResponseEntry {
  KeyName: string;
  ExpireTime: Date;
  Description?: string;
  Restrictions: ApiKeyRestrictions;
  CreateTime: Date;
  UpdateTime: Date;
}
export const ListKeysResponseEntry = S.suspend(() =>
  S.Struct({
    KeyName: S.String,
    ExpireTime: S.Date.pipe(T.TimestampFormat("date-time")),
    Description: S.optional(S.String),
    Restrictions: ApiKeyRestrictions,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ListKeysResponseEntry",
}) as any as S.Schema<ListKeysResponseEntry>;
export type ListKeysResponseEntryList = ListKeysResponseEntry[];
export const ListKeysResponseEntryList = S.Array(ListKeysResponseEntry);
export interface BatchDeleteGeofenceError {
  GeofenceId: string;
  Error: BatchItemError;
}
export const BatchDeleteGeofenceError = S.suspend(() =>
  S.Struct({ GeofenceId: S.String, Error: BatchItemError }),
).annotations({
  identifier: "BatchDeleteGeofenceError",
}) as any as S.Schema<BatchDeleteGeofenceError>;
export type BatchDeleteGeofenceErrorList = BatchDeleteGeofenceError[];
export const BatchDeleteGeofenceErrorList = S.Array(BatchDeleteGeofenceError);
export interface BatchPutGeofenceSuccess {
  GeofenceId: string;
  CreateTime: Date;
  UpdateTime: Date;
}
export const BatchPutGeofenceSuccess = S.suspend(() =>
  S.Struct({
    GeofenceId: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "BatchPutGeofenceSuccess",
}) as any as S.Schema<BatchPutGeofenceSuccess>;
export type BatchPutGeofenceSuccessList = BatchPutGeofenceSuccess[];
export const BatchPutGeofenceSuccessList = S.Array(BatchPutGeofenceSuccess);
export interface BatchPutGeofenceError {
  GeofenceId: string;
  Error: BatchItemError;
}
export const BatchPutGeofenceError = S.suspend(() =>
  S.Struct({ GeofenceId: S.String, Error: BatchItemError }),
).annotations({
  identifier: "BatchPutGeofenceError",
}) as any as S.Schema<BatchPutGeofenceError>;
export type BatchPutGeofenceErrorList = BatchPutGeofenceError[];
export const BatchPutGeofenceErrorList = S.Array(BatchPutGeofenceError);
export interface ForecastedEvent {
  EventId: string;
  GeofenceId: string;
  IsDeviceInGeofence: boolean;
  NearestDistance: number;
  EventType: string;
  ForecastedBreachTime?: Date;
  GeofenceProperties?: { [key: string]: string | undefined };
}
export const ForecastedEvent = S.suspend(() =>
  S.Struct({
    EventId: S.String,
    GeofenceId: S.String,
    IsDeviceInGeofence: S.Boolean,
    NearestDistance: S.Number,
    EventType: S.String,
    ForecastedBreachTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    GeofenceProperties: S.optional(PropertyMap),
  }),
).annotations({
  identifier: "ForecastedEvent",
}) as any as S.Schema<ForecastedEvent>;
export type ForecastedEventsList = ForecastedEvent[];
export const ForecastedEventsList = S.Array(ForecastedEvent);
export interface RouteMatrixEntry {
  Distance?: number;
  DurationSeconds?: number;
  Error?: RouteMatrixEntryError;
}
export const RouteMatrixEntry = S.suspend(() =>
  S.Struct({
    Distance: S.optional(S.Number),
    DurationSeconds: S.optional(S.Number),
    Error: S.optional(RouteMatrixEntryError),
  }),
).annotations({
  identifier: "RouteMatrixEntry",
}) as any as S.Schema<RouteMatrixEntry>;
export type RouteMatrixRow = RouteMatrixEntry[];
export const RouteMatrixRow = S.Array(RouteMatrixEntry);
export type RouteMatrix = RouteMatrixEntry[][];
export const RouteMatrix = S.Array(RouteMatrixRow);
export interface ListDevicePositionsResponseEntry {
  DeviceId: string;
  SampleTime: Date;
  Position: number[];
  Accuracy?: PositionalAccuracy;
  PositionProperties?: { [key: string]: string | undefined };
}
export const ListDevicePositionsResponseEntry = S.suspend(() =>
  S.Struct({
    DeviceId: S.String,
    SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
    Position: Position,
    Accuracy: S.optional(PositionalAccuracy),
    PositionProperties: S.optional(PositionPropertyMap),
  }),
).annotations({
  identifier: "ListDevicePositionsResponseEntry",
}) as any as S.Schema<ListDevicePositionsResponseEntry>;
export type ListDevicePositionsResponseEntryList =
  ListDevicePositionsResponseEntry[];
export const ListDevicePositionsResponseEntryList = S.Array(
  ListDevicePositionsResponseEntry,
);
export interface LteCellDetails {
  CellId: number;
  Mcc: number;
  Mnc: number;
  LocalId?: LteLocalId;
  NetworkMeasurements?: LteNetworkMeasurements[];
  TimingAdvance?: number;
  NrCapable?: boolean;
  Rsrp?: number;
  Rsrq?: number;
  Tac?: number;
}
export const LteCellDetails = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "LteCellDetails",
}) as any as S.Schema<LteCellDetails>;
export type LteCellDetailsList = LteCellDetails[];
export const LteCellDetailsList = S.Array(LteCellDetails);
export interface CreateKeyResponse {
  Key: string | redacted.Redacted<string>;
  KeyArn: string;
  KeyName: string;
  CreateTime: Date;
}
export const CreateKeyResponse = S.suspend(() =>
  S.Struct({
    Key: SensitiveString,
    KeyArn: S.String,
    KeyName: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateKeyResponse",
}) as any as S.Schema<CreateKeyResponse>;
export interface ListKeysResponse {
  Entries: ListKeysResponseEntry[];
  NextToken?: string;
}
export const ListKeysResponse = S.suspend(() =>
  S.Struct({
    Entries: ListKeysResponseEntryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListKeysResponse",
}) as any as S.Schema<ListKeysResponse>;
export interface BatchDeleteGeofenceResponse {
  Errors: BatchDeleteGeofenceError[];
}
export const BatchDeleteGeofenceResponse = S.suspend(() =>
  S.Struct({ Errors: BatchDeleteGeofenceErrorList }),
).annotations({
  identifier: "BatchDeleteGeofenceResponse",
}) as any as S.Schema<BatchDeleteGeofenceResponse>;
export interface BatchPutGeofenceResponse {
  Successes: BatchPutGeofenceSuccess[];
  Errors: BatchPutGeofenceError[];
}
export const BatchPutGeofenceResponse = S.suspend(() =>
  S.Struct({
    Successes: BatchPutGeofenceSuccessList,
    Errors: BatchPutGeofenceErrorList,
  }),
).annotations({
  identifier: "BatchPutGeofenceResponse",
}) as any as S.Schema<BatchPutGeofenceResponse>;
export interface ForecastGeofenceEventsResponse {
  ForecastedEvents: ForecastedEvent[];
  NextToken?: string;
  DistanceUnit: string;
  SpeedUnit: string;
}
export const ForecastGeofenceEventsResponse = S.suspend(() =>
  S.Struct({
    ForecastedEvents: ForecastedEventsList,
    NextToken: S.optional(S.String),
    DistanceUnit: S.String,
    SpeedUnit: S.String,
  }),
).annotations({
  identifier: "ForecastGeofenceEventsResponse",
}) as any as S.Schema<ForecastGeofenceEventsResponse>;
export interface PutGeofenceResponse {
  GeofenceId: string;
  CreateTime: Date;
  UpdateTime: Date;
}
export const PutGeofenceResponse = S.suspend(() =>
  S.Struct({
    GeofenceId: S.String,
    CreateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "PutGeofenceResponse",
}) as any as S.Schema<PutGeofenceResponse>;
export interface GetPlaceResponse {
  Place: Place;
}
export const GetPlaceResponse = S.suspend(() =>
  S.Struct({ Place: Place }),
).annotations({
  identifier: "GetPlaceResponse",
}) as any as S.Schema<GetPlaceResponse>;
export interface CalculateRouteMatrixResponse {
  RouteMatrix: RouteMatrixEntry[][];
  SnappedDeparturePositions?: number[][];
  SnappedDestinationPositions?: number[][];
  Summary: CalculateRouteMatrixSummary;
}
export const CalculateRouteMatrixResponse = S.suspend(() =>
  S.Struct({
    RouteMatrix: RouteMatrix,
    SnappedDeparturePositions: S.optional(PositionList),
    SnappedDestinationPositions: S.optional(PositionList),
    Summary: CalculateRouteMatrixSummary,
  }),
).annotations({
  identifier: "CalculateRouteMatrixResponse",
}) as any as S.Schema<CalculateRouteMatrixResponse>;
export interface ListDevicePositionsResponse {
  Entries: ListDevicePositionsResponseEntry[];
  NextToken?: string;
}
export const ListDevicePositionsResponse = S.suspend(() =>
  S.Struct({
    Entries: ListDevicePositionsResponseEntryList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDevicePositionsResponse",
}) as any as S.Schema<ListDevicePositionsResponse>;
export interface CellSignals {
  LteCellDetails: LteCellDetails[];
}
export const CellSignals = S.suspend(() =>
  S.Struct({ LteCellDetails: LteCellDetailsList }),
).annotations({ identifier: "CellSignals" }) as any as S.Schema<CellSignals>;
export interface BatchEvaluateGeofencesError {
  DeviceId: string;
  SampleTime: Date;
  Error: BatchItemError;
}
export const BatchEvaluateGeofencesError = S.suspend(() =>
  S.Struct({
    DeviceId: S.String,
    SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
    Error: BatchItemError,
  }),
).annotations({
  identifier: "BatchEvaluateGeofencesError",
}) as any as S.Schema<BatchEvaluateGeofencesError>;
export type BatchEvaluateGeofencesErrorList = BatchEvaluateGeofencesError[];
export const BatchEvaluateGeofencesErrorList = S.Array(
  BatchEvaluateGeofencesError,
);
export interface CalculateRouteSummary {
  RouteBBox: number[];
  DataSource: string;
  Distance: number;
  DurationSeconds: number;
  DistanceUnit: string;
}
export const CalculateRouteSummary = S.suspend(() =>
  S.Struct({
    RouteBBox: BoundingBox,
    DataSource: S.String,
    Distance: S.Number,
    DurationSeconds: S.Number,
    DistanceUnit: S.String,
  }),
).annotations({
  identifier: "CalculateRouteSummary",
}) as any as S.Schema<CalculateRouteSummary>;
export interface DeviceState {
  DeviceId: string;
  SampleTime: Date;
  Position: number[];
  Accuracy?: PositionalAccuracy;
  Ipv4Address?: string;
  WiFiAccessPoints?: WiFiAccessPoint[];
  CellSignals?: CellSignals;
}
export const DeviceState = S.suspend(() =>
  S.Struct({
    DeviceId: S.String,
    SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
    Position: Position,
    Accuracy: S.optional(PositionalAccuracy),
    Ipv4Address: S.optional(S.String),
    WiFiAccessPoints: S.optional(WiFiAccessPointList),
    CellSignals: S.optional(CellSignals),
  }),
).annotations({ identifier: "DeviceState" }) as any as S.Schema<DeviceState>;
export type LineString = number[][];
export const LineString = S.Array(Position);
export interface BatchEvaluateGeofencesResponse {
  Errors: BatchEvaluateGeofencesError[];
}
export const BatchEvaluateGeofencesResponse = S.suspend(() =>
  S.Struct({ Errors: BatchEvaluateGeofencesErrorList }),
).annotations({
  identifier: "BatchEvaluateGeofencesResponse",
}) as any as S.Schema<BatchEvaluateGeofencesResponse>;
export interface VerifyDevicePositionRequest {
  TrackerName: string;
  DeviceState: DeviceState;
  DistanceUnit?: string;
}
export const VerifyDevicePositionRequest = S.suspend(() =>
  S.Struct({
    TrackerName: S.String.pipe(T.HttpLabel("TrackerName")),
    DeviceState: DeviceState,
    DistanceUnit: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "VerifyDevicePositionRequest",
}) as any as S.Schema<VerifyDevicePositionRequest>;
export interface LegGeometry {
  LineString?: number[][];
}
export const LegGeometry = S.suspend(() =>
  S.Struct({ LineString: S.optional(LineString) }),
).annotations({ identifier: "LegGeometry" }) as any as S.Schema<LegGeometry>;
export interface Step {
  StartPosition: number[];
  EndPosition: number[];
  Distance: number;
  DurationSeconds: number;
  GeometryOffset?: number;
}
export const Step = S.suspend(() =>
  S.Struct({
    StartPosition: Position,
    EndPosition: Position,
    Distance: S.Number,
    DurationSeconds: S.Number,
    GeometryOffset: S.optional(S.Number),
  }),
).annotations({ identifier: "Step" }) as any as S.Schema<Step>;
export type StepList = Step[];
export const StepList = S.Array(Step);
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
export interface Leg {
  StartPosition: number[];
  EndPosition: number[];
  Distance: number;
  DurationSeconds: number;
  Geometry?: LegGeometry;
  Steps: Step[];
}
export const Leg = S.suspend(() =>
  S.Struct({
    StartPosition: Position,
    EndPosition: Position,
    Distance: S.Number,
    DurationSeconds: S.Number,
    Geometry: S.optional(LegGeometry),
    Steps: StepList,
  }),
).annotations({ identifier: "Leg" }) as any as S.Schema<Leg>;
export type LegList = Leg[];
export const LegList = S.Array(Leg);
export interface CalculateRouteResponse {
  Legs: Leg[];
  Summary: CalculateRouteSummary;
}
export const CalculateRouteResponse = S.suspend(() =>
  S.Struct({ Legs: LegList, Summary: CalculateRouteSummary }),
).annotations({
  identifier: "CalculateRouteResponse",
}) as any as S.Schema<CalculateRouteResponse>;
export interface InferredState {
  Position?: number[];
  Accuracy?: PositionalAccuracy;
  DeviationDistance?: number;
  ProxyDetected: boolean;
}
export const InferredState = S.suspend(() =>
  S.Struct({
    Position: S.optional(Position),
    Accuracy: S.optional(PositionalAccuracy),
    DeviationDistance: S.optional(S.Number),
    ProxyDetected: S.Boolean,
  }),
).annotations({
  identifier: "InferredState",
}) as any as S.Schema<InferredState>;
export interface VerifyDevicePositionResponse {
  InferredState: InferredState;
  DeviceId: string;
  SampleTime: Date;
  ReceivedTime: Date;
  DistanceUnit: string;
}
export const VerifyDevicePositionResponse = S.suspend(() =>
  S.Struct({
    InferredState: InferredState,
    DeviceId: S.String,
    SampleTime: S.Date.pipe(T.TimestampFormat("date-time")),
    ReceivedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    DistanceUnit: S.String,
  }),
).annotations({
  identifier: "VerifyDevicePositionResponse",
}) as any as S.Schema<VerifyDevicePositionResponse>;

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
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String.pipe(T.JsonName("message")) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String.pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String.pipe(T.JsonName("message")) },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String.pipe(T.JsonName("message")) },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
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
 * Lists geofence collections in your Amazon Web Services account.
 */
export const listGeofenceCollections: {
  (
    input: ListGeofenceCollectionsRequest,
  ): effect.Effect<
    ListGeofenceCollectionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGeofenceCollectionsRequest,
  ) => stream.Stream<
    ListGeofenceCollectionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGeofenceCollectionsRequest,
  ) => stream.Stream<
    ListGeofenceCollectionsResponseEntry,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const calculateRoute: (
  input: CalculateRouteRequest,
) => effect.Effect<
  CalculateRouteResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDeleteGeofence: (
  input: BatchDeleteGeofenceRequest,
) => effect.Effect<
  BatchDeleteGeofenceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchPutGeofence: (
  input: BatchPutGeofenceRequest,
) => effect.Effect<
  BatchPutGeofenceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const forecastGeofenceEvents: {
  (
    input: ForecastGeofenceEventsRequest,
  ): effect.Effect<
    ForecastGeofenceEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ForecastGeofenceEventsRequest,
  ) => stream.Stream<
    ForecastGeofenceEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ForecastGeofenceEventsRequest,
  ) => stream.Stream<
    ForecastedEvent,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putGeofence: (
  input: PutGeofenceRequest,
) => effect.Effect<
  PutGeofenceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPlace: (
  input: GetPlaceRequest,
) => effect.Effect<
  GetPlaceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const calculateRouteMatrix: (
  input: CalculateRouteMatrixRequest,
) => effect.Effect<
  CalculateRouteMatrixResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CalculateRouteMatrixRequest,
  output: CalculateRouteMatrixResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * A batch request to retrieve all device positions.
 */
export const listDevicePositions: {
  (
    input: ListDevicePositionsRequest,
  ): effect.Effect<
    ListDevicePositionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevicePositionsRequest,
  ) => stream.Stream<
    ListDevicePositionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDevicePositionsRequest,
  ) => stream.Stream<
    ListDevicePositionsResponseEntry,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listGeofences: {
  (
    input: ListGeofencesRequest,
  ): effect.Effect<
    ListGeofencesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGeofencesRequest,
  ) => stream.Stream<
    ListGeofencesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGeofencesRequest,
  ) => stream.Stream<
    ListGeofenceResponseEntry,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
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
export const updateMap: (
  input: UpdateMapRequest,
) => effect.Effect<
  UpdateMapResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchPlaceIndexForPosition: (
  input: SearchPlaceIndexForPositionRequest,
) => effect.Effect<
  SearchPlaceIndexForPositionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchPlaceIndexForPositionRequest,
  output: SearchPlaceIndexForPositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
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
export const searchPlaceIndexForSuggestions: (
  input: SearchPlaceIndexForSuggestionsRequest,
) => effect.Effect<
  SearchPlaceIndexForSuggestionsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchPlaceIndexForText: (
  input: SearchPlaceIndexForTextRequest,
) => effect.Effect<
  SearchPlaceIndexForTextResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchPlaceIndexForTextRequest,
  output: SearchPlaceIndexForTextResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the position history of one or more devices from a tracker resource.
 */
export const batchDeleteDevicePositionHistory: (
  input: BatchDeleteDevicePositionHistoryRequest,
) => effect.Effect<
  BatchDeleteDevicePositionHistoryResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetDevicePosition: (
  input: BatchGetDevicePositionRequest,
) => effect.Effect<
  BatchGetDevicePositionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetDevicePositionRequest,
  output: BatchGetDevicePositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Uploads position update data for one or more devices to a tracker resource (up to 10 devices per batch). Amazon Location uses the data when it reports the last known device position and position history. Amazon Location retains location data for 30 days.
 *
 * Position updates are handled based on the `PositionFiltering` property of the tracker. When `PositionFiltering` is set to `TimeBased`, updates are evaluated against linked geofence collections, and location data is stored at a maximum of one position per 30 second interval. If your update frequency is more often than every 30 seconds, only one update per 30 seconds is stored for each unique device ID.
 *
 * When `PositionFiltering` is set to `DistanceBased` filtering, location data is stored and evaluated against linked geofence collections only if the device has moved more than 30 m (98.4 ft).
 *
 * When `PositionFiltering` is set to `AccuracyBased` filtering, location data is stored and evaluated against linked geofence collections only if the device has moved more than the measured accuracy. For example, if two consecutive updates from a device have a horizontal accuracy of 5 m and 10 m, the second update is neither stored or evaluated if the device has moved less than 15 m. If `PositionFiltering` is set to `AccuracyBased` filtering, Amazon Location uses the default value `{ "Horizontal": 0}` when accuracy is not provided on a `DevicePositionUpdate`.
 */
export const batchUpdateDevicePosition: (
  input: BatchUpdateDevicePositionRequest,
) => effect.Effect<
  BatchUpdateDevicePositionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateDevicePositionRequest,
  output: BatchUpdateDevicePositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tags that are applied to the specified Amazon Location resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
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
 * Retrieves the geofence collection details.
 */
export const describeGeofenceCollection: (
  input: DescribeGeofenceCollectionRequest,
) => effect.Effect<
  DescribeGeofenceCollectionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGeofenceCollectionRequest,
  output: DescribeGeofenceCollectionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the specified properties of a given geofence collection.
 */
export const updateGeofenceCollection: (
  input: UpdateGeofenceCollectionRequest,
) => effect.Effect<
  UpdateGeofenceCollectionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGeofenceCollectionRequest,
  output: UpdateGeofenceCollectionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the geofence details from a geofence collection.
 *
 * The returned geometry will always match the geometry format used when the geofence was created.
 */
export const getGeofence: (
  input: GetGeofenceRequest,
) => effect.Effect<
  GetGeofenceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeMap: (
  input: DescribeMapRequest,
) => effect.Effect<
  DescribeMapResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMapGlyphs: (
  input: GetMapGlyphsRequest,
) => effect.Effect<
  GetMapGlyphsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMapSprites: (
  input: GetMapSpritesRequest,
) => effect.Effect<
  GetMapSpritesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMapStyleDescriptor: (
  input: GetMapStyleDescriptorRequest,
) => effect.Effect<
  GetMapStyleDescriptorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMapStyleDescriptorRequest,
  output: GetMapStyleDescriptorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
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
export const getMapTile: (
  input: GetMapTileRequest,
) => effect.Effect<
  GetMapTileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describePlaceIndex: (
  input: DescribePlaceIndexRequest,
) => effect.Effect<
  DescribePlaceIndexResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePlaceIndex: (
  input: UpdatePlaceIndexRequest,
) => effect.Effect<
  UpdatePlaceIndexResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeRouteCalculator: (
  input: DescribeRouteCalculatorRequest,
) => effect.Effect<
  DescribeRouteCalculatorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRouteCalculatorRequest,
  output: DescribeRouteCalculatorResponse,
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
export const updateRouteCalculator: (
  input: UpdateRouteCalculatorRequest,
) => effect.Effect<
  UpdateRouteCalculatorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRouteCalculatorRequest,
  output: UpdateRouteCalculatorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the tracker resource details.
 */
export const describeTracker: (
  input: DescribeTrackerRequest,
) => effect.Effect<
  DescribeTrackerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTracker: (
  input: UpdateTrackerRequest,
) => effect.Effect<
  UpdateTrackerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDevicePosition: (
  input: GetDevicePositionRequest,
) => effect.Effect<
  GetDevicePositionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDevicePositionHistory: {
  (
    input: GetDevicePositionHistoryRequest,
  ): effect.Effect<
    GetDevicePositionHistoryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDevicePositionHistoryRequest,
  ) => stream.Stream<
    GetDevicePositionHistoryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDevicePositionHistoryRequest,
  ) => stream.Stream<
    DevicePosition,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTrackerConsumers: {
  (
    input: ListTrackerConsumersRequest,
  ): effect.Effect<
    ListTrackerConsumersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrackerConsumersRequest,
  ) => stream.Stream<
    ListTrackerConsumersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrackerConsumersRequest,
  ) => stream.Stream<
    Arn,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
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
 * Removes one or more tags from the specified Amazon Location resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
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
 * Deletes a geofence collection from your Amazon Web Services account.
 *
 * This operation deletes the resource permanently. If the geofence collection is the target of a tracker resource, the devices will no longer be monitored.
 */
export const deleteGeofenceCollection: (
  input: DeleteGeofenceCollectionRequest,
) => effect.Effect<
  DeleteGeofenceCollectionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGeofenceCollectionRequest,
  output: DeleteGeofenceCollectionResponse,
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
export const deleteMap: (
  input: DeleteMapRequest,
) => effect.Effect<
  DeleteMapResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePlaceIndex: (
  input: DeletePlaceIndexRequest,
) => effect.Effect<
  DeletePlaceIndexResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRouteCalculator: (
  input: DeleteRouteCalculatorRequest,
) => effect.Effect<
  DeleteRouteCalculatorResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRouteCalculatorRequest,
  output: DeleteRouteCalculatorResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a tracker resource from your Amazon Web Services account.
 *
 * This operation deletes the resource permanently. If the tracker resource is in use, you may encounter an error. Make sure that the target resource isn't a dependency for your applications.
 */
export const deleteTracker: (
  input: DeleteTrackerRequest,
) => effect.Effect<
  DeleteTrackerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateTrackerConsumer: (
  input: DisassociateTrackerConsumerRequest,
) => effect.Effect<
  DisassociateTrackerConsumerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateTrackerConsumerRequest,
  output: DisassociateTrackerConsumerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the API key resource details.
 *
 * For more information, see Use API keys to authenticate in the *Amazon Location Service Developer Guide*.
 */
export const describeKey: (
  input: DescribeKeyRequest,
) => effect.Effect<
  DescribeKeyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateKey: (
  input: UpdateKeyRequest,
) => effect.Effect<
  UpdateKeyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const associateTrackerConsumer: (
  input: AssociateTrackerConsumerRequest,
) => effect.Effect<
  AssociateTrackerConsumerResponse,
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
}));
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
export const createMap: (
  input: CreateMapRequest,
) => effect.Effect<
  CreateMapResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createPlaceIndex: (
  input: CreatePlaceIndexRequest,
) => effect.Effect<
  CreatePlaceIndexResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRouteCalculator: (
  input: CreateRouteCalculatorRequest,
) => effect.Effect<
  CreateRouteCalculatorResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a tracker resource in your Amazon Web Services account, which lets you retrieve current and historical location of devices.
 */
export const createTracker: (
  input: CreateTrackerRequest,
) => effect.Effect<
  CreateTrackerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createKey: (
  input: CreateKeyRequest,
) => effect.Effect<
  CreateKeyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listMaps: {
  (
    input: ListMapsRequest,
  ): effect.Effect<
    ListMapsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMapsRequest,
  ) => stream.Stream<
    ListMapsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMapsRequest,
  ) => stream.Stream<
    ListMapsResponseEntry,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPlaceIndexes: {
  (
    input: ListPlaceIndexesRequest,
  ): effect.Effect<
    ListPlaceIndexesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPlaceIndexesRequest,
  ) => stream.Stream<
    ListPlaceIndexesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPlaceIndexesRequest,
  ) => stream.Stream<
    ListPlaceIndexesResponseEntry,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
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
export const listRouteCalculators: {
  (
    input: ListRouteCalculatorsRequest,
  ): effect.Effect<
    ListRouteCalculatorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRouteCalculatorsRequest,
  ) => stream.Stream<
    ListRouteCalculatorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRouteCalculatorsRequest,
  ) => stream.Stream<
    ListRouteCalculatorsResponseEntry,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTrackers: {
  (
    input: ListTrackersRequest,
  ): effect.Effect<
    ListTrackersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrackersRequest,
  ) => stream.Stream<
    ListTrackersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrackersRequest,
  ) => stream.Stream<
    ListTrackersResponseEntry,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Deletes the specified API key. The API key must have been deactivated more than 90 days previously.
 *
 * For more information, see Use API keys to authenticate in the *Amazon Location Service Developer Guide*.
 */
export const deleteKey: (
  input: DeleteKeyRequest,
) => effect.Effect<
  DeleteKeyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listKeys: {
  (
    input: ListKeysRequest,
  ): effect.Effect<
    ListKeysResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListKeysRequest,
  ) => stream.Stream<
    ListKeysResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListKeysRequest,
  ) => stream.Stream<
    ListKeysResponseEntry,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createGeofenceCollection: (
  input: CreateGeofenceCollectionRequest,
) => effect.Effect<
  CreateGeofenceCollectionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const batchEvaluateGeofences: (
  input: BatchEvaluateGeofencesRequest,
) => effect.Effect<
  BatchEvaluateGeofencesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchEvaluateGeofencesRequest,
  output: BatchEvaluateGeofencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Verifies the integrity of the device's position by determining if it was reported behind a proxy, and by comparing it to an inferred position estimated based on the device's state.
 *
 * The Location Integrity SDK provides enhanced features related to device verification, and it is available for use by request. To get access to the SDK, contact Sales Support.
 */
export const verifyDevicePosition: (
  input: VerifyDevicePositionRequest,
) => effect.Effect<
  VerifyDevicePositionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyDevicePositionRequest,
  output: VerifyDevicePositionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

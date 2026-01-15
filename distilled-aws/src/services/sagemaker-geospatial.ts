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
  sdkId: "SageMaker Geospatial",
  serviceShapeName: "SageMakerGeospatial",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker-geospatial" });
const ver = T.ServiceVersion("2020-05-27");
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
              `https://sagemaker-geospatial-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://sagemaker-geospatial-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://sagemaker-geospatial.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://sagemaker-geospatial.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type KmsKey = string;
export type ExecutionRoleArn = string;
export type EarthObservationJobArn = string;
export type EarthObservationJobStatus = string;
export type SortOrder = string;
export type NextToken = string | redacted.Redacted<string>;
export type TargetOptions = string;
export type OutputType = string;
export type DataCollectionArn = string;
export type VectorEnrichmentJobArn = string;
export type VectorEnrichmentJobDocumentType = string;
export type EarthObservationJobExportStatus = string;
export type DataCollectionType = string;
export type VectorEnrichmentJobType = string;
export type VectorEnrichmentJobStatus = string;
export type VectorEnrichmentJobExportStatus = string;
export type AlgorithmNameResampling = string;
export type GroupBy = string;
export type TemporalStatistics = string;
export type AlgorithmNameCloudRemoval = string;
export type S3Uri = string;
export type ZonalStatistics = string;
export type AlgorithmNameGeoMosaic = string;
export type LogicalOperator = string;
export type EarthObservationJobErrorType = string;
export type VectorEnrichmentJobErrorType = string;
export type VectorEnrichmentJobExportErrorType = string;
export type PredefinedResolution = string;
export type ExportErrorType = string;
export type Unit = string;
export type ComparisonOperator = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type StringListInput = string[];
export const StringListInput = S.Array(S.String);
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
  TagKeys: string[];
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
export interface GetEarthObservationJobInput {
  Arn: string;
}
export const GetEarthObservationJobInput = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/earth-observation-jobs/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEarthObservationJobInput",
}) as any as S.Schema<GetEarthObservationJobInput>;
export interface DeleteEarthObservationJobInput {
  Arn: string;
}
export const DeleteEarthObservationJobInput = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/earth-observation-jobs/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEarthObservationJobInput",
}) as any as S.Schema<DeleteEarthObservationJobInput>;
export interface DeleteEarthObservationJobOutput {}
export const DeleteEarthObservationJobOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEarthObservationJobOutput",
}) as any as S.Schema<DeleteEarthObservationJobOutput>;
export interface ListEarthObservationJobInput {
  StatusEquals?: string;
  SortOrder?: string;
  SortBy?: string;
  NextToken?: string | redacted.Redacted<string>;
  MaxResults?: number;
}
export const ListEarthObservationJobInput = S.suspend(() =>
  S.Struct({
    StatusEquals: S.optional(S.String),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    NextToken: S.optional(SensitiveString),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-earth-observation-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEarthObservationJobInput",
}) as any as S.Schema<ListEarthObservationJobInput>;
export interface GetTileInput {
  x: number;
  y: number;
  z: number;
  ImageAssets: string[];
  Target: string;
  Arn: string;
  ImageMask?: boolean;
  OutputFormat?: string;
  TimeRangeFilter?: string;
  PropertyFilters?: string;
  OutputDataType?: string;
  ExecutionRoleArn?: string;
}
export const GetTileInput = S.suspend(() =>
  S.Struct({
    x: S.Number.pipe(T.HttpLabel("x")),
    y: S.Number.pipe(T.HttpLabel("y")),
    z: S.Number.pipe(T.HttpLabel("z")),
    ImageAssets: StringListInput.pipe(T.HttpQuery("ImageAssets")),
    Target: S.String.pipe(T.HttpQuery("Target")),
    Arn: S.String.pipe(T.HttpQuery("Arn")),
    ImageMask: S.optional(S.Boolean).pipe(T.HttpQuery("ImageMask")),
    OutputFormat: S.optional(S.String).pipe(T.HttpQuery("OutputFormat")),
    TimeRangeFilter: S.optional(S.String).pipe(T.HttpQuery("TimeRangeFilter")),
    PropertyFilters: S.optional(S.String).pipe(T.HttpQuery("PropertyFilters")),
    OutputDataType: S.optional(S.String).pipe(T.HttpQuery("OutputDataType")),
    ExecutionRoleArn: S.optional(S.String).pipe(
      T.HttpQuery("ExecutionRoleArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tile/{z}/{x}/{y}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetTileInput" }) as any as S.Schema<GetTileInput>;
export interface StopEarthObservationJobInput {
  Arn: string;
}
export const StopEarthObservationJobInput = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/earth-observation-jobs/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopEarthObservationJobInput",
}) as any as S.Schema<StopEarthObservationJobInput>;
export interface StopEarthObservationJobOutput {}
export const StopEarthObservationJobOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopEarthObservationJobOutput",
}) as any as S.Schema<StopEarthObservationJobOutput>;
export interface GetRasterDataCollectionInput {
  Arn: string;
}
export const GetRasterDataCollectionInput = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/raster-data-collection/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRasterDataCollectionInput",
}) as any as S.Schema<GetRasterDataCollectionInput>;
export interface ListRasterDataCollectionsInput {
  NextToken?: string | redacted.Redacted<string>;
  MaxResults?: number;
}
export const ListRasterDataCollectionsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(SensitiveString).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/raster-data-collections" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRasterDataCollectionsInput",
}) as any as S.Schema<ListRasterDataCollectionsInput>;
export interface GetVectorEnrichmentJobInput {
  Arn: string;
}
export const GetVectorEnrichmentJobInput = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/vector-enrichment-jobs/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetVectorEnrichmentJobInput",
}) as any as S.Schema<GetVectorEnrichmentJobInput>;
export interface DeleteVectorEnrichmentJobInput {
  Arn: string;
}
export const DeleteVectorEnrichmentJobInput = S.suspend(() =>
  S.Struct({ Arn: S.String.pipe(T.HttpLabel("Arn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/vector-enrichment-jobs/{Arn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteVectorEnrichmentJobInput",
}) as any as S.Schema<DeleteVectorEnrichmentJobInput>;
export interface DeleteVectorEnrichmentJobOutput {}
export const DeleteVectorEnrichmentJobOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteVectorEnrichmentJobOutput",
}) as any as S.Schema<DeleteVectorEnrichmentJobOutput>;
export interface ListVectorEnrichmentJobInput {
  StatusEquals?: string;
  SortOrder?: string;
  SortBy?: string;
  NextToken?: string | redacted.Redacted<string>;
  MaxResults?: number;
}
export const ListVectorEnrichmentJobInput = S.suspend(() =>
  S.Struct({
    StatusEquals: S.optional(S.String),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    NextToken: S.optional(SensitiveString),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-vector-enrichment-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListVectorEnrichmentJobInput",
}) as any as S.Schema<ListVectorEnrichmentJobInput>;
export interface StopVectorEnrichmentJobInput {
  Arn: string;
}
export const StopVectorEnrichmentJobInput = S.suspend(() =>
  S.Struct({ Arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/vector-enrichment-jobs/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopVectorEnrichmentJobInput",
}) as any as S.Schema<StopVectorEnrichmentJobInput>;
export interface StopVectorEnrichmentJobOutput {}
export const StopVectorEnrichmentJobOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopVectorEnrichmentJobOutput",
}) as any as S.Schema<StopVectorEnrichmentJobOutput>;
export interface CloudMaskingConfigInput {}
export const CloudMaskingConfigInput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CloudMaskingConfigInput",
}) as any as S.Schema<CloudMaskingConfigInput>;
export interface LandCoverSegmentationConfigInput {}
export const LandCoverSegmentationConfigInput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "LandCoverSegmentationConfigInput",
}) as any as S.Schema<LandCoverSegmentationConfigInput>;
export type Tags = { [key: string]: string | undefined };
export const Tags = S.Record({ key: S.String, value: S.UndefinedOr(S.String) });
export type ImageSourceBandList = string[];
export const ImageSourceBandList = S.Array(S.String);
export type TemporalStatisticsListInput = string[];
export const TemporalStatisticsListInput = S.Array(S.String);
export type ZonalStatisticsListInput = string[];
export const ZonalStatisticsListInput = S.Array(S.String);
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
export interface GetTileOutput {
  BinaryFile?: T.StreamingOutputBody;
}
export const GetTileOutput = S.suspend(() =>
  S.Struct({ BinaryFile: S.optional(T.StreamingOutput).pipe(T.HttpPayload()) }),
).annotations({
  identifier: "GetTileOutput",
}) as any as S.Schema<GetTileOutput>;
export interface TimeRangeFilterInput {
  StartTime: Date;
  EndTime: Date;
}
export const TimeRangeFilterInput = S.suspend(() =>
  S.Struct({
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "TimeRangeFilterInput",
}) as any as S.Schema<TimeRangeFilterInput>;
export type Position = number[];
export const Position = S.Array(S.Number);
export type LinearRing = number[][];
export const LinearRing = S.Array(Position);
export type LinearRings = number[][][];
export const LinearRings = S.Array(LinearRing);
export interface PolygonGeometryInput {
  Coordinates: number[][][];
}
export const PolygonGeometryInput = S.suspend(() =>
  S.Struct({ Coordinates: LinearRings }),
).annotations({
  identifier: "PolygonGeometryInput",
}) as any as S.Schema<PolygonGeometryInput>;
export type LinearRingsList = number[][][][];
export const LinearRingsList = S.Array(LinearRings);
export interface MultiPolygonGeometryInput {
  Coordinates: number[][][][];
}
export const MultiPolygonGeometryInput = S.suspend(() =>
  S.Struct({ Coordinates: LinearRingsList }),
).annotations({
  identifier: "MultiPolygonGeometryInput",
}) as any as S.Schema<MultiPolygonGeometryInput>;
export type AreaOfInterestGeometry =
  | { PolygonGeometry: PolygonGeometryInput; MultiPolygonGeometry?: never }
  | {
      PolygonGeometry?: never;
      MultiPolygonGeometry: MultiPolygonGeometryInput;
    };
export const AreaOfInterestGeometry = S.Union(
  S.Struct({ PolygonGeometry: PolygonGeometryInput }),
  S.Struct({ MultiPolygonGeometry: MultiPolygonGeometryInput }),
);
export type AreaOfInterest = { AreaOfInterestGeometry: AreaOfInterestGeometry };
export const AreaOfInterest = S.Union(
  S.Struct({ AreaOfInterestGeometry: AreaOfInterestGeometry }),
);
export interface EoCloudCoverInput {
  LowerBound: number;
  UpperBound: number;
}
export const EoCloudCoverInput = S.suspend(() =>
  S.Struct({ LowerBound: S.Number, UpperBound: S.Number }),
).annotations({
  identifier: "EoCloudCoverInput",
}) as any as S.Schema<EoCloudCoverInput>;
export interface ViewOffNadirInput {
  LowerBound: number;
  UpperBound: number;
}
export const ViewOffNadirInput = S.suspend(() =>
  S.Struct({ LowerBound: S.Number, UpperBound: S.Number }),
).annotations({
  identifier: "ViewOffNadirInput",
}) as any as S.Schema<ViewOffNadirInput>;
export interface ViewSunAzimuthInput {
  LowerBound: number;
  UpperBound: number;
}
export const ViewSunAzimuthInput = S.suspend(() =>
  S.Struct({ LowerBound: S.Number, UpperBound: S.Number }),
).annotations({
  identifier: "ViewSunAzimuthInput",
}) as any as S.Schema<ViewSunAzimuthInput>;
export interface ViewSunElevationInput {
  LowerBound: number;
  UpperBound: number;
}
export const ViewSunElevationInput = S.suspend(() =>
  S.Struct({ LowerBound: S.Number, UpperBound: S.Number }),
).annotations({
  identifier: "ViewSunElevationInput",
}) as any as S.Schema<ViewSunElevationInput>;
export interface PlatformInput {
  Value: string;
  ComparisonOperator?: string;
}
export const PlatformInput = S.suspend(() =>
  S.Struct({ Value: S.String, ComparisonOperator: S.optional(S.String) }),
).annotations({
  identifier: "PlatformInput",
}) as any as S.Schema<PlatformInput>;
export interface LandsatCloudCoverLandInput {
  LowerBound: number;
  UpperBound: number;
}
export const LandsatCloudCoverLandInput = S.suspend(() =>
  S.Struct({ LowerBound: S.Number, UpperBound: S.Number }),
).annotations({
  identifier: "LandsatCloudCoverLandInput",
}) as any as S.Schema<LandsatCloudCoverLandInput>;
export type Property =
  | {
      EoCloudCover: EoCloudCoverInput;
      ViewOffNadir?: never;
      ViewSunAzimuth?: never;
      ViewSunElevation?: never;
      Platform?: never;
      LandsatCloudCoverLand?: never;
    }
  | {
      EoCloudCover?: never;
      ViewOffNadir: ViewOffNadirInput;
      ViewSunAzimuth?: never;
      ViewSunElevation?: never;
      Platform?: never;
      LandsatCloudCoverLand?: never;
    }
  | {
      EoCloudCover?: never;
      ViewOffNadir?: never;
      ViewSunAzimuth: ViewSunAzimuthInput;
      ViewSunElevation?: never;
      Platform?: never;
      LandsatCloudCoverLand?: never;
    }
  | {
      EoCloudCover?: never;
      ViewOffNadir?: never;
      ViewSunAzimuth?: never;
      ViewSunElevation: ViewSunElevationInput;
      Platform?: never;
      LandsatCloudCoverLand?: never;
    }
  | {
      EoCloudCover?: never;
      ViewOffNadir?: never;
      ViewSunAzimuth?: never;
      ViewSunElevation?: never;
      Platform: PlatformInput;
      LandsatCloudCoverLand?: never;
    }
  | {
      EoCloudCover?: never;
      ViewOffNadir?: never;
      ViewSunAzimuth?: never;
      ViewSunElevation?: never;
      Platform?: never;
      LandsatCloudCoverLand: LandsatCloudCoverLandInput;
    };
export const Property = S.Union(
  S.Struct({ EoCloudCover: EoCloudCoverInput }),
  S.Struct({ ViewOffNadir: ViewOffNadirInput }),
  S.Struct({ ViewSunAzimuth: ViewSunAzimuthInput }),
  S.Struct({ ViewSunElevation: ViewSunElevationInput }),
  S.Struct({ Platform: PlatformInput }),
  S.Struct({ LandsatCloudCoverLand: LandsatCloudCoverLandInput }),
);
export interface PropertyFilter {
  Property: Property;
}
export const PropertyFilter = S.suspend(() =>
  S.Struct({ Property: Property }),
).annotations({
  identifier: "PropertyFilter",
}) as any as S.Schema<PropertyFilter>;
export type PropertyFiltersList = PropertyFilter[];
export const PropertyFiltersList = S.Array(PropertyFilter);
export interface PropertyFilters {
  Properties?: PropertyFilter[];
  LogicalOperator?: string;
}
export const PropertyFilters = S.suspend(() =>
  S.Struct({
    Properties: S.optional(PropertyFiltersList),
    LogicalOperator: S.optional(S.String),
  }),
).annotations({
  identifier: "PropertyFilters",
}) as any as S.Schema<PropertyFilters>;
export interface RasterDataCollectionQueryInput {
  RasterDataCollectionArn: string;
  TimeRangeFilter: TimeRangeFilterInput;
  AreaOfInterest?: AreaOfInterest;
  PropertyFilters?: PropertyFilters;
}
export const RasterDataCollectionQueryInput = S.suspend(() =>
  S.Struct({
    RasterDataCollectionArn: S.String,
    TimeRangeFilter: TimeRangeFilterInput,
    AreaOfInterest: S.optional(AreaOfInterest),
    PropertyFilters: S.optional(PropertyFilters),
  }),
).annotations({
  identifier: "RasterDataCollectionQueryInput",
}) as any as S.Schema<RasterDataCollectionQueryInput>;
export interface TemporalStatisticsConfigInput {
  GroupBy?: string;
  Statistics: string[];
  TargetBands?: string[];
}
export const TemporalStatisticsConfigInput = S.suspend(() =>
  S.Struct({
    GroupBy: S.optional(S.String),
    Statistics: TemporalStatisticsListInput,
    TargetBands: S.optional(StringListInput),
  }),
).annotations({
  identifier: "TemporalStatisticsConfigInput",
}) as any as S.Schema<TemporalStatisticsConfigInput>;
export interface CloudRemovalConfigInput {
  AlgorithmName?: string;
  InterpolationValue?: string;
  TargetBands?: string[];
}
export const CloudRemovalConfigInput = S.suspend(() =>
  S.Struct({
    AlgorithmName: S.optional(S.String),
    InterpolationValue: S.optional(S.String),
    TargetBands: S.optional(StringListInput),
  }),
).annotations({
  identifier: "CloudRemovalConfigInput",
}) as any as S.Schema<CloudRemovalConfigInput>;
export interface ZonalStatisticsConfigInput {
  ZoneS3Path: string;
  Statistics: string[];
  TargetBands?: string[];
  ZoneS3PathKmsKeyId?: string;
}
export const ZonalStatisticsConfigInput = S.suspend(() =>
  S.Struct({
    ZoneS3Path: S.String,
    Statistics: ZonalStatisticsListInput,
    TargetBands: S.optional(StringListInput),
    ZoneS3PathKmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "ZonalStatisticsConfigInput",
}) as any as S.Schema<ZonalStatisticsConfigInput>;
export interface GeoMosaicConfigInput {
  AlgorithmName?: string;
  TargetBands?: string[];
}
export const GeoMosaicConfigInput = S.suspend(() =>
  S.Struct({
    AlgorithmName: S.optional(S.String),
    TargetBands: S.optional(StringListInput),
  }),
).annotations({
  identifier: "GeoMosaicConfigInput",
}) as any as S.Schema<GeoMosaicConfigInput>;
export interface ExportS3DataInput {
  S3Uri: string;
  KmsKeyId?: string;
}
export const ExportS3DataInput = S.suspend(() =>
  S.Struct({ S3Uri: S.String, KmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "ExportS3DataInput",
}) as any as S.Schema<ExportS3DataInput>;
export interface VectorEnrichmentJobS3Data {
  S3Uri: string;
  KmsKeyId?: string;
}
export const VectorEnrichmentJobS3Data = S.suspend(() =>
  S.Struct({ S3Uri: S.String, KmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "VectorEnrichmentJobS3Data",
}) as any as S.Schema<VectorEnrichmentJobS3Data>;
export type VectorEnrichmentJobDataSourceConfigInput = {
  S3Data: VectorEnrichmentJobS3Data;
};
export const VectorEnrichmentJobDataSourceConfigInput = S.Union(
  S.Struct({ S3Data: VectorEnrichmentJobS3Data }),
);
export interface ReverseGeocodingConfig {
  YAttributeName: string;
  XAttributeName: string;
}
export const ReverseGeocodingConfig = S.suspend(() =>
  S.Struct({ YAttributeName: S.String, XAttributeName: S.String }),
).annotations({
  identifier: "ReverseGeocodingConfig",
}) as any as S.Schema<ReverseGeocodingConfig>;
export interface MapMatchingConfig {
  IdAttributeName: string;
  YAttributeName: string;
  XAttributeName: string;
  TimestampAttributeName: string;
}
export const MapMatchingConfig = S.suspend(() =>
  S.Struct({
    IdAttributeName: S.String,
    YAttributeName: S.String,
    XAttributeName: S.String,
    TimestampAttributeName: S.String,
  }),
).annotations({
  identifier: "MapMatchingConfig",
}) as any as S.Schema<MapMatchingConfig>;
export interface InputConfigInput {
  PreviousEarthObservationJobArn?: string;
  RasterDataCollectionQuery?: RasterDataCollectionQueryInput;
}
export const InputConfigInput = S.suspend(() =>
  S.Struct({
    PreviousEarthObservationJobArn: S.optional(S.String),
    RasterDataCollectionQuery: S.optional(RasterDataCollectionQueryInput),
  }),
).annotations({
  identifier: "InputConfigInput",
}) as any as S.Schema<InputConfigInput>;
export interface OutputBand {
  BandName: string;
  OutputDataType: string;
}
export const OutputBand = S.suspend(() =>
  S.Struct({ BandName: S.String, OutputDataType: S.String }),
).annotations({ identifier: "OutputBand" }) as any as S.Schema<OutputBand>;
export type EarthObservationJobOutputBands = OutputBand[];
export const EarthObservationJobOutputBands = S.Array(OutputBand);
export interface EarthObservationJobErrorDetails {
  Type?: string;
  Message?: string;
}
export const EarthObservationJobErrorDetails = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "EarthObservationJobErrorDetails",
}) as any as S.Schema<EarthObservationJobErrorDetails>;
export interface ListEarthObservationJobOutputConfig {
  Arn: string;
  Name: string;
  CreationTime: Date;
  DurationInSeconds: number;
  Status: string;
  OperationType: string;
  Tags?: { [key: string]: string | undefined };
}
export const ListEarthObservationJobOutputConfig = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    DurationInSeconds: S.Number,
    Status: S.String,
    OperationType: S.String,
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "ListEarthObservationJobOutputConfig",
}) as any as S.Schema<ListEarthObservationJobOutputConfig>;
export type EarthObservationJobList = ListEarthObservationJobOutputConfig[];
export const EarthObservationJobList = S.Array(
  ListEarthObservationJobOutputConfig,
);
export interface OutputConfigInput {
  S3Data: ExportS3DataInput;
}
export const OutputConfigInput = S.suspend(() =>
  S.Struct({ S3Data: ExportS3DataInput }),
).annotations({
  identifier: "OutputConfigInput",
}) as any as S.Schema<OutputConfigInput>;
export interface Filter {
  Name: string;
  Type: string;
  Minimum?: number;
  Maximum?: number;
}
export const Filter = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: S.String,
    Minimum: S.optional(S.Number),
    Maximum: S.optional(S.Number),
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface RasterDataCollectionMetadata {
  Name: string;
  Arn: string;
  Type: string;
  Description: string;
  DescriptionPageUrl?: string;
  SupportedFilters: Filter[];
  Tags?: { [key: string]: string | undefined };
}
export const RasterDataCollectionMetadata = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Arn: S.String,
    Type: S.String,
    Description: S.String,
    DescriptionPageUrl: S.optional(S.String),
    SupportedFilters: FilterList,
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "RasterDataCollectionMetadata",
}) as any as S.Schema<RasterDataCollectionMetadata>;
export type DataCollectionsList = RasterDataCollectionMetadata[];
export const DataCollectionsList = S.Array(RasterDataCollectionMetadata);
export interface VectorEnrichmentJobInputConfig {
  DocumentType: string;
  DataSourceConfig: VectorEnrichmentJobDataSourceConfigInput;
}
export const VectorEnrichmentJobInputConfig = S.suspend(() =>
  S.Struct({
    DocumentType: S.String,
    DataSourceConfig: VectorEnrichmentJobDataSourceConfigInput,
  }),
).annotations({
  identifier: "VectorEnrichmentJobInputConfig",
}) as any as S.Schema<VectorEnrichmentJobInputConfig>;
export type VectorEnrichmentJobConfig =
  | {
      ReverseGeocodingConfig: ReverseGeocodingConfig;
      MapMatchingConfig?: never;
    }
  | { ReverseGeocodingConfig?: never; MapMatchingConfig: MapMatchingConfig };
export const VectorEnrichmentJobConfig = S.Union(
  S.Struct({ ReverseGeocodingConfig: ReverseGeocodingConfig }),
  S.Struct({ MapMatchingConfig: MapMatchingConfig }),
);
export interface VectorEnrichmentJobErrorDetails {
  ErrorType?: string;
  ErrorMessage?: string;
}
export const VectorEnrichmentJobErrorDetails = S.suspend(() =>
  S.Struct({
    ErrorType: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "VectorEnrichmentJobErrorDetails",
}) as any as S.Schema<VectorEnrichmentJobErrorDetails>;
export interface VectorEnrichmentJobExportErrorDetails {
  Type?: string;
  Message?: string;
}
export const VectorEnrichmentJobExportErrorDetails = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "VectorEnrichmentJobExportErrorDetails",
}) as any as S.Schema<VectorEnrichmentJobExportErrorDetails>;
export interface ListVectorEnrichmentJobOutputConfig {
  Arn: string;
  Name: string;
  Type: string;
  CreationTime: Date;
  DurationInSeconds: number;
  Status: string;
  Tags?: { [key: string]: string | undefined };
}
export const ListVectorEnrichmentJobOutputConfig = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.String,
    Type: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    DurationInSeconds: S.Number,
    Status: S.String,
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "ListVectorEnrichmentJobOutputConfig",
}) as any as S.Schema<ListVectorEnrichmentJobOutputConfig>;
export type VectorEnrichmentJobList = ListVectorEnrichmentJobOutputConfig[];
export const VectorEnrichmentJobList = S.Array(
  ListVectorEnrichmentJobOutputConfig,
);
export interface ExportVectorEnrichmentJobOutputConfig {
  S3Data: VectorEnrichmentJobS3Data;
}
export const ExportVectorEnrichmentJobOutputConfig = S.suspend(() =>
  S.Struct({ S3Data: VectorEnrichmentJobS3Data }),
).annotations({
  identifier: "ExportVectorEnrichmentJobOutputConfig",
}) as any as S.Schema<ExportVectorEnrichmentJobOutputConfig>;
export interface UserDefined {
  Value: number;
  Unit: string;
}
export const UserDefined = S.suspend(() =>
  S.Struct({ Value: S.Number, Unit: S.String }),
).annotations({ identifier: "UserDefined" }) as any as S.Schema<UserDefined>;
export interface OutputResolutionStackInput {
  Predefined?: string;
  UserDefined?: UserDefined;
}
export const OutputResolutionStackInput = S.suspend(() =>
  S.Struct({
    Predefined: S.optional(S.String),
    UserDefined: S.optional(UserDefined),
  }),
).annotations({
  identifier: "OutputResolutionStackInput",
}) as any as S.Schema<OutputResolutionStackInput>;
export interface ListEarthObservationJobOutput {
  EarthObservationJobSummaries: ListEarthObservationJobOutputConfig[];
  NextToken?: string | redacted.Redacted<string>;
}
export const ListEarthObservationJobOutput = S.suspend(() =>
  S.Struct({
    EarthObservationJobSummaries: EarthObservationJobList,
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListEarthObservationJobOutput",
}) as any as S.Schema<ListEarthObservationJobOutput>;
export interface ExportEarthObservationJobInput {
  Arn: string;
  ClientToken?: string;
  ExecutionRoleArn: string;
  OutputConfig: OutputConfigInput;
  ExportSourceImages?: boolean;
}
export const ExportEarthObservationJobInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ExecutionRoleArn: S.String,
    OutputConfig: OutputConfigInput,
    ExportSourceImages: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/export-earth-observation-job" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExportEarthObservationJobInput",
}) as any as S.Schema<ExportEarthObservationJobInput>;
export interface GetRasterDataCollectionOutput {
  Name: string;
  Arn: string;
  Type: string;
  Description: string;
  DescriptionPageUrl: string;
  SupportedFilters: Filter[];
  ImageSourceBands: string[];
  Tags?: { [key: string]: string | undefined };
}
export const GetRasterDataCollectionOutput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Arn: S.String,
    Type: S.String,
    Description: S.String,
    DescriptionPageUrl: S.String,
    SupportedFilters: FilterList,
    ImageSourceBands: ImageSourceBandList,
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "GetRasterDataCollectionOutput",
}) as any as S.Schema<GetRasterDataCollectionOutput>;
export interface ListRasterDataCollectionsOutput {
  RasterDataCollectionSummaries: RasterDataCollectionMetadata[];
  NextToken?: string | redacted.Redacted<string>;
}
export const ListRasterDataCollectionsOutput = S.suspend(() =>
  S.Struct({
    RasterDataCollectionSummaries: DataCollectionsList,
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListRasterDataCollectionsOutput",
}) as any as S.Schema<ListRasterDataCollectionsOutput>;
export interface StartVectorEnrichmentJobInput {
  Name: string;
  ClientToken?: string;
  KmsKeyId?: string;
  InputConfig: VectorEnrichmentJobInputConfig;
  JobConfig: VectorEnrichmentJobConfig;
  ExecutionRoleArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const StartVectorEnrichmentJobInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    KmsKeyId: S.optional(S.String),
    InputConfig: VectorEnrichmentJobInputConfig,
    JobConfig: VectorEnrichmentJobConfig,
    ExecutionRoleArn: S.String,
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/vector-enrichment-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartVectorEnrichmentJobInput",
}) as any as S.Schema<StartVectorEnrichmentJobInput>;
export interface GetVectorEnrichmentJobOutput {
  Arn: string;
  Type: string;
  Name: string;
  CreationTime: Date;
  DurationInSeconds: number;
  Status: string;
  KmsKeyId?: string;
  InputConfig: VectorEnrichmentJobInputConfig;
  JobConfig: VectorEnrichmentJobConfig;
  ExecutionRoleArn: string;
  ErrorDetails?: VectorEnrichmentJobErrorDetails;
  ExportStatus?: string;
  ExportErrorDetails?: VectorEnrichmentJobExportErrorDetails;
  Tags?: { [key: string]: string | undefined };
}
export const GetVectorEnrichmentJobOutput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Type: S.String,
    Name: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    DurationInSeconds: S.Number,
    Status: S.String,
    KmsKeyId: S.optional(S.String),
    InputConfig: VectorEnrichmentJobInputConfig,
    JobConfig: VectorEnrichmentJobConfig,
    ExecutionRoleArn: S.String,
    ErrorDetails: S.optional(VectorEnrichmentJobErrorDetails),
    ExportStatus: S.optional(S.String),
    ExportErrorDetails: S.optional(VectorEnrichmentJobExportErrorDetails),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "GetVectorEnrichmentJobOutput",
}) as any as S.Schema<GetVectorEnrichmentJobOutput>;
export interface ListVectorEnrichmentJobOutput {
  VectorEnrichmentJobSummaries: ListVectorEnrichmentJobOutputConfig[];
  NextToken?: string | redacted.Redacted<string>;
}
export const ListVectorEnrichmentJobOutput = S.suspend(() =>
  S.Struct({
    VectorEnrichmentJobSummaries: VectorEnrichmentJobList,
    NextToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "ListVectorEnrichmentJobOutput",
}) as any as S.Schema<ListVectorEnrichmentJobOutput>;
export interface ExportVectorEnrichmentJobInput {
  Arn: string;
  ClientToken?: string;
  ExecutionRoleArn: string;
  OutputConfig: ExportVectorEnrichmentJobOutputConfig;
}
export const ExportVectorEnrichmentJobInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ExecutionRoleArn: S.String,
    OutputConfig: ExportVectorEnrichmentJobOutputConfig,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/export-vector-enrichment-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExportVectorEnrichmentJobInput",
}) as any as S.Schema<ExportVectorEnrichmentJobInput>;
export interface StackConfigInput {
  OutputResolution?: OutputResolutionStackInput;
  TargetBands?: string[];
}
export const StackConfigInput = S.suspend(() =>
  S.Struct({
    OutputResolution: S.optional(OutputResolutionStackInput),
    TargetBands: S.optional(StringListInput),
  }),
).annotations({
  identifier: "StackConfigInput",
}) as any as S.Schema<StackConfigInput>;
export interface ExportErrorDetailsOutput {
  Type?: string;
  Message?: string;
}
export const ExportErrorDetailsOutput = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Message: S.optional(S.String) }),
).annotations({
  identifier: "ExportErrorDetailsOutput",
}) as any as S.Schema<ExportErrorDetailsOutput>;
export interface Operation {
  Name: string;
  Equation: string;
  OutputType?: string;
}
export const Operation = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Equation: S.String,
    OutputType: S.optional(S.String),
  }),
).annotations({ identifier: "Operation" }) as any as S.Schema<Operation>;
export type OperationsListInput = Operation[];
export const OperationsListInput = S.Array(Operation);
export interface ExportErrorDetails {
  ExportResults?: ExportErrorDetailsOutput;
  ExportSourceImages?: ExportErrorDetailsOutput;
}
export const ExportErrorDetails = S.suspend(() =>
  S.Struct({
    ExportResults: S.optional(ExportErrorDetailsOutput),
    ExportSourceImages: S.optional(ExportErrorDetailsOutput),
  }),
).annotations({
  identifier: "ExportErrorDetails",
}) as any as S.Schema<ExportErrorDetails>;
export interface CustomIndicesInput {
  Operations?: Operation[];
}
export const CustomIndicesInput = S.suspend(() =>
  S.Struct({ Operations: S.optional(OperationsListInput) }),
).annotations({
  identifier: "CustomIndicesInput",
}) as any as S.Schema<CustomIndicesInput>;
export interface OutputResolutionResamplingInput {
  UserDefined: UserDefined;
}
export const OutputResolutionResamplingInput = S.suspend(() =>
  S.Struct({ UserDefined: UserDefined }),
).annotations({
  identifier: "OutputResolutionResamplingInput",
}) as any as S.Schema<OutputResolutionResamplingInput>;
export interface TimeRangeFilterOutput {
  StartTime: Date;
  EndTime: Date;
}
export const TimeRangeFilterOutput = S.suspend(() =>
  S.Struct({
    StartTime: S.Date.pipe(T.TimestampFormat("date-time")),
    EndTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "TimeRangeFilterOutput",
}) as any as S.Schema<TimeRangeFilterOutput>;
export interface ExportEarthObservationJobOutput {
  Arn: string;
  CreationTime: Date;
  ExportStatus: string;
  ExecutionRoleArn: string;
  OutputConfig: OutputConfigInput;
  ExportSourceImages?: boolean;
}
export const ExportEarthObservationJobOutput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    ExportStatus: S.String,
    ExecutionRoleArn: S.String,
    OutputConfig: OutputConfigInput,
    ExportSourceImages: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ExportEarthObservationJobOutput",
}) as any as S.Schema<ExportEarthObservationJobOutput>;
export interface StartVectorEnrichmentJobOutput {
  Name: string;
  Arn: string;
  Type: string;
  CreationTime: Date;
  DurationInSeconds: number;
  Status: string;
  KmsKeyId?: string;
  InputConfig: VectorEnrichmentJobInputConfig;
  JobConfig: VectorEnrichmentJobConfig;
  ExecutionRoleArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const StartVectorEnrichmentJobOutput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Arn: S.String,
    Type: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    DurationInSeconds: S.Number,
    Status: S.String,
    KmsKeyId: S.optional(S.String),
    InputConfig: VectorEnrichmentJobInputConfig,
    JobConfig: VectorEnrichmentJobConfig,
    ExecutionRoleArn: S.String,
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "StartVectorEnrichmentJobOutput",
}) as any as S.Schema<StartVectorEnrichmentJobOutput>;
export interface ExportVectorEnrichmentJobOutput {
  Arn: string;
  CreationTime: Date;
  ExecutionRoleArn: string;
  ExportStatus: string;
  OutputConfig: ExportVectorEnrichmentJobOutputConfig;
}
export const ExportVectorEnrichmentJobOutput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    ExecutionRoleArn: S.String,
    ExportStatus: S.String,
    OutputConfig: ExportVectorEnrichmentJobOutputConfig,
  }),
).annotations({
  identifier: "ExportVectorEnrichmentJobOutput",
}) as any as S.Schema<ExportVectorEnrichmentJobOutput>;
export interface BandMathConfigInput {
  PredefinedIndices?: string[];
  CustomIndices?: CustomIndicesInput;
}
export const BandMathConfigInput = S.suspend(() =>
  S.Struct({
    PredefinedIndices: S.optional(StringListInput),
    CustomIndices: S.optional(CustomIndicesInput),
  }),
).annotations({
  identifier: "BandMathConfigInput",
}) as any as S.Schema<BandMathConfigInput>;
export interface ResamplingConfigInput {
  OutputResolution: OutputResolutionResamplingInput;
  AlgorithmName?: string;
  TargetBands?: string[];
}
export const ResamplingConfigInput = S.suspend(() =>
  S.Struct({
    OutputResolution: OutputResolutionResamplingInput,
    AlgorithmName: S.optional(S.String),
    TargetBands: S.optional(StringListInput),
  }),
).annotations({
  identifier: "ResamplingConfigInput",
}) as any as S.Schema<ResamplingConfigInput>;
export interface RasterDataCollectionQueryOutput {
  RasterDataCollectionArn: string;
  RasterDataCollectionName: string;
  TimeRangeFilter: TimeRangeFilterOutput;
  AreaOfInterest?: AreaOfInterest;
  PropertyFilters?: PropertyFilters;
}
export const RasterDataCollectionQueryOutput = S.suspend(() =>
  S.Struct({
    RasterDataCollectionArn: S.String,
    RasterDataCollectionName: S.String,
    TimeRangeFilter: TimeRangeFilterOutput,
    AreaOfInterest: S.optional(AreaOfInterest),
    PropertyFilters: S.optional(PropertyFilters),
  }),
).annotations({
  identifier: "RasterDataCollectionQueryOutput",
}) as any as S.Schema<RasterDataCollectionQueryOutput>;
export type JobConfigInput =
  | {
      BandMathConfig: BandMathConfigInput;
      ResamplingConfig?: never;
      TemporalStatisticsConfig?: never;
      CloudRemovalConfig?: never;
      ZonalStatisticsConfig?: never;
      GeoMosaicConfig?: never;
      StackConfig?: never;
      CloudMaskingConfig?: never;
      LandCoverSegmentationConfig?: never;
    }
  | {
      BandMathConfig?: never;
      ResamplingConfig: ResamplingConfigInput;
      TemporalStatisticsConfig?: never;
      CloudRemovalConfig?: never;
      ZonalStatisticsConfig?: never;
      GeoMosaicConfig?: never;
      StackConfig?: never;
      CloudMaskingConfig?: never;
      LandCoverSegmentationConfig?: never;
    }
  | {
      BandMathConfig?: never;
      ResamplingConfig?: never;
      TemporalStatisticsConfig: TemporalStatisticsConfigInput;
      CloudRemovalConfig?: never;
      ZonalStatisticsConfig?: never;
      GeoMosaicConfig?: never;
      StackConfig?: never;
      CloudMaskingConfig?: never;
      LandCoverSegmentationConfig?: never;
    }
  | {
      BandMathConfig?: never;
      ResamplingConfig?: never;
      TemporalStatisticsConfig?: never;
      CloudRemovalConfig: CloudRemovalConfigInput;
      ZonalStatisticsConfig?: never;
      GeoMosaicConfig?: never;
      StackConfig?: never;
      CloudMaskingConfig?: never;
      LandCoverSegmentationConfig?: never;
    }
  | {
      BandMathConfig?: never;
      ResamplingConfig?: never;
      TemporalStatisticsConfig?: never;
      CloudRemovalConfig?: never;
      ZonalStatisticsConfig: ZonalStatisticsConfigInput;
      GeoMosaicConfig?: never;
      StackConfig?: never;
      CloudMaskingConfig?: never;
      LandCoverSegmentationConfig?: never;
    }
  | {
      BandMathConfig?: never;
      ResamplingConfig?: never;
      TemporalStatisticsConfig?: never;
      CloudRemovalConfig?: never;
      ZonalStatisticsConfig?: never;
      GeoMosaicConfig: GeoMosaicConfigInput;
      StackConfig?: never;
      CloudMaskingConfig?: never;
      LandCoverSegmentationConfig?: never;
    }
  | {
      BandMathConfig?: never;
      ResamplingConfig?: never;
      TemporalStatisticsConfig?: never;
      CloudRemovalConfig?: never;
      ZonalStatisticsConfig?: never;
      GeoMosaicConfig?: never;
      StackConfig: StackConfigInput;
      CloudMaskingConfig?: never;
      LandCoverSegmentationConfig?: never;
    }
  | {
      BandMathConfig?: never;
      ResamplingConfig?: never;
      TemporalStatisticsConfig?: never;
      CloudRemovalConfig?: never;
      ZonalStatisticsConfig?: never;
      GeoMosaicConfig?: never;
      StackConfig?: never;
      CloudMaskingConfig: CloudMaskingConfigInput;
      LandCoverSegmentationConfig?: never;
    }
  | {
      BandMathConfig?: never;
      ResamplingConfig?: never;
      TemporalStatisticsConfig?: never;
      CloudRemovalConfig?: never;
      ZonalStatisticsConfig?: never;
      GeoMosaicConfig?: never;
      StackConfig?: never;
      CloudMaskingConfig?: never;
      LandCoverSegmentationConfig: LandCoverSegmentationConfigInput;
    };
export const JobConfigInput = S.Union(
  S.Struct({ BandMathConfig: BandMathConfigInput }),
  S.Struct({ ResamplingConfig: ResamplingConfigInput }),
  S.Struct({ TemporalStatisticsConfig: TemporalStatisticsConfigInput }),
  S.Struct({ CloudRemovalConfig: CloudRemovalConfigInput }),
  S.Struct({ ZonalStatisticsConfig: ZonalStatisticsConfigInput }),
  S.Struct({ GeoMosaicConfig: GeoMosaicConfigInput }),
  S.Struct({ StackConfig: StackConfigInput }),
  S.Struct({ CloudMaskingConfig: CloudMaskingConfigInput }),
  S.Struct({ LandCoverSegmentationConfig: LandCoverSegmentationConfigInput }),
);
export interface InputConfigOutput {
  PreviousEarthObservationJobArn?: string;
  RasterDataCollectionQuery?: RasterDataCollectionQueryOutput;
}
export const InputConfigOutput = S.suspend(() =>
  S.Struct({
    PreviousEarthObservationJobArn: S.optional(S.String),
    RasterDataCollectionQuery: S.optional(RasterDataCollectionQueryOutput),
  }),
).annotations({
  identifier: "InputConfigOutput",
}) as any as S.Schema<InputConfigOutput>;
export interface StartEarthObservationJobInput {
  Name: string;
  ClientToken?: string;
  KmsKeyId?: string;
  InputConfig: InputConfigInput;
  JobConfig: JobConfigInput;
  ExecutionRoleArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const StartEarthObservationJobInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    KmsKeyId: S.optional(S.String),
    InputConfig: InputConfigInput,
    JobConfig: JobConfigInput,
    ExecutionRoleArn: S.String,
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/earth-observation-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartEarthObservationJobInput",
}) as any as S.Schema<StartEarthObservationJobInput>;
export interface GetEarthObservationJobOutput {
  Arn: string;
  Name: string;
  CreationTime: Date;
  DurationInSeconds: number;
  Status: string;
  KmsKeyId?: string;
  InputConfig: InputConfigOutput;
  JobConfig: JobConfigInput;
  OutputBands?: OutputBand[];
  ExecutionRoleArn?: string;
  ErrorDetails?: EarthObservationJobErrorDetails;
  ExportStatus?: string;
  ExportErrorDetails?: ExportErrorDetails;
  Tags?: { [key: string]: string | undefined };
}
export const GetEarthObservationJobOutput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Name: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    DurationInSeconds: S.Number,
    Status: S.String,
    KmsKeyId: S.optional(S.String),
    InputConfig: InputConfigOutput,
    JobConfig: JobConfigInput,
    OutputBands: S.optional(EarthObservationJobOutputBands),
    ExecutionRoleArn: S.optional(S.String),
    ErrorDetails: S.optional(EarthObservationJobErrorDetails),
    ExportStatus: S.optional(S.String),
    ExportErrorDetails: S.optional(ExportErrorDetails),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "GetEarthObservationJobOutput",
}) as any as S.Schema<GetEarthObservationJobOutput>;
export interface RasterDataCollectionQueryWithBandFilterInput {
  TimeRangeFilter: TimeRangeFilterInput;
  AreaOfInterest?: AreaOfInterest;
  PropertyFilters?: PropertyFilters;
  BandFilter?: string[];
}
export const RasterDataCollectionQueryWithBandFilterInput = S.suspend(() =>
  S.Struct({
    TimeRangeFilter: TimeRangeFilterInput,
    AreaOfInterest: S.optional(AreaOfInterest),
    PropertyFilters: S.optional(PropertyFilters),
    BandFilter: S.optional(StringListInput),
  }),
).annotations({
  identifier: "RasterDataCollectionQueryWithBandFilterInput",
}) as any as S.Schema<RasterDataCollectionQueryWithBandFilterInput>;
export interface StartEarthObservationJobOutput {
  Name: string;
  Arn: string;
  CreationTime: Date;
  DurationInSeconds: number;
  Status: string;
  KmsKeyId?: string;
  InputConfig?: InputConfigOutput;
  JobConfig: JobConfigInput;
  ExecutionRoleArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const StartEarthObservationJobOutput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Arn: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    DurationInSeconds: S.Number,
    Status: S.String,
    KmsKeyId: S.optional(S.String),
    InputConfig: S.optional(InputConfigOutput),
    JobConfig: JobConfigInput,
    ExecutionRoleArn: S.String,
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "StartEarthObservationJobOutput",
}) as any as S.Schema<StartEarthObservationJobOutput>;
export interface SearchRasterDataCollectionInput {
  Arn: string;
  RasterDataCollectionQuery: RasterDataCollectionQueryWithBandFilterInput;
  NextToken?: string | redacted.Redacted<string>;
}
export const SearchRasterDataCollectionInput = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    RasterDataCollectionQuery: RasterDataCollectionQueryWithBandFilterInput,
    NextToken: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/search-raster-data-collection" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchRasterDataCollectionInput",
}) as any as S.Schema<SearchRasterDataCollectionInput>;
export interface Geometry {
  Type: string;
  Coordinates: number[][][];
}
export const Geometry = S.suspend(() =>
  S.Struct({ Type: S.String, Coordinates: LinearRings }),
).annotations({ identifier: "Geometry" }) as any as S.Schema<Geometry>;
export interface Properties {
  EoCloudCover?: number;
  ViewOffNadir?: number;
  ViewSunAzimuth?: number;
  ViewSunElevation?: number;
  Platform?: string;
  LandsatCloudCoverLand?: number;
}
export const Properties = S.suspend(() =>
  S.Struct({
    EoCloudCover: S.optional(S.Number),
    ViewOffNadir: S.optional(S.Number),
    ViewSunAzimuth: S.optional(S.Number),
    ViewSunElevation: S.optional(S.Number),
    Platform: S.optional(S.String),
    LandsatCloudCoverLand: S.optional(S.Number),
  }),
).annotations({ identifier: "Properties" }) as any as S.Schema<Properties>;
export interface AssetValue {
  Href?: string;
}
export const AssetValue = S.suspend(() =>
  S.Struct({ Href: S.optional(S.String) }),
).annotations({ identifier: "AssetValue" }) as any as S.Schema<AssetValue>;
export type AssetsMap = { [key: string]: AssetValue | undefined };
export const AssetsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(AssetValue),
});
export interface ItemSource {
  Id: string;
  Geometry: Geometry;
  Assets?: { [key: string]: AssetValue | undefined };
  DateTime: Date;
  Properties?: Properties;
}
export const ItemSource = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Geometry: Geometry,
    Assets: S.optional(AssetsMap),
    DateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Properties: S.optional(Properties),
  }),
).annotations({ identifier: "ItemSource" }) as any as S.Schema<ItemSource>;
export type ItemSourceList = ItemSource[];
export const ItemSourceList = S.Array(ItemSource);
export interface SearchRasterDataCollectionOutput {
  ApproximateResultCount: number;
  NextToken?: string | redacted.Redacted<string>;
  Items?: ItemSource[];
}
export const SearchRasterDataCollectionOutput = S.suspend(() =>
  S.Struct({
    ApproximateResultCount: S.Number,
    NextToken: S.optional(SensitiveString),
    Items: S.optional(ItemSourceList),
  }),
).annotations({
  identifier: "SearchRasterDataCollectionOutput",
}) as any as S.Schema<SearchRasterDataCollectionOutput>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String, ResourceId: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String, ResourceId: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String, ResourceId: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String, ResourceId: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * The resource you want to untag.
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
 * Use this operation to create an Earth observation job.
 */
export const startEarthObservationJob: (
  input: StartEarthObservationJobInput,
) => effect.Effect<
  StartEarthObservationJobOutput,
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
  input: StartEarthObservationJobInput,
  output: StartEarthObservationJobOutput,
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
 * Get the details for a previously initiated Earth Observation job.
 */
export const getEarthObservationJob: (
  input: GetEarthObservationJobInput,
) => effect.Effect<
  GetEarthObservationJobOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEarthObservationJobInput,
  output: GetEarthObservationJobOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use this operation to export results of an Earth Observation job and optionally source images used as input to the EOJ to an Amazon S3 location.
 */
export const exportEarthObservationJob: (
  input: ExportEarthObservationJobInput,
) => effect.Effect<
  ExportEarthObservationJobOutput,
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
  input: ExportEarthObservationJobInput,
  output: ExportEarthObservationJobOutput,
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
 * Use this operation to get a list of the Earth Observation jobs associated with the calling Amazon Web Services account.
 */
export const listEarthObservationJobs: {
  (
    input: ListEarthObservationJobInput,
  ): effect.Effect<
    ListEarthObservationJobOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEarthObservationJobInput,
  ) => stream.Stream<
    ListEarthObservationJobOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEarthObservationJobInput,
  ) => stream.Stream<
    ListEarthObservationJobOutputConfig,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEarthObservationJobInput,
  output: ListEarthObservationJobOutput,
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
    items: "EarthObservationJobSummaries",
  } as const,
}));
/**
 * Use this operation to get details of a specific raster data collection.
 */
export const getRasterDataCollection: (
  input: GetRasterDataCollectionInput,
) => effect.Effect<
  GetRasterDataCollectionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRasterDataCollectionInput,
  output: GetRasterDataCollectionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Use this operation to get raster data collections.
 */
export const listRasterDataCollections: {
  (
    input: ListRasterDataCollectionsInput,
  ): effect.Effect<
    ListRasterDataCollectionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRasterDataCollectionsInput,
  ) => stream.Stream<
    ListRasterDataCollectionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRasterDataCollectionsInput,
  ) => stream.Stream<
    RasterDataCollectionMetadata,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRasterDataCollectionsInput,
  output: ListRasterDataCollectionsOutput,
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
    items: "RasterDataCollectionSummaries",
  } as const,
}));
/**
 * Retrieves details of a Vector Enrichment Job for a given job Amazon Resource Name (ARN).
 */
export const getVectorEnrichmentJob: (
  input: GetVectorEnrichmentJobInput,
) => effect.Effect<
  GetVectorEnrichmentJobOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetVectorEnrichmentJobInput,
  output: GetVectorEnrichmentJobOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of vector enrichment jobs.
 */
export const listVectorEnrichmentJobs: {
  (
    input: ListVectorEnrichmentJobInput,
  ): effect.Effect<
    ListVectorEnrichmentJobOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVectorEnrichmentJobInput,
  ) => stream.Stream<
    ListVectorEnrichmentJobOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVectorEnrichmentJobInput,
  ) => stream.Stream<
    ListVectorEnrichmentJobOutputConfig,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVectorEnrichmentJobInput,
  output: ListVectorEnrichmentJobOutput,
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
    items: "VectorEnrichmentJobSummaries",
  } as const,
}));
/**
 * Use this operation to delete an Earth Observation job.
 */
export const deleteEarthObservationJob: (
  input: DeleteEarthObservationJobInput,
) => effect.Effect<
  DeleteEarthObservationJobOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEarthObservationJobInput,
  output: DeleteEarthObservationJobOutput,
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
 * Gets a web mercator tile for the given Earth Observation job.
 */
export const getTile: (
  input: GetTileInput,
) => effect.Effect<
  GetTileOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTileInput,
  output: GetTileOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the tags attached to the resource.
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
 * The resource you want to tag.
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
 * Use this operation to stop an existing earth observation job.
 */
export const stopEarthObservationJob: (
  input: StopEarthObservationJobInput,
) => effect.Effect<
  StopEarthObservationJobOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopEarthObservationJobInput,
  output: StopEarthObservationJobOutput,
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
 * Use this operation to delete a Vector Enrichment job.
 */
export const deleteVectorEnrichmentJob: (
  input: DeleteVectorEnrichmentJobInput,
) => effect.Effect<
  DeleteVectorEnrichmentJobOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVectorEnrichmentJobInput,
  output: DeleteVectorEnrichmentJobOutput,
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
 * Stops the Vector Enrichment job for a given job ARN.
 */
export const stopVectorEnrichmentJob: (
  input: StopVectorEnrichmentJobInput,
) => effect.Effect<
  StopVectorEnrichmentJobOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopVectorEnrichmentJobInput,
  output: StopVectorEnrichmentJobOutput,
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
 * Creates a Vector Enrichment job for the supplied job type. Currently, there are two supported job types: reverse geocoding and map matching.
 */
export const startVectorEnrichmentJob: (
  input: StartVectorEnrichmentJobInput,
) => effect.Effect<
  StartVectorEnrichmentJobOutput,
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
  input: StartVectorEnrichmentJobInput,
  output: StartVectorEnrichmentJobOutput,
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
 * Use this operation to copy results of a Vector Enrichment job to an Amazon S3 location.
 */
export const exportVectorEnrichmentJob: (
  input: ExportVectorEnrichmentJobInput,
) => effect.Effect<
  ExportVectorEnrichmentJobOutput,
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
  input: ExportVectorEnrichmentJobInput,
  output: ExportVectorEnrichmentJobOutput,
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
 * Allows you run image query on a specific raster data collection to get a list of the satellite imagery matching the selected filters.
 */
export const searchRasterDataCollection: {
  (
    input: SearchRasterDataCollectionInput,
  ): effect.Effect<
    SearchRasterDataCollectionOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchRasterDataCollectionInput,
  ) => stream.Stream<
    SearchRasterDataCollectionOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchRasterDataCollectionInput,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchRasterDataCollectionInput,
  output: SearchRasterDataCollectionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: { inputToken: "NextToken", outputToken: "NextToken" } as const,
}));

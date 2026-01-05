import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "SageMaker Geospatial",
  serviceShapeName: "SageMakerGeospatial",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker-geospatial" });
const ver = T.ServiceVersion("2020-05-27");
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://sagemaker-geospatial-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://sagemaker-geospatial-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://sagemaker-geospatial.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://sagemaker-geospatial.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export const StringListInput = S.Array(S.String);
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
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export class GetEarthObservationJobInput extends S.Class<GetEarthObservationJobInput>(
  "GetEarthObservationJobInput",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/earth-observation-jobs/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEarthObservationJobInput extends S.Class<DeleteEarthObservationJobInput>(
  "DeleteEarthObservationJobInput",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/earth-observation-jobs/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEarthObservationJobOutput extends S.Class<DeleteEarthObservationJobOutput>(
  "DeleteEarthObservationJobOutput",
)({}) {}
export class ListEarthObservationJobInput extends S.Class<ListEarthObservationJobInput>(
  "ListEarthObservationJobInput",
)(
  {
    StatusEquals: S.optional(S.String),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-earth-observation-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTileInput extends S.Class<GetTileInput>("GetTileInput")(
  {
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
  },
  T.all(
    T.Http({ method: "GET", uri: "/tile/{z}/{x}/{y}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopEarthObservationJobInput extends S.Class<StopEarthObservationJobInput>(
  "StopEarthObservationJobInput",
)(
  { Arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/earth-observation-jobs/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopEarthObservationJobOutput extends S.Class<StopEarthObservationJobOutput>(
  "StopEarthObservationJobOutput",
)({}) {}
export class GetRasterDataCollectionInput extends S.Class<GetRasterDataCollectionInput>(
  "GetRasterDataCollectionInput",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/raster-data-collection/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRasterDataCollectionsInput extends S.Class<ListRasterDataCollectionsInput>(
  "ListRasterDataCollectionsInput",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/raster-data-collections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVectorEnrichmentJobInput extends S.Class<GetVectorEnrichmentJobInput>(
  "GetVectorEnrichmentJobInput",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "GET", uri: "/vector-enrichment-jobs/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVectorEnrichmentJobInput extends S.Class<DeleteVectorEnrichmentJobInput>(
  "DeleteVectorEnrichmentJobInput",
)(
  { Arn: S.String.pipe(T.HttpLabel("Arn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/vector-enrichment-jobs/{Arn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVectorEnrichmentJobOutput extends S.Class<DeleteVectorEnrichmentJobOutput>(
  "DeleteVectorEnrichmentJobOutput",
)({}) {}
export class ListVectorEnrichmentJobInput extends S.Class<ListVectorEnrichmentJobInput>(
  "ListVectorEnrichmentJobInput",
)(
  {
    StatusEquals: S.optional(S.String),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-vector-enrichment-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopVectorEnrichmentJobInput extends S.Class<StopVectorEnrichmentJobInput>(
  "StopVectorEnrichmentJobInput",
)(
  { Arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/vector-enrichment-jobs/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopVectorEnrichmentJobOutput extends S.Class<StopVectorEnrichmentJobOutput>(
  "StopVectorEnrichmentJobOutput",
)({}) {}
export class CloudMaskingConfigInput extends S.Class<CloudMaskingConfigInput>(
  "CloudMaskingConfigInput",
)({}) {}
export class LandCoverSegmentationConfigInput extends S.Class<LandCoverSegmentationConfigInput>(
  "LandCoverSegmentationConfigInput",
)({}) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export const ImageSourceBandList = S.Array(S.String);
export const TemporalStatisticsListInput = S.Array(S.String);
export const ZonalStatisticsListInput = S.Array(S.String);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")), Tags: Tags },
  T.all(
    T.Http({ method: "PUT", uri: "/tags/{ResourceArn}" }),
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
export class GetTileOutput extends S.Class<GetTileOutput>("GetTileOutput")({
  BinaryFile: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
}) {}
export class TimeRangeFilterInput extends S.Class<TimeRangeFilterInput>(
  "TimeRangeFilterInput",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const Position = S.Array(S.Number);
export const LinearRing = S.Array(Position);
export const LinearRings = S.Array(LinearRing);
export class PolygonGeometryInput extends S.Class<PolygonGeometryInput>(
  "PolygonGeometryInput",
)({ Coordinates: LinearRings }) {}
export const LinearRingsList = S.Array(LinearRings);
export class MultiPolygonGeometryInput extends S.Class<MultiPolygonGeometryInput>(
  "MultiPolygonGeometryInput",
)({ Coordinates: LinearRingsList }) {}
export const AreaOfInterestGeometry = S.Union(
  S.Struct({ PolygonGeometry: PolygonGeometryInput }),
  S.Struct({ MultiPolygonGeometry: MultiPolygonGeometryInput }),
);
export const AreaOfInterest = S.Union(
  S.Struct({ AreaOfInterestGeometry: AreaOfInterestGeometry }),
);
export class EoCloudCoverInput extends S.Class<EoCloudCoverInput>(
  "EoCloudCoverInput",
)({ LowerBound: S.Number, UpperBound: S.Number }) {}
export class ViewOffNadirInput extends S.Class<ViewOffNadirInput>(
  "ViewOffNadirInput",
)({ LowerBound: S.Number, UpperBound: S.Number }) {}
export class ViewSunAzimuthInput extends S.Class<ViewSunAzimuthInput>(
  "ViewSunAzimuthInput",
)({ LowerBound: S.Number, UpperBound: S.Number }) {}
export class ViewSunElevationInput extends S.Class<ViewSunElevationInput>(
  "ViewSunElevationInput",
)({ LowerBound: S.Number, UpperBound: S.Number }) {}
export class PlatformInput extends S.Class<PlatformInput>("PlatformInput")({
  Value: S.String,
  ComparisonOperator: S.optional(S.String),
}) {}
export class LandsatCloudCoverLandInput extends S.Class<LandsatCloudCoverLandInput>(
  "LandsatCloudCoverLandInput",
)({ LowerBound: S.Number, UpperBound: S.Number }) {}
export const Property = S.Union(
  S.Struct({ EoCloudCover: EoCloudCoverInput }),
  S.Struct({ ViewOffNadir: ViewOffNadirInput }),
  S.Struct({ ViewSunAzimuth: ViewSunAzimuthInput }),
  S.Struct({ ViewSunElevation: ViewSunElevationInput }),
  S.Struct({ Platform: PlatformInput }),
  S.Struct({ LandsatCloudCoverLand: LandsatCloudCoverLandInput }),
);
export class PropertyFilter extends S.Class<PropertyFilter>("PropertyFilter")({
  Property: Property,
}) {}
export const PropertyFiltersList = S.Array(PropertyFilter);
export class PropertyFilters extends S.Class<PropertyFilters>(
  "PropertyFilters",
)({
  Properties: S.optional(PropertyFiltersList),
  LogicalOperator: S.optional(S.String),
}) {}
export class RasterDataCollectionQueryInput extends S.Class<RasterDataCollectionQueryInput>(
  "RasterDataCollectionQueryInput",
)({
  RasterDataCollectionArn: S.String,
  TimeRangeFilter: TimeRangeFilterInput,
  AreaOfInterest: S.optional(AreaOfInterest),
  PropertyFilters: S.optional(PropertyFilters),
}) {}
export class TemporalStatisticsConfigInput extends S.Class<TemporalStatisticsConfigInput>(
  "TemporalStatisticsConfigInput",
)({
  GroupBy: S.optional(S.String),
  Statistics: TemporalStatisticsListInput,
  TargetBands: S.optional(StringListInput),
}) {}
export class CloudRemovalConfigInput extends S.Class<CloudRemovalConfigInput>(
  "CloudRemovalConfigInput",
)({
  AlgorithmName: S.optional(S.String),
  InterpolationValue: S.optional(S.String),
  TargetBands: S.optional(StringListInput),
}) {}
export class ZonalStatisticsConfigInput extends S.Class<ZonalStatisticsConfigInput>(
  "ZonalStatisticsConfigInput",
)({
  ZoneS3Path: S.String,
  Statistics: ZonalStatisticsListInput,
  TargetBands: S.optional(StringListInput),
  ZoneS3PathKmsKeyId: S.optional(S.String),
}) {}
export class GeoMosaicConfigInput extends S.Class<GeoMosaicConfigInput>(
  "GeoMosaicConfigInput",
)({
  AlgorithmName: S.optional(S.String),
  TargetBands: S.optional(StringListInput),
}) {}
export class ExportS3DataInput extends S.Class<ExportS3DataInput>(
  "ExportS3DataInput",
)({ S3Uri: S.String, KmsKeyId: S.optional(S.String) }) {}
export class VectorEnrichmentJobS3Data extends S.Class<VectorEnrichmentJobS3Data>(
  "VectorEnrichmentJobS3Data",
)({ S3Uri: S.String, KmsKeyId: S.optional(S.String) }) {}
export const VectorEnrichmentJobDataSourceConfigInput = S.Union(
  S.Struct({ S3Data: VectorEnrichmentJobS3Data }),
);
export class ReverseGeocodingConfig extends S.Class<ReverseGeocodingConfig>(
  "ReverseGeocodingConfig",
)({ YAttributeName: S.String, XAttributeName: S.String }) {}
export class MapMatchingConfig extends S.Class<MapMatchingConfig>(
  "MapMatchingConfig",
)({
  IdAttributeName: S.String,
  YAttributeName: S.String,
  XAttributeName: S.String,
  TimestampAttributeName: S.String,
}) {}
export class InputConfigInput extends S.Class<InputConfigInput>(
  "InputConfigInput",
)({
  PreviousEarthObservationJobArn: S.optional(S.String),
  RasterDataCollectionQuery: S.optional(RasterDataCollectionQueryInput),
}) {}
export class OutputBand extends S.Class<OutputBand>("OutputBand")({
  BandName: S.String,
  OutputDataType: S.String,
}) {}
export const EarthObservationJobOutputBands = S.Array(OutputBand);
export class EarthObservationJobErrorDetails extends S.Class<EarthObservationJobErrorDetails>(
  "EarthObservationJobErrorDetails",
)({ Type: S.optional(S.String), Message: S.optional(S.String) }) {}
export class ListEarthObservationJobOutputConfig extends S.Class<ListEarthObservationJobOutputConfig>(
  "ListEarthObservationJobOutputConfig",
)({
  Arn: S.String,
  Name: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  DurationInSeconds: S.Number,
  Status: S.String,
  OperationType: S.String,
  Tags: S.optional(Tags),
}) {}
export const EarthObservationJobList = S.Array(
  ListEarthObservationJobOutputConfig,
);
export class OutputConfigInput extends S.Class<OutputConfigInput>(
  "OutputConfigInput",
)({ S3Data: ExportS3DataInput }) {}
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.String,
  Type: S.String,
  Minimum: S.optional(S.Number),
  Maximum: S.optional(S.Number),
}) {}
export const FilterList = S.Array(Filter);
export class RasterDataCollectionMetadata extends S.Class<RasterDataCollectionMetadata>(
  "RasterDataCollectionMetadata",
)({
  Name: S.String,
  Arn: S.String,
  Type: S.String,
  Description: S.String,
  DescriptionPageUrl: S.optional(S.String),
  SupportedFilters: FilterList,
  Tags: S.optional(Tags),
}) {}
export const DataCollectionsList = S.Array(RasterDataCollectionMetadata);
export class VectorEnrichmentJobInputConfig extends S.Class<VectorEnrichmentJobInputConfig>(
  "VectorEnrichmentJobInputConfig",
)({
  DocumentType: S.String,
  DataSourceConfig: VectorEnrichmentJobDataSourceConfigInput,
}) {}
export const VectorEnrichmentJobConfig = S.Union(
  S.Struct({ ReverseGeocodingConfig: ReverseGeocodingConfig }),
  S.Struct({ MapMatchingConfig: MapMatchingConfig }),
);
export class VectorEnrichmentJobErrorDetails extends S.Class<VectorEnrichmentJobErrorDetails>(
  "VectorEnrichmentJobErrorDetails",
)({ ErrorType: S.optional(S.String), ErrorMessage: S.optional(S.String) }) {}
export class VectorEnrichmentJobExportErrorDetails extends S.Class<VectorEnrichmentJobExportErrorDetails>(
  "VectorEnrichmentJobExportErrorDetails",
)({ Type: S.optional(S.String), Message: S.optional(S.String) }) {}
export class ListVectorEnrichmentJobOutputConfig extends S.Class<ListVectorEnrichmentJobOutputConfig>(
  "ListVectorEnrichmentJobOutputConfig",
)({
  Arn: S.String,
  Name: S.String,
  Type: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  DurationInSeconds: S.Number,
  Status: S.String,
  Tags: S.optional(Tags),
}) {}
export const VectorEnrichmentJobList = S.Array(
  ListVectorEnrichmentJobOutputConfig,
);
export class ExportVectorEnrichmentJobOutputConfig extends S.Class<ExportVectorEnrichmentJobOutputConfig>(
  "ExportVectorEnrichmentJobOutputConfig",
)({ S3Data: VectorEnrichmentJobS3Data }) {}
export class UserDefined extends S.Class<UserDefined>("UserDefined")({
  Value: S.Number,
  Unit: S.String,
}) {}
export class OutputResolutionStackInput extends S.Class<OutputResolutionStackInput>(
  "OutputResolutionStackInput",
)({ Predefined: S.optional(S.String), UserDefined: S.optional(UserDefined) }) {}
export class ListEarthObservationJobOutput extends S.Class<ListEarthObservationJobOutput>(
  "ListEarthObservationJobOutput",
)({
  EarthObservationJobSummaries: EarthObservationJobList,
  NextToken: S.optional(S.String),
}) {}
export class ExportEarthObservationJobInput extends S.Class<ExportEarthObservationJobInput>(
  "ExportEarthObservationJobInput",
)(
  {
    Arn: S.String,
    ClientToken: S.optional(S.String),
    ExecutionRoleArn: S.String,
    OutputConfig: OutputConfigInput,
    ExportSourceImages: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/export-earth-observation-job" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRasterDataCollectionOutput extends S.Class<GetRasterDataCollectionOutput>(
  "GetRasterDataCollectionOutput",
)({
  Name: S.String,
  Arn: S.String,
  Type: S.String,
  Description: S.String,
  DescriptionPageUrl: S.String,
  SupportedFilters: FilterList,
  ImageSourceBands: ImageSourceBandList,
  Tags: S.optional(Tags),
}) {}
export class ListRasterDataCollectionsOutput extends S.Class<ListRasterDataCollectionsOutput>(
  "ListRasterDataCollectionsOutput",
)({
  RasterDataCollectionSummaries: DataCollectionsList,
  NextToken: S.optional(S.String),
}) {}
export class StartVectorEnrichmentJobInput extends S.Class<StartVectorEnrichmentJobInput>(
  "StartVectorEnrichmentJobInput",
)(
  {
    Name: S.String,
    ClientToken: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    InputConfig: VectorEnrichmentJobInputConfig,
    JobConfig: VectorEnrichmentJobConfig,
    ExecutionRoleArn: S.String,
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/vector-enrichment-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetVectorEnrichmentJobOutput extends S.Class<GetVectorEnrichmentJobOutput>(
  "GetVectorEnrichmentJobOutput",
)({
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
}) {}
export class ListVectorEnrichmentJobOutput extends S.Class<ListVectorEnrichmentJobOutput>(
  "ListVectorEnrichmentJobOutput",
)({
  VectorEnrichmentJobSummaries: VectorEnrichmentJobList,
  NextToken: S.optional(S.String),
}) {}
export class ExportVectorEnrichmentJobInput extends S.Class<ExportVectorEnrichmentJobInput>(
  "ExportVectorEnrichmentJobInput",
)(
  {
    Arn: S.String,
    ClientToken: S.optional(S.String),
    ExecutionRoleArn: S.String,
    OutputConfig: ExportVectorEnrichmentJobOutputConfig,
  },
  T.all(
    T.Http({ method: "POST", uri: "/export-vector-enrichment-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StackConfigInput extends S.Class<StackConfigInput>(
  "StackConfigInput",
)({
  OutputResolution: S.optional(OutputResolutionStackInput),
  TargetBands: S.optional(StringListInput),
}) {}
export class ExportErrorDetailsOutput extends S.Class<ExportErrorDetailsOutput>(
  "ExportErrorDetailsOutput",
)({ Type: S.optional(S.String), Message: S.optional(S.String) }) {}
export class Operation extends S.Class<Operation>("Operation")({
  Name: S.String,
  Equation: S.String,
  OutputType: S.optional(S.String),
}) {}
export const OperationsListInput = S.Array(Operation);
export class ExportErrorDetails extends S.Class<ExportErrorDetails>(
  "ExportErrorDetails",
)({
  ExportResults: S.optional(ExportErrorDetailsOutput),
  ExportSourceImages: S.optional(ExportErrorDetailsOutput),
}) {}
export class CustomIndicesInput extends S.Class<CustomIndicesInput>(
  "CustomIndicesInput",
)({ Operations: S.optional(OperationsListInput) }) {}
export class OutputResolutionResamplingInput extends S.Class<OutputResolutionResamplingInput>(
  "OutputResolutionResamplingInput",
)({ UserDefined: UserDefined }) {}
export class TimeRangeFilterOutput extends S.Class<TimeRangeFilterOutput>(
  "TimeRangeFilterOutput",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("date-time")),
  EndTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ExportEarthObservationJobOutput extends S.Class<ExportEarthObservationJobOutput>(
  "ExportEarthObservationJobOutput",
)({
  Arn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  ExportStatus: S.String,
  ExecutionRoleArn: S.String,
  OutputConfig: OutputConfigInput,
  ExportSourceImages: S.optional(S.Boolean),
}) {}
export class StartVectorEnrichmentJobOutput extends S.Class<StartVectorEnrichmentJobOutput>(
  "StartVectorEnrichmentJobOutput",
)({
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
}) {}
export class ExportVectorEnrichmentJobOutput extends S.Class<ExportVectorEnrichmentJobOutput>(
  "ExportVectorEnrichmentJobOutput",
)({
  Arn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  ExecutionRoleArn: S.String,
  ExportStatus: S.String,
  OutputConfig: ExportVectorEnrichmentJobOutputConfig,
}) {}
export class BandMathConfigInput extends S.Class<BandMathConfigInput>(
  "BandMathConfigInput",
)({
  PredefinedIndices: S.optional(StringListInput),
  CustomIndices: S.optional(CustomIndicesInput),
}) {}
export class ResamplingConfigInput extends S.Class<ResamplingConfigInput>(
  "ResamplingConfigInput",
)({
  OutputResolution: OutputResolutionResamplingInput,
  AlgorithmName: S.optional(S.String),
  TargetBands: S.optional(StringListInput),
}) {}
export class RasterDataCollectionQueryOutput extends S.Class<RasterDataCollectionQueryOutput>(
  "RasterDataCollectionQueryOutput",
)({
  RasterDataCollectionArn: S.String,
  RasterDataCollectionName: S.String,
  TimeRangeFilter: TimeRangeFilterOutput,
  AreaOfInterest: S.optional(AreaOfInterest),
  PropertyFilters: S.optional(PropertyFilters),
}) {}
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
export class InputConfigOutput extends S.Class<InputConfigOutput>(
  "InputConfigOutput",
)({
  PreviousEarthObservationJobArn: S.optional(S.String),
  RasterDataCollectionQuery: S.optional(RasterDataCollectionQueryOutput),
}) {}
export class StartEarthObservationJobInput extends S.Class<StartEarthObservationJobInput>(
  "StartEarthObservationJobInput",
)(
  {
    Name: S.String,
    ClientToken: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    InputConfig: InputConfigInput,
    JobConfig: JobConfigInput,
    ExecutionRoleArn: S.String,
    Tags: S.optional(Tags),
  },
  T.all(
    T.Http({ method: "POST", uri: "/earth-observation-jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEarthObservationJobOutput extends S.Class<GetEarthObservationJobOutput>(
  "GetEarthObservationJobOutput",
)({
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
}) {}
export class RasterDataCollectionQueryWithBandFilterInput extends S.Class<RasterDataCollectionQueryWithBandFilterInput>(
  "RasterDataCollectionQueryWithBandFilterInput",
)({
  TimeRangeFilter: TimeRangeFilterInput,
  AreaOfInterest: S.optional(AreaOfInterest),
  PropertyFilters: S.optional(PropertyFilters),
  BandFilter: S.optional(StringListInput),
}) {}
export class StartEarthObservationJobOutput extends S.Class<StartEarthObservationJobOutput>(
  "StartEarthObservationJobOutput",
)({
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
}) {}
export class SearchRasterDataCollectionInput extends S.Class<SearchRasterDataCollectionInput>(
  "SearchRasterDataCollectionInput",
)(
  {
    Arn: S.String,
    RasterDataCollectionQuery: RasterDataCollectionQueryWithBandFilterInput,
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/search-raster-data-collection" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Geometry extends S.Class<Geometry>("Geometry")({
  Type: S.String,
  Coordinates: LinearRings,
}) {}
export class Properties extends S.Class<Properties>("Properties")({
  EoCloudCover: S.optional(S.Number),
  ViewOffNadir: S.optional(S.Number),
  ViewSunAzimuth: S.optional(S.Number),
  ViewSunElevation: S.optional(S.Number),
  Platform: S.optional(S.String),
  LandsatCloudCoverLand: S.optional(S.Number),
}) {}
export class AssetValue extends S.Class<AssetValue>("AssetValue")({
  Href: S.optional(S.String),
}) {}
export const AssetsMap = S.Record({ key: S.String, value: AssetValue });
export class ItemSource extends S.Class<ItemSource>("ItemSource")({
  Id: S.String,
  Geometry: Geometry,
  Assets: S.optional(AssetsMap),
  DateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Properties: S.optional(Properties),
}) {}
export const ItemSourceList = S.Array(ItemSource);
export class SearchRasterDataCollectionOutput extends S.Class<SearchRasterDataCollectionOutput>(
  "SearchRasterDataCollectionOutput",
)({
  ApproximateResultCount: S.Number,
  NextToken: S.optional(S.String),
  Items: S.optional(ItemSourceList),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String, ResourceId: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String, ResourceId: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String, ResourceId: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String, ResourceId: S.optional(S.String) },
) {}

//# Operations
/**
 * The resource you want to untag.
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
 * Use this operation to create an Earth observation job.
 */
export const startEarthObservationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Get the details for a previously initiated Earth Observation job.
 */
export const getEarthObservationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEarthObservationJobInput,
    output: GetEarthObservationJobOutput,
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
 * Use this operation to export results of an Earth Observation job and optionally source images used as input to the EOJ to an Amazon S3 location.
 */
export const exportEarthObservationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Use this operation to get a list of the Earth Observation jobs associated with the calling Amazon Web Services account.
 */
export const listEarthObservationJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getRasterDataCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRasterDataCollectionInput,
    output: GetRasterDataCollectionOutput,
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
 * Use this operation to get raster data collections.
 */
export const listRasterDataCollections =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getVectorEnrichmentJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetVectorEnrichmentJobInput,
    output: GetVectorEnrichmentJobOutput,
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
 * Retrieves a list of vector enrichment jobs.
 */
export const listVectorEnrichmentJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteEarthObservationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Gets a web mercator tile for the given Earth Observation job.
 */
export const getTile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * The resource you want to tag.
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
 * Use this operation to stop an existing earth observation job.
 */
export const stopEarthObservationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Use this operation to delete a Vector Enrichment job.
 */
export const deleteVectorEnrichmentJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Stops the Vector Enrichment job for a given job ARN.
 */
export const stopVectorEnrichmentJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a Vector Enrichment job for the supplied job type. Currently, there are two supported job types: reverse geocoding and map matching.
 */
export const startVectorEnrichmentJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Use this operation to copy results of a Vector Enrichment job to an Amazon S3 location.
 */
export const exportVectorEnrichmentJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Allows you run image query on a specific raster data collection to get a list of the satellite imagery matching the selected filters.
 */
export const searchRasterDataCollection =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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

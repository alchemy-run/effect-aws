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
const ns = T.XmlNamespace("http://pi.amazonaws.com/doc/2018-02-27/");
const svc = T.AwsApiService({
  sdkId: "PI",
  serviceShapeName: "PerformanceInsightsv20180227",
});
const auth = T.AwsAuthSigv4({ name: "pi" });
const ver = T.ServiceVersion("2018-02-27");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://pi-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://pi-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://pi.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://pi.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type IdentifierString = string;
export type AnalysisReportId = string;
export type RequestString = string;
export type Integer = number;
export type SanitizedString = string;
export type MaxResults = number;
export type NextToken = string;
export type AmazonResourceName = string;
export type TagKey = string;
export type TagValue = string;
export type Limit = number;
export type ErrorString = string;
export type Description = string;
export type MarkdownString = string | Redacted.Redacted<string>;
export type Double = number;
export type DescriptiveString = string;

//# Schemas
export type AdditionalMetricsList = string[];
export const AdditionalMetricsList = S.Array(S.String);
export type RequestedDimensionList = string[];
export const RequestedDimensionList = S.Array(S.String);
export type DimensionsMetricList = string[];
export const DimensionsMetricList = S.Array(S.String);
export type AuthorizedActionsList = string[];
export const AuthorizedActionsList = S.Array(S.String);
export type MetricTypeList = string[];
export const MetricTypeList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeletePerformanceAnalysisReportRequest {
  ServiceType: string;
  Identifier: string;
  AnalysisReportId: string;
}
export const DeletePerformanceAnalysisReportRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.String,
    Identifier: S.String,
    AnalysisReportId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePerformanceAnalysisReportRequest",
}) as any as S.Schema<DeletePerformanceAnalysisReportRequest>;
export interface DeletePerformanceAnalysisReportResponse {}
export const DeletePerformanceAnalysisReportResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePerformanceAnalysisReportResponse",
}) as any as S.Schema<DeletePerformanceAnalysisReportResponse>;
export interface GetDimensionKeyDetailsRequest {
  ServiceType: string;
  Identifier: string;
  Group: string;
  GroupIdentifier: string;
  RequestedDimensions?: RequestedDimensionList;
}
export const GetDimensionKeyDetailsRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.String,
    Identifier: S.String,
    Group: S.String,
    GroupIdentifier: S.String,
    RequestedDimensions: S.optional(RequestedDimensionList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDimensionKeyDetailsRequest",
}) as any as S.Schema<GetDimensionKeyDetailsRequest>;
export interface GetPerformanceAnalysisReportRequest {
  ServiceType: string;
  Identifier: string;
  AnalysisReportId: string;
  TextFormat?: string;
  AcceptLanguage?: string;
}
export const GetPerformanceAnalysisReportRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.String,
    Identifier: S.String,
    AnalysisReportId: S.String,
    TextFormat: S.optional(S.String),
    AcceptLanguage: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPerformanceAnalysisReportRequest",
}) as any as S.Schema<GetPerformanceAnalysisReportRequest>;
export interface GetResourceMetadataRequest {
  ServiceType: string;
  Identifier: string;
}
export const GetResourceMetadataRequest = S.suspend(() =>
  S.Struct({ ServiceType: S.String, Identifier: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceMetadataRequest",
}) as any as S.Schema<GetResourceMetadataRequest>;
export interface ListAvailableResourceDimensionsRequest {
  ServiceType: string;
  Identifier: string;
  Metrics: DimensionsMetricList;
  MaxResults?: number;
  NextToken?: string;
  AuthorizedActions?: AuthorizedActionsList;
}
export const ListAvailableResourceDimensionsRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.String,
    Identifier: S.String,
    Metrics: DimensionsMetricList,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AuthorizedActions: S.optional(AuthorizedActionsList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAvailableResourceDimensionsRequest",
}) as any as S.Schema<ListAvailableResourceDimensionsRequest>;
export interface ListAvailableResourceMetricsRequest {
  ServiceType: string;
  Identifier: string;
  MetricTypes: MetricTypeList;
  NextToken?: string;
  MaxResults?: number;
}
export const ListAvailableResourceMetricsRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.String,
    Identifier: S.String,
    MetricTypes: MetricTypeList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAvailableResourceMetricsRequest",
}) as any as S.Schema<ListAvailableResourceMetricsRequest>;
export interface ListPerformanceAnalysisReportsRequest {
  ServiceType: string;
  Identifier: string;
  NextToken?: string;
  MaxResults?: number;
  ListTags?: boolean;
}
export const ListPerformanceAnalysisReportsRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.String,
    Identifier: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ListTags: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPerformanceAnalysisReportsRequest",
}) as any as S.Schema<ListPerformanceAnalysisReportsRequest>;
export interface ListTagsForResourceRequest {
  ServiceType: string;
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ServiceType: S.String, ResourceARN: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ServiceType: string;
  ResourceARN: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.String,
    ResourceARN: S.String,
    Tags: TagList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ServiceType: string;
  ResourceARN: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.String,
    ResourceARN: S.String,
    TagKeys: TagKeyList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
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
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type SanitizedStringList = string[];
export const SanitizedStringList = S.Array(S.String);
export interface DimensionGroup {
  Group: string;
  Dimensions?: SanitizedStringList;
  Limit?: number;
}
export const DimensionGroup = S.suspend(() =>
  S.Struct({
    Group: S.String,
    Dimensions: S.optional(SanitizedStringList),
    Limit: S.optional(S.Number),
  }),
).annotations({
  identifier: "DimensionGroup",
}) as any as S.Schema<DimensionGroup>;
export type MetricQueryFilterMap = { [key: string]: string };
export const MetricQueryFilterMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface MetricQuery {
  Metric: string;
  GroupBy?: DimensionGroup;
  Filter?: MetricQueryFilterMap;
}
export const MetricQuery = S.suspend(() =>
  S.Struct({
    Metric: S.String,
    GroupBy: S.optional(DimensionGroup),
    Filter: S.optional(MetricQueryFilterMap),
  }),
).annotations({ identifier: "MetricQuery" }) as any as S.Schema<MetricQuery>;
export type MetricQueryList = MetricQuery[];
export const MetricQueryList = S.Array(MetricQuery);
export interface CreatePerformanceAnalysisReportRequest {
  ServiceType: string;
  Identifier: string;
  StartTime: Date;
  EndTime: Date;
  Tags?: TagList;
}
export const CreatePerformanceAnalysisReportRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.String,
    Identifier: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePerformanceAnalysisReportRequest",
}) as any as S.Schema<CreatePerformanceAnalysisReportRequest>;
export interface DescribeDimensionKeysRequest {
  ServiceType: string;
  Identifier: string;
  StartTime: Date;
  EndTime: Date;
  Metric: string;
  PeriodInSeconds?: number;
  GroupBy: DimensionGroup;
  AdditionalMetrics?: AdditionalMetricsList;
  PartitionBy?: DimensionGroup;
  Filter?: MetricQueryFilterMap;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeDimensionKeysRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.String,
    Identifier: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Metric: S.String,
    PeriodInSeconds: S.optional(S.Number),
    GroupBy: DimensionGroup,
    AdditionalMetrics: S.optional(AdditionalMetricsList),
    PartitionBy: S.optional(DimensionGroup),
    Filter: S.optional(MetricQueryFilterMap),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDimensionKeysRequest",
}) as any as S.Schema<DescribeDimensionKeysRequest>;
export interface GetResourceMetricsRequest {
  ServiceType: string;
  Identifier: string;
  MetricQueries: MetricQueryList;
  StartTime: Date;
  EndTime: Date;
  PeriodInSeconds?: number;
  MaxResults?: number;
  NextToken?: string;
  PeriodAlignment?: string;
}
export const GetResourceMetricsRequest = S.suspend(() =>
  S.Struct({
    ServiceType: S.String,
    Identifier: S.String,
    MetricQueries: MetricQueryList,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    PeriodInSeconds: S.optional(S.Number),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    PeriodAlignment: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceMetricsRequest",
}) as any as S.Schema<GetResourceMetricsRequest>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface DimensionKeyDetail {
  Value?: string;
  Dimension?: string;
  Status?: string;
}
export const DimensionKeyDetail = S.suspend(() =>
  S.Struct({
    Value: S.optional(S.String),
    Dimension: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "DimensionKeyDetail",
}) as any as S.Schema<DimensionKeyDetail>;
export type DimensionKeyDetailList = DimensionKeyDetail[];
export const DimensionKeyDetailList = S.Array(DimensionKeyDetail);
export interface ResponseResourceMetric {
  Metric?: string;
  Description?: string;
  Unit?: string;
}
export const ResponseResourceMetric = S.suspend(() =>
  S.Struct({
    Metric: S.optional(S.String),
    Description: S.optional(S.String),
    Unit: S.optional(S.String),
  }),
).annotations({
  identifier: "ResponseResourceMetric",
}) as any as S.Schema<ResponseResourceMetric>;
export type ResponseResourceMetricList = ResponseResourceMetric[];
export const ResponseResourceMetricList = S.Array(ResponseResourceMetric);
export interface AnalysisReportSummary {
  AnalysisReportId?: string;
  CreateTime?: Date;
  StartTime?: Date;
  EndTime?: Date;
  Status?: string;
  Tags?: TagList;
}
export const AnalysisReportSummary = S.suspend(() =>
  S.Struct({
    AnalysisReportId: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "AnalysisReportSummary",
}) as any as S.Schema<AnalysisReportSummary>;
export type AnalysisReportSummaryList = AnalysisReportSummary[];
export const AnalysisReportSummaryList = S.Array(AnalysisReportSummary);
export interface CreatePerformanceAnalysisReportResponse {
  AnalysisReportId?: string;
}
export const CreatePerformanceAnalysisReportResponse = S.suspend(() =>
  S.Struct({ AnalysisReportId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreatePerformanceAnalysisReportResponse",
}) as any as S.Schema<CreatePerformanceAnalysisReportResponse>;
export interface GetDimensionKeyDetailsResponse {
  Dimensions?: DimensionKeyDetailList;
}
export const GetDimensionKeyDetailsResponse = S.suspend(() =>
  S.Struct({ Dimensions: S.optional(DimensionKeyDetailList) }).pipe(ns),
).annotations({
  identifier: "GetDimensionKeyDetailsResponse",
}) as any as S.Schema<GetDimensionKeyDetailsResponse>;
export interface ListAvailableResourceMetricsResponse {
  Metrics?: ResponseResourceMetricList;
  NextToken?: string;
}
export const ListAvailableResourceMetricsResponse = S.suspend(() =>
  S.Struct({
    Metrics: S.optional(ResponseResourceMetricList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAvailableResourceMetricsResponse",
}) as any as S.Schema<ListAvailableResourceMetricsResponse>;
export interface ListPerformanceAnalysisReportsResponse {
  AnalysisReports?: AnalysisReportSummaryList;
  NextToken?: string;
}
export const ListPerformanceAnalysisReportsResponse = S.suspend(() =>
  S.Struct({
    AnalysisReports: S.optional(AnalysisReportSummaryList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPerformanceAnalysisReportsResponse",
}) as any as S.Schema<ListPerformanceAnalysisReportsResponse>;
export type MetricValuesList = number[];
export const MetricValuesList = S.Array(S.Number);
export interface FeatureMetadata {
  Status?: string;
}
export const FeatureMetadata = S.suspend(() =>
  S.Struct({ Status: S.optional(S.String) }),
).annotations({
  identifier: "FeatureMetadata",
}) as any as S.Schema<FeatureMetadata>;
export type FeatureMetadataMap = { [key: string]: FeatureMetadata };
export const FeatureMetadataMap = S.Record({
  key: S.String,
  value: FeatureMetadata,
});
export interface Recommendation {
  RecommendationId?: string;
  RecommendationDescription?: string | Redacted.Redacted<string>;
}
export const Recommendation = S.suspend(() =>
  S.Struct({
    RecommendationId: S.optional(S.String),
    RecommendationDescription: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export type RecommendationList = Recommendation[];
export const RecommendationList = S.Array(Recommendation);
export interface DimensionDetail {
  Identifier?: string;
}
export const DimensionDetail = S.suspend(() =>
  S.Struct({ Identifier: S.optional(S.String) }),
).annotations({
  identifier: "DimensionDetail",
}) as any as S.Schema<DimensionDetail>;
export type DimensionDetailList = DimensionDetail[];
export const DimensionDetailList = S.Array(DimensionDetail);
export interface GetResourceMetadataResponse {
  Identifier?: string;
  Features?: FeatureMetadataMap;
}
export const GetResourceMetadataResponse = S.suspend(() =>
  S.Struct({
    Identifier: S.optional(S.String),
    Features: S.optional(FeatureMetadataMap),
  }).pipe(ns),
).annotations({
  identifier: "GetResourceMetadataResponse",
}) as any as S.Schema<GetResourceMetadataResponse>;
export type DimensionMap = { [key: string]: string };
export const DimensionMap = S.Record({ key: S.String, value: S.String });
export type AdditionalMetricsMap = { [key: string]: number };
export const AdditionalMetricsMap = S.Record({
  key: S.String,
  value: S.Number,
});
export interface ResponseResourceMetricKey {
  Metric: string;
  Dimensions?: DimensionMap;
}
export const ResponseResourceMetricKey = S.suspend(() =>
  S.Struct({ Metric: S.String, Dimensions: S.optional(DimensionMap) }),
).annotations({
  identifier: "ResponseResourceMetricKey",
}) as any as S.Schema<ResponseResourceMetricKey>;
export interface DataPoint {
  Timestamp: Date;
  Value: number;
}
export const DataPoint = S.suspend(() =>
  S.Struct({
    Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Value: S.Number,
  }),
).annotations({ identifier: "DataPoint" }) as any as S.Schema<DataPoint>;
export type DataPointsList = DataPoint[];
export const DataPointsList = S.Array(DataPoint);
export interface DimensionGroupDetail {
  Group?: string;
  Dimensions?: DimensionDetailList;
}
export const DimensionGroupDetail = S.suspend(() =>
  S.Struct({
    Group: S.optional(S.String),
    Dimensions: S.optional(DimensionDetailList),
  }),
).annotations({
  identifier: "DimensionGroupDetail",
}) as any as S.Schema<DimensionGroupDetail>;
export type DimensionGroupDetailList = DimensionGroupDetail[];
export const DimensionGroupDetailList = S.Array(DimensionGroupDetail);
export interface ResponsePartitionKey {
  Dimensions: DimensionMap;
}
export const ResponsePartitionKey = S.suspend(() =>
  S.Struct({ Dimensions: DimensionMap }),
).annotations({
  identifier: "ResponsePartitionKey",
}) as any as S.Schema<ResponsePartitionKey>;
export type ResponsePartitionKeyList = ResponsePartitionKey[];
export const ResponsePartitionKeyList = S.Array(ResponsePartitionKey);
export interface DimensionKeyDescription {
  Dimensions?: DimensionMap;
  Total?: number;
  AdditionalMetrics?: AdditionalMetricsMap;
  Partitions?: MetricValuesList;
}
export const DimensionKeyDescription = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(DimensionMap),
    Total: S.optional(S.Number),
    AdditionalMetrics: S.optional(AdditionalMetricsMap),
    Partitions: S.optional(MetricValuesList),
  }),
).annotations({
  identifier: "DimensionKeyDescription",
}) as any as S.Schema<DimensionKeyDescription>;
export type DimensionKeyDescriptionList = DimensionKeyDescription[];
export const DimensionKeyDescriptionList = S.Array(DimensionKeyDescription);
export interface MetricKeyDataPoints {
  Key?: ResponseResourceMetricKey;
  DataPoints?: DataPointsList;
}
export const MetricKeyDataPoints = S.suspend(() =>
  S.Struct({
    Key: S.optional(ResponseResourceMetricKey),
    DataPoints: S.optional(DataPointsList),
  }),
).annotations({
  identifier: "MetricKeyDataPoints",
}) as any as S.Schema<MetricKeyDataPoints>;
export type MetricKeyDataPointsList = MetricKeyDataPoints[];
export const MetricKeyDataPointsList = S.Array(MetricKeyDataPoints);
export interface MetricDimensionGroups {
  Metric?: string;
  Groups?: DimensionGroupDetailList;
}
export const MetricDimensionGroups = S.suspend(() =>
  S.Struct({
    Metric: S.optional(S.String),
    Groups: S.optional(DimensionGroupDetailList),
  }),
).annotations({
  identifier: "MetricDimensionGroups",
}) as any as S.Schema<MetricDimensionGroups>;
export type MetricDimensionsList = MetricDimensionGroups[];
export const MetricDimensionsList = S.Array(MetricDimensionGroups);
export interface DescribeDimensionKeysResponse {
  AlignedStartTime?: Date;
  AlignedEndTime?: Date;
  PartitionKeys?: ResponsePartitionKeyList;
  Keys?: DimensionKeyDescriptionList;
  NextToken?: string;
}
export const DescribeDimensionKeysResponse = S.suspend(() =>
  S.Struct({
    AlignedStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AlignedEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PartitionKeys: S.optional(ResponsePartitionKeyList),
    Keys: S.optional(DimensionKeyDescriptionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDimensionKeysResponse",
}) as any as S.Schema<DescribeDimensionKeysResponse>;
export type DescriptiveMap = { [key: string]: string };
export const DescriptiveMap = S.Record({ key: S.String, value: S.String });
export interface GetResourceMetricsResponse {
  AlignedStartTime?: Date;
  AlignedEndTime?: Date;
  Identifier?: string;
  MetricList?: MetricKeyDataPointsList;
  NextToken?: string;
}
export const GetResourceMetricsResponse = S.suspend(() =>
  S.Struct({
    AlignedStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AlignedEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Identifier: S.optional(S.String),
    MetricList: S.optional(MetricKeyDataPointsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetResourceMetricsResponse",
}) as any as S.Schema<GetResourceMetricsResponse>;
export interface ListAvailableResourceDimensionsResponse {
  MetricDimensions?: MetricDimensionsList;
  NextToken?: string;
}
export const ListAvailableResourceDimensionsResponse = S.suspend(() =>
  S.Struct({
    MetricDimensions: S.optional(MetricDimensionsList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAvailableResourceDimensionsResponse",
}) as any as S.Schema<ListAvailableResourceDimensionsResponse>;
export interface PerformanceInsightsMetric {
  Metric?: string;
  DisplayName?: string;
  Dimensions?: DescriptiveMap;
  Filter?: DescriptiveMap;
  Value?: number;
}
export const PerformanceInsightsMetric = S.suspend(() =>
  S.Struct({
    Metric: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Dimensions: S.optional(DescriptiveMap),
    Filter: S.optional(DescriptiveMap),
    Value: S.optional(S.Number),
  }),
).annotations({
  identifier: "PerformanceInsightsMetric",
}) as any as S.Schema<PerformanceInsightsMetric>;
export interface Data {
  PerformanceInsightsMetric?: PerformanceInsightsMetric;
}
export const Data = S.suspend(() =>
  S.Struct({
    PerformanceInsightsMetric: S.optional(PerformanceInsightsMetric),
  }),
).annotations({ identifier: "Data" }) as any as S.Schema<Data>;
export type DataList = Data[];
export const DataList = S.Array(Data);
export interface Insight {
  InsightId: string;
  InsightType?: string;
  Context?: string;
  StartTime?: Date;
  EndTime?: Date;
  Severity?: string;
  SupportingInsights?: InsightList;
  Description?: string | Redacted.Redacted<string>;
  Recommendations?: RecommendationList;
  InsightData?: DataList;
  BaselineData?: DataList;
}
export const Insight = S.suspend(() =>
  S.Struct({
    InsightId: S.String,
    InsightType: S.optional(S.String),
    Context: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Severity: S.optional(S.String),
    SupportingInsights: S.optional(
      S.suspend(() => InsightList).annotations({ identifier: "InsightList" }),
    ),
    Description: S.optional(SensitiveString),
    Recommendations: S.optional(RecommendationList),
    InsightData: S.optional(DataList),
    BaselineData: S.optional(DataList),
  }),
).annotations({ identifier: "Insight" }) as any as S.Schema<Insight>;
export type InsightList = Insight[];
export const InsightList = S.Array(
  S.suspend((): S.Schema<Insight, any> => Insight).annotations({
    identifier: "Insight",
  }),
) as any as S.Schema<InsightList>;
export interface AnalysisReport {
  AnalysisReportId: string;
  Identifier?: string;
  ServiceType?: string;
  CreateTime?: Date;
  StartTime?: Date;
  EndTime?: Date;
  Status?: string;
  Insights?: InsightList;
}
export const AnalysisReport = S.suspend(() =>
  S.Struct({
    AnalysisReportId: S.String,
    Identifier: S.optional(S.String),
    ServiceType: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    Insights: S.optional(InsightList),
  }),
).annotations({
  identifier: "AnalysisReport",
}) as any as S.Schema<AnalysisReport>;
export interface GetPerformanceAnalysisReportResponse {
  AnalysisReport?: AnalysisReport;
}
export const GetPerformanceAnalysisReportResponse = S.suspend(() =>
  S.Struct({ AnalysisReport: S.optional(AnalysisReport) }).pipe(ns),
).annotations({
  identifier: "GetPerformanceAnalysisReportResponse",
}) as any as S.Schema<GetPerformanceAnalysisReportResponse>;

//# Errors
export class InternalServiceError extends S.TaggedError<InternalServiceError>()(
  "InternalServiceError",
  { Message: S.optional(S.String) },
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { Message: S.optional(S.String) },
) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a performance analysis report.
 */
export const deletePerformanceAnalysisReport: (
  input: DeletePerformanceAnalysisReportRequest,
) => Effect.Effect<
  DeletePerformanceAnalysisReportResponse,
  | InternalServiceError
  | InvalidArgumentException
  | NotAuthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePerformanceAnalysisReportRequest,
  output: DeletePerformanceAnalysisReportResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));
/**
 * Retrieve the metadata for different features. For example, the metadata might indicate
 * that a feature is turned on or off on a specific DB instance.
 */
export const getResourceMetadata: (
  input: GetResourceMetadataRequest,
) => Effect.Effect<
  GetResourceMetadataResponse,
  | InternalServiceError
  | InvalidArgumentException
  | NotAuthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceMetadataRequest,
  output: GetResourceMetadataResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));
/**
 * Get the attributes of the specified dimension group for a DB instance or data source. For example, if you specify a SQL ID,
 * `GetDimensionKeyDetails` retrieves the full text of the dimension `db.sql.statement` associated with this ID.
 * This operation is useful because `GetResourceMetrics` and `DescribeDimensionKeys` don't support retrieval of large
 * SQL statement text, lock snapshots, and execution plans.
 */
export const getDimensionKeyDetails: (
  input: GetDimensionKeyDetailsRequest,
) => Effect.Effect<
  GetDimensionKeyDetailsResponse,
  | InternalServiceError
  | InvalidArgumentException
  | NotAuthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDimensionKeyDetailsRequest,
  output: GetDimensionKeyDetailsResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));
/**
 * Retrieve metrics of the specified types that can be queried for a specified DB instance.
 */
export const listAvailableResourceMetrics: {
  (
    input: ListAvailableResourceMetricsRequest,
  ): Effect.Effect<
    ListAvailableResourceMetricsResponse,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAvailableResourceMetricsRequest,
  ) => Stream.Stream<
    ListAvailableResourceMetricsResponse,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAvailableResourceMetricsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAvailableResourceMetricsRequest,
  output: ListAvailableResourceMetricsResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the analysis reports created for the DB instance. The reports are sorted based on the start time of each report.
 */
export const listPerformanceAnalysisReports: {
  (
    input: ListPerformanceAnalysisReportsRequest,
  ): Effect.Effect<
    ListPerformanceAnalysisReportsResponse,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPerformanceAnalysisReportsRequest,
  ) => Stream.Stream<
    ListPerformanceAnalysisReportsResponse,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPerformanceAnalysisReportsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPerformanceAnalysisReportsRequest,
  output: ListPerformanceAnalysisReportsResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves all the metadata tags associated with Amazon RDS Performance Insights resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalServiceError
  | InvalidArgumentException
  | NotAuthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));
/**
 * Adds metadata tags to the Amazon RDS Performance Insights resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServiceError
  | InvalidArgumentException
  | NotAuthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));
/**
 * Deletes the metadata tags from the Amazon RDS Performance Insights resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServiceError
  | InvalidArgumentException
  | NotAuthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));
/**
 * Creates a new performance analysis report for a specific time period for the
 * DB instance.
 */
export const createPerformanceAnalysisReport: (
  input: CreatePerformanceAnalysisReportRequest,
) => Effect.Effect<
  CreatePerformanceAnalysisReportResponse,
  | InternalServiceError
  | InvalidArgumentException
  | NotAuthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePerformanceAnalysisReportRequest,
  output: CreatePerformanceAnalysisReportResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));
/**
 * For a specific time period, retrieve the top `N` dimension keys for a metric.
 *
 * Each response element returns a maximum of 500 bytes. For larger elements, such as SQL statements,
 * only the first 500 bytes are returned.
 */
export const describeDimensionKeys: {
  (
    input: DescribeDimensionKeysRequest,
  ): Effect.Effect<
    DescribeDimensionKeysResponse,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDimensionKeysRequest,
  ) => Stream.Stream<
    DescribeDimensionKeysResponse,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDimensionKeysRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDimensionKeysRequest,
  output: DescribeDimensionKeysResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve Performance Insights metrics for a set of data sources over a time period. You can provide
 * specific dimension groups and dimensions, and provide filtering criteria for each group. You must specify an aggregate function for
 * each metric.
 *
 * Each response element returns a maximum of 500 bytes. For larger elements, such as SQL statements,
 * only the first 500 bytes are returned.
 */
export const getResourceMetrics: {
  (
    input: GetResourceMetricsRequest,
  ): Effect.Effect<
    GetResourceMetricsResponse,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourceMetricsRequest,
  ) => Stream.Stream<
    GetResourceMetricsResponse,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourceMetricsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourceMetricsRequest,
  output: GetResourceMetricsResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve the dimensions that can be queried for each specified metric type on a specified DB instance.
 */
export const listAvailableResourceDimensions: {
  (
    input: ListAvailableResourceDimensionsRequest,
  ): Effect.Effect<
    ListAvailableResourceDimensionsResponse,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAvailableResourceDimensionsRequest,
  ) => Stream.Stream<
    ListAvailableResourceDimensionsResponse,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAvailableResourceDimensionsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServiceError
    | InvalidArgumentException
    | NotAuthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAvailableResourceDimensionsRequest,
  output: ListAvailableResourceDimensionsResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the report including the report ID, status, time details, and the insights
 * with recommendations. The report status can be `RUNNING`,
 * `SUCCEEDED`, or `FAILED`. The insights include the
 * `description` and `recommendation` fields.
 */
export const getPerformanceAnalysisReport: (
  input: GetPerformanceAnalysisReportRequest,
) => Effect.Effect<
  GetPerformanceAnalysisReportResponse,
  | InternalServiceError
  | InvalidArgumentException
  | NotAuthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPerformanceAnalysisReportRequest,
  output: GetPerformanceAnalysisReportResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));

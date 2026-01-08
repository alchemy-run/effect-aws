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
  sdkId: "Textract",
  serviceShapeName: "Textract",
});
const auth = T.AwsAuthSigv4({ name: "textract" });
const ver = T.ServiceVersion("2018-06-27");
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
              `https://textract-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://textract-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://textract.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://textract.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AdapterName = string;
export type ClientRequestToken = string;
export type AdapterDescription = string;
export type AdapterId = string;
export type KMSKeyId = string;
export type AdapterVersion = string;
export type JobId = string;
export type MaxResults = number;
export type PaginationToken = string;
export type AmazonResourceName = string;
export type JobTag = string;
export type TagKey = string;
export type HumanLoopName = string;
export type FlowDefinitionArn = string;
export type TagValue = string;
export type S3Bucket = string;
export type S3ObjectName = string;
export type SNSTopicArn = string;
export type RoleArn = string;
export type AdapterVersionStatusMessage = string;
export type StatusMessage = string;
export type S3ObjectVersion = string;
export type QueryInput = string;
export type QueryPage = string;
export type AdapterPage = string;
export type UInteger = number;
export type Percent = number;
export type NonEmptyString = string;
export type ErrorCode = string;
export type Angle = number;
export type Float = number;
export type HumanLoopArn = string;
export type HumanLoopActivationReason = string;
export type SynthesizedJsonHumanLoopActivationConditionsEvaluationResults =
  string;

//# Schemas
export type FeatureTypes = string[];
export const FeatureTypes = S.Array(S.String);
export interface S3Object {
  Bucket?: string;
  Name?: string;
  Version?: string;
}
export const S3Object = S.suspend(() =>
  S.Struct({
    Bucket: S.optional(S.String),
    Name: S.optional(S.String),
    Version: S.optional(S.String),
  }),
).annotations({ identifier: "S3Object" }) as any as S.Schema<S3Object>;
export interface Document {
  Bytes?: Uint8Array;
  S3Object?: S3Object;
}
export const Document = S.suspend(() =>
  S.Struct({ Bytes: S.optional(T.Blob), S3Object: S.optional(S3Object) }),
).annotations({ identifier: "Document" }) as any as S.Schema<Document>;
export type DocumentPages = Document[];
export const DocumentPages = S.Array(Document);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AnalyzeExpenseRequest {
  Document: Document;
}
export const AnalyzeExpenseRequest = S.suspend(() =>
  S.Struct({ Document: Document }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AnalyzeExpenseRequest",
}) as any as S.Schema<AnalyzeExpenseRequest>;
export interface AnalyzeIDRequest {
  DocumentPages: DocumentPages;
}
export const AnalyzeIDRequest = S.suspend(() =>
  S.Struct({ DocumentPages: DocumentPages }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AnalyzeIDRequest",
}) as any as S.Schema<AnalyzeIDRequest>;
export interface DeleteAdapterRequest {
  AdapterId: string;
}
export const DeleteAdapterRequest = S.suspend(() =>
  S.Struct({ AdapterId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAdapterRequest",
}) as any as S.Schema<DeleteAdapterRequest>;
export interface DeleteAdapterResponse {}
export const DeleteAdapterResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAdapterResponse",
}) as any as S.Schema<DeleteAdapterResponse>;
export interface DeleteAdapterVersionRequest {
  AdapterId: string;
  AdapterVersion: string;
}
export const DeleteAdapterVersionRequest = S.suspend(() =>
  S.Struct({ AdapterId: S.String, AdapterVersion: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAdapterVersionRequest",
}) as any as S.Schema<DeleteAdapterVersionRequest>;
export interface DeleteAdapterVersionResponse {}
export const DeleteAdapterVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAdapterVersionResponse",
}) as any as S.Schema<DeleteAdapterVersionResponse>;
export interface DetectDocumentTextRequest {
  Document: Document;
}
export const DetectDocumentTextRequest = S.suspend(() =>
  S.Struct({ Document: Document }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DetectDocumentTextRequest",
}) as any as S.Schema<DetectDocumentTextRequest>;
export interface GetAdapterRequest {
  AdapterId: string;
}
export const GetAdapterRequest = S.suspend(() =>
  S.Struct({ AdapterId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAdapterRequest",
}) as any as S.Schema<GetAdapterRequest>;
export interface GetAdapterVersionRequest {
  AdapterId: string;
  AdapterVersion: string;
}
export const GetAdapterVersionRequest = S.suspend(() =>
  S.Struct({ AdapterId: S.String, AdapterVersion: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAdapterVersionRequest",
}) as any as S.Schema<GetAdapterVersionRequest>;
export interface GetDocumentAnalysisRequest {
  JobId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetDocumentAnalysisRequest = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDocumentAnalysisRequest",
}) as any as S.Schema<GetDocumentAnalysisRequest>;
export interface GetDocumentTextDetectionRequest {
  JobId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetDocumentTextDetectionRequest = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDocumentTextDetectionRequest",
}) as any as S.Schema<GetDocumentTextDetectionRequest>;
export interface GetExpenseAnalysisRequest {
  JobId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetExpenseAnalysisRequest = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetExpenseAnalysisRequest",
}) as any as S.Schema<GetExpenseAnalysisRequest>;
export interface GetLendingAnalysisRequest {
  JobId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetLendingAnalysisRequest = S.suspend(() =>
  S.Struct({
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetLendingAnalysisRequest",
}) as any as S.Schema<GetLendingAnalysisRequest>;
export interface GetLendingAnalysisSummaryRequest {
  JobId: string;
}
export const GetLendingAnalysisSummaryRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetLendingAnalysisSummaryRequest",
}) as any as S.Schema<GetLendingAnalysisSummaryRequest>;
export interface ListAdaptersRequest {
  AfterCreationTime?: Date;
  BeforeCreationTime?: Date;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAdaptersRequest = S.suspend(() =>
  S.Struct({
    AfterCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BeforeCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAdaptersRequest",
}) as any as S.Schema<ListAdaptersRequest>;
export interface ListAdapterVersionsRequest {
  AdapterId?: string;
  AfterCreationTime?: Date;
  BeforeCreationTime?: Date;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAdapterVersionsRequest = S.suspend(() =>
  S.Struct({
    AdapterId: S.optional(S.String),
    AfterCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BeforeCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAdapterVersionsRequest",
}) as any as S.Schema<ListAdapterVersionsRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface DocumentLocation {
  S3Object?: S3Object;
}
export const DocumentLocation = S.suspend(() =>
  S.Struct({ S3Object: S.optional(S3Object) }),
).annotations({
  identifier: "DocumentLocation",
}) as any as S.Schema<DocumentLocation>;
export interface NotificationChannel {
  SNSTopicArn: string;
  RoleArn: string;
}
export const NotificationChannel = S.suspend(() =>
  S.Struct({ SNSTopicArn: S.String, RoleArn: S.String }),
).annotations({
  identifier: "NotificationChannel",
}) as any as S.Schema<NotificationChannel>;
export interface OutputConfig {
  S3Bucket: string;
  S3Prefix?: string;
}
export const OutputConfig = S.suspend(() =>
  S.Struct({ S3Bucket: S.String, S3Prefix: S.optional(S.String) }),
).annotations({ identifier: "OutputConfig" }) as any as S.Schema<OutputConfig>;
export interface StartDocumentTextDetectionRequest {
  DocumentLocation: DocumentLocation;
  ClientRequestToken?: string;
  JobTag?: string;
  NotificationChannel?: NotificationChannel;
  OutputConfig?: OutputConfig;
  KMSKeyId?: string;
}
export const StartDocumentTextDetectionRequest = S.suspend(() =>
  S.Struct({
    DocumentLocation: DocumentLocation,
    ClientRequestToken: S.optional(S.String),
    JobTag: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    OutputConfig: S.optional(OutputConfig),
    KMSKeyId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartDocumentTextDetectionRequest",
}) as any as S.Schema<StartDocumentTextDetectionRequest>;
export interface StartExpenseAnalysisRequest {
  DocumentLocation: DocumentLocation;
  ClientRequestToken?: string;
  JobTag?: string;
  NotificationChannel?: NotificationChannel;
  OutputConfig?: OutputConfig;
  KMSKeyId?: string;
}
export const StartExpenseAnalysisRequest = S.suspend(() =>
  S.Struct({
    DocumentLocation: DocumentLocation,
    ClientRequestToken: S.optional(S.String),
    JobTag: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    OutputConfig: S.optional(OutputConfig),
    KMSKeyId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartExpenseAnalysisRequest",
}) as any as S.Schema<StartExpenseAnalysisRequest>;
export interface StartLendingAnalysisRequest {
  DocumentLocation: DocumentLocation;
  ClientRequestToken?: string;
  JobTag?: string;
  NotificationChannel?: NotificationChannel;
  OutputConfig?: OutputConfig;
  KMSKeyId?: string;
}
export const StartLendingAnalysisRequest = S.suspend(() =>
  S.Struct({
    DocumentLocation: DocumentLocation,
    ClientRequestToken: S.optional(S.String),
    JobTag: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    OutputConfig: S.optional(OutputConfig),
    KMSKeyId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartLendingAnalysisRequest",
}) as any as S.Schema<StartLendingAnalysisRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagMap }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateAdapterRequest {
  AdapterId: string;
  Description?: string;
  AdapterName?: string;
  AutoUpdate?: string;
}
export const UpdateAdapterRequest = S.suspend(() =>
  S.Struct({
    AdapterId: S.String,
    Description: S.optional(S.String),
    AdapterName: S.optional(S.String),
    AutoUpdate: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAdapterRequest",
}) as any as S.Schema<UpdateAdapterRequest>;
export interface AdapterVersionDatasetConfig {
  ManifestS3Object?: S3Object;
}
export const AdapterVersionDatasetConfig = S.suspend(() =>
  S.Struct({ ManifestS3Object: S.optional(S3Object) }),
).annotations({
  identifier: "AdapterVersionDatasetConfig",
}) as any as S.Schema<AdapterVersionDatasetConfig>;
export type ContentClassifiers = string[];
export const ContentClassifiers = S.Array(S.String);
export type QueryPages = string[];
export const QueryPages = S.Array(S.String);
export type AdapterPages = string[];
export const AdapterPages = S.Array(S.String);
export interface CreateAdapterRequest {
  AdapterName: string;
  ClientRequestToken?: string;
  Description?: string;
  FeatureTypes: FeatureTypes;
  AutoUpdate?: string;
  Tags?: TagMap;
}
export const CreateAdapterRequest = S.suspend(() =>
  S.Struct({
    AdapterName: S.String,
    ClientRequestToken: S.optional(S.String),
    Description: S.optional(S.String),
    FeatureTypes: FeatureTypes,
    AutoUpdate: S.optional(S.String),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAdapterRequest",
}) as any as S.Schema<CreateAdapterRequest>;
export interface CreateAdapterVersionRequest {
  AdapterId: string;
  ClientRequestToken?: string;
  DatasetConfig: AdapterVersionDatasetConfig;
  KMSKeyId?: string;
  OutputConfig: OutputConfig;
  Tags?: TagMap;
}
export const CreateAdapterVersionRequest = S.suspend(() =>
  S.Struct({
    AdapterId: S.String,
    ClientRequestToken: S.optional(S.String),
    DatasetConfig: AdapterVersionDatasetConfig,
    KMSKeyId: S.optional(S.String),
    OutputConfig: OutputConfig,
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAdapterVersionRequest",
}) as any as S.Schema<CreateAdapterVersionRequest>;
export interface GetAdapterResponse {
  AdapterId?: string;
  AdapterName?: string;
  CreationTime?: Date;
  Description?: string;
  FeatureTypes?: FeatureTypes;
  AutoUpdate?: string;
  Tags?: TagMap;
}
export const GetAdapterResponse = S.suspend(() =>
  S.Struct({
    AdapterId: S.optional(S.String),
    AdapterName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    FeatureTypes: S.optional(FeatureTypes),
    AutoUpdate: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetAdapterResponse",
}) as any as S.Schema<GetAdapterResponse>;
export interface DocumentMetadata {
  Pages?: number;
}
export const DocumentMetadata = S.suspend(() =>
  S.Struct({ Pages: S.optional(S.Number) }),
).annotations({
  identifier: "DocumentMetadata",
}) as any as S.Schema<DocumentMetadata>;
export interface BoundingBox {
  Width?: number;
  Height?: number;
  Left?: number;
  Top?: number;
}
export const BoundingBox = S.suspend(() =>
  S.Struct({
    Width: S.optional(S.Number),
    Height: S.optional(S.Number),
    Left: S.optional(S.Number),
    Top: S.optional(S.Number),
  }),
).annotations({ identifier: "BoundingBox" }) as any as S.Schema<BoundingBox>;
export interface Point {
  X?: number;
  Y?: number;
}
export const Point = S.suspend(() =>
  S.Struct({ X: S.optional(S.Number), Y: S.optional(S.Number) }),
).annotations({ identifier: "Point" }) as any as S.Schema<Point>;
export type Polygon = Point[];
export const Polygon = S.Array(Point);
export interface Geometry {
  BoundingBox?: BoundingBox;
  Polygon?: Polygon;
  RotationAngle?: number;
}
export const Geometry = S.suspend(() =>
  S.Struct({
    BoundingBox: S.optional(BoundingBox),
    Polygon: S.optional(Polygon),
    RotationAngle: S.optional(S.Number),
  }),
).annotations({ identifier: "Geometry" }) as any as S.Schema<Geometry>;
export type IdList = string[];
export const IdList = S.Array(S.String);
export interface Relationship {
  Type?: string;
  Ids?: IdList;
}
export const Relationship = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Ids: S.optional(IdList) }),
).annotations({ identifier: "Relationship" }) as any as S.Schema<Relationship>;
export type RelationshipList = Relationship[];
export const RelationshipList = S.Array(Relationship);
export type EntityTypes = string[];
export const EntityTypes = S.Array(S.String);
export interface Query {
  Text: string;
  Alias?: string;
  Pages?: QueryPages;
}
export const Query = S.suspend(() =>
  S.Struct({
    Text: S.String,
    Alias: S.optional(S.String),
    Pages: S.optional(QueryPages),
  }),
).annotations({ identifier: "Query" }) as any as S.Schema<Query>;
export interface Block {
  BlockType?: string;
  Confidence?: number;
  Text?: string;
  TextType?: string;
  RowIndex?: number;
  ColumnIndex?: number;
  RowSpan?: number;
  ColumnSpan?: number;
  Geometry?: Geometry;
  Id?: string;
  Relationships?: RelationshipList;
  EntityTypes?: EntityTypes;
  SelectionStatus?: string;
  Page?: number;
  Query?: Query;
}
export const Block = S.suspend(() =>
  S.Struct({
    BlockType: S.optional(S.String),
    Confidence: S.optional(S.Number),
    Text: S.optional(S.String),
    TextType: S.optional(S.String),
    RowIndex: S.optional(S.Number),
    ColumnIndex: S.optional(S.Number),
    RowSpan: S.optional(S.Number),
    ColumnSpan: S.optional(S.Number),
    Geometry: S.optional(Geometry),
    Id: S.optional(S.String),
    Relationships: S.optional(RelationshipList),
    EntityTypes: S.optional(EntityTypes),
    SelectionStatus: S.optional(S.String),
    Page: S.optional(S.Number),
    Query: S.optional(Query),
  }),
).annotations({ identifier: "Block" }) as any as S.Schema<Block>;
export type BlockList = Block[];
export const BlockList = S.Array(Block);
export type Pages = number[];
export const Pages = S.Array(S.Number);
export interface Warning {
  ErrorCode?: string;
  Pages?: Pages;
}
export const Warning = S.suspend(() =>
  S.Struct({ ErrorCode: S.optional(S.String), Pages: S.optional(Pages) }),
).annotations({ identifier: "Warning" }) as any as S.Schema<Warning>;
export type Warnings = Warning[];
export const Warnings = S.Array(Warning);
export interface GetDocumentTextDetectionResponse {
  DocumentMetadata?: DocumentMetadata;
  JobStatus?: string;
  NextToken?: string;
  Blocks?: BlockList;
  Warnings?: Warnings;
  StatusMessage?: string;
  DetectDocumentTextModelVersion?: string;
}
export const GetDocumentTextDetectionResponse = S.suspend(() =>
  S.Struct({
    DocumentMetadata: S.optional(DocumentMetadata),
    JobStatus: S.optional(S.String),
    NextToken: S.optional(S.String),
    Blocks: S.optional(BlockList),
    Warnings: S.optional(Warnings),
    StatusMessage: S.optional(S.String),
    DetectDocumentTextModelVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDocumentTextDetectionResponse",
}) as any as S.Schema<GetDocumentTextDetectionResponse>;
export interface ExpenseType {
  Text?: string;
  Confidence?: number;
}
export const ExpenseType = S.suspend(() =>
  S.Struct({ Text: S.optional(S.String), Confidence: S.optional(S.Number) }),
).annotations({ identifier: "ExpenseType" }) as any as S.Schema<ExpenseType>;
export interface ExpenseDetection {
  Text?: string;
  Geometry?: Geometry;
  Confidence?: number;
}
export const ExpenseDetection = S.suspend(() =>
  S.Struct({
    Text: S.optional(S.String),
    Geometry: S.optional(Geometry),
    Confidence: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExpenseDetection",
}) as any as S.Schema<ExpenseDetection>;
export interface ExpenseCurrency {
  Code?: string;
  Confidence?: number;
}
export const ExpenseCurrency = S.suspend(() =>
  S.Struct({ Code: S.optional(S.String), Confidence: S.optional(S.Number) }),
).annotations({
  identifier: "ExpenseCurrency",
}) as any as S.Schema<ExpenseCurrency>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface ExpenseGroupProperty {
  Types?: StringList;
  Id?: string;
}
export const ExpenseGroupProperty = S.suspend(() =>
  S.Struct({ Types: S.optional(StringList), Id: S.optional(S.String) }),
).annotations({
  identifier: "ExpenseGroupProperty",
}) as any as S.Schema<ExpenseGroupProperty>;
export type ExpenseGroupPropertyList = ExpenseGroupProperty[];
export const ExpenseGroupPropertyList = S.Array(ExpenseGroupProperty);
export interface ExpenseField {
  Type?: ExpenseType;
  LabelDetection?: ExpenseDetection;
  ValueDetection?: ExpenseDetection;
  PageNumber?: number;
  Currency?: ExpenseCurrency;
  GroupProperties?: ExpenseGroupPropertyList;
}
export const ExpenseField = S.suspend(() =>
  S.Struct({
    Type: S.optional(ExpenseType),
    LabelDetection: S.optional(ExpenseDetection),
    ValueDetection: S.optional(ExpenseDetection),
    PageNumber: S.optional(S.Number),
    Currency: S.optional(ExpenseCurrency),
    GroupProperties: S.optional(ExpenseGroupPropertyList),
  }),
).annotations({ identifier: "ExpenseField" }) as any as S.Schema<ExpenseField>;
export type ExpenseFieldList = ExpenseField[];
export const ExpenseFieldList = S.Array(ExpenseField);
export interface LineItemFields {
  LineItemExpenseFields?: ExpenseFieldList;
}
export const LineItemFields = S.suspend(() =>
  S.Struct({ LineItemExpenseFields: S.optional(ExpenseFieldList) }),
).annotations({
  identifier: "LineItemFields",
}) as any as S.Schema<LineItemFields>;
export type LineItemList = LineItemFields[];
export const LineItemList = S.Array(LineItemFields);
export interface LineItemGroup {
  LineItemGroupIndex?: number;
  LineItems?: LineItemList;
}
export const LineItemGroup = S.suspend(() =>
  S.Struct({
    LineItemGroupIndex: S.optional(S.Number),
    LineItems: S.optional(LineItemList),
  }),
).annotations({
  identifier: "LineItemGroup",
}) as any as S.Schema<LineItemGroup>;
export type LineItemGroupList = LineItemGroup[];
export const LineItemGroupList = S.Array(LineItemGroup);
export interface ExpenseDocument {
  ExpenseIndex?: number;
  SummaryFields?: ExpenseFieldList;
  LineItemGroups?: LineItemGroupList;
  Blocks?: BlockList;
}
export const ExpenseDocument = S.suspend(() =>
  S.Struct({
    ExpenseIndex: S.optional(S.Number),
    SummaryFields: S.optional(ExpenseFieldList),
    LineItemGroups: S.optional(LineItemGroupList),
    Blocks: S.optional(BlockList),
  }),
).annotations({
  identifier: "ExpenseDocument",
}) as any as S.Schema<ExpenseDocument>;
export type ExpenseDocumentList = ExpenseDocument[];
export const ExpenseDocumentList = S.Array(ExpenseDocument);
export interface GetExpenseAnalysisResponse {
  DocumentMetadata?: DocumentMetadata;
  JobStatus?: string;
  NextToken?: string;
  ExpenseDocuments?: ExpenseDocumentList;
  Warnings?: Warnings;
  StatusMessage?: string;
  AnalyzeExpenseModelVersion?: string;
}
export const GetExpenseAnalysisResponse = S.suspend(() =>
  S.Struct({
    DocumentMetadata: S.optional(DocumentMetadata),
    JobStatus: S.optional(S.String),
    NextToken: S.optional(S.String),
    ExpenseDocuments: S.optional(ExpenseDocumentList),
    Warnings: S.optional(Warnings),
    StatusMessage: S.optional(S.String),
    AnalyzeExpenseModelVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "GetExpenseAnalysisResponse",
}) as any as S.Schema<GetExpenseAnalysisResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export type Queries = Query[];
export const Queries = S.Array(Query);
export interface QueriesConfig {
  Queries: Queries;
}
export const QueriesConfig = S.suspend(() =>
  S.Struct({ Queries: Queries }),
).annotations({
  identifier: "QueriesConfig",
}) as any as S.Schema<QueriesConfig>;
export interface Adapter {
  AdapterId: string;
  Pages?: AdapterPages;
  Version: string;
}
export const Adapter = S.suspend(() =>
  S.Struct({
    AdapterId: S.String,
    Pages: S.optional(AdapterPages),
    Version: S.String,
  }),
).annotations({ identifier: "Adapter" }) as any as S.Schema<Adapter>;
export type Adapters = Adapter[];
export const Adapters = S.Array(Adapter);
export interface AdaptersConfig {
  Adapters: Adapters;
}
export const AdaptersConfig = S.suspend(() =>
  S.Struct({ Adapters: Adapters }),
).annotations({
  identifier: "AdaptersConfig",
}) as any as S.Schema<AdaptersConfig>;
export interface StartDocumentAnalysisRequest {
  DocumentLocation: DocumentLocation;
  FeatureTypes: FeatureTypes;
  ClientRequestToken?: string;
  JobTag?: string;
  NotificationChannel?: NotificationChannel;
  OutputConfig?: OutputConfig;
  KMSKeyId?: string;
  QueriesConfig?: QueriesConfig;
  AdaptersConfig?: AdaptersConfig;
}
export const StartDocumentAnalysisRequest = S.suspend(() =>
  S.Struct({
    DocumentLocation: DocumentLocation,
    FeatureTypes: FeatureTypes,
    ClientRequestToken: S.optional(S.String),
    JobTag: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    OutputConfig: S.optional(OutputConfig),
    KMSKeyId: S.optional(S.String),
    QueriesConfig: S.optional(QueriesConfig),
    AdaptersConfig: S.optional(AdaptersConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartDocumentAnalysisRequest",
}) as any as S.Schema<StartDocumentAnalysisRequest>;
export interface StartDocumentTextDetectionResponse {
  JobId?: string;
}
export const StartDocumentTextDetectionResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StartDocumentTextDetectionResponse",
}) as any as S.Schema<StartDocumentTextDetectionResponse>;
export interface StartExpenseAnalysisResponse {
  JobId?: string;
}
export const StartExpenseAnalysisResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StartExpenseAnalysisResponse",
}) as any as S.Schema<StartExpenseAnalysisResponse>;
export interface StartLendingAnalysisResponse {
  JobId?: string;
}
export const StartLendingAnalysisResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StartLendingAnalysisResponse",
}) as any as S.Schema<StartLendingAnalysisResponse>;
export interface UpdateAdapterResponse {
  AdapterId?: string;
  AdapterName?: string;
  CreationTime?: Date;
  Description?: string;
  FeatureTypes?: FeatureTypes;
  AutoUpdate?: string;
}
export const UpdateAdapterResponse = S.suspend(() =>
  S.Struct({
    AdapterId: S.optional(S.String),
    AdapterName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    FeatureTypes: S.optional(FeatureTypes),
    AutoUpdate: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateAdapterResponse",
}) as any as S.Schema<UpdateAdapterResponse>;
export interface HumanLoopDataAttributes {
  ContentClassifiers?: ContentClassifiers;
}
export const HumanLoopDataAttributes = S.suspend(() =>
  S.Struct({ ContentClassifiers: S.optional(ContentClassifiers) }),
).annotations({
  identifier: "HumanLoopDataAttributes",
}) as any as S.Schema<HumanLoopDataAttributes>;
export type UndetectedDocumentTypeList = string[];
export const UndetectedDocumentTypeList = S.Array(S.String);
export interface HumanLoopConfig {
  HumanLoopName: string;
  FlowDefinitionArn: string;
  DataAttributes?: HumanLoopDataAttributes;
}
export const HumanLoopConfig = S.suspend(() =>
  S.Struct({
    HumanLoopName: S.String,
    FlowDefinitionArn: S.String,
    DataAttributes: S.optional(HumanLoopDataAttributes),
  }),
).annotations({
  identifier: "HumanLoopConfig",
}) as any as S.Schema<HumanLoopConfig>;
export interface AdapterOverview {
  AdapterId?: string;
  AdapterName?: string;
  CreationTime?: Date;
  FeatureTypes?: FeatureTypes;
}
export const AdapterOverview = S.suspend(() =>
  S.Struct({
    AdapterId: S.optional(S.String),
    AdapterName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FeatureTypes: S.optional(FeatureTypes),
  }),
).annotations({
  identifier: "AdapterOverview",
}) as any as S.Schema<AdapterOverview>;
export type AdapterList = AdapterOverview[];
export const AdapterList = S.Array(AdapterOverview);
export interface AdapterVersionOverview {
  AdapterId?: string;
  AdapterVersion?: string;
  CreationTime?: Date;
  FeatureTypes?: FeatureTypes;
  Status?: string;
  StatusMessage?: string;
}
export const AdapterVersionOverview = S.suspend(() =>
  S.Struct({
    AdapterId: S.optional(S.String),
    AdapterVersion: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FeatureTypes: S.optional(FeatureTypes),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "AdapterVersionOverview",
}) as any as S.Schema<AdapterVersionOverview>;
export type AdapterVersionList = AdapterVersionOverview[];
export const AdapterVersionList = S.Array(AdapterVersionOverview);
export interface AnalyzeDocumentRequest {
  Document: Document;
  FeatureTypes: FeatureTypes;
  HumanLoopConfig?: HumanLoopConfig;
  QueriesConfig?: QueriesConfig;
  AdaptersConfig?: AdaptersConfig;
}
export const AnalyzeDocumentRequest = S.suspend(() =>
  S.Struct({
    Document: Document,
    FeatureTypes: FeatureTypes,
    HumanLoopConfig: S.optional(HumanLoopConfig),
    QueriesConfig: S.optional(QueriesConfig),
    AdaptersConfig: S.optional(AdaptersConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AnalyzeDocumentRequest",
}) as any as S.Schema<AnalyzeDocumentRequest>;
export interface CreateAdapterResponse {
  AdapterId?: string;
}
export const CreateAdapterResponse = S.suspend(() =>
  S.Struct({ AdapterId: S.optional(S.String) }),
).annotations({
  identifier: "CreateAdapterResponse",
}) as any as S.Schema<CreateAdapterResponse>;
export interface CreateAdapterVersionResponse {
  AdapterId?: string;
  AdapterVersion?: string;
}
export const CreateAdapterVersionResponse = S.suspend(() =>
  S.Struct({
    AdapterId: S.optional(S.String),
    AdapterVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAdapterVersionResponse",
}) as any as S.Schema<CreateAdapterVersionResponse>;
export interface GetDocumentAnalysisResponse {
  DocumentMetadata?: DocumentMetadata;
  JobStatus?: string;
  NextToken?: string;
  Blocks?: BlockList;
  Warnings?: Warnings;
  StatusMessage?: string;
  AnalyzeDocumentModelVersion?: string;
}
export const GetDocumentAnalysisResponse = S.suspend(() =>
  S.Struct({
    DocumentMetadata: S.optional(DocumentMetadata),
    JobStatus: S.optional(S.String),
    NextToken: S.optional(S.String),
    Blocks: S.optional(BlockList),
    Warnings: S.optional(Warnings),
    StatusMessage: S.optional(S.String),
    AnalyzeDocumentModelVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDocumentAnalysisResponse",
}) as any as S.Schema<GetDocumentAnalysisResponse>;
export interface ListAdaptersResponse {
  Adapters?: AdapterList;
  NextToken?: string;
}
export const ListAdaptersResponse = S.suspend(() =>
  S.Struct({
    Adapters: S.optional(AdapterList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAdaptersResponse",
}) as any as S.Schema<ListAdaptersResponse>;
export interface ListAdapterVersionsResponse {
  AdapterVersions?: AdapterVersionList;
  NextToken?: string;
}
export const ListAdapterVersionsResponse = S.suspend(() =>
  S.Struct({
    AdapterVersions: S.optional(AdapterVersionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAdapterVersionsResponse",
}) as any as S.Schema<ListAdapterVersionsResponse>;
export interface StartDocumentAnalysisResponse {
  JobId?: string;
}
export const StartDocumentAnalysisResponse = S.suspend(() =>
  S.Struct({ JobId: S.optional(S.String) }),
).annotations({
  identifier: "StartDocumentAnalysisResponse",
}) as any as S.Schema<StartDocumentAnalysisResponse>;
export interface EvaluationMetric {
  F1Score?: number;
  Precision?: number;
  Recall?: number;
}
export const EvaluationMetric = S.suspend(() =>
  S.Struct({
    F1Score: S.optional(S.Number),
    Precision: S.optional(S.Number),
    Recall: S.optional(S.Number),
  }),
).annotations({
  identifier: "EvaluationMetric",
}) as any as S.Schema<EvaluationMetric>;
export type PageList = number[];
export const PageList = S.Array(S.Number);
export interface AdapterVersionEvaluationMetric {
  Baseline?: EvaluationMetric;
  AdapterVersion?: EvaluationMetric;
  FeatureType?: string;
}
export const AdapterVersionEvaluationMetric = S.suspend(() =>
  S.Struct({
    Baseline: S.optional(EvaluationMetric),
    AdapterVersion: S.optional(EvaluationMetric),
    FeatureType: S.optional(S.String),
  }),
).annotations({
  identifier: "AdapterVersionEvaluationMetric",
}) as any as S.Schema<AdapterVersionEvaluationMetric>;
export type AdapterVersionEvaluationMetrics = AdapterVersionEvaluationMetric[];
export const AdapterVersionEvaluationMetrics = S.Array(
  AdapterVersionEvaluationMetric,
);
export interface Prediction {
  Value?: string;
  Confidence?: number;
}
export const Prediction = S.suspend(() =>
  S.Struct({ Value: S.optional(S.String), Confidence: S.optional(S.Number) }),
).annotations({ identifier: "Prediction" }) as any as S.Schema<Prediction>;
export type PredictionList = Prediction[];
export const PredictionList = S.Array(Prediction);
export interface SplitDocument {
  Index?: number;
  Pages?: PageList;
}
export const SplitDocument = S.suspend(() =>
  S.Struct({ Index: S.optional(S.Number), Pages: S.optional(PageList) }),
).annotations({
  identifier: "SplitDocument",
}) as any as S.Schema<SplitDocument>;
export type SplitDocumentList = SplitDocument[];
export const SplitDocumentList = S.Array(SplitDocument);
export interface DetectedSignature {
  Page?: number;
}
export const DetectedSignature = S.suspend(() =>
  S.Struct({ Page: S.optional(S.Number) }),
).annotations({
  identifier: "DetectedSignature",
}) as any as S.Schema<DetectedSignature>;
export type DetectedSignatureList = DetectedSignature[];
export const DetectedSignatureList = S.Array(DetectedSignature);
export interface UndetectedSignature {
  Page?: number;
}
export const UndetectedSignature = S.suspend(() =>
  S.Struct({ Page: S.optional(S.Number) }),
).annotations({
  identifier: "UndetectedSignature",
}) as any as S.Schema<UndetectedSignature>;
export type UndetectedSignatureList = UndetectedSignature[];
export const UndetectedSignatureList = S.Array(UndetectedSignature);
export interface GetAdapterVersionResponse {
  AdapterId?: string;
  AdapterVersion?: string;
  CreationTime?: Date;
  FeatureTypes?: FeatureTypes;
  Status?: string;
  StatusMessage?: string;
  DatasetConfig?: AdapterVersionDatasetConfig;
  KMSKeyId?: string;
  OutputConfig?: OutputConfig;
  EvaluationMetrics?: AdapterVersionEvaluationMetrics;
  Tags?: TagMap;
}
export const GetAdapterVersionResponse = S.suspend(() =>
  S.Struct({
    AdapterId: S.optional(S.String),
    AdapterVersion: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FeatureTypes: S.optional(FeatureTypes),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    DatasetConfig: S.optional(AdapterVersionDatasetConfig),
    KMSKeyId: S.optional(S.String),
    OutputConfig: S.optional(OutputConfig),
    EvaluationMetrics: S.optional(AdapterVersionEvaluationMetrics),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetAdapterVersionResponse",
}) as any as S.Schema<GetAdapterVersionResponse>;
export interface LendingDetection {
  Text?: string;
  SelectionStatus?: string;
  Geometry?: Geometry;
  Confidence?: number;
}
export const LendingDetection = S.suspend(() =>
  S.Struct({
    Text: S.optional(S.String),
    SelectionStatus: S.optional(S.String),
    Geometry: S.optional(Geometry),
    Confidence: S.optional(S.Number),
  }),
).annotations({
  identifier: "LendingDetection",
}) as any as S.Schema<LendingDetection>;
export type LendingDetectionList = LendingDetection[];
export const LendingDetectionList = S.Array(LendingDetection);
export type HumanLoopActivationReasons = string[];
export const HumanLoopActivationReasons = S.Array(S.String);
export interface PageClassification {
  PageType: PredictionList;
  PageNumber: PredictionList;
}
export const PageClassification = S.suspend(() =>
  S.Struct({ PageType: PredictionList, PageNumber: PredictionList }),
).annotations({
  identifier: "PageClassification",
}) as any as S.Schema<PageClassification>;
export interface DocumentGroup {
  Type?: string;
  SplitDocuments?: SplitDocumentList;
  DetectedSignatures?: DetectedSignatureList;
  UndetectedSignatures?: UndetectedSignatureList;
}
export const DocumentGroup = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    SplitDocuments: S.optional(SplitDocumentList),
    DetectedSignatures: S.optional(DetectedSignatureList),
    UndetectedSignatures: S.optional(UndetectedSignatureList),
  }),
).annotations({
  identifier: "DocumentGroup",
}) as any as S.Schema<DocumentGroup>;
export type DocumentGroupList = DocumentGroup[];
export const DocumentGroupList = S.Array(DocumentGroup);
export interface NormalizedValue {
  Value?: string;
  ValueType?: string;
}
export const NormalizedValue = S.suspend(() =>
  S.Struct({ Value: S.optional(S.String), ValueType: S.optional(S.String) }),
).annotations({
  identifier: "NormalizedValue",
}) as any as S.Schema<NormalizedValue>;
export interface SignatureDetection {
  Confidence?: number;
  Geometry?: Geometry;
}
export const SignatureDetection = S.suspend(() =>
  S.Struct({
    Confidence: S.optional(S.Number),
    Geometry: S.optional(Geometry),
  }),
).annotations({
  identifier: "SignatureDetection",
}) as any as S.Schema<SignatureDetection>;
export type SignatureDetectionList = SignatureDetection[];
export const SignatureDetectionList = S.Array(SignatureDetection);
export interface HumanLoopActivationOutput {
  HumanLoopArn?: string;
  HumanLoopActivationReasons?: HumanLoopActivationReasons;
  HumanLoopActivationConditionsEvaluationResults?: string;
}
export const HumanLoopActivationOutput = S.suspend(() =>
  S.Struct({
    HumanLoopArn: S.optional(S.String),
    HumanLoopActivationReasons: S.optional(HumanLoopActivationReasons),
    HumanLoopActivationConditionsEvaluationResults: S.optional(S.String),
  }),
).annotations({
  identifier: "HumanLoopActivationOutput",
}) as any as S.Schema<HumanLoopActivationOutput>;
export interface LendingSummary {
  DocumentGroups?: DocumentGroupList;
  UndetectedDocumentTypes?: UndetectedDocumentTypeList;
}
export const LendingSummary = S.suspend(() =>
  S.Struct({
    DocumentGroups: S.optional(DocumentGroupList),
    UndetectedDocumentTypes: S.optional(UndetectedDocumentTypeList),
  }),
).annotations({
  identifier: "LendingSummary",
}) as any as S.Schema<LendingSummary>;
export interface AnalyzeIDDetections {
  Text: string;
  NormalizedValue?: NormalizedValue;
  Confidence?: number;
}
export const AnalyzeIDDetections = S.suspend(() =>
  S.Struct({
    Text: S.String,
    NormalizedValue: S.optional(NormalizedValue),
    Confidence: S.optional(S.Number),
  }),
).annotations({
  identifier: "AnalyzeIDDetections",
}) as any as S.Schema<AnalyzeIDDetections>;
export interface AnalyzeDocumentResponse {
  DocumentMetadata?: DocumentMetadata;
  Blocks?: BlockList;
  HumanLoopActivationOutput?: HumanLoopActivationOutput;
  AnalyzeDocumentModelVersion?: string;
}
export const AnalyzeDocumentResponse = S.suspend(() =>
  S.Struct({
    DocumentMetadata: S.optional(DocumentMetadata),
    Blocks: S.optional(BlockList),
    HumanLoopActivationOutput: S.optional(HumanLoopActivationOutput),
    AnalyzeDocumentModelVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalyzeDocumentResponse",
}) as any as S.Schema<AnalyzeDocumentResponse>;
export interface AnalyzeExpenseResponse {
  DocumentMetadata?: DocumentMetadata;
  ExpenseDocuments?: ExpenseDocumentList;
}
export const AnalyzeExpenseResponse = S.suspend(() =>
  S.Struct({
    DocumentMetadata: S.optional(DocumentMetadata),
    ExpenseDocuments: S.optional(ExpenseDocumentList),
  }),
).annotations({
  identifier: "AnalyzeExpenseResponse",
}) as any as S.Schema<AnalyzeExpenseResponse>;
export interface DetectDocumentTextResponse {
  DocumentMetadata?: DocumentMetadata;
  Blocks?: BlockList;
  DetectDocumentTextModelVersion?: string;
}
export const DetectDocumentTextResponse = S.suspend(() =>
  S.Struct({
    DocumentMetadata: S.optional(DocumentMetadata),
    Blocks: S.optional(BlockList),
    DetectDocumentTextModelVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "DetectDocumentTextResponse",
}) as any as S.Schema<DetectDocumentTextResponse>;
export interface GetLendingAnalysisSummaryResponse {
  DocumentMetadata?: DocumentMetadata;
  JobStatus?: string;
  Summary?: LendingSummary;
  Warnings?: Warnings;
  StatusMessage?: string;
  AnalyzeLendingModelVersion?: string;
}
export const GetLendingAnalysisSummaryResponse = S.suspend(() =>
  S.Struct({
    DocumentMetadata: S.optional(DocumentMetadata),
    JobStatus: S.optional(S.String),
    Summary: S.optional(LendingSummary),
    Warnings: S.optional(Warnings),
    StatusMessage: S.optional(S.String),
    AnalyzeLendingModelVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "GetLendingAnalysisSummaryResponse",
}) as any as S.Schema<GetLendingAnalysisSummaryResponse>;
export interface IdentityDocumentField {
  Type?: AnalyzeIDDetections;
  ValueDetection?: AnalyzeIDDetections;
}
export const IdentityDocumentField = S.suspend(() =>
  S.Struct({
    Type: S.optional(AnalyzeIDDetections),
    ValueDetection: S.optional(AnalyzeIDDetections),
  }),
).annotations({
  identifier: "IdentityDocumentField",
}) as any as S.Schema<IdentityDocumentField>;
export type IdentityDocumentFieldList = IdentityDocumentField[];
export const IdentityDocumentFieldList = S.Array(IdentityDocumentField);
export interface LendingField {
  Type?: string;
  KeyDetection?: LendingDetection;
  ValueDetections?: LendingDetectionList;
}
export const LendingField = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    KeyDetection: S.optional(LendingDetection),
    ValueDetections: S.optional(LendingDetectionList),
  }),
).annotations({ identifier: "LendingField" }) as any as S.Schema<LendingField>;
export type LendingFieldList = LendingField[];
export const LendingFieldList = S.Array(LendingField);
export interface IdentityDocument {
  DocumentIndex?: number;
  IdentityDocumentFields?: IdentityDocumentFieldList;
  Blocks?: BlockList;
}
export const IdentityDocument = S.suspend(() =>
  S.Struct({
    DocumentIndex: S.optional(S.Number),
    IdentityDocumentFields: S.optional(IdentityDocumentFieldList),
    Blocks: S.optional(BlockList),
  }),
).annotations({
  identifier: "IdentityDocument",
}) as any as S.Schema<IdentityDocument>;
export type IdentityDocumentList = IdentityDocument[];
export const IdentityDocumentList = S.Array(IdentityDocument);
export interface LendingDocument {
  LendingFields?: LendingFieldList;
  SignatureDetections?: SignatureDetectionList;
}
export const LendingDocument = S.suspend(() =>
  S.Struct({
    LendingFields: S.optional(LendingFieldList),
    SignatureDetections: S.optional(SignatureDetectionList),
  }),
).annotations({
  identifier: "LendingDocument",
}) as any as S.Schema<LendingDocument>;
export interface AnalyzeIDResponse {
  IdentityDocuments?: IdentityDocumentList;
  DocumentMetadata?: DocumentMetadata;
  AnalyzeIDModelVersion?: string;
}
export const AnalyzeIDResponse = S.suspend(() =>
  S.Struct({
    IdentityDocuments: S.optional(IdentityDocumentList),
    DocumentMetadata: S.optional(DocumentMetadata),
    AnalyzeIDModelVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalyzeIDResponse",
}) as any as S.Schema<AnalyzeIDResponse>;
export interface Extraction {
  LendingDocument?: LendingDocument;
  ExpenseDocument?: ExpenseDocument;
  IdentityDocument?: IdentityDocument;
}
export const Extraction = S.suspend(() =>
  S.Struct({
    LendingDocument: S.optional(LendingDocument),
    ExpenseDocument: S.optional(ExpenseDocument),
    IdentityDocument: S.optional(IdentityDocument),
  }),
).annotations({ identifier: "Extraction" }) as any as S.Schema<Extraction>;
export type ExtractionList = Extraction[];
export const ExtractionList = S.Array(Extraction);
export interface LendingResult {
  Page?: number;
  PageClassification?: PageClassification;
  Extractions?: ExtractionList;
}
export const LendingResult = S.suspend(() =>
  S.Struct({
    Page: S.optional(S.Number),
    PageClassification: S.optional(PageClassification),
    Extractions: S.optional(ExtractionList),
  }),
).annotations({
  identifier: "LendingResult",
}) as any as S.Schema<LendingResult>;
export type LendingResultList = LendingResult[];
export const LendingResultList = S.Array(LendingResult);
export interface GetLendingAnalysisResponse {
  DocumentMetadata?: DocumentMetadata;
  JobStatus?: string;
  NextToken?: string;
  Results?: LendingResultList;
  Warnings?: Warnings;
  StatusMessage?: string;
  AnalyzeLendingModelVersion?: string;
}
export const GetLendingAnalysisResponse = S.suspend(() =>
  S.Struct({
    DocumentMetadata: S.optional(DocumentMetadata),
    JobStatus: S.optional(S.String),
    NextToken: S.optional(S.String),
    Results: S.optional(LendingResultList),
    Warnings: S.optional(Warnings),
    StatusMessage: S.optional(S.String),
    AnalyzeLendingModelVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "GetLendingAnalysisResponse",
}) as any as S.Schema<GetLendingAnalysisResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class BadDocumentException extends S.TaggedError<BadDocumentException>()(
  "BadDocumentException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class InvalidJobIdException extends S.TaggedError<InvalidJobIdException>()(
  "InvalidJobIdException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class DocumentTooLargeException extends S.TaggedError<DocumentTooLargeException>()(
  "DocumentTooLargeException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class IdempotentParameterMismatchException extends S.TaggedError<IdempotentParameterMismatchException>()(
  "IdempotentParameterMismatchException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class ProvisionedThroughputExceededException extends S.TaggedError<ProvisionedThroughputExceededException>()(
  "ProvisionedThroughputExceededException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class InvalidKMSKeyException extends S.TaggedError<InvalidKMSKeyException>()(
  "InvalidKMSKeyException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class HumanLoopQuotaExceededException extends S.TaggedError<HumanLoopQuotaExceededException>()(
  "HumanLoopQuotaExceededException",
  {
    ResourceType: S.optional(S.String),
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
    Message: S.optional(S.String),
    Code: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class InvalidS3ObjectException extends S.TaggedError<InvalidS3ObjectException>()(
  "InvalidS3ObjectException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}
export class UnsupportedDocumentException extends S.TaggedError<UnsupportedDocumentException>()(
  "UnsupportedDocumentException",
  { Message: S.optional(S.String), Code: S.optional(S.String) },
) {}

//# Operations
/**
 * Gets the results for an Amazon Textract asynchronous operation that analyzes text in a
 * document.
 *
 * You start asynchronous text analysis by calling StartDocumentAnalysis,
 * which returns a job identifier (`JobId`). When the text analysis operation
 * finishes, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic
 * that's registered in the initial call to `StartDocumentAnalysis`. To get the
 * results of the text-detection operation, first check that the status value published to the
 * Amazon SNS topic is `SUCCEEDED`. If so, call `GetDocumentAnalysis`, and
 * pass the job identifier (`JobId`) from the initial call to
 * `StartDocumentAnalysis`.
 *
 * `GetDocumentAnalysis` returns an array of Block objects.
 * The following types of information are returned:
 *
 * - Form data (key-value pairs). The related information is returned in two Block objects, each of type `KEY_VALUE_SET`: a KEY
 * `Block` object and a VALUE `Block` object. For example,
 * *Name: Ana Silva Carolina* contains a key and value.
 * *Name:* is the key. *Ana Silva Carolina* is
 * the value.
 *
 * - Table and table cell data. A TABLE `Block` object contains information
 * about a detected table. A CELL `Block` object is returned for each cell in
 * a table.
 *
 * - Lines and words of text. A LINE `Block` object contains one or more
 * WORD `Block` objects. All lines and words that are detected in the
 * document are returned (including text that doesn't have a relationship with the value
 * of the `StartDocumentAnalysis`
 * `FeatureTypes` input parameter).
 *
 * - Query. A QUERY Block object contains the query text, alias and link to the
 * associated Query results block object.
 *
 * - Query Results. A QUERY_RESULT Block object contains the answer to the query and an
 * ID that connects it to the query asked. This Block also contains a confidence
 * score.
 *
 * While processing a document with queries, look out for
 * `INVALID_REQUEST_PARAMETERS` output. This indicates that either the per
 * page query limit has been exceeded or that the operation is trying to query a page in
 * the document which doesn’t exist.
 *
 * Selection elements such as check boxes and option buttons (radio buttons) can be
 * detected in form data and in tables. A SELECTION_ELEMENT `Block` object contains
 * information about a selection element, including the selection status.
 *
 * Use the `MaxResults` parameter to limit the number of blocks that are
 * returned. If there are more results than specified in `MaxResults`, the value of
 * `NextToken` in the operation response contains a pagination token for getting
 * the next set of results. To get the next page of results, call
 * `GetDocumentAnalysis`, and populate the `NextToken` request
 * parameter with the token value that's returned from the previous call to
 * `GetDocumentAnalysis`.
 *
 * For more information, see Document Text
 * Analysis.
 */
export const getDocumentAnalysis: (
  input: GetDocumentAnalysisRequest,
) => Effect.Effect<
  GetDocumentAnalysisResponse,
  | AccessDeniedException
  | InternalServerError
  | InvalidJobIdException
  | InvalidKMSKeyException
  | InvalidParameterException
  | InvalidS3ObjectException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDocumentAnalysisRequest,
  output: GetDocumentAnalysisResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidJobIdException,
    InvalidKMSKeyException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
  ],
}));
/**
 * Gets summarized results for the `StartLendingAnalysis` operation, which analyzes
 * text in a lending document. The returned summary consists of information about documents grouped
 * together by a common document type. Information like detected signatures, page numbers, and split
 * documents is returned with respect to the type of grouped document.
 *
 * You start asynchronous text analysis by calling `StartLendingAnalysis`, which
 * returns a job identifier (`JobId`). When the text analysis operation finishes, Amazon
 * Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS)
 * topic that's registered in the initial call to `StartLendingAnalysis`.
 *
 * To get the results of the text analysis operation, first check that the status value
 * published to the Amazon SNS topic is SUCCEEDED. If so, call
 * `GetLendingAnalysisSummary`, and pass the job identifier (`JobId`) from
 * the initial call to `StartLendingAnalysis`.
 */
export const getLendingAnalysisSummary: (
  input: GetLendingAnalysisSummaryRequest,
) => Effect.Effect<
  GetLendingAnalysisSummaryResponse,
  | AccessDeniedException
  | InternalServerError
  | InvalidJobIdException
  | InvalidKMSKeyException
  | InvalidParameterException
  | InvalidS3ObjectException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLendingAnalysisSummaryRequest,
  output: GetLendingAnalysisSummaryResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidJobIdException,
    InvalidKMSKeyException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
  ],
}));
/**
 * Gets the results for an Amazon Textract asynchronous operation that detects text in a document.
 * Amazon Textract can detect lines of text and the words that make up a line of text.
 *
 * You start asynchronous text detection by calling StartDocumentTextDetection, which returns a job identifier
 * (`JobId`). When the text detection operation finishes, Amazon Textract publishes a
 * completion status to the Amazon Simple Notification Service (Amazon SNS) topic that's registered in the initial call to
 * `StartDocumentTextDetection`. To get the results of the text-detection
 * operation, first check that the status value published to the Amazon SNS topic is
 * `SUCCEEDED`. If so, call `GetDocumentTextDetection`, and pass the
 * job identifier (`JobId`) from the initial call to
 * `StartDocumentTextDetection`.
 *
 * `GetDocumentTextDetection` returns an array of Block
 * objects.
 *
 * Each document page has as an associated `Block` of type PAGE. Each PAGE `Block` object
 * is the parent of LINE `Block` objects that represent the lines of detected text on a page. A LINE `Block` object is
 * a parent for each word that makes up the line. Words are represented by `Block` objects of type WORD.
 *
 * Use the MaxResults parameter to limit the number of blocks that are returned. If there
 * are more results than specified in `MaxResults`, the value of
 * `NextToken` in the operation response contains a pagination token for getting
 * the next set of results. To get the next page of results, call
 * `GetDocumentTextDetection`, and populate the `NextToken` request
 * parameter with the token value that's returned from the previous call to
 * `GetDocumentTextDetection`.
 *
 * For more information, see Document Text Detection.
 */
export const getDocumentTextDetection: (
  input: GetDocumentTextDetectionRequest,
) => Effect.Effect<
  GetDocumentTextDetectionResponse,
  | AccessDeniedException
  | InternalServerError
  | InvalidJobIdException
  | InvalidKMSKeyException
  | InvalidParameterException
  | InvalidS3ObjectException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDocumentTextDetectionRequest,
  output: GetDocumentTextDetectionResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidJobIdException,
    InvalidKMSKeyException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
  ],
}));
/**
 * Gets the results for an Amazon Textract asynchronous operation that analyzes invoices and
 * receipts. Amazon Textract finds contact information, items purchased, and vendor name, from input
 * invoices and receipts.
 *
 * You start asynchronous invoice/receipt analysis by calling StartExpenseAnalysis, which returns a job identifier (`JobId`). Upon
 * completion of the invoice/receipt analysis, Amazon Textract publishes the completion status to the
 * Amazon Simple Notification Service (Amazon SNS) topic. This topic must be registered in the initial call to
 * `StartExpenseAnalysis`. To get the results of the invoice/receipt analysis operation,
 * first ensure that the status value published to the Amazon SNS topic is `SUCCEEDED`. If so,
 * call `GetExpenseAnalysis`, and pass the job identifier (`JobId`) from the
 * initial call to `StartExpenseAnalysis`.
 *
 * Use the MaxResults parameter to limit the number of blocks that are returned. If there are
 * more results than specified in `MaxResults`, the value of `NextToken` in
 * the operation response contains a pagination token for getting the next set of results. To get
 * the next page of results, call `GetExpenseAnalysis`, and populate the
 * `NextToken` request parameter with the token value that's returned from the previous
 * call to `GetExpenseAnalysis`.
 *
 * For more information, see Analyzing Invoices and Receipts.
 */
export const getExpenseAnalysis: (
  input: GetExpenseAnalysisRequest,
) => Effect.Effect<
  GetExpenseAnalysisResponse,
  | AccessDeniedException
  | InternalServerError
  | InvalidJobIdException
  | InvalidKMSKeyException
  | InvalidParameterException
  | InvalidS3ObjectException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExpenseAnalysisRequest,
  output: GetExpenseAnalysisResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidJobIdException,
    InvalidKMSKeyException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
  ],
}));
/**
 * Gets the results for an Amazon Textract asynchronous operation that analyzes text in a
 * lending document.
 *
 * You start asynchronous text analysis by calling `StartLendingAnalysis`,
 * which returns a job identifier (`JobId`). When the text analysis operation
 * finishes, Amazon Textract publishes a completion status to the Amazon Simple
 * Notification Service (Amazon SNS) topic that's registered in the initial call to
 * `StartLendingAnalysis`.
 *
 * To get the results of the text analysis operation, first check that the status value
 * published to the Amazon SNS topic is SUCCEEDED. If so, call GetLendingAnalysis, and pass
 * the job identifier (`JobId`) from the initial call to
 * `StartLendingAnalysis`.
 */
export const getLendingAnalysis: (
  input: GetLendingAnalysisRequest,
) => Effect.Effect<
  GetLendingAnalysisResponse,
  | AccessDeniedException
  | InternalServerError
  | InvalidJobIdException
  | InvalidKMSKeyException
  | InvalidParameterException
  | InvalidS3ObjectException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLendingAnalysisRequest,
  output: GetLendingAnalysisResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidJobIdException,
    InvalidKMSKeyException,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
  ],
}));
/**
 * Lists all adapters that match the specified filtration criteria.
 */
export const listAdapters: {
  (
    input: ListAdaptersRequest,
  ): Effect.Effect<
    ListAdaptersResponse,
    | AccessDeniedException
    | InternalServerError
    | InvalidParameterException
    | ProvisionedThroughputExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAdaptersRequest,
  ) => Stream.Stream<
    ListAdaptersResponse,
    | AccessDeniedException
    | InternalServerError
    | InvalidParameterException
    | ProvisionedThroughputExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAdaptersRequest,
  ) => Stream.Stream<
    AdapterOverview,
    | AccessDeniedException
    | InternalServerError
    | InvalidParameterException
    | ProvisionedThroughputExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAdaptersRequest,
  output: ListAdaptersResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Adapters",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * `AnalyzeExpense` synchronously analyzes an input document for financially
 * related relationships between text.
 *
 * Information is returned as `ExpenseDocuments` and seperated as
 * follows:
 *
 * - `LineItemGroups`- A data set containing `LineItems` which
 * store information about the lines of text, such as an item purchased and its price on
 * a receipt.
 *
 * - `SummaryFields`- Contains all other information a receipt, such as
 * header information or the vendors name.
 */
export const analyzeExpense: (
  input: AnalyzeExpenseRequest,
) => Effect.Effect<
  AnalyzeExpenseResponse,
  | AccessDeniedException
  | BadDocumentException
  | DocumentTooLargeException
  | InternalServerError
  | InvalidParameterException
  | InvalidS3ObjectException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | UnsupportedDocumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AnalyzeExpenseRequest,
  output: AnalyzeExpenseResponse,
  errors: [
    AccessDeniedException,
    BadDocumentException,
    DocumentTooLargeException,
    InternalServerError,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    UnsupportedDocumentException,
  ],
}));
/**
 * Gets configuration information for the specified adapter version, including:
 * AdapterId, AdapterVersion, FeatureTypes, Status, StatusMessage, DatasetConfig,
 * KMSKeyId, OutputConfig, Tags and EvaluationMetrics.
 */
export const getAdapterVersion: (
  input: GetAdapterVersionRequest,
) => Effect.Effect<
  GetAdapterVersionResponse,
  | AccessDeniedException
  | InternalServerError
  | InvalidParameterException
  | ProvisionedThroughputExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAdapterVersionRequest,
  output: GetAdapterVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List all version of an adapter that meet the specified filtration criteria.
 */
export const listAdapterVersions: {
  (
    input: ListAdapterVersionsRequest,
  ): Effect.Effect<
    ListAdapterVersionsResponse,
    | AccessDeniedException
    | InternalServerError
    | InvalidParameterException
    | ProvisionedThroughputExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAdapterVersionsRequest,
  ) => Stream.Stream<
    ListAdapterVersionsResponse,
    | AccessDeniedException
    | InternalServerError
    | InvalidParameterException
    | ProvisionedThroughputExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAdapterVersionsRequest,
  ) => Stream.Stream<
    AdapterVersionOverview,
    | AccessDeniedException
    | InternalServerError
    | InvalidParameterException
    | ProvisionedThroughputExceededException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAdapterVersionsRequest,
  output: ListAdapterVersionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AdapterVersions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Update the configuration for an adapter. FeatureTypes configurations cannot be updated.
 * At least one new parameter must be specified as an argument.
 */
export const updateAdapter: (
  input: UpdateAdapterRequest,
) => Effect.Effect<
  UpdateAdapterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerError
  | InvalidParameterException
  | ProvisionedThroughputExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAdapterRequest,
  output: UpdateAdapterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon Textract adapter version. Requires that you specify both an AdapterId and a
 * AdapterVersion. Deletes the adapter version specified by the AdapterId and the AdapterVersion.
 */
export const deleteAdapterVersion: (
  input: DeleteAdapterVersionRequest,
) => Effect.Effect<
  DeleteAdapterVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerError
  | InvalidParameterException
  | ProvisionedThroughputExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAdapterVersionRequest,
  output: DeleteAdapterVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all tags for an Amazon Textract resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerError
  | InvalidParameterException
  | ProvisionedThroughputExceededException
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
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds one or more tags to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerError
  | InvalidParameterException
  | ProvisionedThroughputExceededException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes any tags with the specified keys from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerError
  | InvalidParameterException
  | ProvisionedThroughputExceededException
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
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an Amazon Textract adapter. Takes an AdapterId and deletes the adapter specified by the ID.
 */
export const deleteAdapter: (
  input: DeleteAdapterRequest,
) => Effect.Effect<
  DeleteAdapterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerError
  | InvalidParameterException
  | ProvisionedThroughputExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAdapterRequest,
  output: DeleteAdapterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new version of an adapter. Operates on a provided AdapterId and a specified
 * dataset provided via the DatasetConfig argument. Requires that you
 * specify an Amazon S3 bucket with the OutputConfig argument. You can provide an optional KMSKeyId,
 * an optional ClientRequestToken, and optional tags.
 */
export const createAdapterVersion: (
  input: CreateAdapterVersionRequest,
) => Effect.Effect<
  CreateAdapterVersionResponse,
  | AccessDeniedException
  | ConflictException
  | IdempotentParameterMismatchException
  | InternalServerError
  | InvalidKMSKeyException
  | InvalidParameterException
  | InvalidS3ObjectException
  | LimitExceededException
  | ProvisionedThroughputExceededException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAdapterVersionRequest,
  output: CreateAdapterVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidKMSKeyException,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets configuration information for an adapter specified by an AdapterId, returning information on AdapterName, Description,
 * CreationTime, AutoUpdate status, and FeatureTypes.
 */
export const getAdapter: (
  input: GetAdapterRequest,
) => Effect.Effect<
  GetAdapterResponse,
  | AccessDeniedException
  | InternalServerError
  | InvalidParameterException
  | ProvisionedThroughputExceededException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAdapterRequest,
  output: GetAdapterResponse,
  errors: [
    AccessDeniedException,
    InternalServerError,
    InvalidParameterException,
    ProvisionedThroughputExceededException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an adapter, which can be fine-tuned for enhanced performance on user provided
 * documents. Takes an AdapterName and FeatureType. Currently the only supported feature type
 * is `QUERIES`. You can also provide a Description, Tags, and a
 * ClientRequestToken. You can choose whether or not the adapter should be AutoUpdated with
 * the AutoUpdate argument. By default, AutoUpdate is set to DISABLED.
 */
export const createAdapter: (
  input: CreateAdapterRequest,
) => Effect.Effect<
  CreateAdapterResponse,
  | AccessDeniedException
  | ConflictException
  | IdempotentParameterMismatchException
  | InternalServerError
  | InvalidParameterException
  | LimitExceededException
  | ProvisionedThroughputExceededException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAdapterRequest,
  output: CreateAdapterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidParameterException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Analyzes identity documents for relevant information. This information is extracted and
 * returned as `IdentityDocumentFields`, which records both the normalized field
 * and value of the extracted text. Unlike other Amazon Textract operations,
 * `AnalyzeID` doesn't return any Geometry data.
 */
export const analyzeID: (
  input: AnalyzeIDRequest,
) => Effect.Effect<
  AnalyzeIDResponse,
  | AccessDeniedException
  | BadDocumentException
  | DocumentTooLargeException
  | InternalServerError
  | InvalidParameterException
  | InvalidS3ObjectException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | UnsupportedDocumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AnalyzeIDRequest,
  output: AnalyzeIDResponse,
  errors: [
    AccessDeniedException,
    BadDocumentException,
    DocumentTooLargeException,
    InternalServerError,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    UnsupportedDocumentException,
  ],
}));
/**
 * Detects text in the input document. Amazon Textract can detect lines of text and the
 * words that make up a line of text. The input document must be in one of the following image
 * formats: JPEG, PNG, PDF, or TIFF. `DetectDocumentText` returns the detected
 * text in an array of Block objects.
 *
 * Each document page has as an associated `Block` of type PAGE. Each PAGE `Block` object
 * is the parent of LINE `Block` objects that represent the lines of detected text on a page. A LINE `Block` object is
 * a parent for each word that makes up the line. Words are represented by `Block` objects of type WORD.
 *
 * `DetectDocumentText` is a synchronous operation. To analyze documents
 * asynchronously, use StartDocumentTextDetection.
 *
 * For more information, see Document Text Detection.
 */
export const detectDocumentText: (
  input: DetectDocumentTextRequest,
) => Effect.Effect<
  DetectDocumentTextResponse,
  | AccessDeniedException
  | BadDocumentException
  | DocumentTooLargeException
  | InternalServerError
  | InvalidParameterException
  | InvalidS3ObjectException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | UnsupportedDocumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetectDocumentTextRequest,
  output: DetectDocumentTextResponse,
  errors: [
    AccessDeniedException,
    BadDocumentException,
    DocumentTooLargeException,
    InternalServerError,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    UnsupportedDocumentException,
  ],
}));
/**
 * Starts the asynchronous analysis of invoices or receipts for data like contact information,
 * items purchased, and vendor names.
 *
 * `StartExpenseAnalysis` can analyze text in documents that are in JPEG, PNG, and
 * PDF format. The documents must be stored in an Amazon S3 bucket. Use the DocumentLocation parameter to specify the name of your S3 bucket and the name of the
 * document in that bucket.
 *
 * `StartExpenseAnalysis` returns a job identifier (`JobId`) that you
 * will provide to `GetExpenseAnalysis` to retrieve the results of the operation. When
 * the analysis of the input invoices/receipts is finished, Amazon Textract publishes a completion
 * status to the Amazon Simple Notification Service (Amazon SNS) topic that you provide to the `NotificationChannel`.
 * To obtain the results of the invoice and receipt analysis operation, ensure that the status value
 * published to the Amazon SNS topic is `SUCCEEDED`. If so, call GetExpenseAnalysis, and pass the job identifier (`JobId`) that was
 * returned by your call to `StartExpenseAnalysis`.
 *
 * For more information, see Analyzing Invoices and Receipts.
 */
export const startExpenseAnalysis: (
  input: StartExpenseAnalysisRequest,
) => Effect.Effect<
  StartExpenseAnalysisResponse,
  | AccessDeniedException
  | BadDocumentException
  | DocumentTooLargeException
  | IdempotentParameterMismatchException
  | InternalServerError
  | InvalidKMSKeyException
  | InvalidParameterException
  | InvalidS3ObjectException
  | LimitExceededException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | UnsupportedDocumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExpenseAnalysisRequest,
  output: StartExpenseAnalysisResponse,
  errors: [
    AccessDeniedException,
    BadDocumentException,
    DocumentTooLargeException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidKMSKeyException,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    UnsupportedDocumentException,
  ],
}));
/**
 * Starts the classification and analysis of an input document.
 * `StartLendingAnalysis` initiates the classification and analysis of a packet of
 * lending documents. `StartLendingAnalysis` operates on a document file located in an
 * Amazon S3 bucket.
 *
 * `StartLendingAnalysis` can analyze text in documents that are in one of the
 * following formats: JPEG, PNG, TIFF, PDF. Use `DocumentLocation` to specify the bucket
 * name and the file name of the document.
 *
 * `StartLendingAnalysis` returns a job identifier (`JobId`) that you use
 * to get the results of the operation. When the text analysis is finished, Amazon Textract
 * publishes a completion status to the Amazon Simple Notification Service (Amazon SNS) topic that
 * you specify in `NotificationChannel`. To get the results of the text analysis
 * operation, first check that the status value published to the Amazon SNS topic is SUCCEEDED. If
 * the status is SUCCEEDED you can call either `GetLendingAnalysis` or
 * `GetLendingAnalysisSummary` and provide the `JobId` to obtain the results
 * of the analysis.
 *
 * If using `OutputConfig` to specify an Amazon S3 bucket, the output will be contained
 * within the specified prefix in a directory labeled with the job-id. In the directory there are 3
 * sub-directories:
 *
 * - detailedResponse (contains the GetLendingAnalysis response)
 *
 * - summaryResponse (for the GetLendingAnalysisSummary response)
 *
 * - splitDocuments (documents split across logical boundaries)
 */
export const startLendingAnalysis: (
  input: StartLendingAnalysisRequest,
) => Effect.Effect<
  StartLendingAnalysisResponse,
  | AccessDeniedException
  | BadDocumentException
  | DocumentTooLargeException
  | IdempotentParameterMismatchException
  | InternalServerError
  | InvalidKMSKeyException
  | InvalidParameterException
  | InvalidS3ObjectException
  | LimitExceededException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | UnsupportedDocumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartLendingAnalysisRequest,
  output: StartLendingAnalysisResponse,
  errors: [
    AccessDeniedException,
    BadDocumentException,
    DocumentTooLargeException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidKMSKeyException,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    UnsupportedDocumentException,
  ],
}));
/**
 * Starts the asynchronous analysis of an input document for relationships between detected
 * items such as key-value pairs, tables, and selection elements.
 *
 * `StartDocumentAnalysis` can analyze text in documents that are in JPEG, PNG, TIFF, and PDF format. The
 * documents are stored in an Amazon S3 bucket. Use DocumentLocation to specify the bucket name and file name
 * of the document.
 *
 * `StartDocumentAnalysis` returns a job identifier
 * (`JobId`) that you use to get the results of the operation. When text
 * analysis is finished, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS)
 * topic that you specify in `NotificationChannel`. To get the results of the text
 * analysis operation, first check that the status value published to the Amazon SNS topic is
 * `SUCCEEDED`. If so, call GetDocumentAnalysis, and pass
 * the job identifier (`JobId`) from the initial call to
 * `StartDocumentAnalysis`.
 *
 * For more information, see Document Text Analysis.
 */
export const startDocumentAnalysis: (
  input: StartDocumentAnalysisRequest,
) => Effect.Effect<
  StartDocumentAnalysisResponse,
  | AccessDeniedException
  | BadDocumentException
  | DocumentTooLargeException
  | IdempotentParameterMismatchException
  | InternalServerError
  | InvalidKMSKeyException
  | InvalidParameterException
  | InvalidS3ObjectException
  | LimitExceededException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | UnsupportedDocumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDocumentAnalysisRequest,
  output: StartDocumentAnalysisResponse,
  errors: [
    AccessDeniedException,
    BadDocumentException,
    DocumentTooLargeException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidKMSKeyException,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    UnsupportedDocumentException,
  ],
}));
/**
 * Starts the asynchronous detection of text in a document. Amazon Textract can detect lines of
 * text and the words that make up a line of text.
 *
 * `StartDocumentTextDetection` can analyze text in documents that are in JPEG, PNG, TIFF, and PDF format. The
 * documents are stored in an Amazon S3 bucket. Use DocumentLocation to specify the bucket name and file name
 * of the document.
 *
 * `StartDocumentTextDetection` returns a job identifier
 * (`JobId`) that you use to get the results of the operation. When text
 * detection is finished, Amazon Textract publishes a completion status to the Amazon Simple Notification Service (Amazon SNS)
 * topic that you specify in `NotificationChannel`. To get the results of the text
 * detection operation, first check that the status value published to the Amazon SNS topic is
 * `SUCCEEDED`. If so, call GetDocumentTextDetection, and
 * pass the job identifier (`JobId`) from the initial call to
 * `StartDocumentTextDetection`.
 *
 * For more information, see Document Text Detection.
 */
export const startDocumentTextDetection: (
  input: StartDocumentTextDetectionRequest,
) => Effect.Effect<
  StartDocumentTextDetectionResponse,
  | AccessDeniedException
  | BadDocumentException
  | DocumentTooLargeException
  | IdempotentParameterMismatchException
  | InternalServerError
  | InvalidKMSKeyException
  | InvalidParameterException
  | InvalidS3ObjectException
  | LimitExceededException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | UnsupportedDocumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDocumentTextDetectionRequest,
  output: StartDocumentTextDetectionResponse,
  errors: [
    AccessDeniedException,
    BadDocumentException,
    DocumentTooLargeException,
    IdempotentParameterMismatchException,
    InternalServerError,
    InvalidKMSKeyException,
    InvalidParameterException,
    InvalidS3ObjectException,
    LimitExceededException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    UnsupportedDocumentException,
  ],
}));
/**
 * Analyzes an input document for relationships between detected items.
 *
 * The types of information returned are as follows:
 *
 * - Form data (key-value pairs). The related information is returned in two Block objects, each of type `KEY_VALUE_SET`: a KEY
 * `Block` object and a VALUE `Block` object. For example,
 * *Name: Ana Silva Carolina* contains a key and value.
 * *Name:* is the key. *Ana Silva Carolina* is
 * the value.
 *
 * - Table and table cell data. A TABLE `Block` object contains information
 * about a detected table. A CELL `Block` object is returned for each cell in
 * a table.
 *
 * - Lines and words of text. A LINE `Block` object contains one or more
 * WORD `Block` objects. All lines and words that are detected in the
 * document are returned (including text that doesn't have a relationship with the value
 * of `FeatureTypes`).
 *
 * - Signatures. A SIGNATURE `Block` object contains the location information
 * of a signature in a document. If used in conjunction with forms or tables, a signature
 * can be given a Key-Value pairing or be detected in the cell of a table.
 *
 * - Query. A QUERY Block object contains the query text, alias and link to the
 * associated Query results block object.
 *
 * - Query Result. A QUERY_RESULT Block object contains the answer to the query and an
 * ID that connects it to the query asked. This Block also contains a confidence
 * score.
 *
 * Selection elements such as check boxes and option buttons (radio buttons) can be
 * detected in form data and in tables. A SELECTION_ELEMENT `Block` object contains
 * information about a selection element, including the selection status.
 *
 * You can choose which type of analysis to perform by specifying the
 * `FeatureTypes` list.
 *
 * The output is returned in a list of `Block` objects.
 *
 * `AnalyzeDocument` is a synchronous operation. To analyze documents
 * asynchronously, use StartDocumentAnalysis.
 *
 * For more information, see Document Text
 * Analysis.
 */
export const analyzeDocument: (
  input: AnalyzeDocumentRequest,
) => Effect.Effect<
  AnalyzeDocumentResponse,
  | AccessDeniedException
  | BadDocumentException
  | DocumentTooLargeException
  | HumanLoopQuotaExceededException
  | InternalServerError
  | InvalidParameterException
  | InvalidS3ObjectException
  | ProvisionedThroughputExceededException
  | ThrottlingException
  | UnsupportedDocumentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AnalyzeDocumentRequest,
  output: AnalyzeDocumentResponse,
  errors: [
    AccessDeniedException,
    BadDocumentException,
    DocumentTooLargeException,
    HumanLoopQuotaExceededException,
    InternalServerError,
    InvalidParameterException,
    InvalidS3ObjectException,
    ProvisionedThroughputExceededException,
    ThrottlingException,
    UnsupportedDocumentException,
  ],
}));

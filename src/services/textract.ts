import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Textract",
  serviceShapeName: "Textract",
});
const auth = T.AwsAuthSigv4({ name: "textract" });
const ver = T.ServiceVersion("2018-06-27");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://textract-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://textract-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://textract.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://textract.{Region}.{PartitionResult#dnsSuffix}",
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
export const FeatureTypes = S.Array(S.String);
export class S3Object extends S.Class<S3Object>("S3Object")({
  Bucket: S.optional(S.String),
  Name: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class Document extends S.Class<Document>("Document")({
  Bytes: S.optional(T.Blob),
  S3Object: S.optional(S3Object),
}) {}
export const DocumentPages = S.Array(Document);
export const TagKeyList = S.Array(S.String);
export class AnalyzeExpenseRequest extends S.Class<AnalyzeExpenseRequest>(
  "AnalyzeExpenseRequest",
)(
  { Document: Document },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AnalyzeIDRequest extends S.Class<AnalyzeIDRequest>(
  "AnalyzeIDRequest",
)(
  { DocumentPages: DocumentPages },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAdapterRequest extends S.Class<DeleteAdapterRequest>(
  "DeleteAdapterRequest",
)(
  { AdapterId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAdapterResponse extends S.Class<DeleteAdapterResponse>(
  "DeleteAdapterResponse",
)({}) {}
export class DeleteAdapterVersionRequest extends S.Class<DeleteAdapterVersionRequest>(
  "DeleteAdapterVersionRequest",
)(
  { AdapterId: S.String, AdapterVersion: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAdapterVersionResponse extends S.Class<DeleteAdapterVersionResponse>(
  "DeleteAdapterVersionResponse",
)({}) {}
export class DetectDocumentTextRequest extends S.Class<DetectDocumentTextRequest>(
  "DetectDocumentTextRequest",
)(
  { Document: Document },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAdapterRequest extends S.Class<GetAdapterRequest>(
  "GetAdapterRequest",
)(
  { AdapterId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAdapterVersionRequest extends S.Class<GetAdapterVersionRequest>(
  "GetAdapterVersionRequest",
)(
  { AdapterId: S.String, AdapterVersion: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDocumentAnalysisRequest extends S.Class<GetDocumentAnalysisRequest>(
  "GetDocumentAnalysisRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDocumentTextDetectionRequest extends S.Class<GetDocumentTextDetectionRequest>(
  "GetDocumentTextDetectionRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetExpenseAnalysisRequest extends S.Class<GetExpenseAnalysisRequest>(
  "GetExpenseAnalysisRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLendingAnalysisRequest extends S.Class<GetLendingAnalysisRequest>(
  "GetLendingAnalysisRequest",
)(
  {
    JobId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLendingAnalysisSummaryRequest extends S.Class<GetLendingAnalysisSummaryRequest>(
  "GetLendingAnalysisSummaryRequest",
)(
  { JobId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAdaptersRequest extends S.Class<ListAdaptersRequest>(
  "ListAdaptersRequest",
)(
  {
    AfterCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BeforeCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAdapterVersionsRequest extends S.Class<ListAdapterVersionsRequest>(
  "ListAdapterVersionsRequest",
)(
  {
    AdapterId: S.optional(S.String),
    AfterCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    BeforeCreationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DocumentLocation extends S.Class<DocumentLocation>(
  "DocumentLocation",
)({ S3Object: S.optional(S3Object) }) {}
export class NotificationChannel extends S.Class<NotificationChannel>(
  "NotificationChannel",
)({ SNSTopicArn: S.String, RoleArn: S.String }) {}
export class OutputConfig extends S.Class<OutputConfig>("OutputConfig")({
  S3Bucket: S.String,
  S3Prefix: S.optional(S.String),
}) {}
export class StartDocumentTextDetectionRequest extends S.Class<StartDocumentTextDetectionRequest>(
  "StartDocumentTextDetectionRequest",
)(
  {
    DocumentLocation: DocumentLocation,
    ClientRequestToken: S.optional(S.String),
    JobTag: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    OutputConfig: S.optional(OutputConfig),
    KMSKeyId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartExpenseAnalysisRequest extends S.Class<StartExpenseAnalysisRequest>(
  "StartExpenseAnalysisRequest",
)(
  {
    DocumentLocation: DocumentLocation,
    ClientRequestToken: S.optional(S.String),
    JobTag: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    OutputConfig: S.optional(OutputConfig),
    KMSKeyId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartLendingAnalysisRequest extends S.Class<StartLendingAnalysisRequest>(
  "StartLendingAnalysisRequest",
)(
  {
    DocumentLocation: DocumentLocation,
    ClientRequestToken: S.optional(S.String),
    JobTag: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    OutputConfig: S.optional(OutputConfig),
    KMSKeyId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagMap },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateAdapterRequest extends S.Class<UpdateAdapterRequest>(
  "UpdateAdapterRequest",
)(
  {
    AdapterId: S.String,
    Description: S.optional(S.String),
    AdapterName: S.optional(S.String),
    AutoUpdate: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AdapterVersionDatasetConfig extends S.Class<AdapterVersionDatasetConfig>(
  "AdapterVersionDatasetConfig",
)({ ManifestS3Object: S.optional(S3Object) }) {}
export const ContentClassifiers = S.Array(S.String);
export const QueryPages = S.Array(S.String);
export const AdapterPages = S.Array(S.String);
export class CreateAdapterRequest extends S.Class<CreateAdapterRequest>(
  "CreateAdapterRequest",
)(
  {
    AdapterName: S.String,
    ClientRequestToken: S.optional(S.String),
    Description: S.optional(S.String),
    FeatureTypes: FeatureTypes,
    AutoUpdate: S.optional(S.String),
    Tags: S.optional(TagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAdapterVersionRequest extends S.Class<CreateAdapterVersionRequest>(
  "CreateAdapterVersionRequest",
)(
  {
    AdapterId: S.String,
    ClientRequestToken: S.optional(S.String),
    DatasetConfig: AdapterVersionDatasetConfig,
    KMSKeyId: S.optional(S.String),
    OutputConfig: OutputConfig,
    Tags: S.optional(TagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAdapterResponse extends S.Class<GetAdapterResponse>(
  "GetAdapterResponse",
)({
  AdapterId: S.optional(S.String),
  AdapterName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
  FeatureTypes: S.optional(FeatureTypes),
  AutoUpdate: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export class DocumentMetadata extends S.Class<DocumentMetadata>(
  "DocumentMetadata",
)({ Pages: S.optional(S.Number) }) {}
export class BoundingBox extends S.Class<BoundingBox>("BoundingBox")({
  Width: S.optional(S.Number),
  Height: S.optional(S.Number),
  Left: S.optional(S.Number),
  Top: S.optional(S.Number),
}) {}
export class Point extends S.Class<Point>("Point")({
  X: S.optional(S.Number),
  Y: S.optional(S.Number),
}) {}
export const Polygon = S.Array(Point);
export class Geometry extends S.Class<Geometry>("Geometry")({
  BoundingBox: S.optional(BoundingBox),
  Polygon: S.optional(Polygon),
  RotationAngle: S.optional(S.Number),
}) {}
export const IdList = S.Array(S.String);
export class Relationship extends S.Class<Relationship>("Relationship")({
  Type: S.optional(S.String),
  Ids: S.optional(IdList),
}) {}
export const RelationshipList = S.Array(Relationship);
export const EntityTypes = S.Array(S.String);
export class Query extends S.Class<Query>("Query")({
  Text: S.String,
  Alias: S.optional(S.String),
  Pages: S.optional(QueryPages),
}) {}
export class Block extends S.Class<Block>("Block")({
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
}) {}
export const BlockList = S.Array(Block);
export const Pages = S.Array(S.Number);
export class Warning extends S.Class<Warning>("Warning")({
  ErrorCode: S.optional(S.String),
  Pages: S.optional(Pages),
}) {}
export const Warnings = S.Array(Warning);
export class GetDocumentTextDetectionResponse extends S.Class<GetDocumentTextDetectionResponse>(
  "GetDocumentTextDetectionResponse",
)({
  DocumentMetadata: S.optional(DocumentMetadata),
  JobStatus: S.optional(S.String),
  NextToken: S.optional(S.String),
  Blocks: S.optional(BlockList),
  Warnings: S.optional(Warnings),
  StatusMessage: S.optional(S.String),
  DetectDocumentTextModelVersion: S.optional(S.String),
}) {}
export class ExpenseType extends S.Class<ExpenseType>("ExpenseType")({
  Text: S.optional(S.String),
  Confidence: S.optional(S.Number),
}) {}
export class ExpenseDetection extends S.Class<ExpenseDetection>(
  "ExpenseDetection",
)({
  Text: S.optional(S.String),
  Geometry: S.optional(Geometry),
  Confidence: S.optional(S.Number),
}) {}
export class ExpenseCurrency extends S.Class<ExpenseCurrency>(
  "ExpenseCurrency",
)({ Code: S.optional(S.String), Confidence: S.optional(S.Number) }) {}
export const StringList = S.Array(S.String);
export class ExpenseGroupProperty extends S.Class<ExpenseGroupProperty>(
  "ExpenseGroupProperty",
)({ Types: S.optional(StringList), Id: S.optional(S.String) }) {}
export const ExpenseGroupPropertyList = S.Array(ExpenseGroupProperty);
export class ExpenseField extends S.Class<ExpenseField>("ExpenseField")({
  Type: S.optional(ExpenseType),
  LabelDetection: S.optional(ExpenseDetection),
  ValueDetection: S.optional(ExpenseDetection),
  PageNumber: S.optional(S.Number),
  Currency: S.optional(ExpenseCurrency),
  GroupProperties: S.optional(ExpenseGroupPropertyList),
}) {}
export const ExpenseFieldList = S.Array(ExpenseField);
export class LineItemFields extends S.Class<LineItemFields>("LineItemFields")({
  LineItemExpenseFields: S.optional(ExpenseFieldList),
}) {}
export const LineItemList = S.Array(LineItemFields);
export class LineItemGroup extends S.Class<LineItemGroup>("LineItemGroup")({
  LineItemGroupIndex: S.optional(S.Number),
  LineItems: S.optional(LineItemList),
}) {}
export const LineItemGroupList = S.Array(LineItemGroup);
export class ExpenseDocument extends S.Class<ExpenseDocument>(
  "ExpenseDocument",
)({
  ExpenseIndex: S.optional(S.Number),
  SummaryFields: S.optional(ExpenseFieldList),
  LineItemGroups: S.optional(LineItemGroupList),
  Blocks: S.optional(BlockList),
}) {}
export const ExpenseDocumentList = S.Array(ExpenseDocument);
export class GetExpenseAnalysisResponse extends S.Class<GetExpenseAnalysisResponse>(
  "GetExpenseAnalysisResponse",
)({
  DocumentMetadata: S.optional(DocumentMetadata),
  JobStatus: S.optional(S.String),
  NextToken: S.optional(S.String),
  ExpenseDocuments: S.optional(ExpenseDocumentList),
  Warnings: S.optional(Warnings),
  StatusMessage: S.optional(S.String),
  AnalyzeExpenseModelVersion: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export const Queries = S.Array(Query);
export class QueriesConfig extends S.Class<QueriesConfig>("QueriesConfig")({
  Queries: Queries,
}) {}
export class Adapter extends S.Class<Adapter>("Adapter")({
  AdapterId: S.String,
  Pages: S.optional(AdapterPages),
  Version: S.String,
}) {}
export const Adapters = S.Array(Adapter);
export class AdaptersConfig extends S.Class<AdaptersConfig>("AdaptersConfig")({
  Adapters: Adapters,
}) {}
export class StartDocumentAnalysisRequest extends S.Class<StartDocumentAnalysisRequest>(
  "StartDocumentAnalysisRequest",
)(
  {
    DocumentLocation: DocumentLocation,
    FeatureTypes: FeatureTypes,
    ClientRequestToken: S.optional(S.String),
    JobTag: S.optional(S.String),
    NotificationChannel: S.optional(NotificationChannel),
    OutputConfig: S.optional(OutputConfig),
    KMSKeyId: S.optional(S.String),
    QueriesConfig: S.optional(QueriesConfig),
    AdaptersConfig: S.optional(AdaptersConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDocumentTextDetectionResponse extends S.Class<StartDocumentTextDetectionResponse>(
  "StartDocumentTextDetectionResponse",
)({ JobId: S.optional(S.String) }) {}
export class StartExpenseAnalysisResponse extends S.Class<StartExpenseAnalysisResponse>(
  "StartExpenseAnalysisResponse",
)({ JobId: S.optional(S.String) }) {}
export class StartLendingAnalysisResponse extends S.Class<StartLendingAnalysisResponse>(
  "StartLendingAnalysisResponse",
)({ JobId: S.optional(S.String) }) {}
export class UpdateAdapterResponse extends S.Class<UpdateAdapterResponse>(
  "UpdateAdapterResponse",
)({
  AdapterId: S.optional(S.String),
  AdapterName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
  FeatureTypes: S.optional(FeatureTypes),
  AutoUpdate: S.optional(S.String),
}) {}
export class HumanLoopDataAttributes extends S.Class<HumanLoopDataAttributes>(
  "HumanLoopDataAttributes",
)({ ContentClassifiers: S.optional(ContentClassifiers) }) {}
export const UndetectedDocumentTypeList = S.Array(S.String);
export class HumanLoopConfig extends S.Class<HumanLoopConfig>(
  "HumanLoopConfig",
)({
  HumanLoopName: S.String,
  FlowDefinitionArn: S.String,
  DataAttributes: S.optional(HumanLoopDataAttributes),
}) {}
export class AdapterOverview extends S.Class<AdapterOverview>(
  "AdapterOverview",
)({
  AdapterId: S.optional(S.String),
  AdapterName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FeatureTypes: S.optional(FeatureTypes),
}) {}
export const AdapterList = S.Array(AdapterOverview);
export class AdapterVersionOverview extends S.Class<AdapterVersionOverview>(
  "AdapterVersionOverview",
)({
  AdapterId: S.optional(S.String),
  AdapterVersion: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FeatureTypes: S.optional(FeatureTypes),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export const AdapterVersionList = S.Array(AdapterVersionOverview);
export class AnalyzeDocumentRequest extends S.Class<AnalyzeDocumentRequest>(
  "AnalyzeDocumentRequest",
)(
  {
    Document: Document,
    FeatureTypes: FeatureTypes,
    HumanLoopConfig: S.optional(HumanLoopConfig),
    QueriesConfig: S.optional(QueriesConfig),
    AdaptersConfig: S.optional(AdaptersConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAdapterResponse extends S.Class<CreateAdapterResponse>(
  "CreateAdapterResponse",
)({ AdapterId: S.optional(S.String) }) {}
export class CreateAdapterVersionResponse extends S.Class<CreateAdapterVersionResponse>(
  "CreateAdapterVersionResponse",
)({ AdapterId: S.optional(S.String), AdapterVersion: S.optional(S.String) }) {}
export class GetDocumentAnalysisResponse extends S.Class<GetDocumentAnalysisResponse>(
  "GetDocumentAnalysisResponse",
)({
  DocumentMetadata: S.optional(DocumentMetadata),
  JobStatus: S.optional(S.String),
  NextToken: S.optional(S.String),
  Blocks: S.optional(BlockList),
  Warnings: S.optional(Warnings),
  StatusMessage: S.optional(S.String),
  AnalyzeDocumentModelVersion: S.optional(S.String),
}) {}
export class ListAdaptersResponse extends S.Class<ListAdaptersResponse>(
  "ListAdaptersResponse",
)({ Adapters: S.optional(AdapterList), NextToken: S.optional(S.String) }) {}
export class ListAdapterVersionsResponse extends S.Class<ListAdapterVersionsResponse>(
  "ListAdapterVersionsResponse",
)({
  AdapterVersions: S.optional(AdapterVersionList),
  NextToken: S.optional(S.String),
}) {}
export class StartDocumentAnalysisResponse extends S.Class<StartDocumentAnalysisResponse>(
  "StartDocumentAnalysisResponse",
)({ JobId: S.optional(S.String) }) {}
export class EvaluationMetric extends S.Class<EvaluationMetric>(
  "EvaluationMetric",
)({
  F1Score: S.optional(S.Number),
  Precision: S.optional(S.Number),
  Recall: S.optional(S.Number),
}) {}
export const PageList = S.Array(S.Number);
export class AdapterVersionEvaluationMetric extends S.Class<AdapterVersionEvaluationMetric>(
  "AdapterVersionEvaluationMetric",
)({
  Baseline: S.optional(EvaluationMetric),
  AdapterVersion: S.optional(EvaluationMetric),
  FeatureType: S.optional(S.String),
}) {}
export const AdapterVersionEvaluationMetrics = S.Array(
  AdapterVersionEvaluationMetric,
);
export class Prediction extends S.Class<Prediction>("Prediction")({
  Value: S.optional(S.String),
  Confidence: S.optional(S.Number),
}) {}
export const PredictionList = S.Array(Prediction);
export class SplitDocument extends S.Class<SplitDocument>("SplitDocument")({
  Index: S.optional(S.Number),
  Pages: S.optional(PageList),
}) {}
export const SplitDocumentList = S.Array(SplitDocument);
export class DetectedSignature extends S.Class<DetectedSignature>(
  "DetectedSignature",
)({ Page: S.optional(S.Number) }) {}
export const DetectedSignatureList = S.Array(DetectedSignature);
export class UndetectedSignature extends S.Class<UndetectedSignature>(
  "UndetectedSignature",
)({ Page: S.optional(S.Number) }) {}
export const UndetectedSignatureList = S.Array(UndetectedSignature);
export class GetAdapterVersionResponse extends S.Class<GetAdapterVersionResponse>(
  "GetAdapterVersionResponse",
)({
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
}) {}
export class LendingDetection extends S.Class<LendingDetection>(
  "LendingDetection",
)({
  Text: S.optional(S.String),
  SelectionStatus: S.optional(S.String),
  Geometry: S.optional(Geometry),
  Confidence: S.optional(S.Number),
}) {}
export const LendingDetectionList = S.Array(LendingDetection);
export const HumanLoopActivationReasons = S.Array(S.String);
export class PageClassification extends S.Class<PageClassification>(
  "PageClassification",
)({ PageType: PredictionList, PageNumber: PredictionList }) {}
export class DocumentGroup extends S.Class<DocumentGroup>("DocumentGroup")({
  Type: S.optional(S.String),
  SplitDocuments: S.optional(SplitDocumentList),
  DetectedSignatures: S.optional(DetectedSignatureList),
  UndetectedSignatures: S.optional(UndetectedSignatureList),
}) {}
export const DocumentGroupList = S.Array(DocumentGroup);
export class NormalizedValue extends S.Class<NormalizedValue>(
  "NormalizedValue",
)({ Value: S.optional(S.String), ValueType: S.optional(S.String) }) {}
export class SignatureDetection extends S.Class<SignatureDetection>(
  "SignatureDetection",
)({ Confidence: S.optional(S.Number), Geometry: S.optional(Geometry) }) {}
export const SignatureDetectionList = S.Array(SignatureDetection);
export class HumanLoopActivationOutput extends S.Class<HumanLoopActivationOutput>(
  "HumanLoopActivationOutput",
)({
  HumanLoopArn: S.optional(S.String),
  HumanLoopActivationReasons: S.optional(HumanLoopActivationReasons),
  HumanLoopActivationConditionsEvaluationResults: S.optional(S.String),
}) {}
export class LendingSummary extends S.Class<LendingSummary>("LendingSummary")({
  DocumentGroups: S.optional(DocumentGroupList),
  UndetectedDocumentTypes: S.optional(UndetectedDocumentTypeList),
}) {}
export class AnalyzeIDDetections extends S.Class<AnalyzeIDDetections>(
  "AnalyzeIDDetections",
)({
  Text: S.String,
  NormalizedValue: S.optional(NormalizedValue),
  Confidence: S.optional(S.Number),
}) {}
export class AnalyzeDocumentResponse extends S.Class<AnalyzeDocumentResponse>(
  "AnalyzeDocumentResponse",
)({
  DocumentMetadata: S.optional(DocumentMetadata),
  Blocks: S.optional(BlockList),
  HumanLoopActivationOutput: S.optional(HumanLoopActivationOutput),
  AnalyzeDocumentModelVersion: S.optional(S.String),
}) {}
export class AnalyzeExpenseResponse extends S.Class<AnalyzeExpenseResponse>(
  "AnalyzeExpenseResponse",
)({
  DocumentMetadata: S.optional(DocumentMetadata),
  ExpenseDocuments: S.optional(ExpenseDocumentList),
}) {}
export class DetectDocumentTextResponse extends S.Class<DetectDocumentTextResponse>(
  "DetectDocumentTextResponse",
)({
  DocumentMetadata: S.optional(DocumentMetadata),
  Blocks: S.optional(BlockList),
  DetectDocumentTextModelVersion: S.optional(S.String),
}) {}
export class GetLendingAnalysisSummaryResponse extends S.Class<GetLendingAnalysisSummaryResponse>(
  "GetLendingAnalysisSummaryResponse",
)({
  DocumentMetadata: S.optional(DocumentMetadata),
  JobStatus: S.optional(S.String),
  Summary: S.optional(LendingSummary),
  Warnings: S.optional(Warnings),
  StatusMessage: S.optional(S.String),
  AnalyzeLendingModelVersion: S.optional(S.String),
}) {}
export class IdentityDocumentField extends S.Class<IdentityDocumentField>(
  "IdentityDocumentField",
)({
  Type: S.optional(AnalyzeIDDetections),
  ValueDetection: S.optional(AnalyzeIDDetections),
}) {}
export const IdentityDocumentFieldList = S.Array(IdentityDocumentField);
export class LendingField extends S.Class<LendingField>("LendingField")({
  Type: S.optional(S.String),
  KeyDetection: S.optional(LendingDetection),
  ValueDetections: S.optional(LendingDetectionList),
}) {}
export const LendingFieldList = S.Array(LendingField);
export class IdentityDocument extends S.Class<IdentityDocument>(
  "IdentityDocument",
)({
  DocumentIndex: S.optional(S.Number),
  IdentityDocumentFields: S.optional(IdentityDocumentFieldList),
  Blocks: S.optional(BlockList),
}) {}
export const IdentityDocumentList = S.Array(IdentityDocument);
export class LendingDocument extends S.Class<LendingDocument>(
  "LendingDocument",
)({
  LendingFields: S.optional(LendingFieldList),
  SignatureDetections: S.optional(SignatureDetectionList),
}) {}
export class AnalyzeIDResponse extends S.Class<AnalyzeIDResponse>(
  "AnalyzeIDResponse",
)({
  IdentityDocuments: S.optional(IdentityDocumentList),
  DocumentMetadata: S.optional(DocumentMetadata),
  AnalyzeIDModelVersion: S.optional(S.String),
}) {}
export class Extraction extends S.Class<Extraction>("Extraction")({
  LendingDocument: S.optional(LendingDocument),
  ExpenseDocument: S.optional(ExpenseDocument),
  IdentityDocument: S.optional(IdentityDocument),
}) {}
export const ExtractionList = S.Array(Extraction);
export class LendingResult extends S.Class<LendingResult>("LendingResult")({
  Page: S.optional(S.Number),
  PageClassification: S.optional(PageClassification),
  Extractions: S.optional(ExtractionList),
}) {}
export const LendingResultList = S.Array(LendingResult);
export class GetLendingAnalysisResponse extends S.Class<GetLendingAnalysisResponse>(
  "GetLendingAnalysisResponse",
)({
  DocumentMetadata: S.optional(DocumentMetadata),
  JobStatus: S.optional(S.String),
  NextToken: S.optional(S.String),
  Results: S.optional(LendingResultList),
  Warnings: S.optional(Warnings),
  StatusMessage: S.optional(S.String),
  AnalyzeLendingModelVersion: S.optional(S.String),
}) {}

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
) {}
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
export const getDocumentAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getLendingAnalysisSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const getDocumentTextDetection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const getExpenseAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getLendingAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAdapters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
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
export const analyzeExpense = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAdapterVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAdapterVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateAdapter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAdapterVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists all tags for an Amazon Textract resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAdapter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAdapterVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Gets configuration information for an adapter specified by an AdapterId, returning information on AdapterName, Description,
 * CreationTime, AutoUpdate status, and FeatureTypes.
 */
export const getAdapter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAdapter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const analyzeID = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const detectDocumentText = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startExpenseAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const startLendingAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const startDocumentAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const startDocumentTextDetection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const analyzeDocument = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

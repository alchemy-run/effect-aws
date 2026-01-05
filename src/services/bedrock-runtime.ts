import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Bedrock Runtime",
  serviceShapeName: "AmazonBedrockFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "bedrock" });
const ver = T.ServiceVersion("2023-09-30");
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
                                url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://bedrock-runtime.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://bedrock-runtime.{Region}.{PartitionResult#dnsSuffix}",
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
export const AdditionalModelResponseFieldPaths = S.Array(S.String);
export class GetAsyncInvokeRequest extends S.Class<GetAsyncInvokeRequest>(
  "GetAsyncInvokeRequest",
)(
  { invocationArn: S.String.pipe(T.HttpLabel("invocationArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/async-invoke/{invocationArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAsyncInvokesRequest extends S.Class<ListAsyncInvokesRequest>(
  "ListAsyncInvokesRequest",
)(
  {
    submitTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("submitTimeAfter")),
    submitTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("submitTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/async-invoke" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeModelRequest extends S.Class<InvokeModelRequest>(
  "InvokeModelRequest",
)(
  {
    body: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    accept: S.optional(S.String).pipe(T.HttpHeader("Accept")),
    modelId: S.String.pipe(T.HttpLabel("modelId")),
    trace: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Bedrock-Trace")),
    guardrailIdentifier: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-GuardrailIdentifier"),
    ),
    guardrailVersion: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-GuardrailVersion"),
    ),
    performanceConfigLatency: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-PerformanceConfig-Latency"),
    ),
    serviceTier: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-Service-Tier"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/model/{modelId}/invoke" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeModelWithResponseStreamRequest extends S.Class<InvokeModelWithResponseStreamRequest>(
  "InvokeModelWithResponseStreamRequest",
)(
  {
    body: S.optional(T.StreamingInput).pipe(T.HttpPayload()),
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    accept: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Bedrock-Accept")),
    modelId: S.String.pipe(T.HttpLabel("modelId")),
    trace: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Bedrock-Trace")),
    guardrailIdentifier: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-GuardrailIdentifier"),
    ),
    guardrailVersion: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-GuardrailVersion"),
    ),
    performanceConfigLatency: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-PerformanceConfig-Latency"),
    ),
    serviceTier: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-Service-Tier"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/model/{modelId}/invoke-with-response-stream",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const NonEmptyStringList = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class InferenceConfiguration extends S.Class<InferenceConfiguration>(
  "InferenceConfiguration",
)({
  maxTokens: S.optional(S.Number),
  temperature: S.optional(S.Number),
  topP: S.optional(S.Number),
  stopSequences: S.optional(NonEmptyStringList),
}) {}
export class GuardrailConfiguration extends S.Class<GuardrailConfiguration>(
  "GuardrailConfiguration",
)({
  guardrailIdentifier: S.optional(S.String),
  guardrailVersion: S.optional(S.String),
  trace: S.optional(S.String),
}) {}
export const RequestMetadata = S.Record({ key: S.String, value: S.String });
export class PerformanceConfiguration extends S.Class<PerformanceConfiguration>(
  "PerformanceConfiguration",
)({ latency: S.optional(S.String) }) {}
export class ServiceTier extends S.Class<ServiceTier>("ServiceTier")({
  type: S.String,
}) {}
export class GuardrailStreamConfiguration extends S.Class<GuardrailStreamConfiguration>(
  "GuardrailStreamConfiguration",
)({
  guardrailIdentifier: S.optional(S.String),
  guardrailVersion: S.optional(S.String),
  trace: S.optional(S.String),
  streamProcessingMode: S.optional(S.String),
}) {}
export const GuardrailContentQualifierList = S.Array(S.String);
export class AutoToolChoice extends S.Class<AutoToolChoice>("AutoToolChoice")(
  {},
) {}
export class AnyToolChoice extends S.Class<AnyToolChoice>("AnyToolChoice")(
  {},
) {}
export class AsyncInvokeS3OutputDataConfig extends S.Class<AsyncInvokeS3OutputDataConfig>(
  "AsyncInvokeS3OutputDataConfig",
)({
  s3Uri: S.String,
  kmsKeyId: S.optional(S.String),
  bucketOwner: S.optional(S.String),
}) {}
export const AsyncInvokeOutputDataConfig = S.Union(
  S.Struct({ s3OutputDataConfig: AsyncInvokeS3OutputDataConfig }),
);
export class GetAsyncInvokeResponse extends S.Class<GetAsyncInvokeResponse>(
  "GetAsyncInvokeResponse",
)({
  invocationArn: S.String,
  modelArn: S.String,
  clientRequestToken: S.optional(S.String),
  status: S.String,
  failureMessage: S.optional(S.String),
  submitTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  outputDataConfig: AsyncInvokeOutputDataConfig,
}) {}
export class S3Location extends S.Class<S3Location>("S3Location")({
  uri: S.String,
  bucketOwner: S.optional(S.String),
}) {}
export const ImageSource = S.Union(
  S.Struct({ bytes: T.Blob }),
  S.Struct({ s3Location: S3Location }),
);
export class ErrorBlock extends S.Class<ErrorBlock>("ErrorBlock")({
  message: S.optional(S.String),
}) {}
export class ImageBlock extends S.Class<ImageBlock>("ImageBlock")({
  format: S.String,
  source: ImageSource,
  error: S.optional(ErrorBlock),
}) {}
export const DocumentContentBlock = S.Union(S.Struct({ text: S.String }));
export const DocumentContentBlocks = S.Array(DocumentContentBlock);
export const DocumentSource = S.Union(
  S.Struct({ bytes: T.Blob }),
  S.Struct({ s3Location: S3Location }),
  S.Struct({ text: S.String }),
  S.Struct({ content: DocumentContentBlocks }),
);
export class CitationsConfig extends S.Class<CitationsConfig>(
  "CitationsConfig",
)({ enabled: S.Boolean }) {}
export class DocumentBlock extends S.Class<DocumentBlock>("DocumentBlock")({
  format: S.optional(S.String),
  name: S.String,
  source: DocumentSource,
  context: S.optional(S.String),
  citations: S.optional(CitationsConfig),
}) {}
export const VideoSource = S.Union(
  S.Struct({ bytes: T.Blob }),
  S.Struct({ s3Location: S3Location }),
);
export class VideoBlock extends S.Class<VideoBlock>("VideoBlock")({
  format: S.String,
  source: VideoSource,
}) {}
export const AudioSource = S.Union(
  S.Struct({ bytes: T.Blob }),
  S.Struct({ s3Location: S3Location }),
);
export class AudioBlock extends S.Class<AudioBlock>("AudioBlock")({
  format: S.String,
  source: AudioSource,
  error: S.optional(ErrorBlock),
}) {}
export class ToolUseBlock extends S.Class<ToolUseBlock>("ToolUseBlock")({
  toolUseId: S.String,
  name: S.String,
  input: S.Any,
  type: S.optional(S.String),
}) {}
export class SearchResultContentBlock extends S.Class<SearchResultContentBlock>(
  "SearchResultContentBlock",
)({ text: S.String }) {}
export const SearchResultContentBlocks = S.Array(SearchResultContentBlock);
export class SearchResultBlock extends S.Class<SearchResultBlock>(
  "SearchResultBlock",
)({
  source: S.String,
  title: S.String,
  content: SearchResultContentBlocks,
  citations: S.optional(CitationsConfig),
}) {}
export const ToolResultContentBlock = S.Union(
  S.Struct({ json: S.Any }),
  S.Struct({ text: S.String }),
  S.Struct({ image: ImageBlock }),
  S.Struct({ document: DocumentBlock }),
  S.Struct({ video: VideoBlock }),
  S.Struct({ searchResult: SearchResultBlock }),
);
export const ToolResultContentBlocks = S.Array(ToolResultContentBlock);
export class ToolResultBlock extends S.Class<ToolResultBlock>(
  "ToolResultBlock",
)({
  toolUseId: S.String,
  content: ToolResultContentBlocks,
  status: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const GuardrailConverseContentQualifierList = S.Array(S.String);
export class GuardrailConverseTextBlock extends S.Class<GuardrailConverseTextBlock>(
  "GuardrailConverseTextBlock",
)({
  text: S.String,
  qualifiers: S.optional(GuardrailConverseContentQualifierList),
}) {}
export const GuardrailConverseImageSource = S.Union(
  S.Struct({ bytes: T.Blob }),
);
export class GuardrailConverseImageBlock extends S.Class<GuardrailConverseImageBlock>(
  "GuardrailConverseImageBlock",
)({ format: S.String, source: GuardrailConverseImageSource }) {}
export const GuardrailConverseContentBlock = S.Union(
  S.Struct({ text: GuardrailConverseTextBlock }),
  S.Struct({ image: GuardrailConverseImageBlock }),
);
export class CachePointBlock extends S.Class<CachePointBlock>(
  "CachePointBlock",
)({ type: S.String }) {}
export class ReasoningTextBlock extends S.Class<ReasoningTextBlock>(
  "ReasoningTextBlock",
)({ text: S.String, signature: S.optional(S.String) }) {}
export const ReasoningContentBlock = S.Union(
  S.Struct({ reasoningText: ReasoningTextBlock }),
  S.Struct({ redactedContent: T.Blob }),
);
export const CitationGeneratedContent = S.Union(S.Struct({ text: S.String }));
export const CitationGeneratedContentList = S.Array(CitationGeneratedContent);
export const CitationSourceContent = S.Union(S.Struct({ text: S.String }));
export const CitationSourceContentList = S.Array(CitationSourceContent);
export class WebLocation extends S.Class<WebLocation>("WebLocation")({
  url: S.optional(S.String),
  domain: S.optional(S.String),
}) {}
export class DocumentCharLocation extends S.Class<DocumentCharLocation>(
  "DocumentCharLocation",
)({
  documentIndex: S.optional(S.Number),
  start: S.optional(S.Number),
  end: S.optional(S.Number),
}) {}
export class DocumentPageLocation extends S.Class<DocumentPageLocation>(
  "DocumentPageLocation",
)({
  documentIndex: S.optional(S.Number),
  start: S.optional(S.Number),
  end: S.optional(S.Number),
}) {}
export class DocumentChunkLocation extends S.Class<DocumentChunkLocation>(
  "DocumentChunkLocation",
)({
  documentIndex: S.optional(S.Number),
  start: S.optional(S.Number),
  end: S.optional(S.Number),
}) {}
export class SearchResultLocation extends S.Class<SearchResultLocation>(
  "SearchResultLocation",
)({
  searchResultIndex: S.optional(S.Number),
  start: S.optional(S.Number),
  end: S.optional(S.Number),
}) {}
export const CitationLocation = S.Union(
  S.Struct({ web: WebLocation }),
  S.Struct({ documentChar: DocumentCharLocation }),
  S.Struct({ documentPage: DocumentPageLocation }),
  S.Struct({ documentChunk: DocumentChunkLocation }),
  S.Struct({ searchResultLocation: SearchResultLocation }),
);
export class Citation extends S.Class<Citation>("Citation")({
  title: S.optional(S.String),
  source: S.optional(S.String),
  sourceContent: S.optional(CitationSourceContentList),
  location: S.optional(CitationLocation),
}) {}
export const Citations = S.Array(Citation);
export class CitationsContentBlock extends S.Class<CitationsContentBlock>(
  "CitationsContentBlock",
)({
  content: S.optional(CitationGeneratedContentList),
  citations: S.optional(Citations),
}) {}
export const ContentBlock = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ image: ImageBlock }),
  S.Struct({ document: DocumentBlock }),
  S.Struct({ video: VideoBlock }),
  S.Struct({ audio: AudioBlock }),
  S.Struct({ toolUse: ToolUseBlock }),
  S.Struct({ toolResult: ToolResultBlock }),
  S.Struct({ guardContent: GuardrailConverseContentBlock }),
  S.Struct({ cachePoint: CachePointBlock }),
  S.Struct({ reasoningContent: ReasoningContentBlock }),
  S.Struct({ citationsContent: CitationsContentBlock }),
  S.Struct({ searchResult: SearchResultBlock }),
);
export const ContentBlocks = S.Array(ContentBlock);
export class Message extends S.Class<Message>("Message")({
  role: S.String,
  content: ContentBlocks,
}) {}
export const Messages = S.Array(Message);
export const SystemContentBlock = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ guardContent: GuardrailConverseContentBlock }),
  S.Struct({ cachePoint: CachePointBlock }),
);
export const SystemContentBlocks = S.Array(SystemContentBlock);
export const ToolInputSchema = S.Union(S.Struct({ json: S.Any }));
export class ToolSpecification extends S.Class<ToolSpecification>(
  "ToolSpecification",
)({
  name: S.String,
  description: S.optional(S.String),
  inputSchema: ToolInputSchema,
}) {}
export class SystemTool extends S.Class<SystemTool>("SystemTool")({
  name: S.String,
}) {}
export const Tool = S.Union(
  S.Struct({ toolSpec: ToolSpecification }),
  S.Struct({ systemTool: SystemTool }),
  S.Struct({ cachePoint: CachePointBlock }),
);
export const Tools = S.Array(Tool);
export class SpecificToolChoice extends S.Class<SpecificToolChoice>(
  "SpecificToolChoice",
)({ name: S.String }) {}
export const ToolChoice = S.Union(
  S.Struct({ auto: AutoToolChoice }),
  S.Struct({ any: AnyToolChoice }),
  S.Struct({ tool: SpecificToolChoice }),
);
export class ToolConfiguration extends S.Class<ToolConfiguration>(
  "ToolConfiguration",
)({ tools: Tools, toolChoice: S.optional(ToolChoice) }) {}
export const PromptVariableValues = S.Union(S.Struct({ text: S.String }));
export const PromptVariableMap = S.Record({
  key: S.String,
  value: PromptVariableValues,
});
export class ConverseStreamRequest extends S.Class<ConverseStreamRequest>(
  "ConverseStreamRequest",
)(
  {
    modelId: S.String.pipe(T.HttpLabel("modelId")),
    messages: S.optional(Messages),
    system: S.optional(SystemContentBlocks),
    inferenceConfig: S.optional(InferenceConfiguration),
    toolConfig: S.optional(ToolConfiguration),
    guardrailConfig: S.optional(GuardrailStreamConfiguration),
    additionalModelRequestFields: S.optional(S.Any),
    promptVariables: S.optional(PromptVariableMap),
    additionalModelResponseFieldPaths: S.optional(
      AdditionalModelResponseFieldPaths,
    ),
    requestMetadata: S.optional(RequestMetadata),
    performanceConfig: S.optional(PerformanceConfiguration),
    serviceTier: S.optional(ServiceTier),
  },
  T.all(
    T.Http({ method: "POST", uri: "/model/{modelId}/converse-stream" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeModelResponse extends S.Class<InvokeModelResponse>(
  "InvokeModelResponse",
)({
  body: T.StreamingOutput.pipe(T.HttpPayload()),
  contentType: S.String.pipe(T.HttpHeader("Content-Type")),
  performanceConfigLatency: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-Bedrock-PerformanceConfig-Latency"),
  ),
  serviceTier: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-Bedrock-Service-Tier"),
  ),
}) {}
export class GuardrailTextBlock extends S.Class<GuardrailTextBlock>(
  "GuardrailTextBlock",
)({ text: S.String, qualifiers: S.optional(GuardrailContentQualifierList) }) {}
export class BidirectionalInputPayloadPart extends S.Class<BidirectionalInputPayloadPart>(
  "BidirectionalInputPayloadPart",
)({ bytes: S.optional(T.Blob) }) {}
export class InvokeModelTokensRequest extends S.Class<InvokeModelTokensRequest>(
  "InvokeModelTokensRequest",
)({ body: T.Blob }) {}
export class ConverseTokensRequest extends S.Class<ConverseTokensRequest>(
  "ConverseTokensRequest",
)({
  messages: S.optional(Messages),
  system: S.optional(SystemContentBlocks),
  toolConfig: S.optional(ToolConfiguration),
  additionalModelRequestFields: S.optional(S.Any),
}) {}
export class AsyncInvokeSummary extends S.Class<AsyncInvokeSummary>(
  "AsyncInvokeSummary",
)({
  invocationArn: S.String,
  modelArn: S.String,
  clientRequestToken: S.optional(S.String),
  status: S.optional(S.String),
  failureMessage: S.optional(S.String),
  submitTime: S.Date.pipe(T.TimestampFormat("date-time")),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  outputDataConfig: AsyncInvokeOutputDataConfig,
}) {}
export const AsyncInvokeSummaries = S.Array(AsyncInvokeSummary);
export const InvokeModelWithBidirectionalStreamInput = T.InputEventStream(
  S.Union(S.Struct({ chunk: BidirectionalInputPayloadPart })),
);
export const CountTokensInput = S.Union(
  S.Struct({ invokeModel: InvokeModelTokensRequest }),
  S.Struct({ converse: ConverseTokensRequest }),
);
export const GuardrailImageSource = S.Union(S.Struct({ bytes: T.Blob }));
export class ListAsyncInvokesResponse extends S.Class<ListAsyncInvokesResponse>(
  "ListAsyncInvokesResponse",
)({
  nextToken: S.optional(S.String),
  asyncInvokeSummaries: S.optional(AsyncInvokeSummaries),
}) {}
export class StartAsyncInvokeRequest extends S.Class<StartAsyncInvokeRequest>(
  "StartAsyncInvokeRequest",
)(
  {
    clientRequestToken: S.optional(S.String),
    modelId: S.String,
    modelInput: S.Any,
    outputDataConfig: AsyncInvokeOutputDataConfig,
    tags: S.optional(TagList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/async-invoke" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeModelWithBidirectionalStreamRequest extends S.Class<InvokeModelWithBidirectionalStreamRequest>(
  "InvokeModelWithBidirectionalStreamRequest",
)(
  {
    modelId: S.String.pipe(T.HttpLabel("modelId")),
    body: InvokeModelWithBidirectionalStreamInput.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/model/{modelId}/invoke-with-bidirectional-stream",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CountTokensRequest extends S.Class<CountTokensRequest>(
  "CountTokensRequest",
)(
  { modelId: S.String.pipe(T.HttpLabel("modelId")), input: CountTokensInput },
  T.all(
    T.Http({ method: "POST", uri: "/model/{modelId}/count-tokens" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GuardrailImageBlock extends S.Class<GuardrailImageBlock>(
  "GuardrailImageBlock",
)({ format: S.String, source: GuardrailImageSource }) {}
export class PayloadPart extends S.Class<PayloadPart>("PayloadPart")({
  bytes: S.optional(T.Blob),
}) {}
export const GuardrailContentBlock = S.Union(
  S.Struct({ text: GuardrailTextBlock }),
  S.Struct({ image: GuardrailImageBlock }),
);
export const GuardrailContentBlockList = S.Array(GuardrailContentBlock);
export const ResponseStream = T.EventStream(
  S.Union(
    S.Struct({ chunk: PayloadPart }),
    S.Struct({
      internalServerException: S.suspend(() => InternalServerException),
    }),
    S.Struct({
      modelStreamErrorException: S.suspend(() => ModelStreamErrorException),
    }),
    S.Struct({ validationException: S.suspend(() => ValidationException) }),
    S.Struct({ throttlingException: S.suspend(() => ThrottlingException) }),
    S.Struct({ modelTimeoutException: S.suspend(() => ModelTimeoutException) }),
    S.Struct({
      serviceUnavailableException: S.suspend(() => ServiceUnavailableException),
    }),
  ),
);
export class StartAsyncInvokeResponse extends S.Class<StartAsyncInvokeResponse>(
  "StartAsyncInvokeResponse",
)({ invocationArn: S.String }) {}
export class ApplyGuardrailRequest extends S.Class<ApplyGuardrailRequest>(
  "ApplyGuardrailRequest",
)(
  {
    guardrailIdentifier: S.String.pipe(T.HttpLabel("guardrailIdentifier")),
    guardrailVersion: S.String.pipe(T.HttpLabel("guardrailVersion")),
    source: S.String,
    content: GuardrailContentBlockList,
    outputScope: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/guardrail/{guardrailIdentifier}/version/{guardrailVersion}/apply",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeModelWithResponseStreamResponse extends S.Class<InvokeModelWithResponseStreamResponse>(
  "InvokeModelWithResponseStreamResponse",
)({
  body: ResponseStream.pipe(T.HttpPayload()),
  contentType: S.String.pipe(T.HttpHeader("X-Amzn-Bedrock-Content-Type")),
  performanceConfigLatency: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-Bedrock-PerformanceConfig-Latency"),
  ),
  serviceTier: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-Bedrock-Service-Tier"),
  ),
}) {}
export class CountTokensResponse extends S.Class<CountTokensResponse>(
  "CountTokensResponse",
)({ inputTokens: S.Number }) {}
export class MessageStartEvent extends S.Class<MessageStartEvent>(
  "MessageStartEvent",
)({ role: S.String }) {}
export class ContentBlockStopEvent extends S.Class<ContentBlockStopEvent>(
  "ContentBlockStopEvent",
)({ contentBlockIndex: S.Number }) {}
export class MessageStopEvent extends S.Class<MessageStopEvent>(
  "MessageStopEvent",
)({ stopReason: S.String, additionalModelResponseFields: S.optional(S.Any) }) {}
export class TokenUsage extends S.Class<TokenUsage>("TokenUsage")({
  inputTokens: S.Number,
  outputTokens: S.Number,
  totalTokens: S.Number,
  cacheReadInputTokens: S.optional(S.Number),
  cacheWriteInputTokens: S.optional(S.Number),
}) {}
export class ConverseStreamMetrics extends S.Class<ConverseStreamMetrics>(
  "ConverseStreamMetrics",
)({ latencyMs: S.Number }) {}
export const ModelOutputs = S.Array(S.String);
export class BidirectionalOutputPayloadPart extends S.Class<BidirectionalOutputPayloadPart>(
  "BidirectionalOutputPayloadPart",
)({ bytes: S.optional(T.Blob) }) {}
export class ToolUseBlockStart extends S.Class<ToolUseBlockStart>(
  "ToolUseBlockStart",
)({ toolUseId: S.String, name: S.String, type: S.optional(S.String) }) {}
export class ToolResultBlockStart extends S.Class<ToolResultBlockStart>(
  "ToolResultBlockStart",
)({
  toolUseId: S.String,
  type: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class ImageBlockStart extends S.Class<ImageBlockStart>(
  "ImageBlockStart",
)({ format: S.String }) {}
export class ToolUseBlockDelta extends S.Class<ToolUseBlockDelta>(
  "ToolUseBlockDelta",
)({ input: S.String }) {}
export const ToolResultBlockDelta = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ json: S.Any }),
);
export const ToolResultBlocksDelta = S.Array(ToolResultBlockDelta);
export const ReasoningContentBlockDelta = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ redactedContent: T.Blob }),
  S.Struct({ signature: S.String }),
);
export class ImageBlockDelta extends S.Class<ImageBlockDelta>(
  "ImageBlockDelta",
)({ source: S.optional(ImageSource), error: S.optional(ErrorBlock) }) {}
export class PromptRouterTrace extends S.Class<PromptRouterTrace>(
  "PromptRouterTrace",
)({ invokedModelId: S.optional(S.String) }) {}
export class GuardrailUsage extends S.Class<GuardrailUsage>("GuardrailUsage")({
  topicPolicyUnits: S.Number,
  contentPolicyUnits: S.Number,
  wordPolicyUnits: S.Number,
  sensitiveInformationPolicyUnits: S.Number,
  sensitiveInformationPolicyFreeUnits: S.Number,
  contextualGroundingPolicyUnits: S.Number,
  contentPolicyImageUnits: S.optional(S.Number),
  automatedReasoningPolicyUnits: S.optional(S.Number),
  automatedReasoningPolicies: S.optional(S.Number),
}) {}
export class GuardrailOutputContent extends S.Class<GuardrailOutputContent>(
  "GuardrailOutputContent",
)({ text: S.optional(S.String) }) {}
export const GuardrailOutputContentList = S.Array(GuardrailOutputContent);
export const InvokeModelWithBidirectionalStreamOutput = T.EventStream(
  S.Union(
    S.Struct({ chunk: BidirectionalOutputPayloadPart }),
    S.Struct({
      internalServerException: S.suspend(() => InternalServerException),
    }),
    S.Struct({
      modelStreamErrorException: S.suspend(() => ModelStreamErrorException),
    }),
    S.Struct({ validationException: S.suspend(() => ValidationException) }),
    S.Struct({ throttlingException: S.suspend(() => ThrottlingException) }),
    S.Struct({ modelTimeoutException: S.suspend(() => ModelTimeoutException) }),
    S.Struct({
      serviceUnavailableException: S.suspend(() => ServiceUnavailableException),
    }),
  ),
);
export const GuardrailOriginList = S.Array(S.String);
export const ContentBlockStart = S.Union(
  S.Struct({ toolUse: ToolUseBlockStart }),
  S.Struct({ toolResult: ToolResultBlockStart }),
  S.Struct({ image: ImageBlockStart }),
);
export class CitationSourceContentDelta extends S.Class<CitationSourceContentDelta>(
  "CitationSourceContentDelta",
)({ text: S.optional(S.String) }) {}
export const CitationSourceContentListDelta = S.Array(
  CitationSourceContentDelta,
);
export class GuardrailTopic extends S.Class<GuardrailTopic>("GuardrailTopic")({
  name: S.String,
  type: S.String,
  action: S.String,
  detected: S.optional(S.Boolean),
}) {}
export const GuardrailTopicList = S.Array(GuardrailTopic);
export class GuardrailTopicPolicyAssessment extends S.Class<GuardrailTopicPolicyAssessment>(
  "GuardrailTopicPolicyAssessment",
)({ topics: GuardrailTopicList }) {}
export class GuardrailContentFilter extends S.Class<GuardrailContentFilter>(
  "GuardrailContentFilter",
)({
  type: S.String,
  confidence: S.String,
  filterStrength: S.optional(S.String),
  action: S.String,
  detected: S.optional(S.Boolean),
}) {}
export const GuardrailContentFilterList = S.Array(GuardrailContentFilter);
export class GuardrailContentPolicyAssessment extends S.Class<GuardrailContentPolicyAssessment>(
  "GuardrailContentPolicyAssessment",
)({ filters: GuardrailContentFilterList }) {}
export class GuardrailCustomWord extends S.Class<GuardrailCustomWord>(
  "GuardrailCustomWord",
)({ match: S.String, action: S.String, detected: S.optional(S.Boolean) }) {}
export const GuardrailCustomWordList = S.Array(GuardrailCustomWord);
export class GuardrailManagedWord extends S.Class<GuardrailManagedWord>(
  "GuardrailManagedWord",
)({
  match: S.String,
  type: S.String,
  action: S.String,
  detected: S.optional(S.Boolean),
}) {}
export const GuardrailManagedWordList = S.Array(GuardrailManagedWord);
export class GuardrailWordPolicyAssessment extends S.Class<GuardrailWordPolicyAssessment>(
  "GuardrailWordPolicyAssessment",
)({
  customWords: GuardrailCustomWordList,
  managedWordLists: GuardrailManagedWordList,
}) {}
export class GuardrailPiiEntityFilter extends S.Class<GuardrailPiiEntityFilter>(
  "GuardrailPiiEntityFilter",
)({
  match: S.String,
  type: S.String,
  action: S.String,
  detected: S.optional(S.Boolean),
}) {}
export const GuardrailPiiEntityFilterList = S.Array(GuardrailPiiEntityFilter);
export class GuardrailRegexFilter extends S.Class<GuardrailRegexFilter>(
  "GuardrailRegexFilter",
)({
  name: S.optional(S.String),
  match: S.optional(S.String),
  regex: S.optional(S.String),
  action: S.String,
  detected: S.optional(S.Boolean),
}) {}
export const GuardrailRegexFilterList = S.Array(GuardrailRegexFilter);
export class GuardrailSensitiveInformationPolicyAssessment extends S.Class<GuardrailSensitiveInformationPolicyAssessment>(
  "GuardrailSensitiveInformationPolicyAssessment",
)({
  piiEntities: GuardrailPiiEntityFilterList,
  regexes: GuardrailRegexFilterList,
}) {}
export class GuardrailContextualGroundingFilter extends S.Class<GuardrailContextualGroundingFilter>(
  "GuardrailContextualGroundingFilter",
)({
  type: S.String,
  threshold: S.Number,
  score: S.Number,
  action: S.String,
  detected: S.optional(S.Boolean),
}) {}
export const GuardrailContextualGroundingFilters = S.Array(
  GuardrailContextualGroundingFilter,
);
export class GuardrailContextualGroundingPolicyAssessment extends S.Class<GuardrailContextualGroundingPolicyAssessment>(
  "GuardrailContextualGroundingPolicyAssessment",
)({ filters: S.optional(GuardrailContextualGroundingFilters) }) {}
export class GuardrailAutomatedReasoningStatement extends S.Class<GuardrailAutomatedReasoningStatement>(
  "GuardrailAutomatedReasoningStatement",
)({ logic: S.optional(S.String), naturalLanguage: S.optional(S.String) }) {}
export const GuardrailAutomatedReasoningStatementList = S.Array(
  GuardrailAutomatedReasoningStatement,
);
export class GuardrailAutomatedReasoningInputTextReference extends S.Class<GuardrailAutomatedReasoningInputTextReference>(
  "GuardrailAutomatedReasoningInputTextReference",
)({ text: S.optional(S.String) }) {}
export const GuardrailAutomatedReasoningInputTextReferenceList = S.Array(
  GuardrailAutomatedReasoningInputTextReference,
);
export class GuardrailAutomatedReasoningTranslation extends S.Class<GuardrailAutomatedReasoningTranslation>(
  "GuardrailAutomatedReasoningTranslation",
)({
  premises: S.optional(GuardrailAutomatedReasoningStatementList),
  claims: S.optional(GuardrailAutomatedReasoningStatementList),
  untranslatedPremises: S.optional(
    GuardrailAutomatedReasoningInputTextReferenceList,
  ),
  untranslatedClaims: S.optional(
    GuardrailAutomatedReasoningInputTextReferenceList,
  ),
  confidence: S.optional(S.Number),
}) {}
export class GuardrailAutomatedReasoningScenario extends S.Class<GuardrailAutomatedReasoningScenario>(
  "GuardrailAutomatedReasoningScenario",
)({ statements: S.optional(GuardrailAutomatedReasoningStatementList) }) {}
export class GuardrailAutomatedReasoningRule extends S.Class<GuardrailAutomatedReasoningRule>(
  "GuardrailAutomatedReasoningRule",
)({
  identifier: S.optional(S.String),
  policyVersionArn: S.optional(S.String),
}) {}
export const GuardrailAutomatedReasoningRuleList = S.Array(
  GuardrailAutomatedReasoningRule,
);
export class GuardrailAutomatedReasoningLogicWarning extends S.Class<GuardrailAutomatedReasoningLogicWarning>(
  "GuardrailAutomatedReasoningLogicWarning",
)({
  type: S.optional(S.String),
  premises: S.optional(GuardrailAutomatedReasoningStatementList),
  claims: S.optional(GuardrailAutomatedReasoningStatementList),
}) {}
export class GuardrailAutomatedReasoningValidFinding extends S.Class<GuardrailAutomatedReasoningValidFinding>(
  "GuardrailAutomatedReasoningValidFinding",
)({
  translation: S.optional(GuardrailAutomatedReasoningTranslation),
  claimsTrueScenario: S.optional(GuardrailAutomatedReasoningScenario),
  supportingRules: S.optional(GuardrailAutomatedReasoningRuleList),
  logicWarning: S.optional(GuardrailAutomatedReasoningLogicWarning),
}) {}
export class GuardrailAutomatedReasoningInvalidFinding extends S.Class<GuardrailAutomatedReasoningInvalidFinding>(
  "GuardrailAutomatedReasoningInvalidFinding",
)({
  translation: S.optional(GuardrailAutomatedReasoningTranslation),
  contradictingRules: S.optional(GuardrailAutomatedReasoningRuleList),
  logicWarning: S.optional(GuardrailAutomatedReasoningLogicWarning),
}) {}
export class GuardrailAutomatedReasoningSatisfiableFinding extends S.Class<GuardrailAutomatedReasoningSatisfiableFinding>(
  "GuardrailAutomatedReasoningSatisfiableFinding",
)({
  translation: S.optional(GuardrailAutomatedReasoningTranslation),
  claimsTrueScenario: S.optional(GuardrailAutomatedReasoningScenario),
  claimsFalseScenario: S.optional(GuardrailAutomatedReasoningScenario),
  logicWarning: S.optional(GuardrailAutomatedReasoningLogicWarning),
}) {}
export class GuardrailAutomatedReasoningImpossibleFinding extends S.Class<GuardrailAutomatedReasoningImpossibleFinding>(
  "GuardrailAutomatedReasoningImpossibleFinding",
)({
  translation: S.optional(GuardrailAutomatedReasoningTranslation),
  contradictingRules: S.optional(GuardrailAutomatedReasoningRuleList),
  logicWarning: S.optional(GuardrailAutomatedReasoningLogicWarning),
}) {}
export const GuardrailAutomatedReasoningTranslationList = S.Array(
  GuardrailAutomatedReasoningTranslation,
);
export class GuardrailAutomatedReasoningTranslationOption extends S.Class<GuardrailAutomatedReasoningTranslationOption>(
  "GuardrailAutomatedReasoningTranslationOption",
)({ translations: S.optional(GuardrailAutomatedReasoningTranslationList) }) {}
export const GuardrailAutomatedReasoningTranslationOptionList = S.Array(
  GuardrailAutomatedReasoningTranslationOption,
);
export const GuardrailAutomatedReasoningDifferenceScenarioList = S.Array(
  GuardrailAutomatedReasoningScenario,
);
export class GuardrailAutomatedReasoningTranslationAmbiguousFinding extends S.Class<GuardrailAutomatedReasoningTranslationAmbiguousFinding>(
  "GuardrailAutomatedReasoningTranslationAmbiguousFinding",
)({
  options: S.optional(GuardrailAutomatedReasoningTranslationOptionList),
  differenceScenarios: S.optional(
    GuardrailAutomatedReasoningDifferenceScenarioList,
  ),
}) {}
export class GuardrailAutomatedReasoningTooComplexFinding extends S.Class<GuardrailAutomatedReasoningTooComplexFinding>(
  "GuardrailAutomatedReasoningTooComplexFinding",
)({}) {}
export class GuardrailAutomatedReasoningNoTranslationsFinding extends S.Class<GuardrailAutomatedReasoningNoTranslationsFinding>(
  "GuardrailAutomatedReasoningNoTranslationsFinding",
)({}) {}
export const GuardrailAutomatedReasoningFinding = S.Union(
  S.Struct({ valid: GuardrailAutomatedReasoningValidFinding }),
  S.Struct({ invalid: GuardrailAutomatedReasoningInvalidFinding }),
  S.Struct({ satisfiable: GuardrailAutomatedReasoningSatisfiableFinding }),
  S.Struct({ impossible: GuardrailAutomatedReasoningImpossibleFinding }),
  S.Struct({
    translationAmbiguous:
      GuardrailAutomatedReasoningTranslationAmbiguousFinding,
  }),
  S.Struct({ tooComplex: GuardrailAutomatedReasoningTooComplexFinding }),
  S.Struct({
    noTranslations: GuardrailAutomatedReasoningNoTranslationsFinding,
  }),
);
export const GuardrailAutomatedReasoningFindingList = S.Array(
  GuardrailAutomatedReasoningFinding,
);
export class GuardrailAutomatedReasoningPolicyAssessment extends S.Class<GuardrailAutomatedReasoningPolicyAssessment>(
  "GuardrailAutomatedReasoningPolicyAssessment",
)({ findings: S.optional(GuardrailAutomatedReasoningFindingList) }) {}
export class GuardrailTextCharactersCoverage extends S.Class<GuardrailTextCharactersCoverage>(
  "GuardrailTextCharactersCoverage",
)({ guarded: S.optional(S.Number), total: S.optional(S.Number) }) {}
export class GuardrailImageCoverage extends S.Class<GuardrailImageCoverage>(
  "GuardrailImageCoverage",
)({ guarded: S.optional(S.Number), total: S.optional(S.Number) }) {}
export class GuardrailCoverage extends S.Class<GuardrailCoverage>(
  "GuardrailCoverage",
)({
  textCharacters: S.optional(GuardrailTextCharactersCoverage),
  images: S.optional(GuardrailImageCoverage),
}) {}
export class GuardrailInvocationMetrics extends S.Class<GuardrailInvocationMetrics>(
  "GuardrailInvocationMetrics",
)({
  guardrailProcessingLatency: S.optional(S.Number),
  usage: S.optional(GuardrailUsage),
  guardrailCoverage: S.optional(GuardrailCoverage),
}) {}
export class AppliedGuardrailDetails extends S.Class<AppliedGuardrailDetails>(
  "AppliedGuardrailDetails",
)({
  guardrailId: S.optional(S.String),
  guardrailVersion: S.optional(S.String),
  guardrailArn: S.optional(S.String),
  guardrailOrigin: S.optional(GuardrailOriginList),
  guardrailOwnership: S.optional(S.String),
}) {}
export class GuardrailAssessment extends S.Class<GuardrailAssessment>(
  "GuardrailAssessment",
)({
  topicPolicy: S.optional(GuardrailTopicPolicyAssessment),
  contentPolicy: S.optional(GuardrailContentPolicyAssessment),
  wordPolicy: S.optional(GuardrailWordPolicyAssessment),
  sensitiveInformationPolicy: S.optional(
    GuardrailSensitiveInformationPolicyAssessment,
  ),
  contextualGroundingPolicy: S.optional(
    GuardrailContextualGroundingPolicyAssessment,
  ),
  automatedReasoningPolicy: S.optional(
    GuardrailAutomatedReasoningPolicyAssessment,
  ),
  invocationMetrics: S.optional(GuardrailInvocationMetrics),
  appliedGuardrailDetails: S.optional(AppliedGuardrailDetails),
}) {}
export const GuardrailAssessmentMap = S.Record({
  key: S.String,
  value: GuardrailAssessment,
});
export const GuardrailAssessmentList = S.Array(GuardrailAssessment);
export const GuardrailAssessmentListMap = S.Record({
  key: S.String,
  value: GuardrailAssessmentList,
});
export class InvokeModelWithBidirectionalStreamResponse extends S.Class<InvokeModelWithBidirectionalStreamResponse>(
  "InvokeModelWithBidirectionalStreamResponse",
)({ body: InvokeModelWithBidirectionalStreamOutput.pipe(T.HttpPayload()) }) {}
export class ContentBlockStartEvent extends S.Class<ContentBlockStartEvent>(
  "ContentBlockStartEvent",
)({ start: ContentBlockStart, contentBlockIndex: S.Number }) {}
export class CitationsDelta extends S.Class<CitationsDelta>("CitationsDelta")({
  title: S.optional(S.String),
  source: S.optional(S.String),
  sourceContent: S.optional(CitationSourceContentListDelta),
  location: S.optional(CitationLocation),
}) {}
export class GuardrailTraceAssessment extends S.Class<GuardrailTraceAssessment>(
  "GuardrailTraceAssessment",
)({
  modelOutput: S.optional(ModelOutputs),
  inputAssessment: S.optional(GuardrailAssessmentMap),
  outputAssessments: S.optional(GuardrailAssessmentListMap),
  actionReason: S.optional(S.String),
}) {}
export const ContentBlockDelta = S.Union(
  S.Struct({ text: S.String }),
  S.Struct({ toolUse: ToolUseBlockDelta }),
  S.Struct({ toolResult: ToolResultBlocksDelta }),
  S.Struct({ reasoningContent: ReasoningContentBlockDelta }),
  S.Struct({ citation: CitationsDelta }),
  S.Struct({ image: ImageBlockDelta }),
);
export class ConverseStreamTrace extends S.Class<ConverseStreamTrace>(
  "ConverseStreamTrace",
)({
  guardrail: S.optional(GuardrailTraceAssessment),
  promptRouter: S.optional(PromptRouterTrace),
}) {}
export class ConverseRequest extends S.Class<ConverseRequest>(
  "ConverseRequest",
)(
  {
    modelId: S.String.pipe(T.HttpLabel("modelId")),
    messages: S.optional(Messages),
    system: S.optional(SystemContentBlocks),
    inferenceConfig: S.optional(InferenceConfiguration),
    toolConfig: S.optional(ToolConfiguration),
    guardrailConfig: S.optional(GuardrailConfiguration),
    additionalModelRequestFields: S.optional(S.Any),
    promptVariables: S.optional(PromptVariableMap),
    additionalModelResponseFieldPaths: S.optional(
      AdditionalModelResponseFieldPaths,
    ),
    requestMetadata: S.optional(RequestMetadata),
    performanceConfig: S.optional(PerformanceConfiguration),
    serviceTier: S.optional(ServiceTier),
  },
  T.all(
    T.Http({ method: "POST", uri: "/model/{modelId}/converse" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ContentBlockDeltaEvent extends S.Class<ContentBlockDeltaEvent>(
  "ContentBlockDeltaEvent",
)({ delta: ContentBlockDelta, contentBlockIndex: S.Number }) {}
export class ConverseStreamMetadataEvent extends S.Class<ConverseStreamMetadataEvent>(
  "ConverseStreamMetadataEvent",
)({
  usage: TokenUsage,
  metrics: ConverseStreamMetrics,
  trace: S.optional(ConverseStreamTrace),
  performanceConfig: S.optional(PerformanceConfiguration),
  serviceTier: S.optional(ServiceTier),
}) {}
export const ConverseStreamOutput = T.EventStream(
  S.Union(
    S.Struct({ messageStart: MessageStartEvent }),
    S.Struct({ contentBlockStart: ContentBlockStartEvent }),
    S.Struct({ contentBlockDelta: ContentBlockDeltaEvent }),
    S.Struct({ contentBlockStop: ContentBlockStopEvent }),
    S.Struct({ messageStop: MessageStopEvent }),
    S.Struct({ metadata: ConverseStreamMetadataEvent }),
    S.Struct({
      internalServerException: S.suspend(() => InternalServerException),
    }),
    S.Struct({
      modelStreamErrorException: S.suspend(() => ModelStreamErrorException),
    }),
    S.Struct({ validationException: S.suspend(() => ValidationException) }),
    S.Struct({ throttlingException: S.suspend(() => ThrottlingException) }),
    S.Struct({
      serviceUnavailableException: S.suspend(() => ServiceUnavailableException),
    }),
  ),
);
export class ConverseStreamResponse extends S.Class<ConverseStreamResponse>(
  "ConverseStreamResponse",
)({ stream: S.optional(ConverseStreamOutput).pipe(T.HttpPayload()) }) {}
export const ConverseOutput = S.Union(S.Struct({ message: Message }));
export class ConverseMetrics extends S.Class<ConverseMetrics>(
  "ConverseMetrics",
)({ latencyMs: S.Number }) {}
export class ConverseTrace extends S.Class<ConverseTrace>("ConverseTrace")({
  guardrail: S.optional(GuardrailTraceAssessment),
  promptRouter: S.optional(PromptRouterTrace),
}) {}
export class ConverseResponse extends S.Class<ConverseResponse>(
  "ConverseResponse",
)({
  output: ConverseOutput,
  stopReason: S.String,
  usage: TokenUsage,
  metrics: ConverseMetrics,
  additionalModelResponseFields: S.optional(S.Any),
  trace: S.optional(ConverseTrace),
  performanceConfig: S.optional(PerformanceConfiguration),
  serviceTier: S.optional(ServiceTier),
}) {}
export class ApplyGuardrailResponse extends S.Class<ApplyGuardrailResponse>(
  "ApplyGuardrailResponse",
)({
  usage: GuardrailUsage,
  action: S.String,
  actionReason: S.optional(S.String),
  outputs: GuardrailOutputContentList,
  assessments: GuardrailAssessmentList,
  guardrailCoverage: S.optional(GuardrailCoverage),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class ModelErrorException extends S.TaggedError<ModelErrorException>()(
  "ModelErrorException",
  {
    message: S.optional(S.String),
    originalStatusCode: S.optional(S.Number),
    resourceName: S.optional(S.String),
  },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ModelNotReadyException extends S.TaggedError<ModelNotReadyException>()(
  "ModelNotReadyException",
  { message: S.optional(S.String) },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ModelTimeoutException extends S.TaggedError<ModelTimeoutException>()(
  "ModelTimeoutException",
  { message: S.optional(S.String) },
) {}
export class ModelStreamErrorException extends S.TaggedError<ModelStreamErrorException>()(
  "ModelStreamErrorException",
  {
    message: S.optional(S.String),
    originalStatusCode: S.optional(S.Number),
    originalMessage: S.optional(S.String),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieve information about an asynchronous invocation.
 */
export const getAsyncInvoke = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAsyncInvokeRequest,
  output: GetAsyncInvokeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists asynchronous invocations.
 */
export const listAsyncInvokes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAsyncInvokesRequest,
  output: ListAsyncInvokesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the token count for a given inference request. This operation helps you estimate token usage before sending requests to foundation models by returning the token count that would be used if the same input were sent to the model in an inference request.
 *
 * Token counting is model-specific because different models use different tokenization strategies. The token count returned by this operation will match the token count that would be charged if the same input were sent to the model in an `InvokeModel` or `Converse` request.
 *
 * You can use this operation to:
 *
 * - Estimate costs before sending inference requests.
 *
 * - Optimize prompts to fit within token limits.
 *
 * - Plan for token usage in your applications.
 *
 * This operation accepts the same input formats as `InvokeModel` and `Converse`, allowing you to count tokens for both raw text inputs and structured conversation formats.
 *
 * The following operations are related to `CountTokens`:
 *
 * - InvokeModel - Sends inference requests to foundation models
 *
 * - Converse - Sends conversation-based inference requests to foundation models
 */
export const countTokens = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CountTokensRequest,
  output: CountTokensResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts an asynchronous invocation.
 *
 * This operation requires permission for the `bedrock:InvokeModel` action.
 *
 * To deny all inference access to resources that you specify in the modelId field, you need to deny access to the `bedrock:InvokeModel` and `bedrock:InvokeModelWithResponseStream` actions. Doing this also denies access to the resource through the Converse API actions (Converse and ConverseStream). For more information see Deny access for inference on specific models.
 */
export const startAsyncInvoke = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAsyncInvokeRequest,
  output: StartAsyncInvokeResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Invokes the specified Amazon Bedrock model to run inference using the prompt and inference parameters provided in the request body. You use model inference to generate text, images, and embeddings.
 *
 * For example code, see *Invoke model code examples* in the *Amazon Bedrock User Guide*.
 *
 * This operation requires permission for the `bedrock:InvokeModel` action.
 *
 * To deny all inference access to resources that you specify in the modelId field, you need to deny access to the `bedrock:InvokeModel` and `bedrock:InvokeModelWithResponseStream` actions. Doing this also denies access to the resource through the Converse API actions (Converse and ConverseStream). For more information see Deny access for inference on specific models.
 *
 * For troubleshooting some of the common errors you might encounter when using the `InvokeModel` API, see Troubleshooting Amazon Bedrock API Error Codes in the Amazon Bedrock User Guide
 */
export const invokeModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeModelRequest,
  output: InvokeModelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ModelErrorException,
    ModelNotReadyException,
    ModelTimeoutException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Invoke the specified Amazon Bedrock model to run inference using the prompt and inference parameters provided in the request body. The response is returned in a stream.
 *
 * To see if a model supports streaming, call GetFoundationModel and check the `responseStreamingSupported` field in the response.
 *
 * The CLI doesn't support streaming operations in Amazon Bedrock, including `InvokeModelWithResponseStream`.
 *
 * For example code, see *Invoke model with streaming code example* in the *Amazon Bedrock User Guide*.
 *
 * This operation requires permissions to perform the `bedrock:InvokeModelWithResponseStream` action.
 *
 * To deny all inference access to resources that you specify in the modelId field, you need to deny access to the `bedrock:InvokeModel` and `bedrock:InvokeModelWithResponseStream` actions. Doing this also denies access to the resource through the Converse API actions (Converse and ConverseStream). For more information see Deny access for inference on specific models.
 *
 * For troubleshooting some of the common errors you might encounter when using the `InvokeModelWithResponseStream` API, see Troubleshooting Amazon Bedrock API Error Codes in the Amazon Bedrock User Guide
 */
export const invokeModelWithResponseStream =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: InvokeModelWithResponseStreamRequest,
    output: InvokeModelWithResponseStreamResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ModelErrorException,
      ModelNotReadyException,
      ModelStreamErrorException,
      ModelTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Invoke the specified Amazon Bedrock model to run inference using the bidirectional stream. The response is returned in a stream that remains open for 8 minutes. A single session can contain multiple prompts and responses from the model. The prompts to the model are provided as audio files and the model's responses are spoken back to the user and transcribed.
 *
 * It is possible for users to interrupt the model's response with a new prompt, which will halt the response speech. The model will retain contextual awareness of the conversation while pivoting to respond to the new prompt.
 */
export const invokeModelWithBidirectionalStream =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: InvokeModelWithBidirectionalStreamRequest,
    output: InvokeModelWithBidirectionalStreamResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ModelErrorException,
      ModelNotReadyException,
      ModelStreamErrorException,
      ModelTimeoutException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Sends messages to the specified Amazon Bedrock model and returns the response in a stream. `ConverseStream` provides a consistent API that works with all Amazon Bedrock models that support messages. This allows you to write code once and use it with different models. Should a model have unique inference parameters, you can also pass those unique parameters to the model.
 *
 * To find out if a model supports streaming, call GetFoundationModel and check the `responseStreamingSupported` field in the response.
 *
 * The CLI doesn't support streaming operations in Amazon Bedrock, including `ConverseStream`.
 *
 * Amazon Bedrock doesn't store any text, images, or documents that you provide as content. The data is only used to generate the response.
 *
 * You can submit a prompt by including it in the `messages` field, specifying the `modelId` of a foundation model or inference profile to run inference on it, and including any other fields that are relevant to your use case.
 *
 * You can also submit a prompt from Prompt management by specifying the ARN of the prompt version and including a map of variables to values in the `promptVariables` field. You can append more messages to the prompt by using the `messages` field. If you use a prompt from Prompt management, you can't include the following fields in the request: `additionalModelRequestFields`, `inferenceConfig`, `system`, or `toolConfig`. Instead, these fields must be defined through Prompt management. For more information, see Use a prompt from Prompt management.
 *
 * For information about the Converse API, see *Use the Converse API* in the *Amazon Bedrock User Guide*. To use a guardrail, see *Use a guardrail with the Converse API* in the *Amazon Bedrock User Guide*. To use a tool with a model, see *Tool use (Function calling)* in the *Amazon Bedrock User Guide*
 *
 * For example code, see *Conversation streaming example* in the *Amazon Bedrock User Guide*.
 *
 * This operation requires permission for the `bedrock:InvokeModelWithResponseStream` action.
 *
 * To deny all inference access to resources that you specify in the modelId field, you need to deny access to the `bedrock:InvokeModel` and `bedrock:InvokeModelWithResponseStream` actions. Doing this also denies access to the resource through the base inference actions (InvokeModel and InvokeModelWithResponseStream). For more information see Deny access for inference on specific models.
 *
 * For troubleshooting some of the common errors you might encounter when using the `ConverseStream` API, see Troubleshooting Amazon Bedrock API Error Codes in the Amazon Bedrock User Guide
 */
export const converseStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConverseStreamRequest,
  output: ConverseStreamResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ModelErrorException,
    ModelNotReadyException,
    ModelTimeoutException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends messages to the specified Amazon Bedrock model. `Converse` provides a consistent interface that works with all models that support messages. This allows you to write code once and use it with different models. If a model has unique inference parameters, you can also pass those unique parameters to the model.
 *
 * Amazon Bedrock doesn't store any text, images, or documents that you provide as content. The data is only used to generate the response.
 *
 * You can submit a prompt by including it in the `messages` field, specifying the `modelId` of a foundation model or inference profile to run inference on it, and including any other fields that are relevant to your use case.
 *
 * You can also submit a prompt from Prompt management by specifying the ARN of the prompt version and including a map of variables to values in the `promptVariables` field. You can append more messages to the prompt by using the `messages` field. If you use a prompt from Prompt management, you can't include the following fields in the request: `additionalModelRequestFields`, `inferenceConfig`, `system`, or `toolConfig`. Instead, these fields must be defined through Prompt management. For more information, see Use a prompt from Prompt management.
 *
 * For information about the Converse API, see *Use the Converse API* in the *Amazon Bedrock User Guide*. To use a guardrail, see *Use a guardrail with the Converse API* in the *Amazon Bedrock User Guide*. To use a tool with a model, see *Tool use (Function calling)* in the *Amazon Bedrock User Guide*
 *
 * For example code, see *Converse API examples* in the *Amazon Bedrock User Guide*.
 *
 * This operation requires permission for the `bedrock:InvokeModel` action.
 *
 * To deny all inference access to resources that you specify in the modelId field, you need to deny access to the `bedrock:InvokeModel` and `bedrock:InvokeModelWithResponseStream` actions. Doing this also denies access to the resource through the base inference actions (InvokeModel and InvokeModelWithResponseStream). For more information see Deny access for inference on specific models.
 *
 * For troubleshooting some of the common errors you might encounter when using the `Converse` API, see Troubleshooting Amazon Bedrock API Error Codes in the Amazon Bedrock User Guide
 */
export const converse = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConverseRequest,
  output: ConverseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ModelErrorException,
    ModelNotReadyException,
    ModelTimeoutException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The action to apply a guardrail.
 *
 * For troubleshooting some of the common errors you might encounter when using the `ApplyGuardrail` API, see Troubleshooting Amazon Bedrock API Error Codes in the Amazon Bedrock User Guide
 */
export const applyGuardrail = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ApplyGuardrailRequest,
  output: ApplyGuardrailResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Connect Contact Lens",
  serviceShapeName: "AmazonConnectContactLens",
});
const auth = T.AwsAuthSigv4({ name: "connect" });
const ver = T.ServiceVersion("2020-08-21");
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
                        url: "https://contact-lens-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://contact-lens-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://contact-lens.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://contact-lens.{Region}.{PartitionResult#dnsSuffix}",
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
export class ListRealtimeContactAnalysisSegmentsRequest extends S.Class<ListRealtimeContactAnalysisSegmentsRequest>(
  "ListRealtimeContactAnalysisSegmentsRequest",
)(
  {
    InstanceId: S.String,
    ContactId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/realtime-contact-analysis/analysis-segments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const MatchedCategories = S.Array(S.String);
export class PostContactSummary extends S.Class<PostContactSummary>(
  "PostContactSummary",
)({
  Content: S.optional(S.String),
  Status: S.String,
  FailureCode: S.optional(S.String),
}) {}
export class CharacterOffsets extends S.Class<CharacterOffsets>(
  "CharacterOffsets",
)({ BeginOffsetChar: S.Number, EndOffsetChar: S.Number }) {}
export class IssueDetected extends S.Class<IssueDetected>("IssueDetected")({
  CharacterOffsets: CharacterOffsets,
}) {}
export const IssuesDetected = S.Array(IssueDetected);
export class PointOfInterest extends S.Class<PointOfInterest>(
  "PointOfInterest",
)({ BeginOffsetMillis: S.Number, EndOffsetMillis: S.Number }) {}
export const PointsOfInterest = S.Array(PointOfInterest);
export class Transcript extends S.Class<Transcript>("Transcript")({
  Id: S.String,
  ParticipantId: S.String,
  ParticipantRole: S.String,
  Content: S.String,
  BeginOffsetMillis: S.Number,
  EndOffsetMillis: S.Number,
  Sentiment: S.optional(S.String),
  IssuesDetected: S.optional(IssuesDetected),
}) {}
export class CategoryDetails extends S.Class<CategoryDetails>(
  "CategoryDetails",
)({ PointsOfInterest: PointsOfInterest }) {}
export const MatchedDetails = S.Record({
  key: S.String,
  value: CategoryDetails,
});
export class Categories extends S.Class<Categories>("Categories")({
  MatchedCategories: MatchedCategories,
  MatchedDetails: MatchedDetails,
}) {}
export class RealtimeContactAnalysisSegment extends S.Class<RealtimeContactAnalysisSegment>(
  "RealtimeContactAnalysisSegment",
)({
  Transcript: S.optional(Transcript),
  Categories: S.optional(Categories),
  PostContactSummary: S.optional(PostContactSummary),
}) {}
export const RealtimeContactAnalysisSegments = S.Array(
  RealtimeContactAnalysisSegment,
);
export class ListRealtimeContactAnalysisSegmentsResponse extends S.Class<ListRealtimeContactAnalysisSegmentsResponse>(
  "ListRealtimeContactAnalysisSegmentsResponse",
)({
  Segments: RealtimeContactAnalysisSegments,
  NextToken: S.optional(S.String),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Provides a list of analysis segments for a real-time analysis session.
 */
export const listRealtimeContactAnalysisSegments =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListRealtimeContactAnalysisSegmentsRequest,
    output: ListRealtimeContactAnalysisSegmentsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));

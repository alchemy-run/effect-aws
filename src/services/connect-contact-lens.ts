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
  sdkId: "Connect Contact Lens",
  serviceShapeName: "AmazonConnectContactLens",
});
const auth = T.AwsAuthSigv4({ name: "connect" });
const ver = T.ServiceVersion("2020-08-21");
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
              `https://contact-lens-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://contact-lens-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://contact-lens.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://contact-lens.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type InstanceId = string;
export type ContactId = string;
export type MaxResults = number;
export type NextToken = string;
export type TranscriptId = string;
export type ParticipantId = string;
export type ParticipantRole = string;
export type TranscriptContent = string;
export type OffsetMillis = number;
export type CategoryName = string;
export type PostContactSummaryContent = string;
export type CharacterOffset = number;
export type Message = string;

//# Schemas
export interface ListRealtimeContactAnalysisSegmentsRequest {
  InstanceId: string;
  ContactId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListRealtimeContactAnalysisSegmentsRequest = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    ContactId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListRealtimeContactAnalysisSegmentsRequest",
}) as any as S.Schema<ListRealtimeContactAnalysisSegmentsRequest>;
export type MatchedCategories = string[];
export const MatchedCategories = S.Array(S.String);
export interface PostContactSummary {
  Content?: string;
  Status: string;
  FailureCode?: string;
}
export const PostContactSummary = S.suspend(() =>
  S.Struct({
    Content: S.optional(S.String),
    Status: S.String,
    FailureCode: S.optional(S.String),
  }),
).annotations({
  identifier: "PostContactSummary",
}) as any as S.Schema<PostContactSummary>;
export interface CharacterOffsets {
  BeginOffsetChar: number;
  EndOffsetChar: number;
}
export const CharacterOffsets = S.suspend(() =>
  S.Struct({ BeginOffsetChar: S.Number, EndOffsetChar: S.Number }),
).annotations({
  identifier: "CharacterOffsets",
}) as any as S.Schema<CharacterOffsets>;
export interface IssueDetected {
  CharacterOffsets: CharacterOffsets;
}
export const IssueDetected = S.suspend(() =>
  S.Struct({ CharacterOffsets: CharacterOffsets }),
).annotations({
  identifier: "IssueDetected",
}) as any as S.Schema<IssueDetected>;
export type IssuesDetected = IssueDetected[];
export const IssuesDetected = S.Array(IssueDetected);
export interface PointOfInterest {
  BeginOffsetMillis: number;
  EndOffsetMillis: number;
}
export const PointOfInterest = S.suspend(() =>
  S.Struct({ BeginOffsetMillis: S.Number, EndOffsetMillis: S.Number }),
).annotations({
  identifier: "PointOfInterest",
}) as any as S.Schema<PointOfInterest>;
export type PointsOfInterest = PointOfInterest[];
export const PointsOfInterest = S.Array(PointOfInterest);
export interface Transcript {
  Id: string;
  ParticipantId: string;
  ParticipantRole: string;
  Content: string;
  BeginOffsetMillis: number;
  EndOffsetMillis: number;
  Sentiment?: string;
  IssuesDetected?: IssuesDetected;
}
export const Transcript = S.suspend(() =>
  S.Struct({
    Id: S.String,
    ParticipantId: S.String,
    ParticipantRole: S.String,
    Content: S.String,
    BeginOffsetMillis: S.Number,
    EndOffsetMillis: S.Number,
    Sentiment: S.optional(S.String),
    IssuesDetected: S.optional(IssuesDetected),
  }),
).annotations({ identifier: "Transcript" }) as any as S.Schema<Transcript>;
export interface CategoryDetails {
  PointsOfInterest: PointsOfInterest;
}
export const CategoryDetails = S.suspend(() =>
  S.Struct({ PointsOfInterest: PointsOfInterest }),
).annotations({
  identifier: "CategoryDetails",
}) as any as S.Schema<CategoryDetails>;
export type MatchedDetails = { [key: string]: CategoryDetails };
export const MatchedDetails = S.Record({
  key: S.String,
  value: CategoryDetails,
});
export interface Categories {
  MatchedCategories: MatchedCategories;
  MatchedDetails: MatchedDetails;
}
export const Categories = S.suspend(() =>
  S.Struct({
    MatchedCategories: MatchedCategories,
    MatchedDetails: MatchedDetails,
  }),
).annotations({ identifier: "Categories" }) as any as S.Schema<Categories>;
export interface RealtimeContactAnalysisSegment {
  Transcript?: Transcript;
  Categories?: Categories;
  PostContactSummary?: PostContactSummary;
}
export const RealtimeContactAnalysisSegment = S.suspend(() =>
  S.Struct({
    Transcript: S.optional(Transcript),
    Categories: S.optional(Categories),
    PostContactSummary: S.optional(PostContactSummary),
  }),
).annotations({
  identifier: "RealtimeContactAnalysisSegment",
}) as any as S.Schema<RealtimeContactAnalysisSegment>;
export type RealtimeContactAnalysisSegments = RealtimeContactAnalysisSegment[];
export const RealtimeContactAnalysisSegments = S.Array(
  RealtimeContactAnalysisSegment,
);
export interface ListRealtimeContactAnalysisSegmentsResponse {
  Segments: RealtimeContactAnalysisSegments;
  NextToken?: string;
}
export const ListRealtimeContactAnalysisSegmentsResponse = S.suspend(() =>
  S.Struct({
    Segments: RealtimeContactAnalysisSegments,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRealtimeContactAnalysisSegmentsResponse",
}) as any as S.Schema<ListRealtimeContactAnalysisSegmentsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Provides a list of analysis segments for a real-time analysis session.
 */
export const listRealtimeContactAnalysisSegments: {
  (
    input: ListRealtimeContactAnalysisSegmentsRequest,
  ): Effect.Effect<
    ListRealtimeContactAnalysisSegmentsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRealtimeContactAnalysisSegmentsRequest,
  ) => Stream.Stream<
    ListRealtimeContactAnalysisSegmentsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRealtimeContactAnalysisSegmentsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceException
    | InvalidRequestException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRealtimeContactAnalysisSegmentsRequest,
  output: ListRealtimeContactAnalysisSegmentsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));

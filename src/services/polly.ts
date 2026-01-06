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
const ns = T.XmlNamespace("http://polly.amazonaws.com/doc/v1");
const svc = T.AwsApiService({ sdkId: "Polly", serviceShapeName: "Parrot_v1" });
const auth = T.AwsAuthSigv4({ name: "polly" });
const ver = T.ServiceVersion("2016-06-10");
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
                        url: "https://polly-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://polly-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://polly.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://polly.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type LexiconName = string;
export type NextToken = string;
export type TaskId = string;
export type MaxResults = number;
export type LexiconContent = string | Redacted.Redacted<string>;
export type OutputS3BucketName = string;
export type OutputS3KeyPrefix = string;
export type SampleRate = string;
export type SnsTopicArn = string;
export type Text = string;
export type ErrorMessage = string;
export type ContentType = string;
export type RequestCharacters = number;
export type LanguageName = string;
export type VoiceName = string;
export type Alphabet = string;
export type LexiconArn = string;
export type LexemesCount = number;
export type Size = number;
export type TaskStatusReason = string;
export type OutputUri = string;

//# Schemas
export type LexiconNameList = string[];
export const LexiconNameList = S.Array(S.String);
export type SpeechMarkTypeList = string[];
export const SpeechMarkTypeList = S.Array(S.String);
export interface DeleteLexiconInput {
  Name: string;
}
export const DeleteLexiconInput = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v1/lexicons/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLexiconInput",
}) as any as S.Schema<DeleteLexiconInput>;
export interface DeleteLexiconOutput {}
export const DeleteLexiconOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLexiconOutput",
}) as any as S.Schema<DeleteLexiconOutput>;
export interface DescribeVoicesInput {
  Engine?: string;
  LanguageCode?: string;
  IncludeAdditionalLanguageCodes?: boolean;
  NextToken?: string;
}
export const DescribeVoicesInput = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String).pipe(T.HttpQuery("Engine")),
    LanguageCode: S.optional(S.String).pipe(T.HttpQuery("LanguageCode")),
    IncludeAdditionalLanguageCodes: S.optional(S.Boolean).pipe(
      T.HttpQuery("IncludeAdditionalLanguageCodes"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/voices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeVoicesInput",
}) as any as S.Schema<DescribeVoicesInput>;
export interface GetLexiconInput {
  Name: string;
}
export const GetLexiconInput = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/lexicons/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLexiconInput",
}) as any as S.Schema<GetLexiconInput>;
export interface GetSpeechSynthesisTaskInput {
  TaskId: string;
}
export const GetSpeechSynthesisTaskInput = S.suspend(() =>
  S.Struct({ TaskId: S.String.pipe(T.HttpLabel("TaskId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/synthesisTasks/{TaskId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSpeechSynthesisTaskInput",
}) as any as S.Schema<GetSpeechSynthesisTaskInput>;
export interface ListLexiconsInput {
  NextToken?: string;
}
export const ListLexiconsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/lexicons" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLexiconsInput",
}) as any as S.Schema<ListLexiconsInput>;
export interface ListSpeechSynthesisTasksInput {
  MaxResults?: number;
  NextToken?: string;
  Status?: string;
}
export const ListSpeechSynthesisTasksInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    Status: S.optional(S.String).pipe(T.HttpQuery("Status")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/synthesisTasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSpeechSynthesisTasksInput",
}) as any as S.Schema<ListSpeechSynthesisTasksInput>;
export interface PutLexiconInput {
  Name: string;
  Content: string | Redacted.Redacted<string>;
}
export const PutLexiconInput = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Content: SensitiveString,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "PUT", uri: "/v1/lexicons/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutLexiconInput",
}) as any as S.Schema<PutLexiconInput>;
export interface PutLexiconOutput {}
export const PutLexiconOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutLexiconOutput",
}) as any as S.Schema<PutLexiconOutput>;
export interface StartSpeechSynthesisTaskInput {
  Engine?: string;
  LanguageCode?: string;
  LexiconNames?: LexiconNameList;
  OutputFormat: string;
  OutputS3BucketName: string;
  OutputS3KeyPrefix?: string;
  SampleRate?: string;
  SnsTopicArn?: string;
  SpeechMarkTypes?: SpeechMarkTypeList;
  Text: string;
  TextType?: string;
  VoiceId: string;
}
export const StartSpeechSynthesisTaskInput = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    LexiconNames: S.optional(LexiconNameList),
    OutputFormat: S.String,
    OutputS3BucketName: S.String,
    OutputS3KeyPrefix: S.optional(S.String),
    SampleRate: S.optional(S.String),
    SnsTopicArn: S.optional(S.String),
    SpeechMarkTypes: S.optional(SpeechMarkTypeList),
    Text: S.String,
    TextType: S.optional(S.String),
    VoiceId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/synthesisTasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartSpeechSynthesisTaskInput",
}) as any as S.Schema<StartSpeechSynthesisTaskInput>;
export interface SynthesizeSpeechInput {
  Engine?: string;
  LanguageCode?: string;
  LexiconNames?: LexiconNameList;
  OutputFormat: string;
  SampleRate?: string;
  SpeechMarkTypes?: SpeechMarkTypeList;
  Text: string;
  TextType?: string;
  VoiceId: string;
}
export const SynthesizeSpeechInput = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    LexiconNames: S.optional(LexiconNameList),
    OutputFormat: S.String,
    SampleRate: S.optional(S.String),
    SpeechMarkTypes: S.optional(SpeechMarkTypeList),
    Text: S.String,
    TextType: S.optional(S.String),
    VoiceId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/speech" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SynthesizeSpeechInput",
}) as any as S.Schema<SynthesizeSpeechInput>;
export interface SynthesisTask {
  Engine?: string;
  TaskId?: string;
  TaskStatus?: string;
  TaskStatusReason?: string;
  OutputUri?: string;
  CreationTime?: Date;
  RequestCharacters?: number;
  SnsTopicArn?: string;
  LexiconNames?: LexiconNameList;
  OutputFormat?: string;
  SampleRate?: string;
  SpeechMarkTypes?: SpeechMarkTypeList;
  TextType?: string;
  VoiceId?: string;
  LanguageCode?: string;
}
export const SynthesisTask = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    TaskId: S.optional(S.String),
    TaskStatus: S.optional(S.String),
    TaskStatusReason: S.optional(S.String),
    OutputUri: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RequestCharacters: S.optional(S.Number),
    SnsTopicArn: S.optional(S.String),
    LexiconNames: S.optional(LexiconNameList),
    OutputFormat: S.optional(S.String),
    SampleRate: S.optional(S.String),
    SpeechMarkTypes: S.optional(SpeechMarkTypeList),
    TextType: S.optional(S.String),
    VoiceId: S.optional(S.String),
    LanguageCode: S.optional(S.String),
  }),
).annotations({
  identifier: "SynthesisTask",
}) as any as S.Schema<SynthesisTask>;
export type SynthesisTasks = SynthesisTask[];
export const SynthesisTasks = S.Array(SynthesisTask);
export interface ListSpeechSynthesisTasksOutput {
  NextToken?: string;
  SynthesisTasks?: SynthesisTasks;
}
export const ListSpeechSynthesisTasksOutput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    SynthesisTasks: S.optional(SynthesisTasks),
  }).pipe(ns),
).annotations({
  identifier: "ListSpeechSynthesisTasksOutput",
}) as any as S.Schema<ListSpeechSynthesisTasksOutput>;
export interface StartSpeechSynthesisTaskOutput {
  SynthesisTask?: SynthesisTask;
}
export const StartSpeechSynthesisTaskOutput = S.suspend(() =>
  S.Struct({ SynthesisTask: S.optional(SynthesisTask) }).pipe(ns),
).annotations({
  identifier: "StartSpeechSynthesisTaskOutput",
}) as any as S.Schema<StartSpeechSynthesisTaskOutput>;
export interface SynthesizeSpeechOutput {
  AudioStream?: T.StreamingOutputBody;
  ContentType?: string;
  RequestCharacters?: number;
}
export const SynthesizeSpeechOutput = S.suspend(() =>
  S.Struct({
    AudioStream: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    RequestCharacters: S.optional(S.Number).pipe(
      T.HttpHeader("x-amzn-RequestCharacters"),
    ),
  }).pipe(ns),
).annotations({
  identifier: "SynthesizeSpeechOutput",
}) as any as S.Schema<SynthesizeSpeechOutput>;
export type LanguageCodeList = string[];
export const LanguageCodeList = S.Array(S.String);
export type EngineList = string[];
export const EngineList = S.Array(S.String);
export interface Voice {
  Gender?: string;
  Id?: string;
  LanguageCode?: string;
  LanguageName?: string;
  Name?: string;
  AdditionalLanguageCodes?: LanguageCodeList;
  SupportedEngines?: EngineList;
}
export const Voice = S.suspend(() =>
  S.Struct({
    Gender: S.optional(S.String),
    Id: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    LanguageName: S.optional(S.String),
    Name: S.optional(S.String),
    AdditionalLanguageCodes: S.optional(LanguageCodeList),
    SupportedEngines: S.optional(EngineList),
  }),
).annotations({ identifier: "Voice" }) as any as S.Schema<Voice>;
export type VoiceList = Voice[];
export const VoiceList = S.Array(Voice);
export interface Lexicon {
  Content?: string | Redacted.Redacted<string>;
  Name?: string;
}
export const Lexicon = S.suspend(() =>
  S.Struct({
    Content: S.optional(SensitiveString),
    Name: S.optional(S.String),
  }),
).annotations({ identifier: "Lexicon" }) as any as S.Schema<Lexicon>;
export interface LexiconAttributes {
  Alphabet?: string;
  LanguageCode?: string;
  LastModified?: Date;
  LexiconArn?: string;
  LexemesCount?: number;
  Size?: number;
}
export const LexiconAttributes = S.suspend(() =>
  S.Struct({
    Alphabet: S.optional(S.String),
    LanguageCode: S.optional(S.String),
    LastModified: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LexiconArn: S.optional(S.String),
    LexemesCount: S.optional(S.Number),
    Size: S.optional(S.Number),
  }),
).annotations({
  identifier: "LexiconAttributes",
}) as any as S.Schema<LexiconAttributes>;
export interface LexiconDescription {
  Name?: string;
  Attributes?: LexiconAttributes;
}
export const LexiconDescription = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Attributes: S.optional(LexiconAttributes),
  }),
).annotations({
  identifier: "LexiconDescription",
}) as any as S.Schema<LexiconDescription>;
export type LexiconDescriptionList = LexiconDescription[];
export const LexiconDescriptionList = S.Array(LexiconDescription);
export interface DescribeVoicesOutput {
  Voices?: VoiceList;
  NextToken?: string;
}
export const DescribeVoicesOutput = S.suspend(() =>
  S.Struct({
    Voices: S.optional(VoiceList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeVoicesOutput",
}) as any as S.Schema<DescribeVoicesOutput>;
export interface GetLexiconOutput {
  Lexicon?: Lexicon;
  LexiconAttributes?: LexiconAttributes;
}
export const GetLexiconOutput = S.suspend(() =>
  S.Struct({
    Lexicon: S.optional(Lexicon),
    LexiconAttributes: S.optional(LexiconAttributes),
  }).pipe(ns),
).annotations({
  identifier: "GetLexiconOutput",
}) as any as S.Schema<GetLexiconOutput>;
export interface GetSpeechSynthesisTaskOutput {
  SynthesisTask?: SynthesisTask;
}
export const GetSpeechSynthesisTaskOutput = S.suspend(() =>
  S.Struct({ SynthesisTask: S.optional(SynthesisTask) }).pipe(ns),
).annotations({
  identifier: "GetSpeechSynthesisTaskOutput",
}) as any as S.Schema<GetSpeechSynthesisTaskOutput>;
export interface ListLexiconsOutput {
  Lexicons?: LexiconDescriptionList;
  NextToken?: string;
}
export const ListLexiconsOutput = S.suspend(() =>
  S.Struct({
    Lexicons: S.optional(LexiconDescriptionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLexiconsOutput",
}) as any as S.Schema<ListLexiconsOutput>;

//# Errors
export class LexiconNotFoundException extends S.TaggedError<LexiconNotFoundException>()(
  "LexiconNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidLexiconException extends S.TaggedError<InvalidLexiconException>()(
  "InvalidLexiconException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceFailureException extends S.TaggedError<ServiceFailureException>()(
  "ServiceFailureException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LexiconSizeExceededException extends S.TaggedError<LexiconSizeExceededException>()(
  "LexiconSizeExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class EngineNotSupportedException extends S.TaggedError<EngineNotSupportedException>()(
  "EngineNotSupportedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidTaskIdException extends S.TaggedError<InvalidTaskIdException>()(
  "InvalidTaskIdException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MaxLexemeLengthExceededException extends S.TaggedError<MaxLexemeLengthExceededException>()(
  "MaxLexemeLengthExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidS3BucketException extends S.TaggedError<InvalidS3BucketException>()(
  "InvalidS3BucketException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidSampleRateException extends S.TaggedError<InvalidSampleRateException>()(
  "InvalidSampleRateException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SynthesisTaskNotFoundException extends S.TaggedError<SynthesisTaskNotFoundException>()(
  "SynthesisTaskNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MaxLexiconsNumberExceededException extends S.TaggedError<MaxLexiconsNumberExceededException>()(
  "MaxLexiconsNumberExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidS3KeyException extends S.TaggedError<InvalidS3KeyException>()(
  "InvalidS3KeyException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidSsmlException extends S.TaggedError<InvalidSsmlException>()(
  "InvalidSsmlException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedPlsAlphabetException extends S.TaggedError<UnsupportedPlsAlphabetException>()(
  "UnsupportedPlsAlphabetException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidSnsTopicArnException extends S.TaggedError<InvalidSnsTopicArnException>()(
  "InvalidSnsTopicArnException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LanguageNotSupportedException extends S.TaggedError<LanguageNotSupportedException>()(
  "LanguageNotSupportedException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedPlsLanguageException extends S.TaggedError<UnsupportedPlsLanguageException>()(
  "UnsupportedPlsLanguageException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MarksNotSupportedForFormatException extends S.TaggedError<MarksNotSupportedForFormatException>()(
  "MarksNotSupportedForFormatException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SsmlMarksNotSupportedForTextTypeException extends S.TaggedError<SsmlMarksNotSupportedForTextTypeException>()(
  "SsmlMarksNotSupportedForTextTypeException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TextLengthExceededException extends S.TaggedError<TextLengthExceededException>()(
  "TextLengthExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes the specified pronunciation lexicon stored in an Amazon Web Services Region. A lexicon which has been deleted is not available for
 * speech synthesis, nor is it possible to retrieve it using either the
 * `GetLexicon` or `ListLexicon` APIs.
 *
 * For more information, see Managing Lexicons.
 */
export const deleteLexicon: (
  input: DeleteLexiconInput,
) => Effect.Effect<
  DeleteLexiconOutput,
  LexiconNotFoundException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLexiconInput,
  output: DeleteLexiconOutput,
  errors: [LexiconNotFoundException, ServiceFailureException],
}));
/**
 * Returns the content of the specified pronunciation lexicon stored
 * in an Amazon Web Services Region. For more information, see Managing Lexicons.
 */
export const getLexicon: (
  input: GetLexiconInput,
) => Effect.Effect<
  GetLexiconOutput,
  LexiconNotFoundException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLexiconInput,
  output: GetLexiconOutput,
  errors: [LexiconNotFoundException, ServiceFailureException],
}));
/**
 * Returns a list of SpeechSynthesisTask objects ordered by their
 * creation date. This operation can filter the tasks by their status, for
 * example, allowing users to list only tasks that are completed.
 */
export const listSpeechSynthesisTasks: {
  (
    input: ListSpeechSynthesisTasksInput,
  ): Effect.Effect<
    ListSpeechSynthesisTasksOutput,
    InvalidNextTokenException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSpeechSynthesisTasksInput,
  ) => Stream.Stream<
    ListSpeechSynthesisTasksOutput,
    InvalidNextTokenException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSpeechSynthesisTasksInput,
  ) => Stream.Stream<
    unknown,
    InvalidNextTokenException | ServiceFailureException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSpeechSynthesisTasksInput,
  output: ListSpeechSynthesisTasksOutput,
  errors: [InvalidNextTokenException, ServiceFailureException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the list of voices that are available for use when
 * requesting speech synthesis. Each voice speaks a specified language, is
 * either male or female, and is identified by an ID, which is the ASCII
 * version of the voice name.
 *
 * When synthesizing speech ( `SynthesizeSpeech` ), you
 * provide the voice ID for the voice you want from the list of voices
 * returned by `DescribeVoices`.
 *
 * For example, you want your news reader application to read news in
 * a specific language, but giving a user the option to choose the voice.
 * Using the `DescribeVoices` operation you can provide the user
 * with a list of available voices to select from.
 *
 * You can optionally specify a language code to filter the available
 * voices. For example, if you specify `en-US`, the operation
 * returns a list of all available US English voices.
 *
 * This operation requires permissions to perform the
 * `polly:DescribeVoices` action.
 */
export const describeVoices: (
  input: DescribeVoicesInput,
) => Effect.Effect<
  DescribeVoicesOutput,
  InvalidNextTokenException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVoicesInput,
  output: DescribeVoicesOutput,
  errors: [InvalidNextTokenException, ServiceFailureException],
}));
/**
 * Returns a list of pronunciation lexicons stored in an Amazon Web Services Region. For more information, see Managing Lexicons.
 */
export const listLexicons: (
  input: ListLexiconsInput,
) => Effect.Effect<
  ListLexiconsOutput,
  InvalidNextTokenException | ServiceFailureException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLexiconsInput,
  output: ListLexiconsOutput,
  errors: [InvalidNextTokenException, ServiceFailureException],
}));
/**
 * Retrieves a specific SpeechSynthesisTask object based on its TaskID.
 * This object contains information about the given speech synthesis task,
 * including the status of the task, and a link to the S3 bucket containing
 * the output of the task.
 */
export const getSpeechSynthesisTask: (
  input: GetSpeechSynthesisTaskInput,
) => Effect.Effect<
  GetSpeechSynthesisTaskOutput,
  | InvalidTaskIdException
  | ServiceFailureException
  | SynthesisTaskNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSpeechSynthesisTaskInput,
  output: GetSpeechSynthesisTaskOutput,
  errors: [
    InvalidTaskIdException,
    ServiceFailureException,
    SynthesisTaskNotFoundException,
  ],
}));
/**
 * Stores a pronunciation lexicon in an Amazon Web Services Region. If
 * a lexicon with the same name already exists in the region, it is
 * overwritten by the new lexicon. Lexicon operations have eventual
 * consistency, therefore, it might take some time before the lexicon is
 * available to the SynthesizeSpeech operation.
 *
 * For more information, see Managing Lexicons.
 */
export const putLexicon: (
  input: PutLexiconInput,
) => Effect.Effect<
  PutLexiconOutput,
  | InvalidLexiconException
  | LexiconSizeExceededException
  | MaxLexemeLengthExceededException
  | MaxLexiconsNumberExceededException
  | ServiceFailureException
  | UnsupportedPlsAlphabetException
  | UnsupportedPlsLanguageException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLexiconInput,
  output: PutLexiconOutput,
  errors: [
    InvalidLexiconException,
    LexiconSizeExceededException,
    MaxLexemeLengthExceededException,
    MaxLexiconsNumberExceededException,
    ServiceFailureException,
    UnsupportedPlsAlphabetException,
    UnsupportedPlsLanguageException,
  ],
}));
/**
 * Synthesizes UTF-8 input, plain text or SSML, to a stream of bytes.
 * SSML input must be valid, well-formed SSML. Some alphabets might not be
 * available with all the voices (for example, Cyrillic might not be read at
 * all by English voices) unless phoneme mapping is used. For more
 * information, see How it Works.
 */
export const synthesizeSpeech: (
  input: SynthesizeSpeechInput,
) => Effect.Effect<
  SynthesizeSpeechOutput,
  | EngineNotSupportedException
  | InvalidSampleRateException
  | InvalidSsmlException
  | LanguageNotSupportedException
  | LexiconNotFoundException
  | MarksNotSupportedForFormatException
  | ServiceFailureException
  | SsmlMarksNotSupportedForTextTypeException
  | TextLengthExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SynthesizeSpeechInput,
  output: SynthesizeSpeechOutput,
  errors: [
    EngineNotSupportedException,
    InvalidSampleRateException,
    InvalidSsmlException,
    LanguageNotSupportedException,
    LexiconNotFoundException,
    MarksNotSupportedForFormatException,
    ServiceFailureException,
    SsmlMarksNotSupportedForTextTypeException,
    TextLengthExceededException,
  ],
}));
/**
 * Allows the creation of an asynchronous synthesis task, by starting a
 * new `SpeechSynthesisTask`. This operation requires all the
 * standard information needed for speech synthesis, plus the name of an
 * Amazon S3 bucket for the service to store the output of the synthesis task
 * and two optional parameters (`OutputS3KeyPrefix` and
 * `SnsTopicArn`). Once the synthesis task is created, this
 * operation will return a `SpeechSynthesisTask` object, which
 * will include an identifier of this task as well as the current status. The
 * `SpeechSynthesisTask` object is available for 72 hours after
 * starting the asynchronous synthesis task.
 */
export const startSpeechSynthesisTask: (
  input: StartSpeechSynthesisTaskInput,
) => Effect.Effect<
  StartSpeechSynthesisTaskOutput,
  | EngineNotSupportedException
  | InvalidS3BucketException
  | InvalidS3KeyException
  | InvalidSampleRateException
  | InvalidSnsTopicArnException
  | InvalidSsmlException
  | LanguageNotSupportedException
  | LexiconNotFoundException
  | MarksNotSupportedForFormatException
  | ServiceFailureException
  | SsmlMarksNotSupportedForTextTypeException
  | TextLengthExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSpeechSynthesisTaskInput,
  output: StartSpeechSynthesisTaskOutput,
  errors: [
    EngineNotSupportedException,
    InvalidS3BucketException,
    InvalidS3KeyException,
    InvalidSampleRateException,
    InvalidSnsTopicArnException,
    InvalidSsmlException,
    LanguageNotSupportedException,
    LexiconNotFoundException,
    MarksNotSupportedForFormatException,
    ServiceFailureException,
    SsmlMarksNotSupportedForTextTypeException,
    TextLengthExceededException,
  ],
}));

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
  sdkId: "Cost and Usage Report Service",
  serviceShapeName: "AWSOrigamiServiceGatewayService",
});
const auth = T.AwsAuthSigv4({ name: "cur" });
const ver = T.ServiceVersion("2017-01-06");
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
                        url: "https://cur-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://cur-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://cur.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://cur.{Region}.{PartitionResult#dnsSuffix}",
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
export type ReportName = string;
export type MaxResults = number;
export type GenericString = string;
export type TagKey = string;
export type S3Bucket = string;
export type S3Prefix = string;
export type BillingViewArn = string;
export type TagValue = string;
export type DeleteResponseMessage = string;
export type ErrorMessage = string;
export type LastDelivery = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteReportDefinitionRequest {
  ReportName: string;
}
export const DeleteReportDefinitionRequest = S.suspend(() =>
  S.Struct({ ReportName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteReportDefinitionRequest",
}) as any as S.Schema<DeleteReportDefinitionRequest>;
export interface DescribeReportDefinitionsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeReportDefinitionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeReportDefinitionsRequest",
}) as any as S.Schema<DescribeReportDefinitionsRequest>;
export interface ListTagsForResourceRequest {
  ReportName: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ReportName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
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
  ReportName: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ReportName: S.String, Tags: TagList }).pipe(
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
  ReportName: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ReportName: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type SchemaElementList = string[];
export const SchemaElementList = S.Array(S.String);
export type AdditionalArtifactList = string[];
export const AdditionalArtifactList = S.Array(S.String);
export interface ReportStatus {
  lastDelivery?: string;
  lastStatus?: string;
}
export const ReportStatus = S.suspend(() =>
  S.Struct({
    lastDelivery: S.optional(S.String),
    lastStatus: S.optional(S.String),
  }),
).annotations({ identifier: "ReportStatus" }) as any as S.Schema<ReportStatus>;
export interface ReportDefinition {
  ReportName: string;
  TimeUnit: string;
  Format: string;
  Compression: string;
  AdditionalSchemaElements: SchemaElementList;
  S3Bucket: string;
  S3Prefix: string;
  S3Region: string;
  AdditionalArtifacts?: AdditionalArtifactList;
  RefreshClosedReports?: boolean;
  ReportVersioning?: string;
  BillingViewArn?: string;
  ReportStatus?: ReportStatus;
}
export const ReportDefinition = S.suspend(() =>
  S.Struct({
    ReportName: S.String,
    TimeUnit: S.String,
    Format: S.String,
    Compression: S.String,
    AdditionalSchemaElements: SchemaElementList,
    S3Bucket: S.String,
    S3Prefix: S.String,
    S3Region: S.String,
    AdditionalArtifacts: S.optional(AdditionalArtifactList),
    RefreshClosedReports: S.optional(S.Boolean),
    ReportVersioning: S.optional(S.String),
    BillingViewArn: S.optional(S.String),
    ReportStatus: S.optional(ReportStatus),
  }),
).annotations({
  identifier: "ReportDefinition",
}) as any as S.Schema<ReportDefinition>;
export type ReportDefinitionList = ReportDefinition[];
export const ReportDefinitionList = S.Array(ReportDefinition);
export interface DeleteReportDefinitionResponse {
  ResponseMessage?: string;
}
export const DeleteReportDefinitionResponse = S.suspend(() =>
  S.Struct({ ResponseMessage: S.optional(S.String) }),
).annotations({
  identifier: "DeleteReportDefinitionResponse",
}) as any as S.Schema<DeleteReportDefinitionResponse>;
export interface DescribeReportDefinitionsResponse {
  ReportDefinitions?: ReportDefinitionList;
  NextToken?: string;
}
export const DescribeReportDefinitionsResponse = S.suspend(() =>
  S.Struct({
    ReportDefinitions: S.optional(ReportDefinitionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeReportDefinitionsResponse",
}) as any as S.Schema<DescribeReportDefinitionsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutReportDefinitionRequest {
  ReportDefinition: ReportDefinition;
  Tags?: TagList;
}
export const PutReportDefinitionRequest = S.suspend(() =>
  S.Struct({
    ReportDefinition: ReportDefinition,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutReportDefinitionRequest",
}) as any as S.Schema<PutReportDefinitionRequest>;
export interface PutReportDefinitionResponse {}
export const PutReportDefinitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutReportDefinitionResponse",
}) as any as S.Schema<PutReportDefinitionResponse>;
export interface ModifyReportDefinitionRequest {
  ReportName: string;
  ReportDefinition: ReportDefinition;
}
export const ModifyReportDefinitionRequest = S.suspend(() =>
  S.Struct({ ReportName: S.String, ReportDefinition: ReportDefinition }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ModifyReportDefinitionRequest",
}) as any as S.Schema<ModifyReportDefinitionRequest>;
export interface ModifyReportDefinitionResponse {}
export const ModifyReportDefinitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ModifyReportDefinitionResponse",
}) as any as S.Schema<ModifyReportDefinitionResponse>;

//# Errors
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { Message: S.optional(S.String) },
) {}
export class DuplicateReportNameException extends S.TaggedError<DuplicateReportNameException>()(
  "DuplicateReportNameException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class ReportLimitReachedException extends S.TaggedError<ReportLimitReachedException>()(
  "ReportLimitReachedException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the Amazon Web Services Cost and Usage Report available to this account.
 */
export const describeReportDefinitions: {
  (
    input: DescribeReportDefinitionsRequest,
  ): Effect.Effect<
    DescribeReportDefinitionsResponse,
    InternalErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReportDefinitionsRequest,
  ) => Stream.Stream<
    DescribeReportDefinitionsResponse,
    InternalErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReportDefinitionsRequest,
  ) => Stream.Stream<
    unknown,
    InternalErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReportDefinitionsRequest,
  output: DescribeReportDefinitionsResponse,
  errors: [InternalErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes the specified report. Any tags associated with the report are also
 * deleted.
 */
export const deleteReportDefinition: (
  input: DeleteReportDefinitionRequest,
) => Effect.Effect<
  DeleteReportDefinitionResponse,
  InternalErrorException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReportDefinitionRequest,
  output: DeleteReportDefinitionResponse,
  errors: [InternalErrorException, ValidationException],
}));
/**
 * Disassociates a set of tags from a report definition.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalErrorException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalErrorException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the tags associated with the specified report definition.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalErrorException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalErrorException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Allows you to programmatically update your report preferences.
 */
export const modifyReportDefinition: (
  input: ModifyReportDefinitionRequest,
) => Effect.Effect<
  ModifyReportDefinitionResponse,
  InternalErrorException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyReportDefinitionRequest,
  output: ModifyReportDefinitionResponse,
  errors: [InternalErrorException, ValidationException],
}));
/**
 * Associates a set of tags with a report definition.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalErrorException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalErrorException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a new report using the description that you provide.
 */
export const putReportDefinition: (
  input: PutReportDefinitionRequest,
) => Effect.Effect<
  PutReportDefinitionResponse,
  | DuplicateReportNameException
  | InternalErrorException
  | ReportLimitReachedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutReportDefinitionRequest,
  output: PutReportDefinitionResponse,
  errors: [
    DuplicateReportNameException,
    InternalErrorException,
    ReportLimitReachedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));

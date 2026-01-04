import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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

//# Schemas
export const TagKeyList = S.Array(S.String);
export class DeleteReportDefinitionRequest extends S.Class<DeleteReportDefinitionRequest>(
  "DeleteReportDefinitionRequest",
)(
  { ReportName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReportDefinitionsRequest extends S.Class<DescribeReportDefinitionsRequest>(
  "DescribeReportDefinitionsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ReportName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ReportName: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ReportName: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const SchemaElementList = S.Array(S.String);
export const AdditionalArtifactList = S.Array(S.String);
export class ReportStatus extends S.Class<ReportStatus>("ReportStatus")({
  lastDelivery: S.optional(S.String),
  lastStatus: S.optional(S.String),
}) {}
export class ReportDefinition extends S.Class<ReportDefinition>(
  "ReportDefinition",
)({
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
}) {}
export const ReportDefinitionList = S.Array(ReportDefinition);
export class DeleteReportDefinitionResponse extends S.Class<DeleteReportDefinitionResponse>(
  "DeleteReportDefinitionResponse",
)({ ResponseMessage: S.optional(S.String) }) {}
export class DescribeReportDefinitionsResponse extends S.Class<DescribeReportDefinitionsResponse>(
  "DescribeReportDefinitionsResponse",
)({
  ReportDefinitions: S.optional(ReportDefinitionList),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class PutReportDefinitionRequest extends S.Class<PutReportDefinitionRequest>(
  "PutReportDefinitionRequest",
)(
  { ReportDefinition: ReportDefinition, Tags: S.optional(TagList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutReportDefinitionResponse extends S.Class<PutReportDefinitionResponse>(
  "PutReportDefinitionResponse",
)({}) {}
export class ModifyReportDefinitionRequest extends S.Class<ModifyReportDefinitionRequest>(
  "ModifyReportDefinitionRequest",
)(
  { ReportName: S.String, ReportDefinition: ReportDefinition },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyReportDefinitionResponse extends S.Class<ModifyReportDefinitionResponse>(
  "ModifyReportDefinitionResponse",
)({}) {}

//# Errors
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class DuplicateReportNameException extends S.TaggedError<DuplicateReportNameException>()(
  "DuplicateReportNameException",
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
export const describeReportDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeReportDefinitionsRequest,
    output: DescribeReportDefinitionsResponse,
    errors: [InternalErrorException],
  }),
);
/**
 * Lists the tags associated with the specified report definition.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalErrorException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Associates a set of tags with a report definition.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalErrorException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Disassociates a set of tags from a report definition.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalErrorException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified report. Any tags associated with the report are also
 * deleted.
 */
export const deleteReportDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteReportDefinitionRequest,
    output: DeleteReportDefinitionResponse,
    errors: [InternalErrorException, ValidationException],
  }),
);
/**
 * Allows you to programmatically update your report preferences.
 */
export const modifyReportDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyReportDefinitionRequest,
    output: ModifyReportDefinitionResponse,
    errors: [InternalErrorException, ValidationException],
  }),
);
/**
 * Creates a new report using the description that you provide.
 */
export const putReportDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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

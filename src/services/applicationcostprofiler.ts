import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ApplicationCostProfiler",
  serviceShapeName: "AWSApplicationCostProfiler",
});
const auth = T.AwsAuthSigv4({ name: "application-cost-profiler" });
const ver = T.ServiceVersion("2020-09-10");
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
                        url: "https://application-cost-profiler-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://application-cost-profiler-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://application-cost-profiler.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://application-cost-profiler.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteReportDefinitionRequest extends S.Class<DeleteReportDefinitionRequest>(
  "DeleteReportDefinitionRequest",
)(
  { reportId: S.String.pipe(T.HttpLabel("reportId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/reportDefinition/{reportId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReportDefinitionRequest extends S.Class<GetReportDefinitionRequest>(
  "GetReportDefinitionRequest",
)(
  { reportId: S.String.pipe(T.HttpLabel("reportId")) },
  T.all(
    T.Http({ method: "GET", uri: "/reportDefinition/{reportId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReportDefinitionsRequest extends S.Class<ListReportDefinitionsRequest>(
  "ListReportDefinitionsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/reportDefinition" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3Location extends S.Class<S3Location>("S3Location")({
  bucket: S.String,
  prefix: S.String,
}) {}
export class UpdateReportDefinitionRequest extends S.Class<UpdateReportDefinitionRequest>(
  "UpdateReportDefinitionRequest",
)(
  {
    reportId: S.String.pipe(T.HttpLabel("reportId")),
    reportDescription: S.String,
    reportFrequency: S.String,
    format: S.String,
    destinationS3Location: S3Location,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/reportDefinition/{reportId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SourceS3Location extends S.Class<SourceS3Location>(
  "SourceS3Location",
)({ bucket: S.String, key: S.String, region: S.optional(S.String) }) {}
export class DeleteReportDefinitionResult extends S.Class<DeleteReportDefinitionResult>(
  "DeleteReportDefinitionResult",
)({ reportId: S.optional(S.String) }) {}
export class GetReportDefinitionResult extends S.Class<GetReportDefinitionResult>(
  "GetReportDefinitionResult",
)({
  reportId: S.String,
  reportDescription: S.String,
  reportFrequency: S.String,
  format: S.String,
  destinationS3Location: S3Location,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastUpdated: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ImportApplicationUsageRequest extends S.Class<ImportApplicationUsageRequest>(
  "ImportApplicationUsageRequest",
)(
  { sourceS3Location: SourceS3Location },
  T.all(
    T.Http({ method: "POST", uri: "/importApplicationUsage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutReportDefinitionRequest extends S.Class<PutReportDefinitionRequest>(
  "PutReportDefinitionRequest",
)(
  {
    reportId: S.String,
    reportDescription: S.String,
    reportFrequency: S.String,
    format: S.String,
    destinationS3Location: S3Location,
  },
  T.all(
    T.Http({ method: "POST", uri: "/reportDefinition" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateReportDefinitionResult extends S.Class<UpdateReportDefinitionResult>(
  "UpdateReportDefinitionResult",
)({ reportId: S.optional(S.String) }) {}
export class ReportDefinition extends S.Class<ReportDefinition>(
  "ReportDefinition",
)({
  reportId: S.optional(S.String),
  reportDescription: S.optional(S.String),
  reportFrequency: S.optional(S.String),
  format: S.optional(S.String),
  destinationS3Location: S.optional(S3Location),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ReportDefinitionList = S.Array(ReportDefinition);
export class ImportApplicationUsageResult extends S.Class<ImportApplicationUsageResult>(
  "ImportApplicationUsageResult",
)({ importId: S.String }) {}
export class ListReportDefinitionsResult extends S.Class<ListReportDefinitionsResult>(
  "ListReportDefinitionsResult",
)({
  reportDefinitions: S.optional(ReportDefinitionList),
  nextToken: S.optional(S.String),
}) {}
export class PutReportDefinitionResult extends S.Class<PutReportDefinitionResult>(
  "PutReportDefinitionResult",
)({ reportId: S.optional(S.String) }) {}

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
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes the specified report definition in AWS Application Cost Profiler. This stops the report from being
 * generated.
 */
export const deleteReportDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteReportDefinitionRequest,
    output: DeleteReportDefinitionResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates the report definition for a report in Application Cost Profiler.
 */
export const putReportDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutReportDefinitionRequest,
  output: PutReportDefinitionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Ingests application usage data from Amazon Simple Storage Service (Amazon S3).
 *
 * The data must already exist in the S3 location. As part of the action, AWS Application Cost Profiler
 * copies the object from your S3 bucket to an S3 bucket owned by Amazon for processing
 * asynchronously.
 */
export const importApplicationUsage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ImportApplicationUsageRequest,
    output: ImportApplicationUsageResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a list of all reports and their configurations for your AWS account.
 *
 * The maximum number of reports is one.
 */
export const listReportDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListReportDefinitionsRequest,
    output: ListReportDefinitionsResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "reportDefinitions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Retrieves the definition of a report already configured in AWS Application Cost Profiler.
 */
export const getReportDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReportDefinitionRequest,
  output: GetReportDefinitionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates existing report in AWS Application Cost Profiler.
 */
export const updateReportDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateReportDefinitionRequest,
    output: UpdateReportDefinitionResult,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "SageMaker A2I Runtime",
  serviceShapeName: "AmazonSageMakerA2IRuntime",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2019-11-07");
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
                        url: "https://a2i-runtime.sagemaker-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://a2i-runtime.sagemaker-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://a2i-runtime.sagemaker.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://a2i-runtime.sagemaker.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteHumanLoopRequest extends S.Class<DeleteHumanLoopRequest>(
  "DeleteHumanLoopRequest",
)(
  { HumanLoopName: S.String.pipe(T.HttpLabel("HumanLoopName")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/human-loops/{HumanLoopName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteHumanLoopResponse extends S.Class<DeleteHumanLoopResponse>(
  "DeleteHumanLoopResponse",
)({}) {}
export class DescribeHumanLoopRequest extends S.Class<DescribeHumanLoopRequest>(
  "DescribeHumanLoopRequest",
)(
  { HumanLoopName: S.String.pipe(T.HttpLabel("HumanLoopName")) },
  T.all(
    T.Http({ method: "GET", uri: "/human-loops/{HumanLoopName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListHumanLoopsRequest extends S.Class<ListHumanLoopsRequest>(
  "ListHumanLoopsRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("CreationTimeAfter")),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("CreationTimeBefore")),
    FlowDefinitionArn: S.String.pipe(T.HttpQuery("FlowDefinitionArn")),
    SortOrder: S.optional(S.String).pipe(T.HttpQuery("SortOrder")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/human-loops" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopHumanLoopRequest extends S.Class<StopHumanLoopRequest>(
  "StopHumanLoopRequest",
)(
  { HumanLoopName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/human-loops/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopHumanLoopResponse extends S.Class<StopHumanLoopResponse>(
  "StopHumanLoopResponse",
)({}) {}
export const ContentClassifiers = S.Array(S.String);
export class HumanLoopInput extends S.Class<HumanLoopInput>("HumanLoopInput")({
  InputContent: S.String,
}) {}
export class HumanLoopDataAttributes extends S.Class<HumanLoopDataAttributes>(
  "HumanLoopDataAttributes",
)({ ContentClassifiers: ContentClassifiers }) {}
export class StartHumanLoopRequest extends S.Class<StartHumanLoopRequest>(
  "StartHumanLoopRequest",
)(
  {
    HumanLoopName: S.String,
    FlowDefinitionArn: S.String,
    HumanLoopInput: HumanLoopInput,
    DataAttributes: S.optional(HumanLoopDataAttributes),
  },
  T.all(
    T.Http({ method: "POST", uri: "/human-loops" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class HumanLoopOutput extends S.Class<HumanLoopOutput>(
  "HumanLoopOutput",
)({ OutputS3Uri: S.String }) {}
export class HumanLoopSummary extends S.Class<HumanLoopSummary>(
  "HumanLoopSummary",
)({
  HumanLoopName: S.optional(S.String),
  HumanLoopStatus: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  FailureReason: S.optional(S.String),
  FlowDefinitionArn: S.optional(S.String),
}) {}
export const HumanLoopSummaries = S.Array(HumanLoopSummary);
export class DescribeHumanLoopResponse extends S.Class<DescribeHumanLoopResponse>(
  "DescribeHumanLoopResponse",
)({
  CreationTime: S.Date.pipe(T.TimestampFormat("date-time")),
  FailureReason: S.optional(S.String),
  FailureCode: S.optional(S.String),
  HumanLoopStatus: S.String,
  HumanLoopName: S.String,
  HumanLoopArn: S.String,
  FlowDefinitionArn: S.String,
  HumanLoopOutput: S.optional(HumanLoopOutput),
}) {}
export class ListHumanLoopsResponse extends S.Class<ListHumanLoopsResponse>(
  "ListHumanLoopsResponse",
)({
  HumanLoopSummaries: HumanLoopSummaries,
  NextToken: S.optional(S.String),
}) {}
export class StartHumanLoopResponse extends S.Class<StartHumanLoopResponse>(
  "StartHumanLoopResponse",
)({ HumanLoopArn: S.optional(S.String) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes the specified human loop for a flow definition.
 *
 * If the human loop was deleted, this operation will return a
 * `ResourceNotFoundException`.
 */
export const deleteHumanLoop = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHumanLoopRequest,
  output: DeleteHumanLoopResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a human loop, provided that at least one activation condition is met.
 */
export const startHumanLoop = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartHumanLoopRequest,
  output: StartHumanLoopResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the specified human loop. If the human loop was deleted, this
 * operation will return a `ResourceNotFoundException` error.
 */
export const describeHumanLoop = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHumanLoopRequest,
  output: DescribeHumanLoopResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about human loops, given the specified parameters. If a human loop was deleted, it will not be included.
 */
export const listHumanLoops = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListHumanLoopsRequest,
    output: ListHumanLoopsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "HumanLoopSummaries",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Stops the specified human loop.
 */
export const stopHumanLoop = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopHumanLoopRequest,
  output: StopHumanLoopResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));

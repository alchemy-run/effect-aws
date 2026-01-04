import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "SageMaker Runtime",
  serviceShapeName: "AmazonSageMakerRuntime",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2017-05-13");
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
                        url: "https://runtime.sagemaker-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://runtime-fips.sagemaker.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://runtime.sagemaker.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://runtime.sagemaker-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://runtime.sagemaker.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://runtime.sagemaker.{Region}.{PartitionResult#dnsSuffix}",
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
export class InvokeEndpointInput extends S.Class<InvokeEndpointInput>(
  "InvokeEndpointInput",
)(
  {
    EndpointName: S.String.pipe(T.HttpLabel()),
    Body: T.StreamingInput.pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    Accept: S.optional(S.String).pipe(T.HttpHeader("Accept")),
    CustomAttributes: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Custom-Attributes"),
    ),
    TargetModel: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Target-Model"),
    ),
    TargetVariant: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Target-Variant"),
    ),
    TargetContainerHostname: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Target-Container-Hostname"),
    ),
    InferenceId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Inference-Id"),
    ),
    EnableExplanations: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Enable-Explanations"),
    ),
    InferenceComponentName: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Inference-Component"),
    ),
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Session-Id"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/endpoints/{EndpointName}/invocations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeEndpointAsyncInput extends S.Class<InvokeEndpointAsyncInput>(
  "InvokeEndpointAsyncInput",
)(
  {
    EndpointName: S.String.pipe(T.HttpLabel()),
    ContentType: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Content-Type"),
    ),
    Accept: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-SageMaker-Accept")),
    CustomAttributes: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Custom-Attributes"),
    ),
    InferenceId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Inference-Id"),
    ),
    InputLocation: S.String.pipe(
      T.HttpHeader("X-Amzn-SageMaker-InputLocation"),
    ),
    RequestTTLSeconds: S.optional(S.Number).pipe(
      T.HttpHeader("X-Amzn-SageMaker-RequestTTLSeconds"),
    ),
    InvocationTimeoutSeconds: S.optional(S.Number).pipe(
      T.HttpHeader("X-Amzn-SageMaker-InvocationTimeoutSeconds"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/endpoints/{EndpointName}/async-invocations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeEndpointWithResponseStreamInput extends S.Class<InvokeEndpointWithResponseStreamInput>(
  "InvokeEndpointWithResponseStreamInput",
)(
  {
    EndpointName: S.String.pipe(T.HttpLabel()),
    Body: T.StreamingInput.pipe(T.HttpPayload()),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    Accept: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-SageMaker-Accept")),
    CustomAttributes: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Custom-Attributes"),
    ),
    TargetVariant: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Target-Variant"),
    ),
    TargetContainerHostname: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Target-Container-Hostname"),
    ),
    InferenceId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Inference-Id"),
    ),
    InferenceComponentName: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Inference-Component"),
    ),
    SessionId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-SageMaker-Session-Id"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/endpoints/{EndpointName}/invocations-response-stream",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeEndpointOutput extends S.Class<InvokeEndpointOutput>(
  "InvokeEndpointOutput",
)({
  Body: T.StreamingOutput.pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  InvokedProductionVariant: S.optional(S.String).pipe(
    T.HttpHeader("x-Amzn-Invoked-Production-Variant"),
  ),
  CustomAttributes: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-SageMaker-Custom-Attributes"),
  ),
  NewSessionId: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-SageMaker-New-Session-Id"),
  ),
  ClosedSessionId: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-SageMaker-Closed-Session-Id"),
  ),
}) {}
export class InvokeEndpointAsyncOutput extends S.Class<InvokeEndpointAsyncOutput>(
  "InvokeEndpointAsyncOutput",
)({
  InferenceId: S.optional(S.String),
  OutputLocation: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-SageMaker-OutputLocation"),
  ),
  FailureLocation: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-SageMaker-FailureLocation"),
  ),
}) {}
export class PayloadPart extends S.Class<PayloadPart>("PayloadPart")({
  Bytes: S.optional(T.Blob).pipe(T.EventPayload()),
}) {}
export const ResponseStream = T.EventStream(
  S.Union(
    S.Struct({ PayloadPart: PayloadPart }),
    S.Struct({ ModelStreamError: S.suspend(() => ModelStreamError) }),
    S.Struct({ InternalStreamFailure: S.suspend(() => InternalStreamFailure) }),
  ),
);
export class InvokeEndpointWithResponseStreamOutput extends S.Class<InvokeEndpointWithResponseStreamOutput>(
  "InvokeEndpointWithResponseStreamOutput",
)({
  Body: ResponseStream.pipe(T.HttpPayload()),
  ContentType: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-SageMaker-Content-Type"),
  ),
  InvokedProductionVariant: S.optional(S.String).pipe(
    T.HttpHeader("x-Amzn-Invoked-Production-Variant"),
  ),
  CustomAttributes: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-SageMaker-Custom-Attributes"),
  ),
}) {}

//# Errors
export class InternalDependencyException extends S.TaggedError<InternalDependencyException>()(
  "InternalDependencyException",
  { Message: S.optional(S.String) },
) {}
export class InternalFailure extends S.TaggedError<InternalFailure>()(
  "InternalFailure",
  {},
) {}
export class ModelError extends S.TaggedError<ModelError>()("ModelError", {
  Message: S.optional(S.String),
  OriginalStatusCode: S.optional(S.Number),
  OriginalMessage: S.optional(S.String),
  LogStreamArn: S.optional(S.String),
}) {}
export class ServiceUnavailable extends S.TaggedError<ServiceUnavailable>()(
  "ServiceUnavailable",
  { Message: S.optional(S.String) },
) {}
export class InternalStreamFailure extends S.TaggedError<InternalStreamFailure>()(
  "InternalStreamFailure",
  { Message: S.optional(S.String) },
) {}
export class ModelStreamError extends S.TaggedError<ModelStreamError>()(
  "ModelStreamError",
  { Message: S.optional(S.String), ErrorCode: S.optional(S.String) },
) {}
export class ValidationError extends S.TaggedError<ValidationError>()(
  "ValidationError",
  {},
) {}
export class ModelNotReadyException extends S.TaggedError<ModelNotReadyException>()(
  "ModelNotReadyException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ModelNotReadyException", httpResponseCode: 429 }),
) {}

//# Operations
/**
 * Invokes a model at the specified endpoint to return the inference response as a
 * stream. The inference stream provides the response payload incrementally as a series of
 * parts. Before you can get an inference stream, you must have access to a model that's
 * deployed using Amazon SageMaker AI hosting services, and the container for that model
 * must support inference streaming.
 *
 * For more information that can help you use this API, see the following sections in the
 * *Amazon SageMaker AI Developer Guide*:
 *
 * - For information about how to add streaming support to a model, see How Containers Serve Requests.
 *
 * - For information about how to process the streaming response, see Invoke real-time endpoints.
 *
 * Before you can use this operation, your IAM permissions must allow the
 * `sagemaker:InvokeEndpoint` action. For more information about Amazon SageMaker AI actions for IAM policies, see Actions, resources, and condition keys for Amazon SageMaker AI in the IAM Service Authorization
 * Reference.
 *
 * Amazon SageMaker AI strips all POST headers except those supported by the API. Amazon SageMaker AI might add
 * additional headers. You should not rely on the behavior of headers outside those
 * enumerated in the request syntax.
 *
 * Calls to `InvokeEndpointWithResponseStream` are authenticated by using
 * Amazon Web Services Signature Version 4. For information, see Authenticating Requests (Amazon Web Services Signature Version 4) in the
 * *Amazon S3 API Reference*.
 */
export const invokeEndpointWithResponseStream =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: InvokeEndpointWithResponseStreamInput,
    output: InvokeEndpointWithResponseStreamOutput,
    errors: [
      InternalFailure,
      InternalStreamFailure,
      ModelError,
      ModelStreamError,
      ServiceUnavailable,
      ValidationError,
    ],
  }));
/**
 * After you deploy a model into production using Amazon SageMaker AI hosting services,
 * your client applications use this API to get inferences from the model hosted at the
 * specified endpoint.
 *
 * For an overview of Amazon SageMaker AI, see How It Works.
 *
 * Amazon SageMaker AI strips all POST headers except those supported by the API. Amazon SageMaker AI might add
 * additional headers. You should not rely on the behavior of headers outside those
 * enumerated in the request syntax.
 *
 * Calls to `InvokeEndpoint` are authenticated by using Amazon Web Services
 * Signature Version 4. For information, see Authenticating
 * Requests (Amazon Web Services Signature Version 4) in the *Amazon S3 API Reference*.
 *
 * A customer's model containers must respond to requests within 60 seconds. The model
 * itself can have a maximum processing time of 60 seconds before responding to
 * invocations. If your model is going to take 50-60 seconds of processing time, the SDK
 * socket timeout should be set to be 70 seconds.
 *
 * Endpoints are scoped to an individual account, and are not public. The URL does
 * not contain the account ID, but Amazon SageMaker AI determines the account ID from
 * the authentication token that is supplied by the caller.
 */
export const invokeEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeEndpointInput,
  output: InvokeEndpointOutput,
  errors: [
    InternalDependencyException,
    InternalFailure,
    ModelError,
    ModelNotReadyException,
    ServiceUnavailable,
    ValidationError,
  ],
}));
/**
 * After you deploy a model into production using Amazon SageMaker AI hosting services,
 * your client applications use this API to get inferences from the model hosted at the
 * specified endpoint in an asynchronous manner.
 *
 * Inference requests sent to this API are enqueued for asynchronous processing. The
 * processing of the inference request may or may not complete before you receive a
 * response from this API. The response from this API will not contain the result of the
 * inference request but contain information about where you can locate it.
 *
 * Amazon SageMaker AI strips all POST headers except those supported by the API. Amazon SageMaker AI might add
 * additional headers. You should not rely on the behavior of headers outside those
 * enumerated in the request syntax.
 *
 * Calls to `InvokeEndpointAsync` are authenticated by using Amazon Web Services Signature Version 4. For information, see Authenticating
 * Requests (Amazon Web Services Signature Version 4) in the *Amazon S3 API Reference*.
 */
export const invokeEndpointAsync = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeEndpointAsyncInput,
  output: InvokeEndpointAsyncOutput,
  errors: [InternalFailure, ServiceUnavailable, ValidationError],
}));

import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Sagemaker Edge",
  serviceShapeName: "AmazonSageMakerEdge",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2020-09-23");
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
                        url: "https://edge.sagemaker-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://edge.sagemaker-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://edge.sagemaker.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://edge.sagemaker.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetDeploymentsRequest extends S.Class<GetDeploymentsRequest>(
  "GetDeploymentsRequest",
)(
  { DeviceName: S.String, DeviceFleetName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetDeployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeviceRegistrationRequest extends S.Class<GetDeviceRegistrationRequest>(
  "GetDeviceRegistrationRequest",
)(
  { DeviceName: S.String, DeviceFleetName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetDeviceRegistration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EdgeMetric extends S.Class<EdgeMetric>("EdgeMetric")({
  Dimension: S.optional(S.String),
  MetricName: S.optional(S.String),
  Value: S.optional(S.Number),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EdgeMetrics = S.Array(EdgeMetric);
export class Model extends S.Class<Model>("Model")({
  ModelName: S.optional(S.String),
  ModelVersion: S.optional(S.String),
  LatestSampleTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LatestInference: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModelMetrics: S.optional(EdgeMetrics),
}) {}
export const Models = S.Array(Model);
export class GetDeviceRegistrationResult extends S.Class<GetDeviceRegistrationResult>(
  "GetDeviceRegistrationResult",
)({
  DeviceRegistration: S.optional(S.String),
  CacheTTL: S.optional(S.String),
}) {}
export class DeploymentModel extends S.Class<DeploymentModel>(
  "DeploymentModel",
)({
  ModelHandle: S.optional(S.String),
  ModelName: S.optional(S.String),
  ModelVersion: S.optional(S.String),
  DesiredState: S.optional(S.String),
  State: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  RollbackFailureReason: S.optional(S.String),
}) {}
export const DeploymentModels = S.Array(DeploymentModel);
export class DeploymentResult extends S.Class<DeploymentResult>(
  "DeploymentResult",
)({
  DeploymentName: S.optional(S.String),
  DeploymentStatus: S.optional(S.String),
  DeploymentStatusMessage: S.optional(S.String),
  DeploymentStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DeploymentEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DeploymentModels: S.optional(DeploymentModels),
}) {}
export class SendHeartbeatRequest extends S.Class<SendHeartbeatRequest>(
  "SendHeartbeatRequest",
)(
  {
    AgentMetrics: S.optional(EdgeMetrics),
    Models: S.optional(Models),
    AgentVersion: S.String,
    DeviceName: S.String,
    DeviceFleetName: S.String,
    DeploymentResult: S.optional(DeploymentResult),
  },
  T.all(
    T.Http({ method: "POST", uri: "/SendHeartbeat" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendHeartbeatResponse extends S.Class<SendHeartbeatResponse>(
  "SendHeartbeatResponse",
)({}) {}
export class Checksum extends S.Class<Checksum>("Checksum")({
  Type: S.optional(S.String),
  Sum: S.optional(S.String),
}) {}
export class Definition extends S.Class<Definition>("Definition")({
  ModelHandle: S.optional(S.String),
  S3Url: S.optional(S.String),
  Checksum: S.optional(Checksum),
  State: S.optional(S.String),
}) {}
export const Definitions = S.Array(Definition);
export class EdgeDeployment extends S.Class<EdgeDeployment>("EdgeDeployment")({
  DeploymentName: S.optional(S.String),
  Type: S.optional(S.String),
  FailureHandlingPolicy: S.optional(S.String),
  Definitions: S.optional(Definitions),
}) {}
export const EdgeDeployments = S.Array(EdgeDeployment);
export class GetDeploymentsResult extends S.Class<GetDeploymentsResult>(
  "GetDeploymentsResult",
)({ Deployments: S.optional(EdgeDeployments) }) {}

//# Errors
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Use to check if a device is registered with SageMaker Edge Manager.
 */
export const getDeviceRegistration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDeviceRegistrationRequest,
    output: GetDeviceRegistrationResult,
    errors: [InternalServiceException],
  }),
);
/**
 * Use to get the current status of devices registered on SageMaker Edge Manager.
 */
export const sendHeartbeat = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendHeartbeatRequest,
  output: SendHeartbeatResponse,
  errors: [InternalServiceException],
}));
/**
 * Use to get the active deployments from a device.
 */
export const getDeployments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentsRequest,
  output: GetDeploymentsResult,
  errors: [InternalServiceException],
}));

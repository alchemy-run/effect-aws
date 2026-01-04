import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "EC2 Instance Connect",
  serviceShapeName: "AWSEC2InstanceConnectService",
});
const auth = T.AwsAuthSigv4({ name: "ec2-instance-connect" });
const ver = T.ServiceVersion("2018-04-02");
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
                        url: "https://ec2-instance-connect-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://ec2-instance-connect-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://ec2-instance-connect.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://ec2-instance-connect.{Region}.{PartitionResult#dnsSuffix}",
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
export class SendSerialConsoleSSHPublicKeyRequest extends S.Class<SendSerialConsoleSSHPublicKeyRequest>(
  "SendSerialConsoleSSHPublicKeyRequest",
)(
  {
    InstanceId: S.String,
    SerialPort: S.optional(S.Number),
    SSHPublicKey: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendSSHPublicKeyRequest extends S.Class<SendSSHPublicKeyRequest>(
  "SendSSHPublicKeyRequest",
)(
  {
    InstanceId: S.String,
    InstanceOSUser: S.String,
    SSHPublicKey: S.String,
    AvailabilityZone: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendSerialConsoleSSHPublicKeyResponse extends S.Class<SendSerialConsoleSSHPublicKeyResponse>(
  "SendSerialConsoleSSHPublicKeyResponse",
)({ RequestId: S.optional(S.String), Success: S.optional(S.Boolean) }) {}
export class SendSSHPublicKeyResponse extends S.Class<SendSSHPublicKeyResponse>(
  "SendSSHPublicKeyResponse",
)({ RequestId: S.optional(S.String), Success: S.optional(S.Boolean) }) {}

//# Errors
export class AuthException extends S.TaggedError<AuthException>()(
  "AuthException",
  {},
  T.AwsQueryError({ code: "Forbidden", httpResponseCode: 403 }),
) {}
export class EC2InstanceNotFoundException extends S.TaggedError<EC2InstanceNotFoundException>()(
  "EC2InstanceNotFoundException",
  {},
  T.AwsQueryError({ code: "EC2InstanceNotFound", httpResponseCode: 404 }),
) {}
export class EC2InstanceStateInvalidException extends S.TaggedError<EC2InstanceStateInvalidException>()(
  "EC2InstanceStateInvalidException",
  {},
  T.AwsQueryError({ code: "EC2InstanceStateInvalid", httpResponseCode: 400 }),
) {}
export class EC2InstanceUnavailableException extends S.TaggedError<EC2InstanceUnavailableException>()(
  "EC2InstanceUnavailableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "EC2InstanceUnavailable", httpResponseCode: 503 }),
) {}
export class EC2InstanceTypeInvalidException extends S.TaggedError<EC2InstanceTypeInvalidException>()(
  "EC2InstanceTypeInvalidException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "EC2InstanceTypeInvalid", httpResponseCode: 400 }),
) {}
export class InvalidArgsException extends S.TaggedError<InvalidArgsException>()(
  "InvalidArgsException",
  {},
  T.AwsQueryError({ code: "InvalidArguments", httpResponseCode: 400 }),
) {}
export class SerialConsoleAccessDisabledException extends S.TaggedError<SerialConsoleAccessDisabledException>()(
  "SerialConsoleAccessDisabledException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SerialConsoleAccessDisabled",
    httpResponseCode: 403,
  }),
) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServerError", httpResponseCode: 500 }),
) {}
export class SerialConsoleSessionLimitExceededException extends S.TaggedError<SerialConsoleSessionLimitExceededException>()(
  "SerialConsoleSessionLimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SerialConsoleSessionLimitExceeded",
    httpResponseCode: 400,
  }),
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "TooManyRequests", httpResponseCode: 429 }),
) {}
export class SerialConsoleSessionUnavailableException extends S.TaggedError<SerialConsoleSessionUnavailableException>()(
  "SerialConsoleSessionUnavailableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SerialConsoleSessionUnavailable",
    httpResponseCode: 500,
  }),
) {}
export class SerialConsoleSessionUnsupportedException extends S.TaggedError<SerialConsoleSessionUnsupportedException>()(
  "SerialConsoleSessionUnsupportedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SerialConsoleSessionUnsupported",
    httpResponseCode: 400,
  }),
) {}

//# Operations
/**
 * Pushes an SSH public key to the specified EC2 instance for use by the specified user.
 * The key remains for 60 seconds. For more information, see Connect to
 * your Linux instance using EC2 Instance Connect in the Amazon EC2
 * User Guide.
 */
export const sendSSHPublicKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendSSHPublicKeyRequest,
  output: SendSSHPublicKeyResponse,
  errors: [
    AuthException,
    EC2InstanceNotFoundException,
    EC2InstanceStateInvalidException,
    EC2InstanceUnavailableException,
    InvalidArgsException,
    ServiceException,
    ThrottlingException,
  ],
}));
/**
 * Pushes an SSH public key to the specified EC2 instance. The key remains for 60
 * seconds, which gives you 60 seconds to establish a serial console connection to the
 * instance using SSH. For more information, see EC2 Serial Console in
 * the *Amazon EC2 User Guide*.
 */
export const sendSerialConsoleSSHPublicKey =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SendSerialConsoleSSHPublicKeyRequest,
    output: SendSerialConsoleSSHPublicKeyResponse,
    errors: [
      AuthException,
      EC2InstanceNotFoundException,
      EC2InstanceStateInvalidException,
      EC2InstanceTypeInvalidException,
      EC2InstanceUnavailableException,
      InvalidArgsException,
      SerialConsoleAccessDisabledException,
      SerialConsoleSessionLimitExceededException,
      SerialConsoleSessionUnavailableException,
      SerialConsoleSessionUnsupportedException,
      ServiceException,
      ThrottlingException,
    ],
  }));

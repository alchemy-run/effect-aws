import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Bedrock AgentCore",
  serviceShapeName: "AmazonBedrockAgentCore",
});
const auth = T.AwsAuthSigv4({ name: "bedrock-agentcore" });
const ver = T.ServiceVersion("2024-02-28");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://bedrock-agentcore-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://bedrock-agentcore-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://bedrock-agentcore.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://bedrock-agentcore.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export const ScopesListType = S.Array(S.String);
export class GetResourceApiKeyRequest extends S.Class<GetResourceApiKeyRequest>(
  "GetResourceApiKeyRequest",
)(
  { workloadIdentityToken: S.String, resourceCredentialProviderName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/identities/api-key" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkloadAccessTokenRequest extends S.Class<GetWorkloadAccessTokenRequest>(
  "GetWorkloadAccessTokenRequest",
)(
  { workloadName: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/identities/GetWorkloadAccessToken" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkloadAccessTokenForJWTRequest extends S.Class<GetWorkloadAccessTokenForJWTRequest>(
  "GetWorkloadAccessTokenForJWTRequest",
)(
  { workloadName: S.String, userToken: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/identities/GetWorkloadAccessTokenForJWT" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkloadAccessTokenForUserIdRequest extends S.Class<GetWorkloadAccessTokenForUserIdRequest>(
  "GetWorkloadAccessTokenForUserIdRequest",
)(
  { workloadName: S.String, userId: S.String },
  T.all(
    T.Http({
      method: "POST",
      uri: "/identities/GetWorkloadAccessTokenForUserId",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StringList = S.Array(S.String);
export const UserIdentifier = S.Union(
  S.Struct({ userToken: S.String }),
  S.Struct({ userId: S.String }),
);
export const CustomRequestParametersType = S.Record({
  key: S.String,
  value: S.String,
});
export class CompleteResourceTokenAuthRequest extends S.Class<CompleteResourceTokenAuthRequest>(
  "CompleteResourceTokenAuthRequest",
)(
  { userIdentifier: UserIdentifier, sessionUri: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/identities/CompleteResourceTokenAuth" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CompleteResourceTokenAuthResponse extends S.Class<CompleteResourceTokenAuthResponse>(
  "CompleteResourceTokenAuthResponse",
)({}) {}
export class GetResourceApiKeyResponse extends S.Class<GetResourceApiKeyResponse>(
  "GetResourceApiKeyResponse",
)({ apiKey: S.String }) {}
export class GetResourceOauth2TokenRequest extends S.Class<GetResourceOauth2TokenRequest>(
  "GetResourceOauth2TokenRequest",
)(
  {
    workloadIdentityToken: S.String,
    resourceCredentialProviderName: S.String,
    scopes: ScopesListType,
    oauth2Flow: S.String,
    sessionUri: S.optional(S.String),
    resourceOauth2ReturnUrl: S.optional(S.String),
    forceAuthentication: S.optional(S.Boolean),
    customParameters: S.optional(CustomRequestParametersType),
    customState: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/identities/oauth2/token" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkloadAccessTokenResponse extends S.Class<GetWorkloadAccessTokenResponse>(
  "GetWorkloadAccessTokenResponse",
)({ workloadAccessToken: S.String }) {}
export class GetWorkloadAccessTokenForJWTResponse extends S.Class<GetWorkloadAccessTokenForJWTResponse>(
  "GetWorkloadAccessTokenForJWTResponse",
)({ workloadAccessToken: S.String }) {}
export class GetWorkloadAccessTokenForUserIdResponse extends S.Class<GetWorkloadAccessTokenForUserIdResponse>(
  "GetWorkloadAccessTokenForUserIdResponse",
)({ workloadAccessToken: S.String }) {}
export class InputContentBlock extends S.Class<InputContentBlock>(
  "InputContentBlock",
)({ path: S.String, text: S.optional(S.String), blob: S.optional(T.Blob) }) {}
export const InputContentBlockList = S.Array(InputContentBlock);
export class ToolArguments extends S.Class<ToolArguments>("ToolArguments")({
  code: S.optional(S.String),
  language: S.optional(S.String),
  clearContext: S.optional(S.Boolean),
  command: S.optional(S.String),
  path: S.optional(S.String),
  paths: S.optional(StringList),
  content: S.optional(InputContentBlockList),
  directoryPath: S.optional(S.String),
  taskId: S.optional(S.String),
}) {}
export class GetResourceOauth2TokenResponse extends S.Class<GetResourceOauth2TokenResponse>(
  "GetResourceOauth2TokenResponse",
)({
  authorizationUrl: S.optional(S.String),
  accessToken: S.optional(S.String),
  sessionUri: S.optional(S.String),
  sessionStatus: S.optional(S.String),
}) {}
export class InvokeCodeInterpreterRequest extends S.Class<InvokeCodeInterpreterRequest>(
  "InvokeCodeInterpreterRequest",
)(
  {
    codeInterpreterIdentifier: S.String.pipe(T.HttpLabel()),
    sessionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-code-interpreter-session-id"),
    ),
    traceId: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Trace-Id")),
    traceParent: S.optional(S.String).pipe(T.HttpHeader("traceparent")),
    name: S.String,
    arguments: S.optional(ToolArguments),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/code-interpreters/{codeInterpreterIdentifier}/tools/invoke",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class ToolResultStructuredContent extends S.Class<ToolResultStructuredContent>(
  "ToolResultStructuredContent",
)({
  taskId: S.optional(S.String),
  taskStatus: S.optional(S.String),
  stdout: S.optional(S.String),
  stderr: S.optional(S.String),
  exitCode: S.optional(S.Number),
  executionTime: S.optional(S.Number),
}) {}
export class ResourceContent extends S.Class<ResourceContent>(
  "ResourceContent",
)({
  type: S.String,
  uri: S.optional(S.String),
  mimeType: S.optional(S.String),
  text: S.optional(S.String),
  blob: S.optional(T.Blob),
}) {}
export class ContentBlock extends S.Class<ContentBlock>("ContentBlock")({
  type: S.String,
  text: S.optional(S.String),
  data: S.optional(T.Blob),
  mimeType: S.optional(S.String),
  uri: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  size: S.optional(S.Number),
  resource: S.optional(ResourceContent),
}) {}
export const ContentBlockList = S.Array(ContentBlock);
export class CodeInterpreterResult extends S.Class<CodeInterpreterResult>(
  "CodeInterpreterResult",
)({
  content: ContentBlockList,
  structuredContent: S.optional(ToolResultStructuredContent),
  isError: S.optional(S.Boolean),
}) {}
export const CodeInterpreterStreamOutput = T.EventStream(
  S.Union(
    S.Struct({ result: CodeInterpreterResult }),
    S.Struct({ accessDeniedException: S.suspend(() => AccessDeniedException) }),
    S.Struct({ conflictException: S.suspend(() => ConflictException) }),
    S.Struct({
      internalServerException: S.suspend(() => InternalServerException),
    }),
    S.Struct({
      resourceNotFoundException: S.suspend(() => ResourceNotFoundException),
    }),
    S.Struct({
      serviceQuotaExceededException: S.suspend(
        () => ServiceQuotaExceededException,
      ),
    }),
    S.Struct({ throttlingException: S.suspend(() => ThrottlingException) }),
    S.Struct({ validationException: S.suspend(() => ValidationException) }),
  ),
);
export class InvokeCodeInterpreterResponse extends S.Class<InvokeCodeInterpreterResponse>(
  "InvokeCodeInterpreterResponse",
)({
  sessionId: S.optional(S.String).pipe(
    T.HttpHeader("x-amzn-code-interpreter-session-id"),
  ),
  stream: CodeInterpreterStreamOutput.pipe(T.HttpPayload()),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves the API key associated with an API key credential provider.
 */
export const getResourceApiKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceApiKeyRequest,
  output: GetResourceApiKeyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Returns the OAuth 2.0 token of the provided resource.
 */
export const getResourceOauth2Token = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourceOauth2TokenRequest,
    output: GetResourceOauth2TokenResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Obtains a workload access token for agentic workloads not acting on behalf of a user.
 */
export const getWorkloadAccessToken = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWorkloadAccessTokenRequest,
    output: GetWorkloadAccessTokenResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Obtains a workload access token for agentic workloads acting on behalf of a user, using a JWT token.
 */
export const getWorkloadAccessTokenForJWT =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetWorkloadAccessTokenForJWTRequest,
    output: GetWorkloadAccessTokenForJWTResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }));
/**
 * Obtains a workload access token for agentic workloads acting on behalf of a user, using the user's ID.
 */
export const getWorkloadAccessTokenForUserId =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetWorkloadAccessTokenForUserIdRequest,
    output: GetWorkloadAccessTokenForUserIdResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }));
/**
 * Confirms the user authentication session for obtaining OAuth2.0 tokens for a resource.
 */
export const completeResourceTokenAuth = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CompleteResourceTokenAuthRequest,
    output: CompleteResourceTokenAuthResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      UnauthorizedException,
      ValidationException,
    ],
  }),
);
/**
 * Executes code within an active code interpreter session in Amazon Bedrock. This operation processes the provided code, runs it in a secure environment, and returns the execution results including output, errors, and generated visualizations.
 *
 * To execute code, you must specify the code interpreter identifier, session ID, and the code to run in the arguments parameter. The operation returns a stream containing the execution results, which can include text output, error messages, and data visualizations.
 *
 * This operation is subject to request rate limiting based on your account's service quotas.
 *
 * The following operations are related to `InvokeCodeInterpreter`:
 *
 * - StartCodeInterpreterSession
 *
 * - GetCodeInterpreterSession
 */
export const invokeCodeInterpreter = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: InvokeCodeInterpreterRequest,
    output: InvokeCodeInterpreterResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);

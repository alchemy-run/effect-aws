import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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
export class GetAgentCardRequest extends S.Class<GetAgentCardRequest>(
  "GetAgentCardRequest",
)(
  {
    runtimeSessionId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-AgentCore-Runtime-Session-Id"),
    ),
    agentRuntimeArn: S.String.pipe(T.HttpLabel("agentRuntimeArn")),
    qualifier: S.optional(S.String).pipe(T.HttpQuery("qualifier")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/runtimes/{agentRuntimeArn}/invocations/.well-known/agent-card.json",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InvokeAgentRuntimeRequest extends S.Class<InvokeAgentRuntimeRequest>(
  "InvokeAgentRuntimeRequest",
)(
  {
    contentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    accept: S.optional(S.String).pipe(T.HttpHeader("Accept")),
    mcpSessionId: S.optional(S.String).pipe(T.HttpHeader("Mcp-Session-Id")),
    runtimeSessionId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-AgentCore-Runtime-Session-Id"),
    ),
    mcpProtocolVersion: S.optional(S.String).pipe(
      T.HttpHeader("Mcp-Protocol-Version"),
    ),
    runtimeUserId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-AgentCore-Runtime-User-Id"),
    ),
    traceId: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Trace-Id")),
    traceParent: S.optional(S.String).pipe(T.HttpHeader("traceparent")),
    traceState: S.optional(S.String).pipe(T.HttpHeader("tracestate")),
    baggage: S.optional(S.String).pipe(T.HttpHeader("baggage")),
    agentRuntimeArn: S.String.pipe(T.HttpLabel("agentRuntimeArn")),
    qualifier: S.optional(S.String).pipe(T.HttpQuery("qualifier")),
    accountId: S.optional(S.String).pipe(T.HttpQuery("accountId")),
    payload: T.StreamingInput.pipe(T.HttpPayload()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/runtimes/{agentRuntimeArn}/invocations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopRuntimeSessionRequest extends S.Class<StopRuntimeSessionRequest>(
  "StopRuntimeSessionRequest",
)(
  {
    runtimeSessionId: S.String.pipe(
      T.HttpHeader("X-Amzn-Bedrock-AgentCore-Runtime-Session-Id"),
    ),
    agentRuntimeArn: S.String.pipe(T.HttpLabel("agentRuntimeArn")),
    qualifier: S.optional(S.String).pipe(T.HttpQuery("qualifier")),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/runtimes/{agentRuntimeArn}/stopruntimesession",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBrowserSessionRequest extends S.Class<GetBrowserSessionRequest>(
  "GetBrowserSessionRequest",
)(
  {
    browserIdentifier: S.String.pipe(T.HttpLabel("browserIdentifier")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/browsers/{browserIdentifier}/sessions/get",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBrowserSessionsRequest extends S.Class<ListBrowserSessionsRequest>(
  "ListBrowserSessionsRequest",
)(
  {
    browserIdentifier: S.String.pipe(T.HttpLabel("browserIdentifier")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    status: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/browsers/{browserIdentifier}/sessions/list",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopBrowserSessionRequest extends S.Class<StopBrowserSessionRequest>(
  "StopBrowserSessionRequest",
)(
  {
    traceId: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Trace-Id")),
    traceParent: S.optional(S.String).pipe(T.HttpHeader("traceparent")),
    browserIdentifier: S.String.pipe(T.HttpLabel("browserIdentifier")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/browsers/{browserIdentifier}/sessions/stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCodeInterpreterSessionRequest extends S.Class<GetCodeInterpreterSessionRequest>(
  "GetCodeInterpreterSessionRequest",
)(
  {
    codeInterpreterIdentifier: S.String.pipe(
      T.HttpLabel("codeInterpreterIdentifier"),
    ),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/code-interpreters/{codeInterpreterIdentifier}/sessions/get",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCodeInterpreterSessionsRequest extends S.Class<ListCodeInterpreterSessionsRequest>(
  "ListCodeInterpreterSessionsRequest",
)(
  {
    codeInterpreterIdentifier: S.String.pipe(
      T.HttpLabel("codeInterpreterIdentifier"),
    ),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    status: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/code-interpreters/{codeInterpreterIdentifier}/sessions/list",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartCodeInterpreterSessionRequest extends S.Class<StartCodeInterpreterSessionRequest>(
  "StartCodeInterpreterSessionRequest",
)(
  {
    traceId: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Trace-Id")),
    traceParent: S.optional(S.String).pipe(T.HttpHeader("traceparent")),
    codeInterpreterIdentifier: S.String.pipe(
      T.HttpLabel("codeInterpreterIdentifier"),
    ),
    name: S.optional(S.String),
    sessionTimeoutSeconds: S.optional(S.Number),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/code-interpreters/{codeInterpreterIdentifier}/sessions/start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopCodeInterpreterSessionRequest extends S.Class<StopCodeInterpreterSessionRequest>(
  "StopCodeInterpreterSessionRequest",
)(
  {
    traceId: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Trace-Id")),
    traceParent: S.optional(S.String).pipe(T.HttpHeader("traceparent")),
    codeInterpreterIdentifier: S.String.pipe(
      T.HttpLabel("codeInterpreterIdentifier"),
    ),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/code-interpreters/{codeInterpreterIdentifier}/sessions/stop",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventInput extends S.Class<DeleteEventInput>(
  "DeleteEventInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    eventId: S.String.pipe(T.HttpLabel("eventId")),
    actorId: S.String.pipe(T.HttpLabel("actorId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memories/{memoryId}/actor/{actorId}/sessions/{sessionId}/events/{eventId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMemoryRecordInput extends S.Class<DeleteMemoryRecordInput>(
  "DeleteMemoryRecordInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    memoryRecordId: S.String.pipe(T.HttpLabel("memoryRecordId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/memories/{memoryId}/memoryRecords/{memoryRecordId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEventInput extends S.Class<GetEventInput>("GetEventInput")(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    actorId: S.String.pipe(T.HttpLabel("actorId")),
    eventId: S.String.pipe(T.HttpLabel("eventId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memories/{memoryId}/actor/{actorId}/sessions/{sessionId}/events/{eventId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMemoryRecordInput extends S.Class<GetMemoryRecordInput>(
  "GetMemoryRecordInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    memoryRecordId: S.String.pipe(T.HttpLabel("memoryRecordId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/memories/{memoryId}/memoryRecord/{memoryRecordId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListActorsInput extends S.Class<ListActorsInput>(
  "ListActorsInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/memories/{memoryId}/actors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMemoryRecordsInput extends S.Class<ListMemoryRecordsInput>(
  "ListMemoryRecordsInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    namespace: S.String,
    memoryStrategyId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/memories/{memoryId}/memoryRecords" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSessionsInput extends S.Class<ListSessionsInput>(
  "ListSessionsInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    actorId: S.String.pipe(T.HttpLabel("actorId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memories/{memoryId}/actor/{actorId}/sessions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StringList = S.Array(S.String);
export const Spans = S.Array(S.Any);
export const SpanIds = S.Array(S.String);
export const TraceIds = S.Array(S.String);
export const NamespacesList = S.Array(S.String);
export const UserIdentifier = S.Union(
  S.Struct({ userToken: S.String }),
  S.Struct({ userId: S.String }),
);
export const CustomRequestParametersType = S.Record({
  key: S.String,
  value: S.String,
});
export class ViewPort extends S.Class<ViewPort>("ViewPort")({
  width: S.Number,
  height: S.Number,
}) {}
export const EvaluationInput = S.Union(S.Struct({ sessionSpans: Spans }));
export const EvaluationTarget = S.Union(
  S.Struct({ spanIds: SpanIds }),
  S.Struct({ traceIds: TraceIds }),
);
export class MemoryRecordDeleteInput extends S.Class<MemoryRecordDeleteInput>(
  "MemoryRecordDeleteInput",
)({ memoryRecordId: S.String }) {}
export const MemoryRecordsDeleteInputList = S.Array(MemoryRecordDeleteInput);
export const MemoryContent = S.Union(S.Struct({ text: S.String }));
export class MemoryRecordUpdateInput extends S.Class<MemoryRecordUpdateInput>(
  "MemoryRecordUpdateInput",
)({
  memoryRecordId: S.String,
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  content: S.optional(MemoryContent),
  namespaces: S.optional(NamespacesList),
  memoryStrategyId: S.optional(S.String),
}) {}
export const MemoryRecordsUpdateInputList = S.Array(MemoryRecordUpdateInput);
export class Branch extends S.Class<Branch>("Branch")({
  rootEventId: S.optional(S.String),
  name: S.String,
}) {}
export class ExtractionJobFilterInput extends S.Class<ExtractionJobFilterInput>(
  "ExtractionJobFilterInput",
)({
  strategyId: S.optional(S.String),
  sessionId: S.optional(S.String),
  actorId: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class ExtractionJob extends S.Class<ExtractionJob>("ExtractionJob")({
  jobId: S.String,
}) {}
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
export class GetAgentCardResponse extends S.Class<GetAgentCardResponse>(
  "GetAgentCardResponse",
)({
  runtimeSessionId: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-Bedrock-AgentCore-Runtime-Session-Id"),
  ),
  agentCard: S.Any.pipe(T.HttpPayload()),
  statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class InvokeAgentRuntimeResponse extends S.Class<InvokeAgentRuntimeResponse>(
  "InvokeAgentRuntimeResponse",
)({
  runtimeSessionId: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-Bedrock-AgentCore-Runtime-Session-Id"),
  ),
  mcpSessionId: S.optional(S.String).pipe(T.HttpHeader("Mcp-Session-Id")),
  mcpProtocolVersion: S.optional(S.String).pipe(
    T.HttpHeader("Mcp-Protocol-Version"),
  ),
  traceId: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Trace-Id")),
  traceParent: S.optional(S.String).pipe(T.HttpHeader("traceparent")),
  traceState: S.optional(S.String).pipe(T.HttpHeader("tracestate")),
  baggage: S.optional(S.String).pipe(T.HttpHeader("baggage")),
  contentType: S.String.pipe(T.HttpHeader("Content-Type")),
  response: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),
  statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class StopRuntimeSessionResponse extends S.Class<StopRuntimeSessionResponse>(
  "StopRuntimeSessionResponse",
)({
  runtimeSessionId: S.optional(S.String).pipe(
    T.HttpHeader("X-Amzn-Bedrock-AgentCore-Runtime-Session-Id"),
  ),
  statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
}) {}
export class StartBrowserSessionRequest extends S.Class<StartBrowserSessionRequest>(
  "StartBrowserSessionRequest",
)(
  {
    traceId: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Trace-Id")),
    traceParent: S.optional(S.String).pipe(T.HttpHeader("traceparent")),
    browserIdentifier: S.String.pipe(T.HttpLabel("browserIdentifier")),
    name: S.optional(S.String),
    sessionTimeoutSeconds: S.optional(S.Number),
    viewPort: S.optional(ViewPort),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/browsers/{browserIdentifier}/sessions/start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopBrowserSessionResponse extends S.Class<StopBrowserSessionResponse>(
  "StopBrowserSessionResponse",
)({
  browserIdentifier: S.String,
  sessionId: S.String,
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class GetCodeInterpreterSessionResponse extends S.Class<GetCodeInterpreterSessionResponse>(
  "GetCodeInterpreterSessionResponse",
)({
  codeInterpreterIdentifier: S.String,
  sessionId: S.String,
  name: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  sessionTimeoutSeconds: S.optional(S.Number),
  status: S.optional(S.String),
}) {}
export class StartCodeInterpreterSessionResponse extends S.Class<StartCodeInterpreterSessionResponse>(
  "StartCodeInterpreterSessionResponse",
)({
  codeInterpreterIdentifier: S.String,
  sessionId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class StopCodeInterpreterSessionResponse extends S.Class<StopCodeInterpreterSessionResponse>(
  "StopCodeInterpreterSessionResponse",
)({
  codeInterpreterIdentifier: S.String,
  sessionId: S.String,
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class EvaluateRequest extends S.Class<EvaluateRequest>(
  "EvaluateRequest",
)(
  {
    evaluatorId: S.String.pipe(T.HttpLabel("evaluatorId")),
    evaluationInput: EvaluationInput,
    evaluationTarget: S.optional(EvaluationTarget),
  },
  T.all(
    T.Http({ method: "POST", uri: "/evaluations/evaluate/{evaluatorId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchDeleteMemoryRecordsInput extends S.Class<BatchDeleteMemoryRecordsInput>(
  "BatchDeleteMemoryRecordsInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    records: MemoryRecordsDeleteInputList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memories/{memoryId}/memoryRecords/batchDelete",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchUpdateMemoryRecordsInput extends S.Class<BatchUpdateMemoryRecordsInput>(
  "BatchUpdateMemoryRecordsInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    records: MemoryRecordsUpdateInputList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memories/{memoryId}/memoryRecords/batchUpdate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventOutput extends S.Class<DeleteEventOutput>(
  "DeleteEventOutput",
)({ eventId: S.String }) {}
export class DeleteMemoryRecordOutput extends S.Class<DeleteMemoryRecordOutput>(
  "DeleteMemoryRecordOutput",
)({ memoryRecordId: S.String }) {}
export class ListMemoryExtractionJobsInput extends S.Class<ListMemoryExtractionJobsInput>(
  "ListMemoryExtractionJobsInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    maxResults: S.optional(S.Number),
    filter: S.optional(ExtractionJobFilterInput),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/memories/{memoryId}/extractionJobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMemoryExtractionJobInput extends S.Class<StartMemoryExtractionJobInput>(
  "StartMemoryExtractionJobInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    extractionJob: ExtractionJob,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memories/{memoryId}/extractionJobs/start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InputContentBlock extends S.Class<InputContentBlock>(
  "InputContentBlock",
)({ path: S.String, text: S.optional(S.String), blob: S.optional(T.Blob) }) {}
export const InputContentBlockList = S.Array(InputContentBlock);
export class AutomationStreamUpdate extends S.Class<AutomationStreamUpdate>(
  "AutomationStreamUpdate",
)({ streamStatus: S.optional(S.String) }) {}
export const MetadataValue = S.Union(S.Struct({ stringValue: S.String }));
export class BranchFilter extends S.Class<BranchFilter>("BranchFilter")({
  name: S.String,
  includeParentBranches: S.optional(S.Boolean),
}) {}
export const LeftExpression = S.Union(S.Struct({ metadataKey: S.String }));
export const RightExpression = S.Union(
  S.Struct({ metadataValue: MetadataValue }),
);
export class MemoryMetadataFilterExpression extends S.Class<MemoryMetadataFilterExpression>(
  "MemoryMetadataFilterExpression",
)({
  left: LeftExpression,
  operator: S.String,
  right: S.optional(RightExpression),
}) {}
export const MemoryMetadataFilterList = S.Array(MemoryMetadataFilterExpression);
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
export class BrowserSessionSummary extends S.Class<BrowserSessionSummary>(
  "BrowserSessionSummary",
)({
  browserIdentifier: S.String,
  sessionId: S.String,
  name: S.optional(S.String),
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const BrowserSessionSummaries = S.Array(BrowserSessionSummary);
export const StreamUpdate = S.Union(
  S.Struct({ automationStreamUpdate: AutomationStreamUpdate }),
);
export class CodeInterpreterSessionSummary extends S.Class<CodeInterpreterSessionSummary>(
  "CodeInterpreterSessionSummary",
)({
  codeInterpreterIdentifier: S.String,
  sessionId: S.String,
  name: S.optional(S.String),
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const CodeInterpreterSessionSummaries = S.Array(
  CodeInterpreterSessionSummary,
);
export class MemoryRecordCreateInput extends S.Class<MemoryRecordCreateInput>(
  "MemoryRecordCreateInput",
)({
  requestIdentifier: S.String,
  namespaces: NamespacesList,
  content: MemoryContent,
  timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  memoryStrategyId: S.optional(S.String),
}) {}
export const MemoryRecordsCreateInputList = S.Array(MemoryRecordCreateInput);
export const MetadataMap = S.Record({ key: S.String, value: MetadataValue });
export const Content = S.Union(S.Struct({ text: S.String }));
export class Conversational extends S.Class<Conversational>("Conversational")({
  content: Content,
  role: S.String,
}) {}
export const PayloadType = S.Union(
  S.Struct({ conversational: Conversational }),
  S.Struct({ blob: S.Any }),
);
export const PayloadTypeList = S.Array(PayloadType);
export class Event extends S.Class<Event>("Event")({
  memoryId: S.String,
  actorId: S.String,
  sessionId: S.String,
  eventId: S.String,
  eventTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  payload: PayloadTypeList,
  branch: S.optional(Branch),
  metadata: S.optional(MetadataMap),
}) {}
export class MemoryRecord extends S.Class<MemoryRecord>("MemoryRecord")({
  memoryRecordId: S.String,
  content: MemoryContent,
  memoryStrategyId: S.String,
  namespaces: NamespacesList,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  metadata: S.optional(MetadataMap),
}) {}
export class ActorSummary extends S.Class<ActorSummary>("ActorSummary")({
  actorId: S.String,
}) {}
export const ActorSummaryList = S.Array(ActorSummary);
export class MemoryRecordSummary extends S.Class<MemoryRecordSummary>(
  "MemoryRecordSummary",
)({
  memoryRecordId: S.String,
  content: MemoryContent,
  memoryStrategyId: S.String,
  namespaces: NamespacesList,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  score: S.optional(S.Number),
  metadata: S.optional(MetadataMap),
}) {}
export const MemoryRecordSummaryList = S.Array(MemoryRecordSummary);
export class SessionSummary extends S.Class<SessionSummary>("SessionSummary")({
  sessionId: S.String,
  actorId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const SessionSummaryList = S.Array(SessionSummary);
export class SearchCriteria extends S.Class<SearchCriteria>("SearchCriteria")({
  searchQuery: S.String,
  memoryStrategyId: S.optional(S.String),
  topK: S.optional(S.Number),
  metadataFilters: S.optional(MemoryMetadataFilterList),
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
    codeInterpreterIdentifier: S.String.pipe(
      T.HttpLabel("codeInterpreterIdentifier"),
    ),
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
export class ListBrowserSessionsResponse extends S.Class<ListBrowserSessionsResponse>(
  "ListBrowserSessionsResponse",
)({ items: BrowserSessionSummaries, nextToken: S.optional(S.String) }) {}
export class AutomationStream extends S.Class<AutomationStream>(
  "AutomationStream",
)({ streamEndpoint: S.String, streamStatus: S.String }) {}
export class LiveViewStream extends S.Class<LiveViewStream>("LiveViewStream")({
  streamEndpoint: S.optional(S.String),
}) {}
export class BrowserSessionStream extends S.Class<BrowserSessionStream>(
  "BrowserSessionStream",
)({
  automationStream: AutomationStream,
  liveViewStream: S.optional(LiveViewStream),
}) {}
export class StartBrowserSessionResponse extends S.Class<StartBrowserSessionResponse>(
  "StartBrowserSessionResponse",
)({
  browserIdentifier: S.String,
  sessionId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  streams: S.optional(BrowserSessionStream),
}) {}
export class UpdateBrowserStreamRequest extends S.Class<UpdateBrowserStreamRequest>(
  "UpdateBrowserStreamRequest",
)(
  {
    browserIdentifier: S.String.pipe(T.HttpLabel("browserIdentifier")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
    streamUpdate: StreamUpdate,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/browsers/{browserIdentifier}/sessions/streams/update",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCodeInterpreterSessionsResponse extends S.Class<ListCodeInterpreterSessionsResponse>(
  "ListCodeInterpreterSessionsResponse",
)({
  items: CodeInterpreterSessionSummaries,
  nextToken: S.optional(S.String),
}) {}
export class BatchCreateMemoryRecordsInput extends S.Class<BatchCreateMemoryRecordsInput>(
  "BatchCreateMemoryRecordsInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    records: MemoryRecordsCreateInputList,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memories/{memoryId}/memoryRecords/batchCreate",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MemoryRecordOutput extends S.Class<MemoryRecordOutput>(
  "MemoryRecordOutput",
)({
  memoryRecordId: S.String,
  status: S.String,
  requestIdentifier: S.optional(S.String),
  errorCode: S.optional(S.Number),
  errorMessage: S.optional(S.String),
}) {}
export const MemoryRecordsOutputList = S.Array(MemoryRecordOutput);
export class BatchUpdateMemoryRecordsOutput extends S.Class<BatchUpdateMemoryRecordsOutput>(
  "BatchUpdateMemoryRecordsOutput",
)({
  successfulRecords: MemoryRecordsOutputList,
  failedRecords: MemoryRecordsOutputList,
}) {}
export class GetEventOutput extends S.Class<GetEventOutput>("GetEventOutput")({
  event: Event,
}) {}
export class GetMemoryRecordOutput extends S.Class<GetMemoryRecordOutput>(
  "GetMemoryRecordOutput",
)({ memoryRecord: MemoryRecord }) {}
export class ListActorsOutput extends S.Class<ListActorsOutput>(
  "ListActorsOutput",
)({ actorSummaries: ActorSummaryList, nextToken: S.optional(S.String) }) {}
export class ListMemoryRecordsOutput extends S.Class<ListMemoryRecordsOutput>(
  "ListMemoryRecordsOutput",
)({
  memoryRecordSummaries: MemoryRecordSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListSessionsOutput extends S.Class<ListSessionsOutput>(
  "ListSessionsOutput",
)({ sessionSummaries: SessionSummaryList, nextToken: S.optional(S.String) }) {}
export class RetrieveMemoryRecordsInput extends S.Class<RetrieveMemoryRecordsInput>(
  "RetrieveMemoryRecordsInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    namespace: S.String,
    searchCriteria: SearchCriteria,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/memories/{memoryId}/retrieve" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMemoryExtractionJobOutput extends S.Class<StartMemoryExtractionJobOutput>(
  "StartMemoryExtractionJobOutput",
)({ jobId: S.String }) {}
export class EventMetadataFilterExpression extends S.Class<EventMetadataFilterExpression>(
  "EventMetadataFilterExpression",
)({
  left: LeftExpression,
  operator: S.String,
  right: S.optional(RightExpression),
}) {}
export const EventMetadataFilterList = S.Array(EventMetadataFilterExpression);
export class FilterInput extends S.Class<FilterInput>("FilterInput")({
  branch: S.optional(BranchFilter),
  eventMetadata: S.optional(EventMetadataFilterList),
}) {}
export class GetBrowserSessionResponse extends S.Class<GetBrowserSessionResponse>(
  "GetBrowserSessionResponse",
)({
  browserIdentifier: S.String,
  sessionId: S.String,
  name: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  viewPort: S.optional(ViewPort),
  sessionTimeoutSeconds: S.optional(S.Number),
  status: S.optional(S.String),
  streams: S.optional(BrowserSessionStream),
  sessionReplayArtifact: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UpdateBrowserStreamResponse extends S.Class<UpdateBrowserStreamResponse>(
  "UpdateBrowserStreamResponse",
)({
  browserIdentifier: S.String,
  sessionId: S.String,
  streams: BrowserSessionStream,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class BatchCreateMemoryRecordsOutput extends S.Class<BatchCreateMemoryRecordsOutput>(
  "BatchCreateMemoryRecordsOutput",
)({
  successfulRecords: MemoryRecordsOutputList,
  failedRecords: MemoryRecordsOutputList,
}) {}
export class BatchDeleteMemoryRecordsOutput extends S.Class<BatchDeleteMemoryRecordsOutput>(
  "BatchDeleteMemoryRecordsOutput",
)({
  successfulRecords: MemoryRecordsOutputList,
  failedRecords: MemoryRecordsOutputList,
}) {}
export class CreateEventInput extends S.Class<CreateEventInput>(
  "CreateEventInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    actorId: S.String,
    sessionId: S.optional(S.String),
    eventTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    payload: PayloadTypeList,
    branch: S.optional(Branch),
    clientToken: S.optional(S.String),
    metadata: S.optional(MetadataMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/memories/{memoryId}/events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEventsInput extends S.Class<ListEventsInput>(
  "ListEventsInput",
)(
  {
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    actorId: S.String.pipe(T.HttpLabel("actorId")),
    includePayloads: S.optional(S.Boolean),
    filter: S.optional(FilterInput),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/memories/{memoryId}/actor/{actorId}/sessions/{sessionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RetrieveMemoryRecordsOutput extends S.Class<RetrieveMemoryRecordsOutput>(
  "RetrieveMemoryRecordsOutput",
)({
  memoryRecordSummaries: MemoryRecordSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class TokenUsage extends S.Class<TokenUsage>("TokenUsage")({
  inputTokens: S.optional(S.Number),
  outputTokens: S.optional(S.Number),
  totalTokens: S.optional(S.Number),
}) {}
export const EventList = S.Array(Event);
export class SpanContext extends S.Class<SpanContext>("SpanContext")({
  sessionId: S.String,
  traceId: S.optional(S.String),
  spanId: S.optional(S.String),
}) {}
export class MessageMetadata extends S.Class<MessageMetadata>(
  "MessageMetadata",
)({ eventId: S.String, messageIndex: S.Number }) {}
export const MessagesList = S.Array(MessageMetadata);
export class CreateEventOutput extends S.Class<CreateEventOutput>(
  "CreateEventOutput",
)({ event: Event }) {}
export class ListEventsOutput extends S.Class<ListEventsOutput>(
  "ListEventsOutput",
)({ events: EventList, nextToken: S.optional(S.String) }) {}
export const Context = S.Union(S.Struct({ spanContext: SpanContext }));
export const ExtractionJobMessages = S.Union(
  S.Struct({ messagesList: MessagesList }),
);
export class EvaluationResultContent extends S.Class<EvaluationResultContent>(
  "EvaluationResultContent",
)({
  evaluatorArn: S.String,
  evaluatorId: S.String,
  evaluatorName: S.String,
  explanation: S.optional(S.String),
  context: Context,
  value: S.optional(S.Number),
  label: S.optional(S.String),
  tokenUsage: S.optional(TokenUsage),
  errorMessage: S.optional(S.String),
  errorCode: S.optional(S.String),
}) {}
export const EvaluationResults = S.Array(EvaluationResultContent);
export class ExtractionJobMetadata extends S.Class<ExtractionJobMetadata>(
  "ExtractionJobMetadata",
)({
  jobID: S.String,
  messages: ExtractionJobMessages,
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
  strategyId: S.optional(S.String),
  sessionId: S.optional(S.String),
  actorId: S.optional(S.String),
}) {}
export const ExtractionJobMetadataList = S.Array(ExtractionJobMetadata);
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
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class EvaluateResponse extends S.Class<EvaluateResponse>(
  "EvaluateResponse",
)({ evaluationResults: EvaluationResults }) {}
export class ListMemoryExtractionJobsOutput extends S.Class<ListMemoryExtractionJobsOutput>(
  "ListMemoryExtractionJobsOutput",
)({ jobs: ExtractionJobMetadataList, nextToken: S.optional(S.String) }) {}
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
  { message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { message: S.String },
) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class RuntimeClientError extends S.TaggedError<RuntimeClientError>()(
  "RuntimeClientError",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
) {}
export class ThrottledException extends S.TaggedError<ThrottledException>()(
  "ThrottledException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}
export class DuplicateIdException extends S.TaggedError<DuplicateIdException>()(
  "DuplicateIdException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves information about a specific event in an AgentCore Memory resource.
 *
 * To use this operation, you must have the `bedrock-agentcore:GetEvent` permission.
 */
export const getEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventInput,
  output: GetEventOutput,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ThrottledException,
    ValidationException,
  ],
}));
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
 * Stops a session that is running in an running AgentCore Runtime agent.
 */
export const stopRuntimeSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRuntimeSessionRequest,
  output: StopRuntimeSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    RuntimeClientError,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of browser sessions in Amazon Bedrock that match the specified criteria. This operation returns summary information about each session, including identifiers, status, and timestamps.
 *
 * You can filter the results by browser identifier and session status. The operation supports pagination to handle large result sets efficiently.
 *
 * We recommend using pagination to ensure that the operation returns quickly and successfully when retrieving large numbers of sessions.
 *
 * The following operations are related to `ListBrowserSessions`:
 *
 * - StartBrowserSession
 *
 * - GetBrowserSession
 */
export const listBrowserSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBrowserSessionsRequest,
  output: ListBrowserSessionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of code interpreter sessions in Amazon Bedrock that match the specified criteria. This operation returns summary information about each session, including identifiers, status, and timestamps.
 *
 * You can filter the results by code interpreter identifier and session status. The operation supports pagination to handle large result sets efficiently.
 *
 * We recommend using pagination to ensure that the operation returns quickly and successfully when retrieving large numbers of sessions.
 *
 * The following operations are related to `ListCodeInterpreterSessions`:
 *
 * - StartCodeInterpreterSession
 *
 * - GetCodeInterpreterSession
 */
export const listCodeInterpreterSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCodeInterpreterSessionsRequest,
    output: ListCodeInterpreterSessionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves detailed information about a specific code interpreter session in Amazon Bedrock. This operation returns the session's configuration, current status, and metadata.
 *
 * To get a code interpreter session, you must specify both the code interpreter identifier and the session ID. The response includes information about the session's timeout settings and current status.
 *
 * The following operations are related to `GetCodeInterpreterSession`:
 *
 * - StartCodeInterpreterSession
 *
 * - ListCodeInterpreterSessions
 *
 * - StopCodeInterpreterSession
 */
export const getCodeInterpreterSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCodeInterpreterSessionRequest,
    output: GetCodeInterpreterSessionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves detailed information about a specific browser session in Amazon Bedrock. This operation returns the session's configuration, current status, associated streams, and metadata.
 *
 * To get a browser session, you must specify both the browser identifier and the session ID. The response includes information about the session's viewport configuration, timeout settings, and stream endpoints.
 *
 * The following operations are related to `GetBrowserSession`:
 *
 * - StartBrowserSession
 *
 * - ListBrowserSessions
 *
 * - StopBrowserSession
 */
export const getBrowserSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBrowserSessionRequest,
  output: GetBrowserSessionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends a request to an agent or tool hosted in an Amazon Bedrock AgentCore Runtime and receives responses in real-time.
 *
 * To invoke an agent you must specify the AgentCore Runtime ARN and provide a payload containing your request. You can optionally specify a qualifier to target a specific version or endpoint of the agent.
 *
 * This operation supports streaming responses, allowing you to receive partial responses as they become available. We recommend using pagination to ensure that the operation returns quickly and successfully when processing large responses.
 *
 * For example code, see Invoke an AgentCore Runtime agent.
 *
 * If you're integrating your agent with OAuth, you can't use the Amazon Web Services SDK to call `InvokeAgentRuntime`. Instead, make a HTTPS request to `InvokeAgentRuntime`. For an example, see Authenticate and authorize with Inbound Auth and Outbound Auth.
 *
 * To use this operation, you must have the `bedrock-agentcore:InvokeAgentRuntime` permission. If you are making a call to `InvokeAgentRuntime` on behalf of a user ID with the `X-Amzn-Bedrock-AgentCore-Runtime-User-Id` header, You require permissions to both actions (`bedrock-agentcore:InvokeAgentRuntime` and `bedrock-agentcore:InvokeAgentRuntimeForUser`).
 */
export const invokeAgentRuntime = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InvokeAgentRuntimeRequest,
  output: InvokeAgentRuntimeResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    RuntimeClientError,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Terminates an active browser session in Amazon Bedrock. This operation stops the session, releases associated resources, and makes the session unavailable for further use.
 *
 * To stop a browser session, you must specify both the browser identifier and the session ID. Once stopped, a session cannot be restarted; you must create a new session using `StartBrowserSession`.
 *
 * The following operations are related to `StopBrowserSession`:
 *
 * - StartBrowserSession
 *
 * - GetBrowserSession
 */
export const stopBrowserSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopBrowserSessionRequest,
  output: StopBrowserSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates and initializes a code interpreter session in Amazon Bedrock. The session enables agents to execute code as part of their response generation, supporting programming languages such as Python for data analysis, visualization, and computation tasks.
 *
 * To create a session, you must specify a code interpreter identifier and a name. The session remains active until it times out or you explicitly stop it using the `StopCodeInterpreterSession` operation.
 *
 * The following operations are related to `StartCodeInterpreterSession`:
 *
 * - InvokeCodeInterpreter
 *
 * - GetCodeInterpreterSession
 *
 * - StopCodeInterpreterSession
 */
export const startCodeInterpreterSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartCodeInterpreterSessionRequest,
    output: StartCodeInterpreterSessionResponse,
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
/**
 * Terminates an active code interpreter session in Amazon Bedrock. This operation stops the session, releases associated resources, and makes the session unavailable for further use.
 *
 * To stop a code interpreter session, you must specify both the code interpreter identifier and the session ID. Once stopped, a session cannot be restarted; you must create a new session using `StartCodeInterpreterSession`.
 *
 * The following operations are related to `StopCodeInterpreterSession`:
 *
 * - StartCodeInterpreterSession
 *
 * - GetCodeInterpreterSession
 */
export const stopCodeInterpreterSession = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopCodeInterpreterSessionRequest,
    output: StopCodeInterpreterSessionResponse,
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
/**
 * Creates and initializes a browser session in Amazon Bedrock. The session enables agents to navigate and interact with web content, extract information from websites, and perform web-based tasks as part of their response generation.
 *
 * To create a session, you must specify a browser identifier and a name. You can also configure the viewport dimensions to control the visible area of web content. The session remains active until it times out or you explicitly stop it using the `StopBrowserSession` operation.
 *
 * The following operations are related to `StartBrowserSession`:
 *
 * - GetBrowserSession
 *
 * - UpdateBrowserStream
 *
 * - StopBrowserSession
 */
export const startBrowserSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBrowserSessionRequest,
  output: StartBrowserSessionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a browser stream. To use this operation, you must have permissions to perform the bedrock:UpdateBrowserStream action.
 */
export const updateBrowserStream = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBrowserStreamRequest,
  output: UpdateBrowserStreamResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the A2A agent card associated with an AgentCore Runtime agent.
 */
export const getAgentCard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAgentCardRequest,
  output: GetAgentCardResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    RuntimeClientError,
    ServiceQuotaExceededException,
    ThrottlingException,
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
 * Searches for and retrieves memory records from an AgentCore Memory resource based on specified search criteria. We recommend using pagination to ensure that the operation returns quickly and successfully.
 *
 * To use this operation, you must have the `bedrock-agentcore:RetrieveMemoryRecords` permission.
 */
export const retrieveMemoryRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RetrieveMemoryRecordsInput,
    output: RetrieveMemoryRecordsOutput,
    errors: [
      AccessDeniedException,
      InvalidInputException,
      ResourceNotFoundException,
      ServiceException,
      ServiceQuotaExceededException,
      ThrottledException,
      ValidationException,
    ],
  }),
);
/**
 * Starts a memory extraction job that processes events that failed extraction previously in an AgentCore Memory resource and produces structured memory records. When earlier extraction attempts have left events unprocessed, this job will pick up and extract those as well.
 *
 * To use this operation, you must have the `bedrock-agentcore:StartMemoryExtractionJob` permission.
 */
export const startMemoryExtractionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMemoryExtractionJobInput,
    output: StartMemoryExtractionJobOutput,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ServiceException,
      ServiceQuotaExceededException,
      ThrottledException,
      ValidationException,
    ],
  }),
);
/**
 * Creates multiple memory records in a single batch operation for the specified memory with custom content.
 */
export const batchCreateMemoryRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchCreateMemoryRecordsInput,
    output: BatchCreateMemoryRecordsOutput,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ServiceException,
      ServiceQuotaExceededException,
      ThrottledException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes multiple memory records in a single batch operation from the specified memory.
 */
export const batchDeleteMemoryRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteMemoryRecordsInput,
    output: BatchDeleteMemoryRecordsOutput,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ServiceException,
      ServiceQuotaExceededException,
      ThrottledException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a specific memory record from an AgentCore Memory resource.
 *
 * To use this operation, you must have the `bedrock-agentcore:GetMemoryRecord` permission.
 */
export const getMemoryRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMemoryRecordInput,
  output: GetMemoryRecordOutput,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Lists all actors in an AgentCore Memory resource. We recommend using pagination to ensure that the operation returns quickly and successfully.
 *
 * To use this operation, you must have the `bedrock-agentcore:ListActors` permission.
 */
export const listActors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListActorsInput,
  output: ListActorsOutput,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Lists memory records in an AgentCore Memory resource based on specified criteria. We recommend using pagination to ensure that the operation returns quickly and successfully.
 *
 * To use this operation, you must have the `bedrock-agentcore:ListMemoryRecords` permission.
 */
export const listMemoryRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMemoryRecordsInput,
  output: ListMemoryRecordsOutput,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Lists sessions in an AgentCore Memory resource based on specified criteria. We recommend using pagination to ensure that the operation returns quickly and successfully.
 *
 * To use this operation, you must have the `bedrock-agentcore:ListSessions` permission.
 */
export const listSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSessionsInput,
  output: ListSessionsOutput,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Deletes an event from an AgentCore Memory resource. When you delete an event, it is permanently removed.
 *
 * To use this operation, you must have the `bedrock-agentcore:DeleteEvent` permission.
 */
export const deleteEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventInput,
  output: DeleteEventOutput,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Deletes a memory record from an AgentCore Memory resource. When you delete a memory record, it is permanently removed.
 *
 * To use this operation, you must have the `bedrock-agentcore:DeleteMemoryRecord` permission.
 */
export const deleteMemoryRecord = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMemoryRecordInput,
  output: DeleteMemoryRecordOutput,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Updates multiple memory records with custom content in a single batch operation within the specified memory.
 */
export const batchUpdateMemoryRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchUpdateMemoryRecordsInput,
    output: BatchUpdateMemoryRecordsOutput,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ServiceException,
      ServiceQuotaExceededException,
      ThrottledException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an event in an AgentCore Memory resource. Events represent interactions or activities that occur within a session and are associated with specific actors.
 *
 * To use this operation, you must have the `bedrock-agentcore:CreateEvent` permission.
 *
 * This operation is subject to request rate limiting.
 */
export const createEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventInput,
  output: CreateEventOutput,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Lists events in an AgentCore Memory resource based on specified criteria. We recommend using pagination to ensure that the operation returns quickly and successfully.
 *
 * To use this operation, you must have the `bedrock-agentcore:ListEvents` permission.
 */
export const listEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEventsInput,
  output: ListEventsOutput,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ThrottledException,
    ValidationException,
  ],
}));
/**
 * Lists all long-term memory extraction jobs that are eligible to be started with optional filtering.
 *
 * To use this operation, you must have the `bedrock-agentcore:ListMemoryExtractionJobs` permission.
 */
export const listMemoryExtractionJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMemoryExtractionJobsInput,
    output: ListMemoryExtractionJobsOutput,
    errors: [
      AccessDeniedException,
      ResourceNotFoundException,
      ServiceException,
      ServiceQuotaExceededException,
      ThrottledException,
      ValidationException,
    ],
  }),
);
/**
 * Performs on-demand evaluation of agent traces using a specified evaluator. This synchronous API accepts traces in OpenTelemetry format and returns immediate scoring results with detailed explanations.
 */
export const evaluate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EvaluateRequest,
  output: EvaluateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DuplicateIdException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UnauthorizedException,
    ValidationException,
  ],
}));
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

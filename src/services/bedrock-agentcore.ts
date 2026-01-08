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
  sdkId: "Bedrock AgentCore",
  serviceShapeName: "AmazonBedrockAgentCore",
});
const auth = T.AwsAuthSigv4({ name: "bedrock-agentcore" });
const ver = T.ServiceVersion("2024-02-28");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://bedrock-agentcore-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://bedrock-agentcore-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://bedrock-agentcore.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://bedrock-agentcore.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type RequestUri = string;
export type WorkloadIdentityTokenType = string | Redacted.Redacted<string>;
export type CredentialProviderName = string;
export type ScopeType = string;
export type ResourceOauth2ReturnUrlType = string;
export type State = string | Redacted.Redacted<string>;
export type WorkloadIdentityNameType = string;
export type UserTokenType = string | Redacted.Redacted<string>;
export type UserIdType = string;
export type CodeInterpreterSessionId = string;
export type SessionType = string;
export type MimeType = string;
export type StringType = string;
export type ClientToken = string;
export type BrowserSessionId = string;
export type MaxResults = number;
export type NextToken = string;
export type Name = string;
export type BrowserSessionTimeout = number;
export type CodeInterpreterSessionTimeout = number;
export type EvaluatorId = string;
export type MemoryId = string;
export type ActorId = string;
export type SessionId = string;
export type EventId = string;
export type MemoryRecordId = string;
export type PaginationToken = string;
export type Namespace = string;
export type MemoryStrategyId = string;
export type CustomRequestKeyType = string;
export type CustomRequestValueType = string | Redacted.Redacted<string>;
export type MaxLenString = string;
export type ViewPortWidth = number;
export type ViewPortHeight = number;
export type SpanId = string;
export type TraceId = string;
export type RequestIdentifier = string;
export type BranchName = string;
export type MetadataKey = string;
export type SensitiveString = string | Redacted.Redacted<string>;
export type ApiKeyType = string | Redacted.Redacted<string>;
export type HttpResponseCode = number;
export type NonBlankString = string;
export type AuthorizationUrlType = string | Redacted.Redacted<string>;
export type AccessTokenType = string | Redacted.Redacted<string>;
export type BrowserStreamEndpoint = string;
export type EvaluatorArn = string;
export type EvaluatorName = string;
export type EvaluationExplanation = string | Redacted.Redacted<string>;
export type EvaluationErrorMessage = string;
export type EvaluationErrorCode = string;

//# Schemas
export type ScopesListType = string[];
export const ScopesListType = S.Array(S.String);
export interface GetResourceApiKeyRequest {
  workloadIdentityToken: string | Redacted.Redacted<string>;
  resourceCredentialProviderName: string;
}
export const GetResourceApiKeyRequest = S.suspend(() =>
  S.Struct({
    workloadIdentityToken: SensitiveString,
    resourceCredentialProviderName: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identities/api-key" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceApiKeyRequest",
}) as any as S.Schema<GetResourceApiKeyRequest>;
export interface GetWorkloadAccessTokenRequest {
  workloadName: string;
}
export const GetWorkloadAccessTokenRequest = S.suspend(() =>
  S.Struct({ workloadName: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identities/GetWorkloadAccessToken" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkloadAccessTokenRequest",
}) as any as S.Schema<GetWorkloadAccessTokenRequest>;
export interface GetWorkloadAccessTokenForJWTRequest {
  workloadName: string;
  userToken: string | Redacted.Redacted<string>;
}
export const GetWorkloadAccessTokenForJWTRequest = S.suspend(() =>
  S.Struct({ workloadName: S.String, userToken: SensitiveString }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/identities/GetWorkloadAccessTokenForJWT",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkloadAccessTokenForJWTRequest",
}) as any as S.Schema<GetWorkloadAccessTokenForJWTRequest>;
export interface GetWorkloadAccessTokenForUserIdRequest {
  workloadName: string;
  userId: string;
}
export const GetWorkloadAccessTokenForUserIdRequest = S.suspend(() =>
  S.Struct({ workloadName: S.String, userId: S.String }).pipe(
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
  ),
).annotations({
  identifier: "GetWorkloadAccessTokenForUserIdRequest",
}) as any as S.Schema<GetWorkloadAccessTokenForUserIdRequest>;
export interface GetAgentCardRequest {
  runtimeSessionId?: string;
  agentRuntimeArn: string;
  qualifier?: string;
}
export const GetAgentCardRequest = S.suspend(() =>
  S.Struct({
    runtimeSessionId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-AgentCore-Runtime-Session-Id"),
    ),
    agentRuntimeArn: S.String.pipe(T.HttpLabel("agentRuntimeArn")),
    qualifier: S.optional(S.String).pipe(T.HttpQuery("qualifier")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetAgentCardRequest",
}) as any as S.Schema<GetAgentCardRequest>;
export interface InvokeAgentRuntimeRequest {
  contentType?: string;
  accept?: string;
  mcpSessionId?: string;
  runtimeSessionId?: string;
  mcpProtocolVersion?: string;
  runtimeUserId?: string;
  traceId?: string;
  traceParent?: string;
  traceState?: string;
  baggage?: string;
  agentRuntimeArn: string;
  qualifier?: string;
  accountId?: string;
  payload: T.StreamingInputBody;
}
export const InvokeAgentRuntimeRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/runtimes/{agentRuntimeArn}/invocations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InvokeAgentRuntimeRequest",
}) as any as S.Schema<InvokeAgentRuntimeRequest>;
export interface StopRuntimeSessionRequest {
  runtimeSessionId: string;
  agentRuntimeArn: string;
  qualifier?: string;
  clientToken?: string;
}
export const StopRuntimeSessionRequest = S.suspend(() =>
  S.Struct({
    runtimeSessionId: S.String.pipe(
      T.HttpHeader("X-Amzn-Bedrock-AgentCore-Runtime-Session-Id"),
    ),
    agentRuntimeArn: S.String.pipe(T.HttpLabel("agentRuntimeArn")),
    qualifier: S.optional(S.String).pipe(T.HttpQuery("qualifier")),
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopRuntimeSessionRequest",
}) as any as S.Schema<StopRuntimeSessionRequest>;
export interface GetBrowserSessionRequest {
  browserIdentifier: string;
  sessionId: string;
}
export const GetBrowserSessionRequest = S.suspend(() =>
  S.Struct({
    browserIdentifier: S.String.pipe(T.HttpLabel("browserIdentifier")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetBrowserSessionRequest",
}) as any as S.Schema<GetBrowserSessionRequest>;
export interface ListBrowserSessionsRequest {
  browserIdentifier: string;
  maxResults?: number;
  nextToken?: string;
  status?: string;
}
export const ListBrowserSessionsRequest = S.suspend(() =>
  S.Struct({
    browserIdentifier: S.String.pipe(T.HttpLabel("browserIdentifier")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    status: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListBrowserSessionsRequest",
}) as any as S.Schema<ListBrowserSessionsRequest>;
export interface StopBrowserSessionRequest {
  traceId?: string;
  traceParent?: string;
  browserIdentifier: string;
  sessionId: string;
  clientToken?: string;
}
export const StopBrowserSessionRequest = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Trace-Id")),
    traceParent: S.optional(S.String).pipe(T.HttpHeader("traceparent")),
    browserIdentifier: S.String.pipe(T.HttpLabel("browserIdentifier")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopBrowserSessionRequest",
}) as any as S.Schema<StopBrowserSessionRequest>;
export interface GetCodeInterpreterSessionRequest {
  codeInterpreterIdentifier: string;
  sessionId: string;
}
export const GetCodeInterpreterSessionRequest = S.suspend(() =>
  S.Struct({
    codeInterpreterIdentifier: S.String.pipe(
      T.HttpLabel("codeInterpreterIdentifier"),
    ),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetCodeInterpreterSessionRequest",
}) as any as S.Schema<GetCodeInterpreterSessionRequest>;
export interface ListCodeInterpreterSessionsRequest {
  codeInterpreterIdentifier: string;
  maxResults?: number;
  nextToken?: string;
  status?: string;
}
export const ListCodeInterpreterSessionsRequest = S.suspend(() =>
  S.Struct({
    codeInterpreterIdentifier: S.String.pipe(
      T.HttpLabel("codeInterpreterIdentifier"),
    ),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    status: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListCodeInterpreterSessionsRequest",
}) as any as S.Schema<ListCodeInterpreterSessionsRequest>;
export interface StartCodeInterpreterSessionRequest {
  traceId?: string;
  traceParent?: string;
  codeInterpreterIdentifier: string;
  name?: string;
  sessionTimeoutSeconds?: number;
  clientToken?: string;
}
export const StartCodeInterpreterSessionRequest = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Trace-Id")),
    traceParent: S.optional(S.String).pipe(T.HttpHeader("traceparent")),
    codeInterpreterIdentifier: S.String.pipe(
      T.HttpLabel("codeInterpreterIdentifier"),
    ),
    name: S.optional(S.String),
    sessionTimeoutSeconds: S.optional(S.Number),
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartCodeInterpreterSessionRequest",
}) as any as S.Schema<StartCodeInterpreterSessionRequest>;
export interface StopCodeInterpreterSessionRequest {
  traceId?: string;
  traceParent?: string;
  codeInterpreterIdentifier: string;
  sessionId: string;
  clientToken?: string;
}
export const StopCodeInterpreterSessionRequest = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Trace-Id")),
    traceParent: S.optional(S.String).pipe(T.HttpHeader("traceparent")),
    codeInterpreterIdentifier: S.String.pipe(
      T.HttpLabel("codeInterpreterIdentifier"),
    ),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopCodeInterpreterSessionRequest",
}) as any as S.Schema<StopCodeInterpreterSessionRequest>;
export interface DeleteEventInput {
  memoryId: string;
  sessionId: string;
  eventId: string;
  actorId: string;
}
export const DeleteEventInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    eventId: S.String.pipe(T.HttpLabel("eventId")),
    actorId: S.String.pipe(T.HttpLabel("actorId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteEventInput",
}) as any as S.Schema<DeleteEventInput>;
export interface DeleteMemoryRecordInput {
  memoryId: string;
  memoryRecordId: string;
}
export const DeleteMemoryRecordInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    memoryRecordId: S.String.pipe(T.HttpLabel("memoryRecordId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteMemoryRecordInput",
}) as any as S.Schema<DeleteMemoryRecordInput>;
export interface GetEventInput {
  memoryId: string;
  sessionId: string;
  actorId: string;
  eventId: string;
}
export const GetEventInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    actorId: S.String.pipe(T.HttpLabel("actorId")),
    eventId: S.String.pipe(T.HttpLabel("eventId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetEventInput",
}) as any as S.Schema<GetEventInput>;
export interface GetMemoryRecordInput {
  memoryId: string;
  memoryRecordId: string;
}
export const GetMemoryRecordInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    memoryRecordId: S.String.pipe(T.HttpLabel("memoryRecordId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetMemoryRecordInput",
}) as any as S.Schema<GetMemoryRecordInput>;
export interface ListActorsInput {
  memoryId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListActorsInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/memories/{memoryId}/actors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListActorsInput",
}) as any as S.Schema<ListActorsInput>;
export interface ListMemoryRecordsInput {
  memoryId: string;
  namespace: string;
  memoryStrategyId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListMemoryRecordsInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    namespace: S.String,
    memoryStrategyId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/memories/{memoryId}/memoryRecords" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMemoryRecordsInput",
}) as any as S.Schema<ListMemoryRecordsInput>;
export interface ListSessionsInput {
  memoryId: string;
  actorId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSessionsInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    actorId: S.String.pipe(T.HttpLabel("actorId")),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListSessionsInput",
}) as any as S.Schema<ListSessionsInput>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export type Spans = any[];
export const Spans = S.Array(S.Any);
export type SpanIds = string[];
export const SpanIds = S.Array(S.String);
export type TraceIds = string[];
export const TraceIds = S.Array(S.String);
export type NamespacesList = string[];
export const NamespacesList = S.Array(S.String);
export type UserIdentifier =
  | { userToken: string | Redacted.Redacted<string> }
  | { userId: string };
export const UserIdentifier = S.Union(
  S.Struct({ userToken: SensitiveString }),
  S.Struct({ userId: S.String }),
);
export type CustomRequestParametersType = {
  [key: string]: string | Redacted.Redacted<string>;
};
export const CustomRequestParametersType = S.Record({
  key: S.String,
  value: SensitiveString,
});
export interface ViewPort {
  width: number;
  height: number;
}
export const ViewPort = S.suspend(() =>
  S.Struct({ width: S.Number, height: S.Number }),
).annotations({ identifier: "ViewPort" }) as any as S.Schema<ViewPort>;
export type EvaluationInput = { sessionSpans: Spans };
export const EvaluationInput = S.Union(S.Struct({ sessionSpans: Spans }));
export type EvaluationTarget = { spanIds: SpanIds } | { traceIds: TraceIds };
export const EvaluationTarget = S.Union(
  S.Struct({ spanIds: SpanIds }),
  S.Struct({ traceIds: TraceIds }),
);
export interface MemoryRecordDeleteInput {
  memoryRecordId: string;
}
export const MemoryRecordDeleteInput = S.suspend(() =>
  S.Struct({ memoryRecordId: S.String }),
).annotations({
  identifier: "MemoryRecordDeleteInput",
}) as any as S.Schema<MemoryRecordDeleteInput>;
export type MemoryRecordsDeleteInputList = MemoryRecordDeleteInput[];
export const MemoryRecordsDeleteInputList = S.Array(MemoryRecordDeleteInput);
export type MemoryContent = { text: string | Redacted.Redacted<string> };
export const MemoryContent = S.Union(S.Struct({ text: SensitiveString }));
export interface MemoryRecordUpdateInput {
  memoryRecordId: string;
  timestamp: Date;
  content?: (typeof MemoryContent)["Type"];
  namespaces?: NamespacesList;
  memoryStrategyId?: string;
}
export const MemoryRecordUpdateInput = S.suspend(() =>
  S.Struct({
    memoryRecordId: S.String,
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    content: S.optional(MemoryContent),
    namespaces: S.optional(NamespacesList),
    memoryStrategyId: S.optional(S.String),
  }),
).annotations({
  identifier: "MemoryRecordUpdateInput",
}) as any as S.Schema<MemoryRecordUpdateInput>;
export type MemoryRecordsUpdateInputList = MemoryRecordUpdateInput[];
export const MemoryRecordsUpdateInputList = S.Array(MemoryRecordUpdateInput);
export interface Branch {
  rootEventId?: string;
  name: string;
}
export const Branch = S.suspend(() =>
  S.Struct({ rootEventId: S.optional(S.String), name: S.String }),
).annotations({ identifier: "Branch" }) as any as S.Schema<Branch>;
export interface ExtractionJobFilterInput {
  strategyId?: string;
  sessionId?: string;
  actorId?: string;
  status?: string;
}
export const ExtractionJobFilterInput = S.suspend(() =>
  S.Struct({
    strategyId: S.optional(S.String),
    sessionId: S.optional(S.String),
    actorId: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "ExtractionJobFilterInput",
}) as any as S.Schema<ExtractionJobFilterInput>;
export interface ExtractionJob {
  jobId: string;
}
export const ExtractionJob = S.suspend(() =>
  S.Struct({ jobId: S.String }),
).annotations({
  identifier: "ExtractionJob",
}) as any as S.Schema<ExtractionJob>;
export interface CompleteResourceTokenAuthRequest {
  userIdentifier: (typeof UserIdentifier)["Type"];
  sessionUri: string;
}
export const CompleteResourceTokenAuthRequest = S.suspend(() =>
  S.Struct({ userIdentifier: UserIdentifier, sessionUri: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identities/CompleteResourceTokenAuth" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CompleteResourceTokenAuthRequest",
}) as any as S.Schema<CompleteResourceTokenAuthRequest>;
export interface CompleteResourceTokenAuthResponse {}
export const CompleteResourceTokenAuthResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CompleteResourceTokenAuthResponse",
}) as any as S.Schema<CompleteResourceTokenAuthResponse>;
export interface GetResourceApiKeyResponse {
  apiKey: string | Redacted.Redacted<string>;
}
export const GetResourceApiKeyResponse = S.suspend(() =>
  S.Struct({ apiKey: SensitiveString }),
).annotations({
  identifier: "GetResourceApiKeyResponse",
}) as any as S.Schema<GetResourceApiKeyResponse>;
export interface GetResourceOauth2TokenRequest {
  workloadIdentityToken: string | Redacted.Redacted<string>;
  resourceCredentialProviderName: string;
  scopes: ScopesListType;
  oauth2Flow: string;
  sessionUri?: string;
  resourceOauth2ReturnUrl?: string;
  forceAuthentication?: boolean;
  customParameters?: CustomRequestParametersType;
  customState?: string | Redacted.Redacted<string>;
}
export const GetResourceOauth2TokenRequest = S.suspend(() =>
  S.Struct({
    workloadIdentityToken: SensitiveString,
    resourceCredentialProviderName: S.String,
    scopes: ScopesListType,
    oauth2Flow: S.String,
    sessionUri: S.optional(S.String),
    resourceOauth2ReturnUrl: S.optional(S.String),
    forceAuthentication: S.optional(S.Boolean),
    customParameters: S.optional(CustomRequestParametersType),
    customState: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/identities/oauth2/token" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceOauth2TokenRequest",
}) as any as S.Schema<GetResourceOauth2TokenRequest>;
export interface GetWorkloadAccessTokenResponse {
  workloadAccessToken: string | Redacted.Redacted<string>;
}
export const GetWorkloadAccessTokenResponse = S.suspend(() =>
  S.Struct({ workloadAccessToken: SensitiveString }),
).annotations({
  identifier: "GetWorkloadAccessTokenResponse",
}) as any as S.Schema<GetWorkloadAccessTokenResponse>;
export interface GetWorkloadAccessTokenForJWTResponse {
  workloadAccessToken: string | Redacted.Redacted<string>;
}
export const GetWorkloadAccessTokenForJWTResponse = S.suspend(() =>
  S.Struct({ workloadAccessToken: SensitiveString }),
).annotations({
  identifier: "GetWorkloadAccessTokenForJWTResponse",
}) as any as S.Schema<GetWorkloadAccessTokenForJWTResponse>;
export interface GetWorkloadAccessTokenForUserIdResponse {
  workloadAccessToken: string | Redacted.Redacted<string>;
}
export const GetWorkloadAccessTokenForUserIdResponse = S.suspend(() =>
  S.Struct({ workloadAccessToken: SensitiveString }),
).annotations({
  identifier: "GetWorkloadAccessTokenForUserIdResponse",
}) as any as S.Schema<GetWorkloadAccessTokenForUserIdResponse>;
export interface GetAgentCardResponse {
  runtimeSessionId?: string;
  agentCard: any;
  statusCode?: number;
}
export const GetAgentCardResponse = S.suspend(() =>
  S.Struct({
    runtimeSessionId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-AgentCore-Runtime-Session-Id"),
    ),
    agentCard: S.Any.pipe(T.HttpPayload()),
    statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
  }),
).annotations({
  identifier: "GetAgentCardResponse",
}) as any as S.Schema<GetAgentCardResponse>;
export interface InvokeAgentRuntimeResponse {
  runtimeSessionId?: string;
  mcpSessionId?: string;
  mcpProtocolVersion?: string;
  traceId?: string;
  traceParent?: string;
  traceState?: string;
  baggage?: string;
  contentType: string;
  response?: T.StreamingOutputBody;
  statusCode?: number;
}
export const InvokeAgentRuntimeResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "InvokeAgentRuntimeResponse",
}) as any as S.Schema<InvokeAgentRuntimeResponse>;
export interface StopRuntimeSessionResponse {
  runtimeSessionId?: string;
  statusCode?: number;
}
export const StopRuntimeSessionResponse = S.suspend(() =>
  S.Struct({
    runtimeSessionId: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Bedrock-AgentCore-Runtime-Session-Id"),
    ),
    statusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
  }),
).annotations({
  identifier: "StopRuntimeSessionResponse",
}) as any as S.Schema<StopRuntimeSessionResponse>;
export interface StartBrowserSessionRequest {
  traceId?: string;
  traceParent?: string;
  browserIdentifier: string;
  name?: string;
  sessionTimeoutSeconds?: number;
  viewPort?: ViewPort;
  clientToken?: string;
}
export const StartBrowserSessionRequest = S.suspend(() =>
  S.Struct({
    traceId: S.optional(S.String).pipe(T.HttpHeader("X-Amzn-Trace-Id")),
    traceParent: S.optional(S.String).pipe(T.HttpHeader("traceparent")),
    browserIdentifier: S.String.pipe(T.HttpLabel("browserIdentifier")),
    name: S.optional(S.String),
    sessionTimeoutSeconds: S.optional(S.Number),
    viewPort: S.optional(ViewPort),
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartBrowserSessionRequest",
}) as any as S.Schema<StartBrowserSessionRequest>;
export interface StopBrowserSessionResponse {
  browserIdentifier: string;
  sessionId: string;
  lastUpdatedAt: Date;
}
export const StopBrowserSessionResponse = S.suspend(() =>
  S.Struct({
    browserIdentifier: S.String,
    sessionId: S.String,
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "StopBrowserSessionResponse",
}) as any as S.Schema<StopBrowserSessionResponse>;
export interface GetCodeInterpreterSessionResponse {
  codeInterpreterIdentifier: string;
  sessionId: string;
  name?: string;
  createdAt: Date;
  sessionTimeoutSeconds?: number;
  status?: string;
}
export const GetCodeInterpreterSessionResponse = S.suspend(() =>
  S.Struct({
    codeInterpreterIdentifier: S.String,
    sessionId: S.String,
    name: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    sessionTimeoutSeconds: S.optional(S.Number),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCodeInterpreterSessionResponse",
}) as any as S.Schema<GetCodeInterpreterSessionResponse>;
export interface StartCodeInterpreterSessionResponse {
  codeInterpreterIdentifier: string;
  sessionId: string;
  createdAt: Date;
}
export const StartCodeInterpreterSessionResponse = S.suspend(() =>
  S.Struct({
    codeInterpreterIdentifier: S.String,
    sessionId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "StartCodeInterpreterSessionResponse",
}) as any as S.Schema<StartCodeInterpreterSessionResponse>;
export interface StopCodeInterpreterSessionResponse {
  codeInterpreterIdentifier: string;
  sessionId: string;
  lastUpdatedAt: Date;
}
export const StopCodeInterpreterSessionResponse = S.suspend(() =>
  S.Struct({
    codeInterpreterIdentifier: S.String,
    sessionId: S.String,
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "StopCodeInterpreterSessionResponse",
}) as any as S.Schema<StopCodeInterpreterSessionResponse>;
export interface EvaluateRequest {
  evaluatorId: string;
  evaluationInput: (typeof EvaluationInput)["Type"];
  evaluationTarget?: (typeof EvaluationTarget)["Type"];
}
export const EvaluateRequest = S.suspend(() =>
  S.Struct({
    evaluatorId: S.String.pipe(T.HttpLabel("evaluatorId")),
    evaluationInput: EvaluationInput,
    evaluationTarget: S.optional(EvaluationTarget),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/evaluations/evaluate/{evaluatorId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EvaluateRequest",
}) as any as S.Schema<EvaluateRequest>;
export interface BatchDeleteMemoryRecordsInput {
  memoryId: string;
  records: MemoryRecordsDeleteInputList;
}
export const BatchDeleteMemoryRecordsInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    records: MemoryRecordsDeleteInputList,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchDeleteMemoryRecordsInput",
}) as any as S.Schema<BatchDeleteMemoryRecordsInput>;
export interface BatchUpdateMemoryRecordsInput {
  memoryId: string;
  records: MemoryRecordsUpdateInputList;
}
export const BatchUpdateMemoryRecordsInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    records: MemoryRecordsUpdateInputList,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchUpdateMemoryRecordsInput",
}) as any as S.Schema<BatchUpdateMemoryRecordsInput>;
export interface DeleteEventOutput {
  eventId: string;
}
export const DeleteEventOutput = S.suspend(() =>
  S.Struct({ eventId: S.String }),
).annotations({
  identifier: "DeleteEventOutput",
}) as any as S.Schema<DeleteEventOutput>;
export interface DeleteMemoryRecordOutput {
  memoryRecordId: string;
}
export const DeleteMemoryRecordOutput = S.suspend(() =>
  S.Struct({ memoryRecordId: S.String }),
).annotations({
  identifier: "DeleteMemoryRecordOutput",
}) as any as S.Schema<DeleteMemoryRecordOutput>;
export interface ListMemoryExtractionJobsInput {
  memoryId: string;
  maxResults?: number;
  filter?: ExtractionJobFilterInput;
  nextToken?: string;
}
export const ListMemoryExtractionJobsInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    maxResults: S.optional(S.Number),
    filter: S.optional(ExtractionJobFilterInput),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/memories/{memoryId}/extractionJobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMemoryExtractionJobsInput",
}) as any as S.Schema<ListMemoryExtractionJobsInput>;
export interface StartMemoryExtractionJobInput {
  memoryId: string;
  extractionJob: ExtractionJob;
  clientToken?: string;
}
export const StartMemoryExtractionJobInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    extractionJob: ExtractionJob,
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartMemoryExtractionJobInput",
}) as any as S.Schema<StartMemoryExtractionJobInput>;
export interface InputContentBlock {
  path: string;
  text?: string;
  blob?: Uint8Array | Redacted.Redacted<Uint8Array>;
}
export const InputContentBlock = S.suspend(() =>
  S.Struct({
    path: S.String,
    text: S.optional(S.String),
    blob: S.optional(SensitiveBlob),
  }),
).annotations({
  identifier: "InputContentBlock",
}) as any as S.Schema<InputContentBlock>;
export type InputContentBlockList = InputContentBlock[];
export const InputContentBlockList = S.Array(InputContentBlock);
export interface AutomationStreamUpdate {
  streamStatus?: string;
}
export const AutomationStreamUpdate = S.suspend(() =>
  S.Struct({ streamStatus: S.optional(S.String) }),
).annotations({
  identifier: "AutomationStreamUpdate",
}) as any as S.Schema<AutomationStreamUpdate>;
export type MetadataValue = { stringValue: string };
export const MetadataValue = S.Union(S.Struct({ stringValue: S.String }));
export interface BranchFilter {
  name: string;
  includeParentBranches?: boolean;
}
export const BranchFilter = S.suspend(() =>
  S.Struct({ name: S.String, includeParentBranches: S.optional(S.Boolean) }),
).annotations({ identifier: "BranchFilter" }) as any as S.Schema<BranchFilter>;
export type LeftExpression = { metadataKey: string };
export const LeftExpression = S.Union(S.Struct({ metadataKey: S.String }));
export type RightExpression = { metadataValue: (typeof MetadataValue)["Type"] };
export const RightExpression = S.Union(
  S.Struct({ metadataValue: MetadataValue }),
);
export interface MemoryMetadataFilterExpression {
  left: (typeof LeftExpression)["Type"];
  operator: string;
  right?: (typeof RightExpression)["Type"];
}
export const MemoryMetadataFilterExpression = S.suspend(() =>
  S.Struct({
    left: LeftExpression,
    operator: S.String,
    right: S.optional(RightExpression),
  }),
).annotations({
  identifier: "MemoryMetadataFilterExpression",
}) as any as S.Schema<MemoryMetadataFilterExpression>;
export type MemoryMetadataFilterList = MemoryMetadataFilterExpression[];
export const MemoryMetadataFilterList = S.Array(MemoryMetadataFilterExpression);
export interface ToolArguments {
  code?: string;
  language?: string;
  clearContext?: boolean;
  command?: string;
  path?: string;
  paths?: StringList;
  content?: InputContentBlockList;
  directoryPath?: string;
  taskId?: string;
}
export const ToolArguments = S.suspend(() =>
  S.Struct({
    code: S.optional(S.String),
    language: S.optional(S.String),
    clearContext: S.optional(S.Boolean),
    command: S.optional(S.String),
    path: S.optional(S.String),
    paths: S.optional(StringList),
    content: S.optional(InputContentBlockList),
    directoryPath: S.optional(S.String),
    taskId: S.optional(S.String),
  }),
).annotations({
  identifier: "ToolArguments",
}) as any as S.Schema<ToolArguments>;
export interface BrowserSessionSummary {
  browserIdentifier: string;
  sessionId: string;
  name?: string;
  status: string;
  createdAt: Date;
  lastUpdatedAt?: Date;
}
export const BrowserSessionSummary = S.suspend(() =>
  S.Struct({
    browserIdentifier: S.String,
    sessionId: S.String,
    name: S.optional(S.String),
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "BrowserSessionSummary",
}) as any as S.Schema<BrowserSessionSummary>;
export type BrowserSessionSummaries = BrowserSessionSummary[];
export const BrowserSessionSummaries = S.Array(BrowserSessionSummary);
export type StreamUpdate = { automationStreamUpdate: AutomationStreamUpdate };
export const StreamUpdate = S.Union(
  S.Struct({ automationStreamUpdate: AutomationStreamUpdate }),
);
export interface CodeInterpreterSessionSummary {
  codeInterpreterIdentifier: string;
  sessionId: string;
  name?: string;
  status: string;
  createdAt: Date;
  lastUpdatedAt?: Date;
}
export const CodeInterpreterSessionSummary = S.suspend(() =>
  S.Struct({
    codeInterpreterIdentifier: S.String,
    sessionId: S.String,
    name: S.optional(S.String),
    status: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "CodeInterpreterSessionSummary",
}) as any as S.Schema<CodeInterpreterSessionSummary>;
export type CodeInterpreterSessionSummaries = CodeInterpreterSessionSummary[];
export const CodeInterpreterSessionSummaries = S.Array(
  CodeInterpreterSessionSummary,
);
export interface MemoryRecordCreateInput {
  requestIdentifier: string;
  namespaces: NamespacesList;
  content: (typeof MemoryContent)["Type"];
  timestamp: Date;
  memoryStrategyId?: string;
}
export const MemoryRecordCreateInput = S.suspend(() =>
  S.Struct({
    requestIdentifier: S.String,
    namespaces: NamespacesList,
    content: MemoryContent,
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    memoryStrategyId: S.optional(S.String),
  }),
).annotations({
  identifier: "MemoryRecordCreateInput",
}) as any as S.Schema<MemoryRecordCreateInput>;
export type MemoryRecordsCreateInputList = MemoryRecordCreateInput[];
export const MemoryRecordsCreateInputList = S.Array(MemoryRecordCreateInput);
export type MetadataMap = { [key: string]: (typeof MetadataValue)["Type"] };
export const MetadataMap = S.Record({ key: S.String, value: MetadataValue });
export type Content = { text: string | Redacted.Redacted<string> };
export const Content = S.Union(S.Struct({ text: SensitiveString }));
export interface Conversational {
  content: (typeof Content)["Type"];
  role: string;
}
export const Conversational = S.suspend(() =>
  S.Struct({ content: Content, role: S.String }),
).annotations({
  identifier: "Conversational",
}) as any as S.Schema<Conversational>;
export type PayloadType = { conversational: Conversational } | { blob: any };
export const PayloadType = S.Union(
  S.Struct({ conversational: Conversational }),
  S.Struct({ blob: S.Any }),
);
export type PayloadTypeList = (typeof PayloadType)["Type"][];
export const PayloadTypeList = S.Array(PayloadType);
export interface Event {
  memoryId: string;
  actorId: string;
  sessionId: string;
  eventId: string;
  eventTimestamp: Date;
  payload: PayloadTypeList;
  branch?: Branch;
  metadata?: MetadataMap;
}
export const Event = S.suspend(() =>
  S.Struct({
    memoryId: S.String,
    actorId: S.String,
    sessionId: S.String,
    eventId: S.String,
    eventTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    payload: PayloadTypeList,
    branch: S.optional(Branch),
    metadata: S.optional(MetadataMap),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export interface MemoryRecord {
  memoryRecordId: string;
  content: (typeof MemoryContent)["Type"];
  memoryStrategyId: string;
  namespaces: NamespacesList;
  createdAt: Date;
  metadata?: MetadataMap;
}
export const MemoryRecord = S.suspend(() =>
  S.Struct({
    memoryRecordId: S.String,
    content: MemoryContent,
    memoryStrategyId: S.String,
    namespaces: NamespacesList,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    metadata: S.optional(MetadataMap),
  }),
).annotations({ identifier: "MemoryRecord" }) as any as S.Schema<MemoryRecord>;
export interface ActorSummary {
  actorId: string;
}
export const ActorSummary = S.suspend(() =>
  S.Struct({ actorId: S.String }),
).annotations({ identifier: "ActorSummary" }) as any as S.Schema<ActorSummary>;
export type ActorSummaryList = ActorSummary[];
export const ActorSummaryList = S.Array(ActorSummary);
export interface MemoryRecordSummary {
  memoryRecordId: string;
  content: (typeof MemoryContent)["Type"];
  memoryStrategyId: string;
  namespaces: NamespacesList;
  createdAt: Date;
  score?: number;
  metadata?: MetadataMap;
}
export const MemoryRecordSummary = S.suspend(() =>
  S.Struct({
    memoryRecordId: S.String,
    content: MemoryContent,
    memoryStrategyId: S.String,
    namespaces: NamespacesList,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    score: S.optional(S.Number),
    metadata: S.optional(MetadataMap),
  }),
).annotations({
  identifier: "MemoryRecordSummary",
}) as any as S.Schema<MemoryRecordSummary>;
export type MemoryRecordSummaryList = MemoryRecordSummary[];
export const MemoryRecordSummaryList = S.Array(MemoryRecordSummary);
export interface SessionSummary {
  sessionId: string;
  actorId: string;
  createdAt: Date;
}
export const SessionSummary = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    actorId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "SessionSummary",
}) as any as S.Schema<SessionSummary>;
export type SessionSummaryList = SessionSummary[];
export const SessionSummaryList = S.Array(SessionSummary);
export interface SearchCriteria {
  searchQuery: string | Redacted.Redacted<string>;
  memoryStrategyId?: string;
  topK?: number;
  metadataFilters?: MemoryMetadataFilterList;
}
export const SearchCriteria = S.suspend(() =>
  S.Struct({
    searchQuery: SensitiveString,
    memoryStrategyId: S.optional(S.String),
    topK: S.optional(S.Number),
    metadataFilters: S.optional(MemoryMetadataFilterList),
  }),
).annotations({
  identifier: "SearchCriteria",
}) as any as S.Schema<SearchCriteria>;
export interface GetResourceOauth2TokenResponse {
  authorizationUrl?: string | Redacted.Redacted<string>;
  accessToken?: string | Redacted.Redacted<string>;
  sessionUri?: string;
  sessionStatus?: string;
}
export const GetResourceOauth2TokenResponse = S.suspend(() =>
  S.Struct({
    authorizationUrl: S.optional(SensitiveString),
    accessToken: S.optional(SensitiveString),
    sessionUri: S.optional(S.String),
    sessionStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourceOauth2TokenResponse",
}) as any as S.Schema<GetResourceOauth2TokenResponse>;
export interface InvokeCodeInterpreterRequest {
  codeInterpreterIdentifier: string;
  sessionId?: string;
  traceId?: string;
  traceParent?: string;
  name: string;
  arguments?: ToolArguments;
}
export const InvokeCodeInterpreterRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "InvokeCodeInterpreterRequest",
}) as any as S.Schema<InvokeCodeInterpreterRequest>;
export interface ListBrowserSessionsResponse {
  items: BrowserSessionSummaries;
  nextToken?: string;
}
export const ListBrowserSessionsResponse = S.suspend(() =>
  S.Struct({ items: BrowserSessionSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListBrowserSessionsResponse",
}) as any as S.Schema<ListBrowserSessionsResponse>;
export interface AutomationStream {
  streamEndpoint: string;
  streamStatus: string;
}
export const AutomationStream = S.suspend(() =>
  S.Struct({ streamEndpoint: S.String, streamStatus: S.String }),
).annotations({
  identifier: "AutomationStream",
}) as any as S.Schema<AutomationStream>;
export interface LiveViewStream {
  streamEndpoint?: string;
}
export const LiveViewStream = S.suspend(() =>
  S.Struct({ streamEndpoint: S.optional(S.String) }),
).annotations({
  identifier: "LiveViewStream",
}) as any as S.Schema<LiveViewStream>;
export interface BrowserSessionStream {
  automationStream: AutomationStream;
  liveViewStream?: LiveViewStream;
}
export const BrowserSessionStream = S.suspend(() =>
  S.Struct({
    automationStream: AutomationStream,
    liveViewStream: S.optional(LiveViewStream),
  }),
).annotations({
  identifier: "BrowserSessionStream",
}) as any as S.Schema<BrowserSessionStream>;
export interface StartBrowserSessionResponse {
  browserIdentifier: string;
  sessionId: string;
  createdAt: Date;
  streams?: BrowserSessionStream;
}
export const StartBrowserSessionResponse = S.suspend(() =>
  S.Struct({
    browserIdentifier: S.String,
    sessionId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    streams: S.optional(BrowserSessionStream),
  }),
).annotations({
  identifier: "StartBrowserSessionResponse",
}) as any as S.Schema<StartBrowserSessionResponse>;
export interface UpdateBrowserStreamRequest {
  browserIdentifier: string;
  sessionId: string;
  streamUpdate: (typeof StreamUpdate)["Type"];
  clientToken?: string;
}
export const UpdateBrowserStreamRequest = S.suspend(() =>
  S.Struct({
    browserIdentifier: S.String.pipe(T.HttpLabel("browserIdentifier")),
    sessionId: S.String.pipe(T.HttpQuery("sessionId")),
    streamUpdate: StreamUpdate,
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateBrowserStreamRequest",
}) as any as S.Schema<UpdateBrowserStreamRequest>;
export interface ListCodeInterpreterSessionsResponse {
  items: CodeInterpreterSessionSummaries;
  nextToken?: string;
}
export const ListCodeInterpreterSessionsResponse = S.suspend(() =>
  S.Struct({
    items: CodeInterpreterSessionSummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCodeInterpreterSessionsResponse",
}) as any as S.Schema<ListCodeInterpreterSessionsResponse>;
export interface BatchCreateMemoryRecordsInput {
  memoryId: string;
  records: MemoryRecordsCreateInputList;
  clientToken?: string;
}
export const BatchCreateMemoryRecordsInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    records: MemoryRecordsCreateInputList,
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchCreateMemoryRecordsInput",
}) as any as S.Schema<BatchCreateMemoryRecordsInput>;
export interface MemoryRecordOutput {
  memoryRecordId: string;
  status: string;
  requestIdentifier?: string;
  errorCode?: number;
  errorMessage?: string;
}
export const MemoryRecordOutput = S.suspend(() =>
  S.Struct({
    memoryRecordId: S.String,
    status: S.String,
    requestIdentifier: S.optional(S.String),
    errorCode: S.optional(S.Number),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "MemoryRecordOutput",
}) as any as S.Schema<MemoryRecordOutput>;
export type MemoryRecordsOutputList = MemoryRecordOutput[];
export const MemoryRecordsOutputList = S.Array(MemoryRecordOutput);
export interface BatchUpdateMemoryRecordsOutput {
  successfulRecords: MemoryRecordsOutputList;
  failedRecords: MemoryRecordsOutputList;
}
export const BatchUpdateMemoryRecordsOutput = S.suspend(() =>
  S.Struct({
    successfulRecords: MemoryRecordsOutputList,
    failedRecords: MemoryRecordsOutputList,
  }),
).annotations({
  identifier: "BatchUpdateMemoryRecordsOutput",
}) as any as S.Schema<BatchUpdateMemoryRecordsOutput>;
export interface GetEventOutput {
  event: Event;
}
export const GetEventOutput = S.suspend(() =>
  S.Struct({ event: Event }),
).annotations({
  identifier: "GetEventOutput",
}) as any as S.Schema<GetEventOutput>;
export interface GetMemoryRecordOutput {
  memoryRecord: MemoryRecord;
}
export const GetMemoryRecordOutput = S.suspend(() =>
  S.Struct({ memoryRecord: MemoryRecord }),
).annotations({
  identifier: "GetMemoryRecordOutput",
}) as any as S.Schema<GetMemoryRecordOutput>;
export interface ListActorsOutput {
  actorSummaries: ActorSummaryList;
  nextToken?: string;
}
export const ListActorsOutput = S.suspend(() =>
  S.Struct({
    actorSummaries: ActorSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListActorsOutput",
}) as any as S.Schema<ListActorsOutput>;
export interface ListMemoryRecordsOutput {
  memoryRecordSummaries: MemoryRecordSummaryList;
  nextToken?: string;
}
export const ListMemoryRecordsOutput = S.suspend(() =>
  S.Struct({
    memoryRecordSummaries: MemoryRecordSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMemoryRecordsOutput",
}) as any as S.Schema<ListMemoryRecordsOutput>;
export interface ListSessionsOutput {
  sessionSummaries: SessionSummaryList;
  nextToken?: string;
}
export const ListSessionsOutput = S.suspend(() =>
  S.Struct({
    sessionSummaries: SessionSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSessionsOutput",
}) as any as S.Schema<ListSessionsOutput>;
export interface RetrieveMemoryRecordsInput {
  memoryId: string;
  namespace: string;
  searchCriteria: SearchCriteria;
  nextToken?: string;
  maxResults?: number;
}
export const RetrieveMemoryRecordsInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    namespace: S.String,
    searchCriteria: SearchCriteria,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/memories/{memoryId}/retrieve" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RetrieveMemoryRecordsInput",
}) as any as S.Schema<RetrieveMemoryRecordsInput>;
export interface StartMemoryExtractionJobOutput {
  jobId: string;
}
export const StartMemoryExtractionJobOutput = S.suspend(() =>
  S.Struct({ jobId: S.String }),
).annotations({
  identifier: "StartMemoryExtractionJobOutput",
}) as any as S.Schema<StartMemoryExtractionJobOutput>;
export interface EventMetadataFilterExpression {
  left: (typeof LeftExpression)["Type"];
  operator: string;
  right?: (typeof RightExpression)["Type"];
}
export const EventMetadataFilterExpression = S.suspend(() =>
  S.Struct({
    left: LeftExpression,
    operator: S.String,
    right: S.optional(RightExpression),
  }),
).annotations({
  identifier: "EventMetadataFilterExpression",
}) as any as S.Schema<EventMetadataFilterExpression>;
export type EventMetadataFilterList = EventMetadataFilterExpression[];
export const EventMetadataFilterList = S.Array(EventMetadataFilterExpression);
export interface FilterInput {
  branch?: BranchFilter;
  eventMetadata?: EventMetadataFilterList;
}
export const FilterInput = S.suspend(() =>
  S.Struct({
    branch: S.optional(BranchFilter),
    eventMetadata: S.optional(EventMetadataFilterList),
  }),
).annotations({ identifier: "FilterInput" }) as any as S.Schema<FilterInput>;
export interface GetBrowserSessionResponse {
  browserIdentifier: string;
  sessionId: string;
  name?: string;
  createdAt: Date;
  viewPort?: ViewPort;
  sessionTimeoutSeconds?: number;
  status?: string;
  streams?: BrowserSessionStream;
  sessionReplayArtifact?: string;
  lastUpdatedAt?: Date;
}
export const GetBrowserSessionResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetBrowserSessionResponse",
}) as any as S.Schema<GetBrowserSessionResponse>;
export interface UpdateBrowserStreamResponse {
  browserIdentifier: string;
  sessionId: string;
  streams: BrowserSessionStream;
  updatedAt: Date;
}
export const UpdateBrowserStreamResponse = S.suspend(() =>
  S.Struct({
    browserIdentifier: S.String,
    sessionId: S.String,
    streams: BrowserSessionStream,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateBrowserStreamResponse",
}) as any as S.Schema<UpdateBrowserStreamResponse>;
export interface BatchCreateMemoryRecordsOutput {
  successfulRecords: MemoryRecordsOutputList;
  failedRecords: MemoryRecordsOutputList;
}
export const BatchCreateMemoryRecordsOutput = S.suspend(() =>
  S.Struct({
    successfulRecords: MemoryRecordsOutputList,
    failedRecords: MemoryRecordsOutputList,
  }),
).annotations({
  identifier: "BatchCreateMemoryRecordsOutput",
}) as any as S.Schema<BatchCreateMemoryRecordsOutput>;
export interface BatchDeleteMemoryRecordsOutput {
  successfulRecords: MemoryRecordsOutputList;
  failedRecords: MemoryRecordsOutputList;
}
export const BatchDeleteMemoryRecordsOutput = S.suspend(() =>
  S.Struct({
    successfulRecords: MemoryRecordsOutputList,
    failedRecords: MemoryRecordsOutputList,
  }),
).annotations({
  identifier: "BatchDeleteMemoryRecordsOutput",
}) as any as S.Schema<BatchDeleteMemoryRecordsOutput>;
export interface CreateEventInput {
  memoryId: string;
  actorId: string;
  sessionId?: string;
  eventTimestamp: Date;
  payload: PayloadTypeList;
  branch?: Branch;
  clientToken?: string;
  metadata?: MetadataMap;
}
export const CreateEventInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    actorId: S.String,
    sessionId: S.optional(S.String),
    eventTimestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    payload: PayloadTypeList,
    branch: S.optional(Branch),
    clientToken: S.optional(S.String),
    metadata: S.optional(MetadataMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/memories/{memoryId}/events" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEventInput",
}) as any as S.Schema<CreateEventInput>;
export interface ListEventsInput {
  memoryId: string;
  sessionId: string;
  actorId: string;
  includePayloads?: boolean;
  filter?: FilterInput;
  maxResults?: number;
  nextToken?: string;
}
export const ListEventsInput = S.suspend(() =>
  S.Struct({
    memoryId: S.String.pipe(T.HttpLabel("memoryId")),
    sessionId: S.String.pipe(T.HttpLabel("sessionId")),
    actorId: S.String.pipe(T.HttpLabel("actorId")),
    includePayloads: S.optional(S.Boolean),
    filter: S.optional(FilterInput),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListEventsInput",
}) as any as S.Schema<ListEventsInput>;
export interface RetrieveMemoryRecordsOutput {
  memoryRecordSummaries: MemoryRecordSummaryList;
  nextToken?: string;
}
export const RetrieveMemoryRecordsOutput = S.suspend(() =>
  S.Struct({
    memoryRecordSummaries: MemoryRecordSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "RetrieveMemoryRecordsOutput",
}) as any as S.Schema<RetrieveMemoryRecordsOutput>;
export interface TokenUsage {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}
export const TokenUsage = S.suspend(() =>
  S.Struct({
    inputTokens: S.optional(S.Number),
    outputTokens: S.optional(S.Number),
    totalTokens: S.optional(S.Number),
  }),
).annotations({ identifier: "TokenUsage" }) as any as S.Schema<TokenUsage>;
export type EventList = Event[];
export const EventList = S.Array(Event);
export interface SpanContext {
  sessionId: string;
  traceId?: string;
  spanId?: string;
}
export const SpanContext = S.suspend(() =>
  S.Struct({
    sessionId: S.String,
    traceId: S.optional(S.String),
    spanId: S.optional(S.String),
  }),
).annotations({ identifier: "SpanContext" }) as any as S.Schema<SpanContext>;
export interface MessageMetadata {
  eventId: string;
  messageIndex: number;
}
export const MessageMetadata = S.suspend(() =>
  S.Struct({ eventId: S.String, messageIndex: S.Number }),
).annotations({
  identifier: "MessageMetadata",
}) as any as S.Schema<MessageMetadata>;
export type MessagesList = MessageMetadata[];
export const MessagesList = S.Array(MessageMetadata);
export interface CreateEventOutput {
  event: Event;
}
export const CreateEventOutput = S.suspend(() =>
  S.Struct({ event: Event }),
).annotations({
  identifier: "CreateEventOutput",
}) as any as S.Schema<CreateEventOutput>;
export interface ListEventsOutput {
  events: EventList;
  nextToken?: string;
}
export const ListEventsOutput = S.suspend(() =>
  S.Struct({ events: EventList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListEventsOutput",
}) as any as S.Schema<ListEventsOutput>;
export type Context = { spanContext: SpanContext };
export const Context = S.Union(S.Struct({ spanContext: SpanContext }));
export type ExtractionJobMessages = { messagesList: MessagesList };
export const ExtractionJobMessages = S.Union(
  S.Struct({ messagesList: MessagesList }),
);
export interface EvaluationResultContent {
  evaluatorArn: string;
  evaluatorId: string;
  evaluatorName: string;
  explanation?: string | Redacted.Redacted<string>;
  context: (typeof Context)["Type"];
  value?: number;
  label?: string;
  tokenUsage?: TokenUsage;
  errorMessage?: string;
  errorCode?: string;
}
export const EvaluationResultContent = S.suspend(() =>
  S.Struct({
    evaluatorArn: S.String,
    evaluatorId: S.String,
    evaluatorName: S.String,
    explanation: S.optional(SensitiveString),
    context: Context,
    value: S.optional(S.Number),
    label: S.optional(S.String),
    tokenUsage: S.optional(TokenUsage),
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
  }),
).annotations({
  identifier: "EvaluationResultContent",
}) as any as S.Schema<EvaluationResultContent>;
export type EvaluationResults = EvaluationResultContent[];
export const EvaluationResults = S.Array(EvaluationResultContent);
export interface ExtractionJobMetadata {
  jobID: string;
  messages: (typeof ExtractionJobMessages)["Type"];
  status?: string;
  failureReason?: string;
  strategyId?: string;
  sessionId?: string;
  actorId?: string;
}
export const ExtractionJobMetadata = S.suspend(() =>
  S.Struct({
    jobID: S.String,
    messages: ExtractionJobMessages,
    status: S.optional(S.String),
    failureReason: S.optional(S.String),
    strategyId: S.optional(S.String),
    sessionId: S.optional(S.String),
    actorId: S.optional(S.String),
  }),
).annotations({
  identifier: "ExtractionJobMetadata",
}) as any as S.Schema<ExtractionJobMetadata>;
export type ExtractionJobMetadataList = ExtractionJobMetadata[];
export const ExtractionJobMetadataList = S.Array(ExtractionJobMetadata);
export interface ToolResultStructuredContent {
  taskId?: string;
  taskStatus?: string;
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  executionTime?: number;
}
export const ToolResultStructuredContent = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    taskStatus: S.optional(S.String),
    stdout: S.optional(S.String),
    stderr: S.optional(S.String),
    exitCode: S.optional(S.Number),
    executionTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "ToolResultStructuredContent",
}) as any as S.Schema<ToolResultStructuredContent>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface EvaluateResponse {
  evaluationResults: EvaluationResults;
}
export const EvaluateResponse = S.suspend(() =>
  S.Struct({ evaluationResults: EvaluationResults }),
).annotations({
  identifier: "EvaluateResponse",
}) as any as S.Schema<EvaluateResponse>;
export interface ListMemoryExtractionJobsOutput {
  jobs: ExtractionJobMetadataList;
  nextToken?: string;
}
export const ListMemoryExtractionJobsOutput = S.suspend(() =>
  S.Struct({
    jobs: ExtractionJobMetadataList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMemoryExtractionJobsOutput",
}) as any as S.Schema<ListMemoryExtractionJobsOutput>;
export interface ResourceContent {
  type: string;
  uri?: string;
  mimeType?: string;
  text?: string;
  blob?: Uint8Array;
}
export const ResourceContent = S.suspend(() =>
  S.Struct({
    type: S.String,
    uri: S.optional(S.String),
    mimeType: S.optional(S.String),
    text: S.optional(S.String),
    blob: S.optional(T.Blob),
  }),
).annotations({
  identifier: "ResourceContent",
}) as any as S.Schema<ResourceContent>;
export interface ContentBlock {
  type: string;
  text?: string;
  data?: Uint8Array;
  mimeType?: string;
  uri?: string;
  name?: string;
  description?: string;
  size?: number;
  resource?: ResourceContent;
}
export const ContentBlock = S.suspend(() =>
  S.Struct({
    type: S.String,
    text: S.optional(S.String),
    data: S.optional(T.Blob),
    mimeType: S.optional(S.String),
    uri: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    size: S.optional(S.Number),
    resource: S.optional(ResourceContent),
  }),
).annotations({ identifier: "ContentBlock" }) as any as S.Schema<ContentBlock>;
export type ContentBlockList = ContentBlock[];
export const ContentBlockList = S.Array(ContentBlock);
export interface CodeInterpreterResult {
  content: ContentBlockList;
  structuredContent?: ToolResultStructuredContent;
  isError?: boolean;
}
export const CodeInterpreterResult = S.suspend(() =>
  S.Struct({
    content: ContentBlockList,
    structuredContent: S.optional(ToolResultStructuredContent),
    isError: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CodeInterpreterResult",
}) as any as S.Schema<CodeInterpreterResult>;
export const CodeInterpreterStreamOutput = T.EventStream(
  S.Union(
    S.Struct({ result: CodeInterpreterResult }),
    S.Struct({
      accessDeniedException: S.suspend(() => AccessDeniedException).annotations(
        { identifier: "AccessDeniedException" },
      ),
    }),
    S.Struct({
      conflictException: S.suspend(() => ConflictException).annotations({
        identifier: "ConflictException",
      }),
    }),
    S.Struct({
      internalServerException: S.suspend(
        () => InternalServerException,
      ).annotations({ identifier: "InternalServerException" }),
    }),
    S.Struct({
      resourceNotFoundException: S.suspend(
        () => ResourceNotFoundException,
      ).annotations({ identifier: "ResourceNotFoundException" }),
    }),
    S.Struct({
      serviceQuotaExceededException: S.suspend(
        () => ServiceQuotaExceededException,
      ).annotations({ identifier: "ServiceQuotaExceededException" }),
    }),
    S.Struct({
      throttlingException: S.suspend(() => ThrottlingException).annotations({
        identifier: "ThrottlingException",
      }),
    }),
    S.Struct({
      validationException: S.suspend(() => ValidationException).annotations({
        identifier: "ValidationException",
      }),
    }),
  ),
);
export interface InvokeCodeInterpreterResponse {
  sessionId?: string;
  stream: (typeof CodeInterpreterStreamOutput)["Type"];
}
export const InvokeCodeInterpreterResponse = S.suspend(() =>
  S.Struct({
    sessionId: S.optional(S.String).pipe(
      T.HttpHeader("x-amzn-code-interpreter-session-id"),
    ),
    stream: CodeInterpreterStreamOutput.pipe(T.HttpPayload()),
  }),
).annotations({
  identifier: "InvokeCodeInterpreterResponse",
}) as any as S.Schema<InvokeCodeInterpreterResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class RuntimeClientError extends S.TaggedError<RuntimeClientError>()(
  "RuntimeClientError",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ThrottledException extends S.TaggedError<ThrottledException>()(
  "ThrottledException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class DuplicateIdException extends S.TaggedError<DuplicateIdException>()(
  "DuplicateIdException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}

//# Operations
/**
 * Retrieves information about a specific event in an AgentCore Memory resource.
 *
 * To use this operation, you must have the `bedrock-agentcore:GetEvent` permission.
 */
export const getEvent: (
  input: GetEventInput,
) => Effect.Effect<
  GetEventOutput,
  | AccessDeniedException
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceException
  | ServiceQuotaExceededException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResourceApiKey: (
  input: GetResourceApiKeyRequest,
) => Effect.Effect<
  GetResourceApiKeyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWorkloadAccessToken: (
  input: GetWorkloadAccessTokenRequest,
) => Effect.Effect<
  GetWorkloadAccessTokenResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Obtains a workload access token for agentic workloads acting on behalf of a user, using a JWT token.
 */
export const getWorkloadAccessTokenForJWT: (
  input: GetWorkloadAccessTokenForJWTRequest,
) => Effect.Effect<
  GetWorkloadAccessTokenForJWTResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWorkloadAccessTokenForUserId: (
  input: GetWorkloadAccessTokenForUserIdRequest,
) => Effect.Effect<
  GetWorkloadAccessTokenForUserIdResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const completeResourceTokenAuth: (
  input: CompleteResourceTokenAuthRequest,
) => Effect.Effect<
  CompleteResourceTokenAuthResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Stops a session that is running in an running AgentCore Runtime agent.
 */
export const stopRuntimeSession: (
  input: StopRuntimeSessionRequest,
) => Effect.Effect<
  StopRuntimeSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | RuntimeClientError
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBrowserSessions: (
  input: ListBrowserSessionsRequest,
) => Effect.Effect<
  ListBrowserSessionsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCodeInterpreterSessions: (
  input: ListCodeInterpreterSessionsRequest,
) => Effect.Effect<
  ListCodeInterpreterSessionsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCodeInterpreterSessionsRequest,
  output: ListCodeInterpreterSessionsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
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
export const getCodeInterpreterSession: (
  input: GetCodeInterpreterSessionRequest,
) => Effect.Effect<
  GetCodeInterpreterSessionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCodeInterpreterSessionRequest,
  output: GetCodeInterpreterSessionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
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
export const getBrowserSession: (
  input: GetBrowserSessionRequest,
) => Effect.Effect<
  GetBrowserSessionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const invokeAgentRuntime: (
  input: InvokeAgentRuntimeRequest,
) => Effect.Effect<
  InvokeAgentRuntimeResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | RuntimeClientError
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopBrowserSession: (
  input: StopBrowserSessionRequest,
) => Effect.Effect<
  StopBrowserSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startCodeInterpreterSession: (
  input: StartCodeInterpreterSessionRequest,
) => Effect.Effect<
  StartCodeInterpreterSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const stopCodeInterpreterSession: (
  input: StopCodeInterpreterSessionRequest,
) => Effect.Effect<
  StopCodeInterpreterSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const startBrowserSession: (
  input: StartBrowserSessionRequest,
) => Effect.Effect<
  StartBrowserSessionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBrowserStream: (
  input: UpdateBrowserStreamRequest,
) => Effect.Effect<
  UpdateBrowserStreamResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAgentCard: (
  input: GetAgentCardRequest,
) => Effect.Effect<
  GetAgentCardResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | RuntimeClientError
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResourceOauth2Token: (
  input: GetResourceOauth2TokenRequest,
) => Effect.Effect<
  GetResourceOauth2TokenResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Searches for and retrieves memory records from an AgentCore Memory resource based on specified search criteria. We recommend using pagination to ensure that the operation returns quickly and successfully.
 *
 * To use this operation, you must have the `bedrock-agentcore:RetrieveMemoryRecords` permission.
 */
export const retrieveMemoryRecords: {
  (
    input: RetrieveMemoryRecordsInput,
  ): Effect.Effect<
    RetrieveMemoryRecordsOutput,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: RetrieveMemoryRecordsInput,
  ) => Stream.Stream<
    RetrieveMemoryRecordsOutput,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: RetrieveMemoryRecordsInput,
  ) => Stream.Stream<
    MemoryRecordSummary,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "memoryRecordSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts a memory extraction job that processes events that failed extraction previously in an AgentCore Memory resource and produces structured memory records. When earlier extraction attempts have left events unprocessed, this job will pick up and extract those as well.
 *
 * To use this operation, you must have the `bedrock-agentcore:StartMemoryExtractionJob` permission.
 */
export const startMemoryExtractionJob: (
  input: StartMemoryExtractionJobInput,
) => Effect.Effect<
  StartMemoryExtractionJobOutput,
  | AccessDeniedException
  | ResourceNotFoundException
  | ServiceException
  | ServiceQuotaExceededException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates multiple memory records in a single batch operation for the specified memory with custom content.
 */
export const batchCreateMemoryRecords: (
  input: BatchCreateMemoryRecordsInput,
) => Effect.Effect<
  BatchCreateMemoryRecordsOutput,
  | AccessDeniedException
  | ResourceNotFoundException
  | ServiceException
  | ServiceQuotaExceededException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes multiple memory records in a single batch operation from the specified memory.
 */
export const batchDeleteMemoryRecords: (
  input: BatchDeleteMemoryRecordsInput,
) => Effect.Effect<
  BatchDeleteMemoryRecordsOutput,
  | AccessDeniedException
  | ResourceNotFoundException
  | ServiceException
  | ServiceQuotaExceededException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves a specific memory record from an AgentCore Memory resource.
 *
 * To use this operation, you must have the `bedrock-agentcore:GetMemoryRecord` permission.
 */
export const getMemoryRecord: (
  input: GetMemoryRecordInput,
) => Effect.Effect<
  GetMemoryRecordOutput,
  | AccessDeniedException
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceException
  | ServiceQuotaExceededException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listActors: {
  (
    input: ListActorsInput,
  ): Effect.Effect<
    ListActorsOutput,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListActorsInput,
  ) => Stream.Stream<
    ListActorsOutput,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListActorsInput,
  ) => Stream.Stream<
    ActorSummary,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "actorSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists memory records in an AgentCore Memory resource based on specified criteria. We recommend using pagination to ensure that the operation returns quickly and successfully.
 *
 * To use this operation, you must have the `bedrock-agentcore:ListMemoryRecords` permission.
 */
export const listMemoryRecords: {
  (
    input: ListMemoryRecordsInput,
  ): Effect.Effect<
    ListMemoryRecordsOutput,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMemoryRecordsInput,
  ) => Stream.Stream<
    ListMemoryRecordsOutput,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMemoryRecordsInput,
  ) => Stream.Stream<
    MemoryRecordSummary,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "memoryRecordSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists sessions in an AgentCore Memory resource based on specified criteria. We recommend using pagination to ensure that the operation returns quickly and successfully.
 *
 * To use this operation, you must have the `bedrock-agentcore:ListSessions` permission.
 */
export const listSessions: {
  (
    input: ListSessionsInput,
  ): Effect.Effect<
    ListSessionsOutput,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionsInput,
  ) => Stream.Stream<
    ListSessionsOutput,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionsInput,
  ) => Stream.Stream<
    SessionSummary,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "sessionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes an event from an AgentCore Memory resource. When you delete an event, it is permanently removed.
 *
 * To use this operation, you must have the `bedrock-agentcore:DeleteEvent` permission.
 */
export const deleteEvent: (
  input: DeleteEventInput,
) => Effect.Effect<
  DeleteEventOutput,
  | AccessDeniedException
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceException
  | ServiceQuotaExceededException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMemoryRecord: (
  input: DeleteMemoryRecordInput,
) => Effect.Effect<
  DeleteMemoryRecordOutput,
  | AccessDeniedException
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceException
  | ServiceQuotaExceededException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchUpdateMemoryRecords: (
  input: BatchUpdateMemoryRecordsInput,
) => Effect.Effect<
  BatchUpdateMemoryRecordsOutput,
  | AccessDeniedException
  | ResourceNotFoundException
  | ServiceException
  | ServiceQuotaExceededException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates an event in an AgentCore Memory resource. Events represent interactions or activities that occur within a session and are associated with specific actors.
 *
 * To use this operation, you must have the `bedrock-agentcore:CreateEvent` permission.
 *
 * This operation is subject to request rate limiting.
 */
export const createEvent: (
  input: CreateEventInput,
) => Effect.Effect<
  CreateEventOutput,
  | AccessDeniedException
  | InvalidInputException
  | ResourceNotFoundException
  | ServiceException
  | ServiceQuotaExceededException
  | ThrottledException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listEvents: {
  (
    input: ListEventsInput,
  ): Effect.Effect<
    ListEventsOutput,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventsInput,
  ) => Stream.Stream<
    ListEventsOutput,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventsInput,
  ) => Stream.Stream<
    Event,
    | AccessDeniedException
    | InvalidInputException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "events",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all long-term memory extraction jobs that are eligible to be started with optional filtering.
 *
 * To use this operation, you must have the `bedrock-agentcore:ListMemoryExtractionJobs` permission.
 */
export const listMemoryExtractionJobs: {
  (
    input: ListMemoryExtractionJobsInput,
  ): Effect.Effect<
    ListMemoryExtractionJobsOutput,
    | AccessDeniedException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMemoryExtractionJobsInput,
  ) => Stream.Stream<
    ListMemoryExtractionJobsOutput,
    | AccessDeniedException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMemoryExtractionJobsInput,
  ) => Stream.Stream<
    ExtractionJobMetadata,
    | AccessDeniedException
    | ResourceNotFoundException
    | ServiceException
    | ServiceQuotaExceededException
    | ThrottledException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Performs on-demand evaluation of agent traces using a specified evaluator. This synchronous API accepts traces in OpenTelemetry format and returns immediate scoring results with detailed explanations.
 */
export const evaluate: (
  input: EvaluateRequest,
) => Effect.Effect<
  EvaluateResponse,
  | AccessDeniedException
  | ConflictException
  | DuplicateIdException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UnauthorizedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const invokeCodeInterpreter: (
  input: InvokeCodeInterpreterRequest,
) => Effect.Effect<
  InvokeCodeInterpreterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));

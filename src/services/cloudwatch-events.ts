import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://events.amazonaws.com/doc/2015-10-07");
const svc = T.AwsApiService({
  sdkId: "CloudWatch Events",
  serviceShapeName: "AWSEvents",
});
const auth = T.AwsAuthSigv4({ name: "events" });
const ver = T.ServiceVersion("2015-10-07");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://events-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (Region === "us-gov-east-1") {
              return e("https://events.us-gov-east-1.amazonaws.com");
            }
            if (Region === "us-gov-west-1") {
              return e("https://events.us-gov-west-1.amazonaws.com");
            }
            return e(
              `https://events-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://events.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://events.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type EventSourceName = string;
export type ReplayName = string;
export type ApiDestinationName = string;
export type ApiDestinationDescription = string;
export type ConnectionArn = string;
export type HttpsEndpoint = string;
export type ApiDestinationInvocationRateLimitPerSecond = number;
export type ArchiveName = string;
export type Arn = string;
export type ArchiveDescription = string;
export type EventPattern = string;
export type RetentionDays = number;
export type ConnectionName = string;
export type ConnectionDescription = string;
export type EventBusName = string;
export type AccountId = string;
export type RuleName = string;
export type EventBusNameOrArn = string;
export type NextToken = string;
export type LimitMax100 = number;
export type EventSourceNamePrefix = string;
export type PartnerEventSourceNamePrefix = string;
export type TargetArn = string;
export type NonPartnerEventBusName = string;
export type Action = string;
export type Principal = string;
export type StatementId = string;
export type ScheduleExpression = string;
export type RuleDescription = string;
export type RoleArn = string;
export type TargetId = string;
export type ReplayDescription = string;
export type TagKey = string;
export type TagValue = string;
export type EventTime = Date;
export type EventResource = string;
export type NonPartnerEventBusNameOrArn = string;
export type TraceHeader = string;
export type TargetInput = string;
export type TargetInputPath = string;
export type ErrorMessage = string;
export type ReplayArn = string;
export type ReplayStateReason = string;
export type ApiDestinationArn = string;
export type ArchiveArn = string;
export type ArchiveStateReason = string;
export type ConnectionStateReason = string;
export type SecretsManagerSecretArn = string;
export type RuleArn = string;
export type ManagedBy = string;
export type CreatedBy = string;
export type AuthHeaderParameters = string;
export type AuthHeaderParametersSensitive = string | redacted.Redacted<string>;
export type TransformerInput = string;
export type TargetPartitionKeyPath = string;
export type LimitMin1 = number;
export type ReferenceId = string;
export type MessageGroupId = string;
export type PathParameter = string;
export type RedshiftSecretManagerArn = string;
export type Database = string;
export type DbUser = string;
export type Sql = string;
export type StatementName = string;
export type ResourceArn = string;
export type MaximumRetryAttempts = number;
export type MaximumEventAgeInSeconds = number;
export type ErrorCode = string;
export type HeaderKey = string;
export type HeaderValueSensitive = string | redacted.Redacted<string>;
export type QueryStringKey = string;
export type QueryStringValueSensitive = string | redacted.Redacted<string>;
export type SensitiveString = string | redacted.Redacted<string>;
export type InputTransformerPathKey = string;
export type RunCommandTargetKey = string;
export type RunCommandTargetValue = string;
export type CapacityProvider = string;
export type CapacityProviderStrategyItemWeight = number;
export type CapacityProviderStrategyItemBase = number;
export type PlacementConstraintExpression = string;
export type PlacementStrategyField = string;
export type HeaderValue = string;
export type QueryStringValue = string;
export type SageMakerPipelineParameterName = string;
export type SageMakerPipelineParameterValue = string;
export type EventId = string;

//# Schemas
export type ApiDestinationHttpMethod =
  | "POST"
  | "GET"
  | "HEAD"
  | "OPTIONS"
  | "PUT"
  | "PATCH"
  | "DELETE";
export const ApiDestinationHttpMethod = S.Literal(
  "POST",
  "GET",
  "HEAD",
  "OPTIONS",
  "PUT",
  "PATCH",
  "DELETE",
);
export type ConnectionAuthorizationType =
  | "BASIC"
  | "OAUTH_CLIENT_CREDENTIALS"
  | "API_KEY";
export const ConnectionAuthorizationType = S.Literal(
  "BASIC",
  "OAUTH_CLIENT_CREDENTIALS",
  "API_KEY",
);
export type ArchiveState =
  | "ENABLED"
  | "DISABLED"
  | "CREATING"
  | "UPDATING"
  | "CREATE_FAILED"
  | "UPDATE_FAILED";
export const ArchiveState = S.Literal(
  "ENABLED",
  "DISABLED",
  "CREATING",
  "UPDATING",
  "CREATE_FAILED",
  "UPDATE_FAILED",
);
export type ConnectionState =
  | "CREATING"
  | "UPDATING"
  | "DELETING"
  | "AUTHORIZED"
  | "DEAUTHORIZED"
  | "AUTHORIZING"
  | "DEAUTHORIZING";
export const ConnectionState = S.Literal(
  "CREATING",
  "UPDATING",
  "DELETING",
  "AUTHORIZED",
  "DEAUTHORIZED",
  "AUTHORIZING",
  "DEAUTHORIZING",
);
export type ReplayState =
  | "STARTING"
  | "RUNNING"
  | "CANCELLING"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";
export const ReplayState = S.Literal(
  "STARTING",
  "RUNNING",
  "CANCELLING",
  "COMPLETED",
  "CANCELLED",
  "FAILED",
);
export type RuleState = "ENABLED" | "DISABLED";
export const RuleState = S.Literal("ENABLED", "DISABLED");
export type TargetIdList = string[];
export const TargetIdList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface ActivateEventSourceRequest {
  Name: string;
}
export const ActivateEventSourceRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ActivateEventSourceRequest",
}) as any as S.Schema<ActivateEventSourceRequest>;
export interface ActivateEventSourceResponse {}
export const ActivateEventSourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ActivateEventSourceResponse",
}) as any as S.Schema<ActivateEventSourceResponse>;
export interface CancelReplayRequest {
  ReplayName: string;
}
export const CancelReplayRequest = S.suspend(() =>
  S.Struct({ ReplayName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelReplayRequest",
}) as any as S.Schema<CancelReplayRequest>;
export interface CreateApiDestinationRequest {
  Name: string;
  Description?: string;
  ConnectionArn: string;
  InvocationEndpoint: string;
  HttpMethod: ApiDestinationHttpMethod;
  InvocationRateLimitPerSecond?: number;
}
export const CreateApiDestinationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    ConnectionArn: S.String,
    InvocationEndpoint: S.String,
    HttpMethod: ApiDestinationHttpMethod,
    InvocationRateLimitPerSecond: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApiDestinationRequest",
}) as any as S.Schema<CreateApiDestinationRequest>;
export interface CreateArchiveRequest {
  ArchiveName: string;
  EventSourceArn: string;
  Description?: string;
  EventPattern?: string;
  RetentionDays?: number;
}
export const CreateArchiveRequest = S.suspend(() =>
  S.Struct({
    ArchiveName: S.String,
    EventSourceArn: S.String,
    Description: S.optional(S.String),
    EventPattern: S.optional(S.String),
    RetentionDays: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateArchiveRequest",
}) as any as S.Schema<CreateArchiveRequest>;
export interface CreatePartnerEventSourceRequest {
  Name: string;
  Account: string;
}
export const CreatePartnerEventSourceRequest = S.suspend(() =>
  S.Struct({ Name: S.String, Account: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePartnerEventSourceRequest",
}) as any as S.Schema<CreatePartnerEventSourceRequest>;
export interface DeactivateEventSourceRequest {
  Name: string;
}
export const DeactivateEventSourceRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeactivateEventSourceRequest",
}) as any as S.Schema<DeactivateEventSourceRequest>;
export interface DeactivateEventSourceResponse {}
export const DeactivateEventSourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeactivateEventSourceResponse",
}) as any as S.Schema<DeactivateEventSourceResponse>;
export interface DeauthorizeConnectionRequest {
  Name: string;
}
export const DeauthorizeConnectionRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeauthorizeConnectionRequest",
}) as any as S.Schema<DeauthorizeConnectionRequest>;
export interface DeleteApiDestinationRequest {
  Name: string;
}
export const DeleteApiDestinationRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApiDestinationRequest",
}) as any as S.Schema<DeleteApiDestinationRequest>;
export interface DeleteApiDestinationResponse {}
export const DeleteApiDestinationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteApiDestinationResponse",
}) as any as S.Schema<DeleteApiDestinationResponse>;
export interface DeleteArchiveRequest {
  ArchiveName: string;
}
export const DeleteArchiveRequest = S.suspend(() =>
  S.Struct({ ArchiveName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteArchiveRequest",
}) as any as S.Schema<DeleteArchiveRequest>;
export interface DeleteArchiveResponse {}
export const DeleteArchiveResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteArchiveResponse",
}) as any as S.Schema<DeleteArchiveResponse>;
export interface DeleteConnectionRequest {
  Name: string;
}
export const DeleteConnectionRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConnectionRequest",
}) as any as S.Schema<DeleteConnectionRequest>;
export interface DeleteEventBusRequest {
  Name: string;
}
export const DeleteEventBusRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEventBusRequest",
}) as any as S.Schema<DeleteEventBusRequest>;
export interface DeleteEventBusResponse {}
export const DeleteEventBusResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteEventBusResponse",
}) as any as S.Schema<DeleteEventBusResponse>;
export interface DeletePartnerEventSourceRequest {
  Name: string;
  Account: string;
}
export const DeletePartnerEventSourceRequest = S.suspend(() =>
  S.Struct({ Name: S.String, Account: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePartnerEventSourceRequest",
}) as any as S.Schema<DeletePartnerEventSourceRequest>;
export interface DeletePartnerEventSourceResponse {}
export const DeletePartnerEventSourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePartnerEventSourceResponse",
}) as any as S.Schema<DeletePartnerEventSourceResponse>;
export interface DeleteRuleRequest {
  Name: string;
  EventBusName?: string;
  Force?: boolean;
}
export const DeleteRuleRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    EventBusName: S.optional(S.String),
    Force: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRuleRequest",
}) as any as S.Schema<DeleteRuleRequest>;
export interface DeleteRuleResponse {}
export const DeleteRuleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRuleResponse",
}) as any as S.Schema<DeleteRuleResponse>;
export interface DescribeApiDestinationRequest {
  Name: string;
}
export const DescribeApiDestinationRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeApiDestinationRequest",
}) as any as S.Schema<DescribeApiDestinationRequest>;
export interface DescribeArchiveRequest {
  ArchiveName: string;
}
export const DescribeArchiveRequest = S.suspend(() =>
  S.Struct({ ArchiveName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeArchiveRequest",
}) as any as S.Schema<DescribeArchiveRequest>;
export interface DescribeConnectionRequest {
  Name: string;
}
export const DescribeConnectionRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConnectionRequest",
}) as any as S.Schema<DescribeConnectionRequest>;
export interface DescribeEventBusRequest {
  Name?: string;
}
export const DescribeEventBusRequest = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEventBusRequest",
}) as any as S.Schema<DescribeEventBusRequest>;
export interface DescribeEventSourceRequest {
  Name: string;
}
export const DescribeEventSourceRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEventSourceRequest",
}) as any as S.Schema<DescribeEventSourceRequest>;
export interface DescribePartnerEventSourceRequest {
  Name: string;
}
export const DescribePartnerEventSourceRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePartnerEventSourceRequest",
}) as any as S.Schema<DescribePartnerEventSourceRequest>;
export interface DescribeReplayRequest {
  ReplayName: string;
}
export const DescribeReplayRequest = S.suspend(() =>
  S.Struct({ ReplayName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReplayRequest",
}) as any as S.Schema<DescribeReplayRequest>;
export interface DescribeRuleRequest {
  Name: string;
  EventBusName?: string;
}
export const DescribeRuleRequest = S.suspend(() =>
  S.Struct({ Name: S.String, EventBusName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRuleRequest",
}) as any as S.Schema<DescribeRuleRequest>;
export interface DisableRuleRequest {
  Name: string;
  EventBusName?: string;
}
export const DisableRuleRequest = S.suspend(() =>
  S.Struct({ Name: S.String, EventBusName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableRuleRequest",
}) as any as S.Schema<DisableRuleRequest>;
export interface DisableRuleResponse {}
export const DisableRuleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableRuleResponse",
}) as any as S.Schema<DisableRuleResponse>;
export interface EnableRuleRequest {
  Name: string;
  EventBusName?: string;
}
export const EnableRuleRequest = S.suspend(() =>
  S.Struct({ Name: S.String, EventBusName: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableRuleRequest",
}) as any as S.Schema<EnableRuleRequest>;
export interface EnableRuleResponse {}
export const EnableRuleResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableRuleResponse",
}) as any as S.Schema<EnableRuleResponse>;
export interface ListApiDestinationsRequest {
  NamePrefix?: string;
  ConnectionArn?: string;
  NextToken?: string;
  Limit?: number;
}
export const ListApiDestinationsRequest = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String),
    ConnectionArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApiDestinationsRequest",
}) as any as S.Schema<ListApiDestinationsRequest>;
export interface ListArchivesRequest {
  NamePrefix?: string;
  EventSourceArn?: string;
  State?: ArchiveState;
  NextToken?: string;
  Limit?: number;
}
export const ListArchivesRequest = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String),
    EventSourceArn: S.optional(S.String),
    State: S.optional(ArchiveState),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListArchivesRequest",
}) as any as S.Schema<ListArchivesRequest>;
export interface ListConnectionsRequest {
  NamePrefix?: string;
  ConnectionState?: ConnectionState;
  NextToken?: string;
  Limit?: number;
}
export const ListConnectionsRequest = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String),
    ConnectionState: S.optional(ConnectionState),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConnectionsRequest",
}) as any as S.Schema<ListConnectionsRequest>;
export interface ListEventBusesRequest {
  NamePrefix?: string;
  NextToken?: string;
  Limit?: number;
}
export const ListEventBusesRequest = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventBusesRequest",
}) as any as S.Schema<ListEventBusesRequest>;
export interface ListEventSourcesRequest {
  NamePrefix?: string;
  NextToken?: string;
  Limit?: number;
}
export const ListEventSourcesRequest = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventSourcesRequest",
}) as any as S.Schema<ListEventSourcesRequest>;
export interface ListPartnerEventSourceAccountsRequest {
  EventSourceName: string;
  NextToken?: string;
  Limit?: number;
}
export const ListPartnerEventSourceAccountsRequest = S.suspend(() =>
  S.Struct({
    EventSourceName: S.String,
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPartnerEventSourceAccountsRequest",
}) as any as S.Schema<ListPartnerEventSourceAccountsRequest>;
export interface ListPartnerEventSourcesRequest {
  NamePrefix: string;
  NextToken?: string;
  Limit?: number;
}
export const ListPartnerEventSourcesRequest = S.suspend(() =>
  S.Struct({
    NamePrefix: S.String,
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPartnerEventSourcesRequest",
}) as any as S.Schema<ListPartnerEventSourcesRequest>;
export interface ListReplaysRequest {
  NamePrefix?: string;
  State?: ReplayState;
  EventSourceArn?: string;
  NextToken?: string;
  Limit?: number;
}
export const ListReplaysRequest = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String),
    State: S.optional(ReplayState),
    EventSourceArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReplaysRequest",
}) as any as S.Schema<ListReplaysRequest>;
export interface ListRuleNamesByTargetRequest {
  TargetArn: string;
  EventBusName?: string;
  NextToken?: string;
  Limit?: number;
}
export const ListRuleNamesByTargetRequest = S.suspend(() =>
  S.Struct({
    TargetArn: S.String,
    EventBusName: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRuleNamesByTargetRequest",
}) as any as S.Schema<ListRuleNamesByTargetRequest>;
export interface ListRulesRequest {
  NamePrefix?: string;
  EventBusName?: string;
  NextToken?: string;
  Limit?: number;
}
export const ListRulesRequest = S.suspend(() =>
  S.Struct({
    NamePrefix: S.optional(S.String),
    EventBusName: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRulesRequest",
}) as any as S.Schema<ListRulesRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListTargetsByRuleRequest {
  Rule: string;
  EventBusName?: string;
  NextToken?: string;
  Limit?: number;
}
export const ListTargetsByRuleRequest = S.suspend(() =>
  S.Struct({
    Rule: S.String,
    EventBusName: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTargetsByRuleRequest",
}) as any as S.Schema<ListTargetsByRuleRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface PutRuleRequest {
  Name: string;
  ScheduleExpression?: string;
  EventPattern?: string;
  State?: RuleState;
  Description?: string;
  RoleArn?: string;
  Tags?: Tag[];
  EventBusName?: string;
}
export const PutRuleRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ScheduleExpression: S.optional(S.String),
    EventPattern: S.optional(S.String),
    State: S.optional(RuleState),
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Tags: S.optional(TagList),
    EventBusName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRuleRequest",
}) as any as S.Schema<PutRuleRequest>;
export interface RemovePermissionRequest {
  StatementId?: string;
  RemoveAllPermissions?: boolean;
  EventBusName?: string;
}
export const RemovePermissionRequest = S.suspend(() =>
  S.Struct({
    StatementId: S.optional(S.String),
    RemoveAllPermissions: S.optional(S.Boolean),
    EventBusName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemovePermissionRequest",
}) as any as S.Schema<RemovePermissionRequest>;
export interface RemovePermissionResponse {}
export const RemovePermissionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemovePermissionResponse",
}) as any as S.Schema<RemovePermissionResponse>;
export interface RemoveTargetsRequest {
  Rule: string;
  EventBusName?: string;
  Ids: string[];
  Force?: boolean;
}
export const RemoveTargetsRequest = S.suspend(() =>
  S.Struct({
    Rule: S.String,
    EventBusName: S.optional(S.String),
    Ids: TargetIdList,
    Force: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveTargetsRequest",
}) as any as S.Schema<RemoveTargetsRequest>;
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface TestEventPatternRequest {
  EventPattern: string;
  Event: string;
}
export const TestEventPatternRequest = S.suspend(() =>
  S.Struct({ EventPattern: S.String, Event: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestEventPatternRequest",
}) as any as S.Schema<TestEventPatternRequest>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateApiDestinationRequest {
  Name: string;
  Description?: string;
  ConnectionArn?: string;
  InvocationEndpoint?: string;
  HttpMethod?: ApiDestinationHttpMethod;
  InvocationRateLimitPerSecond?: number;
}
export const UpdateApiDestinationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    ConnectionArn: S.optional(S.String),
    InvocationEndpoint: S.optional(S.String),
    HttpMethod: S.optional(ApiDestinationHttpMethod),
    InvocationRateLimitPerSecond: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApiDestinationRequest",
}) as any as S.Schema<UpdateApiDestinationRequest>;
export interface UpdateArchiveRequest {
  ArchiveName: string;
  Description?: string;
  EventPattern?: string;
  RetentionDays?: number;
}
export const UpdateArchiveRequest = S.suspend(() =>
  S.Struct({
    ArchiveName: S.String,
    Description: S.optional(S.String),
    EventPattern: S.optional(S.String),
    RetentionDays: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateArchiveRequest",
}) as any as S.Schema<UpdateArchiveRequest>;
export type EventResourceList = string[];
export const EventResourceList = S.Array(S.String);
export type ReplayDestinationFilters = string[];
export const ReplayDestinationFilters = S.Array(S.String);
export type ApiDestinationState = "ACTIVE" | "INACTIVE";
export const ApiDestinationState = S.Literal("ACTIVE", "INACTIVE");
export type EventSourceState = "PENDING" | "ACTIVE" | "DELETED";
export const EventSourceState = S.Literal("PENDING", "ACTIVE", "DELETED");
export type RuleNameList = string[];
export const RuleNameList = S.Array(S.String);
export interface PutEventsRequestEntry {
  Time?: Date;
  Source?: string;
  Resources?: string[];
  DetailType?: string;
  Detail?: string;
  EventBusName?: string;
  TraceHeader?: string;
}
export const PutEventsRequestEntry = S.suspend(() =>
  S.Struct({
    Time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Source: S.optional(S.String),
    Resources: S.optional(EventResourceList),
    DetailType: S.optional(S.String),
    Detail: S.optional(S.String),
    EventBusName: S.optional(S.String),
    TraceHeader: S.optional(S.String),
  }),
).annotations({
  identifier: "PutEventsRequestEntry",
}) as any as S.Schema<PutEventsRequestEntry>;
export type PutEventsRequestEntryList = PutEventsRequestEntry[];
export const PutEventsRequestEntryList = S.Array(PutEventsRequestEntry);
export interface PutPartnerEventsRequestEntry {
  Time?: Date;
  Source?: string;
  Resources?: string[];
  DetailType?: string;
  Detail?: string;
}
export const PutPartnerEventsRequestEntry = S.suspend(() =>
  S.Struct({
    Time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Source: S.optional(S.String),
    Resources: S.optional(EventResourceList),
    DetailType: S.optional(S.String),
    Detail: S.optional(S.String),
  }),
).annotations({
  identifier: "PutPartnerEventsRequestEntry",
}) as any as S.Schema<PutPartnerEventsRequestEntry>;
export type PutPartnerEventsRequestEntryList = PutPartnerEventsRequestEntry[];
export const PutPartnerEventsRequestEntryList = S.Array(
  PutPartnerEventsRequestEntry,
);
export interface Condition {
  Type: string;
  Key: string;
  Value: string;
}
export const Condition = S.suspend(() =>
  S.Struct({ Type: S.String, Key: S.String, Value: S.String }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export interface ReplayDestination {
  Arn: string;
  FilterArns?: string[];
}
export const ReplayDestination = S.suspend(() =>
  S.Struct({ Arn: S.String, FilterArns: S.optional(ReplayDestinationFilters) }),
).annotations({
  identifier: "ReplayDestination",
}) as any as S.Schema<ReplayDestination>;
export type ConnectionOAuthHttpMethod = "GET" | "POST" | "PUT";
export const ConnectionOAuthHttpMethod = S.Literal("GET", "POST", "PUT");
export type LaunchType = "EC2" | "FARGATE" | "EXTERNAL";
export const LaunchType = S.Literal("EC2", "FARGATE", "EXTERNAL");
export type PropagateTags = "TASK_DEFINITION";
export const PropagateTags = S.Literal("TASK_DEFINITION");
export type PathParameterList = string[];
export const PathParameterList = S.Array(S.String);
export interface CancelReplayResponse {
  ReplayArn?: string;
  State?: ReplayState;
  StateReason?: string;
}
export const CancelReplayResponse = S.suspend(() =>
  S.Struct({
    ReplayArn: S.optional(S.String),
    State: S.optional(ReplayState),
    StateReason: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CancelReplayResponse",
}) as any as S.Schema<CancelReplayResponse>;
export interface CreateApiDestinationResponse {
  ApiDestinationArn?: string;
  ApiDestinationState?: ApiDestinationState;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const CreateApiDestinationResponse = S.suspend(() =>
  S.Struct({
    ApiDestinationArn: S.optional(S.String),
    ApiDestinationState: S.optional(ApiDestinationState),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "CreateApiDestinationResponse",
}) as any as S.Schema<CreateApiDestinationResponse>;
export interface CreateArchiveResponse {
  ArchiveArn?: string;
  State?: ArchiveState;
  StateReason?: string;
  CreationTime?: Date;
}
export const CreateArchiveResponse = S.suspend(() =>
  S.Struct({
    ArchiveArn: S.optional(S.String),
    State: S.optional(ArchiveState),
    StateReason: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "CreateArchiveResponse",
}) as any as S.Schema<CreateArchiveResponse>;
export interface CreateEventBusRequest {
  Name: string;
  EventSourceName?: string;
  Tags?: Tag[];
}
export const CreateEventBusRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    EventSourceName: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEventBusRequest",
}) as any as S.Schema<CreateEventBusRequest>;
export interface CreatePartnerEventSourceResponse {
  EventSourceArn?: string;
}
export const CreatePartnerEventSourceResponse = S.suspend(() =>
  S.Struct({ EventSourceArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreatePartnerEventSourceResponse",
}) as any as S.Schema<CreatePartnerEventSourceResponse>;
export interface DeauthorizeConnectionResponse {
  ConnectionArn?: string;
  ConnectionState?: ConnectionState;
  CreationTime?: Date;
  LastModifiedTime?: Date;
  LastAuthorizedTime?: Date;
}
export const DeauthorizeConnectionResponse = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.optional(S.String),
    ConnectionState: S.optional(ConnectionState),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastAuthorizedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "DeauthorizeConnectionResponse",
}) as any as S.Schema<DeauthorizeConnectionResponse>;
export interface DeleteConnectionResponse {
  ConnectionArn?: string;
  ConnectionState?: ConnectionState;
  CreationTime?: Date;
  LastModifiedTime?: Date;
  LastAuthorizedTime?: Date;
}
export const DeleteConnectionResponse = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.optional(S.String),
    ConnectionState: S.optional(ConnectionState),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastAuthorizedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "DeleteConnectionResponse",
}) as any as S.Schema<DeleteConnectionResponse>;
export interface DescribeApiDestinationResponse {
  ApiDestinationArn?: string;
  Name?: string;
  Description?: string;
  ApiDestinationState?: ApiDestinationState;
  ConnectionArn?: string;
  InvocationEndpoint?: string;
  HttpMethod?: ApiDestinationHttpMethod;
  InvocationRateLimitPerSecond?: number;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const DescribeApiDestinationResponse = S.suspend(() =>
  S.Struct({
    ApiDestinationArn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ApiDestinationState: S.optional(ApiDestinationState),
    ConnectionArn: S.optional(S.String),
    InvocationEndpoint: S.optional(S.String),
    HttpMethod: S.optional(ApiDestinationHttpMethod),
    InvocationRateLimitPerSecond: S.optional(S.Number),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "DescribeApiDestinationResponse",
}) as any as S.Schema<DescribeApiDestinationResponse>;
export interface DescribeArchiveResponse {
  ArchiveArn?: string;
  ArchiveName?: string;
  EventSourceArn?: string;
  Description?: string;
  EventPattern?: string;
  State?: ArchiveState;
  StateReason?: string;
  RetentionDays?: number;
  SizeBytes?: number;
  EventCount?: number;
  CreationTime?: Date;
}
export const DescribeArchiveResponse = S.suspend(() =>
  S.Struct({
    ArchiveArn: S.optional(S.String),
    ArchiveName: S.optional(S.String),
    EventSourceArn: S.optional(S.String),
    Description: S.optional(S.String),
    EventPattern: S.optional(S.String),
    State: S.optional(ArchiveState),
    StateReason: S.optional(S.String),
    RetentionDays: S.optional(S.Number),
    SizeBytes: S.optional(S.Number),
    EventCount: S.optional(S.Number),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "DescribeArchiveResponse",
}) as any as S.Schema<DescribeArchiveResponse>;
export interface DescribeEventBusResponse {
  Name?: string;
  Arn?: string;
  Policy?: string;
}
export const DescribeEventBusResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Policy: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeEventBusResponse",
}) as any as S.Schema<DescribeEventBusResponse>;
export interface DescribeEventSourceResponse {
  Arn?: string;
  CreatedBy?: string;
  CreationTime?: Date;
  ExpirationTime?: Date;
  Name?: string;
  State?: EventSourceState;
}
export const DescribeEventSourceResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreatedBy: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Name: S.optional(S.String),
    State: S.optional(EventSourceState),
  }).pipe(ns),
).annotations({
  identifier: "DescribeEventSourceResponse",
}) as any as S.Schema<DescribeEventSourceResponse>;
export interface DescribePartnerEventSourceResponse {
  Arn?: string;
  Name?: string;
}
export const DescribePartnerEventSourceResponse = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Name: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DescribePartnerEventSourceResponse",
}) as any as S.Schema<DescribePartnerEventSourceResponse>;
export interface DescribeReplayResponse {
  ReplayName?: string;
  ReplayArn?: string;
  Description?: string;
  State?: ReplayState;
  StateReason?: string;
  EventSourceArn?: string;
  Destination?: ReplayDestination;
  EventStartTime?: Date;
  EventEndTime?: Date;
  EventLastReplayedTime?: Date;
  ReplayStartTime?: Date;
  ReplayEndTime?: Date;
}
export const DescribeReplayResponse = S.suspend(() =>
  S.Struct({
    ReplayName: S.optional(S.String),
    ReplayArn: S.optional(S.String),
    Description: S.optional(S.String),
    State: S.optional(ReplayState),
    StateReason: S.optional(S.String),
    EventSourceArn: S.optional(S.String),
    Destination: S.optional(ReplayDestination),
    EventStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventLastReplayedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReplayStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReplayEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "DescribeReplayResponse",
}) as any as S.Schema<DescribeReplayResponse>;
export interface DescribeRuleResponse {
  Name?: string;
  Arn?: string;
  EventPattern?: string;
  ScheduleExpression?: string;
  State?: RuleState;
  Description?: string;
  RoleArn?: string;
  ManagedBy?: string;
  EventBusName?: string;
  CreatedBy?: string;
}
export const DescribeRuleResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    EventPattern: S.optional(S.String),
    ScheduleExpression: S.optional(S.String),
    State: S.optional(RuleState),
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ManagedBy: S.optional(S.String),
    EventBusName: S.optional(S.String),
    CreatedBy: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRuleResponse",
}) as any as S.Schema<DescribeRuleResponse>;
export interface ListRuleNamesByTargetResponse {
  RuleNames?: string[];
  NextToken?: string;
}
export const ListRuleNamesByTargetResponse = S.suspend(() =>
  S.Struct({
    RuleNames: S.optional(RuleNameList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRuleNamesByTargetResponse",
}) as any as S.Schema<ListRuleNamesByTargetResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export type TransformerPaths = { [key: string]: string };
export const TransformerPaths = S.Record({ key: S.String, value: S.String });
export interface InputTransformer {
  InputPathsMap?: { [key: string]: string };
  InputTemplate: string;
}
export const InputTransformer = S.suspend(() =>
  S.Struct({
    InputPathsMap: S.optional(TransformerPaths),
    InputTemplate: S.String,
  }),
).annotations({
  identifier: "InputTransformer",
}) as any as S.Schema<InputTransformer>;
export interface KinesisParameters {
  PartitionKeyPath: string;
}
export const KinesisParameters = S.suspend(() =>
  S.Struct({ PartitionKeyPath: S.String }),
).annotations({
  identifier: "KinesisParameters",
}) as any as S.Schema<KinesisParameters>;
export type RunCommandTargetValues = string[];
export const RunCommandTargetValues = S.Array(S.String);
export interface RunCommandTarget {
  Key: string;
  Values: string[];
}
export const RunCommandTarget = S.suspend(() =>
  S.Struct({ Key: S.String, Values: RunCommandTargetValues }),
).annotations({
  identifier: "RunCommandTarget",
}) as any as S.Schema<RunCommandTarget>;
export type RunCommandTargets = RunCommandTarget[];
export const RunCommandTargets = S.Array(RunCommandTarget);
export interface RunCommandParameters {
  RunCommandTargets: RunCommandTarget[];
}
export const RunCommandParameters = S.suspend(() =>
  S.Struct({ RunCommandTargets: RunCommandTargets }),
).annotations({
  identifier: "RunCommandParameters",
}) as any as S.Schema<RunCommandParameters>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export type AssignPublicIp = "ENABLED" | "DISABLED";
export const AssignPublicIp = S.Literal("ENABLED", "DISABLED");
export interface AwsVpcConfiguration {
  Subnets: string[];
  SecurityGroups?: string[];
  AssignPublicIp?: AssignPublicIp;
}
export const AwsVpcConfiguration = S.suspend(() =>
  S.Struct({
    Subnets: StringList,
    SecurityGroups: S.optional(StringList),
    AssignPublicIp: S.optional(AssignPublicIp),
  }),
).annotations({
  identifier: "AwsVpcConfiguration",
}) as any as S.Schema<AwsVpcConfiguration>;
export interface NetworkConfiguration {
  awsvpcConfiguration?: AwsVpcConfiguration;
}
export const NetworkConfiguration = S.suspend(() =>
  S.Struct({ awsvpcConfiguration: S.optional(AwsVpcConfiguration) }),
).annotations({
  identifier: "NetworkConfiguration",
}) as any as S.Schema<NetworkConfiguration>;
export interface CapacityProviderStrategyItem {
  capacityProvider: string;
  weight?: number;
  base?: number;
}
export const CapacityProviderStrategyItem = S.suspend(() =>
  S.Struct({
    capacityProvider: S.String,
    weight: S.optional(S.Number),
    base: S.optional(S.Number),
  }),
).annotations({
  identifier: "CapacityProviderStrategyItem",
}) as any as S.Schema<CapacityProviderStrategyItem>;
export type CapacityProviderStrategy = CapacityProviderStrategyItem[];
export const CapacityProviderStrategy = S.Array(CapacityProviderStrategyItem);
export type PlacementConstraintType = "distinctInstance" | "memberOf";
export const PlacementConstraintType = S.Literal(
  "distinctInstance",
  "memberOf",
);
export interface PlacementConstraint {
  type?: PlacementConstraintType;
  expression?: string;
}
export const PlacementConstraint = S.suspend(() =>
  S.Struct({
    type: S.optional(PlacementConstraintType),
    expression: S.optional(S.String),
  }),
).annotations({
  identifier: "PlacementConstraint",
}) as any as S.Schema<PlacementConstraint>;
export type PlacementConstraints = PlacementConstraint[];
export const PlacementConstraints = S.Array(PlacementConstraint);
export type PlacementStrategyType = "random" | "spread" | "binpack";
export const PlacementStrategyType = S.Literal("random", "spread", "binpack");
export interface PlacementStrategy {
  type?: PlacementStrategyType;
  field?: string;
}
export const PlacementStrategy = S.suspend(() =>
  S.Struct({
    type: S.optional(PlacementStrategyType),
    field: S.optional(S.String),
  }),
).annotations({
  identifier: "PlacementStrategy",
}) as any as S.Schema<PlacementStrategy>;
export type PlacementStrategies = PlacementStrategy[];
export const PlacementStrategies = S.Array(PlacementStrategy);
export interface EcsParameters {
  TaskDefinitionArn: string;
  TaskCount?: number;
  LaunchType?: LaunchType;
  NetworkConfiguration?: NetworkConfiguration;
  PlatformVersion?: string;
  Group?: string;
  CapacityProviderStrategy?: CapacityProviderStrategyItem[];
  EnableECSManagedTags?: boolean;
  EnableExecuteCommand?: boolean;
  PlacementConstraints?: PlacementConstraint[];
  PlacementStrategy?: PlacementStrategy[];
  PropagateTags?: PropagateTags;
  ReferenceId?: string;
  Tags?: Tag[];
}
export const EcsParameters = S.suspend(() =>
  S.Struct({
    TaskDefinitionArn: S.String,
    TaskCount: S.optional(S.Number),
    LaunchType: S.optional(LaunchType),
    NetworkConfiguration: S.optional(NetworkConfiguration),
    PlatformVersion: S.optional(S.String),
    Group: S.optional(S.String),
    CapacityProviderStrategy: S.optional(CapacityProviderStrategy),
    EnableECSManagedTags: S.optional(S.Boolean),
    EnableExecuteCommand: S.optional(S.Boolean),
    PlacementConstraints: S.optional(PlacementConstraints),
    PlacementStrategy: S.optional(PlacementStrategies),
    PropagateTags: S.optional(PropagateTags),
    ReferenceId: S.optional(S.String),
    Tags: S.optional(TagList),
  }),
).annotations({
  identifier: "EcsParameters",
}) as any as S.Schema<EcsParameters>;
export interface BatchArrayProperties {
  Size?: number;
}
export const BatchArrayProperties = S.suspend(() =>
  S.Struct({ Size: S.optional(S.Number) }),
).annotations({
  identifier: "BatchArrayProperties",
}) as any as S.Schema<BatchArrayProperties>;
export interface BatchRetryStrategy {
  Attempts?: number;
}
export const BatchRetryStrategy = S.suspend(() =>
  S.Struct({ Attempts: S.optional(S.Number) }),
).annotations({
  identifier: "BatchRetryStrategy",
}) as any as S.Schema<BatchRetryStrategy>;
export interface BatchParameters {
  JobDefinition: string;
  JobName: string;
  ArrayProperties?: BatchArrayProperties;
  RetryStrategy?: BatchRetryStrategy;
}
export const BatchParameters = S.suspend(() =>
  S.Struct({
    JobDefinition: S.String,
    JobName: S.String,
    ArrayProperties: S.optional(BatchArrayProperties),
    RetryStrategy: S.optional(BatchRetryStrategy),
  }),
).annotations({
  identifier: "BatchParameters",
}) as any as S.Schema<BatchParameters>;
export interface SqsParameters {
  MessageGroupId?: string;
}
export const SqsParameters = S.suspend(() =>
  S.Struct({ MessageGroupId: S.optional(S.String) }),
).annotations({
  identifier: "SqsParameters",
}) as any as S.Schema<SqsParameters>;
export type HeaderParametersMap = { [key: string]: string };
export const HeaderParametersMap = S.Record({ key: S.String, value: S.String });
export type QueryStringParametersMap = { [key: string]: string };
export const QueryStringParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface HttpParameters {
  PathParameterValues?: string[];
  HeaderParameters?: { [key: string]: string };
  QueryStringParameters?: { [key: string]: string };
}
export const HttpParameters = S.suspend(() =>
  S.Struct({
    PathParameterValues: S.optional(PathParameterList),
    HeaderParameters: S.optional(HeaderParametersMap),
    QueryStringParameters: S.optional(QueryStringParametersMap),
  }),
).annotations({
  identifier: "HttpParameters",
}) as any as S.Schema<HttpParameters>;
export interface RedshiftDataParameters {
  SecretManagerArn?: string;
  Database: string;
  DbUser?: string;
  Sql: string;
  StatementName?: string;
  WithEvent?: boolean;
}
export const RedshiftDataParameters = S.suspend(() =>
  S.Struct({
    SecretManagerArn: S.optional(S.String),
    Database: S.String,
    DbUser: S.optional(S.String),
    Sql: S.String,
    StatementName: S.optional(S.String),
    WithEvent: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RedshiftDataParameters",
}) as any as S.Schema<RedshiftDataParameters>;
export interface SageMakerPipelineParameter {
  Name: string;
  Value: string;
}
export const SageMakerPipelineParameter = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "SageMakerPipelineParameter",
}) as any as S.Schema<SageMakerPipelineParameter>;
export type SageMakerPipelineParameterList = SageMakerPipelineParameter[];
export const SageMakerPipelineParameterList = S.Array(
  SageMakerPipelineParameter,
);
export interface SageMakerPipelineParameters {
  PipelineParameterList?: SageMakerPipelineParameter[];
}
export const SageMakerPipelineParameters = S.suspend(() =>
  S.Struct({
    PipelineParameterList: S.optional(SageMakerPipelineParameterList),
  }),
).annotations({
  identifier: "SageMakerPipelineParameters",
}) as any as S.Schema<SageMakerPipelineParameters>;
export interface DeadLetterConfig {
  Arn?: string;
}
export const DeadLetterConfig = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String) }),
).annotations({
  identifier: "DeadLetterConfig",
}) as any as S.Schema<DeadLetterConfig>;
export interface RetryPolicy {
  MaximumRetryAttempts?: number;
  MaximumEventAgeInSeconds?: number;
}
export const RetryPolicy = S.suspend(() =>
  S.Struct({
    MaximumRetryAttempts: S.optional(S.Number),
    MaximumEventAgeInSeconds: S.optional(S.Number),
  }),
).annotations({ identifier: "RetryPolicy" }) as any as S.Schema<RetryPolicy>;
export interface Target {
  Id: string;
  Arn: string;
  RoleArn?: string;
  Input?: string;
  InputPath?: string;
  InputTransformer?: InputTransformer;
  KinesisParameters?: KinesisParameters;
  RunCommandParameters?: RunCommandParameters;
  EcsParameters?: EcsParameters;
  BatchParameters?: BatchParameters;
  SqsParameters?: SqsParameters;
  HttpParameters?: HttpParameters;
  RedshiftDataParameters?: RedshiftDataParameters;
  SageMakerPipelineParameters?: SageMakerPipelineParameters;
  DeadLetterConfig?: DeadLetterConfig;
  RetryPolicy?: RetryPolicy;
}
export const Target = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Arn: S.String,
    RoleArn: S.optional(S.String),
    Input: S.optional(S.String),
    InputPath: S.optional(S.String),
    InputTransformer: S.optional(InputTransformer),
    KinesisParameters: S.optional(KinesisParameters),
    RunCommandParameters: S.optional(RunCommandParameters),
    EcsParameters: S.optional(EcsParameters),
    BatchParameters: S.optional(BatchParameters),
    SqsParameters: S.optional(SqsParameters),
    HttpParameters: S.optional(HttpParameters),
    RedshiftDataParameters: S.optional(RedshiftDataParameters),
    SageMakerPipelineParameters: S.optional(SageMakerPipelineParameters),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    RetryPolicy: S.optional(RetryPolicy),
  }),
).annotations({ identifier: "Target" }) as any as S.Schema<Target>;
export type TargetList = Target[];
export const TargetList = S.Array(Target);
export interface ListTargetsByRuleResponse {
  Targets?: Target[];
  NextToken?: string;
}
export const ListTargetsByRuleResponse = S.suspend(() =>
  S.Struct({
    Targets: S.optional(TargetList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTargetsByRuleResponse",
}) as any as S.Schema<ListTargetsByRuleResponse>;
export interface PutEventsRequest {
  Entries: PutEventsRequestEntry[];
}
export const PutEventsRequest = S.suspend(() =>
  S.Struct({ Entries: PutEventsRequestEntryList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEventsRequest",
}) as any as S.Schema<PutEventsRequest>;
export interface PutPartnerEventsRequest {
  Entries: PutPartnerEventsRequestEntry[];
}
export const PutPartnerEventsRequest = S.suspend(() =>
  S.Struct({ Entries: PutPartnerEventsRequestEntryList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutPartnerEventsRequest",
}) as any as S.Schema<PutPartnerEventsRequest>;
export interface PutPermissionRequest {
  EventBusName?: string;
  Action?: string;
  Principal?: string;
  StatementId?: string;
  Condition?: Condition;
  Policy?: string;
}
export const PutPermissionRequest = S.suspend(() =>
  S.Struct({
    EventBusName: S.optional(S.String),
    Action: S.optional(S.String),
    Principal: S.optional(S.String),
    StatementId: S.optional(S.String),
    Condition: S.optional(Condition),
    Policy: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutPermissionRequest",
}) as any as S.Schema<PutPermissionRequest>;
export interface PutPermissionResponse {}
export const PutPermissionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutPermissionResponse",
}) as any as S.Schema<PutPermissionResponse>;
export interface PutRuleResponse {
  RuleArn?: string;
}
export const PutRuleResponse = S.suspend(() =>
  S.Struct({ RuleArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutRuleResponse",
}) as any as S.Schema<PutRuleResponse>;
export interface StartReplayRequest {
  ReplayName: string;
  Description?: string;
  EventSourceArn: string;
  EventStartTime: Date;
  EventEndTime: Date;
  Destination: ReplayDestination;
}
export const StartReplayRequest = S.suspend(() =>
  S.Struct({
    ReplayName: S.String,
    Description: S.optional(S.String),
    EventSourceArn: S.String,
    EventStartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EventEndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Destination: ReplayDestination,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartReplayRequest",
}) as any as S.Schema<StartReplayRequest>;
export interface TestEventPatternResponse {
  Result?: boolean;
}
export const TestEventPatternResponse = S.suspend(() =>
  S.Struct({ Result: S.optional(S.Boolean) }).pipe(ns),
).annotations({
  identifier: "TestEventPatternResponse",
}) as any as S.Schema<TestEventPatternResponse>;
export interface UpdateApiDestinationResponse {
  ApiDestinationArn?: string;
  ApiDestinationState?: ApiDestinationState;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const UpdateApiDestinationResponse = S.suspend(() =>
  S.Struct({
    ApiDestinationArn: S.optional(S.String),
    ApiDestinationState: S.optional(ApiDestinationState),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "UpdateApiDestinationResponse",
}) as any as S.Schema<UpdateApiDestinationResponse>;
export interface UpdateArchiveResponse {
  ArchiveArn?: string;
  State?: ArchiveState;
  StateReason?: string;
  CreationTime?: Date;
}
export const UpdateArchiveResponse = S.suspend(() =>
  S.Struct({
    ArchiveArn: S.optional(S.String),
    State: S.optional(ArchiveState),
    StateReason: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "UpdateArchiveResponse",
}) as any as S.Schema<UpdateArchiveResponse>;
export interface CreateConnectionBasicAuthRequestParameters {
  Username: string;
  Password: string | redacted.Redacted<string>;
}
export const CreateConnectionBasicAuthRequestParameters = S.suspend(() =>
  S.Struct({ Username: S.String, Password: SensitiveString }),
).annotations({
  identifier: "CreateConnectionBasicAuthRequestParameters",
}) as any as S.Schema<CreateConnectionBasicAuthRequestParameters>;
export interface CreateConnectionApiKeyAuthRequestParameters {
  ApiKeyName: string;
  ApiKeyValue: string | redacted.Redacted<string>;
}
export const CreateConnectionApiKeyAuthRequestParameters = S.suspend(() =>
  S.Struct({ ApiKeyName: S.String, ApiKeyValue: SensitiveString }),
).annotations({
  identifier: "CreateConnectionApiKeyAuthRequestParameters",
}) as any as S.Schema<CreateConnectionApiKeyAuthRequestParameters>;
export interface UpdateConnectionBasicAuthRequestParameters {
  Username?: string;
  Password?: string | redacted.Redacted<string>;
}
export const UpdateConnectionBasicAuthRequestParameters = S.suspend(() =>
  S.Struct({
    Username: S.optional(S.String),
    Password: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "UpdateConnectionBasicAuthRequestParameters",
}) as any as S.Schema<UpdateConnectionBasicAuthRequestParameters>;
export interface UpdateConnectionApiKeyAuthRequestParameters {
  ApiKeyName?: string;
  ApiKeyValue?: string | redacted.Redacted<string>;
}
export const UpdateConnectionApiKeyAuthRequestParameters = S.suspend(() =>
  S.Struct({
    ApiKeyName: S.optional(S.String),
    ApiKeyValue: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "UpdateConnectionApiKeyAuthRequestParameters",
}) as any as S.Schema<UpdateConnectionApiKeyAuthRequestParameters>;
export interface ApiDestination {
  ApiDestinationArn?: string;
  Name?: string;
  ApiDestinationState?: ApiDestinationState;
  ConnectionArn?: string;
  InvocationEndpoint?: string;
  HttpMethod?: ApiDestinationHttpMethod;
  InvocationRateLimitPerSecond?: number;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const ApiDestination = S.suspend(() =>
  S.Struct({
    ApiDestinationArn: S.optional(S.String),
    Name: S.optional(S.String),
    ApiDestinationState: S.optional(ApiDestinationState),
    ConnectionArn: S.optional(S.String),
    InvocationEndpoint: S.optional(S.String),
    HttpMethod: S.optional(ApiDestinationHttpMethod),
    InvocationRateLimitPerSecond: S.optional(S.Number),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ApiDestination",
}) as any as S.Schema<ApiDestination>;
export type ApiDestinationResponseList = ApiDestination[];
export const ApiDestinationResponseList = S.Array(ApiDestination);
export interface Archive {
  ArchiveName?: string;
  EventSourceArn?: string;
  State?: ArchiveState;
  StateReason?: string;
  RetentionDays?: number;
  SizeBytes?: number;
  EventCount?: number;
  CreationTime?: Date;
}
export const Archive = S.suspend(() =>
  S.Struct({
    ArchiveName: S.optional(S.String),
    EventSourceArn: S.optional(S.String),
    State: S.optional(ArchiveState),
    StateReason: S.optional(S.String),
    RetentionDays: S.optional(S.Number),
    SizeBytes: S.optional(S.Number),
    EventCount: S.optional(S.Number),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Archive" }) as any as S.Schema<Archive>;
export type ArchiveResponseList = Archive[];
export const ArchiveResponseList = S.Array(Archive);
export interface Connection {
  ConnectionArn?: string;
  Name?: string;
  ConnectionState?: ConnectionState;
  StateReason?: string;
  AuthorizationType?: ConnectionAuthorizationType;
  CreationTime?: Date;
  LastModifiedTime?: Date;
  LastAuthorizedTime?: Date;
}
export const Connection = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.optional(S.String),
    Name: S.optional(S.String),
    ConnectionState: S.optional(ConnectionState),
    StateReason: S.optional(S.String),
    AuthorizationType: S.optional(ConnectionAuthorizationType),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastAuthorizedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Connection" }) as any as S.Schema<Connection>;
export type ConnectionResponseList = Connection[];
export const ConnectionResponseList = S.Array(Connection);
export interface EventBus {
  Name?: string;
  Arn?: string;
  Policy?: string;
}
export const EventBus = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Policy: S.optional(S.String),
  }),
).annotations({ identifier: "EventBus" }) as any as S.Schema<EventBus>;
export type EventBusList = EventBus[];
export const EventBusList = S.Array(EventBus);
export interface EventSource {
  Arn?: string;
  CreatedBy?: string;
  CreationTime?: Date;
  ExpirationTime?: Date;
  Name?: string;
  State?: EventSourceState;
}
export const EventSource = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CreatedBy: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Name: S.optional(S.String),
    State: S.optional(EventSourceState),
  }),
).annotations({ identifier: "EventSource" }) as any as S.Schema<EventSource>;
export type EventSourceList = EventSource[];
export const EventSourceList = S.Array(EventSource);
export interface PartnerEventSourceAccount {
  Account?: string;
  CreationTime?: Date;
  ExpirationTime?: Date;
  State?: EventSourceState;
}
export const PartnerEventSourceAccount = S.suspend(() =>
  S.Struct({
    Account: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    State: S.optional(EventSourceState),
  }),
).annotations({
  identifier: "PartnerEventSourceAccount",
}) as any as S.Schema<PartnerEventSourceAccount>;
export type PartnerEventSourceAccountList = PartnerEventSourceAccount[];
export const PartnerEventSourceAccountList = S.Array(PartnerEventSourceAccount);
export interface PartnerEventSource {
  Arn?: string;
  Name?: string;
}
export const PartnerEventSource = S.suspend(() =>
  S.Struct({ Arn: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "PartnerEventSource",
}) as any as S.Schema<PartnerEventSource>;
export type PartnerEventSourceList = PartnerEventSource[];
export const PartnerEventSourceList = S.Array(PartnerEventSource);
export interface Replay {
  ReplayName?: string;
  EventSourceArn?: string;
  State?: ReplayState;
  StateReason?: string;
  EventStartTime?: Date;
  EventEndTime?: Date;
  EventLastReplayedTime?: Date;
  ReplayStartTime?: Date;
  ReplayEndTime?: Date;
}
export const Replay = S.suspend(() =>
  S.Struct({
    ReplayName: S.optional(S.String),
    EventSourceArn: S.optional(S.String),
    State: S.optional(ReplayState),
    StateReason: S.optional(S.String),
    EventStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventLastReplayedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReplayStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReplayEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Replay" }) as any as S.Schema<Replay>;
export type ReplayList = Replay[];
export const ReplayList = S.Array(Replay);
export interface Rule {
  Name?: string;
  Arn?: string;
  EventPattern?: string;
  State?: RuleState;
  Description?: string;
  ScheduleExpression?: string;
  RoleArn?: string;
  ManagedBy?: string;
  EventBusName?: string;
}
export const Rule = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    EventPattern: S.optional(S.String),
    State: S.optional(RuleState),
    Description: S.optional(S.String),
    ScheduleExpression: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ManagedBy: S.optional(S.String),
    EventBusName: S.optional(S.String),
  }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export type RuleResponseList = Rule[];
export const RuleResponseList = S.Array(Rule);
export interface RemoveTargetsResultEntry {
  TargetId?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const RemoveTargetsResultEntry = S.suspend(() =>
  S.Struct({
    TargetId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "RemoveTargetsResultEntry",
}) as any as S.Schema<RemoveTargetsResultEntry>;
export type RemoveTargetsResultEntryList = RemoveTargetsResultEntry[];
export const RemoveTargetsResultEntryList = S.Array(RemoveTargetsResultEntry);
export interface CreateConnectionOAuthClientRequestParameters {
  ClientID: string;
  ClientSecret: string | redacted.Redacted<string>;
}
export const CreateConnectionOAuthClientRequestParameters = S.suspend(() =>
  S.Struct({ ClientID: S.String, ClientSecret: SensitiveString }),
).annotations({
  identifier: "CreateConnectionOAuthClientRequestParameters",
}) as any as S.Schema<CreateConnectionOAuthClientRequestParameters>;
export interface ConnectionHeaderParameter {
  Key?: string;
  Value?: string | redacted.Redacted<string>;
  IsValueSecret?: boolean;
}
export const ConnectionHeaderParameter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(SensitiveString),
    IsValueSecret: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ConnectionHeaderParameter",
}) as any as S.Schema<ConnectionHeaderParameter>;
export type ConnectionHeaderParametersList = ConnectionHeaderParameter[];
export const ConnectionHeaderParametersList = S.Array(
  ConnectionHeaderParameter,
);
export interface ConnectionQueryStringParameter {
  Key?: string;
  Value?: string | redacted.Redacted<string>;
  IsValueSecret?: boolean;
}
export const ConnectionQueryStringParameter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(SensitiveString),
    IsValueSecret: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ConnectionQueryStringParameter",
}) as any as S.Schema<ConnectionQueryStringParameter>;
export type ConnectionQueryStringParametersList =
  ConnectionQueryStringParameter[];
export const ConnectionQueryStringParametersList = S.Array(
  ConnectionQueryStringParameter,
);
export interface ConnectionBodyParameter {
  Key?: string;
  Value?: string | redacted.Redacted<string>;
  IsValueSecret?: boolean;
}
export const ConnectionBodyParameter = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(SensitiveString),
    IsValueSecret: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ConnectionBodyParameter",
}) as any as S.Schema<ConnectionBodyParameter>;
export type ConnectionBodyParametersList = ConnectionBodyParameter[];
export const ConnectionBodyParametersList = S.Array(ConnectionBodyParameter);
export interface UpdateConnectionOAuthClientRequestParameters {
  ClientID?: string;
  ClientSecret?: string | redacted.Redacted<string>;
}
export const UpdateConnectionOAuthClientRequestParameters = S.suspend(() =>
  S.Struct({
    ClientID: S.optional(S.String),
    ClientSecret: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "UpdateConnectionOAuthClientRequestParameters",
}) as any as S.Schema<UpdateConnectionOAuthClientRequestParameters>;
export interface CreateEventBusResponse {
  EventBusArn?: string;
}
export const CreateEventBusResponse = S.suspend(() =>
  S.Struct({ EventBusArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateEventBusResponse",
}) as any as S.Schema<CreateEventBusResponse>;
export interface ListApiDestinationsResponse {
  ApiDestinations?: ApiDestination[];
  NextToken?: string;
}
export const ListApiDestinationsResponse = S.suspend(() =>
  S.Struct({
    ApiDestinations: S.optional(ApiDestinationResponseList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListApiDestinationsResponse",
}) as any as S.Schema<ListApiDestinationsResponse>;
export interface ListArchivesResponse {
  Archives?: Archive[];
  NextToken?: string;
}
export const ListArchivesResponse = S.suspend(() =>
  S.Struct({
    Archives: S.optional(ArchiveResponseList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListArchivesResponse",
}) as any as S.Schema<ListArchivesResponse>;
export interface ListConnectionsResponse {
  Connections?: Connection[];
  NextToken?: string;
}
export const ListConnectionsResponse = S.suspend(() =>
  S.Struct({
    Connections: S.optional(ConnectionResponseList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListConnectionsResponse",
}) as any as S.Schema<ListConnectionsResponse>;
export interface ListEventBusesResponse {
  EventBuses?: EventBus[];
  NextToken?: string;
}
export const ListEventBusesResponse = S.suspend(() =>
  S.Struct({
    EventBuses: S.optional(EventBusList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListEventBusesResponse",
}) as any as S.Schema<ListEventBusesResponse>;
export interface ListEventSourcesResponse {
  EventSources?: EventSource[];
  NextToken?: string;
}
export const ListEventSourcesResponse = S.suspend(() =>
  S.Struct({
    EventSources: S.optional(EventSourceList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListEventSourcesResponse",
}) as any as S.Schema<ListEventSourcesResponse>;
export interface ListPartnerEventSourceAccountsResponse {
  PartnerEventSourceAccounts?: PartnerEventSourceAccount[];
  NextToken?: string;
}
export const ListPartnerEventSourceAccountsResponse = S.suspend(() =>
  S.Struct({
    PartnerEventSourceAccounts: S.optional(PartnerEventSourceAccountList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPartnerEventSourceAccountsResponse",
}) as any as S.Schema<ListPartnerEventSourceAccountsResponse>;
export interface ListPartnerEventSourcesResponse {
  PartnerEventSources?: PartnerEventSource[];
  NextToken?: string;
}
export const ListPartnerEventSourcesResponse = S.suspend(() =>
  S.Struct({
    PartnerEventSources: S.optional(PartnerEventSourceList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPartnerEventSourcesResponse",
}) as any as S.Schema<ListPartnerEventSourcesResponse>;
export interface ListReplaysResponse {
  Replays?: Replay[];
  NextToken?: string;
}
export const ListReplaysResponse = S.suspend(() =>
  S.Struct({
    Replays: S.optional(ReplayList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListReplaysResponse",
}) as any as S.Schema<ListReplaysResponse>;
export interface ListRulesResponse {
  Rules?: Rule[];
  NextToken?: string;
}
export const ListRulesResponse = S.suspend(() =>
  S.Struct({
    Rules: S.optional(RuleResponseList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRulesResponse",
}) as any as S.Schema<ListRulesResponse>;
export interface RemoveTargetsResponse {
  FailedEntryCount?: number;
  FailedEntries?: RemoveTargetsResultEntry[];
}
export const RemoveTargetsResponse = S.suspend(() =>
  S.Struct({
    FailedEntryCount: S.optional(S.Number),
    FailedEntries: S.optional(RemoveTargetsResultEntryList),
  }).pipe(ns),
).annotations({
  identifier: "RemoveTargetsResponse",
}) as any as S.Schema<RemoveTargetsResponse>;
export interface StartReplayResponse {
  ReplayArn?: string;
  State?: ReplayState;
  StateReason?: string;
  ReplayStartTime?: Date;
}
export const StartReplayResponse = S.suspend(() =>
  S.Struct({
    ReplayArn: S.optional(S.String),
    State: S.optional(ReplayState),
    StateReason: S.optional(S.String),
    ReplayStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "StartReplayResponse",
}) as any as S.Schema<StartReplayResponse>;
export interface ConnectionHttpParameters {
  HeaderParameters?: ConnectionHeaderParameter[];
  QueryStringParameters?: ConnectionQueryStringParameter[];
  BodyParameters?: ConnectionBodyParameter[];
}
export const ConnectionHttpParameters = S.suspend(() =>
  S.Struct({
    HeaderParameters: S.optional(ConnectionHeaderParametersList),
    QueryStringParameters: S.optional(ConnectionQueryStringParametersList),
    BodyParameters: S.optional(ConnectionBodyParametersList),
  }),
).annotations({
  identifier: "ConnectionHttpParameters",
}) as any as S.Schema<ConnectionHttpParameters>;
export interface CreateConnectionOAuthRequestParameters {
  ClientParameters: CreateConnectionOAuthClientRequestParameters;
  AuthorizationEndpoint: string;
  HttpMethod: ConnectionOAuthHttpMethod;
  OAuthHttpParameters?: ConnectionHttpParameters;
}
export const CreateConnectionOAuthRequestParameters = S.suspend(() =>
  S.Struct({
    ClientParameters: CreateConnectionOAuthClientRequestParameters,
    AuthorizationEndpoint: S.String,
    HttpMethod: ConnectionOAuthHttpMethod,
    OAuthHttpParameters: S.optional(ConnectionHttpParameters),
  }),
).annotations({
  identifier: "CreateConnectionOAuthRequestParameters",
}) as any as S.Schema<CreateConnectionOAuthRequestParameters>;
export interface ConnectionBasicAuthResponseParameters {
  Username?: string;
}
export const ConnectionBasicAuthResponseParameters = S.suspend(() =>
  S.Struct({ Username: S.optional(S.String) }),
).annotations({
  identifier: "ConnectionBasicAuthResponseParameters",
}) as any as S.Schema<ConnectionBasicAuthResponseParameters>;
export interface ConnectionApiKeyAuthResponseParameters {
  ApiKeyName?: string;
}
export const ConnectionApiKeyAuthResponseParameters = S.suspend(() =>
  S.Struct({ ApiKeyName: S.optional(S.String) }),
).annotations({
  identifier: "ConnectionApiKeyAuthResponseParameters",
}) as any as S.Schema<ConnectionApiKeyAuthResponseParameters>;
export interface UpdateConnectionOAuthRequestParameters {
  ClientParameters?: UpdateConnectionOAuthClientRequestParameters;
  AuthorizationEndpoint?: string;
  HttpMethod?: ConnectionOAuthHttpMethod;
  OAuthHttpParameters?: ConnectionHttpParameters;
}
export const UpdateConnectionOAuthRequestParameters = S.suspend(() =>
  S.Struct({
    ClientParameters: S.optional(UpdateConnectionOAuthClientRequestParameters),
    AuthorizationEndpoint: S.optional(S.String),
    HttpMethod: S.optional(ConnectionOAuthHttpMethod),
    OAuthHttpParameters: S.optional(ConnectionHttpParameters),
  }),
).annotations({
  identifier: "UpdateConnectionOAuthRequestParameters",
}) as any as S.Schema<UpdateConnectionOAuthRequestParameters>;
export interface CreateConnectionAuthRequestParameters {
  BasicAuthParameters?: CreateConnectionBasicAuthRequestParameters;
  OAuthParameters?: CreateConnectionOAuthRequestParameters;
  ApiKeyAuthParameters?: CreateConnectionApiKeyAuthRequestParameters;
  InvocationHttpParameters?: ConnectionHttpParameters;
}
export const CreateConnectionAuthRequestParameters = S.suspend(() =>
  S.Struct({
    BasicAuthParameters: S.optional(CreateConnectionBasicAuthRequestParameters),
    OAuthParameters: S.optional(CreateConnectionOAuthRequestParameters),
    ApiKeyAuthParameters: S.optional(
      CreateConnectionApiKeyAuthRequestParameters,
    ),
    InvocationHttpParameters: S.optional(ConnectionHttpParameters),
  }),
).annotations({
  identifier: "CreateConnectionAuthRequestParameters",
}) as any as S.Schema<CreateConnectionAuthRequestParameters>;
export interface PutEventsResultEntry {
  EventId?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const PutEventsResultEntry = S.suspend(() =>
  S.Struct({
    EventId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "PutEventsResultEntry",
}) as any as S.Schema<PutEventsResultEntry>;
export type PutEventsResultEntryList = PutEventsResultEntry[];
export const PutEventsResultEntryList = S.Array(PutEventsResultEntry);
export interface PutPartnerEventsResultEntry {
  EventId?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const PutPartnerEventsResultEntry = S.suspend(() =>
  S.Struct({
    EventId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "PutPartnerEventsResultEntry",
}) as any as S.Schema<PutPartnerEventsResultEntry>;
export type PutPartnerEventsResultEntryList = PutPartnerEventsResultEntry[];
export const PutPartnerEventsResultEntryList = S.Array(
  PutPartnerEventsResultEntry,
);
export interface UpdateConnectionAuthRequestParameters {
  BasicAuthParameters?: UpdateConnectionBasicAuthRequestParameters;
  OAuthParameters?: UpdateConnectionOAuthRequestParameters;
  ApiKeyAuthParameters?: UpdateConnectionApiKeyAuthRequestParameters;
  InvocationHttpParameters?: ConnectionHttpParameters;
}
export const UpdateConnectionAuthRequestParameters = S.suspend(() =>
  S.Struct({
    BasicAuthParameters: S.optional(UpdateConnectionBasicAuthRequestParameters),
    OAuthParameters: S.optional(UpdateConnectionOAuthRequestParameters),
    ApiKeyAuthParameters: S.optional(
      UpdateConnectionApiKeyAuthRequestParameters,
    ),
    InvocationHttpParameters: S.optional(ConnectionHttpParameters),
  }),
).annotations({
  identifier: "UpdateConnectionAuthRequestParameters",
}) as any as S.Schema<UpdateConnectionAuthRequestParameters>;
export interface ConnectionOAuthClientResponseParameters {
  ClientID?: string;
}
export const ConnectionOAuthClientResponseParameters = S.suspend(() =>
  S.Struct({ ClientID: S.optional(S.String) }),
).annotations({
  identifier: "ConnectionOAuthClientResponseParameters",
}) as any as S.Schema<ConnectionOAuthClientResponseParameters>;
export interface CreateConnectionRequest {
  Name: string;
  Description?: string;
  AuthorizationType: ConnectionAuthorizationType;
  AuthParameters: CreateConnectionAuthRequestParameters;
}
export const CreateConnectionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    AuthorizationType: ConnectionAuthorizationType,
    AuthParameters: CreateConnectionAuthRequestParameters,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConnectionRequest",
}) as any as S.Schema<CreateConnectionRequest>;
export interface PutEventsResponse {
  FailedEntryCount?: number;
  Entries?: PutEventsResultEntry[];
}
export const PutEventsResponse = S.suspend(() =>
  S.Struct({
    FailedEntryCount: S.optional(S.Number),
    Entries: S.optional(PutEventsResultEntryList),
  }).pipe(ns),
).annotations({
  identifier: "PutEventsResponse",
}) as any as S.Schema<PutEventsResponse>;
export interface PutPartnerEventsResponse {
  FailedEntryCount?: number;
  Entries?: PutPartnerEventsResultEntry[];
}
export const PutPartnerEventsResponse = S.suspend(() =>
  S.Struct({
    FailedEntryCount: S.optional(S.Number),
    Entries: S.optional(PutPartnerEventsResultEntryList),
  }).pipe(ns),
).annotations({
  identifier: "PutPartnerEventsResponse",
}) as any as S.Schema<PutPartnerEventsResponse>;
export interface UpdateConnectionRequest {
  Name: string;
  Description?: string;
  AuthorizationType?: ConnectionAuthorizationType;
  AuthParameters?: UpdateConnectionAuthRequestParameters;
}
export const UpdateConnectionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    AuthorizationType: S.optional(ConnectionAuthorizationType),
    AuthParameters: S.optional(UpdateConnectionAuthRequestParameters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConnectionRequest",
}) as any as S.Schema<UpdateConnectionRequest>;
export interface ConnectionOAuthResponseParameters {
  ClientParameters?: ConnectionOAuthClientResponseParameters;
  AuthorizationEndpoint?: string;
  HttpMethod?: ConnectionOAuthHttpMethod;
  OAuthHttpParameters?: ConnectionHttpParameters;
}
export const ConnectionOAuthResponseParameters = S.suspend(() =>
  S.Struct({
    ClientParameters: S.optional(ConnectionOAuthClientResponseParameters),
    AuthorizationEndpoint: S.optional(S.String),
    HttpMethod: S.optional(ConnectionOAuthHttpMethod),
    OAuthHttpParameters: S.optional(ConnectionHttpParameters),
  }),
).annotations({
  identifier: "ConnectionOAuthResponseParameters",
}) as any as S.Schema<ConnectionOAuthResponseParameters>;
export interface ConnectionAuthResponseParameters {
  BasicAuthParameters?: ConnectionBasicAuthResponseParameters;
  OAuthParameters?: ConnectionOAuthResponseParameters;
  ApiKeyAuthParameters?: ConnectionApiKeyAuthResponseParameters;
  InvocationHttpParameters?: ConnectionHttpParameters;
}
export const ConnectionAuthResponseParameters = S.suspend(() =>
  S.Struct({
    BasicAuthParameters: S.optional(ConnectionBasicAuthResponseParameters),
    OAuthParameters: S.optional(ConnectionOAuthResponseParameters),
    ApiKeyAuthParameters: S.optional(ConnectionApiKeyAuthResponseParameters),
    InvocationHttpParameters: S.optional(ConnectionHttpParameters),
  }),
).annotations({
  identifier: "ConnectionAuthResponseParameters",
}) as any as S.Schema<ConnectionAuthResponseParameters>;
export interface CreateConnectionResponse {
  ConnectionArn?: string;
  ConnectionState?: ConnectionState;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const CreateConnectionResponse = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.optional(S.String),
    ConnectionState: S.optional(ConnectionState),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "CreateConnectionResponse",
}) as any as S.Schema<CreateConnectionResponse>;
export interface DescribeConnectionResponse {
  ConnectionArn?: string;
  Name?: string;
  Description?: string;
  ConnectionState?: ConnectionState;
  StateReason?: string;
  AuthorizationType?: ConnectionAuthorizationType;
  SecretArn?: string;
  AuthParameters?: ConnectionAuthResponseParameters;
  CreationTime?: Date;
  LastModifiedTime?: Date;
  LastAuthorizedTime?: Date;
}
export const DescribeConnectionResponse = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ConnectionState: S.optional(ConnectionState),
    StateReason: S.optional(S.String),
    AuthorizationType: S.optional(ConnectionAuthorizationType),
    SecretArn: S.optional(S.String),
    AuthParameters: S.optional(ConnectionAuthResponseParameters),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastAuthorizedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConnectionResponse",
}) as any as S.Schema<DescribeConnectionResponse>;
export interface PutTargetsRequest {
  Rule: string;
  EventBusName?: string;
  Targets: Target[];
}
export const PutTargetsRequest = S.suspend(() =>
  S.Struct({
    Rule: S.String,
    EventBusName: S.optional(S.String),
    Targets: TargetList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutTargetsRequest",
}) as any as S.Schema<PutTargetsRequest>;
export interface UpdateConnectionResponse {
  ConnectionArn?: string;
  ConnectionState?: ConnectionState;
  CreationTime?: Date;
  LastModifiedTime?: Date;
  LastAuthorizedTime?: Date;
}
export const UpdateConnectionResponse = S.suspend(() =>
  S.Struct({
    ConnectionArn: S.optional(S.String),
    ConnectionState: S.optional(ConnectionState),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastAuthorizedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }).pipe(ns),
).annotations({
  identifier: "UpdateConnectionResponse",
}) as any as S.Schema<UpdateConnectionResponse>;
export interface PutTargetsResultEntry {
  TargetId?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const PutTargetsResultEntry = S.suspend(() =>
  S.Struct({
    TargetId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "PutTargetsResultEntry",
}) as any as S.Schema<PutTargetsResultEntry>;
export type PutTargetsResultEntryList = PutTargetsResultEntry[];
export const PutTargetsResultEntryList = S.Array(PutTargetsResultEntry);
export interface PutTargetsResponse {
  FailedEntryCount?: number;
  FailedEntries?: PutTargetsResultEntry[];
}
export const PutTargetsResponse = S.suspend(() =>
  S.Struct({
    FailedEntryCount: S.optional(S.Number),
    FailedEntries: S.optional(PutTargetsResultEntryList),
  }).pipe(ns),
).annotations({
  identifier: "PutTargetsResponse",
}) as any as S.Schema<PutTargetsResponse>;

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  { message: S.optional(S.String) },
) {}
export class IllegalStatusException extends S.TaggedError<IllegalStatusException>()(
  "IllegalStatusException",
  { message: S.optional(S.String) },
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class OperationDisabledException extends S.TaggedError<OperationDisabledException>()(
  "OperationDisabledException",
  { message: S.optional(S.String) },
) {}
export class ManagedRuleException extends S.TaggedError<ManagedRuleException>()(
  "ManagedRuleException",
  { message: S.optional(S.String) },
) {}
export class InvalidEventPatternException extends S.TaggedError<InvalidEventPatternException>()(
  "InvalidEventPatternException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class PolicyLengthExceededException extends S.TaggedError<PolicyLengthExceededException>()(
  "PolicyLengthExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves a list of API destination in the account in the current Region.
 */
export const listApiDestinations: (
  input: ListApiDestinationsRequest,
) => effect.Effect<
  ListApiDestinationsResponse,
  InternalException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApiDestinationsRequest,
  output: ListApiDestinationsResponse,
  errors: [InternalException],
}));
/**
 * Retrieves a list of connections from the account.
 */
export const listConnections: (
  input: ListConnectionsRequest,
) => effect.Effect<
  ListConnectionsResponse,
  InternalException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConnectionsRequest,
  output: ListConnectionsResponse,
  errors: [InternalException],
}));
/**
 * Lists all the event buses in your account, including the default event bus, custom event
 * buses, and partner event buses.
 */
export const listEventBuses: (
  input: ListEventBusesRequest,
) => effect.Effect<
  ListEventBusesResponse,
  InternalException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEventBusesRequest,
  output: ListEventBusesResponse,
  errors: [InternalException],
}));
/**
 * Lists your replays. You can either list all the replays or you can provide a prefix to
 * match to the replay names. Filter parameters are exclusive.
 */
export const listReplays: (
  input: ListReplaysRequest,
) => effect.Effect<
  ListReplaysResponse,
  InternalException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReplaysRequest,
  output: ListReplaysResponse,
  errors: [InternalException],
}));
/**
 * Deletes the specified custom event bus or partner event bus. All rules associated with
 * this event bus need to be deleted. You can't delete your account's default event bus.
 */
export const deleteEventBus: (
  input: DeleteEventBusRequest,
) => effect.Effect<
  DeleteEventBusResponse,
  ConcurrentModificationException | InternalException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventBusRequest,
  output: DeleteEventBusResponse,
  errors: [ConcurrentModificationException, InternalException],
}));
/**
 * Cancels the specified replay.
 */
export const cancelReplay: (
  input: CancelReplayRequest,
) => effect.Effect<
  CancelReplayResponse,
  | ConcurrentModificationException
  | IllegalStatusException
  | InternalException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelReplayRequest,
  output: CancelReplayResponse,
  errors: [
    ConcurrentModificationException,
    IllegalStatusException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * You can use this to see all the partner event sources that have been shared with your Amazon Web Services
 * account. For more information about partner event sources, see CreateEventBus.
 */
export const listEventSources: (
  input: ListEventSourcesRequest,
) => effect.Effect<
  ListEventSourcesResponse,
  InternalException | OperationDisabledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEventSourcesRequest,
  output: ListEventSourcesResponse,
  errors: [InternalException, OperationDisabledException],
}));
/**
 * Sends custom events to Amazon EventBridge so that they can be matched to rules.
 */
export const putEvents: (
  input: PutEventsRequest,
) => effect.Effect<
  PutEventsResponse,
  InternalException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEventsRequest,
  output: PutEventsResponse,
  errors: [InternalException],
}));
/**
 * This is used by SaaS partners to write events to a customer's partner event bus. Amazon Web Services
 * customers do not use this operation.
 */
export const putPartnerEvents: (
  input: PutPartnerEventsRequest,
) => effect.Effect<
  PutPartnerEventsResponse,
  InternalException | OperationDisabledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPartnerEventsRequest,
  output: PutPartnerEventsResponse,
  errors: [InternalException, OperationDisabledException],
}));
/**
 * Removes the specified targets from the specified rule. When the rule is triggered, those
 * targets are no longer be invoked.
 *
 * When you remove a target, when the associated rule triggers, removed targets might
 * continue to be invoked. Allow a short period of time for changes to take effect.
 *
 * This action can partially fail if too many requests are made at the same time. If that
 * happens, `FailedEntryCount` is non-zero in the response and each entry in
 * `FailedEntries` provides the ID of the failed target and the error code.
 */
export const removeTargets: (
  input: RemoveTargetsRequest,
) => effect.Effect<
  RemoveTargetsResponse,
  | ConcurrentModificationException
  | InternalException
  | ManagedRuleException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTargetsRequest,
  output: RemoveTargetsResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves details about an archive.
 */
export const describeArchive: (
  input: DescribeArchiveRequest,
) => effect.Effect<
  DescribeArchiveResponse,
  | InternalException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeArchiveRequest,
  output: DescribeArchiveResponse,
  errors: [
    InternalException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a new event bus within your account. This can be a custom event bus which you can
 * use to receive events from your custom applications and services, or it can be a partner event
 * bus which can be matched to a partner event source.
 */
export const createEventBus: (
  input: CreateEventBusRequest,
) => effect.Effect<
  CreateEventBusResponse,
  | ConcurrentModificationException
  | InternalException
  | InvalidStateException
  | LimitExceededException
  | OperationDisabledException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventBusRequest,
  output: CreateEventBusResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    InvalidStateException,
    LimitExceededException,
    OperationDisabledException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * You can use this operation to temporarily stop receiving events from the specified partner
 * event source. The matching event bus is not deleted.
 *
 * When you deactivate a partner event source, the source goes into PENDING state. If it
 * remains in PENDING state for more than two weeks, it is deleted.
 *
 * To activate a deactivated partner event source, use ActivateEventSource.
 */
export const deactivateEventSource: (
  input: DeactivateEventSourceRequest,
) => effect.Effect<
  DeactivateEventSourceResponse,
  | ConcurrentModificationException
  | InternalException
  | InvalidStateException
  | OperationDisabledException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeactivateEventSourceRequest,
  output: DeactivateEventSourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    InvalidStateException,
    OperationDisabledException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists your archives. You can either list all the archives or you can provide a prefix to
 * match to the archive names. Filter parameters are exclusive.
 */
export const listArchives: (
  input: ListArchivesRequest,
) => effect.Effect<
  ListArchivesResponse,
  InternalException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListArchivesRequest,
  output: ListArchivesResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Lists your Amazon EventBridge rules. You can either list all the rules or you can provide
 * a prefix to match to the rule names.
 *
 * ListRules does not list the targets of a rule. To see the targets associated with a rule,
 * use ListTargetsByRule.
 */
export const listRules: (
  input: ListRulesRequest,
) => effect.Effect<
  ListRulesResponse,
  InternalException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRulesRequest,
  output: ListRulesResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Removes all authorization parameters from the connection. This lets you remove the secret
 * from the connection so you can reuse it without having to create a new connection.
 */
export const deauthorizeConnection: (
  input: DeauthorizeConnectionRequest,
) => effect.Effect<
  DeauthorizeConnectionResponse,
  | ConcurrentModificationException
  | InternalException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeauthorizeConnectionRequest,
  output: DeauthorizeConnectionResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a connection.
 */
export const deleteConnection: (
  input: DeleteConnectionRequest,
) => effect.Effect<
  DeleteConnectionResponse,
  | ConcurrentModificationException
  | InternalException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: DeleteConnectionResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves details about an API destination.
 */
export const describeApiDestination: (
  input: DescribeApiDestinationRequest,
) => effect.Effect<
  DescribeApiDestinationResponse,
  InternalException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApiDestinationRequest,
  output: DescribeApiDestinationResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Displays details about an event bus in your account. This can include the external Amazon Web Services
 * accounts that are permitted to write events to your default event bus, and the associated
 * policy. For custom event buses and partner event buses, it displays the name, ARN, policy,
 * state, and creation time.
 *
 * To enable your account to receive events from other accounts on its default event bus,
 * use PutPermission.
 *
 * For more information about partner event buses, see CreateEventBus.
 */
export const describeEventBus: (
  input: DescribeEventBusRequest,
) => effect.Effect<
  DescribeEventBusResponse,
  InternalException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventBusRequest,
  output: DescribeEventBusResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Retrieves details about a replay. Use `DescribeReplay` to determine the
 * progress of a running replay. A replay processes events to replay based on the time in the
 * event, and replays them using 1 minute intervals. If you use `StartReplay` and
 * specify an `EventStartTime` and an `EventEndTime` that covers a 20
 * minute time range, the events are replayed from the first minute of that 20 minute range
 * first. Then the events from the second minute are replayed. You can use
 * `DescribeReplay` to determine the progress of a replay. The value returned for
 * `EventLastReplayedTime` indicates the time within the specified time range
 * associated with the last event replayed.
 */
export const describeReplay: (
  input: DescribeReplayRequest,
) => effect.Effect<
  DescribeReplayResponse,
  InternalException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReplayRequest,
  output: DescribeReplayResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Describes the specified rule.
 *
 * DescribeRule does not list the targets of a rule. To see the targets associated with a
 * rule, use ListTargetsByRule.
 */
export const describeRule: (
  input: DescribeRuleRequest,
) => effect.Effect<
  DescribeRuleResponse,
  InternalException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRuleRequest,
  output: DescribeRuleResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Lists the rules for the specified target. You can see which of the rules in Amazon
 * EventBridge can invoke a specific target in your account.
 */
export const listRuleNamesByTarget: (
  input: ListRuleNamesByTargetRequest,
) => effect.Effect<
  ListRuleNamesByTargetResponse,
  InternalException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRuleNamesByTargetRequest,
  output: ListRuleNamesByTargetResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Displays the tags associated with an EventBridge resource. In EventBridge, rules and event
 * buses can be tagged.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  InternalException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Lists the targets assigned to the specified rule.
 */
export const listTargetsByRule: (
  input: ListTargetsByRuleRequest,
) => effect.Effect<
  ListTargetsByRuleResponse,
  InternalException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTargetsByRuleRequest,
  output: ListTargetsByRuleResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Deletes the specified API destination.
 */
export const deleteApiDestination: (
  input: DeleteApiDestinationRequest,
) => effect.Effect<
  DeleteApiDestinationResponse,
  | ConcurrentModificationException
  | InternalException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApiDestinationRequest,
  output: DeleteApiDestinationResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified archive.
 */
export const deleteArchive: (
  input: DeleteArchiveRequest,
) => effect.Effect<
  DeleteArchiveResponse,
  | ConcurrentModificationException
  | InternalException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteArchiveRequest,
  output: DeleteArchiveResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * An SaaS partner can use this operation to display the Amazon Web Services account ID that a particular
 * partner event source name is associated with. This operation is not used by Amazon Web Services
 * customers.
 */
export const listPartnerEventSourceAccounts: (
  input: ListPartnerEventSourceAccountsRequest,
) => effect.Effect<
  ListPartnerEventSourceAccountsResponse,
  | InternalException
  | OperationDisabledException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPartnerEventSourceAccountsRequest,
  output: ListPartnerEventSourceAccountsResponse,
  errors: [
    InternalException,
    OperationDisabledException,
    ResourceNotFoundException,
  ],
}));
/**
 * An SaaS partner can use this operation to list all the partner event source names that
 * they have created. This operation is not used by Amazon Web Services customers.
 */
export const listPartnerEventSources: (
  input: ListPartnerEventSourcesRequest,
) => effect.Effect<
  ListPartnerEventSourcesResponse,
  InternalException | OperationDisabledException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPartnerEventSourcesRequest,
  output: ListPartnerEventSourcesResponse,
  errors: [InternalException, OperationDisabledException],
}));
/**
 * This operation lists details about a partner event source that is shared with your
 * account.
 */
export const describeEventSource: (
  input: DescribeEventSourceRequest,
) => effect.Effect<
  DescribeEventSourceResponse,
  | InternalException
  | OperationDisabledException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventSourceRequest,
  output: DescribeEventSourceResponse,
  errors: [
    InternalException,
    OperationDisabledException,
    ResourceNotFoundException,
  ],
}));
/**
 * An SaaS partner can use this operation to list details about a partner event source that
 * they have created. Amazon Web Services customers do not use this operation. Instead, Amazon Web Services customers can use DescribeEventSource
 * to see details about a partner event source that is
 * shared with them.
 */
export const describePartnerEventSource: (
  input: DescribePartnerEventSourceRequest,
) => effect.Effect<
  DescribePartnerEventSourceResponse,
  | InternalException
  | OperationDisabledException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePartnerEventSourceRequest,
  output: DescribePartnerEventSourceResponse,
  errors: [
    InternalException,
    OperationDisabledException,
    ResourceNotFoundException,
  ],
}));
/**
 * This operation is used by SaaS partners to delete a partner event source. This operation
 * is not used by Amazon Web Services customers.
 *
 * When you delete an event source, the status of the corresponding partner event bus in the
 * Amazon Web Services customer account becomes DELETED.
 */
export const deletePartnerEventSource: (
  input: DeletePartnerEventSourceRequest,
) => effect.Effect<
  DeletePartnerEventSourceResponse,
  | ConcurrentModificationException
  | InternalException
  | OperationDisabledException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePartnerEventSourceRequest,
  output: DeletePartnerEventSourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    OperationDisabledException,
  ],
}));
/**
 * Revokes the permission of another Amazon Web Services account to be able to put events to the specified
 * event bus. Specify the account to revoke by the `StatementId` value that you
 * associated with the account when you granted it permission with `PutPermission`.
 * You can find the `StatementId` by using DescribeEventBus.
 */
export const removePermission: (
  input: RemovePermissionRequest,
) => effect.Effect<
  RemovePermissionResponse,
  | ConcurrentModificationException
  | InternalException
  | OperationDisabledException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemovePermissionRequest,
  output: RemovePermissionResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    OperationDisabledException,
    ResourceNotFoundException,
  ],
}));
/**
 * Activates a partner event source that has been deactivated. Once activated, your matching
 * event bus will start receiving events from the event source.
 */
export const activateEventSource: (
  input: ActivateEventSourceRequest,
) => effect.Effect<
  ActivateEventSourceResponse,
  | ConcurrentModificationException
  | InternalException
  | InvalidStateException
  | OperationDisabledException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivateEventSourceRequest,
  output: ActivateEventSourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    InvalidStateException,
    OperationDisabledException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified rule.
 *
 * Before you can delete the rule, you must remove all targets, using RemoveTargets.
 *
 * When you delete a rule, incoming events might continue to match to the deleted rule. Allow
 * a short period of time for changes to take effect.
 *
 * If you call delete rule multiple times for the same rule, all calls will succeed. When you
 * call delete rule for a non-existent custom eventbus, `ResourceNotFoundException` is
 * returned.
 *
 * Managed rules are rules created and managed by another Amazon Web Services service on your behalf. These
 * rules are created by those other Amazon Web Services services to support functionality in those services. You
 * can delete these rules using the `Force` option, but you should do so only if you
 * are sure the other service is not still using that rule.
 */
export const deleteRule: (
  input: DeleteRuleRequest,
) => effect.Effect<
  DeleteRuleResponse,
  | ConcurrentModificationException
  | InternalException
  | ManagedRuleException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disables the specified rule. A disabled rule won't match any events, and won't
 * self-trigger if it has a schedule expression.
 *
 * When you disable a rule, incoming events might continue to match to the disabled rule.
 * Allow a short period of time for changes to take effect.
 */
export const disableRule: (
  input: DisableRuleRequest,
) => effect.Effect<
  DisableRuleResponse,
  | ConcurrentModificationException
  | InternalException
  | ManagedRuleException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableRuleRequest,
  output: DisableRuleResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Enables the specified rule. If the rule does not exist, the operation fails.
 *
 * When you enable a rule, incoming events might not immediately start matching to a newly
 * enabled rule. Allow a short period of time for changes to take effect.
 */
export const enableRule: (
  input: EnableRuleRequest,
) => effect.Effect<
  EnableRuleResponse,
  | ConcurrentModificationException
  | InternalException
  | ManagedRuleException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableRuleRequest,
  output: EnableRuleResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified EventBridge resource. Tags can
 * help you organize and categorize your resources. You can also use them to scope user
 * permissions by granting a user permission to access or change only resources with certain tag
 * values. In EventBridge, rules and event buses can be tagged.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of
 * characters.
 *
 * You can use the `TagResource` action with a resource that already has tags. If
 * you specify a new tag key, this tag is appended to the list of tags associated with the
 * resource. If you specify a tag key that is already associated with the resource, the new tag
 * value that you specify replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | ConcurrentModificationException
  | InternalException
  | ManagedRuleException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes one or more tags from the specified EventBridge resource. In Amazon EventBridge
 * (CloudWatch Events), rules and event buses can be tagged.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | ConcurrentModificationException
  | InternalException
  | ManagedRuleException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an archive of events with the specified settings. When you create an archive,
 * incoming events might not immediately start being sent to the archive. Allow a short period of
 * time for changes to take effect. If you do not specify a pattern to filter events sent to the
 * archive, all events are sent to the archive except replayed events. Replayed events are not
 * sent to an archive.
 */
export const createArchive: (
  input: CreateArchiveRequest,
) => effect.Effect<
  CreateArchiveResponse,
  | ConcurrentModificationException
  | InternalException
  | InvalidEventPatternException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateArchiveRequest,
  output: CreateArchiveResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    InvalidEventPatternException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates or updates the specified rule. Rules are enabled by default, or based on value of
 * the state. You can disable a rule using DisableRule.
 *
 * A single rule watches for events from a single event bus. Events generated by Amazon Web Services services
 * go to your account's default event bus. Events generated by SaaS partner services or
 * applications go to the matching partner event bus. If you have custom applications or
 * services, you can specify whether their events go to your default event bus or a custom event
 * bus that you have created. For more information, see CreateEventBus.
 *
 * If you are updating an existing rule, the rule is replaced with what you specify in this
 * `PutRule` command. If you omit arguments in `PutRule`, the old values
 * for those arguments are not kept. Instead, they are replaced with null values.
 *
 * When you create or update a rule, incoming events might not immediately start matching to
 * new or updated rules. Allow a short period of time for changes to take effect.
 *
 * A rule must contain at least an EventPattern or ScheduleExpression. Rules with
 * EventPatterns are triggered when a matching event is observed. Rules with ScheduleExpressions
 * self-trigger based on the given schedule. A rule can have both an EventPattern and a
 * ScheduleExpression, in which case the rule triggers on matching events as well as on a
 * schedule.
 *
 * When you initially create a rule, you can optionally assign one or more tags to the rule.
 * Tags can help you organize and categorize your resources. You can also use them to scope user
 * permissions, by granting a user permission to access or change only rules with certain tag
 * values. To use the `PutRule` operation and assign tags, you must have both the
 * `events:PutRule` and `events:TagResource` permissions.
 *
 * If you are updating an existing rule, any tags you specify in the `PutRule`
 * operation are ignored. To update the tags of an existing rule, use TagResource and UntagResource.
 *
 * Most services in Amazon Web Services treat : or / as the same character in Amazon Resource Names (ARNs).
 * However, EventBridge uses an exact match in event patterns and rules. Be sure to use the
 * correct ARN characters when creating event patterns so that they match the ARN syntax in the
 * event you want to match.
 *
 * In EventBridge, it is possible to create rules that lead to infinite loops, where a rule
 * is fired repeatedly. For example, a rule might detect that ACLs have changed on an S3 bucket,
 * and trigger software to change them to the desired state. If the rule is not written
 * carefully, the subsequent change to the ACLs fires the rule again, creating an infinite
 * loop.
 *
 * To prevent this, write the rules so that the triggered actions do not re-fire the same
 * rule. For example, your rule could fire only if ACLs are found to be in a bad state, instead
 * of after any change.
 *
 * An infinite loop can quickly cause higher than expected charges. We recommend that you use
 * budgeting, which alerts you when charges exceed your specified limit. For more information,
 * see Managing Your Costs with
 * Budgets.
 */
export const putRule: (
  input: PutRuleRequest,
) => effect.Effect<
  PutRuleResponse,
  | ConcurrentModificationException
  | InternalException
  | InvalidEventPatternException
  | LimitExceededException
  | ManagedRuleException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRuleRequest,
  output: PutRuleResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    InvalidEventPatternException,
    LimitExceededException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Tests whether the specified event pattern matches the provided event.
 *
 * Most services in Amazon Web Services treat : or / as the same character in Amazon Resource Names (ARNs).
 * However, EventBridge uses an exact match in event patterns and rules. Be sure to use the
 * correct ARN characters when creating event patterns so that they match the ARN syntax in the
 * event you want to match.
 */
export const testEventPattern: (
  input: TestEventPatternRequest,
) => effect.Effect<
  TestEventPatternResponse,
  InternalException | InvalidEventPatternException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestEventPatternRequest,
  output: TestEventPatternResponse,
  errors: [InternalException, InvalidEventPatternException],
}));
/**
 * Updates the specified archive.
 */
export const updateArchive: (
  input: UpdateArchiveRequest,
) => effect.Effect<
  UpdateArchiveResponse,
  | ConcurrentModificationException
  | InternalException
  | InvalidEventPatternException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateArchiveRequest,
  output: UpdateArchiveResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    InvalidEventPatternException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Called by an SaaS partner to create a partner event source. This operation is not used by
 * Amazon Web Services customers.
 *
 * Each partner event source can be used by one Amazon Web Services account to create a matching partner
 * event bus in that Amazon Web Services account. A SaaS partner must create one partner event source for each
 * Amazon Web Services account that wants to receive those event types.
 *
 * A partner event source creates events based on resources within the SaaS partner's service
 * or application.
 *
 * An Amazon Web Services account that creates a partner event bus that matches the partner event source can
 * use that event bus to receive events from the partner, and then process them using Amazon Web Services Events
 * rules and targets.
 *
 * Partner event source names follow this format:
 *
 * *partner_name*\/*event_namespace*\/*event_name*
 *
 * *partner_name* is determined during partner registration and identifies
 * the partner to Amazon Web Services customers. *event_namespace* is determined by the
 * partner and is a way for the partner to categorize their events.
 * *event_name* is determined by the partner, and should uniquely identify
 * an event-generating resource within the partner system. The combination of
 * *event_namespace* and *event_name* should help Amazon Web Services
 * customers decide whether to create an event bus to receive these events.
 */
export const createPartnerEventSource: (
  input: CreatePartnerEventSourceRequest,
) => effect.Effect<
  CreatePartnerEventSourceResponse,
  | ConcurrentModificationException
  | InternalException
  | LimitExceededException
  | OperationDisabledException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePartnerEventSourceRequest,
  output: CreatePartnerEventSourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    LimitExceededException,
    OperationDisabledException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Updates an API destination.
 */
export const updateApiDestination: (
  input: UpdateApiDestinationRequest,
) => effect.Effect<
  UpdateApiDestinationResponse,
  | ConcurrentModificationException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApiDestinationRequest,
  output: UpdateApiDestinationResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Starts the specified replay. Events are not necessarily replayed in the exact same order
 * that they were added to the archive. A replay processes events to replay based on the time in
 * the event, and replays them using 1 minute intervals. If you specify an
 * `EventStartTime` and an `EventEndTime` that covers a 20 minute time
 * range, the events are replayed from the first minute of that 20 minute range first. Then the
 * events from the second minute are replayed. You can use `DescribeReplay` to
 * determine the progress of a replay. The value returned for `EventLastReplayedTime`
 * indicates the time within the specified time range associated with the last event
 * replayed.
 */
export const startReplay: (
  input: StartReplayRequest,
) => effect.Effect<
  StartReplayResponse,
  | InternalException
  | InvalidEventPatternException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartReplayRequest,
  output: StartReplayResponse,
  errors: [
    InternalException,
    InvalidEventPatternException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an API destination, which is an HTTP invocation endpoint configured as a target
 * for events.
 */
export const createApiDestination: (
  input: CreateApiDestinationRequest,
) => effect.Effect<
  CreateApiDestinationResponse,
  | InternalException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApiDestinationRequest,
  output: CreateApiDestinationResponse,
  errors: [
    InternalException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a connection. A connection defines the authorization type and credentials to use
 * for authorization with an API destination HTTP endpoint.
 */
export const createConnection: (
  input: CreateConnectionRequest,
) => effect.Effect<
  CreateConnectionResponse,
  | InternalException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectionRequest,
  output: CreateConnectionResponse,
  errors: [
    InternalException,
    LimitExceededException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Retrieves details about a connection.
 */
export const describeConnection: (
  input: DescribeConnectionRequest,
) => effect.Effect<
  DescribeConnectionResponse,
  InternalException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectionRequest,
  output: DescribeConnectionResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Updates settings for a connection.
 */
export const updateConnection: (
  input: UpdateConnectionRequest,
) => effect.Effect<
  UpdateConnectionResponse,
  | ConcurrentModificationException
  | InternalException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectionRequest,
  output: UpdateConnectionResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Running `PutPermission` permits the specified Amazon Web Services account or Amazon Web Services organization
 * to put events to the specified *event bus*. Amazon EventBridge (CloudWatch
 * Events) rules in your account are triggered by these events arriving to an event bus in your
 * account.
 *
 * For another account to send events to your account, that external account must have an
 * EventBridge rule with your account's event bus as a target.
 *
 * To enable multiple Amazon Web Services accounts to put events to your event bus, run
 * `PutPermission` once for each of these accounts. Or, if all the accounts are
 * members of the same Amazon Web Services organization, you can run `PutPermission` once specifying
 * `Principal` as "*" and specifying the Amazon Web Services organization ID in
 * `Condition`, to grant permissions to all accounts in that organization.
 *
 * If you grant permissions using an organization, then accounts in that organization must
 * specify a `RoleArn` with proper permissions when they use `PutTarget` to
 * add your account's event bus as a target. For more information, see Sending and
 * Receiving Events Between Amazon Web Services Accounts in the Amazon EventBridge User
 * Guide.
 *
 * The permission policy on the event bus cannot exceed 10 KB in size.
 */
export const putPermission: (
  input: PutPermissionRequest,
) => effect.Effect<
  PutPermissionResponse,
  | ConcurrentModificationException
  | InternalException
  | OperationDisabledException
  | PolicyLengthExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPermissionRequest,
  output: PutPermissionResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    OperationDisabledException,
    PolicyLengthExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds the specified targets to the specified rule, or updates the targets if they are
 * already associated with the rule.
 *
 * Targets are the resources that are invoked when a rule is triggered.
 *
 * You can configure the following as targets for Events:
 *
 * - API
 * destination
 *
 * - Amazon API Gateway REST API endpoints
 *
 * - API Gateway
 *
 * - Batch job queue
 *
 * - CloudWatch Logs group
 *
 * - CodeBuild project
 *
 * - CodePipeline
 *
 * - Amazon EC2 `CreateSnapshot` API call
 *
 * - Amazon EC2 `RebootInstances` API call
 *
 * - Amazon EC2 `StopInstances` API call
 *
 * - Amazon EC2 `TerminateInstances` API call
 *
 * - Amazon ECS tasks
 *
 * - Event bus in a different Amazon Web Services account or Region.
 *
 * You can use an event bus in the US East (N. Virginia) us-east-1, US West (Oregon)
 * us-west-2, or Europe (Ireland) eu-west-1 Regions as a target for a rule.
 *
 * - Firehose delivery stream (Firehose)
 *
 * - Inspector assessment template (Amazon Inspector)
 *
 * - Kinesis stream (Kinesis Data Stream)
 *
 * - Lambda function
 *
 * - Redshift clusters (Data API statement execution)
 *
 * - Amazon SNS topic
 *
 * - Amazon SQS queues (includes FIFO queues
 *
 * - SSM Automation
 *
 * - SSM OpsItem
 *
 * - SSM Run Command
 *
 * - Step Functions state machines
 *
 * Creating rules with built-in targets is supported only in the Amazon Web Services Management Console. The
 * built-in targets are `EC2 CreateSnapshot API call`, EC2 RebootInstances API
 * call, `EC2 StopInstances API call`, and EC2 TerminateInstances API
 * call.
 *
 * For some target types, `PutTargets` provides target-specific parameters. If the
 * target is a Kinesis data stream, you can optionally specify which shard the event goes to by
 * using the `KinesisParameters` argument. To invoke a command on multiple EC2
 * instances with one rule, you can use the `RunCommandParameters` field.
 *
 * To be able to make API calls against the resources that you own, Amazon EventBridge
 * needs the appropriate permissions. For Lambda and Amazon SNS
 * resources, EventBridge relies on resource-based policies. For EC2 instances, Kinesis Data Streams,
 * Step Functions state machines and API Gateway REST APIs, EventBridge relies on
 * IAM roles that you specify in the `RoleARN` argument in `PutTargets`.
 * For more information, see Authentication
 * and Access Control in the *Amazon EventBridge User Guide*.
 *
 * If another Amazon Web Services account is in the same region and has granted you permission (using
 * `PutPermission`), you can send events to that account. Set that account's event
 * bus as a target of the rules in your account. To send the matched events to the other account,
 * specify that account's event bus as the `Arn` value when you run
 * `PutTargets`. If your account sends events to another account, your account is
 * charged for each sent event. Each event sent to another account is charged as a custom event.
 * The account receiving the event is not charged. For more information, see Amazon EventBridge
 * Pricing.
 *
 * `Input`, `InputPath`, and `InputTransformer` are not
 * available with `PutTarget` if the target is an event bus of a different Amazon Web Services
 * account.
 *
 * If you are setting the event bus of another account as the target, and that account
 * granted permission to your account through an organization instead of directly by the account
 * ID, then you must specify a `RoleArn` with proper permissions in the
 * `Target` structure. For more information, see Sending and
 * Receiving Events Between Amazon Web Services Accounts in the Amazon EventBridge User
 * Guide.
 *
 * For more information about enabling cross-account events, see PutPermission.
 *
 * **Input**, **InputPath**, and
 * **InputTransformer** are mutually exclusive and optional
 * parameters of a target. When a rule is triggered due to a matched event:
 *
 * - If none of the following arguments are specified for a target, then the entire event
 * is passed to the target in JSON format (unless the target is Amazon EC2 Run Command or
 * Amazon ECS task, in which case nothing from the event is passed to the target).
 *
 * - If **Input** is specified in the form of valid JSON, then
 * the matched event is overridden with this constant.
 *
 * - If **InputPath** is specified in the form of JSONPath
 * (for example, `$.detail`), then only the part of the event specified in the
 * path is passed to the target (for example, only the detail part of the event is
 * passed).
 *
 * - If **InputTransformer** is specified, then one or more
 * specified JSONPaths are extracted from the event and used as values in a template that you
 * specify as the input to the target.
 *
 * When you specify `InputPath` or `InputTransformer`, you must use
 * JSON dot notation, not bracket notation.
 *
 * When you add targets to a rule and the associated rule triggers soon after, new or updated
 * targets might not be immediately invoked. Allow a short period of time for changes to take
 * effect.
 *
 * This action can partially fail if too many requests are made at the same time. If that
 * happens, `FailedEntryCount` is non-zero in the response and each entry in
 * `FailedEntries` provides the ID of the failed target and the error code.
 */
export const putTargets: (
  input: PutTargetsRequest,
) => effect.Effect<
  PutTargetsResponse,
  | ConcurrentModificationException
  | InternalException
  | LimitExceededException
  | ManagedRuleException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTargetsRequest,
  output: PutTargetsResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    LimitExceededException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));

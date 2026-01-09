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
const svc = T.AwsApiService({
  sdkId: "Route53 Recovery Control Config",
  serviceShapeName: "Route53RecoveryControlConfig",
});
const auth = T.AwsAuthSigv4({ name: "route53-recovery-control-config" });
const ver = T.ServiceVersion("2020-11-02");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "us-west-2" }],
  });
  const _p1 = (_0: unknown) => ({
    authSchemes: [
      {
        name: "sigv4",
        signingRegion: `${_.getAttr(_0, "implicitGlobalRegion")}`,
      },
    ],
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://route53-recovery-control-config.us-west-2.amazonaws.com",
            _p0(),
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            "https://arc-recovery-control-config.us-west-2.api.aws",
            _p0(),
            {},
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://route53-recovery-control-config-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p1(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://route53-recovery-control-config-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
              _p1(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://route53-recovery-control-config.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p1(PartitionResult),
              {},
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://route53-recovery-control-config.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          _p1(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type __stringMin1Max64PatternS = string;
export type __stringMin1Max256PatternAZaZ09 = string;
export type MaxResults = number;
export type __stringMin0Max256PatternS = string;
export type __policy = string;
export type __stringMax36PatternS = string;
export type __stringMin1Max8096PatternS = string;
export type __stringMin12Max12PatternD12 = string;
export type __stringMin1Max128PatternAZaZ09 = string;
export type __stringMin1Max32PatternS = string;

//# Schemas
export type NetworkType = "IPV4" | "DUALSTACK" | (string & {});
export const NetworkType = S.String;
export type __listOf__string = string[];
export const __listOf__string = S.Array(S.String);
export type __mapOf__stringMin0Max256PatternS = {
  [key: string]: string | undefined;
};
export const __mapOf__stringMin0Max256PatternS = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateControlPanelRequest {
  ClientToken?: string;
  ClusterArn?: string;
  ControlPanelName?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateControlPanelRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ClusterArn: S.optional(S.String),
    ControlPanelName: S.optional(S.String),
    Tags: S.optional(__mapOf__stringMin0Max256PatternS),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/controlpanel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateControlPanelRequest",
}) as any as S.Schema<CreateControlPanelRequest>;
export interface CreateRoutingControlRequest {
  ClientToken?: string;
  ClusterArn?: string;
  ControlPanelArn?: string;
  RoutingControlName?: string;
}
export const CreateRoutingControlRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ClusterArn: S.optional(S.String),
    ControlPanelArn: S.optional(S.String),
    RoutingControlName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/routingcontrol" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRoutingControlRequest",
}) as any as S.Schema<CreateRoutingControlRequest>;
export interface DeleteClusterRequest {
  ClusterArn: string;
}
export const DeleteClusterRequest = S.suspend(() =>
  S.Struct({ ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/cluster/{ClusterArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterRequest",
}) as any as S.Schema<DeleteClusterRequest>;
export interface DeleteClusterResponse {}
export const DeleteClusterResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteClusterResponse",
}) as any as S.Schema<DeleteClusterResponse>;
export interface DeleteControlPanelRequest {
  ControlPanelArn: string;
}
export const DeleteControlPanelRequest = S.suspend(() =>
  S.Struct({
    ControlPanelArn: S.String.pipe(T.HttpLabel("ControlPanelArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/controlpanel/{ControlPanelArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteControlPanelRequest",
}) as any as S.Schema<DeleteControlPanelRequest>;
export interface DeleteControlPanelResponse {}
export const DeleteControlPanelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteControlPanelResponse",
}) as any as S.Schema<DeleteControlPanelResponse>;
export interface DeleteRoutingControlRequest {
  RoutingControlArn: string;
}
export const DeleteRoutingControlRequest = S.suspend(() =>
  S.Struct({
    RoutingControlArn: S.String.pipe(T.HttpLabel("RoutingControlArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/routingcontrol/{RoutingControlArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRoutingControlRequest",
}) as any as S.Schema<DeleteRoutingControlRequest>;
export interface DeleteRoutingControlResponse {}
export const DeleteRoutingControlResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRoutingControlResponse",
}) as any as S.Schema<DeleteRoutingControlResponse>;
export interface DeleteSafetyRuleRequest {
  SafetyRuleArn: string;
}
export const DeleteSafetyRuleRequest = S.suspend(() =>
  S.Struct({ SafetyRuleArn: S.String.pipe(T.HttpLabel("SafetyRuleArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/safetyrule/{SafetyRuleArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSafetyRuleRequest",
}) as any as S.Schema<DeleteSafetyRuleRequest>;
export interface DeleteSafetyRuleResponse {}
export const DeleteSafetyRuleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSafetyRuleResponse",
}) as any as S.Schema<DeleteSafetyRuleResponse>;
export interface DescribeClusterRequest {
  ClusterArn: string;
}
export const DescribeClusterRequest = S.suspend(() =>
  S.Struct({ ClusterArn: S.String.pipe(T.HttpLabel("ClusterArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cluster/{ClusterArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeClusterRequest",
}) as any as S.Schema<DescribeClusterRequest>;
export interface DescribeControlPanelRequest {
  ControlPanelArn: string;
}
export const DescribeControlPanelRequest = S.suspend(() =>
  S.Struct({
    ControlPanelArn: S.String.pipe(T.HttpLabel("ControlPanelArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/controlpanel/{ControlPanelArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeControlPanelRequest",
}) as any as S.Schema<DescribeControlPanelRequest>;
export interface DescribeRoutingControlRequest {
  RoutingControlArn: string;
}
export const DescribeRoutingControlRequest = S.suspend(() =>
  S.Struct({
    RoutingControlArn: S.String.pipe(T.HttpLabel("RoutingControlArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/routingcontrol/{RoutingControlArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRoutingControlRequest",
}) as any as S.Schema<DescribeRoutingControlRequest>;
export interface DescribeSafetyRuleRequest {
  SafetyRuleArn: string;
}
export const DescribeSafetyRuleRequest = S.suspend(() =>
  S.Struct({ SafetyRuleArn: S.String.pipe(T.HttpLabel("SafetyRuleArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/safetyrule/{SafetyRuleArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSafetyRuleRequest",
}) as any as S.Schema<DescribeSafetyRuleRequest>;
export interface GetResourcePolicyRequest {
  ResourceArn: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/resourcePolicy/{ResourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface ListAssociatedRoute53HealthChecksRequest {
  MaxResults?: number;
  NextToken?: string;
  RoutingControlArn: string;
}
export const ListAssociatedRoute53HealthChecksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    RoutingControlArn: S.String.pipe(T.HttpLabel("RoutingControlArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/routingcontrol/{RoutingControlArn}/associatedRoute53HealthChecks",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAssociatedRoute53HealthChecksRequest",
}) as any as S.Schema<ListAssociatedRoute53HealthChecksRequest>;
export interface ListClustersRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListClustersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cluster" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClustersRequest",
}) as any as S.Schema<ListClustersRequest>;
export interface ListControlPanelsRequest {
  ClusterArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListControlPanelsRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String).pipe(T.HttpQuery("ClusterArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/controlpanels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListControlPanelsRequest",
}) as any as S.Schema<ListControlPanelsRequest>;
export interface ListRoutingControlsRequest {
  ControlPanelArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListRoutingControlsRequest = S.suspend(() =>
  S.Struct({
    ControlPanelArn: S.String.pipe(T.HttpLabel("ControlPanelArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/controlpanel/{ControlPanelArn}/routingcontrols",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRoutingControlsRequest",
}) as any as S.Schema<ListRoutingControlsRequest>;
export interface ListSafetyRulesRequest {
  ControlPanelArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSafetyRulesRequest = S.suspend(() =>
  S.Struct({
    ControlPanelArn: S.String.pipe(T.HttpLabel("ControlPanelArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/controlpanel/{ControlPanelArn}/safetyrules",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSafetyRulesRequest",
}) as any as S.Schema<ListSafetyRulesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
export interface TagResourceRequest {
  ResourceArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(__mapOf__stringMin0Max256PatternS),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys?: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: S.optional(__listOf__string).pipe(T.HttpQuery("TagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateClusterRequest {
  ClusterArn?: string;
  NetworkType?: NetworkType;
}
export const UpdateClusterRequest = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String),
    NetworkType: S.optional(NetworkType),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/cluster" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateClusterRequest",
}) as any as S.Schema<UpdateClusterRequest>;
export interface UpdateControlPanelRequest {
  ControlPanelArn?: string;
  ControlPanelName?: string;
}
export const UpdateControlPanelRequest = S.suspend(() =>
  S.Struct({
    ControlPanelArn: S.optional(S.String),
    ControlPanelName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/controlpanel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateControlPanelRequest",
}) as any as S.Schema<UpdateControlPanelRequest>;
export interface UpdateRoutingControlRequest {
  RoutingControlArn?: string;
  RoutingControlName?: string;
}
export const UpdateRoutingControlRequest = S.suspend(() =>
  S.Struct({
    RoutingControlArn: S.optional(S.String),
    RoutingControlName: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/routingcontrol" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRoutingControlRequest",
}) as any as S.Schema<UpdateRoutingControlRequest>;
export type __listOf__stringMin1Max256PatternAZaZ09 = string[];
export const __listOf__stringMin1Max256PatternAZaZ09 = S.Array(S.String);
export type RuleType = "ATLEAST" | "AND" | "OR" | (string & {});
export const RuleType = S.String;
export interface RuleConfig {
  Inverted?: boolean;
  Threshold?: number;
  Type?: RuleType;
}
export const RuleConfig = S.suspend(() =>
  S.Struct({
    Inverted: S.optional(S.Boolean),
    Threshold: S.optional(S.Number),
    Type: S.optional(RuleType),
  }),
).annotations({ identifier: "RuleConfig" }) as any as S.Schema<RuleConfig>;
export interface NewGatingRule {
  ControlPanelArn?: string;
  GatingControls?: string[];
  Name?: string;
  RuleConfig?: RuleConfig;
  TargetControls?: string[];
  WaitPeriodMs?: number;
}
export const NewGatingRule = S.suspend(() =>
  S.Struct({
    ControlPanelArn: S.optional(S.String),
    GatingControls: S.optional(__listOf__stringMin1Max256PatternAZaZ09),
    Name: S.optional(S.String),
    RuleConfig: S.optional(RuleConfig),
    TargetControls: S.optional(__listOf__stringMin1Max256PatternAZaZ09),
    WaitPeriodMs: S.optional(S.Number),
  }),
).annotations({
  identifier: "NewGatingRule",
}) as any as S.Schema<NewGatingRule>;
export type __listOf__stringMax36PatternS = string[];
export const __listOf__stringMax36PatternS = S.Array(S.String);
export interface ClusterEndpoint {
  Endpoint?: string;
  Region?: string;
}
export const ClusterEndpoint = S.suspend(() =>
  S.Struct({ Endpoint: S.optional(S.String), Region: S.optional(S.String) }),
).annotations({
  identifier: "ClusterEndpoint",
}) as any as S.Schema<ClusterEndpoint>;
export type __listOfClusterEndpoint = ClusterEndpoint[];
export const __listOfClusterEndpoint = S.Array(ClusterEndpoint);
export type Status =
  | "PENDING"
  | "DEPLOYED"
  | "PENDING_DELETION"
  | (string & {});
export const Status = S.String;
export interface Cluster {
  ClusterArn?: string;
  ClusterEndpoints?: ClusterEndpoint[];
  Name?: string;
  Status?: Status;
  Owner?: string;
  NetworkType?: NetworkType;
}
export const Cluster = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String),
    ClusterEndpoints: S.optional(__listOfClusterEndpoint),
    Name: S.optional(S.String),
    Status: S.optional(Status),
    Owner: S.optional(S.String),
    NetworkType: S.optional(NetworkType),
  }),
).annotations({ identifier: "Cluster" }) as any as S.Schema<Cluster>;
export type __listOfCluster = Cluster[];
export const __listOfCluster = S.Array(Cluster);
export interface ControlPanel {
  ClusterArn?: string;
  ControlPanelArn?: string;
  DefaultControlPanel?: boolean;
  Name?: string;
  RoutingControlCount?: number;
  Status?: Status;
  Owner?: string;
}
export const ControlPanel = S.suspend(() =>
  S.Struct({
    ClusterArn: S.optional(S.String),
    ControlPanelArn: S.optional(S.String),
    DefaultControlPanel: S.optional(S.Boolean),
    Name: S.optional(S.String),
    RoutingControlCount: S.optional(S.Number),
    Status: S.optional(Status),
    Owner: S.optional(S.String),
  }),
).annotations({ identifier: "ControlPanel" }) as any as S.Schema<ControlPanel>;
export type __listOfControlPanel = ControlPanel[];
export const __listOfControlPanel = S.Array(ControlPanel);
export interface RoutingControl {
  ControlPanelArn?: string;
  Name?: string;
  RoutingControlArn?: string;
  Status?: Status;
  Owner?: string;
}
export const RoutingControl = S.suspend(() =>
  S.Struct({
    ControlPanelArn: S.optional(S.String),
    Name: S.optional(S.String),
    RoutingControlArn: S.optional(S.String),
    Status: S.optional(Status),
    Owner: S.optional(S.String),
  }),
).annotations({
  identifier: "RoutingControl",
}) as any as S.Schema<RoutingControl>;
export type __listOfRoutingControl = RoutingControl[];
export const __listOfRoutingControl = S.Array(RoutingControl);
export interface AssertionRuleUpdate {
  Name?: string;
  SafetyRuleArn?: string;
  WaitPeriodMs?: number;
}
export const AssertionRuleUpdate = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    SafetyRuleArn: S.optional(S.String),
    WaitPeriodMs: S.optional(S.Number),
  }),
).annotations({
  identifier: "AssertionRuleUpdate",
}) as any as S.Schema<AssertionRuleUpdate>;
export interface GatingRuleUpdate {
  Name?: string;
  SafetyRuleArn?: string;
  WaitPeriodMs?: number;
}
export const GatingRuleUpdate = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    SafetyRuleArn: S.optional(S.String),
    WaitPeriodMs: S.optional(S.Number),
  }),
).annotations({
  identifier: "GatingRuleUpdate",
}) as any as S.Schema<GatingRuleUpdate>;
export interface CreateClusterRequest {
  ClientToken?: string;
  ClusterName?: string;
  Tags?: { [key: string]: string | undefined };
  NetworkType?: NetworkType;
}
export const CreateClusterRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ClusterName: S.optional(S.String),
    Tags: S.optional(__mapOf__stringMin0Max256PatternS),
    NetworkType: S.optional(NetworkType),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cluster" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateClusterRequest",
}) as any as S.Schema<CreateClusterRequest>;
export interface DescribeControlPanelResponse {
  ControlPanel?: ControlPanel;
}
export const DescribeControlPanelResponse = S.suspend(() =>
  S.Struct({ ControlPanel: S.optional(ControlPanel) }),
).annotations({
  identifier: "DescribeControlPanelResponse",
}) as any as S.Schema<DescribeControlPanelResponse>;
export interface DescribeRoutingControlResponse {
  RoutingControl?: RoutingControl;
}
export const DescribeRoutingControlResponse = S.suspend(() =>
  S.Struct({ RoutingControl: S.optional(RoutingControl) }),
).annotations({
  identifier: "DescribeRoutingControlResponse",
}) as any as S.Schema<DescribeRoutingControlResponse>;
export interface GetResourcePolicyResponse {
  Policy?: string;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({ Policy: S.optional(S.String) }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface ListAssociatedRoute53HealthChecksResponse {
  HealthCheckIds?: string[];
  NextToken?: string;
}
export const ListAssociatedRoute53HealthChecksResponse = S.suspend(() =>
  S.Struct({
    HealthCheckIds: S.optional(__listOf__stringMax36PatternS),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAssociatedRoute53HealthChecksResponse",
}) as any as S.Schema<ListAssociatedRoute53HealthChecksResponse>;
export interface ListClustersResponse {
  Clusters?: Cluster[];
  NextToken?: string;
}
export const ListClustersResponse = S.suspend(() =>
  S.Struct({
    Clusters: S.optional(__listOfCluster),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListClustersResponse",
}) as any as S.Schema<ListClustersResponse>;
export interface ListControlPanelsResponse {
  ControlPanels?: ControlPanel[];
  NextToken?: string;
}
export const ListControlPanelsResponse = S.suspend(() =>
  S.Struct({
    ControlPanels: S.optional(__listOfControlPanel),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListControlPanelsResponse",
}) as any as S.Schema<ListControlPanelsResponse>;
export interface ListRoutingControlsResponse {
  NextToken?: string;
  RoutingControls?: RoutingControl[];
}
export const ListRoutingControlsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    RoutingControls: S.optional(__listOfRoutingControl),
  }),
).annotations({
  identifier: "ListRoutingControlsResponse",
}) as any as S.Schema<ListRoutingControlsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(__mapOf__stringMin0Max256PatternS) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateClusterResponse {
  Cluster?: Cluster;
}
export const UpdateClusterResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }),
).annotations({
  identifier: "UpdateClusterResponse",
}) as any as S.Schema<UpdateClusterResponse>;
export interface UpdateControlPanelResponse {
  ControlPanel?: ControlPanel;
}
export const UpdateControlPanelResponse = S.suspend(() =>
  S.Struct({ ControlPanel: S.optional(ControlPanel) }),
).annotations({
  identifier: "UpdateControlPanelResponse",
}) as any as S.Schema<UpdateControlPanelResponse>;
export interface UpdateRoutingControlResponse {
  RoutingControl?: RoutingControl;
}
export const UpdateRoutingControlResponse = S.suspend(() =>
  S.Struct({ RoutingControl: S.optional(RoutingControl) }),
).annotations({
  identifier: "UpdateRoutingControlResponse",
}) as any as S.Schema<UpdateRoutingControlResponse>;
export interface UpdateSafetyRuleRequest {
  AssertionRuleUpdate?: AssertionRuleUpdate;
  GatingRuleUpdate?: GatingRuleUpdate;
}
export const UpdateSafetyRuleRequest = S.suspend(() =>
  S.Struct({
    AssertionRuleUpdate: S.optional(AssertionRuleUpdate),
    GatingRuleUpdate: S.optional(GatingRuleUpdate),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/safetyrule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSafetyRuleRequest",
}) as any as S.Schema<UpdateSafetyRuleRequest>;
export interface NewAssertionRule {
  AssertedControls?: string[];
  ControlPanelArn?: string;
  Name?: string;
  RuleConfig?: RuleConfig;
  WaitPeriodMs?: number;
}
export const NewAssertionRule = S.suspend(() =>
  S.Struct({
    AssertedControls: S.optional(__listOf__stringMin1Max256PatternAZaZ09),
    ControlPanelArn: S.optional(S.String),
    Name: S.optional(S.String),
    RuleConfig: S.optional(RuleConfig),
    WaitPeriodMs: S.optional(S.Number),
  }),
).annotations({
  identifier: "NewAssertionRule",
}) as any as S.Schema<NewAssertionRule>;
export interface AssertionRule {
  AssertedControls?: string[];
  ControlPanelArn?: string;
  Name?: string;
  RuleConfig?: RuleConfig;
  SafetyRuleArn?: string;
  Status?: Status;
  WaitPeriodMs?: number;
  Owner?: string;
}
export const AssertionRule = S.suspend(() =>
  S.Struct({
    AssertedControls: S.optional(__listOf__stringMin1Max256PatternAZaZ09),
    ControlPanelArn: S.optional(S.String),
    Name: S.optional(S.String),
    RuleConfig: S.optional(RuleConfig),
    SafetyRuleArn: S.optional(S.String),
    Status: S.optional(Status),
    WaitPeriodMs: S.optional(S.Number),
    Owner: S.optional(S.String),
  }),
).annotations({
  identifier: "AssertionRule",
}) as any as S.Schema<AssertionRule>;
export interface GatingRule {
  ControlPanelArn?: string;
  GatingControls?: string[];
  Name?: string;
  RuleConfig?: RuleConfig;
  SafetyRuleArn?: string;
  Status?: Status;
  TargetControls?: string[];
  WaitPeriodMs?: number;
  Owner?: string;
}
export const GatingRule = S.suspend(() =>
  S.Struct({
    ControlPanelArn: S.optional(S.String),
    GatingControls: S.optional(__listOf__stringMin1Max256PatternAZaZ09),
    Name: S.optional(S.String),
    RuleConfig: S.optional(RuleConfig),
    SafetyRuleArn: S.optional(S.String),
    Status: S.optional(Status),
    TargetControls: S.optional(__listOf__stringMin1Max256PatternAZaZ09),
    WaitPeriodMs: S.optional(S.Number),
    Owner: S.optional(S.String),
  }),
).annotations({ identifier: "GatingRule" }) as any as S.Schema<GatingRule>;
export interface Rule {
  ASSERTION?: AssertionRule;
  GATING?: GatingRule;
}
export const Rule = S.suspend(() =>
  S.Struct({
    ASSERTION: S.optional(AssertionRule),
    GATING: S.optional(GatingRule),
  }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export type __listOfRule = Rule[];
export const __listOfRule = S.Array(Rule);
export interface CreateClusterResponse {
  Cluster?: Cluster;
}
export const CreateClusterResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }),
).annotations({
  identifier: "CreateClusterResponse",
}) as any as S.Schema<CreateClusterResponse>;
export interface CreateControlPanelResponse {
  ControlPanel?: ControlPanel;
}
export const CreateControlPanelResponse = S.suspend(() =>
  S.Struct({ ControlPanel: S.optional(ControlPanel) }),
).annotations({
  identifier: "CreateControlPanelResponse",
}) as any as S.Schema<CreateControlPanelResponse>;
export interface CreateRoutingControlResponse {
  RoutingControl?: RoutingControl;
}
export const CreateRoutingControlResponse = S.suspend(() =>
  S.Struct({ RoutingControl: S.optional(RoutingControl) }),
).annotations({
  identifier: "CreateRoutingControlResponse",
}) as any as S.Schema<CreateRoutingControlResponse>;
export interface CreateSafetyRuleRequest {
  AssertionRule?: NewAssertionRule;
  ClientToken?: string;
  GatingRule?: NewGatingRule;
  Tags?: { [key: string]: string | undefined };
}
export const CreateSafetyRuleRequest = S.suspend(() =>
  S.Struct({
    AssertionRule: S.optional(NewAssertionRule),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    GatingRule: S.optional(NewGatingRule),
    Tags: S.optional(__mapOf__stringMin0Max256PatternS),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/safetyrule" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSafetyRuleRequest",
}) as any as S.Schema<CreateSafetyRuleRequest>;
export interface DescribeSafetyRuleResponse {
  AssertionRule?: AssertionRule & {
    AssertedControls: __listOf__stringMin1Max256PatternAZaZ09;
    ControlPanelArn: __stringMin1Max256PatternAZaZ09;
    Name: __stringMin1Max64PatternS;
    RuleConfig: RuleConfig & {
      Inverted: boolean;
      Threshold: number;
      Type: RuleType;
    };
    SafetyRuleArn: __stringMin1Max256PatternAZaZ09;
    Status: Status;
    WaitPeriodMs: number;
  };
  GatingRule?: GatingRule & {
    ControlPanelArn: __stringMin1Max256PatternAZaZ09;
    GatingControls: __listOf__stringMin1Max256PatternAZaZ09;
    Name: __stringMin1Max64PatternS;
    RuleConfig: RuleConfig & {
      Inverted: boolean;
      Threshold: number;
      Type: RuleType;
    };
    SafetyRuleArn: __stringMin1Max256PatternAZaZ09;
    Status: Status;
    TargetControls: __listOf__stringMin1Max256PatternAZaZ09;
    WaitPeriodMs: number;
  };
}
export const DescribeSafetyRuleResponse = S.suspend(() =>
  S.Struct({
    AssertionRule: S.optional(AssertionRule),
    GatingRule: S.optional(GatingRule),
  }),
).annotations({
  identifier: "DescribeSafetyRuleResponse",
}) as any as S.Schema<DescribeSafetyRuleResponse>;
export interface ListSafetyRulesResponse {
  NextToken?: string;
  SafetyRules?: (Rule & {
    ASSERTION: AssertionRule & {
      AssertedControls: __listOf__stringMin1Max256PatternAZaZ09;
      ControlPanelArn: __stringMin1Max256PatternAZaZ09;
      Name: __stringMin1Max64PatternS;
      RuleConfig: RuleConfig & {
        Inverted: boolean;
        Threshold: number;
        Type: RuleType;
      };
      SafetyRuleArn: __stringMin1Max256PatternAZaZ09;
      Status: Status;
      WaitPeriodMs: number;
    };
    GATING: GatingRule & {
      ControlPanelArn: __stringMin1Max256PatternAZaZ09;
      GatingControls: __listOf__stringMin1Max256PatternAZaZ09;
      Name: __stringMin1Max64PatternS;
      RuleConfig: RuleConfig & {
        Inverted: boolean;
        Threshold: number;
        Type: RuleType;
      };
      SafetyRuleArn: __stringMin1Max256PatternAZaZ09;
      Status: Status;
      TargetControls: __listOf__stringMin1Max256PatternAZaZ09;
      WaitPeriodMs: number;
    };
  })[];
}
export const ListSafetyRulesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    SafetyRules: S.optional(__listOfRule),
  }),
).annotations({
  identifier: "ListSafetyRulesResponse",
}) as any as S.Schema<ListSafetyRulesResponse>;
export interface UpdateSafetyRuleResponse {
  AssertionRule?: AssertionRule & {
    AssertedControls: __listOf__stringMin1Max256PatternAZaZ09;
    ControlPanelArn: __stringMin1Max256PatternAZaZ09;
    Name: __stringMin1Max64PatternS;
    RuleConfig: RuleConfig & {
      Inverted: boolean;
      Threshold: number;
      Type: RuleType;
    };
    SafetyRuleArn: __stringMin1Max256PatternAZaZ09;
    Status: Status;
    WaitPeriodMs: number;
  };
  GatingRule?: GatingRule & {
    ControlPanelArn: __stringMin1Max256PatternAZaZ09;
    GatingControls: __listOf__stringMin1Max256PatternAZaZ09;
    Name: __stringMin1Max64PatternS;
    RuleConfig: RuleConfig & {
      Inverted: boolean;
      Threshold: number;
      Type: RuleType;
    };
    SafetyRuleArn: __stringMin1Max256PatternAZaZ09;
    Status: Status;
    TargetControls: __listOf__stringMin1Max256PatternAZaZ09;
    WaitPeriodMs: number;
  };
}
export const UpdateSafetyRuleResponse = S.suspend(() =>
  S.Struct({
    AssertionRule: S.optional(AssertionRule),
    GatingRule: S.optional(GatingRule),
  }),
).annotations({
  identifier: "UpdateSafetyRuleResponse",
}) as any as S.Schema<UpdateSafetyRuleResponse>;
export interface CreateSafetyRuleResponse {
  AssertionRule?: AssertionRule & {
    AssertedControls: __listOf__stringMin1Max256PatternAZaZ09;
    ControlPanelArn: __stringMin1Max256PatternAZaZ09;
    Name: __stringMin1Max64PatternS;
    RuleConfig: RuleConfig & {
      Inverted: boolean;
      Threshold: number;
      Type: RuleType;
    };
    SafetyRuleArn: __stringMin1Max256PatternAZaZ09;
    Status: Status;
    WaitPeriodMs: number;
  };
  GatingRule?: GatingRule & {
    ControlPanelArn: __stringMin1Max256PatternAZaZ09;
    GatingControls: __listOf__stringMin1Max256PatternAZaZ09;
    Name: __stringMin1Max64PatternS;
    RuleConfig: RuleConfig & {
      Inverted: boolean;
      Threshold: number;
      Type: RuleType;
    };
    SafetyRuleArn: __stringMin1Max256PatternAZaZ09;
    Status: Status;
    TargetControls: __listOf__stringMin1Max256PatternAZaZ09;
    WaitPeriodMs: number;
  };
}
export const CreateSafetyRuleResponse = S.suspend(() =>
  S.Struct({
    AssertionRule: S.optional(AssertionRule),
    GatingRule: S.optional(GatingRule),
  }),
).annotations({
  identifier: "CreateSafetyRuleResponse",
}) as any as S.Schema<CreateSafetyRuleResponse>;
export interface DescribeClusterResponse {
  Cluster?: Cluster;
}
export const DescribeClusterResponse = S.suspend(() =>
  S.Struct({ Cluster: S.optional(Cluster) }),
).annotations({
  identifier: "DescribeClusterResponse",
}) as any as S.Schema<DescribeClusterResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Get information about the resource policy for a cluster.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => effect.Effect<
  GetResourcePolicyResponse,
  InternalServerException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Deletes a safety rule.
 * />
 */
export const deleteSafetyRule: (
  input: DeleteSafetyRuleRequest,
) => effect.Effect<
  DeleteSafetyRuleResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSafetyRuleRequest,
  output: DeleteSafetyRuleResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * List the safety rules (the assertion rules and gating rules) that you've defined for the routing controls in a control panel.
 */
export const listSafetyRules: {
  (
    input: ListSafetyRulesRequest,
  ): effect.Effect<
    ListSafetyRulesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSafetyRulesRequest,
  ) => stream.Stream<
    ListSafetyRulesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSafetyRulesRequest,
  ) => stream.Stream<
    Rule,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSafetyRulesRequest,
  output: ListSafetyRulesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SafetyRules",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Create a new cluster. A cluster is a set of redundant Regional endpoints against which you can run API calls to update or get the state of one or more routing controls. Each cluster has a name, status, Amazon Resource Name (ARN), and an array of the five cluster endpoints (one for each supported Amazon Web Services Region) that you can use with API calls to the cluster data plane.
 */
export const createCluster: (
  input: CreateClusterRequest,
) => effect.Effect<
  CreateClusterResponse,
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
  input: CreateClusterRequest,
  output: CreateClusterResponse,
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
 * Returns information about a safety rule.
 */
export const describeSafetyRule: (
  input: DescribeSafetyRuleRequest,
) => effect.Effect<
  DescribeSafetyRuleResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSafetyRuleRequest,
  output: DescribeSafetyRuleResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Update a safety rule (an assertion rule or gating rule). You can only update the name and the waiting period for a safety rule. To make other updates, delete the safety rule and create a new one.
 */
export const updateSafetyRule: (
  input: UpdateSafetyRuleRequest,
) => effect.Effect<
  UpdateSafetyRuleResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSafetyRuleRequest,
  output: UpdateSafetyRuleResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns an array of all Amazon Route 53 health checks associated with a specific routing control.
 */
export const listAssociatedRoute53HealthChecks: {
  (
    input: ListAssociatedRoute53HealthChecksRequest,
  ): effect.Effect<
    ListAssociatedRoute53HealthChecksResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssociatedRoute53HealthChecksRequest,
  ) => stream.Stream<
    ListAssociatedRoute53HealthChecksResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssociatedRoute53HealthChecksRequest,
  ) => stream.Stream<
    __stringMax36PatternS,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssociatedRoute53HealthChecksRequest,
  output: ListAssociatedRoute53HealthChecksResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "HealthCheckIds",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the tags for a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds a tag to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a safety rule in a control panel. Safety rules let you add safeguards around changing routing control states, and for enabling and disabling routing controls, to help prevent unexpected outcomes.
 *
 * There are two types of safety rules: assertion rules and gating rules.
 *
 * Assertion rule: An assertion rule enforces that, when you change a routing control state, that a certain criteria is met. For example, the criteria might be that at least one routing control state is On after the transaction so that traffic continues to flow to at least one cell for the application. This ensures that you avoid a fail-open scenario.
 *
 * Gating rule: A gating rule lets you configure a gating routing control as an overall "on/off" switch for a group of routing controls. Or, you can configure more complex gating scenarios, for example by configuring multiple gating routing controls.
 *
 * For more information, see Safety rules in the Amazon Route 53 Application Recovery Controller Developer Guide.
 */
export const createSafetyRule: (
  input: CreateSafetyRuleRequest,
) => effect.Effect<
  CreateSafetyRuleResponse,
  InternalServerException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSafetyRuleRequest,
  output: CreateSafetyRuleResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Displays details about a control panel.
 */
export const describeControlPanel: (
  input: DescribeControlPanelRequest,
) => effect.Effect<
  DescribeControlPanelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeControlPanelRequest,
  output: DescribeControlPanelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Displays details about a routing control. A routing control has one of two states: ON and OFF. You can map the routing control state to the state of an Amazon Route 53 health check, which can be used to control routing.
 *
 * To get or update the routing control state, see the Recovery Cluster (data plane) API actions for Amazon Route 53 Application Recovery Controller.
 */
export const describeRoutingControl: (
  input: DescribeRoutingControlRequest,
) => effect.Effect<
  DescribeRoutingControlResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRoutingControlRequest,
  output: DescribeRoutingControlResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing cluster. You can only update the network type of a cluster.
 */
export const updateCluster: (
  input: UpdateClusterRequest,
) => effect.Effect<
  UpdateClusterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterRequest,
  output: UpdateClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a control panel. The only update you can make to a control panel is to change the name of the control panel.
 */
export const updateControlPanel: (
  input: UpdateControlPanelRequest,
) => effect.Effect<
  UpdateControlPanelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateControlPanelRequest,
  output: UpdateControlPanelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a routing control. You can only update the name of the routing control. To get or update the routing control state, see the Recovery Cluster (data plane) API actions for Amazon Route 53 Application Recovery Controller.
 */
export const updateRoutingControl: (
  input: UpdateRoutingControlRequest,
) => effect.Effect<
  UpdateRoutingControlResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRoutingControlRequest,
  output: UpdateRoutingControlResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a control panel.
 */
export const deleteControlPanel: (
  input: DeleteControlPanelRequest,
) => effect.Effect<
  DeleteControlPanelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteControlPanelRequest,
  output: DeleteControlPanelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a routing control.
 */
export const deleteRoutingControl: (
  input: DeleteRoutingControlRequest,
) => effect.Effect<
  DeleteRoutingControlResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRoutingControlRequest,
  output: DeleteRoutingControlResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns an array of all the clusters in an account.
 */
export const listClusters: {
  (
    input: ListClustersRequest,
  ): effect.Effect<
    ListClustersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClustersRequest,
  ) => stream.Stream<
    ListClustersResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClustersRequest,
  ) => stream.Stream<
    Cluster,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClustersRequest,
  output: ListClustersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Clusters",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns an array of control panels in an account or in a cluster.
 */
export const listControlPanels: {
  (
    input: ListControlPanelsRequest,
  ): effect.Effect<
    ListControlPanelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListControlPanelsRequest,
  ) => stream.Stream<
    ListControlPanelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListControlPanelsRequest,
  ) => stream.Stream<
    ControlPanel,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListControlPanelsRequest,
  output: ListControlPanelsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ControlPanels",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns an array of routing controls for a control panel. A routing control is an Amazon Route 53 Application Recovery Controller construct that has one of two states: ON and OFF. You can map the routing control state to the state of an Amazon Route 53 health check, which can be used to control routing.
 */
export const listRoutingControls: {
  (
    input: ListRoutingControlsRequest,
  ): effect.Effect<
    ListRoutingControlsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRoutingControlsRequest,
  ) => stream.Stream<
    ListRoutingControlsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRoutingControlsRequest,
  ) => stream.Stream<
    RoutingControl,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRoutingControlsRequest,
  output: ListRoutingControlsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RoutingControls",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Delete a cluster.
 */
export const deleteCluster: (
  input: DeleteClusterRequest,
) => effect.Effect<
  DeleteClusterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Display the details about a cluster. The response includes the cluster name, endpoints, status, and Amazon Resource Name (ARN).
 */
export const describeCluster: (
  input: DescribeClusterRequest,
) => effect.Effect<
  DescribeClusterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterRequest,
  output: DescribeClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new control panel. A control panel represents a group of routing controls that can be changed together in a single transaction. You can use a control panel to centrally view the operational status of applications across your organization, and trigger multi-app failovers in a single transaction, for example, to fail over an Availability Zone or Amazon Web Services Region.
 */
export const createControlPanel: (
  input: CreateControlPanelRequest,
) => effect.Effect<
  CreateControlPanelResponse,
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
  input: CreateControlPanelRequest,
  output: CreateControlPanelResponse,
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
 * Creates a new routing control.
 *
 * A routing control has one of two states: ON and OFF. You can map the routing control state to the state of an Amazon Route 53 health check, which can be used to control traffic routing.
 *
 * To get or update the routing control state, see the Recovery Cluster (data plane) API actions for Amazon Route 53 Application Recovery Controller.
 */
export const createRoutingControl: (
  input: CreateRoutingControlRequest,
) => effect.Effect<
  CreateRoutingControlResponse,
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
  input: CreateRoutingControlRequest,
  output: CreateRoutingControlResponse,
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
